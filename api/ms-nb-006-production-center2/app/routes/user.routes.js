const seeders = require("../controllers/seeder.controller.js");
const users = require("../controllers/user.controller.js");
const indentor = require("../controllers/indentor.controller.js");
const processedSeed = require("../controllers/processed_seed.controller.js");
const apiValidation = require('../_middleware/api-validation.js');

require('dotenv').config()

const auth = require('../_middleware/auth');
module.exports = app => {
    app.post(`${process.env.MICRO_SERVICE}/api/nucleus-seed-availabity-data-submission`, auth, seeders.nucleusSeedAvailabitySubmission);
    app.post(`${process.env.MICRO_SERVICE}/api/get-nucleus-seed-availabity-data`, auth, seeders.getNucleusSeedAvailabityData1)
    // 
    app.post(`${process.env.MICRO_SERVICE}/api/get-nucleus-seed-availabity-data-second`, auth, seeders.getNucleusSeedAvailabityDataNew)
    app.post(`${process.env.MICRO_SERVICE}/api/delete-nucleus-seed-availabity-data-submission/:id`, auth, seeders.deleteNucleusSeedAvailabityDataSubmissionId);
    app.post(`${process.env.MICRO_SERVICE}/api/nucleous-seed-production-breeder-submission`, auth, seeders.allocationSeedProductionBreeder);
    app.post(`${process.env.MICRO_SERVICE}/api/get-crop-name`, auth, users.getCropName);
    app.post(`${process.env.MICRO_SERVICE}/api/get-crop-group`, auth, users.getCropGroup);
    app.post(`${process.env.MICRO_SERVICE}/api/get-crop-name-production-data`, auth, users.getCropNameProductionData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-user-data`, auth, seeders.getUserData);
    app.get(`${process.env.MICRO_SERVICE}/api/test`, users.test);
    app.post(`${process.env.MICRO_SERVICE}/api/get-breeder-seed-variety`, auth, seeders.getBreederSeedVariety);
    app.post(`${process.env.MICRO_SERVICE}/api/get-breeder-seed-variety-production-data`, auth, seeders.getBreederSeedVarietyProductionData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-production-season-filter-data`, auth, seeders.getProductionSeasonFilterData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-production-crop-name-filter-data`, auth, seeders.getProductionCropNameFilterData);

    app.post(`${process.env.MICRO_SERVICE}/api/add-lot-number`, auth, seeders.addLotNumber);
    app.post(`${process.env.MICRO_SERVICE}/api/get-lot-number`, auth, seeders.getLotNumber);
    app.post(`${process.env.MICRO_SERVICE}/api/update-lot-number`, auth, seeders.updateLotNumber);
    app.post(`${process.env.MICRO_SERVICE}/api/delete-lot-number/:id`, auth, seeders.deleteLotNumber);
    app.post(`${process.env.MICRO_SERVICE}/api/get-actual-seed-production`, auth, seeders.getActualSeedProduction);
    app.post(`${process.env.MICRO_SERVICE}/api/get-max-lot-size`, auth, seeders.getMaxLotSize);

    app.post(`${process.env.MICRO_SERVICE}/api/perform-submission`, auth, seeders.performaSeedSubmission);
    app.post(`${process.env.MICRO_SERVICE}/api/get-crop-veriety-list`, auth, users.getCropVerietyList)

    app.post(`${process.env.MICRO_SERVICE}/api/perform-submission`, auth, seeders.performaSeedSubmission);
    app.post(`${process.env.MICRO_SERVICE}/api/get-crop-veriety-list`, auth, users.getCropVerietyList)
    app.post(`${process.env.MICRO_SERVICE}/api/get-performa-breeder-seed-list`, auth, seeders.PerformaBreederSeedList)
    app.post(`${process.env.MICRO_SERVICE}/api/get-performa-breeder-seed-data/:id`, auth, seeders.PerformaBreederSeedWithId)

    app.post(`${process.env.MICRO_SERVICE}/api/perform-submission/:id`, auth, seeders.performaSeedSubmission);

    app.post(`${process.env.MICRO_SERVICE}/api/delete-perform-submission/:id`, auth, seeders.deletePerformaBreederSeedWithId);

    app.post(`${process.env.MICRO_SERVICE}/api/get-lot-numbers`, auth, seeders.getLotNumbers);
    app.post(`${process.env.MICRO_SERVICE}/api/get-label-number`, auth, seeders.getLabelNumber);
    app.post(`${process.env.MICRO_SERVICE}/api/get-label-number-all-details`, auth, seeders.getLabelNumber);

    app.post(`${process.env.MICRO_SERVICE}/api/get-lot-number`, auth, seeders.getLotNumber);
    app.post(`${process.env.MICRO_SERVICE}/api/get-label-number`, auth, seeders.getLabelNumber);
    app.post(`${process.env.MICRO_SERVICE}/api/get-label-number-all-details`, auth, seeders.getLabelNumber);
    //nucleus seed avaibility by breeder update
    app.post(`${process.env.MICRO_SERVICE}/api/update-nucleus-seed-availabity-submission`, auth, seeders.updatenucleusSeedAvailabitySubmission);
    app.post(`${process.env.MICRO_SERVICE}/api/get-crop-list`, auth, users.viewCrop)

    //check already exit data (nucleus breeder seed by avalability)
    app.post(`${process.env.MICRO_SERVICE}/api/check-already-exists-production-data`, auth, seeders.checkAlreadyExistsProductionData)
    app.post(`${process.env.MICRO_SERVICE}/api/check-year-of-indentor`, auth, seeders.viewIndentorYear)
    app.post(`${process.env.MICRO_SERVICE}/api/check-year-of-crop`, auth, seeders.viewIndentorCrop)
    app.post(`${process.env.MICRO_SERVICE}/api/get-created-by-name`, auth, seeders.getCreatedByName);
    app.get(`${process.env.MICRO_SERVICE}/api/count-lot-number`, seeders.countLotNumber);
    app.post(`${process.env.MICRO_SERVICE}/api/get-user-short-name`, auth, seeders.getUserShortName);
    app.get(`${process.env.MICRO_SERVICE}/api/used-lot-number`, seeders.usedLotNumber);
    app.post(`${process.env.MICRO_SERVICE}/api/indent-crop`, auth, seeders.indentCrop);
    app.get(`${process.env.MICRO_SERVICE}/api/get-all-lot-year`, seeders.getAllLotYear);

    // Nucleus Seed Availability Report(Seed Division Report)
    app.post(`${process.env.MICRO_SERVICE}/api/getNucleusSeedAvailabilityYearsforReports`, seeders.getNucleusSeedAvailabilityYearsforReports);
    app.post(`${process.env.MICRO_SERVICE}/api/getNucleusSeedAvailabilityCropforReports`, auth, seeders.getNucleusSeedAvailabilityCropforReports);
    app.post(`${process.env.MICRO_SERVICE}/api/getNucleusSeedAvailabilityforReports`, auth, seeders.getNucleusSeedAvailabilityforReports);

    // app.post(`${process.env.MICRO_SERVICE}/api/get-nucleus-seed-availabity-year-data`,   seeders.getNucleusSeedAvailabityYearData)
    // app.post(`${process.env.MICRO_SERVICE}/api/get-nucleus-seed-availabity-crop-name-data`,   seeders.getNucleusSeedAvailabityCropNameData)
    app.get(`${process.env.MICRO_SERVICE}/api/get-indent-year`, seeders.getIndentYear);
    app.post(`${process.env.MICRO_SERVICE}/api/get-indent-crop`, auth, seeders.getIndentCrop);
    app.post(`${process.env.MICRO_SERVICE}/api/get-nucleus-seed-availabity-year-data`, auth, seeders.getNucleusSeedAvailabityYearData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-nucleus-seed-availabity-breeder-crop-year-data`, auth, seeders.getNucleusSeedAvailabityYearDataBreederCrop)


    app.post(`${process.env.MICRO_SERVICE}/api/get-nucleus-seed-availabity-crop-name-data`, auth, seeders.getNucleusSeedAvailabityCropNameData)
    app.post(`${process.env.MICRO_SERVICE}/api/get-lot-size`, auth, seeders.getLotSize);
    app.post(`${process.env.MICRO_SERVICE}/api/get-nucleus-seed-availabity-variety-name-data`, auth, seeders.getNucleusSeedAvailabityVarietyNameData)

    app.post(`${process.env.MICRO_SERVICE}/api/get-nucleus-seed-availabity-variety-name-data`, auth, seeders.getNucleusSeedAvailabityVarietyNameData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-nucleus-seed-availabity-season-data`, auth, seeders.getNucleusSeedAvailabitySeasonData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-performa-breeder-seed-crop-group`, auth, seeders.getPerformabreederSeedtagCropGroup);
    app.post(`${process.env.MICRO_SERVICE}/api/get-performa-breeder-seed-crop-name`, auth, seeders.getPerformabreederSeedtagCropName);
    app.post(`${process.env.MICRO_SERVICE}/api/get-performa-breeder-seed-variety-name`, auth, seeders.getPerformabreederSeedtagVarietyName);

    app.post(`${process.env.MICRO_SERVICE}/api/get-chart-indent-data`, auth, seeders.getChartIndentData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-chart-data-by-crop`, auth, seeders.getChartDataByCrop);
    app.post(`${process.env.MICRO_SERVICE}/api/indetor-dashboard-crop-name`, auth, seeders.IndentorDashboardCropName);
    app.post(`${process.env.MICRO_SERVICE}/api/indetor-dashboard-variety-name`, auth, seeders.IndentorDashboardVarietyName);
    app.post(`${process.env.MICRO_SERVICE}/api/get-indeter-details`, auth, seeders.getIndenterDetails);
    app.post(`${process.env.MICRO_SERVICE}/api/get-avail-nucleus-seed`, auth, seeders.getAvailNucleusSeed);
    app.post(`${process.env.MICRO_SERVICE}/api/get-variety`, auth, seeders.getVariety);
    app.post(`${process.env.MICRO_SERVICE}/api/get-filter-data`, seeders.getIndenterDetails);
    app.post(`${process.env.MICRO_SERVICE}/api/get-total-lifted-count`, auth, seeders.getTotalLiftedCount);
    app.post(`${process.env.MICRO_SERVICE}/api/bsp2-card`, auth, seeders.bsp2Card);
    app.post(`${process.env.MICRO_SERVICE}/api/bsp4-card`, auth, seeders.bsp4Card);
    app.post(`${process.env.MICRO_SERVICE}/api/bsp5b-card`, auth, seeders.bsp5bCard);
    app.post(`${process.env.MICRO_SERVICE}/api/count-card-items`, auth, seeders.countCardItems);
    app.post(`${process.env.MICRO_SERVICE}/api/count-label-items`, auth, seeders.countLabelItems);
    app.post(`${process.env.MICRO_SERVICE}/api/get-performa-breeder-seed-year`, auth, seeders.getPerformabreederSeedtagYear);
    app.post(`${process.env.MICRO_SERVICE}/api/get-performa-breeder-seed-season`, auth, seeders.getPerformabreederSeedtagSeason);
    app.post(`${process.env.MICRO_SERVICE}/api/getbsp4ryearofindentreport`, auth, seeders.getbsp4ryearofindentreport);
    app.post(`${process.env.MICRO_SERVICE}/api/getbsp4seasonreport`, auth, seeders.getbsp4seasonreport);
    app.post(`${process.env.MICRO_SERVICE}/api/getbsp4cropTypereport`, auth, seeders.getbsp4cropTypereport);
    app.post(`${process.env.MICRO_SERVICE}/api/getbsp4pdpc`, auth, seeders.getbsp4pdpc);
    app.post(`${process.env.MICRO_SERVICE}/api/getbsp4cropName`, auth, seeders.getbsp4cropName);
    app.post(`${process.env.MICRO_SERVICE}/api/getbsp4VarietyName`, auth, seeders.getbsp4VarietyName);

    app.post(`${process.env.MICRO_SERVICE}/api/getbsp4reportData`, auth, seeders.getbsp4reportData);



    // Lot Number routes for Seed Testing Laboratory Report Form or Lot Number Grid View

    app.get(`${process.env.MICRO_SERVICE}/api/getLotNumberYears`, seeders.getLotNumberYears);
    app.get(`${process.env.MICRO_SERVICE}/api/getLotNumberSeasons`, seeders.getLotNumberSeasons);
    app.get(`${process.env.MICRO_SERVICE}/api/getLotNumberCrops`, seeders.getLotNumberCrops);
    app.get(`${process.env.MICRO_SERVICE}/api/getLotNumberVarieties`, seeders.getLotNumberVarieties);


    // Proforma of Breeder Seed Tag 

    // app.get(`${process.env.MICRO_SERVICE}/api/getYearForTagProforma` ,  seeders.getYearForTagProforma);
    // app.get(`${process.env.MICRO_SERVICE}/api/getSeasonsForTagProforma`,  seeders.getSeasonsForTagProforma);
    app.get(`${process.env.MICRO_SERVICE}/api/getCropsForTagProforma`, seeders.getCropsForTagProforma);
    app.get(`${process.env.MICRO_SERVICE}/api/getVarietiesForTagProforma`, seeders.getVarietiesForTagProforma);
    app.post(`${process.env.MICRO_SERVICE}/api/get-indent-cropformNumber`, auth, seeders.getIndentCropForLotNumber);
    app.post(`${process.env.MICRO_SERVICE}/api/get-season-for-lotNumber`, auth, seeders.getSeasonForLotNumber);
    app.post(`${process.env.MICRO_SERVICE}/api/get-year-for-lotNumber`, auth, seeders.getYearForLotNumber);
    app.post(`${process.env.MICRO_SERVICE}/api/get-variety-for-indentor`, auth, seeders.getVarietyForIndentor)
    app.post(`${process.env.MICRO_SERVICE}/api/get-variety-for-indentor-new`, auth, seeders.getVarietyForIndentorNew);
    app.post(`${process.env.MICRO_SERVICE}/api/getNucleusSeedAvailabilityforReportsSeason`, auth, seeders.getNucleusSeedAvailabilityforReportsSeason);
    app.post(`${process.env.MICRO_SERVICE}/api/getNucleusSeedAvailabilityforReportsName`, auth, seeders.getNucleusSeedAvailabilityforReportsName);
    app.post(`${process.env.MICRO_SERVICE}/api/getNucleusSeedAvailabilityforReportsVarieytName`, auth, seeders.getNucleusSeedAvailabilityforReportsVarietyName);
    app.post(`${process.env.MICRO_SERVICE}/api/getNucleusSeedAvailabilityforReportsCroptName`, auth, seeders.getNucleusSeedAvailabilityforReportsCropName);
    app.post(`${process.env.MICRO_SERVICE}/api/getNucleusSeedAvailabityYearListData`, auth, seeders.getNucleusSeedAvailabityYearListData);
    app.post(`${process.env.MICRO_SERVICE}/api/getProductionSeasonFilterListData`, auth, seeders.getProductionSeasonFilterListData);
    app.post(`${process.env.MICRO_SERVICE}/api/getProductionCropNameFilterListData`, auth, seeders.getProductionCropNameFilterListData);
    app.post(`${process.env.MICRO_SERVICE}/api/getNucleusSeedAvailabityVarietyNameListData`, auth, seeders.getNucleusSeedAvailabityVarietyNameListData)
    app.post(`${process.env.MICRO_SERVICE}/api/getNucleusSeedAvailabityVarietyNameListData`, auth, seeders.getNucleusSeedAvailabityVarietyNameListData)

    //check-nulceus-seed-form-fill-by-production
    app.post(`${process.env.MICRO_SERVICE}/api/check-nuleus-production-form-fill-by-production`, auth, seeders.checkNulcuesFormProductionDataisFill)
    app.post(`${process.env.MICRO_SERVICE}/api/getAgencyDetailLabelData`, auth, seeders.getAgencyDetailLabelData)
    app.post(`${process.env.MICRO_SERVICE}/api/getNucleusSeedCropType`, auth, seeders.getNucleusSeedCropType);
    app.post(`${process.env.MICRO_SERVICE}/api/getNucleusSeedseed`, auth, seeders.getNucleusSeedseed);

    // production dashboard new api
    app.post(`${process.env.MICRO_SERVICE}/api/get-bspc-card-filter-crop-data`, auth, seeders.getBspcFilterCropData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-production-dashboard-item-count`, auth, seeders.getProductionDashboardItemCount);
    app.post(`${process.env.MICRO_SERVICE}/api/get-production-dashboard-allocation-quntity`, auth, seeders.getAllocationDashboardData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-bspc-chart-allocate-data`, auth, seeders.getBspcChartAllocateData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-bspc-chart-allocate-data-variety`, auth, seeders.getBspcChartAllocateDataVariety);
    app.post(`${process.env.MICRO_SERVICE}/api/get-bspc-chart-all-allocater`, auth, seeders.getBspcChartAllAllocater);
    app.post(`${process.env.MICRO_SERVICE}/api/get-bspc-chart-all-allocater-crop`, auth, seeders.getBspcChartAllAllocaterCrop);
    app.post(`${process.env.MICRO_SERVICE}/api/getNucleusSeedAvailabilityforReportsSecond`, auth, seeders.getNucleusSeedAvailabilityforReportsSecond);
    app.post(`${process.env.MICRO_SERVICE}/api/getNucleusSeedAvailabilityCropType`, seeders.getNucleusSeedAvailabilityCropType);
    app.post(`${process.env.MICRO_SERVICE}/api/getNucleusSeedAvailabilityforReportsNameSecond`, seeders.getNucleusSeedAvailabilityforReportsNameSecond);
    app.post(`${process.env.MICRO_SERVICE}/api/getBspcChartAllAllocaterSecond`, auth, seeders.getBspcChartAllAllocaterSecond);
    app.post(`${process.env.MICRO_SERVICE}/api/getVarietyNucleusSeedAvailabilityforReports`, auth, seeders.getVarietyNucleusSeedAvailabilityforReports);
    // app.post(`${process.env.MICRO_SERVICE}/api/getNucleusSeedAvailabilityforReportsNameSecond`, seeders.getNucleusSeedAvailabilityforReportsNameSecond);

    //new api for bsp4 reports
    app.post(`${process.env.MICRO_SERVICE}/api/getbsp4VarietyNameSecond`, auth, seeders.getbsp4VarietyNameSecond);

    //direct indent routes
    app.post(`${process.env.MICRO_SERVICE}/api/saveDirectIndent`, auth, indentor.saveDirectIndent);
    app.post(`${process.env.MICRO_SERVICE}/api/getAllDirectIndent`, auth, indentor.getAllDirectIndents);
    app.get(`${process.env.MICRO_SERVICE}/api/getIndentYear`, auth, indentor.getIndentYear);
    app.post(`${process.env.MICRO_SERVICE}/api/deleteDirectIndent`, auth, indentor.deleteDirectIndent);
    app.post(`${process.env.MICRO_SERVICE}/api/getSpaList`, auth, indentor.getSpaList);
    app.post(`${process.env.MICRO_SERVICE}/api/updateDirectIndent`, auth, indentor.updateDirectIndent);

    // BSP 3rd
    app.post(`${process.env.MICRO_SERVICE}/api/get-bsp-proforma3-data`, auth, indentor.getBspProforma3Data);
    app.post(`${process.env.MICRO_SERVICE}/api/get-bsp-proforma3-data-byId`, indentor.getBspProforma3DataById);
    app.post(`${process.env.MICRO_SERVICE}/api/bsp-proforma3-year`, auth, indentor.getBspProformaYears);
    app.post(`${process.env.MICRO_SERVICE}/api/bsp-proforma3-season`, auth, indentor.getBspProformaSeason);
    app.post(`${process.env.MICRO_SERVICE}/api/get-crop-data`, auth, indentor.getCropList);
    app.post(`${process.env.MICRO_SERVICE}/api/get-variety-data`, auth, indentor.getBSP3rdVarietyList);
    app.post(`${process.env.MICRO_SERVICE}/api/create-new-spa`, auth, indentor.createNewSpa);
    app.post(`${process.env.MICRO_SERVICE}/api/get-direct-indent-variety-list`, auth, indentor.getDirectIndentVarietyList);
    app.post(`${process.env.MICRO_SERVICE}/api/get-direct-indent-variety-line`, auth, indentor.getDirectIndentVarietyLineData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-all-crop-list`, auth, indentor.viewAllCropForDirectIndent)

    app.post(`${process.env.MICRO_SERVICE}/api/get-year-of-indent-spa`, auth, users.getYearOfIndentSpa);
    app.post(`${process.env.MICRO_SERVICE}/api/get-season-of-indent-spa`, auth, users.getSeasonOfIndentSpa);
    app.post(`${process.env.MICRO_SERVICE}/api/get-crop-of-indent-spa`, auth, users.getCropOfIndentSpa);
    app.post(`${process.env.MICRO_SERVICE}/api/get-state-of-indent-spa`, auth, users.getStateOfIndentSpa);
    app.post(`${process.env.MICRO_SERVICE}/api/unfreeze-indent-spa`, auth, users.unfreezeIndentSpa);
    //
    app.post(`${process.env.MICRO_SERVICE}/api/get-bsp-proforma-2s-details`, users.getBspProforma2sDetails);
    app.post(`${process.env.MICRO_SERVICE}/api/authenticate-app-user`, users.authenticateAppUser);
    app.post(`${process.env.MICRO_SERVICE}/api/reg-bsp-proforma-2s-insp-rep`, users.registerBspProforma2sInspectionReport);
    //
    app.post(`${process.env.MICRO_SERVICE}/api/get-bsp-proforma-1s-varieties`, auth, users.getBspProforma1sVarieties);
    app.post(`${process.env.MICRO_SERVICE}/api/get-bsp-proforma-2s-varieties`, auth, users.getBspProforma2sVarieties);
    app.post(`${process.env.MICRO_SERVICE}/api/get-varieties-parental-line`, auth, users.getVarietiesParentalLine);
    app.post(`${process.env.MICRO_SERVICE}/api/get-line-of-seed-inventory`, auth, users.getLineOfSeedInventory);
    app.post(`${process.env.MICRO_SERVICE}/api/get-seed-type-of-seed-inventory`, auth, users.getSeedTypeOfSeedInventory);
    app.post(`${process.env.MICRO_SERVICE}/api/get-stage-of-seed-inventory`, auth, users.getStageOfSeedInventory);
    app.post(`${process.env.MICRO_SERVICE}/api/get-year-of-seed-inventory`, auth, users.getYearOfSeedInventory);
    app.post(`${process.env.MICRO_SERVICE}/api/get-season-of-seed-inventory`, auth, users.getSeasonOfSeedInventory);
    app.post(`${process.env.MICRO_SERVICE}/api/get-lot-of-seed-inventory`, auth, users.getLotNoOfSeedInventory);
    app.post(`${process.env.MICRO_SERVICE}/api/get-tag-of-seed-inventory`, auth, users.getTagNoOfSeedInventory);
    app.post(`${process.env.MICRO_SERVICE}/api/check-quantity-of-seed-inventory`, auth, users.checkQuantityOfSeedInventory);
    app.post(`${process.env.MICRO_SERVICE}/api/register-quantity-of-seed-inventory`, auth, users.registerQuantityOfSeedInventory);
    app.post(`${process.env.MICRO_SERVICE}/api/get-bsp-proforma-2s-list`, auth, users.getBspProforma2sList);
    app.post(`${process.env.MICRO_SERVICE}/api/get-bsp-proforma-1s-varieties-level-1`, auth, users.getBspProforma1sVarietiesLevel1);
    app.post(`${process.env.MICRO_SERVICE}/api/get-bsp-proforma-1s-varieties-level-2`, auth, users.getBspProforma1sVarietiesLevel2);
    app.post(`${process.env.MICRO_SERVICE}/api/finalise-bsp-proforma-2s-data`, auth, users.finaliseBspProforma2sData);
    app.post(`${process.env.MICRO_SERVICE}/api/delete-bsp-proforma-2s-data`, auth, users.deleteBspProforma2sData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-bsp-proforma-2s-edit-data`, auth, users.getBspProforma2sEditData);
    app.post(`${process.env.MICRO_SERVICE}/api/check-edit-quantity-of-seed-inventory`, auth, users.checkEditQuantityOfSeedInventory);
    app.post(`${process.env.MICRO_SERVICE}/api/edit-bsp-proforma-2s-data`, auth, users.editBspProforma2sData);
    app.get(`${process.env.MICRO_SERVICE}/api/update-inspection-report`, seeders.updateInspectionReport);
    app.get(`${process.env.MICRO_SERVICE}/api/variefy-inspection-report`, seeders.variefyInspectionReport);
    app.post(`${process.env.MICRO_SERVICE}/api/get-harvesting-inatake-year`, auth, indentor.getHarvestingIntakeYear);
    app.post(`${process.env.MICRO_SERVICE}/api/get-harvesting-inatake-season`, auth, indentor.getHarvestingIntakeSeason);
    app.post(`${process.env.MICRO_SERVICE}/api/get-harvesting-inatake-crop`, auth, indentor.getHarvestingIntakeCrop);
    app.post(`${process.env.MICRO_SERVICE}/api/get-harvesting-inatake-variety`, auth, indentor.getHarvestingIntakeVariety);
    app.post(`${process.env.MICRO_SERVICE}/api/get-harvesting-inatake-variety-line`, auth, indentor.getHarvestingIntakeVarietyLine);
    app.post(`${process.env.MICRO_SERVICE}/api/get-harvesting-inatake-variety-plot`, auth, indentor.getHarvestingIntakeVarietyplot);
    app.post(`${process.env.MICRO_SERVICE}/api/get-inspection-area`, auth, indentor.getInspectionArea);
    app.post(`${process.env.MICRO_SERVICE}/api/get-spp-data`, auth, indentor.getSppData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-bag-data`, auth, indentor.getBagRange);
    app.post(`${process.env.MICRO_SERVICE}/api/save-inspect-harvesting`, indentor.saveInvestHarvesting);
    app.post(`${process.env.MICRO_SERVICE}/api/get-inspect-harvesting`, auth, indentor.getInvestHarvesting);
    app.post(`${process.env.MICRO_SERVICE}/api/get-inspect-harvesting-id`, auth, indentor.getInvestHarvestingByid);
    app.post(`${process.env.MICRO_SERVICE}/api/update-inspect-harvesting-id`, auth, indentor.updateInvestHarvesting);
    app.post(`${process.env.MICRO_SERVICE}/api/delete-inspect-harvesting-data`, auth, indentor.deleteInvestHarvestingData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-harvesting-verification-year`, auth, indentor.getHarvestingVerificationYear);
    app.post(`${process.env.MICRO_SERVICE}/api/get-harvesting-verification-season`, auth, indentor.getHarvestingVerificationSeason);
    app.post(`${process.env.MICRO_SERVICE}/api/get-harvesting-verification-crop`, auth, indentor.getHarvestingVerificationCrop);
    app.post(`${process.env.MICRO_SERVICE}/api/get-harvesting-verification-data`, auth, indentor.getInvestVerificationData);
    app.post(`${process.env.MICRO_SERVICE}/api/update-harvesting-verification-status`, auth, indentor.UpdateStatusofInvestingHarvest);
    app.post(`${process.env.MICRO_SERVICE}/api/get-bag-marka`, auth, indentor.getBagMarka);
    app.post(`${process.env.MICRO_SERVICE}/api/get-stack-no`, auth, indentor.getStackNo);
    app.post(`${process.env.MICRO_SERVICE}/api/add-investing-verify`, auth, indentor.addInvestingVerify);
    app.post(`${process.env.MICRO_SERVICE}/api/get-investing-verify-id`, auth, indentor.getInvestingVerifyId);
    app.post(`${process.env.MICRO_SERVICE}/api/get-bag-marka-data`, auth, indentor.getBagMarkaData);
    app.post(`${process.env.MICRO_SERVICE}/api/update-investing-verify`, auth, indentor.updateInvestingVerify);
    app.post(`${process.env.MICRO_SERVICE}/api/get-investing-verify-of-stack`, auth, indentor.getInvestingVerifyStack);
    app.post(`${process.env.MICRO_SERVICE}/api/get-investing-harvesting-data`, auth, indentor.getHarvestingVerificationVariety);
    app.post(`${process.env.MICRO_SERVICE}/api/get-lot-number-invest`, auth, indentor.getLotNo);
    app.post(`${process.env.MICRO_SERVICE}/api/get-total-qty-of-carry-over`, auth, indentor.gettotalQuantityOfCarryOver);
    app.post(`${process.env.MICRO_SERVICE}/api/register-quantity-carry`, auth, users.registerQuantityOfCarryOver);
    app.post(`${process.env.MICRO_SERVICE}/api/register-quantity-carry`, auth, users.registerQuantityOfCarryOver);
    app.post(`${process.env.MICRO_SERVICE}/api/get-carry-over-list`, auth, users.getCarryOverList);
    app.post(`${process.env.MICRO_SERVICE}/api/get-carry-over-variety`, auth, users.getCarryOverVariety);
    app.post(`${process.env.MICRO_SERVICE}/api/get-carry-over-variety-grid`, auth, users.getCarryOverVarietiesGrid);
    app.post(`${process.env.MICRO_SERVICE}/api/get-carry-over-by-id`, auth, users.getCarryOverListEditById);
    app.post(`${process.env.MICRO_SERVICE}/api/edit-carry-over-seed-by-id`, auth, users.editCarryOverSeedById);
    app.post(`${process.env.MICRO_SERVICE}/api/delete-carry-data`, auth, users.deleteCarryData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-class-quantity`, auth, users.getClassQuantity);
    app.post(`${process.env.MICRO_SERVICE}/api/freeze-data-carry-over`, auth, users.FreezeDataCarryOver);
    app.post(`${process.env.MICRO_SERVICE}/api/get-varieties-parental-line-for-carry-over`, auth, users.getVarietiesParentalLineForCarryOver);
    app.post(`${process.env.MICRO_SERVICE}/api/get-varieties-parental-line-v1`, auth, users.getVarietiesParentalLineV1);
    app.post(`${process.env.MICRO_SERVICE}/api/get-bsp-two-performa-year-data`, auth, users.getBspOnePerformaYearData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-bsp-two-performa-season-data`, auth, users.getBspOnePerformaSeason);
    app.post(`${process.env.MICRO_SERVICE}/api/get-bsp-two-performa-crop-data`, auth, users.getBspOnePerformaCrop);
    app.post(`${process.env.MICRO_SERVICE}/api/get-varieties-parental-line-v1-second`, auth, users.getVarietiesParentalLineV1Second);
    app.post(`${process.env.MICRO_SERVICE}/api/get-seed-processing-reg-year`, auth, users.getSeedProcessingRegYear);
    app.post(`${process.env.MICRO_SERVICE}/api/get-seed-processing-reg-season`, auth, users.getSeedProcessingRegSeason);
    app.post(`${process.env.MICRO_SERVICE}/api/get-seed-processing-reg-crop`, auth, users.getSeedProcessingRegCrop);
    app.post(`${process.env.MICRO_SERVICE}/api/get-seed-processing-reg-data`, users.getSeedProcessingRegData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-seed-processing-reg-stack`, auth, users.getSeedProcessingRegStack);
    app.post(`${process.env.MICRO_SERVICE}/api/add-seed-processing-reg`, auth, users.saveProcessedSeedDetails);
    app.post(`${process.env.MICRO_SERVICE}/api/get-seed-processing-reg-carry`, auth, users.getSeedProcessingRegDataCarry);
    app.post(`${process.env.MICRO_SERVICE}/api/get-seed-processing-reg-lot`, auth, users.getSeedProcessingRegLot);
    app.post(`${process.env.MICRO_SERVICE}/api/get-carry-over-variety-grid-second`, auth, users.getCarryOverVarietiesGridSecond);
    app.post(`${process.env.MICRO_SERVICE}/api/forward-to-generate-slip`, auth, users.forwardtoGenerateSlip);
    app.post(`${process.env.MICRO_SERVICE}/api/get-seed-processing-reg-carry-second`, auth, users.getSeedProcessingRegDataCarrySecond);
    app.post(`${process.env.MICRO_SERVICE}/api/get-investing-harvesting-data-second`, auth, indentor.getHarvestingVerificationVarietySecond);
    app.post(`${process.env.MICRO_SERVICE}/api/get-seed-inventory-old-stock`, auth, processedSeed.getseedInventoryforOldStock);
    app.post(`${process.env.MICRO_SERVICE}/api/add-seed-processing-reg-old-stock`, auth, processedSeed.saveProcessedSeedDetailsOldStock);
    app.post(`${process.env.MICRO_SERVICE}/api/get-seed-processing-reg-stack-old-stock`, auth, processedSeed.getSeedProcessingRegStackOldStock);
    app.post(`${process.env.MICRO_SERVICE}/api/get-seed-processing-reg-stack-old-stock-lot`, auth, processedSeed.getseedInventoryforOldStockLot);
    app.post(`${process.env.MICRO_SERVICE}/api/get-year-of-bsp-four`, auth, processedSeed.getYearofBsp4);
    app.post(`${process.env.MICRO_SERVICE}/api/get-season-of-bsp-four`, auth, processedSeed.getSeeasonofBspFour);
    app.post(`${process.env.MICRO_SERVICE}/api/get-crop-of-bsp-four`, auth, processedSeed.getCropofBspFour);
    app.post(`${process.env.MICRO_SERVICE}/api/get-total-qty-of-bsp-four`, auth, processedSeed.getTotalQtyDataofCropbspFour);
    app.post(`${process.env.MICRO_SERVICE}/api/get-data-of-bsp-four`, auth, processedSeed.getDataOfBspFour);
    app.post(`${process.env.MICRO_SERVICE}/api/save-data-of-bsp-four`, auth, processedSeed.saveDataofBspFour);
    app.post(`${process.env.MICRO_SERVICE}/api/get-year-of-tags-number`, auth, processedSeed.getYearofTagsNumber);
    app.post(`${process.env.MICRO_SERVICE}/api/get-season-of-tags-number`, auth, processedSeed.getSeasonofTagsNumber);
    app.post(`${process.env.MICRO_SERVICE}/api/get-crop-of-tags-number`, auth, processedSeed.getCropofTagsNumber);
    app.post(`${process.env.MICRO_SERVICE}/api/get-generating-tag-of-lot`, auth, processedSeed.getStlData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-data-generating-tags`,   processedSeed.getDataofSeedTags);
    app.post(`${process.env.MICRO_SERVICE}/api/save-data-seed-tags`, auth, processedSeed.savegeneratingLotTags);
    app.post(`${process.env.MICRO_SERVICE}/api/get-tag-data`, auth, processedSeed.getTagData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-agency-data`, processedSeed.getAgencyData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-variety-data-stl`, auth, processedSeed.getVarietyDataofStl);
    app.post(`${process.env.MICRO_SERVICE}/api/get-lot-data-stl`, auth, processedSeed.getLotDataofStl);
    app.post(`${process.env.MICRO_SERVICE}/api/update-lot-status`, auth, processedSeed.updateLotStatus);
    app.post(`${process.env.MICRO_SERVICE}/api/get-seed-tags-details`, auth, processedSeed.getSeedtagsData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-lot-from-range`, auth, processedSeed.getlotfromrange);
    app.post(`${process.env.MICRO_SERVICE}/api/update-lot-status-range`, auth, processedSeed.updateLotStatusRange);
    app.post(`${process.env.MICRO_SERVICE}/api/get-year-of-bsp-four-report`, auth, processedSeed.getYearofbspfourReport);
    app.post(`${process.env.MICRO_SERVICE}/api/get-season-of-bsp-four-report`, auth, processedSeed.getSeasonofbspfourReport);
    app.post(`${process.env.MICRO_SERVICE}/api/get-crop-type-of-bsp-four-report`, auth, processedSeed.getCropTypefbspfourReport);
    app.post(`${process.env.MICRO_SERVICE}/api/get-crop-of-bsp-four-report`, auth, processedSeed.getCropfbspfourReport);
    app.post(`${process.env.MICRO_SERVICE}/api/get-bsp-four-report`, auth, processedSeed.getbspfourData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-lifting-data-year`, auth, processedSeed.getLiftingDataYear);
    app.post(`${process.env.MICRO_SERVICE}/api/get-lifting-data-season`, auth, processedSeed.getLiftingDataSeason);
    app.post(`${process.env.MICRO_SERVICE}/api/get-lifting-data-crop`, auth, processedSeed.getLiftingDataCrop);
    app.post(`${process.env.MICRO_SERVICE}/api/get-lifting-data-print`, auth, processedSeed.getLiftingDataViewPrint);
    app.post(`${process.env.MICRO_SERVICE}/api/get-lifting-data-variety`, auth, processedSeed.getLiftingDataVariety);
    app.post(`${process.env.MICRO_SERVICE}/api/get-lifting-data-indentor`, auth, processedSeed.getLiftingDataIndentor);
    app.post(`${process.env.MICRO_SERVICE}/api/get-lifting-data-spa`, auth, processedSeed.getLiftingDataSpa);
    app.post(`${process.env.MICRO_SERVICE}/api/get-lifting-data-bill-number`, auth, processedSeed.getLiftingDataBillNumber);
    app.post(`${process.env.MICRO_SERVICE}/api/get-lifting-data-bill-cerificate`, processedSeed.getLiftingDataCertificate);
    app.post(`${process.env.MICRO_SERVICE}/api/save-generate-breeder-seed-certificate`, auth, processedSeed.savegenerateCerticate);
    app.post(`${process.env.MICRO_SERVICE}/api/save-generate-breeder-seed-certificate`, auth, processedSeed.savegenerateCerticate);

    app.post(`${process.env.MICRO_SERVICE}/api/generate-invoice-data`, processedSeed.generateInoviceData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-variety-price-data`, auth, processedSeed.getVarietyPriceList);
    app.post(`${process.env.MICRO_SERVICE}/api/get-bill-print-data`, processedSeed.getBillPrintData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-commnets-list`, auth, processedSeed.getCommnetsListData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-seed-processing-reg-data-for-fresh-stock`, auth, users.getSeedProcessingRegDataforfreshStock);
    app.post(`${process.env.MICRO_SERVICE}/api/get-generate-invoice-data`, auth, processedSeed.getGenerateInvoiceData);


    app.post(`${process.env.MICRO_SERVICE}/api/get-tag-details`,  processedSeed.getTagDetails);



    // app.post(`${process.env.MICRO_SERVICE}/api/get-invoice-payment-year`, apiValidation, processedSeed.getInvoicePaymentYear);
    // app.post(`${process.env.MICRO_SERVICE}/api/get-invoice-payment-season`, apiValidation, processedSeed.getInvoicePaymentSeason);
    // app.post(`${process.env.MICRO_SERVICE}/api/get-invoice-payment-crop`, apiValidation, processedSeed.getInvoicePaymentCrop);
    // app.post(`${process.env.MICRO_SERVICE}/api/get-invoice-payment-variety`,apiValidation, processedSeed.getInvoicePaymentVariety);
    // app.post(`${process.env.MICRO_SERVICE}/api/get-invoice-payment-data`, processedSeed.getInvoicePaymentData);
    // app.post(`${process.env.MICRO_SERVICE}/api/save-invoice-data`,apiValidation,  processedSeed.saveInvoiceData);
    // app.post(`${process.env.MICRO_SERVICE}/api/update-invoice-data`,apiValidation, processedSeed.payInvoiceData);
    // // get-investing-harvesting-data    
    // app.post(`${process.env.MICRO_SERVICE}/api/get-inspect-harvesting`,auth, indentor.getBagRange);
    
    //CROP STATUS REPORT
    app.post(`${process.env.MICRO_SERVICE}/api/crop-status-reports`, indentor.CropStatusReport);

    //BSPC STATUS REPORT
      
    app.post(`${process.env.MICRO_SERVICE}/api/get-bsp-proforma-one-year-data-report`,auth, indentor.getBspProformaOneYearDataReport);  
    app.post(`${process.env.MICRO_SERVICE}/api/get-bsp-proforma-one-season-data-report`,auth, indentor.getBspProformaOneSeasonDataReport);  
    app.post(`${process.env.MICRO_SERVICE}/api/get-bsp-proforma-one-crop-data-report`,auth, indentor.getBspProformaOneCropDataReport);
    app.post(`${process.env.MICRO_SERVICE}/api/bsp-one-status-reports`,auth, indentor.bspOneStatusReport);
     

    app.post(`${process.env.MICRO_SERVICE}/api/get-bsp-two-performa-year-data-report`, auth, indentor.getBspOnePerformaYearDataReport);
    app.post(`${process.env.MICRO_SERVICE}/api/get-bsp-two-performa-season-data-report`, auth,  indentor.getBspOnePerformaSeasonReport);
    app.post(`${process.env.MICRO_SERVICE}/api/get-bsp-two-performa-crop-data-report`, auth, indentor.getBspOnePerformaCropReport);

    app.post(`${process.env.MICRO_SERVICE}/api/bsp-proforma3-year-report`, auth, indentor.getBspProformaYearsReport);
    app.post(`${process.env.MICRO_SERVICE}/api/bsp-proforma3-season-report`, auth, indentor.getBspProformaSeasonReport);
    app.post(`${process.env.MICRO_SERVICE}/api/get-crop-data-report`, auth, indentor.getCropListReport);

    // BSP report
    app.post(`${process.env.MICRO_SERVICE}/api/bsp-three-status-reports`,auth,  indentor.bspThreeStatusReport);
    app.post(`${process.env.MICRO_SERVICE}/api/bsp-two-status-reports`,auth,indentor.bspTwoStatusReport);
    app.post(`${process.env.MICRO_SERVICE}/api/bsp-two-status-reports-check-status`,auth,indentor.bspTwoStatusReportCheckStatus);
    

    // inability flow
    app.post(`${process.env.MICRO_SERVICE}/api/get-inability-intake-variety-plot`, auth, indentor.getInabilityIntakeVarietyplot);
    app.post(`${process.env.MICRO_SERVICE}/api/get-bsp-proforma-1s-varieties-level-1-phase-2`, auth, users.getBspProforma1sVarietiesLevel1Phase2);
};

