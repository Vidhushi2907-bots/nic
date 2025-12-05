const crop = require("../controllers/srp_willingness.controller");
const auth = require('../_middleware/auth');
// const apiValidation = require('../_middleware/api-validation');

// require('dotenv').config()

module.exports = app => {
    // app.post(`${process.env.MICRO_SERVICE}/api/web-login`, users.webLogin)

    // app.post(`${process.env.MICRO_SERVICE}/api/add-crop`, auth, users.addCrop)
    // app.get(`${process.env.MICRO_SERVICE}/api/get-crop-list`, auth, users.viewCrop)
    // app.post(`${process.env.MICRO_SERVICE}/api/get-crop-list`, auth, users.viewCrop)


    app.post(`${process.env.MICRO_SERVICE}/api/srp-year-willingness`, auth, crop.getSrpWillingnessYearData);
    app.post(`${process.env.MICRO_SERVICE}/api/srp-season-willingness`, auth, crop.getSrpWillingnessSeasonData);
    app.post(`${process.env.MICRO_SERVICE}/api/srp-crop-willingness`, auth, crop.getSrpWillingnessCropData);
    app.post(`${process.env.MICRO_SERVICE}/api/srp-variety-willingness`, auth, crop.getSrpWillingnessVarietyData);
    app.post(`${process.env.MICRO_SERVICE}/api/srp-variety-wise-indentor-list`,auth,crop.getSrpWillingnessIndentorName);
     app.get(`${process.env.MICRO_SERVICE}/api/get-variety-details`,auth,crop.getVarietyData);
    app.post(`${process.env.MICRO_SERVICE}/api/srp-add-willingness`,auth,crop.postSrpWillingnessData);
    app.get(`${process.env.MICRO_SERVICE}/api/srp-willingness-replace-variety`,auth,crop.deleteSrpWillingnessRepalce)
    app.get(`${process.env.MICRO_SERVICE}/api/srp-willingness-variety`,auth,crop.deleteSrpWillingness)
//    app.post(`${process.env.MICRO_SERVICE}/api/srp-variety-willingness`, auth, crop.getSrpWillingnessDetails);
};
