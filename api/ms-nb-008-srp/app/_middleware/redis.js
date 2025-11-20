const status = require('../_helpers/status.conf')
const response = require('../_helpers/response')
const cacheKey = require('../_helpers/cache-key')
require('dotenv').config()
const url = require('url');
// const cache = require("../_middleware/cache")

const redis = async (req, res, next) => {  
    const q = url.parse(req.url, true);       
    const path = q.pathname
    const key  = cacheKey.returnkey(path, req.body)
    // cache.get(key, async(err, data) => {
    //     try {
    //         if (data && data !== null) {
    //             response(res, status.DATA_AVAILABLE, 200, JSON.parse(data))
    //         } else {
    //             next()
    //         }
    //     } catch(error) {
    //         //console.log(error)
    //         next()
    //         // response(res, status.UNEXPECTED_ERROR, 401)
    //     }
    // })    
}

module.exports = redis;
