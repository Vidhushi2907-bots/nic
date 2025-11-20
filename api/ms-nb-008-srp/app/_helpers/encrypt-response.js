const AES = require('../_helpers/AES')

const encryptResponse = (res, message, code, data=[]) => {
    res.send(
          AES.encryption(
            {
              status_code: code,
              message: message,
              data: data
            }
          )
        );
}
module.exports = encryptResponse;
