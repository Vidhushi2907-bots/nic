const api = require("../controllers/api.controller.js");
const apiValidation = require('../_middleware/api-validation');
require('dotenv').config()
const auth = require('../_middleware/auth');

module.exports = app => {
    //indent of SPA's
    // Old API
    // app.post(`${process.env.MICRO_SERVICE}/api/indent-of-spa`, apiValidation,api.addIndentOfSpaData)
    // app.post(`${process.env.MICRO_SERVICE}/api/indent-of-spa/:id`, apiValidation, api.addIndentOfSpaData)
    // app.post(`${process.env.MICRO_SERVICE}/api/delete-indent-of-spa`, apiValidation, api.delteIndentOfSpaData)
    // app.post(`${process.env.MICRO_SERVICE}/api/get-indent-of-spa`, apiValidation, api.getIndentOfSpaData)
    // apiValidation
    // apiValidation
    app.post(`${process.env.MICRO_SERVICE}/api/indent-of-spa`, apiValidation, api.addIndentOfSpaDataHybrid)
    app.post(`${process.env.MICRO_SERVICE}/api/indent-of-spa/:id`, apiValidation, api.addIndentOfSpaDataHybrid)
    app.post(`${process.env.MICRO_SERVICE}/api/delete-indent-of-spa`, apiValidation, api.delteIndentOfSpaDataHybrid)
    app.post(`${process.env.MICRO_SERVICE}/api/get-indent-of-spa`, apiValidation, api.getIndentOfSpaDataHybrid)

    app.get(`${process.env.MICRO_SERVICE}/api/get-spa-allocation-details`, apiValidation, api.getSpaAllocationDetails);
    app.get(`${process.env.MICRO_SERVICE}/api/common/createUserFromIndentorData`, api.createUserFromIndentorData)
    app.get(`${process.env.MICRO_SERVICE}/api/check-indent-validation`, apiValidation, api.checkIndentValidation);
    app.get(`${process.env.MICRO_SERVICE}/api/assigned-inspection-list`, api.assignedInspectionList);

    // app.post(`${process.env.MICRO_SERVICE}/api/indent-of-spa-hybrid`, api.addIndentOfSpaDataHybrid)
    // app.post(`${process.env.MICRO_SERVICE}/api/indent-of-spa-hybrid/:id`, apiValidation, api.addIndentOfSpaDataHybrid)
    // app.post(`${process.env.MICRO_SERVICE}/api/delete-indent-of-spa-hybrid`, api.delteIndentOfSpaDataHybrid)
    // app.post(`${process.env.MICRO_SERVICE}/api/get-indent-of-spa-hybrid`, apiValidation, api.getIndentOfSpaDataHybrid)


    // new api for check-crop-freezed-status for udisha team
    app.post(`${process.env.MICRO_SERVICE}/api/check-crop-freezed-status`, apiValidation, api.checkCropFreezedStatus);


    //indent of SPA's Hybrid (26/02/2024)
    // app.post(`${process.env.MICRO_SERVICE}/api/indent-of-spa`, api.indentOfSpaData)
    // apiValidation
    app.post(`${process.env.MICRO_SERVICE}/api/indent-of-spa-hybrid`, api.addIndentOfSpaDataHybrid)
    app.post(`${process.env.MICRO_SERVICE}/api/indent-of-spa-hybrid/:id`, apiValidation, api.addIndentOfSpaDataHybrid)
    app.post(`${process.env.MICRO_SERVICE}/api/delete-indent-of-spa-hybrid`, api.delteIndentOfSpaDataHybrid)
    app.post(`${process.env.MICRO_SERVICE}/api/get-indent-of-spa-hybrid`, apiValidation, api.getIndentOfSpaDataHybrid)

    app.get(`${process.env.MICRO_SERVICE}/api/get-crop-list-data`, apiValidation, api.getCropListData);
    app.get(`${process.env.MICRO_SERVICE}/api/get-variety-list-data`, apiValidation, api.getVarietyListData);
    app.get(`${process.env.MICRO_SERVICE}/api/get-variety-line-list`, apiValidation, api.getVarietyLineData);
    app.get(`${process.env.MICRO_SERVICE}/api/get-bspc-list`, api.getBSPCList);

    // variety price list
    app.post(`${process.env.MICRO_SERVICE}/api/get-variety-list`, api.getAllVarietypList);
    app.post(`${process.env.MICRO_SERVICE}/api/get-variety-line-list`, api.getAllVarietyLineList);
    app.post(`${process.env.MICRO_SERVICE}/api/add-variety-price-list`, auth, api.addVarietyPriceList);
    app.post(`${process.env.MICRO_SERVICE}/api/get-variety-price-list`, auth, api.getVarietyPriceList);
    app.post(`${process.env.MICRO_SERVICE}/api/delete-variety-price-list`, api.deleteVarietyPriceList);

    app.get(`${process.env.MICRO_SERVICE}/api/get-variety-category-list`, apiValidation, api.getVarietyCategoryList)
    app.post(`${process.env.MICRO_SERVICE}/api/get-variety-chracterstics-details`, apiValidation, api.getVarietyChractersticsDetails)

    // new api for crop basic details
    // apiValidation
    app.get(`${process.env.MICRO_SERVICE}/api/get-crop-details`, apiValidation, api.getCropCharactersticsWithId);
    app.post(`${process.env.MICRO_SERVICE}/api/generate-prn`, api.printTag);
    app.get(`${process.env.MICRO_SERVICE}/api/get-indent-quantity`, api.getTotalIndentQuantity)


};

