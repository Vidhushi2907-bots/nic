const bspcNewFlow = require("../controllers/bspc_new_flow.controller.js");

require('dotenv').config()

const auth = require('../_middleware/auth.js');
module.exports = app => {
    app.post(`${process.env.MICRO_SERVICE}/api/get-bspc-willing-production`, auth,bspcNewFlow.getBspcWillingProduction);
    app.post(`${process.env.MICRO_SERVICE}/api/add-bspc-willing-production`,auth, bspcNewFlow.addBspcWillingProduction);
    app.post(`${process.env.MICRO_SERVICE}/api/delete-bspc-willing-production`,auth, bspcNewFlow.deleteBspcWillingProduction);  
    app.post(`${process.env.MICRO_SERVICE}/api/get-inventry-and-indent-data`,auth, bspcNewFlow.getInventryAndIndentData);  
    app.post(`${process.env.MICRO_SERVICE}/api/get-wiiling-produce-variety-data`, bspcNewFlow.getWiilingProduceVarietyData); 
    app.post(`${process.env.MICRO_SERVICE}/api/check-willing-produce-variety-availability`, bspcNewFlow.checkWillingProduceVarietyAvailability); 
    app.post(`${process.env.MICRO_SERVICE}/api/willing-produce-final-submit`, bspcNewFlow.willingProduceFinalSubmit);   
    app.post(`${process.env.MICRO_SERVICE}/api/check-willing-to-produce-crop-variety-availability`, bspcNewFlow.checkWillingToProduceCropVarietyAvailability);
    app.post(`${process.env.MICRO_SERVICE}/api/get-bspc-willing-production-socond`, bspcNewFlow.getBspcWillingProductionSecond);   
    // app.post(`${process.env.MICRO_SERVICE}/api/getWiilingProduceVarietyDataSecond`, bspcNewFlow.getWiilingProduceVarietyDataSecond);   
    // getWiilingProduceVarietyDataSecond
};

