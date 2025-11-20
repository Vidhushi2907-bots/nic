const AES = require('./AES')

const response = (res, message, code, data=[], anyOtherData = {}) => {
    // res.send(
        //   AES.encryption(
        //     {
        //       status_code: code,
        //       message: message,
        //       data: data
        //     }
        //   )
        // );
        res.send({"EncryptedResponse":
            {
              status_code: code,
              message: message,
              data: data,
		...anyOtherData 
            }
        }
        );
}
module.exports = response;
