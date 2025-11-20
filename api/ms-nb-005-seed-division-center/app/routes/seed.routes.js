const seed = require("../controllers/seed.controller.js");
const auth = require('../_middleware/auth');
const multer = require("multer");
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage })

const PATH = './public';
let storage = multer.diskStorage({
  destination: (req, auth,  file, cb) => {
    cb(null, PATH);
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now())
  }
});
const upload = multer({
  storage: storage
});

require('dotenv').config()

module.exports = app => {

  app.post(`${process.env.MICRO_SERVICE}/api/get-add-crop-details`, auth,  seed.breederSeedssubmision);
  app.post(`${process.env.MICRO_SERVICE}/api/get-add-crop-details/:id`, auth,  seed.breederSeedssubmision);
  app.post(`${process.env.MICRO_SERVICE}/api/get-breeder-seeds-submission/:id`, auth,  seed.getBreederSeedssubmisionWithId);
  app.post(`${process.env.MICRO_SERVICE}/api/get-croup-Group-details`, auth,  seed.getCroupGroupDeatils);
  app.post(`${process.env.MICRO_SERVICE}/api/get-seed-multiplication-croup-Group-details`,  seed.getSeedMultiplicationCroupGroupDeatils);

  
  app.post(`${process.env.MICRO_SERVICE}/api/get-season-details`, auth, seed.getSeasonDetails);
  app.post(`${process.env.MICRO_SERVICE}/api/indentor-list`, auth,  seed.indentorList);
  app.get(`${process.env.MICRO_SERVICE}/api/get-designation`, auth,  seed.getDesignation);
  app.post(`${process.env.MICRO_SERVICE}/api/add-indentor`, auth,  seed.addIndentor);
  app.post(`${process.env.MICRO_SERVICE}/api/update-indentor`, auth,  seed.updateIndentor);
  app.post(`${process.env.MICRO_SERVICE}/api/update-add-crop-characterstics`, auth, seed.updateAddBreederCharacterstics);
  app.post(`${process.env.MICRO_SERVICE}/api/get-breeder-list/:id`, auth,  seed.getBreederWithId);
  app.post(`${process.env.MICRO_SERVICE}/api/getCropDataByGroupCode`, auth,  seed.getCropDataByGroupCode);

  app.post(`${process.env.MICRO_SERVICE}/api/add-indentor/:id`, auth,  seed.addIndentor);
  app.post(`${process.env.MICRO_SERVICE}/api/indentor-list`, auth,  seed.indentorList)
  app.post(`${process.env.MICRO_SERVICE}/api/view-indentor`, auth,  seed.viewIndentor);
  app.post(`${process.env.MICRO_SERVICE}/api/delete-crop-details/:id`, auth,  seed.deleteCropDetails);
  app.post(`${process.env.MICRO_SERVICE}/api/delete-breeder/:id`, auth,  seed.deleteBreederSeedssubmisionWithId);
  app.post(`${process.env.MICRO_SERVICE}/api/view-seed-multiplications`, auth,  seed.viewSeedMuliplicationRatio);
  app.post(`${process.env.MICRO_SERVICE}/api/view-seed-multiplications-by-cropcode`, auth,  seed.viewSeedMuliplicationRatioByCropCode);

  app.post(`${process.env.MICRO_SERVICE}/api/filter-crop-list-data`, auth,  seed.getTransactionsDetails);
  app.post(`${process.env.MICRO_SERVICE}/api/filter-add-breeder-list-data`, auth,  seed.getbreederList);
  app.post(`${process.env.MICRO_SERVICE}/api/get-dynamic-variety-code`, auth,  seed.getDynamicVarietyCode);
  app.post(`${process.env.MICRO_SERVICE}/api/get-dynamic-crop-code`, auth,  seed.getDynamicCropCode);
  app.post(`${process.env.MICRO_SERVICE}/api/check-already-exists-crop-code`, auth,  seed.checkAlreadyExistsCropCode);
  app.post(`${process.env.MICRO_SERVICE}/api/check-already-exists-variety-name`, auth,  seed.checkAlreadyExistsVarietyName);
  app.post(`${process.env.MICRO_SERVICE}/api/get-crop-vairety-characteristics`, auth,  seed.getCropVarietyCharacteristics);
  app.post(`${process.env.MICRO_SERVICE}/api/add-crop-vairety-characteristics`, auth,  seed.addCropVarietyCharacteristics);
  app.post(`${process.env.MICRO_SERVICE}/api/get-crop-code`, auth,  seed.getCropCode);

  app.get(`${process.env.MICRO_SERVICE}/api/get-agency-details`, auth,  seed.getAgencyDetails);
  app.get(`${process.env.MICRO_SERVICE}/api/test`, seed.test)

  // crop max size lot
  app.post(`${process.env.MICRO_SERVICE}/api/add-crop-max-lot-size-data`, auth,  seed.addCropMaxLotSizeData);
  app.post(`${process.env.MICRO_SERVICE}/api/update-crop-max-lot-size-data`, auth,  seed.updateCropMaxLotSizeData);
  app.post(`${process.env.MICRO_SERVICE}/api/get-crop-max-lot-size-data`, auth,  seed.getCropMaxLotSizeData);
  app.get(`${process.env.MICRO_SERVICE}/api/get-crop-max-lot-size-data-by-crop-code/:id`,  seed.getCropMaxLotSizeDataByCropCode);
  app.post(`${process.env.MICRO_SERVICE}/api/delete-crop-max-lot-size-data/:id`, auth,  seed.deleteCropMaxLotSizeData);

  app.post(`${process.env.MICRO_SERVICE}/api/update-status-crop-max-lot-size-data`, auth,  seed.updateStatusCropMaxLotSizeData);

  //lab test
  app.post(`${process.env.MICRO_SERVICE}/api/add-lab-test-data`,auth,   seed.addLabTestData);
  app.post(`${process.env.MICRO_SERVICE}/api/update-lab-test-data`, auth,  seed.updateLabTestData);
  app.post(`${process.env.MICRO_SERVICE}/api/get-lab-test-data`, auth,  seed.getLabTestData);
  app.post(`${process.env.MICRO_SERVICE}/api/getLabTestDataforSeedTesting`, auth,  seed.getLabTestDataforSeedTesting);
  app.post(`${process.env.MICRO_SERVICE}/api/get-lab-test-name-data`,  auth, seed.getLabTestNameData);
  app.post(`${process.env.MICRO_SERVICE}/api/delete-lab-test-data/:id`, auth,  seed.deleteLabTestData);

  //updateStatusLabTestData
  app.post(`${process.env.MICRO_SERVICE}/api/update-status-lab-test-data`, auth,  seed.updateStatusLabTestData);

  app.post(`${process.env.MICRO_SERVICE}/api/submit-data-characterstics`, auth,seed.addCropCharacteristics);
  app.post(`${process.env.MICRO_SERVICE}/api/submit-data-characterstics/:id`, auth,  seed.addCropCharacteristics);
  app.post(`${process.env.MICRO_SERVICE}/api/delete-data-characterstics/:id`, auth,  seed.deleteCropCharactersticsDetails);
  app.post(`${process.env.MICRO_SERVICE}/api/data-characterstics-list`,  seed.addCropCharacteristicsList);
  app.post(`${process.env.MICRO_SERVICE}/api/data-characterstics-list-data-with-dynamic-filed`,  seed.addCropCharacteristicsListWithDynamicField);

  app.post(`${process.env.MICRO_SERVICE}/api/data-characterstics-list/:id`,  seed.getCropCharactersticsWithId);
  app.post(`${process.env.MICRO_SERVICE}/api/filter-add-characterstics-list`, auth,  seed.getAddCropCharacterDetails);

  //seed multiplication ratio

  app.post(`${process.env.MICRO_SERVICE}/api/get-seed-multiplication-ratio-crop-data`, auth,  seed.getseedMultRatioSeedCropData);
  app.post(`${process.env.MICRO_SERVICE}/api/add-seed-multiplication-ratio-data`, auth,  seed.addSeedMultiplicationRatioData);
  app.post(`${process.env.MICRO_SERVICE}/api/update-seed-multiplication-ratio-data`, auth,  seed.updateSeedMultiplicationRatioData);
  app.post(`${process.env.MICRO_SERVICE}/api/get-seed-multiplication-ratio-data`, auth,  seed.getSeedMultiplicationRatioData);
  app.post(`${process.env.MICRO_SERVICE}/api/delete-seed-multiplication-ratio-data/:id`, auth,  seed.deleteSeedMultiplicationRatioData);

  //Maximum Lot Size for Each Crop(Seed Division Report)
  app.post(`${process.env.MICRO_SERVICE}/api/getCropMaxLotSizeDataforReports`, auth,  seed.getCropMaxLotSizeDataforReports);

  //Seed Testing Laboratory(Seed Division Report)
  app.post(`${process.env.MICRO_SERVICE}/api/getSeedTestingLabDataforReports`, auth,  seed.getSeedTestingLabDataforReports);
  app.post(`${process.env.MICRO_SERVICE}/api/getSeedTestingLabDataforReports`, auth,  seed.getSeedTestingLabDataforReports);


  //seed multiplication ratio delete status update
  app.post(`${process.env.MICRO_SERVICE}/api/update-status-seed-multiplication-ratio-data`, auth,  seed.updateStatusSeedMultiplicationRatioData);

  app.post(`${process.env.MICRO_SERVICE}/api/get-agency-details-name-distinct`, auth,  seed.getAgencyDetailsName);
  app.post(`${process.env.MICRO_SERVICE}/api/get-bank-details`, auth,  seed.getBankNameDetails);
  app.post(`${process.env.MICRO_SERVICE}/api/get-branch-details-details`, auth,  seed.getBankBranchNameDetails);

  app.post(`${process.env.MICRO_SERVICE}/api/get-ifsc-code-details`, auth,  seed.getIfscCodeDetails);
  app.post(`${process.env.MICRO_SERVICE}/api/get-variety-code-details`, auth,  seed.getVarietyDataDetails);

  app.post(`${process.env.MICRO_SERVICE}/api/submit-season-value`, auth,  seed.addSeasonValue);

  app.post(`${process.env.MICRO_SERVICE}/api/get-variety-code-data`, auth,  seed.getvarietCode);

  app.post(`${process.env.MICRO_SERVICE}/api/get-district-minmax-latitute`, auth, seed.getDistrictLatLong);
  app.post(`${process.env.MICRO_SERVICE}/api/get-dynamic-variety-code-characterstics`, seed.getDynamicVarietyCodeCharacterstics);

  app.post(`${process.env.MICRO_SERVICE}/api/add-state-characterstics`, auth,  seed.addStateCharacterstics);
  app.post(`${process.env.MICRO_SERVICE}/api/freeze-indent-breeder-seed-data`,   seed.freezeIndentBreederSeedData);

  app.post(`${process.env.MICRO_SERVICE}/api/freeze-indents-breeder-seeds-report`, auth,  seed.freezeIndentBreederSeedReport);

  app.get(`${process.env.MICRO_SERVICE}/api/download-image`, auth,  seed.download);
  app.post(`${process.env.MICRO_SERVICE}/api/upload-image`, auth,  seed.upload); // upload.single('name'), auth, 


  app.post(`${process.env.MICRO_SERVICE}/api/get-data`, auth,  seed.getData);
  app.post(`${process.env.MICRO_SERVICE}/api/check-crop-name-already`, auth,  seed.checkAlreadyExistsCropName);

  app.post(`${process.env.MICRO_SERVICE}/api/check-variety-name-already`, auth,  seed.checkAlreadyExistsVarietyNames);
  app.post(`${process.env.MICRO_SERVICE}/api/check-max-lot-size-already`, auth,  seed.checkAlreadyExistsMaxLotSize);
  app.post(`${process.env.MICRO_SERVICE}/api/check-crop-name-in-seed-labrotary-already`, auth,  seed.checkCropNameinSeedLabrotary);
  app.get(`${process.env.MICRO_SERVICE}/api/get-insitution-data`,  seed.getInsitutionData);

  //check already exist data
  app.post(`${process.env.MICRO_SERVICE}/api/check-already-exists-seed-multiplication-ratio-data`, auth,  seed.checkAlreadyExistsSeedMultiplicationRatioData)
  app.post(`${process.env.MICRO_SERVICE}/api/check-already-exists-seed-multiplication-ratio-data-second`, auth,  seed.checkAlreadyExistsSeedMultiplicationRatioDataSecond)
  app.post(`${process.env.MICRO_SERVICE}/api/check-indentor-crop-variety-data`, auth,  seed.getCropIndentorVerietyList)
  app.post(`${process.env.MICRO_SERVICE}/api/check-indentor-crop-data`, auth,  seed.getCropIndentorCropList)
  app.post(`${process.env.MICRO_SERVICE}/api/get-seed-multiplication-data-second`, auth,  seed.getSeedMultiplicationRatioDataSecond)
 
  app.post(`${process.env.MICRO_SERVICE}/api/get-dashboard-item-count`, auth,  seed.getDashboardItemCount);
  app.get(`${process.env.MICRO_SERVICE}/api/find-latest-year-season`,  seed.findLatestYearAndSeasons);
  app.post(`${process.env.MICRO_SERVICE}/api/get-total-indent`, auth,  seed.totalIndent);
  app.post(`${process.env.MICRO_SERVICE}/api/get-total-lifted-count`, auth,  seed.getTotalLiftedCount);
  app.post(`${process.env.MICRO_SERVICE}/api/get-filter-data`, auth, seed.getIndenterDetails);
  app.post(`${process.env.MICRO_SERVICE}/api/get-indeter-details`, auth,  seed.getIndenterDetails);
  app.post(`${process.env.MICRO_SERVICE}/api/get-variety`, auth,  seed.getVariety);
  app.post(`${process.env.MICRO_SERVICE}/api/get-chart-indent-crop-wise`, auth,  seed.getChartIndentCropWise);
  app.post(`${process.env.MICRO_SERVICE}/api/get-chart-indent-crop-wise-crop-list`, auth,  seed.getChartIndentCropWiseCropList);
  app.post(`${process.env.MICRO_SERVICE}/api/get-chart-indent-crop-to-variety-wise`, auth,  seed.getChartIndentCropToVarietieWise);
  app.post(`${process.env.MICRO_SERVICE}/api/get-chart-indent-data-variety`, auth,  seed.getChartIndentDataVariety);

  app.post(`${process.env.MICRO_SERVICE}/api/get-chart-data-by-crop`, auth,  seed.getChartDataByCrop)
  app.post(`${process.env.MICRO_SERVICE}/api/get-seed-testing-crop-name`,  seed.getLabDistrictNameData)
  app.post(`${process.env.MICRO_SERVICE}/api/get-cordinator-district`,auth,  seed.getCordinatorDistrict)
  app.post(`${process.env.MICRO_SERVICE}/api/get-chart-data-by-crop`, auth,  seed.getChartDataByCrop);
  app.post(`${process.env.MICRO_SERVICE}/api/get-chart-all-indentor`, auth,  seed.getChartAllIndentor);
  app.post(`${process.env.MICRO_SERVICE}/api/get-chart-all-indentor-variety`, auth,  seed.getChartAllIndentorVariety);

  app.post(`${process.env.MICRO_SERVICE}/api/get-total-allocate-lifting-count`, auth,  seed.getTotalAllocateLiftingCount);
  app.post(`${process.env.MICRO_SERVICE}/api/edit-profile/:id`,auth , seed.editProfile);
  app.post(`${process.env.MICRO_SERVICE}/api/get-profile-data`,auth, seed.getProfile);
  app.post(`${process.env.MICRO_SERVICE}/api/update-profile-data`, auth, seed.updateProfileData);
  app.post(`${process.env.MICRO_SERVICE}/api/check-email_id`, auth, seed.CheckEmeailId);
  app.post(`${process.env.MICRO_SERVICE}/api/update_password/:id`, auth, seed.UpdatePassword);
  // app.post(`${process.env.MICRO_SERVICE}/api/get-plant-details`,  seed.getPlantDeatils);
  
  app.post(`${process.env.MICRO_SERVICE}/api/get-plant-details`,  seed.getSPPDeatils);
  app.post(`${process.env.MICRO_SERVICE}/api/get-plant-district-details`,  seed.getPlantDistrictDetails);
  app.post(`${process.env.MICRO_SERVICE}/api/getProjectCoordinatorReport`, auth, seed.getProjectCoordinatorReport);
  app.post(`${process.env.MICRO_SERVICE}/api/getProjectCoordinatorReportCordinatorName`, auth, seed.getProjectCoordinatorReportCordinator);
  app.post(`${process.env.MICRO_SERVICE}/api/getProjectCoordinatorReportCordinatorNamedistrict`, auth, seed.getProjectCoordinatorReportCordinatorDistrict);
  app.post(`${process.env.MICRO_SERVICE}/api/getBspcReportDistrict`, auth, seed.getBspcReportDistrict);
  app.post(`${process.env.MICRO_SERVICE}/api/getBspcReportName`, auth, seed.getBspcReportName);
  app.post(`${process.env.MICRO_SERVICE}/api/getDistrictSeedTestingReport`, auth, seed.getDistrictSeedTestingReport);
  app.post(`${process.env.MICRO_SERVICE}/api/getCropNameofSeedMultiplictionRatioReport`, auth, seed.getCropNameofSeedMultiplictionRatioReport);
  app.post(`${process.env.MICRO_SERVICE}/api/getCropNameforMaxLotSize`, auth, seed.getCropNameofMaximumLotsizeReport);
  app.post(`${process.env.MICRO_SERVICE}/api/checksmrcropgroupisAlreayexit`, auth, seed.checksmrcropgroupisAlreayexit);
  app.post(`${process.env.MICRO_SERVICE}/api/getseedMultRatioSeedUniqueCropData`, auth, seed.getseedMultRatioSeedUniqueCropData);
  app.post(`${process.env.MICRO_SERVICE}/api/getseedMultRatioSeedUniqueCropDataincropModel`, auth, seed.getseedMultRatioSeedUniqueCropDataincropModel);
  app.post(`${process.env.MICRO_SERVICE}/api/getseedMultRatioSeedUniqueCropDataincropModelsecond`, auth, seed.getseedMultRatioSeedUniqueCropDataincropModelsecond);
  app.post(`${process.env.MICRO_SERVICE}/api/getProjectPoordinatorreportName`, auth, seed.getProjectPoordinatorreportName);
  app.post(`${process.env.MICRO_SERVICE}/api/getPlantDeatilsState`, auth, seed.getPlantDeatilsState);
  app.post(`${process.env.MICRO_SERVICE}/api/getPlantDeatilsDistrict`, auth, seed.getPlantDeatilsDistrict);
  app.post(`${process.env.MICRO_SERVICE}/api/getPlantDeatilsNameofInstution`, auth, seed.getPlantDeatilsNameofInstution);
  app.post(`${process.env.MICRO_SERVICE}/api/getBspcCode`, auth, seed.getBspcCode);
  app.post(`${process.env.MICRO_SERVICE}/api/getCropName`, auth, seed.getCropName);
  app.post(`${process.env.MICRO_SERVICE}/api/getIndentorStateList`, auth, seed.getIndentorStateList);
  app.post(`${process.env.MICRO_SERVICE}/api/getSeedTestingStateList`, auth, seed.getSeedTestingStateList);
  app.post(`${process.env.MICRO_SERVICE}/api/getProjectCoordinatorStateList`, auth, seed.getProjectCoordinatorStateList);
  app.post(`${process.env.MICRO_SERVICE}/api/getBspcStateList`, auth, seed.getBspcStateList);
  app.post(`${process.env.MICRO_SERVICE}/api/getMaximumCropNameList`,auth,  seed.getMaximumCropNameList);
  app.post(`${process.env.MICRO_SERVICE}/api/getdistinctMaximumCropNameList`, auth, seed.getdistinctMaximumCropNameList);
  app.post(`${process.env.MICRO_SERVICE}/api/deletesmrlistdata`, auth, seed.deletesmrlistdata);
  app.post(`${process.env.MICRO_SERVICE}/api/deletemaximumlistdata`, auth, seed.deletemaximumlistdata);
  app.post(`${process.env.MICRO_SERVICE}/api/deleteLabtestlistdata`, auth, seed.deleteLabtestlistdata);
  app.post(`${process.env.MICRO_SERVICE}/api/getIndentorDistrictList`, auth, seed.getIndentorDistrictList);
  app.post(`${process.env.MICRO_SERVICE}/api/getCropdatainseedmutiplicationRatio`, auth, seed.getCropdatainseedmutiplicationRatio);
  app.post(`${process.env.MICRO_SERVICE}/api/getIndentorStateSppDetails`, auth, seed.getIndentorStateSppDetails);
  app.post(`${process.env.MICRO_SERVICE}/api/getIndentorDistrictSppList`, auth, seed.getIndentorDistrictSppList);
  app.post(`${process.env.MICRO_SERVICE}/api/getAgencyDetailsIndentorSppName`, auth,  seed.getAgencyDetailsIndentorSppName);
  app.post(`${process.env.MICRO_SERVICE}/api/getCropNameData`, auth,  seed.getCropNameData);
  app.post(`${process.env.MICRO_SERVICE}/api/getCropNameDataAlreadyExit`, auth,  seed.getCropNameDataAlreadyExit);
  app.post(`${process.env.MICRO_SERVICE}/api/getVarietyNameData`, auth,  seed.getVarietyNameData);
  app.post(`${process.env.MICRO_SERVICE}/api/getOtherData`, auth,  seed.getOtherData);
  app.post(`${process.env.MICRO_SERVICE}/api/getSeedCharactersticsCropGroupData`, auth,  seed.getSeedCharactersticsCropGroupData);
  app.post(`${process.env.MICRO_SERVICE}/api/getBankdetailsData`, auth,  seed.getBankdetailsData);
  app.post(`${process.env.MICRO_SERVICE}/api/getBspcDatainCharactersticsSecond`, auth,  seed.getBspcDatainCharactersticsSecond);
  app.post(`${process.env.MICRO_SERVICE}/api/activitiesListSecond`, auth,  seed.activitiesListSecond);
  app.post(`${process.env.MICRO_SERVICE}/api/getIndenterDetailsSecond`, auth,  seed.getIndenterDetailsSecond);
  app.post(`${process.env.MICRO_SERVICE}/api/getChartIndentDataSecond`, auth,  seed.getChartIndentDataSecond);
  app.post(`${process.env.MICRO_SERVICE}/api/getChartIndentDataVarietyforpdpc`, auth,  seed.getChartIndentDataVarietyforpdpc);
  app.post(`${process.env.MICRO_SERVICE}/api/getChartAllIndentorforpdpc`, auth,  seed.getChartAllIndentorforpdpc);
  app.post(`${process.env.MICRO_SERVICE}/api/getChartAllIndentorCropFilterforpdpc`, auth,  seed.getChartAllIndentorCropFilterforpdpc);
  app.post(`${process.env.MICRO_SERVICE}/api/getChartAllIndentorforPdpcSecond`, auth,  seed.getChartAllIndentorforPdpcSecond);
  app.post(`${process.env.MICRO_SERVICE}/api/getChartAllIndentorVarietyforpdpc`, auth,  seed.getChartAllIndentorVarietyforpdpc);
  app.get(`${process.env.MICRO_SERVICE}/api/getVarietyCategoryList`,  seed.getVarietyCategoryList);
  app.post(`${process.env.MICRO_SERVICE}/api/freeze-indent-breeder-seed-data-forward`,   seed.freezeIndentBreederSeedDataForward);

  // get characterstic maaping region data
  app.post(`${process.env.MICRO_SERVICE}/api/get-characterstic-agro-region-maping-data`,  seed.getCharactersticAgroRegionMapingData);



  //New Dashboard donut Chart
  //freezed Indent
  app.post(`${process.env.MICRO_SERVICE}/api/get-freezed-indent-donut-chart-data`, auth, seed.getFreezedIndentDonutChartData);
  //Assign to PDPC
  app.post(`${process.env.MICRO_SERVICE}/api/get-assign-to-PD-PC-donut-chart-data`, auth, seed.getAssignToPDPCDonutChartData);

  //Production
  app.post(`${process.env.MICRO_SERVICE}/api/get-production-donut-chart-data`, auth, seed.getProductionDonutChartData);

  //Allocation
  app.post(`${process.env.MICRO_SERVICE}/api/get-allocation-donut-chart-data`, auth, seed.getAllocationDonutChartData);
  //Lifting
  app.post(`${process.env.MICRO_SERVICE}/api/get-lifting-donut-chart-data`, auth, seed.getLiftingDonutChartData);

  //Area sown by state 
  app.post(`${process.env.MICRO_SERVICE}/api/get-state-data`, auth, seed.getState);
  app.post(`${process.env.MICRO_SERVICE}/api/get-area-sown-by-state-chart-data`, auth, seed.getAreaSownByStateChartData);
  // Report 1
  app.post(`${process.env.MICRO_SERVICE}/api/get-year-from-variety`, auth, seed.getYearFromVariety);
  app.post(`${process.env.MICRO_SERVICE}/api/get-data-group-code-wise-report-one`, auth, seed.getDataGroupCodeWiseReportOne);
  app.post(`${process.env.MICRO_SERVICE}/api/get-data-crop-code-wise-report-one`, auth, seed.getDataCropWiseReportOne);
  app.post(`${process.env.MICRO_SERVICE}/api/get-data-variety-wise-report-one`, auth, seed.getDataVarietyWiseReportOne);
  //Report 2
  app.post(`${process.env.MICRO_SERVICE}/api/get-state-data-state-wise-report-two`, auth, seed.getStateDataStateWiseReportTwo);
  app.post(`${process.env.MICRO_SERVICE}/api/get-state-data-crop-group-wise-report-two`, auth, seed.getStateDataCropGroupWiseReportTwo);
  
  app.post(`${process.env.MICRO_SERVICE}/api/get-crop-data-crop-group-wise-report-two`, auth, seed.getCropDataCropGroupWiseReportTwo);
  app.post(`${process.env.MICRO_SERVICE}/api/get-crop-data-state-wise-report-two`, auth, seed.getCropDataStateWiseReportTwo);
  
  app.post(`${process.env.MICRO_SERVICE}/api/get-data-crop-wise-report-two`, auth, seed.getDataCropWiseReportTwo);
  app.post(`${process.env.MICRO_SERVICE}/api/get-data-variety-wise-report-two`, auth, seed.getDataVarietyWiseReportTwo);
  app.post(`${process.env.MICRO_SERVICE}/api/get-all-variety-details`, auth, seed.getAllVarietyDetails);
  app.post(`${process.env.MICRO_SERVICE}/api/get-all-variety-details-for-excel`, auth, seed.getAllVarietyDetailsForExcel);
}
