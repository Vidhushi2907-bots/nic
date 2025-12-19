const stlForms = require("../controllers/stl_form.controller.js");

require('dotenv').config()

const auth = require('../_middleware/auth.js');
module.exports = app => {
    app.post(`${process.env.MICRO_SERVICE}/api/get-seed-processing-register-year-data`, auth,stlForms.getSeedProcessingRegisterYearData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-seed-processing-register-season-data`, auth,stlForms.getSeedProcessingRegisterSeasonData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-seed-processing-register-crop-data`, auth,stlForms.getSeedProcessingRegisterCropData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-seed-processing-register-data`, auth,stlForms.getSeedProcessingRegisterData);
    app.post(`${process.env.MICRO_SERVICE}/api/add-generate-sample-slip-data`, auth,stlForms.addGenerateSampleSlipData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-generate-sample-slip-data`, auth,stlForms.getGenerateSampleSlipData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-generate-sample-slip-test-data`, stlForms.getGenerateSampleSlipTestData);
    app.post(`${process.env.MICRO_SERVICE}/api/seed-lab-test-list`, stlForms.seedLabTestsList);
    app.post(`${process.env.MICRO_SERVICE}/api/seed-testing-laboratory-list`, stlForms.seedTestingLaboratoryList);
    app.post(`${process.env.MICRO_SERVICE}/api/seed-testing-laboratory-list-state`, stlForms.seedTestingLaboratoryListstateby);
    
    app.post(`${process.env.MICRO_SERVICE}/api/get-generate-sample-slip-variety-data`, auth,stlForms.getGenerateSampleSlipVarietyData);

    // generate forwarding APi
    app.post(`${process.env.MICRO_SERVICE}/api/get-generate-sample-forwarding-slip-year-data`, auth,stlForms.getGenerateSampleForwardingSlipYearData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-generate-sample-forwarding-slip-season-data`, auth,stlForms.getGenerateSampleForwardingSlipSeasonData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-generate-sample-forwarding-slip-crop-data`, auth,stlForms.getGenerateSampleForwardingSlipCropData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-generate-sample-forwarding-data`, auth,stlForms.getGenerateSampleForwardingData);
    app.post(`${process.env.MICRO_SERVICE}/api/add-generate-sample-forwarding-slip-data`,auth,stlForms.addGenerateSampleForwardingData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-generate-sample-forwarding-slip-data`, auth,stlForms.getGenerateSampleForwardingData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-generate-sample-forwarding-slip-variety-data`, auth,stlForms.getGenerateSampleForwardingSlipVarietyData);
    app.post(`${process.env.MICRO_SERVICE}/api/seed-generate-forwarding-testing-laboratory-list`, stlForms.seedGenerateForwardingTestingLaboratoryList);
    app.post(`${process.env.MICRO_SERVICE}/api/get-generate-sample-forwarding-slip-data-second`, auth,stlForms.getGenerateSampleForwardingDataSecond);
    app.post(`${process.env.MICRO_SERVICE}/api/get-check-running-no`, stlForms.checkRunningNumber);
    

    // stl reports status apis
    app.post(`${process.env.MICRO_SERVICE}/api/get-stl-report-status-data`, auth,stlForms.getStlReportStatusData);
    // app.post(`${process.env.MICRO_SERVICE}/api/add-stl-report-status-data`,stlForms.addStlReportStatusData);
    app.post(`${process.env.MICRO_SERVICE}/api/add-stl-report-status-data`, stlForms.addStlReportStatusData);
    app.post(`${process.env.MICRO_SERVICE}/api/update-stl-report-status-data`, auth,stlForms.updateStlReportStatusData);

     // variety price list
     app.post(`${process.env.MICRO_SERVICE}/api/get-variety-list`, auth,stlForms.getAllVarietypListpriceLis);
     app.post(`${process.env.MICRO_SERVICE}/api/add-variety-price-list`, auth,stlForms.addVarietyPriceList);
     app.post(`${process.env.MICRO_SERVICE}/api/get-variety-price-list`, auth,stlForms.getVarietyPriceList);
     app.post(`${process.env.MICRO_SERVICE}/api/delete-variety-price-list`,auth, stlForms.deleteVarietyPriceList);
     app.post(`${process.env.MICRO_SERVICE}/api/get-variety-line-list`, auth,stlForms.getAllVarietyLineListforPrice);
     app.post(`${process.env.MICRO_SERVICE}/api/get-all-willing-bspc-list-data`,auth,stlForms.getAllWillingBspcListData);
     app.post(`${process.env.MICRO_SERVICE}/api/add-got-testing-data`,auth,stlForms.addGotTestingData);
     // got-report
     app.post(`${process.env.MICRO_SERVICE}/api/get-got-year`,auth,stlForms.getGotreportbspfiveyear);
     app.post(`${process.env.MICRO_SERVICE}/api/get-got-season`,auth,stlForms.getGotreportbspfiveSeason);
     app.post(`${process.env.MICRO_SERVICE}/api/get-got-crop`,auth,stlForms.getGotreportCrop);
     app.post(`${process.env.MICRO_SERVICE}/api/get-got-report-details`,auth,stlForms.getGotReportDetails);
     app.post(`${process.env.MICRO_SERVICE}/api/get-got-variety`,auth,stlForms.getGotreportVariety);
     app.post(`${process.env.MICRO_SERVICE}/api/get-forwording-bspc-list-data`,auth,stlForms.getBspcListDataForword);
     app.post(`${process.env.MICRO_SERVICE}/api/get-forwording-state-list-data`,auth,stlForms.getStateListDataForword);
     app.post(`${process.env.MICRO_SERVICE}/api/get-forwording-lab-list-data`,auth,stlForms.seedTestingLaboratoryListstateforforwording);

};

