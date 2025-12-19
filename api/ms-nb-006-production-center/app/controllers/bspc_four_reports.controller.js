require('dotenv').config()
const response = require('../_helpers/response')
const status = require('../_helpers/status.conf')
const db = require("../models");
const { varietyModel } = db
const sequelize = require('sequelize');
const Op = require('sequelize').Op;
const bspcFourReportHelper = require('../_helpers/bspc-four-report-helper');

// const CallExternalAPI = require("../_helpers/call-external-api");


class BspcFourReport {

  static getDataOfBspFourOld = async (req, res) => {
    try {
      // new code 
      function processData(bsp2, bsp3, seed_proceesing_register, intake) {
        return bsp2.map((record) => {
          let filterCondition = (item) =>
            // item.year === record.year &&
            // item.season === record.season &&
            // item.crop_code === record.crop_code &&
            item.variety_code === record.variety_code &&
            item.variety_line_code === record.variety_line_code
          // &&
          // item.user_id === record.user_id;
          let matchSeedProcessing = seed_proceesing_register.find(filterCondition);
          if (matchSeedProcessing) {
            return {
              ...record,
              letest: "spr",
              total_processed_qty: matchSeedProcessing.total_processed_qty,
            };
          }
          let intakeData = intake.find(filterCondition);
          if (intakeData) {
            return {
              ...record,
              letest: "intake",
              total_processed_qty: intakeData.raw_seed_produced,
            };
          }
          let matchBsp3 = bsp3.find(filterCondition);
          if (matchBsp3) {
            return {
              ...record,
              letest: "bsp3",
              total_processed_qty: matchBsp3.estimated_production,
              // bsp_3_qty: matchSeedProcessing.total_processed_qty
            };
          }
          return {
            ...record,
            letest: "bsp2",
            total_processed_qty: record.expected_production
          };
        });
      }

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
        },
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

      // case:1 check all data from  bsp_proforma_2 table
      let isBsp2DataExitCheck = await db.bspPerformaBspTwo.findAll({
        include: [
          {
            model: db.varietyModel,
            attributes: []
          },
          {
            model: db.mVarietyLinesModel,
            attributes: []
          }
        ],
        attributes: [
          [db.sequelize.col("bsp_proforma_2s.variety_line_code"), "variety_code_line"],
          [db.sequelize.col("bsp_proforma_2s.variety_code"), "variety_code"],
          [db.sequelize.col('m_variety_line.line_variety_name'), 'line_variety_name'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          // [sequelize.col('bsp_proforma_2s.lot_no'), 'lot_no'],
          [sequelize.literal('SUM(bsp_proforma_2s.expected_production)'), 'expected_production'],
        ],
        group: [
          [db.sequelize.col("bsp_proforma_2s.variety_line_code"), "variety_code_line"],
          [db.sequelize.col("bsp_proforma_2s.variety_code"), "variety_code"],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [db.sequelize.col('m_variety_line.line_variety_name'), 'line_variety_name'],
          // [sequelize.col('seed_processing_register.lot_no'), 'lot_no'],
        ],
        where: {
          year: req.body.search.year,
          season: req.body.search.season,
          crop_code: req.body.search.crop_code,
          user_id: req.body && req.body.loginedUserid && req.body.loginedUserid.id ? req.body.loginedUserid.id : null
        },
        raw: true
      })

      // case:1 check all data from  bsp_proforma_2 table
      let isBsp3DataExitCheck = await db.bspPerformaBspThree.findAll({
        include: [
          {
            required: true,
            model: db.bspPerformaBspTwo,
            attributes: [],
            where: {
              user_id: req.body && req.body.loginedUserid && req.body.loginedUserid.id ? req.body.loginedUserid.id : null,
              is_inspected: true,
              id: [sequelize.col('bsp_proforma_3s.bsp_proforma_2_id')]
            },
            include: [
              {
                model: db.varietyModel,
                attributes: []
              },
              {
                model: db.mVarietyLinesModel,
                attributes: []
              }
            ]
          },

        ],
        attributes: [
          [db.sequelize.col("bsp_proforma_3s.variety_line_code"), "variety_code_line"],
          [db.sequelize.col("bsp_proforma_3s.variety_code"), "variety_code"],
          [db.sequelize.col('bsp_proforma_2->m_variety_line.line_variety_name'), 'line_variety_name'],
          [sequelize.col('bsp_proforma_2->m_crop_variety.variety_name'), 'variety_name'],
          // [sequelize.col('bsp_proforma_2s.lot_no'), 'lot_no'],
          [sequelize.literal('SUM(bsp_proforma_3s.estimated_production)'), 'estimated_production'],
        ],
        group: [
          [db.sequelize.col("bsp_proforma_3s.variety_line_code"), "variety_code_line"],
          [db.sequelize.col("bsp_proforma_3s.variety_code"), "variety_code"],
          [sequelize.col('bsp_proforma_2->m_crop_variety.variety_name'), 'variety_name'],
          [db.sequelize.col('bsp_proforma_2->m_variety_line.line_variety_name'), 'line_variety_name'],
          // [sequelize.col('seed_processing_register.lot_no'), 'lot_no'],
        ],
        where: {
          year: req.body.search.year,
          season: req.body.search.season,
          crop_code: req.body.search.crop_code,
          report: {
            [Op.notILike]: "Re-monitoring after 15 days"
          }
        },
        raw: true
      })
      // console.log('==========this.query');
      // return;
      // new code
      let intakeDataExitCheck = await db.investHarvestingModel.findAll({
        include: [
          {
            model: db.varietyModel,
            attributes: []
          },
          {
            model: db.mVarietyLinesModel,
            attributes: []
          }
        ],
        attributes: [
          [db.sequelize.col("invest_harvesting.variety_line_code"), "variety_code_line"],
          [db.sequelize.col("invest_harvesting.variety_code"), "variety_code"],
          [db.sequelize.col('m_variety_line.line_variety_name'), 'line_variety_name'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [sequelize.literal('SUM(invest_harvesting.raw_seed_produced)'), 'raw_seed_produced'],
        ],

        group: [
          [db.sequelize.col("invest_harvesting.variety_line_code"), "variety_code_line"],
          [db.sequelize.col("invest_harvesting.variety_code"), "variety_code"],
          [db.sequelize.col('m_variety_line.line_variety_name'), 'line_variety_name'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
        ],
        where: {
          year: req.body.search.year,
          season: req.body.search.season,
          crop_code: req.body.search.crop_code,
          user_id: req.body.loginedUserid.id,
          check_status: {
            [Op.not]: null
          }
        },
        raw: true
      })

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
          [db.sequelize.col("seed_processing_register.variety_code_line"), "variety_code_line"],
          [db.sequelize.col("seed_processing_register.variety_code"), "variety_code"],
          [db.sequelize.col('m_variety_line.line_variety_name'), 'line_variety_name'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          // [sequelize.col('seed_processing_register.is_bsp_4_submitted'), 'is_bsp_4_submitted'],
        ],
        group: [
          [db.sequelize.col("seed_processing_register.variety_code_line"), "variety_code_line"],
          [db.sequelize.col("seed_processing_register.variety_code"), "variety_code"],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [db.sequelize.col('m_variety_line.line_variety_name'), 'line_variety_name'],
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
          [db.sequelize.col("seed_processing_register.variety_code_line"), "variety_code_line"],
          [db.sequelize.col("seed_processing_register.variety_code"), "variety_code"],
          [db.sequelize.col('m_variety_line.line_variety_name'), 'line_variety_name'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [sequelize.col('seed_processing_register.lot_no'), 'lot_no'],
          [sequelize.literal('SUM(seed_processing_register.total_processed_qty)'), 'total_processed_qty'],
        ],
        group: [
          [db.sequelize.col("seed_processing_register.variety_code_line"), "variety_code_line"],
          [db.sequelize.col("seed_processing_register.variety_code"), "variety_code"],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [db.sequelize.col('m_variety_line.line_variety_name'), 'line_variety_name'],
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
          [db.sequelize.col("seed_processing_register.variety_code_line"), "variety_code_line"],
          [db.sequelize.col("seed_processing_register.variety_code"), "variety_code"],
          [db.sequelize.col('m_variety_line.line_variety_name'), 'line_variety_name'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [sequelize.col('seed_processing_register.lot_no'), 'lot_no'],
          [sequelize.literal('SUM(seed_processing_register.recover_qty)'), 'recover_qty'],
        ],
        group: [
          [db.sequelize.col("seed_processing_register.variety_code_line"), "variety_code_line"],
          [db.sequelize.col("seed_processing_register.variety_code"), "variety_code"],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [db.sequelize.col('m_variety_line.line_variety_name'), 'line_variety_name'],
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
          [db.sequelize.col("seed_processing_register.variety_code_line"), "variety_code_line"],
          [db.sequelize.col("seed_processing_register.variety_code"), "variety_code"],
          [db.sequelize.col('m_variety_line.line_variety_name'), 'line_variety_name'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [sequelize.literal('SUM(seed_processing_register.total_processed_qty)'), 'total_processed_qty'],
        ],
        group: [
          [db.sequelize.col("seed_processing_register.variety_code_line"), "variety_code_line"],
          [db.sequelize.col("seed_processing_register.variety_code"), "variety_code"],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [db.sequelize.col('m_variety_line.line_variety_name'), 'line_variety_name']
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
          [db.sequelize.col("seed_processing_register.variety_code_line"), "variety_code_line"],
          [db.sequelize.col("seed_processing_register.variety_code"), "variety_code"],
          [db.sequelize.col('m_variety_line.line_variety_name'), 'line_variety_name'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [sequelize.literal('SUM(seed_processing_register.recover_qty)'), 'recover_qty'],
        ],
        group: [
          [db.sequelize.col("seed_processing_register.variety_code_line"), "variety_code_line"],
          [db.sequelize.col("seed_processing_register.variety_code"), "variety_code"],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [db.sequelize.col('m_variety_line.line_variety_name'), 'line_variety_name']
        ],
        raw: true,
      }
      const condition3 = {
        where: {
          [Op.and]: filterData2 ? filterData2 : [],
          user_id: req.body.loginedUserid.id
        },


        attributes: [
          [db.sequelize.col("availability_of_breeder_seed.variety_line_code"), "variety_code_line"],
          [db.sequelize.col("availability_of_breeder_seed.variety_code"), "variety_code"],
          [db.sequelize.col("availability_of_breeder_seed.save_as_draft"), "save_as_draft"],
          [db.sequelize.col("availability_of_breeder_seed.allocate_qty"), "allocate_qty"],
          [db.sequelize.col("availability_of_breeder_seed.is_final_submit"), "is_final_submit"],
          [db.sequelize.col("availability_of_breeder_seed.id"), "avialability_id"],
          // new code 
          [db.sequelize.col("availability_of_breeder_seed.bsp2_qty"), "bsp2_qty"],
          [db.sequelize.col("availability_of_breeder_seed.bsp2_per_qty"), "bsp2_per_qty"],
          [db.sequelize.col("availability_of_breeder_seed.bsp3_qty"), "bsp3_qty"],
          [db.sequelize.col("availability_of_breeder_seed.bsp3_per_qty"), "bsp3_per_qty"],
          [db.sequelize.col("availability_of_breeder_seed.intake_vrfictn_qty"), "intake_vrfictn_qty"],
          [db.sequelize.col("availability_of_breeder_seed.intake_vrfictn__pr_qty"), "intake_vrfictn__pr_qty"],
          [db.sequelize.col("availability_of_breeder_seed.check_status"), "check_status"],
        ],

        raw: true,
      }

      // condition.order=[[sequelize.col('m_crop_variety.variety_name'),'ASC']]
      let seedProcess = await db.seedProcessingRegister.findAll(condition)
      let result2 = processData(isBsp2DataExitCheck, isBsp3DataExitCheck, seedProcess, intakeDataExitCheck);
      if (result2 && result2.length > 0) {
        result2.forEach((el) => {
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
            //   [db.sequelize.fn("Distinct", db.sequelize.col("generate_sample_forwarding_letters.variety_code")), "variety_code"],

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
            //   [db.sequelize.fn("Distinct", db.sequelize.col("generate_sample_forwarding_letters.variety_code")), "variety_code"],

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
            //   [db.sequelize.fn("Distinct", db.sequelize.col("generate_sample_forwarding_letters.variety_code")), "variety_code"],

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
            //   [db.sequelize.fn("Distinct", db.sequelize.col("generate_sample_forwarding_letters.variety_code")), "variety_code"],

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
              //  || item.status == 're-sample'
              if ((item.status == 'discard')) {
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
              seedProcessBreederSeedProucedFinal.push({
                variety_code_line: ele && ele.variety_code_line ? ele.variety_code_line : null,
                variety_code: ele && ele.variety_code ? ele.variety_code : null,
                line_variety_name: ele && ele.line_variety_name ? ele.line_variety_name : null,
                variety_name: ele && ele.variety_name ? ele.variety_name : null,
                total_processed_qty: ele && ele.total_processed_qty ? ele.total_processed_qty : null
              })
            }
          })
          seedProcessBreederSeedProucedtotalFinalArray.forEach(ele => {
            // console.log('ele.lot_no===', ele.lot_no);
            if (item.lot_no == ele.lot_no) {
              // || item.status == 're-sample'
              if ((item.status == 'discard')) {
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
              seedProcessBreederSeedProucedtotalFinal.push({
                variety_code_line: ele && ele.variety_code_line ? ele.variety_code_line : null,
                variety_code: ele && ele.variety_code ? ele.variety_code : null,
                line_variety_name: ele && ele.line_variety_name ? ele.line_variety_name : null,
                variety_name: ele && ele.variety_name ? ele.variety_name : null,
                recover_qty: ele && ele.recover_qty ? ele.recover_qty : null
              })
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
          [Op.and]: [
            {
              status: {
                [Op.eq]: 'discard'
              }
            },
            // {
            //   status: {
            //     [Op.eq]: 're-sample'
            //   }
            // }
          ]
        },
        raw: true,
        attributes: [
          [db.sequelize.col("seed_processing_register.variety_code_line"), "variety_code_line"],
          [db.sequelize.col("seed_processing_register.variety_code"), "variety_code"],
          [sequelize.literal('SUM(seed_processing_register.total_processed_qty)'), 'total_processed_qty']
        ],
        group: [
          [db.sequelize.col("seed_processing_register.variety_code_line"), "variety_code_line"],
          [db.sequelize.col("seed_processing_register.variety_code"), "variety_code"],
        ],
      })

      let substarctFinalArray = [];
      if (checkStatus && checkStatus.length) {
        substarctFinalArray = seedProcessBreederSeedProucedFinal.map(item1 => {
          const matchingItem = checkStatus.find(item2 =>
            item1.variety_code === item2.variety_code &&
            item1.variety_code_line === item1.variety_code_line
          );
          if (item1.total_processed_qty) {
            if (matchingItem && matchingItem.total_processed_qty) {
              return {
                ...item1,
                total_processed_qty: item1.total_processed_qty - matchingItem.total_processed_qty
              };
            } else {
              return {
                ...item1,
                total_processed_qty: item1.total_processed_qty
              };
            }

          } else {
            return {
              ...item1,
              total_processed_qty: item1.total_processed_qty
            };
          }
          // Return original item if no match found
        });
      } else {
        substarctFinalArray = seedProcessBreederSeedProucedFinal
      }

      // **Run function and get the final output**
      let result = processData(isBsp2DataExitCheck, isBsp3DataExitCheck, substarctFinalArray, intakeDataExitCheck);

      // Merge the data based on conditions
      let mergedData = isBsp2DataExitCheck.map(bsp2 => {
        let intakeMatch = intakeDataExitCheck.find(intakItem => intakItem.variety_code === bsp2.variety_code);
        let bsp3Match = isBsp3DataExitCheck.find(bsp3 => bsp3.variety_code === bsp2.variety_code);
        let bsp4Match = result.find(bsp4Item => bsp4Item.variety_code === bsp2.variety_code);

        return {
          variety_code_line: bsp2.variety_code_line,
          letest: bsp4Match.letest,
          variety_code: bsp2.variety_code,
          line_variety_name: bsp2.line_variety_name,
          variety_name: bsp2.variety_name,
          expected_production: bsp2.expected_production !== undefined ? bsp2.expected_production : null,
          estimated_production: bsp3Match ? bsp3Match.estimated_production : null,
          total_processed_qty: bsp4Match ? bsp4Match.total_processed_qty : null,
          intake_qnt: intakeMatch ? intakeMatch.raw_seed_produced : null
        };
      });
      console.log('result2===', result2);
      console.log('mergedData', mergedData);
      let data = {
        seedProcess: mergedData,
        seedProcessBreederSeedProuced: mergedData,//seedProcessBreederSeedProucedFinal,
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

  // main function 
  static getDataOfBspFourOptimize = async (req, res) => {
    try {
      const { search } = req.body;
      const userId = req.body.loginedUserid.id;
      let varietyData = [];
      let filterData2 = [];
      let isFinalSubmittedCheck = {};
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

      // parallel fire with Promise.all

      let [
        isSubmitedCheck,
        isCheckCarryOverExist,
        stlReportStatus,
        isBsp2DataExitCheck,
        isBsp3DataExitCheck,
        intakeDataExitCheck,
      ] = await Promise.all([
        bspcFourReportHelper.getIsSubmittedCheck(search, userId),
        bspcFourReportHelper.getCarryOverExistCheck(search, userId),
        bspcFourReportHelper.getStlReportStatus(search, userId),
        bspcFourReportHelper.getBsp2DataCheck(search, userId),
        bspcFourReportHelper.getBsp3DataCheck(search, userId),
        bspcFourReportHelper.getIntakeDataCheck(search, userId),
      ]);

      if (isSubmitedCheck && isSubmitedCheck.length) {
        isFinalSubmittedCheck = { is_bsp_4_submitted: 1 };
      }

      let seedProcess = await bspcFourReportHelper.getSeedProcess(filterData2, userId);

      let result2 = bspcFourReportHelper.processData(isBsp2DataExitCheck, isBsp3DataExitCheck, seedProcess, intakeDataExitCheck);

      if (result2 && result2.length > 0) {
        result2.forEach((el) => {
          varietyData.push(el && el.variety_code ? el.variety_code : '')
        })
      }

      let seedProcessBreederSeedProuced = await bspcFourReportHelper.getBreederSeedProduced(filterData2, userId, isFinalSubmittedCheck);
      let seedProcessBreederSeedProucedtotal = await bspcFourReportHelper.getBreederSeedProducedTotal(filterData2, userId, isFinalSubmittedCheck);
      let availabilityOfBreederSeed = await bspcFourReportHelper.getAvailabilityOfBreederSeed(filterData2, userId);

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
                },
                attributes: []
              },
            ],
            raw: true,
            attributes: [
              [sequelize.col('indent_of_breederseed_direct.variety_code'), 'variety_code'],
              [sequelize.literal('SUM(indent_of_breederseed_direct.quantity)'), 'quantity'],

            ],
            group: [
              [sequelize.col('indent_of_breederseed_direct.variety_code'), 'variety_code'],
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
            },

            attributes: [
              [sequelize.col('stl_report_status.variety_code'), 'variety_code'],
              [sequelize.col('stl_report_status.variety_code_line'), 'variety_line_code'],
              [sequelize.col('seed_processing_register.variety_code_line'), 'variety_code_line'],
              [sequelize.literal('SUM(seed_processing_register.total_processed_qty)'), 'total_processed_qty'],
            ],
            group: [
              [sequelize.col('stl_report_status.variety_code'), 'variety_code'],
              [sequelize.col('seed_processing_register.variety_code_line'), 'variety_code_line'],
              [sequelize.col('stl_report_status.variety_code_line'), 'variety_line_code'],
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
            },
            attributes: [
              [sequelize.col('stl_report_status.variety_code'), 'variety_code'],
              [sequelize.col('stl_report_status.variety_code_line'), 'variety_line_code'],
              [sequelize.col('seed_processing_register.variety_code_line'), 'variety_code_line'],
              [sequelize.literal('SUM(seed_processing_register.recover_qty)'), 'recover_qty'],

            ],
            group: [
              [sequelize.col('stl_report_status.variety_code'), 'variety_code'],
              [sequelize.col('seed_processing_register.variety_code_line'), 'variety_code_line'],
              [sequelize.col('stl_report_status.variety_code_line'), 'variety_line_code'],
            ]
          }
        )
        generateSampleForwardingLetters3 = await db.seedProcessingRegister.findAll(
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
              action: 1,
              get_carry_over: 2,
              bspc_id: req.body.loginedUserid.id
            },
            attributes: [
              [sequelize.col('stl_report_status.variety_code'), 'variety_code'],
              [sequelize.col('stl_report_status.variety_code_line'), 'variety_line_code'],
              [sequelize.col('seed_processing_register.variety_code_line'), 'variety_code_line'],
              [sequelize.literal('SUM(seed_processing_register.total_processed_qty)'), 'total_processed_qty'],
            ],
            group: [
              [sequelize.col('stl_report_status.variety_code'), 'variety_code'],
              [sequelize.col('seed_processing_register.variety_code_line'), 'variety_code_line'],
              [sequelize.col('stl_report_status.variety_code_line'), 'variety_line_code'],
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
            },
            attributes: [
              [sequelize.col('stl_report_status.variety_code'), 'variety_code'],
              [sequelize.col('stl_report_status.variety_code_line'), 'variety_line_code'],
              [sequelize.col('seed_processing_register.variety_code_line'), 'variety_code_line'],
              [sequelize.literal('SUM(seed_processing_register.recover_qty)'), 'recover_qty'],

            ],
            group: [
              [sequelize.col('stl_report_status.variety_code'), 'variety_code'],
              [sequelize.col('seed_processing_register.variety_code_line'), 'variety_code_line'],
              [sequelize.col('stl_report_status.variety_code_line'), 'variety_line_code'],
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
              if ((item.status == 'discard')) {
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
              seedProcessBreederSeedProucedFinal.push({
                variety_code_line: ele && ele.variety_code_line ? ele.variety_code_line : null,
                variety_code: ele && ele.variety_code ? ele.variety_code : null,
                line_variety_name: ele && ele.line_variety_name ? ele.line_variety_name : null,
                variety_name: ele && ele.variety_name ? ele.variety_name : null,
                total_processed_qty: ele && ele.total_processed_qty ? ele.total_processed_qty : null
              })
            }
          })
          seedProcessBreederSeedProucedtotalFinalArray.forEach(ele => {
            // console.log('ele.lot_no===', ele.lot_no);
            if (item.lot_no == ele.lot_no) {
              // || item.status == 're-sample'
              if ((item.status == 'discard')) {
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
              seedProcessBreederSeedProucedtotalFinal.push({
                variety_code_line: ele && ele.variety_code_line ? ele.variety_code_line : null,
                variety_code: ele && ele.variety_code ? ele.variety_code : null,
                line_variety_name: ele && ele.line_variety_name ? ele.line_variety_name : null,
                variety_name: ele && ele.variety_name ? ele.variety_name : null,
                recover_qty: ele && ele.recover_qty ? ele.recover_qty : null
              })
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
          [Op.and]: [
            {
              status: {
                [Op.eq]: 'discard'
              }
            },
          ]
        },
        raw: true,
        attributes: [
          [db.sequelize.col("seed_processing_register.variety_code_line"), "variety_code_line"],
          [db.sequelize.col("seed_processing_register.variety_code"), "variety_code"],
          [sequelize.literal('SUM(seed_processing_register.total_processed_qty)'), 'total_processed_qty']
        ],
        group: [
          [db.sequelize.col("seed_processing_register.variety_code_line"), "variety_code_line"],
          [db.sequelize.col("seed_processing_register.variety_code"), "variety_code"],
        ],
      })

      let substarctFinalArray = [];
      if (checkStatus && checkStatus.length) {
        substarctFinalArray = seedProcessBreederSeedProucedFinal.map(item1 => {
          const matchingItem = checkStatus.find(item2 =>
            item1.variety_code === item2.variety_code &&
            item1.variety_code_line === item1.variety_code_line
          );
          if (item1.total_processed_qty) {
            if (matchingItem && matchingItem.total_processed_qty) {
              return {
                ...item1,
                total_processed_qty: item1.total_processed_qty - matchingItem.total_processed_qty
              };
            } else {
              return {
                ...item1,
                total_processed_qty: item1.total_processed_qty
              };
            }

          } else {
            return {
              ...item1,
              total_processed_qty: item1.total_processed_qty
            };
          }
          // Return original item if no match found
        });
      } else {
        substarctFinalArray = seedProcessBreederSeedProucedFinal
      }

      //Helper function for conditions
      let result = bspcFourReportHelper.processData(isBsp2DataExitCheck, isBsp3DataExitCheck, substarctFinalArray, intakeDataExitCheck);

      // Merge the data based on conditions
      let mergedData = isBsp2DataExitCheck.map(bsp2 => {
        let intakeMatch = intakeDataExitCheck.find(intakItem => intakItem.variety_code === bsp2.variety_code);
        let bsp3Match = isBsp3DataExitCheck.find(bsp3 => bsp3.variety_code === bsp2.variety_code);
        let bsp4Match = result.find(bsp4Item => bsp4Item.variety_code === bsp2.variety_code);
        return {
          variety_code_line: bsp2.variety_code_line,
          letest: bsp4Match.letest,
          variety_code: bsp2.variety_code,
          line_variety_name: bsp2.line_variety_name,
          variety_name: bsp2.variety_name,
          expected_production: bsp2.expected_production !== undefined ? bsp2.expected_production : null,
          estimated_production: bsp3Match ? bsp3Match.estimated_production : null,
          total_processed_qty: bsp4Match ? bsp4Match.total_processed_qty : null,
          intake_qnt: intakeMatch ? intakeMatch.raw_seed_produced : null
        };
      });

      let data = {
        seedProcess: mergedData,
        seedProcessBreederSeedProuced: mergedData,//seedProcessBreederSeedProucedFinal,
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

}

module.exports = BspcFourReport
