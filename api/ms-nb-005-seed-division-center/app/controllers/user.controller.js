require('dotenv').config()
const response = require('../_helpers/response')
const status = require('../_helpers/status.conf')
const db = require("../models");
let Validator = require('validatorjs');
const stateModel = db.stateModel;
const districtModel = db.districtModel;
const userModel = db.userModel;
const addcropModel = db.addcropModel;
const cropNameModel = db.cropNameModel;
const cropModel = db.cropModel;
const cropCharactersticsModel = db.cropCharactersticsModel;
// const indentOfBreederseedModel = db.indentOfBreederseedModel;
const auditTaildbModel = db.auditTail;
const varietyLinesModel = db.varietyLineModel;
const varietyCategoryMappingModel = db.varietyCategoryMappingModel;
const mCategoryOrgnization = db.mCategoryOrgnization;
const { S3Client, GetObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
const uuid = require("uuid").v4;
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

//crop group model 
const cropGroupModel = db.cropGroupModel;
const AWS = require('aws-sdk');

//crop veriety model
const cropVerietyModel = db.cropVerietyModel;

const paginateResponse = require("../_utility/generate-otp");

const sequelize = require('sequelize');
const ConditionCreator = require('../_helpers/condition-creator');
const { crop } = require('imagemagick');
const { agencyDetailModel, seedMultiplicationRatioModel, maxLotSizeModel, indentOfBreederseedModel } = require('../models');
const seed_multiplication_ratioModel = require('../models/seed_multiplication_ratio.model');
const { where } = require('sequelize');
// const { indenterModel } = require('../../../ms-nb-003-breeder/app/models');
const Op = require('sequelize').Op;
class UserController {

  static getAddCropList = async (req, res) => {
    const { internalCall } = req.body;
    let returnResponse = {};
    try {

      let rules = {
        'id': 'string'
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

      let { page, pageSize } = req.body;

      if (!page) page = 1;


      let condition = {

        where: {
          is_active: 1
        },
        raw: false,

      };



      const sortOrder = req.body.sort ? req.body.sort : 'created_at';
      const sortDirection = req.body.order ? req.body.order : 'DESC';

      if (page && pageSize) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }

      condition.order = [[sortOrder, sortDirection]];

      if (req.body) {
        console.log(req.body, 'body');
        if (req.body.id) {
          console.log(req.body.id, 'body');
          condition.where.id = parseInt(req.body.id);
          req.body.includeAll = 1;
          delete condition.where.is_active;
        }
        if (req.body.crop_group) {

          condition.where.crop_group = (req.body.crop_group);

        }
        if (req.body.crop_name) {

          condition.where.crop_name = (req.body.crop_name);

        }

      }
      const queryData = await addcropModel.findAndCountAll(condition);
      returnResponse = await paginateResponse(queryData, page, pageSize);

      // console.log(returnResponse.);


      return response(res, status.OK, 200, returnResponse);

    } catch (error) {
      returnResponse = {
        message: error.message
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }

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

  static getAddCropChararactersticsList = async (req, res) => {
    const { internalCall } = req.body;
    let returnResponse = {};
    try {

      let rules = {
        'id': 'integer'
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

      let { page, pageSize } = req.body;

      if (!page) page = 1;


      let condition = {

        where: {
          is_active: 1
        },
        raw: false,

      };



      const sortOrder = req.body.sort ? req.body.sort : 'created_at';
      const sortDirection = req.body.order ? req.body.order : 'DESC';

      if (page && pageSize) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }

      condition.order = [[sortOrder, sortDirection]];

      if (req.body.search) {
        if (req.body.search.id) {
          condition.where.id = parseInt(req.body.search.id);
          req.body.includeAll = 1;
          delete condition.where.is_active;
        }


      }
      const queryData = await cropCharactersticsModel.findAndCountAll(condition);
      returnResponse = await paginateResponse(queryData, page, pageSize);

      // console.log(returnResponse.);


      return response(res, status.OK, 200, returnResponse);

    } catch (error) {
      returnResponse = {
        message: error.message
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }
  static deletelist = async (req, res) => {
    try {
      const id = req.body.id;
      const data = await addcropModel.destroy({
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
  static viewState = async (req, res) => {
    let data = {};
    try {
      data = await stateModel.findAll({
        order: [['state_name', 'ASC']]
      });
      // res.send(data)

      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static viewCropName = async (req, res) => {
    let data = {};
    try {
      let condition = {
        where: {

        }
      };
      if (req.body.search) {
        if (req.body.search.group_code) {
          condition.where.group_code = req.body.search.group_code;
        }
      }
      condition.order = [['crop_name', 'ASC']];
      data = await cropNameModel.findAll();
      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static viewCropGroup = async (req, res) => {
    let data = {};
    try {
      let condition = {
        attributes: ['group_name', 'group_code']
      };

      const sortOrder = req.body.sort ? req.body.sort : 'group_name';
      const sortDirection = req.body.order ? req.body.order : 'ASC';
      condition.order = [[sortOrder, sortDirection]];
      if (req.body.search) {
        if (req.body.search.group_code) {
          condition.where.group_code = req.body.search.group_code;
        }
        if (req.body.search.user_role) {
          if (req.body.search.user_role == "ICAR") {
            condition.where.group_code = { [Op.like]: "A%" };
          }
          else if (req.body.search.user_role == "HICAR") {
            condition.where.group_code = { [Op.like]: "H%" };
          }
        }
      }
      data = await cropGroupModel.findAll(condition);


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

  static editupdateCrop = async (req, res) => {
    try {
      const id = req.body.id;
      const data = await addcropModel.update({
        botanic_name: req.body.botanic_name,
        crop_name: req.body.crop_name,
        crop_group: req.body.crop_group,
        srr: req.body.srr,
        season: req.body.season,
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
    //   console.log(error)
    //   response(res, status.DATA_NOT_AVAILABLE, 500)
    // }
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
      console.log(error)
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

  // static addCrop = async (req, res) => {
  //   try{
  //     const data = cropModel.build({
  //       botanic_name: req.body.botanic_name,
  //       // crop_code: req.body.crop_code,
  //       crop_name: req.body.crop_name,
  //       crop_group: req.body.crop_group,
  //       group_code: req.body.group_code,
  //       season: req.body.season,
  //       srr: req.body.srr,

  //     });
  //     await data.save();
  //     return response(res, status.DATA_SAVE, 200, data)
  //   }catch (error) {
  //     return response(res, status.DATA_NOT_AVAILABLE, 404)
  //   }
  // }

  static addCropList = async (req, res) => {
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


  static addCrop = async (req, res) => {
    let dataToSave = {};
    if (req.body.data) {
      dataToSave = JSON.parse(req.body.data);
    }
    else {
      dataToSave = req.body;
    }

    let returnResponse = {};
    try {

      let rules = {
        ' botanic_name': 'string',
        // crop_code: req.body.crop_code,
        'crop_name': 'string',
        ' crop_group': 'string',
        // 'group_code': 'string',
        'season': 'string',
        'srr': 'string'

      };

      let validation = new Validator(dataToSave, rules);

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
      let subscriberInsertData = {
        botanic_name: req.body.botanic_name,
        // crop_code: req.body.crop_code,
        crop_name: req.body.crop_name,
        crop_group: req.body.crop_group,
        // group_code: req.body.group_code,
        season: req.body.season,
        srr: req.body.srr,
      }

      // let subscriberData = await cropModel.findAll({
      //   where: {
      //     [Op.or]: [{ id: req.body.id }],
      //     is_active: 1
      //   }
      // });

      let updateSubscriber = false;
      // if ((subscriberData && subscriberData.length)) {
      //   updateSubscriber = true;
      // }

      let errorMessage = {};
      let subscriberResponse = {};
      // if (!updateSubscriber) {
      await addcropModel.create(subscriberInsertData).then(function (item) {
        subscriberResponse = item['_previousDataValues'];;
      }).catch(function (err) {

        errorMessage = {
          success: false,
          message: err.message
        };
        console.log('Subscriber Table Error: ', err);
      });

      returnResponse.subscriberDetails = subscriberResponse;

      return response(res, status.OK, 200, returnResponse);
      // }
      // else {
      //   subscriberInsertData.is_active = 1;
      //   await subscriberModel.update(subscriberInsertData, { where: { id: subscriberData[0].id } }).then(function (item) {
      //     subscriberResponse = item['_previousDataValues'];
      //   }).catch(function (err) {
      //     isDbError = true;
      //     errorMessage = {
      //       success: false,
      //       message: err.message
      //     };
      //     console.log('Subscriber Table Error: ', errorMessage);
      //   });
      //   returnResponse.subscriberDetails = subscriberResponse = subscriberData[0];
      // }
    } catch (error) {
      returnResponse = {
        message: error.message
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }

  static updateCrop = async (req, res) => {
    let dataToSave = {};
    if (req.body.data) {
      dataToSave = JSON.parse(req.body.data);
    }
    else {
      dataToSave = req.body;
    }

    let returnResponse = {};
    try {

      let rules = {
        'id': 'string',
        ' botanic_name': 'string',
        // crop_code: req.body.crop_code,
        'crop_name': 'string',
        ' crop_group': 'string',
        // 'group_code': 'string',
        'season': 'string',
        'srr': 'string'

      };

      let validation = new Validator(dataToSave, rules);

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
      let subscriberInsertData = {
        id: req.body.id,
        botanic_name: req.body.botanic_name,
        // crop_code: req.body.crop_code,
        crop_name: req.body.crop_name,
        crop_group: req.body.crop_group,
        // group_code: req.body.group_code,
        season: req.body.season,
        srr: req.body.srr,
      }

      // let subscriberData = await cropModel.findAll({
      //   where: {
      //     [Op.or]: [{ id: req.body.id }],
      //     is_active: 1
      //   }
      // });

      let updateSubscriber = false;
      // if ((subscriberData && subscriberData.length)) {
      //   updateSubscriber = true;
      // }

      let errorMessage = {};
      let subscriberResponse = {};
      // if (!updateSubscriber) {
      await cropModel.update(subscriberInsertData).then(function (item) {
        subscriberResponse = item['_previousDataValues'];;
      }).catch(function (err) {

        errorMessage = {
          success: false,
          message: err.message
        };
        console.log('Subscriber Table Error: ', err);
      });

      returnResponse.subscriberDetails = subscriberResponse;

      return response(res, status.OK, 200, returnResponse);

    } catch (error) {
      returnResponse = {
        message: error.message
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }
  static viewCrop1 = async (req, res) => {

    try {
      let condition = {

      };
      let { page, pageSize, search } = req.body;
      if (page === undefined) page = 1;
      if (pageSize === undefined) pageSize = 10; // set pageSize to -1 to prevent sizing

      if (page > 0 && pageSize > 0) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }

      if (search) {
        condition.where = {};
        for (let index = 0; index < search.length; index++) {
          const element = search[index];
          // if (element.columnNameInItemList.toLowerCase() == "croupGroup.value") {
          //   condition.where["croupGroup"] = element.value;
          // }
          if (element.columnNameInItemList.toLowerCase() == "crop.value") {
            condition.where["cropName"] = element.value;
          }
        }
      }
      // data = await cropModel.findAll({
      //   order: [['id', 'ASC']]
      // });

      condition.order = [['crop_name', 'ASC']];
      let data = await cropModel.findAndCountAll(condition);


      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    }

  }

  static distinctCrop = async (req, res) => {
    let data = {};
    try {
      let condition = {

        raw: false,
        attributes: [
          'crop_group',

        ]

      };
      condition.group = [['crop_group']];
      data = await cropModel.findAll(condition);
      // res.send(data)

      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static cropName = async (req, res) => {
    let returnResponse = {};
    try {
      let condition = {
        where: {
          is_active: 1
        }
      };

      if (req.body.search) {
        if (req.body.search.crop_group) {
          condition.where.crop_group = req.body.search.crop_group;
        }
        if (req.body.search.group_code) {
          condition.where.group_code = req.body.search.group_code;
        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = req.body.search.crop_code;
        }
        if (req.body.search.user_role) {
          if (req.body.search.user_role == "ICAR") {
            condition.where.crop_code = { [Op.like]: "A%" };
          }
          else if (req.body.search.user_role == "HICAR") {
            condition.where.crop_code = { [Op.like]: "H%" };
          }
        }
      }

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
  static cropIndentingdata = async (req, res) => {
    let returnResponse = {};
    try {
      let cropGroupData;
      if (req.body.search.group_code) {
        cropGroupData = {
          where: {
            group_code: req.body.search.group_code
          }
        }
      } let condition = {
        include: [
          {
            model: cropModel,


            ...cropGroupData
          }
        ],
        raw: true,
        attributes: [
          [sequelize.literal('DISTINCT(m_crop.group_code)'), 'group_code'],
          // [sequelize.fn('DISTINCT', sequelize.col('crop_name')) ,'crop_name'],
          // 'crop_code'

          [sequelize.col('m_crop.crop_code'), 'crop_code'],
          [sequelize.col('m_crop.crop_name'), 'crop_name'],
        ],
        where: {}
      };

      if (req.body.search) {
        if (req.body.search.crop_group) {
          condition.where.crop_group = req.body.search.crop_group;
        }
        if (req.body.search.group_code) {
          condition.where.group_code = req.body.search.group_code;
        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = req.body.search.crop_code;
        }
        if (req.body.search.user_role) {
          if (req.body.search.user_role == "ICAR") {
            condition.where.crop_code = { [Op.like]: "A%" };
          }
          else if (req.body.search.user_role == "HICAR") {
            condition.where.crop_code = { [Op.like]: "H%" };
          }
        }
      }

      // condition.order = [['crop_name', 'ASC']];/
      // condition
      returnResponse = await indentOfBreederseedModel.findAll(condition);
      return response(res, status.OK, 200, returnResponse);
    } catch (error) {
      returnResponse = {
        message: error.message
      };
      console.log(error)
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }

  static cropCode = async (req, res) => {
    let returnResponse = {};
    try {
      let condition = {
        where: {}
      };

      if (req.body.search) {
        if (req.body.search.crop_name) {
          condition.where.crop_name = req.body.search.crop_name;
        }
      }

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
  static getCropGroupCode = async (req, res) => {
    let returnResponse = {};
    try {
      let condition = {
        where: {}
      };

      if (req.body.search) {
        if (req.body.search.group_name) {
          condition.where.group_name = req.body.search.group_name;
        }
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
      console.log(error)
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
      console.log(error)
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
      // console.log('userInsertData',userInsertData);

      // await userModel.create(userInsertData).then(function (item) {
      //   userResponse = item['_previousDataValues'];
      // }).catch(function (err) {
      //   isDbError = true;
      //   errorMessage = {
      //     success: false,
      //     message: err.message
      //   };
      //   console.log('User Table Error: ', errorMessage);
      // });
      // returnResponse.userDetails = userResponse;


      return response(res, status.DATA_SAVE, 200, data)
    } catch (error) {
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    }
  }

  static viewUser = async (req, res) => {
    let data = {};
    try {
      data = await userModel.findAll();
      // res.send(data)

      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
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
      console.log(error)
      response(res, status.DATA_NOT_SAVE, 500)
    }
  }

  static filterData = async (req, res) => {
    let data = {};

    try {
      let condition = {
        include: [

        ],
        where: {

        }
      };
      condition.order = [['crop_name', 'ASC']];
      if (req.body.search) {
        if (req.body.search.group_code) {
          condition.where.group_code = (req.body.search.group_code);
        }
      }
      data = await cropModel.findAll(condition);
      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
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
      console.log(error)
      response(res, status.DATA_NOT_SAVE, 500)
    }
  }

  static addCropCharacterstics = async (req, res) => {
    let dataToSave = {};
    if (req.body.data) {
      dataToSave = JSON.parse(req.body.data);
    }
    else {
      dataToSave = req.body;
    }

    let returnResponse = {};
    try {

      let rules = {
        // 'id': 'integer',
        'crop_group': 'string',
        'crop_name': 'string',
        'variety_code': 'string',
        'variety_name': 'string',
        'notified': 'integer',
        'notification_date': 'date',
        'notified_number': 'string',
        'meeting_number': 'string',
        'year_of_release': 'date',
        'select_type': 'integer',
        'developed_by': 'integer',


      };

      let validation = new Validator(dataToSave, rules);

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
      let subscriberInsertData = {
        // id: req.body.id,
        crop_group: req.body.crop_group,
        crop_name: req.body.crop_name,
        variety_code: req.body.variety_code,
        variety_name: req.body.variety_name,
        notified: req.body.notified,
        notification_date: req.body.notification_date,
        notified_number: req.body.notified_number,
        meeting_number: req.body.meeting_number,
        year_of_release: req.body.year_of_release,
        select_type: req.body.select_type,
        developed_by: req.body.developed_by
      }
      // console.log('subscriberInsertData============>', subscriberInsertData);
      // let subscriberData = await cropCharactersticsModel.findAll({
      //   where: {
      //     [Op.or]: [{ id: req.body.id }],
      //     is_active: 1
      //   }
      // });
      let updateSubscriber = false;
      // if ((subscriberData && subscriberData.length)) {
      //   updateSubscriber = true;
      // }
      let errorMessage = {};
      let subscriberResponse = {};
      // if (!updateSubscriber) {
      await cropCharactersticsModel.create(subscriberInsertData).then(function (item) {
        subscriberResponse = item['_previousDataValues'];
      }).catch(function (err) {

        errorMessage = {
          success: false,
          message: err.message
        };
        console.log('Subscriber Table Error: ', err);
      });

      returnResponse.subscriberDetails = subscriberResponse;
      return response(res, status.OK, 200, returnResponse);
      // } 
      // else {
      // subscriberInsertData.is_active = 1;
      //   await cropCharactersticsModel.update(subscriberInsertData, { where: { id: subscriberData[0].id } }).then(function (item) {
      //     subscriberResponse = item['_previousDataValues'];
      //   }).catch(function (err) {
      //     isDbError = true;
      //     errorMessage = {
      //       success: false,
      //       message: err.message
      //     };
      //     console.log('Subscriber Table Error: ', err);
      //   });
      //   returnResponse.subscriberDetails = subscriberResponse 
      // }

    } catch (error) {
      returnResponse = {
        message: error.message
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }
  static addCropList = async (req, res) => {
    try {
      const dataRow = {
        year: req.body.yearofIndent.value,
        season_id: req.body.season.value,
        crop_code: req.body.cropName.crop_code,
        variety_id: req.body.varietyName.value,
        variety_notification_year: req.body.yearofIndent.name,
        indent_quantity: req.body.indentQuantity,
        user_id: req.body.userId || 1,
        unit: req.body.unitKgQ.value
      };

      let tabledAlteredSuccessfully = false;
      if (req.params && req.params["id"]) {
        await indentOfBreederseedModel.update(dataRow, { where: { id: req.params["id"] } }).then(function (item) {
          tabledAlteredSuccessfully = true;
        }).catch(function (err) {

        });
      }
      else {
        const existingData = await indentOfBreederseedModel.findAll(
          {
            where: {
              year: req.body.yearofIndent.value,
              crop_code: req.body.cropName.crop_code,
              variety_id: req.body.varietyName.value.toString(),
              user_id: req.body.userId || 1
            }
          }
        );
        if (existingData === undefined || existingData.length < 1) {
          const data = indentOfBreederseedModel.build(dataRow);
          await data.save();
          tabledAlteredSuccessfully = true;
        }
      }

      if (tabledAlteredSuccessfully) {
        return response(res, status.DATA_SAVE, 200, {})
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    }
  }
  // static deleteCropVerietyId = async (req, res) => {
  //   try {
  //     cropVerietyModel.destroy({
  //       where: {
  //         id: req.params.id
  //       }
  //     });
  //     response(res, status.DATA_DELETED, 200, {});
  //   }
  //   catch (error) {
  //     return response(res, status.DATA_NOT_AVAILABLE, 404)
  //   }
  // }



  //   static useridByLogOn = async (req, res) => {
  //     try {
  //         const data = await auditTaildbModel.findOne({
  //             where: {
  //                 User: req.params.id,
  //             },
  //             attributes: ['created_at'],
  //             order: [['id', 'desc']]
  //         });
  //         if (!data) {
  //             return res.status(404).json({ message: 'Logon data not found for the specified user ID' });
  //         }
  //      const seedUserData = { "logon": data.created_at };
  //          return res.status(200).json(seedUserData);
  //     } catch (error) {
  //         // If an error occurs during the process, log the error and send an appropriate response
  //         return res.status(500).json({ message: 'Internal server error' });
  //     }
  // }

  static useridByLogOn = async (req, res) => {

    try {
      const data = await auditTaildbModel.findAll({
        where: {
          [Op.and]: [
            {
              user_id: {
                [Op.not]: null
              }
            },
            {
              user_type:
                req.body && req.body.user_type ? req.body.user_type : 'BPC'
            }
          ]
        },
        attributes: ['created_at', 'user_id', 'id', 'user_type'],
        order: [['id', 'desc']]
      });
      if (!data) {
        return res.status(404).json({ message: 'Logon data not found for the specified user ID' });
      }
      else {
        //const seedUserData = { "logon": data.created_at };
        return res.status(200).json(data);
      }

    } catch (error) {
      console.log(error);
      // If an error occurs during the process, log the error and send an appropriate response
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  static deleteCropVerietyId = async (req, res) => {
    try {
      let varietyCode = await cropVerietyModel.findOne({
        where: {
          id: req.params.id,
        },
        attributes: ["variety_code"],
      });
      console.log('varietyCode===', varietyCode)
      // return;
      await varietyLinesModel.destroy({
        where: {
          variety_code: varietyCode.variety_code,
        },
      });
      await varietyCategoryMappingModel.destroy({
        where: {
          variety_code: varietyCode.variety_code,
        },
      });
      await cropVerietyModel.destroy({
        where: {
          id: req.params.id,
        },
      });
      response(res, status.DATA_DELETED, 200, {});
    }
    catch (error) {
      return response(res, status.DATA_NOT_AVAILABLE, 404);
    }
  }


  static getVarietyList = async (req, res) => {
    try {
      const { crop_code } = req.body
      if (!crop_code) {
        return response(res, status.BAD_REQUEST, 404, {
          message: "crop_code is required in the request body.",
        });
      }
      const varietyList = await db.varietyModel.findAll({
        attributes: ['variety_code', "variety_name"],
        where: {
          crop_code: crop_code
        },
        order: [['variety_name', 'ASC']],
      });
      return response(res, status.BAD_REQUEST, 200, varietyList, {
        message: "Variety data retrieved successfully",
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // static addVarietyData = async (req) => {
  //   try {
  //     const { perental_line_array, user_id, category_array, variety_code } = req;
  //     const crop_code = req.crop_name;

  //     const generateNextVarietyCode = async () => {
  //       try {
  //         const latestVariety = await cropVerietyModel.findOne({
  //           attributes: ['variety_code'],
  //           order: [['variety_code', 'DESC']]
  //         });

  //         let nextVarietyCode = 'O01';
  //         if (latestVariety && latestVariety.variety_code) {
  //           const lastCode = parseInt(latestVariety.variety_code.substring(1), 10);
  //           if (!isNaN(lastCode)) {
  //             const nextNumber = lastCode + 1;
  //             nextVarietyCode = `O${nextNumber.toString().padStart(2, '0')}`;
  //           }
  //         }
  //         return nextVarietyCode;
  //       } catch (error) {
  //         console.error("Error generating variety_code:", error);
  //         throw error;
  //       }
  //     };

  //     if (perental_line_array && perental_line_array.length > 0) {
  //       for (const lineData of perental_line_array) {
  //         if (lineData.other === true) {
  //           const nextVarietyCode = await generateNextVarietyCode();
  //           lineData.line_variety_code = nextVarietyCode;
  //           const { line_variety_name } = lineData;
  //           const checkVarietyName = await cropVerietyModel.findOne({
  //             where: {
  //               variety_name: line_variety_name
  //             }
  //           });
  //           if (checkVarietyName) {
  //             console.log("Variety Name is already registered.");
  //             return { status: 202, message: "Variety Name is already registered." };
  //           }
  //           try {
  //             await cropVerietyModel.create({
  //               variety_name: line_variety_name,
  //               status: 'other',
  //               variety_code: nextVarietyCode,
  //               crop_code: crop_code,
  //               user_id: user_id
  //             });
  //           } catch (error) {
  //             console.error("Error creating entry in cropVerietyModel:", error);
  //           }
  //         }

  //         try {
  //           await varietyLinesModel.create(lineData);
  //         } catch (error) {
  //           console.error("Error creating entry in varietyLinesModel:", error);
  //         }
  //       }
  //     }

  //     for (const categoryData of category_array) {
  //       try {
  //         const createdCategoryMapping = await varietyCategoryMappingModel.create({
  //           m_variety_category_id: categoryData.id,
  //           variety_code: variety_code,
  //         });

  //         console.log(`Created entry in varietyCategoryMappingModel with ID: ${createdCategoryMapping.id}`);
  //       } catch (error) {
  //         console.error("Error storing data in varietyCategoryMappingModel:", error);
  //       }
  //     }

  //     return { status: 200, message: "Data stored successfully." };
  //   } catch (error) {
  //     console.error("Error storing data:", error);
  //     return { status: 500, message: "Internal server error" };
  //   }
  // };

  static addVarietyData = async (req, isUpdate) => {
    try {
      const { perental_line_array, user_id, category_array, variety_code } = req;
      const crop_code = req.crop_name;
      if (perental_line_array.length > 4) {
        console.log("Only 4 perental line can add.");
        return { status: 202, message: "Only 4 perental line can add." };
      }
      const generateNextVarietyCode = async () => {
        try {
          const latestVariety = await cropVerietyModel.findOne({
            where: { status: 'other' },
            attributes: ['variety_code'],
            order: [['variety_code', 'DESC']]
          });
          if (latestVariety && latestVariety.variety_code) {
            const numericPart = parseInt(latestVariety.variety_code.slice(1), 10);
            const nextNumericPart = numericPart + 1;
            const nextVarietyCode = 'A' + nextNumericPart.toString().padStart(5, '0');
            return nextVarietyCode;
          } else {
            return 'A00001';
          }
        } catch (error) {
          console.error("Error generating variety_code:", error);
          throw error;
        }
      };
      if (perental_line_array && perental_line_array.length > 0) {
        if (isUpdate) {
          await varietyLinesModel.destroy({
            where: {
              variety_code: variety_code,
            },
          });
        }
        for (const lineData of perental_line_array) {
          if (lineData.other === true) {
            const nextVarietyCode = await generateNextVarietyCode();
            lineData.line_variety_code = nextVarietyCode;
            const { line_variety_name } = lineData;
            const checkVarietyName = await cropVerietyModel.findOne({
              where: {
                variety_name: line_variety_name,
                status: {
                  [sequelize.Op.not]: 'other'
                }
              }
            });
            if (checkVarietyName) {
              console.log("Variety Name is already registered.");
              return { status: 202, message: "Variety Name is already registered." };
            }
            try {
              await cropVerietyModel.create({
                variety_name: line_variety_name,
                status: 'other',
                variety_code: nextVarietyCode,
                crop_code: crop_code,
                user_id: user_id
              });
            } catch (error) {
              console.error("Error creating entry in cropVerietyModel:", error);
            }
          }

          try {
            await varietyLinesModel.create(lineData);
          } catch (error) {
            console.error("Error creating entry in varietyLinesModel:", error);
          }
        }
      }
      if (category_array && category_array.length > 0) {
        if (isUpdate) {
          await varietyCategoryMappingModel.destroy({
            where: {
              variety_code: variety_code,
            },
          });
        }
        for (const categoryData of category_array) {
          try {

            const createdCategoryMapping = await varietyCategoryMappingModel.create({
              m_variety_category_id: categoryData.id,
              variety_code: variety_code,
            });

            console.log(`Created entry in varietyCategoryMappingModel with ID: ${createdCategoryMapping.id}`);
          } catch (error) {
            console.error("Error storing data in varietyCategoryMappingModel:", error);
          }
        }
      }



      return { status: 200, message: "Data stored successfully." };
    } catch (error) {
      console.error("Error storing data:", error);
      return { status: 500, message: "Internal server error" };
    }
  };

  static addCropVerietySubmissionSachin = async (req, res) => {
    let dataToSave = {};
    if (req.body.data) {
      dataToSave = JSON.parse(req.body.data);
    } else {
      dataToSave = req.body;
    }
    console.log("here")
    let returnResponse = {};
    try {
      let rules = {
        'crop_group_code': 'string',
        'crop_code': 'string',
        'variety_code': 'string',
        'variety_name': 'string',
        // 'notified': 'integer',
        'notification_date': 'date',
        // 'notified_number': 'string',
        // 'meeting_number': 'string',
        'year_of_release': 'date',
        'select_type': 'string',
        'developed_by': 'string',
      };
      let validation = new Validator(dataToSave, rules);
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
      let subscriberInsertData = {
        crop_group_code: req.body.crop_group,
        crop_code: req.body.crop_name,
        variety_code: req.body.variety_code,
        variety_name: req.body.variety_name,
        is_notified: req.body.notified,
        not_date: req.body.notification_date,
        not_number: req.body.notified_number,
        meeting_number: req.body.meeting_number,
        release_date: req.body.year_of_release,
        type: req.body.select_type,
        introduce_year: req.body.year_of_introduction,
        developed_by: req.body.developed_by,
        user_id: req.body.loginedUserid.id,
        status: req.body.select_type.toLowerCase()
      }

      let varitData = await cropVerietyModel.findAll({
        where: {
          [Op.and]: [
            sequelize.where(
              sequelize.fn('lower', sequelize.col('variety_name')),
              sequelize.fn('lower', req.body.variety_name),
            ),
            // sequelize.where(sequelize.col('is_active'), 1),
          ],
        }
      });

      let varitDataAll = await cropVerietyModel.findAll({
        where: {
          crop_code: req.body.crop_name,
          variety_code: req.body.variety_code,
          meeting_number: req.body.meeting_number,
          release_date: req.body.year_of_release,
          type: req.body.select_type,
        }
      });

      if (varitDataAll && varitDataAll.length) {
        const errorResponse = {
          subscriber_id: 'Variety Data already registered'
        }
        return response(res, status.USER_EXISTS, 409, errorResponse)
      }

      else if ((varitData && (varitData.length))) {
        const errorResponse = {
          subscriber_id: 'Variety Name no is already registered. Please fill form correctly'
        }
        return response(res, status.USER_EXISTS, 409, errorResponse)
      }
      else {
        let errorMessage = {};
        let subscriberResponse = {};
        let result = await this.addVarietyData(req.body);
        if (result.status == 200) {
          await cropVerietyModel.create(subscriberInsertData).then(function (item) {
            subscriberResponse = item['_previousDataValues'];
            console.log('subscriberResponse==========>', subscriberResponse);
          }).catch(function (err) {
            console.log(err);
            errorMessage = {
              success: false,
              message: err.message
            };
          });
          returnResponse.subscriberDetails = subscriberResponse;
          return response(res, status.OK, 200, subscriberResponse);
        } else {
          return response(res, status.ERROR, 409, result.message);
        }
      }
    } catch (error) {
      console.log(error)
      returnResponse = {
        message: error.message
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }
  static addCropVerietySubmission = async (req, res) => {
    let dataToSave = {};
    if (req.body.data) {
      dataToSave = JSON.parse(req.body.data);
    }
    else {
      dataToSave = req.body;
    }

    let returnResponse = {};
    try {

      let rules = {
        'crop_group_code': 'string',
        'crop_code': 'string',
        'variety_code': 'string',
        'variety_name': 'string',
        // 'notified': 'integer',
        'notification_date': 'date',
        // 'notified_number': 'string',
        // 'meeting_number': 'string',
        'year_of_release': 'date',
        'select_type': 'string',
        'developed_by': 'string',
      };

      let validation = new Validator(dataToSave, rules);

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
      let subscriberInsertData = {
        crop_group_code: req.body.crop_group,
        crop_code: req.body.crop_name,
        variety_code: req.body.variety_code,
        variety_name: req.body.variety_name,
        is_notified: req.body.notified,
        not_date: req.body.notification_date,
        not_number: req.body.notified_number,
        meeting_number: req.body.meeting_number ? req.body.meeting_number : null,
        release_date: req.body.year_of_release ? req.body.year_of_release : null,
        type: req.body.select_type,
        introduce_year: req.body.year_of_introduction,
        developed_by: req.body.developed_by,
        user_id: req.body.loginedUserid.id
      }
      let meetingnumber;
      let releaseDate;
      if (req.body && req.body.meeting_number) {
        meetingnumber = {
          meeting_number: req.body.meeting_number,
        }
      }
      if (req.body && req.body.year_of_release) {
        releaseDate = {
          release_date: req.body.year_of_release
        }
      }

      let varitData = await cropVerietyModel.findAll({
        where: {
          [Op.and]: [
            sequelize.where(
              sequelize.fn('lower', sequelize.col('variety_name')),
              sequelize.fn('lower', req.body.variety_name),
            ),
            // sequelize.where(sequelize.col('is_active'), 1),
          ],
        }
      });

      let varitDataAll = await cropVerietyModel.findAll({
        where: {
          crop_code: req.body.crop_name,
          variety_code: req.body.variety_code,
          ...meetingnumber,
          ...releaseDate,
          type: req.body.select_type,
        }
      });

      if (varitDataAll && varitDataAll.length) {
        const errorResponse = {
          subscriber_id: 'Variety Data already registered'
        }
        return response(res, status.USER_EXISTS, 409, errorResponse)
      }

      else if ((varitData && (varitData.length))) {
        const errorResponse = {
          subscriber_id: 'Variety Name no is already registered. Please fill form correctly'
        }
        return response(res, status.USER_EXISTS, 409, errorResponse)
      }
      else {
        let errorMessage = {};
        let subscriberResponse = {};
        await cropVerietyModel.create(subscriberInsertData).then(function (item) {
          subscriberResponse = item['_previousDataValues'];
        }).catch(function (err) {
          console.log(err);
          errorMessage = {
            success: false,
            message: err.message
          };
        });

        returnResponse.subscriberDetails = subscriberResponse;
        return response(res, status.OK, 200, subscriberResponse);
      }
    } catch (error) {
      returnResponse = {
        message: error.message
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }

  // static addCropVerietySubmission = async (req, res) => {
  //   let dataToSave = {};
  //   if (req.body.data) {
  //     dataToSave = JSON.parse(req.body.data);
  //   }
  //   else {
  //     dataToSave = req.body;
  //   }

  //   let returnResponse = {};
  //   try {

  //     let rules = {
  //       'crop_group_code': 'string',
  //       'crop_code': 'string',
  //       'variety_code': 'string',
  //       'variety_name': 'string',
  //       // 'notified': 'integer',
  //       'notification_date': 'date',
  //       'notified_number': 'string',
  //       'meeting_number': 'string',
  //       'year_of_release': 'date',
  //       'select_type': 'string',
  //       'developed_by': 'string',
  //     };

  //     let validation = new Validator(dataToSave, rules);

  //     const isValidData = validation.passes();

  //     if (!isValidData) {
  //       let errorResponse = {};
  //       for (let key in rules) {
  //         const error = validation.errors.get(key);
  //         if (error.length) {
  //           errorResponse[key] = error;
  //         }
  //       }
  //       return response(res, status.BAD_REQUEST, 400, errorResponse)
  //     }
  //     let subscriberInsertData = {
  //       crop_group_code: req.body.crop_group,
  //       crop_code: req.body.crop_name,
  //       variety_code: req.body.variety_code,
  //       variety_name: req.body.variety_name,
  //       is_notified: req.body.notified,
  //       not_date: req.body.notification_date,
  //       not_number: req.body.notified_number,
  //       meeting_number: req.body.meeting_number,
  //       release_date: req.body.year_of_release,
  //       type: req.body.select_type,
  //       introduce_year: req.body.year_of_introduction,
  //       developed_by: req.body.developed_by,
  //       user_id: req.body.loginedUserid.id
  //     }

  //     let varitData = await cropVerietyModel.findAll({
  //       where: {
  //         [Op.and]: [
  //           sequelize.where(
  //             sequelize.fn('lower', sequelize.col('variety_name')),
  //             sequelize.fn('lower', req.body.variety_name),
  //           ),
  //           // sequelize.where(sequelize.col('is_active'), 1),
  //         ],
  //       }
  //     });

  //     let varitDataAll = await cropVerietyModel.findAll({
  //       where: {
  //         crop_code: req.body.crop_name,
  //         variety_code: req.body.variety_code,
  //         meeting_number: req.body.meeting_number,
  //         release_date: req.body.year_of_release,
  //         type: req.body.select_type,
  //       }
  //     });

  //     if(varitDataAll && varitDataAll.length){
  //       const errorResponse = {
  //         subscriber_id: 'Variety Data already registered'
  //       }
  //       return response(res, status.USER_EXISTS, 409, errorResponse)
  //     }

  //     else if ((varitData && (varitData.length))) {
  //       const errorResponse = {
  //         subscriber_id: 'Variety Name no is already registered. Please fill form correctly'
  //       }
  //       return response(res, status.USER_EXISTS, 409, errorResponse)
  //     }
  //     else {
  //       let errorMessage = {};
  //       let subscriberResponse = {};
  //       await cropVerietyModel.create(subscriberInsertData).then(function (item) {
  //         subscriberResponse = item['_previousDataValues'];
  //         console.log('subscriberResponse==========>', subscriberResponse);
  //       }).catch(function (err) {
  //         console.log(err);
  //         errorMessage = {
  //           success: false,
  //           message: err.message
  //         };
  //       });

  //       returnResponse.subscriberDetails = subscriberResponse;
  //       return response(res, status.OK, 200, subscriberResponse);
  //     }
  //   } catch (error) {
  //     returnResponse = {
  //       message: error.message
  //     };
  //     return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
  //   }
  // }

  // static updateCropVerietySubmission = async (req, res) => {
  //   let dataToSave = {};
  //   if (req.body.data) {
  //     dataToSave = JSON.parse(req.body.data);
  //   }
  //   else {
  //     dataToSave = req.body;
  //   }

  //   let returnResponse = {};
  //   try {

  //     let rules = {
  //       'crop_group_code': 'string',
  //       'crop_code': 'string',
  //       'variety_code': 'string',
  //       'variety_name': 'string',
  //       'notified': 'integer',
  //       'notification_date': 'date',
  //       'notified_number': 'string',
  //       'meeting_number': 'string',
  //       'year_of_release': 'date',
  //       'select_type': 'string',
  //       'developed_by': 'string',
  //     };

  //     let validation = new Validator(dataToSave, rules);

  //     const isValidData = validation.passes();

  //     if (!isValidData) {
  //       let errorResponse = {};
  //       for (let key in rules) {
  //         const error = validation.errors.get(key);
  //         if (error.length) {
  //           errorResponse[key] = error;
  //         }
  //       }
  //       return response(res, status.BAD_REQUEST, 400, errorResponse)
  //     }
  //     let subscriberInsertData = {

  //       crop_group_code: req.body.crop_group,
  //       crop_code: req.body.crop_name,
  //       variety_code: req.body.variety_code,
  //       variety_name: req.body.variety_name,
  //       is_notified: req.body.notified,
  //       not_date: req.body.notification_date,
  //       not_number: req.body.notified_number,
  //       meeting_number: req.body.meeting_number,
  //       release_date: req.body.year_of_release,
  //       introduce_year: req.body.introduce_year,
  //       type: req.body.select_type,
  //       developed_by: req.body.developed_by,
  //       is_active: req.body.active
  //     }
  //     console.log(req.body.notified, 'req.body.notified');


  //     let varitData = await cropVerietyModel.findAll({
  //       where: {
  //         [Op.and]: [
  //           sequelize.where(
  //             sequelize.fn('lower', sequelize.col('variety_name')),
  //             sequelize.fn('lower', req.body.variety_name),
  //           ),
  //           {
  //             id: {
  //               [Op.ne]: req.body.id
  //             }
  //           },
  //           // sequelize.where(sequelize.col('is_active'), 1),
  //           // sequelize.where(sequelize.col('r'), 1),


  //         ],
  //       }
  //     });

  //     if ((varitData && varitData.length)) {
  //       const errorResponse = {
  //         subscriber_id: 'Variety Name no is already registered. Please fill form correctly'
  //       }
  //       return response(res, status.USER_EXISTS, 409, errorResponse)
  //     } else {

  //       let updateSubscriber = false;

  //       let errorMessage = {};
  //       let subscriberResponse = {};
  //       await cropVerietyModel.update(subscriberInsertData, {
  //         where: {
  //           id: req.body.id
  //         }
  //       }).then(function (item) {
  //         subscriberResponse = item['_previousDataValues'];
  //       }).catch(function (err) {
  //         errorMessage = {
  //           success: false,
  //           message: err.message
  //         };
  //       });
  //       returnResponse.subscriberDetails = subscriberResponse;
  //       return response(res, status.OK, 200, returnResponse);
  //     }
  //   } catch (error) {
  //     returnResponse = {
  //       message: error.message
  //     };
  //     return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
  //   }
  // }
  static updateCropVerietySubmission = async (req, res) => {
    let dataToSave = {};
    if (req.body.data) {
      dataToSave = JSON.parse(req.body.data);
    }
    else {
      dataToSave = req.body;
    }

    let returnResponse = {};
    try {

      let rules = {
        'crop_group_code': 'string',
        'crop_code': 'string',
        'variety_code': 'string',
        'variety_name': 'string',
        'notified': 'integer',
        'notification_date': 'date',
        'notified_number': 'string',
        // 'meeting_number': 'string',
        // 'year_of_release': 'date',
        'select_type': 'string',
        'developed_by': 'string',
      };

      let validation = new Validator(dataToSave, rules);

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
      let subscriberInsertData = {

        crop_group_code: req.body.crop_group,
        crop_code: req.body.crop_name,
        variety_code: req.body.variety_code,
        variety_name: req.body.variety_name,
        is_notified: req.body.notified,
        not_date: req.body.notification_date,
        not_number: req.body.notified_number,
        meeting_number: req.body.meeting_number ? req.body.meeting_number : null,
        release_date: req.body.year_of_release ? req.body.year_of_release : null,
        introduce_year: req.body.introduce_year,
        type: req.body.select_type,
        developed_by: req.body.developed_by,
        is_active: req.body.active,
        status: req.body.select_type.toLowerCase()
      }
      console.log(req.body.notified, 'req.body.notified');


      let varitData = await cropVerietyModel.findAll({
        where: {
          [Op.and]: [
            sequelize.where(
              sequelize.fn('lower', sequelize.col('variety_name')),
              sequelize.fn('lower', req.body.variety_name),
            ),
            {
              id: {
                [Op.ne]: req.body.id
              }
            },
          ],
        }
      });

      if ((varitData && varitData.length)) {
        const errorResponse = {
          subscriber_id: 'Variety Name no is already registered. Please fill form correctly'
        }
        return response(res, status.USER_EXISTS, 409, errorResponse)
      } else {
        let errorMessage = {};
        let subscriberResponse = {};
        let result = await this.addVarietyData(req.body, true);
        if (result.status == 200) {
          await cropVerietyModel.update(subscriberInsertData, {
            where: {
              id: req.body.id
            }
          }).then(function (item) {
            subscriberResponse = item['_previousDataValues'];
          }).catch(function (err) {
            errorMessage = {
              success: false,
              message: err.message
            };
          });
          returnResponse.subscriberDetails = subscriberResponse;
          return response(res, status.OK, 200, returnResponse);
        }
        else {
          return response(res, status.ERROR, 409, result.message);
        }
      }
    } catch (error) {
      returnResponse = {
        message: error.message
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }

  static getCrop = async (req, res) => {
    const { internalCall } = req.body;
    let returnResponse = {};
    let data = {};
    try {
      let condition = {};

      condition.order = [['crop_name', 'Asc']];
      data = await cropModel.findAndCountAll(condition);
      // returnResponse = await paginateResponse(data, page, pageSize);

      // res.send(data)

      response(res, status.DATA_AVAILABLE, 200, data, internalCall)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getCropGroup = async (req, res) => {
    try {
      let condition = {};

      const croGroupData = await cropGroupModel.findAll(condition);
      response(res, status.DATA_AVAILABLE, 200, croGroupData)
    } catch (error) {
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
      console.log(error)
      response(res, status.DATA_NOT_SAVE, 500)
    }
  }
  static viewCrop = async (req, res) => {
    const { internalCall } = req.body;
    let returnResponse = {};
    let data = {};
    try {

      let condition = {
        include: [
          {
            model: cropGroupModel
          }
        ]
      };
      let { page, pageSize, search } = req.body;
      if (req.body.page) {
        if (page === undefined) page = 1;
        if (pageSize === undefined) {
          pageSize = 10;
        } // set pageSize to -1 to prevent sizing

        if (page > 0 && pageSize > 0) {
          condition.limit = pageSize;
          condition.offset = (page * pageSize) - pageSize;
        }
      }


      const sortOrder = req.body.sort ? req.body.sort : 'id';
      const sortDirection = req.body.order ? req.body.order : 'DESC';


      // condition.order = [[sortOrder, sortDirection]];
      // condition.order = [['crop_group', 'ASC'],
      condition.order = [['crop_name', 'ASC']
      ];
      if (req.body.search) {
        condition.where = {}

        if (req.body.search.group_code) {
          condition.where.group_code = (req.body.search.group_code);
        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = (req.body.search.crop_code);
        }
        if (req.body.search.crop_name_data) {
          condition.where.crop_group = (req.body.search.crop_name_data);
        }
        if (req.body.search.type == 'report') {
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
        // if (req.body.search.user_id) {
        //   condition.where.user_id = (req.body.search.user_id);
        // }
      }

      data = await cropModel.findAndCountAll(condition);
      // returnResponse = await paginateResponse(data, page, pageSize);

      // res.send(data)

      response(res, status.DATA_AVAILABLE, 200, data, internalCall)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getCrop = async (req, res) => {
    const { internalCall } = req.body;
    let returnResponse = {};
    let data = {};
    try {
      let condition = {};

      condition.order = [['crop_name', 'Asc']];
      data = await cropModel.findAndCountAll(condition);
      // returnResponse = await paginateResponse(data, page, pageSize);

      // res.send(data)

      response(res, status.DATA_AVAILABLE, 200, data, internalCall)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static distinctCropName = async (req, res) => {
    let data = {};
    try {
      let condition = {
        where: {
          is_active: 1

        },
        raw: false,
        attributes: [
          [sequelize.literal('DISTINCT(crop_name)'), 'crop_name'],
          // [sequelize.fn('DISTINCT', sequelize.col('crop_name')) ,'crop_name'],
          // 'crop_code'

          [sequelize.col('crop_code'), 'crop_code'],
        ],

      };
      condition.order = [['crop_name', 'asc']];
      if (req.body.search) {
        if (req.body.search.group_code) {
          condition.where.group_code = (req.body.search.group_code);
        }
        if (req.body.search.type == 'report') {
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

      data = await cropModel.findAll(condition);

      // res.send(data)

      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static distinctCropNameAddBreeder = async (req, res) => {
    let data = {};
    try {
      console.log(req.body.view, 'crop')
      let condition = {}
      if (req.body.view) {
        condition = {
          where: {
            [Op.or]: [
              {
                breeder_id: {
                  [Op.eq]: null
                }

              },
              {
                crop_code: {
                  [Op.in]: req.body.search
                }

              },


            ]
          },


          // where: {
          //   crop_code:{
          //     [Op.in]:req.body.search
          //   },
          //   breeder_id: {
          //     [Op.eq]: null
          //   }
          // },

          raw: false,
          attributes: [
            [sequelize.literal('DISTINCT(crop_name)'), 'crop_name'],
            // [sequelize.fn('DISTINCT', sequelize.col('crop_name')) ,'crop_name'],
            // 'crop_code'

            [sequelize.col('crop_code'), 'crop_code'],
          ],

        };
      }
      else {
        condition = {
          where: {
            [Op.and]: [
              {
                breeder_id: {
                  [Op.eq]: null
                }

              },
              {
                is_active: {
                  [Op.eq]: 1
                }

              },

            ]
          },


          // where: {
          //   crop_code:{
          //     [Op.in]:req.body.search
          //   },
          //   breeder_id: {
          //     [Op.eq]: null
          //   }
          // },

          raw: false,
          attributes: [
            [sequelize.literal('DISTINCT(crop_name)'), 'crop_name'],
            // [sequelize.fn('DISTINCT', sequelize.col('crop_name')) ,'crop_name'],
            // 'crop_code'

            [sequelize.col('crop_code'), 'crop_code'],
          ],

        };
      }

      condition.order = [['crop_name', 'asc']];
      if (req.body.search) {
        if (req.body.search.group_code) {
          condition.where.group_code = (req.body.search.group_code);
        }
      }
      data = await cropModel.findAll(condition);

      // res.send(data)

      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  // static getCropVerietyData = async (req, res) => {
  //   let returnResponse = {};
  //   try {
  //     let condition = {}
  //     if (req.body.search.view) {
  //       condition = {
  //         include: [
  //           // {
  //           //   model: cropGroupModel,
  //           //   left: true,
  //           //   attribute: ['group_name', 'group_code'],
  //           //   order: [['group_name']]
  //           // },
  //           {
  //             model: cropModel,

  //             include: [{
  //               model: cropGroupModel,
  //               left: true,
  //               attribute: ['group_name', 'group_code'],
  //               order: [['group_name']],

  //             }],
  //             left: true,
  //             attribute: ['crop_name'],
  //             // where:{
  //             //   is_active:1

  //             // },             

  //           },
  //         ],
  //         left: true,
  //       };
  //     }
  //     if (req.body.id) {
  //       condition = {
  //         include: [
  //           // {
  //           //   model: cropGroupModel,
  //           //   left: true,
  //           //   attribute: ['group_name', 'group_code'],
  //           //   order: [['group_name']]
  //           // },
  //           {
  //             model: cropModel,

  //             include: [{
  //               model: cropGroupModel,
  //               left: true,
  //               attribute: ['group_name', 'group_code'],
  //               order: [['group_name']],

  //             }],
  //             left: true,
  //             attribute: ['crop_name'],
  //             // where:{
  //             //   is_active:1

  //             // },             

  //           },
  //         ],
  //         left: true,

  //       };
  //     }

  //     else {
  //       condition = {
  //         include: [
  //           // {
  //           //   model: cropGroupModel,
  //           //   left: true,
  //           //   attribute: ['group_name', 'group_code'],
  //           //   order: [['group_name']]
  //           // },

  //           {
  //             model: cropModel,


  //             include: [{
  //               model: cropGroupModel,
  //               left: true,
  //               attribute: ['group_name', 'group_code'],
  //               order: [['group_name']],

  //             }],
  //             left: true,
  //             attribute: ['crop_name'],


  //             // where:{
  //             //   is_active:1
  //             // }
  //           },
  //           {
  //             model: cropCharactersticsModel,
  //             attribute: ['id'],
  //             left: true
  //             // required:true
  //           }
  //         ],
  //         left: true,


  //       };
  //     }



  //     let { page, pageSize, search } = req.body;
  //     if (req.body.page) {
  //       if (page === undefined) page = 1;
  //       if (pageSize === undefined)
  //         pageSize = 50; // set pageSize to -1 to prevent sizing

  //       if (page > 0 && pageSize > 0) {
  //         condition.limit = pageSize;
  //         condition.offset = (page * pageSize) - pageSize;
  //       }
  //     }

  //     const sortOrder = req.body.sort ? req.body.sort : 'id';
  //     const sortDirection = req.body.order ? req.body.order : 'DESC';


  //     // condition.order = [[sortOrder, sortDirection]];
  //     // condition.order = [['crop_group','ASC'],['crop_name','ASC']];
  //     // condition.order = [(sequelize.col('m_crop.crop_group', 'ASC')), (sequelize.col('m_crop.crop_name', 'ASC'))];
  //     condition.order = [[sequelize.col('m_crop->m_crop_group.group_name'), 'ASC'], [sequelize.col('m_crop.crop_name'), 'ASC'], ['variety_name', 'ASC']];

  //     if (search) {
  //       condition.where = {};
  //       if (req.body.search.id) {
  //         condition.where.id = (req.body.search.id);
  //       }

  //       // if (req.body.search.cropGroup) {
  //       //   condition.where.crop_group_code = (req.body.search.cropGroup);
  //       // }
  //       if (req.body.search.cropGroup) {
  //         condition.include[0].where = {};
  //         condition.include[0].where.group_code = (req.body.search.cropGroup);
  //         // condition.include[0].where.is_active = 1;

  //       }

  //       if (req.body.search.is_notified) {
  //         if (req.body.search.is_notified == "notified") {
  //           console.log('req.body.search.is_notified', req.body.search.is_notified);
  //           condition.where.not_date = {
  //             [Op.and]: [
  //               { [Op.not]: null },
  //               { [Op.not]: '' },
  //             ]
  //           };
  //         }

  //         if (req.body.search.is_notified == "non_notified") {
  //           console.log('req.body.search.is_notified', req.body.search.is_notified);
  //           condition.where.not_date = {
  //             [Op.or]: [
  //               { [Op.eq]: null },
  //               { [Op.eq]: '' },
  //             ]
  //           };
  //         }

  //       }
  //       if (req.body.search.crop_code) {
  //         condition.where.crop_code = (req.body.search.crop_code);
  //       }
  //       // if (req.body.search.user_id) {
  //       //   condition.where.user_id = (req.body.search.user_id);
  //       // }
  //       if (req.body.search.variety_code) {
  //         condition.where.variety_code = (req.body.search.variety_code);
  //       }
  //       if (req.body.search.variety_name) {
  //         condition.where.variety_name = {
  //           [Op.or]: [
  //             { [Op.iLike]: "%" + req.body.search.variety_name.toLowerCase().trim() + "%" },
  //           ]
  //         };
  //       }
  //       if (req.body.search.id) {
  //         condition.where.id = parseInt(req.body.search.id);
  //       }
  //       if (req.body.search.not_number) {
  //         condition.where.not_number = {
  //           [Op.or]: [
  //             { [Op.iLike]: "%" + req.body.search.not_number.toLowerCase().trim() + "%" },
  //           ]
  //         };
  //       }
  //       if (req.body.search.is_status_active) {
  //         condition.where.is_status_active = req.body.search.is_status_active;
  //       }
  //       // if (req.body.search.sort_value) {
  //       //   if(req.body.search.sort_value == 'ASC')
  //       //   {
  //       //     const sortOrder = req.body.sort ? req.body.sort : 'variety_name';
  //       //     const sortDirection = req.body.order ? req.body.order : 'ASC';

  //       //     condition.order = [[sequelize.col('m_crop_varieties.variety_name'), 'ASC']];
  //       //   }
  //       //   else
  //       //   {
  //       //     const sortOrder = req.body.sort ? req.body.sort : 'variety_name';
  //       //     const sortDirection = req.body.order ? req.body.order : 'DESC';

  //       //     condition.order = [[sequelize.col('m_crop_varieties.variety_name'), 'DESC']];
  //       //   }          
  //       // }

  //       // if (req.body.search.sort_value) {
  //       //   const sortOrder = req.body.sort || 'variety_name';
  //       //   const sortDirection = req.body.order || 'ASC';

  //       //   const order = req.body.search.sort_value === 'ASC' ? 'ASC' : 'DESC';
  //       // }
  //       // if (req.body.search.not_sort_value) {
  //       //   const sortOrder = req.body.sort || 'not_date';
  //       //   const sortDirection = req.body.order || 'ASC';

  //       //   const order = req.body.search.not_sort_value === 'ASC' ? 'ASC' : 'DESC';

  //       // }
  //       let varietySortOrder = req.body.search && req.body.search.sort_value && req.body.search.sort_value ? 'variety_name' : '';
  //       let varietyOrder = req.body.search && req.body.search.sort_value && req.body.search.sort_value === 'ASC' ? 'ASC' : 'DESC';
  //       console.log(" varietyOrder", varietyOrder)
  //       if (req.body.search.sort_value && req.body.search.sort_value != '') {
  //         // const sortOrder = req.body.sort || 'variety_name';
  //         // const sortDirection = req.body.order || 'ASC';
  //         // const order = req.body.search.sort_value === 'ASC' ? 'ASC' : 'DESC';

  //         //          condition.order = [sequelize.col(`m_crop_varieties.${varietySortOrder}`), varietyOrder];
  //         condition.order = [[varietySortOrder, varietyOrder]];
  //       }

  //       if (req.body.search.not_sort_value && req.body.search.not_sort_value != '') {
  //         const sortOrder = req.body.sort || 'not_date';
  //         const order = req.body.search.not_sort_value === 'ASC' ? 'ASC' : 'DESC';
  //         if (req.body.search.sort_value && req.body.search.sort_value != '') {
  //           //            condition.order = [ [sequelize.col(`m_crop_varieties.${varietySortOrder}`), varietyOrder], [sequelize.col(`m_crop_varieties.${sortOrder}`), order]];
  //           condition.order = [['not_date', varietyOrder], ['variety_name', order]];

  //         }
  //         else
  //           condition.order = [[sortOrder, order]];

  //       }

  //     }

  //     // condition.order = [ (sequelize.col('m_crop.crop_group','ASC')),(sequelize.col('m_crop.crop_name','ASC'))];

  //     let data = await cropVerietyModel.findAndCountAll(condition);
  //     // returnResponse = await paginateResponse(data, page, pageSize);

  //     if (data) {
  //       response(res, status.DATA_AVAILABLE, 200, data);
  //     }
  //     else {
  //       return response(res, status.DATA_NOT_AVAILABLE, 404)
  //     }
  //   }
  //   catch (error) {
  //     console.log(error);
  //     return response(res, status.DATA_NOT_SAVE, 500, error);
  //   }
  // }

  static getCropVerietyData = async (req, res) => {
    try {
      let condition = {}
      if (req.body.search.view) {
        condition = {
          include: [
            // {
            //   model: cropGroupModel,
            //   left: true,
            //   attribute: ['group_name', 'group_code'],
            //   order: [['group_name']]
            // },
            {
              model: cropModel,
              include: [
                {
                  model: cropGroupModel,
                  left: true,
                  attribute: ['group_name', 'group_code'],
                  order: [['group_name']],
              }
            ],
              left: true,
              attribute: ['crop_name'],
            },
            {
              model: varietyLinesModel,
            },
            {
              model: varietyCategoryMappingModel,
              attributes: ['m_variety_category_id'],
              as: 'category',
              include: [
                {
                  model: db.varietyCategoryModel,
                  attributes: ['category'],
                  require: true
                },
              ],
            },
          ],
          left: true,
        };
      }
      else if (req.body.id) {
        condition = {
          include: [
            // {
            //   model: cropGroupModel,
            //   left: true,
            //   attribute: ['group_name', 'group_code'],
            //   order: [['group_name']]
            // },
            {
              model: cropModel,
              include: [
                {
                  model: cropGroupModel,
                  left: true,
                  attribute: ['group_name', 'group_code'],
                  order: [['group_name']],
                }
             ],
              left: true,
              attribute: ['crop_name'],
            },
          ],
          left: true,
        };
      } else {
        condition = {
          include: [
            // {
            //   model: cropGroupModel,
            //   left: true,
            //   attribute: ['group_name', 'group_code'],
            //   order: [['group_name']]
            // },
            {
              model: cropModel,
              include: [
                {
                  model: cropGroupModel,
                  left: true,
                  attribute: ['group_name', 'group_code'],
                  order: [['group_name']],
                }
              ],
              left: true,
              attribute: ['crop_name'],
            },
            {
              model: cropCharactersticsModel,
              attribute: ['id'],
              left: true
            }
          ],
          left: true,
        };
      }
      let { page, pageSize, search } = req.body;
      if (req.body.page) {
        if (page === undefined) page = 1;
        if (pageSize === undefined)
          pageSize = 50; // set pageSize to -1 to prevent sizing

        if (page > 0 && pageSize > 0) {
          condition.limit = pageSize;
          condition.offset = (page * pageSize) - pageSize;
        }
      }
      condition.order = [[sequelize.col('m_crop->m_crop_group.group_name'), 'ASC'], [sequelize.col('m_crop.crop_name'), 'ASC'], ['variety_name', 'ASC']];

      if (search) {
        condition.where = {};
        if (req.body.search.id) {
          condition.where.id = (req.body.search.id);
        }

        if (req.body.search.cropGroup) {
          condition.include[0].where = {};
          condition.include[0].where.group_code = (req.body.search.cropGroup);
        }
        if (!req.body.search.view) {
          condition.where.status = { [Op.notIn]: ['other'] }
          condition.where.status = {
            [Op.or]: [
              {
                [Op.in]: ['hybrid', 'variety']

              },
              {
                [Op.eq]: null
              },
            ]
          };
        }
        if (req.body.search.is_notified) {
          if (req.body.search.is_notified == "notified") {
            console.log('req.body.search.is_notified', req.body.search.is_notified);
            condition.where.not_date = {
              [Op.and]: [
                { [Op.not]: null },
                { [Op.not]: '' },
              ]
            };
          }

          if (req.body.search.is_notified == "non_notified") {
            console.log('req.body.search.is_notified', req.body.search.is_notified);
            condition.where.not_date = {
              [Op.or]: [
                { [Op.eq]: null },
                { [Op.eq]: '' },
              ]
            };
          }

        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = (req.body.search.crop_code);
        }
        if (req.body.search.variety_code) {
          condition.where.variety_code = (req.body.search.variety_code);
        }
        if (req.body.search.variety_name) {
          condition.where.variety_name = {
            [Op.or]: [
              { [Op.iLike]: "%" + req.body.search.variety_name.toLowerCase().trim() + "%" },
            ]
          };
        }
        if (req.body.search.id) {
          condition.where.id = parseInt(req.body.search.id);
        }
        if (req.body.search.not_number) {
          condition.where.not_number = {
            [Op.or]: [
              { [Op.iLike]: "%" + req.body.search.not_number.toLowerCase().trim() + "%" },
            ]
          };
        }
        if (req.body.search.is_status_active) {
          condition.where.is_status_active = req.body.search.is_status_active;
        }

        let varietySortOrder = req.body.search && req.body.search.sort_value && req.body.search.sort_value ? 'variety_name' : '';
        let varietyOrder = req.body.search && req.body.search.sort_value && req.body.search.sort_value === 'ASC' ? 'ASC' : 'DESC';
        console.log(" varietyOrder", varietyOrder)
        if (req.body.search.sort_value && req.body.search.sort_value != '') {
          condition.order = [[varietySortOrder, varietyOrder]];
        }

        if (req.body.search.not_sort_value && req.body.search.not_sort_value != '') {
          const sortOrder = req.body.sort || 'not_date';
          const order = req.body.search.not_sort_value === 'ASC' ? 'ASC' : 'DESC';
          if (req.body.search.sort_value && req.body.search.sort_value != '') {
            condition.order = [['not_date', varietyOrder], ['variety_name', order]];
          } else
            condition.order = [[sortOrder, order]];
        }
      }

      let data = await cropVerietyModel.findAndCountAll(condition);
      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      console.log(error);
      return response(res, status.DATA_NOT_SAVE, 500, error);
    }
  }

  static mergeDataVarietLine = async (data) => {
    try {
      // let result =data.then(function(item){
      //   newResponse=item['_previousDataValues']
      // });
      let result;
      let m_variety_lines = []
      if (data && data && data.length) {
        data.forEach(async (el, i) => {
          el.m_variety_lines = [

            {
              "id": 123,
              "line_variety_name": "",
              "variety_code": "A0633016",
              "line": "3",
              "line_variety_code": "O18"
            },
            {
              "id": 122,
              "line_variety_name": "",
              "variety_code": "A0633016",
              "line": "2",
              "line_variety_code": "O17"
            },
            {
              "id": 121,
              "line_variety_name": "",
              "variety_code": "A0633016",
              "line": "1",
              "line_variety_code": "O07"
            }
          ]

          if (el && el.m_variety_lines && el.m_variety_lines.length > 0) {


            el.m_variety_lines.forEach(async (item, index) => {
              // console.log("Merge All Data --->>>>", item)
              result = await cropVerietyModel.findAll({
                where: {
                  variety_code: item && item.line_variety_code ? item.line_variety_code : ''
                },
                raw: true,
                attributes: [
                  [sequelize.col('m_crop_varieties.variety_name'), 'line_variety_name'],
                  [sequelize.col('m_crop_varieties.variety_code'), 'line_variety_code'],
                ]

              });
              // if (result && result.length > 0) {

              el.m_variety_lines = el.m_variety_lines.map(obj => {
                const match = result.find(obj2 => obj2.line_variety_code === obj.line_variety_code);
                // console.log("match match", match)

                if (match && match != undefined && match != '') {
                  // console.log("match match111", match)
                  return {
                    ...obj,
                    line_variety_name: match.line_variety_name
                  };

                }
                return obj;
              });
              // m_variety_lines.push(el.m_variety_lines)

            }

              //  m_variety_lines.push(el.m_variety_lines)
              // }
              // return data
            )
            // console.log(m_variety_lines,'m_variety_linesm_variety_lines')
            return data
            // console.log("result1111", result)
            // return data
          }
        })
      }
      return data
    }
    catch (error) {
      console.log(error);
      return response(res, status.DATA_NOT_SAVE, 500, error);
    }
  }


  static getCropVerietyDataWithDynamicField = async (req, res) => {
    let returnResponse = {};
    try {
      let attributesData = [];
      let temp = [];
      if (req.body.search) {
        if (req.body.search.fieldData !== undefined && req.body.search.fieldData.length >= 1) {
          req.body.search.fieldData.forEach(async (items) => {

            if (items && items.value == "crop_group") {
              temp = [sequelize.col('m_crop->m_crop_group.group_name'), 'group_name'];
            }

            else if (items && items.value == "variety_name") {
              temp = [sequelize.col('m_crop_varieties.variety_name'), 'variety_name'];
            }

            else if (items && items.value == "crop_name") {
              temp = [sequelize.col('m_crop.crop_name'), 'crop_name'];
            }

            else if (items && items.value == "variety_code") {
              temp = [sequelize.col('m_crop_varieties.variety_code'), 'variety_code']
            }
            else if (items && items.value == "crop_code") {
              temp = [sequelize.col('m_crop.crop_code'), 'crop_code'];
            }
            else if (items && items.value == "meeting_no") {
              temp = [sequelize.col('m_crop_varieties.meeting_number'), 'meeting_no']
            }
            else if (items && items.value == "type") {
              temp = [sequelize.col('m_crop_varieties.type'), 'type']
            }

            // if (items && items.value == "realise_date") {
            //   temp = [sequelize.col('m_crop_varieties.variety_code'), 'notification_year']
            // }
            else if (items && items.value == "notification_no") {
              temp = [sequelize.col('m_crop_varieties.not_number'), 'notification_no']
            }
            else if (items && items.value == "notification_date") {
              temp = [sequelize.col('m_crop_varieties.not_date'), 'notification_date']
            }
            else if (items && items.value == "introduce_year") {
              temp = [sequelize.col('m_crop_varieties.introduce_year'), 'introduce_year']
            }
            else if (items && items.value == "developed_by") {
              temp = [sequelize.col('m_crop_varieties.developed_by'), 'developed_by']
            }
            else if (items && items.value == "year_of_release") {
              temp = [sequelize.col('m_crop_varieties.release_date'), 'release_date']
            }
            else if (items && items.value == "recommended_state_for_cultivation") {
              temp = [sequelize.col('m_variety_characteristic.state_data'), 'state_data']
            }
            else if (items && items.value == "iet_number_name_by_which_tested") {
              temp = [sequelize.col('m_variety_characteristic.iet_number'), 'iet_number']
            }
            else if (items && items.value == "responsible_institution_for_developing_breeder_seed") {
              temp = [sequelize.col('m_variety_characteristic.intitution_id'), 'responsible_institution_for_developing_breeder_seed']
            }
            else if (items && items.value == "resemblance_to_variety") {
              temp = [sequelize.col('m_variety_characteristic.resemblance_to_variety'), 'resemblance_to_variety']
            }
            else if (items && items.value == "type_of_maturity") {
              temp = [sequelize.col('m_variety_characteristic.matuarity_type_id'), 'matuarity_type_id']
            }
            else if (items && items.value == "generic_morphological_characteristics") {
              temp = [sequelize.col('m_variety_characteristic.generic_morphological'), 'generic_morphological']
            }
            else if (items && items.value == "specific_morphological_characteristics") {
              temp = [sequelize.col('m_variety_characteristic.specific_morphological'), 'specific_morphological']
            }
            else if (items && items.value == "average_yield") {
              temp = [sequelize.col('m_variety_characteristic.average_yeild_from'), 'average_yeild_from']
            }
            else if (items && items.value == "adaptationa_and_recommended_ecology") {
              temp = [sequelize.col('m_variety_characteristic.adoptation'), 'adoptation']
            }
            else if (items && items.value == "agronomic_feature") {
              temp = [sequelize.col('m_variety_characteristic.agronomic_features'), 'agronomic_features']
            }

            else if (items && items.value == "reaction_to_major_diseases") {
              temp = [sequelize.col('m_variety_characteristic.reaction_major_diseases'), 'reaction_major_diseases']
            }
            else if (items && items.value == "year_of_releases") {
              temp = [sequelize.col('m_crop_varieties.introduce_year'), 'introduce_year']
            }

            else if (items && items.value == "reaction_to_major_pests") {
              temp = [sequelize.col('m_variety_characteristic.reaction_to_pets'), 'reaction_to_pets']
            }
            else if (items && items.value == "fertiliser_dosage") {
              temp = [sequelize.col('m_variety_characteristic.fertilizer_dosage'), 'fertilizer_dosage']
            }
            else if (items && items.value) {
              temp = [sequelize.col('m_crop_varieties.is_active'), 'is_active']
            }
            else {
              temp = ['id'];
            }

            attributesData.push(temp);
          });
          attributesData.push([sequelize.col('m_crop_varieties.is_active'), 'is_active'])
          console.log('attributesData', attributesData);

        }

      }

      let condition = {}
      condition = {
        include: [
          {
            model: cropModel,
            attributes: [],
            include: [{
              model: cropGroupModel,
              attributes: [],
            }],
            left: true,

            // where: { is_active: 1 }
          },
          {
            model: cropCharactersticsModel,
            attributes: [],
            // include:[
            //   {
            //     model:userModel,
            //     attributes:[],
            //     where:{
            //       user_type:'BPC'
            //     }
            //   }
            // ]
          }
        ],
        attributes: attributesData,
        raw: true,
        where: {
        }
      };
        // ✅ Apply user_type restriction
    if (req.body.loginedUserid.user_type === "OILSEEDADMIN") {
      condition.where.crop_code = { [Op.like]: "A04%" };
    }
    if (req.body.loginedUserid.user_type === "PULSESSEEDADMIN") {
      condition.where.crop_code = { [Op.like]: "A03%" };
    }

      let { page, pageSize, search } = req.body;
      if (req.body.page) {
        if (page === undefined) page = 1;
        if (pageSize === undefined)
          pageSize = 10; // set pageSize to -1 to prevent sizing

        if (page > 0 && pageSize > 0) {
          condition.limit = pageSize;
          condition.offset = (page * pageSize) - pageSize;
        }
      }

      const sortOrder = req.body.sort ? req.body.sort : 'id';
      const sortDirection = req.body.order ? req.body.order : 'DESC';


      // condition.order = [[sortOrder, sortDirection]];
      // condition.order = [['crop_group','ASC'],['crop_name','ASC']];
      // condition.order = [(sequelize.col('m_crop.crop_group', 'ASC')), (sequelize.col('m_crop.crop_name', 'ASC'))];
      condition.order = [[sequelize.col('m_crop->m_crop_group.group_name'), 'ASC'], [sequelize.col('m_crop.crop_name'), 'ASC'], ['variety_name', 'ASC']];

      if (search) {
        condition.where = {};
        if (req.body.search.id) {
          condition.where.id = (req.body.search.id);
        }
        if (req.body.search.is_notified) {
          if (req.body.search.is_notified == "notified") {
            console.log('req.body.search.is_notified', req.body.search.is_notified);
            condition.where.not_date = {
              [Op.and]: [
                { [Op.not]: null },
                { [Op.not]: '' },
              ]
            };

          }
          if (req.body.search.is_notified == "non_notified") {
            console.log('req.body.search.is_notified', req.body.search.is_notified);
            condition.where.not_date = {
              [Op.or]: [
                { [Op.eq]: null },
                { [Op.eq]: '' },
              ]
            };
          }
        }
        if (req.body.search.cropGroup) {
          condition.include[0].where = {};
          condition.include[0].where.group_code = (req.body.search.cropGroup);
        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = (req.body.search.crop_code);
        }
        if (req.body.search.variety_code) {
          condition.where.variety_code = (req.body.search.variety_code);
        }
        if (req.body.search.id) {
          condition.where.id = parseInt(req.body.search.id);
        }
      }

      // condition.order = [ (sequelize.col('m_crop.crop_group','ASC')),(sequelize.col('m_crop.crop_name','ASC'))];
      let data = await cropVerietyModel.findAndCountAll(condition);
      // console.log(data.state_data,'data')


      // returnResponse = await paginateResponse(data, page, pageSize);

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

  static getCropVerietyList = async (req, res) => {
    try {
      let condition = {
        includes: [
          {
            model: indentOfBreederseedModel,
            attributes: [],
            raw: true,
            required: true,
          }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('m_crop_varieties.id')), 'id'],
          [sequelize.col("m_crop_varieties.variety_name"), "variety_name"],
        ],
        where: {

        }
      }
      if (req.body.search) {
        if (req.body.search.crop_code) {
          condition.where.crop_code = req.body.search.crop_code;
        }
      }
      condition.group = [['m_crop_varieties.id']]
      let data = await cropVerietyModel.findAndCountAll(condition);

      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      console.log(error)
      return response(res, status.DATA_NOT_SAVE, 500, error);
    }
  }

  static getBreederNameByDistrict = async (req, res) => {
    let returnResponse = {};
    try {
      let condition = {
        include: [
          {
            model: userModel,
            attributes: [],
            where: {
              'user_type': 'BR'
              // user_type: 'breeder'
              // created_by:2
            }
          },
        ],
        attributes: [
          'agency_name', 'id'
        ],
        where: {
          district_id: parseInt(req.body.search.district_code),
          state_id: parseInt(req.body.search.state_id),

        }
      };

      // if (req.body.search) {
      //   if (req.body.search.district_code) {
      //     condition.where.district_id = parseInt(req.body.search.district_code);
      //   }
      // }

      condition.order = [['agency_name', 'ASC']];
      returnResponse = await agencyDetailModel.findAll(condition);
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
    //   console.log(error)
    //   response(res, status.DATA_NOT_AVAILABLE, 500)
    // }
  }




  static getCropNameData = async (req, res) => {
    let returnResponse = {};
    try {
      // const {cropNameRaw} = req.body.sea
      // document.write('hiiiii',req.body);
      let condition = {
        include: [
          {
            model: cropGroupModel,
            left: true,
            attribute: ['group_name']
          },
          {
            model: cropModel,
            left: true,
            attribute: ['crop_name', 'grop_code'],
            where: {
              group_code: req.body.search.group_code
            }
            // attributes: [[sequelize.fn('DISTINCT', sequelize.col('crop_name')), 'crop_name']],
            // attributes: [
            //   // [sequelize.literal('DISTINCT(crop_name)'), 'crop_name'],
            //   // [sequelize.col('crop_code'), 'crop_code'],
            // ], 
          },

        ],
        where: {
        },

        raw: true
      };
      console.log('condition', condition);
      // condition.order = [['cropModel.crop_name', 'asc']];
      let { search } = req.body;

      if (search) {
        // condition.where = {};

        // if (req.body.search.group_code) {
        //   console.log('hellow', req.body.search.group_code);
        //   // condition.include[1].where.group_code = {};
        //   // console.log('condition.include[1].where.group_code',condition.include[1].where.group_code);
        //   condition.include[1].where.group_code = (req.body.search.group_code);
        //   console.log('condition', condition);

        // }

      }

      condition
      let data = await cropVerietyModel.findAndCountAll(condition);

      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 200)
      }



    }
    catch (error) {
      console.log('error', error);
      return response(res, status.DATA_NOT_SAVE, 500, error);
    }
  }



  static getVarietyNameData = async (req, res) => {
    let returnResponse = {};
    try {
      let condition = {
        attributes: ['variety_name', 'variety_code', 'id',]
      };
      // condition.order = [['cropModel.crop_name', 'asc']];
      let { search } = req.body;

      if (search) {
        condition.where = {};

        if (req.body.search.crop_code) {
          condition.where.crop_code = (req.body.search.crop_code);
        }
        if (search.isNotified) {
          condition.where.is_notified = search.isNotified;
        }
        // if (req.body.search.cropGroup) {
        //   condition.include[1].where.group_code = (req.body.search.cropGroup);
        // }
        condition.where[Op.or] = [
          { status: 'hybrid' },
          { status: 'variety' }
        ];
      }

      let data = await cropVerietyModel.findAndCountAll(condition);


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

  static updateStatusActive1 = async (req, res) => {
    try {
      const { id, is_active_status } = req.body;
      // const is_active_status =  req.body.hasOwnProperty('is_active_status') 
      console.log("req Body-is_active_statusis_active_status->", req.body.is_active_status)
      if (!id) {
        return response(res, status.BAD_REQUEST, 201, {
          message: "ID is required in the request body.",
        });
      }
      // if (!is_active_status) {
      //   return response(res, status.BAD_REQUEST, 201, {
      //     message: "is active status in the request body.",
      //   });
      // }
      // if (req.body.hasOwnProperty('is_active_status') && req.body.is_active_status !== '') {
      //   condition.where.is_active_status = is_active_status;
      // }
      const cropVarietyData = await cropVerietyModel.findByPk(id);
      if (!cropVarietyData) {
        return response(res, status.NOT_FOUND, 201, { message: 'Crop Variety Data not found.' });
      }
      // await cropVarietyData.destroy();
      cropVarietyData.is_active_status = is_active_status
      await cropVarietyData.save();
      res.status(200).json({
        status: 200,
        message: 'Data Updated successfully',
      });
    } catch (error) {
      console.error('Error deleting data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  static updateStatusActive = async (req, res) => {
    try {
      const { id, is_status_active } = req.body;

      if (!id) {
        return response(res, status.BAD_REQUEST, 201, {
          message: "ID is required in the request body.",
        });
      }

      if (is_status_active === undefined || is_status_active === null) {
        return response(res, status.BAD_REQUEST, 201, {
          message: "is_status_active in the request body is required.",
        });
      }

      const cropVarietyData = await cropVerietyModel.findByPk(id);

      if (!cropVarietyData) {
        return response(res, status.NOT_FOUND, 201, {
          message: 'Crop Variety Data not found.',
        });
      }

      cropVarietyData.is_status_active = is_status_active;
      await cropVarietyData.save();

      res.status(200).json({
        status: 200,
        message: 'Data Updated successfully',
      });
    } catch (error) {
      console.error('Error updating data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  static getVarietyNamecharacterData = async (req, res) => {

    let returnResponse = {};
    try {
      let condition = {
        include: [
          {
            model: cropModel,
            attributes: ['crop_code', 'crop_name'],
            include: [{
              model: cropGroupModel

            }],
            group: ['variety_name'],
            left: true,
            // include:[{model:cropModel,left:true}]

          },

          {
            model: cropCharactersticsModel,
            left: true,
            attributes: []
          }

        ],
        where: {
          is_active: 1,
        },
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('m_crop_varieties.variety_name')), 'variety_name'],
          [sequelize.col('m_crop_varieties.variety_code'), 'variety_code']
        ],
        raw: true

      };
      condition.order = [
        [sequelize.col('m_crop_varieties.variety_name'), 'ASC']
      ];
      let { search } = req.body;

      if (search) {
        condition.where = {};

        if (req.body.search.crop_code) {
          condition.where.crop_code = (req.body.search.crop_code);

        }
        if (req.body.search.group_code) {

          condition.include[0].include[0].where.group_code = (req.body.search.group_code);
        }
      }

      let data = await cropVerietyModel.findAndCountAll(condition);

      let datas;
      let datasValue;
      let sortcropName;
      let resa = data && data.rows ? data.rows : '';
      let removenullValue;
      // for (let index = 0; index < resa.length; index++) {
      //   if (resa[index].m_crop != null) {
      //     const result = resa.filter((thing, index, self) =>
      //       thing.m_crop_variety != null
      //     )
      //     datas = result;
      //   }
      // }

      // for (let index = 0; index < datas.length; index++) {

      //   let abc = datas.filter(x => x.m_crop_variety != null);
      //   const resultData = abc.filter((thing, index, self) =>
      //     index === self.findIndex((t) => (
      //       t.m_crop_variety.variety_name === thing.m_crop_variety.variety_name
      //     ))
      //   )
      //   datasValue = resultData;
      //   sortcropName = datasValue.sort((a, b) => a.m_crop_variety.variety_name.localeCompare(b.m_crop_variety.variety_name))


      // }


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

  static getNoYearcharacterData = async (req, res) => {

    let returnResponse = {};
    try {
      let condition = {
        where: {
          // [Op.and]:[
          //   {
          //     notification_date:{
          //       [Op.not]:null
          //     }
          //   },
          //   {
          //     notification_date:{
          //       [Op.not]:''
          //     }
          //   }
          // ]  
          [Op.and]: [
            {
              notification_year: {
                [Op.not]: null
              }
            },
          ]
        },
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('m_variety_characteristics.notification_year')), 'notification_date'],
        ],
        raw: true
      };
      condition.order = [
        [sequelize.col('m_variety_characteristics.notification_year'), 'DESC']
      ];
      let data = await cropCharactersticsModel.findAndCountAll(condition);
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
  static getMastersInstituteList = async (req, res) => {
    try {
      let data = await db.mInstitutesModel.findAll()
      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 200)
      }
    } catch (error) {
      console.log(error);
      return response(res, status.DATA_NOT_SAVE, 500, error);
    }

  }

  static getAllIndentorsList = async (req, res) => {
    try {
      let { page, pageSize } = req.body;
      let stateId = {}
      /*if (req.body.search.state_code) {
        stateId = {
          where: { state_id: parseInt(req.body.search.state_code) }

        }
      }*/
      // if (req.body.search.state_code) {
      //   stateId = {
      //     where: {
      //       state_id: parseInt(req.body.search.state_code),
      //       id: {
      //         [Op.ne]: null
      //       }
      //     }
      //   }
      // } else {
      //   stateId = {
      //     where: {
      //       id: {
      //         [Op.ne]: null
      //       }
      //     }
      //   }
      // }
      let condition = {}

      if (req.body.search.state_code) {
        condition = {
          include: [
            {
              model: userModel,
              where: {
                user_type: 'IN'
              },
              left: true,
            },
            {
              model: stateModel,
              // left: true,
              // attributes: ['state_code', 'state_code', 'district_code'],
              where: {}
            },
            {
              model: districtModel,
              // left: true,
              attributes: ['district_name', 'state_code', 'district_code'],
              // where: {}
            },

            {
              model: mCategoryOrgnization,
              // left: true
            },

            // ...stateId

          ],
          // raw:true,
          where: {
            state_id: parseInt(req.body.search.state_code),
            id: {
              [Op.ne]: null
            }
          },
          attributes: ['agency_name', 'category', 'district_id', 'short_name', 'address', 'contact_person_name', 'contact_person_mobile', 'email', 'latitude', 'longitude'],
          // attributes: ['user_type', 'agency_id']
        };

      } else {
        condition = {
          include: [
            {
              model: userModel,
              where: {
                user_type: 'IN'
              },
              left: true,
            },
            {
              model: stateModel,
              // left: true,
              // attributes: ['state_code', 'state_code', 'district_code'],
              where: {}
            },
            {
              model: districtModel,
              // left: true,
              attributes: ['district_name', 'state_code', 'district_code'],
              // where: {}
            },

            {
              model: mCategoryOrgnization,
              // left: true
            },
          ],
          attributes: ['agency_name', 'category', 'district_id', 'short_name', 'address', 'contact_person_name', 'contact_person_mobile', 'email', 'latitude', 'longitude', 'is_active'],
        };
      }
      if (req.body.search) {
        // if (req.body.search.state_code) {
        //   condition.include.where.state_id = parseInt(req.body.search.state_code);
        // }
      }
      
      //Old Pagination Condition

      // if (req.body.page) {
      //   if (page === undefined) page = 1;
      //   if (pageSize === undefined) pageSize = 10;

      //   if (page > 0 && pageSize > 0) {
      //     condition.limit = pageSize;
      //     condition.offset = (page * pageSize) - pageSize;
      //   }
      // }

      if (req.body.page) {

        if (!req.body.search.isReport)
        {
          if (page === undefined) page = 1;
          if (pageSize === undefined) pageSize = 10;
  
          if (page > 0 && pageSize > 0) {
            condition.limit = pageSize;
            condition.offset = (page * pageSize) - pageSize;
          }
        }
        else
        {
        
        }
      }

      


      // const sortOrder = req.body.sort ? req.body.sort : 'id';
      // const sortDirection = req.body.order ? req.body.order : 'DESC';

      // condition.order = [[sortOrder, sortDirection]];

      condition.order = [[sequelize.col('agency_name'), 'asc'],
      [sequelize.col('short_name'), 'asc'],
      [sequelize.col('m_state.state_name'), 'asc'],
      [sequelize.col('m_district.district_name'), 'asc'],
      [sequelize.col('latitude'), 'asc'],
      [sequelize.col('longitude'), 'asc'],
        // [sequelize.col('agency_detail.addrress'), 'asc'],
        // [sequelize.col('agency_detail.longitude'), 'asc'],

      ]


      const data = await agencyDetailModel.findAndCountAll(condition, {

      });
      if (!data) {
        return response(res, status.DATA_NOT_AVAILABLE, 404);
      }

      return response(res, status.DATA_AVAILABLE, 200, data);
    }
    catch (error) {
      console.log(error)
      return response(res, status.UNEXPECTED_ERROR, 500, error)
    }
  }

  static auditTrailHistory = async (req, res) => {
    //console.log(req);
    let returnResponse = {};
    let internalCall = {};
    try {
      let rules = {
        // 'lab_name': 'string',
        // 'max_lot_size': 'string'
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
        action_at: req.body.action_at,
        action_by: req.body.action_by,
        application_id: req.body.application_id,
        column_id: req.body.column_id,
        comment: req.body.comment,
        created_at: Date.now(),
        form_type: req.body.form_type,
        // id: req.body.short_name,
        ip: req.body.ip,
        mac_number: req.body.mac_number,
        table_id: req.body.table_id,
        user_id: req.body && req.body.user_id ? req.body.user_id : null,
        user_action: req.body && req.body.user_action ? req.body.user_action : null,
        user_type: req.body && req.body.user_type ? req.body.user_type : null,
        updated_at: Date.now()
      };
      // console.log('data========', data);
      const auditTaildbData = auditTaildbModel.create(data);
      returnResponse = auditTaildbData;
      // console.log('save data=====', returnResponse);
      if (returnResponse) {
        return response(res, status.DATA_SAVE, 200, returnResponse, internalCall)
      } else {
        return response(res, status.DATA_NOT_SAVE, 401, returnResponse, internalCall)
      }

    } catch (error) {
      // console.log('error =====', error);
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }

  }
  static getSeedMultiplicationCropNameData = async (req, res) => {
    let returnResponse = {};
    try {
      // document.write('hiiiii',req.body);
      let condition = {
        include: [

          {
            model: cropModel,
            left: true,
            attribute: ['crop_name', 'grop_code'],

            // attributes: [[sequelize.fn('DISTINCT', sequelize.col('crop_name')), 'crop_name']],
            group: ['crop_name'],

            include: [{
              model: cropGroupModel

            }],
            where: {
              group_code: req.body.search.group_code,
              // is_active:1
            },

            // attributes: [[sequelize.fn('DISTINCT', sequelize.col('crop_name')), 'crop_name']],
            // attributes: [
            //   // [sequelize.literal('DISTINCT(crop_name)'), 'crop_name'],
            //   // [sequelize.col('crop_code'), 'crop_code'],
            // ], 
          },

        ],
        where: {
        },
        // raw: true
      };
      let { search } = req.body;





      let data = await seedMultiplicationRatioModel.findAndCountAll(condition);
      let newData = data && data.rows ? data.rows : ''
      var clean = newData.filter((arr, index, self) =>
        index === self.findIndex((t) => (t.m_crop.crop_name === arr.m_crop.crop_name)))

      // console.log(clean);

      if (clean) {
        response(res, status.DATA_AVAILABLE, 200, clean);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 200)
      }



    }
    catch (error) {
      console.log('error', error);
      return response(res, status.DATA_NOT_SAVE, 500, error);
    }
  }

  static getMaxLotSizeCropName = async (req, res) => {
    let returnResponse = {};
    try {
      let condition = {
        include: [

          {
            model: cropModel,
            left: true,
            group: ['crop_name'],

            // attributes: [[sequelize.fn('DISTINCT', sequelize.col('crop_name')), 'crop_name']],
            include: [
              {
                model: cropGroupModel,
                left: true,

                // attribute: ['group_name']
                // 
              },
            ],

            where: {

              group_code: (req.body.search.group_code),
              is_active: 1
            }



          },



        ],
        attributes: [[sequelize.fn('DISTINCT', sequelize.col('m_crop.crop_name')), 'crop_name']],
        raw: true,



      };
      // condition.order = [['crop_name', 'asc']]
      // condition.order = [[sequelize.col('cropModel.crop_name'), 'asc'],];
      // condition.order = [['cropModel.crop_name', 'asc']];
      let { search } = req.body;

      // if (search) {


      //   if (req.body.search.group_code) {
      //     condition.where = {};
      //     condition.include[0].where.group_code = (req.body.search.group_code);
      //   }
      //   // if (req.body.search.cropGroup) {
      //   //   condition.include[1].where.group_code = (req.body.search.cropGroup);
      //   // }
      // }

      let data = await maxLotSizeModel.findAndCountAll(condition);

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




  static upload = async (req, res) => {
    try {
      // console.log('req',req.body,' this.pathmulti');
      // console.log('res.files.upload', req.files);
      const { file = {} } = req.files;
      const { folderName = "" } = req.body;
      const allowedFile = ['png', 'jpg', 'jpeg'];
      if (!(allowedFile.includes(file.mimetype.split('/')[1]))) {
        return response(res, status.ALLOWED_IMAGE, 404);
      }

      if (file.size > 2000000) {
        return response(res, status.IMAGE_SIZE, 404);
      }
      const results = await this.s3Uploadv3(file, folderName);
      console.log(results.name, 'res');

      return res.json({ status: "success", results });
    } catch (err) {
      console.log(err, 'eerr');
    }
  }

  static s3Uploadv3 = async (file) => {
    console.log("process.env.AWS_BUCKET_NAME", process.env.AWS_BUCKET_NAME)
    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      endpoint: process.env.END_POINT,
      s3ForcePathStyle: true, // needed with NIC Object Storage?
      signatureVersion: 'v4',
      Bucket: process.env.AWS_BUCKET_NAME
    });
    console.log("s3", s3)
    // const s3 = new AWS.S3({ params: { Bucket: process.env.AWS_BUCKET_NAME } });

    const params = {
      Key: `upload/${uuid()}-${file.name}`,
      Body: file.data,
      // ContentEncoding: 'base64',
      ContentType: 'image/jpeg',
      Bucket: process.env.AWS_BUCKET_NAME,
      ACL: 'public-read',
    };
    console.log(params);
    return new Promise((resolve, reject) => {
      s3.putObject(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          const returnData = { ...data, name: params.Key };
          resolve(returnData);
          console.log('>>>>>>>>>>>>', returnData);
        }
      });
    });
    // const command = await s3client.send(new PutObjectCommand(params));
    // return { ...command, name: params.Key };
  };
  static s3Uploadv3_old = async (file, folderName) => {
    const s3client = new S3Client({ region: process.env.AWS_REGION });
    const folder = folderName ? folderName : "upload";
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${folder}/${uuid()}-${file.name}`,
      Body: file.data,
      ACL: 'public-read'
    };

    const command = await s3client.send(new PutObjectCommand(params));

    return { ...command, name: params.Key };

  };
  static getFile = async (req, res) => {
    const s3client = new S3Client({ region: process.env.AWS_REGION });

    const bucketParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: req.query.file,
    };

    const getObjectCommand = new GetObjectCommand(bucketParams);
    const url = await getSignedUrl(s3client, getObjectCommand, { expiresIn: 3600 });
    console.log('url: ' + url);
    return response(res, status.DATA_AVAILABLE, 200, url);
  }
  static editcropVarietyCharacterstics = async (req, res) => {
    try {
      const id = req.body.id;
      let varitData = await cropVerietyModel.findAll({
        where: {
          [Op.and]: [
            sequelize.where(
              sequelize.fn('lower', sequelize.col('variety_name')),
              sequelize.fn('lower', req.body.variety_name),
            ),
            {
              id: {
                [Op.ne]: req.body.id
              }
            },
            // sequelize.where(sequelize.col('is_active'), 1),
            // sequelize.where(sequelize.col('r'), 1),


          ],
        }
      });

      if ((varitData && varitData.length)) {
        const errorResponse = {
          subscriber_id: 'Variety Name no is already registered. Please fill form correctly'
        }
        return response(res, status.USER_EXISTS, 409, errorResponse)
      }
      const data = await cropVerietyModel.update({
        crop_group_code: req.body.crop_group,
        crop_code: req.body.crop_name,
        variety_code: req.body.variety_code,
        variety_name: req.body.variety_name,
        is_notified: req.body.notified,
        not_date: req.body.notification_date,
        not_number: req.body.notified_number,
        meeting_number: req.body.meeting_number,
        release_date: req.body.year_of_release,
        introduce_year: req.body.introduce_year,
        type: req.body.select_type,
        developed_by: req.body.developed_by,
        is_active: req.body.active
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



  static getCropNamecharacterData = async (req, res) => {
    let returnResponse = {};
    try {
      // document.write('hiiiii',req.body);
      let condition = {
        include: [

          {
            model: cropModel,
            include: [{
              model: cropGroupModel
            }],
            left: true,
            attribute: ['crop_name', 'grop_code'],
            where: {
              group_code: req.body.search.group_code
            }
            // attributes: [[sequelize.fn('DISTINCT', sequelize.col('crop_name')), 'crop_name']],
            // attributes: [
            //   // [sequelize.literal('DISTINCT(crop_name)'), 'crop_name'],
            //   // [sequelize.col('crop_code'), 'crop_code'],
            // ], 
          },

        ],
        where: {
        },
        // raw: true
      };
      let { search } = req.body;

      if (search) {
        condition.where = {};

        if (req.body.search.group_code) {
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

      }


      let data = await cropVerietyModel.findAndCountAll(condition);
      let newData = data && data.rows ? data.rows : ''
      var clean = newData.filter((arr, index, self) =>
        index === self.findIndex((t) => (t.m_crop.crop_name === arr.m_crop.crop_name)))

      // console.log(clean);

      if (data) {
        response(res, status.DATA_AVAILABLE, 200, clean);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 200)
      }



    }
    catch (error) {
      console.log('error', error);
      return response(res, status.DATA_NOT_SAVE, 500, error);
    }
  }

  static getSeedVarietyCropNameData = async (req, res) => {

    let returnResponse = {};
    try {
      let condition = {
        include: [
          {
            model: cropModel,
            attributes: [],

            // attributes: [ [sequelize.literal('COUNT(DISTINCT(crop_name))'), 'crop_name'],'id','crop_code'],
            // group:[sequelize.col('m_crop_varieties.id')],


            include: [{
              model: cropGroupModel,
              attributes: [],

            }],
            left: true,
            where: {
              group_code: (req.body.search.group_code),
              // is_active:1
            }
          },

        ],
        where: {

        },
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('m_crop.crop_code')), 'crop_code'],
          [sequelize.col("m_crop.crop_name"), "crop_name"],
          // [sequelize.col("m_crop.crop_code"), "crop_code"],
        ],
        raw: true


      };

      let { search } = req.body;

      if (search) {
        condition.where = {};
        if (search.isNotified) {
          condition.where.is_notified = (search.isNotified);
        }
        // if (req.body.search.crop_code) {
        //   condition.where.crop_code = (req.body.search.crop_code);
        // }
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
      condition.order = [[sequelize.col("m_crop.crop_name"), 'ASC']]

      let data = await cropVerietyModel.findAndCountAll(condition);


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
  static getCropVerietyCodeList = async (req, res) => {
    try {
      let condition = {
        // include: [
        //   {
        //     model:indentOfBreederseedModel,
        //     attributes:[],
        //     raw:true,
        //     required:true,
        //   }
        // ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('m_crop_varieties.variety_name')), 'variety_name'],
          [sequelize.col("m_crop_varieties.variety_code"), "variety_code"],
          [sequelize.col("m_crop_varieties.variety_name"), "variety_name"],
          'id'
          // "variety_code"
        ],
        where: {
          is_active: 1

        }
      }
      condition.order = [['variety_name', 'ASC']];
      if (req.body.search) {
        if (req.body.search.crop_code) {
          condition.where.crop_code = req.body.search.crop_code;
        }
      }
      // condition.group = [['m_crop_varieties.id']]
      let data = await cropVerietyModel.findAndCountAll(condition);

      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      console.log(error)
      return response(res, status.DATA_NOT_SAVE, 500, error);
    }
  }

  static getdistinctCropNameInVariety = async (req, res) => {
    let data = {};
    try {
      let condition = {}
      let cropGroup;
      if (req.body.loginedUserid.user_type === "OILSEEDADMIN") {
        cropGroup = { crop_code: { [Op.like]: 'A04%' } };
      }
      if (req.body.search.view) {
        condition = {
          where: {
            // is_active:1
            // ...cropGroup
          },
          raw: false,
          attributes: [
            [sequelize.literal('DISTINCT(crop_name)'), 'crop_name'],
            // [sequelize.fn('DISTINCT', sequelize.col('crop_name')) ,'crop_name'],
            // 'crop_code'

            [sequelize.col('crop_code'), 'crop_code'],
          ],

        };
      } else {
        condition = {
          where: {
            is_active: 1,
            ...cropGroup

          },
          raw: false,
          attributes: [
            [sequelize.literal('DISTINCT(crop_name)'), 'crop_name'],
            // [sequelize.fn('DISTINCT', sequelize.col('crop_name')) ,'crop_name'],
            // 'crop_code'

            [sequelize.col('crop_code'), 'crop_code'],
          ],

        };
      }
      condition.order = [['crop_name', 'ASC']];
      if (req.body.search) {
        if (req.body.search.group_code) {
          condition.where.group_code = (req.body.search.group_code);
        }
      }
      data = await cropModel.findAll(condition);

      // res.send(data)

      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getdistinctVariettyNameIncharacterstics = async (req, res) => {
    try {
      // let cropGroup;
      // if (req.body.loginedUserid.user_type === "OILSEEDADMIN") {
      //   cropGroup = { crop_code: { [Op.like]: 'A04%' } };
      // }
      let condition = {}
      if (req.body.search.view) {
        condition = {

          // include: [
          //   {
          //     model:indentOfBreederseedModel,
          //     attributes:[],
          //     raw:true,
          //     required:true,
          //   }
          // ],
          attributes: [
            [sequelize.fn('DISTINCT', sequelize.col('m_crop_varieties.variety_name')), 'variety_name'],
            [sequelize.col("m_crop_varieties.variety_code"), "variety_code"],
            [sequelize.col("m_crop_varieties.variety_name"), "variety_name"],
            'id'
            // "variety_code"
          ],
          where: {
            // ...cropGroup,
            crop_code: req.body.search.crop_code,
            status: {
              [Op.or]: [
                {
                  [Op.in]: ['hybrid', 'variety']

                },

                {
                  [Op.eq]: null

                },
              ]
            }
          }

        }
      } else {
        condition = {
          // include: [
          //   {
          //     model:indentOfBreederseedModel,
          //     attributes:[],
          //     raw:true,
          //     required:true,
          //   }
          // ],
          attributes: [
            [sequelize.fn('DISTINCT', sequelize.col('m_crop_varieties.variety_name')), 'variety_name'],
            [sequelize.col("m_crop_varieties.variety_code"), "variety_code"],
            [sequelize.col("m_crop_varieties.variety_name"), "variety_name"],
            'id'
            // "variety_code"
          ],
          // where: {
          //   is_active: 1,
          //   crop_code: req.body.search.crop_code

          // }
          where: {
            [Op.and]: [
              {
                crop_code: {
                  [Op.eq]: req.body.search.crop_code
                }

              },
              {
                id: {
                  [Op.notIn]: req.body.search.variety
                }

              },

              {
                is_active: {
                  [Op.eq]: 1
                },
                status: {
                  [Op.or]: [
                    {
                      [Op.in]: ['hybrid', 'variety']

                    },

                    {
                      [Op.eq]: null

                    },
                  ]
                }
              },

            ]
          },
        }
      }

      condition.order = [['variety_name', 'ASC']];

      // condition.group = [['m_crop_varieties.id']]
      let data = await cropVerietyModel.findAndCountAll(condition);

      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      console.log(error)
      return response(res, status.DATA_NOT_SAVE, 500, error);
    }
  }
  static distinctCropNamegrid = async (req, res) => {
    let data = {};
    try {
      let cropGroup;
      if (req.body.loginedUserid.user_type === "OILSEEDADMIN") {
        cropGroup = { crop_code: { [Op.like]: 'A04%' } };
      }
      let condition = {
        where: {
          ...cropGroup
        },
        raw: false,
        attributes: [
          [sequelize.literal('DISTINCT(crop_name)'), 'crop_name'],
          // [sequelize.fn('DISTINCT', sequelize.col('crop_name')) ,'crop_name'],
          // 'crop_code'

          [sequelize.col('crop_code'), 'crop_code'],
        ],

      };
      condition.order = [['crop_name', 'asc']];
      if (req.body.search) {
        if (req.body.search.group_code) {
          condition.where.group_code = (req.body.search.group_code);
        }
      }
      data = await cropModel.findAll(condition);

      // res.send(data)

      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getdistinctVariettyNameIncharactersticsfromCharacterstics = async (req, res) => {
    try {
      // let cropGroup;
      // if (req.body.loginedUserid.user_type === "OILSEEDADMIN") {
      //   cropGroup = { crop_code: { [Op.like]: 'A04%' } };
      // }
      let condition = {}
      condition = {
        // include: [
        //   {
        //     model:indentOfBreederseedModel,
        //     attributes:[],
        //     raw:true,
        //     required:true,
        //   }
        // ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('variety_id')), 'variety_id'],
          // [sequelize.col("m_crop_varieties.variety_code"), "variety_code"],
          // [sequelize.col("m_crop_varieties.variety_name"), "variety_name"],
          // 'variety_id'
          // "variety_code"
        ],
        where: {
          // is_active: 1,
          // ...cropGroup,
          crop_code: req.body.search.crop_code

        }

      }

      // condition.order = [['variety_name', 'ASC']];

      // condition.group = [['m_crop_varieties.id']]
      let data = await cropCharactersticsModel.findAndCountAll(condition);

      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      console.log(error)
      return response(res, status.DATA_NOT_SAVE, 500, error);
    }
  }
  static getCropDataList = async (req, res) => {
    const { internalCall } = req.body;
    let returnResponse = {};
    let data = {};
    try {

      let condition = {
        include: [
          {
            model: cropGroupModel
          },
        ]
      };
      let { page, pageSize, search } = req.body;
      if (req.body.page) {
        if (page === undefined) page = 1;
        if (pageSize === undefined) {
          pageSize = 10;
        } // set pageSize to -1 to prevent sizing

        if (page > 0 && pageSize > 0) {
          condition.limit = pageSize;
          condition.offset = (page * pageSize) - pageSize;
        }
      }


      const sortOrder = req.body.sort ? req.body.sort : 'id';
      const sortDirection = req.body.order ? req.body.order : 'DESC';


      // condition.order = [[sortOrder, sortDirection]];
      // condition.order = [['crop_group', 'ASC'],
      condition.order = [
        [sequelize.col('m_crop_group.group_name'), 'ASC'],
        ['crop_name', 'ASC']
      ];
      if (req.body.search) {
        condition.where = {}

        if (req.body.search.group_code) {
          condition.where.group_code = (req.body.search.group_code);
        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = (req.body.search.crop_code);
        }
        if (req.body.search.crop_name_data) {
          condition.where.crop_group = (req.body.search.crop_name_data);
        }
        // if (req.body.search.user_id) {
        //   condition.where.user_id = (req.body.search.user_id);
        // }
      }

      data = await cropModel.findAndCountAll(condition);
      // returnResponse = await paginateResponse(data, page, pageSize);

      // res.send(data)

      response(res, status.DATA_AVAILABLE, 200, data, internalCall)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }


  static viewCropGroupReport = async (req, res) => {

    let returnResponse = {};
    let cropGroup;
    if (req.body.loginedUserid.user_type === "OILSEEDADMIN") {
      cropGroup = { crop_code: { [Op.like]: 'A04%' } };
    }
    try {
      let condition = {
        include: [
          {
            model: cropGroupModel,
            attributes: [],
          },
        ],
        where: {
          ...cropGroup
        },
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('m_crop_group.group_code')), 'group_code'],
          [sequelize.col("m_crop_group.group_name"), "group_name"],
          // [sequelize.col("m_crop.crop_code"), "crop_code"],
        ],
        raw: true


      };

      let { search } = req.body;

      if (search) {
        condition.where = {};

        // if (req.body.search.crop_code) {
        //   condition.where.crop_code = (req.body.search.crop_code);
        // }
        if (req.body.search.type == 'report') {
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
      condition.order = [[sequelize.col("m_crop_group.group_name"), 'ASC']]

      let data = await cropModel.findAndCountAll(condition);


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
  static getCropListReport = async (req, res) => {
    const { internalCall } = req.body;
    let returnResponse = {};
    let data = {};
    try {
      let cropGroupCondition = {};
  
      // 🔹 Restrict data based on user_type
      if (req.body.loginedUserid.user_type === "OILSEEDADMIN") {
        cropGroupCondition = { group_code: { [Op.like]: 'A04%' } };
      }
      if (req.body.loginedUserid.user_type === "PULSESSEEDADMIN") {
        cropGroupCondition = { group_code: { [Op.like]: 'A03%' } };
      }

      let condition = {
        include: [
          {
            model: cropGroupModel
          }
        ],
        where: {
          ...cropGroupCondition
        }
      };
      let { page, pageSize, search } = req.body;
      if (req.body.page) {
        if (page === undefined) page = 1;
        if (pageSize === undefined) {
          pageSize = 10;
        } // set pageSize to -1 to prevent sizing

        if (page > 0 && pageSize > 0) {
          condition.limit = pageSize;
          condition.offset = (page * pageSize) - pageSize;
        }
      }


      const sortOrder = req.body.sort ? req.body.sort : 'id';
      const sortDirection = req.body.order ? req.body.order : 'DESC';


      // condition.order = [[sortOrder, sortDirection]];
      // condition.order = [['crop_group', 'ASC'],
      condition.order = [[sequelize.col('m_crop_group.group_name'), 'ASC'], ['crop_name', 'ASC']
      ];
      if (req.body.search) {
        condition.where = {...cropGroupCondition}

        if (req.body.search.group_code) {
          condition.where.group_code = (req.body.search.group_code);
        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = (req.body.search.crop_code);
        }
        if (req.body.search.crop_name_data) {
          condition.where.crop_group = (req.body.search.crop_name_data);
        }
        if (req.body.search.type == 'report') {
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
          if (search.user_type === "OILSEEDADMIN") {
            condition.where.group_code = { [Op.like]: 'A04%' };
          }
          if (search.user_type === "PULSESSEEDADMIN") {
            condition.where.group_code = { [Op.like]: 'A03%' };
          }
          // condition.where.crop_group = (req.body.search.crop_name_data);
        }
        // if (req.body.search.user_id) {
        //   condition.where.user_id = (req.body.search.user_id);
        // }
      }
      data = await cropModel.findAndCountAll(condition);
      // returnResponse = await paginateResponse(data, page, pageSize);

      // res.send(data)

      response(res, status.DATA_AVAILABLE, 200, data, internalCall)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  
}

module.exports = UserController


