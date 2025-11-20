const crop = require("../controllers/srp_willingness.controller");
const auth = require('../_middleware/auth');
// const apiValidation = require('../_middleware/api-validation');

// require('dotenv').config()

module.exports = app => {
    // app.post(`${process.env.MICRO_SERVICE}/api/web-login`, users.webLogin)

    // app.post(`${process.env.MICRO_SERVICE}/api/add-crop`, auth, users.addCrop)
    // app.get(`${process.env.MICRO_SERVICE}/api/get-crop-list`, auth, users.viewCrop)
    // app.post(`${process.env.MICRO_SERVICE}/api/get-crop-list`, auth, users.viewCrop)

  
    app.post(`${process.env.MICRO_SERVICE}/api/srp-crop-willingness`, crop.postSrpCropWiseData)
    
};
