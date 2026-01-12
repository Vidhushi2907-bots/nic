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
  //rupa code
  // static viewCropVariety = async (req, res) => {
  //   try {
  //     let condition = {
  //       include: [
  //         {
  //           where: {},
  //           required: false,
  //           model: db.srp_varietyModel,
  //           attributes: [],
  //         },
  //       ],
  //       where: {},
  //       attributes: [
  //         "variety_name",
  //         "notification_year", "variety_code",
  //         [sequelize.col("seed_rolling_plan_variety_wise.created_at"), "createdAt"],
  //         [sequelize.col("seed_rolling_plan_variety_wise.updated_at"), "updatedAt"],
  //         [sequelize.col("seed_rolling_plan_variety_wise.srp_crop_wise_id"), "srp_crop_wise_id"],
  //         [sequelize.col("seed_rolling_plan_variety_wise.is_final_submit"), "is_final_submit"],
  //         [sequelize.col("seed_rolling_plan_variety_wise.is_draft"), "is_draft"],
  //         [sequelize.col("seed_rolling_plan_variety_wise.is_active"), "is_active"],
  //         [sequelize.col("seed_rolling_plan_variety_wise.breeder_seed"), "breeder_seed"],
  //         [sequelize.col("seed_rolling_plan_variety_wise.foundation_seed"), "foundation_seed"],
  //         [sequelize.col("seed_rolling_plan_variety_wise.required_qty_of_certified_seeds"), "required_qty_of_certified_seeds"],
  //         [sequelize.col("seed_rolling_plan_variety_wise.id"), "id"],
  //       ],
  //       raw: true,
  //     };
 
  //     const search = req.query;
 
  //     // 🧩 Filter Conditions
  //     if (search) {
  //       if (search.srp_crop_wise_id !== undefined && search.srp_crop_wise_id !== "") {
  //         condition.include[0].where.srp_crop_wise_id = search.srp_crop_wise_id.toString();
  //       }
  //       if (search.crop_code !== undefined && search.crop_code !== "") {
  //         condition.where.crop_code = search.crop_code.toString();
  //       }
  //     }
 
  //     // Pagination Logic
  //     // default: page 1, limit 10
  //     const page = parseInt(search.page) || 1;
  //     const limit = parseInt(search.limit) || 20;
  //     const offset = (page - 1) * limit;
 
  //     condition.limit = limit;
  //     condition.offset = offset;
 
  //     // ⚡ Execute
  //     const data = await db.varietyModel.findAll(condition);
 
  //     if (data && data.length > 0) {
  //       response(res, status.DATA_AVAILABLE, 200, data);
  //     } else {
  //       response(res, status.DATA_NOT_AVAILABLE, 404, []);
  //     }
  //   } catch (error) {
  //     console.error("Error in viewCropVariety:", error);
  //     response(res, status.DATA_NOT_AVAILABLE, 500);
  //   }
  // };
 
  // static viewCrop = async (req, res) => {
  //   try {
 
  //     let condition = {
  //       include: [
  //         {
  //           required: true,
  //           model: db.cropModel,
  //           attributes: ['crop_name'],
  //         }
  //       ],
  //       where: {},
  //       atrributes: [],
  //       raw: true,
  //     };
 
  //     const search = req.query;
  //     if (search) {
  //       if (search.is_active !== undefined && search.is_active !== '') {
  //         condition.where.is_active = search.is_active.toString();
  //       }
 
  //       if (search.crop_code && search.crop_code.trim() !== '') {
  //         condition.where.crop_code = {
  //           [Sequelize.Op.eq]: search.crop_code
  //         };
  //       }
 
  //       // ✅ ID (exact match)
  //       if (search.id && !isNaN(search.id)) {
  //         condition.where.id = parseInt(search.id);
  //       }
  //     }
 
  //     // condition
  //     const data = await db.srp_cropModel.findAll(condition);
  //     if (data && data.length > 0) {
  //       response(res, status.DATA_AVAILABLE, 200, data);
  //     } else {
  //       response(res, status.DATA_NOT_AVAILABLE, 404, []);
  //     }
 
  //   } catch (error) {
  //     console.error('Error in cropVariety:', error);
  //     response(res, status.DATA_NOT_AVAILABLE, 500);
  //   }
  // };
 
 
  // Save / Draft Variety Data
  // static createVariety = async (req, res) => {
  //   try {
  //     const { variety_wise_array } = req.body;
 
  //     if (!Array.isArray(variety_wise_array) || variety_wise_array.length === 0) {
  //       return response(res, status.PARAMS_MISSING, 400, "No variety data provided");
  //     }
 
  //     // ⭐ Correct: Read from frontend values
  //     const isDraft = variety_wise_array[0]?.is_draft === 1 ? 1 : 0;
  //     const isFinalSubmit = variety_wise_array[0]?.is_final_submit === 1 ? 1 : 0;
 
  //     const results = [];
 
  //     for (const variety of variety_wise_array) {
  //       const {
  //         id,
  //         crop_code,
  //         variety_code,
  //         required_qty_of_certified_seeds,
  //         foundation_seed,
  //         breeder_seed,
  //         is_active,
  //         srp_crop_wise_id
  //       } = variety;
 
  //       const requiredQty = Number(required_qty_of_certified_seeds ?? 0);
  //       const foundationSeed = Number(foundation_seed ?? 0);
  //       const breederSeed = Number(breeder_seed ?? 0);
 
  //       if (requiredQty === 0 && foundationSeed === 0 && breederSeed === 0) {
  //         if (id) {
  //           await db.srp_varietyModel.destroy({ where: { id } });
  //           results.push({ deleted: true, id });
  //         }
  //         continue;
  //       }
 
  //       const activeFlag = id ? (is_active ?? 1) : 1;
  //       const isRowLocked = activeFlag == 0 ? 1 : 0;
 
  //       const dataRow = {
  //         crop_code,
  //         variety_code,
  //         required_qty_of_certified_seeds: requiredQty,
  //         foundation_seed: foundationSeed,
  //         breeder_seed: breederSeed,
  //         is_active: activeFlag,
  //         is_row_locked: isRowLocked,
 
  //         // ⭐ Correct saving
  //         is_draft: isDraft,
  //         is_final_submit: isFinalSubmit,
 
  //         srp_crop_wise_id: srp_crop_wise_id || null,
  //         user_id: 560
  //       };
 
  //       let saved;
  //       if (id) {
  //         await db.srp_varietyModel.update(dataRow, { where: { id } });
  //         saved = await db.srp_varietyModel.findOne({ where: { id } });
  //       } else {
  //         saved = await db.srp_varietyModel.create(dataRow);
  //       }
 
  //       results.push(saved);
  //     }
 
  //     return response(res, status.DATA_SAVED, 200, {
  //       message: isFinalSubmit ? "Variety data finalized successfully" : "Variety data saved as draft successfully",
  //       count: results.length,
  //       data: results,
  //     });
 
  //   } catch (error) {
  //     console.error("❌ Error in createVariety:", error);
  //     return response(res, status.DATA_NOT_AVAILABLE, 500, error.message);
  //   }
  // };
 
 
  //vidushi code
  static viewCropVariety = async (req, res) => {
    try {
      const { srp_crop_wise_id, type } = req.query;
 
      const getCropCode = await db.srpCropModel.findOne({
        where: { id: srp_crop_wise_id }
      });
 
      if (!getCropCode) {
        return response(res, status.DATA_NOT_FOUND, 404, []);
      }
 
      const whereCond = {
        crop_code: getCropCode.crop_code
      };
 
      const srpWhereCond = {
        srp_crop_wise_id
      };
 
      // 3️⃣ Fetch varieties + SRP variety data
      let data = await db.varietyModel.findAll({
        where: whereCond,
 
        include: [
          {
            model: db.srpVarietyModel,
            as: "seed_rolling_plan_variety_wises", // REQUIRED alias
            required: false,
            where: srpWhereCond,
 
            attributes: [
              "id",
              "srp_crop_wise_id",
              "breeder_seed",
              "foundation_seed",
              "required_qty_of_certified_seeds",
              "is_final_submit",
              "is_draft",
              "is_active",
              "created_at",
              "updated_at"
            ]
          }
        ],
 
        attributes: [
          "variety_name",
          "variety_code",
          "notification_year",
          "crop_code"
        ],
 
        order: [
          [
            { model: db.srpVarietyModel, as: "seed_rolling_plan_variety_wises" },
            "is_draft",
            "ASC"
          ],
          ["variety_code", "ASC"]
        ]
      });
 
 
      if (type === "submit") {
        data = data.filter(v =>
          Array.isArray(v.seed_rolling_plan_variety_wises) &&
          v.seed_rolling_plan_variety_wises.length > 0 &&
          v.seed_rolling_plan_variety_wises[0].is_final_submit === true
        );
 
      }
      // else if (type === "Submit") {
      //   console.log(type,"hello...............................")
      //   data = data.filter(v =>
      //     v.seed_rolling_plan_variety_wises?.is_final_submit === true
      //   );
      // }
 
      return response(res, status.DATA_AVAILABLE, 200, data);
    }
 
 
 
    catch (error) {
      console.error("Error in viewCropVariety:", error);
      return response(res, status.DATA_NOT_AVAILABLE, 500, error.message);
    }
  };
 

  //vidushi code--GET crop data
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
        where: {
          id: Number(req.query.id),
          is_active: true,
          is_final_submit: true,
        },
        atrributes: [],
        raw: true,
      };
 
      // const search = req.query;
      // if (search) {
      //   if (search.is_active !== undefined && search.is_active !== '') {
      //     condition.where.is_active = search.is_active.toString();
      //   }
 
      //   if (search.crop_code && search.crop_code.trim() !== '') {
      //     condition.where.crop_code = {
      //       [Sequelize.Op.eq]: search.crop_code
      //     };
      //   }
 
      //   // ✅ ID (exact match)
      //   if (search.id && !isNaN(search.id)) {
      //     condition.where.id = parseInt(search.id);
      //   }
      // }
 
      // condition
      // const data = await db.srp_cropModel.findAll(condition);
 
      const data = await db.srpCropModel.findOne(condition);
      if (data) {
    const yearData = await db.srpYearModel.findOne({
      where: { year: data.year},
      attributes: ['year_range']
    });
    data.year = yearData ? yearData.year_range : null;

        response(res, status.DATA_AVAILABLE, 200, data);
      
     } else {
        response(res, status.DATA_NOT_AVAILABLE, 404, []);
      }
 
    } 
  catch (error) {
      console.error('Error in cropVariety:', error);
      response(res, status.DATA_NOT_AVAILABLE, 500);
    }
  };
 
  static addSrpVariety = async (req, res) => {
    try {
      const { srp_crop_wise_id, action, variety_wise } = req.body;
 
      if (!srp_crop_wise_id || !Array.isArray(variety_wise)) {
        return response(res, status.BAD_REQUEST, 400, "Invalid Payload");
      }
 
      // Validate Crop Wise ID exists
      const cropWise = await db.srpCropModel.findOne({
        where: { id: srp_crop_wise_id }
      });
 
      if (!cropWise) {
        return response(res, status.DATA_NOT_FOUND, 404, "Invalid Crop Wise ID");
      }
 
      let varietiesToSave = [...variety_wise];
 
      // ⭐ FINAL SUBMIT → Save only ACTIVE rows
      if (action === 'final') {
        varietiesToSave = varietiesToSave.filter(v => v.is_active === true);
      }
 
      if (varietiesToSave.length === 0) {
        return response(res, status.BAD_REQUEST, 400, "No active rows to save");
      }
 
      // Save/Update Each Variety Row
      for (const v of varietiesToSave) {
        let existing = null;
 
        // If frontend sends ID → use it
        if (v.id) {
          existing = await db.srpVarietyModel.findOne({
            where: { id: v.id }
          });
        } else {
          // Otherwise pick latest record
          existing = await db.srpVarietyModel.findOne({
            where: {
              srp_crop_wise_id,
              variety_code: v.variety_code
            },
            order: [["updated_at", "DESC"]]
          });
        }
 
        const saveData = {
          srp_crop_wise_id,
          variety_code: v.variety_code,
          required_qty_of_certified_seeds: v.required_qty_of_certified_seeds,
          foundation_seed: v.foundation_seed,
          breeder_seed: v.breeder_seed,
          is_active: v.is_active ?? true,
 
          // ⭐ Action mapping
          is_draft: action === 'draft' ? 1 : 0,
          is_final_submit: action === 'final' ? 1 : 0
        };
 
        if (existing) {
          // ⭐ UPDATE EXISTING ENTRY
          await existing.update(saveData);
        } else {
          // ⭐ CREATE NEW ENTRY
          await db.srpVarietyModel.create(saveData);
        }
      }
 
      // ⭐ If FINAL SUBMIT: lock all other records by marking inactive ones as inactive
      if (action === 'final') {
        await db.srpVarietyModel.update(
          { is_draft: 0, is_final_submit: 1 },
          { where: { srp_crop_wise_id } }
        );
      }
 
      return response(
        res,
        status.SUCCESS,
        200,
        action === 'draft'
          ? "Saved as Draft Successfully"
          : "Final Submitted Successfully"
      );
 
    } catch (error) {
      console.error("Error in addSrpVariety:", error);
      return response(res, status.DATA_NOT_AVAILABLE, 500, error.message);
    }
  };
 
 
}
module.exports = VarietyController
 