const jwt = require('jsonwebtoken');
const status = require('../_helpers/status.conf')
const response = require('../_helpers/response')
const db = require("../models");
const Token = db.tokens;
const UserModel = db.userModel;
const Op = require('sequelize').Op;
require('dotenv').config()

const agent = async (req, res, next)=>{
    try{

        if(req.body.roleid == 5 || req.body.roleid == 6){
            next()
        }else {
            response(res, status.UNAUTHORIZED_USER, 401)
        }
    }catch(error){
        //console.log(error)
        response(res, status.INVALID_TOKEN, 401)
    }
}

module.exports = agent;
