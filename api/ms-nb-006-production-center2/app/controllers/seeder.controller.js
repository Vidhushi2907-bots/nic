require('dotenv').config()
const response = require('../_helpers/response')
const status = require('../_helpers/status.conf')
const db = require("../models");
const axios = require('axios');
var https = require('https');

const agencyDetailModel = db.agencyDetailModel;
const userModel = db.userModel;
const userTypeModel = db.userTypeModel;
const varietyModel = db.varietyModel;
const breederCropModel = db.breederCropModel;
const lotNumberModel = db.lotNumberModel;
const cropModel = db.cropModel;
const bsp4Model = db.bsp4Model;
const bsp1Model = db.bsp1Model;
const bsp2Model = db.bsp2Model;
const bsp5aModel = db.bsp5aModel;
const allocationToIndentorProductionCenterSeed = db.allocationToIndentorProductionCenterSeed;
const bsp3Model = db.bsp3Model;
const performaSeedModel = db.performaSeedModel
const maxLotSizeModel = db.maxLotSizeModel;
const labelNumberForBreederseed = db.labelNumberForBreederseed;
const generatedLabelNumberModel = db.generatedLabelNumberModel;
const seedTestingReportsModel = db.seedTestingReportsModel;
const cropGroupDataModel = db.cropGroupModel;
const breederCropsVerietiesModel = db.breederCropsVerietiesModel;
const seasonModel = db.seasonModel;
const allocationToIndentor = db.allocationToIndentor;
const bsp5bModel = db.bsp5bModel;
const breederCertificate = db.breederCertificate;
const designationModel = db.designationModel;
const generateBills = db.generateBills;
const bspctoplantModel = db.bspctoplantModel;
const seedLabTestModel = db.seedLabTestModel;
const Sequelize = require('sequelize');


//utility initialize
const paginateResponse = require("../_utility/pagination");

//validator initialize
let Validator = require('validatorjs');

// model initialize
const stateModel = db.stateModel;
const nucleusSeedAvailabityModel = db.nucleusSeedAvailabityModel;
const indentOfBreederseedModel = db.indentOfBreederseedModel;
const bsp1ProductionCenterModel = db.bsp1ProductionCenterModel;

const sequelize = require('sequelize');
const ConditionCreator = require('../_helpers/condition-creator');
const performa_seedModel = require('../models/performa_seed.model');
const cropVerietyModel = db.cropVerietyModel;
const bsp4ToPlant = db.bsp4ToPlant;
const plantDetail = db.plantDetail;

// const { cropVerietyModel, districtModel } = require('../../../ms-nb-005-seed-division-center/app/models');
const { where } = require('sequelize');
const productiohelper = require('../_helpers/productionhelper');
const Op = require('sequelize').Op;

class SeederController {

  static nucleusSeedAvailabitySubmission = async (req, res) => {
    try {
      let tabledAlteredSuccessfully = false;
      let tabledExtracted = false;
      if (req.body !== undefined
        && req.body.nucleusSeed !== undefined
        && req.body.nucleusSeed.length > 0) {
        tabledExtracted = true;
        for (let index = 0; index < req.body.nucleusSeed.length; index++) {
          const element = req.body.nucleusSeed[index];
          const dataRow = {
            date_of_reference: element.date_of_reference ? element.date_of_reference : Date.now(),
            refernce_number_moa: element.refernce_number_moa,
            crop_code: element.crop_code.crop_code,
            variety_id: element.variety_id,
            user_id: element.user_id,
            year: element.year.value,
            is_active: 1,
            officer_order_date: element.officer_order_date ? element.officer_order_date : Date.now(),
            breeder_production_centre_name: element.breader_production_center_name,
            contact_officer_designation: element.contact_Officer_designation,
            quantity: parseFloat(element.quantity_of_nucleus_seed) ? parseFloat(element.quantity_of_nucleus_seed) : 0,
            contact_officer_name: element.contact_person_name,
            reference_number_officer_order: element.reference_no_of_office,
            production_center_id: element.user_id,
            created_at: Date.now(),
            updated_at: Date.now(),
            season: element.season.season_code,
            variety_code: element.variety_code,
            is_flag: 1

          };
          if (element.id > 0) {
            // update
            await nucleusSeedAvailabityModel.update(dataRow, { where: { id: element.id } }).then(function (item) {
              tabledAlteredSuccessfully = true;
            }).catch(function (err) {

            });
          }
          else {
            const newData = await nucleusSeedAvailabityModel.build(dataRow);
            await newData.save();
            tabledAlteredSuccessfully = true;
          }
        }
      }
      if (!tabledExtracted) {
        return response(res, status.REQUEST_DATA_MISSING, 204);
      }
      else {
        if (tabledAlteredSuccessfully) {
          return response(res, status.DATA_SAVE, 200, {})
        } else {
          return response(res, status.DATA_NOT_AVAILABLE, 404)
        }

      }
    }
    catch (error) {
      console.log('qwertyuiop', error);
      return response(res, status.UNEXPECTED_ERROR, 500)
    }
  }
  static updatenucleusSeedAvailabitySubmission = async (req, res) => {
    let returnResponse = {};
    let internalCall = {};
    try {
      let rules = {
        // 'crop': 'string',
        // 'max_lot_size': 'string',
        // 'group_code': 'string',
        // 'group_name': 'string',
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
        date_of_reference: req.body.date_of_reference,
        refernce_number_moa: req.body.refernce_number_moa,
        crop_code: req.body.crop_code,
        variety_id: req.body.variety_id,
        user_id: req.body.user_id,
        year: req.body.year,
        is_active: 1,
        officer_order_date: req.body.officer_order_date,
        breeder_production_centre_name: req.body.breader_production_center_name,
        contact_officer_designation: req.body.contact_Officer_designation,
        quantity: req.body.quantity_of_nucleus_seed,
        contact_officer_name: req.body.contact_person_name,
        reference_number_officer_order: req.body.reference_no_of_office,
        production_center_id: req.body.user_id,
        created_at: Date.now(),
        updated_at: Date.now(),
      }
      const nucleusSeedAvailabityData = nucleusSeedAvailabityModel.update(data, { where: { id: req.body.id } });
      returnResponse = {};
      return response(res, status.DATA_UPDATED, 200, returnResponse, internalCall)
    } catch (error) {
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }


  static getNucleusSeedAvailabityData = async (req, res) => {
    let returnResponse = {};
    try {
      let rules = {
        'search.year': 'date',
        'search.crop_name': 'integer',
        'search.veriety_name': 'integer',
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

      //if page and pageSize found
      let { page, pageSize } = req.body;

      //if page not found then by default set 1
      if (!page) page = 1;

      let condition = {
        where: {
          is_active: 1
        }
      };

      //implement sort
      const sortOrder = req.body.sort ? req.body.sort : 'created_at';
      const sortDirection = req.body.order ? req.body.order : 'DESC';

      //pagination condition
      if (page && pageSize) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }

      //sort condition
      condition.order = [[sortOrder, sortDirection]];

      if (req.body.search) {
        if (req.body.search) {
          if (req.body.search.crop_id) {
            condition.where.crop_id = parseInt(req.body.search.crop_id);
          }
          if (req.body.search.year) {
            condition.where.year = (req.body.search.year);
          }
          if (req.body.search.veriety_id) {
            condition.where.veriety_id = parseInt(req.body.search.veriety_id);
          }
        }
      }

      const queryData = await nucleusSeedAvailabityModel.findAndCountAll(condition);
      returnResponse = await paginateResponse(queryData, page, pageSize);
      return response(res, status.DATA_AVAILABLE, 200, returnResponse);


    } catch (error) {
      // returnResponse = {
      //   'msg': error
      // }
      console.log(error)
      return response(res, status.DATA_NOT_AVAILABLE, 500, returnResponse);
    }
  }

  static getNucleusSeedAvailabityData1 = async (req, res) => {
    try {
      let season = "";
      let searchs = req.body.search;

      const userId = {
        where: {
          production_center_id: req.body.loginedUserid.id
        }
      }
      let condition = {
        include: [
          {
            model: varietyModel,
            required: true
          },
          {
            model: cropModel,
            required: true,
            include: [
              {
                model: seasonModel,
                required: false,
                where: {
                }
              }
            ],
            where: {

            }
          },
          // {
          //   model: breederCropModel,
          //   // required: true,
          //   ...userId,
          // }
        ],
        where: {},
        // raw:true,
        // left:true
      }
      // if (searchs) {
      //   for (let index = 0; index < searchs.length; index++) {
      //     const elements = searchs[index];
      //     if (elements.columnNameInItemList.toLowerCase() == "season.value") {
      //       season = elements.value;
      //       condition.include[1].where.season = season;
      //     }
      //   }
      // }
      let { page, pageSize, search } = req.body;
      if (page === undefined) page = 1;
      if (pageSize === undefined) pageSize = 5; // set pageSize to -1 to prevent sizing

      if (page > 0 && pageSize > 0) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }
      //implement sort
      const sortOrder = req.body.sort ? req.body.sort : 'id';
      const sortDirection = req.body.order ? req.body.order : 'DESC';
      //sort condition

      condition.order = [[sortOrder, sortDirection]];


      if (search) {
        condition.where = {};
        for (let index = 0; index < search.length; index++) {
          const element = search[index];
          if (element.columnNameInItemList.toLowerCase() == "year.value") {
            condition.where["year"] = (element.value);
          }
          if (element.columnNameInItemList.toLowerCase() == "crop.value") {
            condition.where["crop_code"] = element.value;
          }
          if (element.columnNameInItemList.toLowerCase() == "season.value") {
            condition.include[1].include[0].where["season_code"] = element.value;
          }
          if (element.columnNameInItemList.toLowerCase() == "variety.value") {
            condition.where["variety_id"] = parseInt(element.value);
          }
          if (element.columnNameInItemList.toLowerCase() == "id") {
            condition.where["id"] = element.value;
          }
        }
      }
      if (req.body) {
        if (req.body.id) {
          condition.where.production_center_id = (req.body.id);
        }
      }
      if (req.body.search) {
        if (req.body.search.year) {
          condition.where.year = (req.body.search.year);
        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = (req.body.search.crop_code);
        }
        if (req.body.search.variety_code) {
          condition.where.variety_code = (req.body.search.variety_code);
        }
      }
      let data = await nucleusSeedAvailabityModel.findAndCountAll(condition);

      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      console.log("error", error)
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    }
  }
  static getNucleusSeedAvailabityDataNew = async (req, res) => {
    try {
      let season = "";
      let searchs = req.body.search



      let condition = {
        include: [
          {
            model: varietyModel,
            required: false
          },
          {
            model: cropModel,
            required: false,
            where: {

            }
          }
        ],
        where: {

        },
        // raw:true,
        // left:true
      }
      if (searchs) {
        for (let index = 0; index < searchs.length; index++) {
          const elements = searchs[index];
          if (elements.columnNameInItemList.toLowerCase() == "season.value") {
            season = elements.value;
            condition.include[1].where.season = season;
          }
        }
      }
      let { page, pageSize, search } = req.body;
      if (page === undefined) page = 1;
      if (pageSize === undefined) pageSize = 5; // set pageSize to -1 to prevent sizing

      if (page > 0 && pageSize > 0) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }
      //implement sort
      const sortOrder = req.body.sort ? req.body.sort : 'id';
      const sortDirection = req.body.order ? req.body.order : 'DESC';
      //sort condition

      condition.order = [[sortOrder, sortDirection]];


      if (search) {
        condition.where = {};
        for (let index = 0; index < search.length; index++) {
          const element = search[index];
          if (element.columnNameInItemList.toLowerCase() == "year.value") {
            condition.where["year"] = (element.value);
          }

          if (element.columnNameInItemList.toLowerCase() == "crop.value") {
            condition.include[1].where = {};
            condition.include[1].where["crop_code"] = element.value;
          }
          if (element.columnNameInItemList.toLowerCase() == "variety.value") {
            condition.where["variety_id"] = parseInt(element.value);
          }
          // if (element.columnNameInItemList.toLowerCase() == "id") {
          //   condition.where["id"] = element.value;
          // }
        }
      }
      // if (req.body.search) {
      //   if (req.body.search.year) {
      //     condition.where.year = (req.body.search.year);
      //   }
      //   if (req.body.search.crop_code) {
      //     condition.include[1].where = {};
      //     condition.include[1].where.crop_code = (req.body.search.crop_code);
      //   }
      //   if (req.body.search.variety_code) {
      //     condition.where.variety_code = (req.body.search.variety_code);
      //   }
      // }
      let data = await nucleusSeedAvailabityModel.findAndCountAll(condition);

      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      console.log("error", error)
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    }
  }

  static getUserData = async (req, res) => {
    try {
      let condition = {
        include: [
          // {
          //   model: userModel,
          //   attributes: ['id','user_type'],
          //   include:[
          //     // {
          //     //   model: userTypeModel,
          //     //   attributes: ['id','name']
          //     // }
          //   ]
          // },
          {
            model: agencyDetailModel,
            attributes: ['id', 'contact_person_designation', 'contact_person_name']
          }
        ],
        where: {
          id: 7
        }
      }
      condition.order = [['id', 'DESC']]
      let data = await userModel.findOne(condition);
      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    } catch (error) {
      console.log("error", error)
      return response(res, status.DATA_NOT_AVAILABLE, 500);
    }
  }

  static deleteNucleusSeedAvailabityDataSubmissionId = async (req, res) => {
    try {
      nucleusSeedAvailabityModel.destroy({
        where: {
          id: req.params.id
        }
      });
      response(res, status.DATA_DELETED, 200, {});
    }
    catch (error) {
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    }
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
          where: { ...filter, id: id },
          raw: false,
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
  static allocationSeedProductionBreeder = async (req, res) => {
    try {
      let tabledAlteredSuccessfully = false;
      let tabledExtracted = false;
      if (req.body !== undefined
        && req.body.allocatedVarieties !== undefined
        && req.body.allocatedVarieties.length > 0) {
        tabledExtracted = true;
        for (let index = 0; index < req.body.allocatedVarieties.length; index++) {
          const element = req.body.allocatedVarieties[index];
          const dataRow = {
            breeder_id: element.breeder_id,
            available_nucleus_seed: element.available_nucleus_seed,
            crop_code: element.crop_code,
            variety_id: element.variety_id,
            user_id: element.user_id,
            year: element.year,
            is_active: 1,
            allocate_nucleus_seed: element.allocate_nucleus_seed
          };
          if (element.id > 0) {
            // update
            await nucleusSeedAvailabityModel.update(dataRow, { where: { id: element.id } }).then(function (item) {
              tabledAlteredSuccessfully = true;
            }).catch(function (err) {

            });
          }
          else {
            const newData = await nucleusSeedAvailabityModel.build(dataRow);
            await newData.save();
            tabledAlteredSuccessfully = true;
          }
        }
      }
      if (!tabledExtracted) {
        return response(res, status.REQUEST_DATA_MISSING, 204);
      }
      else {
        if (tabledAlteredSuccessfully) {
          return response(res, status.DATA_SAVE, 200, {})
        } else {
          return response(res, status.DATA_NOT_AVAILABLE, 404)
        }

      }
    }
    catch (error) {
      return response(res, status.UNEXPECTED_ERROR, 500)
    }
  }

  static getBreederSeedVariety = async (req, res) => {
    try {
      let condition = {
        where: {

        }
      }

      let { page, pageSize, search } = req.body;
      if (page === undefined) page = 1;
      if (pageSize === undefined) pageSize = 5; // set pageSize to -1 to prevent sizing

      if (page > 0 && pageSize > 0) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }
      //implement sort
      const sortOrder = req.body.sort ? req.body.sort : 'id';
      const sortDirection = req.body.order ? req.body.order : 'DESC';
      //sort condition

      condition.order = [[sortOrder, sortDirection]];


      if (search) {
        condition.where = {};
        for (let index = 0; index < search.length; index++) {
          const element = search[index];
          // if (element.columnNameInItemList.toLowerCase() == "year.value") {
          //   condition.where["introduce_year"] = element.value;
          // }
          if (element.columnNameInItemList.toLowerCase() == "crop.value") {
            condition.where["crop_code"] = element.value;
          }
          if (element.columnNameInItemList.toLowerCase() == "variety.value") {
            condition.where["variety_id"] = element.value;
          }
          if (element.columnNameInItemList.toLowerCase() == "id") {
            condition.where["id"] = element.value;
          }
        }
      }
      if (req.body.search) {
        if (req.body.search.year) {
          condition.where.year = (req.body.search.year);
        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = (req.body.search.crop_code);
        }
        // if (req.body.search.variety_code) {
        //   condition.where.variety_code = (req.body.search.variety_code);
        // }
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
      console.log("error", error)
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    }
  }
  static getBreederSeedVarietyProductionData = async (req, res) => {
    try {
      const userData = req.body.loginedUserid;

      let condition = {
        include: [
          {
            model: breederCropsVerietiesModel,
            // attribute :[];
            include: {
              model: varietyModel,
              where: {
                is_active: 1
              },
              order: []
            }
          },
        ],

        where: {

        },
        // distinct:true,
        // attributes: [
        //   [sequelize.fn('DISTINCT', sequelize.col('breeder_crops.crop_code')), 'crop_code'],
        //   // [sequelize.col('breeder_crops.id'), 'id'],
        //   // [sequelize.literal('(DISTINCT(breeder_crops.crop_code))'), 'crop_code'],
        //   // [sequelize.col('crops.crop_name'), 'crop_name'],
        //   // [sequelize.col('crops.crop_group'), 'crop_group']
        //   // 'crop_code'
        // ],
      }

      let { page, pageSize, search } = req.body;
      if (page === undefined) page = 1;
      if (pageSize === undefined) pageSize = 5; // set pageSize to -1 to prevent sizing

      if (page > 0 && pageSize > 0) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }
      //implement sort




      if (search) {
        condition.where = {};
        for (let index = 0; index < search.length; index++) {
          const element = search[index];
          if (element.columnNameInItemList.toLowerCase() == "year.value") {
            condition.where["year"] = element.value;
          }
          if (element.columnNameInItemList.toLowerCase() == "season.value") {
            condition.where["season"] = element.value;
            condition.include[0].order = [['variety_name', 'ASC']];
          }
          if (element.columnNameInItemList.toLowerCase() == "crop.value") {
            condition.where["crop_code"] = element.value;
            condition.include[0].order = [['variety_name', 'ASC']];
          }
          if (element.columnNameInItemList.toLowerCase() == "variety.value") {
            condition.where["variety_id"] = element.value;
          }
          if (element.columnNameInItemList.toLowerCase() == "user_id.value") {
            condition.where["production_center_id"] = element.value;
          }
          if (element.columnNameInItemList.toLowerCase() == "id") {
            condition.where["id"] = element.value;
          }
        }
      } else {
        const sortOrder = req.body.sort ? req.body.sort : 'id';
        const sortDirection = req.body.order ? req.body.order : 'DESC';
        //sort condition

        condition.order = [[sortOrder, sortDirection]];
      }

      if (req.body.search) {
        if (req.body.search.year) {
          condition.where.year = (req.body.search.year);
        }
        if (req.body.search.season) {
          condition.where.season = (req.body.search.season);
          condition.include[0].order = [['variety_name', 'ASC']];
        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = (req.body.search.crop_code);
          condition.include[0].order = [['variety_name', 'ASC']];
        }
        if (req.body.search.user_id) {
          condition.where.user_id = (req.body.search.user_id);
        }
        if (req.body.search.season) {
          condition.where.user_id = (req.body.search.season);
        }
        // if (req.body.search.variety_code) {
        //   condition.where.variety_code = (req.body.search.variety_code);
        // }
      } else {
        const sortOrder = req.body.sort ? req.body.sort : 'id';
        const sortDirection = req.body.order ? req.body.order : 'DESC';
        //sort condition

        condition.order = [[sortOrder, sortDirection]];
      }

      let data = await breederCropModel.findAndCountAll(condition);

      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      console.log("error", error)
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    }
  }
  static getProductionSeasonFilterData = async (req, res) => {
    try {
      let condition = {
        include: [
          {
            model: seasonModel,
            attribute: []
          }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('breeder_crops.season')), 'season_code'],
          [sequelize.col('m_season"."season'), 'season']

        ],
        raw: true,
        where: {}
      }

      condition.order = [['season', 'ASC']]
      if (req.body.search) {
        if (req.body.search.year) {
          condition.where.year = req.body.search.year;
        }
      }
      let data = await breederCropModel.findAndCountAll(condition);
      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      console.log("error", error)
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    }
  }
  static getProductionCropNameFilterData = async (req, res) => {
    try {
      const userData = req.body.loginedUserid;
      let condition = {}
      if (req.body.search.view) {
        condition = {
          required: true,
          include: [{
            model: cropModel,
            order: [['crop_name', 'ASC']]
            // attributes:['crop_name']
          }],
          where: {
            production_center_id: userData.id
          },
          raw: true,
          // required: true,
          // distinct:false,
          attributes: [
            // [sequelize.literal('DISTINCT(crop_code)'), 'crop_code']
            [sequelize.fn('DISTINCT', sequelize.col('breeder_crops.crop_code')), 'crop_code'],
            // [sequelize.col('breeder_crops.id'), 'id'],
            // [sequelize.literal('(DISTINCT(breeder_crops.crop_code))'), 'crop_code'],
            [sequelize.col('m_crop.crop_name'), 'crop_name'],
            // [sequelize.col('crops.crop_group'), 'crop_group']
            // 'crop_code'
            // 'year'
          ],
        }
      } else {
        condition = {
          required: true,
          include: [{
            model: cropModel,
            where: {
              is_active: 1
            },
            order: [['crop_name', 'ASC']]

            // attributes:['crop_name']
          },],
          where: {
            production_center_id: userData.id
          },
          raw: true,
          // required: true,
          // distinct:false,
          order: [[sequelize.col('m_crop.crop_name'), 'ASC']],
          attributes: [
            // [sequelize.literal('DISTINCT(crop_code)'), 'crop_code']
            [sequelize.fn('DISTINCT', sequelize.col('breeder_crops.crop_code')), 'crop_code'],
            // [sequelize.col('breeder_crops.id'), 'id'],
            // [sequelize.literal('(DISTINCT(breeder_crops.crop_code))'), 'crop_code'],
            [sequelize.col('m_crop.crop_name'), 'crop_name'],
            // [sequelize.col('crops.crop_group'), 'crop_group']
            // 'crop_code'
            // 'year'
          ],
        }
      }

      if (req.body.search) {
        if (req.body.search.year) {
          condition.where.year = (req.body.search.year);
        }
        // if (req.body.search.crop_code) {
        //   condition.where.crop_code = (req.body.search.crop_code);
        // }
        if (req.body.search.user_id) {
          condition.where.user_id = (req.body.search.user_id);
        }
        if (req.body.search.season) {
          condition.where.season = (req.body.search.season);
        }
      }
      let data = await breederCropModel.findAndCountAll(condition);

      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      console.log("error", error)
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    }
  }

  static checkAlreadyExistsProductionData = async (req, res) => {
    const { internalCall } = req.body;
    let returnResponse = {};
    try {
      let rules = {
        'search.crop_code': 'string',
        // 'search.max_lot_size':'string'
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
      let condition = {
        where: {}
      }
      if (req.body.search) {
        // if (req.body.search.year) {
        //   condition.where.year = (req.body.search.year);
        // }
        if ((req.body.search.crop_code)) {
          if (req.body.search.crop_code) {
            condition.where.crop_code = (req.body.search.crop_code);
          }
          if (req.body.search.user_id) {
            condition.where.user_id = (req.body.search.user_id);
          }
          if (req.body.search.year) {
            condition.where.year = (req.body.search.year);
          }
          if (req.body.search.season) {
            condition.where.season = (req.body.search.season);
          }
        }
        // if (req.body.search.variety_code) {
        //   condition.where.variety_code = (req.body.search.variety_code);
        // }
      }
      let checkdata = await nucleusSeedAvailabityModel.findAll(condition);

      if ((checkdata && checkdata.length)) {
        const errorResponse = {
          inValid: true
        }
        return response(res, status.USER_EXISTS, 409, errorResponse)
      }
      else {

        const errorResponse = {
          inValid: false
        }
        return response(res, status.OK, 200, errorResponse, internalCall);
      }

    } catch (error) {
      returnResponse = {
        message: error.message
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }

  static getLotNumber = async (req, res) => {
    try {

      // let seasonCondition = { where: {} };
      // if (req.body.search) {
      //   if (req.body.search.season) {
      //     let season = req.body.search.season;
      //     seasonCondition.where = {
      //       season: season
      //     };
      //   }
      // }

      let condition = {
        include: [
          {
            model: varietyModel,
            attributes: ['id', 'variety_code', 'variety_name'],
          },
          {
            model: cropModel,
            attributes: ['id', 'crop_code', 'crop_name'],
            // ...seasonCondition
          },
          {
            model: seasonModel,
            attributes: ['season'],
          },
          {
            model: plantDetail,
            attributes: ['plant_name'],
          },
        ],
        where: {}
      }

      let { page, pageSize, search } = req.body;
      if (page === undefined) page = 1;
      if (pageSize === undefined) pageSize = 10; // set pageSize to -1 to prevent sizing

      if (page > 0 && pageSize > 0) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }
      //implement sort
      const sortOrder = req.body.sort ? req.body.sort : 'id';
      const sortDirection = req.body.order ? req.body.order : 'DESC';
      //sort condition

      condition.order = [[sortOrder, sortDirection]];


      if (search) {
        condition.where = {};
        for (let index = 0; index < search.length; index++) {
          const element = search[index];
          if (element.columnNameInItemList.toLowerCase() == "year.value") {
            condition.where["year"] = element.value;
          }
          if (element.columnNameInItemList.toLowerCase() == "crop.value") {
            condition.where["crop_code"] = element.value;
          }
          if (element.columnNameInItemList.toLowerCase() == "variety.value") {
            condition.where["variety_id"] = element.value;
          }
          if (element.columnNameInItemList.toLowerCase() == "id") {
            condition.where["id"] = element.value;
          }
        }
      }
      if (req.body) {
        if (req.body.id) {
          condition.where.user_id = (req.body.id);
        }
      }
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
        if (req.body.search.variety_id) {
          condition.where.variety_id = (req.body.search.variety_id);
        }
        if (req.body.search.id) {
          condition.where.id = (req.body.search.id);
        }
        if (req.body.search.user_id) {
          condition.where.user_id = (req.body.search.user_id);
        }
      }
      console.log(condition)
      let data = await lotNumberModel.findAndCountAll(condition);

      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      console.log("error", error)
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    }
  }

  static getLotSize = async (req, res) => {
    try {
      let condition = {
        attributes: ['id', "lot_number_size", 'lot_number'],
        where: {
          id: req.body.search.lot_number_id
        },
      }
      let data = await lotNumberModel.findOne(condition);
      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    } catch (error) {
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    }
  }

  static updateLotNumber = async (req, res) => {
    try {
      const formData = req.body;

      const rules = {
        'id': 'required|integer',
        'crop_code': 'required|string',
        'year': 'required|integer',
        'variety_id': 'required|integer',
        'lot_number': 'required|string',
        'is_active': 'required|integer',
        'user_id': 'required|integer',
        'breeder_production_center_id': 'required|integer',
        'reserved_lot_number': 'required|boolean',
      };

      const validation = new Validator(formData, rules);
      const isValidData = validation.passes();
      if (!isValidData) {
        const errorResponse = {};
        for (let key in rules) {
          const error = validation.errors.get(key);
          if (error.length) {
            errorResponse[key] = error;
          }
        }
        return response(res, status.BAD_REQUEST, 400, errorResponse);
      }

      let condition = {
        where: {
          id: formData.id
        }
      }

      const isExist = await lotNumberModel.count(condition);
      if (!isExist) {
        return response(res, status.DATA_NOT_AVAILABLE, 404);
      }

      const dataToUpdate = {
        crop_code: formData.crop_code,
        year: formData.year,
        variety_id: formData.variety_id,
        lot_number: formData.lot_number,
        is_active: formData.is_active,
        user_id: formData.user_id,
        breeder_production_center_id: formData.breeder_production_center_id,
        reserved_lot_number: formData.reserved_lot_number,
      };

      const data = await lotNumberModel.update(dataToUpdate, condition);

      return response(res, status.DATA_AVAILABLE, 200, data);
    }
    catch (error) {
      const returnResponse = {
        message: error.message,
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }

  }

  static addLotNumber = async (req, res) => {
    try {
      let tabledAlteredSuccessfully = false;
      let tabledExtracted = false;

      if (req.body !== undefined && req.body.nucleusSeed !== undefined && req.body.nucleusSeed.length > 0) {

        tabledExtracted = true;
        let cnt = 1;

        for (let index = 0; index < req.body.nucleusSeed.length; index++) {
          const element = req.body.nucleusSeed[index];
          const calc = (element.actualQty) / (element.max_lot_size);
          let lotNo = [] = element.lot_number.toString().split(",");
          let dataRow = {};

          const existingData = await lotNumberModel.findAndCountAll({
            where: {
              year: element.year.value,
              crop_code: element.crop_code.value,
              variety_id: element.variety_id,
              user_id: element.user_id,
              spp_id: element.spp_id,
            }
          });

          if (existingData.count > 0) {
            tabledAlteredSuccessfully = false;

          }
          else {
            tabledAlteredSuccessfully = true;

            let updatedQty = element.actualQty;
            let calcLotSize = 0;
            let lot_num_size;

            lotNo.forEach(async (lot_no) => {
              if ((updatedQty) >= (element.max_lot_size)) {
                lot_num_size = element.max_lot_size
                updatedQty = updatedQty - element.max_lot_size;
                calcLotSize = calcLotSize + element.max_lot_size;
              } else {
                lot_num_size = element.actualQty - calcLotSize
              }

              dataRow = {
                breeder_production_center_id: element.breeder_seed_production_id,
                lot_number: lot_no,
                crop_code: element.crop_code.value,
                variety_id: element.variety_id,
                user_id: element.user_id,
                spp_id: element.spp_id,
                year: element.year.value,
                season: element.season,
                running_number: parseInt(element.running_number) + cnt,
                current_year: element.current_year,
                current_month: element.current_month,
                bspc_code: element.bspc_code,
                spp_code: element.spp_code,
                is_active: 1,
                created_at: Date.now(),
                updated_at: Date.now(),
                lot_number_size: lot_num_size
              };
              if (lot_num_size > 0) {
                const newData = lotNumberModel.build(dataRow);
                newData.save();
              }
              cnt++;
            });
          }
        }
      }
      if (!tabledExtracted) {
        return response(res, status.REQUEST_DATA_MISSING, 204);
      }
      else {
        if (tabledAlteredSuccessfully) {
          return response(res, status.DATA_SAVE, 200, {})
        } else {
          return response(res, status.DATA_NOT_AVAILABLE, 404)
        }

      }
    }
    catch (error) {
      console.log('qwertyuiop', error);
      return response(res, status.UNEXPECTED_ERROR, 500)
    }
  }

  static deleteLotNumber = async (req, res) => {
    try {
      lotNumberModel.destroy({
        where: {
          id: req.params.id
        }
      });
      response(res, status.DATA_DELETED, 200, {});
    }
    catch (error) {
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    }
  }

  static getActualSeedProduction = async (req, res) => {
    try {
      let condition = {
        include: [
          {
            model: varietyModel,
          },
          {
            model: bsp1ProductionCenterModel,
          },
          {
            model: bsp2Model,
            attributes: ['id', 'bsp_1_id'],
            left: true,
            include: [
              {
                model: bsp3Model,
                attributes: ['id', 'bsp_2_id'],
                left: true,
                include: [
                  {
                    model: bsp4Model,
                    attributes: ['id', 'actual_seed_production', 'bsp_3_id'],
                    left: true,
                  },
                ],
              },
            ],
          },
        ],
        where: {
        },
        attributes: [
          'id', 'year', 'crop_code', 'is_active', 'is_freeze', 'isdraft', 'user_id', 'variety_id', 'indent_of_breederseed_id', 'agency_detail_id', 'created_at', 'updated_at',
          [sequelize.col('bsp1_production_centers.production_center_id'), 'production_center_id'],
          [sequelize.col('bsp1_production_centers.quantity_of_seed_produced'), 'quantity_of_seed_produced'],
        ]
      }

      let { page, pageSize, search } = req.body;
      if (page === undefined) page = 1;
      if (pageSize === undefined) pageSize = 5; // set pageSize to -1 to prevent sizing

      if (page > 0 && pageSize > 0) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }
      //implement sort
      const sortOrder = req.body.sort ? req.body.sort : 'id';
      const sortDirection = req.body.order ? req.body.order : 'DESC';
      //sort condition

      condition.order = [[sortOrder, sortDirection]];


      if (search) {
        condition.where = {};
        for (let index = 0; index < search.length; index++) {
          const element = search[index];
          if (element.columnNameInItemList.toLowerCase() == "year.value") {
            condition.where["year"] = element.value;
          }
          if (element.columnNameInItemList.toLowerCase() == "crop.value") {
            condition.where["crop_code"] = element.value;
          }
          if (element.columnNameInItemList.toLowerCase() == "variety.value") {
            condition.where["variety_id"] = element.value;
          }
          if (element.columnNameInItemList.toLowerCase() == "id") {
            condition.where["id"] = element.value;
          }
        }
      }
      if (req.body.search) {
        if (req.body.search.year) {
          condition.where.year = (req.body.search.year);
        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = (req.body.search.crop_code);
        }
        if (req.body.search.variety_id) {
          condition.where.variety_id = (req.body.search.variety_id);
        }
      }

      // let data = await bsp4Model.findAndCountAll(condition);
      let data = await bsp1Model.findAndCountAll(condition);

      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      console.log("error", error)
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    }
  }

  static getMaxLotSize = async (req, res) => {
    try {
      let condition = {
        // include: [
        //   {
        //     model: varietyModel,
        //   }
        //   ],
        where: {

        }
      }

      let { page, pageSize, search } = req.body;
      if (page === undefined) page = 1;
      if (pageSize === undefined) pageSize = 5; // set pageSize to -1 to prevent sizing

      if (page > 0 && pageSize > 0) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }
      //implement sort
      const sortOrder = req.body.sort ? req.body.sort : 'id';
      const sortDirection = req.body.order ? req.body.order : 'DESC';
      //sort condition

      condition.order = [[sortOrder, sortDirection]];


      if (search) {
        condition.where = {};
        for (let index = 0; index < search.length; index++) {
          const element = search[index];
          if (element.columnNameInItemList.toLowerCase() == "crop.value") {
            condition.where["crop_code"] = element.value;
          }
          // if (element.columnNameInItemList.toLowerCase() == "year.value") {
          //   condition.where["year"] = element.value;
          // }
          // if (element.columnNameInItemList.toLowerCase() == "variety.value") {
          //   condition.where["variety_id"] = element.value;
          // }
          // if (element.columnNameInItemList.toLowerCase() == "id") {
          //   condition.where["id"] = element.value;
          // }
        }
      }
      if (req.body.search) {
        if (req.body.search.crop_code) {
          condition.where.crop_code = (req.body.search.crop_code);
        }
      }
      let data = await maxLotSizeModel.findAndCountAll(condition);

      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      console.log("error", error)
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    }
  }



  static performaSeedSubmission = async (req, res) => {
    try {
      const dataRow = {
        // botanic_name: req.body.botanic_name,
        // group_code:req.body.group_code,
        crop_code: req.body.crop_code,
        germination: req.body.germination,
        user_id: req.body.user_id,
        inert_matter: req.body.inert_matter,
        label_number: req.body.label_number,
        lot_number: req.body.lot_number,
        net_weight: req.body.net_weight,
        //
        pure_seed: req.body.pure_seed,
        test_date: req.body.test_date,
        variety_id: req.body.variety_id,

        valid_upto: req.body.valid_upto,
        group_code: req.body.group_code,
        season: req.body.season,
        year_of_indent: req.body.year,
        // srr: req.body.srr,
      };

      let tabledAlteredSuccessfully = false;
      if (req.params && req.params["id"]) {
        await performaSeedModel.update(dataRow, { where: { id: req.params["id"] } }).then(function (item) {
          tabledAlteredSuccessfully = true;
        }).catch(function (err) {
          console.log("error", err)
        });
      }
      else {
        const existingData = await performaSeedModel.findAll(
          {
            where: {

              crop_code: req.body.crop_code,
              germination: req.body.germination,
              user_id: req.body.user_id,
              inert_matter: req.body.inert_matter,
              label_number: req.body.label_number,
              lot_number: req.body.lot_number,
              net_weight: req.body.net_weight,
              group_code: req.body.group_code,
              pure_seed: req.body.pure_seed,
              test_date: (req.body.test_date),
              variety_id: req.body.variety_id,
              valid_upto: (req.body.valid_upto),
              season: req.body.season,
              year_of_indent: req.body.year,
            }
          }
        );
        // console.log('this.converDate(req.body.valid_upto)',new Date(req.body.valid_upto).toISOString());
        if (existingData === undefined || existingData.length < 1) {
          const data = performaSeedModel.build(dataRow);
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
      console.log("error", error)
      return response(res, status.DATA_NOT_SAVE, 500)
    }
  }
  static converDate(dateString) {

    var date = new Date(dateString);
    var yr = date.getFullYear();
    var mo = date.getMonth() + 1;
    var day = date.getDate();

    var hours = date.getHours();
    var hr = hours < 10 ? '0' + hours : hours;

    var minutes = date.getMinutes();
    var min = (minutes < 10) ? '0' + minutes : minutes;

    var seconds = date.getSeconds();
    var sec = (seconds < 10) ? '0' + seconds : seconds;

    var newDateString = yr + '-' + mo + '-' + day;
    var newTimeString = hr + ':' + min + ':' + sec;

    var excelDateString = newDateString + ' ' + newTimeString;

    return excelDateString;
  }



  static PerformaBreederSeedList = async (req, res) => {
    let data = {};
    try {
      let season = "";
      let sessionCondition = {}
      if (req.body.search) {
        if (req.body.search.season) {
          season = req.body.search.season;
          sessionCondition = {
            where: {
              season: season ? season : ''
            }
          }
        }
      }
      let condition = {
        include: [
          {
            model: varietyModel,
          },
          {
            model: cropModel,
            ...sessionCondition
          },
          {
            model: lotNumberModel,
            attributes: ['id', 'lot_number', 'year']
          },
        ],
        where: {

        }
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



      condition.order = [[sortOrder, sortDirection]];
      if (req.body.search) {
        if (req.body.search.crop_code) {
          condition.where.crop_code = (req.body.search.crop_code);
        }
        if (req.body.search.year_of_indent) {
          condition.where.year_of_indent = (req.body.search.year_of_indent);
        }
        if (req.body.search.season) {
          condition.where.season = (req.body.search.season);
        }
        if (req.body.search.variety_id) {
          condition.where.variety_id = (req.body.search.variety_id);
        }
      }

      data = await performaSeedModel.findAndCountAll(condition);
      // res.send(data)

      // let returnResponse = await paginateResponse(data, page, pageSize);
      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static PerformaBreederSeedWithId = async (req, res) => {
    try {
      const data = await performaSeedModel.findAll({
        where: {
          id: req.params.id
        }
      });
      if (data && data.length > 0) {
        response(res, status.DATA_AVAILABLE, 200, data[0]);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    }
  }
  static deletePerformaBreederSeedWithId = async (req, res) => {
    try {
      performaSeedModel.destroy({
        where: {
          id: req.params.id
        }
      });
      response(res, status.DATA_DELETED, 200, {});
    }
    catch (error) {
      return response(res, status.UNEXPECTED_ERROR, 500)
    }
  }

  static getLotNumbers = async (req, res) => {
    let data = {};
    try {
      let condition = {
        where: {

          //   [Op.or]: [

          //     {
          //       reserved_lot_number: {
          //         [Op.eq]: "false"
          //       }

          //     }

          //   ]
        }
      };
      console.log(req.body, "dsadsad")
      console.log("req.body.search", req.body.search.year);
      const sortOrder = req.body.sort ? req.body.sort : 'id';
      const sortDirection = req.body.order ? req.body.order : 'ASC';
      condition.order = [[sortOrder, sortDirection]];
      if (req.body.search) {
        if (req.body.search.year) {
          condition.where.year = (req.body.search.year);
        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = (req.body.search.crop_code);
        }
        if (req.body.search.variety_id) {
          condition.where.variety_id = (req.body.search.variety_id);
        }
        if (req.body.search.user_id) {
          console.log("working", req.body.search.user_id)
          condition.where.user_id = req.body.search.user_id
        }
      }

      data = await lotNumberModel.findAndCountAll(condition);
      // res.send(data)

      // let returnResponse = await paginateResponse(data, page, pageSize);
      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static getLabelNumber = async (req, res) => {
    let data = {};
    let condition = {};
    try {
      if (req.body.search.id) {
        condition = {
          include: [
            {
              model: generatedLabelNumberModel,
              attributes: ['id', 'generated_label_name'],
              where: {
                id: req.body.search.id
              }
            },
            {
              model: seedTestingReportsModel,
              where: {
                [Op.and]: [

                  {
                    is_report_pass: {
                      [Op.eq]: true
                    },

                  }
                ]
              },
            }
          ],
          where: {

          }
        };
      } else {
        condition = {
          include: [
            {
              model: generatedLabelNumberModel,
              attributes: ['id', 'generated_label_name']
            },
            {
              model: seedTestingReportsModel,
              where: {
                [Op.and]: [

                  {
                    is_report_pass: {
                      [Op.eq]: true
                    },

                  }
                ]
              },

            }

          ],
          where: {

          }
        };
      }


      const sortOrder = req.body.sort ? req.body.sort : 'id';
      const sortDirection = req.body.order ? req.body.order : 'ASC';
      condition.order = [[sortOrder, sortDirection]];
      if (req.body.search) {
        if (req.body.search.crop_code) {
          condition.where.crop_code = (req.body.search.crop_code);
        }
        if (req.body.search.variety_id) {
          condition.where.variety_id = (req.body.search.variety_id);
        }
        if (req.body.search.lot_number) {
          condition.where.lot_number_creation_id = (req.body.search.lot_number);
        }
        if (req.body.search.year) {
          condition.where.year_of_indent = (req.body.search.year);
        }

      }

      data = await labelNumberForBreederseed.findAndCountAll(condition);
      // res.send(data)

      // let returnResponse = await paginateResponse(data, page, pageSize);
      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }


  static viewIndentorYear = async (req, res) => {
    let data = {};
    try {
      let condition = {
        where: {},
        attribute: [],

      }

      if (req.body.search) {
        // if (req.body.search.variety_id) {
        //   condition.where.id = req.body.search.variety_id;
        // }
      }

      // condition.order = [['variety_name', 'ASC']];
      data = await indentOfBreederseedModel.findAll(condition);
      const result = data.filter((thing, index, self) =>
        index === self.findIndex((t) => (
          t.year === thing.year
        ))
      )

      // res.send(data)

      response(res, status.DATA_AVAILABLE, 200, result)
    } catch (error) {
      //console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static viewIndentorCrop = async (req, res) => {
    let data = {};
    try {
      let condition = {
        include: [

          {
            model: cropModel,
          }
        ],
        where: {},
        attribute: [],

      }
      let { page, pageSize, search } = req.body;

      if (search) {
        condition.where = {};
        for (let index = 0; index < req.body.search.length; index++) {
          const element = search[index];
          console.log('ele', element.year.value);
          if (element.year.columnNameInItemList.toLowerCase() == "year.value") {
            condition.where["year"] = element.year.value;
          }

        }
      }

      // condition.order = [['variety_name', 'ASC']];
      data = await indentOfBreederseedModel.findAll(condition);



      // res.send(data)

      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500, error)
    }
  }


  static getCreatedByName = async (req, res) => {
    let data = {};
    let condition = {};
    try {
      condition = {
        where: {
          user_id: req.body.search.created_by
        }
      };
      data = await agencyDetailModel.findAll(condition);
      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getUserShortName = async (req, res) => {
    let data = {};
    let condition = {};
    try {
      condition = {
        where: {
          user_id: req.body.search.user_id
        }
      };
      data = await agencyDetailModel.findAll(condition);
      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static countLotNumber = async (req, res) => {
    try {
      let condition = {
        attributes: ['running_number'],
        where: {

        },
        limit: 1
      }
      const sortOrder = req.body.sort ? req.body.sort : 'id';
      const sortDirection = req.body.order ? req.body.order : 'DESC';
      condition.order = [[sortOrder, sortDirection]];

      let data = await lotNumberModel.findAll(condition);
      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    } catch (error) {
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    }
  }

  static usedLotNumber = async (req, res) => {
    try {
      let condition = {
        attributes: ['lot_number']
      }
      let data = await seedTestingReportsModel.findAll(condition);
      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    } catch (error) {
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    }
  }


  static indentCrop = async (req, res) => {
    try {
      let condition = {

        attributes: [
          [Sequelize.fn('DISTINCT', Sequelize.col('crop_code')), 'crop_code'],
          [Sequelize.col('crop_name'), 'crop_name'],
        ],
        where: {
          year: req.body.search.year,
          season: req.body.search.season
        },
        order: [['crop_code', 'ASC']],
      }
      let data = await indentOfBreederseedModel.findAll(condition);
      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    } catch (error) {
      console.log('errorerror', error);
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    }
  }

  static getAllLotYear = async (req, res) => {
    try {
      const user_id = req.query.user_id;

      let condition = {
        attributes: [
          [Sequelize.fn('DISTINCT', Sequelize.col('lot_number_creations.year')), 'year'],
        ],
        where: {

        },
        order: [['year', 'Desc']],
      }

      if (req.query.user_id) {
        condition.where['user_id'] = user_id;
      }

      let data = await lotNumberModel.findAll(condition);

      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    } catch (error) {
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    }
  }

  static getIndentYear = async (req, res) => {
    try {

      let condition = {
        attributes: [
          [sequelize.literal('DISTINCT(year)'), 'year']
        ],
        distinct: true,
        where: {

        },
        order: [['year', 'Desc']],
      }
      let data = await indentOfBreederseedModel.findAll(condition);
      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, data);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    } catch (error) {
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    }
  }

  static getNucleusSeedAvailabilityYearsforReports = async (req, res) => {
    try {
      let condition = {
        attributes: [
          [sequelize.literal('DISTINCT(year)'), 'year']
        ],
      }

      let data = await nucleusSeedAvailabityModel.findAll(condition);

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

  static getNucleusSeedAvailabilityCropforReports = async (req, res) => {
    try {
      const year = req.body.year
      let condition = {
        attributes: ['crop_code'],
        include: [
          {
            model: cropModel,
            left: false,
            raw: false,
            attributes: ['crop_name']
          },
        ],
        where: {
          year: year
        }
      }

      let data = await nucleusSeedAvailabityModel.findAll(condition);

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

  static getNucleusSeedAvailabilityforReports = async (req, res) => {
    try {
      let { page, pageSize, searchData } = req.body;
      console.log(req.body)

      let condition = {
        // attributes: ['quantity', 'variety_id', 'crop_code'],
        include: [
          {
            model: varietyModel,
            left: false,
            raw: false,
            attributes: ['variety_name']
          },
          {
            model: cropModel,
            left: false,
            raw: false,
            attributes: ['crop_name', 'season']
          },
        ],
        where: {}
      }

      if (req.body.page) {
        if (page === undefined) page = 1;
        if (pageSize === undefined) pageSize = 10;
        if (page > 0 && pageSize > 0) {
          condition.limit = pageSize;
          condition.offset = (page * pageSize) - pageSize;
        }
      }


      if (searchData && searchData.isSearch === true) {
        if (searchData.year) {
          condition.where['year'] = searchData.year;
        }

        if (searchData.crop_code) {
          condition.where['crop_code'] = searchData.crop_code;
        }
        if (searchData.season) {
          // condition.include[1].where = {}
          condition.where.season = searchData.season
          // condition.where['crop_code'] = searchData.crop_code;
        }
        if (searchData.breeder_name) {

          condition.where.breeder_production_centre_name = searchData.breeder_name
          // condition.where['crop_code'] = searchData.crop_code;
        }
        if (searchData.variety_id) {

          condition.where.variety_id = searchData.variety_id
          // condition.where['crop_code'] = searchData.crop_code;
        }
      }

      const sortOrder = req.body.sort ? req.body.sort : 'id';
      const sortDirection = req.body.order ? req.body.order : 'DESC';

      condition.order = [['year', 'DESC']];

      let data = await nucleusSeedAvailabityModel.findAndCountAll(condition);
      const filteredData = []
      data.rows.forEach(el => {
        const spaIndex = filteredData.findIndex(item => item.crop_code === el.crop_code);
        if (spaIndex === -1) {
          filteredData.push({
            crop_name: el.m_crop.crop_name,
            "crop_code": el.crop_code,
            "total_indent": el.indent_quantity,
            "year": el.year,
            "season": el.season,
            "total_spa_count": 1,
            "variety": [
              {
                variety_Name: el.m_crop_variety.variety_name,
                variety_id: el.variety_id,
                "total_indent": el.indent_quantity,
                "spa_count": 1,
                "spas": [
                  {
                    breeder_production_centre_name: el.breeder_production_centre_name,
                    quantity: el.quantity,
                    production_center_id: el.production_center_id
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
                breeder_production_centre_name: el.breeder_production_centre_name,
                quantity: el.quantity,
                production_center_id: el.production_center_id
              }
            );
          } else {
            // const varietyIndex = filteredData[spaIndex].variety[cropIndex].spas.findIndex(item => item.production_center_id === el.production_center_id);
            //  console.log('varietyIndex',filteredData[spaIndex].variety[0].spas,cropIndex,spaIndex)
            filteredData[spaIndex].variety.push({
              variety_Name: el.m_crop_variety.variety_name,
              variety_id: el.variety_id,
              "total_indent": el.indent_quantity,
              "spa_count": 1,
              "spas": [
                {
                  breeder_production_centre_name: el.breeder_production_centre_name,
                  quantity: el.quantity,
                  production_center_id: el.production_center_id
                }
              ]
            });
          }
        }
      });
      const updatedData = [];
      if (req.body.searchData) {
        if (req.body.searchData.unitKgQ == 1) {
          if (data) {
            response(res, status.DATA_AVAILABLE, 200, data);
          }
        } else if (filteredData) {
          response(res, status.DATA_AVAILABLE, 200, filteredData);
        }

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



  static getIndentCrop = async (req, res) => {
    try {
      let condition = {
        // attributes: [
        // //   [sequelize.literal('DISTINCT(crop_code)'), 'crop_code'],
        // //   'crop_name'
        // // ],
        distinct: true,
        where: {
          "year": req.body.search.year,
          "season": req.body.search.season
        },
        order: [['crop_name', 'asc']],
      }
      let data = await indentOfBreederseedModel.findAll(condition);
      console.log('data==========>', data)
      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    } catch (error) {
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    }
  }
  static getNucleusSeedAvailabityYearData = async (req, res) => {
    try {
      let condition = {
        attributes: [
          [sequelize.literal('DISTINCT(year)'), 'year']
        ],
        distinct: true,
        where: {
          production_center_id: req.body.loginedUserid.id
        },
        order: [['year', 'Desc']],
      }
      let data = await nucleusSeedAvailabityModel.findAll(condition);
      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    } catch (error) {
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    }
  }
  static getNucleusSeedAvailabityYearDataBreederCrop = async (req, res) => {
    try {
      let condition = {
        attributes: [
          [sequelize.literal('DISTINCT(year)'), 'year']
        ],
        distinct: true,
        where: {
          production_center_id: req.body.loginedUserid.id
        },
        order: [['year', 'Desc']],
      }

      let data = await breederCropModel.findAll(condition);

      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    } catch (error) {
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    }
  }
  static getNucleusSeedAvailabityVarietyNameData = async (req, res) => {
    try {
      let condition = {
        include: [
          {
            model: cropModel
          },
          {
            model: cropVerietyModel
          },
        ],
        attributes: [
          // [sequelize.literal('DISTINCT(year)'), 'year']
        ],
        distinct: true,
        where: {
          year: req.body.year,
          crop_code: req.body.crop_code,
          production_center_id: req.body.loginedUserid.id
        },
        // order: [['year', 'Desc']],

      }


      let data = await nucleusSeedAvailabityModel.findAll(condition);
      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    } catch (error) {
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    }
  }

  static getNucleusSeedAvailabityCropNameData = async (req, res) => {
    try {

      let condition = {
        include: [
          {
            model: cropModel,
            attributes: ['*'],
          },

        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('nucleus_seed_availabilities.crop_code')), 'crop_code'], 'crop_code'],
        // distinct: true,
        raw: true,
        where: {

        }
      }



      if (req.body) {
        if (req.body.year) {
          condition.where.year = parseInt(req.body.year.year);
        }
        if (req.body.year) {
          condition.include[0].where = {}
          condition.include[0].where.season = (req.body.season.m_crop.m_season.season_code);
        }
      }

      let data = await nucleusSeedAvailabityModel.findAll(condition);

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

  static getNucleusSeedAvailabitySeasonData = async (req, res) => {
    try {
      // console.log(req.body.season.season_code)
      let condition = {
        include: [
          {
            model: cropModel,
            include: [{
              model: seasonModel,
              left: true,
              where: {

              }

            }],

            attributes: ['*'],
            left: true
          },

        ],
        attributes: [
          // [sequelize.fn('DISTINCT', Sequelize.col('m_season.season')) ,'m_season.season'],
          // [sequelize.fn('DISTINCT', sequelize.col('nucleus_seed_availabilities.crop_code')), 'crop_code'], 'crop_code',
          // [sequelize.fn('DISTINCT', sequelize.col('m_season.season')), 'season'], 'season',

        ],
        // left:true,
        // group: ["m_season.season"],

        // distinct: true,
        // raw: true,

      }



      if (req.body) {
        if (req.body.year) {
          condition.where.year = parseInt(req.body.year.year);
        }

      }

      let data = await nucleusSeedAvailabityModel.findAndCountAll(condition);

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
  static getLotSize = async (req, res) => {
    try {
      let condition = {
        attributes: ['id', "lot_number_size", 'lot_number'],
        where: {
          id: req.body.search.lot_number_id
        },
      }
      let data = await lotNumberModel.findOne(condition);
      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    } catch (error) {
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    }
  }
  static getPerformabreederSeedtagCropGroup = async (req, res) => {
    try {
      // console.log(req.body.season.season_code)
      let condition = {
        include: [
          {
            // model: cropModel,
            // include: [{

            //   left: true,
            //   where: {

            //   }

            // }],
            model: cropGroupDataModel,

            attributes: ['*'],
            left: true
          },

        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('m_crop_group.group_name')), 'group_name'],
          // sequelize.col('m_crop->m_crop_group.group_code')
          // 'id'
          // [sequelize.fn('DISTINCT', sequelize.col('nucleus_seed_availabilities.crop_code')), 'crop_code'], 'crop_code',
          // [sequelize.fn('DISTINCT', sequelize.col('m_season.season')), 'season'], 'season',

        ],
        // left:true,
        // group: ["m_season.season"],

        // distinct: true,
        raw: true,
        where: {
          season: req.body.search.season,
          year: req.body.search.year,
        }

      }
      condition.order = [[sequelize.col('m_crop_group.group_name'), 'ASC']];
      // condition.order[(Sequelize.col('m_crop_group.group_name','ASC'))]
      // condition.order = [[sequelize.col('m_crop->m_crop_group.group_name'), 'ASC']];
      if (req.body) {


      }

      let data = await indentOfBreederseedModel.findAndCountAll(condition);

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
  static getPerformabreederSeedtagCropName = async (req, res) => {
    try {
      // console.log(req.body.season.season_code)
      let condition = {
        include: [
          {
            model: cropModel,
            // include: [{

            //   left: true,
            //   where: {

            //   }

            // }],
            // model: cropGroupDataModel,

            attributes: ['*'],
            left: true
          },

        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('m_crop.crop_name')), 'crop_name'],
          // sequelize.col('m_crop->m_crop_group.group_code')
          // 'id'
          // [sequelize.fn('DISTINCT', sequelize.col('nucleus_seed_availabilities.crop_code')), 'crop_code'], 'crop_code',
          // [sequelize.fn('DISTINCT', sequelize.col('m_season.season')), 'season'], 'season',

        ],
        // left:true,
        // group: ["m_season.season"],

        // distinct: true,
        raw: true,
        where: {
          season: req.body.search.season,
          year: req.body.search.year,
          group_code: req.body.search.group_code
        }

      }
      condition.order = [[sequelize.col('m_crop.crop_name'), 'ASC']];
      // condition.order[(Sequelize.col('m_crop_group.group_name','ASC'))]
      // condition.order = [[sequelize.col('m_crop->m_crop_group.group_name'), 'ASC']];
      // if (req.body.search) {
      //   if(req.body.search.group_code){
      //     console.log(req.body.search.group_code)
      //     condition.where.group_code = req.body.search.group_code
      //   }


      // }

      let data = await indentOfBreederseedModel.findAndCountAll(condition);

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
  static getPerformabreederSeedtagVarietyName = async (req, res) => {
    try {
      // console.log(req.body.season.season_code)
      let condition = {
        include: [
          {
            model: varietyModel,
            // include: [{

            //   left: true,
            //   where: {

            //   }

            // }],
            // model: cropGroupDataModel,

            attributes: ['*'],
            left: true
          },

        ],
        attributes: [
          // [sequelize.fn('DISTINCT', sequelize.col('m_crop.crop_name')), 'crop_name'],
          // sequelize.col('m_crop->m_crop_group.group_code')
          // 'id'
          // [sequelize.fn('DISTINCT', sequelize.col('nucleus_seed_availabilities.crop_code')), 'crop_code'], 'crop_code',
          // [sequelize.fn('DISTINCT', sequelize.col('m_season.season')), 'season'], 'season',

        ],
        // left:true,
        // group: ["m_season.season"],

        // distinct: true,
        raw: true,
        where: {
          year: req.body.search.year,
          season: req.body.search.season,
          group_code: req.body.search.group_code,
          crop_code: req.body.search.crop_code,
        }

      }
      // condition.order = [[sequelize.col('m_crop.crop_name'),'ASC']];
      // condition.order[(Sequelize.col('m_crop_group.group_name','ASC'))]
      // condition.order = [[sequelize.col('m_crop->m_crop_group.group_name'), 'ASC']];
      // if (req.body.search) {
      //   if(req.body.search.group_code){
      //     console.log(req.body.search.group_code)
      //     condition.where.group_code = req.body.search.group_code
      //   }


      // }

      let data = await indentOfBreederseedModel.findAndCountAll(condition);

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
  static getChartIndentData = async (req, res) => {
    let data = {};
    try {
      let condition = {
        include: [
          {
            model: bsp1Model,
            attributes: [],
            raw: true,
            include: [
              {
                model: bsp1ProductionCenterModel,
                attributes: [
                  [sequelize.literal("Sum(quantity_of_seed_produced)"), "quantity_targeted"],
                ],
                raw: true
              }
            ],
          },
          {
            model: bsp4Model,
            attributes: [],
            raw: true
          },
          {
            model: bsp5bModel,
            attributes: [],
            raw: true
          },
          {
            model: cropModel,
            attributes: ['crop_name'],
            raw: true
          },
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('nucleus_seed_availabilities.crop_code')), 'crop_code'],
          // [sequelize.literal("Sum(indent_of_breederseeds.indent_quantity)"), "indent_quantity"],
          [sequelize.literal("Sum(bsp_4.actual_seed_production)"), "actual_seed_production"],
          [sequelize.literal("Sum(bsp_5_b.lifting_quantity)"), "lifting_quantity"],
        ],
        where: {
          user_id: req.body.search.user_id,
          crop_code: {
            [Op.like]: req.body.search.crop_type + '%'
          }
        },
        raw: true
      };
      if (req.body.search) {
        if (req.body.search.year) {
          condition.where.year = req.body.search.year
        }
        // if(req.body.search.season){
        //   condition.where.season = req.body.search.season
        // }
        if (req.body.search.crop_code) {
          condition.where.crop_code = req.body.search.crop_code
        }
      }
      condition.group = [['nucleus_seed_availabilities.crop_code'], ['m_crop.crop_name']];
      data = await nucleusSeedAvailabityModel.findAll(condition);
      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static getChartDataByCrop = async (req, res) => {
    let data = {};
    try {
      let condition = {
        include: [
          {
            model: bsp4Model,
            attributes: [],
            raw: true
          },
          {
            model: bsp5bModel,
            attributes: [],
            raw: true
          },
          {
            model: varietyModel,
            attributes: [],
            raw: true
          },
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('m_crop_variety.variety_name')), 'variety_name'],
          // [sequelize.literal("Sum(indent_of_breederseeds.indent_quantity)"), "indent_quantity"],
          [sequelize.literal("Sum(bsp_4.actual_seed_production)"), "actual_seed_production"],
          [sequelize.literal("Sum(bsp_5_b.lifting_quantity)"), "lifting_quantity"],
        ],
        where: {
          user_id: req.body.search.user_id,
          crop_code: {
            [Op.like]: req.body.search.crop_type + '%'
          }
        }
      };
      if (req.body.search) {
        if (req.body.search.year) {
          condition.where.year = req.body.search.year
        }
        // if(req.body.search.season){
        //   condition.where.season = req.body.search.season
        // }
        if (req.body.search.crop_code) {
          condition.where.crop_code = req.body.search.crop_code
        }
      }
      condition.group = [['nucleus_seed_availabilities.crop_code'], ['m_crop_variety.variety_name']];
      data = await nucleusSeedAvailabityModel.findAll(condition);
      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static IndentorDashboardCropName = async (req, res) => {
    let data = {};
    try {
      let condition = {
        //     include: [
        //         {
        //         model:stateModel,
        //         attributes: []
        //     },
        // ],
        where: {

        }
      };
      const sortOrder = req.body.sort ? req.body.sort : 'crop_name';
      const sortDirection = req.body.order ? req.body.order : 'ASC';
      condition.order = [[sortOrder, sortDirection]];
      if (req.body.search) {
        if (req.body.search.group_code) {
          condition.where.group_code = req.body.search.group_code;
        }
      }
      data = await cropModel.findAll(condition);


      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static IndentorDashboardVarietyName = async (req, res) => {
    let data = {};
    try {
      let condition = {
        //     include: [
        //         {
        //         model:stateModel,
        //         attributes: []
        //     },
        // ],
        where: {

        }
      };
      const sortOrder = req.body.sort ? req.body.sort : 'variety_name';
      const sortDirection = req.body.order ? req.body.order : 'ASC';
      condition.order = [[sortOrder, sortDirection]];
      if (req.body.search) {
        // if (req.body.search.group_code) {
        //   condition.where.group_code = req.body.search.group_code;
        // }
      }
      data = await varietyModel.findAll(condition);


      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static getIndenterDetails = async (req, res) => {
    let data = {};
    let condition = {};
    try {
      condition = {
        include: [
          {
            model: cropModel,
            attributes: ['id', 'crop_code', 'crop_name'],
            left: true
          },
          {
            model: varietyModel,
            attributes: ['id', 'variety_code', 'variety_name'],
            left: true
          },
          {
            model: bsp5bModel,
            attributes: ['id'],
            left: true
          },
          {
            model: bsp1Model,
            attributes: ['id'],
            left: true,

          },
          {
            model: bsp2Model,
            attributes: ['id'],
            left: true
          },
          {
            model: bsp3Model,
            attributes: ['id'],
            left: true
          },
          {
            model: bsp4Model,
            attributes: ['id'],
            left: true
          },
          {
            model: bsp5aModel,
            attributes: ['id'],
            left: true
          },
        ],
        where: {
          user_id: req.body.search.user_id,
          crop_code: {
            [Op.like]: req.body.search.crop_type + '%'
          }
        },
        raw: true
      };
      const sortOrder = req.body.sort ? req.body.sort : 'year';
      const sortDirection = req.body.order ? req.body.order : 'DESC';
      condition.order = [[sortOrder, sortDirection]];
      if (req.body.search) {
        if (req.body.search.year) {
          condition.where.year = req.body.search.year;
        }
        if (req.body.search.season) {
          condition.where.season = req.body.search.season;
        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = req.body.search.crop_code;
        }
        if (req.body.search.variety) {
          condition.where.variety_id = req.body.search.variety;
        }
      }
      data = await indentOfBreederseedModel.findAll(condition);


      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static getAvailNucleusSeed = async (req, res) => {
    let data = {};
    try {
      let condition = {
        attributes: [
          [sequelize.literal("COUNT(DISTINCT(crop_code))"), "crop_code"],
        ],
        where: {
          user_id: req.body.search.user_id,
          crop_code: {
            [Op.like]: req.body.search.crop_type + '%'
          },
          year: req.body.search.year
        }
      };
      data = await nucleusSeedAvailabityModel.findAll(condition);
      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static countCardItems = async (req, res) => {
    let data = {};
    try {
      let condition = {
        include: [
          {
            model: breederCertificate,
            attributes: [
              [sequelize.literal("COUNT(DISTINCT(generation_of_breeder_seed_certificate.crop_code))"), "crtificate_count"],
            ],
            required: true,
            raw: true
          }
        ],
        attributes: [
          [sequelize.literal("COUNT(DISTINCT(nucleus_seed_availabilities.variety_id))"), "variety_id"],
          [sequelize.literal("COUNT(DISTINCT(nucleus_seed_availabilities.crop_code))"), "crop_code"],
        ],
        where: {
          user_id: req.body.search.user_id,
          crop_code: {
            [Op.like]: req.body.search.crop_type + '%'
          }
        },
        raw: true
      };
      data = await nucleusSeedAvailabityModel.findAll(condition);
      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static countLabelItems = async (req, res) => {
    let data = {};
    try {
      let condition = {
        include: [
          {
            model: bsp1Model,
            attributes: [],
            raw: true,
            required: true
          },
          {
            model: bsp4Model,
            attributes: [],
            raw: true,
            required: true
          },
          {
            model: bsp5bModel,
            attributes: [],
            raw: true,
            required: true
          },
        ],
        attributes: [
          [sequelize.literal("COUNT(DISTINCT(bsp_1.crop_code))"), "allocation"],
          [sequelize.literal("Sum(bsp_4.actual_seed_production)"), "production"],
          [sequelize.literal("Sum(bsp_5_b.lifting_quantity)"), "lifting"],
        ],
        where: {
          user_id: req.body.search.user_id,
          crop_code: {
            [Op.like]: req.body.search.crop_type + '%'
          }
        },
        raw: true
      };
      data = await nucleusSeedAvailabityModel.findAll(condition);
      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static bsp2Card = async (req, res) => {
    let data = {};
    try {
      let condition = {
        attributes: [
          [sequelize.literal("Sum(expected_production)"), "expected_production"]
        ],
        where: {
          user_id: req.body.search.user_id,
          crop_code: {
            [Op.like]: req.body.search.crop_type + '%'
          }
        }
      };
      data = await bsp2Model.findAll(condition);
      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }


  static bsp4Card = async (req, res) => {
    let data = {};
    try {
      let condition = {
        attributes: [
          [sequelize.literal("Sum(actual_seed_production)"), "actual_seed_production"]
        ],
        where: {
          user_id: req.body.search.user_id,
          crop_code: {
            [Op.like]: req.body.search.crop_type + '%'
          }
        }
      };
      data = await bsp4Model.findAll(condition);
      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static bsp5bCard = async (req, res) => {
    let data = {};
    try {
      let condition = {
        attributes: [
          [sequelize.literal("Sum(lifting_quantity)"), "lifting_quantity"]
        ],
        where: {
          user_id: req.body.search.user_id,
          crop_code: {
            [Op.like]: req.body.search.crop_type + '%'
          }
        }
      };
      data = await bsp5bModel.findAll(condition);
      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static getVariety = async (req, res) => {
    let data = {};
    try {
      let condition = {
        include: [
          {
            model: varietyModel,
            attribute: ['id', 'variety_code', 'variety_name']
          }
        ],
        attributes: ['id', 'variety_id'],
        where: {
          crop_code: req.body.search.crop_code,
          user_id: req.body.search.user_id
        }
      };
      const sortOrder = req.body.sort ? req.body.sort : 'variety_name';
      const sortDirection = req.body.order ? req.body.order : 'ASC';
      condition.order = [[sortOrder, sortDirection]];
      data = await indentOfBreederseedModel.findAll(condition);
      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static getTotalLiftedCount = async (req, res) => {
    let data = {};
    try {
      let condition = {
        include: [
          {
            model: bsp5bModel,
            attributes: [],
            required: true
          },
        ],
        attributes: [
          [sequelize.literal("Sum(bsp_5_b.lifting_quantity)"), "lifting_quantity"],
        ],
        where: {
          user_id: req.body.search.user_id,
          crop_code: {
            [Op.like]: req.body.search.crop_type + '%'
          }
        }
      };
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
      }
      condition.group = [['crop_name']];
      data = await indentOfBreederseedModel.findAll(condition);
      // let qt = [];
      // let total = 0;
      // if(data.length != 0){
      //   data.forEach(element => {
      //     qt.push(element.dataValues.lifting_quantity);
      //   });
      //   total = qt.reduce(function (curr, prev) { return curr + prev; });
      // }
      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }


  static getLotNumberYears = async (req, res) => {
    try {
      const user_id = req.query.user_id;

      const data = await lotNumberModel.findAll({
        attributes: [
          [Sequelize.fn('DISTINCT', Sequelize.col('lot_number_creations.year')), 'year'],
        ],
        where: {
          user_id: user_id
        },
        raw: true,
        order: [['year', 'DESC']]
      });

      if (!data) {
        return response(res, status.DATA_NOT_AVAILABLE, 404);
      }

      return response(res, status.DATA_AVAILABLE, 200, data);

    } catch (error) {

      const returnResponse = {
        message: error.message,
      };

      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }

  static getLotNumberSeasons = async (req, res) => {
    try {
      const user_id = req.query.user_id;
      const year = req.query.year

      const data = await lotNumberModel.findAll({
        attributes: [
          [Sequelize.fn('DISTINCT', Sequelize.col('lot_number_creations.season')), 'season'],
        ],
        include: {
          attributes: ['season'],
          model: seasonModel,
          left: true,
        },
        where: {
          year: year,
          user_id: user_id
        },
        raw: true,
        order: [['season', 'ASC']]
      });

      if (!data) {
        return response(res, status.DATA_NOT_AVAILABLE, 404);
      }

      return response(res, status.DATA_AVAILABLE, 200, data);

    } catch (error) {

      const returnResponse = {
        message: error.message,
      };

      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }

  static getLotNumberCrops = async (req, res) => {
    try {
      const user_id = req.query.user_id;
      const year = req.query.year;
      const season = req.query.season

      const data = await lotNumberModel.findAll({
        attributes: [
          [Sequelize.fn('DISTINCT', Sequelize.col('lot_number_creations.crop_code')), 'crop_code'],
        ],
        include: {
          attributes: ['crop_name'],
          model: cropModel,
          left: true,
        },
        where: {
          season: season,
          year: year,
          user_id: user_id
        },
        raw: true,
        order: [[sequelize.col('m_crop.crop_name'), 'ASC']]
      });

      if (!data) {
        return response(res, status.DATA_NOT_AVAILABLE, 404);
      }

      return response(res, status.DATA_AVAILABLE, 200, data);

    } catch (error) {

      const returnResponse = {
        message: error.message,
      };

      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }

  static getLotNumberVarieties = async (req, res) => {
    try {
      const user_id = req.query.user_id;
      const year = req.query.year;
      const season = req.query.season
      const crop_code = req.query.crop_code
      let data;
      if (req.query && req.query.type) {
        data = await lotNumberModel.findAll({
          attributes: [
            [Sequelize.fn('DISTINCT', Sequelize.col('lot_number_creations.variety_id')), 'variety_id'],
          ],
          include: {
            attributes: ['id', 'variety_code', 'variety_name'],
            model: varietyModel,
            left: true,
          },
          where: {
            season: season,
            year: year,
            crop_code: crop_code,
            user_id: user_id,
            // reserved_lot_number:false
            [Op.or]: [

              {
                reserved_lot_number: {
                  [Op.eq]: "false"
                }

              }

            ]

          },
          raw: true,
          order: [[sequelize.col('m_crop_variety.variety_name'), 'ASC']]
          // order: [['variety_id', 'DESC']]
        });
      } else {
        data = await lotNumberModel.findAll({
          attributes: [
            [Sequelize.fn('DISTINCT', Sequelize.col('lot_number_creations.variety_id')), 'variety_id'],
          ],
          include: {
            attributes: ['id', 'variety_code', 'variety_name'],
            model: varietyModel,
            left: true,
          },
          where: {
            season: season,
            year: year,
            crop_code: crop_code,
            user_id: user_id,
            // reserved_lot_number:false
            // [Op.or]: [

            //   {
            //     reserved_lot_number: {
            //       [Op.eq]: "false"
            //     }

            //   }

            // ]

          },

          raw: true,
          order: [[sequelize.col('m_crop_variety.variety_name'), 'ASC']]
        });
      }



      if (!data) {
        return response(res, status.DATA_NOT_AVAILABLE, 404);
      }

      return response(res, status.DATA_AVAILABLE, 200, data);

    } catch (error) {

      const returnResponse = {
        message: error.message,
      };

      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }

  static getPerformabreederSeedtagYear = async (req, res) => {
    try {
      let condition = {

        attributes: [
          // distinct year //
          [sequelize.literal('DISTINCT(year)'), 'year']
        ],
        // left:true,
        // group: ["m_season.season"],

        // distinct: true,
        // [sequelize.fn]

        // raw: true,

      }
      condition.order = [[sequelize.col('year'), 'DESC']];
      // condition.order[(Sequelize.col('m_crop_group.group_name','ASC'))]
      // condition.order = [[sequelize.col('m_crop->m_crop_group.group_name'), 'ASC']];
      if (req.body) {


      }

      let data = await indentOfBreederseedModel.findAndCountAll(condition);

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

  static getPerformabreederSeedListtagYear = async (req, res) => {
    try {
      let condition = {

        attributes: [
          // distinct year //
          [sequelize.literal('DISTINCT(year_of_indent)'), 'year_of_indent']
        ],
        where: {
          [Op.and]: {
            'year_of_indent': {
              [Op.ne]: null
            }

          }
        }
        // left:true,
        // group: ["m_season.season"],

        // distinct: true,
        // [sequelize.fn]

        // raw: true,

      }
      condition.order = [[sequelize.col('year_of_indent'), 'DESC']];
      // condition.order[(Sequelize.col('m_crop_group.group_name','ASC'))]
      // condition.order = [[sequelize.col('m_crop->m_crop_group.group_name'), 'ASC']];
      if (req.body) {


      }

      let data = await performaSeedModel.findAndCountAll(condition);

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
  static getPerformabreederSeedtagSeason = async (req, res) => {
    try {
      let condition = {

        attributes: [
          // distinct year //
          [sequelize.literal('DISTINCT(season)'), 'season']
        ],
        // left:true,
        // group: ["m_season.season"],

        // distinct: true,
        // [sequelize.fn]

        // raw: true,
        where: {
          year: req.body.search.year
        }

      }
      condition.order = [[sequelize.col('season'), 'ASC']];
      // condition.order[(Sequelize.col('m_crop_group.group_name','ASC'))]
      // condition.order = [[sequelize.col('m_crop->m_crop_group.group_name'), 'ASC']];


      let data = await indentOfBreederseedModel.findAndCountAll(condition);

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


  // static getYearForTagProforma = async (req, res) => {
  //   try {
  //     const user_id = req.query.user_id;

  //     const data = await performaSeedModel.findAll({
  //       attributes: [
  //         [Sequelize.fn('DISTINCT', Sequelize.col('tag_performas.year')), 'year'],
  //       ],
  //       where: {
  //         user_id: user_id
  //       },
  //       raw: true,
  //       order: [['year', 'DESC']]
  //     });

  //     if (!data) {
  //       return response(res, status.DATA_NOT_AVAILABLE, 404);
  //     }

  //     return response(res, status.DATA_AVAILABLE, 200, data);

  //   } catch (error) {

  //     const returnResponse = {
  //       message: error.message,
  //     };

  //     return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
  //   }
  // }

  // static getSeasonsForTagProforma = async (req, res) => {
  //   try {
  //     const user_id = req.query.user_id;
  //     const year = req.query.year;

  //     const data = await performaSeedModel.findAll({
  //       attributes: [
  //         [Sequelize.fn('DISTINCT', Sequelize.col('tag_performas.season')), 'season'],
  //       ],
  //       include: {
  //         attributes: ['season'],
  //         model: seasonModel,
  //         left: true,
  //       },
  //       where: {
  //         year: year,
  //         user_id: user_id
  //       },
  //       raw: true,
  //       order: [['season', 'DESC']]
  //     });

  //     if (!data) {
  //       return response(res, status.DATA_NOT_AVAILABLE, 404);
  //     }

  //     return response(res, status.DATA_AVAILABLE, 200, data);

  //   } catch (error) {

  //     const returnResponse = {
  //       message: error.message,
  //     };

  //     return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
  //   }
  // }

  static getCropsForTagProforma = async (req, res) => {
    try {
      const user_id = req.query.user_id;
      // const year = req.query.year;
      // const season = req.query.season

      const data = await performaSeedModel.findAll({
        attributes: [
          [Sequelize.fn('DISTINCT', Sequelize.col('tag_performas.crop_code')), 'crop_code'],
        ],
        include: {
          attributes: ['crop_name'],
          model: cropModel,
          left: true,
        },
        where: {
          // season: season,
          // year: year,
          user_id: user_id
        },
        raw: true,
        order: [['crop_code', 'DESC']]
      });

      if (!data) {
        return response(res, status.DATA_NOT_AVAILABLE, 404);
      }

      return response(res, status.DATA_AVAILABLE, 200, data);

    } catch (error) {

      const returnResponse = {
        message: error.message,
      };

      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }

  static getVarietiesForTagProforma = async (req, res) => {
    try {
      const user_id = req.query.user_id;
      // const year = req.query.year;
      // const season = req.query.season;
      const crop_code = req.query.crop_code;

      const data = await performaSeedModel.findAll({
        attributes: [
          [Sequelize.fn('DISTINCT', Sequelize.col('tag_performas.variety_id')), 'variety_id'],
        ],
        include: {
          attributes: ['id', 'variety_code', 'variety_name'],
          model: varietyModel,
          left: true,
        },
        where: {
          // season: season,
          // year: year,
          crop_code: crop_code,
          user_id: user_id
        },
        raw: true,
        order: [['variety_id', 'DESC']]
      });

      if (!data) {
        return response(res, status.DATA_NOT_AVAILABLE, 404);
      }

      return response(res, status.DATA_AVAILABLE, 200, data);

    } catch (error) {

      const returnResponse = {
        message: error.message,
      };

      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }
  static getIndentCropForLotNumber = async (req, res) => {
    try {
      let condition = {
        include: [{

          model: cropModel,

          raw: true,

        }],
        attributes: [
          [sequelize.literal('DISTINCT(m_crop.crop_code)'), 'crop_code'],

        ],
        raw: true,
        distinct: true,
        where: {
          "year": req.body.search.year,
          "season": req.body.search.season,
          "user_id": req.body.loginedUserid.id
        },
        order:
          [(sequelize.col('m_crop.crop_name', 'ASC'))]

      }
      let data = await bsp4Model.findAll(condition);
      // console.log('data==========>',data)
      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    } catch (error) {
      console.log(error, 'errp')
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    }
  }
  static getSeasonForLotNumber = async (req, res) => {
    try {
      console.log(req.query)
      let condition = {
        include: [{

          model: seasonModel,

          raw: true,

        }],
        attributes: [
          [sequelize.literal('DISTINCT(m_season.season_code)'), 'season_code'],

        ],
        raw: true,
        distinct: true,
        where: {
          "year": req.query.year,
          // "season": req.body.search.season
        },
        order:
          [(sequelize.col('m_season.season_code', 'ASC'))]

      }
      let data = await bsp4Model.findAll(condition);
      // console.log('data==========>',data)
      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    } catch (error) {
      console.log(error, 'errp')
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    }
  }

  static getYearForLotNumber = async (req, res) => {
    try {
      console.log(req.query)
      let condition = {

        attributes: [
          [sequelize.literal('DISTINCT(year)'), 'year'],

        ],
        raw: true,
        distinct: true,

        order:
          [(sequelize.col('year', 'DESC'))]

      }
      let data = await bsp4Model.findAll(condition);
      // console.log('data==========>',data)
      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    } catch (error) {
      console.log(error, 'errp')
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    }
  }
  static getVarietyForIndentor = async (req, res) => {
    try {
      console.log(req.query)
      let condition = {
        include: [
          {
            model: varietyModel
          }
        ],

        attributes: [
          // [sequelize.literal('DISTINCT(m_season.season_code)'), 'season_code'],
          // [sequelize.literal('DISTINCT(year)'), 'year'],

        ],
        // raw: true,
        distinct: true,
        where: {
          crop_code: req.body.search.crop_code
        }

        // order: 
        // [ (sequelize.col('year', 'DESC'))]

      }
      let data = await nucleusSeedAvailabityModel.findAll(condition);
      // console.log('data==========>',data)
      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    } catch (error) {
      console.log(error, 'errp')
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    }
  }
  static getVarietyForIndentorNew = async (req, res) => {
    try {
      console.log(req.query)
      // let data;
      if (req.body.search && req.body.search.view) {
        let condition = {}
        condition = {

          distinct: true,
          where: {
            crop_code: req.body.search.crop_code
          }

          // order: 
          // [ (sequelize.col('year', 'DESC'))]

        }
      } else {
        let condition = {

          distinct: true,
          where: {
            crop_code: req.body.search.crop_code,
            is_active: 1
          }

          // order: 
          // [ (sequelize.col('year', 'DESC'))]

        }

        // }
        let data = await varietyModel.findAll(condition);
        // });
        if (data) {
          response(res, status.DATA_AVAILABLE, 200, data);
        } else {
          return response(res, status.DATA_NOT_AVAILABLE, 404)
        }

      }
      // let data = await varietyModel.findAll(condition);
      // console.log('data==========>',data)

    } catch (error) {
      console.log(error, 'errp')
      return response(res, status.UNEXPECTED_ERROR, 501)
    }
  }
  static getNucleusSeedAvailabilityforReportsSeason = async (req, res) => {
    try {
      let { page, pageSize, searchData } = req.body;
      console.log(req.body)

      let condition = {
        // attributes: ['quantity', 'variety_id', 'crop_code'],
        include: [

          // {
          //   model: cropModel,
          //   left: false,
          //   raw: false,
          //   attributes: [ 'season'],
          //   raw: true
          // },
        ],
        raw: true,
        where: {},
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('nucleus_seed_availabilities.season')), 'season'],
        ],
        raw: true
      }


      if (page === undefined) page = 1;
      if (pageSize === undefined) pageSize = 10;
      if (page > 0 && pageSize > 0) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }

      if (req.body.search) {
        if (req.body.search.year) {
          condition.where['year'] = req.body.search.year;
        }
        if (req.body.search.type == 'report_icar') {
          if (req.body.search.user_type == 'ICAR') {
            condition.include[0].where = {}
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
        // if (searchData.crop_code) {
        //   condition.where['crop_code'] = searchData.crop_code;
        // }
      }

      const sortOrder = req.body.sort ? req.body.sort : 'id';
      const sortDirection = req.body.order ? req.body.order : 'DESC';

      // condition.order = [[sortOrder, sortDirection]];

      let data = await nucleusSeedAvailabityModel.findAndCountAll(condition);

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
  static getNucleusSeedAvailabilityforReportsName = async (req, res) => {
    try {
      let { page, pageSize, searchData } = req.body;
      console.log(req.body)

      let condition = {
        // attributes: ['quantity', 'variety_id', 'crop_code'],
        include: [

          {
            model: cropModel,
            left: false,
            raw: false,
            attributes: ['crop_name', 'season', 'crop_code'],
            raw: true
          },
        ],
        raw: true,
        where: {},
        attributes: [

          [sequelize.fn('DISTINCT', sequelize.col('nucleus_seed_availabilities.breeder_production_centre_name')), 'breeder_production_centre_name'],
        ],
        // raw:true
      }


      // if (page === undefined) page = 1;
      // if (pageSize === undefined) pageSize = 10;
      // if (page > 0 && pageSize > 0) {
      //   condition.limit = pageSize;
      //   condition.offset = (page * pageSize) - pageSize;
      // }

      if (req.body.search) {
        if (req.body.search.year) {
          condition.where['year'] = req.body.search.year;
        }
        if (req.body.search.season) {
          condition.include[0].where = {}
          condition.where['season'] = req.body.search.season;
        }

        if (req.body.search.type == 'report_icar') {
          if (req.body.search.user_type == 'ICAR') {
            condition.include[0].where = {}
            condition.include[0].where.crop_code = {
              [Op.or]: [
                { [Op.like]: 'A' + "%" },
              ]
            }

          } if (req.body.search.user_type == 'HICAR') {
            condition.include[0].where.crop_code = {
              [Op.or]: [
                { [Op.like]: 'H' + "%" },
              ]
            }
          }

          // condition.where.crop_group = (req.body.search.crop_name_data);
        }
        // if (searchData.crop_code) {
        //   condition.where['crop_code'] = searchData.crop_code;
        // }
      }

      // const sortOrder = req.body.sort ? req.body.sort : 'id';
      // const sortDirection = req.body.order ? req.body.order : 'DESC';

      condition.order = [[sequelize.col('nucleus_seed_availabilities.breeder_production_centre_name'), 'ASC']];

      let data = await nucleusSeedAvailabityModel.findAndCountAll(condition);

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
  static getNucleusSeedAvailabilityforReportsVarietyName = async (req, res) => {
    try {
      let { page, pageSize, searchData } = req.body;
      console.log(req.body)

      let condition = {
        // attributes: ['quantity', 'variety_id', 'crop_code'],
        include: [

          {
            model: cropModel,

            left: false,
            raw: false,
            attributes: ['crop_name', 'season', 'crop_code'],
            raw: true
          }, {
            model: varietyModel,
            left: false,
            raw: false,
            // attributes: ['crop_name','season','crop_code'],

          },

        ],
        raw: true,
        where: {},
        attributes: [
          // 'breeder_production_centre_name'
          [sequelize.fn('DISTINCT', sequelize.col('m_crop_variety.id')), 'id'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name']
        ],
        // raw:true
      }


      if (page === undefined) page = 1;
      if (pageSize === undefined) pageSize = 10;
      if (page > 0 && pageSize > 0) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }

      if (req.body.search) {
        if (req.body.search.year) {
          condition.where['year'] = req.body.search.year;
        }
        if (req.body.search.season) {
          // condition.include[0].where = {}
          condition.where['season'] = req.body.search.season;
        }
        if (req.body.search.crop_code) {
          condition.include[0].where = {}
          condition.where['crop_code'] = req.body.search.crop_code;
        }

        // if (req.body.search.crop_type) {
        //   condition.include[0].where = {}
        //   condition.where['crop_code'] = req.body.search.crop_code;
        // }

        // if (searchData.crop_code) {
        //   condition.where['crop_code'] = searchData.crop_code;
        // }
      }

      const sortOrder = req.body.sort ? req.body.sort : 'id';
      const sortDirection = req.body.order ? req.body.order : 'DESC';

      // condition.order = [[sortOrder, sortDirection]];

      let data = await nucleusSeedAvailabityModel.findAndCountAll(condition);

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
  static getNucleusSeedAvailabilityforReportsCropName = async (req, res) => {
    try {
      let { page, pageSize, searchData } = req.body;
      console.log(req.body)

      let condition = {
        // attributes: ['quantity', 'variety_id', 'crop_code'],
        include: [

          {
            model: cropModel,

            left: false,
            raw: false,
            attributes: ['crop_name', 'season', 'crop_code'],
            raw: true
          },

        ],
        raw: true,
        where: {},
        attributes: [
          // 'breeder_production_centre_name'
          [sequelize.fn('DISTINCT', sequelize.col('m_crop.crop_code')), 'crop_code'],
          [sequelize.col('m_crop.crop_name'), 'crop_name']
        ],
        // raw:true
      }


      if (page === undefined) page = 1;
      if (pageSize === undefined) pageSize = 10;
      if (page > 0 && pageSize > 0) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }

      if (req.body.search) {
        if (req.body.search.year) {
          condition.where['year'] = req.body.search.year;
        }
        if (req.body.search.season) {
          // condition.include[0].where = {}
          condition.where['season'] = req.body.search.season;
        }
        if (req.body.search.crop_type) {

          condition.where.crop_code = {
            [Op.or]: [
              { [Op.like]: req.body.search.crop_type + "%" },
            ]

          }
          // condition.where['crop_code'] = searchData.crop_code;
        }

        // if (searchData.crop_code) {
        //   condition.where['crop_code'] = searchData.crop_code;
        // }
      }

      const sortOrder = req.body.sort ? req.body.sort : 'id';
      const sortDirection = req.body.order ? req.body.order : 'DESC';

      // condition.order = [[sortOrder, sortDirection]];

      let data = await nucleusSeedAvailabityModel.findAndCountAll(condition);

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
  static getNucleusSeedAvailabityYearListData = async (req, res) => {
    try {
      let condition = {
        attributes: [
          [sequelize.literal('DISTINCT(year)'), 'year']
        ],
        distinct: true,
        where: {
          production_center_id: req.body.userd_id

        },
        order: [['year', 'Desc']],
      }
      let data = await nucleusSeedAvailabityModel.findAll(condition);
      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    } catch (error) {
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    }
  }
  static getProductionSeasonFilterListData = async (req, res) => {
    try {
      let condition = {
        include: [
          {
            model: seasonModel,
            attributes: []
          },
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('nucleus_seed_availabilities.season')), 'season_code'],
          [sequelize.col('m_season.season'), 'season'],
        ],
        raw: true,
        where: {
          year: req.body.search.year,
          production_center_id: req.body.search.user_id
        }
      }

      // condition.order = [['season_code', 'ASC']]
      let data = await nucleusSeedAvailabityModel.findAndCountAll(condition);
      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      console.log("error", error)
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    }
  }
  static getProductionCropNameFilterListData = async (req, res) => {
    try {
      const userData = req.body.loginedUserid;
      let condition = {}
      if (req.body.search.view) {
        condition = {
          required: true,
          include: {
            model: cropModel,

            // attributes:['crop_name']
          },
          where: {
            production_center_id: userData.id
          },
          raw: true,
          // required: true,
          // distinct:false,
          attributes: [
            // [sequelize.literal('DISTINCT(crop_code)'), 'crop_code']
            [sequelize.fn('DISTINCT', sequelize.col('m_crop.crop_name')), 'crop_name'],
            // [sequelize.col('breeder_crops.id'), 'id'],
            // [sequelize.literal('(DISTINCT(breeder_crops.crop_code))'), 'crop_code'],
            // [sequelize.col('m_crop.crop_name'), 'crop_name'],
            // [sequelize.col('crops.crop_group'), 'crop_group']
            // 'crop_code'
            // 'year'
          ],
        }
      } else {
        condition = {
          required: true,
          include: {
            model: cropModel,
            where: {
              is_active: 1,
              // season:req.body.search.season
            }

            // attributes:['crop_name']
          },
          where: {
            production_center_id: userData.id
          },
          raw: true,
          // required: true,
          // distinct:false,
          attributes: [
            // [sequelize.literal('DISTINCT(crop_code)'), 'crop_code']
            [sequelize.fn('DISTINCT', sequelize.col('m_crop.crop_name')), 'crop_name'],
            // [sequelize.col('breeder_crops.id'), 'id'],
            // [sequelize.literal('(DISTINCT(breeder_crops.crop_code))'), 'crop_code'],
            // [sequelize.col('m_crop.crop_name'), 'crop_name'],
            // [sequelize.col('crops.crop_group'), 'crop_group']
            // 'crop_code'
            // 'year'
          ],
        }
      }

      if (req.body.search) {
        if (req.body.search.year) {
          condition.where.year = (req.body.search.year);
        }
        if (req.body.search.season) {
          condition.where.season = (req.body.search.season);
        }
        if (req.body.search.user_id) {
          condition.where.user_id = (req.body.search.user_id);
        }
        // if (req.body.search.season) {
        //   condition.where.season = (req.body.search.season);
        // }
      }
      let data = await nucleusSeedAvailabityModel.findAndCountAll(condition);

      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      console.log("error", error)
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    }
  }
  static getNucleusSeedAvailabityVarietyNameListData = async (req, res) => {
    try {
      let condition = {
        include: [
          {
            model: cropModel,
            where: {
              season: req.body.search.season
            }
          },
          {
            model: cropVerietyModel
          },
        ],
        attributes: [
          // [sequelize.literal('DISTINCT(year)'), 'year']
          [sequelize.fn('DISTINCT', sequelize.col('m_crop_variety.variety_name')), 'variety_name'],
        ],
        raw: true,
        distinct: true,
        where: {
          year: req.body.search.year,
          crop_code: req.body.search.cropName,
          production_center_id: req.body.search.user_id,


        },
        // order: [['year', 'Desc']],

      }


      let data = await nucleusSeedAvailabityModel.findAll(condition);
      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    } catch (error) {
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    }
  }
  static getbsp4ryearofindentreport = async (req, res) => {
    try {
      let condition = {

        attributes: [
          // distinct year //
          [sequelize.literal('DISTINCT(year)'), 'year']
        ],
        // left:true,
        // group: ["m_season.season"],

        // distinct: true,
        // [sequelize.fn]

        // raw: true,
        where: {
          // year: req.body.search.year
        }

      }
      condition.order = [['year', 'DESC']];
      // condition.order[(Sequelize.col('m_crop_group.group_name','ASC'))]
      // condition.order = [[sequelize.col('m_crop->m_crop_group.group_name'), 'ASC']];


      let data = await bsp4Model.findAndCountAll(condition);

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
  static getbsp4seasonreport = async (req, res) => {
    try {
      let condition = {

        attributes: [
          // distinct year //
          [sequelize.literal('DISTINCT(season)'), 'season']
        ],
        // left:true,
        // group: ["m_season.season"],

        // distinct: true,
        // [sequelize.fn]

        // raw: true,
        where: {
          year: req.body.search.year
        }

      }
      // condition.order = [['year', 'DESC']];
      // condition.order[(Sequelize.col('m_crop_group.group_name','ASC'))]
      // condition.order = [[sequelize.col('m_crop->m_crop_group.group_name'), 'ASC']];


      let data = await bsp4Model.findAndCountAll(condition);

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
  static getbsp4cropTypereport = async (req, res) => {
    try {
      let condition = {

        attributes: [
          // distinct year //
          [sequelize.literal('DISTINCT(crop_code)'), 'crop_code']
        ],
        // left:true,
        // group: ["m_season.season"],

        // distinct: true,
        // [sequelize.fn]

        // raw: true,
        where: {
          year: req.body.search.year,
          season: req.body.search.season
        }

      }
      // condition.order = [['year', 'DESC']];
      // condition.order[(Sequelize.col('m_crop_group.group_name','ASC'))]
      // condition.order = [[sequelize.col('m_crop->m_crop_group.group_name'), 'ASC']];


      let data = await bsp4Model.findAndCountAll(condition);

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
  static getbsp4pdpc = async (req, res) => {
    try {


      let condition = {
        include: [
          {
            model: cropModel,
            include: [
              {
                model: userModel,
                where: {
                  // user_type:'BR'
                }
              }
            ]

          }
        ],

        attributes: [
          // distinct year //

          [sequelize.fn('DISTINCT', sequelize.col('m_crop->user.name')), 'name'],
          // [sequelize.literal('DISTINCT(crop_code)'), 'crop_code']
        ],
        raw: true,
        // left:true,
        // group: ["m_season.season"],

        // distinct: true,
        // [sequelize.fn]

        // raw: true,

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
              crop_code: {
                [Op.like]: "%" + req.body.search.crop_tpye + "%",
                // [Op.like]: req.body.search.crop_tpye
              }

            }

          ]
        },

      }
      // condition.order = [['year', 'DESC']];
      // condition.order[(Sequelize.col('m_crop_group.group_name','ASC'))]
      condition.order = [[sequelize.col('m_crop->user.name'), 'ASC']];


      let data = await bsp4Model.findAndCountAll(condition);

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
  static getbsp4cropName = async (req, res) => {
    try {


      let condition = {
        include: [
          {
            model: cropModel,
            include: [{
              model: userModel,
              where: {
                name: req.body.search.pcpd
              }

            }]

          }
        ],

        attributes: [
          // distinct year //

          [sequelize.fn('DISTINCT', sequelize.col('m_crop.crop_name')), 'crop_name'],
          // [sequelize.literal('DISTINCT(crop_code)'), 'crop_code']
        ],
        raw: true,
        // left:true,
        // group: ["m_season.season"],

        // distinct: true,
        // [sequelize.fn]

        // raw: true,

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
              crop_code: {
                [Op.like]: "%" + req.body.search.crop_tpye + "%",
                // [Op.like]: req.body.search.crop_tpye
              }

            }

          ]
        },
        // where: {
        //   year: req.body.search.year,
        //   season: req.body.search.season,
        //   // croptype:req.body.search.croptype,        
        // }

      }
      // condition.order = [['year', 'DESC']];
      // condition.order[(Sequelize.col('m_crop_group.group_name','ASC'))]
      condition.order = [[sequelize.col('m_crop.crop_name'), 'ASC']];


      let data = await bsp4Model.findAndCountAll(condition);

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
  static getbsp4VarietyName = async (req, res) => {
    try {


      let condition = {
        include: [
          {
            model: cropModel

          },
          {
            model: cropVerietyModel
          }
        ],

        attributes: [
          // distinct year //
          [sequelize.literal('DISTINCT(m_crop_variety.variety_name)'), 'variety_name']
        ],
        // left:true,
        // group: ["m_season.season"],

        // distinct: true,
        // [sequelize.fn]

        raw: true,

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
            // {
            //   crop_code: {
            //     [Op.like]: "%" + req.body.search.crop_tpye + "%",
            //     // [Op.like]: req.body.search.crop_tpye
            //   }

            // },
            {
              crop_code: {
                [Op.in]: req.body.search.crop_code,
                // [Op.like]: req.body.search.crop_tpye
              }

            }

          ]
        },

      }
      // condition.order = [['year', 'DESC']];
      // condition.order[(Sequelize.col('m_crop_group.group_name','ASC'))]
      condition.order = [[sequelize.col('m_crop_variety.variety_name'), 'ASC']];


      let data = await bsp4Model.findAndCountAll(condition);

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
  static getbsp4VarietyNameSecond = async (req, res) => {
    try {


      let condition = {
        include: [
          {
            model: cropModel,
            attributes: []

          },
          {
            model: cropVerietyModel,
            attributes: []
          }
        ],

        attributes: [
          // distinct year //
          [sequelize.literal('DISTINCT(m_crop_variety.variety_name)'), 'variety_name'],
          [sequelize.literal('(m_crop_variety.variety_code)'), 'variety_code'],
          [sequelize.literal('(m_crop_variety.id)'), 'variety_id']


        ],
        // left:true,
        // group: ["m_season.season"],

        // distinct: true,
        // [sequelize.fn]

        raw: true,

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
            // {
            //   crop_code: {
            //     [Op.like]: "%" + req.body.search.crop_tpye + "%",
            //     // [Op.like]: req.body.search.crop_tpye
            //   }

            // },
            {
              crop_code: {
                [Op.in]: req.body.search.crop_code,
                // [Op.like]: req.body.search.crop_tpye
              }

            }

          ]
        },

      }
      // condition.order = [['year', 'DESC']];
      // condition.order[(Sequelize.col('m_crop_group.group_name','ASC'))]
      condition.order = [[sequelize.col('m_crop_variety.variety_name'), 'ASC']];


      let data = await bsp4Model.findAndCountAll(condition);

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

  static getbsp4reportData = async (req, res) => {
    try {


      let condition = {
        include: [
          {
            model: cropModel

          },
          {
            model: cropVerietyModel
          }
        ],


        // left:true,
        // group: ["m_season.season"],

        // distinct: true,
        // [sequelize.fn]

        raw: true,

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
              crop_code: {
                [Op.like]: "%" + req.body.search.crop_tpye + "%",
                // [Op.like]: req.body.search.crop_tpye
              }

            },
            {
              crop_code: {
                [Op.eq]: req.body.search.crop_code,
                // [Op.like]: req.body.search.crop_tpye
              }

            },
            {
              variety_id: {
                [Op.eq]: req.body.search.variety_id,
                // [Op.like]: req.body.search.crop_tpye
              }

            },

          ]
        },

      }
      // condition.order = [['year', 'DESC']];
      // condition.order[(Sequelize.col('m_crop_group.group_name','ASC'))]
      // condition.order = [[sequelize.col('m_crop_variety.variety_name'), 'ASC']];


      let data = await bsp4Model.findAndCountAll(condition);

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

  static checkNulcuesFormProductionDataisFill = async (req, res) => {
    let returnResponse = {};
    try {
      let condition = {
        where: {
          is_flag: 1
        }
      }

      if (req.body.search) {
        if (req.body.search.year.value) {
          condition.where.year = req.body.search.year.value;
        }
        if (req.body.search.season.value) {
          condition.where.season = req.body.search.season.value;
        }
        if (req.body.search.crop_code.value) {
          condition.where.crop_code = req.body.search.crop_code.value;
        }
        if (req.body.search.variety_code) {
          condition.where.variety_code = req.body.search.variety_code;
        }
        if (req.body.search.variety_id) {
          condition.where.variety_id = req.body.search.variety_id;
        }
        if (req.body.search.production_center_id) {
          condition.where.production_center_id = req.body.search.production_center_id;
        }
      }

      let data = await nucleusSeedAvailabityModel.findAll(condition)
      console.log("data", data)
      console.log("dataqqqq", data.length)

      if (data && data.length > 0) {
        return response(res, status.DATA_AVAILABLE, 200, returnResponse);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 401, returnResponse);
      }

    } catch (error) {
      console.log(error);
      return response(res, status.DATA_NOT_SAVE, 500, returnResponse);
    }
  }

  static getAgencyDetailLabelData = async (req, res) => {
    let returnResponse = {};
    try {
      let condition = {
        include: [
          {
            model: designationModel
          }
        ],
        where: {
          id: req.body.search.id
          // is_flag:1
        },

      }



      let data = await agencyDetailModel.findAll(condition)
      console.log("data", data)
      console.log("dataqqqq", data.length)

      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, data);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 401, returnResponse);
      }

    } catch (error) {
      console.log(error);
      return response(res, status.DATA_NOT_SAVE, 500, returnResponse);
    }
  }

  static getNucleusSeedCropType = async (req, res) => {

    let returnResponse = {};
    try {
      let condition = {

        attributes: [

          [sequelize.fn('DISTINCT', sequelize.col('nucleus_seed_availabilities.crop_code')), 'crop_code'],
        ]
        // m_crop->m_crop_group
      };

      let { search } = req.body;

      if (search) {
        condition.where = {};
        if (search.year) {
          condition.where.year = req.body.search.year
        }
        if (search.season) {
          condition.where.season = req.body.search.season
        }
      }
      // condition.order = [[sequelize.col('m_crop->m_crop_group.group_name'), 'ASC']];

      let data = await nucleusSeedAvailabityModel.findAndCountAll(condition);
      let cropTypeArr = [];
      data.rows.forEach(element => {
        cropTypeArr.push({
          crop_type: element && element.crop_code && (element.crop_code.split(0, 1) == 'H') ? 'Horticulture' : 'Agriculture'
        })
      })


      if (cropTypeArr) {
        response(res, status.DATA_AVAILABLE, 200, cropTypeArr);
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
  static getNucleusSeedseed = async (req, res) => {

    let returnResponse = {};
    try {
      let condition = {


        // m_crop->m_crop_group
      };

      let { search } = req.body;

      if (search) {
        condition.where = {};
        if (search.year) {
          condition.where.year = req.body.search.year
        }
        if (search.season) {
          condition.where.season = req.body.search.season
        }
        if (search.user_id) {
          condition.where.breeder_production_center_id = req.body.search.user_id
        }

        if (search.crop_code) {
          condition.where.crop_code = req.body.search.crop_code
        }

      }
      // condition.order = [[sequelize.col('m_crop->m_crop_group.group_name'), 'ASC']];

      let data = await lotNumberModel.findAndCountAll(condition);
      let cropTypeArr = [];



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

  static getProductionDashboardItemCount = async (req, res) => {
    try {
      // crop_count_data
      let productionCropCountCardData = await breederCropModel.findAll({
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('breeder_crops.crop_code')), 'total_crops']
        ],
        where: {
          production_center_id: req.body.loginedUserid.id
        },
        raw: true
      });

      // veriety_count_data
      let productionVarietyCountCardData = await breederCropModel.findAll({
        include: [
          {
            model: breederCropsVerietiesModel,
            attributes: []
          }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('breeder_crops_veriety.variety_id')), 'total_variety']
        ],
        where: {
          production_center_id: req.body.loginedUserid.id
        },
        raw: true
      });

      //bills cerificate count
      let productionCertificateCountCardData = await generateBills.findAll({
        attributes: ['*'
        ],
        where: {
          user_id: req.body.loginedUserid.id
        },
        raw: true
      });

      //total spp count
      let productionSppCountCardData = await bspctoplantModel.findAll({
        attributes: ['*'
        ],
        where: {
          user_id: req.body.loginedUserid.id
        },
        raw: true
      });

      // final card count data
      let finalCardData = [
        {
          "total_crops": productionCropCountCardData && productionCropCountCardData.length ? productionCropCountCardData.length : 0
        },
        { "total_variety": productionVarietyCountCardData && productionVarietyCountCardData.length ? productionVarietyCountCardData.length : 0 },
        { "total_certificate": productionCertificateCountCardData && productionCertificateCountCardData && productionCertificateCountCardData.length ? productionCertificateCountCardData.length : 0 },
        { "total_spp": productionSppCountCardData && productionSppCountCardData && productionSppCountCardData.length ? productionSppCountCardData.length : 0 }
      ];
      return response(res, status.DATA_AVAILABLE, 200, finalCardData);
    } catch (error) {
      return response(res, status.DATA_NOT_SAVE, 500, error);
    }
  }

  static getBspcFilterCropData = async (req, res) => {
    let internalCall = {};
    let returnResponse = {};
    try {
      let condition = {
        include: [
          {
            model: cropModel,
            attributes: []
          },
          {
            model: bsp1ProductionCenterModel,
            attributes: [],
            where: {
              production_center_id: req.body.loginedUserid.id
            }
          }
        ],
        where: {
          [Op.and]: [
            // {
            //   crop_code: {
            //     [Op.like]: req.body && req.body.search && req.body.search.crop_type ? req.body.search.crop_type + "%" : ''
            //   }
            // },
            // {
            //   is_freeze: {
            //     [Op.eq]: 1
            //   }
            // }
          ]
        },
        attributes: [
          [sequelize.fn("DISTINCT", sequelize.col('m_crop.crop_name')), 'crop_name'],
          [sequelize.col('m_crop.crop_code'), 'crop_code']
        ],
        raw: true,

      }
      condition.order = [[sequelize.col('m_crop.crop_name'), 'DESC']];
      if (req.body.search) {
        if (req.body.search.year) {
          condition.where.year = req.body.search.year
        }
        if (req.body.search.season) {
          condition.where.season = req.body.search.season
        }
        if (req.body.search.crop_type) {
          condition.where.crop_code = {
            [Op.like]: req.body && req.body.search && req.body.search.crop_type ? req.body.search.crop_type + "%" : '',
          }

        }
      }
      let data = await bsp1Model.findAll(condition);
      return response(res, status.DATA_AVAILABLE, 200, data);
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }

  static getAllocationDashboardData = async (req, res) => {
    try {

      // filter
      // let seasonData;
      // if (req.body && req.body.search && req.body.search.season) {
      //   seasonData = {
      //     season: {
      //       [Op.eq]: req.body.search.season
      //     }
      //   };
      // }
      let filterData1 = [];
      if (req.body.search) {
        if (req.body.search.crop_type) {
          filterData1.push({
            crop_code: {
              [Op.like]: req.body.search.crop_type + '%'
            }
          })
        }
        if (req.body.search.year) {
          filterData1.push({
            year: {
              [Op.eq]: req.body.search.year
            },
          })

        }
        if (req.body.search.season) {
          filterData1.push({
            season: {
              [Op.eq]: req.body.search.season
            }
          });
        }
        if (req.body.search.crop_code && req.body.search.crop_code.length > 0) {
          filterData1.push({
            crop_code: {
              [Op.in]: req.body.search.crop_code
            },

          })
        }
      }

      //allocation qnt data
      let allocationQntData = await bsp1Model.findAll({
        include: [
          {
            model: bsp1ProductionCenterModel,
            where: {
              production_center_id: req.body.loginedUserid.id,
            },
            attributes: [],
          }
        ],
        attributes: [
          [sequelize.literal("Sum(bsp1_production_centers.quantity_of_seed_produced)"), "allocate_qnt"]
        ],
        where: { [Op.and]: filterData1 ? filterData1 : [] },
        raw: true
      });

      //production qnt data
      let producationQntData = await lotNumberModel.findAll({
        include: [
          {
            model: seedTestingReportsModel,
            where: {
              is_report_pass: true,
            },
            attributes: [],
          }
        ],
        attributes: [
          [sequelize.literal("Sum(lot_number_creations.lot_number_size)"), "total_producton"]
        ],

        where: {
          user_id: req.body.loginedUserid.id,
          [Op.and]: filterData1 ? filterData1 : []
        },
        raw: true
      });

      //lifting qnt data
      let liftingQntData = await generateBills.findAll({
        attributes: [
          [sequelize.literal("Sum(generate_bills.total_quantity)"), "total_lifting"]
        ],
        where: {
          production_center_id: req.body.loginedUserid.id,
          [Op.and]: filterData1 ? filterData1 : []
        },
        raw: true
      });
      // lifting Quantity data//
      let liftingQtyData = await bsp5bModel.findAll({
        attributes: [
          [sequelize.fn('SUM', sequelize.col('bsp_5_b.lifting_quantity')), 'lifting_quantity'],
        ],
        where: {
          production_center_id: req.body.loginedUserid.id,
          [Op.and]: filterData1 ? filterData1 : []
        },
        raw: true
      })
      let finalCardData = [
        { 'total_allocation': allocationQntData && allocationQntData[0] && allocationQntData[0].allocate_qnt ? parseFloat(allocationQntData[0].allocate_qnt) : 0 },
        { 'total_production': producationQntData && producationQntData[0] && producationQntData[0].total_producton ? parseFloat(producationQntData[0].total_producton) : 0 },
        { 'total_lifting': liftingQntData && liftingQntData[0] && liftingQntData[0].total_lifting ? parseFloat(liftingQntData[0].total_lifting) : 0 },
        { 'total_lifting_second': liftingQtyData && liftingQtyData[0] && liftingQtyData[0].lifting_quantity ? parseFloat(liftingQtyData[0].lifting_quantity) : 0 },
        { 'total_unlifting': parseFloat(producationQntData && producationQntData[0] && producationQntData[0].total_producton ? producationQntData[0].total_producton : 0) - parseFloat(liftingQtyData && liftingQtyData[0] && liftingQtyData[0].lifting_quantity ? liftingQtyData[0].lifting_quantity : 0) }
      ]

      return response(res, status.DATA_AVAILABLE, 200, finalCardData);
    } catch (error) {
      return response(res, status.DATA_NOT_SAVE, 500, error);
    }
  }

  static getBspcChartAllocateData = async (req, res) => {
    let data = {};
    try {
      const user_id = req.body.loginedUserid.id
      console.log(user_id, 'user_iduser_id')
      // const user_id = 675
      let seasonData;
      if (req.body && req.body.search && req.body.search.season) {
        seasonData = {
          season: {
            [Op.eq]: req.body.search.season
          }
        };
      }
      let filterData1 = [];
      if (req.body.search) {
        if (req.body.search.crop_type) {
          filterData1.push({
            crop_code: {
              [Op.like]: req.body.search.crop_type + '%'
            }
          })
        }
        if (req.body.search.year) {
          filterData1.push({
            year: {
              [Op.eq]: req.body.search.year
            },
          })

        }
        if (req.body.search.season) {
          filterData1.push({
            season: {
              [Op.eq]: req.body.search.season
            }
          });
        }
        if (req.body.search.crop_code && req.body.search.crop_code.length > 0) {
          filterData1.push({
            crop_code: {
              [Op.in]: req.body.search.crop_code
            },

          })
        }
      }
      // let cropCodeArray = [];
      //allocation qnt data
      let data = await bsp1Model.findAll({
        include: [
          {
            model: bsp1ProductionCenterModel,
            attributes: [],
            where: {
              production_center_id: user_id
            }
            // production_center_id_id: user_id,

          },
          {
            model: cropModel,
            attributes: []
          }
        ],
        // order: [[sequelize.col('bsp1_production_centers.quantity_of_seed_produced'),"DESC"]],
        attributes: [
          //  
          [sequelize.fn('DISTINCT', sequelize.col('bsp_1s.crop_code')), 'crop_code'],
          [sequelize.col('m_crop.crop_name'), 'crop_name'],
          [sequelize.literal("Sum(bsp1_production_centers.quantity_of_seed_produced)"), "allocate_qnt"]
        ],
        // order:[[sequelize.col("bsp1_production_centers.quantity_of_seed_produced"),"DESC"]],
        group: [
          [sequelize.col('bsp_1s.crop_code'), 'crop_code'],
          [sequelize.col('m_crop.crop_name'), 'crop_name'],
          // [sequelize.literal("(bsp1_production_centers.quantity_of_seed_produced)"), "allocate_qnt"]

        ],

        where: {
          [Op.and]: filterData1 ? filterData1 : [],
          // icar_freeze:1
        },

        raw: true
      });

      let cropCodeArray = [];
      data.forEach(ele => {
        if (ele && ele.crop_code) {
          cropCodeArray.push(ele.crop_code);
        }
      });

      //production
      let productionData;
      let liftingQntData;
      let liftingQntDataSecond;
      if (cropCodeArray && cropCodeArray.length > 0 && req.body.search && req.body.search.crop_type) {
        productionData = await lotNumberModel.findAll({
          include: [
            {
              model: seedTestingReportsModel,
              attributes: [],
              where: {
                is_report_pass: true
              }
            },
          ],
          attributes: [
            [sequelize.fn('DISTINCT', sequelize.col('lot_number_creations.crop_code')), 'crop_code'],
            [sequelize.literal("Sum(lot_number_creations.lot_number_size)"), "production"],
          ],
          where: {
            [Op.and]: {
              crop_code: {
                [Op.like]: req.body.search.crop_type + '%'
              },

              crop_code: {
                [Op.in]: cropCodeArray
              },
              year: {
                [Op.eq]: req.body.search.year
              },
              ...seasonData,
              user_id: user_id
              // id:req.body.loginedUserid.user_id
            }
          },
          raw: true,
          group: [[sequelize.col('lot_number_creations.crop_code')]],
        });
      }

      if (cropCodeArray && cropCodeArray.length > 0 && req.body.search && req.body.search.crop_type) {
        //lifting qnt data
        liftingQntData = await generateBills.findAll({
          attributes: [
            [sequelize.literal("(generate_bills.crop_code)"), "crop_code"],
            [sequelize.literal("Sum(generate_bills.total_quantity)"), "total_lifting"]
          ],
          group: [
            [sequelize.literal("(generate_bills.crop_code)"), "crop_code"]
          ],
          where: {
            [Op.and]: {
              crop_code: {
                [Op.like]: req.body.search.crop_type + '%'
              },

              crop_code: {
                [Op.in]: cropCodeArray
              },
              year: {
                [Op.eq]: req.body.search.year
              },

              production_center_id: {
                [Op.eq]: user_id
              },
              ...seasonData,
              // id:req.body.loginedUserid.user_id
            }
          },
          raw: true
        });
      }
      if (cropCodeArray && cropCodeArray.length > 0 && req.body.search && req.body.search.crop_type) {
        //lifting qnt data
        liftingQntDataSecond = await bsp5bModel.findAll({
          attributes: [
            [sequelize.literal("(bsp_5_b.crop_code)"), "crop_code"],
            [sequelize.literal("Sum(bsp_5_b.lifting_quantity)"), "lifting_quantity"]
          ],
          group: [
            [sequelize.literal("(bsp_5_b.crop_code)"), "crop_code"]
          ],
          where: {
            [Op.and]: {
              crop_code: {
                [Op.like]: req.body.search.crop_type + '%'
              },

              crop_code: {
                [Op.in]: cropCodeArray
              },
              year: {
                [Op.eq]: req.body.search.year
              },

              production_center_id: {
                [Op.eq]: user_id
              },
              ...seasonData,
              // id:req.body.loginedUserid.user_id
            }
          },
          raw: true
        });
      }

      let filterData = [];
      if (req.body.search) {
        if (req.body.search.crop_type) {
          filterData.push({
            crop_code: {
              [Op.like]: req.body.search.crop_type + '%'
            }
          })
        }
        if (req.body.search.year) {
          filterData.push({
            year: {
              [Op.eq]: req.body.search.year
            },
          })

        }
        if (req.body.search.season) {
          filterData.push({
            season: {
              [Op.eq]: req.body.search.season
            }
          });
        }

      }
      if (cropCodeArray && cropCodeArray.length > 0) {
        filterData.push({
          crop_code: {
            [Op.in]: cropCodeArray
          },

        })
      }
      if (productionData && productionData !== undefined && productionData.length > 0) {
        productionData.forEach(item => {
          data.forEach((elem, i) => {
            if (elem.crop_code == item.crop_code) {
              data[i].production = item && item.production ? parseFloat(item.production) : 0
            }

          })
        })
      }
      if (liftingQntDataSecond && liftingQntDataSecond !== undefined && liftingQntDataSecond.length > 0) {
        liftingQntDataSecond.forEach(item => {
          data.forEach((elem, i) => {
            if (elem.crop_code == item.crop_code) {
              data[i].lifting_qty_second = item && item.lifting_quantity ? parseFloat(item.lifting_quantity) : 0
            }

          })
        })
      }
      // data.forEach((ele, i) => {
      //   data[i].production = 0
      //   if (productionData && productionData !== undefined && productionData.length > 0) {
      //     productionData.forEach((elem, index) => {
      //       if (ele.crop_code == elem.crop_code) {
      //         data[index].production = elem.production
      //       }
      //     })
      //   }
      // })
      data.forEach((ele, i) => {
        data[i].lifting = 0
        if (liftingQntData && liftingQntData !== undefined && liftingQntData.length > 0) {
          liftingQntData.forEach((elem, index) => {
            if (ele.crop_code == elem.crop_code) {
              data[index].lifting = elem.total_lifting ? elem.total_lifting : 0
            }
          })
        }
      })
      data.forEach((ele, i) => {
        data[i].unlifting = 0;
        if (liftingQntData && liftingQntData !== undefined && liftingQntData.length > 0) {
          if (productionData && productionData !== undefined && productionData.length > 0) {
            liftingQntData.forEach((elem, index) => {
              productionData.forEach((elem1, index) => {
                if (elem1.variety_id == elem.variety_id) {
                  data[index].unlifting = (elem1 && elem1.production ? elem1.production : 0) - (elem && elem.total_lifting ? elem.total_lifting : 0)
                }
              })
            })
          }
        }
      })
      return response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      return response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static getBspcChartAllocateDataVariety = async (req, res) => {
    let data = {};
    try {
      const user_id = req.body.loginedUserid.id
      let seasonData;
      if (req.body && req.body.search && req.body.search.season) {
        seasonData = {
          season: {
            [Op.eq]: req.body.search.season
          }
        };
      }
      let filterData = [];
      if (req.body.search) {
        if (req.body.search.crop_type) {
          filterData.push({
            crop_code: {
              [Op.like]: req.body.search.crop_type + '%'
            }
          })
        }
        if (req.body.search.year) {
          filterData.push({
            year: {
              [Op.eq]: req.body.search.year
            },
          })

        }
        if (req.body.search.season) {
          filterData.push({
            season: {
              [Op.eq]: req.body.search.season
            }
          });
        }
        if (req.body.search.crop_code) {
          filterData.push({
            crop_code: {
              [Op.eq]: req.body.search.crop_code
            },

          })
        }
      }
      let cropCodeArray = [];
      let data = await bsp1Model.findAll({
        include: [
          {
            model: bsp1ProductionCenterModel,
            attributes: [],
            where: {
              production_center_id: req.body.loginedUserid.id
            }
            // production_center_id_id: user_id,
          },
          {
            model: varietyModel,
            attributes: []
          }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('bsp_1s.variety_id')), 'variety_id'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [sequelize.literal("Sum(bsp1_production_centers.quantity_of_seed_produced)"), "allocate_qnt"]
        ],
        group: [
          [sequelize.col('bsp_1s.variety_id'), 'variety_id'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
        ],
        where: { [Op.and]: filterData ? filterData : [] },
        raw: true
      });

      if (data) {
        data.forEach(ele => {
          if (ele && ele.variety_id) {
            cropCodeArray.push(ele.variety_id);
          }
        });
      }


      //production
      let productionData;
      let liftingQntData;
      if (cropCodeArray && cropCodeArray.length > 0 && req.body.search && req.body.search.crop_type) {

        productionData = await lotNumberModel.findAll({
          include: [
            {
              model: seedTestingReportsModel,
              attributes: [],
              where: {
                is_report_pass: true
              }
            },
          ],
          attributes: [
            [sequelize.fn('DISTINCT', sequelize.col('lot_number_creations.variety_id')), 'variety_id'],
            [sequelize.literal("Sum(lot_number_creations.lot_number_size)"), "production"],
          ],
          where: {
            [Op.and]: {
              crop_code: {
                [Op.like]: req.body.search.crop_type + '%'
              },

              variety_id: {
                [Op.in]: cropCodeArray
              },
              year: {
                [Op.eq]: req.body.search.year
              },
              ...seasonData,
              user_id: user_id
            }
          },
          raw: true,
          group: [[sequelize.col('lot_number_creations.variety_id')]],
        });
      }
      if (req.body.search && req.body.search.crop_type) {

        productionData = await lotNumberModel.findAll({
          include: [
            {
              model: seedTestingReportsModel,
              attributes: [],
              where: {
                is_report_pass: true
              }
            },
          ],
          attributes: [
            [sequelize.fn('DISTINCT', sequelize.col('lot_number_creations.variety_id')), 'variety_id'],
            [sequelize.literal("Sum(lot_number_creations.lot_number_size)"), "production"],
          ],
          where: {
            [Op.and]: {
              crop_code: {
                [Op.like]: req.body.search.crop_type + '%'
              },

              // variety_id: {
              //   [Op.in]: cropCodeArray
              // },
              year: {
                [Op.eq]: req.body.search.year
              },
              ...seasonData,
              user_id: user_id
            }
          },
          raw: true,
          group: [[sequelize.col('lot_number_creations.variety_id')]],
        });
      }
      if (req.body.search && req.body.search.crop_code) {

        productionData = await lotNumberModel.findAll({
          include: [
            {
              model: seedTestingReportsModel,
              attributes: [],
              where: {
                is_report_pass: true
              }
            },
          ],
          attributes: [
            [sequelize.fn('DISTINCT', sequelize.col('lot_number_creations.variety_id')), 'variety_id'],
            [sequelize.literal("Sum(lot_number_creations.lot_number_size)"), "production"],
          ],
          where: {
            [Op.and]: {
              crop_code: {
                [Op.eq]: req.body.search.crop_code
              },

              // variety_id: {
              //   [Op.in]: cropCodeArray
              // },
              year: {
                [Op.eq]: req.body.search.year
              },
              ...seasonData,
              user_id: user_id
            }
          },
          raw: true,
          group: [[sequelize.col('lot_number_creations.variety_id')]],
        });
      }

      if (cropCodeArray && cropCodeArray.length > 0 && req.body.search && req.body.search.crop_type) {

        //lifting qnt data
        liftingQntData = await generateBills.findAll({
          attributes: [
            [sequelize.literal("(generate_bills.variety_id)"), "variety_id"],
            [sequelize.literal("Sum(generate_bills.total_quantity)"), "total_lifting"]
          ],
          group: [
            [sequelize.literal("(generate_bills.variety_id)"), "variety_id"]
          ],
          where: {
            [Op.and]: {
              crop_code: {
                [Op.like]: req.body.search.crop_type + '%'
              },

              variety_id: {
                [Op.in]: cropCodeArray
              },
              year: {
                [Op.eq]: req.body.search.year
              },

              production_center_id: {
                [Op.eq]: user_id
              },
              ...seasonData
            }
          },
          raw: true
        });
      }
      if (req.body.search && req.body.search.crop_type) {

        //lifting qnt data
        liftingQntData = await generateBills.findAll({
          attributes: [
            [sequelize.literal("(generate_bills.variety_id)"), "variety_id"],
            [sequelize.literal("Sum(generate_bills.total_quantity)"), "total_lifting"]
          ],
          group: [
            [sequelize.literal("(generate_bills.variety_id)"), "variety_id"]
          ],
          where: {
            [Op.and]: {
              crop_code: {
                [Op.like]: req.body.search.crop_type + '%'
              },

              // variety_id: {
              //   [Op.in]: cropCodeArray
              // },
              year: {
                [Op.eq]: req.body.search.year
              },

              production_center_id: {
                [Op.eq]: user_id
              },
              ...seasonData
            }
          },
          raw: true
        });
      }
      if (req.body.search && req.body.search.crop_code) {

        //lifting qnt data
        liftingQntData = await generateBills.findAll({
          attributes: [
            [sequelize.literal("(generate_bills.variety_id)"), "variety_id"],
            [sequelize.literal("Sum(generate_bills.total_quantity)"), "total_lifting"]
          ],
          group: [
            [sequelize.literal("(generate_bills.variety_id)"), "variety_id"]
          ],
          where: {
            [Op.and]: {
              crop_code: {
                [Op.eq]: req.body.search.crop_code
              },

              // variety_id: {
              //   [Op.in]: cropCodeArray
              // },
              year: {
                [Op.eq]: req.body.search.year
              },

              production_center_id: {
                [Op.eq]: user_id
              },
              ...seasonData
            }
          },
          raw: true
        });
      }


      // lifting qty ////
      let liftingQtySecond;
      if (cropCodeArray && cropCodeArray.length > 0 && req.body.search && req.body.search.crop_type) {

        //lifting qnt data
        liftingQtySecond = await bsp5bModel.findAll({
          attributes: [
            [sequelize.literal("(bsp_5_b.variety_id)"), "variety_id"],
            [sequelize.literal("Sum(bsp_5_b.lifting_quantity)"), "lifting_quantity"]
          ],
          group: [
            [sequelize.literal("(bsp_5_b.variety_id)"), "variety_id"]
          ],
          where: {
            [Op.and]: {
              crop_code: {
                [Op.like]: req.body.search.crop_type + '%'
              },

              variety_id: {
                [Op.in]: cropCodeArray
              },
              year: {
                [Op.eq]: req.body.search.year
              },

              production_center_id: {
                [Op.eq]: user_id
              },
              ...seasonData,
              production_center_id: user_id
            }
          },
          raw: true
        });
      }
      if (req.body.search && req.body.search.crop_type) {

        //lifting qnt data
        liftingQtySecond = await bsp5bModel.findAll({
          attributes: [
            [sequelize.literal("(bsp_5_b.variety_id)"), "variety_id"],
            [sequelize.literal("Sum(bsp_5_b.lifting_quantity)"), "lifting_quantity"]
          ],
          group: [
            [sequelize.literal("(bsp_5_b.variety_id)"), "variety_id"]
          ],
          where: {
            [Op.and]: {
              crop_code: {
                [Op.like]: req.body.search.crop_type + '%'
              },

              // variety_id: {
              //   [Op.in]: cropCodeArray
              // },
              year: {
                [Op.eq]: req.body.search.year
              },

              production_center_id: {
                [Op.eq]: user_id
              },
              ...seasonData,
              production_center_id: user_id
            }
          },
          raw: true
        });
      }
      if (req.body.search && req.body.search.crop_code) {

        //lifting qnt data
        liftingQtySecond = await bsp5bModel.findAll({
          attributes: [
            [sequelize.literal("(bsp_5_b.variety_id)"), "variety_id"],
            [sequelize.literal("Sum(bsp_5_b.lifting_quantity)"), "lifting_quantity"]
          ],
          group: [
            [sequelize.literal("(bsp_5_b.variety_id)"), "variety_id"]
          ],
          where: {
            [Op.and]: {
              crop_code: {
                [Op.eq]: req.body.search.crop_code
              },

              // variety_id: {
              //   [Op.in]: cropCodeArray
              // },
              year: {
                [Op.eq]: req.body.search.year
              },

              production_center_id: {
                [Op.eq]: user_id
              },
              ...seasonData,
              production_center_id: user_id
            }
          },
          raw: true
        });
      }

      productionData.forEach(item => [
        data.forEach((ele, i) => {
          if (ele.variety_id == item.variety_id) {

            data[i].production = item && item.production ? item.production : 0;
          }
        })
      ])

      if (liftingQntData && liftingQntData !== undefined && liftingQntData.length > 0) {

        liftingQntData.forEach(item => [
          data.forEach((ele, i) => {
            if (ele.variety_id == item.variety_id) {
              data[i].lifting = item && item.allocated ? item.allocated : 0;
            }

          })
        ])
      }
      console.log(liftingQtySecond, 'liftingQtySecondliftingQtySecond')
      if (liftingQtySecond && liftingQtySecond !== undefined && liftingQtySecond.length > 0) {

        liftingQtySecond.forEach(item => [
          data.forEach((ele, i) => {
            if (ele.variety_id == item.variety_id) {

              data[i].lifting_second = item && item.lifting_quantity ? item.lifting_quantity : 0;
            }

          })
        ])
      }


      return response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      return response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static getBspcChartAllAllocater = async (req, res) => {
    let data = {};
    try {
      let condition = {
        include: [
          {
            model: bsp1ProductionCenterModel,
            attributes: [],
            include: [
              {
                model: userModel,
                attributes: [],
                include: [
                  {
                    model: agencyDetailModel,
                    attributes: [],
                    include: [
                      {
                        model: stateModel,
                        attributes: []
                      }
                    ]
                  }
                ]
              }
            ]
          },
        ],
        attributes: [
          [sequelize.fn("DISTINCT", sequelize.col("bsp1_production_centers->user.name")), "user_name"],
          [sequelize.col("bsp1_production_centers->user->agency_detail->m_state.state_name"), "name"],

          [sequelize.literal("Sum(bsp1_production_centers.quantity_of_seed_produced)"), "allocate_qnt"],
          [sequelize.col("bsp1_production_centers->user.id"), "id"],
        ],
        group: [
          [sequelize.col("bsp1_production_centers->user.name"), "user_name"],
          [sequelize.col("bsp1_production_centers->user->agency_detail->m_state.state_name"), "name"],
          [sequelize.col("bsp1_production_centers->user.id"), "id"],
        ],
        where: {
          crop_code: {
            [Op.like]: req.body.search.crop_type + '%'
          },
        },
        raw: true
      };
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
      }
      data = await bsp1Model.findAll(condition);

      let seasonData;
      if (req.body.search.season) {
        seasonData = {
          season: {
            [Op.eq]: req.body.search.season
          }
        };
      }
      let cropCodeData;
      let cropCodeArray = [];
      if (req.body.search.crop_code && req.body.search.crop_code != undefined && req.body.search.crop_code.length > 0) {
        cropCodeData = {
          crop_code: {
            [Op.in]: cropCodeArray
          },
        }
      }

      let userIdArray = [];
      let user_id;
      let breeder_production_center_id;
      let userId;
      console.log('data====', data)
      data.forEach(item => {
        userIdArray.push(item.id);
      });

      if (userIdArray.length != undefined && userIdArray.length > 0) {
        user_id = {
          id: {
            [Op.in]: userIdArray
          },
        }
        breeder_production_center_id = {
          breeder_production_center_id: {
            [Op.in]: userIdArray
          }
        }
        userId = {
          user_id: {
            [Op.in]: userIdArray
          }
        }
      }

      let productionData = await lotNumberModel.findAll({
        include: [
          {
            model: seedTestingReportsModel,
            attributes: [],
            where: {
              is_report_pass: true
            }
          },
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('lot_number_creations.breeder_production_center_id')), 'id'],
          [sequelize.literal("Sum(lot_number_creations.lot_number_size)"), "production"],
        ],
        where: {
          [Op.and]: {
            crop_code: {
              [Op.like]: req.body.search.crop_type + '%'
            },

            crop_code: {
              [Op.in]: cropCodeArray
            },
            year: {
              [Op.eq]: req.body.search.year
            },
            ...seasonData,
            ...breeder_production_center_id
          }
        },
        raw: true,
        group: [[sequelize.col('lot_number_creations.breeder_production_center_id')]],
      });

      data.forEach((ele, i) => {
        data[i].production = 0
        productionData.forEach((elem, index) => {
          if (ele.id == elem.id) {
            data[index].production = elem.production ? elem.production : 0;
          }
        })
      });

      let liftingQntData = await generateBills.findAll({
        attributes: [
          [sequelize.literal("(generate_bills.user_id)"), "id"],
          [sequelize.literal("Sum(generate_bills.total_quantity)"), "total_lifting"]
        ],
        group: [
          [sequelize.literal("(generate_bills.user_id)"), "id"]
        ],
        where: {
          [Op.and]: {
            crop_code: {
              [Op.like]: req.body.search.crop_type + '%'
            },
            year: {
              [Op.eq]: req.body.search.year
            },
            ...seasonData,
            ...userId
          }
        },
        raw: true
      });

      data.forEach((ele, i) => {
        data[i].lifting = 0
        liftingQntData.forEach((elem, index) => {
          if (ele.id == elem.id) {
            data[index].lifting = elem.total_lifting ? elem.total_lifting : 0;
          }
        })
      });
      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error);
      return response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }


  static getBspcChartAllAllocaterSecond = async (req, res) => {
    let data = {};
    try {
      let condition = {}
      if (req.body.search && req.body.search.crop_type) {
        condition = {
          include: [
            {
              model: indentOfBreederseedModel,
              where: {
                // icar_freeze: 1
              },
              include: [
                {
                  model: userModel,
                  attributes: []
                }
              ],
              attributes: []
            },
            {
              model: bsp1ProductionCenterModel,
              where: {
                production_center_id: req.body.loginedUserid.id,
              },
              attributes: []
            }
          ],
          attributes: [
            [sequelize.fn("DISTINCT", sequelize.col("indent_of_breederseed.user_id")), "user_id"],
            // [sequelize.fn("DISTINCT", sequelize.col("indent_of_breederseed.indent_quantity")), "indent_quantity"],
            [sequelize.col("indent_of_breederseed.id"), 'id'],
            [sequelize.col("indent_of_breederseed.indent_quantity"), 'indent_quantity'],
            [sequelize.col("bsp1_production_centers.production_center_id"), "production_center_id"],
            [sequelize.col('indent_of_breederseed->user.name'), 'name'],
            [sequelize.col('bsp_1s.crop_code'), 'crop_code'],
            [sequelize.col('bsp1_production_centers.quantity_of_seed_produced'), 'allocate_qnt'],
            // [sequelize.literal("Sum(bsp1_production_centers.quantity_of_seed_produced)"), "allocate_qnt"

          ],

          where: {
            crop_code: {
              [Op.like]: req.body.search.crop_type + '%'
            },
            // production_center_id:req.body.loginedUserid.id,
            // icar_freeze: 1
          },
          raw: true
        };
      } else {
        condition = {
          include: [
            {
              model: indentOfBreederseedModel,
              where: {
                // icar_freeze: 1
              },
              include: [
                {
                  model: userModel,
                  attributes: []
                }
              ],
              attributes: []
            },
            {
              model: bsp1ProductionCenterModel,
              where: {
                production_center_id: req.body.loginedUserid.id,
              },
              attributes: []
            }
          ],

          attributes: [
            [sequelize.fn("DISTINCT", sequelize.col("indent_of_breederseed.user_id")), "user_id"],
            // [sequelize.fn("DISTINCT", sequelize.col("indent_of_breederseed.indent_quantity")), "indent_quantity"],
            [sequelize.col("indent_of_breederseed.id"), 'id'],
            [sequelize.col("indent_of_breederseed.indent_quantity"), 'indent_quantity'],
            [sequelize.col("bsp1_production_centers.production_center_id"), "production_center_id"],
            [sequelize.col('indent_of_breederseed->user.name'), 'name'],
            [sequelize.col('bsp_1s.crop_code'), 'crop_code'],
            [sequelize.col('bsp1_production_centers.quantity_of_seed_produced'), 'allocate_qnt'],


          ],
          where: {
            // production_center_id:req.body.loginedUserid.id,
          },
          raw: true
        };
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
      }
      data = await bsp1Model.findAll(condition);
      let seasonData;
      if (req.body.search.season) {
        seasonData = {
          season: {
            [Op.eq]: req.body.search.season
          }
        };
      }
      let cropCodeData;
      let cropCodeArray = [];
      if (req.body.search.crop_code && req.body.search.crop_code != undefined && req.body.search.crop_code.length > 0) {
        cropCodeData = {
          crop_code: {
            [Op.in]: cropCodeArray
          },
        }
      }

      let userIdArray = [];
      let user_id;
      let breeder_production_center_id;
      let userId;
      data.forEach(item => {
        userIdArray.push(item && item.production_center_id ? item.production_center_id : '');
      });
      userIdArray = [...new Set(userIdArray)]
      if (userIdArray.length != undefined && userIdArray.length > 0) {
        user_id = {
          id: {
            [Op.in]: userIdArray
          },
        }
        breeder_production_center_id = {
          breeder_production_center_id: {
            [Op.in]: userIdArray
          }
        }
        userId = {
          user_id: {
            [Op.in]: userIdArray
          }
        }
      }

      let liftingQntData = await generateBills.findAll({
        attributes: [
          [sequelize.col('generate_bills.indent_of_breederseed_id'), 'indent_of_breederseed_id'],
          // [sequelize.literal("(generate_bills.indent_of_breederseed_id)"), "indent_of_breederseed_id"],
          [sequelize.literal("Sum(generate_bills.total_quantity)"), "total_lifting"]
        ],
        group: [
          [sequelize.literal("(generate_bills.indent_of_breederseed_id)"), "indent_of_breederseed_id"]
        ],
        where: {
          [Op.and]: {
            crop_code: {
              [Op.like]: req.body.search.crop_type + '%'
            },
            year: {
              [Op.eq]: req.body.search.year
            },
            ...seasonData,
            ...userId
          }
        },
        raw: true
      });

      liftingQntData.forEach(ele => {
        data.forEach((elem, i) => {
          if (elem.id == ele.indent_of_breederseed_id) {
            data[i].lifting = ele && ele.total_lifting ? parseFloat(ele.total_lifting) : 0
          }
          else {
            data[i].lifting = 0
          }

        })
      })
      let liftingQntDataSecond = await bsp5bModel.findAll({
        include: [
          {
            model: indentOfBreederseedModel,
            attributes: []
          }
        ],
        attributes: [
          [sequelize.col('bsp_5_b.indent_of_breederseed_id'), 'indent_of_breederseed_id'],
          [sequelize.col('bsp_5_b.lifting_quantity'), 'lifting_quantity'],

          [sequelize.col('indent_of_breederseed.user_id'), 'user_id'],

        ],

        where: {
          [Op.and]: {
            crop_code: {
              [Op.like]: req.body.search.crop_type + '%'
            },
            year: {
              [Op.eq]: req.body.search.year
            },
            ...seasonData,
            user_id: req.body.loginedUserid.id
            // ...userId
          }
        },
        raw: true
      });
      let liftingQntDataSecondDatas;
      if (liftingQntDataSecond && liftingQntDataSecond.length > 0) {
        liftingQntDataSecondDatas = productiohelper.sumofDuplicateDataSecondIndentliftiedQty(liftingQntDataSecond, 'indent_of_breederseed_id')
      }
      if (liftingQntDataSecondDatas && liftingQntDataSecondDatas.length > 0) {
        liftingQntDataSecondDatas = productiohelper.sumofDuplicateDataSecondIndentliftiedQty(liftingQntDataSecond, 'user_id')
      }
      let removeData = productiohelper.removeDuplicates(data, 'id');
      let sumofDuplicateDataSecond = productiohelper.sumofDuplicateDataSecondIndentQty(removeData, 'user_id')

      let sumofDuplicateData = productiohelper.sumofDuplicateDataSecondmulitple(data, 'user_id')
      if (sumofDuplicateData && sumofDuplicateData.length > 0) {
        if (sumofDuplicateDataSecond && sumofDuplicateDataSecond.length > 0) {
          sumofDuplicateDataSecond.forEach(ele => {
            sumofDuplicateData.forEach((item, i) => {
              if (item.user_id == ele.user_id) {

                sumofDuplicateData[i].indent_quantity = ele && ele.indent_quantity ? parseFloat(ele.indent_quantity) : 0
              }
            })
          })
        }
      }

      if (sumofDuplicateData && sumofDuplicateData.length > 0) {
        if (liftingQntDataSecondDatas && liftingQntDataSecondDatas.length > 0) {
          liftingQntDataSecondDatas.forEach(ele => {
            sumofDuplicateData.forEach((item, i) => {
              if (item.user_id == ele.user_id) {
                sumofDuplicateData[i].lifting_qty = ele && ele.lifting_quantity ? parseFloat(ele.lifting_quantity) : 0
              }
            })
          })
        }
      }
      let filterData = [];
      if (req.body.search) {
        if (req.body.search.crop_type) {
          filterData.push({
            crop_code: {
              [Op.like]: req.body.search.crop_type + '%'
            }
          })
        }
        if (req.body.search.year) {
          filterData.push({
            year: {
              [Op.eq]: req.body.search.year
            },
          })

        }
        if (req.body.search.season) {
          filterData.push({
            season: {
              [Op.eq]: req.body.search.season
            }
          });
        }
        if (req.body.search.crop_code) {
          filterData.push({
            crop_code: {
              [Op.in]: req.body.search.crop_code
            }
          });
        }

      }
      let alloctedData;
      alloctedData = await db.allocationToIndentorLiftingSeed.findAll({
        include: [
          {
            model: allocationToIndentorProductionCenterSeed,
            attributes: [],
            where: {
              production_center_id: req.body.loginedUserid.id

            },
            // attributes:[]
          }
          // {
          //   model:bsp1ProductionCenterModel,
          //   attributes:[],

          // }

        ],
        attributes: [
          [sequelize.col('allocation_to_indentor_for_lifting_seed_production_cnter.qty'), 'qty'],
          [sequelize.col('allocation_to_indentor_for_lifting_seed_production_cnter.indent_of_breeder_id'), 'indent_of_breeder_id'],
        ],
        where: {
          [Op.and]: filterData ? filterData : []
        },
        raw: true
      })
      let alloctedDataSum;
      if (alloctedData && alloctedData.length > 0) {
        console.log(alloctedData, 'alloctedData')
        alloctedDataSum = productiohelper.calculateSumOfDupliccatesAllocatedQtySecond(alloctedData, 'indent_of_breeder_id')
      }
      if (alloctedDataSum && alloctedDataSum.length > 0) {
        if (sumofDuplicateData && sumofDuplicateData.length > 0) {
          alloctedDataSum.forEach(item => {
            console.log(item, 'qty')
            sumofDuplicateData.forEach((el, i) => {
              if (el.user_id == item.indent_of_breeder_id) {
                sumofDuplicateData[i].allocatedQtySecond = item && item.qty ? parseFloat(item.qty) : 0
              }
            })
          })
        }
      }
      response(res, status.DATA_AVAILABLE, 200, sumofDuplicateData)
    } catch (error) {
      console.log(error);
      return response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static getBspcChartAllAllocaterCrop = async (req, res) => {
    let data = {};
    try {
      let user_idData;
      if (req.body && req.body.search && req.body.search.user_id) {
        user_idData = {
          user_id: { [Op.eq]: req.body.search.user_id }
        }
      }

      let condition = {
        include: [
          {
            model: bsp1ProductionCenterModel,
            where: {
              production_center_id: req.body.loginedUserid.id
            },
            attributes: [],
            include: [
              {
                model: userModel,
                attributes: []
              }
            ],

            // where: {
            //   [Op.and]:
            //   {
            //     ...productionCcenterId
            //   }
            // }
          },
          {
            model: indentOfBreederseedModel,
            attributes: [],
            where: {
              [Op.and]:
              {
                ...user_idData
              }
            }
          },
          {
            model: cropModel,
            attributes: []
          }
        ],
        attributes: [
          [sequelize.fn("DISTINCT", sequelize.col("bsp_1s.crop_code")), "crop_code"],
          [sequelize.col("m_crop.crop_name"), "crop_name"],
          // [sequelize.col("indent_of_breederseed.indent_quantity"),'indent_quantity'],
          [sequelize.literal("Sum(bsp1_production_centers.quantity_of_seed_produced)"), "allocate_qnt"],
        ],
        group: [
          [sequelize.col("bsp_1s.crop_code"), "crop_code"],
          [sequelize.col("m_crop.crop_name"), "crop_name"],
        ],
        where: {
          crop_code: {
            [Op.like]: req.body.search.crop_type + '%'
          },

        },
        raw: true
      };
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
      }
      data = await bsp1Model.findAll(condition);

      let seasonData;
      if (req.body.search.season) {
        seasonData = {
          season: {
            [Op.eq]: req.body.search.season
          }
        };
      }
      let cropCodeData;
      let cropCodeArray = [];
      if (req.body.search.crop_code && req.body.search.crop_code != undefined && req.body.search.crop_code.length > 0) {
        cropCodeData = {
          crop_code: {
            [Op.in]: cropCodeArray
          },
        }
      }

      let userIdArray = [];
      let user_id;
      let breeder_production_center_id;
      let userId;
      if (data) {
        data.forEach(item => {
          userIdArray.push(item.id);
        });
      }

      if (userIdArray.length != undefined && userIdArray.length > 0) {
        user_id = {
          id: {
            [Op.in]: userIdArray
          },
        }
        breeder_production_center_id = {
          breeder_production_center_id: {
            [Op.in]: userIdArray
          }
        }
        userId = {
          user_id: {
            [Op.in]: userIdArray
          }
        }
      }
      let cropTypeCode;
      if (req.body.search.crop_type) {
        cropTypeCode = {
          crop_code: {
            [Op.like]: req.body.search.crop_type + '%'
          },
        }
      }
      let filterData1 = [];
      if (req.body.search) {
        if (req.body.search.crop_type) {
          filterData1.push({
            crop_code: {
              [Op.like]: req.body.search.crop_type + '%'
            }
          })
        }
        if (req.body.search.year) {
          filterData1.push({
            year: {
              [Op.eq]: req.body.search.year
            },
          })

        }
        if (req.body.search.season) {
          filterData1.push({
            season: {
              [Op.eq]: req.body.search.season
            }
          });
        }


      }

      // let cropCodeData;
      // let cropCodeArray = [];
      if (req.body.search.crop_code && req.body.search.crop_code != undefined && req.body.search.crop_code.length > 0) {
        // cropCodeData = {
        //   crop_code: {
        //     [Op.in]: cropCodeArray
        //   },
        // }
        filterData1.push({
          crop_code: {
            [Op.in]: req.body.search.crop_code
          },
        })

      }


      let condition2 = {
        include: [
          {
            model: bsp1ProductionCenterModel,
            where: {
              production_center_id: req.body.loginedUserid.id
            },
            attributes: [],
            include: [
              {
                model: userModel,
                attributes: []
              }
            ],

            // where: {
            //   [Op.and]:
            //   {
            //     ...productionCcenterId
            //   }
            // }
          },
          {
            model: indentOfBreederseedModel,
            attributes: [],
            where: {
              [Op.and]:
              {
                ...user_idData
              }
            }
          },
          {
            model: cropModel,
            attributes: []
          }
        ],
        attributes: [
          [sequelize.col("indent_of_breederseed.id"), 'id'],
          // [sequelize.fn("DISTINCT", sequelize.col("bsp_1s.crop_code")), "crop_code"],
          // [sequelize.col("m_crop.crop_name"), "crop_name"],
          [sequelize.col("bsp_1s.crop_code"), "crop_code"],
          [sequelize.col("indent_of_breederseed.indent_quantity"), 'indent_quantity'],
          [sequelize.col("indent_of_breederseed.user_id"), 'user_id'],
          // [sequelize.literal("Sum(indent_of_breederseed.indent_quantity)"), "indent_quantity"],
        ],
        // group: [
        //   [sequelize.col("indent_of_breederseed.user_id"),'user_id']
        //   // [sequelize.col("bsp_1s.crop_code"), "crop_code"],
        //   // [sequelize.col("m_crop.crop_name"), "crop_name"],
        // ],
        where: { [Op.and]: filterData1 ? filterData1 : [] },
        // where: {
        //   // crop_code: {
        //   //   [Op.like]: req.body.search.crop_type + '%'
        //   // },

        // },
        raw: true
      };
      let data2 = await bsp1Model.findAll(condition2)
      let removeDup = productiohelper.removeDuplicates(data2, 'id');
      let removeDuplicate = productiohelper.sumofDuplicateDataSecondIndentQty(removeDup, 'user_id')
      if (data && data.length > 0) {

        if (removeDuplicate && removeDuplicate.length > 0) {
          removeDuplicate.forEach(item => {
            data.forEach((ele, i) => {
              console.log(ele.crop_code, 'removeDuplicateremoveDuplicate', item)
              if (ele.crop_code == item.crop_code) {
                console.log(ele.crop_code, 'cropp')
                data[i].indent_quantity = item && item.indent_quantity ? parseFloat(item.indent_quantity) : 0
              }
            })
          })

        }
      }
      let productionData

      let liftingQntData
      if (userId && userId.length > 0) {

        liftingQntData = await generateBills.findAll({
          attributes: [
            [sequelize.literal("(generate_bills.crop_code)"), "crop_code"],
            [sequelize.literal("Sum(generate_bills.total_quantity)"), "total_lifting"]
          ],
          group: [
            [sequelize.literal("(generate_bills.crop_code)"), "crop_code"]
          ],
          where: {
            [Op.and]: {
              crop_code: {
                [Op.like]: req.body.search.crop_type + '%'
              },
              year: {
                [Op.eq]: req.body.search.year
              },
              indent_of_breederseed_id: {
                [Op.eq]: req.body.search.user_id
              },
              ...seasonData,
              ...userId
            }
          },
          raw: true
        });
      } else {
        liftingQntData = await generateBills.findAll({
          attributes: [
            [sequelize.literal("(generate_bills.crop_code)"), "crop_code"],
            [sequelize.literal("Sum(generate_bills.total_quantity)"), "total_lifting"]
          ],
          group: [
            [sequelize.literal("(generate_bills.crop_code)"), "crop_code"]
          ],
          where: {
            [Op.and]: {
              crop_code: {
                [Op.like]: req.body.search.crop_type + '%'
              },
              year: {
                [Op.eq]: req.body.search.year
              },
              ...seasonData,
              indent_of_breederseed_id: {
                [Op.eq]: req.body.search.user_id
              },
              // ...userId
            }
          },
          raw: true
        });
      }



      liftingQntData.forEach(ele => {
        ele.total_lifting = ele && ele.total_lifting ? parseFloat(ele.total_lifting) : 0;
      })
      liftingQntData.forEach(ele => {
        data.forEach((elem, i) => {
          if (elem.crop_code == ele.crop_code) {
            data[i].lifting = ele.total_lifting ? ele.total_lifting : 0;
          }
        })
      })

      let liftedQtySecond;
      if (req.body.search && req.body.search.user_id) {

        liftedQtySecond = await bsp5bModel.findAll({
          include: [
            {
              model: indentOfBreederseedModel,
              where: {
                user_id: req.body.search.user_id
              },
              attributes: []
            },
          ],
          where: {
            [Op.and]: filterData1 ? filterData1 : [],
            user_id: req.body.loginedUserid.id
          },
          attributes: [
            [sequelize.literal("(bsp_5_b.crop_code)"), "crop_code"],
            [sequelize.literal("Sum(bsp_5_b.lifting_quantity)"), "lifting_quantity"]
          ],
          group: [
            [sequelize.literal("(bsp_5_b.crop_code)"), "crop_code"]
          ],

          raw: true
        })
      } else {
        liftedQtySecond = await bsp5bModel.findAll({
          include: [
            {
              model: indentOfBreederseedModel,
              //  where:{
              //     user_id:req.body.search.user_id
              //  },
              attributes: []
            },
          ],
          where: {
            [Op.and]: filterData1 ? filterData1 : [],
            user_id: req.body.loginedUserid.id
          },
          attributes: [
            [sequelize.literal("(bsp_5_b.crop_code)"), "crop_code"],
            [sequelize.literal("Sum(bsp_5_b.lifting_quantity)"), "lifting_quantity"]
          ],
          group: [
            [sequelize.literal("(bsp_5_b.crop_code)"), "crop_code"]
          ],

          raw: true
        })
      }
      if (data && data.length > 0) {
        if (liftedQtySecond && liftedQtySecond.length > 0) {
          liftedQtySecond.forEach(item => {
            data.forEach((el, i) => {
              if (el.crop_code == item.crop_code) {
                // console.log(el,'elllllllllllllll')
                data[i].liftedQty = item && item.lifting_quantity ? parseFloat(item.lifting_quantity) : 0
              }

            })
          })
        }

      }
      let alloctedData;
      let filterData = [];
      if (req.body.search) {
        if (req.body.search.crop_type) {
          filterData.push({
            crop_code: {
              [Op.like]: req.body.search.crop_type + '%'
            }
          })
        }
        if (req.body.search.year) {
          filterData.push({
            year: {
              [Op.eq]: req.body.search.year
            },
          })

        }
        if (req.body.search.season) {
          filterData.push({
            season: {
              [Op.eq]: req.body.search.season
            }
          });
        }
        if (req.body.search.crop_code) {
          filterData.push({
            crop_code: {
              [Op.in]: req.body.search.crop_code
            }
          });
        }

      }
      alloctedData = await db.allocationToIndentorLiftingSeed.findAll({
        include: [
          {
            model: allocationToIndentorProductionCenterSeed,
            where: {
              production_center_id: req.body.loginedUserid.id,
              indent_of_breeder_id: req.body.search.user_id,

            },
            attributes: []
          },
          {
            model: cropModel,
            attributes: []
          },
          // {
          //   model:indentOfBreederseedModel,
          //   attributes:[],
          //   where:{
          //     user_id : req.body.search.user_id

          //   },

          // }

        ],
        attributes: [
          [sequelize.fn('SUM', sequelize.col('allocation_to_indentor_for_lifting_seed_production_cnter.qty')), 'qty'],
          // [sequelize.col('indent_of_breederseed->allocation_to_indentor_for_lifting_seed_production_cnter.qty'),'qty'],
          [sequelize.col('m_crop.crop_code'), 'crop_code'],
        ],
        group: [
          [sequelize.col('m_crop.crop_code'), 'crop_code'],
        ],
        where: {
          [Op.and]: filterData ? filterData : []
        },
        raw: true
      })
      if (data && data.length > 0) {
        if (alloctedData && alloctedData.length > 0) {
          alloctedData.forEach(item => {
            data.forEach((el, i) => {
              if (el.crop_code == item.crop_code) {
                data[i].allocatedQtySecond = item && item.qty ? parseFloat(item.qty) : 0
              }

            })
          })
        }
      }
      return response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error);
      return response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static getNucleusSeedAvailabilityforReportsSecond = async (req, res) => {
    try {
      let { page, pageSize, searchData } = req.body;
      console.log(req.body)

      let condition = {
        // attributes: ['quantity', 'variety_id', 'crop_code'],
        include: [
          {
            model: varietyModel,
            left: false,
            raw: false,
            attributes: ['variety_name']
          },
          {
            model: cropModel,
            left: false,
            raw: false,
            attributes: ['crop_name', 'season']
          },
        ],
        where: {}
      }

      if (req.body.page) {
        if (page === undefined) page = 1;
        if (pageSize === undefined) pageSize = 10;
        if (page > 0 && pageSize > 0) {
          condition.limit = pageSize;
          condition.offset = (page * pageSize) - pageSize;
        }
      }


      if (searchData && searchData.isSearch === true) {
        if (searchData.year) {
          condition.where['year'] = searchData.year;
        }

        if (searchData.crop_code) {
          condition.where['crop_code'] = searchData.crop_code;
        }
        if (searchData.season) {
          // condition.include[1].where = {}
          condition.where.season = searchData.season
          // condition.where['crop_code'] = searchData.crop_code;
        }
        if (searchData.breeder_name) {

          condition.where.breeder_production_centre_name = searchData.breeder_name
          // condition.where['crop_code'] = searchData.crop_code;
        }
        if (searchData.variety_id) {

          condition.where.variety_id = searchData.variety_id
          // condition.where['crop_code'] = searchData.crop_code;
        }
      }

      const sortOrder = req.body.sort ? req.body.sort : 'id';
      const sortDirection = req.body.order ? req.body.order : 'DESC';

      condition.order = [['year', 'DESC']];

      let data = await nucleusSeedAvailabityModel.findAndCountAll(condition);
      const filteredData = []
      data.rows.forEach(el => {
        const spaIndex = filteredData.findIndex(item => item.year === el.year);
        if (spaIndex === -1) {
          filteredData.push({


            "year": el.year,
            "season": el.season,
            "total_spa_count": 1,
            breeder_production_centre_name: el.breeder_production_centre_name,
            "crop_code": el && (el.crop_code) && (el.crop_code.substring(0, 1) == 'A') ? 'Agriculture' : "Horticulture",
            "variety": [
              {
                "crop_code": el.crop_code,
                "total_indent": el.indent_quantity,
                crop_name: el.m_crop.crop_name,

                "spa_count": 1,
                "spas": [
                  {
                    variety_Name: el.m_crop_variety.variety_name,
                    variety_id: el.variety_id,
                    "total_indent": el.indent_quantity,
                    breeder_production_centre_name: el.breeder_production_centre_name,
                    quantity: el.quantity,
                    production_center_id: el.production_center_id
                  }
                ]
              }
            ]
          });
        } else {
          const cropIndex = filteredData[spaIndex].variety.findIndex(item => item.crop_code === el.crop_code);
          if (cropIndex !== -1) {
            filteredData[spaIndex].variety[cropIndex].spas.push(
              {
                variety_Name: el.m_crop_variety.variety_name,
                variety_id: el.variety_id,
                "total_indent": el.indent_quantity,
                breeder_production_centre_name: el.breeder_production_centre_name,
                quantity: el.quantity,
                production_center_id: el.production_center_id
              }
            );
          } else {
            // const varietyIndex = filteredData[spaIndex].variety[cropIndex].spas.findIndex(item => item.production_center_id === el.production_center_id);
            //  console.log('varietyIndex',filteredData[spaIndex].variety[0].spas,cropIndex,spaIndex)
            filteredData[spaIndex].variety.push({
              "crop_code": el.crop_code,
              "total_indent": el.indent_quantity,
              crop_name: el.m_crop.crop_name,

              "spa_count": 1,
              "spas": [
                {
                  variety_Name: el.m_crop_variety.variety_name,
                  variety_id: el.variety_id,
                  "total_indent": el.indent_quantity,
                  breeder_production_centre_name: el.breeder_production_centre_name,
                  quantity: el.quantity,
                  production_center_id: el.production_center_id
                }
              ]
            });
          }
        }
      });
      const updatedData = [];
      if (req.body.searchData) {

        response(res, status.DATA_AVAILABLE, 200, filteredData);

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
  static getNucleusSeedAvailabilityCropType = async (req, res) => {
    try {
      let condition = {
        attributes: [
          [sequelize.literal('DISTINCT(crop_code)'), 'crop_code']
        ],
      }

      let data = await nucleusSeedAvailabityModel.findAll(condition);
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
        response(res, status.DATA_AVAILABLE, 200, crop_type);
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
  static getNucleusSeedAvailabilityforReportsNameSecond = async (req, res) => {
    try {
      let { page, pageSize, searchData } = req.body;
      console.log(req.body)

      let condition = {
        // attributes: ['quantity', 'variety_id', 'crop_code'],
        include: [

          {
            model: cropModel,
            left: false,
            raw: false,
            attributes: ['crop_name', 'season', 'crop_code'],
            raw: true
          },
        ],
        raw: true,
        where: {},
        attributes: [

          [sequelize.fn('DISTINCT', sequelize.col('nucleus_seed_availabilities.breeder_production_centre_name')), 'breeder_production_centre_name'],
        ],
        // raw:true
      }


      // if (page === undefined) page = 1;
      // if (pageSize === undefined) pageSize = 10;
      // if (page > 0 && pageSize > 0) {
      //   condition.limit = pageSize;
      //   condition.offset = (page * pageSize) - pageSize;
      // }

      if (req.body.search) {
        if (req.body.search.year) {
          condition.where['year'] = req.body.search.year;
        }
        if (req.body.search.season) {
          condition.include[0].where = {}
          condition.where['season'] = req.body.search.season;
        }

        if (req.body.search.crop_type) {
          condition.include[0].where = {}
          condition.include[0].where.crop_code = {
            [Op.or]: [
              { [Op.like]: 'A' + "%" },
            ]
          }

        }
        if (req.body.search.type == 'report_icar') {
          if (req.body.search.user_type == 'ICAR') {
            condition.include[0].where = {}
            condition.include[0].where.crop_code = {
              [Op.or]: [
                { [Op.like]: 'A' + "%" },
              ]
            }

          } if (req.body.search.user_type == 'HICAR') {
            condition.include[0].where.crop_code = {
              [Op.or]: [
                { [Op.like]: 'H' + "%" },
              ]
            }
          }

          // condition.where.crop_group = (req.body.search.crop_name_data);
        }
        // if (searchData.crop_code) {
        //   condition.where['crop_code'] = searchData.crop_code;
        // }
      }

      // const sortOrder = req.body.sort ? req.body.sort : 'id';
      // const sortDirection = req.body.order ? req.body.order : 'DESC';

      condition.order = [[sequelize.col('nucleus_seed_availabilities.breeder_production_centre_name'), 'ASC']];

      let data = await nucleusSeedAvailabityModel.findAndCountAll(condition);

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
  static getVarietyNucleusSeedAvailabilityforReports = async (req, res) => {
    try {
      let { page, pageSize, searchData } = req.body;
      console.log(req.body)

      let condition = {
        // attributes: ['quantity', 'variety_id', 'crop_code'],
        include: [
          {
            model: varietyModel,
            left: false,
            raw: false,
            attributes: ['variety_name']
          },
          {
            model: cropModel,
            left: false,
            raw: false,
            attributes: ['crop_name', 'season']
          },
        ],
        where: {},
        // raw:true
      }

      if (req.body.page) {
        if (page === undefined) page = 1;
        if (pageSize === undefined) pageSize = 10;
        if (page > 0 && pageSize > 0) {
          condition.limit = pageSize;
          condition.offset = (page * pageSize) - pageSize;
        }
      }


      if (searchData && searchData.isSearch === true) {
        if (searchData.year) {
          condition.where['year'] = searchData.year;
        }

        if (searchData.crop_code) {
          condition.where['crop_code'] = searchData.crop_code;
        }
        if (searchData.season) {
          // condition.include[1].where = {}
          condition.where.season = searchData.season
          // condition.where['crop_code'] = searchData.crop_code;
        }
        if (searchData.breeder_name) {

          condition.where.breeder_production_centre_name = searchData.breeder_name
          // condition.where['crop_code'] = searchData.crop_code;
        }
        if (searchData.variety_id) {

          condition.where.variety_id = searchData.variety_id
          // condition.where['crop_code'] = searchData.crop_code;
        }
      }

      const sortOrder = req.body.sort ? req.body.sort : 'id';
      const sortDirection = req.body.order ? req.body.order : 'DESC';

      condition.order = [['year', 'DESC']];

      let data = await nucleusSeedAvailabityModel.findAndCountAll(condition);
      let updatedDataSecond;
      if (data && data.rows && data.rows.length > 0) {
        updatedDataSecond = await productiohelper.calculateSumOfDupliccatesAvailableQtySecond(data.rows, 'crop_code', 'variety_id', 'production_center_id')
      }
      console.log(updatedDataSecond, 'updatedDataSecond')
      const filteredData = []
      data.rows.forEach(el => {
        // console.log(el.dataValues.quantity)
        const spaIndex = filteredData.findIndex(item => item.year === el.dataValues.year);
        if (spaIndex === -1) {
          filteredData.push({

            "year": el && el.dataValues && el.dataValues.year ? el.dataValues.year : '',
            "season": el && el.dataValues && el.dataValues.season ? el.dataValues.season : '',
            "total_spa_count": 1,
            "variety": [
              {
                crop_name: el && el.dataValues && el.dataValues.m_crop && el.dataValues.m_crop.crop_name ? el.dataValues.m_crop.crop_name : '',
                "crop_code": el && el.dataValues && el.dataValues.crop_code ? el.dataValues.crop_code : '',
                "total_indent": el && el.dataValues && el.dataValues.indent_quantity ? el.dataValues.indent_quantity : '',

                "spa_count": 1,
                "spas": [
                  {
                    "crop_code": el && el.dataValues && el.dataValues.crop_code ? el.dataValues.crop_code : '',
                    variety_Name: el && el.dataValues && el.dataValues.m_crop_variety ? el.dataValues.m_crop_variety.variety_name : '',
                    variety_id: el && el.dataValues && el.dataValues.variety_id ? el.dataValues.variety_id : 0,
                    "total_indent": el && el.dataValues && el.dataValues.indent_quantity ? el.dataValues.indent_quantity : '',
                    breeder_production_centre_name: el && el.dataValues && el.dataValues.breeder_production_centre_name ? el.dataValues.breeder_production_centre_name : '',
                    quantity: el && el.dataValues && el.dataValues.quantity ? el.dataValues.quantity : '',
                    production_center_id: el && el.dataValues && el.dataValues.production_center_id ? el.dataValues.production_center_id : '',

                    "spa1": [
                      {
                        breeder_production_centre_name: el && el.dataValues && el.dataValues.breeder_production_centre_name ? el.dataValues.breeder_production_centre_name : '',
                        quantity: el && el.dataValues && el.dataValues.quantity ? el.dataValues.quantity : '',
                        production_center_id: el && el.dataValues && el.dataValues.production_center_id ? el.dataValues.production_center_id : '',
                        variety_id: el && el.dataValues && el.dataValues.variety_id ? el.dataValues.variety_id : 0,
                        "crop_code": el && el.dataValues && el.dataValues.crop_code ? el.dataValues.crop_code : '',
                      }

                    ]
                  }
                ]
              }
            ]
          });
        } else {
          const cropIndex = filteredData[spaIndex].variety.findIndex(item => item.crop_code === el.dataValues.crop_code);
          if (cropIndex !== -1) {
            const cropVarietyIndex = filteredData[spaIndex].variety[cropIndex].spas.findIndex(item => item.variety_id === el.dataValues.variety_id);
            // console.log(cropVarietyIndex,'cropVarietyIndexcropVarietyIndex')
            if (cropVarietyIndex != -1) {
              filteredData[spaIndex].variety[cropIndex].spas[cropVarietyIndex].spa1.push(

                {
                  breeder_production_centre_name: el && el.dataValues && el.dataValues.breeder_production_centre_name ? el.dataValues.breeder_production_centre_name : '',
                  quantity: el && el.dataValues && el.dataValues.quantity ? el.dataValues.quantity : '',
                  production_center_id: el && el.dataValues && el.dataValues.production_center_id ? el.dataValues.production_center_id : '',
                  variety_id: el && el.dataValues && el.dataValues.variety_id ? el.dataValues.variety_id : 0,
                  "crop_code": el && el.dataValues && el.dataValues.crop_code ? el.dataValues.crop_code : '',
                }
              );
            }
            else {

              filteredData[spaIndex].variety[cropIndex].spas.push(
                {
                  "crop_code": el && el.dataValues && el.dataValues.crop_code ? el.dataValues.crop_code : '',
                  variety_Name: el && el.dataValues && el.dataValues.m_crop_variety ? el.dataValues.m_crop_variety.variety_name : '',
                  variety_id: el && el.dataValues && el.dataValues.variety_id ? el.dataValues.variety_id : 0,
                  "total_indent": el && el.dataValues && el.dataValues.indent_quantity ? el.dataValues.indent_quantity : '',
                  breeder_production_centre_name: el && el.dataValues && el.dataValues.breeder_production_centre_name ? el.dataValues.breeder_production_centre_name : '',
                  quantity: el && el.dataValues && el.dataValues.quantity ? el.dataValues.quantity : '',
                  production_center_id: el && el.dataValues && el.dataValues.production_center_id ? el.dataValues.production_center_id : '',
                  spa1: [
                    {
                      breeder_production_centre_name: el && el.dataValues && el.dataValues.breeder_production_centre_name ? el.dataValues.breeder_production_centre_name : '',
                      quantity: el && el.dataValues && el.dataValues.quantity ? el.dataValues.quantity : '',
                      production_center_id: el && el.dataValues && el.dataValues.production_center_id ? el.dataValues.production_center_id : '',
                      variety_id: el && el.dataValues && el.dataValues.variety_id ? el.dataValues.variety_id : 0,
                      "crop_code": el && el.dataValues && el.dataValues.crop_code ? el.dataValues.crop_code : '',
                    }

                  ]
                }
              );
            }

          } else {
            // const varietyIndex = filteredData[spaIndex].variety[cropIndex].spas.findIndex(item => item.production_center_id === el.production_center_id);
            //  console.log('varietyIndex',filteredData[spaIndex].variety[0].spas,cropIndex,spaIndex)
            filteredData[spaIndex].variety.push({
              crop_name: el && el.dataValues && el.dataValues.m_crop && el.dataValues.m_crop.crop_name ? el.dataValues.m_crop.crop_name : '',
              "crop_code": el && el.dataValues && el.dataValues.crop_code ? el.dataValues.crop_code : '',
              "total_indent": el && el.dataValues && el.dataValues.indent_quantity ? el.dataValues.indent_quantity : '',

              "spa_count": 1,
              "spas": [
                {
                  "crop_code": el && el.dataValues && el.dataValues.crop_code ? el.dataValues.crop_code : '',
                  variety_Name: el && el.dataValues && el.dataValues.m_crop_variety ? el.dataValues.m_crop_variety.variety_name : '',
                  variety_id: el && el.dataValues && el.dataValues.variety_id ? el.dataValues.variety_id : 0,
                  "total_indent": el && el.dataValues && el.dataValues.indent_quantity ? el.dataValues.indent_quantity : '',
                  breeder_production_centre_name: el && el.dataValues && el.dataValues.breeder_production_centre_name ? el.dataValues.breeder_production_centre_name : '',
                  quantity: el && el.dataValues && el.dataValues.quantity ? el.dataValues.quantity : '',
                  production_center_id: el && el.dataValues && el.dataValues.production_center_id ? el.dataValues.production_center_id : '',
                  spa1: [
                    {
                      breeder_production_centre_name: el && el.dataValues && el.dataValues.breeder_production_centre_name ? el.dataValues.breeder_production_centre_name : '',
                      quantity: el && el.dataValues && el.dataValues.quantity ? el.dataValues.quantity : '',
                      production_center_id: el && el.dataValues && el.dataValues.production_center_id ? el.dataValues.production_center_id : '',
                      variety_id: el && el.dataValues && el.dataValues.variety_id ? el.dataValues.variety_id : 0,
                      "crop_code": el && el.dataValues && el.dataValues.crop_code ? el.dataValues.crop_code : '',
                    }

                  ]
                }
              ]
            });
          }
        }
      });
      const updatedData = [];
      if (req.body.searchData) {
        if (req.body.searchData.unitKgQ == 1) {
          if (data) {
            response(res, status.DATA_AVAILABLE, 200, data);
          }
        } else if (filteredData) {
          response(res, status.DATA_AVAILABLE, 200, filteredData);
        }

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

  static updateInspectionReport = async (req, res) => {
    try {
      let teamLeadData = await db.monitoringTeamOfBspcMember.findAll({
        where: {
          [Op.and]: [
            { is_team_lead: 1, },
            {
              user_name: {
                [Op.not]: null
              }
            }
          ]
        },
        raw: true,
        attributes: ['id', 'user_name', 'is_team_lead']
      })
      // console.log('teamLeadData====',teamLeadData)
      if (teamLeadData && teamLeadData.length > 0) {
        let request = [];
        let isUpdated = false;
        teamLeadData.forEach(async (ele, i) => {
          if (ele.user_name || ele.user_name != "" || ele.user_name != undefined) {
            const url = `${process.env.SEED_TRACE_URL + "bspcInspectionRoute/inspection_data"}`;
            const pinCode = `${process.env.PIN_CODE}`;
            const headers = {
              'Accept': 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded',
            };
            const httpsAgent = new https.Agent({ rejectUnauthorized: false });

            const responseData = await axios.post(url, {
              "userId": ele.user_name, //Team lead useer id //ele.user_name
              "apiKey": pinCode  //Fixed //apiKey
            },
              { headers },
              { httpsAgent }
            );
            console.log('user_name', ele.user_name);
            console.log('responseData', responseData.data.EncryptedResponse.data);
            if (responseData && responseData.data && responseData.data.EncryptedResponse && responseData.data.EncryptedResponse.data) {
              let sortedData = responseData.data.EncryptedResponse.data.rows.sort((a, b) => {
                // Assign weights to the "Re-monitoring after 15 days" report
                const weightA = a.report === "Re-monitoring after 15 days" ? 1 : 0;
                const weightB = b.report === "Re-monitoring after 15 days" ? 1 : 0;

                // Sort based on the weights (move "Re-monitoring after 15 days" to the end)
                return weightB - weightA;
                // return weightA - weightB;
              });
              // console.log('sortedData=====',sortedData)
              if (sortedData && sortedData.length) {
                // sortedData.forEach(async (item, j) => {
                for (const item of sortedData) {
                  let yearValue;
                  if (item && item.year.length > 4) {
                    yearValue = parseInt(item.year.slice(0, 4));
                    console.log("yearValue=====1", yearValue);
                  } else {
                    yearValue = item.year;
                    console.log("yearValue=====2", yearValue);
                  }
                  console.log("yearValue=====3", yearValue);
                  let condition = {
                    where: {
                      report_name: "bsp3",
                      year: yearValue,
                      season: item.season.slice(0, 1)
                    },
                    raw: true
                  };
                  let reportStatusData = await db.reportStatus.findOne(condition);
                  console.log('reportStatus===', reportStatusData);
                  let ref_no;
                  if (reportStatusData) {
                    ref_no = "BSP-III/" + (yearValue - 2000) + "-" + (yearValue - 2000 + 1) + "/" + (item.season ? item.season.slice(0, 1) : 'NA') + "/" + (reportStatusData.running_number ? parseInt(reportStatusData.running_number) + 1 : 0);
                    let reportStatusData1 = await db.reportStatus.update({ running_number: reportStatusData.running_number + 1 }, { where: { report_name: "bsp3", year: yearValue, season: item.season.slice(0, 1) } });
                    console.log('ref_no===update', ref_no);
                  } else {
                    ref_no = "BSP-III/" + (yearValue - 2000) + "-" + (yearValue - 2000 + 1) + "/" + (item.season ? item.season.slice(0, 1) : 'NA') + "/" + 1;
                    let reportDataSave = await db.reportStatus.create({ running_number: 1, year: yearValue, season: item.season.slice(0, 1), report_name: "bsp3" });
                    // reportDataSave.save();s
                    console.log('ref_no===create', ref_no);
                  }
                  if ((item && item.crop_condition && item.crop_condition != '') && (item && item.report && item.report != '')) {
                    console.log("11111111")
                    if (item.field_code || item.field_code != null || item.field_code != undefined) {
                      console.log("222222")

                      let bsp2Data = await db.bspPerformaBspTwo.findOne(
                        {
                          raw: true,
                          attributes: ['id'],
                          where: {
                            field_code: item.field_code
                          }
                        }
                      );
                      console.log("bsp2Databsp2Data", bsp2Data)
                      if (bsp2Data && bsp2Data !== undefined) {
                        db.bspPerformaBspTwo.update({ is_inspected: true }, { where: { field_code: item.field_code } });
                        let bspThreeReportData;
                        if (bsp2Data.id) {
                          bspThreeReportData = await db.bspPerformaBspThree.findOne({
                            raw: true,
                            attributes: ['report', 'id'],
                            where: {
                              [Op.and]: [
                                {
                                  bsp_proforma_2_id: bsp2Data.id,
                                },
                                {
                                  [Op.or]: [
                                    {
                                      report: {
                                        [Op.eq]: null
                                      }
                                    },
                                    {
                                      report: {
                                        [Op.iLike]: 'Re-monitoring after 15 days'
                                      }
                                    }
                                  ]
                                }

                              ]
                            }
                          });
                          if (bspThreeReportData) {

                            let isUpdateBsp2 = db.bspPerformaBspThree.update(
                              {
                                "crop_condition": item && item.crop_condition ? item.crop_condition.toString() : '',
                                "report": item && item.report ? (item.report).toLowerCase() : '',
                                "field_img": item && item.capturedPhoto ? item.capturedPhoto : '',
                                "latitude": item && item.latitude ? item.latitude : '',
                                "longitude": item && item.longitude ? item.longitude : '',
                                "area_shown": item && item.area_shown ? item.area_shown : '',
                                "rejected_area": item && item.rejected_area ? (item.rejected_area) : '',
                                "area_reduce_reason": item && item.area_reduce_reason ? (item.area_reduce_reason) : '',
                                "inspected_area": item && item.inspected_area ? item.inspected_area : '',
                                "date_of_harvesting": item.harv_from_date ? item.harv_from_date : null,
                                "harv_to_date": item.harv_to_date ? item.harv_to_date : null,
                                "estimated_production": item && item.estimate_product ? parseFloat(item.estimate_product) : 0,
                                "inspection_date": item && item.date_of_inspection ? item.date_of_inspection : null,
                                "date_of_showing": item && item.date_of_showing ? item.date_of_showing : null,
                                "expected_production": item && item.expected_production ? item.expected_production : null,
                                "reason": item && item.reason ? item.reason : null,
                                "report_ref_no": ref_no ? ref_no : ''
                              }, { where: { bsp_proforma_2_id: bsp2Data.id } })
                            if (item && item.report && item.report === "Re-monitoring after 15 days") {
                              console.log('item.inspected_area=====', item.inspected_area);
                              let createInspectionRecords = db.bsp3ProformaReinspectionsModel.build(
                                {


                                  "bsp3id": bspThreeReportData && bspThreeReportData.id ? bspThreeReportData.id : '',
                                  "latitude": item && item.latitude ? item.latitude : '',
                                  "longitude": item && item.longitude ? item.longitude : '',
                                  "area_shown": item && item.area_shown ? item.area_shown : '',
                                  // "date_of_harvesting": item.harv_from_date ? item.harv_from_date : null,
                                  // "harv_to_date": item.harv_to_date ? item.harv_to_date : null,
                                  "estimated_production": item && item.estimate_product ? parseFloat(item.estimate_product) : 0,
                                  "inspection_date": item && item.date_of_inspection ? item.date_of_inspection : null,
                                  "date_of_showing": item && item.date_of_showing ? item.date_of_showing : null,
                                  "expected_production": item && item.expected_production ? item.expected_production : null,
                                  "reason": item && item.reason ? item.reason : null,

                                  "field_code": item && item.field_code ? item.field_code : '',
                                  "crop_condition": item && item.crop_condition ? item.crop_condition.toString() : '',
                                  "report": item && item.report ? (item.report).toLowerCase() : '',
                                  "field_img": item && item.capturedPhoto ? item.capturedPhoto : '',
                                  "rejected_area": item && item.rejected_area ? (item.rejected_area) : '',
                                  "area_reduce_reason": item && item.area_reduce_reason ? (item.area_reduce_reason) : '',
                                  "inspected_area": item && item.inspected_area ? item.inspected_area : '',
                                  "date_of_inspection": item && item.date_of_inspection ? item.date_of_inspection : '0000-00-01 00:00:00.000 +00:00',
                                  "ref_no": ref_no ? ref_no : ''
                                });
                              createInspectionRecords.save();
                            }
                            if (isUpdateBsp2) {
                              let bsp3Data = await db.bspPerformaBspThree.findOne(
                                {
                                  raw: true,
                                  attributes: ['id'],
                                  where: {
                                    bsp_proforma_2_id: bsp2Data.id
                                  }
                                }
                              );
                              if (bsp3Data) {
                                let isUpdate = db.bspProforma3MembersModel.update({ is_active: 0 }, { where: { bsp3_id: bsp3Data.id } })
                                if (item && item.selected_teams && item.selected_teams.length) {
                                  let isSaved = false;
                                  let bspProformaCreate;
                                  item.selected_teams.forEach(async (team) => {
                                    bspProformaCreate = await db.bspProforma3MembersModel.build({
                                      bsp3_id: bsp3Data.id,
                                      monitoring_team_of_bspc_members_id: team && team.id ? team.id : null,
                                      is_active: 1
                                    });
                                    isSaved = true;
                                    bspProformaCreate.save();

                                  });
                                  request.push({
                                    "field_code": item.field_code,
                                    "report": item.report
                                  },)

                                  if (request && request.length) {
                                    isUpdated = true;
                                  }
                                }
                              }
                            } else {
                              // return response(res, status.DATA_NOT_UPDATE, 201, []);
                            }
                          } else {
                            // return response(res, status.DATA_NOT_UPDATE, 201, []);
                          }
                        }
                      }
                    }
                  } else {
                    // return response(res, status.DATA_NOT_UPDATE, 201, []);
                  }
                };
              }
            }
          }
        });
        if (request && request.length) {
          return response(res, status.DATA_UPDATED, 200, []);
        } else {
          return response(res, status.DATA_UPDATED, 200, []);
          // return response(res, status.DATA_NOT_UPDATE, 201, []);
        }
      } else {
        return response(res, "team lead not found", 201, []);
      }
    } catch (error) {
      // console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 500, []);
    }
  }

  static variefyInspectionReport = async (req, res) => {
    try {
      let request = [];
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      let bsp2Data = await db.bspPerformaBspTwo.findAll(
        {
          required: true,
          raw: true,
          attributes: ['id', 'field_code', 'updated_at'],
          include: [
            {
              model: db.bspPerformaBspThree,
              attributes: ['id', 'is_variefy', 'report'],
              where: {
                [Op.or]: [
                  {
                    is_variefy: 0
                  }, {
                    is_variefy: {
                      [Op.eq]: null
                    }
                  }
                ]

              },
              include: [
                {
                  required: true,
                  model: db.bspProforma3MembersModel,
                  attributes: ['monitoring_team_of_bspc_members_id'],
                  include: [
                    {
                      required: true,
                      model: db.monitoringTeamOfBspcMember,
                      attributes: ['id', 'user_name'],
                      where: {
                        is_team_lead: 1
                      }
                    }
                  ],
                  where: {
                    is_active: 1
                  },
                }
              ]
            }
          ],
          where: {
            updated_at: {
              [Op.gte]: oneHourAgo
            },
            is_inspected: true
          }
        }
      );
      if (bsp2Data && bsp2Data.length) {
        const url = `${process.env.SEED_TRACE_URL + "bspcInspectionRoute/updateInspectedData"}`;
        const pinCode = `${process.env.PIN_CODE}`;
        let returnResponse = [];
        let reportStatus;
        bsp2Data.forEach(async (ele) => {
          if (ele && ele['field_code'] && ele['bsp_proforma_3s.report']) {
            request.push({
              "field_code": ele['field_code'],
              "report": ele['bsp_proforma_3s.report']
            },)
            reportStatus = {
              "userId": ele && ele['bsp_proforma_3s.bsp_proforma_3_members.monitoring_team_of_bspc_'] ? ele['bsp_proforma_3s.bsp_proforma_3_members.monitoring_team_of_bspc_'] : '', //Team lead useer id //ele.user_name
              "apiKey": pinCode,  //Fixed //apiKey
              "data": request ? request : []
            }
            returnResponse.push(reportStatus);
          }
        });
        if (returnResponse && returnResponse.length) {
          returnResponse.forEach(async (ele) => {
            // const headers = {
            //   'Content-Type': 'application/json',
            // };

            const headers = {
              'Accept': 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded',
            };
            const httpsAgent = new https.Agent({ rejectUnauthorized: false });
            const responseData = await axios.post(url, {
              "userId": ele && ele['userId'] ? ele['userId'] : '', //Team lead useer id //ele.user_name
              "apiKey": ele && ele['apiKey'] ? ele['apiKey'] : '',  //Fixed //apiKey
              "data": ele && ele['data'] ? ele['data'] : []
            }, { headers }, { httpsAgent });

            if (responseData && responseData.status == 200) {
              if (ele && ele.data) {
                ele.data.forEach(async (el) => {
                  console.log('el', el);
                  let bsp2Data = await db.bspPerformaBspTwo.findOne(
                    {
                      raw: true,
                      attributes: ['id'],
                      where: {
                        field_code: el.field_code
                      }
                    }
                  );
                  if (bsp2Data && bsp2Data.id !== undefined) {
                    let isUpdateBsp2 = db.bspPerformaBspThree.update(
                      {
                        "is_variefy": 1,
                      }, { where: { bsp_proforma_2_id: bsp2Data.id } })
                  }
                });
              }
            }
          })
          return response(res, 'Success', 200, returnResponse);
        }
        else {
          return response(res, status.DATA_NOT_AVAILABLE, 201, []);
        }
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, []);
      }
    } catch (error) {
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 500, []);
    }
  }
 
}
module.exports = SeederController


