const db = require("../models");
const UserModel = db.userModel;
const fertilizerCompany = db.fertilizerCompany;
const productModel = db.productModel;
const specificationModel = db.specificationModel;
const impurityModel = db.impurityModel;
const productCountryModel = db.productCountryModel;
const attachmentsModel = db.attachmentsModel;
const trialsModel = db.trialsModel;
const trialLocationModel = db.trialLocationModel;
const instituteCropModel = db.instituteCropModel;
const commentsModel = db.commentsModel;
const commentAttachmentsModel = db.commentAttachmentsModel;
const cropTypeModel = db.cropTypeModel;
const cropsModel = db.cropsModel;
const meetingModel = db.meetingModel;
const historyModel = db.historyModel;
const moment = require('moment');
const productTypeModel = db.productTypeModel;
const physicalConditionModel = db.physicalConditionModel;
const cropDescriptionModel = db.cropDescriptionModel;
const cfcUserApplicationModel = db.cfcUserApplicationModel;
const nanoProductModel = db.nanoProductModel;
const nanoCropNameModel = db.nanoCropNameModel;
const nanoSpecificationModel = db.nanoSpecificationModel;
const nanoBioSafetyModel = db.nanoBioSafetyModel;
const biostimulantProductModel = db.biostimulantProductModel;
const customizedProductModel = db.customizedProductModel;
const customizedGradeModel = db.customizedGradeModel;
const customizedNutrientModel = db.customizedNutrientModel;
const stateModel = db.stateModel;
const districtModel = db.districtModel;
const subdistrictModel = db.subdistrictModel
const villageModel = db.villageModel;
const SAU_ICARModel = db.SAU_ICARModel;
const sequelize = require('sequelize');
const sendMail = require('../_helpers/mail')
var dateFormat = require('dateformat');
const jwt = require('jsonwebtoken');


require('dotenv').config()
const Op = require('sequelize').Op;
// const subdistrictModel = require("../models/subdistrict.model");
// const villageModel = require("../models/village.model");
const userRoleModel = db.userRoleModel;
//const SAU_ICARModel = require("../models/SAU_ICAR.model");
//const cropsModel = require("../models/crops.model");

class ProductService {
    static addProduct = async (response, companyId, ip) => {
      
        return true
    }


    static editProduct = async (response, pid) => {
       
        return true
    }

    static updateStatus = async (pid, status, officer_id, cfcList, ip, req) => {
     
        return true
    }
    static getCfcUsers = async (id, role_id) => {
        var data;
        //console.log(role_id);
        if (role_id == 6 || role_id == 7) {
            data = await cfcUserApplicationModel.findAll({
                where: {
                    application_id: id
                },
                include: [
                    { model: UserModel, include: [{ model: userRoleModel }] }
                ],
                raw: false
            });
        } else {
            data = await cfcUserApplicationModel.findAll({
                where: {
                    application_id: id
                },
                include: [{ model: UserModel, attributes: ['name'] }],
                raw: false
            });
        }

        return data
    }
    static updateStatus2 = async (pid, status, ip) => {
        var data;
        productModel.update({
            company_status: status
        }, {
            where: {
                id: pid
            }
        }).then(async (data) => {
            //console.log(data);
            const data1 = await productModel.findAll({
                where: {
                    id: pid
                },
                include: [{ model: UserModel, attributes: ['user_id', 'id'], required: false }]
            });
            //console.log(data1[0].dataValues.user.dataValues.id);
            historyModel.create({ msg: `Company Status updated for Product to ${status}`, ip: ip, application_id: pid, user_id: data1[0].dataValues.user.dataValues.id });
            data = data;
        }).catch((err) => {
            //console.log(err);
            data = null;
        })

        return data
    }
    static updateMeeting = async (pid, meeting, ip) => {
        var data;
        //console.log("###$$$", meeting);
        productModel.update({
            meeting_id: meeting.id
        }, {
            where: {
                id: pid
            }
        }).then(async (data) => {
            //console.log(data);
            meetingModel.update({
                agenda: meeting.agenda
            }, {
                where: {
                    id: meeting.id
                }
            })
            const data1 = await productModel.findAll({
                where: {
                    id: pid
                },
                include: [{ model: UserModel, attributes: ['user_id', 'id'], required: false }]
            });
            //console.log(data1[0].dataValues.user.dataValues.id);
            historyModel.create({ ip: ip, msg: `Meeting agenda updated`, application_id: meeting.id, user_id: data1[0].dataValues.user.dataValues.id });
            data = data;
        }).catch((err) => {
            //console.log(err);
            data = null;
        })

        return data
    }

    static getComment = async (id) => {
        const data = await commentsModel.findAll({
            where: {
                id: id
            },
            include: [commentAttachmentsModel],
            raw: false
        });

        return data
    }
    static updateComment = async (id, comment, status, attachments, ip) => {
        var data;
        commentsModel.update({
            comment: comment,
            status: status
        }, {
            where: {
                id: id
            }
        }).then(async (data) => {
            if (attachments.length) {
                //console.log(attachments);
                let arr = attachments;
                let all = await commentAttachmentsModel.findAll({
                    where: {
                        comment_id: id
                    },
                    raw: true
                });
                ////console.log(all);
                let arrFilter = arr.map(item => { return item.id; });
                var filter = all.filter(item => !arrFilter.includes(item.id));
                for (let i = 0; i < filter.length; i++) {
                    if (filter[i].id) {
                        commentAttachmentsModel.destroy({
                            where: {
                                id: filter[i].id
                            }
                        })
                    }
                }
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i].id) {
                        //console.log('update attachment');
                        commentAttachmentsModel.findOne({ where: { id: arr[i].id } })
                            .then(function (obj) {
                                // update
                                if (obj) {
                                    commentAttachmentsModel.update({
                                        url: arr[i].url
                                    }, {
                                        where: {
                                            id: arr[i].id,
                                        }
                                    });
                                }

                            })
                    }
                    else {
                        //console.log('new attachment');
                        // insert
                        commentAttachmentsModel.create({
                            comment_id: id,
                            url: arr[i].url
                        });
                    }
                }
            } else {
                commentAttachmentsModel.destroy({
                    where: {
                        comment_id: id
                    }
                })
            }
            historyModel.create({ msg: `Comment updated`, application_id: id, ip: ip });
            //console.log(data);
            data = data;
        }).catch((err) => {
            //console.log(err);
            data = null;
        })

        return data
    }

    static postComment = async (userId, pid, comment, status, attachments, ip) => {
        const data = await commentsModel.create({
            comment: comment,
            status: status,
            product_id: pid,
            user_id: userId
        }).then((comment1) => {
            if (attachments.length) {
                let arr = [];
                //console.log(attachments);
                attachments.forEach(el => {
                    arr.push({ url: el.url, comment_id: comment1.id })
                })
                commentAttachmentsModel.bulkCreate(arr);
            }
        })
        const data1 = await productModel.findAll({
            where: {
                id: pid
            },
            include: [{ model: UserModel, attributes: ['user_id', 'id'], required: false }]
        });
        //console.log(data1[0].dataValues.user.dataValues.id);
        historyModel.create({
            ip: ip,
            msg: `Comment added`,
            application_id: pid,
            user_id: data1[0].dataValues.user.dataValues.id,
            application_comment: comment,
        });
        return data
    }
}

module.exports = ProductService;
