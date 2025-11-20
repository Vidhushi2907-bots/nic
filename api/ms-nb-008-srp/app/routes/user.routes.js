// const users = require("../controllers/user.controller.js");
// const auth = require('../_middleware/auth');
// const apiValidation = require('../_middleware/api-validation');
// const cordinator = require("../controllers/cordinator.controller.js")
// const report = require("../controllers/report.controller.js")

// require('dotenv').config()

// module.exports = app => {
//     app.post(`${process.env.MICRO_SERVICE}/api/web-login`, users.webLogin)

//     app.post(`${process.env.MICRO_SERVICE}/api/add-state`, auth, users.addState)
//     // const auth = require('../_middleware/auth');
//     app.post(`${process.env.MICRO_SERVICE}/api/validate-user`, users.login)

//     //API for Login in seednet
//     app.post(`${process.env.MICRO_SERVICE}/api/create-token`, auth, users.createToken)
//     app.get(`${process.env.MICRO_SERVICE}/api/verify-token`, users.verifySeednetToken)


//     app.post(`${process.env.MICRO_SERVICE}/api/get-all-states`, auth, users.getAllState)
//     app.post(`${process.env.MICRO_SERVICE}/api/edit-state`, auth, users.editState)
//     app.post(`${process.env.MICRO_SERVICE}/api/delete-state`, auth, users.deleteState)

//     app.get(`${process.env.MICRO_SERVICE}/api/test`, users.test)

//     app.post(`${process.env.MICRO_SERVICE}/api/add-district`, auth, users.addDistrict)
//     app.post(`${process.env.MICRO_SERVICE}/api/get-district-list`, auth, users.viewDistrict)
//     app.post(`${process.env.MICRO_SERVICE}/api/edit-district`, auth, users.editDistrict)
//     app.post(`${process.env.MICRO_SERVICE}/api/delete-district`, auth, users.deleteDistrict)

//     app.post(`${process.env.MICRO_SERVICE}/api/add-crop`, auth, users.addCrop)
//     app.get(`${process.env.MICRO_SERVICE}/api/get-crop-list`, auth, users.viewCrop)
//     app.post(`${process.env.MICRO_SERVICE}/api/get-crop-list`, auth, users.viewCrop)


//     app.post(`${process.env.MICRO_SERVICE}/api/get-crop-bsp-report-list`, auth, users.viewCropBspReportData)

//     app.post(`${process.env.MICRO_SERVICE}/api/edit-crop`, auth, users.editCrop)
//     app.post(`${process.env.MICRO_SERVICE}/api/delete-crop`, auth, users.deleteCrop);


//     app.post(`${process.env.MICRO_SERVICE}/api/add-user`, auth, users.addUser)
//     app.get(`${process.env.MICRO_SERVICE}/api/get-user-by-id/:id`, auth, users.getUserById);
//     app.get(`${process.env.MICRO_SERVICE}/api/getAgencyUserById/:id`, auth, users.getAgencyUserById);
//     app.get(`${process.env.MICRO_SERVICE}/api/get-user-list`, users.viewUser)
//     app.post(`${process.env.MICRO_SERVICE}/api/get-user-filtered-list`, auth, users.getFilteredUser)
//     app.post(`${process.env.MICRO_SERVICE}/api/edit-user`, auth, users.editUser)
//     app.post(`${process.env.MICRO_SERVICE}/api/edit-user-data`, auth, users.editUserData)
//     app.post(`${process.env.MICRO_SERVICE}/api/delete-user`, auth, users.deleteUser);
//     app.post(`${process.env.MICRO_SERVICE}/api/get-breeder-name-list`, auth, users.getBreederNameList);
//     app.post(`${process.env.MICRO_SERVICE}/api/get-bspc-list`, auth, users.getBSPCList);

//     app.post(`${process.env.MICRO_SERVICE}/api/get-variety-name-list`, auth, users.getVarietyNameList);
//     app.post(`${process.env.MICRO_SERVICE}/api/get-variety-notification-year`, users.getVarietyNotificationYear);

//     app.post(`${process.env.MICRO_SERVICE}/api/get-variety-name-bsp-report-list`, auth, users.getVarietyNameBspReportData);

//     app.post(`${process.env.MICRO_SERVICE}/api/get-crop-variety-list`, auth, users.viewVariety);
//     app.post(`${process.env.MICRO_SERVICE}/api/get-crop-indenting-variety-list`, users.viewIndentingVariety);


//     app.post(`${process.env.MICRO_SERVICE}/api/get-crop-variety-year`, auth, users.cropVarietyYear);


//     app.get(`${process.env.MICRO_SERVICE}/api/get-state-list`, users.viewState)

//     app.get(`${process.env.MICRO_SERVICE}/api/get-designation`, auth, users.getDesignation)
//     app.post(`${process.env.MICRO_SERVICE}/api/get-all-categories`, auth, users.getAllCategories)
//     app.post(`${process.env.MICRO_SERVICE}/api/get-all-designation`, auth, users.getAllDesignation)

//     app.post(`${process.env.MICRO_SERVICE}/api/add-indentor`, auth, users.addIndentor)
//     app.post(`${process.env.MICRO_SERVICE}/api/view-indentor`, auth, users.viewIndentor)
//     app.post(`${process.env.MICRO_SERVICE}/api/indentor-list`, users.indentorList)
//     app.post(`${process.env.MICRO_SERVICE}/api/edit-indentor/:id`, auth, users.editIndentor)

//     app.post(`${process.env.MICRO_SERVICE}/api/get-user-data`, auth, users.UserData)
//     app.post(`${process.env.MICRO_SERVICE}/api/delete-indentor`, auth, users.deleteIndentor)
//     app.post(`${process.env.MICRO_SERVICE}/api/check-already-exists-short-name`, auth, users.checkAlreadyExistsShortName);
//     // app.post(`${process.env.MICRO_SERVICE}/api/delete-indentor`, auth, users.deleteIndentor);
//     app.post(`${process.env.MICRO_SERVICE}/api/update-status-indentor`, auth, users.updateStatusIndentor);

//     app.post(`${process.env.MICRO_SERVICE}/api/get-master-bsp-report-data`, auth, users.getMasterBspReportData);

//     //bsp report filter data
//     app.post(`${process.env.MICRO_SERVICE}/api/get-master-bsp-report-filter-data`, auth, users.getMasterBspReportFilterData);

//     //new reports route shubham
//     app.post(`${process.env.MICRO_SERVICE}/api/get-master-bsp-one-report-data`, users.getMasterBspOneReportData);
//     app.post(`${process.env.MICRO_SERVICE}/api/get-master-bsp-two-report-data`, users.getMasterBspTwoReportData);
//     app.post(`${process.env.MICRO_SERVICE}/api/get-master-bsp-three-report-data`, users.getMasterBspThreeReportData);

//     app.post(`${process.env.MICRO_SERVICE}/api/get-bsp-one-filter-data`, users.getBsp1FilterData);
//     app.post(`${process.env.MICRO_SERVICE}/api/get-bsp-two-filter-data`, users.getBsp2FilterData);
//     app.post(`${process.env.MICRO_SERVICE}/api/get-bsp-three-filter-data`, users.getBsp3FilterData);
//     app.post(`${process.env.MICRO_SERVICE}/api/get-bsp-four-filter-data`, users.getBsp4FilterData);
//     app.post(`${process.env.MICRO_SERVICE}/api/get-bsp-five-a-filter-data`, users.getBsp5aFilterData);
//     app.post(`${process.env.MICRO_SERVICE}/api/get-bsp-five-b-filter-data`, users.getBsp5bFilterData);
//     app.post(`${process.env.MICRO_SERVICE}/api/get-bsp-six-filter-data`, users.getBsp6FilterData);

//     app.post(`${process.env.MICRO_SERVICE}/api/get-bsp-six-filter-data`, report.getBspSixFilterData);

//     // List of Breeder Seed Production Center(Seed Division Report)
//     app.post(`${process.env.MICRO_SERVICE}/api/getListOfBreederSeedProductionforReports`, users.getListOfBreederSeedProductionforReports);

//     // Get State for Seed Testing Laboratory(Seed Division Report)
//     app.get(`${process.env.MICRO_SERVICE}/api/getStateDataForSeedTestingLab`, auth, users.getStateDataForSeedTestingLab);

//     //Get Category for List of Breeders(seed Division Report)
//     app.get(`${process.env.MICRO_SERVICE}/api/getCategoryData`, auth, users.getCategoryData);

//     //freeze_timelines
//     app.post(`${process.env.MICRO_SERVICE}/api/add-freeze-timelines-data`, auth, users.addFreezeTimelinesData);
//     app.post(`${process.env.MICRO_SERVICE}/api/get-freeze-timelines-data`, auth, users.getFreezeTimelinesData);
//     app.post(`${process.env.MICRO_SERVICE}/api/edit-freeze-timelines-data`, auth, users.editFreezeTimelinesData);
//     app.post(`${process.env.MICRO_SERVICE}/api/get-freeze-timelines-data-by-id`, auth, users.getFreezeTimelinesDataById);

//     //plant details route
//     app.post(`${process.env.MICRO_SERVICE}/api/add-plant-details`, users.addPlantDetails)
//     app.post(`${process.env.MICRO_SERVICE}/api/plant-list`, users.plantList)

//     //indent of SPA's
//     // app.post(`${process.env.MICRO_SERVICE}/api/indent-of-spa`, users.indentOfSpaData)

//     // Old API
//     // app.post(`${process.env.MICRO_SERVICE}/api/indent-of-spa`, apiValidation,users.addIndentOfSpaData)
//     // app.post(`${process.env.MICRO_SERVICE}/api/indent-of-spa/:id`, apiValidation, users.addIndentOfSpaData)
//     // app.post(`${process.env.MICRO_SERVICE}/api/delete-indent-of-spa`, apiValidation, users.delteIndentOfSpaData)
//     // app.post(`${process.env.MICRO_SERVICE}/api/get-indent-of-spa`, apiValidation, users.getIndentOfSpaData)
    
//     // app.post(`${process.env.MICRO_SERVICE}/api/indent-of-spa`, apiValidation,users.addIndentOfSpaDataHybrid)
//     // app.post(`${process.env.MICRO_SERVICE}/api/indent-of-spa/:id`, apiValidation, users.addIndentOfSpaDataHybrid)
//     // app.post(`${process.env.MICRO_SERVICE}/api/delete-indent-of-spa`, apiValidation, users.delteIndentOfSpaDataHybrid)
//     // app.post(`${process.env.MICRO_SERVICE}/api/get-indent-of-spa`, apiValidation, users.getIndentOfSpaDataHybrid)

//     // app.get(`${process.env.MICRO_SERVICE}/api/get-spa-allocation-details`, apiValidation, users.getSpaAllocationDetails);
//     // app.get(`${process.env.MICRO_SERVICE}/api/common/createUserFromIndentorData`, users.createUserFromIndentorData)
//     // app.get(`${process.env.MICRO_SERVICE}/api/check-indent-validation`, users.checkIndentValidation);
//     // app.get(`${process.env.MICRO_SERVICE}/api/assigned-inspection-list`, users.assignedInspectionList);
//     // app.post(`${process.env.MICRO_SERVICE}/api/get-variety-line-list`,apiValidation, users.getDirectIndentVarietyLineData);

//     // app.post(`${process.env.MICRO_SERVICE}/api/indent-of-spa-hybrid`, users.addIndentOfSpaDataHybrid)
//     // app.post(`${process.env.MICRO_SERVICE}/api/indent-of-spa-hybrid/:id`, apiValidation, users.addIndentOfSpaDataHybrid)
//     // app.post(`${process.env.MICRO_SERVICE}/api/delete-indent-of-spa-hybrid`, users.delteIndentOfSpaDataHybrid)
//     // app.post(`${process.env.MICRO_SERVICE}/api/get-indent-of-spa-hybrid`, apiValidation, users.getIndentOfSpaDataHybrid)


//     // new api for check-crop-freezed-status for udisha team
//     // app.post(`${process.env.MICRO_SERVICE}/api/check-crop-freezed-status`, apiValidation, users.checkCropFreezedStatus);

//     app.post(`${process.env.MICRO_SERVICE}/api/getAllPlantsForBSPC`, users.getAllPlantsForBSPC)
//     app.post(`${process.env.MICRO_SERVICE}/api/getAllPlantsFoAllBSPC`, users.getAllPlantsFoAllBSPC)


//     //freez timeline
//     app.post(`${process.env.MICRO_SERVICE}/api/activities-list`, users.activitiesList)
//     app.post(`${process.env.MICRO_SERVICE}/api/year-of-indent-activities-list`, users.yearOfIndentactivitiesList)
//     app.post(`${process.env.MICRO_SERVICE}/api/season-activities-list`, users.seasonActivitiesList)
//     app.post(`${process.env.MICRO_SERVICE}/api/activities-list-filter`, users.activitiesListilter)


//     app.post(`${process.env.MICRO_SERVICE}/api/common/updatePassword`, auth, users.updatePassword);


//     app.post(`${process.env.MICRO_SERVICE}/api/deleteIndentor`, auth, users.deleteIndentors);
//     app.post(`${process.env.MICRO_SERVICE}/api/deleteprocessingplant`, auth, users.deleteprocessingplant);
//     app.post(`${process.env.MICRO_SERVICE}/api/deletefreezeModel/:id`, auth, users.deletefreezeModel);
//     app.post(`${process.env.MICRO_SERVICE}/api/getbsp3reportdata`, auth, users.getbsp3reportdata);
//     app.post(`${process.env.MICRO_SERVICE}/api/getbsp3masterreportdata`, auth, users.getbsp3masterreportdata);
//     app.get(`${process.env.MICRO_SERVICE}/api/get-user-code-by-id/:id`, auth, users.getUserCodeById);

//     app.post(`${process.env.MICRO_SERVICE}/api/addSpaIndentor`, users.addSpaIndentor);
//     app.post(`${process.env.MICRO_SERVICE}/api/addSpaIndentorList`, users.addSpaIndentorList)
//     app.post(`${process.env.MICRO_SERVICE}/api/editIndentorSppData/:id`, auth, users.editIndentorSppData)
//     app.post(`${process.env.MICRO_SERVICE}/api/deleteSPPIndentorAgencyData`, auth, users.deleteSPPIndentorAgencyData)
//     app.post(`${process.env.MICRO_SERVICE}/api/getBlockData`, auth, users.getBlockData);
//     app.post(`${process.env.MICRO_SERVICE}/api/getAgencyUserDataById/:id`, auth, users.getAgencyUserDataById);
//     app.post(`${process.env.MICRO_SERVICE}/api/getAgencyUserIndentorDataById/:id`, auth, users.getAgencyUserIndentorDataById);
//     app.post(`${process.env.MICRO_SERVICE}/api/getBspcDatainCharacterstics`, auth, users.getBspcDatainCharacterstics);
//     app.post(`${process.env.MICRO_SERVICE}/api/getCentralData`, auth, users.getCentralData);
//     app.post(`${process.env.MICRO_SERVICE}/api/getUserDataInIndentor/:id`, auth, users.getUserDataInIndentor);
//     app.get(`${process.env.MICRO_SERVICE}/api/getSpaDetailsData`, users.getSpaDetailsData);

//     //freeze timeline filter 
//     app.post(`${process.env.MICRO_SERVICE}/api/freeze-timeline-filter`, users.freezeTimelineFilter);

//     app.post(`${process.env.MICRO_SERVICE}/api/getAllocatedbySeedDivisionforlifting`, auth, users.getAllocatedbySeedDivisionforlifting);

//     // check already exist short name data (all module)
//     app.post(`${process.env.MICRO_SERVICE}/api/check-short-name-data-for-all`, users.checkShortNameDataForAll);
//     app.post(`${process.env.MICRO_SERVICE}/api/get-indentor-year-list-second`, auth, users.getindentoryearlistSecond);
//     app.post(`${process.env.MICRO_SERVICE}/api/get-indentor-year-list-second-indentor`, auth, users.getindentoryearlistSecondindentor);
//     app.post(`${process.env.MICRO_SERVICE}/api/get-indentor-season-list-second`, auth, users.getindentorSeasonlistSecond);
//     app.post(`${process.env.MICRO_SERVICE}/api/get-indentor-season-list-second-indentor`, auth, users.getindentorSeasonlistSecondindentor);
//     app.post(`${process.env.MICRO_SERVICE}/api/getindentorCropTypelistSecond`, auth, users.getindentorCropTypelistSecond);
//     app.post(`${process.env.MICRO_SERVICE}/api/getindentorCropTypelistSecondIndentor`, auth, users.getindentorCropTypelistSecondindentor);
//     app.post(`${process.env.MICRO_SERVICE}/api/getIndentorSpaWiseBreederSeed`, auth, users.getIndentorSpaWiseBreederSeed);
//     app.post(`${process.env.MICRO_SERVICE}/api/getIndentorSpaWiseBreederSeedIndentor`, auth, users.getIndentorSpaWiseBreederSeedIndentor);

//     app.post(`${process.env.MICRO_SERVICE}/api/getindentorCroplist`, auth, users.getindentorCroplist);
//     app.post(`${process.env.MICRO_SERVICE}/api/getindentorCroplistindentor`, auth, users.getindentorCroplistindentor);
//     app.post(`${process.env.MICRO_SERVICE}/api/getIndentorSpaNameBreederSeed`, auth, users.getIndentorSpaNameBreederSeed);
//     app.post(`${process.env.MICRO_SERVICE}/api/getIndentorSpaNameBreederSeedIndentor`, auth, users.getIndentorSpaNameBreederSeedIndentor);
//     app.post(`${process.env.MICRO_SERVICE}/api/getAllocatedDistrict`, auth, users.getAllocatedDistrict);
//     app.post(`${process.env.MICRO_SERVICE}/api/getStatusofLiftingyear`, auth, users.getStatusofLiftingyear);
//     app.post(`${process.env.MICRO_SERVICE}/api/getStatusofLiftingSeason`, auth, users.getStatusofLiftingySeason);
//     app.post(`${process.env.MICRO_SERVICE}/api/getStatusofLiftingCropType`, auth, users.getStatusofLiftingCropType);
//     app.post(`${process.env.MICRO_SERVICE}/api/getStatusofLiftingNonLiftingData`, auth, users.getStatusofLiftingNonLiftingData);
//     app.post(`${process.env.MICRO_SERVICE}/api/getStatusofLiftingNonLiftingDataSecond`, auth, users.getStatusofLiftingNonLiftingDataSecond);
//     app.post(`${process.env.MICRO_SERVICE}/api/getStatusofLiftingCrop`, auth, users.getStatusofLiftingCrop);
//     app.post(`${process.env.MICRO_SERVICE}/api/getStatusofLiftingVariety`, auth, users.getStatusofLiftingVariety);
//     app.post(`${process.env.MICRO_SERVICE}/api/getSeedVarietyCropGroupData`, auth, users.getSeedVarietyCropGroupData);
//     app.post(`${process.env.MICRO_SERVICE}/api/getIndentorCropWiseBreederSeedindentor`, auth, users.getIndentorCropWiseBreederSeedindentor);
//     app.post(`${process.env.MICRO_SERVICE}/api/getindentorCropGrouplistindentor`, users.getindentorCropGrouplistindentor);
//     app.post(`${process.env.MICRO_SERVICE}/api/getindentorVarietylistNewIndentor`, users.getindentorVarietylistNewIndentor);
//     app.post(`${process.env.MICRO_SERVICE}/api/getBillGenerateCertificateapiSecondyear`, auth, report.getBillGenerateCertificateapiSecondyear);
//     app.post(`${process.env.MICRO_SERVICE}/api/getBillGenerateCertificateapiSecondSeason`, auth, report.getBillGenerateCertificateapiSecondSeason);
//     app.post(`${process.env.MICRO_SERVICE}/api/getBillGenerateCertificateapiSecondCropType`, auth, report.getBillGenerateCertificateapiSecondCropType);
//     app.post(`${process.env.MICRO_SERVICE}/api/getBillGenerateCertificateapiSecondCropName`, auth, report.getBillGenerateCertificateapiSecondCropName);
//     app.post(`${process.env.MICRO_SERVICE}/api/getBillGenerateCertificateapiSecondVarietyName`, auth, report.getBillGenerateCertificateapiSecondVarietyName);
//     app.post(`${process.env.MICRO_SERVICE}/api/getbspcAssignCropReports`, auth, report.getbspcAssignCropReports);
//     app.post(`${process.env.MICRO_SERVICE}/api/getAssignBreederCropsyear`, auth, report.getAssignBreederCropsyear);
//     app.post(`${process.env.MICRO_SERVICE}/api/getAssignBreederCropsSeason`, auth, report.getAssignBreederCropsSeason);
//     app.post(`${process.env.MICRO_SERVICE}/api/getAssignBreederCropType`, auth, report.getAssignBreederCropType);
//     app.post(`${process.env.MICRO_SERVICE}/api/getAssignBreederCropBspc`, auth, report.getAssignBreederCropBspc);
//     app.post(`${process.env.MICRO_SERVICE}/api/getAssignBreederCropName`, auth, report.getAssignBreederCropName);
//     app.post(`${process.env.MICRO_SERVICE}/api/getlotNumberyear`, auth, report.getlotNumberyear);
//     app.post(`${process.env.MICRO_SERVICE}/api/getlotNumberSeason`, auth, report.getlotNumberSeason);
//     app.post(`${process.env.MICRO_SERVICE}/api/getlotNumberCropType`, auth, report.getlotNumberCropType);
//     app.post(`${process.env.MICRO_SERVICE}/api/getlotNumberCropName`, auth, report.getlotNumberCropName);
//     app.post(`${process.env.MICRO_SERVICE}/api/getlotNumberVarietyName`, auth, report.getlotNumberVarietyName);
//     app.post(`${process.env.MICRO_SERVICE}/api/getlotNumberforseedtestingreport`, auth, report.getlotNumberforseedtestingreport);
//     app.post(`${process.env.MICRO_SERVICE}/api/getReportstatusforseedtestingreport`, auth, report.getReportstatusforseedtestingreport);
//     app.post(`${process.env.MICRO_SERVICE}/api/getCropWiseAssignVarieties`, auth, report.getCropWiseAssignVarieties);
//     app.post(`${process.env.MICRO_SERVICE}/api/getbspcVarietyName`, auth, report.getbspcVarietyName);
//     // app.post(`${process.env.MICRO_SERVICE}/api/getbspcVarietyName`, report.getMasterBspTwoReportDataSecond);
//     app.post(`${process.env.MICRO_SERVICE}/api/getMasterBspOneReportDataSecond`, users.getMasterBspOneReportDataSecond);
//     app.post(`${process.env.MICRO_SERVICE}/api/getMasterBspTwoReportDataSecond`, auth, report.getMasterBspTwoReportDataSecond);
//     app.post(`${process.env.MICRO_SERVICE}/api/getbspthreeYearofIndent`, auth, report.getbspthreeYearofIndent);
//     app.post(`${process.env.MICRO_SERVICE}/api/getbspthreeSeason`, auth, report.getbspthreeSeason);
//     app.post(`${process.env.MICRO_SERVICE}/api/getbspthreeCropType`, auth, report.getbspthreeCropType);
//     app.post(`${process.env.MICRO_SERVICE}/api/getbspthreeCropName`, auth, report.getbspthreeCropName);
//     app.post(`${process.env.MICRO_SERVICE}/api/getMasterBspThreeReportDataSecond`, auth, report.getMasterBspThreeReportDataSecond);
//     app.post(`${process.env.MICRO_SERVICE}/api/getbspOneYearofIndent`, auth, report.getbspOneYearofIndent);
//     app.post(`${process.env.MICRO_SERVICE}/api/getbspTwoYearofIndent`, auth, report.getbspTwoYearofIndent);

//     app.post(`${process.env.MICRO_SERVICE}/api/getbspfivebYearofIndent`, auth, report.getbspfivebYearofIndent);
//     app.post(`${process.env.MICRO_SERVICE}/api/getbspfivebVariety`, auth, report.getbspfivebVariety);
//     app.post(`${process.env.MICRO_SERVICE}/api/getBsp4ReportData`, auth, report.getBsp4ReportData);
//     app.post(`${process.env.MICRO_SERVICE}/api/getbsp4CropName`, auth, report.getbsp4CropName);


//     // app.post(`${process.env.MICRO_SERVICE}/api/get-indentor-year-list`, auth, users.getindentoryearlist);

//     //bsp5(a)  new api
//     app.post(`${process.env.MICRO_SERVICE}/api/get-bsp-5a-reports`, auth, report.getBsp5aReports);
//     app.post(`${process.env.MICRO_SERVICE}/api/get-bsp-5a-filter-crop_type`, auth, report.getBsp5aFilterCropType);
//     app.post(`${process.env.MICRO_SERVICE}/api/get-bsp-5a-filter-crop-name`, auth, report.getBsp5aFilterCropName);
//     app.post(`${process.env.MICRO_SERVICE}/api/get-bsp-5a-filter-variety`, auth, report.getBsp5aFilterVariety);

//     //& bsp5(b) new api
//     app.post(`${process.env.MICRO_SERVICE}/api/get-bsp-5b-reports`, report.getBsp5bReports);
//     app.post(`${process.env.MICRO_SERVICE}/api/get-bsp-5b-filter-crop_type`, report.getBsp5bFilterCropType);
//     app.post(`${process.env.MICRO_SERVICE}/api/get-bsp-5b-filter-crop-name`, report.getBsp5bFilterCropName);
//     app.post(`${process.env.MICRO_SERVICE}/api/get-bsp-5b-filter-variety`, report.getBsp5bFilterVariety);
//     app.get(`${process.env.MICRO_SERVICE}/api/test-sms/:mobile_number`, users.testSMS);
//     app.post(`${process.env.MICRO_SERVICE}/api/test-sms`, users.testSMSPost);

//     app.post(`${process.env.MICRO_SERVICE}/api/getBsp1cropName`, auth, report.getBsp1cropName);
//     app.post(`${process.env.MICRO_SERVICE}/api/getBsp1cropType`, auth, report.getBsp1cropType);
//     app.post(`${process.env.MICRO_SERVICE}/api/getBsp2cropType`, auth, report.getBsp2cropType);

//     app.post(`${process.env.MICRO_SERVICE}/api/getBsp3cropType`, auth, report.getBsp3cropType);
//     app.post(`${process.env.MICRO_SERVICE}/api/getBsp4cropType`, auth, report.getBsp4cropType);
//     app.post(`${process.env.MICRO_SERVICE}/api/getBsp2Year`, auth, report.getBsp2Year);
//     app.post(`${process.env.MICRO_SERVICE}/api/getBsp2Season`, auth, report.getBsp2Season);
//     app.post(`${process.env.MICRO_SERVICE}/api/getBsp2cropType`, auth, report.getBsp2cropType);
//     app.post(`${process.env.MICRO_SERVICE}/api/getlotNumberyearSecond`, auth, report.getlotNumberyearSecond);
//     app.post(`${process.env.MICRO_SERVICE}/api/getlotNumberSeasonSecond`, auth, report.getlotNumberSeasonSecond);
//     app.post(`${process.env.MICRO_SERVICE}/api/getlotNumberCropTypeSecond`, auth, report.getlotNumberCropTypeSecond);
//     app.post(`${process.env.MICRO_SERVICE}/api/getlotNumberCropNameSecond`, auth, report.getlotNumberCropNameSecond);
//     app.post(`${process.env.MICRO_SERVICE}/api/getlotNumberVarietyNameSecond`, auth, report.getlotNumberVarietyNameSecond);

//     // spa persion use api's
//     app.post(`${process.env.MICRO_SERVICE}/api/get-indent-of-spa-new`, auth, users.getIndentOfSpaDataNew)
//     app.post(`${process.env.MICRO_SERVICE}/api/indent-of-spa-new`, auth, users.addIndentOfSpaDataNew)
//     app.post(`${process.env.MICRO_SERVICE}/api/get-state-list`, users.getStateList);
//     app.post(`${process.env.MICRO_SERVICE}/api/get-state-list-v2`, users.viewStateData);

//     app.post(`${process.env.MICRO_SERVICE}/api/getlotNumberyearSecond`, auth, report.getlotNumberyearSecond);
//     app.post(`${process.env.MICRO_SERVICE}/api/getlotNumberSeasonSecond`, auth, report.getlotNumberSeasonSecond);
//     app.post(`${process.env.MICRO_SERVICE}/api/getlotNumberCropTypeSecond`, auth, report.getlotNumberCropTypeSecond);
//     app.post(`${process.env.MICRO_SERVICE}/api/getlotNumberCropNameSecond`, auth, report.getlotNumberCropNameSecond);
//     app.post(`${process.env.MICRO_SERVICE}/api/getlotNumberVarietyNameSecond`, auth, report.getlotNumberVarietyNameSecond);
//     app.post(`${process.env.MICRO_SERVICE}/api/getAssignCropYear`, auth, report.getAssignCropYear);
//     app.post(`${process.env.MICRO_SERVICE}/api/getAssignCropSeason`, auth, report.getAssignCropSeason);
//     app.post(`${process.env.MICRO_SERVICE}/api/getAssignCropType`, auth, report.getAssignCropType);
//     app.post(`${process.env.MICRO_SERVICE}/api/getAssignCropName`, auth, report.getAssignCropName);

//     // spa persion use api's
//     app.post(`${process.env.MICRO_SERVICE}/api/get-indent-of-spa-new`, auth, users.getIndentOfSpaDataNew)
//     app.post(`${process.env.MICRO_SERVICE}/api/indent-of-spa-new`, auth, users.addIndentOfSpaDataNew)


//     app.post(`${process.env.MICRO_SERVICE}/api/getMasterBspTwoReportDataSecondReport`, users.getMasterBspTwoReportDataSecondReport);
//     app.post(`${process.env.MICRO_SERVICE}/api/AssignVarietyIndentingData`, auth, users.AssignVarietyIndentingData);
//     app.post(`${process.env.MICRO_SERVICE}/api/getBspcforseedInventory`, auth, report.getBspcforseedInventory);
//     app.post(`${process.env.MICRO_SERVICE}/api/getCropforseedInventory`, auth, report.getCropforseedInventory);
//     app.post(`${process.env.MICRO_SERVICE}/api/getVarietyforseedInventory`, auth, report.getVarietyforseedInventory);
//     app.post(`${process.env.MICRO_SERVICE}/api/addSeedInventory`, auth, report.addSeedInventory);
//     app.post(`${process.env.MICRO_SERVICE}/api/getseedInventory`, auth, report.getseedInventory);
//     app.post(`${process.env.MICRO_SERVICE}/api/getseedInventorybyid`, auth, report.getseedInventorybyid);
//     app.post(`${process.env.MICRO_SERVICE}/api/deleteseedInventorybyid`, auth, report.deleteseedInventorybyid);
//     app.post(`${process.env.MICRO_SERVICE}/api/UpdateSeedInventory`, auth, report.UpdateSeedInventory);
//     app.post(`${process.env.MICRO_SERVICE}/api/getVarietyDataOfSeedInventory`, auth, report.getVarietyDataOfSeedInventory);
//     app.post(`${process.env.MICRO_SERVICE}/api/getStageData`, auth, report.getStageData);


//     //new flow Api's (Assign Crop )
//     app.post(`${process.env.MICRO_SERVICE}/api/get-assign-crop-all-data`, users.getAssignCropAllData);
//     app.post(`${process.env.MICRO_SERVICE}/api/add-assign-crop-all-data`, auth, users.addAssignCropAllData);
//     app.post(`${process.env.MICRO_SERVICE}/api/delete-assign-crop-all-data`, auth, users.deleteAssignCropAllData);
//     app.post(`${process.env.MICRO_SERVICE}/api/get-crop-basic-details`, auth, users.getCropBasicDetails);
//     app.post(`${process.env.MICRO_SERVICE}/api/get-crop-basic-details-second`, auth, users.getCropBasicDetailsSecond);
//     app.post(`${process.env.MICRO_SERVICE}/api/get-assign-crop-all-data`, users.getAssignCropAllData);
//     app.post(`${process.env.MICRO_SERVICE}/api/add-assign-crop-all-data`, users.addAssignCropAllData);
//     app.post(`${process.env.MICRO_SERVICE}/api/delete-assign-crop-all-data`, users.deleteAssignCropAllData);
//     app.post(`${process.env.MICRO_SERVICE}/api/get-crop-basic-details`, users.getCropBasicDetails);
//     app.post(`${process.env.MICRO_SERVICE}/api/get-crop-indentor-data`, auth, cordinator.cropIndentingData);
//     app.post(`${process.env.MICRO_SERVICE}/api/get-designation`, auth, cordinator.getDesignation);
//     app.post(`${process.env.MICRO_SERVICE}/api/create-team-monitoring`, auth, cordinator.createTeamMonitoring);
//     app.post(`${process.env.MICRO_SERVICE}/api/get-team-monitoring`, auth, cordinator.getTeamMonitoring);
//     app.post(`${process.env.MICRO_SERVICE}/api/get-team-monitoring-data`, auth, cordinator.getTeamMonitoringData);
//     app.post(`${process.env.MICRO_SERVICE}/api/update-team-monitoring`, auth, cordinator.updateTeamMonitoring);
//     app.post(`${process.env.MICRO_SERVICE}/api/delete-team-monitoring`, auth, cordinator.deleteTeamMonitoring);
//     app.post(`${process.env.MICRO_SERVICE}/api/get-agency-type`, auth, cordinator.getAgencyType);
//     app.post(`${process.env.MICRO_SERVICE}/api/get-indventory-data`, auth, cordinator.getSeedInventoryData);
//     app.post(`${process.env.MICRO_SERVICE}/api/get-seed-class`, auth, cordinator.getSeedClass);
//     app.post(`${process.env.MICRO_SERVICE}/api/get-bsp-performa1-year`, auth, cordinator.getbspPerforma1Year);
//     app.post(`${process.env.MICRO_SERVICE}/api/get-bsp-performa1-season`, auth, cordinator.getbspPerforma1Season);
//     app.post(`${process.env.MICRO_SERVICE}/api/get-bsp-performa1-crop`, auth, cordinator.getbspPerforma1Crop);
//     app.post(`${process.env.MICRO_SERVICE}/api/get-season-assign-indentor-data`, auth, cordinator.seasionAssignIndentingData);
//     app.post(`${process.env.MICRO_SERVICE}/api/get-designation-of-spp`, auth, cordinator.getDesignationOfSPP);

//     app.post(`${process.env.MICRO_SERVICE}/api/get-year-of-indent-spa`, auth, users.getYearOfIndentSpa);
//     app.post(`${process.env.MICRO_SERVICE}/api/get-season-of-indent-spa`, auth, users.getSeasonOfIndentSpa);
//     app.post(`${process.env.MICRO_SERVICE}/api/get-crop-of-indent-spa`, auth, users.getCropOfIndentSpa);
//     app.post(`${process.env.MICRO_SERVICE}/api/get-state-of-indent-spa`, auth, users.getStateOfIndentSpa);
//     app.post(`${process.env.MICRO_SERVICE}/api/unfreeze-indent-spa`, auth, users.unfreezeIndentSpa);

//     app.post(`${process.env.MICRO_SERVICE}/api/get-bsp-proforma-2s-details`, users.getBspProforma2sDetails);
//     app.post(`${process.env.MICRO_SERVICE}/api/get-lot-number-by-seed-inventory`, auth, report.getLotNumberBySeedInventory);
//     app.post(`${process.env.MICRO_SERVICE}/api/authenticate-app-user`, users.authenticateAppUser);
//     app.post(`${process.env.MICRO_SERVICE}/api/reg-bsp-proforma-2s-insp-rep`, users.registerBspProforma2sInspectionReport);

//     app.post(`${process.env.MICRO_SERVICE}/api/got-app-login`, users.authenticateGOTAppUser);

//     app.post(`${process.env.MICRO_SERVICE}/api/get-bsp-proforma-1s-varieties`, auth, users.getBspProforma1sVarieties);
//     app.post(`${process.env.MICRO_SERVICE}/api/get-bsp-proforma-2s-varieties`, auth, users.getBspProforma2sVarieties);
//     app.post(`${process.env.MICRO_SERVICE}/api/get-varieties-parental-line`, auth, users.getVarietiesParentalLine);
//     app.post(`${process.env.MICRO_SERVICE}/api/get-line-of-seed-inventory`, auth, users.getLineOfSeedInventory);
//     app.post(`${process.env.MICRO_SERVICE}/api/get-seed-type-of-seed-inventory`, auth, users.getSeedTypeOfSeedInventory);
//     app.post(`${process.env.MICRO_SERVICE}/api/get-stage-of-seed-inventory`, auth, users.getStageOfSeedInventory);
//     app.post(`${process.env.MICRO_SERVICE}/api/get-year-of-seed-inventory`, auth, users.getYearOfSeedInventory);
//     app.post(`${process.env.MICRO_SERVICE}/api/get-season-of-seed-inventory`, auth, users.getSeasonOfSeedInventory);
//     app.post(`${process.env.MICRO_SERVICE}/api/get-lot-of-seed-inventory`, auth, users.getLotNoOfSeedInventory);
//     app.post(`${process.env.MICRO_SERVICE}/api/get-tag-of-seed-inventory`, auth, users.getTagNoOfSeedInventory);
//     app.post(`${process.env.MICRO_SERVICE}/api/check-quantity-of-seed-inventory`, auth, users.checkQuantityOfSeedInventory);
//     app.post(`${process.env.MICRO_SERVICE}/api/register-quantity-of-seed-inventory`, auth, users.registerQuantityOfSeedInventory);
//     app.post(`${process.env.MICRO_SERVICE}/api/get-bsp-proforma-2s-list`, auth, users.getBspProforma2sList);
//     app.post(`${process.env.MICRO_SERVICE}/api/get-bsp-proforma-1s-varieties-level-1`, auth, users.getBspProforma1sVarietiesLevel1);
//     app.post(`${process.env.MICRO_SERVICE}/api/get-bsp-proforma-1s-varieties-level-2`, auth, users.getBspProforma1sVarietiesLevel2);
//     app.post(`${process.env.MICRO_SERVICE}/api/finalise-bsp-proforma-2s-data`, auth, users.finaliseBspProforma2sData);
//     app.post(`${process.env.MICRO_SERVICE}/api/delete-bsp-proforma-2s-data`, auth, users.deleteBspProforma2sData);
//     app.post(`${process.env.MICRO_SERVICE}/api/get-bsp-proforma-2s-edit-data`, auth, users.getBspProforma2sEditData);
//     app.post(`${process.env.MICRO_SERVICE}/api/check-edit-quantity-of-seed-inventory`, auth, users.checkEditQuantityOfSeedInventory);
//     app.post(`${process.env.MICRO_SERVICE}/api/edit-bsp-proforma-2s-data`, auth, users.editBspProforma2sData);


//     app.post(`${process.env.MICRO_SERVICE}/api/get-indent-year`, auth, cordinator.getIndentYear);
//     app.post(`${process.env.MICRO_SERVICE}/api/get-bsp-proforma-2s-list-second`, auth, report.getBspProforma2sListSecond);
//     app.post(`${process.env.MICRO_SERVICE}/api/get-all-state-list`, report.getAllStateList);
//     app.post(`${process.env.MICRO_SERVICE}/api/delete-bsp-proforma-2s-data-second`, auth, users.deleteBspProforma2sDataSecond);
//     app.post(`${process.env.MICRO_SERVICE}/api/check-lot-name`, auth, report.checkLotName);
//     app.post(`${process.env.MICRO_SERVICE}/api/get-parental-data`, auth, report.getParentalData);

//     //monitoring team api's (dec-22-2023)
//     app.post(`${process.env.MICRO_SERVICE}/api/check-monitoring-team-name-uniqueness`, auth, cordinator.checkMonitoringTeamNameUniqueness);
//     app.post(`${process.env.MICRO_SERVICE}/api/get-all-monitoring-team-name`, auth, cordinator.getAllMonitoringTeamName);
//     app.post(`${process.env.MICRO_SERVICE}/api/getWiilingProduceVarietyDataSecond`, report.getWiilingProduceVarietyDataSecond);
//     app.post(`${process.env.MICRO_SERVICE}/api/get-user-data-details`, auth, report.getUserData);
//     app.post(`${process.env.MICRO_SERVICE}/api/get-bsp2-year`, report.bsp2year);
//     app.post(`${process.env.MICRO_SERVICE}/api/get-bsp2-season`, report.getBsp2SeasonData);
//     app.post(`${process.env.MICRO_SERVICE}/api/get-bsp2-crop-data`, report.getBsp2CropData);
//     app.post(`${process.env.MICRO_SERVICE}/api/get-bsp2-data-list`, auth, report.getBsp2List);
//     app.post(`${process.env.MICRO_SERVICE}/api/get-all-state-list-data`, report.getAllStateListData);
//     app.post(`${process.env.MICRO_SERVICE}/api/un-freeze-data-data`, users.unfreezeIndentSpaSecond);

//     //comments api's (fab-5-2024)
//     app.get(`${process.env.MICRO_SERVICE}/api/get-commnets-list`, users.getCommnetsList);
//     app.post(`${process.env.MICRO_SERVICE}/api/indent-permission`, users.indentPermission);

//     // bsp2 report sacchin
//     app.post(`${process.env.MICRO_SERVICE}/api/get-bsp-performa1-year-report`, cordinator.getbspPerforma1YearReport);
//     app.post(`${process.env.MICRO_SERVICE}/api/get-bsp-performa1-crop-report`, cordinator.getbspPerforma1CropReport);
//     app.post(`${process.env.MICRO_SERVICE}/api/get-bsp-performa1-season-report`, cordinator.getbspPerforma1SeasonReport);
//     app.post(`${process.env.MICRO_SERVICE}/api/get-user-data-details-report`, report.getUserDataReport);
//     app.post(`${process.env.MICRO_SERVICE}/api/get-bsp2-data-list-report`, report.getBsp2ListReport);

//     app.post(`${process.env.MICRO_SERVICE}/api/getAgencyUserDataByIdReport1/:id`, users.getAgencyUserDataById1);
//     app.post(`${process.env.MICRO_SERVICE}/api/get-district-list-report`, users.viewDistrict);
//     app.post(`${process.env.MICRO_SERVICE}/api/get-all-designation-profile`, auth, users.getAllDesignationProfile);
//     app.post(`${process.env.MICRO_SERVICE}/api/get-year-of-indent-spa-second`, auth, users.getYearOfIndentSpaSecond);
//     app.post(`${process.env.MICRO_SERVICE}/api/get-season-of-indent-spa-second`, auth, users.getSeasonOfIndentSpaSecond);
//     app.post(`${process.env.MICRO_SERVICE}/api/get-crop-of-indent-spa-second`, auth, users.getCropOfIndentSpaSecond);
//     app.post(`${process.env.MICRO_SERVICE}/api/get-state-of-indent-spa-second`, auth, users.getStateOfIndentSpaSecond);

//     //indent of SPA's Hybrid (26/02/2024)
//     // app.post(`${process.env.MICRO_SERVICE}/api/indent-of-spa`, users.indentOfSpaData)
//     // apiValidation
//     // app.post(`${process.env.MICRO_SERVICE}/api/indent-of-spa-hybrid`, users.addIndentOfSpaDataHybrid)
//     // app.post(`${process.env.MICRO_SERVICE}/api/indent-of-spa-hybrid/:id`, apiValidation, users.addIndentOfSpaDataHybrid)
//     // app.post(`${process.env.MICRO_SERVICE}/api/delete-indent-of-spa-hybrid`, users.delteIndentOfSpaDataHybrid)
//     // app.post(`${process.env.MICRO_SERVICE}/api/get-indent-of-spa-hybrid`, users.getIndentOfSpaDataHybrid)


//     // characterstic new api's
//      app.get(`${process.env.MICRO_SERVICE}/api/get-agro-ecological-regions`, users.getAgroEcologicalRegions)
//     app.post(`${process.env.MICRO_SERVICE}/api/get-crop-basic-data`, users.getCropBasicData)
//     // getCarryOverList

//     app.get(`${process.env.MICRO_SERVICE}/api/sync-lab-data`, users.syncLabData);
// };

