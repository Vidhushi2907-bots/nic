require('dotenv').config()
const response = require('../_helpers/response')
const status = require('../_helpers/status.conf')
const db = require("../models");
let Validator = require('validatorjs');
var https = require('https');
const axios = require('axios');
const { fn, col } = require('sequelize');
const path = require("path");
const fs = require("fs");
const alloallocationToIndentorProductionCenterSeed = db.allocationToIndentorProductionCenterSeed
const { allocationToSPASeed, allocationToSPAProductionCenterSeed, indenterSPAModel, indentOfBrseedDirectLineModel, sectorModel, deleteIndenteOfSpaModel, deleteIndenteOfBreederSeedModel, bspPerformaBspTwo, bspPerformaBspThree, bspPerformaBspOne, bspProformaOneBspc, monitoringTeamOfBspcMember, monitoringTeamOfBspc, seedInventory, seedClassModel, stageModel, seedInventoryTag, seedInventoryTagDetail, bspPerformaBspTwoSeed, varietyLineModel, mVarietyLinesModel } = require('../models');
const indentOfSpaModel = db.indentOfSpa;
const allocationToIndentorProductionCenterSeed = db.allocationToIndentorProductionCenterSeed
const allocationToIndentorSeed = db.allocationtoIndentorliftingseeds;
const seedProcessingRegisterModel = db.seedProcessingRegister;
const liftingSeedDetailsModel = db.liftingSeedDetailsModel;

const { stateModel, userModel, indentOfBreederseedModel, cropModel, varietyModel, agencyDetailModel, seasonModel } = require('../models');
const SeedUserManagement = require('../_helpers/create-user')
// db.deleteIndenteOfSpaModel = require("../deleted_indent_of_spa.model")(sequelize, Sequelize);
// db.deleteIndenteOfBreederSeedModel = require("./deleted_indent_of_indenter.model")(sequelize, Sequelize);

require('dotenv').config()
const sequelize = require('sequelize');
const { where } = require('sequelize');

const Op = require('sequelize').Op;

class ApiController {

  static indentOfSpaData = async (req, res) => {
    let returnResponse = {};
    let internalCall = {};

    try {
      let rules = {
        'user_id': 'required|integer',
        "yearofIndent": 'required|integer',
        "season": 'required|string',
        "crop_code": 'required|string',
        // "variety_notification_year": 'required|string',
        "state_id": 'required|integer',
        "spa_code": 'required|string',
        // "indent_quantity": 'required|integer',
        // "unit": 'required|string',
        // "variety_id": 'required|integer',
        // "variety_name": 'string',
        "crop_type": 'required|string',
        "season_id": 'integer',
        "crop_name": 'string',
        "group_name": 'required|string',
        "cropGroup": 'required|string',
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

      let spaDatas = {
        "user_id": req.body.user_id,
        "year": req.body.year,
        "season": req.body.season,
        "crop_code": req.body.crop_code,
        "variety_notification_year": req.body.variety_notification_year,
        "state_id": req.body.state_id,
        "spa_code": req.body.spa_code,
        "indent_quantity": req.body.indent_quantity,
        "unit": req.body.unit,
        "is_active": req.body.is_active,
        "variety_id": req.body.variety_id,
        "variety_name": req.body.variety_name,
        "crop_type": req.body.crop_type,
        "season_id": req.body.season_id,
        "is_freeze": req.body.is_freeze,
        "crop_name": req.body.crop_name,
        "group_name": req.body.group_name,
        "group_code": req.body.group_code,
        "icar_freeze": req.body.icar_freeze
      }
      let stateCode;
      let IndentBreederData;
      if (req.body.id) {
        let getSpaIndentData = await indentOfSpaModel.findAll({ where: { id: req.body.id } });
        if (getSpaIndentData && getSpaIndentData[0] && getSpaIndentData[0].dataValues) {
          if (req.body.state_id) {
            stateCode = {
              where: {
                state_id: req.body.state_id,
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
                user_id: req.body.user_id,
                crop_code: req.body.crop_code,
                year: req.body.year,
                variety_id: req.body.variety_id,
                season: req.body.season
              }
            }
          );
          if (IndentBreederData && IndentBreederData[0] && IndentBreederData[0].dataValues) {
            // indent_quantity
            let temp = IndentBreederData[0].dataValues.indent_quantity - getSpaIndentData[0].dataValues.indent_quantity;
            console.log('IndentBreederData==indent_quantity', IndentBreederData[0].dataValues.indent_quantity)
            let IndentDataNew = await indentOfBreederseedModel.update(
              {
                indent_quantity: temp + req.body.indent_quantity
              },
              {
                where: {
                  user_id: req.body.user_id,
                  crop_code: req.body.crop_code,
                  year: req.body.year,
                  variety_id: req.body.variety_id,
                  season: req.body.season
                }
              });

            returnResponse = {};
            let spaInsertData = indentOfSpaModel.update(spaDatas, { where: { id: req.body.id } });
            return response(res, status.DATA_UPDATED, 200, returnResponse, internalCall);
          } else {
            return response(res, status.DATA_NOT_SAVE, 401, returnResponse, internalCall);
          }
        } else {
          return response(res, status.DB_DATA_MISSING, 404, returnResponse, internalCall);
        }
      } else {
        req.body.variety_items.forEach(async (items) => { });
        let spaInsertData = indentOfSpaModel.build(spaDatas)
        if (spaInsertData) {
          let IndentBreederData;
          // find and update indent of breeders indent_quantity
          if (req.body.state_code) {
            stateCode = {
              where: {
                state_id: req.body.state_id,
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
                user_id: req.body.user_id,
                crop_code: req.body.crop_code,
                year: req.body.year,
                variety_id: req.body.variety_id,
                season: req.body.season
              }
            }
          );

          let IndentDataNew;
          if (IndentBreederData && IndentBreederData[0] && IndentBreederData[0].dataValues) {
            IndentDataNew = await indentOfBreederseedModel.update(
              {
                indent_quantity: IndentBreederData[0].dataValues.indent_quantity + req.body.indent_quantity
              },
              {
                where: {
                  user_id: req.body.user_id,
                  crop_code: req.body.crop_code,
                  year: req.body.year,
                  variety_id: req.body.variety_id,
                  season: req.body.season
                }
              });

            returnResponse = {};
            spaInsertData.save();
            return response(res, status.DATA_SAVE, 200, returnResponse, internalCall);
          } else {
            req.body.variety_items.forEach(async (items) => {
              IndentDataNew = await indentOfBreederseedModel.create({
                "user_id": req.body.user_id,
                "year": req.body.yearofIndent,
                "season": req.body.season,
                "crop_code": req.body.crop_code,
                "variety_notification_year": items.variety_notification_year,
                "indent_quantity": items.indentQuantity,
                "unit": unitKgQ,
                "variety_id": items.variety_id,
                "variety_name": items.variety_name,
                "crop_type": cropType,
                "season_id": req.body.season_id,
                "crop_name": req.body.crop_name,
                "group_name": req.body.group_name,
                "group_code": req.body.cropGroup,
              })
            });
            if (IndentDataNew) {
              spaInsertData.save();
              return response(res, status.DATA_SAVE, 200, returnResponse, internalCall);
            } else {
              return response(res, status.DATA_NOT_SAVE, 401, returnResponse, internalCall);
            }
          }
        } else {
          return response(res, status.DATA_NOT_SAVE, 401, returnResponse, internalCall);
        }
      }

    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);

    }
  }

  static addIndentOfSpaData = async (req, res) => {
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
      let { year, season } = req.body;


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
      let condition1 = {
        where: {
          year: parseInt(yearOfIndent),
          season: seasoneCode
        }
      };
      let indentPermission = await db.mIndentPermissionsModel.findOne(condition1);
      // ====================================================
      if (cropExistingData) {
        let spaInsertData = {};
        //edit indnt of SPA DATA
        let errorMsg;
        let getSpaIndentData;
        let varietyExistingData;
        if (req.params && req.params["id"]) {
          let date;

          if (indentPermission && indentPermission['is_allowed_update'] && indentPermission['is_allowed_update'] === 1) {
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
          } else {
            return response(res, "Permission Declined", 401, [], internalCall);
          }
        }
        // indnt of SPA DATA
        else {
          if (indentPermission && indentPermission['is_allowed_new'] && indentPermission['is_allowed_new'] === 1) {
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

              if (IndentBreederData && IndentBreederData[0] && IndentBreederData[0].dataValues) {
                dataRow.indente_breederseed_id = IndentBreederData[0].dataValues.id;
                dataRow.indenter_id = IndentBreederData[0].dataValues.user_id;
                returnResponse = dataRow;

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
          } else {
            return response(res, "Permission Declined", 401, [], internalCall);
          }
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

  static delteIndentOfSpaData = async (req, res) => {
    let returnResponse = {};
    let internalCall = {};

    try {
      let stateCode;
      let IndentBreederData;
      if (req.body.id) {
        let getSpaIndentData = await indentOfSpaModel.findAll({ where: { id: req.body.id } });

        if (getSpaIndentData && getSpaIndentData[0] && getSpaIndentData[0].dataValues) {
          let isPermission = await db.mIndentPermissionsModel.findOne({
            attributes: ['is_deleted'],
            where: {
              year: getSpaIndentData[0].dataValues.year ? getSpaIndentData[0].dataValues.year : '',
              season: getSpaIndentData[0].dataValues.season ? getSpaIndentData[0].dataValues.season : '',

            },
            rew: true
          });
          if (isPermission && isPermission['is_deleted'] && isPermission['is_deleted'] === 1) {
            if (getSpaIndentData && getSpaIndentData[0] && getSpaIndentData[0].dataValues && getSpaIndentData[0].dataValues.state_code) {
              stateCode = {
                where: {
                  state_id: getSpaIndentData[0].dataValues.state_code
                }
              }
            }
            let breederUserIdData;
            if (getSpaIndentData && getSpaIndentData[0] && getSpaIndentData[0].dataValues && getSpaIndentData[0].dataValues.state_code) {
              breederUserIdData = await userModel.findAll({
                include: [{
                  model: agencyDetailModel,
                  where: {
                    state_id: getSpaIndentData[0].dataValues.state_code
                  }
                }],
                where: {
                  user_type: "IN"
                }
              });
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
                  crop_code: getSpaIndentData[0].dataValues.crop_code,
                  year: getSpaIndentData[0].dataValues.year,
                  variety_id: getSpaIndentData[0].dataValues.variety_id,
                  season: getSpaIndentData[0].dataValues.season
                }
              }
            );

            let finalIndentQunatity = IndentBreederData[0].dataValues.indent_quantity - getSpaIndentData[0].dataValues.indent_quantity;
            if (IndentBreederData) {
              console.log("IndentBreed0000000000", IndentBreederData[0].dataValues)

              if (finalIndentQunatity > 0) {
                // indent_quantity
                let IndentDataNew = await indentOfBreederseedModel.update(
                  {
                    indent_quantity: finalIndentQunatity
                  },
                  {
                    where: {
                      user_id: breederUserIdData[0].id,
                      crop_code: getSpaIndentData[0].dataValues.crop_code,
                      year: getSpaIndentData[0].dataValues.year,
                      variety_id: getSpaIndentData[0].dataValues.variety_id,
                      season: getSpaIndentData[0].dataValues.season
                    }
                  });

                returnResponse = {};
                // let spaInsertData = await indentOfSpaModel.update({
                //   is_active: 0
                // }, { where: { id: req.body.id } });

                let bkpSpaCheck = await this.backupIndenetOfSPA(req.body.id);
                if (1 || bkpSpaCheck) {
                  await indentOfSpaModel.destroy({
                    where: {
                      id: req.body.id
                    }
                  });
                }
                return response(res, status.DATA_DELETED, 200, [], internalCall);
              } else {
                let bkpSpaCheck = await this.backupIndenetOfSPA(req.body.id);
                if (1 || bkpSpaCheck) {
                  await indentOfSpaModel.destroy({
                    where: {
                      id: req.body.id
                    }
                  });
                }
                let bkpCheck = await this.backupIndenetOfBreederseed(IndentBreederData[0].dataValues.id);
                console.log("bkpCheck", bkpCheck)
                if (1 || bkpCheck) {
                  console.log("innerrrr", bkpCheck)

                  await indentOfBreederseedModel.destroy({
                    where: {
                      id: IndentBreederData[0].dataValues.id
                    }
                  });
                }
                return response(res, status.DATA_DELETED, 200, [], internalCall);
              }
            }
          } else {
            return response(res, "Permission Declined", 404, []);
          }
        } else {
          return response(res, "Id not exist.", 404, []);
        }
      } else {
        return response(res, "SPAs not exist or SPAs id is required ", 409, []);
      }
    } catch (error) {
      returnResponse = error;
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);

    }
  }

  static getIndentOfSpaData = async (req, res) => {
    let returnResponse = {};
    let internalCall = {};
    try {
      let rules = {
        "year_of_indent": 'required|string',
        "season": 'required|string',
        "state_code": 'required|integer',
        "spa_code": 'required|string',
      };

      let validation = new Validator(req.body, rules);

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
          }
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
          [sequelize.col('indent_of_spas.indent_quantity'), 'indent_quantity'],
          [sequelize.col('indent_of_spas.unit'), 'unit'],
          [sequelize.col('indent_of_spas.is_active'), 'is_active'],
          [sequelize.col('indent_of_spas.user_id'), 'user_id'],
          [sequelize.col('indent_of_spas.created_at'), 'created_at'],
          [sequelize.col('indent_of_spas.updated_at'), 'updated_at'],
          //other join table data
          [sequelize.col('m_crop.crop_name'), 'crop_name'],
          [sequelize.col('m_crop.crop_code'), 'crop_code'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [sequelize.col('m_crop_variety.variety_code'), 'variety_code'],
          [sequelize.col('m_state.state_name'), 'state_name'],
          [sequelize.col('m_state.state_code'), 'state_code'],
          [sequelize.col('m_season.season'), 'season'],
          [sequelize.col('m_season.season_code'), 'season_code'],
        ],
        raw: true
      }
      if (req.body) {
        if (req.body.spa_code) {
          condition.where.spa_code = req.body.spa_code;
        }
        if (req.body.year_of_indent) {
          condition.where.year = parseInt(req.body.year_of_indent.slice(0, 4).trim());
        }
        if (req.body.season) {
          // condition.where.season = (req.body.season);
          condition.where.season = (req.body.season.slice(0, 1).toUpperCase().trim());

        }
        if (req.body.state_code) {
          condition.where.state_code = (req.body.state_code);
        }
      }
      let getSpaIndentData = await indentOfSpaModel.findAll(condition);

      if (getSpaIndentData === undefined || getSpaIndentData.length < 1) {
        returnResponse = {};
        return response(res, status.DATA_NOT_AVAILABLE, 404, []);
      } else {
        getSpaIndentData.forEach((ele, i) => {
          if (ele.indent_quantity || ele.indent_quantity !== undefined || ele.indent_quantity !== null) {
            getSpaIndentData[i].indent_quantity = ele.indent_quantity.toFixed(2)
          }
        })
        returnResponse = getSpaIndentData;
        return response(res, status.DATA_AVAILABLE, 200, returnResponse);
      }
    } catch (error) {
      console.log('error', error);
      returnResponse = error;
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);

    }
  }

  static addIndentOfSpaDataHybridHold = async (req, res) => {
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
      let { year, season } = req.body;

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
      let condition1 = {
        where: {
          year: parseInt(yearOfIndent),
          season: seasoneCode
        }
      };
      let data = {
        query: {
          year_of_indent: (req.body.year_of_indent),
          season_code: req.body.season,
          state_code: req.body.state_code,
          crop_code: req.body.crop_code,
        }
      }
      // check freez or not
      if (req.body || (req.query && req.query.sector)) {
        let stateCode = await SeedUserManagement.getStateCode(req.query.sector)

        if (stateCode)
          req.query.state_code = stateCode.stateCode
      }

      let { state_code, crop_code, year_of_indent, season_code, sector } = data.query
      console.log("state_code", state_code)
      let freezeIndent = await indentOfSpaModel.findAll({ where: { state_code, crop_code, season: season_code.slice(0, 1), year: parseInt(year_of_indent.slice(0, 4)), is_freeze: 1 } });
      let indenterId = await agencyDetailModel.findOne(
        {
          include: [
            {
              model: userModel,
              attributes: [],
              where: { user_type: 'IN' }
            }],
          attributes: [sequelize.col('agency_details.user_id'), 'user_id'],
          where: { state_id: state_code }
        },
      )
      console.log("indenterId", indenterId.user_id)
      let freezeBySeedDivision = { id: 1 }
      if (indenterId && indenterId.user_id) {
        freezeBySeedDivision = await indentOfBreederseedModel.findAll(
          { where: { user_id: indenterId.user_id, crop_code, season: season_code.slice(0, 1), year: parseInt(year_of_indent.slice(0, 4)), is_freeze: 1 } });

      }
      let isFreezeIndent = {}
      if ((freezeIndent && freezeIndent.length) || (freezeBySeedDivision && freezeBySeedDivision.length)) {
        isFreezeIndent = {
          "is_indent_allow": false
        }
      } else {
        isFreezeIndent = {
          "is_indent_allow": true
        }
      }

      let indentPermission = await db.mIndentPermissionsModel.findOne(condition1);
      // ====================================================
      if (cropExistingData) {
        let spaInsertData = {};
        //edit indnt of SPA DATA
        let errorMsg;
        let getSpaIndentData;
        let varietyExistingData;
        if (req.params && req.params["id"]) {
          let date;
          if (indentPermission && indentPermission['is_allowed_update'] && indentPermission['is_allowed_update'] === 1) {
            if (isFreezeIndent && isFreezeIndent.is_indent_allow) {
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
                    date = new Date(varietyExistingData[0]['not_date']).getFullYear();
                  }

                  const dataRow = {
                    year: yearOfIndent,
                    crop_type: cropType,
                    season: seasoneCode,
                    variety_id: varietyExistingData[0]['id'],
                    // variety_code:  varietyExistingData[0]['variety_code'],
                    variety_notification_year: date,
                    indent_quantity: items.indent_quantity ? items.indent_quantity : 0,
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

                    if (IndentBreederData && IndentBreederData[0] && IndentBreederData[0].dataValues) {
                      let IndentDataNew;
                      dataRow.indente_breederseed_id = IndentBreederData[0].dataValues.id;
                      dataRow.indenter_id = IndentBreederData[0].dataValues.user_id;
                      returnResponse = dataRow
                      let temp = IndentBreederData[0].dataValues.indent_quantity - getSpaIndentData[0].dataValues.indent_quantity;
                      if (items && items.variety_type && items.variety_type.toLowerCase().trim() == 'hybrid') {
                        if (items.lines && items.lines.length) {
                          let sumOfLineQnty = 0;
                          let spaLinesData;
                          let indenterLineData;
                          for (let ele of items.lines) {
                            let getSpaIndentLineData = await db.indentOfSpaLinesModel.findAll({ where: { indent_of_spa_id: req.params["id"], variety_code_line: ele.variety_code_line } });
                            let indenterLineDataList = await db.indentOfBrseedLines.findAll({
                              where: {
                                indent_of_breederseed_id: IndentBreederData[0].dataValues.id,
                                variety_code_line: ele.variety_code_line,
                              },
                              raw: true
                            })
                            if (indenterLineDataList && indenterLineDataList.length) {
                              let temp1 = indenterLineDataList[0].quantity - getSpaIndentLineData[0].dataValues.quantity;
                              console.log('temp1==', temp1)
                              indenterLineData = await db.indentOfBrseedLines.update({
                                quantity: temp1 + ele.quantity
                              }, {
                                where: {
                                  indent_of_breederseed_id: IndentBreederData[0].dataValues.id,
                                  variety_code_line: ele.variety_code_line,
                                }
                              })
                            }
                            sumOfLineQnty += parseFloat(ele.quantity);
                            spaLinesData = await db.indentOfSpaLinesModel.update(
                              { quantity: ele.quantity },
                              {
                                where: {
                                  indent_of_spa_id: req.params["id"],
                                  variety_code_line: ele.variety_code_line,
                                }
                              }
                            );
                          }

                          if (spaLinesData) {
                            await indentOfSpaModel.update({ indent_quantity: sumOfLineQnty ? sumOfLineQnty : 0 }, { where: { id: req.params["id"] } });
                          }
                          IndentDataNew = await indentOfBreederseedModel.update(
                            {
                              indent_quantity: temp + sumOfLineQnty
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
                        }
                      }
                      else {
                        console.log('else case');

                        spaInsertData = await indentOfSpaModel.update(dataRow, { where: { id: req.params["id"] } });
                        IndentDataNew = await indentOfBreederseedModel.update(
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
                      }
                    }
                  }
                });
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
            } else {
              return response(res, "Not Allowed", 401, [], internalCall);
            }

          } else {
            return response(res, "Permission Declined", 401, [], internalCall);
          }
        }
        // indnt of SPA DATA
        else {
          if (indentPermission && indentPermission['is_allowed_new'] && indentPermission['is_allowed_new'] === 1) {
            //uncommnet after code complition
            if (isFreezeIndent && isFreezeIndent.is_indent_allow) {
              let varietyLineCodeArray = [];
              let varietyCodeArray = [];
              if (req.body.varieties && req.body.varieties.length) {
                req.body.varieties.forEach((items) => {
                  if (items.variety_code || items.variety_code !== undefined || items.variety_code !== null) {
                    varietyCodeArray.push(items.variety_code);
                    if (items.lines && items.lines.length) {
                      items.lines.forEach((item) => {
                        if (item.variety_code_line || item.variety_code_line !== undefined || item.variety_code_line !== null) {
                          varietyLineCodeArray.push(item.variety_code_line);
                        }
                      })
                    }
                  }
                });
              }
              let varietyLineCodeArrayValue;
              let varietyCodeArrayValue;
              if (varietyLineCodeArray && varietyLineCodeArray.length) {
                varietyLineCodeArrayValue = {
                  include: [
                    {
                      model: db.indentOfSpaLinesModel,
                      where: {
                        variety_code_line: {
                          [Op.in]: varietyLineCodeArray
                        }
                      }
                    }
                  ],
                }
              }
              console.log("10571057105710571057")
              let spaDataCheck = await indentOfSpaModel.findAll(
                {
                  ...varietyLineCodeArrayValue,
                  where: {
                    year: yearOfIndent,
                    season: seasoneCode,
                    state_code: req.body.state_code,
                    spa_code: req.body.spa_code,
                    variety_code: {
                      [Op.in]: varietyCodeArray
                    }
                  }
                }
              );
              console.log("spaDataCheckspaDataCheck", spaDataCheck)
              if (spaDataCheck.length) {
                return response(res, "Already indented for same variety.", 404, [])

              }

              let date;
              let IndentBreederData;
              let IndentDataNew;
              let data;
              let varietyExistingData = {};
              console.log("req.body", req.body)
              req.body.varieties.forEach(async (items) => {
                // if(items.lines && items.lines.length){
                //   items.lines.forEach((item)=>{
                //     if(item.variety_code_line || item.variety_code_line !== undefined ||item.variety_code_line !== null){

                //     }
                //   })
                // }
                if (items.variety_code) {
                  varietyExistingData = await varietyModel.findAll(
                    {
                      where: {
                        variety_code: items.variety_code,
                      },
                      raw: true
                    }
                  );
                  date = new Date(varietyExistingData[0]['not_date']).getFullYear();
                }
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
                if (IndentBreederData && IndentBreederData[0] && IndentBreederData[0].dataValues) {
                  dataRow.indente_breederseed_id = IndentBreederData[0].dataValues.id;
                  dataRow.indenter_id = IndentBreederData[0].dataValues.user_id;
                  returnResponse = dataRow;
                  if (items && items.variety_type && items.variety_type.toLowerCase().trim() == 'hybrid') {
                    if (items.lines && items.lines.length) {
                      console.log('if case');
                      dataRow.indent_quantity = 0;
                      data = indentOfSpaModel.build(dataRow);
                      await data.save();
                      let sumOfLineQnty = 0;
                      let spaLinesData;
                      let indenterLineData;
                      for (let ele of items.lines) {
                        let indenterLineDataList = await db.indentOfBrseedLines.findAll({
                          where: {
                            indent_of_breederseed_id: IndentBreederData[0].dataValues.id,
                            variety_code_line: ele.variety_code_line,
                          },
                          raw: true
                        })
                        if (indenterLineDataList && indenterLineDataList.length) {
                          indenterLineData = await db.indentOfBrseedLines.update({
                            quantity: indenterLineDataList[0].quantity + ele.quantity
                          }, {
                            where: {
                              indent_of_breederseed_id: IndentBreederData[0].dataValues.id,
                              variety_code_line: ele.variety_code_line,
                            }
                          })
                        } else {
                          indenterLineData = await db.indentOfBrseedLines.create({
                            indent_of_breederseed_id: IndentBreederData[0].dataValues.id,
                            variety_code_line: ele.variety_code_line,
                            quantity: ele.quantity
                          })
                        }
                        sumOfLineQnty += parseFloat(ele.quantity);
                        spaLinesData = await db.indentOfSpaLinesModel.build(
                          {
                            indent_of_spa_id: data.dataValues.id,
                            variety_code_line: ele.variety_code_line,
                            quantity: ele.quantity
                          }
                        );
                        await spaLinesData.save();
                      }
                      if (spaLinesData) {
                        indentOfSpaModel.update({ indent_quantity: sumOfLineQnty }, { where: { id: data.dataValues.id } });
                      }
                      IndentDataNew = await indentOfBreederseedModel.update(
                        {
                          indent_quantity: IndentBreederData[0].dataValues.indent_quantity + sumOfLineQnty
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
                    }
                  }
                  else {
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
                }
                else {
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
                  IndentDataNew = await indentOfBreederseedModel.create({
                    "user_id": breederUserIdData[0].id,
                    "year": yearOfIndent,
                    "season": seasoneCode,
                    "crop_code": req.body.crop_code,
                    "crop_name": cropExistingData.dataValues.crop_name,
                    "group_name": cropExistingData.dataValues.crop_group,
                    "group_code": cropExistingData.dataValues.group_code,
                    "variety_notification_year": varietyExistingData[0]['not_date'],
                    "indent_quantity": items.indent_quantity ? items.indent_quantity : 0,
                    "unit": unitKgQ,
                    "variety_name": varietyExistingData[0]['variety_name'],
                    "variety_id": varietyExistingData[0]['id'],
                    "crop_type": cropType,
                    "season_id": req.body.season_id,
                    "variety_code": items.variety_code
                  })
                  if (items && items.variety_type && items.variety_type.toLowerCase().trim() == 'hybrid') {
                    if (items.lines && items.lines.length) {
                      console.log('if case');
                      dataRow.indent_quantity = 0;
                      data = indentOfSpaModel.build(dataRow);
                      const result = await data.save();

                      let sumOfLineQnty = 0;
                      let spaLinesData;
                      let indenterLineData;
                      for (let ele of items.lines) {
                        let indenterLineDataList = await db.indentOfBrseedLines.findAll({
                          where: {
                            indent_of_breederseed_id: IndentDataNew.dataValues.id,
                            variety_code_line: ele.variety_code_line,
                          },
                          raw: true
                        })
                        if (indenterLineDataList && indenterLineDataList.length) {
                          indenterLineData = await db.indentOfBrseedLines.update({
                            quantity: indenterLineDataList[0].quantity + ele.quantity
                          }, {
                            where: {
                              indent_of_breederseed_id: IndentDataNew.dataValues.id,
                              variety_code_line: ele.variety_code_line,
                            }
                          })
                        } else {
                          indenterLineData = await db.indentOfBrseedLines.create({
                            indent_of_breederseed_id: IndentDataNew.dataValues.id,
                            variety_code_line: ele.variety_code_line,
                            quantity: ele.quantity
                          })
                        }
                        sumOfLineQnty += parseFloat(ele.quantity);
                        spaLinesData = await db.indentOfSpaLinesModel.build(
                          {
                            indent_of_spa_id: data.dataValues.id,
                            variety_code_line: ele.variety_code_line,
                            quantity: ele.quantity
                          }
                        );
                        await spaLinesData.save();
                      }
                      if (spaLinesData) {
                        indentOfSpaModel.update({ indent_quantity: sumOfLineQnty }, { where: { id: data.dataValues.id } });
                      }
                      IndentDataNew = await indentOfBreederseedModel.update(
                        {
                          indent_quantity: IndentDataNew.dataValues.indent_quantity + sumOfLineQnty
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
                      spaUpdatedData = await indentOfSpaModel.findAll({
                        attributes: ['id', 'crop_code', 'variety_code', 'state_code', 'indent_quantity',
                          'season', 'spa_code', [sequelize.col('year'), 'year_of_indent']],
                        where: { id: result.id }
                      });
                      returnResponse = spaUpdatedData[0]
                    }
                  } else {
                    data = indentOfSpaModel.build(dataRow);
                    const result = await data.save();
                    spaUpdatedData = await indentOfSpaModel.findAll({
                      attributes: ['id', 'crop_code', 'variety_code', 'state_code', 'indent_quantity',
                        'season', 'spa_code', [sequelize.col('year'), 'year_of_indent']],
                      where: { id: result.id }
                    });
                    returnResponse = spaUpdatedData[0]
                  }


                }
              });
              return response(res, status.DATA_SAVE, 200, [], internalCall);
            } else {
              return response(res, "Not Allowed", 401, [], internalCall);
            }

          } else {
            return response(res, "Permission Declined", 401, [], internalCall);
          }
        }
      } else {
        return response(res, "crop is not assign or not exist ", 404, [])
      }

      // else{
      //   return response(res, "Not Allowed", 401, [], internalCall);
      // }
    }
    catch (error) {
      console.log("error", error);
      returnResponse = error
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }

  static addIndentOfSpaDataHybrid = async (req, res) => {
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
      let { year, season } = req.body;

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
      let condition1 = {
        where: {
          year: parseInt(yearOfIndent),
          season: seasoneCode
        }
      };
      let indentPermission = await db.mIndentPermissionsModel.findOne(condition1);

      let isFreezeCheck = await indentOfBreederseedModel.findAll({
        include: [
          {
            model: userModel,
            attributes: [],
            include: [
              {
                model: agencyDetailModel,
                attributes: [],
                where: {
                  state_id: req.body.state_code,
                }
              }
            ],
          }
        ],
        attributes: ['is_freeze', 'icar_freeze'],
        where: {
          year: yearOfIndent,
          season: seasoneCode,
          crop_code: req.body.crop_code,
        },
        raw: true
      });

      let isDataModifyAllowed = false;
      if (isFreezeCheck && isFreezeCheck.length) {
        isFreezeCheck.forEach((ele) => {
          if (ele.is_freeze === 1) {
            isDataModifyAllowed = true;
            return;
          } else {
            isDataModifyAllowed = false;
          }
        })
      }

      if (isDataModifyAllowed) {
        return response(res, "No further changes can be made as indents have been freezed for the selected Year, Season, and Crop by Seed Division"
          , 400, [])
      } else {
        // ====================================================
        if (cropExistingData) {
          let spaInsertData = {};
          //edit indnt of SPA DATA
          let errorMsg;
          let getSpaIndentData;
          let varietyExistingData;
          if (req.params && req.params["id"]) {
            let date;
            if (indentPermission && indentPermission['is_allowed_update'] && indentPermission['is_allowed_update'] === 1) {
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
                    date = new Date(varietyExistingData[0]['not_date']).getFullYear();
                  }

                  const dataRow = {
                    year: yearOfIndent,
                    crop_type: cropType,
                    season: seasoneCode,
                    variety_id: varietyExistingData[0]['id'],
                    // variety_code:  varietyExistingData[0]['variety_code'],
                    variety_notification_year: date,
                    indent_quantity: items.indent_quantity ? items.indent_quantity : 0,
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

                    if (IndentBreederData && IndentBreederData[0] && IndentBreederData[0].dataValues) {
                      let IndentDataNew;
                      dataRow.indente_breederseed_id = IndentBreederData[0].dataValues.id;
                      dataRow.indenter_id = IndentBreederData[0].dataValues.user_id;
                      returnResponse = dataRow
                      let temp = IndentBreederData[0].dataValues.indent_quantity - getSpaIndentData[0].dataValues.indent_quantity;
                      if (items && items.variety_type && items.variety_type.toLowerCase().trim() == 'hybrid') {
                        if (items.lines && items.lines.length) {
                          let sumOfLineQnty = 0;
                          let spaLinesData;
                          let indenterLineData;
                          for (let ele of items.lines) {
                            let getSpaIndentLineData = await db.indentOfSpaLinesModel.findAll({ where: { indent_of_spa_id: req.params["id"], variety_code_line: ele.variety_code_line } });
                            let indenterLineDataList = await db.indentOfBrseedLines.findAll({
                              where: {
                                indent_of_breederseed_id: IndentBreederData[0].dataValues.id,
                                variety_code_line: ele.variety_code_line,
                              },
                              raw: true
                            })
                            if (indenterLineDataList && indenterLineDataList.length) {
                              let temp1 = indenterLineDataList[0].quantity - getSpaIndentLineData[0].dataValues.quantity;
                              console.log('temp1==', temp1)
                              indenterLineData = await db.indentOfBrseedLines.update({
                                quantity: temp1 + ele.quantity
                              }, {
                                where: {
                                  indent_of_breederseed_id: IndentBreederData[0].dataValues.id,
                                  variety_code_line: ele.variety_code_line,
                                }
                              })
                            }
                            sumOfLineQnty += parseFloat(ele.quantity);
                            spaLinesData = await db.indentOfSpaLinesModel.update(
                              { quantity: ele.quantity },
                              {
                                where: {
                                  indent_of_spa_id: req.params["id"],
                                  variety_code_line: ele.variety_code_line,
                                }
                              }
                            );
                          }

                          if (spaLinesData) {
                            await indentOfSpaModel.update({ indent_quantity: sumOfLineQnty ? sumOfLineQnty : 0 }, { where: { id: req.params["id"] } });
                          }
                          IndentDataNew = await indentOfBreederseedModel.update(
                            {
                              indent_quantity: temp + sumOfLineQnty
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
                        }
                      }
                      else {
                        console.log('else case');

                        spaInsertData = await indentOfSpaModel.update(dataRow, { where: { id: req.params["id"] } });
                        IndentDataNew = await indentOfBreederseedModel.update(
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
                      }
                    }
                  }
                });
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
            } else {
              return response(res, "Permission Declined", 401, [], internalCall);
            }
          }
          // indnt of SPA DATA
          else {
            if (indentPermission && indentPermission['is_allowed_new'] && indentPermission['is_allowed_new'] === 1) {
              //uncommnet after code complition
              let varietyLineCodeArray = [];
              let varietyCodeArray = [];
              if (req.body.varieties && req.body.varieties.length) {
                req.body.varieties.forEach((items) => {
                  if (items.variety_code || items.variety_code !== undefined || items.variety_code !== null) {
                    varietyCodeArray.push(items.variety_code);
                    if (items.lines && items.lines.length) {
                      items.lines.forEach((item) => {
                        if (item.variety_code_line || item.variety_code_line !== undefined || item.variety_code_line !== null) {
                          varietyLineCodeArray.push(item.variety_code_line);
                        }
                      })
                    }
                  }
                });
              }
              let varietyLineCodeArrayValue;
              let varietyCodeArrayValue;
              if (varietyLineCodeArray && varietyLineCodeArray.length) {
                varietyLineCodeArrayValue = {
                  include: [
                    {
                      model: db.indentOfSpaLinesModel,
                      where: {
                        variety_code_line: {
                          [Op.in]: varietyLineCodeArray
                        }
                      }
                    }
                  ],
                }
              }
              console.log("10571057105710571057")
              let spaDataCheck = await indentOfSpaModel.findAll(
                {
                  ...varietyLineCodeArrayValue,
                  where: {
                    year: yearOfIndent,
                    season: seasoneCode,
                    state_code: req.body.state_code,
                    spa_code: req.body.spa_code,
                    variety_code: {
                      [Op.in]: varietyCodeArray
                    }
                  }
                }
              );
              console.log("spaDataCheckspaDataCheck", spaDataCheck)
              if (spaDataCheck.length) {
                return response(res, "Already indented for same variety.", 404, [])

              }

              let date;
              let IndentBreederData;
              let IndentDataNew;
              let data;
              let varietyExistingData = {};
              console.log("req.body", req.body)
              req.body.varieties.forEach(async (items) => {
                // if(items.lines && items.lines.length){
                //   items.lines.forEach((item)=>{
                //     if(item.variety_code_line || item.variety_code_line !== undefined ||item.variety_code_line !== null){

                //     }
                //   })
                // }
                if (items.variety_code) {
                  varietyExistingData = await varietyModel.findAll(
                    {
                      where: {
                        variety_code: items.variety_code,
                      },
                      raw: true
                    }
                  );
                  date = new Date(varietyExistingData[0]['not_date']).getFullYear();
                }
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
                if (IndentBreederData && IndentBreederData[0] && IndentBreederData[0].dataValues) {
                  dataRow.indente_breederseed_id = IndentBreederData[0].dataValues.id;
                  dataRow.indenter_id = IndentBreederData[0].dataValues.user_id;
                  returnResponse = dataRow;
                  if (items && items.variety_type && items.variety_type.toLowerCase().trim() == 'hybrid') {
                    if (items.lines && items.lines.length) {
                      console.log('if case');
                      dataRow.indent_quantity = 0;
                      data = indentOfSpaModel.build(dataRow);
                      await data.save();
                      let sumOfLineQnty = 0;
                      let spaLinesData;
                      let indenterLineData;
                      for (let ele of items.lines) {
                        let indenterLineDataList = await db.indentOfBrseedLines.findAll({
                          where: {
                            indent_of_breederseed_id: IndentBreederData[0].dataValues.id,
                            variety_code_line: ele.variety_code_line,
                          },
                          raw: true
                        })
                        if (indenterLineDataList && indenterLineDataList.length) {
                          indenterLineData = await db.indentOfBrseedLines.update({
                            quantity: indenterLineDataList[0].quantity + ele.quantity
                          }, {
                            where: {
                              indent_of_breederseed_id: IndentBreederData[0].dataValues.id,
                              variety_code_line: ele.variety_code_line,
                            }
                          })
                        } else {
                          indenterLineData = await db.indentOfBrseedLines.create({
                            indent_of_breederseed_id: IndentBreederData[0].dataValues.id,
                            variety_code_line: ele.variety_code_line,
                            quantity: ele.quantity
                          })
                        }
                        sumOfLineQnty += parseFloat(ele.quantity);
                        spaLinesData = await db.indentOfSpaLinesModel.build(
                          {
                            indent_of_spa_id: data.dataValues.id,
                            variety_code_line: ele.variety_code_line,
                            quantity: ele.quantity
                          }
                        );
                        await spaLinesData.save();
                      }
                      if (spaLinesData) {
                        indentOfSpaModel.update({ indent_quantity: sumOfLineQnty }, { where: { id: data.dataValues.id } });
                      }
                      IndentDataNew = await indentOfBreederseedModel.update(
                        {
                          indent_quantity: IndentBreederData[0].dataValues.indent_quantity + sumOfLineQnty
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
                    }
                  }
                  else {
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
                }
                else {
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
                  IndentDataNew = await indentOfBreederseedModel.create({
                    "user_id": breederUserIdData[0].id,
                    "year": yearOfIndent,
                    "season": seasoneCode,
                    "crop_code": req.body.crop_code,
                    "crop_name": cropExistingData.dataValues.crop_name,
                    "group_name": cropExistingData.dataValues.crop_group,
                    "group_code": cropExistingData.dataValues.group_code,
                    "variety_notification_year": varietyExistingData[0]['not_date'],
                    "indent_quantity": items.indent_quantity ? items.indent_quantity : 0,
                    "unit": unitKgQ,
                    "variety_name": varietyExistingData[0]['variety_name'],
                    "variety_id": varietyExistingData[0]['id'],
                    "crop_type": cropType,
                    "season_id": req.body.season_id,
                    "variety_code": items.variety_code
                  })
                  if (items && items.variety_type && items.variety_type.toLowerCase().trim() == 'hybrid') {
                    if (items.lines && items.lines.length) {
                      console.log('if case');
                      dataRow.indent_quantity = 0;
                      data = indentOfSpaModel.build(dataRow);
                      const result = await data.save();

                      let sumOfLineQnty = 0;
                      let spaLinesData;
                      let indenterLineData;
                      for (let ele of items.lines) {
                        let indenterLineDataList = await db.indentOfBrseedLines.findAll({
                          where: {
                            indent_of_breederseed_id: IndentDataNew.dataValues.id,
                            variety_code_line: ele.variety_code_line,
                          },
                          raw: true
                        })
                        if (indenterLineDataList && indenterLineDataList.length) {
                          indenterLineData = await db.indentOfBrseedLines.update({
                            quantity: indenterLineDataList[0].quantity + ele.quantity
                          }, {
                            where: {
                              indent_of_breederseed_id: IndentDataNew.dataValues.id,
                              variety_code_line: ele.variety_code_line,
                            }
                          })
                        } else {
                          indenterLineData = await db.indentOfBrseedLines.create({
                            indent_of_breederseed_id: IndentDataNew.dataValues.id,
                            variety_code_line: ele.variety_code_line,
                            quantity: ele.quantity
                          })
                        }
                        sumOfLineQnty += parseFloat(ele.quantity);
                        spaLinesData = await db.indentOfSpaLinesModel.build(
                          {
                            indent_of_spa_id: data.dataValues.id,
                            variety_code_line: ele.variety_code_line,
                            quantity: ele && ele.quantity ? ele.quantity : 0
                          }
                        );
                        await spaLinesData.save();
                      }
                      if (spaLinesData) {
                        indentOfSpaModel.update({ indent_quantity: sumOfLineQnty }, { where: { id: data.dataValues.id } });
                      }
                      IndentDataNew = await indentOfBreederseedModel.update(
                        {
                          indent_quantity: IndentDataNew.dataValues.indent_quantity + sumOfLineQnty
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
                      spaUpdatedData = await indentOfSpaModel.findAll({
                        attributes: ['id', 'crop_code', 'variety_code', 'state_code', 'indent_quantity',
                          'season', 'spa_code', [sequelize.col('year'), 'year_of_indent']],
                        where: { id: result.id }
                      });
                      returnResponse = spaUpdatedData[0]
                    }
                  } else {
                    data = indentOfSpaModel.build(dataRow);
                    const result = await data.save();
                    spaUpdatedData = await indentOfSpaModel.findAll({
                      attributes: ['id', 'crop_code', 'variety_code', 'state_code', 'indent_quantity',
                        'season', 'spa_code', [sequelize.col('year'), 'year_of_indent']],
                      where: { id: result.id }
                    });
                    returnResponse = spaUpdatedData[0]
                  }


                }
              });
              return response(res, status.DATA_SAVE, 200, [], internalCall);
            } else {
              return response(res, "Permission Declined", 401, [], internalCall);
            }
          }
        } else {
          return response(res, "crop is not assign or not exist ", 404, [])
        }
      }

    }
    catch (error) {
      console.log("error", error);
      returnResponse = error
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }

  static delteIndentOfSpaDataHybrid = async (req, res) => {
    let returnResponse = {};
    let internalCall = {};

    try {
      let stateCode;
      let IndentBreederData;
      if (req.body.id) {
        let getSpaIndentData = await indentOfSpaModel.findAll({ where: { id: req.body.id } });

        if (getSpaIndentData && getSpaIndentData[0] && getSpaIndentData[0].dataValues) {
          let isPermission = await db.mIndentPermissionsModel.findOne({
            attributes: ['is_deleted'],
            where: {
              year: getSpaIndentData[0].dataValues.year ? getSpaIndentData[0].dataValues.year : '',
              season: getSpaIndentData[0].dataValues.season ? getSpaIndentData[0].dataValues.season : '',

            },
            rew: true
          });
          if (isPermission && isPermission['is_deleted'] && isPermission['is_deleted'] === 1) {
            if (getSpaIndentData && getSpaIndentData[0] && getSpaIndentData[0].dataValues && getSpaIndentData[0].dataValues.state_code) {
              stateCode = {
                where: {
                  state_id: getSpaIndentData[0].dataValues.state_code
                }
              }
            }
            let breederUserIdData;
            if (getSpaIndentData && getSpaIndentData[0] && getSpaIndentData[0].dataValues && getSpaIndentData[0].dataValues.state_code) {
              breederUserIdData = await userModel.findAll({
                include: [{
                  model: agencyDetailModel,
                  where: {
                    state_id: getSpaIndentData[0].dataValues.state_code
                  }
                }],
                where: {
                  user_type: "IN"
                }
              });
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
                  crop_code: getSpaIndentData[0].dataValues.crop_code,
                  year: getSpaIndentData[0].dataValues.year,
                  variety_id: getSpaIndentData[0].dataValues.variety_id,
                  season: getSpaIndentData[0].dataValues.season
                }
              }
            );
            console.log('IndentBreederData===', IndentBreederData)
            let isFreezeIndent = {}
            IndentBreederData.forEach(ele => {
              if (ele.is_freeze === 0) {
                isFreezeIndent = {
                  "indenter_allow": true
                }
                return;
              } else {
                isFreezeIndent = {
                  "indenter_allow": false
                }
              }

            })
            console.log('isFreezeIndent', isFreezeIndent);
            // return;
            if (isFreezeIndent && isFreezeIndent.indenter_allow) {
              let IndentBreederDataLine = await db.indentOfBrseedLines.findAll(
                {
                  where: {
                    indent_of_breederseed_id: IndentBreederData[0].dataValues.id
                  }
                }
              );
              let getSpaIndentDataLine = await db.indentOfSpaLinesModel.findAll({ where: { indent_of_spa_id: req.body.id } });

              let finalIndentQunatity = IndentBreederData[0].dataValues.indent_quantity - getSpaIndentData[0].dataValues.indent_quantity;

              if (getSpaIndentDataLine && getSpaIndentDataLine.length) {

                getSpaIndentDataLine.forEach(async (ele) => {
                  let lineData = IndentBreederDataLine.filter(item => item.variety_code_line === ele.variety_code_line)
                  let lineQntValue = lineData[0].dataValues.quantity - ele.quantity
                  if (lineQntValue > 0) {
                    let IndentDataNewLine = await db.indentOfBrseedLines.update(
                      {
                        quantity: lineQntValue
                      },
                      {
                        where: {
                          indent_of_breederseed_id: IndentBreederData[0].dataValues.id,
                          variety_code_line: ele.variety_code_line
                        }
                      });
                    returnResponse = {};
                    let bkpSpaLineCheck = await this.backupIndenetOfSPALines(req.body.id, ele.variety_code_line);
                    if (1 || bkpSpaLineCheck) {
                      await db.indentOfSpaLinesModel.destroy({
                        where: {
                          indent_of_spa_id: req.body.id
                        }
                      });
                    }
                  } else {
                    let bkpSpaLineCheck = await this.backupIndenetOfSPALines(req.body.id, ele.variety_code_line);
                    if (1 || bkpSpaLineCheck) {
                      await db.indentOfSpaLinesModel.destroy({
                        where: {
                          indent_of_spa_id: req.body.id
                        }
                      });
                    }
                    let bkpLinesCheck = await this.backupIndenetOfBreederseedLines(IndentBreederData[0].dataValues.id, ele.variety_code_line);
                    if (1 || bkpLinesCheck) {

                      await db.indentOfBrseedLines.destroy({
                        where: {
                          indent_of_breederseed_id: IndentBreederData[0].dataValues.id
                        }
                      });
                    }
                  }
                })

                if (finalIndentQunatity > 0) {

                  let IndentDataNew = await indentOfBreederseedModel.update(
                    {
                      indent_quantity: finalIndentQunatity
                    },
                    {
                      where: {
                        user_id: breederUserIdData[0].id,
                        crop_code: getSpaIndentData[0].dataValues.crop_code,
                        year: getSpaIndentData[0].dataValues.year,
                        variety_id: getSpaIndentData[0].dataValues.variety_id,
                        season: getSpaIndentData[0].dataValues.season
                      }
                    });

                  returnResponse = {};
                  let bkpSpaCheck = await this.backupIndenetOfSPA(req.body.id);
                  if (1 || bkpSpaCheck) {
                    await indentOfSpaModel.destroy({
                      where: {
                        id: req.body.id
                      }
                    });
                  }
                  return response(res, status.DATA_DELETED, 200, [], internalCall);
                } else {
                  let bkpSpaCheck = await this.backupIndenetOfSPA(req.body.id);
                  if (1 || bkpSpaCheck) {
                    await indentOfSpaModel.destroy({
                      where: {
                        id: req.body.id
                      }
                    });
                  }
                  let bkpCheck = await this.backupIndenetOfBreederseed(IndentBreederData[0].dataValues.id);
                  console.log("bkpCheck", bkpCheck)
                  if (1 || bkpCheck) {
                    console.log("innerrrr", bkpCheck)

                    await indentOfBreederseedModel.destroy({
                      where: {
                        id: IndentBreederData[0].dataValues.id
                      }
                    });
                  }
                  return response(res, status.DATA_DELETED, 200, [], internalCall);
                }
              } else {
                if (IndentBreederData) {
                  if (finalIndentQunatity > 0) {
                    // indent_quantity
                    let IndentDataNew = await indentOfBreederseedModel.update(
                      {
                        indent_quantity: finalIndentQunatity
                      },
                      {
                        where: {
                          user_id: breederUserIdData[0].id,
                          crop_code: getSpaIndentData[0].dataValues.crop_code,
                          year: getSpaIndentData[0].dataValues.year,
                          variety_id: getSpaIndentData[0].dataValues.variety_id,
                          season: getSpaIndentData[0].dataValues.season
                        }
                      });

                    returnResponse = {};
                    let bkpSpaCheck = await this.backupIndenetOfSPA(req.body.id);
                    if (1 || bkpSpaCheck) {
                      await indentOfSpaModel.destroy({
                        where: {
                          id: req.body.id
                        }
                      });
                    }
                    return response(res, status.DATA_DELETED, 200, [], internalCall);
                  } else {
                    let bkpSpaCheck = await this.backupIndenetOfSPA(req.body.id);
                    if (1 || bkpSpaCheck) {
                      await indentOfSpaModel.destroy({
                        where: {
                          id: req.body.id
                        }
                      });
                    }
                    let bkpCheck = await this.backupIndenetOfBreederseed(IndentBreederData[0].dataValues.id);
                    console.log("bkpCheck", bkpCheck)
                    if (1 || bkpCheck) {
                      console.log("innerrrr", bkpCheck)

                      await indentOfBreederseedModel.destroy({
                        where: {
                          id: IndentBreederData[0].dataValues.id
                        }
                      });
                    }
                    return response(res, status.DATA_DELETED, 200, [], internalCall);
                  }
                }
              }
            } else {
              return response(res, "Delete Not Allowed", 404, []);
            }

          } else {
            return response(res, "Permission Declined", 404, []);
          }
        } else {
          return response(res, "Id not exist.", 404, []);
        }
      } else {
        return response(res, "SPAs not exist or SPAs id is required ", 409, []);
      }
    } catch (error) {
      console.log('error', error);
      returnResponse = error;
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);

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
  static getIndentOfSpaDataHybrid = async (req, res) => {
    let returnResponse = {};
    let internalCall = {};
    try {
      let rules = {
        "year_of_indent": 'required|string',
        "season": 'required|string',
        "state_code": 'required|integer',
        "spa_code": 'required|string',
      };

      let validation = new Validator(req.body, rules);

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
        include: [
          {
            model: cropModel,
            attributes: []
          },
          {
            model: varietyModel,
            attributes: [],
            required: true,

          },
          {
            model: stateModel,
            attributes: []
          },
          {
            model: seasonModel,
            attributes: []
          },
          {
            model: db.indentOfSpaLinesModel,
            attributes: [],
            include: [
              {
                attributes: [],
                model: db.varietLineModel
              }
            ]
          }
        ],
        where: {
          is_active: 1
        },
        attributes: [
          // indents of SPA table data
          // [sequelize.col('indent_of_spas.id'), 'id'],
          [sequelize.fn('DISTINCT', sequelize.col('indent_of_spas.id')), 'id'],

          [sequelize.col('indent_of_spas.year'), 'year'],
          [sequelize.col('indent_of_spas.crop_type'), 'crop_type'],
          [sequelize.col('indent_of_spas.created_at'), 'generate_date'],
          [sequelize.col('indent_of_spas.spa_code'), 'spa_code'],
          [sequelize.col('indent_of_spa_line.variety_code_line'), 'variety_code_line'],
          [sequelize.col('indent_of_spa_line.id'), 'line_id'],
          [sequelize.col('indent_of_spa_line.quantity'), 'line_quantity'],
          // [sequelize.col('indent_of_spas.variety_notification_year'), 'variety_notification_year'],
          [sequelize.col('indent_of_spas.indent_quantity'), 'indent_quantity'],
          [sequelize.col('indent_of_spas.unit'), 'unit'],
          [sequelize.col('indent_of_spas.is_active'), 'is_active'],
          [sequelize.col('indent_of_spas.user_id'), 'user_id'],
          [sequelize.col('indent_of_spas.created_at'), 'created_at'],
          [sequelize.col('indent_of_spas.updated_at'), 'updated_at'],
          [sequelize.col('indent_of_spa_line->m_variety_line.line_variety_name'), 'line_variety_name'],

          //other join table data
          [sequelize.col('m_crop.crop_name'), 'crop_name'],
          [sequelize.col('m_crop.crop_code'), 'crop_code'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [sequelize.col('m_crop_variety.variety_code'), 'variety_code'],
          [sequelize.col('m_crop_variety.status'), 'variety_type'],

          [sequelize.col('m_crop_variety.not_date'), 'not_date'],
          [sequelize.col('m_state.state_name'), 'state_name'],
          [sequelize.col('m_state.state_code'), 'state_code'],
          [sequelize.col('m_season.season'), 'season'],
          [sequelize.col('m_season.season_code'), 'season_code'],
        ],
        raw: true
      }
      if (req.body) {
        if (req.body.spa_code) {
          condition.where.spa_code = req.body.spa_code;
        }
        if (req.body.year_of_indent) {
          condition.where.year = parseInt(req.body.year_of_indent.slice(0, 4).trim());
        }
        if (req.body.season) {
          condition.where.season = (req.body.season.slice(0, 1).toUpperCase().trim());
        }
        if (req.body.state_code) {
          condition.where.state_code = (req.body.state_code);
        }
      }
      let getSpaIndentData = await indentOfSpaModel.findAll(condition);
      const filteredData = [];

      getSpaIndentData.forEach(el => {
        const spaIndex = filteredData.findIndex(item => item.variety_code == el.variety_code);
        if (spaIndex === -1) {

          if (el.variety_type && el.variety_type == 'hybrid') {


            filteredData.push({
              id: el.id ? el.id : '',
              year: el.year ? el.year : '',
              season: el.season ? el.season : '',
              season_code: el.season_code ? el.season_code : '',
              crop_name: el.crop_name ? el.crop_name : '',
              crop_code: el.crop_code ? el.crop_code : '',
              variety_name: el.variety_name,
              variety_code: el.variety_code,
              variety_type: el.variety_type,
              variety_notification_year: el.not_date ? el.not_date : '',
              indent_quantity: el.indent_quantity,
              generate_date: el.generate_date ? el.generate_date : '',
              created_at: el.created_at ? el.created_at : '',
              unit: el.unit ? el.unit : '',
              state_name: el.state_name ? el.state_name : '',
              state_code: el.state_code ? el.state_code : '',
              count: 1,
              "lines": [
                {
                  indent_of_spa_id: el.id ? el.id : '',
                  line_id: el.line_id ? el.line_id : '',
                  variety_code_line: el.variety_code_line ? el.variety_code_line : '',
                  line_variety_name: el.line_variety_name ? el.line_variety_name : '',
                  line_quantity: el.line_quantity ? el.line_quantity : '',
                  count: 1,
                }
              ]
            });
          } else {


            filteredData.push({
              id: el.id ? el.id : '',
              year: el.year ? el.year : '',
              season: el.season ? el.season : '',
              season_code: el.season_code ? el.season_code : '',
              crop_name: el.crop_name ? el.crop_name : '',
              crop_code: el.crop_code ? el.crop_code : '',
              variety_name: el.variety_name,
              variety_code: el.variety_code,
              variety_type: el.variety_type,
              variety_notification_year: el.not_date ? el.not_date : '',
              indent_quantity: el.indent_quantity,
              generate_date: el.generate_date ? el.generate_date : '',
              created_at: el.created_at ? el.created_at : '',
              unit: el.unit ? el.unit : '',
              state_name: el.state_name ? el.state_name : '',
              state_code: el.state_code ? el.state_code : '',
              count: 1,
              "lines": [

              ]
            });
          }

        } else {
          // const cropIndex = filteredData[spaIndex].lines.findIndex(item => item.variety_code_line == el.variety_code_line);
          // if (cropIndex !== -1) {
          //   filteredData[spaIndex].lines[cropIndex].bspc.push(
          //     {
          //       line_id: el.line_id ? el.line_id:'',
          //       variety_code_line: el.variety_code_line ? el.variety_code_line:'',
          //       variety_code: el.variety_code ?  el.variety_code:'',
          //       line_quantity: el.line_quantity ? el.line_quantity:'',
          //       count: 1,
          //     }
          //   );
          // } else {
          if (el.variety_type && el.variety_type == 'hybrid')
            filteredData[spaIndex].lines.push({
              indent_of_spa_id: el.id ? el.id : '',
              line_id: el.line_id ? el.line_id : '',
              variety_code_line: el.variety_code_line ? el.variety_code_line : '',
              line_variety_name: el.line_variety_name ? el.line_variety_name : '',
              line_quantity: el.line_quantity ? el.line_quantity : '',
              count: 1,
            });
          // }
        }
      });

      let responseData = [];
      if (filteredData && filteredData.length) {
        filteredData.forEach((item, i) => {
          filteredData[i].count = 0;
          if (item.lines && item.lines.length > 0) {
            filteredData[i].count += item.lines.length;
          }
        });
      }
      responseData = filteredData;
      return response(res, status.DATA_AVAILABLE, 200, responseData);
    } catch (error) {
      console.log('error', error);
      returnResponse = error;
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }

  static getSpaAllocationDetails = async (req, res) => {
    try {
      let returnResponse = {};
      let internalCall = {};
      let rules = {
        'state_code': 'required',
        'spa_code': 'required|string',
        'indent_year': 'required|string',
        'season': 'required|string'
      };

      let validation = new Validator(req.query, rules);

      const isValidData = validation.passes();
      console.log("req.query,", req.query)
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
      if (req.body && req.query.sector) {
        sectorStateData = await sectorData.find(ele => ele.name == req.query.sector.toUpperCase())
        if (sectorStateData && sectorStateData !== undefined) {
          req.query.state_code = sectorStateData.state_code;
        }
      }

      const { state_code, spa_code, indent_year, season } = req.query

      let reportData11 = [
        // "EncryptedResponse": {
        //   "status_code": 200,
        //  "message": "Data found successfully",
        // "data": [
        {
          "id": 296,
          "indent_quantity": 40,
          "crop_name": "WHEAT (GEHON)",
          "crop_code": "A0104",
          "variety_name": "RAJLAKSHMI (HP-1731)",
          "variety_code": "A0104008",
          "allotted_quantity": 30,
          "bspc_name": "OJHA",
          "bspc_code": "0029",
          "unit": "Quintal"
        },
        {
          "id": 297,
          "indent_quantity": 40,
          "crop_name": "WHEAT (GEHON)",
          "crop_code": "A0104",
          "variety_name": "RAJLAKSHMI (HP-1731)",
          "variety_code": "A0104008",
          "allotted_quantity": 16,
          "bspc_name": "OJHA",
          "bspc_code": "0029",
          "unit": "Quintal"
        },
        {
          "id": 298,
          "indent_quantity": 60,
          "crop_name": "WHEAT (GEHON)",
          "crop_code": "A0104",
          "variety_name": "ADITYA (HD-2781)",
          "variety_code": "A0104062",
          "allotted_quantity": 5,
          "bspc_name": "OJHA",
          "bspc_code": "0029",
          "unit": "Quintal"
        },
        {
          "id": 299,
          "indent_quantity": 60,
          "crop_name": "WHEAT (GEHON)",
          "crop_code": "A0104",
          "variety_name": "ADITYA (HD-2781)",
          "variety_code": "A0104062",
          "allotted_quantity": 15,
          "bspc_name": "OJHA",
          "bspc_code": "0029",
          "unit": "Quintal"
        }
        //]
        //}
      ]
      // return response(res, "Data found successfully", 200, reportData11, internalCall)

      // let bsp1Data = await db.sequelize.query(`SELECT indent_data.*,nucleus_seed_availabilities."quantity" FROM (SELECT DISTINCT("bsp1_production_centers->user"."name") AS "bspc_name", bsp_1s."year",bsp_1s."crop_code", bsp_1s."season",SUM("bsp1_production_centers"."quantity_of_seed_produced") AS "quantity_of_seed_produced", "bsp_1s"."variety_id" AS "variety_id", bsp1_production_centers."production_center_id","m_crop_variety"."variety_code" AS "variety_code", "m_crop_variety"."variety_name" AS "variety_name",SUM("indent_of_breederseed"."indent_quantity") AS indent_quantity FROM "bsp_1s" AS "bsp_1s" INNER JOIN "bsp1_production_centers" AS "bsp1_production_centers" ON "bsp_1s"."id" = "bsp1_production_centers"."bsp_1_id"  INNER JOIN "indent_of_breederseeds" AS "indent_of_breederseed" ON "bsp_1s"."indent_of_breederseed_id" = "indent_of_breederseed"."id" INNER JOIN "users" AS "bsp1_production_centers->user" ON "bsp1_production_centers"."production_center_id" = "bsp1_production_centers->user"."id" INNER JOIN "m_crop_varieties" AS "m_crop_variety" ON "bsp_1s"."variety_id" = "m_crop_variety"."id" ${variety} WHERE "bsp_1s"."year" = '${year}' AND "bsp_1s"."crop_code" LIKE '${crop_type}%' AND "bsp_1s"."season" = '${season}' ${[crop]} GROUP BY  bsp_1s."year", bsp_1s."crop_code",bsp_1s."season", "bsp_1s"."variety_id","indent_of_breederseed"."indent_quantity","bsp1_production_centers->user"."name","m_crop_variety"."variety_code","m_crop_variety"."variety_name", bsp1_production_centers."production_center_id") AS indent_data LEFT OUTER JOIN nucleus_seed_availabilities ON nucleus_seed_availabilities."production_center_id" = indent_data."production_center_id" AND  nucleus_seed_availabilities."year" = indent_data."year" AND  nucleus_seed_availabilities."season" = indent_data."season" AND  nucleus_seed_availabilities."variety_code" = indent_data."variety_code"`, { replacements: ['active'], type: sequelize.QueryTypes.SELECT });

      let spaData = await db.sequelize.query(`SELECT DISTINCT(allocation_to_spa_for_lifting_seed_production_cnters.id), indent_of_spas.indent_quantity, m_crops.crop_name, m_crops.crop_code, m_crop_varieties.variety_name, m_crop_varieties.variety_code, allocation_to_spa_for_lifting_seed_production_cnters.qty as allotted_quantity,users.name AS bspc_name, users.code AS bspc_code, case WHEN m_crops.crop_code Like 'A%' THEN 'Quintal' ELSE 'KG' END AS unit
      FROM indent_of_spas
      LEFT JOIN m_crops ON m_crops.crop_code = indent_of_spas.crop_code
      LEFT JOIN m_crop_varieties ON m_crop_varieties.variety_code = indent_of_spas.variety_code
      LEFT JOIN allocation_to_spa_for_lifting_seeds ON allocation_to_spa_for_lifting_seeds.variety_id= indent_of_spas.variety_id AND allocation_to_spa_for_lifting_seeds.season= indent_of_spas.season AND 
      allocation_to_spa_for_lifting_seeds.year= indent_of_spas.year 
      LEFT join allocation_to_spa_for_lifting_seed_production_cnters ON allocation_to_spa_for_lifting_seed_production_cnters.allocation_to_spa_for_lifting_seed_id = allocation_to_spa_for_lifting_seeds.id
      LEFT JOIN users on users.id = allocation_to_spa_for_lifting_seed_production_cnters.production_center_id
      WHERE "allocation_to_spa_for_lifting_seed_production_cnters"."state_code" = ${state_code} AND "allocation_to_spa_for_lifting_seed_production_cnters"."spa_code" = '${spa_code}' AND "indent_of_spas"."state_code" = ${state_code} AND "indent_of_spas"."spa_code" = '${spa_code}' AND "indent_of_spas"."year" =  '${indent_year}' AND "indent_of_spas"."season" =  '${season}'
      AND allocation_to_spa_for_lifting_seed_production_cnters.id IS NOT NULL`, { replacements: ['active'], type: sequelize.QueryTypes.SELECT });
      console.log("spaData", spaData)

      // const { id = "" } = req.params;
      // console.log('id', id);
      // let allocationToSPA;
      // // const allocationToSPA = await allocationToSPASeed.findOne({
      // //     include: [
      // //         {
      // //             attributes: ['id', 'crop_name', 'crop_code'],
      // //             model: cropModel,
      // //             left: true,
      // //         },
      // //         {
      // //             attributes: ['id', 'variety_name', 'variety_code'],
      // //             model: varietyModel,
      // //             left: true,
      // //         }
      // //     ],
      // //     where: {
      // //         id,
      // //     },
      // //     raw: true,
      // //     nest: true
      // // });
      // // console.log('allocationToSPA', allocationToSPA);
      // const productionCenters = await allocationToSPAProductionCenterSeed.findAll({
      //     include: [
      //         {
      //             attributes: ['id', 'name'],
      //             model: userModel,
      //             left: true,
      //         },
      //         {
      //             attributes: ['id', 'user_id', 'indent_quantity', 'unit', 'spa_code'],
      //             model: indenterSPAModel,
      //             left: true,
      //             include: {
      //                 attributes: ['id', 'name'],
      //                 model: userModel,
      //                 left: true,
      //             },
      //             // where: {
      //             //     crop_code: allocationToSPA.crop_code,
      //             //     variety_id: allocationToSPA.variety_id,
      //             //     year: allocationToSPA.year
      //             // }
      //             where:{
      //               state_code:req.query.state_code,
      //               spa_code:req.query.spa_code,
      //               year:req.query.indent_year,
      //               season:req.query.season_code
      //             },
      //         }
      //     ],
      //     // where: {
      //     //     allocation_to_spa_for_lifting_seed_id: allocationToSPA.id
      //     // },
      //     raw: true,
      //     nest: true,
      // });
      // console.log('productionCenters', productionCenters);
      // let productionCenterAll = [];
      // let indentors = [];
      // let uniqueIndentors = [];
      // const productionCenterData = await Promise.all(productionCenters.map(async (el, index) => {

      //     productionCenterAll.push({
      //         id: el.id,
      //         qty: el.qty,
      //         produ: el.production_center_id,
      //         user: {
      //             name: el.user.name
      //         },
      //         alloc: el.allocated_quantity,
      //         quantityLeft: el.quantity_left_for_allocation
      //     });
      //     const indentor = uniqueIndentors.includes(el.spa_code);
      //     console.log('indentor', indentor);
      //     const indentorsData = {
      //         id: el.id,
      //         indentor_id: el.spa_code,
      //         indent_quantity: el.indent_of_spas.indent_quantity,
      //         user_id: el.indent_of_spas.user_id,
      //         unit: el.indent_of_spas.unit,
      //         user: {
      //             name: el.indent_of_spas.user.name
      //         },
      //         allocated_quantity: el.allocated_quantity,
      //         quantity_left_for_allocation: el.quantity_left_for_allocation,
      //         productions: [
      //             {
      //                 id: el.id,
      //                 qty: el.qty,
      //                 productionCenter: {
      //                     id: el.production_center_id,
      //                     text: el.user.name
      //                 }
      //             }
      //         ]
      //     };
      //     console.log('indentorsData', indentorsData);
      //     if (!indentor) {
      //         uniqueIndentors.push(el.spa_code);
      //         indentors.push(indentorsData);
      //     } else {
      //         const index = indentors.findIndex((data) => data.indentor_id === el.spa_code);
      //         console.log('index', index);
      //         if (index !== -1) {
      //             indentors[index].productions.push({
      //                 id: el.id,
      //                 qty: el.qty,
      //                 productionCenter: {
      //                     id: el.production_center_id,
      //                     text: el.user.name
      //                 }
      //             })
      //         }
      //     }
      // }));
      // allocationToSPA.indentors = indentors;
      // allocationToSPA.productionCenters = productionCenterAll;
      return response(res, status.DATA_AVAILABLE, 200, spaData);
    }
    catch (error) {
      console.log('error: ' + error);
      const returnResponse = {
        message: error.message,
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }

  static createUserFromIndentorData = async (req, res) => {
    try {
      const { state_code } = req.query
      const result = await SeedUserManagement.createUserFromIndentorData(state_code);

      return response(res, status.DATA_AVAILABLE, 200, {
        message: result
      });

    } catch (error) {
      const returnResponse = {
        message: error.message,
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }

  static checkIndentValidation = async (req, res) => {
    try {
      let internalCall = {};
      let rules = {
        'state_code': 'required',
        'crop_code': 'required|string',
        'year_of_indent': 'required',
        'season': 'required|string',
      };

      let validation = new Validator(req.query, rules);
      const isValidData = validation.passes();

      console.log("req.query,", req.query)
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

      if (req.query && req.query.sector) {
        let stateCode = await SeedUserManagement.getStateCode(req.query.sector)

        if (stateCode)
          req.query.state_code = stateCode.stateCode
      }

      let { state_code, crop_code, year_of_indent, season, sector } = req.query
      console.log("state_code", state_code)
      let freezeIndent = await indentOfSpaModel.findAll({ where: { state_code, crop_code, season: season.slice(0, 1), year: parseInt(year_of_indent.slice(0, 4)), is_freeze: 1 } });
      let indenterId = await agencyDetailModel.findOne(
        {
          include: [
            {
              model: userModel,
              attributes: [],
              where: { user_type: 'IN' }
            }],
          attributes: [sequelize.col('agency_details.user_id'), 'user_id'],
          where: { state_id: state_code }
        },
      )
      console.log("indenterId", indenterId.user_id)
      let freezeBySeedDivision = { id: 1 }
      if (indenterId && indenterId.user_id) {
        freezeBySeedDivision = await indentOfBreederseedModel.findAll(
          { where: { user_id: indenterId.user_id, crop_code, season: season.slice(0, 1), year: parseInt(year_of_indent.slice(0, 4)), is_freeze: 1 } });

      }

      if ((freezeIndent && freezeIndent.length) || (freezeBySeedDivision && freezeBySeedDivision.length))
        return response(res, status.DATA_AVAILABLE, 200, { "is_indent_allow": false });
      else
        return response(res, status.DATA_AVAILABLE, 200, { "is_indent_allow": true });
    }
    catch (error) {
      console.log('error: ' + error);
      const returnResponse = {
        message: error.message,
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }

  static assignedInspectionList = async (req, res) => {
    try {
      let internalCall = {};
      let rules = {
        'email_id': 'required',
      };

      let validation = new Validator(req.query, rules);
      console.log("validation", validation)
      const isValidData = validation.passes();
      console.log("isValidData", isValidData)

      console.log("req.query,", req.query)
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

      let data = [
        {
          "year": 2024,
          "season": R,
          "crop_code": "A0101",
          "variety_code": "A0101001",
          "state_code": 19,
          "district_code": 101,
          "address": "Field Address",
          "field_code": "field_code", //unique code of every field
          "area_shown": 2.5,
          "date_of_showing": "2024-11-01",
          "neclues_seed": 13.5,
          "breeder_seed": 10.5,
          "target": 210,
          "expected_production": 200.5,
          "status": "Pending",
          "inspection_date": "2024-12-01"

        },
        {
          "year": 2024,
          "season": R,
          "crop_code": "A0101",
          "variety_code": "A0101001",
          "state_code": 19,
          "district_code": 101,
          "address": "Field Address",
          "field_code": "field_code", //unique code of every field
          "area_shown": 2.5,
          "date_of_showing": "2024-11-01",
          "neclues_seed": 13.5,
          "breeder_seed": 10.5,
          "target": 210,
          "expected_production": 200.5,
          "status": "Pending",
          "inspection_date": "2024-12-01"
        },
        {
          "year": 2024,
          "season": R,
          "crop_code": "A0101",
          "variety_code": "A0101002",
          "state_code": 19,
          "district_code": 101,
          "address": "Field Address",
          "field_code": "field_code", //unique code of every field
          "area_shown": 2.5,
          "date_of_showing": "2024-11-01",
          "neclues_seed": 10.5,
          "breeder_seed": 11.5,
          "target": 110,
          "expected_production": 120.5,
          "status": "Pending",
          "inspection_date": "2024-12-01"
        }
      ]

      if (data && data.length)
        return response(res, status.DATA_AVAILABLE, 200, data);
      else
        return response(res, status.DATA_NOT_AVAILABLE, 200, []);
    }
    catch (error) {
      console.log('error: ' + error);
      const returnResponse = {
        message: error.message,
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }

  static checkCropFreezedStatus = async (req, res) => {
    try {
      let rules = {
        'season': 'required|string',
        'crop_code': 'required|string',
        'year': 'required|integer',
        'state_code': 'required',
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
        return response(res, status.BAD_REQUEST, 400, errorResponse, [])
      }

      let sectorStateData;
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
      ];

      let condition = {
        include: [
          {
            model: agencyDetailModel,
            where: {},
            attributes: []
          }
        ],
        where: {},
        raw: true
      }

      if (req.body) {
        if (req.body.state_code) {
          if (req.body.sector) {
            sectorStateData = await sectorData.find(ele => ele.name == req.body.sector.toUpperCase())
            if (sectorStateData && sectorStateData !== undefined) {
              req.body.state_code = sectorStateData.state_code;
            }
          }
          condition.include[0].where.state_id = parseInt(req.body.state_code);
        }
        if (req.body.year) {
          condition.where.year = req.body.year
        }
        if (req.body.crop_code) {
          condition.where.crop_code = req.body.crop_code
        }
        if (req.body.season) {
          condition.where.season = req.body.season.slice(0, 1)
        }
      }
      let data = await indentOfBreederseedModel.findAll(condition);
      let isstatus;
      let isIndenterExits = [];
      let isIndenterNotExist = [];

      if (data && data !== undefined && data.length > 0) {
        data.forEach(ele => {
          if (ele && ele.is_indenter_freeze === 1) {
            isIndenterExits.push(ele);
          } else {
            isIndenterNotExist.push(ele);
          }
        });

        if (isIndenterExits && isIndenterExits !== undefined && isIndenterExits.length > 0) {
          isstatus = { status: true }
        } else {
          isstatus = { status: false }
        }
        return response(res, status.DATA_AVAILABLE, 200, isstatus)
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 401, [])
      }
    } catch (error) {
      return response(res, status.UNEXPECTED_ERROR, 501)
    }
  }

  static getCropListData = async (req, res) => {
    try {
      let season;
      if (req.query) {
        if (req.query.season) {
          season = {
            [Op.or]: [
              {
                season: req.query.season.slice(0, 1)
              },
              {
                season: 'B'
              },
            ]
          }
        }
      }
      let condition = {
        attributes: [
          [sequelize.col('m_crops.crop_code'), 'cropCode'],
          [sequelize.col('m_crops.crop_name'), 'cropName'],
        ],
        where: {
          ...season,
          season: {
            [Op.not]: 'No'
          }
        },
        raw: true
      }
      condition.order = [['crop_name', 'ASC']];
      let { page, pageSize, search } = req.body;
      // if (page === undefined) page = 1;
      // if (pageSize === undefined)  // set pageSize to -1 to prevent sizing
      //   if (page > 0 && pageSize > 0) {
      //     condition.limit = pageSize;
      //     condition.offset = (page * pageSize) - pageSize;
      //   }
      let data = await cropModel.findAll(condition);
      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    } catch (error) {
      console.log("error", error)
      return response(res, status.UNEXPECTED_ERROR, 501)
    }
  }
  static getVarietyListData = async (req, res) => {
    try {
      const { crop_code } = req.query;
      let cropCodeValue;
      if (crop_code) {
        cropCodeValue = {
          crop_code: crop_code
        }
      }
      let condition = {
        attributes: [
          [sequelize.col('m_crop_varieties.variety_code'), 'varietyCode'],
          [sequelize.col('m_crop_varieties.variety_name'), 'varietyName'],
          [sequelize.col('m_crop_varieties.not_date'), 'notificationDate'],
          [sequelize.col('m_crop_varieties.status'), 'variety_type']

        ],
        where: {
          [Op.or]: [
            {
              ...cropCodeValue
            },

          ],
          status: {
            [Op.not]: 'other'
          }
        },
        raw: true
      }

      condition.order = [['variety_name', 'ASC']];
      let data = await varietyModel.findAll(condition);
      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    } catch (error) {
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 501)
    }
  }

  static getVarietyLineData = async (req, res) => {
    try {
      const { variety_code } = req.query;
      if (!variety_code) {
        return response(res, status.BAD_REQUEST, 400, {
          message: "variety_code is required in the request body.",
        });
      }
      const result = await mVarietyLinesModel.findAll({
        attributes: ["line_variety_name", [sequelize.literal('"line_variety_code"'), 'variety_code_line']],
        where: {
          variety_code: variety_code,
        },
      });
      response(res, status.DATA_AVAILABLE, 200, result)
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal server error' });
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
  static getBSPCList = async (req, res) => {
    try {
      let condition = {
        include: [
          {
            model: agencyDetailModel,
            attributes: [],
            include: [
              {
                model: db.designationModel,
                attributes: []
              },
              {
                model: db.stateModel,
                attributes: []
              },
              {
                model: db.districtModel,
                attributes: []
              }
            ]
          },

        ],
        where: {
          user_type: 'BPC'
        },
        raw: true,
        attributes: [
          [sequelize.col('users.id'), 'id'],
          [sequelize.col('users.name'), 'name'],
          [sequelize.col('users.email_id'), 'email_id'],
          [sequelize.col('users.mobile_number'), 'mobile_number'],
          [sequelize.col('users.username'), 'username'],
          [sequelize.col('agency_detail.agency_name'), 'agency_name'],
          [sequelize.col('agency_detail.id'), 'agency_id'],
          [sequelize.col('agency_detail.short_name'), 'short_name'],
          [sequelize.col('agency_detail.state_id'), 'state_id'],
          [sequelize.col('agency_detail.address'), 'address'],
          [sequelize.col('agency_detail.contact_person_name'), 'contact_person_name'],
          [sequelize.col('agency_detail.contact_person_mobile'), 'contact_person_mobile'],
          [sequelize.col('agency_detail.contact_person_designation_id'), 'contact_person_designation_id'],
          [sequelize.col('agency_detail.email'), 'agency_email'],
          [sequelize.col('agency_detail->m_designation.name'), 'designation_name'],
          [sequelize.col('agency_detail->m_state.state_name'), 'state_name']
        ]
      }

      let bspcDataList = await userModel.findAll(condition);

      if (bspcDataList && bspcDataList.length) {
        return response(res, status.DATA_AVAILABLE, 200, bspcDataList)
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, [])
      }
    } catch (error) {
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 501)
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
  static getAllVarietypList = async (req, res) => {
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
  static getAllVarietyLineList = async (req, res) => {
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
      console.log(req.body.loginedUserid.id, 'req.body.loginedUserid.id')
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
        is_active: true,
        created_at: Date.now(),
        updated_at: Date.now()
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
              console.log(((key.per_quintal_mrp / 100) * key.packag_size))
              db.varietyPriceListPackagesModel.create({
                variety_priece_list_id: dataValue['dataValues'].id,
                // per_qnt_mrp:((1100/100)*11),
                per_qnt_mrp: ((key.per_quintal_mrp / 100) * key.packag_size),
                // per_qnt_mrp: ((key.per_quintal_mrp/100)*key.packag_size).toFixed(2), 
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
              per_qnt_mrp: (ey.per_quintal_mrp),
              packages_size: key.packag_size,
              // per_quintal_price:key.per_quintal_mrp,
              per_quintal_price: ((key.per_quintal_mrp / 100) * key.packag_size).toFixed(2),
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

          // {
          //   required:false,
          //   model:db.varietLineModel,
          //   attributes:[]
          // },
        ],

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
          [sequelize.col('variety_price_lists.package_data'), 'package_data'],
          // [sequelize.col('variety_price_list_package.per_qnt_mrp'), 'per_qnt_mrp'],
          // [sequelize.col('variety_price_list_package.packages_size'), 'packages_size']
        ],
        where: {
          user_id: req.body.loginedUserid.id
        },
        raw: true
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


  static getVarietyCategoryList = async (req, res) => {
    try {
      let categories = await db.varietyCategoryModel.findAll();
      if (categories.length > 0) {
        return response(res, status.DATA_AVAILABLE, 200, categories);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 200, []);
      }
    } catch (error) {
      console.log(error);
      return response(res, status.DATA_NOT_AVAILABLE, 500, { error: 'Internal Server Error' });
    }

  }
  static getVarietyChractersticsDetails1 = async (req, res) => {
    try {
      const { crop_code, notification_year, category } = req.body;

      // Validate required fields
      if (!crop_code || crop_code.length === 0) {
        return response(res, status.CROP_CODE_REQUIRED, 400, null);
      }
      if (!notification_year) {
        return response(res, status.NOTIFICATION_YEAR_REQUIRED, 400, null);
      }

      // Construct the date range
      let dateCondition = {};
      if (notification_year) {
        const [startYear, endYear] = notification_year.split('-').map(Number);
        dateCondition = {
          notification_year: {
            [Op.between]: [startYear, endYear]
          }
        };
      }
      // Construct the where clause
      const whereClause = {
        crop_code,
        ...dateCondition,
      };

      let categoryArrayData;
      if (category && category.length) {
        categoryArrayData = {
          m_variety_category_id: {
            [Op.in]: category
          }
        };
      }

      // Helper function to build where clause dynamically
      const buildWhereClause = (whereClause, categoryArrayData) => {
        const where = { ...whereClause };
        if (category && category.length) {
          where['$m_variety_category_mappings.m_variety_category_id$'] = categoryArrayData.m_variety_category_id;
        }
        return where;
      };

      let mVarietyCharacteristics = await db.varietyModel.count({
        distinct: true,
        col: 'id',

        include: [
          {
            model: db.varietyCategoryMappingModel,
            required: true,
            attributes: [],
            required: false
          }
        ],

        where: buildWhereClause(whereClause, categoryArrayData),
      });

      let publicSectorCount = await db.varietyModel.count({
        distinct: true,
        col: 'variety_code',
        include: [
          {
            model: db.varietyCategoryMappingModel,
            required: false, // LEFT OUTER JOIN
            attributes: [],
          }
        ],
        where: {
          ...buildWhereClause(whereClause, categoryArrayData),
          developed_by: 'Public Sector',
        },

      });

      let privateSectorCount = await db.varietyModel.count({
        distinct: true,
        col: 'variety_code',
        include: [
          {
            model: db.varietyCategoryMappingModel,
            required: false, // LEFT OUTER JOIN
            attributes: [],
          }
        ],
        where: {
          ...buildWhereClause(whereClause, categoryArrayData),
          developed_by: 'Private Sector',
        },
      });
      // Get distinct states and their varieties
      let sqlQuery = `
      SELECT DISTINCT y.x->>'state_code' AS state_code,
                      mvc.variety_name,
                      mvc.variety_code
      FROM m_crop_varieties AS mcv
      LEFT OUTER JOIN m_variety_category_mapping AS mvcm
          ON mcv.variety_code = mvcm.variety_code
        LEFT OUTER JOIN m_variety_characteristics AS mvc
          ON mvc.variety_code = mcv.variety_code
      CROSS JOIN LATERAL (
          SELECT json_array_elements(mvc.state_data) x
          WHERE json_typeof(mvc.state_data) = 'array'
      ) y
      WHERE mcv.crop_code IN (:crop_codes)
      AND json_typeof(mvc.state_data) = 'array'
      AND mcv.notification_year BETWEEN :start_date AND :end_date`;

      // Add the category condition if it exists
      if (categoryArrayData && categoryArrayData.m_variety_category_id) {
        sqlQuery += `
      AND mvcm.m_variety_category_id IN (:category_ids)`;
      }

      // Prepare replacements object
      const replacements = {
        crop_codes: crop_code, // Replace with the actual value or an array of crop codes
        start_date: dateCondition.notification_year ? dateCondition.notification_year[Op.between][0] : 1994,
        end_date: dateCondition.notification_year ? dateCondition.notification_year[Op.between][1] : 1996
      };

      if (categoryArrayData && categoryArrayData.m_variety_category_id) {
        replacements.category_ids = categoryArrayData.m_variety_category_id[Op.in];
      }

      // Execute the query
      const query = await db.sequelize.query(sqlQuery, {
        type: sequelize.QueryTypes.SELECT,
        replacements: replacements,
      });


      // Process the result to the desired format
      const stateMap = {};

      query.forEach(record => {
        const { state_code, variety_name, variety_code } = record;

        if (!stateMap[state_code]) {
          stateMap[state_code] = {
            state_code: state_code,
            varieties: []
          };
        }

        stateMap[state_code].varieties.push({
          variety_name: variety_name,
          variety_code: variety_code
        });
      });

      const stateList = Object.values(stateMap);

      console.log({
        state: stateList
      });

      // Get counts of varieties and hybrids
      let varietyCount = await db.varietyModel.count({
        distinct: true,
        col: 'id',
        include: [
          {
            model: db.varietyCategoryMappingModel,
            required: false,
            attributes: [],
            required: false
          }
        ],
        where: {
          ...buildWhereClause(whereClause, categoryArrayData),
          status: 'variety'
        },
      });

      let hybridCount = await db.varietyModel.count({
        distinct: true,
        col: 'id',
        include: [
          {
            model: db.varietyCategoryMappingModel,
            required: false,
            attributes: [],
            required: false
          }
        ],
        where: {
          ...buildWhereClause(whereClause, categoryArrayData),
          status: 'hybrid'
        },
      });

      // Query for category counts
      let categoryCounts = await db.varietyModel.findAll({
        attributes: [
          // 'm_variety_category_id',
          [sequelize.col('m_variety_category_mappings.m_variety_category_id'), 'm_variety_category_id'],

          [sequelize.fn('COUNT', sequelize.col('m_variety_category_mappings.variety_code')), 'count'],

        ],
        where: {
          ...buildWhereClause(whereClause, categoryArrayData),
        },
        include: [
          // {
          //   model: db.cropCharactersticsModel,
          //   required:true,

          //   attributes: [],
          //   where: whereClause
          // },
          {
            model: db.varietyCategoryMappingModel,
            attributes: [],
            required: true,
            raw: true,
            nest: true,
            // where: {
            //   ...categoryArrayData
            // },

          },
        ],
        group: [sequelize.col('m_variety_category_mappings.m_variety_category_id')],
        raw: true,
        nest: true
      });
      // Transform categoryCounts to a more readable format
      let categoryCountResults = {};
      categoryCounts.forEach(item => {
        categoryCountResults[item.m_variety_category_id] = parseInt(item.count, 10);
      });

      let total_data = {
        total_variety: mVarietyCharacteristics,
        state: stateList,
        public_sector: publicSectorCount,
        private_sector: privateSectorCount,
        hybrid: hybridCount,
        variety: varietyCount,
        category: categoryCountResults
      };
      return response(res, status.DATA_AVAILABLE, 200, total_data);
    } catch (error) {
      console.log(error);
      return response(res, status.DATA_NOT_AVAILABLE, 500, { error: 'Internal Server Error' });
    }
  }

  static getVarietyChractersticsDetails = async (req, res) => {
    try {
      const { crop_code, notification_year, category } = req.body;

      // Validate required fields
      if (!crop_code || crop_code.length === 0) {
        return response(res, status.CROP_CODE_REQUIRED, 400, null);
      }
      if (!notification_year) {
        return response(res, status.NOTIFICATION_YEAR_REQUIRED, 400, null);
      }

      // Construct the date range
      let dateCondition = {};
      if (notification_year) {
        const [startYear, endYear] = notification_year.split('-').map(Number);
        dateCondition = {
          notification_year: {
            [Op.between]: [startYear, endYear],
          },
        };
      }

      // Construct the where clause
      const whereClause = {
        crop_code,
        ...dateCondition,
      };

      let categoryArrayData;
      if (category && category.length) {
        categoryArrayData = {
          m_variety_category_id: {
            [Op.in]: category,
          },
        };
      }

      // Helper function to build where clause dynamically
      const buildWhereClause = (whereClause, categoryArrayData) => {
        const where = { ...whereClause };
        if (category && category.length) {
          where['$m_variety_category_mapping.m_variety_category_id$'] = categoryArrayData.m_variety_category_id;
        }
        return where;
      };
      // SQL query to fetch additional data
      let sqlQuery = `SELECT mcv.variety_name,
                           mcv.variety_code,
                           mvcc.category,
                           mcv.developed_by,
                           mcv.status,
                           mvcc.id as category_id
                    FROM m_crop_varieties AS mcv
                    LEFT OUTER JOIN m_variety_category_mapping AS mvcm
                        ON mcv.variety_code = mvcm.variety_code
                    LEFT OUTER JOIN m_variety_characteristics AS mvc
                        ON mvc.variety_code = mcv.variety_code
                    LEFT JOIN m_variety_category AS mvcc
                        ON mvcc.id = mvcm.m_variety_category_id
                    WHERE mcv.crop_code IN (:crop_codes)
                      AND mcv.notification_year BETWEEN :start_date AND :end_date`;

      // SQL query to fetch state codes
      let stateDataQuery = `
                          SELECT DISTINCT y.x->>'state_code' AS state_code, mcv.variety_code
                          FROM m_crop_varieties as mcv 
                          LEFT JOIN m_variety_characteristics AS mvc
                          ON mcv.variety_code  = mvc.variety_code
                          LEFT JOIN LATERAL (
                              SELECT json_array_elements(mvc.state_data) AS x
                              WHERE json_typeof(mvc.state_data) = 'array'
                          ) y ON true
                          WHERE mcv.crop_code IN (:crop_codes)
                            AND mcv.notification_year BETWEEN :start_date AND :end_date`;

      // Add the category condition if it exists
      if (categoryArrayData && categoryArrayData.m_variety_category_id) {
        sqlQuery += ` AND mvcm.m_variety_category_id IN (:category_ids)`;
      }
      // Prepare replacements object
      const replacements = {
        crop_codes: crop_code,
        start_date: dateCondition.notification_year ? dateCondition.notification_year[Op.between][0] : 1994,
        end_date: dateCondition.notification_year ? dateCondition.notification_year[Op.between][1] : 2090,
      };
      if (categoryArrayData && categoryArrayData.m_variety_category_id) {
        replacements.category_ids = categoryArrayData.m_variety_category_id[Op.in];
      }

      // Execute the main query
      const mainQueryResult = await db.sequelize.query(sqlQuery, {
        type: sequelize.QueryTypes.SELECT,
        replacements: replacements,
      });
      // Execute the state data query
      const stateQueryResult = await db.sequelize.query(stateDataQuery, {
        type: sequelize.QueryTypes.SELECT,
        replacements: replacements,
      });

      // Process the result to the desired format
      const stateMap = {};
      mainQueryResult.forEach((record) => {
        const { variety_name, variety_code, state_code, developed_by, status, category, category_id } = record;

        // Create an entry for each variety code
        if (!stateMap[variety_code]) {
          stateMap[variety_code] = {
            varietyName: variety_name,
            varietyCode: variety_code,
            state: [],
            developedBy: developed_by,
            type: status === 'variety' ? 'VARIETY' : 'HYBRID',
            category: [],
          };
        }

        // Add state codes
        if (state_code) {
          if (!stateMap[variety_code].state.includes(state_code)) {
            stateMap[variety_code].state.push(state_code);
          }
        }

        // Add unique categories based on `category_id` (categoryNumber)
        if (!stateMap[variety_code].category.find(cat => cat.categoryNumber === category_id)) {
          stateMap[variety_code].category.push({
            type: category,
            categoryNumber: category_id,
          });
        }
      });

      // Add state data to the state map
      stateQueryResult.forEach((record) => {
        const { variety_code, state_code } = record;
        if (stateMap[variety_code]) {
          if (state_code && !stateMap[variety_code].state.includes(state_code)) {
            stateMap[variety_code].state.push(state_code);
          }
        }
      });

      const stateList = Object.values(stateMap);

      // Count data as required
      const mVarietyCharacteristics = await db.varietyModel.count({
        distinct: true,
        col: 'id',
        where: buildWhereClause(whereClause, categoryArrayData),
        include: [
          {
            model: db.varietyCategoryMappingModel,
            attributes: [],
            required: false,
          },
        ],
      });

      const publicSectorCount = await db.varietyModel.count({
        distinct: true,
        col: 'variety_code',
        where: {
          ...buildWhereClause(whereClause, categoryArrayData),
          developed_by: 'Public Sector',
        },
        include: [
          {
            model: db.varietyCategoryMappingModel,
            attributes: [],
            required: false,
          },
        ],
      });
      const privateSectorCount = await db.varietyModel.count({
        distinct: true,
        col: 'variety_code',
        where: {
          ...buildWhereClause(whereClause, categoryArrayData),
          developed_by: 'Private Sector',
        },
        include: [
          {
            model: db.varietyCategoryMappingModel,
            attributes: [],
            required: false,
          },
        ],
      });

      const varietyCount = await db.varietyModel.count({
        distinct: true,
        col: 'id',
        where: {
          ...buildWhereClause(whereClause, categoryArrayData),
          status: 'variety',
        },
        include: [
          {
            model: db.varietyCategoryMappingModel,
            attributes: [],
            required: false,
          },
        ],
      });

      const hybridCount = await db.varietyModel.count({
        distinct: true,
        col: 'id',
        where: {
          ...buildWhereClause(whereClause, categoryArrayData),
          status: 'hybrid',
        },
        include: [
          {
            model: db.varietyCategoryMappingModel,
            attributes: [],
            required: false,
          },
        ],
      });

      let categoryCounts = await db.varietyModel.findAll({
        attributes: [
          [sequelize.col('m_variety_category_mapping.m_variety_category_id'), 'm_variety_category_id'],
          [sequelize.fn('COUNT', sequelize.col('m_variety_category_mapping.variety_code')), 'count'],
        ],
        where: {
          ...buildWhereClause(whereClause, categoryArrayData),
        },
        include: [
          {
            model: db.varietyCategoryMappingModel,
            attributes: [],
            required: true,
          },
        ],
        group: [sequelize.col('m_variety_category_mapping.m_variety_category_id')],
        raw: true,
        nest: true,
      });

      let categoryCountResults = {};
      categoryCounts.forEach((item) => {
        categoryCountResults[item.m_variety_category_id] = parseInt(item.count, 10);
      });


      // Construct the response
      const total_data = {
        total_variety: mVarietyCharacteristics,
        state: stateList,
        public_sector: publicSectorCount,
        private_sector: privateSectorCount,
        hybrid: hybridCount,
        variety: varietyCount,
        category: categoryCountResults,
      };

      // Return the response in the desired format
      return response(res, status.DATA_AVAILABLE, 200, total_data);
      // return response(res, status.DATA_AVAILABLE, 200, {
      //   EncryptedResponse: {
      //     status_code: 200,
      //     message: "Data found successfully",
      //     data: total_data,
      //   }
      // });

    } catch (error) {
      console.log("error", error)
      return response(res, status.DATA_NOT_AVAILABLE, 500, {
        EncryptedResponse: {
          status_code: 500,
          message: "Internal Server Error",
          data: { error: 'Internal Server Error' }
        }
      });
    }
  };
  static getCropCharactersticsWithId = async (req, res) => {
    try {
      let condition = {}
      condition = {
        include: [
          {
            model: db.cropModel,
            attributes: [],
            where: {
              is_active: 1
            },
            left: true,
            include: [
              {
                model: db.cropGroupModel,
                attributes: []
              }
            ],
            // attributes: ['crop_name']
          },
          {
            model: db.cropCharactersticsModel,
            attributes: [],
            include: [

              {
                model: db.responsibleInsitutionModel,
                attributes: []
              }
            ]
          },
          {
            model: db.varietyCategoryMappingModel,
            attributes: [],
            // as: 'category',
            include: [
              {
                model: db.varietyCategoryModel,
                attributes: [],
                require: true
              },
            ],
          },
        ],
        attributes: [
          'id',
          [sequelize.col('m_crop.crop_code'), 'crop_code'],
          [sequelize.col('m_crop.crop_name'), 'crop_name'],
          [sequelize.col('m_crop.botanic_name'), 'botanic_name'],
          [sequelize.col('m_crop.hindi_name'), 'hindi_name'],
          [sequelize.col('m_crop_varieties.variety_code'), 'variety_code'],
          [sequelize.col('m_crop_varieties.variety_name'), 'variety_name'],
          [sequelize.col('m_crop_varieties.is_notified'), 'is_notified'],
          [sequelize.col('m_crop_varieties.developed_by'), 'developed_by'],
          [sequelize.col('m_variety_characteristic->responsible_insitution.insitution_name'), 'responsible_insitution'],
          [sequelize.col('m_crop_varieties.status'), 'status'],
          [sequelize.col('m_crop_varieties.meeting_number'), 'meeting_number'],
          [sequelize.col('m_crop_varieties.not_date'), 'notification_date'],
          [sequelize.col('m_crop_varieties.not_number'), 'notification_number'],
          [sequelize.col('m_crop_varieties.type'), 'type'],
          [sequelize.col('m_variety_characteristic.state_data'), 'state_data'],
          [sequelize.col('m_variety_characteristic.gi_tagged_reg_no'), 'gi_tagged_reg_no'],
          // [sequelize.col('m_variety_characteristic.type'),'type'],
          [sequelize.col('m_variety_characteristic.ip_protected_reg_no'), 'ip_protected_reg_no'],
          [sequelize.col('"m_variety_category_mapping.m_variety_category.id'), 'category_id'],
          [sequelize.col('"m_variety_category_mapping.m_variety_category.category'), 'category'],
        ],
        left: true,
        // nest:true,
        raw: true,
        where: {}
      }

      let { page, pageSize } = req.query;
      // if (page === undefined) page = 1;
      // if (pageSize === undefined) pageSize = 50;

      // if (page > 0 && pageSize > 0) {
      //   condition.limit = pageSize;
      //   condition.offset = (page * pageSize) - pageSize;
      // }

      const sortOrder = req.body.sort ? req.body.sort : 'id';
      const sortDirection = req.body.order ? req.body.order : 'DESC';

      condition.order = [[sortOrder, sortDirection]];
      if (req.query) {
        if (req.query.crop_code) {
          condition.where.crop_code = req.query.crop_code
        }
        if (req.query.variety_code) {
          condition.where.variety_code = req.query.variety_code
        }
      }

      const data = await db.varietyModel.findAll(condition);
      if (!data) {
        return response(res, status.DATA_NOT_AVAILABLE, 404);
      } else {
        data.forEach((element, i) => {
          if (element.crop_code.slice(0, 1) == "H") {
            data[i]['crop_type'] = "horticulture"
          } else {
            data[i]['crop_type'] = "Agriculture"
          }

          if (element.ip_protected_reg_no == null || element.ip_protected_reg_no == undefined || element.ip_protected_reg_no == '') {
            data[i]['is_ip_protected'] = false
          } else {
            data[i]['is_ip_protected'] = true
          }

          if (element.gi_tagged_reg_no == null || element.gi_tagged_reg_no == undefined || element.gi_tagged_reg_no == '') {
            data[i]['is_gi_tagged'] = false
          } else {
            data[i]['is_gi_tagged'] = true
          }
          // if (element.state_data && element.state_data.length) {
          //   data.rows[i]['state_code'] = element.state_data[0].state_code
          //   data.rows[i]['state_name'] = element.state_data[0].state_name
          //   delete element.state_data;
          // } else {
          //   data.rows[i]['state_code'] = ""
          //   data.rows[i]['state_name'] = ""
          // }
        });
        // data
        const filteredData = [];
        data.forEach(el => {
          const spaIndex = filteredData.findIndex(item => item.variety_code == el.variety_code);
          if (spaIndex === -1) {
            filteredData.push({
              "id": el.id,
              "crop_code": el.crop_code,
              "crop_name": el.crop_name,
              "botanic_name": el.botanic_name,
              "hindi_name": el.hindi_name,
              "variety_code": el.variety_code,
              "variety_name": el.variety_name,
              "is_notified": el.is_notified,
              "developed_by": el.developed_by,
              "responsible_insitution": el.responsible_insitution,
              "status": el.status,
              "meeting_number": el.meeting_number,
              "notification_date": el.notification_date,
              "notification_number": el.notification_number,
              "type": el.type,
              "state_data": el.state_data,
              "gi_tagged_reg_no": el.gi_tagged_reg_no,
              "ip_protected_reg_no": el.ip_protected_reg_no,
              "crop_type": el.crop_type,
              "is_ip_protected": el.is_ip_protected,
              "is_gi_tagged": el.is_gi_tagged,
              "category": [
                {
                  "category_id": el.category_id,
                  "category": el.category,

                }
              ]
            });
          } else {
            const cropIndex = filteredData[spaIndex].category.findIndex(item => item.category_id == el.category_id);

            if (cropIndex === -1) {
              filteredData[spaIndex].category.push(
                {
                  "category_id": el.category_id,
                  "category": el.category,
                }
              );
            } else {

              // "category_id": el.category_id,
              //   "category": el.category,

            }
          }
        });

        return response(res, status.DATA_AVAILABLE, 200, filteredData);
      }
    }
    catch (error) {
      console.log(error);
      const returnResponse = {
        message: error.message,
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }

  static printTag = async (req, res) => {
    try {
      let condition = {}
      const { productName, serialNumber } = req.body;
      const date = new Date().toISOString().split("T")[0];

      // PRN File Content (Zebra ZPL Example)
      const prnContent = `
    ^XA
    ^FO50,50^A0N,30,30^FD${productName}^FS
    ^FO50,100^A0N,25,25^FDSerial: ${serialNumber}^FS
    ^FO50,150^A0N,25,25^FDDate: ${date}^FS
    ^FO50,200^B3N,N,100,Y,N^FD${serialNumber}^FS
    ^XZ
    `;

      const filePath = path.join(__dirname, "label.prn");
      console.log("filePath", filePath)
      // Write PRN file to disk
      fs.writeFile(filePath, prnContent, (err) => {
        if (err) {
          return res.status(500).json({ message: "Error generating PRN file" });
        }
        res.download(filePath, "label.prn");
      });

      // return response(res, status.DATA_AVAILABLE, 200, []);

    }
    catch (error) {
      console.log(error);
      const returnResponse = {
        message: error.message,
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }
  static getTotalIndentQuantity = async (req, res) => {
    try {
      const { year, season, state_code } = req.query;
      let whereCondition = {};
      let whereConditionSecond = {};

      if (year) {
        whereCondition.year = year;
        whereConditionSecond.year = year
      }
      if (season) {
        const capitalizedSeason = season.charAt(0).toUpperCase();
        whereCondition.season = capitalizedSeason;
        whereConditionSecond.season = capitalizedSeason
      }
      let stateCode;
       let liftingStateCode;
      if (state_code) {
        whereCondition['$agencyDetails.state_id$'] = state_code;
        stateCode = {
          state_id: state_code
        }
        liftingStateCode = {
          spa_state_code: state_code
        }
      }

      // indent quantity
      const indentQuantities = await indentOfBreederseedModel.findAll({
        attributes: [
          'indent_quantity',
          'unit',
        ],
        where: whereCondition,
        include: [
          {
            model: agencyDetailModel,
            attributes: [],
            as: 'agencyDetails'
          }
        ]
      });

      let indent_quantity = 0;
      indentQuantities.forEach((indent) => {
        if (indent.unit === 'kilogram') {
          indent_quantity += indent.indent_quantity / 100;
        } else {
          indent_quantity += indent.indent_quantity;
        }
      });
      indent_quantity = parseFloat(indent_quantity.toFixed(2));

      // Allocated quantity calculation with crop_code logic
      const TotalAllocated = await allocationToIndentorSeed.findAll({
        attributes: [
          [
            sequelize.fn(
              'SUM',
              sequelize.col('allocation_to_indentor_for_lifting_seed_production_cnter.allocated_quantity')
            ),
            'allocated_quantity'
          ],
          'crop_code'
        ],
        where: {
          is_active: 1,
          is_variety_submitted: 1,
          ...whereConditionSecond
        },
        include: [
          {
            model: allocationToIndentorProductionCenterSeed,
            as: 'allocation_to_indentor_for_lifting_seed_production_cnter',
            attributes: [],
            include: [
              {
                model: db.agencyDetailModel,
                attributes:[],
                where: {
                  ...stateCode
                }
              }
            ]
          },
        ],
        // group: ['crop_code'],
        group: ['crop_code', 'allocation_to_indentor_for_lifting_seed_production_cnter.agency_detail_model.user_id'],
        raw: true,
      });

      let finalAllocatedQty = 0;
      for (const row of TotalAllocated) {
        const cropCode = row.crop_code || '';
        const qty = Number(row.allocated_quantity) || 0;
        finalAllocatedQty += cropCode.startsWith('H') ? qty / 100 : qty;
      }


      // Produced quantity calculation with crop_code logic
      const TotalProduced = await seedProcessingRegisterModel.findAll({
        include:[
          {
            model:db.agencyDetailModel,
            attributes:[],
            where:{
               ...stateCode
            }
          }
        ],
        attributes: [
          [sequelize.fn('SUM', sequelize.col('seed_processing_register.total_processed_qty')), 'produced_quantity'],
          'crop_code'
        ],
        where: {
          ...whereConditionSecond,
          is_active: 1
        },
        group: ['crop_code'],
        raw: true
      });

      let finalProducedQty = 0;
      for (const row of TotalProduced) {
        const cropCode = row.crop_code || '';
        const qty = Number(row.produced_quantity) || 0;
        finalProducedQty += cropCode.startsWith('H') ? qty / 100 : qty;
      }


      // Lifted quantity calculation with crop_code logic
      const rawLiftingData = await liftingSeedDetailsModel.findAll({
        attributes: ['no_of_bag', 'bag_weight', 'crop_code'],
        where: {
          ...whereConditionSecond,
          ...liftingStateCode
        },
        raw: true,
      });

      let finalLiftedQty = 0;
      for (const row of rawLiftingData) {
        const noOfBags = Number(row.no_of_bag) || 0;
        const bagWeight = Number(row.bag_weight) || 0;
        const cropCode = row.crop_code || '';
        const total = noOfBags * bagWeight;
        finalLiftedQty += total / 100;
      }

      response(res, status.DATA_AVAILABLE, 200, {
        total_indent: `${Number(indent_quantity?.toFixed(3))} (Qnt)` || "0 (Qnt)",
        allocatedQuantity: `${Number(finalAllocatedQty.toFixed(3))} (Qnt)`,
        producedQuantity: `${Number(finalProducedQty.toFixed(3))} (Qnt)`,
        liftedQuantity: `${Number(finalLiftedQty.toFixed(3))} (Qnt)`
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: 'INTERNAL_SERVER_ERROR',
        message: 'Error fetching total indent quantity'
      });
    }
  };
}
module.exports = ApiController

