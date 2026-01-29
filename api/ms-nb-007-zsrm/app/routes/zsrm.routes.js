const zsrm = require("../controllers/zsrm.controller");
const auth = require('../_middleware/auth');
const apiValidation = require('../_middleware/api-validation');

// const redis = require('../_middleware/redis');
require('dotenv').config()
module.exports = app => {
    //Crop and Variety
    app.get(`${process.env.MICRO_SERVICE}/api/get-all-crops`,auth,zsrm.getCropList);
    app.get(`${process.env.MICRO_SERVICE}/api/get-all-varieties`,auth,zsrm.getVarietyList);
    app.get(`${process.env.MICRO_SERVICE}/api/get-variety-data`,auth,zsrm.getVarietyData);
    app.get(`${process.env.MICRO_SERVICE}/api/get-user-state-code`,auth,zsrm.getUserStateCode)

    //ZSRM FS SEED
    app.post(`${process.env.MICRO_SERVICE}/api/add-req-fs`,auth,zsrm.saveZsrmReqFs);
    app.get(`${process.env.MICRO_SERVICE}/api/view-req-fs-all`,auth,zsrm.viewZsrmReqFsAll);
    app.get(`${process.env.MICRO_SERVICE}/api/view-req-fs/:id`,auth,zsrm.getZsrmReqFsById);
    app.get(`${process.env.MICRO_SERVICE}/api/view-req-fs-all-updated`,auth,zsrm.viewZsrmReqFsAllUpdated);
    app.get(`${process.env.MICRO_SERVICE}/api/view-req-fs-all-seed`,auth,zsrm.viewZsrmReqFsAllSD);
    app.get(`${process.env.MICRO_SERVICE}/api/view-req-fs-all-seed-crop`,auth,zsrm.viewZsrmReqFsAllSDCropWiseReport);
    app.get(`${process.env.MICRO_SERVICE}/api/view-req-fs-crop`,auth,zsrm.viewZsrmReqFsCrop);
    app.get(`${process.env.MICRO_SERVICE}/api/view-req-fs-crop-variety`,auth,zsrm.viewZsrmReqFsCropVariety);
    app.delete(`${process.env.MICRO_SERVICE}/api/delete-req-fs/:id`,auth,zsrm.deleteZsrmReqFsById);
    app.put(`${process.env.MICRO_SERVICE}/api/update-req-fs/:id`,auth,zsrm.updateZsrmReqFsById);
    app.put(`${process.env.MICRO_SERVICE}/api/finalise-req-fs`,auth,zsrm.finaliseZsrmReqFs);

    //ZSRM QS SEED
    // app.post(`${process.env.MICRO_SERVICE}/api/add-req-qs-dist`,auth,zsrm.addZsrmReqQsDistWise);
    app.post(`${process.env.MICRO_SERVICE}/api/add-req-qs`,auth,zsrm.addZsrmReqQsFinal);
    app.put(`${process.env.MICRO_SERVICE}/api/update-req-qs/:id`,auth,zsrm.updateZsrmReqQs);
    // app.put(`${process.env.MICRO_SERVICE}/api/update-req-qs-dist/:id`,auth,zsrm.updateZsrmReqQsDist);
    app.get(`${process.env.MICRO_SERVICE}/api/view-req-qs`,auth,zsrm.viewZsrmReqQs);
    // app.get(`${process.env.MICRO_SERVICE}/api/view-req-qs-dist`,auth,zsrm.viewZsrmReqQsDistWise);
    // app.delete(`${process.env.MICRO_SERVICE}/api/delete-req-qs-dist/:id`,auth,zsrm.deleteZsrmReqQsDistWise);
    app.delete(`${process.env.MICRO_SERVICE}/api/delete-req-qs/:id`,auth,zsrm.deleteZsrmReqQs);
    app.put(`${process.env.MICRO_SERVICE}/api/finalise-req-qs`,auth,zsrm.finaliseZsrmReqQs);

    //SRP
    app.post(`${process.env.MICRO_SERVICE}/api/add-srp`,auth,zsrm.addSrp);
    app.get(`${process.env.MICRO_SERVICE}/api/view-srp/:id`,auth,zsrm.viewSrpById); 
    app.get(`${process.env.MICRO_SERVICE}/api/view-srp-all`,auth,zsrm.viewSrpAll); 
    app.post(`${process.env.MICRO_SERVICE}/api/view-srp-master-all`,auth,zsrm.viewSrpAllMasterReport); 
    app.post(`${process.env.MICRO_SERVICE}/api/view-srp-crop-wise-summary`,auth,zsrm.viewSrpAllCropWiseSummary); 
    app.post(`${process.env.MICRO_SERVICE}/api/view-srp-crop-wise`,auth,zsrm.viewSrpAllCropWise); 
    app.delete(`${process.env.MICRO_SERVICE}/api/delete-srp/:id`,auth,zsrm.deleteSrp);
    app.put(`${process.env.MICRO_SERVICE}/api/update-srp/:id`,auth,zsrm.updateSrp);
    app.post(`${process.env.MICRO_SERVICE}/api/view-srp-all-seed-division`,auth,zsrm.viewSrpAllSD); 
    app.post(`${process.env.MICRO_SERVICE}/api/view-srp-crop-wise-seed-division`,auth,zsrm.viewSrpAllCropWiseSD); 
    app.post(`${process.env.MICRO_SERVICE}/api/view-srp-crop-wise-summary-seed-division`,auth,zsrm.viewSrpAllCropWiseSummarySD); 
    app.get(`${process.env.MICRO_SERVICE}/api/get-srp-year`,auth,zsrm.getSrpYear); 
    app.get(`${process.env.MICRO_SERVICE}/api/get-srp-season`,auth,zsrm.getSrpSeason); 
    app.get(`${process.env.MICRO_SERVICE}/api/get-srp-croptype`,auth,zsrm.getSrpCropType); 
    app.get(`${process.env.MICRO_SERVICE}/api/get-srp-year-sd`,auth,zsrm.getSrpYearSD); 
    app.get(`${process.env.MICRO_SERVICE}/api/get-srp-season-sd`,auth,zsrm.getSrpSeasonSD); 
    app.get(`${process.env.MICRO_SERVICE}/api/get-srp-croptype-sd`,auth,zsrm.getSrpCropTypeSD);
    app.get(`${process.env.MICRO_SERVICE}/api/get-srp-sd-ct-year-based`,auth,zsrm.getSrpCropTypeSDYearBased)
    app.get(`${process.env.MICRO_SERVICE}/api/get-srp-state`,auth,zsrm.getSrpStateSD); 
    app.get(`${process.env.MICRO_SERVICE}/api/get-srp-crop`,auth,zsrm.getSrpCrop);
    app.put(`${process.env.MICRO_SERVICE}/api/finalise-srp`,auth,zsrm.finaliseSrp);
    app.post(`${process.env.MICRO_SERVICE}/api/get-srp-dashboard-item-count`,auth,zsrm.dashboardSrpCardCount);
    app.post(`${process.env.MICRO_SERVICE}/api/get-srp-dashboard-crop-wise-data`,auth,zsrm.dashboardCropWiseData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-srp-dashboard-crop-variety-wise-data`,auth,zsrm.dashboardCropVarietyWiseData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-srp-dashboard-user-wise-data`,auth,zsrm.dashboardStateWiseData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-srp-dashboard-user-crop-wise-data`,auth,zsrm.dashboardStateCropWiseData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-srp-dashboard-pie-chart`,auth,zsrm.dashboardPieData);
    app.get(`${process.env.MICRO_SERVICE}/api/get-srp-status-report`,auth,zsrm.srpStatusReport);
    //SRR
    app.post(`${process.env.MICRO_SERVICE}/api/add-srr`,auth,zsrm.addSrr);
    app.get(`${process.env.MICRO_SERVICE}/api/view-srr`,auth,zsrm.viewSrrByYearCropSeedType); 
    app.get(`${process.env.MICRO_SERVICE}/api/view-srr-all`,auth,zsrm.viewSrrAll); 
    app.get(`${process.env.MICRO_SERVICE}/api/view-srr-all-report`,auth,zsrm.viewSrrAllReport); 
    app.put(`${process.env.MICRO_SERVICE}/api/update-srr/:id`,auth,zsrm.updateSrr);
  
    //ZSRMBSTOFS
    app.post(`${process.env.MICRO_SERVICE}/api/add-zsrm-bs-to-fs`,auth,zsrm.addZsrmBsToFs);
    app.delete(`${process.env.MICRO_SERVICE}/api/delete-zsrm-bs-to-fs/:id`,auth,zsrm.deleteZsrmBsToFs);
    app.put(`${process.env.MICRO_SERVICE}/api/update-zsrm-bs-to-fs/:id`,auth,zsrm.updateZsrmBsToFs);
    app.get(`${process.env.MICRO_SERVICE}/api/view-zsrm-bs-to-fs-all`,auth,zsrm.viewZsrmBsToFs); 

    //ZSRMFSTOCS
    app.post(`${process.env.MICRO_SERVICE}/api/add-zsrm-fs-to-cs`,auth,zsrm.addZsrmFsToCs);
    app.delete(`${process.env.MICRO_SERVICE}/api/delete-zsrm-fs-to-cs/:id`,auth,zsrm.deleteZsrmFsToCs);
    app.put(`${process.env.MICRO_SERVICE}/api/update-zsrm-fs-to-cs/:id`,auth,zsrm.updateZsrmFsToCs);
    app.get(`${process.env.MICRO_SERVICE}/api/view-zsrm-fs-to-cs-all`,auth,zsrm.viewZsrmFsToCs); 

    //ZSRMCSQDSeedDistribution
    app.post(`${process.env.MICRO_SERVICE}/api/add-zsrm-cs-qs-dist`,auth,zsrm.addZsrmCsQsDist);
    app.delete(`${process.env.MICRO_SERVICE}/api/delete-zsrm-cs-qs-dist/:id`,auth,zsrm.deleteZsrmCsQsDist);
    app.put(`${process.env.MICRO_SERVICE}/api/update-zsrm-cs-qs-dist/:id`,auth,zsrm.updateZsrmCsQsDist);
    app.get(`${process.env.MICRO_SERVICE}/api/view-zsrm-cs-qs-dist/:id`,auth,zsrm.viewZsrmCsQsDistSingle)
    app.get(`${process.env.MICRO_SERVICE}/api/view-zsrm-cs-qs-dist-all`,auth,zsrm.viewZsrmCsQsDist); 
    app.get(`${process.env.MICRO_SERVICE}/api/get-zsrm-cs-qs-dist-year`,auth,zsrm.getZsrmCsQsDistYear); 
    app.get(`${process.env.MICRO_SERVICE}/api/get-zsrm-cs-qs-dist-season`,auth,zsrm.getZsrmCsQsDistSeason); 
    app.get(`${process.env.MICRO_SERVICE}/api/get-zsrm-cs-qs-dist-croptype`,auth,zsrm.getZsrmCsQsDistCropType); 
    app.get(`${process.env.MICRO_SERVICE}/api/get-zsrm-cs-qs-dist-year-sd`,auth,zsrm.getZsrmCsQsDistYearSD); 
    app.get(`${process.env.MICRO_SERVICE}/api/get-zsrm-cs-qs-dist-season-sd`,auth,zsrm.getZsrmCsQsDistSeasonSD); 
    app.get(`${process.env.MICRO_SERVICE}/api/get-zsrm-cs-qs-dist-croptype-sd`,auth,zsrm.getZsrmCsQsDistCropTypeSD);
    app.get(`${process.env.MICRO_SERVICE}/api/get-zsrm-cs-qs-dist-croptype-sd-year-based`,auth,zsrm.getZsrmCsQsDistCropTypeSDYearBased)
    app.get(`${process.env.MICRO_SERVICE}/api/get-zsrm-cs-qs-dist-state`,auth,zsrm.getZsrmCsQsDistStateSD); 
    app.get(`${process.env.MICRO_SERVICE}/api/get-zsrm-cs-qs-dist-crop`,auth,zsrm.getZsrmCsQsDistCrop);
    app.post(`${process.env.MICRO_SERVICE}/api/get-zsrm-cs-qs-dist-data`,auth,zsrm.getZsrmCsQsDistData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-zsrm-cs-qs-dist-data-sd`,auth,zsrm.getZsrmCsQsDistDataSeedDiv);
    app.post(`${process.env.MICRO_SERVICE}/api/get-zsrm-cs-qs-dist-data-cropwise-sd`,auth,zsrm.getZsrmCsQsDistDataCropWiseSeedDiv);
    app.put(`${process.env.MICRO_SERVICE}/api/finalise-cs-qs-dist`,auth,zsrm.finaliseZsrmCsQsDist);
     //ZSRMCSFSAREA
     app.post(`${process.env.MICRO_SERVICE}/api/add-zsrm-cs-fs-area`,auth,zsrm.addZsrmCsFsArea);
     app.delete(`${process.env.MICRO_SERVICE}/api/delete-zsrm-cs-fs-area/:id`,auth,zsrm.deleteZsrmCsFsArea);
     app.put(`${process.env.MICRO_SERVICE}/api/update-zsrm-cs-fs-area/:id`,auth,zsrm.updateZsrmCsFsArea);
     app.get(`${process.env.MICRO_SERVICE}/api/view-zsrm-cs-fs-area-all`,auth,zsrm.viewZsrmCsFsArea); 

};