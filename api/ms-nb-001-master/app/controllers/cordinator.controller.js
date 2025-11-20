const monitoring_team_pdpcModel = require("../models/monitoring_team_pdpc.model");
const status = require('../_helpers/status.conf')
const monitoring_team_pdpc_detailsModel = require("../models/monitoring_team_pdpc_details.model");
const { cropModel, indentOfBreederseedModel } = require("../models");
const db = require("../models");
const Op = require('sequelize').Op;
const sequelize = require('sequelize');
const response = require('../_helpers/response');
const masterHelper = require("../_helpers/masterhelper");
const ConditionCreator = require("../_helpers/condition-creator");
class cordinatorController {
    static createTeamMonitoring = async (req, res) => {
        try {
            let condition = {}
            let { team_name, season, user_id, variety_code, crop, year, state, is_same, id, team_name_new } = req.body
            let team_name_value = '';
            if (is_same) {
                db.monitoringTeamPdpc.update({ is_active: 0 }, {
                    where: {
                        id: id
                    }
                })
            }
            if (team_name_new) {
                team_name_value = team_name_new
            } else {
                team_name_value = team_name
            }
            let data = db.monitoringTeamPdpc.build({
                name: team_name_value,
                season: season,
                user_id: user_id,
                variety_code: variety_code,
                crop_code: crop,
                state_code: state ? state : null,
                year: year,
                is_active: 1
            })
            await data.save()
            const savedetails = req.body.bspc;
            let tabledExtracted = false;
            let dataa;
            if (req.body !== undefined
                && req.body.bsp1Arr !== undefined
                && req.body.bsp1Arr.length > 0) {
                tabledExtracted = true;
                for (let index = 0; index < req.body.bsp1Arr.length; index++) {
                    const element = req.body.bsp1Arr[index];
                    let { designation, type_of_agency } = element

                    const dataRow = {
                        agency_type_id: type_of_agency,
                        desination_id: designation,
                        district_code: req.body && req.body.district_code ? req.body.district_code : null,
                        state_code: element && element.state && element.state.state_code ? element.state.state_code : element && element.state_code ? element.state_code : '',
                        district_code: element && element.district && element.district.district_code ? element.district.district_code : element && element.district_code ? element.district_code : null,
                        monitoring_team_of_pdpc_id: data.id,
                    }
                    dataa = db.monitoringTeamPdpcDetails.build(dataRow)
                    await dataa.save();
                }
            }
            if (data) {
                const resp = await db.monitoringTeamPdpc.findAll({
                    where: {
                        id: data.id
                    },
                    include: [{
                        model: db.monitoringTeamPdpcDetails,
                        include: [
                            {
                                model: db.stateModel,
                                attributes: [],
                            },
                            {
                                model: db.districtModel,
                                attributes: [],
                            },
                            {
                                model: db.agencytypeModel,
                                attributes: [],
                            }
                        ],
                        attributes: []
                    },

                    ],
                    raw: true,
                    attributes: ['name', 'season', 'user_id', 'year', 'id', 'crop_code',
                        [sequelize.col('monitoring_team_of_pdpcs.state_code'), 'state_id'],
                        [sequelize.col('monitoring_team_of_pdpc_detail.state_code'), 'state_code'],
                        [sequelize.col('monitoring_team_of_pdpc_detail.desination_id'), 'desination_id'],
                        [sequelize.col('monitoring_team_of_pdpc_detail.agency_type_id'), 'agency_type_id'],
                        [sequelize.col('monitoring_team_of_pdpc_detail.district_code'), 'district_code'],
                        [sequelize.col('"monitoring_team_of_pdpc_detail->m_state.state_name'), 'state_name'],
                        [sequelize.col('monitoring_team_of_pdpc_detail->m_district.district_name'), 'district_name'],
                        [sequelize.col('monitoring_team_of_pdpc_detail->agency_type.name'), 'agency_name']
                    ],
                    where: {
                        id: data.id
                    },
                })
                let filteredData = []
                resp.forEach(el => {
                    const spaIndex = filteredData.findIndex(item => item.id === el.id);
                    if (spaIndex === -1) {
                        filteredData.push({

                            name: el && el.name ? el.name : '',
                            season: el && el.season ? el.season : '',
                            user_id: el && el.user_id ? el.user_id : '',
                            id: el && el.id ? el.id : '',
                            year: el && el.year ? el.year : '',
                            crop: el && el.crop_code ? el.crop_code : '',
                            state_id: el && el.state_id ? el.state_id : '',
                            bsp1Arr: [
                                {
                                    state_code: el && el.state_code ? el.state_code : '',
                                    state_name: el && el.state_name ? el.state_name : '',
                                    agency_name: el && el.agency_name ? el.agency_name : '',
                                    district_name: el && el.district_name ? el.district_name : '',
                                    desination_id: el && el.desination_id ? el.desination_id : '',
                                    state_name: el && el.state_name ? el.state_name : '',
                                    agency_type_id: el && el.state_name ? el.agency_type_id : '',
                                    district_code: el && el.district_code ? el.district_code : null,
                                }
                            ]
                        });
                    } else {
                        filteredData[spaIndex].bsp1Arr.push(
                            {
                                state_code: el && el.state_code ? el.state_code : '',
                                state_name: el && el.state_name ? el.state_name : '',
                                desination_id: el && el.desination_id ? el.desination_id : '',
                                district_name: el && el.district_name ? el.district_name : '',
                                state_name: el && el.state_name ? el.state_name : '',
                                agency_type_id: el && el.agency_type_id ? el.agency_type_id : '',
                                agency_name: el && el.agency_name ? el.agency_name : '',
                                district_code: el && el.district_code ? el.district_code : null,
                            }
                        )
                    }
                });
                // const ress= this.getMonitoringData(data.id,year,crop,season,state)
                return response(res, status.DATA_SAVE, 200, filteredData)
            } else {
                return response(res, status.DATA_NOT_SAVE, 400, {})
            }
        } catch (error) {
            console.log(error)
            response(res, status.DATA_NOT_AVAILABLE, 500, error)
        }
    }
    static updateTeamMonitoring = async (req, res) => {

        try {
            let condition = {}
            const deleteData = await db.monitoringTeamPdpc.destroy(
                {
                    where: {
                        id: req.body.id
                    }
                }
            )
            const deletedetailsData = await db.monitoringTeamPdpcDetails.destroy(
                {
                    where: {
                        monitoring_team_of_pdpc_id: req.body.id
                    }
                }
            )
            let { team_name, season, user_id, variety_code, crop, year, state, is_same, team_name_new } = req.body
            let team_name_value = "";
            if (is_same) {
                db.monitoringTeamPdpc.update({ is_active: 0 }, {
                    where: {
                        id: id
                    }
                })
            }
            if (team_name_new) {
                team_name_value = team_name_new
            } else {
                team_name_value = team_name
            }
            let data = db.monitoringTeamPdpc.build({

                name: team_name_value,
                season: season,
                user_id: user_id,
                variety_code: variety_code,
                crop_code: crop,
                state_code: state ? state : null,
                year: year,
                id: req.body.id,
                is_active: 1
            })
            await data.save()
            const savedetails = req.body.bspc;
            let tabledExtracted = false;
            let dataa;
            if (req.body !== undefined
                && req.body.bsp1Arr !== undefined
                && req.body.bsp1Arr.length > 0) {
                tabledExtracted = true;
                for (let index = 0; index < req.body.bsp1Arr.length; index++) {
                    const element = req.body.bsp1Arr[index];
                    let { designation, type_of_agency } = element

                    const dataRow = {
                        agency_type_id: type_of_agency,
                        desination_id: designation,
                        district_code: req.body.district_code,
                        state_code: element && element.state && element.state.state_code ? element.state.state_code : element.state_code,
                        district_code: element && element.district && element.district.district_code ? element.district.district_code : (element.district_code ? element.district_code : null),
                        monitoring_team_of_pdpc_id: req.body.id
                    }
                    dataa = db.monitoringTeamPdpcDetails.build(dataRow)
                    await dataa.save();

                }
            }
            if (data) {
                const resp = await db.monitoringTeamPdpc.findAll({
                    where: {
                        id: data.id
                    },
                    include: [{
                        model: db.monitoringTeamPdpcDetails,
                        include: [
                            {
                                model: db.stateModel,
                                attributes: [],
                            },
                            {
                                model: db.districtModel,
                                attributes: [],
                            },
                            {
                                model: db.agencytypeModel,
                                attributes: [],
                            },
                            {
                                model: db.designationModel,
                                attributes: [],
                            }
                        ],
                        attributes: []
                    },

                    ],
                    raw: true,
                    attributes: ['name', 'season', 'user_id', 'year', 'id', 'crop_code',
                        [sequelize.col('monitoring_team_of_pdpcs.state_code'), 'state_id'],
                        [sequelize.col('monitoring_team_of_pdpc_detail.state_code'), 'state_code'],
                        [sequelize.col('monitoring_team_of_pdpc_detail.desination_id'), 'desination_id'],
                        [sequelize.col('monitoring_team_of_pdpc_detail.agency_type_id'), 'agency_type_id'],
                        [sequelize.col('monitoring_team_of_pdpc_detail.district_code'), 'district_code'],
                        [sequelize.col('monitoring_team_of_pdpc_detail->m_state.state_name'), 'state_name'],
                        [sequelize.col('monitoring_team_of_pdpc_detail->m_district.district_name'), 'district_name'],
                        [sequelize.col('monitoring_team_of_pdpc_detail->agency_type.name'), 'agency_name'],
                        [sequelize.col('monitoring_team_of_pdpc_detail->m_designation.name'), 'designation_name'],
                    ],
                    where: {
                        id: data.id
                    },
                })
                let filteredData = []
                resp.forEach(el => {
                    const spaIndex = filteredData.findIndex(item => item.id === el.id);
                    if (spaIndex === -1) {
                        filteredData.push({

                            name: el && el.name ? el.name : '',
                            season: el && el.season ? el.season : '',
                            user_id: el && el.user_id ? el.user_id : '',
                            id: el && el.id ? el.id : '',
                            year: el && el.year ? el.year : '',
                            crop: el && el.crop_code ? el.crop_code : '',
                            state_id: el && el.state_id ? el.state_id : '',
                            bsp1Arr: [
                                {
                                    state_code: el && el.state_code ? el.state_code : '',
                                    state_name: el && el.state_name ? el.state_name : '',
                                    district_name: el && el.district_name ? el.district_name : '',
                                    desination_id: el && el.desination_id ? el.desination_id : '',
                                    state_name: el && el.state_name ? el.state_name : '',
                                    agency_type_id: el && el.state_name ? el.agency_type_id : '',
                                    district_code: el && el.district_code ? el.district_code : null,
                                    agency_name: el && el.agency_name ? el.agency_name : '',
                                    designation_name: el && el.designation_name ? el.designation_name : ''
                                }
                            ]
                        });
                    } else {
                        filteredData[spaIndex].bsp1Arr.push(
                            {
                                state_code: el && el.state_code ? el.state_code : '',
                                state_name: el && el.state_name ? el.state_name : '',
                                desination_id: el && el.desination_id ? el.desination_id : '',
                                district_name: el && el.district_name ? el.district_name : '',
                                state_name: el && el.state_name ? el.state_name : '',
                                agency_name: el && el.agency_name ? el.agency_name : '',
                                agency_type_id: el && el.agency_type_id ? el.agency_type_id : '',
                                district_code: el && el.district_code ? el.district_code : null,
                                designation_name: el && el.designation_name ? el.designation_name : ''
                            }
                        )
                    }
                });
                return response(res, status.DATA_SAVE, 200, filteredData)
            } else {
                return response(res, status.DATA_NOT_SAVE, 400, {})
            }
        } catch (error) {
            console.log(error)
            response(res, status.DATA_NOT_AVAILABLE, 500, error)
        }
    }
    static deleteTeamMonitoring = async (req, res) => {

        try {
            let data = await db.monitoringTeamPdpc.destroy({
                where: {
                    id: req.body.search.id
                }

            })
            // await data.save()
            return response(res, status.DATA_SAVE, 200, data)

        } catch (error) {
            console.log(error)
            response(res, status.DATA_NOT_AVAILABLE, 500, error)
        }
    }


    static cropIndentingData = async (req, res) => {
        let returnResponse = {};
        try {
            const { year, season } = req.body.search
            let condition = {
                include: [
                    {
                        model: db.cropModel,
                        raw: true,
                        required: true,
                        where: {
                            breeder_id: req.body.loginedUserid.id
                        },
                        attributes: []
                    },
                ],
                attributes: [
                    [sequelize.fn('DISTINCT', sequelize.col('m_crop.crop_code')), 'crop_code'],
                    [sequelize.col('m_crop.crop_name'), 'crop_name'],
                ],
                where: {
                    year: year,
                    season: season
                },
                raw: true,
                required: true,
            }
            condition.order = [[sequelize.col('m_crop.crop_name'), 'ASC']]
            returnResponse = await db.indentOfBreederseedModel.findAll(condition);
            return response(res, status.OK, 200, returnResponse);
        } catch (error) {
            console.log("error", error)
            return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
        }
    }
    static getDesignation = async (req, res) => {
        let data = {};
        try {
            data = await db.designationModel.findAll();
            response(res, status.DATA_AVAILABLE, 200, data)
        } catch (error) {
            console.log(error)
            response(res, status.DATA_NOT_AVAILABLE, 500)
        }
    }
    static getTeamMonitoring = async (req, res) => {
        try {

            let data;
            let { isSearch } = req.body.search
            if (isSearch) {
                data = await db.monitoringTeamPdpc.findAll({
                    where: {
                        year: req.body.search.year,
                        season: req.body.search.season,
                        crop_code: req.body.search.crop,
                        state_code: req.body.search.state,
                    },
                    include: [{
                        model: db.monitoringTeamPdpcDetails,
                        include: [
                            {
                                model: db.stateModel,
                                attributes: []
                            },
                            {
                                model: db.districtModel,
                                attributes: []
                            },

                        ],


                        attributes: []
                    },

                    {
                        model: db.stateModel,
                        attributes: []
                    },
                    ],
                    raw: true,
                    attributes: ['name', 'season', 'user_id', 'year', 'id', 'crop_code',
                        [sequelize.col('monitoring_team_of_pdpc_detail.state_code'), 'state_code'],
                        [sequelize.col('monitoring_team_of_pdpcs.state_code'), 'state_id'],
                        [sequelize.col('m_state.state_name'), 'state_names'],
                        // [sequelize.col('monitoring_team_of_pdpcs->m_crop.crop_name'), 'crop_name'],
                        [sequelize.col('monitoring_team_of_pdpcs.state_name'), 'state_name'],
                        [sequelize.col('monitoring_team_of_pdpc_detail.desination_id'), 'desination_id'],
                        [sequelize.col('monitoring_team_of_pdpc_detail.agency_type_id'), 'agency_type_id'],
                        [sequelize.col('monitoring_team_of_pdpc_detail.district_code'), 'district_code'],
                        [sequelize.col('monitoring_team_of_pdpc_detail->m_state.state_name'), 'state_name'],
                        [sequelize.col('monitoring_team_of_pdpc_detail->m_district.district_name'), 'district_name']

                    ]
                })
            }
            else {

                data = await db.monitoringTeamPdpc.findAll({
                    where: {
                        id: req.body.search.id
                    },
                    include: [{
                        model: db.monitoringTeamPdpcDetails,
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
                            {
                                model: db.agencytypeModel,
                                attributes: []
                            },

                        ],
                        attributes: []
                    },
                    {
                        model: db.stateModel,
                        attributes: []
                    },


                        //    {
                        //     model: db.cropModel,
                        //     attributes: [] 
                        // },

                    ],
                    raw: true,
                    attributes: ['name', 'season', 'user_id', 'year', 'id', 'crop_code',
                        [sequelize.col('monitoring_team_of_pdpc_detail.state_code'), 'state_code'],
                        [sequelize.col('monitoring_team_of_pdpcs.state_code'), 'state_id'],
                        [sequelize.col('m_state.state_name'), 'state_names'],
                        //    [sequelize.col('monitoring_team_of_pdpcs->m_crop.crop_name'), 'crop_name'],
                        [sequelize.col('monitoring_team_of_pdpc_detail.desination_id'), 'desination_id'],
                        [sequelize.col('monitoring_team_of_pdpc_detail.agency_type_id'), 'agency_type_id'],
                        [sequelize.col('monitoring_team_of_pdpc_detail.district_code'), 'district_code'],
                        [sequelize.col('monitoring_team_of_pdpc_detail->m_state.state_name'), 'state_name'],
                        [sequelize.col('monitoring_team_of_pdpc_detail->m_district.district_name'), 'district_name'],
                        [sequelize.col('monitoring_team_of_pdpc_detail->m_designation.name'), 'designation_name'],
                        [sequelize.col('monitoring_team_of_pdpc_detail->agency_type.name'), 'agency_name']
                        // [sequelize.col('m_designation.name'), 'designation_name']

                    ]
                })
            }

            let filteredData = []
            if (isSearch) {
                data.forEach(el => {
                    const spaIndex = filteredData.findIndex(item => item.year === el.year && el.season == el.season && el.crop_code == el.crop_code);
                    if (spaIndex === -1) {
                        filteredData.push({

                            name: el && el.name ? el.name : '',
                            season: el && el.season ? el.season : '',
                            crop_code: el && el.crop_code ? el.crop_code : '',
                            user_id: el && el.user_id ? el.user_id : '',
                            state_id: el && el.state_id ? el.state_id : '',
                            state_name: el && el.state_names ? el.state_names : '',
                            id: el && el.id ? el.id : '',
                            year: el && el.year ? el.year : '',
                            bsp1Arr: [
                                {
                                    state_code: el && el.state_code ? el.state_code : '',
                                    desination_id: el && el.desination_id ? el.desination_id : '',
                                    state_name: el && el.state_name ? el.state_name : '',
                                    agency_type_id: el && el.state_name ? el.agency_type_id : '',
                                    district_code: el && el.district_code ? el.district_code : '',
                                }
                            ]
                        });
                    } else {
                        filteredData[spaIndex].bsp1Arr.push(
                            {
                                state_code: el && el.state_code ? el.state_code : '',
                                desination_id: el && el.desination_id ? el.desination_id : '',
                                state_name: el && el.state_name ? el.state_name : '',
                                agency_type_id: el && el.agency_type_id ? el.agency_type_id : '',
                                district_code: el && el.district_code ? el.district_code : '',
                            }
                        )
                    }
                });
            }
            else {

                data.forEach(el => {
                    const spaIndex = filteredData.findIndex(item => item.id === el.id);
                    if (spaIndex === -1) {
                        filteredData.push({

                            name: el && el.name ? el.name : '',
                            season: el && el.season ? el.season : '',
                            user_id: el && el.user_id ? el.user_id : '',
                            crop_code: el && el.crop_code ? el.crop_code : '',
                            state_name: el && el.state_names ? el.state_names : '',
                            state_id: el && el.state_id ? el.state_id : '',
                            id: el && el.id ? el.id : '',
                            year: el && el.year ? el.year : '',
                            bsp1Arr: [
                                {
                                    state_code: el && el.state_code ? el.state_code : '',
                                    desination_id: el && el.desination_id ? el.desination_id : '',
                                    state_name: el && el.state_name ? el.state_name : '',
                                    agency_type_id: el && el.state_name ? el.agency_type_id : '',
                                    district_code: el && el.district_code ? el.district_code : '',
                                    designation_name: el && el.designation_name ? el.designation_name : '',
                                    agency_name: el && el.agency_name ? el.agency_name : ''
                                }
                            ]
                        });
                    } else {
                        filteredData[spaIndex].bsp1Arr.push(
                            {
                                state_code: el && el.state_code ? el.state_code : '',
                                desination_id: el && el.desination_id ? el.desination_id : '',
                                crop_code: el && el.crop_code ? el.crop_code : '',
                                state_name: el && el.state_name ? el.state_name : '',
                                agency_type_id: el && el.agency_type_id ? el.agency_type_id : '',
                                designation_name: el && el.designation_name ? el.designation_name : '',
                                district_code: el && el.district_code ? el.district_code : '',
                                agency_name: el && el.agency_name ? el.agency_name : ''
                            }
                        )
                    }
                });
            }
            if (data) {
                let responseData = {
                    filteredData: filteredData,
                    data: data
                }
                return response(res, status.DATA_AVAILABLE, 200, responseData)
            } else {
                return response(res, status.DATA_NOT_AVAILABLE, 200, {})
            }

        } catch (error) {
            console.log(error)
            response(res, status.DATA_NOT_AVAILABLE, 500)
        }
    }
    static getTeamMonitoringData = async (req, res) => {
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
                if (req.body.search.idArr) {
                    filterData2.push({
                        id: {
                            [Op.in]: req.body.search.idArr
                        }
                    });
                }
                if (req.body.search.state) {
                    filterData2.push({
                        state_code: {
                            [Op.eq]: req.body.search.state
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
                if (req.body.search.crop_codes) {
                    filterData2.push({
                        crop_code: {
                            [Op.eq]: req.body.search.crop_codes
                        }
                    });
                }
            }
            // let filters = await ConditionCreator.filters(req.body.search);


            let page = 1;
            let pageSize = 2;
            const offset = (page - 1) * pageSize;
            let data = await db.monitoringTeamPdpc.findAll({

                where: {
                    [Op.and]: filterData2 ? filterData2 : [],
                    is_active: 1

                },
                include: [{
                    model: db.monitoringTeamPdpcDetails,
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
                        {
                            model: db.agencytypeModel,
                            attributes: []
                        },
                    ],
                    attributes: []
                },
                ],


                raw: true,
                // offset, // Offset for skipping records
                // limit: pageSize,
                attributes: ['name', 'season', 'user_id', 'year', 'id', 'crop_code',
                    [sequelize.col('monitoring_team_of_pdpcs.state_code'), 'state_id'],
                    [sequelize.col('monitoring_team_of_pdpc_detail.state_code'), 'state_code'],
                    [sequelize.col('monitoring_team_of_pdpc_detail.state_code'), 'state_code'],
                    [sequelize.col('monitoring_team_of_pdpc_detail.desination_id'), 'desination_id'],
                    [sequelize.col('monitoring_team_of_pdpc_detail.agency_type_id'), 'agency_type_id'],
                    [sequelize.col('monitoring_team_of_pdpc_detail.district_code'), 'district_code'],
                    [sequelize.col('monitoring_team_of_pdpc_detail->m_state.state_name'), 'state_name'],
                    [sequelize.col('monitoring_team_of_pdpc_detail->m_district.district_name'), 'district_name'],
                    [sequelize.col('monitoring_team_of_pdpc_detail->agency_type.name'), 'agency_name'],
                    [sequelize.col('monitoring_team_of_pdpc_detail->m_designation.name'), 'designation_name'],
                ]
            })

            let filteredData = []
            data.forEach(el => {
                const spaIndex = filteredData.findIndex(item => item.year === el.year && item.season == el.season && item.crop == el.crop_code && item.state_id == el.state_id && item.name == el.name);
                if (spaIndex === -1) {
                    filteredData.push({
                        name: el && el.name ? el.name : '',
                        crop: el && el.crop_code ? el.crop_code : '',
                        season: el && el.season ? el.season : '',
                        user_id: el && el.user_id ? el.user_id : '',
                        state_id: el && el.state_id ? el.state_id : '',
                        id: el && el.id ? el.id : '',
                        year: el && el.year ? el.year : '',
                        bsp1Arr: [
                            {
                                state_code: el && el.state_code ? el.state_code : '',
                                district_name: el && el.district_name ? el.district_name : '',
                                desination_id: el && el.desination_id ? el.desination_id : '',
                                agency_name: el && el.agency_name ? el.agency_name : '',
                                state_name: el && el.state_name ? el.state_name : '',
                                agency_type_id: el && el.state_name ? el.agency_type_id : '',
                                district_code: el && el.district_code ? el.district_code : '',
                                designation_name: el && el.designation_name ? el.designation_name : ''
                            }
                        ]
                    });
                } else {
                    const cropIndex = filteredData[spaIndex].bsp1Arr.findIndex(item => item.state_code == el.state_code);
                    filteredData[spaIndex].bsp1Arr.push(
                        {
                            state_code: el && el.state_code ? el.state_code : '',
                            desination_id: el && el.desination_id ? el.desination_id : '',
                            state_name: el && el.state_name ? el.state_name : '',
                            agency_name: el && el.agency_name ? el.agency_name : '',
                            agency_type_id: el && el.agency_type_id ? el.agency_type_id : '',
                            district_code: el && el.district_code ? el.district_code : '',
                            district_name: el && el.district_name ? el.district_name : '',
                            designation_name: el && el.designation_name ? el.designation_name : ''
                        }
                    )

                }
            });
            if (data) {

                return response(res, status.DATA_AVAILABLE, 200, filteredData)
            } else {
                return response(res, status.DATA_NOT_AVAILABLE, 200, {})
            }

        } catch (error) {
            console.log(error)
            response(res, status.DATA_NOT_AVAILABLE, 500, error)
        }
    }
    // static getAgencyType = async (req, res) => {
    //     try {

    //         let data = await db.agencytypeModel.findAll({
    //             attributes: ['id', 'name'],
    //             order: [['name', 'ASC']]
    //         })
    //         if (data) {
    //             return response(res, status.DATA_AVAILABLE, 200, data)
    //         } else {
    //             return response(res, status.DATA_NOT_AVAILABLE, 200, {})
    //         }

    //     } catch (error) {
    //         console.log(error)
    //         response(res, status.DATA_NOT_AVAILABLE, 500, error)
    //     }
    // }
    static getAgencyType = async (req, res) => {
        try {
            let data = await db.agencytypeModel.findAll({
                attributes: ['id', 'name'],
                order: [['name', 'ASC']]
            });
    
            // Move "Other Institute" to the end of the list
            if (data) {
                // Filter out "Other Institute" and append it at the end
                const otherInstitute = data.filter(item => item.name === "Other Institute");
                const remainingData = data.filter(item => item.name !== "Other Institute");
    
                // Concatenate "Other Institute" to the end of the sorted list
                const sortedData = [...remainingData, ...otherInstitute];
    
                return response(res, status.DATA_AVAILABLE, 200, sortedData);
            } else {
                return response(res, status.DATA_NOT_AVAILABLE, 200, {});
            }
        } catch (error) {
            console.log(error);
            response(res, status.DATA_NOT_AVAILABLE, 500, error);
        }
    };
    static getSeedInventoryData = async (req, res) => {
        try {
            // let data =e{}  
            let { bspId } = req.body
            let responseData = await db.seedInventory.findAll({
                where: {
                    id: bspId,
                },
                include: [
                    {
                        model: db.cropModel
                    },
                    {
                        model: db.varietyModel
                    },
                    {
                        model: db.stageModel
                    }
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
    static getSeedClass = async (req, res) => {
        try {
            // let data =e{}  

            let responseData = await db.seedClassModel.findAll({
                attributes: ['type', 'id', 'class_name']

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
    static getbspPerforma1Year = async (req, res) => {
        try {
            let production_type;
            let { search } = req.body;
            if (search.production_type) {
                if (search.production_type == "DELAY") {
                    production_type = { production_type: "DELAY" }
                }
                if (search.production_type == "NORMAL") {
                    production_type = { production_type: "NORMAL" }
                }
                if (search.production_type == "REALLOCATION") {
                    production_type = { production_type: "REALLOCATION" }
                }
            }



            let responseData = await db.bspPerformaBspOne.findAll({
                include: [{
                    model: db.bspProformaOneBspc,
                    attributes: [],
                    where: {
                        bspc_id: req.body.loginedUserid && req.body.loginedUserid.id ? req.body.loginedUserid.id : '',
                        ...production_type,
                    },


                },
                    // {
                    //     model:db.seedForProductionModel,
                    //     attributes:[],
                    //     as:'seed_for_production',
                    //     where:{
                    //         user_id:req.body.loginedUserid && req.body.loginedUserid.id  ?  req.body.loginedUserid.id  :''
                    //     },
                    // }

                ],
                attributes: [
                    [sequelize.fn('DISTINCT', sequelize.col('bsp_proforma_1s.year')), 'year'],
                ],
                where: {
                    is_active: 1,
                    is_final_submit: 1,
                    
                    // [Op.or]: [
                    //     {
                    //       ['$seed_for_production.nucleus_seed_available_qnt$']: {
                    //         [Op.gt]: 0
                    //       }
                    //     },
                    //     {
                    //       [Op.and]: [
                    //         {
                    //           ['$seed_for_production.breeder_seed_available_qnt$']: {
                    //             [Op.gt]: 0
                    //           }

                    //         },
                    //         {
                    //           ['$bsp_proforma_1_bspc.isPermission$']: true
                    //         },
                    //         {
                    //           ['$bsp_proforma_1_bspc.isPermission$']: null
                    //         }
                    //       ]
                    //     }

                    //   ]

                },
                raw: true,
                order: [['year', 'DESC']]

            })
            let directYear = await db.directIndent.findAll({
                where: {
                    user_id: req.body.loginedUserid && req.body.loginedUserid.id ? req.body.loginedUserid.id : ''
                },
                attributes: ['year'],
                raw: true,
                order: [['year', 'DESC']]

            })
            let yearData = []
            if (search.production_type == "NORMAL") {
                if (directYear && directYear.length > 0) {
                    directYear.forEach((el) => {
                        yearData.push(el && el.year ? el.year : '')
                    })
                }
            }
            if (responseData && responseData.length > 0) {
                responseData.forEach((el) => {
                    yearData.push(el && el.year ? el.year : '')
                })
            }
            yearData = [...new Set(yearData)]
            let responseYear = []
            if (yearData && yearData.length > 0) {
                yearData.forEach((el, i) => {
                    responseYear.push({ year: el })
                })
            }
            if (responseYear) {
                return response(res, status.DATA_AVAILABLE, 200, responseYear)
            } else {
                return response(res, status.DATA_NOT_AVAILABLE, 200, {})
            }

        } catch (error) {
            console.log(error)
            response(res, status.DATA_NOT_AVAILABLE, 500, error)
        }
    }
    static getbspPerforma1YearReport = async (req, res) => {
        try {
            const { user_id } = req.body
            console.log("user id -------------", user_id);
            let responseData = await db.bspPerformaBspOne.findAll({
                include: [{
                    model: db.bspProformaOneBspc,
                    attributes: [],
                    where: {
                        bspc_id: user_id
                    }
                }],
                attributes: [
                    [sequelize.fn('DISTINCT', sequelize.col('bsp_proforma_1s.year')), 'year'],
                ],
                where: {
                    is_active: 1
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
    static getbspPerforma1Season = async (req, res) => {
        try {
            let production_type;
            let { search } = req.body;
            if (search.production_type) {
                if (search.production_type == "DELAY") {
                    production_type = { production_type: "DELAY" }
                }
                if (search.production_type == "NORMAL") {
                    production_type = { production_type: "NORMAL" }
                }
                if (search.production_type == "REALLOCATION") {
                    production_type = { production_type: "REALLOCATION" }
                }
            }
            let responseData = await db.bspPerformaBspOne.findAll({
                include: [{
                    model: db.bspProformaOneBspc,
                    attributes: [],
                    where: {
                        bspc_id: req.body.loginedUserid && req.body.loginedUserid.id ? req.body.loginedUserid.id : '',
                        ...production_type,
                    },


                },
                ],
                attributes: [
                    [sequelize.col('bsp_proforma_1s.season'), 'season']
                    // [sequelize.fn('DISTINCT', sequelize.col('bsp_proforma_1s.season')), 'season'],
                ],
                group: [
                    [sequelize.col('bsp_proforma_1s.season'), 'season']
                ],
                where: {
                    year: req.body.search.year,
                    is_active: 1,
                    is_final_submit: 1,
                    // ...production_type
                    // bspc_id:req.body.loginedUserid && req.body.loginedUserid.id  ?  req.body.loginedUserid.id  :''

                },
                order: [['season', 'ASC']]

            })
            let directSeason = await db.directIndent.findAll({
                where: {
                    user_id: req.body.loginedUserid && req.body.loginedUserid.id ? req.body.loginedUserid.id : ''
                },
                attributes: ['season'],
                raw: true,
                order: [['season', 'ASC']]

            })
            let seasonData = []
            if (search.production_type == "NORMAL") {
                if (directSeason && directSeason.length > 0) {
                    directSeason.forEach((el) => {
                        seasonData.push(el && el.season ? el.season : '')
                    })
                }
            }

            if (responseData && responseData.length > 0) {
                responseData.forEach((el) => {
                    seasonData.push(el && el.season ? el.season : '')
                })
            }
            seasonData = [...new Set(seasonData)]
            let responseSeason = []
            if (seasonData && seasonData.length > 0) {
                seasonData.forEach((el, i) => {
                    responseSeason.push({ season: el })
                })
            }
            if (responseSeason) {
                return response(res, status.DATA_AVAILABLE, 200, responseSeason)
            } else {
                return response(res, status.DATA_NOT_AVAILABLE, 200, {})
            }

        } catch (error) {
            console.log(error)
            response(res, status.DATA_NOT_AVAILABLE, 500, error)
        }
    }

    static getbspPerforma1SeasonReport = async (req, res) => {
        try {
            const { year } = req.body;
            let responseData = await db.bspPerformaBspOne.findAll({
                attributes: [
                    [sequelize.fn('DISTINCT', sequelize.col('bsp_proforma_1s.season')), 'season'],
                ],
                where: {
                    year: year,
                    is_active: 1,
                },
                order: [['season', 'ASC']]
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
    static getbspPerforma1Crop = async (req, res) => {
        try {
            let production_type;
            let { search } = req.body;
            if (search.production_type) {
                if (search.production_type == "DELAY") {
                    production_type = { production_type: "DELAY" }
                }
                if (search.production_type == "NORMAL") {
                    production_type = { production_type: "NORMAL" }
                }
                if (search.production_type == "REALLOCATION") {
                    production_type = { production_type: "REALLOCATION" }
                }
            }
            let responseData = await db.bspPerformaBspOne.findAll({
                include: [
                    {
                        model: db.cropModel,
                        attributes: []
                    },
                    {
                        model: db.bspProformaOneBspc,
                        // required: true,
                        where: {
                            bspc_id: req.body.loginedUserid.id,
                            ...production_type
                        },
                        attributes: []
                    },

                ],
                attributes: [
                    [sequelize.fn('DISTINCT', sequelize.col('bsp_proforma_1s.crop_code')), 'crop_code'],
                    // [sequelize.col('m_crop.crop_name'), 'crop_name']
                ],
                raw: true,
                where: {
                    year: req.body.search.year,
                    season: req.body.search.season,
                    is_active: 1,
                    is_final_submit: 1,
                   

                },
                // order:[['season','ASC']]                                    

            })
            let directCrop = await db.directIndent.findAll({
                where: {
                    user_id: req.body.loginedUserid && req.body.loginedUserid.id ? req.body.loginedUserid.id : '',
                    year: req.body.search.year,
                    season: req.body.search.season,
                },
                attributes: [
                    [sequelize.fn('DISTINCT', sequelize.col('indent_of_breederseed_direct.crop_code')), 'crop_code'],
                    // [sequelize.col('m_crop.crop_name'), 'crop_name']
                ],
                raw: true,
                // order: [[sequelize.col('m_crop.crop_name'), 'ASC']]

            })
            let cropData = []
            if (search.production_type == "NORMAL") {
                if (directCrop && directCrop.length > 0) {
                    directCrop.forEach((el) => {
                        cropData.push(el && el.crop_code ? el.crop_code : '')
                    })
                }
            }
            if (responseData && responseData.length > 0) {
                responseData.forEach((el) => {
                    cropData.push(el && el.crop_code ? el.crop_code : '')
                })
            }

            cropData = [...new Set(cropData)];
            let data = await cropModel.findAll({
                where: {
                    crop_code: {
                        [Op.in]: cropData
                    }
                },
                attributes: [
                    [sequelize.col('m_crops.crop_name'), 'crop_name'],
                    [sequelize.col('m_crops.crop_code'), 'crop_code']

                ],
                raw: true,
                order: [[sequelize.col('m_crops.crop_name'), 'ASC']]
            })

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
    static getbspPerforma1CropReport = async (req, res) => {
        try {
            const { year, season, user_id } = req.body;
            let responseData = await db.bspPerformaBspOne.findAll({
                include: [
                    {
                        model: db.cropModel,
                        attributes: []
                    },
                    {
                        model: db.bspProformaOneBspc,
                        // required: true,
                        where: {
                            bspc_id: user_id
                        },
                        attributes: []
                    },
                ],
                attributes: [
                    [sequelize.fn('DISTINCT', sequelize.col('bsp_proforma_1s.crop_code')), 'crop_code'],
                    [sequelize.col('m_crop.crop_name'), 'crop_name']
                ],
                raw: true,
                where: {
                    year: year,
                    season: season,
                    is_active: 1

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
    static seasionAssignIndentingData = async (req, res) => {
        let returnResponse = {};
        try {
            let breederId;

            let condition = {
                include: [{

                    model: cropModel,
                    where: {
                        breeder_id: req.body.loginedUserid.id ? req.body.loginedUserid.id : ''
                    },
                    attributes: [],

                },
                ],
                raw: true,
                attributes: [
                    [sequelize.fn('DISTINCT', sequelize.col('indent_of_breederseeds.season')), 'season_code'],
                    //   [sequelize.col('m_season.season'), 'season'],
                    //   [sequelize.col('m_season.season_code'), 'season_code'],
                ],
                where: {}
            };
            condition.group = [
                [sequelize.col('indent_of_breederseeds.season'), 'season_code'],
                // [sequelize.col('m_season.season'), 'season'],
                // [sequelize.col('m_season.season_code'), 'season_code'],


            ];
            if (req.body.search) {
                if (req.body.search.crop_group) {
                    condition.where.group_code = req.body.search.crop_group;
                }
                if (req.body.search.year) {
                    condition.where.year = req.body.search.year;
                }
                if (req.body.search.season) {
                    condition.where.season = req.body.search.season;
                }
                if (req.body.search.crop_code) {
                    condition.where.crop_code = req.body.search.crop_code;
                }
                if (req.body.search.variety_id) {
                    condition.where.variety_id = req.body.search.variety_id;
                }
            }

            returnResponse = await indentOfBreederseedModel.findAll(condition);
            return response(res, status.OK, 200, returnResponse);
        } catch (error) {
            returnResponse = {
                message: error.message
            };
            return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
        }
    }
    static getDesignationOfSPP = async (req, res) => {
        let data = {};
        try {
            let typeValue;
            if (req.body) {
                if (req.body.type === "MONITORING_TEAM") {
                    typeValue = {
                        type: "MONITORING_TEAM"
                    }
                }
            }
            data = await db.designationModel.findAll(
                {
                    where: {
                        ...typeValue
                    },
                    order: [['name', 'ASC']]
                }
            );
            response(res, status.DATA_AVAILABLE, 200, data)
        } catch (error) {
            console.log(error)
            response(res, status.DATA_NOT_AVAILABLE, 500)
        }
    }
    static getMonitoringData = async (id, year, crop, season, state, req, res) => {
        let data = {};
        try {
            console.log(id)
            let filterData2 = []
            if (year) {
                filterData2.push({
                    year: {
                        [Op.eq]: year
                    }
                });
            }
            if (crop) {
                filterData2.push({
                    crop_code: {
                        [Op.eq]: crop
                    }
                });
            }
            if (state) {
                filterData2.push({
                    state_code: {
                        [Op.eq]: state
                    }
                });
            }
            if (season) {
                filterData2.push({
                    season: {
                        [Op.eq]: season
                    }
                });
            }
            if (id) {
                filterData2.push({
                    id: {
                        [Op.eq]: id
                    }
                });
            }

            const resp = await db.monitoringTeamPdpc.findAll({
                where: {
                    [Op.and]: filterData2 ? filterData2 : []

                },
                include: [{
                    model: db.monitoringTeamPdpcDetails,
                    include: [
                        {
                            model: db.stateModel,
                            attributes: [],
                        },
                        {
                            model: db.districtModel,
                            attributes: [],
                        },
                        {
                            model: db.agencytypeModel,
                            attributes: [],
                        }
                    ],
                    attributes: []
                },

                ],
                raw: true,
                attributes: ['name', 'season', 'user_id', 'year', 'id', 'crop_code',
                    [sequelize.col('monitoring_team_of_pdpcs.state_code'), 'state_id'],
                    [sequelize.col('monitoring_team_of_pdpc_detail.state_code'), 'state_code'],
                    [sequelize.col('monitoring_team_of_pdpc_detail.desination_id'), 'desination_id'],
                    [sequelize.col('monitoring_team_of_pdpc_detail.agency_type_id'), 'agency_type_id'],
                    [sequelize.col('monitoring_team_of_pdpc_detail.district_code'), 'district_code'],
                    [sequelize.col('"monitoring_team_of_pdpc_detail->m_state.state_name'), 'state_name'],
                    [sequelize.col('monitoring_team_of_pdpc_detail->m_district.district_name'), 'district_name'],
                    [sequelize.col('monitoring_team_of_pdpc_detail->agency_type.name'), 'agency_name']
                ],

            })
            let filteredData = []
            resp.forEach(el => {
                const spaIndex = filteredData.findIndex(item => item.id === el.id);
                if (spaIndex === -1) {
                    filteredData.push({

                        name: el && el.name ? el.name : '',
                        season: el && el.season ? el.season : '',
                        user_id: el && el.user_id ? el.user_id : '',
                        id: el && el.id ? el.id : '',
                        year: el && el.year ? el.year : '',
                        crop: el && el.crop_code ? el.crop_code : '',
                        state_id: el && el.state_id ? el.state_id : '',
                        bsp1Arr: [
                            {
                                state_code: el && el.state_code ? el.state_code : '',
                                state_name: el && el.state_name ? el.state_name : '',
                                agency_name: el && el.agency_name ? el.agency_name : '',
                                district_name: el && el.district_name ? el.district_name : '',
                                desination_id: el && el.desination_id ? el.desination_id : '',
                                state_name: el && el.state_name ? el.state_name : '',
                                agency_type_id: el && el.state_name ? el.agency_type_id : '',
                                district_code: el && el.district_code ? el.district_code : '',
                            }
                        ]
                    });
                } else {
                    filteredData[spaIndex].bsp1Arr.push(
                        {
                            state_code: el && el.state_code ? el.state_code : '',
                            state_name: el && el.state_name ? el.state_name : '',
                            desination_id: el && el.desination_id ? el.desination_id : '',
                            district_name: el && el.district_name ? el.district_name : '',
                            state_name: el && el.state_name ? el.state_name : '',
                            agency_type_id: el && el.agency_type_id ? el.agency_type_id : '',
                            agency_name: el && el.agency_name ? el.agency_name : '',
                            district_code: el && el.district_code ? el.district_code : '',
                        }
                    )
                }
            });
            return resp
            //   response(res, status.DATA_AVAILABLE, 200, resp)
        } catch (error) {
            console.log(error)
            return 0
            //   response(res, status.DATA_NOT_AVAILABLE, 500)
        }
    }

    static getIndentYear = async (req, res) => {
        let data = {};
        try {
            data = await db.indentOfBreederseedModel.findAll(
                {
                    attributes: [
                        [sequelize.fn('DISTINCT', sequelize.col('year')), 'year'],
                    ],
                    order: [['year', 'DESC']]
                }
            );
            response(res, status.DATA_AVAILABLE, 200, data)
        } catch (error) {
            console.log(error)
            response(res, status.DATA_NOT_AVAILABLE, 500)
        }
    }

    static checkMonitoringTeamNameUniqueness = async (req, res) => {
        try {
            let { search } = req.body.search;
            let userId;
            if (req.body.loginedUserid && req.body.loginedUserid.id) {
                userId = {
                    user_id: req.body.loginedUserid.id
                }
            }
            let filterData = [];
            if (req.body.search) {
                if (req.body.search.crop_code) {
                    filterData.push({
                        crop_code: {
                            [Op.eq]: req.body.search.crop_code
                        },
                    })
                }
                if (req.body.search.year) {
                    filterData.push({
                        year: req.body.search.year
                    });
                }
                if (req.body.search.season) {
                    filterData.push({
                        season: {
                            [Op.eq]: req.body.search.season
                        },
                    })
                }
                if (req.body.search.state_code) {
                    filterData.push({
                        state_code: {
                            [Op.eq]: req.body.search.state_code
                        },
                    })
                }

            }
            // let filters = await ConditionCreator.monitoringTeamFilter(search);
            let condition = {
                where: {
                    [Op.and]: filterData ? filterData : [],
                    ...userId,
                    is_active: 1

                },
                // where: {
                //     ...userId,
                //     ...filters,
                //     is_active: 1
                // },
                attributes: ['id', 'name', 'is_active', 'user_id'],
                order: [['name', "DESC"]]
            }

            let getTeamName = await db.monitoringTeamPdpc.findOne(condition);
            return response(res, status.DATA_AVAILABLE, 200, getTeamName);
        } catch (error) {
            console.log(error)
            return response(res, status.UNEXPECTED_ERROR, 500, [{ "msg": "hiii" }]);
        }
    }
    static getAllMonitoringTeamName = async (req, res) => {
        try {
            let { search } = req.body.search;
            let userId;
            if (req.body.loginedUserid && req.body.loginedUserid.id) {
                userId = {
                    user_id: req.body.loginedUserid.id
                }
            }
            let filters = await ConditionCreator.monitoringTeamFilter(req.body.search);
            let condition = {
                where: {
                    ...filters,
                    ...userId,
                    is_active: 1
                },

                attributes: [
                    [sequelize.fn('DISTINCT', sequelize.col('monitoring_team_of_pdpcs.name')), 'name'],
                    [sequelize.col('monitoring_team_of_pdpcs.id'), 'id'],
                    [sequelize.col('monitoring_team_of_pdpcs.is_active'), 'is_active'],
                    [sequelize.col('monitoring_team_of_pdpcs.user_id'), 'user_id']
                ],
                order: [[sequelize.col('monitoring_team_of_pdpcs.name'), "DESC"]],
                raw: true,
            }

            let getTeamName = await db.monitoringTeamPdpc.findAll(condition);
            return response(res, status.DATA_AVAILABLE, 200, getTeamName);
        } catch (error) {
            console.log(error)
            return response(res, status.UNEXPECTED_ERROR, 500, []);
        }
    }
}

module.exports = cordinatorController