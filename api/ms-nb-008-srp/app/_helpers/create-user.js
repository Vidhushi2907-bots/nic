require('dotenv').config()
const request = require('request')
let XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const axios = require('axios');
var https = require('https');
const { resolve } = require('path');
const { userModel, agencyDetailModel, stateModel } = require('../models');
const sequelize = require('sequelize');


class SeedUserManagement {
    static createUser = async (userData, type = null) => {
        // const {msg, mobile} = smsData
        const USER_API_URL = process.env.USER_API_URL
        const SPA_USER_API_URL = process.env.SPA_USER_API_URL

        const ENVIRONMENT = process.env.ENVIRONMENT

        console.log("USER_API_URL", USER_API_URL)
        console.log("ENVIRONMENT", ENVIRONMENT)
        console.log("userData", userData)
        if (ENVIRONMENT == 'AEOLOGIC') {
            return true;
        }

        const httpsAgent = new https.Agent({ rejectUnauthorized: false });

        return new Promise((resolve, reject) => {
            axios({
                url: type == 'SPA' ? SPA_USER_API_URL : USER_API_URL,
                method: 'post',
                httpsAgent: httpsAgent,
                data: userData
            }).then(function (response) {
                console.log("response.stateCode == 200", response.status)
                // console.log("aaaaaaaresponseresponse", response)
                if (response.status == 200) {
                    //console.log("responseresponseDDDDDDDDDDDDDD", response.data)

                    if (response.data == "user created succesfully.") {
                        // resolve("done")
                        resolve(response.data)

                    }
                    resolve(response.data)
                } else {
                    resolve(response.data)
                }
                //    resolve("done")

            }).catch(function (error) {
                // handle error
                console.log("eroror", error);
            })
        });


        // let xhr = new XMLHttpRequest();

        // xhr.open("POST", USER_API_URL, true);
        // xhr.onreadystatechange = function(){
        // if (xhr.readyState == 4 && xhr.status == 200) {
        //     console.log('success');
        // }
        // };
        // // xhr.send();
        // let stringData = JSON.stringify(userData)
        // console.log("stringData", stringData)
        // xhr.send(stringData);
    }


    static updateUser = async (userData) => {

        const UPDATEUSERAPI = process.env.UPDATEUSERAPI;

        const httpsAgent = new https.Agent({ rejectUnauthorized: false });

        return new Promise((resolve, reject) => {
            axios({
                url: UPDATEUSERAPI,
                method: 'POST',
                httpsAgent: httpsAgent,
                data: userData
            }).then(function (response) {
                if (response.status == 200) {
                    resolve(response.data)
                }

            }).catch(function (error) {
                console.log("Inside Error:", error)
            })
        });
    }

    static createUserFromIndentorData = async (state_code) => {

        const CREATEUSERAPI = process.env.CREATEUSERAPI;
        const APPKEY = process.env.APPKEY;
        const httpsAgent = new https.Agent({ rejectUnauthorized: false });

        //Change the cron all state to state wise, now one state SPA will be synced

        // let condition = {
        //     where: { state_code },
        //     attributes: ['state_code'],
        //     raw: true,
        // };

        // const state_data = await stateModel.findAll(condition);
        // if ( state_data && state_data.length > 0) {

        if ( state_code) {
            let state = {state_code}
            // state_data.forEach(state => {
                // const url = CREATEUSERAPI + "?appKey=" + APPKEY + "&stateCode=" + state.state_code;
                const url = CREATEUSERAPI + "?appKey=" + APPKEY + "&stateCode=" + state_code;
                let promise_data = new Promise((resolve, reject) => {
                    axios({
                        url: url,
                        method: 'GET',
                        httpsAgent: httpsAgent,
                    }).then(async function (response) {
                        console.log("response", response)
                        if (response.status == 200) {
                            if (response && response.data && typeof response.data !== "string") {
				
                                response.data.forEach(async indentor_data => {
                                    let stateCode = state.state_code
                                    let district_code = indentor_data.district_code?indentor_data.district_code: null
                                    if(indentor_data && indentor_data.sector){
                                        if((indentor_data.sector).toUpperCase() == 'PRIVATE COMPANY' || (indentor_data.sector).toUpperCase() == 'PRIVATE' || (indentor_data.sector).toUpperCase() == 'INDIVIDUAL') {
                                        // if((indentor_data.sector).toUpperCase() == 'PRIVATE COMPANY') {
                                            indentor_data['spaCode'] = (state.state_code).toString() + (indentor_data['spaCode']).toString()
                                        }
                                        
                                      let  stateData = await SeedUserManagement.getStateCode(indentor_data.sector);
					  
                                        if(stateData){
                                            stateCode = stateData.stateCode?stateData.stateCode:stateCode
                                            district_code = stateData.districtCode?stateData.districtCode:district_code
                                        }
                                        
                                    }
                                    // return;
                                    let data = await userModel.findOne({
                                        include: [
                                            {
                                                model: agencyDetailModel,
                                                left: true,
						                            where: {
                                                    // state_id: state.state_code
                                                    state_id: stateCode

                                                },
                                                attributes: [],
                                                where: {
                                                    // state_id: state.state_code
                                                    state_id: stateCode
        
                                                }
                                            },
                                            
                                        ],
                                        where: {
                                            spa_code: indentor_data['spaCode'],
                                            // state_id: state.state_code
                                            //state_id: stateCode

                                        },
                                        attributes: ['id'],
                                    });

                                    let newUserData;

                                    if (data) {
                                        console.log("User already exist");

                                        // const agency = await agencyDetailModel.findOne({
                                        //     where: {
                                        //         id: data.agency_id,
                                        //         state_code: state.state_code
                                        //     }
                                        // })

                                        // if (agency) {
                                        //     console.log("User already exist");

                                        // } else {
                                        //     newUserData = userModel.build({
                                        //         "name": indentor_data.spaName,
                                        //         "username": indentor_data.spaCode,
                                        //         "password": "123456",
                                        //         "user_type": "SPA",
                                        //         "mobile_number": indentor_data.ownerPhoneNumber,
                                        //         "email_id": "",
                                        //         "unm": indentor_data.spaCode,
                                        //         "spa_code": indentor_data.spaCode
                                        //     });
                                        // }

                                    } else {

                                        newUserData = userModel.build({
                                            "name": indentor_data.spaName,
                                            "username": indentor_data.spaCode,
                                            "password": "123456",
                                            "user_type": "SPA",
                                            "mobile_number": indentor_data.ownerPhoneNumber,
                                            "email_id": "",
                                            "unm": indentor_data.spaCode,
                                            "spa_code": indentor_data.spaCode
                                        });

                                        try {
                                            const result = await newUserData.save();

                                            if (result) {
                                                const agencyData = agencyDetailModel.build({
                                                    "user_id": result.id,
                                                    "agency_name": indentor_data.spaName,
                                                    // "state_id": state.state_code,
  					                                "actual_state_code":  state.state_code,
                                                    "state_id": stateCode, 
                                                    "district_id": district_code,
                                                    "short_name": "",
                                                    "contact_person_mobile": indentor_data.ownerPhoneNumber,
                                                    "mobile_number": indentor_data.ownerPhoneNumber,
                                                    "email_id": "",
                                                })

                                                try {
                                                    const agency_result = await agencyData.save();

                                                    if (agency_result) {
                                                        const updateUserData = await userModel.update({
                                                            agency_id: agency_result.id,
                                                        }, {
                                                            where: {
                                                                id: result.id,
                                                            }
                                                        })

                                                        if (!updateUserData) {
                                                            await userModel.destroy({
                                                                where: {
                                                                    id: result.id,
                                                                }
                                                            });

                                                            await userModel.destroy({
                                                                where: {
                                                                    id: agency_result.id,
                                                                }
                                                            });
                                                        }
                                                    }
                                                    else {
                                                        await userModel.destroy({
                                                            where: {
                                                                id: result.id,
                                                            }
                                                        });
                                                    }
                                                } catch (error) {
                                                    if (error) {
                                                        await userModel.destroy({
                                                            where: {
                                                                id: result.id,
                                                            }
                                                        });
                                                    }
                                                }

                                            }

                                        } catch (error) {
                                            console.log(error)
                                        }

                                    }
                                });

                            } else {
                                console.log(response.data)
                            }

                            resolve(response.data)
                        }

                    }).catch(function (error) {
                        console.log("Inside Error:", error)
                    })
                });

            // });

        }


    }

    static getStateCode = (sector) => {
        console.log('sectore', sector);
        switch (sector) {
            case 'NSC':
                return {"stateCode": 201, "districtCode": 20001}
            case 'DADF':
                return {"stateCode": 202, "districtCode": 20002}
            case 'HIL':
                return {"stateCode": 203, "districtCode": 20003}
            case 'IFFDC':
                return {"stateCode": 204, "districtCode": 20004}
            case 'IFFCO':
                return {"stateCode": 205, "districtCode": 20005}
            case 'KRIBHCO':
                return {"stateCode": 206, "districtCode": 20006}
            case 'KVSSL':
                return {"stateCode": 207, "districtCode": 20007}
            case 'NAFED':
                return {"stateCode": 208, "districtCode": 20008}
            case 'NDDB':
                return {"stateCode": 209, "districtCode": 20009}
            case 'NFL':
                return {"stateCode": 210, "districtCode": 20010}
            case 'NHRDF':
                return {"stateCode": 211, "districtCode": 20011}
            case 'SOPA PRIVATE':
                return {"stateCode": 212, "districtCode": 20012}
            case 'NSAI':
                return {"stateCode": 213, "districtCode": 20013}
            case 'PRIVATE':
                return {"stateCode": 213, "districtCode": 20013}
            case 'Private':
                return {"stateCode": 213, "districtCode": 20013}
            case 'Private Company':
                return {"stateCode": 213, "districtCode": 20013}
            case 'BBSSL':
                return {"stateCode": 214, "districtCode": 20014}
                
            default:
                return false
                break
        }

    }

    static inactiveUser = async (userData) => {

        const DEACTIVATEUSERAPI = process.env.DEACTIVATEUSERAPI;

        const httpsAgent = new https.Agent({ rejectUnauthorized: false });

        return new Promise((resolve, reject) => {
            axios({
                url: DEACTIVATEUSERAPI,
                method: 'POST',
                httpsAgent: httpsAgent,
                data: userData
            }).then(function (response) {
                if (response.status == 200) {
                    resolve(response.data)
                }

            }).catch(function (error) {
                console.log("Inside Error:", error)
            })
        });
    }
}
module.exports = SeedUserManagement;
