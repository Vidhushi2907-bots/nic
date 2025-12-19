const sequelize = require("./db.js");
const Sequelize = require('sequelize');
const receipt_generate_bagsModel = require("./receipt_generate_bags.model.js");
const userModel = require("./user.model");
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.stateModel = require("./state.model")(sequelize, Sequelize);
db.nucleusSeedAvailabityModel = require("./nucleus_seed_availabity.model")(sequelize, Sequelize);
db.cropGroupModel = require("./crop_group.model")(sequelize, Sequelize);
db.cropModel = require("./crop.model")(sequelize, Sequelize);
db.agencyDetailModel = require("./agency_detail.model")(sequelize, Sequelize);
db.userModel = require("./user.model")(sequelize, Sequelize);
db.userTypeModel = require("./user_type.model")(sequelize, Sequelize);
db.varietyModel = require("./variety.model")(sequelize, Sequelize);
db.cropVerietyModel = require("./crop_veriety.model")(sequelize, Sequelize);
db.Chats = require("./chats.model")(sequelize, Sequelize);
db.breederCropModel = require("./breeder_crop.model")(sequelize, Sequelize); 
// db.cropVeriety = require("./m_crop_varieties.model")(sequelize, Sequelize);
db.lotNumberModel = require("./lot_number.model")(sequelize, Sequelize); 
db.bsp4Model = require("./bsp4.model")(sequelize, Sequelize);
db.bsp1Model = require("./bsp1.model")(sequelize, Sequelize);
db.bsp2Model = require("./bsp2.model")(sequelize, Sequelize);
db.bsp3Model = require("./bsp3.model")(sequelize, Sequelize);
db.bsp5aModel = require("./bsp5a.model")(sequelize, Sequelize);
db.monitoringTeamsModel = require("./monitoring_teams.model.js")(sequelize, Sequelize);
db.breederCertificate = require("./breeder_certificate.model")(sequelize, Sequelize);
db.bsp1ProductionCenterModel = require("./bsp1_production_center.model")(sequelize, Sequelize);
db.performaSeedModel = require("./performa_seed.model")(sequelize, Sequelize);
db.maxLotSizeModel = require("./m_max_lot_size.model")(sequelize, Sequelize);
db.labelNumberForBreederseed = require("./label_number_for_breederseed.model")(sequelize, Sequelize);
db.generatedLabelNumberModel = require("./generated_label_number.model")(sequelize, Sequelize);
db.indentOfBreederseedModel = require('./indents_of_breeder.model')(sequelize, Sequelize);
db.seedTestingReportsModel = require("./seed_testing_reports.model")(sequelize, Sequelize);
db.cropVerietyModel = require("./crop_veriety.model")(sequelize, Sequelize);
db.breederCropsVerietiesModel = require("./breeder_crops_verieties.model")(sequelize, Sequelize);
db.seasonModel = require("./season.model")(sequelize, Sequelize);
db.tokens = require("../models/token.model.js")(sequelize, Sequelize);
db.allocationToIndentor = require("./allocation_to_indentor.model")(sequelize, Sequelize);
db.bsp5bModel = require("./bsp5b.model")(sequelize, Sequelize);
db.bspProforma1sModel = require("./bsp_proforma_1s.model.js")(sequelize, Sequelize);
db.bsp4ToPlant = require("./bsp4_to_plant.model")(sequelize, Sequelize);
db.plantDetail = require("./plant_detail.model")(sequelize, Sequelize);
db.designationModel = require('./designation_model.js')(sequelize, Sequelize);
db.generateBills = require("./generate_bill.model")(sequelize, Sequelize);
db.bspctoplantModel = require("./bspc_to_plants.model.js")(sequelize, Sequelize);
db.seedLabTestModel = require("./m_seed_lab_test.model")(sequelize, Sequelize);
db.allocationToIndentorProductionCenterSeed = require("./allocation_to_indentor_for_lifting_seed_production_cnter.model")(sequelize, Sequelize);
db.allocationToIndentorLiftingSeed = require("./allocation_to_indentor_for_lifting_seeds.model")(sequelize, Sequelize);
db.seedForProductionModel = require('./seed_for_production.model')(sequelize, Sequelize);
db.seedInventory = require('./seed_inventory.model.js')(sequelize, Sequelize);
db.directIndent = require('./direct_indent.model.js')(sequelize, Sequelize);
db.bspProrforma3Model = require('./bsp_proforma_3.model.js')(sequelize, Sequelize);
db.bspProrforma2Model = require('./bsp_proforma_2.model.js')(sequelize, Sequelize);
db.districtModel = require('./district.model.js')(sequelize, Sequelize);
db.commentsModel = require('./comments.model.js')(sequelize, Sequelize);
db.bspProforma1BspcsModel = require('./bsp_proforma_1_bspcs.model.js')(sequelize, Sequelize);
db.monitoringTeamPdpc = require('./monitoring_team_pdpc.model')(sequelize, Sequelize);
db.monitoringTeamPdpcDetails = require('./monitoring_team_pdpc_details.model')(sequelize, Sequelize);
db.monitoringTeamOfBspcMember = require('./monitoring_team_of_bspc_member.model')(sequelize, Sequelize);
db.monitoringTeamOfBspc = require('./monitoring_team_of_bspc.model')(sequelize, Sequelize);
db.agencytypeModel = require('./agency_type.model.js')(sequelize, Sequelize);
db.monitoringTeamAssignedToBspcsModel = require('./monitoring_team_assigned_to_bspcs.model.js')(sequelize, Sequelize);
db.varietyCategoryMappingModel = require('./variety_lines.model.js')(sequelize, Sequelize);
db.indentOfBrseedDirectLineModel = require('./indent_of_brseed_direct_line.model.js')(sequelize, Sequelize);
db.varietyLinesModel = require('./variety_lines.model.js')(sequelize, Sequelize);
db.VarietyLines = require('./variety_line.model.js')(sequelize, Sequelize);

db.stageModel = require('./stage.model.js')(sequelize, Sequelize);
db.seedInventoryTag = require('./seed_inventory_tag.model')(sequelize, Sequelize);
db.seedInventoryTagDetail = require('./seed_inventory_tag_detail.model')(sequelize, Sequelize);
db.indenterSPAModel = require("./indent_of_spa.model")(sequelize, Sequelize);
db.bspPerformaBspOne = require('./bsp_proforma_1.model.js')(sequelize, Sequelize);
db.bspPerformaBspTwo = require('./bsp_proforma_2.model.js')(sequelize, Sequelize);
db.bspPerformaBspTwoSeed = require('./bsp_proforma_2_seed.model')(sequelize, Sequelize);
db.bspPerformaBspThree = require('./bsp_proforma_3.model.js')(sequelize, Sequelize);
db.bspProformaOneBspc = require('./bsp_proforma_one_bspc.model')(sequelize, Sequelize);
db.seedInventoryTags = require('./seed_inveontory_tags.model.js')(sequelize, Sequelize);
db.seedInventoryTagDetails = require('./seed_inventry_tag_details.model.js')(sequelize, Sequelize);
db.monitoringTeamOfBspcMember = require('./monitoring_team_of_bspc_member.model')(sequelize, Sequelize);
db.monitoringTeamOfBspc = require('./monitoring_team_of_bspc.model')(sequelize, Sequelize);
db.directIndent = require('./direct_indent.model.js')(sequelize, Sequelize);
db.varietLineModel = require('./variety_line.model.js')(sequelize, Sequelize);
db.mVarietyLinesModel = require("./m_variety_lines.model.js")(sequelize, Sequelize);
db.indentOfBrseedLines = require('./indent_of_brseed_lines.model.js')(sequelize, Sequelize);
db.seedClassModel = require('./seed_class.model.js')(sequelize, Sequelize);
db.bspProforma3MembersModel = require('./bsp_proforma_3_members.model.js')(sequelize, Sequelize);
db.bsp3ProformaReinspectionsModel = require('./bsp_3_proforma_reinspections.model.js')(sequelize, Sequelize);
db.reportStatus = require('./report_status.model.js')(sequelize, Sequelize);
db.investHarvestingModel = require('./invest_harvest.model.js')(sequelize, Sequelize);
db.investHarvestingBagModel = require('./invest_harvest_bag.model.js')(sequelize, Sequelize);
db.investVerifyModel = require('./invest_verify.model.js')(sequelize, Sequelize);
db.investVerifyStackCompositionModel = require('./invest_verify_stack_composition.model.js')(sequelize, Sequelize);
db.carryOverSeedModel = require('./carry_over_seed.model.js')(sequelize, Sequelize);
db.carryOverSeedDetailsModel = require('./carry_over_seed_details.model.js')(sequelize, Sequelize);
db.carryOverSeedDetailsTagsModel = require('./carry_over_seed_details_tags.model.js')(sequelize, Sequelize);
db.seedProcessingRegister = require('./seed_processing_register.js')(sequelize, Sequelize);
db.ProcessSeedDetails = require('./processed_seed_details.js')(sequelize, Sequelize);
db.SeedForProcessedStack = require('./seed_for_processed_stack.js')(sequelize, Sequelize);
db.intakeVerificationTags = require('./intake_verification_tags.js')(sequelize, Sequelize);
db.investVerifyStackCompositionModel2 = require('./invest_verify_stack_composition.model.js')(sequelize, Sequelize);
db.generateSampleSlipsModel = require('./generate_sample_slips.model.js')(sequelize, Sequelize);
db.bspPerformaBspTwoData = require('./bsp_proforma_2.model.js')(sequelize, Sequelize);
db.bspPerformaBspTwoSeedData = require('./bsp_proforma_2_seed.model')(sequelize, Sequelize);

db.generateSampleSlipsTestsModel = require('./generate_sample_slips_tests.model.js')(sequelize, Sequelize);
db.generateSampleSlipsModel = require('./generate_sample_slips.model.js')(sequelize, Sequelize);
db.seedProcessingRegister = require('./seed_processing_register.js')(sequelize, Sequelize);
db.ProcessSeedDetails = require('./processed_seed_details.js')(sequelize, Sequelize);
db.SeedForProcessedStack = require('./seed_for_processed_stack.js')(sequelize, Sequelize);
db.seedLabTests = require('./seed_lab_tests.model.js')(sequelize, Sequelize);

db.intakeVerificationTags = require('./intake_verification_tags.js')(sequelize, Sequelize);
db.investVerifyModel = require('./invest_verify.model.js')(sequelize, Sequelize);
db.investHarvestingModel = require('./invest_harvest.model.js')(sequelize, Sequelize);
db.carryOverSeedModel = require('./carry_over_seed.model.js')(sequelize, Sequelize);
db.carryOverSeedDetailsModel = require('./carry_over_seed_details.model.js')(sequelize, Sequelize);


db.seedProcessingRegisterOldStocks = require('./seed_processing_register_old_stock.model.js')(sequelize, Sequelize);
db.ProcessSeedDetailsoldStocks = require('./processed_seed_details_old_stock.js')(sequelize, Sequelize);
db.SeedForProcessedStackOldStocks = require('./seed_for_processed_stack_old_stock.js')(sequelize, Sequelize);
db.generateSampleForwardingLettersModel = require('./generate_sample_forwarding_letters.model.js')(sequelize, Sequelize);
db.availabilityOfBreederSeedModel = require('./availability_of_breeder_seed.model.js')(sequelize, Sequelize);

db.stlReportStatusModel = require('./stl_report_status.model.js')(sequelize, Sequelize);
db.varietyPriceListPackagesModel = require('./variety_price_list_packages.model.js')(sequelize, Sequelize);
db.varietyPriceList = require('./variety_price_lists.model.js')(sequelize, Sequelize);
db.agencyDetailModel3 = require("./agency_detail.model")(sequelize, Sequelize);
db.agencyDetailModel4 = require("./agency_detail.model")(sequelize, Sequelize);
db.agencyDetailModel5 = require("./agency_detail.model")(sequelize, Sequelize);
// db.seedTagsModel = require('./seed_tags.model.js')(sequelize, Sequelize);
// db.seedTagDetails = require('./seed_tag_detail.model.js')(sequelize, Sequelize);
// db.seedTagRange = require('./seed_tag_range.model.js')(sequelize, Sequelize);

db.seedTagsModel = require('./seed_tags.model.js')(sequelize, Sequelize);
db.seedTagDetails = require('./seed_tag_detail.model.js')(sequelize, Sequelize);
db.seedTagRange = require('./seed_tag_range.model.js')(sequelize, Sequelize);
db.agencyDetailModel2 = require("./agency_detail.model")(sequelize, Sequelize);

 
db.allocationSpaForLiftingSeed = require('./allocation_to_spa_for_lifting_seed_production_cnters.model.js')(sequelize, Sequelize);

db.allocationToIndentorSeed = require('./allocation_to_indentor_for_lifting_seeds.model.js')(sequelize, Sequelize);

db.receiptRequest = require('./receipt_request.model.js')(sequelize, Sequelize);

db.seedTagRange = require('./seed_tag_range.model.js')(sequelize, Sequelize);
db.reprintTagsModel = require('./reprint_tags.model.js')(sequelize, Sequelize);
db.reprintRequestedTagsModel = require('./reprint_requested_tags.model.js')(sequelize, Sequelize);

//----------------- seed lifting ------------------
db.liftingSeedDetailsModel = require('./lifting_seed_details.model.js')(sequelize, Sequelize);
db.liftingLotNumberModel = require('./lifting_lot_number.model.js')(sequelize, Sequelize);
db.liftingChargesModel = require('./lifting_charges.model.js')(sequelize, Sequelize);
db.liftingTagNumberModel = require('./lifting_tag_number.model.js')(sequelize, Sequelize);
db.allocationToSPASeed = require("./allocation_to_spa_for_lifting_seeds.model")(sequelize, Sequelize);
db.generateBreederSeedCertificate = require("./generate_breeder_seed_certificates.model.js")(sequelize, Sequelize);
db.receiptRequestModel = require("./receipt_requests.model.js")(sequelize, Sequelize);
db.receiptGenerateModel = require("./receipt_generates.model.js")(sequelize, Sequelize);
db.receiptGenerateBagModel = require("./receipt_generate_bags.model.js")(sequelize, Sequelize);
// receipt_generates.model.js
// db.seedTestingLabModel = require("./seed")
db.indentOfSpaLinesModel = require('./indent_of_spa_lines.model.js')(sequelize, Sequelize);
db.seedTestingLabModel = require('./m_seed_testing_lab_report.model.js')(sequelize, Sequelize);
db.gotTestingsModel=require('./got_testing.model.js')(sequelize, Sequelize);
db.bspPerestingsBspFiveModel=require('./bsp_proforma_5as.model.js')(sequelize, Sequelize);



db.inabilityReallocatesModel = require('./inability_reallocates.model.js')(sequelize, Sequelize);
db.inabilityReallocatesPlotsModel = require('./inability_reallocates_plots.model.js')(sequelize, Sequelize);
//got testing 
db.gotTestingModel = require('./got_testing.model.js')(sequelize, Sequelize);
db.gotShowingDetailsModel = require('./got_showing_details.model.js')(sequelize, Sequelize);
db.gotMonitoringTeamsModel = require('./got_monitoring_teams.model.js')(sequelize, Sequelize);
db.gotMonitoringTeamsMemberModel = require('./got_monitoring_team_members.model.js')(sequelize, Sequelize);

db.directIndent.belongsTo(db.indentOfBrseedDirectLineModel, {
    foreignKey: 'id',
    targetKey: 'indent_of_breederseed_direct_id'
});

db.bspPerestingsBspFiveModel.belongsTo(db.seasonModel, {
    foreignKey: 'season',
    targetKey: 'season_code'
});

db.bspPerestingsBspFiveModel.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'
});
// db.bspPerestingsBspFiveModel.belongsTo(db.varietyModel, {
//     foreignKey: 'variety_code',
//     targetKey: 'variety_code',
// });
db.bspPerestingsBspFiveModel.belongsTo(db.varietyModel,{
    foreignKey: 'variety_code',
    targetKey: 'variety_code',
})

//indent of SPA and crop
db.indenterSPAModel.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'
});

//indent of SPA and state
db.indenterSPAModel.belongsTo(db.stateModel, {
    foreignKey: 'state_code',
    targetKey: 'state_code'
});

//indent of SPA and indent of breederseed
db.indenterSPAModel.belongsTo(db.indentOfBreederseedModel, {
    foreignKey: 'indente_breederseed_id',
    targetKey: 'id'
});

db.bspProrforma3Model.belongsTo(db.bspProrforma2Model, {
    foreignKey: 'bsp_proforma_2_id',
    as: 'bspProforma2',
});

db.bspPerformaBspTwo.belongsTo(db.bspProformaOneBspc, {
    foreignKey: 'user_id',
    targetKey: 'bspc_id'
});

db.monitoringTeamOfBspcMember.belongsTo(db.monitoringTeamOfBspc, {
    foreignKey: 'monitoring_team_of_bspc_id',
    targetKey: 'id'
});

db.monitoringTeamPdpc.belongsTo(db.stateModel, {
    foreignKey: 'state_code',
    targetKey: 'state_code'

});

db.seedInventory.belongsTo(db.seedInventoryTags, {
    foreignKey: 'id',
    targetKey: 'seed_inventry_id'
});

db.bspPerformaBspOne.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'
});

db.monitoringTeamOfBspc.belongsTo(db.monitoringTeamOfBspcMember, {
    foreignKey: 'id',
    targetKey: 'monitoring_team_of_bspc_id'
});

db.bspPerformaBspTwo.belongsTo(db.monitoringTeamOfBspc, {
    foreignKey: 'year',
    targetKey: 'year',
    as: 'bsp_mtp_yr'
});

db.bspPerformaBspOne.belongsTo(db.bspProformaOneBspc, {
    foreignKey: 'id',
    targetKey: 'bspc_proforma_1_id',
});
db.bspProformaOneBspc.belongsTo(db.userModel, {
    foreignKey: 'bspc_id',
    targetKey: 'id',
});
db.bspProformaOneBspc.belongsTo(db.bspPerformaBspTwo, {
    foreignKey: 'bspc_id',
    targetKey:  'user_id',
});
db.bspPerformaBspTwo.belongsTo(db.bspPerformaBspThree, {
    foreignKey: 'id',
    targetKey: 'bsp_proforma_2_id',
});
db.userModel.belongsTo(db.bspProformaOneBspc, {
    foreignKey: 'id',
    targetKey: 'bspc_id',
});

db.bspPerformaBspOne.belongsTo(db.varietyModel, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code',
});

db.seedInventoryTagDetail.belongsTo(db.seedInventoryTag, {
    foreignKey: 'seed_inventry_tag_id',
    targetKey: 'id',
});

db.seedInventoryTag.belongsTo(db.seedInventory, {
    foreignKey: 'seed_inventry_id',
    targetKey: 'id',
});

db.bspPerformaBspTwo.belongsTo(db.stateModel, {
    foreignKey: 'state_code',
    targetKey: 'state_code'
});

db.bspPerformaBspTwo.belongsTo(db.districtModel, {
    foreignKey: 'district_code',
    targetKey: 'district_code'
});

db.seedInventoryTags.belongsTo(db.seedInventoryTagDetail, {
    foreignKey: 'id',
    targetKey: 'seed_inventry_tag_id',
});

db.bspPerformaBspTwo.belongsTo(db.varietyModel, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code',
});

db.bspPerformaBspOne.belongsTo(db.bspPerformaBspTwo, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code',
    as: 'bspOneTwoVC'
});

db.indentOfBreederseedModel.belongsTo(db.bspPerformaBspTwo, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code',
    as: 'indentOfBreederSeedVC'
});

db.directIndent.belongsTo(db.bspPerformaBspTwo, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code',
    as: 'directIndentVC'
});

db.indentOfBreederseedModel.belongsTo(db.varietyModel, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code',
});

db.directIndent.belongsTo(db.varietyModel, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code',
});


db.bspPerformaBspTwo.belongsTo(db.bspPerformaBspTwoSeed, {
    foreignKey: 'id',
    targetKey: 'bsp_proforma_2_id',
});

db.seedInventory.belongsTo(db.varietLineModel, {
    foreignKey: 'line_variety_code',
    targetKey: 'line_variety_code',
});

db.indentOfBreederseedModel.belongsTo(db.indentOfBrseedLines, {
    foreignKey: 'id',
    targetKey: 'indent_of_breederseed_id'
});

db.indentOfBreederseedModel.belongsTo(db.agencyDetailModel, {
    foreignKey: 'user_id',
    targetKey: 'user_id',
    as: 'agencyDetails'
});

db.inabilityReallocatesModel.belongsTo(db.userModel, {
    foreignKey: 'user_id',
    targetKey: 'id', 
});

db.userModel.belongsTo(db.inabilityReallocatesModel, {
    foreignKey: 'id',
    targetKey: 'user_id', 
});
db.userModel.belongsTo(db.agencyDetailModel, {
    foreignKey: 'id',
    targetKey: 'user_id', 
});
db.agencyDetailModel.belongsTo(db.userModel, {
    foreignKey: 'user_id',
    targetKey: 'id', 
});
db.inabilityReallocatesModel.belongsTo(db.varietyModel, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code',
}); 
db.varietyModel.belongsTo(db.inabilityReallocatesModel, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code',
}); 



db.bspPerformaBspTwo.belongsTo(db.varietLineModel, {
    foreignKey: 'variety_line_code',
    targetKey: 'line_variety_code', 
});

db.seedInventory.belongsTo(db.stageModel, {
    foreignKey: 'stage_id',
    targetKey: 'id'
});

db.seedInventory.belongsTo(db.seedClassModel, {
    foreignKey: 'seed_class_id',
    targetKey: 'id'
});
db.seedInventory.belongsTo(db.seasonModel, {
    foreignKey: 'season',
    targetKey: 'season_code'
});

db.directIndentModel = require("./direct_indent.model.js")(sequelize, Sequelize);
db.indentYearModel = require("./indent_year.model.js")(sequelize, Sequelize);
db.assignCropNewFlow = require('./assign_crop_new_flow.model')(sequelize, Sequelize);
db.assignBspcCropNewFlow = require('./assign_crop_bspc_new_flow.model')(sequelize, Sequelize);
//nucleusSeedAvailabityModel and userModel reletion
db.userModel.hasMany(db.nucleusSeedAvailabityModel, {
    foreignKey: 'user_id',
    onDelete: 'cascade',
});

db.nucleusSeedAvailabityModel.belongsTo(db.userModel, {
    foreignKey: 'user_id'
});
// finish

//nucleusSeedAvailabityModel and agencyDetailModel reletion
db.agencyDetailModel.hasMany(db.nucleusSeedAvailabityModel, {
    foreignKey: 'user_id',
    onDelete: 'cascade',
});

db.nucleusSeedAvailabityModel.belongsTo(db.agencyDetailModel, {
    foreignKey: 'user_id'
});
// finish

db.nucleusSeedAvailabityModel.belongsTo(db.varietyModel, {
    foreignKey: 'variety_id',
    // onDelete: 'cascade',
});

db.varietyModel.hasMany(db.nucleusSeedAvailabityModel, {
    foreignKey: 'variety_id',
});

//nucleusSeedAvailabityModel and agencyDetailModel reletion
db.userModel.hasMany(db.userTypeModel, {
    foreignKey: 'user_type',
    onDelete: 'cascade',
});

db.userTypeModel.belongsTo(db.userModel, {
    foreignKey: 'user_type'
});


// finish


db.userModel.belongsTo(db.agencyDetailModel, {
    foreignKey: 'agency_id',
    // onDelete: 'cascade',
});

db.agencyDetailModel.hasMany(db.userModel, {
    foreignKey: 'agency_id',
});

db.breederCropModel.belongsTo(db.varietyModel, {
    foreignKey: 'variety_id',
    // onDelete: 'cascade',
});

db.lotNumberModel.belongsTo(db.varietyModel, {
    foreignKey: 'variety_id',
    // onDelete: 'cascade',
});
db.bsp4Model.belongsTo(db.varietyModel, {
    foreignKey: 'variety_id',
    // onDelete: 'cascade',
});
db.bsp1Model.belongsTo(db.varietyModel, {
    foreignKey: 'variety_id',
    // onDelete: 'cascade',
});
db.lotNumberModel.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code',
    // onDelete: 'cascade',
});

db.lotNumberModel.belongsTo(db.seasonModel, {
    foreignKey: 'season',
    targetKey: 'season_code',
    // onDelete: 'cascade',
});

db.varietyModel.hasMany(db.breederCropModel, {
    foreignKey: 'variety_id',
});

// breederCropModel and cropModel reletion
db.cropModel.hasMany(db.breederCropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'

});

db.breederCropModel.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'

});
db.breederCropModel.belongsTo(db.seasonModel, {
    foreignKey: 'season',
    targetKey: 'season_code',
});

db.seasonModel.belongsTo(db.breederCropModel, {
    foreignKey: 'season',
    targetKey: 'season',
});
// finish

// nucleusSeedAvailabityModel and cropModel reletion
db.cropModel.hasMany(db.nucleusSeedAvailabityModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'

});

db.nucleusSeedAvailabityModel.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'

});


// 

// nucleusSeedAvailabityModel and veriety reletion
db.varietyModel.hasMany(db.nucleusSeedAvailabityModel, {
    foreignKey: 'variety_id',

});

db.nucleusSeedAvailabityModel.belongsTo(db.varietyModel, {
    foreignKey: 'variety_id',

});
// finish


db.labelNumberForBreederseed.hasMany(db.generatedLabelNumberModel, {
    foreignKey: 'label_number_for_breeder_seeds',
    targetKey: 'label_number_for_breeder_seeds'

});

db.performaSeedModel.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'

});

db.performaSeedModel.belongsTo(db.varietyModel, {
    foreignKey: 'variety_id',
    targetKey: 'id'

});
db.performaSeedModel.belongsTo(db.lotNumberModel, {
    foreignKey: 'lot_number',
    targetKey: 'id'

});
db.indentOfBreederseedModel.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'

});

db.cropModel.belongsTo(db.indentOfBreederseedModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'

});

// db.performaSeedModel.hasMany(db.generatedLabelNumberModel, {
//     targetKey: 'label_number',
//     foreignKey: 'label_number_for_breeder_seeds',
// });

// db.generatedLabelNumberModel.belongsTo(db.performaSeedModel, {
//     foreignKey: 'label_number_for_breeder_seeds',
//     // targetKey: 'label_number'
// });
// start breederCrop and breederCropVeriety model reletion
db.breederCropsVerietiesModel.hasMany(db.breederCropModel, {
    foreignKey: 'id',
    // targetKey: 'id'
});
db.breederCropModel.belongsTo(db.breederCropsVerietiesModel, {
    foreignKey: 'id',
    targetKey: 'breeder_crop_id'
});
// ================== finish =============================


// start breederCropsVerietiesModel and m_veriety_model  reletion
db.varietyModel.hasMany(db.breederCropsVerietiesModel, {
    foreignKey: 'variety_id',
    // targetKey: 'variety_id'
});
db.breederCropsVerietiesModel.belongsTo(db.varietyModel, {
    foreignKey: 'variety_id',
    // targetKey: 'id'
});


// ================== finish =============================

// -------------------------------------------------------

// start breederCropsVerietiesModel and m_veriety_model  reletion
db.cropGroupModel.hasMany(db.breederCropModel, {
    foreignKey: 'group_code',
    targetKey: 'group_code'
});
db.breederCropModel.belongsTo(db.cropGroupModel, {
    foreignKey: 'crop_group_code',
    targetKey: 'group_code'
});

db.cropModel.belongsTo(db.seasonModel, {
    foreignKey: 'season',
    targetKey: 'season_code'
});
db.seasonModel.belongsTo(db.cropModel, {
    foreignKey: 'season',
    targetKey: 'season'
});

db.bsp1Model.hasMany(db.bsp1ProductionCenterModel, {
    foreignKey: {
        allowNull: false,
        name: 'bsp_1_id'
    },
});

db.bsp1ProductionCenterModel.belongsTo(db.bsp1Model, {
    foreignKey: 'bsp_1_id'
});

db.breederCropModel.hasMany(db.nucleusSeedAvailabityModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code',

});

db.nucleusSeedAvailabityModel.belongsTo(db.breederCropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code',

});
db.nucleusSeedAvailabityModel.belongsTo(db.bsp1Model, {
    foreignKey: 'variety_id',
    targetKey: 'variety_id',

});
db.bsp1Model.belongsTo(db.nucleusSeedAvailabityModel, {
    foreignKey: 'variety_id',
    targetKey: 'variety_id',

});
db.nucleusSeedAvailabityModel.belongsTo(db.bsp4Model, {
    foreignKey: 'variety_id',
    targetKey: 'variety_id',

});
db.bsp4Model.belongsTo(db.nucleusSeedAvailabityModel, {
    foreignKey: 'variety_id',
    targetKey: 'variety_id',

});
db.nucleusSeedAvailabityModel.belongsTo(db.bsp5bModel, {
    foreignKey: 'variety_id',
    targetKey: 'variety_id',

});
db.bsp5bModel.belongsTo(db.nucleusSeedAvailabityModel, {
    foreignKey: 'variety_id',
    targetKey: 'variety_id',

});
db.nucleusSeedAvailabityModel.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code',

});
db.nucleusSeedAvailabityModel.belongsTo(db.breederCertificate, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code',

});

db.bsp2Model.belongsTo(db.bsp1Model, {
    foreignKey: 'bsp_1_id'
});
db.bsp1Model.belongsTo(db.bsp2Model, {
    foreignKey: 'id',
    targetKey: 'bsp_1_id',
});
db.bsp3Model.belongsTo(db.bsp2Model, {
    foreignKey: 'bsp_2_id'
});

db.bsp2Model.belongsTo(db.bsp3Model, {
    foreignKey: 'id',
    targetKey: 'bsp_2_id',
});


db.bsp4Model.belongsTo(db.bsp3Model, {
    foreignKey: "bsp_3_id"
});
db.bsp3Model.belongsTo(db.bsp4Model, {
    foreignKey: "id",
    targetKey: 'bsp_3_id',
});
db.cropGroupModel.hasMany(db.cropModel, {
    foreignKey: 'group_code',
    targetKey: 'group_code'
});
db.cropModel.belongsTo(db.cropGroupModel, {
    foreignKey: 'group_code',
    targetKey: 'group_code'
});
db.cropGroupModel.hasMany(db.indentOfBreederseedModel, {
    foreignKey: 'group_code',
    targetKey: 'group_code'
});
db.indentOfBreederseedModel.belongsTo(db.cropGroupModel, {
    foreignKey: 'group_code',
    targetKey: 'group_code'
});
db.indentOfBreederseedModel.belongsTo(db.varietyModel, {
    foreignKey: 'variety_id',
    targetKey: 'id'

});

db.indentOfBreederseedModel.belongsTo(db.allocationToIndentor, {
    foreignKey: 'id',
    targetKey: 'indent_of_breeder_id'
});
db.allocationToIndentor.belongsTo(db.indentOfBreederseedModel, {
    foreignKey: 'indent_of_breeder_id',
    targetKey: 'id'
});
db.indentOfBreederseedModel.belongsTo(db.bsp5bModel, {
    foreignKey: 'id',
    targetKey: 'indent_of_breederseed_id'
});
// ================== finish =============================

// db.cropModel.hasMany(db.indentOfBreederseedModel, {
//     foreignKey: 'crop_code',
//     onDelete: 'cascade'
// });

db.indentOfBreederseedModel.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'
});

// db.varietyModel.hasMany(db.indentOfBreederseedModel, {
//     foreignKey: 'variety_id',
//     onDelete: 'cascade'
// });

// db.indentOfBreederseedModel.belongsTo(db.varietyModel, {
//    foreignKey: 'variety_code',
//    targetKey: 'variety_code'
// });
// db.cropModel.belongsTo(db.varietyModel, {
//     foreignKey: 'crop_code',
//    targetKey: 'crop_code'
// });


db.indentOfBreederseedModel.hasMany(db.agencyDetailModel, {
    //    foreignKey: 'created_by',
    foreignKey: 'user_id',
    onDelete: 'cascade',
    sourceKey: 'user_id'
});

db.agencyDetailModel.belongsTo(db.indentOfBreederseedModel, {
    //    foreignKey: 'created_by',
    foreignKey: 'user_id',
    targetKey: 'user_id'
});

db.seasonModel.belongsTo(db.indentOfBreederseedModel, {
    //    foreignKey: 'created_by',
    foreignKey: 'season_code',
    targetKey: 'season'
});

db.indentOfBreederseedModel.belongsTo(db.seasonModel, {
    //    foreignKey: 'created_by',
    foreignKey: 'season',
    targetKey: 'season_code'
});

db.indentOfBreederseedModel.belongsTo(db.userModel, {
    // foreignKey: 'id',
    // onDelete: 'cascade',
    foreignKey: 'user_id'
});
db.indentOfBreederseedModel.belongsTo(db.bsp1Model, {
    foreignKey: 'id',
    targetKey: 'indent_of_breederseed_id'
});
db.indentOfBreederseedModel.belongsTo(db.bsp2Model, {
    foreignKey: 'variety_id',
    targetKey: 'variety_id'
});
db.indentOfBreederseedModel.belongsTo(db.bsp3Model, {
    foreignKey: 'variety_id',
    targetKey: 'variety_id'
});
db.indentOfBreederseedModel.belongsTo(db.bsp4Model, {
    foreignKey: 'variety_id',
    targetKey: 'variety_id'
});
db.cropModel.belongsTo(db.bsp4Model, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'
});
db.bsp4Model.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'
});



// db.indentOfBreederseedModel.belongsTo(db.bsp4Model, {
//     foreignKey: 'crop_code',
//     targetKey: 'variety_id'
// });
db.indentOfBreederseedModel.belongsTo(db.bsp5aModel, {
    foreignKey: 'variety_id',
    targetKey: 'variety_id'
});

db.userModel.hasMany(db.indentOfBreederseedModel, {
    foreignKey: 'user_id'
});

// 
db.labelNumberForBreederseed.belongsTo(db.seedTestingReportsModel, {
    foreignKey: 'lot_number_creation_id',
    targetKey: 'lot_number'

});

db.seedTestingReportsModel.belongsTo(db.labelNumberForBreederseed, {
    foreignKey: 'lot_number',
    targetKey: 'lot_number',
});
db.seasonModel.hasMany(db.bsp4Model, {
    foreignKey: 'season',
    targetKey: 'season',
    // onDelete: 'cascade',
});

db.bsp4Model.belongsTo(db.seasonModel, {
    foreignKey: 'season',
    targetKey: 'season_code',
});

db.bsp4Model.belongsTo(db.bsp4ToPlant, {
    foreignKey: "id",
    targetKey: "bsp4_id"
});

db.bsp4ToPlant.belongsTo(db.plantDetail, {
    foreignKey: "plant_id",
    targetKey: "id"
});

db.lotNumberModel.belongsTo(db.plantDetail, {
    foreignKey: "spp_id",
    targetKey: "id"
});
db.cropModel.belongsTo(db.userModel, {
    foreignKey: "breeder_id",
    targetKey: "id"
});
// db.bsp4Model.belongsTo(db.seasonModel, {
//     foreignKey: 'season',
//     targetKey: 'season'
// });
// db.seasonModel.belongsTo(db.bsp4Model, {
//     foreignKey: 'season_code',
//     targetKey: 'season'
// });

// ------------ start nucleus seed availability table reletion -----------------------
db.nucleusSeedAvailabityModel.belongsTo(db.seasonModel, {
    foreignKey: 'season',
    targetKey: 'season_code',
});

db.seasonModel.belongsTo(db.nucleusSeedAvailabityModel, {
    foreignKey: 'season',
    targetKey: 'season',
});
db.agencyDetailModel.belongsTo(db.designationModel, {
    foreignKey: 'contact_person_designation_id',
    targetKey: 'id',
});
// ------------ finsih nucleus seed availability table reletion -----------------------
db.seedTestingReportsModel.hasMany(db.lotNumberModel, {
    foreignKey: 'id',
    targetKey: 'lot_number'
});

db.lotNumberModel.belongsTo(db.seedTestingReportsModel, {
    foreignKey: 'id',
    targetKey: 'lot_number'
});

db.cropModel.hasMany(db.bsp1Model, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'
});

db.bsp1Model.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'
});

db.userModel.hasMany(db.bsp1ProductionCenterModel, {
    foreignKey: 'production_center_id',
    targetKey: 'production_center_id'
});

db.bsp1ProductionCenterModel.belongsTo(db.userModel, {
    foreignKey: 'production_center_id',
    // targetKey: 'production_center_id'
});
//agency and state relation start
db.agencyDetailModel.belongsTo(db.stateModel, {
    foreignKey: 'state_id',
    targetKey: 'state_code',
});
db.agencyDetailModel.belongsTo(db.districtModel, {
    foreignKey: 'district_id',
    targetKey: 'district_code',
});
db.stateModel.hasMany(db.agencyDetailModel, {
    foreignKey: 'state_id',
    targetKey: 'state_code',
});
db.bsp1Model.belongsTo(db.indentOfBreederseedModel, {
    foreignKey: 'indent_of_breederseed_id',
    targetKey: 'id',
});
// ------------- reletion beetween allocation_to_indentor_for_lifting_seed/-allocationToIndentorProductionCenterSeed-----------------------
db.allocationToIndentor.hasMany(db.allocationToIndentorProductionCenterSeed, {
    foreignKey: 'allocation_to_indentor_for_lifting_seed_id',
});

db.allocationToIndentor.belongsTo(db.allocationToIndentorProductionCenterSeed, {
    targetKey: 'id',
    foreignKey: 'allocation_to_indentor_for_lifting_seed_id'
});
// ------------- reletion for user-----------------------
db.userModel.hasMany(db.allocationToIndentorProductionCenterSeed, {
    foreignKey: 'indent_of_breeder_id',
    // targetKey: 'indent_of_breeder_id',
});

db.allocationToIndentorProductionCenterSeed.belongsTo(db.userModel, {
    foreignKey: 'indent_of_breeder_id',
    // targetKey: 'indent_of_breeder_id'
});
db.bsp5bModel.belongsTo(db.indentOfBreederseedModel, {
    foreignKey: 'indent_of_breederseed_id',
});
db.indentOfBreederseedModel.belongsTo(db.allocationToIndentorProductionCenterSeed, {
    foreignKey: 'user_id',
    targetKey: 'indent_of_breeder_id'
});
db.allocationToIndentorLiftingSeed.belongsTo(db.allocationToIndentorProductionCenterSeed, {
    foreignKey: 'id',
    targetKey: 'allocation_to_indentor_for_lifting_seed_id'
});
db.allocationToIndentorLiftingSeed.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'
});

// ------------------------------- new flow reletion production center (nov/2023) start----------------------
db.seasonModel.hasMany(db.seedForProductionModel, {
    foreignKey: 'season',
    targetKey: 'season',
});

db.seedForProductionModel.belongsTo(db.seasonModel, {
    foreignKey: 'season',
    targetKey: 'season_code'
});

db.varietyModel.hasMany(db.seedForProductionModel, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code',
});

db.seedForProductionModel.belongsTo(db.varietyModel, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code'
});

db.seedInventory.hasMany(db.seedForProductionModel, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code',
});

db.seedForProductionModel.belongsTo(db.seedInventory, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code'
});

db.directIndent.hasMany(db.seedForProductionModel, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code',
});

db.seedForProductionModel.belongsTo(db.directIndent, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code'
});

db.directIndent.hasMany(db.seedForProductionModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code',
});

// ------------------------------- new flow reletion production center (nov/2023) finsih---------------------

//sachin
db.varietyModel.hasMany(db.directIndentModel, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code',
});
db.directIndentModel.belongsTo(db.varietyModel, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code'
});


db.indentOfBrseedDirectLineModel.hasMany(db.varietyLinesModel, {
    foreignKey: 'line_variety_code',
    sourceKey: 'variety_code_line',
});

db.varietyLinesModel.belongsTo(db.indentOfBrseedDirectLineModel, {
    foreignKey: 'line_variety_code',
    targetKey: 'variety_code_line',
});


db.cropModel.hasMany(db.directIndentModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code',
});
db.directIndentModel.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code',
});


db.directIndentModel.belongsTo(db.stateModel, {
    foreignKey: 'state_code',
    targetKey: 'state_code',
});
db.stateModel.hasMany(db.directIndentModel, {
    foreignKey: 'state_code',
    targetKey: 'state_code',
});
db.assignCropNewFlow.belongsTo(db.assignBspcCropNewFlow, {
    foreignKey: 'id',
    targetKey: 'assign_crop_id',
});
db.assignBspcCropNewFlow.hasMany(db.assignCropNewFlow, {
    foreignKey: 'id',
    targetKey: 'id',
});

//bsp 3rd
db.bspProrforma2Model.belongsTo(db.stateModel, {
    foreignKey: 'state_code',
    targetKey: 'state_code',
});
db.stateModel.hasMany(db.bspProrforma2Model, {
    foreignKey: 'state_code',
    targetKey: 'state_code',
});

db.bspProrforma2Model.belongsTo(db.districtModel, {
    foreignKey: 'district_code',
    targetKey: 'district_code',
});
db.districtModel.hasMany(db.bspProrforma2Model, {
    foreignKey: 'district_code',
    targetKey: 'district_code',
});
db.bspProrforma3Model.belongsTo(db.commentsModel, {
    foreignKey: 'id',
    targetKey: 'id',
});
db.commentsModel.hasMany(db.bspProrforma3Model, {
    foreignKey: 'comment_id',
    targetKey: 'comment_id',
});

// db.bspProrforma3Model.belongsTo(db.monitoringTeamOfBspc, {
//     foreignKey: 'monitoring_team_of_id',
//     targetKey: 'id',
//     as: 'monitoringTeam'
// });

// db.monitoringTeamOfBspc.hasMany(db.bspProrforma3Model, {
//     foreignKey: 'monitoring_team_of_id',
//     sourceKey: 'id',
//     as: 'monitoringTeam'
// });
db.bspProrforma3Model.hasMany(db.bspProforma3MembersModel, {
    foreignKey: 'bsp3_id',
    sourceKey: 'id',
    as: 'monitoringTeam'
});

db.bspProforma3MembersModel.belongsTo(db.bspProrforma3Model, {
    foreignKey: 'bsp3_id',
    targetKey: 'id',
});

db.bspProforma3MembersModel.belongsTo(db.monitoringTeamOfBspcMember, {
    foreignKey: 'monitoring_team_of_bspc_members_id',
    targetKey: 'id',
    as: 'monitoringMember'
});

db.monitoringTeamOfBspcMember.hasMany(db.bspProforma3MembersModel, {
    foreignKey: 'monitoring_team_of_bspc_members_id',
    sourceKey: 'id',
    as: 'monitoringMember'
});

db.monitoringTeamPdpc.belongsTo(db.monitoringTeamPdpcDetails, {
    foreignKey: 'id',
    targetKey: 'monitoring_team_of_pdpc_id',
});
db.monitoringTeamPdpc.belongsTo(db.monitoringTeamAssignedToBspcsModel
    , {
        foreignKey: 'id',
        targetKey: 'monitoring_team_of_pdpc_id',
    });

db.monitoringTeamOfBspcMember.belongsTo(db.districtModel, {
    foreignKey: 'district_code',
    targetKey: 'district_code',
});
db.districtModel.hasMany(db.monitoringTeamOfBspcMember, {
    foreignKey: 'district_code',
    targetKey: 'district_code',
});

db.monitoringTeamOfBspcMember.belongsTo(db.stateModel, {
    foreignKey: 'state_code',
    targetKey: 'state_code',
});
db.stateModel.hasMany(db.monitoringTeamOfBspcMember, {
    foreignKey: 'state_code',
    targetKey: 'state_code',
});

db.bspProrforma2Model.belongsTo(db.bspProforma1BspcsModel, {
    foreignKey: 'user_id',
    targetKey: 'bspc_id',
});

db.bspProforma1BspcsModel.hasMany(db.bspProrforma2Model, {
    foreignKey: 'user_id',
    sourceKey: 'bspc_id',
});

db.bspProforma1BspcsModel.belongsTo(db.bspProforma1sModel, {
    foreignKey: 'bspc_proforma_1_id',
    targetKey: 'id',
});

db.bspProforma1sModel.hasMany(db.bspProforma1BspcsModel, {
    foreignKey: 'bspc_proforma_1_id',
    sourceKey: 'id',
});

db.monitoringTeamOfBspc.hasMany(db.monitoringTeamOfBspcMember, {
    foreignKey: 'monitoring_team_of_bspc_id',
    as: 'monitoringMember'
});

db.monitoringTeamOfBspcMember.belongsTo(db.monitoringTeamOfBspc, {
    foreignKey: 'monitoring_team_of_bspc_id',
    as: 'monitoringTeam'
});

db.monitoringTeamPdpc.belongsTo(db.seasonModel, {
    foreignKey: 'season',
    targetKey: 'season_code',
});

db.monitoringTeamPdpc.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code',
});

// TableA.hasMany(TableB, { foreignKey: 'columnA', sourceKey: 'columnB' });
db.monitoringTeamPdpcDetails.belongsTo(db.stateModel, {
    foreignKey: 'state_code',
    targetKey: 'state_code',

})
db.monitoringTeamPdpcDetails.belongsTo(db.designationModel, {
    foreignKey: 'desination_id',
    targetKey: 'id',
});
db.monitoringTeamPdpcDetails.belongsTo(db.districtModel, {
    foreignKey: 'district_code',
    targetKey: 'district_code'

})

db.monitoringTeamPdpcDetails.belongsTo(db.agencytypeModel, {
    foreignKey: 'agency_type_id',
    targetKey: 'id'
})
db.monitoringTeamPdpc.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'

})
db.varietyModel.hasMany(db.bspProrforma3Model, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code',
});
db.bspProrforma3Model.belongsTo(db.varietyModel, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code'
});
db.cropModel.hasMany(db.bspProrforma3Model, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code',
});
db.bspProrforma3Model.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'
});


db.monitoringTeamOfBspc.belongsTo(db.monitoringTeamOfBspcMember
    , {
        foreignKey: 'id',
        targetKey: 'monitoring_team_of_bspc_id',
    });
db.monitoringTeamOfBspcMember.hasMany(db.monitoringTeamOfBspc
    , {
        foreignKey: 'id',
        targetKey: 'monitoring_team_of_bspc_id',
    });
db.monitoringTeamOfBspcMember.belongsTo(db.stateModel, {
    foreignKey: 'state_code',
    targetKey: 'state_code',

})
db.monitoringTeamOfBspcMember.belongsTo(db.designationModel, {
    foreignKey: 'designation_id',
    targetKey: 'id',
});
db.monitoringTeamOfBspcMember.belongsTo(db.districtModel, {
    foreignKey: 'district_code',
    targetKey: 'district_code'

})
db.monitoringTeamOfBspcMember.belongsTo(db.agencytypeModel, {
    foreignKey: 'type_of_agency',
    targetKey: 'id'
})
db.directIndentModel.hasMany(db.indentOfBrseedDirectLineModel, {
    foreignKey: 'indent_of_breederseed_direct_id',
    sourceKey: 'id',
});
db.indentOfBrseedDirectLineModel.belongsTo(db.directIndentModel, {
    foreignKey: 'indent_of_breederseed_direct_id',
    targetKey: 'id',
});
// db.bspProrforma3Model.hasMany(db.varietyLinesModel, {
//     foreignKey: 'variety_code', 
//     sourceKey: 'id',
// });
// db.varietyLinesModel.belongsTo(db.bspProrforma3Model, {
//     foreignKey: 'indent_of_breederseed_direct_id', 
//     targetKey: 'id', 
// });
db.seedForProductionModel.belongsTo(db.VarietyLines, {
    foreignKey: 'variety_line_code',
    targetKey: 'line_variety_code'
})
db.seedForProductionModel.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'
})
db.cropModel.belongsTo(db.seedForProductionModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'
})
db.directIndent.belongsTo(db.indentOfBrseedDirectLineModel, {
    foreignKey: 'id',
    targetKey: 'indent_of_breederseed_direct_id',
});
db.bspProrforma3Model.hasMany(db.varietyLinesModel, {
    foreignKey: 'line_variety_code',
    sourceKey: 'variety_line_code',
});

db.varietyLinesModel.belongsTo(db.bspProrforma3Model, {
    foreignKey: 'line_variety_code',
    targetKey: 'variety_line_code',
});
db.bspPerformaBspTwo.hasMany(db.bspPerformaBspThree, {
    foreignKey: 'bsp_proforma_2_id',
    targetKey: 'bsp_proforma_2_id',
});
db.bspPerformaBspThree.belongsTo(db.bspPerformaBspTwo, {
    foreignKey: 'bsp_proforma_2_id',
    // targetKey: 'bsp_proforma_2_id',
});
db.bspPerformaBspThree.hasMany(db.bspProforma3MembersModel, {
    foreignKey: 'bsp3_id',
    targetKey: 'bsp3_id',
});
db.bspProforma3MembersModel.belongsTo(db.bspPerformaBspThree, {
    foreignKey: 'bsp3_id',
    // targetKey: 'bsp_proforma_2_id',
});
db.monitoringTeamOfBspcMember.hasMany(db.bspProforma3MembersModel, {
    foreignKey: 'monitoring_team_of_bspc_members_id',
    targetKey: 'monitoring_team_of_bspc_members_id',
});
db.bspProforma3MembersModel.belongsTo(db.monitoringTeamOfBspcMember, {
    foreignKey: 'monitoring_team_of_bspc_members_id',
    targetKey: 'id',
});
db.bspProrforma3Model.hasMany(db.bsp3ProformaReinspectionsModel, {
    foreignKey: 'bsp3id',
    targetKey: 'id',
    as:'reinspection_data'
});
db.bsp3ProformaReinspectionsModel.belongsTo(db.bspProrforma3Model, {
    foreignKey: 'bsp3id',
    targetKey: 'id',
});
db.bspProrforma2Model.belongsTo(db.bspPerformaBspTwoSeed, {
    foreignKey: 'id',
    targetKey: 'bsp_proforma_2_id',
});
db.investHarvestingModel.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code',
});
db.investHarvestingModel.belongsTo(db.varietyModel, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code',
});
db.investHarvestingModel.belongsTo(db.varietLineModel, {
    foreignKey: 'variety_line_code',
    targetKey: 'line_variety_code',
});
db.investHarvestingModel.belongsTo(db.varietLineModel, {
    foreignKey: 'variety_line_code',
    targetKey: 'line_variety_code',
});
db.investHarvestingModel.belongsTo(db.agencyDetailModel, {
    foreignKey: 'user_id',
    targetKey: 'user_id',
});

db.investHarvestingModel.belongsTo(db.bspProrforma2Model, {
    foreignKey: 'plot_id',
    targetKey: 'id',
});
db.investHarvestingModel.belongsTo(db.investHarvestingBagModel, {
    foreignKey: 'id',
    targetKey: 'investing_harvesting_id',
});
db.investHarvestingModel.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code',
});

db.investHarvestingModel.belongsTo(db.investVerifyModel, {
    foreignKey: 'id',
    targetKey: 'invest_harvesting_id',
});

// db.investVerifyModel.belongsTo(db.investVerifyStackCompositionModel, {
//     foreignKey: 'id',
//     targetKey: 'invest_verify_id',
// });



db.investVerifyModel.hasMany(db.investVerifyStackCompositionModel, {
    foreignKey: 'invest_verify_id',
    sourceKey: 'id',
    // as: 'monitoringTeams1'
});

db.investVerifyStackCompositionModel.belongsTo(db.investVerifyModel, {
    foreignKey: 'invest_verify_id',
    targetKey: 'id',
});
db.investHarvestingModel.belongsTo(db.maxLotSizeModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code',
});
db.bspPerformaBspTwo.belongsTo(db.userModel, {
    foreignKey: 'user_id',
    targetKey: 'id',
});
db.investVerifyModel.belongsTo(db.userModel, {
    foreignKey: 'user_id',
    targetKey: 'id',
});

db.directIndentModel.belongsTo(db.seasonModel, {
    foreignKey: 'season',
    targetKey: 'season_code',
});
db.carryOverSeedModel.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code',
});
db.carryOverSeedModel.belongsTo(db.varietyModel, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code',
});
// db.carryOverSeedModel.belongsTo(db.carryOverSeedDetailsModel, {
//     foreignKey: 'id',
//     targetKey: 'carry_over_seed_id',
// });
db.carryOverSeedModel.belongsTo(db.varietLineModel, {
    foreignKey: 'variety_line_code',
    targetKey: 'line_variety_code',
});
db.bspPerformaBspOne.belongsTo(db.carryOverSeedModel, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code',
    as: 'caryOver'
});

// db.carryOverSeedModel.hasMany(db.carryOverSeedDetailsModel, {
//     foreignKey: 'carry_over_seed_id',
//     sourceKey: 'id',
//     // as: 'monitoringTeams1'
// });

db.carryOverSeedModel.hasMany(db.carryOverSeedDetailsModel, {
    foreignKey: 'carry_over_seed_id',
    targetKey: 'id',
});


db.bspPerformaBspOne.belongsTo(db.seedForProductionModel, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code',
    as:'seed_for_production'
});
db.seedInventory.belongsTo(db.seedForProductionModel, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code',
    as:'seed_for_production'
});
db.seedInventory.belongsTo(db.bspPerformaBspOne, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code',
    // as:'seed_for_production'
});


db.directIndent.belongsTo(db.carryOverSeedModel, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code',
    as: 'directIndentVC2'
});
db.bspPerformaBspOne.belongsTo(db.carryOverSeedModel, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code',
    as: 'bsp2CarryOver'
});
db.directIndent.belongsTo(db.carryOverSeedModel, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code',
    as: 'directCarryOver'
});
// db.carryOverSeedModel.belongsTo(db.varietLineModel, {
//     foreignKey: 'variety_line_code',
//     targetKey: 'line_variety_code',
// });
// db.bspPerformaBspOne.belongsTo(db.varietLineModel, {
//     foreignKey: 'variety_line_code',
//     targetKey: 'line_variety_code',
// });

// db.bspPerformaBspOne.belongsTo(db.varietLineModel, {
//     foreignKey: 'variety_line_code',
//     targetKey: 'line_variety_code',
// });
// db.varietLineModel.belongsTo(db.carryOverSeedModel, {
//     foreignKey: 'variety_line_code',
//     targetKey: 'line_variety_code',
// });
db.bspPerformaBspOne.belongsTo(db.varietLineModel, {
    foreignKey: 'variety_line_code',
    targetKey: 'line_variety_code',
});
// db.indentOfBrseedDirectLineModel.belongsTo(db.varietLineModel, {
//     foreignKey: 'variety_code_line',
//     targetKey: 'line_variety_code',
// });

// db.directIndent.belongsTo(db.varietLineModel, {
//     foreignKey: 'variety_line_code',
//     targetKey: 'variety_code_line',
//     // as: 'agencyDetails'
// });
db.carryOverSeedModel.belongsTo(db.bspPerformaBspTwo, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code',
    as: 'CarrybspOneTwoVC'
});
db.investVerifyModel.hasMany(db.intakeVerificationTags, {
    foreignKey: 'invest_verify_id',
    targetKey: 'id',
});
db.investVerifyModel.hasMany(db.investVerifyStackCompositionModel2, {
    foreignKey: 'invest_verify_id',
    targetKey: 'id',
});
db.seedProcessingRegister.belongsTo(db.ProcessSeedDetails, {
    foreignKey: 'id',
    targetKey: 'seed_processing_register_id',
});
db.intakeVerificationTags.hasMany(db.seedProcessingRegister, {
    foreignKey: 'lot_id',
    targetKey: 'id',
});
db.seedProcessingRegister.belongsTo(db.SeedForProcessedStack, {
    foreignKey: 'id',
    // as:'seed_processing_register_id'
    targetKey: 'seed_processing_register_id',
});
db.investVerifyModel.belongsTo(db.seedProcessingRegister, {
    foreignKey: 'id',
    targetKey: 'invest_verify_id',
});
db.investVerifyModel.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code',
});
db.investVerifyModel.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code',
});
db.investVerifyModel.belongsTo(db.maxLotSizeModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code',
});
db.carryOverSeedModel.belongsTo(db.seedProcessingRegister, {
    foreignKey: 'id',
    targetKey: 'carry_over_id',
});
db.carryOverSeedDetailsModel.belongsTo(db.seedProcessingRegister, {
    foreignKey: 'id',
    targetKey: 'carr_over_seed_details_id',
});
db.carryOverSeedDetailsModel.belongsTo(db.seedInventoryTag, {
    foreignKey: 'lot_id',
    targetKey: 'id',
    // as:'lot_target_id'
});
db.carryOverSeedModel.belongsTo(db.seedInventory, {
    foreignKey: 'user_id',
    targetKey: 'bspc_id',
    // as:'lot_target_id'
});

db.bspPerformaBspTwoSeed.hasOne(db.bspPerformaBspTwoSeedData, {
    foreignKey: 'bsp_proforma_2_id',
    targetKey: 'id',
});
db.seedInventory.belongsTo(db.seasonModel,{
    foreignKey: 'season',
    targetKey:'season_code'
});
db.seedInventory.belongsTo(db.cropModel,{
    foreignKey: 'crop_code',
    targetKey: 'crop_code'
})
db.seedInventory.belongsTo(db.varietyModel,{
    foreignKey: 'variety_code',
    targetKey: 'variety_code'
})

db.seedProcessingRegisterOldStocks.belongsTo(db.SeedForProcessedStackOldStocks,{
    foreignKey: 'id',
    targetKey: 'seed_processing_register_old_stock_id'
})
db.seedInventoryTag.belongsTo(db.seedProcessingRegisterOldStocks,{
    foreignKey: 'id',
    targetKey: 'lot_id'
})

db.seedProcessingRegisterOldStocks.belongsTo(db.ProcessSeedDetailsoldStocks,{
    foreignKey: 'id',
    targetKey: 'seed_processing_register_id'
})

db.seedProcessingRegisterOldStocks.belongsTo(db.SeedForProcessedStackOldStocks,{
    foreignKey: 'id',
    targetKey: 'seed_processing_register_old_stock_id'
})

// db.investVerifyModel.belongsTo(db.varietyLinesModel, {
//     foreignKey: 'variety_code',
//     targetKey: 'variety_code',
// });

// stl form reletion (8 may 2024)
db.generateSampleSlipsModel.belongsTo(db.varietyModel, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code',
})
db.generateSampleSlipsModel.belongsTo(db.stateModel, {
    foreignKey: 'state_code',
    targetKey: 'state_code',
});


db.generateSampleSlipsModel.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code',
})
db.varietyModel.hasMany(db.generateSampleSlipsModel, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code',
})
db.cropModel.hasMany(db.generateSampleSlipsModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code',
})

db.seedProcessingRegister.belongsTo(db.seasonModel,{
    foreignKey: 'season',
    targetKey: 'season_code',
})
db.seedProcessingRegister.belongsTo(db.cropModel,{
    foreignKey: 'crop_code',
    targetKey: 'crop_code',
})
db.seedProcessingRegister.belongsTo(db.varietyModel,{
    foreignKey: 'variety_code',
    targetKey: 'variety_code',
})
db.seedProcessingRegister.belongsTo(db.mVarietyLinesModel,{
    foreignKey: 'variety_code_line',
    targetKey: 'line_variety_code',
})
db.generateSampleSlipsTestsModel.belongsTo(db.seedLabTests,{
    foreignKey: 'test_id',
    targetKey: 'id',
})
db.seedProcessingRegister.belongsTo(db.generateSampleSlipsModel,{
    foreignKey: 'crop_code',
    targetKey: 'crop_code',
})
db.generateSampleSlipsModel.belongsTo(db.intakeVerificationTags,{
    foreignKey: 'lot_id',
    targetKey: 'id',
})
db.intakeVerificationTags.belongsTo(db.investVerifyModel,{
    foreignKey: 'invest_verify_id',
    targetKey: 'id',
})
db.investVerifyModel.belongsTo(db.investHarvestingModel,{
    foreignKey: 'invest_harvesting_id',
    targetKey: 'id',
})
db.generateSampleSlipsModel.belongsTo(db.userModel, {
    foreignKey: 'got_bspc_id',
    targetKey: 'id',
})
db.generateSampleSlipsModel.belongsTo(db.investVerifyModel,{
    foreignKey: 'user_id',
    targetKey: 'bspc_id',
})
db.investHarvestingModel.belongsTo(db.userModel,{
    foreignKey: 'user_id',
    targetKey: 'id',
})
db.generateSampleSlipsModel.belongsTo(db.carryOverSeedDetailsModel,{
    foreignKey: 'lot_id',
    targetKey: 'lot_id',
})
db.carryOverSeedDetailsModel.belongsTo(db.carryOverSeedModel,{
    foreignKey: 'carry_over_seed_id',
    targetKey: 'id',
})
db.generateSampleSlipsModel.belongsTo(db.seedLabTestModel,{
    foreignKey: 'testing_lab',
    targetKey: 'id',
})
db.generateSampleSlipsModel.belongsTo(db.varietLineModel,{
    foreignKey: 'variety_code_line',
    targetKey: 'line_variety_code',
})
db.seedProcessingRegister.belongsTo(db.varietLineModel,{
    foreignKey: 'variety_code_line',
    targetKey: 'line_variety_code',
})
db.generateSampleSlipsModel.belongsTo(db.seasonModel,{
    foreignKey: 'season',
    targetKey: 'season_code',
})
db.generateSampleForwardingLettersModel.belongsTo(db.cropModel,{
    foreignKey: 'crop_code',
    targetKey: 'crop_code',
})
db.generateSampleForwardingLettersModel.belongsTo(db.varietyModel,{
    foreignKey: 'variety_code',
    targetKey: 'variety_code',
})
db.generateSampleForwardingLettersModel.belongsTo(db.mVarietyLinesModel,{
    foreignKey: 'variety_code_line',
    targetKey: 'line_variety_code',
})
db.generateSampleSlipsModel.belongsTo(db.generateSampleForwardingLettersModel,{
    foreignKey: 'id',
    targetKey: 'generate_sample_slip_id',
})
db.generateSampleForwardingLettersModel.belongsTo(db.seedLabTestModel,{
    foreignKey: 'testing_lab',
    targetKey: 'id',
})
db.generateSampleForwardingLettersModel.belongsTo(db.mVarietyLinesModel,{
    foreignKey: 'variety_code_line',
    targetKey: 'line_variety_code',
})

db.generateSampleForwardingLettersModel.belongsTo(db.varietyModel,{
    foreignKey: 'variety_code',
    targetKey: 'variety_code',
})
// db.generateSampleForwardingLettersModel.belongsTo(db.generateSampleSlipsModel,{
//     foreignKey: 'generate_sample_slip_id',
//     targetKey: 'id',
// })
db.generateSampleForwardingLettersModel.belongsTo(db.intakeVerificationTags,{
    foreignKey: 'lot_id',
    targetKey: 'id',
})
db.seedProcessingRegister.belongsTo(db.bspPerformaBspOne,{
    foreignKey: 'variety_code',
    targetKey: 'variety_code',
})
db.seedProcessingRegister.belongsTo(db.generateSampleForwardingLettersModel,{
    foreignKey: 'variety_code',
    targetKey: 'variety_code',
})
db.seedProcessingRegister.belongsTo(db.intakeVerificationTags,{
    foreignKey: 'lot_id',
    targetKey: 'id',
})
db.seedProcessingRegister.belongsTo(db.investVerifyModel,{
    foreignKey: 'invest_verify_id',
    targetKey: 'id',
})
db.investVerifyModel.belongsTo(db.investHarvestingModel,{
    foreignKey: 'invest_harvesting_id',
    targetKey: 'id',
})
db.seedProcessingRegister.belongsTo(db.carryOverSeedModel,{
    foreignKey: 'carry_over_id',
    targetKey: 'id',
})
db.stlReportStatusModel.belongsTo(db.mVarietyLinesModel,{
    foreignKey: 'variety_code_line',
    targetKey: 'line_variety_code',
})

db.stlReportStatusModel.belongsTo(db.varietyModel,{
    foreignKey: 'variety_code',
    targetKey: 'variety_code',
})
// db.generateSampleSlipsModel.belongsTo(db.stlReportStatusModel,{
//     foreignKey: 'crop_code',
//     targetKey: 'crop_code',
// })
db.stlReportStatusModel.belongsTo(db.generateSampleSlipsModel,{
    foreignKey: 'crop_code',
    targetKey: 'crop_code',
})
db.stlReportStatusModel.belongsTo(db.cropModel,{
    foreignKey: 'crop_code',
    targetKey: 'crop_code',
})
db.stlReportStatusModel.belongsTo(db.varietyModel,{
    foreignKey: 'variety_code',
    targetKey: 'variety_code',
})
db.stlReportStatusModel.belongsTo(db.seedProcessingRegister,{
    foreignKey: 'lot_id',
    targetKey: 'lot_id',
})

db.varietyPriceList.belongsTo(db.varietLineModel, {
    foreignKey: 'variety_line_code',
    targetKey: 'line_variety_code',
})

db.varietyPriceList.belongsTo(db.varietyModel, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code',
})
db.varietyPriceList.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code',
})
db.varietyPriceList.belongsTo(db.varietyPriceListPackagesModel,{
    foreignKey: 'id',
    targetKey: 'variety_priece_list_id',
})
db.stlReportStatusModel.belongsTo(db.mVarietyLinesModel,{
    foreignKey: 'variety_code_line',
    targetKey: 'line_variety_code',
})
db.stlReportStatusModel.belongsTo(db.carryOverSeedDetailsModel,{
    foreignKey: 'lot_id',
    targetKey: 'lot_id',
})
db.seedTagDetails.belongsTo(db.seedTagsModel,{
    foreignKey: 'id',
    targetKey: 'seed_tag_details_id',
})
db.seedProcessingRegister.belongsTo(db.stlReportStatusModel,{
    foreignKey: 'variety_code',
    targetKey: 'variety_code',
})
db.seedTagDetails.belongsTo(db.seasonModel,{
    foreignKey: 'season',
    targetKey: 'season_code',
})
db.seedTagDetails.belongsTo(db.cropModel,{
    foreignKey: 'crop_code',
    targetKey: 'crop_code',
})
db.seedTagDetails.belongsTo(db.varietyModel,{
    foreignKey: 'variety_code',
    targetKey: 'variety_code',
})
db.seedTagDetails.belongsTo(db.varietLineModel,{
    foreignKey: 'variety_line_code',
    targetKey: 'line_variety_code',
})
// db.reprintTagsModel.hasMany(db.reprintRequestedTagsModel,{
//     foreignKey: 'id',
//     targetKey: 'reprint_tag_id',
// })
db.reprintTagsModel.belongsTo(db.reprintRequestedTagsModel,{
    foreignKey: 'id',
    targetKey: 'reprint_tag_id',
})
// db.reprintTagsModel.hasMany(db.reprintRequestedTagsModel, {
//     foreignKey: 'id',
//     targetKey: 'reprint_tag_id'
// });
// db.reprintRequestedTagsModel.belongsTo(db.reprintTagsModel, {
//     foreignKey: 'reprint_tag_id',
// });
db.reprintTagsModel.belongsTo(db.seasonModel,{
    foreignKey: 'season',
    targetKey: 'season_code',
})
db.reprintTagsModel.belongsTo(db.cropModel,{
    foreignKey: 'crop_code',
    targetKey: 'crop_code',
})
db.reprintTagsModel.belongsTo(db.varietyModel,{
    foreignKey: 'variety_code',
    targetKey: 'variety_code',
})
db.reprintTagsModel.belongsTo(db.varietLineModel,{
    foreignKey: 'variety_line_code',
    targetKey: 'line_variety_code',
})
db.stlReportStatusModel.belongsTo(db.seedTagDetails,{
    foreignKey: 'lot_id',
    targetKey: 'lot_id',
})
db.seedTagDetails.belongsTo(db.seedTagRange,{
    foreignKey: 'id',
    targetKey: 'seed_tag_details_id',
})
db.agencyDetailModel.belongsTo(db.designationModel, {
    foreignKey: 'contact_person_designation_id',
    targetKey:'id'
});
db.reprintTagsModel.belongsTo(db.userModel,{
    foreignKey: 'user_id',
    targetKey: 'id',
})
db.reprintTagsModel.belongsTo(db.seedTagDetails,{
    foreignKey: 'crop_code',
    targetKey: 'crop_code',
})
db.seedTagDetails.belongsTo(db.userModel,{
    foreignKey: 'user_id',
    targetKey: 'id',
})
db.availabilityOfBreederSeedModel.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey:'crop_code'
});
db.availabilityOfBreederSeedModel.belongsTo(db.varietyModel, {
    foreignKey: 'variety_code',
    targetKey:'variety_code'
});
db.availabilityOfBreederSeedModel.belongsTo(db.mVarietyLinesModel, {
    foreignKey: 'variety_line_code',
    targetKey:'line_variety_code'
});
db.availabilityOfBreederSeedModel.belongsTo(db.userModel, {
    foreignKey: 'user_id',
    targetKey:'id'
});
db.indentOfBreederseedModel.belongsTo(db.indentOfBrseedLines, {
    foreignKey: 'id',
    targetKey:'indent_of_breederseed_id'
});
db.availabilityOfBreederSeedModel.belongsTo(db.agencyDetailModel, {
    foreignKey: 'user_id',
    targetKey:'user_id'
});

//reletion for lifting module
db.liftingSeedDetailsModel.belongsTo(db.seasonModel, {
    foreignKey: 'season',
    targetKey: 'season_code',
}); 
db.liftingSeedDetailsModel.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey:'crop_code'
});
db.liftingSeedDetailsModel.belongsTo(db.varietyModel, {
    foreignKey: 'variety_code',
    targetKey:'variety_code'
});
db.liftingSeedDetailsModel.belongsTo(db.mVarietyLinesModel, {
    foreignKey: 'variety_line_code',
    targetKey:'line_variety_code'
}); 
db.liftingSeedDetailsModel.belongsTo(db.liftingLotNumberModel, {
    foreignKey: 'id',
    targetKey:'lifting_details_id'
}); 
db.liftingSeedDetailsModel.belongsTo(db.liftingChargesModel, {
    foreignKey: 'id',
    targetKey:'lifting_details_id'
}); 
db.liftingLotNumberModel.belongsTo(db.liftingTagNumberModel, {
    foreignKey: 'id',
    targetKey:'lifting_lot_no_id'
}); 
db.seedProcessingRegister.belongsTo(db.carryOverSeedDetailsModel, {
    foreignKey: 'lot_id',
    targetKey: 'lot_id',
}); 
db.seedProcessingRegister.belongsTo(db.intakeVerificationTags, {
    foreignKey: 'lot_id',
    targetKey: 'invest_verify_id',
}); 
db.intakeVerificationTags.belongsTo(db.investVerifyModel, {
    foreignKey: 'invest_verify_id',
    targetKey: 'id',
}); 
 
db.allocationToIndentorSeed.belongsTo(db.seasonModel,{
    foreignKey: 'season',
    targetKey: 'season_code',
}) 
db.allocationToIndentorSeed.belongsTo(db.cropModel,{
    foreignKey: 'crop_code',
    targetKey: 'crop_code',
}) 
db.allocationToIndentorSeed.belongsTo(db.varietyModel,{
    foreignKey: 'variety_id',
    targetKey: 'id',
})

db.allocationSpaForLiftingSeed.belongsTo(db.stateModel, {
    foreignKey: 'state_code',
    targetKey: 'state_code',
});
db.allocationSpaForLiftingSeed.belongsTo(db.stateModel, {
    foreignKey: 'state_code',
    targetKey: 'state_code',
});
db.liftingSeedDetailsModel.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code',
});
// db.allocationSpaForLiftingSeed.belongsTo(db.varietyModel, {
//     foreignKey: 'crop_code',
//     targetKey: 'crop_code',
//   });
db.seedTagsModel.belongsTo(db.seedTagDetails, {
    foreignKey: 'seed_tag_details_id',
    targetKey: 'id',
});
db.stlReportStatusModel.belongsTo(db.seedTagDetails, {
    foreignKey: 'lot_no',
    targetKey: 'lot_no',
});
db.seedTagDetails.belongsTo(db.stlReportStatusModel, {
    foreignKey: 'lot_no',
    targetKey: 'lot_no',
});
db.liftingSeedDetailsModel.belongsTo(db.agencyDetailModel, {
    foreignKey: 'spa_state_code',
    targetKey: 'state_id',
});
db.liftingSeedDetailsModel.belongsTo(db.agencyDetailModel2, {
    foreignKey: 'spa_state_code',
    targetKey: 'state_id',
    as:'agencyDetails2'
});
db.agencyDetailModel2.belongsTo(db.userModel, {
    foreignKey: 'user_id',
    targetKey: 'id',
    // as:'agencyDetails2'
});
db.liftingSeedDetailsModel.belongsTo(db.liftingTagNumberModel, {
    foreignKey: 'id',
    targetKey: 'litting_seed_details_id',
    // as:'liftingTagNumberV2'
});
db.liftingSeedDetailsModel.belongsTo(db.bspProrforma3Model, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code',
    // as:'liftingTagNumberV2'
});
db.allocationToSPASeed.hasMany(db.allocationSpaForLiftingSeed, {
    foreignKey: 'allocation_to_spa_for_lifting_seed_id',
    targetKey: 'id'
});
db.allocationSpaForLiftingSeed.belongsTo(db.allocationToSPASeed, {
    foreignKey: 'allocation_to_spa_for_lifting_seed_id',
});
db.allocationSpaForLiftingSeed.belongsTo(db.userModel, {
    foreignKey: 'spa_code',
    targetKey: 'spa_code'
});
db.allocationToIndentorSeed.belongsTo(db.userModel, {
    foreignKey: 'user_id',
    targetKey: 'id'
});

db.allocationToIndentorLiftingSeed.belongsTo(db.userModel, {
    foreignKey: 'user_id',
    targetKey: 'id'
});
db.allocationToIndentorSeed.belongsTo(db.allocationToIndentorProductionCenterSeed, {
    foreignKey: 'id',
    targetKey: 'allocation_to_indentor_for_lifting_seed_id'
});
db.allocationToIndentorProductionCenterSeed.belongsTo(db.userModel, {
    foreignKey: 'indent_of_breeder_id',
    targetKey: 'id'
});
db.allocationToIndentorSeed.belongsTo(db.allocationToIndentorProductionCenterSeed, {
    foreignKey: 'id',
    targetKey: 'allocation_to_indentor_for_lifting_seed_id'
});

db.allocationToIndentorProductionCenterSeed.belongsTo(db.agencyDetailModel, {
    foreignKey: 'indent_of_breeder_id',
    targetKey: 'user_id'
});
db.liftingSeedDetailsModel.belongsTo(db.generateBreederSeedCertificate, {
    foreignKey: 'id',
    targetKey: 'lifting_id'
});
db.allocationToSPASeed.belongsTo(db.varietyModel,{
    foreignKey: 'variety_id',
    targetKey: 'id'
})
db.allocationToSPASeed.belongsTo(db.varietyModel,{
    foreignKey: 'variety_id',
    targetKey: 'id'
})
db.allocationToSPASeed.belongsTo(db.varietLineModel,{
    foreignKey: 'variety_line_code',
    targetKey: 'line_variety_code'
})
db.allocationSpaForLiftingSeed.belongsTo(db.agencyDetailModel,{
    foreignKey: 'production_center_id',
    targetKey: 'user_id'
})


 
db.receiptRequest.belongsTo(db.seasonModel,{
    foreignKey: 'season',
    targetKey: 'season_code',
}) 
db.receiptRequest.belongsTo(db.cropModel,{
    foreignKey: 'crop_code',
    targetKey: 'crop_code',
})  
db.receiptRequest.belongsTo(db.userModel, {
    foreignKey: 'spa_code',
    targetKey: 'spa_code'
});
db.receiptRequest.belongsTo(db.stateModel, {
    foreignKey: 'state_code',
    targetKey: 'state_code',
});
db.receiptRequest.belongsTo(db.varietyModel, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code',
    // as:'liftingTagNumberV2'
})
db.liftingSeedDetailsModel.belongsTo(db.agencyDetailModel, {
    foreignKey: 'user_id',
    targetKey: 'user_id',
});
db.liftingSeedDetailsModel.belongsTo(db.generateBreederSeedCertificate, {
    foreignKey: 'id',
    targetKey: 'lifting_id',
});
// db.allocationToIndentorSeed.belongsTo(db.allocationToIndentorLiftingSeed, {
//     foreignKey: 'allocation_to_indentor_for_lifting_seed_id',
//     targetKey: 'id'
// });
// db.allocationToIndentorLiftingSeed.belongsTo(db.allocationToIndentorSeed, {
//     foreignKey: 'allocation_to_indentor_for_lifting_seed_id',
// });

//get parental Line Name Start
db.liftingSeedDetailsModel.belongsTo(db.mVarietyLinesModel, {
    foreignKey: 'variety_line_code',
    targetKey: 'line_variety_code',
});
//ends

// get indent_quantity Start
db.liftingSeedDetailsModel.belongsTo(db.indentOfBreederseedModel, {
    foreignKey: 'indentor_id',
    targetKey: 'user_id',
    // as: 'indent_of_breederseeds'
});



db.liftingSeedDetailsModel.belongsTo(db.indenterSPAModel, 
    {
    foreignKey: 'spa_state_code',
    targetKey: 'state_code',
    },
    {
        foreignKey: 'spa_code',
        targetKey: 'spa_code',
    },
    {
        foreignKey: 'variety_code',
        targetKey: 'variety_code',
    }
);

db.indenterSPAModel.belongsTo(db.indentOfSpaLinesModel, 
    {
    foreignKey: 'id',
    targetKey: 'indent_of_spa_id',
    }
    
);

// db.liftingSeedDetailsModel.belongsTo(db.indentOfSpaLinesModel, 
//     {
//     foreignKey: 'variety_line_code',
//     targetKey: 'variety_code_line',
//     }
// )

db.liftingSeedDetailsModel.belongsTo(db.cropVerietyModel, 
    {
    foreignKey: 'variety_code',
    targetKey: 'variety_code',
    }
)

db.liftingSeedDetailsModel.belongsTo(db.cropModel, 
    {
    foreignKey: 'crop_code',
    targetKey: 'crop_code',
    }
)



db.liftingSeedDetailsModel.belongsTo(db.receiptRequestModel, 
    {
    foreignKey: 'spa_state_code',
    targetKey: 'state_code',
    },
    {
    foreignKey: 'spa_code',
    targetKey: 'spa_code',
    },
);

db.liftingSeedDetailsModel.belongsTo(db.allocationToSPASeed, 
    {
    foreignKey: 'crop_code',
    targetKey: 'crop_code',
    }
);



db.allocationToSPASeed.belongsTo(db.allocationSpaForLiftingSeed, 
    {
    foreignKey: 'id',
    targetKey: 'allocation_to_spa_for_lifting_seed_id',
    }
);
db.varietyModel.belongsTo(db.varietLineModel, 
    {
    foreignKey: 'variety_code',
    targetKey: 'variety_code',
    }
);
db.allocationSpaForLiftingSeed.belongsTo(db.receiptRequestModel, 
    {
    foreignKey: 'id',
    targetKey: 'allocation_spa_id',
    }
);
// for generate invoice 
db.receiptRequestModel.belongsTo(db.varietyModel, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code'
    });
      
db.varietyModel.hasMany(db.receiptRequestModel, {
    foreignKey: 'variety_code',
    sourceKey: 'variety_code'
    });
      
db.receiptRequestModel.belongsTo(db.userModel, {
    foreignKey: 'indenter_id',
    targetKey: 'id',
    as: 'userModelIndenter'
  });

db.receiptRequestModel.belongsTo(db.userModel, {
    foreignKey: 'spa_code',
    targetKey: 'spa_code',
    as: 'userModelSpa'
  });

db.userModel.belongsTo(db.agencyDetailModel, {
    foreignKey: 'id',
    targetKey: 'user_id'
  });

db.receiptRequestModel.belongsTo(db.allocationToSPASeed, {
    foreignKey: 'year',
    targetKey: 'year'
  });

  db.liftingSeedDetailsModel.belongsTo(db.agencyDetailModel3, {
    foreignKey: 'indentor_id',
    targetKey: 'user_id',
});
db.agencyDetailModel3.belongsTo(db.userModel, {
    foreignKey: 'user_id',
    targetKey: 'id',
});
db.agencyDetailModel3.belongsTo(db.userModel, {
    foreignKey: 'user_id',
    targetKey: 'id',
});
db.liftingSeedDetailsModel.belongsTo(db.agencyDetailModel4, {
    foreignKey: 'spa_state_code',
    targetKey: 'state_id',
});
db.agencyDetailModel4.belongsTo(db.userModel, {
    foreignKey: 'user_id',
    targetKey: 'id',
});
db.liftingSeedDetailsModel.belongsTo(db.agencyDetailModel5, {
    as:'agencyData',
    foreignKey: 'user_id',
    targetKey: 'user_id',
});
db.agencyDetailModel5.belongsTo(db.userModel, {
    foreignKey: 'user_id',
    targetKey: 'id',
});
db.agencyDetailModel5.belongsTo(db.stateModel, {
    foreignKey: 'state_id',
    targetKey: 'state_code',
});
db.agencyDetailModel5.belongsTo(db.districtModel, {
    foreignKey: 'district_id',
    targetKey: 'district_code',
});
db.liftingSeedDetailsModel.belongsTo(db.commentsModel, {
    foreignKey: 'reason_id',
    targetKey: 'id',
});

db.liftingSeedDetailsModel.belongsTo(db.cropVerietyModel, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code'
});

db.liftingSeedDetailsModel.hasMany(db.liftingTagNumberModel, {
    foreignKey: 'litting_seed_details_id'
});

db.liftingSeedDetailsModel.belongsTo(db.userModel, {
    as: 'usersModelIndenter',
    foreignKey: 'indentor_id',
    targetKey: 'id'
});

db.liftingSeedDetailsModel.belongsTo(db.userModel, {
    as: 'userModelSpa',
    foreignKey: 'spa_code',
    targetKey: 'spa_code'
}); 
db.userModel.hasMany(db.agencyDetailModel, {
    foreignKey: 'user_id'
}); 
db.Chats.belongsTo(db.userModel, {
    foreignKey: 'sender_id',
    as: 'Sender'
});
db.Chats.belongsTo(db.userModel, {
    foreignKey: 'receiver_id',
    as: 'Receiver'
});
 
db.userModel.hasMany(db.Chats, {
    foreignKey: 'sender_id' , as: 'SentMessages'
    
});
db.userModel.hasMany(db.Chats, {
    foreignKey: 'receiver_id', as: 'ReceivedMessages'  
});
db.allocationToSPASeed.hasMany(db.allocationSpaForLiftingSeed, {
    foreignKey: 'allocation_to_spa_for_lifting_seed_id'
});

db.liftingSeedDetailsModel.belongsTo(db.allocationToSPASeed, {
    foreignKey: 'user_id',
    targetKey: 'user_id'
});

db.liftingSeedDetailsModel.belongsTo(db.indenterSPAModel, {
    as: 'indenterSPAModell',
    foreignKey: 'user_id',
    targetKey: 'user_id'
});

db.liftingSeedDetailsModel.belongsTo(db.commentsModel, {
    as: 'reason_for_short',
    foreignKey: 'reason_id',
    targetKey: 'id'
});


db.allocationToIndentor.belongsTo(db.varietyModel, {
    // as: 'reason_for_short',
    foreignKey: 'variety_id',
    targetKey: 'id'
});

db.allocationToIndentor.belongsTo(db.varietyModel, {
    // as: 'reason_for_short',
    foreignKey: 'variety_id',
    targetKey: 'id'
});
db.receiptRequest.belongsTo(db.receiptGenerateModel, {
    as: 'receiptgenerate',
    foreignKey: 'id',
    targetKey: 'reciept_request_id'
});
db.receiptGenerateModel.belongsTo(db.receiptGenerateBagModel, {
    as: 'receiptgeneratebags',
    foreignKey: 'id',
    targetKey: 'receipt_generate_id'
});
db.bspPerformaBspOne.belongsTo(db.bspPerformaBspTwo, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code',
});
db.bspPerformaBspTwo.belongsTo(db.bspPerformaBspOne, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code',
});
db.bspPerformaBspOne.belongsTo(db.indentOfBreederseedModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code',
});
db.indentOfBreederseedModel.belongsTo(db.bspPerformaBspOne, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code',
});

db.userModel.belongsTo(db.bspPerformaBspOne, {
    foreignKey: 'id',
    targetKey: 'user_id',
});

db.bspPerformaBspOne.belongsTo(db.userModel, {
    foreignKey: 'user_id',
    targetKey: 'id',
});

db.bspPerformaBspOne.belongsTo(db.agencyDetailModel, {
    foreignKey: 'user_id',
    targetKey: 'user_id',
});

db.agencyDetailModel.belongsTo(db.bspPerformaBspOne, {
    foreignKey: 'user_id',
    targetKey: 'user_id',
});

db.bspPerformaBspThree.belongsTo(db.bspPerformaBspTwo, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code',
});
db.stlReportStatusModel.belongsTo(db.seedTestingLabModel, {
    foreignKey: 'testing_lab',
    targetKey: 'id',
    as:'seedLabtest'
});
db.bspProforma1BspcsModel.belongsTo(db.userModel, {
    foreignKey: 'bspc_id',
    targetKey: 'id',
});
db.bspPerformaBspTwo.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code',
});
db.bspPerformaBspThree.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code',
});
db.bspProformaOneBspc.belongsTo(db.bspPerformaBspOne, {
    foreignKey: 'bspc_proforma_1_id',
    // targetKey: 'id'
});
db.bspPerformaBspOne.belongsTo(db.bspProformaOneBspc, {
    foreignKey: 'id',
    targetKey: 'bspc_proforma_1_id'
});
db.seedForProductionModel.belongsTo(db.userModel, {
    foreignKey: 'user_id',
    targetKey: 'id'
});
db.inabilityReallocatesModel.belongsTo(db.mVarietyLinesModel, {
    foreignKey: 'variety_line_code',
    targetKey: 'line_variety_code',
});
db.bspProformaOneBspc.belongsTo(db.userModel, {
    foreignKey: 'bspc_id',
    targetKey: 'id',
});

//get Got Sample Reception
db.gotTestingModel.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code',
});
db.gotTestingModel.belongsTo(db.cropVerietyModel, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code'
});
db.cropVerietyModel.belongsTo(db.varietLineModel,{
    foreignKey: 'variety_code',
    targetKey: 'variety_code',
});

db.gotTestingModel.belongsTo(db.agencyDetailModel, {
    foreignKey: 'user_id',
    targetKey: 'user_id',
});

db.gotTestingModel.belongsTo(db.commentsModel, {
    foreignKey: 'reason_id',
    targetKey: 'id',
});
db.gotTestingModel.belongsTo(db.generateSampleSlipsModel, {
    foreignKey: 'unique_code',
    targetKey: 'unique_code',
});

db.gotShowingDetailsModel.belongsTo(db.stateModel, {
    foreignKey: 'state_code',
    targetKey: 'state_code'
});

db.gotShowingDetailsModel.belongsTo(db.districtModel, {
    foreignKey: 'district_code',
    targetKey: 'district_code'
});
db.gotShowingDetailsModel.belongsTo(db.gotTestingModel, {
    foreignKey: 'got_testing_id',
    targetKey: 'id'
});
db.gotMonitoringTeamsModel.belongsTo(db.gotTestingModel, {
    foreignKey: 'id',
    targetKey: 'got_monitoring_team_id'
});
db.gotTestingModel.belongsTo(db.gotMonitoringTeamsModel, {
    foreignKey: 'got_monitoring_team_id',
    targetKey: 'id'
});

db.gotMonitoringTeamsModel.hasMany(db.gotMonitoringTeamsMemberModel, {
   foreignKey: 'got_monitoring_team_id',
   as: 'members', 
 });
 
db.gotMonitoringTeamsMemberModel.belongsTo(db.gotMonitoringTeamsModel, {
   foreignKey: 'got_monitoring_team_id',
   as: 'team',
});

db.gotMonitoringTeamsMemberModel.belongsTo(db.designationModel, {
  foreignKey: 'designation_id',
  targetKey: 'id'
});
 
// ends
module.exports = db;
