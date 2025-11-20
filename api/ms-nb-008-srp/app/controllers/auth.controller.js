require('dotenv').config()
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const response = require('../_helpers/response')
const status = require('../_helpers/status.conf')
const db = require("../models");
const authHistoryModel= db.authHistoryModel;
const AES = require("../_helpers/AES")

const Token = db.tokens;

class AuthController {
  static logOutAllDevice = async (req, res) => {
    if (!req.body) {
      return response(res, status.REQUEST_DATA_MISSING, 400)
    }
    const { userid, token } = req.body;
    try {
      await Token.destroy({
          where: {
              user_id: userid
          }
      })
      return response(res, status.LOG_OUT_ALL_DEVICE, 200)
    } catch(error) {
      //console.log("error", error)
      return response(res, status.UNEXPECTED_ERROR, 500)
    }
  }

  static logOut = async (req, res) => {

    if (!req.body) {
      return response(res, status.REQUEST_DATA_MISSING, 400)
    }

    const { userid, ip } = req.body;
    try {
      await Token.destroy({
          where: {
              user_id: userid
          }
      })
      authHistoryModel.create({user_id: userid,ip:ip,auth_status:'logout success',logout_datetime:new Date(),action_type:'logout'});
      return response(res, status.LOG_OUT, 200)
    } catch(error) {
      //console.log("error", error)
      authHistoryModel.create({user_id: userid,ip:ip,auth_status:'server error',logout_datetime:new Date(),action_type:'logout'});
      return response(res, status.UNEXPECTED_ERROR, 500)
    }
  }

  static decrypt = async(req, res) =>{
    const { param } = req.body
    const data = AES.cscDecryption(param)
    // //console.log(AES.cscDecryption('aHhHWU0M6qU0GI+ZfGNjJ/VGjEUABjTWMe6HOePFrA6LfvTNbmzXpJher54LUsikBw43ifiUqbdQemPIZaGCzg=='))
    res.send(
      {
        status_code: 200,
        data: data
      }
    );
  }
  
  static encrypt = async(req, res) =>{
    const { param } = req.body
    const data = AES.cscEncryption(param)
    res.send(
      {
        status_code: 200,
        data: data
      }
    );
  }
}

module.exports = AuthController
