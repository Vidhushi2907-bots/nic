require('dotenv').config()
const response = require('../_helpers/response')
const status = require('../_helpers/status.conf')
const db = require("../models");
const sendSms = require("../_helpers/sms")
const { monitoringTeamPdpc, monitoringTeamPdpcDetails, stateModel, seasonModel, cropModel, monitoringTeamAssignedToBspcsModel, agencytypeModel, districtModel, designationModel, monitoringTeamOfBspcMember, monitoringTeamOfBspc } = db

const sequelize = require('sequelize');
const ConditionCreator = require('../_helpers/condition-creator')
const Op = require('sequelize').Op;
const union = require('lodash');
const attributes = require('validatorjs/src/attributes');
const { model } = require('../models/db');
const seed_tag_detailModel = require('../models/seed_tag_detail.model');

class MonitoringTeamDetails {
  static getTeamMonotoringTeamAllData = async (req, res) => {
    let returnResponse = {};
    try {
      let { search, } = req.body;
      let userId;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = req.body.loginedUserid.id;
      }
      let filters = await ConditionCreator.bspcNewFlowFilter(search);
      let isExits;
      if (search && search.team_id) {
        isExits = await monitoringTeamOfBspc.findAll({
          where: {
            ...filters
          }
        });
      }
      if (isExits) {
        return response(res, status.ALREADY_AVAILED, 201, []);
      }

      let condition = {
        include: [
          {
            model: monitoringTeamPdpcDetails,
            required: true,
            attributes: [],
            include: [
              {
                model: stateModel,
                attributes: [],
              },
              {
                model: agencytypeModel,
                attributes: [],
              },
              {
                model: districtModel,
                attributes: [],
              },
              {
                model: designationModel,
                attributes: [],
              }
            ]
          },
          {
            required: true,
            model: monitoringTeamAssignedToBspcsModel,
            attributes: [],
            where: {
              bspc_id: userId
            }
          }
        ],
        attributes: [
          [sequelize.col('monitoring_team_of_pdpcs.id'), 'id'],
          [sequelize.col('monitoring_team_of_pdpcs.name'), 'team_name'],
          [sequelize.col('monitoring_team_of_pdpc_detail->agency_type.id'), 'agency_id'],
          [sequelize.col('monitoring_team_of_pdpc_detail->agency_type.name'), 'agency_name'],
          [sequelize.col('monitoring_team_of_pdpcs.crop_code'), 'crop_code'],
          [sequelize.col('monitoring_team_of_pdpcs.variety_code'), 'variety_code'],
          [sequelize.col('monitoring_team_of_pdpc_detail->m_designation.id'), 'designation_id'],
          [sequelize.col('monitoring_team_of_pdpc_detail->m_designation.name'), 'designation_name'],
          [sequelize.col('monitoring_team_of_pdpc_detail->m_district.district_code'), 'district_code'],
          [sequelize.col('monitoring_team_of_pdpc_detail->m_district.district_name'), 'district_name'],
          [sequelize.col('monitoring_team_of_pdpc_detail->m_state.state_code'), 'state_code'],
          [sequelize.col('monitoring_team_of_pdpc_detail->m_state.state_name'), 'state_name'],
          // monitoring_team_of_pdpc_detail.id      
          // [sequelize.col('monitoring_team_of_pdpc_detail->m_district.district_code')]
          // [sequelize.col('monitoring_team_of_pdpc_detail')]
        ],
        // group:[
        //   [sequelize.col('monitoring_team_of_pdpcs.id'),'id'],
        //   [sequelize.col('monitoring_team_of_pdpc_detail->agency_type.id'),'id'],
        //   [sequelize.col('monitoring_team_of_pdpcs.name'),'team_name'],
        //   [sequelize.col('monitoring_team_of_pdpcs.crop_code'),'crop_code'],
        //   [sequelize.col('monitoring_team_of_pdpcs.variety_code'),'variety_code'],
        //   [sequelize.col('monitoring_team_of_pdpc_detail->m_designation.id'),'designation_id'],
        //   [sequelize.col('monitoring_team_of_pdpc_detail->m_designation.name'),'designation_name'],
        //   [sequelize.col('monitoring_team_of_pdpc_detail->m_district.district_code'),'district_code'],
        //   [sequelize.col('monitoring_team_of_pdpc_detail->m_district.district_name'),'district_name'],
        //   [sequelize.col('monitoring_team_of_pdpc_detail->m_state.state_code'),'state_code'],
        //   [sequelize.col('monitoring_team_of_pdpc_detail->m_state.state_name'),'state_name']
        // ],
        raw: true,
        where: {
          ...filters,
        }
      };
      let teamAllData = await monitoringTeamPdpc.findAll(condition);
      const filteredData = []
      // let removeDuplicate = indentor.removeDuplicates(bspProformaOneData.rows, 'bspc_id')
      teamAllData.forEach(el => {
        const spaIndex = filteredData.findIndex(item => item.variety_code === el.variety_code);
        if (spaIndex === -1) {
          filteredData.push({
            id: el.id,
            name: el.team_name,
            variety_code: el.variety_code,
            year: el.year,
            season: el.season,
            crop_code: el.crop_code,
            count: 1,
            team_member: [
              {
                agency_id: el.agency_id,
                name: el.agency_name,
                state_name: el.state_name,
                state_code: el.state_code,
                district_code: el.district_code,
                district_name: el.district_name,
                designation_name: el.designation_name,
                designation_id: el.designation_id,
                count: 1,
                id: el.bspc_id
              }
            ]
          });
        } else {
          const cropIndex = filteredData[spaIndex].team_member.findIndex(item => item.id === el.agency_id);
          if (cropIndex !== -1) {
            filteredData[spaIndex].team_member.push(
              {
                agency_id: el.agency_id,
                name: el.agency_name,
                state_name: el.state_name,
                state_code: el.state_code,
                district_code: el.district_code,
                district_name: el.district_name,
                designation_name: el.designation_name,
                designation_id: el.designation_id,
                count: 1,
                id: el.bspc_id
              }
            );
          } else {
            filteredData[spaIndex].team_member.push(
              {
                agency_id: el.agency_id,
                name: el.agency_name,
                state_name: el.state_name,
                state_code: el.state_code,
                district_code: el.district_code,
                district_name: el.district_name,
                designation_name: el.designation_name,
                designation_id: el.designation_id,
                count: 1,
                id: el.bspc_id
              }
            );
          }
        }
      });
      filteredData.forEach((item, i) => {
        filteredData[i].count = item.team_member.length
      })
      let responseData = filteredData;
      return response(res, status.DATA_AVAILABLE, 200, responseData);
    } catch (error) {
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }
  static getTeamMonotoringTeamAllDataDirect = async (req, res) => {
    let returnResponse = {};
    try {
      let { search, } = req.body;
      let userId;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = req.body.loginedUserid.id;
      }
      let filters = await ConditionCreator.bspcNewFlowFilter(search);
      let isExits;
      if (search) {
        isExits = await db.directIndentModel.findAll({
          where: {
            ...filters,
            ...userId
          }
        });
      }
      if (isExits && isExits.length) {
        return response(res, 'Already Exits', 201, []);
      } else {
        return response(res, 'Not Exits', 200, []);
      }
    } catch (error) {
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }

  static checkTeamMonotoringIsExits = async (req, res) => {
    try {
      let { search } = req.body;
      let userId;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = { user_id: req.body.loginedUserid.id };
      }
      let filters = await ConditionCreator.bspcNewFlowFilter(search);
      let isExits;
      if (search && search.team_name) {
        isExits = await monitoringTeamOfBspc.findAll({
          where: {
            ...filters,
            ...userId
          }
        });
      }
      if (isExits && isExits.length) {
        return response(res, status.ALREADY_AVAILED, 201, isExits);
      } else {
        return response(res, status.ALREADY_AVAILED, 200, []);
      }
    } catch (error) {
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 500, []);
    }
  }
  static checkTeamMonotoringIsExitsDirect = async (req, res) => {
    try {
      let { search } = req.body;
      let userId;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = { user_id: req.body.loginedUserid.id };
      }
      let filters = await ConditionCreator.bspcNewFlowFilter(search);
      let isExits;
      if (search) {
        isExits = await monitoringTeamOfBspc.findAll({
          where: {
            ...filters,
            ...userId,
            // isDirect:true
          }
        });
      }
      console.log('isExits===', isExits);
      if (isExits && isExits.length) {
        return response(res, 'Already Exits', 201, isExits);
      } else {
        return response(res, 'Not Exits', 200, []);
      }
    } catch (error) {
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 500, []);
    }
  }

  static addTeamMonotoringTeamAllData = async (req, res) => {
    let returnResponse = {};
    try {
      let { crop_code, variety_code, name, year, season, user_id, member_array, id, form_type, plots, national_value_check } = req.body;
      let agencyId;
      if (req.body.loginedUserid) {
        agencyId = req.body.loginedUserid.agency_id
      }
      let condition = {
        include: [
          {
            model: stateModel,
            attributes: ['state_short_name', 'state_name']
          }, {
            model: db.userModel,
            attributes: ['id', 'code']
          }
        ],
        where: {
          id: agencyId
        },
        raw: true
      }

      let agencyDetails = await db.agencyDetailModel.findOne(condition)
      let teamName;
      let isDirectValue;
      if (form_type == 'direct') {
        if (!national_value_check) {
          isDirectValue = {
            isDirect: true
          }
        }
        // isDirectValue = {
        //   isDirect: true
        // }
        let userNameData = await monitoringTeamOfBspc.findOne({
          where: {
            crop_code: crop_code,
            year: year,
            season: season,
            user_id: user_id
          },
          attributes: ['name'],
          order: [['id', 'DESC']],
          raw: true
        });
        if (id) {
          teamName = name;
        } else {
          console.log('userNameData', userNameData);
          if (userNameData) {
            let originalString = userNameData && userNameData.name ? userNameData.name : ''
            const parts = originalString.split('-');
            let lastValue = parseInt(parts[parts.length - 1]);
            let generateTeamName = agencyDetails && agencyDetails['m_state.state_short_name'] + '-' + (agencyDetails['user.code'] ? agencyDetails['user.code'] : '0000') + '-' + ((lastValue ? lastValue : 0) + 1);
            teamName = generateTeamName ? generateTeamName : '';
            console.log('checkUserData===', teamName);
          } else {
            let generateTeamName = agencyDetails && agencyDetails['m_state.state_short_name'] + '-' + (agencyDetails['user.code'] ? agencyDetails['user.code'] : '0000') + '-' + 1;
            teamName = generateTeamName ? generateTeamName : '';
          }
          console.log('userNameData', userNameData);
        }
      } else {
        teamName = name;
      }
      let dataRow = {
        "crop_code": crop_code,
        "name": teamName,
        "year": year,
        "season": season,
        'variety_code': variety_code,
        "user_id": user_id,
        ...isDirectValue,
        "plots": plots
      }
      if (id) {
        // old code value ================ start ===== comment date (jan 17 2025)

        // let bspProformaOneData = await monitoringTeamOfBspc.update(dataRow, { where: { id: id } });
        // if (bspProformaOneData) {
        //   let poltsExits = await db.monitoringTeamOfBspcPlots.destroy({ where: { monitoring_team_of_id: id } })
        //   if (poltsExits) {
        //     if (plots && plots.length) {
        //       for (let key of plots) {
        //         db.monitoringTeamOfBspcPlots.create({
        //           monitoring_team_of_id: id,
        //           plots: key.plot
        //         })
        //       }
        //     }
        //   }
        // }
        // let bspDataArrayValue = []
        // if (member_array && member_array !== undefined && member_array.length > 0) {
        //   let isDeleted = monitoringTeamOfBspcMember.destroy({ where: { monitoring_team_of_bspc_id: id } });
        //   if (isDeleted) {
        //     member_array.forEach(async (bspcArray, i) => {
        //       let checkUser = await monitoringTeamOfBspcMember.findOne({
        //         order: [['user_name', 'DESC']],
        //         attributes: ['id', 'user_name'],
        //         raw: true
        //       });
        //       let userName = checkUser && checkUser.user_name ? parseInt(checkUser.user_name) : 1000
        //       let checkUserData = userName ? (userName) + 1 + i : "";

        //       const min = 1000; // Minimum 4-digit number
        //       const max = 9999; // Maximum 4-digit number
        //       const randomPassword = Math.floor(Math.random() * (max - min + 1)) + min;
        //       // return randomPassword.toString(); // Convert to string if needed
        //       if (parseInt(bspcArray.is_team_lead) === 1) {
        //         //let textMsg = "Hi [" + bspcArray.name + "],As [" + name + "] Team representative, use SATHI Inspection App to report plot inspections in real-time. Download the app from [AppLink]. To access your account, login with UserID: [" + bspcArray.user_name + "] and Password: [" + randomPassword + "]"

        //         // let textMsg = "Hi User, Please use SATHI Inspection App " + process.env.APP_LINK + " UserID: " + (bspcArray && bspcArray.user_name ? bspcArray.user_name : (checkUserData ? checkUserData : '')) + " & Password: " + randomPassword + " Thanks SATHI-Krishi"
        //         let textMsg = "Hi User, Please use SATHI Inspection App " + process.env.APP_LINK + " UserID: " + (bspcArray && bspcArray.user_name ? bspcArray.user_name : (checkUserData ? checkUserData : '')) + " & Password: " + randomPassword + " Thanks SATHI-Krishi"

        //         console.log("textMsg", textMsg)
        //         console.log("bspcArray.mobile_number", bspcArray.mobile_number)
        //         let smsData = {
        //           "mnumber": textMsg ? textMsg : '',
        //           "Mobileno": bspcArray && bspcArray.mobile_number ? bspcArray.mobile_number : '',
        //           "dlt_template_id": "1707170774214694631"
        //         }
        //         sendSms(smsData)
        //       }
        //       bspDataArrayValue = monitoringTeamOfBspcMember.build({
        //         monitoring_team_of_bspc_id: id,
        //         type_of_agency: bspcArray && bspcArray.agency && bspcArray.agency.id ? bspcArray.agency.id : "",
        //         // user_name: bspcArray && bspcArray.user_name ? bspcArray.user_name : (checkUserData ? checkUserData : ''),
        //         user_name: bspcArray && bspcArray.user_name ? bspcArray.user_name : (checkUserData ? checkUserData : ''),
        //         state_code: bspcArray && bspcArray.state_code && bspcArray.state_code.state_code ? bspcArray.state_code.state_code : "",
        //         pin_code: bspcArray && bspcArray.pin_code ? bspcArray.pin_code : (randomPassword ? randomPassword : ""),
        //         otp: bspcArray && bspcArray.otp ? bspcArray.otp : "",
        //         name: bspcArray && bspcArray.name ? bspcArray.name : "",
        //         mobile_number: bspcArray && bspcArray.mobile_number ? bspcArray.mobile_number : "",
        //         is_team_lead: bspcArray && bspcArray.is_team_lead ? bspcArray.is_team_lead : 0,
        //         email_id: bspcArray && bspcArray.email_id ? bspcArray.email_id : "",
        //         district_code: bspcArray && bspcArray.district_code && bspcArray.district_code.district_code ? bspcArray.district_code.district_code : null,
        //         designation_id: bspcArray && bspcArray.designation && bspcArray.designation.id ? bspcArray.designation.id : "",
        //         address: bspcArray && bspcArray.address ? bspcArray.address : ""
        //       });
        //       bspDataArrayValue.save();

        //     });
        //     if (bspProformaOneData) {
        //       let updatedValue = await monitoringTeamOfBspc.findOne({ raw: true, where: { id: id } });
        //       return response(res, status.DATA_UPDATED, 200, updatedValue);
        //     } else {
        //       return response(res, "Data Not Updated", 201, []);
        //     }
        //   }
        // } else {
        //   return response(res, "bspc is required", 201, [])
        // }
        // old code value ================ Finsh ===== comment date (jan 17 2025)

        // new code value =====================(jan 22 2025)
        const updateBspProforma = async () => {
          // Update monitoringTeamOfBspc
          let bspProformaOneData = await monitoringTeamOfBspc.update(dataRow, { where: { id } });

          if (!bspProformaOneData) {
            return response(res, "Data Not Updated", 201, []);
          }

          // Remove existing plots and add new ones
          await db.monitoringTeamOfBspcPlots.destroy({ where: { monitoring_team_of_id: id } });
          if (plots?.length) {
            const plotPromises = plots.map(key =>
              db.monitoringTeamOfBspcPlots.create({
                monitoring_team_of_id: id,
                plots: key.plot
              })
            );
            await Promise.all(plotPromises);
          }

          // Handle BSPC members
          if (!member_array?.length) {
            return response(res, "bspc is required", 201, []);
          }

          // Delete existing members
          await monitoringTeamOfBspcMember.destroy({ where: { monitoring_team_of_bspc_id: id } });

          // Handle creation of new members
          const memberPromises = member_array.map(async (bspcArray, i) => {
            // Get the last user_id and increment
            let checkUser = await monitoringTeamOfBspcMember.findOne({
              order: [['user_name', 'DESC']],
              attributes: ['id', 'user_name'],
              raw: true
            });
            let userName = checkUser?.user_name ? parseInt(checkUser.user_name) : 1000;
            let checkUserData = userName ? userName + 1 + i : "";

            // Generate random password
            const randomPassword = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;

            // Send SMS if team lead
            if (parseInt(bspcArray.is_team_lead) === 1) {
              let textMsg = `Hi User, Please use SATHI Inspection App ${process.env.APP_LINK} UserID: ${bspcArray?.user_name || checkUserData} & Password: ${randomPassword} Thanks SATHI-Krishi`;
              let smsData = {
                mnumber: textMsg,
                Mobileno: bspcArray?.mobile_number || '',
                dlt_template_id: "1707170774214694631"
              };
              sendSms(smsData);
            }

            // Build and save the new member
            let bspDataArrayValue = monitoringTeamOfBspcMember.build({
              monitoring_team_of_bspc_id: id,
              type_of_agency: bspcArray?.agency?.id || "",
              user_name: bspcArray?.user_name || checkUserData,
              state_code: bspcArray?.state_code?.state_code || "",
              pin_code: bspcArray?.pin_code || randomPassword,
              otp: bspcArray?.otp || "",
              name: bspcArray?.name || "",
              mobile_number: bspcArray?.mobile_number || "",
              is_team_lead: bspcArray?.is_team_lead || 0,
              email_id: bspcArray?.email_id || "",
              district_code: bspcArray?.district_code?.district_code || null,
              designation_id: bspcArray?.designation?.id || "",
              address: bspcArray?.address || ""
            });
            await bspDataArrayValue.save();
          });

          // Wait for all member creation promises to finish
          await Promise.all(memberPromises);

          // Fetch the updated BSP data
          let updatedValue = await monitoringTeamOfBspc.findOne({ raw: true, where: { id } });

          return response(res, status.DATA_UPDATED, 200, updatedValue);
        };

        updateBspProforma().catch(err => {
          console.error(err);
          return response(res, "An error occurred", 500, []);
        });

      } else {
        console.log('teamName===', teamName);
        let isExits = await monitoringTeamOfBspc.findAll({ where: { year: year, season: season, crop_code: crop_code, user_id: user_id, name: teamName ? teamName : '' } });
        console.log("isExits", isExits);
        if (isExits && isExits.length) {
          return response(res, "Data Already Exist", 201, []);
        } else {
          // old code value ================ start ===== comment date (jan 17 2025)

          // let monitoringTeamOfBspcData = await monitoringTeamOfBspc.create(dataRow);
          // if (monitoringTeamOfBspcData) {
          //   let bspDataArrayValue = [];
          //   if (member_array && member_array !== undefined && member_array.length > 0) {
          //     // if(willing_to_produce)
          //     member_array.forEach(async (bspcArray, i) => {
          //       let checkUser = await monitoringTeamOfBspcMember.findOne({
          //         order: [['user_name', 'DESC']],
          //         attributes: ['id', 'user_name'],
          //         raw: true
          //       });
          //       let checkUserData;
          //       let userName = checkUser && checkUser.user_name ? parseInt(checkUser.user_name) : 1000
          //       checkUserData = userName ? (userName) + 1 + i : "";
          //       const min = 1000; // Minimum 4-digit number
          //       const max = 9999; // Maximum 4-digit number
          //       const randomPassword = Math.floor(Math.random() * (max - min + 1)) + min;
          //       // return randomPassword.toString(); // Convert to string if needed
          //       if (parseInt(bspcArray.is_team_lead) === 1) {
          //         //let textMsg = "Hi [" + bspcArray.name + "],As [" + name + "] Team representative, use SATHI Inspection App to report plot inspections in real-time. Download the app from [AppLink]. To access your account, login with UserID: [" + bspcArray.user_name + "] and Password: [" + randomPassword + "]"

          //         let textMsg = "Hi User, Please use SATHI Inspection App " + process.env.APP_LINK + " UserID: " + (checkUserData ? checkUserData : '1001') + " & Password: " + randomPassword + " Thanks SATHI-Krishi"
          //         console.log("textMsg", textMsg)
          //         console.log("bspcArray.mobile_number", bspcArray.mobile_number)
          //         let smsData = {
          //           "message": textMsg ? textMsg : '',
          //           "mnumber": bspcArray && bspcArray.mobile_number ? bspcArray.mobile_number : '',
          //           "dlt_template_id": "1707170774214694631"

          //         }
          //         sendSms(smsData)
          //       }
          //       bspDataArrayValue = monitoringTeamOfBspcMember.build({
          //         monitoring_team_of_bspc_id: monitoringTeamOfBspcData.dataValues.id,
          //         type_of_agency: bspcArray && bspcArray.agency && bspcArray.agency.id ? bspcArray.agency.id : "",
          //         user_name: checkUserData ? checkUserData : '1001',
          //         state_code: bspcArray && bspcArray.state_code && bspcArray.state_code.state_code ? bspcArray.state_code.state_code : "",
          //         pin_code: randomPassword ? randomPassword : "",
          //         otp: bspcArray && bspcArray.otp ? bspcArray.otp : "",
          //         name: bspcArray && bspcArray.name ? bspcArray.name : "",
          //         mobile_number: bspcArray && bspcArray.mobile_number ? bspcArray.mobile_number : "",
          //         is_team_lead: bspcArray && bspcArray.is_team_lead ? bspcArray.is_team_lead : 0,
          //         email_id: bspcArray && bspcArray.email_id ? bspcArray.email_id : "",
          //         district_code: bspcArray && bspcArray.district_code && bspcArray.district_code.district_code ? bspcArray.district_code.district_code : null, designation_id: bspcArray && bspcArray.designation_id ? bspcArray.designation_id : "",
          //         address: bspcArray && bspcArray.address ? bspcArray.address : "",
          //         designation_id: bspcArray && bspcArray.designation && bspcArray.designation.id ? bspcArray.designation.id : "",
          //       })
          //       // console.log(isDirectValue);
          //       bspDataArrayValue.save();
          //     });
          //     // if (bspDataArrayValue) {
          //     if (bspDataArrayValue) {
          //       if (plots && plots.length) {
          //         for (let key of plots) {
          //           db.monitoringTeamOfBspcPlots.create({
          //             monitoring_team_of_id: monitoringTeamOfBspcData.dataValues.id,
          //             plots: key.plot
          //           })
          //         }
          //       }
          //       // }
          //       return response(res, status.DATA_SAVE, 200, dataRow);
          //     } else {
          //       return response(res, status.DATA_NOT_SAVE, 200, dataRow);
          //     }
          //   } else {
          //     return response(res, "bspc is required", 201, [])
          //   }
          // }
          // old code value ================ Finsh ===== comment date (jan 17 2025)


          // new code value =====================(jan 17 2025)
          let monitoringTeamOfBspcData;
          try {
            monitoringTeamOfBspcData = await monitoringTeamOfBspc.create(dataRow);
            if (monitoringTeamOfBspcData) {
              if (!member_array || member_array.length === 0) {
                return response(res, "bspc is required", 201, []);
              }

              const bspDataArrayValuePromises = member_array.map(async (bspcArray, i) => {
                let checkUser = await monitoringTeamOfBspcMember.findOne({
                  order: [['user_name', 'DESC']],
                  attributes: ['user_name'],
                  raw: true
                });

                let checkUserData = checkUser ? parseInt(checkUser.user_name) + 1 + i : 1001;
                const randomPassword = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;

                if (parseInt(bspcArray.is_team_lead) === 1) {
                  const textMsg = `Hi User, Please use SATHI Inspection App ${process.env.APP_LINK} UserID: ${checkUserData} & Password: ${randomPassword} Thanks SATHI-Krishi`;
                  // console.log("textMsg:", textMsg);
                  // console.log("bspcArray.mobile_number:", bspcArray.mobile_number);

                  const smsData = {
                    message: textMsg,
                    mnumber: bspcArray.mobile_number || '',
                    dlt_template_id: "1707170774214694631"
                  };

                  sendSms(smsData); // Send SMS asynchronously
                }

                const bspcMemberData = monitoringTeamOfBspcMember.build({
                  monitoring_team_of_bspc_id: monitoringTeamOfBspcData.id,
                  type_of_agency: bspcArray?.agency?.id || "",
                  user_name: checkUserData,
                  state_code: bspcArray?.state_code?.state_code || "",
                  pin_code: randomPassword,
                  otp: bspcArray.otp || "",
                  name: bspcArray.name || "",
                  mobile_number: bspcArray.mobile_number || "",
                  is_team_lead: bspcArray.is_team_lead || 0,
                  email_id: bspcArray.email_id || "",
                  district_code: bspcArray?.district_code?.district_code || null,
                  designation_id: bspcArray?.designation?.id || "",
                  address: bspcArray.address || ""
                });

                await bspcMemberData.save(); // Save each bspcMemberData asynchronously
              });

              // Wait for all members to be processed
              await Promise.all(bspDataArrayValuePromises);

              // Handle plots after processing members
              if (plots && plots.length > 0) {
                const plotPromises = plots.map(plot =>
                  db.monitoringTeamOfBspcPlots.create({
                    monitoring_team_of_id: monitoringTeamOfBspcData.id,
                    plots: plot.plot
                  })
                );
                await Promise.all(plotPromises); // Save all plots asynchronously
              }
              return response(res, status.DATA_SAVE, 200, dataRow);
            } else {
              return response(res, status.DATA_NOT_SAVE, 200, dataRow);
            }
          } catch (error) {
            console.error("Error in adding team monitoring data:", error);
            return response(res, "Error in saving data", 500, []);
          }
        }
      }
    } catch (error) {
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }
  static deleteTeamMonotoringTeamAllData = async (req, res) => {
    try {
      let { id } = req.body;
      if (id) {
        let dataDelete = await monitoringTeamOfBspc.destroy({ where: { id: id } });
        if (dataDelete) {
          let dataDelete = await monitoringTeamOfBspcMember.destroy({ where: { monitoring_team_of_bspc_id: id } });
          let dataDeleted = await db.monitoringTeamOfBspcPlots.destroy({ where: { monitoring_team_of_id: id } });
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

  static getTeamMonotoringTeamYearData = async (req, res) => {
    let returnResponse = {};
    try {
      let { search } = req.body;
      let userId;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = req.body.loginedUserid.id;
      }
      let filter = await ConditionCreator.bspcNewFlowFilter(search);
      let condition = {
        include: [
          {
            required: true,
            model: monitoringTeamAssignedToBspcsModel,
            attributes: [],
            where: {
              bspc_id: userId
            }
          }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('monitoring_team_of_pdpcs.year')), 'year']
        ],

        where: {
          ...filter,
          // willing_to_produce: 1,
          // is_final_submitted: 1
        },
        raw: true,
        order: [[sequelize.col('monitoring_team_of_pdpcs.year'), 'DESC']]
      }

      let condition2 = {
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('indent_of_breederseed_direct.year')), 'year']
        ],
        where: {
          user_id: userId
        },
        raw: true,
        order: [[sequelize.col('indent_of_breederseed_direct.year'), 'DESC']]
      }

      let getBspOneYearsFirst = await monitoringTeamPdpc.findAll(condition);
      let getBspOneYearsSecond = await db.directIndentModel.findAll(condition2);
      let getBspOneYearThird = await db.bspPerformaBspOne.findAll(
        {
          attributes: [
            [sequelize.fn('DISTINCT', sequelize.col('bsp_proforma_1s.year')), 'year'],
          ],
          include: [
            {
              model: db.bspProformaOneBspc,
              attributes: [],
              where: {
                bspc_id: req.body.loginedUserid.id
              }
            }
          ],
          where: {
            // user_id: userId,
            ...filter,
            production_type: "REALLOCATION"
          },
          raw: true
        }
      );
      // const mergedArray = getBspOneYearsFirst.concat(getBspOneYearsSecond);
      const mergedArray = union.unionBy(getBspOneYearsFirst, getBspOneYearsSecond, getBspOneYearThird, 'year');

      // Create a Set to remove duplicates based on the year property
      const uniqueArray = Array.from(new Set(mergedArray.map(item => item.year)));
      // Sort the unique array in descending order based on the year property
      const sortedArray = uniqueArray.sort((a, b) => b - a);
      // Resulting array with unique values in descending order
      const result = sortedArray.map(year => ({ year }));
      console.log('mergedArray===', result);

      console.log(result);
      return response(res, status.DATA_AVAILABLE, 200, result);
    } catch (error) {
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }
  static getTeamMonotoringTeamSeasonData = async (req, res) => {
    let returnResponse = {};
    try {
      let { search } = req.body;
      let userId;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = req.body.loginedUserid.id;
      }
      let filter = await ConditionCreator.bspcNewFlowFilter(search);
      let condition = {
        include: [
          {
            model: seasonModel,
            attributes: []
          },
          {
            required: true,
            // required: false,
            model: monitoringTeamAssignedToBspcsModel,
            attributes: [],
            where: {
              bspc_id: userId
            }
          }

        ],
        raw: true,
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('m_season.season_code')), 'season_code'],
          [sequelize.col('m_season.season'), 'season_name'],
        ],
        where: {
          ...filter,
          // willing_to_produce: 1,
          // is_final_submitted: 1
        },
        order: [[sequelize.col('m_season.season_code'), 'ASC']]
      }
      let condition2 = {
        include: [
          {
            model: seasonModel,
            attributes: []
          },
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('m_season.season_code')), 'season_code'],
          [sequelize.col('m_season.season'), 'season_name'],
        ],
        where: {
          user_id: userId,
          ...filter,
        },
        raw: true,
        order: [[sequelize.col('m_season.season_code'), 'ASC']]
      }

      let getBspOneSeasonFirst = await monitoringTeamPdpc.findAll(condition);
      let getBspOneSeasonSecond = await db.directIndentModel.findAll(condition2);
      let getBspOneSeasonThird = await db.bspPerformaBspOne.findAll(
        {
          include: [
            {
              model: db.bspProformaOneBspc,
              attributes: [],
              where: {
                bspc_id: req.body.loginedUserid.id
              }
            },
            {
              model: seasonModel,
              attributes: []
            },
          ],
          attributes: [
            [sequelize.fn('DISTINCT', sequelize.col('bsp_proforma_1s.season')), 'season_code'],
            [sequelize.col('m_season.season'), 'season_name'],
          ],

          where: {
            // user_id: userId,
            ...filter,
            production_type: "REALLOCATION"
          },
          raw: true
        }
      );
      console.log('getBspOneSeasonThird===', getBspOneSeasonThird);
      const mergedArray = union.unionBy(getBspOneSeasonFirst, getBspOneSeasonSecond, getBspOneSeasonThird, 'season_name');
      console.log(mergedArray);
      return response(res, status.DATA_AVAILABLE, 200, mergedArray);
    } catch (error) {
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }
  static getTeamMonotoringTeamCroplData = async (req, res) => {
    let returnResponse = {};
    try {
      let { search } = req.body;
      let userId;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = req.body.loginedUserid.id;
      }
      let filter = await ConditionCreator.bspcNewFlowFilter(search);
      let condition = {
        include: [
          {
            model: cropModel,
            attributes: []
          },
          {
            required: true,
            // required: false,
            model: monitoringTeamAssignedToBspcsModel,
            attributes: [],
            where: {
              bspc_id: userId
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
          // is_final_submitted: 1
        },
        order: [[sequelize.col('m_crop.crop_name'), 'ASC']]
      }
      let condition2 = {
        include: [
          {
            model: cropModel,
            attributes: []
          },
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('m_crop.crop_code')), 'crop_code'],
          [sequelize.col('m_crop.crop_name'), 'crop_name'],
        ],
        where: {
          user_id: userId,
          ...filter,
        },
        raw: true,
        order: [[sequelize.col('m_crop.crop_name'), 'ASC']]
      }
      let getBspOneCropFirst = await monitoringTeamPdpc.findAll(condition);
      let getBspOneCropSecond = await db.directIndentModel.findAll(condition2);
      let getBspOneCropThird = await db.bspPerformaBspOne.findAll(
        {
          include: [
            {
              model: db.bspProformaOneBspc,
              attributes: [],
              where: {
                bspc_id: req.body.loginedUserid.id
              }
            },
            {
              model: cropModel,
              attributes: []
            },
          ],
          attributes: [
            [sequelize.fn('DISTINCT', sequelize.col('bsp_proforma_1s.crop_code')), 'crop_code'],
            [sequelize.col('m_crop.crop_name'), 'crop_name'],
          ],
          where: {
            // user_id: userId,
            ...filter,
            production_type: "REALLOCATION"
          },
          raw: true
        }
      );
      // 

      const mergedArray = union.unionBy(getBspOneCropFirst, getBspOneCropSecond, getBspOneCropThird, 'crop_name');
      return response(res, status.DATA_AVAILABLE, 200, mergedArray);
      // return response(res, status.DATA_AVAILABLE, 200, getBspOneYears);
    } catch (error) {
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }
  static getTeamMonotoringTeamListData = async (req, res) => {
    let returnResponse = {};
    try {
      let { search } = req.body;
      let userId;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = { user_id: req.body.loginedUserid.id }
      }
      let filters = await ConditionCreator.bspcNewFlowFilter(search);
      let condition = {
        include: [
          {
            // required: true,
            model: monitoringTeamOfBspcMember,
            attributes: [],
            include: [
              {
                model: stateModel,
                attributes: [],
              },
              {
                model: agencytypeModel,
                attributes: [],
              },
              {
                model: districtModel,
                attributes: [],
              },
              {
                model: designationModel,
                attributes: [],
              }
            ]
          },
          {
            // required:true,
            model: db.monitoringTeamOfBspcPlots,
            attributes: [],
            // where:{

            // },
            // // group:[
            // //   [sequelize.col('monitoring_team_of_bspc.year')]
            // // ]
          },
          {
            required: false,
            model: db.bspPerformaBspTwo,
            attributes: [],
            where: {
              year: [sequelize.col('monitoring_team_of_bspc.year')],
              season: [sequelize.col('monitoring_team_of_bspc.season')],
              crop_code: [sequelize.col('monitoring_team_of_bspc.crop_code')],
              // user_id:[sequelize.col('monitoring_team_of_bspc_member.monitoring_team_of_bspc_id')],
              field_code: [sequelize.col('monitoring_team_of_bspc_plot.plots')]
              // production_type:"REALLOCATION"
            }
          },

        ],
        attributes: [

          [sequelize.col('monitoring_team_of_bspc.id'), 'id'],
          // [sequelize.fn("DISTINCT", sequelize.col('monitoring_team_of_bspc.name')), 'team_name'],
          [sequelize.col('monitoring_team_of_bspc.name'), 'team_name'],
          [sequelize.col('monitoring_team_of_bspc.year'), 'year'],
          [sequelize.col('monitoring_team_of_bspc.plots'), 'plots'],
          [sequelize.col('monitoring_team_of_bspc.season'), 'season'],
          [sequelize.col('monitoring_team_of_bspc.crop_code'), 'crop_code'],
          [sequelize.col('monitoring_team_of_bspc_member.monitoring_team_of_bspc_id'), 'bspc_id'],
          [sequelize.col('monitoring_team_of_bspc_member.id'), 'member_id'],
          [sequelize.col('monitoring_team_of_bspc_member.name'), 'agency_name'],
          [sequelize.col('monitoring_team_of_bspc_member.mobile_number'), 'mobile_number'],
          [sequelize.col('monitoring_team_of_bspc_member.email_id'), 'email_id'],
          [sequelize.col('monitoring_team_of_bspc_member.address'), 'address'],
          [sequelize.col('monitoring_team_of_bspc_member.pin_code'), 'pin_code'],
          [sequelize.col('monitoring_team_of_bspc_member.otp'), 'otp'],
          [sequelize.col('monitoring_team_of_bspc_member.user_name'), 'user_name'],
          [sequelize.col('monitoring_team_of_bspc_member.is_team_lead'), 'is_team_lead'],
          [sequelize.col('monitoring_team_of_bspc_member->agency_type.id'), 'agency_id'],
          [sequelize.col('monitoring_team_of_bspc_member->agency_type.id'), 'agency_type_id'],
          [sequelize.col('monitoring_team_of_bspc_member->agency_type.name'), 'agency_type'],
          [sequelize.col('monitoring_team_of_bspc_member->m_designation.id'), 'designation_id'],
          [sequelize.col('monitoring_team_of_bspc_member->m_designation.name'), 'designation_name'],
          [sequelize.col('monitoring_team_of_bspc_member->m_district.district_code'), 'district_code'],
          [sequelize.col('monitoring_team_of_bspc_member->m_district.district_name'), 'district_name'],
          [sequelize.col('monitoring_team_of_bspc_member->m_state.state_code'), 'state_code'],
          [sequelize.col('monitoring_team_of_bspc_member->m_state.state_name'), 'state_name'],
          [sequelize.col('bsp_proforma_2.is_inspected'), 'is_inspected'],
        ],
        raw: true,

        where: {
          [Op.and]: [{ ...filters },
          {
            isDirect: {
              [Op.not]: true
            },
          }
            , { ...userId }]


        }
      };
      let teamAllDataList = await monitoringTeamOfBspc.findAll(condition);
      const filteredData = [];
      teamAllDataList.forEach(el => {
        const spaIndex = filteredData.findIndex(item => item.id === el.id);
        if (spaIndex === -1) {
          filteredData.push({
            name: el && el.team_name ? el.team_name : '',
            crop: el && el.crop_code ? el.crop_code : '',
            season: el && el.season ? el.season : '',
            // user_id: el && el.user_id ? el.user_id : '',
            // state_id: el && el.state_id ? el.state_id : '',
            id: el && el.id ? el.id : '',
            year: el && el.year ? el.year : '',
            plots: el && el.plots ? el.plots : '',
            count: 0,
            is_inspected: el && el.is_inspected ? el.is_inspected : false,
            team_member: [
              {
                is_team_lead: el && el.is_team_lead ? el.is_team_lead : '',
                member_id: el && el.member_id ? el.member_id : '',
                pin_code: el && el.pin_code ? el.pin_code : '',
                otp: el && el.otp ? el.otp : '',
                user_name: el && el.user_name ? el.user_name : '',
                mobile_number: el && el.mobile_number ? el.mobile_number : '',
                email_id: el && el.email_id ? el.email_id : '',
                address: el && el.address ? el.address : '',
                state_code: el && el.state_code ? el.state_code : '',
                district_name: el && el.district_name ? el.district_name : '',
                desination_id: el && el.designation_id ? el.designation_id : '',
                designation_name: el && el.designation_name ? el.designation_name : '',
                agency_name: el && el.agency_name ? el.agency_name : '',
                state_name: el && el.state_name ? el.state_name : '',
                agency_type_id: el && el.agency_type_id ? el.agency_type_id : '',
                agency_type: el && el.agency_type ? el.agency_type : '',
                district_code: el && el.district_code ? el.district_code : '',
              }
            ]
          });
        } else {
          const cropIndex = filteredData[spaIndex].team_member.findIndex(item => item.member_id == el.member_id);
          console.log('cropIndex=====', cropIndex);
          // console.log('item.member_id',filteredData[spaIndex].team_member);
          console.log('el.member_id', el.member_id);
          if (cropIndex === -1) {
            filteredData[spaIndex].team_member.push(
              {
                member_id: el && el.member_id ? el.member_id : '',
                is_team_lead: el && el.is_team_lead ? el.is_team_lead : 0,
                pin_code: el && el.pin_code ? el.pin_code : '',
                otp: el && el.otp ? el.otp : '',
                user_name: el && el.user_name ? el.user_name : '',
                mobile_number: el && el.mobile_number ? el.mobile_number : '',
                email_id: el && el.email_id ? el.email_id : '',
                address: el && el.address ? el.address : '',
                state_code: el && el.state_code ? el.state_code : '',
                desination_id: el && el.designation_id ? el.designation_id : '',
                designation_name: el && el.designation_name ? el.designation_name : '',
                state_name: el && el.state_name ? el.state_name : '',
                agency_name: el && el.agency_name ? el.agency_name : '',
                agency_id: el && el.member_id ? el.member_id : '',
                agency_type: el && el.agency_type ? el.agency_type : '',
                agency_type_id: el && el.agency_type_id ? el.agency_type_id : '',
                district_code: el && el.district_code ? el.district_code : '',
                district_name: el && el.district_name ? el.district_name : '',
              }
            )
          } else {
            // filteredData[spaIndex].team_member.push(
            //   {
            //     is_team_lead: el && el.is_team_lead ? el.is_team_lead : 0,
            //     pin_code: el && el.pin_code ? el.pin_code : '',
            //     otp: el && el.otp ? el.otp : '',
            //     user_name: el && el.user_name ? el.user_name : '',
            //     mobile_number: el && el.mobile_number ? el.mobile_number : '',
            //     email_id: el && el.email_id ? el.email_id : '',
            //     address: el && el.address ? el.address : '',
            //     state_code: el && el.state_code ? el.state_code : '',
            //     desination_id: el && el.designation_id ? el.designation_id : '',
            //     designation_name: el && el.designation_name ? el.designation_name : '',
            //     state_name: el && el.state_name ? el.state_name : '',
            //     agency_name: el && el.agency_name ? el.agency_name : '',
            //     agency_id: el && el.member_id ? el.member_id : '',
            //     agency_type: el && el.agency_type ? el.agency_type : '',
            //     agency_type_id: el && el.agency_type_id ? el.agency_type_id : '',
            //     district_code: el && el.district_code ? el.district_code : '',
            //     district_name: el && el.district_name ? el.district_name : '',
            //   }
            // )
          }


        }
      });
      filteredData.forEach((item, i) => {
        filteredData[i].count = item.team_member.length
      });
      let responseData = filteredData;
      return response(res, status.DATA_AVAILABLE, 200, responseData);
    } catch (error) {
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }
  static getTeamMonotoringTeamListDirectData = async (req, res) => {
    let returnResponse = {};
    try {
      let { search } = req.body;
      let userId;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = { user_id: req.body.loginedUserid.id }
      }
      let filters = await ConditionCreator.bspcNewFlowFilter(search);
      let condition = {
        include: [
          {
            // required: true,
            model: monitoringTeamOfBspcMember,
            attributes: [],
            include: [
              {
                model: stateModel,
                attributes: [],
              },
              {
                model: agencytypeModel,
                attributes: [],
              },
              {
                model: districtModel,
                attributes: [],
              },
              {
                model: designationModel,
                attributes: [],
              },

            ],
          },
          {
            required: false,
            model: db.bspPerformaBspTwo,
            attributes: [],
            where: {
              year: [sequelize.col('monitoring_team_of_bspc.year')],
              season: [sequelize.col('monitoring_team_of_bspc.season')],
              crop_code: [sequelize.col('monitoring_team_of_bspc.crop_code')],
              // user_id:[sequelize.col('monitoring_team_of_bspc_member.monitoring_team_of_bspc_id')],
              // field_code: [sequelize.col('monitoring_team_of_bspc.plots')]
              // production_type:"REALLOCATION"
              [Op.and]: sequelize.where(
                sequelize.cast(sequelize.col('monitoring_team_of_bspc.plots'), 'text'),
                { [Op.eq]: sequelize.col('bsp_proforma_2.field_code') }
              )
            }
          },
        ],
        attributes: [

          [sequelize.col('monitoring_team_of_bspc.id'), 'id'],
          // [sequelize.fn("DISTINCT", sequelize.col('monitoring_team_of_bspc.name')), 'team_name'],
          [sequelize.col('monitoring_team_of_bspc.name'), 'team_name'],
          [sequelize.col('monitoring_team_of_bspc.year'), 'year'],
          [sequelize.col('monitoring_team_of_bspc.season'), 'season'],
          [sequelize.col('monitoring_team_of_bspc.plots'), 'plots'],
          [sequelize.col('monitoring_team_of_bspc.crop_code'), 'crop_code'],
          [sequelize.col('monitoring_team_of_bspc_member.monitoring_team_of_bspc_id'), 'bspc_id'],
          [sequelize.col('monitoring_team_of_bspc_member.id'), 'member_id'],
          [sequelize.col('monitoring_team_of_bspc_member.name'), 'agency_name'],
          [sequelize.col('monitoring_team_of_bspc_member.mobile_number'), 'mobile_number'],
          [sequelize.col('monitoring_team_of_bspc_member.email_id'), 'email_id'],
          [sequelize.col('monitoring_team_of_bspc_member.address'), 'address'],
          [sequelize.col('monitoring_team_of_bspc_member.pin_code'), 'pin_code'],
          [sequelize.col('monitoring_team_of_bspc_member.otp'), 'otp'],
          [sequelize.col('monitoring_team_of_bspc_member.user_name'), 'user_name'],
          [sequelize.col('monitoring_team_of_bspc_member.is_team_lead'), 'is_team_lead'],
          [sequelize.col('monitoring_team_of_bspc_member->agency_type.id'), 'agency_id'],
          [sequelize.col('monitoring_team_of_bspc_member->agency_type.id'), 'agency_type_id'],
          [sequelize.col('monitoring_team_of_bspc_member->agency_type.name'), 'agency_type'],
          [sequelize.col('monitoring_team_of_bspc_member->m_designation.id'), 'designation_id'],
          [sequelize.col('monitoring_team_of_bspc_member->m_designation.name'), 'designation_name'],
          [sequelize.col('monitoring_team_of_bspc_member->m_district.district_code'), 'district_code'],
          [sequelize.col('monitoring_team_of_bspc_member->m_district.district_name'), 'district_name'],
          [sequelize.col('monitoring_team_of_bspc_member->m_state.state_code'), 'state_code'],
          [sequelize.col('monitoring_team_of_bspc_member->m_state.state_name'), 'state_name'],
          [sequelize.col('bsp_proforma_2.is_inspected'), 'is_inspected'],
        ],
        raw: true,

        where: {
          ...filters,
          ...userId,
          isDirect: true
        }
      };
      let teamAllDataList = await monitoringTeamOfBspc.findAll(condition);
      const filteredData = [];
      teamAllDataList.forEach(el => {
        const spaIndex = filteredData.findIndex(item => item.id === el.id);
        if (spaIndex === -1) {
          filteredData.push({
            name: el && el.team_name ? el.team_name : '',
            crop: el && el.crop_code ? el.crop_code : '',
            season: el && el.season ? el.season : '',
            // user_id: el && el.user_id ? el.user_id : '',
            // state_id: el && el.state_id ? el.state_id : '',
            id: el && el.id ? el.id : '',
            plots: el && el.plots ? el.plots : '',
            year: el && el.year ? el.year : '',
            count: 0,
            is_inspected: el && el.is_inspected ? el.is_inspected : false,
            team_member: [
              {
                is_team_lead: el && el.is_team_lead ? el.is_team_lead : '',
                pin_code: el && el.pin_code ? el.pin_code : '',
                otp: el && el.otp ? el.otp : '',
                user_name: el && el.user_name ? el.user_name : '',
                mobile_number: el && el.mobile_number ? el.mobile_number : '',
                email_id: el && el.email_id ? el.email_id : '',
                address: el && el.address ? el.address : '',
                state_code: el && el.state_code ? el.state_code : '',
                district_name: el && el.district_name ? el.district_name : '',
                desination_id: el && el.designation_id ? el.designation_id : '',
                designation_name: el && el.designation_name ? el.designation_name : '',
                agency_name: el && el.agency_name ? el.agency_name : '',
                state_name: el && el.state_name ? el.state_name : '',
                agency_type_id: el && el.agency_type_id ? el.agency_type_id : '',
                agency_type: el && el.agency_type ? el.agency_type : '',
                district_code: el && el.district_code ? el.district_code : '',
              }
            ]
          });
        } else {
          const cropIndex = filteredData[spaIndex].team_member.findIndex(item => item.member_id === el.member_id);
          filteredData[spaIndex].team_member.push(
            {
              is_team_lead: el && el.is_team_lead ? el.is_team_lead : 0,
              pin_code: el && el.pin_code ? el.pin_code : '',
              otp: el && el.otp ? el.otp : '',
              user_name: el && el.user_name ? el.user_name : '',
              mobile_number: el && el.mobile_number ? el.mobile_number : '',
              email_id: el && el.email_id ? el.email_id : '',
              address: el && el.address ? el.address : '',
              state_code: el && el.state_code ? el.state_code : '',
              desination_id: el && el.designation_id ? el.designation_id : '',
              designation_name: el && el.designation_name ? el.designation_name : '',
              state_name: el && el.state_name ? el.state_name : '',
              agency_name: el && el.agency_name ? el.agency_name : '',
              agency_id: el && el.member_id ? el.member_id : '',
              agency_type: el && el.agency_type ? el.agency_type : '',
              agency_type_id: el && el.agency_type_id ? el.agency_type_id : '',
              district_code: el && el.district_code ? el.district_code : '',
              district_name: el && el.district_name ? el.district_name : '',
            }
          )

        }
      });
      filteredData.forEach((item, i) => {
        filteredData[i].count = item.team_member.length
      });
      let responseData = filteredData;
      return response(res, status.DATA_AVAILABLE, 200, responseData);
    } catch (error) {
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }

  static checkTeamMonotoringTeamUserData = async (req, res) => {
    try {
      let checkUser = await monitoringTeamOfBspcMember.findOne({
        order: [['user_name', 'DESC']],
        attributes: ['id', 'user_name']
      });
      return response(res, status.DATA_AVAILABLE, 200, checkUser);
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 500, []);
    }
  }

  static checkAutoSelect = async (req, res) => {
    try {
      let { search } = req.body;
      let userId;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = { user_id: req.body.loginedUserid.id };
      }
      let filters = await ConditionCreator.bspcNewFlowFilter(search);
      let isExits;
      let isExits2;
      let isExits3;

      if (search) {
        let condition = {
          include: [
            {
              // required: true,
              model: monitoringTeamAssignedToBspcsModel,
              attributes: [],
              where: {
                bspc_id: req.body.loginedUserid.id
              }
            }
          ],
          raw: true,
          where: {
            ...filters,
            // willing_to_produce: 1,
            // is_final_submitted: 1
          },
        }
        isExits = await monitoringTeamPdpc.findAll(condition);
        isExits2 = await db.directIndentModel.findAll({
          where: {
            ...filters,
            ...userId,
            // isDirect:true
          }
        });
        isExits3 = await db.bspPerformaBspOne.findAll({
          include: [
            {
              model: db.bspProformaOneBspc,
              attributes: [],
              where: {
                bspc_id: req.body.loginedUserid.id
              }
            }
          ],
          where: {
            ...filters,
            // ...userId,
            production_type: "REALLOCATION"
            // isDirect:true
          },
          raw: true
        });
      }
      console.log('isExits===', isExits);
      console.log('isExits2===', isExits2);
      let responseData = {};
      if ((isExits2 && isExits2.length) && (isExits.length < 1) || (isExits3 && isExits3.length)) {
        responseData = {
          "is_exits": isExits,
          "type": "direct"
        }
        return response(res, 'Already Exits', 201, responseData);
      }
      if ((isExits && isExits.length) && (isExits2.length < 1)) {
        responseData = {
          "is_exits": isExits,
          "type": "national"
        }
        return response(res, 'Already Exits', 201, responseData);
      } else if ((isExits && isExits.length) && (isExits2 && isExits2.length)) {
        responseData = {
          "is_exits": isExits,
          "type": "both"
        }
        return response(res, 'Already Exits', 201, responseData);

      }

      else {
        return response(res, 'Not Exits', 200, []);
      }
    } catch (error) {
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 500, []);
    }
  }
  static getMonitoringTeamPlotsData = async (req, res) => {
    try {
      let { search } = req.body;
      let filters = await ConditionCreator.bspcNewFlowFilter(search);
      let plotConditios;
      let isExistPlot = await db.monitoringTeamOfBspc.findAll({
        attributes: ['plots'],
        where: {
          ...filters,
        },
        raw: true
      })
      let plotsArray = [];
      console.log('isExistPlot===', isExistPlot);
      // if (isExistPlot && isExistPlot.length) {
      //   for (let key of isExistPlot) {
      //     for (let item of key.plots) {
      //       plotsArray.push(item.plot)
      //     }
      //   }
      // }

      // new optimize code
      plotsArray = (isExistPlot || [])
        .flatMap(key => (key.plots || []).map(item => item.plot));

      if (plotsArray) {
        console.log('plotsArray', plotsArray);
        plotConditios = {
          field_code: {
            [Op.notIn]: plotsArray
          }
        }
      }
      // if (search && search.isUpdate == undefined || search.isUpdate != 'is_update') {
      //   if (plotsArray) {
      //     console.log('plotsArray', plotsArray);
      //     plotConditios = {
      //       field_code: {
      //         [Op.notIn]: plotsArray
      //       }
      //     }
      //   }
      // }

      let condition = {
        where: {
          ...filters,
          ...plotConditios,
          is_freezed: 1
        },
        attributes: ['id', 'user_id', 'crop_code', 'year', 'season',
          [sequelize.col('bsp_proforma_2s.field_code'), 'plot'],

        ]
      }
      let plotsData = await db.bspPerformaBspTwo.findAll(condition);
      if (plotsData && plotsData.length) {
        return response(res, status.DATA_AVAILABLE, 200, plotsData);
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 201, []);
      }
    } catch (error) {
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 500, []);
    }
  }
  static getAssignedTeamAllDataNational = async (req, res) => {
    let returnResponse = {};
    try {
      let { search, } = req.body;
      let userId;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = req.body.loginedUserid.id;
      }
      let filters = await ConditionCreator.bspcNewFlowFilter(search);
      let isExits;
      if (search && search.team_id) {
        isExits = await monitoringTeamOfBspc.findAll({
          where: {
            ...filters
          }
        });
      }
      if (isExits) {
        return response(res, status.ALREADY_AVAILED, 201, []);
      }

      let condition = {
        include: [
          {
            model: monitoringTeamPdpcDetails,
            required: true,
            attributes: [],
          },
          {
            required: true,
            model: monitoringTeamAssignedToBspcsModel,
            attributes: [],
            where: {
              bspc_id: userId
            }
          }
        ],
        attributes: [
          [sequelize.col('monitoring_team_of_pdpcs.id'), 'id'],
          [sequelize.col('monitoring_team_of_pdpcs.name'), 'team_name'],
          [sequelize.col('monitoring_team_of_pdpcs.crop_code'), 'crop_code'],
        ],
        raw: true,
        where: {
          ...filters,
        }
      };
      let teamAllData = await monitoringTeamPdpc.findAll(condition);

      let responseData = teamAllData;
      return response(res, status.DATA_AVAILABLE, 200, responseData);
    } catch (error) {
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }
  static updateGenerateTagLotData = async (req, res) => {
    try {
      const { year, season, crop_code, variety_code, lot_id, no_of_bag, bag_size, total_qty } = req.body;
      let userId;
      if (req.body.loginedUserid && req.body.loginedUserid.id) {
        userId = req.body.loginedUserid.id;
      }
      console.log('userId', userId);
      const transaction = await db.sequelize.transaction();
      let getSeedTagData = await db.seedTagDetails.findOne(
        {
          where: {
            year: year,
            season: season,
            crop_code: crop_code,
            variety_code: variety_code,
            lot_id: lot_id,
            user_id: userId
          },
          raw: true
        });

      try {
        // Perform the update operation inside the transaction
        const [affectedRows] = await db.seedProcessingRegister.update(
          {
            no_of_bags: no_of_bag,
            lot_qty: total_qty
          },
          {
            where: {
              year: year,
              season: season,
              crop_code: crop_code,
              variety_code: variety_code,
              lot_id: lot_id,
              bspc_id: userId
            },
            transaction  // Ensure the update happens within the transaction
          });
        const [affectedRows1] = await db.seedTagDetails.update(
          {
            no_of_bags: no_of_bag,
            lot_qty: total_qty
          },
          {
            where: {
              year: year,
              season: season,
              crop_code: crop_code,
              variety_code: variety_code,
              lot_id: lot_id,
              user_id: userId
            },
            transaction
          });
        const [affectedRows2] = await db.seedTagRange.update(
          {
            no_of_bags: no_of_bag,
            qty: total_qty
          },
          {
            where: {
              seed_tag_details_id: getSeedTagData && getSeedTagData.id ? getSeedTagData.id : ''
            },
            transaction
          });
        // Check if any rows were updated
        if (affectedRows > 0) {
          response(res, status.DATA_UPDATED, 200, []);
        } else {
          response(res, status.DATA_NOT_UPDATE, 201, []);

        }
        // Commit the transaction if no errors occurred
        await transaction.commit();
      } catch (error) {
        // If an error occurred, roll back the transaction
        await transaction.rollback();
        return response(res, status.DATA_NOT_UPDATE, 401, []);
      }
    }
    catch (error) {
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 500, []);
    }
  }
}
module.exports = MonitoringTeamDetails


