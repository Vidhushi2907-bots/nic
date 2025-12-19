require('dotenv').config()
const response = require('../_helpers/response')
const status = require('../_helpers/status.conf')
const db = require("../models");
const stateModel = db.stateModel;
const districtModel = db.districtModel;
const cropModel = db.cropModel;
const varietyModel = db.varietyModel;
const breederCropModel = db.breederCropModel;
const seedTestingReportsModel = db.seedTestingReportsModel

const sequelize = require('sequelize');
const ConditionCreator = require('../_helpers/condition-creator');
const { cropGroupModel } = require('../models');
const Op = require('sequelize').Op;
let Validator = require('validatorjs');

const { cropVerietyModel, commentsModel, allocationSpaForLiftingSeed, allocationToSPASeed, agencyDetailModel, userModel, liftingTagNumberModel, indenterSPAModel, indentOfBreederseedModel, indentOfBrseedDirectLineModel, bspPerformaBspTwo, bspPerformaBspThree, bspPerformaBspOne, bspProformaOneBspc, monitoringTeamOfBspcMember, monitoringTeamOfBspc, seedInventory, seedClassModel, stageModel, seedInventoryTag, seedInventoryTagDetail, bspPerformaBspTwoSeed, varietyLineModel, mVarietyLinesModel, seasonModel, directIndent, liftingSeedDetailsModel } = require('../models');
const { QueryTypes } = require("sequelize");
const paginateResponseRaw = require("../_utility/generate-otp");
const moment = require("moment");
const e = require('express');

class UserController {

  static addState = async (req, res) => {
    let data = {};
    data = {
      "hiiii": "wertyuio"
    }
    return response(res, status.DATA_SAVE, 200, data)
    // const data = stateModel.build({
    //   name: req.body.name,
    //   state_code: req.body.state_code
    // });
    // await data.save();

    // if (data) {
    //   return response(res, status.DATA_SAVE, 200, data)
    // } else {
    //   return response(res, status.DATA_NOT_AVAILABLE, 404)
    // }
  }
  static viewState = async (req, res) => {
    try {
      var data = {}
      data = await stateModel.findAll({
        raw: true
      });

      // res.send(data)

      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }


  static getAllState = async (req, res) => {
    try {
      var data = {}
      let id = req.body.id;
      let filter = await ConditionCreator.masterFilter(req.body);
      console.log(filter)

      if (id) {
        data = await stateModel.findAll({
          //     include: [
          //         {
          //         model:stateModel,
          //         attributes: []
          //     },
          // ],
          attributes: ['*',
            // [sequelize.col('districts.id'),'id'],
            [sequelize.col('states.id'), 'id'],
            [sequelize.col('states.name'), 'state_name'],
            [sequelize.col('states.state_code'), 'state_code'],
            // [sequelize.col('districts.district_name'),'district_name'],
            // [sequelize.col('districts.district_code'),'district_code']
          ],
          where: { ...filter },
          raw: false,
          where: {
            id: id
          }
        });

      } else {
        data = await stateModel.findAll({
          // include: [
          //     {
          //     model:stateModel,
          //     attributes: []
          // },
          // ],
          attributes: ['*',
            // [sequelize.col('districts.id'),'id'],
            [sequelize.col('states.id'), 'id'],
            [sequelize.col('states.name'), 'state_name'],
            [sequelize.col('states.state_code'), 'state_code'],
            // [sequelize.col('districts.district_name'),'district_name'],
            // [sequelize.col('districts.district_code'),'district_code']
          ],
          where: { ...filter },
          raw: false,
        });
      }

      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static editState = async (req, res) => {
    try {
      const id = req.body.id;
      const data = await stateModel.update({
        name: req.body.name,
        state_code: req.body.state_code
      }, {
        where: {
          id: id
        }
      })
      if (data) {
        response(res, status.DATA_UPDATED, 200, data)
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_SAVE, 500)
    }
  }

  static deleteState = async (req, res) => {
    try {
      const id = req.body.id;
      const data = await stateModel.destroy({
        where: {
          id: id
        }
      })
      if (data) {
        response(res, status.DATA_DELETED, 200, data)
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_SAVE, 500)
    }
  }
  static test = async (req, res) => {
    try {

      response(res, "Api Working fine", 200, "Success")


    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_SAVE, 500)
    }
  }
  static viewCrop = async (req, res) => {
    const { internalCall } = req.body;
    let returnResponse = {};
    let data = {};
    try {
      let condition = {};
      let { page, pageSize, search } = req.body;
      if (page === undefined) page = 1;
      if (pageSize === undefined) {
        pageSize = 10;
      } // set pageSize to -1 to prevent sizing

      if (page > 0 && pageSize > 0) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }
      condition.order = [['id', 'Desc']];
      data = await cropModel.findAndCountAll(condition);
      // returnResponse = await paginateResponse(data, page, pageSize);

      // res.send(data)

      response(res, status.DATA_AVAILABLE, 200, data, internalCall)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getCropName = async (req, res) => {
    let returnResponse = {};
    try {
      let condition = {
        where: {}
      };
      // const { production_type } = req.body.search;
      // if (production_type) {
      // if (req.body.search) {
      //   if (req.body.search.group_code) {
      //     condition.where.group_code = req.body.search.group_code;
      //   }
      // }
      // }
      // else {

      if (req.body.search) {
        if (req.body.search.crop_group) {
          condition.where.crop_group = req.body.search.crop_group;
        }
      }
      // }
      // production_type

      condition.order = [['crop_name', 'ASC']];
      returnResponse = await cropModel.findAll(condition);
      return response(res, status.OK, 200, returnResponse);
    } catch (error) {
      returnResponse = {
        message: error.message
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }
  static getCropNameProductionData = async (req, res) => {
    let returnResponse = {};
    try {
      let condition = {
        include: {
          model: cropModel
        },
        where: {
          // production_center_id : req.body.loginedUserid.id
        },
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('breeder_crops.crop_code')), 'crop_code'],
          // [sequelize.col('breeder_crops.id'), 'id']
          // [sequelize.literal('(DISTINCT(breeder_crops.crop_code))'), 'crop_code'],
          // [sequelize.col('crops.crop_name'), 'crop_name'],
          // [sequelize.col('crops.crop_group'), 'crop_group']
          'crop_code',
        ],
        raw: true,
      };

      if (req.body.search) {
        if (req.body.search.crop_group) {
          condition.where.crop_group = req.body.search.crop_group;
        }
        if (req.body.search.user_id) {
          condition.where.production_center_id = req.body.search.user_id;
        }
      }

      // condition.order = [['crop_name', 'ASC']];
      returnResponse = await breederCropModel.findAll(condition);
      return response(res, status.OK, 200, returnResponse);
    } catch (error) {
      returnResponse = {
        message: error.message
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }
  static getCropVerietyList = async (req, res) => {
    try {
      let condition = {
        where: {

        }
      }


      // const sortOrder = req.body.sort ? req.body.sort : 'variety_name';
      // const sortDirection = req.body.order ? req.body.order : 'ASC';
      // condition.order = [[sortOrder, sortDirection]];

      if (req.body.search) {
        if (req.body.search.crop_code) {
          condition.where.crop_code = req.body.search.crop_code;
        }
      }

      let data = await varietyModel.findAndCountAll(condition);

      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      return response(res, status.DATA_NOT_SAVE, 500, error);
    }
  }
  static getCropGroup = async (req, res) => {
    let returnResponse = {};
    try {
      let condition = {
        where: {}
      };

      if (req.body.search) {
        // if (req.body.search.crop_group) {
        //   condition.where.crop_group = req.body.search.crop_group;
        // }
      }

      condition.order = [['group_name', 'ASC']];
      returnResponse = await cropGroupModel.findAll(condition);
      return response(res, status.OK, 200, returnResponse);
    } catch (error) {
      returnResponse = {
        message: error.message
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }

  static getYearOfIndentSpa = async (req, res) => {
    let returnResponse = {};
    const { internalCall } = req.body;
    try {
      let rules = {
        'search.year': 'string',
        'search.season': 'string',
        'search.crop_code': 'string',
        'search.state_code': 'string',
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
        where: {},
        raw: false,
        attributes: [
          [db.Sequelize.fn("Distinct", db.Sequelize.col("year")), "value"],
          [sequelize.literal("concat(year, '-', RIGHT((Year+1)::VARCHAR, 2))"), 'display_text'],
          'year'
        ]
      };

      if (req.body.search) {
        if (req.body.search.year) {
          condition.where.year = {
            [Op.in]: req.body.search.year.toString().split(',')
          };
        }
        if (req.body.search.season) {
          condition.where.season = {
            [Op.in]: req.body.search.season.toString().split(',')
          };
        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = {
            [Op.in]: req.body.search.crop_code.toString().split(',')
          };
        }
        if (req.body.search.state_code) {
          condition.where.state_code = {
            [Op.in]: req.body.search.state_code.toString().split(',')
          };
        }
      }

      condition.order = [['year', 'desc']];
      returnResponse = await indenterSPAModel.findAll(condition);

      response(res, status.DATA_AVAILABLE, 200, returnResponse, internalCall);
    } catch (error) {
      returnResponse = {
        error: error.message
      }
      console.log(returnResponse);
      response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }


  static getSeasonOfIndentSpa = async (req, res) => {
    let returnResponse = {};
    const { internalCall } = req.body;
    try {
      let rules = {
        'search.year': 'string',
        'search.season': 'string',
        'search.crop_code': 'string',
        'search.state_code': 'string',
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
        where: {},
        raw: false,
        attributes: [
          [db.Sequelize.fn("Distinct", db.Sequelize.col("season")), "value"],
          [sequelize.literal("Case when season='R' then 'Rabi' when season='K' then 'Kharif' else season end"), 'display_text'],
          'season'
        ]
      };

      if (req.body.search) {
        if (req.body.search.year) {
          condition.where.year = {
            [Op.in]: req.body.search.year.toString().split(',')
          };
        }
        if (req.body.search.season) {
          condition.where.season = {
            [Op.in]: req.body.search.season.toString().split(',')
          };
        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = {
            [Op.in]: req.body.search.crop_code.toString().split(',')
          };
        }
        if (req.body.search.state_code) {
          condition.where.state_code = {
            [Op.in]: req.body.search.state_code.toString().split(',')
          };
        }
      }

      condition.order = [['season', 'desc']];
      returnResponse = await indenterSPAModel.findAll(condition);

      response(res, status.DATA_AVAILABLE, 200, returnResponse, internalCall);
    } catch (error) {
      returnResponse = {
        error: error.message
      }
      console.log(returnResponse);
      response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }

  static getCropOfIndentSpa = async (req, res) => {
    let returnResponse = {};
    const { internalCall } = req.body;
    try {
      let rules = {
        'search.year': 'string',
        'search.season': 'string',
        'search.crop_code': 'string',
        'search.state_code': 'string',
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
        include: [
          {
            model: cropModel,
            required: true,
            attributes: []
          }
        ],
        where: {},
        raw: true,
        attributes: [
          [db.Sequelize.fn("Distinct", db.Sequelize.col("indent_of_spas.crop_code")), "value"],
          [sequelize.literal('m_crop.crop_name'), 'display_text'],
          'indent_of_spas.crop_code'
        ]
      };

      if (req.body.search) {
        if (req.body.search.year) {
          condition.where.year = {
            [Op.in]: req.body.search.year.toString().split(',')
          };
        }
        if (req.body.search.season) {
          condition.where.season = {
            [Op.in]: req.body.search.season.toString().split(',')
          };
        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = {
            [Op.in]: req.body.search.crop_code.toString().split(',')
          };
        }
        if (req.body.search.state_code) {
          condition.where.state_code = {
            [Op.in]: req.body.search.state_code.toString().split(',')
          };
        }
      }

      condition.order = [['crop_code', 'desc']];
      returnResponse = await indenterSPAModel.findAll(condition);

      response(res, status.DATA_AVAILABLE, 200, returnResponse, internalCall);
    } catch (error) {
      returnResponse = {
        error: error.message
      }
      console.log(returnResponse);
      response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }

  static getStateOfIndentSpa = async (req, res) => {
    let returnResponse = {};
    const { internalCall } = req.body;
    try {
      let rules = {
        'search.year': 'string',
        'search.season': 'string',
        'search.crop_code': 'string',
        'search.state_code': 'string',
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
        include: [
          {
            model: stateModel,
            required: true,
            attributes: []
          }
        ],
        where: {},
        raw: true,
        attributes: [
          [db.Sequelize.fn("Distinct", db.Sequelize.col("indent_of_spas.state_code")), "value"],
          [sequelize.literal('m_state.state_name'), 'display_text'],
          'indent_of_spas.state_code'
        ]
      };

      if (req.body.search) {
        if (req.body.search.year) {
          condition.where.year = {
            [Op.in]: req.body.search.year.toString().split(',')
          };
        }
        if (req.body.search.season) {
          condition.where.season = {
            [Op.in]: req.body.search.season.toString().split(',')
          };
        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = {
            [Op.in]: req.body.search.crop_code.toString().split(',')
          };
        }
        if (req.body.search.state_code) {
          condition.where.state_code = {
            [Op.in]: req.body.search.state_code.toString().split(',')
          };
        }
      }

      condition.order = [['state_code', 'desc']];
      returnResponse = await indenterSPAModel.findAll(condition);

      response(res, status.DATA_AVAILABLE, 200, returnResponse, internalCall);
    } catch (error) {
      returnResponse = {
        error: error.message
      }
      console.log(returnResponse);
      response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }

  static unfreezeIndentSpa = async (req, res) => {
    let returnResponse = {};
    const { internalCall } = req.body;
    try {
      let rules = {
        'search.year': 'string',
        'search.season': 'string',
        'search.crop_code': 'string',
        'search.state_code': 'string',
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
              model: indentOfBreederseedModel,
              required: true,
              attributes: []
            }
          ],
          where: {
            is_freeze: 0,
          },
          raw: true,
          attributes: [
            'indent_of_spas.id',
            'indent_of_breederseed.is_indenter_freeze',
          ]
        };

        if (req.body.search) {
          if (req.body.search.year) {
            condition.where.year = {
              [Op.in]: req.body.search.year.toString().split(',')
            };
          }
          if (req.body.search.season) {
            condition.where.season = {
              [Op.in]: req.body.search.season.toString().split(',')
            };
          }
          if (req.body.search.crop_code) {
            condition.where.crop_code = {
              [Op.in]: req.body.search.crop_code.toString().split(',')
            };
          }
          if (req.body.search.state_code) {
            condition.where.state_code = {
              [Op.in]: req.body.search.state_code.toString().split(',')
            };
          }
        }

        condition.order = [['id', 'desc']];
        const data = await indenterSPAModel.findAll(condition);

        if (!(data && data.length)) {
          response(res, status.DATA_NOT_AVAILABLE, 200, returnResponse, internalCall);
        } else {

          const isIndenterFreezeData = await data.filter((datum) => {
            return parseInt(datum.is_indenter_freeze) === 1
          });

          if (isIndenterFreezeData && isIndenterFreezeData.length) {
            response(res, 'Indents are already freezed by seed division', 400, returnResponse, internalCall);
          } else {

            const updateIds = await data.map(datum => datum['id']);

            const updateData = {
              is_freeze: 1
            };

            await indenterSPAModel.update(updateData, {
              where: {
                id: {
                  [Op.in]: updateIds
                }
              }
            }).then(function (item) {
              returnResponse = {
                count: item[0]
              }
            }).catch(function (error) {
              returnResponse = {
                error: error.message
              }
              console.log(returnResponse);
              response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
            });

            response(res, status.DATA_UPDATED, 200, returnResponse, internalCall);
          }
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

  static getBspProforma2sDetails = async (req, res) => {
    let returnResponse = {};
    const { internalCall } = req.body;
    try {
      let rules = {
        'search.email_id': 'required|string|email'
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

        const sortOrder = req.body.sort ? req.body.sort : 'bsp_proforma_2s.id';
        const sortDirection = req.body.order ? req.body.order : 'DESC';

        const mid_query = "from bsp_proforma_2s " +
          "inner join bsp_proforma_1_bspcs on bsp_proforma_1_bspcs.bspc_id = bsp_proforma_2s.user_id " +
          "inner join bsp_proforma_1s on bsp_proforma_1s.id = bsp_proforma_1_bspcs.bspc_proforma_1_id and bsp_proforma_1s.year = bsp_proforma_2s.year and bsp_proforma_1s.season = bsp_proforma_2s.season and bsp_proforma_1s.crop_code = bsp_proforma_2s.crop_code and bsp_proforma_1s.variety_code = bsp_proforma_2s.variety_code and bsp_proforma_1s.is_active = 1 " +
          "INNER Join monitoring_team_of_bspc on monitoring_team_of_bspc.year = bsp_proforma_2s.year and monitoring_team_of_bspc.season = bsp_proforma_2s.season and monitoring_team_of_bspc.crop_code = bsp_proforma_2s.crop_code and monitoring_team_of_bspc.user_id = bsp_proforma_2s.user_id and monitoring_team_of_bspc.is_active=1 " +
          "inner join monitoring_team_of_bspc_members on monitoring_team_of_bspc_members.monitoring_team_of_bspc_id = monitoring_team_of_bspc.id and monitoring_team_of_bspc_members.is_active = 1 " +
          "inner join users on users.id = bsp_proforma_2s.user_id " +
          "inner join m_crops on m_crops.crop_code = bsp_proforma_2s.crop_code " +
          "inner join m_crop_varieties on m_crop_varieties.variety_code = bsp_proforma_2s.variety_code " +
          "inner join m_states on m_states.id = bsp_proforma_2s.state_code " +
          "inner join m_districts on m_districts.id = bsp_proforma_2s.district_code " +
          "where monitoring_team_of_bspc_members.email_id = :email_id ";


        const data = await db.sequelize.query(
          "select bsp_proforma_2s.year, CASE WHEN bsp_proforma_2s.season='R' then 'Rabi' when bsp_proforma_2s.season='K' then 'Kharif' else bsp_proforma_2s.season end as season, bsp_proforma_2s.crop_code, m_crops.crop_name, bsp_proforma_2s.variety_code, m_crop_varieties.variety_name, bsp_proforma_2s.state_code, m_states.state_name, bsp_proforma_2s.district_code, m_districts.district_name, bsp_proforma_2s.address, bsp_proforma_2s.field_code, bsp_proforma_2s.area_shown, bsp_proforma_2s.date_of_showing, bsp_proforma_2s.quantity_of_ns_shown as necleus_seed, bsp_proforma_2s.quantity_of_bs_shown as breeder_seed, sum(bsp_proforma_1_bspcs.target_qunatity) as target, bsp_proforma_2s.expected_production, bsp_proforma_2s.user_id, users.username, CASE WHEN bsp_proforma_2s.is_inspected= true then 'Complete' else 'Pending' end as status, bsp_proforma_2s.expected_inspection_from as inspection_date,  bsp_proforma_2s.id " +
          mid_query +
          "group by bsp_proforma_2s.year, bsp_proforma_2s.season, bsp_proforma_2s.crop_code, crop_name, bsp_proforma_2s.variety_code, m_crop_varieties.variety_name, bsp_proforma_2s.state_code, m_states.state_name, bsp_proforma_2s.district_code, m_districts.district_name, bsp_proforma_2s.address, bsp_proforma_2s.field_code, bsp_proforma_2s.area_shown, bsp_proforma_2s.date_of_showing, bsp_proforma_2s.quantity_of_ns_shown, bsp_proforma_2s.quantity_of_bs_shown, bsp_proforma_2s.expected_production, bsp_proforma_2s.user_id, users.username, bsp_proforma_2s.is_inspected, bsp_proforma_2s.expected_inspection_from, bsp_proforma_2s.id " +
          "order by " + sortOrder + " " + sortDirection + " " + ";",
          {
            replacements: { email_id: req.body.search.email_id },
            type: QueryTypes.SELECT
          }
        );

        // returnResponse = {
        //   count: data.length,
        //   rows: data
        // };

        returnResponse = {
          count: 2,
          rows: [
            {
              "year": 2024,
              "season": "R",
              "crop_code": "A0101",
              "crop_name": "CRP NM 1",
              "variety_code": "A0101001",
              "variety_name": "HSBC 101",
              "state_code": 19,
              "state_name": "Uttar Pradesh",
              "district_code": 101,
              "district_name": "Mathura",
              "address": "Field Address",
              "field_code": "FC100101",
              "ref_no": "1001",
              "bspc_id": "2001",
              "bspc_name": "Seed Production Center",
              "sci_id": "233",
              "sci_name": "JP Singh",
              "source_class": "BS",
              "quantity_of_seed": 10,
              "source": [
                {
                  "lot": "Lot 1",
                  "tags": ["Tag 1", "Tag 2", "Tag 3"]
                }
              ],
              "status": "Pending"
            },
            {
              "year": 2024,
              "season": "R",
              "crop_code": "A0102",
              "crop_name": "CRP NM 2",
              "variety_code": "A0101002",
              "variety_name": "HSBC 102",
              "state_code": 19,
              "state_name": "Uttar Pradesh",
              "district_code": 101,
              "district_name": "Mathura",
              "address": "Field Address",
              "field_code": "FC100102",
              "ref_no": "1002",
              "bspc_id": "2002",
              "bspc_name": "Seed Production Center",
              "sci_id": "234",
              "sci_name": "RP Singh",
              "source_class": "NS",
              "quantity_of_seed": 10,
              "source": [
                {
                  "lot": "Lot 2",
                  "tags": ["Tag 4", "Tag 5", "Tag 6"]
                }
              ],
              "status": "Pending"
            }
          ]
        };

        response(res, data.length ? status.DATA_AVAILABLE : status.DATA_NOT_AVAILABLE, 200, returnResponse, internalCall);
      }
    } catch (error) {
      returnResponse = {
        error: error.message
      }
      console.log(returnResponse);
      response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }

  static authenticateAppUser = async (req, res) => {

    // let returnResponse = {
    //   count: 4,
    //   rows: [
    //     {
    //       "year": 2023,
    //       "season": "Rabi",
    //       "crop_code": "A0104",
    //       "crop_name": "WHEAT (GEHON)",
    //       "variety_code": "A0104013",
    //       "variety_name": "RAJ-3765",
    //       "state_code": 9,
    //       "state_name": "UTTAR PRADESH",
    //       "district_code": 119,
    //       "district_name": "ALIGARH",
    //       "address": "sdfs35435",
    //       "field_code": "2023-24/R/676/A0104/3",
    //       "area_shown": 5,
    //       "ref_no": "8",
    //       "bspc_id": 676,
    //       "bspc_name": "JHA",
    //       "sci_id": 11,
    //       "sci_name": "test 2",
    //       "source_class": "ns",
    //       "quantity_of_seed": 6,
    //       "username": "jha@gmail.com",
    //       "status": "Pending",
    //       "id": 8,
    //       "team_data": [
    //         {
    //           "name": "test",
    //           "mobile_number": "8888888888",
    //           "email_id": "tesst@gmail.com",
    //           "address": "Noida"
    //         },
    //         {
    //           "name": "fsdafdsa",
    //           "mobile_number": "4444444444",
    //           "email_id": "fsdaf@fdsaf.fdsaf",
    //           "address": "fsdfds"
    //         }
    //       ],
    //       "source": [
    //         {
    //           "lot": "22-23/R/A01/1(i)",
    //           "tags": [
    //             "T5",
    //             "T7",
    //             "T5",
    //             "T7",
    //             "T12"
    //           ]
    //         }
    //       ],
    //       "sci_userId": "1001"
    //     },
    //     {
    //       "year": 2023,
    //       "season": "Rabi",
    //       "crop_code": "A0104",
    //       "crop_name": "WHEAT (GEHON)",
    //       "variety_code": "A0104013",
    //       "variety_name": "RAJ-3765",
    //       "state_code": 9,
    //       "state_name": "UTTAR PRADESH",
    //       "district_code": 119,
    //       "district_name": "ALIGARH",
    //       "address": "sdfs35435",
    //       "field_code": "2023-24/R/676/A0104/2",
    //       "area_shown": 5,
    //       "ref_no": "9",
    //       "bspc_id": 676,
    //       "bspc_name": "JHA",
    //       "sci_id": 11,
    //       "sci_name": "test 2",
    //       "source_class": "ns",
    //       "quantity_of_seed": 6,
    //       "username": "jha@gmail.com",
    //       "status": "Pending",
    //       "id": 9,
    //       "team_data": [
    //         {
    //           "name": "test",
    //           "mobile_number": "8888888888",
    //           "email_id": "tesst@gmail.com",
    //           "address": "Noida"
    //         },
    //         {
    //           "name": "fsdafdsa",
    //           "mobile_number": "4444444444",
    //           "email_id": "fsdaf@fdsaf.fdsaf",
    //           "address": "fsdfds"
    //         }
    //       ],
    //       "source": [
    //         {
    //           "lot": "22-23/R/A01/1(i)",
    //           "tags": [
    //             "T5",
    //             "T7",
    //             "T5",
    //             "T7",
    //             "T12"
    //           ]
    //         }
    //       ],
    //       "sci_userId": "1001"
    //     },
    //     {
    //       "year": 2023,
    //       "season": "Rabi",
    //       "crop_code": "A0104",
    //       "crop_name": "WHEAT (GEHON)",
    //       "variety_code": "A0104013",
    //       "variety_name": "RAJ-3765",
    //       "state_code": 9,
    //       "state_name": "UTTAR PRADESH",
    //       "district_code": 119,
    //       "district_name": "ALIGARH",
    //       "address": "sdfs35435",
    //       "field_code": "2023-24/R/676/A0104/5",
    //       "area_shown": 5,
    //       "ref_no": "10",
    //       "bspc_id": 676,
    //       "bspc_name": "JHA",
    //       "sci_id": 11,
    //       "sci_name": "test 2",
    //       "source_class": "ns",
    //       "quantity_of_seed": 6,
    //       "username": "jha@gmail.com",
    //       "status": "Pending",
    //       "id": 10,
    //       "team_data": [
    //         {
    //           "name": "test",
    //           "mobile_number": "8888888888",
    //           "email_id": "tesst@gmail.com",
    //           "address": "Noida"
    //         },
    //         {
    //           "name": "fsdafdsa",
    //           "mobile_number": "4444444444",
    //           "email_id": "fsdaf@fdsaf.fdsaf",
    //           "address": "fsdfds"
    //         }
    //       ],
    //       "source": [
    //         {
    //           "lot": "22-23/R/A01/1(i)",
    //           "tags": [
    //             "T5",
    //             "T7",
    //             "T5",
    //             "T7",
    //             "T12"
    //           ]
    //         }
    //       ],
    //       "sci_userId": "1001"
    //     },
    //     {
    //       "year": 2023,
    //       "season": "Rabi",
    //       "crop_code": "A0104",
    //       "crop_name": "WHEAT (GEHON)",
    //       "variety_code": "A0104013",
    //       "variety_name": "RAJ-3765",
    //       "state_code": 9,
    //       "state_name": "UTTAR PRADESH",
    //       "district_code": 119,
    //       "district_name": "ALIGARH",
    //       "address": "sdfs35435",
    //       "field_code": "2023-24/R/676/A0104/6",
    //       "area_shown": 5,
    //       "ref_no": "11",
    //       "bspc_id": 676,
    //       "bspc_name": "JHA",
    //       "sci_id": 11,
    //       "sci_name": "test 2",
    //       "source_class": "ns",
    //       "quantity_of_seed": 6,
    //       "username": "jha@gmail.com",
    //       "status": "Pending",
    //       "id": 11,
    //       "team_data": [
    //         {
    //           "name": "test",
    //           "mobile_number": "8888888888",
    //           "email_id": "tesst@gmail.com",
    //           "address": "Noida"
    //         },
    //         {
    //           "name": "fsdafdsa",
    //           "mobile_number": "4444444444",
    //           "email_id": "fsdaf@fdsaf.fdsaf",
    //           "address": "fsdfds"
    //         }
    //       ],
    //       "source": [
    //         {
    //           "lot": "22-23/R/A01/1(i)",
    //           "tags": [
    //             "T5",
    //             "T7",
    //             "T5",
    //             "T7",
    //             "T12"
    //           ]
    //         }
    //       ],
    //       "sci_userId": "1001"
    //     }
    //   ]
    // }
    //
    // response(res, status.DATA_AVAILABLE, 200, returnResponse);

    let returnResponse = {};
    const { internalCall } = req.body;
    try {
      let rules = {
        'userId': 'required|string',
        'pinCode': 'required|string',
        // 'state_code': 'required|integer',
        // 'year': 'required|integer',
        // 'season': 'required|string',
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

        const sortOrder = req.body.sort ? req.body.sort : 'bsp_proforma_2s.id';
        const sortDirection = req.body.order ? req.body.order : 'DESC';

        const mid_query = "from bsp_proforma_2s " +
          // "inner join bsp_proforma_1_bspcs on bsp_proforma_1_bspcs.bspc_id = bsp_proforma_2s.user_id " +
          // "inner join bsp_proforma_1s on bsp_proforma_1s.id = bsp_proforma_1_bspcs.bspc_proforma_1_id and bsp_proforma_1s.year = bsp_proforma_2s.year and bsp_proforma_1s.season = bsp_proforma_2s.season and bsp_proforma_1s.crop_code = bsp_proforma_2s.crop_code and bsp_proforma_1s.variety_code = bsp_proforma_2s.variety_code and bsp_proforma_1s.is_active = 1 " +
          "INNER Join monitoring_team_of_bspc on monitoring_team_of_bspc.year = bsp_proforma_2s.year and monitoring_team_of_bspc.season = bsp_proforma_2s.season and monitoring_team_of_bspc.crop_code = bsp_proforma_2s.crop_code and monitoring_team_of_bspc.user_id = bsp_proforma_2s.user_id and monitoring_team_of_bspc.is_active=1 " +
          "inner join monitoring_team_of_bspc_members on monitoring_team_of_bspc_members.monitoring_team_of_bspc_id = monitoring_team_of_bspc.id and monitoring_team_of_bspc_members.is_active = 1 " +
          "inner join users on users.id = bsp_proforma_2s.user_id " +
          "inner join agency_details on agency_details.user_id = bsp_proforma_2s.user_id " +
          "inner join m_crops on m_crops.crop_code = bsp_proforma_2s.crop_code " +
          "inner join m_crop_varieties on m_crop_varieties.variety_code = bsp_proforma_2s.variety_code " +
          "inner join m_states on m_states.state_code = bsp_proforma_2s.state_code " +
          "inner join m_districts on m_districts.district_code = bsp_proforma_2s.district_code " +
          "where lower(monitoring_team_of_bspc_members.user_name) = lower(:user_name) and lower(encode(digest(monitoring_team_of_bspc_members.pin_code::VARCHAR, 'sha256'), 'hex')) = lower(:pin_code) and monitoring_team_of_bspc_members.is_team_lead = 1 ";

        let data = await db.sequelize.query(
          "select concat(bsp_proforma_2s.year, '-', RIGHT((bsp_proforma_2s.year+1)::VARCHAR, 2)) as year, CASE WHEN bsp_proforma_2s.season='R' then 'Rabi' when bsp_proforma_2s.season='K' then 'Kharif' else bsp_proforma_2s.season end as season, bsp_proforma_2s.crop_code, m_crops.crop_name, bsp_proforma_2s.variety_code, m_crop_varieties.variety_name, bsp_proforma_2s.state_code, m_states.state_name, bsp_proforma_2s.district_code, m_districts.district_name, bsp_proforma_2s.address, bsp_proforma_2s.field_code, bsp_proforma_2s.area_shown, bsp_proforma_2s.ref_no, bsp_proforma_2s.user_id as bspc_id, agency_details.agency_name as bspc_name, monitoring_team_of_bspc_members.id as sci_id, monitoring_team_of_bspc_members.name as sci_name, CASE WHEN (bsp_proforma_2s.quantity_of_ns_shown IS NOT NULL and bsp_proforma_2s.quantity_of_ns_shown!=0) THEN 'Nucleus Seed' when (bsp_proforma_2s.quantity_of_bs_shown IS NOT NULL and bsp_proforma_2s.quantity_of_bs_shown!=0) then 'Breeder Seed' else '' end as source_class, CASE WHEN (bsp_proforma_2s.quantity_of_ns_shown IS NOT NULL and bsp_proforma_2s.quantity_of_ns_shown!=0) THEN quantity_of_ns_shown when (bsp_proforma_2s.quantity_of_bs_shown IS NOT NULL and bsp_proforma_2s.quantity_of_bs_shown!=0) then quantity_of_bs_shown else 0 end as quantity_of_seed,  users.username, CASE WHEN bsp_proforma_2s.is_inspected= true then 'Complete' else 'Pending' end as status,  bsp_proforma_2s.id, monitoring_team_of_bspc_members.monitoring_team_of_bspc_id, DATE(bsp_proforma_2s.expected_harvest_from) as expected_harvest_from, DATE(bsp_proforma_2s.expected_harvest_to) as expected_harvest_to, DATE(bsp_proforma_2s.date_of_showing) as date_of_showing, ROUND( bsp_proforma_2s.expected_production::DECIMAL, 2 ) as expected_production " +
          mid_query +
          "group by bsp_proforma_2s.year, bsp_proforma_2s.season, bsp_proforma_2s.crop_code, crop_name, bsp_proforma_2s.variety_code, m_crop_varieties.variety_name, bsp_proforma_2s.state_code, m_states.state_name, bsp_proforma_2s.district_code, m_districts.district_name, bsp_proforma_2s.address, bsp_proforma_2s.field_code, bsp_proforma_2s.area_shown, monitoring_team_of_bspc_members.id, monitoring_team_of_bspc_members.name, bsp_proforma_2s.ref_no, bsp_proforma_2s.user_id, agency_details.agency_name, bsp_proforma_2s.quantity_of_ns_shown, bsp_proforma_2s.quantity_of_bs_shown, users.username, bsp_proforma_2s.is_inspected, bsp_proforma_2s.id, monitoring_team_of_bspc_members.monitoring_team_of_bspc_id, bsp_proforma_2s.expected_harvest_from, bsp_proforma_2s.expected_harvest_to, bsp_proforma_2s.date_of_showing, bsp_proforma_2s.expected_production " +
          "order by " + sortOrder + " " + sortDirection + " " + ";",
          {
            // replacements: { user_name: req.body.userId, pin_code: req.body.pinCode, year: req.body.year, season: req.body.season, state_code: req.body.state_code },
            replacements: { user_name: req.body.userId, pin_code: req.body.pinCode },
            type: QueryTypes.SELECT
          }
        );

        const promises = [];
        for (const key in data) {
          const monitoring_team_of_bspc_id = data[key].monitoring_team_of_bspc_id;
          const bsp2Id = data[key].id;

          delete data[key].monitoring_team_of_bspc_id;
          const teamMemberData = await db.sequelize.query(
            "Select monitoring_team_of_bspc_members.id, monitoring_team_of_bspc_members.name, monitoring_team_of_bspc_members.mobile_number, monitoring_team_of_bspc_members.email_id, monitoring_team_of_bspc_members.address, agency_types.name as agency_name, m_designations.name as designation from monitoring_team_of_bspc_members left join m_designations on m_designations.id = monitoring_team_of_bspc_members.designation_id left join agency_types on agency_types.id = monitoring_team_of_bspc_members.type_of_agency and agency_types.is_active=1 where monitoring_team_of_bspc_members.monitoring_team_of_bspc_id = :monitoring_team_of_bspc_id",
            {
              replacements: { monitoring_team_of_bspc_id: monitoring_team_of_bspc_id },
              type: QueryTypes.SELECT
            }
          );
          const lotTagData = await db.sequelize.query(
            "Select bsp_proforma_2_seeds.lot_number, string_agg(bsp_proforma_2_seeds.tag_range, ',') as tags from bsp_proforma_2_seeds where bsp_proforma_2_seeds.bsp_proforma_2_id = :bsp_proforma_2_id group by bsp_proforma_2_seeds.lot_number order by bsp_proforma_2_seeds.lot_number",
            {
              replacements: { bsp_proforma_2_id: bsp2Id },
              type: QueryTypes.SELECT
            }
          );

          const lotData = [];

          const promises2 = [];
          for (const key2 in lotTagData) {

            lotData[key2] = {
              lot: lotTagData[key2].lot_number,
              tags: lotTagData[key2].tags.split(',')
            };

            const promise2 = new Promise((resolve) => {
              resolve(key2);
            });
            promises2.push(promise2);
          }
          await Promise.all(promises2);

          data[key]['team_data'] = teamMemberData;
          data[key]['source'] = lotData;
          data[key]['sci_userId'] = req.body.userId;

          const promise = new Promise((resolve) => {
            resolve(key);
          });
          promises.push(promise);
        }
        await Promise.all(promises);

        returnResponse = {
          count: data.length,
          rows: data
        };

        response(res, data.length ? status.DATA_AVAILABLE : status.DATA_NOT_AVAILABLE, 200, returnResponse, internalCall);
      }
    } catch (error) {
      returnResponse = {
        error: error.message
      }
      console.log(returnResponse);
      response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }


  static registerBspProforma2sInspectionReport = async (req, res) => {
    let returnResponse = {};
    const { internalCall } = req.body;
    try {
      let rules = {
        'field_code': 'required|string',
        'estimated_quantity': 'required|string',
        'report': 'required|string',
        'user_email_id': 'required|string|email',
        'id': 'required|integer',
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

        const { field_code, estimated_quantity, report, user_email_id, id } = req.body;


        let data = await db.sequelize.query(
          "select bsp_proforma_2s.is_inspected, bsp_proforma_2s.year, bsp_proforma_2s.crop_code, bsp_proforma_2s.variety_code, bsp_proforma_2s.season, bsp_proforma_2s.id as bsp_proforma_2_id, monitoring_team_of_bspc.id as monitoring_team_of_id, 'Pending' as status, 0 as is_freezed " +
          "from bsp_proforma_2s " +
          "INNER Join monitoring_team_of_bspc on monitoring_team_of_bspc.year = bsp_proforma_2s.year and monitoring_team_of_bspc.season = bsp_proforma_2s.season and monitoring_team_of_bspc.crop_code = bsp_proforma_2s.crop_code and monitoring_team_of_bspc.user_id = bsp_proforma_2s.user_id and monitoring_team_of_bspc.is_active=1 " +
          "inner join monitoring_team_of_bspc_members on monitoring_team_of_bspc_members.monitoring_team_of_bspc_id = monitoring_team_of_bspc.id and monitoring_team_of_bspc_members.is_active = 1 " +
          "where monitoring_team_of_bspc_members.email_id = :user_email_id and bsp_proforma_2s.field_code = :field_code and bsp_proforma_2s.id = :id and monitoring_team_of_bspc_members.is_team_lead = 1;",
          {
            replacements: { user_email_id: user_email_id, field_code: field_code, id: id },
            type: QueryTypes.SELECT
          }
        );

        if (!(data && data.length)) {
          returnResponse['id'] = ['Invalid Request'];
          response(res, status.BAD_REQUEST, 400, returnResponse, internalCall);
        } else {

          data = data[0];

          if (data && data.is_inspected) {
            returnResponse['id'] = ['Inspection already registered for the request'];
            response(res, status.INSPECTION_ALREADY_SUBMITTED, 400, returnResponse, internalCall);
          } else {

            let data2 = await db.sequelize.query(
              "select bsp_proforma_3s.id " +
              "from bsp_proforma_3s " +
              "where bsp_proforma_3s.bsp_proforma_2_id = :bsp_proforma_2_id and bsp_proforma_3s.status='Pending' and bsp_proforma_3s.is_freezed = 0;",
              {
                replacements: { bsp_proforma_2_id: data.bsp_proforma_2_id },
                type: QueryTypes.SELECT
              }
            );
            if (!(data2 && data2.length)) {
              returnResponse['id'] = ['Invalid Request'];
              response(res, status.INSPECTION_ALREADY_SUBMITTED, 400, returnResponse, internalCall);
            } else {

              const bsp3Id = data2.id;

              const updateDataBsp3 = {
                monitoring_team_of_id: data.monitoring_team_of_id,
                report: report,
                estimated_production: parseFloat(estimated_quantity)
              };

              // update record in bspPerformaBspThree
              await bspPerformaBspThree.update(updateDataBsp3, {
                where: {
                  id: bsp3Id
                }
              }).then(function (item) {
              }).catch(function (err) {
                returnResponse = {
                  error: err.message
                }
                console.log(returnResponse);
                response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
              });

              const updateData = {
                is_inspected: true
              };

              // update status of bspPerformaBspTwo
              await bspPerformaBspTwo.update(updateData, {
                where: {
                  id: data.bsp_proforma_2_id
                }
              }).then(function (item) {
              }).catch(function (error) {
                returnResponse = {
                  error: error.message
                }
                console.log(returnResponse);
                response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
              });

              response(res, status.INSPECTION_SUBMITTED, 200, returnResponse, internalCall);
            }
          }
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

  static getLastPageFromTableDataSummary = async (totalRecord, page, pageSize) => {
    let returnResponse = 0;
    try {
      // Calculate the total number of pages
      const totalPages = Math.ceil(totalRecord / pageSize);
      // Ensure the page number is within valid range
      const validPageNumber = Math.max(Math.min(page, totalPages), 1);
      // Calculate the starting index for the last page
      const lastPageStart = (validPageNumber - 1) * pageSize;
      // Simulate data retrieval (replace this with your actual data retrieval logic)
      const allData = Array.from({ length: totalRecord }, (_, i) => i + 1);
      // Retrieve the data for the last page
      return (allData.slice(lastPageStart, lastPageStart + pageSize))[0];
    } catch (error) {
      // returnResponse = error.message;
      return returnResponse;
    }
  }

  static getBspProforma1sVarieties = async (req, res) => {
    let returnResponse = {};
    const { internalCall } = req.body;
    try {
      let rules = {
        'search.year': 'string',
        'search.season': 'string',
        'search.crop_code': 'string',
        'search.state_code': 'string',
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
      }

      let condition = {
        include: [
          {
            model: bspProformaOneBspc,
            required: true,
            attributes: []
          },
          {
            model: bspPerformaBspTwo,
            as: 'bspOneTwoVC',
            required: false,
            where: {
              is_active: 1
            },
            attributes: []
          },
          {
            model: varietyModel,
            required: true,
            attributes: []
          }
        ],
        where: {
          is_active: 1,
          ['$bspOneTwoVC.id$']: null
        },
        group: ['bsp_proforma_1s.variety_code', 'm_crop_variety.variety_name', 'bsp_proforma_1s.variety_code'],
        raw: true,
        attributes: [
          [sequelize.col('bsp_proforma_1s.variety_code'), 'value'],
          [sequelize.literal('m_crop_variety.variety_name'), 'display_text'],
          [sequelize.literal('m_crop_variety.type'), 'variety_type'],
          'bsp_proforma_1s.variety_code',
          [sequelize.literal('SUM(bsp_proforma_1_bspc.target_qunatity::float)'), 'target_quantity'],
        ]
      };

      let condition2 = {
        include: [
        ],
        where: {
          is_active: 1,
        },
        raw: true,
        attributes: [
          [sequelize.literal('SUM(indent_quantity)'), 'national_indent'],
          [sequelize.literal('string_agg(DISTINCT variety_code, \',\')'), 'variety_codes'],
          [sequelize.literal('count(DISTINCT variety_code)'), 'count']
        ]
      };

      let condition3 = {
        include: [
        ],
        where: {
          is_active: 1,
        },
        raw: true,
        attributes: [
          [sequelize.literal('SUM(quantity)'), 'direct_indent'],
          [sequelize.literal('string_agg(DISTINCT variety_code, \',\')'), 'variety_codes'],
          [sequelize.literal('count(DISTINCT variety_code)'), 'count']
        ]
      };

      if (req.body.search) {
        if (req.body.search.year) {
          condition.where.year = {
            [Op.in]: req.body.search.year.toString().split(',')
          };

          condition.include[1].where.year = {
            [Op.in]: req.body.search.year.toString().split(',')
          };

          condition2.where.year = {
            [Op.in]: req.body.search.year.toString().split(',')
          };
          condition3.where.year = {
            [Op.in]: req.body.search.year.toString().split(',')
          };
        }
        if (req.body.search.season) {
          condition.where.season = {
            [Op.in]: req.body.search.season.toString().split(',')
          };

          condition.include[1].where.season = {
            [Op.in]: req.body.search.season.toString().split(',')
          };

          condition2.where.season = {
            [Op.in]: req.body.search.season.toString().split(',')
          };
          condition3.where.season = {
            [Op.in]: req.body.search.season.toString().split(',')
          };
        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = {
            [Op.in]: req.body.search.crop_code.toString().split(',')
          };

          condition.include[1].where.crop_code = {
            [Op.in]: req.body.search.crop_code.toString().split(',')
          };

          condition2.where.crop_code = {
            [Op.in]: req.body.search.crop_code.toString().split(',')
          };
          condition3.where.crop_code = {
            [Op.in]: req.body.search.crop_code.toString().split(',')
          };
        }
        if (req.body.search.variety_code) {
          condition.where.variety_code = {
            [Op.in]: req.body.search.variety_code.toString().split(',')
          };

          condition.include[1].where.variety_code = {
            [Op.in]: req.body.search.variety_code.toString().split(',')
          };

          condition2.where.variety_code = {
            [Op.in]: req.body.search.variety_code.toString().split(',')
          };
          condition3.where.variety_code = {
            [Op.in]: req.body.search.variety_code.toString().split(',')
          };
        }
        if (req.body.search.user_id) {
          condition.where['$bsp_proforma_1_bspc.bspc_id$'] = {
            [Op.in]: req.body.search.user_id.toString().split(',')
          };
          condition.include[1].where.user_id = {
            [Op.in]: req.body.search.user_id.toString().split(',')
          };

          condition2.where.user_id = {
            [Op.in]: req.body.search.user_id.toString().split(',')
          };

          condition3.where.user_id = {
            [Op.in]: req.body.search.user_id.toString().split(',')
          };
        }
      }

      condition.order = [[sequelize.col('variety_name'), 'asc']];
      const varietyList = await bspPerformaBspOne.findAll(condition);
      const nationalIndentData = await indentOfBreederseedModel.findAll(condition2);
      const directIndentData = await directIndent.findAll(condition3);

      let varietyCount = 0;
      let varietyTargetQuantity = 0;

      await varietyList.forEach((num, index) => {
        varietyCount++;
        varietyTargetQuantity += (num && num.target_quantity ? parseFloat(num.target_quantity) : 0);
      });


      const directIndentVarieties = directIndentData && directIndentData.length && directIndentData[0].variety_codes ? directIndentData[0].variety_codes.split(',') : [];
      const nationalIndentVarieties = nationalIndentData && nationalIndentData.length && nationalIndentData[0].variety_codes ? nationalIndentData[0].variety_codes.split(',') : [];

      const tempArray = nationalIndentVarieties.concat(directIndentVarieties);
      const uniqueNationalDirectVarieties = await tempArray.filter((item, i, ar) => ar.indexOf(item) === i);
      console.log('uniqueNationalDirectVarieties: ', uniqueNationalDirectVarieties);

      let bsp1Varieties = varietyList.map(x => x['variety_code']);
      bsp1Varieties = await bsp1Varieties.filter((item, i, ar) => ar.indexOf(item) === i);
      console.log('bsp1Varieties: ', bsp1Varieties);

      const tempArray2 = bsp1Varieties.concat(uniqueNationalDirectVarieties);
      let uniqueNationalDirectBSP1Varieties = await tempArray2.filter((item, i, ar) => ar.indexOf(item) === i);
      console.log('uniqueNationalDirectBSP1Varieties: ', uniqueNationalDirectBSP1Varieties);

      // Unique national and direct varieties to be added in the bsp1 variety list
      const tempArray3 = await uniqueNationalDirectBSP1Varieties.filter(function (el) {
        return bsp1Varieties.indexOf(el) < 0;
      });

      returnResponse = {
        totalVarieties: varietyCount,
        totalTargetQuantity: varietyTargetQuantity,
        nationalIndent: nationalIndentData && nationalIndentData.length && nationalIndentData[0].national_indent ? parseFloat(nationalIndentData[0].national_indent) : 0,
        nationalVarietiesIndentCount: nationalIndentData && nationalIndentData.length && nationalIndentData[0].count ? parseFloat(nationalIndentData[0].count) : 0,
        directIndent: directIndentData && directIndentData.length && directIndentData[0].direct_indent ? parseFloat(directIndentData[0].direct_indent) : 0,
        directVarietiesIndentCount: directIndentData && directIndentData.length && directIndentData[0].count ? parseFloat(directIndentData[0].count) : 0,
        varietyList: varietyList
      };

      return response(res, status.DATA_AVAILABLE, 200, returnResponse, internalCall);
    } catch (error) {
      returnResponse = {
        error: error.message
      }
      console.log(returnResponse);
      response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }

  static getBspProforma2sVarieties = async (req, res) => {
    let returnResponse = {};
    const { internalCall } = req.body;
    try {
      let rules = {
        'search.year': 'string',
        'search.season': 'string',
        'search.crop_code': 'string',
        'search.state_code': 'string',
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
      }

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

      let condition = {
        include: [
          {
            model: varietyModel,
            required: true,
            attributes: []
          }
        ],
        where: {
          is_active: 1,
          ...production_type
        },
        group: ['bsp_proforma_2s.variety_code', 'm_crop_variety.variety_name', 'm_crop_variety.status'],
        raw: true,
        attributes: [
          [sequelize.col('bsp_proforma_2s.variety_code'), 'value'],
          [sequelize.literal('m_crop_variety.variety_name'), 'display_text'],
          // [sequelize.literal('m_crop_variety.status'), 'variety_type'],
          'bsp_proforma_2s.variety_code',
          [sequelize.literal('m_crop_variety.status'), 'variety_type'],
        ]
      };

      if (req.body.search) {
        if (req.body.search.year) {
          condition.where.year = {
            [Op.in]: req.body.search.year.toString().split(',')
          };
        }
        if (req.body.search.season) {
          condition.where.season = {
            [Op.in]: req.body.search.season.toString().split(',')
          };
        }
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
        if (req.body.search.user_id) {
          condition.where.user_id = {
            [Op.in]: req.body.search.user_id.toString().split(',')
          };
        }
      }

      condition.order = [[sequelize.col('variety_name'), 'asc']];
      const varietyList = await bspPerformaBspTwo.findAll(condition);

      returnResponse = {
        count: varietyList.length,
        rows: varietyList
      };

      return response(res, returnResponse.count ? status.DATA_AVAILABLE : status.DATA_NOT_AVAILABLE, 200, returnResponse, internalCall);
    } catch (error) {
      returnResponse = {
        error: error.message
      }
      console.log(returnResponse);
      response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }

  static getVarietiesParentalLine = async (req, res) => {
    let returnResponse = {};
    const { internalCall } = req.body;
    try {
      let rules = {
        'search.year': 'string',
        'search.season': 'string',
        'search.crop_code': 'string',
        'search.variety_code': 'string',
        'search.id': 'string',
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
        include: [
        ],
        where: {
        },
        raw: true,
        attributes: [
          [db.Sequelize.fn("Distinct", db.Sequelize.col("m_variety_lines.line_variety_code")), "value"],
          [sequelize.literal("m_variety_lines.line_variety_name"), 'display_text'],
          'm_variety_lines.line_variety_name'
        ]
      };

      if (req.body.search) {
        if (req.body.search.id) {
          condition.where.id = {
            [Op.in]: req.body.search.id.toString().split(',')
          };
        }
        if (req.body.search.variety_code) {
          condition.where.variety_code = {
            [Op.in]: req.body.search.variety_code.toString().split(',')
          };
        }
      }

      condition.order = [[sequelize.col('m_variety_lines.line_variety_name'), 'asc']];
      returnResponse = await db.varietLineModel.findAll(condition);

      response(res, returnResponse.length ? status.DATA_AVAILABLE : status.DATA_NOT_AVAILABLE, 200, returnResponse, internalCall);
    } catch (error) {
      returnResponse = {
        error: error.message
      }
      console.log(returnResponse);
      response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }

  static getLineOfSeedInventory = async (req, res) => {
    let returnResponse = {};
    const { internalCall } = req.body;
    try {
      let rules = {
        'search.year': 'string',
        'search.season': 'string',
        'search.crop_code': 'string',
        'search.variety_code': 'string',
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
        include: [
          {
            model: db.varietLineModel,
            required: true,
            attributes: []
          }
        ],
        where: {
          is_active: 1,
          // where:{
          //   stage_id:{
          //     [Op.in]:['6','7']
          //   }
          // }
        },
        raw: true,
        attributes: [
          [db.Sequelize.fn("Distinct", db.Sequelize.col("m_variety_line.line_variety_code")), "value"],
          [sequelize.literal("m_variety_line.line_variety_name"), 'display_text'],
          'm_variety_line.line_variety_name'
        ]
      };
      if (req.body.search) {
        if (req.body.search.year) {
          condition.where.year = {
            [Op.in]: req.body.search.year.toString().split(',')
          };
        }
        if (req.body.search.season) {
          condition.where.season = {
            [Op.in]: req.body.search.season.toString().split(',')
          };
        }
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
        if (req.body.search.user_id) {
          condition.where.bspc_id = {
            [Op.in]: req.body.search.user_id.toString().split(',')
          };
        }
      }
      condition.order = [[sequelize.col('m_variety_line.line_variety_name'), 'asc']];
      returnResponse = await seedInventory.findAll(condition);
      response(res, returnResponse.length ? status.DATA_AVAILABLE : status.DATA_NOT_AVAILABLE, 200, returnResponse, internalCall);
    } catch (error) {
      returnResponse = {
        error: error.message
      }
      console.log(returnResponse);
      response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }


  static getSeedTypeOfSeedInventory = async (req, res) => {
    let returnResponse = {};
    const { internalCall } = req.body;
    try {
      let rules = {
        'search.year': 'string',
        'search.season': 'string',
        'search.crop_code': 'string',
        'search.variety_code': 'string',
        'search.line_variety_code': 'string',
        'search.id': 'string',
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
      let { variety_code, line_variety_code } = req.body.search;
      let whereClause = {};
      if (variety_code) {
        whereClause.variety_code = variety_code
      }
      if (line_variety_code) {
        whereClause.variety_line_code = line_variety_code
      }
      let condition = {
        include: [
          {
            model: seedClassModel,
            required: true,
            attributes: []
          },
          {
            model: db.bspPerformaBspOne,
            // on: {
            //   col1: sequelize.where(sequelize.col("bsp_proforma_1.variety_line_code"), "=", sequelize.col("seed_inventries.line_variety_code")),
            // },
            include: [
              {
                model: db.bspProformaOneBspc,
                where: {

                  // isPermission:{
                  //   [Op.eq]:true
                  // }
                },
                required: false,
                attributes: []
              },


            ],
            required: false,
            attributes: []
          },
        ],
        where: {
          is_active: 1,
          // ...whereClause

        },
        raw: true,
        group: [
          [sequelize.col('seed_class_id'), 'value'],
          [sequelize.col('m_seed_class.type'), 'display_text'],
          [sequelize.col('bsp_proforma_1->bsp_proforma_1_bspc.isPermission'), 'isPermission'],
          'm_seed_class.type'
        ],
        attributes: [
          // [db.Sequelize.fn("Distinct", db.Sequelize.col("seed_class_id")), "value"],
          [sequelize.col('seed_class_id'), 'value'],
          [sequelize.col('m_seed_class.type'), 'display_text'],
          // [sequelize.literal("m_seed_class.type"), 'display_text'],
          [sequelize.col('bsp_proforma_1->bsp_proforma_1_bspc.isPermission'), 'isPermission'],
          // [sequelize.col('bsp_proforma_1->seed_for_production.breeder_seed_available_qnt'),'breeder_seed_available_qnt'],
          // [sequelize.fn('SUM', sequelize.col('bsp_proforma_1->seed_for_production.breeder_seed_available_qnt')), 'breeder_seed_available_qnt'],

          // [sequelize.fn('SUM', sequelize.col('bsp_proforma_1->seed_for_production.nucleus_seed_available_qnt')), 'nucleus_seed_available_qnt'],
          'm_seed_class.type'
        ],
      };
      let condition1 = {
        include: [
          {
            model: seedInventoryTag,
            attributes: []
          }
        ],

        raw: true,
        where: {
          // crop_code: req.body.search.crop_code.toString().split(','),
          seed_class_id: 6
        },
        attributes: [
          [sequelize.fn('SUM', sequelize.col('seed_inventries_tag.quantity')), 'nucleus_seed_available_qnt'],
          // [sequelize.col('bsp_proforma_1s.variety_code'), 'variety_code'],
          [sequelize.col('seed_inventries.seed_class_id'), 'seed_class_id'],
          // [sequelize.col('seed_inventries_tag.quantity'), 'quantity'],
        ],
        group: [
          [sequelize.col('seed_inventries.seed_class_id'), 'seed_class_id']
        ]
      };
      let condition2 = {
        include: [
          {
            model: seedInventoryTag,
            attributes: []
          }
        ],

        raw: true,
        where: {
          // crop_code: req.body.search.crop_code.toString().split(','),
          seed_class_id: 7
        },
        attributes: [
          [sequelize.fn('SUM', sequelize.col('seed_inventries_tag.quantity')), 'breeder_seed_available_qnt'],
          // [sequelize.col('bsp_proforma_1s.variety_code'), 'variety_code'],
          [sequelize.col('seed_inventries.seed_class_id'), 'seed_class_id'],
          // [sequelize.col('seed_inventries.seed_class_id'), 'seed_class_id'],
          // [sequelize.col('seed_inventries_tag.quantity'), 'quantity'],
        ],
        group: [
          [sequelize.col('seed_inventries.seed_class_id'), 'seed_class_id']
        ]
      };

      if (req.body.search) {
        if (req.body.search.year) {
          condition.where.year = {
            [Op.in]: req.body.search.year.toString().split(',')
          };
        }
        if (req.body.search.season) {
          condition.where.season = {
            [Op.in]: req.body.search.season.toString().split(',')
          };
        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = {
            [Op.in]: req.body.search.crop_code.toString().split(',')
          };
          condition1.where.crop_code = {
            [Op.in]: req.body.search.crop_code.toString().split(',')
          };
          condition2.where.crop_code = {
            [Op.in]: req.body.search.crop_code.toString().split(',')
          };
        }
        if (req.body.search.variety_code) {
          condition.where.variety_code = {
            [Op.in]: req.body.search.variety_code.toString().split(',')
          };
          condition1.where.variety_code = {
            [Op.in]: req.body.search.variety_code.toString().split(',')
          };
          condition2.where.variety_code = {
            [Op.in]: req.body.search.variety_code.toString().split(',')
          };
        }
        if (req.body.search.line_variety_code) {
          condition.where.line_variety_code = {
            [Op.in]: req.body.search.line_variety_code.toString().split(',')
          };
          condition2.where.line_variety_code = {
            [Op.in]: req.body.search.line_variety_code.toString().split(',')
          };
          condition1.where.line_variety_code = {
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
          condition1.where.bspc_id = {
            [Op.in]: req.body.search.user_id.toString().split(',')
          };
          condition2.where.bspc_id = {
            [Op.in]: req.body.search.user_id.toString().split(',')
          };

        }
      }

      condition.order = [[sequelize.col('m_seed_class.type'), 'asc']];
      let datas = await seedInventory.findAll(condition);

      let nucleusData = await seedInventory.findAll(condition1);
      let breederData = await seedInventory.findAll(condition2);
      returnResponse = {
        data: datas,
        breederData: breederData,
        nucleusData: nucleusData
      }
      response(res, status.DATA_AVAILABLE, 200, returnResponse, internalCall);
    } catch (error) {
      returnResponse = {
        error: error.message
      }
      console.log(returnResponse);
      response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }

  static getStageOfSeedInventory = async (req, res) => {
    let returnResponse = {};
    const { internalCall } = req.body;
    try {
      let rules = {
        'search.year': 'string',
        'search.season': 'string',
        'search.crop_code': 'string',
        'search.variety_code': 'string',
        'search.line_variety_code': 'string',
        'search.seed_class_id': 'string',
        'search.id': 'string',
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
        include: [
          {
            model: stageModel,
            required: true,
            attributes: []
          }
        ],
        where: {
          is_active: 1
        },
        raw: true,
        attributes: [
          [db.Sequelize.fn("Distinct", db.Sequelize.col("stage_id")), "value"],
          [sequelize.literal("stage.stage_field"), 'display_text'],
          'stage.stage_field'
        ]
      };

      if (req.body.search) {
        if (req.body.search.year) {
          condition.where.year = {
            [Op.in]: req.body.search.year.toString().split(',')
          };
        }
        if (req.body.search.season) {
          condition.where.season = {
            [Op.in]: req.body.search.season.toString().split(',')
          };
        }
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
        if (req.body.search.seed_class_id) {
          condition.where.seed_class_id = {
            [Op.in]: req.body.search.seed_class_id.toString().split(',')
          };
        }
        if (req.body.search.id) {
          condition.where.stage_id = {
            [Op.in]: req.body.search.id.toString().split(',')
          };
        }
        if (req.body.search.user_id) {
          condition.where.bspc_id = {
            [Op.in]: req.body.search.user_id.toString().split(',')
          };
        }
      }

      condition.order = [[sequelize.col('stage.stage_field'), 'asc']];
      returnResponse = await seedInventory.findAll(condition);

      response(res, status.DATA_AVAILABLE, 200, returnResponse, internalCall);
    } catch (error) {
      returnResponse = {
        error: error.message
      }
      console.log(returnResponse);
      response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }

  static getYearOfSeedInventory = async (req, res) => {
    let returnResponse = {};
    const { internalCall } = req.body;
    try {
      let rules = {
        'search.year': 'string',
        'search.season': 'string',
        'search.crop_code': 'string',
        'search.variety_code': 'string',
        'search.seed_class_id': 'string',
        'search.stage_id': 'string',
        'search.line_variety_code': 'string',
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
        where: {
          is_active: 1
        },
        raw: true,
        attributes: [
          [db.Sequelize.fn("Distinct", db.Sequelize.col("year")), "value"],
          [sequelize.literal("concat(year, '-', RIGHT((Year+1)::VARCHAR, 2))"), 'display_text'],
          'year'
        ]
      };

      if (req.body.search) {
        if (req.body.search.year) {
          condition.where.year = {
            [Op.in]: req.body.search.year.toString().split(',')
          };
        }
        if (req.body.search.season) {
          condition.where.season = {
            [Op.in]: req.body.search.season.toString().split(',')
          };
        }
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
        if (req.body.search.seed_class_id) {
          condition.where.seed_class_id = {
            [Op.in]: req.body.search.seed_class_id.toString().split(',')
          };
        }
        if (req.body.search.stage_id) {
          condition.where.stage_id = {
            [Op.in]: req.body.search.stage_id.toString().split(',')
          };
        }
        if (req.body.search.user_id) {
          condition.where.bspc_id = {
            [Op.in]: req.body.search.user_id.toString().split(',')
          };
        }
      }

      condition.order = [['year', 'asc']];
      returnResponse = await seedInventory.findAll(condition);

      response(res, status.DATA_AVAILABLE, 200, returnResponse, internalCall);
    } catch (error) {
      returnResponse = {
        error: error.message
      }
      console.log(returnResponse);
      response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }

  static getSeasonOfSeedInventory = async (req, res) => {
    let returnResponse = {};
    const { internalCall } = req.body;
    try {
      let rules = {
        'search.year': 'string',
        'search.season': 'string',
        'search.crop_code': 'string',
        'search.variety_code': 'string',
        'search.seed_class_id': 'string',
        'search.stage_id': 'string',
        'search.line_variety_code': 'string',
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
        include: [
          {
            model: seasonModel,
            required: true,
            attributes: []
          }
        ],
        where: {
          is_active: 1
        },
        raw: true,
        attributes: [
          [db.Sequelize.fn("Distinct", db.Sequelize.col("m_season.season")), "value"],
          [sequelize.literal("Case when seed_inventries.season='R' then 'Rabi' when seed_inventries.season='K' then 'Kharif' else seed_inventries.season end"), 'display_text'],
          'season'
        ]
      };

      if (req.body.search) {
        if (req.body.search.year) {
          condition.where.year = {
            [Op.in]: req.body.search.year.toString().split(',')
          };
        }
        if (req.body.search.season) {
          condition.where.season = {
            [Op.in]: req.body.search.season.toString().split(',')
          };
        }
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
        if (req.body.search.seed_class_id) {
          condition.where.seed_class_id = {
            [Op.in]: req.body.search.seed_class_id.toString().split(',')
          };
        }
        if (req.body.search.stage_id) {
          condition.where.stage_id = {
            [Op.in]: req.body.search.stage_id.toString().split(',')
          };
        }
        if (req.body.search.user_id) {
          condition.where.bspc_id = {
            [Op.in]: req.body.search.user_id.toString().split(',')
          };
        }
      }

      condition.order = [[sequelize.col('seed_inventries.season'), 'desc']];
      returnResponse = await seedInventory.findAll(condition);

      response(res, status.DATA_AVAILABLE, 200, returnResponse, internalCall);
    } catch (error) {
      returnResponse = {
        error: error.message
      }
      console.log(returnResponse);
      response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }

  static getLotNoOfSeedInventory = async (req, res) => {
    let returnResponse = {};
    const { internalCall } = req.body;
    try {
      let rules = {
        'search.year': 'string',
        'search.season': 'string',
        'search.crop_code': 'string',
        'search.variety_code': 'string',
        'search.seed_class_id': 'string',
        'search.stage_id': 'string',
        'search.line_variety_code': 'string',
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
        include: [
          {
            model: seedInventoryTag,
            required: true,
            where: {
              quantity_remaining: {
                [Op.gt]: 0
              }
            },
            attributes: [],
            include: [
              {
                model: seedInventory,
                required: true,
                where: {
                  is_active: 1
                },
                attributes: []
              }
            ]
          },
        ],
        where: {
          is_used: 0,
          temp_used: 0,
        },
        raw: true,
        attributes: [
          [db.Sequelize.fn("Distinct", db.Sequelize.col("seed_inventries_tag.lot_number")), "value"],
          [sequelize.literal("seed_inventries_tag.lot_number"), 'display_text'],
          [sequelize.literal("seed_inventries_tag.bag_size"), 'bag_size'],
          'seed_inventries_tag.lot_number',
          [sequelize.literal("seed_inventries_tag.id"), 'lot_id'],
        ]
      };

      if (req.body.search) {
        if (req.body.search.year) {
          condition.where['$seed_inventries_tag->seed_inventry.year$'] = {
            [Op.in]: req.body.search.year.toString().split(',')
          };
        }
        if (req.body.search.season) {
          condition.where['$seed_inventries_tag->seed_inventry.season$'] = {
            [Op.in]: req.body.search.season.toString().split(',')
          };
        }
        if (req.body.search.crop_code) {
          condition.where['$seed_inventries_tag->seed_inventry.crop_code$'] = {
            [Op.in]: req.body.search.crop_code.toString().split(',')
          };
        }
        if (req.body.search.variety_code) {
          condition.where['$seed_inventries_tag->seed_inventry.variety_code$'] = {
            [Op.in]: req.body.search.variety_code.toString().split(',')
          };
        }
        if (req.body.search.line_variety_code) {
          condition.where['$seed_inventries_tag->seed_inventry.line_variety_code$'] = {
            [Op.in]: req.body.search.line_variety_code.toString().split(',')
          };
        }

        if (req.body.search.seed_class_id) {
          condition.where['$seed_inventries_tag->seed_inventry.seed_class_id$'] = {
            [Op.in]: req.body.search.seed_class_id.toString().split(',')
          };
        }
        if (req.body.search.stage_id) {
          condition.where['$seed_inventries_tag->seed_inventry.stage_id$'] = {
            [Op.in]: req.body.search.stage_id.toString().split(',')
          };
        }
        if (req.body.search.user_id) {
          condition.where['$seed_inventries_tag->seed_inventry.bspc_id$'] = {
            [Op.in]: req.body.search.user_id.toString().split(',')
          };
        }
      }

      condition.order = [[sequelize.col('seed_inventries_tag.lot_number'), 'ASC']];
      returnResponse = await seedInventoryTagDetail.findAll(condition);

      response(res, status.DATA_AVAILABLE, 200, returnResponse, internalCall);
    } catch (error) {
      returnResponse = {
        error: error.message
      }
      console.log(returnResponse);
      response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }

  static getTagNoOfSeedInventory = async (req, res) => {
    let returnResponse = {};
    const { internalCall } = req.body;
    try {
      let rules = {
        'search.year': 'string',
        'search.season': 'string',
        'search.crop_code': 'string',
        'search.variety_code': 'string',
        'search.seed_class_id': 'string',
        'search.stage_id': 'string',
        'search.lot_number': 'string',
        'search.user_id': 'string',
        'search.exclude_tag_range': 'string',
        'search.line_variety_code': 'string',
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
        include: [
          {
            model: seedInventoryTag,
            required: true,
            where: {
              quantity_remaining: {
                [Op.gt]: 0
              }
            },
            attributes: [],
            include: [
              {
                model: seedInventory,
                required: true,
                where: {
                  is_active: 1
                },
                attributes: []
              }
            ]
          },
        ],
        where: {
          is_used: 0,
          temp_used: 0,
        },
        raw: true,
        attributes: [
          [db.Sequelize.fn("Distinct", db.Sequelize.col("seed_inventry_tag_details.tag_number")), "value"],
          [sequelize.literal("seed_inventry_tag_details.tag_number"), 'display_text'],
          'seed_inventry_tag_details.tag_number',
          [sequelize.col('seed_inventry_tag_details.weight'), 'quantity'],
          [sequelize.col('seed_inventry_tag_details.weight_used'), 'quantity_used'],
          [sequelize.col('seed_inventry_tag_details.weight_remaining'), 'quantity_remaining'],
          [sequelize.col('seed_inventry_tag_details.seed_inventry_tag_id'), 'seed_inventry_tag_id'],
          [sequelize.literal("seed_inventry_tag_details.id"), 'tag_id'],
        ]
      };

      if (req.body.search) {
        if (req.body.search.year) {
          condition.where['$seed_inventries_tag->seed_inventry.year$'] = {
            [Op.in]: req.body.search.year.toString().split(',')
          };
        }
        if (req.body.search.season) {
          condition.where['$seed_inventries_tag->seed_inventry.season$'] = {
            [Op.in]: req.body.search.season.toString().split(',')
          };
        }
        if (req.body.search.crop_code) {
          condition.where['$seed_inventries_tag->seed_inventry.crop_code$'] = {
            [Op.in]: req.body.search.crop_code.toString().split(',')
          };
        }
        if (req.body.search.variety_code) {
          condition.where['$seed_inventries_tag->seed_inventry.variety_code$'] = {
            [Op.in]: req.body.search.variety_code.toString().split(',')
          };
        }
        if (req.body.search.line_variety_code) {
          condition.where['$seed_inventries_tag->seed_inventry.line_variety_code$'] = {
            [Op.in]: req.body.search.line_variety_code.toString().split(',')
          };
        }
        if (req.body.search.seed_class_id) {
          condition.where['$seed_inventries_tag->seed_inventry.seed_class_id$'] = {
            [Op.in]: req.body.search.seed_class_id.toString().split(',')
          };
        }
        if (req.body.search.stage_id) {
          condition.where['$seed_inventries_tag->seed_inventry.stage_id$'] = {
            [Op.in]: req.body.search.stage_id.toString().split(',')
          };
        }
        if (req.body.search.lot_number) {
          condition.where['$seed_inventries_tag.lot_number$'] = {
            [Op.in]: req.body.search.lot_number.toString().split(',')
          };
        }
        if (req.body.search.user_id) {
          condition.where['$seed_inventries_tag->seed_inventry.bspc_id$'] = {
            [Op.in]: req.body.search.user_id.toString().split(',')
          };
        }
        if (req.body.search.exclude_tag_range) {
          condition.where.tag_number = {
            [Op.notIn]: req.body.search.exclude_tag_range.toString().split(',')
          };
        }
        if (req.body.search.lot_id) {
          condition.where['$seed_inventries_tag.id$'] = {
            [Op.in]: req.body.search.lot_id.toString().split(',')
          };
        }
      }

      condition.order = [[sequelize.col('seed_inventry_tag_details.tag_number'), 'ASC']];
      returnResponse = await seedInventoryTagDetail.findAll(condition);

      response(res, status.DATA_AVAILABLE, 200, returnResponse, internalCall);
    } catch (error) {
      returnResponse = {
        error: error.message
      }
      console.log(returnResponse);
      response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }

  static checkQuantityOfSeedInventory = async (req, res) => {
    let returnResponse = {};
    const { internalCall } = req.body;
    try {
      let rules = {
        'quantity_data.*.user_id': 'string',
        'quantity_data.*.variety_line_code': 'string',
        'quantity_data.*.year': 'required|string',
        'quantity_data.*.season': 'required|string',
        // 'quantity_data.*.crop_code': 'required|string',
        // 'quantity_data.*.variety_code': 'required|string',
        'quantity_data.*.seed_class_id': 'required|string',
        'quantity_data.*.stage_id': 'required|string',
        'quantity_data.*.lot_id': 'required|string',
        'quantity_data.*.lot_number': 'required|string',
        'quantity_data.*.tag_id': 'required|string',
        'quantity_data.*.tag_number': 'required|string',
        'quantity_data.*.tag_quantity': 'required|string',
        'quantity_data.*.quantity_available': 'required|string',
        'quantity_data.*.quantity_sown': 'required|string',
        'total_quantity.*.seed_class_id': 'required|string',
        'total_quantity.*.quantity_sown': 'required|string',
      };

      let validation = new Validator(req.body, rules);

      const isValidData = validation.passes();

      if (!isValidData) {
        returnResponse = validation.errors.errors;
        return response(res, status.BAD_REQUEST, 400, returnResponse, internalCall);
      }

      const result = await this.checkQuantityData(req.body);
      response(res, result.message, result.status, result.data, internalCall);
    } catch (error) {
      console.log(error, 'err')
      returnResponse = {
        error: error.message
      }
      console.log(returnResponse);
      response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }

  static checkQuantityData = async (req) => {
    let returnResponse = {
      status: 200,
      message: status.OK,
      data: {}
    };
    try {
      let rules = {
        'quantity_data.*.user_id': 'string',
        'quantity_data.*.variety_line_code': 'string',
        'quantity_data.*.year': 'required|string',
        'quantity_data.*.season': 'required|string',
        // 'quantity_data.*.crop_code': 'required|string',
        // 'quantity_data.*.variety_code': 'required|string',
        'quantity_data.*.seed_class_id': 'required|string',
        'quantity_data.*.stage_id': 'required|string',
        'quantity_data.*.lot_id': 'required|string',
        'quantity_data.*.lot_number': 'required|string',
        'quantity_data.*.tag_id': 'required|string',
        'quantity_data.*.tag_number': 'required|string',
        'quantity_data.*.tag_quantity': 'required|string',
        'quantity_data.*.quantity_available': 'required|string',
        'quantity_data.*.quantity_sown': 'required|string',
        'total_quantity.*.seed_class_id': 'required|string',
        'total_quantity.*.quantity_sown': 'required',
      };

      let validation = new Validator(req, rules);

      const isValidData = validation.passes();

      if (!isValidData) {
        returnResponse = {
          status: 400,
          message: status.BAD_REQUEST,
          data: validation.errors.errors
        };
        return returnResponse;
      }

      // // temporary code start
      // returnResponse = {
      //   status: 200,
      //   message: status.DATA_VERIFIED,
      //   data: {
      //     quantity: ['Request Quantity Data Verified']
      //   }
      // };
      // return returnResponse;
      // // temporary code endInvalid Quantity Request Data

      const { quantity_data, total_quantity } = req;
      const colData = quantity_data.map(x => x['tag_number'])

      let seedClassIds = quantity_data.map(x => x['seed_class_id']);
      seedClassIds = await seedClassIds.filter((item, i, ar) => ar.indexOf(item) === i);

      if (seedClassIds.length !== total_quantity.length) {
        console.log(seedClassIds.length, 'seedClassIds.length', total_quantity.length)
        returnResponse = {
          status: 400,
          message: status.BAD_REQUEST,
          data: {
            total_quantity: ['Invalid request data 4']
          }
        };
        return returnResponse;
      } else {
        let tempArray = []
        const promises = [];
        for (const key in seedClassIds) {

          const seedClassData = await quantity_data.filter((datum) => {
            return parseInt(datum.seed_class_id) === parseInt(seedClassIds[key])
          });

          let quantity_sown = seedClassData.map(x => x['quantity_sown'])
          quantity_sown = await quantity_sown.reduce((accumulator, currentValue) => {
            return parseFloat(accumulator) + parseFloat(currentValue)
          }, 0);

          tempArray[key] = {
            seed_class_id: seedClassIds[key],
            quantity_sown: quantity_sown,
          };

          const seedClassRequestData = await total_quantity.filter((datum) => {
            return parseInt(datum.seed_class_id) === parseInt(seedClassIds[key])
          });
          console.log(seedClassRequestData, 'seedClassRequestData')
          const reqQuantity = seedClassRequestData && seedClassRequestData.length && seedClassRequestData[0] && seedClassRequestData[0].quantity_sown ? parseFloat(seedClassRequestData[0].quantity_sown) : 0;
          if (reqQuantity !== quantity_sown) {
            console.log(reqQuantity, 'seedClassIds.sdd', quantity_sown)
            returnResponse = {
              status: 400,
              message: status.BAD_REQUEST,
              data: {
                total_quantity: ['Invalid request data 1']
              }
            };
            return returnResponse;
          }

          const promise = new Promise((resolve) => {
            resolve(key);
          });
          promises.push(promise);
        }
        await Promise.all(promises);
      }

      let tagArray = [];
      const promises = [];
      for (const key in colData) {
        const tempArray = colData[key].split(',');
        tagArray = tagArray.concat(tempArray);
        if (tempArray.length > 1) {
          if (parseFloat(quantity_data[key].quantity_sown) != parseFloat(quantity_data[key].quantity_available)) {
            const index = 'quantity.' + key + '.' + 'quantity_sown';
            returnResponse = {
              status: 400,
              message: status.BAD_REQUEST,
              data: {}
            };
            returnResponse.data[index] = ['Invalid quantity shown 1'];
            return returnResponse;
          }
        } else {
          if (quantity_data[key].quantity_sown == 0 || (parseFloat(quantity_data[key].quantity_sown) > parseFloat(quantity_data[key].quantity_available))) {

            const index = 'quantity.' + key + '.' + 'quantity_sown';
            returnResponse = {
              status: 400,
              message: status.BAD_REQUEST,
              data: {}
            };
            returnResponse.data[index] = ['Invalid quantity shown 2'];
            return returnResponse;
          }
        }

        const promise = new Promise((resolve) => {
          resolve(key);
        });
        promises.push(promise);
      }
      await Promise.all(promises);

      let uniquetagArray = await tagArray.filter((item, i, ar) => ar.indexOf(item) === i);
      if (uniquetagArray.length !== tagArray.length) {
        returnResponse = {
          status: 400,
          message: status.BAD_REQUEST,
          data: {
            tag_number: ['Tag Numbers selection should be unique for each quantity row']
          }
        };
        return returnResponse;
      } else {

        const promises = [];
        for (const key in quantity_data) {

          let condition = {
            include: [
              {
                model: seedInventoryTag,
                required: true,
                where: {
                  quantity_remaining: {
                    [Op.gt]: 0
                  }
                },
                attributes: [],
                include: [
                  {
                    model: seedInventory,
                    required: true,
                    where: {
                      is_active: 1
                    },
                    attributes: []
                  }
                ]
              },
            ],
            where: {
              is_used: 0,
              temp_used: 0,
            },
            raw: true,
            attributes: [
              [sequelize.fn('DISTINCT', sequelize.col('seed_inventries_tag.seed_inventry_id')), 'seed_inventry_id'],
              [sequelize.col('seed_inventry_tag_details.tag_number'), 'tag_range'],
              [sequelize.col('seed_inventry_tag_details.weight'), 'quantity'],
              [sequelize.col('seed_inventry_tag_details.weight_used'), 'quantity_used'],
              [sequelize.col('seed_inventry_tag_details.weight_remaining'), 'quantity_remaining']
            ],
            // group:[
            //   [sequelize.col('seed_inventry_tag_details.seed_inventry_tag_id'),'seed_inventry_tag_id'],
            //   [sequelize.col('seed_inventry_tag_details.tag_number'), 'tag_range']
            // ]
          };

          if (quantity_data[key]) {
            if (quantity_data[key].year) {
              condition.where['$seed_inventries_tag->seed_inventry.year$'] = {
                [Op.in]: quantity_data[key].year.toString().split(',')
              };
            }
            if (quantity_data[key].season) {
              condition.where['$seed_inventries_tag->seed_inventry.season$'] = {
                [Op.in]: quantity_data[key].season.toString().split(',')
              };
            }
            if (quantity_data[key].crop_code) {
              condition.where['$seed_inventries_tag->seed_inventry.crop_code$'] = {
                [Op.in]: quantity_data[key].crop_code.toString().split(',')
              };
            }
            if (quantity_data[key].variety_code) {
              condition.where['$seed_inventries_tag->seed_inventry.variety_code$'] = {
                [Op.in]: quantity_data[key].variety_code.toString().split(',')
              };
            }
            if (quantity_data[key].seed_class_id) {
              condition.where['$seed_inventries_tag->seed_inventry.seed_class_id$'] = {
                [Op.in]: quantity_data[key].seed_class_id.toString().split(',')
              };
            }
            if (quantity_data[key].variety_line_code) {
              condition.where['$seed_inventries_tag->seed_inventry.line_variety_code$'] = {
                [Op.in]: quantity_data[key].variety_line_code.toString().split(',')
              };
            }
            if (quantity_data[key].stage_id) {
              condition.where['$seed_inventries_tag->seed_inventry.stage_id$'] = {
                [Op.in]: quantity_data[key].stage_id.toString().split(',')
              };
            }
            if (quantity_data[key].lot_id) {
              condition.where['$seed_inventries_tag.id$'] = {
                [Op.in]: quantity_data[key].lot_id.toString().split(',')
              };
            }
            if (quantity_data[key].lot_number) {
              condition.where['$seed_inventries_tag.lot_number$'] = {
                [Op.in]: quantity_data[key].lot_number.toString().split(',')
              };
            }
            if (quantity_data[key].user_id) {
              condition.where['$seed_inventries_tag->seed_inventry.bspc_id$'] = {
                [Op.in]: quantity_data[key].user_id.toString().split(',')
              };
            }
            if (quantity_data[key].tag_number) {
              condition.where.tag_number = {
                [Op.in]: quantity_data[key].tag_number.toString().split(',')
              };
            }
            if (quantity_data[key].tag_id) {
              condition.where.id = {
                [Op.in]: quantity_data[key].tag_id.toString().split(',')
              };
            }
          }

          const quantityData = await seedInventoryTagDetail.findAll(condition);
          const tagNumberLength = (quantity_data[key].tag_number.split(',')).length;

          if (!(quantityData && quantityData.length && quantityData.length === tagNumberLength)) {

            returnResponse = {
              status: 400,
              message: status.BAD_REQUEST,
              data: {
                tag_number: ['Invalid Tag Request Data 1']
              }
            };
            return returnResponse;
          } else {

            if (tagNumberLength === 1) {

              if (parseFloat(quantityData[0].quantity_remaining) < parseFloat(quantity_data[key].quantity_available)) {

                returnResponse = {
                  status: 400,
                  message: status.BAD_REQUEST,
                  data: {
                    quantity: ['Invalid Quantity Request Data 1 ']
                  }
                };
                return returnResponse;
              }

            } else {

              let quantitySum = quantityData.map(x => x['quantity_remaining']);
              quantitySum = await quantitySum.reduce((accumulator, currentValue) => {
                return parseFloat(accumulator) + parseFloat(currentValue)
              }, 0);
              if (parseFloat(quantitySum) < parseFloat(quantity_data[key].quantity_available)) {
                returnResponse = {
                  status: 400,
                  message: status.BAD_REQUEST,
                  data: {
                    quantity: ['Invalid Quantity Request Data ']
                  }
                };
                return returnResponse;
              }
            }
          }

          const promise = new Promise((resolve) => {
            resolve(key);
          });
          promises.push(promise);
        }
        await Promise.all(promises);

        returnResponse = {
          status: 200,
          message: status.DATA_VERIFIED,
          data: {
            quantity: ['Request Quantity Data Verified']
          }
        };
        return returnResponse;
      }
    }
    catch (error) {
      returnResponse = {
        status: 500,
        message: status.UNEXPECTED_ERROR,
        data: {
          error: error.message
        }
      }
      return returnResponse;
    }
  }

  static registerQuantityOfSeedInventory = async (req, res) => {
    let returnResponse = {};
    const { internalCall } = req.body;
    try {
      let rules = {
        'data.*.year': 'required|string',
        'data.*.season': 'required|string',
        'data.*.crop_code': 'required|string',
        'data.*.variety_code': 'required|string',
        'data.*.variety_line_code': 'string',
        'data.*.user_id': 'required|string',
        'data.*.state_code': 'required|string',
        'data.*.district_code': 'required|string',
        'data.*.address': 'required|string',
        'data.*.area_shown': 'required',
        'data.*.date_of_showing': 'required|string',
        'data.*.class_of_seed': 'string|in:bs,ns',
        'data.*.quantity_of_ns_shown': 'required_if:data.*.class_of_seed,ns|string',
        'data.*.quantity_of_bs_shown': 'required_if:data.*.class_of_seed,bs|string',
        'data.*.expected_inspection_from': 'required|string',
        'data.*.expected_inspection_to': 'required|string',
        'data.*.expected_harvest_from': 'required|string',
        'data.*.expected_harvest_to': 'required|string',
        'data.*.expected_production': 'required|string',
        'data.*.quantity_data.*.variety_line_code': 'string',
        'data.*.quantity_data.*.year': 'required|string',
        'data.*.quantity_data.*.season': 'required|string',
        // 'data.*.quantity_data.*.crop_code': 'required|string',
        // 'data.*.quantity_data.*.variety_code': 'required|string',
        // 'data.*.quantity_data.*.seed_class_id': 'required|string',
        'data.*.quantity_data.*.stage_id': 'required|string',
        'data.*.quantity_data.*.lot_id': 'required|string',
        'data.*.quantity_data.*.lot_number': 'required|string',
        'data.*.quantity_data.*.tag_id': 'required|string',
        'data.*.quantity_data.*.tag_number': 'required|string',
        'data.*.quantity_data.*.tag_quantity': 'required|string',
        'data.*.quantity_data.*.quantity_available': 'required|string',
        'data.*.quantity_data.*.quantity_sown': 'required|string',
        // 'data.*.total_quantity.*.seed_class_id': 'required|string',
        'data.*.total_quantity.*.quantity_sown': 'required',
      };

      let validation = new Validator(req.body, rules);

      const isValidData = validation.passes();

      if (!isValidData) {
        returnResponse = validation.errors.errors;
        return response(res, status.BAD_REQUEST, 400, returnResponse, internalCall);
      }

      const { data } = req.body;

      let errorResponse = {};

      const promisesV1 = [];
      for (const key in data) {

        const result = await this.checkQuantityData(data[key]);

        if (parseInt(result.status) !== 200) {
          errorResponse = result;
          break;
        }

        const promise = new Promise((resolve) => {
          resolve(key);
        });
        promisesV1.push(promise);
      }
      await Promise.all(promisesV1);

      if (Object.keys(errorResponse).length) {
        response(res, errorResponse.message, errorResponse.status, errorResponse.data, internalCall);
      } else {

        const date = moment().subtract(0, 'days');
        date.format('YYYY-MM-DD H:mm:ss');

        const promisesV2 = [];
        for (const key in data) {

          const bspProforma2sInsertData = {
            year: data[key].year,
            season: data[key].season,
            crop_code: data[key].crop_code,
            variety_code: data[key].variety_code,
            production_type: data[key].production_type,
            state_code: data[key].state_code,
            district_code: data[key].district_code,
            address: data[key].address,
            area_shown: data[key].area_shown,
            date_of_showing: data[key].date_of_showing,
            quantity_of_ns_shown: data[key].quantity_of_ns_shown,
            quantity_of_bs_shown: data[key].quantity_of_bs_shown,
            expected_inspection_from: data[key].expected_inspection_from,
            expected_inspection_to: data[key].expected_inspection_to,
            expected_harvest_from: data[key].expected_harvest_from,
            expected_harvest_to: data[key].expected_harvest_to,
            expected_production: data[key].expected_production,
            variety_line_code: data[key].variety_line_code ? data[key].variety_line_code : null,
            class_of_seed_sown: data[key].class_of_seed,
            qty_of_seed_sown: data[key].qty_seed_sown,
            is_active: 1,
            is_freezed: 0,
            is_inspected: false,
            user_id: data[key].user_id,
            created_at: date,
            updated_at: date,
            req_data: (data[key])
          };

          let queryCondition = {
            where: {
              year: bspProforma2sInsertData.year,
              season: bspProforma2sInsertData.season,
              crop_code: bspProforma2sInsertData.crop_code,
              variety_code: bspProforma2sInsertData.variety_code,
              user_id: bspProforma2sInsertData.user_id,
              address: bspProforma2sInsertData.address,
              is_active: 1
            }
          };


          if (bspProforma2sInsertData.variety_line_code) {
            queryCondition = {
              ...queryCondition,
              variety_line_code: bspProforma2sInsertData.variety_line_code
            }
          }

          const existingFCData = await bspPerformaBspTwo.findOne(queryCondition);

          if (existingFCData) {
            returnResponse = {
              field_code: ['Data already exists']
            };
            return response(res, status.BAD_REQUEST, 400, returnResponse, internalCall);
          }

          let bspPerformaBspTwoResponse = {};

          await bspPerformaBspTwo.create(bspProforma2sInsertData).then(function (item) {
            bspPerformaBspTwoResponse = item['_previousDataValues'];
          }).catch(function (err) {
            returnResponse = {
              error: err.message
            }
            console.log(returnResponse);
            response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
          });

          const bsp_proforma_2_id = bspPerformaBspTwoResponse && bspPerformaBspTwoResponse.id ? bspPerformaBspTwoResponse.id : (bspPerformaBspTwoResponse['dataValues'].id ? bspPerformaBspTwoResponse['dataValues'].id : null);

          let bspProforma2SeedInsertDataArray = [];
          let index = 0;

          const promisesV3 = [];
          for (const key2 in data[key].quantity_data) {

            const tagRangeArray = data[key].quantity_data[key2].tag_number.split(',');
            const tagIdArray = data[key].quantity_data[key2].tag_id.split(',');
            const tagQuantityArray = data[key].quantity_data[key2].tag_quantity.split(',');

            if ((tagRangeArray.length !== tagQuantityArray.length) || (tagQuantityArray.length !== tagIdArray.length)) {
              returnResponse = {
                tag_quantity: ['Invalid Tag Quantity Request Data']
              };
              return response(res, status.BAD_REQUEST, 400, returnResponse, internalCall);
            } else {
              const bspProforma2SeedInsertDataBasic = {
                bsp_proforma_2_id: bsp_proforma_2_id,
                lot_id: data[key].quantity_data[key2].lot_id,
                lot_number: data[key].quantity_data[key2].lot_number,
                season: data[key].quantity_data[key2].season,
                seed_class_id: data[key].quantity_data[key2].seed_class_id,
                stage_id: data[key].quantity_data[key2].stage_id,
                year: data[key].quantity_data[key2].year,
                variety_line_code: data[key].quantity_data[key2].variety_line_code ? data[key].quantity_data[key2].variety_line_code : null,
              };

              const promisesV4 = [];
              for (const key3 in tagRangeArray) {

                const tagRage = tagRangeArray[key3];
                const tagId = tagIdArray[key3];

                bspProforma2SeedInsertDataArray[index] = {
                  ...bspProforma2SeedInsertDataBasic,
                  tag_range: tagRage,
                  tag_id: tagId,
                  quantity_sown: tagRangeArray.length > 1 ? tagQuantityArray[key3] : data[key].quantity_data[key2].quantity_sown
                };

                let seedInventoryTagData = {};
                await seedInventoryTag.findOne({
                  where: {
                    id: bspProforma2SeedInsertDataBasic.lot_id,
                    lot_number: bspProforma2SeedInsertDataBasic.lot_number,
                  },
                  attributes: ['quantity_used', 'quantity_remaining']
                }).then(function (item) {
                  seedInventoryTagData = item['_previousDataValues'];
                }).catch(function (err) {
                  returnResponse = {
                    error: err.message
                  }
                  console.log(returnResponse);
                  response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
                });


                const quantity_used = seedInventoryTagData && seedInventoryTagData.quantity_used ? parseFloat(seedInventoryTagData.quantity_used) : (seedInventoryTagData && seedInventoryTagData['dataValues'] && seedInventoryTagData['dataValues'].quantity_used ? parseFloat(seedInventoryTagData['dataValues'].quantity_used) : 0);
                const quantity_remaining = seedInventoryTagData && seedInventoryTagData.quantity_remaining ? parseFloat(seedInventoryTagData.quantity_remaining) : (seedInventoryTagData && seedInventoryTagData['dataValues'] && seedInventoryTagData['dataValues'].quantity_remaining ? parseFloat(seedInventoryTagData['dataValues'].quantity_remaining) : 0);

                const updateData = {
                  quantity_used: parseFloat(bspProforma2SeedInsertDataArray[index].quantity_sown) + quantity_used,
                  // quantity_remaining: quantity_remaining - (tagRangeArray.length > 1 ? 0 : parseFloat(data[key].quantity_data[key2].quantity_available) - parseFloat(bspProforma2SeedInsertDataArray[index].quantity_sown))
                  quantity_remaining: quantity_remaining - parseFloat(bspProforma2SeedInsertDataArray[index].quantity_sown)
                };

                const updateDataTagDetail = {
                  weight_used: bspProforma2SeedInsertDataArray[index].quantity_sown,
                  weight_remaining: tagRangeArray.length > 1 ? 0 : parseFloat(data[key].quantity_data[key2].quantity_available) - parseFloat(bspProforma2SeedInsertDataArray[index].quantity_sown)
                };

                if (!updateDataTagDetail.weight_remaining) {
                  updateDataTagDetail['is_used'] = 1;
                }

                index++;
                await seedInventoryTag.update(updateData, {
                  where: {
                    id: bspProforma2SeedInsertDataBasic.lot_id,
                    lot_number: bspProforma2SeedInsertDataBasic.lot_number,
                  }
                }).then(function (item) {
                  bspPerformaBspTwoResponse = item['_previousDataValues'];
                }).catch(function (err) {
                  returnResponse = {
                    error: err.message
                  }
                  console.log(returnResponse);
                  response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
                });

                await seedInventoryTagDetail.update(updateDataTagDetail, {
                  where: {
                    id: tagId,
                    tag_number: tagRage
                  }
                }).then(function (item) {
                  bspPerformaBspTwoResponse = item['_previousDataValues'];
                }).catch(function (err) {
                  returnResponse = {
                    error: err.message
                  }
                  console.log(returnResponse);
                  response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
                });

                const promise = new Promise((resolve) => {
                  resolve(key);
                });
                promisesV4.push(promise);
              }
              await Promise.all(promisesV4);

            }
            const promise = new Promise((resolve) => {
              resolve(key);
            });
            promisesV3.push(promise);
          }

          await bspPerformaBspTwoSeed.bulkCreate(bspProforma2SeedInsertDataArray).catch(function (err) {
            returnResponse = {
              error: err.message
            }
            response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
          });

          await Promise.all(promisesV3);

          const promise = new Promise((resolve) => {
            resolve(key);
          });
          promisesV2.push(promise);
        }
        await Promise.all(promisesV2);

        response(res, status.DATA_SAVE, 200, returnResponse, internalCall);
      }
    } catch (error) {
      returnResponse = {
        error: error.message
      }
      console.log(returnResponse);
      response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }

  static getFieldCodeData = async (year, season, bspc_id, crop_code, plotNo, code = 'NA', model) => {
    let returnResponse = {};
    try {

      if (!(year && season && crop_code && bspc_id && model)) {
        return {};
      } else {
        if (!plotNo) {
          const plotData = await model.findOne({
            where: {
              user_id: bspc_id
            },
            raw: false,
            attributes: [[sequelize.literal('Max(plot_no)'), 'plot_no']]
          });

          let plot_no = 1;
          if (plotData && plotData.plot_no) {
            plot_no = (parseInt(plotData.plot_no)) + 1;
          }

          let fieldCode = [year.toString() + '-' + ((parseInt(year) + 1).toString()).substring(2), season, code, crop_code, plot_no].join('/');
          fieldCode = fieldCode.replace(/ /g, '');

          const existingFCData = await model.findOne({
            where: {
              field_code: fieldCode,
            },
            raw: false,
            attributes: ['id']
          });

          if (existingFCData) {
            this.getFieldCodeData(year, season, bspc_id, crop_code, (plot_no + 1), code, model);
          } else {
            return {
              plot_no: plot_no,
              field_code: fieldCode
            };
          }
        } else {
          let fieldCode = [year.toString() + '-' + ((parseInt(year) + 1).toString()).substring(2), season, code, crop_code, plotNo].join('/');
          fieldCode = fieldCode.replace(/ /g, '');

          const existingFCData = await model.findOne({
            where: {
              field_code: fieldCode,
            },
            raw: false,
            attributes: ['id']
          });

          if (existingFCData) {
            this.getFieldCodeData(year, season, bspc_id, crop_code, (plotNo + 1), code, model);
          } else {
            return {
              plot_no: plotNo,
              field_code: fieldCode
            };
          }
        }
      }
    } catch (error) {
      console.log(error)
      returnResponse = error.message;
      return returnResponse;
    }
  }

  static getRefNo = async (year, season, crop_code, variety_code, address, user_code) => {
    let returnResponse = "";
    try {
      if (!(year && season && crop_code && variety_code && address && user_code)) {
        return "";
      } else {
        let fieldCode = (year + season + crop_code + variety_code + address + user_code).toString().toUpperCase();
        fieldCode = fieldCode.replace(/ /g, '');
        return fieldCode;
      }
    } catch (error) {
      // returnResponse = error.message;
      return returnResponse;
    }
  }

  static getBspProforma2sList = async (req, res) => {
    let returnResponse = {};
    const { internalCall } = req.body;
    try {
      let rules = {
        'search.year': 'string',
        'search.season': 'string',
        'search.crop_code': 'string',
        'search.variety_code': 'string',
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
            }
          ],
          where: {
            is_active: '1',
          },
          raw: false,
          attributes: [
            'id', 'variety_code', [sequelize.col('m_crop_variety.variety_name'), 'variety_name'], 'state_code', [sequelize.col('m_state.state_name'), 'state_name'], 'district_code', [sequelize.col('m_district.district_name'), 'district_name'], 'address', 'area_shown', 'date_of_showing',
            'quantity_of_ns_shown', 'quantity_of_bs_shown', 'expected_inspection_from', 'expected_inspection_to', 'expected_harvest_from', 'expected_harvest_to', 'expected_production'
          ]
        };

        const sortOrder = req.body.sort ? req.body.sort : 'id';
        const sortDirection = req.body.order ? req.body.order : 'DESC';

        if (page && pageSize) {
          page = parseInt(page);
          condition.limit = parseInt(pageSize);
          condition.offset = (page * pageSize) - pageSize;
        }

        condition.order = [[sortOrder, sortDirection]];

        if (req.body.search) {
          if (req.body.search.year) {
            condition.where.year = (req.body.search.year).toString().split(',');
          }
          if (req.body.search.season) {
            condition.where.season = (req.body.search.season).toString().split(',');
          }
          if (req.body.search.crop_code) {
            condition.where.crop_code = (req.body.search.crop_code).toString().split(',');
          }
          if (req.body.search.variety_code) {
            condition.where.variety_code = (req.body.search.variety_code).toString().split(',');
          }
          if (req.body.search.user_id) {
            condition.where.user_id = (req.body.search.user_id).toString().split(',');
          }
        }

        const queryData = await bspPerformaBspTwo.findAndCountAll(condition);
        const totalRecord = queryData.count;
        const lastPage = totalRecord ? ((totalRecord % (pageSize) === 0 ? (totalRecord / (pageSize)) : (parseInt(totalRecord / (pageSize)) + 1))) : 0;

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
          returnResponse = await paginateResponseRaw(queryData.rows, page, pageSize, totalRecord, lastPage);
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

  static getBspProforma1sVarietiesLevel1 = async (req, res) => {
    let returnResponse = {};
    const { internalCall } = req.body;
    try {
      let rules = {
        'search.year': 'string',
        'search.season': 'string',
        'search.crop_code': 'string',
        'search.state_code': 'string',
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
      }
      let userId;
      if (req.body && req.body.search.user_id) {
        userId = {
          user_id: req.body.search.user_id
        }
      }
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
      let condition = {
        include: [
          {
            model: bspProformaOneBspc,
            required: true,
            attributes: []
          },
          {
            model: bspPerformaBspTwo,
            as: 'bspOneTwoVC',
            required: false,
            where: {
              is_active: 1,
              ...production_type
            },
            attributes: []
          },
          {
            model: varietyModel,
            required: true,
            attributes: []
          },
          {
            model: db.carryOverSeedModel,
            as: 'bsp2CarryOver',
            where: {
              is_freezed: 1,
              ...production_type,
              ...userId
            },
            required: false,
            attributes: []
          }
        ],
        where: {
          is_active: 1,
          ['$bspOneTwoVC.id$']: null,
          ['$m_crop_variety.status$']: 'variety',
          ['$bsp2CarryOver.meet_target$']: {
            [Op.in]: [2, 3]
          },

        },
        group: ['bsp_proforma_1s.variety_code', 'm_crop_variety.variety_name', 'bsp_proforma_1s.variety_code'],
        raw: true,
        attributes: [
          [sequelize.col('bsp_proforma_1s.variety_code'), 'variety_code'],
          [sequelize.literal('SUM(bsp_proforma_1_bspc.target_qunatity)'), 'target_quantity'],
        ]
      };

      let condition4 = {
        include: [
          {
            model: bspProformaOneBspc,
            required: true,
            attributes: []
          },
          {
            model: bspPerformaBspTwo,
            as: 'bspOneTwoVC',
            on: {
              col1: sequelize.where(sequelize.col("bspOneTwoVC.variety_line_code"), "=", sequelize.col("bsp_proforma_1s.variety_line_code")),
            },
            required: false,
            where: {
              is_active: 1,
              ...production_type
            },
            attributes: []
          },
          {
            model: varietyModel,
            required: true,
            attributes: []
          },
          {
            model: db.carryOverSeedModel,
            as: 'bsp2CarryOver',
            required: false,
            where: {
              is_freezed: 1,
              ...production_type,
              ...userId
            },
            on: {
              col1: sequelize.where(sequelize.col("bsp2CarryOver.variety_line_code"), "=", sequelize.col("bsp_proforma_1s.variety_line_code")),
            },
            attributes: []
          }
        ],
        where: {
          is_active: 1,
          ['$bsp2CarryOver.id$']: null,
          ['$m_crop_variety.status$']: 'hybrid',
          ['$bsp2CarryOver.meet_target$']: {
            [Op.in]: [2, 3]
          },
        },
        group: ['bsp_proforma_1s.variety_code', 'm_crop_variety.variety_name', 'bsp_proforma_1s.variety_code'],
        raw: true,
        attributes: [
          [sequelize.col('bsp_proforma_1s.variety_code'), 'variety_code'],
          [sequelize.literal('SUM(bsp_proforma_1_bspc.target_qunatity)'), 'target_quantity'],
        ]
      };

      let condition2 = {
        include: [
          {
            model: bspProformaOneBspc,
            required: true,
            attributes: []
          },
          // {
          //   model: bspPerformaBspTwo,
          //   as: 'bspOneTwoVC',
          //   required: false,
          //   where: {
          //     is_active: 1
          //   },
          //   attributes: []
          // },
          {
            model: varietyModel,
            required: true,
            attributes: []
          },
          {
            model: db.carryOverSeedModel,
            as: 'bsp2CarryOver',
            where: {
              is_freezed: 1,
              ...production_type,
              ...userId
            },
            required: false,
            attributes: []
          }
        ],
        where: {
          is_active: 1,
          ['$bsp2CarryOver.meet_target$']: {
            [Op.in]: [2, 3]
          },
          // ['$bspOneTwoVC.id$'] : null
        },
        group: ['bsp_proforma_1s.variety_code', 'm_crop_variety.variety_name', 'bsp_proforma_1s.variety_code'],
        raw: true,
        attributes: [
          [sequelize.col('bsp_proforma_1s.variety_code'), 'variety_code'],
          [sequelize.literal('SUM(bsp_proforma_1_bspc.target_qunatity)'), 'target_quantity'],
        ]
      };

      let condition3 = {
        include: [
          {
            model: bspPerformaBspTwo,
            as: 'directIndentVC',
            required: false,
            where: {
              is_active: 1,
              ...production_type
            },
            attributes: []
          },
          {
            model: varietyModel,
            required: true,
            attributes: []
          },
          {
            model: db.carryOverSeedModel,
            as: 'directCarryOver',
            required: false,
            where: {
              is_freezed: 1,
              ...production_type,
              ...userId
            },

            attributes: []
          }
        ],
        where: {
          is_active: 1,
          ['$directIndentVC.id$']: null,
          ['$directCarryOver.meet_target$']: {
            [Op.ne]: 1
          },
        },
        group: ['indent_of_breederseed_direct.variety_code', 'm_crop_variety.variety_name'],
        raw: true,
        attributes: [
          [sequelize.col('indent_of_breederseed_direct.variety_code'), 'variety_code'],
          [sequelize.literal('SUM(indent_of_breederseed_direct.quantity)'), 'quantity'],
        ]
      };

      let condition6 = {
        include: [
          {
            model: varietyModel,
            required: true,
            attributes: []
          }
        ],
        where: {
          is_active: 1,
        },
        group: ['indent_of_breederseed_direct.variety_code', 'm_crop_variety.variety_name'],
        raw: true,
        attributes: [
          [sequelize.col('indent_of_breederseed_direct.variety_code'), 'variety_code'],
          [sequelize.literal('SUM(indent_of_breederseed_direct.quantity)'), 'quantity'],
        ]
      };

      if (req.body.search) {
        if (req.body.search.year) {
          condition.where.year = {
            [Op.in]: req.body.search.year.toString().split(',')
          };

          condition.include[1].where.year = {
            [Op.in]: req.body.search.year.toString().split(',')
          };

          condition4.where.year = {
            [Op.in]: req.body.search.year.toString().split(',')
          };

          condition4.include[1].where.year = {
            [Op.in]: req.body.search.year.toString().split(',')
          };

          condition2.where.year = {
            [Op.in]: req.body.search.year.toString().split(',')
          };

          // condition2.include[1].where.year = {
          //   [Op.in]: req.body.search.year.toString().split(',')
          // };

          condition3.where.year = {
            [Op.in]: req.body.search.year.toString().split(',')
          };

          condition6.where.year = {
            [Op.in]: req.body.search.year.toString().split(',')
          };
        }
        if (req.body.search.season) {
          condition.where.season = {
            [Op.in]: req.body.search.season.toString().split(',')
          };

          condition.include[1].where.season = {
            [Op.in]: req.body.search.season.toString().split(',')
          };

          condition4.where.season = {
            [Op.in]: req.body.search.season.toString().split(',')
          };

          condition4.include[1].where.season = {
            [Op.in]: req.body.search.season.toString().split(',')
          };

          condition2.where.season = {
            [Op.in]: req.body.search.season.toString().split(',')
          };

          // condition2.include[1].where.season = {
          //   [Op.in]: req.body.search.season.toString().split(',')
          // };

          condition3.where.season = {
            [Op.in]: req.body.search.season.toString().split(',')
          };

          condition6.where.season = {
            [Op.in]: req.body.search.season.toString().split(',')
          };
        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = {
            [Op.in]: req.body.search.crop_code.toString().split(',')
          };

          condition.include[1].where.crop_code = {
            [Op.in]: req.body.search.crop_code.toString().split(',')
          };

          condition4.where.crop_code = {
            [Op.in]: req.body.search.crop_code.toString().split(',')
          };

          condition4.include[1].where.crop_code = {
            [Op.in]: req.body.search.crop_code.toString().split(',')
          };

          condition2.where.crop_code = {
            [Op.in]: req.body.search.crop_code.toString().split(',')
          };

          // condition2.include[1].where.crop_code = {
          //   [Op.in]: req.body.search.crop_code.toString().split(',')
          // };

          condition3.where.crop_code = {
            [Op.in]: req.body.search.crop_code.toString().split(',')
          };

          condition6.where.crop_code = {
            [Op.in]: req.body.search.crop_code.toString().split(',')
          };
        }
        if (req.body.search.variety_code) {
          condition.where.variety_code = {
            [Op.in]: req.body.search.variety_code.toString().split(',')
          };

          condition.include[1].where.variety_code = {
            [Op.in]: req.body.search.variety_code.toString().split(',')
          };

          condition4.where.variety_code = {
            [Op.in]: req.body.search.variety_code.toString().split(',')
          };

          condition4.include[1].where.variety_code = {
            [Op.in]: req.body.search.variety_code.toString().split(',')
          };

          condition2.where.variety_code = {
            [Op.in]: req.body.search.variety_code.toString().split(',')
          };
          condition2.where['$bsp2CarryOver.variety_code$'] = {
            [Op.in]: req.body.search.variety_code.toString().split(',')
          };
          condition4.where['$bsp2CarryOver.variety_code$'] = {
            [Op.in]: req.body.search.variety_code.toString().split(',')
          };

          // condition2.include[1].where.variety_code = {
          //   [Op.in]: req.body.search.variety_code.toString().split(',')
          // };

          condition3.where.variety_code = {
            [Op.in]: req.body.search.variety_code.toString().split(',')
          };

          condition6.where.variety_code = {
            [Op.in]: req.body.search.variety_code.toString().split(',')
          };
        }
        if (req.body.search.user_id) {
          condition.where['$bsp_proforma_1_bspc.bspc_id$'] = {
            [Op.in]: req.body.search.user_id.toString().split(',')
          };
          condition.include[1].where.user_id = {
            [Op.in]: req.body.search.user_id.toString().split(',')
          };

          condition4.where['$bsp_proforma_1_bspc.bspc_id$'] = {
            [Op.in]: req.body.search.user_id.toString().split(',')
          };
          condition4.include[1].where.user_id = {
            [Op.in]: req.body.search.user_id.toString().split(',')
          };

          condition2.where['$bsp_proforma_1_bspc.bspc_id$'] = {
            [Op.in]: req.body.search.user_id.toString().split(',')
          };
          // condition2.include[1].where.user_id = {
          //   [Op.in]: req.body.search.user_id.toString().split(',')
          // };

          condition3.where.user_id = {
            [Op.in]: req.body.search.user_id.toString().split(',')
          };
          condition3.include[0].where.user_id = {
            [Op.in]: req.body.search.user_id.toString().split(',')
          };

          condition6.where.user_id = {
            [Op.in]: req.body.search.user_id.toString().split(',')
          };
        }
      }

      condition.order = [[sequelize.col('variety_name'), 'asc']];
      condition4.order = [[sequelize.col('variety_name'), 'asc']];
      condition2.order = [[sequelize.col('variety_name'), 'asc']];
      condition3.order = [[sequelize.col('variety_name'), 'asc']];

      const normalVarietyList = await bspPerformaBspOne.findAll(condition);
      const hybridVarietyList = await bspPerformaBspOne.findAll(condition4);

      let bsp1VarietyList = await normalVarietyList.concat(hybridVarietyList);
      console.log(hybridVarietyList, 'hybridVarietyList', normalVarietyList)

      const nationalIndentVarietyList = await bspPerformaBspOne.findAll(condition2);

      const directIndentVarietyList = await directIndent.findAll(condition3);

      const directIndentVarietyListTotal = await directIndent.findAll(condition6);

      const nationalIndentQuantityArray = await nationalIndentVarietyList.map(x => x['target_quantity']);
      const directIndentQuantityArray = await directIndentVarietyListTotal.map(x => x['quantity']);

      const nationalIndentQuantity = await nationalIndentQuantityArray.reduce((accumulator, currentValue) => {
        return parseFloat(accumulator) + parseFloat(currentValue)
      }, 0);

      const directIndentQuantity = await directIndentQuantityArray.reduce((accumulator, currentValue) => {
        return parseFloat(accumulator) + parseFloat(currentValue)
      }, 0);

      let mergedVarietyArray = await directIndentVarietyList.concat(bsp1VarietyList);
      mergedVarietyArray = await mergedVarietyArray.map(x => x['variety_code']);
      // let varietyData = await 
      console.log(mergedVarietyArray, 'mergedVarietyArray')
      mergedVarietyArray = await mergedVarietyArray.filter((item, i, ar) => ar.indexOf(item) === i);

      const nationalIndentVarieties = await nationalIndentVarietyList.map(x => x['variety_code']);
      const directIndentVarieties = await directIndentVarietyListTotal.map(x => x['variety_code']);
      // mergedVarietyArray = await mergedVarietyArray.concat(directIndentVarieties);
      const tempArray = nationalIndentVarieties.concat(directIndentVarieties);
      console.log(directIndentVarieties, 'directIndentVarieties', nationalIndentVarieties)
      const uniqueNationalDirectVarieties = await tempArray.filter((item, i, ar) => ar.indexOf(item) === i);
      let bsp2 = await bspPerformaBspTwo.findAll({
        where: {
          crop_code: req.body.search.crop_code,
          year: req.body.search.year,
          season: req.body.search.season,
          user_id: req.body.loginedUserid.id,
        },
        attributes: [
          'variety_line_code', 'variety_code'
        ],
        raw: true
      })
      let carryOverData = await db.carryOverSeedModel.findAll({
        include: [
          {
            model: bspPerformaBspTwo,
            as: 'CarrybspOneTwoVC',
            on: {
              col1: sequelize.where(sequelize.col("CarrybspOneTwoVC.variety_line_code"), "=", sequelize.col("carry_over_seed.variety_line_code")),
            },
            required: false,
            where: {
              is_active: 1
            },
            attributes: []
          },
          {
            model: varietyModel,
            required: true,
            attributes: []
          }
        ],
        where: {
          crop_code: req.body.search.crop_code,
          year: req.body.search.year,
          season: req.body.search.season,
          user_id: req.body.loginedUserid.id,
          ...production_type,
          meet_target: {
            [Op.in]: [2, 3]
          },
          is_active: 1,

          ['$CarrybspOneTwoVC.id$']: null,
          ['$m_crop_variety.status$']: 'hybrid',
        },
        attributes: [
          'variety_line_code', 'variety_code'
        ],
        raw: true
      })
      let carryOverDataVariety = await carryOverData.map(x => x['variety_code']);
      console.log(carryOverDataVariety, 'carryOverDataVariety')

      mergedVarietyArray = mergedVarietyArray.concat(carryOverDataVariety)
      console.log(mergedVarietyArray, 'mergedVarietyArray')
      let condition5 = {
        include: [
        ],
        where: {
          variety_code: {
            [Op.in]: mergedVarietyArray
          },
          is_active: 1,
        },
        raw: true,
        attributes: [
          [sequelize.col('variety_code'), 'value'],
          [sequelize.col('variety_name'), 'display_text'],
          [sequelize.col('variety_code'), 'variety_code'],
          [sequelize.col('status'), 'variety_type'],
        ]
      };
      condition5.order = [[sequelize.col('variety_name'), 'asc']];
      const varietyList = await varietyModel.findAll(condition5);

      returnResponse = {
        totalVarieties: uniqueNationalDirectVarieties.length,
        varietyList: varietyList,
        varities_national: nationalIndentVarietyList.length,
        varities_direct: directIndentVarietyListTotal.length,
        total_quantity_national: Math.round((nationalIndentQuantity + Number.EPSILON) * 100) / 100,
        total_quantity_direct: Math.round((directIndentQuantity + Number.EPSILON) * 100) / 100,
        total_targeted_quantity: null,
      };

      returnResponse.total_targeted_quantity = Math.round(((returnResponse.total_quantity_national + returnResponse.total_quantity_direct) + Number.EPSILON) * 100) / 100

      return response(res, status.DATA_AVAILABLE, 200, returnResponse, internalCall);
    } catch (error) {
      returnResponse = {
        error: error.message
      }
      console.log(returnResponse);
      response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }

  static getBspProforma1sVarietiesLevel1Phase2 = async (req, res) => {
    let returnResponse = {};
    const { internalCall } = req.body;
    try {
      let rules = {
        'search.year': 'string',
        'search.season': 'string',
        'search.crop_code': 'string',
        'search.state_code': 'string',
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
      }
      let production_type;
      let { search } = req.body;
      if (search && search.production_type) {
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
      let condition = {
        include: [
          {
            model: bspProformaOneBspc,
            required: true,
            attributes: []
          },
          {
            model: bspPerformaBspTwo,
            as: 'bspOneTwoVC',
            required: false,
            where: {
              is_active: 1,
              // ...production_type
            },
            attributes: []
          },
          {
            model: varietyModel,
            required: true,
            attributes: []
          },
          {
            model: db.carryOverSeedModel,
            as: 'bsp2CarryOver',
            where: {
              is_freezed: 1,
              // ...production_type
            },
            required: false,
            attributes: []
          }
        ],
        where: {
          is_active: 1,
          ['$bspOneTwoVC.id$']: null,
          ['$m_crop_variety.status$']: 'variety',
          ['$bsp2CarryOver.meet_target$']: {
            [Op.in]: [2, 3]
          },

        },
        group: ['bsp_proforma_1s.variety_code', 'm_crop_variety.variety_name', 'bsp_proforma_1s.variety_code'],
        raw: true,
        attributes: [
          [sequelize.col('bsp_proforma_1s.variety_code'), 'variety_code'],
          [sequelize.literal('SUM(bsp_proforma_1_bspc.target_qunatity)'), 'target_quantity'],
        ]
      };

      let condition4 = {
        include: [
          {
            model: bspProformaOneBspc,
            required: true,
            attributes: []
          },
          {
            model: bspPerformaBspTwo,
            as: 'bspOneTwoVC',
            on: {
              col1: sequelize.where(sequelize.col("bspOneTwoVC.variety_line_code"), "=", sequelize.col("bsp_proforma_1s.variety_line_code")),
            },
            required: false,
            where: {
              is_active: 1,
              // ...production_type
            },
            attributes: []
          },
          {
            model: varietyModel,
            required: true,
            attributes: []
          },
          {
            model: db.carryOverSeedModel,
            as: 'bsp2CarryOver',
            required: false,
            where: {
              is_freezed: 1,
              // ...production_type
            },
            on: {
              col1: sequelize.where(sequelize.col("bsp2CarryOver.variety_line_code"), "=", sequelize.col("bsp_proforma_1s.variety_line_code")),
            },
            attributes: []
          }
        ],
        where: {
          is_active: 1,
          ['$bsp2CarryOver.id$']: null,
          ['$m_crop_variety.status$']: 'hybrid',
          ['$bsp2CarryOver.meet_target$']: {
            [Op.in]: [2, 3]
          },
        },
        group: ['bsp_proforma_1s.variety_code', 'm_crop_variety.variety_name', 'bsp_proforma_1s.variety_code'],
        raw: true,
        attributes: [
          [sequelize.col('bsp_proforma_1s.variety_code'), 'variety_code'],
          [sequelize.literal('SUM(bsp_proforma_1_bspc.target_qunatity)'), 'target_quantity'],
        ]
      };

      let condition2 = {
        include: [
          {
            model: bspProformaOneBspc,
            required: true,
            attributes: []
          },
          // {
          //   model: bspPerformaBspTwo,
          //   as: 'bspOneTwoVC',
          //   required: false,
          //   where: {
          //     is_active: 1
          //   },
          //   attributes: []
          // },
          {
            model: varietyModel,
            required: true,
            attributes: []
          },
          {
            model: db.carryOverSeedModel,
            as: 'bsp2CarryOver',
            where: {
              is_freezed: 1,
              // ...production_type
            },
            required: false,
            attributes: []
          }
        ],
        where: {
          is_active: 1,
          ['$bsp2CarryOver.meet_target$']: {
            [Op.in]: [2, 3]
          },
          // ['$bspOneTwoVC.id$'] : null
        },
        group: ['bsp_proforma_1s.variety_code', 'm_crop_variety.variety_name', 'bsp_proforma_1s.variety_code'],
        raw: true,
        attributes: [
          [sequelize.col('bsp_proforma_1s.variety_code'), 'variety_code'],
          [sequelize.literal('SUM(bsp_proforma_1_bspc.target_qunatity)'), 'target_quantity'],
        ]
      };

      let condition3 = {
        include: [
          {
            model: bspPerformaBspTwo,
            as: 'directIndentVC',
            required: false,
            where: {
              is_active: 1,
              // ...production_type
            },
            attributes: []
          },
          {
            model: varietyModel,
            required: true,
            attributes: []
          },
          {
            model: db.carryOverSeedModel,
            as: 'directCarryOver',
            required: false,
            where: {
              is_freezed: 1,
              // ...production_type
            },

            attributes: []
          }
        ],
        where: {
          is_active: 1,
          ['$directIndentVC.id$']: null,
          ['$directCarryOver.meet_target$']: {
            [Op.ne]: 1
          },
        },
        group: ['indent_of_breederseed_direct.variety_code', 'm_crop_variety.variety_name'],
        raw: true,
        attributes: [
          [sequelize.col('indent_of_breederseed_direct.variety_code'), 'variety_code'],
          [sequelize.literal('SUM(indent_of_breederseed_direct.quantity)'), 'quantity'],
        ]
      };

      let condition6 = {
        include: [
          {
            model: varietyModel,
            required: true,
            attributes: []
          }
        ],
        where: {
          is_active: 1,
        },
        group: ['indent_of_breederseed_direct.variety_code', 'm_crop_variety.variety_name'],
        raw: true,
        attributes: [
          [sequelize.col('indent_of_breederseed_direct.variety_code'), 'variety_code'],
          [sequelize.literal('SUM(indent_of_breederseed_direct.quantity)'), 'quantity'],
        ]
      };

      if (req.body.search) {
        if (req.body.search.year) {
          condition.where.year = {
            [Op.in]: req.body.search.year.toString().split(',')
          };

          condition.include[1].where.year = {
            [Op.in]: req.body.search.year.toString().split(',')
          };

          condition4.where.year = {
            [Op.in]: req.body.search.year.toString().split(',')
          };

          condition4.include[1].where.year = {
            [Op.in]: req.body.search.year.toString().split(',')
          };

          condition2.where.year = {
            [Op.in]: req.body.search.year.toString().split(',')
          };

          // condition2.include[1].where.year = {
          //   [Op.in]: req.body.search.year.toString().split(',')
          // };

          condition3.where.year = {
            [Op.in]: req.body.search.year.toString().split(',')
          };

          condition6.where.year = {
            [Op.in]: req.body.search.year.toString().split(',')
          };
        }
        if (req.body.search.season) {
          condition.where.season = {
            [Op.in]: req.body.search.season.toString().split(',')
          };

          condition.include[1].where.season = {
            [Op.in]: req.body.search.season.toString().split(',')
          };

          condition4.where.season = {
            [Op.in]: req.body.search.season.toString().split(',')
          };

          condition4.include[1].where.season = {
            [Op.in]: req.body.search.season.toString().split(',')
          };

          condition2.where.season = {
            [Op.in]: req.body.search.season.toString().split(',')
          };

          // condition2.include[1].where.season = {
          //   [Op.in]: req.body.search.season.toString().split(',')
          // };

          condition3.where.season = {
            [Op.in]: req.body.search.season.toString().split(',')
          };

          condition6.where.season = {
            [Op.in]: req.body.search.season.toString().split(',')
          };
        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = {
            [Op.in]: req.body.search.crop_code.toString().split(',')
          };

          condition.include[1].where.crop_code = {
            [Op.in]: req.body.search.crop_code.toString().split(',')
          };

          condition4.where.crop_code = {
            [Op.in]: req.body.search.crop_code.toString().split(',')
          };

          condition4.include[1].where.crop_code = {
            [Op.in]: req.body.search.crop_code.toString().split(',')
          };

          condition2.where.crop_code = {
            [Op.in]: req.body.search.crop_code.toString().split(',')
          };

          // condition2.include[1].where.crop_code = {
          //   [Op.in]: req.body.search.crop_code.toString().split(',')
          // };

          condition3.where.crop_code = {
            [Op.in]: req.body.search.crop_code.toString().split(',')
          };

          condition6.where.crop_code = {
            [Op.in]: req.body.search.crop_code.toString().split(',')
          };
        }
        if (req.body.search.variety_code) {
          condition.where.variety_code = {
            [Op.in]: req.body.search.variety_code.toString().split(',')
          };

          condition.include[1].where.variety_code = {
            [Op.in]: req.body.search.variety_code.toString().split(',')
          };

          condition4.where.variety_code = {
            [Op.in]: req.body.search.variety_code.toString().split(',')
          };

          condition4.include[1].where.variety_code = {
            [Op.in]: req.body.search.variety_code.toString().split(',')
          };

          condition2.where.variety_code = {
            [Op.in]: req.body.search.variety_code.toString().split(',')
          };
          condition2.where['$bsp2CarryOver.variety_code$'] = {
            [Op.in]: req.body.search.variety_code.toString().split(',')
          };
          condition4.where['$bsp2CarryOver.variety_code$'] = {
            [Op.in]: req.body.search.variety_code.toString().split(',')
          };

          // condition2.include[1].where.variety_code = {
          //   [Op.in]: req.body.search.variety_code.toString().split(',')
          // };

          condition3.where.variety_code = {
            [Op.in]: req.body.search.variety_code.toString().split(',')
          };

          condition6.where.variety_code = {
            [Op.in]: req.body.search.variety_code.toString().split(',')
          };
        }
        if (req.body.search.user_id) {
          condition.where['$bsp_proforma_1_bspc.bspc_id$'] = {
            [Op.in]: req.body.search.user_id.toString().split(',')
          };
          condition.include[1].where.user_id = {
            [Op.in]: req.body.search.user_id.toString().split(',')
          };

          condition4.where['$bsp_proforma_1_bspc.bspc_id$'] = {
            [Op.in]: req.body.search.user_id.toString().split(',')
          };
          condition4.include[1].where.user_id = {
            [Op.in]: req.body.search.user_id.toString().split(',')
          };

          condition2.where['$bsp_proforma_1_bspc.bspc_id$'] = {
            [Op.in]: req.body.search.user_id.toString().split(',')
          };
          // condition2.include[1].where.user_id = {
          //   [Op.in]: req.body.search.user_id.toString().split(',')
          // };

          condition3.where.user_id = {
            [Op.in]: req.body.search.user_id.toString().split(',')
          };
          condition3.include[0].where.user_id = {
            [Op.in]: req.body.search.user_id.toString().split(',')
          };

          condition6.where.user_id = {
            [Op.in]: req.body.search.user_id.toString().split(',')
          };
        }
      }

      condition.order = [[sequelize.col('variety_name'), 'asc']];
      condition4.order = [[sequelize.col('variety_name'), 'asc']];
      condition2.order = [[sequelize.col('variety_name'), 'asc']];
      condition3.order = [[sequelize.col('variety_name'), 'asc']];

      const normalVarietyList = await bspPerformaBspOne.findAll(condition);
      console.log('normalVarietyList===', normalVarietyList);
      const hybridVarietyList = await bspPerformaBspOne.findAll(condition4);

      let bsp1VarietyList = await normalVarietyList.concat(hybridVarietyList);
      console.log(hybridVarietyList, 'hybridVarietyList', normalVarietyList)

      const nationalIndentVarietyList = await bspPerformaBspOne.findAll(condition2);

      const directIndentVarietyList = await directIndent.findAll(condition3);

      const directIndentVarietyListTotal = await directIndent.findAll(condition6);

      const nationalIndentQuantityArray = await nationalIndentVarietyList.map(x => x['target_quantity']);
      const directIndentQuantityArray = await directIndentVarietyListTotal.map(x => x['quantity']);

      const nationalIndentQuantity = await nationalIndentQuantityArray.reduce((accumulator, currentValue) => {
        return parseFloat(accumulator) + parseFloat(currentValue)
      }, 0);

      const directIndentQuantity = await directIndentQuantityArray.reduce((accumulator, currentValue) => {
        return parseFloat(accumulator) + parseFloat(currentValue)
      }, 0);

      let mergedVarietyArray = await directIndentVarietyList.concat(bsp1VarietyList);
      mergedVarietyArray = await mergedVarietyArray.map(x => x['variety_code']);
      // let varietyData = await 
      console.log(mergedVarietyArray, 'mergedVarietyArray')
      mergedVarietyArray = await mergedVarietyArray.filter((item, i, ar) => ar.indexOf(item) === i);

      const nationalIndentVarieties = await nationalIndentVarietyList.map(x => x['variety_code']);
      const directIndentVarieties = await directIndentVarietyListTotal.map(x => x['variety_code']);
      // mergedVarietyArray = await mergedVarietyArray.concat(directIndentVarieties);
      const tempArray = nationalIndentVarieties.concat(directIndentVarieties);
      console.log(directIndentVarieties, 'directIndentVarieties', nationalIndentVarieties)
      const uniqueNationalDirectVarieties = await tempArray.filter((item, i, ar) => ar.indexOf(item) === i);
      let bsp2 = await bspPerformaBspTwo.findAll({
        where: {
          crop_code: req.body.search.crop_code,
          year: req.body.search.year,
          season: req.body.search.season,
          user_id: req.body.loginedUserid.id,
        },
        attributes: [
          'variety_line_code', 'variety_code'
        ],
        raw: true
      })
      let carryOverData = await db.carryOverSeedModel.findAll({
        include: [
          {
            model: bspPerformaBspTwo,
            as: 'CarrybspOneTwoVC',
            on: {
              col1: sequelize.where(sequelize.col("CarrybspOneTwoVC.variety_line_code"), "=", sequelize.col("carry_over_seed.variety_line_code")),
            },
            required: false,
            where: {
              is_active: 1
            },
            attributes: []
          },
          {
            model: varietyModel,
            required: true,
            attributes: []
          }
        ],
        where: {
          crop_code: req.body.search.crop_code,
          year: req.body.search.year,
          season: req.body.search.season,
          user_id: req.body.loginedUserid.id,
          // ...production_type,
          meet_target: {
            [Op.in]: [2, 3]
          },
          is_active: 1,

          ['$CarrybspOneTwoVC.id$']: null,
          ['$m_crop_variety.status$']: 'hybrid',
        },
        attributes: [
          'variety_line_code', 'variety_code'
        ],
        raw: true
      })
      let carryOverDataVariety = await carryOverData.map(x => x['variety_code']);
      console.log(carryOverDataVariety, 'carryOverDataVariety')

      mergedVarietyArray = mergedVarietyArray.concat(carryOverDataVariety)
      console.log(mergedVarietyArray, 'mergedVarietyArray')
      let condition5 = {
        include: [
        ],
        where: {
          variety_code: {
            [Op.in]: mergedVarietyArray
          },
          is_active: 1,
        },
        raw: true,
        attributes: [
          [sequelize.col('variety_code'), 'value'],
          [sequelize.col('variety_name'), 'display_text'],
          [sequelize.col('variety_code'), 'variety_code'],
          [sequelize.col('status'), 'variety_type'],
        ]
      };
      condition5.order = [[sequelize.col('variety_name'), 'asc']];
      const varietyList = await varietyModel.findAll(condition5);

      returnResponse = {
        totalVarieties: uniqueNationalDirectVarieties.length,
        varietyList: varietyList,
        varities_national: nationalIndentVarietyList.length,
        varities_direct: directIndentVarietyListTotal.length,
        total_quantity_national: Math.round((nationalIndentQuantity + Number.EPSILON) * 100) / 100,
        total_quantity_direct: Math.round((directIndentQuantity + Number.EPSILON) * 100) / 100,
        total_targeted_quantity: null,
      };

      returnResponse.total_targeted_quantity = Math.round(((returnResponse.total_quantity_national + returnResponse.total_quantity_direct) + Number.EPSILON) * 100) / 100

      return response(res, status.DATA_AVAILABLE, 200, returnResponse, internalCall);
    } catch (error) {
      returnResponse = {
        error: error.message
      }
      console.log(returnResponse);
      response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }

  static getBspProforma1sVarietiesLevel2 = async (req, res) => {
    let returnResponse = {};
    const { internalCall } = req.body;
    try {
      let rules = {
        'search.year': 'string',
        'search.season': 'string',
        'search.crop_code': 'string',
        'search.state_code': 'string',
        'search.user_id': 'string',
        'search.exclude_bsp2_id': 'string',
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

      let condition = {
        include: [
          {
            model: bspProformaOneBspc,
            required: true,
            attributes: [],
            where: {
              ...production_type
            }
          },
          {
            model: bspPerformaBspTwo,
            as: 'bspOneTwoVC',
            required: false,
            where: {
              is_active: 1
            },
            attributes: []
          },
          {
            model: varietyModel,
            required: true,
            attributes: []
          }
        ],
        where: {
          is_active: 1,
          // ['$bspOneTwoVC.id$']: null
        },
        group: ['bsp_proforma_1s.variety_code', 'm_crop_variety.variety_name', 'bsp_proforma_1s.variety_code'],
        raw: true,
        attributes: [
          [sequelize.col('bsp_proforma_1s.variety_code'), 'variety_code'],
          [sequelize.literal('SUM(bsp_proforma_1_bspc.target_qunatity)'), 'target_quantity'],
          [sequelize.literal("string_agg( DISTINCT(bsp_proforma_1_bspc.id::varchar), ',' )"), 'bsp_proforma_1_bspc_ids'],
        ]
      };
      let condition2 = {
        include: [
          {
            model: bspProformaOneBspc,
            required: true,
            attributes: [],
            ...production_type
          },
          {
            model: bspPerformaBspTwo,
            as: 'bspOneTwoVC',
            required: false,
            where: {
              is_active: 1
            },
            attributes: []
          },
          {
            model: varietyModel,
            required: true,
            attributes: [],
          }
        ],
        where: {
          is_active: 1,
          // ['$bspOneTwoVC.id$'] : null
        },
        group: ['bsp_proforma_1s.variety_code', 'm_crop_variety.variety_name', 'bsp_proforma_1s.variety_code'],
        raw: true,
        attributes: [
          [sequelize.col('bsp_proforma_1s.variety_code'), 'variety_code'],
          [sequelize.literal('SUM(bsp_proforma_1_bspc.target_qunatity)'), 'target_quantity'],
          [sequelize.literal("string_agg( DISTINCT(bsp_proforma_1_bspc.id::varchar), ',' )"), 'bsp_proforma_1_bspc_ids'],
        ]
      };
      let condition3 = {
        include: [
          {
            model: bspPerformaBspTwo,
            as: 'directIndentVC',
            required: false,
            where: {
              is_active: 1
            },
            attributes: []
          },
          {
            model: varietyModel,
            required: true,
            attributes: []
          },
          {
            model: indentOfBrseedDirectLineModel,
            required: false,
            attributes: [],
            where: {
            }
          }
        ],
        where: {
          is_active: 1,
          ['$directIndentVC.id$']: null
        },
        group: ['indent_of_breederseed_direct.id', 'indent_of_breederseed_direct.variety_code', 'm_crop_variety.variety_name'],
        raw: true,
        attributes: [
          [sequelize.col('indent_of_breederseed_direct.variety_code'), 'variety_code'],
          [sequelize.literal('SUM(indent_of_breederseed_direct.quantity)'), 'quantity'],
          [sequelize.literal("string_agg( DISTINCT(indent_of_breederseed_direct.id::varchar), ',' )"), 'indent_of_breederseed_direct_ids'],
        ]
      };
      let condition4 = {
        attributes: ['total_qty', 'meet_target'],
        where: {
          variety_code: {
            [Op.in]: req.body.search.variety_code.toString().split(',')
          },
          meet_target: {
            [Op.ne]: 1
          }

        },
        raw: true
      }
      if (req.body.search) {
        if (req.body.search.year) {
          condition.where.year = {
            [Op.in]: req.body.search.year.toString().split(',')
          };
          condition.include[1].where.year = {
            [Op.in]: req.body.search.year.toString().split(',')
          };
          condition2.where.year = {
            [Op.in]: req.body.search.year.toString().split(',')
          };
          condition2.include[1].where.year = {
            [Op.in]: req.body.search.year.toString().split(',')
          };
          condition3.where.year = {
            [Op.in]: req.body.search.year.toString().split(',')
          };
        }
        if (req.body.search.season) {
          condition.where.season = {
            [Op.in]: req.body.search.season.toString().split(',')
          };
          condition.include[1].where.season = {
            [Op.in]: req.body.search.season.toString().split(',')
          };
          condition2.where.season = {
            [Op.in]: req.body.search.season.toString().split(',')
          };
          condition2.include[1].where.season = {
            [Op.in]: req.body.search.season.toString().split(',')
          };
          condition3.where.season = {
            [Op.in]: req.body.search.season.toString().split(',')
          };
        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = {
            [Op.in]: req.body.search.crop_code.toString().split(',')
          };
          condition.include[1].where.crop_code = {
            [Op.in]: req.body.search.crop_code.toString().split(',')
          };
          condition2.where.crop_code = {
            [Op.in]: req.body.search.crop_code.toString().split(',')
          };
          condition2.include[1].where.crop_code = {
            [Op.in]: req.body.search.crop_code.toString().split(',')
          };
          condition3.where.crop_code = {
            [Op.in]: req.body.search.crop_code.toString().split(',')
          };
        }
        if (req.body.search.variety_code) {
          condition.where.variety_code = {
            [Op.in]: req.body.search.variety_code.toString().split(',')
          };
          condition.include[1].where.variety_code = {
            [Op.in]: req.body.search.variety_code.toString().split(',')
          };
          condition2.where.variety_code = {
            [Op.in]: req.body.search.variety_code.toString().split(',')
          };
          condition2.include[1].where.variety_code = {
            [Op.in]: req.body.search.variety_code.toString().split(',')
          };
          condition3.where.variety_code = {
            [Op.in]: req.body.search.variety_code.toString().split(',')
          };
          console.log(req.body.search.variety_code)
          // condition4.where.variety_code = {
          //   [Op.in]: req.body.search.variety_code.toString().split(',')
          // };
        }
        if (req.body.search.variety_line_code) {
          condition.where.variety_line_code = {
            [Op.in]: req.body.search.variety_line_code.toString().split(',')
          };
          condition.include[1].where.variety_line_code = {
            [Op.in]: req.body.search.variety_line_code.toString().split(',')
          };
          condition2.where.variety_line_code = {
            [Op.in]: req.body.search.variety_line_code.toString().split(',')
          };
          condition2.include[1].where.variety_line_code = {
            [Op.in]: req.body.search.variety_line_code.toString().split(',')
          };
          condition3.include[2].where.variety_code_line = {
            [Op.in]: req.body.search.variety_line_code.toString().split(',')
          };
          condition4.where.variety_line_code = {
            [Op.in]: req.body.search.variety_line_code.toString().split(',')
          };
          condition3.include[2].required = true;
          condition3.attributes = [
            [sequelize.col('indent_of_breederseed_direct.variety_code'), 'variety_code'],
            [sequelize.literal('SUM(indent_of_brseed_direct_line.quantity)'), 'quantity'],
            [sequelize.literal("string_agg( DISTINCT(indent_of_brseed_direct_line.id::varchar), ',' )"), 'indent_of_brseed_direct_line_ids'],
          ];
        }
        if (req.body.search.user_id) {
          condition.where['$bsp_proforma_1_bspc.bspc_id$'] = {
            [Op.in]: req.body.search.user_id.toString().split(',')
          };
          condition.include[1].where.user_id = {
            [Op.in]: req.body.search.user_id.toString().split(',')
          };
          condition2.where['$bsp_proforma_1_bspc.bspc_id$'] = {
            [Op.in]: req.body.search.user_id.toString().split(',')
          };
          condition2.include[1].where.user_id = {
            [Op.in]: req.body.search.user_id.toString().split(',')
          };
          condition3.where.user_id = {
            [Op.in]: req.body.search.user_id.toString().split(',')
          };
          condition3.include[0].where.user_id = {
            [Op.in]: req.body.search.user_id.toString().split(',')
          };
          condition4.where.user_id = {
            [Op.in]: req.body.search.user_id.toString().split(',')
          };
        }
        // if (req.body.search.exclude_bsp2_id) {
        //   condition.where['$bspOneTwoVC.id$'] = {
        //     [Op.in]: req.body.search.exclude_bsp2_id.toString().split(',').concat([null])
        //   };
        //   condition3.where['$directIndentVC.id$'] = {
        //     [Op.in]: req.body.search.exclude_bsp2_id.toString().split(',').concat([null])
        //   };
        // }
      }
      condition.order = [[sequelize.col('variety_name'), 'asc']];
      condition2.order = [[sequelize.col('variety_name'), 'asc']];
      condition3.order = [[sequelize.col('variety_name'), 'asc']];
      const nationalIndentVarietyList = await bspPerformaBspOne.findAll(condition);
      const carryOverSeedData = await db.carryOverSeedModel.findAll(condition4)
      const nationalTempArray = await nationalIndentVarietyList.map(x => x['bsp_proforma_1_bspc_ids']);
      const resultStringNational = await this.mergeArraysToString(nationalTempArray);
      let nationalData = null;
      console.log(resultStringNational, 'resultStringNational')
      if (resultStringNational) {
        nationalData = await db.sequelize.query(
          "select sum(target_qunatity) as sum from bsp_proforma_1_bspcs where id in (" + resultStringNational + ");",
          {
            type: QueryTypes.SELECT
          }
        );
      } else {
        nationalData = [{ sum: 0 }]
      }


      delete condition3.where['$directIndentVC.id$'];

      const directIndentVarietyList = await directIndent.findAll(condition3);
      let directData = null;

      if (req.body.search.variety_line_code) {
        const directTempArray = await directIndentVarietyList.map(x => x['indent_of_brseed_direct_line_ids']);
        const resultStringDirect = await this.mergeArraysToString(directTempArray);
        if (resultStringDirect) {
          directData = await db.sequelize.query(
            "select sum(quantity) as sum from indent_of_brseed_direct_line where id in (" + resultStringDirect + ");",
            {
              type: QueryTypes.SELECT
            }
          );
        } else {
          directData = [{ sum: 0 }]
        }
      } else {
        const directTempArray = await directIndentVarietyList.map(x => x['indent_of_breederseed_direct_ids']);
        const resultStringDirect = await this.mergeArraysToString(directTempArray);
        if (resultStringDirect) {
          directData = await db.sequelize.query(
            "select sum(quantity) as sum from indent_of_breederseed_direct where id in (" + resultStringDirect + ");",
            {
              type: QueryTypes.SELECT
            }
          );
        }
        else {
          directData = [{ sum: 0 }]
        }
      }
      let directSum = 0;
      const nationalIndentQuantity = nationalData && nationalData.length && nationalData[0].sum ? parseFloat(nationalData[0].sum) : 0;
      if (production_type && production_type.production_type == "NORMAL") {
        directSum = directData && directData.length && directData[0].sum ? parseFloat(directData[0].sum) : 0;
      } else {
        directSum = 0
      }
      const directIndentQuantity = directSum;
      returnResponse = {
        total_quantity_national: Math.round((nationalIndentQuantity + Number.EPSILON) * 100) / 100,
        total_quantity_direct: Math.round((directIndentQuantity + Number.EPSILON) * 100) / 100,
        quantity_targeted: null,
        carryOverSeedData: carryOverSeedData
      };
      returnResponse.quantity_targeted = Math.round(((nationalIndentQuantity + directIndentQuantity) + Number.EPSILON) * 100) / 100;
      return response(res, status.DATA_AVAILABLE, 200, returnResponse, internalCall);
    } catch (error) {
      returnResponse = {
        error: error.message
      }
      console.log(error, 'error');
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


  static getBspProforma1sVarietiesLevel2second = async (req, res) => {
    let returnResponse = {};
    const { internalCall } = req.body;
    try {
      let rules = {
        'search.year': 'string',
        'search.season': 'string',
        'search.crop_code': 'string',
        'search.state_code': 'string',
        'search.user_id': 'string',
        'search.exclude_bsp2_id': 'string',
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
        include: [
          {
            model: bspProformaOneBspc,
            required: true,
            attributes: []
          },
          {
            model: bspPerformaBspTwo,
            as: 'bspOneTwoVC',
            required: false,
            where: {
              is_active: 1
            },
            attributes: []
          },
          {
            model: varietyModel,
            required: true,
            attributes: []
          }
        ],
        where: {
          is_active: 1,
          ['$bspOneTwoVC.id$']: null
        },
        group: ['bsp_proforma_1s.variety_code', 'm_crop_variety.variety_name', 'bsp_proforma_1s.variety_code'],
        raw: true,
        attributes: [
          [sequelize.col('bsp_proforma_1s.variety_code'), 'variety_code'],
          [sequelize.literal('SUM(bsp_proforma_1_bspc.target_qunatity)'), 'target_quantity'],
        ]
      };

      let condition2 = {
        include: [
          {
            model: bspProformaOneBspc,
            required: true,
            attributes: []
          },
          {
            model: bspPerformaBspTwo,
            as: 'bspOneTwoVC',
            required: false,
            where: {
              is_active: 1
            },
            attributes: []
          },
          {
            model: varietyModel,
            required: true,
            attributes: [],
          }
        ],
        where: {
          is_active: 1,
          // ['$bspOneTwoVC.id$'] : null
        },
        group: ['bsp_proforma_1s.variety_code', 'm_crop_variety.variety_name', 'bsp_proforma_1s.variety_code'],
        raw: true,
        attributes: [
          [sequelize.col('bsp_proforma_1s.variety_code'), 'variety_code'],
          [sequelize.literal('SUM(bsp_proforma_1_bspc.target_qunatity)'), 'target_quantity'],
        ]
      };

      let condition3 = {
        include: [
          {
            model: bspPerformaBspTwo,
            as: 'directIndentVC',
            required: false,
            where: {
              is_active: 1
            },
            attributes: []
          },
          {
            model: varietyModel,
            required: true,
            attributes: []
          },
          {
            model: indentOfBrseedDirectLineModel,
            required: false,
            attributes: [],
            where: {
            }
          }
        ],
        where: {
          is_active: 1,
          ['$directIndentVC.id$']: null
        },
        group: ['indent_of_breederseed_direct.variety_code', 'm_crop_variety.variety_name'],
        raw: true,
        attributes: [
          [sequelize.col('indent_of_breederseed_direct.variety_code'), 'variety_code'],
          [sequelize.literal('SUM(indent_of_breederseed_direct.quantity)'), 'quantity'],

        ]
      };

      if (req.body.search) {
        if (req.body.search.year) {
          condition.where.year = {
            [Op.in]: req.body.search.year.toString().split(',')
          };

          condition.include[1].where.year = {
            [Op.in]: req.body.search.year.toString().split(',')
          };

          condition2.where.year = {
            [Op.in]: req.body.search.year.toString().split(',')
          };

          condition2.include[1].where.year = {
            [Op.in]: req.body.search.year.toString().split(',')
          };

          condition3.where.year = {
            [Op.in]: req.body.search.year.toString().split(',')
          };
        }
        if (req.body.search.season) {
          condition.where.season = {
            [Op.in]: req.body.search.season.toString().split(',')
          };

          condition.include[1].where.season = {
            [Op.in]: req.body.search.season.toString().split(',')
          };

          condition2.where.season = {
            [Op.in]: req.body.search.season.toString().split(',')
          };

          condition2.include[1].where.season = {
            [Op.in]: req.body.search.season.toString().split(',')
          };

          condition3.where.season = {
            [Op.in]: req.body.search.season.toString().split(',')
          };
        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = {
            [Op.in]: req.body.search.crop_code.toString().split(',')
          };

          condition.include[1].where.crop_code = {
            [Op.in]: req.body.search.crop_code.toString().split(',')
          };

          condition2.where.crop_code = {
            [Op.in]: req.body.search.crop_code.toString().split(',')
          };

          condition2.include[1].where.crop_code = {
            [Op.in]: req.body.search.crop_code.toString().split(',')
          };

          condition3.where.crop_code = {
            [Op.in]: req.body.search.crop_code.toString().split(',')
          };
        }
        if (req.body.search.variety_code) {
          condition.where.variety_code = {
            [Op.in]: req.body.search.variety_code.toString().split(',')
          };

          condition.include[1].where.variety_code = {
            [Op.in]: req.body.search.variety_code.toString().split(',')
          };

          condition2.where.variety_code = {
            [Op.in]: req.body.search.variety_code.toString().split(',')
          };

          condition2.include[1].where.variety_code = {
            [Op.in]: req.body.search.variety_code.toString().split(',')
          };

          condition3.where.variety_code = {
            [Op.in]: req.body.search.variety_code.toString().split(',')
          };
        }
        if (req.body.search.variety_line_code) {
          condition.where.variety_line_code = {
            [Op.in]: req.body.search.variety_line_code.toString().split(',')
          };

          condition.include[1].where.variety_line_code = {
            [Op.in]: req.body.search.variety_line_code.toString().split(',')
          };

          condition2.where.variety_line_code = {
            [Op.in]: req.body.search.variety_line_code.toString().split(',')
          };

          condition2.include[1].where.variety_line_code = {
            [Op.in]: req.body.search.variety_line_code.toString().split(',')
          };

          condition3.include[2].where.variety_code_line = {
            [Op.in]: req.body.search.variety_line_code.toString().split(',')
          };
          condition3.include[2].required = true;
          condition3.attributes = [
            [sequelize.col('indent_of_breederseed_direct.variety_code'), 'variety_code'],
            [sequelize.literal('SUM(indent_of_brseed_direct_line.quantity)'), 'quantity'],
          ];
        }
        if (req.body.search.user_id) {
          condition.where['$bsp_proforma_1_bspc.bspc_id$'] = {
            [Op.in]: req.body.search.user_id.toString().split(',')
          };
          condition.include[1].where.user_id = {
            [Op.in]: req.body.search.user_id.toString().split(',')
          };

          condition2.where['$bsp_proforma_1_bspc.bspc_id$'] = {
            [Op.in]: req.body.search.user_id.toString().split(',')
          };
          condition2.include[1].where.user_id = {
            [Op.in]: req.body.search.user_id.toString().split(',')
          };

          condition3.where.user_id = {
            [Op.in]: req.body.search.user_id.toString().split(',')
          };
          condition3.include[0].where.user_id = {
            [Op.in]: req.body.search.user_id.toString().split(',')
          };
        }
        if (req.body.search.exclude_bsp2_id) {
          condition.where['$bspOneTwoVC.id$'] = {
            [Op.in]: req.body.search.exclude_bsp2_id.toString().split(',').concat([null])
          };
          condition3.where['$directIndentVC.id$'] = {
            [Op.in]: req.body.search.exclude_bsp2_id.toString().split(',').concat([null])
          };

        }
      }

      condition.order = [[sequelize.col('variety_name'), 'asc']];
      condition2.order = [[sequelize.col('variety_name'), 'asc']];
      condition3.order = [[sequelize.col('variety_name'), 'asc']];
      const bsp1VarietyList = await bspPerformaBspOne.findAll(condition);

      // const nationalIndentVarietyList = await bspPerformaBspOne.findAll(condition2);
      const nationalIndentVarietyList = bsp1VarietyList;
      const directIndentVarietyList = await directIndent.findAll(condition3);

      delete condition3.where['$directIndentVC.id$'];
      const directIndentVarietyListTotal = await directIndent.findAll(condition3);

      const bsp1QuantityArray = await bsp1VarietyList.map(x => x['target_quantity']);
      const nationalIndentQuantityArray = await nationalIndentVarietyList.map(x => x['target_quantity']);
      const directIndentQuantityArray = await directIndentVarietyListTotal.map(x => x['quantity']);

      const bsp1Quantity = await bsp1QuantityArray.reduce((accumulator, currentValue) => {
        return parseFloat(accumulator) + parseFloat(currentValue)
      }, 0);

      const nationalIndentQuantity = await nationalIndentQuantityArray.reduce((accumulator, currentValue) => {
        return parseFloat(accumulator) + parseFloat(currentValue)
      }, 0);

      const directIndentQuantity = await directIndentQuantityArray.reduce((accumulator, currentValue) => {
        return parseFloat(accumulator) + parseFloat(currentValue)
      }, 0);

      returnResponse = {
        total_quantity_national: Math.round((nationalIndentQuantity + Number.EPSILON) * 100) / 100,
        total_quantity_direct: Math.round((directIndentQuantity + Number.EPSILON) * 100) / 100,
        quantity_targeted: null,
      };

      returnResponse.quantity_targeted = Math.round(((nationalIndentQuantity + directIndentQuantity) + Number.EPSILON) * 100) / 100;

      return response(res, status.DATA_AVAILABLE, 200, returnResponse, internalCall);
    } catch (error) {
      returnResponse = {
        error: error.message
      }
      console.log(returnResponse);
      response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }

  static finaliseBspProforma2sData = async (req, res) => {
    let returnResponse = {};
    const { internalCall, referenceNumber } = req.body;
    try {
      let rules = {
        'bspc_2_ids': 'required|string',
        'user_id': 'required|integer',
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
              model: db.userModel,
              attributes: ['code']
            }
          ],
          where: {
            is_active: 1,
            is_freezed: 0,
          },
          raw: false,
          attributes: ['id', 'year', 'season', 'user_id', 'crop_code', 'variety_code', 'variety_line_code']
        };

        if (req.body) {
          if (req.body.bspc_2_ids) {
            condition.where.id = (req.body.bspc_2_ids).toString().split(',');
          }
          if (req.body.user_id) {
            condition.where.user_id = (req.body.user_id);
          }
        }

        const records = await bspPerformaBspTwo.findAll(condition);

        if (records && Object.keys(records).length) {

          const promises = [];
          for (const key in records) {
            const id = records[key]['dataValues'].id;
            const year = records[key]['dataValues'].year;
            const season = records[key]['dataValues'].season;
            const user_id = records[key]['dataValues'].user_id
            const crop_code = records[key]['dataValues'].crop_code;
            const variety_code = records[key]['dataValues'].variety_code;
            const variety_line_code = records[key]['dataValues'].variety_line_code;
            const code = records && records[key] && records[key].user && records[key].user["dataValues"] && records[key].user['dataValues'].code ? records[key].user['dataValues'].code : 'NA'
            const updateData = {
              is_freezed: 1,
              field_code: null,
              plot_no: null,
              ref_no: id,
              ref_number: referenceNumber ? referenceNumber : null
            };


            const fieldCodeData = await this.getFieldCodeData(year, season, user_id, crop_code, null, code, bspPerformaBspTwo)

            if (!(fieldCodeData && Object.keys(fieldCodeData).length)) {
              returnResponse = {
                field_code: ['Invalid field code']
              };
              return response(res, status.BAD_REQUEST, 400, returnResponse, internalCall);
            }
            console.log(fieldCodeData, 'fieldCodeData')
            updateData.field_code = fieldCodeData.field_code;
            updateData.plot_no = fieldCodeData.plot_no;

            let bspPerformaBspTwoResponse = {};
            await bspPerformaBspTwo.update(updateData, {
              where: {
                id: id,
                user_id: req.body.user_id,
                is_active: 1,
                is_freezed: 0,
              }
            }).then(function (item) {
              bspPerformaBspTwoResponse = item['_previousDataValues'];
            }).catch(function (err) {
              returnResponse = {
                error: err.message
              }
              console.log(returnResponse);
              response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
            });

            const dataSet = {
              year: year,
              crop_code: crop_code,
              variety_code: variety_code,
              season: season,
              bsp_proforma_2_id: id,
              variety_line_code: variety_line_code,
              status: 'Pending',
              is_freezed: 0,
            };

            // delete existing, if any in bspPerformaBspThree
            await bspPerformaBspThree.destroy({
              where: {
                bsp_proforma_2_id: id,
              }
            }).then(function (item) { }).catch(function (err) {
              returnResponse = {
                error: err.message
              }
              console.log(returnResponse);
              response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
            });

            let bspPerformaBspThreeResponse = {};
            // create record in bspPerformaBspThree
            await bspPerformaBspThree.create(dataSet).then(function (item) {
              bspPerformaBspThreeResponse = item['_previousDataValues'];
            }).catch(function (err) {
              returnResponse = {
                error: err.message
              }
              console.log(returnResponse);
              response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
            });

            await bspPerformaBspThree.update({
              ref_no: bspPerformaBspThreeResponse.id
            }, {
              where: {
                id: bspPerformaBspThreeResponse.id
              }
            }).then(function (item) {
            }).catch(function (err) {
              returnResponse = {
                error: err.message
              }
              console.log(returnResponse);
              response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
            });



            const promise = new Promise((resolve) => {
              resolve(key);
            });
            promises.push(promise);
          }
          await Promise.all(promises);

          response(res, status.DATA_UPDATED, 200, returnResponse, internalCall);
        } else {
          response(res, status.DATA_NOT_AVAILABLE, 400, returnResponse, internalCall);
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

  static deleteBspProforma2sData = async (req, res) => {
    let returnResponse = {};
    const { internalCall } = req.body;
    try {
      let rules = {
        'bspc_2_id': 'required|integer',
        'user_id': 'required|integer',
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
          where: {
            is_active: 1,
            is_freezed: 0
          },
          raw: true,
          attributes: ['id']
        };

        if (req.body) {
          if (req.body.bspc_2_id) {
            condition.where.id = (req.body.bspc_2_id);
          }
          if (req.body.user_id) {
            condition.where.user_id = (req.body.user_id);
          }
        }

        const bspc2sData = await bspPerformaBspTwo.findOne(condition);

        if (bspc2sData && Object.keys(bspc2sData).length) {
          const bspc2sId = parseInt(req.body.bspc_2_id);

          const bspPerformaBspTwoSeedData = await bspPerformaBspTwoSeed.findAll({
            where: {
              bsp_proforma_2_id: bspc2sId,
            },
            attributes: ['id', 'lot_id', 'tag_id', 'lot_number', 'tag_range', 'quantity_sown']
          });

          if (bspPerformaBspTwoSeedData && Object.keys(bspPerformaBspTwoSeedData).length) {
            const bspPerformaBspTwoSeedIds = [];
            const promises = [];
            for (const key in bspPerformaBspTwoSeedData) {

              const bspPerformaBspTwoSeedId = bspPerformaBspTwoSeedData[key]['dataValues'].id;
              const lot_number = bspPerformaBspTwoSeedData[key]['dataValues'].lot_number;
              const lot_id = bspPerformaBspTwoSeedData[key]['dataValues'].lot_id;
              const tag_number = bspPerformaBspTwoSeedData[key]['dataValues'].tag_range;
              const tag_id = bspPerformaBspTwoSeedData[key]['dataValues'].tag_id;
              const quantity_sown = bspPerformaBspTwoSeedData[key]['dataValues'].quantity_sown;

              bspPerformaBspTwoSeedIds[bspPerformaBspTwoSeedIds.length] = bspPerformaBspTwoSeedId

              const tagData = await seedInventoryTagDetail.findOne({
                where: {
                  id: tag_id,
                  tag_number: tag_number,
                },
                attributes: ['id', 'weight', 'weight_used', 'weight_remaining']
              });
              const lotData = await seedInventoryTag.findOne({
                where: {
                  id: lot_id,
                  lot_number: lot_number
                },
                attributes: ['id', 'quantity', 'quantity_used', 'quantity_remaining']
              });

              if (tagData && lotData) {
                const tagId = tagData && tagData.id ? parseInt(tagData.id) : null;
                const weight = tagData && tagData.weight ? parseFloat(tagData.weight) : 0;
                const weight_used = tagData && tagData.weight_used ? parseFloat(tagData.weight_used) : 0;
                const weight_remaining = tagData && tagData.weight_remaining ? parseFloat(tagData.weight_remaining) : 0;

                const lotId = lotData && lotData.id ? parseInt(lotData.id) : null;
                const quantity = lotData && lotData.quantity ? parseFloat(lotData.quantity) : 0;
                const quantity_used = lotData && lotData.quantity_used ? parseFloat(lotData.quantity_used) : 0;
                const quantity_remaining = lotData && lotData.quantity_remaining ? parseFloat(lotData.quantity_remaining) : 0;

                const tagUpdateData = {
                  weight_used: parseFloat(weight_used) - parseFloat(quantity_sown),
                  weight_remaining: parseFloat(weight_remaining) + parseFloat(quantity_sown),
                };

                if (tagUpdateData.weight_remaining) {
                  tagUpdateData['is_used'] = 0
                }

                const lotUpdateData = {
                  quantity_used: parseFloat(quantity_used) - parseFloat(quantity_sown),
                  quantity_remaining: parseFloat(quantity_remaining) + parseFloat(quantity_sown),
                };

                await seedInventoryTagDetail.update(tagUpdateData, {
                  where: {
                    id: tagId,
                  }
                }).then(function (item) {
                }).catch(function (err) {
                  returnResponse = {
                    error: err.message
                  }
                  console.log(returnResponse);
                  response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
                });

                await seedInventoryTag.update(lotUpdateData, {
                  where: {
                    id: lotId,
                  }
                }).then(function (item) {
                }).catch(function (err) {
                  returnResponse = {
                    error: err.message
                  }
                  console.log(returnResponse);
                  response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
                });
              }
              const promise = new Promise((resolve) => {
                resolve(key);
              });
              promises.push(promise);
            }
            await Promise.all(promises);

            await bspPerformaBspTwoSeed.destroy({
              where: {
                id: {
                  [Op.in]: bspPerformaBspTwoSeedIds
                }
              }
            }).then(function (item) {
            }).catch(function (err) {
              returnResponse = {
                error: err.message
              }
              console.log(returnResponse);
              response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
            });

            await bspPerformaBspTwo.destroy({
              where: {
                id: bspc2sId,
                is_active: 1
              }
            }).then(function (item) {
            }).catch(function (err) {
              returnResponse = {
                error: err.message
              }
              console.log(returnResponse);
              response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
            });

            response(res, status.DATA_DELETED, 200, returnResponse, internalCall);
          } else {
            response(res, status.DATA_NOT_AVAILABLE, 400, bspc2sData, internalCall);
          }
        } else {
          response(res, status.DATA_NOT_AVAILABLE, 400, returnResponse, internalCall);
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

  static getBspProforma2sEditData = async (req, res) => {
    let returnResponse = {};
    const { internalCall } = req.body;
    try {
      let rules = {
        'bspc_2_id': 'required|integer',
        'user_id': 'required|integer',
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
          where: {
            is_active: 1,
            is_freezed: 0
          },
          raw: true,
          attributes: ['id', 'season', 'year', 'crop_code', 'variety_code', 'req_data', 'variety_line_code']
        };

        if (req.body) {
          if (req.body.bspc_2_id) {
            condition.where.id = (req.body.bspc_2_id);
          }
          if (req.body.user_id) {
            condition.where.user_id = (req.body.user_id);
          }
          if (req.body.variety_code) {
            condition.where.variety_code = (req.body.variety_code);
          }
        }

        const bspc2sData = await bspPerformaBspTwo.findOne(condition);

        if (bspc2sData && Object.keys(bspc2sData).length) {
          const bspc2sId = parseInt(req.body.bspc_2_id);

          const bspPerformaBspTwoSeedData = await bspPerformaBspTwoSeed.findAll({
            where: {
              bsp_proforma_2_id: bspc2sId,
            },
            attributes: ['id', 'bsp_proforma_2_id', 'stage_id', 'seed_class_id', 'year', 'season', 'lot_id', 'tag_id', 'lot_number', 'tag_range', 'quantity_sown']
          });

          if (bspPerformaBspTwoSeedData && Object.keys(bspPerformaBspTwoSeedData).length) {
            returnResponse = {
              bspProforma2Data: bspc2sData,
              bspProforma2SeedData: bspPerformaBspTwoSeedData
            };

            response(res, status.DATA_AVAILABLE, 200, returnResponse, internalCall);
          } else {
            response(res, status.DATA_NOT_AVAILABLE, 400, bspc2sData, internalCall);
          }
        } else {
          response(res, status.DATA_NOT_AVAILABLE, 400, returnResponse, internalCall);
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

  static editBspProforma2sData = async (req, res) => {
    let returnResponse = {};
    const { internalCall } = req.body;
    try {
      let rules = {
        'bspc_2_id': 'required|integer',
        'user_id': 'required|integer',
        'data.bspc_2_id': 'required|integer',
        'data.year': 'required|string',
        'data.season': 'required|string',
        'data.crop_code': 'required|string',
        'data.variety_code': 'required|string',
        'data.variety_line_code': 'string',
        'data.user_id': 'required|string',
        'data.state_code': 'required|string',
        'data.district_code': 'required|string',
        'data.address': 'required|string',
        'data.area_shown': 'required',
        'data.date_of_showing': 'required|string',
        'data.class_of_seed': 'string|in:bs,ns',
        'data.quantity_of_ns_shown': 'string',
        'data.quantity_of_bs_shown': 'string',
        'data.expected_inspection_from': 'required|string',
        'data.expected_inspection_to': 'required|string',
        'data.expected_harvest_from': 'required|string',
        'data.expected_harvest_to': 'required|string',
        'data.expected_production': 'required|string',
        'data.quantity_data.*.year': 'required|string',
        'data.quantity_data.*.season': 'required|string',
        // 'data.quantity_data.*.crop_code': 'required|string',
        // 'data.quantity_data.*.variety_code': 'required|string',
        'data.quantity_data.*.variety_line_code': 'string',
        // 'data.quantity_data.*.seed_class_id': 'required|string',
        'data.quantity_data.*.stage_id': 'required|string',
        'data.quantity_data.*.lot_id': 'required|string',
        'data.quantity_data.*.lot_number': 'required|string',
        'data.quantity_data.*.tag_id': 'required|string',
        'data.quantity_data.*.tag_number': 'required|string',
        'data.quantity_data.*.tag_quantity': 'required|string',
        'data.quantity_data.*.quantity_available': 'required|string',
        'data.quantity_data.*.quantity_sown': 'required|string',
        // 'data.total_quantity.*.seed_class_id': 'required|string',
        'data.total_quantity.*.quantity_sown': 'required|string',
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
          where: {
            is_active: 1,
            is_freezed: 0
          },
          raw: true,
          attributes: ['id', 'season', 'year', 'crop_code', 'variety_code', 'variety_line_code', 'req_data']
        };

        if (req.body) {
          if (req.body.bspc_2_id) {
            condition.where.id = (req.body.bspc_2_id);
          }
          if (req.body.user_id) {
            condition.where.user_id = (req.body.user_id);
          }
        }

        const bspc2sData = await bspPerformaBspTwo.findOne(condition);

        if (!(bspc2sData && Object.keys(bspc2sData).length)) {
          response(res, status.DATA_NOT_AVAILABLE, 400, returnResponse, internalCall);
        } else {

          const bspc2sId = parseInt(req.body.bspc_2_id);

          const bspPerformaBspTwoSeedData = await bspPerformaBspTwoSeed.findAll({
            where: {
              bsp_proforma_2_id: bspc2sId,
            },
            attributes: ['id', 'bsp_proforma_2_id', 'stage_id', 'seed_class_id', 'year', 'season', 'lot_id', 'tag_id', 'lot_number', 'tag_range', 'quantity_sown', 'variety_line_code']
          });

          if (!(bspPerformaBspTwoSeedData && Object.keys(bspPerformaBspTwoSeedData).length)) {
            response(res, status.DATA_NOT_AVAILABLE, 400, bspc2sData, internalCall);
          } else {

            const { data, user_id } = req.body;

            const date = moment().subtract(0, 'days');
            date.format('YYYY-MM-DD H:mm:ss');

            const bspProforma2sUpdateData = {
              year: data.year,
              season: data.season,
              crop_code: data.crop_code,
              variety_code: data.variety_code,
              state_code: data.state_code,
              district_code: data.district_code,
              address: data.address,
              area_shown: data.area_shown,
              date_of_showing: data.date_of_showing,
              quantity_of_ns_shown: data.quantity_of_ns_shown,
              quantity_of_bs_shown: data.quantity_of_bs_shown,
              expected_inspection_from: data.expected_inspection_from,
              expected_inspection_to: data.expected_inspection_to,
              expected_harvest_from: data.expected_harvest_from,
              expected_harvest_to: data.expected_harvest_to,
              expected_production: data.expected_production,
              variety_line_code: data.variety_line_code ? data.variety_line_code : null,
              class_of_seed_sown: data.class_of_seed,
              qty_of_seed_sown: data.qty_seed_sown,
              updated_at: date,
              req_data: (data)
            };

            let queryCondition = {
              where: {
                year: bspProforma2sUpdateData.year,
                season: bspProforma2sUpdateData.season,
                crop_code: bspProforma2sUpdateData.crop_code,
                variety_code: bspProforma2sUpdateData.variety_code,
                user_id: user_id,
                address: bspProforma2sUpdateData.address,
                is_active: 1,
                id: {
                  [Op.ne]: bspc2sId
                }
              }
            };

            if (bspProforma2sUpdateData.variety_line_code) {
              queryCondition = {
                ...queryCondition,
                variety_line_code: bspProforma2sUpdateData.variety_line_code
              }
            };

            const existingFCData = await bspPerformaBspTwo.findOne(queryCondition);

            if (existingFCData) {
              returnResponse = {
                field_code: ['Data already exists']
              };
              return response(res, status.BAD_REQUEST, 400, returnResponse, internalCall);
            } else {

              const result = await this.checkEditQuantityData(data);

              if (parseInt(result.status) !== 200) {
                response(res, status.BAD_REQUEST, 400, result, internalCall);
              } else {

                // reset existing seed data start


                const promises = [];
                for (const key in bspPerformaBspTwoSeedData) {

                  const lotData = await seedInventoryTag.findOne({
                    where: {
                      id: bspPerformaBspTwoSeedData[key].lot_id
                    },
                    attributes: ['quantity', 'quantity_used', 'quantity_remaining', 'id']
                  });

                  const tagData = await seedInventoryTagDetail.findOne({
                    where: {
                      id: bspPerformaBspTwoSeedData[key].tag_id
                    },
                    attributes: ['weight', 'weight_used', 'weight_remaining', 'id', 'is_used']
                  });

                  if (!tagData || !lotData) {
                    returnResponse = {
                      data: ['Tag/Lot Data Not Found.']
                    }
                    response(res, status.BAD_REQUEST, 400, returnResponse, internalCall);
                  } else {

                    const lotUpdateData = {
                      quantity_used: parseFloat(lotData.quantity_used) - parseFloat(bspPerformaBspTwoSeedData[key].quantity_sown),
                      quantity_remaining: parseFloat(lotData.quantity_remaining) + parseFloat(bspPerformaBspTwoSeedData[key].quantity_sown),
                    };
                    const tagUpdateData = {
                      weight_used: parseFloat(tagData.weight_used) - parseFloat(bspPerformaBspTwoSeedData[key].quantity_sown),
                      weight_remaining: parseFloat(tagData.weight_remaining) + parseFloat(bspPerformaBspTwoSeedData[key].quantity_sown),
                      is_used: 0
                    };

                    await seedInventoryTag.update(lotUpdateData, {
                      where: {
                        id: bspPerformaBspTwoSeedData[key].lot_id,
                      }
                    }).then(function (item) {
                    }).catch(function (err) {
                      returnResponse = {
                        error: err.message
                      }
                      console.log(returnResponse);
                      response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
                    });

                    await seedInventoryTagDetail.update(tagUpdateData, {
                      where: {
                        id: bspPerformaBspTwoSeedData[key].tag_id,
                      }
                    }).then(function (item) {
                    }).catch(function (err) {
                      returnResponse = {
                        error: err.message
                      }
                      console.log(returnResponse);
                      response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
                    });

                  }
                  const promise = new Promise((resolve) => {
                    resolve(key);
                  });
                  promises.push(promise);
                }
                await Promise.all(promises);

                await bspPerformaBspTwoSeed.destroy({
                  where: {
                    bsp_proforma_2_id: bspc2sId,
                  },
                });

                // reset existing seed data end

                let bspProforma2SeedInsertDataArray = [];
                let index = 0;

                const promisesV2 = [];
                for (const key in data.quantity_data) {

                  const bspProforma2SeedInsertDataBasic = {
                    bsp_proforma_2_id: bspc2sId,
                    lot_id: data.quantity_data[key].lot_id,
                    lot_number: data.quantity_data[key].lot_number,
                    season: data.quantity_data[key].season,
                    seed_class_id: data.quantity_data[key].seed_class_id,
                    stage_id: data.quantity_data[key].stage_id,
                    year: data.quantity_data[key].year,
                    variety_line_code: data.quantity_data[key].variety_line_code ? data.quantity_data[key].variety_line_code : null,
                  };


                  const tagRangeArray = data.quantity_data[key].tag_number.split(',');
                  const tagIdArray = data.quantity_data[key].tag_id.split(',');
                  const tagQuantityArray = data.quantity_data[key].tag_quantity.split(',');


                  const promisesV4 = [];
                  for (const key3 in tagRangeArray) {

                    const tagRage = tagRangeArray[key3];
                    const tagId = tagIdArray[key3];

                    bspProforma2SeedInsertDataArray[index] = {
                      ...bspProforma2SeedInsertDataBasic,
                      tag_range: tagRage,
                      tag_id: tagId,
                      quantity_sown: tagRangeArray.length > 1 ? tagQuantityArray[key3] : data.quantity_data[key].quantity_sown
                    };

                    let seedInventoryTagData = {};
                    await seedInventoryTag.findOne({
                      where: {
                        id: bspProforma2SeedInsertDataBasic.lot_id,
                        lot_number: bspProforma2SeedInsertDataBasic.lot_number,
                      },
                      attributes: ['quantity_used', 'quantity_remaining']
                    }).then(function (item) {
                      seedInventoryTagData = item['_previousDataValues'];
                    }).catch(function (err) {
                      returnResponse = {
                        error: err.message
                      }
                      console.log(returnResponse);
                      response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
                    });


                    const quantity_used = seedInventoryTagData && seedInventoryTagData.quantity_used ? parseFloat(seedInventoryTagData.quantity_used) : (seedInventoryTagData && seedInventoryTagData['dataValues'] && seedInventoryTagData['dataValues'].quantity_used ? parseFloat(seedInventoryTagData['dataValues'].quantity_used) : 0);
                    const quantity_remaining = seedInventoryTagData && seedInventoryTagData.quantity_remaining ? parseFloat(seedInventoryTagData.quantity_remaining) : (seedInventoryTagData && seedInventoryTagData['dataValues'] && seedInventoryTagData['dataValues'].quantity_remaining ? parseFloat(seedInventoryTagData['dataValues'].quantity_remaining) : 0);

                    const updateData = {
                      quantity_used: parseFloat(bspProforma2SeedInsertDataArray[index].quantity_sown) + quantity_used,
                      // quantity_remaining: quantity_remaining - (tagRangeArray.length > 1 ? 0 : parseFloat(data[key].quantity_data[key2].quantity_available) - parseFloat(bspProforma2SeedInsertDataArray[index].quantity_sown))
                      quantity_remaining: quantity_remaining - parseFloat(bspProforma2SeedInsertDataArray[index].quantity_sown)
                    };

                    const updateDataTagDetail = {
                      weight_used: bspProforma2SeedInsertDataArray[index].quantity_sown,
                      weight_remaining: tagRangeArray.length > 1 ? 0 : parseFloat(data.quantity_data[key].quantity_available) - parseFloat(bspProforma2SeedInsertDataArray[index].quantity_sown)
                    };

                    if (!updateDataTagDetail.weight_remaining) {
                      updateDataTagDetail['is_used'] = 1;
                    }

                    index++;
                    await seedInventoryTag.update(updateData, {
                      where: {
                        id: bspProforma2SeedInsertDataBasic.lot_id,
                        lot_number: bspProforma2SeedInsertDataBasic.lot_number,
                      }
                    }).then(function (item) {
                    }).catch(function (err) {
                      returnResponse = {
                        error: err.message
                      }
                      console.log(returnResponse);
                      response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
                    });

                    await seedInventoryTagDetail.update(updateDataTagDetail, {
                      where: {
                        id: tagId,
                        tag_number: tagRage
                      }
                    }).then(function (item) {
                    }).catch(function (err) {
                      returnResponse = {
                        error: err.message
                      }
                      console.log(returnResponse);
                      response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
                    });

                    const promise = new Promise((resolve) => {
                      resolve(key);
                    });
                    promisesV4.push(promise);
                  }
                  await Promise.all(promisesV4);

                  const promise = new Promise((resolve) => {
                    resolve(key);
                  });
                  promisesV2.push(promise);
                }
                await Promise.all(promisesV2);

                await bspPerformaBspTwoSeed.bulkCreate(bspProforma2SeedInsertDataArray).catch(function (err) {
                  returnResponse = {
                    error: err.message
                  }
                  response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
                });

                await bspPerformaBspTwo.update(bspProforma2sUpdateData, {
                  where: {
                    id: bspc2sId
                  }
                });

                response(res, status.DATA_UPDATED, 200, returnResponse, internalCall);
              }
            }
          }
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

  static checkEditQuantityOfSeedInventory = async (req, res) => {
    let returnResponse = {};
    const { internalCall } = req.body;
    try {
      let rules = {
        'user_id': 'integer',
        'bspc_2_id': 'integer',
        'quantity_data.*.user_id': 'string',
        'quantity_data.*.variety_line_code': 'string',
        'quantity_data.*.year': 'required|string',
        'quantity_data.*.season': 'required|string',
        // 'quantity_data.*.crop_code': 'required|string',
        // 'quantity_data.*.variety_code': 'required|string',
        'quantity_data.*.seed_class_id': 'required|string',
        'quantity_data.*.stage_id': 'required|string',
        'quantity_data.*.lot_id': 'required|string',
        'quantity_data.*.lot_number': 'required|string',
        'quantity_data.*.tag_id': 'required|string',
        'quantity_data.*.tag_number': 'required|string',
        'quantity_data.*.tag_quantity': 'required|string',
        'quantity_data.*.quantity_available': 'required|string',
        'quantity_data.*.quantity_sown': 'required|string',
        'total_quantity.*.seed_class_id': 'required|string',
        'total_quantity.*.quantity_sown': 'required|string',
      };

      let validation = new Validator(req.body, rules);

      const isValidData = validation.passes();

      if (!isValidData) {
        returnResponse = validation.errors.errors;
        return response(res, status.BAD_REQUEST, 400, returnResponse, internalCall);
      }

      const result = await this.checkEditQuantityData(req.body);
      response(res, result.message, result.status, result.data, internalCall);
    } catch (error) {
      returnResponse = {
        error: error.message
      }
      console.log(returnResponse);
      response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }

  static checkEditQuantityData = async (req) => {
    let returnResponse = {
      status: 200,
      message: status.OK,
      data: {}
    };
    try {
      let rules = {
        'user_id': 'required',
        'bspc_2_id': 'required',
        'quantity_data.*.user_id': 'string',
        'quantity_data.*.variety_line_code': 'string',
        'quantity_data.*.year': 'required|string',
        'quantity_data.*.season': 'required|string',
        // 'quantity_data.*.crop_code': 'required|string',
        // 'quantity_data.*.variety_code': 'required|string',
        'quantity_data.*.seed_class_id': 'required|string',
        'quantity_data.*.stage_id': 'required|string',
        'quantity_data.*.lot_id': 'required|string',
        'quantity_data.*.lot_number': 'required|string',
        'quantity_data.*.tag_id': 'required|string',
        'quantity_data.*.tag_number': 'required|string',
        'quantity_data.*.tag_quantity': 'required|string',
        'quantity_data.*.quantity_available': 'required|string',
        'quantity_data.*.quantity_sown': 'required|string',
        'total_quantity.*.seed_class_id': 'required|string',
        'total_quantity.*.quantity_sown': 'required|string',
      };

      let validation = new Validator(req, rules);

      const isValidData = validation.passes();

      if (!isValidData) {
        returnResponse = {
          status: 400,
          message: status.BAD_REQUEST,
          data: validation.errors.errors
        };
        return returnResponse;
      }

      const { quantity_data, total_quantity, bspc_2_id, user_id } = req;

      const colData = quantity_data.map(x => x['tag_number'])

      let seedClassIds = quantity_data.map(x => x['seed_class_id']);
      seedClassIds = await seedClassIds.filter((item, i, ar) => ar.indexOf(item) === i);

      if (seedClassIds.length !== total_quantity.length) {
        returnResponse = {
          status: 400,
          message: status.BAD_REQUEST,
          data: {
            total_quantity: ['Invalid request data 2']
          }
        };
        return returnResponse;
      } else {
        let tempArray = []
        const promises = [];
        for (const key in seedClassIds) {

          const seedClassData = await quantity_data.filter((datum) => {
            return parseInt(datum.seed_class_id) === parseInt(seedClassIds[key])
          });

          let quantity_sown = seedClassData.map(x => x['quantity_sown'])
          quantity_sown = await quantity_sown.reduce((accumulator, currentValue) => {
            return parseFloat(accumulator) + parseFloat(currentValue)
          }, 0);

          tempArray[key] = {
            seed_class_id: seedClassIds[key],
            quantity_sown: quantity_sown,
          };

          const seedClassRequestData = await total_quantity.filter((datum) => {
            return parseInt(datum.seed_class_id) === parseInt(seedClassIds[key])
          });

          const reqQuantity = seedClassRequestData && seedClassRequestData.length && seedClassRequestData[0] && seedClassRequestData[0].quantity_sown ? parseFloat(seedClassRequestData[0].quantity_sown) : 0;

          if (reqQuantity !== quantity_sown) {
            returnResponse = {
              status: 400,
              message: status.BAD_REQUEST,
              data: {
                total_quantity: ['Invalid request data 3']
              }
            };
            return returnResponse;
          }

          const promise = new Promise((resolve) => {
            resolve(key);
          });
          promises.push(promise);
        }
        await Promise.all(promises);
      }


      let tagArray = [];
      const promises = [];
      for (const key in colData) {

        const tempArray = colData[key].split(',');
        tagArray = tagArray.concat(tempArray);

        if (tempArray.length > 1) {
          if (parseFloat(quantity_data[key].quantity_sown) != parseFloat(quantity_data[key].quantity_available)) {
            const index = 'quantity.' + key + '.' + 'quantity_sown';
            returnResponse = {
              status: 400,
              message: status.BAD_REQUEST,
              data: {}
            };
            returnResponse.data[index] = ['Invalid quantity shown 3'];
            return returnResponse;
          }
        } else {
          if (quantity_data[key].quantity_sown == 0 || (parseFloat(quantity_data[key].quantity_sown) > parseFloat(quantity_data[key].quantity_available))) {
            const index = 'quantity.' + key + '.' + 'quantity_sown';
            returnResponse = {
              status: 400,
              message: status.BAD_REQUEST,
              data: {}
            };
            returnResponse.data[index] = ['Invalid quantity shown 4'];
            return returnResponse;
          }
        }

        const promise = new Promise((resolve) => {
          resolve(key);
        });
        promises.push(promise);
      }
      await Promise.all(promises);

      let uniquetagArray = await tagArray.filter((item, i, ar) => ar.indexOf(item) === i);

      if (uniquetagArray.length !== tagArray.length) {
        returnResponse = {
          status: 400,
          message: status.BAD_REQUEST,
          data: {
            tag_number: ['Tag Numbers selection should be unique for each quantity row']
          }
        };
        return returnResponse;
      } else {

        const promises = [];
        for (const key in quantity_data) {

          let condition = {
            include: [],
            where: {},
            raw: true,
            // attributes: [],
          };

          if (quantity_data[key]) {
            if (quantity_data[key].tag_id) {
              condition.where.id = {
                [Op.in]: quantity_data[key].tag_id.toString().split(',')
              };
            }
          }

          const quantityData = await seedInventoryTagDetail.findAll(condition);

          const tagIdArray = quantity_data[key].tag_id.toString().split(',');

          let quantDatalength = 0;

          const promises = [];

          for (const key2 in tagIdArray) {
            const tagId = tagIdArray[key2];
            const bspPerformaBspTwoSeedData = await bspPerformaBspTwoSeed.findOne({
              where: {
                bsp_proforma_2_id: bspc_2_id,
                seed_class_id: quantity_data && quantity_data[key] && quantity_data[key].seed_class_id ? quantity_data[key].seed_class_id : '',
                stage_id: quantity_data && quantity_data[key] && quantity_data[key].stage_id ? quantity_data[key].stage_id : '',
                year: quantity_data && quantity_data[key] && quantity_data[key].year ? quantity_data[key].year : '',
                season: quantity_data && quantity_data[key] && quantity_data[key].season ? quantity_data[key].season : '',
                tag_id: tagId,
                lot_id: quantity_data && quantity_data[key] && quantity_data[key].lot_id ? quantity_data[key].lot_id : '',
              },
              attributes: ['id', 'bsp_proforma_2_id', 'stage_id', 'seed_class_id', 'year', 'season', 'lot_id', 'tag_id', 'lot_number', 'tag_range', 'quantity_sown']
            });

            const bsp2SeedTagQuantitySown = bspPerformaBspTwoSeedData && bspPerformaBspTwoSeedData.quantity_sown ? parseFloat(bspPerformaBspTwoSeedData.quantity_sown) : 0;

            const quantityTagData = await quantityData.filter((datum) => {
              return parseInt(datum.id) === parseInt(tagId)
            });
            console.log(parseFloat(quantityTagData[0].weight_remaining), 'parseFloat(quantityTagData[0].weight_remaining)')
            console.log(parseFloat(bsp2SeedTagQuantitySown), 'parseFloat(bsp2SeedTagQuantitySown)')
            const tempWeightRemaining = parseFloat(quantityTagData[0].weight_remaining) + parseFloat(bsp2SeedTagQuantitySown);

            if (!tempWeightRemaining) {
              returnResponse = {
                status: 400,
                message: status.BAD_REQUEST,
                data: {
                  tag_number: ['Tag Quantity Unavailable 1']
                }
              };
              return returnResponse;
            } else {
              quantDatalength++;
              continue;
            }

            const promise = new Promise((resolve) => {
              resolve(key);
            });
            promises.push(promise);
          }
          await Promise.all(promises);

          const tagNumberLength = (quantity_data[key].tag_number.split(',')).length;

          console.log(tagNumberLength, 'quantityData: ', quantityData);

          if (!(quantDatalength && quantDatalength === tagNumberLength)) {
            returnResponse = {
              status: 400,
              message: status.BAD_REQUEST,
              data: {
                tag_number: ['Invalid Tag Request Data 2']
              }
            };
            return returnResponse;
          }

          const promise = new Promise((resolve) => {
            resolve(key);
          });
          promises.push(promise);
        }
        await Promise.all(promises);

        returnResponse = {
          status: 200,
          message: status.DATA_VERIFIED,
          data: {
            quantity: ['Request Quantity Data Verified']
          }
        };
        return returnResponse;
      }

    }
    catch (error) {
      returnResponse = {
        status: 500,
        message: status.UNEXPECTED_ERROR,
        data: {
          error: error.message
        }
      }
      return returnResponse;
    }
  }

  static deleteBspProforma2sDataSecond = async (req, res) => {
    let returnResponse = {};
    const { internalCall } = req.body;
    try {
      let rules = {
        'bspc_2_id': 'required',
        'user_id': 'required|integer',
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
          where: {
            is_active: 1,
            is_freezed: 0
          },
          raw: true,
          attributes: ['id']
        };

        if (req.body) {
          if (req.body.bspc_2_id) {

            condition.where.id = {
              [Op.in]: req.body.bspc_2_id
            };
          }
          if (req.body.user_id) {
            condition.where.user_id = (req.body.user_id);
          }
        }

        const bspc2sData = await bspPerformaBspTwo.findAll(condition);

        if (bspc2sData && Object.keys(bspc2sData).length) {
          const bspc2sId = (req.body.bspc_2_id);
          console.log(bspc2sId, 'bspc2sIdbspc2sId')

          const bspPerformaBspTwoSeedData = await bspPerformaBspTwoSeed.findAll({
            where: {
              bsp_proforma_2_id: {
                [Op.in]: bspc2sId
              },
            },
            attributes: ['id', 'lot_number', 'tag_range', 'quantity_sown']
          });

          if (bspPerformaBspTwoSeedData && Object.keys(bspPerformaBspTwoSeedData).length) {
            console.log(bspPerformaBspTwoSeedData, 'bspPerformaBspTwoSeedData')
            const bspPerformaBspTwoSeedIds = [];
            const promises = [];
            for (const key in bspPerformaBspTwoSeedData) {

              const bspPerformaBspTwoSeedId = bspPerformaBspTwoSeedData[key]['dataValues'].id;
              const lot_number = bspPerformaBspTwoSeedData[key]['dataValues'].lot_number;
              const tag_number = bspPerformaBspTwoSeedData[key]['dataValues'].tag_range;
              const quantity_sown = bspPerformaBspTwoSeedData[key]['dataValues'].quantity_sown;

              bspPerformaBspTwoSeedIds[bspPerformaBspTwoSeedIds.length] = bspPerformaBspTwoSeedId

              const tagData = await seedInventoryTagDetail.findAll({
                where: {
                  tag_number: tag_number
                },
                attributes: ['id', 'weight', 'weight_used', 'weight_remaining']
              });
              const lotData = await seedInventoryTag.findAll({
                where: {
                  lot_number: lot_number
                },
                attributes: ['id', 'quantity', 'quantity_used', 'quantity_remaining']
              });

              if (tagData && lotData) {
                const tagId = tagData && tagData.id ? parseInt(tagData.id) : null;
                const weight = tagData && tagData.weight ? parseFloat(tagData.weight) : 0;
                const weight_used = tagData && tagData.weight_used ? parseFloat(tagData.weight_used) : 0;
                const weight_remaining = tagData && tagData.weight_remaining ? parseFloat(tagData.weight_remaining) : 0;

                const lotId = lotData && lotData.id ? parseInt(lotData.id) : null;
                const quantity = lotData && lotData.quantity ? parseFloat(lotData.quantity) : 0;
                const quantity_used = lotData && lotData.quantity_used ? parseFloat(lotData.quantity_used) : 0;
                const quantity_remaining = lotData && lotData.quantity_remaining ? parseFloat(lotData.quantity_remaining) : 0;

                const tagUpdateData = {
                  weight_used: parseFloat(weight_used) - parseFloat(quantity_sown),
                  weight_remaining: parseFloat(weight_remaining) + parseFloat(quantity_sown),
                };

                if (tagUpdateData.weight_remaining) {
                  tagUpdateData['is_used'] = 0
                }

                const lotUpdateData = {
                  quantity_used: parseFloat(quantity_used) - parseFloat(quantity_sown),
                  quantity_remaining: parseFloat(quantity_remaining) + parseFloat(quantity_sown),
                };

                await seedInventoryTagDetail.update(tagUpdateData, {
                  where: {
                    id: tagId,
                  }
                }).then(function (item) {
                }).catch(function (err) {
                  returnResponse = {
                    error: err.message
                  }
                  console.log(returnResponse);
                  response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
                });

                await seedInventoryTag.update(lotUpdateData, {
                  where: {
                    id: lotId,
                  }
                }).then(function (item) {
                }).catch(function (err) {
                  returnResponse = {
                    error: err.message
                  }
                  console.log(returnResponse);
                  response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
                });
              }
              const promise = new Promise((resolve) => {
                resolve(key);
              });
              promises.push(promise);
            }
            await Promise.all(promises);

            await bspPerformaBspTwoSeed.destroy({
              where: {
                id: {
                  [Op.in]: bspPerformaBspTwoSeedIds
                }
              }
            }).then(function (item) {
            }).catch(function (err) {
              returnResponse = {
                error: err.message
              }
              console.log(returnResponse);
              response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
            });

            await bspPerformaBspTwo.destroy({
              where: {
                id: bspc2sId,
                is_active: 1
              }
            }).then(function (item) {
            }).catch(function (err) {
              returnResponse = {
                error: err.message
              }
              console.log(returnResponse);
              response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
            });

            response(res, status.DATA_DELETED, 200, returnResponse, internalCall);
          } else {
            response(res, status.DATA_NOT_AVAILABLE, 400, bspc2sData, internalCall);
          }
        } else {
          response(res, status.DATA_NOT_AVAILABLE, 400, returnResponse, internalCall);
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
  static getBspProforma1sVarietiesLevel1Second = async (req, res) => {
    let returnResponse = {};
    const { internalCall } = req.body;
    try {
      let rules = {
        'search.year': 'string',
        'search.season': 'string',
        'search.crop_code': 'string',
        'search.state_code': 'string',
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
      }

      let condition = {
        include: [
          {
            model: bspProformaOneBspc,
            required: true,
            attributes: []
          },
          {
            model: bspPerformaBspTwo,
            as: 'bspOneTwoVC',
            required: false,
            where: {
              is_active: 1
            },
            attributes: []
          },
          {
            model: varietyModel,
            required: true,
            attributes: []
          }
        ],
        where: {
          is_active: 1,
          ['$bspOneTwoVC.id$']: null,
          ['$m_crop_variety.status$']: 'variety'
        },
        group: ['bsp_proforma_1s.variety_code', 'm_crop_variety.variety_name', 'bsp_proforma_1s.variety_code'],
        raw: true,
        attributes: [
          [sequelize.col('bsp_proforma_1s.variety_code'), 'variety_code'],
          [sequelize.literal('SUM(bsp_proforma_1_bspc.target_qunatity)'), 'target_quantity'],
        ]
      };

      let condition4 = {
        include: [
          {
            model: bspProformaOneBspc,
            required: true,
            attributes: []
          },
          {
            model: bspPerformaBspTwo,
            as: 'bspOneTwoVC',
            on: {
              col1: sequelize.where(sequelize.col("bspOneTwoVC.variety_line_code"), "=", sequelize.col("bsp_proforma_1s.variety_line_code")),
            },
            required: false,
            where: {
              is_active: 1
            },
            attributes: []
          },
          {
            model: varietyModel,
            required: true,
            attributes: []
          }
        ],
        where: {
          is_active: 1,
          ['$bspOneTwoVC.id$']: null,
          ['$m_crop_variety.status$']: 'hybrid'
        },
        group: ['bsp_proforma_1s.variety_code', 'm_crop_variety.variety_name', 'bsp_proforma_1s.variety_code'],
        raw: true,
        attributes: [
          [sequelize.col('bsp_proforma_1s.variety_code'), 'variety_code'],
          [sequelize.literal('SUM(bsp_proforma_1_bspc.target_qunatity)'), 'target_quantity'],
        ]
      };

      let condition2 = {
        include: [
          {
            model: bspProformaOneBspc,
            required: true,
            attributes: []
          },
          // {
          //   model: bspPerformaBspTwo,
          //   as: 'bspOneTwoVC',
          //   required: false,
          //   where: {
          //     is_active: 1
          //   },
          //   attributes: []
          // },
          {
            model: varietyModel,
            required: true,
            attributes: []
          }
        ],
        where: {
          is_active: 1,
          // ['$bspOneTwoVC.id$'] : null
        },
        group: ['bsp_proforma_1s.variety_code', 'm_crop_variety.variety_name', 'bsp_proforma_1s.variety_code'],
        raw: true,
        attributes: [
          [sequelize.col('bsp_proforma_1s.variety_code'), 'variety_code'],
          [sequelize.literal('SUM(bsp_proforma_1_bspc.target_qunatity)'), 'target_quantity'],
        ]
      };

      let condition3 = {
        include: [
          {
            model: bspPerformaBspTwo,
            as: 'directIndentVC',
            required: false,
            where: {
              is_active: 1
            },
            attributes: []
          },
          {
            model: varietyModel,
            required: true,
            attributes: []
          }
        ],
        where: {
          is_active: 1,
          ['$directIndentVC.id$']: null
        },
        group: ['indent_of_breederseed_direct.variety_code', 'm_crop_variety.variety_name'],
        raw: true,
        attributes: [
          [sequelize.col('indent_of_breederseed_direct.variety_code'), 'variety_code'],
          [sequelize.literal('SUM(indent_of_breederseed_direct.quantity)'), 'quantity'],
        ]
      };

      let condition6 = {
        include: [
          {
            model: varietyModel,
            required: true,
            attributes: []
          }
        ],
        where: {
          is_active: 1,
        },
        group: ['indent_of_breederseed_direct.variety_code', 'm_crop_variety.variety_name'],
        raw: true,
        attributes: [
          [sequelize.col('indent_of_breederseed_direct.variety_code'), 'variety_code'],
          [sequelize.literal('SUM(indent_of_breederseed_direct.quantity)'), 'quantity'],
        ]
      };

      if (req.body.search) {
        if (req.body.search.year) {
          condition.where.year = {
            [Op.in]: req.body.search.year.toString().split(',')
          };

          condition.include[1].where.year = {
            [Op.in]: req.body.search.year.toString().split(',')
          };

          condition4.where.year = {
            [Op.in]: req.body.search.year.toString().split(',')
          };

          condition4.include[1].where.year = {
            [Op.in]: req.body.search.year.toString().split(',')
          };

          condition2.where.year = {
            [Op.in]: req.body.search.year.toString().split(',')
          };

          // condition2.include[1].where.year = {
          //   [Op.in]: req.body.search.year.toString().split(',')
          // };

          condition3.where.year = {
            [Op.in]: req.body.search.year.toString().split(',')
          };

          condition6.where.year = {
            [Op.in]: req.body.search.year.toString().split(',')
          };
        }
        if (req.body.search.season) {
          condition.where.season = {
            [Op.in]: req.body.search.season.toString().split(',')
          };

          condition.include[1].where.season = {
            [Op.in]: req.body.search.season.toString().split(',')
          };

          condition4.where.season = {
            [Op.in]: req.body.search.season.toString().split(',')
          };

          condition4.include[1].where.season = {
            [Op.in]: req.body.search.season.toString().split(',')
          };

          condition2.where.season = {
            [Op.in]: req.body.search.season.toString().split(',')
          };

          // condition2.include[1].where.season = {
          //   [Op.in]: req.body.search.season.toString().split(',')
          // };

          condition3.where.season = {
            [Op.in]: req.body.search.season.toString().split(',')
          };

          condition6.where.season = {
            [Op.in]: req.body.search.season.toString().split(',')
          };
        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = {
            [Op.in]: req.body.search.crop_code.toString().split(',')
          };

          condition.include[1].where.crop_code = {
            [Op.in]: req.body.search.crop_code.toString().split(',')
          };

          condition4.where.crop_code = {
            [Op.in]: req.body.search.crop_code.toString().split(',')
          };

          condition4.include[1].where.crop_code = {
            [Op.in]: req.body.search.crop_code.toString().split(',')
          };

          condition2.where.crop_code = {
            [Op.in]: req.body.search.crop_code.toString().split(',')
          };

          // condition2.include[1].where.crop_code = {
          //   [Op.in]: req.body.search.crop_code.toString().split(',')
          // };

          condition3.where.crop_code = {
            [Op.in]: req.body.search.crop_code.toString().split(',')
          };

          condition6.where.crop_code = {
            [Op.in]: req.body.search.crop_code.toString().split(',')
          };
        }
        if (req.body.search.variety_code) {
          condition.where.variety_code = {
            [Op.in]: req.body.search.variety_code.toString().split(',')
          };

          condition.include[1].where.variety_code = {
            [Op.in]: req.body.search.variety_code.toString().split(',')
          };

          condition4.where.variety_code = {
            [Op.in]: req.body.search.variety_code.toString().split(',')
          };

          condition4.include[1].where.variety_code = {
            [Op.in]: req.body.search.variety_code.toString().split(',')
          };

          condition2.where.variety_code = {
            [Op.in]: req.body.search.variety_code.toString().split(',')
          };

          // condition2.include[1].where.variety_code = {
          //   [Op.in]: req.body.search.variety_code.toString().split(',')
          // };

          condition3.where.variety_code = {
            [Op.in]: req.body.search.variety_code.toString().split(',')
          };

          condition6.where.variety_code = {
            [Op.in]: req.body.search.variety_code.toString().split(',')
          };
        }
        if (req.body.search.user_id) {
          condition.where['$bsp_proforma_1_bspc.bspc_id$'] = {
            [Op.in]: req.body.search.user_id.toString().split(',')
          };
          condition.include[1].where.user_id = {
            [Op.in]: req.body.search.user_id.toString().split(',')
          };

          condition4.where['$bsp_proforma_1_bspc.bspc_id$'] = {
            [Op.in]: req.body.search.user_id.toString().split(',')
          };
          condition4.include[1].where.user_id = {
            [Op.in]: req.body.search.user_id.toString().split(',')
          };

          condition2.where['$bsp_proforma_1_bspc.bspc_id$'] = {
            [Op.in]: req.body.search.user_id.toString().split(',')
          };
          // condition2.include[1].where.user_id = {
          //   [Op.in]: req.body.search.user_id.toString().split(',')
          // };

          condition3.where.user_id = {
            [Op.in]: req.body.search.user_id.toString().split(',')
          };
          condition3.include[0].where.user_id = {
            [Op.in]: req.body.search.user_id.toString().split(',')
          };

          condition6.where.user_id = {
            [Op.in]: req.body.search.user_id.toString().split(',')
          };
        }
      }

      condition.order = [[sequelize.col('variety_name'), 'asc']];
      condition4.order = [[sequelize.col('variety_name'), 'asc']];
      condition2.order = [[sequelize.col('variety_name'), 'asc']];
      condition3.order = [[sequelize.col('variety_name'), 'asc']];

      const normalVarietyList = await bspPerformaBspOne.findAll(condition);
      const hybridVarietyList = await bspPerformaBspOne.findAll(condition4);

      let bsp1VarietyList = await normalVarietyList.concat(hybridVarietyList);

      const nationalIndentVarietyList = await bspPerformaBspOne.findAll(condition2);

      const directIndentVarietyList = await directIndent.findAll(condition3);

      const directIndentVarietyListTotal = await directIndent.findAll(condition6);

      const nationalIndentQuantityArray = await nationalIndentVarietyList.map(x => x['target_quantity']);
      const directIndentQuantityArray = await directIndentVarietyListTotal.map(x => x['quantity']);

      const nationalIndentQuantity = await nationalIndentQuantityArray.reduce((accumulator, currentValue) => {
        return parseFloat(accumulator) + parseFloat(currentValue)
      }, 0);

      const directIndentQuantity = await directIndentQuantityArray.reduce((accumulator, currentValue) => {
        return parseFloat(accumulator) + parseFloat(currentValue)
      }, 0);

      let mergedVarietyArray = await directIndentVarietyList.concat(bsp1VarietyList);
      mergedVarietyArray = await mergedVarietyArray.map(x => x['variety_code']);
      mergedVarietyArray = await mergedVarietyArray.filter((item, i, ar) => ar.indexOf(item) === i);

      const nationalIndentVarieties = await nationalIndentVarietyList.map(x => x['variety_code']);
      const directIndentVarieties = await directIndentVarietyListTotal.map(x => x['variety_code']);

      const tempArray = nationalIndentVarieties.concat(directIndentVarieties);
      const uniqueNationalDirectVarieties = await tempArray.filter((item, i, ar) => ar.indexOf(item) === i);

      let condition5 = {
        include: [
        ],
        where: {
          variety_code: {
            [Op.in]: mergedVarietyArray
          },
          is_active: 1,
        },
        raw: true,
        attributes: [
          [sequelize.col('variety_code'), 'value'],
          [sequelize.col('variety_name'), 'display_text'],
          [sequelize.col('variety_code'), 'variety_code'],
          [sequelize.col('status'), 'variety_type'],
        ]
      };
      condition5.order = [[sequelize.col('variety_name'), 'asc']];
      const varietyList = await varietyModel.findAll(condition5);

      returnResponse = {
        totalVarieties: uniqueNationalDirectVarieties.length,
        varietyList: varietyList,
        varities_national: nationalIndentVarietyList.length,
        varities_direct: directIndentVarietyListTotal.length,
        total_quantity_national: Math.round((nationalIndentQuantity + Number.EPSILON) * 100) / 100,
        total_quantity_direct: Math.round((directIndentQuantity + Number.EPSILON) * 100) / 100,
        total_targeted_quantity: null,
      };

      returnResponse.total_targeted_quantity = Math.round(((returnResponse.total_quantity_national + returnResponse.total_quantity_direct) + Number.EPSILON) * 100) / 100

      return response(res, status.DATA_AVAILABLE, 200, returnResponse, internalCall);
    } catch (error) {
      returnResponse = {
        error: error.message
      }
      console.log(returnResponse);
      response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }
  static registerQuantityOfCarryOver = async (req, res) => {
    let returnResponse = {};
    const { internalCall } = req.body;
    try {
      let rules = {
        'data.year': 'string',
        'data.season': 'string',
        'data.crop': 'string',
        'data.variety': 'string',
        'data.line_variety_code': 'string',
        'data.user_id': 'integer',
        'data.carry_over.*.class_of_seed': 'string',
        'data.carry_over.*.lot_no': 'string',
        'data.carry_over.*.stage': 'string',
        'data.carry_over.*.season': 'string',
        'data.carry_over.*.lot_no_id': 'string',

      };

      let validation = new Validator(req.body, rules);

      const isValidData = validation.passes();

      if (!isValidData) {
        returnResponse = validation.errors.errors;
        return response(res, status.BAD_REQUEST, 400, returnResponse, internalCall);
      }

      const { data } = req.body;

      let errorResponse = {};
      const date = moment().subtract(0, 'days');
      date.format('YYYY-MM-DD H:mm:ss');
      let queryCondition
      const carryOver = {
        year: data && data.year ? data.year : null,
        season: data && data.season ? data.season : null,
        crop_code: data.crop,
        variety_code: data.variety,
        meet_target: data && data.meet_target ? data.meet_target : null,
        variety_line_code: data.line_variety_code,
        user_id: data.user_id,
        total_qty: data && data.total_breederseed ? (data.total_breederseed) : null,
        req_data: (data),
        production_type: data.production_type,
        is_active: 1,
        bspc_id: data.user_id,
      }



      if (carryOver.variety_line_code) {
        queryCondition = {
          where: {
            year: carryOver.year,
            season: carryOver.season,
            crop_code: carryOver.crop_code,
            variety_code: carryOver.variety_code,
            user_id: carryOver.user_id,
            is_active: 1,
            variety_line_code: carryOver.variety_line_code,
            production_type: carryOver.production_type,
          }
        };
      } else {
        queryCondition = {
          where: {
            year: carryOver.year,
            season: carryOver.season,
            crop_code: carryOver.crop_code,
            variety_code: carryOver.variety_code,
            user_id: carryOver.user_id,
            is_active: 1,
            production_type: carryOver.production_type,
          }
        };
      }
      let carryOverSeedResponse = {};
      const existingFCData = await db.carryOverSeedModel.findOne(queryCondition);
      if (existingFCData) {
        returnResponse = {
          field_code: ['Data already exists']
        };
        return response(res, status.BAD_REQUEST, 400, returnResponse, internalCall);
      }
      await db.carryOverSeedModel.create(carryOver).then(function (item) {
        carryOverSeedResponse = item['_previousDataValues'];
      }).catch(function (err) {
        returnResponse = {
          error: err.message
        }
        console.log(returnResponse);
        response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
      });
      const bsp_proforma_2_id = carryOverSeedResponse && carryOverSeedResponse.id ? carryOverSeedResponse.id : (carryOverSeedResponse['dataValues'].id ? carryOverSeedResponse['dataValues'].id : null);
      let bspProforma2SeedInsertDataArray = [];
      let bspProforma2SeedInsertDataArray2 = []
      let index = 0;
      const promisesV3 = [];
      // let bspProforma2SeedInsertDataBasic;
      if (data && data.carry_over && data.carry_over.length > 0 && data.meet_target != 3) {

        for (const key2 in data.carry_over) {

          const tagRangeArray = data.carry_over[key2].tag_number.split(',');
          const tagIdArray = data.carry_over[key2].tag_id.split(',');
          const tagQuantityArray = data.carry_over[key2].tag_quantity.split(',');

          if ((tagRangeArray.length !== tagQuantityArray.length) || (tagQuantityArray.length !== tagIdArray.length)) {
            returnResponse = {
              tag_quantity: ['Invalid Tag Quantity Request Data']
            };
            return response(res, status.BAD_REQUEST, 400, returnResponse, internalCall);
          } else {
            let bspProforma2SeedInsertDataBasic = {
              carry_over_seed_id: bsp_proforma_2_id,
              class: data.carry_over[key2].class_of_seed,
              lot_no: data.carry_over[key2].lot_name,
              lot_id: data.carry_over[key2].lot_no,
              season: data.carry_over[key2].season,
              stage_id: data.carry_over[key2].stage,
              year: data.carry_over[key2].year,
              production_type: data.production_type,
              quantity_available: (data.carry_over[key2].qty_available),
              quantity_recieved: (data.carry_over[key2].qty_recieved),
              // tag_no: data.carry_over[key2].tag_no              ,             
            };

            const promisesV4 = [];
            // console.log(data.carry_over,'data.carryOver[key2].qty_recieved')
            for (const key3 in tagRangeArray) {

              const tagRage = tagRangeArray[key3];
              const tagId = tagIdArray[key3];
              bspProforma2SeedInsertDataArray[index] = {
                ...bspProforma2SeedInsertDataBasic,
                tag_range: tagRage,
                tag_id: tagId,
                quantity_recieved: tagRangeArray.length > 1 ? tagQuantityArray[key3] : data.carry_over[key2].qty_recieved
              };

              let seedInventoryTagData = {};
              await seedInventoryTag.findOne({
                where: {
                  id: bspProforma2SeedInsertDataBasic.lot_id,
                  lot_number: bspProforma2SeedInsertDataBasic.lot_no,
                },
                attributes: ['quantity_used', 'quantity_remaining']
              }).then(function (item) {
                seedInventoryTagData = item['_previousDataValues'];
              }).catch(function (err) {
                returnResponse = {
                  error: err.message
                }
                console.log(returnResponse);
                response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
              });


              const quantity_used = seedInventoryTagData && seedInventoryTagData.quantity_used ? parseFloat(seedInventoryTagData.quantity_used) : (seedInventoryTagData && seedInventoryTagData['dataValues'] && seedInventoryTagData['dataValues'].quantity_used ? parseFloat(seedInventoryTagData['dataValues'].quantity_used) : 0);
              const quantity_remaining = seedInventoryTagData && seedInventoryTagData.quantity_remaining ? parseFloat(seedInventoryTagData.quantity_remaining) : (seedInventoryTagData && seedInventoryTagData['dataValues'] && seedInventoryTagData['dataValues'].quantity_remaining ? parseFloat(seedInventoryTagData['dataValues'].quantity_remaining) : 0);

              const updateData = {
                quantity_used: parseFloat(bspProforma2SeedInsertDataArray[index].quantity_recieved) + quantity_used,
                // quantity_remaining: quantity_remaining - (tagRangeArray.length > 1 ? 0 : parseFloat(data[key].quantity_data[key2].quantity_available) - parseFloat(bspProforma2SeedInsertDataArray[index].quantity_sown))
                quantity_remaining: quantity_remaining - parseFloat(bspProforma2SeedInsertDataArray[index].quantity_recieved)
              };

              const updateDataTagDetail = {
                weight_used: bspProforma2SeedInsertDataArray[index].quantity_recieved,
                weight_remaining: tagRangeArray.length > 1 ? 0 : parseFloat(data.carry_over[key2].qty_available) - parseFloat(bspProforma2SeedInsertDataArray[index].quantity_recieved)
              };

              if (!updateDataTagDetail.weight_remaining) {
                updateDataTagDetail['is_used'] = 1;
              }

              index++;
              await seedInventoryTag.update(updateData, {
                where: {
                  id: bspProforma2SeedInsertDataBasic.lot_id,
                  lot_number: bspProforma2SeedInsertDataBasic.lot_no,
                }
              }).then(function (item) {
                carryOverSeedResponse = item['_previousDataValues'];
              }).catch(function (err) {
                console.log(err, 'er')
                returnResponse = {
                  error: err.message
                }
                console.log(returnResponse);
                response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
              });

              await seedInventoryTagDetail.update(updateDataTagDetail, {
                where: {
                  id: tagId,
                  tag_number: tagRage
                }
              }).then(function (item) {
                carryOverSeedResponse = item['_previousDataValues'];
              }).catch(function (err) {
                returnResponse = {
                  error: err.message
                }
                console.log(returnResponse);
                response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
              });
              const promise = new Promise((resolve) => {
                resolve(key2);
              });
              promisesV4.push(promise);
            }
            await Promise.all(promisesV4);
          }

        }
        let detailsCarry = {}
        for (const key2 in data.carry_over) {
          let bspProforma2SeedInsertDataBasic2 = {
            carry_over_seed_id: bsp_proforma_2_id,
            class: data.carry_over[key2].class_of_seed,
            lot_no: data.carry_over[key2].lot_name,
            lot_id: data.carry_over[key2].lot_no,
            season: data.carry_over[key2].season,
            stage_id: data.carry_over[key2].stage,
            year: data.carry_over[key2].year,
            tag_no: data.carry_over[key2].tag_no,
            tag_number: data.carry_over[key2].tag_number,
            tag_value: data.carry_over[key2].tag_quantity,
            tag_id: data.carry_over[key2].tag_id,
            quantity_available: (data.carry_over[key2].qty_available),
            quantity_recieved: (data.carry_over[key2].qty_recieved),
          };
          await db.carryOverSeedDetailsModel.create(bspProforma2SeedInsertDataBasic2).then(function (item) {
            detailsCarry = item['_previousDataValues'];
          }).catch(function (err) {
            returnResponse = {
              error: err.message
            }
            response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
          });
        }
        // console.log(detailsCarry, 'detailsCarry')
        let tagData = await db.carryOverSeedDetailsModel.findAll({
          where: {
            carry_over_seed_id: bsp_proforma_2_id
          },
          raw: true,
          attributes: ['tag_number', 'tag_value', 'id', 'lot_id', 'tag_id']

        })
        const outputArray = [];

        // Loop through the input array
        if (tagData && tagData.length > 0) {
          tagData.forEach(obj => {
            // Split tag numbers and values
            const tagNumbers = obj.tag_number.split(',');
            const tagValues = obj.tag_value.split(',');
            const tagIds = obj.tag_id.split(',');
            // Iterate through tag numbers and values
            tagNumbers.forEach((tagNo, index) => {
              // Create new object and push to output array
              outputArray.push({
                lot_id: obj.lot_id,
                tag_no: tagNo,
                tag_value: parseInt(tagValues[index]),
                id: obj.id,
                tag_id: parseInt(tagIds[index])
              });
            });
          });
        }
        let detailsCarryTag = {}
        if (outputArray && outputArray.length > 0) {
          for (const key3 in outputArray) {
            let bspProforma2SeedInsertDataBasicTag2 = {
              tag_id: outputArray[key3].tag_id,
              tag_no: outputArray[key3].tag_no,
              lot_id: outputArray[key3].lot_id,
              carry_over_seed_details_id: outputArray[key3].id,
              used_quantity: outputArray[key3].tag_value,
            };
            await db.carryOverSeedDetailsTagsModel.create(bspProforma2SeedInsertDataBasicTag2).then(function (item) {
              detailsCarryTag = item['_previousDataValues'];
            }).catch(function (err) {
              returnResponse = {
                error: err.message
              }
              response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
            });
          }
        }
      }
      response(res, status.DATA_SAVE, 200, returnResponse, internalCall);
    } catch (error) {
      console.log(error, 'error')
      returnResponse = {
        error: error.message
      }
      // console.log(returnResponse);
      response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }

  static getCarryOverList = async (req, res) => {
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

        let { page, pageSize } = req.body;

        if (!page) page = 1;
        let condition = {}
        condition = {
          include: [

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
              required: true,
              attributes: []
            },

            {
              model: db.carryOverSeedDetailsModel,
              // as: 'caryOverDetails',
              // on: {
              //   col1: sequelize.where(sequelize.col("carry_over_seed_detail.id"), "=", sequelize.col("caryOverDetails.carry_over_seed_id")),
              // },
              // required: true,
              attributes: []
            },
          ],
          where: {
            is_active: '1',
          },
          raw: true,
          attributes: [
            [sequelize.col('m_crop.crop_name'), 'crop_name'],
            'crop_code', 'variety_code', 'total_qty', 'id', 'meet_target', 'is_freezed',
            [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
            [sequelize.col('m_variety_line.line_variety_name'), 'line_variety_name'],
            [sequelize.col('m_variety_line.line_variety_code'), 'line_variety_code'],
            [sequelize.col('carry_over_seed_details.stage_id'), 'stage_id'],
            [sequelize.col('carry_over_seed_details.class'), 'class'],
            [sequelize.col('carry_over_seed_details.lot_no'), 'lot_no'],
            [sequelize.col('carry_over_seed_details.lot_id'), 'lot_id'],
            [sequelize.col('carry_over_seed_details.tag_no'), 'tag_no'],
            [sequelize.col('carry_over_seed_details.year'), 'year_of_indent'],
            [sequelize.col('carry_over_seed_details.season'), 'seasonValue'],
            [sequelize.col('carry_over_seed_details.quantity_recieved'), 'quantity_recieved'],
            [sequelize.col('carry_over_seed_details.quantity_available'), 'quantity_available'],


          ]
        };

        // const sortOrder = req.body.sort ? req.body.sort : 'id';
        // const sortDirection = req.body.order ? req.body.order : 'DESC';

        if (page && pageSize) {
          page = parseInt(page);
          condition.limit = parseInt(pageSize);
          condition.offset = (page * pageSize) - pageSize;
        }

        condition.order = [[sequelize.col('m_crop_variety.variety_name'), 'ASC']];

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

        const queryData = await db.carryOverSeedModel.findAndCountAll(condition);
        // console.log(queryData.rows)

        let totalRecord = queryData.count;
        const lastPage = totalRecord ? ((totalRecord % (pageSize) === 0 ? (totalRecord / (pageSize)) : (parseInt(totalRecord / (pageSize)) + 1))) : 0;
        let filterData = [];
        let directIndentVarietyListTotal;
        let bsp1VarietyListArr = [];
        let bsp1VarietyList;
        let directIndentVarietyListTotalArr = [];

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
                variety_line_code: queryData.rows[key].line_variety_code ? queryData.rows[key].line_variety_code : '',
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
                    variety_code_line: queryData.rows[key].line_variety_code ? queryData.rows[key].line_variety_code : '',
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
        if (queryData && queryData.rows && queryData.rows.length > 0) {

          queryData.rows.forEach((el, index) => {
            let varietyIndex;
            if (el && el.line_variety_code) {
              varietyIndex = filterData.findIndex(item => item.variety_code == el.variety_code && item.line_variety_code == el.line_variety_code);
            } else {
              varietyIndex = filterData.findIndex(item => item.variety_code == el.variety_code);
            }
            if (varietyIndex == -1) {
              filterData.push({
                variety_code: el && el.variety_code ? el.variety_code : "",
                id: el && el.id ? el.id : "",
                variety_name: el && el.variety_name ? el.variety_name : "",
                line_variety_name: el && el.line_variety_name ? el.line_variety_name : "",
                line_variety_code: el && el.line_variety_code ? el.line_variety_code : "",
                meet_target: el && el.meet_target ? el.meet_target : "",
                id: el && el.id ? el.id : "",
                total_qty: el && el.total_qty ? el.total_qty : "",
                is_freezed: el && el.is_freezed ? el.is_freezed : '',
                seed_class_details: [
                  {
                    year: el && el.year_of_indent ? el.year_of_indent : '',
                    season: el && el.seasonValue ? el.seasonValue : '',
                    stage: el && el.stage_id ? el.stage_id : '',
                    lot_id: el && el.lot_id ? el.lot_id : '',
                    lot_no: el && el.lot_no ? el.lot_no : '',
                    tag_no: el && el.tag_no ? el.tag_no : '',
                    quantity_recieved: el && el.quantity_recieved ? el.quantity_recieved : '',
                    quantity_available: el && el.quantity_available ? el.quantity_available : '',
                  }
                ]
              })
            }
            else {
              let classIndex = filterData[varietyIndex].seed_class_details.findIndex(item => item.year == el.year && item.season == el.seasonValue && item.lot_id == el.lot_id);
              if (classIndex == -1) {
                filterData[varietyIndex].seed_class_details.push({
                  year: el && el.year_of_indent ? el.year_of_indent : '',
                  season: el && el.seasonValue ? el.seasonValue : '',
                  stage: el && el.stage_id ? el.stage_id : '',
                  lot_id: el && el.lot_id ? el.lot_id : '',
                  lot_no: el && el.lot_no ? el.lot_no : '',
                  tag_no: el && el.tag_no ? el.tag_no : '',
                  quantity_recieved: el && el.quantity_recieved ? el.quantity_recieved : '',
                  quantity_available: el && el.quantity_available ? el.quantity_available : '',
                })
              } else {
                // filterData[varietyIndex].seed_class_details.push({
                //   tag_no: el && el.tag_no ? el.tag_no : ''
                // })
              }
            }


          })
        }
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
          returnResponse.bsp1VarietyListArr = bsp1VarietyListArr;
          returnResponse.directIndentVarietyListTotalArr = directIndentVarietyListTotalArr
          return response(res, status.DATA_AVAILABLE, 200, returnResponse, internalCall);
        }
      }
    } catch (error) {
      returnResponse = {
        error: error.message
      }
      console.log(error, 'err');
      response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }
  static getCarryOverVariety = async (req, res) => {
    let returnResponse = {};
    const { internalCall } = req.body;
    try {
      let rules = {
        'search.year': 'string',
        'search.season': 'string',
        'search.crop_code': 'string',
        'search.state_code': 'string',
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
      }

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

      let condition = {
        include: [
          {
            model: bspProformaOneBspc,
            required: true,
            attributes: [],
            where: {
              ...production_type
            }
          },

          {
            model: db.carryOverSeedModel,
            as: 'caryOver',
            required: false,
            where: {
              is_active: 1,
              ...production_type

            },
            attributes: []
          },
          {
            model: varietyModel,
            required: true,
            attributes: []
          },
          // {
          //   model: db.seedForProductionModel,
          //   as: 'seed_for_production',
          //   required: true,
          //   attributes: []
          // },
        ],
        where: {
          is_active: 1,
          ['$caryOver.id$']: null,
          ['$m_crop_variety.status$']: 'variety',

          // [Op.or]: [
          //   {
          //     ['$seed_for_production.nucleus_seed_available_qnt$']: {
          //       [Op.gt]: 0
          //     }
          //   },
          //   {
          //     [Op.and]: [
          //       {
          //         ['$seed_for_production.breeder_seed_available_qnt$']: {
          //           [Op.gt]: 0
          //         }

          //       },
          //       {
          //         ['$bsp_proforma_1_bspc.isPermission$']: true
          //       },
          //       {
          //         ['$bsp_proforma_1_bspc.isPermission$']: null
          //       }
          //     ]
          //   }

          // ]

        },
        group: ['bsp_proforma_1s.variety_code', 'm_crop_variety.variety_name', 'bsp_proforma_1s.variety_code'],
        raw: true,
        attributes: [
          [sequelize.col('bsp_proforma_1s.variety_code'), 'variety_code'],
          [sequelize.literal('SUM(bsp_proforma_1_bspc.target_qunatity)'), 'target_quantity'],
        ]
      };

      let condition4 = {
        include: [
          {
            model: bspProformaOneBspc,
            required: true,
            attributes: [],
            where: {
              ...production_type
            }
          },
          {
            model: db.carryOverSeedModel,
            as: 'caryOver',
            on: {
              col1: sequelize.where(sequelize.col("caryOver.variety_line_code"), "=", sequelize.col("bsp_proforma_1s.variety_line_code")),
            },
            required: false,
            where: {
              is_active: 1,
              ...production_type
            },
            attributes: []
          },
          {
            model: varietyModel,
            required: true,
            attributes: []
          },
          // {
          //   model: db.seedForProductionModel,
          //   as: 'seed_for_production',
          //   required: true,
          //   attributes: []
          // },
        ],
        where: {
          is_active: 1,
          ['$caryOver.id$']: null,
          ['$m_crop_variety.status$']: 'hybrid',
          // ...production_type
          // [Op.or]: [
          //   {
          //     ['$seed_for_production.nucleus_seed_available_qnt$']: {
          //       [Op.gt]: 0
          //     }
          //   },
          //   {
          //     [Op.and]: [
          //       {
          //         ['$seed_for_production.breeder_seed_available_qnt$']: {
          //           [Op.gt]: 0
          //         }

          //       },
          //       {
          //         ['$bsp_proforma_1_bspc.isPermission$']: true
          //       },
          //       {
          //         ['$bsp_proforma_1_bspc.isPermission$']: null
          //       }
          //     ]
          //   }

          // ]
        },
        group: ['bsp_proforma_1s.variety_code', 'm_crop_variety.variety_name', 'bsp_proforma_1s.variety_code'],
        raw: true,
        attributes: [
          [sequelize.col('bsp_proforma_1s.variety_code'), 'variety_code'],
          [sequelize.literal('SUM(bsp_proforma_1_bspc.target_qunatity)'), 'target_quantity'],
        ]
      };

      let condition2 = {
        include: [
          {
            model: bspProformaOneBspc,
            required: true,
            attributes: [],
            where: {
              ...production_type
            }
          },
          {
            model: db.carryOverSeedModel,
            as: 'caryOver',
            // on: {
            //   col1: sequelize.where(sequelize.col("caryOver.variety_line_code"), "=", sequelize.col("bsp_proforma_1s.variety_line_code")),
            // },
            required: false,
            where: {
              is_active: 1,
              ...production_type
            },
            attributes: []
          },
          // {
          //   model: bspPerformaBspTwo,
          //   as: 'bspOneTwoVC',
          //   required: false,
          //   where: {
          //     is_active: 1
          //   },
          //   attributes: []
          // },
          {
            model: varietyModel,
            required: true,
            attributes: []
          }
        ],
        where: {
          is_active: 1,
          // ...production_type
          // ['$bspOneTwoVC.id$'] : null
        },
        group: ['bsp_proforma_1s.variety_code', 'm_crop_variety.variety_name', 'bsp_proforma_1s.variety_code'],
        raw: true,
        attributes: [
          [sequelize.col('bsp_proforma_1s.variety_code'), 'variety_code'],
          [sequelize.literal('SUM(bsp_proforma_1_bspc.target_qunatity)'), 'target_quantity'],
        ]
      };

      let condition3 = {
        include: [
          // {
          //   model: bspPerformaBspTwo,
          //   as: 'directIndentVC',
          //   required: false,
          //   where: {
          //     is_active: 1
          //   },
          //   attributes: []
          // },
          {
            model: db.carryOverSeedModel,
            as: 'directIndentVC2',
            // on: {
            //   col1: sequelize.where(sequelize.col("caryOver.variety_line_code"), "=", sequelize.col("bsp_proforma_1s.variety_line_code")),
            // },
            required: false,
            where: {
              is_active: 1,
              year: {
                [Op.in]: req.body.search.year.toString().split(',')
              },
              season: {
                [Op.in]: req.body.search.season.toString().split(',')
              },
              ...production_type
            },
            attributes: []
          },
          {
            model: varietyModel,
            required: true,
            attributes: []
          }
        ],
        where: {
          is_active: 1,
          ['$directIndentVC2.id$']: null,
          // ...production_type
        },
        group: ['indent_of_breederseed_direct.variety_code', 'm_crop_variety.variety_name'],
        raw: true,
        attributes: [
          [sequelize.col('indent_of_breederseed_direct.variety_code'), 'variety_code'],
          [sequelize.literal('SUM(indent_of_breederseed_direct.quantity)'), 'quantity'],
        ]
      };

      let condition6 = {
        include: [
          {
            model: varietyModel,
            required: true,
            attributes: []
          }
        ],
        where: {
          is_active: 1,
        },
        group: ['indent_of_breederseed_direct.variety_code', 'm_crop_variety.variety_name'],
        raw: true,
        attributes: [
          [sequelize.col('indent_of_breederseed_direct.variety_code'), 'variety_code'],
          [sequelize.literal('SUM(indent_of_breederseed_direct.quantity)'), 'quantity'],
        ]
      };
      let condition7 = {
        include: [
          {
            model: bspProformaOneBspc,
            required: true,
            attributes: [],
            where: {
              ...production_type
            }
          },
          // {
          //   model: db.carryOverSeedModel,
          //   as: 'caryOver',
          //   // on: {
          //   //   col1: sequelize.where(sequelize.col("caryOver.variety_line_code"), "=", sequelize.col("bsp_proforma_1s.variety_line_code")),
          //   // },
          //   required: false,
          //   where: {
          //     is_active: 1
          //   },
          //   attributes: []
          // },
          // {
          //   model: bspPerformaBspTwo,
          //   as: 'bspOneTwoVC',
          //   required: false,
          //   where: {
          //     is_active: 1
          //   },
          //   attributes: []
          // },
          {
            model: varietyModel,
            required: true,
            attributes: []
          }
        ],
        where: {
          is_active: 1,
          // ...production_type
          // ['$bspOneTwoVC.id$'] : null
        },
        group: ['bsp_proforma_1s.variety_code', 'm_crop_variety.variety_name', 'bsp_proforma_1s.variety_code'],
        raw: true,
        attributes: [
          [sequelize.col('bsp_proforma_1s.variety_code'), 'variety_code'],
          [sequelize.literal('SUM(bsp_proforma_1_bspc.target_qunatity)'), 'target_quantity'],
        ]
      };
      if (req.body.search) {
        if (req.body.search.year) {
          condition.where.year = {
            [Op.in]: req.body.search.year.toString().split(',')
          };

          condition.include[1].where.year = {
            [Op.in]: req.body.search.year.toString().split(',')
          };

          condition4.where.year = {
            [Op.in]: req.body.search.year.toString().split(',')
          };

          condition4.include[1].where.year = {
            [Op.in]: req.body.search.year.toString().split(',')
          };

          condition2.where.year = {
            [Op.in]: req.body.search.year.toString().split(',')
          };
          condition7.where.year = {
            [Op.in]: req.body.search.year.toString().split(',')
          };

          // condition2.include[1].where.year = {
          //   [Op.in]: req.body.search.year.toString().split(',')
          // };

          condition3.where.year = {
            [Op.in]: req.body.search.year.toString().split(',')
          };

          condition6.where.year = {
            [Op.in]: req.body.search.year.toString().split(',')
          };
        }
        if (req.body.search.season) {
          condition.where.season = {
            [Op.in]: req.body.search.season.toString().split(',')
          };

          condition.include[1].where.season = {
            [Op.in]: req.body.search.season.toString().split(',')
          };

          condition4.where.season = {
            [Op.in]: req.body.search.season.toString().split(',')
          };

          condition4.include[1].where.season = {
            [Op.in]: req.body.search.season.toString().split(',')
          };

          condition2.where.season = {
            [Op.in]: req.body.search.season.toString().split(',')
          };

          // condition2.include[1].where.season = {
          //   [Op.in]: req.body.search.season.toString().split(',')
          // };

          condition3.where.season = {
            [Op.in]: req.body.search.season.toString().split(',')
          };

          condition6.where.season = {
            [Op.in]: req.body.search.season.toString().split(',')
          };
          condition7.where.season = {
            [Op.in]: req.body.search.season.toString().split(',')
          };

        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = {
            [Op.in]: req.body.search.crop_code.toString().split(',')
          };

          condition.include[1].where.crop_code = {
            [Op.in]: req.body.search.crop_code.toString().split(',')
          };

          condition4.where.crop_code = {
            [Op.in]: req.body.search.crop_code.toString().split(',')
          };

          condition4.include[1].where.crop_code = {
            [Op.in]: req.body.search.crop_code.toString().split(',')
          };

          condition2.where.crop_code = {
            [Op.in]: req.body.search.crop_code.toString().split(',')
          };

          // condition2.include[1].where.crop_code = {
          //   [Op.in]: req.body.search.crop_code.toString().split(',')
          // };

          condition3.where.crop_code = {
            [Op.in]: req.body.search.crop_code.toString().split(',')
          };

          condition6.where.crop_code = {
            [Op.in]: req.body.search.crop_code.toString().split(',')
          };
          condition7.where.crop_code = {
            [Op.in]: req.body.search.crop_code.toString().split(',')
          };
        }
        if (req.body.search.variety_code) {
          condition.where.variety_code = {
            [Op.in]: req.body.search.variety_code.toString().split(',')
          };

          condition.include[1].where.variety_code = {
            [Op.in]: req.body.search.variety_code.toString().split(',')
          };

          condition4.where.variety_code = {
            [Op.in]: req.body.search.variety_code.toString().split(',')
          };

          condition4.include[1].where.variety_code = {
            [Op.in]: req.body.search.variety_code.toString().split(',')
          };

          condition2.where.variety_code = {
            [Op.in]: req.body.search.variety_code.toString().split(',')
          };

          // condition2.include[1].where.variety_code = {
          //   [Op.in]: req.body.search.variety_code.toString().split(',')
          // };

          condition3.where.variety_code = {
            [Op.in]: req.body.search.variety_code.toString().split(',')
          };

          condition6.where.variety_code = {
            [Op.in]: req.body.search.variety_code.toString().split(',')
          };
          condition7.where.variety_code = {
            [Op.in]: req.body.search.variety_code.toString().split(',')
          };
        }
        if (req.body.search.user_id) {
          condition.where['$bsp_proforma_1_bspc.bspc_id$'] = {
            [Op.in]: req.body.search.user_id.toString().split(',')
          };
          condition.include[1].where.user_id = {
            [Op.in]: req.body.search.user_id.toString().split(',')
          };

          condition4.where['$bsp_proforma_1_bspc.bspc_id$'] = {
            [Op.in]: req.body.search.user_id.toString().split(',')
          };
          condition4.include[1].where.user_id = {
            [Op.in]: req.body.search.user_id.toString().split(',')
          };

          condition2.where['$bsp_proforma_1_bspc.bspc_id$'] = {
            [Op.in]: req.body.search.user_id.toString().split(',')
          };
          // condition2.include[1].where.user_id = {
          //   [Op.in]: req.body.search.user_id.toString().split(',')
          // };

          condition3.where.user_id = {
            [Op.in]: req.body.search.user_id.toString().split(',')
          };
          condition3.include[0].where.user_id = {
            [Op.in]: req.body.search.user_id.toString().split(',')
          };

          condition6.where.user_id = {
            [Op.in]: req.body.search.user_id.toString().split(',')
          };
          condition7.where['$bsp_proforma_1_bspc.bspc_id$'] = {
            [Op.in]: req.body.search.user_id.toString().split(',')
          };
        }
      }
      const carryOverData = await db.carryOverSeedModel.findAll({
        where: {
          year: {
            [Op.in]: req.body.search.year.toString().split(',')
          },
          season: {
            [Op.in]: req.body.search.season.toString().split(',')
          },
          crop_code: {
            [Op.in]: req.body.search.crop_code.toString().split(',')
          },
          user_id: {
            [Op.in]: req.body.search.user_id.toString().split(',')
          },
          ...production_type

        },
        raw: true,
        attributes: ['variety_line_code', 'variety_code']
      })
      console.log(carryOverData, 'carryOverDatacarryOverDatacarryOverData')

      condition.order = [[sequelize.col('variety_name'), 'asc']];
      condition4.order = [[sequelize.col('variety_name'), 'asc']];
      condition2.order = [[sequelize.col('variety_name'), 'asc']];
      condition3.order = [[sequelize.col('variety_name'), 'asc']];

      const normalVarietyList = await bspPerformaBspOne.findAll(condition);
      const hybridVarietyList = await bspPerformaBspOne.findAll(condition4);

      let bsp1VarietyList = await normalVarietyList.concat(hybridVarietyList);
      const nationalIndentVarietyList = await bspPerformaBspOne.findAll(condition2);
      const nationalIndentVarietyLists = await bspPerformaBspOne.findAll(condition7);
      console.log(nationalIndentVarietyList, 'nationalIndentVarietyList')
      const directIndentVarietyList = await directIndent.findAll(condition3);

      const directIndentVarietyListTotal = await directIndent.findAll(condition6);

      let nationalIndentQuantityArray = await nationalIndentVarietyList.map(x => x['target_quantity']);
      let nationalIndentVarietyListsArray = await nationalIndentVarietyLists.map(x => x['target_quantity']);
      // if(production_type=="NORMAL"){

      // }
      let directIndentQuantityArray = await directIndentVarietyListTotal.map(x => x['quantity']);
      console.log(nationalIndentVarietyListsArray, 'nationalIndentVarietyListsArray')
      if (nationalIndentQuantityArray && nationalIndentQuantityArray.length > 0) {
        nationalIndentQuantityArray = nationalIndentQuantityArray.reduce((acc, value) => {
          // Filter out NaN, null, undefined, and empty strings
          if (!isNaN(value) && value !== null && value !== undefined && value !== "") {
            acc.push(value);
          }
          return acc;
        }, []);
      }
      if (directIndentQuantityArray && directIndentQuantityArray.length > 0) {
        directIndentQuantityArray = directIndentQuantityArray.reduce((acc, value) => {
          // Filter out NaN, null, undefined, and empty strings
          if (!isNaN(value) && value !== null && value !== undefined && value !== "") {
            acc.push(value);
          }
          return acc;
        }, []);
      }
      const nationalIndentQuantity = await nationalIndentQuantityArray.reduce((accumulator, currentValue) => {
        return parseFloat(accumulator) + parseFloat(currentValue)
      }, 0);
      const nationalIndentQuantitys = await nationalIndentVarietyListsArray.reduce((accumulator, currentValue) => {
        return parseFloat(accumulator) + parseFloat(currentValue)
      }, 0);

      const directIndentQuantity = await directIndentQuantityArray.reduce((accumulator, currentValue) => {
        return parseFloat(accumulator) + parseFloat(currentValue)
      }, 0);

      // let mergedVarietyArray = await directIndentVarietyList.concat(bsp1VarietyList);
      // let mergedVarietyArray = await directIndentVarietyList.concat(bsp1VarietyList);
      let mergedVarietyArray = [];
      if (search && search.production_type == "NORMAL") {
        mergedVarietyArray = await directIndentVarietyList.concat(bsp1VarietyList);
      } else {
        mergedVarietyArray = bsp1VarietyList;
      }
      // if(production_type=="NORMAL"){
      mergedVarietyArray = await mergedVarietyArray.map(x => x['variety_code']);
      mergedVarietyArray = await mergedVarietyArray.filter((item, i, ar) => ar.indexOf(item) === i);
      // }

      const nationalIndentVarieties = await nationalIndentVarietyList.map(x => x['variety_code']);
      const directIndentVarieties = await directIndentVarietyListTotal.map(x => x['variety_code']);
      // let carryOverData= 
      // mergedVarietyArray=await mergedVarietyArray.concat(directIndentVarietyListTotal)
      // 
      let tempArray = [];
      if (search && search.production_type == "NORMAL") {
        tempArray = nationalIndentVarieties.concat(directIndentVarieties);
      } else {
        tempArray = nationalIndentVarieties
      }
      // console.log(tempArray,'directIndentVarietiesdirectIndentVarieties',directIndentVarieties)

      const uniqueNationalDirectVarieties = await tempArray.filter((item, i, ar) => ar.indexOf(item) === i);

      let condition5 = {
        include: [
        ],
        where: {
          variety_code: {
            [Op.in]: mergedVarietyArray
          },
          is_active: 1,
        },
        raw: true,
        attributes: [
          [sequelize.col('variety_code'), 'value'],
          [sequelize.col('variety_name'), 'display_text'],
          [sequelize.col('variety_code'), 'variety_code'],
          [sequelize.col('status'), 'variety_type'],
        ]
      };
      condition5.order = [[sequelize.col('variety_name'), 'asc']];
      const varietyList = await varietyModel.findAll(condition5);

      returnResponse = {
        totalVarieties: uniqueNationalDirectVarieties.length,
        varietyList: varietyList,
        varities_national: nationalIndentVarietyList.length,
        varities_direct: search && (search.production_type == "NORMAL") ? directIndentVarietyListTotal.length : 0,
        total_quantity_nationals: Math.round((nationalIndentQuantity + Number.EPSILON) * 100) / 100,
        total_quantity_direct: search && (search.production_type == "NORMAL") ? Math.round((directIndentQuantity + Number.EPSILON) * 100) / 100 : 0,
        total_quantity_national: Math.round((nationalIndentQuantitys + Number.EPSILON) * 100) / 100,
        total_targeted_quantity: null,
      };

      returnResponse.total_targeted_quantity = Math.round(((returnResponse.total_quantity_national + returnResponse.total_quantity_direct) + Number.EPSILON) * 100) / 100

      return response(res, status.DATA_AVAILABLE, 200, returnResponse, internalCall);
    } catch (error) {
      returnResponse = {
        error: error.message
      }
      console.log(returnResponse);
      response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }
  static getCarryOverVarietiesGrid = async (req, res) => {
    let returnResponse = {};
    const { internalCall } = req.body;
    try {
      let rules = {
        'search.year': 'string',
        'search.season': 'string',
        'search.crop_code': 'string',
        'search.state_code': 'string',
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
      }
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

      let condition = {
        include: [
          {
            model: varietyModel,
            required: true,
            attributes: []
          }
        ],
        where: {
          is_active: 1,
          ...production_type
        },
        group: ['carry_over_seed.variety_code', 'm_crop_variety.variety_name', 'm_crop_variety.status'],
        raw: true,
        attributes: [
          [sequelize.col('carry_over_seed.variety_code'), 'value'],
          [sequelize.literal('m_crop_variety.variety_name'), 'display_text'],
          // [sequelize.literal('m_crop_variety.status'), 'variety_type'],
          'carry_over_seed.variety_code',
          [sequelize.literal('m_crop_variety.status'), 'variety_type'],
        ]
      };

      if (req.body.search) {
        if (req.body.search.year) {
          condition.where.year = {
            [Op.in]: req.body.search.year.toString().split(',')
          };
        }
        if (req.body.search.season) {
          condition.where.season = {
            [Op.in]: req.body.search.season.toString().split(',')
          };
        }
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
        if (req.body.search.user_id) {
          condition.where.user_id = {
            [Op.in]: req.body.search.user_id.toString().split(',')
          };
        }
      }

      condition.order = [[sequelize.col('variety_name'), 'asc']];
      const varietyList = await db.carryOverSeedModel.findAll(condition);

      returnResponse = {
        count: varietyList.length,
        rows: varietyList
      };

      return response(res, returnResponse.count ? status.DATA_AVAILABLE : status.DATA_NOT_AVAILABLE, 200, returnResponse, internalCall);
    } catch (error) {
      returnResponse = {
        error: error.message
      }
      console.log(error);
      response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }
  static getCarryOverListEditById = async (req, res) => {
    let returnResponse = {};
    const { internalCall } = req.body;
    try {
      let rules = {
        'bspc_2_id': 'required|integer',
        'user_id': 'required|integer',
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
          where: {
            is_active: 1,
            // is_freezed: 0
          },
          raw: true,
          attributes: ['id', 'season', 'year', 'crop_code', 'variety_code', 'req_data', 'variety_line_code']
        };

        if (req.body) {
          if (req.body.bspc_2_id) {
            condition.where.id = (req.body.bspc_2_id);
          }
          if (req.body.user_id) {
            condition.where.user_id = (req.body.user_id);
          }
          if (req.body.variety_code) {
            condition.where.variety_code = (req.body.variety_code);
          }
        }

        const bspc2sData = await db.carryOverSeedModel.findOne(condition);

        if (bspc2sData && Object.keys(bspc2sData).length) {
          const bspc2sId = parseInt(req.body.bspc_2_id);

          const bspPerformaBspTwoSeedData = await db.carryOverSeedDetailsModel.findAll({
            // include:[
            //   {
            //     model:db.carryOverSeedDetailsTagsModel,
            //     attributes:[]
            //   }
            // ],
            where: {
              carry_over_seed_id: bspc2sId,
            },
            attributes: ['id', 'carry_over_seed_id', 'stage_id', 'class', 'season', 'year', 'tag_no',]
          });
          console.log(bspPerformaBspTwoSeedData, 'bspPerformaBspTwoSeedData')
          if (bspPerformaBspTwoSeedData && Object.keys(bspPerformaBspTwoSeedData).length) {
            returnResponse = {
              bspProforma2Data: bspc2sData,
              bspProforma2SeedData: bspPerformaBspTwoSeedData
            };

            response(res, status.DATA_AVAILABLE, 200, returnResponse, internalCall);
          } else {
            response(res, status.DATA_NOT_AVAILABLE, 400, bspc2sData, internalCall);
          }
        } else {
          response(res, status.DATA_NOT_AVAILABLE, 400, returnResponse, internalCall);
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
  static editCarryOverSeedById = async (req, res) => {
    let returnResponse = {};
    const { internalCall } = req.body;
    try {
      let rules = {
        'data.year': 'string',
        'data.season': 'string',
        'data.crop': 'string',
        'data.variety': 'string',
        'data.line_variety_code': 'string',
        'data.user_id': 'integer',
        'data.carry_over.*.class_of_seed': 'string',
        'data.carry_over.*.lot_no': 'string',
        'data.carry_over.*.stage': 'string',
        'data.carry_over.*.season': 'string',
        'data.carry_over.*.lot_no_id': 'string',
      };

      let validation = new Validator(req.body.data, rules);

      const isValidData = validation.passes();

      if (!isValidData) {
        console.log('isValidData', isValidData)
        returnResponse = {};
        for (let key in rules) {
          const error = validation.errors.get(key);
          if (error.length) {
            returnResponse[key] = error;
          }
        }
        return response(res, status.BAD_REQUEST, 400, returnResponse, internalCall);
      } else {
        console.log('hiii1')
        let productionType;
        console.log('eq.body.data.production_type', req.body.data.production_type);
        if (req.body.data.production_type) {
          productionType = {
            "production_type": req.body.data.production_type
          }
        }
        let condition = {
          where: {
            is_active: 1,
            // is_freezed: 0
            ...productionType
          },
          raw: true,
          attributes: ['id', 'season', 'year', 'crop_code', 'variety_code', 'variety_line_code', 'req_data']
        };

        if (req.body) {
          if (req.body.bspc_2_id) {
            condition.where.id = (req.body.bspc_2_id);
          }
          if (req.body.user_id) {
            condition.where.user_id = (req.body.user_id);
          }
        }

        const bspc2sData = await db.carryOverSeedModel.findOne(condition);
        if (!(bspc2sData && Object.keys(bspc2sData).length)) {
          console.log('7820')
          response(res, status.DATA_NOT_AVAILABLE, 400, returnResponse, internalCall);
        } else {

          const bspc2sId = parseInt(req.body.bspc_2_id);

          const bspPerformaBspTwoSeedData = await db.carryOverSeedDetailsModel.findAll({
            where: {
              carry_over_seed_id: bspc2sId,
            },
            raw: true,
            attributes: ['id', 'carry_over_seed_id', 'stage_id', 'class', 'season', 'year', 'tag_no', 'quantity_recieved', 'lot_id']
          });

          let bspPerformaBspTwoSeedDataId = [];
          bspPerformaBspTwoSeedData.forEach((el, i) => {
            // console.log(el,'bspPerformaBspTwoSeedData')
            bspPerformaBspTwoSeedDataId.push(el && el.id ? el.id : '')
          })
          bspPerformaBspTwoSeedDataId = [...new Set(bspPerformaBspTwoSeedDataId)]
          let bspPerformaBspTwoSeedData2;
          if (bspPerformaBspTwoSeedDataId && bspPerformaBspTwoSeedDataId.length) {

            bspPerformaBspTwoSeedData2 = await db.carryOverSeedDetailsTagsModel.findAll({
              where: {
                carry_over_seed_details_id: bspPerformaBspTwoSeedDataId,
              },
              raw: true,
              attributes: ['id', 'tag_id', 'tag_no', 'carry_over_seed_details_id', 'used_quantity', 'lot_id']
            });
          }
          const { data } = req.body;

          if (!(bspPerformaBspTwoSeedData && Object.keys(bspPerformaBspTwoSeedData).length) && (data && data.carry_over && data.carry_over.length > 0 && data.meet_target != 3)) {
            console.log(bspPerformaBspTwoSeedData, 'bspPerformaBspTwoSeedData')
            console.log('7852')
            response(res, status.DATA_NOT_AVAILABLE, 400, bspc2sData, internalCall);
          } else {

            const { data, user_id } = req.body;

            const date = moment().subtract(0, 'days');
            date.format('YYYY-MM-DD H:mm:ss');
            let queryCondition;
            const bspProforma2sUpdateData = {
              year: data && data.year ? data.year : null,
              season: data && data.season ? data.season : null,
              crop_code: data.crop,
              variety_code: data.variety,
              meet_target: data && data.meet_target ? data.meet_target : null,
              variety_line_code: data.line_variety_code,
              user_id: user_id,
              total_qty: data && data.total_breederseed ? parseFloat(data.total_breederseed) : null,
              req_data: (data),
              is_active: 1
            };
            if (bspProforma2sUpdateData.variety_line_code) {
              queryCondition = {
                where: {
                  year: bspProforma2sUpdateData.year,
                  season: bspProforma2sUpdateData.season,
                  crop_code: bspProforma2sUpdateData.crop_code,
                  variety_code: bspProforma2sUpdateData.variety_code,
                  user_id: bspProforma2sUpdateData.user_id,
                  is_active: 1,
                  variety_line_code: bspProforma2sUpdateData.variety_line_code,
                  id: {
                    [Op.ne]: bspc2sId
                  },
                  ...productionType
                }
              };
            } else {
              queryCondition = {
                where: {
                  year: bspProforma2sUpdateData.year,
                  season: bspProforma2sUpdateData.season,
                  crop_code: bspProforma2sUpdateData.crop_code,
                  variety_code: bspProforma2sUpdateData.variety_code,
                  user_id: bspProforma2sUpdateData.user_id,
                  is_active: 1,
                  id: {
                    [Op.ne]: bspc2sId
                  },
                  ...productionType
                }
              };
            }



            const existingFCData = await db.carryOverSeedModel.findOne(queryCondition);

            if (existingFCData) {
              console.log('7907')
              returnResponse = {
                field_code: ['Data already exists']
              };
              return response(res, status.BAD_REQUEST, 400, returnResponse, internalCall);
            }
            else {

              await db.carryOverSeedModel.update(bspProforma2sUpdateData, {
                where: {
                  id: req.body.bspc_2_id
                }
              }).then(function (item) {
              }).catch(function (err) {
                returnResponse = {
                  error: err.message
                }
                console.log(returnResponse);
                response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
              });
              if (data && data.carry_over && data.carry_over.length > 0 && data.meet_target != 3) {
                console.log('7927')

                const promises = [];
                for (let key in bspPerformaBspTwoSeedData) {
                  await db.carryOverSeedDetailsTagsModel.destroy({
                    where: {
                      lot_id: bspPerformaBspTwoSeedData[key].lot_id,
                      carry_over_seed_details_id: bspPerformaBspTwoSeedData[key].id,
                    }
                  }).then(function (item) {
                  }).catch(function (err) {
                    returnResponse = {
                      error: err.message
                    }
                    console.log(returnResponse);
                    response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
                  });
                }
                for (const key in bspPerformaBspTwoSeedData2) {
                  const lotData = await seedInventoryTag.findOne({
                    where: {
                      id: bspPerformaBspTwoSeedData2[key].lot_id
                    },
                    attributes: ['quantity', 'quantity_used', 'quantity_remaining', 'id']
                  });

                  const tagData = await seedInventoryTagDetail.findOne({
                    where: {
                      id: bspPerformaBspTwoSeedData2[key].tag_id
                    },
                    attributes: ['weight', 'weight_used', 'weight_remaining', 'id', 'is_used']
                  });

                  if (!tagData || !lotData) {
                    returnResponse = {
                      data: ['Tag/Lot Data Not Found.']
                    }
                    response(res, status.BAD_REQUEST, 400, returnResponse, internalCall);
                  }
                  else {
                    const lotUpdateData = {
                      quantity_used: 0,
                      quantity_remaining: sequelize.col('quantity')
                    };
                    const tagUpdateData = {
                      weight_used: 0,
                      weight_remaining: sequelize.col('weight'),
                      is_used: 0
                    };

                    await seedInventoryTag.update(lotUpdateData, {
                      where: {
                        id: bspPerformaBspTwoSeedData2[key].lot_id,
                      }
                    }).then(function (item) {
                    }).catch(function (err) {
                      returnResponse = {
                        error: err.message
                      }
                      console.log(returnResponse);
                      response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
                    });


                    await seedInventoryTagDetail.update(tagUpdateData, {
                      where: {
                        id: bspPerformaBspTwoSeedData2[key].tag_id,
                      }
                    }).then(function (item) {
                    }).catch(function (err) {
                      returnResponse = {
                        error: err.message
                      }
                      console.log(returnResponse);
                      response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
                    });

                  }
                  const promise = new Promise((resolve) => {
                    resolve(key);
                  });
                  promises.push(promise);
                }
                await Promise.all(promises);

                await db.carryOverSeedDetailsModel.destroy({
                  where: {
                    carry_over_seed_id: bspc2sId,
                  },
                });

                // reset existing seed data end

                let bspProforma2SeedInsertDataArray = [];
                let index = 0;

                const promisesV2 = [];
                for (const key2 in data.carryOver) {
                  const bspProforma2SeedInsertDataBasic = {
                    // bsp_proforma_2_id: bspc2sId,
                    // lot_id: data.quantity_data[key].lot_id,
                    // lot_number: data.quantity_data[key].lot_number,
                    // season: data.quantity_data[key].season,
                    // seed_class_id: data.quantity_data[key].seed_class_id,
                    // stage_id: data.quantity_data[key].stage_id,
                    // year: data.quantity_data[key].year,
                    // variety_line_code: data.quantity_data[key].variety_line_code ? data.quantity_data[key].variety_line_code : null,
                    carry_over_seed_id: bspc2sId,
                    class: data.carry_over[key2].class_of_seed,
                    lot_no: data.carry_over[key2].lot_name,
                    lot_id: data.carry_over[key2].lot_no,
                    season: data.carry_over[key2].season,
                    stage_id: data.carry_over[key2].stage,
                    year: data.carry_over[key2].year,
                    quantity_available: (data.carry_over[key2].qty_available),
                    quantity_recieved: (data.carry_over[key2].qty_recieved),
                  };


                  const tagRangeArray = data.carry_over[key2].tag_number.split(',');
                  const tagIdArray = data.carry_over[key2].tag_id.split(',');
                  const tagQuantityArray = data.carry_over[key2].tag_quantity.split(',');
                  const promisesV4 = [];
                  for (const key3 in tagRangeArray) {

                    const tagRage = tagRangeArray[key3];
                    const tagId = tagIdArray[key3];

                    bspProforma2SeedInsertDataArray[index] = {
                      // ...bspProforma2SeedInsertDataBasic,
                      // tag_range: tagRage,
                      // tag_id: tagId,
                      // quantity_sown: tagRangeArray.length > 1 ? tagQuantityArray[key3] : data.quantity_data[key].quantity_sown
                      ...bspProforma2SeedInsertDataBasic,
                      tag_range: tagRage,
                      tag_id: tagId,
                      quantity_sown: tagRangeArray.length > 1 ? tagQuantityArray[key3] : data.carryOver[key2].qty_recieved
                    };

                    let seedInventoryTagData = {};
                    await seedInventoryTag.findOne({
                      where: {
                        id: bspProforma2SeedInsertDataBasic.lot_id,
                        lot_number: bspProforma2SeedInsertDataBasic.lot_no,
                      },
                      attributes: ['quantity_used', 'quantity_remaining']
                    }).then(function (item) {
                      seedInventoryTagData = item['_previousDataValues'];
                    }).catch(function (err) {
                      returnResponse = {
                        error: err.message
                      }
                      console.log(returnResponse);
                      response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
                    });


                    const quantity_used = seedInventoryTagData && seedInventoryTagData.quantity_used ? parseFloat(seedInventoryTagData.quantity_used) : (seedInventoryTagData && seedInventoryTagData['dataValues'] && seedInventoryTagData['dataValues'].quantity_used ? parseFloat(seedInventoryTagData['dataValues'].quantity_used) : 0);
                    const quantity_remaining = seedInventoryTagData && seedInventoryTagData.quantity_remaining ? parseFloat(seedInventoryTagData.quantity_remaining) : (seedInventoryTagData && seedInventoryTagData['dataValues'] && seedInventoryTagData['dataValues'].quantity_remaining ? parseFloat(seedInventoryTagData['dataValues'].quantity_remaining) : 0);

                    const updateData = {
                      quantity_used: parseFloat(bspProforma2SeedInsertDataArray[index].quantity_recieved) + quantity_used,
                      // quantity_remaining: quantity_remaining - (tagRangeArray.length > 1 ? 0 : parseFloat(data[key].quantity_data[key2].quantity_available) - parseFloat(bspProforma2SeedInsertDataArray[index].quantity_sown))
                      quantity_remaining: quantity_remaining - parseFloat(bspProforma2SeedInsertDataArray[index].quantity_recieved)
                    };

                    const updateDataTagDetail = {
                      weight_used: bspProforma2SeedInsertDataArray[index].quantity_recieved,
                      weight_remaining: tagRangeArray.length > 1 ? 0 : parseFloat(data.carry_over[key].qty_available) - parseFloat(bspProforma2SeedInsertDataArray[index].quantity_recieved)
                    };

                    if (!updateDataTagDetail.weight_remaining) {
                      updateDataTagDetail['is_used'] = 1;
                    }

                    index++;
                    await seedInventoryTag.update(updateData, {
                      where: {
                        id: bspProforma2SeedInsertDataBasic.lot_id,
                        lot_number: bspProforma2SeedInsertDataBasic.lot_number,
                      }
                    }).then(function (item) {
                    }).catch(function (err) {
                      returnResponse = {
                        error: err.message
                      }
                      console.log(returnResponse);
                      response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
                    });

                    await seedInventoryTagDetail.update(updateDataTagDetail, {
                      where: {
                        id: tagId,
                        tag_number: tagRage
                      }
                    }).then(function (item) {
                    }).catch(function (err) {
                      returnResponse = {
                        error: err.message
                      }
                      console.log(returnResponse);
                      response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
                    });

                    const promise = new Promise((resolve) => {
                      resolve(key);
                    });
                    promisesV4.push(promise);
                  }
                  await Promise.all(promisesV4);

                  // const promise = new Promise((resolve) => {
                  //   resolve(key);
                  // });
                  // promisesV2.push(promise);
                }
                // await Promise.all(promisesV2);

                let detailsCarry = {}
                for (const key2 in data.carry_over) {
                  let bspProforma2SeedInsertDataBasic2 = {
                    carry_over_seed_id: bspc2sId,
                    class: data.carry_over[key2].class_of_seed,
                    lot_no: data.carry_over[key2].lot_name,
                    lot_id: data.carry_over[key2].lot_no,
                    season: data.carry_over[key2].season,
                    stage_id: data.carry_over[key2].stage,
                    year: data.carry_over[key2].year,
                    tag_no: data.carry_over[key2].tag_no,
                    tag_number: data.carry_over[key2].tag_number,
                    tag_value: data.carry_over[key2].tag_quantity,
                    tag_id: data.carry_over[key2].tag_id,
                    quantity_available: (data.carry_over[key2].qty_available),
                    quantity_recieved: (data.carry_over[key2].qty_recieved),
                  };
                  await db.carryOverSeedDetailsModel.create(bspProforma2SeedInsertDataBasic2).then(function (item) {
                    detailsCarry = item['_previousDataValues'];
                  }).catch(function (err) {
                    returnResponse = {
                      error: err.message
                    }
                    response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
                  });
                }
                let tagData = await db.carryOverSeedDetailsModel.findAll({
                  where: {
                    carry_over_seed_id: bspc2sId
                  },
                  raw: true,
                  attributes: ['tag_number', 'tag_value', 'id', 'lot_id', 'tag_id', 'quantity_recieved', 'tag_no']

                })
                const outputArray = [];
                if (tagData && tagData.length > 0) {
                  tagData.forEach(obj => {
                    // Split tag numbers and values
                    const tagNumbers = obj.tag_number.split(',');
                    let quantity_recieved
                    if (obj && obj.tag_no.length > 1) {
                      quantity_recieved = obj && obj.tag_value ? obj.tag_value.toString().split(',') : '';
                    } else {
                      quantity_recieved = obj && obj.quantity_recieved ? obj.quantity_recieved.toString().split(',') : '';
                    }
                    const tagIds = obj.tag_id.split(',');
                    // Iterate through tag numbers and values
                    tagNumbers.forEach((tagNo, index) => {
                      // Create new object and push to output array
                      outputArray.push({
                        lot_id: obj.lot_id,
                        tag_no: tagNo,
                        quantity_recieved: parseInt(quantity_recieved[index]),
                        id: obj.id,
                        tag_id: parseInt(tagIds[index])
                      });
                    });
                  });
                }
                let detailsCarryTag = {}
                console.log('outputArray', outputArray)
                if (outputArray && outputArray.length > 0) {
                  for (const key3 in outputArray) {
                    let bspProforma2SeedInsertDataBasicTag2 = {
                      tag_id: outputArray[key3].tag_id,
                      tag_no: outputArray[key3].tag_no,
                      lot_id: outputArray[key3].lot_id,
                      carry_over_seed_details_id: outputArray[key3].id,
                      used_quantity: outputArray[key3].quantity_recieved,
                    };
                    await db.carryOverSeedDetailsTagsModel.create(bspProforma2SeedInsertDataBasicTag2).then(function (item) {
                      detailsCarryTag = item['_previousDataValues'];
                    }).catch(function (err) {
                      returnResponse = {
                        error: err.message
                      }
                      response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
                    });
                  }
                  for (let key3 in outputArray) {
                    const tagData = await seedInventoryTagDetail.findOne({
                      where: {
                        id: outputArray[key3].tag_id
                      },
                      attributes: ['weight', 'weight_used', 'weight_remaining', 'id', 'is_used']
                    });
                    const lotData = await seedInventoryTag.findOne({
                      where: {
                        id: outputArray[key3].lot_id
                      },
                      attributes: ['quantity', 'quantity_used', 'quantity_remaining', 'id']
                    });
                    if (!tagData || !lotData) {
                      returnResponse = {
                        data: ['Tag/Lot Data Not Found.']
                      }
                      response(res, status.BAD_REQUEST, 400, returnResponse, internalCall);
                    }
                    else {
                      const lotUpdateData = {
                        quantity_used: parseFloat(lotData.quantity_used) + parseFloat(outputArray[key3].quantity_recieved),
                        quantity_remaining: parseFloat(lotData.quantity_remaining) - parseFloat(outputArray[key3].quantity_recieved),
                      };
                      const tagUpdateData = {
                        weight_used: outputArray[key3].quantity_recieved,
                        weight_remaining: parseFloat(tagData.weight_remaining) - parseFloat(outputArray[key3].quantity_recieved),
                        is_used: 0
                      };

                      if (!tagUpdateData.weight_remaining) {
                        tagUpdateData['is_used'] = 1;
                      }
                      // await seedInventoryTag.update(lotUpdateData, {
                      //   where: {
                      //     id: outputArray[key3].lot_id,
                      //   }
                      // }).then(function (item) {
                      // }).catch(function (err) {
                      //   returnResponse = {
                      //     error: err.message
                      //   }
                      //   console.log(returnResponse);
                      //   response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
                      // });
                      await seedInventoryTagDetail.update(tagUpdateData, {
                        where: {
                          id: outputArray[key3].tag_id,
                        }
                      }).then(function (item) {
                      }).catch(function (err) {
                        returnResponse = {
                          error: err.message
                        }
                        console.log(returnResponse);
                        response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
                      });

                    }
                  }
                  for (let key4 in data.carry_over) {
                    let bspProforma2SeedInsertDataBasic2 = {
                      // carry_over_seed_id: bspc2sId,
                      class: data.carry_over[key4].class_of_seed,
                      lot_no: data.carry_over[key4].lot_name,
                      lot_id: data.carry_over[key4].lot_no,
                      season: data.carry_over[key4].season,
                      stage_id: data.carry_over[key4].stage,
                      year: data.carry_over[key4].year,
                      tag_no: data.carry_over[key4].tag_no,
                      tag_number: data.carry_over[key4].tag_number,
                      tag_value: data.carry_over[key4].tag_quantity,
                      tag_id: data.carry_over[key4].tag_id,
                      quantity_available: (data.carry_over[key4].qty_available),
                      quantity_recieved: (data.carry_over[key4].qty_recieved),
                    };

                    const lotData = await seedInventoryTag.findOne({
                      where: {
                        id: bspProforma2SeedInsertDataBasic2.lot_id
                      },
                      attributes: ['quantity', 'quantity_used', 'quantity_remaining', 'id']
                    });
                    if (!lotData) {
                      returnResponse = {
                        data: ['Tag/Lot Data Not Found.']
                      }
                      response(res, status.BAD_REQUEST, 400, returnResponse, internalCall);
                    }
                    else {
                      const lotUpdateData = {
                        quantity_used: parseFloat(lotData.quantity_used) + parseFloat(bspProforma2SeedInsertDataBasic2.quantity_recieved),
                        quantity_remaining: parseFloat(lotData.quantity_remaining) - parseFloat(bspProforma2SeedInsertDataBasic2.quantity_recieved),
                      };
                      console.log(lotUpdateData, 'lotUpdateData')
                      await seedInventoryTag.update(lotUpdateData, {
                        where: {
                          id: bspProforma2SeedInsertDataBasic2.lot_id,
                        }
                      }).then(function (item) {
                      }).catch(function (err) {
                        returnResponse = {
                          error: err.message
                        }
                        console.log(returnResponse);
                        response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
                      });


                    }
                  }


                }
              }
              // await db.carryOverSeedDetailsModel.bulkCreate(bspProforma2SeedInsertDataArray).catch(function (err) {
              //   returnResponse = {
              //     error: err.message
              //   }
              //   response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
              // });

              // await db.carryOverSeedDetailsModel.update(bspProforma2sUpdateData, {
              //   where: {
              //     id: bspc2sId
              //   }
              // });

              response(res, status.DATA_UPDATED, 200, returnResponse, internalCall);
            }
          }
        }
        // }
      }
    } catch (error) {
      returnResponse = {
        error: error.message
      }
      console.log(error);
      response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }
  static deleteCarryData = async (req, res) => {
    try {

      let data = await db.carryOverSeedDetailsModel.findAll({
        where: {
          carry_over_seed_id: req.body.bspc_2_id
        },
        attributes: ['id', 'lot_id'],
        raw: true
      });
      let seedDetailId = []
      let seedDetailLotId = []
      // console.log(data,'data')
      data.forEach((el, i) => {
        seedDetailId.push(el && el.id ? el.id : '');
        seedDetailLotId.push(el && el.lot_id ? el.lot_id : '');
      })

      let datas = await db.carryOverSeedDetailsTagsModel.findAll({
        where: {
          carry_over_seed_details_id: {
            [Op.in]: seedDetailId
          }
        },
        attributes: ['id', 'lot_id', 'tag_id'],
        raw: true
      });
      if (req.body.meet_target != 3) {
        // 
        for (let key in datas) {
          let dataValue = await db.seedInventoryTagDetails.update({
            weight_remaining: sequelize.col('weight'),
            weight_used: 0,
            is_used: 0
          }, {
            where: {
              id: datas[key].tag_id

            },

            raw: true
          });
        }

        for (let key in datas) {
          let dataValue = await db.seedInventoryTag.update({
            quantity_remaining: sequelize.col('quantity'),
            quantity_used: 0,
          }, {
            where: {
              id: datas[key].lot_id

            },

            raw: true
          });
        }
      }
      db.carryOverSeedModel.destroy({
        where: {
          id: req.body.bspc_2_id
        }
      });
      if (req.body.meet_target != 3) {
        db.carryOverSeedDetailsModel.destroy({
          where: {
            carry_over_seed_id: req.body.bspc_2_id
          }
        });
        for (let key in datas) {

          db.carryOverSeedDetailsTagsModel.destroy({

            where: {
              id: datas[key].id
            }

          });
        }
      }

      response(res, status.DATA_DELETED, 200, {});
    }
    catch (error) {
      console.log(error, 'error')
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    }
  }
  static getClassQuantity = async (req, res) => {
    let returnResponse = {};
    const { internalCall } = req.body;
    try {
      let rules = {
        'search.year': 'string',
        'search.season': 'string',
        'search.crop_code': 'string',
        'search.state_code': 'string',
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
      }

      let condition = {
        include: [
          {
            model: seedInventoryTag,
            attributes: []
          }
        ],

        raw: true,
        where: {
          crop_code: req.body.search.crop_code.toString().split(','),
          seed_class_id: 6
        },
        attributes: [
          [sequelize.fn('SUM', sequelize.col('seed_inventries_tag.quantity')), 'quantity'],
          //   [sequelize.col('bsp_proforma_1s.variety_code'), 'variety_code'],
          [sequelize.col('seed_inventries.seed_class_id'), 'seed_class_id'],
          // [sequelize.col('seed_inventries_tag.quantity'), 'quantity'],
        ],
        group: [
          [sequelize.col('seed_inventries.seed_class_id'), 'seed_class_id']
        ]
      };
      let condition2 = {
        include: [
          {
            model: seedInventoryTag,
            attributes: []
          }
        ],

        raw: true,
        where: {
          crop_code: req.body.search.crop_code.toString().split(','),
          seed_class_id: 7
        },
        attributes: [
          [sequelize.fn('SUM', sequelize.col('seed_inventries_tag.quantity')), 'quantity'],
          //   [sequelize.col('bsp_proforma_1s.variety_code'), 'variety_code'],
          [sequelize.col('seed_inventries.seed_class_id'), 'seed_class_id'],
          // [sequelize.col('seed_inventries.seed_class_id'), 'seed_class_id'],
          // [sequelize.col('seed_inventries_tag.quantity'), 'quantity'],
        ],
        group: [
          [sequelize.col('seed_inventries.seed_class_id'), 'seed_class_id']
        ]
      };
      let condition3 = {
        include: [
          {
            model: bspProformaOneBspc,
            attributes: []
          }
        ],
        raw: true,
        where: {
          variety_code: {
            [Op.in]: req.body.search.variety_code.toString().split(',')
          }
        },
        attributes: [
          [sequelize.col('bsp_proforma_1_bspc.isPermission'), 'isPermission']
        ]

      }


      if (req.body.search) {
        if (req.body.search.variety_code) {
          condition.where.variety_code = {
            [Op.in]: req.body.search.variety_code.toString().split(',')
          };
          condition2.where.variety_code = {
            [Op.in]: req.body.search.variety_code.toString().split(',')
          };
          condition3.where.variety_code = {
            [Op.in]: req.body.search.variety_code.toString().split(',')
          };

        }
        if (req.body.search.user_id) {
          condition.where.bspc_id = {
            [Op.in]: req.body.search.user_id.toString().split(',')
          };
          condition2.where.bspc_id = {
            [Op.in]: req.body.search.user_id.toString().split(',')
          };
          condition3.where['$bsp_proforma_1_bspc.bspc_id$'] = {
            [Op.in]: req.body.search.user_id.toString().split(',')
          };
        }
        if (req.body.search.variety_line_code) {
          condition.where.line_variety_code = {
            [Op.in]: req.body.search.variety_line_code.toString().split(',')
          };
          condition2.where.line_variety_code = {
            [Op.in]: req.body.search.variety_line_code.toString().split(',')
          };
          condition3.where.variety_line_code = {
            [Op.in]: req.body.search.variety_line_code.toString().split(',')
          };
        }


        let data = await seedInventory.findAll(condition)
        let dataNucleusQty = await seedInventory.findAll(condition2)
        let permisionData = await bspPerformaBspOne.findAll(condition3)
        let responsData = {
          nucleusData: data,
          breederData: dataNucleusQty,
          permisionData: permisionData
        }

        return response(res, status.DATA_AVAILABLE, 200, responsData, internalCall);
      }
      let data = await bspPerformaBspOne.findAll(condition)
      response(res, status.DATA_AVAILABLE, 200, data, internalCall)
    } catch (error) {
      returnResponse = {
        error: error.message
      }
      console.log(returnResponse);
      response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }
  static FreezeDataCarryOver = async (req, res) => {
    try {
      const { bspc_2_ids, user_id } = req.body;
      console.log(bspc_2_ids, 'bspc_2_ids')

      const data = await db.carryOverSeedModel.update(
        {
          is_freezed: 1
        },
        {
          where: {
            id: {
              [Op.in]: (req.body.bspc_2_ids).toString().split(',')
            },
            user_id: user_id
          }
        }
      )

      response(res, status.DATA_UPDATED, 200, {});
    }
    catch (error) {
      console.log(error, 'error')
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    }
  }
  static getVarietiesParentalLineForCarryOver = async (req, res) => {
    let returnResponse = {};
    const { internalCall } = req.body;
    try {
      let rules = {
        'search.year': 'string',
        'search.season': 'string',
        'search.crop_code': 'string',
        'search.state_code': 'string',
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
      }
      let condition3 = {
        where: {
          year: req.body.search.year.toString().split(',')
        },
        attributes: ['variety_line_code'],
        raw: true
      }

      let condition4 = {
        include: [
          {
            model: bspProformaOneBspc,
            required: true,
            attributes: []
          },
          {
            model: db.carryOverSeedModel,
            as: 'bsp2CarryOver',
            on: {
              col1: sequelize.where(sequelize.col("bsp2CarryOver.variety_line_code"), "=", sequelize.col("bsp_proforma_1s.variety_line_code")),
            },
            required: false,
            where: {
              is_active: 1,

            },
            attributes: []
          },
          {
            model: varietyModel,
            required: true,
            attributes: []
          },
          {
            model: db.varietLineModel,
            on: {
              col1: sequelize.where(sequelize.col("m_variety_line.line_variety_code"), "=", sequelize.col("bsp_proforma_1s.variety_line_code")),
            },
            required: false,
            where: {
            },
            attributes: []
          },
        ],
        where: {
          is_active: 1,
          ['$bsp2CarryOver.id$']: null,
          ['$m_crop_variety.status$']: 'hybrid'
        },
        group: ['m_variety_line.line_variety_name', 'bsp_proforma_1s.variety_line_code', 'm_crop_variety.variety_name', 'bsp_proforma_1s.variety_code'],
        raw: true,
        attributes: [
          [sequelize.col('bsp_proforma_1s.variety_line_code'), 'value'],
          [sequelize.col('m_variety_line.line_variety_name'), 'display_text'],
          [sequelize.col('m_variety_line.line_variety_name'), 'line_variety_name'],
          [sequelize.col('bsp_proforma_1s.variety_line_code'), 'value'],
          [sequelize.col('bsp_proforma_1s.variety_code'), 'variety_code'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
        ]
      };

      let condition2 = {
        include: [
          {
            model: indentOfBrseedDirectLineModel,
            where: {
              quantity: {
                [Op.gt]: 0

              }
            },
            include: [
              {
                model: db.varietLineModel,
                // on: {
                //   col1: sequelize.where(sequelize.col("m_variety_line.line_variety_code"), "=", sequelize.col("indent_of_brseed_direct_line.variety_line_code")),
                // },
                required: false,
                where: {
                },
                attributes: []
              },
            ],
            required: true,
            attributes: []
          },
          {
            model: db.carryOverSeedModel,
            as: 'directCarryOver',
            on: {
              col1: sequelize.where(sequelize.col("directCarryOver.variety_line_code"), "=", sequelize.col("indent_of_brseed_direct_line.variety_code_line")),
            },
            required: false,
            where: {
              is_active: 1
            },
            attributes: []
          },
          {
            model: varietyModel,
            required: true,
            attributes: []
          },

        ],

        where: {
          is_active: 1,
          // ['$directCarryOver.id$']: null,
          ['$m_crop_variety.status$']: 'hybrid',
          year: {
            [Op.in]: req.body.search.year.toString().split(',')
          }
        },
        raw: true,
        group: ['indent_of_brseed_direct_line->m_variety_lines.line_variety_name', 'indent_of_brseed_direct_line.variety_code_line', 'm_crop_variety.variety_name', 'indent_of_breederseed_direct.variety_code'],
        raw: true,
        attributes: [
          [sequelize.col('indent_of_brseed_direct_line.variety_code_line'), 'value'],
          [sequelize.col('indent_of_brseed_direct_line->m_variety_lines.line_variety_name'), 'display_text'],
          [sequelize.col('indent_of_brseed_direct_line->m_variety_lines.line_variety_name'), 'line_variety_name'],
          [sequelize.col('indent_of_brseed_direct_line.variety_code_line'), 'value'],
          [sequelize.col('indent_of_breederseed_direct.variety_code'), 'variety_code'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
        ]
        // attributes: [
        //   // [sequelize.col('bsp_proforma_1s.variety_code'), 'variety_code'],
        //   [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
        // ]
      }

      if (req.body.search) {
        if (req.body.search.year) {

          condition4.where.year = {
            [Op.in]: req.body.search.year.toString().split(',')
          };

          condition4.include[1].where.year = {
            [Op.in]: req.body.search.year.toString().split(',')
          };
          // condition3.where.year = {
          //   [Op.in]: req.body.search.year.toString().split(',')
          // };

          // condiion2.where.year = {
          //   [Op.in]: req.body.search.year.toString().split(',')
          // };

        }
        if (req.body.search.season) {
          condition4.where.season = {
            [Op.in]: req.body.search.season.toString().split(',')
          };

          condition4.include[1].where.season = {
            [Op.in]: req.body.search.season.toString().split(',')
          };
          condition2.where.season = {
            [Op.in]: req.body.search.season.toString().split(',')
          };
          condition3.where.season = {
            [Op.in]: req.body.search.season.toString().split(',')
          };
        }
        if (req.body.search.crop_code) {

          condition4.where.crop_code = {
            [Op.in]: req.body.search.crop_code.toString().split(',')
          };

          condition4.include[1].where.crop_code = {
            [Op.in]: req.body.search.crop_code.toString().split(',')
          };
          condition2.where.crop_code = {
            [Op.in]: req.body.search.crop_code.toString().split(',')
          };
          condition3.where.crop_code = {
            [Op.in]: req.body.search.crop_code.toString().split(',')
          };
        }
        if (req.body.search.variety_code) {

          condition4.where.variety_code = {
            [Op.in]: req.body.search.variety_code.toString().split(',')
          };

          condition4.include[1].where.variety_code = {
            [Op.in]: req.body.search.variety_code.toString().split(',')
          };
          condition2.where.variety_code = {
            [Op.in]: req.body.search.variety_code.toString().split(',')
          };

          condition3.where.variety_code = {
            [Op.in]: req.body.search.variety_code.toString().split(',')
          };

        }
        if (req.body.search.user_id) {

          condition4.where['$bsp_proforma_1_bspc.bspc_id$'] = {
            [Op.in]: req.body.search.user_id.toString().split(',')
          };
          condition4.include[1].where.user_id = {
            [Op.in]: req.body.search.user_id.toString().split(',')
          };
          condition2.where.user_id = {
            [Op.in]: req.body.search.user_id.toString().split(',')
          };
          condition3.where.user_id = {
            [Op.in]: req.body.search.user_id.toString().split(',')
          };
        }
      }

      condition4.order = [[sequelize.col('variety_name'), 'asc']];

      const hybridVarietyList = await bspPerformaBspOne.findAll(condition4);
      const listData = await db.carryOverSeedModel.findAll(condition3);
      const hybridVarietyList2 = await directIndent.findAll(condition2);
      let lineList = [];
      let lineListData = [];
      if (listData && listData.length > 0) {
        listData.forEach((el) => {
          lineListData.push(el && el.variety_line_code ? el.variety_line_code : "")
        })
        lineListData = lineListData.filter(x => x != '')
        lineListData = [...new Set(lineListData)]
      }

      if (hybridVarietyList && hybridVarietyList.length > 0) {
        hybridVarietyList.forEach((el) => {
          lineList.push(el && el.value ? el.value : '')
        })
      }

      if (hybridVarietyList2 && hybridVarietyList2.length > 0) {

        hybridVarietyList2.forEach((el) => {
          lineList.push(el && el.value ? el.value : '')
        })
      }
      lineList = lineList.filter(item => !lineListData.includes(item));

      let data = await db.varietyLinesModel.findAll({
        where: {
          line_variety_code: {
            [Op.in]: lineList
          }
        },
        attributes: [
          [sequelize.col("m_variety_lines.variety_code"), 'variety_code'],
          [sequelize.col('m_variety_lines.line_variety_code'), 'value'],
          [sequelize.col('m_variety_lines.line_variety_name'), 'display_text'],
          [sequelize.col('m_variety_lines.line_variety_name'), 'line_variety_name'],
          // [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
        ]
      })
      lineList = [...new Set(lineList)];

      returnResponse = data

      response(res, returnResponse.length ? status.DATA_AVAILABLE : status.DATA_NOT_AVAILABLE, 200, returnResponse, internalCall);
    } catch (error) {
      returnResponse = {
        error: error.message
      }
      console.log(error);
      response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }

  static getVarietiesParentalLineV1 = async (req, res) => {
    let returnResponse = {};
    const { internalCall } = req.body;
    try {
      let rules = {
        'search.year': 'string',
        'search.season': 'string',
        'search.crop_code': 'string',
        'search.state_code': 'string',
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
      }

      let condition4 = {
        include: [
          {
            model: bspProformaOneBspc,
            required: true,
            attributes: []
          },
          {
            model: bspPerformaBspTwo,
            as: 'bspOneTwoVC',
            on: {
              col1: sequelize.where(sequelize.col("bspOneTwoVC.variety_line_code"), "=", sequelize.col("bsp_proforma_1s.variety_line_code")),
            },
            required: false,
            where: {
              is_active: 1
            },
            attributes: []
          },
          {
            model: varietyModel,
            required: true,
            attributes: []
          },
          {
            model: db.varietLineModel,
            on: {
              col1: sequelize.where(sequelize.col("m_variety_line.line_variety_code"), "=", sequelize.col("bsp_proforma_1s.variety_line_code")),
            },
            required: false,
            where: {
            },
            attributes: []
          },
        ],
        where: {
          is_active: 1,
          ['$bspOneTwoVC.id$']: null,
          ['$m_crop_variety.status$']: 'hybrid'
        },
        group: ['m_variety_line.line_variety_name', 'bsp_proforma_1s.variety_line_code', 'm_crop_variety.variety_name', 'bsp_proforma_1s.variety_code'],
        raw: true,
        attributes: [
          [sequelize.col('bsp_proforma_1s.variety_line_code'), 'value'],
          [sequelize.col('m_variety_line.line_variety_name'), 'display_text'],
          [sequelize.col('m_variety_line.line_variety_name'), 'line_variety_name'],
          [sequelize.col('bsp_proforma_1s.variety_line_code'), 'value'],
          [sequelize.col('bsp_proforma_1s.variety_code'), 'variety_code'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
        ]
      };

      if (req.body.search) {
        if (req.body.search.year) {

          condition4.where.year = {
            [Op.in]: req.body.search.year.toString().split(',')
          };

          condition4.include[1].where.year = {
            [Op.in]: req.body.search.year.toString().split(',')
          };

        }
        if (req.body.search.season) {
          condition4.where.season = {
            [Op.in]: req.body.search.season.toString().split(',')
          };

          condition4.include[1].where.season = {
            [Op.in]: req.body.search.season.toString().split(',')
          };
        }
        if (req.body.search.crop_code) {

          condition4.where.crop_code = {
            [Op.in]: req.body.search.crop_code.toString().split(',')
          };

          condition4.include[1].where.crop_code = {
            [Op.in]: req.body.search.crop_code.toString().split(',')
          };
        }
        if (req.body.search.variety_code) {

          condition4.where.variety_code = {
            [Op.in]: req.body.search.variety_code.toString().split(',')
          };

          condition4.include[1].where.variety_code = {
            [Op.in]: req.body.search.variety_code.toString().split(',')
          };
        }
        if (req.body.search.user_id) {

          condition4.where['$bsp_proforma_1_bspc.bspc_id$'] = {
            [Op.in]: req.body.search.user_id.toString().split(',')
          };
          condition4.include[1].where.user_id = {
            [Op.in]: req.body.search.user_id.toString().split(',')
          };
        }
      }

      condition4.order = [[sequelize.col('variety_name'), 'asc']];

      const hybridVarietyList = await bspPerformaBspOne.findAll(condition4);

      returnResponse = hybridVarietyList

      response(res, returnResponse.length ? status.DATA_AVAILABLE : status.DATA_NOT_AVAILABLE, 200, returnResponse, internalCall);
    } catch (error) {
      returnResponse = {
        error: error.message
      }
      console.log(returnResponse);
      response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }

  static getBspOnePerformaYearData = async (req, res) => {
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

      let responseData = await db.carryOverSeedModel.findAll({
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('carry_over_seed.year')), 'year'],
        ],
        where: {
          is_freezed: 1,
          is_active: 1,
          user_id: req.body.loginedUserid.id,
          meet_target: {
            [Op.ne]: 1
          },
          ...production_type

        },
        order: [['year', 'DESC']]
      })
      if (responseData) {
        return response(res, status.DATA_AVAILABLE, 200, responseData)
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 200, {})
      }

    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500, error)
    }
  }
  static getBspOnePerformaSeason = async (req, res) => {
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
      let responseData = await db.carryOverSeedModel.findAll({
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('carry_over_seed.season')), 'season'],
        ],
        where: {
          is_freezed: 1,
          is_active: 1,
          year: req.body.search.year,
          user_id: req.body.loginedUserid.id,
          meet_target: {
            [Op.ne]: 1
          },
          ...production_type

        },
        order: [
          [sequelize.col('carry_over_seed.season'), 'ASC']

        ]
      })
      if (responseData) {
        return response(res, status.DATA_AVAILABLE, 200, responseData)
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 200, {})
      }

    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500, error)
    }
  }
  static getBspOnePerformaCrop = async (req, res) => {
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
      let responseData = await db.carryOverSeedModel.findAll({
        include: [
          {
            model: db.cropModel,
            attributes: []
          },

        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('carry_over_seed.crop_code')), 'crop_code'],
          [sequelize.col('m_crop.crop_name'), 'crop_name']
        ],
        raw: true,
        where: {
          is_freezed: 1,
          is_active: 1,
          year: req.body.search.year,
          season: req.body.search.season,
          user_id: req.body.loginedUserid.id,
          meet_target: {
            [Op.ne]: 1
          },
          ...production_type

        },
        // order:[['season','ASC']]                                    
      })
      if (responseData) {
        return response(res, status.DATA_AVAILABLE, 200, responseData)
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 200, {})
      }

    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500, error)
    }
  }
  static getVarietiesParentalLineV1Second = async (req, res) => {
    let returnResponse = {};
    const { internalCall } = req.body;
    try {
      let rules = {
        'search.year': 'string',
        'search.season': 'string',
        'search.crop_code': 'string',
        'search.state_code': 'string',
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
      }

      let condition4 = {
        include: [

          {
            model: bspPerformaBspTwo,
            as: 'CarrybspOneTwoVC',
            on: {
              col1: sequelize.where(sequelize.col("CarrybspOneTwoVC.variety_line_code"), "=", sequelize.col("carry_over_seed.variety_line_code")),
            },
            required: false,
            where: {
              is_active: 1
            },
            attributes: []
          },
          {
            model: varietyModel,
            required: true,
            attributes: []
          },
          {
            model: db.varietLineModel,
            on: {
              col1: sequelize.where(sequelize.col("m_variety_line.line_variety_code"), "=", sequelize.col("carry_over_seed.variety_line_code")),
            },
            required: false,
            where: {
            },
            attributes: []
          },
        ],
        where: {
          is_active: 1,
          ['$CarrybspOneTwoVC.id$']: null,
          ['$m_crop_variety.status$']: 'hybrid',
          year: {
            [Op.in]: req.body.search.year.toString().split(',')
          },
          meet_target: {
            [Op.ne]: 1
          }
        },
        group: ['m_variety_line.line_variety_name', 'carry_over_seed.variety_line_code', 'm_crop_variety.variety_name', 'carry_over_seed.variety_code'],
        raw: true,
        attributes: [
          [sequelize.col('carry_over_seed.variety_line_code'), 'value'],
          [sequelize.col('m_variety_line.line_variety_name'), 'display_text'],
          [sequelize.col('m_variety_line.line_variety_name'), 'line_variety_name'],
          [sequelize.col('carry_over_seed.variety_line_code'), 'value'],
          [sequelize.col('carry_over_seed.variety_code'), 'variety_code'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
        ]
      };

      if (req.body.search) {
        if (req.body.search.year) {

          // condition4.where.year = {
          //   [Op.in]: req.body.search.year.toString().split(',')
          // };

          // condition4.include[1].where.year = {
          //   [Op.in]: req.body.search.year.toString().split(',')
          // };

        }
        if (req.body.search.season) {
          condition4.where.season = {
            [Op.in]: req.body.search.season.toString().split(',')
          };

          // condition4.include[1].where.season = {
          //   [Op.in]: req.body.search.season.toString().split(',')
          // };
        }
        if (req.body.search.crop_code) {

          condition4.where.crop_code = {
            [Op.in]: req.body.search.crop_code.toString().split(',')
          };

          // condition4.include[1].where.crop_code = {
          //   [Op.in]: req.body.search.crop_code.toString().split(',')
          // };
        }
        if (req.body.search.variety_code) {

          condition4.where.variety_code = {
            [Op.in]: req.body.search.variety_code.toString().split(',')
          };

          // condition4.include[1].where.variety_code = {
          //   [Op.in]: req.body.search.variety_code.toString().split(',')
          // };
        }
        if (req.body.search.user_id) {
          condition4.where.user_id = {
            [Op.in]: req.body.search.user_id.toString().split(',')
          };
          // condition4.where['$bsp_proforma_1_bspc.bspc_id$'] = {
          //   [Op.in]: req.body.search.user_id.toString().split(',')
          // };
          // condition4.include[1].where.user_id = {
          //   [Op.in]: req.body.search.user_id.toString().split(',')
          // };
        }
      }

      condition4.order = [[sequelize.col('variety_name'), 'asc']];

      const hybridVarietyList = await db.carryOverSeedModel.findAll(condition4);

      returnResponse = hybridVarietyList

      response(res, returnResponse.length ? status.DATA_AVAILABLE : status.DATA_NOT_AVAILABLE, 200, returnResponse, internalCall);
    } catch (error) {
      returnResponse = {
        error: error.message
      }
      console.log(returnResponse);
      response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }
  static getSeedProcessingRegYear = async (req, res) => {
    try {
      let yearData = []
      let responseData = await db.carryOverSeedModel.findAll({
        include: [
          {
            model: db.carryOverSeedDetailsModel,

            attributes: []
          },
          {
            model: seedInventory,
            // required:false,
            on: {
              col1: sequelize.where(sequelize.col("seed_inventry.variety_code"), "=", sequelize.col("carry_over_seed.variety_code")),
              // col2: sequelize.where(sequelize.col("seed_inventry.line_variety_code"), "=", sequelize.col("carry_over_seed.variety_line_code")),
              col3: sequelize.where(sequelize.col("seed_inventry.bspc_id"), "=", sequelize.col("carry_over_seed.user_id")),
            },

            where: {
              user_id: req.body.loginedUserid.id,

            },
            attributes: []
          },


        ],
        attributes: [
          [db.Sequelize.fn("Distinct", db.Sequelize.col("carry_over_seed.year")), "value"],
          [db.Sequelize.col('carry_over_seed.year'), 'year']
          // [sequelize.literal("concat(year, '-', RIGHT((Year+1)::VARCHAR, 2))"), 'display_text'],
          // 'year'
        ],
        raw: true,
        where: {
          meet_target: {
            [Op.in]: [1, 2]
          },

          is_freezed: 1,
          is_active: 1,
          // user_id:req.body.loginedUserid.id,
        },
        // order:[['season','ASC']]                                    
      })
      let investVerifyYear = await db.investHarvestingModel.findAll({
        include: [
          {
            model: db.investVerifyModel,
            attributes: []
          }
        ],

        attributes: [
          [db.Sequelize.fn("Distinct", db.Sequelize.col("invest_verification.year")), "value"],
          // [sequelize.literal("concat(year, '-', RIGHT((Year+1)::VARCHAR, 2))"), 'display_text'],
          'year'
        ],
        raw: true,
        where: {
          spp_id: req.body.loginedUserid.id,


        },
        // order:[['season','ASC']]                                    
      })
      if (responseData && responseData.length > 0) {
        responseData.forEach((el) => {
          yearData.push(el && el.value ? el.value : "")
        })
      }
      if (investVerifyYear && investVerifyYear.length > 0) {
        investVerifyYear.forEach((el) => {
          yearData.push(el && el.value ? el.value : "")
        })
      }
      yearData = [... new Set(yearData)]
      if (yearData) {
        return response(res, status.DATA_AVAILABLE, 200, yearData)
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 200, {})
      }

    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500, error)
    }
  }
  static getSeedProcessingRegSeason = async (req, res) => {
    try {
      let seasonData = []
      const { year } = req.body.search;
      let responseData = await db.carryOverSeedModel.findAll({
        include: [
          {
            model: db.carryOverSeedDetailsModel,

            attributes: []
          },
          {
            model: seedInventory,
            // required:false,
            on: {
              col1: sequelize.where(sequelize.col("seed_inventry.variety_code"), "=", sequelize.col("carry_over_seed.variety_code")),
              // col2: sequelize.where(sequelize.col("seed_inventry.line_variety_code"), "=", sequelize.col("carry_over_seed.variety_line_code")),
              col3: sequelize.where(sequelize.col("seed_inventry.bspc_id"), "=", sequelize.col("carry_over_seed.user_id")),
            },
            where: {
              user_id: req.body.loginedUserid.id,

            },
            attributes: []
          }
        ],
        attributes: [
          [db.Sequelize.fn("Distinct", db.Sequelize.col("carry_over_seed.season")), "value"],
          // [db.Sequelize.col('carry_over_seed.year'),'year']
          // [sequelize.literal("concat(year, '-', RIGHT((Year+1)::VARCHAR, 2))"), 'display_text'],
          // 'year'
        ],
        raw: true,
        where: {
          year: year,
          meet_target: {
            [Op.in]: [1, 2]
          }, is_freezed: 1,
          is_active: 1,
          // user_id:req.body.loginedUserid.id,
        },

        // order:[['season','ASC']]                                    
      })

      let investVerifySeason = await db.investHarvestingModel.findAll({
        include: [
          {
            model: db.investVerifyModel,
            attributes: []
          }
        ],
        attributes: [
          [db.Sequelize.fn("Distinct", db.Sequelize.col("invest_verification.season")), "value"],
          // [sequelize.literal("concat(year, '-', RIGHT((Year+1)::VARCHAR, 2))"), 'display_text'],
          // 'year'
        ],
        raw: true,
        where: {
          year: year,
          spp_id: req.body.loginedUserid.id,


        },
        // order:[['season','ASC']]                                    
      })
      if (responseData && responseData.length > 0) {
        responseData.forEach((el) => {
          seasonData.push(el && el.value ? el.value : "")
        })
      }
      if (investVerifySeason && investVerifySeason.length > 0) {
        investVerifySeason.forEach((el) => {
          seasonData.push(el && el.value ? el.value : "")
        })
      }
      seasonData = [...new Set(seasonData)]
      if (seasonData) {
        return response(res, status.DATA_AVAILABLE, 200, seasonData)
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 200, {})
      }

    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500, error)
    }
  }
  static getSeedProcessingRegCrop = async (req, res) => {
    try {
      const { year, season } = req.body.search;
      let cropData = []
      let responseData = await db.carryOverSeedModel.findAll({
        include: [
          {
            model: db.carryOverSeedDetailsModel,

            attributes: []
          },
          {
            model: seedInventory,
            // required:true,
            on: {
              col1: sequelize.where(sequelize.col("seed_inventry.variety_code"), "=", sequelize.col("carry_over_seed.variety_code")),
              // col2: sequelize.where(sequelize.col("seed_inventry.line_variety_code"), "=", sequelize.col("carry_over_seed.variety_line_code")),
              col3: sequelize.where(sequelize.col("seed_inventry.bspc_id"), "=", sequelize.col("carry_over_seed.user_id")),
            },
            where: {
              user_id: req.body.loginedUserid.id,

            },
            attributes: []
          }
        ],
        attributes: [
          [db.Sequelize.fn("Distinct", db.Sequelize.col("carry_over_seed.crop_code")), "value"],
          // [sequelize.literal("concat(year, '-', RIGHT((Year+1)::VARCHAR, 2))"), 'display_text'],
          // 'year'
        ],
        raw: true,
        where: {
          year: year,
          season: season,
          meet_target: {
            [Op.in]: [1, 2]
          },
          is_freezed: 1,
          is_active: 1,
          // user_id:req.body.loginedUserid.id,
        },
        // order:[['season','ASC']]                                    
      })

      let investVerifyCrop = await db.investHarvestingModel.findAll({
        include: [
          {
            model: db.investVerifyModel,
            attributes: []
          }
        ],
        attributes: [
          [db.Sequelize.fn("Distinct", db.Sequelize.col("invest_verification.crop_code")), "value"],
          // [sequelize.literal("concat(year, '-', RIGHT((Year+1)::VARCHAR, 2))"), 'display_text'],
          // 'year'
        ],
        raw: true,
        where: {
          year: year,
          season: season,
          spp_id: req.body.loginedUserid.id,

        },
        // order:[['season','ASC']]                                    
      })
      if (responseData && responseData.length > 0) {
        responseData.forEach((el) => {
          cropData.push(el && el.value ? el.value : "")
        })
      }
      if (investVerifyCrop && investVerifyCrop.length > 0) {
        investVerifyCrop.forEach((el) => {
          cropData.push(el && el.value ? el.value : "")
        })
      }
      cropData = [...new Set(cropData)]
      let ResponseCrop = await cropModel.findAll({
        attributes: [
          'crop_name',
          'crop_code'
        ],
        where: {
          crop_code: {
            [Op.in]: cropData
          }
        }
      })
      if (ResponseCrop) {
        return response(res, status.DATA_AVAILABLE, 200, ResponseCrop)
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 200, {})
      }

    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500, error)
    }
  }

  static getSeedProcessingRegData = async (req, res) => {
    try {
      const { user_id, crop_code, year, season, variety_code, variety_line_code, page = 1, pageSize = 10 } = req.body;
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
      const offset = (page - 1) * pageSize;
      const lifitingData = await liftingSeedDetailsModel.findAll({
        where: whereClause,
        raw: true,
        attributes: [
          'spa_code', 'spa_state_code'
        ]
      })
      console.log(lifitingData, 'lifitingDatalifitingData')
      let receiptRequestData = [];
      if (lifitingData && lifitingData.length > 0) {
        for (let key in lifitingData) {

          const receiptRequestData2 = await liftingSeedDetailsModel.findAll({
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
                required: false,
                attributes: ['spa_code', 'name'],
                include: [
                  {
                    model: agencyDetailModel,
                    //  required:false,
                    attributes: ['state_id'],
                    where: {
                      // state_id: db.Sequelize.col('lifting_seed_details.spa_state_code')
                      state_id: lifitingData[key].spa_state_code
                    }
                  }
                ]
              },
              {
                model: allocationToSPASeed,
                required: false,
                attributes: [],
                include: [
                  {
                    model: allocationSpaForLiftingSeed,
                    required: false,
                    attributes: ['allocated_quantity'],
                    // on: {
                    //   col1: sequelize.where(sequelize.col("allocation_to_spa_for_lifting_seeds->allocation_to_spa_for_lift.spa_code"), "=", sequelize.col("lifting_seed_details.spa_code")),
                    // },
                    where: {
                      // spa_code: db.Sequelize.col('lifting_seed_details.spa_code'),
                      // state_code: db.Sequelize.col('lifting_seed_details.spa_state_code')
                      spa_code: lifitingData[key].spa_code,
                      state_code: lifitingData[key].spa_state_code
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
            // limit: pageSize,
            // offset: offset,
            raw: true
          });
          receiptRequestData.push(receiptRequestData2)
        }
      }
      // console.log('receiptRequestData2',receiptRequestData)
      if (receiptRequestData && receiptRequestData.length > 0) {
        receiptRequestData = receiptRequestData ? receiptRequestData.flat() : ''
      }

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

  //   static getSeedProcessingRegData = async (req, res) => {
  //     try {
  //       const { user_id, crop_code, year, season, variety_code, variety_line_code } = req.body;
  //       const whereClause = {};
  //       if (year) {
  //         whereClause.year = parseInt(year);
  //       }
  //       if (season) {
  //         whereClause.season = season;
  //       }
  //       if (crop_code) {
  //         whereClause.crop_code = crop_code;
  //       }
  //       if (variety_code && variety_code.length > 0) {
  //         whereClause.variety_code = {
  //           [Op.in]: variety_code
  //         };
  //       }
  //       if (variety_line_code) {
  //         whereClause.variety_line_code = variety_line_code;
  //       }
  //       if (user_id) {
  //         whereClause.spp_id = (user_id).toString()
  //       }

  //       const query = `SELECT  
  //     m_crop_variety.variety_name,
  //     m_crop_variety.variety_code,
  //     lifting_seed_details.id,
  //     lifting_seed_details.created_at as date_of_lifting,
  //     lifting_tag_number.tag_size,
  //     lifting_tag_number.no_of_bags,
  //     usersModelIndenter.name as indenter_name,
  //     usersModelIndenter.id as indenter_id,
  //     userModelSpa.spa_code AS spa_code, 
  //     userModelSpa.name AS spa_name,
  //     agency_detail.state_id AS spa_id,
  //     allocation_to_spa_for_lifting_seed_production_cnters.allocated_quantity,
  //     indent_of_spas.indent_quantity,
  //     "comments"."comment" as reason_for_short

  // FROM lifting_seed_details AS lifting_seed_details
  // LEFT OUTER JOIN m_crop_varieties AS m_crop_variety ON lifting_seed_details.variety_code = m_crop_variety.variety_code
  // LEFT OUTER JOIN lifting_tag_number AS lifting_tag_number ON lifting_tag_number.litting_seed_details_id = lifting_seed_details.id
  // LEFT OUTER JOIN users AS usersModelIndenter ON lifting_seed_details.indentor_id = usersModelIndenter.id
  // LEFT OUTER JOIN users AS userModelSpa ON lifting_seed_details.spa_code = userModelSpa.spa_code
  // INNER JOIN agency_details AS agency_detail ON agency_detail.user_id = userModelSpa.id AND agency_detail.state_id = lifting_seed_details.spa_state_code
  // LEFT JOIN allocation_to_spa_for_lifting_seeds ON allocation_to_spa_for_lifting_seeds.year = lifting_seed_details.year AND allocation_to_spa_for_lifting_seeds.season = lifting_seed_details.season  and
  // allocation_to_spa_for_lifting_seeds.crop_code = lifting_seed_details.crop_code AND allocation_to_spa_for_lifting_seeds.variety_id = "m_crop_variety"."id"and allocation_to_spa_for_lifting_seeds.user_id = lifting_seed_details.user_id
  // LEFT OUTER JOIN allocation_to_spa_for_lifting_seed_production_cnters ON allocation_to_spa_for_lifting_seed_production_cnters.allocation_to_spa_for_lifting_seed_id = allocation_to_spa_for_lifting_seeds.id  AND allocation_to_spa_for_lifting_seed_production_cnters.spa_code = "lifting_seed_details"."spa_code" AND allocation_to_spa_for_lifting_seed_production_cnters.state_code = "lifting_seed_details"."spa_state_code"
  // LEFT outer join indent_of_spas as indent_of_spas ON indent_of_spas.year = lifting_seed_details.year AND indent_of_spas.season = lifting_seed_details.season  and
  // indent_of_spas.crop_code = lifting_seed_details.crop_code AND indent_of_spas.variety_id = "m_crop_variety"."id"and indent_of_spas.user_id = lifting_seed_details.user_id
  // LEFT OUter join "comments" as "comments" on comments.id = lifting_seed_details.reason_id

  // WHERE 
  //     lifting_seed_details.user_id = :user_id 
  //     AND lifting_seed_details.year = :year 
  //     AND lifting_seed_details.season = :season
  //     AND lifting_seed_details.crop_code = :crop_code 
  //     AND lifting_seed_details.variety_code = :variety_code ;`

  //       const receiptRequestData = await db.sequelize.query(query, {
  //         replacements: { user_id,year,season,crop_code,variety_code },
  //         type: db.sequelize.QueryTypes.SELECT
  //       });
  //       const result = [];
  //       receiptRequestData.forEach(item => {
  //         let variety = result.find(v => v.variety_code === item.variety_code);
  //         if (!variety) {
  //             variety = {
  //                 id: item.id,
  //                 variety_name: item.variety_name,
  //                 variety_code: item.variety_code,
  //                 indenter_details: []
  //             };
  //             result.push(variety);
  //         }

  //         let indenter = variety.indenter_details.find(i => i.indenter_id === item.indenter_id);
  //         if (!indenter) {
  //             indenter = {
  //                 indenter_name: item.indenter_name,
  //                 indenter_id: item.indenter_id,
  //                 spa_details: []
  //             };
  //             variety.indenter_details.push(indenter);
  //         }
  //         const spaDetail = {
  //             spa_id: item.spa_id,
  //             spa_code: item.spa_code,
  //             spa_name: item.spa_name,
  //             indent_quantity: item.indent_quantity,
  //             date_of_lifting: item.date_of_lifting,
  //             allocated_quantity: item.allocated_quantity,
  //             reason_for_short: item.reason_for_short,
  //             tag_size: item.tag_size,
  //             no_of_bags: item.no_of_bags
  //         };

  //         indenter.spa_details.push(spaDetail);
  //     });

  //       return response(res, status.DATA_AVAILABLE, 200, result)
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //       res.status(500).json({ error: error });
  //     }
  //   };

  static saveProcessedSeedDetails = async (req, res) => {
    try {
      const { year, season, crop, variety, lot_id, total_breeder_qty, recovery_qty, tentative_recovery, total_rejected, under_size, processing_loss, spp, stack, godown_no, stackDatas, raw_seed_produced, action, total_bags, provision_lot,
        verify_id, carry_over_seed_details_id, carry_id, user_id, line_variety_code, getRadio, classofSeedHarvestedData, carry_over_user_id, } = req.body;
      console.log()
      const whereClause = {};
      const datas = await db.seedProcessingRegister.findAll({
        // where:{
        where: {
          year: year,
          season: season,
          crop_code: crop,
          variety_code: variety,
          lot_id: lot_id,
          // action: action,
          user_id: user_id,
          // }
        },
        attributes: ['id'],
        raw: true
      })
      let investingResponse;
      if (datas && datas.length > 0) {
        console.log(datas, 'datas')
        const dataRow = {
          year: year ? year : null,
          season: season ? season : null,
          crop_code: crop ? crop : null,
          variety_code: variety ? variety : null,
          lot_id: lot_id ? lot_id : null,
          class_of_seed: classofSeedHarvestedData ? classofSeedHarvestedData : null,
          lot_qty: raw_seed_produced ? raw_seed_produced : null,
          godown_no: godown_no ? godown_no : null,
          stack_no: stackDatas ? stackDatas : null,
          total_processed_qty: total_breeder_qty ? total_breeder_qty : null,
          undersize_qty: under_size ? under_size : null,
          process_loss: processing_loss ? processing_loss : null,
          total_rejected_qty: total_rejected ? (total_rejected.toFixed(2)) : null,
          is_active: 1,
          no_of_bags: total_bags ? total_bags : null,
          action: action ? action : null,
          lot_no: provision_lot ? provision_lot : null,
          invest_verify_id: verify_id ? verify_id : null,
          tentative_qty: tentative_recovery ? tentative_recovery : null,
          recover_qty: recovery_qty ? recovery_qty : null,
          carr_over_seed_details_id: carry_over_seed_details_id ? carry_over_seed_details_id : null,
          carry_over_id: carry_id ? carry_id : null,
          user_id: user_id ? user_id : '',
          variety_code_line: line_variety_code ? line_variety_code : null,
          get_carry_over: getRadio ? getRadio : null,
        }
        // let investingResponse
        const investHarvesting = await db.seedProcessingRegister.update(dataRow,
          {
            where: {
              id: datas && datas[0] && datas[0].id ? datas[0].id : ''
            }
          }).then(function (item) {
            investingResponse = item['_previousDataValues'];
          })
        for (let key in spp) {
          const dataRows = {
            no_of_bags: spp && spp[key] && spp[key].no_of_bags ? spp[key].no_of_bags : null,
            bag_size: spp && spp[key] && spp[key].bags ? spp[key].bags : null,
            qty: spp && spp[key] && spp[key].qty ? spp[key].qty : null,
            seed_processing_register_id: datas && datas[0] && datas[0].id ? datas[0].id : null
          }
          const investverifyStack = await db.ProcessSeedDetails.create(dataRows)
        }
        if (stack && stack.length > 0) {
          // console.log(range_data,'range_data')
          for (let key in stack) {
            const dataRows = {
              godown_no: stack && stack[key] && stack[key].godown_no ? stack[key].godown_no : null,
              type_of_seed: stack && stack[key] && stack[key].type_of_seed ? stack[key].type_of_seed : null,
              stack_no: stack && stack[key] && stack[key].showstackNo ? stack[key].showstackNo : null,
              no_of_bag: stack && stack[key] && stack[key].noofBags ? stack[key].noofBags : null,
              seed_processing_register_id: datas && datas[0] && datas[0].id ? datas[0].id : null,
              stack_id: stack && stack[key] && stack[key].stack_id ? stack[key].stack_id : null
            }
            const investverifyTags = await db.SeedForProcessedStack.create(dataRows)
          }
        }
      }
      else {
        const dataRow = {
          year: year ? year : null,
          season: season ? season : null,
          crop_code: crop ? crop : null,
          variety_code: variety ? variety : null,
          lot_id: lot_id ? lot_id : null,
          class_of_seed: classofSeedHarvestedData ? classofSeedHarvestedData : null,
          lot_qty: raw_seed_produced ? raw_seed_produced : null,
          godown_no: godown_no ? godown_no : null,
          stack_no: stackDatas ? stackDatas : null,
          total_processed_qty: total_breeder_qty ? total_breeder_qty : null,
          undersize_qty: under_size ? under_size : null,
          process_loss: processing_loss ? processing_loss : null,
          total_rejected_qty: total_rejected ? total_rejected : null,
          is_active: 1,
          no_of_bags: total_bags ? total_bags : null,
          action: action ? action : null,
          lot_no: provision_lot ? provision_lot : null,
          invest_verify_id: verify_id ? verify_id : null,
          tentative_qty: tentative_recovery ? tentative_recovery : null,
          recover_qty: recovery_qty ? recovery_qty : null,
          carr_over_seed_details_id: carry_over_seed_details_id ? carry_over_seed_details_id : null,
          carry_over_id: carry_id ? carry_id : null,
          user_id: user_id ? user_id : null,
          variety_code_line: line_variety_code ? line_variety_code : null,
          get_carry_over: getRadio ? getRadio : null,
          bspc_id: carry_over_user_id ? carry_over_user_id : null,
        }

        const investHarvesting = await db.seedProcessingRegister.create(dataRow).then(function (item) {
          investingResponse = item['_previousDataValues'];
        })
        for (let key in spp) {
          const dataRows = {
            no_of_bags: spp && spp[key] && spp[key].no_of_bags ? spp[key].no_of_bags : null,
            bag_size: spp && spp[key] && spp[key].bags ? spp[key].bags : null,
            qty: spp && spp[key] && spp[key].qty ? spp[key].qty : null,
            seed_processing_register_id: investingResponse && investingResponse.id ? investingResponse.id : null,
          }
          const investverifyStack = await db.ProcessSeedDetails.create(dataRows)
        }
        if (stack && stack.length > 0) {
          // console.log(range_data,'range_data')
          for (let key in stack) {
            const dataRows = {
              godown_no: stack && stack[key] && stack[key].godown_no ? stack[key].godown_no : null,
              type_of_seed: stack && stack[key] && stack[key].type_of_seed ? stack[key].type_of_seed : null,
              stack_no: stack && stack[key] && stack[key].showstackNo ? stack[key].showstackNo : null,
              no_of_bag: stack && stack[key] && stack[key].noofBags ? stack[key].noofBags : null,
              seed_processing_register_id: investingResponse && investingResponse.id ? investingResponse.id : null,
              stack_id: stack && stack[key] && stack[key].stack_id ? stack[key].stack_id : null
            }
            const investverifyTags = await db.SeedForProcessedStack.create(dataRows)
          }
        }
      }
      return response(res, status.DATA_SAVE, 200, investingResponse)
    } catch (error) {
      console.error('Error fetching data:', error);
      return response(res, status.DATA_NOT_AVAILABLE, 500, error)
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  static getSeedProcessingRegStack = async (req, res) => {
    try {
      const { year, season, user_id, stack_id, crop_code, variety_code } = req.body.search;
      let data
      let cropCode;
      let varietyCode;
      if (crop_code) {
        cropCode = {
          crop_code: req.body.search.crop_code
        }
      }

      if (variety_code) {
        varietyCode = {
          variety_code: req.body.search.variety_code
        }
      }

      if (stack_id) {
        data = await db.SeedForProcessedStack.findAll(
          {
            where: {
              id: stack_id
            }
          }
        )

      } else {
        data = await db.seedProcessingRegister.findAll(
          {
            where: {
              year: year,
              season: season,
              user_id: user_id,
              ...cropCode,
              ...varietyCode,
              action: {
                [Op.in]: [1]
              }
            },
            include: [
              {
                model: db.SeedForProcessedStack,
                where: {
                  stack_id: {
                    [Op.eq]: null
                  }
                },
                attributes: []
              }
            ],
            attributes: [
              //  [db.Sequelize.fn("Distinct", db.Sequelize.col("seed_for_processed_stack.stack_no")), "stack_no"],
              //  [sequelize.literal('DISTINCT seed_for_processed_stack.stack_no'), 'stack_no'],
              [sequelize.col('seed_for_processed_stack.stack_no'), 'stack_no'],
              //  [sequelize.fn('DISTINCT', sequelize.col('seed_for_processed_stack.stack_no')), 'stack_no'],
              [sequelize.col('seed_for_processed_stack.id'), 'stack_id'],
            ],
            // group:[
            //   [sequelize.col('seed_for_processed_stack.stack_no'), 'stack_no'],
            //   [sequelize.col('seed_for_processed_stack.id'), 'stack_id'],
            // ]
          }
        )
      }



      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 200, {})
      }

    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500, error)
    }
  }
  static getSeedProcessingRegDataCarry = async (req, res) => {
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
        // 'search.user_id': 'required|string',
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
        let { user_id, crop_code, year, season, variety_code, variety_line_code, id, plotid, getRadio, lot_no } = req.body.search

        const whereClause2 = {};

        const whereClause = {};
        // const whereClause2 = {};

        if (year) {
          whereClause.year = parseInt(year);
        }
        if (season) {
          whereClause.season = season;
        }
        if (crop_code) {
          whereClause.crop_code = crop_code;
        }
        if (variety_code && variety_code.length > 0) {
          whereClause.variety_code = {
            [Op.in]: variety_code
          };
        }
        if (variety_line_code) {
          whereClause.variety_line_code = variety_line_code;
        }
        if (variety_line_code) {
          whereClause.variety_line_code = variety_line_code;
        }

        if (user_id) {
          whereClause.spp_id = (user_id).toString()
        }

        if (id) {
          whereClause.id = id;
        }
        if (plotid) {
          whereClause.plot_code = plotid
        }
        // if (lot_no) {
        //   whereClause2.id = lot_no
        // }
        if (lot_no) {
          whereClause2.lot_id = lot_no

        }
        if (!page) page = 1;
        let condition = {}
        condition = {
          include: [

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

            {
              model: db.carryOverSeedDetailsModel,
              // where: whereClause2,
              include: [
                {
                  model: db.seedProcessingRegister,
                  include: [
                    {
                      model: db.SeedForProcessedStack,
                      attributes: []
                    }
                  ],
                  attributes: []
                },

              ],
              // as: 'caryOverDetails',
              // on: {
              //   col1: sequelize.where(sequelize.col("carry_over_seed_detail.id"), "=", sequelize.col("caryOverDetails.carry_over_seed_id")),
              // },
              // required: true,
              attributes: []
            },
          ],
          raw: true,
          attributes: [
            [sequelize.col('m_crop.crop_name'), 'crop_name'],
            'crop_code', 'variety_code', 'total_qty', 'id', 'meet_target', 'is_freezed', 'production_type',
            [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
            [sequelize.col('m_variety_line.line_variety_name'), 'line_variety_name'],
            [sequelize.col('m_variety_line.line_variety_code'), 'line_variety_code'],
            [sequelize.col('carry_over_seed_details.stage_id'), 'stage_id'],
            [sequelize.col('carry_over_seed_details.class'), 'class'],
            [sequelize.col('carry_over_seed_details.lot_no'), 'lot_no'],
            [sequelize.col('carry_over_seed_details.lot_id'), 'lot_id'],
            [sequelize.col('carry_over_seed_details.tag_no'), 'tag_no'],
            [sequelize.col('carry_over_seed_details.year'), 'year_of_indent'],
            [sequelize.col('carry_over_seed_details.season'), 'seasonValue'],
            [sequelize.col('carry_over_seed_details.quantity_recieved'), 'quantity_recieved'],
            [sequelize.col('carry_over_seed_details.quantity_available'), 'quantity_available'],
            [sequelize.col('carry_over_seed_details->seed_processing_register.carr_over_seed_details_id'), 'carry_over_seed_details_data_id'],
            [sequelize.col('carry_over_seed_details->seed_processing_register.action'), 'action'],
            [sequelize.col('carry_over_seed_details->seed_processing_register.total_processed_qty'), 'total_processed_qty'],
            [sequelize.col('carry_over_seed_details->seed_processing_register.undersize_qty'), 'undersize_qty'],
            [sequelize.col('carry_over_seed_details->seed_processing_register.process_loss'), 'process_loss'],
            [sequelize.col('carry_over_seed_details->seed_processing_register.total_rejected_qty'), 'total_rejected_qty'],
            [sequelize.col('carry_over_seed_details->seed_processing_register.tentative_qty'), 'tentative_qty'],
            [sequelize.col('carry_over_seed_details->seed_processing_register.recover_qty'), 'recover_qty'],
            [sequelize.col('carry_over_seed_details.id'), 'carry_over_seed_details_id'],
            [sequelize.col('carry_over_seed_details->seed_processing_register.id'), 'seed_processing_register_id'],
          ],
          where: {
            is_active: '1',
            ...production_type
          },
        };

        // const sortOrder = req.body.sort ? req.body.sort : 'id';
        // const sortDirection = req.body.order ? req.body.order : 'DESC';

        if (page && pageSize) {
          page = parseInt(page);
          condition.limit = parseInt(pageSize);
          condition.offset = (page * pageSize) - pageSize;
        }

        condition.order = [[sequelize.col('m_crop_variety.variety_name'), 'ASC']];

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

        const queryData = await db.carryOverSeedModel.findAndCountAll(condition);
        // console.log(queryData.rows)

        let totalRecord = queryData.count;
        const lastPage = totalRecord ? ((totalRecord % (pageSize) === 0 ? (totalRecord / (pageSize)) : (parseInt(totalRecord / (pageSize)) + 1))) : 0;
        let filterData = [];
        let directIndentVarietyListTotal;
        let bsp1VarietyListArr = [];
        let bsp1VarietyList;
        let directIndentVarietyListTotalArr = [];
        let seedProcessId = []

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
                variety_line_code: queryData.rows[key].line_variety_code ? queryData.rows[key].line_variety_code : '',

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
        }
        if (queryData && queryData.rows && queryData.rows.length > 0) {
          if (production_type && production_type.production_type == "NORMAL") {
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
                      variety_code_line: queryData.rows[key].line_variety_code ? queryData.rows[key].line_variety_code : '',
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
        }
        if (queryData && queryData.rows && queryData.rows.length > 0) {

          queryData.rows.forEach((el, index) => {
            seedProcessId.push(el && el.seed_processing_register_id ? el.seed_processing_register_id : '')
            let varietyIndex;
            if (el && el.line_variety_code) {
              varietyIndex = filterData.findIndex(item => item.variety_code == el.variety_code && item.line_variety_code == el.line_variety_code);
            } else {
              varietyIndex = filterData.findIndex(item => item.variety_code == el.variety_code);
            }
            if (varietyIndex == -1) {
              filterData.push({
                variety_code: el && el.variety_code ? el.variety_code : "",
                id: el && el.id ? el.id : "",
                variety_name: el && el.variety_name ? el.variety_name : "",
                line_variety_name: el && el.line_variety_name ? el.line_variety_name : "",
                line_variety_code: el && el.line_variety_code ? el.line_variety_code : "",
                meet_target: el && el.meet_target ? el.meet_target : "",
                id: el && el.id ? el.id : "",
                total_qty: el && el.total_qty ? el.total_qty : "",
                is_freezed: el && el.is_freezed ? el.is_freezed : '',
                seed_class_details: [
                  {
                    year: el && el.year_of_indent ? el.year_of_indent : '',
                    season: el && el.seasonValue ? el.seasonValue : '',
                    stage: el && el.stage_id ? el.stage_id : '',
                    lot_id: el && el.lot_id ? el.lot_id : '',
                    carry_id: el && el.id ? el.id : "",
                    lot_no: el && el.lot_no ? el.lot_no : '',
                    tag_no: el && el.tag_no ? el.tag_no : '',
                    quantity_recieved: el && el.quantity_recieved ? el.quantity_recieved : '',
                    quantity_available: el && el.quantity_available ? el.quantity_available : '',
                    carry_over_seed_details_data_id: el && el.carry_over_seed_details_data_id ? el.carry_over_seed_details_data_id : '',
                    carry_over_seed_details_id: el && el.carry_over_seed_details_id ? el.carry_over_seed_details_id : "",
                    action: el && el.action ? el.action : "",
                    process_loss: el && el.process_loss ? el.process_loss : "",
                    //         [sequelize.col('carry_over_seed_details->seed_processing_register.total_processed_qty'), 'total_processed_qty'],
                    // [sequelize.col('carry_over_seed_details->seed_processing_register.undersize_qty'), 'undersize_qty'],
                    // [sequelize.col('carry_over_seed_details->seed_processing_register.process_loss'), 'process_loss'],
                    // [sequelize.col('carry_over_seed_details->seed_processing_register.total_rejected_qty'), 'total_rejected_qty'],
                    // [sequelize.col('carry_over_seed_details->seed_processing_register.tentative_qty'), 'tentative_qty'],
                    // [sequelize.col('carry_over_seed_details->seed_processing_register.recover_qty'), 'recover_qty'],
                    total_processed_qty: el && el.total_processed_qty ? el.total_processed_qty : "",
                    undersize_qty: el && el.undersize_qty ? el.undersize_qty : "",
                    process_loss: el && el.process_loss ? el.process_loss : '',
                    total_rejected_qty: el && el.total_rejected_qty ? el.total_rejected_qty : '',
                    tentative_qty: el && el.tentative_qty ? el.tentative_qty : '',
                    recover_qty: el && el.recover_qty ? el.recover_qty : '',
                    stack_details: [],
                    seed_processing_register_id: el && el.seed_processing_register_id ? el.seed_processing_register_id : '',

                  }
                ]
              })
            }
            else {
              let classIndex = filterData[varietyIndex].seed_class_details.findIndex(item => item.year == el.year && item.season == el.seasonValue && item.lot_id == el.lot_id);
              if (classIndex == -1) {
                filterData[varietyIndex].seed_class_details.push({
                  year: el && el.year_of_indent ? el.year_of_indent : '',
                  season: el && el.seasonValue ? el.seasonValue : '',
                  stage: el && el.stage_id ? el.stage_id : '',
                  lot_id: el && el.lot_id ? el.lot_id : '',
                  lot_no: el && el.lot_no ? el.lot_no : '',
                  tag_no: el && el.tag_no ? el.tag_no : '',
                  carry_id: el && el.id ? el.id : "",
                  quantity_recieved: el && el.quantity_recieved ? el.quantity_recieved : '',
                  quantity_available: el && el.quantity_available ? el.quantity_available : '',
                  carry_over_seed_details_id: el && el.carry_over_seed_details_id ? el.carry_over_seed_details_id : "",
                  carry_over_seed_details_data_id: el && el.carry_over_seed_details_data_id ? el.carry_over_seed_details_data_id : '',
                  action: el && el.action ? el.action : "",
                  total_processed_qty: el && el.total_processed_qty ? el.total_processed_qty : "",
                  undersize_qty: el && el.undersize_qty ? el.undersize_qty : "",
                  process_loss: el && el.process_loss ? el.process_loss : '',
                  total_rejected_qty: el && el.total_rejected_qty ? el.total_rejected_qty : '',
                  tentative_qty: el && el.tentative_qty ? el.tentative_qty : '',
                  recover_qty: el && el.recover_qty ? el.recover_qty : '',
                  seed_processing_register_id: el && el.seed_processing_register_id ? el.seed_processing_register_id : '',
                  action: el && el.action ? el.action : "",
                  stack_details: []

                })
              } else {
                filterData[varietyIndex].seed_class_details.push({
                  tag_no: el && el.tag_no ? el.tag_no : '',
                  carry_id: el && el.id ? el.id : "",
                  carry_over_seed_details_id: el && el.carry_over_seed_details_id ? el.carry_over_seed_details_id : "",
                  action: el && el.action ? el.action : "",
                  carry_over_seed_details_data_id: el && el.carry_over_seed_details_data_id ? el.carry_over_seed_details_data_id : '',
                  total_processed_qty: el && el.total_processed_qty ? el.total_processed_qty : "",
                  undersize_qty: el && el.undersize_qty ? el.undersize_qty : "",
                  process_loss: el && el.process_loss ? el.process_loss : '',
                  total_rejected_qty: el && el.total_rejected_qty ? el.total_rejected_qty : '',
                  tentative_qty: el && el.tentative_qty ? el.tentative_qty : '',
                  recover_qty: el && el.recover_qty ? el.recover_qty : '',
                  seed_processing_register_id: el && el.seed_processing_register_id ? el.seed_processing_register_id : '',
                  action: el && el.action ? el.action : "",
                  stack_details: []

                })
              }
            }


          })
        }
        let seedTags;
        seedProcessId = seedProcessId.filter(x => x != '')

        if (seedProcessId && seedProcessId.length > 0) {
          seedTags = await db.seedProcessingRegister.findAll(
            {
              include: [
                {
                  model: db.SeedForProcessedStack,
                  attributes: [],
                  where: {
                    seed_processing_register_id: {
                      [Op.in]: seedProcessId
                    },

                  },
                  // attributes:[]e
                }
              ],

              attributes: [
                // '*',
                [sequelize.col('seed_for_processed_stack.no_of_bag'), 'no_of_bag'],
                [sequelize.col('seed_for_processed_stack.godown_no'), 'godown_no'],
                [sequelize.col('seed_for_processed_stack.seed_processing_register_id'), 'seed_processing_register_id'],
                [sequelize.col('seed_for_processed_stack.stack_no'), 'stack_no'],
                [sequelize.col('seed_for_processed_stack.id'), 'id'],
              ],
              // required:true,
              raw: true
            },
          )
        }
        let bsp2Data = await db.investHarvestingModel.findAll({
          include: [
            {
              model: db.bspPerformaBspTwo,
              attributes: [],
              include: [
                {
                  model: db.bspPerformaBspTwoSeed,
                  attributes: []
                },
                {
                  model: db.userModel,
                  attributes: []
                }
              ],
            }
          ],
          attributes: [
            [sequelize.col('bsp_proforma_2->bsp_proforma_2_seed.seed_class_id'), 'seed_class_id'],
            [sequelize.col('bsp_proforma_2->bsp_proforma_2_seed.stage_id'), 'stage_id'],
            [sequelize.col('bsp_proforma_2->bsp_proforma_2_seed.variety_line_code'), 'variety_line_code'],
            [sequelize.col('bsp_proforma_2.variety_line_code'), 'line_variety_code'],
            [sequelize.col('invest_harvesting.variety_code'), 'variety_code'],
            [sequelize.col('invest_harvesting.plot_code'), 'plot_code'],
            [sequelize.col('bsp_proforma_2->user.code'), 'code']
          ],
          group: [
            [sequelize.col('bsp_proforma_2->bsp_proforma_2_seed.seed_class_id'), 'seed_class_id'],
            [sequelize.col('bsp_proforma_2->bsp_proforma_2_seed.stage_id'), 'stage_id'],
            [sequelize.col('bsp_proforma_2->bsp_proforma_2_seed.variety_line_code'), 'variety_line_code'],
            [sequelize.col('bsp_proforma_2.variety_line_code'), 'line_variety_code'],
            [sequelize.col('invest_harvesting.variety_code'), 'variety_code'],
            [sequelize.col('invest_harvesting.plot_code'), 'plot_code'],
            [sequelize.col('bsp_proforma_2->user.code'), 'code']
          ],
          raw: true,
          where: whereClause

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
          returnResponse.bsp1VarietyListArr = bsp1VarietyListArr;
          returnResponse.seedTags = seedTags;
          returnResponse.bsp2Data = bsp2Data;
          if (production_type && production_type.production_type == "NORMAL") {
            returnResponse.directIndentVarietyListTotalArr = directIndentVarietyListTotalArr
          } else {
            returnResponse.directIndentVarietyListTotalArr = []
          }
          return response(res, status.DATA_AVAILABLE, 200, returnResponse, internalCall);
        }
      }
    } catch (error) {
      returnResponse = {
        error: error.message
      }
      console.log(error, 'err');
      response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }
  static getSeedProcessingRegVariety = async (req, res) => {
    try {
      const { year, season } = req.body.search;
      let cropData = []
      let responseData = await db.carryOverSeedModel.findAll({
        attributes: [
          [db.Sequelize.fn("Distinct", db.Sequelize.col("crop_code")), "value"],
          // [sequelize.literal("concat(year, '-', RIGHT((Year+1)::VARCHAR, 2))"), 'display_text'],
          // 'year'
        ],
        raw: true,
        where: {
          year: year,
          season: season
        },
        // order:[['season','ASC']]                                    
      })

      let investVerifyCrop = await db.investVerifyModel.findAll({

        attributes: [
          [db.Sequelize.fn("Distinct", db.Sequelize.col("crop_code")), "value"],
          // [sequelize.literal("concat(year, '-', RIGHT((Year+1)::VARCHAR, 2))"), 'display_text'],
          // 'year'
        ],
        raw: true,
        where: {
          year: year,
          season: season
        },
        // order:[['season','ASC']]                                    
      })
      if (responseData && responseData.length > 0) {
        responseData.forEach((el) => {
          cropData.push(el && el.value ? el.value : "")
        })
      }
      if (investVerifyCrop && investVerifyCrop.length > 0) {
        investVerifyCrop.forEach((el) => {
          cropData.push(el && el.value ? el.value : "")
        })
      }
      cropData = [...new Set(cropData)]
      let ResponseCrop = await cropModel.findAll({
        attributes: [
          'crop_name',
          'crop_code'
        ],
        where: {
          crop_code: {
            [Op.in]: cropData
          }
        }
      })
      if (ResponseCrop) {
        return response(res, status.DATA_AVAILABLE, 200, ResponseCrop)
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 200, {})
      }

    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500, error)
    }
  }
  static getSeedProcessingRegLot = async (req, res) => {
    try {
      const { year, season, crop, radio } = req.body.search;
      let cropData = []
      let LotDetails
      if (radio == 1) {

        LotDetails = await db.investHarvestingModel.findAll({
          include: [
            {
              model: db.investVerifyModel,
              include: [
                {
                  model: db.intakeVerificationTags,
                  attributes: []
                }
              ],
              attributes: []
            }
          ],
          attributes: [
            [db.Sequelize.fn("Distinct", db.Sequelize.col("invest_verification->intake_verification_tags.lot_number")), "value"],
            [db.Sequelize.col("invest_verification->intake_verification_tags.id"), 'lot_id'],
            [db.Sequelize.col("invest_verification->intake_verification_tags.qty"), 'qty'],
            'id'
            // [sequelize.literal("concat(year, '-', RIGHT((Year+1)::VARCHAR, 2))"), 'display_text'],
            // 'year'
          ],
          raw: true,
          where: {
            year: year,
            season: season,
            crop_code: crop,
            spp_id: req.body.loginedUserid.id
          },
          // order:[['season','ASC']]                                    
        })
      } else {
        LotDetails = await db.carryOverSeedModel.findAll({
          include: [
            {
              model: db.carryOverSeedDetailsModel,
              include: [
                {
                  model: db.seedInventoryTag,
                  attributes: []
                }
              ],
              attributes: []
            },
            {
              model: db.seedInventory,
              attributes: [],
              where: {
                user_id: req.body.loginedUserid.id
              }
            }

          ],
          attributes: [
            'id',
            // [db.Sequelize.fn("Distinct", db.Sequelize.col("invest_verification->intake_verification_tags.lot_number")), "value"],
            [db.Sequelize.col("carry_over_seed_details.lot_no"), 'value'],
            [db.Sequelize.col("carry_over_seed_details->seed_inventries_tag.bag_size"), 'bag_size'],
            [db.Sequelize.col("carry_over_seed_details.lot_id"), 'lot_id'],
          ],
          raw: true,
          where: {
            year: year,
            season: season,
            crop_code: crop,
            meet_target: {
              [Op.in]: [1, 2]
            }
          },
          // order:[['season','ASC']]                                    
        })
      }



      if (LotDetails) {
        return response(res, status.DATA_AVAILABLE, 200, LotDetails)
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 200, {})
      }

    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500, error)
    }
  }
  static getCarryOverVarietiesGridSecond = async (req, res) => {
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
        'search.state_code': 'string',
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
      }

      let condition = {

        include: [
          {
            model: varietyModel,
            required: true,
            attributes: []
          },
          {
            model: db.carryOverSeedDetailsModel,

            attributes: []
          },
          {
            model: seedInventory,
            where: {
              user_id: req.body.loginedUserid.id
            },
            attributes: []
          }
        ],
        where: {
          is_active: 1,
          meet_target: {
            [Op.in]: [1, 2],
            ...production_type
          }
        },
        group: ['carry_over_seed.variety_code', 'm_crop_variety.variety_name', 'm_crop_variety.status'],
        raw: true,
        attributes: [
          [sequelize.col('carry_over_seed.variety_code'), 'value'],
          [sequelize.literal('m_crop_variety.variety_name'), 'display_text'],
          // [sequelize.literal('m_crop_variety.status'), 'variety_type'],
          'carry_over_seed.variety_code',
          [sequelize.literal('m_crop_variety.status'), 'variety_type'],
        ],

      };

      if (req.body.search) {
        if (req.body.search.year) {
          condition.where.year = {
            [Op.in]: req.body.search.year.toString().split(',')
          };
        }
        if (req.body.search.season) {
          condition.where.season = {
            [Op.in]: req.body.search.season.toString().split(',')
          };
        }
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
        if (req.body.search.user_id) {
          condition.where.user_id = {
            [Op.in]: req.body.search.user_id.toString().split(',')
          };
        }
      }

      condition.order = [[sequelize.col('variety_name'), 'asc']];
      const varietyList = await db.carryOverSeedModel.findAll(condition);

      returnResponse = {
        count: varietyList.length,
        rows: varietyList
      };

      return response(res, returnResponse.count ? status.DATA_AVAILABLE : status.DATA_NOT_AVAILABLE, 200, returnResponse, internalCall);
    } catch (error) {
      returnResponse = {
        error: error.message
      }
      console.log(error);
      response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }
  static forwardtoGenerateSlip = async (req, res) => {
    try {
      const { year, season, crop, variety, lot_id, total_breeder_qty, recovery_qty, tentative_recovery, total_rejected, under_size, processing_loss, spp, stack, godown_no, stackDatas, raw_seed_produced, action, total_bags, provision_lot,
        verify_id, carry_over_seed_details_id, carry_id, user_id, line_variety_code, class_of_seed, getRadio, classofSeedHarvestedData, carry_over_user_id } = req.body;
      console.log()
      const whereClause = {};
      const datas = await db.seedProcessingRegister.findAll({
        // where:{
        where: {
          year: year,
          season: season,
          crop_code: crop,
          variety_code: variety,
          lot_id: lot_id,
          action: 2,
          user_id: req.body.loginedUserid.id,
          // }
        },
        attributes: ['id'],
        raw: true
      })
      let investingResponse;
      if (datas && datas.length > 0) {
        const dataRow = {
          year: year ? year : null,
          season: season ? season : null,
          crop_code: crop ? crop : null,
          variety_code: variety ? variety : null,
          lot_id: lot_id ? lot_id : null,
          class_of_seed: classofSeedHarvestedData ? classofSeedHarvestedData : null,
          lot_qty: raw_seed_produced ? raw_seed_produced : null,
          godown_no: godown_no ? godown_no : null,
          stack_no: stackDatas ? stackDatas : null,
          total_processed_qty: total_breeder_qty ? total_breeder_qty : null,
          undersize_qty: under_size ? under_size : null,
          process_loss: processing_loss ? processing_loss : null,
          total_rejected_qty: total_rejected ? total_rejected : null,
          is_active: 1,
          no_of_bags: total_bags ? total_bags : null,
          action: action ? action : null,
          lot_no: provision_lot ? provision_lot : null,
          invest_verify_id: verify_id ? verify_id : null,
          tentative_qty: tentative_recovery ? tentative_recovery : null,
          recover_qty: recovery_qty ? recovery_qty : null,
          carr_over_seed_details_id: carry_over_seed_details_id ? carry_over_seed_details_id : null,
          carry_over_id: carry_id ? carry_id : null,
          user_id: user_id ? user_id : null,
          variety_code_line: line_variety_code ? line_variety_code : null,
          get_carry_over: getRadio ? getRadio : null,
        }

        const dataRow2 = {
          year: year ? year : null,
          season: season ? season : null,
          crop_code: crop ? crop : null,
          variety_code: variety ? variety : null,
          lot_id: lot_id ? lot_id : null,
          class_of_seed: class_of_seed ? class_of_seed : null,
          lot_qty: raw_seed_produced ? raw_seed_produced : null,
          godown_no: godown_no ? godown_no : null,
          stack_no: stackDatas ? stackDatas : null,
          no_of_bags: total_bags ? total_bags : null,
          lot_no: provision_lot ? provision_lot : null,
          user_id: user_id ? user_id : null,
          variety_code_line: line_variety_code ? line_variety_code : null
        }
        const investHarvesting = await db.seedProcessingRegister.update(dataRow,
          {
            where: {
              id: datas && datas[0] && datas[0].id ? datas[0].id : ''
            }
          }).then(function (item) {
            investingResponse = item['_previousDataValues'];
          })
        // const generateSampleSlipsData = await db.generateSampleSlipsModel.create(dataRow2).then(function (item) {
        //   investingResponse = item['_previousDataValues'];
        // })


        return response(res, status.DATA_SAVE, 200, investingResponse)
      } else {
        const dataRow = {
          year: year ? year : null,
          season: season ? season : null,
          crop_code: crop ? crop : null,
          variety_code: variety ? variety : null,
          lot_id: lot_id ? lot_id : null,
          class_of_seed: classofSeedHarvestedData ? classofSeedHarvestedData : null,
          lot_qty: raw_seed_produced ? raw_seed_produced : null,
          godown_no: godown_no ? godown_no : null,
          stack_no: stackDatas ? stackDatas : null,
          total_processed_qty: total_breeder_qty ? total_breeder_qty : null,
          undersize_qty: under_size ? under_size : null,
          process_loss: processing_loss ? processing_loss : null,
          total_rejected_qty: total_rejected ? total_rejected : null,
          is_active: 1,
          no_of_bags: total_bags ? total_bags : null,
          action: action ? action : null,
          lot_no: provision_lot ? provision_lot : null,
          invest_verify_id: verify_id ? verify_id : null,
          tentative_qty: tentative_recovery ? tentative_recovery : null,
          recover_qty: recovery_qty ? recovery_qty : null,
          carr_over_seed_details_id: carry_over_seed_details_id ? carry_over_seed_details_id : null,
          carry_over_id: carry_id ? carry_id : null,
          user_id: user_id ? user_id : null,
          variety_code_line: line_variety_code ? line_variety_code : null,
          get_carry_over: getRadio ? getRadio : null,
          bspc_id: carry_over_user_id ? carry_over_user_id : null
        }
        const dataRow2 = {
          year: year ? year : null,
          season: season ? season : null,
          crop_code: crop ? crop : null,
          variety_code: variety ? variety : null,
          lot_id: lot_id ? lot_id : null,
          class_of_seed: class_of_seed ? class_of_seed : null,
          lot_qty: raw_seed_produced ? raw_seed_produced : null,
          godown_no: godown_no ? godown_no : null,
          stack_no: stackDatas ? stackDatas : null,
          no_of_bags: total_bags ? total_bags : null,
          lot_no: provision_lot ? provision_lot : null,
          user_id: user_id ? user_id : null,
          variety_code_line: line_variety_code ? line_variety_code : null


        }

        const investHarvesting = await db.seedProcessingRegister.create(dataRow).then(function (item) {
          // investingResponse = item['_previousDataValues'];
        })
        // const generateSampleSlipsData = await db.generateSampleSlipsModel.create(dataRow2).then(function (item) {
        //   investingResponse = item['_previousDataValues'];
        // })


        return response(res, status.DATA_SAVE, 200, investingResponse)
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      return response(res, status.DATA_NOT_AVAILABLE, 500, error)
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  static getSeedProcessingRegDataCarrySecond = async (req, res) => {
    let returnResponse = {};
    const { internalCall } = req.body;
    try {
      let rules = {
        'search.year': 'string',
        'search.season': 'string',
        'search.crop_code': 'string',
        // 'search.user_id': 'required|string',
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
        let { user_id, crop_code, year, season, variety_code, variety_line_code, id, plotid, getRadio, lot_no } = req.body.search

        const whereClause2 = {};

        const whereClause = {};
        // const whereClause2 = {};

        if (year) {
          whereClause.year = parseInt(year);
        }
        if (season) {
          whereClause.season = season;
        }
        if (crop_code) {
          whereClause.crop_code = crop_code;
        }
        if (variety_code && variety_code.length > 0) {
          whereClause.variety_code = {
            [Op.in]: variety_code
          };
        }
        if (variety_line_code) {
          whereClause.variety_line_code = variety_line_code;
        }
        if (variety_line_code) {
          whereClause.variety_line_code = variety_line_code;
        }

        if (user_id) {
          whereClause.spp_id = (user_id).toString()
        }

        if (id) {
          whereClause.id = id;
        }
        if (plotid) {
          whereClause.plot_code = plotid
        }
        // if (lot_no) {
        //   whereClause2.id = lot_no
        // }
        if (lot_no) {
          whereClause2.lot_id = lot_no

        }
        if (!page) page = 1;
        let condition = {}
        condition = {
          include: [
            {
              model: seedInventory,
              on: {
                col1: sequelize.where(sequelize.col("seed_inventry.variety_code"), "=", sequelize.col("carry_over_seed.variety_code")),
                // col2: sequelize.where(sequelize.col("seed_inventry.line_variety_code"), "=", sequelize.col("carry_over_seed.variety_line_code")),
                col3: sequelize.where(sequelize.col("seed_inventry.bspc_id"), "=", sequelize.col("carry_over_seed.user_id")),
              },
              // required: false,
              // required: true,
              where: {
                user_id: req.body.loginedUserid.id,
                // year,
                // season,
                // crop_code,
                // ...whereClause
              },
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

            {
              model: db.carryOverSeedDetailsModel,
              include: [
                {
                  model: seedInventoryTag,
                  attributes: [],
                }
              ],
              where: whereClause2,
              include: [
                {
                  model: db.seedProcessingRegister,
                  include: [
                    {
                      model: db.SeedForProcessedStack,
                      attributes: []
                    }
                  ],
                  attributes: []
                },

              ],
              // as: 'caryOverDetails',
              // on: {
              //   col1: sequelize.where(sequelize.col("carry_over_seed_detail.id"), "=", sequelize.col("caryOverDetails.carry_over_seed_id")),
              // },
              // required: true,
              attributes: []
            },
          ],
          // where: {
          //   is_active: '1',
          // },
          raw: true,
          attributes: [
            [sequelize.col('m_crop.crop_name'), 'crop_name'],
            'crop_code', 'variety_code', 'total_qty', 'id', 'meet_target', 'is_freezed', 'user_id',
            [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
            [sequelize.col('m_variety_line.line_variety_name'), 'line_variety_name'],
            [sequelize.col('m_variety_line.line_variety_code'), 'line_variety_code'],
            [sequelize.col('carry_over_seed_details.stage_id'), 'stage_id'],
            [sequelize.col('carry_over_seed_details.class'), 'class'],
            [sequelize.col('carry_over_seed_details.lot_no'), 'lot_no'],
            [sequelize.col('carry_over_seed_details.lot_id'), 'lot_id'],
            [sequelize.col('carry_over_seed_details.tag_no'), 'tag_no'],
            [sequelize.col('carry_over_seed_details.year'), 'year_of_indent'],
            [sequelize.col('carry_over_seed_details.season'), 'seasonValue'],
            [sequelize.col('carry_over_seed_details.quantity_recieved'), 'quantity_recieved'],
            [sequelize.col('carry_over_seed_details.quantity_available'), 'quantity_available'],
            [sequelize.col('carry_over_seed_details->seed_processing_register.carr_over_seed_details_id'), 'carry_over_seed_details_data_id'],
            [sequelize.col('carry_over_seed_details->seed_processing_register.action'), 'action'],
            [sequelize.col('carry_over_seed_details->seed_processing_register.total_processed_qty'), 'total_processed_qty'],
            [sequelize.col('carry_over_seed_details->seed_processing_register.undersize_qty'), 'undersize_qty'],
            [sequelize.col('carry_over_seed_details->seed_processing_register.process_loss'), 'process_loss'],
            [sequelize.col('carry_over_seed_details->seed_processing_register.total_rejected_qty'), 'total_rejected_qty'],
            [sequelize.col('carry_over_seed_details->seed_processing_register.tentative_qty'), 'tentative_qty'],
            [sequelize.col('carry_over_seed_details->seed_processing_register.recover_qty'), 'recover_qty'],
            [sequelize.col('carry_over_seed_details.id'), 'carry_over_seed_details_id'],
            [sequelize.col('carry_over_seed_details->seed_processing_register.id'), 'seed_processing_register_id'],
            [sequelize.col('carry_over_seed_details->seed_processing_register.tentative_qty'), 'tentative_qty'],
            [sequelize.col('carry_over_seed_details.stage_id'), 'stage_id'],

          ],
          where: {
            meet_target: {
              [Op.in]: [1, 2]
            },
            is_freezed: 1,
            is_active: 1,
            // user_id:req.body.loginedUserid.id
          },
        };

        // const sortOrder = req.body.sort ? req.body.sort : 'id';
        // const sortDirection = req.body.order ? req.body.order : 'DESC';

        if (page && pageSize) {
          page = parseInt(page);
          condition.limit = parseInt(pageSize);
          condition.offset = (page * pageSize) - pageSize;
        }

        condition.order = [[sequelize.col('m_crop_variety.variety_name'), 'ASC']];

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
          // if (req.body.search.user_id) {
          //   condition.where.user_id = (req.body.search.user_id);
          // }
        }

        const queryData = await db.carryOverSeedModel.findAndCountAll(condition);
        let datas = [];
        let totalRecord = queryData.count;
        const lastPage = totalRecord ? ((totalRecord % (pageSize) === 0 ? (totalRecord / (pageSize)) : (parseInt(totalRecord / (pageSize)) + 1))) : 0;
        let filterData = [];
        let directIndentVarietyListTotal;
        let bsp1VarietyListArr = [];
        let bsp1VarietyList;
        let directIndentVarietyListTotalArr = [];
        let seedProcessId = []

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
                variety_line_code: queryData.rows[key].line_variety_code ? queryData.rows[key].line_variety_code : '',
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
                    variety_code_line: queryData.rows[key].line_variety_code ? queryData.rows[key].line_variety_code : '',
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
        let varietyData = [];
        console.log(datas, 'datasdatas')
        if (queryData && queryData.rows && queryData.rows.length > 0) {

          queryData.rows.forEach((el, index) => {
            seedProcessId.push(el && el.seed_processing_register_id ? el.seed_processing_register_id : '');
            varietyData.push(el && el.variety_code ? el.variety_code : '')
            let varietyIndex;
            if (el && el.line_variety_code) {
              varietyIndex = filterData.findIndex(item => item.variety_code == el.variety_code && item.line_variety_code == el.line_variety_code);
            } else {
              varietyIndex = filterData.findIndex(item => item.variety_code == el.variety_code);
            }
            if (varietyIndex == -1) {
              filterData.push({
                variety_code: el && el.variety_code ? el.variety_code : "",
                id: el && el.id ? el.id : "",
                variety_name: el && el.variety_name ? el.variety_name : "",
                line_variety_name: el && el.line_variety_name ? el.line_variety_name : "",
                line_variety_code: el && el.line_variety_code ? el.line_variety_code : "",
                meet_target: el && el.meet_target ? el.meet_target : "",
                id: el && el.id ? el.id : "",
                total_qty: el && el.total_qty ? el.total_qty : "",
                is_freezed: el && el.is_freezed ? el.is_freezed : '',
                seed_class_details: [
                  {
                    year: el && el.year_of_indent ? el.year_of_indent : '',
                    season: el && el.seasonValue ? el.seasonValue : '',
                    stage: el && el.stage_id ? el.stage_id : '',
                    lot_id: el && el.lot_id ? el.lot_id : '',
                    carry_id: el && el.id ? el.id : "",
                    lot_no: el && el.lot_no ? el.lot_no : '',
                    tag_no: el && el.tag_no ? el.tag_no : '',
                    quantity_recieved: el && el.quantity_recieved ? el.quantity_recieved : '',
                    quantity_available: el && el.quantity_available ? el.quantity_available : '',
                    carry_over_seed_details_data_id: el && el.carry_over_seed_details_data_id ? el.carry_over_seed_details_data_id : '',
                    carry_over_seed_details_id: el && el.carry_over_seed_details_id ? el.carry_over_seed_details_id : "",
                    action: el && el.action ? el.action : "",
                    process_loss: el && el.process_loss ? el.process_loss : "",

                    //         [sequelize.col('carry_over_seed_details->seed_processing_register.total_processed_qty'), 'total_processed_qty'],
                    // [sequelize.col('carry_over_seed_details->seed_processing_register.undersize_qty'), 'undersize_qty'],
                    // [sequelize.col('carry_over_seed_details->seed_processing_register.process_loss'), 'process_loss'],
                    // [sequelize.col('carry_over_seed_details->seed_processing_register.total_rejected_qty'), 'total_rejected_qty'],
                    // [sequelize.col('carry_over_seed_details->seed_processing_register.tentative_qty'), 'tentative_qty'],
                    // [sequelize.col('carry_over_seed_details->seed_processing_register.recover_qty'), 'recover_qty'],
                    total_processed_qty: el && el.total_processed_qty ? el.total_processed_qty : "",
                    undersize_qty: el && el.undersize_qty ? el.undersize_qty : "",
                    process_loss: el && el.process_loss ? el.process_loss : '',
                    total_rejected_qty: el && el.total_rejected_qty ? el.total_rejected_qty : '',
                    tentative_qty: el && el.tentative_qty ? el.tentative_qty : '',
                    recover_qty: el && el.recover_qty ? el.recover_qty : '',
                    stack_details: [],
                    seed_processing_register_id: el && el.seed_processing_register_id ? el.seed_processing_register_id : '',
                    stage_id: el && el.stage_id ? el.stage_id : '',
                    user_id: el && el.user_id ? el.user_id : '',

                  }
                ]
              })
            }
            else {
              let classIndex = filterData[varietyIndex].seed_class_details.findIndex(item => item.year == el.year && item.season == el.seasonValue && item.lot_id == el.lot_id);
              if (classIndex == -1) {
                filterData[varietyIndex].seed_class_details.push({
                  year: el && el.year_of_indent ? el.year_of_indent : '',
                  season: el && el.seasonValue ? el.seasonValue : '',
                  stage: el && el.stage_id ? el.stage_id : '',
                  lot_id: el && el.lot_id ? el.lot_id : '',
                  lot_no: el && el.lot_no ? el.lot_no : '',
                  tag_no: el && el.tag_no ? el.tag_no : '',
                  carry_id: el && el.id ? el.id : "",
                  quantity_recieved: el && el.quantity_recieved ? el.quantity_recieved : '',
                  quantity_available: el && el.quantity_available ? el.quantity_available : '',
                  carry_over_seed_details_id: el && el.carry_over_seed_details_id ? el.carry_over_seed_details_id : "",
                  carry_over_seed_details_data_id: el && el.carry_over_seed_details_data_id ? el.carry_over_seed_details_data_id : '',
                  action: el && el.action ? el.action : "",
                  total_processed_qty: el && el.total_processed_qty ? el.total_processed_qty : "",
                  undersize_qty: el && el.undersize_qty ? el.undersize_qty : "",
                  process_loss: el && el.process_loss ? el.process_loss : '',
                  total_rejected_qty: el && el.total_rejected_qty ? el.total_rejected_qty : '',
                  tentative_qty: el && el.tentative_qty ? el.tentative_qty : '',
                  recover_qty: el && el.recover_qty ? el.recover_qty : '',
                  seed_processing_register_id: el && el.seed_processing_register_id ? el.seed_processing_register_id : '',
                  action: el && el.action ? el.action : "",
                  stage_id: el && el.stage_id ? el.stage_id : '',
                  user_id: el && el.user_id ? el.user_id : '',
                  stack_details: []

                })
              } else {
                filterData[varietyIndex].seed_class_details.push({
                  tag_no: el && el.tag_no ? el.tag_no : '',
                  carry_id: el && el.id ? el.id : "",
                  carry_over_seed_details_id: el && el.carry_over_seed_details_id ? el.carry_over_seed_details_id : "",
                  action: el && el.action ? el.action : "",
                  carry_over_seed_details_data_id: el && el.carry_over_seed_details_data_id ? el.carry_over_seed_details_data_id : '',
                  total_processed_qty: el && el.total_processed_qty ? el.total_processed_qty : "",
                  undersize_qty: el && el.undersize_qty ? el.undersize_qty : "",
                  process_loss: el && el.process_loss ? el.process_loss : '',
                  total_rejected_qty: el && el.total_rejected_qty ? el.total_rejected_qty : '',
                  tentative_qty: el && el.tentative_qty ? el.tentative_qty : '',
                  recover_qty: el && el.recover_qty ? el.recover_qty : '',
                  seed_processing_register_id: el && el.seed_processing_register_id ? el.seed_processing_register_id : '',
                  action: el && el.action ? el.action : "",
                  stage_id: el && el.stage_id ? el.stage_id : '',
                  user_id: el && el.user_id ? el.user_id : '',
                  stack_details: []

                })
              }
            }


          })
        }
        let seedTags;
        seedProcessId = seedProcessId.filter(x => x != '')

        if (seedProcessId && seedProcessId.length > 0) {
          seedTags = await db.seedProcessingRegister.findAll(
            {
              include: [
                {
                  model: db.SeedForProcessedStack,
                  attributes: [],
                  where: {
                    seed_processing_register_id: {
                      [Op.in]: seedProcessId
                    },

                  },
                  // attributes:[]e
                }
              ],

              attributes: [
                // '*',
                [sequelize.col('seed_for_processed_stack.no_of_bag'), 'no_of_bag'],
                [sequelize.col('seed_for_processed_stack.godown_no'), 'godown_no'],
                [sequelize.col('seed_for_processed_stack.seed_processing_register_id'), 'seed_processing_register_id'],
                [sequelize.col('seed_for_processed_stack.stack_no'), 'stack_no'],
                [sequelize.col('seed_for_processed_stack.id'), 'id'],
              ],
              // required:true,
              raw: true
            },
          )
        }
        let bsp2Datas = await db.investHarvestingModel.findAll({
          include: [
            {
              model: db.bspPerformaBspTwo,
              attributes: [],
              include: [
                {
                  model: db.bspPerformaBspTwoSeed,
                  attributes: []
                },
                {
                  model: db.userModel,
                  attributes: []
                }
              ],
              where: {
                variety_code: {
                  [Op.in]: varietyData
                }
              }
            },

          ],
          attributes: [
            [sequelize.col('bsp_proforma_2->bsp_proforma_2_seed.seed_class_id'), 'seed_class_id'],
            [sequelize.col('bsp_proforma_2->bsp_proforma_2_seed.stage_id'), 'stage_id'],
            [sequelize.col('bsp_proforma_2->bsp_proforma_2_seed.variety_line_code'), 'variety_line_code'],
            [sequelize.col('bsp_proforma_2.variety_line_code'), 'line_variety_code'],
            [sequelize.col('invest_harvesting.variety_code'), 'variety_code'],
            [sequelize.col('invest_harvesting.plot_code'), 'plot_code'],
            [sequelize.col('bsp_proforma_2->user.code'), 'code']
          ],
          group: [
            [sequelize.col('bsp_proforma_2->bsp_proforma_2_seed.seed_class_id'), 'seed_class_id'],
            [sequelize.col('bsp_proforma_2->bsp_proforma_2_seed.stage_id'), 'stage_id'],
            [sequelize.col('bsp_proforma_2->bsp_proforma_2_seed.variety_line_code'), 'variety_line_code'],
            [sequelize.col('bsp_proforma_2.variety_line_code'), 'line_variety_code'],
            [sequelize.col('invest_harvesting.variety_code'), 'variety_code'],
            [sequelize.col('invest_harvesting.plot_code'), 'plot_code'],
            [sequelize.col('bsp_proforma_2->user.code'), 'code']
          ],
          raw: true,
          where: {
            spp_id: req.body.loginedUserid.id
            // year:year,
            // season:season,
            // crop_code:crop_code
          }

        })
        let bsp2Data = await db.bspPerformaBspTwo.findAll({
          include: [
            // {
            // model: db.bspPerformaBspTwo,
            // attributes: [],
            // include: [
            {
              model: db.bspPerformaBspTwoSeed,
              attributes: []
            },
            {
              model: db.userModel,
              attributes: []
            }
            // ],
            // }
          ],
          attributes: [
            [sequelize.col('bsp_proforma_2_seed.seed_class_id'), 'seed_class_id'],
            [sequelize.col('bsp_proforma_2_seed.stage_id'), 'stage_id'],
            [sequelize.col('bsp_proforma_2s.variety_line_code'), 'variety_line_code'],
            [sequelize.col('bsp_proforma_2s.variety_line_code'), 'line_variety_code'],
            // [sequelize.col('invest_harvesting.variety_code'), 'variety_code'],
            // [sequelize.col('invest_harvesting.plot_code'), 'plot_code'],
            [sequelize.col('user.code'), 'code']
          ],
          group: [
            [sequelize.col('bsp_proforma_2_seed.seed_class_id'), 'seed_class_id'],
            [sequelize.col('bsp_proforma_2_seed.stage_id'), 'stage_id'],
            [sequelize.col('bsp_proforma_2s.variety_line_code'), 'variety_line_code'],
            [sequelize.col('bsp_proforma_2s.variety_line_code'), 'line_variety_code'],
            // [sequelize.col('invest_harvesting.variety_code'), 'variety_code'],
            // [sequelize.col('invest_harvesting.plot_code'), 'plot_code'],
            [sequelize.col('user.code'), 'code']
          ],
          raw: true,
          where: {
            // year:year,
            // season:season,
            // crop_code:crop_code
          }

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
          returnResponse.bsp1VarietyListArr = bsp1VarietyListArr;
          returnResponse.seedTags = seedTags;
          returnResponse.bsp2Data = bsp2Datas;
          returnResponse.directIndentVarietyListTotalArr = directIndentVarietyListTotalArr
          return response(res, status.DATA_AVAILABLE, 200, returnResponse, internalCall);
        }
      }
    } catch (error) {
      returnResponse = {
        error: error.message
      }
      console.log(error, 'err');
      response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }

  static getSeedProcessingRegDataforfreshStock = async (req, res) => {
    try {
      const { user_id, crop_code, year, season, variety_code, variety_line_code, id, plotid, getRadio, lot_no } = req.body.search;

      const whereClause = {};
      const whereClause2 = {};

      if (year) {
        whereClause.year = parseInt(year);
      }
      if (season) {
        whereClause.season = season;
      }
      if (crop_code) {
        whereClause.crop_code = crop_code;
      }
      if (variety_code && variety_code.length > 0) {
        whereClause.variety_code = {
          [Op.in]: variety_code
        };
      }
      if (variety_line_code) {
        whereClause.variety_line_code = variety_line_code;
      }
      if (variety_line_code) {
        whereClause.variety_line_code = variety_line_code;
      }

      if (user_id) {
        whereClause.spp_id = (user_id).toString()
      }

      if (id) {
        whereClause.id = id;
      }
      if (plotid) {
        whereClause.plot_code = plotid
      }
      if (lot_no) {
        whereClause2.id = lot_no
      }
      let bspProforma3Data = await db.investHarvestingModel.findAll({
        include: [
          {
            model: cropModel,
            attributes: []
          },
          {
            model: varietyModel,
            attributes: []
          },
          {
            model: db.varietyLinesModel,
            attributes: []
          },
          {
            model: db.agencyDetailModel,
            attributes: []
          },
          {
            model: db.maxLotSizeModel,
            attributes: []
          },
          {
            model: db.investVerifyModel,

            attributes: [],
            required: true,
            // attributes: ['id'],
            include: [
              {
                model: db.userModel,
                attributes: []
                // attributes:['name']
              },
              {
                model: db.intakeVerificationTags,
                where: whereClause2,
                attributes: []

              },
              {
                model: db.seedProcessingRegister,
                include: [
                  {
                    model: db.SeedForProcessedStack,
                    attributes: [],
                  },
                ],
                attributes: []
              },
              {
                model: db.investVerifyStackCompositionModel2,
                attributes: []
              },
              {
                model: db.investHarvestingModel,

                attributes: []
              }
            ],
          },
        ],
        attributes: [
          '*',
          [sequelize.col('m_crop.crop_name'), 'crop_name'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [sequelize.col('m_variety_line.line_variety_name'), 'line_variety_name'],
          [sequelize.col('agency_detail.agency_name'), 'agency_name'],
          [sequelize.col('invest_verification.qty_recieved'), 'qty_recieved'],
          [sequelize.col('invest_verification.bag_recieved'), 'bag_recieved'],
          [sequelize.col('invest_verification.lot_num'), 'lot_num'],
          [sequelize.col('invest_verification.id'), 'verifyid'],
          [sequelize.col('m_max_lot_size.max_lot_size'), 'max_lot_size'],
          [sequelize.col('invest_verification->user.code'), 'spp_code'],
          [sequelize.col('invest_verification.provision_lot'), 'provision_lot'],
          [sequelize.col('invest_verification.provision_lot'), 'provision_lot'],
          [sequelize.col('invest_verification.qty_recieved'), 'raw_seed_produced'],
          [sequelize.col('invest_verification->intake_verification_tags.lot_number'), 'lot_number'],
          [sequelize.col('invest_verification->intake_verification_tags.id'), 'lot_id'],
          [sequelize.col('invest_verification->intake_verification_tags.qty'), 'lot_qty'],
          [sequelize.col('invest_verification->invest_verify_stack_compositions.godown_no'), 'godown_no'],
          [sequelize.col('invest_verification->seed_processing_register.undersize_qty'), 'undersize_qty'],
          [sequelize.col('invest_verification->seed_processing_register.total_processed_qty'), 'total_processed_qty'],
          [sequelize.col('invest_verification->seed_processing_register.total_rejected_qty'), 'total_rejected_qty'],
          [sequelize.col('invest_verification->seed_processing_register.id'), 'seed_processing_registers_data_id'],
          [sequelize.col('invest_verification->seed_processing_register->seed_for_processed_stack.godown_no'), 'godown_no_stack'],
          [sequelize.col('invest_verification->seed_processing_register->seed_for_processed_stack.no_of_bag'), 'no_of_bag_stack'],
          [sequelize.col('invest_verification->seed_processing_register->seed_for_processed_stack.stack_no'), 'stack_no_stack'],
          [sequelize.col('invest_verification->seed_processing_register->seed_for_processed_stack.seed_processing_register_id'), 'seed_processing_register_id_data'],
          [sequelize.col('invest_verification->seed_processing_register.action'), 'action'],
          [sequelize.col('invest_verification->seed_processing_register.process_loss'), 'process_loss'],
          [sequelize.col('invest_verification->seed_processing_register.lot_id'), 'process_lot_id'],
          // [sequelize.col('invest_verification->seed_processing_register.id'), 'process_lot_id'],
          [sequelize.col('invest_verification->seed_processing_register.recover_qty'), 'recover_qty'],
          [sequelize.col('invest_verification->seed_processing_register.tentative_qty'), 'tentative_qty'],
          [sequelize.col('invest_verification->invest_harvesting.user_id'), 'user_id'],


          // sequelize.col('invest_verification.id'), 'lot_id'],
          [sequelize.col('invest_verification->intake_verification_tags.id'), 'seed_processing_register_ids'],


        ],

        where: whereClause,
        raw: true
      })
      let filterData = []
      let bsp3Id = []
      let seedProcessId = []
      let varietyData = [];
      bspProforma3Data.forEach((el, index) => {
        bsp3Id.push(el && el.verifyid ? el.verifyid : '')
        seedProcessId.push(el && el.seed_processing_registers_data_id ? el.seed_processing_registers_data_id : '')
        varietyData.push(el && el.variety_code ? el.variety_code : '')
        let cropIndex
        if (el.variety_line_code) {
          cropIndex = filterData.findIndex(item => item.variety_code == el.variety_code && item.variety_line_code == el.variety_line_code);
        } else {
          cropIndex = filterData.findIndex(item => item.variety_code == el.variety_code);
        }
        if (cropIndex == -1) {
          filterData.push(
            {
              "variety_id": el && el.variety_id ? el.variety_id : '',
              "variety_code": el && el.variety_code ? el.variety_code : '',
              "crop_name": el && el.crop_name ? el.crop_name : '',
              "variety_name": el && el.variety_name ? el.variety_name : '',
              "line_variety_name": el && el.line_variety_name ? el.line_variety_name : '',
              "variety_line_code": el && el.variety_line_code ? el.variety_line_code : '',
              "variety_count": 1,
              "action": el && el.action ? el.action : '',
              "bsp_details": [
                {
                  "godown_no": el && el.godown_no ? el.godown_no : '',
                  "no_of_bags": el && el.no_of_bags ? el.no_of_bags : '',
                  "verifyid": el && el.verifyid ? el.verifyid : '',

                  "plotDetails":
                    [
                      {
                        "lot_number": el && el.lot_number ? el.lot_number : '',
                        "lot_id": el && el.lot_id ? el.lot_id : '',
                        "raw_seed_produced": el && el.raw_seed_produced ? el.raw_seed_produced : '',
                        "lot_qty": el && el.lot_qty ? el.lot_qty : '',
                        "total_processed_qty": el && el.total_processed_qty ? el.total_processed_qty : '',
                        "undersize_qty": el && el.undersize_qty ? el.undersize_qty : '',
                        "total_rejected_qty": el && el.total_rejected_qty ? el.total_rejected_qty : '',
                        "seed_processing_register_ids": el && el.seed_processing_register_ids ? el.seed_processing_register_ids : '',
                        "action": el && el.action ? el.action : '',
                        "process_lot_id": el && el.process_lot_id ? el.process_lot_id : '',
                        "tentative_qty": el && el.tentative_qty ? el.tentative_qty : '',
                        "recover_qty": el && el.recover_qty ? el.recover_qty : '',
                        "process_loss": el && el.process_loss ? el.process_loss : "",
                        "class_of_seed_harvested": el && el.class_of_seed_harvested ? el.class_of_seed_harvested : '',
                        "user_id": el && el.user_id ? el.user_id : '',
                        "seed_processing_registers_data_id": el && el.seed_processing_registers_data_id ? el.seed_processing_registers_data_id : '',
                        "stack_details": [
                          //  {
                          //   "godown_no_stack": el && el.godown_no_stack ? el.godown_no_stack : '',
                          //   "no_of_bag_stack": el && el.no_of_bag_stack ? el.no_of_bag_stack : '',                
                          //   "stack_no_stack": el && el.stack_no_stack ? el.stack_no_stack : '',
                          //   "seed_processing_register_ids": el && el.seed_processing_register_id_data ? el.seed_processing_register_id_data : '',
                          //  }
                        ]
                      }
                    ]
                }
              ]
            }
          )
        }
        else {
          let plotIndex = filterData[cropIndex].bsp_details.findIndex(item => item.verifyid == el.verifyid);

          if (plotIndex != -1) {
            // let plotIndexes = filterData[cropIndex].bsp_details[plotIndex].plotDetails.findIndex(item => item.seed_processing_registers_data_id == el.seed_processing_registers_data_id);
            // if (plotIndexes != -1) {

            // }
            filterData[cropIndex].bsp_details[plotIndex].plotDetails.push({
              "lot_number": el && el.lot_number ? el.lot_number : '',
              "lot_id": el && el.lot_id ? el.lot_id : '',
              "raw_seed_produced": el && el.raw_seed_produced ? el.raw_seed_produced : '',
              "lot_qty": el && el.lot_qty ? el.lot_qty : '',
              "total_processed_qty": el && el.total_processed_qty ? el.total_processed_qty : '',
              "undersize_qty": el && el.undersize_qty ? el.undersize_qty : '',
              "total_rejected_qty": el && el.total_rejected_qty ? el.total_rejected_qty : '',
              "seed_processing_register_ids": el && el.seed_processing_register_ids ? el.seed_processing_register_ids : '',
              "action": el && el.action ? el.action : '',
              "process_lot_id": el && el.process_lot_id ? el.process_lot_id : '',
              "tentative_qty": el && el.tentative_qty ? el.tentative_qty : '',
              "recover_qty": el && el.recover_qty ? el.recover_qty : '',
              "process_loss": el && el.process_loss ? el.process_loss : "",
              "class_of_seed_harvested": el && el.class_of_seed_harvested ? el.class_of_seed_harvested : '',
              "user_id": el && el.user_id ? el.user_id : '',
              "seed_processing_registers_data_id": el && el.seed_processing_registers_data_id ? el.seed_processing_registers_data_id : '',
              "stack_details": [
                // {
                //   "godown_no_stack": el && el.godown_no_stack ? el.godown_no_stack : '',
                //   "no_of_bag_stack": el && el.no_of_bag_stack ? el.no_of_bag_stack : '',                
                //   "stack_no_stack": el && el.stack_no_stack ? el.stack_no_stack : '',
                //   "seed_processing_register_ids": el && el.seed_processing_register_id ? el.seed_processing_register_id : '',
                // }                        
              ]

            })

          } else {
            filterData[cropIndex].bsp_details.push({
              "user_id": el && el.user_id ? el.user_id : '',
              "godown_no": el && el.godown_no ? el.godown_no : '',
              "no_of_bags": el && el.no_of_bags ? el.no_of_bags : '',
              "verifyid": el && el.verifyid ? el.verifyid : '',

              "plotDetails":
                [
                  {
                    "lot_number": el && el.lot_number ? el.lot_number : '',
                    "lot_id": el && el.lot_id ? el.lot_id : '',
                    "raw_seed_produced": el && el.raw_seed_produced ? el.raw_seed_produced : '',
                    "lot_qty": el && el.lot_qty ? el.lot_qty : '',
                    "total_processed_qty": el && el.total_processed_qty ? el.total_processed_qty : '',
                    "undersize_qty": el && el.undersize_qty ? el.undersize_qty : '',
                    "total_rejected_qty": el && el.total_rejected_qty ? el.total_rejected_qty : '',
                    "seed_processing_register_ids": el && el.seed_processing_register_ids ? el.seed_processing_register_ids : '',
                    "action": el && el.action ? el.action : '',
                    "process_lot_id": el && el.process_lot_id ? el.process_lot_id : '',
                    "tentative_qty": el && el.tentative_qty ? el.tentative_qty : '',
                    "recover_qty": el && el.recover_qty ? el.recover_qty : '',
                    "process_loss": el && el.process_loss ? el.process_loss : "",
                    "class_of_seed_harvested": el && el.class_of_seed_harvested ? el.class_of_seed_harvested : '',
                    "user_id": el && el.user_id ? el.user_id : '',
                    "seed_processing_registers_data_id": el && el.seed_processing_registers_data_id ? el.seed_processing_registers_data_id : '',
                    "stack_details": [
                      //   { "godown_no_stack": el && el.godown_no_stack ? el.godown_no_stack : '',
                      //   "no_of_bag_stack": el && el.no_of_bag_stack ? el.no_of_bag_stack : '',                
                      //   "stack_no_stack": el && el.stack_no_stack ? el.stack_no_stack : '',
                      //   "seed_processing_register_ids": el && el.seed_processing_register_id ? el.seed_processing_register_id : '',
                      // }                       
                    ]
                  }
                ]
            })
          }
          // let plotIndex = filterData.findIndex(item => item.variety_code == el.variety_code);

        }

      });
      // let seedTags = []
      let seedTags;
      seedProcessId = seedProcessId.filter(x => x != '')
      if (seedProcessId && seedProcessId.length > 0) {
        seedTags = await db.seedProcessingRegister.findAll(
          {
            include: [
              {
                model: db.SeedForProcessedStack,
                attributes: [],
                where: {
                  seed_processing_register_id: {
                    [Op.in]: seedProcessId
                  }
                },
                // attributes:[]e
              }
            ],

            attributes: [
              // '*',
              [sequelize.col('seed_for_processed_stack.no_of_bag'), 'no_of_bag'],
              [sequelize.col('seed_for_processed_stack.godown_no'), 'godown_no'],
              [sequelize.col('seed_for_processed_stack.seed_processing_register_id'), 'seed_processing_register_id'],
              [sequelize.col('seed_for_processed_stack.stack_no'), 'stack_no'],
              [sequelize.col('seed_for_processed_stack.id'), 'id'],
            ],
            // required:true,
            raw: true
          },
        )
      }
      // seedTags.push(datas)
      let bagData = [];
      if (bsp3Id && bsp3Id.length > 0) {
        bsp3Id = bsp3Id.filter(x => x != '')
      }
      const investHarvesting = await db.investVerifyStackCompositionModel.findAll({
        where: {
          invest_verify_id: {
            [Op.in]: bsp3Id
          }
        },
        // include:[
        //  {
        //     model:db.investHarvestingBagModel,
        //    where:{

        //    }
        //  }
        // ],


        raw: true,


      })

      // let bsp3Data = await db.bsp3p
      let bsp2Data = await db.investHarvestingModel.findAll({
        include: [
          {
            model: db.bspPerformaBspTwo,
            attributes: [],
            include: [
              {
                model: db.bspPerformaBspTwoSeed,
                attributes: []
              },
              {
                model: db.userModel,
                attributes: []
              }
            ],
          }
        ],
        attributes: [
          [sequelize.col('bsp_proforma_2->bsp_proforma_2_seed.seed_class_id'), 'seed_class_id'],
          [sequelize.col('bsp_proforma_2->bsp_proforma_2_seed.stage_id'), 'stage_id'],
          [sequelize.col('bsp_proforma_2->bsp_proforma_2_seed.variety_line_code'), 'variety_line_code'],
          [sequelize.col('bsp_proforma_2.variety_line_code'), 'line_variety_code'],
          [sequelize.col('invest_harvesting.variety_code'), 'variety_code'],
          [sequelize.col('invest_harvesting.plot_code'), 'plot_code'],
          [sequelize.col('bsp_proforma_2->user.code'), 'code']
        ],
        group: [
          [sequelize.col('bsp_proforma_2->bsp_proforma_2_seed.seed_class_id'), 'seed_class_id'],
          [sequelize.col('bsp_proforma_2->bsp_proforma_2_seed.stage_id'), 'stage_id'],
          [sequelize.col('bsp_proforma_2->bsp_proforma_2_seed.variety_line_code'), 'variety_line_code'],
          [sequelize.col('bsp_proforma_2.variety_line_code'), 'line_variety_code'],
          [sequelize.col('invest_harvesting.variety_code'), 'variety_code'],
          [sequelize.col('invest_harvesting.plot_code'), 'plot_code'],
          [sequelize.col('bsp_proforma_2->user.code'), 'code']
        ],
        raw: true,
        where: {
          // spp_id:10824,
          crop_code: req.body.search.crop_code
        }

      })
      let bspProforma3DataseedData
      if (varietyData && varietyData.length > 0) {
        bspProforma3DataseedData = await db.bspProrforma3Model.findAll({
          // where: whereClause,
          include: [
            {
              model: db.bspProrforma2Model,
              include: [
                {
                  model: db.bspPerformaBspTwoSeed,
                  attributes: []
                }
              ],
              as: 'bspProforma2',
              where: {
                variety_code: {
                  [Op.in]: varietyData
                }
              },
              attributes: []
            },


          ],
          attributes: [
            [sequelize.col('bspProforma2->bsp_proforma_2_seed.stage_id'), 'stage_id'],
            [sequelize.col('bspProforma2->bsp_proforma_2_seed.seed_class_id'), 'seed_class_id'],
            [sequelize.col('bspProforma2->bsp_proforma_2_seed.bsp_proforma_2_id'), 'bsp_proforma_2_id'],
            [sequelize.col('bspProforma2->bsp_proforma_2_seed.seed_class_id'), 'seed_class_id'],
            [sequelize.col('bspProforma2->bsp_proforma_2_seed.variety_line_code'), 'variety_line_code'],
            [sequelize.col('bspProforma2.variety_line_code'), 'line_variety_code'],
            'variety_code'
            // [sequelize.col('bspProforma2->bsp_proforma_2_seed.stage_id'), 'stage_id'],

            // [sequelize.fn('SUM', sequelize.col('bsp_proforma_3s.estimated_production')), 'estimated_production'],   

          ],
          raw: true
        })
      }
      // console.log(bsp2Data,'bsp2Data')
      let responseData = {
        filterData: filterData,
        bsp2Data: bsp2Data,
        seedTags: seedTags,
        investVerifyStackComposition: investHarvesting,
        bspProforma3DataseedData: bspProforma3DataseedData
      }




      return response(res, status.DATA_AVAILABLE, 200, responseData)
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: error });
    }
  };
}
module.exports = UserController


