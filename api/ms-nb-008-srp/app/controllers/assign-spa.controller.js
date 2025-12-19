const { Op, literal, Sequelize, NUMBER } = require("sequelize");
const db = require("../models");
const response = require('../_helpers/response')
const status = require('../_helpers/status.conf')
const userModel = db.userModel;
const srpCropWise = db.seedRollingPlanCropWisesModel;
const cropModel = db.cropModel
const agencyDetail = db.agencyDetailModel

class SrpWillingnessController {

  static getSrpVarietyAssignBySpa = async (req, res) => {
    try {
      // 1️⃣ Get final submitted replanning data
      const { year, season, crop_code } = req.query;
      console.log(year, season, crop_code, "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwww")
      const crop_wise = await db.srpCropModel.findOne({
        where: { year: year, season: season, crop_code: crop_code }
      });
      if (!crop_wise) {
        return response(
          res,
          status.DATA_NOT_FOUND,
          400,
          []
        );
      }
      const replanningData = await db.srpStateReplanningModel.findAll({
        where: { is_final_submit: true, is_available: true, srp_crop_wise_id: crop_wise.id },
        include: [{
          model: db.srpVarietyModel,
          required: true,
          include: [{
            model: db.varietyModel,
            required: true,
            attributes: ["variety_name"]

          }],
          attributes: ["variety_code",]
        }],
        attributes: ["quantity"],
        raw: true
      });
      const newVarieties = await db.srpStateReplanningNewVarietiesModel.findAll({
        where: { is_final_submit: true, is_accept: true, srp_crop_wise_id: crop_wise.id },

        include: [{
          model: db.varietyModel,
          required: true,
          attributes: ["variety_name", "variety_code"]
        }],
        attributes: ["quantity_required", "quantity_available"],
        raw: true
      });

      const replaceVarieties =
        await db.srpStateReplanningReplaceVaritiesModel.findAll({
          where: {
            is_final_submit: true,
            is_accept: true
          },
          include: [
            {
              model: db.srpStateReplanningModel,
              required: true,
              where: {
                srp_crop_wise_id: crop_wise.id
              },
              attributes: ["srp_crop_wise_id"],
            },

            {
              model: db.varietyModel,
              required: true,
              attributes: ["variety_name"]
            }


          ],
          attributes: ["replace_quantity", "replace_variety_code"]
        });

      const baseData = replanningData.map(item => {


        return {
          variety_code: item['seed_rolling_plan_variety_wise.variety_code'],
          variety_name: item['seed_rolling_plan_variety_wise.m_crop_variety.variety_name'],
          quantity: item.quantity,
          foundation_seed: item['seed_rolling_plan_variety_wise.foundation_seed'],
          required_qty_of_certified_seeds:
            item['seed_rolling_plan_variety_wise.foundation_seed']
        };
      });

      const newData = newVarieties.map(item => {

        return {
          variety_code: item['m_crop_variety.variety_code'],
          variety_name: item['m_crop_variety.variety_name'],
          quantity: item.quantity_required,
          quantity_available: item.quantity_available
        }
      });

      const replaceData = replaceVarieties.map(item => {
        console.log(item, "item");

        return {
          variety_code: item.replace_variety_code, // agar available ho
          variety_name: item.m_crop_variety?.variety_name,
          quantity: item.replace_quantity
        };
      });

      const finalData = [
        ...baseData,
        ...newData,
        ...replaceData
      ];

      return response(
        res,
        status.DATA_AVAILABLE,
        200,
        finalData
      );

    } catch (error) {
      console.error(error);
      return response(
        res,
        status.ERROR,
        500,

      );
    }
  };
  static getSrpSpaStateId = async (req, res) => {
    try {
      const userId = req.body?.loginedUserid?.id;
      const userData = await userModel.findOne({
        where: { id: userId, user_type: "IN" },
        include: [
          {
            model: db.agencyDetailModel,
            required: true,
            attributes: ["state_id", "user_id"]
          }
        ],

      });
      console.log
      const formattedData = userData
        ? {
          user_id: userData.agency_detail.user_id,
          state_code: userData.agency_detail.state_id
        }
        : null;
      return response(
        res,
        status.DATA_AVAILABLE,
        200,
        formattedData
      );
    }

    catch (error) {
      console.error("Error in postSrpCropWiseData:", error);
      return response(res, status.DATA_NOT_AVAILABLE, 500);

    }
  }
  static postSrpSpaData = async (req, res) => {
    try {
      const { spaDetails, year, season, crop_code, action } = req.body;

      const isDraft = action === "draft" ? 1 : 0;
      const isFinalSubmit = action === "final" ? 1 : 0;

      const savedRecords = [];

      for (const crop of spaDetails) {
        const {
          variety_code,
          breeder_seed,
          foundation_seed,
          certified_seed,
          assign_spa = []
        } = crop;

        // 1️⃣ Find or Create SRP Willingness
        let srpRecord = await db.srpCropVarietyFinalModel.findOne({
          where: { year, season, crop_code, variety_code }
        });

        if (!srpRecord) {
          srpRecord = await db.srpCropVarietyFinalModel.create({
            crop_code,
            variety_code,
            year,
            season,
            foundation_seed,
            certified_seed,
            breeder_seed,
            is_draft: isDraft,
            is_final_submit: isFinalSubmit
          });
        } else {
          await srpRecord.update({
            foundation_seed,
            certified_seed,
            breeder_seed,
            is_draft: isDraft,
            is_final_submit: isFinalSubmit
          });
        }

        savedRecords.push(srpRecord);
        for (const spa of assign_spa) {
          const {
            spa_user_id,
            certified_seed_quantity,

          } = spa;
          const assignSpa = await db.srpAssignSpaModel.findOne({
            where: { srp_final_id, spa_user_id, is_active: true }
          })
          if (!assignSpa) {
            await db.srpAssignSpaModel.create({
              srp_final_id: srpRecord.id,
              spa_user_id,
              certified_seed_quantity,
              is_active: true
            });
          }
          else {
            await assignSpa.update(
              { certified_seed_quantity, spa_user_id },
              { where: { srp_final_id: srpRecord.id } }
            );
          }
        }
      }

      const message =
        action === "final"
          ? "Crop data finalized successfully"
          : "Crop data saved as draft successfully";

      return response(res, message, 200, savedRecords);

    } catch (error) {
      console.error("Error in postSrpWillingnessData:", error);
      return response(res, status.DATA_NOT_AVAILABLE, 500);
    }
  };

}
module.exports = SrpWillingnessController
