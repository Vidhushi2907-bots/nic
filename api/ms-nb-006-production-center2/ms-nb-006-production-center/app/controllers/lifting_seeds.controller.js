require('dotenv').config()
const response = require('../_helpers/response')
const status = require('../_helpers/status.conf')
const db = require("../models");
const sendSms = require("../_helpers/sms")
let Validator = require('validatorjs');

const { varietyModel, seasonModel, cropModel } = db

const sequelize = require('sequelize');
const ConditionCreator = require('../_helpers/condition-creator')
const Op = require('sequelize').Op;
const union = require('lodash');
const { where, model } = require('../models/db');
const attributes = require('validatorjs/src/attributes');
const axios = require('axios');
const { fn, col } = require('sequelize');
const SpaDataBySector = require('../_helpers/spa-data-by-sector');
const CryptoJS = require('crypto-js');
const productiohelper = require('../_helpers/productionhelper');


class LiftingSeeds {

  static addLiftingData = async (req, res) => {
    try {
      let userId;
      // if (req.body.loginedUserid && req.body.loginedUserid.id) {
      //   userId = {
      //     user_id: req.body.loginedUserid.id ? req.body.loginedUserid.id:10826
      //   }
      // }
      if (1) {
        userId = {
          user_id: req.body && req.body.loginedUserid && req.body.loginedUserid.id ? req.body.loginedUserid.id : null
        }
      }
      if (req.body && req.body.data) {
        let data;
        // for (let key of req.body.data) {
        //   let rules = {
        //     "year": 'required',
        //     "season": 'required|string',
        //     "crop_code": 'required|string',
        //     // "variety_code": 'required|string',
        //   };
        //   let validation = new Validator(key, rules);
        //   const isValidData = validation.passes();

        //   if (!isValidData) {
        //     let errorResponse = {};
        //     for (let key in rules) {
        //       const error = validation.errors.get(key);
        //       if (error.length) {
        //         errorResponse[key] = error;
        //       }
        //     }
        //     return response(res, status.BAD_REQUEST, 400, errorResponse, [])
        //   }
        // }
        const { year, season, crop_code, variety_code, variety_line_code, lot_no, lot_id, reason_id, spa_code, spa_id, spa_state_code,
          paid_by, payment_method_no, per_unit_price, breeder_class, bag_weight, no_of_bag, total_price, lifting_lots, tag_data, lifting_charges
          , indentor_id, total_lifting_price, final_amt, is_self, gst, production_type, lifting_tags,is_surplus } = req.body.data;
        let billno = await db.liftingSeedDetailsModel.count({
          where: {
            year: year,
            season,
          }
        })
        if (!billno || billno == 0) {
          billno = 1
        } else {
          billno = billno + 1
        }
        let code = req.body.loginedUserid && req.body.loginedUserid.code ? req.body.loginedUserid.code : 'NA'
        let generatebillno = year + '/' + season + '/' + code + '/' + billno
        console.log('indentor_id==', indentor_id);
        data = await db.liftingSeedDetailsModel.create({
          year: year ? year : "",
          season: season ? season : "",
          crop_code: crop_code ? crop_code : "",
          variety_code: variety_code ? variety_code : "",
          variety_line_code: variety_line_code ? variety_line_code : "",
          spa_state_code: spa_state_code ? spa_state_code : null,
          spa_code: spa_code ? spa_code : "",
          spa_id: spa_id ? spa_id : null,
          reason_id: reason_id ? reason_id : 1,
          paid_by: paid_by ? paid_by : "abc abc ",
          payment_method_no: payment_method_no ? payment_method_no : "credit card ",
          per_unit_price: per_unit_price ? per_unit_price : 100,
          created_at: Date.now(),
          updated_at: Date.now(),
          breeder_class: breeder_class ? breeder_class : '',
          bag_weight: bag_weight ? bag_weight : '',
          no_of_bag: no_of_bag ? no_of_bag : '',
          total_price: total_lifting_price ? total_lifting_price : '',
          indentor_id: indentor_id ? indentor_id : null,
          final_payable_amt: final_amt ? final_amt : null,
          is_self: production_type && (production_type == "Surplus") ? 1 : 0,
          gst: gst ? gst : 1,
          is_surplus: is_surplus,
          production_type: production_type ? production_type : 'national',
          lifting_bill_no: generatebillno ? generatebillno : null,
          ...userId
        });
        for (let item of lifting_lots) {
          let liftingLotsData;
          liftingLotsData = await db.liftingLotNumberModel.create({
            lifting_details_id: data.dataValues.id,
            lot_no: item.lot_no,
            lot_id: item.lot_id,
          });
        }

        let datas = await db.liftingLotNumberModel.findAll({
          where: {
            lifting_details_id: data.dataValues.id
          },
          raw: true
        })
        const lifting_lot_no_id = datas[0]?.id || null;
        const lot_id1 = datas[0]?.lot_id || null;
        // Map tags with matching lifting_lot_no_id using lot_no match
        const mergedTags = lifting_tags.map(tag => {
          const matchingLiftingDetail = datas.find(ld =>
            tag.tag_no.includes(ld.lot_no) // assumes lot_no like 'abc/pr/b2' is in tag_no
          );
          return {
            ...tag,
            lot_id: lot_id1, // actual lot_id
            lifting_lot_no_id: lifting_lot_no_id || null
          };
        });

        for (let items of mergedTags) {
          let datas = await db.liftingTagNumberModel.create({
            tag_no: items.tag_no,
            tag_size: items.tag_size,
            lifting_lot_no_id: items.lifting_lot_no_id,
            no_of_bags: 1,
            tag_id: null,
            litting_seed_details_id: data.dataValues.id,
            // add new colomn
            per_unit_price: per_unit_price ? per_unit_price : 100,
          })
        }
        for (let item of lifting_charges) {
          let daliftingCharges = await db.liftingChargesModel.create({
            lifting_details_id: data.dataValues.id,
            gst: item.gst,
            name: item && item.name ? item.name : null,
            additional_charges_id: item.additional_charges_id,
            total_amount: item.total_amount,
            after_apply_gst: item.after_apply_gst
          });
        }
        // return;
        if (data) {
          return response(res, status.DATA_SAVE, 200, data);
        } else {
          return response(res, status.DATA_NOT_SAVE, 201);
        }
      } else {
        return response(res, "all fields data required", 201, []);
      }
    } catch (error) {
      console.log('error', error)
      return response(res, status.UNEXPECTED_ERROR, 501, error);
    }
  }

  static getLiftingData = async (req, res) => {
    try {
      let userId;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          user_id: req.body.loginedUserid.id
        }
      }

      let { id } = req.body;
      let datas
      if (id) {
        datas = await db.liftingSeedDetailsModel.findAll({
          where: {
            id: id
          },
          raw: true,
          attributes: [
            'year', 'season', 'variety_code', 'variety_line_code', 'crop_code', 'user_id'
          ]
        })
      }
      let whereClause = {}
      if (datas && datas[0] && datas[0].year) {
        whereClause.year = datas[0].year
      }
      if (datas && datas[0] && datas[0].season) {
        whereClause.season = datas[0].season
      }
      if (datas && datas[0] && datas[0].variety_code) {
        whereClause.variety_code = datas[0].variety_code
      }
      if (datas && datas[0] && datas[0].variety_line_code) {
        whereClause.variety_line_code = datas[0].variety_line_code
      }

      if (datas && datas[0] && datas[0].crop_code) {
        whereClause.crop_code = datas[0].crop_code
      }
      if (datas && datas[0] && datas[0].user_id) {
        whereClause.user_id = datas[0].user_id
      }

      let condition = {
        include: [
          {
            model: db.varietyModel,
            attributes: ['variety_code', 'variety_name']
          },
          {
            model: db.cropModel,
            attributes: ['crop_code', 'crop_name']
          },
          {
            model: db.mVarietyLinesModel,
            attributes: ['line_variety_code', 'line_variety_name']
          },
          {
            model: db.seasonModel,
            attributes: ['season_code', 'season'],
          },
          // {
          //   model:db.liftingLotNumberModel,
          //   attributes:['id','lot_no','lifting_details_id'],
          //   // include:[
          //   //   {
          //   //     model:db.liftingTagNumberModel,
          //   //     attributes:['id','tag_no','tag_size']
          //   //   }
          //   // ]
          // },
          // {
          //   model:db.liftingChargesModel,
          //   attributes:['id','additional_charges_id','gst','after_apply_gst','total_amount']
          // }
        ],
        attributes: ["*"],
        nest: true,
        raw: true,
        where: {
          // ...userId,
          // user_id:data
          id: id,
          ...whereClause
        },
      }
      if (req.body) {
        if (req.body.year) {
          condition.where.year = req.body.year;
        }

        if (req.body.season) {
          condition.where.season = req.body.season
        }

        if (req.body.crop_code) {
          condition.where.crop_code = req.body.crop_code
        }
        if (req.body.variety_code) {
          condition.where.variety_code = req.body.variety_code
        }
      }

      let dataList = await db.liftingSeedDetailsModel.findAll(condition);
      if (dataList && dataList.length) {
        response(res, status.DATA_AVAILABLE, 200, dataList);
      } else {
        response(res, status.DATA_NOT_AVAILABLE, 201, []);
      }
    } catch (error) {
      console.log(error);
      response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }
  static getLiftingLotNoData = async (req, res) => {
    try {
      let userId;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          user_id: req.body.loginedUserid.id
        }
      }
      let condition = {
        include: [
          // {
          //   model:db.liftingLotNumberModel,
          //   attributes:['id','lot_no','lifting_details_id'],
          //   // include:[
          //   //   {
          //   //     model:db.liftingTagNumberModel,
          //   //     attributes:['id','tag_no','tag_size']
          //   //   }
          //   // ]
          // },
          // {
          //   model:db.liftingChargesModel,
          //   attributes:['id','additional_charges_id','gst','after_apply_gst','total_amount']
          // }
        ],
        attributes: ["*"],
        nest: true,
        raw: true,
        where: {
          ...userId
        },
      }
      if (req.body) {
        if (req.body.lifting_details_id) {
          condition.where.lifting_details_id = req.body.lifting_details_id
        }
      }

      let dataList = await db.liftingLotNumberModel.findAll(condition);
      if (dataList && dataList.length) {
        response(res, status.DATA_AVAILABLE, 200, dataList);
      } else {
        response(res, status.DATA_NOT_AVAILABLE, 201, []);
      }
    } catch (error) {
      console.log(error);
      response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }
  static getLiftingTagNoData = async (req, res) => {
    try {
      let userId;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          user_id: req.body.loginedUserid.id
        }
      }
      let condition = {
        attributes: ["*"],
        nest: true,
        raw: true,
        where: {
          ...userId
        },
      }
      if (req.body) {
        if (req.body.lifting_lot_no_id) {
          condition.where.lifting_lot_no_id = req.body.lifting_lot_no_id
        }
      }

      let dataList = await db.liftingTagNumberModel.findAll(condition);
      if (dataList && dataList.length) {
        response(res, status.DATA_AVAILABLE, 200, dataList);
      } else {
        response(res, status.DATA_NOT_AVAILABLE, 201, []);
      }
    } catch (error) {
      console.log(error);
      response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }
  static getLiftingAdditionalChargesData = async (req, res) => {
    try {
      let userId;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          user_id: req.body.loginedUserid.id
        }
      }
      let condition = {
        attributes: ["*"],
        nest: true,
        raw: true,
        where: {
          ...userId
        },
      }
      if (req.body) {
        if (req.body.lifting_details_id) {
          condition.where.lifting_details_id = req.body.lifting_details_id
        }
      }

      let dataList = await db.liftingChargesModel.findAll(condition);
      if (dataList && dataList.length) {
        response(res, status.DATA_AVAILABLE, 200, dataList);
      } else {
        response(res, status.DATA_NOT_AVAILABLE, 201, []);
      }
    } catch (error) {
      console.log(error);
      response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }

  static getBreederSeedLiftingYearData = async (req, res) => {
    try {
      let { state_code, spa_code, sector } = req.body;

      let rules = {
        "state_code": 'required|integer',
        "spa_code": 'required|string',
      };

      let validation = new Validator(req.body, rules);
      const isValidData = validation.passes();

      if (!isValidData) {
        let errorResponse = {};
        for (let key in rules) {
          const error = validation.errors.get(key);
          if (error.length) {
            errorResponse[key] = error;
          }
        }
        return response(res, status.BAD_REQUEST, 400, errorResponse)
      }
      if (sector) {
        //Change state code and spa code base on sector
        let spaSectorDetails = await SpaDataBySector.getSPADetailBySector(spa_code, sector, state_code)
        state_code = spaSectorDetails.stateCode
        spa_code = spaSectorDetails.spa_code
      }

      const yearData = await db.liftingSeedDetailsModel.findAll({
        attributes: [[db.Sequelize.fn('DISTINCT', db.Sequelize.col('year')), 'year']],
        where: {
          spa_state_code: state_code,
          spa_code: spa_code
        },
        raw: true
      });

      if (yearData && yearData.length > 0) {
        const years = yearData.map(data => data.year);
        return response(res, status.DATA_AVAILABLE, 200, { "year_of_indent": years });
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, { "year_of_indent": [] });
      }
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }
  static getBreederSeedLiftingSeasonData = async (req, res) => {
    try {
      let { state_code, spa_code, sector, year_of_indent, season } = req.body;
      let rules = {
        "state_code": 'required|integer',
        "spa_code": 'required|string',
        "year_of_indent": 'required',
      };

      let validation = new Validator(req.body, rules);
      const isValidData = validation.passes();

      if (!isValidData) {
        let errorResponse = {};
        for (let key in rules) {
          const error = validation.errors.get(key);
          if (error.length) {
            errorResponse[key] = error;
          }
        }
        return response(res, status.BAD_REQUEST, 400, errorResponse)
      }
      if (sector) {
        //Change state code and spa code base on sector
        let spaSectorDetails = await SpaDataBySector.getSPADetailBySector(spa_code, sector, state_code)
        state_code = spaSectorDetails.stateCode
        spa_code = spaSectorDetails.spa_code
      }
      const seasonData = await db.liftingSeedDetailsModel.findAll({
        attributes: ['season'],
        where: {
          spa_state_code: state_code,
          spa_code: spa_code,
          year: year_of_indent,
          // season: season
        },
        include: [{
          model: db.seasonModel,
          attributes: ['season', 'season_code'],
          require: true
        }],
        // raw: true
      });
      console.log("seasonData", seasonData)
      if (seasonData && seasonData.length > 0) {
        const formattedData = seasonData.map(data => ({
          season_code: data.m_season.season_code,
          season: data.m_season.season
        }));
        return response(res, status.DATA_AVAILABLE, 200, formattedData);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, []);
      }


    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }
  static getBreederSeedLiftingCropData = async (req, res) => {
    try {
      let { state_code, spa_code, sector, year_of_indent, season } = req.body;
      let rules = {
        "state_code": 'required|integer',
        "spa_code": 'required|string',
        "season": 'required|string',
        "year_of_indent": 'required',
      };

      let validation = new Validator(req.body, rules);
      const isValidData = validation.passes();

      if (!isValidData) {
        let errorResponse = {};
        for (let key in rules) {
          const error = validation.errors.get(key);
          if (error.length) {
            errorResponse[key] = error;
          }
        }
        return response(res, status.BAD_REQUEST, 400, errorResponse)
      }
      if (sector) {
        //Change state code and spa code base on sector
        let spaSectorDetails = await SpaDataBySector.getSPADetailBySector(spa_code, sector, state_code)
        state_code = spaSectorDetails.stateCode
        spa_code = spaSectorDetails.spa_code
      }

      const CropData = await db.liftingSeedDetailsModel.findAll({
        attributes: ['crop_code'],
        where: {
          spa_state_code: state_code,
          spa_code: spa_code,
          year: year_of_indent,
          season: season
        },
        include: [{
          model: db.cropModel,
          attributes: ['crop_name'],
          require: true
        }],
        // raw: true
      });
      if (CropData && CropData.length > 0) {
        const formattedData = CropData.map(data => ({
          crop_code: data.crop_code,
          crop_name: data.m_crop.crop_name
        }));
        return response(res, status.DATA_AVAILABLE, 200, formattedData);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, []);
      }


    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }
  static getFilterVerityData = async (req, res) => {
    try {
      const varieties = await db.liftingSeedDetailsModel.findAll({
        attributes: [
          [db.sequelize.col('lifting_seed_details.variety_code'), 'variety_code'],
          [db.sequelize.col('m_crop_variety.variety_name'), 'm_crop_variety.variety_name']
        ],
        include: [{
          model: db.varietyModel,
          attributes: [],
          required: true,
          as: 'm_crop_variety',
        }],
        group: ['lifting_seed_details.variety_code', 'm_crop_variety.variety_name'],
        raw: true
      });
      console.log("varieties", varieties)
      if (varieties.length > 0) {
        const formattedData = varieties.map(item => ({
          agency_id: item['variety_code'],
          agency_name: item['m_crop_variety.variety_name']
        }));
        return response(res, status.DATA_AVAILABLE, 200, formattedData);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 200, []);
      }
    } catch (error) {
      console.log(error);
      return response(res, status.DATA_NOT_AVAILABLE, 500, { error: 'Internal Server Error' });
    }
  }
  static getFilterBillData = async (req, res) => {
    try {
      // const liftingBillNo = await db.liftingSeedDetailsModel.findAll({
      //   attributes: [
      //     [db.sequelize.fn('DISTINCT', db.sequelize.col('lifting_bill_no')), 'lifting_bill_no']
      //   ],
      //   raw: true
      // });
      const liftingBillNo = await db.liftingSeedDetailsModel.findAll({
        attributes: [
          [db.sequelize.fn('MIN', db.sequelize.col('id')), 'id'],
          'lifting_bill_no'
        ],
        group: ['lifting_bill_no'],
        raw: true
      });
      if (liftingBillNo.length > 0) {
        return response(res, status.DATA_AVAILABLE, 200, liftingBillNo);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 200, []);
      }
    } catch (error) {
      console.log(error);
      return response(res, status.DATA_NOT_AVAILABLE, 500, { error: 'Internal Server Error' });
    }
  }
  static getFilterAgencyData = async (req, res) => {
    try {
      const agencyData = await db.liftingSeedDetailsModel.findAll({
        attributes: [
          [db.sequelize.fn('DISTINCT', db.sequelize.col('lifting_seed_details.user_id')), 'user_id']
        ],
        include: [{
          model: db.agencyDetailModel,
          attributes: ['id', 'agency_name'],
          required: true
        }],
        raw: true
      });
      if (agencyData.length > 0) {
        const formattedData = agencyData.map(item => ({
          agency_id: item['agency_detail.id'],
          agency_name: item['agency_detail.agency_name']
        }));
        return response(res, status.DATA_AVAILABLE, 200, formattedData);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 200, []);
      }
    } catch (error) {
      console.log(error);
      return response(res, status.DATA_NOT_AVAILABLE, 500, { error: 'Internal Server Error' });
    }
  };

  static getLiftingDetailsSPAListData = async (req, res) => {
    try {
      let { state_code, spa_code, sector, year_of_indent, season, crop_code, variety_code, parental_line_code } = req.body;
      let year = year_of_indent

      let rules = {
        "state_code": 'required|integer',
        "spa_code": 'required|string',
        "season": 'required|string',
        "year_of_indent": 'required',
        // "variety_code": 'required|string',
        "crop_code": 'required|string',
      };

      let validation = new Validator(req.body, rules);
      const isValidData = validation.passes();

      if (!isValidData) {
        let errorResponse = {};
        for (let key in rules) {
          const error = validation.errors.get(key);
          if (error.length) {
            errorResponse[key] = error;
          }
        }
        return response(res, status.BAD_REQUEST, 400, errorResponse)
      }
      // if (sector) {
      //   //Change state code and spa code base on sector
      //   // let spaSectorDetails = await SpaDataBySector.getSPADetailBySector(spa_code, sector, state_code)
      //   // state_code = spaSectorDetails.stateCode
      //   // spa_code = spaSectorDetails.spa_code
      // }

      const whereClause = {
        year,
        season,
        crop_code,
        spa_state_code: state_code,
        spa_code
        // variety_code
      };
      const agencyData = await db.liftingSeedDetailsModel.findAll({
        attributes: ['variety_code', 'crop_code', 'year', 'user_id', 'season', 'variety_line_code', 'reason_id',
          'lifting_bill_no', 'id', 'payment_method_no', 'paid_by', 'total_price', 'bag_weight',
          [sequelize.col('m_variety_line.line_variety_name'), 'line_variety_name'],
          [sequelize.col('indent_of_spa.indent_quantity'), 'indent_quantity_spa'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [sequelize.col('m_crop_variety.id'), 'variety_id'],

          [sequelize.col('m_crop.crop_name'), 'crop_name'],
          [sequelize.col('indent_of_spa->indent_of_spa_line.quantity'), 'quantity'],
          [sequelize.col('agencyData.id'), 'bspc_id'],
          [sequelize.col('agencyData.agency_name'), 'agency_name'],

          [sequelize.col('receipt_request.amount_paid'), 'amount_paid'],
          [sequelize.col('receipt_request.payment_request'), 'payment_request'],
          [sequelize.col('receipt_request.amount'), 'amount'],
          [sequelize.col('receipt_request.bspc_id'), 'reciept_bspc_id'],
          [sequelize.col('receipt_request.payment_method'), 'payment_method'],
          [sequelize.col('receipt_request.transaction_number'), 'transaction_number'],
          [sequelize.col('receipt_request.id'), 'receipt_id'],

          [sequelize.col('allocation_to_spa_for_lifting_seed.id'), 'id'],
          [sequelize.col('lifting_seed_details.id'), 'lifting_id']
          // [sequelize.col('allocation_to_spa_for_lifting_seed->allocation_to_spa_for_lifting_seed_production_cnters.allocated_quantity'), 'allocated_quantity'] 
        ],
        include: [
          {
            model: db.mVarietyLinesModel,
            as: 'm_variety_line',
            attributes: [],
            required: false // LEFT JOIN
          },
          {
            model: db.cropVerietyModel,
            as: 'm_crop_variety',
            attributes: [],
            required: false // LEFT JOIN
          },
          {
            model: db.cropModel,
            as: 'm_crop',
            attributes: [],
            required: false // LEFT JOIN
          },
          {
            model: db.agencyDetailModel5,
            as: 'agencyData',
            attributes: [],
            required: false // LEFT JOIN
          },
          {
            model: db.indenterSPAModel,
            as: 'indent_of_spa',
            attributes: [],
            required: false,
            on: {
              state_code: sequelize.where(
                sequelize.col('indent_of_spa.state_code'),
                '=',
                sequelize.col('lifting_seed_details.spa_state_code')
              ),
              spa_code: sequelize.where(
                sequelize.col('indent_of_spa.spa_code'),
                '=',
                sequelize.col('lifting_seed_details.spa_code')
              ),
              variety_code: sequelize.where(
                sequelize.col('indent_of_spa.variety_code'),
                '=',
                sequelize.col('lifting_seed_details.variety_code')
              ),
            },
            include: [
              {
                model: db.indentOfSpaLinesModel,
                // as: 'indent_of_spa_line',
                attributes: [],
                require: false,
                // on: {
                //   indent_of_spa_id: sequelize.where(
                //     sequelize.col('indent_of_spa_line.indent_of_spa_id'),
                //     '=',
                //     sequelize.col('indent_of_spa.id')
                //   ),
                //   variety_code_line: sequelize.where(
                //      sequelize.col('indent_of_spa_line.variety_code_line'),
                //      '=',
                //      sequelize.col('lifting_seed_details.variety_line_code')
                //     )
                // },
              }
            ]
          },
          {
            model: db.receiptRequestModel,
            as: 'receipt_request',
            attributes: [],
            required: false, // LEFT JOIN
            on: {
              state_code: sequelize.where(
                sequelize.col('receipt_request.state_code'),
                '=',
                sequelize.col('lifting_seed_details.spa_state_code')
              ),
              spa_code: sequelize.where(
                sequelize.col('receipt_request.spa_code'),
                '=',
                sequelize.col('lifting_seed_details.spa_code')
              ),
              variety_code: sequelize.where(
                sequelize.col('receipt_request.variety_code'),
                '=',
                sequelize.col('lifting_seed_details.variety_code')
              ),
              bspc_id: sequelize.where(
                sequelize.col('receipt_request.bspc_id'),
                '=',
                sequelize.col('lifting_seed_details.user_id')
              ),
            },
          },


          {
            model: db.allocationToSPASeed,
            as: 'allocation_to_spa_for_lifting_seed',
            attributes: [],
            required: false, // LEFT JOIN
            on: {
              crop_code: sequelize.where(
                sequelize.col('allocation_to_spa_for_lifting_seed.crop_code'),
                '=',
                sequelize.col('lifting_seed_details.crop_code')
              ),
              year: sequelize.where(
                sequelize.col('allocation_to_spa_for_lifting_seed.year'),
                '=',
                sequelize.col('lifting_seed_details.year')
              ),
              variety_id: sequelize.where(
                sequelize.col('allocation_to_spa_for_lifting_seed.variety_id'),
                '=',
                sequelize.col('m_crop_variety.id')
              ),
            },
            // include:[
            //   {
            //     model: db.allocationSpaForLiftingSeed,
            //     attributes: [],
            //     require: false,
            //     on: {
            //       state_code: sequelize.where(
            //         sequelize.col('allocation_to_spa_for_lifting_seed->allocation_to_spa_for_lifting_seed_production_cnters.state_code'),
            //         '=',
            //         sequelize.col('lifting_seed_details.spa_state_code')
            //       ),
            //       spa_code: sequelize.where(
            //          sequelize.col('allocation_to_spa_for_lifting_seed->allocation_to_spa_for_lifting_seed_production_cnters.spa_code'),
            //          '=',
            //          sequelize.col('lifting_seed_details.spa_code')
            //         ),
            //     },
            //   }
            // ]
          },
        ],
        where:
          whereClause,


      });

      let filterData = []

      if (agencyData && agencyData.length > 0) {
        agencyData.forEach((item, index) => {
          let cropIndex;
          if (item.variety_line_code) {
            cropIndex = filterData.findIndex(items => items.variety_code == item.variety_code && items.parental_line_code == item.variety_line_code);
          } else {
            cropIndex = filterData.findIndex(items => items.variety_code == item.variety_code);
          }
          let indent_quantity;
          if (!item.variety_line_code || item.variety_line_code.trim() === '') {
            indent_quantity = item.get('quantity') ? item.get('quantity') : "NA";
          } else {
            indent_quantity = item.get('indent_quantity_spa') ? item.get('indent_quantity_spa') : "NA";
          }
          const initial_payment = item.get('payment_request') === 'initial_payment'
          const final_payment = item.get('payment_request') === 'final_payment'
          // const cropIndex =
          //  filterData.findIndex(item => item.crop_code == el.crop_code);
          const BASE_URL = process.env.BASE_URL
          const AESKey = process.env.AESKey
          const BILL_END_POINT = process.env.BILL_END_POINT
          const CERTIFICATE_END_POINT = process.env.CERTIFICATE_END_POINT

          let billUrl = null;
          let certificateUrl = null;

          if (item && item.lifting_id) {
            const encryptedForm = CryptoJS.AES.encrypt(JSON.stringify({ id: item.lifting_id }), AESKey).toString();
            const encryptedData = encodeURIComponent(encryptedForm);
            billUrl = `${BASE_URL}/${BILL_END_POINT}/${encryptedData}`
            console.log("receiptUrl---------", billUrl)
          }

          if (item && item.id) {
            const encryptedForm = CryptoJS.AES.encrypt(JSON.stringify({ id: item.id }), AESKey).toString();
            const encryptedData = encodeURIComponent(encryptedForm);
            // const encryptedData = item.id
            certificateUrl = `${BASE_URL}/${CERTIFICATE_END_POINT}/${encryptedData}`
            console.log("receiptUrl---------", certificateUrl)
          }

          let certificateUrlTest = `${BASE_URL}/${BILL_END_POINT}/${encodeURIComponent(CryptoJS.AES.encrypt(JSON.stringify({ id: 1 }), AESKey).toString())}`
          console.log("testreceiptUrl---------", certificateUrlTest)

          if (cropIndex == -1) {
            filterData.push(
              {
                year: item.year,
                season: item.season,
                variety_code: item.variety_code,
                variety_name: item.get('variety_name'),
                variety_id: item.get('variety_id'),
                crop_code: item.crop_code,
                crop_name: item.get('crop_name'),
                parental_line_code: item.variety_line_code ? item.variety_line_code : 'NA',
                parental_line: item.get('line_variety_name') ? item.get('line_variety_name') : 'NA',
                indent_quantity: indent_quantity,
                "bspc":
                  [
                    {
                      bspc_id: item.user_id,
                      bspc_name: item.get('agency_name'),
                      allocate_quantity: item.get('allocated_quantity'),
                      lifted_quantity: item.bag_weight,
                      bill_url: billUrl,
                      certificate_url: certificateUrl,

                      reason: item.reason_id,
                      bill_number: item.lifting_bill_no,
                      total_bill_amount: item.get('amount_paid'),
                      initial_paymnet: [
                        {
                          amount: item.get('amount'),
                          method: item.get('payment_method'),
                          transaction_number: item.get('transaction_number'),
                          payment_request: item.get('payment_request'),
                          receipt_id: item.get('receipt_id')
                        }
                      ],
                      final_payment: [
                        {
                          amount: item.get('total_price'),
                          method: item.get('paid_by'),
                          transaction_number: item.get('payment_method_no'),
                          payment_request: 'Paid',
                          lifting_id: item.get('lifting_id')
                          // payment_request:item.get('payment_request')
                        }
                      ],

                    }
                  ]
              }
            )
          }
          else {
            let varietyIndex = filterData[cropIndex].bspc.findIndex(items => items.bspc_id == item.user_id);
            // const varietyIndex = filterData[cropIndex].bspc.findIndex(item => item.variety_id === el.variety_id);
            if (varietyIndex != -1) {
              filterData[cropIndex].bspc[varietyIndex].initial_paymnet.push({
                amount: item.get('amount'),
                method: item.get('payment_method'),
                transaction_number: item.get('transaction_number'),
                payment_request: item.get('payment_request'),
                receipt_id: item.get('receipt_id')
              })
              filterData[cropIndex].bspc[varietyIndex].final_payment.push({
                amount: item.get('total_price'),
                method: item.get('paid_by'),
                transaction_number: item.get('payment_method_no'),
                payment_request: 'Paid',
                lifting_id: item.get('lifting_id')
                // lifting_id :item.id
              })
            }
            else {
              filterData[cropIndex].bspc.push(
                {
                  bspc_id: item.user_id,
                  bspc_name: item.get('agency_name'),
                  allocate_quantity: item.get('allocated_quantity'),
                  // lifted_quantity: 'Dummy',
                  lifted_quantity: item.bag_weight,
                  reason: item.reason_id,
                  bill_number: item.lifting_bill_no,
                  total_bill_amount: item.get('amount_paid'),
                  bill_url: billUrl,
                  certificate_url: certificateUrl,
                  initial_paymnet: [
                    {
                      amount: item.get('amount'),
                      method: item.get('payment_method'),
                      transaction_number: item.get('transaction_number'),
                      payment_request: item.get('payment_request'),
                      receipt_id: item.get('receipt_id')
                    }
                  ],
                  final_payment: [
                    {
                      // amount: item.get('total_price'),
                      method: item.get('paid_by'),
                      transaction_number: item.get('payment_method_no'),
                      // payment_request:item.get('payment_request')
                      amount: item.get('total_price'),
                      // method: item.get('payment_method'),
                      // transaction_number: item.get('transaction_number'),
                      payment_request: 'Paid',
                      lifting_id: item.get('lifting_id')
                      // lifting_id :item.id
                    }
                  ],
                }
              )
            }
          }

        });
      }
      if (filterData && filterData.length > 0) {
        filterData.forEach((el => {
          el.bspc.forEach(val => {
            val.initial_paymnet = productiohelper.removeDuplicates(val.initial_paymnet, 'receipt_id')
          })
          el.bspc.forEach(val => {
            val.final_payment = productiohelper.removeDuplicates(val.initial_paymnet, 'lifting_id')
          })
        }))
        filterData.forEach((el => {
          if (el && el.bspc && el.bspc.length > 0) {

            el.bspc.forEach(val => {
              // if (val && val.final_payment && val.final_payment.length > 0) {
              //   val.final_payment = val.final_payment.filter(transaction => transaction.payment_request !== "initial_payment");
              // }
              if (val && val.initial_paymnet && val.initial_paymnet.length > 0) {
                val.initial_paymnet = val.initial_paymnet.filter(transaction => transaction.payment_request !== "final_payment");
              }
              // val.final_payment.forEach()
            })
          }
        }))
      }
      // reciept_bspc_id
      console.log(filterData, 'filterData')

      if (filterData.length > 0) {
        return response(res, status.DATA_AVAILABLE, 200, filterData);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 200, []);
      }
    }
    catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }



  static getLiftingDetailsSPAListData11 = async (req, res) => {
    try {
      const { state_code, spa_code, sector, year, season, crop_code, variety_code, parental_line_code } = req.body;

      if (!state_code) {
        return response(res, status.STATE_CODE_REQUIRED, 400, null);
      }
      if (!spa_code) {
        return response(res, status.SPA_CODE_REQUIRED, 400, null);
      }
      if (!sector) {
        return response(res, status.SECTOR_REQUIRED, 400, null);
      }
      if (!year) {
        return response(res, status.YEAR_OF_INDENT_REQUIRED, 400, null);
      }
      if (!season) {
        return response(res, status.SEASON_REQUIRED, 400, null);
      }
      if (!crop_code) {
        return response(res, status.CROP_CODE_REQUIRED, 400, null);
      }
      if (!variety_code) {
        return response(res, status.VARIETY_CODE_REQUIRED, 400, null);
      }

      const whereClause = {
        year,
        season,
        crop_code,
      };

      const agencyData = await db.liftingSeedDetailsModel.findAll({
        attributes: [
          'variety_code', 'crop_code', 'year', 'season', 'variety_line_code', 'reason_id', 'lifting_bill_no',
          [sequelize.col('m_variety_line.line_variety_name'), 'line_variety_name'],
          [sequelize.col('indent_of_spa.indent_quantity'), 'indent_quantity_spa'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [sequelize.col('m_crop.crop_name'), 'crop_name'],
          [sequelize.col('indent_of_spa->indent_of_spa_line.quantity'), 'quantity'],
          [sequelize.col('agency_detail.id'), 'bspc_id'],
          // [sequelize.col('receipt_request.amount_paid'), 'amount_paid'],
        ],
        include: [
          {
            model: db.mVarietyLinesModel,
            as: 'm_variety_line',
            attributes: [],
            required: false,
          },
          {
            model: db.cropVerietyModel,
            as: 'm_crop_variety',
            attributes: [],
            required: false,
          },
          {
            model: db.cropModel,
            as: 'm_crop',
            attributes: [],
            required: false,
          },
          {
            model: db.agencyDetailModel,
            as: 'agency_detail',
            attributes: [],
            required: false,
          },
          {
            model: db.indenterSPAModel,
            as: 'indent_of_spa',
            attributes: [],
            required: false,
            on: {
              state_code: sequelize.where(
                sequelize.col('indent_of_spa.state_code'),
                '=',
                sequelize.col('lifting_seed_details.spa_state_code')
              ),
              spa_code: sequelize.where(
                sequelize.col('indent_of_spa.spa_code'),
                '=',
                sequelize.col('lifting_seed_details.spa_code')
              ),
              variety_code: sequelize.where(
                sequelize.col('indent_of_spa.variety_code'),
                '=',
                sequelize.col('lifting_seed_details.variety_code')
              ),
            },
            include: [
              {
                model: db.indentOfSpaLinesModel,
                attributes: [],
                required: false,
              }
            ]
          },
          // {
          //   model: db.receiptRequestModel,
          //   as: 'receipt_request',
          //   attributes: [],
          //   required: true,
          //   on: {
          //     state_code: sequelize.where(
          //       sequelize.col('receipt_request.state_code'),
          //       '=',
          //       sequelize.col('lifting_seed_details.spa_state_code')
          //     ),
          //     spa_code: sequelize.where(
          //       sequelize.col('receipt_request.spa_code'),
          //       '=',
          //       sequelize.col('lifting_seed_details.spa_code')
          //     ),
          //     variety_code: sequelize.where(
          //       sequelize.col('receipt_request.variety_code'),
          //       '=',
          //       sequelize.col('lifting_seed_details.variety_code')
          //     ),
          //   },
          // },
        ],
        where: whereClause,
      });

      if (agencyData.length > 0) {
        const formattedData = agencyData.map(item => {
          let indent_quantity;
          if (item.variety_line_code) {
            indent_quantity = item.get('quantity') ? item.get('quantity') : "NA";
          } else {
            indent_quantity = item.get('indent_quantity_spa') ? item.get('indent_quantity_spa') : "NA";
          }

          // const initial_payment = item.receipt_request && item.receipt_request.payment_request === 'initial_payment'
          //   ? {
          //       amount: item.receipt_request.amount,
          //       // method: item.receipt_request.payment_method,
          //       // transaction_number: item.receipt_request.transaction_number,
          //     }
          //   : {
          //       // amount: 'Dummy',
          //       // method: 'Dummy',
          //       // transaction_number: 'Dummy',
          //     };

          // const final_payment = item.receipt_request && item.receipt_request.payment_request === 'final_payment'
          //   ? {
          //       amount: item.receipt_request.amount,
          //       // method: item.receipt_request.payment_method,
          //       // transaction_number: item.receipt_request.transaction_number,
          //     }
          //   : {
          //       // amount: 'Dummy',
          //       // method: 'UPI',
          //       // transaction_number: 'Dummy',
          //     };

          return {
            year: item.year,
            season: item.season,
            variety_code: item.variety_code,
            variety_name: item.get('variety_name'),
            crop_code: item.crop_code,
            crop_name: item.get('crop_name'),
            parental_line_code: item.variety_line_code ? item.variety_line_code : 'NA',
            parental_line: item.get('line_variety_name') ? item.get('line_variety_name') : 'NA',
            indent_quantity: indent_quantity,
            bspc_details: [
              {
                bspc_id: item.get('bspc_id'),
                bspc_name: item.get('bspc_name'),
                allocate_quantity: 'Dummy',
                lifted_quantity: 'Dummy',
                availabity_seed: 'Dummy',
                reason: item.reason_id,
                bill_number: item.lifting_bill_no,
                // total_bill_amount: item.get('amount_paid'),
                // initial_payment: initial_payment,
                // final_payment: final_payment,

                // initial_payment: {
                //   amount: 'Dummy',
                //   method: "Dummy",
                //   transaction_number: "Dummy"
                // },
                // final_payment: {
                //   amount: 'Dummy',
                //   method: "UPI",
                //   transaction_number: "Dummy"
                // },
                certificate_number: "PQR-Dummy"
              }
            ]
          };
        });

        return response(res, status.DATA_AVAILABLE, 200, formattedData);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 200, []);
      }
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }

  // lifting breeder seeds
  static getLiftingBreederSeedsYear = async (req, res) => {
    // console.log("**************",req);
    try {
      let userId;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          user_id: req.body.loginedUserid.id
        }
      }
      // console.log("dfgshaj",userId);
      let condition = {
        // include: [
        //   // {
        //   //   model: db.allocationToIndentorSeed,
        //   //   attributes: [],
        //   //   where: {
        //   //     is_active: 0
        //   //   }
        //   // }
        // ],
        where: {
          ...userId
        },
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('lifting_seed_details.year')), 'year'],
        ]
      }

      let yearData = await db.liftingSeedDetailsModel.findAll(condition)
      if (yearData) {
        return response(res, status.DATA_AVAILABLE, 200, yearData);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, [])
      }
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }

  static getLiftingBreederSeedsSeasonData = async (req, res) => {
    try {
      let userId;
      // console.log('req.body.loginedUserid.id=====', req.body.loginedUserid.id);
      // if (req.body.loginedUserid && req.body.loginedUserid.id) {
      //   userId = {
      //     user_id: req.body.loginedUserid.id
      //   }
      // }

      let condition = {
        include: [
          {
            model: seasonModel,
            attributes: []
          }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('lifting_seed_details.season')), 'season'],
          [sequelize.col('m_season.season'), 'season_name'],

        ],
        where: {
          ...userId
        },
        raw: true
      }
      if (req.body && req.body.search) {
        if (req.body.search.year) {
          condition.where.year = req.body.search.year
        }
      }

      let seasonData = await db.liftingSeedDetailsModel.findAll(condition);
      console.log(seasonData);
      if (seasonData) {
        return response(res, status.DATA_AVAILABLE, 200, seasonData);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, [])
      }
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }

  static getLiftingBreederSeedsCropData = async (req, res) => {
    try {
      let userId;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          user_id: req.body.loginedUserid.id
        };
      }
      let condition = {
        include: [
          {
            model: cropModel,
            attributes: []
          }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('lifting_seed_details.crop_code')), 'crop_code'],
          [sequelize.col('m_crop.crop_name'), 'crop_name']
        ],
        where: {
          ...userId
        },
        raw: true
      };
      if (req.body && req.body.search) {
        if (req.body.search.year) {
          condition.where.year = req.body.search.year;
        }
        if (req.body.search.season) {
          condition.where.season = req.body.search.season;
        }
      }

      let cropData = await db.liftingSeedDetailsModel.findAll(condition);
      if (cropData) {
        return response(res, status.DATA_AVAILABLE, 200, cropData);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, []);
      }
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  };

  static getLiftingBreederSeedsTableData = async (req, res) => {
    try {
      const { user_id, crop_code, year, season, variety_code, variety_line_code } = req.body;
      const whereClause = {
      };
      if (user_id) {
        whereClause.user_id = user_id;
      }
      if (year) {
        whereClause.year = year;
      }
      if (season) {
        whereClause.season = season;
      }
      if (crop_code) {
        whereClause.crop_code = crop_code;
      }
      if (variety_code && variety_code.length > 0) {
        whereClause.variety_code = variety_code;
      }

      if (variety_line_code) {
        whereClause.variety_line_code = variety_line_code;
      }

      const receiptRequestData = await liftingSeedDetailsModel.findAll({
        include: [
          {
            model: cropVerietyModel,
            attributes: ['variety_name', 'variety_code']
          },
          {
            model: liftingTagNumberModel,
            attributes: ['tag_size', 'no_of_bags']
          },
          {
            model: userModel,
            as: 'usersModelIndenter',
            attributes: ['name', 'id']
          },
          {
            model: userModel,
            as: 'userModelSpa',
            attributes: ['spa_code', 'name'],
            include: [
              {
                model: agencyDetailModel,
                attributes: ['state_id'],
                where: {
                  // state_id: db.Sequelize.col('lifting_seed_details.spa_state_code')
                  state_id: 24
                }
              }
            ]
          },
          {
            model: allocationToSPASeed,
            attributes: [],
            include: [
              {
                model: allocationSpaForLiftingSeed,
                attributes: ['allocated_quantity'],
                where: {
                  // spa_code: db.Sequelize.col('lifting_seed_details.spa_code'),
                  // state_code: db.Sequelize.col('lifting_seed_details.spa_state_code')
                  spa_code: '1001',
                  state_code: 24
                }
              }
            ],
          },
          {
            model: indenterSPAModel,
            as: 'indenterSPAModell',
            attributes: ['indent_quantity'],
            required: false
          },
          {
            model: commentsModel,
            as: 'reason_for_short',
            attributes: ['comment']
          }
        ],
        where: whereClause,
        attributes: [
          'id',
          [db.Sequelize.fn('to_char', db.Sequelize.col('lifting_seed_details.created_at'), 'YYYY-MM-DD'), 'date_of_lifting']
        ],
        raw: true
      });

      const result = [];
      receiptRequestData.forEach(item => {
        let variety = result.find(v => v.variety_code === item['m_crop_variety.variety_code']);
        if (!variety) {
          variety = {
            id: item.id,
            variety_name: item['m_crop_variety.variety_name'],
            variety_code: item['m_crop_variety.variety_code'],
            indentor_details: []
          };
          result.push(variety);
        }

        let indenter = variety.indentor_details.find(i => i.indentor_id === item['usersModelIndenter.id']);
        if (!indenter) {
          indenter = {
            indentor_name: item['usersModelIndenter.name'],
            indentor_id: item['usersModelIndenter.id'],
            spa: []
          };
          variety.indentor_details.push(indenter);
        }
        let spaDetail = indenter.spa.find(s => s.spa_code === item['userModelSpa.spa_code']);
        if (!spaDetail) {
          spaDetail = {
            spa_code: item['userModelSpa.spa_code'],
            spa_name: item['userModelSpa.name'],
            indent_qty: item['indenterSPAModell.indent_quantity'],
            qty_of_breeder_seed: item['allocation_to_spa_for_lifting_seed.allocation_to_spa_for_liftin'],
            date_of_lifting: item.date_of_lifting,
            reason: item['reason_for_short.comment'],
            qty_lifted: 0,
            bagDetails: []
          };
          indenter.spa.push(spaDetail);
        }
        const bagDetail = {
          tag_size: item['lifting_tag_numbers.tag_size'],
          no_of_bags: item['lifting_tag_numbers.no_of_bags']
        };
        spaDetail.bagDetails.push(bagDetail);
        spaDetail.qty_lifted += bagDetail.tag_size * bagDetail.no_of_bags;
      });

      return response(res, status.DATA_AVAILABLE, 200, result);
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: error.message });
    }
  };

  static getLiftingBreederSeedsVarietyData = async (req, res) => {
    try {
      let userId = {};
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId.user_id = req.body.loginedUserid.id;
      }

      let condition = {
        include: [
          {
            model: varietyModel,
            attributes: ['variety_name'],
            required: true,
            as: 'm_crop_variety',
            where: sequelize.where(sequelize.col('lifting_seed_details.variety_code'), '=', sequelize.col('m_crop_variety.variety_code'))
          }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('lifting_seed_details.variety_code')), 'variety_code'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name']
        ],
        where: {
          ...userId
        },
        raw: true
      };

      if (req.body && req.body.search) {
        if (req.body.search.year) {
          condition.where.year = req.body.search.year;
        }
        if (req.body.search.season) {
          condition.where.season = req.body.search.season;
        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = req.body.search.crop_code;
        }
      }

      let varietyData = await db.liftingSeedDetailsModel.findAll(condition);
      if (varietyData) {
        return response(res, status.DATA_AVAILABLE, 200, varietyData);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, []);
      }
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  };
  // Chat Support Users



  // static getChatSupportUsers = async (req, res) => {
  //   try {
  //     const userId = req.body.loginedUserid ? req.body.loginedUserid.id : null;
  //     if (!userId) {
  //       return response(res, status.UNEXPECTED_ERROR, 400, "User ID is required");
  //     }

  //     let condition = {
  //       where: {
  //         id: {
  //           [db.Sequelize.Op.ne]: userId // Exclude the logged-in user
  //         },
  //         user_type: {
  //           [db.Sequelize.Op.ne]: 'SPA' // Exclude users with user_type = 'SPA'
  //         }
  //       },
  //       attributes: [
  //         'id',
  //         'name',
  //         'code',
  //         'email_id',
  //         'user_type',
  //         'mobile_number',
  //         [db.Sequelize.literal(`(
  //           SELECT COUNT(*)
  //           FROM "chats" AS "ReceivedMessages"
  //           WHERE "ReceivedMessages"."receiver_id" = ${userId}
  //           AND "ReceivedMessages"."sender_id" = "user"."id"
  //           AND "ReceivedMessages"."is_read" = FALSE
  //         )`), 'unreadCount'], // Unread messages count for this user as sender
  //         [db.Sequelize.literal(`(
  //           SELECT GREATEST(
  //             COALESCE((
  //               SELECT MAX("ReceivedMessages"."created_at")
  //               FROM "chats" AS "ReceivedMessages"
  //               WHERE "ReceivedMessages"."sender_id" = "user"."id"
  //               AND "ReceivedMessages"."receiver_id" = ${userId}
  //             ), '1970-01-01'),
  //             COALESCE((
  //               SELECT MAX("SentMessages"."created_at")
  //               FROM "chats" AS "SentMessages"
  //               WHERE "SentMessages"."receiver_id" = "user"."id"
  //               AND "SentMessages"."sender_id" = ${userId}
  //             ), '1970-01-01')
  //           )
  //         )`), 'lastMessageTime'] // Last message time between the two users
  //       ],
  //       order: [[db.Sequelize.literal('"lastMessageTime"'), 'DESC']], // Ensure correct quoting of the alias
  //       raw: true
  //     };

  //     let users = await db.userModel.findAll(condition);

  //     if (users) {
  //       return response(res, status.DATA_AVAILABLE, 200, users);
  //     } else {
  //       return response(res, status.DATA_NOT_AVAILABLE, 201, []);
  //     }
  //   } catch (error) {
  //     console.log('error', error);
  //     return response(res, status.UNEXPECTED_ERROR, 501, []);
  //   }
  // };
  // static getChatSupportUsers = async (req, res) => {
  //   try {
  //     const userId = req.body.loginedUserid ? req.body.loginedUserid.id : null;
  //     if (!userId) {
  //       return response(res, status.UNEXPECTED_ERROR, 400, "User ID is required");
  //     }

  //     // Ensure correct table joins and conditions
  //     let condition = {
  //       where: {
  //         id: {
  //           [db.Sequelize.Op.ne]: userId // Exclude the logged-in user
  //         },
  //         user_type: {
  //           [db.Sequelize.Op.ne]: 'SPA' // Exclude users with user_type = 'SPA'
  //         }
  //       },
  //       attributes: [
  //         'id', // From users table
  //         'user_type', // From users table
  //         'code', // From users table
  //         // Attributes from agency_details
  //         [db.Sequelize.col('agency_detail.agency_name'), 'name'], // Get agency_name as 'name'
  //         [db.Sequelize.col('agency_detail.email'), 'email_id'], // Get email from agency_details
  //         [db.Sequelize.col('agency_detail.mobile_number'), 'mobile_number'], // Get mobile_number from agency_details
  //         // Unread messages count for this user as sender
  //         [db.Sequelize.literal(`(
  //           SELECT COUNT(*)
  //           FROM "chats" AS "ReceivedMessages"
  //           WHERE "ReceivedMessages"."receiver_id" = ${userId}
  //           AND "ReceivedMessages"."sender_id" = "user"."id"
  //           AND "ReceivedMessages"."is_read" = FALSE
  //         )`), 'unreadCount'],
  //         // Last message time between the two users
  //         [db.Sequelize.literal(`(
  //           SELECT GREATEST(
  //             COALESCE((
  //               SELECT MAX("ReceivedMessages"."created_at")
  //               FROM "chats" AS "ReceivedMessages"
  //               WHERE "ReceivedMessages"."sender_id" = "user"."id"
  //               AND "ReceivedMessages"."receiver_id" = ${userId}
  //             ), '1970-01-01'),
  //             COALESCE((
  //               SELECT MAX("SentMessages"."created_at")
  //               FROM "chats" AS "SentMessages"
  //               WHERE "SentMessages"."receiver_id" = "user"."id"
  //               AND "SentMessages"."sender_id" = ${userId}
  //             ), '1970-01-01')
  //           )
  //         )`), 'lastMessageTime']
  //       ],
  //       include: [
  //         {
  //           model: db.agencyDetailModel, // Join with agency_details table
  //           as: 'agency_detail', // Alias for the join
  //           attributes: [] // Do not include extra fields; only the selected attributes above
  //         }
  //       ],
  //       order: [[db.Sequelize.literal('"lastMessageTime"'), 'DESC']], // Order by last message time
  //       raw: true
  //     };

  //     let users = await db.userModel.findAll(condition);

  //     if (users) {
  //       return response(res, status.DATA_AVAILABLE, 200, users);
  //     } else {
  //       return response(res, status.DATA_NOT_AVAILABLE, 201, []);
  //     }
  //   } catch (error) {
  //     console.log('error', error);
  //     return response(res, status.UNEXPECTED_ERROR, 501, []);
  //   }
  // };
  static getChatSupportUsers = async (req, res) => {
    try {
      const userId = req.body.loginedUserid ? req.body.loginedUserid.id : null;
      if (!userId) {
        return response(res, status.UNEXPECTED_ERROR, 400, "User ID is required");
      }

      const users = await db.userModel.findAll({
        where: {
          id: {
            [db.Sequelize.Op.ne]: userId // Exclude the logged-in user
          },
          user_type: {
            [db.Sequelize.Op.ne]: 'SPA' // Exclude users with user_type = 'SPA'
          }
        },
        attributes: [
          'id',
          'user_type',
          'code',
          [db.Sequelize.col('agency_detail.agency_name'), 'name'],
          [db.Sequelize.col('agency_detail.email'), 'email_id'],
          [db.Sequelize.col('agency_detail.mobile_number'), 'mobile_number'],
          [db.Sequelize.literal(`(
          SELECT COUNT(*)
          FROM "chats" AS "ReceivedMessages"
          WHERE "ReceivedMessages"."receiver_id" = ${userId}
            AND "ReceivedMessages"."sender_id" = "user"."id"
            AND "ReceivedMessages"."is_read" = FALSE
        )`), 'unreadCount'],
          [db.Sequelize.literal(`(
          SELECT GREATEST(
            COALESCE((
              SELECT MAX("ReceivedMessages"."created_at")
              FROM "chats" AS "ReceivedMessages"
              WHERE "ReceivedMessages"."sender_id" = "user"."id"
                AND "ReceivedMessages"."receiver_id" = ${userId}
            ), '1970-01-01'),
            COALESCE((
              SELECT MAX("SentMessages"."created_at")
              FROM "chats" AS "SentMessages"
              WHERE "SentMessages"."receiver_id" = "user"."id"
                AND "SentMessages"."sender_id" = ${userId} 
            ), '1970-01-01')
          )
        )`), 'lastMessageTime'] // Using created_at for last message time 

        ],


        include: [
          {
            model: db.agencyDetailModel, // Ensure this model is defined and correctly referenced
            as: 'agency_detail',
            attributes: [],
          }
        ],
        order: [[db.Sequelize.literal('"lastMessageTime"'), 'DESC']], // Adjusted to use the correct literal
      });

      if (users.length > 0) {
        return response(res, status.DATA_AVAILABLE, 200, users);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, []);
      }
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  };


  static saveChatMessage = async (req, res) => {
    try {
      console.log('Request body:', req.body);
      let userId;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = req.body.loginedUserid.id;
      }
      const { sender_id, receiver_id, msg } = req.body;

      if (!sender_id || !receiver_id || !msg) {
        return response(res, status.BAD_REQUEST, 400, { message: 'Missing required fields' });
      }

      // Convert time to IST
      const currentISTTime = new Date(new Date().getTime() + (5.5 * 60 * 60 * 1000));

      const newMessage = await db.Chats.create({
        sender_id: sender_id,
        receiver_id: receiver_id,
        msg: msg,
        created_at: currentISTTime,
        updated_at: currentISTTime,
        is_active: 1
      });

      console.log('Message saved:', newMessage);
      return response(res, status.SUCCESS, 201, newMessage);
    } catch (error) {
      console.error('Error saving chat message:', error);
      return response(res, status.UNEXPECTED_ERROR, 500, { message: 'An error occurred while saving the message' });
    }
  };

  static saveChatMessage = async (req, res) => {
    try {
      let userId;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = req.body.loginedUserid.id;
      }
      const { sender_id, receiver_id, msg } = req.body;

      if (!sender_id || !receiver_id || !msg) {
        return response(res, status.BAD_REQUEST, 400, { message: 'Missing required fields' });
      }

      // Convert time to IST (Indian Standard Time)
      const currentISTTime = new Date(new Date().getTime() + (5.5 * 60 * 60 * 1000));

      const newMessage = await db.Chats.create({
        sender_id: sender_id,
        receiver_id: receiver_id,
        msg: msg,
        created_at: currentISTTime,
        updated_at: currentISTTime,
        is_active: 1
      });

      return response(res, status.SUCCESS, 201, newMessage);
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 500, { message: 'An error occurred while saving the message' });
    }
  }
  static getSavedMessages = async (req, res) => {
    const { sender_id, receiver_id } = req.body;

    try {
      const messages = await db.Chats.findAll({
        where: {
          [Op.or]: [
            { sender_id: sender_id, receiver_id: receiver_id },
            { sender_id: receiver_id, receiver_id: sender_id }
          ]
        },
        order: [['created_at', 'ASC']]
      });

      res.status(200).json({ status_code: 200, data: messages });
    } catch (error) {
      res.status(500).json({ status_code: 500, message: 'Error fetching messages' });
    }
  };
  static markReadMessages = async (req, res) => {
    try {
      const { sender_id, receiver_id } = req.body;

      if (!sender_id || !receiver_id) {
        return res.status(400).json({ status_code: 400, message: 'sender_id and receiver_id are required' });
      }

      // Update the messages in the database
      await db.Chats.update(
        { is_read: true }, // Set is_read to true
        {
          where: {
            sender_id,
            receiver_id,
            is_read: false, // Only update unread messages
            is_active: 1,   // Only update active messages
          }
        }
      );

      res.status(200).json({ status_code: 200, message: 'Messages marked as read' });
    } catch (error) {
      console.error('Error marking messages as read:', error);
      res.status(500).json({ status_code: 500, message: 'Internal server error' });
    }
  }
  static totalunreadMessages = async (req, res) => {
    try {
      const userId = req.body.loginedUserid ? req.body.loginedUserid.id : null;
      if (!userId) {
        return response(res, status.UNEXPECTED_ERROR, 400, "User ID is required");
      }

      console.log('Received userId:', userId);

      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }
      const unreadCount = await db.Chats.count({
        where: {
          receiver_id: userId,
          is_read: false,
        },
      });

      res.status(200).json({
        status_code: 200,
        data: {
          unreadCount,
        },
      });
    } catch (error) {
      console.error('Error fetching unread message count:', error);
      res.status(500).json({
        status_code: 500,
        message: 'Failed to fetch unread message count',
      });
    }
  }
  static getBspcUsers = async (req, res) => {
    try {
      // Ensure userId is an integer or null
      const userId = req.body.loginedUserid && req.body.loginedUserid.id ? parseInt(req.body.loginedUserid.id, 10) : null;

      // Query to fetch all users with user_type = 'BPC'
      const bpcCenters = await db.userModel.findAll({
        where: {
          user_type: 'BPC',
        },
        attributes: [
          'id',
          ['name', 'user_name'],
        ],


        include: [
          {
            model: db.agencyDetailModel, // Ensure this model is defined and correctly referenced
            as: 'agency_detail',
            attributes: ['agency_name'],
          }
        ]
      });

      // Fetch the current user by userId
      let currentUser = null;
      if (userId !== null) {
        currentUser = await db.userModel.findByPk(userId);
      }

      // Combine the fetched BPC centers with the current user if applicable
      const result = [...bpcCenters];

      if (currentUser && currentUser.user_type === 'BPC' && !bpcCenters.some(user => user.id === currentUser.id)) {
        result.push(currentUser);
      }

      // Send the response with the data
      res.status(200).json({
        status_code: 200,
        data: result,
      });
    } catch (error) {
      console.error('Error fetching BPC centers:', error);
      res.status(500).json({
        status_code: 500,
        message: 'Internal Server Error',
      });
    }
  };

  static getLiftingSelfYear = async (req, res) => {
    try {
      const { production_type, radio_type } = req.body;
      let liftingSelfYearData;
      if (radio_type == 'national-temp') {
        liftingSelfYearData = await db.seedTagDetails.findAll({
          include: [
            {
              required: true,
              model: db.seedTagsModel,
              attributes: [],
              where: {
                is_active: 0
              }
            },
          ],
          attributes: [
            [sequelize.fn('DISTINCT', sequelize.col('seed_tag_details.year')), 'year']
          ],
          where: {
            user_id: req.body.loginedUserid.id,
            // is_self: production_type && (production_type == "direct") ? 0 : 1
          },
          raw: true
        })
      } else {
        liftingSelfYearData = await db.directIndentModel.findAll({
          include: [
            {
              required: true,
              model: db.seedTagDetails,
              attributes: []
            }
          ],
          attributes: [
            [sequelize.fn('DISTINCT', sequelize.col('indent_of_breederseed_direct.year')), 'year']
          ],
          where: {
            user_id: req.body.loginedUserid.id,
            is_self: production_type && (production_type == "direct") ? 0 : 1
          },
          raw: true
        })
      }
      if (liftingSelfYearData && liftingSelfYearData.length) {
        return response(res, status.DATA_AVAILABLE, 200, liftingSelfYearData);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, []);
      }
    } catch (error) {
      console.log('error====', error);
      return response(res, status.UNEXPECTED_ERROR, 501, {});
    }
  }

  static getLiftingSelfSeason = async (req, res) => {
    try {
      let { year, production_type, radio_type } = req.body && req.body.search;
      let yearValue;
      if (year) {
        yearValue = {
          year: year
        }
      }
      let liftingSelfSeasonData;
      if (radio_type == 'national-temp') {
        liftingSelfSeasonData = await db.seedTagDetails.findAll({
          include: [
            {
              required: true,
              model: db.seedTagsModel,
              attributes: [],
              where: {
                is_active: 0
              }
            },
            {
              required: true,
              model: db.indentOfBreederseedModel,
              attributes: [],
              where: {
                year: [sequelize.col('seed_tag_details.year')],
                season: [sequelize.col('seed_tag_details.season')],
                crop_code: [sequelize.col('seed_tag_details.crop_code')],
                variety_code: [sequelize.col('seed_tag_details.variety_code')],
              }
            }],
          attributes: [
            [sequelize.fn('DISTINCT', sequelize.col('seed_tag_details.season')), 'season']
          ],
          where: {
            user_id: req.body.loginedUserid.id,
            // is_self: production_type && (production_type == "direct") ? 0 : 1
          },
          raw: true
        })
      } else {
        liftingSelfSeasonData = await db.directIndentModel.findAll({
          include: [
            {
              required: true,
              model: db.seedTagDetails,
              attributes: []
            },
            {
              required: true,
              model: db.indentOfBreederseedModel,
              attributes: [],
              where: {
                year: [sequelize.col('seed_tag_details.year')],
                season: [sequelize.col('seed_tag_details.season')],
                crop_code: [sequelize.col('seed_tag_details.crop_code')],
                variety_code: [sequelize.col('seed_tag_details.variety_code')],
              }
            }
          ],
          attributes: [
            [sequelize.fn('DISTINCT', sequelize.col('indent_of_breederseed_direct.season')), 'season']
          ],
          where: {
            ...yearValue,
            user_id: req.body.loginedUserid.id,
            is_self: production_type && production_type == "direct" ? 0 : 1
          },
          raw: true
        })
      }
      if (liftingSelfSeasonData && liftingSelfSeasonData.length) {
        liftingSelfSeasonData.forEach((ele, i) => {
          if (ele.season == "K") {
            liftingSelfSeasonData[i].season_name = "Kharif"
          }
          if (ele.season == "R") {
            liftingSelfSeasonData[i].season_name = "Rabi"
          }
        })
        return response(res, status.DATA_AVAILABLE, 200, liftingSelfSeasonData);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, []);
      }
    } catch (error) {
      return response(res, status.SUCCESS, 501, {});
    }
  }

  static getLiftingSelfCrop = async (req, res) => {
    try {
      let { year, season, production_type, radio_type } = req.body && req.body.search;
      let yearValue;
      let seasonValue;
      if (year) {
        yearValue = {
          year: year
        }
      }
      if (season) {
        seasonValue = {
          season: season
        }
      }
      let liftingSelfCropData;
      if (radio_type == 'national-temp') {
        liftingSelfCropData = await db.seedTagDetails.findAll({
          include: [
            {
              model: db.cropModel,
              attributes: []
            },
            {
              required: true,
              model: db.seedTagsModel,
              attributes: [],
              where: {
                is_active: 0
              }
            },
            {
              required: true,
              model: db.indentOfBreederseedModel,
              attributes: [],
              where: {
                year: [sequelize.col('seed_tag_details.year')],
                season: [sequelize.col('seed_tag_details.season')],
                crop_code: [sequelize.col('seed_tag_details.crop_code')],
                variety_code: [sequelize.col('seed_tag_details.variety_code')],
              }
            }
          ],
          attributes: [
            [sequelize.fn('DISTINCT', sequelize.col('seed_tag_details.crop_code')), 'crop_code'],
            [sequelize.col('m_crop.crop_name'), 'crop_name']
          ],
          where: {
            user_id: req.body.loginedUserid.id,
            // is_self: production_type && (production_type == "direct") ? 0 : 1
          },
          raw: true
        })
      } else {
        liftingSelfCropData = await db.directIndentModel.findAll({
          include: [
            {
              model: db.cropModel,
              attributes: []
            },
            {
              required: true,
              model: db.seedTagDetails,
              attributes: []
            }
          ],
          attributes: [
            [sequelize.fn('DISTINCT', sequelize.col('indent_of_breederseed_direct.crop_code')), 'crop_code'],
            [sequelize.col('m_crop.crop_name'), 'crop_name']
          ],
          where: {
            ...yearValue,
            ...seasonValue,
            user_id: req.body.loginedUserid.id,
            is_self: production_type && production_type == "direct" ? 0 : 1
          },
          raw: true
        })
      }

      if (liftingSelfCropData && liftingSelfCropData.length) {
        console.log("liftingSelfCropData", liftingSelfCropData);
        return response(res, status.SUCCESS, 200, liftingSelfCropData);

      } else {
        return response(res, status.SUCCESS, 201, []);
      }
    } catch (error) {
      console.log(error);
      return response(res, status.SUCCESS, 501, {});
    }
  }

  static getLiftingSelfVariety = async (req, res) => {
    try {

      let { year, season, crop, production_type, radio_type } = req.body?.search || {};
      let conditions = {};

      if (year) conditions.year = year;
      if (season) conditions.season = season;
      if (crop) conditions.crop_code = crop;
      let liftingSelfCropData;
      if (radio_type == 'national-temp') {
        liftingSelfCropData = await db.seedTagDetails.findAll({
          include: [
            {
              model: db.varietyModel,
              attributes: []
            },
            {
              required: true,
              model: db.seedTagsModel,
              attributes: [],
              where: {
                is_active: 0
              }
            },
            {
              required: true,
              model: db.indentOfBreederseedModel,
              attributes: [],
              where: {
                year: [sequelize.col('seed_tag_details.year')],
                season: [sequelize.col('seed_tag_details.season')],
                crop_code: [sequelize.col('seed_tag_details.crop_code')],
                variety_code: [sequelize.col('seed_tag_details.variety_code')],
              }
            }
          ],
          attributes: [
            [sequelize.fn('DISTINCT', sequelize.col('seed_tag_details.variety_code')), 'variety_code'],
            [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          ],
          where: {
            ...conditions,
            user_id: req.body.loginedUserid?.id,
            // is_self: production_type && production_type == "direct" ? 0 : 1
          },
          raw: true
        });
      } else {
        liftingSelfCropData = await db.directIndentModel.findAll({

          include: [
            {
              model: db.varietyModel,
              attributes: []
            },
            {
              required: true,
              model: db.seedTagDetails,
              attributes: []
            }
          ],
          attributes: [
            [sequelize.fn('DISTINCT', sequelize.col('indent_of_breederseed_direct.variety_code')), 'variety_code'],
            [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          ],
          where: {
            ...conditions,
            user_id: req.body.loginedUserid?.id,
            is_self: production_type && production_type == "direct" ? 0 : 1
          },
          raw: true
        });
      }


      if (liftingSelfCropData?.length) {
        return response(res, status.SUCCESS, 200, liftingSelfCropData);
      } else {
        return response(res, status.SUCCESS, 201, []);
      }
    } catch (error) {
      console.error('Error fetching lifting self variety data:', error);
      return response(res, status.SUCCESS, 501, {});
    }
  };



  static getLiftingSelfSpaDetails = async (req, res) => {
    try {
      let { year, season, crop_code, variety_code } = req.body && req.body.search;
      let yearValue;
      let seasonValue;
      let cropValue;
      let varietyValue;
      if (year) {
        yearValue = {
          year: year
        }
      }
      if (season) {
        seasonValue = {
          season: season
        }
      }
      if (crop_code) {
        cropValue = {
          crop_code: crop_code
        }
      }
      if (variety_code) {
        varietyValue = {
          variety_code: variety_code
        }
      }
      let is_self;
      if (req.body.search.radio_type == 'national-temp') {
        is_self = { is_self: 1 }
      }
      let liftingSelfCropData = await db.directIndentModel.findAll({
        include: [
          {
            model: db.stateModel,
            attributes: []
          },
          {
            model: db.districtModel,
            attributes: []
          }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('indent_of_breederseed_direct.spa_name')), 'spa_name'],
          [sequelize.col('indent_of_breederseed_direct.spa_mobile_number'), 'spa_mobile_number'],
          [sequelize.col('indent_of_breederseed_direct.spa_address'), 'spa_address'],
          [sequelize.col('indent_of_breederseed_direct.state_code'), 'state_code'],
          [sequelize.col('m_state.state_name'), 'state_name'],
          [sequelize.col('indent_of_breederseed_direct.district_code'), 'district_code'],
          [sequelize.col('m_district.district_name'), 'district_name'],
        ],
        where: {
          ...yearValue,
          ...seasonValue,
          ...cropValue,
          user_id: req.body.loginedUserid.id,
          // is_self: 1
          ...is_self
        },
        raw: true
      })
      if (liftingSelfCropData && liftingSelfCropData.length) {
        return response(res, status.SUCCESS, 200, liftingSelfCropData);
      } else {
        return response(res, status.SUCCESS, 201, []);
      }
    } catch (error) {
      console.log(error);
      return response(res, status.SUCCESS, 501, {});
    }
  }


  static liftingSurplusBreederStockDetails = async (req, res) => {
    try {
      let userId;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          user_id: req.body.loginedUserid.id
        }
      }

      let conditionSecond = {
        include: [
          {
            model: db.liftingTagNumberModel,
            attributes: []
          }
        ],
        attributes: [
          [sequelize.col('lifting_tag_number.tag_no'), 'tag_no']
        ],
        where: {
          year: req.body && req.body.search && req.body.search.year ? req.body.search.year : '',
          season: req.body && req.body.search && req.body.search.season ? req.body.search.season : '',
          crop_code: req.body && req.body.search && req.body.search.crop_code ? req.body.search.crop_code : ''
        },
        raw: true
      }
      let isDataExist = await db.liftingSeedDetailsModel.findAll(conditionSecond);
      let lotnoArray = []
      let lotnoarraycondtion;
      if (isDataExist && isDataExist.length) {
        isDataExist.forEach((ele) => {
          lotnoArray.push(ele.tag_no)
        })
      }
      if (lotnoArray && lotnoArray.length) {
        lotnoarraycondtion = {
          tag_no: {
            [Op.notIn]: lotnoArray
          }
        }
      }
      let condition;
      if (req.body.search.radio_type == 'national-temp') {
        // condition = {
        //   include: [
        //     {
        //       model: db.seedTagRange,
        //       attributes: []
        //     },
        //     {
        //       required:true,
        //       model: db.seedTagsModel,
        //       attributes: [],
        //       where: {
        //         is_active: 0
        //       }
        //     },
        //     // {
        //     //   model: db.seedTagsModel,
        //     //   attributes: [],
        //     //   where:{
        //     //     ...lotnoarraycondtion
        //     //   }
        //     // },
        //     {
        //       required: true,
        //       model: db.indentOfBreederseedModel,
        //       attributes: [],
        //       where: {
        //         year: [sequelize.col('seed_tag_details.year')],
        //         season: [sequelize.col('seed_tag_details.season')],
        //         crop_code: [sequelize.col('seed_tag_details.crop_code')],
        //         variety_code: [sequelize.col('seed_tag_details.variety_code')],
        //       }
        //     },
        //     {
        //       model: db.varietyModel,
        //       attributes: []
        //     },
        //     {
        //       model: db.varietLineModel,
        //       attributes: []
        //     }
        //   ],
        //   attributes: [
        //     [sequelize.col('seed_tag_details.lot_no'), 'lot_no'],
        //     [sequelize.col('seed_tag_details.lot_id'), 'lot_id'],
        //     [sequelize.col('seed_tag_range.bag_weight'), 'bag_weight'],
        //     [sequelize.col('seed_tag_details.godown_no'), 'godown_no'],
        //     [sequelize.col('seed_tag_details.stack_no'), 'stack_no'],
        //     [sequelize.col('seed_tag_details.lot_qty'), 'lot_qty'],
        //     [sequelize.col('seed_tag_details.no_of_bags'), 'no_of_bags'],
        //     [sequelize.col('seed_tag_details.variety_code'), 'variety_code'],
        //     [sequelize.col('seed_tag_details.variety_line_code'), 'variety_line_code'],
        //     [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
        //     [sequelize.col('m_variety_line.line_variety_name'), 'line_variety_name'],
        //   ],
        //   raw: true,
        //   where: {
        //     // ...lotnoarraycondtion,
        //     // ...userId
        //   },
        //   distinct: true,
        // }
        condition = {
          include: [
            {
              model: db.seedTagRange,
              attributes: []
            },
            {
              required: true,
              model: db.seedTagsModel,
              attributes: [],
              where: {
                is_active: 0
              }
            },
            {
              required: true,
              model: db.indentOfBreederseedModel,
              attributes: [],
              where: {
                year: [sequelize.col('seed_tag_details.year')],
                season: [sequelize.col('seed_tag_details.season')],
                crop_code: [sequelize.col('seed_tag_details.crop_code')],
                variety_code: [sequelize.col('seed_tag_details.variety_code')],
              }
            },
            {
              model: db.varietyModel,
              attributes: []
            },
            {
              model: db.varietLineModel,
              attributes: []
            }
          ],
          attributes: [
            [sequelize.fn('DISTINCT', sequelize.col('seed_tag_details.lot_no')), 'lot_no'],
            [sequelize.col('seed_tag_details.lot_id'), 'lot_id'],
            [sequelize.col('seed_tag_range.bag_weight'), 'bag_weight'],
            [sequelize.col('seed_tag_details.godown_no'), 'godown_no'],
            [sequelize.col('seed_tag_details.stack_no'), 'stack_no'],
            [sequelize.col('seed_tag_details.lot_qty'), 'lot_qty'],
            [sequelize.col('seed_tag_details.no_of_bags'), 'no_of_bags'],
            [sequelize.col('seed_tag_details.variety_code'), 'variety_code'],
            [sequelize.col('seed_tag_details.variety_line_code'), 'variety_line_code'],
            [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
            [sequelize.col('m_variety_line.line_variety_name'), 'line_variety_name'],
          ],
          where: {
            // Add any dynamic conditions here
          },
          raw: true,
          distinct: true, // ✅ Prevents duplicate rows
        }
      } else {
        condition = {
          include: [
            {
              model: db.seedTagRange,
              attributes: []
            },
            // {
            //   model: db.seedTagsModel,
            //   attributes: [],
            //   where:{
            //     ...lotnoarraycondtion
            //   }
            // },
            {
              model: db.varietyModel,
              attributes: []
            },
            {
              model: db.varietLineModel,
              attributes: []
            }
          ],
          attributes: [
            [sequelize.col('seed_tag_details.lot_no'), 'lot_no'],
            [sequelize.col('seed_tag_details.lot_id'), 'lot_id'],
            [sequelize.col('seed_tag_range.bag_weight'), 'bag_weight'],
            [sequelize.col('seed_tag_details.godown_no'), 'godown_no'],
            [sequelize.col('seed_tag_details.stack_no'), 'stack_no'],
            [sequelize.col('seed_tag_details.lot_qty'), 'lot_qty'],
            [sequelize.col('seed_tag_details.no_of_bags'), 'no_of_bags'],
            [sequelize.col('seed_tag_details.variety_code'), 'variety_code'],
            [sequelize.col('seed_tag_details.variety_line_code'), 'variety_line_code'],
            [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
            [sequelize.col('m_variety_line.line_variety_name'), 'line_variety_name'],
          ],
          raw: true,
          where: {
            // ...lotnoarraycondtion,
            // ...userId
          },
        }
      }

      if (req.body) {
        if (req.body.search.year) {
          condition.where.year = req.body.search.year;
          conditionSecond.where.year = req.body.search.year;
        }

        if (req.body.search.season) {
          condition.where.season = req.body.search.season
          conditionSecond.where.season = req.body.search.season;
        }

        if (req.body.search.crop_code) {
          condition.where.crop_code = req.body.search.crop_code
          conditionSecond.where.crop_code = req.body.search.crop_code;
        }

        if (req.body.search.variety_code) {
          condition.where.variety_code = req.body.search.variety_code;
          conditionSecond.where.variety_code = req.body.search.variety_code;
        }
      }

      let lotNoDetailsData = await db.seedTagDetails.findAll(condition);
      if (lotNoDetailsData && lotNoDetailsData.length) {
        const filteredData = [];
        lotNoDetailsData.forEach(el => {
          const spaIndex = filteredData.findIndex(item => item.variety_code == el.variety_code);
          if (spaIndex === -1) {
            filteredData.push({
              variety_name: el.variety_name,
              variety_code: el.variety_code,
              line_variety_name: el && el.line_variety_name ? el.line_variety_name : '',
              variety_line_code: el && el.variety_line_code ? el.variety_line_code : '',
              bsplength: 1,
              "bsp2_Deteials": [
                {
                  lot_number: el.lot_no,
                  lot_quantity: el.lot_qty,
                  no_of_bags: el && el.no_of_bags ? el.no_of_bags : '',
                  bag_weight: el && el.bag_weight ? el.bag_weight : '',
                  bag_details: "Bag Detail 1",
                  area_shown: el.stack_no ? el.stack_no : '',
                  godown_no: el.godown_no ? el.godown_no : '',
                  stack_no: el.stack_no ? el.stack_no : ''
                }
              ]
            });
          } else {
            filteredData[spaIndex].bsp2_Deteials.push({
              lot_number: el.lot_no,
              lot_quantity: el.lot_qty,
              no_of_bags: el.no_of_bags,
              bag_details: "Bag Detail 1",
              area_shown: el.stack_no ? el.stack_no : '',
              godown_no: el.godown_no ? el.godown_no : '',
              stack_no: el.stack_no ? el.stack_no : ''
            });
            // const cropIndex = filteredData[spaIndex].bsp2_Deteials.findIndex(item => item.line_variety_code == el.line_variety_code);
            // if (cropIndex !== -1) {
            //     filteredData[spaIndex].variety_line[cropIndex].bspc.push(
            //         {
            //             state_code: el && el.state_code ? el.state_code : '',
            //             district_code: el && el.district_code ? el.district_code : '',
            //             team_name: el && el.team_name ? el.team_name : '',
            //             team_id: el && el.team_id ? el.team_id : '',
            //             bspc_name: el.bspc_name,
            //             include_seed: el && el.nucleus_seed_available_qnt ? el.nucleus_seed_available_qnt : 0,
            //             breeder_seed: el && el.breeder_seed_available_qnt ? el.breeder_seed_available_qnt : 0,
            //             target_quantity: el.target_qunatity,
            //             count: 1,
            //             id: el.bspc_id,
            //             isPermission: el.isPermission ? el.isPermission : '',
            //             production_type: el.production_type ? el.production_type : '',
            //             bspperformaoneid: el.bspperformaoneid,
            //             seed_for_production_id: el && el.bspMatch && el.bspMatch.seed_for_production_id ? el.bspMatch.seed_for_production_id : '',
            //         }
            //     );
            // }
          }
        });
        let responseData = [];
        if (filteredData && filteredData.length) {
          filteredData.forEach((item, i) => {
            filteredData[i].bsplength = item.bsp2_Deteials.length;
          });
        }
        responseData = filteredData;
        response(res, status.DATA_AVAILABLE, 200, responseData);
      } else {
        response(res, status.DATA_NOT_AVAILABLE, 201, []);
      }
    } catch (erorr) {
      console.log('erorr==', erorr);
      return response(res, status.SUCCESS, 501, {});
    }

  }
  static getliftingSurplusBreederStockDetails = async (req, res) => {
    try {
      let userId;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          production_center_id: req.body.loginedUserid.id
        };
      }
      let { variety_id, indenter_id, spa_code, indenter, crop_code, year, season, variety_code } = req.body.search;
      let whereClause = {}
      let whereClause2 = {};
      let whereClause3 = {}
      if (year) {
        whereClause3.year = year
      }
      if (season) {
        whereClause3.season = season
      }
      if (crop_code) {
        whereClause3.crop_code = crop_code
      }

      if (indenter_id && indenter_id.length > 0) {
        whereClause.indent_of_breeder_id = {
          [Op.in]: req.body.search.indenter_id
        };
      }
      if (indenter && indenter.length > 0) {
        whereClause.indent_of_breeder_id = {
          [Op.in]: req.body.search.indenter
        };
      }
      if (spa_code && spa_code.length > 0) {

        whereClause2.spa_code = {
          [Op.in]: req.body.search.spa_code
        };
      }


      let condition = {
        include: [
          {
            model: db.varietyModel,
            attributes: ['variety_code', 'variety_name']
          },
          {
            model: db.allocationToIndentorProductionCenterSeed,
            where: {
              ...whereClause,
              ...userId
              // ...whereClause2
              // ...where: {
              // },
            },
            include: [{
              model: db.userModel,


              attributes: ['name']
            },
            {
              model: db.agencyDetailModel,
              attributes: ['state_id']
            }
            ],
            attributes: ['id', 'indent_of_breeder_id']
          },

        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('allocation_to_indentor_for_lifting_seeds.variety_id')), 'variety_id'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [sequelize.col('m_crop_variety.variety_code'), 'variety_code'],
          // [sequelize.col('allocation_to_indentor_for_lifting_seeds->agency_detail.id'), 'agencyId'],
          [sequelize.col('allocation_to_indentor_for_lifting_seeds.variety_line_code'), 'variety_line_code']

          // [sequelize.col('allocation_to_indentor_for_lifting_seeds.id'), 'ids']
        ],
        nest: true,
        raw: true,
        where: {
          ...whereClause3
          // ...userId
        }
      };
      let datas = await db.allocationToSPASeed.findAll({
        include: [
          {
            model: db.allocationSpaForLiftingSeed,
            where: {
              ...whereClause2,
              ...userId
            },

            attributes: []
          },
        ],
        attributes: [
          [sequelize.col('allocation_to_spa_for_lifting_seed_production_cnters.state_code'), 'state_code'],
          [sequelize.col('allocation_to_spa_for_lifting_seed_production_cnters.spa_code'), 'spa_code'],
          [sequelize.col('allocation_to_spa_for_lifting_seeds.variety_id'), 'variety_id'],
          [sequelize.col('allocation_to_spa_for_lifting_seeds.variety_line_code'), 'variety_line_code'],
          // [sequelize.col('allocation_to_spa_for_lifting_seeds.user_id'), 'user_id'],
          // [sequelize.col('allocation_to_spa_for_lifting_seed->user.name'),'name']
        ],
        raw: true,
        where: {
          ...whereClause3,
          // production_center_id:req.body.loginedUserid.id

          // is_freeze:1
        }
      })
      let allocationData = []
      if (datas && datas.length > 0) {
        for (let key of datas) {
          let data = await db.allocationToSPASeed.findAll({
            include: [
              {
                model: db.allocationSpaForLiftingSeed,
                where: {
                  ...whereClause2,
                  ...userId
                },
                include: [
                  {
                    model: db.userModel,
                    where: {
                      // spa_code: key.spa_code
                      // state_id:sequelize.col('allocation_to_spa_for_lifting_seed_production_cnters.state_code')
                    },
                    include: [
                      {
                        model: db.agencyDetailModel,
                        where: {
                          state_id: key.state_code
                          // state_id:sequelize.col('allocation_to_spa_for_lifting_seed_production_cnters.state_code')
                        },
                        attributes: []
                      }
                    ],
                    attributes: []
                  },

                ],
                attributes: []
              },
            ],
            attributes: [
              [sequelize.col('allocation_to_spa_for_lifting_seeds.variety_id'), 'variety_id'],
              [sequelize.col('allocation_to_spa_for_lifting_seed_production_cnters.spa_code'), 'spa_code'],
              [sequelize.col('allocation_to_spa_for_lifting_seed_production_cnters.allocated_quantity'), 'allocated_quantity'],
              [sequelize.col('allocation_to_spa_for_lifting_seed_production_cnters.state_code'), 'state_code'],
              [sequelize.col('allocation_to_spa_for_lifting_seed_production_cnters.id'), 'productionCenterId'],
              [sequelize.col('allocation_to_spa_for_lifting_seeds.id'), 'id'],
              [sequelize.col('allocation_to_spa_for_lifting_seed_production_cnters->user.name'), 'name'],

              [sequelize.col('allocation_to_spa_for_lifting_seeds.variety_line_code'), 'variety_line_code'],
              [sequelize.col('allocation_to_spa_for_lifting_seeds.user_id'), 'user_id'],
              [sequelize.col('allocation_to_spa_for_lifting_seed_production_cnters->user->agency_details.agency_name'), 'agency_name'],
              // [sequelize.col('allocation_to_spa_for_lifting_seeds->user->agency_details.agency_name'),'agency_name']
            ],
            raw: true,
            where: {
              ...whereClause3,
              variety_id: key.variety_id,
              variety_line_code: key.variety_line_code

              // production_center_id:req.body.loginedUserid.id
              // is_freeze:1
            }
          })
          allocationData.push(data)
        }
      }
      if (allocationData && allocationData.length > 0) {
        allocationData = allocationData ? allocationData.flat() : ''
      }
      // console.log(allocationData,'allocationData')
      allocationData = productiohelper.removeDuplicates(allocationData, 'productionCenterId')
      let liftingData = await db.liftingSeedDetailsModel.findAll({
        include: [
          {
            model: varietyModel,
            attributes: ['id']
          },
          {
            model: db.commentsModel,
            attributes: ['id', 'comment']
          }
        ],
        where: {
          year: req.body.search.year,
          season: req.body.search.season,
          crop_code: req.body.search.crop_code,
          is_self: 1
        },
        raw: true
      })
      console.log(liftingData, 'liftingData')
      console.log('allocationData', allocationData);
      if (allocationData && allocationData.length > 0) {
        if (liftingData && liftingData.length > 0) {
          allocationData = allocationData.map(entry => {
            const matchingEntry = liftingData.find(e =>
              e['m_crop_variety.id'] === entry.variety_id ||
              e.spa_code === entry.spa_code || e.spa_state_code === entry.state_code &&
              (entry.variety_line_code === null || e.variety_line_code === entry.variety_line_code)
            );

            if (matchingEntry) {
              return {
                ...entry,
                lifting_id: matchingEntry && matchingEntry.id ? matchingEntry.id : null,
                payment_method_no: matchingEntry && matchingEntry.payment_method_no ? matchingEntry.payment_method_no : null,
                paid_by: matchingEntry && matchingEntry.paid_by ? matchingEntry.paid_by : null,
                no_of_bag: matchingEntry && matchingEntry.no_of_bag ? matchingEntry.no_of_bag : null,
                bag_weight: matchingEntry && matchingEntry.bag_weight ? matchingEntry.bag_weight : null,
                total_price: matchingEntry && matchingEntry.total_price ? matchingEntry.total_price : null,
                reason_id: matchingEntry && matchingEntry['comment.id'] ? matchingEntry['comment.id'] : null,
                comment: matchingEntry && matchingEntry['comment.comment'] ? matchingEntry['comment.comment'] : null,

              };
            } else {
              return {
                ...entry,
                no_of_bag: null,
                bag_weight: null,
                lifting_id: null,
                payment_method_no: null,
                paid_by: null,
                total_price: null,
                reason_id: matchingEntry && matchingEntry['comment.id'] ? matchingEntry['comment.id'] : null,
                comment: matchingEntry && matchingEntry['comment.comment'] ? matchingEntry['comment.comment'] : null
              }
            }
            return entry;
          });
        }
      }
      // console.log(allocationData)
      console.log(allocationData, 'allocationData')
      if (req.body) {
        if (req.body.search) {
          if (req.body.search.year) {
            condition.where.year = req.body.search.year;
            // condition1.where.year = req.body.search.year;
          }

          if (req.body.search.season) {
            condition.where.season = req.body.search.season;
            // condition1.where.season = req.body.search.season;
          }
          if (req.body.search.crop) {
            condition.where.crop_code = req.body.search.crop;
            // condition1.where.crop_code = req.body.search.crop_code;
          }
          if (req.body.search.crop_code) {
            condition.where.crop_code = req.body.search.crop_code;
            // condition1.where.crop_code = req.body.search.crop_code;
          }
          if (req.body.search.variety_code) {
            condition.where.variety_code = req.body.search.variety_code
          }

          if (req.body.search.variety_id && req.body.search.variety_id.length > 0) {

            condition.where.variety_id = {
              [Op.in]: req.body.search.variety_id
            };
            // condition1.where.variety_id = {
            //   [Op.in]:req.body.search.variety_id
            // };
          }
        }

      }
      let allocationToIndentorSeedData = await db.allocationToIndentorSeed.findAll(condition);
      // console.log(allocationToIndentorSeedData,'allocationToIndentorSeedData')
      console.log('allocationData===', allocationData);
      const result = allocationToIndentorSeedData.map(variety => {
        let varietySpas;
        if (variety.variety_line_code) {
          varietySpas = allocationData.filter(spa => spa.variety_id === variety.variety_id && spa.variety_line_code == variety.variety_line_code && spa.user_id == variety.allocation_to_indentor_for_lifting_seed_production_cnter.indent);
        } else {
          varietySpas = allocationData.filter(spa => spa.variety_id === variety.variety_id && spa.user_id == variety.allocation_to_indentor_for_lifting_seed_production_cnter.indent);

        }
        return {
          ...variety,
          spas: varietySpas.length > 0 ? varietySpas : [{
            variety_id: null,
            spa_code: null,
            state_code: variety.allocation_to_indentor_for_lifting_seed_production_cnter.agency,
            productionCenterId: null,
            agencyId: null,
            id: null,
            name: null,
            allocated_quantity: null,
            variety_line_code: null,
            lifting_id: null,
            payment_method_no: null,
            paid_by: null,
            total_price: null
          }]
        };
      });

      // Combine results
      if (result) {
        response(res, status.DATA_AVAILABLE, 200, result);
      } else {
        response(res, status.DATA_NOT_AVAILABLE, 201, []);
      }

    } catch (error) {
      console.log(error);
      response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }
  static getliftingSurplusBreederSpaDetails = async (req, res) => {
    let data = {};
    try {
      let condition = {
        include: [
          {
            model: db.userModel,
            left: true,
            attributes: [],
            where: {
              user_type: 'SPA'
            }
          },
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('user.name')), 'spa_name'],
          [sequelize.col('agency_details.user_id'), 'spa_id'],
          [sequelize.col('user.spa_code'), 'spa_code'],
          [sequelize.col('agency_details.agency_name'), 'spa_short_name'],
          [sequelize.col('user.id'), 'spa_short_id'],
          [sequelize.col('agency_details.mobile_number'), 'mobile_number'],
          [sequelize.col('agency_details.address'), 'address'],
          [sequelize.col('agency_details.email'), 'email'],
        ],
        where: {
        },
        raw: true
      };
      // condition.order = [['agency_name', 'ASC'], ['short_name', 'ASC']];

      if (req.body && req.body.search) {
        if (req.body.search.state_code) {
          condition.where.state_id = (req.body.search.state_code);
        }
        if (req.body.search.district_code) {
          condition.where.district_id = (req.body.search.district_code);
        }
        if (req.body.search.agency_id) {
          condition.where.id = (req.body.search.agency_id);
        }
      }
      data = await db.agencyDetailModel.findAll(condition);
      return response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      return response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  // static getliftingSurplusBreederVariety = async (req, res) => {
  //   try {
  //     let condition = {
  //       include: [
  //         {
  //           model: db.varietyModel,
  //           attributes: []
  //         }
  //       ],
  //       attributes: [
  //         [sequelize.fn('DISTINCT', sequelize.col('lifting_seed_details.variety_code')), 'variety_code'],
  //         [sequelize.col('m_crop_variety.variety_name'), 'variety_name']
  //       ],
  //       where: {

  //       },
  //       raw: true
  //     }
  //     if (req.body && req.body.search) {
  //       if (req.body.search.year) {
  //         condition.where.year = req.body.search.year
  //       }
  //       if (req.body.search.season) {
  //         condition.where.season = req.body.search.season
  //       }
  //       if (req.body.search.crop_code) {
  //         condition.where.crop_code = req.body.search.crop_code
  //       }
  //     }
  //     let liftingVarietyData = await db.liftingSeedDetailsModel.findAll(condition);
  //     if (liftingVarietyData && liftingVarietyData.length) {
  //       return response(res, status.DATA_NOT_AVAILABLE, 200)
  //     } else {
  //       return response(res, status.DATA_NOT_AVAILABLE, 201)
  //     }

  //   } catch (error) {
  //     console.log(error)
  //     return response(res, status.UNEXPECTED_ERROR, 500)
  //   }
  // }
  static getliftingSurplusBreederVariety = async (req, res) => {
    try {
      let { year, season, crop, production_type, radio_type } = req.body?.search || {};
      let isSelef;
      if (radio_type == "national-temp") {
        isSelef = { is_self: 0 }
      } else {
        isSelef = { is_self: production_type && (production_type == "direct") ? 0 : 1 }
      }

      let condition = {
        include: [
          {
            model: db.varietyModel,
            attributes: ['variety_name'], // Specify attributes to include
            required: true, // Ensure the join happens
          }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('lifting_seed_details.variety_code')), 'variety_code'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name']
        ],
        where: {
          ...isSelef
        },
        raw: true,
      };

      // Adding filters from request body
      if (req.body && req.body.search) {
        if (req.body.search.year) {
          condition.where.year = req.body.search.year; // Ensure this field exists in the model
        }
        if (req.body.search.season) {
          condition.where.season = req.body.search.season; // Ensure this field exists in the model
        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = req.body.search.crop_code; // Ensure this field exists in the model
        }
      }

      // Fetch data
      let liftingVarietyData = await db.liftingSeedDetailsModel.findAll(condition);

      if (liftingVarietyData && liftingVarietyData.length > 0) {
        return response(res, status.SUCCESS, 200, liftingVarietyData); // Return data if found
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201); // No data found
      }
    } catch (error) {
      console.log('Error:', error);
      return response(res, status.UNEXPECTED_ERROR, 500); // Handle unexpected errors
    }
  };
  static getliftingSurplusBreederIndenter = async (req, res) => {
    try {
      let { year, season, crop, production_type, radio_type } = req.body?.search || {};
      let isSelef;
      if (radio_type == "national-temp") {
        isSelef = { is_self: 0 }
      } else {
        isSelef = { is_self: production_type && (production_type == "direct") ? 0 : 1 }
      }
      let condition = {
        include: [
          {
            model: db.agencyDetailModel,
            attributes: ['agency_name'], // Fetch the agency name
            required: true, // Ensure only rows with matching agency details are included
            include: [
              {
                model: db.userModel,
                where: {
                  user_type: 'IN', // Filter for indenters
                },
                attributes: [], // No need to fetch user attributes
                required: true, // Enforce the join
              }
            ]
          }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('lifting_seed_details.indentor_id')), 'indentor_id'],
          [sequelize.col('agency_detail.agency_name'), 'indentor_name']
        ],
        where: {
          ...isSelef
        },
        raw: true,
      };

      // Add filters from request body
      if (req.body && req.body.search) {
        if (req.body.search.year) {
          condition.where.year = req.body.search.year;
        }
        if (req.body.search.season) {
          condition.where.season = req.body.search.season;
        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = req.body.search.crop_code;
        }
      }

      // Fetch data
      let liftingVarietyData = await db.liftingSeedDetailsModel.findAll(condition);

      // Return the response
      if (liftingVarietyData && liftingVarietyData.length > 0) {
        return response(res, status.SUCCESS, 200, liftingVarietyData);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201);
      }
    } catch (error) {
      console.error('Error:', error);
      return response(res, status.UNEXPECTED_ERROR, 500);
    }
  };
  static getliftingDirectBreederIndenter = async (req, res) => {
    try {
      let { year, season, crop, production_type } = req.body?.search || {};
      let condition = {
        include: [
          {
            model: db.agencyDetailModel,
            attributes: ['agency_name'], // Fetch the agency name
            required: true, // Ensure only rows with matching agency details are included
            include: [
              {
                model: db.userModel,
                where: {
                  user_type: 'IN', // Filter for indenters
                },
                attributes: [], // No need to fetch user attributes
                required: true, // Enforce the join
              }
            ]
          }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('lifting_seed_details.indentor_id')), 'indentor_id'],
          [sequelize.col('agency_detail->user.name'), 'indentor_name']
        ],
        where: {},
        raw: true,
        is_self: production_type && (production_type == "direct") ? 0 : 1
      };

      // Add filters from request body
      if (req.body && req.body.search) {
        if (req.body.search.year) {
          condition.where.year = req.body.search.year;
        }
        if (req.body.search.season) {
          condition.where.season = req.body.search.season;
        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = req.body.search.crop_code;
        }
      }

      // Fetch data
      let liftingVarietyData = await db.liftingSeedDetailsModel.findAll(condition);

      // Return the response
      if (liftingVarietyData && liftingVarietyData.length > 0) {
        return response(res, status.SUCCESS, 200, liftingVarietyData);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201);
      }
    } catch (error) {
      console.error('Error:', error);
      return response(res, status.UNEXPECTED_ERROR, 500);
    }
  };
  static getliftingSurplusBreederSpa = async (req, res) => {
    try {
      let { year, season, crop, production_type, radio_type } = req.body?.search || {};
      let isSelf;
      if (radio_type == "national-temp") {
        isSelf = { is_self: 0 }
      } else {
        isSelf = { is_self: production_type && (production_type == "direct") ? 0 : 1 }
      }
      let condition = {
        include: [
          {
            // model: db.agencyDetailModel,
            // attributes: ['agency_name'], // Fetch the agency name
            // required: true, // Ensure only rows with matching agency details are included
            // include: [
            //   {
            model: db.userModel,
            where: {
              user_type: 'SPA', // Filter for SPAwhere:   
            },
            attributes: [], // No need to fetch user attributes
            required: true, // Enforce the join
            //   }
            // ]
          }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('lifting_seed_details.spa_code')), 'spa_code'],
          // [sequelize.col('agency_detail->user.agency_id'), 'agency_id'],
          [sequelize.col('user.name'), 'spa_name']
        ],
        where: {
          ...isSelf
        },
        raw: true
      };

      // Add filters from request body
      if (req.body && req.body.search) {
        if (req.body.search.year) {
          condition.where.year = req.body.search.year;
        }
        if (req.body.search.season) {
          condition.where.season = req.body.search.season;
        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = req.body.search.crop_code;
        }
      }

      // Fetch data
      let liftingVarietyData = await db.liftingSeedDetailsModel.findAll(condition);

      // Return the response
      if (liftingVarietyData && liftingVarietyData.length > 0) {
        return response(res, status.SUCCESS, 200, liftingVarietyData);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201);
      }
    } catch (error) {
      console.error('Error:', error);
      return response(res, status.UNEXPECTED_ERROR, 500);
    }
  };


  // static getliftingSurplusBreederIndenter = async (req, res) => {
  //   try {
  //     let condition = {
  //       include: [
  //         {
  //           model: db.agencyDetailModel,
  //           attributes: [],
  //           include: [
  //             {
  //               model: db.userModel,
  //               where: {
  //                 "user_type": "IN"
  //               }
  //             }
  //           ]
  //         }
  //       ],
  //       attributes: [
  //         [sequelize.fn('DISTINCT', sequelize.col('lifting_seed_details.indentor_id')), 'indentor_id'],
  //         [sequelize.col('agency_detail.agency_name'), 'indentor_name']
  //       ],
  //       where: {

  //       },
  //       raw: true
  //     }
  //     if (req.body && req.body.search) {
  //       if (req.body.search.year) {
  //         condition.where.year = req.body.search.year
  //       }
  //       if (req.body.search.season) {
  //         condition.where.season = req.body.search.season
  //       }
  //       if (req.body.search.crop_code) {
  //         condition.where.crop_code = req.body.search.crop_code
  //       }
  //     }
  //     let liftingVarietyData = await db.liftingSeedDetailsModel.findAll(condition);
  //     if (liftingVarietyData && liftingVarietyData.length) {
  //       return response(res, status.DATA_NOT_AVAILABLE, 200)
  //     } else {
  //       return response(res, status.DATA_NOT_AVAILABLE, 201)
  //     }

  //   } catch (error) {
  //     console.log(error)
  //     return response(res, status.UNEXPECTED_ERROR, 500)
  //   }
  // }

  // static getliftingSurplusBreederSpa = async (req, res) => {
  //   try {
  //     let condition = {
  //       include: [
  //         {
  //           model: db.agencyDetailModel,
  //           attributes: [],
  //           include: [
  //             {
  //               model: db.userModel,
  //               where: {
  //                 "user_type": "SPA"
  //               }
  //             }
  //           ]
  //         }
  //       ],
  //       attributes: [
  //         [sequelize.fn('DISTINCT', sequelize.col('lifting_seed_details.indentor_id')), 'indentor_id'],
  //         [sequelize.col('agency_detail.agency_name'), 'spa_name']
  //       ],
  //       where: {

  //       },
  //       raw: true
  //     }
  //     if (req.body && req.body.search) {
  //       if (req.body.search.year) {
  //         condition.where.year = req.body.search.year
  //       }
  //       if (req.body.search.season) {
  //         condition.where.season = req.body.search.season
  //       }
  //       if (req.body.search.crop_code) {
  //         condition.where.crop_code = req.body.search.crop_code
  //       }
  //     }
  //     let liftingVarietyData = await db.liftingSeedDetailsModel.findAll(condition);
  //     if (liftingVarietyData && liftingVarietyData.length) {
  //       return response(res, status.DATA_NOT_AVAILABLE, 200)
  //     } else {
  //       return response(res, status.DATA_NOT_AVAILABLE, 201)
  //     }

  //   } catch (error) {
  //     console.log(error)
  //     return response(res, status.UNEXPECTED_ERROR, 500)
  //   }
  // }
  static getDirectLiftingTagNo = async (req, res) => {
    try {
      let userId;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          user_id: req.body.loginedUserid.id
        }
      }
      const { year, season, crop_code, variety_code, parental_line, lot_id, production_type } = req.body.search;
      let conditionSecond = {
        include: [
          {
            model: db.liftingTagNumberModel,
            attributes: []
          }
        ],
        attributes: [
          [sequelize.col('lifting_tag_number.tag_no'), 'tag_no']
        ],
        where: {
          year: req.body && req.body.search && req.body.search.year ? req.body.search.year : '',
          season: req.body && req.body.search && req.body.search.season ? req.body.search.season : '',
          crop_code: req.body && req.body.search && req.body.search.crop_code ? req.body.search.crop_code : ''
        },
        raw: true
      }
      let isDataExist = await db.liftingSeedDetailsModel.findAll(conditionSecond);
      let tagnoArray = []
      let tagnoarraycondtion;
      if (isDataExist && isDataExist.length) {
        isDataExist.forEach((ele) => {
          tagnoArray.push(ele.tag_no)
        })
      }
      if (tagnoArray && tagnoArray.length) {
        tagnoarraycondtion = {
          tag_no: {
            [Op.notIn]: tagnoArray
          }
        }
      }
      let whereClause = {}
      if (variety_code) {
        whereClause.variety_code = variety_code
      }
      if (parental_line) {
        whereClause.variety_line_code = parental_line
      }
      let is_self;
      if (production_type == "direct") {
        is_self = {
          is_self: 0
        }
      } else {
        is_self = {
          is_self: 1
        }
      }
      let condition = {
        include: [
          {
            required: true,
            model: db.seedTagDetails,
            attributes: [],
            where: {
              year,
              season,
              crop_code: crop_code,
              ...whereClause,
              lot_id,
            },
            include: [
              {
                model: db.seedTagsModel,
                attributes: [],
                where: {
                  ...tagnoarraycondtion,
                  is_active: 0
                }

              }
            ],
          }
        ],

        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('seed_tag_detail->seed_tag.tag_no')), 'tag_no'],
          [sequelize.col('seed_tag_detail->seed_tag.bag_size'), 'bag_size'],
          [sequelize.col('seed_tag_detail->seed_tag.no_of_bags'), 'no_of_bags'],
          [sequelize.col('seed_tag_detail.lot_id'), 'lot_id'],
          [sequelize.col('seed_tag_detail.lot_no'), 'lot_no'],
          [sequelize.col('seed_tag_detail->seed_tag.bag_size'), 'bag_size'],
          [sequelize.col('seed_tag_detail->seed_tag.tag_no'), 'tag_no']
        ],
        raw: true,
        where: {
          ...userId,
          year,
          season,
          crop_code: crop_code,
          ...whereClause,
          ...is_self,
          // is_active: 0
        },

      }

      let tagNoData = await db.directIndent.findAll(condition);
      console.log('tagNoData=========', tagNoData);
      tagNoData.forEach(item => {
        item.tag_data = item.tag_no + ' (' + item.bag_size + ')';
      });
      if (tagNoData && tagNoData.length) {
        response(res, status.DATA_AVAILABLE, 200, tagNoData);
      } else {
        response(res, status.DATA_NOT_AVAILABLE, 201, []);
      }
    } catch (error) {
      console.log(error);
      response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }

  static getDirectLiftingLotNO = async (req, res) => {
    try {
      let userId;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          user_id: req.body.loginedUserid.id
        }
      }
      const { year, season, crop_code, variety_code, parental_line, production_type } = req.body.search;
      let whereClause = {}
      if (variety_code) {
        whereClause.variety_code = variety_code
      }
      if (parental_line) {
        whereClause.variety_line_code = parental_line
      }
      let is_self;
      if (production_type == "direct") {
        is_self = {
          is_self: 0
        }
      } else {
        is_self = {
          is_self: 1
        }
      }
      let condition = {
        include: [
          {
            required: true,
            model: db.seedTagDetails,
            attributes: [],
            where: {
              year,
              season,
              crop_code: crop_code,
              ...whereClause,
            },
            include: [
              {
                model: db.seedTagsModel,
                attributes: [],
                where: {
                  is_active: 0
                }
              },
              {
                model: db.seedTagRange,
                attributes: []
              }
            ],
          }
        ],

        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('seed_tag_detail.lot_no')), 'lot_no'],
          [sequelize.col('seed_tag_detail.lot_id'), 'lot_id'],
          [sequelize.col('seed_tag_detail->seed_tag_range.bag_weight'), 'bag_weight'],
        ],
        raw: true,
        where: {
          ...userId,
          year,
          season,
          crop_code: crop_code,
          ...whereClause,
          ...is_self,
          // is_active: 0
        },

      }
      let LotNoData = await db.directIndent.findAll(condition);
      const uniqueLotNos = [
        ...new Map(LotNoData.map(item => [`${item.lot_no}-${item.lot_id}`, item])).values()
      ];
      if (uniqueLotNos && uniqueLotNos.length) {
        response(res, status.DATA_AVAILABLE, 200, uniqueLotNos);
      } else {
        response(res, status.DATA_NOT_AVAILABLE, 201, []);
      }
    } catch (error) {
      console.log(error);
      response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }

  // static getDierctLiftingTableData = async (req, res) => {
  //   try {
  //     let userId;
  //     if (req.body.loginedUserid && req.body.loginedUserid.id) {
  //       userId = {
  //         production_center_id: req.body.loginedUserid.id
  //       };
  //     }
  //     let { variety_id, indenter_id, spa_code, indenter, crop, year, season } = req.body.search;
  //     let whereClause = {}
  //     let whereClause2 = {};
  //     let whereClause3 = {}
  //     if (year) {
  //       whereClause3.year = year
  //     }
  //     if (season) {
  //       whereClause3.season = season
  //     }
  //     if (crop) {
  //       whereClause3.crop_code = crop
  //     }

  //     if (indenter_id && indenter_id.length > 0) {
  //       whereClause.indent_of_breeder_id = {
  //         [Op.in]: req.body.search.indenter_id
  //       };
  //     }
  //     if (indenter && indenter.length > 0) {
  //       whereClause.indent_of_breeder_id = {
  //         [Op.in]: req.body.search.indenter
  //       };
  //     }
  //     if (spa_code && spa_code.length > 0) {

  //       whereClause2.spa_code = {
  //         [Op.in]: req.body.search.spa_code
  //       };
  //     }


  //     let condition = {
  //       include: [
  //         {
  //           model: db.varietyModel,
  //           attributes: ['variety_code', 'variety_name']
  //         },
  //         {
  //           model: db.userModel,
  //           attributes: ['name'],
  //           // where: {
  //           //   user_type: "IN"
  //           // }
  //         },
  //         {
  //           model: db.agencyDetailModel,
  //           attributes: ['state_id']
  //         }
  //       ],
  //       attributes: [
  //         [sequelize.fn('DISTINCT', sequelize.col('indent_of_breederseed_direct.variety_code')), 'variety_code'],
  //         [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
  //         [sequelize.col('m_crop_variety.id'), 'variety_id'],
  //         [sequelize.col('user.id'), 'indent_id'],
  //       ],
  //       nest: true,
  //       raw: true,
  //       where: {
  //         ...whereClause3
  //       }
  //     };
  //     let datas = await db.directIndentModel.findAll({
  //       include: [
  //         {
  //           model: db.varietyModel,
  //           attributes: []
  //         },
  //         {
  //           model: db.seedTagDetails,
  //           attributes: []
  //         },
  //       ],
  //       attributes: [
  //         [sequelize.col('indent_of_breederseed_direct.state_code'), 'state_code'],
  //         [sequelize.col('indent_of_breederseed_direct.variety_code'), 'variety_code'],
  //         [sequelize.col('indent_of_breederseed_direct.spa_id'), 'spa_code'],
  //         [sequelize.col('m_crop_variety.id'), 'variety_id'],
  //         [sequelize.col('seed_tag_detail.variety_line_code'), 'variety_line_code'],
  //       ],
  //       raw: true,
  //       where: {
  //         ...whereClause3,
  //       }
  //     })
  //     let allocationData = []
  //     if (datas && datas.length > 0) {
  //       for (let key of datas) {
  //         let data = await db.directIndentModel.findAll({
  //           include: [
  //             {
  //               model: db.varietyModel,
  //               attributes: [],
  //               where: {
  //                 id: key.variety_id,
  //               }
  //             },
  //             {
  //               model: db.seedTagDetails,
  //               where: {
  //                 ...whereClause2,
  //                 ...userId
  //               },
  //               include: [
  //                 {
  //                   model: db.userModel,
  //                   where: {
  //                     spa_code: key.spa_code
  //                   },
  //                   include: [
  //                     {
  //                       model: db.agencyDetailModel,
  //                       where: {
  //                         state_id: key.state_code
  //                       },
  //                       attributes: []
  //                     }
  //                   ],
  //                   attributes: []
  //                 },

  //               ],
  //               attributes: []
  //             },
  //           ],
  //           attributes: [
  //             [sequelize.col('m_crop_variety.id'), 'variety_id'],
  //             [sequelize.col('indent_of_breederseed_direct.spa_id'), 'spa_code'],
  //             [sequelize.col('indent_of_breederseed_direct.quantity'), 'allocated_quantity'],
  //             [sequelize.col('indent_of_breederseed_direct.state_code'), 'state_code'],
  //             [sequelize.col('indent_of_breederseed_direct.user_id'), 'productionCenterId'],
  //             [sequelize.col('indent_of_breederseed_direct.id'), 'id'],
  //             [sequelize.col('seed_tag_detail->user.name'), 'name'],

  //             [sequelize.col('seed_tag_detail.variety_line_code'), 'variety_line_code'],
  //             [sequelize.col('indent_of_breederseed_direct.user_id'), 'user_id'],
  //             [sequelize.col('seed_tag_detail->user->agency_detail.agency_name'), 'agency_name'],
  //           ],
  //           raw: true,
  //           where: {
  //             ...whereClause3,
  //             variety_code: key.variety_code,
  //             // variety_line_code: key.variety_line_code
  //             // production_center_id:req.body.loginedUserid.id
  //             // is_freeze:1
  //           }
  //         })
  //         allocationData.push(data)
  //       }
  //     }
  //     if (allocationData && allocationData.length > 0) {
  //       allocationData = allocationData ? allocationData.flat() : ''
  //     }
  //     // console.log(allocationData,'allocationData')
  //     allocationData = productiohelper.removeDuplicates(allocationData, 'productionCenterId')
  //     let liftingData = await db.liftingSeedDetailsModel.findAll({
  //       include: [
  //         {
  //           model: varietyModel,
  //           attributes: ['id']
  //         },
  //         {
  //           model: db.commentsModel,
  //           attributes: ['id', 'comment']
  //         }
  //       ],
  //       where: {
  //         year: req.body.search.year,
  //         season: req.body.search.season,
  //         crop_code: req.body.search.crop
  //       },
  //       raw: true
  //     })
  //     console.log(liftingData, 'liftingData')
  //     if (allocationData && allocationData.length > 0) {
  //       if (liftingData && liftingData.length > 0) {
  //         allocationData = allocationData.map((entry) => {
  //           const matchingEntries = liftingData.filter((e) =>
  //             e['m_crop_variety.id'] === entry.variety_id &&
  //             e.spa_code === entry.spa_code &&
  //             e.spa_state_code === entry.state_code &&
  //             (entry.variety_line_code === null || e.variety_line_code === entry.variety_line_code)
  //           );
  //           console.log("matchingEntries", matchingEntries);

  //           let liftingDetails = []
  //           if (matchingEntries && matchingEntries.length > 0) {
  //             // Merge all matched lifting records into the allocation entry
  //             liftingDetails = matchingEntries.map((matchingEntry) => ({
  //               variety_code: matchingEntry.variety_code || null,
  //               season: matchingEntry.season || null,
  //               crop_code: matchingEntry.crop_code || null,
  //               year: matchingEntry.year || null,
  //               indenter_id: matchingEntry.indentor_id || null,
  //               variety_line_code: matchingEntry.variety_line_code || null,
  //               lifting_id: matchingEntry.id || null,
  //               payment_method_no: matchingEntry.payment_method_no || null,
  //               paid_by: matchingEntry.paid_by || null,
  //               total_price: matchingEntry.total_price || null,
  //               reason_id: matchingEntry['comment.id'] || null,
  //               comment: matchingEntry['comment.comment'] || null,
  //               no_of_bag: matchingEntry.no_of_bag || null,
  //               bag_size: matchingEntry.bag_weight || null,
  //               bill_details: {
  //                 no_of_bags: matchingEntry.no_of_bag || null,
  //                 bag_size: matchingEntry.bag_weight || null,
  //                 total_quantity: matchingEntry.no_of_bag * matchingEntry.bag_weight,
  //                 bill_amount: matchingEntry.final_payable_amt || null,
  //                 bill_no: matchingEntry.lifting_bill_no || null,
  //               }
  //             }));

  //             // Include liftingDetails in the allocation entry
  //             return {
  //               ...entry,
  //               variety_code: liftingDetails[0].variety_code || null,
  //               season: liftingDetails[0].season || null,
  //               crop_code: liftingDetails[0].crop_code || null,
  //               year: liftingDetails[0].year || null,
  //               indenter_id: liftingDetails[0].indenter_id || null,
  //               variety_line_code: liftingDetails[0].variety_line_code || null,
  //               lifting_details: liftingDetails || []
  //             };
  //           } else {
  //             // Return the entry with null/empty values for unmatched cases
  //             return {
  //               ...entry,
  //               variety_code: null,
  //               season: null,
  //               crop_code: null,
  //               year: null,
  //               indenter_id: null,
  //               variety_line_code: null,
  //               lifting_details: [
  //                 {
  //                   "variety_code": null,
  //                   "season": null,
  //                   "crop_code": null,
  //                   "year": null,
  //                   "indenter_id": null,
  //                   "variety_line_code": null,
  //                   "lifting_id": null,
  //                   "payment_method_no": null,
  //                   "paid_by": null,
  //                   "total_price": null,
  //                   "reason_id": null,
  //                   "comment": null,
  //                   "no_of_bag": null,
  //                   "bag_size": null,
  //                   "bill_details": {
  //                     "no_of_bags": null,
  //                     "bag_size": null,
  //                     "total_quantity": null,
  //                     "bill_amount": null,
  //                     "bill_no": null,
  //                   }
  //                 },
  //               ],
  //               payment_details: {
  //                 "invoice_amount": null,
  //                 "payment_method": null,
  //                 "payment_request": null,
  //                 "payment_status": null,
  //                 "transaction_number": null,
  //                 "available_breederseed_as_per_invoice": null,
  //                 "amount_paid": null,
  //                 "amount": null,
  //               }
  //             };
  //           }
  //         });
  //       } else {

  //         return {
  //           ...entry,
  //           variety_code: null,
  //           season: null,
  //           crop_code: null,
  //           year: null,
  //           indenter_id: null,
  //           variety_line_code: null,
  //           lifting_details: [
  //             {
  //               "variety_code": null,
  //               "season": null,
  //               "crop_code": null,
  //               "year": null,
  //               "indenter_id": null,
  //               "variety_line_code": null,
  //               "lifting_id": null,
  //               "payment_method_no": null,
  //               "paid_by": null,
  //               "total_price": null,
  //               "reason_id": null,
  //               "comment": null,
  //               "no_of_bag": null,
  //               "bag_size": null,
  //               "bill_details": {
  //                 "no_of_bags": null,
  //                 "bag_size": null,
  //                 "total_quantity": null,
  //                 "bill_amount": null,
  //                 "bill_no": null,
  //               }
  //             },
  //           ],
  //           payment_details: {
  //             "invoice_amount": null,
  //             "payment_method": null,
  //             "payment_request": null,
  //             "payment_status": null,
  //             "transaction_number": null,
  //             "available_breederseed_as_per_invoice": null,
  //             "amount_paid": null,
  //             "amount": null,
  //           }
  //         };
  //       }
  //     }
  //     console.log("allocationData", allocationData)

  //     if (req.body) {
  //       if (req.body.search) {
  //         if (req.body.search.year) {
  //           condition.where.year = req.body.search.year;
  //           // condition1.where.year = req.body.search.year;
  //         }

  //         if (req.body.search.season) {
  //           condition.where.season = req.body.search.season;
  //           // condition1.where.season = req.body.search.season;
  //         }
  //         if (req.body.search.crop) {
  //           condition.where.crop_code = req.body.search.crop;
  //           // condition1.where.crop_code = req.body.search.crop_code;
  //         }
  //         if (req.body.search.crop_code) {
  //           condition.where.crop_code = req.body.search.crop_code;
  //           // condition1.where.crop_code = req.body.search.crop_code;
  //         }

  //         if (req.body.search.variety_id && req.body.search.variety_id.length > 0) {

  //           condition.where.variety_id = {
  //             [Op.in]: req.body.search.variety_id
  //           };
  //           // condition1.where.variety_id = {
  //           //   [Op.in]:req.body.search.variety_id
  //           // };
  //         }
  //       }

  //     }
  //     // let allocationToIndentorSeedData = await db.allocationToIndentorSeed.findAll(condition);
  //     let allocationToIndentorSeedData = await db.directIndentModel.findAll(condition);



  //     const updatedAllocationData = await Promise.all(
  //       allocationData.map(async (matchingEntry) => {
  //         console.log("matchingEntry", matchingEntry);
  //         const paymentDetails = await this.getPaymentDetailsData({
  //           indenter_id: matchingEntry?.indenter_id || null,
  //           crop_code: matchingEntry?.crop_code || null,
  //           variety_code: matchingEntry?.variety_code || null,
  //           variety_line_code: matchingEntry?.variety_line_code || null,
  //           season: matchingEntry?.season || null,
  //           year: matchingEntry?.year || null,
  //           spa_code: matchingEntry?.spa_code || null,
  //           state_code: matchingEntry?.state_code || null,
  //         });
  //         const breederStockDetails = await this.getBreederStockDetailsData({
  //           indenter_id: matchingEntry?.indenter_id || null,
  //           crop_code: matchingEntry?.crop_code || null,
  //           variety_code: matchingEntry?.variety_code || null,
  //           variety_line_code: matchingEntry?.variety_line_code || null,
  //           season: matchingEntry?.season || null,
  //           year: matchingEntry?.year || null,
  //           spa_code: matchingEntry?.spa_code || null,
  //           state_code: matchingEntry?.state_code || null,
  //         })
  //         let finalResult = breederStockDetails.reduce(
  //           (acc, item) => {
  //             acc.quantity +=
  //               item.bag_size *
  //               item.no_of_bag;
  //             return acc;
  //           },
  //           { quantity: 0, no_of_bag: 0 }
  //         );
  //         console.log('finalResult====', finalResult);
  //         return { ...matchingEntry, payment_details: paymentDetails, breeder_stock_details: { bag_details: breederStockDetails, total_quantity: finalResult.quantity } };
  //       })
  //     );
  //     console.log('updatedAllocationData', allocationToIndentorSeedData);

  //     const result = allocationToIndentorSeedData.map(variety => {
  //       let varietySpas;
  //       if (variety.variety_line_code) {
  //         varietySpas = updatedAllocationData.filter(spa => spa.variety_id === variety.variety_id && spa.variety_line_code == variety.variety_line_code && spa.user_id == variety.allocation_to_indentor_for_lifting_seed_production_cnter.indent);
  //       } else {
  //         // indent_id missing_____________________
  //         varietySpas = updatedAllocationData.filter(spa => spa.variety_id === variety.variety_id && spa.user_id == variety.indent_id);
  //       }
  //       return {
  //         ...variety,
  //         spas: varietySpas.length > 0 ? varietySpas : [{
  //           variety_id: null,
  //           spa_code: null,
  //           // state_code: variety.allocation_to_indentor_for_lifting_seed_production_cnter.agency,
  //           productionCenterId: null,
  //           agencyId: null,
  //           id: null,
  //           name: null,
  //           allocated_quantity: null,
  //           variety_line_code: null,
  //           lifting_id: null,
  //           payment_method_no: null,
  //           paid_by: null,
  //           total_price: null,
  //           lifting_details: [
  //             {
  //               "variety_code": null,
  //               "season": null,
  //               "crop_code": null,
  //               "year": null,
  //               "indenter_id": null,
  //               "variety_line_code": null,
  //               "lifting_id": null,
  //               "payment_method_no": null,
  //               "paid_by": null,
  //               "total_price": null,
  //               "reason_id": null,
  //               "comment": null,
  //               "no_of_bag": null,
  //               "bag_size": null,
  //               "bill_details": {
  //                 "no_of_bags": null,
  //                 "bag_size": null,
  //                 "total_quantity": null,
  //                 "bill_amount": null,
  //                 "bill_no": null,
  //               }
  //             },
  //           ],
  //           payment_details: {
  //             "invoice_amount": null,
  //             "payment_method": null,
  //             "payment_request": null,
  //             "payment_status": null,
  //             "transaction_number": null,
  //             "available_breederseed_as_per_invoice": null,
  //             "amount_paid": null,
  //             "amount": null,
  //           },
  //           "breeder_stock_details": {
  //             "bag_details": [],
  //             "total_quantity": 0
  //           }
  //         }]
  //       };
  //     });

  //     // Combine results
  //     if (result) {
  //       response(res, status.DATA_AVAILABLE, 200, result);
  //     } else {
  //       response(res, status.DATA_NOT_AVAILABLE, 201, []);
  //     }

  //   } catch (error) {
  //     console.log(error);
  //     response(res, status.UNEXPECTED_ERROR, 501, []);
  //   }
  // };

  static spaDetailData = async (req, res) => {
    const { spa_code, state_code } = req
    let spaDetails = await db.userModel.findOne({
      include: [
        {
          model: db.agencyDetailModel,
          attributes: [],
          where: {
            state_id: state_code
          }
        }
      ],
      attributes: [
        [sequelize.col('user.id'), 'spa_id'],
        [sequelize.col('user.spa_code'), 'spa_code'],
        [sequelize.col('user.name'), 'spa_name']
      ],
      where: {
        user_type: "SPA",
        spa_code: spa_code
      },
      raw: true
    })
    return spaDetails;
  }
  static indentDetailData = async (req, res) => {
    const { spa_code, state_code } = req
    let indenterDetails = await db.userModel.findOne({
      include: [
        {
          model: db.agencyDetailModel,
          attributes: [],
          where: {
            state_id: state_code
          },
          include: [
            {
              model: db.stateModel,
              attributes: []
            }
          ]
        },
      ],
      attributes: [
        [sequelize.col('user.id'), 'indentor_id'],
        [sequelize.col('user.name'), 'indetor_name'],
        [sequelize.col('agency_detail->m_state.state_name'), 'state_name']
      ],
      where: {
        user_type: "IN",
      },
      raw: true
    })
    return indenterDetails;
  }
  static getDierctLiftingTableData = async (req, res) => {
    {
      try {
        const { year, season, crop, variety_id, production_type } = req.body.search || {}
        let user_id = {
          user_id: req.body.loginedUserid.id ? req.body.loginedUserid.id : null
        }
        let condition = {
          include: [
            {
              model: db.varietyModel,
              attributes: []
            },
            {
              required: false,
              model: db.seedTagDetails,
              attributes: [],
              where: {
                year: year,
                season: season,
                crop_code: crop,
                ...user_id
              }
            },
            {
              required: false,
              model: db.liftingSeedDetailsModel,
              attributes: [],
              where: {
                is_self: production_type && (production_type == "direct") ? 0 : 1
              }
            }
          ],
          attributes: [
            [sequelize.col('indent_of_breederseed_direct.variety_code'), 'variety_code'],
            [sequelize.col('indent_of_breederseed_direct.user_id'), 'production_id'],
            [sequelize.col('indent_of_breederseed_direct.year'), 'year'],
            [sequelize.col('indent_of_breederseed_direct.season'), 'season'],
            [sequelize.col('indent_of_breederseed_direct.crop_code'), 'crop_code'],
            [sequelize.col('indent_of_breederseed_direct.spa_id'), 'spa_code'],
            [sequelize.col('indent_of_breederseed_direct.state_code'), 'state_code'],
            [sequelize.col('indent_of_breederseed_direct.quantity'), 'quantity'],
            [sequelize.col('m_crop_variety.id'), 'variety_id'],
            [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
            [sequelize.col('lifting_seed_detail.id'), 'lifting_id'],
            [sequelize.col('lifting_seed_detail.reason'), 'reason'],
            [sequelize.col('lifting_seed_detail.paid_by'), 'paid_by'],
            [sequelize.col('lifting_seed_detail.payment_method_no'), 'bill_amount'],
            [sequelize.col('lifting_seed_detail.reason_id'), 'reason_id'],
            [sequelize.col('lifting_seed_detail.final_payable_amt'), 'final_payable_amt'],
            [sequelize.col('lifting_seed_detail.total_price'), 'total_price'],
            [sequelize.col('lifting_seed_detail.bag_weight'), 'bag_size'],
            [sequelize.col('lifting_seed_detail.no_of_bag'), 'no_of_bag'],
            [sequelize.col('lifting_seed_detail.lifting_bill_no'), 'bill_no'],
            [sequelize.col('lifting_seed_detail.id'), 'lifting_id'],
            [sequelize.col('seed_tag_detail.variety_line_code'), 'variety_line_code'],
          ],
          where: {
            year: year,
            season: season,
            crop_code: crop,
            ...user_id
          },
          raw: true
        }

        let data = await db.directIndentModel.findAll(condition)

        for (let [i, key] of data.entries()) {
          let spaDetail = await this.spaDetailData({
            'spa_code': key.spa_code,
            'state_code': key.state_code,
          });
          let indentOfDetail = await this.indentDetailData({
            'state_code': key.state_code,
          });
          data[i].indentor_id = indentOfDetail.indentor_id ? indentOfDetail.indentor_id : null;
          data[i].indentor_name = indentOfDetail.indetor_name ? indentOfDetail.indetor_name : null;
          data[i].state_name = indentOfDetail.state_name ? indentOfDetail.state_name : null;
          data[i].spa_id = spaDetail.spa_id ? spaDetail.spa_id : null;
          data[i].spa_code = spaDetail.spa_code ? spaDetail.spa_code : null;
          data[i].spa_name = spaDetail.spa_name ? spaDetail.spa_name : null;
        }
        const filteredData = [];
        data.forEach(el => {
          const spaIndex = filteredData.findIndex(item => item.variety_code == el.variety_code && item.variety_id == el.variety_id);
          if (spaIndex === -1) {
            filteredData.push({
              "variety_id": el.variety_id ? el.variety_id : null,
              "variety_name": el.variety_name ? el.variety_name : null,
              "variety_code": el.variety_code ? el.variety_code : null,
              "variety_line_code": "",
              "m_crop_variety": {
                "variety_code": el.variety_name ? el.variety_name : null,
                "variety_name": el.variety_code ? el.variety_code : null
              },
              "allocation_to_indentor_for_lifting_seed_production_cnter": {
                "id": el.indentor_id ? el.indentor_id : null,
                "indent": el.indentor_id ? el.indentor_id : null,
                "user": {
                  "i": el.indentor_id ? el.indentor_id : null,
                  "n": el.indentor_name ? el.indentor_name : null,
                },
                "agency": null
              },
              count: 1,
              "spas": [
                {
                  "variety_id": el.variety_id ? el.variety_id : null,
                  "spa_code": el.spa_code ? el.spa_code : null,
                  "state_code": el.state_code ? el.state_code : null,
                  "productionCenterId": el.production_id ? el.production_id : null,
                  "agencyId": null,
                  "id": el.spa_id ? el.spa_id : null,
                  "name": el.spa_name ? el.spa_name : null,
                  "allocated_quantity": el.quantity ? el.quantity : 0,
                  "variety_line_code": null,
                  "lifting_id": el.lifting_id ? el.lifting_id : null,
                  "payment_method_no": el.payment_method_no ? el.payment_method_no : null,
                  "paid_by": el.paid_by ? el.paid_by : null,
                  "total_price": el.total_price ? el.total_price : null,
                  "count": 1,
                  "lifting_details": [
                    {
                      "variety_code": el.variety_code ? el.variety_code : null,
                      "season": el.season ? el.season : null,
                      "crop_code": el.crop_code ? el.crop_code : null,
                      "year": el.year ? el.year : null,
                      "indenter_id": el.indentor_id ? el.indentor_id : null,
                      "variety_line_code": null,
                      "lifting_id": el.lifting_id ? el.lifting_id : null,
                      "payment_method_no": el.payment_method_no ? el.payment_method_no : null,
                      "paid_by": el.paid_by ? el.paid_by : null,
                      "total_price": el.total_price ? el.total_price : null,
                      "reason_id": el.reason_id ? el.reason_id : null,
                      "comment": el.comment ? el.comment : null,
                      "no_of_bag": el.no_of_bag ? el.no_of_bag : null,
                      "bag_size": el.bag_size ? el.bag_size : null,
                      "bill_details": {
                        "no_of_bags": el.no_of_bag ? el.no_of_bag : null,
                        "bag_size": el.bag_size ? el.bag_size : null,
                        "total_quantity": el.bag_size ? el.bag_size * (el.no_of_bag ? el.no_of_bag : 0) : null,
                        "bill_amount": el.bill_amount ? el.bill_amount : null,
                        "bill_no": el.bill_no ? el.bill_no : null,
                      }
                    }
                  ]
                }
              ]
            });
          } else {

            const cropIndex = filteredData[spaIndex].spas.findIndex(item => item.spa_code == el.spa_code && item.state_code == el.state_code);
            console.log(cropIndex);
            if (cropIndex !== -1) {
              filteredData[spaIndex].spas[cropIndex].lifting_details.push(
                {
                  "variety_code": el.variety_code,
                  "season": el.season,
                  "crop_code": el.crop_code,
                  "year": el.year,
                  "indenter_id": el.indentor_id ? el.indentor_id : null,
                  "variety_line_code": null,
                  "lifting_id": el.lifting_id ? el.lifting_id : null,
                  "payment_method_no": el.payment_method_no ? el.payment_method_no : null,
                  "paid_by": el.paid_by ? el.paid_by : null,
                  "total_price": el.total_price ? el.total_price : null,
                  "reason_id": el.reason_id ? el.reason_id : null,
                  "comment": el.comment ? el.comment : null,
                  "no_of_bag": el.no_of_bag ? el.no_of_bag : null,
                  "bag_size": el.bag_size ? el.bag_size : null,
                  "bill_details": {
                    "no_of_bags": el.no_of_bag ? el.no_of_bag : null,
                    "bag_size": el.bag_size ? el.bag_size : null,
                    "total_quantity": el.bag_size ? el.bag_size * (el.no_of_bag ? el.no_of_bag : 0) : null,
                    "bill_amount": el.bill_amount ? el.bill_amount : null,
                    "bill_no": el.bill_no ? el.bill_no : null,
                  }
                }
              );
            } else {
              filteredData[spaIndex].spas.push({
                "variety_id": el.variety_id,
                "spa_code": el.spa_code ? el.spa_code : null,
                "state_code": el.state_code ? el.state_code : null,
                "productionCenterId": el.production_id,
                "agencyId": null,
                "id": el.spa_id ? el.spa_id : null,
                "name": el.spa_name ? el.spa_name : null,
                "allocated_quantity": el.quantity ? el.quantity : 0,
                "variety_line_code": null,
                "lifting_id": el.lifting_id ? el.lifting_id : null,
                "payment_method_no": el.payment_method_no ? el.payment_method_no : null,
                "paid_by": el.paid_by ? el.paid_by : null,
                "total_price": el.total_price ? el.total_price : null,
                "count": 1,
                "lifting_details": [
                  {
                    "variety_code": el.variety_code,
                    "season": el.season,
                    "crop_code": el.crop_code,
                    "year": el.year,
                    "indenter_id": null,
                    "variety_line_code": null,
                    "lifting_id": el.lifting_id ? el.lifting_id : null,
                    "payment_method_no": el.payment_method_no ? el.payment_method_no : null,
                    "paid_by": el.paid_by ? el.paid_by : null,
                    "total_price": el.total_price ? el.total_price : null,
                    "reason_id": el.reason_id ? el.reason_id : null,
                    "comment": el.comment ? el.comment : null,
                    "no_of_bag": el.no_of_bag ? el.no_of_bag : null,
                    "bag_size": el.bag_size ? el.bag_size : null,
                    "bill_details": {
                      "no_of_bags": el.no_of_bag ? el.no_of_bag : null,
                      "bag_size": el.bag_size ? el.bag_size : null,
                      "total_quantity": el.bag_size ? el.bag_size * (el.no_of_bag ? el.no_of_bag : 0) : null,
                      "bill_amount": el.bill_amount ? el.bill_amount : null,
                      "bill_no": el.bill_no ? el.bill_no : null,
                    }
                  }
                ]
              });
            }
            // if (cropIndex !== -1) {
            //   // Check if the lifting_details array already contains the entry to avoid duplication
            //   const exists = filteredData[spaIndex].spas[cropIndex].lifting_details.some(
            //     detail => detail.lifting_id === el.lifting_id
            //   );

            //   if (!exists) {
            //     filteredData[spaIndex].spas[cropIndex].lifting_details.push({
            //       variety_code: el.variety_code,
            //       season: el.season,
            //       crop_code: el.crop_code,
            //       year: el.year,
            //       indenter_id: el.indentor_id || null,
            //       variety_line_code: null,
            //       lifting_id: el.lifting_id || null,
            //       payment_method_no: el.payment_method_no || null,
            //       paid_by: el.paid_by || null,
            //       total_price: el.total_price || null,
            //       reason_id: el.reason_id || null,
            //       comment: el.comment || null,
            //       no_of_bag: el.no_of_bag || null,
            //       bag_size: el.bag_size || null,
            //       bill_details: {
            //         no_of_bags: el.no_of_bag || null,
            //         bag_size: el.bag_size || null,
            //         total_quantity:
            //           el.bag_size && el.no_of_bag ? el.bag_size * el.no_of_bag : null,
            //         bill_amount: el.bill_amount || null,
            //         bill_no: el.bill_no || null,
            //       },
            //     });
            //   }
            // } else {
            //   // If cropIndex doesn't exist, create a new entry
            //   filteredData[spaIndex].spas.push({
            //     variety_id: el.variety_id,
            //     spa_code: el.spa_code || null,
            //     state_code: el.state_code || null,
            //     productionCenterId: el.production_id,
            //     agencyId: null,
            //     id: el.spa_id || null,
            //     name: el.spa_name || null,
            //     allocated_quantity: el.quantity || 0,
            //     variety_line_code: null,
            //     lifting_id: el.lifting_id || null,
            //     payment_method_no: el.payment_method_no || null,
            //     paid_by: el.paid_by || null,
            //     total_price: el.total_price || null,
            //     count: 1,
            //     lifting_details: [
            //       {
            //         variety_code: el.variety_code,
            //         season: el.season,
            //         crop_code: el.crop_code,
            //         year: el.year,
            //         indenter_id: null,
            //         variety_line_code: null,
            //         lifting_id: el.lifting_id || null,
            //         payment_method_no: el.payment_method_no || null,
            //         paid_by: el.paid_by || null,
            //         total_price: el.total_price || null,
            //         reason_id: el.reason_id || null,
            //         comment: el.comment || null,
            //         no_of_bag: el.no_of_bag || null,
            //         bag_size: el.bag_size || null,
            //         bill_details: {
            //           no_of_bags: el.no_of_bag || null,
            //           bag_size: el.bag_size || null,
            //           total_quantity:
            //             el.bag_size && el.no_of_bag ? el.bag_size * el.no_of_bag : null,
            //           bill_amount: el.bill_amount || null,
            //           bill_no: el.bill_no || null,
            //         },
            //       },
            //     ],
            //   });
            // }

          }
        });

        let responseData = [];
        if (filteredData && filteredData.length) {
          filteredData.forEach((item, i) => {
            filteredData[i].count = 0;
            if (item.spas && item.spas.length > 0) {
              item.spas.forEach((ele, j) => {
                filteredData[i].spas[j].count = 0;
                filteredData[i].count += (ele.lifting_details.length)
                filteredData[i].spas[j].count = (ele.lifting_details.length)
              })
            }
          });
          responseData = filteredData;
          for (let key of responseData) {
            for (let item of key.spas) {
              if (item && item.lifting_details.length) {
                for (const [index, value] of item.lifting_details.entries()) {
                  let datas = await db.liftingTagNumberModel.findAll({
                    where: {
                      litting_seed_details_id: value.lifting_id
                    },
                    raw: true
                  })
                  const groupedData = Object.values(
                    datas.reduce((acc, item) => {
                      const key = item.tag_size;
                      if (!acc[key]) {
                        acc[key] = { bag_weight: item.tag_size, no_of_bags: 0, per_unit_price: item.per_unit_price };
                      }
                      acc[key].no_of_bags += Number(item.no_of_bags);
                      return acc;
                    }, {})
                  );
                  item.lifting_details[index]['bag_data'] = groupedData
                }
              }
            }
          }
          return response(res, status.DATA_AVAILABLE, 200, responseData);
        } else {
          response(res, status.DATA_NOT_AVAILABLE, 201, []);
        }
      } catch (error) {
        console.log(error);
        response(res, status.UNEXPECTED_ERROR, 501, []);
      }
    }
  }
  static getSelfLiftingTableData = async (req, res) => {
    {
      try {
        let { year, season, crop, variety_code, production_type, radio_type, indenter_id, spa_code } = req.body.search || {}
        let user_id = {
          user_id: req.body.loginedUserid.id ? req.body.loginedUserid.id : null
        }
        let isSelf;
        if (radio_type != "national-temp") {
          isSelf = { is_self: production_type && (production_type == "direct") ? 0 : 1 }
        } else {
          isSelf = { is_self: 0 }
        }

        //New filter Implement
        let varietyArray;
        let indenterId;
        let spaCode;
        if (variety_code && variety_code.length) {
          varietyArray = {
            variety_code: {
              [Op.in]: variety_code
            }
          }
        }
        if (indenter_id && indenter_id.length) {
          indenterId = {
            indentor_id: {
              [Op.in]: indenter_id
            }
          }
        }
        if (spa_code && spa_code.length) {
          spaCode = {
            spa_code: {
              [Op.in]: spa_code
            }
          }
        }
        let data;
        let condition;
        if (radio_type == "national-temp") {
          condition = {
            distinct: true,
            include: [
              {
                model: db.varietyModel,
                attributes: []
              },
              // {
              //   required: true,
              //   model: db.seedTagDetails,
              //   attributes: [],
              //   where: {
              //     year: year,
              //     season: season,
              //     crop_code: crop,
              //     ...user_id
              //   }
              // },
              {
                // required:true,
                model: db.seedTagDetails,
                attributes: [],
                where: {

                  year: [sequelize.col('lifting_seed_details.year')],
                  season: [sequelize.col('lifting_seed_details.season')],
                  crop_code: [sequelize.col('lifting_seed_details.crop_code')],
                  variety_code: [sequelize.col('lifting_seed_details.variety_code')],
                }
              },
              {
                required: false,
                model: db.indentOfBreederseedModel,
                attributes: [],
                where: {
                  year: [sequelize.col('lifting_seed_details.year')],
                  season: [sequelize.col('lifting_seed_details.season')],
                  crop_code: [sequelize.col('lifting_seed_details.crop_code')],
                  variety_code: [sequelize.col('lifting_seed_details.variety_code')],
                  user_id: [sequelize.col('lifting_seed_details.indentor_id')]
                }
              }
            ],
            attributes: [
              [sequelize.fn("DISTINCT", sequelize.col('seed_tag_detail.variety_code')), 'variety_code'],
              // [sequelize.fn("DISTINCT",sequelize.col('seed_tag_detail.lot_no')), 'lot_no'],
              [sequelize.col('seed_tag_detail.variety_code'), 'variety_code'],
              [sequelize.col('seed_tag_detail.user_id'), 'production_id'],
              [sequelize.col('seed_tag_detail.year'), 'year'],
              [sequelize.col('seed_tag_detail.season'), 'season'],
              [sequelize.col('seed_tag_detail.crop_code'), 'crop_code'],
              [sequelize.col('lifting_seed_details.spa_code'), 'spa_code'],
              [sequelize.col('lifting_seed_details.spa_state_code'), 'state_code'],
              [sequelize.col('indent_of_breederseed.indent_quantity'), 'quantity'],
              [sequelize.col('m_crop_variety.id'), 'variety_id'],
              [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
              [sequelize.col('lifting_seed_details.id'), 'lifting_id'],
              [sequelize.col('lifting_seed_details.reason'), 'reason'],
              [sequelize.col('lifting_seed_details.paid_by'), 'paid_by'],
              [sequelize.col('lifting_seed_details.total_price'), 'bill_amount'],
              [sequelize.col('lifting_seed_details.reason_id'), 'reason_id'],
              [sequelize.col('lifting_seed_details.final_payable_amt'), 'final_payable_amt'],
              [sequelize.col('lifting_seed_details.total_price'), 'total_price'],
              [sequelize.col('lifting_seed_details.bag_weight'), 'bag_size'],
              [sequelize.col('lifting_seed_details.no_of_bag'), 'no_of_bag'],
              [sequelize.col('lifting_seed_details.lifting_bill_no'), 'bill_no'],
              [sequelize.col('lifting_seed_details.id'), 'lifting_id'],
              [sequelize.col('seed_tag_detail.variety_line_code'), 'variety_line_code'],
            ],
            where: {
              ...isSelf,
              year: year,
              season: season,
              crop_code: crop,
              user_id: req.body.loginedUserid.id ? req.body.loginedUserid.id : null,
              ...varietyArray,
              ...indenterId,
              ...spaCode, 
              is_surplus: 0
              // ...user_id
              // ...(user_id ? { user_id: req.body.loginedUserid.id ? req.body.loginedUserid.id : null } : {}) // Optional user_id
            },
            order: [
              [sequelize.col('seed_tag_detail.variety_code'), 'ASC'],
              [sequelize.col('lifting_seed_details.spa_state_code'), 'ASC']
            ],
            raw: true
          }

          data = await db.liftingSeedDetailsModel.findAll(condition)
        } else {
          condition = {
            distinct: true,
            include: [
              {
                model: db.varietyModel,
                attributes: []
              },
              {
                required: true,
                model: db.seedTagDetails,
                attributes: [],
                where: {
                  year: year,
                  season: season,
                  crop_code: crop,
                  ...user_id
                }
              },
              {
                model: db.c,
                attributes: [],
                where: {
                  ...isSelf
                }
              },

            ],
            attributes: [
              [sequelize.col('indent_of_breederseed_direct.variety_code'), 'variety_code'],
              [sequelize.col('indent_of_breederseed_direct.user_id'), 'production_id'],
              [sequelize.col('indent_of_breederseed_direct.year'), 'year'],
              [sequelize.col('indent_of_breederseed_direct.season'), 'season'],
              [sequelize.col('indent_of_breederseed_direct.crop_code'), 'crop_code'],
              [sequelize.col('lifting_seed_detail.spa_code'), 'spa_code'],
              [sequelize.col('lifting_seed_detail.spa_state_code'), 'state_code'],
              [sequelize.col('indent_of_breederseed_direct.quantity'), 'quantity'],
              [sequelize.col('m_crop_variety.id'), 'variety_id'],
              [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
              [sequelize.col('lifting_seed_detail.id'), 'lifting_id'],
              [sequelize.col('lifting_seed_detail.reason'), 'reason'],
              [sequelize.col('lifting_seed_detail.paid_by'), 'paid_by'],
              [sequelize.col('lifting_seed_detail.payment_method_no'), 'bill_amount'],
              [sequelize.col('lifting_seed_detail.reason_id'), 'reason_id'],
              [sequelize.col('lifting_seed_detail.final_payable_amt'), 'final_payable_amt'],
              [sequelize.col('lifting_seed_detail.total_price'), 'total_price'],
              [sequelize.col('lifting_seed_detail.bag_weight'), 'bag_size'],
              [sequelize.col('lifting_seed_detail.no_of_bag'), 'no_of_bag'],
              [sequelize.col('lifting_seed_detail.lifting_bill_no'), 'bill_no'],
              [sequelize.col('lifting_seed_detail.id'), 'lifting_id'],
              [sequelize.col('seed_tag_detail.variety_line_code'), 'variety_line_code'],
            ],
            where: {
              year: year,
              season: season,
              crop_code: crop,
              ...user_id
            },
            raw: true
          }

          data = await db.directIndentModel.findAll(condition)
        }

        console.log('length===', data.length);
        for (let [i, key] of data.entries()) {
          let spaDetail = await this.spaDetailData({
            'spa_code': key.spa_code,
            'state_code': key.state_code,
          });
          console.log('spaDetail=========', spaDetail)
          let indentOfDetail = await this.indentDetailData({
            'state_code': key.state_code,
          });
          console.log('spaDetail=========', indentOfDetail)
          data[i].indentor_id = indentOfDetail && indentOfDetail.indentor_id ? indentOfDetail.indentor_id : null;
          data[i].indentor_name = indentOfDetail && indentOfDetail.indetor_name ? indentOfDetail.indetor_name : null;
          data[i].state_name = indentOfDetail && indentOfDetail.state_name ? indentOfDetail.state_name : null;
          data[i].spa_id = spaDetail && spaDetail.spa_id ? spaDetail.spa_id : null;
          data[i].spa_code = spaDetail && spaDetail.spa_code ? spaDetail.spa_code : null;
          data[i].spa_name = spaDetail && spaDetail.spa_name ? spaDetail.spa_name : null;
        }
        const filteredData = [];
        data.forEach(el => {
          // && item.indentor_id == el.indentor_id
          const spaIndex = filteredData.findIndex(item => item.variety_code == el.variety_code && item.variety_id == el.variety_id);
          if (spaIndex === -1) {
            filteredData.push({
              "variety_id": el.variety_id ? el.variety_id : null,
              "variety_name": el.variety_name ? el.variety_name : null,
              "variety_code": el.variety_code ? el.variety_code : null,
              "variety_line_code": "",
              "m_crop_variety": {
                "variety_code": el.variety_name ? el.variety_name : null,
                "variety_name": el.variety_code ? el.variety_code : null
              },
              "allocation_to_indentor_for_lifting_seed_production_cnter": {
                "id": el.indentor_id ? el.indentor_id : null,
                "indent": el.indentor_id ? el.indentor_id : null,
                "user": {
                  "i": el.indentor_id ? el.indentor_id : null,
                  "n": el.indentor_name ? el.indentor_name : null,
                },
                "agency": null
              },
              count: 1,
              "spas": [
                {
                  "indent": el && el.indentor_id ? el.indentor_id : '',
                  "n": el.indentor_name ? el.indentor_name : null,
                  "variety_id": el.variety_id ? el.variety_id : null,
                  "spa_code": el.spa_code ? el.spa_code : null,
                  "state_code": el.state_code ? el.state_code : null,
                  "productionCenterId": el.production_id ? el.production_id : null,
                  "agencyId": null,
                  "id": el.spa_id ? el.spa_id : null,
                  "name": el.spa_name ? el.spa_name : null,
                  "allocated_quantity": el.quantity ? el.quantity : 0,
                  "variety_line_code": null,
                  "lifting_id": el.lifting_id ? el.lifting_id : null,
                  "payment_method_no": el.payment_method_no ? el.payment_method_no : null,
                  "paid_by": el.paid_by ? el.paid_by : null,
                  "total_price": el.total_price ? el.total_price : null,
                  "count": 1,
                  "lifting_details": [
                    {
                      "variety_code": el.variety_code ? el.variety_code : null,
                      "season": el.season ? el.season : null,
                      "crop_code": el.crop_code ? el.crop_code : null,
                      "year": el.year ? el.year : null,
                      "indenter_id": el.indentor_id ? el.indentor_id : null,
                      "variety_line_code": null,
                      "lifting_id": el.lifting_id ? el.lifting_id : null,
                      "payment_method_no": el.payment_method_no ? el.payment_method_no : null,
                      "paid_by": el.paid_by ? el.paid_by : null,
                      "total_price": el.total_price ? el.total_price : null,
                      "reason_id": el.reason_id ? el.reason_id : null,
                      "comment": el.comment ? el.comment : null,
                      "no_of_bag": el.no_of_bag ? el.no_of_bag : null,
                      "bag_size": el.bag_size ? el.bag_size : null,
                      "bill_details": {
                        "no_of_bags": el.no_of_bag ? el.no_of_bag : null,
                        "bag_size": el.bag_size ? el.bag_size : null,
                        "total_quantity": el.bag_size ? el.bag_size * (el.no_of_bag ? el.no_of_bag : 0) : null,
                        "bill_amount": el.bill_amount ? el.bill_amount : null,
                        "bill_no": el.bill_no ? el.bill_no : null,
                      }
                    }
                  ]
                }
              ]
            });
          } else {

            const cropIndex = filteredData[spaIndex].spas.findIndex(item => item.spa_code == el.spa_code && item.state_code == el.state_code);
            console.log(cropIndex);
            if (cropIndex !== -1) {
              filteredData[spaIndex].spas[cropIndex].lifting_details.push(
                {
                  "variety_code": el.variety_code,
                  "season": el.season,
                  "crop_code": el.crop_code,
                  "year": el.year,
                  "indenter_id": el.indentor_id ? el.indentor_id : null,
                  "variety_line_code": null,
                  "lifting_id": el.lifting_id ? el.lifting_id : null,
                  "payment_method_no": el.payment_method_no ? el.payment_method_no : null,
                  "paid_by": el.paid_by ? el.paid_by : null,
                  "total_price": el.total_price ? el.total_price : null,
                  "reason_id": el.reason_id ? el.reason_id : null,
                  "comment": el.comment ? el.comment : null,
                  "no_of_bag": el.no_of_bag ? el.no_of_bag : null,
                  "bag_size": el.bag_size ? el.bag_size : null,
                  "bill_details": {
                    "no_of_bags": el.no_of_bag ? el.no_of_bag : null,
                    "bag_size": el.bag_size ? el.bag_size : null,
                    "total_quantity": el.bag_size ? el.bag_size * (el.no_of_bag ? el.no_of_bag : 0) : null,
                    "bill_amount": el.bill_amount ? el.bill_amount : null,
                    "bill_no": el.bill_no ? el.bill_no : null,
                  }
                }
              );
            } else {
              filteredData[spaIndex].spas.push({
                "indent": el && el.indentor_id ? el.indentor_id : '',
                "n": el.indentor_name ? el.indentor_name : null,
                "variety_id": el.variety_id,
                "spa_code": el.spa_code ? el.spa_code : null,
                "state_code": el.state_code ? el.state_code : null,
                "productionCenterId": el.production_id,
                "agencyId": null,
                "id": el.spa_id ? el.spa_id : null,
                "name": el.spa_name ? el.spa_name : null,
                "allocated_quantity": el.quantity ? el.quantity : 0,
                "variety_line_code": null,
                "lifting_id": el.lifting_id ? el.lifting_id : null,
                "payment_method_no": el.payment_method_no ? el.payment_method_no : null,
                "paid_by": el.paid_by ? el.paid_by : null,
                "total_price": el.total_price ? el.total_price : null,
                "count": 1,
                "lifting_details": [
                  {
                    "variety_code": el.variety_code,
                    "season": el.season,
                    "crop_code": el.crop_code,
                    "year": el.year,
                    "indenter_id": null,
                    "variety_line_code": null,
                    "lifting_id": el.lifting_id ? el.lifting_id : null,
                    "payment_method_no": el.payment_method_no ? el.payment_method_no : null,
                    "paid_by": el.paid_by ? el.paid_by : null,
                    "total_price": el.total_price ? el.total_price : null,
                    "reason_id": el.reason_id ? el.reason_id : null,
                    "comment": el.comment ? el.comment : null,
                    "no_of_bag": el.no_of_bag ? el.no_of_bag : null,
                    "bag_size": el.bag_size ? el.bag_size : null,
                    "bill_details": {
                      "no_of_bags": el.no_of_bag ? el.no_of_bag : null,
                      "bag_size": el.bag_size ? el.bag_size : null,
                      "total_quantity": el.bag_size ? el.bag_size * (el.no_of_bag ? el.no_of_bag : 0) : null,
                      "bill_amount": el.bill_amount ? el.bill_amount : null,
                      "bill_no": el.bill_no ? el.bill_no : null,
                    }
                  }
                ]
              });
            }
          }
        });

        let responseData = [];
        if (filteredData && filteredData.length) {
          filteredData.forEach((item, i) => {
            filteredData[i].count = 0;
            if (item.spas && item.spas.length > 0) {
              item.spas.forEach((ele, j) => {
                filteredData[i].spas[j].count = 0;
                filteredData[i].count += (ele.lifting_details.length)
                filteredData[i].spas[j].count = (ele.lifting_details.length)
              })
            }
          });
          responseData = filteredData;
          for (let key of responseData) {
            for (let item of key.spas) {
              if (item && item.lifting_details.length) {
                for (const [index, value] of item.lifting_details.entries()) {
                  let datas = await db.liftingTagNumberModel.findAll({
                    where: {
                      litting_seed_details_id: value.lifting_id
                    },
                    raw: true
                  })
                  const groupedData = Object.values(
                    datas.reduce((acc, item) => {
                      const key = item.tag_size;
                      if (!acc[key]) {
                        acc[key] = { bag_weight: item.tag_size, no_of_bags: 0, per_unit_price: item.per_unit_price };
                      }
                      acc[key].no_of_bags += Number(item.no_of_bags);
                      return acc;
                    }, {})
                  );
                  item.lifting_details[index]['bag_data'] = groupedData
                }
              }
            }
          }
          return response(res, status.DATA_AVAILABLE, 200, responseData);
        } else {
          response(res, status.DATA_NOT_AVAILABLE, 201, []);
        }
      } catch (error) {
        console.log(error);
        response(res, status.UNEXPECTED_ERROR, 501, []);
      }
    }
  }

  static getSurplusIndentVariety = async (req, res) => {
    try {
      const { year, season, crop_code } = req.body?.search || {};
      let whereClause = {};

      if (year) whereClause.year = year; 
      if (season) whereClause.season = season;
      if (crop_code) whereClause.crop_code = crop_code; 
      if (req.body.loginedUserid.id) whereClause.user_id = req.body.loginedUserid.id;
      
      const tagNumberData = await db.liftingSeedDetailsModel.findAll({
        attributes: [[sequelize.col("lifting_tag_number.tag_no"), "tag_no"]],
        include: [
          {
            model: db.liftingTagNumberModel,
            attributes: [],
          },
        ],
        where: whereClause,
        raw: true,
      });

      const tagNumbers = tagNumberData.map((ele) => ele.tag_no);
      if (tagNumbers.length) {
        whereClause["$seed_tag.tag_no$"] = { [Op.notIn]: tagNumbers };
      }
      whereClause["$seed_tag.is_active$"] = 0;

      let liftingVarietyData = await db.seedTagDetails.findAll({
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('seed_tag_details.variety_code')), 'variety_code'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name']
        ],
        include: [
          {
            model: db.varietyModel,
            attributes: ['variety_name'],
            required: true, 
          },
          {
          model: db.seedTagsModel, 
          attributes: [], 
          required: true
        }
        ],
        where: whereClause,
        raw: true,
      });

      if (liftingVarietyData && liftingVarietyData.length > 0) {
        return response(res, status.SUCCESS, 200, liftingVarietyData); 
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201); 
      }
    } catch (error) {
      console.log('Error:', error);
      return response(res, status.UNEXPECTED_ERROR, 500); // Handle unexpected errors
    }
  };
  
  static getSurplusIndentDetails = async (req, res) => {
    try {
    const { search = {}, loginedUserid = {} } = req.body || {};
    let whereClause = {};

    if (search.year) whereClause.year = search.year;
    if (search.season) whereClause.season = search.season;
    if (search.crop_code) whereClause.crop_code = search.crop_code;
    if (search.variety_code) whereClause.variety_code = search.variety_code;
    if (loginedUserid.id) whereClause.user_id = loginedUserid.id;

    let lotNoDetailsData = await db.seedTagDetails.findAll({
      attributes: [
        [sequelize.fn("DISTINCT", sequelize.col("seed_tag_details.lot_no")), "lot_no"],
        [sequelize.col("seed_tag_details.lot_id"), "lot_id"],
        [sequelize.col("seed_tag_details.godown_no"), "godown_no"],
        [sequelize.col("seed_tag_details.stack_no"), "stack_no"],
        [sequelize.col("seed_tag_details.variety_code"), "variety_code"],
        [sequelize.col("seed_tag_details.variety_line_code"), "variety_line_code"],
        [sequelize.col("seed_tag.tag_no"), "tag_no"],
        [sequelize.col("seed_tag.bag_size"), "bag_weight"],
        [sequelize.col("m_crop_variety.variety_name"), "variety_name"],
        [sequelize.col("m_variety_line.line_variety_name"), "line_variety_name"],
      ],
      include: [
        { 
          model: db.seedTagRange,
          attributes: [] 
        },
        {
          model: db.seedTagsModel, 
          attributes: [], 
          required: true 
        },
        { 
          model: db.indentOfBreederseedModel, 
          attributes: [], 
          required: true 
        },
        { 
          model: db.varietyModel, 
          attributes: [] 
        },
        { 
          model: db.varietLineModel, 
          attributes: [] 
        },
      ],
      where: whereClause,
      raw: true,
    });

    // Get already lifted tag numbers
    const tagNumberData = await db.liftingSeedDetailsModel.findAll({
      attributes: [
        [sequelize.col("lifting_tag_number.tag_no"), "tag_no"],
        [sequelize.col("lifting_lot_number.lot_no"), "lot_no"]
      ],
      include: [
        {
          model: db.liftingTagNumberModel,
          required: true,
          attributes: [],
        },
        {
          model: db.liftingLotNumberModel,
          required: true,
          attributes: [],
        },
      ],
      where: whereClause,
      raw: true,
    });

    lotNoDetailsData = lotNoDetailsData.filter(
      item => !tagNumberData.some(tag => tag.tag_no === item.tag_no)
    );
    console.log("lotNoDetailsData-====",lotNoDetailsData);

    if (lotNoDetailsData && lotNoDetailsData.length) {
      const varietyMap = new Map();

      for (const el of lotNoDetailsData) {
        // Step 1: Group by variety
        if (!varietyMap.has(el.variety_code)) {
          varietyMap.set(el.variety_code, {
            variety_name: el.variety_name,
            variety_code: el.variety_code,
            line_variety_name: el.line_variety_name || '',
            variety_line_code: el.variety_line_code || '',
            bsp2_Deteials: new Map()
          });
        }

        const variety = varietyMap.get(el.variety_code);

        // Step 2: Group inside variety by lot
        if (!variety.bsp2_Deteials.has(el.lot_no)) {
          variety.bsp2_Deteials.set(el.lot_no, {
            lot_number: el.lot_no,
            lot_quantity: 0,   // start from 0 and keep adding bag_weight
            no_of_bags: 0,     // start from 0 and keep adding no_of_bags
            bag_weights: [],   // new array to hold all bag weights
            bag_weight: el.bag_weight || '',
            bag_details: "Bag Detail 1",
            area_shown: el.stack_no || '',
            godown_no: el.godown_no || '',
            stack_no: el.stack_no || '',
            tag_count: 0,
            tags: []   // store all tag numbers also
          });
        }

        const lot = variety.bsp2_Deteials.get(el.lot_no);

        // Step 3: Count + Collect tag numbers
        if (el.tag_no) {
          lot.tag_count++;
          lot.no_of_bags++;
          lot.tags.push(el.tag_no);

          // Add bag_weight to lot_quantity (instead of using el.lot_qty)
          lot.lot_quantity += Number(el.bag_weight || 0);

          // Push each bag_weight into new array
          const weight = Number(el.bag_weight || 0);
          if (!lot.bag_weights.includes(weight)) {
            lot.bag_weights.push(weight);
          }
        }
      }

      // Step 4: Convert Map → Array
      const responseData = Array.from(varietyMap.values()).map(variety => {
        const lots = Array.from(variety.bsp2_Deteials.values());
        return {
          variety_name: variety.variety_name,
          variety_code: variety.variety_code,
          line_variety_name: variety.line_variety_name,
          variety_line_code: variety.variety_line_code,
          bsplength: lots.length,
          bsp2_Deteials: lots
        };
      });

      response(res, status.DATA_AVAILABLE, 200, responseData);
    } else {
      response(res, status.DATA_NOT_AVAILABLE, 201, []);
    }
    } catch (erorr) {
      console.log('erorr==', erorr);
      return response(res, status.SUCCESS, 501, {});
    }
  }

  static getSurplusfLiftingTableData = async (req, res) => {
    {
      try {
        let { year, season, crop, variety_code, indenter_id, spa_code } = req.body.search || {}
        let varietyArray,indenterId,spaCode;

        if (variety_code && variety_code.length) {
          varietyArray = {
            variety_code: {
              [Op.in]: variety_code
            }
          }
        }
        if (indenter_id && indenter_id.length) {
          indenterId = {
            indentor_id: {
              [Op.in]: indenter_id
            }
          }
        }
        if (spa_code && spa_code.length) {
          spaCode = {
            spa_code: {
              [Op.in]: spa_code
            }
          }
        }

        let data = await db.liftingSeedDetailsModel.findAll({
            attributes: [
              [sequelize.fn("DISTINCT", sequelize.col('seed_tag_detail.variety_code')), 'variety_code'],
              // [sequelize.fn("DISTINCT",sequelize.col('seed_tag_detail.lot_no')), 'lot_no'],
              [sequelize.col('seed_tag_detail.variety_code'), 'variety_code'],
              [sequelize.col('seed_tag_detail.user_id'), 'production_id'],
              [sequelize.col('seed_tag_detail.year'), 'year'],
              [sequelize.col('seed_tag_detail.season'), 'season'],
              [sequelize.col('seed_tag_detail.crop_code'), 'crop_code'],
              [sequelize.col('lifting_seed_details.spa_code'), 'spa_code'],
              [sequelize.col('lifting_seed_details.spa_state_code'), 'state_code'],
              [sequelize.col('indent_of_breederseed.indent_quantity'), 'quantity'],
              [sequelize.col('m_crop_variety.id'), 'variety_id'],
              [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
              [sequelize.col('lifting_seed_details.id'), 'lifting_id'],
              [sequelize.col('lifting_seed_details.reason'), 'reason'],
              [sequelize.col('lifting_seed_details.paid_by'), 'paid_by'],
              [sequelize.col('lifting_seed_details.total_price'), 'bill_amount'],
              [sequelize.col('lifting_seed_details.reason_id'), 'reason_id'],
              [sequelize.col('lifting_seed_details.final_payable_amt'), 'final_payable_amt'],
              [sequelize.col('lifting_seed_details.total_price'), 'total_price'],
              [sequelize.col('lifting_seed_details.bag_weight'), 'bag_size'],
              [sequelize.col('lifting_seed_details.no_of_bag'), 'no_of_bag'],
              [sequelize.col('lifting_seed_details.lifting_bill_no'), 'bill_no'],
              [sequelize.col('lifting_seed_details.id'), 'lifting_id'],
              [sequelize.col('seed_tag_detail.variety_line_code'), 'variety_line_code'],
            ],
            include: [
              {
                model: db.varietyModel,
                attributes: []
              },
              // {
              //   required: true,
              //   model: db.seedTagDetails,
              //   attributes: [],
              //   where: {
              //     year: year,
              //     season: season,
              //     crop_code: crop,
              //     ...user_id
              //   }
              // },
              {
                // required:true,
                model: db.seedTagDetails,
                attributes: [],
                where: {

                  year: [sequelize.col('lifting_seed_details.year')],
                  season: [sequelize.col('lifting_seed_details.season')],
                  crop_code: [sequelize.col('lifting_seed_details.crop_code')],
                  variety_code: [sequelize.col('lifting_seed_details.variety_code')],
                }
              },
              {
                required: false,
                model: db.indentOfBreederseedModel,
                attributes: [],
                where: {
                  year: [sequelize.col('lifting_seed_details.year')],
                  season: [sequelize.col('lifting_seed_details.season')],
                  crop_code: [sequelize.col('lifting_seed_details.crop_code')],
                  variety_code: [sequelize.col('lifting_seed_details.variety_code')],
                  user_id: [sequelize.col('lifting_seed_details.indentor_id')]
                }
              }
            ],
            where: {
              year: year,
              season: season,
              crop_code: crop,
              user_id: req.body.loginedUserid.id ? req.body.loginedUserid.id : null,
              ...varietyArray,
              ...indenterId,
              ...spaCode,
              is_surplus: 1
              // ...user_id
              // ...(user_id ? { user_id: req.body.loginedUserid.id ? req.body.loginedUserid.id : null } : {}) // Optional user_id
            },
            order: [
              [sequelize.col('seed_tag_detail.variety_code'), 'ASC'],
              [sequelize.col('lifting_seed_details.spa_state_code'), 'ASC']
            ],
            distinct: true,
            raw: true
          })

        for (let [i, key] of data.entries()) {
          let spaDetail = await this.spaDetailData({
            'spa_code': key.spa_code,
            'state_code': key.state_code,
          });
          let indentOfDetail = await this.indentDetailData({
            'state_code': key.state_code,
          });
          data[i].indentor_id = indentOfDetail && indentOfDetail.indentor_id ? indentOfDetail.indentor_id : null;
          data[i].indentor_name = indentOfDetail && indentOfDetail.indetor_name ? indentOfDetail.indetor_name : null;
          data[i].state_name = indentOfDetail && indentOfDetail.state_name ? indentOfDetail.state_name : null;
          data[i].spa_id = spaDetail && spaDetail.spa_id ? spaDetail.spa_id : null;
          data[i].spa_code = spaDetail && spaDetail.spa_code ? spaDetail.spa_code : null;
          data[i].spa_name = spaDetail && spaDetail.spa_name ? spaDetail.spa_name : null;
        }
        const filteredData = [];
        data.forEach(el => {
          // && item.indentor_id == el.indentor_id
          const spaIndex = filteredData.findIndex(item => item.variety_code == el.variety_code && item.variety_id == el.variety_id);
          if (spaIndex === -1) {
            filteredData.push({
              "variety_id": el.variety_id ? el.variety_id : null,
              "variety_name": el.variety_name ? el.variety_name : null,
              "variety_code": el.variety_code ? el.variety_code : null,
              "variety_line_code": "",
              "m_crop_variety": {
                "variety_code": el.variety_name ? el.variety_name : null,
                "variety_name": el.variety_code ? el.variety_code : null
              },
              "allocation_to_indentor_for_lifting_seed_production_cnter": {
                "id": el.indentor_id ? el.indentor_id : null,
                "indent": el.indentor_id ? el.indentor_id : null,
                "user": {
                  "i": el.indentor_id ? el.indentor_id : null,
                  "n": el.indentor_name ? el.indentor_name : null,
                },
                "agency": null
              },
              count: 1,
              "spas": [
                {
                  "indent": el && el.indentor_id ? el.indentor_id : '',
                  "n": el.indentor_name ? el.indentor_name : null,
                  "variety_id": el.variety_id ? el.variety_id : null,
                  "spa_code": el.spa_code ? el.spa_code : null,
                  "state_code": el.state_code ? el.state_code : null,
                  "productionCenterId": el.production_id ? el.production_id : null,
                  "agencyId": null,
                  "id": el.spa_id ? el.spa_id : null,
                  "name": el.spa_name ? el.spa_name : null,
                  "allocated_quantity": el.quantity ? el.quantity : 0,
                  "variety_line_code": null,
                  "lifting_id": el.lifting_id ? el.lifting_id : null,
                  "payment_method_no": el.payment_method_no ? el.payment_method_no : null,
                  "paid_by": el.paid_by ? el.paid_by : null,
                  "total_price": el.total_price ? el.total_price : null,
                  "count": 1,
                  "lifting_details": [
                    {
                      "variety_code": el.variety_code ? el.variety_code : null,
                      "season": el.season ? el.season : null,
                      "crop_code": el.crop_code ? el.crop_code : null,
                      "year": el.year ? el.year : null,
                      "indenter_id": el.indentor_id ? el.indentor_id : null,
                      "variety_line_code": null,
                      "lifting_id": el.lifting_id ? el.lifting_id : null,
                      "payment_method_no": el.payment_method_no ? el.payment_method_no : null,
                      "paid_by": el.paid_by ? el.paid_by : null,
                      "total_price": el.total_price ? el.total_price : null,
                      "reason_id": el.reason_id ? el.reason_id : null,
                      "comment": el.comment ? el.comment : null,
                      "no_of_bag": el.no_of_bag ? el.no_of_bag : null,
                      "bag_size": el.bag_size ? el.bag_size : null,
                      "bill_details": {
                        "no_of_bags": el.no_of_bag ? el.no_of_bag : null,
                        "bag_size": el.bag_size ? el.bag_size : null,
                        "total_quantity": el.bag_size ? el.bag_size * (el.no_of_bag ? el.no_of_bag : 0) : null,
                        "bill_amount": el.bill_amount ? el.bill_amount : null,
                        "bill_no": el.bill_no ? el.bill_no : null,
                      }
                    }
                  ]
                }
              ]
            });
          } else {
            const cropIndex = filteredData[spaIndex].spas.findIndex(item => item.spa_code == el.spa_code && item.state_code == el.state_code);
            console.log(cropIndex);
            if (cropIndex !== -1) {
              filteredData[spaIndex].spas[cropIndex].lifting_details.push(
                {
                  "variety_code": el.variety_code,
                  "season": el.season,
                  "crop_code": el.crop_code,
                  "year": el.year,
                  "indenter_id": el.indentor_id ? el.indentor_id : null,
                  "variety_line_code": null,
                  "lifting_id": el.lifting_id ? el.lifting_id : null,
                  "payment_method_no": el.payment_method_no ? el.payment_method_no : null,
                  "paid_by": el.paid_by ? el.paid_by : null,
                  "total_price": el.total_price ? el.total_price : null,
                  "reason_id": el.reason_id ? el.reason_id : null,
                  "comment": el.comment ? el.comment : null,
                  "no_of_bag": el.no_of_bag ? el.no_of_bag : null,
                  "bag_size": el.bag_size ? el.bag_size : null,
                  "bill_details": {
                    "no_of_bags": el.no_of_bag ? el.no_of_bag : null,
                    "bag_size": el.bag_size ? el.bag_size : null,
                    "total_quantity": el.bag_size ? el.bag_size * (el.no_of_bag ? el.no_of_bag : 0) : null,
                    "bill_amount": el.bill_amount ? el.bill_amount : null,
                    "bill_no": el.bill_no ? el.bill_no : null,
                  }
                }
              );
            } else {
              filteredData[spaIndex].spas.push({
                "indent": el && el.indentor_id ? el.indentor_id : '',
                "n": el.indentor_name ? el.indentor_name : null,
                "variety_id": el.variety_id,
                "spa_code": el.spa_code ? el.spa_code : null,
                "state_code": el.state_code ? el.state_code : null,
                "productionCenterId": el.production_id,
                "agencyId": null,
                "id": el.spa_id ? el.spa_id : null,
                "name": el.spa_name ? el.spa_name : null,
                "allocated_quantity": el.quantity ? el.quantity : 0,
                "variety_line_code": null,
                "lifting_id": el.lifting_id ? el.lifting_id : null,
                "payment_method_no": el.payment_method_no ? el.payment_method_no : null,
                "paid_by": el.paid_by ? el.paid_by : null,
                "total_price": el.total_price ? el.total_price : null,
                "count": 1,
                "lifting_details": [
                  {
                    "variety_code": el.variety_code,
                    "season": el.season,
                    "crop_code": el.crop_code,
                    "year": el.year,
                    "indenter_id": null,
                    "variety_line_code": null,
                    "lifting_id": el.lifting_id ? el.lifting_id : null,
                    "payment_method_no": el.payment_method_no ? el.payment_method_no : null,
                    "paid_by": el.paid_by ? el.paid_by : null,
                    "total_price": el.total_price ? el.total_price : null,
                    "reason_id": el.reason_id ? el.reason_id : null,
                    "comment": el.comment ? el.comment : null,
                    "no_of_bag": el.no_of_bag ? el.no_of_bag : null,
                    "bag_size": el.bag_size ? el.bag_size : null,
                    "bill_details": {
                      "no_of_bags": el.no_of_bag ? el.no_of_bag : null,
                      "bag_size": el.bag_size ? el.bag_size : null,
                      "total_quantity": el.bag_size ? el.bag_size * (el.no_of_bag ? el.no_of_bag : 0) : null,
                      "bill_amount": el.bill_amount ? el.bill_amount : null,
                      "bill_no": el.bill_no ? el.bill_no : null,
                    }
                  }
                ]
              });
            }
          }
        });

        let responseData = [];
        if (filteredData && filteredData.length) {
          filteredData.forEach((item, i) => {
            filteredData[i].count = 0;
            if (item.spas && item.spas.length > 0) {
              item.spas.forEach((ele, j) => {
                filteredData[i].spas[j].count = 0;
                filteredData[i].count += (ele.lifting_details.length)
                filteredData[i].spas[j].count = (ele.lifting_details.length)
              })
            }
          });
          responseData = filteredData;
          for (let key of responseData) {
            for (let item of key.spas) {
              if (item && item.lifting_details.length) {
                for (const [index, value] of item.lifting_details.entries()) {
                  let datas = await db.liftingTagNumberModel.findAll({
                    where: {
                      litting_seed_details_id: value.lifting_id
                    },
                    raw: true
                  })
                  const groupedData = Object.values(
                    datas.reduce((acc, item) => {
                      const key = item.tag_size;
                      if (!acc[key]) {
                        acc[key] = { bag_weight: item.tag_size, no_of_bags: 0, per_unit_price: item.per_unit_price };
                      }
                      acc[key].no_of_bags += Number(item.no_of_bags);
                      return acc;
                    }, {})
                  );
                  item.lifting_details[index]['bag_data'] = groupedData
                }
              }
            }
          }
          return response(res, status.DATA_AVAILABLE, 200, responseData);
        } else {
          response(res, status.DATA_NOT_AVAILABLE, 201, []);
        }
      } catch (error) {
        console.log(error);
        response(res, status.UNEXPECTED_ERROR, 501, []);
      }
    }
  }
}
module.exports = LiftingSeeds   
