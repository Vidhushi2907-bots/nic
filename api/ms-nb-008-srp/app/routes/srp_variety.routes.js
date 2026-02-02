const variety = require("../controllers/srp_variety_controller.js");
const auth = require('../_middleware/auth');
 
module.exports = app => {
    // app.get(`${process.env.MICRO_SERVICE}/api/get-variety-details-data`, variety.viewCropVariety)
    // app.post(`${process.env.MICRO_SERVICE}/api/update-variety`,variety.updateVariety);
    // app.post(`${process.env.MICRO_SERVICE}/api/create-variety`, auth, variety.createVariety);
    app.get(`${process.env.MICRO_SERVICE}/api/get-crop-details`, variety.viewCrop)
    // app.delete(`${process.env.MICRO_SERVICE}/delete-variety`,auth, variety.deleteVariety);
    app.get(`${process.env.MICRO_SERVICE}/api/get-srp-variety-details`, variety.viewCropVariety)
 
    // new api for srp - variety wise 
    app.post(`${process.env.MICRO_SERVICE}/api/add-srp-variety`, variety.addSrpVariety);
    app.post(`${process.env.MICRO_SERVICE}/api/add-to-list-variety-data`, auth, variety.addToListVarietyData);
    app.get(`${process.env.MICRO_SERVICE}/api/add-to-list-variety-data-remove`, auth, variety.addToListVarietyDataRemove);
    app.post(`${process.env.MICRO_SERVICE}/api/submit-for-filling-variety-data-forword`, auth, variety.submitForFillingVarietyDataForword);
 
};
