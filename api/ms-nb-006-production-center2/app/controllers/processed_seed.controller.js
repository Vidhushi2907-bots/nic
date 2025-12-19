require('dotenv').config()
// import {}= require()
const response = require('../_helpers/response')
const status = require('../_helpers/status.conf')
const db = require("../models");
const sequelize = require('sequelize');
// model import
const { cropModel, seedForProductionModel, seasonModel, varietyModel, directIndent, seedInventory, assignCropNewFlow, assignBspcCropNewFlow, indentOfBrseedDirectLineModel } = db;
const ConditionCreator = require('../_helpers/condition-creator');
const e = require('express');
const moment = require("moment");
const productiohelper = require('../_helpers/productionhelper');
const SpaDataBySector = require('../_helpers/spa-data-by-sector');


const Op = require('sequelize').Op;
const crypto = require('crypto');
const CryptoJS = require('crypto-js')

const secretKey = crypto.randomBytes(32);
let Validator = require('validatorjs');
const attributes = require('validatorjs/src/attributes');
const { where } = require('../models/db');
// Initialization vector (must be 16 bytes for AES)
const iv = crypto.randomBytes(16);
class ProcessedSeedDetails {
  static getseedInventoryforOldStock = async (req, res) => {

    try {
      let filterData2 = []
      let filterData3 = []
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
        filterData2.push({
          seed_class_id: {
            [Op.eq]: 7
          }
        });
        if (req.body.search && req.body.search.lot_id && req.body.search.lot_id.length > 0) {
          filterData3.push({
            id: {
              [Op.in]: req.body.search.lot_id
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
            // required: true
          },
          {
            model: varietyModel,
            attributes: [],
            // required: true
          },
          {
            model: db.stageModel,
            attributes: [],
            // required: true
          },
          {
            model: db.seedClassModel,
            attributes: [],
            // required: true
          },

          {
            model: db.seedInventoryTag,
            where: {
              [Op.and]: filterData3 ? filterData3 : []

            },
            include: [
              {
                model: db.seedProcessingRegisterOldStocks,
                include: [
                  {
                    model: db.ProcessSeedDetailsoldStocks,
                    attributes: [],
                  },

                ],
                attributes: [],
              }
            ],
            attributes: [],
          },
        ],
        attributes: [
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          'id', 'year', 'season', 'crop_code', 'variety_code',
          'stage_id',
          'seed_class_id',
          [sequelize.col('m_seed_class.type'), 'type'],
          [sequelize.col('m_seed_class.class_name'), 'class_name'],
          [sequelize.col('stage.stage_field'), 'stage_field'],
          [sequelize.col('m_crop.crop_name'), 'crop_name'],
          [sequelize.col('seed_inventries_tag.lot_number'), 'lot_number'],
          [sequelize.col('seed_inventries_tag.id'), 'lot_id'],
          [sequelize.col('seed_inventries_tag.id'), 'lot_id'],
          [sequelize.col('seed_inventries_tag.id'), 'lot_id'],
          [sequelize.col('seed_inventries_tag.tag_range'), 'tag_range'],
          [sequelize.col('seed_inventries_tag.quantity'), 'quantity'],
          [sequelize.col('seed_inventries_tag.id'), 'seed_tag_id'],
          [sequelize.col('seed_inventries_tag.quantity_remaining'), 'quantity_remaining'],
          [sequelize.col('seed_inventries_tag.quantity'), 'quantity'],
          [sequelize.col('seed_inventries_tag.quantity_used'), 'quantity_used'],
          [sequelize.col('seed_inventries_tag.seed_inventry_id'), 'seed_inventry_id'],
          [sequelize.col('seed_inventries_tag.bag_size'), 'bag_size'],
          [sequelize.col('seed_inventries_tag->seed_processing_register_old_stock.lot_id'), 'old_stock_lot_id'],
          [sequelize.col('seed_inventries_tag->seed_processing_register_old_stock.undersize'), 'undersize'],
          [sequelize.col('seed_inventries_tag->seed_processing_register_old_stock.total_processed_qty'), 'total_processed_qty'],
          [sequelize.col('seed_inventries_tag->seed_processing_register_old_stock.no_of_bags'), 'no_of_bags'],
          [sequelize.col('seed_inventries_tag->seed_processing_register_old_stock.processing_loss'), 'processing_loss'],
          [sequelize.col('seed_inventries_tag->seed_processing_register_old_stock.rejected__qty'), 'rejected__qty'],
          [sequelize.col('seed_inventries_tag->seed_processing_register_old_stock.id'), 'old_stock_id'],
          [sequelize.col('seed_inventries_tag->seed_processing_register_old_stock.id'), 'old_id'],
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
      let lotData = []
      if (data && data.length > 0) {
        data.forEach((el, index) => {

          lotData.push(el && el.old_stock_id ? el.old_stock_id : '')
          let lotIndex
          lotIndex = filterData.findIndex(item => item.crop_code == el.crop_code);
          if (lotIndex == -1) {
            filterData.push({
              "lot_id": el && el.lot_id ? el.lot_id : '',
              "lot_number": el && el.lot_number ? el.lot_number : "",
              "lot_qty": el && el.lot_qty ? el.lot_qty : '',
              "quantity": el && el.quantity ? el.quantity : '',
              "quantity_used": el && el.quantity_used ? el.quantity_used : '',
              "quantity_remaining": el && el.quantity_remaining ? el.quantity_remaining : '',
              "stage_field": el && el.stage_field ? el.stage_field : '',
              "bag_size": el && el.bag_size ? el.bag_size : '',
              "year": el && el.year ? el.year : '',
              "season": el && el.season ? el.season : '',
              "old_id": el && el.old_id ? el.old_id : '',
              seed_class_details: [
                {
                  seed_class: el && el.type ? el.type : '',
                  year: el && el.year ? el.year : '',
                  stage_field: el && el.stage_field ? el.stage_field : '',
                  season: el && el.season ? el.season : '',
                  stage_id: el && el.stage_id ? el.stage_id : '',
                  seed_class_id: el && el.seed_class_id ? el.seed_class_id : '',
                  seed_inventry_id: el && el.id ? el.id : '',
                  quantity_remaining: el && el.quantity_remaining ? el.quantity_remaining : '',
                  old_stock_lot_id: el && el.old_stock_lot_id ? el.old_stock_lot_id : '',
                  undersize: el && el.undersize ? el.undersize : '',
                  total_processed_qty: el && el.total_processed_qty ? el.total_processed_qty : '',
                  no_of_bags: el && el.no_of_bags ? el.no_of_bags : '',
                  processing_loss: el && el.processing_loss ? el.processing_loss : '',
                  rejected_qty: el && el.rejected__qty ? el.rejected__qty : '',
                },
              ],
            })
          }
          else {
            filterData[cropIndex].seed_class_details.push(
              {
                seed_class: el && el.type ? el.type : '',
                year: el && el.year ? el.year : '',
                stage_field: el && el.stage_field ? el.stage_field : '',
                season: el && el.season ? el.season : '',
                stage_id: el && el.stage_id ? el.stage_id : '',
                seed_class_id: el && el.seed_class_id ? el.seed_class_id : '',
                seed_inventry_id: el && el.id ? el.id : '',
                quantity_remaining: el && el.quantity_remaining ? el.quantity_remaining : '',
                old_stock_lot_id: el && el.old_stock_lot_id ? el.old_stock_lot_id : '',
                undersize: el && el.undersize ? el.undersize : '',
                total_processed_qty: el && el.total_processed_qty ? el.total_processed_qty : '',
                no_of_bags: el && el.no_of_bags ? el.no_of_bags : '',
                processing_loss: el && el.processing_loss ? el.processing_loss : '',
                rejected_qty: el && el.rejected__qty ? el.rejected__qty : ''
              },
            )

          }
        })
      }
      let stackData = []
      if (lotData && lotData.length > 0) {
        lotData = lotData.filter(x => x != '');
        if (lotData && lotData.length > 0) {
          const datas = await db.SeedForProcessedStackOldStocks.findAll({
            where: {
              seed_processing_register_old_stock_id: {
                [Op.in]: lotData
              }
            }
          })
          stackData.push(datas)
        }
      }
      let reponseData = {
        data: filterData,
        queryData: varietLineArr,
        stackData: stackData
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
  static saveProcessedSeedDetailsOldStock = async (req, res) => {
    try {
      const { BSPC, classofSeedHarvestedData, crop, lot_no, no_of_bags, processing_lossqty, provision_lot, raw_seed_produced, totalQty,
        user_id, spp, stack, under_size, variety, godown_no, lot_id, total_rejected, stack_id, stack_no, parental_data

      } = req.body;
      console.log()
      const whereClause = {};
      let investingResponse;
      const dataRow = {
        bspc_id: BSPC,
        class_of_seed: classofSeedHarvestedData,
        crop_code: crop,
        lot_no: provision_lot,
        godown_no: godown_no,
        lot_id: lot_id,
        no_of_bags: no_of_bags,
        variety_code: variety,
        processing_loss: processing_lossqty,
        rejected__qty: total_rejected,
        stack_id: stack_id ? stack_id : null,
        stack_no: stack_no ? stack_no : null,
        total_processed_qty: totalQty ? totalQty : null,
        user_id: user_id,
        undersize: under_size,
        variety_line_code: parental_data ? parental_data : ''
      }
      const investHarvesting = await db.seedProcessingRegisterOldStocks.create(dataRow).then(function (item) {
        investingResponse = item['_previousDataValues'];
      })
      for (let key in spp) {
        const dataRows = {
          no_of_bags: spp && spp[key] && spp[key].no_of_bags ? spp[key].no_of_bags : null,
          bag_size: spp && spp[key] && spp[key].bags ? spp[key].bags : null,
          qty: spp && spp[key] && spp[key].qty ? spp[key].qty : null,
          seed_processing_register_id: investingResponse && investingResponse.id ? investingResponse.id : null,
        }
        const investverifyStack = await db.ProcessSeedDetailsoldStocks.create(dataRows)
      }
      if (stack && stack.length > 0) {
        for (let key in stack) {
          const dataRows = {
            godown_no: stack && stack[key] && stack[key].godown_no ? stack[key].godown_no : null,
            type_of_seed: stack && stack[key] && stack[key].type_of_seed ? stack[key].type_of_seed : null,
            stack_no: stack && stack[key] && stack[key].showstackNo ? stack[key].showstackNo : null,
            no_of_bag: stack && stack[key] && stack[key].noofBags ? stack[key].noofBags : null,
            seed_processing_register_old_stock_id: investingResponse && investingResponse.id ? investingResponse.id : null,
          }
          const investverifyTags = await db.SeedForProcessedStackOldStocks.create(dataRows)
        }
      }

      return response(res, status.DATA_SAVE, 200, investingResponse)
    } catch (error) {
      console.error('Error fetching data:', error);
      return response(res, status.DATA_NOT_AVAILABLE, 500, error)
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  static getSeedProcessingRegStackOldStock = async (req, res) => {
    try {
      const { bsp_id, crop_code, user_id, stack_id } = req.body.search;
      let data
      if (stack_id) {
        data = await db.SeedForProcessedStackOldStocks.findAll(
          {
            where: {
              id: stack_id
            }
          }
        )

      } else {
        data = await db.seedProcessingRegisterOldStocks.findAll(
          {
            where: {
              bspc_id: bsp_id,
              crop_code: crop_code,
              user_id: user_id,

            },
            include: [
              {
                model: db.SeedForProcessedStackOldStocks,
                attributes: [],
                required: true
              }
            ],
            // attributes: [
            //   [sequelize.col('seed_for_processed_stack_old_stocks.stack_no'), 'stack_no'],
            //   [sequelize.col('seed_for_processed_stack_old_stocks.id'), 'stack_id'],
            // ],
            raw: true
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
  static getseedInventoryforOldStockLot = async (req, res) => {

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
        filterData2.push({
          seed_class_id: {
            [Op.eq]: 7
          }
        });
      }
      const condition = {
        where: {
          [Op.and]: filterData2 ? filterData2 : []

        },
        include: [
          {
            model: cropModel,
            attributes: [],
            // required: true
          },
          {
            model: varietyModel,
            attributes: [],
            // required: true
          },
          {
            model: db.stageModel,
            attributes: [],
            // required: true
          },
          {
            model: db.seedClassModel,
            attributes: [],
            // required: true
          },

          {
            model: db.seedInventoryTag,
            include: [
              {
                model: db.seedProcessingRegisterOldStocks,
                include: [
                  {
                    model: db.ProcessSeedDetailsoldStocks,
                    attributes: [],
                  },

                ],
                attributes: [],
              }
            ],
            attributes: [],
          },
        ],
        attributes: [
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          'id', 'year', 'season', 'crop_code', 'variety_code',
          'stage_id',
          'seed_class_id',
          [sequelize.col('seed_inventries_tag.id'), 'lot_id'],
          [sequelize.col('seed_inventries_tag.lot_number'), 'lot_number'],

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
  static getYearofBsp4 = async (req, res) => {

    try {
      let filterData2 = []
      if (req.body.search) {

        if (req.body.search.year) {
          filterData2.push({
            year: {
              [Op.eq]: req.body.search.year
            }
          });
        }


      }
      const condition = {
        include: [
          {
            model: db.investVerifyModel,
            required: false,
            include: [
              {
                model: db.investHarvestingModel,
                required: false,
                where: {
                  user_id: req.body.loginedUserid.id
                },
                attributes: []
              }
            ],
            attributes: []
          }
        ],
        attributes: [
          [db.Sequelize.fn("Distinct", db.Sequelize.col("invest_verification->invest_harvesting.year")), "value"],
        ],
        required: false,
        raw: true
      }

      const condition1 = {
        include: [
          {
            model: db.carryOverSeedModel,
            where: {
              user_id: req.body.loginedUserid.id
            },
            attributes: []
          }
        ],
        attributes: [
          [db.Sequelize.fn("Distinct", db.Sequelize.col("carry_over_seed.year")), "value"],
        ],
        required: false,
        raw: true
      }
      //  condition.order[['year','ASC']]
      let data = await db.seedProcessingRegister.findAll(condition)
      let data2 = await db.seedProcessingRegister.findAll(condition1);
      let yearData = [];
      if (data && data.length > 0) {
        data.forEach((el) => {
          yearData.push(el && el.value ? el.value : '');
        })
      }
      if (data2 && data2.length > 0) {
        data2.forEach((el) => {
          yearData.push(el && el.value ? el.value : '');
        })
      }
      if (yearData && yearData.length > 0) {
        yearData.filter(x => x != '')
        yearData = [...new Set(yearData)];
      }
      let year = []
      if (yearData && yearData.length > 0) {
        yearData.forEach((el) => {
          year.push({ value: el })
        })
      }

      if (year) {
        return response(res, status.DATA_AVAILABLE, 200, year)
      } else {
        return response(res, "Data Not Found", 200, {})
      }

    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500, error)
    }
  }
  static getSeeasonofBspFour = async (req, res) => {

    try {
      let filterData2 = [];
      if (req.body.search) {
        if (req.body.search.year) {
          filterData2.push({
            year: {
              [Op.eq]: req.body.search.year
            }
          });
        }
      }

      const condition = {
        include: [
          {
            model: db.investVerifyModel,
            required: false,
            include: [
              {
                model: db.investHarvestingModel,
                required: false,
                where: {
                  user_id: req.body.loginedUserid.id
                },
                attributes: []
              }
            ],
            attributes: []
          }
        ],
        where: {
          [Op.and]: filterData2 ? filterData2 : []
        },
        attributes: [
          [db.Sequelize.fn("Distinct", db.Sequelize.col("invest_verification->invest_harvesting.season")), "value"],
        ],
        required: false,
        raw: true
      }
      const condition1 = {
        include: [
          {
            model: db.carryOverSeedModel,
            where: {
              user_id: req.body.loginedUserid.id
            },
            attributes: []
          }
        ],
        where: {
          [Op.and]: filterData2 ? filterData2 : []
        },
        attributes: [
          [db.Sequelize.fn("Distinct", db.Sequelize.col("carry_over_seed.season")), "value"],
        ],
        required: false,
        raw: true
      }
      //  condition.order[['year','ASC']]
      let data = await db.seedProcessingRegister.findAll(condition);
      let data2 = await db.seedProcessingRegister.findAll(condition1);
      let seasonData = [];
      if (data && data.length > 0) {
        data.forEach((el) => {
          seasonData.push(el && el.value ? el.value : '');
        })
      }
      if (data2 && data2.length > 0) {
        data2.forEach((el) => {
          seasonData.push(el && el.value ? el.value : '');
        })
      }
      if (seasonData && seasonData.length > 0) {
        seasonData.filter(x => x != '');
        seasonData = [...new Set(seasonData)];

      }
      let season = []
      if (seasonData && seasonData.length > 0) {
        seasonData.forEach((el) => {
          season.push({ value: el })
        })
      }

      if (season) {
        return response(res, status.DATA_AVAILABLE, 200, season)
      } else {
        return response(res, "Data Not Found", 200, {})
      }

    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500, error)
    }
  }
  static getCropofBspFour = async (req, res) => {

    try {
      let filterData2 = [];
      if (req.body.search) {
        if (req.body.search.year) {
          filterData2.push({
            year: {
              [Op.eq]: req.body.search.year
            }
          });
        }
        if (req.body.search.season) {
          filterData2.push({
            season: {
              [Op.eq]: req.body.search.season
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
            model: db.investVerifyModel,
            required: false,
            include: [
              {
                model: db.investHarvestingModel,
                required: false,
                where: {
                  user_id: req.body.loginedUserid.id
                },
                attributes: []
              }
            ],
            attributes: []
          }
        ],

        attributes: [
          [db.Sequelize.fn("Distinct", db.Sequelize.col("invest_verification->invest_harvesting.crop_code")), "value"],
          // [sequelize.col('m_crop.crop_name'),'crop_name']
        ],

        raw: true
      }
      const condition1 = {
        include: [
          {
            model: db.carryOverSeedModel,
            where: {
              user_id: req.body.loginedUserid.id
            },
            attributes: []
          }
        ],
        where: {
          [Op.and]: filterData2 ? filterData2 : []
        },
        attributes: [
          [db.Sequelize.fn("Distinct", db.Sequelize.col("carry_over_seed.crop_code")), "value"],
        ],
        required: false,
        raw: true
      }
      //  condition.order[['year','ASC']]
      let data = await db.seedProcessingRegister.findAll(condition)
      let data2 = await db.seedProcessingRegister.findAll(condition1);
      let cropData = [];
      if (data && data.length > 0) {
        data.forEach((el) => {
          cropData.push(el && el.value ? el.value : '');
        })
      }
      if (data2 && data2.length > 0) {
        data2.forEach((el) => {
          cropData.push(el && el.value ? el.value : '');
        })
      }
      if (cropData && cropData.length > 0) {
        cropData.filter(x => x != '')
      }
      let crop = []

      let cropValue = await db.cropModel.findAll({
        where: {
          crop_code: {
            [Op.in]: cropData
          }
        },
        attributes: [
          [sequelize.col('m_crop.crop_code'), 'crop_code'],
          [sequelize.col('m_crop.crop_name'), 'crop_name'],

        ]
      })
      if (cropValue) {
        return response(res, status.DATA_AVAILABLE, 200, cropValue)
      } else {
        return response(res, "Data Not Found", 200, {})
      }

    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500, error)
    }
  }
  static getTotalQtyDataofCropbspFour = async (req, res) => {

    try {
      let filterData2 = [];
      if (req.body.search) {
        if (req.body.search.year) {
          filterData2.push({
            year: {
              [Op.eq]: req.body.search.year
            }
          });
        }
        if (req.body.search.season) {
          filterData2.push({
            season: {
              [Op.eq]: req.body.search.season
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
      let datas = await db.seedProcessingRegister.findAll({
        include: [
          {
            model: db.investVerifyModel,
            required: false,
            include: [
              {
                model: db.investHarvestingModel,
                required: false,
                where: {
                  user_id: req.body.loginedUserid.id
                },
                attributes: []
              }
            ],
            attributes: []
          }
        ],
        attributes: [
          [db.Sequelize.fn("Distinct", db.Sequelize.col("seed_processing_register.variety_code")), "variety_code"],
          // [sequelize.col('m_crop.crop_name'),'crop_name']
        ],

        // attributes:['variety_code'],
        raw: true
      })
      let datas2 = await db.seedProcessingRegister.findAll({
        include: [
          {
            model: db.carryOverSeedModel,
            where: {
              user_id: req.body.loginedUserid.id
            },
            attributes: []
          }
        ],
        where: {
          [Op.and]: filterData2 ? filterData2 : []
        },
        attributes: [
          [db.Sequelize.fn("Distinct", db.Sequelize.col("seed_processing_register.variety_code")), "variety_code"],
        ],

        raw: true
      })
      let processingVariety = await db.seedProcessingRegister.findAll({
        where: {
          [Op.and]: filterData2 ? filterData2 : []
        },
        raw: true,
        attributes: ['variety_code', 'variety_code_line']
      })
      let Variety = [];
      if (datas && datas.length > 0) {
        datas.forEach((el) => {
          Variety.push(el && el.variety_code ? el.variety_code : '')
        })
      }
      if (datas2 && datas2.length > 0) {
        datas2.forEach((el) => {
          Variety.push(el && el.variety_code ? el.variety_code : '')
        })
      }
      let varietyData = [];
      let variety_code_line = []
      if (processingVariety && processingVariety.length > 0) {
        processingVariety.forEach((el) => {
          varietyData.push(el && el.variety_code ? el.variety_code : '');
          variety_code_line.push(el && el.variety_code_line ? el.variety_code_line : '')
        })
      }
      console.log(varietyData, 'Variety')
      if (variety_code_line && variety_code_line.length > 0) {
        variety_code_line = variety_code_line.filter(x => x != '')
      }
      const condition = {
        where: {
          [Op.and]: filterData2 ? filterData2 : [],
          variety_code: {
            [Op.in]: Variety
          },

        },
        include: [
          {
            model: db.bspProformaOneBspc,
            where: {
              bspc_id: req.body.loginedUserid.id,

            },
            attributes: []
          }
        ],
        attributes: [
          [sequelize.fn('sum', sequelize.col('bsp_proforma_1_bspc.target_qunatity')), 'target_qunatity'],
        ],
        raw: true,
      }
      const condition1 = {
        where: {
          variety_code: {
            [Op.in]: Variety
          },
          user_id: req.body.loginedUserid.id
          // [Op.and]: filterData2 ? filterData2 : []
        },

        include: [
          {
            model: db.indentOfBrseedDirectLineModel,
            attributes: []
          }
        ],
        attributes: [
          [sequelize.fn('sum', sequelize.col('indent_of_brseed_direct_line.quantity')), 'quantity'],
          // [sequelize.col("indent_of_brseed_direct_line.quantity"),'quantity']
        ],
        raw: true,
      }

      const condition2 = {
        where: {
          [Op.and]: filterData2 ? filterData2 : [],
          get_carry_over: {
            [Op.eq]: 1
          }
        },
        attributes: [
          [sequelize.fn('sum', sequelize.col('total_processed_qty')), 'total_processed_qty'],
        ],
        raw: true,
      }
      let generateSampleForwardingLetters = await db.seedProcessingRegister.findAll(
        {
          include: [
            {
              model: db.generateSampleForwardingLettersModel,
              attributes: [],
              where: {
                variety_code: {
                  [Op.in]: Variety
                },
              },
            }
          ],
          raw: true,
          where: {
            get_carry_over: 2
          },


          attributes: [
            [sequelize.col('generate_sample_forwarding_letter.variety_code'), 'variety_code'],
            [sequelize.col('generate_sample_forwarding_letter.variety_code_line'), 'variety_line_code'],
            [sequelize.literal('SUM(seed_processing_register.total_processed_qty)'), 'total_processed_qty'],
          ],
          group: [
            [sequelize.col('generate_sample_forwarding_letter.variety_code'), 'variety_code'],
            // [sequelize.col('seed_processing_register.variety_code_line'),'variety_code_line'],      
            [sequelize.col('generate_sample_forwarding_letter.variety_code_line'), 'variety_line_code'],
          ]
        }
      )
      //  condition.order[['year','ASC']]
      let bspPerformaBspOne = await db.bspPerformaBspOne.findAll(condition)
      let directIndent = await db.directIndent.findAll(condition1)
      let seedProcessingRegister = await db.seedProcessingRegister.findAll(condition2);

      let counRegister = await db.seedProcessingRegister.findAll({
        where: {
          [Op.and]: filterData2 ? filterData2 : [],
          bspc_id: req.body.loginedUserid.id
        },
        attributes: [
          [db.Sequelize.fn("Distinct", db.Sequelize.col("seed_processing_register.variety_code")), "variety_code"],
          // [db.Sequelize.fn("Distinct", db.Sequelize.col("seed_processing_register.variety_code")), "variety_code"],
        ],
        group: [
          [db.Sequelize.col("seed_processing_register.variety_code"), 'variety_code']
        ],
        raw: true
      })
      let data = {
        bspPerformaBspOne: bspPerformaBspOne,
        directIndent: directIndent,
        seedProcessingRegister: seedProcessingRegister,
        counRegister: counRegister && counRegister.length > 0 ? counRegister.length : 0,
        generateSampleForwardingLetters: generateSampleForwardingLetters,

      }

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
  static getDataOfBspFour = async (req, res) => {

    try {
      let varietyData = [];
      let filterData2 = [];
      let isFinalSubmittedCheck;
      if (req.body.search) {
        if (req.body.search.year) {
          filterData2.push({
            year: {
              [Op.eq]: req.body.search.year
            }
          });
        }
        if (req.body.search.season) {
          filterData2.push({
            season: {
              [Op.eq]: req.body.search.season
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
      let isSubmitedCheck = await db.seedProcessingRegister.findAll({
        where: {
          year: req.body.search.year,
          season: req.body.search.season,
          crop_code: req.body.search.crop_code,
          is_bsp_4_submitted: 1,
          bspc_id: req.body && req.body.loginedUserid && req.body.loginedUserid.id ? req.body.loginedUserid.id : null
        }
      })
      let isCheckCarryOverExist = await db.seedProcessingRegister.findAll({
        where: {
          year: req.body.search.year,
          season: req.body.search.season,
          crop_code: req.body.search.crop_code,
          get_carry_over: 2,
          action: 1,
          bspc_id: req.body && req.body.loginedUserid && req.body.loginedUserid.id ? req.body.loginedUserid.id : null
        }
      })
      let isCheckAllDataExist = await db.seedProcessingRegister.findAll({
        where: {
          year: req.body.search.year,
          season: req.body.search.season,
          crop_code: req.body.search.crop_code,
          get_carry_over: 1,
          action: 2,
          bspc_id: req.body && req.body.loginedUserid && req.body.loginedUserid.id ? req.body.loginedUserid.id : null
        }
      })
      if (isSubmitedCheck && isSubmitedCheck.length) {
        isFinalSubmittedCheck = {
          is_bsp_4_submitted: 1
        }
      }
      let stlReportStatus = await db.stlReportStatusModel.findAll({
        where: {
          // variety_code: {
          //   [Op.in]: varietyData},
          year: req.body.search.year,
          season: req.body.search.season,
          crop_code: req.body.search.crop_code,
          // status: 'success', 
          user_id: req.body.loginedUserid.id,
          // lot_id:
        },
        raw: true
      })
      // console.log('stlReportStatus',stlReportStatus);
      // return;
      // {
      //   model: db.stlReportStatusModel,
      //   attributes: [],
      //   where: {
      //     variety_code: {
      //       [Op.in]: varietyData
      //     },
      //     status: 'success',
      //     user_id: req.body.loginedUserid.id
      //   },
      // }
      // if(isCheckCarryOverExist && isCheckCarryOverExist.length){

      // }
      // return;
      const condition = {
        where: {
          [Op.and]: filterData2 ? filterData2 : [],
          bspc_id: req.body.loginedUserid.id,
        },

        include: [
          {
            model: varietyModel,
            attributes: []
          },
          {
            model: db.varietLineModel,
            attributes: []
          },
        ],
        attributes: [
          [db.Sequelize.col("seed_processing_register.variety_code_line"), "variety_code_line"],
          [db.Sequelize.col("seed_processing_register.variety_code"), "variety_code"],
          [db.Sequelize.col('m_variety_line.line_variety_name'), 'line_variety_name'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          // [sequelize.col('seed_processing_register.is_bsp_4_submitted'), 'is_bsp_4_submitted'],
        ],
        group: [
          [db.Sequelize.col("seed_processing_register.variety_code_line"), "variety_code_line"],
          [db.Sequelize.col("seed_processing_register.variety_code"), "variety_code"],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [db.Sequelize.col('m_variety_line.line_variety_name'), 'line_variety_name'],
          // [sequelize.col('seed_processing_register.is_bsp_4_submitted'), 'is_bsp_4_submitted']
        ],
        raw: true,
      }
      const condition2 = {
        where: {
          [Op.and]: filterData2 ? filterData2 : [],
          // where: {
          // },

          bspc_id: req.body.loginedUserid.id,
          // user_id: req.body.loginedUserid.id,
          get_carry_over: {
            [Op.eq]: 1
          },

          ...isFinalSubmittedCheck,
          action: 1

        },

        include: [
          {
            model: varietyModel,
            attributes: []
          },
          {
            model: db.varietLineModel,
            attributes: []
          },
          // {
          //   required:false,
          //   model: db.stlReportStatusModel,
          //   attributes: [],
          //   where: {

          //     // 'success'
          //     [Op.and]: [
          //       {
          //         variety_code: {
          //           [Op.in]: varietyData
          //         },
          //       },
          //       {
          //         [Op.or]:[
          //           {
          //             status: {
          //               [Op.eq]: "success"
          //             }
          //           },
          //           // {
          //           //   status: {
          //           //     [Op.eq]: null
          //           //   }
          //           // },
          //           // {
          //           //   status: {
          //           //     [Op.eq]: ''
          //           //   }
          //           // }
          //         ]
          //       },
          //       { user_id: req.body.loginedUserid.id}
          //     ],

          //   },
          // }
          // {
          //   model: db.investVerifyModel,
          //   required: false,
          //   include: [
          //     {
          //       model: db.investHarvestingModel,
          //       required: false,
          //       where: {
          //         user_id: req.body.loginedUserid.id
          //       },
          //       attributes: []
          //     }
          //   ],
          //   attributes: []
          // },
        ],
        attributes: [
          [db.Sequelize.col("seed_processing_register.variety_code_line"), "variety_code_line"],
          [db.Sequelize.col("seed_processing_register.variety_code"), "variety_code"],
          [db.Sequelize.col('m_variety_line.line_variety_name'), 'line_variety_name'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [sequelize.col('seed_processing_register.lot_no'), 'lot_no'],
          [sequelize.literal('SUM(seed_processing_register.total_processed_qty)'), 'total_processed_qty'],
        ],
        group: [
          [db.Sequelize.col("seed_processing_register.variety_code_line"), "variety_code_line"],
          [db.Sequelize.col("seed_processing_register.variety_code"), "variety_code"],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [db.Sequelize.col('m_variety_line.line_variety_name'), 'line_variety_name'],
          [sequelize.col('seed_processing_register.lot_no'), 'lot_no'],
        ],
        raw: true,
      }
      const condition4 = {
        where: {
          [Op.and]: filterData2 ? filterData2 : [],
          get_carry_over: {
            [Op.eq]: 1
          },

          bspc_id: req.body.loginedUserid.id,
          action: 2,
          ...isFinalSubmittedCheck,
        },

        include: [
          {
            model: varietyModel,
            attributes: []
          },
          {
            model: db.varietLineModel,
            attributes: []
          },
          // {
          //   required:false,
          //   model: db.stlReportStatusModel,
          //   attributes: [],
          //   where: {

          //     // 'success'
          //     [Op.and]: [
          //       {
          //         variety_code: {
          //           [Op.in]: varietyData
          //         },
          //       },
          //       {
          //         [Op.or]:[
          //           {
          //             status: {
          //               [Op.eq]: "success"
          //             }
          //           },
          //           // {
          //           //   status: {
          //           //     [Op.eq]: null
          //           //   }
          //           // },
          //           // {
          //           //   status: {
          //           //     [Op.eq]: ''
          //           //   }
          //           // }
          //         ]
          //       },
          //       { user_id: req.body.loginedUserid.id}
          //     ],

          //   },
          // }
        ],
        attributes: [
          [db.Sequelize.col("seed_processing_register.variety_code_line"), "variety_code_line"],
          [db.Sequelize.col("seed_processing_register.variety_code"), "variety_code"],
          [db.Sequelize.col('m_variety_line.line_variety_name'), 'line_variety_name'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [sequelize.col('seed_processing_register.lot_no'), 'lot_no'],
          [sequelize.literal('SUM(seed_processing_register.recover_qty)'), 'recover_qty'],
        ],
        group: [
          [db.Sequelize.col("seed_processing_register.variety_code_line"), "variety_code_line"],
          [db.Sequelize.col("seed_processing_register.variety_code"), "variety_code"],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [db.Sequelize.col('m_variety_line.line_variety_name'), 'line_variety_name'],
          [sequelize.col('seed_processing_register.lot_no'), 'lot_no'],
        ],
        raw: true,
      }
      const condition5 = {
        where: {
          [Op.and]: filterData2 ? filterData2 : [],

          bspc_id: req.body.loginedUserid.id,
          get_carry_over: {
            [Op.eq]: 2
          },
          action: 1,
          ...isFinalSubmittedCheck,
        },

        include: [
          {
            model: varietyModel,
            attributes: []
          },
          {
            model: db.varietLineModel,
            attributes: []
          },
          // {
          //   required:false,
          //   model: db.stlReportStatusModel,
          //   attributes: [],
          //   where: {

          //     // 'success'
          //     [Op.and]: [
          //       {
          //         variety_code: {
          //           [Op.in]: varietyData
          //         },
          //       },
          //       {
          //         [Op.or]:[
          //           {
          //             status: {
          //               [Op.eq]: "success"
          //             }
          //           },
          //           // {
          //           //   status: {
          //           //     [Op.eq]: null
          //           //   }
          //           // },
          //           // {
          //           //   status: {
          //           //     [Op.eq]: ''
          //           //   }
          //           // }
          //         ]
          //       },
          //       { user_id: req.body.loginedUserid.id}
          //     ],

          //   },
          // }
          // {
          //   model: db.carryOverSeedModel,
          //   where: {
          //     user_id: req.body.loginedUserid.id
          //   },
          //   attributes: []
          // }
        ],
        attributes: [
          [db.Sequelize.col("seed_processing_register.variety_code_line"), "variety_code_line"],
          [db.Sequelize.col("seed_processing_register.variety_code"), "variety_code"],
          [db.Sequelize.col('m_variety_line.line_variety_name'), 'line_variety_name'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [sequelize.literal('SUM(seed_processing_register.total_processed_qty)'), 'total_processed_qty'],
        ],
        group: [
          [db.Sequelize.col("seed_processing_register.variety_code_line"), "variety_code_line"],
          [db.Sequelize.col("seed_processing_register.variety_code"), "variety_code"],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [db.Sequelize.col('m_variety_line.line_variety_name'), 'line_variety_name']
        ],
        raw: true,
      }
      const condition6 = {
        where: {
          [Op.and]: filterData2 ? filterData2 : [],

          bspc_id: req.body.loginedUserid.id,
          get_carry_over: {
            [Op.eq]: 2
          },
          action: 2,
          ...isFinalSubmittedCheck,
        },

        include: [
          {
            model: varietyModel,
            attributes: []
          },
          {
            model: db.varietLineModel,
            attributes: []
          },
          // {
          //   required:false,
          //   model: db.stlReportStatusModel,
          //   attributes: [],
          //   where: {

          //     // 'success'
          //     [Op.and]: [
          //       {
          //         variety_code: {
          //           [Op.in]: varietyData
          //         },
          //       },
          //       {
          //         [Op.or]:[
          //           {
          //             status: {
          //               [Op.eq]: "success"
          //             }
          //           },
          //           // {
          //           //   status: {
          //           //     [Op.eq]: null
          //           //   }
          //           // },
          //           // {
          //           //   status: {
          //           //     [Op.eq]: ''
          //           //   }
          //           // }
          //         ]
          //       },
          //       { user_id: req.body.loginedUserid.id}
          //     ],

          //   },
          // }
          // {
          //   model: db.carryOverSeedModel,
          //   where: {
          //     user_id: req.body.loginedUserid.id
          //   },
          //   attributes: []
          // }
        ],
        attributes: [
          [db.Sequelize.col("seed_processing_register.variety_code_line"), "variety_code_line"],
          [db.Sequelize.col("seed_processing_register.variety_code"), "variety_code"],
          [db.Sequelize.col('m_variety_line.line_variety_name'), 'line_variety_name'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [sequelize.literal('SUM(seed_processing_register.recover_qty)'), 'recover_qty'],
        ],
        group: [
          [db.Sequelize.col("seed_processing_register.variety_code_line"), "variety_code_line"],
          [db.Sequelize.col("seed_processing_register.variety_code"), "variety_code"],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [db.Sequelize.col('m_variety_line.line_variety_name'), 'line_variety_name']
        ],
        raw: true,
      }
      const condition3 = {
        where: {
          [Op.and]: filterData2 ? filterData2 : [],
          user_id: req.body.loginedUserid.id
        },


        attributes: [
          [db.Sequelize.col("availability_of_breeder_seed.variety_line_code"), "variety_code_line"],
          [db.Sequelize.col("availability_of_breeder_seed.variety_code"), "variety_code"],
          [db.Sequelize.col("availability_of_breeder_seed.save_as_draft"), "save_as_draft"],
          [db.Sequelize.col("availability_of_breeder_seed.allocate_qty"), "allocate_qty"],
          [db.Sequelize.col("availability_of_breeder_seed.is_final_submit"), "is_final_submit"],
          [db.Sequelize.col("availability_of_breeder_seed.id"), "avialability_id"],

        ],

        raw: true,
      }

      // condition.order=[[sequelize.col('m_crop_variety.variety_name'),'ASC']]
      let seedProcess = await db.seedProcessingRegister.findAll(condition)
      if (seedProcess && seedProcess.length > 0) {
        seedProcess.forEach((el) => {
          varietyData.push(el && el.variety_code ? el.variety_code : '')
        })
      }
      let seedProcessBreederSeedProuced = await db.seedProcessingRegister.findAll(condition2)
      let seedProcessBreederSeedProucedtotal = await db.seedProcessingRegister.findAll(condition4)
      let availabilityOfBreederSeed = await db.availabilityOfBreederSeedModel.findAll(condition3);
      let seedProcessBreederSeedProuced2 = await db.seedProcessingRegister.findAll(condition5)
      let seedProcessBreederSeedProuced3 = await db.seedProcessingRegister.findAll(condition6)


      let bspOne;
      let directData;
      let directDatawithoutlineCode;
      let generateSampleForwardingLetters;
      if (varietyData && varietyData.length > 0) {
        bspOne = await db.bspPerformaBspOne.findAll(

          {
            where: {
              variety_code: {
                [Op.in]: varietyData,
              },
              // user_id:req.body.loginedUserid.id
            },
            include: [
              {
                model: db.bspProformaOneBspc,
                required: true,
                where: {
                  bspc_id: req.body.loginedUserid.id
                },
                attributes: []
              },
            ],
            raw: true,
            attributes: [
              [sequelize.col('bsp_proforma_1s.variety_code'), 'variety_code'],
              [sequelize.col('bsp_proforma_1s.variety_line_code'), 'variety_line_code'],
              [sequelize.literal('SUM(bsp_proforma_1_bspc.target_qunatity)'), 'target_quantity'],
            ],
            group: [
              [sequelize.col('bsp_proforma_1s.variety_code'), 'variety_code'],
              [sequelize.col('bsp_proforma_1s.variety_line_code'), 'variety_line_code'],
            ]
          }
        )
      }
      if (varietyData && varietyData.length > 0) {
        directData = await db.directIndent.findAll(
          {
            include: [
              {
                model: db.indentOfBrseedDirectLineModel,
                required: true,

                attributes: []
              },
            ],
            raw: true,
            attributes: [
              [sequelize.col('indent_of_breederseed_direct.variety_code'), 'variety_code'],
              [sequelize.col('indent_of_brseed_direct_line.variety_code_line'), 'variety_line_code'],
              [sequelize.literal('SUM(indent_of_brseed_direct_line.quantity)'), 'quantity'],
            ],
            group: [
              [sequelize.col('indent_of_breederseed_direct.variety_code'), 'variety_code'],
              [sequelize.col('indent_of_brseed_direct_line.variety_code_line'), 'variety_line_code'],
            ],
            where: {
              user_id: req.body.loginedUserid.id,
              variety_code: {
                [Op.in]: varietyData
              },
            },
          }
        )

        directDatawithoutlineCode = await db.directIndent.findAll(
          {
            where: {
              variety_code: {
                [Op.in]: varietyData
              },
              user_id: req.body.loginedUserid.id,
            },
            include: [
              {
                model: db.indentOfBrseedDirectLineModel,
                required: false,
                where: {
                  // bspc_id: req.body.search.user_id
                },
                attributes: []
              },
            ],
            raw: true,
            attributes: [
              [sequelize.col('indent_of_breederseed_direct.variety_code'), 'variety_code'],
              [sequelize.literal('SUM(indent_of_breederseed_direct.quantity)'), 'quantity'],
              // [sequelize.col('indent_of_brseed_direct_line.variety_code_line'), 'variety_line_code'],           
              // [sequelize.literal('SUM(indent_of_brseed_direct_line.quantity)'), 'quantity'],
            ],
            group: [
              [sequelize.col('indent_of_breederseed_direct.variety_code'), 'variety_code'],
              // [sequelize.col('indent_of_brseed_direct_line.variety_code_line'), 'variety_line_code'],
            ]
          }
        )
      }

      let generateSampleForwardingLetters2;
      let generateSampleForwardingLetters3;
      let generateSampleForwardingLetters4;
      if (varietyData && varietyData.length > 0) {
        generateSampleForwardingLetters = await db.seedProcessingRegister.findAll(
          {
            include: [
              {
                model: db.stlReportStatusModel,
                attributes: [],
                where: {
                  variety_code: {
                    [Op.in]: varietyData
                  },
                  status: 'success',
                  user_id: req.body.loginedUserid.id
                },
              }
            ],
            raw: true,
            where: {
              get_carry_over: 2,
              action: 1,
              bspc_id: req.body.loginedUserid.id,
              ...isFinalSubmittedCheck,
              // user_id:req.body.loginedUserid.aid
            },
            // attributes:[
            //   [db.Sequelize.fn("Distinct", db.Sequelize.col("generate_sample_forwarding_letters.variety_code")), "variety_code"],

            // ]

            attributes: [
              [sequelize.col('stl_report_status.variety_code'), 'variety_code'],
              [sequelize.col('stl_report_status.variety_code_line'), 'variety_line_code'],
              // [sequelize.col('generate_sample_forwarding_letter.id'), 'generate_id'],
              [sequelize.col('seed_processing_register.variety_code_line'), 'variety_code_line'],
              [sequelize.literal('SUM(seed_processing_register.total_processed_qty)'), 'total_processed_qty'],
            ],
            group: [
              [sequelize.col('stl_report_status.variety_code'), 'variety_code'],
              [sequelize.col('seed_processing_register.variety_code_line'), 'variety_code_line'],
              [sequelize.col('stl_report_status.variety_code_line'), 'variety_line_code'],
              // [sequelize.col('generate_sample_forwarding_letter.id'), 'generate_id'],
            ]
          }
        )

        generateSampleForwardingLetters2 = await db.seedProcessingRegister.findAll(
          {
            include: [
              {
                model: db.stlReportStatusModel,
                attributes: [],
                where: {
                  variety_code: {
                    [Op.in]: varietyData
                  },
                  status: 'success',
                  user_id: req.body.loginedUserid.id
                },
              }
            ],
            raw: true,
            where: {
              action: 2,
              get_carry_over: 2,
              bspc_id: req.body.loginedUserid.id
              // user_id:req.body.loginedUserid.id
            },
            // attributes:[
            //   [db.Sequelize.fn("Distinct", db.Sequelize.col("generate_sample_forwarding_letters.variety_code")), "variety_code"],

            // ]

            attributes: [
              [sequelize.col('stl_report_status.variety_code'), 'variety_code'],
              [sequelize.col('stl_report_status.variety_code_line'), 'variety_line_code'],
              // [sequelize.col('generate_sample_forwarding_letter.id'), 'generate_id'],
              [sequelize.col('seed_processing_register.variety_code_line'), 'variety_code_line'],
              // [sequelize.col('seed_processing_register.lot_qty'),'lot_qty'],         
              [sequelize.literal('SUM(seed_processing_register.recover_qty)'), 'recover_qty'],

            ],
            group: [
              [sequelize.col('stl_report_status.variety_code'), 'variety_code'],
              [sequelize.col('seed_processing_register.variety_code_line'), 'variety_code_line'],
              // [sequelize.col('seed_processing_register.lot_qty'),'lot_qty'],   
              [sequelize.col('stl_report_status.variety_code_line'), 'variety_line_code'],
              // [sequelize.col('generate_sample_forwarding_letter.id'), 'generate_id'],
            ]
          }
        )
        generateSampleForwardingLetters3 = await db.seedProcessingRegister.findAll(
          {
            include: [
              {
                // required:fals
                model: db.stlReportStatusModel,
                attributes: [],
                where: {
                  variety_code: {
                    [Op.in]: varietyData
                  },
                  status: 'success',
                  user_id: req.body.loginedUserid.id
                },
              }
            ],
            raw: true,
            where: {
              action: 1,
              get_carry_over: 2,
              bspc_id: req.body.loginedUserid.id
              // user_id:req.body.loginedUserid.id
            },
            // attributes:[
            //   [db.Sequelize.fn("Distinct", db.Sequelize.col("generate_sample_forwarding_letters.variety_code")), "variety_code"],

            // ]

            attributes: [
              [sequelize.col('stl_report_status.variety_code'), 'variety_code'],
              [sequelize.col('stl_report_status.variety_code_line'), 'variety_line_code'],
              // [sequelize.col('generate_sample_forwarding_letter.id'), 'generate_id'],
              [sequelize.col('seed_processing_register.variety_code_line'), 'variety_code_line'],
              [sequelize.literal('SUM(seed_processing_register.total_processed_qty)'), 'total_processed_qty'],
              // [sequelize.col('seed_processing_register.lot_qty'),'lot_qty'],         
              // [sequelize.literal('SUM(seed_processing_register.recover_qty)'), 'recover_qty'],

            ],
            group: [
              [sequelize.col('stl_report_status.variety_code'), 'variety_code'],
              [sequelize.col('seed_processing_register.variety_code_line'), 'variety_code_line'],
              // [sequelize.col('seed_processing_register.lot_qty'),'lot_qty'],   
              [sequelize.col('stl_report_status.variety_code_line'), 'variety_line_code'],
              // [sequelize.col('generate_sample_forwarding_letter.id'), 'generate_id'],
            ]
          }
        )
        generateSampleForwardingLetters4 = await db.seedProcessingRegister.findAll(
          {
            include: [
              {
                model: db.stlReportStatusModel,
                attributes: [],
                where: {
                  variety_code: {
                    [Op.in]: varietyData
                  },
                  status: 'success',
                  user_id: req.body.loginedUserid.id
                },
              }
            ],
            raw: true,
            where: {
              action: 2,
              get_carry_over: 2,
              bspc_id: req.body.loginedUserid.id
              // user_id:req.body.loginedUserid.id
            },
            // attributes:[
            //   [db.Sequelize.fn("Distinct", db.Sequelize.col("generate_sample_forwarding_letters.variety_code")), "variety_code"],

            // ]

            attributes: [
              [sequelize.col('stl_report_status.variety_code'), 'variety_code'],
              [sequelize.col('stl_report_status.variety_code_line'), 'variety_line_code'],
              // [sequelize.col('generate_sample_forwarding_letter.id'), 'generate_id'],
              [sequelize.col('seed_processing_register.variety_code_line'), 'variety_code_line'],
              // [sequelize.col('seed_processing_register.lot_qty'),'lot_qty'],         
              [sequelize.literal('SUM(seed_processing_register.recover_qty)'), 'recover_qty'],

            ],
            group: [
              [sequelize.col('stl_report_status.variety_code'), 'variety_code'],
              [sequelize.col('seed_processing_register.variety_code_line'), 'variety_code_line'],
              // [sequelize.col('seed_processing_register.lot_qty'),'lot_qty'],   
              [sequelize.col('stl_report_status.variety_code_line'), 'variety_line_code'],
              // [sequelize.col('generate_sample_forwarding_letter.id'), 'generate_id'],
            ]
          }
        )
      }
      if (isCheckCarryOverExist && isCheckCarryOverExist.length < 1) {
        generateSampleForwardingLetters3 = []
      }

      let seedProcessBreederSeedProucedtotalFinalArray = [];
      let seedProcessBreederSeedProucedFinalArray = [];
      let seedProcessBreederSeedProucedFinal = [];
      let seedProcessBreederSeedProucedtotalFinal = [];

      if (seedProcessBreederSeedProuced && seedProcessBreederSeedProuced.length) {
        const groupedData1 = seedProcessBreederSeedProuced.reduce((acc, curr) => {
          const key = `${curr.variety_code}_${curr.variety_code_line || 'null'}`;
          if (!acc[key]) {
            acc[key] = {
              variety_code: curr.variety_code,
              variety_code_line: curr.variety_code_line,
              variety_name: curr.variety_name,
              line_variety_name: curr && curr.line_variety_name ? curr.line_variety_name : null,
              total_processed_qty: 0,
              lot_no: curr.lot_no,
            };
          }
          acc[key].total_processed_qty += curr.total_processed_qty;
          return acc;
        }, {});
        seedProcessBreederSeedProucedFinalArray = Object.values(groupedData1);;
      }
      if (seedProcessBreederSeedProucedtotal && seedProcessBreederSeedProucedtotal.length) {
        const groupedData = seedProcessBreederSeedProucedtotal.reduce((acc, curr) => {
          const key = `${curr.variety_code}_${curr.variety_code_line || 'null'}`;
          if (!acc[key]) {
            acc[key] = {
              variety_code: curr.variety_code,
              variety_code_line: curr.variety_code_line,
              variety_name: curr.variety_name,
              lot_no: curr.lot_no,
              line_variety_name: curr && curr.line_variety_name ? curr.line_variety_name : null,
              recover_qty: 0
            };
          }
          acc[key].recover_qty += curr.recover_qty;
          return acc;
        }, {});
        seedProcessBreederSeedProucedtotalFinalArray = Object.values(groupedData);
      }
      if (stlReportStatus && stlReportStatus.length) {
        stlReportStatus.forEach(item => {
          seedProcessBreederSeedProucedFinalArray.forEach(ele => {
            if (item.lot_no == ele.lot_no) {
              if ((item.status == 'discard' || item.status == 're-sample')) {
                seedProcessBreederSeedProucedFinal.push({
                  variety_code_line: ele && ele.variety_code_line ? ele.variety_code_line : null,
                  variety_code: ele && ele.variety_code ? ele.variety_code : null,
                  line_variety_name: ele && ele.line_variety_name ? ele.line_variety_name : null,
                  variety_name: ele && ele.variety_name ? ele.variety_name : null,
                  total_processed_qty: 0
                })
              } else {
                seedProcessBreederSeedProucedFinal.push({
                  variety_code_line: ele && ele.variety_code_line ? ele.variety_code_line : null,
                  variety_code: ele && ele.variety_code ? ele.variety_code : null,
                  line_variety_name: ele && ele.line_variety_name ? ele.line_variety_name : null,
                  variety_name: ele && ele.variety_name ? ele.variety_name : null,
                  total_processed_qty: ele && ele.total_processed_qty ? ele.total_processed_qty : null
                })
              }
            } else {
              // seedProcessBreederSeedProucedFinal.push({
              //   variety_code_line: ele && ele.variety_code_line ? ele.variety_code_line : null,
              //   variety_code: ele && ele.variety_code ? ele.variety_code : null,
              //   line_variety_name: ele && ele.line_variety_name ? ele.line_variety_name : null,
              //   variety_name: ele && ele.variety_name ? ele.variety_name : null,
              //   total_processed_qty: ele && ele.total_processed_qty ? ele.total_processed_qty : null
              // })
            }
          })
          seedProcessBreederSeedProucedtotalFinalArray.forEach(ele => {
            // console.log('ele.lot_no===', ele.lot_no);
            if (item.lot_no == ele.lot_no) {
              if ((item.status == 'discard' || item.status == 're-sample')) {
                seedProcessBreederSeedProucedtotalFinal.push({
                  variety_code_line: ele && ele.variety_code_line ? ele.variety_code_line : null,
                  variety_code: ele && ele.variety_code ? ele.variety_code : null,
                  line_variety_name: ele && ele.line_variety_name ? ele.line_variety_name : null,
                  variety_name: ele && ele.variety_name ? ele.variety_name : null,
                  recover_qty: 0
                })
              } else if (item && item.lot_no == ele.lot_no) {
                seedProcessBreederSeedProucedtotalFinal.push({
                  variety_code_line: ele && ele.variety_code_line ? ele.variety_code_line : null,
                  variety_code: ele && ele.variety_code ? ele.variety_code : null,
                  line_variety_name: ele && ele.line_variety_name ? ele.line_variety_name : null,
                  variety_name: ele && ele.variety_name ? ele.variety_name : null,
                  recover_qty: ele && ele.recover_qty ? ele.recover_qty : null
                })
              }
            } else {
              // seedProcessBreederSeedProucedtotalFinal.push({
              //   variety_code_line: ele && ele.variety_code_line ? ele.variety_code_line : null,
              //   variety_code: ele && ele.variety_code ? ele.variety_code : null,
              //   line_variety_name: ele && ele.line_variety_name ? ele.line_variety_name : null,
              //   variety_name: ele && ele.variety_name ? ele.variety_name : null,
              //   recover_qty: ele && ele.recover_qty ? ele.recover_qty : null
              // })
            }
          })
        })
      } else {
        seedProcessBreederSeedProucedFinal = seedProcessBreederSeedProucedFinalArray
        seedProcessBreederSeedProucedtotalFinal = seedProcessBreederSeedProucedtotalFinalArray
      }

      let checkStatus = await db.stlReportStatusModel.findAll({
        include: [
          {
            model: db.seedProcessingRegister,
            attributes: [],
            where: {
              bspc_id: req.body.loginedUserid.id,
              year: req.body.search.year,
              season: req.body.search.season,
              crop_code: req.body.search.crop_code,
             
            }
          }
        ],
        where: {
          user_id: req.body.loginedUserid.id,
          year: req.body.search.year,
          season: req.body.search.season,
          crop_code: req.body.search.crop_code,
          [Op.or]: [
            {
              status: {
                [Op.eq]: 'discard'
              }
            },
            {
              status: {
                [Op.eq]: 're-sample'
              }
            }
          ]
        },
        raw: true,
        attributes:[
          [db.Sequelize.col("seed_processing_register.variety_code_line"), "variety_code_line"],
          [db.Sequelize.col("seed_processing_register.variety_code"), "variety_code"],
          [sequelize.literal('SUM(seed_processing_register.total_processed_qty)'), 'total_processed_qty']
        ],
        group: [
          [db.Sequelize.col("seed_processing_register.variety_code_line"), "variety_code_line"],
          [db.Sequelize.col("seed_processing_register.variety_code"), "variety_code"],
        ],
      })
      let substarctFinalArray = [];
      if(checkStatus && checkStatus.length){
        substarctFinalArray = seedProcessBreederSeedProucedFinal.map(item1 => {
          const matchingItem = checkStatus.find(item2 =>
            item1.variety_code === item2.variety_code && 
            item1.variety_code_line === item2.variety_code_line
          );
          
          if (matchingItem) {
            return {
              ...item1,
              total_processed_qty: item1.total_processed_qty - matchingItem.total_processed_qty
            };
          }
          
          return item1; // Return original item if no match found
        });
      }else{
        substarctFinalArray = seedProcessBreederSeedProucedFinal
      }
     
      let data = {
        seedProcess: seedProcess,
        seedProcessBreederSeedProuced: substarctFinalArray,//seedProcessBreederSeedProucedFinal,
        bspOne: bspOne,
        directData: directData,
        directDatawithoutlineCode: directDatawithoutlineCode,
        availabilityOfBreederSeed: availabilityOfBreederSeed,
        seedProcessBreederSeedProucedtotal: seedProcessBreederSeedProucedtotalFinal, //seedProcessBreederSeedProucedtotalFinal, //seedProcessBreederSeedProucedtotal,
        generateSampleForwardingLetters3: generateSampleForwardingLetters3,
        generateSampleForwardingLetters4: generateSampleForwardingLetters4,
      }

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
  // get new api for bsp4
  static getDataOfBspFourNew = async (req, res) => {
    try {
      // let 
      return response(res, status.DATA_NOT_AVAILABLE, 201, [])
    } catch (error) {
      console.log(error)
      return response(res, status.UNEXPECTED_ERROR, 500, error)
    }
  }
  static saveDataofBspFour = async (req, res) => {

    try {
      let filterData2 = [];
      const {
        variety_code, variety_line_code, carry_over_qty, breeder_see_qty, total_breeder_seed_qty, target_qty_national,
        target_qty_direcy, allocate_qty, year, season, crop_code, bspc, crop, saveAsDraft, isFinalSubmit
      } = req.body;
      let data;
      if (bspc && bspc.length > 0) {
        for (let key in bspc) {
          if (bspc && bspc[key] && bspc[key].available_id && bspc[key].available_id) {
            const dataRow = {
              variety_code: bspc && bspc[key] && bspc[key].variety_code ? bspc[key].variety_code : null,
              variety_line_code: bspc && bspc[key] && bspc[key].line_variety_code ? bspc[key].line_variety_code : null,
              carry_over_qty: bspc && bspc[key] && bspc[key].total_carry_over_qty ? bspc[key].total_carry_over_qty : null,
              breeder_see_qty: bspc && bspc[key] && bspc[key].breeder_seed_produced ? bspc[key].breeder_seed_produced : null,
              total_breeder_seed_qty: bspc && bspc[key] && bspc[key].total_breeder_seed_available_over_qty ? bspc[key].total_breeder_seed_available_over_qty : null,
              target_qty_national: bspc && bspc[key] && bspc[key].total_nation_qty ? bspc[key].total_nation_qty : null,
              target_qty_direcy: bspc && bspc[key] && bspc[key].total_direct_qty ? bspc[key].total_direct_qty : null,
              allocate_qty: bspc && bspc[key] && bspc[key].allocate_qty ? bspc[key].allocate_qty : null,
              save_as_draft: saveAsDraft,
              year: year,
              season: season,
              crop_code: crop,
              is_final_submit: isFinalSubmit,
              user_id: req.body.loginedUserid && req.body.loginedUserid.id ? req.body.loginedUserid.id : ""
            }
            data = await db.availabilityOfBreederSeedModel.update(dataRow, {
              where: {
                id: bspc && bspc[key] && bspc[key].available_id && bspc[key].available_id ? bspc[key].available_id : ''
              }
            })
          }
          else {
            const dataRow = {
              variety_code: bspc && bspc[key] && bspc[key].variety_code ? bspc[key].variety_code : null,
              variety_line_code: bspc && bspc[key] && bspc[key].line_variety_code ? bspc[key].line_variety_code : null,
              carry_over_qty: bspc && bspc[key] && bspc[key].total_carry_over_qty ? bspc[key].total_carry_over_qty : null,
              breeder_see_qty: bspc && bspc[key] && bspc[key].breeder_seed_produced ? bspc[key].breeder_seed_produced : null,
              total_breeder_seed_qty: bspc && bspc[key] && bspc[key].total_breeder_seed_available_over_qty ? bspc[key].total_breeder_seed_available_over_qty : null,
              target_qty_national: bspc && bspc[key] && bspc[key].total_nation_qty ? bspc[key].total_nation_qty : null,
              target_qty_direcy: bspc && bspc[key] && bspc[key].total_direct_qty ? bspc[key].total_direct_qty : null,
              allocate_qty: bspc && bspc[key] && bspc[key].allocate_qty ? bspc[key].allocate_qty : null,
              save_as_draft: saveAsDraft,
              year: year,
              season: season,
              crop_code: crop,
              is_final_submit: isFinalSubmit,
              user_id: req.body.loginedUserid && req.body.loginedUserid.id ? req.body.loginedUserid.id : null
            }
            data = await db.availabilityOfBreederSeedModel.create(dataRow)
            if (data) {
              let updatedData = await db.seedProcessingRegister.update({
                is_bsp_4_submitted: 1
              }, {
                where: {
                  variety_code: bspc && bspc[key] && bspc[key].variety_code ? bspc[key].variety_code : null,
                  variety_code_line: bspc && bspc[key] && bspc[key].line_variety_code ? bspc[key].line_variety_code : null,
                  year: year,
                  season: season,
                  crop_code: crop,
                  bspc_id: req.body.loginedUserid && req.body.loginedUserid.id ? req.body.loginedUserid.id : null
                }
              })
            }
          }
        }
      }

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
  static getYearofTagsNumber = async (req, res) => {

    try {
      const condition = {
        attributes: [
          [db.Sequelize.fn("Distinct", db.Sequelize.col("stl_report_status.year")), "value"],
        ],
        where: {
          user_id: req.body.loginedUserid.id,
          status: 'success'
        },
        required: false,
        raw: true
      }


      //  condition.order[['year','ASC']]
      let data = await db.stlReportStatusModel.findAll(condition)
      console.log(data, 'data')

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
  static getSeasonofTagsNumber = async (req, res) => {

    try {
      let filterData2 = [];
      if (req.body.search) {
        if (req.body.search.year) {
          filterData2.push({
            year: {
              [Op.eq]: req.body.search.year
            }
          });
        }
      }
      const condition = {
        attributes: [
          [db.Sequelize.fn("Distinct", db.Sequelize.col("stl_report_status.season")), "value"],
        ],
        where: {
          [Op.and]: filterData2 ? filterData2 : [],
          user_id: req.body.loginedUserid.id,
          status: 'success'

        },
        required: false,
        raw: true
      }


      //  condition.order[['year','ASC']]
      let data = await db.stlReportStatusModel.findAll(condition)


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
  static getCropofTagsNumber = async (req, res) => {

    try {
      let filterData2 = [];
      if (req.body.search) {
        if (req.body.search.year) {
          filterData2.push({
            year: {
              [Op.eq]: req.body.search.year
            }
          });
        }
        if (req.body.search.season) {
          filterData2.push({
            season: {
              [Op.eq]: req.body.search.season
            }
          });
        }
      }
      const condition = {
        include: [
          {
            model: cropModel,
            attributes: []
          }
        ],
        attributes: [
          [db.Sequelize.fn("Distinct", db.Sequelize.col("stl_report_status.crop_code")), "crop_code"],
          [sequelize.col('m_crop.crop_name'), 'crop_name'],
        ],
        where: {
          [Op.and]: filterData2 ? filterData2 : [],
          user_id: req.body.loginedUserid.id,
          status: 'success'
        },
        required: false,
        raw: true
      }


      //  condition.order[['year','ASC']]
      let data = await db.stlReportStatusModel.findAll(condition)


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

  static getStlDataCarryOverData = async (req, res) => {
    // try {
    console.log('req',req);
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
            model: db.varietLineModel,
            attributes: []
          }
          // {
          //   model:db.seedProcessingRegister,
          //   attributes:[]
          // }
        ],
        where: {
          get_carry_over: 2,
          action: 3,
          year: req.body.search.year,
          season: req.body.search.season,
          crop_code: req.body.search.crop_code,
          variety_code:req.body.search.variety_code,
          bspc_id: 310
        },
        attributes: [
          [sequelize.col('seed_processing_register.crop_code'), 'crop_code'],
          [sequelize.col('seed_processing_register.year'), 'year'],
          [sequelize.col('seed_processing_register.season'), 'season'],
          [sequelize.col('seed_processing_register.class_of_seed'), 'class_of_seed'],
          [sequelize.col('seed_processing_register.variety_code'), 'variety_code'],
          [sequelize.col('seed_processing_register.variety_code_line'), 'variety_code_line'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [sequelize.col('m_variety_line.line_variety_name'), 'line_variety_name'],
          [sequelize.col('seed_processing_register.lot_id'), 'lot_id'],
          [sequelize.col('seed_processing_register.lot_no'), 'lot_no'],
          [sequelize.col('seed_processing_register.bspc_id'), 'bspc_id'],
          [sequelize.col('seed_processing_register.recover_qty'), 'total_recover_qty'],
          [sequelize.col('seed_processing_register.action'), 'action'],
          [sequelize.col('seed_processing_register.lot_qty'), 'lot_qty'],
          [sequelize.col('seed_processing_register.no_of_bags'), 'no_of_bags'],
          [sequelize.col('seed_processing_register.godown_no'), 'godown_no'],
          [sequelize.col('seed_processing_register.stack_no'), 'stack_no'],
          [sequelize.col('seed_processing_register.id'), 'seed_register_id'],
          [sequelize.col('seed_processing_register.get_carry_over'), 'get_carry_over'],
        ],
        nest: true,
        raw: true
      }
      let data = await db.seedProcessingRegister.findAll(condition);
      let finalArrayData = [];
      if (data && data.length) {
        for (let key of data) {
          let carryOverData;
          let carryOverDetailsData;
          let combineData = []
          carryOverData = await db.carryOverSeedModel.findAll({
            where: {
              year: key.year,
              season: key.season,
              crop_code: key.crop_code,
              variety_code: key.variety_code,
              user_id: key.bspc_id,
              variety_line_code: key && key.variety_code_line ? key.variety_code_line : ''
            },
            attributes: ['meet_target', 'total_qty', 'id']
          })
          if (carryOverData && carryOverData.length) {
            for (let key of carryOverData) {
              carryOverDetailsData = await db.carryOverSeedDetailsModel.findAll({
                where: {
                  carry_over_seed_id: key.id
                }
              })
              let carryoverAlltag;
              if (carryOverDetailsData && carryOverDetailsData.length) {
                for (let key of carryOverDetailsData)
                  carryoverAlltag = await db.carryOverSeedDetailsTagsModel.findAll({
                    where: {
                      carry_over_seed_details_id: key.id
                    }
                  })
              }
              combineData.push({
                'meet_target': key.meet_target,
                'total_qty': key.total_qty,
                'id': key.id,
                'bag_size': carryoverAlltag && carryoverAlltag[0].used_quantity,
                'no_of_bag': carryoverAlltag.length,
                "all_tag": carryoverAlltag
              })
            }
          }
          finalArrayData.push({
            'crop_code': key.crop_code,
            'year': key.year,
            'season': key.season,
            'variety_code': key.variety_code,
            'variety_code_line': key.variety_code_line,
            'class_of_seed': key.class_of_seed,
            'variety_name': key.variety_name,
            'line_variety_name': key.line_variety_name,
            'lot_id': key.lot_id,
            'lot_no': key.lot_no,
            'bspc_id': key.bspc_id,
            'total_recover_qty': key.total_recover_qty,
            'action': key.action,
            'lot_qty': key.lot_qty,
            'no_of_bags': key.no_of_bags,
            'godown_no': key.godown_no,
            'stack_no': key.stack_no,
            'seed_register_id': key.seed_register_id,
            'get_carry_over': key.get_carry_over,
            'carry_over_data': combineData
          })
        }
        return finalArrayData;
      }
    // } 
    // catch (error) {
    //   console.log(error)
    //   response(res, status.DATA_NOT_AVAILABLE, 500, error)
    // }
  }

  static getStlData = async (req, res) => {

    try {
      let filterData2 = [];
      if (req.body.search) {
        if (req.body.search.year) {
          filterData2.push({
            year: {
              [Op.eq]: req.body.search.year
            }
          });
        }
        if (req.body.search.season) {
          filterData2.push({
            season: {
              [Op.eq]: req.body.search.season
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
        if (req.body.search.variety) {
          filterData2.push({
            variety_code: {
              [Op.in]: req.body.search.variety
            }
          });
        }
        if (req.body.search.lotData) {
          filterData2.push({
            lot_id: {
              [Op.in]: req.body.search.lotData
            }
          });
        }
        if (req.body.search.user_id) {
          filterData2.push({
            user_id: {
              [Op.eq]: req.body.search.user_id
            }
          });
        }
      }

      const condition = {
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
            model: db.seedProcessingRegister,
            include: [
              {
                model: db.SeedForProcessedStack,
                attributes: []
              },
              {
                model: db.ProcessSeedDetails,
                attributes: []
              }
            ],
            required: false,
            where: {
              // action:{
              //   [Op.in]:[2,3]
              // }

              // [Op.or]: [
              //   {
              //     variety_code_line: [sequelize.col('stl_report_status.variety_code_line')]
              //   },
              // ],      
            },
            attributes: []
          },
          {
            model: db.mVarietyLinesModel,
            attributes: []
          },
          {
            model: db.carryOverSeedDetailsModel,
            attributes: []
          },
          {
            model: db.seedTagDetails,
            include: [
              {
                model: db.seedTagRange,
                attributes: []
              },

            ],
            attributes: []
          },
        ],
        attributes: [
          // [db.Sequelize.fn("Distinct", db.Sequelize.col("stl_report_status.crop_code")), "crop_code"],
          [sequelize.col('stl_report_status.crop_code'), 'crop_code'],
          [sequelize.col('stl_report_status.variety_code'), 'variety_code'],
          // [sequelize.col('stl_report_status.variety_code'),'variety_code'],e
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          // [sequelize.col('m_crop.crop_name'), 'crop_name'],
          [sequelize.col('seed_processing_register.lot_id'), 'lot_id'],
          [sequelize.col('seed_processing_register.lot_no'), 'lot_no'],
          [sequelize.col('stl_report_status.lot_no'), 'lot_no_stl'],
          [sequelize.col('stl_report_status.lot_id'), 'lot_id_stl'],
          [sequelize.col('stl_report_status.pure_seed'), 'pure_seed'],
          [sequelize.col('stl_report_status.inert_matter'), 'inert_matter'],
          [sequelize.col('stl_report_status.unique_code'), 'unique_code'],
          [sequelize.col('stl_report_status.variety_code_line'), 'variety_code_line'],
          [sequelize.col('m_variety_line.line_variety_name'), 'line_variety_name'],
          // [sequelize.col('seed_processing_register.process_loss'), 'process_loss'],
          // [sequelize.literal('SUM(seed_processing_register.recover_qty)'), 'total_recover_qty'],
          [sequelize.col('seed_processing_register.recover_qty'), 'total_recover_qty'],
          [sequelize.col('seed_processing_register.action'), 'action'],
          [sequelize.col('seed_processing_register.total_processed_qty'), 'total_processed_qty'],
          [sequelize.col('seed_processing_register->seed_for_processed_stack.no_of_bag'), 'no_of_bag_stack'],
          [sequelize.col('seed_processing_register->seed_for_processed_stack.stack_no'), 'stack_no_stack'],
          [sequelize.col('seed_processing_register->seed_for_processed_stack.godown_no'), 'godown_no_stack'],
          // [sequelize.col('seed_processing_register->processed_seed_detail.bag_size'), 'bag_size_stack'],
          [sequelize.col('seed_processing_register.lot_qty'), 'lot_qty'],
          [sequelize.col('seed_processing_register.no_of_bags'), 'no_of_bags'],
          [sequelize.col('seed_processing_register.godown_no'), 'godown_no'],
          [sequelize.col('seed_processing_register.stack_no'), 'stack_no'],
          [sequelize.col('seed_processing_register.id'), 'seed_register_id'],
          [sequelize.col('stl_report_status.stack_no'), 'stack_no_stl'],
          [sequelize.col('seed_processing_register->processed_seed_detail.bag_size'), 'bag_size_processed'],
          [sequelize.col('seed_processing_register->processed_seed_detail.no_of_bags'), 'no_of_bags_processed'],
          [sequelize.col('seed_processing_register->processed_seed_detail.qty'), 'qty_procecessed'],
          [sequelize.col('seed_processing_register->processed_seed_detail.id'), 'proceseed_id'],
          [sequelize.col('seed_processing_register->seed_for_processed_stack.id'), 'stack_id'],
          [sequelize.col('seed_processing_register.get_carry_over'), 'get_carry_over'],
          [sequelize.col('carry_over_seed_detail.year'), 'year'],
          [sequelize.col('seed_tag_detail.is_status'), 'is_status'],
          [sequelize.col('seed_tag_detail.id'), 'seed_tag_detail_id'],
          [sequelize.col('seed_tag_detail->seed_tag_range.tag_range'), 'tag_range'],
          [sequelize.col('seed_tag_detail->seed_tag_range.no_of_bags'), 'no_of_bags_tag_details'],
          [sequelize.col('seed_tag_detail->seed_tag_range.bag_weight'), 'bag_weight_tag_details'],
          [sequelize.col('seed_tag_detail->seed_tag_range.id'), 'seed_tag_range_id'],
          [sequelize.col('seed_tag_detail->seed_tag_range.start_range'), 'start_range'],
          [sequelize.col('seed_tag_detail->seed_tag_range.end_range'), 'end_range'],
          [sequelize.col('stl_report_status.class_of_seed'), 'class_of_seed'],
          [sequelize.col('stl_report_status.date_of_test'), 'date_of_test'],
          [sequelize.col('stl_report_status.normal_seeding'), 'germination'],
        ],

        where: {
          [Op.and]: filterData2 ? filterData2 : [],
          user_id: req.body.loginedUserid.id,
          status: 'success'
        },
        required: false,
        raw: true
      }
      let filterData = [];
      //  condition.order[['year','ASC']]
      let data = await db.stlReportStatusModel.findAll(condition)
      if (data && data.length > 0) {
        let caaryOverData;
        data.forEach(async(el, index) => {
          let varietyIndex;
          if (el && el.line_variety_code) {
            varietyIndex = filterData.findIndex(item => item.variety_code == el.variety_code && item.variety_code_line == el.variety_code_line);
          } else {
            varietyIndex = filterData.findIndex(item => item.variety_code == el.variety_code);
          }
          if (varietyIndex == -1) {
            filterData.push({
              variety_code: el && el.variety_code ? el.variety_code : "",
              id: el && el.id ? el.id : "",
              variety_name: el && el.variety_name ? el.variety_name : "",
              line_variety_name: el && el.line_variety_name ? el.line_variety_name : "",
              variety_code_line: el && el.variety_code_line ? el.variety_code_line : "",
              meet_target: el && el.meet_target ? el.meet_target : "",
              id: el && el.id ? el.id : "",
              total_qty: el && el.total_qty ? el.total_qty : "",
              is_freezed: el && el.is_freezed ? el.is_freezed : '',
              lot_details: [
                {
                  year_of_indent: el && el.year ? el.year : '',
                  season: el && el.seasonValue ? el.seasonValue : '',
                  lot_id_stl: el && el.lot_id_stl ? el.lot_id_stl : '',
                  stage: el && el.stage_id ? el.stage_id : '',
                  lot_id: el && el.lot_id ? el.lot_id : '',
                  lot_no: el && el.lot_no ? el.lot_no : '',
                  tag_no: el && el.tag_no ? el.tag_no : '',
                  lot_no_stl: el && el.lot_no_stl ? el.lot_no_stl : '',
                  total_recover_qty: el && el.total_recover_qty ? el.total_recover_qty : '',
                  quantity_available: el && el.quantity_available ? el.quantity_available : '',
                  total_processed_qty: el && el.total_processed_qty ? el.total_processed_qty : "",
                  seed_register_id: el && el.seed_register_id ? el.seed_register_id : '',
                  action: el && el.action ? el.action : '',
                  pure_seed: el && el.pure_seed ? el.pure_seed : '',
                  inert_matter: el && el.inert_matter ? el.inert_matter : '',
                  unique_code: el && el.unique_code ? el.unique_code : '',
                  stack_no_stl: el && el.stack_no_stl ? el.stack_no_stl : '',
                  lot_qty: el && el.lot_qty ? el.lot_qty : "",
                  no_of_bags_register: el && el.no_of_bags ? el.no_of_bags : '',
                  stack_no_register: el && el.stack_no ? el.stack_no : "",
                  godown_no_register: el && el.godown_no ? el.godown_no : '',
                  get_carry_over: el && el.get_carry_over ? el.get_carry_over : '',
                  is_status: el.is_status && el.is_status ? el.is_status : '',
                  seed_tag_detail_id: el && el.seed_tag_detail_id ? el.seed_tag_detail_id : '',
                  class_of_seed: el && el.class_of_seed ? el.class_of_seed : '',
                  germination: el && el.germination ? el.germination : '',
                  date_of_test: el && el.date_of_test ? el.date_of_test : '',
                  bag_weight: el && el.bag_weight_tag_details ? el.bag_weight_tag_details : '',
                  // total_processed_qty:el && el.total_processed_qty? el.total_processed_qty:"",
                  storage_details: [
                    {

                      no_of_bag_stack: el && el.no_of_bag_stack ? el.no_of_bag_stack : '',
                      stack_no_stack: el && el.stack_no_stack ? el.stack_no_stack : '',
                      godown_no_stack: el && el.godown_no_stack ? el.godown_no_stack : '',
                      bag_size_processed: el && el.bag_size_processed ? el.bag_size_processed : '',
                      no_of_bags_processed: el && el.no_of_bags_processed ? el.no_of_bags_processed : '',
                      qty_procecessed: el && el.qty_procecessed ? el.qty_procecessed : '',
                      proceseed_id: el && el.proceseed_id ? el.proceseed_id : '',
                      stack_id: el && el.stack_id ? el.stack_id : '',

                    }
                  ],
                  process_details: [
                    {
                      bag_size_processed: el && el.bag_size_processed ? el.bag_size_processed :(el && el.lot_qty ? el.lot_qty:'')/( el && el.no_of_bags?el.no_of_bags:'')>0?(el && el.lot_qty ? el.lot_qty:'')/( el && el.no_of_bags?el.no_of_bags:'')*100:'',
                      no_of_bags_processed: el && el.no_of_bags_processed ? el.no_of_bags_processed :( el && el.no_of_bags?el.no_of_bags:''),
                      qty_procecessed: el && el.qty_procecessed ? el.qty_procecessed :(el && el.lot_qty ? el.lot_qty:''),
                      proceseed_id: el && el.proceseed_id ? el.proceseed_id : '',
                    }
                  ],

                  seed_tag_range: [
                    {
                      tag_range: el && el.tag_range ? el.tag_range : '',
                      no_of_bags_tag_details: el && el.no_of_bags_tag_details ? el.no_of_bags_tag_details : '',
                      bag_weight_tag_details: el && el.bag_weight_tag_details ? el.bag_weight_tag_details : '',
                      seed_tag_detail_id: el && el.seed_tag_detail_id ? el.seed_tag_detail_id : '',
                      seed_tag_range_id: el && el.seed_tag_range_id ? el.seed_tag_range_id : '',
                      end_range: el && el.end_range ? el.end_range : '',
                      start_range: el && el.start_range ? el.start_range : "",
                    }
                  ]

                }
              ]
            })
          }
          else {
            let classIndex = filterData[varietyIndex].lot_details.findIndex(item => item.seed_register_id == el.seed_register_id);
            if (classIndex != -1) {
              let index = filterData[varietyIndex].lot_details[classIndex].storage_details.findIndex(item => item.stack_id == el.stack_id);

              if (index == -1) {
                filterData[varietyIndex].lot_details[classIndex].storage_details.push({
                  no_of_bag_stack: el && el.no_of_bag_stack ? el.no_of_bag_stack : '',
                  stack_no_stack: el && el.stack_no_stack ? el.stack_no_stack : '',
                  godown_no_stack: el && el.godown_no_stack ? el.godown_no_stack : '',
                  bag_size_stack: el && el.bag_size_stack ? el.bag_size_stack : '',
                  bag_size_processed: el && el.bag_size_processed ? el.bag_size_processed : '',
                  no_of_bags_processed: el && el.no_of_bags_processed ? el.no_of_bags_processed : '',
                  qty_procecessed: el && el.qty_procecessed ? el.qty_procecessed : '',
                  proceseed_id: el && el.proceseed_id ? el.proceseed_id : '',
                  stack_id: el && el.stack_id ? el.stack_id : '',

                  // seed_register_id:el && el.seed_register_id ? el.seed_register_id :'',
                })
              }
              let indexes = filterData[varietyIndex].lot_details[classIndex].process_details.findIndex(item => item.proceseed_id == el.proceseed_id);
              if (indexes == -1) {
                filterData[varietyIndex].lot_details[classIndex].process_details.push({
                  bag_size_processed: el && el.bag_size_processed ? el.bag_size_processed :(el && el.lot_qty ? el.lot_qty:'')/( el && el.no_of_bags?el.no_of_bags:'')>0?(el && el.lot_qty ? el.lot_qty:'')/( el && el.no_of_bags?el.no_of_bags:'')*100:'',
                  no_of_bags_processed: el && el.no_of_bags_processed ? el.no_of_bags_processed :( el && el.no_of_bags?el.no_of_bags:''),
                  qty_procecessed: el && el.qty_procecessed ? el.qty_procecessed :(el && el.lot_qty ? el.lot_qty:''),
                  proceseed_id: el && el.proceseed_id ? el.proceseed_id : '',
                  // seed_register_id:el && el.seed_register_id ? el.seed_register_id :'',
                })
              }
              if (el.seed_tag_detail_id) {

                let indexes2 = filterData[varietyIndex].lot_details[classIndex].seed_tag_range.findIndex(item => item.seed_tag_detail_id == el.seed_tag_detail_id);
                //  console.log(indexes2,'indexes2')
                if (indexes2 == -1) {
                  filterData[varietyIndex].lot_details[classIndex].seed_tag_range.push({
                    tag_range: el && el.tag_range ? el.tag_range : '',
                    no_of_bags_tag_details: el && el.no_of_bags_tag_details ? el.no_of_bags_tag_details : '',
                    bag_weight_tag_details: el && el.bag_weight_tag_details ? el.bag_weight_tag_details : '',
                    seed_tag_detail_id: el && el.seed_tag_detail_id ? el.seed_tag_detail_id : '',
                    seed_tag_range_id: el && el.seed_tag_range_id ? el.seed_tag_range_id : '',
                    end_range: el && el.end_range ? el.end_range : '',
                    start_range: el && el.start_range ? el.start_range : "",

                    // seed_register_id:el && el.seed_register_id ? el.seed_register_id :'',
                  })
                }
                else {
                  filterData[varietyIndex].lot_details[classIndex].seed_tag_range.push({
                    tag_range: el && el.tag_range ? el.tag_range : '',
                    no_of_bags_tag_details: el && el.no_of_bags_tag_details ? el.no_of_bags_tag_details : '',
                    bag_weight_tag_details: el && el.bag_weight_tag_details ? el.bag_weight_tag_details : '',
                    seed_tag_detail_id: el && el.seed_tag_detail_id ? el.seed_tag_detail_id : '',
                    seed_tag_range_id: el && el.seed_tag_range_id ? el.seed_tag_range_id : '',
                    end_range: el && el.end_range ? el.end_range : '',
                    start_range: el && el.start_range ? el.start_range : "",

                    // seed_register_id:el && el.seed_register_id ? el.seed_register_id :'',
                  })
                }
              }
            } else {
              filterData[varietyIndex].lot_details.push({
                year: el && el.year_of_indent ? el.year_of_indent : '',
                season: el && el.seasonValue ? el.seasonValue : '',
                lot_id_stl: el && el.lot_id_stl ? el.lot_id_stl : '',
                stage: el && el.stage_id ? el.stage_id : '',
                lot_id: el && el.lot_id ? el.lot_id : '',
                lot_no: el && el.lot_no ? el.lot_no : '',
                tag_no: el && el.tag_no ? el.tag_no : '',
                lot_no_stl: el && el.lot_no_stl ? el.lot_no_stl : '',
                total_recover_qty: el && el.total_recover_qty ? el.total_recover_qty : '',
                quantity_available: el && el.quantity_available ? el.quantity_available : '',
                total_processed_qty: el && el.total_processed_qty ? el.total_processed_qty : "",
                seed_register_id: el && el.seed_register_id ? el.seed_register_id : '',
                action: el && el.action ? el.action : '',
                pure_seed: el && el.pure_seed ? el.pure_seed : '',
                inert_matter: el && el.inert_matter ? el.inert_matter : '',
                unique_code: el && el.unique_code ? el.unique_code : '',
                stack_no_stl: el && el.stack_no_stl ? el.stack_no_stl : '',
                lot_qty: el && el.lot_qty ? el.lot_qty : "",
                no_of_bags_register: el && el.no_of_bags ? el.no_of_bags : '',
                stack_no_register: el && el.stack_no ? el.stack_no : "",
                godown_no_register: el && el.godown_no ? el.godown_no : '',
                get_carry_over: el && el.get_carry_over ? el.get_carry_over : '',
                is_status: el.is_status && el.is_status ? el.is_status : '',
                seed_tag_detail_id: el && el.seed_tag_detail_id ? el.seed_tag_detail_id : '',
                class_of_seed: el && el.class_of_seed ? el.class_of_seed : '',
                germination: el && el.germination ? el.germination : '',
                date_of_test: el && el.date_of_test ? el.date_of_test : '',
                // total_processed_qty:el && el.total_processed_qty? el.total_processed_qty:"",
                storage_details: [
                  {
                    no_of_bag_stack: el && el.no_of_bag_stack ? el.no_of_bag_stack : '',
                    stack_no_stack: el && el.stack_no_stack ? el.stack_no_stack : '',
                    godown_no_stack: el && el.godown_no_stack ? el.godown_no_stack : '',
                    bag_size_stack: el && el.bag_size_stack ? el.bag_size_stack : '',

                    bag_size_processed: el && el.bag_size_processed ? el.bag_size_processed : '',
                    no_of_bags_processed: el && el.no_of_bags_processed ? el.no_of_bags_processed : '',
                    qty_procecessed: el && el.qty_procecessed ? el.qty_procecessed : '',
                    proceseed_id: el && el.proceseed_id ? el.proceseed_id : '',
                    stack_id: el && el.stack_id ? el.stack_id : '',

                  }
                ],
                process_details: [
                  {
                    bag_size_processed: el && el.bag_size_processed ? el.bag_size_processed :(el && el.lot_qty ? el.lot_qty:'')/( el && el.no_of_bags?el.no_of_bags:'')>0?(el && el.lot_qty ? el.lot_qty:'')/( el && el.no_of_bags?el.no_of_bags:'')*100:'',
                      no_of_bags_processed: el && el.no_of_bags_processed ? el.no_of_bags_processed :( el && el.no_of_bags?el.no_of_bags:''),
                      qty_procecessed: el && el.qty_procecessed ? el.qty_procecessed :(el && el.lot_qty ? el.lot_qty:''),
                      proceseed_id: el && el.proceseed_id ? el.proceseed_id : '',
                  }
                ],
                seed_tag_range: [
                  {
                    tag_range: el && el.tag_range ? el.tag_range : '',
                    no_of_bags_tag_details: el && el.no_of_bags_tag_details ? el.no_of_bags_tag_details : '',
                    bag_weight_tag_details: el && el.bag_weight_tag_details ? el.bag_weight_tag_details : '',
                    seed_tag_detail_id: el && el.seed_tag_detail_id ? el.seed_tag_detail_id : '',
                    seed_tag_range_id: el && el.seed_tag_range_id ? el.seed_tag_range_id : '',
                    end_range: el && el.end_range ? el.end_range : '',
                    start_range: el && el.start_range ? el.start_range : "",
                  }
                ]
              })
            }
          }


        })
      }
      if (filterData && filterData.length > 0) {
        filterData.forEach((el) => {
          el.lot_details.forEach(item => {
            item.seed_tag_range = productiohelper.removeDuplicates(item.seed_tag_range, 'seed_tag_range_id')
          })
        })
      }
      let datas2
      let combinedData2 = await Promise.all(filterData.map(async el => {
        let val = await Promise.all(el.lot_details.map(async item => {
          let vals = await Promise.all(item.seed_tag_range.map(async items => {
            if (items.seed_tag_range_id) {

              datas2 = await db.seedTagsModel.findAll({
                where: {
                  is_active: 1,
                  seed_tag_range_id: items.seed_tag_range_id
                },
                raw: true,
                nest: true
              })
              item.rangeData = datas2
              // val.rangeData = datas2
              //  return datas2
              // console.log(datas2,'data')
              // return val
            }
            //  return datas2
          }))
        }))
        // el.lot_details.forEach((val=>{
        //   // console.log(val, 'filterData')
        //   val.seed_tag_range.forEach(async (items)=>{
        //     if(items.seed_tag_range_id){

        //        datas2= await db.seedTagsModel.findAll({
        //         where:{
        //           is_active:1,
        //           seed_tag_range_id:items.seed_tag_range_id
        //         },
        //         raw:true,
        //         nest:true
        //       })
        //       // val.rangeData = datas2
        //       return datas2
        //       // console.log(datas2,'data')
        //       // return val
        //     }
        //   })
        //   // return val
        // }))
        return el

      }))
      console.log(datas2, 'combinedData2')
      let datas = {
        filterData: combinedData2,

      }
      if (datas) {
        return response(res, status.DATA_AVAILABLE, 200, datas)
      } else {
        return response(res, "Data Not Found", 200, {})
      }

    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500, error)
    }
  }
  static getDataofSeedTags = async (req, res) => {
    try {
      let filterData2 = [];
      if (req.body.search) {
        if (req.body.search.year) {
          filterData2.push({
            year: {
              [Op.eq]: req.body.search.year
            }
          });
        }
        if (req.body.search.season) {
          filterData2.push({
            season: {
              [Op.eq]: req.body.search.season
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
        if (req.body.search.user_id) {
          filterData2.push({
            user_id: {
              [Op.eq]: req.body.search.user_id
            }
          });
        }
      }
      let condition = {
        where: {
          [Op.and]: filterData2 ? filterData2 : []

        },
        include: [
          {
            model: db.seedTagsModel,
            attributes: []
          }
        ],

      }
      let data = await db.seedTagDetails.count(condition)
      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        return response(res, "Data Not Found", 200, 0)
      }
    }
    catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500, error)
    }

  }






  static savegeneratingLotTags = async (req, res) => {
    try {
      const {
        variety_code, variety_code_line, lot_no, crop, date_of_test, germination,
        godown_no, inert_matter, lot_id, lot_qty, no_of_bags, processedData, pure_seed, stack_no, year, season,
        code, class_of_seed,
        valid_upto, user_id, bagsData
      } = req.body;
      const [day, month, years] = date_of_test.split("/").map(Number);
      const localDate = new Date(years, month - 1, day, 0, 0, 0);
      const timestamp = localDate.toISOString().slice(0, 10)
      let seedTag;
      const date = moment().subtract(0, 'days');
      date.format('YYYY-MM-DD H:mm:ss');
      const dataRow = {
        variety_code: variety_code ? variety_code : null,
        variety_line_code: variety_code_line ? variety_code_line : null,
        year: year ? year : null,
        season: season ? season : null,
        lot_id: lot_id ? lot_id : null,
        lot_no: lot_no ? lot_no : null,
        no_of_bags: no_of_bags ? no_of_bags : null,
        godown_no: godown_no ? godown_no : null,
        stack_no: stack_no ? stack_no : null,
        pure_seed: pure_seed ? pure_seed : null,
        inert_matter: inert_matter ? inert_matter : null,
        germination: germination ? germination : null,
        date_of_test: timestamp ? timestamp : null,
        valid_upto: valid_upto ? valid_upto : null,
        is_active: 1,
        lot_qty: lot_qty ? lot_qty : null,
        crop_code: crop ? crop : null,
        class_of_seed: class_of_seed ? class_of_seed : null,
        created_at: Date.now(),
        updated_at: Date.now(),
        is_status: 1,
        user_id: user_id ? user_id : req.body && req.body.loginedUserid && req.body.loginedUserid.id ? req.body.loginedUserid.id : null,
        // germination:germination ? germination:null,
      }

      let data = await db.seedTagDetails.create(dataRow).then(function (item) {
        seedTag = item['_previousDataValues'];
      });
      if (processedData && processedData.length > 0) {
        for (let key in processedData) {

          const dataRow = {
            tag_range: processedData && processedData[key] && processedData[key].bagrange ? processedData[key].bagrange : null,
            no_of_bags: processedData && processedData[key] && processedData[key].no_of_bags_processed ? processedData[key].no_of_bags_processed : null,
            bag_weight: processedData && processedData[key] && processedData[key].bag_size_processed ? processedData[key].bag_size_processed : null,
            start_range: processedData && processedData[key] && processedData[key].startRange ? processedData[key].startRange : null,
            end_range: processedData && processedData[key] && processedData[key].endRange ? processedData[key].endRange : null,
            qty: processedData && processedData[key] && processedData[key].qty_procecessed ? processedData[key].qty_procecessed : null,
            year: processedData && processedData[key] && processedData[key].year ? processedData[key].year : null,
            seed_tag_details_id: seedTag && seedTag.id ? seedTag.id : null
          }
          let datas = await db.seedTagRange.create(dataRow)
        }
      }
      let seedRangeData = await db.seedTagRange.findAll({
        where: {
          seed_tag_details_id: seedTag.id
        },
        raw: true,
      })
      if (seedRangeData && seedRangeData.length > 0) {
        seedRangeData = seedRangeData.map(item => {
          item.bags = Array.from(
            { length: item.end_range - item.start_range + 1 },
            (_, i) => ({
              bag: `B/${item && item.year ? item.year : 'NA'}/${code ? code : 'NA'}/${String(item.start_range + i).padStart(6, '0')}`,
              bag_size: item.bag_weight,
              no_of_bags: item.no_of_bags,
              qty: item.qty,
              id: item.id,

            })
          );
          return item;
        });
      }
      let bagData = [];

      //  console.log(bagData,'seedRangeData')
      if (seedRangeData && seedRangeData.length > 0) {
        for (let key in seedRangeData) {
          for (let keys in seedRangeData[key].bags) {
            const dataRow = {
              tag_no: seedRangeData && seedRangeData[key] && seedRangeData[key].bags[keys] && seedRangeData[key].bags[keys] && seedRangeData[key].bags[keys].bag ? seedRangeData[key].bags[keys].bag : null,
              bag_size: seedRangeData && seedRangeData[key] && seedRangeData[key].bags[keys] && seedRangeData[key].bags[keys] && seedRangeData[key].bags[keys].bag_size ? seedRangeData[key].bags[keys].bag_size : null,
              no_of_bags: seedRangeData && seedRangeData[key] && seedRangeData[key].bags[keys] && seedRangeData[key].bags[keys] && seedRangeData[key].bags[keys].no_of_bags ? seedRangeData[key].bags[keys].no_of_bags : null,
              seed_tag_range_id: seedRangeData && seedRangeData[key] && seedRangeData[key].id ? seedRangeData[key].id : null,
              seed_tag_details_id: seedTag && seedTag.id ? seedTag.id : null,
              is_active: 1
            }
            let datas = await db.seedTagsModel.create(dataRow)
          }
          //       console.log(bagData && bagData[key] && bagData[key].bag ? bagData[key].bag:null,'bagData')
          //       
        }
      }


      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        return response(res, "Data Not Found", 200, 0)
      }
    }
    catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500, error)
    }

  }
  static getTagData = async (req, res) => {
    try {
      let filterData2 = [];
      if (req.body.search) {
        if (req.body.search.seed_tag_range_id) {
          filterData2.push({
            seed_tag_range_id: {
              [Op.eq]: req.body.search.seed_tag_range_id
            }
          });
        }

      }
      let condition = {
        where: {
          [Op.and]: filterData2 ? filterData2 : [],
          is_active: 1

        },


      }
      let data = await db.seedTagsModel.findAll(condition)
      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        return response(res, "Data Not Found", 200, 0)
      }
    }
    catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500, error)
    }

  }
  static getAgencyData = async (req, res) => {
    try {
      let filterData2 = [];
      let { id } = req.body.search;
      let datas;
      if (id) {
        datas = await db.liftingSeedDetailsModel.findAll({
          where: {
            id: id
          },
          attributes: [
            'user_id'
          ],
          raw: true
        })
      }
      if (req.body.search) {
        if (req.body.search.user_id) {
          filterData2.push({
            user_id: {
              [Op.eq]: req.body.search.user_id
            }
          });
        }
      }
      if (datas && datas[0] && datas[0].user_id) {
        filterData2.push({
          user_id: {
            [Op.eq]: datas[0].user_id
          }
        });
      }
      let condition = {
        include: [
          {
            model: db.stateModel,
            attributes: []
          },
          {
            model: db.districtModel,
            attributes: []
          },
          {
            model: db.designationModel,
            attributes: []
          },

        ],
        where: {
          [Op.and]: filterData2 ? filterData2 : []

        },
        attributes: [
          'agency_name',
          [sequelize.col('m_state.state_name'), 'state_name'],
          [sequelize.col('m_district.district_name'), 'district_name'],

          [sequelize.col('m_designation.name'), 'designation_name'],
          'contact_person_name'
        ]

      }
      let data = await db.agencyDetailModel.findAll(condition)
      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        return response(res, "Data Not Found", 200, 0)
      }
    }
    catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500, error)
    }

  }
  static getVarietyDataofStl = async (req, res) => {
    try {
      let filterData2 = [];
      if (req.body.search) {
        if (req.body.search.variety_code) {
          filterData2.push({
            variety_code: {
              [Op.eq]: req.body.search.variety_code
            }
          });
        }
        if (req.body.search.user_id) {
          filterData2.push({
            user_id: {
              [Op.eq]: req.body.search.user_id
            }
          });
        }
        if (req.body.search.year) {
          filterData2.push({
            year: {
              [Op.eq]: req.body.search.year
            }
          });
        }
        if (req.body.search.season) {
          filterData2.push({
            season: {
              [Op.eq]: req.body.search.season
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
      let condition = {
        include: [
          {
            model: db.varietyModel,
            attributes: []
          },

        ],
        where: {
          [Op.and]: filterData2 ? filterData2 : [],
          user_id: req.body.loginedUserid.id,
          status: 'success'

        },
        attributes: [
          // [sequelize.fn('DISTINCT', sequelize.col('stl_report_status.variety_code')), 'value'],
          [sequelize.col('stl_report_status.variety_code'), 'value'],
          [sequelize.col('m_crop_variety.variety_name'), 'display_text'],
        ],
        group: [
          [sequelize.col('stl_report_status.variety_code'), 'value'],
          [sequelize.col('m_crop_variety.variety_name'), 'display_text'],
        ]

      }
      let data = await db.stlReportStatusModel.findAll(condition)
      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        return response(res, "Data Not Found", 200, 0)
      }
    }
    catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500, error)
    }

  }
  static getLotDataofStl = async (req, res) => {
    try {
      let filterData2 = [];
      if (req.body.search) {
        if (req.body.search.variety_code) {
          filterData2.push({
            variety_code: {
              [Op.eq]: req.body.search.variety_code
            }
          });
        }
        if (req.body.search.user_id) {
          filterData2.push({
            user_id: {
              [Op.eq]: req.body.search.user_id
            }
          });
        }
        if (req.body.search.year) {
          filterData2.push({
            year: {
              [Op.eq]: req.body.search.year
            }
          });
        }
        if (req.body.search.season) {
          filterData2.push({
            season: {
              [Op.eq]: req.body.search.season
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
      let condition = {
        include: [
          {
            model: db.seedProcessingRegister,
            attributes: []
          },

        ],
        where: {
          [Op.and]: filterData2 ? filterData2 : [],
          user_id: req.body.loginedUserid.id,
          status: 'success'

        },
        attributes: [

          [sequelize.col('stl_report_status.lot_id'), 'value'],
          [sequelize.col('stl_report_status.lot_no'), 'display_text'],

        ]

      }
      let data = await db.stlReportStatusModel.findAll(condition)
      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        return response(res, "Data Not Found", 200, 0)
      }
    }
    catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500, error)
    }

  }
  static updateLotStatus = async (req, res) => {
    try {
      let filterData2 = [];
      if (req.body.search) {
        if (req.body.search.seed_tag_range_id) {
          filterData2.push({
            seed_tag_range_id: {
              [Op.eq]: req.body.search.seed_tag_range_id
            }
          });
        }


      }
      const { seedTagsData } = req.body.search
      let data = await db.seedTagsModel.update({
        is_active: 0,

      }, {
        where: {
          id: {
            [Op.in]: seedTagsData
          }
        }
      }
      )
      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        return response(res, "Data Not Found", 200, 0)
      }
    }
    catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500, error)
    }

  }
  static getSeedtagsData = async (req, res) => {
    try {
      let filterData2 = [];
      if (req.body.search) {
        if (req.body.search.id) {
          filterData2.push({
            seed_tag_range_id: {
              [Op.eq]: req.body.search.id
            }
          });
        }


      }
      let data = await db.seedTagsModel.findAll(
        {
          where: {
            [Op.and]: filterData2 ? filterData2 : [],
            is_active: 0

          },

        }
      )
      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        return response(res, "Data Not Found", 200, 0)
      }
    }
    catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500, error)
    }

  }
  static getlotfromrange = async (req, res) => {
    try {
      let filterData2 = [];
      // let data;
      const { range, id } = req.body.search
      let data = await db.seedTagsModel.findAll({
        where: {
          tag_no: range,
          seed_tag_range_id: id
        },
        raw: true,
        attributes: [
          'tag_no', 'is_active'
        ]
      })

      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        return response(res, "Data Not Found", 200, 0)
      }
    }
    catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500, error)
    }

  }

  static updateLotStatusRange = async (req, res) => {
    try {
      let filterData2 = [];

      const { seedTagsData } = req.body.search

      let datas = await db.seedTagsModel.findAll({

        where: {
          tag_no: {
            [Op.in]: seedTagsData
          },
          // is_active:1
        },
        raw: true,
        attributes: ['tag_no', 'is_active']
      },

      );
      let checkStatus = true;
      for (const item of datas) {
        if (item.is_active === 0) {
          checkStatus = false;
          break; // Exit the loop early since we found a 0
        }
      }
      console.log(checkStatus, 'checkStatus')
      // datas.forEach()
      let data
      if (checkStatus) {

        data = await db.seedTagsModel.update({
          is_active: 0,

        }, {
          where: {
            tag_no: {
              [Op.in]: seedTagsData
            },
          }
        }
        )
      }
      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        return response(res, "Data Not Found", 201, 0)
      }
    }
    catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500, error)
    }

  }
  static getYearofbspfourReport = async (req, res) => {

    try {
      const { user_type } = req.body.search;
      let whereClause = {}
      if (user_type) {
        if (user_type == "HICAR") {
          whereClause.crop_code = {
            [Op.like]: 'H' + '%'
          }
        }
        if (user_type == "AICAR") {
          whereClause.crop_code = {
            [Op.like]: 'A' + '%'
          }
        }
      }
      let condition;
      if (user_type == 'BR') {
        condition = {
          include: [
            {
              model: cropModel,
              where: {
                breeder_id: req.body.loginedUserid.id,

              },
              attributes: []
            }
          ],
          attributes: [
            [db.Sequelize.fn("Distinct", db.Sequelize.col("availability_of_breeder_seed.year")), "value"],
          ],
          // where: {
          //   user_id: req.body.loginedUserid.id,
          //   status:'success' 
          // },
          required: false,
          raw: true,
          order: [[db.Sequelize.col("availability_of_breeder_seed.year"), 'DESC']]
        }
      } else {
        condition = {
          include: [
            {
              model: cropModel,
              attributes: []
            }
          ],
          attributes: [
            [db.Sequelize.fn("Distinct", db.Sequelize.col("availability_of_breeder_seed.year")), "value"],
          ],
          where: {
            ...whereClause
            //   user_id: req.body.loginedUserid.id,
            //   status:'success' 
          },
          required: false,
          raw: true,
          order: [[db.Sequelize.col("availability_of_breeder_seed.year"), 'DESC']]
        }

      }


      //  condition.order[['year','ASC']]
      let data = await db.availabilityOfBreederSeedModel.findAll(condition)


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
  static getSeasonofbspfourReport = async (req, res) => {

    try {
      const { year, season, user_type } = req.body.search;
      let whereClause = {}
      if (user_type) {
        if (user_type == "HICAR") {
          whereClause.crop_code = {
            [Op.like]: 'H' + '%'
          }
        }
        if (user_type == "AICAR") {
          whereClause.crop_code = {
            [Op.like]: 'A' + '%'
          }
        }
        if (user_type == "ICAR") {
          whereClause.crop_code = {
            [Op.like]: 'A' + '%'
          }
        }
      }
      let condition;
      if (user_type == 'BR') {

        condition = {
          attributes: [
            [db.Sequelize.fn("Distinct", db.Sequelize.col("availability_of_breeder_seed.season")), "value"],
          ],
          include: [
            {
              model: cropModel,
              where: {
                breeder_id: req.body.loginedUserid.id,

              },
              attributes: []
            }
          ],


          required: false,
          raw: true,
          where: {
            year: year,
          }
        }
      } else {
        condition = {
          attributes: [
            [db.Sequelize.fn("Distinct", db.Sequelize.col("availability_of_breeder_seed.season")), "value"],
          ],
          include: [
            {
              model: cropModel,
              //  where: {
              //   breeder_id: req.body.loginedUserid.id,

              //   },
              attributes: []
            }
          ],


          required: false,
          raw: true,
          where: {
            year: year,
            ...whereClause
          }
        }
      }



      //  condition.order[['year','ASC']]
      let data = await db.availabilityOfBreederSeedModel.findAll(condition)


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
  static getCropTypefbspfourReport = async (req, res) => {

    try {
      const { year, season, user_type } = req.body.search;
      let condition;
      let whereClause = {}
      if (user_type) {
        if (user_type == "HICAR") {
          whereClause.crop_code = {
            [Op.like]: 'H' + '%'
          }
        }
        if (user_type == "AICAR") {
          whereClause.crop_code = {
            [Op.like]: 'A' + '%'
          }
        }
        if (user_type == "ICAR") {
          whereClause.crop_code = {
            [Op.like]: 'A' + '%'
          }
        }
      }
      if (user_type == 'BR') {
        condition = {

          include: [
            {
              model: cropModel,
              where: {
                breeder_id: req.body.loginedUserid.id,

              },
              attributes: []
            }
          ],
          attributes: [
            [db.Sequelize.fn("Distinct", db.Sequelize.col("availability_of_breeder_seed.crop_code")), "value"],
            // [db.Sequelize.col("m_crop.crop_name"),'display_text']
          ],
          where: {
            year: year,
            season: season

          },

          required: false,
          raw: true
        }
      } else {
        condition = {

          include: [
            {
              model: cropModel,
              attributes: []
            }
          ],
          attributes: [
            [db.Sequelize.fn("Distinct", db.Sequelize.col("availability_of_breeder_seed.crop_code")), "value"],
            // [db.Sequelize.col("m_crop.crop_name"),'display_text']
          ],
          where: {
            year: year,
            season: season,
            ...whereClause

          },

          required: false,
          raw: true
        }
      }


      //  condition.order[['year','ASC']]
      let data = await db.availabilityOfBreederSeedModel.findAll(condition)


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
  static getCropfbspfourReport = async (req, res) => {

    try {
      const { year, season, crop_type, user_type } = req.body.search;
      let condition;

      if (user_type == 'BR') {
        condition = {

          include: [
            {
              model: cropModel,
              where: {
                breeder_id: req.body.loginedUserid.id,
              },
              attributes: []
            }
          ],
          attributes: [
            [db.Sequelize.fn("Distinct", db.Sequelize.col("availability_of_breeder_seed.crop_code")), "value"],
            [db.Sequelize.col("m_crop.crop_name"), 'display_text']
          ],
          where: {
            year: year,
            season: season,
            crop_code: {
              [Op.like]: crop_type + "%",
            }

          },

          required: false,
          raw: true
        }
      } else {
        condition = {

          include: [
            {
              model: cropModel,
              attributes: []
            }
          ],
          attributes: [
            [db.Sequelize.fn("Distinct", db.Sequelize.col("availability_of_breeder_seed.crop_code")), "value"],
            [db.Sequelize.col("m_crop.crop_name"), 'display_text']
          ],
          where: {
            year: year,
            season: season,
            crop_code: {
              [Op.like]: crop_type + "%",
            }

          },

          required: false,
          raw: true
        }
      }


      //  condition.order[['year','ASC']]
      let data = await db.availabilityOfBreederSeedModel.findAll(condition)


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
  static getbspfourData = async (req, res) => {

    try {
      const { year, season, crop_type, crop_code, user_type } = req.body.search;
      let whereClause = {}
      if (user_type) {
        if (user_type == "HICAR") {
          whereClause.crop_code = {
            [Op.like]: 'H' + '%'
          }
        }
        if (user_type == "AICAR") {
          whereClause.crop_code = {
            [Op.like]: 'A' + '%'
          }
        }
      }
      const condition = {

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
            model: db.userModel,
            attributes: []
          },
          {
            model: db.agencyDetailModel,
            attributes: []
          },
          {
            model: db.mVarietyLinesModel,
            attributes: []
          }
        ],
        attributes: [
          // [db.Sequelize.fn("Distinct", db.Sequelize.col("availability_of_breeder_seed.crop_code")), "value"],
          [db.Sequelize.col("m_crop.crop_name"), 'crop_name'],
          [db.Sequelize.col("availability_of_breeder_seed.crop_code"), 'crop_code'],
          [db.Sequelize.col("availability_of_breeder_seed.variety_line_code"), 'variety_code_line'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [sequelize.literal('SUM(availability_of_breeder_seed.breeder_see_qty)'), 'breeder_see_qty'],
          [sequelize.literal('SUM(availability_of_breeder_seed.total_breeder_seed_qty)'), 'total_breeder_seed_qty'],
          [sequelize.literal('SUM(availability_of_breeder_seed.target_qty_national)'), 'target_qty_national'],
          [sequelize.literal('SUM(availability_of_breeder_seed.allocate_qty)'), 'allocate_qty'],
          [db.Sequelize.col("availability_of_breeder_seed.user_id"), 'user_id'],
          [db.Sequelize.col("user.name"), 'user_names'],
          [db.Sequelize.col("agency_detail.agency_name"), 'user_name'],
          [db.Sequelize.col("availability_of_breeder_seed.variety_code"), 'variety_code'],
          [sequelize.col('m_crop_variety.id'), 'variety_id'],
          [db.Sequelize.col('m_variety_line.line_variety_name'), 'line_variety_name'],
        ],
        group: [
          [db.Sequelize.col("m_crop.crop_name"), 'crop_name'],
          [db.Sequelize.col("availability_of_breeder_seed.crop_code"), 'crop_code'],
          [db.Sequelize.col("availability_of_breeder_seed.variety_line_code"), 'variety_code_line'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [db.Sequelize.col("availability_of_breeder_seed.user_id"), 'user_id'],
          [db.Sequelize.col("user.name"), 'user_names'],
          [db.Sequelize.col("availability_of_breeder_seed.variety_code"), 'variety_code'],
          [sequelize.col('m_crop_variety.id'), 'variety_id'],
          [db.Sequelize.col('m_variety_line.line_variety_name'), 'line_variety_name'],
          [db.Sequelize.col("agency_detail.agency_name"), 'user_name'],
        ],
        where: {
          year: year,
          season: season,
          crop_code: crop_code,
          ...whereClause

        },

        required: false,
        raw: true
      }

      //  condition.order[['year','ASC']]
      let data = await db.availabilityOfBreederSeedModel.findAll(condition)
      let filterData = [];
      let varietyData = []
      data.forEach((el, index) => {
        let varietyIndex;
        varietyData.push(el && el.variety_id ? el.variety_id : '')
        if (el && el.line_variety_code) {
          varietyIndex = filterData.findIndex(item => item.variety_code == el.variety_code && item.variety_code_line == el.variety_code_line);
        } else {
          varietyIndex = filterData.findIndex(item => item.variety_code == el.variety_code);
        }
        if (varietyIndex == -1) {
          filterData.push({
            variety_code: el && el.variety_code ? el.variety_code : "",
            variety_name: el && el.variety_name ? el.variety_name : "",
            line_variety_name: el && el.line_variety_name ? el.line_variety_name : "",
            variety_code_line: el && el.variety_code_line ? el.variety_code_line : "",
            user_data: [
              {
                user_name: el && el.user_name ? el.user_name : "",
                user_id: el && el.user_id ? el.user_id : "",
                breeder_see_qty: el && el.breeder_see_qty ? el.breeder_see_qty : "",
                total_breeder_seed_qty: el && el.total_breeder_seed_qty ? el.total_breeder_seed_qty : "",
                target_qty_national: el && el.target_qty_national ? el.target_qty_national : "",
                allocate_qty: el && el.allocate_qty ? el.allocate_qty : "",
              }
            ]
          })
        }
        else {
          filterData[varietyIndex].user_data.push(
            {
              user_name: el && el.user_name ? el.user_name : "",
              user_id: el && el.user_id ? el.user_id : "",
              breeder_see_qty: el && el.breeder_see_qty ? el.breeder_see_qty : "",
              total_breeder_seed_qty: el && el.total_breeder_seed_qty ? el.total_breeder_seed_qty : "",
              target_qty_national: el && el.target_qty_national ? el.target_qty_national : "",
              allocate_qty: el && el.allocate_qty ? el.allocate_qty : "",
            }
          )
          let classIndex = filterData[varietyIndex].user_data.findIndex(item => item.user_id == el.user_id);
          if (classIndex != -1) {
          }
        }
      })
      const condition1 = {

        include: [
          {
            model: db.indentOfBrseedLines,
            attributes: []
          },
          {
            model: varietyModel,
            attributes: []
          },

        ],

        where: {
          variety_id: {
            [Op.in]: varietyData
          },
          // user_id:req.body.loginedUserid.id
          year: year,
          season: season,
          crop_code: crop_code

        },
        attributes: [
          // [sequelize.col('indent_of_brseed_direct_line.quantity'),'quantity'],
          [sequelize.literal('SUM(indent_of_brseed_line.quantity)'), 'quantity'],
          [sequelize.col('indent_of_breederseeds.variety_id'), 'variety_id'],
          [sequelize.literal('SUM(indent_of_breederseeds.indent_quantity)'), 'indent_quantity'],
          [sequelize.col('indent_of_brseed_line.variety_code_line'), 'variety_code_line'],
          // [sequelize.col('indent_of_breederseeds.indent_quantity'),'indent_quantity'],
          [sequelize.col('m_crop_variety.variety_code'), 'variety_code'],
        ],
        group: [
          [sequelize.col('indent_of_brseed_line.variety_code_line'), 'variety_code_line'],
          [sequelize.col('indent_of_breederseeds.variety_id'), 'variety_id'],
          [sequelize.col('indent_of_breederseeds.indent_quantity'), 'indent_quantity'],
          // [sequelize.col('indent_of_breederseeds.variety_code_line'),'variety_code_line'],
          [sequelize.col('m_crop_variety.variety_code'), 'variety_code'],
        ],
        required: false,
        raw: true
      }
      let indentofBreder = await db.indentOfBreederseedModel.findAll(condition1)
      let returResponse = {
        filterData: filterData,
        indentofBreder: indentofBreder
      }

      if (returResponse) {
        return response(res, status.DATA_AVAILABLE, 200, returResponse)
      } else {
        return response(res, "Data Not Found", 200, {})
      }

    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500, error)
    }
  }
  static getLiftingDataYear = async (req, res) => {

    try {
      // const { year, season, crop_type, crop_code } = req.body.search
      const condition = {
        where: {
          user_id: req.body.loginedUserid.id
        },
        attributes: [
          // [
          [db.Sequelize.fn("Distinct", db.Sequelize.col("lifting_seed_details.year")), "year"],
          // [sequelize.col('lifting_seed_details'),'']
          // ]
        ],
        order: [
          [db.Sequelize.col("lifting_seed_details.year"), 'DESC']
        ]
      }
      //  condition.order[['year','ASC']]
      let data = await db.liftingSeedDetailsModel.findAll(condition)
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
  static getLiftingDataSeason = async (req, res) => {

    try {
      const { year, } = req.body.search
      const condition = {
        where: {
          user_id: req.body.loginedUserid.id,
          year: year
        },
        attributes: [
          // [
          [db.Sequelize.fn("Distinct", db.Sequelize.col("lifting_seed_details.season")), "season"],
          // [sequelize.col('lifting_seed_details'),'']
          // ]
        ]
      }
      //  condition.order[['year','ASC']]
      let data = await db.liftingSeedDetailsModel.findAll(condition)
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
  static getLiftingDataCrop = async (req, res) => {

    try {
      const { year, season } = req.body.search
      const condition = {
        include: [
          {
            model: cropModel,
            attributes: []
          }
        ],
        where: {
          user_id: req.body.loginedUserid.id,
          year: year,
          season
        },

        attributes: [
          // [sequelize.col('lifting_seed_details.crop'),'crop'],
          // [db.Sequelize.fn("Distinct", db.Sequelize.col("lifting_seed_details.crop_code")), "crop_code"],
          [sequelize.col('m_crop.crop_name'), 'crop_name'],
          [sequelize.col('lifting_seed_details.crop_code'), 'crop_code']
        ],
        group: [
          [sequelize.col('m_crop.crop_name'), 'crop_name'],
          [sequelize.col('lifting_seed_details.crop_code'), 'crop_code']
        ]
      }
      //  condition.order[['year','ASC']]
      let data = await db.liftingSeedDetailsModel.findAll(condition)
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
  // static getLiftingDataVariety = async (req, res) => {

  //   try {
  //     const { year, season,crop_code} = req.body.search
  //      const condition={
  //       include:[
  //         {
  //           model:varietyModel,
  //           attributes:[]
  //         }
  //       ],
  //       where:{
  //         user_id:req.body.loginedUserid.id,
  //         year:year,
  //         season,
  //         crop_code
  //       },
  //       attributes:[
  //         [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
  //         [sequelize.col('lifting_seed_details.variety'),'variety']
  //         ,
  //         // [sequelize.col('m_crop.crop_name'),'crop_name'],
  //       ]
  //      }
  //     //  condition.order[['year','ASC']]
  //     let data = await db.liftingSeedDetailsModel.findAll(condition)
  //     if (data) {
  //       return response(res, status.DATA_AVAILABLE, 200, data)
  //     } else {
  //       return response(res, "Data Not Found", 200, {})
  //     }

  //   } catch (error) {
  //     console.log(error)
  //     response(res, status.DATA_NOT_AVAILABLE, 500, error)
  //   }
  // }
  static getLiftingDataViewPrint = async (req, res) => {

    try {
      const { year, season, crop_code, variety_code, indentor, spa, bill } = req.body.search;

      let filterData2 = [];


      let whereClause = {}
      let whereClause1 = {}
      let whereClause2 = {}
      let whereClause4 = {}
      if (variety_code) {
        whereClause.variety_code = {
          [Op.in]: variety_code
        };

      }

      if (indentor) {
        whereClause1.id = {
          [Op.in]: indentor
        };
      }
      if (spa) {
        whereClause2.id = {
          [Op.in]: spa
        };

      }
      if (bill) {
        whereClause4.id = bill

      }

      const condition = {
        include: [
          {
            model: varietyModel,
            attributes: []
          },
          {
            model: cropModel,
            attributes: []
          },
          {
            model: db.generateBreederSeedCertificate,
            attributes: []
          },
          {
            model: db.agencyDetailModel3,
            // as:'agenctData',
            on: {
              col1: sequelize.where(sequelize.col("agency_detail.user_id"), "=", sequelize.col("lifting_seed_details.indentor_id")),
            },
            include: [
              {
                model: db.userModel,
                where: {
                  user_type: 'IN',
                  ...whereClause1,

                },
                attributes: []
              }
            ],
            attributes: []
          },
        ],
        where: {
          user_id: req.body.loginedUserid.id,
          year: year,
          season,
          // ['$agencyDetails2.id$']: null,
          crop_code,
          ...whereClause4
          // id:bill,
        },
        attributes: [
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [sequelize.col('lifting_seed_details.variety_code'), 'variety_code'],
          [sequelize.col('lifting_seed_details.crop_code'), 'crop_code'],
          [sequelize.col('m_crop.crop_name'), 'crop_name'],
          [sequelize.col('lifting_seed_details.season'), 'season'],
          [sequelize.col('lifting_seed_details.bag_weight'), 'bag_weight'],
          [sequelize.col('lifting_seed_details.no_of_bag'), 'no_of_bag'],
          [sequelize.col('lifting_seed_details.total_price'), 'total_price'],
          // [sequelize.col('agency_detail.agency_name'), 'agency_name'],
          // [sequelize.col('agency_detail.user_id'), 'user_id'],
          [sequelize.col('lifting_seed_details.spa_state_code'), 'spa_state_code'],
          [sequelize.col('lifting_seed_details.spa_code'), 'spa_code'],
          [sequelize.col('generate_breeder_seed_certificate.lifting_id'), 'lifting_id']
          // [sequelize.col('agencyDetails2.agency_name'),'spa_agency_name'],
          // [sequelize.col('agencyDetails2.user_id'),'spa_user_id'],
        ],
        raw: true,
        nest: true
      }
      //  condition.order[['year','ASC']]
      let data = await db.liftingSeedDetailsModel.findAll(condition);
      console.log(data, 'data')
      let spas = []
      if (data && data.length > 0) {

        for (let key in data) {

          let spaDatas = await db.liftingSeedDetailsModel.findAll(
            {
              include: [
                {
                  model: db.agencyDetailModel3,
                  attributes: [],
                  as: 'agencyDetails2',
                  include: [
                    {
                      model: db.userModel,
                      attributes: [],
                    },
                  ]
                },

              ],
              where: {
                user_id: req.body.loginedUserid.id,
                year: year,
                season,
                ['$agencyDetails2->user.spa_code$']: data[key].spa_code,
                ['$agencyDetails2.state_id$']: data[key].spa_state_code,
                crop_code,
                ...whereClause4
                // id:bill,
              },
              attributes: [
                [sequelize.col('agencyDetails2.agency_name'), 'spa_agency_name'],
                [sequelize.col('agencyDetails2.user_id'), 'spa_user_id'],
                // [sequelize.col('lifting_seed_details.spa_state_code'), 'spa_state_code'],
                [sequelize.col('lifting_seed_details.spa_code'), 'spa_code'],
                [sequelize.col('agencyDetails2.state_id'), 'state_code'],
              ],
              raw: true,
            },
          );
          spas.push(spaDatas)
        }
      }
      if (spas && spas.length > 0) {
        spas = spas ? spas.flat() : ''
      }
      spas = productiohelper.removeDuplicates(spas, 'spa_user_id')
      console.log(spas, 'spaDatas')

      let datas;
      let prindata = []
      let allocationToSPAProd;
      let datas2;
      if (data && data.length > 0) {

        for (let key in data) {
          datas2 = await db.liftingSeedDetailsModel.findAll({
            include: [
              {
                model: varietyModel,
                attributes: []
              },
              {
                model: cropModel,
                attributes: []
              },
              {
                model: db.generateBreederSeedCertificate,
                attributes: []
              },
              {
                model: db.liftingTagNumberModel,
                attributes: []
              },
              {
                model: db.liftingLotNumberModel,
                include: [
                  {
                    model: db.liftingTagNumberModel,
                    attributes: []
                  }
                ],
                attributes: []
              },
              {
                model: db.agencyDetailModel3,
                required: false,
                // as:'agenctData',
                on: {
                  col1: sequelize.where(sequelize.col("agency_detail.user_id"), "=", sequelize.col("lifting_seed_details.indentor_id")),
                },
                include: [
                  {
                    model: db.userModel,
                    required: false,
                    where: {
                      user_type: 'IN',
                      ...whereClause1,

                    },
                    attributes: []
                  }
                ],
              },
              // {
              //   model: db.agencyDetailModel,
              //   include: [
              //     {
              //       model: db.userModel,
              //       // where: {
              //       //   user_type: 'IN'
              //       // },
              //       attributes: []
              //     }
              //   ],
              //   attributes: []
              // },
              {
                model: db.agencyDetailModel2,
                required: false,
                as: 'agencyDetails2',
                attributes: [],
                // on: {
                //   col1: sequelize.where(sequelize.col("agencyDetails2.state_id"), "=", sequelize.col("lifting_seed_details.spa_state_code")),
                // },
                // where: {
                //   state_id: data[key].spa_state_code,
                // },
                include: [
                  {
                    model: db.userModel,
                    required: false,
                    // on: {
                    //   col2: sequelize.where(sequelize.col("agencyDetails2->user.spa_code"), "=", sequelize.col("lifting_seed_details.spa_code")),
                    // },
                    where: {
                      spa_code: data[key].spa_code,
                      ...whereClause2,

                    },
                    attributes: [],
                    // required:true
                  }
                ],
                required: false,
                as: 'agencyDetails2',
                attributes: []
              }
            ],
            where: {
              user_id: req.body.loginedUserid.id,
              year: year,
              season,
              // ['$agencyDetails2.id$']: null,
              crop_code,
              ...whereClause,
              ...whereClause4,
              ['$agencyDetails2->user.spa_code$']: data[key].spa_code,
              ['$agencyDetails2.state_id$']: data[key].spa_state_code
              // [Op.and]: filterData2 ? filterData2 : [] 
            },
            attributes: [
              [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
              [sequelize.col('lifting_seed_details.variety_code'), 'variety_code'],
              [sequelize.col('lifting_seed_details.crop_code'), 'crop_code'],
              [sequelize.col('m_crop.crop_name'), 'crop_name'],
              [sequelize.col('lifting_seed_details.season'), 'season'],
              [sequelize.col('lifting_seed_details.bag_weight'), 'bag_weight'],
              [sequelize.col('lifting_seed_details.no_of_bag'), 'no_of_bag'],
              [sequelize.col('lifting_seed_details.total_price'), 'total_price'],
              [sequelize.col('agency_detail.agency_name'), 'agency_name'],
              [sequelize.col('agency_detail.user_id'), 'user_id'],
              [sequelize.col('lifting_seed_details.spa_state_code'), 'spa_state_code'],
              [sequelize.col('lifting_seed_details.spa_code'), 'spa_code'],
              [sequelize.col('agencyDetails2.agency_name'), 'spa_agency_name'],
              [sequelize.col('agencyDetails2.user_id'), 'spa_user_id'],
              [sequelize.col('lifting_seed_details.id'), 'id'],
              [sequelize.col('lifting_seed_details.reason_id'), 'reason_id'],
              [sequelize.col('lifting_lot_number.lot_no'), 'lot_no'],
              [sequelize.col('lifting_lot_number.lifting_details_id'), 'lifting_details_id'],
              [sequelize.col('lifting_lot_number->lifting_tag_number.tag_no'), 'tag_no'],
              [sequelize.col('lifting_lot_number->lifting_tag_number.lifting_lot_no_id'), 'lifting_lot_no_id'],
              [sequelize.col('lifting_seed_details.lifting_bill_no'), 'lifting_bill_no'],
              [sequelize.col('generate_breeder_seed_certificate.lifting_id'), 'lifting_id']
              // [sequelize.col('lifting_lot_number.lifting_details_id'),'lifting_details_id'],
            ],
            raw: true,
            nest: true
          })
        }
        // console.log(datas2,'prindata')
        prindata.push(datas2)
      }


      console.log(prindata, 'prindata')
      let liftingPrintData = [];


      if (prindata && prindata.length > 0) {
        prindata = prindata.flat()
      }
      if (prindata && prindata.length > 0) {
        if (spas && spas.length > 0) {

          prindata = prindata.map(item => {
            // console.log(item,'item.spa_code')
            const updatedAgency = spas.find(agency => agency.spa_code == item.spa_code && agency.state_code == item.spa_state_code);
            if (updatedAgency) {
              item.spa_agency_name = updatedAgency.spa_agency_name;
              item.spa_user_id = updatedAgency.spa_user_id;
            }
            return item;
          });
        }
      }
      let filterData = []
      prindata.forEach((el, index) => {
        let cropIndex;
        if (el.variety_line_code) {
          cropIndex = filterData.findIndex(item => item.variety_code == el.variety_code && item.variety_line_code == el.variety_line_code);
        } else {
          cropIndex = filterData.findIndex(item => item.variety_code == el.variety_code);
        }
        if (cropIndex == -1) {
          filterData.push(
            {
              "variety_name": el && el.variety_name ? el.variety_name : '',
              "variety_code": el && el.variety_code ? el.variety_code : '',
              id: el && el.id ? el.id : '',
              "indentor":
                [
                  {
                    "user_id": el && el.user_id ? el.user_id : '',
                    "agency_name": el && el.agency_name ? el.agency_name : '',
                    "spa": [
                      {
                        total_price: el && el.total_price && el.total_price ? el.total_price : '',
                        spa_agency_name: el && el.spa_agency_name && el.spa_agency_name ? el.spa_agency_name : '',
                        bag_weight: el && el.bag_weight ? el.bag_weight : '',
                        no_of_bag: el && el.no_of_bag ? el.no_of_bag : '',
                        reason_id: el && el.reason_id ? el.reason_id : '',
                        cropCode: el && el.variety_code ? el.variety_code : '',
                        id: el && el.id ? el.id : '',
                        spa_user_id: el && el.spa_user_id ? el.spa_user_id : '',
                        lifting_bill_no: el && el.lifting_bill_no ? el.lifting_bill_no : '',
                        lifting_id: el && el.lifting_id ? el.lifting_id : '',
                        lotData: [
                          {
                            tag_no: el && el.tag_no ? el.tag_no : '',
                            lifting_lot_no_id: el && el.lifting_lot_no_id ? el.lifting_lot_no_id : '',

                          }
                        ]
                      }
                    ],

                  }
                ]
            }
          )
        }
        else {
          const varietyIndex = filterData[cropIndex].indentor.findIndex(item => item.user_id === el.user_id);

          if (varietyIndex != -1) {
            // const bspcIndex = filterData[cropIndex].variety[varietyIndex].bspc.findIndex(item => item.bspc_id === el.bspc[index].bspc_id); 
            filterData[cropIndex].indentor[varietyIndex].spa.push(
              {
                total_price: el && el.total_price && el.total_price ? el.total_price : '',
                spa_agency_name: el && el.spa_agency_name && el.spa_agency_name ? el.spa_agency_name : '',
                bag_weight: el && el.bag_weight ? el.bag_weight : '',
                no_of_bag: el && el.no_of_bag ? el.no_of_bag : '',
                reason_id: el && el.reason_id ? el.reason_id : '',
                id: el && el.id ? el.id : '',
                spa_user_id: el && el.spa_user_id ? el.spa_user_id : '',
                lifting_bill_no: el && el.lifting_bill_no ? el.lifting_bill_no : '',
                lifting_id: el && el.lifting_id ? el.lifting_id : '',
                // total_price: el && el.total_price && el.total_price ? el.total_price : '',

              }
            )
          }
          else {
            filterData[cropIndex].indentor.push(
              {
                "user_id": el && el.user_id ? el.user_id : '',
                // "variety_id": el && el.variety_id ? el.variety_id : '',
                "agency_name": el && el.agency_name ? el.agency_name : '',
                "spa": [
                  {
                    total_price: el && el.total_price && el.total_price ? el.total_price : '',
                    spa_agency_name: el && el.spa_agency_name && el.spa_agency_name ? el.spa_agency_name : '',
                    bag_weight: el && el.bag_weight ? el.bag_weight : '',
                    no_of_bag: el && el.no_of_bag ? el.no_of_bag : '',
                    reason_id: el && el.reason_id ? el.reason_id : '',
                    id: el && el.id ? el.id : '',
                    spa_user_id: el && el.spa_user_id ? el.spa_user_id : '',
                    lifting_bill_no: el && el.lifting_bill_no ? el.lifting_bill_no : '',
                    lifting_id: el && el.lifting_id ? el.lifting_id : '',
                    lotData: [
                      {
                        tag_no: el && el.tag_no ? el.tag_no : '',
                        lifting_lot_no_id: el && el.lifting_lot_no_id ? el.lifting_lot_no_id : '',

                      }
                    ]
                  }
                ],

              }
            )
          }
        }

      });

      if (filterData && filterData.length > 0) {
        filterData.forEach((el) => {
          el.indentor.forEach(item => {
            item.spa = productiohelper.removeDuplicates(item.spa, 'id')
          })
        })
      }
      let liftingData = await db.liftingSeedDetailsModel.findAll({
        include: [
          {
            model: db.liftingTagNumberModel,
            attributes: []
          }
        ],
        attributes: [
          [sequelize.col('lifting_tag_number.litting_seed_details_id'), 'litting_seed_details_id'],
          [sequelize.col('lifting_tag_number.tag_no'), 'tag_no'],
          [sequelize.col('lifting_tag_number.tag_size'), 'tag_size'],
          [sequelize.col('lifting_tag_number.no_of_bags'), 'no_of_bags'],
          [sequelize.col('lifting_tag_number.lifting_lot_no_id'), 'lifting_lot_no_id'],
        ]
      })
      // if (filterData && filterData.length > 0) {
      //   filterData.forEach((el) => {
      //     el.indentor.forEach(item => {
      //       item.spa = productiohelper.sumofDuplicateDataSecondmulitple(item.spa, 'spa_user_id')
      //     })
      //   })
      // }
      let responseData = {
        filterData,
        liftingData

      }
      if (filterData) {
        return response(res, status.DATA_AVAILABLE, 200, responseData)
      } else {
        return response(res, "Data Not Found", 200, {})
      }

    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500, error)
    }
  }
  static getLiftingDataVariety = async (req, res) => {

    try {
      const { year, season, crop_code, variety_code } = req.body.search
      let whereClause = {}
      if (variety_code) {
        whereClause.variety_code = {
          [Op.in]: variety_code
        };
      }
      const condition = {
        include: [
          {
            model: varietyModel,
            attributes: []
          }
        ],
        where: {
          user_id: req.body.loginedUserid.id,
          year: year,
          season,
          crop_code,
          ...whereClause
        },

        attributes: [
          // [sequelize.col('lifting_seed_details.crop'),'crop'],
          // [db.Sequelize.fn("Distinct", db.Sequelize.col("lifting_seed_details.crop_code")), "crop_code"],
          // [sequelize.col('m_crop.crop_name'),'crop_name'],
          [sequelize.col('m_crop_variety.variety_name'), 'item_text'],
          [sequelize.col('lifting_seed_details.variety_code'), 'item_id']
        ],
        group: [
          [sequelize.col('m_crop_variety.variety_name'), 'item_text'],
          // [sequelize.col('m_crop.crop_name'),'crop_name'],
          [sequelize.col('lifting_seed_details.variety_code'), 'item_id']
        ]
      }
      //  condition.order[['year','ASC']]
      let data = await db.liftingSeedDetailsModel.findAll(condition)
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
  static getLiftingDataIndentor = async (req, res) => {

    try {
      const { year, season, crop_code } = req.body.search
      const condition = {
        include: [
          {
            model: db.agencyDetailModel,
            include: [
              {
                model: db.userModel,
                where: {
                  user_type: 'IN'
                },
                attributes: []
              }
            ],
            attributes: []
          },
        ],
        where: {
          user_id: req.body.loginedUserid.id,
          year: year,
          season,
          crop_code
        },
        // raw:true
        attributes: [
          //   [sequelize.fn('DISTINCT', sequelize.col('agency_detail.agency_name')), 'agency_name'],
          [sequelize.col('agency_detail.agency_name'), 'item_text'],
          [sequelize.col('agency_detail.user_id'), 'item_id'],
        ],
        // group:[
        //   [sequelize.col('agency_detail.agency_name'),'agency_name'],
        //   [sequelize.col('agency_detail.user_id'),'user_id'],
        //   [sequelize.col('agency_detail.id'),'id'],
        // ]
      }
      //  condition.order[['year','ASC']]
      let data = await db.liftingSeedDetailsModel.findAll(condition)
      data = productiohelper.removeDuplicates(data, 'item_id')
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
  static getLiftingDataSpa = async (req, res) => {

    try {
      const { year, season, crop_code } = req.body.search
      let datas = await db.liftingSeedDetailsModel.findAll({
        where: {
          user_id: req.body.loginedUserid.id,
          year: year,
          season,
          crop_code
        },
        attributes: [
          'spa_code', 'spa_state_code'
        ],
        raw: true
      })
      let data
      let liftingSpas = [];
      console.log(datas, 'datas')
      for (let key in datas) {

        data = await db.liftingSeedDetailsModel.findAll({
          include: [
            {
              model: db.agencyDetailModel4,
              where: {
                state_id: datas[key].spa_state_code
              },
              include: [
                {
                  model: db.userModel,
                  where: {
                    spa_code: datas[key].spa_code
                  },
                  //  where:{
                  //    user_type:'IN'
                  //  },
                  attributes: []
                }
              ],
              attributes: []
            },
          ],
          where: {
            user_id: req.body.loginedUserid.id,
            year: year,
            season,
            crop_code,
            //  spa_code:datas[key].spa_code
          },

          attributes: [
            [sequelize.col('agency_detail.agency_name'), 'item_text'],
            [sequelize.col('agency_detail.user_id'), 'item_id'],
          ],
          raw: true
          // group:[
          //   [sequelize.col('agency_detail.agency_name'),'agency_name'],
          //   [sequelize.col('agency_detail.user_id'),'user_id'],
          // ]
        })
        liftingSpas.push(data)
      }
      if (liftingSpas && liftingSpas.length > 0) {
        liftingSpas = liftingSpas ? liftingSpas.flat() : ''
      }
      liftingSpas = productiohelper.removeDuplicates(liftingSpas, 'item_id')
      if (liftingSpas) {
        return response(res, status.DATA_AVAILABLE, 200, liftingSpas)
      } else {
        return response(res, "Data Not Found", 200, {})
      }

    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500, error)
    }
  }
  static getLiftingDataBillNumber = async (req, res) => {

    try {
      const { year, season, crop_code } = req.body.search
      const condition = {

        where: {
          user_id: req.body.loginedUserid.id,
          year: year,
          season,
          crop_code
        },

        attributes: [
          [sequelize.col('lifting_seed_details.lifting_bill_no'), 'Bill'],
          [sequelize.col('lifting_seed_details.id'), 'id'],
          // [sequelize.col('agency_detail.user_id'),'user_id'],
        ],
        // group:[
        //   [sequelize.col('lifting_seed_details.Bill'),'Bill'],
        //   [sequelize.col('lifting_seed_details.id'),'id'],
        //   // [sequelize.col('agency_detail.user_id'),'user_id'],
        // ]
      }
      //  condition.order[['year','ASC']]
      let data = await db.liftingSeedDetailsModel.findAll(condition)
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
  static getLiftingDataCertificate = async (req, res) => {

    try {
      const { submissionId } = req.body.search;
      let datas = await db.liftingSeedDetailsModel.findAll({
        where: {
          id: submissionId
        },
        attributes: [
          'spa_code', 'variety_line_code', 'variety_code'
        ],
        raw: true
      })
      let whereClause = {}
      if (datas && datas[0] && datas[0].variety_line_code) {
        whereClause.variety_line_code = datas[0].variety_line_code
      }
      const condition = {

        where: {
          id: submissionId,
        },
        include: [
          {
            model: db.liftingTagNumberModel,
            attributes: []
          },
          {
            model: db.cropModel,
            attributes: []
          },
          {
            model: db.varietyModel,
            attributes: []
          },
          {
            model: db.varietLineModel,
            attributes: []
          },
          {
            model: db.varietLineModel,
            attributes: []
          },
          {
            model: db.generateBreederSeedCertificate,
            attributes: []
          },
          {
            model: db.liftingLotNumberModel,
            include: [
              {
                model: db.liftingTagNumberModel,
                attributes: []
              }
            ],
            attributes: []
          },
          {
            model: db.bspPerformaBspThree,
            required: false,
            where: {
              // user_id:req.body.loginedUserid.id,
              ...whereClause
            },
            attributes: []
          },
          {
            model: db.agencyDetailModel2,
            include: [
              {
                model: db.userModel,
                where: {
                  spa_code: datas[0].spa_code
                },
                attributes: []
              }
            ],
            as: 'agencyDetails2',
            attributes: []
          },
        ],
        attributes: [
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [sequelize.col('lifting_seed_details.variety_code'), 'variety_code'],
          [sequelize.col('lifting_seed_details.crop_code'), 'crop_code'],
          [sequelize.col('m_crop.crop_name'), 'crop_name'],
          [sequelize.col('lifting_seed_details.season'), 'season'],
          [sequelize.col('lifting_seed_details.bag_weight'), 'bag_weight'],
          [sequelize.col('lifting_seed_details.no_of_bag'), 'no_of_bag'],
          [sequelize.col('lifting_seed_details.total_price'), 'total_price'],
          // [sequelize.col('agency_detail.agency_name'),'agency_name'],
          // [sequelize.col('agency_detail.user_id'),'user_id'],
          [sequelize.col('lifting_seed_details.spa_state_code'), 'spa_state_code'],
          [sequelize.col('lifting_seed_details.spa_code'), 'spa_code'],
          [sequelize.col('lifting_seed_details.id'), 'id'],
          [sequelize.col('lifting_seed_details.year'), 'year'],
          [sequelize.col('m_variety_line.line_variety_name'), 'line_variety_name'],
          [sequelize.col('agencyDetails2.agency_name'), 'spa_agency_name'],
          [sequelize.col('agencyDetails2.user_id'), 'spa_user_id'],
          [sequelize.col('lifting_seed_details.lifting_bill_no'), 'lifting_bill_no'],
          [sequelize.col('bsp_proforma_3.inspection_date'), 'inspection_date'],
          [sequelize.col('lifting_lot_number.lot_no'), 'lot_no'],
          [sequelize.col('lifting_lot_number.id'), 'lot_id'],
          [sequelize.col('lifting_lot_number->lifting_tag_number.tag_no'), 'tag_no'],

          [sequelize.col('lifting_lot_number->lifting_tag_number.lifting_lot_no_id'), 'lifting_lot_no_id'],
          [sequelize.col('lifting_lot_number->lifting_tag_number.id'), 'tag_no_id'],
          [sequelize.col('generate_breeder_seed_certificate.is_created'), 'is_created']

          // [sequelize.col('lifting_seed_details.season'),'year'],
        ],
        raw: true
      }

      //  condition.order[['year','ASC']]
      let data = await db.liftingSeedDetailsModel.findAll(condition)
      let filterData = []
      data.forEach((el, index) => {
        let cropIndex;

        cropIndex = filterData.findIndex(item => item.id == el.id);

        if (cropIndex == -1) {
          filterData.push(
            {
              "year": el && el.year ? el.year : '',
              "id": el && el.id ? el.id : '',
              "season": el && el.season ? el.season : '',
              "crop_name": el && el.crop_name ? el.crop_name : '',
              "variety_name": el && el.variety_name ? el.variety_name : '',
              "line_variety_name": el && el.line_variety_name ? el.line_variety_name : '',
              "spa_agency_name": el && el.spa_agency_name ? el.spa_agency_name : '',
              "lifting_bill_no": el && el.lifting_bill_no ? el.lifting_bill_no : '',
              "is_created": el && el.is_created ? el.is_created : '',
              "indentor":
                [
                  {
                    "user_id": el && el.user_id ? el.user_id : '',
                    "agency_name": el && el.agency_name ? el.agency_name : '',
                    "inspection_date": el && el.inspection_date ? el.inspection_date : '',
                    "lot_no": el && el.lot_no ? el.lot_no : "",
                    "lot_id": el && el.lot_id ? el.lot_id : "",
                    "tags": [
                      {
                        "tag_no": el && el.tag_no ? el.tag_no : '',
                        "lifting_lot_no_id": el && el.lifting_lot_no_id ? el.lifting_lot_no_id : "",
                        "tag_no_id": el && el.tag_no_id ? el.tag_no_id : '',
                      }
                    ]
                  }
                ],
            }
          )
        }
        else {
          const varietyIndex = filterData[cropIndex].indentor.findIndex(item => item.lot_id === el.lot_id);
          if (varietyIndex != -1) {
            // const bspcIndex = filterData[cropIndex].variety[varietyIndex].bspc.findIndex(item => item.bspc_id === el.bspc[index].bspc_id); 
            filterData[cropIndex].indentor[varietyIndex].tags.push({
              "tag_no": el && el.tag_no ? el.tag_no : '',
              "lifting_lot_no_id": el && el.lifting_lot_no_id ? el.lifting_lot_no_id : "",
              "tag_no_id": el && el.tag_no_id ? el.tag_no_id : '',
            })
          }
          filterData[cropIndex].indentor.push({
            "user_id": el && el.user_id ? el.user_id : '',
            "agency_name": el && el.agency_name ? el.agency_name : '',
            "inspection_date": el && el.inspection_date ? el.inspection_date : '',
            "lot_no": el && el.lot_no ? el.lot_no : "",
            "lot_id": el && el.lot_id ? el.lot_id : "",
            "tags": [
              {
                "tag_no": el && el.tag_no ? el.tag_no : '',
                "lifting_lot_no_id": el && el.lifting_lot_no_id ? el.lifting_lot_no_id : "",
                "tag_no_id": el && el.tag_no_id ? el.tag_no_id : '',
              }
            ]
          })
        }

      });
      if (filterData && filterData.length > 0) {
        filterData.forEach(el => {
          el.indentor = productiohelper.removeDuplicates(el.indentor, 'lot_id')
        })
        filterData.forEach(el => {
          el.indentor.forEach(val => {
            val.tags = productiohelper.removeDuplicates(val.tags, 'tag_no_id')
          })
        })
      }
      if (filterData) {
        return response(res, status.DATA_AVAILABLE, 200, filterData)
      } else {
        return response(res, "Data Not Found", 200, {})
      }

    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500, error)
    }
  }
  static savegenerateCerticate = async (req, res) => {

    try {
      const { variety_code, indenter_id, spa_code, lifting_id } = req.body;
      let data = await db.generateBreederSeedCertificate.create({
        variety_code: variety_code,
        indenter_id: indenter_id,
        spa_code: spa_code,
        state_code: '24',
        is_active: 1,
        status: 1,
        is_created: Date.now(),
        is_updated: Date.now(),
        lifting_id: lifting_id
      })

      //  condition.order[['year','ASC']]

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

  static getInvoicePaymentYear = async (req, res) => {

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

      console.log("state_code--", state_code, "spa_code--", spa_code)
      const condition = {
        include: [
          {
            model: db.allocationSpaForLiftingSeed,
            where: {
              spa_code,
              state_code,
            },
            attributes: []
          }
        ],
        // where: {
        //   user_id: req.body.loginedUserid.id,

        // },
        attributes: [
          [db.Sequelize.fn("Distinct", db.Sequelize.col("year")), "value"],
          // [sequelize.literal("concat(year, '-', RIGHT((Year+1)::VARCHAR, 2))"), 'display_text'],
          // 'year'
          // [
          // [db.Sequelize.fn("Distinct", db.Sequelize.col("lifting_seed_details.year")), "year"],
          // [sequelize.col('lifting_seed_details'),'']
          // ]
        ],
        raw: true,
        // order: [
        //   [db.Sequelize.col("lifting_seed_details.year"), 'DESC']
        // ]
      }
      //  condition.order[['year','ASC']]
      let data = await db.allocationToSPASeed.findAll(condition)
      let yearOfIndent = []
      if (data && data.length > 0) {
        data.forEach((el => {
          yearOfIndent.push(el && el.value ? el.value : '')
        }))
      }
      let filterData = {
        year_of_indent: yearOfIndent
      }
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
  static getInvoicePaymentSeason = async (req, res) => {

    const seasonData =

      [
        {
          "season": "Rabi",
          "season_code": "R"
        },
        {
          "season": "Khafif",
          "season_code": "K"
        }
      ]


    return response(res, status.DATA_AVAILABLE, 200, seasonData)

    try {
      let { state_code, spa_code, sector, year } = req.body
      console.log("state_code--", state_code, "spa_code--", spa_code)

      if (sector) {
        //Change state code and spa code base on sector
        let spaSectorDetails = await SpaDataBySector.getSPADetailBySector(spa_code, sector, state_code)
        state_code = spaSectorDetails.stateCode
        spa_code = spaSectorDetails.spa_code
      }

      const condition = {
        include: [
          {
            model: db.allocationSpaForLiftingSeed,
            where: {
              spa_code,
              state_code,
            },
            attributes: []
          }
        ],
        where: {
          year
        },
        attributes: [
          [db.Sequelize.fn("Distinct", db.Sequelize.col("season")), "value"],
        ],
        raw: true,

      }

      let data = await db.allocationToSPASeed.findAll(condition)
      let season = []
      console.log("datadata", data)
      if (data && data.length > 0) {
        data.forEach((el => {
          season.push(el && el.value ? el.value : '')
        }))
      }
      console.log("dsadsa", data)
      let seasonData = await seasonModel.findAll({
        attributes: [
          'season_code', 'season'
        ],
        where: {
          season_code: {
            [Op.in]: season
          }
        }
      })

      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, seasonData)
      } else {
        return response(res, "Data Not Found", 200, {})
      }

    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500, error)
    }
  }
  static getInvoicePaymentCrop = async (req, res) => {

    try {
      let { state_code, spa_code, sector, year_of_indent, season } = req.body
      const year = year_of_indent;
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
      console.log("state_code--", state_code, "spa_code--", spa_code)

      if (sector) {
        //Change state code and spa code base on sector
        let spaSectorDetails = await SpaDataBySector.getSPADetailBySector(spa_code, sector, state_code)
        state_code = spaSectorDetails.stateCode
        spa_code = spaSectorDetails.spa_code
      }

      const condition = {
        include: [
          {
            model: db.allocationSpaForLiftingSeed,
            where: {
              spa_code,
              state_code,
            },
            attributes: []
          }
        ],
        where: {
          year,
          season

        },
        attributes: [
          [db.Sequelize.fn("Distinct", db.Sequelize.col("crop_code")), "value"],

        ],
        raw: true,
        // order: [
        //   [db.Sequelize.col("lifting_seed_details.year"), 'DESC']
        // ]
      }
      //  condition.order[['year','ASC']]
      let data = await db.allocationToSPASeed.findAll(condition)
      let crops = []
      if (data && data.length > 0) {
        data.forEach((el => {
          crops.push(el && el.value ? el.value : '')
        }))
      }
      let cropdata = await cropModel.findAll({
        attributes: [
          // [db.Sequelize.fn("Distinct", db.Sequelize.col("crop_code")), "crop_code"],
          'crop_code', 'crop_name'

        ],
        where: {
          crop_code: {
            [Op.in]: crops
          }
        }
      })

      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, cropdata)
      } else {
        return response(res, "Data Not Found", 200, {})
      }

    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500, error)
    }
  }
  static getInvoicePaymentVariety = async (req, res) => {

    try {
      let { state_code, spa_code, sector, year, season, crop_code } = req.body
      console.log("state_code--", state_code, "spa_code--", spa_code)

      if (sector) {
        //Change state code and spa code base on sector
        let spaSectorDetails = await SpaDataBySector.getSPADetailBySector(spa_code, sector, state_code)
        state_code = spaSectorDetails.stateCode
        spa_code = spaSectorDetails.spa_code
      }

      const condition = {
        include: [
          {
            model: db.allocationSpaForLiftingSeed,
            where: {
              spa_code,
              state_code,
              // year,
              // season
            },
            attributes: []
          },
          {
            model: db.varietyModel,

            attributes: []
          }
        ],
        where: {
          year,
          season,
          crop_code

        },
        attributes: [
          [db.Sequelize.fn("Distinct", db.Sequelize.col("m_crop_variety.variety_code")), "variety_code"],
          [db.Sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          // [sequelize.col('allocation_to_spa_for_lifting_seeds.variety_code'),'allocation_variety_code']

        ],
        raw: true,
        // order: [
        //   [db.Sequelize.col("lifting_seed_details.year"), 'DESC']
        // ]
      }
      //  condition.order[['year','ASC']]
      let data = await db.allocationToSPASeed.findAll(condition)



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
  static getInvoicePaymentData = async (req, res) => {

    try {
      let { state_code, spa_code, sector, year, year_of_indent, season, crop_code, variety_code, user_id } = req.body;
      if (!year)
        year = year_of_indent;
      const actualSPACode = spa_code

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

      let whereClause = {
      }
      let whereClause1 = {
      }
      let whereClause2 = {};
      if (user_id) {
        whereClause2.user_id = user_id
      }
      if (year) {
        whereClause.year = year
      }

      if (season) {
        whereClause.season = season
      }
      if (crop_code) {
        whereClause.crop_code = crop_code
      }
      if (variety_code) {
        whereClause1.variety_code = variety_code
      }
      const condition = {
        include: [
          {
            // required:false,
            model: db.allocationSpaForLiftingSeed,
            include: [
              {
                required: false,
                model: db.agencyDetailModel,
                attributes: []
              },
              {
                required: false,
                model: db.receiptRequestModel,
                attributes: []
              },
            ],
            attributes: [],
            where: {
              spa_code,
              state_code,
              // year,
              // season
            },
            // attributes:[]
          },
          {
            model: db.varietyModel,
            required: false,
            where: {
              ...whereClause1
            },
            attributes: []
          },
          {
            model: db.varietLineModel,
            required: false,
            attributes: []
          }
        ],
        where: {
          ...whereClause
          // year,
          // season

        },
        attributes: [
          [db.Sequelize.col('allocation_to_spa_for_lifting_seed_production_cnters.indent_qty'), 'indent_qty'],
          [db.Sequelize.col('allocation_to_spa_for_lifting_seed_production_cnters.spa_code'), 'spa_code'],
          [db.Sequelize.col('allocation_to_spa_for_lifting_seed_production_cnters.state_code'), 'state_code'],
          [db.Sequelize.col('allocation_to_spa_for_lifting_seed_production_cnters.production_center_id'), 'production_center_id'],
          [db.Sequelize.col('allocation_to_spa_for_lifting_seed_production_cnters.id'), 'allocation_spa_id'],
          [db.Sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [db.Sequelize.col('m_crop_variety.variety_code'), 'variety_code'],
          [db.Sequelize.col('allocation_to_spa_for_lifting_seeds.variety_id'), 'variety_id'],
          [db.Sequelize.col('allocation_to_spa_for_lifting_seeds.crop_code'), 'crop_code'],
          [db.Sequelize.col('allocation_to_spa_for_lifting_seeds.variety_line_code'), 'variety_line_code'],
          [db.Sequelize.col('allocation_to_spa_for_lifting_seed_production_cnters.allocated_quantity'), 'allocated_quantity'],
          [db.Sequelize.col('m_variety_line.line_variety_name'), 'line_variety_name'],
          [db.Sequelize.col('allocation_to_spa_for_lifting_seeds.user_id'), 'indenter_id'],
          [db.Sequelize.col('allocation_to_spa_for_lifting_seed_production_cnters->agency_detail.agency_name'), 'agency_name'],
          [db.Sequelize.col('allocation_to_spa_for_lifting_seed_production_cnters->receipt_requests.payment_status'), 'payment_status'],
          [db.Sequelize.col('allocation_to_spa_for_lifting_seed_production_cnters->receipt_requests.amount'), 'amount'],
          [db.Sequelize.col('allocation_to_spa_for_lifting_seed_production_cnters->receipt_requests.invoice_amount'), 'invoice_amount'],

          [db.Sequelize.col('allocation_to_spa_for_lifting_seed_production_cnters->receipt_requests.payment_method'), 'payment_method'],
          [db.Sequelize.col('allocation_to_spa_for_lifting_seed_production_cnters->receipt_requests.amount_paid'), 'amount_paid'],
          [db.Sequelize.col('allocation_to_spa_for_lifting_seed_production_cnters->receipt_requests.transaction_number'), 'transaction_number'],
          [db.Sequelize.col('allocation_to_spa_for_lifting_seed_production_cnters->receipt_requests.id'), 'receipt_id'],
          // [db.Sequelize.col('allocation_to_spa_for_lifting_seed_production_cnters->receipt_requests.amount'), 'amount'],
        ],

        raw: true,
        required: false,
        // order: [
        //   [db.Sequelize.col("lifting_seed_details.year"), 'DESC']
        // ]
      }
      //  condition.order[['year','ASC']]
      let data = await db.allocationToSPASeed.findAll(condition)
      // let result = `seed.gov.in/receipt/record_number=${'year=' + year + '&season=' + season + '&crop_code=' + crop_code}`
      // // console.log(this.encryptURL(res),'resres')
      // // console.log(this.encryptURL(res),'resres')
      // console.log(result, 'res')
      const mergedData = [];
      const BASE_URL = process.env.BASE_URL
      const AESKey = process.env.AESKey
      const INVOICE_END_POINT = process.env.INVOICE_END_POINT
      if (data && data.length > 0) {
        let totalVarietyData;
        totalVarietyData = await Promise.all(data.map(async item => {
          const AllocatedData = await db.availabilityOfBreederSeedModel.findAll({
            attributes: ['variety_code', 'allocate_qty', 'variety_line_code'],

            where: {
              ...whereClause,
              variety_code: item.variety_code,
              user_id: item.production_center_id
              //  ...whereClause2
            },
            raw: true,
          })

          return AllocatedData;
        }))


        if (totalVarietyData && totalVarietyData.length > 0) {
          totalVarietyData = totalVarietyData ? totalVarietyData.flat() : '';
        }
        console.log(totalVarietyData, 'totalVarietyData')
        data = data.map(item1 => {
          let match = totalVarietyData.find(item2 =>
            item1.variety_code === item2.variety_code &&
            item1.variety_line_code === item2.variety_line_code
          );
          return match ? { ...item1, ...match } : item1;
        });
        console.log(data, 'datadata')

        data.forEach(item => {
          const existingItem = mergedData.find(mergedItem =>
            item.variety_line_code !== null
              ? mergedItem.variety_line_code === item.variety_line_code && mergedItem.variety_code === item.variety_code && mergedItem.production_center_id === item.production_center_id
              : mergedItem.variety_code === item.variety_code && mergedItem.production_center_id === item.production_center_id
          );

          if (existingItem) {
            existingItem.indent_qty += item.indent_qty;
            existingItem.allocated_quantity += item.allocated_quantity;
          } else {
            mergedData.push({ ...item });
          }
        });

      }


      let filterData = []


      if (mergedData && mergedData.length > 0) {
        mergedData.forEach((el, index) => {
          let cropIndex;
          if (el.variety_line_code) {
            cropIndex = filterData.findIndex(item => item.variety_code == el.variety_code && item.variety_line_code == el.variety_line_code);
          } else {
            cropIndex = filterData.findIndex(item => item.variety_code == el.variety_code);
          }
          if (cropIndex == -1) {

            let receiptUrl = null;
            if (el && el.receipt_id) {
              const encryptedForm = CryptoJS.AES.encrypt(JSON.stringify({ id: el.receipt_id }), AESKey).toString();
              const encryptedData = encodeURIComponent(encryptedForm);
              receiptUrl = `${BASE_URL}/${INVOICE_END_POINT}/${encryptedData}`
              console.log("receiptUrl---------", receiptUrl)
            }

            let receiptUrlTest = `${BASE_URL}/${INVOICE_END_POINT}/${encodeURIComponent(CryptoJS.AES.encrypt(JSON.stringify({ id: 1 }), AESKey).toString())}`
            console.log("testreceiptUrl---------", receiptUrlTest)

            filterData.push(
              {
                "year": year ? year : '',
                "season": season ? season : '',
                "crop_code": crop_code ? crop_code : '',
                "variety_id": el && el.variety_id ? el.variety_id : '',
                "variety_code": el && el.variety_code ? el.variety_code : '',
                "variety_name": el && el.variety_name ? el.variety_name : '',
                "parental_line": el && el.line_variety_name ? el.line_variety_name : '',
                "parental_line_code": el && el.variety_line_code ? el.variety_line_code : '',
                "indent_quantity": el && el.indent_qty ? el.indent_qty : '',
                "indenter_id": el && el.indenter_id ? el.indenter_id : '',
                "bspc": [
                  {
                    "bspc_id": el && el.production_center_id ? el.production_center_id : '',
                    "bspc_name": el && el.agency_name ? el.agency_name : '',
                    "allocate_quantity": el && el.allocated_quantity ? el.allocated_quantity : '',
                    "availabity_seed": el && el.allocate_qty ? el.allocate_qty : '',
                    "payment_status": el && el.payment_status ? el.payment_status : '',
                    // "amount": el && el.amount ? el.amount : '',
                    "amount": el && el.invoice_amount ? el.invoice_amount : '',
                    "paid_amount": el && el.amount_paid ? el.amount_paid : '',
                    "payment_method": el && el.payment_method ? el.payment_method : '',
                    "transaction_number": el && el.transaction_number ? el.transaction_number : '',
                    "id": el && el.allocation_spa_id ? el.allocation_spa_id : '',
                    // "id": el && el.receipt_id ? el.receipt_id : '',                                        
                    "receipt_url": receiptUrl
                    // "receipt_url": "seed.gov.in/receipt/record_number=asdfdasf423qew5radsr34q5wrdsa"
                  }
                ]

              }
            )
          }
          else {
            let plotIndex = filterData[cropIndex].bspc.findIndex(item => item.bspc_id == el.production_center_id);
            if (plotIndex == -1) {
              filterData[cropIndex].bspc.push({
                "bspc_id": el && el.production_center_id ? el.production_center_id : '',
                "bspc_name": el && el.agency_name ? el.agency_name : '',
                "allocate_quantity": el && el.allocated_quantity ? el.allocated_quantity : '',
                "availabity_seed": el && el.allocate_qty ? el.allocate_qty : '',
                // "payment_status": el && el.payment_status ? el.payment_status:'',
                // "payment_status": "pending",
                "id": el && el.allocation_spa_id ? el.allocation_spa_id : '',
                // "invoice_id": '',
                "payment_status": el && el.payment_status ? el.payment_status : '',
                // "amount": el && el.amount ? el.amount : '',
                "amount": el && el.invoice_amount ? el.invoice_amount : '',
                "paid_amount": el && el.amount_paid ? el.amount_paid : '',
                "payment_method": el && el.payment_method ? el.payment_method : '',
                "transaction_number": el && el.transaction_number ? el.transaction_number : '',
                "receipt_url": receiptUrl
                // "receipt_url": "seed.gov.in/receipt/record_number=asdfdasf423qew5radsr34q5wrdsa"
              })
            } else {
              filterData[cropIndex].bspc.push({
                "bspc_id": el && el.production_center_id ? el.production_center_id : '',
                "bspc_name": el && el.agency_name ? el.agency_name : '',
                "allocate_quantity": el && el.allocated_quantity ? el.allocated_quantity : '',
                "availabity_seed": el && el.allocate_qty ? el.allocate_qty : '',
                "payment_status": el && el.payment_status ? el.payment_status : '',
                // "amount": el && el.amount ? el.amount : '',
                "amount": el && el.invoice_amount ? el.invoice_amount : '',
                "paid_amount": el && el.amount_paid ? el.amount_paid : '',
                "payment_method": el && el.payment_method ? el.payment_method : '',
                "transaction_number": el && el.transaction_number ? el.transaction_number : '',
                "id": el && el.allocation_spa_id ? el.allocation_spa_id : '',
                "receipt_url": receiptUrl
              })
            }
          }
        });
      }

      if (filterData) {
        return response(res, status.DATA_AVAILABLE, 200, filterData)
      } else {
        return response(res, "Data Not Found", 200, {})
      }

    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500, error)
    }
  }


  static saveInvoiceData = async (req, res) => {

    try {
      let { year_of_indent, year, season, sector, crop_code, variety_code, variety_line_code, indenter_id, spa_code, state_code, id, bspc_id } = req.body;
      console.log("state_code--", state_code, "spa_code--", spa_code)
      year = year_of_indent
      if (!crop_code)
        crop_code = variety_code.substring(0, 5)

      if (sector) {
        //Change state code and spa code base on sector
        let spaSectorDetails = await SpaDataBySector.getSPADetailBySector(spa_code, sector, state_code)
        state_code = spaSectorDetails.stateCode
        spa_code = spaSectorDetails.spa_code
      }

      // payment_request,
      // invoice_amount, payment_status, amount_paid, payment_method, transaction_number, available_breederseed_as_per_invoice
      let param = {
        year: year,
        season: season,
        crop_code: crop_code,
        indenter_id: indenter_id,
        variety_code: variety_code,
        variety_line_code: variety_line_code,
        spa_code: spa_code,
        state_code: state_code,
        payment_status: 'pending',
        bspc_id: bspc_id,
        allocation_spa_id: id

      }
      let data = await db.receiptRequestModel.create(param)
      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, 'Receipt Save Successfully')
      } else {
        return response(res, "Data Not Found", 200, {})
      }
    }
    catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500, error)
    }
  }
  static encrypt(text) {
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  }

  static decrypt(text) {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }
  static payInvoiceData = async (req, res) => {

    try {
      let { state_code, spa_code, sector, id, amount, payment_status, paid_amount, payment_method, transaction_number } = req.body;
      if (sector) {
        //Change state code and spa code base on sector
        let spaSectorDetails = await SpaDataBySector.getSPADetailBySector(spa_code, sector, state_code)
        state_code = spaSectorDetails.stateCode
        spa_code = spaSectorDetails.spa_code
      }

      // payment_request,
      // invoice_amount, payment_status, amount_paid, payment_method, transaction_number, available_breederseed_as_per_invoice
      let param = {
        state_code: state_code,
        spa_code: spa_code,
        //   sector:sector,
        allocation_spa_id: id,
        amount: amount,
        payment_method: payment_method,
        payment_status: payment_status,
        amount_paid: paid_amount,
        transaction_number: transaction_number
      }
      let data = await db.receiptRequestModel.update(param, {
        where: {
          allocation_spa_id: id
        }
      }
      )
      if (data) {
        return response(res, status.DATA_SAVE, 200, [])
      } else {
        return response(res, "Data Not Found", 200, {})
      }
    }
    catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500, error)
    }
  }
  static generateInoviceData = async (req, res) => {

    try {
      const { mougst_amt_total, licencegst_amt_total, final_grand_total_amt,
        totalbags, bagweightData,
        receipt_id, mougst_amt, licencegst_amt, mou_amt, licence_amt } = req.body;

      let param = {
        reciept_request_id: receipt_id,
        user_id: req.body.loginedUserid.id,
        created_at: Date.now(),
        updated_at: Date.now(),
        bag_detials: req.body,
        mou_charges: mougst_amt_total,
        license_fees: licencegst_amt_total,
        cgst: mougst_amt,
        igst: licencegst_amt,
        total_bag: totalbags,
        bag_size: bagweightData,
        total_amount: final_grand_total_amt,
        is_active: 1
      }
      let data = await db.receiptGenerateModel.create(param)

      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        return response(res, "Data Not Found", 200, {})
      }
    }
    catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500, error)
    }
  }
  static getVarietyPriceList = async (req, res) => {

    try {
      const { variety_code, variety_line_code, crop, year, season, } = req.body.search;
      let whereClause = {};
      if (variety_code) {
        whereClause.variety_code = variety_code
      }
      if (variety_line_code) {
        whereClause.variety_line_code = variety_line_code
      }
      if (crop) {
        whereClause.crop_code = crop
      }
      if (year) {
        whereClause.year = year
      }
      if (season) {
        whereClause.season = season
      }
      let condition = {
        where: {
          ...whereClause,
          user_id: req.body.loginedUserid.id
        },
        include: [
          {
            model: db.varietyPriceListPackagesModel,
            attributes: []
          },
        ],
        attributes: [
          [sequelize.col('variety_price_list_package.per_qnt_mrp'), 'per_qnt_mrp']
          //   'package_data'
        ]
      }

      let data = await db.varietyPriceList.findAll(condition)

      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, data)
      } else {
        return response(res, "Data Not Found", 200, {})
      }
    }
    catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500, error)
    }
  }
  static encryptData(data) {
    return CryptoJS.AES.encrypt(JSON.stringify(data), process.env.AESKey).toString();
  }
  static decryptData(data) {
    try {
      const bytes = CryptoJS.AES.decrypt(data, process.env.AESKey);
      // console.log(bytes,'bytesbytes')
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      return decryptedData;
    } catch (error) {
      console.error('Decryption failed:', error);
      return null;
    }
  }
  static getBillPrintData = async (req, res) => {

    try {
      let { id } = req.body.search;
      let whereClause = {};
      // id='U2FsdGVkX1%2BL9%2F05DAuKxF%2BUMBdOoby7T8DZe%2FGlVK0%3D';

      let AESKey = process.env.AESKey;
      // AESKey='a-343%^5ds67fg%__%add'
      console.log(AESKey, 'AESKey')
      let decreptedId;
      if (id) {
        let decryptedBytes = CryptoJS.AES.decrypt(decodeURIComponent(id), AESKey);
        console.log(decryptedBytes, 'decryptedBytesdecryptedBytesdecryptedBytes')
        let decreptedData = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8)).id;
        decreptedId = decreptedData;
        // let decriptedI
        // const decryptedBytes = this.decryptData(id)
        // let decreptId=JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8)).id
        // console.log(decodeURIComponent(id),'decodeURIComponent')
        // const decryptedBytes = CryptoJS.AES.decrypt(decodeURIComponent(id), AESKey);
        // console.log(decryptedBytes,'decryptedBytes')
        // let  decryptedId= JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8)).id;
        whereClause.id = decreptedId
      }
      let condition = {
        where: {
          ...whereClause,
          // user_id: req.body.loginedUserid.id
        },
        include: [
          // {
          //   model:db.agencyDetailModel4,
          //   // on: {
          //   //   col1: sequelize.where(sequelize.col("agency_detail.state_id"), "=", sequelize.col("lifting_seed_details.spa_state_code")),

          //   // },
          //   attributes:[],
          //   required:true,
          //   include:[
          //     {
          //       model:db.userModel,
          //       // on: {
          //       //   col1: sequelize.where(sequelize.col("lifting_seed_details.spa_code"), "=", sequelize.col("agency_detail->user.spa_code")),
          //       //   col2: sequelize.where(sequelize.col("agency_detail.state_id"), "=", sequelize.col("lifting_seed_details.spa_state_code")),

          //       // },
          //       required:true,
          //       attributes:[]
          //     }
          //   ],
          //   raw:true
          // },
        ],
        attributes: [
          'lifting_bill_no', 'spa_code', 'spa_state_code', 'user_id', 'payment_method_no'
          //   'package_data'
        ],
        raw: true,
      }



      let data = await db.liftingSeedDetailsModel.findAll(condition)
      let liftingbspcData = await db.liftingSeedDetailsModel.findAll({
        where: {
          user_id: data[0].user_id,
          id: decreptedId
        },
        include: [
          {
            as: 'agencyData',
            model: db.agencyDetailModel5,
            include: [
              {
                model: db.stateModel,
                attributes: []
              },
              {
                model: db.stateModel,
                attributes: []
              },
              {
                model: db.districtModel,
                attributes: []
              },
            ],
            where: {
              user_id: data[0].user_id
            },
            attributes: []
          },

        ],
        attributes: [
          [db.Sequelize.col("agencyData.agency_name"), 'agency_name'],
          [db.Sequelize.col("agencyData.address"), 'address'],
          [db.Sequelize.col("agencyData.contact_person_mobile"), 'contact_person_mobile'],
          [sequelize.col('agencyData->m_state.state_name'), 'state_name'],
          [sequelize.col('agencyData->m_district.district_name'), 'district_name'],

        ],
        raw: true
      })
      let spaDetails = await db.liftingSeedDetailsModel.findAll({
        where: {
          id: decreptedId
        },
        include: [
          {
            model: db.agencyDetailModel4,
            // as:'agencyDetailModel4'
            where: {
              state_id: data[0].spa_state_code
            },
            include: [{
              model: db.userModel,
              where: {
                spa_code: data[0].spa_code
              },
              attributes: []
            }],

            attributes: []
          }
        ],
        attributes: [
          [db.Sequelize.col("agency_detail.agency_name"), 'agency_name'],
          [db.Sequelize.col("agency_detail.address"), 'address'],
          [db.Sequelize.col("agency_detail.contact_person_mobile"), 'contact_person_mobile'],
        ],
        raw: true
      })

      // -----get lifting---data----//
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          user_id: req.body.loginedUserid.id
        }
      }
      // let { id } = req.body;
      let datas
      if (id) {
        datas = await db.liftingSeedDetailsModel.findAll({
          where: {
            id: decreptedId
          },
          raw: true,
          attributes: [
            'year', 'season', 'variety_code', 'variety_line_code', 'crop_code', 'user_id'
          ]
        })
      }
      let whereClause3 = {}
      if (datas && datas[0] && datas[0].year) {
        whereClause3.year = datas[0].year
      }
      if (datas && datas[0] && datas[0].season) {
        whereClause3.season = datas[0].season
      }
      if (datas && datas[0] && datas[0].variety_code) {
        whereClause3.variety_code = datas[0].variety_code
      }
      if (datas && datas[0] && datas[0].variety_line_code) {
        whereClause3.variety_line_code = datas[0].variety_line_code
      }

      if (datas && datas[0] && datas[0].crop_code) {
        whereClause3.crop_code = datas[0].crop_code
      }
      if (datas && datas[0] && datas[0].user_id) {
        whereClause3.user_id = datas[0].user_id
      }

      let condition3 = {
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
          // model:db.liftingLotNumberModel,
          // attributes:['id','lot_no','lifting_details_id'],
          // // include:[
          // // {
          // // model:db.liftingTagNumberModel,
          // // attributes:['id','tag_no','tag_size']
          // // }
          // // ]
          // },
          // {
          // model:db.liftingChargesModel,
          // attributes:['id','additional_charges_id','gst','after_apply_gst','total_amount']
          // }
        ],
        attributes: ["*"],
        nest: true,
        raw: true,
        where: {
          // ...userId,
          // user_id:data
          ...whereClause3
        },
      }


      let dataList = await db.liftingSeedDetailsModel.findAll(condition3);
      let whereClause4 = {}
      if (decreptedId) {
        whereClause4.lifting_details_id = decreptedId
      }

      let condition4 = {
        attributes: ["*"],
        nest: true,
        raw: true,
        where: {
          ...whereClause4
          // ...userId
        },
      }
      // if (req.body) {
      //   if (req.body.lifting_details_id) {
      //     condition.where.lifting_details_id = req.body.lifting_details_id
      //   }
      // }

      let liftingCharges = await db.liftingChargesModel.findAll(condition4);


      let filterData = {
        data,
        liftingbspcData,
        spaDetails,
        dataList,
        liftingCharges
      }

      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, filterData)
      } else {
        return response(res, "Data Not Found", 200, {})
      }
    }
    catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500, error)
    }
  }
  static getCommnetsListData = async (req, res) => {
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
  static getGenerateInvoiceData = async (req, res) => {
    try {

      let returnResponse = {}

      state_code: this.state_code ? this.state_code : ''
      const { year, season, crop_code, variety_code, variety_line_code, indenter_id, state_code, spa_code } = req.body.search;
      let whereClause = {};
      if (variety_line_code) {
        whereClause.variety_line_code = variety_line_code
      }
      if (state_code) {
        whereClause.state_code = state_code
      }
      if (indenter_id) {
        whereClause.indenter_id = indenter_id
      }
      if (spa_code) {
        whereClause.spa_code = spa_code
      }
      let condition = {
        where: {
          year: year,
          season: season,
          crop_code: crop_code,
          // variety_code:variety_code
        },
        include: [
          {
            model: varietyModel,
            attributes: []
          }
        ],
        attributes: [
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [sequelize.col('m_crop_variety.variety_code'), 'variety_code'],
        ]
        // include:[
        //   {
        //     model:db.receiptGenerateModel,
        //     include:[
        //       {
        //         model:db.receiptGenerateBagModel,
        //         attributes:[]
        //       }
        //     ],
        //     attributes:[]
        //   },

        // ]
      }
      let condition1 = {
        where: {
          year: year,
          season: season,
          crop_code: crop_code,
          variety_code: variety_code,
          bspc_id: req.body.loginedUserid.id,
          ...whereClause,
        },
        include: [
          {
            model: varietyModel,
            attributes: []
          },
          {
            model: db.receiptGenerateModel,
            required: true,
            as: 'receiptgenerate',
            attributes: [],
            include: [
              {
                model: db.receiptGenerateBagModel,
                as: 'receiptgeneratebags',
                attributes: [],
              }
            ]
            // attributes:[]
          },
        ],

        attributes: [
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [sequelize.col('m_crop_variety.variety_code'), 'variety_code'],
          [sequelize.col('receiptgenerate.id'), 'id'],
          [sequelize.col('receipt_requests.id'), 'receipt_requestsid'],
          [sequelize.col('receiptgenerate.grand_total'), 'grand_total'],
          [sequelize.col('receiptgenerate->receiptgeneratebags.receipt_generate_id'), 'receipt_generate_id'],
          [sequelize.col('receiptgenerate->receiptgeneratebags.number_of_bag'), 'number_of_bag'],
          [sequelize.col('receiptgenerate->receiptgeneratebags.bag_price'), 'bag_price'],
          [sequelize.col('receiptgenerate->receiptgeneratebags.bag_size'), 'bag_size'],
          [sequelize.col('receiptgenerate->receiptgeneratebags.total_bag_price'), 'total_bag_price'],
          [sequelize.col('receipt_requests.payment_method'), 'payment_method'],
          [sequelize.col('receipt_requests.amount'), 'amount'],
          // [sequelize.col('receiptgenerate.variety_code'), 'variety_code'],
          // [sequelize.col('receiptgenerate.variety_line_code'), 'variety_line_code'],
        ]

      }



      let dataList = await db.allocationToIndentor.findAll(condition);
      let receiptData = await db.receiptRequest.findAll(condition1);
      // returnResponse = dataList;
      return response(res, status.DATA_AVAILABLE, 200, receiptData)
    } catch (error) {
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 500, []);
    }
  }

  static getTagDetails = async (req, res) => {
    try {
      // Extract tag_no from the request body
      const { tag_no } = req.body;

      // Check if tag_no is provided
      if (!tag_no) {
        return response(res, status.INVALID_REQUEST, 400, { message: 'Tag number is required' });
      }

      // Define the condition to fetch data by tag_no
      let condition = {
        where: {
          tag_no: tag_no
        },
        include: [
          {
            model: db.seedTagDetails, // seed_tag_details table
            required: false,
            attributes: [
              'year', 
              'pure_seed',
              'inert_matter',
              'lot_no',
              'stack_no',
              'class_of_seed',
              'is_status',
              'no_of_bags',
              'lot_qty'
            ],
            include: [
              {
                model: db.stlReportStatusModel,
                required: true, // Ensure only matching records are fetched
                attributes: ['normal_seeding','date_of_test'],
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
                model: db.varietyModel,
                attributes: ['variety_code', 'variety_name']
              }, 
              {
                model: db.varietyLinesModel, // m_variety_lines table
                attributes: ['line_variety_code', 'line_variety_name']
              },
              {
                model: db.cropModel, // cropModel
                attributes: ['crop_code', 'crop_name'],
              },
              {
                model: db.seasonModel, // m_seasons table
                attributes: ['season_code', 'season']
              },
              {
                model: db.userModel, // user associated with seed_tag_details
                attributes: ['id', 'name', 'username'],
                include: [
                  {
                    model: db.agencyDetailModel, // agency_details table
                    attributes: ['agency_name', 'contact_person_name'],
                    include: [

                      {
                        model: db.stateModel, // stateModel
                        attributes: ['state_code', 'state_name']
                      },
                      {
                        model: db.districtModel, // districtModel
                        attributes: ['district_code', 'district_name']
                      },
                      {
                        model: db.designationModel,
                        attributes: ['name']
                      },
                    ]
                  }
                ]
              }
            ]
          },
        ],
        attributes: [
          'bag_size',
          'tag_no',
        ],
        nest: true,
        raw: true
      };

      // Fetch data with the specified condition
      let dataList = await db.seedTagsModel.findAll(condition);
      return response(res, status.DATA_AVAILABLE, 200, dataList);
    } catch (error) {
      console.error('Error fetching tag details:', error);
      return response(res, status.UNEXPECTED_ERROR, 500, []);
    }
  }

};





module.exports = ProcessedSeedDetails


