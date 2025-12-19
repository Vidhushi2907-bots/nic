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
          user_id: req.body && req.body.loginedUserid && req.body.loginedUserid.id ? req.body.loginedUserid.id : 10826
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
        const { year, season, crop_code, variety_code, variety_line_code, lot_no, lot_id, reason_id, spa_code, spa_state_code,
          paid_by, payment_method_no, per_unit_price, breeder_class, bag_weight, no_of_bag, total_price, lifting_lots, tag_data, lifting_charges
          , indentor_id, total_lifting_price ,final_amt} = req.body.data;
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

        data = await db.liftingSeedDetailsModel.create({
          year: year ? year : "",
          season: season ? season : "",
          crop_code: crop_code ? crop_code : "",
          variety_code: variety_code ? variety_code : "",
          variety_line_code: variety_line_code ? variety_line_code : "",
          spa_state_code: spa_state_code ? spa_state_code : null,
          spa_code: spa_code ? spa_code : "1001",
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
          indentor_id: indentor_id ? indentor_id : '',
          final_payable_amt: final_amt ? final_amt : null,
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
        const mergedTags = tag_data.map(tag => {
          const matchingLiftingDetail = datas.find(ld => ld.lot_id === tag.lot_id);
          if (matchingLiftingDetail) {
            return {
              ...tag,
              lifting_lot_no_id: matchingLiftingDetail.id
            };
          }
          return tag;
        });
        for (let items of mergedTags) {
          let datas = await db.liftingTagNumberModel.create({
            tag_no: items.tag_no,
            tag_size: items.bag_size,
            lifting_lot_no_id: items.lifting_lot_no_id,
            no_of_bags: items.no_of_bags,
            tag_id: items.tag_id,
            litting_seed_details_id: data.dataValues.id
          })
        }
        for (let item of lifting_charges) {
          let daliftingCharges = await db.liftingChargesModel.create({
            lifting_details_id: data.dataValues.id,
            gst: item.gst,
            additional_charges_id: item.additional_charges_id,
            total_amount: item.total_amount,
            after_apply_gst: item.after_apply_gst
          });
        }
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
            'year', 'season', 'variety_code', 'variety_line_code', 'crop_code','user_id'
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
	      spa_state_code:state_code,
	      spa_code
        // variety_code
      };
      const agencyData = await db.liftingSeedDetailsModel.findAll({
        attributes: ['variety_code', 'crop_code', 'year', 'user_id', 'season', 'variety_line_code', 'reason_id',
          'lifting_bill_no', 'id', 'payment_method_no', 'paid_by', 'total_price','bag_weight',
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
          [sequelize.col('lifting_seed_details.id'),'lifting_id']
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
            const encryptedForm = CryptoJS.AES.encrypt(JSON.stringify({ id:item.id }), AESKey).toString();
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
                          receipt_id:item.get('receipt_id')
                        }
                      ],
                      final_payment: [
                        {
                          amount: item.get('total_price'),
                          method: item.get('paid_by'),
                          transaction_number: item.get('payment_method_no'),
                          payment_request:'Paid',
                          lifting_id :item.get('lifting_id')
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
                receipt_id:item.get('receipt_id')
              })
              filterData[cropIndex].bspc[varietyIndex].final_payment.push({
                amount: item.get('total_price'),
                method: item.get('paid_by'),
                transaction_number: item.get('payment_method_no'),
                payment_request:'Paid',
                lifting_id :item.get('lifting_id')
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
                      receipt_id:item.get('receipt_id')
                    }
                  ],
                  final_payment: [
                    {
                      // amount: item.get('total_price'),
                      method: item.get('paid_by'),
                      transaction_number: item.get('payment_method_no'),
                      // payment_request:item.get('payment_request')
                      amount:  item.get('total_price'),
                      // method: item.get('payment_method'),
                      // transaction_number: item.get('transaction_number'),
                      payment_request:'Paid',
                      lifting_id :item.get('lifting_id')
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
            val.initial_paymnet= productiohelper.removeDuplicates(val.initial_paymnet,'receipt_id')
          })
          el.bspc.forEach(val => {
            val.final_payment= productiohelper.removeDuplicates(val.initial_paymnet,'lifting_id')
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
  try {
    let userId;
    if (req.body.loginedUserid && req.body.loginedUserid.id) {
      userId = {
        user_id: req.body.loginedUserid.id
      }
    }
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
                as : 'indenterSPAModell',
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
 

}
module.exports = LiftingSeeds   
