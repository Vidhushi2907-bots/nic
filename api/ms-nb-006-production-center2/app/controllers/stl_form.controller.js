require('dotenv').config()
const response = require('../_helpers/response')
const status = require('../_helpers/status.conf')
const db = require("../models");
const sendSms = require("../_helpers/sms")
const CallExternalAPI = require("../_helpers/call-external-api")
const stlLab = require("../_helpers/getstl-response")

let Validator = require('validatorjs');

const { varietyModel, seasonModel, cropModel } = db

const sequelize = require('sequelize');
const ConditionCreator = require('../_helpers/condition-creator')
const Op = require('sequelize').Op;
const union = require('lodash');
const { where } = require('../models/db');
const productiohelper = require('../_helpers/productionhelper');
const fs = require('fs');


class StlForms {
  static getSeedProcessingRegisterYearDatav1 = async (req, res) => {
    try {
      let userId;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          user_id: req.body.loginedUserid.id
        }
      }
      let condition = {
        where: {
          ...userId
        },
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('seed_processing_register.year')), 'year'],
        ]
      }

      let yearData = await db.seedProcessingRegister.findAll(condition)
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
  static removeDuplicates(data) {
    const uniqueYears = new Set();
    return data.filter(item => {
      if (!uniqueYears.has(item.year)) {
        uniqueYears.add(item.year);
        return true;
      }
      return false;
    });
  }
  static removeDuplicates1(data) {
    const uniqueYears = new Set();
    return data.filter(item => {
      // && item.year && item.season && item.crop_code
      //  && item.year && item.season && item.crop_code
      if (!uniqueYears.has(item.lot_id)) {
        uniqueYears.add(item.lot_id);
        return true;
      }
      return false;
    });
  }

  static getSeedProcessingRegisterYearData = async (req, res) => {
    try {
      let userId;
      let userId1;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          bspc_id: req.body.loginedUserid.id
        }
        userId1 = {
          user_id: req.body.loginedUserid.id
        }
      }
      let condition;
      condition = {
        include: [
          {

            model: db.carryOverSeedDetailsModel,
            required: false,
            include: [
              {
                model: db.carryOverSeedModel,
                where: {
                  ...userId1
                },
                required: false,
                attributes: []
              }
            ],
            attributes: []
          }
        ],
        where: {
          get_carry_over: 2,
          ...userId
        },

        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('seed_processing_register.year')), 'year'],
          // [sequelize.col('carry_over_seed_detail.lot_no'),'lot_no']
        ],
        raw: true
      }
      let condition1 = {
        include: [
          {
            model: db.investVerifyModel,
            required: false,
            include: [
              {
                model: db.investHarvestingModel,
                where: {
                  ...userId1
                },
                attributes: []
              }
            ],

            attributes: []
          }
        ],
        // include:[
        //   // {
        //   //   model:db.intakeVerificationTags,
        //   //   required:false,

        //   //   attributes:[]
        //   // }
        // ],
        where: {
          get_carry_over: 1,
          ...userId,
          action:{
            [Op.not]:2
          }
        },

        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('seed_processing_register.year')), 'year'],
          // [sequelize.col('carry_over_seed_detail.lot_no'),'lot_no']
        ],
        raw: true
      }
      let yearData = await db.seedProcessingRegister.findAll(condition)
      let yearData2 = await db.seedProcessingRegister.findAll(condition1)
      let yearData1 = yearData.concat(yearData2)
      const uniqueData = this.removeDuplicates(yearData1);
      console.log('unique data', uniqueData);
      if (uniqueData) {
        return response(res, status.DATA_AVAILABLE, 200, uniqueData);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, [])
      }
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }
  static getSeedProcessingRegisterSeasonDatav1 = async (req, res) => {
    try {
      let userId;
      let userId1;
      console.log('req.body.loginedUserid.id=====', req.body.loginedUserid.id);
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          bspc_id: req.body.loginedUserid.id
        }
        userId1 = {
          user_id: req.body.loginedUserid.id
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
          [sequelize.fn('DISTINCT', sequelize.col('seed_processing_register.season')), 'season'],
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

      let seasonData = await db.seedProcessingRegister.findAll(condition)
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
  static getSeedProcessingRegisterSeasonData = async (req, res) => {
    try {
      let userId;
      let userId1;
      console.log('req.body.loginedUserid.id=====', req.body.loginedUserid.id);
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          bspc_id: req.body.loginedUserid.id
        }
        userId1 = {
          user_id: req.body.loginedUserid.id
        }
      }
      let condition;
      condition = {
        include: [
          // {

          //   model: db.carryOverSeedDetailsModel,
          //   required: false,
          //   include: [
          //     {
          //       model: db.carryOverSeedModel,
          //       where: {
          //         ...userId1
          //       },
          //       required: false,
          //       attributes: []
          //     }
          //   ],
          //   attributes: []
          // },
          {
            model: seasonModel,
            attributes: []
          }
        ],
        where: {
          get_carry_over: 2,
          ...userId
        },

        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('seed_processing_register.season')), 'season'],
          [sequelize.col('m_season.season'), 'season_name'],
          // [sequelize.fn('DISTINCT', sequelize.col('seed_processing_register.year')), 'year'],
          // [sequelize.col('carry_over_seed_detail.lot_no'),'lot_no']
        ],
        raw: true
      }
      let condition1 = {
        include: [
          // {
          //   model:db.intakeVerificationTags,
          //   required:true,
          //   include:[
          //     {
          //       model:db.investVerifyModel,
          //       required:true,
          //       include:[
          //         {
          //           model:db.investHarvestingModel,
          //           where:{
          //             ...userId
          //           },
          //           attributes:[]
          //         }
          //       ],
          //       where:{
          //         ...userId
          //       },
          //       attributes:[]
          //     }
          //   ],
          //   attributes:[]
          // },
          {
            model: seasonModel,
            attributes: []
          }
        ],
        where: {
          get_carry_over: 1,
          ...userId,
          action:{
            [Op.not]:2
          }
        },

        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('seed_processing_register.season')), 'season'],
          [sequelize.col('m_season.season'), 'season_name'],
          // [sequelize.fn('DISTINCT', sequelize.col('seed_processing_register.year')), 'year'],
          // [sequelize.col('carry_over_seed_detail.lot_no'),'lot_no']
        ],
        raw: true
      }
      // let condition = {
      //   include: [
      //     {
      //       model: seasonModel,
      //       attributes: []
      //     }
      //   ],
      //   attributes: [
      //     [sequelize.fn('DISTINCT', sequelize.col('seed_processing_register.season')), 'season'],
      //     [sequelize.col('m_season.season'), 'season_name'],

      //   ],
      //   where: {
      //     ...userId
      //   },
      //   raw: true
      // }
      if (req.body && req.body.search) {
        if (req.body.search.year) {
          condition.where.year = req.body.search.year
          condition1.where.year = req.body.search.year
        }
      }

      let seasonData = await db.seedProcessingRegister.findAll(condition);
      let seasonData2 = await db.seedProcessingRegister.findAll(condition1);

      let seasonDataNew = seasonData.concat(seasonData2);
      console.log(seasonDataNew, 'seasonDataNew')
      const uniqueData = productiohelper.removeDuplicates(seasonDataNew, 'season');
      if (uniqueData) {
        return response(res, status.DATA_AVAILABLE, 200, uniqueData);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, [])
      }
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }

  static getSeedProcessingRegisterCropData = async (req, res) => {
    try {
      let userId;
      let userId1;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          bspc_id: req.body.loginedUserid.id
        }
        userId1 = {
          user_id: req.body.loginedUserid.id
        }

      }
      let condition;
      condition = {
        include: [
          {

            model: db.carryOverSeedDetailsModel,
            required: true,
            include: [
              {
                model: db.carryOverSeedModel,
                where: {
                  ...userId1
                },
                required: true,
                attributes: []
              }
            ],
            attributes: []
          }
        ],
        where: {
          get_carry_over: 2,
          ...userId
        },

        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('seed_processing_register.crop_code')), 'crop_code'],
          // [sequelize.fn('DISTINCT', sequelize.col('seed_processing_register.season')), 'season'],
          // [sequelize.col('m_season.season'), 'season_name'],
          // [sequelize.fn('DISTINCT', sequelize.col('seed_processing_register.year')), 'year'],
          // [sequelize.col('carry_over_seed_detail.lot_no'),'lot_no']
        ],
        raw: true
      }
      let condition1 = {
        include: [
          // {
          //   model:db.intakeVerificationTags,
          //   required:true,
          //   include:[
          //     {
          //       model:db.investVerifyModel,
          //       required:true,
          //       where:{
          //         ...userId
          //       },
          //       attributes:[]
          //     }
          //   ],
          //   attributes:[]
          // }
          // {
          //   model:db.investVerifyModel,
          //   required:true,
          //   include:[
          //     {
          //       model:db.investHarvestingModel,
          //       where:{
          //         ...userId
          //       },
          //       attributes:[]
          //     }
          //   ],
          //   where:{
          //     ...userId
          //   },
          //   attributes:[]
          // }
          {
            model: db.investVerifyModel,
            required: false,
            include: [
              {
                model: db.investHarvestingModel,
                where: {
                  ...userId1
                },
                attributes: []
              }
            ],
            attributes: []
          }
        ],
        required: false,
        where: {
          [Op.and]: [
            {
              get_carry_over: 1,
            },
            { ...userId },
            {action:{
              [Op.not]:2
            }}
          ]
        },

        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('seed_processing_register.crop_code')), 'crop_code'],
          // [sequelize.fn('DISTINCT', sequelize.col('seed_processing_register.season')), 'season'],
          // [sequelize.col('m_season.season'), 'season_name'],
          // [sequelize.fn('DISTINCT', sequelize.col('seed_processing_register.year')), 'year'],
          // [sequelize.col('carry_over_seed_detail.lot_no'),'lot_no']
        ],
        raw: true
      }
      if (req.body && req.body.search) {
        if (req.body.search.year) {
          condition.where.year = req.body.search.year
          condition1.where.year = req.body.search.year
        }
        if (req.body.search.season) {
          condition.where.season = req.body.search.season
          condition1.where.season = req.body.search.season
        }
      }

      let cropData = await db.seedProcessingRegister.findAll(condition)
      let cropData2 = await db.seedProcessingRegister.findAll(condition1)
      cropData = cropData.concat(cropData2);
      let crop = [];
      if (cropData && cropData.length > 0) {
        cropData.forEach((el) => {
          crop.push(el && el.crop_code ? el.crop_code : '')
        })
      }

      let crops;
      if (cropData && cropData.length > 0) {
        crops = await cropModel.findAll({
          where: {
            crop_code: {
              [Op.in]: crop
            }
          },
          raw: true,
          attributes: [
            [sequelize.col('m_crop.crop_code'), 'crop_code'],
            [sequelize.col('m_crop.crop_name'), 'crop_name'],
          ]
        })
      }

      if (crops) {
        return response(res, status.DATA_AVAILABLE, 200, crops);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, [])
      }
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }
  static getSeedProcessingRegisterDataold= async (req, res) => {
    let radiodata;
    if(req.body.search.table=='table1'){
      radiodata='STL';
    }
    else{
      radiodata='GOT';
    }
    try {
      let userId;
      let userId1;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          bspc_id: req.body.loginedUserid.id
        }
        userId1 = {
          user_id: req.body.loginedUserid.id
        }
      }
      let condition = {
        // attributes: [
        //   [sequelize.col('')]
        // ]
        include: [
          {
            model: db.varietyModel,
            attributes: ['variety_code', 'variety_name']
          },
          {
            model: db.mVarietyLinesModel,
            attributes: ['variety_code', 'line_variety_code', 'line_variety_name']
          },
          {
            model: db.SeedForProcessedStack,
            attributes: []
          },
          {
            model: db.ProcessSeedDetails,
            attributes: []
          },
          {
            model: db.carryOverSeedDetailsModel,
            attributes: []
          },
          {
            model: db.carryOverSeedDetailsModel,
            required: true,
            include: [{
              model: db.carryOverSeedModel,
              required: true,
              where: {
                ...userId1
              },
              attributes: []
            }],
            attributes: []
          },
          {
            model: db.generateSampleSlipsModel,
            required: false,
            attributes: ['unique_code', 'sample_no', 'chemical_treatment', 'tests', 'lot_id', 'get_carry_over', 'testing_lab', 'status','testing_type'],
            include: [
              {
                model: db.seedLabTestModel,
                attributes: ['id', 'lab_name']
              }
            ],
            where: {
              [Op.or]: [
                {
                  variety_code_line: [sequelize.col('seed_processing_register.variety_code_line')],
                  testing_type:radiodata
                },
                // { status: {
                //   [Op.not]:"re-sample"
                // } },
                {
                  [Op.and]: [
                    {
                      crop_code: [sequelize.col('seed_processing_register.crop_code')]
                    },
                    { season: [sequelize.col('seed_processing_register.season')] },
                    { year: [sequelize.col('seed_processing_register.year')] },
                    { variety_code: [sequelize.col('seed_processing_register.variety_code')] },
                    { lot_id: [sequelize.col('seed_processing_register.lot_id')] },

                    // { stack_no: [sequelize.col('seed_processing_register.stack_no')] },

                    // {
                    //   status: {
                    //     [Op.eq]: null
                    //   }
                    // },
                  ],
                }
              ]
            }
          }
        ],
        attributes: [
          "*",
          [sequelize.col('processed_seed_detail.no_of_bags'), 'fresh_no_of_bags'],
          [sequelize.col('seed_for_processed_stack.godown_no'), 'fresh_godown_no'],
          [sequelize.col('seed_for_processed_stack.stack_no'), 'fresh_stack_no']
        ],
        nest: true,
        raw: true,
        where: {
          ...userId,
          get_carry_over: 2,

        }
      }
      let condition2 = {
        // attributes: [
        //   [sequelize.col('')]
        // ]
        include: [
          {
            model: db.varietyModel,
            attributes: ['variety_code', 'variety_name']
          },
          {
            model: db.mVarietyLinesModel,
            attributes: ['variety_code', 'line_variety_code', 'line_variety_name']
          },
          {
            model: db.SeedForProcessedStack,
            attributes: []
          },
          {
            model: db.ProcessSeedDetails,
            attributes: []
          },
          {
            model: db.carryOverSeedDetailsModel,
            attributes: []
          },
          {
            model: db.investVerifyModel,
            // required: false,
            include: [
              {
                model: db.investHarvestingModel,
                where: {
                  ...userId1
                },
                attributes: []
              }
            ],
            attributes: []
          },
          // {
          //   model: db.intakeVerificationTags,
          //   required: true,
          //   include: [
          //     {
          //     model: db.investVerifyModel,
          //     required: true,
          //     where: {
          //       ...userId
          //     },
          //     attributes: []
          //   }
          // ],
          //   attributes: []
          // },
          {
            model: db.generateSampleSlipsModel,
            required: false,
            attributes: ['unique_code', 'sample_no', 'chemical_treatment', 'tests', 'lot_id', 'get_carry_over', 'testing_lab', 'status','testing_type'],
            include: [
              {
                model: db.seedLabTestModel,
                attributes: ['id', 'lab_name']
              }
            ],
            where: {
              [Op.or]: [
                {
                  variety_code_line: [sequelize.col('seed_processing_register.variety_code_line')],
                  testing_type:radiodata
                },
                // { status: {
                //   [Op.not]:"re-sample"
                // } },
                {
                  [Op.and]: [
                    {
                      crop_code: [sequelize.col('seed_processing_register.crop_code')]
                    },
                    { season: [sequelize.col('seed_processing_register.season')] },
                    { year: [sequelize.col('seed_processing_register.year')] },
                    { variety_code: [sequelize.col('seed_processing_register.variety_code')] },
                    { lot_id: [sequelize.col('seed_processing_register.lot_id')] },

                    // {
                    //   status: {
                    //     [Op.eq]: null
                    //   }
                    // },
                  ],
                }
              ]
            }
          }
        ],
        attributes: [
          "*",
          [sequelize.col('processed_seed_detail.no_of_bags'), 'fresh_no_of_bags'],
          [sequelize.col('seed_for_processed_stack.godown_no'), 'fresh_godown_no'],
          [sequelize.col('seed_for_processed_stack.stack_no'), 'fresh_stack_no']
        ],
        nest: true,
        raw: true,
        where: {
          ...userId,
          get_carry_over: 1,
          action:{
            [Op.not]:2
          }
        }
      }

      let condition1 = {
        include: [
          {
            model: db.varietyModel,
            attributes: ['variety_code', 'variety_name']
          },
          {
            model: db.mVarietyLinesModel,
            attributes: ['variety_code', 'line_variety_code', 'line_variety_name']
          },
          {
            model: db.generateSampleSlipsModel,
            required: false,
            attributes: ['unique_code', 'sample_no', 'chemical_treatment', 'tests', 'lot_id', 'get_carry_over', 'testing_lab', 'status','testing_type'],
            include: [
              {
                model: db.seedLabTestModel,
                attributes: ['id', 'lab_name']
              }
            ],
            where: {
              [Op.or]: [
                {
                  variety_code_line: [sequelize.col('stl_report_status.variety_code_line')],
                  testing_type:radiodata
                },
                // { status: {
                //   [Op.eq]:null
                // } },
                // 
                {
                  [Op.and]: [
                    {
                      crop_code: [sequelize.col('stl_report_status.crop_code')]
                    },
                    { season: [sequelize.col('stl_report_status.season')] },
                    { year: [sequelize.col('stl_report_status.year')] },
                    { variety_code: [sequelize.col('stl_report_status.variety_code')] },
                    {
                      lot_id: [sequelize.col('stl_report_status.lot_id')]
                    },
                    // { status: {
                    //   [Op.not]:'re-sample'
                    // } },
                  ],
                }
              ],
            }
          }
        ],
        required: true,
        attributes: ["*"],
        nest: true,
        raw: true,
        where: {
          status: "re-sample",
          // ...userId
        }
      }
      let condition3 = {
        include: [
          {
            model: db.varietyModel,
            attributes: ['variety_code', 'variety_name']
          },
          {
            model: db.mVarietyLinesModel,
            attributes: ['variety_code', 'line_variety_code', 'line_variety_name']
          },
          {
            model: db.generateSampleSlipsModel,
            required: true,
            attributes: ['unique_code', 'sample_no', 'chemical_treatment', 'tests', 'lot_id', 'get_carry_over', 'testing_lab', 'status','testing_type'],
            include: [
              {
                required: false,
                model: db.seedLabTestModel,
                attributes: ['id', 'lab_name']
              }
            ],
            where: {
              [Op.or]: [
                {
                  variety_code_line: [sequelize.col('stl_report_status.variety_code_line')],
                  testing_type:radiodata
                },
                // { status: {
                //   [Op.eq]:null
                // } },
                // 
                {
                  [Op.and]: [
                    {
                      crop_code: [sequelize.col('stl_report_status.crop_code')]
                    },
                    { season: [sequelize.col('stl_report_status.season')] },
                    { year: [sequelize.col('stl_report_status.year')] },
                    { variety_code: [sequelize.col('stl_report_status.variety_code')] },
                    {
                      lot_id: [sequelize.col('stl_report_status.lot_id')]
                    },
                    {
                      status: {
                        [Op.eq]: null
                      }
                    },
                  ],
                }
              ],
            }
          }
        ],
        attributes: ["*"],
        nest: true,
        raw: true,
        where: {
          status: "re-sample",
          // ...userId
        }
      }
      if (req.body && req.body.search) {
        if (req.body.search.year) {
          condition.where.year = req.body.search.year
          condition1.where.year = req.body.search.year
          condition2.where.year = req.body.search.year
        }
        if (req.body.search.season) {
          condition.where.season = req.body.search.season
          condition1.where.season = req.body.search.season
          condition2.where.season = req.body.search.season
        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = req.body.search.crop_code
          condition1.where.crop_code = req.body.search.crop_code
          condition2.where.crop_code = req.body.search.crop_code
        }
        if (req.body.search.table) {
          condition.where.crop_code = req.body.search.crop_code
          condition1.where.crop_code = req.body.search.crop_code
          condition2.where.crop_code = req.body.search.crop_code
        }
        if (req.body.search.variety_code_array && req.body.search.variety_code_array.length) {
          // console.log(req.body.search.variety_code_array,'req.body.search.variety_code_arrayreq.body.search.variety_code_array')
          condition.where.variety_code = {
            [Op.in]: req.body.search.variety_code_array
          }
          condition1.where.variety_code = {
            [Op.in]: req.body.search.variety_code_array
          }
          condition2.where.variety_code = {
            [Op.in]: req.body.search.variety_code_array
          }
        }
      }

      let seedProcessingRegisterData = await db.seedProcessingRegister.findAll(condition)
      let seedProcessingRegisterData2 = await db.seedProcessingRegister.findAll(condition2)

      let stlReportStatusData = await db.stlReportStatusModel.findAll(condition1);
      let stlReportStatusData1 = await db.stlReportStatusModel.findAll(condition3);

      // console.log(stlReportStatusData);
      console.log('stl report length status null', stlReportStatusData1.length)
      console.log('stl report length status re-sample', stlReportStatusData.length)

      let stlFinalArray = []


      // if(stlReportStatusData1.length > 0 && stlReportStatusData.length > 0){
      //   stlFinalArray.push(stlReportStatusData[0])
      // }
      // else if(stlReportStatusData1.length > 0 && stlReportStatusData.length == 0){

      //   stlFinalArray.push(stlReportStatusData1[0])
      // }else{
      //   // stlFinalArray.push(stlReportStatusData)
      // }
      let year = [];
      let season = [];
      let crop_code = [];
      let variety_code = [];
      let variety_line_code = [];
      let lot_id = [];
      for (let key of stlReportStatusData) {
        console.log(key)
        year.push(key.year);
        season.push(key.season);
        crop_code.push(key.crop_code);
        variety_code.push(key.variety_code);
        variety_line_code.push(key.variety_line_code);
        lot_id.push(key.lot_id);
        // if((key.generate_sample_slip.status=="re-sample" && key.status=="re-sample")){

        // }else if(key.status=="re-sample"){
        //   stlFinalArray.push(key)
        // }else{}
      }
      // console.log(seedProcessingRegisterData,'seedProcessingRegisterData')
      // {
      //   variety_line_code:{
      //     [Op.in]:variety_line_code
      //   }
      // },
      let checkStlReport = await db.generateSampleSlipsModel.findAll(
        {
          where: {
            [Op.and]: [
              {
                year: {
                  [Op.in]: year
                }
              },
              {
                season: {
                  [Op.in]: season
                }
              },
              {
                crop_code: {
                  [Op.in]: crop_code
                }
              },
              {
                variety_code: {
                  [Op.in]: variety_code
                }
              },

              {
                lot_id: {
                  [Op.in]: lot_id
                }
              }
            ]
          }
        }
      )
      // console.log('stlReportStatusData===', stlReportStatusData);
      // console.log('checkStlReport===', checkStlReport);
      // Extracting 'generate_sample_slips' from 'checkStlReport' if necessary
      const checkStlReportData = checkStlReport.map(item => item.dataValues);

      // Merge and remove duplicates based on 'unique_code'
      const mergedArray1 = [
        ...stlReportStatusData,
        ...checkStlReportData
      ];

      // Use a Map to ensure uniqueness based on 'unique_code'
      const uniqueArray = Array.from(
        new Map(mergedArray1.map(item => [item.unique_code, item])).values()
      );
      console.log(uniqueArray.length);
      console.log(mergedArray1);
      for (let key of stlReportStatusData) {
        if (key.status !== null && key.status === 're-sample' && key.generate_sample_slip && key.generate_sample_slip.status !== 're-sample') {
          stlFinalArray.push(key)
        } else {
          // stlFinalArray.push(key)
        }
      }
      console.log('stlFinalArray=============', stlReportStatusData);
      let mergedArray = [];
      // console.log(seedProcessingRegisterData,'seedProcessingRegisterData')
      // if (stlReportStatusData && stlReportStatusData.length) {
      mergedArray = [...new Set([...stlReportStatusData, ...seedProcessingRegisterData, ...seedProcessingRegisterData2])];
      // console.log('merge data 1',mergedArray.length)
      // }
      //  else {
      // mergedArray = [...new Set([...seedProcessingRegisterData, ...seedProcessingRegisterData2])];
      // console.log('merge data 1',mergedArray2)
      // }
      // console.log('stlReportStatusData===========',stlFinalArray.length);
      // console.log('mergedArray', mergedArray);
      // function removeDuplicates(seedProcessingRegisterData, prop1, prop2) {
      //   const uniqueData = [];
      //   const keys = new Set();
      //   seedProcessingRegisterData.forEach(obj => {
      //     const key = obj[prop1] + obj[prop2]; // Assuming prop1 and prop2 uniquely identify each object
      //     if (!keys.has(key)) {
      //       keys.add(key);
      //       uniqueData.push(obj);
      //     }
      //   });
      //   return uniqueData;
      // }

      // Call the function to remove duplicates based on 'variety_code' and 'variety_code_line'
      // 'variety_code_line'
      //
      // const uniqueData = mergedArray
      // const uniqueData = this.removeDuplicates1(mergedArray);
      const uniqueData = mergedArray
      if (uniqueData && uniqueData.length) {
        return response(res, status.DATA_AVAILABLE, 200, uniqueData)
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, [])
      }
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }

  static getSeedProcessingRegisterData = async (req, res) => {
    let radiodata;
    if(req.body.search.table=='table1'){
      radiodata= {testing_type:"STL"}

    }
    else{
      radiodata={testing_type:"GOT"};
    }
    try {
      let userId;
      let userId1;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          bspc_id: req.body.loginedUserid.id
        }
        userId1 = {
          user_id: req.body.loginedUserid.id
        }
      }
      let condition = {
        // attributes: [
        //   [sequelize.col('')]
        // ]
        include: [
          {
            model: db.varietyModel,
            attributes: ['variety_code', 'variety_name']
          },
          {
            model: db.mVarietyLinesModel,
            attributes: ['variety_code', 'line_variety_code', 'line_variety_name']
          },
          {
            model: db.SeedForProcessedStack,
            attributes: []
          },
          {
            model: db.ProcessSeedDetails,
            attributes: []
          },
          {
            model: db.carryOverSeedDetailsModel,
            attributes: []
          },
          {
            model: db.carryOverSeedDetailsModel,
            required: true,
            include: [{
              model: db.carryOverSeedModel,
              required: true,
              where: {
                ...userId1
              },
              attributes: []
            }],
            attributes: []
          },
          {
            model: db.generateSampleSlipsModel,
            required: false,
            attributes: ['unique_code', 'sample_no', 'chemical_treatment', 'tests', 'lot_id', 'get_carry_over', 'testing_lab', 'status','testing_type'],
            include: [
              {
                model: db.seedLabTestModel,
                attributes: ['id', 'lab_name']
              },
              {
                model: db.userModel,
                attributes: [],
                require:true,
                include: [{
                model: db.agencyDetailModel,
                required: true,
                attributes: ['agency_name']
              }]
              },
            ],
            where: {
              [Op.or]: [
                {
                  variety_code_line: [sequelize.col('seed_processing_register.variety_code_line')],
                 
                },
                // { status: {
                //   [Op.not]:"re-sample"
                // } },
                {
                  [Op.and]: [
                    {
                      crop_code: [sequelize.col('seed_processing_register.crop_code')]
                    },
                    { season: [sequelize.col('seed_processing_register.season')] },
                    { year: [sequelize.col('seed_processing_register.year')] },
                    { variety_code: [sequelize.col('seed_processing_register.variety_code')] },
                    { lot_id: [sequelize.col('seed_processing_register.lot_id')] },
                    {...radiodata}

                    // { stack_no: [sequelize.col('seed_processing_register.stack_no')] },

                    // {
                    //   status: {
                    //     [Op.eq]: null
                    //   }
                    // },
                  ],
                }
              ]
            }
          }
        ],
        attributes: [
          "*",
          [sequelize.col('processed_seed_detail.no_of_bags'), 'fresh_no_of_bags'],
          [sequelize.col('seed_for_processed_stack.godown_no'), 'fresh_godown_no'],
          [sequelize.col('seed_for_processed_stack.stack_no'), 'fresh_stack_no']
        ],
        nest: true,
        raw: true,
        where: {
          ...userId,
          get_carry_over: 2,

        }
      }
      let condition2 = {
        // attributes: [
        //   [sequelize.col('')]
        // ]
        include: [
          {
            model: db.varietyModel,
            attributes: ['variety_code', 'variety_name']
          },
          {
            model: db.mVarietyLinesModel,
            attributes: ['variety_code', 'line_variety_code', 'line_variety_name']
          },
          {
            model: db.SeedForProcessedStack,
            attributes: []
          },
          {
            model: db.ProcessSeedDetails,
            attributes: []
          },
          {
            model: db.carryOverSeedDetailsModel,
            attributes: []
          },
          {
            model: db.investVerifyModel,
            // required: false,
            include: [
              {
                model: db.investHarvestingModel,
                where: {
                  ...userId1
                },
                attributes: []
              }
            ],
            attributes: []
          },
          // {
          //   model: db.intakeVerificationTags,
          //   required: true,
          //   include: [
          //     {
          //     model: db.investVerifyModel,
          //     required: true,
          //     where: {
          //       ...userId
          //     },
          //     attributes: []
          //   }
          // ],
          //   attributes: []
          // },
          {
            model: db.generateSampleSlipsModel,
            required: false,
            attributes: ['unique_code', 'sample_no', 'chemical_treatment', 'tests', 'lot_id', 'get_carry_over', 'testing_lab', 'status','testing_type'],
            include: [
              {
                model: db.seedLabTestModel,
                attributes: ['id', 'lab_name']
              },
              {
                model: db.userModel,
                attributes: [],
                require:true,
                include: [{
                model: db.agencyDetailModel,
                required: true,
                attributes: ['agency_name']
              }]
              },
            ],
            where: {
              [Op.or]: [
                {
                  variety_code_line: [sequelize.col('seed_processing_register.variety_code_line')],
                
                },
                // { status: {
                //   [Op.not]:"re-sample"
                // } },
                {
                  [Op.and]: [
                    {
                      crop_code: [sequelize.col('seed_processing_register.crop_code')]
                    },
                    { season: [sequelize.col('seed_processing_register.season')] },
                    { year: [sequelize.col('seed_processing_register.year')] },
                    { variety_code: [sequelize.col('seed_processing_register.variety_code')] },
                    { lot_id: [sequelize.col('seed_processing_register.lot_id')] },
                    {...radiodata}

                    // {
                    //   status: {
                    //     [Op.eq]: null
                    //   }
                    // },
                  ],
                }
              ]
            }
          }
        ],
        attributes: [
          "*",
          [sequelize.col('processed_seed_detail.no_of_bags'), 'fresh_no_of_bags'],
          [sequelize.col('seed_for_processed_stack.godown_no'), 'fresh_godown_no'],
          [sequelize.col('seed_for_processed_stack.stack_no'), 'fresh_stack_no']
        ],
        nest: true,
        raw: true,
        where: {
          ...userId,
          get_carry_over: 1,
          action:{
            [Op.not]:2
          }
        }
      }

      let condition1 = {
        include: [
          {
            model: db.varietyModel,
            attributes: ['variety_code', 'variety_name']
          },
          {
            model: db.mVarietyLinesModel,
            attributes: ['variety_code', 'line_variety_code', 'line_variety_name']
          },
          {
            model: db.generateSampleSlipsModel,
            required: false,
            attributes: ['unique_code', 'sample_no', 'chemical_treatment', 'tests', 'lot_id', 'get_carry_over', 'testing_lab', 'status','testing_type'],
            include: [
              {
                model: db.seedLabTestModel,
                attributes: ['id', 'lab_name']
              },
              {
                model: db.userModel,
                attributes: [],
                require:true,
                include: [{
                model: db.agencyDetailModel,
                required: true,
                attributes: ['agency_name']
              }]
              },
            ],
            where: {
              [Op.or]: [
                {
                  variety_code_line: [sequelize.col('stl_report_status.variety_code_line')],
                  
                },

                // { status: {
                //   [Op.eq]:null
                // } },
                // 
                {
                  [Op.and]: [
                    {
                      crop_code: [sequelize.col('stl_report_status.crop_code')]
                    },
                    { season: [sequelize.col('stl_report_status.season')] },
                    { year: [sequelize.col('stl_report_status.year')] },
                    { variety_code: [sequelize.col('stl_report_status.variety_code')] },
                    {
                      lot_id: [sequelize.col('stl_report_status.lot_id')]
                    },
                    {...radiodata}
                    // { status: {
                    //   [Op.not]:'re-sample'
                    // } },
                  ],
                }
              ],
            }
          }
        ],
        required: true,
        attributes: ["*"],
        nest: true,
        raw: true,
        where: {
          status: "re-sample",
          // ...userId
        }
      }
      let condition3 = {
        include: [
          {
            model: db.varietyModel,
            attributes: ['variety_code', 'variety_name']
          },
          {
            model: db.mVarietyLinesModel,
            attributes: ['variety_code', 'line_variety_code', 'line_variety_name']
          },
          {
            model: db.generateSampleSlipsModel,
            required: true,
            attributes: ['unique_code', 'sample_no', 'chemical_treatment', 'tests', 'lot_id', 'get_carry_over', 'testing_lab', 'status','testing_type'],
            include: [
              {
                required: false,
                model: db.seedLabTestModel,
                attributes: ['id', 'lab_name']
              },
              {
                model: db.userModel,
                attributes: [],
                require:true,
                include: [{
                model: db.agencyDetailModel,
                required: true,
                attributes: ['agency_name']
              }]
              },
            ],
            where: {
              [Op.or]: [
                {
                  variety_code_line: [sequelize.col('stl_report_status.variety_code_line')],
                
                },
                // { status: {
                //   [Op.eq]:null
                // } },
                // 
                {
                  [Op.and]: [
                    {
                      crop_code: [sequelize.col('stl_report_status.crop_code')]
                    },
                    { season: [sequelize.col('stl_report_status.season')] },
                    { year: [sequelize.col('stl_report_status.year')] },
                    { variety_code: [sequelize.col('stl_report_status.variety_code')] },
                    {
                      lot_id: [sequelize.col('stl_report_status.lot_id')]
                    },
                    {...radiodata},
                    {
                      status: {
                        [Op.eq]: null
                      }
                    },
                  ],
                }
              ],
            }
          }
        ],
        attributes: ["*"],
        nest: true,
        raw: true,
        where: {
          status: "re-sample",
          // ...userId
        }
      }
      if (req.body && req.body.search) {
        if (req.body.search.year) {
          condition.where.year = req.body.search.year
          condition1.where.year = req.body.search.year
          condition2.where.year = req.body.search.year
        }
        if (req.body.search.season) {
          condition.where.season = req.body.search.season
          condition1.where.season = req.body.search.season
          condition2.where.season = req.body.search.season
        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = req.body.search.crop_code
          condition1.where.crop_code = req.body.search.crop_code
          condition2.where.crop_code = req.body.search.crop_code
        }
        if (req.body.search.table) {
          condition.where.crop_code = req.body.search.crop_code
          condition1.where.crop_code = req.body.search.crop_code
          condition2.where.crop_code = req.body.search.crop_code
        }
        if (req.body.search.variety_code_array && req.body.search.variety_code_array.length) {
          // console.log(req.body.search.variety_code_array,'req.body.search.variety_code_arrayreq.body.search.variety_code_array')
          condition.where.variety_code = {
            [Op.in]: req.body.search.variety_code_array
          }
          condition1.where.variety_code = {
            [Op.in]: req.body.search.variety_code_array
          }
          condition2.where.variety_code = {
            [Op.in]: req.body.search.variety_code_array
          }
        }
      }

      let seedProcessingRegisterData = await db.seedProcessingRegister.findAll(condition)
      let seedProcessingRegisterData2 = await db.seedProcessingRegister.findAll(condition2)

      let stlReportStatusData = await db.stlReportStatusModel.findAll(condition1);
      let stlReportStatusData1 = await db.stlReportStatusModel.findAll(condition3);

      // console.log(stlReportStatusData);
      console.log('stl report length status null', stlReportStatusData1.length)
      console.log('stl report length status re-sample', stlReportStatusData.length)

      let stlFinalArray = []


      // if(stlReportStatusData1.length > 0 && stlReportStatusData.length > 0){
      //   stlFinalArray.push(stlReportStatusData[0])
      // }
      // else if(stlReportStatusData1.length > 0 && stlReportStatusData.length == 0){

      //   stlFinalArray.push(stlReportStatusData1[0])
      // }else{
      //   // stlFinalArray.push(stlReportStatusData)
      // }
      let year = [];
      let season = [];
      let crop_code = [];
      let variety_code = [];
      let variety_line_code = [];
      let lot_id = [];
      for (let key of stlReportStatusData) {
        console.log(key)
        year.push(key.year);
        season.push(key.season);
        crop_code.push(key.crop_code);
        variety_code.push(key.variety_code);
        variety_line_code.push(key.variety_line_code);
        lot_id.push(key.lot_id);
        // if((key.generate_sample_slip.status=="re-sample" && key.status=="re-sample")){

        // }else if(key.status=="re-sample"){
        //   stlFinalArray.push(key)
        // }else{}
      }
      // console.log(seedProcessingRegisterData,'seedProcessingRegisterData')
      // {
      //   variety_line_code:{
      //     [Op.in]:variety_line_code
      //   }
      // },
      let checkStlReport = await db.generateSampleSlipsModel.findAll(
        {
          where: {
            [Op.and]: [
              {
                year: {
                  [Op.in]: year
                }
              },
              {
                season: {
                  [Op.in]: season
                }
              },
              {
                crop_code: {
                  [Op.in]: crop_code
                }
              },
              {
                variety_code: {
                  [Op.in]: variety_code
                }
              },

              {
                lot_id: {
                  [Op.in]: lot_id
                }
              }
            ]
          }
        }
      )
      // console.log('stlReportStatusData===', stlReportStatusData);
      // console.log('checkStlReport===', checkStlReport);
      // Extracting 'generate_sample_slips' from 'checkStlReport' if necessary
      const checkStlReportData = checkStlReport.map(item => item.dataValues);

      // Merge and remove duplicates based on 'unique_code'
      const mergedArray1 = [
        ...stlReportStatusData,
        ...checkStlReportData
      ];

      // Use a Map to ensure uniqueness based on 'unique_code'
      const uniqueArray = Array.from(
        new Map(mergedArray1.map(item => [item.unique_code, item])).values()
      );
      console.log(uniqueArray.length);
      console.log(mergedArray1);
      for (let key of stlReportStatusData) {
        if (key.status !== null && key.status === 're-sample' && key.generate_sample_slip && key.generate_sample_slip.status !== 're-sample') {
          stlFinalArray.push(key)
        } else {
          // stlFinalArray.push(key)
        }
      }
      console.log('stlFinalArray=============', stlReportStatusData);
      let mergedArray = [];
      // console.log(seedProcessingRegisterData,'seedProcessingRegisterData')
      // if (stlReportStatusData && stlReportStatusData.length) {
      mergedArray = [...new Set([...stlReportStatusData, ...seedProcessingRegisterData, ...seedProcessingRegisterData2])];
      // console.log('merge data 1',mergedArray.length)
      // }
      //  else {
      // mergedArray = [...new Set([...seedProcessingRegisterData, ...seedProcessingRegisterData2])];
      // console.log('merge data 1',mergedArray2)
      // }
      // console.log('stlReportStatusData===========',stlFinalArray.length);
      // console.log('mergedArray', mergedArray);
      // function removeDuplicates(seedProcessingRegisterData, prop1, prop2) {
      //   const uniqueData = [];
      //   const keys = new Set();
      //   seedProcessingRegisterData.forEach(obj => {
      //     const key = obj[prop1] + obj[prop2]; // Assuming prop1 and prop2 uniquely identify each object
      //     if (!keys.has(key)) {
      //       keys.add(key);
      //       uniqueData.push(obj);
      //     }
      //   });
      //   return uniqueData;
      // }

      // Call the function to remove duplicates based on 'variety_code' and 'variety_code_line'
      // 'variety_code_line'
      //
      // const uniqueData = mergedArray
      // const uniqueData = this.removeDuplicates1(mergedArray);
      const uniqueData = mergedArray
      if (uniqueData && uniqueData.length) {
        return response(res, status.DATA_AVAILABLE, 200, uniqueData)
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, [])
      }
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }
  static addGenerateSampleSlipDataold = async (req, res) => {
    try {
      let userId;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          user_id: req.body.loginedUserid.id
        }
      }
      if (req.body) {
        if (req.body.generateSampleSlipData && req.body.generateSampleSlipData.length) {
          let data;
        for (let key of req.body.generateSampleSlipData) {
            // console.log("***************",key.radio_value);
            let rules = {
              "year": 'required|integer',
              "season": 'required|string',
              "crop_code": 'required|string',
              "variety_code": 'required|string',
              "lot_no": 'required|string',
              // "class_of_seed": 'required|string',
              // "godown_no": 'required',
              // "stack_no": 'required',
              // "no_of_bags": 'required',
              // "total_processed_qnt": 'required',
              // "unique_code": 'required',
              // "sample_no": 'required',
              "testing_lab": 'required',
              "chemical_treatment": 'required',
            };

            if (key.radio_value === "table2") {
              delete rules.lot_no;  // Remove the 'lot_no' rule for 'table1'
              rules.got_bspc_id = 'required|string';  
            }
      let validation = new Validator(key, rules);
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
          }
          for (let key of req.body.generateSampleSlipData) {
            let randomCode = '';
            let sampleNo;
            if (key && key.choose_sample && key.choose_sample == true) {

              const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
              for (let i = 0; i < 8; i++) {
                randomCode += charset.charAt(Math.floor(Math.random() * charset.length));
              }
              let isExist = await db.generateSampleSlipsModel.findOne({
                where: {
                  unique_code: randomCode
                }
              });
              if (isExist) {
                for (let i = 0; i < 8; i++) {
                  randomCode += charset.charAt(Math.floor(Math.random() * charset.length));
                }
              }
              let isrunning = await db.generateSampleSlipsModel.findOne({
                where: {
                  year: key.year,
                  season: key.season,
                  crop_code: key.crop_code,
                  // variety_code: key.variety_code,
                  ...userId
                },
                attributes: ['sample_no'],
                order: [['sample_no', "DESC"]]
              });
              if (isrunning) {
                sampleNo = isrunning.sample_no + 1;
              } else {
                sampleNo = 1;
              }
              data = await db.generateSampleSlipsModel.create({
                year: key.year ? key.year : "",
                season: key.season ? key.season : "",
                crop_code: key.crop_code ? key.crop_code : "",
                variety_code: key.variety_code ? key.variety_code : "",
                lot_no: key.lot_no ? key.lot_no : "",
                class_of_seed: key.class_of_seed ? key.class_of_seed : null,
                godown_no: key.godown_no ? key.godown_no : null,
                stack_no: key.stack_no ? key.stack_no : null,
                no_of_bags: key.no_of_bags ? key.no_of_bags : null,
                total_processed_qnt: key.total_processed_qnt ? key.total_processed_qnt : null,
                unique_code: randomCode ? randomCode : "",
                sample_no: sampleNo ? sampleNo : 1,
                testing_lab: key && key.testing_lab ? parseInt(key.testing_lab) : null,
                chemical_treatment: key.chemical_treatment,
                tests: key.tests ? key.tests : null,
                lot_id: key.lot_id ? key.lot_id : null,
                get_carry_over: key.get_carry_over ? key.get_carry_over : null,
                variety_code_line: key.variety_code_line ? key.variety_code_line : null,
                status: key.status ? key.status : null,
                ...userId
              });
              let stlStatusUpdate;
              if (key.status == "re-sample") {
                stlStatusUpdate = await db.stlReportStatusModel.update({
                  status: "re-sample-forwarding"
                }, {
                  where: {
                    year: key.year ? key.year : "",
                    season: key.season ? key.season : "",
                    crop_code: key.crop_code ? key.crop_code : "",
                    variety_code: key.variety_code ? key.variety_code : "",
                    lot_id: key.lot_id ? key.lot_id : null,
                  }
                })
              }
              if (key && key.tests && key.tests.length) {
                for (let item of key.tests) {
                  let data1 = await db.generateSampleSlipsTestsModel.create({
                    generate_sample_slip_id: data.dataValues.id,
                    test_id: item.id
                  });
                }
              }
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

   static addGenerateSampleSlipData= async (req, res) => {
    try {
      let userId;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          user_id: req.body.loginedUserid.id
        }
      }
      if (req.body) {
        if (req.body.generateSampleSlipData && req.body.generateSampleSlipData.length) {
          let data;
        for(let key of req.body.generateSampleSlipData) {
            // console.log("***************",key.radio_value);
         
            let rules = {
              "year": 'required|integer',
              "season": 'required|string',
              "crop_code": 'required|string',
              "variety_code": 'required|string',
              "lot_no": 'required|string',
              // "class_of_seed": 'required|string',
              // "godown_no": 'required',
              // "stack_no": 'required',
              // "no_of_bags": 'required',
              // "total_processed_qnt": 'required',
              // "unique_code": 'required',
              // "sample_no": 'required',
              "testing_lab": 'required',
              "chemical_treatment": 'required',
            };
            if (key.radio_value === "table2") {
    
              delete rules.lot_no;  // Remove the 'lot_no' rule for 'table1'
              delete rules.testing_lab,
              delete rules.chemical_treatment
            rules.selected_bspc_id = 'required|integer';  
            }
            let validation = new Validator(key, rules);
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
          }
         
          for (let key of req.body.generateSampleSlipData) {
          // console.log("hguihoirio",req.body.generateSampleSlipData);
          let radiobutton;
          if (key.radio_value === "table2")
            {
             radiobutton = "GOT";
            }
            else{
               radiobutton = "STL";
            }
            let randomCode = '';
            let sampleNo;
            if (key && key.choose_sample && key.choose_sample == true) {

              // console.log("fhhejrhgi",key.choose_sample);
              const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
              for (let i = 0; i < 8; i++) {
                randomCode += charset.charAt(Math.floor(Math.random() * charset.length));
              }
              let isExist = await db.generateSampleSlipsModel.findOne({
                where: {
                  unique_code: randomCode
                }
              });
              // console.log("random))))))))))))");

              if (isExist) {
                for (let i = 0; i < 8; i++) {
                  randomCode += charset.charAt(Math.floor(Math.random() * charset.length));
                }
              }
              let isrunning = await db.generateSampleSlipsModel.findOne({
                where: {
                  year: key.year,
                  season: key.season,
                  crop_code: key.crop_code,
                  testing_type: radiobutton,
                  // variety_code: key.variety_code,
                  ...userId
                },
                attributes: ['sample_no'],
                order: [['sample_no', "DESC"]]
              });
              if (isrunning) {
                sampleNo = isrunning.sample_no + 1;
              } else {
                sampleNo = 1;
              }
          // let radiobutton;
          // if (key.radio_value === "table2")
          //     {
          //       radiobutton = "GOT";
          //     }
          //     else{
          //        radiobutton = "STL";
          //     }
          

              data = await db.generateSampleSlipsModel.create({
                year: key.year ? key.year : "",
                season: key.season ? key.season : "",
                crop_code: key.crop_code ? key.crop_code : "",
                variety_code: key.variety_code ? key.variety_code : "",
                lot_no: key.lot_no ? key.lot_no : "",
                class_of_seed: key.class_of_seed ? key.class_of_seed : null,
                godown_no: key.godown_no ? key.godown_no : null,
                stack_no: key.stack_no ? key.stack_no : null,
                no_of_bags: key.no_of_bags ? key.no_of_bags : null,
                total_processed_qnt: key.total_processed_qnt ? key.total_processed_qnt : null,
                unique_code: randomCode ? randomCode : "",
                sample_no: sampleNo ? sampleNo : 1,
                testing_lab: key && key.testing_lab ? parseInt(key.testing_lab) : null,
                chemical_treatment: key.chemical_treatment,
                tests: key.tests ? key.tests : null,
                lot_id: key.lot_id ? key.lot_id : null,
                get_carry_over: key.get_carry_over ? key.get_carry_over : null,
                variety_code_line: key.variety_code_line ? key.variety_code_line : null,
                status: key.status ? key.status : null,
                testing_type:radiobutton,
                got_bspc_id:key.selected_bspc_id ? key.selected_bspc_id : null,
                state_code:key.state_code ? key.state_code : null,
                ...userId
              });
              let stlStatusUpdate;
              if (key.status == "re-sample") {
                stlStatusUpdate = await db.stlReportStatusModel.update({
                  status: "re-sample-forwarding"
                }, {
                  where: {
                    year: key.year ? key.year : "",
                    season: key.season ? key.season : "",
                    crop_code: key.crop_code ? key.crop_code : "",
                    variety_code: key.variety_code ? key.variety_code : "",
                    lot_id: key.lot_id ? key.lot_id : null,
                  }
                })
              }
              if (key && key.tests && key.tests.length) {
                for (let item of key.tests) {
                  let data1 = await db.generateSampleSlipsTestsModel.create({
                    generate_sample_slip_id: data.dataValues.id,
                    test_id: item.id
                  });
                }
              }
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

  static getGenerateSampleSlipDataold = async (req, res) => {
    try {

      let userId;
      let querySet;
      let attributesSet;
      let lotArray = [];
      let statusArray = [];
      let conditionSet;
      let statusArrayCondition={};

      if (req.body.lot_no_array && req.body.lot_no_array.length) {

        req.body.lot_no_array.forEach(ele => {
          lotArray.push(ele.lot_id);
          if (ele.lot_id && ele.status) {
            if(ele.status){
              statusArray.push(ele.status)
            }
            statusArrayCondition = {
              status:{
                [Op.notIn]:statusArray
              } 
            }
          };
          if (statusArray && statusArray.length) {
            conditionSet = {
              [Op.or]: [
                {
                  status: {
                    [Op.eq]: null
                  }
                }
              ]
            }
          }
        })
      }
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          user_id: req.body.loginedUserid.id
        }
      }
      if (req.body && req.body.get_caary_over === 1) {
        querySet = {
          model: db.investVerifyModel,
          required: false,
          attributes: [

          ],
          where: {
          },
          include: [
            {

              model: db.investHarvestingModel,
              attributes: [
              ]

              // model: db.investVerifyModel,
              // attributes: [],
              // include: [

              // ]
            }
          ]
        }
        // attributesSet = [[sequelize.col('intake_verification_tag.invest_verification.invest_harvesting.user_id'), 'bspc_id']]
      } else if (req.body && req.body.get_caary_over === 2) {
        querySet = {
          model: db.carryOverSeedDetailsModel,
          attributes: [],
          include: [
            {
              model: db.carryOverSeedModel,
              attributes: [
              ]
            }
          ]
        }
        // attributesSet = [[sequelize.col('carry_over_seed_detail->carry_over_seed.user_id'), 'bspc_id']]
      } else {
        querySet = {
          model: db.intakeVerificationTags,
          required: false,
          attributes: [

          ],
          where: {
          },
          include: [
            {
              model: db.investVerifyModel,
              attributes: [],
              include: [
                {
                  model: db.investHarvestingModel,
                  attributes: [
                  ]
                }
              ]
            }
          ]
        }
        // attributesSet =[]
        // attributesSet = [[sequelize.col('intake_verification_tag.invest_verification.invest_harvesting.user_id'), 'bspc_id']]
      }

      let condition = {
        // attributes: ['id'],
        include: [
          {
            model: cropModel,
            attributes: [],
            required: true,
          },
          {
            model: db.varietyModel,
            attributes: [],
            required: true,
          },
          {
            model: db.varietLineModel,
            attributes: []
          },
          { ...querySet }
        ],
        where: {
          ...userId,
          [Op.or]:[
            {
              ...conditionSet,
               
            },
            {
              [Op.and]: [
                {
                  unique_code: {
                    [Op.not]: null
                  }
                },
                {
                  unique_code: {
                    [Op.not]: ""
                  }
                },
              
                statusArrayCondition
              ]
            }
          ]
        },
        attributes: [
          "*",
          [sequelize.col('m_crop.crop_name'), 'crop_name'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [sequelize.col('m_variety_line.line_variety_name'), 'line_variety_name'],
        ],
        raw: true
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
        req.body.lot_no_array
        if (req.body.lot_no_array && req.body.lot_no_array.length) {
          let lotArray = [];
          let statusArray = [];
          req.body.lot_no_array.forEach(ele => {
            lotArray.push(ele.lot_id);
            if (ele.lot_id && ele.status) {
              statusArray.push(ele.status)
            };
          })
          // req.body.lot_no_array.forEach(ele=>{

          // })
          if (lotArray && lotArray.length) {
            condition.where.lot_id = {
              [Op.in]: lotArray
            }
          }
          // if (statusArray && statusArray.length) {
          //   condition.where.status = {
          //     [Op.notIn]: statusArray
          //   }

          // }
        }
      }

      let dataList = await db.generateSampleSlipsModel.findAll(condition);
      if (dataList && dataList.length) {
        return response(res, status.DATA_AVAILABLE, 200, dataList);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, []);
      }

    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }

  static getGenerateSampleSlipDatanotworking= async (req, res) => {
    try {

      let userId;
      let querySet;
      let attributesSet;
      let lotArray = [];
      let statusArray = [];
      let conditionSet;
      let statusArrayCondition={};

      if (req.body.lot_no_array && req.body.lot_no_array.length) {

        req.body.lot_no_array.forEach(ele => {
          lotArray.push(ele.lot_id);
          if (ele.lot_id && ele.status) {
            if(ele.status){
              statusArray.push(ele.status)
            }
            statusArrayCondition = {
              status:{
                [Op.notIn]:statusArray
              } 
            }
          };
          if (statusArray && statusArray.length) {
            conditionSet = {
              [Op.or]: [
                {
                  status: {
                    [Op.eq]: null
                  }
                }
              ]
            }
          }
        })
      }
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          user_id: req.body.loginedUserid.id
        }
      }
      if (req.body && req.body.get_caary_over === 1) {
        querySet = {
          model: db.investVerifyModel,
          required: false,
          attributes: [

          ],
          where: {
          },
          include: [
            {

              model: db.investHarvestingModel,
              attributes: [
              ]

              // model: db.investVerifyModel,
              // attributes: [],
              // include: [

              // ]
            }
          ]
        }
        // attributesSet = [[sequelize.col('intake_verification_tag.invest_verification.invest_harvesting.user_id'), 'bspc_id']]
      } else if (req.body && req.body.get_caary_over === 2) {
        querySet = {
          model: db.carryOverSeedDetailsModel,
          attributes: [],
          include: [
            {
              model: db.carryOverSeedModel,
              attributes: [
              ]
            }
          ]
        }
        // attributesSet = [[sequelize.col('carry_over_seed_detail->carry_over_seed.user_id'), 'bspc_id']]
      } else {
        querySet = {
          model: db.intakeVerificationTags,
          required: false,
          attributes: [

          ],
          where: {
          },
          include: [
            {
              model: db.investVerifyModel,
              attributes: [],
              include: [
                {
                  model: db.investHarvestingModel,
                  attributes: [
                  ]
                }
              ]
            }
          ]
        }
        // attributesSet =[]
        // attributesSet = [[sequelize.col('intake_verification_tag.invest_verification.invest_harvesting.user_id'), 'bspc_id']]
      }

      let condition = {
        // attributes: ['id'],
        include: [
          {
            model: cropModel,
            attributes: [],
            required: true,
          },
          {
            model: db.varietyModel,
            attributes: [],
            required: true,
          },
          {
            model: db.varietLineModel,
            attributes: []
          },
          { ...querySet }
        ],
        where: {
          ...userId,
          [Op.or]:[
            {
              ...conditionSet,
               
            },
            {
              [Op.and]: [
                {
                  unique_code: {
                    [Op.not]: null
                  }
                },
                {
                  unique_code: {
                    [Op.not]: ""
                  }
                },
              
                statusArrayCondition
              ]
            }
          ]
        },
        attributes: [
          "*",
          [sequelize.col('m_crop.crop_name'), 'crop_name'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [sequelize.col('m_variety_line.line_variety_name'), 'line_variety_name'],
        ],
        raw: true
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
        req.body.lot_no_array
        if (req.body.lot_no_array && req.body.lot_no_array.length) {
          let lotArray = [];
          let statusArray = [];
          req.body.lot_no_array.forEach(ele => {
            lotArray.push(ele.lot_id);
            if (ele.lot_id && ele.status) {
              statusArray.push(ele.status)
            };
          })
          // req.body.lot_no_array.forEach(ele=>{

          // })
          console.log("llllllllll",lotArray);
          if (lotArray && lotArray.length) {
            condition.where.lot_id = {
              [Op.in]: lotArray
            }
          }
          // if (statusArray && statusArray.length) {
          //   condition.where.status = {
          //     [Op.notIn]: statusArray
          //   }

          // }
        }
      }

      let dataList = await db.generateSampleSlipsModel.findAll(condition);
      if (dataList && dataList.length) {
        return response(res, status.DATA_AVAILABLE, 200, dataList);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, []);
      }

    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }
  static getGenerateSampleSlipData = async (req, res) => {
    try {
      let userId;
      let querySet;
      let attributesSet;
      let lotArray = [];
      let statusArray = [];
      let conditionSet;
      let statusArrayCondition = {};
  
      // Handle lot_no_array
      if (req.body.lot_no_array && req.body.lot_no_array.length) {
        req.body.lot_no_array.forEach(ele => {
          // Check if `ele` is an object with `lot_id` or a number (lot ID directly)
          if (typeof ele === 'object' && ele.lot_id) {
            lotArray.push(ele.lot_id);
            if (ele.status) {
              statusArray.push(ele.status);
            }
          } else if (typeof ele === 'number') {
            lotArray.push(ele);
          }
        });
  
        // Set statusArrayCondition if status exists
        if (statusArray.length) {
          statusArrayCondition = {
            status: {
              [Op.notIn]: statusArray
            }
          };
        }
  
        // Set conditionSet if statusArray has values
        if (statusArray.length) {
          conditionSet = {
            [Op.or]: [
              {
                status: {
                  [Op.eq]: null
                }
              }
            ]
          };
        }
  
        // Log lotArray for debugging
        console.log("Processed lotArray:", lotArray);
      }
  
      // Set userId if logged-in user information exists
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          user_id: req.body.loginedUserid.id
        };
      }
  
      // Handle get_caary_over cases (1, 2, or default)
      if (req.body.get_caary_over === 1) {
        querySet = {
          model: db.investVerifyModel,
          required: false,
          attributes: [],
          include: [
            {
              model: db.investHarvestingModel,
              attributes: []
            }
          ]
        };
      } else if (req.body.get_caary_over === 2) {
        querySet = {
          model: db.carryOverSeedDetailsModel,
          attributes: [],
          include: [
            {
              model: db.carryOverSeedModel,
              attributes: []
            }
          ]
        };
      } else {
        querySet = {
          model: db.intakeVerificationTags,
          required: false,
          attributes: [],
          include: [
            {
              model: db.investVerifyModel,
              attributes: [],
              include: [
                {
                  model: db.investHarvestingModel,
                  attributes: []
                }
              ]
            }
          ]
        };
      }
  
      // Create condition for the query
      let condition = {
        include: [
          {
            model: cropModel,
            attributes: [],
            required: true
          },
          {
            model: db.varietyModel,
            attributes: [],
            required: true
          },
          {
            model: db.varietLineModel,
            attributes: []
          },
          { ...querySet }
        ],
        where: {
          ...userId,
          [Op.or]: [
            { ...conditionSet },
            {
              [Op.and]: [
                {
                  unique_code: {
                    [Op.not]: null
                  }
                },
                {
                  unique_code: {
                    [Op.not]: ""
                  }
                },
                statusArrayCondition
              ]
            }
          ]
        },
        attributes: [
          "*",
          [sequelize.col('m_crop.crop_name'), 'crop_name'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [sequelize.col('m_variety_line.line_variety_name'), 'line_variety_name']
        ],
        raw: true
      };
  
      // Additional condition based on request body
      if (req.body) {
        if (req.body.year) {
          condition.where.year = req.body.year;
        }
        if (req.body.season) {
          condition.where.season = req.body.season;
        }
        if (req.body.crop_code) {
          condition.where.crop_code = req.body.crop_code;
        }
        if (lotArray.length) {
          condition.where.lot_id = {
            [Op.in]: lotArray
          };
        }
      }
  
      // Query the database
      let dataList = await db.generateSampleSlipsModel.findAll(condition);
      if (dataList && dataList.length) {
        return response(res, status.DATA_AVAILABLE, 200, dataList);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, []);
      }
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  };
  

  static getGenerateSampleSlipTestData = async (req, res) => {
    try {
      let condition = {
        include: [
          {
            model: db.seedLabTests,
            attributes: []
          }
        ],
        attributes: ['id', 'generate_sample_slip_id',
          [sequelize.col('generate_sample_slips_tests.test_id'), 'test_id'],
          [sequelize.col('seed_lab_test.lab_test_name'), 'test_name']
        ],
        raw: true,
        where: {
        }
      }
      if (req.body && req.body.search) {
        if (req.body.search.id) {
          condition.where.generate_sample_slip_id = req.body.search.id
        }
      }
      let dataList = await db.generateSampleSlipsTestsModel.findAll(condition);
      if (dataList && dataList.length) {
        response(res, status.DATA_AVAILABLE, 200, dataList);
      } else {
        response(res, status.DATA_NOT_AVAILABLE, 201, []);
      }

    } catch (error) {
      response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }

  static seedLabTestsList = async (req, res) => {
    try {
      let labTestdata = await db.seedLabTests.findAll();
      if (labTestdata && labTestdata.length) {
        return response(res, status.DATA_AVAILABLE, 200, labTestdata);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, []);
      }
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }

  static seedTestingLaboratoryList = async (req, res) => {
    try {
      let seedLabTestdata = await db.seedLabTestModel.findAll({
        attributes: ['id', 'lab_name']
      });
      if (seedLabTestdata && seedLabTestdata.length) {
        return response(res, status.DATA_AVAILABLE, 200, seedLabTestdata);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, []);
      }
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }




  static seedTestingLaboratoryListstatebyoldone = async (req, res) => {
    try {
      // Await the asynchronous getstlstate call
      const stvvv = await stlLab(req.body.stateCode);

      // Log the result to check the response
      // console.log('stvvvstvvv11*************', stvvv);

      // Return the result in the response
      if (stvvv && stvvv.length) {
        return response(res, status.DATA_AVAILABLE, 200, stvvv);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, []);
      }
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  };

  static seedTestingLaboratoryListstateby = async (req, res) => {
    try {
      // Fetching data from stlLab using stateCode
      const stvvv = await stlLab(req.body.stateCode);

      // Modify the fetched data from stlLab
      const modifiedData = stvvv.data.map(item => ({
        ...item,
        idtype: typeof item.labId,
        lab_name: item.labName || 'NA',
        lab_code: item.labCode || 'NA'
      }));

      console.log("Modified Data:", modifiedData);

      // Get the lab_codes from modifiedData
      const labCodes = modifiedData.map(item => item.lab_code);

      // Query database for matching lab_codes
      const dbResults = await db.seedLabTestModel.findAll({
        attributes: ['id', 'lab_code'],
        raw: true,
        where: {
          state_id: req.body.stateCode,
          lab_code: labCodes
        }
      });

      // console.log("Database Results:", dbResults);
      console.log("mode*****", modifiedData);
      console.log("dbResults*****", dbResults);

      const finalResult = modifiedData.map(lab => {
        // Find the corresponding ID based on lab_code
        const matchingIdEntry = dbResults.find(entry => entry.lab_code === lab.lab_code);

        // Construct the new object, including the ID if found
        return {
          ...lab,
          id: matchingIdEntry ? matchingIdEntry.id : null // Include the ID if found
        };
      });

      // Filtering out labs with lab_code 'NA' or if no ID was found
      const filteredResult = finalResult.filter(item => item.lab_code !== 'NA' && item.id !== null);

      // console.log('Final Merged Result:', filteredResult);



      // Return the final data array as the response
      return response(res, status.DATA_AVAILABLE, 200, filteredResult);

    } catch (error) {
      console.error('Error:', error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  };




  static getGenerateSampleSlipVarietyData = async (req, res) => {
    try {
      let userId;
      let userId1;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId1 = {
          user_id: req.body.loginedUserid.id
        }
        userId = {
          bspc_id: req.body.loginedUserid.id
        }
      }
      let condition = {
        include: [
          {
            model: varietyModel,
            attributes: []
          },
          {
            model: db.carryOverSeedDetailsModel,
            include: [
              {
                model: db.carryOverSeedModel,
                where: {
                  ...userId1
                },
                attributes: []
              }
            ],
            attributes: []
          },

        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('seed_processing_register.variety_code')), 'variety_code'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name']
        ],
        raw: true,
        where: {
          ...userId
        },
      }
      let condition1 = {
        include: [
          {
            model: varietyModel,
            attributes: []
          },
          {
            model: db.intakeVerificationTags,
            include: [
              {
                model: db.investVerifyModel,
                where: {
                  ...userId1
                },
                attributes: []
              }
            ],
            attributes: []
          },

        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('seed_processing_register.variety_code')), 'variety_code'],
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
      }

      let dataList = await db.seedProcessingRegister.findAll(condition);
      let dataList2 = await db.seedProcessingRegister.findAll(condition1);
      dataList = dataList.concat(dataList2)
      console.log(dataList, 'dataList')
      dataList = productiohelper.removeDuplicates(dataList, 'variety_code')
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

  // api for generate sample slip forwarding data
  static getGenerateSampleForwardingSlipYearData = async (req, res) => {
    try {
      let userId;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          user_id: req.body.loginedUserid.id
        }
      }
      let condition = {
        where: {
          ...userId
        },
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('generate_sample_slips.year')), 'year'],
        ]
      }

      let yearData = await db.generateSampleSlipsModel.findAll(condition)
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

  static getGenerateSampleForwardingSlipSeasonData = async (req, res) => {
    try {
      let userId;
      console.log('req.body.loginedUserid.id=====', req.body.loginedUserid.id);
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          user_id: req.body.loginedUserid.id
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
          [sequelize.fn('DISTINCT', sequelize.col('generate_sample_slips.season')), 'season'],
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

      let seasonData = await db.generateSampleSlipsModel.findAll(condition)
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

  static getGenerateSampleForwardingSlipCropData = async (req, res) => {
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
          }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('generate_sample_slips.crop_code')), 'crop_code'],
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

      let cropData = await db.generateSampleSlipsModel.findAll(condition)
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

  static addGenerateSampleForwardingData = async (req, res) => {
    console.log("&&&&&&&&&&&&&&&&&&&&&&&",req.body);
    let tableType = req.body.generateSampleForwardingSlipData[0].table_type;
     console.log("Table Type:", tableType);

    try {
      let userId;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          user_id: req.body.loginedUserid.id
        }
      }
      console.log("req.body.loginedUserid", req.body.loginedUserid)
      console.log(" req.body.generateSampleForwardingSlipData", req.body.generateSampleForwardingSlipData)
      if (req.body) {
        if (req.body.generateSampleForwardingSlipData && req.body.generateSampleForwardingSlipData.length) {
          let data;
          for (let key of req.body.generateSampleForwardingSlipData) {
            let rules = {
              "year": 'required|integer',
              "season": 'required|string',
              "crop_code": 'required|string',
              "variety_code": 'required|string',
              "lot_no": 'required|string',
              // "class_of_seed": 'required|string',
              // "godown_no": 'required',
              // "stack_no": 'required',
              // "no_of_bags": 'required',
              // "total_processed_qnt": 'required',
              // "unique_code": 'required',
              // "sample_no": 'required',
              "testing_lab": 'required',
              "chemical_treatment": 'required',
            };
            
            if (key.table_type === "table2") {
    
              delete rules.lot_no;  // Remove the 'lot_no' rule for 'table1'
              delete rules.testing_lab,
              delete rules.chemical_treatment
              rules.bspc_id = 'required|integer';  
            }
            let validation = new Validator(key, rules);
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
          }

          const apiURL = process.env.STL_DATA_PUSH_API
          const serialCode = process.env.SERIAL_CODE
          const API_KEY = process.env.STL_API_KEY
          let maxId = await db.generateSampleForwardingLettersModel.max('id');
          console.log("maxId-----------", maxId)

          let reqDataGOT = {
            "data": [

            ]
          }
          let reqDataSTL = {
            "auth": {
              "stateCode": "27",
              "apiKey": API_KEY
            },
            "data": [

            ]
          }
         
          let i = 0
          for (let key of req.body.generateSampleForwardingSlipData) {
            let radiobutton;
            if (key.table_type === "table2")
                {
                  radiobutton = "GOT";
                }
                else {
                   radiobutton = "STL";
                }
           console.log("ghjkl1111111111111111111111111111S;",radiobutton)

            if (key && key.choose_sample && key.choose_sample == true) {
              data = await db.generateSampleForwardingLettersModel.create({
                year: key.year ? key.year : "",
                season: key.season ? key.season : "",
                crop_code: key.crop_code ? key.crop_code : "",
                variety_code: key.variety_code ? key.variety_code : "",
                lot_no: key.lot_no ? key.lot_no : "",
                class_of_seed: key.class_of_seed ? key.class_of_seed : null,
                godown_no: key.godown_no ? key.godown_no : null,
                stack_no: key.stack_no ? key.stack_no : null,
                no_of_bags: key.no_of_bags ? key.no_of_bags : null,
                total_processed_qnt: key.total_processed_qnt ? key.total_processed_qnt : null,
                unique_code: key.unique_code ? key.unique_code : "",
                sample_no: key.sample_no ? key.sample_no : 1,
                testing_lab: key && key.testing_lab ? parseInt(key.testing_lab) : null,
                chemical_treatment: key.chemical_treatment,
                tests: key.tests ? key.tests : null,
                lot_id: key.lot_id ? key.lot_id : null,
                get_carry_over: key.get_carry_over ? key.get_carry_over : null,
                variety_code_line: key.variety_code_line ? key.variety_code_line : null,
                generate_sample_slip_id: key.generate_sample_slip_id ? key.generate_sample_slip_id : null,
                consignment_no: key.consignment_no ? key.consignment_no : null,
                running_no: key.running_number ? key.running_number : null,
                status: key.status ? key.status : null,
                testing_type:radiobutton,
                got_bspc_id:key.bspc_id,
                lab_serial_number: `${serialCode}-${maxId + 1}`,
                ...userId
              });

              console.log("datadata----------", data.id)

              console.log("key.unique_code", key.unique_code, key)

              // console.log("jvjhrhhriukey", key.bspc_id, key)
              let generateSlipData = await db.generateSampleSlipsModel.findOne({
                where: {
                  unique_code: key.unique_code
                }
              });

              console.log("generateSlipData", generateSlipData)
              let updatedObject = {}
              if (generateSlipData && generateSlipData.tests) {
                updatedObject = await this.renameKey(generateSlipData.tests, 'lab_test_name', 'testName');
                console.log("updatedObject", updatedObject)
              }

              let cropName = await db.cropModel.findOne({
                attributes: ['crop_name'],
                where: {
                  crop_code: key.crop_code
                }
              });
              let varietyName = await db.varietyModel.findOne({
                attributes: ['variety_name'],
                where: {
                  variety_code: key.variety_code
                }
              });

              console.log("cropName--", cropName, "varietyName--", varietyName)
              let requestDataSTL ={}
              let requestDataGOT ={}
              if(tableType==='table2') {
                requestDataGOT = {
                                  "user_id":req.body.loginedUserid.id,
                                  "bspc_id": key.bspc_id, //Ruchi
                                  "test_number":updatedObject ? updatedObject : [],
                                  // "test": updatedObject ? updatedObject : [],
                                  "year": key.year ? key.year + "-" + (parseInt(key.year) - 1999) : "",
                                  "cropName": cropName && cropName.crop_name ? cropName.crop_name : '',
                                  "crop_code": key.crop_code ? key.crop_code : "",
                                  "season": key.season ? (key.season == 'K' ? 'KHARIF ' + '(' + key.year + ')' : 'RABI ' + '(' + key.year + "-" + (parseInt(key.year) - 1999) + ')') : "",
                                  "intakeLotNum": key.lot_no ? key.lot_no : "",
                                  "varietyName": varietyName && varietyName.variety_name ? varietyName.variety_name : '', //
                                  "variety_code": key.variety_code ? key.variety_code : "",
                                  "variety_line_code":"",
                                  "samplingDate": this.getCurrentDateTime(),
                                  "samplingDrawnDate": this.getCurrentDateTime(),
                                  "sampleForwardToLabOn": this.getCurrentDateTime(),
                                  "consignment_number": key.consignment_no ? key.consignment_no : null,

                                  "sppRoName": req.body.loginedUserid && req.body.loginedUserid.name ? req.body.loginedUserid.name : '', //BSPC NAME
                                  "sppCode": req.body.loginedUserid && req.body.loginedUserid.code ? req.body.loginedUserid.code : '',  //BSPC Code
                                  "sppName": req.body.loginedUserid && req.body.loginedUserid.name ? req.body.loginedUserid.name : '', //BSPC NAME
                                  "sppRoCode": req.body.loginedUserid && req.body.loginedUserid.code ? req.body.loginedUserid.code : '',  ////BSPC Code
                                  "roCode": req.body.loginedUserid && req.body.loginedUserid.code ? req.body.loginedUserid.code : '',  //BSPC Code
                                  "roName": req.body.loginedUserid && req.body.loginedUserid.name ? req.body.loginedUserid.name : '', //BSPC NAME

                                  "sLSerial": key.running_number ? key.running_number : null,
                                  "testingLab": "MH-L-RCV-303001", //Lab code
                                  "testingLabCode": "MH-L-RCV-303001", //Lab code
                                  "unique_code": key.unique_code ? key.unique_code : "",
                                  "reason_id": 1, //Ruchi
                                  // "letterNo": `${serialCode}-${maxId + 1}`,
                                  "letterNo": key.consignment_no ? key.consignment_no : null,
                                  "samplingCode": key.unique_code ? key.unique_code : "",//Unique_code                                
                                }
              } else {
                requestDataSTL = {
                                "test": updatedObject ? updatedObject : [],
                                "finyear": key.year ? key.year + "-" + (parseInt(key.year) - 1999) : "",
                                "cropName": cropName && cropName.crop_name ? cropName.crop_name : '',
                                "cropCode": key.crop_code ? key.crop_code : "",
                                "season": key.season ? (key.season == 'K' ? 'KHARIF ' + '(' + key.year + ')' : 'RABI ' + '(' + key.year + "-" + (parseInt(key.year) - 1999) + ')') : "",
                                "intakeLotNum": key.lot_no ? key.lot_no : "",
                                "varietyName": varietyName && varietyName.variety_name ? varietyName.variety_name : '', //
                                "varietyCode": key.variety_code ? key.variety_code : "",
                                "samplingDate": this.getCurrentDateTime(),
                                "samplingDrawnDate": this.getCurrentDateTime(),
                                "sampleForwardToLabOn": this.getCurrentDateTime(),
                
                                "sppRoName": req.body.loginedUserid && req.body.loginedUserid.name ? req.body.loginedUserid.name : '', //BSPC NAME
                                "sppCode": req.body.loginedUserid && req.body.loginedUserid.code ? req.body.loginedUserid.code : '',  //BSPC Code
                                "sppName": req.body.loginedUserid && req.body.loginedUserid.name ? req.body.loginedUserid.name : '', //BSPC NAME
                                "sppRoCode": req.body.loginedUserid && req.body.loginedUserid.code ? req.body.loginedUserid.code : '',  ////BSPC Code
                                "roCode": req.body.loginedUserid && req.body.loginedUserid.code ? req.body.loginedUserid.code : '',  //BSPC Code
                                "roName": req.body.loginedUserid && req.body.loginedUserid.name ? req.body.loginedUserid.name : '', //BSPC NAME
                
                                "sLSerial": key.running_number ? key.running_number : null,
                                "testingLab": "MH-L-RCV-303001", //Lab code
                                "testingLabCode": "MH-L-RCV-303001", //Lab code
                                "uniqueCode": key.unique_code ? key.unique_code : "",
                
                                // "letterNo": `${serialCode}-${maxId + 1}`,
                                "letterNo": key.consignment_no ? key.consignment_no : null,
                                "samplingCode": key.unique_code ? key.unique_code : "",//Unique_code
                              }
              }

              reqDataSTL.data[i] = requestDataSTL
              reqDataGOT.data[i] = requestDataGOT
              maxId = await db.generateSampleForwardingLettersModel.max('id');
              i++;
            }
          }
          console.log("requestData", reqDataSTL.data)
          if(tableType==='table2')
          {           
           let newdata = await this.addGotTestingData({ body: reqDataGOT.data }, res);            
          }
          else {
            // await this.addGotTestingData({ body: reqData.data }, res);

            try {
              console.log("requestData", reqDataSTL.data)
              // local api
            // await this.addGotTestingData({ body: reqData.data }, res);
            await CallExternalAPI.post(apiURL, reqDataSTL)
            } catch (e) {
              console.log("errr", e)
            }
            if (data) {

              return response(res, status.DATA_SAVE, 200, data);
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

  static async renameKey(arr, oldKey, newKey) {
    return arr.map(obj => {
      if (obj.hasOwnProperty(oldKey)) {
        obj[newKey] = obj[oldKey];
        delete obj[oldKey];
        delete obj['id'];

      }
      return obj;
    });
  }

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

  static getGenerateSampleForwardingData = async (req, res) => {
    console.log("request",req.body.search)
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
            attributes: ['id'],
            include: [
              {
                model: db.agencyDetailModel,
                attributes: ['agency_name'] 
              }
            ]
          },
          {
            model: db.varietyModel,
            attributes: ['variety_code', 'variety_name']
          },
        
          {
            model: db.mVarietyLinesModel,
            attributes: ['variety_code', 'line_variety_code', 'line_variety_name']
          },
          {
            model: db.seedLabTestModel,
            attributes: ['id', 'lab_name']
          },
          {
            model: db.generateSampleForwardingLettersModel,
            required: false,
            attributes: ['unique_code', 'sample_no', 'chemical_treatment', 'lot_id', 'get_carry_over', 'testing_lab', 'consignment_no'],
            where: {
            }
          }
        ],
        where: {
          ...userId
        }
      }
      if (req.body && req.body.search) {
        if (req.body.search.year) {
          condition.where.year = req.body.search.year;
        }
        if (req.body.search.season) {

          condition.where.season = req.body.search.season
        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = req.body.search.crop_code;
        }
        if (req.body.search.seed_testing_lab_id) {
          condition.where.testing_lab = req.body.search.seed_testing_lab_id
        }
        if (req.body.search.variety_code_array && req.body.search.variety_code_array.length) {
          condition.where.variety_code = {
            [Op.in]: req.body.search.variety_code_array
          }
        }
        if (req.body.search.bspc_id) {
          // condition.where.got_bspc_id = {
          //   [Op.in]: req.body.search.bspc_id
          // }
          condition.where.got_bspc_id = req.body.search.bspc_id
         
        }
        if (req.body.search.lot_no_array && req.body.search.lot_no_array.length) {
          condition.where.lot_id = {
            [Op.in]: req.body.search.lot_no_array
          }
        }
      }
      let generateSampleForwardingLettersData = await db.generateSampleSlipsModel.findAll(condition)
      console.log("(((((((((((**********",generateSampleForwardingLettersData);
      if (generateSampleForwardingLettersData && generateSampleForwardingLettersData.length) {
        return response(res, status.DATA_AVAILABLE, 200, generateSampleForwardingLettersData)
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, [])
      }
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }

  static getGenerateSampleForwardingDataSecond = async (req, res) => {

    let radio_type;
    if(req.body.search.tabletype=='table1'){
      radio_type= {testing_type:"STL"}

    }
    else{
      radio_type={testing_type:"GOT"};
    }
    console.log("77777777777",radio_type)
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
            model: db.varietyModel,
            attributes: ['variety_code', 'variety_name']
          },
          {
            model: db.mVarietyLinesModel,
            attributes: ['variety_code', 'line_variety_code', 'line_variety_name']
          },
          {
            model: db.seedLabTestModel,
            attributes: ['id', 'lab_name']
          },
          {
            model: db.intakeVerificationTags,
            required: false,
            attributes: [
            ],
            where: {
            },
            include: [
              {
                model: db.investVerifyModel,
                attributes: [],
                include: [
                  {
                    model: db.investHarvestingModel,
                    attributes: [
                      // [sequelize.col('user_id'), 'bspc_id']
                    ]
                  }
                ]
              }
            ]
          }
          // attributesSet = [[sequelize.col('intake_verification_tag.invest_verification.invest_harvesting.user_id'), 'bspc_id']]
        ],
        where: {
          ...userId
        },
        attributes: ["*",
          [sequelize.col('intake_verification_tag->invest_verification->invest_harvesting.user_id'), 'bspc_id']
        ],
        raw: true,
        nest: true
      }
      if (req.body && req.body.search) {
        if (req.body.search.year) {
          condition.where.year = req.body.search.year;
        }
        let radio_type;
        if (req.body.search.tabletype === 'table1') {
          radio_type = { testing_type: "STL" };
        } else {
          radio_type = { testing_type: "GOT" };
        }
        condition.where = {
          ...condition.where,  // Spread existing conditions
          ...radio_type        // Add the radio_type condition
        };
      
        if (req.body.search.season) {
          condition.where.season = req.body.search.season
        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = req.body.search.crop_code;
        }
        if (req.body.search.seed_testing_lab_id) {
          condition.where.testing_lab = req.body.search.seed_testing_lab_id
        }
        
        if (req.body.search.variety_code_array && req.body.search.variety_code_array.length) {
          condition.where.variety_code = {
            [Op.in]: req.body.search.variety_code_array
          }
        }
        if (req.body.search.lot_no_array && req.body.search.lot_no_array.length) {
          condition.where.lot_id = {
            [Op.in]: req.body.search.lot_no_array
          }
        }
        if (req.body.search.consignment_no) {
          condition.where.consignment_no = req.body.search.consignment_no
        }
      }
      
      let generateSampleForwardingLettersData = await db.generateSampleForwardingLettersModel.findAll(condition)
      if (generateSampleForwardingLettersData && generateSampleForwardingLettersData.length) {
        return response(res, status.DATA_AVAILABLE, 200, generateSampleForwardingLettersData)
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, [])
      }
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }


  static getGenerateSampleForwardingSlipVarietyData = async (req, res) => {
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
            model: varietyModel,
            attributes: []
          }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('generate_sample_slips.variety_code')), 'variety_code'],
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
      

      let dataList = await db.generateSampleSlipsModel.findAll(condition);
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
  static seedGenerateForwardingTestingLaboratoryList = async (req, res) => {
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
            model: db.seedLabTestModel,
            attributes: []
          }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('generate_sample_slips.testing_lab')), 'id'],
          [sequelize.col('m_seed_test_laboratory.lab_name'), 'lab_name'],
        ],
        raw: true,
        where: {
          ...userId
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
      }
      let seedLabTestdata = await db.generateSampleSlipsModel.findAll(condition);
      if (seedLabTestdata && seedLabTestdata.length) {
        return response(res, status.DATA_AVAILABLE, 200, seedLabTestdata);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, []);
      }
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }
  static checkRunningNumber = async (req, res) => {
    try {
      let userId;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          user_id: req.body.loginedUserid.id
        }
      }
      let isrunning = await db.generateSampleForwardingLettersModel.findOne({
        where: {
          year: req.body.search.year,
          season: req.body.search.season,
          crop_code: req.body.search.crop_code,
          // variety_code: req.body.search.variety_code,
          ...userId
        },
        attributes: ['running_no'],
        order: [['running_no', "DESC"]]
      });
      if (isrunning) {
        return response(res, status.DATA_AVAILABLE, 200, isrunning);
      } else {
        return response(res, status.DATA_AVAILABLE, 201, []);
      }
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }


  static getStlReportStatusData = async (req, res) => {
    let returnResponse = [];
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
            model: db.varietyModel,
            attributes: ['variety_code', 'variety_name']
          },
          {
            model: db.mVarietyLinesModel,
            attributes: ['variety_code', 'line_variety_code', 'line_variety_name']
          },
          {
            model: db.seedTestingLabModel,
            required: false,
            as: 'seedLabtest',
            attributes: ['lab_name']
          },
        ],
        where: {
          ...userId
        }
      }
      if (req.body && req.body.search) {
        if (req.body.search.year) {
          condition.where.year = req.body.search.year;
        }
        if (req.body.search.season) {
          condition.where.season = req.body.search.season
        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = req.body.search.crop_code;
        }
        if (req.body.search.variety_code) {
          condition.where.variety_code = req.body.search.variety_code;
        }
        if (req.body.search.seed_testing_lab_id) {
          condition.where.testing_lab = req.body.search.seed_testing_lab_id
        }
        if (req.body.search.variety_code_array && req.body.search.variety_code_array.length) {
          condition.where.variety_code = {
            [Op.in]: req.body.search.variety_code_array
          }
        }
      }
      let stlReportData = await db.stlReportStatusModel.findAll(condition);
      returnResponse = stlReportData;
      if (returnResponse && returnResponse.length) {
        return response(res, status.DATA_AVAILABLE, 200, returnResponse);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, []);
      }
    } catch (error) {
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }
  // ruchi add got testing report

  static addGotTestingDataold= async (req, res) => {
    // console.log("Radhe",req.body);
    try {
    let userId;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          user_id: req.body.loginedUserid.id ? req.body.loginedUserid.id : null
        }
      }
      const stlgottestiong = req.body
      
      if (stlgottestiong && stlgottestiong.length) {
        console.log("jvjhjhk",stlgottestiong);
        let rules = {
          "year": 'required',
          "season": 'required|string',
          "crop_code": 'required|string',
          "variety_code": 'required|string',
          "bspc_id": 'required',
          // "chemical_treatment": 'required',
        };
        let validation = new Validator(key, rules);
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
        console.log("fgurnhuinghiu");
       
        
      // const gotTestingData = {
      //   bspc_id: req.body ? req.body.bspc_id : "",
      //   user_id: userId ? userId: null,
      //   year: key.year ? key.year : null ,
      //   crop_code:key.crop_code ? key.crop_code : null ,
      //   season: key.season ? key.season:null,
      //   consignment_number: key.consignment_number ? key.consignment_number : null,
      //   variety_line_code: key.variety_line_code ? key.variety_line_code : '',
      //   is_sample_received: true || 0, // Default value set to 0
      //   status: key.status?key.status:false,
      //   test_number: key.testno? key.testno:"",
      //   unique_code: key.unique_code? key.unique_code:"", // Default value set to false
      //   reason_id:key.reason_id? key.reason_id:""
      // };
      // createData = await db.gotTestingsModel.create(gotTestingData);
     console.log("insertdata",createData);
      // if (data && data.length) {
      //   response(res, status.DATA_AVAILABLE, 200, data)
      // } else {
      //   response(res, status.DATA_NOT_AVAILABLE, 201, [])
     }
     
    } catch (error) {
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }

  static addGotTestingDataworking = async (req, res) => {
    console.log("ddd********",req.body);
    try {
      let userId = null;
  
      // Check if the user ID is provided
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = req.body.loginedUserid.id;
      }
  
      const stlGotTesting = req.body;
  
      // If data is provided in the request
      if (stlGotTesting && Object.keys(stlGotTesting).length) {
        // let rules = {
        //   "year": 'required',
        //   "season": 'required|string',
        //   "crop_code": 'required|string',
        //   "variety_code": 'required|string',
        //   "bspc_id": 'required',
        // };
  
        // // Assuming Validator is already defined somewhere in your code
        // let validation = new Validator(req.body, rules);
        // const isValidData = validation.passes();
  
        // Validation failed
        // if (!isValidData) {
        //   let errorResponse = {};
        //   for (let key in rules) {
        //     const error = validation.errors.get(key);
        //     if (error.length) {
        //       errorResponse[key] = error;
        //     }
        //   }
        //   return response(res, status.BAD_REQUEST, 400, errorResponse, []);
        // }
  
        // Prepare the data to be inserted into the database
        const gotTestingData = {
          bspc_id: req.body.bspc_id || null,
          user_id: userId || null,
          year: req.body.year || null,
          crop_code: req.body.crop_code || null,
          variety_code:req.body.variety_code,
          season: req.body.season || null,
          consignment_number: req.body.consignment_number || null,
          variety_line_code: '',
          is_sample_received: true,
          status: req.body.status || false,
          test_number: req.body.testno || "",
          unique_code: req.body.unique_code || "", 
          reason_id: req.body.reason_id || null
        };
  
        // Insert data into 'gotTestingsModel'
        const createData = await db.gotTestingsModel.create(gotTestingData);
        console.log("Inserted Data:", createData);
  
        // Return a success response with the inserted data
        return response(res, status.SUCCESS, 200, createData);
      } else {
        // If no data is provided in the request
        return response(res, status.BAD_REQUEST, 400, { message: "No data provided" }, []);
      }
    } catch (error) {
      // Log and handle the error
      console.error("Error inserting data:", error);
      return response(res, status.UNEXPECTED_ERROR, 501, { error: error.message });
    }
  };

  static addGotTestingData12 = async (req, res) => {
    console.log("ddd********",req.body.bspc_id);
    for (let key of req.body) {
      // console.log("key&&&&&&&&&&&&&&&&&",key);
     let userId = null;
      if (key.loginedUserid && key.loginedUserid.id) {
        userId = key.loginedUserid.id;
      }
  
      const stlGotTesting = key;
  
        const gotTestingData = {
          bspc_id: key.bspc_id || null,
          user_id: key.user_id || null,
          year: key.year || null,
          crop_code: key.crop_code || null,
          variety_code:key.variety_code,
          season: 'k'|| null,
          consignment_number: key.consignment_number || null,
          variety_line_code: '',
          is_sample_received: true,
          status: key.status || false,
          test_number:"testno",
          unique_code: key.unique_code || "", 
          reason_id: key.reason_id || null
        };
        console.log("***************jhdj",gotTestingData);
  
        
        // Insert data into 'gotTestingsModel'
        const createData = await db.gotTestingsModel.create(gotTestingData);
      }
        console.log("Inserted Data:", createData);
          return createData;
        // Return a success response with the inserted data
      //   return response(res, status.SUCCESS, 200, createData);
      // } else {
      //   // If no data is provided in the request
      //   return response(res, status.BAD_REQUEST, 400, { message: "No data provided" }, []);
   
    
   
  };

  static addGotTestingData = async (req, res) => {
   
      let insertedData = []; // Array to store the inserted data
  
      for (let key of req.body) {
        console.log("Processing item with bspc_id:", key.user_id);
  
        // Check if the user ID is provided
        let userId = null;
        if (key.loginedUserid && key.loginedUserid.id) {
          userId = key.loginedUserid.id;
        }
  
        // Prepare the data to be inserted into 'gotTestingsModel'
        const gotTestingData = {
          bspc_id: key.bspc_id || null,
          user_id: key.user_id || null, // Use the extracted userId here
          year: key.year ? key.year.split('-')[0] : null,
          crop_code: key.crop_code || null,
          variety_code: key.variety_code,
          season: key.season ? key.season.charAt(0).toUpperCase() : null,
          consignment_number: key.consignment_number || null,
          variety_line_code: '',
          is_sample_received: true,
          status: "PENDING",
          test_number: "" || "", // Ensure correct field name is used (test_number)
          unique_code: key.unique_code || "",
          reason_id: key.reason_id || null
        };
        
  
        console.log("GotTestingData to be inserted:", gotTestingData);
  
        // Insert data into 'gotTestingsModel'
        const createData = await db.gotTestingsModel.create(gotTestingData);
        console.log("Inserted Data:", createData);
  
        // Add the inserted data to the array
        insertedData.push(createData);
      }
  
      // Return a success response with all inserted data
      return response(res, status.SUCCESS, 200, insertedData);
  
    
  };
  
  


  static addStlReportStatusData = async (req, res) => {
    try {
      let userId;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          user_id: req.body.loginedUserid.id ? req.body.loginedUserid.id : null
        }
      }
      const stlReportStatusData = req.body
      // console.log("stlReportStatusData", stlReportStatusData)
      // console.log("req.bodyreq.body", req.body)
      // const jsonString = JSON.stringify(req.body, null, 2);

      // // Define the file path
      // const filePath = './data.json';

      // // Write the JSON string to a file
      // fs.writeFile(filePath, jsonString, (err) => {
      //   if (err) {
      //     console.error('Error writing to file', err);
      //   } else {
      //     console.log('Successfully Saved');
      //   }
      // });
      // return response(res, status.DATA_SAVE, 200, []);

      if (stlReportStatusData && stlReportStatusData.length) {
        let createData;
        let data;
        for (let key of stlReportStatusData) {
          let rules = {
            "year": 'required',
            "season": 'required|string',
            "crop_code": 'required|string',
            "variety_code": 'required|string',
            // "lot_no": 'required|string',
            // "class_of_seed": 'required|string',
            // "godown_no": 'required',
            // "stack_no": 'required',
            // "no_of_bags": 'required',
            // "total_processed_qnt": 'required',
            // "unique_code": 'required',
            // "sample_no": 'required',
            "testing_lab_id": 'required',
            // "chemical_treatment": 'required',
          };
          let validation = new Validator(key, rules);
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
        }
        for (let key of stlReportStatusData) {
          let year, seasoneCode
          if (key.year) {
            year = parseInt(key.year.slice(0, 4));

          }
          if (key.season) {
            seasoneCode = key.season.toString().slice(0, 1).toUpperCase()
          }

          let generateSlipData = await db.generateSampleSlipsModel.findOne({
            where: {
              unique_code: key.unique_code
            }
          });

          let stlReportIsExist = await db.stlReportStatusModel.findOne({
            where: {
              unique_code: key.unique_code
            }
          });

          if (!stlReportIsExist && generateSlipData) {
            data = {
              year: year,
              season: seasoneCode,
              crop_code: key.crop_code ? key.crop_code : "",
              variety_code: key.variety_code ? key.variety_code : "",
              variety_code_line: key.parental_line_code ? key.parental_line_code : null,

              pure_seed: key.pure_seed ? key.pure_seed : null,
              inert_matter: key.inert_matter ? key.inert_matter : null,
              weed_seed_purity: key.weed_seed_purity ? key.weed_seed_purity : null,
              other_crop_purity: key.other_crop_purity ? key.other_crop_purity : null,
              weed_seed: key.weed_seed ? key.weed_seed : null,
              other_seed: key.other_seed ? key.other_seed : null,
              other_crop_seed: key.other_crop_seed ? key.other_crop_seed : null,
              normal_seeding: key.normal_seeding ? key.normal_seeding : null,
              abnormal_seeding: key.abnormal_seeding ? key.abnormal_seeding : null,
              dead_seed: key.dead_seed ? key.dead_seed : null,
              hard_seed: key.hard_seed ? key.hard_seed : null,
              fresh_ungerminated: key.fresh_ungerminated ? key.fresh_ungerminated : null,
              other_distinguisable_varieties: key.other_distinguisable_varieties ? key.other_distinguisable_varieties : null,
              insect_damage: key.insect_damage ? key.insect_damage : null,
              nematode: key.nematode ? key.nematode : null,
              husk: key.husk ? key.husk : null,
              status: null,
              m: key.m ? key.m : null,
              // date_of_test: key.date_of_test ? key.date_of_test : null,
              date_of_test: this.getCurrentDateTime(),
              lot_no: generateSlipData.lot_no ? generateSlipData.lot_no : "",
              class_of_seed: generateSlipData.class_of_seed ? generateSlipData.class_of_seed : null,
              godown_no: generateSlipData.godown_no ? generateSlipData.godown_no : null,
              stack_no: generateSlipData.stack_no ? generateSlipData.stack_no : null,
              no_of_bags: generateSlipData.no_of_bags ? generateSlipData.no_of_bags : null,
              total_processed_qnt: generateSlipData.total_processed_qnt ? generateSlipData.total_processed_qnt : null,
              unique_code: generateSlipData.unique_code ? generateSlipData.unique_code : "",
              sample_no: generateSlipData.sample_no ? generateSlipData.sample_no : 1,
              chemical_treatment: generateSlipData.chemical_treatment,
              lot_id: generateSlipData.lot_id ? generateSlipData.lot_id : null,
              user_id: generateSlipData.user_id ? generateSlipData.user_id : null,
              testing_lab: generateSlipData && generateSlipData.testing_lab ? parseInt(generateSlipData.testing_lab) : null
            }
            createData = await db.stlReportStatusModel.create(data);


          }
          // console.log('responseData=======',responseStlData)
        }
        if (createData) {
          return response(res, status.DATA_SAVE, 200, []);
        } else {
          return response(res, status.DATA_NOT_SAVE, 201, []);
        }
      }
    } catch (error) {
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }

  static updateStlReportStatusData = async (req, res) => {
    try {
      let updateStatus;
      if (req.body && req.body.id) {

        updateStatus = await db.stlReportStatusModel.update({
          status: req.body.status
        }, {
          where: {
            id: req.body.id
          }
        });
        if (updateStatus) {
         let generateSlipData =  await db.generateSampleSlipsModel.update({
            status: 'reject'
          }, {
            where: {
              year: req.body.data.year,
              season:req.body.data.season,
              crop_code:req.body.data.crop_code,
              variety_code:req.body.data.variety_code,
              lot_id:req.body.data.lot_id,
              user_id:req.body.data.user_id
            }
          });
          let generateSlipForwardingData =  await db.generateSampleForwardingLettersModel.update({
            status: 'reject'
          }, {
            where: {
              year: req.body.data.year,
              season:req.body.data.season,
              crop_code:req.body.data.crop_code,
              variety_code:req.body.data.variety_code,
              lot_id:req.body.data.lot_id,
              user_id:req.body.data.user_id
            }
          });
          return response(res, "Status Updated Successfully", 200, []);
        } else {
          return response(res, "Status Not Updated", 201, []);
        }
      } else {
        return response(res, "data not exist", 201, []);
      }

    } catch (error) {
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }
  static getAllCropList = async (req, res) => {
    let data = {};
    //console.log('data1111111', data)

    try {
      let condition = {
        where: {

        },
        attributes: ['crop_code', 'crop_name']
      }
      condition.order = [['crop_name', 'ASC']];
      data = await cropModel.findAll(condition);
      //console.log('data', data)
      // res.send(data)
      if (data && data.length) {
        response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        response(res, status.DATA_NOT_AVAILABLE, 201, [])
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getAllVarietypListv1 = async (req, res) => {
    let data = {};
    try {
      let condition = {
        where: {
        },
        attributes: ['variety_name', 'variety_code']
      }
      condition.order = [['variety_name', 'ASC']];
      if (req.body && req.body.search) {
        if (req.body.search.crop_code) {
          condition.where.crop_code = req.body.search.crop_code
        }
      }
      data = await varietyModel.findAll(condition);
      if (data && data.length) {
        response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        response(res, status.DATA_NOT_AVAILABLE, 201, [])
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getAllVarietyLineListv1 = async (req, res) => {
    let data = {};
    try {
      let condition = {
        where: {
        },
        attributes: ['line_variety_name', 'line_variety_code', 'variety_code']
      }
      condition.order = [['line_variety_name', 'ASC']];
      if (req.body && req.body.search) {
        if (req.body.search.variety_code) {
          condition.where.variety_code = req.body.search.variety_code
        }
      }

      data = await db.varietLineModel.findAll(condition);
      if (data && data.length) {
        response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        response(res, status.DATA_NOT_AVAILABLE, 201, [])
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static addVarietyPriceList = async (req, res) => {
    try {
      let yearValue;
      let seasonValue;
      let cropValue;
      let varietyValue;
      let lineVarietyValue;
      const data = db.varietyPriceList.build({
        year: req.body.year ? req.body.year : '',
        season: req.body.season ? req.body.season : '',
        crop_code: req.body.crop_code ? req.body.crop_code : '',
        variety_code: req.body.variety_code ? req.body.variety_code : '',
        variety_line_code: req.body.variety_line_code ? req.body.variety_line_code : '',
        // per_quintal_mrp: req.body.per_quintal_mrp ? req.body.per_quintal_mrp : '',
        package_data: req.body.packag_data ? req.body.packag_data : '',
        // valid_from:Date.now(),
        user_id: req.body.user_id ? req.body.user_id : req.body.loginedUserid.id,
        is_active: 1,
        created_at: Date.now(),
        updated_at: Date.now(),
        user_id: req.body.user_id ? req.body.user_id : req.body.loginedUserid.id,
      });
      if (req.body && req.body.type && req.body.type == 'edit') {
        let condition = {
          where: {
          }
        }

        if (req.body) {
          if (req.body.year) {
            condition.where.year = req.body.year
            yearValue = {
              year: req.body.year
            }
          }
          if (req.body.id) {
            condition.where.id = req.body.id
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
          if (req.body.variety_line_code) {
            condition.where.variety_line_code = req.body.variety_line_code
          }
        }
        let priceListData = await db.varietyPriceList.findOne(condition);

        if (priceListData) {
          db.varietyPriceListPackagesModel.update({ is_active: false }, { where: { variety_priece_list_id: req.body.id } })
          db.varietyPriceList.update(
            {
              is_active: false
            },
            {
              where: {
                id: req.body.id,
                ...yearValue,
                ...seasonValue,
                ...cropValue,
                ...varietyValue,
                ...lineVarietyValue,
              }
            }
          )
          let dataValue = await data.save();
          if (req.body.packag_data && req.body.packag_data.length) {
            for (let key of req.body.packag_data) {
              db.varietyPriceListPackagesModel.create({
                variety_priece_list_id: dataValue['dataValues'].id,
                per_qnt_mrp: ((key.per_quintal_mrp / 100) * key.packag_size),
                packages_size: key.packag_size,
                per_quintal_price: key.per_quintal_mrp,
              })
            }
          }
          if (data) {
            return response(res, status.DATA_SAVE, 200, data)
          } else {
            return response(res, status.DATA_NOT_SAVE, 201, [])
          }
        } else {

        }
      } else {
        let dataValue = await data.save();
        if (req.body.packag_data && req.body.packag_data.length) {
          for (let key of req.body.packag_data) {
            db.varietyPriceListPackagesModel.create({
              variety_priece_list_id: dataValue['dataValues'].id,
              per_qnt_mrp: ((key.per_quintal_mrp / 100) * key.packag_size),
              packages_size: key.packag_size,
              per_quintal_price: key.per_quintal_mrp,
              // per_qnt_mrp: ((key.per_quintal_mrp *100)/key.packag_size).toFixed(2),
              // packages_size: key.packag_size,
              // per_quintal_price:key.per_quintal_mrp,
              // per_qnt_mrp: key.per_quintal_mrp,
              // packages_size: key.packag_size
            })
          }
        }

        if (data) {
          return response(res, status.DATA_SAVE, 200, data)
        } else {
          return response(res, status.DATA_NOT_SAVE, 201, [])
        }
      }
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 501, [])
    }
  }
  static getVarietyPriceList = async (req, res) => {
    try {
      let condition = {
        include: [
          {
            required: true,
            model: varietyModel,
            attributes: []
          },
          {
            required: true,
            model: cropModel,
            attributes: []
          },
          // {
          //   model: db.varietyPriceListPackagesModel,
          //   attributes: [],
          //   where: {
          //     is_active: true
          //   }
          // }

          {
            required: false,
            model: db.varietLineModel,
            attributes: []
          },
        ],
        where: {

        },
        attributes: [
          [sequelize.col('variety_price_lists.id'), 'id'],
          [sequelize.col('variety_price_lists.year'), 'year'],
          [sequelize.col('variety_price_lists.season'), 'season'],
          [sequelize.col('variety_price_lists.crop_code'), 'crop_code'],
          [sequelize.col('variety_price_lists.variety_code'), 'variety_code'],
          [sequelize.col('variety_price_lists.variety_line_code'), 'variety_line_code'],
          [sequelize.col('variety_price_lists.per_quintal_mrp'), 'per_quintal_mrp'],
          [sequelize.col('variety_price_lists.valid_from'), 'valid_from'],
          [sequelize.col('variety_price_lists.created_at'), 'created_at'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [sequelize.col('m_crop.crop_name'), 'crop_name'],
          [sequelize.col('m_variety_line.line_variety_name'), 'line_variety_name'],
          [sequelize.col('variety_price_lists.package_data'), 'package_data'],
          // [sequelize.col('variety_price_list_package.per_qnt_mrp'), 'per_qnt_mrp'],
          // [sequelize.col('variety_price_list_package.packages_size'), 'packages_size']
        ],
        raw: true,
        where: {
          user_id: req.body.loginedUserid.id
        }
      }
      condition.where.is_active = true;
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
        if (req.body.search.variety_code) {
          condition.where.variety_code = req.body.search.variety_code
        }
        if (req.body.search.variety_line_code) {
          condition.where.variety_line_code = req.body.search.variety_line_code
        }
      }
      let priceListData = await db.varietyPriceList.findAndCountAll(condition);

      if (priceListData && priceListData.rows && priceListData.rows.length) {
        return response(res, status.DATA_AVAILABLE, 200, priceListData);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, priceListData);
      }
    } catch (error) {
      return response(res, status.UNEXPECTED_ERROR, 501, [])
    }
  }

  static deleteVarietyPriceList = async (req, res) => {
    try {
      if (req.body && req.body.id) {
        const data = await db.varietyPriceList.destroy({
          where: {
            id: req.body.id
          }
        })
        if (data) {
          return response(res, status.DATA_DELETED, 200, []);
        } else {
          return response(res, "Data Not Deleted", 200, [])
        }
      } else {
        return response(res, "Data Not Found", 201, [])
      }
    } catch (error) {
      return response(res, status.UNEXPECTED_ERROR, 501, [])
    }
  }
  static getAllVarietypListpriceLis = async (req, res) => {
    let data = {};
    try {

      let datas = await db.varietyPriceList.findAll({
        // crop_code:
        where: {
          crop_code: req.body.search.crop_code,
          year: req.body.search.year,
          season: req.body.search.season,
          // variety_line_code:null,
          user_id: req.body.loginedUserid.id,
        },
        raw: true,
        attributes: [
          'variety_code', 'variety_line_code'
        ]
      })
      let datas2 = await db.varietyPriceList.findAll({
        // crop_code:
        where: {
          crop_code: req.body.search.crop_code,
          year: req.body.search.year,
          season: req.body.search.season,
          // variety_line_code:null,
          user_id: req.body.loginedUserid.id,
        },
        raw: true,
        attributes: [
          'variety_line_code', 'variety_code'
        ]
      })

      let varietyLineData = [];
      let varieties = []
      if (datas2 && datas2.length > 0) {
        datas2.forEach(el => {
          varietyLineData.push(el && el.variety_line_code ? el.variety_line_code : '');
          varieties.push(el && el.variety_code ? el.variety_code : '')
        })
      }
      if (varietyLineData && varietyLineData.length > 0) {
        varietyLineData = varietyLineData.filter(x => x != '')
      }
      let varietyData = [];
      if (datas && datas.length > 0) {
        datas.forEach(el => {
          varietyData.push(el && el.variety_code ? el.variety_code : '')
        })
      }
      let datas3 = await db.varietyModel.findAll({
        required: false,
        include: [
          {
            model: db.varietLineModel,
            required: false,
            // where:{
            //   variety_code:{
            //     [Op.in]:varieties
            //   }
            // },
            attributes: []
          }
        ],
        where: {
          // variety_code:{
          //   [Op.in]:varieties
          // },
          crop_code: req.body.search.crop_code,
        },
        raw: true,

        attributes: [
          [sequelize.col('m_variety_line.line_variety_code'), 'line_variety_code'],
          [sequelize.col('m_variety_line.line'), 'line'],
          [sequelize.col('m_crop_varieties.variety_name'), 'variety_name'],
          [sequelize.col('m_crop_varieties.variety_code'), 'variety_code'],

          //   'line_variety_code','variety_code'
        ],
        //  group:['line_variety_code','variety_code']
      })
      console.log(datas, 'datas')
      console.log(datas3, 'datas3')
      let varietyData1 = []
      let varietyData2 = [];


      if (datas3 && datas3.length > 0) {
        datas3.forEach(el => {
          varietyData1.push(el.variety_code)
          if (el.line_variety_code) {

          } else {
            varietyData2.push(el.variety_code)
          }
        })
      }
      function findUncommonData(arr1, arr2) {
        // Extract variety codes from arr2
        const arr2VarietyCodes = arr2.map(item => item.variety_code);

        // Filter arr1 to get elements not present in arr2
        const uncommonData = arr1.filter(item => {
          if (item.line_variety_code !== null) {
            // Filter using line_variety_code and variety_code
            const match = arr2.find(entry => entry.variety_code === item.variety_code && entry.variety_line_code === item.line_variety_code);
            return match === undefined; // Include if no match found
          } else {
            // Filter using only variety_code
            const match = arr2.find(entry => entry.variety_code === item.variety_code);
            return match === undefined; // Include if no match found
          }
        });

        return uncommonData;
      }

      // Call the function to get the uncommon data
      const uncommonDataArr1 = findUncommonData(datas3, datas);

      console.log(uncommonDataArr1, 'uncommonDataArr1');
      let variety = []
      if (uncommonDataArr1 && uncommonDataArr1.length > 0) {
        uncommonDataArr1.forEach(el => {
          variety.push(el.variety_code)
        })
      }

      let condition1 = {
        where: {
          crop_code: req.body.search.crop_code,
          // status:'variety',
          variety_code: {
            [Op.in]: variety
          }
        },
        attributes: [
          'variety_code', 'variety_name'
        ],
      }
      // condition.order = [['line_variety_name', 'ASC']];


      // let lineData = await db.varietLineModel.findAll(condition2);
      // console.log(lineData,'lineData')
      data = await varietyModel.findAll(condition1);
      // console.log('data',data)
      if (data && data.length) {
        response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        response(res, status.DATA_NOT_AVAILABLE, 201, [])
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  // all bspc details
  static getAllWillingBspcListData = async (req, res) => {
    try {
 
      let getAllBspcList = await db.userModel.findAll({
        include: [
          {
            required: true,
            model: db.agencyDetailModel,
            attributes: []
          }
        ],
 
        attributes: [
          [sequelize.fn("DISTINCT", sequelize.col('user.id')), 'bspc_id'],
          [sequelize.col('user.name'), 'short_name'],
          [sequelize.col('agency_detail.agency_name'), 'name'],
        ],
        where: {
          user_type: "BPC",
        },
        raw: true,
      });
      let finalArray = []
      if (getAllBspcList && getAllBspcList.length) {
        for (let key of getAllBspcList) {
          let param = {
            crop_code: req && req.body && req.body.search && req.body.search.crop_code ? req.body.search.crop_code : '',
            variety_code: req && req.body && req.body.search && req.body.search.variety_code ? req.body.search.variety_code : '',
            bspc_id: key && key.bspc_id ? key.bspc_id : '',
          }
          // let nucleusSeedData = await this.getNucleusSeedData(param);
          // let breederSeedData = await this.getBreederSeedData(param);
         
          finalArray.push({
            "bspc_id": key && key.bspc_id ? key.bspc_id : null,
            "short_name": key && key.short_name ? key.short_name : null,
            "name": key && key.name ? key.name : null,
         })
        }
        if (finalArray && finalArray.length) {
          return response(res, status.DATA_AVAILABLE, 200, finalArray)
        } else {
          return response(res, status.DATA_NOT_AVAILABLE, 201, [])
        }
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, [])
      }
    } catch (error) {
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 501, error)
    }
  }

  static getAllVarietyLineListforPrice = async (req, res) => {
    let data = {};
    try {
      let datas = await db.varietyPriceList.findAll({
        // crop_code:
        where: {
          crop_code: req.body.search.crop_code,
          year: req.body.search.year,
          season: req.body.search.season,
          // variety_line_code:null,
          user_id: req.body.loginedUserid.id,
        },
        raw: true,
        attributes: [
          'variety_line_code'
        ]
      })

      let varietyLineData = [];
      if (datas && datas.length > 0) {
        datas.forEach(el => {
          varietyLineData.push(el && el.variety_line_code ? el.variety_line_code : '')
        })
      }
      if (varietyLineData && varietyLineData.length > 0) {

        varietyLineData = varietyLineData.filter(x => x != '')
      }
      let condition = {
        where: {
          line_variety_code: {
            [Op.notIn]: varietyLineData
          },
          variety_code: req.body.search.variety_code
        },

        attributes: ['line_variety_name', 'line_variety_code', 'variety_code']
      }
      condition.order = [['line_variety_name', 'ASC']];


      data = await db.varietLineModel.findAll(condition);
      if (data && data.length) {
        response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        response(res, status.DATA_NOT_AVAILABLE, 201, [])
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  // make a got report bsp5
   
  static getGotreportbspfiveyear = async (req, res) => {
    console.log(req.body);
    try {
      let userId;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          bspc_id: req.body.loginedUserid.id
        }
      }
      let condition = {
        where: {
          ...userId
        },
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('year')), 'year'],
        ]
      }

      let yearData = await db.bspPerestingsBspFiveModel.findAll(condition)
      // console.log(yearData,"kthkthi");
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

  static getGotreportbspfiveSeason = async (req, res) => {
    console.log(req.body);
    try {
      let userId;
      console.log('req.body.loginedUserid.id=====', req.body.loginedUserid.id);
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
          [sequelize.fn('DISTINCT', sequelize.col('bsp_proforma_5as.season')), 'season'],
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

      let seasonData = await db.bspPerestingsBspFiveModel.findAll(condition)
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

  static getGotreportCrop = async (req, res) => {
    let filters = {};
    const { year, season } = req.body;
  
    try {
      // Get user ID if available
      let id = req.body.loginedUserid && req.body.loginedUserid.id ? req.body.loginedUserid.id : null;
      if (id) {
        filters.bspc_id = id;
      }
  
      // Add year and season to filters if they exist
      if (year) {
        filters.year = year;
      }
      if (season) {
        filters.season = season;
      }
      const crop_code = await db.bspPerestingsBspFiveModel.findAll({
        attributes: [        
          [sequelize.fn('DISTINCT', sequelize.col('bsp_proforma_5as.crop_code')), 'crop_code'],
           [sequelize.col('m_crop.crop_name'), 'crop_name'],
        ],
        where: {
          ...filters,
        },
        include: [
          {
            model: cropModel,
            attributes: [], // Empty array because we only need 'crop_name' from 'm_crop'
            required: true // Ensures only records with matching crops are included
          }
        ],
        order: [[sequelize.col('m_crop.crop_name'), 'ASC']],        
        raw: true,
      });
  
      // Check if crop_code is empty or not found
      if (!crop_code || crop_code.length === 0) {
        return response(res, 'No data found.', 404);
      }
  
      return response(res, 'Data found successfully.', 200, crop_code);
    } catch (error) {
      console.log('Database error in getGotreportCrop:', error);
      return response(res, 'Unexpected error occurred.', 501, error);
    }
  };

  static getGotreportVariety= async (req, res) => {
    let filters = {};
    const { year, season } = req.body;
  
    try {
      // Get user ID if available
      let id = req.body.loginedUserid && req.body.loginedUserid.id ? req.body.loginedUserid.id : null;
      if (id) {
        filters.bspc_id = id;
      }
      // Add year and season to filters if they exist
      if (year) {
        filters.year = year;
      }
      if (season) {
        filters.season = season;
      }
      // if (crop_code) {
      //   filters.crop_code = crop_code;
      // }
      const varietydata = await db.bspPerestingsBspFiveModel.findAll({
        attributes: [    
          [sequelize.fn('DISTINCT', sequelize.col('bsp_proforma_5as.variety_code')), 'variety_code'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'], 
        ],
        where: {
          ...filters,
        },
        include: [
          {
            model: db.varietyModel,
            as: 'm_crop_variety', // Update alias here to match hint
            attributes: [],
            required: true,
          }
        ],     
        raw: true,
      });
  
      // Check if crop_code is empty or not found
      if (!varietydata || varietydata.length === 0) {
        return response(res, 'No data found.', 404);
      }
  
      return response(res, 'Data found successfully.', 200, varietydata);
    } catch (error) {
      console.log('Database error in getGotreportCrop:', error);
      return response(res, 'Unexpected error occurred.', 501, error);
    }
  };

  static getGotReportDetailsold = async (req, res) => {
    let filters = {};
    const { year, season, crop_code } = req.body;
  
    try {
      // Get user ID if available
      let id = req.body.loginedUserid && req.body.loginedUserid.id ? req.body.loginedUserid.id : null;
      if (id) {
        filters.bspc_id = id;
      }
  
      // Apply filters if present
      if (year) filters.year = year;
      if (season) filters.season = season;
      if (crop_code) filters.crop_code = crop_code;
  
      // Query bspPerestingsBspFiveModel with cropModel and varietyModel included
      const reportData = await db.bspPerestingsBspFiveModel.findAll({
        attributes: [
          'crop_code', // Select crop_code from bspPerestingsBspFiveModel
          'year',      // Select year from bspPerestingsBspFiveModel
          'season',    // Select season from bspPerestingsBspFiveModel
          'variety_code',
          'variety_line_code',
          'lot_no',
          'lod_id',
          'got_unique_code',
          'number_sample_taken',
          'area_shown',
          'date_of_bsp_2',
          'date_of_bsp_3',
          'total_plant_ovserved',
          'self_plant',
          'off_type_plant',
          'true_plant',
          [sequelize.col('m_crop.crop_name'), 'crop_name'], // Get crop_name from cropModel
         [sequelize.col('m_crop_varieties.variety_name'), 'variety_name'], // Get variety_name from varietyModel
        ],
        where: filters,
        include: [
          {
            model: db.cropModel,
            attributes: [], // We only need crop_name, already selected above
            required: true, // Ensures only records with matching crops are returned
          },
          {
            model: db.varietyModel,
            attributes: [], 
            required: true, // Ensures only records with matching varieties are returned
          }
        ],
        order: [[sequelize.col('m_crop.crop_name'), 'ASC']],
        raw: true,
      });
  
      // Check if data was found
      if (!reportData || reportData.length === 0) {
        return response(res, 'No data found.', 404);
      }
  
      return response(res, 'Data retrieved successfully.', 200, reportData);
    } catch (error) {
      console.log('Error retrieving report data:', error);
      return response(res, 'Unexpected error occurred.', 501, error);
    }
  };

  static getGotReportDetails = async (req, res) => {
    let filters = {};
    // const {crop_code,year,season,variety_code} 
   

    const year = req.body.search.year; // Parse from search object
    const season = req.body.search.season;
    const crop_code = req.body.search.crop_code;
    const variety_code = req.body.search.variety_code;
  
    try {
      // Get user ID if available
      let id = req.body.loginedUserid && req.body.loginedUserid.id ? req.body.loginedUserid.id : null;
      if (id) {
        filters.bspc_id = id;
      }
  
      // Apply filters if present
      if (year) filters.year = year;
      if (season) filters.season = season;
      if (crop_code) filters.crop_code = crop_code;
      if (variety_code) 
        {
          filters.variety_code = variety_code;
        }
  
      // Query bspPerestingsBspFiveModel with cropModel and varietyModel included
      const reportData = await db.bspPerestingsBspFiveModel.findAll({
        attributes: [
          'crop_code',
          'year',
          'season',
          'variety_code',
          'variety_line_code',
          'lot_no',
          'lod_id',
          'got_unique_code',
          'number_sample_taken',
          'area_shown',
          'date_of_bsp_2',
          'date_of_bsp_3',
          'total_plant_ovserved',
          'self_plant',
          'off_type_plant',
          'true_plant',
          [sequelize.col('m_crop.crop_name'), 'crop_name'], // Get crop_name from cropModel
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'], // Update alias here
        ],
        where: filters,
        include: [
          {
            model: db.cropModel,
            as: 'm_crop', // Alias for cropModel
            attributes: [],
            required: true,
          },
          {
            model: db.varietyModel,
            as: 'm_crop_variety', // Update alias here to match hint
            attributes: [],
            required: true,
          },
        ],
        order: [[sequelize.col('m_crop.crop_name'), 'ASC']],
        raw: true,
      });
  
      // Check if data was found
      if (!reportData || reportData.length === 0) {
        return response(res, 'No data found.', 404);
      }
  
      return response(res, 'Data retrieved successfully.', 200, reportData);
    } catch (error) {
      console.log('Error retrieving report data:', error);
      return response(res, 'Unexpected error occurred.', 501, error);
    }
  };

  static getBspcListDataForword = async (req, res) => {
    let filters = {};
    // const {crop_code,year,season,variety_code} 
   

    const year = req.body.search.year; // Parse from search object
    const season = req.body.search.season;
    const crop_code = req.body.search.crop_code;
    try {
      let id = req.body.loginedUserid && req.body.loginedUserid.id ? req.body.loginedUserid.id : null;
      // if (id) {
      //   filters.bspc_id = id;
      // }
  
      // Apply filters if present
      if (year) filters.year = year;
      if (season) filters.season = season;
      if (crop_code) filters.crop_code = crop_code;

        let getAllBspcList = await db.generateSampleSlipsModel.findAll({
            include: [
                {
                    model: db.userModel,
                    required: true,
                    attributes: [], // Only specific columns
                    where: {
                        user_type: 'BPC'
                    },
                    include: [
                        {
                            model: db.agencyDetailModel,
                            required: true,
                            attributes: []
                        }
                    ]
                }
            ],
            attributes: [
                [sequelize.fn("DISTINCT", sequelize.col('generate_sample_slips.got_bspc_id')), 'bspc_id'],
                [sequelize.col('user.name'), 'short_name'],
                [sequelize.col('user->agency_detail.agency_name'), 'agency_name'] // Nested join reference
            ],
            where: filters,
            raw: true,
        });

        let finalArray = [];
        if (getAllBspcList && getAllBspcList.length) {
            for (let key of getAllBspcList) {
                let param = {
                    crop_code: req.body?.search?.crop_code || '',
                    variety_code: req.body?.search?.variety_code || '',
                    bspc_id: key?.bspc_id || ''
                };
                
                finalArray.push({
                    bspc_id: key?.bspc_id || null,
                    short_name: key?.short_name || null,
                    agency_name: key?.agency_name || null,
                });
            }

            if (finalArray.length) {
                return response(res, status.DATA_AVAILABLE, 200, finalArray);
            } else {
                return response(res, status.DATA_NOT_AVAILABLE, 201, []);
            }
        } else {
            return response(res, status.DATA_NOT_AVAILABLE, 201, []);
        }
    } catch (error) {
        console.error(error);
        return response(res, status.UNEXPECTED_ERROR, 501, error);
    }
};
  
//get forwording State 
static getStateListDataForword = async (req, res) => {
  let filters = {};
  const { year, season, crop_code, variety_code } = req.body.search || {};

  try {
    // Apply filters if present
    if (year) filters.year = year;
    if (season) filters.season = season;
    if (crop_code) filters.crop_code = crop_code;

    // Perform the query to get distinct state codes and their names
    let getStateList = await db.generateSampleSlipsModel.findAll({
      include: [
        {
          model: db.stateModel,
          // as: 'stateModel', // Set alias explicitly for consistent referencing
          required: true,
          attributes: ['state_name'],
        }
      ],
      attributes: [
        [sequelize.fn("DISTINCT", sequelize.col('generate_sample_slips.state_code')), 'state_code'],
        [sequelize.col('m_state.state_name'), 'state_name'], // Use explicit alias in the joined table's column
      ],
      where: filters,
      raw: true,
    });

    // Process and format the response
    let finalArray = [];
    if (getStateList && getStateList.length) {
      for (let key of getStateList) {
        finalArray.push({
          state_code: key.state_code,
          state_name: key.state_name,
          crop_code: crop_code || '',
          variety_code: variety_code || '',
          bspc_id: key.bspc_id || null,
        });
      }

      return response(res, status.DATA_AVAILABLE, 200, finalArray);
    } else {
      return response(res, status.DATA_NOT_AVAILABLE, 201, []);
    }
  } catch (error) {
    console.error(error);
    return response(res, status.UNEXPECTED_ERROR, 501, error);
  }
};

static seedTestingLaboratoryListstateforforwording = async (req, res) => {
    try {
      // Fetching data from stlLab using stateCode
      const stvvv = await stlLab(req.body.stateCode);

      // Modify the fetched data from stlLab
      const modifiedData = stvvv.data.map(item => ({
        ...item,
        idtype: typeof item.labId,
        lab_name: item.labName || 'NA',
        lab_code: item.labCode || 'NA'
      }));

      console.log("Modified Data:", modifiedData);

      // Get the lab_codes from modifiedData
      const labCodes = modifiedData.map(item => item.lab_code);

      // Query database for matching lab_codes
      const dbResults = await db.generateSampleSlipsModel.findAll({
        include: [
          {
             model: db.seedLabTestModel,
             required: true,
          }
        ],
        attributes: [
          [sequelize.fn("DISTINCT", sequelize.col('generate_sample_slips.testing_lab')), 'testing_lab'],
          [sequelize.col('m_seed_test_laboratory.lab_code'), 'lab_code'], 
          [sequelize.col('m_seed_test_laboratory.id'), 'id'],// Use explicit alias in the joined table's column
        ],

        raw: true,
        where: {
          state_code: req.body.stateCode,
          // lab_code: labCodes
        }
      });


      // console.log("Database Results:", dbResults);
      // console.log("mode*****", modifiedData);
      console.log("dbResults*****", dbResults);

   const finalResult = modifiedData.map(lab => {
    //   //   // Find the corresponding ID based on lab_code
    const matchingIdEntry = dbResults.find(entry => entry.lab_code === lab.lab_code);

    //     // Construct the new object, including the ID if found
     return {
          ...lab,
          id: matchingIdEntry ? matchingIdEntry.id : null // Include the ID if found
        };
      });

    //   // // Filtering out labs with lab_code 'NA' or if no ID was found
 const filteredResult = finalResult.filter(item => item.lab_code !== 'NA' && item.id !== null);

    console.log('Final Merged Result:', filteredResult);



      // Return the final data array as the response
      return response(res, status.DATA_AVAILABLE, 200, filteredResult);

    } catch (error) {
      console.error('Error:', error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  };


  

}
module.exports = StlForms
