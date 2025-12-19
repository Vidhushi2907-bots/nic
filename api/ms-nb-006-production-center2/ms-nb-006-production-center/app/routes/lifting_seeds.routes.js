const liftingSeed = require("../controllers/lifting_seeds.controller.js");
const processedSeed = require("../controllers/processed_seed.controller.js");
const apiValidation = require('../_middleware/api-validation.js');

require('dotenv').config()

const auth = require('../_middleware/auth.js');
module.exports = app => {
    // for Lifting Seed module
    app.post(`${process.env.MICRO_SERVICE}/api/add-lifting-data`,auth,liftingSeed.addLiftingData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-lifting-data`,auth,liftingSeed.getLiftingData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-lifting-data1`, liftingSeed.getLiftingData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-lifting-lot-no-data`,liftingSeed.getLiftingLotNoData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-lifting-tag-no-data`,liftingSeed.getLiftingTagNoData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-lifting-additional-charges-data`,liftingSeed.getLiftingAdditionalChargesData);

    //Odisha SPA Module APIs
    app.post(`${process.env.MICRO_SERVICE}/api/get-invoice-payment-year`, apiValidation, processedSeed.getInvoicePaymentYear);
    app.post(`${process.env.MICRO_SERVICE}/api/get-invoice-payment-season`, apiValidation, processedSeed.getInvoicePaymentSeason);
    app.post(`${process.env.MICRO_SERVICE}/api/get-invoice-payment-crop`,  processedSeed.getInvoicePaymentCrop);
    app.post(`${process.env.MICRO_SERVICE}/api/get-invoice-payment-variety`,apiValidation, processedSeed.getInvoicePaymentVariety);
    app.post(`${process.env.MICRO_SERVICE}/api/get-invoice-payment-data`, apiValidation, processedSeed.getInvoicePaymentData);
    app.post(`${process.env.MICRO_SERVICE}/api/save-invoice-data`,apiValidation,  processedSeed.saveInvoiceData);
    app.post(`${process.env.MICRO_SERVICE}/api/update-invoice-data`,apiValidation, processedSeed.payInvoiceData);

    app.post(`${process.env.MICRO_SERVICE}/api/breeder-seed-lifting-year-data`, apiValidation, liftingSeed.getBreederSeedLiftingYearData);
    app.post(`${process.env.MICRO_SERVICE}/api/breeder-seed-lifting-season`, apiValidation, liftingSeed.getBreederSeedLiftingSeasonData);
    app.post(`${process.env.MICRO_SERVICE}/api/breeder-seed-lifting-crop-data`, apiValidation, liftingSeed.getBreederSeedLiftingCropData);
    app.get(`${process.env.MICRO_SERVICE}/api/filter-verity-data`, apiValidation, liftingSeed.getFilterVerityData);
    app.get(`${process.env.MICRO_SERVICE}/api/filter-bill-data`, apiValidation, liftingSeed.getFilterBillData);
    app.get(`${process.env.MICRO_SERVICE}/api/filter-agency-data`, apiValidation, liftingSeed.getFilterAgencyData);
    app.post(`${process.env.MICRO_SERVICE}/api/liffting-details-SPA-wise-data`, liftingSeed.getLiftingDetailsSPAListData);


    //for lifting of breeder seed
    // for generate-invoice
    app.post(`${process.env.MICRO_SERVICE}/api/get-lifting-breeder-seeds-year`,auth,liftingSeed.getLiftingBreederSeedsYear);
    app.post(`${process.env.MICRO_SERVICE}/api/get-lifting-breeder-seeds-season`, liftingSeed.getLiftingBreederSeedsSeasonData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-lifting-breeder-seeds-crop-data`, liftingSeed.getLiftingBreederSeedsCropData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-generate-invoice-table-data`, liftingSeed.getLiftingBreederSeedsTableData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-lifting-breeder-seeds-variety-data`, liftingSeed.getLiftingBreederSeedsVarietyData);

    // Chat Support Users
    app.post(`${process.env.MICRO_SERVICE}/api/get-chat-support-users`, liftingSeed.getChatSupportUsers); 
    app.post(`${process.env.MICRO_SERVICE}/api/save-chat-message`, liftingSeed.saveChatMessage);
    app.post(`${process.env.MICRO_SERVICE}/api/get-saved-messages`, liftingSeed.getSavedMessages);
    app.post(`${process.env.MICRO_SERVICE}/api/mark-messages-read`, liftingSeed.markReadMessages);
    app.post(`${process.env.MICRO_SERVICE}/api/get-unread-message-count`, liftingSeed.totalunreadMessages);
     
     // BSPC users 
     app.post(`${process.env.MICRO_SERVICE}/api/get-bspc-users`, liftingSeed.getBspcUsers); 

     app.post(`${process.env.MICRO_SERVICE}/api/get-lifting-self-year`,auth, liftingSeed.getLiftingSelfYear);
     app.post(`${process.env.MICRO_SERVICE}/api/get-lifting-self-season`,auth, liftingSeed.getLiftingSelfSeason);
     app.post(`${process.env.MICRO_SERVICE}/api/get-lifting-self-crop`,auth,  liftingSeed.getLiftingSelfCrop);    
     app.post(`${process.env.MICRO_SERVICE}/api/get-lifting-self-variety`,auth,  liftingSeed.getLiftingSelfVariety);
     app.post(`${process.env.MICRO_SERVICE}/api/get-lifting-self-spa-details`,auth, liftingSeed.getLiftingSelfSpaDetails);
     app.post(`${process.env.MICRO_SERVICE}/api/lifting-surplus-breeder-stock-details`,auth, liftingSeed.liftingSurplusBreederStockDetails);
     app.post(`${process.env.MICRO_SERVICE}/api/get-lifting-surplus-breeder-stock-details`, auth, liftingSeed.getliftingSurplusBreederStockDetails);
     app.post(`${process.env.MICRO_SERVICE}/api/get-lifting-surplus-breeder-spa-details`,auth, liftingSeed.getliftingSurplusBreederSpaDetails);
     app.post(`${process.env.MICRO_SERVICE}/api/get-lifting-surplus-breeder-variety`,  liftingSeed.getliftingSurplusBreederVariety);
     app.post(`${process.env.MICRO_SERVICE}/api/get-lifting-surplus-breeder-indenter`, liftingSeed.getliftingSurplusBreederIndenter);
     app.post(`${process.env.MICRO_SERVICE}/api/get-lifting-surplus-breeder-spa`, liftingSeed.getliftingSurplusBreederSpa);
    //  app.post(`${process.env.MICRO_SERVICE}/api/get-lifting-table-data`,auth, liftingSeed.getLiftingTableData); 
     app.post(`${process.env.MICRO_SERVICE}/api/get-lifting-direct-breeder-indenter`, liftingSeed.getliftingDirectBreederIndenter);
     app.post(`${process.env.MICRO_SERVICE}/api/get-direct-lifting-tag-no`,auth, liftingSeed.getDirectLiftingTagNo); 
     app.post(`${process.env.MICRO_SERVICE}/api/get-direct-lifting-lot-no`,auth, liftingSeed.getDirectLiftingLotNO);
     app.post(`${process.env.MICRO_SERVICE}/api/get-direct-lifting-table-data`,auth, liftingSeed.getDierctLiftingTableData);
     app.post(`${process.env.MICRO_SERVICE}/api/get-self-lifting-table-data`,auth, liftingSeed.getSelfLiftingTableData);
    // surplus indent
     app.post(`${process.env.MICRO_SERVICE}/api/get-surplus-indent-variety`,auth, liftingSeed.getSurplusIndentVariety);
     app.post(`${process.env.MICRO_SERVICE}/api/get-surplus-indent-details`,auth, liftingSeed.getSurplusIndentDetails);
     app.post(`${process.env.MICRO_SERVICE}/api/get-surplus-lifting-table-data`,auth, liftingSeed.getSurplusfLiftingTableData);
};