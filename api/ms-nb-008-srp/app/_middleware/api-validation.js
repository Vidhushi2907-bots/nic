const status = require('../_helpers/status.conf')
const response = require('../_helpers/response')
require('dotenv').config()

const apiValidation = async (req, res, next)=>{
    try{
        const token = req.header('Authorization').replace('Bearer ', '')
        const key =  process.env.API_SECRET_KEY
        if(key == token) {

            console.log("req.body.sector", req.body)

            if(req.body && req.body.sector && (req.body.sector).toUpperCase() == 'INDIVIDUAL'){
                req.body.sector = 'PRIVATE'
            }

            if(req.body && req.body.sector && ((req.body.sector).toUpperCase() == 'PRIVATE COMPANY' || (req.body.sector).toUpperCase() == 'PRIVATE')){
                // console.log("33333333333333", req.body)
                req.body.spa_code = (req.body.state_code).toString() + (req.body.spa_code).toString();
                // console.log("22222222222", req.body)
            }else if(req.query && req.query.sector && (indentor_data.sector).toUpperCase() == 'INDIVIDUAL'){
                req.body.sector = 'PRIVATE'
            }else if(req.query && req.query.sector && (req.query.sector.toUpperCase() == 'PRIVATE COMPANY' || req.query.sector.toUpperCase() == 'PRIVATE')){
                req.query.spa_code = (req.query.state_code).toString() + (req.query.spa_code).toString();
            }
                console.log("reqre111111111111111111111111q", req.body)
            next()
        }else{
            return response(res, status.EXPIRE_TOKEN, 401)
        }

    }catch(error){

        response(res, status.INVALID_TOKEN, 401)
    }
}

module.exports = apiValidation;
