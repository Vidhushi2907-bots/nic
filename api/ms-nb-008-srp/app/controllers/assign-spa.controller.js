const { Op, literal, Sequelize, NUMBER } = require("sequelize");
const db = require("../models");
const response = require('../_helpers/response')
const status = require('../_helpers/status.conf')
const userModel = db.userModel;
const srpCropWise = db.seedRollingPlanCropWisesModel;
const cropModel = db.cropModel
const agencyDetail = db.agencyDetailModel

class SrpWillingnessController {

  // static getSrpVarietyAssignBySpa = async (req, res) => {
  //   try {
  //     // 1️⃣ Get final submitted replanning data
  //     const { year, season, crop_code } = req.query;
  //     console.log(year, season, crop_code, "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwww")
  //     const crop_wise = await db.srpCropModel.findOne({
  //       where: { year: year, season: season, crop_code: crop_code }
  //     });
  //     if (!crop_wise) {
  //       return response(
  //         res,
  //         status.DATA_NOT_FOUND,
  //         400,
  //         []
  //       );
  //     }
  //     const replanningData = await db.srpStateReplanningModel.findAll({
  //       where: { is_final_submit: true, is_available: true, srp_crop_wise_id: crop_wise.id },
  //       include: [{
  //         model: db.srpVarietyModel,
  //         required: true,
  //         include: [{
  //           model: db.varietyModel,
  //           required: true,
  //           attributes: ["variety_name"]

  //         }],
  //         attributes: ["variety_code",]
  //       }],
  //       attributes: ["quantity"],
  //       raw: true
  //     });
  //     const newVarieties = await db.srpStateReplanningNewVarietiesModel.findAll({
  //       where: { is_final_submit: true, is_accept: true, srp_crop_wise_id: crop_wise.id },

  //       include: [{
  //         model: db.varietyModel,
  //         required: true,
  //         attributes: ["variety_name", "variety_code"]
  //       }],
  //       attributes: ["quantity_required", "quantity_available"],
  //       raw: true
  //     });

  //     const replaceVarieties =
  //       await db.srpStateReplanningReplaceVaritiesModel.findAll({
  //         where: {
  //           is_final_submit: true,
  //           is_accept: true
  //         },
  //         include: [
  //           {
  //             model: db.srpStateReplanningModel,
  //             required: true,
  //             where: {
  //               srp_crop_wise_id: crop_wise.id
  //             },
  //             attributes: ["srp_crop_wise_id"],
  //           },

  //           {
  //             model: db.varietyModel,
  //             required: true,
  //             attributes: ["variety_name"]
  //           }


  //         ],
  //         attributes: ["replace_quantity", "replace_variety_code"]
  //       });

  //     const baseData = replanningData.map(item => {


  //       return {
  //         variety_code: item['seed_rolling_plan_variety_wise.variety_code'],
  //         variety_name: item['seed_rolling_plan_variety_wise.m_crop_variety.variety_name'],
  //         quantity: item.quantity,
  //         foundation_seed: item['seed_rolling_plan_variety_wise.foundation_seed'],
  //         required_qty_of_certified_seeds:
  //           item['seed_rolling_plan_variety_wise.foundation_seed']
  //       };
  //     });

  //     const newData = newVarieties.map(item => {

  //       return {
  //         variety_code: item['m_crop_variety.variety_code'],
  //         variety_name: item['m_crop_variety.variety_name'],
  //         quantity: item.quantity_required,
  //         quantity_available: item.quantity_available
  //       }
  //     });

  //     const replaceData = replaceVarieties.map(item => {
  //       console.log(item, "item");

  //       return {
  //         variety_code: item.replace_variety_code, // agar available ho
  //         variety_name: item.m_crop_variety?.variety_name,
  //         quantity: item.replace_quantity
  //       };
  //     });

  //     const finalData = [
  //       ...baseData,
  //       ...newData,
  //       ...replaceData
  //     ];

  //     return response(
  //       res,
  //       status.DATA_AVAILABLE,
  //       200,
  //       finalData
  //     );

  //   } catch (error) {
  //     console.error(error);
  //     return response(
  //       res,
  //       status.ERROR,
  //       500,

  //     );
  //   }
  // };
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
        const assignSpaArray = Array.isArray(assign_spa)
          ? assign_spa
          : [];

        for (const spa of assignSpaArray) {
          const {
            spa_user_id,
            certified_seed_quantity,

          } = spa;
          const assignSpa = await db.srpAssignSpaModel.findOne({
            where: { srp_final_id: srpRecord.id, spa_user_id, is_active: true }
          })
          if (!assignSpa) {
            await db.srpAssignSpaModel.create({
              srp_final_id: srpRecord.id,
              spa_user_id,
              certified_seed_quantity,
              is_active: true,
              is_draft: isDraft,
              is_final_submit: isFinalSubmit
            });
          }
          else {
            await assignSpa.update(
              {
                certified_seed_quantity, spa_user_id, is_draft: isDraft,
                is_final_submit: isFinalSubmit
              },
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
  static getCropName = async (req, res) => {
    try {
      const { crop_code } = req.query;
      const data = await db.cropModel.findOne({
        where: { crop_code: crop_code },
        attributes: ["crop_name"]
      })

      return response(res, status.DATA_AVAILABLE, 200, data);
    } catch (error) {

    }
  }
  static deleteSrpSpa = async (req, res) => {
    try {
      const { id } = req.query;

      // Check if exists
      const data = await db.srpAssignSpaModel.findOne({
        where: { id }
      });


      if (!data) {
        return response(res, "Not Found", 404, []);
      }

      // Update is_active
      const updateData = await db.srpAssignSpaModel.update(
        { is_active: false },     // values to update
        { where: { id } }         // condition
      );
      if (updateData[0] === 0) {
        return response(res, "Already Inactive or is_additional = false", 400, []);
      }

      return response(res, "Data Deleted Successfully!", 200, updateData);

    } catch (error) {
      console.log(error);
      return response(res, "Something went wrong", 500, []);
    }
  }

  static getSrpVarietyAssignBySpa = async (req, res) => {
    const { year, season, crop_code } = req.query;
    const userId = req.body?.loginedUserid?.id;

    const user = await userModel.findOne({
      where: { id: userId, user_type: "IN" },
    });

    if (!user) {
      return response(res, status.DATA_NOT_AVAILABLE, 404, []);
    }


    const replanningExists = await db.srpCropVarietyFinalModel.findOne({
      where: { year: year, season: season, crop_code: crop_code }
    })

    if (replanningExists) {
      // 🔵 CASE 2: Replanning Already Saved
      const result = await getSrpSpaData(year, season, crop_code);
      return response(res, "Replanning Data Available", 200, result);
    } else {
      // 🟢 CASE 1: Fresh Load (No replanning yet)
      const result = await getSrpFreshData(year, season, crop_code);
      return response(res, "Fresh Data Available", 200, result);
    }
  }

}
async function getSrpFreshData(year, season, crop_code) {

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
      breeder_seed: item.quantity,

    };
  });

  const newData = newVarieties.map(item => {

    return {
      variety_code: item['m_crop_variety.variety_code'],
      variety_name: item['m_crop_variety.variety_name'],
      breeder_seed: item.quantity_required,
      quantity_available: item.quantity_available
    }
  });

  const replaceData = replaceVarieties.map(item => {
    console.log(item, "item");

    return {
      variety_code: item.replace_variety_code, // agar available ho
      variety_name: item.m_crop_variety?.variety_name,
      breeder_seed: item.replace_quantity
    };
  });

  const finalData = [
    ...baseData,
    ...newData,
    ...replaceData
  ];

  return finalData;
}

async function getSrpSpaData(year, season, crop_code) {

  const srpFinalData = await db.srpCropVarietyFinalModel.findAll({
    where: { year, season, crop_code },
    include: [{
      model: db.varietyModel,
      attributes: ["id", "variety_code", "variety_name"]
    }],
    attributes: ["id", "crop_code", "variety_code", "breeder_seed", "foundation_seed", "certified_seed", "is_draft", "is_final_submit"],
    raw: true
  });

  const srpFinalIds = srpFinalData.map(d => d.id);
  const spaAssignData = await db.srpAssignSpaModel.findAll({
    where: {
      srp_final_id: srpFinalIds,
      is_active: true
    },
    include: [{
      model: db.agencyDetailModel,
      attributes: ["user_id", "agency_name"],
      required: true
    }],


    raw: true
  });

  const result = srpFinalData.map(final => {
    console.log(final, "result")
    return {

      id: final.id,
      crop_code: final.crop_code,
      variety_code: final.variety_code,
      variety_name: final['m_crop_variety.variety_name'] || null,
      breeder_seed: final.breeder_seed,
      foundation_seed: final.foundation_seed,
      certified_seed: final.certified_seed,
      is_draft: final.is_draft,
      is_final_submit: final.is_final_submit,
      assign_spa: spaAssignData
        .filter(spa => spa.srp_final_id === final.id)
        .map(spa => ({
          id: spa.id,
          spa_user_id: spa.spa_user_id,
          spa_name: spa['agency_detail.agency_name'],
          certified_seed_quantity: spa.certified_seed_quantity
        }))
    };
  });
  return result;



}


module.exports = SrpWillingnessController
