require("dotenv").config();
let Validator = require("validatorjs");
const response = require("../_helpers/response");
const status = require("../_helpers/status.conf");
const db = require("../models");
const { gotTestingModel, cropModel, cropVerietyModel, varietLineModel, userModel, commentsModel, gotShowingDetailsModel, districtModel, stateModel, gotMonitoringTeamsModel, gotMonitoringTeamsMemberModel, designationModel, agencyDetailModel, generateSampleSlipsModel } = db;
const sequelize = require("sequelize");
const sequelizer = require("../models/db");
const ConditionCreator = require("../_helpers/condition-creator");
const productiohelper = require("../_helpers/productionhelper");
const { where } = require("../models/db");
const attributes = require("validatorjs/src/attributes");
const crypto = require("crypto");
const https = require("https");
const Op = require("sequelize").Op;
const axios = require('axios').default;
const { QueryTypes } = require('sequelize');

const bspPerestingsBspFiveModel = db.bspPerestingsBspFiveModel;
const replicaModel = db.replicaModel;
const selfPlantObservationModel = db.selfPlantObservationModel;
const offTypeObservationModel = db.offTypeObservationModel;
const summaryObservationModel = db.summaryObservationModel;
const bspProforma5asResponseModel = db.bspProforma5asResponseModel;
const bsp5GotMemberRelationModel = db.bsp5GotMemberRelationModel;

class GotTestingController {

  static getGotSampleReceptionYear = async (req, res) => {
    try {
      let id = req.body.loginedUserid && req.body.loginedUserid.id ? req.body.loginedUserid.id : null;
      let filters = {};
      if (id) {
        filters.bspc_id = id
       }
      const years = await gotTestingModel.findAll({
        attributes: [[sequelize.fn('DISTINCT', sequelize.col('year')), 'year']],
        where: {
          ...filters,
          // status: 'APPROVED'
        },
        order: [['year', 'ASC']],
        raw: true,
      });
      if (!years || years.length === 0) {
        return response(res, 'No data found.', 404);
      }
      return response(res, 'data found successfully.', 200, years);
    } catch (error) {
      console.log('error', error)
      return response(res, status.UNEXPECTED_ERROR, 501, error.message);
    }
  };

  static getGotSamplesowingYear = async (req, res) => {
    try {
      let id = req.body.loginedUserid && req.body.loginedUserid.id ? req.body.loginedUserid.id : null;
      let filters = {};
      if (id) {
        filters.bspc_id = id
       }
      const years = await gotTestingModel.findAll({
        attributes: [[sequelize.fn('DISTINCT', sequelize.col('year')), 'year']],
        where: {
          ...filters,
        status: 'APPROVED'
        },
        order: [['year', 'ASC']],
        raw: true,
      });
      if (!years || years.length === 0) {
        return response(res, 'No data found.', 404);
      }
      return response(res, 'data found successfully.', 200, years);
    } catch (error) {
      console.log('error', error)
      return response(res, status.UNEXPECTED_ERROR, 501, error.message);
    }
  };

  static getGotSampleReceptionSeason = async (req, res) => {
    let filters = {};
    const { year } = req.body;
    try {
      let id = req.body.loginedUserid && req.body.loginedUserid.id ? req.body.loginedUserid.id : null;
      if (id) {
        filters.bspc_id = id;
      }
      if (year) {
        filters.year = year;
      }

      const season = await gotTestingModel.findAll({
        attributes: [[sequelize.fn('DISTINCT', sequelize.col('season')), 'season']],
        where: {
          ...filters,
        },
        order: [['season', 'ASC']],
        raw: true,
      });
      if (!season || season.length === 0) {
        return response(res, 'No data found.', 404);
      }
      return response(res, 'data found successfully.', 200, season);
    } catch (error) {
      console.log('error', error)
      return response(res, status.UNEXPECTED_ERROR, 501, error.message);
    }
  };

  static getGotSampleSowingSeason = async (req, res) => {
    let filters = {};
    const { year } = req.body;
    try {
      let id = req.body.loginedUserid && req.body.loginedUserid.id ? req.body.loginedUserid.id : null;
      if (id) {
        filters.bspc_id = id;
      }
      if (year) {
        filters.year = year;
      }

      const season = await gotTestingModel.findAll({
        attributes: [[sequelize.fn('DISTINCT', sequelize.col('season')), 'season']],
        where: {
          ...filters,
          status: 'APPROVED'
        },
        order: [['season', 'ASC']],
        raw: true,
      });
      if (!season || season.length === 0) {
        return response(res, 'No data found.', 404);
      }
      return response(res, 'data found successfully.', 200, season);
    } catch (error) {
      console.log('error', error)
      return response(res, status.UNEXPECTED_ERROR, 501, error.message);
    }
  };

  static getGotSampleSowingCrop = async (req, res) => {
    let filters = {};
    const { year, season } = req.body;
    try {
      let id = req.body.loginedUserid && req.body.loginedUserid.id ? req.body.loginedUserid.id : null;
      if (id) {
        filters.bspc_id = id;
      }
      if (year) {
        filters.year = year;
      }
      if (season) {
        filters.season = season;
      }
      const crop_code = await gotTestingModel.findAll({
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('got_testing.crop_code')), 'crop_code'],
          [sequelize.col('m_crop.crop_name'), 'crop_name'],
        ],
        where: {
          ...filters,
            status: 'APPROVED'
        },
        include: [
          {
            model: cropModel,
            attributes: [],
            required: true
          }
        ],
        order: [[sequelize.col('m_crop.crop_name'), 'ASC']],
        raw: true,
      });
      if (!crop_code || crop_code.length === 0) {
        return response(res, 'No data found.', 404);
      }
      return response(res, 'data found successfully.', 200, crop_code);
    } catch (error) {
      console.log('error', error)
      return response(res, status.UNEXPECTED_ERROR, 501, error.message);
    }
  };

  static getGotSampleReceptionCrop = async (req, res) => {
    let filters = {};
    const { year, season } = req.body;
    try {
      let id = req.body.loginedUserid && req.body.loginedUserid.id ? req.body.loginedUserid.id : null;
      if (id) {
        filters.bspc_id = id;
      }
      if (year) {
        filters.year = year;
      }
      if (season) {
        filters.season = season;
      }
      const crop_code = await gotTestingModel.findAll({
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('got_testing.crop_code')), 'crop_code'],
          [sequelize.col('m_crop.crop_name'), 'crop_name'],
        ],
        where: {
          ...filters,
        },
        include: [
          {
            model: cropModel,
            attributes: [],
            required: true
          }
        ],
        order: [[sequelize.col('m_crop.crop_name'), 'ASC']],
        raw: true,
      });
      if (!crop_code || crop_code.length === 0) {
        return response(res, 'No data found.', 404);
      }
      return response(res, 'data found successfully.', 200, crop_code);
    } catch (error) {
      console.log('error', error)
      return response(res, status.UNEXPECTED_ERROR, 501, error.message);
    }
  };

  static getGotSampleReceptionConsignment = async (req, res) => {
    let filters = {};
    const { year, season, crop_code } = req.body;
    try {
      let id = req.body.loginedUserid && req.body.loginedUserid.id ? req.body.loginedUserid.id : null;
      if (id) {
        filters.bspc_id = id
      }
      if (year) {
        filters.year = year;
      }
      if (season) {
        filters.season = season;
      }
      if (crop_code) {
        filters.crop_code = crop_code;
      }

      const ConsignmentNumber = await gotTestingModel.findAll({
        attributes: [[sequelize.fn('DISTINCT', sequelize.col('consignment_number')), 'consignment_number']],
        where: {
          ...filters,
        },
        raw: true,
      });
      if (!ConsignmentNumber || ConsignmentNumber.length === 0) {
        return response(res, 'No data found.', 404);
      }
      return response(res, 'data found successfully.', 200, ConsignmentNumber);
    } catch (error) {
      console.log('error', error)
      return response(res, status.UNEXPECTED_ERROR, 501, error.message);
    }
  };

  static getGotSampleReceptionList = async (req, res) => {
    try {
      const { year, season, crop_code, consignment_number } = req.body;
      let id = req.body.loginedUserid && req.body.loginedUserid.id ? req.body.loginedUserid.id : null;
      let filters = {};
      if (id) {
        filters.bspc_id = id;
      }
      if (year) {
        filters.year = year;
      }
      if (season) {
        filters.season = season;
      }
      if (crop_code) {
        filters.crop_code = crop_code;
      }
      if (consignment_number) {
        filters.consignment_number = consignment_number;
      }

      const results = await gotTestingModel.findAll({
        attributes: [
          'id', 'year', 'season', 'crop_code', 'variety_code', 'bspc_id', 'test_number', 'unique_code', 'status', 'reason_id',
          [sequelize.col('m_crop.crop_name'), 'crop_name'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [sequelize.col('agency_detail.agency_name'), 'bspc_name'],
          [sequelize.col('comment.comment'), 'comment'],
          [sequelize.col('m_crop_variety.m_variety_line.line_variety_code'), 'line_variety_code'],
          [sequelize.col('m_crop_variety.m_variety_line.line_variety_name'), 'line_variety_name'],
          [sequelize.col('generate_sample_slip.class_of_seed'), 'class_of_seed'],
        ],
        where: {
          ...filters,
        },
        include: [
          {
            model: cropModel,
            attributes: [],
            required: false,
          },
          {
            model: cropVerietyModel,
            attributes: [],
            required: true,
            include: [
              {
                model: varietLineModel,
                as: 'm_variety_line',
                attributes: [],
                required: false,
              },
            ],
          },
          {
            model: agencyDetailModel,
            attributes: [],
            required: true,
          },
          {
            model: commentsModel,
            attributes: [],
            required: false,
          },
          {
            model: generateSampleSlipsModel,
            attributes: [],
            required: false,
          },
        ],
        raw: true,
        order: [['id', 'ASC']],
      });

      const groupedResults = results.reduce((acc, row) => {
        const existingEntry = acc.find(entry => entry.id === row.id);
        const lineVariety = row.line_variety_code ? {
          line_variety_code: row.line_variety_code,
          line_variety_name: row.line_variety_name,
        } : null;

        if (existingEntry) {
          if (lineVariety) {
            existingEntry.line_variety.push(lineVariety);
          }
        } else {
          acc.push({
            id: row.id,
            year: row.year,
            season: row.season,
            crop_code: row.crop_code,
            variety_code: row.variety_code,
            bspc_id: row.bspc_id,
            unique_code: row.unique_code,
            test_number: row.test_number,
            status: row.status,
            reason_id: row.reason_id,
            crop_name: row.crop_name,
            variety_name: row.variety_name,
            bspc_name: row.bspc_name,
            comment: row.comment,
            class_of_seed: row.class_of_seed,
            line_variety: lineVariety ? [lineVariety] : [],
          });
        }
        return acc;
      }, []);

      if (!groupedResults || groupedResults.length === 0) {
        return response(res, 'No data found.', 404);
      }
      return response(res, 'data found successfully.', 200, groupedResults);
    } catch (error) {
      console.log('error', error)
      return response(res, status.UNEXPECTED_ERROR, 501, error.message);
    }
  };

  static getGotSampleReceptionReason = async (req, res) => {
    try {
      const reasons = await commentsModel.findAll({
        attributes: ['id', 'comment'],
        where: {
          type: 'GOT_MONITORING_TEAM'
        },
        raw: true,
      });
      if (!reasons || reasons.length === 0) {
        return response(res, 'No data found.', 404);
      }
      return response(res, 'data found successfully.', 200, reasons);
    } catch (error) {
      console.log('error', error)
      return response(res, status.UNEXPECTED_ERROR, 501, error.message);
    }
  };

  static gotSampleReceptionUpdateStatus = async (req, res) => {
    try {
      const { id, status, reason_id, test_number } = req.body;
      if (!id || !status) {
        return response(res, "ID and status are required.", 400);
      }
      if (status === 'REJECTED' && !reason_id) {
        return response(res, "Reason is required for rejection.", 400);
      }
      if (status === 'APPROVED' && !test_number) {
        return response(res, "Test Number is required for approval.", 400);
      }
      let updateFields = { status };
      if (status === 'REJECTED') {
        updateFields.reason_id = reason_id;
      } else if (status === 'APPROVED') {
        updateFields.test_number = test_number;
      }
      const result = await gotTestingModel.update(
        updateFields,
        { where: { id } }
      );
      if (result[0] === 0) {
        return response(res, "No record found with the provided ID.", 404);
      }
      return response(res, 'Sample received successfully.', 200);
    } catch (error) {
      console.log('error', error)
      return response(res, status.UNEXPECTED_ERROR, 501, error.message);
    }
  };

  static getGotSowingDetailsTestNumber = async (req, res) => {
    try {
      let id = req.body.loginedUserid && req.body.loginedUserid.id ? req.body.loginedUserid.id : null;
      const { consignment_number, getAlltest_number, year, season, crop_code,test_number,isEdit} = req.body;
      let filters = {};
      if (id) {
        filters.bspc_id = id
      }
      if (consignment_number && !getAlltest_number) {
        const excludedTestNumbers = await gotShowingDetailsModel.findAll({
          attributes: ['got_testing_id'],
          raw: true,
        });
        const excludedTestNumberIds = excludedTestNumbers.map((item) => item.got_testing_id);
        filters.id = { [Op.notIn]: excludedTestNumberIds }
        filters.consignment_number = consignment_number;
      }
      if (getAlltest_number) {
        if (year) {
          filters.year = year;
        }
        if (season) {
          filters.season = season;
        }
        if (crop_code) {
          filters.crop_code = crop_code;
        }
      }
      filters.test_number = { [Op.ne]: null };

      const testNumber = await gotTestingModel.findAll({
        attributes: ['test_number'],
        where: filters,
        include: getAlltest_number
          ? [
              {
                model: gotShowingDetailsModel,
                attributes: [],
                required: true,
              },
            ]
          : [],
        order: [['created_at', 'ASC']],
        raw: true,
      });
  
      if (isEdit && test_number) {
        const additionalTestNumber = Array.isArray(test_number) ? test_number : [test_number];
        additionalTestNumber.forEach((number) => {
          if (!testNumber.some((item) => item.test_number === number)) {
            testNumber.push({ test_number: number });
          }
        });
      }
      if (!testNumber || testNumber.length === 0) {
        return response(res, 'No data found.', 404);
      }

      return response(res, 'data found successfully.', 200, testNumber);
    } catch (error) {
      console.log('error', error)
      return response(res, status.UNEXPECTED_ERROR, 501, error.message);
    }
  };

  static getGotSowingDetailsTestNumberDetails = async (req, res) => {
    try {
      const { test_number } = req.body;
      let id = req.body.loginedUserid && req.body.loginedUserid.id ? req.body.loginedUserid.id : null;
      let filters = {};
      if (id) {
        filters.bspc_id = id;
      }
      if (test_number) {
        filters.test_number = test_number;
      }

      const results = await gotTestingModel.findAll({
        attributes: [
          'id', 'variety_code', 'test_number', 'unique_code',
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [sequelize.col('m_crop_variety.m_variety_line.line_variety_code'), 'line_variety_code'],
          [sequelize.col('m_crop_variety.m_variety_line.line_variety_name'), 'line_variety_name'],
          [sequelize.col('generate_sample_slip.class_of_seed'), 'class_of_seed'],
        ],
        where: {
          ...filters,
        },
        include: [
          {
            model: cropVerietyModel,
            attributes: [],
            required: true,
            include: [
              {
                model: varietLineModel,
                as: 'm_variety_line',
                attributes: [],
                required: false,
              },
            ],
          },
          {
            model: generateSampleSlipsModel,
            attributes: [],
            required: false,
          },
        ],
        raw: true,
        order: [['id', 'ASC']],
      });

      const groupedResults = results.reduce((acc, row) => {
        const existingEntry = acc.find(entry => entry.id === row.id);
        const lineVariety = row.line_variety_code ? {
          line_variety_code: row.line_variety_code,
          line_variety_name: row.line_variety_name,
        } : null;

        if (existingEntry) {
          if (lineVariety) {
            existingEntry.line_variety.push(lineVariety);
          }
        } else {
          acc.push({
            id: row.id,
            variety_code: row.variety_code,
            unique_code: row.unique_code,
            test_number: row.test_number,
            variety_name: row.variety_name,
            class_of_seed: row.class_of_seed,
            line_variety: lineVariety ? [lineVariety] : [],
          });
        }
        return acc;
      }, []);
      if (!groupedResults || groupedResults.length === 0) {
        return response(res, 'No data found.', 404);
      }
      return response(res, 'data found successfully.', 200, groupedResults);
    } catch (error) {
      console.log('error', error)
      return response(res, status.UNEXPECTED_ERROR, 501, error.message);
    }
  };

  static saveGotShowingDetails = async (req, res) => {
    try {
      const {
        got_testing_id, state_code, district_code, address, user_id, area_shown,
        date_of_showing, expected_start_date, expected_end_date, is_report_genertaed
      } = req.body;

      if (!got_testing_id || !state_code || !district_code || !address || !area_shown ||
        !date_of_showing || !expected_start_date || !expected_end_date || !user_id ||
        is_report_genertaed === undefined
      ) {
        return response(res, "All required fields must be provided.", 400);
      }

      const gotShowingDetail = await gotShowingDetailsModel.create({
        got_testing_id,
        state_code,
        district_code,
        address,
        area_shown,
        date_of_showing,
        expected_start_date,
        expected_end_date,
        user_id,
        is_report_genertaed,
      });
      if (!gotShowingDetail || gotShowingDetail.length === 0) {
        return response(res, 'No data found.', 404);
      }
      return response(res, 'data save successfully.', 200, gotShowingDetail);
    } catch (error) {
      console.log('error', error)
      return response(res, status.UNEXPECTED_ERROR, 501, error.message);
    }
  };

  static getGotShowingDetailsList = async (req, res) => {
    try {
      const filters = {};
      const { test_number, year, season, crop_code, consignment_number } = req.body;
      let id = req.body.loginedUserid && req.body.loginedUserid.id ? req.body.loginedUserid.id : null;
      if (id) {
        filters.user_id = id
      }
      if (year) {
        filters['$got_testing.year$'] = year;
      }
      if (season) {
        filters['$got_testing.season$'] = season;
      }
      if (crop_code) {
        filters['$got_testing.crop_code$'] = crop_code;
      }
      if (consignment_number) {
        filters['$got_testing.consignment_number$'] = consignment_number;
      }
      if (test_number) {
        filters['$got_testing.test_number$'] = test_number;
      }
      const gotShowingDetailsList = await gotShowingDetailsModel.findAll({
        attributes: ['id', 'address', 'state_code', 'district_code', 'area_shown', 'date_of_showing', 'expected_start_date', 'expected_end_date', 'user_id', 'is_report_genertaed',
          [sequelize.col('got_testing.consignment_number'), 'consignment_number'],
          [sequelize.col('got_testing.test_number'), 'test_number'],
          [sequelize.col('m_district.district_name'), 'district_name'],
          [sequelize.col('m_state.state_name'), 'state_name'],
        ],
        where: {
          ...filters,
        },
        include: [
          {
            model: gotTestingModel,
            attributes: [],
            required: false,
          },
          {
            model: districtModel,
            attributes: [],
            required: false,
          },
          {
            model: stateModel,
            attributes: [],
            required: false,
          },
        ],
        order: [['created_at', 'DESC']],
        raw: true,
      });

      if (!gotShowingDetailsList.length) {
        return response(res, "No data found", 404);
      }
      return response(res, 'data found successfully.', 200, gotShowingDetailsList);
    } catch (error) {
      console.log('error', error)
      return response(res, status.UNEXPECTED_ERROR, 501, error.message);
    }
  };

  static deleteGotShowingDetail = async (req, res) => {
    try {
      const { id } = req.body;
      if (!id) {
        return response(res, "ID is required to delete the record.", 400);
      }
      const deletedCount = await gotShowingDetailsModel.destroy({
        where: {
          id: id,
        },
      });

      if (deletedCount == 0) {
        return response(res, "Record not found", 404);
      }
      return response(res, "Record deleted successfully.", 200);
    } catch (error) {
      console.log('error', error)
      return response(res, status.UNEXPECTED_ERROR, 501, error.message);
    }
  };

  static updateGotShowingDetails = async (req, res) => {
    try {
      const { id, state_code, district_code, address, user_id, area_shown, date_of_showing, expected_start_date, expected_end_date, is_report_genertaed } = req.body;

      if (!id) {
        return response(res, "id is required for update.", 400);
      }
      const gotShowingDetail = await gotShowingDetailsModel.findOne({ where: { id } });
      if (!gotShowingDetail) {
        return response(res, "Record not found.", 404);
      }

      const updatedShowingDetail = await gotShowingDetail.update({
        state_code: state_code || gotShowingDetail.state_code,
        district_code: district_code || gotShowingDetail.district_code,
        address: address || gotShowingDetail.address,
        area_shown: area_shown || gotShowingDetail.area_shown,
        date_of_showing: date_of_showing || gotShowingDetail.date_of_showing,
        expected_start_date: expected_start_date || gotShowingDetail.expected_start_date,
        expected_end_date: expected_end_date || gotShowingDetail.expected_end_date,
        user_id: user_id || gotShowingDetail.user_id,
        is_report_genertaed: is_report_genertaed !== undefined ? is_report_genertaed : gotShowingDetail.is_report_genertaed
      });
      if (!updatedShowingDetail || updatedShowingDetail.length === 0) {
        return response(res, 'No data found.', 404);
      }

      return response(res, 'Data updated successfully.', 200, updatedShowingDetail);
    } catch (error) {
      console.log('error', error)
      return response(res, status.UNEXPECTED_ERROR, 501, error.message);
    }
  };

  static getMonitoringTeamYear = async (req, res) => {
    try {
      let id = req.body.loginedUserid && req.body.loginedUserid.id ? req.body.loginedUserid.id : null;
      let filters = {};
      if (id) {
        filters.bspc_id = id;
      }
      const years = await gotShowingDetailsModel.findAll({
        attributes: [[sequelize.fn('DISTINCT', sequelize.col('year')), 'year']],
        include: [
          {
            model: gotTestingModel,
            attributes: [],
            where: {
              ...filters,
              year: { [Op.ne]: null },
            },
            required: true,
          },
        ],
        order: [[sequelize.col('got_testing.year'), 'ASC']],
        raw: true,
      });
      if (!years || years.length === 0) {
        return response(res, 'No data found.', 404);
      }
      return response(res, 'data found successfully.', 200, years);
    } catch (error) {
      console.log('error', error)
      return response(res, status.UNEXPECTED_ERROR, 501, error.message);
    }
  };

  static getMonitoringTeamSeason = async (req, res) => {
    let filters = {};
    let filters2 = {};
    const { year } = req.body;
    try {
      let id = req.body.loginedUserid && req.body.loginedUserid.id ? req.body.loginedUserid.id : null;
      if (id) {
        filters.user_id = id;
      }
      if (year) {
        filters2.year = year;
      }
      const season = await gotShowingDetailsModel.findAll({
        attributes: [[sequelize.fn('DISTINCT', sequelize.col('season')), 'season']],
        where: {
          ...filters,
        },
        include: [
          {
            model: gotTestingModel,
            attributes: [],
            where: {
              ...filters2,
              season: { [sequelize.Op.ne]: null }
            },
            required: true,
          },
        ],
        order: [[sequelize.col('got_testing.season'), 'ASC']],
        raw: true,
      });
      if (!season || season.length === 0) {
        return response(res, 'No data found.', 404);
      }
      return response(res, 'data found successfully.', 200, season);
    } catch (error) {
      console.log('error', error)
      return response(res, status.UNEXPECTED_ERROR, 501, error.message);
    }
  };

  static getMonitoringTeamCrop = async (req, res) => {
    let filters = {};
    let filters2 = {};
    const { year, season } = req.body;

    try {
      let id = req.body.loginedUserid && req.body.loginedUserid.id ? req.body.loginedUserid.id : null;
      if (id) {
        filters.user_id = id;
      }
      if (year) {
        filters2.year = year;
      }
      if (season) {
        filters2.season = season;
      }

      const crop_code = await gotShowingDetailsModel.findAll({
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('got_testing.crop_code')), 'crop_code'],
          [sequelize.col('got_testing.m_crop.crop_name'), 'crop_name'],
        ],
        where: {
          ...filters,
        },
        include: [
          {
            model: gotTestingModel,
            attributes: [],
            required: true,
            where: {
              ...filters2,
              crop_code: { [sequelize.Op.ne]: null }
            },
            include: [
              {
                model: cropModel,
                attributes: [],
                required: true
              }
            ]
          },
        ],
        order: [[sequelize.col('got_testing.m_crop.crop_name'), 'ASC']],
        raw: true,
      });

      if (!crop_code || crop_code.length === 0) {
        return response(res, 'No data found.', 404);
      }
      return response(res, 'Data found successfully.', 200, crop_code);

    } catch (error) {
      console.log('error', error)
      return response(res, status.UNEXPECTED_ERROR, 501, error.message);
    }
  };

  static getMonitoringTeamName = async (req, res) => {
    try {
      const { year, season, crop_code } = req.body;
      const monitoringTeams = await gotMonitoringTeamsModel.findAll({
        attributes: ['id', 'team_name'],
        where: {
          is_active: 1,
        },
        raw: true,
      });
      if (!monitoringTeams || monitoringTeams.length === 0) {
        return response(res, 'No active monitoring teams found.', 404);
      }
      const teamIds = monitoringTeams.map(team => team.id);
      const filteredTeams = await gotTestingModel.findAll({
        attributes: [[sequelize.col('got_monitoring_team.team_name'), 'team_name'], [sequelize.col('got_monitoring_team.id'), 'id']],
        where: {
          ...(year && { year }),
          ...(season && { season }),
          ...(crop_code && { crop_code }),
          got_monitoring_team_id: teamIds,
        },
        include: [
          {
            model: gotMonitoringTeamsModel,
            attributes: [],
            required: true,
          },
        ],
        order: [[sequelize.col('got_monitoring_team.team_name'), 'ASC']],
        raw: true,
      });
      if (!filteredTeams || filteredTeams.length === 0) {
        return response(res, 'No data found for the given filters.', 404);
      }
      return response(res, 'Data found successfully.', 200, filteredTeams);
    } catch (error) {
      console.log('error', error)
      return response(res, status.UNEXPECTED_ERROR, 501, error.message);
    }
  };

  static getMonitoringTeamDesignation = async (req, res) => {
    try {
      const monitoringTeamDesignation = await designationModel.findAll({
        attributes: [['id', 'designation_id'], ['name', 'designation_name']],
        where: {
          type: 'MONITORING_TEAM',
        },
        order: [['name', 'ASC']],
        raw: true,
      });
      if (!monitoringTeamDesignation || monitoringTeamDesignation.length === 0) {
        return response(res, 'No data found.', 404);
      }
      return response(res, 'data found successfully.', 200, monitoringTeamDesignation);
    } catch (error) {
      console.log('error', error)
      return response(res, status.UNEXPECTED_ERROR, 501, error.message);
    }
  };

  static saveMonitoringTeam = async (req, res) => {
    const transaction = await sequelizer.transaction();
    try {
      const { is_active, got_test_number, members } = req.body;
      const userId = req.body.loginedUserid.id;
      const latestTestRecord = await gotTestingModel.findOne({
        where: {
          bspc_id: userId,
          got_monitoring_team_id: { [Op.ne]: 0 },
        },
        order: [['created_at', 'DESC']],
        include: [{
          model: gotMonitoringTeamsModel,
          required: false,
        }],
      });
  
      let teamNumber = 1;
      if (
        latestTestRecord &&
        latestTestRecord.dataValues &&
        latestTestRecord.dataValues.got_monitoring_team &&
        latestTestRecord.dataValues.got_monitoring_team.dataValues &&
        latestTestRecord.dataValues.got_monitoring_team.dataValues.team_name
      ) {
        const latestTeamName = latestTestRecord.dataValues.got_monitoring_team.dataValues.team_name;
        const latestTeamNumber = parseInt(latestTeamName.replace('Team', ''));
        teamNumber = isNaN(latestTeamNumber) ? 1 : latestTeamNumber + 1;
      }
      const team_name = `Team${teamNumber}`;
      const testNumberArray = got_test_number.map((test) => test.test_number);
      const newTeam = await gotMonitoringTeamsModel.create(
        {
          team_name: team_name,
          is_active,
          got_test_number: testNumberArray,
        },
        { transaction }
      );
  
      if (members && Array.isArray(members)) {
        const latestUserRecord = await gotMonitoringTeamsMemberModel.findOne({
          where: {
            user_name: {
              [sequelize.Op.and]: [
                { [sequelize.Op.ne]: 'NA' },
                { [sequelize.Op.iRegexp]: '^got-\\d+$' }
              ]
            }
          },
          order: [
            [
              sequelize.cast(
                sequelize.fn('regexp_replace', sequelize.col('user_name'), '^got-', ''),
                'INTEGER'
              ),
              'DESC'
            ]
          ]
        });
        let globalCounter = 1000;
        if (latestUserRecord && latestUserRecord.user_name) {
          const latestUserNumber = parseInt(latestUserRecord.user_name.replace('got-', ''));
          globalCounter = isNaN(latestUserNumber) ? 0 : latestUserNumber;
        }
  
        const memberPromises = members.map((member) => {
          let user_name = 'NA';
          if (member.is_team_lead) {
            globalCounter += 1;
            user_name = `got-${globalCounter}`;
          }
          return gotMonitoringTeamsMemberModel.create(
            {
              got_monitoring_team_id: newTeam.id,
              name: member.name,
              designation_id: member.designation_id,
              mobile_number: member.mobile_number,
              email_id: member.email_id,
              pin_code: member.pin_code,
              user_name: user_name,
              is_team_lead: member.is_team_lead,
            },
            { transaction }
          );
        });
        await Promise.all(memberPromises);
      }
      await gotTestingModel.update(
        { got_monitoring_team_id: newTeam.id },
        {
          where: {
            test_number: { [sequelize.Op.in]: testNumberArray },
          },
          transaction,
        }
      );
      await transaction.commit();
      return response(res, 'Data saved successfully.', 200, newTeam);
    } catch (error) {
      await transaction.rollback();
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 501, error.message);
    }
  };
  
  static updateMonitoringTeam = async (req, res) => {
    const transaction = await sequelizer.transaction();
    try {
      const { team_name, is_active, members } = req.body;
      let { previous_got_test_number, got_test_number } = req.body;
  
      // Normalize got_test_number
      if (Array.isArray(got_test_number)) {
        if (typeof got_test_number[0] === 'string') {
          got_test_number = got_test_number;
        } else if (typeof got_test_number[0] === 'object' && got_test_number[0]?.test_number) {
          got_test_number = got_test_number.map((item) => item.test_number);
        }
      }
      // Parse previous_got_test_number if needed
      if (typeof previous_got_test_number === 'string') {
        try {
          previous_got_test_number = JSON.parse(previous_got_test_number);
        } catch (err) {
          console.error('Failed to parse previous_got_test_number:', err);
          return response(res, 'Invalid format for previous_got_test_number!', 400);
        }
      }
      if (!Array.isArray(previous_got_test_number)) {
        return response(res, 'Invalid or missing previous_got_test_number!', 400);
      }
  
      // Fetch monitoring team details
      const team = await gotTestingModel.findOne({
        where: {
          test_number: {
            [sequelize.Op.in]: previous_got_test_number,
          },
        },
        attributes: ['test_number', 'got_monitoring_team_id'],
      });
  
      if (!team) {
        return response(res, 'Monitoring team not found!', 404);
      }
  
      const monitoringTeamId = team?.got_monitoring_team_id;
  
      // Update team details
      await gotMonitoringTeamsModel.update(
        {
          team_name,
          is_active,
          got_test_number,
        },
        {
          where: { id: monitoringTeamId },
          transaction,
        }
      );
  
      // Fetch existing team member details
      const monitoringTeamsMemberData = await gotMonitoringTeamsMemberModel.findOne({
        where: {
          got_monitoring_team_id: monitoringTeamId,
          user_name: { [sequelize.Op.ne]: 'NA' }
        },
        attributes: ["id", "got_monitoring_team_id", "user_name"]
      });
  
      // Delete previous team members
      await gotMonitoringTeamsMemberModel.destroy({
        where: { got_monitoring_team_id: monitoringTeamId },
        transaction,
      });
  
      // Add new team members
      if (members && Array.isArray(members)) {
        const memberPromises = members.map((member) =>
          gotMonitoringTeamsMemberModel.create(
            {
              got_monitoring_team_id: monitoringTeamId,
              name: member.name,
              designation_id: member.designation_id,
              mobile_number: member.mobile_number,
              email_id: member.email_id,
              pin_code: member.pin_code,
              user_name: member.is_team_lead === 1 ? monitoringTeamsMemberData?.user_name : "NA",
              is_team_lead: member.is_team_lead,
            },
            { transaction }
          )
        );
        await Promise.all(memberPromises);
      }
  
      // Reset previous testing entries
      await gotTestingModel.update(
        { got_monitoring_team_id: 0 },
        {
          where: {
            test_number: {
              [sequelize.Op.in]: previous_got_test_number,
            },
          },
          transaction,
        }
      );
  
      // Update new testing entries
      await gotTestingModel.update(
        { got_monitoring_team_id: monitoringTeamId },
        {
          where: {
            test_number: {
              [sequelize.Op.in]: got_test_number,
            },
          },
          transaction,
        }
      );  
      await transaction.commit();
      return response(res, 'Data updated successfully.', 200, team);
    } catch (error) {
      await transaction.rollback();
      console.error('Error:', error);
      return response(res, 'Unexpected error occurred!', 501, error.message);
    }
  };

  static getMonitoringTeamListold = async (req, res) => {
    try {
      const { year, season, crop_code,user_id } = req.body;
      const monitoringTeams = await gotMonitoringTeamsModel.findAll({
        attributes: ['id', 'team_name'],
        where: {
          is_active: 1,
        },
        raw: true,
      });
      if (!monitoringTeams || monitoringTeams.length === 0) {
        return response(res, 'No active monitoring teams found.', 404);
      }
      const teamIds = monitoringTeams.map(team => team.id);
      const filteredTeams = await gotTestingModel.findAll({
        attributes: ['id',
          [sequelize.col('got_monitoring_team.id'), 'got_monitoring_team_id'],
          [sequelize.col('got_monitoring_team.team_name'), 'team_name'],
          [sequelize.col('got_monitoring_team.got_test_number'), 'got_test_number'],
          [sequelize.col('got_monitoring_team.members.name'), 'name'],
          [sequelize.col('got_monitoring_team.members.id'), 'member_id'],
          [sequelize.col('got_monitoring_team.members.designation_id'), 'designation_id'],
          [sequelize.col('got_monitoring_team.members.mobile_number'), 'mobile_number'],
          [sequelize.col('got_monitoring_team.members.email_id'), 'email_id'],
          [sequelize.col('got_monitoring_team.members.pin_code'), 'pin_code'],
          [sequelize.col('got_monitoring_team.members.user_name'), 'user_name'],
          [sequelize.col('got_monitoring_team.members.is_team_lead'), 'is_team_lead'],
          [sequelize.col('got_monitoring_team.members.user_name'), 'user_name'],
          [sequelize.col('got_monitoring_team.members.m_designation.name'), 'designation_name'],
        ],
        where: {
          ...(year && { year }),
          ...(season && { season }),
          ...(crop_code && { crop_code }),
          got_monitoring_team_id: teamIds,
          bspc_id: user_id
        },
        include: [
          {
            model: gotMonitoringTeamsModel,
            attributes: [],
            required: true,
            include: [
              {
                model: gotMonitoringTeamsMemberModel,
                as: 'members',
                attributes: [],
                include: [
                  {
                    model: designationModel,
                    attributes: [],
                    required: false,
                  }
                ],
                required: false,
              },
            ],
          },
        ],
        order: [[sequelize.col('got_monitoring_team.team_name'), 'ASC']],
        raw: true,
      });
      if (!filteredTeams || filteredTeams.length === 0) {
        return response(res, 'No data found for the given filters.', 404);
      }
      const groupedData = Object.values(
        filteredTeams.reduce((acc, member) => {
          if (!acc[member.got_monitoring_team_id]) {
            acc[member.got_monitoring_team_id] = {
              team_name: member.team_name,
              got_monitoring_team_id: member.got_monitoring_team_id,
              got_test_number: member.got_test_number,
              members: [],
            };
          }

          const uniqueMembers = new Set(acc[member.got_monitoring_team_id].members.map(m => m.member_id));
          if (!uniqueMembers.has(member.member_id)) {
            acc[member.got_monitoring_team_id].members.push({
              member_id: member.member_id,
              name: member.name,
              designation_id: member.designation_id,
              designation_name: member.designation_name,
              mobile_number: member.mobile_number,
              email_id: member.email_id,
              pin_code: member.pin_code,
              user_name: member.user_name,
              is_team_lead: member.is_team_lead,
            });
          }

          return acc;
        }, {})
      );

      return response(res, 'Data found successfully.', 200, groupedData);
    } catch (error) {
      console.log('error', error)
      return response(res, status.UNEXPECTED_ERROR, 501, error.message);
    }
  };



  static getMonitoringTeamList = async (req, res) => {
    try {
      const { year, season, crop_code } = req.body;
  
      // Step 1: Fetch active monitoring teams
      const monitoringTeams = await gotMonitoringTeamsModel.findAll({
        attributes: ['id', 'team_name'],
        where: { is_active: 1 },
        raw: true,
      });
  
      if (!monitoringTeams || monitoringTeams.length === 0) {
        return response(res, 'No active monitoring teams found.', 404);
      }
  
      // Step 2: Fetch all relevant test numbers
      const teamIds = monitoringTeams.map(team => team.id);
      const existingTestNumbers = await bspPerestingsBspFiveModel.findAll({
        attributes: ['test_no'],
        raw: true,
      });
  
      // Step 3: Convert test numbers to a Set for fast lookups
      const testNumbersSet = new Set(existingTestNumbers.map(item => item.test_no));
  
      // Step 4: Fetch team and member details
      const filteredTeams = await gotTestingModel.findAll({
        attributes: [
          'id',
          [sequelize.col('got_monitoring_team.id'), 'got_monitoring_team_id'],
          [sequelize.col('got_monitoring_team.team_name'), 'team_name'],
          [sequelize.col('got_monitoring_team.got_test_number'), 'got_test_number'],
          [sequelize.col('got_monitoring_team.members.name'), 'name'],
          [sequelize.col('got_monitoring_team.members.id'), 'member_id'],
          [sequelize.col('got_monitoring_team.members.designation_id'), 'designation_id'],
          [sequelize.col('got_monitoring_team.members.mobile_number'), 'mobile_number'],
          [sequelize.col('got_monitoring_team.members.email_id'), 'email_id'],
          [sequelize.col('got_monitoring_team.members.pin_code'), 'pin_code'],
          [sequelize.col('got_monitoring_team.members.user_name'), 'user_name'],
          [sequelize.col('got_monitoring_team.members.is_team_lead'), 'is_team_lead'],
          [sequelize.col('got_monitoring_team.members.m_designation.name'), 'designation_name'],
        ],
        where: {
          ...(year && { year }),
          ...(season && { season }),
          ...(crop_code && { crop_code }),
          got_monitoring_team_id: { [Op.in]: teamIds },
        },
        include: [
          {
            model: gotMonitoringTeamsModel,
            attributes: [],
            required: true,
            include: [
              {
                model: gotMonitoringTeamsMemberModel,
                as: 'members',
                attributes: [],
                include: [
                  {
                    model: designationModel,
                    attributes: [],
                    required: false,
                  },
                ],
                required: false,
              },
            ],
          },
        ],
        order: [[sequelize.col('got_monitoring_team.team_name'), 'ASC']],
        raw: true,
      });
  
      if (!filteredTeams || filteredTeams.length === 0) {
        return response(res, 'No data found for the given filters.', 404);
      }
  
      // Step 5: Group and process the data
      const groupedData = Object.values(
        filteredTeams.reduce((acc, member) => {
          if (!acc[member.got_monitoring_team_id]) {
            // Parse got_test_number and check for matches
            const parsedTestNumbers = JSON.parse(member.got_test_number || '[]');
            const hasMatch = parsedTestNumbers.some(testNumber => testNumbersSet.has(testNumber));
  
            acc[member.got_monitoring_team_id] = {
              team_name: member.team_name,
              got_monitoring_team_id: member.got_monitoring_team_id,
              got_test_number: member.got_test_number,
              is_button_disable: hasMatch, // Set based on whether a match is found
              members: [],
            };
          }
  
          const uniqueMembers = new Set(acc[member.got_monitoring_team_id].members.map(m => m.member_id));
          if (!uniqueMembers.has(member.member_id)) {
            acc[member.got_monitoring_team_id].members.push({
              member_id: member.member_id,
              name: member.name,
              designation_id: member.designation_id,
              designation_name: member.designation_name,
              mobile_number: member.mobile_number,
              email_id: member.email_id,
              pin_code: member.pin_code,
              user_name: member.user_name,
              is_team_lead: member.is_team_lead,
            });
          }
  
          return acc;
        }, {})
      );
  
      // Step 6: Send the response
      return response(res, 'Data found successfully.', 200, groupedData);
  
    } catch (error) {
      console.error('Error in getMonitoringTeamList:', error);
      return response(res, 'Unexpected error occurred.', 500, error.message);
    }
  };
  
  

  static deleteMonitoringTeam = async (req, res) => {
    const transaction = await sequelizer.transaction();
    try {
      const { got_monitoring_team_id } = req.body;
      const team = await gotMonitoringTeamsModel.findOne({
        where: { id: got_monitoring_team_id },
        transaction,
      });
      if (!team) {
        return response(res, 'Team not found!', 404);
      }
      await gotMonitoringTeamsMemberModel.destroy({
        where: { got_monitoring_team_id: got_monitoring_team_id },
        transaction,
      });
      await team.destroy({ transaction });
      const gotTestingDetails = await gotTestingModel.findOne({
        where: { got_monitoring_team_id: got_monitoring_team_id },
        transaction,
      });
      if (gotTestingDetails) {
        await gotTestingDetails.update(
          { got_monitoring_team_id: 0 },
          { transaction }
        );
      }
      await transaction.commit();
      return response(res, 'Team and members deleted successfully.', 200);
    } catch (error) {
      await transaction.rollback();
      console.log('error', error);
      return response(res, 'Failed to delete the monitoring team!', 500, error.message);
    }
  };

  static getGotsowingDetailsConsignment = async (req, res) => {
    let filters = {};
    const { year, season,crop_code,consignment_number,isEdit } = req.body;
    try {
      let id = req.body.loginedUserid && req.body.loginedUserid.id ? req.body.loginedUserid.id : null;
      if (id) {
        filters.bspc_id = id
      }
      if (year) {
        filters.year = year;
      }
      if (season) {
        filters.season = season;
      }
      if (crop_code) {
        filters.crop_code = crop_code;
      }
      filters.test_number = { [Op.ne]: '' }; 
      const excludedTestNumbers = await gotShowingDetailsModel.findAll({
        attributes: ['got_testing_id'],
        raw: true,
      });
      const excludedTestNumberIds = excludedTestNumbers.map((item) => item.got_testing_id); 
      filters.id = { [Op.notIn]: excludedTestNumberIds }

      const ConsignmentNumber = await gotTestingModel.findAll({
        attributes: [[sequelize.fn('DISTINCT', sequelize.col('consignment_number')), 'consignment_number']],
        where: {
          ...filters,
        },
        raw: true,
      });  
      if (isEdit && consignment_number) {
        const additionalConsignments = Array.isArray(consignment_number) ? consignment_number : [consignment_number];
        additionalConsignments.forEach((number) => {
          if (!ConsignmentNumber.some((item) => item.consignment_number === number)) {
            ConsignmentNumber.push({ consignment_number: number });
          }
        });
      }
      if (!ConsignmentNumber || ConsignmentNumber.length === 0) {
        return response(res, 'No data found.', 404);
      }
      return response(res, 'data found successfully.', 200,ConsignmentNumber);
    } catch (error) {
      console.log('error', error)
      return response(res, status.UNEXPECTED_ERROR, 501, error.message);
    }
  }; 

  static getGotMonitoringTeamTestNumber = async (req, res) => {
    try {
      let id = req.body.loginedUserid && req.body.loginedUserid.id ? req.body.loginedUserid.id : null;
      const { year, season, crop_code,isEdit,test_number } = req.body;
      let filters = {};
      if (id) {
        filters.bspc_id = id
      }
      if (year) {
        filters.year = year;
      }
      if (season) {
        filters.season = season;
      }
      if (crop_code) {
        filters.crop_code = crop_code;
      }
      filters.test_number = { [Op.ne]: null };
      filters.got_monitoring_team_id = 0 ;
      const testNumber = await gotTestingModel.findAll({
        attributes: ['test_number'],
        where: {
          ...filters,
          test_number: { [sequelize.Op.ne]: null, [sequelize.Op.ne]: '' }
        },
        include: [
          {
            model: gotShowingDetailsModel,
            required: true,
          },
        ],
        order: [['created_at', 'ASC']],
        raw: true,
      });
      if (!testNumber || testNumber.length === 0 && !isEdit) {
        return response(res, 'No data found.', 404);
      }
      let responseTestNumbers = testNumber.map((item) => ({ test_number: item.test_number }));

      if (isEdit && test_number) {
        let additionalNumbers = Array.isArray(test_number) ? test_number : [test_number];
        additionalNumbers = additionalNumbers.flatMap((num) =>
          typeof num === 'string' && num.startsWith('[') && num.endsWith(']') ? JSON.parse(num) : [num] );
        additionalNumbers.forEach((num) => {
          if (!responseTestNumbers.some((item) => item.test_number === num)) {
            responseTestNumbers.push({ test_number: num });
          }
        });
      }
       return response(res, 'data found successfully.', 200, responseTestNumbers);
    } catch (error) {
      console.log('error', error)
      return response(res, status.UNEXPECTED_ERROR, 501, error.message);
    }
  };

  static syncGotInspectionData = async (req, res) => {
    let returnResponse = {};
    try {

      const method = 'POST';
      const url = process.env.GOT_INSPECTION_DATA_URL ?? '';

      const dataSet = {
        apiKey: process.env.GOT_INSPECTION_SYNC_KEY ?? ''
      };

      let axiosResponse = (await this.axiosFunction(dataSet, url, method));

      const axiosStatus = axiosResponse.result['EncryptedResponse'] && axiosResponse.result['EncryptedResponse']['status_code'] ? axiosResponse.result['EncryptedResponse']['status_code'] :  axiosResponse.status;
      const axiosMessage = axiosResponse.result['EncryptedResponse'] && axiosResponse.result['EncryptedResponse']['message'] ? axiosResponse.result['EncryptedResponse']['message'] :  axiosResponse.message;
      const axiosResult = axiosResponse.result['EncryptedResponse'] && axiosResponse.result['EncryptedResponse']['data'] ? axiosResponse.result['EncryptedResponse']['data'] :  axiosResponse.result;

      // // sample data
      // const axiosStatus = 200;
      // const axiosMessage = 'OK';
      // const axiosResult = {
      //   "count": 2,
      //   "rows": [
      //     {
      //       "isFinished": "No",
      //       "testNo": "ABC1234",
      //       "showReportNo": "1st",
      //       "reportNo": "1",
      //       "standardsMeet": true,
      //       "certificationEligibility": "Eligible For Certificate",
      //       "eligible": "Eligible For Certificate",
      //       "showTestNo": "A0410162-4",
      //       "stageGrowth": "Vegetative",
      //       "year": "2023-24",
      //       "season": "KHARIF (2023)",
      //       "lotNum": "OCT23-13-099-205",
      //       "uniqueCode": "BpD1zVfS",
      //       "sourceClass": "BREEDER",
      //       "destClass": "FOUNDATION I",
      //       "varietyCode": "A0410162",
      //       "varietyName": "JS-20-116",
      //       "cropName": "SOYBEAN (BHAT)",
      //       "cropCode": "A0410",
      //       "cropRegCode": "K23-10-2229",
      //       "spaCode": "1572",
      //       "spaName": "MSSCL OSMANABAD",
      //       "sppCode": "13099",
      //       "sppName": "MSSCL OSMANABAD",
      //       "dateOfSowing": "2024-11-05T18:30:00.000Z",
      //       "replica1": {
      //         "noOfSelfPlant": 1,
      //         "selfPlantObserved": [
      //           {
      //             "selfPlant": 1,
      //             "$$hashKey": "object:385"
      //           }
      //         ],
      //         "noOfOffType": 2,
      //         "offTypeObserved": [
      //           {
      //             "offTypePlant": 2,
      //             "reason": "Less Hairy",
      //             "$$hashKey": "object:387"
      //           },
      //           {
      //             "offTypePlant": 3,
      //             "reason": "Less Hairy",
      //             "$$hashKey": "object:389"
      //           }
      //         ],
      //         "totalPlantsObserved": 100,
      //         "noOfTruePlants": 97
      //       },
      //       "replica2": {
      //         "noOfSelfPlant": 0,
      //         "selfPlantObserved": [],
      //         "noOfOffType": 0,
      //         "offTypeObserved": [],
      //         "totalPlantsObserved": 100,
      //         "noOfTruePlants": 100
      //       },
      //       "summeryObservation": {
      //         "noOfSelfPlant": 1,
      //         "noOfOffType": 2,
      //         "totalPlantsObserved": 200,
      //         "noOfTruePlants": 197,
      //         "perNoOfTruePlant": 98.5
      //       },
      //       "observedOn": "2024-11-07T05:57:35.888Z",
      //       "certifiedOn": "2024-11-07T05:57:35.888Z",
      //       "longitude": "Error-Location",
      //       "latitude": "Error-Location",
      //       "teamMember": "cdscs",
      //       "sign": "data:image/png;base64,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",
      //       "gotStatus": "Done",
      //       "remark": "sdadxsasda",
      //       "syncDate": "2024-11-07T06:19:25.682Z",
      //       "sciName": "1655",
      //       "sciCode": "1655"
      //     },
      //     {
      //       "isFinished": "Yes",
      //       "testNo": "ABC123",
      //       "showReportNo": "1st",
      //       "reportNo": "1",
      //       "standardsMeet": true,
      //       "certificationEligibility": "Eligible For Certificate",
      //       "eligible": "Eligible For Certificate",
      //       "showTestNo": "A0410162-4",
      //       "stageGrowth": "Vegetative",
      //       "year": "2023-24",
      //       "season": "KHARIF (2023)",
      //       "lotNum": "OCT23-13-099-205",
      //       "uniqueCode": "BpD1zVfS",
      //       "sourceClass": "BREEDER",
      //       "destClass": "FOUNDATION I",
      //       "varietyCode": "A0410162",
      //       "varietyName": "JS-20-116",
      //       "cropName": "SOYBEAN (BHAT)",
      //       "cropCode": "A0410",
      //       "cropRegCode": "K23-10-2229",
      //       "spaCode": "1572",
      //       "spaName": "MSSCL OSMANABAD",
      //       "sppCode": "13099",
      //       "sppName": "MSSCL OSMANABAD",
      //       "dateOfSowing": "2024-11-05T18:30:00.000Z",
      //       "replica1": {
      //         "noOfSelfPlant": 1,
      //         "selfPlantObserved": [
      //           {
      //             "selfPlant": 1,
      //             "$$hashKey": "object:340"
      //           }
      //         ],
      //         "noOfOffType": 1,
      //         "offTypeObserved": [
      //           {
      //             "offTypePlant": 2,
      //             "reason": "Less Hairy",
      //             "$$hashKey": "object:342"
      //           }
      //         ],
      //         "totalPlantsObserved": 100,
      //         "noOfTruePlants": 98
      //       },
      //       "replica2": {
      //         "noOfSelfPlant": 0,
      //         "selfPlantObserved": [],
      //         "noOfOffType": 0,
      //         "offTypeObserved": [],
      //         "totalPlantsObserved": 100,
      //         "noOfTruePlants": 100
      //       },
      //       "summeryObservation": {
      //         "noOfSelfPlant": 1,
      //         "noOfOffType": 1,
      //         "totalPlantsObserved": 200,
      //         "noOfTruePlants": 198,
      //         "perNoOfTruePlant": 99
      //       },
      //       "teamMemberDetails":[
      //         {
      //           "id":58,
      //           "name":"Dr. Mainak",
      //           "mobileNumber":"9933995567",
      //           "emailId":"mainak@gmail.com",
      //           "designation":"Area Manager",
      //           "$$hashKey":"object:317"
      //         },
      //         {
      //           "id":59,
      //           "name":"Dr. Praneet",
      //           "mobileNumber":"9234567899",
      //           "emailId":"praneet@gmail.com",
      //           "designation":"Assistant Director",
      //           "$$hashKey":"object:316"
      //         }
      //       ],
      //       "observedOn": "2024-11-07T05:55:39.737Z",
      //       "certifiedOn": "2024-11-07T05:55:39.737Z",
      //       "longitude": "Error-Location",
      //       "latitude": "Error-Location",
      //       "teamMember": "cdscs",
      //       "sign": "data:image/png;base64,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",
      //       "gotStatus": "Done",
      //       "remark": "czcs",
      //       "syncDate": "2024-11-07T06:19:25.681Z",
      //       "sciName": "1655",
      //       "sciCode": "1655"
      //     }
      //   ]
      // };

      if (parseInt(axiosStatus) !== 200) {
        return response(res, axiosMessage, axiosStatus, axiosResult);
      } else {
        if (!(axiosResult['rows'] && Object.keys(axiosResult['rows']).length)) {
          return response(res, status.DATA_NOT_AVAILABLE, 200, axiosResult);
        } else if ((Object.keys(axiosResult['rows']).length) > 100) {
          return response(res, status.DATA_LIMIT_EXCEEDED, 200, axiosResult);
        } else {

          const data = axiosResult['rows'];

          const insertLogs = {
            success: {
              count: 0,
              rows: []
            },
            fail: {
              count: 0,
              rows: []
            },
            duplicate: {
              count: 0,
              rows: []
            },
          };

          const promises = [];
          for (const key in data) {
            const resData = data[key];

            const isExistingRecord = await bspPerestingsBspFiveModel.findOne({
              where: {
                test_no: data[key]['testNo'],
                report_no: data[key]['reportNo'],
              },
              raw: false,
              attributes: ['id']
            });

            if (isExistingRecord && Object.keys(isExistingRecord).length) {

              insertLogs['duplicate']['count']++;
              insertLogs['duplicate']['rows'][insertLogs['duplicate']['rows'].length] = {
                sciCode: data[key]['sciCode'],
                testNo: data[key]['testNo'],
                reportNo: data[key]['reportNo'],
              };

              const promise = new Promise((resolve) => {
                resolve(key);
              });
              promises.push(promise);
            } else {

              const bspProforma5asInsertData = {
                is_finished: data[key]['isFinished'],
                test_no: data[key]['testNo'],
                show_report_no: data[key]['showReportNo'],
                report_no: data[key]['reportNo'],
                standards_meet: data[key]['standardsMeet'],
                certification_eligibility: data[key]['certificationEligibility'],
                eligible: data[key]['eligible'],
                show_test_no: data[key]['showTestNo'],
                stage_growth: data[key]['stageGrowth'],
                year: data[key]['year']?.slice(0, 4),
                season: (data[key]['season']?.slice(0, 1))?.toUpperCase(),
                lot_num: data[key]['lotNum'],
                unique_code: data[key]['uniqueCode'],
                source_class: data[key]['sourceClass'],
                dest_class: data[key]['destClass'],
                variety_code: data[key]['varietyCode'],
                variety_name: data[key]['varietyName'],
                crop_name: data[key]['cropName'],
                crop_code: data[key]['cropCode'],
                crop_reg_code: data[key]['cropRegCode'],
                spa_code: data[key]['spaCode'],
                spa_name: data[key]['spaName'],
                spp_code: data[key]['sppCode'],
                spp_name: data[key]['sppName'],
                date_of_sowing: data[key]['dateOfSowing'],
                observed_on: data[key]['observedOn'],
                certified_on: data[key]['certifiedOn'],
                longitude: data[key]['longitude'],
                latitude: data[key]['latitude'],
                team_member: data[key]['teamMember'],
                got_status: data[key]['gotStatus'],
                remark: data[key]['remark'],
                sync_date: data[key]['syncDate'],
                sci_name: data[key]['sciName'],
                sci_code: data[key]['sciCode'],
                bspc_id: data[key]['sppCode'],
                reference_no: null,
                reference_index: null,
              };

              const existingReferenceData = await bspPerestingsBspFiveModel.findOne({
                where: {
                  year: bspProforma5asInsertData['year'],
                  season: bspProforma5asInsertData['season'],
                  crop_code: bspProforma5asInsertData['crop_code'],
                  bspc_id: bspProforma5asInsertData['bspc_id'],
                  [Op.and]: [
                    {
                      reference_no: {
                        [Op.ne]: null
                      }
                    },
                    {
                      reference_no: {
                        [Op.ne]: ''
                      }
                    }
                  ]
                },
                attributes: ['reference_no', 'reference_index']
              });

              bspProforma5asInsertData['reference_no'] = existingReferenceData && Object.keys(existingReferenceData).length ? (existingReferenceData['reference_no'] ? existingReferenceData['reference_no'] : (existingReferenceData['dataValues'] && existingReferenceData['dataValues']['reference_no'] ? existingReferenceData['dataValues']['reference_no'] : null)) : null;
              bspProforma5asInsertData['reference_index'] = existingReferenceData && Object.keys(existingReferenceData).length ? (existingReferenceData['reference_index'] ? existingReferenceData['reference_index'] : (existingReferenceData['dataValues'] && existingReferenceData['dataValues']['reference_index'] ? existingReferenceData['dataValues']['reference_index'] : null)) : null;

              if (!bspProforma5asInsertData['reference_no']) {
                const maxRefIndex = await bspPerestingsBspFiveModel.max('reference_index');
                bspProforma5asInsertData['reference_index'] = (maxRefIndex ? (parseInt(maxRefIndex) + 1) : 1);
                bspProforma5asInsertData['reference_no'] = ('BSP-V(A)/' + data[key]['year']?.slice(2, 7) + '/' + bspProforma5asInsertData['season'] + '/' + bspProforma5asInsertData['reference_index']).trim().toUpperCase();
              }

              let summaryObservationInsertData = {};
              let replica1InsertData = {};
              let replica2InsertData = {};

              let bsp5GotMemberRelationInsertData = [];
              let selfPlantObservation1InsertData = [];
              let offTypeObservation1InsertData = [];
              let selfPlantObservation2InsertData = [];
              let offTypeObservation2InsertData = [];

              if (data[key]['summeryObservation'] && Object.keys(data[key]['summeryObservation']).length) {

                summaryObservationInsertData = {
                  no_of_self_plant: data[key]['summeryObservation']['noOfSelfPlant'],
                  no_of_off_type: data[key]['summeryObservation']['noOfOffType'],
                  total_plants_observed: data[key]['summeryObservation']['totalPlantsObserved'],
                  no_of_true_plants: data[key]['summeryObservation']['noOfTruePlants'],
                  per_no_of_true_plant: data[key]['summeryObservation']['perNoOfTruePlant'],
                  bsp_5as_id: null
                };
              }

              if (data[key]['replica1'] && Object.keys(data[key]['replica1']).length) {
                replica1InsertData = {
                  no_of_self_plant: data[key]['replica1']['noOfSelfPlant'],
                  no_of_off_type: data[key]['replica1']['noOfOffType'],
                  total_plants_observed: data[key]['replica1']['totalPlantsObserved'],
                  no_of_true_plants: data[key]['replica1']['noOfTruePlants'],
                  replica_index: 1,
                  bsp_5as_id: null
                };
              }

              if (data[key]['replica2'] && Object.keys(data[key]['replica2']).length) {
                replica2InsertData = {
                  no_of_self_plant: data[key]['replica2']['noOfSelfPlant'],
                  no_of_off_type: data[key]['replica2']['noOfOffType'],
                  total_plants_observed: data[key]['replica2']['totalPlantsObserved'],
                  no_of_true_plants: data[key]['replica2']['noOfTruePlants'],
                  replica_index: 2,
                  bsp_5as_id: null
                };
              }

              await bspPerestingsBspFiveModel.create(bspProforma5asInsertData).then(async function (item) {
                const bsp5asId = item['dataValues'].id ? item['dataValues'].id : null;

                if (bsp5asId) {
                  await bspProforma5asResponseModel.create({
                    res_data: resData,
                    bsp_5as_id: bsp5asId
                  }).then(function (item) {
                    r1Id = item['dataValues'].id ? item['dataValues'].id : null
                  }).catch(function (err) {
                  });
                }

                let sOId = null;
                if (Object.keys(summaryObservationInsertData).length) {
                  await summaryObservationModel.create({
                    ...summaryObservationInsertData,
                    bsp_5as_id: bsp5asId
                  }).then(function (item) {
                    sOId = item['dataValues'].id ? item['dataValues'].id : null
                  }).catch(function (err) {
                  });
                }

                let r1Id = null;
                if (Object.keys(replica1InsertData).length) {
                  await replicaModel.create({
                    ...replica1InsertData,
                    bsp_5as_id: bsp5asId
                  }).then(function (item) {
                    r1Id = item['dataValues'].id ? item['dataValues'].id : null
                  }).catch(function (err) {
                  });
                }

                let r2Id = null;
                if (Object.keys(replica2InsertData).length) {
                  await replicaModel.create({
                    ...replica2InsertData,
                    bsp_5as_id: bsp5asId
                  }).then(function (item) {
                    r2Id = item['dataValues'].id ? item['dataValues'].id : null
                  }).catch(function (err) {
                  });
                }

                if (bsp5asId && data[key]['teamMemberDetails'] && Object.keys(data[key]['teamMemberDetails']).length) {
                  const teamMemberDetails = data[key]['teamMemberDetails'];
                  const promisesV1 = [];
                  for (const key1 in teamMemberDetails) {

                    bsp5GotMemberRelationInsertData[bsp5GotMemberRelationInsertData.length] = {
                      got_member_id: teamMemberDetails[key1]['id'],
                      bsp_5as_id: bsp5asId,
                    };

                    const promiseV1 = new Promise((resolve) => {
                      resolve(key1);
                    });
                    promisesV1.push(promiseV1);
                  }
                  await Promise.all(promisesV1);

                  await bsp5GotMemberRelationModel.bulkCreate(bsp5GotMemberRelationInsertData).then(function (item) {
                  }).catch(function (err) {
                  });
                }

                if (bsp5asId && r1Id && data[key]['replica1'] && Object.keys(data[key]['replica1']).length) {
                  if (data[key]['replica1']['selfPlantObserved'] && Object.keys(data[key]['replica1']['selfPlantObserved']).length) {
                    const sPO1 = data[key]['replica1']['selfPlantObserved'];
                    const promisesV1 = [];
                    for (const key1 in sPO1) {

                      selfPlantObservation1InsertData[selfPlantObservation1InsertData.length] = {
                        self_plant: sPO1[key1]['selfPlant'],
                        bsp_5as_id: bsp5asId,
                        replica_id: r1Id
                      };

                      const promiseV1 = new Promise((resolve) => {
                        resolve(key1);
                      });
                      promisesV1.push(promiseV1);
                    }
                    await Promise.all(promisesV1);

                    await selfPlantObservationModel.bulkCreate(selfPlantObservation1InsertData).then(function (item) {
                    }).catch(function (err) {
                    });
                  }

                  if (data[key]['replica1']['offTypeObserved'] && Object.keys(data[key]['replica1']['offTypeObserved']).length) {
                    const oTO1 = data[key]['replica1']['offTypeObserved'];
                    const promisesV2 = [];
                    for (const key2 in oTO1) {

                      offTypeObservation1InsertData[offTypeObservation1InsertData.length] = {
                        off_type_plant: oTO1[key2]['offTypePlant'],
                        reason: oTO1[key2]['reason'],
                        bsp_5as_id: bsp5asId,
                        replica_id: r1Id
                      };

                      const promiseV2 = new Promise((resolve) => {
                        resolve(key2);
                      });
                      promisesV2.push(promiseV2);
                    }
                    await Promise.all(promisesV2);

                    await offTypeObservationModel.bulkCreate(offTypeObservation1InsertData).then(function (item) {
                    }).catch(function (err) {
                    });
                  }
                }

                if (bsp5asId && r2Id && data[key]['replica2'] && Object.keys(data[key]['replica2']).length) {

                  if (data[key]['replica2']['selfPlantObserved'] && Object.keys(data[key]['replica2']['selfPlantObserved']).length) {
                    const sPO2 = data[key]['replica2']['selfPlantObserved'];
                    const promisesV3 = [];
                    for (const key3 in sPO2) {

                      selfPlantObservation2InsertData[selfPlantObservation2InsertData.length] = {
                        self_plant: sPO2[key3]['selfPlant'],
                        bsp_5as_id: bsp5asId,
                        replica_id: r2Id
                      };

                      const promiseV3 = new Promise((resolve) => {
                        resolve(key3);
                      });
                      promisesV3.push(promiseV3);
                    }
                    await Promise.all(promisesV3);

                    await selfPlantObservationModel.bulkCreate(selfPlantObservation2InsertData).then(function (item) {
                    }).catch(function (err) {
                    });
                  }

                  if (data[key]['replica2']['offTypeObserved'] && Object.keys(data[key]['replica2']['offTypeObserved']).length) {
                    const oTO2 = data[key]['replica2']['offTypeObserved'];
                    const promisesV4 = [];
                    for (const key4 in oTO2) {

                      offTypeObservation2InsertData[offTypeObservation2InsertData.length] = {
                        off_type_plant: oTO2[key4]['offTypePlant'],
                        reason: oTO2[key4]['reason'],
                        bsp_5as_id: bsp5asId,
                        replica_id: r2Id
                      };

                      const promiseV4 = new Promise((resolve) => {
                        resolve(key4);
                      });
                      promisesV4.push(promiseV4);
                    }
                    await Promise.all(promisesV4);

                    await offTypeObservationModel.bulkCreate(offTypeObservation2InsertData).then(function (item) {
                    }).catch(function (err) {
                    });
                  }
                }

                insertLogs['success']['count']++;
                insertLogs['success']['rows'][insertLogs['success']['rows'].length] = {
                  sciCode: data[key]['sciCode'],
                  testNo: data[key]['testNo'],
                  reportNo: data[key]['reportNo'],
                };
              }).catch(function (err) {
                insertLogs['fail']['count']++;
                insertLogs['fail']['rows'][insertLogs['fail']['rows'].length] = {
                  sciCode: data[key]['sciCode'],
                  testNo: data[key]['testNo'],
                  reportNo: data[key]['reportNo'],
                  error: err.message
                };
              });

              const promise = new Promise((resolve) => {
                resolve(key);
              });
              promises.push(promise);
            }
          }
          await Promise.all(promises);

          const updateArray = {
            count: insertLogs['success'].count + insertLogs['duplicate'].count,
            rows: [...insertLogs['success'].rows, ...insertLogs['duplicate'].rows]
          };

          if (!updateArray.count) {
            return response(res, status.DATA_AVAILABLE, 200, updateArray);
          } else {

            const method = 'POST';
            const url = process.env.GOT_UPDATE_DATA_URL ?? '';

            const dataSet = {
              apiKey: process.env.GOT_INSPECTION_SYNC_KEY ?? '',
              data: updateArray.rows
            };

            let axiosResponse = (await this.axiosFunction(dataSet, url, method));

            const axiosStatus = axiosResponse.result['EncryptedResponse'] && axiosResponse.result['EncryptedResponse']['status_code'] ? axiosResponse.result['EncryptedResponse']['status_code'] :  axiosResponse.status;
            const axiosMessage = axiosResponse.result['EncryptedResponse'] && axiosResponse.result['EncryptedResponse']['message'] ? axiosResponse.result['EncryptedResponse']['message'] :  axiosResponse.message;

            return response(res, axiosMessage, axiosStatus, {});
          }
        }
      }
    } catch (error) {
      returnResponse = {
        error: error.message
      }
      // console.log(returnResponse);
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  };

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

      if (contentType && contentType==='xml') {
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

  static createGOTUserforMonitoringnewold = async (req, res) => {
    const { internalCall } = req.body;
    let userName =req.body.name;
    let userId =req.body.userId;
    // console.log("6678",req.body);
    let returnResponse = {};
    try {
      let rules = {
        'userId': 'required|string',
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
      } else {
        let requestDataGotUserInspection ={}
        requestDataGotUserInspection = {
              "appKey":"jhgkjKJHKJH7687REZRESDUYIUH098987987FGDETRCbvcdzgvjhkl9",
              "stateCode":"CENTRAL",
              "userid":userId,
              "password":"Seeds#234",
              "name":userName,
              "role":"SCI"
            }
            // external_api
          // console.log("guyru",requestDataGotUserInspection);
}

    }

    catch (error) {
      returnResponse = {
        error: error.message
      }
    }

  }


  static createGOTUserforMonitoring = async (req, res) => {
   
    let returnResponse = {};
    try {
      let rules = {
        'gotMonTeamId': 'required',
        'testNumbers': 'required|array',  
        'testNumbers.*': 'string',
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
        return response(res, status.BAD_REQUEST, 400, returnResponse);
      } else {
        const gotMonTeamId = req.body.gotMonTeamId;
        const teamLeadData = await db.sequelize.query(
          "SELECT got_monitoring_team_members.id, got_monitoring_team_members.got_monitoring_team_id, got_monitoring_team_members.name, got_monitoring_team_members.user_name FROM got_monitoring_team_members WHERE got_monitoring_team_members.is_team_lead = true AND got_monitoring_team_members.got_monitoring_team_id = :got_monitoring_team_id ",
          {
            replacements: { got_monitoring_team_id: gotMonTeamId  },
            type: QueryTypes.SELECT
          }
        );
        
        if (!(teamLeadData && teamLeadData.length && teamLeadData[0])) {
          response(res, status.UNAUTHORIZED_USER, 401, returnResponse);
        } else if (!(teamLeadData[0]['id'] && teamLeadData[0]['got_monitoring_team_id'])) {
          response(res, status.USER_NOT_EXIST, 404, returnResponse);
        } else {
          const method = 'POST';
          const url = process.env.GOT_CREATE_USER_URL ?? '';

          const dataSet = {
            appKey: process.env.GOT_CREATE_USER_KEY ?? '',
            stateCode:"CENTRAL",
            userid:teamLeadData[0]['user_name'],
            password:"Seeds#234",
            name:teamLeadData[0]['name'],
            role:"SCI"
          };

        
          let axiosResponse = (await this.axiosFunction(dataSet, url, method));
          const axiosStatus = axiosResponse.status;
          const axiosMessage = axiosResponse.message;
          const axiosResult = axiosResponse.result;

          const gotMonTeamMemId = teamLeadData[0]['id'];
          // start second api work

          const sortOrder = req.body.sort ? req.body.sort : 'got_testing.id';
          const sortDirection = req.body.order ? req.body.order : 'DESC';

          const mid_query = "from got_testing " +
          "inner join got_showing_details on got_showing_details.got_testing_id = got_testing.id and got_showing_details.user_id = got_testing.bspc_id " +
          "inner join generate_sample_slips on generate_sample_slips.unique_code = got_testing.unique_code " +
          "inner join got_monitoring_team_members on got_monitoring_team_members.got_monitoring_team_id = got_testing.got_monitoring_team_id and got_monitoring_team_members.is_team_lead = true " +
          "inner join agency_details on agency_details.user_id = got_testing.bspc_id " +
          "inner join m_crops on m_crops.crop_code = got_testing.crop_code " +
          "inner join m_crop_varieties on m_crop_varieties.variety_code = got_testing.variety_code " +
          "left join m_variety_lines on m_variety_lines.variety_code = got_testing.variety_code and m_variety_lines.line_variety_code = got_testing.variety_line_code " +
          "inner join agency_details AS user_agency on user_agency.user_id = got_testing.user_id " +
          "where got_monitoring_team_members.id = :gotMonTeamMemId  AND got_testing.test_number IN (:testNumbers) ";

          const select = `SELECT
          CASE WHEN got_showing_details.date_of_showing IS NOT NULL THEN got_showing_details.date_of_showing::varchar ELSE '' END AS "showingDate",
          CASE WHEN generate_sample_slips.lot_no IS NOT NULL THEN generate_sample_slips.lot_no::varchar ELSE '' END AS "intakeLotNum",
          CASE WHEN m_crops.crop_name IS NOT NULL THEN m_crops.crop_name::varchar ELSE '' END AS "cropName",
          CASE WHEN got_testing.crop_code IS NOT NULL THEN got_testing.crop_code::varchar ELSE '' END AS "cropCode",
          CASE WHEN agency_details.agency_name IS NOT NULL THEN agency_details.agency_name::varchar ELSE '' END AS "testingLab",
          CASE WHEN got_testing.bspc_id IS NOT NULL THEN got_testing.bspc_id::varchar ELSE '' END AS "testingLabCode",
          'forwardedToLAB' AS "status",  
          CASE WHEN m_crop_varieties.variety_name IS NOT NULL THEN m_crop_varieties.variety_name::varchar ELSE '' END AS "varietyName",
          CASE WHEN got_testing.variety_code IS NOT NULL THEN got_testing.variety_code::varchar ELSE '' END AS "varietyCode",
          CASE WHEN generate_sample_slips.class_of_seed IS NOT NULL THEN generate_sample_slips.class_of_seed::varchar ELSE 'BREEDER' END AS "sourceClass",
          'BREEDER' AS "destinationClass",  
          CASE WHEN got_testing.unique_code IS NOT NULL THEN got_testing.unique_code::varchar ELSE '' END AS "uniqueCode",
          CASE WHEN got_testing.created_at IS NOT NULL THEN got_testing.created_at::varchar ELSE '' END AS "samplingDate",
          CASE WHEN got_testing.bspc_id IS NOT NULL THEN got_testing.bspc_id::varchar ELSE '' END AS "spaCode",
          CASE WHEN agency_details.agency_name IS NOT NULL THEN agency_details.agency_name::varchar ELSE '' END AS "spaName",
          CASE WHEN got_testing.bspc_id IS NOT NULL THEN got_testing.bspc_id::varchar ELSE '' END AS "sppCode",
          CASE WHEN got_testing.bspc_id IS NOT NULL THEN got_testing.bspc_id::varchar ELSE '' END AS "sppName",
          CASE WHEN got_testing.bspc_id IS NOT NULL THEN got_testing.bspc_id::varchar ELSE '' END AS "userType",
          CASE WHEN CONCAT(got_testing.year, '-', RIGHT((got_testing.year + 1)::VARCHAR, 2)) IS NOT NULL THEN CONCAT(got_testing.year, '-', RIGHT((got_testing.year + 1)::VARCHAR, 2))::varchar ELSE '' END AS "finyear",
          CONCAT( CASE  WHEN got_testing.season IS NOT NULL THEN CASE  WHEN got_testing.season = 'R' THEN 'RABI' WHEN got_testing.season = 'K' THEN 'KHARIF' ELSE got_testing.season::VARCHAR END ELSE '' END, ' (', CASE WHEN got_testing.year IS NOT NULL THEN CASE WHEN got_testing.season = 'R' THEN CONCAT(got_testing.year::VARCHAR, '-', (got_testing.year + 1) % 100) ELSE got_testing.year::VARCHAR END ELSE '' END,')') AS "season",
          'K23-10-2229' AS "cropRegCode",  
          'GOT' AS "test",  
          CASE WHEN user_agency.state_id IS NOT NULL THEN user_agency.state_id::varchar ELSE '' END AS "stateCode",
          CASE WHEN got_testing.id IS NOT NULL THEN got_testing.id::varchar ELSE '' END AS "sLSerial",
          CASE WHEN CONCAT('SL-', got_testing.id) IS NOT NULL THEN CONCAT('SL-', got_testing.id)::varchar ELSE '' END AS "letterNo",
          CASE WHEN agency_details.agency_name IS NOT NULL THEN agency_details.agency_name::varchar ELSE '' END AS "sampleForwardedToCCCByROName",
          CASE WHEN got_testing.updated_at IS NOT NULL THEN got_testing.updated_at::varchar ELSE '' END AS "recieveDateByLAB",
          'RCVD' AS "recieveStatus",  
          CASE WHEN got_testing.bspc_id IS NOT NULL THEN got_testing.bspc_id::varchar ELSE '' END AS "recievedBy",
          CASE WHEN got_testing.test_number IS NOT NULL THEN got_testing.test_number::varchar ELSE '' END AS "showTestNo",
          CASE WHEN got_testing.test_number IS NOT NULL THEN got_testing.test_number::varchar ELSE '' END AS "testNo",
          CASE WHEN got_testing.bspc_id IS NOT NULL THEN got_testing.bspc_id::varchar ELSE '' END AS "testNoGeneratedBy",
          CASE WHEN got_testing.updated_at IS NOT NULL THEN got_testing.updated_at::varchar ELSE '' END AS "testNoGenerationDate",
          CASE WHEN got_monitoring_team_members.name IS NOT NULL THEN got_monitoring_team_members.name::varchar ELSE '' END AS "sciName",
          CASE WHEN got_monitoring_team_members.user_name IS NOT NULL THEN got_monitoring_team_members.user_name::varchar ELSE '' END AS "sciCode"`;
          

          const data = await db.sequelize.query(
            select +
            mid_query +
            "group by got_showing_details.date_of_showing, generate_sample_slips.lot_no, generate_sample_slips.class_of_seed, got_monitoring_team_members.user_name, got_monitoring_team_members.name, user_agency.state_id, m_crops.crop_name,got_testing.crop_code, agency_details.agency_name, got_testing.bspc_id, m_crop_varieties.variety_name, got_testing.variety_code, got_testing.unique_code, got_testing.created_at, got_testing.updated_at, got_testing.year, got_testing.season, agency_details.state_id, got_testing.id, got_testing.consignment_number, got_testing.bspc_id, got_testing.test_number  " +
            "order by " + sortOrder + " " + sortDirection + " " + ";",
            {
              replacements: { gotMonTeamMemId: gotMonTeamMemId , testNumbers: req.body.testNumbers },
              type: QueryTypes.SELECT
            }
          );
          
          if(!(data && data.length)) {
            response(res, status.DATA_NOT_AVAILABLE, 200, returnResponse);
          } else {
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

            const promises = [];
            for (const key in data) {
              data[key]['teamData'] = (teamMemberData && teamMemberData.length) ? teamMemberData : [];

              const promise = new Promise((resolve) => {
                resolve(key);
              });
              promises.push(promise);
            }
            await Promise.all(promises);

            const method = 'POST';
            const url = process.env.GOT_APP_LOGIN_URL ?? '';
  
            const dataSet = {
              auth: {
                stateCode: "CENTRAL",
                apiKey: process.env.GOT_APP_LOGIN_KEY ?? '',
              },
              data: data,
            };
  
            let axiosResponse = (await this.axiosFunction(dataSet, url, method));
            const axiosStatus = axiosResponse.status;
            const axiosMessage = axiosResponse.message;
            const axiosResult = axiosResponse.result;
            response(res, axiosMessage, axiosStatus, axiosResult);
          }
        }
      }
    } catch (error) {
      returnResponse = {
        error: error.message
      };
      response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  };

  static getInspectionuser = async (req, res) => {
    try {
      let rules = {
        'testNumbers': 'required|array',  
        'testNumbers.*': 'string',
      };
      let validation = new Validator(req.body, rules);
      const isValidData = validation.passes();
  
      if (!isValidData) {
        const returnResponse = {};
        for (let key in rules) {
          const error = validation.errors.get(key);
          if (error.length) {
            returnResponse[key] = error;
          }
        }
        return res.status(400).json({ errors: returnResponse }); // Send validation errors
      } else {
        const { testNumbers } = req.body;
  
        // Sequelize query
        const season = await bspPerestingsBspFiveModel.findAll({
          attributes: ['*'],
          where: {
            test_no: {
              [Op.in]: testNumbers, 
            },
          },
          raw: true, // Return raw objects instead of Sequelize models
        });
  
        // Send response
        return res.status(200).json({ data: season });
      }
    } catch (error) {
      const returnResponse = {
        error: error.message,
      };
      return res.status(500).json(returnResponse); // Handle unexpected errors
    }
  };
  
  




}
module.exports = GotTestingController;
