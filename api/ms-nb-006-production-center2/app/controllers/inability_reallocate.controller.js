require('dotenv').config()
const response = require('../_helpers/response')
const status = require('../_helpers/status.conf')
const db = require("../models");
let Validator = require("validatorjs");
const sequelize = require('sequelize');
// model import
const ConditionCreator = require('../_helpers/condition-creator');
const e = require('express');
const attributes = require('validatorjs/src/attributes');
const Op = require('sequelize').Op;
const { bspProrforma3Model, bspProrforma2Model, varietyModel } = db;

class InabilityReallocates {

  static getInabilityReallocatePlotsData = async (req, res) => {
    try {
      let plotsData = await db.inabilityReallocatesPlotsModel.findAll({
        where: {
          inability_reallocates_id: req.inbility_id
        }
      })
      return plotsData;
    } catch (error) {
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }

  static getInabilityReallocateBspcData = async (req, res) => {
    try {
      let filter = await ConditionCreator.bspcNewFlowFilter(req);
      let bspcData = await db.bspProformaOneBspc.findAll({
        include: [
          {
            required: true,
            model: db.bspPerformaBspOne,
            attributes: [],
            where: {
              ...filter,
              production_type: "REALLOCATION"
            }
          }, {
            model: db.userModel,
            attributes: [],
            include: [
              {
                model: db.agencyDetailModel,
                attributes: ['agency_name']
              }
            ]
          }
        ],
        raw: true
      })
      return bspcData;
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }

  // get inability reallocate data
  static getInabilityReallocatedData = async (req, res) => {
    try {
      let filter = await ConditionCreator.bspcNewFlowFilter(req.body.search);
      let data = await db.inabilityReallocatesModel.findAll({
        include: [
          {
            model: db.varietyModel,
            attributes: ['variety_name']
          },
          {
            model: db.varietLineModel,
            attributes: ['line_variety_name']
          }
        ],
        raw: true,
        where: {
          user_id: req.body.loginedUserid.id,
          ...filter
        }
      });
      console.log(data);
      let finalArray = [];
      if (data && data.length) {
        for (let key of data) {
          let param = {
            inbility_id: key.id,
            year: key.year,
            season: key.season,
            crop_code: key.crop_code,
            variety_code: key.variety_code,
            variety_line_code: key.variety_line_code,
            user_id: req.body.loginedUserid.id
          }
          let plotsData = await this.getInabilityReallocatePlotsData(param)
          let bspcData = await this.getInabilityReallocateBspcData(param)
          finalArray.push({
            id: key.id,
            year: key.year,
            season: key.season,
            crop_code: key.crop_code,
            variety_code: key.variety_code,
            variety_name: key['m_crop_variety.variety_name'],
            variety_line_name: key['m_variety_line.line_variety_name'] ? key['m_variety_line.line_variety_name'] : '',
            variety_line_code: key.variety_line_code,
            user_id: req.body.loginedUserid.id,
            bspc_reallocate_data: bspcData,
            inability_data: plotsData,
            total_dificit: key.total_dificit,
          })
        }
      }
      return response(res, status.DATA_AVAILABLE, 200, finalArray);
    } catch (error) {
      console.log("error", error);
      return response(res, status.UNEXPECTED_ERROR, 500, []);
    }
  }
  // add /edit inability reallocate data
  static modifyInabilityReallocatedData = async (req, res) => {
    try {
      let { year, season, crop_code, variety_code, variety_line_code, total_dificit, inability_data, bspc_reallocate_data, id } = req.body;

      let rules = {
        "year": 'required',
        "season": 'required|string',
        "crop_code": 'required|string',
        "variety_code": 'required|string',
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

      if (id) {
        console.log('body data ', req.body)
        let inabilityReallocatesPlotsData;
        let bspcAssignTargetData;
        let bspcReallocateData;
        // let data;
        let data1 = await db.inabilityReallocatesModel.update({ "total_dificit": total_dificit },
          {
            where: {
              "id": id
            }
          }
        )
        let data = await db.inabilityReallocatesPlotsModel.destroy({
          where: {
            inability_reallocates_id: id
          }
        });
        if (data) {
          if (inability_data && inability_data.length) {
            for (let key of inability_data) {
              let cropFailur;
              if (key.crop_failure) {
                cropFailur = 1
                let updateValue = await db.bspProrforma2Model.update({
                  crop_failure:1
                },{ 
                  where:{
                    year:year,
                    season:season,
                    crop_code:crop_code,
                    variety_code:variety_code,
                    field_code:key.plot_no
                  }
                })
              } else {
                cropFailur = 0
                let updateValue = await db.bspProrforma2Model.update({
                  crop_failure:0
                },{ 
                  where:{
                    year:year,
                    season:season,
                    crop_code:crop_code,
                    variety_code:variety_code,
                    field_code:key.plot_no
                  }
                })
              }
              inabilityReallocatesPlotsData = await db.inabilityReallocatesPlotsModel.create(
                {
                  "inability_reallocates_id": id,
                  "plot": key.plot_no,
                  "reports": key.reports,
                  "crop_failure": cropFailur,
                  "dificit_qnt": key.dificit_qnt,
                  "estimated_production": key.estimated_production,
                  "expected_production": key.expected_production
                }
              )
            }
          }
          if (bspc_reallocate_data && bspc_reallocate_data.length) {
            bspcAssignTargetData = await db.bspPerformaBspOne.findOne(
              {
                where: {
                  "year": year,
                  "season": season,
                  "crop_code": crop_code,
                  "variety_code": variety_code,
                  "variety_line_code": variety_line_code,
                  "user_id": req.body.loginedUserid && req.body.loginedUserid.id ? req.body.loginedUserid.id : '',
                  "isReallocate": 1,
                  "production_type": "REALLOCATION",
                  "is_final_submit": 1,
                  "is_freezed": 1
                }
              }
            );
            if(bspcAssignTargetData && bspcAssignTargetData && bspcAssignTargetData.dataValues){
              let bspcData = await db.bspProformaOneBspc.destroy({
                where: {
                  bspc_proforma_1_id: bspcAssignTargetData.dataValues.id
                }
              })
              if (bspcData) {
                for (let key of bspc_reallocate_data) {
                  bspcReallocateData = await db.bspProformaOneBspc.create(
                    {
                      "bspc_proforma_1_id": bspcAssignTargetData.dataValues.id,
                      "bspc_id": key.bspc_id,
                      "isPermission": key.bs_to_bs_permission ? key.bs_to_bs_permission : false,
                      "target_qunatity": key.assign_target,
                      "production_type": "REALLOCATION"
                    }
                  )
                }
              }
            }
           
          }
        }

        if (data && inabilityReallocatesPlotsData) {
          return response(res, status.DATA_UPDATED, 200, [])
        } else {
          return response(res, status.DATA_NOT_UPDATE, 201, [])
        }
      } else {
        let inabilityReallocatesPlotsData;
        let bspcAssignTargetData;
        let bspcReallocateData;
        let data = await db.inabilityReallocatesModel.create(
          {
            "year": year,
            "season": season,
            "crop_code": crop_code,
            "variety_code": variety_code,
            "variety_line_code": variety_line_code,
            "user_id": req.body.loginedUserid && req.body.loginedUserid.id ? req.body.loginedUserid.id : '',
            "total_dificit": total_dificit,
            "is_active": 1,
          }
        )
        if (data) {
          if (inability_data && inability_data.length) {
            for (let key of inability_data) {
              let cropFailur;
              if (key.crop_failure) {
                cropFailur = 1;
                let updateValue = await db.bspProrforma2Model.update({
                  crop_failure:1
                },{ 
                  where:{
                    year:year,
                    season:season,
                    crop_code:crop_code,
                    variety_code:variety_code,
                    field_code:key.plot_no
                  }
                })
              } else {
                cropFailur = 0;
                let updateValue = await db.bspProrforma2Model.update({
                  crop_failure:0
                },{ 
                  where:{
                    year:year,
                    season:season,
                    crop_code:crop_code,
                    variety_code:variety_code,
                    field_code:key.plot_no
                  }
                })
              }
              inabilityReallocatesPlotsData = await db.inabilityReallocatesPlotsModel.create(
                {
                  "inability_reallocates_id": data.dataValues.id,
                  "plot": key.plot_no,
                  "reports": key.reports,
                  "crop_failure": cropFailur,
                  "dificit_qnt": key.dificit_qnt ? key.dificit_qnt : 0,
                  "estimated_production": key.estimated_production,
                  "expected_production": key.expected_production
                }
              )
            }
          }
          if (bspc_reallocate_data && bspc_reallocate_data.length) {
            bspcAssignTargetData = await db.bspPerformaBspOne.create(
              {
                "year": year,
                "season": season,
                "crop_code": crop_code,
                "variety_code": variety_code,
                "variety_line_code": variety_line_code,
                "user_id": req.body.loginedUserid && req.body.loginedUserid.id ? req.body.loginedUserid.id : '',
                "isReallocate": 1,
                "production_type": "REALLOCATION",
                "created_at": Date.now(),
                "updated_at": Date.now(),
                "is_final_submit": 1,
                "is_freezed": 1
              }
            );
            if (bspcAssignTargetData) {
              for (let key of bspc_reallocate_data) {
                bspcReallocateData = await db.bspProformaOneBspc.create(
                  {
                    "bspc_proforma_1_id": bspcAssignTargetData.dataValues.id,
                    "bspc_id": key.bspc_id,
                    "isPermission": key.bs_to_bs_permission ? key.bs_to_bs_permission : false,
                    "target_qunatity": key.assign_target,
                    "production_type": "REALLOCATION"
                  }
                )
              }
            }

          }
        }
        let dataCreatedResponse = [{ "data": data, "bspc_array": bspcAssignTargetData, "reallocated_array": bspcReallocateData }]
        if (inabilityReallocatesPlotsData) {
          if (bspcReallocateData) {
            if (bspcAssignTargetData) {
              return response(res, status.DATA_SAVE, 200, dataCreatedResponse)
            }
          }
        }
      }
    } catch (error) {
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 501, error)
    }
  }
  //delete inability reallocate data
  static deleteInabilityReallocatedData = async (req, res) => {
    try {
      let { id } = req.params;
      let getInabiltyData = await db.inabilityReallocatesModel.findOne({
        where: {
          id: id
        }
      })
      if (getInabiltyData) {
        let bspcAssignTargetData = await db.bspPerformaBspOne.findOne(
          {
            where: {
              "year": getInabiltyData.dataValues.year,
              "season": getInabiltyData.dataValues.season,
              "crop_code": getInabiltyData.dataValues.crop_code,
              "variety_code": getInabiltyData.dataValues.variety_code,
              "variety_line_code": getInabiltyData.dataValues && getInabiltyData.dataValues.variety_line_code ? getInabiltyData.dataValues.variety_line_code : '',
              "user_id": req.body.loginedUserid && req.body.loginedUserid.id ? req.body.loginedUserid.id : '',
              "isReallocate": 1,
            }
          }
        );
        if (bspcAssignTargetData) {
          let bspcData = await db.bspProformaOneBspc.destroy({
            where: {
              bspc_proforma_1_id: bspcAssignTargetData.dataValues.id
            }
          })
          let bspcProformaData = await db.bspPerformaBspOne.destroy({
            where: {
              "year": getInabiltyData.dataValues.year,
              "season": getInabiltyData.dataValues.season,
              "crop_code": getInabiltyData.dataValues.crop_code,
              "variety_code": getInabiltyData.dataValues.variety_code,
              "variety_line_code": getInabiltyData.dataValues && getInabiltyData.dataValues.variety_line_code ? getInabiltyData.dataValues.variety_line_code : '',
              "user_id": req.body.loginedUserid && req.body.loginedUserid.id ? req.body.loginedUserid.id : '',
              "isReallocate": 1,
            }
          })
          let data = await db.inabilityReallocatesPlotsModel.destroy({
            where: {
              inability_reallocates_id: id
            }
          });
          if (data) {
            let data2 = await db.inabilityReallocatesModel.destroy({
              where: {
                id: id
              }
            });
            if (data2) {
              return response(res, status.DATA_DELETED, 200, [])
            }
          }
        }

      }
    } catch (error) {
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 501, error)
    }
  }
  static getNucleusSeedData = async (req, res) => {
    if (req) {
      let nucleusSeedDataValue = await db.seedInventory.findAll({
        include:[
          {
            model:db.seedInventoryTag,
            attributes:[]
          }
        ],
        attributes: [
          [sequelize.col('seed_inventries.crop_code'), 'crop_code'],
          [sequelize.col('seed_inventries.variety_code'), 'variety_code'],
          [sequelize.fn("SUM", sequelize.col('seed_inventries_tag.quantity_remaining')), 'nucleus_seed_available']
        ],
        group: [
          [sequelize.col('seed_inventries.crop_code'), 'crop_code'],
          [sequelize.col('seed_inventries.variety_code'), 'variety_code'],
        ],
        where: {
          seed_class_id: 6,
          crop_code: req.crop_code,
          variety_code: req.variety_code,
          bspc_id: req.bspc_id
        },
        raw: true
      })
      return nucleusSeedDataValue;
    }
  }
  static getBreederSeedData = async (req, res) => {
    if (req) {
      let breederSeedDataValue = await db.seedInventory.findAll({
        include:[
          {
            model:db.seedInventoryTag,
            attributes:[]
          }
        ],
        attributes: [
          [sequelize.col('seed_inventries.crop_code'), 'crop_code'],
          [sequelize.col('seed_inventries.variety_code'), 'variety_code'],
          [sequelize.fn("SUM", sequelize.col('seed_inventries_tag.quantity_remaining')), 'breeder_seed_available']
        ],
        group: [
          [sequelize.col('seed_inventries.crop_code'), 'crop_code'],
          [sequelize.col('seed_inventries.variety_code'), 'variety_code'],
        ],
        where: {
          seed_class_id: 7,
          crop_code: req.crop_code,
          variety_code: req.variety_code,
          bspc_id: req.bspc_id
        },
        raw: true
      })
      return breederSeedDataValue;
    }
  }

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
          let nucleusSeedData = await this.getNucleusSeedData(param);
          let breederSeedData = await this.getBreederSeedData(param);
          console.log('breederSeedData', breederSeedData);
          console.log('nucleusSeedData', nucleusSeedData);
          finalArray.push({
            "bspc_id": key && key.bspc_id ? key.bspc_id : null,
            "short_name": key && key.short_name ? key.short_name : null,
            "name": key && key.name ? key.name : null,
            "nucleus_seed_available": nucleusSeedData && nucleusSeedData[0] && nucleusSeedData[0].nucleus_seed_available ? nucleusSeedData[0].nucleus_seed_available/100 : 0,
            "breeder_seed_available": breederSeedData && breederSeedData[0] && breederSeedData[0].breeder_seed_available ? breederSeedData[0].breeder_seed_available/100 : 0
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
  
  static getHarvestingIntakeVariety = async (req, res) => {
    try {
      const { user_id, crop_code, year, season, } = req.body.search;

      const whereClause = {};

      if (year) {
        whereClause.year = year;
      }
      if (season) {
        whereClause.season = season;
      }
      if (crop_code) {
        whereClause.crop_code = crop_code;
      }
      whereClause.report = 'satisfactory';
      let checkVarietyInability = await db.inabilityReallocatesModel.findAll({
        raw: true,
        attributes: ['variety_code'],
        where: {
          year: year,
          season: season,
          crop_code: crop_code,
          user_id: req.body.loginedUserid.id
        }
      })
      let checkVarietyInabilityArray = [];
      if (checkVarietyInability && checkVarietyInability.length) {
        checkVarietyInability.forEach(ele => {
          checkVarietyInabilityArray.push(ele.variety_code)
        })
      }
      if (checkVarietyInabilityArray && checkVarietyInabilityArray.length) {
        whereClause.variety_code = {
          [Op.notIn]: checkVarietyInabilityArray
        }
      }
      // return;
      const bspProforma3Data = await bspProrforma3Model.findAll({
        where: whereClause,
        include: [
          {
            model: bspProrforma2Model,
            as: 'bspProforma2',
            where: { user_id: req.body.loginedUserid.id },
            attributes: []
          },
          {
            model: varietyModel,
            // where: { user_id: user_id },
            attributes: []
          }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('bsp_proforma_3s.variety_code')), 'variety_code'],
          // [sequelize.literal('DISTINCT "variety_code"'), 'variety_code'],
          // [sequelize.col('m_crop.crop_name'), 'crop_name'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [sequelize.col('m_crop_variety.status'), 'status']

        ],
        raw: true
      })

      return response(res, status.DATA_AVAILABLE, 200, bspProforma3Data)
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}
module.exports = InabilityReallocates