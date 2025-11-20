const variety = require("../controllers/srp_variety_controller.js");
const auth = require('../_middleware/auth');
 
module.exports = app => {
    app.get(`${process.env.MICRO_SERVICE}/api/get-variety-details-data`, auth, variety.viewCropVariety)
    // app.post(`${process.env.MICRO_SERVICE}/api/update-variety`,variety.updateVariety);
    app.post(`${process.env.MICRO_SERVICE}/api/create-variety`, auth, variety.createVariety);
    app.get(`${process.env.MICRO_SERVICE}/api/get-crop-details-data`, variety.viewCrop)
    // app.delete(`${process.env.MICRO_SERVICE}/delete-variety`,auth, variety.deleteVariety);
 
 
};

