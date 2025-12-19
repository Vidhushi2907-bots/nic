require('dotenv').config()
const response = require('../_helpers/response')
const status = require('../_helpers/status.conf')
const db = require("../models");
const sendSms = require("../_helpers/sms")
let Validator = require('validatorjs');
const CryptoJS = require('crypto-js');


const { varietyModel, seasonModel, cropModel, stateModel, receiptRequestModel, userModel, agencyDetailModel, allocationToSPASeed, receiptGenerateModel, receiptGenerateBagModel } = db

const sequelize = require('sequelize');
const ConditionCreator = require('../_helpers/condition-creator')
const Op = require('sequelize').Op;
const union = require('lodash');
const { where, model } = require('../models/db');
const productiohelper = require('../_helpers/productionhelper');
const CallExternalAPI = require("../_helpers/call-external-api");
const attributes = require('validatorjs/src/attributes');


class TagPrint {
  // for reprint module
  static getReprintTagYear = async (req, res) => {
    try {
      let userId;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          user_id: req.body.loginedUserid.id
        }
      }
      if (req.body.user_id && req.body.user_id) {
        userId = {
          user_id: req.body.user_id
        }
      }
      let isActive;
      if (req.body.form_type && req.body.form_type == "discard") {
        isActive = {
          is_active: 1
        }
      } else {
        isActive = {
          is_active: 0
        }
      }
      let condition = {
        include: [
          {
            model: db.seedTagsModel,
            attributes: [],
            where: {
              ...isActive
            }
          }
        ],
        where: {
          ...userId
        },
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('seed_tag_details.year')), 'year'],
        ],
        raw: true
      }

      let yearData = await db.seedTagDetails.findAll(condition)
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

  static getReprintTagSeasonData = async (req, res) => {
    try {
      let userId;
      // console.log('req.body.loginedUserid.id=====', req.body.loginedUserid.id);
      // if (req.body.loginedUserid && req.body.loginedUserid.id) {
      //   userId = {
      //     user_id: req.body.loginedUserid.id
      //   }
      // }
      if (req.body.user_id && req.body.user_id) {
        userId = {
          user_id: req.body.user_id
        }
      }
      let isActive;
      if (req.body.form_type && req.body.form_type == "discard") {
        isActive = {
          is_active: 1
        }
      } else {
        isActive = {
          is_active: 0
        }
      }

      let condition = {
        include: [
          {
            model: seasonModel,
            attributes: []
          },
          {
            model: db.seedTagsModel,
            attributes: [],
            where: {
              ...isActive
            }
          }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('seed_tag_details.season')), 'season'],
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

      let seasonData = await db.seedTagDetails.findAll(condition)
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

  static getReprintTagCropData = async (req, res) => {
    try {
      let userId;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          user_id: req.body.loginedUserid.id
        }

      }
      if (req.body.user_id && req.body.user_id) {
        userId = {
          user_id: req.body.user_id
        }
      }
      let isActive;
      if (req.body.form_type && req.body.form_type == "discard") {
        isActive = {
          is_active: 1
        }
      } else {
        isActive = {
          is_active: 0
        }
      }
      let condition = {

        include: [
          {
            model: cropModel,
            attributes: []
          },
          {
            model: db.seedTagsModel,
            attributes: [],
            where: {
              ...isActive
            }
          }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('seed_tag_details.crop_code')), 'crop_code'],
          [sequelize.col('m_crop.crop_name'), 'crop_name'],

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
        if (req.body.search.season) {
          condition.where.season = req.body.search.season
        }
      }

      let cropData = await db.seedTagDetails.findAll(condition)
      if (cropData) {
        return response(res, status.DATA_AVAILABLE, 200, cropData);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, [])
      }
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }
  static getReprintTagVarietyData = async (req, res) => {
    try {
      let userId;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          user_id: req.body.loginedUserid.id
        }
      }
      if (req.body.user_id && req.body.user_id) {
        userId = {
          user_id: req.body.user_id
        }
      }
      let isActive;
      if (req.body.form_type && req.body.form_type == "discard") {
        isActive = {
          is_active: 1
        }
      } else {
        isActive = {
          is_active: 0
        }
      }
      let condition = {
        include: [
          {
            model: varietyModel,
            attributes: []
          },
          {
            model: db.seedTagsModel,
            attributes: [],
            where: {
              ...isActive
            }
          }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('seed_tag_details.variety_code')), 'variety_code'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name']
        ],
        raw: true,
        where: {
          ...userId
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
      }

      let dataList = await db.seedTagDetails.findAll(condition);
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
  static getReprintTagVarietyLineData = async (req, res) => {
    try {
      let userId;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          user_id: req.body.loginedUserid.id
        }
      }
      let isActive;
      if (req.body.form_type && req.body.form_type == "discard") {
        isActive = {
          is_active: 1
        }
      } else {
        isActive = {
          is_active: 0
        }
      }
      let condition = {
        include: [
          {
            model: db.varietLineModel,
            attributes: []
          },
          {
            model: db.seedTagsModel,
            attributes: [],
            where: {
              ...isActive
            }
          }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('seed_tag_details.variety_line_code')), 'line_variety_code'],
          [sequelize.col('m_variety_line.line_variety_name'), 'line_variety_name']
        ],
        raw: true,
        where: {
          ...userId,
          [Op.and]: [
            {
              variety_line_code: {
                [Op.ne]: null
              }

            },
            {
              variety_line_code: {
                [Op.ne]: ""
              }

            }

          ]
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

      let dataList = await db.seedTagDetails.findAll(condition);
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
  static getReprintTagLotNoData = async (req, res) => {
    try {
      let userId;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          user_id: req.body.loginedUserid.id
        }
      }
      let isActive;
      if (req.body.form_type && req.body.form_type == "discard") {
        isActive = {
          is_active: 1
        }
      } else {
        isActive = {
          is_active: 0
        }
      }
      // let reprintTagData = await db.reprintTagsModel.findAll(
      //   {
      //     include:[
      //       {
      //         model:db.reprintRequestedTagsModel,
      //         attributes:['tag_no']
      //       }
      //     ],
      //     where:{
      //       ...userId
      //     }
      //   }
      // );
      // let reprintArray = [];
      // reprintTagData.forEach(element => {
      //   if(element && element.reprint_requested_tag && element.reprint_requested_tag['tag_no']){
      //     reprintArray.push(element.reprint_requested_tag['tag_no'])
      //   }
      // });

      // let reprintTagDataValue;
      // if(reprintArray && reprintArray.length){
      //   reprintTagDataValue = {
      //     tag_no:{
      //       [Op.notIn]:reprintArray
      //     }
      //   }
      // }

      let condition = {
        include: [
          {
            model: db.seedTagsModel,
            attributes: [],
            where: {
              ...isActive
              // ...reprintTagDataValue
            }
          }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('seed_tag_details.lot_id')), 'lot_id'],
          [sequelize.col('seed_tag_details.lot_no'), 'lot_no']
        ],
        raw: true,
        where: {
          ...userId
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

      let dataList = await db.seedTagDetails.findAll(condition);
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
  static getReprintTagNumberData = async (req, res) => {
    try {
      let userId;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          user_id: req.body.loginedUserid.id
        }
      }
      let isActive;
      if (req.body.form_type && req.body.form_type == "discard") {
        isActive = {
          is_active: 1
        }
      } else {
        isActive = {
          is_active: 0
        }
      }
      let reprintTagData = await db.reprintTagsModel.findAll(
        {
          include: [
            {
              model: db.reprintRequestedTagsModel,
              attributes: ['tag_no']
            }
          ],
          where: {
            ...userId
          }
        }
      );
      let reprintArray = [];
      reprintTagData.forEach(element => {
        if (element && element.reprint_requested_tag && element.reprint_requested_tag['tag_no']) {
          reprintArray.push(element.reprint_requested_tag['tag_no'])
        }
      });

      let reprintTagDataValue;
      if (reprintArray && reprintArray.length) {
        reprintTagDataValue = {
          tag_no: {
            [Op.notIn]: reprintArray
          }
        }
      }

      let condition = {
        include: [
          {
            model: db.seedTagsModel,
            where: {
              ...isActive,
              ...reprintTagDataValue
            },
            attributes: [],
            // where: {
            //   ...reprintTagDataValue
            // }
          }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('seed_tag_details.lot_id')), 'lot_id'],
          [sequelize.col('seed_tag_details.lot_no'), 'lot_no'],
          [sequelize.col('seed_tag.tag_no'), 'tag_no'],
          [sequelize.col('seed_tag.bag_size'), 'bag_size'],
          [sequelize.col('seed_tag.no_of_bags'), 'no_of_bags'],
          [sequelize.col('seed_tag.is_active'), 'is_active'],
          [sequelize.col('seed_tag.id'), 'seed_tag_id'],
        ],
        raw: true,
        where: {
          ...userId,
        },
      }
      condition.order = [
        [sequelize.col('seed_tag.id'), 'ASC']
      ]
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
        if (req.body.lot_no) {
          condition.where.lot_no = req.body.lot_no
        }
        if (req.body.lot_id) {
          condition.where.lot_id = req.body.lot_id
        }
      }

      let dataList = await db.seedTagDetails.findAll(condition);
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
  static getReprintTagResionData = async (req, res) => {
    try {
      let userId;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          user_id: req.body.loginedUserid.id
        }
      }
      let condition = {
        include: [
          {
            model: db.varietLineModel,
            attributes: []
          }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('seed_tag_details.variety_line_code')), 'line_variety_code'],
          [sequelize.col('m_variety_line.line_variety_name'), 'line_variety_name']
        ],
        raw: true,
        where: {
          ...userId
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

      let dataList = await db.seedTagDetails.findAll(condition);
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

  static addReprintTagData = async (req, res) => {
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
      if (req.body) {
        if (req.body.reprintTagData) {
          let data;
          let rules = {
            "year": 'required|integer',
            "season": 'required|string',
            "crop_code": 'required|string',
            "variety_code": 'required|string',
            "lot_no": 'required|string',
          };
          let validation = new Validator(req.body.reprintTagData, rules);
          const isValidData = validation.passes();

          if (!isValidData) {
            let errorResponse = {};
            for (let key in rules) {
              const error = validation.errors.get(key);
              if (error.length) {
                errorResponse[key] = error;
              }
            }
            return response(res, status.BAD_REQUEST, 400, errorResponse, [])
          }

          data = await db.reprintTagsModel.create({
            year: req.body.reprintTagData.year ? req.body.reprintTagData.year : "",
            season: req.body.reprintTagData.season ? req.body.reprintTagData.season : "",
            crop_code: req.body.reprintTagData.crop_code ? req.body.reprintTagData.crop_code : "",
            variety_code: req.body.reprintTagData.variety_code ? req.body.reprintTagData.variety_code : "",
            variety_line_code: req.body.reprintTagData.variety_line_code ? req.body.reprintTagData.variety_line_code : "",
            lot_no: req.body.reprintTagData.lot_no ? req.body.reprintTagData.lot_no : "",
            lot_id: req.body.reprintTagData.lot_id ? req.body.reprintTagData.lot_id : null,
            is_approved: null,
            reason: req.body.reprintTagData.reason_id ? req.body.reprintTagData.reason_id : null,
            ...userId
          });
          let data1;
          if (req.body.reprintTagData && req.body.reprintTagData.tags && req.body.reprintTagData.tags.length) {
            for (let item of req.body.reprintTagData.tags) {
              data1 = await db.reprintRequestedTagsModel.create({
                reprint_tag_id: data.dataValues.id,
                tag_no: item.tag_no
              });
            }
          }

          if (data) {
            return response(res, status.DATA_SAVE, 200, req.body);
          } else {
            return response(res, status.DATA_NOT_SAVE, 201);
          }
        } else {
          return response(res, "all fields data required", 201, []);
        }
      } else {
        return response(res, "all fields data required", 201, []);
      }
    } catch (error) {
      console.log('error', error)
      return response(res, status.UNEXPECTED_ERROR, 501, error);
    }
  }

  // static getReprintTagData = async (req, res) => {
  //   try {
  //     let userId;
  //     if (req.body.loginedUserid && req.body.loginedUserid.id) {
  //       userId = {
  //         user_id: req.body.loginedUserid.id
  //       }
  //     }
  //     if (req.body.user_id && req.body.user_id) {
  //       userId = {
  //         user_id: req.body.user_id
  //       }
  //     }
  //     let condition = {
  //       include: [
  //         {
  //           model: db.varietyModel,
  //           attributes: ['variety_code', 'variety_name']
  //         },
  //         {
  //           model: db.mVarietyLinesModel,
  //           attributes: ['line_variety_code', 'line_variety_name']
  //         },
  //         {
  //           model: db.seasonModel,
  //           attributes: ['season_code', 'season'],
  //         },
  //         {
  //           model: db.userModel,
  //           attributes: ['name', 'username', 'id']
  //         },
  //         {
  //           model: db.seedTagDetails,
  //           required: false,
  //           include: [
  //             {
  //               model: db.userModel,
  //               attributes: ['name', 'username'],
  //               include: [
  //                 {
  //                   model: db.agencyDetailModel,
  //                   attributes: ['agency_name']
  //                 }
  //               ]
  //             }
  //           ],
  //           attributes: ['lot_no', 'lot_id', 'godown_no', 'stack_no', 'class_of_seed', 'is_status', 'no_of_bags', 'lot_qty'],
  //           where: {
  //             [Op.or]: [
  //               {
  //                 variety_line_code: [sequelize.col('reprint_tags.variety_line_code')]
  //               },
  //               {
  //                 [Op.and]: [
  //                   {
  //                     crop_code: [sequelize.col('reprint_tags.crop_code')]
  //                   },
  //                   { season: [sequelize.col('reprint_tags.season')] },
  //                   { year: [sequelize.col('reprint_tags.year')] },
  //                   { variety_code: [sequelize.col('reprint_tags.variety_code')] },
  //                   { lot_id: [sequelize.col('reprint_tags.lot_id')] },
  //                 ],
  //               }
  //             ]
  //           }
  //         },
  //         // {
  //         //   model:db.reprintRequestedTagsModel,
  //         //   attributes:[],
  //         //   where:{
  //         //   }
  //         // }
  //       ],
  //       attributes: ["*",
  //         // [sequelize.fn('DISTINCT', sequelize.col('seed_tag_details.lot_id')), 'lot_id'],
  //         // [sequelize.col('seed_tag_details.lot_no'), 'lot_no']
  //       ],
  //       nest: true,
  //       raw: true,
  //       where: {
  //         ...userId
  //       },
  //     }
  //     if (req.body) {
  //       if (req.body.year) {
  //         condition.where.year = req.body.year;
  //       }

  //       if (req.body.season) {
  //         condition.where.season = req.body.season
  //       }

  //       if (req.body.crop_code) {
  //         condition.where.crop_code = req.body.crop_code
  //       }
  //       if (req.body.variety_code) {
  //         condition.where.variety_code = req.body.variety_code
  //       }
  //       if (req.body.lot_no) {
  //         condition.where.lot_no = req.body.lot_no
  //       }
  //       if (req.body.lot_id) {
  //         condition.where.lot_id = req.body.lot_id
  //       }
  //       if (req.body.spp_code) {
  //         condition.where.user_id = req.body.spp_code
  //       }
  //       // if (req.body.tag_no) {
  //       //   condition.include[5].where.tag_no = req.body.tag_no
  //       // }
  //     }

  //     let dataList = await db.reprintTagsModel.findAll(condition);
  //     console.log(dataList,'dataList')
  //     if (dataList ) {
  //       response(res, status.DATA_AVAILABLE, 200, dataList);
  //     } else {
  //       response(res, status.DATA_NOT_AVAILABLE, 201, []);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     response(res, status.UNEXPECTED_ERROR, 501, []);
  //   }
  // }
  static getReprintTagData = async (req, res) => {
    try {

      let userId;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          user_id: req.body.loginedUserid.id
        }
      }
      if (req.body.user_id && req.body.user_id) {
        userId = {
          user_id: req.body.user_id
        }
      }
      let condition = {

        include: [
          {
            model: db.varietyModel,
            attributes: ['variety_code', 'variety_name']
          },
          {
            model: db.mVarietyLinesModel,
            attributes: ['line_variety_code', 'line_variety_name']
          },
          {
            model: db.seasonModel,
            attributes: ['season_code', 'season'],
          },
          {
            model: db.userModel,
            attributes: ['name', 'username', 'id']
          },
          {
            model: db.seedTagDetails,
            required: false,

            include: [
              {
                model: db.stlReportStatusModel,
                required: true,
                attributes: ['id'],
                where: {
                  // Filter matching fields from both tables
                  year: { [db.Sequelize.Op.eq]: db.Sequelize.col('seed_tag_detail.year') },
                  season: { [db.Sequelize.Op.eq]: db.Sequelize.col('seed_tag_detail.season') },
                  crop_code: { [db.Sequelize.Op.eq]: db.Sequelize.col('seed_tag_detail.crop_code') },
                  variety_code: { [db.Sequelize.Op.eq]: db.Sequelize.col('seed_tag_detail.variety_code') },
                  user_id: { [db.Sequelize.Op.eq]: db.Sequelize.col('seed_tag_detail.user_id') },
                  lot_no: { [db.Sequelize.Op.eq]: db.Sequelize.col('seed_tag_detail.lot_no') }
                }
              },
              {
                model: db.userModel,
                attributes: ['name', 'username'],
                include: [
                  {
                    model: db.agencyDetailModel,
                    attributes: ['agency_name']
                  }
                ]
              }
            ],

            //     attributes: ['lot_no', 'lot_id', 'godown_no', 'stack_no', 'class_of_seed', 'is_status', 'no_of_bags', 'lot_qty'],
            // where: {
            //   [Op.or]: [
            //     {
            //       variety_line_code: [sequelize.col('reprint_tags.variety_line_code')]
            //     },
            //     {
            //       [Op.and]: [
            //         {
            //           crop_code: [sequelize.col('reprint_tags.crop_code')]
            //         },
            //         { season: [sequelize.col('reprint_tags.season')] },
            //         { year: [sequelize.col('reprint_tags.year')] },
            //         { variety_code: [sequelize.col('reprint_tags.variety_code')] },
            //         { lot_id: [sequelize.col('reprint_tags.lot_id')] },
            //       ],
            //     }
            //   ]
            // }
          },
          {
            model: db.reprintRequestedTagsModel,
            required: false,
            // attributes:[],
            where: {
            }
          }
        ],
        attributes: ['year', 'season', 'crop_code', 'variety_line_code', 'variety_code', 'reason', 'lot_no', 'is_approved',
          'lot_id', 'user_id', 'created_at', 'updated_at',
          [sequelize.col('seed_tag_detail->stl_report_status.normal_seeding'), 'normal_seeding'],
          [sequelize.col('seed_tag_detail->stl_report_status.date_of_test'), 'date_of_test1'],
          [sequelize.col('reprint_tags.id'), 'reprint_id']
        ],
        // attributes: ["*",
        //   // [sequelize.fn('DISTINCT', sequelize.col('seed_tag_details.lot_id')), 'lot_id'],
        //   // [sequelize.col('seed_tag_details.lot_no'), 'lot_no']
        // ],
        nest: true,
        raw: true,
        where: {
          ...userId
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
        if (req.body.lot_no) {
          condition.where.lot_no = req.body.lot_no
        }
        if (req.body.lot_id) {
          condition.where.lot_id = req.body.lot_id
        }
        if (req.body.spp_code) {
          condition.where.user_id = req.body.spp_code
        }
        // if (req.body.tag_no) {
        //   condition.include[5].where.tag_no = req.body.tag_no
        // }
      }

      let dataList = await db.reprintTagsModel.findAll(condition);
      let result;
      if (dataList && dataList.length > 0) {
        const groupedData = dataList.reduce((acc, obj) => {
          const reprintId = obj.reprint_id;
          if (!acc[reprintId]) {
            acc[reprintId] = [];
          }
          acc[reprintId].push(obj);
          return acc;
        }, {});

        // Step 2: Creating reprint_requested_tag array for each reprint_id
        result = Object.values(groupedData).map(group => {
          const reprintRequestedTags = group.map(item => item.reprint_requested_tag);
          return {
            ...group[0], // Assuming other properties are identical within each group
            reprint_requested_tag: reprintRequestedTags
          };
        });

      }
      if (result && result.length > 0) {
        result.forEach(el => {
          el.reprint_requested_tag = productiohelper.removeDuplicates(el.reprint_requested_tag, 'id')
        })
      }
      // console.log(dataList,'dataList')
      if (result) {
        return response(res, status.DATA_AVAILABLE, 200, result);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, [])
      }
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }
  static getReprintTagNoListData = async (req, res) => {
    try {
      let userId;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          user_id: req.body.loginedUserid.id
        }
      }
      let condition = {
        include: [
          {
            model: db.reprintRequestedTagsModel,
            attributes: []
          }
        ],
        attributes: [
          [sequelize.col('reprint_requested_tag.reprint_tag_id'), 'reprint_tag_id'],
          [sequelize.col('reprint_requested_tag.tag_no'), 'tag_no'],
        ],
        raw: true,
        where: {
          ...userId
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
        if (req.body.lot_no) {
          condition.where.lot_no = req.body.lot_no
        }
        if (req.body.lot_id) {
          condition.where.lot_id = req.body.lot_id
        }
        if (req.body.id) {
          condition.where.lot_id = req.body.lot_id
        }
      }

      let dataList = await db.reprintTagsModel.findAll(condition);
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

  // for approval module
  static getApprovedTagYear = async (req, res) => {
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
          //   model: db.seedTagsModel,
          //   attributes: [],
          //   where: {
          //     is_acive: 0
          //   }
          // }
        ],
        where: {
          ...userId
        },
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('reprint_tags.year')), 'year'],
        ]
      }

      let yearData = await db.reprintTagsModel.findAll(condition)
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

  static getApprovedTagSeasonData = async (req, res) => {
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
          },
          // {
          //   model: db.seedTagsModel,
          //   attributes: [],
          //   where: {
          //     is_acive: 0
          //   }
          // }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('reprint_tags.season')), 'season'],
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

      let seasonData = await db.reprintTagsModel.findAll(condition)
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

  static getApprovedTagCropData = async (req, res) => {
    try {
      let userId;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          user_id: req.body.loginedUserid.id
        }
      }
      let condition = {

        include: [
          {
            model: cropModel,
            attributes: []
          },
          // {
          //   model: db.seedTagsModel,
          //   attributes: [],
          //   where: {
          //     is_acive: 0
          //   }
          // }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('reprint_tags.crop_code')), 'crop_code'],
          [sequelize.col('m_crop.crop_name'), 'crop_name'],

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
        if (req.body.search.season) {
          condition.where.season = req.body.search.season
        }
      }

      let cropData = await db.reprintTagsModel.findAll(condition)
      if (cropData) {
        return response(res, status.DATA_AVAILABLE, 200, cropData);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, [])
      }
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }
  static getApprovedTagVariety = async (req, res) => {
    try {
      let userId;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          user_id: req.body.loginedUserid.id
        }
      }
      if (req.body.user_id && req.body.user_id) {
        userId = {
          user_id: req.body.user_id
        }
      }
      let condition = {

        include: [
          {
            model: varietyModel,
            attributes: []
          },
          // {
          //   model: db.seedTagsModel,
          //   attributes: [],
          //   where: {
          //     is_acive: 0
          //   }
          // }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('reprint_tags.variety_code')), 'variety_code'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],

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
        if (req.body.search.season) {
          condition.where.season = req.body.search.season
        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = req.body.search.crop_code
        }
      }

      let varietyData = await db.reprintTagsModel.findAll(condition)
      if (varietyData) {
        return response(res, status.DATA_AVAILABLE, 200, varietyData);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, [])
      }
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }
  static getApprovedTagSPPData = async (req, res) => {
    try {
      let userId;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          user_id: req.body.loginedUserid.id
        }
      }
      let condition = {

        include: [
          {
            model: db.userModel,
            attributes: []
          },
          // {
          //   model: db.seedTagsModel,
          //   attributes: [],
          //   where: {
          //     is_acive: 0
          //   }
          // }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('reprint_tags.user_id')), 'id'],
          [sequelize.col('user.name'), 'spp_name'],

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
        if (req.body.search.season) {
          condition.where.season = req.body.search.season
        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = req.body.search.crop_code
        }
      }

      let varietyData = await db.reprintTagsModel.findAll(condition)
      if (varietyData) {
        return response(res, status.DATA_AVAILABLE, 200, varietyData);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, [])
      }
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }
  static getApprovedTagNoData = async (req, res) => {
    try {
      let userId;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          user_id: req.body.loginedUserid.id
        }
      }
      if (req.body.user_id && req.body.user_id) {
        userId = {
          user_id: req.body.user_id
        }
      }
      let condition = {
        include: [
          {
            model: db.reprintRequestedTagsModel,
            attributes: []
          }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('reprint_requested_tag.reprint_tag_id')), 'reprint_tag_id'],
          [sequelize.col('reprint_requested_tag.tag_no'), 'tag_no'],
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
        if (req.body.search.season) {
          condition.where.season = req.body.search.season
        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = req.body.search.crop_code
        }
      }

      let tagNoData = await db.reprintTagsModel.findAll(condition)
      if (tagNoData) {
        return response(res, status.DATA_AVAILABLE, 200, tagNoData);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, [])
      }
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }
  static getApprovedlotNoData = async (req, res) => {
    try {
      let userId;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          user_id: req.body.loginedUserid.id
        }
      }
      let condition = {
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('reprint_tags.lot_id')), 'lot_id'],
          [sequelize.col('reprint_tags.lot_no'), 'lot_no']
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
        if (req.body.search.season) {
          condition.where.season = req.body.search.season
        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = req.body.search.crop_code
        }
      }

      let lotNoData = await db.reprintTagsModel.findAll(condition)
      if (lotNoData) {
        return response(res, status.DATA_AVAILABLE, 200, lotNoData);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, [])
      }
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }
  static aprrovedTag = async (req, res) => {
    try {
      let isApproved;
      if (req.body && req.body.type == "Approved") {
        isApproved = true;
      } else {
        isApproved = false;
      }
      let reprintData = await db.reprintTagsModel.update({ is_approved: isApproved }, { where: { id: req.body.id } })
      if (reprintData) {
        return response(res, status.DATA_AVAILABLE, 200, reprintData);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, [])
      }
    } catch (error) {
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }


  // for lifting module
  static getLiftingYear = async (req, res) => {
    try {
      let userId;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          production_center_id: req.body.loginedUserid.id
        }
      }
      let condition = {
        include: [
          {
            model: db.allocationToIndentorProductionCenterSeed,
            attributes: [],
            where: {
              ...userId
              // is_active: 0
            }
          }
        ],
        where: {
        },
        attributes: [
          [sequelize.col('allocation_to_indentor_for_lifting_seeds.year'), 'year']
          // [sequelize.fn('DISTINCT', sequelize.col('allocation_to_indentor_for_lifting_seeds.year')), 'year'],
        ],
        group: [
          [sequelize.col('allocation_to_indentor_for_lifting_seeds.year'), 'year']
        ]
      }

      let yearData = await db.allocationToIndentorSeed.findAll(condition)
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

  static getLiftingSeasonData = async (req, res) => {
    try {
      let userId;
      // console.log('req.body.loginedUserid.id=====', req.body.loginedUserid.id);
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          production_center_id: req.body.loginedUserid.id
          // user_id: req.body.loginedUserid.id
        }
      }

      let condition = {
        include: [
          {
            model: seasonModel,
            attributes: []
          },
          {
            model: db.allocationToIndentorProductionCenterSeed,
            attributes: [],
            where: {
              ...userId
              // is_active: 0
            }
          }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('allocation_to_indentor_for_lifting_seeds.season')), 'season'],
          [sequelize.col('m_season.season'), 'season_name'],

        ],
        where: {
          // ...userId
        },
        raw: true
      }
      if (req.body && req.body.search) {
        if (req.body.search.year) {
          condition.where.year = req.body.search.year
        }
      }

      let seasonData = await db.allocationToIndentorSeed.findAll(condition);
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

  static getLiftingCropData = async (req, res) => {
    try {
      let userId;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          production_center_id: req.body.loginedUserid.id
        };
      }
      let condition = {
        include: [
          {
            model: cropModel,
            attributes: []
          },
          {
            model: db.allocationToIndentorProductionCenterSeed,
            attributes: [],
            where: {
              ...userId
              // is_active: 0
            }
          }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('allocation_to_indentor_for_lifting_seeds.crop_code')), 'crop_code'],
          [sequelize.col('m_crop.crop_name'), 'crop_name']
        ],
        where: {
          // ...userId
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

      let cropData = await db.allocationToIndentorSeed.findAll(condition);
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
  static getLiftingVarietyData = async (req, res) => {
    try {
      let userId;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          production_center_id: req.body.loginedUserid.id
        }
      }
      const { year, season, crop } = req.body.search
      let condition = {
        include: [
          {
            model: varietyModel,
            attributes: []
          },
          {
            model: db.allocationToIndentorProductionCenterSeed,
            attributes: [],
            where: {
              ...userId
              // is_active: 0
            }
          }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('allocation_to_indentor_for_lifting_seeds.variety_id')), 'variety_id'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [sequelize.col('m_crop_variety.variety_code'), 'variety_code']
        ],
        raw: true,
        where: {
          // ...userId,
          year,
          season,
          crop_code: crop
        },
      }
      // if (req.body.search) {
      //   if (req.body.search.year) {
      //     condition.where.year = req.body.year;
      //   }

      //   if (req.body.search.season) {
      //     condition.where.season = req.body.search.season
      //   }

      //   if (req.body.search.crop_code) {
      //     condition.where.crop_code = req.body.search.crop_code
      //   }
      // }

      let dataList = await db.allocationToIndentorSeed.findAll(condition);
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
  static getLiftingSpaData = async (req, res) => {
    try {
      let userId;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          user_id: req.body.loginedUserid.id
        }
      }
      // let condition = {
      //   include: [
      //     {
      //       model: db.allocationSpaForLiftingSeed,
      //       attributes: [],
      //       include: [
      //         {
      //           model: db.userModel,
      //           include: [
      //             {
      //               model: db.agencyDetailModel,                 
      //               attributes: []
      //             }
      //           ],

      //           on: {

      //             spa_code: sequelize.where(
      //               sequelize.col('allocation_to_spa_for_lifting_seed_production_cnters.spa_code'),
      //               '=',
      //               sequelize.col('allocation_to_spa_for_lifting_seed_production_cnters->user.spa_code')
      //             ),

      //           },
      //           attributes: []
      //         }
      //       ],
      //       where: {
      //         ...userId
      //       },
      //     }
      //   ],

      //   attributes: [
      //     [sequelize.fn('DISTINCT', sequelize.col('allocation_to_spa_for_lifting_seed_production_cnters.spa_code')), 'spa_code'],
      //     [sequelize.col('allocation_to_spa_for_lifting_seed_production_cnters.state_code'), 'state_code']
      //     // [sequelize.col('allocation_to_spa_for_lifting_seed_production_cnters->user->agency_detail.agency_name'),'agency_name']
      //     // [sequelize.col('allocation_to_spa_for_lifting_seed_production_cnters->user.name'), 'name']
      //   ],
      //   raw: true,
      //   where: {
      //     year: req.body.search.year,
      //     season: req.body.search.season,
      //     crop_code: req.body.search.crop
      //     // ...userId
      //   },
      // }
      let dataList = await db.allocationToSPASeed.findAll({
        where: {
          ...userId
        },
        include: [
          {
            model: db.allocationSpaForLiftingSeed,
            attributes: [],
            include: [
              // {
              //   model:varietyModel,
              //   attributes:[]
              // },
              {
                model: db.userModel,
                include: [
                  {
                    model: db.agencyDetailModel,
                    attributes: []
                  }
                ],

                // on: {

                //   spa_code: sequelize.where(
                //     sequelize.col('allocation_to_spa_for_lifting_seed_production_cnters.spa_code'),
                //     '=',
                //     sequelize.col('allocation_to_spa_for_lifting_seed_production_cnters->user.spa_code')
                //   ),

                // },
                attributes: []
              }
            ],
            // where: {
            //   ...userId
            // },
          }
        ],

        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('allocation_to_spa_for_lifting_seed_production_cnters.spa_code')), 'spa_code'],
          [sequelize.col('allocation_to_spa_for_lifting_seed_production_cnters.state_code'), 'state_code'],
          [sequelize.col('allocation_to_spa_for_lifting_seeds.variety_id'), 'variety_id'],
          [sequelize.col('allocation_to_spa_for_lifting_seeds.variety_line_code'), 'variety_line_code'],
          // [sequelize.col('m_crop_variety.variety_code'), 'variety_code'],
          // [sequelize.col('allocation_to_indentor_for_lifting_seeds->agency_detail.id'), 'agencyId'],
          // [sequelize.col('allocation_to_indentor_for_lifting_seeds.variety_line_code'), 'variety_line_code']
          // [sequelize.col('allocation_to_spa_for_lifting_seed_production_cnters->user->agency_detail.agency_name'),'agency_name']
          // [sequelize.col('allocation_to_spa_for_lifting_seed_production_cnters->user.name'), 'name']
        ],
        raw: true,
        where: {
          year: req.body.search.year,
          season: req.body.search.season,
          crop_code: req.body.search.crop
          // ...userId
        },
      });
      let spaData = [];
      console.log(dataList, 'dataListdataListdataList')
      if (dataList && dataList.length > 0) {
        for (let key of dataList) {
          let dataList2 = await db.allocationToSPASeed.findAll({
            where: {
              ...userId
            },
            include: [
              {
                model: db.allocationSpaForLiftingSeed,
                attributes: [],
                include: [
                  {
                    model: db.userModel,
                    where: {
                      spa_code: key.spa_code,
                    },
                    include: [
                      {
                        model: db.agencyDetailModel,
                        where: {
                          state_id: key.state_code
                        },
                        attributes: []
                      }
                    ],

                    // on: {

                    //   spa_code: sequelize.where(
                    //     sequelize.col('allocation_to_spa_for_lifting_seed_production_cnters.spa_code'),
                    //     '=',
                    //     sequelize.col('allocation_to_spa_for_lifting_seed_production_cnters->user.spa_code')
                    //   ),

                    // },
                    attributes: []
                  }
                ],
              },

            ],

            attributes: [
              [sequelize.fn('DISTINCT', sequelize.col('allocation_to_spa_for_lifting_seed_production_cnters.spa_code')), 'spa_code'],
              // [sequelize.col('allocation_to_spa_for_lifting_seed_production_cnters.state_code'), 'state_code']
              [sequelize.col('allocation_to_spa_for_lifting_seed_production_cnters->user->agency_detail.agency_name'), 'agency_name'],
              [sequelize.col('allocation_to_spa_for_lifting_seed_production_cnters->user->agency_detail.id'), 'id']
              // [sequelize.col('allocation_to_spa_for_lifting_seed_production_cnters->user.name'), 'name']
            ],
            raw: true,
            where: {
              year: req.body.search.year,
              season: req.body.search.season,
              crop_code: req.body.search.crop,
              variety_id: key.variety_id,
              variety_line_code: key.variety_line_code
              // ...userId
            },

            // spaData.push(dataList2);
          })
          spaData.push(dataList2)
        }

      }
      if (spaData && spaData.length > 0) {
        spaData = spaData ? spaData.flat() : ''
      }
      spaData = productiohelper.removeDuplicates(spaData, 'id')
      if (spaData && spaData.length > 0) {
        spaData = spaData.filter(x => x.spa_code != null)
        spaData = spaData.filter(x => x.spa_code != '')
      }
      console.log('spaData', spaData)

      // const allocationToSPAProd2 = await Promise.all(dataList.map(async (el) => {
      //   console.log(el,'ellll')
      //   let prod = await db.allocationSpaForLiftingSeed.findAll({
      //     include: [
      //       {
      //         model: db.userModel,
      //         attributes: [],
      //         include: [
      //           {
      //             model: db.agencyDetailModel,
      //             where: {
      //               state_id: el.state_code
      //             },
      //             attributes: []
      //           }
      //         ],
      //         on: {

      //           spa_code: sequelize.where(
      //             sequelize.col('allocation_to_spa_for_lifting_seed_production_cnters.spa_code'),
      //             '=',
      //             sequelize.col('user.spa_code')
      //           ),

      //         },
      //       },
      //     ],
      //     attributes:[
      //       [sequelize.col('allocation_to_spa_for_lifting_seed_production_cnters.spa_code'),'spa_code'],
      //        [sequelize.col('user->agency_detail.agency_name'),'agency_name']
      //     ],
      //     raw:true
      //       })
      //   console.log(prod, 'prodprod')
      // }))
      if (spaData && spaData.length) {
        response(res, status.DATA_AVAILABLE, 200, spaData);
      } else {
        response(res, status.DATA_NOT_AVAILABLE, 201, []);
      }
    } catch (error) {
      console.log(error);
      response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }
  static getLiftingQtyAllocatedData = async (req, res) => {
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
          //   model: varietyModel,
          //   attributes: []
          // }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('allocation_to_spa_for_lifting_seed_production_cnters.allocated_quantity')), 'allocated_quantity'],
          // [sequelize.col('m_crop_variety.variety_name'), 'variety_name']
        ],
        raw: true,
        where: {
          ...userId
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
      }

      let dataList = await db.allocationSpaForLiftingSeed.findAll(condition);
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
  static getLiftingIndenterData = async (req, res) => {
    try {
      let userId;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          production_center_id: req.body.loginedUserid.id
        }
      }
      let condition = {
        include: [
          {
            model: stateModel,
            attributes: []
          },
          // {
          //   model: db.allocationSpaForLiftingSeed,
          //   where:{
          //     ...userId
          //   //   production_center_id:req.v
          //   },
          //   attributes: []
          // }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('allocation_to_spa_for_lifting_seed_production_cnters.state_code')), 'state_code'],
          [sequelize.col('m_state.state_name'), 'state_name']
        ],
        raw: true,
        where: {
          // ...userId
        },
      }
      let condition1 = {
        include: [
          {
            model: db.allocationToIndentorProductionCenterSeed,
            where: {
              production_center_id: req.body.loginedUserid.id
            },
            include: [
              {
                model: db.userModel,
                attributes: []
              }
            ],
            attributes: []
          }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('allocation_to_indentor_for_lifting_seed_production_cnter.indent_of_breeder_id')), 'indent_of_breeder_id'],
          [sequelize.col('allocation_to_indentor_for_lifting_seed_production_cnter->user.name'), 'state_name'],
          // [sequelize.col('allocation_to_indentor_for_lifting_seed_production_cnters->m_state.state_code'), 'state_code']
        ],
        raw: true,
        where: {
          // ...userId
        },
      }
      if (req.body) {
        if (req.body.year) {
          condition.where.year = req.body.year;
          condition1.where.year = req.body.year;
        }

        if (req.body.season) {
          condition.where.season = req.body.season
          condition1.where.season = req.body.season
        }

        if (req.body.crop_code) {
          condition.where.crop_code = req.body.crop_code
          condition1.where.crop_code = req.body.crop_code
        }
      }

      let dataList = await db.allocationSpaForLiftingSeed.findAll(condition);
      let dataList2 = await db.allocationToIndentorSeed.findAll(condition1);
      let data = [...dataList, ...dataList2]
      // dataList.concat(dataList2)
      console.log(data, 'dataList2')
      if (dataList2 && dataList2.length) {
        response(res, status.DATA_AVAILABLE, 200, dataList2);
      } else {
        response(res, status.DATA_NOT_AVAILABLE, 201, []);
      }
    } catch (error) {
      console.log(error);
      response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }
  static getLiftingTableDatav1 = async (req, res) => {
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
            model: db.varietyModel,
            attributes: ['variety_code', 'variety_name']
          }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('allocation_to_indentor_for_lifting_seeds.variety_id')), 'variety_id'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [sequelize.col('m_crop_variety.variety_code'), 'variety_code']
        ],
        nest: true,
        raw: true,
        where: {
          ...userId
        }
      };

      let condition1 = {
        include: [
          {
            model: db.stateModel,
            attributes: ['state_code', 'state_name']
          }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('allocation_to_spa_for_lifting_seed_production_cnters.state_code')), 'state_code'],
          [sequelize.col('m_state.state_name'), 'state_name'],
          'spa_code',
          // 'variety_id',
          'allocated_quantity'
        ],
        nest: true,
        raw: true,
        where: {
          ...userId
        }
      };

      if (req.body) {
        if (req.body.year) {
          condition.where.year = req.body.year;
          condition1.where.year = req.body.year;
        }

        if (req.body.season) {
          condition.where.season = req.body.season;
          condition1.where.season = req.body.season;
        }

        if (req.body.crop_code) {
          condition.where.crop_code = req.body.crop_code;
          condition1.where.crop_code = req.body.crop_code;
        }

        if (req.body.variety_id) {
          condition.where.variety_id = req.body.variety_id;
          condition1.where.variety_id = req.body.variety_id;
        }
      }

      // Query both models
      let allocationSpaForLiftingSeedData = await db.allocationSpaForLiftingSeed.findAll(condition1);
      let allocationToIndentorSeedData = await db.allocationToIndentorSeed.findAll(condition);

      // Combine results
      let dataList = [...allocationSpaForLiftingSeedData, ...allocationToIndentorSeedData];

      if (dataList && dataList.length) {
        // Transform the data to the desired format
        const formattedData = dataList.map(item => ({
          Variety: item.variety_name || '',
          variety_code: item.variety_code || '',
          indenter: item.state_name || ' ',
          spa: item.spa_code || ' ',
          Quantity_of_Breeder_Seed_Allocated: item.allocated_quantity || ' ',
          Invoice_Amount: 'N/A',
          Payment_Status: 'N/A',
          Payment_Details: 'N/A'
        }));
        response(res, status.DATA_AVAILABLE, 200, formattedData);
      } else {
        response(res, status.DATA_NOT_AVAILABLE, 201, []);
      }
    } catch (error) {
      console.log(error);
      response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  };

  static getPaymentDetailsData = async (req, res) => {
    console.log("req", req);
    let paymentDetails = await db.receiptRequestModel.findOne(
      {
        where: {
          indenter_id: req.indenter_id,//,560,// req.indenter_id,
          crop_code: req.crop_code,//"A0104", //req.crop_code,
          variety_code: req.variety_code,//"A0104568",// req.variety_code,
          variety_line_code: req.variety_line_code,
          season: req.season,//"R",//req.season,
          year: req.year,// 2024,//req.year,
          spa_code: req.spa_code,// "1001",//req.spa_code,
          state_code: req.state_code//27,//req.state_code
        },
        // where: {
        //   indenter_id: 560,// req.indenter_id,
        //   crop_code: "A0104", //req.crop_code,
        //   variety_code: "A0104568",// req.variety_code,
        //   variety_line_code: req.variety_line_code,
        //   season: "R",//req.season,
        //   year: 2024,//req.year,
        //   spa_code: "1001",//req.spa_code,
        //   state_code: 27//req.state_code//27,//req.state_code
        // },
        attributes: ['invoice_amount', 'payment_method', 'payment_request', 'payment_status', 'transaction_number', 'available_breederseed_as_per_invoice', 'amount_paid', 'amount'],
        raw: true
      }
    );
    // console.log('paymentDetails', paymentDetails);
    return paymentDetails;
  }
  static getBreederStockDetailsData = async (req, res) => {
    console.log("req", req);
    let paymentDetails = await db.receiptRequest.findAll(
      {
        include: [
          {
            as: 'receiptgenerate',
            model: db.receiptGenerateModel,
            attributes: [],
            include: [
              {
                as: 'receiptgeneratebags',
                model: db.receiptGenerateBagModel,
                attributes: ['bag_size', 'number_of_bag']
              }
            ]
          }
        ]
        ,
        where: {
          indenter_id: req.indenter_id,//,560,// req.indenter_id,
          crop_code: req.crop_code,//"A0104", //req.crop_code,
          variety_code: req.variety_code,//"A0104568",// req.variety_code,
          variety_line_code: req.variety_line_code,
          season: req.season,//"R",//req.season,
          year: req.year,// 2024,//req.year,
          spa_code: req.spa_code,// "1001",//req.spa_code,
          state_code: req.state_code//27,//req.state_code
        },
        attributes: ['id'],
        raw: true
      }
    );
    console.log('paymentDetailsStock', paymentDetails);
    const convertedData = paymentDetails.map(item => ({
      bag_size: item["receiptgenerate.receiptgeneratebags.bag_size"],
      no_of_bag: item["receiptgenerate.receiptgeneratebags.number_of_bag"],
      id: item.id,
    }));
    return convertedData;
  }
  static getLiftingTableData = async (req, res) => {
    try {
      let userId;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          production_center_id: req.body.loginedUserid.id
        };
      }
      let { variety_id, indenter_id, spa_code, indenter, crop, year, season } = req.body.search;
      let whereClause = {}
      let whereClause2 = {};
      let whereClause3 = {}
      if (year) {
        whereClause3.year = year
      }
      if (season) {
        whereClause3.season = season
      }
      if (crop) {
        whereClause3.crop_code = crop
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
                      spa_code: key.spa_code
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
          crop_code: req.body.search.crop
        },
        raw: true
      })
      console.log(liftingData, 'liftingData')
      // if (allocationData && allocationData.length > 0) {
      //   if (liftingData && liftingData.length > 0) {
      //     allocationData = allocationData.map((entry) => {
      //       const matchingEntries = liftingData.filter((e) =>
      //         e['m_crop_variety.id'] === entry.variety_id &&
      //         e.spa_code === entry.spa_code &&
      //         e.spa_state_code === entry.state_code &&
      //         (entry.variety_line_code === null || e.variety_line_code === entry.variety_line_code)
      //       );
      //       console.log("matchingEntries", matchingEntries);

      //       let liftingDetails = []
      //       if (matchingEntries && matchingEntries.length > 0) {
      //         // Merge all matched lifting records into the allocation entry
      //         liftingDetails = matchingEntries.map((matchingEntry) => ({
      //           variety_code: matchingEntry.variety_code || null,
      //           season: matchingEntry.season || null,
      //           crop_code: matchingEntry.crop_code || null,
      //           year: matchingEntry.year || null,
      //           indenter_id: matchingEntry.indentor_id || null,
      //           variety_line_code: matchingEntry.variety_line_code || null,
      //           lifting_id: matchingEntry.id || null,
      //           payment_method_no: matchingEntry.payment_method_no || null,
      //           paid_by: matchingEntry.paid_by || null,
      //           total_price: matchingEntry.total_price || null,
      //           reason_id: matchingEntry['comment.id'] || null,
      //           comment: matchingEntry['comment.comment'] || null,
      //           no_of_bag: matchingEntry.no_of_bag || null,
      //           bag_size: matchingEntry.bag_weight || null,
      //           bill_details: {
      //             no_of_bags: matchingEntry.no_of_bag || null,
      //             bag_size: matchingEntry.bag_weight || null,
      //             total_quantity: matchingEntry.no_of_bag * matchingEntry.bag_weight,
      //             bill_amount: matchingEntry.final_payable_amt || null,
      //             bill_no: matchingEntry.lifting_bill_no || null,
      //           }
      //         }));

      //         // Include liftingDetails in the allocation entry
      //         return {
      //           ...entry,
      //           variety_code: liftingDetails[0].variety_code || null,
      //           season: liftingDetails[0].season || null,
      //           crop_code: liftingDetails[0].crop_code || null,
      //           year: liftingDetails[0].year || null,
      //           indenter_id: liftingDetails[0].indenter_id || null,
      //           variety_line_code: liftingDetails[0].variety_line_code || null,
      //           lifting_details: liftingDetails || []
      //         };
      //       } else {
      //         // Return the entry with null/empty values for unmatched cases
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
      //     });
      //   } else {

      //     return {
      //       ...entry,
      //       variety_code: null,
      //       season: null,
      //       crop_code: null,
      //       year: null,
      //       indenter_id: null,
      //       variety_line_code: null,
      //       lifting_details: [
      //         {
      //           "variety_code": null,
      //           "season": null,
      //           "crop_code": null,
      //           "year": null,
      //           "indenter_id": null,
      //           "variety_line_code": null,
      //           "lifting_id": null,
      //           "payment_method_no": null,
      //           "paid_by": null,
      //           "total_price": null,
      //           "reason_id": null,
      //           "comment": null,
      //           "no_of_bag": null,
      //           "bag_size": null,
      //           "bill_details": {
      //             "no_of_bags": null,
      //             "bag_size": null,
      //             "total_quantity": null,
      //             "bill_amount": null,
      //             "bill_no": null,
      //           }
      //         },
      //       ],
      //       payment_details: {
      //         "invoice_amount": null,
      //         "payment_method": null,
      //         "payment_request": null,
      //         "payment_status": null,
      //         "transaction_number": null,
      //         "available_breederseed_as_per_invoice": null,
      //         "amount_paid": null,
      //         "amount": null,
      //       }
      //     };
      //   }
      // }

      if (allocationData && allocationData.length > 0) {
        if (liftingData && liftingData.length > 0) {
          allocationData = allocationData.map((entry) => {
            const matchingEntries = liftingData.filter((e) =>
              e['m_crop_variety.id'] === entry.variety_id &&
              e.spa_code === entry.spa_code &&
              e.spa_state_code === entry.state_code &&
              (entry.variety_line_code === null || e.variety_line_code === entry.variety_line_code)
            );
            console.log("matchingEntries", matchingEntries);

            let liftingDetails = [];
            if (matchingEntries && matchingEntries.length > 0) {
              // Merge all matched lifting records into the allocation entry
              liftingDetails = matchingEntries.map((matchingEntry) => ({
                variety_code: matchingEntry.variety_code || null,
                season: matchingEntry.season || null,
                crop_code: matchingEntry.crop_code || null,
                year: matchingEntry.year || null,
                indenter_id: matchingEntry.indentor_id || null,
                variety_line_code: matchingEntry.variety_line_code || null,
                lifting_id: matchingEntry.id || null,
                payment_method_no: matchingEntry.payment_method_no || null,
                paid_by: matchingEntry.paid_by || null,
                total_price: matchingEntry.total_price || null,
                reason_id: matchingEntry['comment.id'] || null,
                comment: matchingEntry['comment.comment'] || null,
                no_of_bag: matchingEntry.no_of_bag || null,
                bag_size: matchingEntry.bag_weight || null,
                bill_details: {
                  no_of_bags: matchingEntry.no_of_bag || null,
                  bag_size: matchingEntry.bag_weight || null,
                  total_quantity: matchingEntry.no_of_bag * matchingEntry.bag_weight,
                  bill_amount: matchingEntry.final_payable_amt || null,
                  bill_no: matchingEntry.lifting_bill_no || null,
                }
              }));

              // Include liftingDetails in the allocation entry
              return {
                ...entry,
                variety_code: liftingDetails[0].variety_code || null,
                season: liftingDetails[0].season || null,
                crop_code: liftingDetails[0].crop_code || null,
                year: liftingDetails[0].year || null,
                indenter_id: liftingDetails[0].indenter_id || null,
                variety_line_code: liftingDetails[0].variety_line_code || null,
                lifting_details: liftingDetails || []
              };
            } else {
              // Return the entry with null/empty values for unmatched cases
              return {
                ...entry,
                variety_code: null,
                season: null,
                crop_code: null,
                year: null,
                indenter_id: null,
                variety_line_code: null,
                lifting_details: getEmptyLiftingDetails(),
                payment_details: getEmptyPaymentDetails()
              };
            }
          });
        } else {
          // Handle the case where liftingData is defined but has no elements
          allocationData = allocationData.map((entry) => ({
            ...entry,
            variety_code: null,
            season: null,
            crop_code: null,
            year: null,
            indenter_id: null,
            variety_line_code: null,
            lifting_details: getEmptyLiftingDetails(),
            payment_details: getEmptyPaymentDetails()
          }));
        }
      }

      // Helper functions to keep the structure DRY
      function getEmptyLiftingDetails() {
        return [
          {
            "variety_code": null,
            "season": null,
            "crop_code": null,
            "year": null,
            "indenter_id": null,
            "variety_line_code": null,
            "lifting_id": null,
            "payment_method_no": null,
            "paid_by": null,
            "total_price": null,
            "reason_id": null,
            "comment": null,
            "no_of_bag": null,
            "bag_size": null,
            "bill_details": {
              "no_of_bags": null,
              "bag_size": null,
              "total_quantity": null,
              "bill_amount": null,
              "bill_no": null,
            }
          }
        ];
      }

      function getEmptyPaymentDetails() {
        return {
          "invoice_amount": null,
          "payment_method": null,
          "payment_request": null,
          "payment_status": null,
          "transaction_number": null,
          "available_breederseed_as_per_invoice": null,
          "amount_paid": null,
          "amount": null,
        };
      }

      console.log("allocationData", allocationData)

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

      const updatedAllocationData = await Promise.all(
        allocationData.map(async (matchingEntry) => {
          console.log("matchingEntry", matchingEntry);
          const paymentDetails = await this.getPaymentDetailsData({
            indenter_id: matchingEntry?.indenter_id || null,
            crop_code: matchingEntry?.crop_code || null,
            variety_code: matchingEntry?.variety_code || null,
            variety_line_code: matchingEntry?.variety_line_code || null,
            season: matchingEntry?.season || null,
            year: matchingEntry?.year || null,
            spa_code: matchingEntry?.spa_code || null,
            state_code: matchingEntry?.state_code || null,
          });
          const breederStockDetails = await this.getBreederStockDetailsData({
            indenter_id: matchingEntry?.indenter_id || null,
            crop_code: matchingEntry?.crop_code || null,
            variety_code: matchingEntry?.variety_code || null,
            variety_line_code: matchingEntry?.variety_line_code || null,
            season: matchingEntry?.season || null,
            year: matchingEntry?.year || null,
            spa_code: matchingEntry?.spa_code || null,
            state_code: matchingEntry?.state_code || null,
          })
          let finalResult = breederStockDetails.reduce(
            (acc, item) => {
              acc.quantity +=
                item.bag_size *
                item.no_of_bag;
              return acc;
            },
            { quantity: 0, no_of_bag: 0 }
          );
          console.log('finalResult====', finalResult);
          return { ...matchingEntry, payment_details: paymentDetails, breeder_stock_details: { bag_details: breederStockDetails, total_quantity: finalResult.quantity } };
        })
      );
      console.log('updatedAllocationData', updatedAllocationData);

      const result = allocationToIndentorSeedData.map(variety => {
        let varietySpas;
        if (variety.variety_line_code) {
          varietySpas = updatedAllocationData.filter(spa => spa.variety_id === variety.variety_id && spa.variety_line_code == variety.variety_line_code && spa.user_id == variety.allocation_to_indentor_for_lifting_seed_production_cnter.indent);
        } else {
          varietySpas = updatedAllocationData.filter(spa => spa.variety_id === variety.variety_id && spa.user_id == variety.allocation_to_indentor_for_lifting_seed_production_cnter.indent);
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
            total_price: null,
            lifting_details: [
              {
                "variety_code": null,
                "season": null,
                "crop_code": null,
                "year": null,
                "indenter_id": null,
                "variety_line_code": null,
                "lifting_id": null,
                "payment_method_no": null,
                "paid_by": null,
                "total_price": null,
                "reason_id": null,
                "comment": null,
                "no_of_bag": null,
                "bag_size": null,
                "bill_details": {
                  "no_of_bags": null,
                  "bag_size": null,
                  "total_quantity": null,
                  "bill_amount": null,
                  "bill_no": null,
                }
              },
            ],
            payment_details: {
              "invoice_amount": null,
              "payment_method": null,
              "payment_request": null,
              "payment_status": null,
              "transaction_number": null,
              "available_breederseed_as_per_invoice": null,
              "amount_paid": null,
              "amount": null,
            },
            "breeder_stock_details": {
              "bag_details": [],
              "total_quantity": 0
            }
          }]
        };
      });

      for (let key of result) {
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
  };
  static getLiftingTagNo = async (req, res) => {
    try {
      let userId;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          user_id: req.body.loginedUserid.id
        }
      }
      const { year, season, crop, variety_code, parental_line } = req.body.search;
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
          crop_code: req.body && req.body.search && req.body.search.crop ? req.body.search.crop : ''
        },
        raw: true
      }
      let isDataExist = await db.liftingSeedDetailsModel.findAll(conditionSecond);
      console.log('isDataExist===========', isDataExist)
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
      let condition = {
        include: [
          {
            model: db.seedTagsModel,
            attributes: [],
            where: {
              ...tagnoarraycondtion
            }
          }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('seed_tag.tag_no')), 'tag_no'],
          [sequelize.col('seed_tag.bag_size'), 'bag_size'],
          [sequelize.col('seed_tag.no_of_bags'), 'no_of_bags'],
          [sequelize.col('seed_tag_details.lot_id'), 'lot_id'],
          [sequelize.col('seed_tag_details.lot_no'), 'lot_no'],
          [sequelize.col('seed_tag.bag_size'), 'bag_size'],
          [sequelize.col('seed_tag.tag_no'), 'tag_no']
        ],
        raw: true,
        where: {
          ...userId,
          year,
          season,
          crop_code: crop,
          ...whereClause,
          // is_active: 0
        },
      }
      let tagNoData = await db.seedTagDetails.findAll(condition);
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
  static getLiftingLotNO = async (req, res) => {
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
          year: req.body && req.body.year ? req.body.year : '',
          season: req.body && req.body.season ? req.body.season : '',
          crop_code: req.body && req.body.crop_code ? req.body.crop_code : ''
        },
        raw: true
      }
      let isDataExist = await db.liftingSeedDetailsModel.findAll(conditionSecond);
      let lotnoArray = []
      let lotnoarraycondtion;
      if (isDataExist && isDataExist.length) {
        isDataExist.forEach((ele) => {
          lotnoArray.push(ele.lot_no)
        })
      }
      if (lotnoArray && lotnoArray.length) {
        lotnoarraycondtion = {
          lot_no: {
            [Op.notIn]: lotnoArray
          }
        }
      }
      let condition = {
        include: [
          // {
          //   model: stateModel,
          //   attributes: []
          // }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('stl_report_status.lot_no')), 'lot_no'],

        ],
        raw: true,
        where: {
          ...userId,
          // ...lotnoarraycondtion
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

        if (req.body.variety_id) {
          condition.where.variety_id = req.body.variety_id;
          condition1.where.variety_id = req.body.variety_id;
        }
      }

      let lotNoDetailsData = await db.stlReportStatusModel.findAll(condition);
      if (lotNoDetailsData && lotNoDetailsData.length) {
        response(res, status.DATA_AVAILABLE, 200, lotNoDetailsData);
      } else {
        response(res, status.DATA_NOT_AVAILABLE, 201, []);
      }
    } catch (error) {
      console.log(error);
      response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }
  static getLiftingLotDetailsNOvq = async (req, res) => {
    try {
      let userId;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          user_id: req.body.loginedUserid.id
        }
      }
      let condition = {
        include: [
          {
            model: db.seedTagRange,
            attributes: []
          }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('seed_tag_details.lot_no')), 'lot_no'],
          [sequelize.col('seed_tag_details.lot_id'), 'lot_id'],
          [sequelize.col('seed_tag_range.bag_weight'), 'bag_weight']
        ],
        raw: true,
        where: {
          // ...userId
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

        if (req.body.variety_id) {
          condition.where.variety_id = req.body.variety_id;
          condition1.where.variety_id = req.body.variety_id;
        }
      }

      let lotNoDetailsData = await db.seedTagDetails.findAll(condition);
      console.log(lotNoDetailsData, 'lotNoDetailsData')
      if (lotNoDetailsData && lotNoDetailsData.length) {
        response(res, status.DATA_AVAILABLE, 200, lotNoDetailsData);
      } else {
        response(res, status.DATA_NOT_AVAILABLE, 201, []);
      }
    } catch (error) {
      console.log(error);
      response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }
  static getLiftingLotDetailsNOV2 = async (req, res) => {
    try {
      let userId;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          user_id: req.body.loginedUserid.id
        }
      }
      // let condition = {
      //   include: [
      //     {
      //       model: db.seedTagRange,
      //       attributes: []
      //     }
      //   ],
      //   attributes: [
      //     [sequelize.fn('DISTINCT', sequelize.col('seed_tag_details.lot_no')), 'lot_no'],
      //     [sequelize.col('seed_tag_details.lot_id'), 'lot_id'],
      //     [sequelize.col('seed_tag_range.bag_weight'),'bag_weight']
      //   ],
      //   raw: true,
      //   where: {
      //     // ...userId
      //   },
      // }
      // if (req.body) {
      //   if (req.body.year) {
      //     condition.where.year = req.body.year;
      //   }

      //   if (req.body.season) {
      //     condition.where.season = req.body.season
      //   }

      //   if (req.body.crop_code) {
      //     condition.where.crop_code = req.body.crop_code
      //   }

      //   if (req.body.variety_id) {
      //     condition.where.variety_id = req.body.variety_id;
      //     condition1.where.variety_id = req.body.variety_id;
      //   }
      // }
      const { year, season, crop_code, variety_id } = req.body
      let condition = {
        where: {
          year: year,
          season: season,
          crop_code: crop_code,

        }
      }
      let lotNoDetailsData = await db.seedTagDetails.findAll(condition);
      console.log(lotNoDetailsData, 'lotNoDetailsData')
      if (lotNoDetailsData && lotNoDetailsData.length) {
        response(res, status.DATA_AVAILABLE, 200, lotNoDetailsData);
      } else {
        response(res, status.DATA_NOT_AVAILABLE, 201, []);
      }
    } catch (error) {
      console.log(error);
      response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }
  // for generate-invoice module
  static getGenerateInvoiceYear = async (req, res) => {
    try {
      let userId;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          bspc_id: req.body.loginedUserid.id
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
          [sequelize.fn('DISTINCT', sequelize.col('receipt_requests.year')), 'year'],
        ]
      }

      let yearData = await db.receiptRequest.findAll(condition)
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

  static getGenerateInvoiceSeasonData = async (req, res) => {
    try {
      let userId;
      // console.log('req.body.loginedUserid.id=====', req.body.loginedUserid.id);
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          bspc_id: req.body.loginedUserid.id
        }
      }

      let condition = {
        include: [
          {
            model: seasonModel,
            attributes: []
          }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('receipt_requests.season')), 'season'],
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

      let seasonData = await db.receiptRequest.findAll(condition);
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

  static getGenerateInvoiceCropData = async (req, res) => {
    try {
      let userId;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          bspc_id: req.body.loginedUserid.id
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
          [sequelize.fn('DISTINCT', sequelize.col('receipt_requests.crop_code')), 'crop_code'],
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

      let cropData = await db.receiptRequest.findAll(condition);
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

  static getGenerateInvoiceTableData = async (req, res) => {
    try {
      let userIdCondition = {};
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userIdCondition.bspc_id = req.body.loginedUserid.id;
      }

      let condition = {
        include: [
          {
            model: varietyModel,
            as: 'm_crop_variety', // Ensure this alias matches your model definition
            attributes: ['variety_name']
          },
          {
            model: stateModel,
            as: 'm_state', // Ensure this alias matches your model definition
            attributes: ['state_name']
          },
          {
            model: userModel,
            as: 'user', // Ensure this alias matches your model definition
            attributes: ['name']
          }
        ],
        attributes: [
          'variety_code',
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          'state_code',
          [sequelize.col('m_state.state_name'), 'state_name'],
          'spa_code',
          [sequelize.col('user.name'), 'name'],
          'available_breederseed_as_per_invoice'
        ],
        where: {
          ...userIdCondition
        },
        raw: true,
        group: [
          'receipt_requests.variety_code',
          'm_crop_variety.variety_name',
          'receipt_requests.state_code',
          'm_state.state_name',
          'receipt_requests.spa_code',
          'user.name',
          'receipt_requests.available_breederseed_as_per_invoice'
        ]
      };

      if (req.body && req.body.search) {
        if (req.body.search.year) {
          condition.where.year = req.body.search.year;
        }
        if (req.body.search.season) {
          condition.where.season = req.body.search.season;
        }
      }

      let Data = await receiptRequest.findAll(condition);
      if (Data && Data.length > 0) {
        return response(res, status.DATA_AVAILABLE, 200, Data);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, []);
      }
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  };

  static getGenerateInvoiceVariety = async (req, res) => {
    try {
      const { user_id, year, season, crop_code } = req.body;
      if (!user_id) {
        return response(res, status.BAD_REQUEST, 400, { message: 'User ID is required' });
      }
      let whereClause = {
        bspc_id: user_id
      };
      if (year) {
        whereClause.year = year;
      }
      if (season) {
        whereClause.season = season;
      }
      if (crop_code) {
        whereClause.crop_code = crop_code;
      }
      const varietyCodesData = await receiptRequestModel.findAll({
        where: whereClause,
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('variety_code')), 'variety_code']
        ],
        raw: true
      });
      const varietyCodes = varietyCodesData.map(item => item.variety_code);
      const varietyDetails = await varietyModel.findAll({
        where: {
          variety_code: varietyCodes
        },
        attributes: ['variety_code', 'variety_name'],
        include: [{
          model: receiptRequestModel,
          attributes: []
        }]
      });
      if (varietyDetails && varietyDetails.length > 0) {
        return response(res, status.DATA_AVAILABLE, 200, varietyDetails);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, []);
      }
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  };

  static getGenerateInvoiceIndenter = async (req, res) => {
    try {
      const { user_id, year, season, crop_code } = req.body;
      if (!user_id) {
        return response(res, status.BAD_REQUEST, 400, { message: 'User ID is required' });
      }
      let whereClause = {
        bspc_id: user_id
      };
      if (year) {
        whereClause.year = year;
      }
      if (season) {
        whereClause.season = season;
      }
      if (crop_code) {
        whereClause.crop_code = crop_code;
      } const indenterIdsData = await receiptRequestModel.findAll({
        where: whereClause,
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('indenter_id')), 'indenter_id']
        ],
        raw: true
      });

      const indenterIds = indenterIdsData.map(item => item.indenter_id);
      const indenterDetails = await userModel.findAll({
        where: {
          id: indenterIds
        },
        attributes: ['id', 'name']
      });
      if (indenterDetails && indenterDetails.length > 0) {
        return response(res, status.DATA_AVAILABLE, 200, indenterDetails);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, []);
      }
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  };

  static getGenerateInvoiceSPA = async (req, res) => {
    try {
      const { user_id, year, season, crop_code } = req.body;
      if (!user_id) {
        return response(res, status.BAD_REQUEST, 400, { message: 'User ID is required' });
      }
      let whereClause = {
        bspc_id: user_id
      };
      if (year) {
        whereClause.year = year;
      }
      if (season) {
        whereClause.season = season;
      }
      if (crop_code) {
        whereClause.crop_code = crop_code;
      }
      const spaCodesData = await receiptRequestModel.findAll({
        where: whereClause,
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('spa_code')), 'spa_code'],
          [sequelize.col('state_code'), 'state_code']
        ],
        raw: true
      });
      const spaCodes = spaCodesData.map(item => item.spa_code);
      const stateCode = spaCodesData.map(item => item.state_code)
      let spaData = []
      if (spaCodesData && spaCodesData.length > 0) {
        for (let key in spaCodesData) {
          // console.log(key,'key')
          const agencyData = await agencyDetailModel.findAll({
            include: [
              {
                model: userModel,
                where: {
                  spa_code: spaCodesData[key].spa_code
                },
                attributes: []
              }
            ],
            where: {
              state_id: spaCodesData[key].state_code
            },
            attributes: [
              [sequelize.col('agency_name'), 'name'],
              [sequelize.col('user.spa_code'), 'spa_code'],
              [sequelize.col('state_id'), 'state_id'],

            ],
            raw: true,
          })
          spaData.push(agencyData)
        }
      }
      if (spaData && spaData.length > 0) {
        spaData = spaData ? spaData.flat() : ''
      }
      console.log(spaData, 'spaData')
      // console.log
      // ce
      if (spaData && spaData.length > 0) {
        return response(res, status.DATA_AVAILABLE, 200, spaData);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, []);
      }
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  };

  // static getGenerateInvoiceList = async (req, res) => {
  //   try {
  //     const { userId, year, season, crop_code } = req.body;
  //     if (!userId) {
  //       return response(res, status.BAD_REQUEST, 400, { message: 'User ID is required' });
  //     }
  //     const receiptRequestData = await receiptRequestModel.findAll({
  //       where: {
  //         bspc_id: userId,
  //         // year: year,
  //         // season: season,
  //         // crop_code: crop_code
  //       },
  //       include: [
  //         {
  //           model: varietyModel,
  //           attributes: [],
  //         },
  //         {
  //           model: userModel,
  //           as: 'userModelIndenter',
  //           attributes: [],   
  //         },
  //         {
  //           model: userModel,
  //           required: true,
  //           as: 'userModelSpa',
  //           attributes: [],
  //           include: [
  //             {
  //               model: agencyDetailModel,
  //               required: true,
  //               where: {
  //                 // state_id: sequelize.col('receipt_requests.state_code')
  //                 state_id: 24
  //               },
  //               attributes: []
  //             },
  //           ]   
  //         },
  //         {
  //           model: allocationToSPASeed,
  //           where: {
  //             year: '2026',
  //             season: 'R',
  //             crop_code: 'A0104',
  //             // variety_id: '30509'
  //             // year: sequelize.col('receipt_requests.year'),
  //             // season: sequelize.col('receipt_requests.season'),
  //             // crop_code: sequelize.col('receipt_requests.crop_code'),
  //           },
  //           attributes: [],   
  //         },
  //       ],
  //       attributes: [
  //         'state_code',
  //         'variety_code',
  //         'invoice_amount',
  //         [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
  //         [sequelize.col('userModelIndenter.name'), 'indenter_name'],
  //         [sequelize.col('userModelIndenter.id'), 'indenter_id'],

  //         [sequelize.col('userModelSpa.spa_code'), 'spa_code'],
  //         [sequelize.col('userModelSpa.name'), 'spa_name'],
  //         // [sequelize.col('allocation_to_spa_for_lifting_seeds.year'), 'year'],
  //       ],
  //       raw: true
  //     });
  //     const varietyMap = receiptRequestData.reduce((acc, item) => {
  //       if (!acc[item.variety_code]) {
  //         acc[item.variety_code] = {
  //           variety_code: item.variety_code,
  //           variety_name: item.variety_name,
  //           indenter_details: []
  //         };
  //       }

  //       let indenter = acc[item.variety_code].indenter_details.find(ind => ind.indenter_id == item.indenter_id);
  //       if (!indenter) {
  //         indenter = {
  //           indenter_id: item.indenter_id,
  //           indenter_name: item.indenter_name,
  //           spa_details: []
  //         };
  //         acc[item.variety_code].indenter_details.push(indenter);
  //       }

  //       indenter.spa_details.push({
  //         spa_code: item.spa_code,
  //         spa_name: item.spa_name,
  //         invoice_amount: item.invoice_amount
  //       });
  //       return acc;
  //     }, {});

  //     const formattedResponse = Object.values(varietyMap);
  //     if (formattedResponse.length > 0) {
  //       return response(res, status.DATA_AVAILABLE, 200, formattedResponse);
  //     } else {
  //       return response(res, status.DATA_NOT_AVAILABLE, 201, []);
  //     }
  //   } catch (error) {
  //     console.log('error', error);
  //     return response(res, status.UNEXPECTED_ERROR, 501, []);
  //   }
  // };

  static getGenerateInvoiceList = async (req, res) => {
    try {
      const { user_id, year, season, crop_code, variety_code, indenter, spa } = req.body;
      if (!user_id) {
        return response(res, status.BAD_REQUEST, 400, { message: 'User ID is required' });
      }
      if (!year || !season || !crop_code) {
        return response(res, status.BAD_REQUEST, 400, { message: 'year, season,crop_code  is required' });
      }
      let query;
      query = `SELECT  
        "receipt_requests"."state_code", 
        "receipt_requests"."id", 
        receipt_requests.payment_request,
        "receipt_requests"."invoice_amount", 
        "receipt_requests"."variety_code", 
        "m_crop_variety"."variety_name" AS "variety_name",
        "userModelIndenter"."name" AS "indenter_name", 
        "userModelIndenter"."id" AS "indenter_id", 
        "userModelSpa"."spa_code" AS "spa_code", 
        "userModelSpa"."name" AS "spa_name",
        allocation_to_spa_for_lifting_seed_production_cnters.allocated_quantity,

        seed_tag_ranges.no_of_bags as spa_no_of_bag,
        variety_price_list_packages.per_qnt_mrp as spa_per_qnt_mrp,
        variety_price_list_packages.packages_size as spa_packages_size,

        receipt_generate_bags.bag_size  as bag_size,
        receipt_generate_bags.bag_price  as bag_price,
        receipt_generate_bags.number_of_bag  as number_of_bag

        FROM "receipt_requests" AS "receipt_requests"
      LEFT OUTER JOIN "m_crop_varieties" AS "m_crop_variety" ON "receipt_requests"."variety_code" = "m_crop_variety"."variety_code"
      LEFT OUTER JOIN "users" AS "userModelIndenter" ON "receipt_requests"."indenter_id" = "userModelIndenter"."id"
      LEFT OUTER JOIN "users" AS "userModelSpa" ON "receipt_requests"."spa_code" = "userModelSpa"."spa_code"
      INNER JOIN "agency_details" AS "userModelSpa->agency_detail" ON "userModelSpa->agency_detail"."user_id" = "userModelSpa".id
      AND "userModelSpa->agency_detail"."state_id" = "receipt_requests"."state_code"
      LEFT OUTER JOIN allocation_to_spa_for_lifting_seeds ON allocation_to_spa_for_lifting_seeds.year = "receipt_requests"."year"
      AND allocation_to_spa_for_lifting_seeds.season = "receipt_requests"."season" 
      AND allocation_to_spa_for_lifting_seeds.crop_code = "receipt_requests"."crop_code" 
      AND allocation_to_spa_for_lifting_seeds.variety_id = "m_crop_variety"."id"
      LEFT OUTER JOIN allocation_to_spa_for_lifting_seed_production_cnters ON 
      allocation_to_spa_for_lifting_seed_production_cnters.allocation_to_spa_for_lifting_seed_id = allocation_to_spa_for_lifting_seeds.id 
      AND allocation_to_spa_for_lifting_seed_production_cnters.spa_code = "receipt_requests"."spa_code"
      AND allocation_to_spa_for_lifting_seed_production_cnters.state_code = "receipt_requests"."state_code"
      AND allocation_to_spa_for_lifting_seed_production_cnters.production_center_id = "receipt_requests"."bspc_id"
      LEFT OUTER JOIN seed_tag_details as seed_tag_details on seed_tag_details.crop_code = receipt_requests.crop_code and seed_tag_details.variety_code = receipt_requests.variety_code and seed_tag_details.season = receipt_requests.season and seed_tag_details.year = receipt_requests.year and seed_tag_details.user_id = receipt_requests.bspc_id
      LEFT OUTER JOIN seed_tag_ranges as seed_tag_ranges on seed_tag_ranges.seed_tag_details_id = seed_tag_details.id
      LEFT OUTER JOIN variety_price_lists as variety_price_lists on variety_price_lists.crop_code = receipt_requests.crop_code and variety_price_lists.season = receipt_requests.season and variety_price_lists.year = receipt_requests.year  and variety_price_lists.variety_code  = receipt_requests.variety_code  AND variety_price_lists.is_active = true
      LEFT OUTER JOIN variety_price_list_packages as variety_price_list_packages on variety_price_list_packages.variety_priece_list_id = variety_price_lists.id and variety_price_list_packages.packages_size= seed_tag_ranges.bag_weight and variety_price_lists.user_id = :user_id AND variety_price_list_packages.is_active = true

      LEFT OUTER join receipt_generates as receipt_generates on receipt_generates.reciept_request_id = receipt_requests.id
      LEFT OUTER join receipt_generate_bags as receipt_generate_bags on receipt_generate_bags.receipt_generate_id =  receipt_generates.id

      WHERE "receipt_requests"."bspc_id" = :user_id 
     
      AND receipt_requests.year = :year and receipt_requests.season = :season and receipt_requests.crop_code = :crop_code
     
      `;
      if (variety_code && variety_code.length > 0) {
        query = query + `and receipt_requests.variety_code IN (:variety_code)`
      }

      if (indenter && indenter.length > 0) {
        query = query + `and receipt_requests.indenter_id IN (:indenter)`
      }

      if (spa && spa.length > 0) {
        query = query + `and receipt_requests.indenter_id IN (:spa)`
      }


      const receiptRequestData = await db.sequelize.query(query, {
        replacements: { user_id, year, season, crop_code, variety_code, indenter, spa },
        type: db.sequelize.QueryTypes.SELECT
      });

      const varietyMap = receiptRequestData.reduce((acc, item) => {
        if (!acc[item.variety_code]) {
          acc[item.variety_code] = {
            id: item.id,
            payment_request: item.payment_request,
            variety_code: item.variety_code,
            variety_name: item.variety_name,
            indenter_details: []
          };
        }

        let indenter = acc[item.variety_code].indenter_details.find(ind => ind.indenter_id == item.indenter_id);
        if (!indenter) {
          indenter = {
            indenter_id: item.indenter_id,
            indenter_name: item.indenter_name,
            spa_details: []
          };
          acc[item.variety_code].indenter_details.push(indenter);
        }

        let spa = indenter.spa_details.find(spa => spa.spa_code == item.spa_code);
        if (!spa) {
          spa = {
            spa_code: item.spa_code,
            spa_name: item.spa_name,
            invoice_amount: item.invoice_amount,
            allocated_quantity: item.allocated_quantity,
            spa_bag_details: [],
            bag_details: []
          };
          indenter.spa_details.push(spa);
        }
        // console.log("spadetails**************",spa_details);
        // if(item.spa_no_of_bag != null && item.spa_per_qnt_mrp != null && item.spa_packages_size != null) {
        let existingSpaBag = spa.spa_bag_details.find(bag =>
          bag.spa_no_of_bag === item.spa_no_of_bag &&
          bag.spa_per_qnt_mrp === item.spa_per_qnt_mrp &&
          bag.spa_packages_size === item.spa_packages_size
        );

        if (!existingSpaBag) {
          spa.spa_bag_details.push({
            spa_no_of_bag: item.spa_no_of_bag,
            spa_per_qnt_mrp: item.spa_per_qnt_mrp,
            spa_packages_size: item.spa_packages_size
          });
        }
        // }

        if (item.bag_size != null && item.bag_price != null && item.number_of_bag != null) {
          let existingBag = spa.bag_details.find(extraBag =>
            extraBag.bag_size === item.bag_size &&
            extraBag.bag_price === item.bag_price &&
            extraBag.number_of_bag === item.number_of_bag
          );

          if (!existingBag) {
            spa.bag_details.push({
              bag_size: item.bag_size,
              bag_price: item.bag_price,
              number_of_bag: item.number_of_bag
            });
          }
        }

        return acc;
      }, {});

      let formattedResponse = Object.values(varietyMap);
      formattedResponse.forEach(item => {
        item.indenter_details.forEach(indenter => {
          indenter.spa_details.forEach(spa => {
            const combinedBagDetails = spa.spa_bag_details.reduce((acc, bag) => {
              // Ignore bags with missing properties
              if (bag.spa_packages_size != null && bag.spa_per_qnt_mrp != null) {
                const existingBag = acc.find(
                  b =>
                    b.spa_packages_size === bag.spa_packages_size &&
                    b.spa_per_qnt_mrp === bag.spa_per_qnt_mrp
                );
                if (existingBag) {
                  existingBag.spa_no_of_bag += bag.spa_no_of_bag;
                } else {
                  acc.push({ ...bag });
                }
              }
              return acc;
            }, []);
            spa.spa_bag_details = combinedBagDetails;
          });
        });
      });
      return formattedResponse.length > 0
        ? response(res, status.DATA_AVAILABLE, 200, formattedResponse)
        : response(res, status.DATA_NOT_AVAILABLE, 201, []);
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  };

  static saveGenerateInvoice = async (req, res) => {
    try {
      const {
        gstGst_amt,
        bag_details,
        totalbags,
        receipt_id,
        grand_total_amt,
        final_grand_total_amt,
        user_id,
        mou_amt,
        mougst_amt,
        mougst_amt_total,
        licence_amt,
        licencegst_amt,
        licencegst_amt_total,
        ppv_amt,
        ppvgst_amt,
        ppvgst_amt_total,
        rlt_amt,
        rltgst_amt,
        rltgst_amt_total,
      } = req.body;
      let receipt_number = "QD324OSD";

      if (!user_id) {
        return response(res, status.BAD_REQUEST, 400, { message: 'User ID is required' });
      }

      const receipt = await receiptGenerateModel.create({
        total_bag: totalbags,
        reciept_request_id: receipt_id,
        cgst: 1,
        igst: 1,
        seed_amount_gst: gstGst_amt,
        total_amount: grand_total_amt,
        grand_total: final_grand_total_amt,
        user_id: user_id,
        mou_amount: mou_amt,
        mou_gst: mougst_amt,
        mou_total_amount: mougst_amt_total,
        licence_amount: licence_amt,
        licence_gst: licencegst_amt,
        licence_total_amount: licencegst_amt_total,
        ppv_amount: ppv_amt,
        ppv_gst: ppvgst_amt,
        ppv_total_amount: ppvgst_amt_total,
        royality_amount: rlt_amt,
        royality_gst: rltgst_amt,
        royality_total_amount: rltgst_amt_total,
        receipt_number: receipt_number,
        created_at: new Date(),
        updated_at: new Date(),
      });

      const receiptId = receipt.id;
      for (const bagDetail of bag_details) {
        await receiptGenerateBagModel.create({
          receipt_generate_id: receiptId,
          number_of_bag: bagDetail.no_of_bag,
          bag_price: bagDetail.spa_per_qnt_mrp,
          bag_size: bagDetail.spa_packages_size,
          total_bag_price: bagDetail.total_amount,
        });
      }
      await receiptRequestModel.update(
        { payment_request: "DONE", invoice_amount: final_grand_total_amt },
        { where: { id: receipt_id } }
      );

      //Request Generate for Payment
      const receiptRequestData = await db.receiptRequestModel.findOne({ where: { id: receipt_id } })
      const apiURL = process.env.PAYMENT_REQUEST_API
      const API_SECRET_KEY = process.env.API_SECRET_KEY
      console.log("receiptRequestData", receiptRequestData.id, receiptRequestData)
      if (receiptRequestData) {
        const apiRequestData = {
          "stateCode": receiptRequestData.state_code ? receiptRequestData.state_code.toString() : "",
          "apiKey": API_SECRET_KEY,
          "spaCode": receiptRequestData.spa_code ? receiptRequestData.spa_code : "",
          "spaName": "GODAVARI VALLY FARMER PRODUCER COM.LTD KALAMNURI DIST HINGOLI",
          "year": receiptRequestData.year ? receiptRequestData.year + "-" + (parseInt(receiptRequestData.year) - 1999) : "",
          "season": receiptRequestData.season ? (receiptRequestData.season == 'K' ? 'KHARIF ' + '(' + receiptRequestData.year + ')' : 'RABI ' + '(' + receiptRequestData.year + "-" + (parseInt(receiptRequestData.year) - 1999) + ')') : "",
          "billNo": receipt_number,
          "head": "nbIndentor",
          "totalPayment": receiptRequestData.invoice_amount ? receiptRequestData.invoice_amount : "",
          "billGenerationDate": this.getCurrentDateTime(),
          "paymentStatus": "pending"
        }
        try {
          // console.log("requestData", requestData)
          await CallExternalAPI.post(apiURL, apiRequestData)
        } catch (e) {
          console.log("errr", e)
        }
      }

      return response(res, status.DATA_SAVE, 200, receipt);
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  };

  static getCurrentDateTime() {
    const now = new Date();

    // Extracting components
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based, so we add 1
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    // Formatted date and time string
    const dateTimeString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return dateTimeString;
  }

  static encryptData(data) {
    return CryptoJS.AES.encrypt(JSON.stringify(data), process.env.AESKey).toString();
  }

  static decryptData(data) {
    try {
      const decodedData = decodeURIComponent(data);
      const bytes = CryptoJS.AES.decrypt(decodedData, process.env.AESKey);
      const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
      const decryptedData = JSON.parse(decryptedText);
      return decryptedData;
    } catch (error) {
      console.error('Decryption failed:', error);
      return null;
    }
  }
  static spaGenerateInvoice = async (req, res) => {
    try {
      const encryptedId = req.body.id;
      if (!encryptedId) {
        return res.status(400).json({ message: 'ID is required' });
      }
      const decryptedData = this.decryptData(encryptedId);
      if (!decryptedData || !decryptedData.id) {
        return res.status(400).json({ message: 'Invalid or corrupted encrypted ID' });
      }
      const { id } = decryptedData;

      const query = `SELECT  
      "receipt_requests"."state_code", 
      "receipt_requests"."id", 
      "receipt_requests"."invoice_amount", 
      "receipt_requests"."variety_code", 
      "m_crops"."crop_name" AS "crop_name",
      "m_crop_variety"."variety_name" AS "variety_name",
      agency_details."agency_name" AS "indenter_name", 
      agency_details."address" AS "indenter_address", 
      agency_details."contact_person_mobile" AS "contact_person_mobile",
      "userModelIndenter"."id" AS "indenter_id", 
      "userModelIndenter->agency_detail->m_districts"."district_name" AS "district_name",
      "userModelIndenter->agency_detail->m_districts"."state_name" AS "state_name",
      "userModelSpa"."spa_code" AS "spa_code", 
      "userModelSpa"."name" AS "spa_name",
      "userModelSpa->agency_detail"."mobile_number" AS spa_mobile_number,
      "userModelSpa->agency_detail"."address" AS spa_address,
      variety_price_list_packages.per_qnt_mrp as spa_per_qnt_mrp,
      variety_price_list_packages.packages_size as spa_packages_size,

       "receipt_generates"."mou_total_amount" AS "mou_total_amount",
        "receipt_generates"."licence_total_amount" AS "licence_total_amount",
        "receipt_generates"."ppv_total_amount" AS "ppv_total_amount",
        "receipt_generates"."royality_total_amount" AS "royality_total_amount",
        "receipt_generates"."total_amount" AS "total_amount",
        "receipt_generates"."grand_total" AS "grand_total",
        "receipt_generates"."seed_amount_gst" AS "seed_amount_gst",


      "receipt_generates"."created_at" AS "date",
      "receipt_generates"."cgst" AS "cgst",
      "receipt_generates"."igst" AS "igst",
      receipt_generate_bags.bag_size  as bag_size,
      receipt_generate_bags.bag_price  as bag_price,
      receipt_generate_bags.number_of_bag  as number_of_bag
      FROM "receipt_requests" AS "receipt_requests"
        INNER JOIN "agency_details" ON "agency_details"."user_id" = "receipt_requests".bspc_id

      LEFT OUTER JOIN "m_crop_varieties" AS "m_crop_variety" ON "receipt_requests"."variety_code" = "m_crop_variety"."variety_code"
      LEFT OUTER JOIN "m_crops" AS "m_crops" ON "receipt_requests"."crop_code" = "m_crops"."crop_code"
      LEFT OUTER JOIN "users" AS "userModelIndenter" ON "receipt_requests"."indenter_id" = "userModelIndenter"."id"
      LEFT OUTER JOIN "users" AS "userModelSpa" ON "receipt_requests"."spa_code" = "userModelSpa"."spa_code"
      INNER JOIN "agency_details" AS "userModelSpa->agency_detail" ON "userModelSpa->agency_detail"."user_id" = "userModelSpa".id
      AND "userModelSpa->agency_detail"."state_id" = "receipt_requests"."state_code"
      INNER JOIN "agency_details" AS "userModelIndenter->agency_detail" ON "userModelIndenter->agency_detail"."user_id" = "userModelIndenter".id
      INNER JOIN "receipt_generates" AS "receipt_generates" ON "receipt_generates"."reciept_request_id" = "receipt_requests"."id"
      LEFT OUTER JOIN receipt_generate_bags as receipt_generate_bags on receipt_generate_bags.receipt_generate_id = receipt_generates.id

      LEFT OUTER JOIN variety_price_lists as variety_price_lists on variety_price_lists.crop_code = receipt_requests.crop_code and variety_price_lists.season = receipt_requests.season and variety_price_lists.year = receipt_requests.year  and variety_price_lists.variety_code  = receipt_requests.variety_code  and variety_price_lists.user_id = receipt_requests.bspc_id AND variety_price_lists.is_active = true
      LEFT OUTER JOIN variety_price_list_packages as variety_price_list_packages on variety_price_list_packages.variety_priece_list_id = variety_price_lists.id and variety_price_list_packages.packages_size= receipt_generate_bags.bag_size AND variety_price_list_packages.is_active = true 
      
      INNER JOIN "m_districts" AS "userModelIndenter->agency_detail->m_districts" ON "userModelIndenter->agency_detail->m_districts"."district_code" = agency_details.district_id
      WHERE  receipt_requests.id = :id `;
      // receipt_requests.year = :year and receipt_requests.season = :season and receipt_requests.crop_code = :crop_code and and"receipt_requests"."bspc_id" = :user_id  AND allocation_to_spa_for_lifting_seed_production_cnters.production_center_id = :user_id
      // AND 
      const receiptRequestData = await db.sequelize.query(query, {
        replacements: { id: id },
        type: db.sequelize.QueryTypes.SELECT
      });
      console.log("replacements", { id });
      // console.log("Generated Query:", query);
      console.log("Replacement ID:", id);
      console.log("Receipt Request Data:", receiptRequestData);

      const varietyMap = receiptRequestData.reduce((acc, item) => {
        if (!acc[item.variety_code]) {
          acc[item.variety_code] = {
            id: item.id,
            payment_request: item.payment_request,
            variety_code: item.variety_code,
            variety_name: item.variety_name,
            indenter_details: []
          };
        }

        let indenter = acc[item.variety_code].indenter_details.find(ind => ind.indenter_id == item.indenter_id);
        if (!indenter) {
          indenter = {
            indenter_id: item.indenter_id,
            indenter_name: item.indenter_name,
            indenter_address: item.indenter_address,
            contact_person_mobile: item.contact_person_mobile,
            district_name: item.district_name,
            state_name: item.state_name,
            spa_details: []
          };
          acc[item.variety_code].indenter_details.push(indenter);
        }

        let spa = indenter.spa_details.find(spa => spa.spa_code == item.spa_code);
        if (!spa) {
          spa = {
            spa_code: item.spa_code,
            spa_name: item.spa_name,
            spa_contact: item.spa_mobile_number,
            spa_address: item.spa_address,
            invoice_amount: item.invoice_amount,
            variety_name: item.variety_name,
            crop_name: item.crop_name,
            mou_charges: item.mou_total_amount,
            licence_total_amount: item.licence_total_amount,
            ppv_amount: item.ppv_total_amount,
            royality_amount: item.royality_total_amount,
            seed_amount_gst: item.seed_amount_gst,
            grand_total: item.total_amount,
            total_payble_amount: item.grand_total,
            date: item.date,
            cgst: item.cgst,
            sgst: item.igst,
            spa_bag_details: [],
            bag_details: []
          };
          indenter.spa_details.push(spa);
        }
        // if(item.spa_no_of_bag != null && item.spa_per_qnt_mrp != null && item.spa_packages_size != null) {
        let existingSpaBag = spa.spa_bag_details.find(bag =>
          bag.spa_no_of_bag === item.spa_no_of_bag &&
          bag.spa_per_qnt_mrp === item.spa_per_qnt_mrp &&
          bag.spa_packages_size === item.spa_packages_size
        );

        if (!existingSpaBag) {
          spa.spa_bag_details.push({
            spa_no_of_bag: item.spa_no_of_bag,
            spa_per_qnt_mrp: item.spa_per_qnt_mrp,
            spa_packages_size: item.spa_packages_size
          });
        }
        // }

        // if(item.bag_size != null && item.bag_price != null && item.number_of_bag != null) {
        let existingBag = spa.bag_details.find(extraBag =>
          extraBag.bag_size === item.bag_size &&
          extraBag.bag_price === item.bag_price &&
          extraBag.number_of_bag === item.number_of_bag
        );

        if (!existingBag) {
          spa.bag_details.push({
            bag_size: item.bag_size,
            bag_price: item.bag_price,
            number_of_bag: item.number_of_bag
          });
        }
        // }
        return acc;
      }, {});

      console.log("varietyMap1:", varietyMap);
      // Add indenter_details_row_count to each indenter_details
      Object.values(varietyMap).forEach(variety => {
        variety.indenter_details.forEach(indenter => {
          indenter.indenter_row_count = indenter.spa_details.length;
        });
      });

      Object.values(varietyMap).forEach(variety => {
        variety.indenter_details.forEach(indenter => {
          indenter.spa_details.forEach(spa => {
            // Filter out bags where number_of_bag is 0
            spa.bag_details = spa.bag_details.filter(bag => bag.number_of_bag !== 0);
            // Count the remaining bags
            spa.spa__row_count = spa.bag_details.length;
          });
        });
      });
      const formattedResponse = Object.values(varietyMap);
      const encryptedResponse = this.encryptData(formattedResponse);
      if (formattedResponse.length > 0) {
        return response(res, status.DATA_AVAILABLE, 200, encryptedResponse);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, []);
      }
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  };
  // static spaGenerateInvoice = async (req, res) => {
  //   try {
  //     const encryptedId = req.body.id;
  //     if (!encryptedId) {
  //       return res.status(400).json({ message: 'ID is required' });
  //     }

  //     const decryptedData = this.decryptData(encryptedId);
  //     if (!decryptedData || !decryptedData.id) {
  //       return res.status(400).json({ message: 'Invalid or corrupted encrypted ID' });
  //     }
  //     const { id } = decryptedData;

  //     const query = `SELECT  
  //     "receipt_requests"."state_code", 
  //     "receipt_requests"."id", 
  //     "receipt_requests"."invoice_amount", 
  //     "receipt_requests"."variety_code", 
  //     "m_crops"."crop_name" AS "crop_name",
  //     "m_crop_variety"."variety_name" AS "variety_name",
  //     agency_details."agency_name" AS "indenter_name", 
  //     agency_details."address" AS "indenter_address", 
  //     agency_details."contact_person_mobile" AS "contact_person_mobile",
  //     "userModelIndenter"."id" AS "indenter_id", 
  //     "userModelIndenter->agency_detail->m_districts"."district_name" AS "district_name",
  //     "userModelIndenter->agency_detail->m_districts"."state_name" AS "state_name",
  //     "userModelSpa"."spa_code" AS "spa_code", 
  //     "userModelSpa"."name" AS "spa_name",
  //     "userModelSpa->agency_detail"."mobile_number" AS spa_mobile_number,
  //     "userModelSpa->agency_detail"."address" AS spa_address,
  //     variety_price_list_packages.per_qnt_mrp as spa_per_qnt_mrp,
  //     variety_price_list_packages.packages_size as spa_packages_size,

  //      "receipt_generates"."mou_total_amount" AS "mou_total_amount",
  //       "receipt_generates"."licence_total_amount" AS "licence_total_amount",
  //       "receipt_generates"."ppv_amount" AS "ppv_amount",
  //       "receipt_generates"."royality_amount" AS "royality_amount",
  //       "receipt_generates"."total_amount" AS "total_amount",
  //       "receipt_generates"."grand_total" AS "grand_total",
  //       "receipt_generates"."seed_amount_gst" AS "seed_amount_gst",


  //     "receipt_generates"."created_at" AS "date",
  //     "receipt_generates"."cgst" AS "cgst",
  //     "receipt_generates"."igst" AS "igst",
  //     receipt_generate_bags.bag_size  as bag_size,
  //     receipt_generate_bags.bag_price  as bag_price,
  //     receipt_generate_bags.number_of_bag  as number_of_bag
  //     FROM "receipt_requests" AS "receipt_requests"
  //       INNER JOIN "agency_details" ON "agency_details"."user_id" = "receipt_requests".bspc_id

  //     LEFT OUTER JOIN "m_crop_varieties" AS "m_crop_variety" ON "receipt_requests"."variety_code" = "m_crop_variety"."variety_code"
  //     LEFT OUTER JOIN "m_crops" AS "m_crops" ON "receipt_requests"."crop_code" = "m_crops"."crop_code"
  //     LEFT OUTER JOIN "users" AS "userModelIndenter" ON "receipt_requests"."indenter_id" = "userModelIndenter"."id"
  //     LEFT OUTER JOIN "users" AS "userModelSpa" ON "receipt_requests"."spa_code" = "userModelSpa"."spa_code"
  //     INNER JOIN "agency_details" AS "userModelSpa->agency_detail" ON "userModelSpa->agency_detail"."user_id" = "userModelSpa".id
  //     AND "userModelSpa->agency_detail"."state_id" = "receipt_requests"."state_code"
  //     INNER JOIN "agency_details" AS "userModelIndenter->agency_detail" ON "userModelIndenter->agency_detail"."user_id" = "userModelIndenter".id
  //     INNER JOIN "receipt_generates" AS "receipt_generates" ON "receipt_generates"."reciept_request_id" = "receipt_requests"."id"

  //     LEFT OUTER JOIN receipt_generate_bags as receipt_generate_bags on receipt_generate_bags.receipt_generate_id = receipt_generates.id

  //     LEFT OUTER JOIN variety_price_lists as variety_price_lists on variety_price_lists.crop_code = receipt_requests.crop_code and variety_price_lists.season = receipt_requests.season and variety_price_lists.year = receipt_requests.year  and variety_price_lists.variety_code  = receipt_requests.variety_code  and variety_price_lists.user_id = receipt_requests.bspc_id

  //     LEFT OUTER JOIN variety_price_list_packages as variety_price_list_packages on variety_price_list_packages.variety_priece_list_id = variety_price_lists.id and variety_price_list_packages.packages_size= receipt_generate_bags.bag_size 

  //     INNER JOIN "m_districts" AS "userModelIndenter->agency_detail->m_districts" ON "userModelIndenter->agency_detail->m_districts"."district_code" = agency_details.district_id
  //     WHERE  receipt_requests.id = :id `;
  //     // receipt_requests.year = :year and receipt_requests.season = :season and receipt_requests.crop_code = :crop_code and and"receipt_requests"."bspc_id" = :user_id  AND allocation_to_spa_for_lifting_seed_production_cnters.production_center_id = :user_id
  //     // AND 
  //     const receiptRequestData = await db.sequelize.query(query, {
  //       replacements: { id },
  //       type: db.sequelize.QueryTypes.SELECT
  //     });

  //     const varietyMap = receiptRequestData.reduce((acc, item) => {
  //       if (!acc[item.variety_code]) {
  //         acc[item.variety_code] = {
  //           id: item.id,
  //           payment_request: item.payment_request,
  //           variety_code: item.variety_code,
  //           variety_name: item.variety_name,
  //           indenter_details: []
  //         };
  //       }

  //       let indenter = acc[item.variety_code].indenter_details.find(ind => ind.indenter_id == item.indenter_id);
  //       if (!indenter) {
  //         indenter = {
  //           // indenter_id: item.indenter_id,
  //           // indenter_name: item.indenter_name,
  //           // spa_details: []

  //           indenter_id: item.indenter_id,
  //           indenter_name: item.indenter_name,
  //           indenter_address: item.indenter_address,
  //           contact_person_mobile: item.contact_person_mobile,
  //           district_name: item.district_name,
  //           state_name: item.state_name,
  //           spa_details: []

  //         };
  //         acc[item.variety_code].indenter_details.push(indenter);
  //       }

  //       let spa = indenter.spa_details.find(spa => spa.spa_code == item.spa_code);
  //       if (!spa) {
  //         spa = {
  //           // spa_code: item.spa_code,
  //           // spa_name: item.spa_name,
  //           // invoice_amount: item.invoice_amount,
  //           // allocated_quantity: item.allocated_quantity,
  //           // spa_bag_details: [],
  //           // bag_details: []

  //           spa_code: item.spa_code,
  //           spa_name: item.spa_name,
  //           spa_contact: item.spa_mobile_number,
  //           spa_address: item.spa_address,
  //           invoice_amount: item.invoice_amount,
  //           variety_name: item.variety_name,
  //           crop_name: item.crop_name,



  //           mou_charges: item.mou_total_amount,
  //           licence_total_amount: item.licence_total_amount,
  //           ppv_amount: item.ppv_amount,
  //           royality_amount: item.royality_amount,
  //           seed_amount_gst: item.seed_amount_gst,
  //           grand_total: item.total_amount,
  //           total_payble_amount: item.grand_total,

  //           date: item.date,
  //           cgst: item.cgst,
  //           sgst: item.igst,
  //           spa_bag_details: [],
  //           bag_details: []

  //         };
  //         indenter.spa_details.push(spa);
  //       }
  //       // if(item.spa_no_of_bag != null && item.spa_per_qnt_mrp != null && item.spa_packages_size != null) {
  //       let existingSpaBag = spa.spa_bag_details.find(bag =>
  //         bag.spa_no_of_bag === item.spa_no_of_bag &&
  //         bag.spa_per_qnt_mrp === item.spa_per_qnt_mrp &&
  //         bag.spa_packages_size === item.spa_packages_size
  //       );

  //       if (!existingSpaBag) {
  //         spa.spa_bag_details.push({
  //           spa_no_of_bag: item.spa_no_of_bag,
  //           spa_per_qnt_mrp: item.spa_per_qnt_mrp,
  //           spa_packages_size: item.spa_packages_size
  //         });
  //       }
  //       // }

  //       // if(item.bag_size != null && item.bag_price != null && item.number_of_bag != null) {
  //       let existingBag = spa.bag_details.find(extraBag =>
  //         extraBag.bag_size === item.bag_size &&
  //         extraBag.bag_price === item.bag_price &&
  //         extraBag.number_of_bag === item.number_of_bag
  //       );

  //       if (!existingBag) {
  //         spa.bag_details.push({
  //           bag_size: item.bag_size,
  //           bag_price: item.bag_price,
  //           number_of_bag: item.number_of_bag
  //         });
  //       }
  //       // }

  //       return acc;
  //     }, {});

  //     // Add indenter_details_row_count to each indenter_details
  //     Object.values(varietyMap).forEach(variety => {
  //       variety.indenter_details.forEach(indenter => {
  //         indenter.indenter_row_count = indenter.spa_details.length;
  //       });
  //     });
  //     // Add spa_details_row_count to each spa_details

  //     // Object.values(varietyMap).forEach(variety => {
  //     //   variety.indenter_details.forEach(indenter => {
  //     //     indenter.spa_details.forEach(spa => {
  //     //       spa.spa__row_count = spa.bag_details.length;
  //     //     });
  //     //   });
  //     // });

  //     // Add spa_details_row_count to each spa_details, excluding those with 0 bags

  //     // Remove bags with number_of_bag == 0 and count the remaining ones
  //     Object.values(varietyMap).forEach(variety => {
  //       variety.indenter_details.forEach(indenter => {
  //         indenter.spa_details.forEach(spa => {
  //           // Filter out bags where number_of_bag is 0
  //           spa.bag_details = spa.bag_details.filter(bag => bag.number_of_bag !== 0);
  //           // Count the remaining bags
  //           spa.spa__row_count = spa.bag_details.length;
  //         });
  //       });
  //     });

  //     const formattedResponse = Object.values(varietyMap);
  //     const encryptedResponse = this.encryptData({ data: formattedResponse });
  //     if (formattedResponse.length > 0) {
  //       return response(res, status.DATA_AVAILABLE, 200, encryptedResponse);
  //     } else {
  //       return response(res, status.DATA_NOT_AVAILABLE, 201, []);
  //     }

  //     // const varietyMap = receiptRequestData.reduce((acc, item) => {
  //     //   if (!acc[item.variety_code]) {
  //     //     acc[item.variety_code] = {
  //     //       id: item.id,
  //     //       variety_code: item.variety_code,
  //     //       // variety_name: item.variety_name,
  //     //       // crop_name: item.crop_name,
  //     //       indenter_details: []
  //     //     };
  //     //   }

  //     //   let indenter = acc[item.variety_code].indenter_details.find(ind => ind.indenter_id == item.indenter_id);
  //     //   if (!indenter) {
  //     //     indenter = {
  //     //       indenter_id: item.indenter_id,
  //     //       indenter_name: item.indenter_name,
  //     //       indenter_address: item.indenter_address,
  //     //       contact_person_mobile: item.contact_person_mobile,
  //     //       district_name: item.district_name,
  //     //       state_name: item.state_name,
  //     //       spa_details: []
  //     //     };
  //     //     acc[item.variety_code].indenter_details.push(indenter);
  //     //   }

  //     //   let spa = indenter.spa_details.find(spa => spa.spa_code == item.spa_code);
  //     //   if (!spa) {
  //     //     spa = {
  //     //       spa_code: item.spa_code,
  //     //       spa_name: item.spa_name,
  //     //       spa_contact: item.spa_mobile_number,
  //     //       spa_address: item.spa_address,
  //     //       invoice_amount: item.invoice_amount,
  //     //       variety_name: item.variety_name,
  //     //       crop_name: item.crop_name,
  //     //       mou_charges: item.mou_total_amount,
  //     //       date:item.date,
  //     //       cgst: item.cgst,
  //     //       sgst:item.igst,
  //     //       bag_details: []
  //     //     };
  //     //     indenter.spa_details.push(spa);
  //     //   }

  //     //   let existingBag = spa.bag_details.find(bag => 
  //     //     bag.no_of_bags === item.no_of_bags &&
  //     //     bag.per_qnt_mrp === item.per_qnt_mrp &&
  //     //     bag.packages_size === item.packages_size
  //     //   );

  //     //   if (!existingBag) {
  //     //     spa.bag_details.push({
  //     //       no_of_bags: item.no_of_bags,
  //     //       per_qnt_mrp: item.per_qnt_mrp,
  //     //       packages_size: item.packages_size
  //     //     });
  //     //   }

  //     //   return acc;
  //     // }, {});

  //     //   // Add indenter_details_row_count to each indenter_details
  //     // Object.values(varietyMap).forEach(variety => {
  //     //   variety.indenter_details.forEach(indenter => {
  //     //     indenter.indenter_row_count = indenter.spa_details.length;
  //     //   });
  //     // });
  //     //   // Add spa_details_row_count to each spa_details
  //     // Object.values(varietyMap).forEach(variety => {
  //     //   variety.indenter_details.forEach(indenter => {
  //     //     indenter.spa_details.forEach(spa => {
  //     //       spa.spa__row_count = spa.bag_details.length;
  //     //     });
  //     //   });
  //     // });

  //     // const formattedResponse = Object.values(varietyMap);
  //     // if (formattedResponse.length > 0) {
  //     //   return response(res, status.DATA_AVAILABLE, 200, formattedResponse);
  //     // } else {
  //     //   return response(res, status.DATA_NOT_AVAILABLE, 201, []);
  //     // }


  //   } catch (error) {
  //     console.log('error', error);
  //     return response(res, status.UNEXPECTED_ERROR, 501, []);
  //   }
  // };
  static getLiftingLot = async (req, res) => {
    try {
      let userId;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          user_id: req.body.loginedUserid.id
        }
      }
      let lotnoArray = []
      let lotnoarraycondtion;
      if (req.body && req.body.is_self && req.body.is_self == true) {
        let conditionSecond = {
          include: [
            {
              model: db.liftingLotNumberModel,
              attributes: []
            }
          ],
          attributes: [
            [sequelize.col('lifting_lot_number.lot_no'), 'lot_no']
          ],
          where: {
            year: req.body && req.body.year ? req.body.year : '',
            season: req.body && req.body.season ? req.body.season : '',
            crop_code: req.body && req.body.crop_code ? req.body.crop_code : '',
            ...userId
          },
          raw: true
        }
        let isDataExist = await db.liftingSeedDetailsModel.findAll(conditionSecond);

        if (isDataExist && isDataExist.length) {
          isDataExist.forEach((ele) => {
            lotnoArray.push(ele.lot_no)
          })
        }
        if (lotnoArray && lotnoArray.length) {
          lotnoarraycondtion = {
            lot_no: {
              [Op.notIn]: lotnoArray
            }
          }
        }
      }
      let condition;
      if (req.body.radio_type == "national-temp") {
        condition = {
          include: [
            // {
            //   model: db.seedTagRange,
            //   attributes: []
            // },
            {
              required:true,
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
            [sequelize.fn('DISTINCT', sequelize.col('seed_tag_details.lot_id')), 'lot_id'],
            [sequelize.col('seed_tag_details.lot_no'), 'lot_no'],
            // [sequelize.col('seed_tag_range.bag_weight'), 'bag_weight']
          ],
          raw: true,
          where: {
            // ...lotnoarraycondtion,
            ...userId,
            // is_active: 0
          },
        }
      } else {
        condition = {
          include: [
          {
              required:true,
              model: db.seedTagsModel,
              attributes: [],
              where: {
                is_active: 0
              }
            },
          ],
          attributes: [
            [sequelize.fn('DISTINCT', sequelize.col('seed_tag_details.lot_no')), 'lot_no'],
            [sequelize.col('seed_tag_details.lot_id'), 'lot_id'],
            // [sequelize.col('seed_tag_range.bag_weight'), 'bag_weight']
          ],
          raw: true,
          where: {
            // ...lotnoarraycondtion,
            ...userId,
            // is_active: 0
          },
        }
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
          condition.where.variety_code = req.body.variety_code;
          // condition1.where.variety_id = req.body.variety_id;
        }
        if (req.body.variety_id) {
          condition.where.variety_id = req.body.variety_id;
          // condition1.where.variety_id = req.body.variety_id;
        }
      }

      // const {year,season,crop_code,variety_id}=req.body
      // let condition={
      //   where:{
      //     year:year,
      //     season:season,
      //     crop_code:crop_code,

      //   }
      // }
      let lotNoDetailsData = await db.seedTagDetails.findAll(condition);
      console.log(lotNoDetailsData, 'lotNoDetailsData')
      if (lotNoDetailsData && lotNoDetailsData.length) {
        response(res, status.DATA_AVAILABLE, 200, lotNoDetailsData);
      } else {
        response(res, status.DATA_NOT_AVAILABLE, 201, []);
      }
    } catch (error) {
      console.log(error);
      response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }
  
  static getSurplusIndentLotNumber = async (req, res) => {
    try {
    const { search = {}, loginedUserid = {} } = req.body || {};
    let whereClause = {};

    if (search.year) whereClause.year = search.year;
    if (search.season) whereClause.season = search.season;
    if (search.crop_code) whereClause.crop_code = search.crop_code;
    if (search.variety_code) whereClause.variety_code = search.variety_code;
    if (loginedUserid.id) whereClause.user_id = loginedUserid.id;

    // Get already lifted tag numbers
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

    const lotNoDetailsData = await db.seedTagDetails.findAll({
      attributes: [[sequelize.fn("DISTINCT", sequelize.col("seed_tag_details.lot_no")), "lot_no"]],
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

    if (lotNoDetailsData && lotNoDetailsData.length) {
      response(res, status.DATA_AVAILABLE, 200, lotNoDetailsData);
    } else {
      response(res, status.DATA_NOT_AVAILABLE, 201, []);
      }
    } catch (error) {
      console.log(error);
      response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }

  static getReprintAllTagData = async (req, res) => {
    try {
      let tagNoArray;
      let userId;
      let lotNo;
      if (req.body.tag_no_array && req.body.tag_no_array.length) {
        tagNoArray = {
          tag_no: { [Op.in]: req.body.tag_no_array }
        }
      }
      if (req.body.lot_no) {
        lotNo = {
          lot_no: req.body.lot_no
        }
      }

      if (req.loginedUserid && req.loginedUserid.id) {
        userId = {
          user_id: req.loginedUserid.id
        }
      }
      let condition = {
        include: [
          {
            model: db.stlReportStatusModel,
            attributes: [],
            // where: {
            //   // Filter matching fields from both tables
            //   year: { [db.Sequelize.Op.eq]: db.Sequelize.col('seed_tag_detail.year') },
            //   season: { [db.Sequelize.Op.eq]: db.Sequelize.col('seed_tag_detail.season') },
            //   crop_code: { [db.Sequelize.Op.eq]: db.Sequelize.col('seed_tag_detail.crop_code') },
            //   variety_code: { [db.Sequelize.Op.eq]: db.Sequelize.col('seed_tag_detail.variety_code') },
            user_id: { [db.Sequelize.Op.eq]: db.Sequelize.col('seed_tag_detail.user_id') },
            lot_no: { [db.Sequelize.Op.eq]: db.Sequelize.col('seed_tag_detail.lot_no') }
            // }
          },
          {
            model: db.varietyModel,
            attributes: [],
          },
          {
            model: db.varietLineModel,
            attributes: [],
          },
          {
            model: db.seedTagRange,
            attributes: [],
          },
          {
            model: db.seedTagsModel,
            attributes: [],
            where: {
              ...tagNoArray
            }
          }
        ],
        where: {
          ...userId,
          ...lotNo
        },
        attributes: [
          [sequelize.col('seed_tag_details.year'), 'year'],
          [sequelize.col('seed_tag_details.season'), 'season'],
          [sequelize.col('seed_tag_details.crop_code'), 'crop_code'],
          [sequelize.col('seed_tag_details.variety_code'), 'variety_code'],
          [sequelize.col('seed_tag_details.variety_line_code'), 'variety_line_code'],
          [sequelize.col('seed_tag_details.lot_no'), 'lot_no'],
          [sequelize.col('seed_tag_details.lot_id'), 'lot_id'],
          [sequelize.col('seed_tag_details.pure_seed'), 'pure_seed'],
          [sequelize.col('seed_tag_details.inert_matter'), 'inert_matter'],
          [sequelize.col('seed_tag_details.germination'), 'germination'],
          [sequelize.col('seed_tag_details.lot_qty'), 'lot_qty'],
          // [sequelize.col('seed_tag_details.date_of_test'), 'date_of_test'],
          // [sequelize.literal("('1970-01-01'::date + seed_tag_details.date_of_test::time)"), 'date_of_test'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety'],
          [sequelize.col('m_variety_line.line_variety_name'), 'line_variety_name'],

          [sequelize.col('seed_tag_details.stack_no'), 'stack_no'],
          [sequelize.col('seed_tag_range.no_of_bags'), 'no_of_bags'],
          [sequelize.col('seed_tag_range.bag_weight'), 'bag_weight'],
          [sequelize.col('seed_tag.tag_no'), 'tag_no'],
          [sequelize.col('seed_tag.bag_size'), 'bag_size'],
          [sequelize.col('stl_report_status.normal_seeding'), 'normal_seeding'],
          [sequelize.col('stl_report_status.date_of_test'), 'date_of_test'],

        ],
        raw: true
      }
      let reprintAllTagData = await db.seedTagDetails.findAll(condition);
      if (reprintAllTagData && reprintAllTagData.length) {
        return response(res, status.DATA_AVAILABLE, 200, reprintAllTagData);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, []);
      }
    } catch (error) {
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }

  static addDisacrdTagData = async (req, res) => {
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
      if (req.body) {
        if (req.body.reprintTagData) {
          let data;
          let rules = {
            "year": 'required|integer',
            "season": 'required|string',
            "crop_code": 'required|string',
            "variety_code": 'required|string',
            "lot_no": 'required|string',
          };
          let validation = new Validator(req.body.reprintTagData, rules);
          const isValidData = validation.passes();

          if (!isValidData) {
            let errorResponse = {};
            for (let key in rules) {
              const error = validation.errors.get(key);
              if (error.length) {
                errorResponse[key] = error;
              }
            }
            return response(res, status.BAD_REQUEST, 400, errorResponse, [])
          }
          if (req.body.reprintTagData.id) {
            let tagData = await db.discardRequestedTagsModel.findAll({
              attributes: ["id", "tag_no"],
              where: {
                discard_id: req.body.reprintTagData.id
              },
              raw: true,
            })
            for (let key of tagData) {
              let data1 = await db.seedTagsModel.update({
                is_discard: 0,

              },
                {
                  where: {
                    tag_no: key.tag_no
                  }
                }
              );
            }
            await db.discardRequestedTagsModel.destroy({
              where: {
                discard_id: req.body.reprintTagData.id
              }
            });

            data = await db.discardTagsModel.update({
              year: req.body.reprintTagData.year ? req.body.reprintTagData.year : "",
              season: req.body.reprintTagData.season ? req.body.reprintTagData.season : "",
              crop_code: req.body.reprintTagData.crop_code ? req.body.reprintTagData.crop_code : "",
              variety_code: req.body.reprintTagData.variety_code ? req.body.reprintTagData.variety_code : "",
              variety_line_code: req.body.reprintTagData.variety_line_code ? req.body.reprintTagData.variety_line_code : "",
              lot_no: req.body.reprintTagData.lot_no ? req.body.reprintTagData.lot_no : "",
              lot_id: req.body.reprintTagData.lot_id ? req.body.reprintTagData.lot_id : null,
              is_approved: null,
              reason: req.body.reprintTagData.reason_id ? req.body.reprintTagData.reason_id : null,
              ...userId
            },
              {
                where: {
                  id: req.body.reprintTagData.id
                }
              }
            );
            let data1;
            if (req.body.reprintTagData && req.body.reprintTagData.tags && req.body.reprintTagData.tags.length) {
              for (let item of req.body.reprintTagData.tags) {
                data1 = await db.discardRequestedTagsModel.create({
                  discard_id: req.body.reprintTagData.id,
                  tag_no: item.tag_no
                });
              }
              for (let item of req.body.reprintTagData.tags) {
                data1 = await db.seedTagsModel.update({
                  is_discard: 1,
                }, {
                  where: {
                    tag_no: item.tag_no
                  }
                });
              }
            }

            if (data) {
              return response(res, status.DATA_SAVE, 200, req.body);
            } else {
              return response(res, status.DATA_NOT_SAVE, 201);
            }
          } else {
            data = await db.discardTagsModel.create({
              year: req.body.reprintTagData.year ? req.body.reprintTagData.year : "",
              season: req.body.reprintTagData.season ? req.body.reprintTagData.season : "",
              crop_code: req.body.reprintTagData.crop_code ? req.body.reprintTagData.crop_code : "",
              variety_code: req.body.reprintTagData.variety_code ? req.body.reprintTagData.variety_code : "",
              variety_line_code: req.body.reprintTagData.variety_line_code ? req.body.reprintTagData.variety_line_code : "",
              lot_no: req.body.reprintTagData.lot_no ? req.body.reprintTagData.lot_no : "",
              lot_id: req.body.reprintTagData.lot_id ? req.body.reprintTagData.lot_id : null,
              is_approved: null,
              reason: req.body.reprintTagData.reason_id ? req.body.reprintTagData.reason_id : null,
              ...userId,

            }
            );
            let data1;
            if (req.body.reprintTagData && req.body.reprintTagData.tags && req.body.reprintTagData.tags.length) {
              for (let item of req.body.reprintTagData.tags) {
                data1 = await db.discardRequestedTagsModel.create({
                  discard_id: data.dataValues.id,
                  tag_no: item.tag_no
                });
              }
              for (let item of req.body.reprintTagData.tags) {
                data1 = await db.seedTagsModel.update({
                  is_discard: 1,

                },
                  {
                    where: {
                      tag_no: item.tag_no
                    }
                  }
                );
              }
            }

            if (data) {
              return response(res, status.DATA_SAVE, 200, req.body);
            } else {
              return response(res, status.DATA_NOT_SAVE, 201);
            }
          }

        } else {
          return response(res, "all fields data required", 201, []);
        }
      } else {
        return response(res, "all fields data required", 201, []);
      }
    } catch (error) {
      console.log('error', error)
      return response(res, status.UNEXPECTED_ERROR, 501, error);
    }
  }

  static getDiscardTagData = async (req, res) => {
    try {

      let userId;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          user_id: req.body.loginedUserid.id
        }
      }
      if (req.body.user_id && req.body.user_id) {
        userId = {
          user_id: req.body.user_id
        }
      }
      let condition = {

        include: [
          {
            model: db.varietyModel,
            attributes: ['variety_code', 'variety_name']
          },
          {
            model: db.mVarietyLinesModel,
            attributes: ['line_variety_code', 'line_variety_name']
          },
          {
            model: db.seasonModel,
            attributes: ['season_code', 'season'],
          },
          {
            model: db.userModel,
            attributes: ['name', 'username', 'id']
          },
          {
            model: db.seedTagDetails,
            required: false,

            include: [
              {
                model: db.stlReportStatusModel,
                required: true,
                attributes: ['id'],
                where: {
                  // Filter matching fields from both tables
                  year: { [db.Sequelize.Op.eq]: db.Sequelize.col('seed_tag_detail.year') },
                  season: { [db.Sequelize.Op.eq]: db.Sequelize.col('seed_tag_detail.season') },
                  crop_code: { [db.Sequelize.Op.eq]: db.Sequelize.col('seed_tag_detail.crop_code') },
                  variety_code: { [db.Sequelize.Op.eq]: db.Sequelize.col('seed_tag_detail.variety_code') },
                  user_id: { [db.Sequelize.Op.eq]: db.Sequelize.col('seed_tag_detail.user_id') },
                  lot_no: { [db.Sequelize.Op.eq]: db.Sequelize.col('seed_tag_detail.lot_no') }
                }
              },
              {
                model: db.userModel,
                attributes: ['name', 'username'],
                include: [
                  {
                    model: db.agencyDetailModel,
                    attributes: ['agency_name']
                  }
                ]
              }
            ],
          },
          {
            model: db.discardRequestedTagsModel,
            required: false,
            // attributes:[],
            where: {
            }
          }
        ],
        attributes: ['year', 'season', 'crop_code', 'variety_line_code', 'variety_code', 'reason', 'lot_no', 'is_approved',
          'lot_id', 'user_id', 'created_at', 'updated_at',
          [sequelize.col('seed_tag_detail->stl_report_status.normal_seeding'), 'normal_seeding'],
          [sequelize.col('seed_tag_detail->stl_report_status.date_of_test'), 'date_of_test1'],
          [sequelize.col('discard_tags.id'), 'reprint_id']
        ],
        // attributes: ["*",
        //   // [sequelize.fn('DISTINCT', sequelize.col('seed_tag_details.lot_id')), 'lot_id'],
        //   // [sequelize.col('seed_tag_details.lot_no'), 'lot_no']
        // ],
        nest: true,
        raw: true,
        where: {
          ...userId
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
        if (req.body.lot_no) {
          condition.where.lot_no = req.body.lot_no
        }
        if (req.body.lot_id) {
          condition.where.lot_id = req.body.lot_id
        }
        if (req.body.spp_code) {
          condition.where.user_id = req.body.spp_code
        }
        // if (req.body.tag_no) {
        //   condition.include[5].where.tag_no = req.body.tag_no
        // }
      }

      let dataList = await db.discardTagsModel.findAll(condition);

      let result;
      if (dataList && dataList.length > 0) {
        const groupedData = dataList.reduce((acc, obj) => {
          const reprintId = obj.reprint_id;
          if (!acc[reprintId]) {
            acc[reprintId] = [];
          }
          acc[reprintId].push(obj);
          return acc;
        }, {});

        // Step 2: Creating reprint_requested_tag array for each reprint_id
        result = Object.values(groupedData).map(group => {
          const reprintRequestedTags = group.map(item => item.discard_tag_request);
          return {
            ...group[0], // Assuming other properties are identical within each group
            // reprint_requested_tag
            discard_tag_request: reprintRequestedTags
          };
        });

      }
      if (result && result.length > 0) {
        result.forEach(el => {
          el.discard_tag_request = productiohelper.removeDuplicates(el.discard_tag_request, 'id')
        })
      }
      // console.log(dataList,'dataList')
      if (result) {
        return response(res, status.DATA_AVAILABLE, 200, result);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, [])
      }
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }

  static getDiscardTagNoListData = async (req, res) => {
    try {
      let userId;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          user_id: req.body.loginedUserid.id
        }
      }
      let condition = {
        include: [
          {
            model: db.discardRequestedTagsModel,
            attributes: []
          }
        ],
        attributes: [
          [sequelize.col('reprint_requested_tag.reprint_tag_id'), 'reprint_tag_id'],
          [sequelize.col('reprint_requested_tag.tag_no'), 'tag_no'],
        ],
        raw: true,
        where: {
          ...userId
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
        if (req.body.lot_no) {
          condition.where.lot_no = req.body.lot_no
        }
        if (req.body.lot_id) {
          condition.where.lot_id = req.body.lot_id
        }
        if (req.body.id) {
          condition.where.lot_id = req.body.lot_id
        }
      }

      let dataList = await db.discardTagsModel.findAll(condition);
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
  static deleteDiscardTagData = async (req, res) => {
    try {
      if (req.body && req.body.id) {
        let tagData = await db.discardRequestedTagsModel.findAll({
          attributes: ["id", "tag_no"],
          where: {
            discard_id: req.body.id
          },
          raw: true,
        })
        for (let key of tagData) {
          let data1 = await db.seedTagsModel.update({
            is_discard: 0,

          },
            {
              where: {
                tag_no: key.tag_no
              }
            }
          );
        }
        let data = await db.discardRequestedTagsModel.destroy({
          where: {
            discard_id: req.body.id
          }
        });
        if (data) {
          await db.discardTagsModel.destroy({
            where: {
              id: req.body.id
            }
          })
          return response(res, status.DATA_DELETED, 200, []);
        } else {
          return response(res, "DATA NOT DELETED", 201, []);
        }
      }
    } catch (error) {
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }
  static getDiscardTagVariety = async (req, res) => {
    try {
      let userId;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          user_id: req.body.loginedUserid.id
        }
      }
      if (req.body.user_id && req.body.user_id) {
        userId = {
          user_id: req.body.user_id
        }
      }
      let condition = {
        include: [
          {
            model: varietyModel,
            attributes: []
          },
          // {
          //   model: db.seedTagsModel,
          //   attributes: [],
          //   where: {
          //     is_acive: 0
          //   }
          // }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('discard_tags.variety_code')), 'variety_code'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],

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
        if (req.body.search.season) {
          condition.where.season = req.body.search.season
        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = req.body.search.crop_code
        }
      }

      let varietyData = await db.discardTagsModel.findAll(condition)
      if (varietyData) {
        return response(res, status.DATA_AVAILABLE, 200, varietyData);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, [])
      }
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }
}
module.exports = TagPrint
