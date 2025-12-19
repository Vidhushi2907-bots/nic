const jwt = require('jsonwebtoken');
const status = require('../_helpers/status.conf')
const response = require('../_helpers/response')
const db = require("../models");
const Token = db.tokens;
const UserModel = db.userModel;
require('dotenv').config()

const auth = async (req, res, next)=>{
    try{
        const token = req.header('Authorization').replace('Bearer ', '')
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET)
        } catch (error) {
            console.error("JWT verification error:", error);
            return response(res, status.INVALID_TOKEN, 401);
        }
        if(!decoded) {
            return response(res, status.EXPIRE_TOKEN, 401)
        }

        //console.log(decoded, token)

        const userToken = await Token.findOne({ where: { user_id: decoded.id, token: token },attributes: ['*'], raw: true });
        const users = await UserModel.findOne({where: {id: decoded.id}, attributes:['*'], raw: true})

        //console.log(userToken, users)

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

        response(res, status.INVALID_TOKEN, 401)
    }
}

// const auth = async (req, res, next) => {
//     try {
//         const token = req.header('Authorization').replace('Bearer ', '')
//         console.log("token========", token);

//         let decoded;
//         try {
//             decoded = jwt.verify(token, process.env.JWT_SECRET)
//         } catch (error) {
//             console.error("JWT verification error:", error);
//             return response(res, status.INVALID_TOKEN, 401);
//         }

//         console.log("decoded========", decoded);

//         if (!decoded) {
//             return response(res, status.EXPIRE_TOKEN, 401);
//         }

//         const userToken = await Token.findOne({ where: { user_id: decoded.id, token }, attributes: ['*'], raw: true });
//         const users = await UserModel.findOne({ where: { id: decoded.id }, attributes: ['*'], raw: true });

//         if (!userToken || userToken.length === 0) {
//             return response(res, status.INVALID_TOKEN, 401);
//         } else {
//             req.body.loginedUserid = { ...users };
//             next();
//         }
//     } catch (error) {
//         console.error("Authentication error:", error);
//         response(res, status.INVALID_TOKEN, 401);
//     }
// }


module.exports = auth;
