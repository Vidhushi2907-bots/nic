require('dotenv').config()
const response = require('../_helpers/response')
const status = require('../_helpers/status.conf')
const db = require("../models");
const sequelize = require('sequelize');
// model import
const { seedForProductionModel, seasonModel, varietyModel, directIndent, seedInventory, assignCropNewFlow, assignBspcCropNewFlow, indentOfBrseedDirectLineModel } = db;
const ConditionCreator = require('../_helpers/condition-creator');
const e = require('express');
const Op = require('sequelize').Op;

class BspcNewFlowController {

  static getBspcWillingProduction = async (req, res) => {
    try {
      let filter = await ConditionCreator.bspcNewFlowFilter(req.body.search);
      let { page, pageSize } = req.body;
      let condition = {
        include: [
          {
            model: seasonModel,
            attributes: []
          },
          {
            model: varietyModel,
            attributes: []
          },
        ],
        attributes: [
          [sequelize.col('seed_for_production.id'), 'id'],
          [sequelize.col('seed_for_production.year'), 'year'],
          [sequelize.col('seed_for_production.willing_to_produce'), 'willing_to_produce'],
          [sequelize.col('seed_for_production.comment_id'), 'comment_id'],
          [sequelize.col('seed_for_production.nucleus_seed_to_use'), 'nucleus_seed_to_use'],
          [sequelize.col('seed_for_production.breeder_seed_to_use'), 'breeder_seed_to_use'],
          [sequelize.col('seed_for_production.nucleus_seed_available_qnt'), 'nucleus_seed_available_qnt'],
          [sequelize.col('seed_for_production.breeder_seed_available_qnt'), 'seed_qantity'],
          [sequelize.col('seed_for_production.direct_indent_qnt'), 'direct_quantity'],
          [sequelize.col('seed_for_production.crop_code'), 'crop_code'],
          [sequelize.col('seed_for_production.variety_code'), 'variety_code'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [sequelize.col('m_season.season'), 'season'],
          [sequelize.col('m_season.season_code'), 'season']
        ],
        raw: true,
        where: {
          ...filter,
        }
      };

      const sortOrder = req.body.sort ? req.body.sort : 'id';
      const sortDirection = req.body.order ? req.body.order : 'DESC';

      if (page === undefined) page = 1;
      if (pageSize === undefined) pageSize = 10; // set pageSize to -1 to prevent sizing

      if (page > 0 && pageSize > 0) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }
      condition.order = [[sortOrder, sortDirection]];
      // condition
      let willingProductionData = await db.seedForProductionModel.findAndCountAll(condition);
      let responseData = willingProductionData;
      return response(res, status.DATA_AVAILABLE, 200, responseData);
    } catch (error) {
      console.log("error", error);
      return response(res, status.UNEXPECTED_ERROR, 500, []);
    }
  }
  static addBspcWillingProduction = async (req, res) => {
    try {
      let { crop_code, variety_code, year, season, comment_id, is_active, willing_to_praduce, user_id, nucleus_seed_to_use, breeder_seed_to_use, id, nucleus_seed_available_qnt, breeder_seed_available_qnt, direct_indent_qnt, line_variety_code, variety_line_code,production_delay,reason_for_delay,expected_date } = req.body;
      let dataRow = {
        crop_code: crop_code,
        variety_code: variety_code,
        year: year,
        season: season,
        comment_id: comment_id ? comment_id : null,
        is_active: is_active,
        willing_to_produce: willing_to_praduce,
        user_id: req.body.loginedUserid && req.body.loginedUserid.id ? req.body.loginedUserid.id : '',
        nucleus_seed_to_use: nucleus_seed_to_use ? nucleus_seed_to_use : null,
        variety_line_code: line_variety_code ? line_variety_code : null,
        breeder_seed_to_use: breeder_seed_to_use ? breeder_seed_to_use : null,
        nucleus_seed_available_qnt: nucleus_seed_available_qnt ? nucleus_seed_available_qnt : null,
        breeder_seed_available_qnt: breeder_seed_available_qnt ? breeder_seed_available_qnt : null,
        direct_indent_qnt: direct_indent_qnt ? direct_indent_qnt : null,
        production_delay: production_delay ? production_delay : null,
        production_type: production_delay ? (production_delay==1?"DELAY":"NORMAL") : "NORMAL",
        reason_for_delay: reason_for_delay ? reason_for_delay : null,
        expected_date: expected_date ? expected_date : null,
      }
      if (id) {
        let willingProductionData = seedForProductionModel.update(dataRow, { where: { id: id } });
        if (willingProductionData) {
          let updatedData = seedForProductionModel.findOne({ where: { id: id } });
          return response(res, status.DATA_UPDATED, 200, updatedData);
        } else {
          return response(res, status.DATA_NOT_UPDATE, 201, []);
        }
      } else {
        let isExits
        if (line_variety_code && line_variety_code != '') {

          isExits = await db.seedForProductionModel.findAll({ where: { year: year, season: season, crop_code: crop_code, variety_code: variety_code, user_id: user_id, variety_line_code: line_variety_code } });
        } else {
          isExits = await db.seedForProductionModel.findAll({ where: { year: year, season: season, crop_code: crop_code, variety_code: variety_code, user_id: user_id } });
        }
        console.log("isExits", isExits);
        if (isExits && isExits.length) {
          return response(res, "Data Already Exist", 201, []);
        } else {
          let willingProductionData = db.seedForProductionModel.create(dataRow);
          if (willingProductionData) {
            return response(res, status.DATA_SAVE, 200, dataRow);
          } else {
            return response(res, status.DATA_NOT_SAVE, 201, []);
          }
        }
      }

    } catch (error) {
      console.log("error", error);
      return response(res, status.UNEXPECTED_ERROR, 500, []);
    }
  }
  static deleteBspcWillingProduction = async (req, res) => {
    try {
      let { id } = req.body;
      if (id) {
        const willingProductionData = await seedForProductionModel.destroy({ where: { id: id } });
        if (willingProductionData) {
          return response(res, status.DATA_DELETED, 200, []);
        } else {
          return response(res, status.ID_NOT_EXIST, 201, []);
        }
      } else {
        return response(res, status.ID_NOT_FOUND, 201, []);
      }
    } catch (error) {
      return response(res, status.UNEXPECTED_ERROR, 500, []);
    }
  }
  static getInventryAndIndentData = async (req, res) => {
    try {
      let filter = await ConditionCreator.bspcNewFlowFilter(req.body.search);
      let userId;
      let parental_data;
      let variety_code_line;
      let userIdDirectIndent;
      console.log(req.body.search.year);
      console.log(req.body.search.season);
      let yearValue;
      let seasonValue;
      if(req.body.search){
        if(req.body.search.season){
          seasonValue = {
            season:req.body.search.season
          }
        }
        if(req.body.search.year){
          yearValue = {
            year:req.body.search.year
          }
        }
      }
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          bspc_id: req.body.loginedUserid.id
        }
      }
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userIdDirectIndent = {
          user_id: req.body.loginedUserid.id
        }
      }
      if (req.body.search && req.body.search.parental_data) {
        parental_data = {
          line_variety_code: req.body.search.parental_data
        }
      }
      let variertyCode;
      let cropCode;
      if (filter) {
        variertyCode = {
          variety_code: filter.variety_code
        }
        cropCode = {
          crop_code: filter.crop_code
        }
      }
      if (req.body && req.body.search && req.body.search.parental_data && req.body.search.parental_data != '') {
        variety_code_line = {
          variety_code_line: req.body.search.parental_data
        }
      }


      let condition = {
        attributes: [
          [sequelize.col('seed_inventries.crop_code'), "crop_code"],
          [sequelize.col('seed_inventries.variety_code'), "variety_code"],
          [sequelize.col('seed_inventries.bspc_id'), "bspc_id"],
          [sequelize.col('seed_inventries.season'), "season"],
          [sequelize.fn('SUM', sequelize.col('seed_inventries.quantity')), "quantity"]
        ],
        group: [
          [sequelize.col('seed_inventries.crop_code'), "crop_code"],
          [sequelize.col('seed_inventries.bspc_id'), "bspc_id"],
          [sequelize.col('seed_inventries.season'), "season"],
          [sequelize.col('seed_inventries.variety_code'), "variety_code"],
        ],
        raw: true,
        where: {
          ...variertyCode,
          ...cropCode,
          ...userId,
          ...parental_data,
          [Op.and]: [
            {
              seed_class_id: 7
            }
          ]
        }
      };
      let condition1 = {
        attributes: [
          [sequelize.col('seed_inventries.crop_code'), "crop_code"],
          [sequelize.col('seed_inventries.variety_code'), "variety_code"],
          [sequelize.col('seed_inventries.bspc_id'), "bspc_id"],
          [sequelize.col('seed_inventries.season'), "season"],
          [sequelize.fn('SUM', sequelize.col('seed_inventries.quantity')), "quantity"]
        ],
        group: [
          [sequelize.col('seed_inventries.crop_code'), "crop_code"],
          [sequelize.col('seed_inventries.bspc_id'), "bspc_id"],
          [sequelize.col('seed_inventries.season'), "season"],
          [sequelize.col('seed_inventries.variety_code'), "variety_code"],
        ],
        raw: true,
        where: {
          ...variertyCode,
          ...cropCode,
          ...userId,
          ...parental_data,
          [Op.and]: [
            {
              seed_class_id: 6
            }
          ]
        }
      };
      let condition2;
      if (req.body && req.body.search && req.body.search.parental_data && req.body.search.parental_data != '') {

        condition2 = {
          include: [{
            model: indentOfBrseedDirectLineModel,
            where: {
              ...variety_code_line
              // variety_code_line:req.body.search.parental_data
            },
            attributes: []
          }],
          attributes: [
            [sequelize.col('indent_of_breederseed_direct.crop_code'), "crop_code"],
            [sequelize.col('indent_of_breederseed_direct.variety_code'), "variety_code"],
            [sequelize.col('indent_of_breederseed_direct.season'), "season"],
            [sequelize.col('indent_of_breederseed_direct.user_id'), "user_id"],
            [sequelize.fn('SUM', sequelize.col('indent_of_brseed_direct_line.quantity')), "quantity"]
            //  [sequelize.fn('SUM', sequelize.col('indent_of_breederseed_direct.quantity')), "quantity"]
          ],
          group: [
            [sequelize.col('indent_of_breederseed_direct.crop_code'), "crop_code"],
            [sequelize.col('indent_of_breederseed_direct.season'), "season"],
            [sequelize.col('indent_of_breederseed_direct.user_id'), "user_id"],
            [sequelize.col('indent_of_breederseed_direct.variety_code'), "variety_code"],
            [sequelize.col('indent_of_brseed_direct_line.id'), 'indent_of_brseed_direct_line_id']
          ],
          raw: true,
          where: {
            ...variertyCode,
            ...cropCode,
            ...userIdDirectIndent,
          }
        };
      } else {
        condition2 = {
          // include:[{model:indentOfBrseedDirectLineModel,
          //   where:{
          //     ...variety_code_line
          //     // variety_code_line:req.body.search.parental_data
          //   },
          // attributes:[]
          // }],
          attributes: [
            [sequelize.col('indent_of_breederseed_direct.crop_code'), "crop_code"],
            [sequelize.col('indent_of_breederseed_direct.variety_code'), "variety_code"],
            [sequelize.col('indent_of_breederseed_direct.season'), "season"],
            [sequelize.col('indent_of_breederseed_direct.user_id'), "user_id"],
            // [sequelize.fn('SUM', sequelize.col('indent_of_brseed_direct_line.quantity')), "quantity"]
            [sequelize.fn('SUM', sequelize.col('indent_of_breederseed_direct.quantity')), "quantity"]
          ],
          group: [
            [sequelize.col('indent_of_breederseed_direct.crop_code'), "crop_code"],
            [sequelize.col('indent_of_breederseed_direct.season'), "season"],
            [sequelize.col('indent_of_breederseed_direct.user_id'), "user_id"],
            [sequelize.col('indent_of_breederseed_direct.variety_code'), "variety_code"],
            // [sequelize.col('indent_of_brseed_direct_line.id'),'indent_of_brseed_direct_line_id']
          ],
          raw: true,
          where: {
            ...variertyCode,
            ...cropCode,
            ...userIdDirectIndent,
            ...yearValue,
            ...seasonValue
          }
        };
      }
      let inevntryQntValue = await seedInventory.findAll(condition);
      const result = [];
      const result2 = [];
      if(inevntryQntValue && inevntryQntValue.length>0){

  
        const groupedData = inevntryQntValue.reduce((acc, obj) => {
          const key = `${obj.crop_code}-${obj.variety_code}`;
          if (!acc[key]) {
            acc[key] = { ...obj };
          } else {
            acc[key].quantity += obj.quantity;
          }
          return acc;
        }, {});
  
        for (const key in groupedData) {
          result.push(groupedData[key]);
        }
  
      }
      
      inevntryQntValue=result ;
    
      let inevntryQntValueNucleus = await seedInventory.findAll(condition1);
      if(inevntryQntValueNucleus && inevntryQntValueNucleus.length>0){

  
        const groupedData = inevntryQntValueNucleus.reduce((acc, obj) => {
          const key = `${obj.crop_code}-${obj.variety_code}`;
          if (!acc[key]) {
            acc[key] = { ...obj };
          } else {
            acc[key].quantity += obj.quantity;
          }
          return acc;
        }, {});
  
        for (const key in groupedData) {
          result2.push(groupedData[key]);
        }
  
      }
      inevntryQntValueNucleus=result2
      let directIndentQntValue = await directIndent.findAll(condition2);
      
      let responseData;
      // if (inevntryQntValue && inevntryQntValue !== undefined && inevntryQntValue.length > 0) {
      responseData = {
        'iventry_qnt': inevntryQntValue && inevntryQntValue[0] && inevntryQntValue[0].quantity ? inevntryQntValue[0].quantity : 0,
        'nucleus_qnt': inevntryQntValueNucleus && inevntryQntValueNucleus[0] && inevntryQntValueNucleus[0].quantity ? inevntryQntValueNucleus[0].quantity : 0,
        'dierct_indent': directIndentQntValue && directIndentQntValue[0] && directIndentQntValue[0].quantity ? directIndentQntValue[0].quantity : 0
      };
      // }
      return response(res, status.DATA_AVAILABLE, 200, responseData);
    } catch (error) {
      console.log("error", error);
      return response(res, status.UNEXPECTED_ERROR, 500, []);
    }
  }

  static getWiilingProduceVarietyData = async (req, res) => {
    try {
      let filter = await ConditionCreator.bspcNewFlowFilter(req.body.search);
      let condition = {
        include: [
          {
            model: varietyModel,
            attributes: []
          }
        ],
        where: {
          ...filter
        },
        raw: true,
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('seed_for_productions.variety_code')), 'variety_code'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [sequelize.col('m_crop_variety.status'), 'status'],
          [sequelize.col('m_crop_variety.id'), 'variety_id']
        ]
      }
      // let willingProductionVarietyData = await db.seedForProductionModel.findAll(condition);
      let data = await db.seedForProductionModel.findAll(condition)
      console.log(data, 'willingProductionVarietyDatawillingProductionVarietyData')
      return response(res, status.DATA_AVAILABLE, 200, willingProductionVarietyData);
    } catch (error) {
      console.log(error)
      return response(res, status.UNEXPECTED_ERROR, 500, []);
    }
  }

  static checkWillingProduceVarietyAvailability = async (req, res) => {
    try {
      let filters = await ConditionCreator.bspcNewFlowFilter(req.body.search);
      let assignVarietyCount = await assignCropNewFlow.count({ include: [{ model: assignBspcCropNewFlow, attributes: [], where: { bspc_id: req.body.loginedUserid && req.body.loginedUserid.id ? req.body.loginedUserid.id : 676 } }], where: { ...filters } });
      let willignProductionVarietyCount = await seedForProductionModel.count({ where: { ...filters, user_id: req.body.loginedUserid && req.body.loginedUserid.id ? req.body.loginedUserid.id : 676 } });
      if ((assignVarietyCount && assignVarietyCount.length > 0) && (willignProductionVarietyCount && willignProductionVarietyCount.length > 0)) {
        if (assignVarietyCount === willignProductionVarietyCount) {
          return response(res, "Submit Enable", 200, []);
        } else {
          return response(res, "Submit Disabled", 201, []);
        }
      } else {
        return response(res, "Submit Disabled", 201, []);
      }

    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 500, []);
    }
  }
  static willingProduceFinalSubmit = async (req, res) => {
    try {
      let { crop_code, variety_code, year, season, user_id } = req.body;
      // variety_code: variety_code,
      let willingProductionData = seedForProductionModel.update({ is_final_submitted: 1 }, { where: { crop_code: crop_code, year: year, season: season, user_id: user_id } });
      if (willingProductionData) {
        return response(res, status.DATA_SAVE, 200, []);
      } else {
        return response(res, status.DATA_NOT_SAVE, 201, []);
      }
    }
    catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 500, []);
    }
  }
  static checkWillingToProduceCropVarietyAvailability = async (req, res) => {
    try {
      let { crop_code, variety_code, year, season, user_id } = req.body;
      let willingToProduceVarietyCount = await seedForProductionModel.findAll({ where: { is_final_submitted: 1, crop_code: crop_code, year: year, season: season, user_id: user_id } });
      if ((willingToProduceVarietyCount && willingToProduceVarietyCount.length > 0)) {
        return response(res, "Submit disable", 200, [{ isDisable: "true" }]);
      } else {
        return response(res, "Submit Enable", 200, [{ isDisable: "false" }]);
      }
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 500, []);
    }
  }
  static getBspcWillingProductionSecond = async (req, res) => {
    try {
      let filter = await ConditionCreator.bspcNewFlowFilter(req.body.search);
      let fileterIndData = []
      if (req.body && req.body.search) {
        if (req.body.search.year) {
          fileterIndData.push({
            year: {
              [Op.eq]: req.body.search.year
            }
          })
        }

        if (req.body.search.season) {
          fileterIndData.push({
            season: {
              [Op.eq]: req.body.search.season
            }
          })
        }
        if (req.body.search.crop_code) {
          fileterIndData.push({
            crop_code: {
              [Op.eq]: req.body.search.crop_code
            }
          })
        }
        if (req.body.search.user_id) {
          fileterIndData.push({
            user_id: {
              [Op.eq]: req.body.search.user_id
            }
          })
        }
        if (req.body.search.variety_code_array) {
          fileterIndData.push({
            variety_code: {
              [Op.in]: req.body.search.variety_code_array
            }
          })
        }
      }
      
      let { page, pageSize } = req.body;
      let condition = {
        include: [
          {
            model: seasonModel,
            attributes: []
          },
          {
            model: varietyModel,
            attributes: []
          },
          {
            model: db.VarietyLines,
            attributes: []
          },
        ],
        attributes: [
          [sequelize.col('seed_for_productions.id'), 'id'],
          [sequelize.col('seed_for_productions.year'), 'year'],
          [sequelize.col('seed_for_productions.willing_to_produce'), 'willing_to_produce'],
          [sequelize.col('seed_for_productions.comment_id'), 'comment_id'],
          [sequelize.col('seed_for_productions.nucleus_seed_to_use'), 'nucleus_seed_to_use'],
          [sequelize.col('seed_for_productions.breeder_seed_to_use'), 'breeder_seed_to_use'],
          [sequelize.col('seed_for_productions.nucleus_seed_available_qnt'), 'nucleus_seed_available_qnt'],
          [sequelize.col('seed_for_productions.breeder_seed_available_qnt'), 'seed_qantity'],
          [sequelize.col('seed_for_productions.direct_indent_qnt'), 'direct_quantity'],
          [sequelize.col('seed_for_productions.crop_code'), 'crop_code'],
          [sequelize.col('seed_for_productions.variety_code'), 'variety_code'],
          [sequelize.col('seed_for_productions.production_delay'), 'production_delay'],
          [sequelize.col('seed_for_productions.reason_for_delay'), 'reason_for_delay'],
          [sequelize.col('seed_for_productions.expected_date'), 'expected_date'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [sequelize.col('m_season.season'), 'season'],
          [sequelize.col('m_variety_line.line_variety_code'), 'line_variety_code'],
          [sequelize.col('m_variety_line.line_variety_name'), 'line_variety_name'],

          [sequelize.col('m_season.season_code'), 'season']
        ],
        raw: true,
        where: {
          [Op.and]: fileterIndData ? fileterIndData : [],
          // ...filter,
        }
      };

      const sortOrder = req.body.sort ? req.body.sort : 'id';
      const sortDirection = req.body.order ? req.body.order : 'DESC';

      if (page === undefined) page = 1;
      if (pageSize === undefined) pageSize = 10; // set pageSize to -1 to prevent sizing

      if (page > 0 && pageSize > 0) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }
      condition.order = [[sortOrder, sortDirection]];
      // condition
      let willingProductionData = await db.seedForProductionModel.findAndCountAll(condition);
      let responseData = willingProductionData;
      let filterData = [];
      willingProductionData.rows.forEach((el, i) => {
        const cropIndex = filterData.findIndex(item => item.variety_code == el.variety_code);
        if (cropIndex == -1) {
          filterData.push({
            variety_code: el && el.variety_code ? el.variety_code : '',
            variety_name: el && el.variety_name ? el.variety_name : '',
            line_variety_name: el && el.line_variety_name ? el.line_variety_name : '',
            line_variety_code: el && el.line_variety_code ? el.line_variety_code : '',
            id: el && el.id ? el.id : '',
            willingproducingList: [
              {
                id: el && el.id ? el.id : '',
                variety_code: el && el.variety_code ? el.variety_code : '',
                variety_name: el && el.variety_name ? el.variety_name : '',
                year: el && el.year ? el.year : '',
                willing_to_produce: el && el.willing_to_produce ? el.willing_to_produce : '',
                comment_id: el && el.comment_id ? el.comment_id : '',
                nucleus_seed_to_use: el && el.nucleus_seed_to_use ? el.nucleus_seed_to_use : '',
                breeder_seed_to_use: el && el.breeder_seed_to_use ? el.breeder_seed_to_use : '',
                nucleus_seed_available_qnt: el && el.nucleus_seed_available_qnt ? el.nucleus_seed_available_qnt : '',
                seed_qantity: el && el.seed_qantity ? el.seed_qantity : '',
                direct_quantity: el && el.direct_quantity ? el.direct_quantity : '',
                season: el && el.season ? el.season : '',
                line_variety_name: el && el.line_variety_name ? el.line_variety_name : '',
                line_variety_code: el && el.line_variety_code ? el.line_variety_code : '',
                production_delay: el && el.production_delay ? el.production_delay : '',
                reason_for_delay: el && el.reason_for_delay ? el.reason_for_delay : '',
                expected_date: el && el.expected_date ? el.expected_date : '',
              }
            ]
          })
        }
        
        else {
          filterData[cropIndex].willingproducingList.push({
            id: el && el.id ? el.id : '',
            variety_code: el && el.variety_code ? el.variety_code : '',
            variety_name: el && el.variety_name ? el.variety_name : '',
            year: el && el.year ? el.year : '',
            willing_to_produce: el && el.willing_to_produce ? el.willing_to_produce : '',
            comment_id: el && el.comment_id ? el.comment_id : '',
            nucleus_seed_to_use: el && el.nucleus_seed_to_use ? el.nucleus_seed_to_use : '',
            breeder_seed_to_use: el && el.breeder_seed_to_use ? el.breeder_seed_to_use : '',
            nucleus_seed_available_qnt: el && el.nucleus_seed_available_qnt ? el.nucleus_seed_available_qnt : '',
            seed_qantity: el && el.seed_qantity ? el.seed_qantity : '',
            direct_quantity: el && el.direct_quantity ? el.direct_quantity : '',
            season: el && el.season ? el.season : '',
            line_variety_name: el && el.line_variety_name ? el.line_variety_name : '',
            line_variety_code: el && el.line_variety_code ? el.line_variety_code : '',
          })
        }

      })
      // console.log(willingProductionData,'el')


      return response(res, status.DATA_AVAILABLE, 200, filterData);
    } catch (error) {
      console.log("error", error);
      return response(res, status.UNEXPECTED_ERROR, 500, []);
    }
  }

}
module.exports = BspcNewFlowController


