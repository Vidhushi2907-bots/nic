// const users = require("../controllers/user.controller.js");
const crop = require("../controllers/srp_crop.controller.js");
const auth = require('../_middleware/auth');
// const apiValidation = require('../_middleware/api-validation');

// require('dotenv').config()

module.exports = app => {
    // app.post(`${process.env.MICRO_SERVICE}/api/web-login`, users.webLogin)

    // app.post(`${process.env.MICRO_SERVICE}/api/add-crop`, auth, users.addCrop)
    // app.get(`${process.env.MICRO_SERVICE}/api/get-crop-list`, auth, users.viewCrop)
    // app.post(`${process.env.MICRO_SERVICE}/api/get-crop-list`, auth, users.viewCrop)

    app.get(`${process.env.MICRO_SERVICE}/api/get-crop`,auth, crop.getCropWiseData)
    app.post(`${process.env.MICRO_SERVICE}/api/add-srp-crop-wise`,auth, crop.postSrpCropWiseData)
    app.post(`${process.env.MICRO_SERVICE}/api/get-srp-crop-wise`, auth,crop.getSrpCropWiseDraftData)
    app.post(`${process.env.MICRO_SERVICE}/api/get-srp-crop-group-wise`, auth,crop.getCropGroupData)
    app.patch(`${process.env.MICRO_SERVICE}/api/edit-srp-crop-wise/:id`,auth, crop.editSrpCropWiseData);
    app.delete(`${process.env.MICRO_SERVICE}/api/delete-srp-crop-wise/:id`,auth,  crop.deleteSrpCropWiseData);
    app.get(`${process.env.MICRO_SERVICE}/api/get-one-srp-crop-wise/:id`,auth,crop.findOneSrpCropWise);
};
