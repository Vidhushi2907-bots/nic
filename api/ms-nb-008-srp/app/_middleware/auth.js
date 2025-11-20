const jwt = require('jsonwebtoken');
const status = require('../_helpers/status.conf')
const response = require('../_helpers/response')
const db = require("../models");
const Token = db.tokens;
const UserModel = db.userModel;
require('dotenv').config()
const agencyDetailModel = db.agencyDetailModel
const sequelize = require('sequelize');

const auth = async (req, res, next)=>{
    try{
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if(!decoded) {
            return response(res, status.EXPIRE_TOKEN, 401)
        }

        //console.log(decoded, token)

        const userToken = await Token.findOne({ where: { user_id: decoded.id, token: token },attributes: ['*'], raw: true });
//        const users = await UserModel.findOne({where: {id: decoded.id}, attributes:['*'], raw: true})
	       const users = await UserModel.findOne(		       	
                            {
                                where: {id: decoded.id},
                                    attributes:['*',
                                    [sequelize.col('agency_detail.state_id'), 'state_id'],
                                    ], 
                                raw: true,
                            
                                include:[
                                    {
                                    model:agencyDetailModel,
                                    attributes:['state_id']
                                }]
                            }
	       		        )


        // if(users)
        //     req.body = {...req.body, ...users}

        if(!userToken || userToken.length == 0){
            response(res, status.INVALID_TOKEN, 401)
        }else{
            // req.body.token = token
            // req.body.userid = userToken.user_id
            req.body.loginedUserid = {...users}
            next()
        }
    }catch(error){
	console.log("error", error)
        response(res, status.INVALID_TOKEN, 401)
    }
}

module.exports = auth;
