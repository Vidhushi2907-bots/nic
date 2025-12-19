require("dotenv").config();
let Validator = require("validatorjs");
const response = require("../_helpers/response");
const status = require("../_helpers/status.conf");
const db = require("../models");
const { gotTestingModel,cropModel,cropVerietyModel,varietLineModel,userModel,commentsModel,gotShowingDetailsModel,districtModel,stateModel,gotMonitoringTeamsModel,gotMonitoringTeamsMemberModel,designationModel,agencyDetailModel,generateSampleSlipsModel } = db;
const sequelize = require("sequelize");
const sequelizer = require("../models/db");
const ConditionCreator = require("../_helpers/condition-creator");
const productiohelper = require("../_helpers/productionhelper");
const { where } = require("../models/db");
const attributes = require("validatorjs/src/attributes");
const Op = require("sequelize").Op;

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
        },
        order: [['year', 'ASC']],
        raw: true,
      });
      if (!years || years.length === 0) {
        return response(res, 'No data found.', 404);
      }
       return response(res, 'data found successfully.', 200,years);
    } catch (error) {
      console.log('error', error)
      return response(res, status.UNEXPECTED_ERROR, 501, error.message);
    }
  };

  static getGotSampleReceptionSeason = async (req, res) => {
    let filters = {};
    const {year} = req.body;
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
        return response(res, 'data found successfully.', 200,season);
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
        return response(res, 'data found successfully.', 200,crop_code);
    } catch (error) {
      console.log('error', error)
      return response(res, status.UNEXPECTED_ERROR, 501, error.message);
    }
  };

  static getGotSampleReceptionConsignment = async (req, res) => {
    let filters = {};
    const { year, season,crop_code } = req.body;
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
      return response(res, 'data found successfully.', 200,ConsignmentNumber);
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
          'id', 'year', 'season', 'crop_code', 'variety_code', 'bspc_id','test_number','unique_code', 'status', 'reason_id',
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
      return response(res, 'data found successfully.', 200,groupedResults);
    } catch (error) {
      console.log('error', error)
      return response(res, status.UNEXPECTED_ERROR, 501, error.message);
    }
  };
  
  static getGotSampleReceptionReason = async (req, res) => {
    try {
      const reasons = await commentsModel.findAll({
        attributes: ['id','comment'],
        where: {
          type: 'GOT_MONITORING_TEAM'
        },
        raw: true,
      });
      if (!reasons || reasons.length === 0) {
        return response(res, 'No data found.', 404);
      }
        return response(res, 'data found successfully.', 200,reasons);
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
      const { consignment_number,getAlltest_number,year,season,crop_code } = req.body;
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
      if(getAlltest_number){
        if(year){
          filters.year = year;
        }
        if(season){
          filters.season = season;
        }
        if(crop_code){
          filters.crop_code = crop_code;
        }
      }
      filters.test_number = { [Op.ne]: null };
  
      const testNumber = await gotTestingModel.findAll({
        attributes: ['test_number'],
        where: {
          ...filters,
          test_number: { [sequelize.Op.ne]: null, [sequelize.Op.ne]: '' }
        },
        order: [['created_at', 'ASC']],
        raw: true,
      });
      if (!testNumber || testNumber.length === 0) {
        return response(res, 'No data found.', 404);
      }

      return response(res, 'data found successfully.', 200,testNumber);
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
          'id','variety_code','test_number','unique_code',
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
      return response(res, 'data found successfully.', 200,groupedResults);
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
      return response(res, 'data save successfully.', 200,gotShowingDetail);
    } catch (error) {
      console.log('error', error)
      return response(res, status.UNEXPECTED_ERROR, 501, error.message);
    }
  };

  static getGotShowingDetailsList = async (req, res) => {
    try {
      const filters = {};
      const { test_number,year,season,crop_code,consignment_number }= req.body;
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
        attributes:['id','address','state_code','district_code','area_shown','date_of_showing','expected_start_date','expected_end_date','user_id','is_report_genertaed',
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
      return response(res, 'data found successfully.', 200,gotShowingDetailsList);
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
      const { id, state_code, district_code, address, user_id, area_shown,date_of_showing, expected_start_date, expected_end_date, is_report_genertaed } = req.body;
     
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
       return response(res, 'data found successfully.', 200,years);
    } catch (error) {
      console.log('error', error)
      return response(res, status.UNEXPECTED_ERROR, 501, error.message);
    }
  };

  static getMonitoringTeamSeason = async (req, res) => {
    let filters = {};
    let filters2 = {};
    const {year} = req.body;
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
      return response(res, 'data found successfully.', 200,season);
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
        attributes: [[sequelize.col('got_monitoring_team.team_name'), 'team_name'],[sequelize.col('got_monitoring_team.id'), 'id']],
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
      const { team_name, is_active, got_test_number, members } = req.body;
      const testNumberArray = got_test_number.map((test) => test.test_number);
        const newTeam = await gotMonitoringTeamsModel.create(
        {
          team_name,
          is_active,
          got_test_number: testNumberArray,
        },
        { transaction }
      );
      if (members && Array.isArray(members)) {
        const memberPromises = members.map((member) => gotMonitoringTeamsMemberModel.create(
            {
              got_monitoring_team_id: newTeam.id,
              name: member.name,
              designation_id: member.designation_id,
              mobile_number: member.mobile_number,
              email_id: member.email_id,
              pin_code: member.pin_code,
              user_name: member.user_name,
              is_team_lead: member.is_team_lead,
            },
            { transaction }
          )
        );
        await Promise.all(memberPromises);
      }
      await gotTestingModel.update(
        { got_monitoring_team_id: newTeam.id },
        {
          where: {
            test_number: { [sequelize.Op.in]: testNumberArray }
          }
        }
      );
      await transaction.commit();
      return response(res, 'data saved successfully.', 200, newTeam);
    } catch (error) {
      await transaction.rollback();
      console.log('error', error)
      return response(res, status.UNEXPECTED_ERROR, 501, error.message);
    }
  };

  static updateMonitoringTeam = async (req, res) => {
    const transaction = await sequelizer.transaction();
    try {
      const { got_test_number, team_name, is_active, members } = req.body;
        const team = await gotMonitoringTeamsModel.findOne({
        where: { got_test_number },
        transaction,
      });
      if (!team) {
        return response(res, 'Team not found!', 404);
      }
      await team.update(
        {
          team_name,
          is_active,
        },
        { transaction }
      );
      await gotMonitoringTeamsMemberModel.destroy({
        where: { got_monitoring_team_id: team.id },
        transaction,
      });
      if (members && Array.isArray(members)) {
        const memberPromises = members.map(member =>
          gotMonitoringTeamsMemberModel.create(
            {
              got_monitoring_team_id: team.id,
              name: member.name,
              designation_id: member.designation_id,
              mobile_number: member.mobile_number,
              email_id: member.email_id,
              pin_code: member.pin_code,
              user_name: member.user_name,
              is_team_lead: member.is_team_lead,
            },
            { transaction }
          )
        );
        await Promise.all(memberPromises);
      }
      const gotTestingDetails = await gotTestingModel.findOne({
        where: { test_number: got_test_number },
        transaction,
      });
      if (gotTestingDetails) {
        await gotTestingDetails.update(
          { got_monitoring_team_id: team.id },
          { transaction }
        );
      }
      await transaction.commit();
      return response(res, 'Data updated successfully.', 200, team);
    } catch (error) {
      await transaction.rollback();
      console.log('error', error)
      return response(res, status.UNEXPECTED_ERROR, 501, error.message);
    }
  };

  static getMonitoringTeamList = async (req, res) => {
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
          [sequelize.col('got_monitoring_team.members.m_designation.name'), 'designation_name'],
        ],
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
            include: [
              {
                model: gotMonitoringTeamsMemberModel,
                as:'members',
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

  static deleteMonitoringTeam = async (req, res) => {
    const transaction = await sequelizer.transaction();
    try {
      const { got_monitoring_team_id } = req.body;
        const team = await gotMonitoringTeamsModel.findOne({
        where: { id:got_monitoring_team_id },
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

  static getGotMonitoringTeamTestNumber = async (req, res) => {
    try {
      let id = req.body.loginedUserid && req.body.loginedUserid.id ? req.body.loginedUserid.id : null;
      const { year,season,crop_code } = req.body;
      let filters = {};
      if (id) {
        filters.bspc_id = id
      }
        if(year){
          filters.year = year;
        }
        if(season){
          filters.season = season;
        }
        if(crop_code){
          filters.crop_code = crop_code;
        }
      filters.test_number = { [Op.ne]: null };
      filters.got_monitoring_team_id= 0;
      const testNumber = await gotTestingModel.findAll({
        attributes: ['test_number'],
        where: {
          ...filters,
          test_number: { [sequelize.Op.ne]: null, [sequelize.Op.ne]: '' }
        },
        order: [['created_at', 'ASC']],
        raw: true,
      });
      if (!testNumber || testNumber.length === 0) {
        return response(res, 'No data found.', 404);
      }

      return response(res, 'data found successfully.', 200,testNumber);
    } catch (error) {
      console.log('error', error)
      return response(res, status.UNEXPECTED_ERROR, 501, error.message);
    }
  };
  
}
module.exports = GotTestingController;
