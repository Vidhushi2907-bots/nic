require('dotenv').config()
const response = require('../_helpers/response')
const status = require('../_helpers/status.conf')
const db = require("../models");
const paginateResponse = require("../_utility/generate-otp");
let Validator = require('validatorjs');
const stateModel = db.stateModel;
const districtModel = db.districtModel;
const userModel = db.userModel;
const allocationToIndentorForLiftingBreederseedsModel = db.allocationToIndentorForLiftingBreederseedsModel;
const indentOfBreederseedModel = db.indentOfBreederseedModel;
const directIndent = db.directIndent;
// const cropModel = db.cropModel;
const varietyModel = db.varietyModel


const cropVerietyModel = db.cropVerietyModel;


const SeedUserManagement = require('../_helpers/create-user')
const labelNumberForBreederseed = db.labelNumberForBreederseed
const generatedLabelNumberModel = db.generatedLabelNumberModel
const cropGroupModel = db.cropGroupModel
const masterHelper = require('../_helpers/masterhelper')
const JWT = require('jsonwebtoken')
require('dotenv').config()
const Token = db.tokens;

const jwt = require('jsonwebtoken');
const axios = require('axios').default;

const sequelize = require('sequelize');
const sequelizer = require("../models/db");
const ConditionCreator = require('../_helpers/condition-creator');
const { where, QueryTypes } = require('sequelize');
const { condition } = require('sequelize');
const e = require('express');
const AES = require('../_helpers/AES');
const crypto = require("crypto");
const https = require("https");
const Sequelize = require('sequelize');


class VarietyController {

  static viewCropVariety = async (req, res) => {
    try {
      let condition = {
        include: [
          {
            where: {},
            required: false,
            model: db.srp_varietyModel,
            attributes: [],
          },
        ],
        where: {},
        attributes: [
          "variety_name",
          "notification_year", "variety_code",
          [sequelize.col("seed_rolling_plan_variety_wise.created_at"), "createdAt"],
          [sequelize.col("seed_rolling_plan_variety_wise.updated_at"), "updatedAt"],
          [sequelize.col("seed_rolling_plan_variety_wise.srp_crop_wise_id"), "srp_crop_wise_id"],
          [sequelize.col("seed_rolling_plan_variety_wise.is_final_submit"), "is_final_submit"],
          [sequelize.col("seed_rolling_plan_variety_wise.is_draft"), "is_draft"],
          [sequelize.col("seed_rolling_plan_variety_wise.is_active"), "is_active"],
          [sequelize.col("seed_rolling_plan_variety_wise.breeder_seed"), "breeder_seed"],
          [sequelize.col("seed_rolling_plan_variety_wise.foundation_seed"), "foundation_seed"],
          [sequelize.col("seed_rolling_plan_variety_wise.required_qty_of_certified_seeds"), "required_qty_of_certified_seeds"],
          [sequelize.col("seed_rolling_plan_variety_wise.id"), "id"],
        ],
        raw: true,
      };

      const search = req.query;

      // 🧩 Filter Conditions
      if (search) {
        if (search.srp_crop_wise_id !== undefined && search.srp_crop_wise_id !== "") {
          condition.include[0].where.srp_crop_wise_id = search.srp_crop_wise_id.toString();
        }
        if (search.crop_code !== undefined && search.crop_code !== "") {
          condition.where.crop_code = search.crop_code.toString();
        }
      }

      // Pagination Logic
      // default: page 1, limit 10
      const page = parseInt(search.page) || 1;
      const limit = parseInt(search.limit) || 20;
      const offset = (page - 1) * limit;

      condition.limit = limit;
      condition.offset = offset;

      // ⚡ Execute
      const data = await db.varietyModel.findAll(condition);

      if (data && data.length > 0) {
        response(res, status.DATA_AVAILABLE, 200, data);
      } else {
        response(res, status.DATA_NOT_AVAILABLE, 404, []);
      }
    } catch (error) {
      console.error("Error in viewCropVariety:", error);
      response(res, status.DATA_NOT_AVAILABLE, 500);
    }
  };

  static viewCrop = async (req, res) => {
    try {

      let condition = {
        include: [
          {
            required: true,
            model: db.cropModel,
            attributes: ['crop_name'],
          }
        ],
        where: {},
        atrributes: [],
        raw: true,
      };

      const search = req.query;
      if (search) {
        if (search.is_active !== undefined && search.is_active !== '') {
          condition.where.is_active = search.is_active.toString();
        }

        if (search.crop_code && search.crop_code.trim() !== '') {
          condition.where.crop_code = {
            [Sequelize.Op.eq]: search.crop_code
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


  // Save / Draft Variety Data
  static createVariety = async (req, res) => {
    try {
      const { variety_wise_array } = req.body;

      if (!Array.isArray(variety_wise_array) || variety_wise_array.length === 0) {
        return response(res, status.PARAMS_MISSING, 400, "No variety data provided");
      }

      // ⭐ Correct: Read from frontend values
      const isDraft = variety_wise_array[0]?.is_draft === 1 ? 1 : 0;
      const isFinalSubmit = variety_wise_array[0]?.is_final_submit === 1 ? 1 : 0;

      const results = [];

      for (const variety of variety_wise_array) {
        const {
          id,
          crop_code,
          variety_code,
          required_qty_of_certified_seeds,
          foundation_seed,
          breeder_seed,
          is_active,
          srp_crop_wise_id
        } = variety;

        const requiredQty = Number(required_qty_of_certified_seeds ?? 0);
        const foundationSeed = Number(foundation_seed ?? 0);
        const breederSeed = Number(breeder_seed ?? 0);

        if (requiredQty === 0 && foundationSeed === 0 && breederSeed === 0) {
          if (id) {
            await db.srp_varietyModel.destroy({ where: { id } });
            results.push({ deleted: true, id });
          }
          continue;
        }

        const activeFlag = id ? (is_active ?? 1) : 1;
        const isRowLocked = activeFlag == 0 ? 1 : 0;

        const dataRow = {
          crop_code,
          variety_code,
          required_qty_of_certified_seeds: requiredQty,
          foundation_seed: foundationSeed,
          breeder_seed: breederSeed,
          is_active: activeFlag,
          is_row_locked: isRowLocked,

          // ⭐ Correct saving
          is_draft: isDraft,
          is_final_submit: isFinalSubmit,

          srp_crop_wise_id: srp_crop_wise_id || null,
          user_id: 560
        };

        let saved;
        if (id) {
          await db.srp_varietyModel.update(dataRow, { where: { id } });
          saved = await db.srp_varietyModel.findOne({ where: { id } });
        } else {
          saved = await db.srp_varietyModel.create(dataRow);
        }

        results.push(saved);
      }

      return response(res, status.DATA_SAVED, 200, {
        message: isFinalSubmit ? "Variety data finalized successfully" : "Variety data saved as draft successfully",
        count: results.length,
        data: results,
      });

    } catch (error) {
      console.error("❌ Error in createVariety:", error);
      return response(res, status.DATA_NOT_AVAILABLE, 500, error.message);
    }
  };





}
module.exports = VarietyController
