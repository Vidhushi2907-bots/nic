require('dotenv').config()
let Validator = require("validatorjs");
const response = require('../_helpers/response')
const status = require('../_helpers/status.conf')
const db = require("../models");
const { stateModel, districtModel, bsp3ProformaReinspectionsModel, commentsModel, agencytypeModel, bspProforma3MembersModel, indentOfBrseedDirectLineModel, varietyCategoryMappingModel, designationModel, monitoringTeamOfBspc, monitoringTeamOfBspcMember, bspProforma1BspcsModel, bspProforma1sModel, cropModel, bspProrforma3Model, bspProrforma2Model, agencyDetailModel, varietyModel, directIndentModel, indentYearModel, userModel, investHarvestingModel } = db;
const sequelize = require('sequelize');
const ConditionCreator = require('../_helpers/condition-creator');
const { cropGroupModel } = require('../models');
const bsp_proforma_3_membersModel = require('../models/bsp_proforma_3_members.model');
const productiohelper = require('../_helpers/productionhelper');
const { where } = require('../models/db');
const { includes } = require('lodash');
const varietyLinesModel = db.varietyLinesModel;
const Op = require('sequelize').Op;

class IndentorController {

  static saveDirectIndent = async (req, res) => {
    try {
      const {
        year,
        season,
        crop_code,
        variety_code,
        state_code,
        district_code,
        spa_name,
        spa_id,
        spa_address,
        spa_mobile_number,
        quantity,
        is_active,
        user_id,
        email_id,
        perental_line_array
      } = req.body;

      let rules = {
        year: 'required',
        season: 'required',
        crop_code: 'required',
        user_id: 'required',
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
      const userExists = await userModel.findByPk(user_id);
      if (!userExists) {
        return response(res, status.BAD_REQUEST, 400, { message: 'User with the provided user_id does not exist.' });
      }
      const newDirectIndent = await directIndentModel.create({
        year,
        season,
        crop_code,
        variety_code,
        state_code,
        district_code,
        spa_name,
        spa_id,
        spa_address,
        spa_mobile_number,
        quantity,
        is_active,
        user_id,
        email_id
      });
      let totalQuantity = 0;
      for (const line of perental_line_array) {
        totalQuantity = totalQuantity + line.quantity;
        const data = await indentOfBrseedDirectLineModel.create({
          indent_of_breederseed_direct_id: newDirectIndent.id,
          quantity: line.quantity,
          variety_code_line: line.variety_code_line,
        });
      }
      if (perental_line_array.length > 0) {
        await directIndentModel.update(
          { quantity: totalQuantity },
          { where: { id: newDirectIndent.id } });
      }
      res.status(200).json({
        status: 200,
        message: 'Data saved successfully',
        data: newDirectIndent
      });
    } catch (error) {
      console.error('Error saving data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static getAllDirectIndents = async (req, res) => {
    try {
      const { page, pageSize, crop, year, variety, season, user_id } = req.body;
      const offset = (page - 1) * pageSize;
      const limit = pageSize;

      const filterOptions = {
        offset,
        limit,
        order: [['created_at', 'DESC']],
        attributes: ['spa_name', 'quantity', 'spa_id', 'variety_code', 'id', 'year', 'season', 'crop_code', 'state_code', 'district_code', 'spa_address', 'spa_mobile_number', 'email_id', 'created_at',
          [sequelize.col('m_crop.crop_name'), 'crop_name'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [sequelize.col('m_state.state_name'), 'state_name'],
        ],
        raw: true,
        include: [
          {
            model: cropModel,
            attributes: [],
            required: true
          },
          {
            model: varietyModel,
            attributes: [],
            required: true
          },
          {
            model: stateModel,
            attributes: [],
            required: true
          }
        ]
      };

      if (crop) {
        filterOptions.where = {
          crop_code: crop
        };
      }
      if (year) {
        filterOptions.where = {
          ...filterOptions.where,
          year: year
        };
      }
      if (variety) {
        filterOptions.where = {
          ...filterOptions.where,
          variety_code: variety
        };
      }
      if (season) {
        filterOptions.where = {
          ...filterOptions.where,
          season: season
        };
      }
      if (user_id) {
        filterOptions.where = {
          ...filterOptions.where,
          user_id: user_id
        };
      }

      const { count, rows: directIndents } = await directIndentModel.findAndCountAll(filterOptions);
      const directIndentLineData = await indentOfBrseedDirectLineModel.findAll({
        where: {
          indent_of_breederseed_direct_id: directIndents.map(indent => indent.id),
        },
        attributes: ['indent_of_breederseed_direct_id', 'quantity', 'variety_code_line']
        [sequelize.col('m_variety_lines.line_variety_name'), 'line_variety_name'],
        include: [
          {
            model: varietyLinesModel,
            attributes: ['line_variety_name'],
            required: false,
          },
        ],
        row: false
      });
      const formattedDirectIndentLineData = directIndentLineData.map(lineData => {
        const mVarietyLines = lineData.dataValues.m_variety_lines || [];
        const lineVarietyNames = mVarietyLines.map(varietyLine => varietyLine.line_variety_name);
        return {
          ...lineData.dataValues,
          m_variety_lines: lineVarietyNames,
        };
      });
      const directIndentLinesMap = new Map();
      formattedDirectIndentLineData.forEach(line => {
        const indentId = line.indent_of_breederseed_direct_id;
        if (indentId !== null && indentId !== undefined) {
          if (!directIndentLinesMap.has(indentId)) {
            directIndentLinesMap.set(indentId, []);
          }
          directIndentLinesMap.get(indentId).push({
            quantity: line.quantity,
            variety_code_line: line.variety_code_line,
            indent_of_breederseed_direct_id: line.indent_of_breederseed_direct_id,
            line_variety_name: line.m_variety_lines[0]
          });
        }
      });

      const directIndentsWithLines = directIndents.map(indent => {
        const lines = directIndentLinesMap.get(indent.id) || [];
        return {
          ...indent,
          parental_line: lines.length ? lines : null,
        };
      });
      const varietyCodes = directIndentsWithLines.map(indent => indent.variety_code);
      const notificationYears = await varietyModel.findAll({
        attributes: ['variety_code', 'not_date'],
        where: { variety_code: varietyCodes },
      });

      const directIndentsWithNotificationYears = directIndentsWithLines.map(indent => {
        const notificationYear = notificationYears.find(
          year => year.variety_code === indent.variety_code
        );
        return {
          ...indent,
          notification_year: notificationYear ? new Date(notificationYear.not_date).getFullYear() : null,
        };
      });
      res.status(200).json({
        status: 200,
        message: 'Data retrieved successfully',
        data: {
          directIndents: directIndentsWithNotificationYears,
          total: count,
        }
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  static viewAllCropForDirectIndent = async (req, res) => {
    try {
      const data = await cropModel.findAll({
        order: [['crop_name', 'ASC']],
      });
      response(res, status.DATA_AVAILABLE, 200, data);
    } catch (error) {
      console.error(error);
      response(res, status.DATA_NOT_AVAILABLE, 500);
    }
  };

  static getIndentYear = async (req, res) => {
    try {
      const activeFinYears = await indentYearModel.findAll({
        where: {
          is_active: 1
        }
      });

      res.status(200).json({
        status: 200,
        message: 'Active financial years retrieved successfully',
        data: activeFinYears
      });
    } catch (error) {
      console.error('Error fetching active financial years:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static deleteDirectIndent = async (req, res) => {
    try {
      const { id } = req.body;
      if (!id) {
        return response(res, status.BAD_REQUEST, 400, {
          message: "ID is required in the request body.",
        });
      }
      const directIndentRecord = await directIndentModel.findByPk(id);
      if (!directIndentRecord) {
        return response(res, status.NOT_FOUND, 404, { message: 'Direct Indent record not found.' });
      }
      await directIndentRecord.destroy();
      const directIndentlineData = await indentOfBrseedDirectLineModel.findAll({
        where: { indent_of_breederseed_direct_id: id }
      });
      if (directIndentlineData) {
        for (const lineData of directIndentlineData) {
          await lineData.destroy();
        }
      }
      res.status(200).json({
        status: 200,
        message: 'Data deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static getSpaList = async (req, res) => {
    try {
      const { state_id } = req.body;
      const agencyDetails = await agencyDetailModel.findAll({
        where: {
          state_id: state_id
        },
        attributes: [
          [sequelize.col('user.name'), 'spa_name'],
          [sequelize.col('user.spa_code'), 'spa_code'],
          [sequelize.col('agency_details.agency_name'), 'name'],
          [sequelize.col('agency_details.state_id'), 'state_id'],
          [sequelize.col('agency_details.address'), 'address'],
          [sequelize.col('agency_details.state_id'), 'state_id'],
          [sequelize.col('agency_details.mobile_number'), 'mobile_number'],
          [sequelize.col('agency_details.email'), 'email_id'],
        ],
        raw: true,
        include: [{
          attributes: ["name", "spa_code"],
          model: userModel,
          where: {
            [Op.and]: [{ user_type: "SPA" },
            { spa_code: { [Op.not]: null } }]
          },
        }]
      });
      res.status(200).json({
        status: 200,
        message: 'SPA data retrieved successfully',
        data: agencyDetails
      });
    } catch (error) {
      console.error("Error fetching SPA list:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static updateDirectIndent = async (req, res) => {
    try {
      const {
        year,
        season,
        crop_code,
        variety_code,
        state_code,
        district_code,
        spa_name,
        spa_id,
        spa_address,
        spa_mobile_number,
        quantity,
        is_active,
        email_id,
        id,
        perental_line_array
      } = req.body;
      if (!id) {
        return response(res, status.BAD_REQUEST, 400, {
          message: "ID is required in the request body.",
        });
      }
      const dataExists = await directIndentModel.findByPk(id);
      if (!dataExists) {
        return response(res, status.BAD_REQUEST, 400, { message: 'Data does not exist with the provided id.' });
      }
      const updatedDirectIndent = await directIndentModel.update(
        {
          year,
          season,
          crop_code,
          variety_code,
          state_code,
          district_code,
          spa_name,
          spa_id,
          spa_address,
          spa_mobile_number,
          quantity,
          is_active,
          email_id,
        },
        {
          where: { id },
          returning: true,
        }
      );

      if (updatedDirectIndent[0] === 0) {
        return response(res, status.NOT_FOUND, 404, { message: 'Direct indent record not found for the provided id.' });
      }
      if (perental_line_array) {
        await indentOfBrseedDirectLineModel.destroy({
          where: { indent_of_breederseed_direct_id: id },
        });
        let totalQuantity = 0;
        for (const line of perental_line_array) {
          totalQuantity = totalQuantity + line.quantity;
          await indentOfBrseedDirectLineModel.create({
            indent_of_breederseed_direct_id: id,
            quantity: line.quantity,
            variety_code_line: line.variety_code_line,
          });
        }
        if (perental_line_array.length > 0) {
          await directIndentModel.update(
            { quantity: totalQuantity },
            { where: { id } });
        }
      }
      res.status(200).json({
        status: 200,
        message: 'Data updated successfully',
        data: updatedDirectIndent[1][0],
      });
    } catch (error) {
      console.error('Error updating data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  static getBspProforma3Data = async (req, res) => {
    try {
      const { user_id, cropCode, varietyCode, year, season, variety_code_array } = req.body;
      // user_id = '25';
      if (!user_id) {
        return response(res, status.BAD_REQUEST, 400, {
          message: "user_id is required in the request body.",
        });
      }
      const whereClause = {};
      if (cropCode) {
        whereClause.crop_code = cropCode;
      }
      if (varietyCode && varietyCode.length > 0) {
        whereClause.variety_code = {
          [Op.in]: varietyCode
        };
      }
      if (year) {
        whereClause.year = year;
      }
      if (season) {
        whereClause.season = season;
      }
      // const bspProformaID = await bspProrforma3Model.findOne({
      //   where: whereClause,
      //   include: [
      //     {
      //       model: bspProrforma2Model,
      //       where: { user_id: user_id },
      //       as: 'bspProforma2',
      //       required: true,
      //     },
      //   ],
      // });
      // const whereClause1 = {};
      // let isReinspection ;
      // if(bspProformaID){
      //    isReinspection = await bspProforma3MembersModel.findOne({
      //     where: { 
      //       is_active: 0,
      //       bsp3_id: bspProformaID.id 
      //     },
      //   });      
      // }     
      // if(isReinspection && bspProformaID.report == 'Re-monitoring after 15 days'){
      //   whereClause1.is_active = 0;
      //   } else{
      //     whereClause1.is_active = 1;
      // }
      // console.log("whereClause1====",whereClause1);
      const bspProforma3Data = await bspProrforma3Model.findAll({
        where: whereClause,
        include: [
          {
            model: bspProrforma2Model,
            // attributes: ['address', 'area_shown','class_of_seed_sown', 'date_of_showing','expected_harvest_from','expected_harvest_to','expected_inspection_from','expected_inspection_to',
            //   'expected_production','field_code','id','is_inspected','is_active','is_freezed','m_district','m_state','plot_no','production_type','qty_of_seed_sown',
            //   'quantity_of_bs_shown','quantity_of_ns_shown','ref_no','ref_number','season','state_code','user_id','variety_code','variety_line_code','year'
            // ],
            where: { user_id: user_id },
            as: 'bspProforma2',
            required: true,
            include: [
              {
                model: stateModel,
                attributes: ['state_name']
              },
              {
                model: districtModel,
                attributes: ['district_name']
              },
              {
                model: bspProforma1BspcsModel,
                attributes: ['bspc_id', 'bspc_proforma_1_id'],
                bspc_id: sequelize.col('bspProrforma2.user_id'),
                required: false,
                include: [
                  {
                    model: bspProforma1sModel,
                    id: sequelize.col('bspProforma1BspcsModel.bspc_proforma_1_id'),
                    attributes: ['id', 'created_at']
                  }
                ]
              },
            ],
          },
          {
            model: varietyLinesModel,
            attributes: ['line_variety_name'],
            required: false
          },
          {
            model: commentsModel,
            as: 'comment',
            required: false
          },
          {
            model: varietyModel,
            attributes: ['variety_name']
          },
          {
            model: cropModel,
            attributes: ['crop_name']
          },
          {
            model: bspProforma3MembersModel,
            attributes: ['id', 'is_active'],
            required: false,
            as: 'monitoringTeam',
            // where: whereClause1, 
            include: [
              {
                model: monitoringTeamOfBspcMember,
                id: sequelize.col('monitoringTeam.monitoring_team_of_bspc_members_id'),
                attributes: ['designation_id', 'state_code', 'district_code', 'name', 'is_active'],
                as: 'monitoringMember',
                include: [
                  {
                    model: stateModel,
                    state_code: sequelize.col('monitoringMember.state_code'),
                    attributes: ['id', 'state_name'],
                  },
                  {
                    model: districtModel,
                    state_code: sequelize.col('monitoringMember.district_code'),
                    attributes: ['id', 'district_name'],
                  },
                  {
                    model: designationModel,
                    id: sequelize.col('monitoringMember.designation_id'),
                    attributes: ['name', 'type'],
                  },
                  {
                    model: agencytypeModel,
                    state_code: sequelize.col('monitoringMember.type_of_agency'),
                    attributes: ['id', 'name'],
                  },
                ]
              }
            ]
          },
          {
            model: bsp3ProformaReinspectionsModel,
            required: false,
            as: 'reinspection_data'
          },
        ],
        order: [[sequelize.col('bspProforma2.id'), 'DESC']]
      });
      const agencyDetails = await agencyDetailModel.findOne({
        where: { user_id: user_id },
        include: [
          {
            model: stateModel,
            attributes: []
          },
          {
            model: districtModel,
            attributes: []
          },
        ],

        attributes: ['user_id', 'agency_name', 'image_url', 'address',
          [sequelize.col('m_state.state_name'), 'state_name'],
          [sequelize.col('m_district.district_name'), 'district_name']
        ]
      });

      const responseData = bspProforma3Data.map(item => {
        return {
          ...item.toJSON(),
          agencyDetails: {
            ...agencyDetails.toJSON()
          }
        };
      });
      const response = {
        status: 200,
        message: 'bspProforma2 data retrieved successfully',
        data: responseData
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  static getBspProforma3DataById = async (req, res) => {
    try {
      const { id, user_id, isRemonitoring } = req.body;
      if (!id) {
        return response(res, status.BAD_REQUEST, 400, {
          message: "id is required in the request body.",
        });
      }
      const whereClause = {};
      if (id) {
        whereClause.id = id;
      }
      const whereClause1 = {};
      const remonitorData = await bspProforma3MembersModel.findOne({
        where: {
          is_active: 0
        }
      });
      if (remonitorData && isRemonitoring == true) {
        whereClause1.is_active = 0;
      } else {
        whereClause1.is_active = 1;
      }

      const bspProforma3Data = await bspProrforma3Model.findAll({
        where: whereClause,
        include: [
          {
            model: bspProrforma2Model,
            where: { user_id: user_id },
            as: 'bspProforma2',
            required: true,
            include: [
              {
                model: stateModel,
                attributes: ['state_name']
              },
              {
                model: districtModel,
                attributes: ['district_name']
              },
              {
                model: bspProforma1BspcsModel,
                attributes: ['bspc_id', 'bspc_proforma_1_id'],
                bspc_id: sequelize.col('bspProrforma2.user_id'),
                required: false,
                include: [
                  {
                    model: bspProforma1sModel,
                    id: sequelize.col('bspProforma1BspcsModel.bspc_proforma_1_id'),
                    attributes: ['id', 'created_at']
                  }
                ]
              },
            ],
            order: [['field_code', 'DESC']]
          },
          {
            model: varietyLinesModel,
            attributes: ['line_variety_name'],
            required: false
          },
          {
            model: commentsModel,
            as: 'comment',
            required: false
          },
          {
            model: varietyModel,
            attributes: ['variety_name']
          },
          {
            model: cropModel,
            attributes: ['crop_name']
          },
          {
            model: bspProforma3MembersModel,
            attributes: ['id'],
            required: false,
            as: 'monitoringTeam',
            where: whereClause1,
            include: [
              {
                model: monitoringTeamOfBspcMember,
                id: sequelize.col('monitoringTeam.monitoring_team_of_bspc_members_id'),
                attributes: ['designation_id', 'state_code', 'district_code', 'name'],
                as: 'monitoringMember',
                include: [
                  {
                    model: stateModel,
                    state_code: sequelize.col('monitoringMember.state_code'),
                    attributes: ['id', 'state_name'],
                  },
                  {
                    model: districtModel,
                    state_code: sequelize.col('monitoringMember.district_code'),
                    attributes: ['id', 'district_name'],
                  },
                  {
                    model: designationModel,
                    id: sequelize.col('monitoringMember.designation_id'),
                    attributes: ['name', 'type'],
                  },
                  {
                    model: agencytypeModel,
                    state_code: sequelize.col('monitoringMember.type_of_agency'),
                    attributes: ['id', 'name'],
                  },
                ]
              }
            ]
          },
          (isRemonitoring) ? {
            model: bsp3ProformaReinspectionsModel,
            required: false,
            as: 'reinspection_data'
          } : null
        ].filter(Boolean),
      });
      const agencyDetails = await agencyDetailModel.findOne({
        where: { user_id: user_id },
        include: [
          {
            model: stateModel,
            attributes: []
          },
          {
            model: districtModel,
            attributes: []
          },
        ],
        attributes: ['agency_name', 'image_url', 'address',
          [sequelize.col('m_state.state_name'), 'state_name'],
          [sequelize.col('m_district.district_name'), 'district_name'],

        ]
      });

      const responseData = bspProforma3Data.map(item => {
        return {
          ...item.toJSON(),
          agencyDetails: {
            ...agencyDetails.toJSON()
          }
        };
      });
      const response = {
        status: 200,
        message: 'bspProforma2 data retrieved successfully',
        data: responseData
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  static getBspProformaYears = async (req, res) => {
    try {
      const { user_id } = req.body;

      if (!user_id) {
        return response(res, status.BAD_REQUEST, 400, {
          message: "user_id is required in the request body.",
        });
      }
      const bspProforma2Data = await bspProrforma2Model.findAll({
        attributes: ['id'],
        where: {
          user_id: user_id
        }
      });

      if (!bspProforma2Data || bspProforma2Data.length === 0) {
        return response(res, status.BAD_REQUEST, 202, {
          message: "User ID not found in bsp_proforma_2s.",
        });
      }
      const bspProforma2IDs = bspProforma2Data.map((data) => data.id);

      const bspProforma3Data = await bspProrforma3Model.findAll({
        attributes: [
          [sequelize.literal('DISTINCT "year"'), 'year'],
        ],
        where: {
          bsp_proforma_2_id: bspProforma2IDs,
        },
        order: [[sequelize.col("year"), "DESC"]]
      });

      res.status(200).json({
        status: 200,
        message: 'Years retrieved successfully',
        data: bspProforma3Data
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  static getBspProformaSeason = async (req, res) => {
    try {
      const { user_id, year } = req.body;

      if (!user_id) {
        return response(res, status.BAD_REQUEST, 202, {
          message: "user_id is required in the request body.",
        });
      }
      if (!year) {
        return response(res, status.BAD_REQUEST, 202, {
          message: "year is required in the request body.",
        });
      }
      const bspProforma2Data = await bspProrforma2Model.findAll({
        attributes: ['id'],
        where: {
          user_id: user_id,
        }
      });

      if (!bspProforma2Data || bspProforma2Data.length === 0) {
        return response(res, status.BAD_REQUEST, 202, {
          message: "User ID not found in bsp_proforma_2s.",
        });
      }
      const bspProforma2IDs = bspProforma2Data.map((data) => data.id);

      const bspProforma3Data = await bspProrforma3Model.findAll({
        attributes: [
          [sequelize.literal('DISTINCT "season"'), 'season']
        ],
        where: {
          bsp_proforma_2_id: bspProforma2IDs,
          year: year
        }
      });

      res.status(200).json({
        status: 200,
        message: 'Season retrieved successfully',
        data: bspProforma3Data
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  static getCropList = async (req, res) => {
    try {
      const { user_id, year, season } = req.body;

      if (!user_id) {
        return response(res, status.BAD_REQUEST, 202, {
          message: "user_id is required in the request body.",
        });
      }
      if (!year) {
        return response(res, status.BAD_REQUEST, 202, {
          message: "year is required in the request body.",
        });
      }
      if (!season) {
        return response(res, status.BAD_REQUEST, 202, {
          message: "season is required in the request body.",
        });
      }

      const bspProforma2Data = await bspProrforma2Model.findAll({
        attributes: ['id'],
        where: {
          user_id: user_id
        }
      });

      if (!bspProforma2Data || bspProforma2Data.length === 0) {
        return response(res, status.BAD_REQUEST, 202, {
          message: "User ID not found in bsp_proforma_2s.",
        });
      }
      const bspProforma2IDs = bspProforma2Data.map((data) => data.id);

      const bspProforma3Data = await bspProrforma3Model.findAll({
        attributes: [
          [sequelize.literal('DISTINCT bsp_proforma_3s.crop_code'), 'crop_code']
        ],
        where: {
          bsp_proforma_2_id: bspProforma2IDs,
          year: year,
          season: season
        },
        include: [
          {
            model: cropModel,
            attributes: ['crop_name'],
            required: true
          }
        ],
        raw: true,
        nest: true
      });

      res.status(200).json({
        status: 200,
        message: 'Crop data retrieved successfully',
        data: bspProforma3Data
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  static getBSP3rdVarietyList = async (req, res) => {
    try {
      const { user_id, year, season, crop_code } = req.body;

      if (!user_id) {
        return response(res, status.BAD_REQUEST, 400, {
          message: "user_id is required in the request body.",
        });
      }
      if (!year) {
        return response(res, status.BAD_REQUEST, 400, {
          message: "year is required in the request body.",
        });
      }
      if (!season) {
        return response(res, status.BAD_REQUEST, 400, {
          message: "season is required in the request body.",
        });
      }
      if (!crop_code) {
        return response(res, status.BAD_REQUEST, 400, {
          message: "crop_code is required in the request body.",
        });
      }

      const bspProforma2Data = await bspProrforma2Model.findAll({
        attributes: ['id'],
        where: {
          user_id: user_id
        }
      });

      if (!bspProforma2Data || bspProforma2Data.length === 0) {
        return response(res, status.BAD_REQUEST, 202, {
          message: "User ID not found in bsp_proforma_2s.",
        });
      }
      const bspProforma2IDs = bspProforma2Data.map((data) => data.id);

      const bspProforma3Data = await bspProrforma3Model.findAll({
        attributes: [
          [sequelize.literal('DISTINCT bsp_proforma_3s.variety_code'), 'variety_code']
        ],
        where: {
          bsp_proforma_2_id: bspProforma2IDs,
          year: year,
          season: season,
          crop_code: crop_code
        },
        include: [
          {
            model: varietyModel,
            attributes: ['variety_name'],
            required: true
          }
        ],
        raw: true,
        nest: true
      });

      res.status(200).json({
        status: 200,
        message: 'Variety data retrieved successfully',
        data: bspProforma3Data
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  static createNewSpa = async (req, res) => {
    try {
      const {
        spa_name,
        state_id,
        address,
        district_id,
        mobile_number,
        email_id,
      } = req.body;
      let existingAgencyData = undefined;

      // Agency Name Already Exist
      existingAgencyData = await agencyDetailModel.findAll({
        // include: [
        //   {
        //     model: userModel,
        //     where: {
        //       user_type: "SPA"
        //     }
        //   }
        // ],
        where: {
          [Op.and]: [
            {
              where: sequelize.where(
                sequelize.fn('lower', sequelize.col('agency_name')),
                sequelize.fn('lower', spa_name),
              ),
              // created_by: { [Op.eq]: req.body.created_by }
            },
          ]
        },
      });
      if (existingAgencyData && existingAgencyData.length) {
        return response(res, status.BAD_REQUEST, 401, {
          message: "Spa Name Already Exist.",
        });
      }

      // Email Already Exists
      let existingEmaiData = await agencyDetailModel.findAll({
        where: {
          [Op.and]: [
            {
              where: sequelize.where(
                sequelize.fn('lower', sequelize.col('email')),
                sequelize.fn('lower', email_id),
              ),
            },
          ]
        },
      });
      if (existingEmaiData.length != 0) {
        return response(res, status.BAD_REQUEST, 401, {
          message: "Email Already Exists.",
        });
      }
      const userData = await userModel.create({
        name: spa_name,
        username: email_id,
        password: '123456',
        user_type: 'SPA',
        is_active: 1,
        mobile_number: mobile_number,
        email_id: email_id,
        unm: email_id,
        spa_code: email_id
      });
      let agencydata;
      if (userData) {
        agencydata = await agencyDetailModel.create({
          user_id: userData.id,
          agency_name: spa_name,
          state_id: state_id,
          district_id: district_id,
          address: address,
          mobile_number: mobile_number,
          email: email_id,
          phone_number: mobile_number,
          is_active: 1,
          spa_name: spa_name
        });
        if (agencydata) {
          await userModel.update(
            { agency_id: agencydata.id },
            { where: { id: userData.id } }
          );
        }
        res.status(200).json({
          status: 200,
          message: 'SPA created successfully',
          userData: userData
        });
      } else {
        res.status(500).json({ error: "Unable to create SPA" });
      }
    } catch (error) {
      console.error("Error creating new SPA:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static getDirectIndentVarietyList = async (req, res) => {
    try {
      const { crop_code } = req.body
      if (!crop_code) {
        return response(res, status.BAD_REQUEST, 400, {
          message: "crop_code is required in the request body.",
        });
      }

      const data = await varietyModel.findAll({
        attributes: ['variety_code', 'variety_name', "status"],
        where: {
          crop_code: crop_code,
          [Op.or]: [
            {
              status: {
                [Op.eq]: null
              }
            },
            {
              status: {
                [Op.in]: ['hybrid', 'variety']
              }
            },
            // {
            //   status: {
            //     [Op.eq]:' '
            //   }
            // },
          ]
        },
        order: [['variety_name', 'ASC']],
      });

      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static getDirectIndentVarietyLineData = async (req, res) => {
    try {
      const { variety_code } = req.body;
      if (!variety_code) {
        return response(res, status.BAD_REQUEST, 400, {
          message: "variety_code is required in the request body.",
        });
      }
      const result = await varietyCategoryMappingModel.findAll({
        attributes: ["line", "line_variety_code", "line_variety_name", [sequelize.literal('"line_variety_code"'), 'variety_code_line']],
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
  static getHarvestingIntakeYear = async (req, res) => {
    try {
      const { user_id, cropCode, varietyCode, year, season, variety_code_array,form_type } = req.body.search;

      const whereClause = {};
      let crop_status;
      if(req.body.search.form_type && req.body.search.form_type=="inability_form"){
        // crop_status={crop_failure:0}
      }else{
        crop_status={crop_failure:0}
      }
      if (cropCode) {
        whereClause.crop_code = cropCode;
      }
      if (varietyCode && varietyCode.length > 0) {
        whereClause.variety_code = {
          [Op.in]: varietyCode
        };
      }
      if (year) {
        whereClause.year = year;
      }
      if (season) {
        whereClause.season = season;
      }
      whereClause.report = 'satisfactory';
      const bspProforma3Data = await db.bspProrforma3Model.findAll({
        where: whereClause,
        include: [
          {
            model: db.bspProrforma2Model,
            where: { user_id: user_id,...crop_status },
            as: 'bspProforma2',
            attributes: []
          }
        ],
        attributes: [
          'year'
          // [sequelize.fn('DISTINCT', sequelize.col('year')), 'year'],
          // [sequelize.literal('DISTINCT "year"'), 'year'],
        ],
        group: [
          [sequelize.col('bsp_proforma_3s.year'), 'year']
        ],
        raw:true
      })

      const responseData = {
        status: 200,
        message: 'bspProforma2 data retrieved successfully',
        data: bspProforma3Data
      };
      return response(res, status.DATA_AVAILABLE, 200, bspProforma3Data)
      // res.status(200).json(response);
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  static getHarvestingIntakeSeason = async (req, res) => {
    try {
      const { user_id, year, } = req.body.search;

      const whereClause = {};
      let crop_status;
      if(req.body.search.form_type && req.body.search.form_type=="inability_form"){
        // crop_status={crop_failure:0}
      }else{
        crop_status={crop_failure:0}
      }
      if (year) {
        whereClause.year = year;
      }
      whereClause.report = 'satisfactory';
      const bspProforma3Data = await bspProrforma3Model.findAll({
        where: whereClause,
        include: [
          {
            model: bspProrforma2Model,
            as: 'bspProforma2',
            where: { user_id: user_id,...crop_status },
            attributes: []
          }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('bsp_proforma_3s.season')), 'season'],
          // [sequelize.literal('DISTINCT ".season"'), 'season'],
        ],
        raw: true

      })
      return response(res, status.DATA_AVAILABLE, 200, bspProforma3Data)
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  static getHarvestingIntakeCrop = async (req, res) => {
    try {
      const { user_id, year, season, } = req.body.search;

      const whereClause = {};
      let crop_status;
      if(req.body.search.form_type && req.body.search.form_type=="inability_form"){
        // crop_status={crop_failure:0}
      }else{
        crop_status={crop_failure:0}
      }
      if (year) {
        whereClause.year = year;
      }
      if (season) {
        whereClause.season = season;
      }
      whereClause.report = 'satisfactory';
      const bspProforma3Data = await bspProrforma3Model.findAll({
        where: whereClause,
        include: [
          {
            model: bspProrforma2Model,
            as: 'bspProforma2',
            where: { user_id: user_id ,...crop_status},
            attributes: []
          },
          {
            model: cropModel,
            // where: { user_id: user_id },
            attributes: []
          }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('bsp_proforma_3s.crop_code')), 'crop_code'],
          // [sequelize.literal('DISTINCT "crop_code"'), 'crop_code'],
          [sequelize.col('m_crop.crop_name'), 'crop_name'],

        ],
        raw: true

      })
      return response(res, status.DATA_AVAILABLE, 200, bspProforma3Data)
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  static getHarvestingIntakeVariety = async (req, res) => {
    try {
      const { user_id, crop_code, year, season, } = req.body.search;

      const whereClause = {};
      let crop_status;
      if(req.body.search.form_type && req.body.search.form_type=="inability_form"){
        // crop_status={crop_failure:0}
      }else{
        crop_status={crop_failure:0}
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
      whereClause.report = 'satisfactory';
      const bspProforma3Data = await bspProrforma3Model.findAll({
        where: whereClause,
        include: [
          {
            model: bspProrforma2Model,
            as: 'bspProforma2',
            where: { user_id: user_id,...crop_status},
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
  static getHarvestingIntakeVarietyLine = async (req, res) => {
    try {
      const { user_id, crop_code, year, season, variety_code } = req.body.search;

      const whereClause = {};
      let crop_status;
      if(req.body.search.form_type && req.body.search.form_type=="inability_form"){
        // crop_status={crop_failure:0}
      }else{
        crop_status={crop_failure:0}
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
      if (variety_code) {
        whereClause.variety_code = variety_code;
      }
      whereClause.report = 'satisfactory';
      const bspProforma3Data = await bspProrforma3Model.findAll({
        where: whereClause,
        include: [
          {
            model: bspProrforma2Model,
            as: 'bspProforma2',
            where: { user_id: user_id,...crop_status },
            attributes: []
          },
          {
            model: varietyLinesModel,
            attributes: []

          }

        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('bsp_proforma_3s.variety_line_code')), 'variety_line_code'],
          [sequelize.col('m_variety_lines.line_variety_name'), 'line_variety_name']

        ],
        raw: true
      })

      return response(res, status.DATA_AVAILABLE, 200, bspProforma3Data)
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  static getHarvestingIntakeVarietyplot = async (req, res) => {
    try {
      const { user_id, crop_code, year, season, variety_code, variety_line_code } = req.body.search;

      const whereClause = {};
      let crop_status;
      if(req.body.search.form_type && req.body.search.form_type=="inability_form"){
        // crop_status={crop_failure:0}
      }else{
        crop_status={crop_failure:0}
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
      if (variety_code) {
        whereClause.variety_code = variety_code;
      }
      if (variety_line_code) {
        whereClause.variety_line_code = variety_line_code;
      }
      whereClause.report = 'satisfactory';
      const bspProforma3Data = await bspProrforma3Model.findAll({
        where: whereClause,
        include: [
          {
            model: bspProrforma2Model,
            as: 'bspProforma2',
            where: { user_id: user_id,...crop_status },
            attributes: []
          },


        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('bspProforma2.field_code')), 'field_code'],
          [sequelize.col('bspProforma2.id'), 'id']
          // [sequelize.fn('DISTINCT', sequelize.col('bspProforma2.id')), 'id'],
          // 'id'        

        ],
        raw: true
      })

      return response(res, status.DATA_AVAILABLE, 200, bspProforma3Data)
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  static getInabilityIntakeVarietyplot = async (req, res) => {
    try {
      const { user_id, crop_code, year, season, variety_code, variety_line_code } = req.body.search;

      const whereClause = {};
      let crop_status;
      if(req.body.search.form_type && req.body.search.form_type=="inability_form"){
        // crop_status={crop_failure:0}
      }else{
        crop_status={crop_failure:0}
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
      if (variety_code) {
        whereClause.variety_code = variety_code;
      }
      if (variety_line_code) {
        whereClause.variety_line_code = variety_line_code;
      }
      // whereClause.report = 'satisfactory';
      const bspProforma3Data = await bspProrforma3Model.findAll({
        where: whereClause,
        include: [
          {
            model: bspProrforma2Model,
            as: 'bspProforma2',
            where: { user_id: user_id,...crop_status },
            attributes: []
          },


        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('bspProforma2.field_code')), 'field_code'],
          // [sequelize.col('bspProforma2.field_code'), 'field_code'],
          [sequelize.col('bspProforma2.id'), 'id'],
          [sequelize.col('bspProforma2.expected_production'), 'expected_production'],
          // [sequelize.col('bspProforma2.estimated_production'), 'estimated_production'],
          'report','estimated_production'
          // [sequelize.fn('DISTINCT', sequelize.col('bspProforma2.id')), 'id'],
          // 'id'        

        ],
        raw: true
      })

      return response(res, status.DATA_AVAILABLE, 200, bspProforma3Data)
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  static getInspectionArea = async (req, res) => {
    try {
      const { user_id, crop_code, year, season, variety_code, plotid } = req.body.search;

      const whereClause = {};
      const whereClause2 = {};

      if (year) {
        whereClause.year = year;
      }
      if (season) {
        whereClause.season = season;
      }
      if (crop_code) {
        whereClause.crop_code = crop_code;
      }
      if (variety_code) {
        whereClause.variety_code = variety_code;
      }
      if (plotid) {
        whereClause2.field_code = plotid;
      }
      if (user_id) {
        whereClause2.user_id = user_id;
      }
      whereClause.report = 'satisfactory';
      const bspProforma3Data = await bspProrforma3Model.findAll({
        where: whereClause,
        include: [
          {
            model: bspProrforma2Model,
            as: 'bspProforma2',
            where: whereClause2,
            attributes: []
          },


        ],
        attributes: [
          [sequelize.fn('SUM', sequelize.col('bsp_proforma_3s.inspected_area')), 'inspected_area'],

        ],
        raw: true
      })
      const bspProforma3DataexpectedProd = await bspProrforma3Model.findAll({
        where: whereClause,
        include: [
          {
            model: bspProrforma2Model,
            as: 'bspProforma2',
            where: whereClause2,
            attributes: []
          },


        ],
        attributes: [
          [sequelize.fn('SUM', sequelize.col('bsp_proforma_3s.estimated_production')), 'estimated_production'],

        ],
        raw: true
      })
      const bsp3harvestDate = await bspProrforma3Model.findAll({
        where: whereClause,
        include: [
          {
            model: bspProrforma2Model,
            as: 'bspProforma2',
            where: whereClause2,
            attributes: []
          },
        ],
        attributes: [
          [sequelize.col('bsp_proforma_3s.date_of_harvesting'), 'date_of_harvesting'],
          [sequelize.col('bsp_proforma_3s.harv_to_date'), 'harv_to_date']
        ],
        raw: true
      })
      const bspProforma3DataseedData = await bspProrforma3Model.findAll({
        where: whereClause,
        include: [
          {
            model: bspProrforma2Model,
            include: [
              {
                model: db.bspPerformaBspTwoSeed,
                attributes: []
              }
            ],
            as: 'bspProforma2',
            where: whereClause2,
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
          // [sequelize.col('bspProforma2->bsp_proforma_2_seed.stage_id'), 'stage_id'],

          // [sequelize.fn('SUM', sequelize.col('bsp_proforma_3s.estimated_production')), 'estimated_production'],   

        ],
        raw: true
      })
      const plotAddress = await bspProrforma3Model.findAll({
        where: whereClause,
        include: [
          {
            model: bspProrforma2Model,
            include: [
              {
                model: stateModel,
                attributes: []
              },
              {
                model: districtModel,
                attributes: []
              },
            ],
            as: 'bspProforma2',
            where: whereClause2,
            attributes: []
          },


        ],
        attributes: [
          [sequelize.col('bspProforma2.address'), 'address'],
          [sequelize.col('bspProforma2->m_state.state_name'), 'state_name'],
          [sequelize.col('bspProforma2->m_district.district_name'), 'district_name'],

          // [sequelize.fn('SUM', sequelize.col('bsp_proforma_3s.estimated_production')), 'estimated_production'],   

        ],
        raw: true
      })


      const responseData = {
        expectedProd: bspProforma3DataexpectedProd,
        inspectionData: bspProforma3Data,
        bspProforma3DataseedData: bspProforma3DataseedData,
        bsp3harvestDate: bsp3harvestDate,
        plotAddress: plotAddress
      }
      return response(res, status.DATA_AVAILABLE, 200, responseData)
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  static getSppData = async (req, res) => {
    try {
      const { user_id, crop_code, year, season, variety_code, variety_line_code } = req.body.search;

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
      if (variety_code) {
        whereClause.variety_code = variety_code;
      }
      if (variety_line_code) {
        whereClause.variety_line_code = variety_line_code;
      }
      const bspProforma3Data = await db.userModel.findAll({
        include: [
          {
            model: agencyDetailModel,
            attributes: []
          }
        ],
        where: {
          user_type: 'SPP'
        },
        attributes: [
          // 'name',
          [sequelize.col('agency_detail.agency_name'), 'name'],
          [sequelize.col('agency_detail.id'), 'agency_id'],
          [sequelize.col('user.id'), 'user_id'],

        ],
        order: [[sequelize.col('agency_detail.agency_name'), 'ASC']],
        raw: true
      })

      return response(res, status.DATA_AVAILABLE, 200, bspProforma3Data)
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  static saveInvestHarvesting = async (req, res) => {
    try {
      const { user_id, crop_code, year, season, variety_code, actual_harvest, bag_number, crop
        , parental_line, plot, processing_plant, seed_produced, variety, bag_marka, ref_number, plotId, markBagArr, maximumRange, harvested_data } = req.body;
      const dataRow = {
        user_id: user_id ? user_id : "",
        crop_code: crop ? crop : '',
        year: year ? year : '',
        season: season ? season : '',
        variety_code: variety ? variety : '',
        actual_harvest_date: actual_harvest ? (actual_harvest) : '',
        no_of_bags: bag_number ? bag_number : '',
        plot_code: plot ? plot : '',
        raw_seed_produced: seed_produced ? seed_produced : '',
        spp_id: processing_plant ? processing_plant : '',
        variety_line_code: parental_line ? parental_line : '',
        bag_marka: bag_marka ? bag_marka : '',
        ref_number: ref_number ? ref_number : null,
        plot_id: plotId ? plotId : null,
        class_of_seed_harvested: harvested_data ? harvested_data : null,
        bspc_id: user_id ? user_id : ''
      }
      let subscriberResponse
      let data = await investHarvestingModel.create(dataRow).then(function (item) {
        subscriberResponse = item['_previousDataValues'];
      })
      if (markBagArr && markBagArr.length > 0) {
        for (let i = 0; i < markBagArr.length; i++) {
          const item = await db.investHarvestingBagModel.create({
            bags: markBagArr && markBagArr[i] && markBagArr[i].bagrange,
            investing_harvesting_id: subscriberResponse.id,
            ref_number: maximumRange,
            total_number: markBagArr && markBagArr[i] && markBagArr[i].total_num,
          })
        }

      }
      if (data) {
        return response(res, status.DATA_SAVE, 200, data)
      } else {
        return response(res, status.DATA_NOT_SAVE, 200, data)
      }



      // return response(res, status.DATA_AVAILABLE, 200, bspProforma3Data)
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: error });
    }
  };
  static getInvestHarvesting = async (req, res) => {
    try {
      const { user_id, crop_code, year, season, variety_code, variety_line_code, id, plotid } = req.body.search;

      const whereClause = {};

      if (year) {
        whereClause.year = parseInt(year);
      }
      if (season) {
        whereClause.season = season;
      }
      if (crop_code) {
        whereClause.crop_code = crop_code;
      }
      if (variety_code) {
        whereClause.variety_code = variety_code;
      }
      if (variety_line_code) {
        whereClause.variety_line_code = variety_line_code;
      }
      if (variety_line_code) {
        whereClause.variety_line_code = variety_line_code;
      }
      if (user_id) {
        whereClause.user_id = (user_id).toString()
      }
      if (id) {
        whereClause.id = id;
      }
      if (plotid) {
        whereClause.plot_code = plotid
      }
      let bspProforma3Data = await investHarvestingModel.findAll({
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
            model: varietyLinesModel,
            attributes: []
          },
          {
            model: agencyDetailModel,
            attributes: []
          },
          // {
          //   model: db.investHarvestingBagModel,
          //   attributes: []
          // },

          {
            model: db.bspPerformaBspTwo,

            include: [
              {
                model: stateModel,
                attributes: []
              },
              {
                model: districtModel,
                attributes: []
              },
              // {
              //   model: db.bspPerformaBspTwoSeedData,
              //   attributes: []
              // },
            ],
            // as: 'bspProforma2',
            where: { user_id: user_id },
            attributes: []
          },
        ],
        attributes: [
          '*',
          [sequelize.col('m_crop.crop_name'), 'crop_name'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [sequelize.col('m_variety_line.line_variety_name'), 'line_variety_name'],
          [sequelize.col('agency_detail.agency_name'), 'agency_name'],
          [sequelize.col('bsp_proforma_2.address'), 'address'],
          [sequelize.col('bsp_proforma_2->m_state.state_name'), 'state_name'],
          [sequelize.col('bsp_proforma_2->m_district.district_name'), 'district_name'],
          // [sequelize.col('investing_harvesting_bag.ref_number'), 'ref_number'],
          // [sequelize.col('investing_harvesting_bag.bags'), 'bags_range'],
          // [sequelize.col('investing_harvesting_bag.investing_harvesting_id'), 'investing_harvesting_id'],

        ],

        where: whereClause,
        raw: true
      })
      let filterData = []
      let bsp3Id = []
      bspProforma3Data.forEach((el, index) => {
        bsp3Id.push(el.id)
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
              "plot_id": el && el.plot_id ? el.plot_id : '',
              "class_of_seed_harvested": el && el.class_of_seed_harvested ? el.class_of_seed_harvested : '',
              "variety_count": 1,
              "plotDetails":
                [
                  {
                    "actual_harvest_date": el && el.actual_harvest_date ? el.actual_harvest_date : '',
                    "raw_seed_produced": el && el.raw_seed_produced ? el.raw_seed_produced : '',
                    "no_of_bags": el && el.no_of_bags ? el.no_of_bags : '',
                    "bag_marka": el && el.bag_marka ? el.bag_marka : '',
                    "agency_name": el && el.agency_name ? el.agency_name : '',
                    "variety_line_code": el && el.variety_line_code ? el.variety_line_code : '',
                    "plot_code": el && el.plot_code ? el.plot_code : '',
                    "address": el && el.address ? el.address : '',
                    "district_name": el && el.district_name ? el.district_name : '',
                    "state_name": el && el.state_name ? el.state_name : '',
                    "id": el && el.id ? el.id : '',
                    "spp_id": el && el.spp_id ? el.spp_id : '',
                    "plot_id": el && el.plot_id ? el.plot_id : '',
                    "class_of_seed_harvested": el && el.class_of_seed_harvested ? el.class_of_seed_harvested : ''

                  }
                ]
            }
          )
        }
        else {
          // let plotIndex= 
          // console.log(el.id,'plotDetails')
          // let plotIndex = filterData[cropIndex].plotDetails.findIndex(item => item.plot_id == el.plot_id);
          // if(plotIndex!=-1){
          filterData[cropIndex].plotDetails.push({
            "actual_harvest_date": el && el.actual_harvest_date ? el.actual_harvest_date : '',
            "raw_seed_produced": el && el.raw_seed_produced ? el.raw_seed_produced : '',
            "no_of_bags": el && el.no_of_bags ? el.no_of_bags : '',
            "bag_marka": el && el.bag_marka ? el.bag_marka : '',
            "agency_name": el && el.agency_name ? el.agency_name : '',
            "variety_line_code": el && el.variety_line_code ? el.variety_line_code : '',
            "plot_code": el && el.plot_code ? el.plot_code : '',
            "address": el && el.address ? el.address : '',
            "district_name": el && el.district_name ? el.district_name : '',
            "state_name": el && el.state_name ? el.state_name : '',
            "id": el && el.id ? el.id : '',
            "spp_id": el && el.spp_id ? el.spp_id : '',
            "plot_id": el && el.plot_id ? el.plot_id : '',
            "class_of_seed_harvested": el && el.class_of_seed_harvested ? el.class_of_seed_harvested : ''

          })
          // }

        }

      });
      let bagData = [];
      let responseValue = await db.investHarvestingBagModel.findAll({
        where: {
          investing_harvesting_id: {
            [Op.in]: bagData
          }
        }
      })
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

      let filterDataArr = {
        filterData: filterData,
        // ...responseValue,
        bsp2Data: bsp2Data
      }


      return response(res, status.DATA_AVAILABLE, 200, filterDataArr)
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  static getBagRange = async (req, res) => {
    try {
      const { user_id, crop_code, year, season, id, editMode, editId } = req.body.search;

      const whereClause = {};
      let filterData = [];
      let filterData2 = [];

      if (year) {
        filterData.push({
          year: {
            [Op.eq]: parseInt(year)
          },

        }
        )
        filterData2.push({
          year: {
            [Op.eq]: parseInt(year)
          },

        }
        )
        whereClause.year = parseInt(year);
      }
      if (season) {
        filterData.push({
          season: {
            [Op.eq]: season
          },

        })
        filterData2.push({
          season: {
            [Op.eq]: season
          },

        })
        whereClause.season = season;
      }
      if (editMode && editId) {
        filterData.push({
          id: {
            [Op.ne]: editId
          },

        })
        // whereClause.id!=id

      }

      if (user_id) {
        filterData.push({
          user_id: {
            [Op.eq]: user_id
          },

        })
        filterData2.push({
          user_id: {
            [Op.eq]: user_id
          },

        })
        whereClause.user_id = (user_id)
      }
      if (id) {
        filterData.push({
          id: {
            [Op.eq]: id
          },

        })
        filterData2.push({
          id: {
            [Op.eq]: id
          },

        })
        whereClause.id = id;
      }
      let bspProforma3Data;
      let investingBagData;
      let investingBagDataofId;
      let actualRefNo;

      bspProforma3Data = await investHarvestingModel.max('ref_number', {
        where: {
          [Op.and]: filterData ? filterData : [],
        },
        raw: true
      })
      if (editId) {
        actualRefNo = await investHarvestingModel.findAll({
          where: {
            id: editId

          },
          attributes: ['ref_number'],
          raw: true
        })
      }
      console.log(id, 'idid')
      if (editId) {
        investingBagData = await db.investHarvestingBagModel.findAll({
          where: {
            investing_harvesting_id: {
              [Op.ne]: editId
            },
            // [Op.and]: filterData ? filterData : [],
          },
          raw: true
        })
        investingBagDataofId = await db.investHarvestingBagModel.findAll({
          where: {
            investing_harvesting_id: {
              [Op.eq]: editId
            },
            // [Op.and]: filterData ? filterData : [],
          },
          raw: true
        })
      }
      let responseData = {
        bspProforma3Data,
        investingBagData: investingBagData,
        investingBagDataofId: investingBagDataofId,
        actualRefNo: actualRefNo

      }

      return response(res, status.DATA_AVAILABLE, 200, responseData)
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  static getInvestHarvestingByid = async (req, res) => {
    try {
      const { user_id, crop_code, year, season, variety_code, variety_line_code, id, plotid, } = req.body.search;

      const whereClause = {};

      if (year) {
        whereClause.year = parseInt(year);
      }
      if (season) {
        whereClause.season = season;
      }
      if (crop_code) {
        whereClause.crop_code = crop_code;
      }
      if (variety_code) {
        whereClause.variety_code = variety_code;
      }
      if (variety_line_code) {
        whereClause.variety_line_code = variety_line_code;
      }
      if (variety_line_code) {
        whereClause.variety_line_code = variety_line_code;
      }
      if (user_id) {
        whereClause.user_id = (user_id).toString()
      }
      if (plotid) {
        whereClause.plot_code = plotid
      }
      if (id) {
        whereClause.id = id;
      }
      const bspProforma3Data = await investHarvestingModel.findAll({
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
            model: varietyLinesModel,
            attributes: []
          },
          {
            model: agencyDetailModel,
            attributes: []
          }
        ],
        attributes: [
          '*',
          [sequelize.col('m_crop.crop_name'), 'crop_name'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [sequelize.col('m_variety_line.line_variety_name'), 'line_variety_name'],
          [sequelize.col('agency_detail.agency_name'), 'agency_name'],

        ],


        where: whereClause,
        raw: true
      })
      console.log(id, 'id')
      let responseValue = await db.investHarvestingBagModel.findAll({
        where: {
          investing_harvesting_id: {
            [Op.eq]: id
          }
        },
        attributes: [
          [sequelize.col('investing_harvesting_bag.bags'), 'bag_range'],
          [sequelize.col('investing_harvesting_bag.investing_harvesting_id'), 'investing_harvesting_id'],
          [sequelize.col('investing_harvesting_bag.ref_number'), 'ref_number'],
        ],
        raw: true
      })
      let filterData = {
        bspProforma3Data: bspProforma3Data,
        responseValue: responseValue
      }
      return response(res, status.DATA_AVAILABLE, 200, filterData)
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  static deleteInvestHarvestingData = async (req, res) => {
    try {
      const { user_id, id } = req.body.search;

      const whereClause = {};


      if (user_id) {
        whereClause.user_id = (user_id)
      }
      if (id) {
        whereClause.id = id;
      }
      const bspProforma3Data = await investHarvestingModel.findAll({
        where: whereClause,
        raw: true
      })
      let datas
      if (bspProforma3Data && bspProforma3Data.length > 0) {
        datas = await investHarvestingModel.destroy({
          where: {
            id: id,
            user_id: user_id
          }
        })
        let datas2 = await db.investHarvestingBagModel.destroy({
          where: {
            investing_harvesting_id: id,
            // user_id:user_id
          }
        })
      }
      let datas3 = await db.investVerifyModel.findAll({
        where: {
          invest_harvesting_id: id,
          // user_id:user_id
        },
        attributes: ['id'],
        raw: true
      })
      let verifytableData = []
      if (datas3 && datas3.length > 0) {
        datas3.forEach((el, i) => {
          verifytableData.push(el && el.id ? el.id : '')
        });
      } console.log(verifytableData, 'verifytableData')
      if (datas3 && datas3.length > 0) {


        if (verifytableData && verifytableData.length > 0) {
          verifytableData = verifytableData.filter(x => x != '')
          if (verifytableData && verifytableData.length > 0) {
            let dataVerifyStack = await db.investVerifyStackCompositionModel.destroy({
              where: {
                invest_verify_id: {
                  [Op.in]: verifytableData
                },
                // user_id:user_id
              },

            })
          }
        }
        let dataVerify = await db.investVerifyModel.destroy({
          where: {
            invest_harvesting_id: id,
            // user_id:user_id
          },

        })

      }


      return response(res, status.DATA_AVAILABLE, 200, bspProforma3Data)
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  static updateInvestHarvesting = async (req, res) => {
    try {
      const { user_id, crop_code, year, season, variety_code, actual_harvest, bag_number, crop
        , parental_line, plot, processing_plant, seed_produced, variety, bag_marka, ref_number, plotId, id, markBagArr, maximumRange, harvested_data } = req.body;

      let data = await investHarvestingModel.update(
        {
          user_id: user_id ? user_id : "",
          crop_code: crop ? crop : '',
          year: year ? year : '',
          season: season ? season : '',
          variety_code: variety ? variety : '',
          actual_harvest_date: actual_harvest ? actual_harvest : '',
          no_of_bags: bag_number ? bag_number : '',
          plot_code: plot ? plot : '',
          raw_seed_produced: seed_produced ? seed_produced : '',
          spp_id: processing_plant ? processing_plant : '',
          variety_line_code: parental_line ? parental_line : '',
          bag_marka: bag_marka ? bag_marka : '',
          ref_number: ref_number ? ref_number : null,
          plot_id: plotId ? plotId : null,
          class_of_seed_harvested: harvested_data ? harvested_data : null


        },
        {
          where: {
            id: id
          }
        }
      )
      let datas = await db.investHarvestingBagModel.destroy({
        where: {
          investing_harvesting_id: id
        }
      })
      if (markBagArr && markBagArr.length > 0) {
        for (let i = 0; i < markBagArr.length; i++) {
          const item = await db.investHarvestingBagModel.create({
            bags: markBagArr && markBagArr[i] && markBagArr[i].bagrange,
            investing_harvesting_id: id,
            ref_number: maximumRange,
            total_number: markBagArr && markBagArr[i] && markBagArr[i].total_num,
          })
        }

      }
      if (data) {
        return response(res, status.DATA_UPDATED, 200, data)
      } else {
        return response(res, status.DATA_NOT_SAVE, 200, data)
      }



      // return response(res, status.DATA_AVAILABLE, 200, bspProforma3Data)
    } catch (error) {
      console.error('Error fetching data:', error);
      return response(res, status.DATA_NOT_AVAILABLE, 500, error.message)
      // res.status(500).json({ error: 'Internal server error' });
    }
  };

  static getHarvestingVerificationYear = async (req, res) => {
    try {
      const { user_id, cropCode, varietyCode, year, season, variety_code_array } = req.body.search;

      const whereClause = {};
      if (cropCode) {
        whereClause.crop_code = cropCode;
      }
      if (varietyCode && varietyCode.length > 0) {
        whereClause.variety_code = {
          [Op.in]: varietyCode
        };
      }
      if (year) {
        whereClause.year = year;
      }
      if (season) {
        whereClause.season = season;
      }
      if (user_id) {
        whereClause.spp_id = user_id;
      }
      const bspProforma3Data = await investHarvestingModel.findAll({
        where: whereClause,

        attributes: [
          'year'
          // [sequelize.fn('DISTINCT', sequelize.col('year')), 'year'],
          // [sequelize.literal('DISTINCT "year"'), 'year'],
        ],
        group: [
          [sequelize.col('invest_harvesting.year'), 'year']
        ],
        order: [[sequelize.col('invest_harvesting.year'), 'DESC']]

      })

      const responseData = {
        status: 200,
        message: 'bspProforma2 data retrieved successfully',
        data: bspProforma3Data
      };
      return response(res, status.DATA_AVAILABLE, 200, bspProforma3Data)
      // res.status(200).json(response);
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  static getHarvestingVerificationSeason = async (req, res) => {
    try {
      const { user_id, year, } = req.body.search;

      const whereClause = {};

      if (year) {
        whereClause.year = year;
      }
      if (user_id) {
        whereClause.spp_id = user_id;
      }
      const investHarvesting = await investHarvestingModel.findAll({

        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('invest_harvesting.season')), 'season'],
          // [sequelize.literal('DISTINCT ".season"'), 'season'],
        ],
        raw: true,
        where: whereClause,
        order: [[sequelize.col('invest_harvesting.season'), 'ASC']]

      })

      return response(res, status.DATA_AVAILABLE, 200, investHarvesting)
    } catch (error) {
      console.error('Error fetching data:', error);
      return response(res, status.DATA_NOT_AVAILABLE, 500, error)
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  static getHarvestingVerificationCrop = async (req, res) => {
    try {
      const { user_id, year, season } = req.body.search;

      const whereClause = {};

      if (year) {
        whereClause.year = year;
      }
      if (season) {
        whereClause.season = season;
      }
      if (user_id) {
        whereClause.spp_id = user_id;
      }
      const investHarvesting = await investHarvestingModel.findAll({
        include: [
          {
            model: cropModel,
            attributes: []
          }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('invest_harvesting.crop_code')), 'crop_code'],
          [sequelize.col('m_crop.crop_name'), 'crop_name'],
          // [sequelize.literal('DISTINCT ".season"'), 'season'],
        ],
        where: whereClause,
        raw: true,


      })
      return response(res, status.DATA_AVAILABLE, 200, investHarvesting)
    } catch (error) {
      console.error('Error fetching data:', error);
      return response(res, status.DATA_NOT_AVAILABLE, 500, error)
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  static getInvestVerificationData = async (req, res) => {
    try {
      const { user_id, crop_code, year, season, variety_code, variety_line_code, id, plotid } = req.body.search;

      const whereClause = {};

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
      let bspProforma3Data = await investHarvestingModel.findAll({
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
            model: varietyLinesModel,
            attributes: []
          },
          {
            model: agencyDetailModel,
            attributes: []
          },
          {
            model: db.maxLotSizeModel,
            attributes: []
          },
          {
            model: db.userModel,
            attributes: []
          },
          {
            model: db.investVerifyModel,
            // required:true,
            include: [
              {
                model: db.userModel,
                attributes: []
              }
            ],
            attributes: []
          },
          {
            model: db.userModel,
            attributes: []
          }
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
          [sequelize.col('invest_verification->user.spa_code'), 'spa_code'],
          [sequelize.col('user.spa_code'), 'spa_code_value'],
          [sequelize.col('user.code'), 'code'],
          // [sequelize.col('invest_verification->invest_verify_stack_compositions.stack'), 'stack'],
          // [sequelize.col('bsp_proforma_2.address'), 'address'],
          // [sequelize.col('investing_harvesting_bag.ref_number'), 'ref_number'],
          // [sequelize.col('investing_harvesting_bag.bags'), 'bags_range'],
          // [sequelize.col('investing_harvesting_bag.investing_harvesting_id'), 'investing_harvesting_id'],

        ],

        where: whereClause,
        raw: true
      })
      let filterData = []
      let bsp3Id = []
      bspProforma3Data.forEach((el, index) => {
        bsp3Id.push(el && el.verifyid ? el.verifyid : '')
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
              "bsp_details": [
                {
                  "user_id": el && el.user_id ? el.user_id : '',
                  "agency_name": el && el.agency_name ? el.agency_name : '',
                  "plot_code": el && el.plot_code ? el.plot_code : '',
                  "spp_code": el && el.spp_code ? el.spp_code : "NA",
                  "spa_code": el && el.spa_code ? el.spa_code : '',
                  "spa_code_value": el && el.spa_code_value ? el.spa_code_value : '',
                  "code": el && el.code ? el.code : '',
                  "plotDetails":
                    [
                      {
                        "actual_harvest_date": el && el.actual_harvest_date ? el.actual_harvest_date : '',
                        "raw_seed_produced": el && el.raw_seed_produced ? el.raw_seed_produced : '',
                        "no_of_bags": el && el.no_of_bags ? el.no_of_bags : '',
                        "bag_marka": el && el.bag_marka ? el.bag_marka : '',
                        "agency_name": el && el.agency_name ? el.agency_name : '',
                        "variety_line_code": el && el.variety_line_code ? el.variety_line_code : '',
                        "plot_code": el && el.plot_code ? el.plot_code : '',
                        "address": el && el.address ? el.address : '',
                        "district_name": el && el.district_name ? el.district_name : '',
                        "state_name": el && el.state_name ? el.state_name : '',
                        "id": el && el.id ? el.id : '',
                        "user_id": el && el.user_id ? el.user_id : '',
                        "check_status": el.check_status,
                        "qty_recieved": el && el.qty_recieved ? el.qty_recieved : '',
                        // "godown_no": el && el.godown_no ? el.godown_no : '',
                        "stack": el && el.stack ? el.stack : '',
                        "max_lot_size": el && el.max_lot_size ? parseFloat(el.max_lot_size) : '',
                        "verifyid": el && el.verifyid ? el.verifyid : '',
                        "bag_recieved": el && el.bag_recieved ? el.bag_recieved : "",
                        "lot_num": el && el.lot_num ? el.lot_num : "",
                        "provision_lot": el && el.provision_lot ? el.provision_lot : '',
                        "spa_code": el && el.spa_code ? el.spa_code : '',
                        "spa_code_value": el && el.spa_code_value ? el.spa_code_value : '',
                        "code": el && el.code ? el.code : '',
                      }
                    ]
                }
              ]
            }
          )
        }
        else {
          let plotIndex = filterData[cropIndex].bsp_details.findIndex(item => item.user_id == el.user_id && item.plot_code == el.plot_code);
          if (plotIndex != -1) {
            filterData[cropIndex].bsp_details[plotIndex].plotDetails.push({
              "actual_harvest_date": el && el.actual_harvest_date ? el.actual_harvest_date : '',
              "raw_seed_produced": el && el.raw_seed_produced ? el.raw_seed_produced : '',
              "no_of_bags": el && el.no_of_bags ? el.no_of_bags : '',
              "bag_marka": el && el.bag_marka ? el.bag_marka : '',
              "agency_name": el && el.agency_name ? el.agency_name : '',
              "variety_line_code": el && el.variety_line_code ? el.variety_line_code : '',
              "plot_code": el && el.plot_code ? el.plot_code : '',
              "address": el && el.address ? el.address : '',
              "district_name": el && el.district_name ? el.district_name : '',
              "state_name": el && el.state_name ? el.state_name : '',
              "id": el && el.id ? el.id : '',
              "user_id": el && el.user_id ? el.user_id : '',
              "check_status": el.check_status,
              "qty_recieved": el && el.qty_recieved ? el.qty_recieved : '',
              // "godown_no": el && el.godown_no ? el.godown_no : '',
              "stack": el && el.stack ? el.stack : '',
              "max_lot_size": el && el.max_lot_size ? parseFloat(el.max_lot_size) : '',
              "verifyid": el && el.verifyid ? el.verifyid : '',
              "bag_recieved": el && el.bag_recieved ? el.bag_recieved : "",
              "lot_num": el && el.lot_num ? el.lot_num : "",
              "provision_lot": el && el.provision_lot ? el.provision_lot : '',
              "spa_code": el && el.spa_code ? el.spa_code : '',
              "spa_code_value": el && el.spa_code_value ? el.spa_code_value : '',
              "code": el && el.code ? el.code : '',
            })
          } else {
            filterData[cropIndex].bsp_details.push({
              "user_id": el && el.user_id ? el.user_id : '',
              "agency_name": el && el.agency_name ? el.agency_name : '',
              "plot_code": el && el.plot_code ? el.plot_code : '',
              "spp_code": el && el.spp_code ? el.spp_code : "NA",
              "spa_code": el && el.spa_code ? el.spa_code : '',
              "spa_code_value": el && el.spa_code_value ? el.spa_code_value : '',
              "code": el && el.code ? el.code : '',
              "plotDetails":
                [
                  {
                    "actual_harvest_date": el && el.actual_harvest_date ? el.actual_harvest_date : '',
                    "raw_seed_produced": el && el.raw_seed_produced ? el.raw_seed_produced : '',
                    "no_of_bags": el && el.no_of_bags ? el.no_of_bags : '',
                    "bag_marka": el && el.bag_marka ? el.bag_marka : '',
                    "agency_name": el && el.agency_name ? el.agency_name : '',
                    "variety_line_code": el && el.variety_line_code ? el.variety_line_code : '',
                    "plot_code": el && el.plot_code ? el.plot_code : '',
                    "address": el && el.address ? el.address : '',
                    "district_name": el && el.district_name ? el.district_name : '',
                    "state_name": el && el.state_name ? el.state_name : '',
                    "id": el && el.id ? el.id : '',
                    "user_id": el && el.user_id ? el.user_id : '',
                    "check_status": el.check_status,
                    "qty_recieved": el && el.qty_recieved ? el.qty_recieved : '',
                    // "godown_no": el && el.godown_no ? el.godown_no : '',
                    "stack": el && el.stack ? el.stack : '',
                    "max_lot_size": el && el.max_lot_size ? parseFloat(el.max_lot_size) : '',
                    "verifyid": el && el.verifyid ? el.verifyid : '',
                    "bag_recieved": el && el.bag_recieved ? el.bag_recieved : "",
                    "lot_num": el && el.lot_num ? el.lot_num : "",
                    "provision_lot": el && el.provision_lot ? el.provision_lot : '',
                    "spa_code": el && el.spa_code ? el.spa_code : '',
                    "spa_code_value": el && el.spa_code_value ? el.spa_code_value : '',
                    "code": el && el.code ? el.code : '',
                  }
                ]
            })
          }
          // let plotIndex = filterData.findIndex(item => item.variety_code == el.variety_code);

        }

      });
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
        where: whereClause

      })

      // console.log(bsp2Data,'bsp2Data')
      let responseData = {
        filterData: filterData,
        bsp2Data: bsp2Data,
        investVerifyStackComposition: investHarvesting
      }



      return response(res, status.DATA_AVAILABLE, 200, responseData)
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  static UpdateStatusofInvestingHarvest = async (req, res) => {
    try {
      const { user_id, year, season, status, id } = req.body.search;

      const whereClause = {};

      if (year) {
        whereClause.year = year;
      }
      if (season) {
        whereClause.season = season;
      }
      if (id) {
        whereClause.id = id;
      }
      // if (status) {
      //   whereClause.check_status = status;
      // }
      const investHarvesting = await investHarvestingModel.update(
        {
          check_status: status == 1 ? true : false
        },
        {
          where: whereClause,
          raw: true,


        })
      return response(res, status.DATA_AVAILABLE, 200, investHarvesting)
    } catch (error) {
      console.error('Error fetching data:', error);
      return response(res, status.DATA_NOT_AVAILABLE, 500, error)
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  // static getBagMarka = async (req, res) => {
  //   try {
  //     const { user_id, year, season,status ,id} = req.body.search;

  //     const whereClause = {};

  //     if (year) {
  //       whereClause.year = year;
  //     }
  //     if (season) {
  //       whereClause.season = season;
  //     }

  //     // if (status) {
  //     //   whereClause.check_status = status;
  //     // }
  //     const investHarvesting = await investHarvestingModel.findAll({
  //       attributes:['bag_marka','id'],
  //       raw:true
  //     }
  //     )
  //     console.log(investHarvesting,'investHarvesting')
  //     return response(res, status.DATA_UPDATED, 200, investHarvesting)
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //     return response(res, status.DATA_NOT_AVAILABLE, 500, error)
  //     // res.status(500).json({ error: 'Internal server error' });
  //   }
  // };

  static getBagMarka = async (req, res) => {
    try {
      const { user_id, year, season, investharvestid } = req.body.search;

      const whereClause = {};

      // if (year) {
      //   whereClause.year = year;
      // }
      // if (season) {
      //   whereClause.season = season;
      // }
      // if (user_id) {
      //   whereClause.user_id = user_id;
      // }
      if (investharvestid) {
        whereClause.investing_harvesting_id = investharvestid;
      }
      const investHarvesting = await investHarvestingModel.findAll({
        // where: whereClause,
        include: [
          {
            model: db.investHarvestingBagModel,
            where: whereClause,
            attributes: []
          },
          // {
          //   model: db.investHarvestingModel,
          //   attributes:[]
          // },


        ],
        attributes: [
          [sequelize.col('investing_harvesting_bag.investing_harvesting_id'), 'investing_harvesting_id'],
          [sequelize.col('investing_harvesting_bag.bags'), 'bags'],
          [sequelize.col('investing_harvesting_bag.ref_number'), 'ref_number'],
          [sequelize.col('investing_harvesting_bag.id'), 'id'],
        ],

        raw: true,


      })
      return response(res, status.DATA_AVAILABLE, 200, investHarvesting)
    } catch (error) {
      console.error('Error fetching data:', error);
      return response(res, status.DATA_NOT_AVAILABLE, 500, error)
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static getStackNo = async (req, res) => {
    try {
      const { user_id, year, season, bspc_id } = req.body.search;

      const whereClause = {};
      const whereClause2 = {};

      if (year) {
        whereClause.year = year;
      }
      if (season) {
        whereClause.season = season;
      }
      if (user_id) {
        whereClause2.spp_id = user_id;
      }
      // if (bspc_id) {
      //   whereClause.bspc_id = bspc_id;
      // }
      const investHarvesting = await db.investHarvestingModel.findAll({
        include: [
          {
            model: db.investVerifyModel,
            where: whereClause,
            attributes: [],

          }
        ],
        where: whereClause2,
        attributes: [[sequelize.col('invest_verification.id'), 'id']],
        raw: true,
      })

      let investVerifyid = [];
      if (investHarvesting && investHarvesting.length > 0) {
        investHarvesting.forEach((el, i) => {
          investVerifyid.push(el && el.id ? el.id : '')
        })
      }
      if (investVerifyid && investVerifyid.length > 0) {
        investVerifyid.filter(x => x.id !== '')
      }
      let investVerify
      // if(investVerifyid && investVerifyid.length>0){

      investVerify = await db.investVerifyStackCompositionModel.findAll({
        where: {
          invest_verify_id: {
            [Op.in]: investVerifyid
          }
        },
        raw: true,
        attributes: [
          [sequelize.literal('DISTINCT invest_verify_stack_composition.stack'), 'stack'],
        ]
        // attributes:['id']
      })
      // }else{
      // investVerify=0
      // }

      // console.log(investVerify, 'investHarvesting')
      return response(res, status.DATA_AVAILABLE, 200, investVerify)
    } catch (error) {
      console.error('Error fetching data:', error);
      return response(res, status.DATA_NOT_AVAILABLE, 500, error)
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  static addInvestingVerify = async (req, res) => {
    try {
      const { user_id, year, season, crop, received_quantity, godown_no, bspc_id, harvestVerify, invest_harvesting_id, lot_num, rangeData, range_data } = req.body;

      const whereClause = {};


      const dataRow = {
        crop_code: crop ? crop : null,
        qty_recieved: received_quantity ? received_quantity : null,
        season: season ? season : null,
        year: year ? year : null,
        user_id: user_id ? user_id : null,
        bspc_id: bspc_id ? bspc_id : null,
        bag_recieved: godown_no ? godown_no : null,
        invest_harvesting_id: invest_harvesting_id ? invest_harvesting_id : null,
        lot_num: lot_num ? lot_num : null,
        provision_lot: rangeData ? rangeData : null
      }
      let investingResponse
      const investHarvesting = await db.investVerifyModel.create(dataRow).then(function (item) {
        investingResponse = item['_previousDataValues'];
      })
      let investingResponse2;
      for (let key in harvestVerify) {
        const dataRows = {
          year: harvestVerify && harvestVerify[key] && harvestVerify[key].year ? harvestVerify[key].year : null,
          season: harvestVerify && harvestVerify[key] && harvestVerify[key].season ? harvestVerify[key].season : null,
          bag_marka: harvestVerify && harvestVerify[key] && harvestVerify[key].bag_marka ? harvestVerify[key].bag_marka : null,
          invest_verify_id: investingResponse && investingResponse.id ? investingResponse.id : null,
          stack: harvestVerify && harvestVerify[key] && harvestVerify[key].showstackNo ? harvestVerify[key].showstackNo : null,
          type_of_seed: harvestVerify && harvestVerify[key] && harvestVerify[key].type_of_seed ? harvestVerify[key].type_of_seed : null,
          invest_harvesting_id: harvestVerify && harvestVerify[key] && harvestVerify[key].invest_harvesting_id ? harvestVerify[key].invest_harvesting_id : null,
          godown_no: harvestVerify && harvestVerify[key] && harvestVerify[key].godown_no ? harvestVerify[key].godown_no : null,
          stack_id: harvestVerify && harvestVerify[key] && harvestVerify[key].stack_id ? harvestVerify[key].stack_id : null,
        }
        const investverifyStack2 = await db.investVerifyStackCompositionModel.create(dataRows).then(function (item) {
          investingResponse2 = item['_previousDataValues'];
        })
        // investverifyStack2.
        console.log(investingResponse2, 'investverifyStack')
      }
      if (range_data && range_data.length > 0) {
        // console.log(range_data,'range_data')
        for (let key in range_data) {
          const dataRows = {
            lot_number: range_data && range_data[key] && range_data[key].lot_number ? range_data[key].lot_number : null,
            qty: range_data && range_data[key] && range_data[key].qty ? range_data[key].qty : null,
            invest_verify_id: investingResponse && investingResponse.id ? investingResponse.id : null,
          }
          const investverifyTags = await db.intakeVerificationTags.create(dataRows)
        }
      }
      return response(res, status.DATA_SAVE, 200, investingResponse)
    } catch (error) {
      console.error('Error fetching data:', error);
      return response(res, status.DATA_NOT_AVAILABLE, 500, error)
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  static getInvestingVerifyId = async (req, res) => {
    try {
      const { harvestid } = req.body.search;

      const whereClause = {};


      if (harvestid) {
        whereClause.invest_harvesting_id = harvestid;
      }
      const investHarvesting = await db.investVerifyModel.findAll({
        include: [
          {
            model: db.investVerifyStackCompositionModel,
            //  as:'monitoringTeams1'
            //  required:true,
          }
        ],
        where: whereClause,
        // required:true,
        // raw: true,


      })
      return response(res, status.DATA_AVAILABLE, 200, investHarvesting)
    } catch (error) {
      console.error('Error fetching data:', error);
      return response(res, status.DATA_NOT_AVAILABLE, 500, error)
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  static getBagMarkaData = async (req, res) => {
    try {
      // const {harvestid} = req.body.search;
      const { user_id, year, season, crop_code, variety_code, bspc_id } = req.body.search;

      const whereClause = {};
      const whereClause2 = {};

      if (year) {
        whereClause.year = year;
      }
      if (season) {
        whereClause.season = season;
      }
      if (crop_code) {
        whereClause.crop_code = crop_code;
      }
      if (variety_code) {
        whereClause.variety_code = variety_code;
      }
      if (user_id) {
        whereClause.spp_id = user_id;
      }

      // const whereClause = {};


      // if (harvestid) {
      //   whereClause.invest_harvesting_id = harvestid;
      // }
      const investHarvesting = await db.investHarvestingModel.findAll({

        include: [
          {
            model: db.investVerifyModel,
            include: [
              {
                model: db.investVerifyStackCompositionModel,
                where: {
                  stack_id: {
                    [Op.eq]: null
                  }
                },
                attributes: []
              }
            ],
            attributes: []
          }
        ],

        where: whereClause,
        attributes: [
          // invest_verify_stack_compositions.stack
          // [sequelize.col('invest_verify_stack_compositions.stack'), 'stack'],
          // [sequelize.col('invest_verify_stack_composition.id'), 'stack_id'],
          [sequelize.col('invest_verification.id'), 'invest_verification_id'],
          [sequelize.col('invest_verification->invest_verify_stack_compositions.stack'), 'stack'],
          [sequelize.col('invest_verification->invest_verify_stack_compositions.id'), 'stack_id'],

        ],
        raw: true

      })
      return response(res, status.DATA_AVAILABLE, 200, investHarvesting)
    } catch (error) {
      console.error('Error fetching data:', error);
      return response(res, status.DATA_NOT_AVAILABLE, 500, error)
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  static updateInvestingVerify = async (req, res) => {
    try {
      const { user_id, year, season, crop, received_quantity, godown_no, bspc_id, harvestVerify, invest_harvesting_id, verifyid, rangeData, range_data } = req.body;

      const whereClause = {};

      console.log(rangeData, 'invest_harvesting_id')

      let investingResponse
      const investHarvesting = await db.investVerifyModel.update(
        {
          crop_code: crop ? crop : null,
          qty_recieved: received_quantity ? received_quantity : null,
          season: season ? season : null,
          year: year ? year : null,
          user_id: user_id ? user_id : null,
          bspc_id: bspc_id ? bspc_id : null,
          bag_recieved: godown_no ? godown_no : null,
          invest_harvesting_id: invest_harvesting_id ? invest_harvesting_id : null,
          provision_lot: rangeData ? rangeData : null
        }, {

        where: {
          id: verifyid
        }
      }
      )
      const stackcompose = await db.investVerifyStackCompositionModel.destroy({
        where: {
          invest_verify_id: verifyid
        }
      })
      for (let key in harvestVerify) {
        const dataRows = {
          year: harvestVerify && harvestVerify[key] && harvestVerify[key].year ? harvestVerify[key].year : null,
          season: harvestVerify && harvestVerify[key] && harvestVerify[key].season ? harvestVerify[key].season : null,
          bag_marka: harvestVerify && harvestVerify[key] && harvestVerify[key].bag_marka ? harvestVerify[key].bag_marka : null,
          invest_verify_id: verifyid ? verifyid : null,
          stack: harvestVerify && harvestVerify[key] && harvestVerify[key].showstackNo ? harvestVerify[key].showstackNo : null,
          type_of_seed: harvestVerify && harvestVerify[key] && harvestVerify[key].type_of_seed ? harvestVerify[key].type_of_seed : null,
          godown_no: harvestVerify && harvestVerify[key] && harvestVerify[key].godown_no ? harvestVerify[key].godown_no : null,
          stack_id: harvestVerify && harvestVerify[key] && harvestVerify[key].stack_id ? harvestVerify[key].stack_id : null,
          // invest_harvesting_id:invest_harvesting_id ? invest_harvesting_id : null
        }
        const investverifyStack = await db.investVerifyStackCompositionModel.create(dataRows)
      }
      const stackTags = await db.intakeVerificationTags.destroy({
        where: {
          invest_verify_id: verifyid
        }
      })
      if (range_data && range_data.length > 0) {
        for (let key in range_data) {
          const dataRows = {
            lot_number: range_data && range_data[key] && range_data[key].lot_number ? range_data[key].lot_number : null,
            qty: range_data && range_data[key] && range_data[key].qty ? range_data[key].qty : null,
            invest_verify_id: verifyid && verifyid ? verifyid : null,
          }
          const investverifyTags = await db.intakeVerificationTags.create(dataRows)
        }
      }
      return response(res, status.DATA_SAVE, 200, investingResponse)
    } catch (error) {
      console.error('Error fetching data:', error);
      return response(res, status.DATA_NOT_AVAILABLE, 500, error)
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  static getInvestingVerifyStack = async (req, res) => {
    try {
      const { investStackId } = req.body.search;
      const whereClause = {};
      if (investStackId) {
        whereClause.id = investStackId;
      }
      const investHarvesting = await db.investVerifyStackCompositionModel.findAll({
        where: whereClause,
      })
      return response(res, status.DATA_AVAILABLE, 200, investHarvesting)
    } catch (error) {
      console.error('Error fetching data:', error);
      return response(res, status.DATA_NOT_AVAILABLE, 500, error)
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  static getInvestHarvestingVariety = async (req, res) => {
    try {
      const { user_id, crop_code, year, season, variety_code, variety_line_code, id, plotid, } = req.body.search;

      const whereClause = {};
      // const bspProforma3Data = await investHarvestingModel.findAll({
      //   include:[
      //     {
      //       model:varietyModel,
      //       attributes:[]
      //     }
      //   ],
      //   attributes:[
      //     [[sequelize.literal('DISTINCT invest_harvesting.variety_code'), 'id'],
      //     [sequelize.col('m_crop_variety.variety_name'), 'display_text'],        
      //   ],
      //   ],      
      //   where: {
      //     // variety_code:{
      //     //   [Op.in]:variety_code
      //     // },
      //     user_id:user_id,
      //     year:year,
      //     season:season,
      //     crop_code:crop_code

      //   },
      //   raw: true
      // })
      const data = await investHarvestingModel.findAll({
        include: [
          {
            model: varietyModel,
            attributes: []
          }
        ],
        attributes: [

          [sequelize.literal('DISTINCT invest_harvesting.variety_code'), 'variety_code'],
          [sequelize.col('m_crop_variety.variety_name'), 'display_text'],

        ],
        raw: true
      })


      return response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  static getHarvestingVerificationVariety = async (req, res) => {
    try {
      const { user_id, year, season, crop_code } = req.body.search;

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
      if (user_id) {
        whereClause.spp_id = user_id;
      }
      const investHarvesting = await investHarvestingModel.findAll({
        include: [
          {
            model: varietyModel,
            attributes: []
          }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('invest_harvesting.variety_code')), 'variety_code'],
          [sequelize.col('m_crop_variety.variety_name'), 'display_text'],
          // [sequelize.literal('DISTINCT ".season"'), 'season'],
        ],
        where: whereClause,
        raw: true,


      })
      return response(res, status.DATA_AVAILABLE, 200, investHarvesting)
    } catch (error) {
      console.error('Error fetching data:', error);
      return response(res, status.DATA_NOT_AVAILABLE, 500, error)
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  static getLotNo = async (req, res) => {
    try {
      const { user_id, year, season, bspc_id } = req.body.search;

      const whereClause = {};
      const whereClause2 = {};

      if (year) {
        whereClause.year = year;
      }
      if (season) {
        whereClause.season = season;
      }
      if (user_id) {
        whereClause.user_id = user_id;
      }
      // if (bspc_id) {
      //   whereClause.bspc_id = bspc_id;
      // }
      const investHarvesting = await db.investVerifyModel.max('lot_num', {
        // include:[
        //   {
        //     model:db.investVerifyModel,   
        //     where: whereClause,
        //     attributes:[],

        //   }
        // ],
        where: whereClause,
        // attributes: [[sequelize.col('invest_verification.lot_num'),'lot_num']],
        raw: true,
      })


      // console.log(investVerify, 'investHarvesting')
      return response(res, status.DATA_AVAILABLE, 200, investHarvesting)
    } catch (error) {
      console.error('Error fetching data:', error);
      return response(res, status.DATA_NOT_AVAILABLE, 500, error)
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  static gettotalQuantityOfCarryOver = async (req, res) => {
    try {
      const { year, season, user_id, crop_code, variety_code, parental_line_data } = req.body.search;
      let userId;
      let cropCode;
      let variertyCode;
      let parental_data;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = {
          bspc_id: req.body.loginedUserid.id
        }
      }
      if (crop_code) {
        cropCode = {
          crop_code: crop_code
        }
      }
      if (variety_code) {
        variertyCode = {
          crop_code: variety_code
        }
      }
      if (parental_line_data) {

        parental_data = {
          line_variety_code: parental_line_data
        }
      }

      let condition1 = {
        attributes: [
          [sequelize.col('seed_inventries.crop_code'), "crop_code"],
          [sequelize.col('seed_inventries.variety_code'), "variety_code"],
          [sequelize.col('seed_inventries.bspc_id'), "bspc_id"],
          [sequelize.col('seed_inventries.season'), "season"],
          [sequelize.fn('SUM', sequelize.col('seed_inventries.quantity')), "quantity"]
        ],
        group: [
          [sequelize.col('seed_inventries.crop_code'), "crop_code"],
          [sequelize.col('seed_inventries.bspc_id'), "bspc_id"],
          [sequelize.col('seed_inventries.season'), "season"],
          [sequelize.col('seed_inventries.variety_code'), "variety_code"],
        ],
        raw: true,
        where: {
          ...variertyCode,
          ...cropCode,
          ...userId,
          ...parental_data,
          [Op.and]: [
            {
              seed_class_id: 6
            }
          ]
        }
      };

      let condition2 = {
        attributes: [
          [sequelize.col('seed_inventries.crop_code'), "crop_code"],
          [sequelize.col('seed_inventries.variety_code'), "variety_code"],
          [sequelize.col('seed_inventries.bspc_id'), "bspc_id"],
          [sequelize.col('seed_inventries.season'), "season"],
          [sequelize.fn('SUM', sequelize.col('seed_inventries.quantity')), "quantity"]
        ],
        group: [
          [sequelize.col('seed_inventries.crop_code'), "crop_code"],
          [sequelize.col('seed_inventries.bspc_id'), "bspc_id"],
          [sequelize.col('seed_inventries.season'), "season"],
          [sequelize.col('seed_inventries.variety_code'), "variety_code"],
        ],
        raw: true,
        where: {
          ...variertyCode,
          ...cropCode,
          ...userId,
          ...parental_data,
          [Op.and]: [
            {
              seed_class_id: 7
            }
          ]
        }
      };
      let breederQty = await db.bspPerformaBspOne.findAll(condition1);
      let nucleusSeedQty = await db.bspPerformaBspOne.findAll(condition2)
      let responseData = {
        'nucleus_qnt': nucleusSeedQty && nucleusSeedQty[0] && nucleusSeedQty[0].quantity ? nucleusSeedQty[0].quantity : 0,
        'breeder_qnt': breederQty && breederQty[0] && breederQty[0].quantity ? breederQty[0].quantity : 0,
      }
    }
    catch (error) {
      console.error('Error fetching data:', error);
      return response(res, status.DATA_NOT_AVAILABLE, 500, error)
    }

  }
  static getHarvestingVerificationVarietySecond = async (req, res) => {
    try {
      const { user_id, year, season, crop_code } = req.body.search;

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
      if (user_id) {
        whereClause.spp_id = user_id;
      }
      const investHarvesting = await investHarvestingModel.findAll({
        include: [
          {
            model: varietyModel,
            attributes: []
          }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('invest_harvesting.variety_code')), 'variety_code'],
          [sequelize.col('m_crop_variety.variety_name'), 'display_text'],
          // [sequelize.literal('DISTINCT ".season"'), 'season'],
        ],
        where: whereClause,
        raw: true,


      })
      return response(res, status.DATA_AVAILABLE, 200, investHarvesting)
    } catch (error) {
      console.error('Error fetching data:', error);
      return response(res, status.DATA_NOT_AVAILABLE, 500, error)
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  static getBspProformaOneYearDataReport = async (req, res) => {
    try {
      let { search } = req.body;

      let mCrop;
      if (req.body.search && req.body.search.form_type == 'report_1') {
        if (req.body.loginedUserid) {
          if (req.body.loginedUserid.user_type == 'ICAR') {
            mCrop = {
              crop_code: {
                [Op.like]: 'A' + '%'
              }

            }
          }
          if (req.body.loginedUserid.user_type == 'HICAR') {
            mCrop = {
              crop_code: {
                [Op.like]: 'H' + '%'
              }
            }
          }


        }

      }
      let filter = await ConditionCreator.breederBspFormFilter(search);
      let condition = {
        include: [
          {
            model: cropModel,
            attributes: [],
            where: {
              ...mCrop
            }
          }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('indent_of_breederseeds.year')), 'year']
        ],
        required: true,
        raw: true,
        where: {
          ...filter,
          // willing_to_produce: 1,
          icar_freeze: 1
        },
        order: [['year', 'DESC']]
      }
      let getBspOneYears = await db.indentOfBreederseedModel.findAll(condition);
      return response(res, status.DATA_AVAILABLE, 200, getBspOneYears);

    } catch (error) {
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 500, []);
    }
  }

  static getBspProformaOneSeasonDataReport = async (req, res) => {
    try {
      let { search } = req.body;

      let mCrop;
      if (req.body.search && req.body.search.form_type == 'report_1') {
        if (req.body.loginedUserid) {
          if (req.body.loginedUserid.user_type == 'ICAR') {
            mCrop = {
              crop_code: {
                [Op.like]: 'A' + '%'
              }

            }
          }
          if (req.body.loginedUserid.user_type == 'HICAR') {
            mCrop = {
              crop_code: {
                [Op.like]: 'H' + '%'
              }
            }
          }

        }

      }
      let filter = await ConditionCreator.breederBspFormFilter(search);
      let condition = {
        include: [
          {
            model: db.seasonModel,
            attributes: []
          },
          {
            model: cropModel,
            attributes: [],
            where: {

              ...mCrop
            }
          }
        ],
        required: true,
        raw: true,
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('indent_of_breederseeds.season')), 'season__code'],
          [sequelize.col('m_season.season'), 'season_name'],
        ],
        where: {
          ...filter,
          // willing_to_produce: 1,
          icar_freeze: 1
        },
        order: [[sequelize.col('indent_of_breederseeds.season'), 'ASC']]
      }
      let getBspOneYears = await db.indentOfBreederseedModel.findAll(condition);
      return response(res, status.DATA_AVAILABLE, 200, getBspOneYears);

    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 500, []);
    }
  }

  static getBspProformaOneCropDataReport = async (req, res) => {
    try {
      let { search } = req.body;
      let mCrop;
      if (req.body.search && req.body.search.form_type == 'report_1') {
        if (req.body.loginedUserid) {
          if (req.body.loginedUserid.user_type == 'ICAR') {

            mCrop = {
              crop_code: {
                [Op.like]: 'A' + '%'
              }

            }
          }
          if (req.body.loginedUserid.user_type == 'HICAR') {
            mCrop = {
              crop_code: {
                [Op.like]: 'H' + '%'
              }
            }
          }

        }

      }
      let filter = await ConditionCreator.breederBspFormFilter(search);
      let condition = {
        include: [
          {
            model: cropModel,
            attributes: [],
            where: {
              ...mCrop,
            }
          }
        ],
        raw: true,
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('m_crop.crop_code')), 'crop_code'],
          [sequelize.col('m_crop.crop_name'), 'crop_name'],
        ],
        where: {
          ...filter,
          // willing_to_produce: 1,
          icar_freeze: 1
        },
        order: [[sequelize.col('m_crop.crop_code'), 'ASC']]
      }
      let getBspOneYears = await db.indentOfBreederseedModel.findAll(condition);
      return response(res, status.DATA_AVAILABLE, 200, getBspOneYears);

    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 500, []);
    }
  }



  static bspOneStatusReport = async (req, res) => {
    try {
      let rules = {
        "year": 'required',
        "season": 'required|string',
        "crop_code": 'required|string',
      };

      let validation = new Validator(req.body.search, rules);
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

      let mCrop;
      if (req.body.loginedUserid) {
        if (req.body.loginedUserid.user_type == 'ICAR') {
          mCrop = {
            crop_code: {
              [Op.like]: 'A' + '%'
            }

          }
        }
        if (req.body.loginedUserid.user_type == 'HICAR') {
          mCrop = {
            crop_code: {
              [Op.like]: 'H' + '%'
            }
          }
        }

      }

      let condition = {
        include: [
          {
            required: false,
            model: db.bspPerformaBspOne,
            where: {
              year: [sequelize.col('indent_of_breederseeds.year')],
              season: [sequelize.col('indent_of_breederseeds.season')],
              crop_code: [sequelize.col('indent_of_breederseeds.crop_code')],
            },
            attributes: [],
          },
          {
            model: db.cropModel,
            attributes: [],
            include: [

              {
                model: db.userModel,
                attributes: [],
                include: [
                  {
                    model: db.agencyDetailModel,
                    attributes: []
                  }
                ]
              }
            ],
            where: {
              ...mCrop
            }
          },

        ],
        where: {
        },
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('m_crop->user->agency_detail.user_id')), 'user_id'],
          [sequelize.col('m_crop->user->agency_detail.agency_name'), 'name'],
          [sequelize.col('m_crop->user->agency_detail.id'), 'agency_id'],
          [sequelize.col('m_crop->user.username'), 'user_name'],
          [sequelize.col('m_crop->user.code'), 'code'],
          [sequelize.col('indent_of_breederseeds.year'), 'year'],
          [sequelize.col('indent_of_breederseeds.season'), 'season'],
          [sequelize.col('indent_of_breederseeds.crop_code'), 'crop_code'],
        ],
        raw: true,
      }
      if (req.body) {
        console.log("yes", req.body);

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
          if (req.body.search.variety_code) {
            condition.where.variety_code = req.body.search.variety_code
          }
          if (req.body.search.variety_code_array && req.body.search.variety_code_array.length) {
            condition.where.variety_code = {
              [Op.in]: req.body.search.variety_code_array
            }
          }
        }
      }
      const data = await db.indentOfBreederseedModel.findAll(condition)
      if (data && data.length) {
        let final_array = [];
        for (let key of data) {
          if (key && key.user_id) {
            let request = {
              "crop_code": key.crop_code,
              "season": key.season,
              "year": key.year,
              "user_id": key.user_id,
              "report": 2,
            }
            let data = await this.bspOneStatusReportCheckStatus(request);
            final_array.push({
              "user_id": key.user_id,
              "name": key.name,
              "agency_id": key.agency_id,
              "user_name": key.user_name,
              "code": key.code,
              "status": data.status,
              "submit_date": data.submit_date
            })
          }
        }
        return response(res, status.DATA_AVAILABLE, 200, final_array);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, {})
      }
    } catch (error) {
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 501, [])
    }
  }
  static bspOneStatusReportCheckStatus = async (req, res) => {
    try {


      let conditionIndent = {
        where: {},
        attributes: [
          [sequelize.col('indent_of_breederseeds.icar_freeze'), 'icar_freeze'],


        ],
        raw: true,
      };
      let conditionBsp = {
        where: {},
        attributes: [
          [sequelize.col('bsp_proforma_1s.is_final_submit'), 'is_final_submit'],
          [sequelize.col('bsp_proforma_1s.updated_at'), 'updated_at'],
        ],
        raw: true,
      };

      // Apply filters from the request
      if (req) {
        if (req.year) {
          conditionIndent.where.year = req.year;
          conditionBsp.where.year = req.year;
        }
        if (req.season) {
          conditionIndent.where.season = req.season;
          conditionBsp.where.season = req.season;
        }
        if (req.crop_code) {
          conditionIndent.where.crop_code = req.crop_code;
          conditionBsp.where.crop_code = req.crop_code;
        }
      }

      // Fetch data from both models
      const indentData = await db.indentOfBreederseedModel.findOne(conditionIndent);
      const bspData = await db.bspPerformaBspOne.findOne(conditionBsp);

      console.log("hi", indentData);

      console.log("hi1", bspData);

      let status = "Pending";
      let submit_date = "";

      // Check conditions based on fetched data
      if (indentData && bspData) {

        // Check if both conditions (icar_freeze and is_final_submit) are met
        if (indentData.icar_freeze == 1 && bspData.is_final_submit == 1) {
          status = "Completed";
          submit_date = bspData.updated_at || "";
        } else if (indentData.icar_freeze == 1 && bspData.is_final_submit == 0) {
          status = "Working";
          // submit_date = indentData.updated_at || "";
        } else {
          status = "Pending";
        }
      }

      // Additional logic for report type 3
      if (req && req.report == 3 && !bspData) {
        status = "Pending";
        submit_date = "";
      }

      return { status, submit_date };

    } catch (error) {
      console.error('Error:', error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  };



  static getBspOnePerformaYearDataReport = async (req, res) => {
    try {
      let breederId;
      let mCrop;
      if (req.body.search && req.body.search.form_type == 'report_2') {
        if (req.body.loginedUserid) {
          if (req.body.loginedUserid.user_type == 'ICAR') {
            mCrop = {
              crop_code: {
                [Op.like]: 'A' + '%'
              }

            }
          }
          if (req.body.loginedUserid.user_type == 'HICAR') {
            mCrop = {
              crop_code: {
                [Op.like]: 'H' + '%'
              }
            }
          }
          if (req.body.loginedUserid.user_type == 'BR') {
            breederId = {
              breeder_id: req.body.loginedUserid.id
            }
          }
        }

      }
      let responseData = await db.bspPerformaBspOne.findAll({
        include: [
          {
            model: db.cropModel,
            attributes: [],
            where: {
              ...breederId,
              ...mCrop
            }
          }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('bsp_proforma_1s.year')), 'year'],
        ],
        where: {
          // is_freezed: 1,
          is_active: 1,
          // meet_target: {
          //   [Op.ne]: 1
          // }
          // is_final_submit: 1,
        },
        raw: true,
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

  static getBspOnePerformaSeasonReport = async (req, res) => {
    try {
      let breederId;
      let mCrop;
      if (req.body.search && req.body.search.form_type == 'report_2') {
        if (req.body.loginedUserid) {
          if (req.body.loginedUserid.user_type == 'ICAR') {
            mCrop = {
              crop_code: {
                [Op.like]: 'A' + '%'
              }

            }
          }
          if (req.body.loginedUserid.user_type == 'HICAR') {
            mCrop = {
              crop_code: {
                [Op.like]: 'H' + '%'
              }
            }
          }
          if (req.body.loginedUserid.user_type == 'BR') {
            breederId = {
              breeder_id: req.body.loginedUserid.id
            }
          }
        }

      }

      let responseData = await db.bspPerformaBspOne.findAll({
        include: [
          {
            model: db.cropModel,
            attributes: [],
            where: {
              ...breederId,
              ...mCrop
            }
          }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('bsp_proforma_1s.season')), 'season'],
        ],
        raw: true,
        where: {
          // is_freezed: 1,
          is_active: 1,
          // meet_target: {
          //   [Op.ne]: 1
          // }
          // is_final_submit: 1,

        },
        order: [
          [sequelize.col('bsp_proforma_1s.season'), 'ASC'] 
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

  static getBspOnePerformaCropReport = async (req, res) => {
    try {
      let breederId;
      let mCrop;
      if (req.body.search && req.body.search.form_type == 'report_2') {
        if (req.body.loginedUserid) {

          console.log("hi", req.body.loginedUserid)
          console.log("hi", req.body.loginedUserid.user_type)
          if (req.body.loginedUserid.user_type == 'ICAR') {
            mCrop = {
              crop_code: {
                [Op.like]: 'A' + '%'
              }

            }
          }
          if (req.body.loginedUserid.user_type == 'HICAR') {
            mCrop = {
              crop_code: {
                [Op.like]: 'H' + '%'
              }
            }
          }
          if (req.body.loginedUserid.user_type == 'BR') {
            breederId = {
              breeder_id: req.body.loginedUserid.id
            }
          }
        }

      }

      let responseData = await db.bspPerformaBspOne.findAll({
        include: [
          {
            model: db.cropModel,
            attributes: [],
            where: {
              ...breederId,
              ...mCrop
            }
          }
        ],
        // include: [
        //   {
        //     model: db.cropModel,
        //     attributes: []
        //   },

        // ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('bsp_proforma_1s.crop_code')), 'crop_code'],
          [sequelize.col('m_crop.crop_name'), 'crop_name']
        ],
        raw: true,
        where: {
          // is_freezed: 1,
          is_active: 1,
          year: req.body.search.year,
          season: req.body.search.season,
          // meet_target: {
          //   [Op.ne]: 1
          // }
          // is_final_submit: 1,

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

  static getBspProformaYearsReport = async (req, res) => {
    try {
      const { user_id } = req.body;

      if (!user_id) {
        return response(res, status.BAD_REQUEST, 400, {
          message: "user_id is required in the request body.",
        });
      }
      let breederId;
      let mCrop;
      if (req.body && req.body.form_type == 'report_3') {
        if (req.body.loginedUserid) {
          if (req.body.loginedUserid.user_type == 'ICAR') {
            mCrop = {
              crop_code: {
                [Op.like]: 'A' + '%'
              }

            }
          }
          if (req.body.loginedUserid.user_type == 'HICAR') {
            mCrop = {
              crop_code: {
                [Op.like]: 'H' + '%'
              }
            }
          }
          if (req.body.loginedUserid.user_type == 'BR') {
            breederId = {
              breeder_id: req.body.loginedUserid.id
            }
          }
        }

      }

      const bspProforma2Data = await bspProrforma2Model.findAll({
        attributes: ['id'],
        // where: {
        //   user_id: user_id
        // }
      });

      if (!bspProforma2Data || bspProforma2Data.length === 0) {
        return response(res, status.BAD_REQUEST, 202, {
          message: "User ID not found in bsp_proforma_2s.",
        });
      }
      const bspProforma2IDs = bspProforma2Data.map((data) => data.id);

      const bspProforma3Data = await bspProrforma3Model.findAll({
        include: [
          {
            model: db.cropModel,
            attributes: [],
            where: {
              ...breederId,
              ...mCrop
            }
          }
        ],
        attributes: [
          [sequelize.literal('DISTINCT "year"'), 'year'],
        ],
        raw: true,
        where: {
          bsp_proforma_2_id: bspProforma2IDs,
        },
        order: [[sequelize.col("year"), "DESC"]]
      });

      res.status(200).json({
        status: 200,
        message: 'Years retrieved successfully',
        data: bspProforma3Data
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      response(res, status.DATA_NOT_AVAILABLE, 500, error)
    }
  };
  static getBspProformaSeasonReport = async (req, res) => {
    try {
      const { user_id, year } = req.body;

      if (!user_id) {
        return response(res, status.BAD_REQUEST, 202, {
          message: "user_id is required in the request body.",
        });
      }
      if (!year) {
        return response(res, status.BAD_REQUEST, 202, {
          message: "year is required in the request body.",
        });
      }
      let breederId;
      let mCrop;
      if (req.body && req.body.form_type == 'report_3') {
        if (req.body.loginedUserid) {
          if (req.body.loginedUserid.user_type == 'ICAR') {
            mCrop = {
              crop_code: {
                [Op.like]: 'A' + '%'
              }

            }
          }
          if (req.body.loginedUserid.user_type == 'HICAR') {
            mCrop = {
              crop_code: {
                [Op.like]: 'H' + '%'
              }
            }
          }
          if (req.body.loginedUserid.user_type == 'BR') {
            breederId = {
              breeder_id: req.body.loginedUserid.id
            }
          }
        }

      }
      const bspProforma2Data = await bspProrforma2Model.findAll({
        attributes: ['id'],
        // where: {
        //   user_id: user_id,
        // }
      });

      if (!bspProforma2Data || bspProforma2Data.length === 0) {
        return response(res, status.BAD_REQUEST, 202, {
          message: "User ID not found in bsp_proforma_2s.",
        });
      }
      const bspProforma2IDs = bspProforma2Data.map((data) => data.id);

      const bspProforma3Data = await bspProrforma3Model.findAll({
        include: [
          {
            model: db.cropModel,
            attributes: [],
            where: {
              ...breederId,
              ...mCrop
            }
          }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('bsp_proforma_3s.season')), 'season']
        ],
        raw: true,
        where: {
          bsp_proforma_2_id: bspProforma2IDs,
          year: year
        }
      });

      res.status(200).json({
        status: 200,
        message: 'Season retrieved successfully',
        data: bspProforma3Data
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      response(res, status.DATA_NOT_AVAILABLE, 500, error)
    }
  };
  static getCropListReport = async (req, res) => {
    try {
      const { user_id, year, season } = req.body;

      if (!user_id) {
        return response(res, status.BAD_REQUEST, 202, {
          message: "user_id is required in the request body.",
        });
      }
      if (!year) {
        return response(res, status.BAD_REQUEST, 202, {
          message: "year is required in the request body.",
        });
      }
      if (!season) {
        return response(res, status.BAD_REQUEST, 202, {
          message: "season is required in the request body.",
        });
      }
      let breederId;
      let mCrop;
      if (req.body && req.body.form_type == 'report_3') {
        if (req.body.loginedUserid) {
          if (req.body.loginedUserid.user_type == 'ICAR') {
            mCrop = {
              crop_code: {
                [Op.like]: 'A' + '%'
              }

            }
          }
          if (req.body.loginedUserid.user_type == 'HICAR') {
            mCrop = {
              crop_code: {
                [Op.like]: 'H' + '%'
              }
            }
          }
          if (req.body.loginedUserid.user_type == 'BR') {
            breederId = {
              breeder_id: req.body.loginedUserid.id
            }
          }
        }

      }
      const bspProforma2Data = await bspProrforma2Model.findAll({
        attributes: ['id'],
        // where: {
        //   user_id: user_id
        // }
      });

      if (!bspProforma2Data || bspProforma2Data.length === 0) {
        return response(res, status.BAD_REQUEST, 202, {
          message: "User ID not found in bsp_proforma_2s.",
        });
      }
      const bspProforma2IDs = bspProforma2Data.map((data) => data.id);

      const bspProforma3Data = await bspProrforma3Model.findAll({
        attributes: [
          [sequelize.literal('DISTINCT bsp_proforma_3s.crop_code'), 'crop_code']
        ],
        where: {
          bsp_proforma_2_id: bspProforma2IDs,
          year: year,
          season: season
        },
        include: [
          {
            model: cropModel,
            attributes: ['crop_name'],
            required: true,
            where: {
              ...breederId,
              ...mCrop
            }
          }
        ],
        raw: true,
        nest: true
      });

      res.status(200).json({
        status: 200,
        message: 'Crop data retrieved successfully',
        data: bspProforma3Data
      });
      // response(res, 'Crop data retrieved successfully', 200, bspProforma3Data)
    } catch (error) {
      console.error('Error fetching data:', error);
      response(res, status.DATA_NOT_AVAILABLE, 500, error)
    }
  };
  static bspTwoStatusReportCheckStatus = async (req, res) => {
    try {
      let returnResponse;
      console.log("req34343", req);
      let condition = {
        where: {
        },

        attributes: ['is_freezed', 'variety_code', 'updated_at', "is_inspected"
        ],
        raw: true,
      }
      let condition1 = {
        where: {
        },

        attributes: ['year', 'season', 'crop_code', 'variety_code'
        ],
        raw: true,
      }
      if (req) {

        if (req.year) {
          condition.where.year = req.year
          condition1.where.year = req.year
        }
        if (req.season) {
          condition.where.season = req.season
          condition1.where.season = req.season
        }
        if (req.crop_code) {
          condition.where.crop_code = req.crop_code
          condition1.where.crop_code = req.crop_code
        }
        if (req.user_id) {
          condition.where.user_id = req.user_id
          condition1.where.user_id = req.user_id
        }

      }
      const data = await db.bspPerformaBspTwo.findAll(condition)
      console.log("databsp2", data);

      if (data && data.length) {
        let is_freeze;
        let submit_date;
        if (req && req.report == 2) {
          for (let key of data) {
            if (key.is_freezed == 0) {
              submit_date = "";
              is_freeze = "Working";
              // return;
              break;
            } else {
              submit_date = key.updated_at;
              is_freeze = "Completed";
            }
          }
          returnResponse = { "status": is_freeze, "submit_date": submit_date ? submit_date : "" };
        }
        if (req && req.report == 3) {

          const data1 = await db.bspPerformaBspTwo.findAll(condition1)
          console.log("databsp3", data1);
          if (data1 && data1.length < 1) {
            returnResponse = { "status": "Pending", "submit_date": "" };
          }
          for (let key of data) {
            if (key.is_inspected == false) {
              submit_date = "";
              is_freeze = "Working";
              // return;
              break;
            } else {
              submit_date = key.updated_at;
              is_freeze = "Completed";
            }
          }
          returnResponse = { "status": is_freeze, "submit_date": submit_date ? submit_date : "" };
        }
        return returnResponse;
      } else {
        returnResponse = { "status": "Pending", "submit_date": "" };
        return returnResponse;
      }
    } catch (error) {
      response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }

  static bspTwoStatusReport = async (req, res) => {
    try {
      let rules = {
        "year": 'required',
        "season": 'required|string',
        "crop_code": 'required|string',
      };

      let validation = new Validator(req.body.search, rules);
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
      let breederId;
      let mCrop;
      if (req.body.loginedUserid) {
        if (req.body.loginedUserid.user_type == 'ICAR') {
          mCrop = {
            crop_code: {
              [Op.like]: 'A' + '%'
            }

          }
        }
        if (req.body.loginedUserid.user_type == 'HICAR') {
          mCrop = {
            crop_code: {
              [Op.like]: 'H' + '%'
            }
          }
        }
        if (req.body.loginedUserid.user_type == 'BR') {
          breederId = {
            breeder_id: req.body.loginedUserid.id
          }
        }
      }

      let condition = {
        include: [
          {
            required: false,
            model: db.bspPerformaBspTwo,
            where: {
              year: [sequelize.col('bsp_proforma_1s.year')],
              season: [sequelize.col('bsp_proforma_1s.season')],
              crop_code: [sequelize.col('bsp_proforma_1s.crop_code')],
            },
            attributes: [],
          },
          {
            model: db.bspProforma1BspcsModel,
            where: {
              [Op.and]: [
                {
                  target_qunatity: {
                    [Op.not]: null
                  }
                },
              ]
            },
            attributes: [],
            include: [
              {
                model: db.userModel,
                attributes: [],
                include: [
                  {
                    model: db.agencyDetailModel,
                    attributes: []
                  }
                ]
              }
            ]
          },
          {
            model: db.cropModel,
            attributes: [],
            where: {
              ...mCrop,
              ...breederId
            }
          }
        ],
        where: {
        },
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('bsp_proforma_1_bspc.bspc_id')), 'user_id'],
          [sequelize.col('bsp_proforma_1_bspc->user->agency_detail.agency_name'), 'name'],
          [sequelize.col('bsp_proforma_1_bspc->user->agency_detail.id'), 'agency_id'],
          [sequelize.col('bsp_proforma_1_bspc->user.username'), 'user_name'],
          [sequelize.col('bsp_proforma_1_bspc->user.code'), 'code'],
          [sequelize.col('bsp_proforma_1s.year'), 'year'],
          [sequelize.col('bsp_proforma_1s.season'), 'season'],
          [sequelize.col('bsp_proforma_1s.crop_code'), 'crop_code'],
        ],
        raw: true,
      }
      if (req.body) {
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
          if (req.body.search.variety_code) {
            condition.where.variety_code = req.body.search.variety_code
          }
          if (req.body.search.variety_code_array && req.body.search.variety_code_array.length) {
            condition.where.variety_code = {
              [Op.in]: req.body.search.variety_code_array
            }
          }
        }
      }
      const data = await db.bspPerformaBspOne.findAll(condition)
      if (data && data.length) {
        let final_array = [];
        for (let key of data) {
          if (key && key.user_id) {
            let request = {
              "crop_code": key.crop_code,
              "season": key.season,
              "year": key.year,
              "user_id": key.user_id,
              "report": 2,
            }
            let data = await this.bspTwoStatusReportCheckStatus(request);
            final_array.push({
              "user_id": key.user_id,
              "name": key.name,
              "agency_id": key.agency_id,
              "user_name": key.user_name,
              "code": key.code,
              "status": data.status,
              "submit_date": data.submit_date
            })
          }
        }
        return response(res, status.DATA_AVAILABLE, 200, final_array);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, {})
      }
    } catch (error) {
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 501, [])
    }
  }

  static bspThreeStatusReport = async (req, res) => {
    try {
      let rules = {
        "year": 'required',
        "season": 'required|string',
        "crop_code": 'required|string',
      };

      let validation = new Validator(req.body.search, rules);
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

      let breederId;
      let mCrop;
      if (req.body.loginedUserid) {
        if (req.body.loginedUserid.user_type == 'ICAR') {
          mCrop = {
            crop_code: {
              [Op.like]: 'A' + '%'
            }

          }
        }
        if (req.body.loginedUserid.user_type == 'HICAR') {
          mCrop = {
            crop_code: {
              [Op.like]: 'H' + '%'
            }
          }
        }
        if (req.body.loginedUserid.user_type == 'BR') {
          breederId = {
            breeder_id: req.body.loginedUserid.id
          }
        }
      }
      let condition = {
        include: [
          {
            required: false,
            model: db.bspPerformaBspThree,
            where: {
              year: [sequelize.col('bsp_proforma_2s.year')],
              season: [sequelize.col('bsp_proforma_2s.season')],
              crop_code: [sequelize.col('bsp_proforma_2s.crop_code')],
            },
            attributes: [],
            // include: [

            // ]
          },
          {
            model: db.userModel,
            attributes: [],
            include: [
              {
                model: db.agencyDetailModel,
                attributes: []
              }
            ]
          },
          {
            model: db.cropModel,
            attributes: [],
            where: {
              ...mCrop,
              ...breederId
            }
          }
        ],
        where: {

        },
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('bsp_proforma_2s.user_id')), 'user_id'],
          [sequelize.col('user->agency_detail.agency_name'), 'name'],
          [sequelize.col('user.username'), 'user_name'],
          [sequelize.col('user.code'), 'code'],
          'year', 'season', 'crop_code'
          // [sequelize.col('bsp_proforma_2.is_inspected'), 'is_final_submit'],
          // [sequelize.col('bsp_proforma_2.updated_at'), 'final_submission_date'],
        ],
        raw: true,
      }
      if (req.body) {
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
          if (req.body.search.variety_code) {
            condition.where.variety_code = req.body.search.variety_code
          }
          if (req.body.search.variety_code_array && req.body.search.variety_code_array.length) {
            condition.where.variety_code = {
              [Op.in]: req.body.search.variety_code_array
            }
          }
        }
      }
      const data = await db.bspPerformaBspTwo.findAll(condition)
      if (data && data.length) {
        console.log(data)
        let final_array = [];
        for (let key of data) {
          if (key && key.user_id) {
            let request = {
              "crop_code": key.crop_code,
              "season": key.season,
              "year": key.year,
              "user_id": key.user_id,
              "report": 3,
            }
            let data = await this.bspTwoStatusReportCheckStatus(request);
            final_array.push({
              "user_id": key.user_id,
              "name": key.name,
              "user_name": key.user_name,
              "code": key.code,
              "status": data.status,
              "submit_date": data.submit_date
            })
          }
        }
        return response(res, status.DATA_AVAILABLE, 200, final_array);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, [])
      }
    } catch (error) {
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 501, [])
    }
  }
  static CropStatusReport = async (req, res) => {
    try {
      let rules = {
        "year": 'required',
        "season": 'required|string',
      };

      let validation = new Validator(req.body.search, rules);
      const isValidData = validation.passes();

      if (!isValidData) {
        let errorResponse = {};
        for (let key in rules) {
          const error = validation.errors.get(key);
          if (error.length) {
            errorResponse[key] = error;
          }
        }
        return response(res, status.BAD_REQUEST, 400, errorResponse);
      }

      let mCrop;
      if (req.body.loginedUserid) {
        if (req.body.loginedUserid.user_type === 'ICAR') {
          mCrop = {
            crop_code: {
              [Op.like]: 'A' + '%'
            }
          };
        } else if (req.body.loginedUserid.user_type === 'HICAR') {
          mCrop = {
            crop_code: {
              [Op.like]: 'H' + '%'
            }
          };
        }
      }

      let condition = {
        include: [
          {
            required: false,
            model: db.bspPerformaBspOne,
            where: {
              year: [sequelize.col('indent_of_breederseeds.year')],
              season: [sequelize.col('indent_of_breederseeds.season')],
              crop_code: [sequelize.col('indent_of_breederseeds.crop_code')],
              production_type: 'NORMAL'
            },
            attributes: [],
            include: [
              {
                model: db.userModel,
                attributes: [],
                where: {
                  user_type: 'BR'
                },
                include: [
                  {
                    model: db.agencyDetailModel,
                    attributes: []

                  }
                ]
              },
              {
                model: db.bspProformaOneBspc,
                attributes: [],
                include: [
                  {
                    model: db.userModel,
                    attributes: [],
                    include: [
                      {
                        model: db.agencyDetailModel,
                        attributes: []
                      }
                    ]
                  },
                ]
              }

            ]
          },
          // { 
          //   model: db.varietyModel,
          //   attributes: [],
          // },
          {
            model: db.cropModel,
            attributes: [],
            where: {
              ...mCrop
            }
          },

        ],
        where: {},
        attributes: [

          [sequelize.fn('DISTINCT', sequelize.col('indent_of_breederseeds.variety_code')), 'variety_code'],
          [sequelize.col('bsp_proforma_1->user->agency_detail.user_id'), 'user_id'],
          [sequelize.col('bsp_proforma_1->user->agency_detail.agency_name'), 'pdpc_name'],
          [sequelize.col('bsp_proforma_1->user->agency_detail.id'), 'pdpc_id'],
          [sequelize.col('bsp_proforma_1->bsp_proforma_1_bspc.bspc_id'), 'bspc_id'],
          [sequelize.col('bsp_proforma_1->bsp_proforma_1_bspc->user->agency_detail.agency_name'), 'bspc_name'],
          [sequelize.col('bsp_proforma_1->user.username'), 'user_name'],
          [sequelize.col('m_crop.crop_name'), 'crop_name'],
          [sequelize.col('bsp_proforma_1->user.code'), 'code'],
          [sequelize.col('indent_of_breederseeds.year'), 'year'],
          [sequelize.col('indent_of_breederseeds.season'), 'season'],
          [sequelize.col('indent_of_breederseeds.crop_code'), 'crop_code'],
          [sequelize.col('indent_of_breederseeds.indent_quantity'), 'indent_quantity'],
        ],
        raw: true,
        // group: ['user_id'], // Grouping by user_id
      };

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
        if (req.body.search.variety_code) {
          condition.where.variety_code = req.body.search.variety_code;
        }
        if (req.body.search.variety_code_array && req.body.search.variety_code_array.length) {
          condition.where.variety_code = {
            [Op.in]: req.body.search.variety_code_array
          };
        }
      }

      const data = await db.indentOfBreederseedModel.findAll(condition);
      if (data && data.length) {
        let final_map = {};
        for (let key of data) {
          if (key && key.user_id) {
            const cropCode1 = key.crop_code;
            let cropType = '';
            let unitKgQ = '';

            if (cropCode1) {
              if (cropCode1.slice(0, 1) === 'A') {
                cropType = 'agriculture';
                unitKgQ = 'Qt';
              } else if (cropCode1.slice(0, 1) === 'H') {
                cropType = 'horticulture';
                unitKgQ = 'kg';
              }
            }
            if (req.body.search.crop_type && cropType !== req.body.search.crop_type) {
              continue;
            }
            let request = {
              "crop_code": key.cropCode1,
              "season": key.season,
              "year": key.year,
              "user_id": key.user_id,
              "report": 2,
            };
            let data1 = await this.bspOneStatusReportCheckStatus(request);
            request.user_id = key.bspc_id;
            let data2 = await this.bspTwoStatusReportCheckStatus(request);
            console.log("data2", data2);
            request.report = 3;
            let data3 = await this.bspTwoStatusReportCheckStatus(request);
            console.log("data3", data3);

            // Grouping the variety codes for each user
            if (!final_map[key.user_id]) {
              final_map[key.user_id] = {
                user_id: key.user_id,
                crop_type: cropType,
                Unit: unitKgQ,
                crop_name: key.crop_name,
                pdpc_name: key.pdpc_name,
                pdpc_id: key.pdpc_id,
                assigned_to_pdpc_crop_status: key.pdpc_id ? "Yes" : "No",
                user_name: key.user_name,
                variety_codes: [], // Initialize as an array
                indent_quantity: [],// Initialize as an array 
                bsp_1_status: data1.status,
                bspc_status: []

              };
            } 
            final_map[key.user_id].variety_codes.push(key.variety_code);
            final_map[key.user_id].indent_quantity.push(key.indent_quantity);
            // Check for duplicate bspc_id before adding and filter out null bspc_id
            const bspcExists = final_map[key.user_id].bspc_status.some(bspc => bspc.bspc_id === key.bspc_id);
            if (!bspcExists && key.bspc_id !== null) {
              final_map[key.user_id].bspc_status.push({
                "bspc_id": key.bspc_id,
                "bspc_name": key.bspc_name,
                "bsp_2_status": data2.status,
                "bsp_3_status": data3.status
              });
            }

          }
        }

        // Convert the final_map object into an array
        const final_array = Object.values(final_map);
        return response(res, status.DATA_AVAILABLE, 200, final_array);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, {});
      }
    } catch (error) {
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 501, []);
    }
  }

   


}
module.exports = IndentorController
