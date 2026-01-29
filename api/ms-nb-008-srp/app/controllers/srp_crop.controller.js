require('dotenv').config()
const response = require('../_helpers/response')
const status = require('../_helpers/status.conf')
const db = require("../models");
const paginateResponse = require("../_utility/generate-otp");
let Validator = require('validatorjs');
const SeedUserManagement = require('../_helpers/create-user')
const cropGroupModel = db.cropGroupModel
const masterHelper = require('../_helpers/masterhelper')
const JWT = require('jsonwebtoken')
require('dotenv').config()
const Token = db.tokens;
const jwt = require('jsonwebtoken');
const axios = require('axios').default;
const sequelize = require('sequelize');
const Sequelize = require('sequelize');
const { Op, literal, Model, NOW } = require("sequelize");

class CropController {
  //get-crop
  static getCropWiseData = async (req, res) => {
    try {
      const data = await db.cropModel.findAll({
        attributes: [
          "id",
          "crop_code",
          "crop_name",
          "srr",
          "seed_rate",
          "is_active",
          "group_code",
        ],
        include: [
          {
            model: db.srpCropModel,
            attributes: [
              "total_required",
              "year",
              "season",
              "total_area",
              "is_draft",
              "is_final_submit",
            ],
            required: false,
          },
        ],
        raw: true,           // 🔹 flattens result
        nest: false,         // ensures no nested objects
      });

      if (data && data.length > 0) {
        // Optional: rename keys to include '.' prefix
        const formattedData = data.map((item) => ({
          id: item.id,
          crop_code: item.crop_code,
          crop_name: item.crop_name,
          srr: item.srr,
          seed_rate: item.seed_rate,
          is_active: item.is_active,
          group_code: item.group_code,
          "total_required": item["srpCropModel.total_required"] || null,
          "year": item["srpCropModel.year"] || null,
          "season": item["srpCropModel.season"] || null,
          "total_area": item["srpCropModel.total_area"] || null,
          "is_draft": item["srpCropModel.is_draft"] || null,
          "is_final_submit": item["srpCropModel.is_final_submit"] || null,
        }));

        response(res, status.DATA_AVAILABLE, 200, formattedData);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 404, []);
      }
    } catch (error) {
      console.error("Error in getCropWiseData:", error);
      response(res, status.DATA_NOT_AVAILABLE, 500);
    }
  };

  //save as draft and final submit
  static postSrpCropWiseData = async (req, res) => {
    try {
      const { cropData, action, } = req.body; // Expecting payload from frontend
      const user_id = req.body?.loginedUserid?.id
      const userData = await db.userModel.findOne({
        where: { id: user_id }
      })
      console.log(userData, "userData........................")
      if (userData.user_type === "IN") {
        // 1️⃣ Fetch all crops with optional SRP
        // info


        const data = await db.cropModel.findAll({
          attributes: ["id", "crop_code", "crop_name", "srr", "seed_rate", "is_active", "group_code"],
          include: [
            {
              model: db.srpCropModel,
              attributes: ["total_required", "year", "season", "total_area", "is_draft", "is_final_submit"],
              required: false,
            },
          ],
          raw: true,
          nest: false,
        });

        // 2️⃣ Format the fetched data
        console.log("step:2")
        const formattedData = data.map((item) => ({
          id: item.id,
          crop_code: item.crop_code,
          crop_name: item.crop_name,
          srr: item.srr,
          seed_rate: item.seed_rate,
          is_active: item.is_active,
          group_code: item.group_code,
          total_required: item["srpCropModel.total_required"] ?? null,
          year: item["srpCropModel.year"] ?? null,
          season: item["srpCropModel.season"] ?? null,
          total_area: item["srpCropModel.total_area"] ?? null,
          is_draft: item["srpCropModel.is_draft"] ?? null,
          is_final_submit: item["srpCropModel.is_final_submit"] ?? null,
        }));

        if (!formattedData.length) {
          return response(res, status.DATA_NOT_AVAILABLE, 404, []);
        }

        // 3️⃣ Determine flags
        const isDraft = action === "draft" ? 1 : 1;
        const isFinalSubmit = action === "final" ? 1 : 0;

        const savedRecords = [];

        // 4️⃣ Process each crop
        for (const crop of cropData) {
          const { id, crop_code, group_code, year, season, is_active, total_required, total_area, srr, seed_rate } = crop;

          // Check if record already exists
          const existing = await db.srpCropModel.findOne({ where: { crop_code, year, season, user_id } });

          if (!existing) {
            // 4a️⃣ Create new crop
            const newCrop = await db.srpCropModel.create({
              crop_code,
              group_code,
              year,
              season,
              is_active: true,
              total_required,
              total_area,
              srr,
              user_id,
              seed_rate,
              is_draft: isDraft,
              is_final_submit: isFinalSubmit,
            });
            savedRecords.push(newCrop);
          } else {


            await existing.update({
              is_draft: isDraft,
              is_final_submit: isFinalSubmit,
              total_required,
              total_area,
              srr,
              seed_rate,
              is_active: typeof is_active !== 'undefined' ? is_active : existing.is_active,
            });
            savedRecords.push(existing);
          }
        }

        // 5️⃣ Return response
        const message =
          action === "final"
            ? "Crop data finalized successfully"
            : "Crop data saved as draft successfully";

        return response(res, message, 200, savedRecords);
      }
      else {
        return response(res, 'Not Access Other User', 403);
      }
    } catch (error) {
      console.error("Error in postSrpCropWiseData:", error);
      return response(res, status.DATA_NOT_AVAILABLE, 500);
    }
  };

  static getSrpCropWiseDraftData = async (req, res) => {
    try {
      const { year, season, group_code } = req.query; // optional group_code
      const { Op } = require("sequelize");
      const userId = req.body?.loginedUserid?.id;


      // Filter srpCropModel for draft data
      const whereCondition = { user_id: userId };
      if (year) whereCondition.year = year;
      if (season) whereCondition.season = season;

      // Optional cropModel filter
      const cropWhereCondition = {};
      // check srp crop wise exit data
      let existCropData = await db.srpCropModel.findAll(
        {
          attributes: ['crop_code'],
          where: whereCondition,
          raw: true
        }
      )
      const existCropCodes = existCropData.map(item => item.crop_code);
      if (group_code) cropWhereCondition.group_code = group_code;
      if (existCropCodes && existCropCodes.length) cropWhereCondition.crop_code = { [Op.notIn]: existCropCodes };
      const data = await db.cropModel.findAll({
        where: cropWhereCondition,
        // if group_code is undefined, this does nothing → returns all
        include: [
          // {
          //   model: db.srpCropModel,
          //   as: "seed_rolling_plan_crop_wises",
          //   attributes: [
          //     "id", "year", "season", "seed_rate", "total_area",
          //     "total_required", "is_active", "is_draft", "srr",
          //     "is_final_submit", "createdAt", "updatedAt", "user_id"
          //   ],
          //   required: false,
          //   where: whereCondition,
          // },
        ],
        attributes: ["crop_code", "crop_name", "group_code", "srr", "is_active"],
        order: [
          // [{ model: db.srpCropModel, as: "seed_rolling_plan_crop_wises" }, "is_draft", "ASC"],
          ["crop_name", "ASC"],
        ],
      });

      if (!data?.length) return response(res, status.DATA_NOT_AVAILABLE, 404, []);
      const formattedData = data.map((item) => {
        const srp = item.seed_rolling_plan_crop_wises?.[0] || {};
        return {
          id: srp.id,
          year: srp.year || null,
          season: srp.season || null,
          group_code: item.group_code || null,
          crop_code: item.crop_code || null,
          crop_name: item.crop_name || null,
          srr: srp.srr ?? item.srr,
          seed_rate: srp.seed_rate || null,
          total_area: srp.total_area || null,
          total_required: srp.total_required || null,
          is_active: srp.is_active ?? item.is_active,
          is_draft: srp.is_draft || null,
          is_final_submit: srp.is_final_submit || null,
          createdAt: srp.createdAt || null,
          updatedAt: srp.updatedAt || null,
          user_id: srp.user_id
        };
      });

      response(res, status.DATA_AVAILABLE, 200, formattedData);
    } catch (error) {
      console.error("❌ Error in getSrpCropWiseDraftData:", error);
      response(res, status.DATA_NOT_AVAILABLE, 500, { message: error.message });
    }
  };

  static editSrpCropWiseData = async (req, res) => {
    try {
      const { id } = req.params;
      const { total_required,
        total_area,
        srr,
        seed_rate,
        is_active } = req.body;

      // Update record
      const [updatedCount] = await db.srpCropModel.update(
        {
          total_required,
          total_area,
          srr,
          seed_rate, is_active
        },
        { where: { id } }
      );

      // If no rows updated
      if (updatedCount === 0) {
        return response(res, status.DATA_NOT_FOUND, 404, null);
      }

      // ✅ Fetch the updated record correctly
      const updatedData = await db.srpCropModel.findOne({ where: { id } });

      console.log(updatedData, 'updated record');

      if (updatedData) {
        response(res, status.DATA_UPDATED, 200, updatedData);
      }
    } catch (error) {
      console.error('Error in edit:', error);
      response(res, status.DATA_NOT_SAVE, 500);
    }
  };
  //Delete Srp Crop data
  static deleteSrpCropWiseData = async (req, res) => {
    try {
      const { id } = req.params;

      const srpCropWiseData = await db.srpCropModel.findOne({ where: { id } });

      if (!srpCropWiseData) {
        return response(res, status.DATA_NOT_FOUND, 404, null);
      }

      const data = await srpCropModel.destroy({ where: { id } });

      response(res, status.DATA_DELETED, 200, data);
    } catch (error) {
      console.error(error);
      response(res, status.DATA_NOT_AVAILABLE, 500);
    }

  }

  //find one
  static findOneSrpCropWise = async (req, res) => {
    try {
      const { id } = req.params; // you can find by ID from URL param

      const data = await db.srpCropModel.findOne({ where: { id } });

      if (!data) {
        return response(res, status.DATA_NOT_FOUND, 404, null);
      }

      response(res, status.DATA_AVAILABLE, 200, data);
    } catch (error) {
      console.error(error);
      response(res, status.DATA_NOT_AVAILABLE, 500);
    }
  };

  static viewCrop = async (req, res) => {
    try {
      [sequelize.col('m_crop.crop_name'), 'crop_name']
      let condition = {
        include: [
          {
            required: true,
            model: db.cropModel,

            attributes: ['crop_name'],
          }
        ],
        where: {},
        atrributes: [

        ],
        raw: true,
        //   order: [['crop_code', 'ASC']],
      };

      // For GET, we use req.query instead of req.body
      const search = req.query;

      if (search) {
        // ✅ Active/Inactive (varchar type)
        if (search.is_active !== undefined && search.is_active !== '') {
          condition.where.is_active = search.is_active.toString();
        }

        // ✅ crop_code (case-insensitive)
        if (search.crop_code && search.crop_code.trim() !== '') {
          condition.where.crop_code = {
            [Sequelize.Op.iLike]: `%${search.crop_code.trim()}%`

          };
        }

        // ✅ ID (exact match)
        if (search.id && !isNaN(search.id)) {
          condition.where.id = parseInt(search.id);
        }
      }
      // condition
      const data = await db.srp_cropModel.findAll(condition);


      if (data && data.length > 0) {
        response(res, status.DATA_AVAILABLE, 200, data);
      } else {
        response(res, status.DATA_NOT_AVAILABLE, 404, []);
      }

    } catch (error) {
      console.error('Error in cropVariety:', error);
      response(res, status.DATA_NOT_AVAILABLE, 500);
    }
  };

  static getCropGroupData = async (req, res) => {
    try {
      const { year, season } = req.query;

      // Check if final submit exists
      const finalSubmit = await db.srpCropModel.findOne({
        where: { year, season, is_final_submit: true }
      });

      if (false) {
        const filteredGroupData = await db.cropGroupModel.findAll({
          attributes: ['group_code', 'group_name'], // ✅ only these fields
          include: [
            {
              model: db.srpCropModel,
              as: "seed_rolling_plan_crop_wises",
              required: true,   // INNER JOIN --> only submitted groups
              attributes: [],
              where: {
                year,
                season,
                is_final_submit: true
              }
            }
          ]
        });

        return response(res, status.DATA_AVAILABLE, 200, filteredGroupData);
      }
      else {
        const allGroups = await db.cropGroupModel.findAll({
          attributes: ['group_code', 'group_name'] // ✅ only these fields
        });

        return response(res, status.DATA_AVAILABLE, 200, allGroups);
      }

    } catch (err) {
      console.log(err, "err");
      return response(res, status.DATA_NOT_AVAILABLE, 500);
    }
  };

  static addToListData = async (req, res) => {
    try {
      const user_id = req.body?.loginedUserid?.id
      const { year, season,group_code } = req.body.search;
      let groupCode;
      if(group_code) groupCode = {group_code:group_code}
      const addToListData = await db.srpCropModel.findAll({
        include: [
          {
            model: db.cropModel,
            attributes: []
          }
        ],
        where: { year, season: { [Op.iLike]: `${season}%` }, is_draft: true, user_id,...groupCode },
        attributes: [
          "*", [sequelize.col('m_crop.crop_name'), 'crop_name']
        ],
        raw: true,
        order: [
          ['is_final_submit', 'ASC'], // false first
          [sequelize.col('m_crop.crop_name'), 'ASC'] // name ascending
        ],
      });
      if (addToListData && addToListData.length) {
        return response(res, status.DATA_AVAILABLE, 200, addToListData);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, []);
      }
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }

  static addToListDataRemove = async (req, res) => {
    try {
      const id = Number(req.query.id);
      const deleted = await db.srpCropModel.destroy({
        where: { id: id }
      });

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Record not found'
        });
      }
      res.json({
        status_code: 200,
        success: true,
        message: 'Record deleted successfully'
      });
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }
  static submitForFillingVarietyData = async (req, res) => {
    try {
      const { ids } = req.body; // [1,2,3,4]

      if (!Array.isArray(ids) || !ids.length) {
        return res.status(400).json({
          success: false,
          message: 'Valid ids array required'
        });
      }

      const updated = await db.srpCropModel.update(
        {
          is_final_submit: true,
          is_draft: true
        },
        {
          where: {
            id: ids // Sequelize auto IN clause
          }
        }
      );
      res.json({
        success: true,
        message: 'Final submit done',
        updatedCount: updated[0]
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}
module.exports = CropController
