const CryptoJS = require('crypto-js')
const response = require('../_helpers/response')
const status = require('../_helpers/status.conf')
require('dotenv').config()
AES_KEY = process.env.AES_SECRET

const decryption = async (req, res, next) => {
    try{
        // //console.log('------------------Decr Start----------------')
        // if(req.body.EncryptedRequest){
        //   req.body = req.body.EncryptedRequest
        //   next();
        // }else {
        //   req.body
        //   next();
        // }
        // //console.log('------------------Decr End----------------')

          if(req.body && Object.keys(req.body).length && req.body.EncryptedRequest){
            const key = CryptoJS.enc.Utf8.parse(AES_KEY);
            const iv = CryptoJS.enc.Utf8.parse(AES_KEY);
            const base64Decoded = CryptoJS.AES.decrypt(
                      req.body.EncryptedRequest,
                      key, {
                                keySize: 128,
                                blockSize: 128,
                                iv: iv,
                                mode: CryptoJS.mode.CBC,
                                padding: CryptoJS.pad.Pkcs7
                            }
                ).toString(CryptoJS.enc.Utf8);

            decryptCode = JSON.parse(base64Decoded.toString())
            req.body = decryptCode
            next();
          }else{

             if(!Object.keys(req.body).length){
                 next();
             }else if(req.body && Object.keys(req.body).length && req.body.EncryptedApiRequest){
              next();
             } else{
                 return response(res, status.INSECURE_API_CALL, 500)
             }
          }
    } catch (error) {
        return response(res, error.message, 500)
    }

// return base64Decoded;
}

module.exports = decryption
