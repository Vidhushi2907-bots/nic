const tagPrint = require("../controllers/tag_print.controller.js");

require('dotenv').config()

const auth = require('../_middleware/auth.js');
module.exports = app => {
    // for reprint module
    app.post(`${process.env.MICRO_SERVICE}/api/get-reprint-tag-year`,auth,tagPrint.getReprintTagYear);
    app.post(`${process.env.MICRO_SERVICE}/api/get-reprint-tag-season`,auth,tagPrint.getReprintTagSeasonData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-reprint-tag-crop`,auth, tagPrint.getReprintTagCropData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-reprint-tag-variety`,auth,tagPrint.getReprintTagVarietyData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-reprint-tag-variety_line`,auth, tagPrint.getReprintTagVarietyLineData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-reprint-tag-lot-number`,auth, tagPrint.getReprintTagLotNoData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-reprint-tag-number`,auth, tagPrint.getReprintTagNumberData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-reprint-tag-resion-data`,auth, tagPrint.getReprintTagResionData);
    app.post(`${process.env.MICRO_SERVICE}/api/add-reprint-tag-data`,auth, tagPrint.addReprintTagData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-reprint-tag-data`,auth, tagPrint.getReprintTagData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-reprint-tag-no-list-data`,auth, tagPrint.getReprintTagNoListData);


    // for Approved
    app.post(`${process.env.MICRO_SERVICE}/api/get-approved-tag-year`, tagPrint.getApprovedTagYear);
    app.post(`${process.env.MICRO_SERVICE}/api/get-approved-tag-season`, tagPrint.getApprovedTagSeasonData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-approved-tag-crop`, tagPrint.getApprovedTagCropData);
    app.post(`${process.env.MICRO_SERVICE}/api/update-approved-tag`, tagPrint.aprrovedTag);
    app.post(`${process.env.MICRO_SERVICE}/api/get-approved-tag-variety`, tagPrint.getApprovedTagVariety);
    app.post(`${process.env.MICRO_SERVICE}/api/get-approved-tag-spp-data`, tagPrint.getApprovedTagSPPData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-approved-tag-no-data`,tagPrint.getApprovedTagNoData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-approved-lot-no-data`, tagPrint.getApprovedlotNoData);

     // for Lifting
     app.post(`${process.env.MICRO_SERVICE}/api/get-lifting-year`,auth, tagPrint.getLiftingYear);
     app.post(`${process.env.MICRO_SERVICE}/api/get-lifting-season`,auth, tagPrint.getLiftingSeasonData);
     app.post(`${process.env.MICRO_SERVICE}/api/get-lifting-crop-data`,auth, tagPrint.getLiftingCropData);
     app.post(`${process.env.MICRO_SERVICE}/api/get-lifting-variety`,auth, tagPrint.getLiftingVarietyData); 
     app.post(`${process.env.MICRO_SERVICE}/api/get-lifting-spa`,auth, tagPrint.getLiftingSpaData);
     app.post(`${process.env.MICRO_SERVICE}/api/get-lifting-indenter`,auth, tagPrint.getLiftingIndenterData);
     app.post(`${process.env.MICRO_SERVICE}/api/get-lifting-quantity-allocated`, tagPrint.getLiftingQtyAllocatedData); 
     app.post(`${process.env.MICRO_SERVICE}/api/get-lifting-table-data`,auth, tagPrint.getLiftingTableData); 
     app.post(`${process.env.MICRO_SERVICE}/api/get-lifting-tag-no`, tagPrint.getLiftingTagNo); 
     app.post(`${process.env.MICRO_SERVICE}/api/get-lifting-lot-no`, tagPrint.getLiftingLotNO);
    //  app.post(`${process.env.MICRO_SERVICE}/api/get-lifting-lot-details-no`,auth, tagPrint.getLiftingLotDetailsNO);
     
     // for generate-invoice
     app.post(`${process.env.MICRO_SERVICE}/api/get-generate-invoice-year`,auth, tagPrint.getGenerateInvoiceYear);
     app.post(`${process.env.MICRO_SERVICE}/api/get-generate-invoice-season`,auth, tagPrint.getGenerateInvoiceSeasonData);
     app.post(`${process.env.MICRO_SERVICE}/api/get-generate-invoice-crop-data`,auth, tagPrint.getGenerateInvoiceCropData);
     app.post(`${process.env.MICRO_SERVICE}/api/get-generate-invoice-table-data`,auth, tagPrint.getGenerateInvoiceTableData);

     // for generate invoice 
     app.post(`${process.env.MICRO_SERVICE}/api/get-generate-invoice-variety`, tagPrint.getGenerateInvoiceVariety);
     app.post(`${process.env.MICRO_SERVICE}/api/get-generate-invoice-indenter`, tagPrint.getGenerateInvoiceIndenter);
     app.post(`${process.env.MICRO_SERVICE}/api/get-generate-invoice-spa`,auth, tagPrint.getGenerateInvoiceSPA);
     app.post(`${process.env.MICRO_SERVICE}/api/get-generate-invoice-list`,auth, tagPrint.getGenerateInvoiceList);
     app.post(`${process.env.MICRO_SERVICE}/api/save-generate-invoice`, tagPrint.saveGenerateInvoice);



    //  for generate cetificate
    app.post(`${process.env.MICRO_SERVICE}/api/spa-generate-invoice`, tagPrint.spaGenerateInvoice);
    app.post(`${process.env.MICRO_SERVICE}/api/get-lifting-lot-no-data-v1`,auth, tagPrint.getLiftingLot);
     
    // reprint tag data
    app.post(`${process.env.MICRO_SERVICE}/api/get-reprint-all-tag-data`, tagPrint.getReprintAllTagData);

    };

