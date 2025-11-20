

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
const cropModel = db.cropModel;
const varietyModel = db.varietyModel
const agencyDetailModel = db.agencyDetailModel
const designationModel = db.designationModel
const categoryModel = db.categoryModel
const bsp1Model = db.bsp1Model;
const bsp2Model = db.bsp2Model;
const bsp3Model = db.bsp3Model;
const bsp4Model = db.bsp4Model;
const bsp5aModel = db.bsp5aModel;
const bsp5bModel = db.bsp5bModel;
const bsp6Model = db.bsp6Model;
const cropVerietyModel = db.cropVerietyModel;
const nucleusSeedAvailabityModel = db.nucleusSeedAvailabityModel;
const freezeTimelineModel = db.freezeTimeline;
const bsp1ProductionCenter = db.bsp1ProductionCenter;
const plantDetailsModel = db.plantDetails;
const indentOfSpaModel = db.indentOfSpa;
const seasonModel = db.seasonModel;
const activitiesModel = db.activitiesModel;
const blockModel = db.blockModel;
const centralModel = db.centralModel
const alloallocationToIndentorProductionCenterSeed = db.allocationToIndentorProductionCenterSeed
const indentorLiftingModel = db.allocationtoIndentorliftingseeds
const { allocationToSPASeed, allocationToSPAProductionCenterSeed, indenterSPAModel, sectorModel, deleteIndenteOfSpaModel, deleteIndenteOfBreederSeedModel } = require('../models');
const seedLabTestModel = db.seedLabTestModel;
const bpctoPlant = db.bspctoplantModel;
const generatBillsModel = db.generateBills

const SeedUserManagement = require('../_helpers/create-user')
const labelNumberForBreederseed = db.labelNumberForBreederseed
const generatedLabelNumberModel = db.generatedLabelNumberModel
const cropGroupModel = db.cropGroupModel
const varietLineModel = db.varietLineModel
const sequelizer = require("../models/db");

const JWT = require('jsonwebtoken')
require('dotenv').config()
const Token = db.tokens;

const jwt = require('jsonwebtoken');

const sequelize = require('sequelize');
const ConditionCreator = require('../_helpers/condition-creator');
const { where } = require('sequelize');
const { condition } = require('sequelize');
const e = require('express');
const AES = require('../_helpers/AES');
const { raw } = require('body-parser');
const masterHelper = require('../_helpers/masterhelper');
const allocation_to_indentor_for_lifting_seedsModel = require('../models/allocation_to_indentor_for_lifting_seeds.model');
const paginateResponseRaw = require('../_utility/generate-otp');
const Op = require('sequelize').Op;
const { QueryTypes } = require("sequelize");
// const { sequelizes } = require("../../app")
class reportController {
  static getBillGenerateCertificateapiSecondyear = async (req, res) => {
    let data = {};
    try {
      let condition = {}
      condition = {
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('generate_bills.year')), 'year'],
        ]

      }
      condition.order = [[sequelize.col('generate_bills.year'), 'DESC']]
      data = await generatBillsModel.findAll(condition)

      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        return response(res, "Data Not Found", 200, {})
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getBillGenerateCertificateapiSecondSeason = async (req, res) => {
    let data = {};
    try {
      let condition = {}
      condition = {
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('generate_bills.season')), 'season'],
        ],
        where: {
          year: req.body.search.year
        }

      }
      condition.order = [[sequelize.col('generate_bills.season'), "ASC"]];
      data = await generatBillsModel.findAll(condition)

      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        return response(res, "Data Not Found", 200, {})
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getBillGenerateCertificateapiSecondCropType = async (req, res) => {
    let data = {};
    try {
      let condition = {}
      condition = {
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('generate_bills.crop_code')), 'crop_code'],
        ],
        where: {
          year: req.body.search.year,
          season: req.body.search.season,

        }

      }
      data = await generatBillsModel.findAll(condition)
      let crop_type = []
      if (data && data.length > 0) {
        data.forEach(element => {
          crop_type.push({
            crop_type: element && element.crop_code && (element.crop_code.substring(0, 1) == 'A') ? 'Agriculture' : 'Horticulture',

            crop_Value: element && element.crop_code && (element.crop_code.substring(0, 1) == 'A') ? 'A' : 'H'
          })
        });
      }

      let crop_typeData = masterHelper.removeDuplicates(crop_type, 'crop_Value')
      if (crop_typeData) {
        return response(res, status.DATA_AVAILABLE, 200, crop_typeData)
      } else {
        return response(res, "Data Not Found", 200, {})
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }


  static getBillGenerateCertificateapiSecondCropName = async (req, res) => {
    let data = {};
    try {
      let condition = {}
      condition = {
        include: [
          {
            model: cropModel,
            attributes: []
          }
        ],
        attributes: [
          [sequelize.col('generate_bills.crop_code'), 'crop_code'],
          [sequelize.col('m_crop.crop_name'), 'crop_name']
          // [sequelize.fn('DISTINCT', sequelize.col('generate_bills.crop_code')), 'crop_code'],
        ],
        group: [
          [sequelize.col('generate_bills.crop_code'), 'crop_code'],
          [sequelize.col('m_crop.crop_name'), 'crop_name']
        ],
        where: {
          year: req.body.search.year,
          season: req.body.search.season,
          crop_code: {
            [Op.like]: req.body.search.crop_type + '%'
          }

        }

      }
      data = await generatBillsModel.findAll(condition)


      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        return response(res, "Data Not Found", 200, {})
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static getBillGenerateCertificateapiSecondVarietyName = async (req, res) => {
    let data = {};
    try {
      let condition = {}
      condition = {
        include: [

          {
            model: varietyModel,
            attributes: []
          }
        ],
        attributes: [
          [sequelize.col('generate_bills.variety_id'), 'variety_id'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name']
          // [sequelize.fn('DISTINCT', sequelize.col('generate_bills.crop_code')), 'crop_code'],
        ],
        group: [
          [sequelize.col('generate_bills.variety_id'), 'variety_id'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name']
        ],
        where: {
          year: req.body.search.year,
          season: req.body.search.season,
          [Op.and]: [
            {
              crop_code: {
                [Op.like]: req.body.search.crop_type + '%'
              },

            },
            {
              crop_code: {
                [Op.in]: req.body.search.crop_code
              }

            }

          ]


        },

      }
      data = await generatBillsModel.findAll(condition)


      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        return response(res, "Data Not Found", 200, {})
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getbspcAssignCropReports = async (req, res) => {
    let data = {};
    try {
      let condition = {}
      let filters = await ConditionCreator.filters(req.body.search);
      condition = {
        where: filters,
        include: [
          {
            model: cropModel,
            attributes: [],
          },
          {
            model: db.breederCropsVerietiesModel,
            include: {
              model: varietyModel,
              attributes: [],
            },
            attributes: [],
            where: {

            }
          },

          {
            model: userModel,
            include: [{
              model: agencyDetailModel,
              attributes: [],
              // attributes: ['agency_name','id']
            },
            ],

            attributes: ['name'],
            // where: {
            //   id: {
            //     [Op.in]: sequelize.literal(` (SELECT users.id as id from users LEFT OUTER JOIN "agency_details" AS "agency_details" ON "agency_details"."user_id" = "users"."id" WHERE state_id = ${req.body.loginedUserid.state_id} AND user_type = 'SPA')`)
            //   }
            // },
          }
        ],
        attributes: [
          [sequelize.col('breeder_crops.crop_code'), 'crop_code'],
          [sequelize.col('breeder_crops.year'), 'year'],
          [sequelize.col('breeder_crops.season'), 'season'],
          [sequelize.col('breeder_crops.production_center_id'), 'production_center_id'],
          [sequelize.col('m_crop.crop_name'), 'crop_name'],
          [sequelize.col('breeder_crops_veriety->m_crop_variety.variety_code'), 'variety_code'],
          [sequelize.col('breeder_crops_veriety->m_crop_variety.variety_name'), 'variety_name'],
          [sequelize.col('breeder_crops_veriety->m_crop_variety.id'), 'variety_id'],
          [sequelize.col('breeder_crops_veriety->m_crop_variety.not_date'), 'not_date'],
          [sequelize.col('user->agency_detail.agency_name'), 'agency_name'],
          [sequelize.col('user->agency_detail.id'), 'agency_id'],
          [sequelize.col('user->agency_detail.state_id'), 'state_code'],
          // [sequelize.col('user->agency_detail.agency_name'), 'state_code'],
          [sequelize.col('user.spa_code'), "spa_code"],
          [sequelize.col('user.name'), "name"],
        ],
      };
      data = await db.breederCropModel.findAll(condition);
      let filteredData = []
      data.forEach(el => {
        const spaIndex = filteredData.findIndex(item => item.year_of_indent === el.dataValues.year);
        if (spaIndex === -1) {
          filteredData.push({

            "crop_type": el && (el.crop_code.substring(0, 1) == 'A') ? 'Agriculture' : 'Horticulture',
            "year_of_indent": el && el.dataValues.year ? el.dataValues.year : '',
            "season": el && el.dataValues.season ? el.dataValues.season : '',
            "name": el && el.dataValues && el.dataValues.agency_name ? el.dataValues.agency_name : '',
            "bspc_count": 1,
            "total_spa_count": 1,
            "bspc": [
              {
                "crop_name": el && el.dataValues.crop_name ? el.dataValues.crop_name : '',
                "crop_code": el && el.crop_code ? el.crop_code : '',
                "spa_count": 1,
                "variety": [
                  {
                    "variety_id": el && el.dataValues && el.dataValues.variety_id ? el.dataValues.variety_id : '',
                    "variety_code": el && el.dataValues && el.dataValues.variety_code ? el.dataValues.variety_code : '',
                    "variety_name": el && el.dataValues && el.dataValues.variety_name ? el.dataValues.variety_name : '',

                  }
                ]
              }
            ]
          });
        } else {
          const cropIndex = filteredData[spaIndex].bspc.findIndex(item => item.crop_code == el.dataValues.crop_code);
          if (cropIndex !== -1) {

            filteredData[spaIndex].bspc[cropIndex].variety.push(
              {
                "variety_id": el && el.dataValues && el.dataValues.variety_id ? el.dataValues.variety_id : '',
                "variety_code": el && el.dataValues && el.dataValues.variety_code ? el.dataValues.variety_code : '',
                "variety_name": el && el.dataValues && el.dataValues.variety_name ? el.dataValues.variety_name : '',

              }
            )


          } else {
            filteredData[spaIndex].bspc.push({
              "crop_name": el && el.dataValues.crop_name ? el.dataValues.crop_name : '',
              "crop_code": el && el.crop_code ? el.crop_code : '',
              "spa_count": 1,
              "variety": [
                {
                  "variety_id": el && el.dataValues && el.dataValues.variety_id ? el.dataValues.variety_id : '',
                  "variety_code": el && el.dataValues && el.dataValues.variety_code ? el.dataValues.variety_code : '',
                  "variety_name": el && el.dataValues && el.dataValues.variety_name ? el.dataValues.variety_name : '',
                }
              ]
            });
          }
        }
      });
      if (filteredData) {
        filteredData.forEach(element => {
          let sum = 0;
          element.bspc.forEach(item => {
            element.total_spa_count = element.bspc.length + item.variety.length
            sum += element.total_spa_count;
            element.sum = sum;
            item.spa_count = item.variety.length
          })

        })
        return response(res, status.DATA_AVAILABLE, 200, filteredData)
      } else {
        return response(res, "Data Not Found", 200, {})
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static getAssignBreederCropsyear = async (req, res) => {
    let data = {};
    try {
      let condition = {}
      condition = {
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('breeder_crops.year')), 'year'],
        ]

      }
      condition.order = [
        [sequelize.col('breeder_crops.year'), 'DESC']
      ]
      data = await db.breederCropModel.findAll(condition)

      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        return response(res, "Data Not Found", 200, {})
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getAssignBreederCropsSeason = async (req, res) => {
    let data = {};
    try {
      let condition = {}
      condition = {
        include: [
          // {
          //   model: seasonModel,

          // }
        ],

        attributes: [
          'season'
          // [sequelize.col('generate_bills.season'),'season']
          // [sequelize.fn('DISTINCT', sequelize.col('generate_bills.season')), 'season'],
          // [sequelize.col('breeder_crops.season'),'season']
          // [sequelize.fn('DISTINCT', sequelize.col('breeder_crops.season')), 'season'],
        ],
        group: [
          'season'
        ],
        raw: true,
        where: {
          year: req.body.search.year
        }

      }
      condition.order = [
        [sequelize.col('season'), 'ASC']
      ]
      data = await db.breederCropModel.findAll(condition)

      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        return response(res, "Data Not Found", 200, {})
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getAssignBreederCropType = async (req, res) => {
    let data = {};
    try {
      let condition = {}
      condition = {
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('breeder_crops.crop_code')), 'crop_code'],
        ],
        where: {
          year: req.body.search.year,
          season: req.body.search.season,

        }

      }
      data = await db.breederCropModel.findAll(condition)
      let crop_type = []
      if (data && data.length > 0) {
        data.forEach(element => {
          crop_type.push({
            crop_type: element && element.crop_code && (element.crop_code.substring(0, 1) == 'A') ? 'Agriculture' : 'Horticulture',

            crop_Value: element && element.crop_code && (element.crop_code.substring(0, 1) == 'A') ? 'A' : 'H'
          })
        });
      }

      if (crop_type) {
        return response(res, status.DATA_AVAILABLE, 200, crop_type)
      } else {
        return response(res, "Data Not Found", 200, {})
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getAssignBreederCropBspc = async (req, res) => {
    let data = {};
    try {
      let condition = {}
      condition = {
        include: [
          {
            model: userModel,
            where: {
              [Op.and]: [
                { name: { [Op.ne]: null } },

                { name: { [Op.ne]: "" } },
                // { name: { [Op.ne]: undefined } },
              ]
            },
            include: [
              {
                model: agencyDetailModel,



                // attributes: ['name']
              },

            ]
          }
        ],
        attributes: [
          [sequelize.col('breeder_crops.production_center_id'), 'production_center_id'],
          [sequelize.col('user->agency_detail.agency_name'), 'agency_name'],

          // [sequelize.fn('DISTINCT', sequelize.col('breeder_crops.production_center_id')), 'production_center_id'],
        ],
        group: [
          [sequelize.col('breeder_crops.production_center_id'), 'production_center_id'],
          [sequelize.col('user->agency_detail.agency_name'), 'agency_name'],
          [sequelize.col('user.id'), 'user_id'],
          [sequelize.col('user->agency_detail.id'), 'agency_id'],
        ],
        where: {
          year: req.body.search.year,
          season: req.body.search.season,
          crop_code: {
            [Op.like]: req.body.search.crop_type + '%'
          }
        }
      }
      condition.order = [
        [sequelize.col('user->agency_detail.agency_name'), 'ASC']
      ]
      data = await db.breederCropModel.findAll(condition)
      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        return response(res, "Data Not Found", 200, {})
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static getAssignBreederCropName = async (req, res) => {
    let data = {};
    try {
      let condition = {}
      condition = {
        include: [
          {
            model: cropModel,

          }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('breeder_crops.crop_code')), 'crop_code'],
        ],
        where: {
          year: req.body.search.year,
          season: req.body.search.season,
          crop_code: {
            [Op.like]: req.body.search.crop_type + '%'
          },
          production_center_id: req.body.search.production_center_id,
        },
        raw: true,
      }

      condition.order = [
        [sequelize.col('m_crop.crop_name'), 'ASC']
      ]

      data = await db.breederCropModel.findAll(condition)
      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        return response(res, "Data Not Found", 200, {})
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getlotNumberyear = async (req, res) => {
    let data = {};
    try {
      let condition = {}
      condition = {
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('lot_number_creations.year')), 'year'],
        ]

      }
      condition.order = [[sequelize.col('lot_number_creations.year'), 'DESC']]
      data = await db.lotNumberModel.findAll(condition)


      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        return response(res, "Data Not Found", 200, {})
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getlotNumberSeason = async (req, res) => {
    let data = {};
    try {
      let condition = {}
      condition = {
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('lot_number_creations.season')), 'season'],
        ],
        where: {
          year: req.body.search.year
        }

      }
      data = await db.lotNumberModel.findAll(condition)

      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        return response(res, "Data Not Found", 200, {})
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static getlotNumberCropType = async (req, res) => {
    let data = {};
    try {
      let condition = {}
      condition = {
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('lot_number_creations.crop_code')), 'crop_code'],
        ],
        where: {
          year: req.body.search.year,
          season: req.body.search.season,

        }

      }
      condition.order = [[sequelize.col('lot_number_creations.crop_code'), 'ASC']]
      data = await db.lotNumberModel.findAll(condition)
      let crop_type = []
      if (data && data.length > 0) {
        data.forEach(element => {
          crop_type.push({
            crop_type: element && element.crop_code && (element.crop_code.substring(0, 1) == 'A') ? 'Agriculture' : 'Horticulture',

            crop_Value: element && element.crop_code && (element.crop_code.substring(0, 1) == 'A') ? 'A' : 'H'
          })
        });
      }

      if (crop_type) {
        return response(res, status.DATA_AVAILABLE, 200, crop_type)
      } else {
        return response(res, "Data Not Found", 200, {})
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getlotNumberCropName = async (req, res) => {
    let data = {};
    try {
      let condition = {}
      condition = {
        include: [
          {
            model: cropModel,
            attributes: [
              'crop_name'
            ]

          }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('lot_number_creations.crop_code')), 'crop_code'],
        ],
        where: {
          year: req.body.search.year,
          season: req.body.search.season,
          crop_code: {
            [Op.like]: req.body.search.crop_type + '%'
          },
          // production_center_id: req.body.search.production_center_id,
        },
        raw: true,
      }
      condition.order = [[sequelize.col('m_crop.crop_name'), 'ASC']]

      data = await db.lotNumberModel.findAll(condition)
      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        return response(res, "Data Not Found", 200, {})
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static getlotNumberVarietyName = async (req, res) => {
    let data = {};
    try {
      let condition = {}
      condition = {
        include: [
          {
            model: varietyModel,
            attributes: ['variety_name']

          }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('lot_number_creations.variety_id')), 'variety_id'],
        ],
        where: {
          year: req.body.search.year,
          season: req.body.search.season,
          crop_code: req.body.search.crop_code,
        },
        raw: true,
      }
      condition.order = [[sequelize.col('m_crop_variety.variety_name'), 'ASC']]

      data = await db.lotNumberModel.findAll(condition)
      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        return response(res, "Data Not Found", 200, {})
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getlotNumberforseedtestingreport = async (req, res) => {
    let data = {};
    try {
      let condition = {}
      condition = {

        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('lot_number_creations.lot_number')), 'lot_number'],
          [sequelize.col('lot_number_creations.id'), 'lot_id']
        ],
        where: {
          year: req.body.search.year,
          season: req.body.search.season,
          crop_code: req.body.search.crop_code,
          variety_id: req.body.search.variety_id
        },
        raw: true,
      }

      data = await db.lotNumberModel.findAll(condition)
      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        return response(res, "Data Not Found", 200, {})
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getReportstatusforseedtestingreport = async (req, res) => {
    let data = {};
    try {
      let condition = {}
      condition = {
        include: [
          {
            model: db.seedTestingReportsModel,
            attributes: []
          }
        ],

        attributes: [
          // [sequelize.fn('DISTINCT', sequelize.col('lot_number_creations.lot_number')), 'lot_number'],
          [sequelize.col('seed_testing_report.is_report_pass'), 'is_report_pass']
        ],
        where: {
          year: req.body.search.year,
          season: req.body.search.season,
          crop_code: req.body.search.crop_code,
          variety_id: req.body.search.variety_id,
          id: req.body.search.lot_id
        },
        raw: true,
      }

      data = await db.lotNumberModel.findAll(condition)
      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        return response(res, "Data Not Found", 200, {})
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static getCropWiseAssignVarieties = async (req, res) => {
    let data = {};
    try {
      let condition = {}
      let filters = await ConditionCreator.filters(req.body.search);
      if (req.body.search && req.body.search.variety_id_crop_wise && (req.body.search.variety_id_crop_wise.length > 0)) {
        condition = {
          where: filters,
          include: [
            {
              model: cropModel,
              attributes: [],
            },
            {
              model: db.breederCropsVerietiesModel,
              where: {
                variety_id: req.body.search.variety_id_crop_wise
              },
              include: {
                model: varietyModel,
                attributes: [],
              },
              attributes: [],

            },

            {
              model: userModel,
              include: [{
                model: agencyDetailModel,
                attributes: [],
                // attributes: ['agency_name','id']
              },
              ],

              attributes: ['name'],
              // where: {
              //   id: {
              //     [Op.in]: sequelize.literal(` (SELECT users.id as id from users LEFT OUTER JOIN "agency_details" AS "agency_details" ON "agency_details"."user_id" = "users"."id" WHERE state_id = ${req.body.loginedUserid.state_id} AND user_type = 'SPA')`)
              //   }
              // },
            }
          ],
          attributes: [
            [sequelize.col('breeder_crops.crop_code'), 'crop_code'],
            [sequelize.col('breeder_crops.year'), 'year'],
            [sequelize.col('breeder_crops.season'), 'season'],
            [sequelize.col('breeder_crops.production_center_id'), 'production_center_id'],
            [sequelize.col('m_crop.crop_name'), 'crop_name'],
            [sequelize.col('breeder_crops_veriety->m_crop_variety.variety_code'), 'variety_code'],
            [sequelize.col('breeder_crops_veriety->m_crop_variety.variety_name'), 'variety_name'],
            [sequelize.col('breeder_crops_veriety->m_crop_variety.id'), 'variety_id'],
            [sequelize.col('breeder_crops_veriety->m_crop_variety.not_date'), 'not_date'],
            [sequelize.col('user->agency_detail.agency_name'), 'agency_name'],
            [sequelize.col('user->agency_detail.id'), 'agency_id'],
            [sequelize.col('user->agency_detail.state_id'), 'state_code'],
            // [sequelize.col('user->agency_detail.agency_name'), 'state_code'],
            [sequelize.col('user.spa_code'), "spa_code"],
            [sequelize.col('user.name'), "name"],
          ],
        }
      } else {
        condition = {
          where: filters,
          include: [
            {
              model: cropModel,
              attributes: [],
            },
            {
              model: db.breederCropsVerietiesModel,
              include: {
                model: varietyModel,
                attributes: [],
              },
              attributes: [],
            },
            {
              model: userModel,
              include: [{
                model: agencyDetailModel,
                attributes: [],
                // attributes: ['agency_name','id']
              },
              ],

              attributes: ['name'],
              // where: {
              //   id: {
              //     [Op.in]: sequelize.literal(` (SELECT users.id as id from users LEFT OUTER JOIN "agency_details" AS "agency_details" ON "agency_details"."user_id" = "users"."id" WHERE state_id = ${req.body.loginedUserid.state_id} AND user_type = 'SPA')`)
              //   }
              // },
            }
          ],
          attributes: [
            [sequelize.col('breeder_crops.crop_code'), 'crop_code'],
            [sequelize.col('breeder_crops.year'), 'year'],
            [sequelize.col('breeder_crops.season'), 'season'],
            [sequelize.col('breeder_crops.production_center_id'), 'production_center_id'],
            [sequelize.col('m_crop.crop_name'), 'crop_name'],
            [sequelize.col('breeder_crops_veriety->m_crop_variety.variety_code'), 'variety_code'],
            [sequelize.col('breeder_crops_veriety->m_crop_variety.variety_name'), 'variety_name'],
            [sequelize.col('breeder_crops_veriety->m_crop_variety.id'), 'variety_id'],
            [sequelize.col('breeder_crops_veriety->m_crop_variety.not_date'), 'not_date'],
            [sequelize.col('user->agency_detail.agency_name'), 'agency_name'],
            [sequelize.col('user->agency_detail.id'), 'agency_id'],
            [sequelize.col('user->agency_detail.state_id'), 'state_code'],
            // [sequelize.col('user->agency_detail.agency_name'), 'state_code'],
            [sequelize.col('user.spa_code'), "spa_code"],
            [sequelize.col('user.name'), "name"],
            [sequelize.col('user.id'), "agency_user_id"],
          ],
        }
      }
      data = await db.breederCropModel.findAll(condition)
      let filteredData = []
      data.forEach(el => {
        const spaIndex = filteredData.findIndex(item => item.year_of_indent === el.dataValues.year);
        if (spaIndex === -1) {
          filteredData.push({
            "year_of_indent": el && el.dataValues.year ? el.dataValues.year : '',
            "season": el && el.dataValues.season ? el.dataValues.season : '',
            "crop_type": el && (el.crop_code.substring(0, 1) == 'A') ? 'Agriculture' : 'Horticulture',
            "crop_count": 1,
            "crops": [
              {
                "crop_name": el && el.dataValues.crop_name ? el.dataValues.crop_name : '',
                "crop_code": el && el.crop_code ? el.crop_code : '',
                "variety_count": 1,
                "varieties": [
                  {
                    "variety_id": el && el.dataValues && el.dataValues.variety_id ? el.dataValues.variety_id : '',
                    "variety_name": el && el.dataValues && el.dataValues.variety_name ? el.dataValues.variety_name : '',
                    "bspc_count": 1,
                    "bspc": [
                      {
                        "name": el && el.dataValues && el.dataValues.agency_name ? el.dataValues.agency_name : '',
                        "agency_user_id": el && el.dataValues && el.dataValues.agency_user_id ? el.dataValues.agency_user_id : '',
                      }
                    ]
                  }
                ]
              }
            ]
          });
        }
        else {
          const cropIndex = filteredData[spaIndex].crops.findIndex(item => item.crop_code === el.crop_code);
          if (cropIndex != -1) {
            const spadataIndex = filteredData[spaIndex].crops[cropIndex].varieties.findIndex(item => item.variety_id === el.dataValues.variety_id);
            if (spadataIndex != -1) {
              filteredData[spaIndex].crops[cropIndex].varieties[spadataIndex].bspc.push(
                {
                  "name": el && el.dataValues && el.dataValues.agency_name ? el.dataValues.agency_name : '',
                  "agency_user_id": el && el.dataValues && el.dataValues.agency_user_id ? el.dataValues.agency_user_id : '',
                }
              )
            } else {

              filteredData[spaIndex].crops[cropIndex].varieties.push(
                {
                  "variety_id": el && el.dataValues && el.dataValues.variety_id ? el.dataValues.variety_id : '',
                  "variety_name": el && el.dataValues && el.dataValues.variety_name ? el.dataValues.variety_name : '',
                  "bspc_count": 1,
                  "bspc": [
                    {
                      "name": el && el.dataValues && el.dataValues.agency_name ? el.dataValues.agency_name : '',
                      "agency_user_id": el && el.dataValues && el.dataValues.agency_user_id ? el.dataValues.agency_user_id : '',
                    }
                  ]
                }
              )
            }

          }
          else {
            filteredData[spaIndex].crops.push(
              {
                "crop_name": el && el.dataValues.crop_name ? el.dataValues.crop_name : '',
                "crop_code": el && el.crop_code ? el.crop_code : '',
                "variety_count": 1,
                "varieties": [
                  {
                    "variety_id": el && el.dataValues && el.dataValues.variety_id ? el.dataValues.variety_id : '',
                    "variety_name": el && el.dataValues && el.dataValues.variety_name ? el.dataValues.variety_name : '',
                    "bspc_count": 1,
                    "bspc": [
                      {
                        "name": el && el.dataValues && el.dataValues.agency_name ? el.dataValues.agency_name : '',
                        "agency_user_id": el && el.dataValues && el.dataValues.agency_user_id ? el.dataValues.agency_user_id : '',
                      }
                    ]
                  }
                ]
              }
            )
          }
        }
      });
      if (filteredData) {
        filteredData.forEach(element => {
          element.crops.forEach(item => {
            let sum = 0;



            item.varieties.forEach(elm => {
              element.crop_count = element.crops.length + item.varieties.length + elm.bspc.length;
              sum += element.crop_count;
              element.crop_counts = sum;
              item.variety_count = item.varieties.length + elm.bspc.length
              elm.bspc_count = elm.bspc.length
            })
          })

        })

        return response(res, status.DATA_AVAILABLE, 200, filteredData)
      } else {
        return response(res, "Data Not Found", 200, {})
      }

    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getbspcVarietyName = async (req, res) => {
    let data = {};
    try {
      let cropCodeValue;
      if (req.body && req.body.search) {
        if (req.body.search.crop_code_new && req.body.search.crop_code_new !== undefined && req.body.search.crop_code_new.length > 0) {
          cropCodeValue = {
            crop_code: {
              [Op.in]: req.body.search.crop_code_new
            }
          }
        }
        if (req.body.search.crop_code) {
          cropCodeValue = {
            crop_code: req.body.search.crop_code
          }
        }
      }
      let condition = {}
      condition = {
        include: [
          {
            model: db.breederCropsVerietiesModel,
            attributes: [],
            include: [
              {
                model: varietyModel,
                attributes: ['variety_name']
              }
            ]

          },
        ],
        // attributes:[],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('breeder_crops_veriety.variety_id')), 'variety_id'],
        ],
        where: {
          year: req.body.search.year,
          season: req.body.search.season,
          // crop_code: req.body.search.crop_code,
          ...cropCodeValue
        },
        raw: true,
      }
      condition.order = [[sequelize.col('breeder_crops_veriety->m_crop_variety.variety_name'), 'ASC']]

      data = await db.breederCropModel.findAll(condition)
      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        return response(res, "Data Not Found", 200, {})
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }

  }
  static getMasterBspTwoReportDataSecond = async (req, res) => {
    let returnResponse = {};
    try {

      let condition = {
        include: [
          {
            model: bsp1Model,
            attributes: [],
            include: [
              {
                model: bsp1ProductionCenter,
                required: true,
                attributes: [],
                include: [
                  {
                    model: userModel,
                    required: true,
                    attributes: [],

                  },
                ]
              },
              {
                model: indentOfBreederseedModel,
                required: true,
                attributes: [],
                where: {
                }
              },
            ]
          },
          {
            model: cropVerietyModel,
            required: true,
            attributes: [],
            where: {}
          },
          {
            model: cropModel,
            required: true,
            attributes: [],
            where: {}
          },
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('bsp_1->bsp1_production_centers->user.name')), 'bspc_name'],
          [sequelize.col('bsp_1->bsp1_production_centers->user.id'), 'bspc_user_id'],
          [sequelize.col('bsp_2.variety_id'), 'variety_id'],
          [sequelize.col('bsp_2.field_location'), 'field_location'],
          [sequelize.col('bsp_2.area'), 'area'],
          [sequelize.col('bsp_2.season'), 'season'],
          [sequelize.col('bsp_2.crop_code'), 'crop_code'],
          [sequelize.col('m_crop.crop_name'), 'crop_name'],
          [sequelize.col('bsp_2.year'), 'year'],
          [sequelize.col('bsp_2.expected_production'), 'expected_production'],
          [sequelize.col('bsp_2.expected_harvest_to'), 'expected_harvest_to'],
          [sequelize.col('bsp_2.expected_harvest_from'), 'expected_harvest_from'],
          [sequelize.col('bsp_2.expected_inspection_from'), 'expected_inspection_from'],
          [sequelize.col('bsp_2.expected_inspection_to'), 'expected_inspection_to'],
          [sequelize.col('bsp_2.expected_availbility'), 'expected_availbility'],
          [sequelize.col('bsp_2.location_availbility_seed'), 'location_availbility_seed'],
          [sequelize.fn('SUM', sequelize.col('bsp_1->bsp1_production_centers.quantity_of_seed_produced')), 'quantity_of_seed_produced'],
          [sequelize.col('bsp_1->indent_of_breederseed".indent_quantity'), 'indent_quantity'],
          [sequelize.col('m_crop_variety.variety_code'), 'variety_code'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
        ],
        group: [
          [sequelize.col('bsp_2.variety_id'), 'variety_id'],
          [sequelize.col('bsp_2.field_location'), 'field_location'],
          [sequelize.col('bsp_1->bsp1_production_centers->user.id'), 'bspc_user_id'],
          [sequelize.col('bsp_2.area'), 'area'],
          [sequelize.col('bsp_2.expected_production'), 'expected_production'],
          [sequelize.col('bsp_2.expected_harvest_to'), 'expected_harvest_to'],
          [sequelize.col('bsp_2.expected_inspection_from'), 'expected_inspection_from'],
          [sequelize.col('bsp_2.expected_inspection_to'), 'expected_inspection_to'],
          [sequelize.col('bsp_2.expected_harvest_from'), 'expected_harvest_from'],
          [sequelize.col('bsp_2.expected_availbility'), 'expected_availbility'],
          [sequelize.col('bsp_2.season'), 'season'],
          [sequelize.col('bsp_2.crop_code'), 'crop_code'],
          [sequelize.col('m_crop.crop_name'), 'crop_name'],
          [sequelize.col('bsp_2.year'), 'year'],
          [sequelize.col('bsp_1->indent_of_breederseed".indent_quantity'), 'indent_quantity'],
          [sequelize.col('bsp_1->bsp1_production_centers->user.name'), 'bspc_name'],
          [sequelize.col('bsp_1->bsp1_production_centers.quantity_of_seed_produced'), 'quantity_of_seed_produced'],
          [sequelize.col('m_crop_variety.variety_code'), 'variety_code'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [sequelize.col('bsp_2.location_availbility_seed'), 'location_availbility_seed'],
        ],
        where: {},
        raw: true
      }
      if (req.body.search) {
        if (req.body.search.year) {
          condition.where.year = req.body.search.year
        }
        if (req.body.search.season) {
          condition.where.season = req.body.search.season
        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = req.body.search.crop_code
        }
        if (req.body.search.crop != undefined && req.body.search.crop.length > 0) {
          condition.where.crop_code = { [Op.in]: req.body.search.crop }
        }
        if (req.body.search.crop_type) {
          condition.where.crop_code = {
            [Op.like]: req.body.search.crop_type + "%",
          }
        }

        if (req.body.search.breeder) {
          condition.include[0].where.breeder_id = req.body.search.breeder
        }

        if (req.body.search.variety != undefined && req.body.search.variety.length > 0) {
          // console.log('req.body.search.variety_code=====',req.body.search.variety)
          condition.include[1].where.variety_code = { [Op.in]: req.body.search.variety }
        }
      }

      let bsp2Data = await bsp2Model.findAll(condition);

      returnResponse = bsp2Data;

      let data = [] = returnResponse;
      let dataSet = [];
      let dataSet2 = [];
      let filterData = []
      bsp2Data.forEach((el, index) => {
        console.log(el)
        const cropIndex = filterData.findIndex(item => item.crop_code == el.crop_code);
        if (cropIndex == -1) {
          filterData.push(
            {
              "crop_name": el && el.crop_name ? el.crop_name : '',
              "crop_code": el && el.crop_code ? el.crop_code : '',
              "variety_count": 1,
              "variety":
                [

                  {
                    "variety_name": el && el.variety_name ? el.variety_name : '',
                    "variety_id": el && el.variety_id ? el.variety_id : '',
                    "variety_code": el && el.variety_code ? el.variety_code : '',
                    indent_quantity: el && el.indent_quantity ? el.indent_quantity : '',
                    "bspc_count": 1,
                    "bspc": [
                      {
                        name: el && el.bspc_name && el.bspc_name ? el.bspc_name : '',
                        field_location: el && el.field_location && el.field_location ? el.field_location : '',
                        expected_production: el && el.expected_production && el.expected_production ? el.expected_production : '0',
                        expected_harvest_to: el && el.expected_harvest_to && el.expected_harvest_to ? el.expected_harvest_to : '',
                        expected_harvest_from: el && el.expected_harvest_from && el.expected_harvest_from ? el.expected_harvest_from : '',
                        expected_inspection_from: el && el.expected_inspection_from && el.expected_inspection_from ? el.expected_inspection_from : '',
                        expected_inspection_to: el && el.expected_inspection_to && el.expected_inspection_to ? el.expected_inspection_to : '',
                        quantity_of_seed_produced: el && el.quantity_of_seed_produced && el.quantity_of_seed_produced ? el.quantity_of_seed_produced : '',
                        location_availbility_seed: el && el.location_availbility_seed && el.location_availbility_seed ? el.location_availbility_seed : '',
                        "crop_code": el && el.crop_code ? el.crop_code : '',
                        "variety_id": el && el.variety_id ? el.variety_id : '',
                        bspc_id: el && el.bspc_user_id ? el.bspc_user_id : '',
                        expected_availbility: el && el.expected_availbility ? el.expected_availbility : '',
                        area: el && el.area ? el.area : '',

                      }
                    ]
                  }
                ]
            }
          )
        }
        else {
          const varietyIndex = filterData[cropIndex].variety.findIndex(item => item.variety_id === el.variety_id);
          if (varietyIndex != -1) {
            // const bspcIndex = filterData[cropIndex].variety[varietyIndex].bspc.findIndex(item => item.bspc_id === el.bspc[index].bspc_id); 
            filterData[cropIndex].variety[varietyIndex].bspc.push(
              {
                name: el && el.bspc_name && el.bspc_name ? el.bspc_name : '',
                field_location: el && el.field_location && el.field_location ? el.field_location : '',
                expected_production: el && el.expected_production && el.expected_production ? el.expected_production : '0',
                expected_harvest_to: el && el.expected_harvest_to && el.expected_harvest_to ? el.expected_harvest_to : '',
                expected_harvest_from: el && el.expected_harvest_from && el.expected_harvest_from ? el.expected_harvest_from : '',
                expected_inspection_from: el && el.expected_inspection_from && el.expected_inspection_from ? el.expected_inspection_from : '',
                expected_inspection_to: el && el.expected_inspection_to && el.expected_inspection_to ? el.expected_inspection_to : '',
                quantity_of_seed_produced: el && el.quantity_of_seed_produced && el.quantity_of_seed_produced ? el.quantity_of_seed_produced : '',
                "crop_code": el && el.crop_code ? el.crop_code : '',
                "variety_id": el && el.variety_id ? el.variety_id : '',
                location_availbility_seed: el && el.location_availbility_seed && el.location_availbility_seed ? el.location_availbility_seed : '',
                bspc_id: el && el.bspc_user_id ? el.bspc_user_id : '',
                expected_inspection_from: el && el.expected_inspection_from && el.expected_inspection_from ? el.expected_inspection_from : '',
                //  expected_production :el && el.expected_harvest_from   ? el.expected_harvest_from  :'',
                expected_availbility: el && el.expected_availbility ? el.expected_availbility : '',
                area: el && el.area ? el.area : '',
              }
            )



          }


          else {
            filterData[cropIndex].variety.push(
              {
                "variety_name": el && el.variety_name ? el.variety_name : '',
                "variety_id": el && el.variety_id ? el.variety_id : '',
                "variety_code": el && el.variety_code ? el.variety_code : '',
                indent_quantity: el && el.indent_quantity ? el.indent_quantity : '',
                "bspc_count": 1,
                "bspc": [
                  {
                    name: el && el.bspc_name && el.bspc_name ? el.bspc_name : '',
                    field_location: el && el.field_location && el.field_location ? el.field_location : '',
                    expected_production: el && el.expected_production && el.expected_production ? el.expected_production : '0',
                    expected_harvest_from: el && el.expected_harvest_from && el.expected_harvest_from ? el.expected_harvest_from : '',
                    expected_inspection_from: el && el.expected_inspection_from && el.expected_inspection_from ? el.expected_inspection_from : '',
                    expected_inspection_to: el && el.expected_inspection_to && el.expected_inspection_to ? el.expected_inspection_to : '',
                    expected_harvest_to: el && el.expected_harvest_to && el.expected_harvest_to ? el.expected_harvest_to : '',
                    quantity_of_seed_produced: el && el.quantity_of_seed_produced && el.quantity_of_seed_produced ? el.quantity_of_seed_produced : '',
                    "crop_code": el && el.crop_code ? el.crop_code : '',
                    "variety_id": el && el.variety_id ? el.variety_id : '',
                    bspc_id: el && el.bspc_user_id ? el.bspc_user_id : '',
                    location_availbility_seed: el && el.location_availbility_seed && el.location_availbility_seed ? el.location_availbility_seed : '',
                    expected_availbility: el && el.expected_availbility ? el.expected_availbility : '',
                    area: el && el.area ? el.area : '',
                  }
                ]
              }
            )
          }
        }

      });
      // const abc = data.map(element => {

      //   if (dataSet.hasOwnProperty(element['variety_id'])) {
      //     dataSet[element['variety_id']]['bspc'] = [...dataSet[element['variety_id']]['bspc'],
      //     {
      //       ...{
      //         name: element['bspc_name'], available_nucleus_seed: (element['quantity']),
      //         allocation_qnt: (element['quantity_of_seed_produced']),
      //         area: (element['area']),
      //         filed_location: (element['field_location']),
      //         expected_production: (element['expected_production']),
      //         expected_harvest_to: (element['expected_harvest_to']),
      //         expected_availbility: (element['expected_availbility']),
      //         expected_production: (element['expected_production']),
      //         indent_quantity: (element['indent_quantity']),
      //         bspc_user_id:(element['bspc_user_id'])
      //       }
      //     }]
      //   } else {
      //     dataSet[element['variety_id']] = element;
      //     dataSet[element['variety_id']]['bspc'] = [{
      //       name: element['bspc_name'], available_nucleus_seed: (element['quantity']), allocation_qnt: (element['quantity_of_seed_produced']), area: (element['area']),
      //       filed_location: (element['field_location']),
      //       expected_production: (element['expected_production']),
      //       expected_harvest_to: (element['expected_harvest_to']),
      //       expected_availbility: (element['expected_availbility']),
      //       expected_production: (element['expected_production']),
      //       indent_quantity: (element['indent_quantity']),
      //       bspc_user_id:(element['bspc_user_id'])
      //     }]
      //   }
      //   return dataSet2;
      // })
      // let finaleData = {}
      // const abc1 = data.map(element => {

      //   if (element.hasOwnProperty('bspc')) {
      //     finaleData = [{ ...finaleData }, { ...element }]
      //     return element;
      //   }
      // })
      return response(res, status.DATA_AVAILABLE, 200, filterData);

    } catch (error) {
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse)
    }
  }

  static getbspthreeYearofIndent = async (req, res) => {
    let returnResponse = {};
    try {

      let condition = {
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('bsp_3.year')), 'year'],
        ],
        where: {},
        raw: true
      }
      condition.order = [[sequelize.col('bsp_3.year'), 'DESC']]


      let bsp2Data = await bsp3Model.findAll(condition);
      if (bsp2Data) {

        return response(res, status.DATA_AVAILABLE, 200, bsp2Data);
      } else {
        return response(res, status.DATA_AVAILABLE, 200, {});
      }


    } catch (error) {
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse)
    }
  }

  static getbspthreeSeason = async (req, res) => {
    let returnResponse = {};
    try {
      let filters = ConditionCreator.filters(req.body.search)
      let condition = {
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('bsp_3.season')), 'season'],
        ],
        where: filters,
        raw: true
      }


      let bsp2Data = await bsp3Model.findAll(condition);
      if (bsp2Data) {

        return response(res, status.DATA_AVAILABLE, 200, bsp2Data);
      } else {
        return response(res, status.DATA_AVAILABLE, 200, {});
      }


    } catch (error) {
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse)
    }
  }
  static getbspthreeCropType = async (req, res) => {
    let data = {};
    try {
      let condition = {}
      condition = {
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('bsp_3.crop_code')), 'crop_code'],
        ],
        where: {
          year: req.body.search.year,
          season: req.body.search.season,

        }

      }
      data = await bsp3Model.findAll(condition)
      let crop_type = []
      if (data && data.length > 0) {
        data.forEach(element => {
          crop_type.push({
            crop_type: element && element.crop_code && (element.crop_code.substring(0, 1) == 'A') ? 'Agriculture' : 'Horticulture',

            crop_Value: element && element.crop_code && (element.crop_code.substring(0, 1) == 'A') ? 'A' : 'H'
          })
        });
      }

      if (crop_type) {
        return response(res, status.DATA_AVAILABLE, 200, crop_type)
      } else {
        return response(res, "Data Not Found", 200, {})
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getbspthreeCropName = async (req, res) => {
    let data = {};
    try {
      let condition = {}
      condition = {
        include: [
          {
            model: cropModel,
            attributes: []
          }
        ],
        attributes: [
          [sequelize.col('bsp_3.crop_code'), 'crop_code'],
          [sequelize.col('m_crop.crop_name'), 'crop_name'],
          // [sequelize.fn('DISTINCT', sequelize.col('bsp_3.crop_code')), 'crop_code'],
        ],
        group: [
          [sequelize.col('bsp_3.crop_code'), 'crop_code'],
          [sequelize.col('m_crop.crop_name'), 'crop_name'],
        ],
        where: {
          year: req.body.search.year,
          season: req.body.search.season,
          crop_code: {
            [Op.like]: req.body.search.crop_type + '%'
          }
        },
        raw: true
      }
      data = await bsp3Model.findAll(condition)
      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        return response(res, "Data Not Found", 200, {})
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getMasterBspThreeReportDataSecond = async (req, res) => {
    let returnResponse = {};
    try {

      let condition = {
        include: [
          {
            model: cropModel,
            required: true,
            attributes: [],
            where: {
            }
          },
          {
            model: userModel,
            required: true,
            attributes: [],
          },
          {
            model: cropVerietyModel,
            required: true,
            attributes: [],
            where: {}
          },
        ],
        attributes: [
          // [sequelize.fn('DISTINCT',sequelize.col('bsp_3.production_center_id')), 'production_center_id'],
          [sequelize.col('bsp_3.crop_code'), 'crop_code'],
          [sequelize.col('bsp_3.season'), 'season'],
          [sequelize.col('bsp_3.year'), 'year'],
          [sequelize.col('m_crop.crop_name'), 'crop_name'],
          [sequelize.col('bsp_3.monitor_report'), 'report_status'],
          [sequelize.col('bsp_3.document'), 'view_moniter_report'],
          [sequelize.col('bsp_3.variety_id'), 'variety_id'],
          [sequelize.col('user.name'), 'bspc_name'],
          [sequelize.col('m_crop_variety.variety_code'), 'variety_code'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          // [sequelize.literal(`string_agg("m_crop_variety".variety_name::varchar,',')`), 'variety_name'],
          // [sequelize.literal(`string_agg("m_crop_variety".id::varchar,',')`), 'variety_id']
        ],
        group: [
          // [sequelize.col('bsp_3.production_center_id'), 'production_center_id'],
          [sequelize.col('bsp_3.season'), 'season'],
          [sequelize.col('bsp_3.year'), 'year'],
          [sequelize.col('bsp_3.crop_code'), 'crop_code'],
          [sequelize.col('m_crop.crop_name'), 'crop_name'],
          [sequelize.col('bsp_3.monitor_report'), 'report_status'],
          [sequelize.col('bsp_3.document'), 'view_moniter_report'],
          [sequelize.col('bsp_3.variety_id'), 'variety_id'],
          [sequelize.col('user.name'), 'bspc_name'],
          [sequelize.col('m_crop_variety.variety_code'), 'variety_code'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
        ],
        raw: true,
        where: {}
      }

      if (req.body.search) {
        if (req.body.search.year) {
          condition.where.year = req.body.search.year
        }
        if (req.body.search.season) {
          condition.where.season = req.body.search.season
        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = req.body.search.crop_code
        }
        if (req.body.search.crop != undefined && req.body.search.crop.length > 0) {
          condition.include[0].where.crop_code = { [Op.in]: req.body.search.crop }
        }
        if (req.body.search.crop_type) {
          condition.include[0].where.crop_code = {

            [Op.like]: req.body.search.crop_type + "%",

          }
        }

        if (req.body.search.breeder) {
          condition.include[0].where.breeder_id = req.body.search.breeder
        }

        if (req.body.search.variety != undefined && req.body.search.variety.length > 0) {
          // console.log('req.body.search.variety_code=====',req.body.search.variety)
          condition.include[2].where.variety_code = { [Op.in]: req.body.search.variety }
        }
      }


      let bsp3Data = await bsp3Model.findAll(condition);
      let filterData = [];
      bsp3Data.forEach((el, index) => {
        console.log(el)
        const cropIndex = filterData.findIndex(item => item.crop_code == el.crop_code);
        if (cropIndex == -1) {
          filterData.push(
            {
              "crop_name": el && el.crop_name ? el.crop_name : '',
              "crop_code": el && el.crop_code ? el.crop_code : '',
              "variety_count": 1,
              "variety":
                [

                  {
                    "variety_name": el && el.variety_name ? el.variety_name : '',
                    "variety_id": el && el.variety_id ? el.variety_id : '',
                    "variety_code": el && el.variety_code ? el.variety_code : '',
                    "bspc_count": 1,
                    "bspc": [
                      {
                        bspc_name: el && el.bspc_name ? el.bspc_name : '',
                        report_status: el && el.report_status ? el.report_status : '',
                        view_moniter_report: el && el.view_moniter_report ? el.view_moniter_report : '',

                      }
                    ]
                  }
                ]
            }
          )
        }
        else {
          const varietyIndex = filterData[cropIndex].variety.findIndex(item => item.variety_id === el.variety_id);
          if (varietyIndex != -1) {
            // const bspcIndex = filterData[cropIndex].variety[varietyIndex].bspc.findIndex(item => item.bspc_id === el.bspc[index].bspc_id); 
            filterData[cropIndex].variety[varietyIndex].bspc.push(
              {
                bspc_name: el && el.bspc_name ? el.bspc_name : '',
                report_status: el && el.report_status ? el.report_status : '',
                view_moniter_report: el && el.view_moniter_report ? el.view_moniter_report : '',
                // report_status :
              }
            )



          }


          else {
            filterData[cropIndex].variety.push(
              {
                "variety_name": el && el.variety_name ? el.variety_name : '',
                "variety_id": el && el.variety_id ? el.variety_id : '',
                "variety_code": el && el.variety_code ? el.variety_code : '',
                indent_quantity: el && el.indent_quantity ? el.indent_quantity : '',
                "bspc_count": 1,
                "bspc": [
                  {
                    bspc_name: el && el.bspc_name ? el.bspc_name : '',
                    report_status: el && el.report_status ? el.report_status : '',
                    view_moniter_report: el && el.view_moniter_report ? el.view_moniter_report : '',
                  }
                ]
              }
            )
          }
        }

      });



      if (filterData && filterData.length > 0) {
        return response(res, status.DATA_AVAILABLE, 200, filterData);
      } else {
        return response(res, status.DATA_AVAILABLE, 200, {});
      }

    } catch (error) {
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse)
    }
  }

  static getbspOneYearofIndent = async (req, res) => {
    let returnResponse = {};
    try {
      let cropGroup;
      if (req.body.loginedUserid.user_type === "OILSEEDADMIN") {
        cropGroup = { crop_code: { [Op.like]: 'A04%' } };
      }
      let condition = {
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('bsp_1s.year')), 'year'],
        ],
        where: {
          ...cropGroup
        },
        raw: true
      }
      condition.order = [[sequelize.col('bsp_1s.year'), 'DESC']]


      let bsp1Data = await bsp1Model.findAll(condition);
      if (bsp1Data) {

        return response(res, status.DATA_AVAILABLE, 200, bsp1Data);
      } else {
        return response(res, status.DATA_AVAILABLE, 200, {});
      }


    } catch (error) {
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse)
    }
  }
  static getbspTwoYearofIndent = async (req, res) => {
    let returnResponse = {};
    try {
      let cropGroup;
      if (req.body.loginedUserid.user_type === "OILSEEDADMIN") {
        cropGroup = { crop_code: { [Op.like]: 'A04%' } };
      }
      let condition = {
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('bsp_2.year')), 'year'],
        ],
        where: {
          ...cropGroup
        },
        raw: true
      }
      condition.order = [[sequelize.col('bsp_2.year'), 'DESC']]


      let bsp1Data = await bsp2Model.findAll(condition);
      if (bsp1Data) {

        return response(res, status.DATA_AVAILABLE, 200, bsp1Data);
      } else {
        return response(res, status.DATA_AVAILABLE, 200, {});
      }


    } catch (error) {
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse)
    }
  }

  static getbspfivebYearofIndent = async (req, res) => {
    let returnResponse = {};
    try {
      let cropGroup;
      if (req.body.loginedUserid.user_type === "OILSEEDADMIN") {
        cropGroup = { crop_code: { [Op.like]: 'A04%' } };
      }
      let condition = {
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('bsp_5_b.year')), 'year'],
        ],
        where: {
          ...cropGroup
        },
        raw: true
      }
      condition.order = [[sequelize.col('bsp_5_b.year'), 'DESC']]


      let bsp5bData = await bsp5bModel.findAll(condition);
      if (bsp5bData) {

        return response(res, status.DATA_AVAILABLE, 200, bsp5bData);
      } else {
        return response(res, status.DATA_AVAILABLE, 200, {});
      }


    } catch (error) {
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse)
    }
  }

  static getbspfivebVariety = async (req, res) => {
    let returnResponse = {};
    try {
       let cropGroup;
      if (req.body.loginedUserid.user_type === "OILSEEDADMIN") {
        cropGroup = { crop_code: { [Op.like]: 'A04%' } };
      }
      let condition = {
        include: [
          {
            model: cropVerietyModel,
            attributes: []
          }
        ],
        // attributes: [
        //   [sequelize.fn('DISTINCT', sequelize.col('bsp_5_b.year')), 'year'],
        // ],
        attributes: [
          [sequelize.col('bsp_5_b.variety_id'), 'variety_id'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [sequelize.col('m_crop_variety.id'), 'id'],
        ],
        group: [
          [sequelize.col('bsp_5_b.variety_id'), 'variety_id'],
          // [sequelize.col('bsp_5_b.year'),'year'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [sequelize.col('m_crop_variety.id'), 'id'],

        ],
        where: {
          year: req.body.search.year,
          crop_code: req.body.search.crop_code,
          season: req.body.search.season,
          ...cropGroup
        },
        raw: true
      }
      condition.order = [[sequelize.col('m_crop_variety.variety_name'), 'ASC']]


      let bsp5bData = await bsp5bModel.findAll(condition);
      if (bsp5bData) {

        return response(res, status.DATA_AVAILABLE, 200, bsp5bData);
      } else {
        return response(res, status.DATA_AVAILABLE, 200, {});
      }


    } catch (error) {
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse)
    }
  }
  static getBsp4ReportData = async (req, res) => {
    let data = {};
    try {
      let cropGroup;
      if (req.body.loginedUserid.user_type === "OILSEEDADMIN") {
        cropGroup = { crop_code: { [Op.like]: 'A04%' } };
      }
      let condition = {};
      let varietyId;
      let cropValue;

      let filters = await ConditionCreator.filters(req.body.search);
      condition = {
        where: filters,
        include: [
          {
            model: cropModel,
            required: true,
            attributes: [],
            where: {
            }
          },
          {
            model: userModel,
            required: true,
            attributes: [],
          },
          {
            model: cropVerietyModel,
            required: true,
            attributes: [],
            where: {}
          },
          {
            model: db.bsp4ToPlant,
            required: true,
            include: [
              {
                model: plantDetailsModel,
                attributes: []
              }
            ],
            attributes: [],
            where: {
              ...cropGroup
            }
          }
        ],
        attributes: [
          // [sequelize.fn('DISTINCT',sequelize.col('bsp_3.production_center_id')), 'production_center_id'],
          [sequelize.col('bsp_4.crop_code'), 'crop_code'],
          [sequelize.col('bsp_4.season'), 'season'],
          [sequelize.col('bsp_4.year'), 'year'],
          [sequelize.col('m_crop.crop_name'), 'crop_name'],
          [sequelize.col('bsp_4.carry_over_seed_amount'), 'carry_over_seed_amount'],
          [sequelize.col('bsp_4.actual_seed_production'), 'actual_seed_production'],
          [sequelize.col('bsp_4.carry_over_last_year_germination'), 'carry_over_last_year_germination'],
          [sequelize.col('bsp_4.carry_over_current_year_germination'), 'carry_over_current_year_germination'],
          [sequelize.col('bsp_4.total_availability'), 'total_availability'],
          [sequelize.col('bsp_4.production_surplus'), 'production_surplus'],
          [sequelize.col('bsp_4.variety_id'), 'variety_id'],
          [sequelize.col('user.name'), 'bspc_name'],
          [sequelize.col('m_crop_variety.variety_code'), 'variety_code'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [sequelize.col('bsp4_to_plant.quantity'), 'quantity'],
          [sequelize.col('user.id'), 'userIdbspc'],
          [sequelize.col('bsp4_to_plant.plant_id'), 'plant_id'],
          [sequelize.col('bsp4_to_plant->plant_detail.id'), 'bspPlantId'],
          [sequelize.col('bsp4_to_plant->plant_detail.plant_name'), 'plant_name']
          // [sequelize.col('bsp4_to_plant->plant_detail.plant_name'), 'plant_name'],

          // [sequelize.literal(`string_agg("m_crop_variety".variety_name::varchar,',')`), 'variety_name'],
          // [sequelize.literal(`string_agg("m_crop_variety".id::varchar,',')`), 'variety_id']
        ],
        raw: true,
        where: {}
      }
      if (req.body.search) {
        if (req.body.search.year) {
          condition.where.year = req.body.search.year
        }
        if (req.body.search.season) {
          condition.where.season = req.body.search.season
        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = req.body.search.crop_code
        }
        if (req.body.search.crop != undefined && req.body.search.crop.length > 0) {
          condition.include[0].where.crop_code = { [Op.in]: req.body.search.crop }

          cropValue = { crop_code: { [Op.in]: req.body.search.crop } };
        }
        if (req.body.search.crop_type) {
          condition.include[0].where.crop_code = {

            [Op.like]: req.body.search.crop_type + "%",

          }
        }

        if (req.body.search.breeder) {
          condition.include[0].where.breeder_id = req.body.search.breeder
        }

        if (req.body.search.variety_id && (req.body.search.variety_id.length > 0)) {

          condition.include[2].where.id = { [Op.in]: req.body.search.variety_id }
          varietyId = { variety_id: { [Op.in]: req.body.search.variety_id } }
        }
      }



      let bsp4Data = await bsp4Model.findAll(condition);
      bsp4Data = await masterHelper.sumofDuplicates(bsp4Data, 'crop_code', 'variety_id', 'userIdbspc')
      bsp4Data = await masterHelper.removeThreeDuplicates(bsp4Data, 'crop_code', 'variety_id', 'userIdbspc')
      let filterData = [];
      let fileterIndData = []

      if (req.body.search) {
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

        if (req.body.search.crop_type) {
          fileterIndData.push({
            crop_code: {
              [Op.like]: req.body.search.crop_type + '%'
            }
          })
        }

        if (req.body.search.crop != undefined && req.body.search.crop.length > 0) {
          fileterIndData.push({
            crop_code: {
              [Op.in]: req.body.search.crop
            }
          })
        }

        if (req.body.search.variety_id && (req.body.search.variety_id.length > 0)) {
          fileterIndData.push({
            variety_id: {
              [Op.in]: req.body.search.variety_id
            }
          })

        }
      }
      let indentData = await indentOfBreederseedModel.findAll({
        where: {
          [Op.and]: fileterIndData ? fileterIndData : []
        },
        attributes: [
          [sequelize.col('crop_code'), 'crop_code'],
          [sequelize.col('variety_id'), 'variety_id'],
          [sequelize.fn('SUM', sequelize.col('indent_quantity')), 'total_indent_qty'],
        ],
        group: [
          [sequelize.col('crop_code'), 'crop_code'],
          [sequelize.col('variety_id'), 'variety_id'],
        ],
        raw: true,
      })
      if (bsp4Data && bsp4Data.length > 0) {
        if (indentData && indentData.length > 0) {
          indentData.forEach(ele => {
            bsp4Data.forEach((item, i) => {
              if (item.crop_code == ele.crop_code && item.variety_id == ele.variety_id) {
                bsp4Data[i].indentQty = ele && ele.total_indent_qty ? parseFloat(ele.total_indent_qty) : 0
              }

            })
          })
        }
      }

      bsp4Data.forEach((el, index) => {

        const cropIndex = filterData.findIndex(item => item.crop_code == el.crop_code);
        if (cropIndex == -1) {
          filterData.push(
            {
              "crop_name": el && el.crop_name ? el.crop_name : '',
              "crop_code": el && el.crop_code ? el.crop_code : '',
              "variety_count": 1,
              "variety":
                [

                  {
                    "variety_name": el && el.variety_name ? el.variety_name : '',
                    "variety_id": el && el.variety_id ? el.variety_id : '',
                    "indentQty": el && el.indentQty ? el.indentQty : '',
                    "variety_code": el && el.variety_code ? el.variety_code : '',
                    "bspc_count": 1,
                    "bspc": [
                      {
                        carry_over_seed_amount: el && el.carry_over_seed_amount && el.carry_over_seed_amount ? el.carry_over_seed_amount : '',
                        actual_seed_production: el && el.actual_seed_production && el.actual_seed_production ? el.actual_seed_production : '',
                        bspc_name: el && el.bspc_name && el.bspc_name ? el.bspc_name : '',
                        carry_over_current_year_germination: el && el.carry_over_current_year_germination && el.carry_over_current_year_germination ? el.carry_over_current_year_germination : '',
                        production_surplus: el && el.production_surplus && el.production_surplus ? el.production_surplus : '',
                        total_availability: el && el.total_availability && el.total_availability ? el.total_availability : '',
                        quantity: el && el.quantity && el.quantity ? el.quantity : '',
                        userIdbspc: el && el.userIdbspc && el.userIdbspc ? el.userIdbspc : '',

                        plant_name: el && el.plant_name && el.plant_name ? el.plant_name : '',
                        quantitys: [

                        ],
                        plant: [

                        ]


                      }
                    ]
                  }
                ]
            }
          )
        }
        else {
          const varietyIndex = filterData[cropIndex].variety.findIndex(item => item.variety_id === el.variety_id);
          if (varietyIndex != -1) {
            // const bspcIndex = filterData[cropIndex].variety[varietyIndex].bspc.findIndex(item => item.bspc_id === el.bspc[index].bspc_id); 
            filterData[cropIndex].variety[varietyIndex].bspc.push(
              {
                carry_over_current_year_germination: el && el.carry_over_current_year_germination && el.carry_over_current_year_germination ? el.carry_over_current_year_germination : '',
                production_surplus: el && el.production_surplus && el.production_surplus ? el.production_surplus : '',
                carry_over_seed_amount: el && el.carry_over_seed_amount && el.carry_over_seed_amount ? el.carry_over_seed_amount : '',
                bspc_name: el && el.bspc_name && el.bspc_name ? el.bspc_name : '',
                total_availability: el && el.total_availability && el.total_availability ? el.total_availability : '',
                actual_seed_production: el && el.actual_seed_production && el.actual_seed_production ? el.actual_seed_production : '',
                quantity: el && el.quantity && el.quantity ? el.quantity : '',
                userIdbspc: el && el.userIdbspc && el.userIdbspc ? el.userIdbspc : '',
                plant_name: el && el.plant_name && el.plant_name ? el.plant_name : '',
                quantitys: [

                ],
                plant: [

                ]
              }
            )
          }
          else {
            filterData[cropIndex].variety.push(
              {
                "variety_name": el && el.variety_name ? el.variety_name : '',
                "variety_id": el && el.variety_id ? el.variety_id : '',
                "variety_code": el && el.variety_code ? el.variety_code : '',
                "indentQty": el && el.indentQty ? el.indentQty : '',
                "bspc_count": 1,
                "bspc": [
                  {
                    carry_over_current_year_germination: el && el.carry_over_current_year_germination && el.carry_over_current_year_germination ? el.carry_over_current_year_germination : '',
                    production_surplus: el && el.production_surplus && el.production_surplus ? el.production_surplus : '',
                    carry_over_seed_amount: el && el.carry_over_seed_amount && el.carry_over_seed_amount ? el.carry_over_seed_amount : '',
                    bspc_name: el && el.bspc_name && el.bspc_name ? el.bspc_name : '',
                    total_availability: el && el.total_availability && el.total_availability ? el.total_availability : '',
                    actual_seed_production: el && el.actual_seed_production && el.actual_seed_production ? el.actual_seed_production : '',
                    quantity: el && el.quantity && el.quantity ? el.quantity : '',
                    plant_name: el && el.plant_name && el.plant_name ? el.plant_name : '',
                    userIdbspc: el && el.userIdbspc && el.userIdbspc ? el.userIdbspc : '',
                    plant: [

                    ],
                    quantitys: [

                    ],

                  }
                ]
              }
            )
          }
        }

      });
      // let filtersData = await ConditionCreator.filters(req.body.search);
      let allocationData;
      if (req.body.search) {
        if (req.body.search.crop_code && req.body.search.variety_id) {

          allocationData = await bsp1Model.findAll({
            include: [
              {
                model: bsp1ProductionCenter,
              }
            ],
            // where:filtersData
            where: {
              year: req.body.search.year,
              season: req.body.search.season,
              // crop_code: {[Op.in]:req.body.search.crop_code},
              // variety_id: {[Op.in]:req.body.search.variety_id},
              ...cropValue,
              ...varietyId

            },
            attributes: ['year', 'variety_id', 'crop_code',
              [sequelize.col('bsp1_production_centers.quantity_of_seed_produced'), 'quantity_of_seed_produced']
            ]
          })
        }
        else if (req.body.search.crop_code) {

          allocationData = await bsp1Model.findAll({
            include: [
              {
                model: bsp1ProductionCenter,
              }
            ],
            // where:filtersData
            where: {
              year: req.body.search.year,
              season: req.body.search.season,
              // crop_code: {[Op.in]:req.body.search.crop_code},
              //  variety_id:req.body.search.variety_id,
              ...cropValue,
              // ...varietyId
            },
            attributes: ['year', 'variety_id', 'crop_code',
              [sequelize.col('bsp1_production_centers.quantity_of_seed_produced'), 'quantity_of_seed_produced']
            ]
          })
        }
        else {

          allocationData = await bsp1Model.findAll({
            include: [
              {
                model: bsp1ProductionCenter,
              }
            ],
            // where:filtersData
            where: {
              year: req.body.search.year,
              season: req.body.search.season,
              crop_code: {
                [Op.like]: req.body.search.crop_type + "%",
              }
              //  crop_code:req.body.search.crop_code,
              //  variety_id:req.body.search.variety_id,


            },
            attributes: ['year', 'variety_id', 'crop_code',
              [sequelize.col('bsp1_production_centers.quantity_of_seed_produced'), 'quantity_of_seed_produced']
            ]
          })
        }
      }

      let plantDetailsData;
      if (req.body.search) {
        if (req.body.search.crop_code && req.body.search.variety_id) {
          plantDetailsData = await bsp4Model.findAll({
            where: {
              year: req.body.search.year,
              season: req.body.search.season,
              // crop_code: req.body.search.crop_code,
              // variety_id: req.body.search.variety_id,
              ...cropValue,
              ...varietyId

            },
            include: [
              {
                model: db.bsp4ToPlant,
                // attributes:[],
                include: [
                  {
                    model: plantDetailsModel,
                    // attributes:[]
                  }
                ]
              }
            ],
            attributes: [
              'id', 'carry_over_seed_amount'
              // [sequelize.col['bsp4_to_plant->plant_detail.id'],'id'],
              // [sequelize.col['bsp4_to_plant->plant_detail.plant_name'],'plant_name'],
              // [sequelize.col['bsp4_to_plant.crop_code'],'crop_code'],
              // [sequelize.col['bsp4_to_plant.variety_id'],'variety_id']
            ]
          })
        }
        else if (req.body.search.crop_code) {
          plantDetailsData = await bsp4Model.findAll({
            where: {
              year: req.body.search.year,
              season: req.body.search.season,
              crop_code: req.body.search.crop_code


            },
            include: [
              {
                model: db.bsp4ToPlant,
                // attributes:[],
                include: [
                  {
                    model: plantDetailsModel,
                    // attributes:[]
                  }
                ]
              }
            ],
            attributes: [
              'id', 'carry_over_seed_amount'
              // [sequelize.col['bsp4_to_plant->plant_detail.id'],'id'],
              // [sequelize.col['bsp4_to_plant->plant_detail.plant_name'],'plant_name'],
              // [sequelize.col['bsp4_to_plant.crop_code'],'crop_code'],
              // [sequelize.col['bsp4_to_plant.variety_id'],'variety_id']
            ]
          })
        }
        else {
          plantDetailsData = await bsp4Model.findAll({
            where: {
              year: req.body.search.year,
              season: req.body.search.season,
              crop_code: {
                [Op.like]: req.body.search.crop_type + "%",
              }


            },
            include: [
              {
                model: db.bsp4ToPlant,
                // attributes:[],
                include: [
                  {
                    model: plantDetailsModel,
                    // attributes:[]
                  }
                ]
              }
            ],
            attributes: [
              'id', 'carry_over_seed_amount'
              // [sequelize.col['bsp4_to_plant->plant_detail.id'],'id'],
              // [sequelize.col['bsp4_to_plant->plant_detail.plant_name'],'plant_name'],
              // [sequelize.col['bsp4_to_plant.crop_code'],'crop_code'],
              // [sequelize.col['bsp4_to_plant.variety_id'],'variety_id']
            ]
          })
        }
      }



      // let resultplantData=plantData;
      // const resultplantData = 
      // const dataupdate = await Promise
      const updateData = [
        {
          filterData: filterData,
          allocationData: allocationData,
          plantData: plantDetailsData,
          indentData: indentData

        }
      ]

      if (filterData) {
        // filteredData.forEach(element => {
        //   let sum = 0;
        //   element.bspc.forEach(item => {
        //     element.total_spa_count = element.bspc.length + item.variety.length
        //     sum += element.total_spa_count;
        //     element.sum = sum;
        //     item.spa_count = item.variety.length
        //   })

        // })
        return response(res, status.DATA_AVAILABLE, 200, updateData)
      } else {
        return response(res, "Data Not Found", 200, {})
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getbsp4CropName = async (req, res) => {
    let data = {};
    try {
      let cropGroup;
      if (req.body.loginedUserid.user_type === "OILSEEDADMIN") {
        cropGroup = { crop_code: { [Op.like]: 'A04%' } };
      }
      let condition = {}
      condition = {
        include: [
          {
            model: cropModel,
            attributes: []
          }
        ],
        attributes: [
          [sequelize.col('bsp_4.crop_code'), 'crop_code'],
          [sequelize.col('m_crop.crop_name'), 'crop_name'],
          // [sequelize.fn('DISTINCT', sequelize.col('bsp_3.crop_code')), 'crop_code'],
        ],
        group: [
          [sequelize.col('bsp_4.crop_code'), 'crop_code'],
          [sequelize.col('m_crop.crop_name'), 'crop_name'],
        ],
        where: {
          year: req.body.search.year,
          season: req.body.search.season,
          crop_code: {
            [Op.like]: req.body.search.crop_type + '%'
          },
          ...cropGroup
        },
        raw: true
      }
      data = await bsp4Model.findAll(condition)
      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        return response(res, "Data Not Found", 200, {})
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getBsp5aFilterCropType = async (req, res) => {
    let returnResponse = {};
    try {
      let cropGroup;
      if (req.body.loginedUserid.user_type === "OILSEEDADMIN") {
        cropGroup = { crop_code: { [Op.like]: 'A04%' } };
      }
      let condition = {
        include: [
        ],
        attributes: [
          [sequelize.fn("DISTINCT", sequelize.col('bsp_5_a.crop_code')), "crop_code"],
        ],
        raw: true,
        where: {
          ...cropGroup
        }
      }

      if (req.body && req.body.search) {
        if (req.body.search.year) {
          condition.where.year = parseInt(req.body.search.year);
        }
        if (req.body.search.season) {
          condition.where.season = (req.body.search.season);
        }
      }
      let bsp5aData = await bsp5aModel.findAll(condition);
      let filterData = bsp5aData;
      filterData.forEach(ele => {
        if (ele.crop_code.slice(0, 1) == "A") {
          ele.crop_type_name = "Agriculture"
          ele.crop_type = "A"
        } else {
          ele.crop_type_name = "Horticulture"
          ele.crop_type = "H"
        }
      });
      let removeDuplicateData
      if (filterData && filterData !== undefined && filterData.length > 0) {
        removeDuplicateData = await masterHelper.removeDuplicates(filterData, 'crop_type');


        return response(res, status.DATA_AVAILABLE, 200, removeDuplicateData)
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 401, [])
      }
    } catch (error) {
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse)
    }
  }
  static getBsp5aFilterCropName = async (req, res) => {
    let returnResponse = {};
    try {
      let condition = {
        include: [
          {
            model: cropModel,
            attributes: [],
          }
        ],
        attributes: [
          [sequelize.fn("DISTINCT", sequelize.col('bsp_5_a.crop_code')), "crop_code"],
          [sequelize.col('m_crop.crop_name'), "crop_name"],
        ],
        raw: true,
        where: {
          [Op.and]: { crop_code: { [Op.like]: req.body.search.crop_type ? req.body.search.crop_type + "%" : '' } },
          ...cropGroup
        }
      }

      if (req.body && req.body.search) {
        if (req.body.search.year) {
          condition.where.year = parseInt(req.body.search.year);
        }
        if (req.body.search.season) {
          condition.where.season = (req.body.search.season);
        }
      }
      let bsp5aData = await bsp5aModel.findAll(condition);
      let filterData = bsp5aData;
      if (filterData && filterData !== undefined && filterData.length > 0) {
        return response(res, status.DATA_AVAILABLE, 200, filterData)
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 401, [])
      }
    } catch (error) {
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse)
    }
  }
  static getBsp5aFilterVariety = async (req, res) => {
    let returnResponse = {};
    try {
      let condition = {
        include: [
          {
            model: varietyModel,
            attributes: [],
          }
        ],
        attributes: [
          [sequelize.fn("DISTINCT", sequelize.col('bsp_5_a.variety_id')), "variety_id"],
          [sequelize.col('m_crop_variety.variety_name'), "variety_name"],
        ],
        raw: true,
        where: {
          [Op.and]: { crop_code: { [Op.like]: req.body.search.crop_type + "%" } }
        }
      }

      if (req.body && req.body.search) {
        if (req.body.search.year) {
          condition.where.year = parseInt(req.body.search.year);
        }
        if (req.body.search.season) {
          condition.where.season = (req.body.search.season);
        }
        if (req.body.search.crop_code && req.body.search.crop_code !== undefined && req.body.search.crop_code.length > 0) {
          condition.where.crop_code = {
            [Op.in]: (req.body.search.crop_code)
          };
        }
      }
      let bsp5aData = await bsp5aModel.findAll(condition);
      if (bsp5aData && bsp5aData !== undefined && bsp5aData.length > 0) {
        return response(res, status.DATA_AVAILABLE, 200, bsp5aData)
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 401, [])
      }
    } catch (error) {
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse)
    }
  }

  static getBsp5bFilterCropType = async (req, res) => {
    let returnResponse = {};
    try {
      let condition = {
        include: [
        ],
        attributes: [
          [sequelize.fn("DISTINCT", sequelize.col('bsp_5_b.crop_code')), "crop_code"],
        ],
        raw: true,
        where: {
        }
      }
      if (req.body && req.body.search) {
        if (req.body.search.year) {
          condition.where.year = parseInt(req.body.search.year);
        }
        if (req.body.search.season) {
          condition.where.season = (req.body.search.season);
        }
      }
      let bsp5bData = await bsp5bModel.findAll(condition);
      let filterData = bsp5bData;
      filterData.forEach(ele => {
        if (ele.crop_code.slice(0, 1) == "A") {
          ele.crop_type_name = "Agriculture"
          ele.crop_type = "A"
        } else {
          ele.crop_type_name = "Horticulture"
          ele.crop_type = "H"
        }
      })
      let removeduplicateData;
      if (filterData && filterData !== undefined && filterData.length > 0) {
        removeduplicateData = await masterHelper.removeDuplicates(filterData, 'crop_type')
      }
      if (removeduplicateData && removeduplicateData !== undefined && removeduplicateData.length > 0) {
        return response(res, status.DATA_AVAILABLE, 200, removeduplicateData)
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 401, [])
      }
    } catch (error) {
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse)
    }
  }
  static getBsp5bFilterCropName = async (req, res) => {
    let returnResponse = {};
    try {
      let condition = {
        include: [

          {
            model: cropModel,
            attributes: [],
          },

        ],

        attributes: [
          [sequelize.fn("DISTINCT", sequelize.col('bsp_5_b.crop_code')), "crop_code"],
          [sequelize.col('m_crop.crop_name'), "crop_name"],
        ],
        raw: true,
        where: {
          [Op.and]: { crop_code: { [Op.like]: req.body.search.crop_type + "%" } }
        }
      }
      if (req.body && req.body.search) {
        if (req.body.search.year) {
          condition.where.year = parseInt(req.body.search.year);
        }
        if (req.body.search.season) {
          condition.where.season = (req.body.search.season);
        }
      }
      let bsp5bData = await bsp5bModel.findAll(condition);
      if (bsp5bData) {
        return response(res, status.DATA_AVAILABLE, 200, bsp5bData)
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 401, [])
      }
    } catch (error) {
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse)
    }
  }
  static getBsp5bFilterVariety = async (req, res) => {
    let returnResponse = {};
    try {
      let condition = {
        include: [
          {
            model: varietyModel,
            attributes: [],
          }
        ],

        attributes: [
          [sequelize.fn("DISTINCT", sequelize.col('bsp_5_b.variety_id')), "variety_id"],
          [sequelize.col('m_crop_variety.variety_name'), "variety_name"],
        ],
        raw: true,
        where: {
          [Op.and]: { crop_code: { [Op.like]: req.body.search.crop_type + "%" } }
        }
      }
      if (req.body && req.body.search) {
        if (req.body.search.year) {
          condition.where.year = parseInt(req.body.search.year);
        }
        if (req.body.search.season) {
          condition.where.season = (req.body.search.season);
        }
        if (req.body.search.crop_code && req.body.search.crop_code !== undefined && req.body.search.crop_code.length > 0) {
          condition.where.crop_code = {
            [Op.in]: (req.body.search.crop_code)
          };
        }
      }
      let bsp5bData = await bsp5bModel.findAll(condition);
      if (bsp5bData) {
        return response(res, status.DATA_AVAILABLE, 200, bsp5bData)
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 401, [])
      }
    } catch (error) {
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse)
    }
  }

  static getBsp5aReports = async (req, res) => {
    let returnResponse = {};
    try {
      let cropType;
      if (req.body && req.body.search && req.body.search.crop_type) {
        cropType = { [Op.and]: { crop_code: { [Op.like]: req.body.search.crop_type + "%" } } }
      }
      let condition = {
        include: [
          {
            model: userModel,
            attributes: []
          },
          {
            model: cropModel,
            attributes: [],
          },
          {
            model: varietyModel,
            attributes: [],
          },
          {
            model: bsp4Model,
            attributes: [],
          },
        ],
        attributes: [
          [sequelize.fn("DISTINCT", sequelize.col('bsp_5_a.crop_code')), "crop_code"],
          [sequelize.col('m_crop.crop_name'), "crop_name"],
          [sequelize.col('m_crop_variety.id'), "variety_id"],
          [sequelize.col('m_crop_variety.variety_name'), "variety_name"],
          [sequelize.col('bsp_5_a.genetic_purity'), "genetic_purity"],
          [sequelize.col('user.name'), "bspc_name"],
          [sequelize.col('bsp_4.number_of_sample'), "number_of_sample"],


        ],
        raw: true,
        where: {
          ...cropType
        }
      }

      if (req.body && req.body.search) {
        if (req.body.search.year) {
          condition.where.year = parseInt(req.body.search.year);
        }
        if (req.body.search.season) {
          condition.where.season = (req.body.search.season);
        }
        if (req.body.search.crop_code && req.body.search.crop_code !== undefined && req.body.search.crop_code.length > 0) {
          condition.where.crop_code = {
            [Op.in]: (req.body.search.crop_code)
          };
        }
        if (req.body.search.variety_id && req.body.search.variety_id !== undefined && req.body.search.variety_id.length > 0) {
          condition.where.variety_id = {
            [Op.in]: (req.body.search.variety_id)
          };
        }
      }
      let bsp5aData = await bsp5aModel.findAll(condition);

      let filterData = []
      bsp5aData.forEach((el, index) => {
        console.log(el)
        const cropIndex = filterData.findIndex(item => item.crop_code == el.crop_code);
        if (cropIndex == -1) {
          filterData.push(
            {
              "crop_name": el && el.crop_name ? el.crop_name : '',
              "crop_code": el && el.crop_code ? el.crop_code : '',
              "varietyCount": 0,
              "variety":
                [
                  {
                    "variety_name": el && el.variety_name ? el.variety_name : '',
                    "variety_id": el && el.variety_id ? el.variety_id : '',
                    "variety_code": el && el.variety_code ? el.variety_code : '',
                    "bspcCount": 0,
                    "bspc": [
                      {
                        bspc_name: el && el.bspc_name && el.bspc_name ? el.bspc_name : '',
                        no_of_samples: el && el.number_of_sample && el.number_of_sample ? el.number_of_sample : '',
                        genetic_purity: el && el.genetic_purity && el.genetic_purity ? el.genetic_purity : '',
                      }
                    ]
                  }
                ]
            }
          )
        }
        else {
          const varietyIndex = filterData[cropIndex].variety.findIndex(item => item.variety_id === el.variety_id);
          if (varietyIndex != -1) {
            // const bspcIndex = filterData[cropIndex].variety[varietyIndex].bspc.findIndex(item => item.bspc_id === el.bspc[index].bspc_id); 
            filterData[cropIndex].variety[varietyIndex].bspc.push(
              {
                bspc_name: el && el.bspc_name && el.bspc_name ? el.bspc_name : '',
                no_of_samples: el && el.number_of_sample && el.number_of_sample ? el.number_of_sample : '',
                genetic_purity: el && el.genetic_purity && el.genetic_purity ? el.genetic_purity : '',
              }
            )
          }


          else {
            filterData[cropIndex].variety.push(
              {
                "variety_name": el && el.variety_name ? el.variety_name : '',
                "variety_id": el && el.variety_id ? el.variety_id : '',
                "variety_code": el && el.variety_code ? el.variety_code : '',
                "bspcCount": 0,
                "bspc": [
                  {
                    bspc_name: el && el.bspc_name && el.bspc_name ? el.bspc_name : '',
                    no_of_samples: el && el.number_of_sample && el.number_of_sample ? el.number_of_sample : '',
                    genetic_purity: el && el.genetic_purity && el.genetic_purity ? el.genetic_purity : '',

                  }
                ]
              }
            )
          }
        }

      });

      filterData.forEach(ele => {
        ele.variety.forEach(elem => {
          ele.varietyCount += elem.bspc.length
          elem.bspc.forEach(item => {
            elem.bspcCount += 1
          })
        })
      });
      if (filterData && filterData !== undefined && filterData.length > 0) {
        return response(res, status.DATA_AVAILABLE, 200, filterData)
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 401, [])
      }
    } catch (error) {
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse)
    }
  }

  static getBsp5bReports = async (req, res) => {
    let returnResponse = {};
    try {
      let cropType;
      if (req.body && req.body.search && req.body.search.crop_type) {
        cropType = { [Op.and]: { crop_code: { [Op.like]: req.body.search.crop_type + "%" } } }
      }
      let condition = {
        include: [
          {
            model: userModel,
            attributes: []
          },
          {
            model: cropModel,
            attributes: [],
          },
          {
            model: varietyModel,
            attributes: [],
          },
          {
            model: indentOfBreederseedModel,
            attributes: [],
          },
          {
            model: bsp5aModel,
            attributes: [],
            include: [{
              model: bsp4Model,
              attributes: [],
            }]
          }

        ],

        attributes: [
          [sequelize.fn("DISTINCT", sequelize.col('bsp_5_b.crop_code')), "crop_code"],
          [sequelize.col('m_crop.crop_name'), "crop_name"],
          [sequelize.col('m_crop_variety.id'), "variety_id"],
          [sequelize.col('m_crop_variety.variety_name'), "variety_name"],
          [sequelize.col('indent_of_breederseed.indent_quantity'), "indent_quantity"],
          [sequelize.col('user.name'), "bspc_name"],
          [sequelize.col('user.id'), "user_id"],
          [sequelize.col('bsp_5_b.breeder_seed_balance'), "breeder_seed_balance"],
          [sequelize.col('bsp_5_b.lifting_quantity'), "lifting_quantity"],
          [sequelize.col('bsp_5_a->bsp_4.total_availability'), "total_availability"],
          [sequelize.col('bsp_5_a->bsp_4.carry_over_current_year_germination'), "carry_over_current_year_germination"],


        ],
        raw: true,
        where: {
          ...cropType
        }
      }
      if (req.body && req.body.search) {
        if (req.body.search.year) {
          condition.where.year = parseInt(req.body.search.year);
        }
        if (req.body.search.season) {
          condition.where.season = (req.body.search.season);
        }
        if (req.body.search.crop_code && req.body.search.crop_code !== undefined && req.body.search.crop_code.length > 0) {
          condition.where.crop_code = {
            [Op.in]: (req.body.search.crop_code)
          };
        }
        if (req.body.search.variety_id && req.body.search.variety_id !== undefined && req.body.search.variety_id.length > 0) {
          condition.where.variety_id = {
            [Op.in]: (req.body.search.variety_id)
          };
        }
      }

      let bsp5bData = await bsp5bModel.findAll(condition);
      let dataAllocated = await masterHelper.sumofDuplicateDataAllocationQty(bsp5bData)
      let item = await masterHelper.sumofDuplicateDataIndentDataQty(bsp5bData);

      if (bsp5bData && bsp5bData.length > 0) {
        if (item && item.length > 0) {
          item.forEach(el => {
            bsp5bData.forEach((item, i) => {
              if (item.crop_code == el.crop_code && item.variety_id == el.variety_id) {
                bsp5bData[i].indent_quantity = el && el.indent_quantity ? (el.indent_quantity).toFixed(2) : '0'

              }
            })
          })
        }
      }
      if (bsp5bData && bsp5bData.length > 0) {
        if (dataAllocated && dataAllocated.length > 0) {
          dataAllocated.forEach(el => {
            bsp5bData.forEach((item, i) => {
              if (item.crop_code == el.crop_code && item.variety_id == el.variety_id) {
                bsp5bData[i].lifting_quantity = el && el.lifting_quantity ? parseFloat(el.lifting_quantity).toFixed(2) : '0'

              }
            })
          })
        }
      }
      let filterDataAllocation = []
      if (req.body.search) {
        if (req.body.search.year) {
          filterDataAllocation.push({
            year: req.body.search.year
          })

        }
        if (req.body.search.season) {
          filterDataAllocation.push({
            season: req.body.search.season
          })

        }
        if (req.body.search.crop_type) {
          filterDataAllocation.push({
            crop_code: {
              [Op.like]: req.body.search.crop_type + '%'
            }
          })

        }
        if (req.body.search.crop_type) {
          filterDataAllocation.push({
            crop_code: {
              [Op.like]: req.body.search.crop_type + '%'
            }
          })

        }
        if (req.body.search.crop_code && req.body.search.crop_code !== undefined && req.body.search.crop_code.length > 0) {
          filterDataAllocation.push({
            crop_code: {
              [Op.in]: req.body.search.crop_code
            }
          })
        }

        if (req.body.search.variety_id && req.body.search.variety_id !== undefined && req.body.search.variety_id.length > 0) {
          filterDataAllocation.push({
            variety_id: {
              [Op.in]: req.body.search.variety_id
            }
          })
        }
      }

      let productionData = await db.lotNumberModel.findAll({
        include: [
          {
            model: db.seedTestingReportsModel,
            attributes: [],
            where: {
              is_report_pass: true
            }
          }
        ],
        attributes: [
          [sequelize.col('lot_number_creations.crop_code'), 'crop_code'],
          [sequelize.col('lot_number_creations.variety_id'), 'variety_id'],
          // [sequelize.col('lot_number_creations.breeder_production_center_id'),'breeder_production_center_id'],
          // [sequelize.fn('DISTINCT', sequelize.col('lot_number_creations.crop_code')), 'crop_code'],
          [sequelize.literal("Sum(lot_number_creations.lot_number_size)"), "production"],
        ],
        group: [
          [sequelize.col('lot_number_creations.crop_code'), 'crop_code'],
          [sequelize.col('lot_number_creations.variety_id'), 'variety_id'],
        ],
        where: {
          [Op.and]: filterDataAllocation ? filterDataAllocation : []

        },
        raw: true
      })

      let allocatedData = await indentorLiftingModel.findAll(
        {
          include: [
            {
              model: db.allocationToIndentorProductionCenterSeed,
              attributes: []
            }
          ],
          where: {
            [Op.and]: filterDataAllocation ? filterDataAllocation : []
          },
          attributes: [
            [sequelize.col('allocation_to_indentor_for_lifting_seeds.crop_code'), 'crop_code'],
            [sequelize.col('allocation_to_indentor_for_lifting_seeds.variety_id'), 'variety_id'],
            [sequelize.col('allocation_to_indentor_for_lifting_seed_production_cnter.qty'), 'qty'],

          ],
          raw: true
        }

      )

      let bsp5Data = masterHelper.removeThreeDuplicates(bsp5bData, 'crop_code', 'variety_id', 'user_id')
      let allocatedDataSecond = masterHelper.sumofDuplicateDataAllottedty(allocatedData, 'crop_code', 'variety_id')
      console.log(allocatedDataSecond, 'allocatedDataSecond')
      if (bsp5bData && bsp5bData.length > 0) {
        if (allocatedDataSecond && allocatedDataSecond.length > 0) {
          allocatedDataSecond.forEach(el => {
            bsp5bData.forEach((item, i) => {
              if (item.crop_code == el.crop_code && item.variety_id == el.variety_id) {
                bsp5bData[i].qty = el && el.qty ? parseFloat(el.qty).toFixed(2) : '0'

              }
            })
          })
        }
      }
      if (productionData && productionData.length > 0) {
        if (bsp5Data && bsp5Data.length > 0) {
          productionData.forEach(el => {
            bsp5Data.forEach((item, i) => {
              if (item.crop_code == el.crop_code && el.variety_id == item.variety_id) {
                console.log(el.production)
                bsp5Data[i].productionData = el && el.production ? parseFloat(el.production) : 0
              }

            })
          })
        }
      }
      // console.log(bsp5Data,'bsp5Data')
      let filterData = []

      bsp5Data.forEach((el, index) => {
        const cropIndex = filterData.findIndex(item => item.crop_code == el.crop_code);
        if (cropIndex == -1) {
          filterData.push(
            {
              "crop_name": el && el.crop_name ? el.crop_name : '',
              "crop_code": el && el.crop_code ? el.crop_code : '',
              "varietyCount": 0,
              "variety":
                [

                  {
                    "variety_name": el && el.variety_name ? el.variety_name : '',
                    "variety_id": el && el.variety_id ? el.variety_id : '',
                    "variety_code": el && el.variety_code ? el.variety_code : '',
                    "indent_qnt": el && el.indent_quantity ? el.indent_quantity : '',
                    "bspcCount": 0,
                    "bspc": [
                      {
                        bspc_name: el && el.bspc_name && el.bspc_name ? el.bspc_name : '',
                        total_availability_breederseed: el && el.total_availability && el.total_availability ? el.total_availability : '',
                        allocated_for_lifting: el && el.qty && el.qty ? el.qty : '',
                        total_lifted: el && el.lifting_quantity && el.lifting_quantity ? el.lifting_quantity : '',
                        total_Unlifted: el && el.carry_over_current_year_germination && el.carry_over_current_year_germination ? el.carry_over_current_year_germination : '',
                        breeder_seed_balance: el && el.breeder_seed_balance && el.breeder_seed_balance ? el.breeder_seed_balance : '',
                        "crop_code": el && el.crop_code ? el.crop_code : '',
                        "variety_id": el && el.variety_id ? el.variety_id : '',
                        "user_id": el && el.user_id ? el.user_id : '',
                        productionData: el && el.productionData ? parseFloat(el.productionData) : 0
                      },
                    ],
                    bsp: []
                  }
                ]
            }
          )
        }
        else {
          const varietyIndex = filterData[cropIndex].variety.findIndex(item => item.variety_id === el.variety_id);
          if (varietyIndex != -1) {
            // const bspcIndex = filterData[cropIndex].variety[varietyIndex].bspc.findIndex(item => item.bspc_id === el.bspc[index].bspc_id); 
            filterData[cropIndex].variety[varietyIndex].bspc.push(
              {
                bspc_name: el && el.bspc_name && el.bspc_name ? el.bspc_name : '',
                total_availability_breederseed: el && el.total_availability && el.total_availability ? el.total_availability : '',
                allocated_for_lifting: el && el.qty && el.qty ? el.qty : '',
                total_lifted: el && el.lifting_quantity && el.lifting_quantity ? el.lifting_quantity : '',
                total_Unlifted: el && el.carry_over_current_year_germination && el.carry_over_current_year_germination ? el.carry_over_current_year_germination : '',
                breeder_seed_balance: el && el.breeder_seed_balance && el.breeder_seed_balance ? el.breeder_seed_balance : '',
                "crop_code": el && el.crop_code ? el.crop_code : '',
                "variety_id": el && el.variety_id ? el.variety_id : '',
                "user_id": el && el.user_id ? el.user_id : '',
                productionData: el && el.productionData ? parseFloat(el.productionData) : 0

              }
            )
          }


          else {
            filterData[cropIndex].variety.push(
              {
                "variety_name": el && el.variety_name ? el.variety_name : '',
                "variety_id": el && el.variety_id ? el.variety_id : '',
                "variety_code": el && el.variety_code ? el.variety_code : '',
                "indent_qnt": el && el.indent_quantity ? el.indent_quantity : '',
                "bspcCount": 1,
                bsp: [],
                "bspc": [
                  {
                    bspc_name: el && el.bspc_name && el.bspc_name ? el.bspc_name : '',
                    total_availability_breederseed: el && el.total_availability && el.total_availability ? el.total_availability : '',
                    allocated_for_lifting: el && el.qty && el.qty ? el.qty : '',
                    total_lifted: el && el.lifting_quantity && el.lifting_quantity ? el.lifting_quantity : '',
                    total_Unlifted: el && el.carry_over_current_year_germination && el.carry_over_current_year_germination ? el.carry_over_current_year_germination : '',
                    breeder_seed_balance: el && el.breeder_seed_balance && el.breeder_seed_balance ? el.breeder_seed_balance : '',
                    "crop_code": el && el.crop_code ? el.crop_code : '',
                    "variety_id": el && el.variety_id ? el.variety_id : '',
                    "user_id": el && el.user_id ? el.user_id : '',
                    productionData: el && el.productionData ? parseFloat(el.productionData) : 0
                  }
                ]
              }
            )
          }
        }

      });

      filterData.forEach(ele => {
        ele.variety.forEach(elem => {
          ele.varietyCount += elem.bspc.length
          elem.bspc.forEach(item => {
            elem.bspcCount += 1
          })
        })
      });
      if (filterData) {
        return response(res, status.DATA_AVAILABLE, 200, filterData)
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 401, [])
      }
    } catch (error) {
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse)
    }
  }
  static getBsp1cropName = async (req, res) => {
    let data = {};
    try {
      let condition = {}
      let filters = await ConditionCreator.filters(req.body.search);
      condition = {
        where: {
          year: req.body.search.year,
          season: req.body.search.season,
          crop_code: {
            [Op.like]: req.body.search.crop_type + '%'
          },

        },
        include: [
          {
            model: cropModel,
            attributes: []
          }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('bsp_1s.crop_code')), 'crop_code'],
          [sequelize.col('m_crop.crop_name'), 'crop_name'],
          // [sequelize.col('m_crop.crop_name'), 'crop_name'],
        ],
        // group:[
        //   [sequelize.col('bsp_1s.crop_code'), 'crop_code'],
        //   // [sequelize.col('m_crop.crop_name'), 'crop_name']
        //   // [sequelize.col('m_crop.id'), 'id']
        // ],
        raw: true

      };
      data = await db.bsp1Model.findAll(condition);


      if (data) {

        return response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        return response(res, "Data Not Found", 200, {})
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getBsp1cropType = async (req, res) => {
    let data = {};
    try {
      let condition = {}
      let filterData = []
      // let filters = await ConditionCreator.filters(req.body.search);
      if (req.body.search.type == 'report_icar') {
        if (req.body.search.user_type == 'ICAR') {
          filterData.push(
            {
              year: req.body.search.year,
              season: req.body.search.season,
              crop_code: {

                [Op.or]: [
                  { [Op.like]: 'A' + "%" },
                ]
              }
            }
          )


        } else if (req.body.search.user_type == 'HICAR') {
          filterData.push({
            year: req.body.search.year,
            season: req.body.search.season,
            crop_code: {

              [Op.or]: [
                { [Op.like]: 'H' + "%" },
              ]
            }
          })
        }
        else {
          filterData.push({
            year: req.body.search.year,
            season: req.body.search.season,

          })
        }
      }
      else {
        filterData.push({
          year: req.body.search.year,
          season: req.body.search.season,

        })
      }
      condition = {
        where: { [Op.and]: filterData ? filterData : [] },
        include: [
          {
            model: cropModel,
            attributes: []
          }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('bsp_1s.crop_code')), 'crop_code'],
          [sequelize.col('m_crop.crop_name'), 'crop_name'],
          // [sequelize.col('m_crop.crop_name'), 'crop_name'],
        ],

        // group:[
        //   [sequelize.col('bsp_1s.crop_code'), 'crop_code'],
        //   // [sequelize.col('m_crop.crop_name'), 'crop_name']
        //   // [sequelize.col('m_crop.id'), 'id']
        // ],
        raw: true

      };
      data = await db.bsp1Model.findAll(condition);
      // let cropTypeArr=[]
      data.forEach(ele => {
        if (ele.crop_code.slice(0, 1) == "A") {
          ele.crop_type_name = "Agriculture"
          ele.crop_type = "A"
        } else {
          ele.crop_type_name = "Horticulture"
          ele.crop_type = "H"
        }
      });


      if (data) {

        return response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        return response(res, "Data Not Found", 200, {})
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getBsp2cropType = async (req, res) => {
    let data = {};
    try {
      let condition = {}
      let filterData = []
      // let filters = await ConditionCreator.filters(req.body.search);
      if (req.body.search.type == 'report_icar') {
        if (req.body.search.user_type == 'ICAR') {
          filterData.push(
            {
              year: req.body.search.year,
              season: req.body.search.season,
              crop_code: {

                [Op.or]: [
                  { [Op.like]: 'A' + "%" },
                ]
              }
            }
          )


        } else if (req.body.search.user_type == 'HICAR') {
          filterData.push({
            year: req.body.search.year,
            season: req.body.search.season,
            crop_code: {

              [Op.or]: [
                { [Op.like]: 'H' + "%" },
              ]
            }
          })
        }
        else {
          filterData.push({
            year: req.body.search.year,
            season: req.body.search.season,

          })
        }
      }
      else {
        filterData.push({
          year: req.body.search.year,
          season: req.body.search.season,

        })
      }
      condition = {
        where: { [Op.and]: filterData ? filterData : [] },
        include: [
          {
            model: cropModel,
            attributes: []
          }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('bsp_2s.crop_code')), 'crop_code'],
          [sequelize.col('m_crop.crop_name'), 'crop_name'],
          // [sequelize.col('m_crop.crop_name'), 'crop_name'],
        ],

        // group:[
        //   [sequelize.col('bsp_1s.crop_code'), 'crop_code'],
        //   // [sequelize.col('m_crop.crop_name'), 'crop_name']
        //   // [sequelize.col('m_crop.id'), 'id']
        // ],
        raw: true

      };
      data = await db.bsp2Model.findAll(condition);
      // let cropTypeArr=[]
      data.forEach(ele => {
        if (ele.crop_code.slice(0, 1) == "A") {
          ele.crop_type_name = "Agriculture"
          ele.crop_type = "A"
        } else {
          ele.crop_type_name = "Horticulture"
          ele.crop_type = "H"
        }
      });


      if (data) {

        return response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        return response(res, "Data Not Found", 200, {})
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static getBsp3cropType = async (req, res) => {
    let data = {};
    try {
      let condition = {}
      let filterData = []
      // let filters = await ConditionCreator.filters(req.body.search);
      if (req.body.search.type == 'report_icar') {
        if (req.body.search.user_type == 'ICAR') {
          filterData.push(
            {
              year: req.body.search.year,
              season: req.body.search.season,
              crop_code: {

                [Op.or]: [
                  { [Op.like]: 'A' + "%" },
                ]
              }
            }
          )


        } else if (req.body.search.user_type == 'HICAR') {
          filterData.push({
            year: req.body.search.year,
            season: req.body.search.season,
            crop_code: {

              [Op.or]: [
                { [Op.like]: 'H' + "%" },
              ]
            }
          })
        }
        else {
          filterData.push({
            year: req.body.search.year,
            season: req.body.search.season,

          })
        }
      }
      else {
        filterData.push({
          year: req.body.search.year,
          season: req.body.search.season,

        })
      }
      condition = {
        where: { [Op.and]: filterData ? filterData : [] },
        include: [
          {
            model: cropModel,
            attributes: []
          }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('bsp_3.crop_code')), 'crop_code'],
          [sequelize.col('m_crop.crop_name'), 'crop_name'],
          // [sequelize.col('m_crop.crop_name'), 'crop_name'],
        ],

        // group:[
        //   [sequelize.col('bsp_1s.crop_code'), 'crop_code'],
        //   // [sequelize.col('m_crop.crop_name'), 'crop_name']
        //   // [sequelize.col('m_crop.id'), 'id']
        // ],
        raw: true

      };
      data = await db.bsp3Model.findAll(condition);
      // let cropTypeArr=[]
      data.forEach(ele => {
        if (ele.crop_code.slice(0, 1) == "A") {
          ele.crop_type_name = "Agriculture"
          ele.crop_type = "A"
        } else {
          ele.crop_type_name = "Horticulture"
          ele.crop_type = "H"
        }
      });


      if (data) {

        return response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        return response(res, "Data Not Found", 200, {})
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getBsp4cropType = async (req, res) => {
    let data = {};
    try {
      let condition = {}
      let filterData = []
      // let filters = await ConditionCreator.filters(req.body.search);
      if (req.body.search.type == 'report_icar') {
        if (req.body.search.user_type == 'ICAR') {
          filterData.push(
            {
              year: req.body.search.year,
              season: req.body.search.season,
              crop_code: {

                [Op.or]: [
                  { [Op.like]: 'A' + "%" },
                ]
              }
            }
          )


        } else if (req.body.search.user_type == 'HICAR') {
          filterData.push({
            year: req.body.search.year,
            season: req.body.search.season,
            crop_code: {

              [Op.or]: [
                { [Op.like]: 'H' + "%" },
              ]
            }
          })
        }
        else {
          filterData.push({
            year: req.body.search.year,
            season: req.body.search.season,

          })
        }
      }
      else {
        filterData.push({
          year: req.body.search.year,
          season: req.body.search.season,

        })
      }
      condition = {
        where: { [Op.and]: filterData ? filterData : [] },
        include: [
          {
            model: cropModel,
            attributes: []
          }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('bsp_4.crop_code')), 'crop_code'],
          [sequelize.col('m_crop.crop_name'), 'crop_name'],
          // [sequelize.col('m_crop.crop_name'), 'crop_name'],
        ],

        // group:[
        //   [sequelize.col('bsp_1s.crop_code'), 'crop_code'],
        //   // [sequelize.col('m_crop.crop_name'), 'crop_name']
        //   // [sequelize.col('m_crop.id'), 'id']
        // ],
        raw: true

      };
      data = await db.bsp4Model.findAll(condition);
      // let cropTypeArr=[]
      data.forEach(ele => {
        if (ele.crop_code.slice(0, 1) == "A") {
          ele.crop_type_name = "Agriculture"
          ele.crop_type = "A"
        } else {
          ele.crop_type_name = "Horticulture"
          ele.crop_type = "H"
        }
      });


      if (data) {

        return response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        return response(res, "Data Not Found", 200, {})
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getBsp2Year = async (req, res) => {
    let data = {};
    try {
      let condition = {}
      let filterData = []
      // let filters = await ConditionCreator.filters(req.body.search);

      condition = {
        // where: { [Op.and]: filterData ? filterData : [] },

        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('bsp_2.year')), 'year'],
        ],

        // group:[
        //   [sequelize.col('bsp_1s.crop_code'), 'crop_code'],
        //   // [sequelize.col('m_crop.crop_name'), 'crop_name']
        //   // [sequelize.col('m_crop.id'), 'id']
        // ],
        raw: true

      };
      condition.order = [
        [sequelize.col('bsp_2.year'), 'DESC']
      ]
      data = await db.bsp2Model.findAll(condition);



      if (data) {

        return response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        return response(res, "Data Not Found", 200, {})
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getBsp2Season = async (req, res) => {
    let data = {};
    try {
      let condition = {}
      let filterData = []
      let filters = await ConditionCreator.filters(req.body.search);

      condition = {
        where: filters,
        include: [
          {
            model: seasonModel,
            attributes: []

          }

        ],
        // where: { [Op.and]: filterData ? filterData : [] },

        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('bsp_2.season')), 'season_code'],
          [sequelize.col('m_season.season'), 'season_name']

        ],

        // group:[
        //   [sequelize.col('bsp_1s.crop_code'), 'crop_code'],
        //   // [sequelize.col('m_crop.crop_name'), 'crop_name']
        //   // [sequelize.col('m_crop.id'), 'id']
        // ],
        raw: true

      };
      condition.order = [
        [sequelize.col('m_season.season'), 'ASC']
      ]
      data = await db.bsp2Model.findAll(condition);



      if (data) {

        return response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        return response(res, "Data Not Found", 200, {})
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getBsp2cropType = async (req, res) => {
    let data = {};
    try {
      let condition = {}
      let filterData = []
      // let filters = await ConditionCreator.filters(req.body.search);
      if (req.body.search.type == 'report_icar') {
        if (req.body.search.user_type == 'ICAR') {
          filterData.push(
            {
              year: req.body.search.year,
              season: req.body.search.season,
              crop_code: {

                [Op.or]: [
                  { [Op.like]: 'A' + "%" },
                ]
              }
            }
          )


        } else if (req.body.search.user_type == 'HICAR') {
          filterData.push({
            year: req.body.search.year,
            season: req.body.search.season,
            crop_code: {

              [Op.or]: [
                { [Op.like]: 'H' + "%" },
              ]
            }
          })
        }
        else {
          filterData.push({
            year: req.body.search.year,
            season: req.body.search.season,

          })
        }
      }
      else {
        filterData.push({
          year: req.body.search.year,
          season: req.body.search.season,

        })
      }
      condition = {
        where: { [Op.and]: filterData ? filterData : [] },
        include: [
          {
            model: cropModel,
            attributes: []
          }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('bsp_2.crop_code')), 'crop_code'],
          [sequelize.col('m_crop.crop_name'), 'crop_name'],
          // [sequelize.col('m_crop.crop_name'), 'crop_name'],
        ],

        // group:[
        //   [sequelize.col('bsp_1s.crop_code'), 'crop_code'],
        //   // [sequelize.col('m_crop.crop_name'), 'crop_name']
        //   // [sequelize.col('m_crop.id'), 'id']
        // ],
        raw: true

      };
      data = await db.bsp2Model.findAll(condition);
      // let cropTypeArr=[]
      data.forEach(ele => {
        if (ele.crop_code.slice(0, 1) == "A") {
          ele.crop_type_name = "Agriculture"
          ele.crop_type = "A"
        } else {
          ele.crop_type_name = "Horticulture"
          ele.crop_type = "H"
        }
      });


      if (data) {

        return response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        return response(res, "Data Not Found", 200, {})
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getlotNumberyearSecond = async (req, res) => {
    let data = {};
    try {
      let condition = {}
      condition = {
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('lot_number_creations.year')), 'year'],
        ],
        where: {
          user_id: req.body.loginedUserid.id ? req.body.loginedUserid.id : '',
        }

      }
      condition.order = [[sequelize.col('lot_number_creations.year'), 'DESC']]
      data = await db.lotNumberModel.findAll(condition)


      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        return response(res, "Data Not Found", 200, {})
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getlotNumberSeasonSecond = async (req, res) => {
    let data = {};
    try {
      let condition = {}
      condition = {
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('lot_number_creations.season')), 'season'],
        ],
        where: {
          year: req.body.search.year,
          user_id: req.body.loginedUserid.id ? req.body.loginedUserid.id : '',
        }

      }
      data = await db.lotNumberModel.findAll(condition)

      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        return response(res, "Data Not Found", 200, {})
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getlotNumberCropTypeSecond = async (req, res) => {
    let data = {};
    try {
      let condition = {}
      condition = {
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('lot_number_creations.crop_code')), 'crop_code'],
        ],
        where: {
          year: req.body.search.year,
          season: req.body.search.season,
          user_id: req.body.loginedUserid.id ? req.body.loginedUserid.id : '',

        }

      }
      condition.order = [[sequelize.col('lot_number_creations.crop_code'), 'ASC']]
      data = await db.lotNumberModel.findAll(condition)
      let crop_type = []
      if (data && data.length > 0) {
        data.forEach(element => {
          crop_type.push({
            crop_type: element && element.crop_code && (element.crop_code.substring(0, 1) == 'A') ? 'Agriculture' : 'Horticulture',

            crop_Value: element && element.crop_code && (element.crop_code.substring(0, 1) == 'A') ? 'A' : 'H'
          })
        });
      }

      if (crop_type) {
        return response(res, status.DATA_AVAILABLE, 200, crop_type)
      } else {
        return response(res, "Data Not Found", 200, {})
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getlotNumberCropNameSecond = async (req, res) => {
    let data = {};
    try {
      let condition = {}
      condition = {
        include: [
          {
            model: cropModel,
            attributes: [
              'crop_name'
            ]

          }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('lot_number_creations.crop_code')), 'crop_code'],
        ],
        where: {
          year: req.body.search.year,
          season: req.body.search.season,
          crop_code: {
            [Op.like]: req.body.search.crop_type + '%'
          },
          user_id: req.body.loginedUserid.id ? req.body.loginedUserid.id : '',
          // production_center_id: req.body.search.production_center_id,
        },
        raw: true,
      }
      condition.order = [[sequelize.col('m_crop.crop_name'), 'ASC']]

      data = await db.lotNumberModel.findAll(condition)
      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        return response(res, "Data Not Found", 200, {})
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static getlotNumberVarietyNameSecond = async (req, res) => {
    let data = {};
    try {
      let condition = {}
      condition = {
        include: [
          {
            model: varietyModel,
            attributes: ['variety_name']

          }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('lot_number_creations.variety_id')), 'variety_id'],
        ],
        where: {
          year: req.body.search.year,
          season: req.body.search.season,
          crop_code: req.body.search.crop_code,
          user_id: req.body.loginedUserid.id ? req.body.loginedUserid.id : '',
        },
        raw: true,
      }
      condition.order = [[sequelize.col('m_crop_variety.variety_name'), 'ASC']]

      data = await db.lotNumberModel.findAll(condition)
      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        return response(res, "Data Not Found", 200, {})
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }

  }

  static getAssignCropYear = async (req, res) => {
    let data = {};
    try {
      let condition = {}
      condition = {
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('breeder_crops.year')), 'year'],
        ],
        where: {
          production_center_id: req.body.loginedUserid.id
        }

      }
      condition.order = [
        [sequelize.col('breeder_crops.year'), 'DESC']
      ]
      data = await db.breederCropModel.findAll(condition)

      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        return response(res, "Data Not Found", 200, {})
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getAssignCropSeason = async (req, res) => {
    let data = {};
    try {
      let condition = {}
      condition = {
        include: [
          // {
          //   model: seasonModel,

          // }
        ],

        attributes: [
          'season'
          // [sequelize.col('generate_bills.season'),'season']
          // [sequelize.fn('DISTINCT', sequelize.col('generate_bills.season')), 'season'],
          // [sequelize.col('breeder_crops.season'),'season']
          // [sequelize.fn('DISTINCT', sequelize.col('breeder_crops.season')), 'season'],
        ],
        group: [
          'season',

        ],
        raw: true,
        where: {
          year: req.body.search.year,
          production_center_id: req.body.loginedUserid.id
        }

      }
      condition.order = [
        [sequelize.col('season'), 'ASC']
      ]
      data = await db.breederCropModel.findAll(condition)

      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        return response(res, "Data Not Found", 200, {})
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getAssignCropType = async (req, res) => {
    let data = {};
    try {
      let condition = {}
      condition = {
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('breeder_crops.crop_code')), 'crop_code'],
        ],
        where: {
          year: req.body.search.year,
          season: req.body.search.season,
          production_center_id: req.body.loginedUserid.id

        }

      }
      data = await db.breederCropModel.findAll(condition)
      let crop_type = []
      if (data && data.length > 0) {
        data.forEach(element => {
          crop_type.push({
            crop_type: element && element.crop_code && (element.crop_code.substring(0, 1) == 'A') ? 'Agriculture' : 'Horticulture',

            crop_Value: element && element.crop_code && (element.crop_code.substring(0, 1) == 'A') ? 'A' : 'H'
          })
        });
      }
      let removeDuplicate = masterHelper.removeDuplicates(crop_type, 'crop_Value')
      if (removeDuplicate) {
        return response(res, status.DATA_AVAILABLE, 200, removeDuplicate)
      } else {
        return response(res, "Data Not Found", 200, {})
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getAssignCropName = async (req, res) => {
    let data = {};
    try {
      let condition = {}
      condition = {
        include: [
          {
            model: cropModel,

          }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('breeder_crops.crop_code')), 'crop_code'],
        ],
        where: {
          year: req.body.search.year,
          season: req.body.search.season,
          crop_code: {
            [Op.like]: req.body.search.crop_type + '%'
          },
          production_center_id: req.body.loginedUserid.id,
        },
        raw: true,
      }

      condition.order = [
        [sequelize.col('m_crop.crop_name'), 'ASC']
      ]

      data = await db.breederCropModel.findAll(condition)
      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        return response(res, "Data Not Found", 200, {})
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getBspSixFilterData = async (req, res) => {
    try {
      condition = {
        // attributes:[

        // ]
      }
      let data = await db.bsp6Model.findAll(condition)
      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        return response(res, "Data Not Found", 200, {})
      }
    } catch (error) {
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getBspcforseedInventory = async (req, res) => {
    let data = {};
    try {
      let condition = {}

      // let filters = await ConditionCreator.filters(req.body.search);
      condition = {
        where: {
          user_type: 'BPC'
        },
        include: [
          {
            model: agencyDetailModel,
            attributes: [],
            left: true,
            required: true
          }

        ],
        attributes: [
          'name', 'id',
          [sequelize.col('agency_detail.agency_name'), 'agency_name']
        ]
      };


      condition.order = [[sequelize.col('agency_detail.agency_name'), 'ASC']];
      data = await userModel.findAll(condition);

      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        return response(res, "Data Not Found", 200, {})
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getCropforseedInventory = async (req, res) => {
    let data = {};
    try {
      let condition = {}
      condition = {
        attributes: ['crop_name', 'crop_code']

      };


      condition.order = [[sequelize.col('crop_name'), 'ASC']];
      data = await cropModel.findAll(condition);

      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        return response(res, "Data Not Found", 200, {})
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getVarietyforseedInventory = async (req, res) => {
    let data = {};
    try {
      let condition = {}
      condition = {
        attributes: [
          'id', 'variety_name', 'variety_code', 'status'
        ],
        where: {
          crop_code: req.body.search.crop_code,

          [Op.or]: [


            {
              status: {
                [Op.eq]: null
              }

            },
            {
              status: {
                [Op.in]: ['hybrid', 'variety']
              }

            },
            // {
            //   status: {
            //     [Op.eq]:' '
            //   }

            // },

          ]
        },


      };


      condition.order = [[sequelize.col('variety_name'), 'ASC']];
      data = await varietyModel.findAll(condition);

      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        return response(res, "Data Not Found", 200, {})
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static addSeedInventory = async (req, res) => {
    // const t = await sequelizer.transaction();
    try {
      let { date_of_moa } = req.body

      let data = db.seedInventory.build({

        year: req.body.year ? req.body.year : null,
        season: req.body.season ? req.body.season : null,
        crop_code: req.body.crop ? req.body.crop : null,
        variety_code: req.body.variety ? req.body.variety : null,
        developed_by_bspc: req.body.is_developed ? req.body.is_developed : null,
        seed_class_id: req.body.class_of_Seed ? req.body.class_of_Seed : null,
        bspc_id: req.body.BSPC ? req.body.BSPC : null,
        developed_bspc_id: req.body.bspc_developing ? req.body.bspc_developing : 0,
        quantity: req.body.quantity ? req.body.quantity : null,
        moa_number: req.body.reference_of_moa ? req.body.reference_of_moa : null,
        moa_date: date_of_moa ? date_of_moa : null,
        reference_number: req.body.reference_of_office ? req.body.reference_of_office : null,
        stage_id: req.body.stage ? req.body.stage : null,
        officer_order_date: req.body.date_of_office ? req.body.date_of_office : null,
        line_variety_code: req.body.parental_data ? req.body.parental_data : null,
        is_hybrid: req.body.is_hybrid ? req.body.is_hybrid : 0,
        is_active: 1,
        user_id: req.body.loginedUserid && req.body.loginedUserid.id ? req.body.loginedUserid.id : null

      },
        // {
        //   transaction: t 
        // }
      )
      let filterData2 = [];
      if (req.body) {
        if (req.body.variety) {
          filterData2.push({
            variety_code: {
              [Op.eq]: req.body.variety
            }
          })
        }
        if (req.body.class_of_Seed) {
          filterData2.push({
            seed_class_id: {
              [Op.eq]: req.body.class_of_Seed
            }
          })
        }
        if (req.body.loginedUserid && req.body.loginedUserid.id) {
          filterData2.push({
            user_id: {
              [Op.eq]: req.body.loginedUserid.id
            }
          })
        }
        if (req.body.stage) {
          filterData2.push({
            stage_id: {
              [Op.eq]: req.body.stage
            }
          })
        }
        if (req.body.BSPC) {
          filterData2.push({
            bspc_id: {
              [Op.eq]: req.body.BSPC
            }
          })
        }
        if (req.body.year || (req.body.year == null)) {
          filterData2.push({
            year: {
              [Op.eq]: req.body.year ? req.body.year : null
            },
          })

        }
        if (req.body.season || req.body.season == null) {
          filterData2.push({
            season: {
              [Op.eq]: req.body.season ? req.body.season : null
            }
          });
        }
        if (req.body.crop) {
          filterData2.push({
            crop_code: {
              [Op.eq]: req.body.crop
            }
          });
        }
        if (req.body.parental_data) {
          filterData2.push({
            line_variety_code: {
              [Op.eq]: req.body.parental_data
            }
          });
        }

      }


      const checkSeedInventory = await db.seedInventory.findAll({
        where: {

          [Op.and]: filterData2 ? filterData2 : [],
        },

        raw: true
      })
      if (checkSeedInventory && (checkSeedInventory.length > 0)) {
        let responseData = await db.seedInventory.findAll({
          where: {
            [Op.and]: filterData2 ? filterData2 : [],
          },
          include: [
            {
              model: db.cropModel
            },
            {
              model: db.varietyModel
            },
            {
              model: db.stageModel
            },
            {
              model: db.seedClassModel,
              attributes: ['type', 'id']
            }

          ]
        },

        )
        return response(res, status.DATA_SAVE, 400, 'Data Already Filled', responseData)
      }
      else {

        await data.save()
      }
      let saveLot;
      let saveLotArr = []
      let seedInventoryTags = {};
      if (req.body && req.body.employees && req.body.employees != undefined && req.body.employees.length > 0) {
        let lotData = req.body.employees;
        for (let index = 0; index < lotData.length; index++) {
          let lotname = lotData[index].lot_name

          for (let index2 = 0; index2 < lotData[index].skills.length; index2++) {
            const item = lotData[index].skills[index2];

            const dataRow = {
              tag_range: item && item && item.lot_range ? item.lot_range : null,
              seed_inventry_id: data.id,
              quantity: item && item.sum ? parseFloat(item.sum) : null,
              quantity_remaining: item && item.sum ? parseFloat(item.sum) : null,
              bag_size: item && item.bag_size ? item.bag_size : null,
              number_of_tag: item && item.no_of_bags ? item.no_of_bags : null,
              lot_number: lotname,
              quantity_used: 0,
              // transaction:t
            }

            await db.seedInventoryTags.create(dataRow, {

            }).then(function (item) {
              seedInventoryTags = item['_previousDataValues'];
            })
            saveLotArr.push(seedInventoryTags)
          }

        }


      }

      let mappedArray;
      // console.log(saveLotArr,'saveLotArr')
      if (req.body && req.body.lot_details && req.body.lot_details != undefined && req.body.lot_details.length > 0) {
        let lot_details_data = req.body.lot_details;
        mappedArray = lot_details_data.map(item1 => {
          const matchingItem = saveLotArr.find(item2 => item2.lot_number === item1.lot_name && item2.tag_range == item1.lot_range);
          return { ...item1, ...matchingItem };
        });
      }
      if (mappedArray && mappedArray.length > 0) {
        for (let data of mappedArray) {
          const dataRow = {
            is_used: 0,
            seed_inventry_tag_id: data && data.id ? data.id : '',
            tag_number: data && data.tag ? data.tag : '',
            temp_used: 0,
            weight_used: 0,
            weight: data && data.bag_size ? data.bag_size : '',
            weight_remaining: data && data.bag_size ? data.bag_size : '',
            // transaction:t



          }
          db.seedInventoryTagDetails.create(dataRow,
          )
        }
      }
      // await t.commit();
      if (data) {
        let responseData = await db.seedInventory.findAll({
          where: {
            id: data.id,
          },
          include: [
            {
              model: db.cropModel
            },
            {
              model: db.varietyModel
            },
            {
              model: db.stageModel
            },
            {
              model: db.seedClassModel,
              attributes: ['type', 'id']
            }

          ]
        })

        return response(res, status.DATA_SAVE, 200, responseData)
      } else {
        return response(res, status.DATA_NOT_SAVE, 401, {})
      }


    } catch (error) {
      // if(t){
      //   t.rollback()
      // }
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500, error)
    }
  }
  static getseedInventory = async (req, res) => {

    try {
      let filterData2 = []
      if (req.body.search) {

        if (req.body.search.variety_code) {
          filterData2.push({
            variety_code: {
              [Op.eq]: req.body.search.variety_code
            }
          });
        }
        if (req.body.search.bspc_id) {
          filterData2.push({
            bspc_id: {
              [Op.eq]: req.body.search.bspc_id
            }
          });
        }
        if (req.body.search.parental_data) {
          filterData2.push({
            line_variety_code: {
              [Op.eq]: req.body.search.parental_data
            }
          });
        }
        if (req.body.loginedUserid && req.body.loginedUserid.id) {
          filterData2.push({
            user_id: {
              [Op.eq]: req.body.loginedUserid.id
            }
          });
        }
        if (req.body.search.idARR && req.body.search.idARR.length > 0) {
          filterData2.push({
            id: {
              [Op.in]: req.body.search.idARR
            }
          });
        }
        if (req.body.search.crop_code) {
          filterData2.push({
            crop_code: {
              [Op.eq]: req.body.search.crop_code
            }
          });
        }
      }
      const condition = {
        where: {
          [Op.and]: filterData2 ? filterData2 : []

        },
        include: [
          {
            model: cropModel,
            attributes: [],
            required: true
          },
          {
            model: varietyModel,
            attributes: [],
            required: true
          },
          {
            model: db.stageModel,
            attributes: [],
            required: true
          },
          {
            model: db.seedClassModel,
            attributes: [],
            required: true
          },
          // {
          //   model: db.varietLineModel,
          //   attributes: [],
          //   required:true
          // },
          {
            model: db.seedInventoryTag,
            attributes: [],
            required: true
          }

        ],
        required: true,
        attributes: [
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          'id', 'year', 'season', 'crop_code', 'variety_code',
          'stage_id',
          'seed_class_id',
          // [sequelize.col('m_variety_line.line_variety_code'),'line_variety_code'],
          // [sequelize.col('m_variety_line.line_variety_name'),'line_variety_name'],
          [sequelize.col('m_seed_class.type'), 'type'],
          // [sequelize.col('m_seed_class.id'), 'seed_class_id'],
          [sequelize.col('m_seed_class.class_name'), 'class_name'],
          [sequelize.col('stage.stage_field'), 'stage_field'],
          [sequelize.col('m_crop.crop_name'), 'crop_name'],
          [sequelize.col('seed_inventries_tag.lot_number'), 'lot_number'],
          [sequelize.col('seed_inventries_tag.tag_range'), 'tag_range'],
          [sequelize.col('seed_inventries_tag.quantity'), 'quantity'],
          [sequelize.col('seed_inventries_tag.id'), 'seed_tag_id'],
          [sequelize.col('seed_inventries_tag.quantity_remaining'), 'quantity_remaining'],
          'bspc_id',
          'line_variety_code'



        ],
        raw: true

      }
      let { page, pageSize, search } = req.body;
      if (page === undefined) page = 1;
      if (pageSize === undefined) pageSize = 50; // set pageSize to -1 to prevent sizing

      if (page > 0 && pageSize > 0) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }
      let data = await db.seedInventory.findAll(condition)
      let queryData
      let varietLineArr = [];
      if (data && data.length > 0) {
        for (let key in data) {
          queryData = await db.varietLineModel.findAll({
            attributes: ['line_variety_name', 'line_variety_code', 'variety_code'],
            where: {

              variety_code: data && data[key] && data[key].variety_code ? data[key].variety_code : '',
              line_variety_code: data && data[key] && data[key].line_variety_code ? data[key].line_variety_code : '',
            },
            raw: true
          });
          varietLineArr.push(queryData)
        }
      }
      let filterData = []
      if (data && data.length > 0) {
        data.forEach((el, index) => {
          let cropIndex
          if (el && el.line_variety_code) {
            cropIndex = filterData.findIndex(item => item.crop_code == el.crop_code && item.variety_code == el.variety_code && item.line_variety_code == el.line_variety_code);
          } else {
            cropIndex = filterData.findIndex(item => item.crop_code == el.crop_code && item.variety_code == el.variety_code);
          }
          if (cropIndex == -1) {
            filterData.push({
              crop_code: el && el.crop_code ? el.crop_code : '',
              crop_name: el && el.crop_name ? el.crop_name : '',
              variety_name: el && el.variety_name ? el.variety_name : '',
              variety_code: el && el.variety_code ? el.variety_code : '',
              line_variety_code: el && el.line_variety_code ? el.line_variety_code : '',
              seedDetails: [
                {
                  seed_class: el && el.type ? el.type : '',
                  year: el && el.year ? el.year : '',
                  stage_field: el && el.stage_field ? el.stage_field : '',
                  season: el && el.season ? el.season : '',
                  stage_id: el && el.stage_id ? el.stage_id : '',
                  seed_class_id: el && el.seed_class_id ? el.seed_class_id : '',
                  seed_inventry_id: el && el.id ? el.id : '',
                  quantity_remaining: el && el.quantity_remaining ? el.quantity_remaining : '',
                  tag_detail_data: [
                    {
                      tag_range: el && el.tag_range ? el.tag_range : '',
                      quantity: el && el.quantity ? el.quantity : '',
                      lot_number: el && el.lot_number ? el.lot_number : '',
                      seed_inventry_id: el && el.seed_inventry_id ? el.seed_inventry_id : '',
                      seed_tag_id: el && el.seed_tag_id ? el.seed_tag_id : '',
                      quantity_remaining: el && el.quantity_remaining ? el.quantity_remaining : '',
                    }
                  ]
                },

              ]
            })
          }
          else {
            const seedDetailsIndex = filterData[cropIndex].seedDetails.findIndex(item =>
              // console.log(item.year ,'item.year ',item.year , el.year, item.season, el.season,item.stage_id,el.stage_id)
              item.year === el.year && item.season == el.season
              && item.stage_id == el.stage_id && item.seed_class_id == el.seed_class_id
            );
            if (seedDetailsIndex != -1) {
              filterData[cropIndex].seedDetails[seedDetailsIndex].tag_detail_data.push({
                tag_range: el && el.tag_range ? el.tag_range : '',
                quantity: el && el.quantity ? el.quantity : '',
                lot_number: el && el.lot_number ? el.lot_number : '',
                seed_inventry_id: el && el.id ? el.id : '',
                seed_tag_id: el && el.seed_tag_id ? el.seed_tag_id : '',
                quantity_remaining: el && el.quantity_remaining ? el.quantity_remaining : '',
              })

            } else {
              filterData[cropIndex].seedDetails.push(
                {
                  seed_class: el && el.type ? el.type : '',
                  year: el && el.year ? el.year : '',
                  stage_field: el && el.stage_field ? el.stage_field : '',
                  season: el && el.season ? el.season : '',
                  stage_id: el && el.stage_id ? el.stage_id : '',
                  seed_class_id: el && el.seed_class_id ? el.seed_class_id : '',
                  seed_inventry_id: el && el.id ? el.id : '',
                  quantity_remaining: el && el.quantity_remaining ? el.quantity_remaining : '',
                  tag_detail_data: [
                    {
                      tag_range: el && el.tag_range ? el.tag_range : '',
                      quantity: el && el.quantity ? el.quantity : '',
                      lot_number: el && el.lot_number ? el.lot_number : '',
                      seed_inventry_id: el && el.seed_inventry_id ? el.seed_inventry_id : '',
                      seed_tag_id: el && el.seed_tag_id ? el.seed_tag_id : '',
                      quantity_remaining: el && el.quantity_remaining ? el.quantity_remaining : '',
                    }
                  ]
                },
              )
            }
          }
        })
      }

      let reponseData = {
        data: filterData,
        queryData: varietLineArr,
      }
      if (filterData) {
        return response(res, status.DATA_AVAILABLE, 200, reponseData)
      } else {
        return response(res, "Data Not Found", 200, {})
      }

    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500, error)
    }
  }
  static getVarietyLineResponseData = async (data) => {
    try {
      let varietLineData = [];
      let queryData;
      if (data && data.length > 0) {
        for (let key in data) {
          queryData = await db.varietLineModel.findAll({
            attributes: ['line_variety_name'],
            where: {

              variety_code: data && data[key] && data[key].variety_code ? data[key].variety_code : '',
              line_variety_code: data && data[key] && data[key].line_variety_code ? data[key].line_variety_code : '',
            },
            raw: true
          });
          varietLineData.push(...queryData, ...data)
        }
        return varietLineData
        // varietLineData.push(queryData)
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500, error)
    }
  }
  static getseedInventorybyid = async (req, res) => {

    try {
      const condition = {
        where: {
          id: req.body.search.id

        },
        include: [
          {
            model: cropModel,
            attributes: ['crop_name']
          },
          {
            model: varietyModel,
            attributes: ['variety_name']
          },
          {
            model: agencyDetailModel,
            attributes: ['agency_name']
          },
          {
            model: db.stageModel,
            attributes: ['stage_field']
          },
          {
            model: db.seedClassModel,
            attributes: ['type', 'id']
          },

        ]

      }

      let data = await db.seedInventory.findAll(condition)
      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        return response(res, "Data Not Found", 200, {})
      }

    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500, error)
    }
  }
  static UpdateSeedInventory = async (req, res) => {

    try {
      let filterData2 = [];
      if (req.body) {
        if (req.body.variety) {
          filterData2.push({
            variety_code: {
              [Op.eq]: req.body.variety
            }
          })
        }
        if (req.body.parental_data) {
          filterData2.push({
            line_variety_code: {
              [Op.eq]: req.body.parental_data
            }
          });
        }
        if (req.body.bspId) {

          filterData2.push({
            id: {
              [Op.ne]: req.body.bspId
            }
          });
        }
        if (req.body.loginedUserid && req.body.loginedUserid.id) {
          filterData2.push({
            user_id: {
              [Op.eq]: req.body.loginedUserid.id
            }
          })
        }
        if (req.body.class_of_Seed) {
          filterData2.push({
            seed_class_id: {
              [Op.eq]: req.body.class_of_Seed
            }
          })
        }
        if (req.body.stage) {
          filterData2.push({
            stage_id: {
              [Op.eq]: req.body.stage
            }
          })
        }
        if (req.body.BSPC) {
          filterData2.push({
            bspc_id: {
              [Op.eq]: req.body.BSPC
            }
          })
        }
        if (req.body.year || (req.body.year == null)) {
          filterData2.push({
            year: {
              [Op.eq]: req.body.year ? req.body.year : null
            },
          })

        }
        if (req.body.season || req.body.season == null) {
          filterData2.push({
            season: {
              [Op.eq]: req.body.season ? req.body.season : null
            }
          });
        }
        if (req.body.crop) {
          filterData2.push({
            crop_code: {
              [Op.eq]: req.body.crop
            }
          });
        }


      }
      let { bspId } = req.body
      const checkSeedInventory = await db.seedInventory.findAll({
        where: {
          id: {
            [Op.ne]: bspId
          },
          [Op.and]: filterData2 ? filterData2 : []
        },
        raw: true
      })
      if (checkSeedInventory && (checkSeedInventory.length > 0)) {
        return response(res, status.DATA_SAVE, 400, 'Data Already Filled')
      }
      let data = db.seedInventory.update({
        year: req.body.year ? req.body.year : null,
        season: req.body.season ? req.body.season : null,
        crop_code: req.body.crop ? req.body.crop : null,
        variety_code: req.body.variety ? req.body.variety : null,
        developed_by_bspc: req.body.is_developed ? req.body.is_developed : null,
        seed_class_id: req.body.class_of_Seed,
        bspc_id: req.body.BSPC ? req.body.BSPC : null,
        developed_bspc_id: req.body.bspc_developing ? req.body.bspc_developing : 0,
        quantity: req.body.quantity,
        moa_number: req.body.reference_of_moa,
        moa_date: req.body.date_of_moa ? masterHelper.convertDates(req.body.date_of_moa) : null,
        reference_number: req.body.reference_of_office,
        officer_order_date: req.body.date_of_office ? masterHelper.convertDates(req.body.date_of_office) : null,
        stage_id: req.body.stage ? req.body.stage : null,
        line_variety_code: req.body.parental_data ? req.body.parental_data : null,
        is_hybrid: req.body.is_hybrid ? req.body.is_hybrid : 0,
        is_active: 1
      }, {
        where: {
          id: bspId
        }
      })

      const destroTag = await db.seedInventoryTags.destroy({
        where: {
          seed_inventry_id: bspId
        }
      })
      let saveLot;
      let saveLotArr = []
      let seedInventoryTags = {};
      if (req.body && req.body.employees && req.body.employees != undefined && req.body.employees.length > 0) {
        let lotData = req.body.employees;
        for (let index = 0; index < lotData.length; index++) {
          let lotname = lotData[index].lot_name

          for (let index2 = 0; index2 < lotData[index].skills.length; index2++) {
            const item = lotData[index].skills[index2];

            const dataRow = {
              tag_range: item && item && item.lot_range ? item.lot_range : null,
              seed_inventry_id: bspId,
              quantity: item && item.sum ? item.sum : null,
              quantity_remaining: item && item.sum ? item.sum : null,
              bag_size: item && item.bag_size ? item.bag_size : null,
              number_of_tag: item && item.no_of_bags ? item.no_of_bags : null,
              lot_number: lotname
            }
            // saveLot = db.seedInventoryTags.build(dataRow);
            // await saveLot.save()
            await db.seedInventoryTags.create(dataRow).then(function (item) {
              seedInventoryTags = item['_previousDataValues'];
            })
            saveLotArr.push(seedInventoryTags)
          }

        }
      }
      let saveLotDetials
      let saveLotDetialsId = []
      saveLotArr.forEach(el => {
        saveLotDetialsId.push(el && el.id ? el.id : '')
      })
      console.log(saveLotDetialsId, 'saveLotDetialsId')

      const destroyDetailsTag = await db.seedInventoryTagDetails.destroy({
        where: {
          seed_inventry_tag_id: {
            [Op.in]: req.body.seedTagDetailsId
          }
        }
      })
      // if (req.body && req.body.employees && req.body.employees != undefined && req.body.employees.length > 0) {
      //   // let lotData = req.body.employees;
      // if (req.body && req.body.lot_details && req.body.lot_details != undefined && req.body.lot_details.length > 0) {
      //   let lotData = req.body.lot_details;

      //   for (let index = 0; index < lotData.length; index++) {
      //     const dataRow = {
      //       is_used: 0,
      //       seed_inventry_tag_id: saveLot.id,
      //       tag_number: lotData && lotData[index] && lotData[index].tag ? lotData[index].tag:null, 
      //       temp_used: 0,
      //       weight:saveLot && saveLot.bag_size ? (saveLot.bag_size):null, 
      //       weight_used:0,
      //       weight_remaining:saveLot && saveLot.bag_size ? (saveLot.bag_size):null
      //       // weight: item && item.quantity_available ? item.quantity_available : null,
      //       // tag_range:item && item && item.lot_range ?  item.lot_range :null,
      //       // seed_inventry_id:data.id,
      //       // weight:item && item.quantity_available ? item.quantity_available :null,
      //       // bag_size:item && item.bag_size ? item.bag_size :null,
      //       // number_of_tag:item && item.no_of_bags ? item.no_of_bags :null,
      //       // lot_number:lotname
      //     }
      //     saveLotDetials = db.seedInventoryTagDetails.build(dataRow);
      //           await saveLotDetials.save()
      //   }
      // }


      // }

      // if (req.body && req.body.employees && req.body.employees != undefined && req.body.employees.length > 0) {
      //   let lotData = req.body.employees;
      //   for (let index = 0; index < lotData.length; index++) {
      //     let lotname = lotData[index].lot_name

      //     for (let index2 = 0; index2 < lotData[index].skills.length; index2++) {
      //       const item = lotData[index].skills[index2];

      //       const dataRow = {
      //         tag_range: item && item && item.lot_range ? item.lot_range : null,
      //         seed_inventry_id: data.id,
      //         quantity: item && item.quantity_available ? parseFloat(item.quantity_available) : null,
      //         quantity_remaining: item && item.quantity_available ? parseFloat(item.quantity_available ): null,
      //         bag_size: item && item.bag_size ? item.bag_size : null,
      //         number_of_tag: item && item.no_of_bags ? item.no_of_bags : null,
      //         lot_number: lotname,
      //         quantity_used:0
      //       }

      //       // saveLot = db.seedInventoryTags.build(dataRow).then(function(item){
      //       //   seedInventoryTags=  item['_previousDataValues'];
      //       // });
      //       // await saveLot.save()
      //       await db.seedInventoryTags.create(dataRow).then(function (item) {
      //         seedInventoryTags = item['_previousDataValues'];
      //       })
      //        saveLotArr.push(seedInventoryTags)
      //     }

      //   }


      // }
      // const destroyDetailsTag = await db.seedInventoryTagDetails.destroy({
      //   where: {
      //     seed_inventry_tag_id:{
      //       [Op.in]:saveLotArr.id
      //     }
      //   }
      // })

      let mappedArray;
      // // console.log(saveLotArr,'saveLotArr')
      if (req.body && req.body.lot_details && req.body.lot_details != undefined && req.body.lot_details.length > 0) {
        let lot_details_data = req.body.lot_details;
        mappedArray = lot_details_data.map(item1 => {
          const matchingItem = saveLotArr.find(item2 => item2.lot_number === item1.lot_name && item2.tag_range == item1.lot_range);
          return { ...item1, ...matchingItem };
        });
      }
      if (mappedArray && mappedArray.length > 0) {
        for (let data of mappedArray) {
          const dataRow = {
            is_used: 0,
            seed_inventry_tag_id: data && data.id ? data.id : '',
            tag_number: data && data.tag ? data.tag : '',
            temp_used: 0,
            weight_used: 0,
            weight: data && data.bag_size ? data.bag_size : '',
            weight_remaining: data && data.bag_size ? data.bag_size : '',


          }
          db.seedInventoryTagDetails.create(dataRow)
        }
      }
      if (data) {

        return response(res, status.DATA_SAVE, 200, data)
      }

      else {
        return response(res, status.DATA_NOT_SAVE, 401, {})
      }

    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500, error)
    }
  }
  static deleteseedInventorybyid = async (req, res) => {
    let transaction;
    //  const t = await sequelizer.transaction();
    try {

      let data = db.seedInventory.destroy({
        where: {
          id: req.body.search.id
        },
        // transaction: t 

      })
      const detailsId = await db.seedInventoryTag.findAll({
        where: {
          seed_inventry_id: req.body.search.id
        },
        raw: true,
        // transaction: t,
        attributes: ['id']
      })

      let detailsIdArr = []
      if (detailsId && detailsId.length > 0) {
        detailsId.forEach((el, i) => {
          detailsIdArr.push(el && el.id ? el.id : '')
        })
      }
      const datas = await db.seedInventoryTag.destroy({
        where: {
          seed_inventry_id: req.body.search.id
        },
      })

      let datas2 = await db.seedInventoryTagDetails.destroy({
        where: {
          seed_inventry_tag_id: {
            [Op.in]: detailsIdArr
          }
        },
        // transaction: t 

      })
      // await t.commit();
      return response(res, status.DATA_SAVE, 200, data)
      // })

    } catch (error) {
      // if (t){
      //   await t.rollback();
      // }
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getVarietyDataOfSeedInventory = async (req, res) => {

    try {
      const condition = {
        include: [
          {
            model: varietyModel,
            attributes: []

          }

        ],

        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('m_state.variety_code')), 'variety_code'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name']
        ]


      }

      if (req.body.search) {
        if (req.body.search.bspc_id) {
          condition.where.bspc_id = req.body.search.bspc_id;
        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = req.body.search.crop_code;
        }
        if (req.body.search.year) {
          condition.where.year = req.body.search.year;
        }
        if (req.body.search.variety_code) {
          condition.where.variety_code = req.body.search.variety_code;
        }
        if (req.body.search.season) {
          condition.where.season = req.body.search.season;
        }
      }
      let data = await db.seedInventory.findAll(condition)
      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        return response(res, "Data Not Found", 200, {})
      }

    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getStageData = async (req, res) => {

    try {
      const condition = {



      }

      condition.order = [["id", "ASC"]]
      let data = await db.stageModel.findAll(condition)
      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        return response(res, "Data Not Found", 200, {})
      }

    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getLotNumberBySeedInventory = async (req, res) => {

    try {
      const condition = {
        where: {
          id: req.body.search.id

        },
        include: [
          {
            model: db.seedInventoryTags,
            attributes: [],
            // include:[
            //   {
            //     model:db.seedInventoryTagDetail,
            //     attributes:[]
            //   }
            // ]
          }

        ],
        attributes: [
          'id',
          [sequelize.col('seed_inventries_tag.seed_inventry_id'), 'seed_inventry_id'],
          [sequelize.col('seed_inventries_tag.lot_number'), 'lot_number'],
          [sequelize.col('seed_inventries_tag.id'), 'tag_id'],
          [sequelize.col('seed_inventries_tag.tag_range'), 'tag_range'],
          [sequelize.col('seed_inventries_tag.number_of_tag'), 'number_of_tag'],
          [sequelize.col('seed_inventries_tag.bag_size'), 'bag_size'],
          [sequelize.col('seed_inventries_tag.quantity'), 'quantity'],
        ],
        raw: true
      }


      let data = await db.seedInventory.findAll(condition)
      // let length = data.length-1

      console.log(data, 'datadata')
      let dataId = []
      data.forEach((el, i) => {
        dataId.push(el && el.id ? el.id : '')
      })
      let data2 = await db.seedInventoryTag.findAll({
        where: {
          seed_inventry_id: {
            [Op.in]: dataId ? dataId : []
          }
        }, raw: true


      })
      let dataIds = []
      data2.forEach((el, i) => {
        dataIds.push(el && el.id ? el.id : '')
      })

      let data3 = await db.seedInventoryTagDetail.findAll({
        where: {
          seed_inventry_tag_id: {
            [Op.in]: dataId
          }
        },
        raw: true
      })
      console.log(data2, 'data2')
      let filterData = []
      data.forEach((el, index) => {
        const cropIndex = filterData.findIndex(item => item.seed_inventry_id == el.seed_inventry_id && item.lot_number == el.lot_number);
        if (cropIndex == -1) {
          filterData.push(
            {
              "seed_inventry_id": el && el.seed_inventry_id ? el.seed_inventry_id : '',
              "lot_number": el && el.lot_number ? el.lot_number : '',
              "tag_details": data2,
              "variety_count": 1,
              tag_id: el && el.tag_id ? el.tag_id : '',
              "lot_details":
                [
                  {
                    id: el && el.id ? el.id : '',
                    "tag_range": el && el.tag_range ? el.tag_range : '',
                    "number_of_tag": el && el.number_of_tag ? el.number_of_tag : '',
                    "quantity": el && el.quantity ? el.quantity : '',
                    "bag_size": el && el.bag_size ? el.bag_size : '',
                    "bspc_count": 1,

                  }
                ]
            }
          )
        }
        else {
          filterData[cropIndex].lot_details.push({
            id: el && el.id ? el.id : '',
            "tag_range": el && el.tag_range ? el.tag_range : '',
            "number_of_tag": el && el.number_of_tag ? el.number_of_tag : '',
            "quantity": el && el.quantity ? el.quantity : '',
            "bag_size": el && el.bag_size ? el.bag_size : '',
            "bspc_count": 1,
          })
        }


      });
      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, filterData)
      } else {
        return response(res, "Data Not Found", 200, {})
      }

    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500, error)
    }
  }
  static getBspProforma2sListSecond = async (req, res) => {
    let returnResponse = {};
    const { internalCall } = req.body;
    try {
      let rules = {
        'search.year': 'string',
        'search.season': 'string',
        'search.crop_code': 'string',
        'search.user_id': 'required|string',
        'sort': 'string',
        'order': 'string|in:asc,desc',
        'page': 'integer',
        'pageSize': 'integer',
      };

      let validation = new Validator(req.body, rules);

      const isValidData = validation.passes();

      if (!isValidData) {
        returnResponse = {};
        for (let key in rules) {
          const error = validation.errors.get(key);
          if (error.length) {
            returnResponse[key] = error;
          }
        }
        return response(res, status.BAD_REQUEST, 400, returnResponse, internalCall);
      } else {
        let production_type;
        let { search } = req.body;
        if (search.production_type) {
          if (search.production_type == "DELAY") {
            production_type = { production_type: "DELAY" }
          }
          if (search.production_type == "NORMAL") {
            production_type = { production_type: "NORMAL" }
          }
          if (search.production_type == "REALLOCATION") {
            production_type = { production_type: "REALLOCATION" }
          }
        }
        let { page, pageSize } = req.body;

        if (!page) page = 1;

        let condition = {
          include: [
            {
              model: stateModel,
              required: true,
              attributes: []
            },
            {
              model: districtModel,
              required: true,
              attributes: []
            },
            {
              model: varietyModel,
              required: true,
              attributes: []
            },
            {
              model: db.bspPerformaBspTwoSeed,
              required: true,
              attributes: []
            },
            {
              model: db.varietLineModel,
              // required: true,
              attributes: []
            },
          ],
          where: {
            is_active: '1',
            ...production_type
          },
          raw: true,
          attributes: [

            'id', 'variety_code', [sequelize.col('m_crop_variety.variety_name'), 'variety_name'], 'state_code',
            'class_of_seed_sown', 'qty_of_seed_sown',
            [sequelize.col('m_state.state_name'), 'state_name'], 'district_code',
            [sequelize.col('m_district.district_name'), 'district_name'], 'address', 'area_shown', 'date_of_showing',
            'quantity_of_ns_shown', 'quantity_of_bs_shown', 'expected_inspection_from', 'expected_inspection_to',
            'expected_harvest_from', 'expected_harvest_to', 'expected_production',
            [sequelize.col('bsp_proforma_2_seed.seed_class_id'), 'seed_class_id'],
            [sequelize.col('bsp_proforma_2_seed.quantity_sown'), 'quantity_sown'],
            [sequelize.col('m_variety_line.line_variety_name'), 'line_variety_name'],
            [sequelize.col('m_variety_line.line_variety_code'), 'line_variety_code'],
            [sequelize.col('bsp_proforma_2_seed.bsp_proforma_2_id'), 'bsp_proforma_2_id'], 'field_code', 'is_freezed'
            , 'variety_line_code'
          ]
        };

        // const sortOrder = req.body.sort ? req.body.sort : 'id';
        // const sortDirection = req.body.order ? req.body.order : 'DESC';

        if (page && pageSize) {
          page = parseInt(page);
          condition.limit = parseInt(pageSize);
          condition.offset = (page * pageSize) - pageSize;
        }

        condition.order = [[sequelize.col('m_crop_variety.variety_name'), 'ASC'], ['field_code', 'ASC']];

        if (req.body.search) {
          if (req.body.search.year) {
            condition.where.year = (req.body.search.year);

          }

          if (req.body.search.season) {
            condition.where.season = (req.body.search.season);

          }
          if (req.body.search.crop_code) {
            condition.where.crop_code = (req.body.search.crop_code);

          }
          if (req.body.search.variety_code) {
            condition.where.variety_code = {
              [Op.in]: req.body.search.variety_code
            };
          }
          if (req.body.search.user_id) {
            condition.where.user_id = (req.body.search.user_id);
          }
        }

        const queryData = await db.bspPerformaBspTwo.findAndCountAll(condition);
        // console.log(queryData.rows)

        let totalRecord = queryData.count;
        const lastPage = totalRecord ? ((totalRecord % (pageSize) === 0 ? (totalRecord / (pageSize)) : (parseInt(totalRecord / (pageSize)) + 1))) : 0;
        let filterData = [];
        queryData.rows.forEach((el, index) => {

          const varietyIndex = filterData.findIndex(item => item.variety_code == el.variety_code);
          if (varietyIndex == -1) {
            filterData.push({
              variety_code: el && el.variety_code ? el.variety_code : 'NA',
              variety_name: el && el.variety_name ? el.variety_name : 'NA',
              line_variety_name: el && el.line_variety_name ? el.line_variety_name : 'NA',
              variety_line_code: el && el.variety_line_code ? el.variety_line_code : 'NA',
              id: el && el.id ? el.id : '',
              is_freezed: el && el.is_freezed ? el.is_freezed : 0,
              bsp2_Deteials: [
                {
                  bsp_proforma_2_id: el && el.bsp_proforma_2_id ? el.bsp_proforma_2_id : 'NA',
                  state_code: el && el.state_code ? el.state_code : 'NA',
                  field_code: el && el.field_code ? el.field_code : 'NA',
                  line_variety_name: el && el.line_variety_name ? el.line_variety_name : 'NA',
                  variety_line_code: el && el.variety_line_code ? el.variety_line_code : 'NA',
                  state_name: el && el.state_name ? el.state_name : 'NA',
                  district_code: el && el.district_code ? el.district_code : 'NA',
                  district_name: el && el.district_name ? el.district_name : 'NA',
                  address: el && el.address ? el.address : 'NA',
                  area_shown: el && el.area_shown ? el.area_shown : 'NA',
                  date_of_showing: el && el.date_of_showing ? el.date_of_showing : 'NA',
                  quantity_of_bs_shown: el && el.quantity_of_bs_shown ? el.quantity_of_bs_shown : 'NA',
                  quantity_of_ns_shown: el && el.quantity_of_ns_shown ? el.quantity_of_ns_shown : 'NA',
                  expected_inspection_from: el && el.expected_inspection_from ? el.expected_inspection_from : 'NA',
                  expected_inspection_to: el && el.expected_inspection_to ? el.expected_inspection_to : 'NA',
                  expected_harvest_from: el && el.expected_harvest_from ? el.expected_harvest_from : 'NA',
                  expected_harvest_to: el && el.expected_harvest_to ? el.expected_harvest_to : 'NA',
                  seed_class_id: el && el.seed_class_id ? el.seed_class_id : 'NA',

                  quantity_sown: el && el.quantity_sown ? parseFloat(el.quantity_sown) : 0,
                  qty_of_seed_sown: el && el.qty_of_seed_sown ? el.qty_of_seed_sown : 'NA',
                  expected_production: el && el.expected_production ? el.expected_production : 'Na',
                }
              ]


            })
          } else {
            filterData[varietyIndex].bsp2_Deteials.push({
              state_code: el && el.state_code ? el.state_code : 'NA',
              state_name: el && el.state_name ? el.state_name : 'NA',
              bsp_proforma_2_id: el && el.bsp_proforma_2_id ? el.bsp_proforma_2_id : 'NA',
              field_code: el && el.field_code ? el.field_code : 'NA',
              line_variety_name: el && el.line_variety_name ? el.line_variety_name : 'NA',
              variety_line_code: el && el.variety_line_code ? el.variety_line_code : 'NA',
              district_code: el && el.district_code ? el.district_code : 'NA',
              district_name: el && el.district_name ? el.district_name : 'NA',
              address: el && el.address ? el.address : 'NA',
              area_shown: el && el.area_shown ? el.area_shown : 'NA',
              date_of_showing: el && el.date_of_showing ? el.date_of_showing : 'NA',
              quantity_of_bs_shown: el && el.quantity_of_bs_shown ? el.quantity_of_bs_shown : 'NA',
              quantity_of_ns_shown: el && el.quantity_of_ns_shown ? el.quantity_of_ns_shown : 'NA',
              expected_inspection_from: el && el.expected_inspection_from ? el.expected_inspection_from : 'NA',
              expected_inspection_to: el && el.expected_inspection_to ? el.expected_inspection_to : 'NA',
              expected_harvest_from: el && el.expected_harvest_from ? el.expected_harvest_from : 'NA',
              expected_harvest_to: el && el.expected_harvest_to ? el.expected_harvest_to : 'NA',
              seed_class_id: el && el.seed_class_id ? el.seed_class_id : '',
              quantity_sown: el && el.quantity_sown ? parseFloat(el.quantity_sown) : 0,
              expected_production: el && el.expected_production ? el.expected_production : 'NA',
              qty_of_seed_sown: el && el.qty_of_seed_sown ? el.qty_of_seed_sown : 'NA',
            })

          }
          // console.log(el,'queryData.rows')
        })
        totalRecord = filterData.length
        if (lastPage < page) {
          returnResponse = {
            current_page: page,
            per_page: pageSize,
            first_page: 1,
            last_page: lastPage,
            total: totalRecord,
            from: 0,
            to: 0,
            data: [],
          };
          response(res, status.DATA_NOT_AVAILABLE, 200, returnResponse, internalCall);
        } else {
          returnResponse = await paginateResponseRaw(filterData, page, pageSize, totalRecord, lastPage);
          return response(res, status.DATA_AVAILABLE, 200, returnResponse, internalCall);
        }
      }
    } catch (error) {
      returnResponse = {
        error: error.message
      }
      console.log(returnResponse);
      response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }
  static getAllStateList = async (req, res) => {
    try {
      let condition = {


      }

      condition.order = [[sequelize.col('m_states.state_name'), 'ASC']];
      let data = await stateModel.findAndCountAll(condition);


      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      console.log(error)
      return response(res, status.DATA_NOT_AVAILABLE, 500, error);
    }
  }
  static checkLotNamesecond = async (req, res) => {
    try {
      let condition = {}
      const { is_update, seed_inventry_id } = req.body.search;
      let data;
      if (is_update) {
        if (seed_inventry_id) {
          data = await db.seedInventory.findAll({
            attributes: ['id'],
            //  where: {
            //    bspc_id: req.body.search.bsp_id,

            //  },
            where: {
              [Op.and]: [
                {
                  bspc_id: {
                    [Op.ne]: req.body.search.bsp_id
                  }

                },
                {
                  id: {
                    [Op.ne]: seed_inventry_id
                  }

                }

              ]
            },
            raw: true,
          })
        }

      }
      else {
        console.log('hiii')
        data = await db.seedInventory.findAll({
          attributes: ['id'],
          where: {
            bspc_id: req.body.search.bsp_id,

          },

          raw: true,
        })
      }

      let seedInventoryTag;
      let datas = []
      if (is_update) {
        if (seed_inventry_id) {
          if (data && data.length > 0) {
            for (let index = 0; index < data.length; index++) {
              seedInventoryTag = await db.seedInventoryTag.findAll({
                where: {
                  seed_inventry_id: data && data[index] && data[index].id ? data[index].id : '',
                  lot_number: {
                    [Op.or]: req.body.search.lot_name.map(term => ({
                      [Op.iLike]: `${term}` // Using Op.iLike for case-insensitive search
                    }))
                  },
                  seed_inventry_id: {
                    [Op.ne]: seed_inventry_id
                  }

                },
                raw: true
              })
              datas.push(seedInventoryTag)
            }

          }
        }
      } else {
        console.log('hiii2')
        if (data && data.length > 0) {
          for (let index = 0; index < data.length; index++) {
            seedInventoryTag = await db.seedInventoryTag.findAll({
              where: {
                seed_inventry_id: data && data[index] && data[index].id ? data[index].id : '',
                lot_number: {
                  [Op.or]: req.body.search.lot_name.map(term => ({
                    [Op.iLike]: `${term}` // Using Op.iLike for case-insensitive search
                  }))
                }

              },
              raw: true
            })
            datas.push(seedInventoryTag)
          }

        }
      }
      datas = datas ? datas.flat() : '';
      let seedInventoryTagDetails;
      let seedInventoryTagDetailsData = [];

      if (datas && datas.length > 0) {
        for (let index = 0; index < datas.length; index++) {
          console.log(datas && datas[index] && datas[index].id ? datas[index].id : '', req.body.search.tag)
          seedInventoryTagDetails = await db.seedInventoryTagDetails.findAll({
            where: {
              seed_inventry_tag_id: datas && datas[index] && datas[index].id ? datas[index].id : '',
              tag_number: {
                [Op.or]: req.body.search.tag.map(term => ({
                  [Op.iLike]: `${term}` // Using Op.iLike for case-insensitive search
                }))
              }
            },
            raw: true
          })

          seedInventoryTagDetailsData.push(seedInventoryTagDetails)
        }
      }
      seedInventoryTagDetailsData = seedInventoryTagDetailsData ? seedInventoryTagDetailsData.flat() : ''
      if (seedInventoryTagDetailsData) {
        let mappedArray = seedInventoryTagDetailsData.map(item1 => {
          const matchingItem = datas.find(item2 => item2.id === item1.seed_inventry_tag_id);
          return { ...item1, ...matchingItem };
        });
        // console.log(seedInventoryTagDetails,'seedInventoryTagDetailsseedInventoryTagDetails')s
        response(res, status.DATA_AVAILABLE, 200, mappedArray);
      }
      else if (datas && datas.length > 0) {

        response(res, status.DATA_AVAILABLE, 200,);
      }
      else if (data) {
        response(res, status.DATA_AVAILABLE, 200,);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      console.log(error)
      return response(res, status.DATA_NOT_AVAILABLE, 500, error);
    }
  }
  static checkLotName = async (req, res) => {
    try {
      let condition = {}
      const { is_update, seed_inventry_id, year, user_id, bsp_id, season, tag, lot_name, seedtagId } = req.body.search;
      let data;
      if (is_update) {
        console.log('hioiiii')
        let checkLotName = await db.seedInventory.findAll({
          where: {
            user_id: user_id,
            // bspc_id:bsp_id,
            year: year,
            season: season,
            id: {
              [Op.ne]: seed_inventry_id
            }
          },
          include: [
            {
              model: db.seedInventoryTags,
              attributes: [],
              where: {
                lot_number: {
                  [Op.in]: lot_name
                },

              },
              // required:false
              // required:true,                  
            }
          ],
          required: false,
          // required:true,
          raw: true,
        })
        if (checkLotName && checkLotName.length > 0) {
          return response(res, status.DATA_NOT_AVAILABLE, 201, checkLotName);
        }
        else {

          data = await db.seedInventory.findAll({
            where: {
              user_id: user_id,
              // bspc_id:bsp_id,
              year: year,
              season: season,
              // id:{
              //   [Op.ne]:seed_inventry_id
              // } 
            },
            include: [
              {
                model: db.seedInventoryTags,
                attributes: [],
                required: true,
                // required:false,
                include: [{
                  model: db.seedInventoryTagDetail,
                  required: true,
                  // required:false,
                  // where:p
                  attributes: [],
                  where: {
                    tag_number: {
                      [Op.in]: tag
                    },
                    seed_inventry_tag_id: {
                      [Op.notIn]: seedtagId
                    }

                  }
                }]

              }
            ],
            // required:false,
            required: true,
            raw: true,
          })
          return response(res, status.DATA_NOT_AVAILABLE, 202, data);
        }
      } else {
        let checkLotName = await db.seedInventory.findAll({
          where: {
            user_id: user_id,
            bspc_id: bsp_id,
            year: year,
            season: season,
          },
          include: [
            {
              model: db.seedInventoryTags,
              attributes: [],
              where: {
                lot_number: {
                  [Op.in]: lot_name
                },
              },
              required: true,
            }
          ],
          required: true,
          raw: true,
        })
        if (checkLotName && checkLotName.length > 0) {
          return response(res, status.DATA_NOT_AVAILABLE, 201, checkLotName);
        }
        else {

          data = await db.seedInventory.findAll({
            where: {
              user_id: user_id,
              bspc_id: bsp_id,
              year: year,
              season: season,
            },
            include: [
              {
                model: db.seedInventoryTags,
                attributes: [],
                required: true,
                include: [{
                  model: db.seedInventoryTagDetail,
                  required: true,
                  // where:p
                  attributes: [],
                  where: {
                    tag_number: {
                      [Op.in]: tag
                    }
                  }
                }]

              }
            ],
            required: true,
            raw: true,
          })
          return response(res, status.DATA_NOT_AVAILABLE, 202, data);
        }
      }
    }
    catch (error) {
      console.log(error)
      return response(res, status.DATA_NOT_AVAILABLE, 500, error);
    }
  }

  static getParentalData = async (req, res) => {
    let returnResponse = {};
    const { internalCall } = req.body;
    try {
      let rules = {
        'search.year': 'string',
        'search.season': 'string',
        'search.crop_code': 'string',
        // 'search.variety_code': 'string',
        'sort': 'string',
        'order': 'string|in:asc,desc',
        'page': 'integer',
        'pageSize': 'integer',
      };

      let validation = new Validator(req.body, rules);

      const isValidData = validation.passes();

      if (!isValidData) {
        returnResponse = {};
        for (let key in rules) {
          const error = validation.errors.get(key);
          if (error.length) {
            returnResponse[key] = error;
          }
        }
        return response(res, status.BAD_REQUEST, 400, returnResponse, internalCall);
      } else {

        let { page, pageSize } = req.body;

        if (!page) page = 1;

        let condition = {


        };

        // const sortOrder = req.body.sort ? req.body.sort : 'id';
        // const sortDirection = req.body.order ? req.body.order : 'DESC';

        // if (page && pageSize) {
        //   page = parseInt(page);
        //   condition.limit = parseInt(pageSize);
        //   condition.offset = (page * pageSize) - pageSize;
        // }

        // condition.order = [[sortOrder, sortDirection]];

        // if (req.body.search) {
        //   if (req.body.search.year) {
        //     condition.where.year = (req.body.search.year);
        //   }
        //   if (req.body.search.season) {
        //     condition.where.season = (req.body.search.season);
        //   }
        //   // if (req.body.search.crop_code) {
        //   //   condition.where.crop_code = (req.body.search.crop_code);
        //   // }
        //   if (req.body.search.variety_code) {
        //     console.log(req.body.search.variety_code,'eq.body.search.variety_code')
        //     condition.where.variety_code = {
        //       [Op.eq]: req.body.search.variety_code
        //     };
        //   }
        //   // if (req.body.search.user_id) {
        //   //   condition.where.user_id = (req.body.search.user_id);
        //   // }
        // }

        const queryData = await db.varietLineModel.findAll({
          where: {
            variety_code: req.body.search.variety_code

          }
        });
        // console.log(queryData.rows)
        if (queryData) {

          response(res, status.DATA_AVAILABLE, 200, queryData, internalCall);
        } else {
          response(res, status.DATA_NOT_AVAILABLE, 200, '', internalCall);
        }

      }
    } catch (error) {
      returnResponse = {
        error: error.message
      }
      console.log(returnResponse);
      response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }
  static getWiilingProduceVarietyDataSecond = async (req, res) => {
    try {
      // let filter = await ConditionCreator.bspcNewFlowFilter(req.body.search);
      let fileterIndData = []
      if (req.body.search) {
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




      }
      let condition = {
        include: [
          {
            model: varietyModel,
            attributes: []
          }
        ],
        where: {
          [Op.and]: fileterIndData ? fileterIndData : [],
          // user_id: req.body.loginedUserid.id

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
      return response(res, status.DATA_AVAILABLE, 200, data);
    } catch (error) {
      console.log(error)
      return response(res, status.UNEXPECTED_ERROR, 500, []);
    }
  }
  static getUserData = async (req, res) => {
    let returnResponse = {};
    const { internalCall } = req.body;
    try {
      let rules = {
        'search.user_id': 'string',

      };

      let validation = new Validator(req.body, rules);

      const isValidData = validation.passes();

      if (!isValidData) {
        returnResponse = {};
        for (let key in rules) {
          const error = validation.errors.get(key);
          if (error.length) {
            returnResponse[key] = error;
          }
        }
        return response(res, status.BAD_REQUEST, 400, returnResponse, internalCall);
      } else {


        let condition = {
          include: [
            {
              model: designationModel,
              attributes: []
            },
            {
              model: stateModel,
              attributes: []
            },
            {
              model: districtModel,
              attributes: []
            },
          ],
          raw: true,
          attributes: [

            'agency_name', 'user_id', 'address', 'contact_person_name',
            [sequelize.col('m_designation.name'), 'designation'],
            [sequelize.col('m_state.state_name'), 'state_name'],
            [sequelize.col('m_district.district_name'), 'district_name'],
          ],
          where: {
            user_id: req.body.search.user_id
          }
        };




        const queryData = await db.agencyDetailModel.findAll(condition);

        if (queryData) {
          response(res, status.DATA_AVAILABLE, 200, queryData);
        } else {
          response(res, status.DATA_NOT_AVAILABLE, 200, returnResponse, 'No data Found');
        }
        // console.log(queryData.rows)


      }
    } catch (error) {
      returnResponse = {
        error: error.message
      }
      console.log(error);
      response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }

  static getUserDataReport = async (req, res) => {
    let returnResponse = {};
    const { internalCall } = req.body;
    try {
      let rules = {
        'search.user_id': 'string',
      };
      let validation = new Validator(req.body, rules);
      const isValidData = validation.passes();
      if (!isValidData) {
        returnResponse = {};
        for (let key in rules) {
          const error = validation.errors.get(key);
          if (error.length) {
            returnResponse[key] = error;
          }
        }
        return response(res, status.BAD_REQUEST, 400, returnResponse, internalCall);
      } else {
        let condition = {
          include: [
            {
              model: designationModel,
              attributes: []
            },
            {
              model: districtModel,
              attributes: []
            },
            {
              model: stateModel,
              attributes: []
            },

          ],
          raw: true,
          attributes: [
            'agency_name', 'user_id', 'address', 'contact_person_name',
            [sequelize.col('m_designation.name'), 'designation'],
            [sequelize.col('m_state.state_name'), 'state_name'],
            [sequelize.col('m_district.district_name'), 'district_name']
          ],
          where: {
            user_id: req.body.search.user_id
          }
        };
        const queryData = await db.agencyDetailModel.findAll(condition);
        if (queryData) {
          response(res, status.DATA_AVAILABLE, 200, queryData);
        } else {
          response(res, status.DATA_NOT_AVAILABLE, 200, returnResponse, 'No data Found');
        }
      }
    } catch (error) {
      returnResponse = {
        error: error.message
      }
      console.log(error);
      response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }
  static bsp2year = async (req, res) => {
    let returnResponse = {};
    // const { internalCall } = req.body;
    try {

      let condition = {
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('bsp_proforma_2s.year')), 'year']
        ],
        raw: true,


      };



      const queryData = await db.bspPerformaBspTwo.findAll(condition);
      console.log(queryData, 'quer')
      if (queryData) {
        response(res, status.DATA_AVAILABLE, 200, queryData,);
      } else {
        response(res, status.DATA_NOT_AVAILABLE, 200, 'No data Found');
      }
      // console.log(queryData.rows)


    } catch (error) {
      returnResponse = {
        error: error.message
      }
      console.log(returnResponse);
      response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }

  static getBsp2SeasonData = async (req, res) => {
    let returnResponse = {};
    const { internalCall } = req.body;
    try {
      let rules = {
        'search.year': 'string',
        // 'search.season': 'string',
        // 'search.crop_code': 'string',
        // 'search.variety_code': 'string',
        // 'search.line_variety_code': 'string',
        // 'search.id': 'string',
      };

      let validation = new Validator(req.body, rules);

      const isValidData = validation.passes();

      if (!isValidData) {
        returnResponse = {};
        for (let key in rules) {
          const error = validation.errors.get(key);
          if (error.length) {
            returnResponse[key] = error;
          }
        }
        return response(res, status.BAD_REQUEST, 400, returnResponse, internalCall);
      }

      let condition = {
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('bsp_proforma_2s.season')), 'season']
        ],
        where: {
          year: req.body.search.year
        },
        raw: true

      };

      if (req.body.search) {
        // if (req.body.search.year) {
        //   condition.where.year = {
        //     [Op.eq]: req.body.search.year
        //   };
        // }

        if (req.body.search.crop_code) {
          condition.where.crop_code = {
            [Op.in]: req.body.search.crop_code.toString().split(',')
          };
        }
        if (req.body.search.variety_code) {
          condition.where.variety_code = {
            [Op.in]: req.body.search.variety_code.toString().split(',')
          };
        }
        if (req.body.search.line_variety_code) {
          condition.where.line_variety_code = {
            [Op.in]: req.body.search.line_variety_code.toString().split(',')
          };
        }
        if (req.body.search.id) {
          condition.where.seed_class_id = {
            [Op.in]: req.body.search.id.toString().split(',')
          };
        }
        if (req.body.search.user_id) {
          condition.where.bspc_id = {
            [Op.in]: req.body.search.user_id.toString().split(',')
          };
        }
      }

      // condition.order = [[sequelize.col('m_seed_class.type'), 'asc']];
      returnResponse = await db.bspPerformaBspTwo.findAll(condition);

      response(res, status.DATA_AVAILABLE, 200, returnResponse, internalCall);
    } catch (error) {
      returnResponse = {
        error: error.message
      }
      console.log(returnResponse);
      response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }
  static getBsp2CropData = async (req, res) => {
    let returnResponse = {};
    const { internalCall } = req.body;
    try {
      let rules = {
        'search.year': 'string',
        'search.season': 'string',
        // 'search.crop_code': 'string',
        // 'search.variety_code': 'string',
        // 'search.line_variety_code': 'string',
        // 'search.id': 'string',
      };

      let validation = new Validator(req.body, rules);

      const isValidData = validation.passes();

      if (!isValidData) {
        returnResponse = {};
        for (let key in rules) {
          const error = validation.errors.get(key);
          if (error.length) {
            returnResponse[key] = error;
          }
        }
      }

      let condition = {
        include: [
          {
            model: cropModel,
            attributes: []
          }

        ],
        where: {
          year: req.body.search.year,
          season: req.body.search.season
          // crop_code:req.body.search.crop_code
        },
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('bsp_proforma_2s.crop_code')), 'crop_code'],
          [sequelize.col('m_crop.crop_name'), 'crop_name']
        ],
        raw: true

      };
      condition.order = [[sequelize.col('m_crop.crop_name'), 'ASC']]


      // condition.order = [[sequelize.col('m_seed_class.type'), 'asc']];
      returnResponse = await db.bspPerformaBspTwo.findAll(condition);

      response(res, status.DATA_AVAILABLE, 200, returnResponse, internalCall);
    } catch (error) {
      returnResponse = {
        error: error.message
      }
      console.log(returnResponse);
      response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }
  static getBsp2List = async (req, res) => {
    let returnResponse = {};
    const { internalCall } = req.body;
    try {
      let production_type;
      let { search } = req.body;
      if (search.production_type) {
        if (search.production_type == "DELAY") {
          production_type = { production_type: "DELAY" }
        }
        if (search.production_type == "NORMAL") {
          production_type = { production_type: "NORMAL" }
        }
        if (search.production_type == "REALLOCATION") {
          production_type = { production_type: "REALLOCATION" }
        }
      }
      let rules = {
        'search.year': 'string',
        'search.season': 'string',
        'search.crop_code': 'string',
        'sort': 'string',
        'order': 'string|in:asc,desc',
        'page': 'integer',
        'pageSize': 'integer',
      };

      let validation = new Validator(req.body, rules);

      const isValidData = validation.passes();

      if (!isValidData) {
        returnResponse = {};
        for (let key in rules) {
          const error = validation.errors.get(key);
          if (error.length) {
            returnResponse[key] = error;
          }
        }
        return response(res, status.BAD_REQUEST, 400, returnResponse, internalCall);
      } else {

        let { page, pageSize } = req.body;

        if (!page) page = 1;

        let condition = {
          include: [
            {
              model: stateModel,
              required: true,
              attributes: []
            },
            {
              model: districtModel,
              required: true,
              attributes: []
            },
            {
              model: varietyModel,
              required: true,
              attributes: []
            },
            {
              model: cropModel,
              required: true,
              attributes: []
            },
            {
              model: db.varietLineModel,
              // required: true,
              attributes: []
            },

          ],
          where: {
            is_active: '1',
            ...production_type
          },
          raw: true,
          attributes: [

            'id', 'variety_code', [sequelize.col('m_crop_variety.variety_name'), 'variety_name'], 'state_code',
            [sequelize.col('m_state.state_name'), 'state_name'], 'district_code',
            [sequelize.col('m_district.district_name'), 'district_name'], 'address', 'area_shown', 'date_of_showing',
            'quantity_of_ns_shown', 'quantity_of_bs_shown', 'expected_inspection_from', 'expected_inspection_to',
            'expected_harvest_from', 'expected_harvest_to', 'expected_production',
            [sequelize.col('m_crop.crop_name'), 'crop_name'],
            'crop_code',
            [sequelize.col('m_variety_line.line_variety_name'), 'line_variety_name'],
            [sequelize.col('m_variety_line.line_variety_code'), 'line_variety_code'],
            'field_code', 'is_freezed'
            , 'variety_line_code', 'ref_number'
          ]
        };

        if (page && pageSize) {
          page = parseInt(page);
          condition.limit = parseInt(pageSize);
          condition.offset = (page * pageSize) - pageSize;
        }

        condition.order = [[sequelize.col('m_crop_variety.variety_name'), 'ASC'], ['field_code', 'ASC']];

        if (req.body.search) {
          if (req.body.search.year) {
            condition.where.year = (req.body.search.year);
          }
          if (req.body.search.season) {
            condition.where.season = (req.body.search.season);
          }
          if (req.body.search.crop_code) {
            condition.where.crop_code = (req.body.search.crop_code);
          }
          if (req.body.search.variety_code) {
            condition.where.variety_code = {
              [Op.in]: req.body.search.variety_code
            };
          }
          if (req.body.search.user_id) {
            condition.where.user_id = (req.body.search.user_id);
          }
        }
        let directIndentVarietyListTotalArr = [];
        const queryData = await db.bspPerformaBspTwo.findAndCountAll(condition);
        let bsp1VarietyList;
        let directIndentVarietyListTotal;
        let bsp1VarietyListArr = [];
        let carryOverData;
        let carryOverDataArr = []

        if (queryData && queryData.rows && queryData.rows.length > 0) {
          for (let key in queryData.rows) {
            bsp1VarietyList = await db.bspPerformaBspOne.findAll({
              include: [
                {
                  model: db.bspProformaOneBspc,
                  required: true,
                  where: {
                    bspc_id: req.body.search.user_id,
                    ...production_type
                  },
                  attributes: []
                },
                // {
                // model: db.bspPerformaBspTwo,
                // as: 'bspOneTwoVC',
                // required: false,
                // where: {
                // is_active: 1
                // },
                // attributes: []
                // },
                {
                  model: varietyModel,
                  required: true,
                  attributes: []
                }
              ],
              where: {
                is_active: 1,
                year: req.body.search.year,
                season: req.body.search.season,
                crop_code: req.body.search.crop_code,
                is_active: 1,
                variety_code: queryData.rows[key].variety_code,
                variety_line_code: queryData.rows[key].variety_line_code ? queryData.rows[key].variety_line_code : '',
                // ...production_type
                // ['$bspOneTwoVC.id$']: null
              },
              // group: ['bsp_proforma_1s.variety_code', 'm_crop_variety.variety_name', 'bsp_proforma_1s.variety_code'],
              // group: ['bsp_proforma_1s.variety_code', 'm_crop_variety.variety_name', 'bsp_proforma_1s.variety_code'],
              raw: true,
              attributes: [
                'id',
                [sequelize.col('bsp_proforma_1s.variety_code'), 'variety_code'],
                [sequelize.col('bsp_proforma_1s.variety_line_code'), 'variety_line_code'],
                // [sequelize.literal('SUM(bsp_proforma_1_bspc.target_qunatity)'), 'target_quantity'],
                [sequelize.col('bsp_proforma_1_bspc.target_qunatity'), 'target_quantity'],
              ]
            });
            bsp1VarietyListArr.push(bsp1VarietyList)
            // console.log(bsp1VarietyListArr,'bsp1VarietyList')
          }
          for (let key in queryData.rows) {
            carryOverData = await db.carryOverSeedModel.findAll({

              where: {
                is_active: 1,
                year: req.body.search.year,
                season: req.body.search.season,
                crop_code: req.body.search.crop_code,
                user_id: req.body.search.user_id,
                is_active: 1,
                variety_code: queryData.rows[key].variety_code,
                variety_line_code: queryData.rows[key].variety_line_code ? queryData.rows[key].variety_line_code : '',
                meet_target: 2,
                ...production_type
                // ['$bspOneTwoVC.id$']: null
              },
              // group: ['bsp_proforma_1s.variety_code', 'm_crop_variety.variety_name', 'bsp_proforma_1s.variety_code'],
              // group: ['bsp_proforma_1s.variety_code', 'm_crop_variety.variety_name', 'bsp_proforma_1s.variety_code'],
              raw: true,
              attributes: [
                'id',
                [sequelize.col('carry_over_seed.variety_code'), 'variety_code'],
                [sequelize.col('carry_over_seed.variety_line_code'), 'variety_line_code'],
                // [sequelize.literal('SUM(bsp_proforma_1_bspc.target_qunatity)'), 'target_quantity'],
                [sequelize.col('carry_over_seed.total_qty'), 'carry_total_qty'],
                [sequelize.col('carry_over_seed.meet_target'), 'meet_target'],
              ]
            });
            carryOverDataArr.push(carryOverData)
            // console.log(bsp1VarietyListArr,'bsp1VarietyList')
          }
        }
        if (queryData && queryData.rows && queryData.rows.length > 0) {
          for (let key in queryData.rows) {
            directIndentVarietyListTotal = await db.directIndent.findAll({

              include: [

                {
                  model: varietyModel,
                  required: true,
                  attributes: []
                },
                {
                  model: db.indentOfBrseedDirectLineModel,
                  required: false,
                  attributes: [],
                  where: {
                    variety_code_line: queryData.rows[key].variety_line_code ? queryData.rows[key].variety_line_code : '',
                    // user_id:req.body.search.user_id
                  }
                }
              ],
              where: {
                is_active: 1,
                year: req.body.search.year,
                season: req.body.search.season,
                crop_code: req.body.search.crop_code,
                is_active: 1,
                user_id: req.body.search.user_id,
                variety_code: queryData.rows[key].variety_code,
                // ['$directIndentVC.id$']: null
              },
              group: ['indent_of_breederseed_direct.id', 'indent_of_breederseed_direct.variety_code', 'm_crop_variety.variety_name', 'indent_of_brseed_direct_line.variety_code_line', 'indent_of_breederseed_direct.quantity'],
              raw: true,
              attributes: [
                [sequelize.col('indent_of_breederseed_direct.variety_code'), 'variety_code'],
                [sequelize.col('indent_of_breederseed_direct.quantity'), 'total_qty'],
                [sequelize.literal('SUM(indent_of_brseed_direct_line.quantity)'), 'quantity'],
                [sequelize.col('indent_of_brseed_direct_line.variety_code_line'), 'variety_code_line'],
                [sequelize.literal("string_agg( DISTINCT(indent_of_brseed_direct_line.id::varchar), ',' )"), 'indent_of_brseed_direct_line_ids'],

              ]
            });
            directIndentVarietyListTotalArr.push(directIndentVarietyListTotal)
          }

        }
        let totalRecord = queryData.count
        const lastPage = totalRecord ? ((totalRecord % (pageSize) === 0 ? (totalRecord / (pageSize)) : (parseInt(totalRecord / (pageSize)) + 1))) : 0;
        let filterData = [];
        if (queryData && queryData.rows && queryData.rows.length > 0) {

          queryData.rows.forEach((el, index) => {
            const varietyIndex = filterData.findIndex(item => item.variety_code == el.variety_code);
            if (varietyIndex == -1) {
              filterData.push({
                variety_code: el && el.variety_code ? el.variety_code : 'NA',
                variety_name: el && el.variety_name ? el.variety_name : 'NA',
                crop_code: el && el.crop_code ? el.crop_code : 'NA',
                crop_name: el && el.crop_name ? el.crop_name : 'NA',
                ref_number: el && el.ref_number ? el.ref_number : 'NA',
                line_variety_name: el && el.line_variety_name ? el.line_variety_name : 'NA',
                variety_line_code: el && el.variety_line_code ? el.variety_line_code : 'NA',
                id: el && el.id ? el.id : '',
                is_freezed: el && el.is_freezed ? el.is_freezed : 0,
                line_variety_code_details: [
                  {
                    line_variety_name: el && el.line_variety_name ? el.line_variety_name : '',
                    variety_line_code: el && el.variety_line_code ? el.variety_line_code : '',
                    bsp2_Deteials: [
                      {
                        bsp_proforma_2_id: el && el.bsp_proforma_2_id ? el.bsp_proforma_2_id : 'NA',
                        state_code: el && el.state_code ? el.state_code : 'NA',
                        field_code: el && el.field_code ? el.field_code : 'NA',
                        line_variety_name: el && el.line_variety_name ? el.line_variety_name : 'NA',
                        variety_line_code: el && el.variety_line_code ? el.variety_line_code : 'NA',
                        state_name: el && el.state_name ? el.state_name : 'NA',
                        district_code: el && el.district_code ? el.district_code : 'NA',
                        district_name: el && el.district_name ? el.district_name : 'NA',
                        address: el && el.address ? el.address : 'NA',
                        area_shown: el && el.area_shown ? (el.area_shown.toFixed(2)) : 'NA',
                        date_of_showing: el && el.date_of_showing ? el.date_of_showing : 'NA',
                        quantity_of_bs_shown: el && el.quantity_of_bs_shown ? el.quantity_of_bs_shown : 'NA',
                        quantity_of_ns_shown: el && el.quantity_of_ns_shown ? el.quantity_of_ns_shown : 'NA',
                        expected_inspection_from: el && el.expected_inspection_from ? el.expected_inspection_from : 'NA',
                        expected_inspection_to: el && el.expected_inspection_to ? el.expected_inspection_to : 'NA',
                        expected_harvest_from: el && el.expected_harvest_from ? el.expected_harvest_from : 'NA',
                        expected_harvest_to: el && el.expected_harvest_to ? el.expected_harvest_to : 'NA',
                        seed_class_id: el && el.seed_class_id ? el.seed_class_id : 'NA',
                        quantity_sown: el && el.quantity_sown ? (parseFloat(el.quantity_sown)).toFixed(2) : 0,
                        qty_of_seed_sown: el && el.qty_of_seed_sown ? el.qty_of_seed_sow.toFixed(2) : 'NA',
                        expected_production: el && el.expected_production ? el.expected_production : 'Na',
                      }
                    ]
                  }
                ]
              })
            } else {
              let lineVarietyIndex
              if (el.variety_line_code && el.variety_line_code != '' && el.variety_line_code != null && el.variety_line_code != 'NA') {
                lineVarietyIndex = filterData[varietyIndex].line_variety_code_details.findIndex(item => item.variety_line_code == el.variety_line_code);
                if (lineVarietyIndex != -1) {
                  filterData[varietyIndex].line_variety_code_details[lineVarietyIndex].bsp2_Deteials.push({
                    state_code: el && el.state_code ? el.state_code : 'NA',
                    state_name: el && el.state_name ? el.state_name : 'NA',
                    bsp_proforma_2_id: el && el.bsp_proforma_2_id ? el.bsp_proforma_2_id : 'NA',
                    field_code: el && el.field_code ? el.field_code : 'NA',
                    line_variety_name: el && el.line_variety_name ? el.line_variety_name : 'NA',
                    variety_line_code: el && el.variety_line_code ? el.variety_line_code : 'NA',
                    district_code: el && el.district_code ? el.district_code : 'NA',
                    district_name: el && el.district_name ? el.district_name : 'NA',
                    address: el && el.address ? el.address : 'NA',
                    area_shown: el && el.area_shown ? el.area_shown.toFixed(2) : 'NA',
                    date_of_showing: el && el.date_of_showing ? el.date_of_showing : 'NA',
                    quantity_of_bs_shown: el && el.quantity_of_bs_shown ? el.quantity_of_bs_shown : 'NA',
                    quantity_of_ns_shown: el && el.quantity_of_ns_shown ? el.quantity_of_ns_shown : 'NA',
                    expected_inspection_from: el && el.expected_inspection_from ? el.expected_inspection_from : 'NA',
                    expected_inspection_to: el && el.expected_inspection_to ? el.expected_inspection_to : 'NA',
                    expected_harvest_from: el && el.expected_harvest_from ? el.expected_harvest_from : 'NA',
                    expected_harvest_to: el && el.expected_harvest_to ? el.expected_harvest_to : 'NA',
                    seed_class_id: el && el.seed_class_id ? el.seed_class_id : '',
                    quantity_sown: el && el.quantity_sown ? (parseFloat(el.quantity_sown)).toFixed(2) : 0,
                    expected_production: el && el.expected_production ? (el.expected_production.toFixed(2)) : 'NA',
                    qty_of_seed_sown: el && el.qty_of_seed_sown ? el.qty_of_seed_sown : 'NA',
                  })
                } else {
                  filterData[varietyIndex].line_variety_code_details.push(
                    {
                      line_variety_name: el && el.line_variety_name ? el.line_variety_name : '',
                      variety_line_code: el && el.variety_line_code ? el.variety_line_code : '',
                      bsp2_Deteials: [
                        {
                          bsp_proforma_2_id: el && el.bsp_proforma_2_id ? el.bsp_proforma_2_id : 'NA',
                          state_code: el && el.state_code ? el.state_code : 'NA',
                          field_code: el && el.field_code ? el.field_code : 'NA',
                          line_variety_name: el && el.line_variety_name ? el.line_variety_name : 'NA',
                          variety_line_code: el && el.variety_line_code ? el.variety_line_code : 'NA',
                          state_name: el && el.state_name ? el.state_name : 'NA',
                          district_code: el && el.district_code ? el.district_code : 'NA',
                          district_name: el && el.district_name ? el.district_name : 'NA',
                          address: el && el.address ? el.address : 'NA',
                          area_shown: el && el.area_shown ? el.area_shown.toFixed(2) : 'NA',
                          date_of_showing: el && el.date_of_showing ? el.date_of_showing : 'NA',
                          quantity_of_bs_shown: el && el.quantity_of_bs_shown ? el.quantity_of_bs_shown : 'NA',
                          quantity_of_ns_shown: el && el.quantity_of_ns_shown ? el.quantity_of_ns_shown : 'NA',
                          expected_inspection_from: el && el.expected_inspection_from ? el.expected_inspection_from : 'NA',
                          expected_inspection_to: el && el.expected_inspection_to ? el.expected_inspection_to : 'NA',
                          expected_harvest_from: el && el.expected_harvest_from ? el.expected_harvest_from : 'NA',
                          expected_harvest_to: el && el.expected_harvest_to ? el.expected_harvest_to : 'NA',
                          seed_class_id: el && el.seed_class_id ? el.seed_class_id : 'NA',
                          quantity_sown: el && el.quantity_sown ? (parseFloat(el.quantity_sown)).toFixed(2) : 0,
                          qty_of_seed_sown: el && el.qty_of_seed_sown ? el.qty_of_seed_sown.toFixed(2) : 'NA',
                          expected_production: el && el.expected_production ? el.expected_production : 'Na',
                        }
                      ]
                    }
                  )
                }
              }
              else {
                filterData[varietyIndex].line_variety_code_details[0].bsp2_Deteials.push(

                  {

                    bsp_proforma_2_id: el && el.bsp_proforma_2_id ? el.bsp_proforma_2_id : 'NA',
                    state_code: el && el.state_code ? el.state_code : 'NA',
                    field_code: el && el.field_code ? el.field_code : 'NA',
                    line_variety_name: el && el.line_variety_name ? el.line_variety_name : 'NA',
                    variety_line_code: el && el.variety_line_code ? el.variety_line_code : 'NA',
                    state_name: el && el.state_name ? el.state_name : 'NA',
                    district_code: el && el.district_code ? el.district_code : 'NA',
                    district_name: el && el.district_name ? el.district_name : 'NA',
                    address: el && el.address ? el.address : 'NA',
                    area_shown: el && el.area_shown ? el.area_shown : 'NA',
                    date_of_showing: el && el.date_of_showing ? el.date_of_showing : 'NA',
                    quantity_of_bs_shown: el && el.quantity_of_bs_shown ? el.quantity_of_bs_shown : 'NA',
                    quantity_of_ns_shown: el && el.quantity_of_ns_shown ? el.quantity_of_ns_shown : 'NA',
                    expected_inspection_from: el && el.expected_inspection_from ? el.expected_inspection_from : 'NA',
                    expected_inspection_to: el && el.expected_inspection_to ? el.expected_inspection_to : 'NA',
                    expected_harvest_from: el && el.expected_harvest_from ? el.expected_harvest_from : 'NA',
                    expected_harvest_to: el && el.expected_harvest_to ? el.expected_harvest_to : 'NA',
                    seed_class_id: el && el.seed_class_id ? el.seed_class_id : 'NA',
                    quantity_sown: el && el.quantity_sown ? parseFloat(el.quantity_sown) : 0,
                    qty_of_seed_sown: el && el.qty_of_seed_sown ? el.qty_of_seed_sown : 'NA',
                    expected_production: el && el.expected_production ? el.expected_production : 'Na',
                  }

                )

              }


            }
            // console.log(el,'queryData.rows')
          })
        }
        if (lastPage < page) {
          returnResponse = {
            current_page: page,
            per_page: pageSize,
            first_page: 1,
            last_page: lastPage,
            total: totalRecord,
            from: 0,
            to: 0,
            data: [],
          };
          response(res, status.DATA_NOT_AVAILABLE, 200, returnResponse, internalCall);
        } else {
          const responseData = {
            bsp1VarietyListArr: bsp1VarietyListArr,
            directIndentVarietyListTotalArr: directIndentVarietyListTotalArr
          }
          returnResponse = await paginateResponseRaw(filterData, page, pageSize, totalRecord, lastPage);
          returnResponse.bsp1VarietyListArr = bsp1VarietyListArr;
          returnResponse.directIndentVarietyListTotalArr = directIndentVarietyListTotalArr;
          returnResponse.carryOverData = carryOverDataArr
          returnResponse.filterData = filterData
          return response(res, status.DATA_AVAILABLE, 200, returnResponse, internalCall, responseData);
        }
      }
    } catch (error) {
      returnResponse = {
        error: error.message
      }
      console.log(error);
      response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }
  static delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  static mergeArraysToString = async (arr) => {
    let result = '';
    for (const element of arr) {
      // Simulate an asynchronous operation (you can replace this with your actual async logic)
      await this.delay(100);
      // Append the current element to the result
      result += (result.length > 0 ? ',' : '') + element;
    }
    return result;
  }

  static getAllStateListData = async (req, res) => {
    try {
      let condition = {
        where: {
          is_state: req.body.is_state ? req.body.is_state : 1
        }

      }

      condition.order = [[sequelize.col('m_states.state_name'), 'ASC']];
      let data = await stateModel.findAndCountAll(condition);


      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      console.log(error)
      return response(res, status.DATA_NOT_AVAILABLE, 500, error);
    }
  }

  // static getBsp2ListReport = async (req, res) => {
  //   let returnResponse = {};
  //   const { internalCall } = req.body;
  //   try {
  //     let rules = {
  //       'search.year': 'string',
  //       'search.season': 'string',
  //       'search.crop_code': 'string',
  //       'sort': 'string',
  //       'order': 'string|in:asc,desc',
  //       'page': 'integer',
  //       'pageSize': 'integer',
  //     };

  //     let validation = new Validator(req.body, rules);

  //     const isValidData = validation.passes();

  //     if (!isValidData) {
  //       returnResponse = {};
  //       for (let key in rules) {
  //         const error = validation.errors.get(key);
  //         if (error.length) {
  //           returnResponse[key] = error;
  //         }
  //       }
  //       return response(res, status.BAD_REQUEST, 400, returnResponse, internalCall);
  //     } else {

  //       let { page, pageSize } = req.body;

  //       if (!page) page = 1;

  //       let condition = {
  //         include: [
  //           {
  //             model: stateModel,
  //             required: true,
  //             attributes: []
  //           },
  //           {
  //             model: districtModel,
  //             required: true,
  //             attributes: []
  //           },
  //           {
  //             model: varietyModel,
  //             required: true,
  //             attributes: []
  //           },
  //           {
  //             model: cropModel,
  //             required: true,
  //             attributes: []
  //           },
  //           {
  //             model: db.varietLineModel,
  //             // required: true,
  //             attributes: []
  //           },
  //         ],
  //         where: {
  //           is_active: '1',
  //         },
  //         raw: true,
  //         attributes: [

  //           'id', 'variety_code', [sequelize.col('m_crop_variety.variety_name'), 'variety_name'], 'state_code',
  //           [sequelize.col('m_state.state_name'), 'state_name'], 'district_code',
  //           [sequelize.col('m_district.district_name'), 'district_name'], 'address', 'area_shown', 'date_of_showing',
  //           'quantity_of_ns_shown', 'quantity_of_bs_shown', 'expected_inspection_from', 'expected_inspection_to',
  //           'expected_harvest_from', 'expected_harvest_to', 'expected_production',
  //           [sequelize.col('m_crop.crop_name'), 'crop_name'],
  //           'crop_code','year',
  //           [sequelize.col('m_variety_line.line_variety_name'), 'line_variety_name'],
  //           [sequelize.col('m_variety_line.line_variety_code'), 'line_variety_code'],
  //           'field_code', 'is_freezed'
  //           , 'variety_line_code', 'ref_number'
  //         ]
  //       };

  //       if (page && pageSize) {
  //         page = parseInt(page);
  //         condition.limit = parseInt(pageSize);
  //         condition.offset = (page * pageSize) - pageSize;
  //       }

  //       condition.order = [[sequelize.col('m_crop_variety.variety_name'), 'ASC'], ['field_code', 'ASC']];

  //       if (req.body.search) {
  //         if (req.body.search.year) {
  //           condition.where.year = (req.body.search.year);
  //         }
  //         if (req.body.search.season) {
  //           condition.where.season = (req.body.search.season);
  //         }
  //         if (req.body.search.crop_code) {
  //           condition.where.crop_code = (req.body.search.crop_code);
  //         }
  //         if (req.body.search.variety_code) {
  //           condition.where.variety_code = {
  //             [Op.in]: req.body.search.variety_code
  //           };
  //         }
  //         if (req.body.search.user_id) {
  //           condition.where.user_id = (req.body.search.user_id);
  //         }
  //       }
  //       let directIndentVarietyListTotalArr = [];
  //       const queryData = await db.bspPerformaBspTwo.findAndCountAll(condition);
  //       let bsp1VarietyList;
  //       let directIndentVarietyListTotal;
  //       let bsp1VarietyListArr = [];

  //       if (queryData && queryData.rows && queryData.rows.length > 0) {
  //         for (let key in queryData.rows) {
  //           bsp1VarietyList = await db.bspPerformaBspOne.findAll({
  //             include: [
  //               {
  //                 model: db.bspProformaOneBspc,
  //                 required: true,
  //                 where: {
  //                   bspc_id: req.body.search.user_id
  //                 },
  //                 attributes: []
  //               },
  //               // {
  //               // model: db.bspPerformaBspTwo,
  //               // as: 'bspOneTwoVC',
  //               // required: false,
  //               // where: {
  //               // is_active: 1
  //               // },
  //               // attributes: []
  //               // },
  //               {
  //                 model: varietyModel,
  //                 required: true,
  //                 attributes: []
  //               }
  //             ],
  //             where: {
  //               is_active: 1,
  //               year: req.body.search.year,
  //               season: req.body.search.season,
  //               crop_code: req.body.search.crop_code,
  //               is_active: 1,
  //               variety_code: queryData.rows[key].variety_code,
  //               variety_line_code: queryData.rows[key].variety_line_code ? queryData.rows[key].variety_line_code : '',
  //               // ['$bspOneTwoVC.id$']: null
  //             },
  //             // group: ['bsp_proforma_1s.variety_code', 'm_crop_variety.variety_name', 'bsp_proforma_1s.variety_code'],
  //             // group: ['bsp_proforma_1s.variety_code', 'm_crop_variety.variety_name', 'bsp_proforma_1s.variety_code'],
  //             raw: true,
  //             attributes: [
  //               'id',
  //               [sequelize.col('bsp_proforma_1s.variety_code'), 'variety_code'],
  //               [sequelize.col('bsp_proforma_1s.variety_line_code'), 'variety_line_code'],
  //               // [sequelize.literal('SUM(bsp_proforma_1_bspc.target_qunatity)'), 'target_quantity'],
  //               [sequelize.col('bsp_proforma_1_bspc.target_qunatity'), 'target_quantity'],
  //             ]
  //           });
  //           bsp1VarietyListArr.push(bsp1VarietyList)
  //           // console.log(bsp1VarietyListArr,'bsp1VarietyList')
  //         }
  //       }
  //       if (queryData && queryData.rows && queryData.rows.length > 0) {
  //         for (let key in queryData.rows) {
  //           directIndentVarietyListTotal = await db.directIndent.findAll({

  //             include: [

  //               {
  //                 model: varietyModel,
  //                 required: true,
  //                 attributes: []
  //               },
  //               {
  //                 model: db.indentOfBrseedDirectLineModel,
  //                 required: false,
  //                 attributes: [],
  //                 where: {
  //                   variety_code_line: queryData.rows[key].variety_line_code ? queryData.rows[key].variety_line_code : '',
  //                   // user_id:req.body.search.user_id
  //                 }
  //               }
  //             ],
  //             where: {
  //               is_active: 1,
  //               year: req.body.search.year,
  //               season: req.body.search.season,
  //               crop_code: req.body.search.crop_code,
  //               is_active: 1,
  //               user_id: req.body.search.user_id,
  //               variety_code: queryData.rows[key].variety_code,
  //               // ['$directIndentVC.id$']: null
  //             },
  //             group: ['indent_of_breederseed_direct.id', 'indent_of_breederseed_direct.variety_code', 'm_crop_variety.variety_name', 'indent_of_brseed_direct_line.variety_code_line'],
  //             raw: true,
  //             attributes: [
  //               [sequelize.col('indent_of_breederseed_direct.variety_code'), 'variety_code'],
  //               [sequelize.literal('SUM(indent_of_brseed_direct_line.quantity)'), 'quantity'],
  //               [sequelize.col('indent_of_brseed_direct_line.variety_code_line'), 'variety_code_line'],
  //               [sequelize.literal("string_agg( DISTINCT(indent_of_brseed_direct_line.id::varchar), ',' )"), 'indent_of_brseed_direct_line_ids'],

  //             ]
  //           });
  //           directIndentVarietyListTotalArr.push(directIndentVarietyListTotal)
  //         }

  //       }
  //       let totalRecord = queryData.count
  //       const lastPage = totalRecord ? ((totalRecord % (pageSize) === 0 ? (totalRecord / (pageSize)) : (parseInt(totalRecord / (pageSize)) + 1))) : 0;
  //       let filterData = [];
  //       if (queryData && queryData.rows && queryData.rows.length > 0) {

  //         queryData.rows.forEach((el, index) => {
  //           const varietyIndex = filterData.findIndex(item => item.variety_code == el.variety_code);
  //           if (varietyIndex == -1) {
  //             filterData.push({
  //               variety_code: el && el.variety_code ? el.variety_code : 'NA',
  //               variety_name: el && el.variety_name ? el.variety_name : 'NA',
  //               year:el && el.year ? el.year :"NA",
  //               crop_code: el && el.crop_code ? el.crop_code : 'NA',
  //               crop_name: el && el.crop_name ? el.crop_name : 'NA',
  //               line_variety_name: el && el.line_variety_name ? el.line_variety_name : 'NA',
  //               ref_number: el && el.ref_number ? el.ref_number : 'NA',
  //               variety_line_code: el && el.variety_line_code ? el.variety_line_code : 'NA',
  //               id: el && el.id ? el.id : '',
  //               is_freezed: el && el.is_freezed ? el.is_freezed : 0,
  //               line_variety_code_details: [
  //                 {
  //                   line_variety_name: el && el.line_variety_name ? el.line_variety_name : '',
  //                   variety_line_code: el && el.variety_line_code ? el.variety_line_code : '',
  //                   bsp2_Deteials: [
  //                     {
  //                       bsp_proforma_2_id: el && el.bsp_proforma_2_id ? el.bsp_proforma_2_id : 'NA',
  //                       state_code: el && el.state_code ? el.state_code : 'NA',
  //                       field_code: el && el.field_code ? el.field_code : 'NA',
  //                       line_variety_name: el && el.line_variety_name ? el.line_variety_name : 'NA',
  //                       variety_line_code: el && el.variety_line_code ? el.variety_line_code : 'NA',
  //                       state_name: el && el.state_name ? el.state_name : 'NA',
  //                       district_code: el && el.district_code ? el.district_code : 'NA',
  //                       district_name: el && el.district_name ? el.district_name : 'NA',
  //                       address: el && el.address ? el.address : 'NA',
  //                       area_shown: el && el.area_shown ? el.area_shown : 'NA',
  //                       date_of_showing: el && el.date_of_showing ? el.date_of_showing : 'NA',
  //                       quantity_of_bs_shown: el && el.quantity_of_bs_shown ? el.quantity_of_bs_shown : 'NA',
  //                       quantity_of_ns_shown: el && el.quantity_of_ns_shown ? el.quantity_of_ns_shown : 'NA',
  //                       expected_inspection_from: el && el.expected_inspection_from ? el.expected_inspection_from : 'NA',
  //                       expected_inspection_to: el && el.expected_inspection_to ? el.expected_inspection_to : 'NA',
  //                       expected_harvest_from: el && el.expected_harvest_from ? el.expected_harvest_from : 'NA',
  //                       expected_harvest_to: el && el.expected_harvest_to ? el.expected_harvest_to : 'NA',
  //                       seed_class_id: el && el.seed_class_id ? el.seed_class_id : 'NA',
  //                       quantity_sown: el && el.quantity_sown ? parseFloat(el.quantity_sown) : 0,
  //                       qty_of_seed_sown: el && el.qty_of_seed_sown ? el.qty_of_seed_sown : 'NA',
  //                       expected_production: el && el.expected_production ? el.expected_production : 'Na',
  //                     }
  //                   ]
  //                 }
  //               ]
  //             })
  //           } else {
  //             let lineVarietyIndex
  //             if (el.variety_line_code && el.variety_line_code != '' && el.variety_line_code != null && el.variety_line_code != 'NA') {
  //               lineVarietyIndex = filterData[varietyIndex].line_variety_code_details.findIndex(item => item.variety_line_code == el.variety_line_code);
  //               if (lineVarietyIndex != -1) {
  //                 filterData[varietyIndex].line_variety_code_details[lineVarietyIndex].bsp2_Deteials.push({
  //                   state_code: el && el.state_code ? el.state_code : 'NA',
  //                   state_name: el && el.state_name ? el.state_name : 'NA',
  //                   bsp_proforma_2_id: el && el.bsp_proforma_2_id ? el.bsp_proforma_2_id : 'NA',
  //                   field_code: el && el.field_code ? el.field_code : 'NA',
  //                   line_variety_name: el && el.line_variety_name ? el.line_variety_name : 'NA',
  //                   variety_line_code: el && el.variety_line_code ? el.variety_line_code : 'NA',
  //                   district_code: el && el.district_code ? el.district_code : 'NA',
  //                   district_name: el && el.district_name ? el.district_name : 'NA',
  //                   address: el && el.address ? el.address : 'NA',
  //                   area_shown: el && el.area_shown ? el.area_shown : 'NA',
  //                   date_of_showing: el && el.date_of_showing ? el.date_of_showing : 'NA',
  //                   quantity_of_bs_shown: el && el.quantity_of_bs_shown ? el.quantity_of_bs_shown : 'NA',
  //                   quantity_of_ns_shown: el && el.quantity_of_ns_shown ? el.quantity_of_ns_shown : 'NA',
  //                   expected_inspection_from: el && el.expected_inspection_from ? el.expected_inspection_from : 'NA',
  //                   expected_inspection_to: el && el.expected_inspection_to ? el.expected_inspection_to : 'NA',
  //                   expected_harvest_from: el && el.expected_harvest_from ? el.expected_harvest_from : 'NA',
  //                   expected_harvest_to: el && el.expected_harvest_to ? el.expected_harvest_to : 'NA',
  //                   seed_class_id: el && el.seed_class_id ? el.seed_class_id : '',
  //                   quantity_sown: el && el.quantity_sown ? parseFloat(el.quantity_sown) : 0,
  //                   expected_production: el && el.expected_production ? el.expected_production : 'NA',
  //                   qty_of_seed_sown: el && el.qty_of_seed_sown ? el.qty_of_seed_sown : 'NA',
  //                 })
  //               } else {
  //                 filterData[varietyIndex].line_variety_code_details.push(
  //                   {
  //                     line_variety_name: el && el.line_variety_name ? el.line_variety_name : '',
  //                     variety_line_code: el && el.variety_line_code ? el.variety_line_code : '',
  //                     bsp2_Deteials: [
  //                       {
  //                         bsp_proforma_2_id: el && el.bsp_proforma_2_id ? el.bsp_proforma_2_id : 'NA',
  //                         state_code: el && el.state_code ? el.state_code : 'NA',
  //                         field_code: el && el.field_code ? el.field_code : 'NA',
  //                         line_variety_name: el && el.line_variety_name ? el.line_variety_name : 'NA',
  //                         variety_line_code: el && el.variety_line_code ? el.variety_line_code : 'NA',
  //                         state_name: el && el.state_name ? el.state_name : 'NA',
  //                         district_code: el && el.district_code ? el.district_code : 'NA',
  //                         district_name: el && el.district_name ? el.district_name : 'NA',
  //                         address: el && el.address ? el.address : 'NA',
  //                         area_shown: el && el.area_shown ? el.area_shown : 'NA',
  //                         date_of_showing: el && el.date_of_showing ? el.date_of_showing : 'NA',
  //                         quantity_of_bs_shown: el && el.quantity_of_bs_shown ? el.quantity_of_bs_shown : 'NA',
  //                         quantity_of_ns_shown: el && el.quantity_of_ns_shown ? el.quantity_of_ns_shown : 'NA',
  //                         expected_inspection_from: el && el.expected_inspection_from ? el.expected_inspection_from : 'NA',
  //                         expected_inspection_to: el && el.expected_inspection_to ? el.expected_inspection_to : 'NA',
  //                         expected_harvest_from: el && el.expected_harvest_from ? el.expected_harvest_from : 'NA',
  //                         expected_harvest_to: el && el.expected_harvest_to ? el.expected_harvest_to : 'NA',
  //                         seed_class_id: el && el.seed_class_id ? el.seed_class_id : 'NA',
  //                         quantity_sown: el && el.quantity_sown ? parseFloat(el.quantity_sown) : 0,
  //                         qty_of_seed_sown: el && el.qty_of_seed_sown ? el.qty_of_seed_sown : 'NA',
  //                         expected_production: el && el.expected_production ? el.expected_production : 'Na',
  //                       }
  //                     ]
  //                   }
  //                 )
  //               }
  //             }
  //             else {
  //               filterData[varietyIndex].line_variety_code_details[0].bsp2_Deteials.push(

  //                 {

  //                   bsp_proforma_2_id: el && el.bsp_proforma_2_id ? el.bsp_proforma_2_id : 'NA',
  //                   state_code: el && el.state_code ? el.state_code : 'NA',
  //                   field_code: el && el.field_code ? el.field_code : 'NA',
  //                   line_variety_name: el && el.line_variety_name ? el.line_variety_name : 'NA',
  //                   variety_line_code: el && el.variety_line_code ? el.variety_line_code : 'NA',
  //                   state_name: el && el.state_name ? el.state_name : 'NA',
  //                   district_code: el && el.district_code ? el.district_code : 'NA',
  //                   district_name: el && el.district_name ? el.district_name : 'NA',
  //                   address: el && el.address ? el.address : 'NA',
  //                   area_shown: el && el.area_shown ? el.area_shown : 'NA',
  //                   date_of_showing: el && el.date_of_showing ? el.date_of_showing : 'NA',
  //                   quantity_of_bs_shown: el && el.quantity_of_bs_shown ? el.quantity_of_bs_shown : 'NA',
  //                   quantity_of_ns_shown: el && el.quantity_of_ns_shown ? el.quantity_of_ns_shown : 'NA',
  //                   expected_inspection_from: el && el.expected_inspection_from ? el.expected_inspection_from : 'NA',
  //                   expected_inspection_to: el && el.expected_inspection_to ? el.expected_inspection_to : 'NA',
  //                   expected_harvest_from: el && el.expected_harvest_from ? el.expected_harvest_from : 'NA',
  //                   expected_harvest_to: el && el.expected_harvest_to ? el.expected_harvest_to : 'NA',
  //                   seed_class_id: el && el.seed_class_id ? el.seed_class_id : 'NA',
  //                   quantity_sown: el && el.quantity_sown ? parseFloat(el.quantity_sown) : 0,
  //                   qty_of_seed_sown: el && el.qty_of_seed_sown ? el.qty_of_seed_sown : 'NA',
  //                   expected_production: el && el.expected_production ? el.expected_production : 'Na',
  //                 }

  //               )

  //             }


  //           }
  //           // console.log(el,'queryData.rows')
  //         })
  //       }
  //       if (lastPage < page) {
  //         returnResponse = {
  //           current_page: page,
  //           per_page: pageSize,
  //           first_page: 1,
  //           last_page: lastPage,
  //           total: totalRecord,
  //           from: 0,
  //           to: 0,
  //           data: [],
  //         };
  //         response(res, status.DATA_NOT_AVAILABLE, 200, returnResponse, internalCall);
  //       } else {
  //         const responseData = {
  //           bsp1VarietyListArr: bsp1VarietyListArr,
  //           directIndentVarietyListTotalArr: directIndentVarietyListTotalArr
  //         }
  //         returnResponse = await paginateResponseRaw(filterData, page, pageSize, totalRecord, lastPage);
  //         returnResponse.bsp1VarietyListArr = bsp1VarietyListArr;
  //         returnResponse.directIndentVarietyListTotalArr = directIndentVarietyListTotalArr
  //         returnResponse.filterData = filterData
  //         return response(res, status.DATA_AVAILABLE, 200, returnResponse, internalCall, responseData);
  //       }
  //     }
  //   } catch (error) {
  //     returnResponse = {
  //       error: error.message
  //     }
  //     console.log(error);
  //     response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
  //   }
  // }
  static getBsp2ListReport = async (req, res) => {
    let returnResponse = {};
    const { internalCall } = req.body;
    try {
      let rules = {
        'search.year': 'string',
        'search.season': 'string',
        'search.crop_code': 'string',
        'sort': 'string',
        'order': 'string|in:asc,desc',
        'page': 'integer',
        'pageSize': 'integer',
      };

      let validation = new Validator(req.body, rules);

      const isValidData = validation.passes();

      if (!isValidData) {
        returnResponse = {};
        for (let key in rules) {
          const error = validation.errors.get(key);
          if (error.length) {
            returnResponse[key] = error;
          }
        }
        return response(res, status.BAD_REQUEST, 400, returnResponse, internalCall);
      } else {

        let { page, pageSize } = req.body;

        if (!page) page = 1;

        let condition = {
          include: [
            {
              model: stateModel,
              required: true,
              attributes: []
            },
            {
              model: districtModel,
              required: true,
              attributes: []
            },
            {
              model: varietyModel,
              required: true,
              attributes: []
            },
            {
              model: cropModel,
              required: true,
              attributes: []
            },
            {
              model: db.varietLineModel,
              // required: true,
              attributes: []
            },
          ],
          where: {
            is_active: '1',
          },
          raw: true,
          attributes: [

            'id', 'variety_code', [sequelize.col('m_crop_variety.variety_name'), 'variety_name'], 'state_code',
            [sequelize.col('m_state.state_name'), 'state_name'], 'district_code',
            [sequelize.col('m_district.district_name'), 'district_name'], 'address', 'area_shown', 'date_of_showing',
            'quantity_of_ns_shown', 'quantity_of_bs_shown', 'expected_inspection_from', 'expected_inspection_to',
            'expected_harvest_from', 'expected_harvest_to', 'expected_production',
            [sequelize.col('m_crop.crop_name'), 'crop_name'],
            'crop_code',
            [sequelize.col('m_variety_line.line_variety_name'), 'line_variety_name'],
            [sequelize.col('m_variety_line.line_variety_code'), 'line_variety_code'],
            'field_code', 'is_freezed'
            , 'variety_line_code', 'ref_number', 'year'
          ]
        };

        if (page && pageSize) {
          page = parseInt(page);
          condition.limit = parseInt(pageSize);
          condition.offset = (page * pageSize) - pageSize;
        }

        condition.order = [[sequelize.col('m_crop_variety.variety_name'), 'ASC'], ['field_code', 'ASC']];

        if (req.body.search) {
          if (req.body.search.year) {
            condition.where.year = (req.body.search.year);
          }
          if (req.body.search.season) {
            condition.where.season = (req.body.search.season);
          }
          if (req.body.search.crop_code) {
            condition.where.crop_code = (req.body.search.crop_code);
          }
          if (req.body.search.variety_code) {
            condition.where.variety_code = {
              [Op.in]: req.body.search.variety_code
            };
          }
          if (req.body.search.user_id) {
            condition.where.user_id = (req.body.search.user_id);
          }
        }
        let directIndentVarietyListTotalArr = [];
        const queryData = await db.bspPerformaBspTwo.findAndCountAll(condition);
        let bsp1VarietyList;
        let directIndentVarietyListTotal;
        let bsp1VarietyListArr = [];
        let carryOverData;
        let carryOverDataArr = []

        if (queryData && queryData.rows && queryData.rows.length > 0) {
          for (let key in queryData.rows) {
            bsp1VarietyList = await db.bspPerformaBspOne.findAll({
              include: [
                {
                  model: db.bspProformaOneBspc,
                  required: true,
                  where: {
                    bspc_id: req.body.search.user_id
                  },
                  attributes: []
                },
                // {
                // model: db.bspPerformaBspTwo,
                // as: 'bspOneTwoVC',
                // required: false,
                // where: {
                // is_active: 1
                // },
                // attributes: []
                // },
                {
                  model: varietyModel,
                  required: true,
                  attributes: []
                }
              ],
              where: {
                is_active: 1,
                year: req.body.search.year,
                season: req.body.search.season,
                crop_code: req.body.search.crop_code,
                is_active: 1,
                variety_code: queryData.rows[key].variety_code,
                variety_line_code: queryData.rows[key].variety_line_code ? queryData.rows[key].variety_line_code : '',
                // ['$bspOneTwoVC.id$']: null
              },
              // group: ['bsp_proforma_1s.variety_code', 'm_crop_variety.variety_name', 'bsp_proforma_1s.variety_code'],
              // group: ['bsp_proforma_1s.variety_code', 'm_crop_variety.variety_name', 'bsp_proforma_1s.variety_code'],
              raw: true,
              attributes: [
                'id',
                [sequelize.col('bsp_proforma_1s.variety_code'), 'variety_code'],
                [sequelize.col('bsp_proforma_1s.variety_line_code'), 'variety_line_code'],
                // [sequelize.literal('SUM(bsp_proforma_1_bspc.target_qunatity)'), 'target_quantity'],
                [sequelize.col('bsp_proforma_1_bspc.target_qunatity'), 'target_quantity'],
              ]
            });
            bsp1VarietyListArr.push(bsp1VarietyList)
            // console.log(bsp1VarietyListArr,'bsp1VarietyList')
          }
          for (let key in queryData.rows) {
            carryOverData = await db.carryOverSeedModel.findAll({

              where: {
                is_active: 1,
                year: req.body.search.year,
                season: req.body.search.season,
                crop_code: req.body.search.crop_code,
                user_id: req.body.search.user_id,
                is_active: 1,
                variety_code: queryData.rows[key].variety_code,
                variety_line_code: queryData.rows[key].variety_line_code ? queryData.rows[key].variety_line_code : '',
                meet_target: 2,
                // ['$bspOneTwoVC.id$']: null
              },
              // group: ['bsp_proforma_1s.variety_code', 'm_crop_variety.variety_name', 'bsp_proforma_1s.variety_code'],
              // group: ['bsp_proforma_1s.variety_code', 'm_crop_variety.variety_name', 'bsp_proforma_1s.variety_code'],
              raw: true,
              attributes: [
                'id',
                [sequelize.col('carry_over_seed.variety_code'), 'variety_code'],
                [sequelize.col('carry_over_seed.variety_line_code'), 'variety_line_code'],
                // [sequelize.literal('SUM(bsp_proforma_1_bspc.target_qunatity)'), 'target_quantity'],
                [sequelize.col('carry_over_seed.total_qty'), 'carry_total_qty'],
                [sequelize.col('carry_over_seed.meet_target'), 'meet_target'],
              ]
            });
            carryOverDataArr.push(carryOverData)
            // console.log(bsp1VarietyListArr,'bsp1VarietyList')
          }
        }
        if (queryData && queryData.rows && queryData.rows.length > 0) {
          for (let key in queryData.rows) {
            directIndentVarietyListTotal = await db.directIndent.findAll({

              include: [

                {
                  model: varietyModel,
                  required: true,
                  attributes: []
                },
                {
                  model: db.indentOfBrseedDirectLineModel,
                  required: false,
                  attributes: [],
                  where: {
                    variety_code_line: queryData.rows[key].variety_line_code ? queryData.rows[key].variety_line_code : '',
                    // user_id:req.body.search.user_id
                  }
                }
              ],
              where: {
                is_active: 1,
                year: req.body.search.year,
                season: req.body.search.season,
                crop_code: req.body.search.crop_code,
                is_active: 1,
                user_id: req.body.search.user_id,
                variety_code: queryData.rows[key].variety_code,
                // ['$directIndentVC.id$']: null
              },
              group: ['indent_of_breederseed_direct.id', 'indent_of_breederseed_direct.quantity', 'indent_of_breederseed_direct.variety_code', 'm_crop_variety.variety_name', 'indent_of_brseed_direct_line.variety_code_line'],
              raw: true,
              attributes: [
                [sequelize.col('indent_of_breederseed_direct.variety_code'), 'variety_code'],
                [sequelize.col('indent_of_breederseed_direct.quantity'), 'total_qty'],
                [sequelize.literal('SUM(indent_of_brseed_direct_line.quantity)'), 'quantity'],
                [sequelize.col('indent_of_brseed_direct_line.variety_code_line'), 'variety_code_line'],
                [sequelize.literal("string_agg( DISTINCT(indent_of_brseed_direct_line.id::varchar), ',' )"), 'indent_of_brseed_direct_line_ids'],

              ]
            });
            directIndentVarietyListTotalArr.push(directIndentVarietyListTotal)
          }

        }
        let totalRecord = queryData.count
        const lastPage = totalRecord ? ((totalRecord % (pageSize) === 0 ? (totalRecord / (pageSize)) : (parseInt(totalRecord / (pageSize)) + 1))) : 0;
        let filterData = [];
        if (queryData && queryData.rows && queryData.rows.length > 0) {

          queryData.rows.forEach((el, index) => {
            const varietyIndex = filterData.findIndex(item => item.variety_code == el.variety_code);
            if (varietyIndex == -1) {
              filterData.push({
                variety_code: el && el.variety_code ? el.variety_code : 'NA',
                variety_name: el && el.variety_name ? el.variety_name : 'NA',
                crop_code: el && el.crop_code ? el.crop_code : 'NA',
                crop_name: el && el.crop_name ? el.crop_name : 'NA',
                ref_number: el && el.ref_number ? el.ref_number : 'NA',
                line_variety_name: el && el.line_variety_name ? el.line_variety_name : 'NA',
                variety_line_code: el && el.variety_line_code ? el.variety_line_code : 'NA',
                id: el && el.id ? el.id : '',
                is_freezed: el && el.is_freezed ? el.is_freezed : 0,
                year: el && el.year ? el.year : "NA",
                line_variety_code_details: [
                  {
                    line_variety_name: el && el.line_variety_name ? el.line_variety_name : '',
                    variety_line_code: el && el.variety_line_code ? el.variety_line_code : '',
                    bsp2_Deteials: [
                      {
                        bsp_proforma_2_id: el && el.bsp_proforma_2_id ? el.bsp_proforma_2_id : 'NA',
                        state_code: el && el.state_code ? el.state_code : 'NA',
                        field_code: el && el.field_code ? el.field_code : 'NA',
                        line_variety_name: el && el.line_variety_name ? el.line_variety_name : 'NA',
                        variety_line_code: el && el.variety_line_code ? el.variety_line_code : 'NA',
                        state_name: el && el.state_name ? el.state_name : 'NA',
                        district_code: el && el.district_code ? el.district_code : 'NA',
                        district_name: el && el.district_name ? el.district_name : 'NA',
                        address: el && el.address ? el.address : 'NA',
                        area_shown: el && el.area_shown ? (el.area_shown.toFixed(2)) : 'NA',
                        date_of_showing: el && el.date_of_showing ? el.date_of_showing : 'NA',
                        quantity_of_bs_shown: el && el.quantity_of_bs_shown ? el.quantity_of_bs_shown : 'NA',
                        quantity_of_ns_shown: el && el.quantity_of_ns_shown ? el.quantity_of_ns_shown : 'NA',
                        expected_inspection_from: el && el.expected_inspection_from ? el.expected_inspection_from : 'NA',
                        expected_inspection_to: el && el.expected_inspection_to ? el.expected_inspection_to : 'NA',
                        expected_harvest_from: el && el.expected_harvest_from ? el.expected_harvest_from : 'NA',
                        expected_harvest_to: el && el.expected_harvest_to ? el.expected_harvest_to : 'NA',
                        seed_class_id: el && el.seed_class_id ? el.seed_class_id : 'NA',
                        quantity_sown: el && el.quantity_sown ? (parseFloat(el.quantity_sown)).toFixed(2) : 0,
                        qty_of_seed_sown: el && el.qty_of_seed_sown ? el.qty_of_seed_sow.toFixed(2) : 'NA',
                        expected_production: el && el.expected_production ? el.expected_production : 'Na',
                      }
                    ]
                  }
                ]
              })
            } else {
              let lineVarietyIndex
              if (el.variety_line_code && el.variety_line_code != '' && el.variety_line_code != null && el.variety_line_code != 'NA') {
                lineVarietyIndex = filterData[varietyIndex].line_variety_code_details.findIndex(item => item.variety_line_code == el.variety_line_code);
                if (lineVarietyIndex != -1) {
                  filterData[varietyIndex].line_variety_code_details[lineVarietyIndex].bsp2_Deteials.push({
                    state_code: el && el.state_code ? el.state_code : 'NA',
                    state_name: el && el.state_name ? el.state_name : 'NA',
                    bsp_proforma_2_id: el && el.bsp_proforma_2_id ? el.bsp_proforma_2_id : 'NA',
                    field_code: el && el.field_code ? el.field_code : 'NA',
                    line_variety_name: el && el.line_variety_name ? el.line_variety_name : 'NA',
                    variety_line_code: el && el.variety_line_code ? el.variety_line_code : 'NA',
                    district_code: el && el.district_code ? el.district_code : 'NA',
                    district_name: el && el.district_name ? el.district_name : 'NA',
                    address: el && el.address ? el.address : 'NA',
                    area_shown: el && el.area_shown ? el.area_shown.toFixed(2) : 'NA',
                    date_of_showing: el && el.date_of_showing ? el.date_of_showing : 'NA',
                    quantity_of_bs_shown: el && el.quantity_of_bs_shown ? el.quantity_of_bs_shown : 'NA',
                    quantity_of_ns_shown: el && el.quantity_of_ns_shown ? el.quantity_of_ns_shown : 'NA',
                    expected_inspection_from: el && el.expected_inspection_from ? el.expected_inspection_from : 'NA',
                    expected_inspection_to: el && el.expected_inspection_to ? el.expected_inspection_to : 'NA',
                    expected_harvest_from: el && el.expected_harvest_from ? el.expected_harvest_from : 'NA',
                    expected_harvest_to: el && el.expected_harvest_to ? el.expected_harvest_to : 'NA',
                    seed_class_id: el && el.seed_class_id ? el.seed_class_id : '',
                    quantity_sown: el && el.quantity_sown ? (parseFloat(el.quantity_sown)).toFixed(2) : 0,
                    expected_production: el && el.expected_production ? (el.expected_production.toFixed(2)) : 'NA',
                    qty_of_seed_sown: el && el.qty_of_seed_sown ? el.qty_of_seed_sown : 'NA',
                  })
                } else {
                  filterData[varietyIndex].line_variety_code_details.push(
                    {
                      line_variety_name: el && el.line_variety_name ? el.line_variety_name : '',
                      variety_line_code: el && el.variety_line_code ? el.variety_line_code : '',
                      bsp2_Deteials: [
                        {
                          bsp_proforma_2_id: el && el.bsp_proforma_2_id ? el.bsp_proforma_2_id : 'NA',
                          state_code: el && el.state_code ? el.state_code : 'NA',
                          field_code: el && el.field_code ? el.field_code : 'NA',
                          line_variety_name: el && el.line_variety_name ? el.line_variety_name : 'NA',
                          variety_line_code: el && el.variety_line_code ? el.variety_line_code : 'NA',
                          state_name: el && el.state_name ? el.state_name : 'NA',
                          district_code: el && el.district_code ? el.district_code : 'NA',
                          district_name: el && el.district_name ? el.district_name : 'NA',
                          address: el && el.address ? el.address : 'NA',
                          area_shown: el && el.area_shown ? el.area_shown.toFixed(2) : 'NA',
                          date_of_showing: el && el.date_of_showing ? el.date_of_showing : 'NA',
                          quantity_of_bs_shown: el && el.quantity_of_bs_shown ? el.quantity_of_bs_shown : 'NA',
                          quantity_of_ns_shown: el && el.quantity_of_ns_shown ? el.quantity_of_ns_shown : 'NA',
                          expected_inspection_from: el && el.expected_inspection_from ? el.expected_inspection_from : 'NA',
                          expected_inspection_to: el && el.expected_inspection_to ? el.expected_inspection_to : 'NA',
                          expected_harvest_from: el && el.expected_harvest_from ? el.expected_harvest_from : 'NA',
                          expected_harvest_to: el && el.expected_harvest_to ? el.expected_harvest_to : 'NA',
                          seed_class_id: el && el.seed_class_id ? el.seed_class_id : 'NA',
                          quantity_sown: el && el.quantity_sown ? (parseFloat(el.quantity_sown)).toFixed(2) : 0,
                          qty_of_seed_sown: el && el.qty_of_seed_sown ? el.qty_of_seed_sown.toFixed(2) : 'NA',
                          expected_production: el && el.expected_production ? el.expected_production : 'Na',
                        }
                      ]
                    }
                  )
                }
              }
              else {
                filterData[varietyIndex].line_variety_code_details[0].bsp2_Deteials.push(

                  {

                    bsp_proforma_2_id: el && el.bsp_proforma_2_id ? el.bsp_proforma_2_id : 'NA',
                    state_code: el && el.state_code ? el.state_code : 'NA',
                    field_code: el && el.field_code ? el.field_code : 'NA',
                    line_variety_name: el && el.line_variety_name ? el.line_variety_name : 'NA',
                    variety_line_code: el && el.variety_line_code ? el.variety_line_code : 'NA',
                    state_name: el && el.state_name ? el.state_name : 'NA',
                    district_code: el && el.district_code ? el.district_code : 'NA',
                    district_name: el && el.district_name ? el.district_name : 'NA',
                    address: el && el.address ? el.address : 'NA',
                    area_shown: el && el.area_shown ? el.area_shown : 'NA',
                    date_of_showing: el && el.date_of_showing ? el.date_of_showing : 'NA',
                    quantity_of_bs_shown: el && el.quantity_of_bs_shown ? el.quantity_of_bs_shown : 'NA',
                    quantity_of_ns_shown: el && el.quantity_of_ns_shown ? el.quantity_of_ns_shown : 'NA',
                    expected_inspection_from: el && el.expected_inspection_from ? el.expected_inspection_from : 'NA',
                    expected_inspection_to: el && el.expected_inspection_to ? el.expected_inspection_to : 'NA',
                    expected_harvest_from: el && el.expected_harvest_from ? el.expected_harvest_from : 'NA',
                    expected_harvest_to: el && el.expected_harvest_to ? el.expected_harvest_to : 'NA',
                    seed_class_id: el && el.seed_class_id ? el.seed_class_id : 'NA',
                    quantity_sown: el && el.quantity_sown ? parseFloat(el.quantity_sown) : 0,
                    qty_of_seed_sown: el && el.qty_of_seed_sown ? el.qty_of_seed_sown : 'NA',
                    expected_production: el && el.expected_production ? el.expected_production : 'Na',
                  }

                )

              }


            }
            // console.log(el,'queryData.rows')
          })
        }
        if (lastPage < page) {
          returnResponse = {
            current_page: page,
            per_page: pageSize,
            first_page: 1,
            last_page: lastPage,
            total: totalRecord,
            from: 0,
            to: 0,
            data: [],
          };
          response(res, status.DATA_NOT_AVAILABLE, 200, returnResponse, internalCall);
        } else {
          const responseData = {
            bsp1VarietyListArr: bsp1VarietyListArr,
            directIndentVarietyListTotalArr: directIndentVarietyListTotalArr
          }
          returnResponse = await paginateResponseRaw(filterData, page, pageSize, totalRecord, lastPage);
          returnResponse.bsp1VarietyListArr = bsp1VarietyListArr;
          returnResponse.directIndentVarietyListTotalArr = directIndentVarietyListTotalArr
          returnResponse.filterData = filterData
          return response(res, status.DATA_AVAILABLE, 200, returnResponse, internalCall, responseData);
        }
      }
    } catch (error) {
      returnResponse = {
        error: error.message
      }
      console.log(error);
      response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }
  static delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  static mergeArraysToString = async (arr) => {
    let result = '';
    for (const element of arr) {
      // Simulate an asynchronous operation (you can replace this with your actual async logic)
      await this.delay(100);
      // Append the current element to the result
      result += (result.length > 0 ? ',' : '') + element;
    }
    return result;
  }

}
module.exports = reportController
