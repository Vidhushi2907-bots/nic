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
const { allocationToSPASeed, allocationToSPAProductionCenterSeed, indenterSPAModel, indentOfBrseedDirectLineModel, sectorModel, deleteIndenteOfSpaModel, deleteIndenteOfBreederSeedModel, bspPerformaBspTwo, bspPerformaBspThree, bspPerformaBspOne, bspProformaOneBspc, monitoringTeamOfBspcMember, monitoringTeamOfBspc, seedInventory, seedClassModel, stageModel, seedInventoryTag, seedInventoryTagDetail, bspPerformaBspTwoSeed, varietyLineModel, mVarietyLinesModel } = require('../models');
const seedLabTestModel = db.seedLabTestModel;
const bpctoPlant = db.bspctoplantModel;
const generatBillsModel = db.generateBills;
const assignCropNewFlow = db.assignCropNewFlow;
const assignBspcCropNewFlow = db.assignBspcCropNewFlow;
const allocationToIndentorProductionCenterSeed = db.allocationToIndentorProductionCenterSeed
const allocationToIndentorSeed = db.allocationtoIndentorliftingseeds;
const seedProcessingRegisterModel = db.seedProcessingRegister;
const liftingSeedDetailsModel = db.liftingSeedDetailsModel;

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
const sendSms = require('../_helpers/sms')
const paginateResponseRaw = require("../_utility/generate-otp");
const moment = require("moment");
const crypto = require("crypto");
const https = require("https");
const Op = require('sequelize').Op;
class UserController {
  static addState = async (req, res) => {
    try {
      const data = stateModel.build({
        state_name: req.body.state_name,
        state_code: req.body.state_code,
        state_short_name: req.body.state_code
      });
      await data.save();
      return response(res, status.DATA_SAVE, 200, data)
    } catch (error) {
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    }
  }

  static createToken = async (req, res) => {
    try {
      let { id, login_token, validate_token } = req.body;
      validate_token = await AES.tokenEncryption(validate_token)
      let token = await AES.tokenEncryption({ id: id, login_token: login_token, validate_token: validate_token })
      console.log("dfdfdsfdf", AES.tokenDecryption(token))

      return response(res, status.DATA_SAVE, 200, token)
    } catch (error) {
      console.log("error", error)
      return response(res, status.INVALID_CREDENTIAL, 404)
    }
  }
  static verifySeednetToken = async (req, res) => {
    try {
      console.log("req.header('Authorization')", req.header('Authorization'))
      let token = req.header('Authorization').replace('Bearer ', '')
      token = await AES.tokenEncryption(token)
      console.log("token", token)
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      if (!decoded) {
        return response(res, status.EXPIRE_TOKEN, 401)
      }
      const userToken = await Token.findOne({ where: { user_id: decoded.id, token: token }, attributes: ['*'], raw: true });
      const users = await UserModel.findOne({ where: { id: decoded.id }, attributes: ['*'], raw: true })
      console.log("users.length", users.length)
      if ((!userToken || userToken.length == 0) && users.length) {
        response(res, status.INVALID_TOKEN, 401)
      } else {
        response(res, status.TOKEN_VARIFIED, 200)
      }
    } catch (error) {
      console.log("error", error)
      response(res, status.INVALID_TOKEN, 401)
    }
  }

  static login = async (req, res) => {
    try {
      //console.log("fsdfdsf");
      let loginToken = req.header('Authorization').replace('Bearer ', '')
      if (process.env.ENVIRONMENT == 'NIC') {
        loginToken = req.cookies['token'];

      }
      const secretKey = process.env.JWT_SECRET;
      const jwtData = JWT.verify(loginToken, secretKey);
      console.log("jwtData", jwtData);
      let userData = await userModel.findAll({
        where: {
          username: jwtData.unm
          // id: jwtData.id
        },
        raw: true

      });
      if (userData) {
        delete userData["password"];

        if (userData.length) {
          userData = userData[0];
        }
        let dataSet = [];
        let user_id = userData['id']
        let token = jwt.sign({ id: user_id, unm: userData['username'] }, process.env.JWT_SECRET, {});
        dataSet = ({ ...userData, token })
        const saveToken = Token.build({ token: token, user_id: user_id });
        await saveToken.save()
        delete dataSet["password"];

        return response(res, status.LOGIN_SUCCESS, 200, dataSet)
      } else {
        return response(res, status.INVALID_CREDENTIAL, 404)

      }

    } catch (error) {
      console.log("error", error)
      return response(res, status.INVALID_CREDENTIAL, 404)
    }
  }

  static viewState = async (req, res) => {
    let data = {};
    try {
      let condition = {
        where: {
          [Op.and]: [{
            state_name: {
              [Op.ne]: null
            }
          },
          {
            state_name: {
              [Op.ne]: ''
            }
          }
          ],
          is_state: 1
        }
      };

      // if (req.body.search) {
      //   if (req.body.search.state_code) {
      //     condition.where.state_code = req.body.search.state_code;
      //   }
      // }

      condition.order = [['state_name', 'ASC']];
      data = await stateModel.findAll(condition);
      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      //console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static getAllState = async (req, res) => {
    try {
      var data = {}
      let id = req.body.id;
      let filter = await ConditionCreator.masterFilter(req.body);
      //console.log(filter)

      if (id) {
        data = await stateModel.findAll({
          attributes: ['*',
            // [sequelize.col('districts.id'),'id'],
            [sequelize.col('states.id'), 'id'],
            [sequelize.col('states.state_name'), 'state_name'],
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
      //console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static editState = async (req, res) => {
    try {
      const id = req.body.id;
      const data = await stateModel.update({
        state_name: req.body.state_name,
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
      //console.log(error)
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
      //console.log(error)
      response(res, status.DATA_NOT_SAVE, 500)
    }
  }


  //post
  static addDistrict = async (req, res) => {
    try {
      const data = districtModel.build({
        state_name: req.body.state_name,
        district_name: req.body.district_name,
        district_code: req.body.district_code,
        state_code: req.body.state_code,
        state_short_name: req.body.state_code
      });
      await data.save();
      return response(res, status.DATA_SAVE, 200, data)
    } catch (error) {
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    }
  }

  static viewDistrict = async (req, res) => {
    let returnResponse = {};
    try {
      let condition = {
        where: {}
      };

      if (req.body.search) {
        if (req.body.search.state_code) {
          condition.where.state_code = req.body.search.state_code;
        }
        if (req.body.search.district_code) {
          condition.where.district_code = req.body.search.district_code;
        }
      }

      condition.order = [['district_name', 'ASC']];
      returnResponse = await districtModel.findAll(condition);
      return response(res, status.OK, 200, returnResponse);
    } catch (error) {
      returnResponse = {
        message: error.message
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
    // let data = {};
    // try {
    //   data = await districtModel.findAll();
    //   // res.send(data)

    //   response(res, status.DATA_AVAILABLE, 200, data)
    // } catch (error) {
    //   //console.log(error)
    //   response(res, status.DATA_NOT_AVAILABLE, 500)
    // }
  }

  static getDesignation = async (req, res) => {
    let data = {};
    try {
      data = await designationModel.findAll(
        {
          where: {
            type: 'SPP'
          },
          attributes: ['name']
        }
      );
      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static editDistrict = async (req, res) => {
    try {
      const id = req.body.id;
      const data = await districtModel.update({
        district_name: req.body.district_name,
        district_code: req.body.district_code
      }, {
        where: {
          id: id
        }
      })
      if (data) {
        response(res, status.DATA_UPDATED, 200, data)
      }
    } catch (error) {
      //console.log(error)
      response(res, status.DATA_NOT_SAVE, 500)
    }
  }

  static deleteDistrict = async (req, res) => {
    try {
      const id = req.body.id;
      const data = await districtModel.destroy({
        where: {
          id: id
        }
      })
      if (data) {
        response(res, status.DATA_DELETED, 200, data)
      }
    } catch (error) {
      //console.log(error)
      response(res, status.DATA_NOT_SAVE, 500)
    }
  }

  static test = async (req, res) => {
    try {

      response(res, "Api Working fine", 200, "Success")


    } catch (error) {
      //console.log(error)
      response(res, status.DATA_NOT_SAVE, 500)
    }
  }

  static addCrop = async (req, res) => {
    try {
      const data = cropModel.build({
        botanic_name: req.body.botanic_name,
        crop_code: req.body.crop_code,
        crop_name: req.body.crop_name,
        crop_group: req.body.crop_group,
        group_code: req.body.group_code,
        season: req.body.season,
        srr: req.body.srr,

      });
      await data.save();
      return response(res, status.DATA_SAVE, 200, data)
    } catch (error) {
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    }
  }

  static viewCrop = async (req, res) => {
    let data = {};
    //console.log('data1111111', data)

    try {
      let condition = {
        where: {

        }
      }
      condition.order = [['crop_name', 'ASC']];
      if (req.body.search) {
        if (req.body.search.breeder_id) {
          condition.where.breeder_id = parseInt(req.body.search.breeder_id);
        }
        if (req.body.search.year) {
        }
      }
      data = await cropModel.findAll(condition);
      //console.log('data', data)
      // res.send(data)

      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      //console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static viewCropBspReportData = async (req, res) => {
    let data = {};
    //console.log('data1111111', data)

    try {
      let condition = {
        include: [
          {
            model: cropModel,
            attributes: [],
            order: [['crop_name', 'ASC']],
            where: {
              crop_code: {
                [Op.like]: req.body.search.crop_type + "%",
              }
            }
          }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('bsp_1s.crop_code')), 'crop_code'],
          [sequelize.col('m_crop.crop_name'), 'crop_name']
        ],
        where: {},
        raw: true
      }
      if (req.body.search) {
        if (req.body.search.breeder_id) {
          condition.include[0].where.breeder_id = parseInt(req.body.search.breeder_id);
        }
        if (req.body.search.year) {
          condition.where.year = parseInt(req.body.search.year);
        }
        if (req.body.search.season) {
          condition.where.season = req.body.search.season;
        }
      }

      data = await bsp1Model.findAll(condition);
      //console.log('data', data)
      // res.send(data)

      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static editCrop = async (req, res) => {
    try {
      const id = req.body.id;
      const data = await cropModel.update({
        crop_name: req.body.crop_name,
        crop_code: req.body.crop_code
      }, {
        where: {
          id: id
        }
      })
      if (data) {
        response(res, status.DATA_UPDATED, 200, data)
      }
    } catch (error) {
      //console.log(error)
      response(res, status.DATA_NOT_SAVE, 500)
    }
  }

  static deleteCrop = async (req, res) => {
    try {
      const id = req.body.id;
      const data = await cropModel.destroy({
        where: {
          id: id
        }
      })
      if (data) {
        response(res, status.DATA_DELETED, 200, data)
      }
    } catch (error) {
      //console.log(error)
      response(res, status.DATA_NOT_SAVE, 500)
    }
  }

  static addUser = async (req, res) => {
    let returnResponse = {};
    // let saveData = JSON.parse(req.body);
    let saveData = req.body;
    try {
      let rules = {
        'agency_id': 'required|integer',
        'designation_id': 'required|integer',
        'email_id': 'email_id',
        'mobile_number': 'integer|digits:10',
        'name': 'string',
        'username': 'string',
        'password': 'string',
        'user_type': 'string',
        'contact_person_name': 'string',
      };

      // let validation = new Validator(saveData, rules);

      // const isValidData = validation.passes();

      // if (!isValidData) {
      //   let errorResponse = {};
      //   for (let key in rules) {
      //     const error = validation.errors.get(key);
      //     if (error.length) {
      //       errorResponse[key] = error;
      //     }
      //   }
      //   return response(res, status.BAD_REQUEST, 400, errorResponse)
      // }

      // let userData = await userModel.findAll({
      //   where: {
      //     [Op.or]: [{ email_id: req.body.email_id }],
      //     is_active: 1
      //   }
      // });

      // if ((userData && userData.length)) {
      //   const errorResponse = {
      //     id: 'Email Id is already registered.'
      //   }
      //   return response(res, status.USER_EXISTS, 409, errorResponse)
      // } else {

      //   userData = await userModel.findAll({
      //     where: {
      //       [Op.or]: [{ username: req.body.username }],
      //       is_active: 1
      //     }
      //   });

      //   if ((userData && userData.length)) {
      //     const errorResponse = {
      //       id: 'Username is already registered.'
      //     }
      //     return response(res, status.USER_EXISTS, 409, errorResponse)
      //   }

      // }

      const data = userModel.build({
        username: req.body.username,
        name: req.body.name,
        email_id: req.body.email_id,
        password: req.body.password,
        mobile_number: req.body.mobile_number,
        designation_id: req.body.designation_id,
        agency_id: req.body.agency_id,
        user_type: req.body.user_type,
        contact_person_name: req.body.contact_person_name,
      });
      await data.save();
      // //console.log('userInsertData',userInsertData);

      // await userModel.create(userInsertData).then(function (item) {
      //   userResponse = item['_previousDataValues'];
      // }).catch(function (err) {
      //   isDbError = true;
      //   errorMessage = {
      //     success: false,
      //     message: err.message
      //   };
      //   //console.log('User Table Error: ', errorMessage);
      // });
      // returnResponse.userDetails = userResponse;


      return response(res, status.DATA_SAVE, 200, data)
    } catch (error) {
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    }
  }

  static getUserById = async (req, res) => {

    try {
      const condition = {
        where: {
          id: Number(req.params.id)
        },
        include: [
          {
            model: agencyDetailModel,
            left: true,
            attributes: ['id', 'short_name']

          },
        ],
      };
      let data = await userModel.findOne(condition);

      if (!data) {
        return response(res, status.DATA_NOT_AVAILABLE, 404);
      }

      return response(res, status.DATA_AVAILABLE, 200, data);
    }
    catch (error) {
      const returnResponse = {
        message: error.message,
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }

  }

  static getUserCodeById = async (req, res) => {

    try {

      const condition = {
        where: {
          id: Number(req.params.id)
        },
        attributes: ['id', 'code']
      };
      let data = await userModel.findOne(condition);

      if (!data) {
        return response(res, status.DATA_NOT_AVAILABLE, 404);
      }

      return response(res, status.DATA_AVAILABLE, 200, data);
    }
    catch (error) {
      const returnResponse = {
        message: error.message,
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }

  }

  static getAgencyUserById = async (req, res) => {
    try {
      const condition = {
        where: {
          id: Number(req.params.id)
        },
        attributes: ['id', 'short_name', 'agency_name']
      };
      let data = await agencyDetailModel.findOne(condition);
      if (!data) {
        return response(res, status.DATA_NOT_AVAILABLE, 404);
      }

      return response(res, status.DATA_AVAILABLE, 200, data);
    }
    catch (error) {
      const returnResponse = {
        message: error.message,
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }

  }

  static viewUser = async (req, res) => {
    let data = {};
    try {
      data = await userModel.findAll();
      // res.send(data)

      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      //console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static editUser = async (req, res) => {
    try {
      const id = req.body.id;
      const data = await userModel.update({
        name: req.body.name,
        mobile_number: req.body.mobile_number,
        designation_id: req.body.designation_id,
        agency_id: req.body.agency_id,
        contact_person_name: req.body.contact_person_name,
      }, {
        where: {
          id: id
        }
      })
      if (data) {
        response(res, status.DATA_UPDATED, 200, data)
      }
    } catch (error) {
      //console.log(error)
      response(res, status.DATA_NOT_SAVE, 500)
    }
  }

  static editUserData = async (req, res) => {
    try {

      console.log('updates', req.body);
      const id = req.body.id;
      const data = await userModel.update({
        agency_id: id,
        username: req.body.email,
        name: req.body.display_name,
        email_id: req.body.email,
        unm: req.body.email,
        password: '123456',
        mobile_number: req.body.mobile,
        // designation_id: req.body.contact_person_designation,
        user_type: 'IN',
        is_active: req.body.active
      },
        {
          where: {
            agency_id: id
          }
        }
      )

      const userId = await agencyDetailModel.update({
        user_id: parseInt(req.body.agency_id)
      }, {
        where: {
          // user_id:
          id: id
        }
      }
      )
      // await userId
      console.log('data============', data);
      if (data) {
        response(res, status.DATA_UPDATED, 200, data)
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_SAVE, 500)
    }
  }
  static deleteUser = async (req, res) => {
    try {
      const id = req.body.id;
      const data = await userModel.destroy({
        where: {
          id: id
        }
      })
      if (data) {
        response(res, status.DATA_DELETED, 200, data)
      }
    } catch (error) {
      //console.log(error)
      response(res, status.DATA_NOT_SAVE, 500)
    }
  }

  static viewVariety = async (req, res) => {
    let data = {};
    try {
      let condition = {};
      if (req.body && req.body.search) {
        condition["where"] = req.body.search;
      }

      condition.order = [['variety_name', 'ASC']];
      data = await varietyModel.findAll(condition);
      // res.send(data)

      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      //console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static viewIndentingVariety = async (req, res) => {
    let data = {};
    try {
      let condition = {
        include: [
          {
            model: varietyModel,
            // attributes//:['id','variety_name'],
            // order: [['variety_name', 'ASC']]
            // left:true
          }
        ],
        attributes: [
          [sequelize.col('m_crop_variety.id'), 'id'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name']]
      };
      if (req.body && req.body.search) {
        condition["where"] = req.body.search;
      }

      // condition.order = [['variety_name', 'ASC']];
      // data = await varietyModel.findAll(condition);
      data = await indentOfBreederseedModel.findAll(condition);
      // res.send(data)

      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static cropVarietyYear = async (req, res) => {
    let data = {};
    try {
      let condition = {
        attributes: ['id', 'variety_code', 'variety_name', 'created_at', 'not_date'],
        where: {}
      }

      if (req.body.search) {
        if (req.body.search.variety_id) {
          condition.where.id = req.body.search.variety_id;
        }
      }

      // condition.order = [['variety_name', 'ASC']];
      data = await varietyModel.findAll(condition);
      // res.send(data)

      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      //console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  // static addIndentor = async (req, res) => {
  //   let returnResponse = {};
  //   try {
  //     let IndentorData = await agencyDetailModel.findAll({
  //       where: {
  //         [Op.or]: [{ agency_name:req.body.agency_name }],
  //         [Op.and]: [{ short_name:req.body.display_name.toUpperCase()}],
  //         // is_active: 1
  //       }
  //     });

  //     // if ((subscriberData && subscriberData.length)) {
  //     //   const errorResponse = {
  //     //     subscriber_id: 'Mobile no is already registered. Please fill form correctly'
  //     //   }
  //     //   return response(res, status.USER_EXISTS, 409, errorResponse)
  //     // }


  //     const data = agencyDetailModel.build({
  //       agency_name: req.body.agency_name,
  //       created_by: 1,//req.body.created_by,
  //       category: req.body.category_agency,
  //       state_id: req.body.state,
  //       district_id: req.body.district,
  //       short_name: req.body.display_name.toUpperCase(),
  //       address: req.body.address,
  //       pincode: req.body.pincode,
  //       contact_person_name: req.body.contact_person_name,
  //       contact_person_designation: req.body.contact_person_designation,
  //       contact_person_mobile: req.body.mobile,
  //       mobile_number: req.body.mobile,
  //       phone_number: req.body.phone,
  //       fax_no: req.body.fax_number,
  //       longitude: req.body.longitude,
  //       latitude: req.body.latitude,
  //       email: req.body.email,
  //       is_active:1
  //     });

  //     const insertData = await data.save();

  //     const userData = userModel.build({
  //       agency_id: insertData.id,
  //       username: req.body.email,
  //       name: req.body.display_name,
  //       email_id: req.body.email,
  //       unm: req.body.email,
  //       password: '123456',
  //       mobile_number: req.body.mobile,
  //       // designation_id: req.body.contact_person_designation,
  //       user_type: 'IN',
  //     });
  //     await userData.save();
  //     console.log(userData.id, 'userData.id');
  //     const datas = agencyDetailModel.update({
  //       user_id: userData.id
  //     }, {
  //       where: {
  //         id: insertData.id
  //       }
  //     })
  //     // console.log(userData.id);
  //     // await datas.save();

  //     return response(res, status.DATA_SAVE, 200, insertData)
  //   } catch (error) {
  //     returnResponse = {
  //       message: error.message
  //     };
  //     console.log(error);
  //     return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
  //   }
  // }

  static addIndentor = async (req, res) => {
    let returnResponse = {};
    let internalCall = {};
    let condition = {};
    let mobileno;
    try {
      let existingAgencyData = undefined;
      let existingData = undefined;
      if (req.body.mobile_number) {
        mobileno = req.body.mobile_number;
      } else if (req.body.mobile) {
        mobileno = req.body.mobile;
      }
      let tabledAlteredSuccessfully = false;
      const usersData = {
        agency_name: (req.body.agency_name) ? (req.body.agency_name).replace(/\s+/g, ' ').trim().toUpperCase() : '',
        created_by: req.body.created_by,// 1,
        category: req.body.category_agency,
        state_id: req.body.state,
        district_id: req.body.district,
        short_name: ((req.body.display_name).trim()).toUpperCase(),
        address: req.body.address,
        contact_person_name: (req.body.contact_person_name) ? (req.body.contact_person_name).replace(/\s+/g, ' ').trim() : '',
        contact_person_designation: req.body.contact_person_designation_id,
        contact_person_designation: req.body.contact_person_designation,
        contact_person_designation_id: req.body.contact_person_designation_id,
        // contact_person_mobile: req.body.mobile_number,
        phone_number: req.body.phone,
        fax_no: req.body.fax_number,
        longitude: req.body.longitude,
        latitude: req.body.latitude,
        email: req.body.email,
        bank_name: req.body.bank_name,
        bank_branch_name: req.body.bank_branch_name,
        bank_ifsc_code: req.body.bank_ifsc_code,
        bank_account_number: req.body.bank_account_number,
        // state_id: req.body.state_id,
        // district_id: req.body.district_id,
        mobile_number: mobileno,
        pincode: req.body.pincode
      }
      existingAgencyData = await agencyDetailModel.findAll({
        include: [
          {
            model: userModel,
            where: {
              user_type: "IN"
            }

          }
        ],
        where: {
          [Op.and]: [
            {
              where: sequelize.where(
                sequelize.fn('lower', sequelize.col('agency_name')),
                sequelize.fn('lower', req.body.agency_name),

                // created_by:{[Op.and]:req.body.createdby}
              ),
              created_by: { [Op.eq]: req.body.created_by }

            },



          ]
        },



      });
      if (existingAgencyData && existingAgencyData.length) {
        returnResponse = {
          error: 'Agency Name Already exist'
        }
        return response(res, status.DATA_NOT_SAVE, 401, returnResponse)
      }


      existingData = await agencyDetailModel.findAll({
        include: [
          {
            model: userModel,
            where: {
              // user_type: "IN"
            }

          }
        ],
        // where: sequelize.where(
        //   sequelize.fn('lower', sequelize.col('short_name')),
        //   sequelize.fn('lower', req.body.display_name),
        // )
        where: {
          [Op.and]: [
            {
              where: sequelize.where(
                sequelize.fn('lower', sequelize.col('short_name')),
                sequelize.fn('lower', req.body.display_name),
              ),
              created_by: { [Op.eq]: req.body.created_by }
            },


          ]
        },
      });


      if (existingData.length != 0) {

        returnResponse = {
          error: 'Short Name is Already exist'
        }

        return response(res, status.DATA_NOT_SAVE, 401, returnResponse)
      }
      let existingEmaiData = await agencyDetailModel.findAll({
        // where: sequelize.where(
        //   sequelize.fn('lower', sequelize.col('short_name')),
        //   sequelize.fn('lower', req.body.display_name),
        // )
        where: {
          [Op.and]: [
            {
              where: sequelize.where(
                sequelize.fn('lower', sequelize.col('email')),
                sequelize.fn('lower', req.body.email),
              ),

            },


          ]
        },
      });
      if (existingEmaiData.length != 0) {
        returnResponse = {
          error: 'Email is Already exist'
        }

        return response(res, status.DATA_NOT_SAVE, 403, returnResponse)
      }

      let userData;
      if (existingData === undefined || existingData.length < 1) {
        const data = agencyDetailModel.build(usersData);
        const insertData = await data.save();
        userData = userModel.build({
          agency_id: insertData.id,
          username: 'ind' + '-' + (req.body.display_name).trim().toLowerCase(),
          name: req.body.display_name,
          email_id: req.body.email,
          unm: 'ind' + '-' + (req.body.display_name).trim().toLowerCase(),
          password: '123456',
          mobile_number: mobileno,
          // designation_id: req.body.contact_person_designation,
          user_type: 'IN',
        });
        const insertUserData = await userData.save();
        await agencyDetailModel.update({ "user_id": insertUserData.id }, { where: { id: insertUserData.agency_id } });
        tabledAlteredSuccessfully = true;
        const USER_API_KEY = process.env.USER_API_KEY
        let seedUserData = {
          "appKey": USER_API_KEY,
          "stateCode": "CENTRAL",
          "userid": 'ind' + '-' + (req.body.display_name).trim().toLowerCase(),
          "password": "seeds#234",
          "name": req.body.display_name,
          "role": "IN"
        }
        // await SeedUserManagement.createUser(seedUserData);
      }

      if (tabledAlteredSuccessfully) {
        return response(res, status.DATA_SAVE, 200, userData, internalCall)
      } else {
        return response(res, status.DATA_NOT_SAVE, 404, userData, internalCall)
      }
      // if (tabledAlteredSuccessfully) {
      //   return response(res, status.DATA_SAVE, 200, returnResponse, internalCall)
      // } else {
      //   return response(res, status.DATA_NOT_SAVE, 401, returnResponse, internalCall)
      // }



      // if (req.body.search) {
      //   condition.where = {};
      //   if (req.body.search.state_id) {
      //     condition.where.state_id = parseInt(req.body.search.state_id);

      //   }
      //   if (req.body.search.state_id) {
      //     condition.where.state_id = parseInt(req.body.search.state_id);

      //   }
      //   let data = await agencyDetailModel.findAndCountAll(condition);
      //   if (data) {

      //     return response(res, status.DATA_AVAILABLE, 200, data)
      //   }
      //   else {
      //     return response(res, status.DATA_NOT_AVAILABLE, 400)
      //   }
      // }
      // return response(res, status.DATA_SAVE, 200, insertData)


    } catch (error) {
      returnResponse = {
        message: error.message
      };
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }

  static addPlantDetailsTemp = async (req, res) => {
    let returnResponse = {};
    let internalCall = {};
    let condition = {};
    let mobileno;
    try {
      let existingAgencyData = undefined;
      let existingData = undefined;
      if (req.body.mobile_number) {
        mobileno = req.body.mobile_number;
      } else if (req.body.mobile) {
        mobileno = req.body.mobile;
      }
      let tabledAlteredSuccessfully = false;
      const plantData = {
        plant_name: (req.body.plant_name).toUpperCase(),
        created_by: req.body.created_by,// 1,
        // category: req.body.category,
        state_id: req.body.state_id,
        district_id: req.body.district_id,
        // short_name: ((req.body.short_name)),
        address: req.body.address,
        contact_person_name: req.body.contact_person_name,
        contact_person_designation_id: req.body.contact_person_designation_id,
        contact_person_mobile: (req.body.mobile_number).toString(),
        // phone_number: req.body.phone_no,
        // fax_no: req.body.fax_no,
        longitude: req.body.longitude,
        latitude: req.body.latitude,
        email: req.body.email,
        mobile_number: (req.body.mobile_number).toString(),
        // pincode: req.body.pincode,
        updated_by: req.body.updated_by,
        user_id: req.body.user_id,
        is_active: req.body.active,
        name_of_spa: req.body.name_of_spa
      }
      if (req.body.id) {
        existingAgencyData = await plantDetailsModel.findAll({
          where: {
            [Op.and]: [
              {
                where: sequelize.where(
                  sequelize.fn('lower', sequelize.col('plant_name')),
                  sequelize.fn('lower', req.body.plant_name),),
                // created_by: { [Op.eq]: req.body.created_by }
                id: { [Op.ne]: req.body.id },
              },


            ]
          },
        });
        if (existingAgencyData && existingAgencyData.length) {
          returnResponse = {
            error: 'Name of the Institute Already Exist'
          }
          return response(res, status.DATA_NOT_SAVE, 401, returnResponse)
        }
        // plantData.id = req.body.id;
        await plantDetailsModel.update(plantData, { where: { id: req.body.id } });
        if (plantDetailsModel) {
          return response(res, status.DATA_UPDATED, 200, returnResponse, internalCall)
        } else {
          return response(res, status.DATA_NOT_SAVE, 404, returnResponse, internalCall)
        }
      }

      if (!req.body.id) {
        existingAgencyData = await plantDetailsModel.findAll({
          where: {
            [Op.and]: [
              {
                where: sequelize.where(
                  sequelize.fn('lower', sequelize.col('plant_name')),
                  sequelize.fn('lower', req.body.plant_name),),
                // created_by: { [Op.eq]: req.body.created_by }

              },
            ]
          },
        });
        if (existingAgencyData && existingAgencyData.length) {
          returnResponse = {
            error: 'Plant Name is Already exist'
          }
          return response(res, status.DATA_NOT_SAVE, 401, returnResponse)
        }


        // if (existingData.length != 0) {
        //   returnResponse = {
        //     error: 'Short Name is Already exist'
        //   }
        //   return response(res, status.DATA_NOT_SAVE, 401, returnResponse)
        // }
        if ((existingData === undefined || existingData.length < 1)) {
          const user_code = await plantDetailsModel.max('code')
          console.log('user_code', user_code)
          const code = user_code == null || user_code == undefined || user_code == '' ? 1 : parseInt(user_code) + 1;
          let userFinalCode = code <= 9 ? '00' + (code).toString() : parseInt(code) <= 99 ? '0' + (code).toString() : code.toString();
          let userCode = await plantDetailsModel.findAll({
            where: {
              code: userFinalCode
            }
          });
          if (userCode === undefined || userCode.length < 1) {
            plantData.code = userFinalCode;
            const data = plantDetailsModel.build(plantData);
            const insertData = await data.save();
            if (insertData) {
              return response(res, status.DATA_SAVE, 200, returnResponse, internalCall)
            } else {
              return response(res, status.DATA_NOT_SAVE, 404, returnResponse, internalCall)
            }
          } else {
            return response(res, status.DATA_NOT_SAVE, 404, returnResponse, internalCall)
          }
        }
      }
    } catch (error) {
      returnResponse = {
        message: error.message
      };
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }

  static addPlantDetails = async (req, res) => {
    let returnResponse = {};
    let internalCall = {};
    let condition = {};
    let mobileno;
    try {
      let existingAgencyData = undefined;
      let existingData = undefined;
      if (req.body.mobile_number) {
        mobileno = req.body.mobile_number;
      } else if (req.body.mobile) {
        mobileno = req.body.mobile;
      }
      let tabledAlteredSuccessfully = false;
      const plantData = {
        agency_name: (req.body.plant_name).toUpperCase(),//plant name
        created_by: req.body.created_by,// 1,
        // category: req.body.category,
        state_id: req.body.state_id,
        district_id: req.body.district_id,
        // short_name: ((req.body.short_name)),
        address: req.body.address,
        contact_person_name: req.body && req.body.contact_person_name ? req.body.contact_person_name : '',
        contact_person_designation_id: req.body.contact_person_designation_id,
        contact_person_mobile: (req.body.mobile_number).toString(),
        // phone_number: req.body.phone_no,
        // fax_no: req.body.fax_no,
        longitude: req.body.longitude,
        latitude: req.body.latitude,
        // email: req.body.email,
        mobile_number: (req.body.mobile_number).toString(),
        // pincode: req.body.pincode,
        updated_by: req.body.updated_by,
        user_id: req.body.user_id,
        is_active: req.body.active,
        // name_of_spa: req.body.name_of_spa
      }
      if (req.body.id) {
        existingAgencyData = await agencyDetailModel.findAll({
          where: {
            [Op.and]: [
              {
                where: sequelize.where(
                  sequelize.fn('lower', sequelize.col('agency_name')),
                  sequelize.fn('lower', req.body.plant_name),),
                // created_by: { [Op.eq]: req.body.created_by }
                id: { [Op.ne]: req.body.id },
              },


            ]
          },
        });
        if (existingAgencyData && existingAgencyData.length) {
          returnResponse = {
            error: 'Name of the Institute Already Exist'
          }
          return response(res, status.DATA_NOT_SAVE, 401, returnResponse)
        }
        // plantData.id = req.body.id;
        const data = agencyDetailModel.update(plantData, { where: { id: req.body.id } });
        // const insertData = await data.save();
        // const userData = userModel.update({
        //   // agency_id: insertData.id,
        //   // username: req.body.email,
        //   name: req.body.name_of_spa,
        //   // email_id: req.body.email,
        //   // unm: req.body.email,
        //   password: '123456',
        //   // code:userFinalCode,
        //   mobile_number: (req.body.mobile_number).toString(),
        //   // designation_id: req.body.contact_person_designation,
        //   user_type: 'SPP',
        // }, { where: { agency_id: req.body.id } });
        // await agencyDetailModel.update(plantData, { where: { id: req.body.id } });
        if (data) {
          return response(res, status.DATA_UPDATED, 200, returnResponse, internalCall)
        } else {
          return response(res, status.DATA_NOT_SAVE, 404, returnResponse, internalCall)
        }
      }

      if (!req.body.id) {
        existingAgencyData = await agencyDetailModel.findAll({
          where: {
            [Op.and]: [
              {
                where: sequelize.where(
                  sequelize.fn('lower', sequelize.col('agency_name')),
                  sequelize.fn('lower', req.body.plant_name),),
                // created_by: { [Op.eq]: req.body.created_by }

              },
            ]
          },
        });
        if (existingAgencyData && existingAgencyData.length) {
          returnResponse = {
            error: 'Plant Name is Already exist'
          }
          return response(res, status.DATA_NOT_SAVE, 401, returnResponse)
        }


        // if (existingData.length != 0) {
        //   returnResponse = {
        //     error: 'Short Name is Already exist'
        //   }
        //   return response(res, status.DATA_NOT_SAVE, 401, returnResponse)
        // }
        // if ((existingData === undefined || existingData.length < 1)) {
        // const user_code = await userModel.max('code', { where: { user_type: 'SPP' } })
        let user_code;
        const maxValue = await userModel.findOne({
          attributes: ['code'],
          where: { user_type: 'SPP' },
          order: [['code', 'DESC']],
          limit: 1
        });
        if (maxValue) {
          user_code = maxValue.code;
        }

        console.log('user_code', user_code)
        const code = user_code == null || user_code == undefined || user_code == '' ? 1 : parseInt(user_code) + 1;
        let userFinalCode = code <= 9 ? '00' + (code).toString() : parseInt(code) <= 99 ? '0' + (code).toString() : code.toString();
        let userCode = await userModel.findAll({
          where: {
            code: userFinalCode ? userFinalCode.toString() : ''
          }
        });
        // if (userCode === undefined || userCode.length < 1) {
        // plantData.code = userFinalCode;
        const data = agencyDetailModel.build(plantData);
        const insertData = await data.save();
        const userData = userModel.build({
          agency_id: insertData.id,
          username: 'spp' + '-' + userFinalCode,
          name: req.body.name_of_spa,
          // email_id: req.body.email,
          unm: 'spp' + '-' + userFinalCode,
          password: '123456',
          code: userFinalCode ? userFinalCode : '',
          mobile_number: (req.body.mobile_number).toString(),
          // designation_id: req.body.contact_person_designation,
          user_type: 'SPP',
        });
        const insertUserData = await userData.save();
        await userData.save();
        if (insertUserData) {
          const datas = agencyDetailModel.update({
            user_id: insertUserData.id
          }, {
            where: {
              id: insertData.id
            }
          })
        }

        // const data = userModel.build(plantData);
        console.log(insertUserData);
        // const insertData = await data.save();

        const USER_API_KEY = process.env.USER_API_KEY
        let seedUserData = {
          "appKey": USER_API_KEY,
          "stateCode": "CENTRAL",
          "userid": 'spp' + '-' + userFinalCode,
          "password": "seeds#234",
          "name": req.body.name_of_spa,
          "role": "SPP"
        }
        await SeedUserManagement.createUser(seedUserData);

        if (insertUserData) {
          return response(res, status.DATA_SAVE, 200, userData, internalCall)
        } else {
          return response(res, status.DATA_NOT_SAVE, 404, userData, internalCall)
        }
        // } else {
        //   return response(res, status.DATA_NOT_SAVE, 404, returnResponse, internalCall)
        // }
        // }
      }
    } catch (error) {
      returnResponse = {
        message: error.message
      };
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }

  static editIndentor = async (req, res) => {
    let returnResponse = {};
    let internalCall = {};
    let mobileno;
    try {
      let existingAgencyData = undefined;
      let existingData = undefined;
      if (req.body.mobile_number) {
        mobileno = req.body.mobile_number;
      } else if (req.body.mobile) {
        mobileno = req.body.mobile;
      }
      let tabledAlteredSuccessfully = false;
      const id = parseInt(req.body.id);
      let condition = {
        where: {
          id: id
        }
      }
      let usersData = {
        agency_name: req.body.agency_name ? (req.body.agency_name).replace(/\s+/g, ' ').trim().toUpperCase() : '',
        updated_by: req.body.updated_by,
        category: req.body.category_agency,
        state_id: req.body.state,
        district_id: req.body.district,
        short_name: ((req.body.display_name).trim()).toUpperCase(),
        address: req.body.address,
        contact_person_name: req.body.contact_person_name,
        contact_person_designation: req.body.contact_person_designation_id,
        contact_person_designation: req.body.contact_person_designation,
        // contact_person_mobile: req.body.mobile_number,
        phone_number: req.body.phone,
        fax_no: req.body.fax_number,
        longitude: req.body.longitude,
        latitude: req.body.latitude,
        // email: req.body.email,
        bank_name: req.body.bank_name,
        bank_branch_name: req.body.bank_branch_name,
        bank_ifsc_code: req.body.bank_ifsc_code,
        bank_account_number: req.body.bank_account_number,
        created_by: req.body.updated_by,
        // state_id: req.body.state_id,
        // district_id: req.body.district_id,
        mobile_number: mobileno,
        pincode: req.body.pincode,
        is_active: req.body.active
      };

      // const existingData = await agencyDetailModel.findAll({
      //   where: {
      //     [Op.and]: [
      //       sequelize.where(
      //         sequelize.fn('lower', sequelize.col('short_name')),
      //         sequelize.fn('lower', req.body.display_name),
      //       ),
      //       // sequelize.where(sequelize.col('id'), id),
      //     ],
      //     id: { [Op.ne]: id }
      //   }
      // });
      // existingAgencyData = await agencyDetailModel.findAll({
      //   where: sequelize.where(
      //     sequelize.fn('lower', sequelize.col('agency_name')),
      //     sequelize.fn('lower', req.body.agency_name),
      //   ),
      //   id: { [Op.ne]: id }
      // });
      // if(existingAgencyData!=undefined && existingAgencyData.length >0){
      //   returnResponse ={
      //     error:'Agency Name Already exist'
      //   }
      //   return response(res, status.DATA_NOT_SAVE, 401, returnResponse, internalCall)
      // }

      existingAgencyData = await agencyDetailModel.findAll({
        include: [{
          model: userModel,
          where: {
            user_type: 'IN'
          }
        }],
        where: {
          [Op.and]: [
            {
              where: sequelize.where(
                sequelize.fn('lower', sequelize.col('agency_name')),
                sequelize.fn('lower', req.body.agency_name),

                // created_by:{[Op.and]:req.body.createdby}
              ),
              // created_by: { [Op.eq]: req.body.updated_by },
              id: { [Op.ne]: id },


            },



          ]
        },



      });
      if (existingAgencyData && existingAgencyData.length) {
        returnResponse = {
          error: 'Agency Name Already exist'
        }
        return response(res, status.DATA_NOT_SAVE, 401, returnResponse)
      }


      existingData = await agencyDetailModel.findAll({
        include: [{
          model: userModel,
          where: {
            user_type: 'IN'
          }
        }],
        // where: sequelize.where(
        //   sequelize.fn('lower', sequelize.col('short_name')),
        //   sequelize.fn('lower', req.body.display_name),
        // )
        where: {
          [Op.and]: [
            {
              where: sequelize.where(
                sequelize.fn('lower', sequelize.col('short_name')),
                sequelize.fn('lower', req.body.display_name),
              ),
              // created_by: { [Op.eq]: req.body.updated_by },
              id: { [Op.ne]: id },

            },


          ]
        },
      });

      if (existingData.length != 0) {

        returnResponse = {
          error: 'Short Name is Already exist'
        }

        return response(res, status.DATA_NOT_SAVE, 401, returnResponse)
      }

      let existingEmaiData = await agencyDetailModel.findAll({
        // where: sequelize.where(
        //   sequelize.fn('lower', sequelize.col('short_name')),
        //   sequelize.fn('lower', req.body.display_name),
        // )
        where: {
          [Op.and]: [
            {
              where: sequelize.where(
                sequelize.fn('lower', sequelize.col('email')),
                sequelize.fn('lower', req.body.email),
              ),
              id: { [Op.ne]: id },
            },


          ]
        },
      });
      if (existingEmaiData.length != 0) {
        returnResponse = {
          error: 'Email is Already exist'
        }

        return response(res, status.DATA_NOT_SAVE, 403, returnResponse)
      }



      if (existingData === undefined || existingData.length < 1) {
        const data = await agencyDetailModel.update(usersData, condition);
        const userData = {
          is_active: req.body.active

        }
        const updateuserData = await userModel.update(userData, {
          where: {
            agency_id: req.body.id
          }
        })
        tabledAlteredSuccessfully = true;
        //createUser()
      }


      if (tabledAlteredSuccessfully) {
        return response(res, status.DATA_SAVE, 200, returnResponse, internalCall)
      } else {
        return response(res, status.DATA_NOT_SAVE, 401, returnResponse, internalCall)
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_SAVE, 500, error)
    }
  }

  static viewIndentor = async (req, res) => {
    let data = {};
    try {

      let { page, pageSize } = req.body;

      if (!page) page = 1;


      let condition = {
        // include: [
        //   {
        //     model:userModel,
        //     attributes: ['*']
        //   },
        // ],
        // where: {
        //   is_active: 1
        // },
        raw: false,
        attributes: [
          'id', 'agency_name'
        ]
        // where: {
        //   id: req.body.id
        // }
      };

      const sortOrder = req.body.sort ? req.body.sort : 'id';
      const sortDirection = req.body.order ? req.body.order : 'DESC';

      if (page && pageSize) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }

      // condition.order = [[sortOrder, sortDirection]];
      condition.order = [['agency_name', 'ASC']];

      data = await agencyDetailModel.findAll(condition);
      // res.send(data)

      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      //console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static indentorList = async (req, res) => {
    let data = {};
    try {


      let condition = {};
      if (req.body && req.body.search && req.body.search.radio_type == 'national-temp') {
        condition = {
          include: [
            {
              model: designationModel,
              left: true,
              attributes: ['name']
            },
            {
              model: stateModel,
              left: true,
              attributes: ['state_name'],
            },
            {
              model: districtModel,
              left: true,
              attributes: ['district_name'],
            },
            // {
            //   model:categoryModel,
            //   left: true,
            //   attributes: ['category_name']
            // },
            {
              model: userModel,
              left: true,
              attributes: [],
              where: {
                user_type: 'IN'
              },
              include: [
                {
                  model: indentOfBreederseedModel,
                  attributes: [],
                  where: {}
                }
              ]
            },
          ],
          where: {
            // created_by: req.body.search.created_by,
          }
        };
      } else {
        if (req.body.id) {
          condition = {
            include: [
              {
                model: designationModel,
                left: true,
                attributes: ['name']
              },
              {
                model: stateModel,
                left: true,
                attributes: ['state_name'],
              },
              {
                model: districtModel,
                left: true,
                attributes: ['district_name'],
              },
              // {
              //   model:categoryModel,
              //   left: true,
              //   attributes: ['category_name']
              // },
              {
                model: userModel,
                left: true,
                attributes: [],
                where: {
                  user_type: 'IN'
                }
              },
            ],
            where: {
              // id: req.body.id,
              // created_by: req.body.search.created_by,

              // created_by: 1

              is_active: 1
            }
          };
        } else {
          condition = {
            include: [
              {
                model: designationModel,
                left: true,
                attributes: ['name']
              },
              {
                model: stateModel,
                left: true,
                attributes: ['state_name'],
              },
              {
                model: districtModel,
                left: true,
                attributes: ['district_name'],
              },
              // {
              //   model:categoryModel,
              //   left: true,
              //   attributes: ['category_name']
              // },
              {
                model: userModel,
                left: true,
                attributes: [],
                where: {
                  user_type: 'IN'
                }
              },
            ],
            where: {
              // created_by: req.body.search.created_by,
            }
          };
        }
      }


      let { page, pageSize, search } = req.body;
      let sortOrder;
      let sortDirection;
      if (search && search.is_self == false) {
        if (page === undefined) page = 1;
        if (pageSize === undefined) pageSize = 10; // set pageSize to -1 to prevent sizing

        if (page > 0 && pageSize > 0) {
          condition.limit = pageSize;
          condition.offset = (page * pageSize) - pageSize;
        }
        sortOrder = req.body.sort ? req.body.sort : 'id';
        sortDirection = req.body.order ? req.body.order : 'DESC';
      } else {
        sortOrder = req.body.sort ? req.body.sort : 'agency_name';
        sortDirection = req.body.order ? req.body.order : 'ASC';
      }


      condition.order = [['agency_name', 'ASC'], ['short_name', 'ASC'], [sequelize.col('m_district.district_name'), 'ASC'], [sequelize.col('m_state.state_name'), 'ASC']];
      // condition.order = [[sortOrder, sortDirection]];
      if (req.body.search) {
        if (req.body.search.state_id) {
          condition.where.state_id = (req.body.search.state_id);
        }
        if (req.body.search.district_id) {
          condition.where.district_id = (req.body.search.district_id);
        }
        if (req.body.search.agency_id) {
          condition.where.id = (req.body.search.agency_id);
        }
        if (req.body.search.radio_type == 'national-temp') {
          if (req.body.search.year) {
            condition.include[3].include[0].where.year = (req.body.search.year);
          }
          if (req.body.search.season) {
            condition.include[3].include[0].where.season = (req.body.search.season);
          }
          if (req.body.search.crop_code) {
            condition.include[3].include[0].where.crop_code = (req.body.search.crop_code);
          }
          if (req.body.search.variety_code) {
            condition.include[3].include[0].where.variety_code = (req.body.search.variety_code);
          }
        }
      }

      data = await agencyDetailModel.findAndCountAll(condition);
      // res.send(data)

      // let returnResponse = await paginateResponse(data, page, pageSize);
      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static plantList = async (req, res) => {
    let data = {};
    try {


      let condition = {};
      if (req.body.id) {
        condition = {
          include: [
            {
              model: designationModel,
              left: true,
              attributes: ['name']
            },
            {
              model: stateModel,
              left: true,
              attributes: ['state_name'],
            },
            {
              model: districtModel,
              left: true,
              attributes: ['district_name'],
            },
            // {
            //   model:categoryModel,
            //   left: true,
            //   attributes: ['category_name']
            // },
            {
              model: userModel,
              left: true,
              attributes: ['name', 'code'],
              where: {
                user_type: 'SPP'
              }
            },
          ],
          where: {
            // id: req.body.id,
            // created_by: req.body.search.created_by,

            // created_by: 1

            is_active: 1
          }
        };
      } else {
        condition = {
          include: [
            {
              model: designationModel,
              left: true,
              attributes: ['name']
            },
            {
              model: stateModel,
              left: true,
              attributes: ['state_name'],
            },
            {
              model: districtModel,
              left: true,
              attributes: ['district_name'],
            },
            // {
            //   model:categoryModel,
            //   left: true,
            //   attributes: ['category_name']
            // },
            {
              model: userModel,
              left: true,
              attributes: ['name', 'code'],
              where: {
                user_type: 'SPP'
              }
            },
          ],
          where: {
            // created_by: req.body.search.created_by,
          }
        };
      }

      let { page, pageSize, search } = req.body;
      if (page === undefined) page = 1;
      if (pageSize === undefined) pageSize = 10; // set pageSize to -1 to prevent sizing

      if (page > 0 && pageSize > 0) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }
      const sortOrder = req.body.sort ? req.body.sort : 'id';
      const sortDirection = req.body.order ? req.body.order : 'DESC';

      // ['name_of_spa', 'ASC']
      condition.order = [['agency_name', 'ASC'], ['address', 'ASC'], [sequelize.col('m_district.district_name'), 'ASC'], [sequelize.col('m_state.state_name'), 'ASC']];
      // condition.order = [[sortOrder, sortDirection]];
      if (req.body.search) {
        if (req.body.search.state_id) {
          condition.where.state_id = (req.body.search.state_id);
        }
        if (req.body.search.district_id) {
          condition.where.district_id = (req.body.search.district_id);
        }
        if (req.body.search.institute_name) {
          condition.where.agency_name = (req.body.search.institute_name);
        }
        if (req.body.search.id) {
          condition.where.id = (req.body.search.id);
        }
      }

      data = await agencyDetailModel.findAndCountAll(condition);
      // res.send(data)

      // let returnResponse = await paginateResponse(data, page, pageSize);
      return response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      return response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static getAllPlantsForBSPCBackup = async (req, res) => {
    try {
      let condition = {}
      condition = {

        attributes: ['id', 'plant_name',],

        where: {
          is_active: 1,
          // age:req.body.
        }
      }
      condition.order = [['plant_name', 'ASC']]


      let data = await plantDetailsModel.findAll(condition);

      if (!data) {
        return response(res, status.DATA_NOT_AVAILABLE, 404);
      }

      return response(res, status.DATA_AVAILABLE, 200, data);
    }
    catch (error) {
      const returnResponse = {
        message: error.message,
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }
  static getAllPlantsForBSPC = async (req, res) => {
    try {
      let condition = {}
      condition = {

        attributes: ['id',
          [
            sequelize.fn(
              'CONCAT',
              sequelize.col('name'),
              ' (',
              sequelize.col('code'),
              ')'
            ),
            'plant_name'
          ],
          // [sequelize.col('name'), 'plant_name']
        ],

        where: {
          // is_active: 1,
          user_type: 'SPP'
          // age:req.body.
        }
      }
      condition.order = [[sequelize.col('name'), 'ASC']]


      let data = await userModel.findAll(condition);

      if (!data) {
        return response(res, status.DATA_NOT_AVAILABLE, 404);
      }

      return response(res, status.DATA_AVAILABLE, 200, data);
    }
    catch (error) {
      const returnResponse = {
        message: error.message,
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }

  static getAllPlantsFoAllBSPC = async (req, res) => {
    try {
      let condition = {}
      condition = {

        attributes: ['id', 'plant_name',],

        where: {
          is_active: 1,
          // age:req.body.
        }
      }
      condition.order = [['plant_name', 'ASC']]


      let data = await plantDetailsModel.findAll(condition);

      if (!data) {
        return response(res, status.DATA_NOT_AVAILABLE, 404);
      }

      return response(res, status.DATA_AVAILABLE, 200, data);
    }
    catch (error) {
      const returnResponse = {
        message: error.message,
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }

  static deleteIndentor = async (req, res) => {
    let data = {};
    try {
      if (req.body.id) {
        if (loginedUserid && loginedUserid.username) {
          const USER_API_KEY = process.env.USER_API_KEY
          let seedUserData = { "appKey": USER_API_KEY, "stateCode": "CENTRAL", "role": "IN", "userid": loginedUserid.username }
          await SeedUserManagement.inactiveUser(seedUserData);
        } else {
          response(res, status.UNEXPECTED_ERROR, 500)

        }
        const agencyDetailData = await agencyDetailModel.destroy({
          where: {
            id: req.body.id
          }
        });
        const userData = await userModel.destroy({
          where: {
            agency_id: req.body.id,
            user_type: 'IN'
          }
        });
        if (agencyDetailData && userData) {

          response(res, status.DATA_DELETED, 200, agencyDetailData)
        }
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  //update status on delete data
  static updateStatusIndentor = async (req, res) => {
    try {
      let data = {
        is_active: 0,
        updated_by: req.body.user_id
      }
      agencyDetailModel.update(data, {
        where: {
          id: req.body.id
        },
      });
      // const userData = await userModel.destroy({
      //   where: {
      //     agency_id: req.body.id,
      //     user_type: 'IN'
      //   }
      // });
      response(res, status.DATA_DELETED, 200, {});
    }
    catch (error) {
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    }
  }

  // static editIndentor = async (req, res) => {
  //   try {
  //     const id = req.params.id;
  //     console.log('update indenter',req.body);
  //     const data = await agencyDetailModel.update({
  //       agency_name: req.body.agency_name,
  //       created_by: 1,//req.body.created_by,
  //       category: req.body.category_agency,
  //       state_id: req.body.state,
  //       district_id: req.body.district,
  //       short_name: req.body.display_name.toUpperCase(),
  //       address: req.body.address,
  //       pincode: req.body.pincode,
  //       contact_person_name: req.body.contact_person_name,
  //       contact_person_designation: req.body.contact_person_designation,
  //       contact_person_mobile: req.body.mobile,
  //       mobile_number: req.body.mobile,
  //       phone_number: req.body.phone,
  //       fax_no: req.body.fax_number,
  //       longitude: req.body.longitude,
  //       latitude: req.body.latitude,
  //       email: req.body.email,
  //       is_active: req.body.active
  //     },

  //       {
  //         where: {
  //           id: id
  //         }

  //       })
  //     // const userid= await



  //     if (data) {
  //       response(res, status.DATA_UPDATED, 200, data)
  //     }

  //   } catch (error) {
  //     console.log(error)
  //     response(res, status.DATA_NOT_SAVE, 500)
  //   }
  // }



  static checkAlreadyExistsShortName = async (req, res) => {
    const { internalCall } = req.body;
    let returnResponse = {};
    try {

      let rules = {
        'search.short_name': 'string',
      };

      // let validation = new Validator(req.body, rules);

      // const isValidData = validation.passes();

      // if (!isValidData) {
      //   let errorResponse = {};
      //   for (let key in rules) {
      //     const error = validation.errors.get(key);
      //     if (error.length) {
      //       errorResponse[key] = error;
      //     }
      //   }
      //   return response(res, status.BAD_REQUEST, 400, errorResponse, internalCall)
      // }

      let condition = {
        where: {
          short_name: req.body.search.short_name,
          is_active: 1
        },
        raw: false,
        limit: 1
      };
      const queryData = await agencyDetailModel.findAll(condition);

      return response(res, status.OK, 200, queryData, internalCall);

    } catch (error) {
      returnResponse = {
        message: error.message
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }

  static getFilteredUser = async (req, res) => {
    let data = {};
    try {
      let condition = {
        include: [
          {
            model: db.designationModel,
            left: true
          },
          {
            model: db.agencyDetailModel,
            left: true
          }
        ]
      };
      if (req.body.search) {
        condition["where"] = req.body.search;
      }
      data = await userModel.findAll(condition);
      // res.send(data)

      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      //console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static testAPI = async (req, res) => {
    try {

      response(res, "Api Working fine", 200, "Success")


    } catch (error) {
      //console.log(error)
      response(res, status.DATA_NOT_SAVE, 500)
    }
  }

  static webLogin = async (req, res) => {
    if (!req.body) {
      return response(res, status.REQUEST_DATA_MISSING, 400)
    }
    const { user_id, password, state_code } = req.body;
    let mobile = user_id
    let role_id = 1
    let stateCodeValue;
    let isRequired = false;
    if (state_code) {
      isRequired = true;
      stateCodeValue = {
        state_id: state_code
      }
    }
    try {

      if (typeof user_id === 'undefined' || user_id === '' || user_id === null) {

        return response(res, status.MOBILE_MISSING, 400, {})
      }

      if (typeof password === 'undefined' || password === null || password === '') {

        return response(res, status.PASSWORD_MISSING, 400, {})
      }

      let condition = {
        include: [
          {
            model: agencyDetailModel,
            attributes: ['id', 'agency_name', 'address'],
            required: isRequired,
            include: {
              model: stateModel,
              attributes: ['id', 'state_name'],
              required: isRequired,
              where: {
              }
            },
            where: {
              ...stateCodeValue
            }
          },
          {
            model: designationModel,
            attributes: ['id', 'name']
          }
        ],
        where: {
          username: {
            [Op.eq]: user_id
          },
          // role_id: role_id,
          is_active: '1'
        },
        raw: true,
        //	       required: false
      };
      // condition.order = [['id','ASC']]
      let data = await userModel.findAll(condition);

      // if (data && data[0] && bcrypt.compareSync(password, data[0].password)) {
      if (data && data !== undefined && data.length > 0) {
        console.log(data, 'dats')
        if (data.length === 1) {
          // if(data[0].role_id==1 && data[0].status===null){
          //   const dataSet = {"type": "pending"}
          //   return encryptResponse(res, status.INVALID_CREDENTIAL, 404, dataSet)
          // }

          let user_id = data[0].id;
          data = data[data.length - 1]
          let dataset = [];

          let token;
          delete data["password"];
          // delete data["user_id"];
          // console.log("daaaaa".data);
          // token = jwt.sign({ id: user_id }, process.env.JWT_SECRET, { expiresIn:'8h'});
          token = jwt.sign({ id: user_id, unm: data['username'] }, process.env.JWT_SECRET, {});
          dataset = ({ ...data, token })
          const saveToken = Token.build({ token: token, user_id: user_id });
          await saveToken.save()
          // AuthHistoryModel.create({ user_id: mobile, auth_status: 'login success', login_datetime: new Date(), action_type: 'web login' });
          //   data['otp'] = generateOTP();
          //  // if(mobile && ['0679004316','0710853081', '0822191767','27679004316', '27710853081','27822191767','679004316','710853081','822191767','9354674477','09354674477','279354674477','279456927350','9456927350'].includes(mobile.toString())){
          // //            data['otp'] =  '1234';
          // //    }
          //     const date = moment().subtract(0, 'days');
          //     data['otp_created_at'] = date.format('YYYY-MM-DD H:mm:ss');
          //     let msg = "Your+OTP+verification+code+is+" + data['otp'] + ".+Do+not+share+it+with+anyone.+It+is+valid+for+5+minutes+only.";
          //     mobile = data['mobile_number'];
          //     let smsData = { mobile: mobile, msg: msg }
          //     sendSms(smsData)

          //     data['mobile'] = data['mobile_number'];
          //     delete data['user_id'];
          //     await UserModel.update({
          //       otp: data['otp'],
          //       otp_created_at: data['otp_created_at'],
          //     }, {
          //       where: {
          //         id: data['id']
          //       }
          //     })
          return response(res, status.LOGIN_SUCCESS, 200, dataset)
        } else {
          return response(res, "multiplee user", 404, {})
        }
      } else {
        // AuthHistoryModel.create({ user_id: mobile, auth_status: 'login failed', login_datetime: new Date(), action_type: 'web login' });
        return response(res, status.INVALID_CREDENTIAL, 404, {})
      }
    } catch (error) {
      console.log("error", error)
      // AuthHistoryModel.create({ user_id: mobile, auth_status: 'server error', login_datetime: new Date(), action_type: 'web login' });
      return response(res, status.UNEXPECTED_ERROR, 500, {})
    }
  }
  static UserData = async (req, res) => {
    try {
      let condition = {

        where: {
          // 'users.user_type' : 'agency'
        }


      }



      if (req.body.search) {
        if (req.body.search.agency_id) {
          condition.where.agency_id = req.body.search.agency_id;
        }
      }


      let data = await userModel.findAndCountAll(condition);


      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      return response(res, status.DATA_NOT_AVAILABLE, 500, error);
    }
  }

  static getMasterBspReportData = async (req, res) => {
    let data = {};
    try {

      const reportType = req.body.reportType;
      let searchData = [];
      let bspModel = bsp1Model;
      let bspAttributes = ['year',];
      let bspIncluded =
        [{
          model: cropVerietyModel,
          left: true,
          attributes: ['variety_name'],
          include: [
            {
              model: indentOfBreederseedModel,
              left: true,
              attributes: ['indent_quantity'],
              include: [
                {
                  model: agencyDetailModel,
                  attributes: [['contact_person_name', 'co_per_name'], 'agency_name', ['contact_person_designation', 'co_per_desig']],
                  left: true,
                  include: [{
                    model: userModel,
                    left: true,
                    attributes: [],
                  },
                  ]
                }
              ]
            },
          ]
        },
        // {
        //   model: nucleusSeedAvailabityModel,
        //   left: true,
        //   attributes: ['quantity']
        // },
        {
          model: bsp1ProductionCenter,
          left: true,
          attributes: ['bsp_1_id', 'members', ['quantity_of_seed_produced', 'target']],
          include: [
            {
              model: nucleusSeedAvailabityModel,
              left: true,
              attributes: ['quantity']
            },
          ]
        }
        ];

      if (reportType === 'one') {

        bspModel = bsp1Model;
        // bspAttributes = ['year', 'members', ['quantity_of_seed_produced', 'target']];
        bspAttributes = ['year']
        if (req.body) {

          if (typeof req.body.search !== 'undefined' && req.body.search !== '' && req.body.search !== null) {

            if (typeof req.body.search.year !== 'undefined' && req.body.search.year !== '' && req.body.search.year !== null) {

              searchData['searchYear'] =
              {
                'year': req.body.search.year
              }
            }

            if (
              typeof req.body.search.crop !== 'undefined' && req.body.search.crop !== '' && req.body.search.crop !== null
              &&
              typeof req.body.search.variety !== 'undefined' && req.body.search.variety !== '' && req.body.search.variety !== null
            ) {

              searchData['searchVarietyCrop'] =
              {
                'crop_code': req.body.search.crop,
                'variety_code': req.body.search.variety
              }
            }

            else if (typeof req.body.search.variety !== 'undefined' && req.body.search.variety !== '' && req.body.search.variety !== null) {

              searchData['searchVarietyCrop'] =
              {
                'variety_code': req.body.search.variety
              }
            } else if (typeof req.body.search.crop !== 'undefined' && req.body.search.crop !== '' && req.body.search.crop !== null) {

              searchData['searchVarietyCrop'] =
              {
                'crop_code': req.body.search.crop
              }
            }

            if (
              typeof req.body.search.breeder !== 'undefined' && req.body.search.breeder !== '' && req.body.search.breeder !== null
              &&
              typeof req.body.search.bspc !== 'undefined' && req.body.search.bspc !== '' && req.body.search.bspc !== null
            ) {
              searchData['searchBreederBspc'] = {
                'created_by': parseInt(req.body.search.breeder),
                'id': parseInt(req.body.search.bspc)
              }
            } else if (typeof req.body.search.breeder !== 'undefined' && req.body.search.breeder !== '' && req.body.search.breeder !== null) {
              searchData['searchBreederBspc'] = {
                'created_by': req.body.search.breeder
              }
            }
          }
        }

        bspIncluded =
          [{
            model: cropVerietyModel,
            left: true,
            // raw:true,
            attributes: ['variety_name'],
            where: searchData['searchVarietyCrop'], //filters
            include: [
              {
                model: indentOfBreederseedModel,
                left: true,
                attributes: ['indent_quantity'],
                include: [
                  {
                    model: agencyDetailModel,
                    attributes: [['contact_person_name', 'co_per_name'], 'agency_name', ['contact_person_designation', 'co_per_desig']],
                    left: true,
                    include: [{
                      model: userModel,
                      left: true,
                      where: searchData['searchBreederBspc'], //filters
                    },
                    {
                      model: designationModel,
                      left: true,
                      attributes: ['id', 'name']
                    }
                    ]
                  }
                ]
              },
            ]
          },
          // {
          //   model: nucleusSeedAvailabityModel,
          //   left: true,
          //   attributes: ['quantity']
          // },
          {
            // required:true,
            model: bsp1ProductionCenter,
            left: true,
            attributes: ['bsp_1_id', 'members', ['quantity_of_seed_produced', 'target']],
            include: [
              {
                model: nucleusSeedAvailabityModel,
                left: true,
                attributes: ['quantity']
              },
            ]
          }
          ]

      }

      else if (reportType === 'two') {
        bspModel = bsp2Model;
        bspAttributes = ['year', 'area', ['expected_production', 'expct_prod'], ['field_location', 'field_loc']
          , ['expected_harvest_from', 'expct_harv_frm']
          , ['expected_harvest_to', 'expct_harv_to']
          , ['expected_inspection_from', 'expct_insp_frm']
          , ['expected_inspection_to', 'expct_insp_to']
          , ['expected_availbility', 'expct_avail']
        ];
        if (req.body) {

          if (typeof req.body.search !== 'undefined' && req.body.search !== '' && req.body.search !== null) {

            if (typeof req.body.search.year !== 'undefined' && req.body.search.year !== '' && req.body.search.year !== null) {

              searchData['searchYear'] =
              {
                'year': req.body.search.year
              }
            }

            if (
              typeof req.body.search.crop !== 'undefined' && req.body.search.crop !== '' && req.body.search.crop !== null
              &&
              typeof req.body.search.variety !== 'undefined' && req.body.search.variety !== '' && req.body.search.variety !== null
            ) {

              searchData['searchVarietyCrop'] =
              {
                'crop_code': req.body.search.crop,
                'variety_code': req.body.search.variety
              }
            }

            else if (typeof req.body.search.variety !== 'undefined' && req.body.search.variety !== '' && req.body.search.variety !== null) {

              searchData['searchVarietyCrop'] =
              {
                'variety_code': req.body.search.variety
              }
            } else if (typeof req.body.search.crop !== 'undefined' && req.body.search.crop !== '' && req.body.search.crop !== null) {

              searchData['searchVarietyCrop'] =
              {
                'crop_code': req.body.search.crop
              }
            }

            if (
              typeof req.body.search.breeder !== 'undefined' && req.body.search.breeder !== '' && req.body.search.breeder !== null
              &&
              typeof req.body.search.bspc !== 'undefined' && req.body.search.bspc !== '' && req.body.search.bspc !== null
            ) {
              searchData['searchBreederBspc'] = {
                'created_by': parseInt(req.body.search.breeder),
                'id': parseInt(req.body.search.bspc)
              }
            } else if (typeof req.body.search.breeder !== 'undefined' && req.body.search.breeder !== '' && req.body.search.breeder !== null) {
              searchData['searchBreederBspc'] = {
                'created_by': req.body.search.breeder
              }
            }
          }
        }

        bspIncluded =
          [
            {
              model: cropVerietyModel,
              left: true,
              attributes: ['variety_name'],
              where: searchData['searchVarietyCrop'],
              include: [
                {
                  model: indentOfBreederseedModel,
                  left: true,
                  attributes: ['indent_quantity'],
                  include: [
                    {
                      model: agencyDetailModel,
                      attributes: [['contact_person_name', 'co_per_name'], 'address', ['contact_person_designation', 'co_per_desig']],
                      left: true,
                      include: [{
                        model: userModel,
                        left: true,
                        attributes: [],
                        where: searchData['searchBreederBspc']
                      },
                      {
                        model: designationModel,
                        left: true,
                        attributes: ['id', 'name']
                      }
                      ]
                    }
                  ]
                },
              ]
            },
            {
              model: nucleusSeedAvailabityModel,
              left: true,
              attributes: ['quantity']
            }
            ,
            {
              model: bsp1Model,
              left: true,
              attributes: ['id']
            }
          ];
      }

      else if (reportType === 'three') {

        bspModel = bsp3Model;
        bspAttributes = ['year'
          //     , ['expected_production','expct_prod'], ['field_location', 'field_loc']
        ];
        if (req.body) {

          if (typeof req.body.search !== 'undefined' && req.body.search !== '' && req.body.search !== null) {

            if (typeof req.body.search.year !== 'undefined' && req.body.search.year !== '' && req.body.search.year !== null) {

              searchData['searchYear'] =
              {
                'year': req.body.search.year
              }
            }

            if (
              typeof req.body.search.crop !== 'undefined' && req.body.search.crop !== '' && req.body.search.crop !== null
              &&
              typeof req.body.search.variety !== 'undefined' && req.body.search.variety !== '' && req.body.search.variety !== null
            ) {

              searchData['searchVarietyCrop'] =
              {
                'crop_code': req.body.search.crop,
                'variety_code': req.body.search.variety
              }
            }

            else if (typeof req.body.search.variety !== 'undefined' && req.body.search.variety !== '' && req.body.search.variety !== null) {

              searchData['searchVarietyCrop'] =
              {
                'variety_code': req.body.search.variety
              }
            } else if (typeof req.body.search.crop !== 'undefined' && req.body.search.crop !== '' && req.body.search.crop !== null) {

              searchData['searchVarietyCrop'] =
              {
                'crop_code': req.body.search.crop
              }
            }

            if (
              typeof req.body.search.breeder !== 'undefined' && req.body.search.breeder !== '' && req.body.search.breeder !== null
              &&
              typeof req.body.search.bspc !== 'undefined' && req.body.search.bspc !== '' && req.body.search.bspc !== null
            ) {
              searchData['searchBreederBspc'] = {
                'created_by': parseInt(req.body.search.breeder),
                'id': parseInt(req.body.search.bspc)
              }
            } else if (typeof req.body.search.breeder !== 'undefined' && req.body.search.breeder !== '' && req.body.search.breeder !== null) {
              searchData['searchBreederBspc'] = {
                'created_by': req.body.search.breeder
              }
            }
          }
        }
        bspIncluded =

          [{
            model: cropVerietyModel,
            left: true,
            attributes: ['variety_name'],
            where: searchData['searchVarietyCrop'],
            include: [
              {
                model: indentOfBreederseedModel,
                left: true,
                attributes: ['indent_quantity'],
                include: [
                  {
                    model: agencyDetailModel,
                    attributes: [['contact_person_name', 'co_per_name'], 'agency_name', ['contact_person_designation', 'co_per_desig']],
                    left: true,
                    include: [{
                      model: userModel,
                      left: true,
                      attributes: [],
                      where: searchData['searchBreederBspc']
                    }]
                  }
                ]
              },
            ]
          },
          {
            model: bsp2Model,
            left: true,
            attributes: [
              'area', ['expected_production', 'expct_prod'], ['field_location', 'field_loc'] // bsp 3
            ],
            include: [
              {
                model: bsp1Model,
                left: true,
                attributes: [
                  // 'quantity_of_seed_produced', reletion banana hai
                  'id'
                ]
              }
            ]
          }
          ];
      }

      else if (reportType === 'four') {

        bspModel = bsp4Model;
        bspAttributes = ['year', 'production_year', 'carry_over_seed_amount',
          'carry_over_last_year_germination', 'carry_over_current_year_germination', 'total_availability', 'production_surplus',
          'reason_for_dificit', 'number_of_sample',
          ['actual_seed_production', 'actual_prod']
        ];
        if (req.body) {

          if (typeof req.body.search !== 'undefined' && req.body.search !== '' && req.body.search !== null) {

            if (typeof req.body.search.year !== 'undefined' && req.body.search.year !== '' && req.body.search.year !== null) {

              searchData['searchYear'] =
              {
                'year': req.body.search.year
              }
            }

            if (
              typeof req.body.search.crop !== 'undefined' && req.body.search.crop !== '' && req.body.search.crop !== null
              &&
              typeof req.body.search.variety !== 'undefined' && req.body.search.variety !== '' && req.body.search.variety !== null
            ) {

              searchData['searchVarietyCrop'] =
              {
                'crop_code': req.body.search.crop,
                'variety_code': req.body.search.variety
              }
            }

            else if (typeof req.body.search.variety !== 'undefined' && req.body.search.variety !== '' && req.body.search.variety !== null) {

              searchData['searchVarietyCrop'] =
              {
                'variety_code': req.body.search.variety
              }
            } else if (typeof req.body.search.crop !== 'undefined' && req.body.search.crop !== '' && req.body.search.crop !== null) {

              searchData['searchVarietyCrop'] =
              {
                'crop_code': req.body.search.crop
              }
            }

            if (
              typeof req.body.search.breeder !== 'undefined' && req.body.search.breeder !== '' && req.body.search.breeder !== null
              &&
              typeof req.body.search.bspc !== 'undefined' && req.body.search.bspc !== '' && req.body.search.bspc !== null
            ) {
              searchData['searchBreederBspc'] = {
                'created_by': parseInt(req.body.search.breeder),
                'id': parseInt(req.body.search.bspc)
              }
            } else if (typeof req.body.search.breeder !== 'undefined' && req.body.search.breeder !== '' && req.body.search.breeder !== null) {
              searchData['searchBreederBspc'] = {
                'created_by': req.body.search.breeder
              }
            }
          }
        }
        bspIncluded =

          [
            {
              model: cropVerietyModel,
              left: true,
              attributes: ['variety_name'],
              where: searchData['searchVarietyCrop']
            },
            {
              model: bsp3Model,
              left: false,
              include: [
                {
                  model: bsp2Model,
                  include: [
                    {
                      model: bsp1Model,
                      attributes: ['id'],
                      // ,'quantity_of_seed_produced' // actual allocation target
                      left: false,
                      include: [
                        {
                          model: bsp1ProductionCenter,
                          left: true,
                          attributes: ['bsp_1_id', 'members', ['quantity_of_seed_produced', 'target']],
                          // attributes: ['bsp_1_id'],

                          include: [
                            {
                              model: nucleusSeedAvailabityModel,
                              left: true,
                              attributes: ['quantity']
                            },
                          ]
                        }
                      ],
                    }
                  ]
                },
              ]
            }
          ];
      }

      else if (reportType === 'five-a') {

        bspModel = bsp5aModel;
        bspAttributes = ['genetic_purity'];
        if (req.body) {

          if (typeof req.body.search !== 'undefined' && req.body.search !== '' && req.body.search !== null) {

            if (typeof req.body.search.year !== 'undefined' && req.body.search.year !== '' && req.body.search.year !== null) {

              searchData['searchYear'] =
              {
                'year': req.body.search.year
              }
            }

            if (
              typeof req.body.search.crop !== 'undefined' && req.body.search.crop !== '' && req.body.search.crop !== null
              &&
              typeof req.body.search.variety !== 'undefined' && req.body.search.variety !== '' && req.body.search.variety !== null
            ) {

              searchData['searchVarietyCrop'] =
              {
                'crop_code': req.body.search.crop,
                'variety_code': req.body.search.variety
              }
            }

            else if (typeof req.body.search.variety !== 'undefined' && req.body.search.variety !== '' && req.body.search.variety !== null) {

              searchData['searchVarietyCrop'] =
              {
                'variety_code': req.body.search.variety
              }
            } else if (typeof req.body.search.crop !== 'undefined' && req.body.search.crop !== '' && req.body.search.crop !== null) {

              searchData['searchVarietyCrop'] =
              {
                'crop_code': req.body.search.crop
              }
            }

            if (
              typeof req.body.search.breeder !== 'undefined' && req.body.search.breeder !== '' && req.body.search.breeder !== null
              &&
              typeof req.body.search.bspc !== 'undefined' && req.body.search.bspc !== '' && req.body.search.bspc !== null
            ) {
              searchData['searchBreederBspc'] = {
                'created_by': parseInt(req.body.search.breeder),
                'id': parseInt(req.body.search.bspc)
              }
            } else if (typeof req.body.search.breeder !== 'undefined' && req.body.search.breeder !== '' && req.body.search.breeder !== null) {
              searchData['searchBreederBspc'] = {
                'created_by': req.body.search.breeder
              }
            }
          }
        }
        bspIncluded = [
          {
            model: cropVerietyModel,
            left: true,
            attributes: ['variety_name'],
            where: searchData['searchVarietyCrop']
          },
          {
            model: bsp4Model,
            left: false,
            attributes: ['number_of_sample'],
            include: [

              {
                model: bsp3Model,
                left: false,
                include: [
                  {
                    model: bsp2Model,
                    left: false,
                    attributes: ['area', ['field_location', 'field_loc']]
                  }
                ]
              }
            ]
          }
        ];
      }

      else if (reportType === 'five-b') {

        bspModel = bsp5bModel;
        bspAttributes = ['breeder_seed_balance', 'lifting_quantity', 'unlifting_quantity', 'label_number', 'lifting_date'];
        if (req.body) {

          if (typeof req.body.search !== 'undefined' && req.body.search !== '' && req.body.search !== null) {

            if (typeof req.body.search.year !== 'undefined' && req.body.search.year !== '' && req.body.search.year !== null) {

              searchData['searchYear'] =
              {
                'year': req.body.search.year
              }
            }

            if (
              typeof req.body.search.crop !== 'undefined' && req.body.search.crop !== '' && req.body.search.crop !== null
              &&
              typeof req.body.search.variety !== 'undefined' && req.body.search.variety !== '' && req.body.search.variety !== null
            ) {

              searchData['searchVarietyCrop'] =
              {
                'crop_code': req.body.search.crop,
                'variety_code': req.body.search.variety
              }
            }

            else if (typeof req.body.search.variety !== 'undefined' && req.body.search.variety !== '' && req.body.search.variety !== null) {

              searchData['searchVarietyCrop'] =
              {
                'variety_code': req.body.search.variety
              }
            } else if (typeof req.body.search.crop !== 'undefined' && req.body.search.crop !== '' && req.body.search.crop !== null) {

              searchData['searchVarietyCrop'] =
              {
                'crop_code': req.body.search.crop
              }
            }

            if (
              typeof req.body.search.breeder !== 'undefined' && req.body.search.breeder !== '' && req.body.search.breeder !== null
              &&
              typeof req.body.search.bspc !== 'undefined' && req.body.search.bspc !== '' && req.body.search.bspc !== null
            ) {
              searchData['searchBreederBspc'] = {
                'created_by': parseInt(req.body.search.breeder),
                'id': parseInt(req.body.search.bspc)
              }
            } else if (typeof req.body.search.breeder !== 'undefined' && req.body.search.breeder !== '' && req.body.search.breeder !== null) {
              searchData['searchBreederBspc'] = {
                'created_by': req.body.search.breeder
              }
            }
          }
        }
        bspIncluded = [
          {
            model: cropVerietyModel,
            left: true,
            attributes: ['variety_name'],
            where: searchData['searchVarietyCrop'],
            include: [
              {
                model: indentOfBreederseedModel,
                left: true,
                attributes: ['indent_quantity'],
                include: [
                  {
                    model: userModel,
                    left: true,
                    attributes: ['name'],
                    where: searchData['searchBreederBspc']
                  },
                  {
                    model: allocationToIndentorForLiftingBreederseedsModel,
                    left: true,
                    attributes: ['quantity']
                  }
                ]
              }
            ]
          },
          {
            model: bsp5aModel,
            left: false,
            include: [

              {
                model: bsp4Model,
                left: false,
                attributes: ['actual_seed_production']
              }
            ]
          }
          // allocation_to_indentor_for_litfing_breederseeds :: quantity // Allocation of Breeder Seed to Indentors for Lifting
          // indent_of_breeder_seeds :: user_tbl(name) // Quantity of Breeder Seed Allotted (q)
        ];
      }

      else if (reportType === 'six') {

        bspModel = bsp6Model;
        bspAttributes = ['target'];
        if (req.body) {

          if (typeof req.body.search !== 'undefined' && req.body.search !== '' && req.body.search !== null) {

            if (typeof req.body.search.year !== 'undefined' && req.body.search.year !== '' && req.body.search.year !== null) {

              searchData['searchYear'] =
              {
                'year': req.body.search.year
              }
            }

            if (
              typeof req.body.search.crop !== 'undefined' && req.body.search.crop !== '' && req.body.search.crop !== null
              &&
              typeof req.body.search.variety !== 'undefined' && req.body.search.variety !== '' && req.body.search.variety !== null
            ) {

              searchData['searchVarietyCrop'] =
              {
                'crop_code': req.body.search.crop,
                'variety_code': req.body.search.variety
              }
            }

            else if (typeof req.body.search.variety !== 'undefined' && req.body.search.variety !== '' && req.body.search.variety !== null) {

              searchData['searchVarietyCrop'] =
              {
                'variety_code': req.body.search.variety
              }
            } else if (typeof req.body.search.crop !== 'undefined' && req.body.search.crop !== '' && req.body.search.crop !== null) {

              searchData['searchVarietyCrop'] =
              {
                'crop_code': req.body.search.crop
              }
            }

            if (
              typeof req.body.search.breeder !== 'undefined' && req.body.search.breeder !== '' && req.body.search.breeder !== null
              &&
              typeof req.body.search.bspc !== 'undefined' && req.body.search.bspc !== '' && req.body.search.bspc !== null
            ) {
              searchData['searchBreederBspc'] = {
                'created_by': parseInt(req.body.search.breeder),
                'id': parseInt(req.body.search.bspc)
              }
            } else if (typeof req.body.search.breeder !== 'undefined' && req.body.search.breeder !== '' && req.body.search.breeder !== null) {
              searchData['searchBreederBspc'] = {
                'created_by': req.body.search.breeder
              }
            }
          }
        }
        bspIncluded = [
          {
            model: cropVerietyModel,
            left: true,
            attributes: ['variety_name'],
            where: searchData['searchVarietyCrop']
          }
        ];
      }
      else {

        bspModel = bsp1Model;
      }

      data = await bspModel.findAll({
        attributes: bspAttributes,
        where: searchData['searchYear'], //filters
        include: bspIncluded,
        raw: true,
      });

      await response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log('error: ', error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static getMasterBspReportFilterData = async (req, res) => {
    let returnResponse = {};
    try {
      let condition = {
        include: [
          {
            model: cropModel,
            attributes: [],
            where: {
              crop_code: {
                [Op.like]: req.body.search.crop_type + "%",
              }
            },
            include: [
              {
                model: userModel,
                attributes: [],
                where: {
                  user_type: "BR"
                }
              }
            ]
          }
        ],

        where: {},
        attributes: [
          // [sequelize.fn('DISTINCT',sequelize.col('m_crop.breeder_id')),'breeder_id'],
          [sequelize.fn('DISTINCT', sequelize.col('m_crop->user.name')), 'breeder_name'],
          // [sequelize.fn('DISTINCT',sequelize.col('m_crop->user.name')),'breeder_name'],
          [sequelize.col('m_crop->user.id'), 'breeder_id'],
        ],
        raw: true
      }
      if (req.body.search) {
        if (req.body.search.crop_type) {
          // condition.where.
        }
      }
      let data = await bsp1Model.findAll(condition);
      if (data) {
        returnResponse = data;
        return response(res, status.DATA_AVAILABLE, 200, returnResponse);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 401, returnResponse);
      }
    } catch (error) {
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }

  static getMasterBspOneReportData = async (req, res) => {
    let returnResponse = {};
    try {

      let condition = {
        include: [
          {
            model: bsp1ProductionCenter,
            required: true,
            // attributes: ['bsp_1_id', 'members', ['quantity_of_seed_produced', 'target']],
            attributes: [],
            include: [
              {
                model: nucleusSeedAvailabityModel,
                left: true,
                attributes: [],

                // attributes: ['quantity']
              },
              {
                model: userModel,
                required: true,
                attributes: [],

                // attributes: ['quantity']
              },
            ]
          },
          {
            model: indentOfBreederseedModel,
            required: true,
            attributes: [],
            where: {
              // year:
              // season:
            }
            // include: [
            //   {
            //     model: agencyDetailModel,
            //     // attributes: [['contact_person_name', 'co_per_name'], 'agency_name', ['contact_person_designation', 'co_per_desig']],
            //     left: true,
            //     include: [{
            //       model: userModel,
            //       left: true,
            //       // where: searchData['searchBreederBspc'], //filters
            //     },
            //     {
            //       model: designationModel,
            //       left: true,
            //       // attributes: ['id', 'name']
            //     }
            //     ]
            //   }
            // ]
          },
          {
            model: cropVerietyModel,
            required: true,
            attributes: [],

            // raw:true,
            // attributes: ['variety_name'],
            // where: searchData['searchVarietyCrop'], //filters

          },
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('bsp1_production_centers->user.name')), 'bspc_name'],

          [sequelize.fn('SUM', sequelize.col('bsp1_production_centers.quantity_of_seed_produced')), 'quantity_of_seed_produced'],

          [sequelize.col('bsp_1s.variety_id'), 'variety_id'],
          [sequelize.col('bsp_1s.year'), 'year'],
          [sequelize.col('bsp_1s.season'), 'season'],
          [sequelize.col('bsp1_production_centers->user.id'), 'bspc_id'],

          // [sequelize.fn('SUM', sequelize.col('indent_of_spas.indent_quantity')), 'indent_quantity'],
          // [sequelize.col('user.name'), 'spa_name'],
          // [sequelize.col('bsp1_production_centers->nucleus_seed_availability.quantity'), 'nucleus_quantity'],
          // [sequelize.col('bsp1_production_centers->user.name'), 'bspc_name'],
          [sequelize.col('indent_of_breederseed".indent_quantity'), 'indent_quantity'],
          // [sequelize.fn('SUM',sequelize.col('bsp1_production_centers->nucleus_seed_availability.quantity')), 'nucleus_quantity'],
          [sequelize.fn('SUM', sequelize.col('bsp1_production_centers->nucleus_seed_availability.quantity')), 'nucleus_quantity'],
          [sequelize.col('m_crop_variety.variety_code'), 'variety_code'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          // [sequelize.col('m_crop_variety.introduce_year'), 'notification_year'],

        ],
        group: [
          [sequelize.col('bsp_1s.variety_id'), 'variety_id'],
          // [sequelize.col('bsp1_production_centers->nucleus_seed_availability.'), 'spa_code'],
          // [sequelize.col('user.name'), 'spa_name'],
          [sequelize.col('bsp_1s.year'), 'year'],
          [sequelize.col('bsp_1s.season'), 'season'],
          [sequelize.col('indent_of_breederseed".indent_quantity'), 'indent_quantity'],
          // [sequelize.col('bsp1_production_centers->nucleus_seed_availability.quantity'), 'nucleus_quantity'],
          [sequelize.col('bsp1_production_centers->user.name'), 'bspc_name'],
          [sequelize.col('bsp1_production_centers->user.id'), 'bspc_id'],
          // [sequelize.col('bsp1_production_centers.quantity_of_seed_produced'), 'quantity_of_seed_produced'],
          [sequelize.col('m_crop_variety.variety_code'), 'variety_code'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          // [sequelize.col('m_crop_variety.introduce_year'), 'notification_year'],
        ],
        raw: true
      }
      // condition
      // let bsp1Data = await bsp1Model.findAll(condition);
      // let variety = ['H0125001'];
      // let crop = ["H0125"];
      let season = "";
      let year = "";
      let crop_type = "";
      let crop = [];
      let variety = [];

      // variety.forEach(element=>{

      // })
      if (req.body.search) {
        if (req.body.search.year) {
          year = req.body.search.year;
        }
        if (req.body.search.season) {
          season = req.body.search.season;
        }
        if (req.body.search.crop_type) {
          crop_type = req.body.search.crop_type
        }
        if (req.body.search.crop != undefined && req.body.search.crop.length > 0) {
          let temp = []
          req.body.search.crop.forEach(ele => {
            temp.push("'" + ele + "'");
          })
          crop = 'AND' + " " + '"bsp_1s"."crop_code"' + 'IN' + "" + '(' + temp.toString() + ')';
        }

        if (req.body.search.variety != undefined && req.body.search.variety.length > 0) {
          let temp = []
          req.body.search.variety.forEach(ele => {
            temp.push("'" + ele + "'");
          })
          variety = 'AND' + " " + '"m_crop_variety"."variety_code"' + 'IN' + "" + '(' + temp.toString() + ')';
        }

      }
      let bsp1Data = await db.sequelize.query(`SELECT indent_data.*,nucleus_seed_availabilities."quantity" FROM (SELECT DISTINCT("bsp1_production_centers->user"."name") AS "bspc_name", bsp_1s."year",bsp_1s."crop_code", bsp_1s."season",SUM("bsp1_production_centers"."quantity_of_seed_produced") AS "quantity_of_seed_produced", "bsp_1s"."variety_id" AS "variety_id", bsp1_production_centers."production_center_id","m_crop_variety"."variety_code" AS "variety_code", "m_crop_variety"."variety_name" AS "variety_name","m_crop"."crop_name" AS "crop_name",SUM("indent_of_breederseed"."indent_quantity") AS indent_quantity FROM "bsp_1s" AS "bsp_1s" INNER JOIN "bsp1_production_centers" AS "bsp1_production_centers" ON "bsp_1s"."id" = "bsp1_production_centers"."bsp_1_id"  INNER JOIN "indent_of_breederseeds" AS "indent_of_breederseed" ON "bsp_1s"."indent_of_breederseed_id" = "indent_of_breederseed"."id" INNER JOIN "users" AS "bsp1_production_centers->user" ON "bsp1_production_centers"."production_center_id" = "bsp1_production_centers->user"."id" INNER JOIN "m_crop_varieties" AS "m_crop_variety" ON "bsp_1s"."variety_id" = "m_crop_variety"."id" INNER JOIN "m_crops" AS "m_crop" ON "bsp_1s"."crop_code" = "m_crop"."crop_code" ${variety} WHERE "bsp_1s"."year" = '${year}' AND "bsp_1s"."crop_code" LIKE '${crop_type}%' AND "bsp_1s"."season" = '${season}' ${[crop]} GROUP BY  bsp_1s."year", bsp_1s."crop_code",bsp_1s."season", "bsp_1s"."variety_id","indent_of_breederseed"."indent_quantity","bsp1_production_centers->user"."name",m_crop.crop_name,"m_crop_variety"."variety_code","m_crop_variety"."variety_name", bsp1_production_centers."production_center_id") AS indent_data LEFT OUTER JOIN nucleus_seed_availabilities ON nucleus_seed_availabilities."production_center_id" = indent_data."production_center_id" AND  nucleus_seed_availabilities."year" = indent_data."year" AND  nucleus_seed_availabilities."season" = indent_data."season" AND  nucleus_seed_availabilities."variety_code" = indent_data."variety_code"`, { replacements: ['active'], type: sequelize.QueryTypes.SELECT });

      returnResponse = bsp1Data;

      let data = [] = returnResponse;

      let dataSet = [];
      let dataSet2 = [];
      let temp;
      const abc = data.map(element => {

        if (dataSet.hasOwnProperty(element['variety_id'])) {
          dataSet[element['variety_id']]['bspc'] = [
            ...dataSet[element['variety_id']]['bspc'],
            //  temp += (element['quantity_of_seed_produced']),
            // console.log('quantity_of_seed_produced==========1',(element['quantity_of_seed_produced'])),
            {
              ...{
                name: element['bspc_name'],
                bspc_id: element['production_center_id'],
                available_nucleus_seed: (element['quantity']),
                crop_code: element.crop_code,
                variety_id: element.variety_id,
                allocation_qnt: (element['quantity_of_seed_produced']),
                indent_quantity: (element['indent_quantity'])
              }
            }]
        } else {
          dataSet[element['variety_id']] = element;

          // console.log('quantity_of_seed_produced==========2',(element['quantity_of_seed_produced'])),
          // temp += (element['quantity_of_seed_produced']),
          dataSet[element['variety_id']]['bspc'] = [{
            name: element['bspc_name'],
            bspc_id: element['production_center_id'],
            available_nucleus_seed: (element['quantity']),
            crop_code: element.crop_code,
            variety_id: element.variety_id,
            allocation_qnt: (element['quantity_of_seed_produced']),
            indent_quantity: (element['indent_quantity'])
          }]
        }
        return dataSet2;
      })
      let finaleData = {}
      const abc1 = data.map(element => {
        // console.log(element,'eleem')

        if (element.hasOwnProperty('bspc')) {
          finaleData = [{ ...finaleData }, { ...element }]
          return element;
        }
      })
      return response(res, status.DATA_AVAILABLE, 200, abc1);

      // return response(res, status.DATA_AVAILABLE, 200, returnResponse)

    } catch (error) {
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse)
    }

  }

  static getMasterBspTwoReportData = async (req, res) => {
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
          // [sequelize.fn('DISTINCT', sequelize.col('bsp_1->bsp1_production_centers->user.name')), 'bspc_name'],
          [sequelize.col('bsp_1->bsp1_production_centers->user.name'), 'bspc_name'],
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
          [sequelize.col('bsp_2.expected_availbility'), 'expected_availbility'],
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
      const abc = data.map(element => {

        if (dataSet.hasOwnProperty(element['variety_id'])) {
          dataSet[element['variety_id']]['bspc'] = [...dataSet[element['variety_id']]['bspc'],
          {
            ...{
              name: element['bspc_name'], available_nucleus_seed: (element['quantity']),
              allocation_qnt: (element['quantity_of_seed_produced']),
              area: (element['area']),
              filed_location: (element['field_location']),
              expected_production: (element['expected_production']),
              expected_harvest_to: (element['expected_harvest_to']),
              expected_availbility: (element['expected_availbility']),
              expected_production: (element['expected_production']),
              indent_quantity: (element['indent_quantity']),
              bspc_user_id: (element['bspc_user_id'])
            }
          }]
        } else {
          dataSet[element['variety_id']] = element;
          dataSet[element['variety_id']]['bspc'] = [{
            name: element['bspc_name'], available_nucleus_seed: (element['quantity']), allocation_qnt: (element['quantity_of_seed_produced']), area: (element['area']),
            filed_location: (element['field_location']),
            expected_production: (element['expected_production']),
            expected_harvest_to: (element['expected_harvest_to']),
            expected_availbility: (element['expected_availbility']),
            expected_production: (element['expected_production']),
            indent_quantity: (element['indent_quantity']),
            bspc_user_id: (element['bspc_user_id'])
          }]
        }
        return dataSet2;
      })
      let finaleData = {}
      const abc1 = data.map(element => {

        if (element.hasOwnProperty('bspc')) {
          finaleData = [{ ...finaleData }, { ...element }]
          return element;
        }
      })
      return response(res, status.DATA_AVAILABLE, 200, abc1);

    } catch (error) {
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse)
    }
  }
  static getMasterBspThreeReportData = async (req, res) => {
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

      returnResponse = bsp3Data;

      let data = [] = returnResponse;
      let dataSet = [];
      let dataSet2 = [];
      const abc = data.map(element => {

        if (dataSet.hasOwnProperty(element['crop_code'])) {
          dataSet[element['crop_code']]['bspc'] = [...dataSet[element['crop_code']]['bspc'],
          {
            ...{
              name: element['bspc_name'],
              production_center_id: element.production_center_id,
              variety_name: element['variety_name'],
              variety_code: element['variety_code'],
              report_status: element['report_status'],
              view_moniter_report: element['view_moniter_report'],

            }
          }]
        } else {
          dataSet[element['crop_code']] = element;
          dataSet[element['crop_code']]['bspc'] = [{
            name: element['bspc_name'],
            production_center_id: element.production_center_id,
            variety_name: element['variety_name'],
            variety_code: element['variety_code'],
            report_status: element['report_status'],
            view_moniter_report: element['view_moniter_report'],
          }]
        }
        return dataSet2;
      })
      let finaleData = {}
      const abc1 = data.map(element => {

        if (element.hasOwnProperty('bspc')) {
          finaleData = [{ ...finaleData }, { ...element }]
          return element;
        }
      })
      return response(res, status.DATA_AVAILABLE, 200, abc1);

    } catch (error) {
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse)
    }
  }

  static getBsp1FilterData = async (req, res) => {
    try {
      let condition = {}

      if (req.body.type == 'report_icar') {

        if (req.body.user_type == 'ICAR') {
          condition = {
            raw: true,
            attributes: [
              [sequelize.fn('DISTINCT', sequelize.col('year')), 'year'],
            ],
            where: {
              crop_code: {

                [Op.or]: [
                  { [Op.like]: 'A' + "%" },
                ]
              }
            }

          }
        } if (req.body.user_type == 'HICAR') {
          condition = {
            raw: true,
            attributes: [
              [sequelize.fn('DISTINCT', sequelize.col('year')), 'year'],
            ],
            where: {
              crop_code: {

                [Op.or]: [
                  { [Op.like]: 'H' + "%" },
                ]
              }
            }

          }
        }

        // condition.where.crop_group = (req.body.search.crop_name_data);
      } else {
        condition = {
          raw: true,
          attributes: [
            [sequelize.fn('DISTINCT', sequelize.col('year')), 'year'],
          ],


        }
      }


      if (!req.body.search) {
        condition.order = [['year', 'DESC']];
      }

      if (req.body.search) {
        if (req.body.search) {
          if (req.body.search.year) {
            condition.include = [

              {
                model: seasonModel,
                attributes: [],
              }
            ];
            if (req.body.search.year && !req.body.search.season && !req.body.search.crop_type && !req.body.search.crop_code) {
              condition.order = [[sequelize.col('m_season.season_code'), 'ASC']]
            }
            condition.attributes = [
              [sequelize.fn('DISTINCT', sequelize.col('m_season.season')), 'season_name'],
              [sequelize.col('m_season.season_code'), 'season_code'],
            ];
            condition.raw = true
            if (req.body.search.type == 'report_icar') {
              if (req.body.search.user_type == 'ICAR') {
                condition.where = {
                  year: req.body.search.year,
                  crop_code: {

                    [Op.or]: [
                      { [Op.like]: 'A' + "%" },
                    ]
                  }
                }


              } if (req.body.search.user_type == 'HICAR') {
                condition.where = {
                  year: req.body.search.year,
                  crop_code: {

                    [Op.or]: [
                      { [Op.like]: 'H' + "%" },
                    ]
                  }
                }
              }

              // condition.where.crop_group = (req.body.search.crop_name_data);
            } else {

              condition.where = {
                year: req.body.search.year,
                crop_code: {

                  [Op.or]: [
                    { [Op.like]: 'H' + "%" },
                  ]
                }
              }
            }
          }
          if (req.body.search.year && req.body.search.season) {
            condition.include = [
              {
                model: cropModel,
                attributes: []
              }
            ];
            condition.attributes = [
              [sequelize.fn('DISTINCT', sequelize.col('m_crop.crop_name')), 'crop_type_name'],
              [sequelize.col('m_crop.crop_code'), 'crop_type'],
            ];
            condition.raw = true

            if (req.body.search.type == 'report_icar') {
              if (req.body.search.user_type == 'ICAR') {
                condition.where = {
                  year: req.body.search.year,
                  season: req.body.search.season,
                  crop_code: {

                    [Op.or]: [
                      { [Op.like]: 'A' + "%" },
                    ]
                  }
                }


              } if (req.body.search.user_type == 'HICAR') {
                condition.where = {
                  year: req.body.search.year,
                  season: req.body.search.season,
                  crop_code: {

                    [Op.or]: [
                      { [Op.like]: 'H' + "%" },
                    ]
                  }
                }
              }

              // condition.where.crop_group = (req.body.search.crop_name_data);
            }
            else {
              condition.where = {
                year: req.body.search.year,
                season: req.body.search.season

              }
            }

          }

          if (req.body.search.year && req.body.search.season && req.body.search.crop_type) {
            if (req.body.search.type == 'report_icar') {
              console.log('report_icar')
              if (req.body.search.user_type == 'ICAR') {
                condition.include = [
                  {
                    model: varietyModel,
                    attributes: [],
                    order: [['variety_name', 'ASC']],
                  },
                  {
                    model: cropModel,
                    attributes: [],
                    where: {
                      crop_code: {
                        [Op.like]: "A" + "%",
                      },
                      // breeder_id: req.body.search.breeder_id
                    }
                  }
                ]
                // condition.where.crop_code = {
                //   [Op.or]: [
                //     { [Op.like]: 'A' + "%" },
                //   ]
                // }

              } if (req.body.search.user_type == 'HICAR') {
                condition.where.crop_code = {
                  [Op.or]: [
                    { [Op.like]: 'H' + "%" },
                  ]
                }
              }

              // condition.where.crop_group = (req.body.search.crop_name_data);
            }
            else {
              condition.include = [
                {
                  model: cropModel,
                  attributes: [],
                  order: [['crop_name', 'ASC']],
                  where: {
                    crop_code: {
                      [Op.like]: req.body.search.crop_type + "%",
                    },
                    // breeder_id: req.body.search.breeder_id
                  }
                }
              ]
            }
            condition.attributes = [
              [sequelize.fn('DISTINCT', sequelize.col('m_crop.crop_code')), 'crop_code'],
              [sequelize.col('m_crop.crop_name'), 'crop_name']
            ],
              // condition.where = {
              //   year: req.body.search.year,
              //   season: req.body.search.season,
              // },
              condition.raw = true

          }
          if (req.body.search.year && req.body.search.season && req.body.search.crop_type && req.body.search.crop_code) {


            if (req.body.search.type == 'report_icar') {
              if (req.body.search.user_type == 'ICAR') {
                condition.include = [
                  {
                    model: varietyModel,
                    attributes: [],
                    order: [['variety_name', 'ASC']],
                  },
                  {
                    model: cropModel,
                    attributes: [],
                    where: {
                      crop_code: {
                        [Op.like]: "A" + "%",
                      },
                      // breeder_id: req.body.search.breeder_id
                    }
                  }
                ]
                // condition.where.crop_code = {
                //   [Op.or]: [
                //     { [Op.like]: 'A' + "%" },
                //   ]
                // }

              } if (req.body.search.user_type == 'HICAR') {
                condition.where.crop_code = {
                  [Op.or]: [
                    { [Op.like]: 'H' + "%" },
                  ]
                }
              }

              // condition.where.crop_group = (req.body.search.crop_name_data);
            } else {
              condition.include = [
                {
                  model: varietyModel,
                  attributes: [],
                  order: [['variety_name', 'ASC']],
                },
                {
                  model: cropModel,
                  attributes: [],
                  where: {
                    crop_code: {
                      [Op.like]: req.body.search.crop_type + "%",
                    },
                    // breeder_id: req.body.search.breeder_id
                  }
                },
              ]

            }
            condition.attributes = [
              [sequelize.fn('DISTINCT', sequelize.col('m_crop_variety.variety_code')), 'variety_code'],
              [sequelize.col('m_crop_variety.variety_name'), 'variety_name']
            ],

              condition.where = {
                year: req.body.search.year,
                season: req.body.search.season,
                crop_code: {
                  [Op.in]: req.body.search.crop_code
                }
              },
              condition.raw = true
          }
        }
      }
      let data = await bsp1Model.findAll(condition);

      if (data) {
        if (req.body.search) {
          // if (req.body.search.type == 'report_icar') {
          //   if (req.body.search.user_type == 'ICAR') {
          //        condition.include = [
          //   {
          //     model: varietyModel,
          //     attributes: [],
          //     order: [['variety_name', 'ASC']],
          //   },
          //   {
          //     model: cropModel,
          //     attributes: [],
          //     where: {
          //       crop_code: {
          //         [Op.like]: "A" + "%",
          //       },
          //       // breeder_id: req.body.search.breeder_id
          //     }
          //   }
          // ]
          //     // condition.where.crop_code = {
          //     //   [Op.or]: [
          //     //     { [Op.like]: 'A' + "%" },
          //     //   ]
          //     // }

          //   }  if (req.body.search.user_type == 'HICAR')  {
          //     condition.where.crop_code = {
          //       [Op.or]: [
          //         { [Op.like]: 'H' + "%" },
          //       ]
          //     }
          //   }

          //   // condition.where.crop_group = (req.body.search.crop_name_data);
          // }else
          if (req.body.search.year && req.body.search.season) {
            console.log(data[0].crop_type, '')

            if (data[0] && data[0].crop_type) {
              if ((data[0].crop_type).slice(0, 1) == 'A') {
                data[0].crop_type = 'Agriculture';
                data[0].crop_type_code = 'A';
              } else if ((data[0].crop_type).slice(0, 1) == 'H') {
                data[0].crop_type = 'Horticulture';
                data[0].crop_type_code = 'H';
                // unitKgQ = 'kilogram';
              } else {
                data[0].crop_type = "";
              }
            }

          }
        }
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    } catch (error) {
      console.log(error);
      return response(res, status.DATA_NOT_AVAILABLE, 500, error);
    }
  }

  static getBsp2FilterData = async (req, res) => {
    try {
      let condition = {}
      if (req.body.type == 'report_icar') {
        console.log(req.body.type, 'req.body.type ')
        if (req.body.user_type == 'ICAR') {
          condition = {
            raw: true,
            attributes: [
              [sequelize.fn('DISTINCT', sequelize.col('year')), 'year'],
            ],
            where: {
              crop_code: {

                [Op.or]: [
                  { [Op.like]: 'A' + "%" },
                ]
              }
            }

          }
        } if (req.body.user_type == 'HICAR') {
          condition = {
            raw: true,
            attributes: [
              [sequelize.fn('DISTINCT', sequelize.col('year')), 'year'],
            ],
            where: {
              crop_code: {

                [Op.or]: [
                  { [Op.like]: 'H' + "%" },
                ]
              }
            }

          }
        }

        // condition.where.crop_group = (req.body.search.crop_name_data);
      } else {
        condition = {
          raw: true,
          attributes: [
            [sequelize.fn('DISTINCT', sequelize.col('year')), 'year'],
          ],


        }
      }
      // let condition = {
      //   raw: true,
      //   attributes: [
      //     [sequelize.fn('DISTINCT', sequelize.col('year')), 'year'],
      //   ]
      // }

      if (!req.body.search) {
        condition.order = [['year', 'DESC']];
      }

      if (req.body.search) {
        if (req.body.search.year) {
          condition.include = [
            {
              model: seasonModel,
              attributes: [],
              order: [['season_code', 'ASC']]
            }
          ];
          condition.attributes = [
            [sequelize.fn('DISTINCT', sequelize.col('m_season.season')), 'season_name'],
            [sequelize.col('m_season.season_code'), 'season_code'],
          ];
          condition.raw = true
          // condition.order = [[sequelize.col('m_season.season_code'),'ASC']]


          if (req.body.search.type == 'report_icar') {
            if (req.body.search.user_type == 'ICAR') {
              condition.where = {
                year: req.body.search.year,
                crop_code: {
                  [Op.or]: [
                    { [Op.like]: 'A' + "%" },
                  ]
                }
              }


            } if (req.body.search.user_type == 'HICAR') {
              condition.where = {
                year: req.body.search.year,
                crop_code: {
                  [Op.or]: [
                    { [Op.like]: 'H' + "%" },
                  ]
                }
              }
            }

            // condition.where.crop_group = (req.body.search.crop_name_data);
          }
          else {
            condition.where = {
              year: req.body.search.year,

            }
          }
        }
        if (req.body.search.year && req.body.search.season) {
          condition.include = [
            {
              model: cropModel,
              attributes: [],
            }
          ];
          condition.attributes = [
            [sequelize.fn('DISTINCT', sequelize.col('m_crop.crop_name')), 'crop_type_name'],
            [sequelize.col('m_crop.crop_code'), 'crop_type'],
          ];
          condition.raw = true

          if (req.body.search.type == 'report_icar') {
            if (req.body.search.user_type == 'ICAR') {
              condition.where = {
                year: req.body.search.year,
                season: req.body.search.season,
                crop_code: {
                  [Op.or]: [
                    { [Op.like]: 'A' + "%" },
                  ]
                }
              }


            } if (req.body.search.user_type == 'HICAR') {
              condition.where = {
                year: req.body.search.year,
                season: req.body.search.season,
                crop_code: {
                  [Op.or]: [
                    { [Op.like]: 'H' + "%" },
                  ]
                }
              }
            }

            // condition.where.crop_group = (req.body.search.crop_name_data);
          }
          else {
            condition.where = {
              year: req.body.search.year,
              season: req.body.search.season,

            }
          }
        }
        if (req.body.search.year && req.body.search.season && req.body.search.crop_type) {

          if (req.body.search.type == 'report_icar') {
            if (req.body.search.user_type == 'ICAR') {
              condition.include = [
                {
                  model: cropModel,
                  attributes: [],
                  order: [['crop_name', 'ASC']],
                  where: {
                    crop_code: {
                      [Op.like]: 'A' + "%",
                    },
                    // breeder_id: req.body.search.breeder_id
                  }
                }
              ]


            } if (req.body.search.user_type == 'HICAR') {
              condition.include = [
                {
                  model: cropModel,
                  attributes: [],
                  order: [['crop_name', 'ASC']],
                  where: {
                    crop_code: {
                      [Op.like]: 'H' + "%",
                    },
                    // breeder_id: req.body.search.breeder_id
                  }
                }
              ]
            }

            // condition.where.crop_group = (req.body.search.crop_name_data);
          }
          else {
            condition.include = [
              {
                model: cropModel,
                attributes: [],
                order: [['crop_name', 'ASC']],
                where: {
                  crop_code: {
                    [Op.like]: req.body.search.crop_type + "%",
                  },
                  // breeder_id: req.body.search.breeder_id
                }
              }
            ]
          }

          condition.attributes = [
            [sequelize.fn('DISTINCT', sequelize.col('m_crop.crop_code')), 'crop_code'],
            [sequelize.col('m_crop.crop_name'), 'crop_name']
          ],
            condition.where = {
              year: req.body.search.year,
              season: req.body.search.season,
            },
            condition.raw = true

        }
        if (req.body.search.year && req.body.search.season && req.body.search.crop_type && req.body.search.crop_code) {
          condition.include = [
            {
              model: varietyModel,
              attributes: [],
              order: [['variety_name', 'ASC']],
            },
            {
              model: cropModel,
              attributes: [],
              where: {
                crop_code: {
                  [Op.like]: req.body.search.crop_type + "%",
                },
                // breeder_id: req.body.search.breeder_id
              }
            },
          ],

            condition.attributes = [
              [sequelize.fn('DISTINCT', sequelize.col('m_crop_variety.variety_code')), 'variety_code'],
              [sequelize.col('m_crop_variety.variety_name'), 'variety_name']
            ],

            condition.where = {
              year: req.body.search.year,
              season: req.body.search.season,
              crop_code: req.body.search.crop_code
            },
            condition.raw = true
        }

      }

      let data = await bsp2Model.findAll(condition);

      if (data) {
        if (req.body.search) {
          // if (req.body.search.type == 'report_icar') {
          //   if (req.body.search.user_type == 'ICAR') {
          //     condition.include = [
          //       {
          //         model: cropModel,
          //         attributes: [],
          //         order: [['crop_name', 'ASC']],
          //         where: {
          //           crop_code: {
          //             [Op.like]: 'A' + "%",
          //           },
          //           // breeder_id: req.body.search.breeder_id
          //         }
          //       }
          //     ]


          //   }if (req.body.search.user_type == 'HICAR'){
          //     condition.include = [
          //       {
          //         model: cropModel,
          //         attributes: [],
          //         order: [['crop_name', 'ASC']],
          //         where: {
          //           crop_code: {
          //             [Op.like]: 'H' + "%",
          //           },
          //           // breeder_id: req.body.search.breeder_id
          //         }
          //       }
          //     ]
          //   }

          //     // condition.where.crop_group = (req.body.search.crop_name_data);
          //   }else
          if (req.body.search.year && req.body.search.season) {
            if (data[0] && data[0].crop_type) {
              if ((data[0].crop_type).slice(0, 1) == 'A') {
                data[0].crop_type = 'Agriculture';
                data[0].crop_type_code = 'A';
              } else if ((data[0].crop_type).slice(0, 1) == 'H') {
                data[0].crop_type = 'Horticulture';
                data[0].crop_type_code = 'H';
                // unitKgQ = 'kilogram';
              }
              else {
                data[0].crop_type = "";
              }
            }
          }
        }
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    } catch (error) {
      console.log(error);
      return response(res, status.DATA_NOT_AVAILABLE, 500, error);
    }
  }

  static getBsp3FilterData = async (req, res) => {
    try {
      let condition = {}
      if (req.body.search.type == 'report_icar') {
        if (req.body.search.user_type == 'ICAR') {
          condition = {
            raw: true,
            attributes: [
              [sequelize.fn('DISTINCT', sequelize.col('year')), 'year'],
            ],
            where: {
              crop_code: {

                [Op.or]: [
                  { [Op.like]: 'A' + "%" },
                ]
              }
            }

          }
        } if (req.body.search.user_type == 'HICAR') {
          condition = {
            raw: true,
            attributes: [
              [sequelize.fn('DISTINCT', sequelize.col('year')), 'year'],
            ],
            where: {
              crop_code: {

                [Op.or]: [
                  { [Op.like]: 'H' + "%" },
                ]
              }
            }

          }
        }

        // condition.where.crop_group = (req.body.search.crop_name_data);
      } else {
        condition = {
          raw: true,
          attributes: [
            [sequelize.fn('DISTINCT', sequelize.col('year')), 'year'],
          ],


        }
      }
      // let condition = {
      //   raw: true,
      //   attributes: [
      //     [sequelize.fn('DISTINCT', sequelize.col('year')), 'year'],
      //   ],
      // }
      if (!req.body.search) {
        condition.order = [['year', 'DESC']];
      }

      if (req.body.search) {
        if (req.body.search.year) {
          condition.include = [
            {
              model: seasonModel,
              attributes: []
            }
          ];
          condition.attributes = [
            [sequelize.fn('DISTINCT', sequelize.col('m_season.season')), 'season_name'],
            [sequelize.col('m_season.season_code'), 'season_code'],
          ];
          condition.raw = true;
          if (req.body.search.type == 'report_icar') {
            if (req.body.search.user_type == 'ICAR') {
              condition.where = {
                year: req.body.search.year,
                crop_code: {
                  [Op.like]: 'A' + "%",
                },
              }


            } if (req.body.search.user_type == 'HICAR') {
              condition.where = {
                year: req.body.search.year,
                crop_code: {
                  [Op.like]: 'H' + "%",
                },
              }
            }

            // condition.where.crop_group = (req.body.search.crop_name_data);
          }
          else {
            condition.where = {
              year: req.body.search.year,

            }
          }
        }
        if (req.body.search.year && req.body.search.season) {
          condition.include = [
            {
              model: cropModel,
              attributes: []
            }
          ];
          condition.attributes = [
            [sequelize.fn('DISTINCT', sequelize.col('m_crop.crop_name')), 'crop_type_name'],
            [sequelize.col('m_crop.crop_code'), 'crop_type'],
          ];
          condition.raw = true
          if (req.body.search.type == 'report_icar') {
            if (req.body.search.user_type == 'ICAR') {
              condition.where = {
                year: req.body.search.year,
                season: req.body.search.season,
                crop_code: {
                  [Op.like]: 'A' + "%",
                },
              }


            } if (req.body.search.user_type == 'HICAR') {
              condition.where = {
                year: req.body.search.year,
                season: req.body.search.season,
                crop_code: {
                  [Op.like]: 'H' + "%",
                },
              }
            }

            // condition.where.crop_group = (req.body.search.crop_name_data);
          }
          else {
            condition.where = {
              year: req.body.search.year,
              season: req.body.search.season,
            }
          }
        }
        if (req.body.search.year && req.body.search.season && req.body.search.crop_type) {
          if (req.body.search.type == 'report_icar') {
            if (req.body.search.user_type == 'ICAR') {
              condition.include = [
                {
                  model: cropModel,
                  attributes: [],
                  order: [['crop_name', 'ASC']],
                  where: {
                    crop_code: {
                      [Op.like]: 'A' + "%",
                    },
                    // breeder_id: req.body.search.breeder_id
                  }
                }
              ]


            } if (req.body.search.user_type == 'HICAR') {
              condition.include = [
                {
                  model: cropModel,
                  attributes: [],
                  order: [['crop_name', 'ASC']],
                  where: {
                    crop_code: {
                      [Op.like]: 'H' + "%",
                    },
                    // breeder_id: req.body.search.breeder_id
                  }
                }
              ]
            } else {
              condition.include = [
                {
                  model: cropModel,
                  attributes: [],
                  order: [['crop_name', 'ASC']],
                  where: {
                    crop_code: {
                      [Op.like]: req.body.search.crop_type + "%",
                    },
                    // breeder_id: req.body.search.breeder_id
                  }
                }
              ]
            }

            // condition.where.crop_group = (req.body.search.crop_name_data);
          }


          condition.attributes = [
            [sequelize.fn('DISTINCT', sequelize.col('m_crop.crop_code')), 'crop_code'],
            [sequelize.col('m_crop.crop_name'), 'crop_name']
          ],
            condition.where = {
              year: req.body.search.year,
              season: req.body.search.season,
            },
            condition.raw = true

        }
        if (req.body.search.year && req.body.search.season && req.body.search.crop_type && req.body.search.crop_code) {
          condition.include = [
            {
              model: varietyModel,
              attributes: [],
              order: [['variety_name', 'ASC']],
            },
            {
              model: cropModel,
              attributes: [],
              where: {
                crop_code: {
                  [Op.like]: req.body.search.crop_type + "%",
                },
                // breeder_id: req.body.search.breeder_id
              }
            },
          ],

            condition.attributes = [
              [sequelize.fn('DISTINCT', sequelize.col('m_crop_variety.variety_code')), 'variety_code'],
              [sequelize.col('m_crop_variety.variety_name'), 'variety_name']
            ],

            condition.where = {
              year: req.body.search.year,
              season: req.body.search.season,
              crop_code: {
                [Op.in]: req.body.search.crop_code
              }
            },
            condition.raw = true
        }
      }
      let data = await bsp3Model.findAll(condition);

      if (data) {
        if (req.body.search) {
          // if (req.body.search.type == 'report_icar') {
          //   if (req.body.search.user_type == 'ICAR') {
          //     condition.where = {
          //       year: req.body.search.year,
          //       crop_code: {
          //         [Op.like]: 'A' + "%",
          //       },
          //     }


          //   } if (req.body.search.user_type == 'HICAR') {
          //     condition.where = {
          //       year: req.body.search.year,
          //       crop_code: {
          //         [Op.like]: 'H' + "%",
          //       },
          //     }
          //   }

          //     // condition.where.crop_group = (req.body.search.crop_name_data);
          //   }
          //   else
          if (req.body.search.year && req.body.search.season) {
            if (data[0].crop_type) {
              if ((data[0] && data[0].crop_type).slice(0, 1) == 'A') {
                data[0].crop_type = 'Agriculture';
                data[0].crop_type_code = 'A';
              } else if ((data[0].crop_type).slice(0, 1) == 'H') {
                data[0].crop_type = 'Horticulture';
                data[0].crop_type_code = 'H';
              } else {
                data[0].crop_type = "";
              }
            }
          }
        }

        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    } catch (error) {
      console.log(error);
      return response(res, status.DATA_NOT_AVAILABLE, 500, error);
    }
  }

  static getBsp4FilterData = async (req, res) => {
    try {
      let condition = {
        raw: true,
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('year')), 'year'],
        ]
      }
      if (req.body.search) {
        if (req.body.search.year) {
          condition.where.year = req.body.search.year
        }

      }
      condition.order = [[sequelize.col('year'), 'DESC']]
      let data = await bsp4Model.findAll(condition);

      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    } catch (error) {
      console.log(error);
      return response(res, status.DATA_NOT_AVAILABLE, 500, error);
    }
  }

  static getBsp5aFilterData = async (req, res) => {
    try {
      let condition = {}
      if (req.body.search.type == 'report_icar') {
        if (req.body.search.user_type == 'ICAR') {
          condition = {
            raw: true,
            attributes: [
              [sequelize.fn('DISTINCT', sequelize.col('year')), 'year'],
            ],
            where: {
              crop_code: {

                [Op.or]: [
                  { [Op.like]: 'A' + "%" },
                ]
              }
            }

          }
        } if (req.body.search.user_type == 'HICAR') {
          condition = {
            raw: true,
            attributes: [
              [sequelize.fn('DISTINCT', sequelize.col('year')), 'year'],
            ],
            where: {
              crop_code: {

                [Op.or]: [
                  { [Op.like]: 'H' + "%" },
                ]
              }
            }

          }
        }

        // condition.where.crop_group = (req.body.search.crop_name_data);
      } else {
        condition = {
          raw: true,
          attributes: [
            [sequelize.fn('DISTINCT', sequelize.col('year')), 'year'],
          ],


        }
      }
      // let condition = {
      //   raw: true,
      //   attributes: [
      //     [sequelize.fn('DISTINCT', sequelize.col('year')), 'year'],
      //   ]
      // }
      console.log(Object.keys(req.body.search).length, 'req.body.search')
      if (Object.keys(req.body.search).length < 1) {
        console.log('jjkk')
        condition.order = [['year', 'DESC']];
      }

      if (req.body.search) {
        if (req.body.search.year) {
          condition.include = [
            {
              model: seasonModel,
              attributes: []
            }
          ];
          condition.attributes = [
            [sequelize.fn('DISTINCT', sequelize.col('m_season.season')), 'season_name'],
            [sequelize.col('m_season.season_code'), 'season_code'],
          ];
          condition.raw = true
          condition.where = {
            year: req.body.search.year
          }
        }
        if (req.body.search.year && req.body.search.season) {
          condition.include = [
            {
              model: cropModel,
              attributes: []
            }
          ];
          condition.attributes = [
            [sequelize.fn('DISTINCT', sequelize.col('m_crop.crop_name')), 'crop_type_name'],
            [sequelize.col('m_crop.crop_code'), 'crop_type'],
          ];
          condition.raw = true
          if (req.body.search.type == 'report_icar') {
            if (req.body.search.user_type == 'ICAR') {
              condition.where = {
                year: req.body.search.year,
                season: req.body.search.season,
                crop_code: {
                  [Op.or]: [
                    { [Op.like]: 'A' + "%" },
                  ]
                }
              }
              // condition.where.crop_code ={
              //   [Op.or]:[
              //     { [Op.like]: 'A' + "%" },
              //   ]
              // }

            } if (req.body.search.user_type == 'HICAR') {
              condition.where.crop_code = {
                [Op.or]: [
                  { [Op.like]: 'H' + "%" },
                ]
              }
            }

            // condition.where.crop_group = (req.body.search.crop_name_data);
          } else {
            condition.where = {
              year: req.body.search.year,
              season: req.body.search.season,

            }
          }

        }

        if (req.body.search.year && req.body.search.season && req.body.search.crop_type) {
          if (req.body.search.type == 'report_icar') {
            if (req.body.search.user_type == 'ICAR') {
              condition.include = [
                {
                  model: cropModel,
                  attributes: [],
                  order: [['crop_name', 'ASC']],
                  where: {
                    crop_code: {
                      [Op.like]: 'A' + "%",
                    },
                    // breeder_id: req.body.search.breeder_id
                  }
                }
              ]
              // condition.where.crop_code ={
              //   [Op.or]:[
              //     { [Op.like]: 'A' + "%" },
              //   ]
              // }

            } if (req.body.search.user_type == 'HICAR') {
              condition.include = [
                {
                  model: cropModel,
                  attributes: [],
                  order: [['crop_name', 'ASC']],
                  where: {
                    crop_code: {
                      [Op.like]: 'H' + "%",
                    },
                    // breeder_id: req.body.search.breeder_id
                  }
                }
              ]
            }

            // condition.where.crop_group = (req.body.search.crop_name_data);
          } else {
            condition.include = [
              {
                model: cropModel,
                attributes: [],
                order: [['crop_name', 'ASC']],
                where: {
                  crop_code: {
                    [Op.like]: req.body.search.crop_type + "%",
                  },
                  // breeder_id: req.body.search.breeder_id
                }
              }
            ]
          }


          condition.attributes = [
            [sequelize.fn('DISTINCT', sequelize.col('m_crop.crop_code')), 'crop_code'],
            [sequelize.col('m_crop.crop_name'), 'crop_name']
          ],
            condition.where = {
              year: req.body.search.year,
              season: req.body.search.season,
            },
            condition.raw = true

        }
        if (req.body.search.year && req.body.search.season && req.body.search.crop_type && req.body.search.crop_code) {
          if (req.body.search.type == 'report_icar') {
            if (req.body.search.user_type == 'ICAR') {
              condition.include = [
                {
                  model: varietyModel,
                  attributes: [],
                  order: [['variety_name', 'ASC']],
                },
                {
                  model: cropModel,
                  attributes: [],
                  where: {
                    crop_code: {
                      [Op.like]: 'A' + "%",
                    },
                    // breeder_id: req.body.search.breeder_id
                  }
                },
              ]
              // condition.where.crop_code ={
              //   [Op.or]:[
              //     { [Op.like]: 'A' + "%" },
              //   ]
              // }

            } if (req.body.search.user_type == 'HICAR') {
              condition.include = [
                {
                  model: varietyModel,
                  attributes: [],
                  order: [['variety_name', 'ASC']],
                },
                {
                  model: cropModel,
                  attributes: [],
                  where: {
                    crop_code: {
                      [Op.like]: "H" + "%",
                    },
                    // breeder_id: req.body.search.breeder_id
                  }
                },
              ]

            }

            // condition.where.crop_group = (req.body.search.crop_name_data);
          }
          else {
            condition.include = [
              {
                model: varietyModel,
                attributes: [],
                order: [['variety_name', 'ASC']],
              },
              {
                model: cropModel,
                attributes: [],
                where: {
                  crop_code: {
                    [Op.like]: req.body.search.crop_type + "%",
                  },
                  // breeder_id: req.body.search.breeder_id
                }
              },
            ]
          }

          condition.attributes = [
            [sequelize.fn('DISTINCT', sequelize.col('m_crop_variety.variety_code')), 'variety_code'],
            [sequelize.col('m_crop_variety.variety_name'), 'variety_name']
          ],

            condition.where = {
              year: req.body.search.year,
              season: req.body.search.season,
              crop_code: req.body.search.crop_code
            },
            condition.raw = true
        }
      }
      let data = await bsp5aModel.findAll(condition);

      if (data) {
        if (req.body.search) {
          // if (req.body.search.type == 'report_icar') {
          //   if (req.body.search.user_type == 'ICAR') {
          //     condition.where = {
          //       year: req.body.search.year,
          //       season: req.body.search.season,
          //       crop_code:{
          //           [Op.or]:[
          //             { [Op.like]: 'A' + "%" },
          //           ]
          //         }
          //     }
          //     // condition.where.crop_code ={
          //     //   [Op.or]:[
          //     //     { [Op.like]: 'A' + "%" },
          //     //   ]
          //     // }

          //   }if (req.body.search.user_type == 'HICAR'){
          //     condition.where.crop_code ={
          //       [Op.or]:[
          //         { [Op.like]: 'H' + "%" },
          //       ]
          //     }
          //   }

          //     // condition.where.crop_group = (req.body.search.crop_name_data);
          //   }
          //   else
          if (req.body.search.year && req.body.search.season) {
            if (data[0] && data[0].crop_type) {
              if ((data[0].crop_type).slice(0, 1) == 'A') {
                data[0].crop_type = 'Agriculture';
                data[0].crop_type_code = 'A';
              } else if ((data[0].crop_type).slice(0, 1) == 'H') {
                data[0].crop_type = 'Horticulture';
                data[0].crop_type_code = 'H';
              } else {
                data[0].crop_type = "";
              }
            }
          }
        }

        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }

    } catch (error) {
      console.log(error);
      return response(res, status.DATA_NOT_AVAILABLE, 500, error);
    }
  }

  static getBsp5bFilterData = async (req, res) => {
    try {
      let condition = {}

      if (req.body.search.type == 'report_icar') {
        if (req.body.search.user_type == 'ICAR') {
          condition = {
            raw: true,
            attributes: [
              [sequelize.fn('DISTINCT', sequelize.col('year')), 'year'],
            ],
            where: {
              crop_code: {

                [Op.or]: [
                  { [Op.like]: 'A' + "%" },
                ]
              }
            }

          }
        } if (req.body.search.user_type == 'HICAR') {
          condition = {
            raw: true,
            attributes: [
              [sequelize.fn('DISTINCT', sequelize.col('year')), 'year'],
            ],
            where: {
              crop_code: {

                [Op.or]: [
                  { [Op.like]: 'H' + "%" },
                ]
              }
            }

          }
        }

        // condition.where.crop_group = (req.body.search.crop_name_data);
      } else {
        condition = {
          raw: true,
          attributes: [
            [sequelize.fn('DISTINCT', sequelize.col('year')), 'year'],
          ],


        }
      } if (!req.body.search) {
        condition.order = [['year', 'DESC']];
      }

      if (req.body.search) {
        if (req.body.search.year) {
          condition.include = [
            {
              model: seasonModel,
              attributes: []
            }
          ];
          condition.attributes = [
            [sequelize.fn('DISTINCT', sequelize.col('m_season.season')), 'season_name'],
            [sequelize.col('m_season.season_code'), 'season_code'],
          ];
          condition.raw = true
          condition.where = {
            year: req.body.search.year
          }
        }
        if (req.body.search.year && req.body.search.season) {
          condition.include = [
            {
              model: cropModel,
              attributes: []
            }
          ];
          condition.attributes = [
            [sequelize.fn('DISTINCT', sequelize.col('m_crop.crop_name')), 'crop_type_name'],
            [sequelize.col('m_crop.crop_code'), 'crop_type'],
          ];
          condition.raw = true;
          if (req.body.search.type == 'report_icar') {
            if (req.body.search.user_type == 'ICAR') {
              condition.where = {
                year: req.body.search.year,
                season: req.body.search.season,
                crop_code: {
                  [Op.or]: [
                    { [Op.like]: 'A' + "%" },
                  ]
                }
              }


            } if (req.body.search.user_type == 'HICAR') {
              condition.where.crop_code = {
                [Op.or]: [
                  { [Op.like]: 'H' + "%" },
                ]
              }
            }

            // condition.where.crop_group = (req.body.search.crop_name_data);
          }
          else {
            condition.where = {
              year: req.body.search.year,
              season: req.body.search.season,

            }
          }

        }

        if (req.body.search.year && req.body.search.season && req.body.search.crop_type) {
          if (req.body.search.type == 'report_icar') {
            if (req.body.search.user_type == 'ICAR') {
              condition.include = [
                {
                  model: cropModel,
                  attributes: [],
                  order: [['crop_name', 'ASC']],
                  where: {
                    crop_code: {
                      [Op.like]: 'A' + "%",
                    },
                    // breeder_id: req.body.search.breeder_id
                  }
                }
              ]


            } if (req.body.search.user_type == 'HICAR') {
              condition.include = [
                {
                  model: cropModel,
                  attributes: [],
                  order: [['crop_name', 'ASC']],
                  where: {
                    crop_code: {
                      [Op.like]: 'H' + "%",
                    },
                    // breeder_id: req.body.search.breeder_id
                  }
                }
              ]
            }

            // condition.where.crop_group = (req.body.search.crop_name_data);
          } else {
            condition.include = [
              {
                model: cropModel,
                attributes: [],
                order: [['crop_name', 'ASC']],
                where: {
                  crop_code: {
                    [Op.like]: req.body.search.crop_type + "%",
                  },
                  // breeder_id: req.body.search.breeder_id
                }
              }
            ]
          }


          condition.attributes = [
            [sequelize.fn('DISTINCT', sequelize.col('m_crop.crop_code')), 'crop_code'],
            [sequelize.col('m_crop.crop_name'), 'crop_name']
          ],
            condition.where = {
              year: req.body.search.year,
              season: req.body.search.season,
            },
            condition.raw = true

        }
        if (req.body.search.year && req.body.search.season && req.body.search.crop_type && req.body.search.crop_code) {
          if (req.body.search.type == 'report_icar') {
            if (req.body.search.user_type == 'ICAR') {
              condition.include = [
                {
                  model: varietyModel,
                  attributes: [],
                  order: [['variety_name', 'ASC']],
                },
                {
                  model: cropModel,
                  attributes: [],
                  where: {
                    crop_code: {
                      [Op.like]: "A" + "%",
                    },
                    // breeder_id: req.body.search.breeder_id
                  }
                },
              ]


            } if (req.body.search.user_type == 'HICAR') {
              condition.include = [
                {
                  model: varietyModel,
                  attributes: [],
                  order: [['variety_name', 'ASC']],
                },
                {
                  model: cropModel,
                  attributes: [],
                  where: {
                    crop_code: {
                      [Op.like]: 'H' + "%",
                    },
                    // breeder_id: req.body.search.breeder_id
                  }
                },
              ]
            }

            // condition.where.crop_group = (req.body.search.crop_name_data);
          }


          // condition.attributes = [
          //   [sequelize.fn('DISTINCT', sequelize.col('m_crop_variety.variety_code')), 'variety_code'],
          //   [sequelize.col('m_crop_variety.variety_name'), 'variety_name']
          // ],

          condition.where = {
            year: req.body.search.year,
            season: req.body.search.season,
            crop_code: req.body.search.crop_code
          },
            condition.raw = true
        }
      }
      let data = await bsp5bModel.findAll(condition);

      if (data) {
        if (req.body.search) {
          // if (req.body.search.type == 'report_icar') {
          //   if (req.body.search.user_type == 'ICAR') {
          //     condition.include = [
          //       {
          //         model: cropModel,
          //         attributes: [],
          //         order: [['crop_name', 'ASC']],
          //         where: {
          //           crop_code: {
          //             [Op.like]: 'A' + "%",
          //           },
          //           // breeder_id: req.body.search.breeder_id
          //         }
          //       }
          //     ]


          //   } if (req.body.search.user_type == 'HICAR'){
          //     condition.include = [
          //       {
          //         model: cropModel,
          //         attributes: [],
          //         order: [['crop_name', 'ASC']],
          //         where: {
          //           crop_code: {
          //             [Op.like]: 'H' + "%",
          //           },
          //           // breeder_id: req.body.search.breeder_id
          //         }
          //       }
          //     ]
          //   }

          //     // condition.where.crop_group = (req.body.search.crop_name_data);
          //   }else
          if (req.body.search.year && req.body.search.season) {
            if (data[0] && data[0].crop_type) {
              if ((data[0].crop_type).slice(0, 1) == 'A') {
                data[0].crop_type = 'Agriculture';
                data[0].crop_type_code = 'A';
              } else if ((data[0].crop_type).slice(0, 1) == 'H') {
                data[0].crop_type = 'Horticulture';
                data[0].crop_type_code = 'H';
              } else {
                data[0].crop_type = "";
              }
            }
          }
        }

        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    } catch (error) {
      console.log(error);
      return response(res, status.DATA_NOT_AVAILABLE, 500, error);
    }
  }

  static getBsp6FilterData = async (req, res) => {
    try {
      let condition = {
        raw: true,
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('year')), 'year'],
        ]
      }
      if (req.body.search) {
        if (req.body.search.year) {
          condition.where.year = req.body.search.year
        }
      }
      let data = await bsp6Model.findAll(condition);

      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    } catch (error) {
      console.log(error);
      return response(res, status.DATA_NOT_AVAILABLE, 500, error);
    }
  }

  static getBspSixCropTypeFilterData = async (req, res) => {
    try {
      let condition = {
        raw: true,
        attributes: [
          [sequelize.fn("DISTINCT", sequelize.col('bsp_6.crop_code')), "crop_code"],
        ],
        where: {}
      }
      if (req.body.search) {
        if (req.body.search.year) {
          condition.where.year = req.body.search.year
        }
      }
      let data = await bsp6Model.findAll(condition);
      data.forEach(ele => {
        if (ele && ele.crop_code.slice(0, 1) == "A") {
          data.crop_type_name = "Agriculture";
          data.crop_type = "A";
        } else {
          data.crop_type_name = "Horticulture";
          data.crop_type = "H";
        }
      });

      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    } catch (error) {
      console.log(error);
      return response(res, status.DATA_NOT_AVAILABLE, 500, error);
    }
  }

  static getBsp1AllFilterData = async (req, res) => {
    try {
      let condition = {
        raw: true,
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('year')), 'year'],
        ]
      }
      if (req.body.search) {
        if (req.body.search.year) {
          condition.where.year = req.body.search.year
        }
      }
      let data = await bsp1Model.findAll(condition);

      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    } catch (error) {
      console.log(error);
      return response(res, status.DATA_NOT_AVAILABLE, 500, error);
    }
  }

  static getBreederNameList = async (req, res) => {
    let returnResponse = {};
    try {
      let condition = {
        where: {
          user_type: 'BR'
        }
      };
      condition.order = [['name', 'ASC']];
      condition.attributes = ['id', 'name'];

      // if (req.body.search) {
      // }
      returnResponse = await userModel.findAll(condition);
      return response(res, status.OK, 200, returnResponse);
    } catch (error) {
      returnResponse = {
        message: error.message
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }

  }

  static getBSPCList = async (req, res) => {
    let returnResponse = {};
    try {
      let condition = {
        where: {
          user_type: 'BPC'
        }
      };

      if (req.body.breeder_id) {
        condition = {
          where: {
            user_type: 'BPC',
            created_by: req.body.breeder_id
          }
        };
      }

      condition.order = [['name', 'ASC']];
      condition.attributes = ['id', 'name'];
      returnResponse = await userModel.findAll(condition);
      return response(res, status.OK, 200, returnResponse);
    } catch (error) {
      returnResponse = {
        message: error.message
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }

  }

  static getVarietyNameList = async (req, res) => {

    let data = {};
    try {
      let condition = {};

      if (req.body.crop_id) {
        condition = {
          where: {
            crop_code: req.body.crop_id
          }
        };
      }
      if (req.body.crop_code) {
        condition = {
          where: {
            crop_code: req.body.crop_code
          }
        };
      }

      condition["attributes"] = ['variety_code', 'variety_name'];

      condition.order = [['variety_name', 'ASC']];
      data = await varietyModel.findAll(condition);

      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      //console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getVarietyNotificationYear = async (req, res) => {
    let data = {};
    try {
      let condition = {};

      if (req.body.variety_code) {
        condition = {
          where: {
            variety_code: req.body.variety_code
          }
        };
      }

      condition["attributes"] = ['variety_code', 'variety_name', 'not_date'];

      condition.order = [['variety_name', 'ASC']];
      data = await varietyModel.findAll(condition);

      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static getVarietyNameBspReportData = async (req, res) => {

    let data = {};
    try {
      let condition = {
        include: [
          {
            model: varietyModel,
            where: {
              crop_code: req.body.crop_id ? req.body.crop_id : ''
            },
            order: [['variety_name', 'ASC']]

          }
        ]
      };

      // if (req.body.crop_id) {
      //   condition = {
      //     where: {
      //       crop_code: req.body.crop_id
      //     }
      //   };
      // }

      // condition["attributes"] = ['variety_code', 'variety_name'];

      data = await bsp1Model.findAll(condition);

      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      //console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }


  static getListOfBreederSeedProductionforReports = async (req, res) => {
    try {
      const usertype = req.query.usertype;
      let { page, pageSize, searchData } = req.body;

      let condition = {
        where: {
          user_type: usertype
        },
        attributes: ['name', 'mobile_number', 'email_id', 'mobile_number', 'code'],
        include: [
          {
            model: agencyDetailModel,
            left: false,
            raw: false,
            where: {},
            attributes: ['agency_name', 'address', 'short_name', 'contact_person_name', 'contact_person_designation', 'phone_number', 'bank_name', 'bank_branch_name', 'bank_ifsc_code', 'bank_account_number', 'latitude', 'longitude', 'crop_data', 'is_active'],
            include: [
            {
              model: districtModel,
              attributes: ['district_name']
            },
            {
              model: stateModel,
              attributes: ['state_name']
            },
            {
              model: designationModel,
              attributes: ['name']
            }
            ]
          },
          {
            model: cropModel,
            attributes: ['crop_code']
          }
        ],
      }

      // if (req.body.page) {
      //   if (page === undefined) page = 1;
      //   if (pageSize === undefined) pageSize = 50;
      //   if (page > 0 && pageSize > 0) {
      //     condition.limit = pageSize;
      //     condition.offset = (page * pageSize) - pageSize;
      //   }
      // }

      if (!searchData?.isReport) {
        if (page === undefined) page = 1;
        if (pageSize === undefined) pageSize = 50;
  
        if (page > 0 && pageSize > 0) {
          condition.limit = pageSize;
          condition.offset = (page * pageSize) - pageSize;
        }
      }
      else
      {
      }

      if ((searchData && searchData.isSearch === true) && (usertype == 'BPC')) {

        if (searchData.district_code) {
          condition.include[0].where['district_id'] = searchData.district_code;
        }

        if (searchData.state_code) {
          condition.include[0].where['state_id'] = searchData.state_code;
        }
        if (searchData.production_name) {
          if (searchData.production_name) {
            condition.include[0].where['agency_name'] = searchData.production_name;

          }
        }

      }

      if ((searchData && searchData.isSearch === true) && (usertype == 'BR')) {
        if (searchData.category_code) {
          // condition.include[0].where['category'] = searchData.category_code;
          condition.include[0].where['id'] = searchData.category_code;

        }
        if (searchData.agency_id) {
          condition.include[0].where['id'] = searchData.agency_id;
        }

        if (searchData.state_code) {
          condition.include[0].where['state_id'] = searchData.state_code;
        }
        // if (req.body.searchData.type == 'reporticar') {
        //   if (req.body.searchData.user_type == 'ICAR') {
        //     condition.where.crop_code = {
        //       [Op.or]: [
        //         { [Op.like]: 'A' + "%" },
        //       ]
        //     }

        //   } 
        //   if (req.body.searchData.user_type == 'HICAR') {
        //     condition.where.crop_code = {
        //       [Op.or]: [
        //         { [Op.like]: 'H' + "%" },
        //       ]
        //     }
        //   }
        //   if (req.body.searchData.user_type == 'OILSEEDADMIN') {
        //     condition.where = { crop_code: { [Op.like]: 'A04%' } };
        //   }
        //   condition.where.crop_group = (req.body.search.crop_name_data);
        // }
      }
      if (req.body.searchData.type == 'reporticar') {
          if (req.body.searchData.user_type == 'ICAR') {
           condition.where['$m_crops.crop_code$'] = { [Op.like]: 'A%' };
          } 
          if (req.body.searchData.user_type == 'HICAR') {
           condition.where['$m_crops.crop_code$'] = { [Op.like]: 'H%' };
          }

          if (req.body.searchData.user_type == 'OILSEEDADMIN') {
           condition.where['$m_crops.crop_code$'] = { [Op.like]: 'A04%' };
          }
          if (req.body.searchData.user_type == 'PULSESSEEDADMIN') {
            condition.where['$m_crops.crop_code$'] = { [Op.like]: 'A03%' };
           }
      }

      condition.subQuery = false;
      condition.order = [(sequelize.col('agency_detail.agency_name', 'ASC')),
      (sequelize.col('agency_detail.short_name', 'ASC')),
      (sequelize.col('agency_detail->m_state.state_name', 'ASC')),
      (sequelize.col('agency_detail->m_district.district_name', 'ASC')),
      (sequelize.col('agency_detail.latitude', 'ASC')),
      (sequelize.col('agency_detail.longitude', 'ASC')),
      ];

      let data = await userModel.findAndCountAll(condition);

      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      console.log(error);
      return response(res, status.DATA_NOT_SAVE, 500, error);
    }
  }

  static getStateDataForSeedTestingLab = async (req, res) => {
    try {
      let condition = {
        attributes: ['state_name', 'state_code', 'state_short_name']
      };

      condition.order = [['state_name', 'ASC']];
      var data = await stateModel.findAll(condition);
      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static getCategoryData = async (req, res) => {
    try {
      let condition = {
        attributes: ['category_name', 'category_code']
      };

      condition.order = [['category_name', 'ASC']];
      var data = await categoryModel.findAll(condition);
      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  // freeze-timelines-data start
  static addFreezeTimelinesData = async (req, res) => {
    let returnResponse = {};
    let internalCall = {};
    try {
      const user_id = req.body.loginedUserid.id;

      let rules = {
        'season_name': 'string',
        'start_date': 'date',
        'end_date': 'date',
        'year_of_indent': 'integer',
        'activities': 'integer',
        'end_date': 'date',
        'created_by': 'integer'
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
        return response(res, status.BAD_REQUEST, 400, errorResponse, internalCall)
      }

      let data = {
        season_name: req.body.season_name,
        is_active: 1,
        start_date: req.body.start_date,
        end_date: req.body.end_date,
        year_of_indent: req.body.year_of_indent,
        activitie_id: req.body.activities,
        created_by: req.body.created_by,
        user_id: user_id,
        is_active: req.body.active
      }
      const freezeTimelineData = {};
      if (req.body.id) {
        freezeTimelineModel.update(data, { where: { id: (req.body.id) } });
        returnResponse = {};
        return response(res, status.DATA_UPDATED, 200, returnResponse, internalCall);
      } else {
        let alreadyExistData = await freezeTimelineModel.findAll({
          where: {
            season_name: req.body.season_name,
            // start_date: req.body.start_date,
            // end_date: req.body.end_date,
            year_of_indent: parseInt(req.body.year_of_indent),
            activitie_id: parseInt(req.body.activities),
            user_id: user_id
          }
        });
        if (alreadyExistData == undefined || alreadyExistData.length < 1) {
          freezeTimelineModel.create(data);
          returnResponse = {};
          return response(res, status.DATA_SAVE, 200, returnResponse, internalCall);
        }
        else {
          returnResponse = {};
          return response(res, status.DATA_AVAILABLE, 401, returnResponse, internalCall);
        }
      }

    } catch (error) {
      console.log("error", error);
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);

    }
  }
  static getFreezeTimelinesData = async (req, res) => {
    try {
      // const user_id = req.body.loginedUserid.id;
      // console.log('user_id', user_id);
      let condition = {
        include: [
          {
            model: activitiesModel,
            attributes: ['id', 'name']
          }
        ],
        where: {
          // user_id: user_id
          // id :parseInt(req.body.search.submissionid)
        },



      };
      let { page, pageSize, search } = req.body;
      if (page === undefined) page = 1;
      if (pageSize === undefined) {
        pageSize = 10;
      } // set pageSize to -1 to prevent sizing

      if (page > 0 && pageSize > 0) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }
      if (req.body.search) {

        if (req.body.search.season_name) {
          condition.where.season_name = req.body.search.season_name;
        }
        if (req.body.search.year_of_indent) {
          condition.where.year_of_indent = req.body.search.year_of_indent;
        }
        if (req.body.search.activities) {
          condition.where.activitie_id = req.body.search.activities;
        }
        // if (req.body.search.start_date) {

        //   // condition.where.start_date = req.body.search.start_date;
        //   condition.where['start_date'] = {
        //     [Op.and]: [

        //       sequelize.where(sequelize.fn('date', sequelize.col('start_date')), '>=', req.body.search.start_date),

        //       // [Op.gte]= sequelize.where(sequelize.fn('date', sequelize.col('start_date'))),
        //       // [Op.lte]= sequelize.where(sequelize.fn('date', sequelize.col('end_date'))),
        //     ]
        //   }
        // }
        // if (req.body.search.end_date) {
        //   condition.where['end_date'] = {
        //     [Op.and]: [

        //       // sequelize.where(sequelize.fn('date', sequelize.col('start_date')), '>=', req.body.search.start_date),
        //       sequelize.where(sequelize.fn('date', sequelize.col('end_date')), '<=', req.body.search.end_date)

        //       // [Op.gte]= sequelize.where(sequelize.fn('date', sequelize.col('start_date'))),
        //       // [Op.lte]= sequelize.where(sequelize.fn('date', sequelize.col('end_date'))),
        //     ]
        //   }
        // condition.where.end_date = req.body.search.end_date;
        // }
        // if (req.body.search.district_code) {
        //   condition.where.district_code = req.body.search.district_code;
        // }
      }

      condition.order = [['id', 'DESC']];
      var data = await freezeTimelineModel.findAndCountAll(condition);
      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static editFreezeTimelinesData = async (req, res) => {
    let returnResponse = {};
    let internalCall = {};
    try {
      // console.log('id======', req.body.id);
      // return;
      let rules = {
        'season_name': 'string',
        'start_date': 'date',
        'end_date': 'date',
        'created_by': 'integer'
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
        return response(res, status.BAD_REQUEST, 400, errorResponse, internalCall)
      }

      let editdata = {
        // id: req.body.id,
        season_name: req.body.season_name,
        is_active: 1,
        start_date: req.body.start_date,
        year_of_indent: req.body.year_of_indent,
        activitie_id: req.body.activities,
        end_date: req.body.end_date,
        created_by: req.body.created_by
      }
      console.log('edit data', editdata);
      const freezeTimelineData = await freezeTimelineModel.update(editdata, {
      });
      returnResponse = {};

      return response(res, status.DATA_SAVE, 200, returnResponse, internalCall);

    } catch (error) {
      console.log("error", error);
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);

    }
  }

  static getFreezeTimelinesDataById = async (req, res) => {
    try {
      let condition = {
        where: {
          id: parseInt(req.body.search.submissionid)
        },

      };
      // if (req.body.search) {
      //   if (req.body.search.id) {
      //     condition.where.id = parseInt(req.body.search.submissionid)
      //   }
      //   if (req.body.search.season_name) {
      //     condition.where.season_name = req.body.search.season_name;
      //   }
      //   if (req.body.search.start_date) {
      //     condition.where.start_date = req.body.search.start_date;
      //   }
      //   if (req.body.search.end_date) {
      //     condition.where.end_date = req.body.search.end_date;
      //   }
      //   // if (req.body.search.district_code) {
      //   //   condition.where.district_code = req.body.search.district_code;
      //   // }
      // }

      // condition.order = [['id', 'DESC']];
      var data = await freezeTimelineModel.findAll(condition);
      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static editFreezeTimelinesData = async (req, res) => {
    let returnResponse = {};
    let internalCall = {};
    try {
      let rules = {
        'season_name': 'string',
        'start_date': 'date',
        'end_date': 'date',
        'created_by': 'integer'
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
        return response(res, status.BAD_REQUEST, 400, errorResponse, internalCall)
      }

      let editdata = {
        season_name: req.body.season_name,
        is_active: 1,
        start_date: req.body.start_date,
        end_date: req.body.end_date,
        created_by: req.body.created_by
      }

      const freezeTimelineData = freezeTimelineModel.update(editdata, {
        where: {
          id: req.params.id
        }
      });
      returnResponse = {};

      return response(res, status.DATA_SAVE, 200, returnResponse, internalCall);

    } catch (error) {
      console.log("error", error);
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);

    }
  }
  static backupIndenetOfBreederseed = async (id) => {
    const indentData = await indentOfBreederseedModel.findAll({
      where: {
        id: id
      }
    });
    if (!(indentData && indentData.length && indentData[0])) {
      return false
    }

    // Log deleted SPA indented
    if (indentData && indentData[0]) {
      let insertData = {
        indent_of_breederseed_id: (indentData[0].id ? indentData[0].id : null),
        user_id: (indentData[0].user_id ? indentData[0].user_id : null),
        // state_code: (spaIndentData[0].state_code ? spaIndentData[0].state_code : null),
        indented_data: (JSON.stringify(indentData[0])),
      };
      let isDbError = false;
      let errorMessage = {};
      deleteIndenteOfBreederSeedModel.create(insertData).then(function (item) {
        return true
      }).catch(function (err) {
        console.log("err", err)
        return false

      });
    }
  }
  static backupIndenetOfBreederseedLines = async (id, variety_code_line) => {
    const indentData = await db.indentOfBrseedLines.findAll({
      where: {
        indent_of_breederseed_id: id,
        variety_code_line: variety_code_line
      }
    });
    if (!(indentData && indentData.length && indentData[0])) {
      return false
    }

    // Log deleted SPA indented
    if (indentData && indentData[0]) {
      let insertData = {
        indent_of_breederseed_id: (indentData[0].indent_of_breederseed_id ? indentData[0].indent_of_breederseed_id : null),
        indent_line_data: (JSON.stringify(indentData[0])),
      };
      let isDbError = false;
      let errorMessage = {};
      db.deletedIndentOfBrseedLinesModel.create(insertData).then(function (item) {
        return true
      }).catch(function (err) {
        console.log("err", err)
        return false

      });
    }
  }

  static backupIndenetOfSPA = async (id) => {
    const spaIndentData = await indentOfSpaModel.findAll({
      where: {
        id: id
      }
    });
    if (!(spaIndentData && spaIndentData.length && spaIndentData[0])) {
      return false
    }

    // Log deleted SPA indented
    if (spaIndentData && spaIndentData[0]) {
      let insertData = {
        indent_spa_id: (spaIndentData[0].id ? spaIndentData[0].id : null),
        spa_code: (spaIndentData[0].spa_code ? spaIndentData[0].spa_code : null),
        state_code: (spaIndentData[0].state_code ? spaIndentData[0].state_code : null),
        spa_indented_data: (JSON.stringify(spaIndentData[0])),
      };
      let isDbError = false;
      let errorMessage = {};
      deleteIndenteOfSpaModel.create(insertData).then(function (item) {
        return true
      }).catch(function (err) {
        console.log("err", err)
        return false

      });
    }
  }
  static backupIndenetOfSPALines = async (id, variety_code_line) => {
    const spaIndentLinesData = await db.indentOfSpaLinesModel.findAll({
      where: {
        indent_of_spa_id: id,
        variety_code_line: variety_code_line
      }
    });
    if (!(spaIndentLinesData && spaIndentLinesData.length && spaIndentLinesData[0])) {
      return false
    }

    // Log deleted SPA indented
    if (spaIndentLinesData && spaIndentLinesData[0]) {
      let insertData = {
        indent_of_spa_id: (spaIndentLinesData[0].indent_of_spa_id ? spaIndentLinesData[0].indent_of_spa_id : null),
        spa_line_data: (JSON.stringify(spaIndentLinesData[0])),
      };
      let isDbError = false;
      let errorMessage = {};
      db.deletedIndentOfSpaLinesModel.create(insertData).then(function (item) {
        return true
      }).catch(function (err) {
        console.log("err", err)
        return false
      });
    }
  }


  static getIndentOfSpaDataNew = async (req, res) => {
    let returnResponse = {};
    let internalCall = {};
    try {
      // let rules = {
      //   "year_of_indent": 'required|string',
      //   "season": 'required|string',
      //   "state_code": 'required|integer',
      //   "spa_code": 'required|string',
      // };

      // let validation = new Validator(req.body, rules);
      let { page, pageSize } = req.body;

      if (!page) page = 1;

      let sectorData = [
        { 'name': 'NSC', 'state_code': 201 },
        { 'name': 'DADF', 'state_code': 202 },
        { 'name': 'HIL', 'state_code': 203 },
        { 'name': 'IFFDC', 'state_code': 204 },
        { 'name': 'IFFCO', 'state_code': 205 },
        { 'name': 'KRIBHCO', 'state_code': 206 },
        { 'name': 'KVSSL', 'state_code': 207 },
        { 'name': 'NAFED', 'state_code': 208 },
        { 'name': 'NDDB', 'state_code': 209 },
        { 'name': 'NFL', 'state_code': 210 },
        { 'name': 'NHRDF', 'state_code': 211 },
        { 'name': 'SOPA PRIVATE', 'state_code': 212 },
        { 'name': 'PRIVATE', 'state_code': 213 },
        { 'name': 'INDIVIDUAL', 'state_code': 213 },
        { 'name': 'NSAI', 'state_code': 213 },
        { 'name': 'PRIVATE COMPANY', 'state_code': 213 },
        { 'name': 'BBSSL', 'state_code': 214 }
      ]
      let sectorStateData;
      if (req.body && req.body.sector) {
        sectorStateData = await sectorData.find(ele => ele.name == req.body.sector.toUpperCase())
        if (sectorStateData && sectorStateData !== undefined) {
          req.body.state_code = sectorStateData.state_code;
        }
      }

      // const isValidData = validation.passes();

      // if (!isValidData) {
      //   let errorResponse = {};
      //   for (let key in rules) {
      //     const error = validation.errors.get(key);
      //     if (error.length) {
      //       errorResponse[key] = error;
      //     }
      //   }
      //   return response(res, status.BAD_REQUEST, 400, errorResponse, internalCall)
      // }
      let condition = {
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
            model: stateModel,
            attributes: []
          },
          {
            model: seasonModel,
            attributes: []
          },
        ],
        where: {
          is_active: 1
        },
        attributes: [
          // indents of SPA table data
          [sequelize.col('indent_of_spas.id'), 'id'],
          [sequelize.col('indent_of_spas.year'), 'year'],
          [sequelize.col('indent_of_spas.crop_type'), 'crop_type'],
          [sequelize.col('indent_of_spas.spa_code'), 'spa_code'],
          [sequelize.col('indent_of_spas.variety_notification_year'), 'variety_notification_year'],
          [sequelize.literal('ROUND(indent_of_spas.indent_quantity::NUMERIC, 2)'), 'indent_quantity'],
          // [sequelize.literal("ROUND('indent_of_spas.indent_quantity',2)"), 'indent_quantity'],
          [sequelize.col('indent_of_spas.unit'), 'unit'],
          [sequelize.col('indent_of_spas.is_active'), 'is_active'],
          [sequelize.col('indent_of_spas.user_id'), 'user_id'],
          [sequelize.col('indent_of_spas.created_at'), 'created_at'],
          [sequelize.col('indent_of_spas.updated_at'), 'updated_at'],

          //other join table data
          [sequelize.col('m_crop.crop_name'), 'crop_name'],
          [sequelize.col('m_crop.crop_code'), 'crop_code'],
          [sequelize.col('m_crop_variety.id'), 'variety_id'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [sequelize.col('m_crop_variety.variety_code'), 'variety_code'],
          [sequelize.col('m_state.state_name'), 'state_name'],
          [sequelize.col('m_state.state_code'), 'state_code'],
          [sequelize.col('m_season.season'), 'season'],
          [sequelize.col('m_season.season_code'), 'season_code'],
        ],
        raw: true
      }
      if (page && pageSize) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }
      if (req.body) {
        if (req.body.spa_code) {
          condition.where.spa_code = req.body.spa_code;
        }
        if (req.body.id) {
          condition.where.id = req.body.id;
        }
        if (req.body.year_of_indent) {
          condition.where.year = parseInt(req.body.year_of_indent.slice(0, 4).trim());
        }
        if (req.body.season) {
          condition.where.season = (req.body.season.slice(0, 1).trim().toUpperCase());
        }
        if (req.body.state_code) {
          condition.where.state_code = (req.body.state_code);
        }
      }

      let getSpaIndentData = await indentOfSpaModel.findAndCountAll(condition);

      if (getSpaIndentData === undefined || getSpaIndentData.length < 1) {
        returnResponse = {};
        return response(res, status.DATA_NOT_AVAILABLE, 202, []);
      } else {
        returnResponse = getSpaIndentData;
        return response(res, status.DATA_AVAILABLE, 200, returnResponse);
      }
    } catch (error) {
      console.log('error', error);
      returnResponse = error;
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);

    }
  }



  static addIndentOfSpaDataNew = async (req, res) => {
    let returnResponse = {};
    let returnResponseData = [];
    let internalCall = {};
    try {
      let spaUpdatedData = {}

      let cropType = '';
      let unitKgQ = '';
      let stateCode;
      let sectorData = [
        { 'name': 'NSC', 'state_code': 201 },
        { 'name': 'DADF', 'state_code': 202 },
        { 'name': 'HIL', 'state_code': 203 },
        { 'name': 'IFFDC', 'state_code': 204 },
        { 'name': 'IFFCO', 'state_code': 205 },
        { 'name': 'KRIBHCO', 'state_code': 206 },
        { 'name': 'KVSSL', 'state_code': 207 },
        { 'name': 'NAFED', 'state_code': 208 },
        { 'name': 'NDDB', 'state_code': 209 },
        { 'name': 'NFL', 'state_code': 210 },
        { 'name': 'NHRDF', 'state_code': 211 },
        { 'name': 'SOPA PRIVATE', 'state_code': 212 },
        { 'name': 'PRIVATE', 'state_code': 213 },
        { 'name': 'INDIVIDUAL', 'state_code': 213 },
        { 'name': 'NSAI', 'state_code': 213 },
        { 'name': 'PRIVATE COMPANY', 'state_code': 213 },
        { 'name': 'BBSSL', 'state_code': 214 },

      ]
      let sectorStateData;
      if (req.body && req.body.sector) {
        sectorStateData = await sectorData.find(ele => ele.name == req.body.sector.toUpperCase())
        if (sectorStateData && sectorStateData !== undefined) {
          req.body.state_code = sectorStateData.state_code;
        }
      }

      let rules = {
        "year_of_indent": 'required|string',
        "season": 'required|string',
        "crop_code": 'required|string',
        "state_code": 'required|integer',
        "spa_code": 'required|string',
        "crop_group": 'required|string',
        "varieties": 'required',
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
        return response(res, status.BAD_REQUEST, 400, errorResponse, internalCall)
      }


      // if (req.params && req.params["id"]) {
      //   let spaDataExist = await indentOfSpaModel.findOne({ where: { id: req.params["id"] } });
      //   if (spaDataExist.length < 1)
      //     return response(res, "Id Not Exist", 404);
      // }

      if (req.body.varieties[0] && req.body.varieties[0].variety_code) {
        let varietyExistingData = await varietyModel.findOne(
          {
            where: {
              variety_code: req.body.varieties[0].variety_code,
            },
            raw: true
          }
        );
        if (!varietyExistingData) {
          return response(res, "Variety Does Not Exists", 404, []);
        }
      }

      let condition = {}
      const centralSector = ['test']
      if (req.body.sector && centralSector.includes(req.body.sector.toUpperCase())) {
        const sectorData = await sectorModel.findOne(
          {
            where: {
              name: req.body.sector,
            },
            row: true
          }
        );
        console.log("sectorData", sectorData.id, sectorData)
        if (sectorData && sectorData.id) {
          condition = {
            where: { 'sector_id': sectorData.id }
          }
        } else {
          condition = {
            where: {
              state_id: req.body.state_code
            }
          }

        }
      } else {
        condition = {
          where: {
            state_id: req.body.state_code
          }
        }
      }


      let breederUserIdData;
      if (req.body.state_code) {
        breederUserIdData = await userModel.findAll({
          include: [{
            model: agencyDetailModel,
            // where: {
            //   state_id: req.body.state_code
            // }
            ...condition
          }],
          where: {
            user_type: "IN"
          }
        });
      }

      if (req.body.crop_code) {
        if ((req.body.crop_code).slice(0, 1) == 'A') {
          cropType = 'agriculture';
          unitKgQ = 'quintal';
        } else if ((req.body.crop_code).slice(0, 1) == 'H') {
          cropType = 'horticulture';
          unitKgQ = 'kilogram';
        } else {
          cropType = "";
        }
      }

      let cropExistingData = {}
      cropExistingData = await cropModel.findOne(
        {
          where: {
            crop_code: req.body.crop_code,
          },
          row: true
        }
      );
      // console.log('cropExistingData======', cropExistingData.dataValues);
      // return;
      let userId;
      if (req.body.spa_code) {
        let userData = await userModel.findOne(
          {
            include: [{
              model: agencyDetailModel,
              // where: {
              //   state_id: req.body.state_code
              // }
              ...condition
            }],
            where: {
              spa_code: req.body.spa_code,
              //state_code: req.body.state_code
            },
            row: true
          }
        );

        if (userData === null || userData.dataValues.id === undefined) {
          return response(res, "SPAs Not Exist", 404);
        }
        userId = userData && userData.dataValues && userData.dataValues.id ? userData.dataValues.id : null;
      }

      // convert string to interger (year of indent) and slice
      let yearOfIndent;
      let seasoneCode;
      returnResponse = req.body;
      if (req.body) {
        if (req.body.year_of_indent) {
          yearOfIndent = parseInt(req.body.year_of_indent.slice(0, 4));

        }
        if (req.body.season) {
          seasoneCode = req.body.season.toString().slice(0, 1).toUpperCase()
        }
      }

      // ====================================================
      if (cropExistingData) {
        let spaInsertData = {};
        //edit indnt of SPA DATA
        let errorMsg;
        let getSpaIndentData;
        let varietyExistingData;
        if (req.params && req.params["id"]) {
          let date;
          let checkId = await indentOfSpaModel.findOne({ where: { id: req.params["id"] } });
          console.log('SPA ID', checkId);
          if (!checkId) {
            return response(res, "Id Does Not Exist", 404, []);
          } else {
            req.body.varieties.forEach(async (items) => {
              if (items.variety_code) {
                varietyExistingData = await varietyModel.findAll(
                  {
                    where: {
                      variety_code: items.variety_code,
                    },
                    raw: true
                  }
                );
                // .variety_code
                // console.log("varietyExistingData", varietyExistingData[0]);
                date = new Date(varietyExistingData[0]['not_date']).getFullYear();
                // console.log('date=======', date);
                // let date = varietyExistingData[0]['not_date'].getFullYear();
                // console.log('date===', date);
              }

              const dataRow = {
                year: yearOfIndent,
                crop_type: cropType,
                season: seasoneCode,
                variety_id: varietyExistingData[0]['id'],
                // variety_code:  varietyExistingData[0]['variety_code'],
                variety_notification_year: date,
                indent_quantity: items.indent_quantity,
                user_id: userId,//user id should be dynamic
                unit: unitKgQ,
                state_code: req.body.state_code,
                spa_code: req.body.spa_code,
                crop_code: req.body.crop_code,
                group_code: req.body.cropGroup
              };
              let stateCode;
              let tabledAlteredSuccessfully = false;
              getSpaIndentData = await indentOfSpaModel.findAll({ where: { id: req.params["id"] } });
              if (getSpaIndentData && getSpaIndentData[0] && getSpaIndentData[0].dataValues) {

                if (req.body.state_code) {
                  stateCode = {
                    where: {
                      state_id: req.body.state_code,
                    }
                  }
                }

                let IndentBreederData = await indentOfBreederseedModel.findAll(
                  {
                    include: [
                      {
                        model: userModel,
                        include: [{
                          model: agencyDetailModel,
                          ...stateCode
                        }],
                      }
                    ],
                    where: {
                      user_id: breederUserIdData[0].id,
                      crop_code: req.body.crop_code,
                      year: yearOfIndent,
                      variety_id: varietyExistingData[0]['id'],
                      season: seasoneCode
                    }
                  }
                );
                // console.log('IndentBreederData=================', IndentBreederData);
                // return;
                if (IndentBreederData && IndentBreederData[0] && IndentBreederData[0].dataValues) {
                  // indent_quantity
                  let temp = IndentBreederData[0].dataValues.indent_quantity - getSpaIndentData[0].dataValues.indent_quantity;
                  dataRow.indente_breederseed_id = IndentBreederData[0].dataValues.id;
                  dataRow.indenter_id = IndentBreederData[0].dataValues.user_id;
                  returnResponse = dataRow
                  spaInsertData = await indentOfSpaModel.update(dataRow, { where: { id: req.params["id"] } });
                  let IndentDataNew = await indentOfBreederseedModel.update(
                    {
                      indent_quantity: temp + items.indent_quantity
                    },
                    {
                      where: {
                        user_id: breederUserIdData[0].id,
                        crop_code: req.body.crop_code,
                        year: yearOfIndent,
                        variety_id: varietyExistingData[0]['id'],
                        season: seasoneCode,
                      }
                    });
                  // ret = spaInsertData;
                }
                // console.log('returnResponse===',
                // returnResponseData = returnResponse
                // return returnResponseData ;
              }
            });
            // console.log('returnResponse===1',returnResponseData = returnResponse);
            // console.log('spaInsertData',spaInsertData);
            //   if (spaInsertData) {
            //     return response(res, status.DATA_UPDATED, 200, returnResponse, internalCall);
            //   } else {
            //     return response(res, "Data Not Updated", 401, [], internalCall);
            //   }
            // });
            // console.log('returnResponse===1',returnResponseData = returnResponse);
            // console.log('spaInsertData',spaInsertData);
            let spaUpdatedData = await indentOfSpaModel.findOne({
              attributes: ['id', 'crop_code', 'variety_code', 'state_code', 'indent_quantity',
                'season', 'spa_code', [sequelize.col('year'), 'year_of_indent']],
              where: { id: req.params["id"] }
            });
            if (spaInsertData) {
              //return response(res, status.DATA_UPDATED, 200, spaUpdatedData, internalCall);
              return response(res, status.DATA_UPDATED, 200, returnResponse, internalCall);
            } else {
              return response(res, "Data Not Updated", 401, [], internalCall);
            }
          }
        }
        // indnt of SPA DATA
        else {
          console.log(" req.body.varieties", req.body.varieties[0])
          let spaDataCheck = await indentOfSpaModel.findAll(
            {

              where: {
                year: yearOfIndent,
                season: seasoneCode,
                state_code: req.body.state_code,
                spa_code: req.body.spa_code,
                variety_code: req.body.varieties[0].variety_code
              }
            }
          );
          console.log("spaDataCheckspaDataCheck", spaDataCheck)
          if (spaDataCheck.length) {
            return response(res, "Already indented for same variety.", 404, [])

          }
          // return;
          let date;
          let IndentBreederData;
          let IndentDataNew;
          let data;
          let varietyExistingData = {};
          req.body.varieties.forEach(async (items) => {
            if (items.variety_code) {
              varietyExistingData = await varietyModel.findAll(
                {
                  where: {
                    variety_code: items.variety_code,
                  },
                  raw: true
                }
              );
              // .variety_code
              // console.log("varietyExistingData", varietyExistingData[0]);
              date = new Date(varietyExistingData[0]['not_date']).getFullYear();

            }
            // return;
            // return;
            const dataRow = {
              year: yearOfIndent,
              crop_type: cropType,
              season: seasoneCode,
              variety_id: varietyExistingData[0]['id'],
              variety_notification_year: date,
              indent_quantity: items.indent_quantity,
              user_id: userId,
              unit: unitKgQ,
              state_code: req.body.state_code,
              spa_code: req.body.spa_code,
              crop_code: req.body.crop_code,
              group_code: req.body.crop_group,
              variety_code: items.variety_code
            };

            // existingData = await indentOfSpaModel.findAll(
            //   {
            //     where: {
            //       year: req.body.yearofIndent,
            //       group_code: req.body.cropGroup,
            //       crop_code: req.body.crop_code,
            //       variety_id: items.variety_id,
            //       user_id: req.body.user_id,
            //       spa_code: req.body.spa_code,
            //     }
            //   }
            // );
            // console.log('hiiii===1');
            // if (existingData === undefined || existingData.length < 1) {}



            if (req.body.state_id) {
              stateCode = {
                where: {
                  state_id: req.body.state_code,
                }
              }
            }

            IndentBreederData = await indentOfBreederseedModel.findAll(
              {
                include: [
                  {
                    model: userModel,
                    include: [{
                      model: agencyDetailModel,
                      ...stateCode
                    }],
                  }
                ],
                where: {
                  user_id: breederUserIdData[0].id,
                  crop_code: req.body.crop_code,
                  year: yearOfIndent,
                  variety_code: items.variety_code,
                  season: seasoneCode
                }
              }
            );
            // user id fil code implement 20 jun
            // dataRow.indente_breederseed_id = IndentBreederData[0].dataValues.id;
            // dataRow.indenter_id = IndentBreederData[0].dataValues.user_id;


            // user id fil code implement 20 jun



            //let spaUpdatedData={}
            if (IndentBreederData && IndentBreederData[0] && IndentBreederData[0].dataValues) {
              dataRow.indente_breederseed_id = IndentBreederData[0].dataValues.id;
              dataRow.indenter_id = IndentBreederData[0].dataValues.user_id;
              returnResponse = dataRow;
              // data = indentOfSpaModel.build(dataRow);
              // await data.save();
              //let spaUpdatedData={}
              IndentDataNew = await indentOfBreederseedModel.update(
                {
                  indent_quantity: IndentBreederData[0].dataValues.indent_quantity + items.indent_quantity
                },
                {
                  where: {
                    user_id: breederUserIdData[0].id,
                    crop_code: req.body.crop_code,
                    year: yearOfIndent,
                    variety_code: items.variety_code,
                    season: seasoneCode
                  }
                });
              data = indentOfSpaModel.build(dataRow);
              await data.save();

            }
            else {
              //	    let spaUpdatedData={}
              if (items.variety_code) {
                varietyExistingData = await varietyModel.findAll(
                  {
                    where: {
                      variety_code: items.variety_code,
                    },
                    raw: true
                  }
                );
                // .variety_code
                // console.log("varietyExistingData", varietyExistingData[0]['variety_code']);

              }
              IndentDataNew = await indentOfBreederseedModel.create({
                "user_id": breederUserIdData[0].id,
                "year": yearOfIndent,
                "season": seasoneCode,
                "crop_code": req.body.crop_code,
                "crop_name": cropExistingData.dataValues.crop_name,
                "group_name": cropExistingData.dataValues.crop_group,
                "group_code": cropExistingData.dataValues.group_code,
                "variety_notification_year": varietyExistingData[0]['not_date'],
                "indent_quantity": items.indent_quantity,
                "unit": unitKgQ,
                "variety_name": varietyExistingData[0]['variety_name'],
                "variety_id": varietyExistingData[0]['id'],
                "crop_type": cropType,
                "season_id": req.body.season_id,
                "variety_code": items.variety_code
              })
              // await  data.save();
              IndentBreederData = await indentOfBreederseedModel.findAll(
                {
                  include: [
                    {
                      model: userModel,
                      include: [{
                        model: agencyDetailModel,
                        ...stateCode
                      }],
                    }
                  ],
                  where: {
                    user_id: breederUserIdData[0].id,
                    crop_code: req.body.crop_code,
                    year: yearOfIndent,
                    variety_code: items.variety_code,
                    season: seasoneCode
                  }
                }
              );

              dataRow.indente_breederseed_id = IndentBreederData[0].dataValues.id;
              dataRow.indenter_id = IndentBreederData[0].dataValues.user_id;
              data = indentOfSpaModel.build(dataRow);
              const result = await data.save();
              console.log("resultresult", result.id, result)
              spaUpdatedData = await indentOfSpaModel.findAll({
                attributes: ['id', 'crop_code', 'variety_code', 'state_code', 'indent_quantity',
                  'season', 'spa_code', [sequelize.col('year'), 'year_of_indent']],
                where: { id: result.id }
              });
              console.log("spaUpdatedData11111111111111", spaUpdatedData[0])
              returnResponse = spaUpdatedData[0]
            }
          });
          return response(res, status.DATA_SAVE, 200, [], internalCall);
        }
      } else {
        return response(res, "crop is not assign or not exist ", 404, [])
      }
    }
    catch (error) {
      console.log("error", error);
      returnResponse = error
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }

  static activitiesList = async (req, res) => {
    let returnResponse = {}
    try {
      let condition = {
        attributes: ['id', 'name', 'is_active']
      }
      let activitiesData = await activitiesModel.findAll(condition);
      if (activitiesData) {
        returnResponse = activitiesData;
        return response(res, status.DATA_AVAILABLE, 200, returnResponse);
      } else {
        returnResponse = {};
        return response(res, status.DATA_NOT_AVAILABLE, 401, returnResponse);
      }
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }
  static yearOfIndentactivitiesList = async (req, res) => {
    try {
      let condition = {
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('freeze_timelines.year_of_indent')), 'year'],
        ],
        raw: true
      };
      let freezTimeLineYear = await freezeTimelineModel.findAll(condition);
      return response(res, status.DATA_AVAILABLE, 200, freezTimeLineYear);
    } catch (error) {
      console.log('error', error);
    }
  }

  static seasonActivitiesList = async (req, res) => {
    try {
      let condition = {
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('freeze_timelines.season_name')), 'season'],
        ],
        where: {

        }
      };
      if (req.body.search) {
        if (req.body.search.year_of_indent) {
          condition.where.year_of_indent = req.body.search.year_of_indent
        }
      }
      let freezTimeLineYear = await freezeTimelineModel.findAll(condition);
      return response(res, status.DATA_AVAILABLE, 200, freezTimeLineYear);
    } catch (error) {
      console.log('error', error);
    }
  }

  static activitiesListilter = async (req, res) => {
    try {
      let condition = {
        include: [
          {
            model: activitiesModel,
            attributes: []
          }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('activity.id')), 'activity_id'],
          [sequelize.col('activity.name'), 'activity_name'],
        ],
        raw: true,
        where: {

        }
      };
      if (req.body.search) {
        if (req.body.search.year_of_indent) {
          condition.where.year_of_indent = req.body.search.year_of_indent
        }
        if (req.body.search.season) {
          condition.where.season_name = req.body.search.season
        }
      }
      condition.order = [[sequelize.col('activity.name'), 'ASC']]
      let freezTimeLineYear = await freezeTimelineModel.findAll(condition);
      return response(res, status.DATA_AVAILABLE, 200, freezTimeLineYear);
    } catch (error) {
      console.log('error', error);
    }
  }

  static updatePassword = async (req, res) => {
    try {

      const APPKEY = process.env.APPKEY
      const data = req.body['search'];
      console.log(" req.body", req.body)
      let object = {
        "stateCode": "CENTRAL",
        "appKey": APPKEY,
        "userid": req.body.loginedUserid && req.body.loginedUserid.unm ? req.body.loginedUserid.unm : '',
        //"role": "ADMIN",
        "role": req.body.loginedUserid && req.body.loginedUserid.user_type ? req.body.loginedUserid.user_type : '',
        // "is_change_password":true,
        // "name": data.display_name,
        "password": data.password
      }

      let result = 1;

      if (process.env.ENVIRONMENT == 'NIC') {
        result = await SeedUserManagement.updateUser(object);
      }
      console.log(result)

      return response(res, status.DATA_AVAILABLE, 200, {
        message: result
      });

    } catch (error) {
      const returnResponse = {
        message: error.message,
      };
      console.log(error)
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }



  static deleteIndentors = async (req, res) => {
    try {
      const condition = {
        where: {
          agency_id: Number(req.body.id)
        },
        attributes: ['id', 'code', 'username', 'user_type']
      };
      let data = await userModel.findOne(condition);

      //console.log("dtaaa", data)
      // const USER_API_KEY = process.env.USER_API_KEY
      // let seedUserData = { "appKey": USER_API_KEY, "stateCode": "CENTRAL", "role": data.user_type, "userid": data.username }
      // console.log("seedUserData", seedUserData)
      // await SeedUserManagement.inactiveUser(seedUserData);

      agencyDetailModel.destroy({
        where: {
          id: req.body.id
        },
      });
      const param = {
        is_active: 0
      }
      userModel.update(
        param,
        {
          where: {
            agency_id: req.body.id
          },
        });
      // const userData = await userModel.destroy({
      //   where: {
      //     agency_id: req.body.id,
      //     user_type: 'IN'
      //   }
      // });
      response(res, status.DATA_DELETED, 200, {});
    }
    catch (error) {
      console.log("error", error);
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    }
  }
  static deleteprocessingplant = async (req, res) => {
    try {

      agencyDetailModel.update({ is_active: 0 }, {
        where: {
          id: req.body.id
        },
      });
      // const userData = await userModel.destroy({
      //   where: {
      //     agency_id: req.body.id,
      //     user_type: 'IN'
      //   }
      // });
      response(res, status.DATA_DELETED, 200, {});
    }
    catch (error) {
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    }
  }
  static deletefreezeModel = async (req, res) => {
    try {

      freezeTimelineModel.destroy({
        where: {
          id: req.params.id
        },
      });
      // const userData = await userModel.destroy({
      //   where: {
      //     agency_id: req.body.id,
      //     user_type: 'IN'
      //   }
      // });
      response(res, status.DATA_DELETED, 200, {});
    }
    catch (error) {
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    }

  }
  static getbsp3reportdata = async (req, res) => {
    let returnResponse = {}
    try {
      let condition = {
        include: [
          {
            model: cropVerietyModel
          },
          {
            model: cropModel
          }
        ],
        where: {
          [Op.and]: [
            {
              year: {
                [Op.eq]: req.body.year
              }

            },
            {
              season: {
                [Op.eq]: req.body.season
              }

            },
            {
              crop_code: {
                [Op.like]: '%' + req.body.crop_type + '%'
              }

            },


          ]
        },
        raw: true
        // attributes: ['id', 'name', 'is_active']

      }
      let activitiesData = await bsp3Model.findAll(condition);
      if (activitiesData) {
        returnResponse = activitiesData;
        return response(res, status.DATA_AVAILABLE, 200, returnResponse);
      } else {
        returnResponse = {};
        return response(res, status.DATA_NOT_AVAILABLE, 401, returnResponse);
      }
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }
  static getbsp3masterreportdata = async (req, res) => {
    let returnResponse = {};
    try {

      let condition = {
        include: [
          {
            model: bsp1ProductionCenter,
            required: true,
            // attributes: ['bsp_1_id', 'members', ['quantity_of_seed_produced', 'target']],
            attributes: [],
            include: [
              {
                model: nucleusSeedAvailabityModel,
                left: true,
                attributes: [],

                // attributes: ['quantity']
              },
              {
                model: userModel,
                required: true,
                attributes: [],

                // attributes: ['quantity']
              },
            ]
          },
          {
            model: indentOfBreederseedModel,
            required: true,
            attributes: [],
            where: {
              // year:
              // season:
            }
            // include: [
            //   {
            //     model: agencyDetailModel,
            //     // attributes: [['contact_person_name', 'co_per_name'], 'agency_name', ['contact_person_designation', 'co_per_desig']],
            //     left: true,
            //     include: [{
            //       model: userModel,
            //       left: true,
            //       // where: searchData['searchBreederBspc'], //filters
            //     },
            //     {
            //       model: designationModel,
            //       left: true,
            //       // attributes: ['id', 'name']
            //     }
            //     ]
            //   }
            // ]
          },
          {
            model: cropVerietyModel,
            required: true,
            attributes: [],

            // raw:true,
            // attributes: ['variety_name'],
            // where: searchData['searchVarietyCrop'], //filters

          },
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('bsp1_production_centers->user.name')), 'bspc_name'],

          [sequelize.fn('SUM', sequelize.col('bsp1_production_centers.quantity_of_seed_produced')), 'quantity_of_seed_produced'],

          [sequelize.col('bsp_1s.variety_id'), 'variety_id'],
          [sequelize.col('bsp_1s.year'), 'year'],
          [sequelize.col('bsp_1s.season'), 'season'],

          // [sequelize.fn('SUM', sequelize.col('indent_of_spas.indent_quantity')), 'indent_quantity'],
          // [sequelize.col('user.name'), 'spa_name'],
          // [sequelize.col('bsp1_production_centers->nucleus_seed_availability.quantity'), 'nucleus_quantity'],
          // [sequelize.col('bsp1_production_centers->user.name'), 'bspc_name'],
          [sequelize.col('indent_of_breederseed".indent_quantity'), 'indent_quantity'],
          // [sequelize.fn('SUM',sequelize.col('bsp1_production_centers->nucleus_seed_availability.quantity')), 'nucleus_quantity'],
          [sequelize.fn('SUM', sequelize.col('bsp1_production_centers->nucleus_seed_availability.quantity')), 'nucleus_quantity'],
          [sequelize.col('m_crop_variety.variety_code'), 'variety_code'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          // [sequelize.col('m_crop_variety.introduce_year'), 'notification_year'],

        ],
        group: [
          [sequelize.col('bsp_1s.variety_id'), 'variety_id'],
          // [sequelize.col('bsp1_production_centers->nucleus_seed_availability.'), 'spa_code'],
          // [sequelize.col('user.name'), 'spa_name'],
          [sequelize.col('bsp_1s.year'), 'year'],
          [sequelize.col('bsp_1s.season'), 'season'],
          [sequelize.col('indent_of_breederseed".indent_quantity'), 'indent_quantity'],
          // [sequelize.col('bsp1_production_centers->nucleus_seed_availability.quantity'), 'nucleus_quantity'],
          [sequelize.col('bsp1_production_centers->user.name'), 'bspc_name'],
          // [sequelize.col('bsp1_production_centers.quantity_of_seed_produced'), 'quantity_of_seed_produced'],
          [sequelize.col('m_crop_variety.variety_code'), 'variety_code'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          // [sequelize.col('m_crop_variety.introduce_year'), 'notification_year'],
        ],
        raw: true
      }
      // condition
      // let bsp1Data = await bsp1Model.findAll(condition);
      let bsp1Data = await db.sequelize.query('SELECT indent_data.*,nucleus_seed_availabilities."quantity" FROM (SELECT DISTINCT("bsp1_production_centers->user"."name") AS "bspc_name", bsp_1s."year",bsp_1s."crop_code", bsp_1s."season",SUM("bsp1_production_centers"."quantity_of_seed_produced") AS "quantity_of_seed_produced", "bsp_1s"."variety_id" AS "variety_id", bsp1_production_centers."production_center_id","m_crop_variety"."variety_code" AS "variety_code", "m_crop_variety"."variety_name" AS "variety_name",SUM("indent_of_breederseed"."indent_quantity") AS indent_quantity FROM "bsp_1s" AS "bsp_1s" INNER JOIN "bsp1_production_centers" AS "bsp1_production_centers" ON "bsp_1s"."id" = "bsp1_production_centers"."bsp_1_id"  INNER JOIN "indent_of_breederseeds" AS "indent_of_breederseed" ON "bsp_1s"."indent_of_breederseed_id" = "indent_of_breederseed"."id" INNER JOIN "users" AS "bsp1_production_centers->user" ON "bsp1_production_centers"."production_center_id" = "bsp1_production_centers->user"."id" INNER JOIN "m_crop_varieties" AS "m_crop_variety" ON "bsp_1s"."variety_id" = "m_crop_variety"."id" GROUP BY  bsp_1s."year", bsp_1s."crop_code",bsp_1s."season", "bsp_1s"."variety_id","indent_of_breederseed"."indent_quantity","bsp1_production_centers->user"."name","m_crop_variety"."variety_code","m_crop_variety"."variety_name", bsp1_production_centers."production_center_id") AS indent_data LEFT OUTER JOIN nucleus_seed_availabilities ON nucleus_seed_availabilities."production_center_id" = indent_data."production_center_id" AND  nucleus_seed_availabilities."year" = indent_data."year" AND  nucleus_seed_availabilities."season" = indent_data."season" AND  nucleus_seed_availabilities."variety_code" = indent_data."variety_code"', { replacements: ['active'], type: sequelize.QueryTypes.SELECT });

      returnResponse = bsp1Data;

      let data = [] = returnResponse;
      let dataSet = [];
      let dataSet2 = [];
      const abc = data.map(element => {

        if (dataSet.hasOwnProperty(element['variety_id'])) {
          dataSet[element['variety_id']]['bspc'] = [...dataSet[element['variety_id']]['bspc'],
          { ...{ name: element['bspc_name'], available_nucleus_seed: (element['quantity']), allocation_qnt: (element['quantity_of_seed_produced']) } }]
        } else {
          dataSet[element['variety_id']] = element;
          dataSet[element['variety_id']]['bspc'] = [{ name: element['bspc_name'], available_nucleus_seed: (element['quantity']), allocation_qnt: (element['quantity_of_seed_produced']) }]
        }
        return dataSet2;
      })
      let finaleData = {}
      const abc1 = data.map(element => {

        if (element.hasOwnProperty('bspc')) {
          finaleData = [{ ...finaleData }, { ...element }]
          return element;
        }
      })
      return response(res, status.DATA_AVAILABLE, 200, abc1);

      // return response(res, status.DATA_AVAILABLE, 200, returnResponse)

    } catch (error) {
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse)
    }

  }
  static addSpaIndentor = async (req, res) => {
    let returnResponse = {};
    let internalCall = {};
    let condition = {};
    let mobileno;
    let statusMsg = '';
    let statusCode = '';

    try {
      let existingAgencyData = undefined;
      let existingData = undefined;
      // if (req.body.mobile_number) {
      //   mobileno = req.body.mobile_number;
      // } else if (req.body.mobile) {
      //   mobileno = req.body.mobile;
      // }
      let tabledAlteredSuccessfully = false;
      let usersData = {
        agency_name: (req.body.agency_name) ? (req.body.agency_name).replace(/\s+/g, ' ').trim().toUpperCase() : '',
        created_by: req.body.created_by,// 1,
        state_id: req.body.state,
        district_id: req.body.district,
        short_name: ((req.body.display_name).trim()).toUpperCase(),
        address: req.body.address,
        contact_person_name: (req.body.contact_person_name) ? (req.body.contact_person_name).replace(/\s+/g, ' ').trim() : '',
        contact_person_designation: req.body.contact_person_designation,
        // contact_person_mobile: req.body.mobile_number,
        phone_number: req.body.phone,
        fax_no: req.body.fax_number,
        longitude: req.body.longitude,
        latitude: req.body.latitude,
        email: req.body.email,
        sector_id: req.body.sector,
        sector_name: req.body.spa_name,
        // bank_name: req.body.bank_name,
        // bank_branch_name: req.body.bank_branch_name,
        // bank_ifsc_code: req.body.bank_ifsc_code,
        // bank_account_number: req.body.bank_account_number,
        // state_id: req.body.state_id,
        // district_id: req.body.district_id,
        mobile_number: req.body.mobile,
        pincode: req.body.pincode,
        block_id: req.body.block
      }
      existingAgencyData = await agencyDetailModel.findAll({
        include: [
          {
            model: userModel,
            where: {
              user_type: "SPA"
            }

          }
        ],
        where: {
          [Op.and]: [
            {
              where: sequelize.where(
                sequelize.fn('lower', sequelize.col('agency_name')),
                sequelize.fn('lower', req.body.agency_name),

                // created_by:{[Op.and]:req.body.createdby}
              ),
              created_by: { [Op.eq]: req.body.created_by }

            },



          ]
        },



      });
      if (existingAgencyData && existingAgencyData.length) {
        returnResponse = {
          error: 'Agency Name Already Exist'
        }
        return response(res, status.DATA_NOT_SAVE, 401, returnResponse)
      }


      existingData = await agencyDetailModel.findAll({
        include: [
          {
            model: userModel,
            where: {
              user_type: "SPA"
            }

          }
        ],
        // where: sequelize.where(
        //   sequelize.fn('lower', sequelize.col('short_name')),
        //   sequelize.fn('lower', req.body.display_name),
        // )
        where: {
          [Op.and]: [
            {
              where: sequelize.where(
                sequelize.fn('lower', sequelize.col('short_name')),
                sequelize.fn('lower', req.body.display_name),
              ),
              created_by: { [Op.eq]: req.body.created_by }
            },


          ]
        },
      });


      if (existingData.length != 0) {

        returnResponse = {
          error: 'Short Name Already Exists'
        }

        return response(res, status.DATA_NOT_SAVE, 401, returnResponse)
      }
      let existingEmaiData = await agencyDetailModel.findAll({

        where: {
          [Op.and]: [
            {
              where: sequelize.where(
                sequelize.fn('lower', sequelize.col('email')),
                sequelize.fn('lower', req.body.email),
              ),

            },


          ]
        },
      });
      if (existingEmaiData.length != 0) {
        returnResponse = {
          error: 'Email Already Exists'
        }

        return response(res, status.DATA_NOT_SAVE, 403, returnResponse)
      }


      if (existingData === undefined || existingData.length < 1) {

        const USER_API_KEY = process.env.USER_API_KEY
        let seedUserData = {
          "appKey": USER_API_KEY,
          // "stateCode": "CENTRAL",
          // "userid": req.body.email,
          // "password": "seeds#234",
          // "name": req.body.display_name,
          "role": "SPA",
          "blockName": req.body.blockName ? req.body.blockName : '',
          "districtName": req.body.districtName ? req.body.districtName : '',
          "agency_name": (req.body.agency_name) ? (req.body.agency_name).replace(/\s+/g, ' ').trim().toUpperCase() : '',
          "state": req.body.state ? req.body.state : '',
          "district": req.body.district ? req.body.district : '',
          "display_name": ((req.body.display_name).trim()).toUpperCase(),
          "address": req.body.address ? req.body.address : '',
          "pincode": req.body.pincode ? req.body.pincode : '',
          "contact_person_name": (req.body.contact_person_name) ? (req.body.contact_person_name).replace(/\s+/g, ' ').trim() : '',
          "contact_person_designation": req.body.contact_person_designation ? req.body.contact_person_designation : '',
          "mobile": req.body.mobile ? req.body.mobile : '',
          "email": req.body.email ? req.body.email : '',
          "block": req.body.block ? req.body.block : '',
          "sector": req.body.spa_name ? req.body.spa_name : ''
        }
        //    console.log("seedUserData", seedUserData)
        const apiResponse = await SeedUserManagement.createUser(seedUserData, 'SPA');
        //console.log(apiResponse.spaId, 'apiResponseapiResponseapiResponse')
        //Here req.body.spa_name has value of sector
        if (req.body && (req.body.spa_name.toUpperCase() == 'PRIVATE' || req.body.spa_name.toUpperCase() == 'PRIVATE COMPANY' || req.body.spa_name.toUpperCase() == 'INDIVIDUAL' || req.body.spa_name.toUpperCase() == 'NSAI')) {
          usersData = {
            ...usersData, state_id: 213, district_id: 20013, block_id: 300013,
            "actual_state_code": req.body.state ? req.body.state : '',
            "actual_district_code": req.body.district ? req.body.district : '',
            "actual_block_code": req.body.block ? req.body.block : '',
          }
        }
        //	 console.log("-----------usersData", usersData)
        if (apiResponse && apiResponse.spaId) {
          const data = agencyDetailModel.build(usersData);
          const insertData = await data.save();
          let spaCode = apiResponse && apiResponse.spaId ? apiResponse.spaId.toString() : ''
          if (req.body && (req.body.spa_name.toUpperCase() == 'PRIVATE' || req.body.spa_name.toUpperCase() == 'PRIVATE COMPANY' || req.body.spa_name.toUpperCase() == 'INDIVIDUAL' || req.body.spa_name.toUpperCase() == 'NSAI')) {
            spaCode = apiResponse && apiResponse.spaId ? req.body.state.toString() + apiResponse.spaId.toString() : ''

          }
          const userData = userModel.build({
            agency_id: insertData.id,
            username: req.body.email,
            name: req.body.display_name,
            email_id: req.body.email,
            unm: req.body.email,
            password: '123456',
            mobile_number: req.body.mobile,
            // designation_id: req.body.contact_person_designation,
            user_type: 'SPA',
            spa_code: spaCode
          });


          const insertUserData = await userData.save();
          await agencyDetailModel.update({ "user_id": insertUserData.id }, { where: { id: insertUserData.agency_id } });
          tabledAlteredSuccessfully = true;
          statusMsg = status.DATA_SAVE;
          statusCode = 200;
          returnResponse = {
            // spa_code: userData.spa_code,
            spa_code: apiResponse.spaId,
            password: 'Test@1234'

          }
          //return response(res, status.DATA_SAVE, 200, returnResponse, internalCall)
        } else {
          tabledAlteredSuccessfully = false;
          statusMsg = status.DATA_NOT_SAVE;
          statusCode = 404;

          //return response(res, status.DATA_NOT_SAVE, 404, returnResponse, internalCall)
        }
        return response(res, statusMsg, statusCode, returnResponse, internalCall)

      } else if (tabledAlteredSuccessfully) {
        returnResponse = {
          spa_code: userData.spa_code,
          password: 'Test@1234'

        }
        return response(res, status.DATA_SAVE, 200, returnResponse, internalCall)
      } else {
        return response(res, status.DATA_NOT_SAVE, 404, returnResponse, internalCall)
      }
      // if (tabledAlteredSuccessfully) {
      //   return response(res, status.DATA_SAVE, 200, returnResponse, internalCall)
      // } else {
      //   return response(res, status.DATA_NOT_SAVE, 401, returnResponse, internalCall)
      // }



      // if (req.body.search) {
      //   condition.where = {};
      //   if (req.body.search.state_id) {
      //     condition.where.state_id = parseInt(req.body.search.state_id);

      //   }
      //   if (req.body.search.state_id) {
      //     condition.where.state_id = parseInt(req.body.search.state_id);

      //   }
      //   let data = await agencyDetailModel.findAndCountAll(condition);
      //   if (data) {

      //     return response(res, status.DATA_AVAILABLE, 200, data)
      //   }
      //   else {
      //     return response(res, status.DATA_NOT_AVAILABLE, 400)
      //   }
      // }
      // return response(res, status.DATA_SAVE, 200, insertData)


    } catch (error) {
      returnResponse = {
        message: error.message
      };
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }
  static addSpaIndentorList = async (req, res) => {
    let data = {};
    try {


      let condition = {};
      if (req.body.id) {
        condition = {
          include: [
            {
              model: designationModel,
              left: true,
              attributes: ['name']
            },
            {
              model: stateModel,
              left: true,
              attributes: ['state_name'],
            },
            {
              model: districtModel,
              left: true,
              attributes: ['district_name'],
            },
            {
              model: blockModel
            },
            {
              model: centralModel
            },
            // {
            //   model:categoryModel,
            //   left: true,
            //   attributes: ['category_name']
            // },
            {
              model: userModel,
              left: true,
              attributes: ['spa_code'],
              where: {
                user_type: 'SPA'
              }
            },
          ],
          where: {
            // id: req.body.id,
            // created_by: req.body.search.created_by,

            // created_by: 1

            is_active: 1
          }
        };
      } else {
        condition = {
          include: [
            {
              model: designationModel,
              left: true,
              attributes: ['name']
            },
            {
              model: stateModel,
              left: true,
              attributes: ['state_name'],
            },
            {
              model: districtModel,
              left: true,
              attributes: ['district_name'],
            },
            {
              model: blockModel
            },
            {
              model: centralModel
            },
            // {
            //   model:categoryModel,
            //   left: true,
            //   attributes: ['category_name']
            // },
            {
              model: userModel,
              left: true,
              attributes: ['spa_code'],
              where: {
                user_type: 'SPA'
              }
            },
          ],
          where: {
            // created_by: req.body.search.created_by,
          }
        };
      }

      let { page, pageSize, search } = req.body;
      if (page === undefined) page = 1;
      if (pageSize === undefined) pageSize = 10; // set pageSize to -1 to prevent sizing

      if (page > 0 && pageSize > 0) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }
      const sortOrder = req.body.sort ? req.body.sort : 'id';
      const sortDirection = req.body.order ? req.body.order : 'DESC';


      // condition.order = [['agency_name', 'ASC'], ['short_name', 'ASC'], [sequelize.col('m_district.district_name'), 'ASC'], [sequelize.col('m_state.state_name'), 'ASC']];
      condition.order = [[sortOrder, sortDirection]];
      if (req.body.search) {
        if (req.body.search.state_id) {
          condition.where.state_id = (req.body.search.state_id);
        }
        if (req.body.search.district_id) {
          condition.where.district_id = (req.body.search.district_id);
        }
        if (req.body.search.agency_id) {
          condition.where.id = (req.body.search.agency_id);
        }
      }

      data = await agencyDetailModel.findAndCountAll(condition);
      // res.send(data)

      // let returnResponse = await paginateResponse(data, page, pageSize);
      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static editIndentorSppData = async (req, res) => {
    let returnResponse = {};
    let internalCall = {};
    let mobileno;
    try {
      let existingAgencyData = undefined;
      let existingData = undefined;
      if (req.body.mobile_number) {
        mobileno = req.body.mobile_number;
      } else if (req.body.mobile) {
        mobileno = req.body.mobile;
      }
      let tabledAlteredSuccessfully = false;
      const id = parseInt(req.body.id);
      let condition = {
        where: {
          id: id
        }
      }
      let usersData = {
        agency_name: req.body.agency_name ? (req.body.agency_name).replace(/\s+/g, ' ').trim().toUpperCase() : '',
        updated_by: req.body.updated_by,
        category: req.body.category_agency,
        state_id: req.body.state,
        district_id: req.body.district,
        short_name: ((req.body.display_name).trim()).toUpperCase(),
        address: req.body.address,
        contact_person_name: req.body.contact_person_name,
        contact_person_designation: req.body.contact_person_designation_id,
        contact_person_designation: req.body.contact_person_designation,
        block_id: req.body.block,
        // contact_person_mobile: req.body.mobile_number,
        phone_number: req.body.phone,
        fax_no: req.body.fax_number,
        longitude: req.body.longitude,
        latitude: req.body.latitude,
        email: req.body.email,
        bank_name: req.body.bank_name,
        bank_branch_name: req.body.bank_branch_name,
        bank_ifsc_code: req.body.bank_ifsc_code,
        bank_account_number: req.body.bank_account_number,
        created_by: req.body.updated_by,
        // state_id: req.body.state_id,
        // district_id: req.body.district_id,
        mobile_number: mobileno,
        pincode: req.body.pincode,
        is_active: req.body.active,
        sector_id: req.body.sector,
        sector_name: req.body.spa_name,
      };



      existingAgencyData = await agencyDetailModel.findAll({
        include: [{
          model: userModel,
          where: {
            user_type: 'SPA'
          }
        }],
        where: {
          [Op.and]: [
            {
              where: sequelize.where(
                sequelize.fn('lower', sequelize.col('agency_name')),
                sequelize.fn('lower', req.body.agency_name),

                // created_by:{[Op.and]:req.body.createdby}
              ),
              // created_by: { [Op.eq]: req.body.updated_by },
              created_by: { [Op.eq]: req.body.updated_by },
              id: { [Op.ne]: id },


            },



          ]
        },



      });
      if (existingAgencyData && existingAgencyData.length) {
        returnResponse = {
          error: 'Agency Name Already Exist'
        }
        return response(res, status.DATA_NOT_SAVE, 401, returnResponse)
      }


      existingData = await agencyDetailModel.findAll({
        include: [{
          model: userModel,
          where: {
            user_type: 'SPA'
          }
        }],
        // where: sequelize.where(
        //   sequelize.fn('lower', sequelize.col('short_name')),
        //   sequelize.fn('lower', req.body.display_name),
        // )
        where: {
          [Op.and]: [
            {
              where: sequelize.where(
                sequelize.fn('lower', sequelize.col('short_name')),
                sequelize.fn('lower', req.body.display_name),
              ),
              created_by: { [Op.eq]: req.body.updated_by },
              id: { [Op.ne]: id },
              // created_by: { [Op.eq]: req.body.created_by }

            },


          ]
        },
      });

      if (existingData.length != 0) {

        returnResponse = {
          error: 'Short Name Already Exists'
        }

        return response(res, status.DATA_NOT_SAVE, 401, returnResponse)
      }

      let existingEmaiData = await agencyDetailModel.findAll({
        // where: sequelize.where(
        //   sequelize.fn('lower', sequelize.col('short_name')),
        //   sequelize.fn('lower', req.body.display_name),
        // )
        where: {
          [Op.and]: [
            {
              where: sequelize.where(
                sequelize.fn('lower', sequelize.col('email')),
                sequelize.fn('lower', req.body.email),
              ),
              id: { [Op.ne]: id },

            },


          ]
        },
      });
      if (existingEmaiData.length != 0) {
        returnResponse = {
          error: 'Email Already Exist'
        }

        return response(res, status.DATA_NOT_SAVE, 403, returnResponse)
      }



      if (existingData === undefined || existingData.length < 1) {
        const data = await agencyDetailModel.update(usersData, condition);
        tabledAlteredSuccessfully = true;
        //createUser()
      }


      if (tabledAlteredSuccessfully) {
        return response(res, status.DATA_SAVE, 200, returnResponse, internalCall)
      } else {
        return response(res, status.DATA_NOT_SAVE, 401, returnResponse, internalCall)
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_SAVE, 500, error)
    }
  }
  static deleteSPPIndentorAgencyData = async (req, res) => {
    let data = {};
    try {
      if (req.body.id) {
        const agencyDetailData = await agencyDetailModel.destroy({
          where: {
            id: req.body.id
          }
        });
        const userData = await userModel.destroy({
          where: {
            agency_id: req.body.id,
            user_type: 'SPA'
          }
        });
        if (agencyDetailData && userData) {
          response(res, status.DATA_DELETED, 200, agencyDetailData)
        }
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getBlockData = async (req, res) => {
    let data = {};
    try {
      const condition = {
        where: {
          district_code: req.body.search.district_code
        }
      }






      // condition.order = [['agency_name', 'ASC'], ['short_name', 'ASC'], [sequelize.col('m_district.district_name'), 'ASC'], [sequelize.col('m_state.state_name'), 'ASC']];
      // condition.order = [[sortOrder, sortDirection]];
      // if (req.body.search) {
      //   if (req.body.search.state_id) {
      //     condition.where.state_id = (req.body.search.state_id);
      //   }
      //   if (req.body.search.district_id) {
      //     condition.where.district_id = (req.body.search.district_id);
      //   }
      //   if (req.body.search.agency_id) {
      //     condition.where.id = (req.body.search.agency_id);
      //   }
      // }

      data = await blockModel.findAndCountAll(condition);
      // res.send(data)

      // let returnResponse = await paginateResponse(data, page, pageSize);
      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getAgencyUserDataById = async (req, res) => {
    try {
      const condition = {
        include: [
          {
            model: db.designationModelSecond,
            // as: 'm_designation',
            required: false,
            attributes: ['id', 'name']
          },
          {
            required: false,
            model: stateModel,
            attributes: []
          },
          {
            required: false,
            model: districtModel,
            attributes: []
          },
        ],
        where: {
          id: Number(req.params.id)
        },
        raw: true,
        attributes: ['id', 'short_name', 'agency_name', 'contact_person_name', 'address', 'image_url', 'contact_person_designation_id', 'user_id',
          [sequelize.col('m_state.state_name'), 'state_name'],
          [sequelize.col('m_district.district_name'), 'district_name'],
          [sequelize.col('m_designation.name'), 'designation_name']
        ]
      };
      let data = await agencyDetailModel.findOne(condition);
      if (data) {
        if (data['image_url']) {
          data['image_url2'] = `${process.env.END_POINT}` + (data['image_url']);
        }
      }
      if (!data) {
        return response(res, status.DATA_NOT_AVAILABLE, 404);
      }
      return response(res, status.DATA_AVAILABLE, 200, data);
    }
    catch (error) {
      console.log(error, 'error')
      const returnResponse = {
        message: error.message,
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }

  }
  static getAgencyUserDataById1 = async (req, res) => {
    try {
      const condition = {
        include: [
          {
            model: designationModel,
            attributes: ['id', 'name']
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
        where: {
          user_id: Number(req.params.id)
        },
        raw: true,
        attributes: ['id', 'short_name', 'agency_name', 'contact_person_name', 'address', 'image_url', 'contact_person_designation_id', 'user_id',
          [sequelize.col('m_state.state_name'), 'state_name'],
          [sequelize.col('m_district.district_name'), 'district_name'],
        ]
      };
      let data = await agencyDetailModel.findOne(condition);
      if (data) {
        if (data['image_url']) {
          data['image_url2'] = `${process.env.END_POINT}` + (data['image_url']);
        }
      }
      if (!data) {
        return response(res, status.DATA_NOT_AVAILABLE, 404);
      }
      return response(res, status.DATA_AVAILABLE, 200, data);
    }
    catch (error) {
      const returnResponse = {
        message: error.message,
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }

  }
  static getAgencyUserIndentorDataById = async (req, res) => {
    try {
      const condition = {
        where: {
          id: Number(req.params.id)
        },
        include: [
          {
            model: stateModel,
            attributes: ['state_name', 'state_code']
          }
        ],
        attributes: ['id', 'short_name', 'agency_name']
      };
      let data = await agencyDetailModel.findOne(condition);
      if (!data) {
        return response(res, status.DATA_NOT_AVAILABLE, 404);
      }

      return response(res, status.DATA_AVAILABLE, 200, data);
    }
    catch (error) {
      const returnResponse = {
        message: error.message,
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }

  }
  static getBspcDatainCharacterstics = async (req, res) => {
    try {
      const condition = {
        include: [
          {
            model: userModel,
            where: {
              user_type: 'BPC'
            }
          }
        ]


      };
      let data = await agencyDetailModel.findAndCountAll(condition);
      if (!data) {
        return response(res, status.DATA_NOT_AVAILABLE, 404);
      }

      return response(res, status.DATA_AVAILABLE, 200, data);
    }
    catch (error) {
      const returnResponse = {
        message: error.message,
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }

  }
  static getCentralData = async (req, res) => {
    try {
      const condition = {

        where: {}

      };
      if (req.body.search) {
        if (req.body.search.type) {
          condition.where.type = req.body.search.type;
        }
      }
      let data = await centralModel.findAndCountAll(condition);
      if (!data) {
        return response(res, status.DATA_NOT_AVAILABLE, 404);
      }

      return response(res, status.DATA_AVAILABLE, 200, data);
    }
    catch (error) {
      const returnResponse = {
        message: error.message,
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }

  }
  static getUserDataInIndentor = async (req, res) => {
    try {
      const condition = {

        include: [
          {
            model: userModel,

          }
        ],
        where: {
          id: req.params.id
        }

      };
      let data = await agencyDetailModel.findAndCountAll(condition);
      if (!data) {
        return response(res, status.DATA_NOT_AVAILABLE, 404);
      }

      return response(res, status.DATA_AVAILABLE, 200, data);
    }
    catch (error) {
      const returnResponse = {
        message: error.message,
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }

  }
  static getSpaDetailsData = async (req, res) => {
    let returnResponse = {};
    let internalCall = {};
    try {
      let rules = {
        'state_code': 'required',
        'spa_code': 'required|string',
        'indent_year': 'required|string',
        'season_code': 'required|string'
      };

      let validation = new Validator(req.query, rules);

      const isValidData = validation.passes();

      if (!isValidData) {
        let errorResponse = {};
        for (let key in rules) {
          const error = validation.errors.get(key);
          if (error.length) {
            errorResponse[key] = error;
          }
        }
        return response(res, status.BAD_REQUEST, 400, errorResponse, internalCall)
      }

      const condition = {
        include: [
          {
            model: cropModel,

            attributes: []
          },
          {
            model: cropVerietyModel,
            attributes: []
          },
          {
            model: agencyDetailModel,
            include: [{
              model: userModel,

              attributes: [],
              include: [
                {
                  model: indentOfBreederseedModel,
                  // attributes:['id','user_id'],
                  include: [
                    {
                      model: alloallocationToIndentorProductionCenterSeed,
                      attributes: []
                    }
                  ]
                }
              ]
            }],
            attributes: [],
          }
        ],
        where: {
          state_code: req.query.state_code,
          spa_code: req.query.spa_code,
          year: req.query.indent_year,
          season: req.query.season_code
        },
        attributes: [

          [sequelize.col('m_crop.crop_name'), 'crop_name'],
          // [sequelize.fn('DISTINCT', sequelize.col('m_crop.crop_name')), 'crop_name'],
          [sequelize.col('m_crop_variety.variety_name'), 'crop_variety'],
          // [sequelize.col('agency_detail.id'), 'id'],
          [sequelize.col('agency_detail.agency_name'), 'bspc_centre_name'],
          [sequelize.col('agency_detail.short_name'), 'bspc_centre_code'],
          [sequelize.col('indent_of_spas.indent_quantity'), 'indent_quantity'],
          [sequelize.col('indent_of_spas.crop_type'), 'crop_type'],
          [sequelize.col('agency_detail->user->indent_of_breederseed->allocation_to_indentor_for_lifting_seed_production_cnter.allocated_quantity'), 'allocated_quantity'],
        ],
        // raw:true,
      }

      const data = await indentOfSpaModel.findAndCountAll(condition)
      if (data != undefined && data.count > 0) {
        return response(res, status.DATA_AVAILABLE, 200, data);
      } else {

        return response(res, status.DATA_NOT_AVAILABLE, 200, returnResponse);
      }
    } catch (error) {
      console.log("error", error);
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);

    }
  }



  static freezeTimelineFilter = async (req, res) => {
    try {
      let condition = {
        attributes: ['id', 'start_date', 'end_date', 'year_of_indent', 'season_name'],
        where: {
        }
      }

      if (req.body.search) {
        if (req.body.search.year_of_indent) {
          condition.where.year_of_indent = req.body.search.year_of_indent;
        }
        if (req.body.search.season_name) {
          condition.where.season_name = req.body.search.season_name;
        }
        if (req.body.search.activitie_id) {
          condition.where.activitie_id = req.body.search.activitie_id;
        }
      }
      let data = await freezeTimelineModel.findAll(condition);
      return response(res, status.DATA_AVAILABLE, 200, data);

    }
    catch (error) {
      console.log('error: ' + error);
      const returnResponse = {
        message: error.message,
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }
  static getAllocatedbySeedDivisionforlifting = async (req, res) => {
    let data = {};
    try {
      let condition = {}
      if (req.body.search.crop_name) {
        if (req.body.search.variety_id) {
          data = await db.sequelize.query(`
      
          SELECT "indent_of_spas"."id", "m_crop"."crop_name" AS "crop_name", "m_crop"."crop_code" AS "crop_code", "m_crop_variety"."variety_name" AS "variety_name", "indent_of_spas"."variety_id" AS "variety_id", "indent_of_spas"."indent_quantity" AS "indent_quantity", "allocation_to_spa_for_lifting_seed_production_cnter"."qty" AS "qty", "allocation_to_spa_for_lifting_seed_production_cnter->user"."name" AS "name", "allocation_to_spa_for_lifting_seed_production_cnter->user"."id" AS "id", "indent_of_spas"."crop_type" AS "crop_type", "m_state"."state_name" AS 
    "state_name","m_district"."district_name" AS 
    "district_name" FROM "indent_of_spas" AS "indent_of_spas" 
    LEFT OUTER JOIN "m_crops" AS "m_crop" ON "indent_of_spas"."crop_code" = "m_crop"."crop_code" 
    LEFT OUTER JOIN "m_crop_varieties" AS "m_crop_variety" ON "indent_of_spas"."variety_id" = "m_crop_variety"."id" 
     LEFT OUTER JOIN "allocation_to_spa_for_lifting_seed_production_cnters" AS "allocation_to_spa_for_lifting_seed_production_cnter" ON "indent_of_spas"."spa_code" = "allocation_to_spa_for_lifting_seed_production_cnter"."spa_code" AND "indent_of_spas"."state_code" = "allocation_to_spa_for_lifting_seed_production_cnter"."state_code"::Integer
     LEFT OUTER JOIN "users" AS "allocation_to_spa_for_lifting_seed_production_cnter->user" ON "allocation_to_spa_for_lifting_seed_production_cnter"."production_center_id" = "allocation_to_spa_for_lifting_seed_production_cnter->user"."id" 
     LEFT OUTER JOIN "agency_details" AS "agency_details" On agency_details.user_id = "allocation_to_spa_for_lifting_seed_production_cnter"."production_center_id"
     LEFT OUTER JOIN "m_states" AS "m_state" ON "agency_details"."state_id" = "m_state"."state_code"
     LEFT OUTER JOIN "m_districts" AS "m_district" ON "agency_details"."district_id" = "m_district"."district_code"
     WHERE ("indent_of_spas"."year" = '${req.body.search.year}' AND "indent_of_spas"."season" = '${req.body.search.season}' AND "indent_of_spas"."crop_type" = '${req.body.search.crop_type}' 
     AND "indent_of_spas"."state_code" = '${req.body.loginedUserid.state_id}' AND "indent_of_spas"."crop_code" IN (':crops') AND "indent_of_spas"."variety_id" = ('${req.body.search.variety_id}'))
          `, {
            replacements: { crops: req.body.search.crop_name }
          })
        } else {

          data = await db.sequelize.query(`
          
      
      SELECT "indent_of_spas"."id", "m_crop"."crop_name" AS "crop_name", "m_crop"."crop_code" AS "crop_code", "m_crop_variety"."variety_name" AS "variety_name", "indent_of_spas"."variety_id" AS "variety_id", "indent_of_spas"."indent_quantity" AS "indent_quantity", "allocation_to_spa_for_lifting_seed_production_cnter"."qty" AS "qty", "allocation_to_spa_for_lifting_seed_production_cnter->user"."name" AS "name", "allocation_to_spa_for_lifting_seed_production_cnter->user"."id" AS "id", "indent_of_spas"."crop_type" AS "crop_type", "m_state"."state_name" AS 
"state_name","m_district"."district_name" AS 
"district_name" FROM "indent_of_spas" AS "indent_of_spas" 
LEFT OUTER JOIN "m_crops" AS "m_crop" ON "indent_of_spas"."crop_code" = "m_crop"."crop_code" 
LEFT OUTER JOIN "m_crop_varieties" AS "m_crop_variety" ON "indent_of_spas"."variety_id" = "m_crop_variety"."id" 
 LEFT OUTER JOIN "allocation_to_spa_for_lifting_seed_production_cnters" AS "allocation_to_spa_for_lifting_seed_production_cnter" ON "indent_of_spas"."spa_code" = "allocation_to_spa_for_lifting_seed_production_cnter"."spa_code" AND "indent_of_spas"."state_code" = "allocation_to_spa_for_lifting_seed_production_cnter"."state_code"::Integer
 LEFT OUTER JOIN "users" AS "allocation_to_spa_for_lifting_seed_production_cnter->user" ON "allocation_to_spa_for_lifting_seed_production_cnter"."production_center_id" = "allocation_to_spa_for_lifting_seed_production_cnter->user"."id" 
 LEFT OUTER JOIN "agency_details" AS "agency_details" On agency_details.user_id = "allocation_to_spa_for_lifting_seed_production_cnter"."production_center_id"
 LEFT OUTER JOIN "m_states" AS "m_state" ON "agency_details"."state_id" = "m_state"."state_code"
 LEFT OUTER JOIN "m_districts" AS "m_district" ON "agency_details"."district_id" = "m_district"."district_code"
 WHERE ("indent_of_spas"."year" = '${req.body.search.year}' AND "indent_of_spas"."season" = '${req.body.search.season}' AND "indent_of_spas"."crop_type" = '${req.body.search.crop_type}' 
 AND "indent_of_spas"."state_code" = '${req.body.loginedUserid.state_id}' AND "indent_of_spas"."crop_code" IN (:crops))
      `, {
            replacements: { crops: req.body.search.crop_name }
          })
        }
      } else {
        data = await db.sequelize.query(`
      
      SELECT "indent_of_spas"."id", "m_crop"."crop_name" AS "crop_name", "m_crop"."crop_code" AS "crop_code", "m_crop_variety"."variety_name" AS "variety_name", "indent_of_spas"."variety_id" AS "variety_id", "indent_of_spas"."indent_quantity" AS "indent_quantity", "allocation_to_spa_for_lifting_seed_production_cnter"."qty" AS "qty", "allocation_to_spa_for_lifting_seed_production_cnter->user"."name" AS "name", "allocation_to_spa_for_lifting_seed_production_cnter->user"."id" AS "id", "indent_of_spas"."crop_type" AS "crop_type", "m_state"."state_name" AS 
"state_name","m_district"."district_name" AS 
"district_name" FROM "indent_of_spas" AS "indent_of_spas" 
LEFT OUTER JOIN "m_crops" AS "m_crop" ON "indent_of_spas"."crop_code" = "m_crop"."crop_code" 
LEFT OUTER JOIN "m_crop_varieties" AS "m_crop_variety" ON "indent_of_spas"."variety_id" = "m_crop_variety"."id" 
 LEFT OUTER JOIN "allocation_to_spa_for_lifting_seed_production_cnters" AS "allocation_to_spa_for_lifting_seed_production_cnter" ON "indent_of_spas"."spa_code" = "allocation_to_spa_for_lifting_seed_production_cnter"."spa_code" AND "indent_of_spas"."state_code" = "allocation_to_spa_for_lifting_seed_production_cnter"."state_code"::Integer
 LEFT OUTER JOIN "users" AS "allocation_to_spa_for_lifting_seed_production_cnter->user" ON "allocation_to_spa_for_lifting_seed_production_cnter"."production_center_id" = "allocation_to_spa_for_lifting_seed_production_cnter->user"."id" 
 LEFT OUTER JOIN "agency_details" AS "agency_details" On agency_details.user_id = "allocation_to_spa_for_lifting_seed_production_cnter"."production_center_id"
 LEFT OUTER JOIN "m_states" AS "m_state" ON "agency_details"."state_id" = "m_state"."state_code"
 LEFT OUTER JOIN "m_districts" AS "m_district" ON "agency_details"."district_id" = "m_district"."district_code"
 WHERE ("indent_of_spas"."year" = '${req.body.search.year}' AND "indent_of_spas"."season" = '${req.body.search.season}' AND "indent_of_spas"."crop_type" = '${req.body.search.crop_type}' 
 AND "indent_of_spas"."state_code" = '${req.body.loginedUserid.state_id}')
      `)
      }
      let result = data[0]
      let filteredData = []
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
              [Op.like]: req.body.search.crop_type ? (req.body.search.crop_type.substring(0, 1).toUpperCase()) + '%' : ''
            }
          })
        }

        if (req.body.search.crop_name != undefined && req.body.search.crop_name.length > 0) {
          fileterIndData.push({
            crop_code: {
              [Op.in]: req.body.search.crop_name
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
      let indnetData = await indentOfBreederseedModel.findAll(
        {
          where: {
            [Op.and]: fileterIndData ? fileterIndData : [],
            user_id: req.body.loginedUserid.id

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
          raw: true
        }
      )
      let allocationData = await allocationToSPASeed.findAll({

        include: [
          {
            model: allocationToSPAProductionCenterSeed,
            attributes: []
          }
        ],
        where: {
          [Op.and]: fileterIndData ? fileterIndData : []
        },
        attributes: [
          [sequelize.col('crop_code'), 'crop_code'],
          [sequelize.col('variety_id'), 'variety_id'],
          [sequelize.col('allocation_to_spa_for_lifting_seed_production_cnters.production_center_id'), 'production_center_id'],
          [sequelize.fn('SUM', sequelize.col('allocation_to_spa_for_lifting_seed_production_cnters.qty')), 'total_allocated_qty'],

        ],
        group: [
          [sequelize.col('crop_code'), 'crop_code'],
          [sequelize.col('variety_id'), 'variety_id'],
          [sequelize.col('allocation_to_spa_for_lifting_seed_production_cnters.production_center_id'), 'production_center_id']
        ],
        raw: true,


      })
      if (result && result.length > 0) {
        if (indnetData && indnetData.length > 0) {
          indnetData.forEach(el => {
            result.forEach((item, i) => {
              if (item.crop_code == el.crop_code && item.variety_id == el.variety_id) {
                result[i].indent_quantity = el && el.total_indent_qty ? parseFloat(el.total_indent_qty) : 0

              }

            })
          })
        }
      }
      if (result && result.length > 0) {
        if (allocationData && allocationData.length > 0) {
          allocationData.forEach(el => {
            result.forEach((item, i) => {
              if (item.crop_code == el.crop_code && item.variety_id == el.variety_id) {

                result[i].qtys = el && el.total_allocated_qty ? parseFloat(el.total_allocated_qty) : 0

              }

            })
          })
        }
      }

      result.forEach(el => {
        const spaIndex = filteredData.findIndex(item => item.crop_code === el.crop_code);
        if (spaIndex === -1) {
          filteredData.push({
            "crop_name": el.crop_name,
            "crop_code": el.crop_code,
            "total_indent": el.indent_quantity,
            "total_spa_count": 1,
            "variety": [
              {
                variety_name: el.variety_name,
                variety_id: el.variety_id,
                "total_indent": el.indent_quantity,
                "spa_count": 1,
                "spas": [
                  {
                    agencyname: el ? el.name : 0,
                    allocated_quantity: el && el.qty ? el.qty : 0,
                    allocated_quantitys: el ? el.qtys : 0,
                    id: el && el.id ? el.id : 0,
                    state_name: el && el.state_name ? el.state_name : 'NA',
                    districtName: el && el.district_name ? el.district_name : 'NA',
                    indent_quantity: el && el.indent_quantity ? el.indent_quantity : 0
                  }
                ]
              }
            ]
          });
        } else {
          const cropIndex = filteredData[spaIndex].variety.findIndex(item => item.variety_id === el.variety_id);
          if (cropIndex !== -1) {
            filteredData[spaIndex].variety[cropIndex].spas.push(
              {
                agencyname: el && el.name ? el.name : 0,
                state_name: el && el.state_name ? el.state_name : 'NA',
                allocated_quantity: el && el.qty ? el.qty : 0,
                allocated_quantitys: el ? el.qtys : 0,
                id: el && el.id ? el.id : 'NA',
                districtName: el && el.district_name ? el.district_name : 'NA',
                indent_quantity: el && el.indent_quantity ? el.indent_quantity : 0
              }
            );
          } else {
            filteredData[spaIndex].crop_total_indent = parseFloat(parseFloat(filteredData[spaIndex].crop_total_indent) + parseFloat(el.indent_quantity)).toFixed(2);
            filteredData[spaIndex].total_indent = parseFloat(el.indent_quantity) + parseFloat(el.indent_quantity).toFixed(2);
            filteredData[spaIndex].variety_count = filteredData[spaIndex].variety_count + 1;
            filteredData[spaIndex].total_spa_count = filteredData[spaIndex].total_spa_count + 1;
            filteredData[spaIndex].total_spa_count = filteredData[spaIndex].total_spa_count + 1;
            filteredData[spaIndex].variety.push({
              variety_name: el.variety_name,
              variety_id: el.variety_id,
              "total_indent": el.indent_quantity,
              "spa_count": 1,
              "spas": [
                {
                  agencyname: el ? el.name : 'NA',
                  allocated_quantity: el && el.qty ? el.qty : 0,
                  allocated_quantitys: el ? el.qtys : 0,
                  id: el && el.id ? el.id : 'NA',
                  districtName: el && el.district_name ? el.district_name : 'NA',
                  state_name: el && el.state_name ? el.state_name : 'NA',
                  indent_quantity: el && el.indent_quantity ? el.indent_quantity : 0
                }
              ]
            });
          }
        }
      });


      const sum = result.reduce((accumulator, current) => {
        // if (current.id === targetId) {

        //   return accumulator + current.value;
        // }
        // return accumulator;
      }, 0);

      console.log(sum);



      if (filteredData) {
        return response(res, status.DATA_AVAILABLE, 200, filteredData)
      } else {
        return response(res, "Data Not Found", 200, {})
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static checkShortNameDataForAll = async (req, res) => {
    let returnResponse = {};
    try {
      let paramBPCIds = {};
      let paramLabIds = {};
      if (req.body && req.body.type) {
        if (req.body.type == "BSPC" || req.body.type == "PC" || req.body.type == "IN" || req.body.type == "SPA") {
          paramBPCIds = {
            id: {
              [Op.eq]: req.body.id
            }
          };
        }

        if (req.body.type == "LAB")
          paramLabIds = {
            id: {
              [Op.eq]: req.body.id
            }
          }

      }
      let data = await agencyDetailModel.findOne({
        where: {
          [Op.and]: [
            {
              short_name: {
                [Op.eq]: req.body.sort_name
              }
            },
            {
              short_name: {
                [Op.not]: null
              },
            },
            {
              short_name: {
                [Op.not]: ''
              },
            },
          ]
        },
        attributes: ['id', 'short_name']
      });

      let data1 = await plantDetailsModel.findOne({
        where: {
          [Op.and]: [
            {
              short_name: {
                [Op.eq]: req.body.sort_name
              }
            },
            {
              short_name: {
                [Op.not]: null
              },
            },
            {
              short_name: {
                [Op.not]: ''
              },
            },
          ]
        },
        attributes: ['id', 'short_name']
      });

      let data2 = await seedLabTestModel.findOne({
        where: {
          [Op.and]: [
            {
              short_name: {
                [Op.eq]: req.body.sort_name
              }
            },
            {
              short_name: {
                [Op.not]: null
              },
            },
            {
              short_name: {
                [Op.not]: ''
              },
            },
          ]
        },
        attributes: ['id', 'short_name']
      });

      let dataWithId = [];
      let dataWithId2 = [];
      if (req.body.id) {
        dataWithId2 = await seedLabTestModel.findAll({
          where: {
            [Op.and]: [
              {
                short_name: {
                  [Op.eq]: req.body.sort_name
                }
              },
              {
                short_name: {
                  [Op.not]: null
                },
              },
              {
                short_name: {
                  [Op.not]: ''
                },
              },
              {
                id: {
                  [Op.eq]: req.body.id
                }
              }
            ]
          },
          attributes: ['id', 'short_name']
        });

        dataWithId = await agencyDetailModel.findAll({
          where: {
            [Op.and]: [
              {
                short_name: {
                  [Op.eq]: req.body.sort_name
                }
              },
              {
                short_name: {
                  [Op.not]: null
                },
              },
              {
                short_name: {
                  [Op.not]: ''
                },
              },
              {
                id: {
                  [Op.eq]: req.body.id
                }
              }
            ]
          },
          attributes: ['id', 'short_name']
        });
      }

      if ((data || data1 || data2)) {
        // !(data || data1 || data2) &&
        if (dataWithId && dataWithId.length > 0) {
          return response(res, "Data Not Found", 401, returnResponse);
        }
        // else if (dataWithId1 != undefined || dataWithId1 != null || dataWithId1.lenght > 0) {
        //   return response(res, "Data Not Found", 401, returnResponse);
        // }
        // != undefined || dataWithId2 != null || dataWithId2.lenght > 0
        else if (dataWithId2 && dataWithId2.length > 0) {
          return response(res, "Data Not Found", 401, returnResponse);
        }
        else {
          return response(res, "Data Already Exist", 200, returnResponse);
        }
      }
      else {
        return response(res, "Data Not Found", 401, returnResponse);
      }
    } catch (error) {
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }

  static getindentoryearlistSecond = async (req, res) => {
    let data = {};
    try {

      let condition = {
        where: {
          state_code: req.body.loginedUserid.state_id
        },
        // attributes:[],


        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('year')), 'year'],
        ],
        // group:[
        //   [sequelize.col('agency_detail->indent_of_breederseed.year'),'year']

        // ],
        // raw:true,
      };
      // if(req.body && req.body.search){
      //   if(req.body.search.type){
      //     if(req.body.search.type == "indenter"){
      //       condition.where.state_code = req.body.loginedUserid.state_id;
      //     }
      //   }
      // }
      condition.order = [[sequelize.col('year'), 'DESC']];
      data = await indentOfSpaModel.findAll(condition);

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
  static getindentoryearlistSecondindentor = async (req, res) => {
    let data = {};
    try {

      let condition = {

        // attributes:[],


        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('year')), 'year'],
        ],
        // group:[
        //   [sequelize.col('agency_detail->indent_of_breederseed.year'),'year']

        // ],
        // raw:true,
      };
      // if(req.body && req.body.search){
      //   if(req.body.search.type){
      //     if(req.body.search.type == "indenter"){
      //       condition.where.state_code = req.body.loginedUserid.state_id;
      //     }
      //   }
      // }
      condition.order = [[sequelize.col('year'), 'DESC']];
      data = await indentOfBreederseedModel.findAll(condition);

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
  static getindentorSeasonlistSecond = async (req, res) => {
    let data = {};
    try {
      let condition = {

        where: {
          year: req.body.search.year,
          state_code: req.body.loginedUserid.state_id

          // season:req.body.search.season,
        },


        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('season')), 'season'],
        ],



      };
      condition.order = [[sequelize.col('season'), 'ASC']];
      // condition.order = [['season', 'ASC']];
      data = await indentOfSpaModel.findAll(condition);

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
  static getindentorSeasonlistSecondindentor = async (req, res) => {
    let data = {};
    try {
      let condition = {

        where: {
          year: req.body.search.year,
          // state_code: req.body.loginedUserid.state_id

          // season:req.body.search.season,
        },


        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('season')), 'season'],
        ],



      };
      condition.order = [[sequelize.col('season'), 'ASC']];
      // condition.order = [['season', 'ASC']];
      data = await indentOfBreederseedModel.findAll(condition);

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
  static getindentorCropTypelistSecond = async (req, res) => {
    let data = {};
    try {
      let condition = {

        where: {
          state_code: req.body.loginedUserid.state_id,
          year: req.body.search.year,
          season: req.body.search.season
        },
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('crop_type')), 'crop_type'],
        ],


        //   attributes:[
        //   [sequelize.fn('DISTINCT', sequelize.col('crop_type')), 'crop_type'],
        // ],


      };

      condition.order = [[sequelize.col('crop_type'), 'ASC']];
      data = await indentOfSpaModel.findAll(condition);

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
  static getindentorCropTypelistSecondindentor = async (req, res) => {
    let data = {};
    try {
      let condition = {

        where: {
          // state_code: req.body.loginedUserid.state_id,
          year: req.body.search.year,
          season: req.body.search.season
        },
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('crop_type')), 'crop_type'],
        ],


        //   attributes:[
        //   [sequelize.fn('DISTINCT', sequelize.col('crop_type')), 'crop_type'],
        // ],


      };

      condition.order = [[sequelize.col('crop_type'), 'ASC']];
      data = await indentOfBreederseedModel.findAll(condition);

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
  static getSum(arr) {
    let result = [];

    arr.variety.forEach(function (a) {
      // console.log('resiul',a)
      if (!this[a.variety_name]) {
        this[a.variety_name] = { name: a.variety_name, indent_quantity: 0 };
        result.push(this[a.variety_name]);
      }
      this[a.variety_name].indent_quantity += a.indent_quantity;
    }, Object.create(null));
    return result
  }

  static getAllCategories = async (req, res) => {
    try {
      let condition = {
        where: {}
      }
      if (req.body.search) {
        if (req.body.search.type) {
          condition.where.type = req.body.search.type
        }
      }
      condition.order = [
        [sequelize.col('m_category_of_oragnizations.category_name'), 'ASC']]


      let data = await categoryModel.findAll(condition);
      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getAllDesignation = async (req, res) => {
    try {
      let condition = {
        where: {}
      }
      if (req.body.search) {
        if (req.body.search.type) {
          condition.where.type = req.body.search.type
        }
      }
      condition.order = [['name', 'ASC']]

      let data = await designationModel.findAll(condition);
      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static getIndentorSpaWiseBreederSeed = async (req, res) => {
    let data = {};
    try {
      let condition = {}
      if (req.body.loginedUserid && req.body.loginedUserid.state_id && req.body.search)
        req.body.search.state_code = req.body.loginedUserid.state_id

      let filters = await ConditionCreator.filters(req.body.search);
      if (req.body.search.spa_name) {

        condition = {
          where: filters,
          include: [
            {
              model: cropModel,
              attributes: [],
              attributes: ['id', 'crop_name', 'crop_code'],
            },
            {
              model: varietyModel,
              attributes: ['variety_name', 'not_date']
            },
            //  {
            //    model:agencyDetailModel,
            //    attributes:['agency_name']
            //  },
            //  {
            //   model:userModel,
            //   attributes:['name']
            // }

            {
              model: userModel,
              include: [{
                model: agencyDetailModel,
                where: {
                  id: {
                    [Op.in]: req.body.search.spa_name
                  }
                },

                attributes: ['agency_name']
              },
              ],

              attributes: ['name'],
              where: {
                id: {
                  // ${req.body.loginedUserid.state_id}
                  [Op.in]: sequelize.literal(` (SELECT users.id as id from users LEFT OUTER JOIN "agency_details" AS "agency_details" ON "agency_details"."user_id" = "users"."id" WHERE state_id = ${req.body.loginedUserid.state_id} AND user_type = 'SPA')`)
                }
              },
            }
          ],
          attributes: [
            [sequelize.col('indent_of_spas.crop_code'), 'crop_code'],
            [sequelize.col('indent_of_spas.indent_quantity'), 'indent_quantity'],
            [sequelize.col('m_crop.crop_name'), 'crop_name'],
            [sequelize.col('m_crop_variety.variety_code'), 'variety_code'],
            [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
            [sequelize.col('m_crop_variety.not_date'), 'not_date'],
            [sequelize.col('m_crop_variety.id'), 'variety_id'],
            [sequelize.col('user->agency_detail.state_id'), 'state_code'],
            [sequelize.col('user.spa_code'), "spa_code"],
          ],
        };
      }
      // -----------else--------//
      else {
        condition = {
          where: filters,
          include: [
            {
              model: cropModel,
              attributes: [],
              attributes: ['id', 'crop_name', 'crop_code'],
            },
            {
              model: varietyModel,
              attributes: ['variety_name', 'not_date']
            },
            //  {
            //    model:agencyDetailModel,
            //    attributes:['agency_name']
            //  },
            //  {
            //   model:userModel,
            //   attributes:['name']
            // }

            {
              model: userModel,
              include: [{
                model: agencyDetailModel,

                attributes: ['agency_name']
              },
              ],

              attributes: ['name'],
              where: {
                id: {
                  // ${req.body.loginedUserid.state_id}
                  [Op.in]: sequelize.literal(` (SELECT users.id as id from users LEFT OUTER JOIN "agency_details" AS "agency_details" ON "agency_details"."user_id" = "users"."id" WHERE state_id = ${req.body.loginedUserid.state_id} AND user_type = 'SPA')`)
                }
              },
            }
          ],
          attributes: [
            [sequelize.col('indent_of_spas.crop_code'), 'crop_code'],
            [sequelize.col('indent_of_spas.indent_quantity'), 'indent_quantity'],
            [sequelize.col('m_crop.crop_name'), 'crop_name'],
            [sequelize.col('m_crop_variety.variety_code'), 'variety_code'],
            [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
            [sequelize.col('m_crop_variety.variety_name'), 'not_date'],
            [sequelize.col('m_crop_variety.id'), 'variety_id'],
            [sequelize.col('user->agency_detail.state_id'), 'state_code'],
            [sequelize.col('user.spa_code'), "spa_code"],
          ],
        };
      }

      condition.order = [[sequelize.col('m_crop.crop_name'), 'ASC'], [sequelize.col('m_crop_variety.variety_name'), 'ASC']];
      if (req.body.search) {
        if (req.body.search.type) {
          if (req.body.search.type == "indenter") {
            condition.where.state_code = req.body.loginedUserid.state_id;
          }
        }

      }
      data = await indentOfSpaModel.findAll(condition);
      let filteredData = []
      data.forEach(el => {
        console.log(el.not_date, ' "not_date":el.m_crop_variety.not_date,')
        //        const spaIndex = filteredData.findIndex(item => item.name === el.agency_detail.agency_name );        
        const spaIndex = filteredData.findIndex(item => item.state_code === el.state_code && item.spa_code === el.spa_code);

        if (spaIndex === -1) {
          filteredData.push({
            "name": el.user.agency_detail.agency_name,
            "spa_code": el.spa_code,
            "state_code": el.state_code,
            // "sector": "ABC",
            "agency_name": el.agency_name,
            "total_indent": el.indent_quantity,
            "crop_count": 1,
            "variety_total_count": 1,
            "crops": [
              {
                "crop_name": el.m_crop.crop_name,
                "crop_code": el.crop_code,
                "crop_total_indent": el.indent_quantity,
                "variety_count": 1,
                "varieties": [
                  {
                    "name": el && el.m_crop_variety && el.m_crop_variety.variety_name ? el.m_crop_variety.variety_name : '',
                    "variety_id": el && el.variety_id ? el.variety_id : '',
                    "variety_code": el && el.variety_code ? el.variety_code : '',
                    "not_date": el && el.m_crop_variety && el.m_crop_variety.not_date ? el.m_crop_variety.not_date : '',
                    "indent_qunatity": el && el.indent_quantity ? el.indent_quantity : '',
                  }
                ]
              }
            ]
          });
        } else {
          // console.log('filteredData88888888888',el.agency_name, filteredData[spaIndex]);
          const cropIndex = filteredData[spaIndex].crops.findIndex(item => item.crop_code === el.crop_code);
          if (cropIndex !== -1) {
            // console.log('>>>>', cropIndex);
            filteredData[spaIndex].total_indent = parseFloat(parseFloat(filteredData[spaIndex].total_indent) + parseFloat(el.indent_quantity)).toFixed(2);

            filteredData[spaIndex].crops[cropIndex].crop_total_indent = parseFloat(parseFloat(filteredData[spaIndex].crops[cropIndex].crop_total_indent) + parseFloat(el.indent_quantity)).toFixed(2);
            // filteredData[spaIndex].variety[cropIndex].variety_count  = filteredData[spaIndex].variety[cropIndex].variety_count  + 1;
            // filteredData[spaIndex].crops[cropIndex].variety_count  = parseFloat(parseFloat(filteredData[spaIndex].varieties[cropIndex].variety_count))  + 1;
            filteredData[spaIndex].variety_total_count = filteredData[spaIndex].variety_total_count + 1;

            filteredData[spaIndex].crops[cropIndex].varieties.push(
              {
                "name": el && el.m_crop_variety && el.m_crop_variety.variety_name ? el.m_crop_variety.variety_name : '',
                "variety_id": el && el.variety_id ? el.variety_id : '',
                "variety_code": el && el.variety_code ? el.variety_code : '',
                "not_date": el && el.m_crop_variety && el.m_crop_variety.not_date ? el.m_crop_variety.not_date : '',
                "indent_qunatity": el && el.indent_quantity ? el.indent_quantity : '',
              }
            );
          } else {
            // console.log("fil/teredDataaaaaaaaaaaaa", filteredData)
            filteredData[spaIndex].crop_total_indent = parseFloat(parseFloat(filteredData[spaIndex].crop_total_indent) + parseFloat(el.indent_quantity)).toFixed(2);
            filteredData[spaIndex].variety_total_count = filteredData[spaIndex].variety_total_count + 1;
            filteredData[spaIndex].crop_count = filteredData[spaIndex].crop_count + 1;
            // filteredData[spaIndex].total_spa_count  = filteredData[spaIndex].total_spa_count  + 1;

            filteredData[spaIndex].crops.push({
              // "crops": [

              "crop_name": el.m_crop.crop_name,
              "crop_code": el.m_crop.crop_code,
              "crop_total_indent": el.indent_quantity,
              "variety_count": 1,

              "varieties": [
                {
                  "name": el && el.m_crop_variety && el.m_crop_variety.variety_name ? el.m_crop_variety.variety_name : '',
                  "variety_id": el && el.variety_id ? el.variety_id : '',
                  "variety_code": el && el.variety_code ? el.variety_code : '',
                  "not_date": el && el.m_crop_variety && el.m_crop_variety.not_date ? el.m_crop_variety.not_date : '',
                  "indent_qunatity": el && el.indent_quantity ? el.indent_quantity : '',
                }
              ]


            });
          }
        }
      });



      // data = await indentOfSpaModel.findAll(condition);

      if (filteredData) {
        return response(res, status.DATA_AVAILABLE, 200, filteredData)
      } else {
        return response(res, "Data Not Found", 200, {})
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getIndentorSpaWiseBreederSeedIndentor = async (req, res) => {
    let data = {};
    try {
      let condition = {}


      let filters = await ConditionCreator.filters(req.body.search);
      if (req.body.search.spa_name) {

        condition = {
          where: filters,
          include: [
            {
              model: cropModel,
              attributes: [],
              attributes: ['id', 'crop_name', 'crop_code'],
            },
            {
              model: varietyModel,
              attributes: ['variety_name', 'not_date']
            },
            //  {
            //    model:agencyDetailModel,
            //    attributes:['agency_name']
            //  },
            //  {
            //   model:userModel,
            //   attributes:['name']
            // }

            {
              model: userModel,
              include: [{
                model: agencyDetailModel,
                where: {
                  id: {
                    [Op.in]: req.body.search.spa_name
                  }
                },

                attributes: ['agency_name']
              },
              ],

              attributes: ['name'],
              where: {
                [Op.and]: [
                  {
                    name: {
                      [Op.ne]: null
                    }

                  },
                  {
                    name: {
                      [Op.ne]: ""
                    }

                  }

                ]
              }
            }
          ],
          attributes: [
            [sequelize.col('indent_of_breederseeds.crop_code'), 'crop_code'],
            [sequelize.col('indent_of_breederseeds.indent_quantity'), 'indent_quantity'],
            [sequelize.col('m_crop.crop_name'), 'crop_name'],
            [sequelize.col('m_crop_variety.variety_code'), 'variety_code'],
            [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
            [sequelize.col('m_crop_variety.not_date'), 'not_date'],
            [sequelize.col('m_crop_variety.id'), 'variety_id'],
            [sequelize.col('user->agency_detail.state_id'), 'state_code'],
            [sequelize.col('user.spa_code'), "spa_code"],
            [sequelize.col('user.id'), "user_id"],
          ],
        };
      }
      // -----------else--------//
      else {
        condition = {
          where: filters,
          include: [
            {
              model: cropModel,
              attributes: [],
              attributes: ['id', 'crop_name', 'crop_code'],
            },
            {
              model: varietyModel,
              attributes: ['variety_name', 'not_date']
            },
            //  {
            //    model:agencyDetailModel,
            //    attributes:['agency_name']
            //  },
            //  {
            //   model:userModel,
            //   attributes:['name']
            // }

            {
              model: userModel,
              include: [{
                model: agencyDetailModel,

                attributes: ['agency_name']
              },
              ],

              attributes: ['name'],

            }
          ],
          attributes: [
            [sequelize.col('indent_of_breederseeds.crop_code'), 'crop_code'],
            [sequelize.col('indent_of_breederseeds.indent_quantity'), 'indent_quantity'],
            [sequelize.col('m_crop.crop_name'), 'crop_name'],
            [sequelize.col('m_crop_variety.variety_code'), 'variety_code'],
            [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
            [sequelize.col('m_crop_variety.variety_name'), 'not_date'],
            [sequelize.col('m_crop_variety.id'), 'variety_id'],
            [sequelize.col('user->agency_detail.state_id'), 'state_code'],
            [sequelize.col('user.spa_code'), "spa_code"],
            [sequelize.col('user.id'), "user_id"],
          ],
        };
      }

      condition.order = [[sequelize.col('m_crop.crop_name'), 'ASC'], [sequelize.col('m_crop_variety.variety_name'), 'ASC']];

      data = await indentOfBreederseedModel.findAll(condition);
      let filteredData = []
      data.forEach(el => {
        const spaIndex = filteredData.findIndex(item => item.user_id == el.user_id);
        // const spaIndex = filteredData.findIndex(item => item.state_code === el.state_code && item.spa_code === el.spa_code);

        if (spaIndex === -1) {
          filteredData.push({
            "name": el && el.user && el.user.agency_detail && el.user.agency_detail.agency_name ? el.user.agency_detail.agency_name : '',
            "spa_code": el && el.spa_code ? el.spa_code : '',
            "state_code": el && el.state_code ? el.state_code : '',
            // "sector": "ABC",
            "user_id": el && el.user_id ? el.user_id : '',
            "agency_name": el && el.agency_name ? el.agency_name : '',
            "total_indent": el && el.indent_quantity ? el.indent_quantity : '',
            "crop_count": 1,
            "variety_total_count": 1,
            "crops": [
              {
                "crop_name": el && el.m_crop && el.m_crop.crop_name ? el.m_crop.crop_name : '',
                "crop_code": el && el.crop_code ? el.crop_code : '',
                "crop_total_indent": el && el.indent_quantity ? el.indent_quantity : '',
                "variety_count": 1,
                "varieties": [
                  {
                    "name": el && el.m_crop_variety && el.m_crop_variety.variety_name ? el.m_crop_variety.variety_name : '',
                    "variety_id": el && el.variety_id ? el.variety_id : '',
                    "variety_code": el && el.variety_code ? el.variety_code : '',
                    "not_date": el && el.m_crop_variety && el.m_crop_variety.not_date ? el.m_crop_variety.not_date : '',
                    "indent_qunatity": el && el.indent_quantity ? el.indent_quantity : '',
                  }
                ]
              }
            ]
          });
        } else {
          // console.log('filteredData88888888888',el.agency_name, filteredData[spaIndex]);
          const cropIndex = filteredData[spaIndex].crops.findIndex(item => item.crop_code === el.crop_code);
          if (cropIndex !== -1) {
            // console.log('>>>>', cropIndex);
            filteredData[spaIndex].total_indent = parseFloat(parseFloat(filteredData[spaIndex].total_indent) + parseFloat(el.indent_quantity)).toFixed(2);

            filteredData[spaIndex].crops[cropIndex].crop_total_indent = parseFloat(parseFloat(filteredData[spaIndex].crops[cropIndex].crop_total_indent) + parseFloat(el.indent_quantity)).toFixed(2);
            // filteredData[spaIndex].variety[cropIndex].variety_count  = filteredData[spaIndex].variety[cropIndex].variety_count  + 1;
            // filteredData[spaIndex].crops[cropIndex].variety_count  = parseFloat(parseFloat(filteredData[spaIndex].varieties[cropIndex].variety_count))  + 1;
            filteredData[spaIndex].variety_total_count = filteredData[spaIndex].variety_total_count + 1;

            filteredData[spaIndex].crops[cropIndex].varieties.push(
              {
                "name": el && el.m_crop_variety && el.m_crop_variety.variety_name ? el.m_crop_variety.variety_name : '',
                "variety_id": el && el.variety_id ? el.variety_id : '',
                "variety_code": el && el.variety_code ? el.variety_code : '',
                "indent_qunatity": el && el.indent_quantity ? el.indent_quantity : '',
                "not_date": el && el.m_crop_variety && el.m_crop_variety.not_date ? el.m_crop_variety.not_date : '',
              }
            );
          } else {
            // console.log("fil/teredDataaaaaaaaaaaaa", filteredData)
            filteredData[spaIndex].crop_total_indent = parseFloat(parseFloat(filteredData[spaIndex].crop_total_indent) + parseFloat(el.indent_quantity)).toFixed(2);
            filteredData[spaIndex].variety_total_count = filteredData[spaIndex].variety_total_count + 1;
            filteredData[spaIndex].crop_count = filteredData[spaIndex].crop_count + 1;
            // filteredData[spaIndex].total_spa_count  = filteredData[spaIndex].total_spa_count  + 1;

            filteredData[spaIndex].crops.push({
              // "crops": [

              "crop_name": el && el.m_crop && el.m_crop.crop_name ? el.m_crop.crop_name : '',
              "crop_code": el && el.m_crop && el.m_crop.crop_code ? el.m_crop.crop_code : '',
              "crop_total_indent": el && el.indent_quantity ? el.indent_quantity : '',
              "variety_count": 1,

              "varieties": [
                {
                  "name": el && el.m_crop_variety && el.m_crop_variety.variety_name ? el.m_crop_variety.variety_name : '',
                  "variety_id": el && el.variety_id ? el.variety_id : '',
                  "variety_code": el && el.variety_code ? el.variety_code : '',
                  "indent_qunatity": el && el.indent_quantity ? el.indent_quantity : '',
                  "not_date": el && el.m_crop_variety && el.m_crop_variety.not_date ? el.m_crop_variety.not_date : '',
                }
              ]


            });
          }
        }
      });



      // data = await indentOfSpaModel.findAll(condition);

      if (filteredData) {
        return response(res, status.DATA_AVAILABLE, 200, filteredData)
      } else {
        return response(res, "Data Not Found", 200, {})
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static getindentorCroplist = async (req, res) => {
    let data = {};
    try {
      let condition = {
        where: {
          [Op.and]: [
            {
              year: {
                [Op.eq]: req.body.search.year
              }

            },
            {
              season: {
                [Op.eq]: req.body.search.season
              }

            },
            {
              crop_type: {
                [Op.eq]: req.body.search.crop_type
              }

            },



          ]
        },
        include: [
          {
            model: cropModel,
            attributes: []
          },
          {
            model: agencyDetailModel,
            attributes: [],
            where: {

              id: {
                [Op.in]: req.body.search.spaName
              }


            }
          }

        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('m_crop.crop_name')), 'crop_name'],
          [sequelize.col('m_crop.crop_code'), 'crop_code'],
        ],
        group: [
          [sequelize.col('m_crop.crop_name'), 'crop_name'],
          [sequelize.col('m_crop.crop_code'), 'crop_code'],

        ],
        left: false,
        raw: true,


      };
      if (req.body && req.body.search) {
        if (req.body.search.type) {
          if (req.body.search.type == "indenter") {
            condition.where.state_code = req.body.loginedUserid.state_id;
          }
        }
      }
      condition.order = [[(sequelize.col('m_crop.crop_name', 'ASC'))]];
      data = await indentOfSpaModel.findAll(condition);

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
  static getindentorCroplistindentor = async (req, res) => {
    let data = {};
    try {
      let condition = {
        where: {
          [Op.and]: [
            {
              year: {
                [Op.eq]: req.body.search.year
              }

            },
            {
              season: {
                [Op.eq]: req.body.search.season
              }

            },
            {
              crop_type: {
                [Op.eq]: req.body.search.crop_type
              }

            },



          ]
        },
        include: [
          {
            model: cropModel,
            attributes: []
          },
          {
            model: agencyDetailModel,
            attributes: [],
            where: {

              id: {
                [Op.in]: req.body.search.spaName
              }


            }
          }

        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('m_crop.crop_name')), 'crop_name'],
          [sequelize.col('m_crop.crop_code'), 'crop_code'],
        ],
        group: [
          [sequelize.col('m_crop.crop_name'), 'crop_name'],
          [sequelize.col('m_crop.crop_code'), 'crop_code'],

        ],
        left: false,
        raw: true,


      };
      // if (req.body && req.body.search) {
      //   if (req.body.search.type) {
      //     if (req.body.search.type == "indenter") {
      //       condition.where.state_code = req.body.loginedUserid.state_id;
      //     }
      //   }
      // }
      condition.order = [[(sequelize.col('m_crop.crop_name', 'ASC'))]];
      data = await indentOfBreederseedModel.findAll(condition);

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
  static getIndentorSpaNameBreederSeed = async (req, res) => {
    let data = {};
    try {
      let condition = {
        where: {
          [Op.and]: [
            {
              year: {
                [Op.eq]: req.body.search.year
              }

            },
            {
              season: {
                [Op.eq]: req.body.search.season
              }

            },
            {
              crop_type: {
                [Op.eq]: req.body.search.crop_type
              }

            },


          ]
        },

        include: [
          {
            model: agencyDetailModel,
            // attributes:['id','crop_name','crop_code'],
            attributes: []

          }
        ],
        attributes: [
          // [sequelize.fn('DISTINCT',sequelize.col('bsp_3.production_center_id')), 'production_center_id'],

          [sequelize.col('agency_detail.agency_name'), 'agency_name'],
          [sequelize.col('agency_detail.id'), 'id'],
        ],
        group: [

          [sequelize.col('agency_detail.agency_name'), 'agency_name'],
          [sequelize.col('agency_detail.id'), 'id'],
        ],


      };

      if (req.body.search) {
        if (req.body.search.type) {
          if (req.body.search.type == "indenter") {
            condition.where.state_code = req.body.loginedUserid.state_id;
          }
        }

      }
      // condition.order = [[sequelize.col('m_crop.crop_name'), 'ASC']];
      data = await indentOfSpaModel.findAll(condition);

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
  static getIndentorSpaNameBreederSeedIndentor = async (req, res) => {
    let data = {};
    try {
      let condition = {
        where: {
          [Op.and]: [
            {
              year: {
                [Op.eq]: req.body.search.year
              }

            },
            {
              season: {
                [Op.eq]: req.body.search.season
              }

            },
            {
              crop_type: {
                [Op.eq]: req.body.search.crop_type
              }

            },


          ]
        },

        include: [
          {
            model: agencyDetailModel,
            // attributes:['id','crop_name','crop_code'],
            attributes: []

          }
        ],
        attributes: [
          // [sequelize.fn('DISTINCT',sequelize.col('bsp_3.production_center_id')), 'production_center_id'],

          [sequelize.col('agency_detail.agency_name'), 'agency_name'],
          [sequelize.col('agency_detail.id'), 'id'],
        ],
        group: [

          [sequelize.col('agency_detail.agency_name'), 'agency_name'],
          [sequelize.col('agency_detail.id'), 'id'],
        ],


      };


      // condition.order = [[sequelize.col('m_crop.crop_name'), 'ASC']];
      data = await indentOfBreederseedModel.findAll(condition);

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
  static getAllocatedDistrict = async (req, res) => {
    let data = {};
    try {
      let condition = {
        where: {
          [Op.and]: [
            {
              id: {
                [Op.in]: req.body.search.name_id
              }

            },



          ]
        },





      };


      // condition.order = [[sequelize.col('m_crop.crop_name'), 'ASC']];
      data = await agencyDetailModel.findAll(condition);

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
  static getStatusofLiftingyear = async (req, res) => {
    let data = {};
    try {

      let condition = {



        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('year')), 'year'],
        ],

      };

      condition.order = [[sequelize.col('year'), 'DESC']];
      data = await indentOfBreederseedModel.findAll(condition);

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
  static getStatusofLiftingySeason = async (req, res) => {
    let data = {};
    try {

      let condition = {
        where: {
          year: req.body.search.year

        },



        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('season')), 'season'],
        ],

      };

      condition.order = [[sequelize.col('season'), 'ASC']];
      data = await indentOfBreederseedModel.findAll(condition);

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
  static getStatusofLiftingCropType = async (req, res) => {
    let data = {};
    try {

      let condition = {
        where: {
          year: req.body.search.year,
          season: req.body.search.season

        },



        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('crop_type')), 'crop_type'],
        ],

      };

      condition.order = [[sequelize.col('crop_type'), 'ASC']];
      data = await indentOfBreederseedModel.findAll(condition);

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
  static getStatusofLiftingNonLiftingData = async (req, res) => {

    try {
      let cropCodeValue;
      let varietyCodeValue;
      if (req.body && req.body.searchData) {
        if (req.body.searchData.crop_name_new && req.body.searchData.crop_name_new !== undefined && req.body.searchData.crop_name_new.length > 0) {
          cropCodeValue = { crop_code: { [Op.in]: req.body.searchData.crop_name_new } }
          console.log('cropCodeValue=================', cropCodeValue);
        } else {
          if (req.body.searchData.crop_name)
            cropCodeValue = { crop_code: req.body.searchData.crop_name }
        }

        if (req.body && req.body.searchData && req.body.searchData.variety_id_new && req.body.searchData.variety_id_new !== undefined && req.body.searchData.variety_id_new.length > 0) {
          varietyCodeValue = { variety_id: { [Op.in]: req.body.searchData.variety_id_new } }
          console.log('varietyCodeValue============', varietyCodeValue);
        } else {
          if (req.body.searchData.variety_id)
            varietyCodeValue = { variety_id: req.body.searchData.variety_id }
        }
      }

      let condition = {};
      if (req.body.searchData.crop_name_new) {
        if (req.body.searchData.variety_id_new) {
          condition = {
            where: {
              year: req.body.searchData.year,
              season: req.body.searchData.season,
              crop_type: req.body.searchData.crop_type,
              // crop_code: req.body.searchData.crop_name,
              // variety_id: req.body.searchData.variety_id,
              ...cropCodeValue,
              ...varietyCodeValue
            },
            include: [
              {
                model: agencyDetailModel,
                attributes: ['agency_name', 'id', 'user_id']
              },
              {
                model: varietyModel,
                attributes: ['variety_name', 'id']
              }
            ]
          };
        }
        else {
          condition = {
            where: {
              year: req.body.searchData.year,
              season: req.body.searchData.season,
              crop_type: req.body.searchData.crop_type,
              // crop_code: req.body.searchData.crop_name,
              ...cropCodeValue,
              ...varietyCodeValue
            },
            include: [
              {
                model: agencyDetailModel,
                attributes: ['agency_name', 'id', 'user_id']
              },
              {
                model: varietyModel,
                attributes: ['variety_name', 'id']
              }
            ]
          };
        }
      } else {
        condition = {
          where: {
            year: req.body.searchData.year,
            season: req.body.searchData.season,
            crop_type: req.body.searchData.crop_type,
            ...cropCodeValue,
            ...varietyCodeValue
          },
          include: [
            {
              model: agencyDetailModel,
              attributes: ['agency_name', 'id', 'user_id']
            },
            {
              model: varietyModel,
              attributes: ['variety_name', 'id']
            }
          ]
        };
      }
      let data = await indentOfBreederseedModel.findAll(condition);
      let spaData = await indentOfSpaModel.findAll({
        where: {
          year: req.body.searchData.year,
          season: req.body.searchData.season,
          crop_type: req.body.searchData.crop_type,
          // crop_code: req.body.searchData.crop_name,
          // variety_id: req.body.searchData.variety_id,
          ...cropCodeValue,
          ...varietyCodeValue
        },
        include: [
          {
            model: userModel,
            required: true,
            attributes: []
          },
          {
            model: allocationToSPAProductionCenterSeed,
            //   on: {
            //     spa_code: sequelize.where(sequelize.col("indent_of_spas.spa_code"), "=", sequelize.col("allocation_to_spa_for_lifting_seed_production_cnters.spa_code")),
            //     state_code: sequelize.where(sequelize.col("indent_of_spas.state_code"), "=", sequelize.col("allocation_to_spa_for_lifting_seed_production_cnters.state_code"))
            // },
            where: {
              state_code: {
                [Op.eq]: sequelize.col("indent_of_spas.state_code")
              }

            },
            attributes: [],
            required: true
          }
        ],
        attributes: [
          [sequelize.col('user.name'), 'spa_name'],
          [sequelize.col('user.user_type'), 'user_type'],
          [sequelize.col('indente_breederseed_id'), 'indente_breederseed_id'],
          [sequelize.col('crop_code'), 'crop_code'],
          [sequelize.col('variety_id'), 'variety_id'],

        ],
        raw: true,
        required: true
        // group:[
        //   [sequelize.col('crop_code'),'crop_code'],
        //    [sequelize.col('user.name'),'spa_name'],
        //    [sequelize.col('indente_breederseed_id'),'indente_breederseed_id'],
        //   [sequelize.col('variety_id'),'variety_id'],
        // ]
      })
      if (data && data.length > 0) {
        if (spaData && spaData.length > 0) {
          spaData.forEach(el => {
            data.forEach((item, i) => {
              if (item.crop_code == el.crop_code && item.variety_id == el.variety_id && item.id == el.indente_breederseed_id) {
                data[i].spaName = el && el.spa_name ? el.spa_name : ''
              }

            })
          })
        }

      }
      let prodData = await db.lotNumberModel.findAll(
        {
          where: {
            year: req.body.searchData.year,
            season: req.body.searchData.season,
            crop_code: {
              [Op.like]: req.body.searchData.crop_type ? (req.body.searchData.crop_type.substring(0, 1)).toUpperCase() + '%' : ''
            },
            // crop_code: req.body.searchData.crop_name,
            // variety_id: req.body.searchData.variety_id,
            ...cropCodeValue,
            ...varietyCodeValue
          },
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
            [sequelize.fn('SUM', sequelize.col('lot_number_size')), 'lot_number_size'],
          ],
          group: [
            [sequelize.col('lot_number_creations.crop_code'), 'crop_code'],
            [sequelize.col('lot_number_creations.variety_id'), 'variety_id'],
          ]
        }
      )

      if (data && data.length > 0) {
        if (prodData && prodData.length > 0) {
          prodData.forEach(el => {
            data.forEach((item, i) => {
              if (item.crop_code == el.crop_code && item.variety_id == el.variety_id) {
                data[i].productionQty = el && el.lot_number_size ? parseFloat(el.lot_number_size) : 0
              }

            })
          })
        }

      }

      let filteredData = []
      data.forEach(el => {
        const spaIndex = filteredData.findIndex(item => item.crop_code === el.crop_code);
        if (spaIndex === -1) {
          filteredData.push({
            "crop_name": el.crop_name,
            "crop_code": el.crop_code,
            "total_indent": el.indent_quantity,
            "total_indent_qty": 0,
            "total_spa_count": 1,
            "variety": [
              {
                variety_name: el.m_crop_variety.variety_name,
                variety_id: el.m_crop_variety.id,
                "total_indent_qty": el.indent_quantity,
                productionQty: el && el.productionQty ? parseFloat(el.productionQty) : 0,
                "spa_count": 1,
                "spas": [
                  {
                    spaName: el && el.spaName ? el.spaName : '',
                    agency_name: el && el.agency_detail && el.agency_detail.agency_name ? el.agency_detail.agency_name : '',
                    user_id: el && el.agency_detail && el.agency_detail.user_id ? el.agency_detail.user_id : '',
                    id: el && el.agency_detail && el.agency_detail.id ? el.agency_detail.id : '',
                    indentor: []
                  }
                ]
              }
            ]
          });
        } else {
          const cropIndex = filteredData[spaIndex].variety.findIndex(item => item.variety_id == el.m_crop_variety.id);
          if (cropIndex !== -1) {
            filteredData[spaIndex].variety[cropIndex].spas.push(
              {
                spaName: el && el.spaName ? el.spaName : '',
                agency_name: el && el.agency_detail && el.agency_detail.agency_name ? el.agency_detail.agency_name : '',
                user_id: el && el.agency_detail && el.agency_detail.user_id ? el.agency_detail.user_id : '',
                id: el && el.agency_detail && el.agency_detail.id ? el.agency_detail.id : '',
                indentor: []
              }
            );
          } else {
            filteredData[spaIndex].crop_total_indent = parseFloat(parseFloat(filteredData[spaIndex].crop_total_indent) + parseFloat(el.indent_quantity)).toFixed(2);
            filteredData[spaIndex].total_indent = parseFloat(el.indent_quantity) + parseFloat(el.indent_quantity).toFixed(2);
            filteredData[spaIndex].variety_count = filteredData[spaIndex].variety_count + 1;
            filteredData[spaIndex].total_spa_count = filteredData[spaIndex].total_spa_count + 1;
            filteredData[spaIndex].total_spa_count = filteredData[spaIndex].total_spa_count + 1;
            filteredData[spaIndex].variety.push({
              variety_name: el.m_crop_variety.variety_name,
              variety_id: el.m_crop_variety.id,
              "total_indent": 0,
              "spa_count": 1,
              productionQty: el && el.productionQty ? parseFloat(el.productionQty) : 0,
              "total_indent_qty": el.indent_quantity,
              "spas": [
                {
                  spaName: el && el.spaName ? el.spaName : '',
                  agency_name: el && el.agency_detail && el.agency_detail.agency_name ? el.agency_detail.agency_name : '',
                  user_id: el && el.agency_detail && el.agency_detail.user_id ? el.agency_detail.user_id : '',
                  id: el && el.agency_detail && el.agency_detail.id ? el.agency_detail.id : '',
                  indentor: []
                }
              ]
            });
          }
        }
      });

      const totalVarietyData = await Promise.all(filteredData.map(async item => {

        const data = Promise.all(item.variety.map(async element => {

          const AllocatedData = await labelNumberForBreederseed.findAll({
            attributes: ['id', 'crop_code', 'variety_id'],
            include: [
              {
                model: generatedLabelNumberModel,
                attributes: ['weight'],
              }
            ],
            where: {
              year_of_indent: req.body.searchData.year,
              season: req.body.searchData.season,
              // crop_type:req.body.searchData.crop_type,
              // crop_code: item.crop_code,
              // variety_id: element.variety_id
              ...cropCodeValue,
              ...varietyCodeValue
            },

          })
          return AllocatedData
        }))
        return data;
      }))
      const totalIndentData = await Promise.all(filteredData.map(async item => {

        const data = Promise.all(item.variety.map(async element => {

          const IndentedData = await indentOfBreederseedModel.findAll({
            attributes: ['indent_quantity', 'crop_code', 'variety_id'],
            // include:[
            //   {
            //     model:generatedLabelNumberModel,
            //     attributes:['weight'],
            //   }
            // ],
            where: {
              year: req.body.searchData.year,
              season: req.body.searchData.season,
              // crop_type:req.body.searchData.crop_type,
              // crop_code: item.crop_code,
              // variety_id: element.variety_id
              ...cropCodeValue,
              ...varietyCodeValue


            },

          })
          return IndentedData
        }))
        return data
        // totalLabels = ProductionData.reduce((acc, label) => acc + Number(label.indent_quantity, 10), 0)
      }))

      const quantityLifttedData = await Promise.all(filteredData.map(async item => {
        const data = Promise.all(item.variety.map(async element => {
          const IndentedData = await generatBillsModel.findAll({
            include: [
              {
                model: indentOfBreederseedModel,
                attributes: [],
                include: [
                  {
                    model: agencyDetailModel,
                    attributes: []
                  }
                ]
              }
            ],
            attributes: ['total_quantity', 'crop_code', 'variety_id',
              [sequelize.col('indent_of_breederseed->agency_detail.id'), 'agency_id'],
              ['user_id', 'spa_generbillId']

            ],

            where: {
              year: req.body.searchData.year,
              season: req.body.searchData.season,
              // crop_type:req.body.searchData.crop_type,
              // crop_code: item.crop_code,
              // variety_id: element.variety_id

              ...cropCodeValue,
              ...varietyCodeValue

            },

          })
          return IndentedData
        }))
        return data
      }))

      // const allocationTOSpaforLiftinData = await Promise.all(filteredData.map(async item => {
      //   const allocateedSpaData = Promise.all(item.variety.map(async element => {
      //     const spaData = await indentOfSpaModel.findAll({
      //       // include:[
      //       //   {
      //       //     model:agencyDetailModel,
      //       //     // attributes:[],
      //       //     include:[
      //       //       {
      //       //         model:alloca,

      //       //         // attributes:[

      //       //         // ],


      //       //       }
      //       //     ]

      //       //   }
      //       // ],
      //     //   attributes:['year','crop_code','season',
      //     //   [sequelize.col('agency_detail.id'), 'id'],
      //     //   [sequelize.col('agency_detail.agency_name'), 'agency_name'],
      //     //   // [sequelize.col('agency_detail->indent_of_spa.user_id'), 'spa_userid'],
      //     //   // [sequelize.col('agency_detail.user_id'), 'agency_userid'],
      //     //   [sequelize.col('agency_detail->indent_of_spa->user.name'), 'name'],
      //     //   // [sequelize.col('agency_detail->indent_of_spa.user'), 'spa_userid'],
      //     //   'variety_id'
      //     //   // [sequelize.col('agency_detail->indent_of_spa.id'), 'id'],
      //     // ],
      //       // attributes: ['total_quantity', 'crop_code', 'variety_id', 'user_id', 'id'],
      //       // include:[
      //       //   {
      //       //     model:generatedLabelNumberModel,
      //       //     attributes:['weight'],
      //       //   }
      //       // ],
      //       where: {
      //         year: req.body.searchData.year,
      //         season: req.body.searchData.season,
      //         // crop_type:req.body.searchData.crop_type,
      //         crop_code: item.crop_code,
      //         variety_id: element.variety_id



      //       },

      //     })
      //     return spaData
      //   }))
      //   return allocateedSpaData
      // }))
      const updatedData = {
        filteredData: filteredData,
        totalVarietyData: totalVarietyData,
        totalIndentData: totalIndentData,
        quantityLifttedData: quantityLifttedData,
        // allocationTOSpaforLiftinData:allocationTOSpaforLiftinData
      }

      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, updatedData)
      } else {
        return response(res, "Data Not Found", 200, {})
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static calculateSumAndRemoveDuplicates(jsonArray) {
    let uniqueValues = new Set();
    let totalSum = 0;
    // Iterate over each element in the JSON array
    for (let i = 0; i < jsonArray.length; i++) {
      let element = jsonArray[i];
      console.log(jsonArray[i], 'jsonArray')

      // Convert the element to a JSON string for comparison
      let elementJson = JSON.stringify(element);

      // If the JSON representation is unique, add it to the set and sum
      if (!uniqueValues.has(element)) {
        uniqueValues.add(element);
        totalSum += element.value; // Assuming each element has a 'value' property
      }
    }

    return totalSum;
  }
  static getStatusofLiftingNonLiftingDataSecond = async (req, res) => {
    let data = {};
    try {
      let cropValue = ``;
      let varietyValue = ``;
      if (req.body.crop_name_new && req.body.crop_name_new !== undefined && req.body.crop_name_new.length > 0) {
        let cropCodeId = [];
        req.body.crop_name_new.forEach(ele => {
          cropCodeId.push(`'` + ele + `'`);
        });
        cropValue = `AND "indent_of_spas"."crop_code" IN (${cropCodeId})`
      }
      if (req.body.variety_id_new && req.body.variety_id_new !== undefined && req.body.variety_id_new.length > 0) {
        let varietyId = [];
        req.body.variety_id_new.forEach(ele => {
          varietyId.push(ele.toString());
        })
        varietyValue = `AND "indent_of_spas"."variety_id" IN (${varietyId})`
      }

      data = await db.sequelize.query(`SELECT "indent_of_spas"."id",
      "users"."id" AS "spa_id",
      "agency_details"."id" AS "agency_detailsID", "m_crop"."crop_name" AS "crop_name", "m_crop"."crop_code" AS "crop_code", "m_crop_variety"."variety_name" AS "variety_name", "indent_of_spas"."variety_id" AS "variety_id", "indent_of_spas"."indent_quantity" AS "indent_quantity", "allocation_to_spa_for_lifting_seed_production_cnter"."qty" AS "qty", "allocation_to_spa_for_lifting_seed_production_cnter->user"."name" AS "name", "allocation_to_spa_for_lifting_seed_production_cnter->user"."id" AS "id", "indent_of_spas"."crop_type" AS "crop_type", 
      "m_district"."district_name" AS 
      "district_name" FROM "indent_of_spas" AS "indent_of_spas" 
      LEFT OUTER JOIN "m_crops" AS "m_crop" ON "indent_of_spas"."crop_code" = "m_crop"."crop_code"       
      LEFT OUTER JOIN "users" AS "users" ON "indent_of_spas"."user_id" = "users"."id"
      LEFT OUTER JOIN "users" AS "users" ON "indent_of_spas"."user_id" = "users"."id"         
      LEFT OUTER JOIN "m_crop_varieties" AS "m_crop_variety" ON "indent_of_spas"."variety_id" = "m_crop_variety"."id" 
       LEFT OUTER JOIN "allocation_to_spa_for_lifting_seed_production_cnters" AS "allocation_to_spa_for_lifting_seed_production_cnter" ON "indent_of_spas"."spa_code" = "allocation_to_spa_for_lifting_seed_production_cnter"."spa_code" AND "indent_of_spas"."state_code" = "allocation_to_spa_for_lifting_seed_production_cnter"."state_code"::Integer
       LEFT OUTER JOIN "users" AS "allocation_to_spa_for_lifting_seed_production_cnter->user" ON "allocation_to_spa_for_lifting_seed_production_cnter"."production_center_id" = "allocation_to_spa_for_lifting_seed_production_cnter->user"."id" 
       LEFT OUTER JOIN "agency_details" AS "agency_details" On agency_details.state_id = "allocation_to_spa_for_lifting_seed_production_cnter"."state_code"           
       LEFT OUTER JOIN "m_districts" AS "m_district" ON "agency_details"."district_id" = "m_district"."district_code"
       WHERE ("indent_of_spas"."year" = '${req.body.year}' AND "indent_of_spas"."season" = '${req.body.season}' AND "indent_of_spas"."crop_type" = '${req.body.crop_type}' ${cropValue} ${varietyValue}
       )`);
      data = data[0]
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
  static getStatusofLiftingCrop = async (req, res) => {
    let data = {};
    try {

      let condition = {
        where: {
          year: req.body.search.year,
          season: req.body.search.season,
          crop_type: req.body.search.crop_type

        },
        include: [
          {
            model: cropModel
          }

        ],


        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('m_crop.crop_code')), 'crop_code'],
          'crop_name'
        ],
        raw: true

      };

      condition.order = [[sequelize.col('m_crop.crop_code'), 'ASC']];
      data = await indentOfBreederseedModel.findAll(condition);

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
  static getStatusofLiftingVariety = async (req, res) => {
    let data = {};
    try {
      let cropCodeValue;
      if (req.body && req.body.search && req.body.search.crop_code_new !== undefined && req.body.search.crop_code_new.length > 0) {
        cropCodeValue = { crop_code: { [Op.in]: req.body.search.crop_code_new } }
      } else {
        cropCodeValue = { crop_code: req.body.search.crop_code }
      }
      let condition = {
        where: {
          year: req.body.search.year,
          season: req.body.search.season,
          crop_type: req.body.search.crop_type,
          // crop_code: req.body.search.crop_code,
          ...cropCodeValue
        },
        include: [
          {
            model: varietyModel
          }

        ],


        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('m_crop_variety.id')), 'id'],
          'variety_name'
        ],
        raw: true

      };

      condition.order = [[sequelize.col('m_crop_variety.id'), 'ASC']];
      data = await indentOfBreederseedModel.findAll(condition);

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
  static getSeedVarietyCropGroupData = async (req, res) => {

    let returnResponse = {};
    try {
      let condition = {
        include: [
          {
            model: cropModel,
            attributes: [],
            include: [
              {
                model: cropGroupModel,
                attributes: [],
              }
            ]
          },

        ],
        where: {
          [Op.and]: [
            {
              crop_group_code: {
                [Op.ne]: null
              }

            },
            {
              crop_group_code: {
                [Op.ne]: ""
              }

            }

          ]
        },
        attributes: [
          // [sequelize.fn('DISTINCT', sequelize.col('m_crop->m_crop_group.group_code')), 'group_code'],
          // [sequelize.fn('DISTINCT', sequelize.col('m_crop->m_crop_group.group_code')), 'group_code'],
          [sequelize.col('m_crop->m_crop_group.group_code'), 'group_code'],
          [sequelize.col('m_crop->m_crop_group.group_name'), 'group_name'],
          // 'id'

        ],
        group: [
          [sequelize.col('m_crop->m_crop_group.group_code'), 'group_code'],
          [sequelize.col('m_crop->m_crop_group.group_name'), 'group_name'],
          // [sequelize.col('m_crop_varieties.id'), 'id'],
        ],
        get group() {
          return this._group;
        },
        set group(value) {
          this._group = value;
        },
        // m_crop->m_crop_group
      };

      let { search } = req.body;

      if (search) {
        condition.where = {};
        if (search.isNotified) {
          condition.where.is_notified = search.isNotified;
        }
        if (req.body.search.type == 'reporticar') {
          if (req.body.search.user_type == 'ICAR') {
            condition.where.crop_code = {
              [Op.or]: [
                { [Op.like]: 'A' + "%" },
              ]
            }

          } if (req.body.search.user_type == 'HICAR') {
            condition.where.crop_code = {
              [Op.or]: [
                { [Op.like]: 'H' + "%" },
              ]
            }
          }

          // condition.where.crop_group = (req.body.search.crop_name_data);
        }
      }
      condition.order = [[sequelize.col('m_crop->m_crop_group.group_name'), 'ASC']];

      let data = await varietyModel.findAndCountAll(condition);


      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 200)
      }



    }
    catch (error) {
      console.log(error);
      return response(res, status.DATA_NOT_SAVE, 500, error);
    }
  }


  static getIndentorCropWiseBreederSeedindentor = async (req, res) => {
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
            attributes: ['id', 'crop_name', 'crop_code'],
          },
          {
            model: varietyModel,
            attributes: ['variety_name', 'not_date']
          },

          {
            model: userModel,
            include: [{
              model: agencyDetailModel,
              attributes: ['agency_name', 'id']
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
          [sequelize.col('indent_of_breederseeds.crop_code'), 'crop_code'],
          [sequelize.col('indent_of_breederseeds.indent_quantity'), 'indent_quantity'],
          [sequelize.col('m_crop.crop_name'), 'crop_name'],
          [sequelize.col('m_crop_variety.variety_code'), 'variety_code'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [sequelize.col('m_crop_variety.id'), 'variety_id'],
          [sequelize.col('m_crop_variety.not_date'), 'not_date'],
          [sequelize.col('user->agency_detail.agency_name'), 'agency_name'],
          [sequelize.col('user->agency_detail.id'), 'agency_id'],
          [sequelize.col('user->agency_detail.state_id'), 'state_code'],
          [sequelize.col('user.spa_code'), "spa_code"],
        ],
      };

      condition.order = [[sequelize.col('m_crop.crop_name'), 'ASC'], [sequelize.col('m_crop_variety.variety_name'), 'ASC']];

      data = await indentOfBreederseedModel.findAll(condition);

      // console.log("datadatadata -------", data)
      let filteredData = []
      data.forEach(el => {
        const spaIndex = filteredData.findIndex(item => item.crop_code === el.crop_code);
        if (spaIndex === -1) {
          filteredData.push({
            "crop_name": el.m_crop.crop_name,
            "crop_code": el.crop_code,
            "crop_total_indent": el.indent_quantity,
            "variety_count": 1,
            "total_spa_count": 1,
            "variety": [
              {
                "name": el.variety_name,
                "variety_id": el.variety_id,
                "variety_code": el.variety_code,
                "variety_name": el.m_crop_variety.variety_name,
                "not_date": el.m_crop_variety.not_date,
                "total_indent": el.indent_quantity,
                "spa_count": 1,
                "spas": [
                  {
                    "name": el && el.user && el.user.agency_detail && el.user.agency_detail.agency_name ? el.user.agency_detail.agency_name : '',
                    "spa_code": el.spa_code,
                    "state_code": el.state_code,
                    "agencyid": el && el.user && el.user.agency_detail && el.user.agency_detail.id ? el.user.agency_detail.id : '',
                    // "sector": "ABC",
                    "indent_qunatity": el.indent_quantity
                  }
                ]
              }
            ]
          });
        } else {
          // console.log('filteredData88888888888',el.agency_name, filteredData[spaIndex]);
          const cropIndex = filteredData[spaIndex].variety.findIndex(item => item.variety_code === el.variety_code);
          //	          const spaIndex = filteredData.findIndex(item => item.state_code === el.state_code && item.spa_code === el.spa_code );

          if (cropIndex !== -1) {
            // console.log('>>>>', cropIndex);
            filteredData[spaIndex].crop_total_indent = parseFloat(parseFloat(filteredData[spaIndex].crop_total_indent) + parseFloat(el.indent_quantity)).toFixed(2);

            filteredData[spaIndex].variety[cropIndex].total_indent = parseFloat(parseFloat(filteredData[spaIndex].variety[cropIndex].total_indent) + parseFloat(el.indent_quantity)).toFixed(2);
            filteredData[spaIndex].variety[cropIndex].variety_count = parseFloat(parseFloat(filteredData[spaIndex].variety[cropIndex].total_indent) + parseFloat(el.indent_quantity)).toFixed(2);
            // filteredData[spaIndex].variety_count  = filteredData[spaIndex].variety_count + 1;
            filteredData[spaIndex].variety[cropIndex].spa_count = filteredData[spaIndex].variety[cropIndex].spa_count + 1;
            filteredData[spaIndex].total_spa_count = filteredData[spaIndex].total_spa_count + 1;

            filteredData[spaIndex].variety[cropIndex].spas.push(
              {
                "name": el && el.user && el.user.agency_detail && el.user.agency_detail.agency_name ? el.user.agency_detail.agency_name : '',
                "spa_code": el.spa_code,
                "state_code": el.state_code,
                "agencyid": el && el.user && el.user.agency_detail && el.user.agency_detail.id ? el.user.agency_detail.id : '',
                // "sector": "ABC",
                "indent_qunatity": el.indent_quantity
              }
            );
          } else {
            // console.log("fil/teredDataaaaaaaaaaaaa", filteredData)
            filteredData[spaIndex].crop_total_indent = parseFloat(parseFloat(filteredData[spaIndex].crop_total_indent) + parseFloat(el.indent_quantity)).toFixed(2);
            filteredData[spaIndex].variety_count = filteredData[spaIndex].variety_count + 1;
            filteredData[spaIndex].total_spa_count = filteredData[spaIndex].total_spa_count + 1;

            filteredData[spaIndex].variety.push({
              "name": el.variety_name,
              "variety_id": el.variety_id,
              "variety_code": el.variety_code,
              "variety_name": el.m_crop_variety.variety_name,
              "not_date": el.m_crop_variety.not_date,
              "total_indent": el.indent_quantity,
              "spa_count": 1,
              "spas": [
                {
                  "name": el && el.user && el.user.agency_detail && el.user.agency_detail.agency_name ? el.user.agency_detail.agency_name : '',
                  "spa_code": el.spa_code,
                  "state_code": el.state_code,
                  "agencyid": el && el.user && el.user.agency_detail && el.user.agency_detail.id ? el.user.agency_detail.id : '',
                  "indent_qunatity": el.indent_quantity
                }
              ]
            });
          }
        }
      });

      // console.log("filteredDatafilteredDatafilteredData", filteredData);
      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, filteredData)
      } else {
        return response(res, "Data Not Found", 200, {})
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getindentorCropGrouplistindentor = async (req, res) => {
    let data = {};
    try {

      let condition = {
        where: {
          year: req.body.search.year,
          season: req.body.search.season,
          crop_type: req.body.search.crop_type

        },
        include: [
          {
            model: cropModel,
            // attributes:['id','crop_name','crop_code'],


          }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('m_crop.crop_name')), 'crop_name'],
          'crop_code'

        ],
        raw: true

      };

      condition.order = [[sequelize.col('m_crop.crop_name'), 'ASC']];
      data = await indentOfBreederseedModel.findAll(condition);

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

  static getindentorVarietylistNewIndentor = async (req, res) => {
    let data = {};
    try {
      let stateCode = {};


      let condition = {
        where: {
          [Op.and]: [
            {
              year: {
                [Op.eq]: req.body.search.year
              }

            },
            {
              season: {
                [Op.eq]: req.body.search.season
              }

            },
            {
              crop_type: {
                [Op.eq]: req.body.search.crop_type
              }

            },
            {
              crop_code: {
                [Op.in]: req.body.search.crop_code
              }

            },
            stateCode
          ]
        },

        include: [
          {
            model: varietyModel,
            // attributes:['id','crop_name','crop_code'],
            attributes: []
          }

        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('m_crop_variety.variety_code')), 'variety_code'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [sequelize.col('m_crop_variety.id'), 'id']
        ],
        raw: true,
      };

      // condition.order = [[sequelize.col('m_crop.crop_name'), 'ASC']];
      data = await indentOfBreederseedModel.findAll(condition);

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


  static getMasterBspOneReportDataSecond = async (req, res) => {
    let returnResponse = {};
    try {

      let condition = {
        include: [
          {
            model: bsp1ProductionCenter,
            required: true,
            // attributes: ['bsp_1_id', 'members', ['quantity_of_seed_produced', 'target']],
            attributes: [],
            include: [
              {
                model: nucleusSeedAvailabityModel,
                left: true,
                attributes: [],

                // attributes: ['quantity']
              },
              {
                model: userModel,
                required: true,
                attributes: [],

                // attributes: ['quantity']
              },
            ]
          },
          {
            model: indentOfBreederseedModel,
            required: true,
            attributes: [],
            where: {
              // year:
              // season:
            }
            // include: [
            //   {
            //     model: agencyDetailModel,
            //     // attributes: [['contact_person_name', 'co_per_name'], 'agency_name', ['contact_person_designation', 'co_per_desig']],
            //     left: true,
            //     include: [{
            //       model: userModel,
            //       left: true,
            //       // where: searchData['searchBreederBspc'], //filters
            //     },
            //     {
            //       model: designationModel,
            //       left: true,
            //       // attributes: ['id', 'name']
            //     }
            //     ]
            //   }
            // ]
          },
          {
            model: cropVerietyModel,
            required: true,
            attributes: [],

            // raw:true,
            // attributes: ['variety_name'],
            // where: searchData['searchVarietyCrop'], //filters

          },
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('bsp1_production_centers->user.name')), 'bspc_name'],

          [sequelize.fn('SUM', sequelize.col('bsp1_production_centers.quantity_of_seed_produced')), 'quantity_of_seed_produced'],

          [sequelize.col('bsp_1s.variety_id'), 'variety_id'],
          [sequelize.col('bsp_1s.year'), 'year'],
          [sequelize.col('bsp_1s.season'), 'season'],
          [sequelize.col('bsp1_production_centers->user.id'), 'bspc_id'],

          // [sequelize.fn('SUM', sequelize.col('indent_of_spas.indent_quantity')), 'indent_quantity'],
          // [sequelize.col('user.name'), 'spa_name'],
          // [sequelize.col('bsp1_production_centers->nucleus_seed_availability.quantity'), 'nucleus_quantity'],
          // [sequelize.col('bsp1_production_centers->user.name'), 'bspc_name'],
          [sequelize.col('indent_of_breederseed".indent_quantity'), 'indent_quantity'],
          // [sequelize.fn('SUM',sequelize.col('bsp1_production_centers->nucleus_seed_availability.quantity')), 'nucleus_quantity'],
          [sequelize.fn('SUM', sequelize.col('bsp1_production_centers->nucleus_seed_availability.quantity')), 'nucleus_quantity'],
          [sequelize.col('m_crop_variety.variety_code'), 'variety_code'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          // [sequelize.col('m_crop_variety.introduce_year'), 'notification_year'],

        ],
        group: [
          [sequelize.col('bsp_1s.variety_id'), 'variety_id'],
          // [sequelize.col('bsp1_production_centers->nucleus_seed_availability.'), 'spa_code'],
          // [sequelize.col('user.name'), 'spa_name'],
          [sequelize.col('bsp_1s.year'), 'year'],
          [sequelize.col('bsp_1s.season'), 'season'],
          [sequelize.col('indent_of_breederseed".indent_quantity'), 'indent_quantity'],
          // [sequelize.col('bsp1_production_centers->nucleus_seed_availability.quantity'), 'nucleus_quantity'],
          [sequelize.col('bsp1_production_centers->user.name'), 'bspc_name'],
          [sequelize.col('bsp1_production_centers->user.id'), 'bspc_id'],
          // [sequelize.col('bsp1_production_centers.quantity_of_seed_produced'), 'quantity_of_seed_produced'],
          [sequelize.col('m_crop_variety.variety_code'), 'variety_code'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          // [sequelize.col('m_crop_variety.introduce_year'), 'notification_year'],
        ],
        raw: true
      }
      // condition
      // let bsp1Data = await bsp1Model.findAll(condition);
      // let variety = ['H0125001'];
      // let crop = ["H0125"];
      let season = "";
      let year = "";
      let crop_type = "";
      let crop = [];
      let variety = [];

      // variety.forEach(element=>{

      // })
      if (req.body.search) {
        if (req.body.search.year) {
          year = req.body.search.year;
        }
        if (req.body.search.season) {
          season = req.body.search.season;
        }
        if (req.body.search.crop_type) {
          crop_type = req.body.search.crop_type
        }
        if (req.body.search.crop != undefined && req.body.search.crop.length > 0) {
          let temp = []
          req.body.search.crop.forEach(ele => {
            temp.push("'" + ele + "'");
          })
          crop = 'AND' + " " + '"bsp_1s"."crop_code"' + 'IN' + "" + '(' + temp.toString() + ')';
        }

        if (req.body.search.variety != undefined && req.body.search.variety.length > 0) {
          let temp = []
          req.body.search.variety.forEach(ele => {
            temp.push("'" + ele + "'");
          })
          variety = 'AND' + " " + '"m_crop_variety"."variety_code"' + 'IN' + "" + '(' + temp.toString() + ')';
        }

      }
      let bsp1Data = await db.sequelize.query(`SELECT indent_data.*,nucleus_seed_availabilities."quantity" FROM (SELECT DISTINCT("bsp1_production_centers->user"."name") AS "bspc_name", bsp_1s."year",bsp_1s."crop_code", bsp_1s."season",SUM("bsp1_production_centers"."quantity_of_seed_produced") AS "quantity_of_seed_produced", "bsp_1s"."variety_id" AS "variety_id", bsp1_production_centers."production_center_id","m_crop_variety"."variety_code" AS "variety_code", "m_crop_variety"."variety_name" AS "variety_name","m_crop"."crop_name" AS "crop_name",SUM("indent_of_breederseed"."indent_quantity") AS indent_quantity FROM "bsp_1s" AS "bsp_1s" INNER JOIN "bsp1_production_centers" AS "bsp1_production_centers" ON "bsp_1s"."id" = "bsp1_production_centers"."bsp_1_id"  INNER JOIN "indent_of_breederseeds" AS "indent_of_breederseed" ON "bsp_1s"."indent_of_breederseed_id" = "indent_of_breederseed"."id" INNER JOIN "users" AS "bsp1_production_centers->user" ON "bsp1_production_centers"."production_center_id" = "bsp1_production_centers->user"."id" INNER JOIN "m_crop_varieties" AS "m_crop_variety" ON "bsp_1s"."variety_id" = "m_crop_variety"."id" INNER JOIN "m_crops" AS "m_crop" ON "bsp_1s"."crop_code" = "m_crop"."crop_code" ${variety} WHERE "bsp_1s"."year" = '${year}' AND "bsp_1s"."crop_code" LIKE '${crop_type}%' AND "bsp_1s"."season" = '${season}' ${[crop]} GROUP BY  bsp_1s."year", bsp_1s."crop_code",bsp_1s."season", "bsp_1s"."variety_id","indent_of_breederseed"."indent_quantity","bsp1_production_centers->user"."name",m_crop.crop_name,"m_crop_variety"."variety_code","m_crop_variety"."variety_name", bsp1_production_centers."production_center_id") AS indent_data LEFT OUTER JOIN nucleus_seed_availabilities ON nucleus_seed_availabilities."production_center_id" = indent_data."production_center_id" AND  nucleus_seed_availabilities."year" = indent_data."year" AND  nucleus_seed_availabilities."season" = indent_data."season" AND  nucleus_seed_availabilities."variety_code" = indent_data."variety_code"`, { replacements: ['active'], type: sequelize.QueryTypes.SELECT });

      returnResponse = bsp1Data;

      let data = [] = returnResponse;

      let dataSet = [];
      let dataSet2 = [];
      let temp;
      let filterData = []
      bsp1Data.forEach((el, index) => {

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
                        "crop_code": el && el.crop_code ? el.crop_code : '',
                        "variety_id": el && el.variety_id ? el.variety_id : '',
                        bspc_id: el && el.production_center_id ? el.production_center_id : '',
                        allocation_qnt: el && el.quantity_of_seed_produced ? el.quantity_of_seed_produced : '',
                        // indent_quantity :el && el.indent_quantity  ? el.indent_quantity  :'',
                        available_nucleus_seed: el && el.quantity ? el.quantity : '',
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
                bspc_id: el && el.production_center_id ? el.production_center_id : '',
                allocation_qnt: el && el.quantity_of_seed_produced ? el.quantity_of_seed_produced : '',
                // indent_quantity :el && el.indent_quantity  ? el.indent_quantity  :'',
                available_nucleus_seed: el && el.quantity ? el.quantity : '',
                "crop_code": el && el.crop_code ? el.crop_code : '',
                "variety_id": el && el.variety_id ? el.variety_id : '',
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
                    bspc_id: el && el.production_center_id ? el.production_center_id : '',
                    allocation_qnt: el && el.quantity_of_seed_produced ? el.quantity_of_seed_produced : '',

                    available_nucleus_seed: el && el.quantity ? el.quantity : '',
                    "crop_code": el && el.crop_code ? el.crop_code : '',
                    "variety_id": el && el.variety_id ? el.variety_id : '',
                  }
                ]
              }
            )
          }
        }

      });

      return response(res, status.DATA_AVAILABLE, 200, filterData);

      // return response(res, status.DATA_AVAILABLE, 200, returnResponse)

    } catch (error) {
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse)
    }

  }

  static testSMS = async (req, res) => {
    try {
      console.log(" req.param", req.params.mobile_number)
      const mobile_number = req.params.mobile_number
      sendSms(mobile_number)

      response(res, "Api Working fine", 200, "Success")
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_SAVE, 500)
    }
  }

  static testSMSPost = async (req, res) => {
    try {
      // signature: 'KISAAN/GOVKCC/GOVKMS/Krishi',
      // dlt_entity_id: '1301157485792044671',
      // dlt_template_id: '1507167040737689031',

      console.log(" req.param", req.body)
      // const {mobile_number, username, pin, signature} = req.body.mobile_number
      sendSms(req.body)

      response(res, "Api Working fine", 200, "Success")
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_SAVE, 500)
    }
  }
  static getStateList = async (req, res) => {
    try {
      let condition = {
        include: [
          {
            model: userModel,
            attributes: [],
            left: true,
            where: {
              'user_type': 'BR'
              // [sequelize.col('user.user_type')]:'IN'
            }
          },
          {
            model: stateModel,
            left: true,
          },
        ],

        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('m_state.state_name')), 'state_name'],
          [sequelize.col('m_state.state_code'), 'state_code']
        ],
        raw: true

      }

      condition.order = [[sequelize.col('m_state.state_name'), 'ASC']];
      let data = await agencyDetailModel.findAndCountAll(condition);


      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      return response(res, status.DATA_NOT_AVAILABLE, 500, error);
    }
  }
  static viewStateData = async (req, res) => {
    let data = {};
    try {
      let condition = {
        where: {
          [Op.and]: [{
            state_name: {
              [Op.ne]: null
            },
          },
          {
            state_name: {
              [Op.ne]: ''
            }
          }
          ]
        }
      };
      // if (req.body.search) {
      //   if (req.body.search.state_code) {
      //     condition.where.state_code = req.body.search.state_code;
      //   }
      // }
      condition.order = [['state_name', 'ASC']];
      data = await stateModel.findAndCountAll(condition);
      // console.log('data==',data);
      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      //console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }


  static getMasterBspTwoReportDataSecondReport = async (req, res) => {
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
          // [sequelize.fn('DISTINCT', sequelize.col('bsp_1->bsp1_production_centers->user.name')), 'bspc_name'],
          [sequelize.col('bsp_1->bsp1_production_centers->user.name'), 'bspc_name'],
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
          [sequelize.col('bsp_2.expected_availbility'), 'expected_availbility'],
          [sequelize.fn('SUM', sequelize.col('bsp_1->bsp1_production_centers.quantity_of_seed_produced')), 'quantity_of_seed_produced'],
          // [sequelize.col('bsp_1->indent_of_breederseed".indent_quantity'), 'indent_quantity'],
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
          [sequelize.col('bsp_2.expected_availbility'), 'expected_availbility'],
          [sequelize.col('bsp_2.season'), 'season'],
          [sequelize.col('bsp_2.crop_code'), 'crop_code'],
          [sequelize.col('m_crop.crop_name'), 'crop_name'],
          [sequelize.col('bsp_2.year'), 'year'],
          // [sequelize.col('bsp_1->indent_of_breederseed".indent_quantity'), 'indent_quantity'],
          [sequelize.col('bsp_1->bsp1_production_centers->user.name'), 'bspc_name'],
          [sequelize.col('bsp_1->bsp1_production_centers.quantity_of_seed_produced'), 'quantity_of_seed_produced'],
          [sequelize.col('m_crop_variety.variety_code'), 'variety_code'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
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

      let filterDataIndent = [];
      if (req.body.search) {
        if (req.body.search.crop_type) {
          filterDataIndent.push({
            crop_code: {
              [Op.like]: req.body.search.crop_type + '%'
            }
          })
        }
        if (req.body.search.year) {
          filterDataIndent.push({
            year: {
              [Op.eq]: req.body.search.year
            },
          })

        }
        if (req.body.search.season) {
          filterDataIndent.push({
            season: {
              [Op.eq]: req.body.search.season
            }
          });
        }

      }
      if (req.body.search.crop_code && (req.body.search.crop_code != undefined) && req.body.search.crop_code.length > 0) {
        filterDataIndent.push({
          crop_code: {
            [Op.in]: req.body.search.crop_code
          },

        })
      }
      let indentingData = await indentOfBreederseedModel.findAll({
        where: {
          [Op.and]: filterDataIndent ? filterDataIndent : []
        },
        attributes: [
          [sequelize.fn('SUM', sequelize.col('indent_quantity')), 'indent_quantity'],
          [sequelize.col('crop_code'), 'crop_code'],
          [sequelize.col('variety_id'), 'variety_id'],
        ],
        group: [
          [sequelize.col('crop_code'), 'crop_code'],
          [sequelize.col('variety_id'), 'variety_id'],
        ],
        raw: true,
      })

      let bsp2Data = await bsp2Model.findAll(condition);
      if (bsp2Data && bsp2Data.length > 0) {
        if (indentingData && indentingData.length > 0) {
          indentingData.forEach(item => {
            bsp2Data.forEach((el, i) => {
              if (el.crop_code == item.crop_code && el.variety_id == item.variety_id) {
                bsp2Data[i].indentQty = item && item.indent_quantity ? parseFloat(item.indent_quantity) : 0
              }
            })
          })

        }
      }

      let filterData = [];
      bsp2Data.forEach((el, index) => {
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
                    "indentQty": el && el.indentQty ? el.indentQty : '',
                    "bspc_count": 1,
                    "bspc": [
                      {
                        bspc_name: el && el.bspc_name ? el.bspc_name : '',
                        field_location: el && el.field_location ? el.field_location : '',
                        bspc_user_id: el && el.bspc_user_id ? el.bspc_user_id : '',
                        area: el && el.area ? parseFloat(el.area) : '',
                        expected_production: el && el.expected_production ? el.expected_production : '',
                        expected_harvest_to: el && el.expected_harvest_to ? el.expected_harvest_to : '',
                        expected_availbility: el && el.expected_availbility ? el.expected_availbility : '',
                        quantity_of_seed_produced: el && el.quantity_of_seed_produced ? el.quantity_of_seed_produced : '',
                        bsp_detail: [
                          {
                            area: el && el.area ? parseFloat(el.area) : '',
                            expected_production: el && el.expected_production ? el.expected_production : '',
                            expected_harvest_to: el && el.expected_harvest_to ? el.expected_harvest_to : '',
                            expected_availbility: el && el.expected_availbility ? el.expected_availbility : '',
                            quantity_of_seed_produced: el && el.quantity_of_seed_produced ? el.quantity_of_seed_produced : '',
                          }
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
            const bspcIndex = filterData[cropIndex].variety[varietyIndex].bspc.findIndex(item => item.bspc_user_id === el.bspc_user_id);

            if (bspcIndex != -1) {
              filterData[cropIndex].variety[varietyIndex].bspc[bspcIndex].bsp_detail.push(
                {
                  area: el && el.area ? parseFloat(el.area) : '',
                  expected_production: el && el.expected_production ? el.expected_production : '',
                  expected_harvest_to: el && el.expected_harvest_to ? el.expected_harvest_to : '',
                  expected_availbility: el && el.expected_availbility ? el.expected_availbility : '',
                  quantity_of_seed_produced: el && el.quantity_of_seed_produced ? el.quantity_of_seed_produced : '',
                }
              )
            } else {
              filterData[cropIndex].variety[varietyIndex].bspc.push(
                {
                  bspc_name: el && el.bspc_name ? el.bspc_name : '',
                  field_location: el && el.field_location ? el.field_location : '',
                  bspc_user_id: el && el.bspc_user_id ? el.bspc_user_id : '',
                  area: el && el.area ? parseFloat(el.area) : '',
                  expected_production: el && el.expected_production ? el.expected_production : '',
                  expected_harvest_to: el && el.expected_harvest_to ? el.expected_harvest_to : '',
                  expected_availbility: el && el.expected_availbility ? el.expected_availbility : '',
                  quantity_of_seed_produced: el && el.quantity_of_seed_produced ? el.quantity_of_seed_produced : '',
                  bsp_detail: [
                    {
                      area: el && el.area ? parseFloat(el.area) : '',
                      expected_production: el && el.expected_production ? el.expected_production : '',
                      expected_harvest_to: el && el.expected_harvest_to ? el.expected_harvest_to : '',
                      expected_availbility: el && el.expected_availbility ? el.expected_availbility : '',
                      quantity_of_seed_produced: el && el.quantity_of_seed_produced ? el.quantity_of_seed_produced : '',
                    }
                  ]
                }
              )
            }
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
                    bspc_name: el && el.bspc_name ? el.bspc_name : '',
                    field_location: el && el.field_location ? el.field_location : '',
                    area: el && el.area ? parseFloat(el.area) : '',
                    bspc_user_id: el && el.bspc_user_id ? el.bspc_user_id : '',
                    expected_production: el && el.expected_production ? el.expected_production : '',
                    expected_harvest_to: el && el.expected_harvest_to ? el.expected_harvest_to : '',
                    expected_availbility: el && el.expected_availbility ? el.expected_availbility : '',
                    quantity_of_seed_produced: el && el.quantity_of_seed_produced ? el.quantity_of_seed_produced : '',
                    bsp_detail: [
                      {
                        area: el && el.area ? parseFloat(el.area) : '',
                        expected_production: el && el.expected_production ? el.expected_production : '',
                        expected_harvest_to: el && el.expected_harvest_to ? el.expected_harvest_to : '',
                        expected_availbility: el && el.expected_availbility ? el.expected_availbility : '',
                        quantity_of_seed_produced: el && el.quantity_of_seed_produced ? el.quantity_of_seed_produced : '',
                      }
                    ]
                  }
                ]
              }
            )
          }
        }

      });


      return response(res, status.DATA_AVAILABLE, 200, filterData);

    } catch (error) {
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse)
    }
  }
  static AssignVarietyIndentingData = async (req, res) => {
    let data = {};
    try {
      let condition = {}

      // let filters = await ConditionCreator.filters(req.body.search);
      condition = {
        where: {
          year: req.body.search.year,
          season: req.body.search.season,
          crop_code: req.body.search.crop_code,

        },
        include: [
          {
            model: varietyModel,
            attributes: [],


          },
          {
            model: cropModel,
            attributes: [],
            where: {
              breeder_id: req.body.loginedUserid.id
            }
          }
        ]
        // attributes: [
        //   [sequelize.fn('DISTINCT', sequelize.col('lot_number_creations.lot_number')), 'lot_number'],
        // ]


      };


      // condition.order = [[sequelize.col('m_crop.crop_name'), 'ASC'], [sequelize.col('m_crop_variety.variety_name'), 'ASC']];
      data = await indentOfBreederseedModel.findAll(condition);
      // console.log("datadatadata -------", data)

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

  static getAssignCropAllData = async (req, res) => {
    try {
      let condition1 = {
        where: {}
      }
      let condition = {
        include: [
          {
            model: cropModel,
            attributes: []
          },
          {
            model: varietyModel,
            attributes: [],
            // include: [
            //   {
            //     model: mVarietyLinesModel,
            //     attributes: []
            //   }
            // ]
          },
          {
            model: seasonModel,
            attributes: []
          },
          {
            required: false,
            model: mVarietyLinesModel,
            attributes: [],
            where: {
              variety_code: [sequelize.col('assign_crops.variety_code')]
            }
          },
          {
            model: assignBspcCropNewFlow,
            attributes: [],
            include: [
              {
                model: userModel,
                attributes: [],
                include: [
                  {
                    model: agencyDetailModel,
                    attributes: []
                  }
                ]
              }
            ]
          }
        ],
        attributes: ['bspc_data',
          [sequelize.col('assign_crops.id'), 'id'],
          [sequelize.col('assign_crops.year'), 'year'],
          [sequelize.col('assign_crops.season'), 'season_code'],
          [sequelize.col('assign_crops.comment_id'), 'reason'],
          [sequelize.col('assign_crops.crop_code'), 'crop_code'],
          [sequelize.col('assign_crops.variety_code'), 'variety_code'],
          [sequelize.col('assign_crops.willing_to_praduced'), 'willing_to_praduced'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [sequelize.col('m_crop_variety.status'), 'variety_status'],
          [sequelize.col('m_crop.crop_name'), 'crop_name'],
          [sequelize.col('m_season.season'), 'season'],
          [sequelize.literal(`string_agg("assign_crop_bspc_mapping->user->agency_detail".agency_name::varchar,',')`), 'bspc_name'],
          [sequelize.literal(`string_agg("assign_crop_bspc_mapping->user".id::varchar,',')`), 'bspc_id'],
          [sequelize.col('m_variety_line.line_variety_code'), 'line_variety_code'],
          [sequelize.col('m_variety_line.line_variety_name'), 'line_variety_name'],
        ],
        group: [
          [sequelize.col('assign_crops.id'), 'id'],
          [sequelize.col('assign_crops.year'), 'year'],
          [sequelize.col('assign_crops.season'), 'season_code'],
          [sequelize.col('m_season.season'), 'season'],
          [sequelize.col('assign_crops.comment_id'), 'reason'],
          [sequelize.col('assign_crops.crop_code'), 'crop_code'],
          [sequelize.col('assign_crops.variety_code'), 'variety_code'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [sequelize.col('m_crop_variety.status'), 'variety_status'],
          [sequelize.col('m_crop.crop_name'), 'crop_name'],
          [sequelize.col('assign_crops.willing_to_praduced'), 'willing_to_praduced'],
          [sequelize.col('m_variety_line.id'), 'parental_id'],
          [sequelize.col('m_variety_line.line_variety_code'), 'line_variety_code'],
          [sequelize.col('m_variety_line.line_variety_name'), 'line_variety_name'],
        ],
        raw: true,
        where: {
        }
      };

      if (req.body.search) {
        if (req.body.search.year) {
          condition.where.year = req.body.search.year;
          condition1.where.year = req.body.search.year;
        };
        if (req.body.search.season) {
          condition.where.season = req.body.search.season;
          condition1.where.season = req.body.search.season;
        };
        if (req.body.search.crop_code) {
          condition.where.crop_code = req.body.search.crop_code;
          condition1.where.crop_code = req.body.search.crop_code;
        };
        if (req.body.search.variety_code) {
          condition.where.variety_code = req.body.search.variety_code;
          condition1.where.variety_code = req.body.search.variety_code;
        };
        if (req.body.search.variety_code_array) {
          condition.where.variety_code = { [Op.in]: req.body.search.variety_code_array };
          condition1.where.variety_code = { [Op.in]: req.body.search.variety_code_array };
        };
        if (req.body.search.id) {
          condition.where.id = req.body.search.id;
          condition1.where.id = req.body.search.id;
        };
      }
      let { page, pageSize } = req.body;
      const sortOrder = req.body.sort ? req.body.sort : 'id';
      const sortDirection = req.body.order ? req.body.order : 'DESC';

      if (page === undefined) page = 1;
      if (pageSize === undefined) pageSize = 10; // set pageSize to -1 to prevent sizing

      if (page > 0 && pageSize > 0) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }
      condition.order = [[sortOrder, sortDirection]];

      let assignCropData = await assignCropNewFlow.findAll(condition);
      let assignCropDatacount = await assignCropNewFlow.findAll(condition1);
      console.log("assignCropDatacount=====", assignCropDatacount.length);

      const filteredData = []
      assignCropData.forEach(el => {
        const spaIndex = filteredData.findIndex(item => item.variety_code === el.variety_code);
        if (spaIndex === -1) {
          filteredData.push({
            variety_name: el.variety_name,
            variety_code: el.variety_code,
            variety_status: el.variety_status,
            count: 1,
            bspc: [
              {
                variety_code: el.variety_code,
                id: el.id,
                bspc_data: el.bspc_data,
                year: el.year,
                season_code: el.season_code,
                reason: el.reason,
                crop_code: el.crop_code,
                willing_to_praduced: el.willing_to_praduced,
                variety_status: el.variety_status,
                crop_name: el.crop_name,
                season: el.season,
                bspc_name: el.bspc_name,
                bspc_id: el.bspc_id,
                line_variety_code: el.line_variety_code,
                line_variety_name: el.line_variety_name
              }
            ]
          });
        } else {
          const cropIndex = filteredData[spaIndex].bspc.findIndex(item => item.id === el.bspc_id);
          if (cropIndex !== -1) {
            filteredData[spaIndex].bspc.push(
              // {
              //     bspc_name: el.bspc_name,
              //     include_seed: el && el.nucleus_seed_available_qnt ? el.nucleus_seed_available_qnt : 0,
              //     breeder_seed: el && el.breeder_seed_available_qnt ? el.breeder_seed_available_qnt : 0,
              //     count: 1,
              //     target_quantity: el.target_qunatity,
              //     id: el.bspc_id
              // }
            );
          } else {
            filteredData[spaIndex].bspc.push(
              {
                variety_code: el.variety_code,
                id: el.id,
                bspc_data: el.bspc_data,
                year: el.year,
                season_code: el.season_code,
                reason: el.reason,
                crop_code: el.crop_code,
                willing_to_praduced: el.willing_to_praduced,
                variety_status: el.variety_status,
                crop_name: el.crop_name,
                season: el.season,
                bspc_name: el.bspc_name,
                bspc_id: el.bspc_id,
                line_variety_code: el.line_variety_code,
                line_variety_name: el.line_variety_name
              }
            );
          }
        }
      });
      filteredData.forEach((item, i) => {
        if (item.bspc && item.bspc)
          filteredData[i].count = item.bspc.length
      })
      // bspProformaOneData[0]
      let responseData = filteredData;


      let returnResponse = {
        count: assignCropDatacount && assignCropDatacount.length > 0 ? assignCropDatacount.length : 0,
        rows: responseData ? responseData : []
      }
      return response(res, status.DATA_AVAILABLE, 200, returnResponse);
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 501, [])
    }
  }

  static addAssignCropAllData = async (req, res) => {
    try {
      let { id, crop_code, variety_code, year, season, comment_id, willing_to_praduced, bspc_array, variety_parental_line } = req.body;

      let dataRow = {
        "crop_code": crop_code,
        "variety_code": variety_code,
        "year": year,
        "season": season,
        "comment_id": comment_id ? comment_id : null,
        "is_active": 0,
        "willing_to_praduced": willing_to_praduced,
        "user_id": req.body.loginedUserid.id ? req.body.loginedUserid.id : '',
        "bspc_data": bspc_array,
        "variety_line_code": variety_parental_line ? variety_parental_line : null
      };

      let addAssignCropData = {};
      if (id && id !== null) {
        addAssignCropData = await assignCropNewFlow.update(dataRow, { where: { id: id } });
        let bspDataArrayValue = []
        let updatedValue;
        if (bspc_array && bspc_array !== undefined && bspc_array.length > 0) {
          let isDeleted = assignBspcCropNewFlow.destroy({ where: { assign_crop_id: id } });
          if (isDeleted) {
            bspc_array.forEach((bspcArray) => {
              bspDataArrayValue = assignBspcCropNewFlow.build({
                assign_crop_id: id,
                bspc_id: bspcArray.id
              });
              bspDataArrayValue.save();
            });
            if (addAssignCropData) {
              updatedValue = await assignCropNewFlow.findOne({ where: { id: id } });
              return response(res, status.DATA_UPDATED, 200, updatedValue);
            } else {
              return response(res, "Data Not Updated", 201, []);
            }
          }
        } else {
          return response(res, status.DATA_UPDATED, 200, updatedValue);
        }
      } else {
        let isExits = await assignCropNewFlow.findAll({
          where: {
            year: year,
            season: season,
            crop_code: crop_code,
            variety_code: variety_code,
            variety_line_code: variety_parental_line ? variety_parental_line : null
          }
        });
        if (isExits && isExits.length) {
          return response(res, "Data Already Exits", 201, []);
        } else {
          addAssignCropData = await assignCropNewFlow.create(dataRow);
          console.log("addAssignCropData=====", addAssignCropData);
          if (addAssignCropData) {
            let bspDataArrayValue = []
            if (bspc_array && bspc_array !== undefined && bspc_array.length > 0) {
              bspc_array.forEach((bspcArray) => {
                bspDataArrayValue = assignBspcCropNewFlow.build({
                  assign_crop_id: addAssignCropData.dataValues.id,
                  bspc_id: bspcArray.id
                })
                bspDataArrayValue.save();
              });
              if (bspDataArrayValue) {
                return response(res, status.DATA_SAVE, 200, dataRow);
              } else {
                return response(res, status.DATA_NOT_SAVE, 200, dataRow);
              }
            } else {
              return response(res, status.DATA_SAVE, 200, dataRow);
            }
          }
        }
      }
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 501, [])
    }
  }

  static deleteAssignCropAllData = async (req, res) => {
    try {
      if (req.body && req.body.id) {
        let dataDelete = await assignCropNewFlow.destroy({ where: { id: req.body.id } });
        if (dataDelete) {
          let dataDelete = await assignBspcCropNewFlow.destroy({ where: { assign_crop_id: req.body.id } });
          return response(res, status.DATA_DELETED, 200, {});
        } else {
          return response(res, "Data Not Deleted", 200, {});
        }
      } else {
        return response(res, status.ID_NOT_FOUND, 200, {});
      }
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 501, [])
    }
  }

  static getCropBasicDetails = async (req, res) => {
    try {
      let condition = {
        include: [
          {
            model: varietyModel,
            attributes: ['not_date'],
            where: {
            }
          },
          {
            model: userModel,
            attributes: ['id'],
            include: [
              {
                model: agencyDetailModel,
                attributes: ['id'],
                include: [
                  {
                    model: stateModel,
                    attributes: ['state_name', 'state_short_name']
                  }
                ]
              }
            ]
          }
        ],
        attributes: ['indent_quantity'],
        // attributes: [
        //   [sequelize.literal(`distinct('breeder_crops.crop_code'),'crop_code'`)],
        //   [sequelize.literal(`sum('breeder_crops.)`)]
        // ],
        where: {}
      }

      if (req.body && req.body.search) {
        if (req.body.search.year) {
          condition.where.year = req.body.search.year;
        };
        if (req.body.search.season) {
          condition.where.season = req.body.search.season;
        };
        if (req.body.search.crop_code) {
          condition.where.crop_code = req.body.search.crop_code;
        };
        if (req.body.search.variety_code) {
          condition.where.variety_code = req.body.search.variety_code;
        };
        // if (req.body.search.variety_id) {
        //   condition.where.variety_id = req.body.search.variety_id;
        // };
        if (req.body.search.user_id) {
          condition.where.user_id = req.body.search.user_id;
        };
        if (req.body.search.id) {
          condition.where.id = req.body.search.id;
        };
      }
      // let breeder_crops_data = await breederCropModel.findAll(condition)
      let breeder_crops_data = await indentOfBreederseedModel.findAll(condition)

      // let returnResponse = {
      //   breeder_crops_data: breeder_crops_data
      // };
      return response(res, status.DATA_AVAILABLE, 200, breeder_crops_data)
    } catch (error) {
      console.log('error=====', error);
      return response(res, status.UNEXPECTED_ERROR, 501, [])
    }
  }
  static getCropBasicDetailsSecond = async (req, res) => {
    try {
      let condition = {
        include: [
          {
            model: varietyModel,
            attributes: ['not_date'],
            where: {
            }
          },
          {
            model: userModel,
            attributes: ['id'],
            include: [
              {
                model: agencyDetailModel,
                attributes: ['id'],
                include: [
                  {
                    model: stateModel,
                    attributes: ['state_name', 'state_short_name']
                  }
                ]
              }
            ]
          },
          {
            model: db.indentOfBrseedLines,
            attributes: [],
            required: true,
            where: {

            }
          }
        ],
        attributes: [
          [sequelize.col('indent_of_brseed_line.variety_code_line'), 'variety_code_line'],
          [sequelize.col('indent_of_brseed_line.quantity'), 'quantity']
        ],
        // attributes: [
        //   [sequelize.literal(`distinct('breeder_crops.crop_code'),'crop_code'`)],
        //   [sequelize.literal(`sum('breeder_crops.)`)]
        // ],
        where: {}
      }

      if (req.body && req.body.search) {
        if (req.body.search.year) {
          condition.where.year = req.body.search.year;
        };
        if (req.body.search.season) {
          condition.where.season = req.body.search.season;
        };
        if (req.body.search.crop_code) {
          condition.where.crop_code = req.body.search.crop_code;
        };
        if (req.body.search.variety_code) {
          condition.where.variety_code = req.body.search.variety_code;
        };
        // if (req.body.search.variety_id) {
        //   condition.where.variety_id = req.body.search.variety_id;
        // };
        if (req.body.search.user_id) {
          condition.where.user_id = req.body.search.user_id;
        };
        if (req.body.search.variety_line) {
          condition.include[2].where.variety_code_line = req.body.search.variety_line
        }
        if (req.body.search.id) {
          condition.where.id = req.body.search.id;
        };
      }
      // let breeder_crops_data = await breederCropModel.findAll(condition)
      let breeder_crops_data = await indentOfBreederseedModel.findAll(condition)

      // let returnResponse = {
      //   breeder_crops_data: breeder_crops_data
      // };
      return response(res, status.DATA_AVAILABLE, 200, breeder_crops_data)
    } catch (error) {
      console.log('error=====', error);
      return response(res, status.UNEXPECTED_ERROR, 501, [])
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
        where: {
          // is_freeze:1
        },
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
  // static getYearOfIndentSpaSecond = async (req, res) => {
  //   let returnResponse = {};
  //   const { internalCall } = req.body;
  //   try {
  //     let rules = {
  //       'search.year': 'string',
  //       'search.season': 'string',
  //       'search.crop_code': 'string',
  //       'search.state_code': 'string',
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
  //     }
  //     let cropGroup;
  //     if (req.body.loginedUserid.user_type === "OILSEEDADMIN") {
  //       cropGroup = { crop_code: { [Op.like]: 'A04%' } };
  //     }
  //     if (req.body.loginedUserid.user_type === "PULSESSEEDADMIN") {
  //       cropGroup = { crop_code: { [Op.like]: 'A03%' } };
  //     }

  //     let condition = {
  //       where: {
  //         // is_freeze:1
  //       },
  //       include: [
  //         {
  //           model: indentOfBreederseedModel,
  //           attributes: [],
  //           where: {
  //             is_freeze: 1,
  //             // icar_freeze: 1,
  //             // is_indenter_freeze: 1
  //             ...cropGroup
  //           },
  //         }
  //       ],
  //       raw: true,
  //       attributes: [
  //         [db.Sequelize.fn("Distinct", db.Sequelize.col("indent_of_spas.year")), "value"],
  //         [db.Sequelize.col("indent_of_spas.year"), "year"]
  //         // [sequelize.literal("concat(year, '-', RIGHT((Year+1)::VARCHAR, 2))"), 'display_text'],
  //         // 'year'
  //       ]
  //     };
  //     let condition2 = {
  //       where: {
  //         is_freeze: 1,
  //         is_forward: 0,
  //         ...cropGroup
  //       },
  //       raw: true,
  //       attributes: [
  //         [db.Sequelize.fn("Distinct", db.Sequelize.col("year")), "value"],
  //         // [sequelize.literal("concat(year, '-', RIGHT((Year+1)::VARCHAR, 2))"), 'display_text'],
  //         'year'
  //       ]
  //     };

  //     if (req.body.search) {
  //       if (req.body.search.year) {
  //         condition.where.year = {
  //           [Op.in]: req.body.search.year.toString().split(',')
  //         };
  //         condition2.where.year = {
  //           [Op.in]: req.body.search.year.toString().split(',')
  //         };
  //       }
  //       if (req.body.search.season) {
  //         condition.where.season = {
  //           [Op.in]: req.body.search.season.toString().split(',')
  //         };
  //         condition2.where.season = {
  //           [Op.in]: req.body.search.season.toString().split(',')
  //         };

  //       }
  //       if (req.body.search.crop_code) {
  //         condition.where.crop_code = {
  //           [Op.in]: req.body.search.crop_code.toString().split(',')
  //         };
  //         condition2.where.crop_code = {
  //           [Op.in]: req.body.search.crop_code.toString().split(',')
  //         };
  //       }
  //       if (req.body.search.state_code) {
  //         condition.where.state_code = {
  //           [Op.in]: req.body.search.state_code.toString().split(',')
  //         };
  //         condition2.where.state_code = {
  //           [Op.in]: req.body.search.state_code.toString().split(',')
  //         };
  //       }
  //     }

  //     condition.order = [['year', 'desc']];
  //     condition2.order = [['year', 'desc']];
  //     returnResponse = await indenterSPAModel.findAll(condition);

  //     let returnResponse2 = await indentOfBreederseedModel.findAll(condition2);
  //     console.log(returnResponse2)
  //     console.log(returnResponse)
  //     let returnSpayear = [];
  //     let indentYear = []
  //     if (returnResponse && returnResponse.length > 0) {
  //       returnResponse.forEach((el, i) => {
  //         returnSpayear.push(el && el.value ? el.value : '');
  //       })
  //     }
  //     if (returnResponse2 && returnResponse2.length > 0) {
  //       returnResponse2.forEach((el, i) => {
  //         indentYear.push(el && el.value ? el.value : '');
  //       })
  //     }

  //     let retunArr = [...indentYear, ...returnSpayear];
  //     let totalyearArr = []
  //     if (retunArr && retunArr.length > 0) {
  //       retunArr.forEach((el) => {
  //         totalyearArr.push({ year: el ? el : '' })
  //       })
  //     }
  //     response(res, status.DATA_AVAILABLE, 200, totalyearArr, internalCall);
  //   } catch (error) {
  //     returnResponse = {
  //       error: error.message
  //     }
  //     console.log(returnResponse);
  //     response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
  //   }
  // }
  static getYearOfIndentSpaSecond = async (req, res) => {
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

    // ✅ filter based on user type
    let cropGroup = {};
    if (req.body.loginedUserid.user_type === "OILSEEDADMIN") {
      cropGroup = { crop_code: { [Op.like]: 'A04%' } };
    }
    if (req.body.loginedUserid.user_type === "PULSESSEEDADMIN") {
      cropGroup = { crop_code: { [Op.like]: 'A03%' } };
    }

    // ✅ First condition (SPA indent)
    let condition = {
      where: {},
      include: [
        {
          model: indentOfBreederseedModel,
          attributes: [],
          where: {
            is_freeze: 1,
            ...cropGroup
          },
        }
      ],
      raw: true,
      attributes: [
        [db.Sequelize.fn("Distinct", db.Sequelize.col("indent_of_spas.year")), "value"],
        [db.Sequelize.col("indent_of_spas.year"), "year"]
      ],
      order: [['year', 'desc']]
    };

    // ✅ Second condition (Indent breederseed)
    let condition2 = {
      where: {
        is_freeze: 1,
        is_forward: 0,
        ...cropGroup
      },
      raw: true,
      attributes: [
        [db.Sequelize.fn("Distinct", db.Sequelize.col("year")), "value"],
        'year'
      ],
      order: [['year', 'desc']]
    };

    // ✅ Apply filters if provided
    if (req.body.search) {
      if (req.body.search.year) {
        condition.where.year = {
          [Op.in]: req.body.search.year.toString().split(',')
        };
        condition2.where.year = {
          [Op.in]: req.body.search.year.toString().split(',')
        };
      }
      if (req.body.search.season) {
        condition.where.season = {
          [Op.in]: req.body.search.season.toString().split(',')
        };
        condition2.where.season = {
          [Op.in]: req.body.search.season.toString().split(',')
        };
      }
      if (req.body.search.crop_code) {
        condition.where.crop_code = {
          [Op.in]: req.body.search.crop_code.toString().split(',')
        };
        condition2.where.crop_code = {
          [Op.in]: req.body.search.crop_code.toString().split(',')
        };
      }
      if (req.body.search.state_code) {
        condition.where.state_code = {
          [Op.in]: req.body.search.state_code.toString().split(',')
        };
        condition2.where.state_code = {
          [Op.in]: req.body.search.state_code.toString().split(',')
        };
      }
    }

    // ✅ Fetch results
    let returnResponse1 = await indenterSPAModel.findAll(condition);
    let returnResponse2 = await indentOfBreederseedModel.findAll(condition2);

    let returnSpayear = returnResponse1.map(el => el?.value || '');
    let indentYear = returnResponse2.map(el => el?.value || '');

    // ✅ Merge, dedupe, sort
    let retunArr = [...indentYear, ...returnSpayear];
    let uniqueYears = [...new Set(retunArr)]
      .filter(y => y) // remove empty/null
      .sort((a, b) => b - a); // descending sort

    let totalyearArr = uniqueYears.map(y => ({ year: y }));

    response(res, status.DATA_AVAILABLE, 200, totalyearArr, internalCall);

  } catch (error) {
    returnResponse = { error: error.message };
    console.log(returnResponse);
    response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
  }
};


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
      let cropGroup;
      if (req.body.loginedUserid.user_type === "OILSEEDADMIN") {
        cropGroup = { crop_code: { [Op.like]: 'A04%' } };
      }
      let condition = {
        where: {
          // is_freeze:1
          ...cropGroup
        },
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

      condition.order = [['season', 'ASC']];
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
  static getSeasonOfIndentSpaSecond = async (req, res) => {
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
      let cropGroup;
      if (req.body.loginedUserid.user_type === "OILSEEDADMIN") {
        cropGroup = { crop_code: { [Op.like]: 'A04%' } };
      }
      if (req.body.loginedUserid.user_type === "PULSESSEEDADMIN") {
        cropGroup = { crop_code: { [Op.like]: 'A03%' } };
      }

      let condition = {
        where: {
          // is_freeze:1,
        },
        include: [{
          model: indentOfBreederseedModel,
          attributes: [],
          where: {
            is_freeze: 1,
            icar_freeze: 1,
            is_indenter_freeze: 1,
            ...cropGroup
          }

        }],
        raw: true,
        attributes: [
          [db.Sequelize.fn("Distinct", db.Sequelize.col("indent_of_spas.season")), "value"],
          // [sequelize.literal("Case when season='R' then 'Rabi' when season='K' then 'Kharif' else season end"), 'display_text'],
          // 'season'
        ]
      };
      let condition2 = {
        where: {
          is_freeze: 1,
          is_forward: 0,
          ...cropGroup
          // is_freeze:1
        },
        raw: true,
        attributes: [
          [db.Sequelize.fn("Distinct", db.Sequelize.col("season")), "value"],
          // [sequelize.literal("Case when season='R' then 'Rabi' when season='K' then 'Kharif' else season end"), 'display_text'],
          // 'season'
        ]
      };

      if (req.body.search) {
        if (req.body.search.year) {
          condition.where.year = {
            [Op.in]: req.body.search.year.toString().split(',')
          };
          condition2.where.year = {
            [Op.in]: req.body.search.year.toString().split(',')
          };
        }
        if (req.body.search.season) {
          condition.where.season = {
            [Op.in]: req.body.search.season.toString().split(',')
          };
          condition2.where.season = {
            [Op.in]: req.body.search.season.toString().split(',')
          };
        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = {
            [Op.in]: req.body.search.crop_code.toString().split(',')
          };
          condition2.where.crop_code = {
            [Op.in]: req.body.search.crop_code.toString().split(',')
          };
        }
        if (req.body.search.state_code) {
          condition.where.state_code = {
            [Op.in]: req.body.search.state_code.toString().split(',')
          };
          condition2.where.state_code = {
            [Op.in]: req.body.search.state_code.toString().split(',')
          };
        }
      }

      condition.order = [['season', 'ASC']];
      condition2.order = [['season', 'ASC']];
      returnResponse = await indenterSPAModel.findAll(condition);
      let returnResponse2 = await indentOfBreederseedModel.findAll(condition2);
      let seasonData = [];
      if (returnResponse && returnResponse.length > 0) {
        returnResponse.forEach((el => {
          seasonData.push(el && el.value ? el.value : '')
        }))
      }
      if (returnResponse2 && returnResponse2.length > 0) {
        returnResponse2.forEach((el => {
          seasonData.push(el && el.value ? el.value : '')
        }))
      }
      let returnSeasonData = []
      if (seasonData && seasonData.length > 0) {
        seasonData = [...new Set(seasonData)];
        seasonData.forEach(el => {
          returnSeasonData.push({ value: el })
        })
      }

      response(res, status.DATA_AVAILABLE, 200, returnSeasonData, internalCall);
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

      let cropGroup;
      if (req.body.loginedUserid.user_type === "OILSEEDADMIN") {
        cropGroup = { crop_code: { [Op.like]: 'A04%' } };
      }

      let condition = {
        include: [
          {
            model: cropModel,
            required: true,
            attributes: []
          }
        ],
        where: {
          // is_freeze:1
          ...cropGroup
        },
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
  static getCropOfIndentSpaSecond = async (req, res) => {
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
      let cropGroup;
      if (req.body.loginedUserid.user_type === "OILSEEDADMIN") {
        cropGroup = { crop_code: { [Op.like]: 'A04%' } };
      }
      if (req.body.loginedUserid.user_type === "PULSESSEEDADMIN") {
        cropGroup = { crop_code: { [Op.like]: 'A03%' } };
      }
      let condition = {
        include: [
          {
            model: cropModel,
            attributes: [],
            required: true,

          },
          {
            model: indentOfBreederseedModel,
            attributes: [],
            where: {
              is_freeze: 1,
              icar_freeze: 1,
              is_indenter_freeze: 1,
              ...cropGroup
            }

          }
          // attributes: []
        ],
        where: {
          // is_freeze:1
          ...cropGroup
        },
        raw: true,
        attributes: [
          [db.Sequelize.fn("Distinct", db.Sequelize.col("indent_of_spas.crop_code")), "value"],
          [sequelize.literal('m_crop.crop_name'), 'display_text'],
          'indent_of_spas.crop_code'
        ]
      };
      let condition2 = {
        include: [
          {
            model: cropModel,
            required: true,
            attributes: []
          }
        ],
        where: {
          is_freeze: 1,
          is_forward: 0,
          // is_freeze:1,
          ...cropGroup
        },
        raw: true,
        attributes: [
          [db.Sequelize.fn("Distinct", db.Sequelize.col("indent_of_breederseeds.crop_code")), "value"],
          [sequelize.literal('m_crop.crop_name'), 'display_text'],
          // [db.Sequelize.fn("Distinct", db.Sequelize.col("season")), "value"],
          // [sequelize.literal("Case when season='R' then 'Rabi' when season='K' then 'Kharif' else season end"), 'display_text'],
          // 'season'
        ]
      };

      if (req.body.search) {
        if (req.body.search.year) {
          condition.where.year = {
            [Op.in]: req.body.search.year.toString().split(',')
          };
          condition2.where.year = {
            [Op.in]: req.body.search.year.toString().split(',')
          };
        }
        if (req.body.search.season) {
          condition.where.season = {
            [Op.in]: req.body.search.season.toString().split(',')
          };
          condition2.where.season = {
            [Op.in]: req.body.search.season.toString().split(',')
          };
        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = {
            [Op.in]: req.body.search.crop_code.toString().split(',')
          };
          condition2.where.crop_code = {
            [Op.in]: req.body.search.crop_code.toString().split(',')
          };

        }
        if (req.body.search.state_code) {
          condition.where.state_code = {
            [Op.in]: req.body.search.state_code.toString().split(',')
          };
          condition2.where.state_code = {
            [Op.in]: req.body.search.state_code.toString().split(',')
          };
        }
      }

      condition.order = [[sequelize.col('m_crop.crop_name'), 'asc']];
      condition2.order = [[sequelize.col('m_crop.crop_name'), 'asc']];
      returnResponse = await indenterSPAModel.findAll(condition);
      let returnResponse2 = await indentOfBreederseedModel.findAll(condition2);
      let cropData = [];
      if (returnResponse && returnResponse.length > 0) {
        returnResponse.forEach((el => {
          cropData.push(
            {
              value: el && el.value ? el.value : '',
              display_text: el && el.display_text ? el.display_text : ''
            }
          )
        }))
      }
      if (returnResponse2 && returnResponse2.length > 0) {
        returnResponse2.forEach((el => {
          cropData.push(
            {
              value: el && el.value ? el.value : '',
              display_text: el && el.display_text ? el.display_text : ''
            }
          )
        }))
      }
      const uniqueData = Object.values(
        cropData.reduce((acc, curr) => {
          acc[curr.value] = curr; // Override if duplicate
          return acc;
        }, {})
      );
      if (uniqueData && uniqueData.length) {
        response(res, status.DATA_AVAILABLE, 200, uniqueData, internalCall);
      } else {
        response(res, status.DATA_NOT_AVAILABLE, 201, [], internalCall);
      }
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

      let cropGroup;
      if (req.body.loginedUserid.user_type === "OILSEEDADMIN") {
        cropGroup = { crop_code: { [Op.like]: 'A04%' } };
      }

      let condition = {
        include: [
          {
            model: stateModel,
            required: true,
            attributes: []
          }
        ],
        where: {
          // is_freeze:1
          ...cropGroup
        },
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
  static getStateOfIndentSpaSecond = async (req, res) => {
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
      let cropGroup;
      if (req.body.loginedUserid.user_type === "OILSEEDADMIN") {
        cropGroup = { crop_code: { [Op.like]: 'A04%' } };
      }
      if (req.body.loginedUserid.user_type === "PULSESSEEDADMIN") {
        cropGroup = { crop_code: { [Op.like]: 'A03%' } };
      }
      let condition = {
        include: [
          {
            model: stateModel,
            required: true,
            attributes: []
          },
          {
            model: indentOfBreederseedModel,
            where: {
              is_freeze: 1,
              icar_freeze: 1,
              is_indenter_freeze: 1,
              ...cropGroup
              // is_freeze:1
            },
            required: true,
            attributes: []
          }

        ],
        where: {
          year: req.body.search.year
        },

        raw: true,
        attributes: [
          [db.Sequelize.fn("Distinct", db.Sequelize.col("indent_of_spas.state_code")), "value"],
          [sequelize.literal('m_state.state_name'), 'display_text'],
          // 'indent_of_spas.state_code'
        ]
      };
      let condition2 = {
        include: [
          {
            model: db.userModel,
            // required: true,
            attributes: []
          }
        ],

        where: {
          is_freeze: 1,
          is_forward: 0,
          year: req.body.search.year,
          ...cropGroup
          // is_freeze:1
        },
        raw: true,
        attributes: [
          [db.Sequelize.fn("Distinct", db.Sequelize.col("indent_of_breederseeds.user_id")), "value"],
          [sequelize.col('user.name'), 'display_text'],
          // [db.Sequelize.fn("Distinct", db.Sequelize.col("season")), "value"],
          // [sequelize.literal("Case when season='R' then 'Rabi' when season='K' then 'Kharif' else season end"), 'display_text'],
          // 'season'
        ]
      };


      if (req.body.search) {
        if (req.body.search.year) {
          // condition.where.year = {
          //   [Op.in]: req.body.search.year.toString().split(',')
          // };
        }
        if (req.body.search.season) {
          condition.where.season = {
            [Op.in]: req.body.search.season.toString().split(',')
          };
          condition2.where.season = {
            [Op.in]: req.body.search.season.toString().split(',')
          };
        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = {
            [Op.in]: req.body.search.crop_code.toString().split(',')
          };
          condition2.where.crop_code = {
            [Op.in]: req.body.search.crop_code.toString().split(',')
          };
        }
        if (req.body.search.state_code) {
          condition.where.state_code = {
            [Op.in]: req.body.search.state_code.toString().split(',')
          };
          condition2.where.user_id = {
            [Op.in]: req.body.search.state_code.toString().split(',')
          };
        }
      }

      // condition.order = [['state_code', 'asc']];
      // condition2.order = [['state_code', 'asc']];
      condition.order = [[sequelize.col('m_state.state_name'), 'asc']];
      // condition2.order = [[sequelize.col('user.name'), 'asc']];
      returnResponse = await indenterSPAModel.findAll(condition);

      let returnResponse2 = await indentOfBreederseedModel.findAll(condition2);
      let data = []
      if (returnResponse && returnResponse.length > 0) {
        returnResponse.forEach(el => {
          data.push({
            value: el && el.value ? el.value : '',
            display_text: el && el.display_text ? el.display_text : ''
          })
        })
      }
      if (returnResponse2 && returnResponse2.length > 0) {
        returnResponse2.forEach(el => {
          data.push({
            value: el && el.value ? el.value : '',
            display_text: el && el.display_text ? el.display_text : ''
          })
        })
      }

      response(res, status.DATA_AVAILABLE, 200, data, internalCall);
    } catch (error) {
      console.log(error, 'error')
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
            is_freeze: 1,
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
        console.log(data)
        if (!(data && data.length)) {
          response(res, status.DATA_NOT_AVAILABLE, 200, returnResponse, internalCall);
        } else {

          const isIndenterFreezeData = await data.filter((datum) => {
            return parseInt(datum.is_indenter_freeze) === 1
          });

          if (isIndenterFreezeData && isIndenterFreezeData.length) {
            console.log(isIndenterFreezeData, 'hiiiiiiiiii')
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

  static getBspProforma2sDetailsV1 = async (req, res) => {
    let returnResponse = {};
    const { internalCall } = req.body;
    try {
      let rules = {
        'search.email_id': 'required|string|email',
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
        let { page, pageSize, search } = req.body;
        if (page === undefined) page = 1;
        if (pageSize === undefined) pageSize = 10; // set pageSize to -1 to prevent sizing

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

        const dataCount = await db.sequelize.query(
          "select count(distinct bsp_proforma_2s.id) " + mid_query + ";",
          {
            replacements: { email_id: req.body.search.email_id },
            type: QueryTypes.SELECT
          }
        );

        if (!(dataCount && dataCount.length && parseInt(dataCount[0].count))) {
          response(res, status.DATA_NOT_AVAILABLE, 200, returnResponse, internalCall);
        } else {

          const totalRecord = dataCount[0].count;
          const lastPage = await this.getLastPageFromTableDataSummary(totalRecord, page, pageSize);

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

            const data = await db.sequelize.query(
              "select bsp_proforma_2s.year, CASE WHEN bsp_proforma_2s.season='R' then 'Rabi' when bsp_proforma_2s.season='K' then 'Kharif' else bsp_proforma_2s.season end as season, bsp_proforma_2s.crop_code, m_crops.crop_name, bsp_proforma_2s.variety_code, m_crop_varieties.variety_name, bsp_proforma_2s.state_code, m_states.state_name, bsp_proforma_2s.district_code, m_districts.district_name, bsp_proforma_2s.address, bsp_proforma_2s.field_code, bsp_proforma_2s.area_shown, bsp_proforma_2s.date_of_showing, bsp_proforma_2s.quantity_of_ns_shown as necleus_seed, bsp_proforma_2s.quantity_of_bs_shown as breeder_seed, sum(bsp_proforma_1_bspcs.target_qunatity) as target, bsp_proforma_2s.expected_production, bsp_proforma_2s.user_id, users.username, CASE WHEN bsp_proforma_2s.is_inspected= true then 'Complete' else 'Pending' end as status, bsp_proforma_2s.expected_inspection_from as inspection_date,  bsp_proforma_2s.id " +
              mid_query +
              "group by bsp_proforma_2s.year, bsp_proforma_2s.season, bsp_proforma_2s.crop_code, crop_name, bsp_proforma_2s.variety_code, m_crop_varieties.variety_name, bsp_proforma_2s.state_code, m_states.state_name, bsp_proforma_2s.district_code, m_districts.district_name, bsp_proforma_2s.address, bsp_proforma_2s.field_code, bsp_proforma_2s.area_shown, bsp_proforma_2s.date_of_showing, bsp_proforma_2s.quantity_of_ns_shown, bsp_proforma_2s.quantity_of_bs_shown, bsp_proforma_2s.expected_production, bsp_proforma_2s.user_id, users.username, bsp_proforma_2s.is_inspected, bsp_proforma_2s.expected_inspection_from, bsp_proforma_2s.id " +
              "order by " + sortOrder + " " + sortDirection + " " +
              "LIMIT " + page * pageSize + " OFFSET " + ((page * pageSize) - pageSize) + " " +
              ";",
              {
                replacements: { email_id: req.body.search.email_id },
                type: QueryTypes.SELECT
              }
            );

            returnResponse = await paginateResponseRaw(data, page, pageSize, totalRecord, lastPage);
            response(res, status.DATA_AVAILABLE, 200, returnResponse, internalCall);
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

  static authenticateAppUserV1 = async (req, res) => {
    let returnResponse = {};
    const { internalCall } = req.body;
    try {
      let rules = {
        'userId': 'required|string',
        'pinCode': 'required|string'
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
            replacements: { email_id: req.body.userId },
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
    const { internalCall } = req.body;
    let returnResponse = {};
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
          "inner join monitoring_team_of_bspc_plots on monitoring_team_of_bspc_plots.monitoring_team_of_id = monitoring_team_of_bspc_members.monitoring_team_of_bspc_id and bsp_proforma_2s.field_code = monitoring_team_of_bspc_plots.plots " +
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

  static authenticateGOTAppUser = async (req, res) => {
    const { internalCall } = req.body;
    let returnResponse = {};
    try {
      let rules = {
        'userId': 'required|string',
        'pinCode': 'required|string',
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

        const teamLeadData = await db.sequelize.query(
          "Select got_monitoring_team_members.id, got_monitoring_team_members.got_monitoring_team_id from got_monitoring_team_members where lower(got_monitoring_team_members.user_name) = lower(:userName) and lower(encode(digest(got_monitoring_team_members.pin_code::VARCHAR, 'sha256'), 'hex')) = lower(:pinCode) and got_monitoring_team_members.is_team_lead = true",
          {
            replacements: { userName: req.body.userId, pinCode: req.body.pinCode },
            type: QueryTypes.SELECT
          }
        );

        if (!(teamLeadData && teamLeadData.length && teamLeadData[0])) {
          response(res, status.UNAUTHORIZED_USER, 401, returnResponse, internalCall);
        } else if (!(teamLeadData[0]['id'] && teamLeadData[0]['got_monitoring_team_id'])) {
          response(res, status.USER_NOT_EXIST, 404, returnResponse, internalCall);
        } else {
          const gotMonTeamId = teamLeadData[0]['got_monitoring_team_id'];
          const gotMonTeamMemId = teamLeadData[0]['id'];

          const sortOrder = req.body.sort ? req.body.sort : 'got_testing.id';
          const sortDirection = req.body.order ? req.body.order : 'DESC';

          const mid_query = "from got_testing " +
            "inner join got_showing_details on got_showing_details.got_testing_id = got_testing.id and got_showing_details.user_id = got_testing.bspc_id " +
            "inner join got_monitoring_team_members on got_monitoring_team_members.got_monitoring_team_id = got_testing.got_monitoring_team_id and got_monitoring_team_members.is_team_lead = true " +
            "inner join agency_details on agency_details.user_id = got_testing.bspc_id " +
            "inner join m_crops on m_crops.crop_code = got_testing.crop_code " +
            "inner join m_crop_varieties on m_crop_varieties.variety_code = got_testing.variety_code " +
            "left join m_variety_lines on m_variety_lines.variety_code = got_testing.variety_code and m_variety_lines.line_variety_code = got_testing.variety_line_code " +
            "inner join m_states on m_states.state_code = got_showing_details.state_code " +
            "inner join m_districts on m_districts.district_code = got_showing_details.district_code " +
            "where got_monitoring_team_members.id = :gotMonTeamMemId ";

          const select = `Select 'OCT23-13-099-205' AS "intakeLotNum", m_crops.crop_name AS "cropName", got_testing.crop_code AS "cropCode", agency_details.agency_name AS "testingLab", got_testing.bspc_id AS "testingLabCode", 'forwardedToLAB' AS "status", m_crop_varieties.variety_name AS "varietyName", got_testing.variety_code AS "varietyCode", 'BREEDER' AS "sourceClass", 'FOUNDATION I' AS "destinationClass", got_testing.unique_code AS "uniqueCode", got_testing.created_at AS "samplingDate", got_showing_details.date_of_showing AS "showingDate", got_testing.updated_at AS "generationDate", '1572' AS "spaCode", 'MSSCL OSMANABAD' AS "spaName", '13-099' AS "sppCode", 'MSSCL OSMANABAD' AS "sppName", CONCAT(got_testing.year, '-', RIGHT((got_testing.year + 1)::VARCHAR, 2)) AS "finyear", CASE     WHEN got_testing.season = 'R' THEN 'Rabi'    WHEN got_testing.season = 'K' THEN 'Kharif'     ELSE got_testing.season END AS "season", 'K23-10-2229' AS "cropRegCode", 'GOT' AS "test", agency_details.state_id AS "stateCode", got_testing.id AS "sLSerial", got_testing.consignment_number AS "letterNo", 'RCVD' AS "recieveStatus", got_testing.bspc_id AS "recievedBy", got_testing.test_number AS "showTestNo", got_testing.test_number AS "testNo", got_testing.bspc_id AS "testNoGeneratedBy", 'BPC' AS "userType" `;

          let data = await db.sequelize.query(
            select +
            mid_query +
            "group by m_crops.crop_name, got_testing.crop_code, agency_details.agency_name, got_testing.bspc_id, m_crop_varieties.variety_name, got_testing.variety_code, got_testing.unique_code, got_testing.created_at, got_showing_details.date_of_showing, got_testing.updated_at,got_testing.year, got_testing.season, agency_details.state_id, got_testing.id, got_testing.consignment_number, got_testing.bspc_id, got_testing.test_number " +
            "order by " + sortOrder + " " + sortDirection + " " + ";",
            {
              replacements: { gotMonTeamMemId: gotMonTeamMemId },
              type: QueryTypes.SELECT
            }
          );

          const promises = [];
          for (const key in data) {
            data[key]['recieveDateByLAB'] = data[key]['sampleForwardToLabOn'] = { '$date': data[key]['samplingDate'] };

            data[key]['testNoGenerationDate'] = { '$date': data[key]['generationDate'] };
            delete data[key]['generationDate'];

            const teamMemberData = await db.sequelize.query(
              'Select got_monitoring_team_members.id, got_monitoring_team_members.name, got_monitoring_team_members.mobile_number as "mobileNumber", got_monitoring_team_members.email_id as "emailId", m_designations.name as designation ' +
              "from got_monitoring_team_members " +
              "left join m_designations on m_designations.id = got_monitoring_team_members.designation_id " +
              "where got_monitoring_team_members.got_monitoring_team_id = :gotMonTeamId",
              {
                replacements: { gotMonTeamId: gotMonTeamId },
                type: QueryTypes.SELECT
              }
            );

            data[key]['teamData'] = (teamMemberData && teamMemberData.length) ? teamMemberData : [];

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
      }
    } catch (error) {
      returnResponse = {
        error: error.message
      }
      console.log(returnResponse);
      response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }

  static syncLabData = async (req, res) => {
    console.log('syncLabData API Starts');
    const { internalCall } = req.body;
    let returnResponse = {};
    try {
      let rules = {
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

        const stateList = await stateModel.findAll({
          where: {
            is_state: 1
          },
          raw: false,
          order: [['state_code', 'asc']],
          attributes: [[sequelize.fn('DISTINCT', sequelize.col('state_code')), 'state_code']]
        });

        console.log('stateList: ', stateList);
        if (stateList && stateList.length) {

          const promises = [];
          for (const key in stateList) {

            const stateCode = stateList[key]['dataValues']['state_code'] ?? '';

            const url = process.env.LAB_DATA_API_URL ?? '';
            const method = 'GET';
            const dataSet = {
              stateCode: stateCode,
              apiKey: process.env.LAB_DATA_API_KEY ?? ''
            };

            console.log('url: ', url);
            console.log('method: ', method);
            console.log('stateCode: ', stateCode);
            console.log('apiKey: ', dataSet.apiKey);
            console.log('dataSet: ', dataSet);
            console.log('dataSet Stringified: ', JSON.stringify(dataSet));

            let axiosResponse = (await this.axiosFunction(dataSet, url, method));

            console.log('axiosResponse: ', axiosResponse);
            console.log('axiosResponse Stringified: ', JSON.stringify(axiosResponse));

            if (parseInt(axiosResponse.status) === 200 && axiosResponse.result && axiosResponse.result.length) {
              console.log('in');

              const axiosResult = axiosResponse.result;

              const uniqueAPILabNameArray = await (async () => [...new Set(axiosResult.map(lab => lab['labName']))])();

              console.log('uniqueAPILabNameArray: ', uniqueAPILabNameArray);

              const seedLabTestData = await seedLabTestModel.findAll({
                where: {
                  state_id: stateCode,
                  stl_name: {
                    [Op.in]: uniqueAPILabNameArray
                  }
                },
                raw: false,
                attributes: [[sequelize.fn('DISTINCT', sequelize.col('stl_name')), 'stl_name']]
              });

              console.log('seedLabTestData: ', seedLabTestData);

              const uniqueDBLabNameArray = await (async () => [...new Set(seedLabTestData.map(lab => lab['stl_name']))])();

              console.log('uniqueDBLabNameArray: ', uniqueDBLabNameArray);

              const { existingLabs, newLabs } = await (async () => ({
                existingLabs: axiosResult.filter(lab => uniqueDBLabNameArray.includes(lab.labName)),
                newLabs: axiosResult.filter(lab => !uniqueDBLabNameArray.includes(lab.labName))
              }))();

              console.log('newLabs: ', newLabs);

              if (newLabs && newLabs.length) {

                let bulkInsertArray = [];

                const promises2 = [];
                for (const key2 in newLabs) {
                  bulkInsertArray[key2] = {
                    stl_name: newLabs[key2]['labName'] ?? '',
                    short_name: newLabs[key2]['labName'] ?? '',
                    lab_name: newLabs[key2]['labFullName'] ?? '',
                    lab_code: newLabs[key2]['labId'] ?? '',
                    address: newLabs[key2]['address'] ?? '',
                    contact_person_name: newLabs[key2]['contactPerson'] ?? '',
                    email: newLabs[key2]['email'] ?? '',
                    mobile_number: newLabs[key2]['mobile'] ?? '',
                    type: newLabs[key2]['type'] ?? '',
                    state_id: stateCode,
                  };

                  const promise2 = new Promise((resolve) => {
                    resolve(key2);
                  });
                  promises2.push(promise2);
                }
                await Promise.all(promises2);

                console.log('bulkInsertArray: ', bulkInsertArray);

                if (bulkInsertArray.length) {
                  const transaction = await sequelizer.transaction();

                  await seedLabTestModel.bulkCreate(bulkInsertArray, { transaction })
                    .then(async function (item) {
                      await transaction.commit();
                      console.log('Data Inserted.');
                    })
                    .catch(async function (err) {
                      console.log('DB Insert Error: ', err.message);
                      await transaction.rollback();
                    });

                  const promise = new Promise((resolve) => {
                    resolve(key);
                  });
                  promises.push(promise);
                } else {

                  const promise = new Promise((resolve) => {
                    resolve(key);
                  });
                  promises.push(promise);
                }
              } else {
                const promise = new Promise((resolve) => {
                  resolve(key);
                });
                promises.push(promise);
              }

            } else {
              console.log('out');

              const promise = new Promise((resolve) => {
                resolve(key);
              });
              promises.push(promise);
            }
          }
          await Promise.all(promises);

          return response(res, status.OK, 200, returnResponse, internalCall);
        } else {
          return response(res, status.DATA_NOT_AVAILABLE, 200, returnResponse, internalCall);
        }
      }
    } catch (error) {
      console.log('error: ', error.message);
      returnResponse = {
        error: error.message
      }
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }

  static axiosFunction = async (dataSet = null, url, method = 'POST', token = "", headers = {}, contentType = '') => {
    let returnResponse = {};
    try {
      if (token) {
        headers['Authorization'] = 'Bearer ' + token;
      }

      const axiosOptions = {
        method: method,
        url: url,
        headers: headers,
        validateStatus: (status) => {
          return true;
        },
      };

      if (contentType && contentType === 'xml') {
        axiosOptions['headers'] = {
          'Content-Type': 'application/xml'
        };
        if (dataSet) {
          axiosOptions['data'] = (dataSet);
        }
      } else {
        if (method.trim().toLowerCase() !== 'get') {
          if (dataSet) {
            headers['Content-Type'] = 'application/json';
            headers['Content-Length'] = JSON.stringify(dataSet).length;

            axiosOptions.data = JSON.stringify(dataSet);
          }
        }
        if (method.trim().toLowerCase() === 'get') {
          if (dataSet) {
            url = url + '?';
            for (const key in dataSet) {
              url += key + '=' + dataSet[key] + '&';
            }
            url = url.slice(0, -1);
            axiosOptions.url = url;
          }
        }
      }

      const httpsAgentOptions = {
        rejectUnauthorized: true,
        secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
      };

      // console.log('axiosOptions: ', axiosOptions);

      axios.defaults.httpsAgent = new https.Agent(httpsAgentOptions);

      const response = await axios(axiosOptions);

      // console.log('axiosResponse: ', response);

      return returnResponse = {
        status: response.status,
        message: response.statusText,
        result: response.data
      }
    } catch (error) {
      return returnResponse = {
        status: 500,
        message: error.message,
        result: {}
      }
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

  static getBspProforma1sVarietiesV1 = async (req, res) => {
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
            // required: true,
            attributes: []
          },
          {
            model: varietyModel,
            // required: true,
            attributes: []
          }
        ],
        where: {
          is_active: 1,
        },
        group: ['bsp_proforma_1s.variety_code', 'm_crop_variety.variety_name', 'bsp_proforma_1s.variety_code'],
        raw: true,
        attributes: [
          [sequelize.col('bsp_proforma_1s.variety_code'), 'value'],
          [sequelize.literal('m_crop_variety.variety_name'), 'display_text'],
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
        ]
      };

      if (req.body.search) {
        if (req.body.search.year) {
          condition.where.year = {
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

      returnResponse = {
        totalVarieties: varietyCount,
        totalTargetQuantity: varietyTargetQuantity,
        nationalIndent: nationalIndentData && nationalIndentData.length && nationalIndentData[0].national_indent ? nationalIndentData[0].national_indent : 0,
        directIndent: directIndentData && directIndentData.length && directIndentData[0].direct_indent ? directIndentData[0].direct_indent : 0,
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

  static getVarietiesParentalLinev1 = async (req, res) => {
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
      let filterData = [];
      if (req.body.search) {
        if (req.body.search.crop_code) {
          filterData.push({
            crop_code: {
              [Op.eq]: req.body.search.crop_code
            },
          })
        }
        if (req.body.search.year) {
          filterData.push({
            year: req.body.search.year
          });
        }
        if (req.body.search.season) {
          filterData.push({
            season: {
              [Op.eq]: req.body.search.season
            },
          })
        }
        if (req.body.search.variety_code) {
          filterData.push({
            variety_code: {
              [Op.eq]: req.body.search.variety_code
            },
          })
        }

      }
      let lineVariety = await bspPerformaBspTwo.findAll({
        // where: {
        where: { [Op.and]: filterData ? filterData : [] },
        // },
        attributes: ['variety_line_code'],
        raw: true,
      })
      let lineVarietys = [];
      if (lineVariety && lineVariety.length > 0) {
        lineVariety.forEach((el, i) => {
          lineVarietys.push(el && el.variety_line_code ? el.variety_line_code : '')
        })
      }
      lineVarietys = lineVarietys.filter(x => x != '');
      console.log(lineVariety, 'lineVarietylineVariety')
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
        if (lineVarietys && lineVarietys.length > 0) {
          condition.where.line_variety_code = {
            [Op.notIn]: lineVarietys
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

  static getVarietiesParentalLine = async (req, res) => {
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

      let condition = {
        include: [
          {
            model: seedClassModel,
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
          [db.Sequelize.fn("Distinct", db.Sequelize.col("seed_class_id")), "value"],
          [sequelize.literal("m_seed_class.type"), 'display_text'],
          'm_seed_class.type'
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

      condition.order = [[sequelize.col('m_seed_class.type'), 'asc']];
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

  static checkQuantityData = async (req) => {
    console.log(req, 're')
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
      // console.log(quantity_data,'quantity_data')
      const colData = quantity_data.map(x => x['tag_number'])
      console.log(colData, 'colDatacolDatacolDatacolDatamnsjn')
      let seedClassIds = quantity_data.map(x => x['seed_class_id']);
      seedClassIds = await seedClassIds.filter((item, i, ar) => ar.indexOf(item) === i);
      console.log(total_quantity.length, 'total_quantity.length')
      console.log((seedClassIds), '(seedClassIds.length')

      if (seedClassIds.length !== total_quantity.length) {
        console.log(seedClassIds, 'ssdsd')
        returnResponse = {
          status: 400,
          message: status.BAD_REQUEST,
          data: {
            total_quantity: ['Invalid request data']
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
          console.log(reqQuantity, 'reqQuantity', quantity_sown)
          console.log(quantity_sown, 'quantity_sown')
          if (reqQuantity !== quantity_sown) {
            console.log(reqQuantity, 'reqQuantityreqQuantityreqQuantityreqQuantitymknm')
            returnResponse = {
              status: 400,
              message: status.BAD_REQUEST,
              data: {
                total_quantity: ['Invalid request data']
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
        // tagArray = tagArray.concat(tempArray);
        if (tempArray.length > 1) {
          if (quantity_data[key].quantity_sown != quantity_data[key].quantity_available) {
            console.log(quantity_data[key].quantity_available, 'ewwdqw')
            const index = 'quantity.' + key + '.' + 'quantity_sown';
            returnResponse = {
              status: 400,
              message: status.BAD_REQUEST,
              data: {}
            };
            returnResponse.data[index] = ['Invalid quantity shown'];
            return returnResponse;
          }
        } else {
          if (quantity_data[key].quantity_sown == 0 || (quantity_data[key].quantity_sown > quantity_data[key].quantity_available)) {
            console.log(quantity_data[key].quantity_sown, 'sown')
            console.log(quantity_data[key].quantity_available, '271')
            const index = 'quantity.' + key + '.' + 'quantity_sown';
            returnResponse = {
              status: 400,
              message: status.BAD_REQUEST,
              data: {}
            };
            returnResponse.data[index] = ['Invalid quantity shown'];
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
                tag_number: ['Invalid Tag Request Data']
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
                    quantity: ['Invalid Quantity Request Data ']
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
        'data.*.class_of_seed': 'required|string|in:bs,ns',
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

  static getFieldCodeData = async (year, season, bspc_id, crop_code, model, plotNo) => {
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

          let fieldCode = [year.toString() + '-' + ((parseInt(year) + 1).toString()).substring(2), season, bspc_id, crop_code, plot_no].join('/');
          fieldCode = fieldCode.replace(/ /g, '');

          const existingFCData = await model.findOne({
            where: {
              field_code: fieldCode,
            },
            raw: false,
            attributes: ['id']
          });

          if (existingFCData) {
            this.getFieldCodeData(year, season, bspc_id, crop_code, model, (plot_no + 1));
          } else {
            return {
              plot_no: plot_no,
              field_code: fieldCode
            };
          }
        } else {
          let fieldCode = [year.toString() + '-' + ((parseInt(year) + 1).toString()).substring(2), season, bspc_id, crop_code, plotNo].join('/');
          fieldCode = fieldCode.replace(/ /g, '');

          const existingFCData = await model.findOne({
            where: {
              field_code: fieldCode,
            },
            raw: false,
            attributes: ['id']
          });

          if (existingFCData) {
            this.getFieldCodeData(year, season, bspc_id, crop_code, model, (plotNo + 1));
          } else {
            return {
              plot_no: plotNo,
              field_code: fieldCode
            };
          }
        }
      }
    } catch (error) {
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
            required: true,
            attributes: [],
            where: {
              ...production_type
            }
          }
        ],
        where: {
          is_active: 1,
          ['$bspOneTwoVC.id$']: null,
          ['$m_crop_variety.status$']: 'variety',
          ['$bsp2CarryOver.meet_target$']: {
            [Op.ne]: 1
          },
          ...production_type
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
            model: db.carryOverSeedDetailsModel,
            as: 'bsp2CarryOver',
            on: {
              col1: sequelize.where(sequelize.col("bsp2CarryOver.variety_line_code"), "=", sequelize.col("bsp_proforma_1s.variety_line_code")),
            },
            required: true,
            attributes: []
          }
        ],
        where: {
          is_active: 1,
          ['$bspOneTwoVC.id$']: null,
          ['$m_crop_variety.status$']: 'hybrid',
          ['$bsp2CarryOver.meet_target$']: {
            [Op.ne]: 1
          },
          ...production_type
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
          ...production_type
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
          }
        ],
        where: {
          is_active: 1,
          ['$directIndentVC.id$']: null,
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
      console.log(normalVarietyList, 'normalVarietyList')
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

      mergedVarietyArray = await directIndentVarietyList.concat(bsp1VarietyList);
      // let mergedVarietyArray = await directIndentVarietyList.concat(bsp1VarietyList);
      mergedVarietyArray = await mergedVarietyArray.map(x => x['variety_code']);
      mergedVarietyArray = await mergedVarietyArray.filter((item, i, ar) => ar.indexOf(item) === i);

      const nationalIndentVarieties = await nationalIndentVarietyList.map(x => x['variety_code']);
      const directIndentVarieties = await directIndentVarietyListTotal.map(x => x['variety_code']);

      const tempArray = nationalIndentVarieties.concat(directIndentVarieties);
      const uniqueNationalDirectVarieties = await tempArray.filter((item, i, ar) => ar.indexOf(item) === i);
      console.log("mergedVarietyArray===", mergedVarietyArray)
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
      console.log(nationalIndentVarietyList, 'nationalIndentVarietyList')
      const nationalTempArray = await nationalIndentVarietyList.map(x => x['bsp_proforma_1_bspc_ids']);
      const resultStringNational = await this.mergeArraysToString(nationalTempArray);
      let nationalData = null;
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

      console.log(resultStringNational, 'resultStringNational')

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
      const nationalIndentQuantity = nationalData && nationalData.length && nationalData[0].sum ? parseFloat(nationalData[0].sum) : 0;
      const directIndentQuantity = directData && directData.length && directData[0].sum ? parseFloat(directData[0].sum) : 0;
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
  static getBspProforma1sVarietiesLevel2Second = async (req, res) => {
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
    const { internalCall } = req.body;
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
            const user_id = records[key]['dataValues'].user_id;
            const crop_code = records[key]['dataValues'].crop_code;
            const variety_code = records[key]['dataValues'].variety_code;
            const variety_line_code = records[key]['dataValues'].variety_line_code;

            const updateData = {
              is_freezed: 1,
              field_code: null,
              plot_no: null,
              ref_no: id,
            };

            const fieldCodeData = await this.getFieldCodeData(year, season, user_id, crop_code, bspPerformaBspTwo)

            if (!(fieldCodeData && Object.keys(fieldCodeData).length)) {
              returnResponse = {
                field_code: ['Invalid field code']
              };
              return response(res, status.BAD_REQUEST, 400, returnResponse, internalCall);
            }

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
        'data.class_of_seed': 'required|string|in:bs,ns',
        'data.quantity_of_ns_shown': 'required_if:data.class_of_seed,ns|string',
        'data.quantity_of_bs_shown': 'required_if:data.class_of_seed,bs|string',
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
        returnResponse = validation.errors.errors;
        return response(res, status.BAD_REQUEST, 400, returnResponse, internalCall);
        // returnResponse = {};
        // for (let key in rules) {
        //   const error = validation.errors.get(key);
        //   if (error.length) {
        //     returnResponse[key] = error;
        //   }
        // }
        // // console.log(returnResponse,'returnResponse',validation)
        // return response(res, status.BAD_REQUEST, 400, returnResponse, internalCall);
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
        console.log(returnResponse, 'returnResponsereturnResponse')
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

  static checkEditQuantityData = async (req) => {
    let returnResponse = {
      status: 200,
      message: status.OK,
      data: {}
    };
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
            total_quantity: ['Invalid request data']
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
                total_quantity: ['Invalid request data']
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
          if (quantity_data[key].quantity_sown != quantity_data[key].quantity_available) {
            const index = 'quantity.' + key + '.' + 'quantity_sown';
            returnResponse = {
              status: 400,
              message: status.BAD_REQUEST,
              data: {}
            };
            returnResponse.data[index] = ['Invalid quantity shown'];
            return returnResponse;
          }
        } else {
          if (quantity_data[key].quantity_sown == 0 || (quantity_data[key].quantity_sown > quantity_data[key].quantity_available)) {
            const index = 'quantity.' + key + '.' + 'quantity_sown';
            returnResponse = {
              status: 400,
              message: status.BAD_REQUEST,
              data: {}
            };
            returnResponse.data[index] = ['Invalid quantity shown'];
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
        console.log('ssds')
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
          console.log(tagIdArray, 'tagIdArray')
          let quantDatalength = 0;
          const promises = [];
          for (const key2 in tagIdArray) {
            const tagId = tagIdArray[key2];
            const tagData = tagIdArray;
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

            let quantityTagDataremaming = quantityTagData && quantityTagData[0] && quantityTagData[0].weight_remaining ? parseFloat(quantityTagData[0].weight_remaining) : 0
            const tempWeightRemaining = quantityTagDataremaming + parseFloat(bsp2SeedTagQuantitySown);
            if (!tempWeightRemaining) {
              returnResponse = {
                status: 400,
                message: status.BAD_REQUEST,
                data: {
                  tag_number: ['Tag Quantity Unavailable']
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

          if (!(quantDatalength && quantDatalength === tagNumberLength)) {
            returnResponse = {
              status: 400,
              message: status.BAD_REQUEST,
              data: {
                tag_number: ['Invalid Tag Request Data']
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
        if (req.body.search.seed_class_id) {
          condition.where.seed_class_id = {
            [Op.in]: req.body.search.seed_class_id.toString().split(',')
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

 
  static editBspProforma2sDataSecond = async (req, res) => {
    let returnResponse = {};
    const { internalCall } = req.body;
    try {
      let rules = {
        'bspc_2_id': 'integer',
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
  static getCommnetsList = async (req, res) => {
    try {

      let returnResponse = {}
      let condition = {
        attributes: ['id', 'comment', 'type'],
        where: {
        }
      }

      if (req.query) {
        if (req.query.type) {
          condition.where.type = req.query.type
        }
      }

      let dataList = await db.commentsModel.findAll(condition);
      returnResponse = dataList;
      return response(res, status.DATA_AVAILABLE, 200, returnResponse)
    } catch (error) {
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 500, []);
    }
  }
  static indentPermission = async (req, res) => {
    let internalCall = {};
    try {
      let rules = {
        'season': 'string|required',
        'year': 'required',
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
        return response(res, status.BAD_REQUEST, 400, errorResponse, internalCall)
      }
      let { year, season } = req.body;
      let condition = {
        where: {
          year: parseInt(year),
          season: season.trim().toUpperCase()
        }
      };
      let indentPermission = await db.mIndentPermissionsModel.findOne(condition);
      if (indentPermission) {
        return response(res, status.DATA_AVAILABLE, 200, indentPermission);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, []);
      }

    } catch (error) {
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 500, []);
    }
  }
  static unfreezeIndentSpaSecond = async (req, res) => {
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

          where: {
            // is_freeze: 1,
          },

        };
        let condition2 = {

          where: {
            is_freeze: 1,
          },
          raw: true

        };

        if (req.body.search) {
          if (req.body.search.year) {
            condition.where.year = {
              [Op.in]: req.body.search.year.toString().split(',')
            };
            condition2.where.year = {
              [Op.in]: req.body.search.year.toString().split(',')
            };
          }
          if (req.body.search.season) {
            condition.where.season = {
              [Op.in]: req.body.search.season.toString().split(',')
            };
            condition2.where.season = {
              [Op.in]: req.body.search.season.toString().split(',')
            };
          }
          if (req.body.search.crop_code) {
            condition.where.crop_code = {
              [Op.in]: req.body.search.crop_code.toString().split(',')
            };
            condition2.where.crop_code = {
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
        const indentOfBreederseedData = await db.indentOfBreederseedModel.findAll(condition2);
        console.log(indentOfBreederseedData, 'indentOfBreederseedData')
        // else {
        let returnResponseData = []
        const updateIds = await data.map(datum => datum['id']);
        const indenterIds = await data.map(datum => datum['indenter_id']);
        const indentOfBreederseedDataId = await indentOfBreederseedData.map(datum => datum['user_id']);
        // console.log(updateIds)
        indenterIds.push(...indentOfBreederseedDataId)
        console.log('updateIds', indentOfBreederseedDataId)
        const updateData = {
          is_freeze: 0
        };
        const updateDataofIndentor = {
          is_freeze: 0,
          is_indenter_freeze: 0,
          icar_freeze: 0,
          is_forward: 0
        };
        await db.indentOfBreederseedModel.update(updateDataofIndentor, {
          where: {
            user_id: {
              [Op.in]: indenterIds
            },
            year: req.body.search.year.toString().split(','),
            season: req.body.search.season.toString().split(','),
            crop_code: req.body.search.crop_code.toString().split(','),
            // state_code:req.body.search.state_code.toString().split(','),
          }
        }).then(function (item) {
          returnResponseData.push({
            count: item[0]
          })
        }).catch(function (error) {
          returnResponseData.push({
            error: error.message
          })
        })

        await indenterSPAModel.update(updateData, {
          where: {
            id: {
              [Op.in]: updateIds,
            },
            year: req.body.search.year.toString().split(','),
            season: req.body.search.season.toString().split(','),
            crop_code: req.body.search.crop_code.toString().split(','),
            state_code: req.body.search.state_code.toString().split(','),
          }
        }).then(function (item) {
          returnResponseData.push({
            count: item[0]
          })
        }).catch(function (error) {
          returnResponseData.push({
            error: error.message
          })
        })

        console.log(returnResponseData, 'returnResponseData')
        // .then(function (item) {
        //   returnResponse = {
        //     count: item[0]
        //   }
        // }).catch(function (error) {
        //   returnResponse = {
        //     error: error.message
        //   }
        //   console.log(returnResponse);
        //   response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
        // });

        response(res, status.DATA_UPDATED, 200, returnResponseData, internalCall);

        // const isIndenterFreezeData = await data.filter((datum) => {
        //   return parseInt(datum.is_indenter_freeze) === 1
        // });

        // if (isIndenterFreezeData && isIndenterFreezeData.length) {
        //   console.log(isIndenterFreezeData,'hiiiiiiiiii')
        //   response(res, 'Indents are already freezed by seed division', 400, returnResponse, internalCall);
        // } else {

        // }
        //  }
        // if (!(data && data.length && indentOfBreederseedData && indentOfBreederseedData.length)) {
        //   response(res, status.DATA_NOT_AVAILABLE, 200, returnResponse, internalCall);
        // } 
      }
    } catch (error) {
      returnResponse = {
        error: error.message
      }
      console.log(returnResponse);
      response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }
  static getAllDesignationProfile = async (req, res) => {
    let data = {};
    try {
      const { type } = req.body.search;
      if (type) {
        data = await designationModel.findAll(
          {
            where: {
              type: type
            },
            attributes: ['name', 'id']
          }
        );
      } else {
        data = await designationModel.findAll(
          {
            where: {
              // type: type
            },
            attributes: ['name', 'id']
          }
        );
      }

      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getAgroEcologicalRegions = async (req, res) => {
    try {
      let agroData = await db.mAgroEcologicalRegionsModel.findAll({
        attributes: ['id', 'regions_name']
      });
      if (agroData) {
        return response(res, status.DATA_NOT_AVAILABLE, 200, agroData)
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, [])
      }
    } catch (error) {
      console.log(error);
      return response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getCropBasicData = async (req, res) => {
    try {
      let condition = {
        attributes: ['id', 'scientific_name', 'hindi_name'],
        where: {
        }
      };
      if (req.body) {
        if (req.body.crop_group) {
          condition.where.group_code = req.body.crop_group
        }
        if (req.body.crop_code) {
          condition.where.crop_code = req.body.crop_code
        }
      }
      let cropData = await cropModel.findAll(condition);
      if (cropData) {
        return response(res, status.DATA_NOT_AVAILABLE, 200, cropData)
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, [])
      }
    } catch (error) {
      console.log(error);
      return response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }



}
module.exports = UserController


