const sequelize = require("./db.js");
const Sequelize = require('sequelize');
const monitoring_team_pdpcModel = require("./monitoring_team_pdpc.model.js");
const monitoring_team_pdpc_detailsModel = require("./monitoring_team_pdpc_details.model.js");
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.stateModel = require("./state.model")(sequelize, Sequelize);
db.districtModel = require("./district.model")(sequelize, Sequelize);
db.userModel = require("./user.model")(sequelize, Sequelize);
db.cropModel = require("./crop.model")(sequelize, Sequelize);
db.srp_cropModel=require("./srp_crop.model")(sequelize, Sequelize);
db.srp_varietyModel=require("./srp_variety.model")(sequelize, Sequelize);
// db.seedRollingPlanVarietyWises = require("./srp_variety.model")(sequelize, Sequelize);

db.srpCropModel = require("./srp_crop.model")(sequelize, Sequelize);

db.srpYearModel = require("./srp_year.model.js")(sequelize, Sequelize);
db.varietyModel = require("./variety.model")(sequelize, Sequelize);
db.agencyDetailModel = require("./agency_detail.model")(sequelize, Sequelize);
db.designationModel = require("./designation.model")(sequelize, Sequelize);
db.bsp1Model = require("./bsp1.model")(sequelize, Sequelize);
db.bsp2Model = require("./bsp2.model")(sequelize, Sequelize);
db.bsp3Model = require("./bsp3.model")(sequelize, Sequelize);
db.bsp4Model = require("./bsp4.model")(sequelize, Sequelize);
db.bsp5aModel = require("./bsp5a.model")(sequelize, Sequelize);
db.bsp5bModel = require("./bsp5b.model")(sequelize, Sequelize);
db.bsp6Model = require("./bsp6.model")(sequelize, Sequelize);
db.cropVerietyModel = require("./crop_veriety.model")(sequelize, Sequelize);
db.monitoringReportModel = require("./monitoring_teams.model")(sequelize, Sequelize);
db.indentOfBreederseedModel = require('./indent_of_breederseed.model')(sequelize, Sequelize);
db.nucleusSeedAvailabityModel = require("./nucleus_seed_availabity.model")(sequelize, Sequelize);
db.categoryModel = require("./category.model")(sequelize, Sequelize);
db.tokens = require("../models/token.model.js")(sequelize, Sequelize);
db.auditTail = require('./audit_trail.model.js')(sequelize, Sequelize);
db.allocationToIndentorForLiftingBreederseedsModel = require('./allocation_to_indentor_for_lifting_breederseeds.model.js')(sequelize, Sequelize);
db.freezeTimeline = require('./freeze_timeline.model.js')(sequelize, Sequelize);
db.bsp1ProductionCenter = require('./bsp1_production_center.model.js')(sequelize, Sequelize);
db.plantDetails = require('./plant_detail.model.js')(sequelize, Sequelize);
db.indentOfSpa = require('./indent_of_spa.model.js')(sequelize, Sequelize);
db.seasonModel = require('./season.model.js')(sequelize, Sequelize);
db.activitiesModel = require('./activities.model.js')(sequelize, Sequelize);
db.blockModel = require('./block.model.js')(sequelize, Sequelize);
db.centralModel = require('./central.model.js')(sequelize, Sequelize);
db.allocationtoIndentorliftingseeds = require('./allocation_to_indentor_for_lifting_seeds.model.js')(sequelize, Sequelize);
db.allocationToSPASeed = require("./allocation_to_spa_for_lifting_seeds.model")(sequelize, Sequelize);
db.allocationToSPAProductionCenterSeed = require("./allocation_to_spa_for_lifting_seed_production_cnter.model")(sequelize, Sequelize);
db.indenterSPAModel = require("./indent_of_spa.model")(sequelize, Sequelize);
db.seedLabTestModel = require("./m_seed_lab_test.model")(sequelize, Sequelize);
db.bspctoplantModel = require("./bspc_to_plants.model.js")(sequelize, Sequelize);
db.labelNumberForBreederseed = require("./label_number_for_breederseed.model")(sequelize, Sequelize);
db.generatedLabelNumberModel = require("./generated_label_number.model")(sequelize, Sequelize);
db.generateBills = require("./generate_bill.model")(sequelize, Sequelize);

db.allocationToIndentorProductionCenterSeed = require("./allocation_to_indentor_for_lifting_seed_production_cnter.model")(sequelize, Sequelize);
db.sectorModel = require("./sector.model")(sequelize, Sequelize);
db.cropGroupModel = require("./crop_group.model")(sequelize, Sequelize);
db.deleteIndenteOfSpaModel = require("./deleted_indent_of_spa.model")(sequelize, Sequelize);
db.deleteIndenteOfBreederSeedModel = require("./deleted_indent_of_indenter.model")(sequelize, Sequelize);
db.breederCropsVerietiesModel = require("./breeder_crops_verieties.model")(sequelize, Sequelize);
db.breederCropModel = require("./breeder_crop.model")(sequelize, Sequelize);
db.seedTestingReportsModel = require("./seed_testing_reports.model")(sequelize, Sequelize);
db.lotNumberModel = require("./lot_number.model")(sequelize, Sequelize);
db.bsp4ToPlant = require('./bsp4_to_plant.model')(sequelize, Sequelize);
db.seedInventory = require('./seed_inventory.model.js')(sequelize, Sequelize);
db.seedInventoryTag = require('./seed_inventory_tag.model')(sequelize, Sequelize);
db.seedInventoryTagDetail = require('./seed_inventory_tag_detail.model')(sequelize, Sequelize);

db.stageModel = require('./stage.model.js')(sequelize, Sequelize);
db.assignCropNewFlow = require('./assign_crop_new_flow.model')(sequelize, Sequelize);
db.assignBspcCropNewFlow = require('./assign_crop_bspc_new_flow.model')(sequelize, Sequelize);
db.seedForProductionModel = require('./seed_for_production.model')(sequelize, Sequelize);
db.monitoringTeamPdpc = require('./monitoring_team_pdpc.model')(sequelize, Sequelize);
db.monitoringTeamPdpcDetails = require('./monitoring_team_pdpc_details.model.js')(sequelize, Sequelize);
db.agencytypeModel = require('./agency_type.model.js')(sequelize, Sequelize);
db.seedClassModel = require('./seed_class.model.js')(sequelize, Sequelize);
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
db.indentOfBrseedDirectLineModel = require('./indent_of_brseed_direct_line.model.js')(sequelize, Sequelize);
db.commentsModel = require('./comments.model.js')(sequelize, Sequelize);
db.mIndentPermissionsModel = require('./m_indent_permissions.model.js')(sequelize, Sequelize);

db.indentOfBreederseedModel = require('./indent_of_breederseed.model.js')(sequelize, Sequelize);
db.indentOfSpaLinesModel = require('./indent_of_spa_lines.model.js')(sequelize, Sequelize);
db.deletedIndentOfSpaLinesModel = require('./deleted_indent_of_spa_lines.model.js')(sequelize, Sequelize);
db.deletedIndentOfBrseedLinesModel = require('./deleted_indent_of_brseed_lines.model.js')(sequelize, Sequelize);
db.designationModelSecond = require("./designation.model")(sequelize, Sequelize);
db.mAgroEcologicalRegionsModel = require("./m_agro_ecological_regions.model.js")(sequelize, Sequelize);
db.carryOverSeedModel = require('./carry_over_seed.model.js')(sequelize, Sequelize);
db.carryOverSeedDetailsModel = require('./carry_over_seed_details.model.js')(sequelize, Sequelize);
db.carryOverSeedDetailsTagsModel = require('./carry_over_seed_details_tags.model.js')(sequelize, Sequelize);
db.varietyPriceList = require('./variety_price_lists.model.js')(sequelize, Sequelize);
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
db.carryOverSeedDetailsModel = require('./carry_over_seed_details.model.js')(sequelize, Sequelize);
db.carryOverSeedDetailsModel = require('./carry_over_seed_details.model.js')(sequelize, Sequelize);
db.varietyPriceListPackagesModel = require('./variety_price_list_packages.model.js')(sequelize, Sequelize);

// characterstic new model 
db.mAgroLogicalRegionstatesModel = require('./m_agro_logical_region_states.model.js')(sequelize, Sequelize);
db.mClimateResiliencesModel = require('./m_climate_resiliences.model.js')(sequelize, Sequelize);
db.mMatuarityDaysModel = require('./m_matuarity_days.model.js')(sequelize, Sequelize);
db.mReactionToMajorDiseasesModel = require('./m_reaction_to_major_diseases.model.js')(sequelize, Sequelize);
db.mReactionToMajorInsectPestsModel = require('./m_reaction_to_major_insect_pests.model.js')(sequelize, Sequelize);
db.varietyCategoryModel = require('./variety_category.model.js')(sequelize, Sequelize);
db.cropCharactersticsModel = require("./crop_characteristics.model")(sequelize, Sequelize);
db.varietyCategoryMappingModel = require("./variety_category_mapping.model.js")(sequelize, Sequelize);
db.responsibleInsitutionModel = require("./responsible_insitution.model.js")(sequelize, Sequelize);
db.liftingSeedDetailsModel = require('./lifting_seed_details.model.js')(sequelize, Sequelize);
db.seedRollingPlanCropWisesModel = require('./srp_crop.model.js')(sequelize, Sequelize);
db.seedMultiplicationRatioModel = require('./seed_multiplication_ratio.model.js')(sequelize, Sequelize)
db.seasonModel = require('./season.model.js')(sequelize, Sequelize);
// Here
// table first
//table second
//=================forSRP module============



db.srpCropModel.belongsTo(db.seasonModel,{
    foreignKey:"season",
    targetKey:"season"
})
db.seasonModel.hasMany(db.srpCropModel,{
    foreignKey:"season",
    sourceKey:"season"
})
db.srpCropModel.belongsTo(db.srpYearModel,{
    foreignKey:"year",
    targetKey:"year"
})
db.srpYearModel.hasMany(db.srpCropModel,{
     foreignKey:"year",
    sourceKey:"year"
})
db.srpCropModel.belongsTo(db.cropModel, {
  foreignKey: "crop_code",
  targetKey: "crop_code",
  
});
db.cropModel.hasMany(db.srpCropModel, {
  foreignKey: "crop_code",
  sourceKey: "crop_code",

});
db.cropGroupModel.hasMany(db.srpCropModel, {
  foreignKey: "group_code",   // column in srpCrop table
  sourceKey: "group_code",    // column in cropGroup table
});
db.srpCropModel.belongsTo(db.cropGroupModel, {
  foreignKey: "group_code",
  targetKey: "group_code",
});
//=============== for Reletion ==================


db.allocationToSPASeed.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'
});

db.directIndent.belongsTo(db.indentOfBrseedDirectLineModel, {
    foreignKey: 'id',
    targetKey: 'indent_of_breederseed_direct_id'
});

db.allocationToSPASeed.belongsTo(db.varietyModel, {
    foreignKey: 'variety_id'
});
db.plantDetails.belongsTo(db.bspctoplantModel, {
    foreignKey: 'id',
    targetKey: 'plant_id'
});


db.allocationToSPASeed.belongsTo(db.seasonModel, {
    foreignKey: 'season',
    targetKey: 'season_code'
});
/////
db.allocationToSPASeed.hasMany(db.allocationToSPAProductionCenterSeed, {
    foreignKey: 'allocation_to_spa_for_lifting_seed_id',
    targetKey: 'id'
});

db.allocationToSPAProductionCenterSeed.hasMany(db.indenterSPAModel, {
    foreignKey: 'spa_code',
    sourceKey: 'spa_code',
});

db.allocationToSPAProductionCenterSeed.belongsTo(db.userModel, {
    foreignKey: 'production_center_id',
    targetKey: 'id'
});

/*
db.generateBills.belongsTo(db.indenterSPAModel, {
    foreignKey: 'spa_code',
    targetKey: 'spa_code'
});*/
db.indenterSPAModel.belongsTo(db.userModel, {
    foreignKey: 'user_id'
});

db.indenterSPAModel.belongsTo(db.userModel, {
    foreignKey: 'spa_code',
    targetKey: 'spa_code'
});

db.agencyDetailModel.hasOne(db.userModel, {
    foreignKey: 'agency_id'
});
db.userModel.belongsTo(db.agencyDetailModel, {
    foreignKey: 'agency_id'
});
// db.srp_cropModel.belongsTo(db.cropModel, {
//     foreignKey: 'crop_code',
//     targetKey:'crop_code'
// });
  
// });
// db.varietyModel.belongsTo(db.srp_varietyModel, {
//   foreignKey: 'variety_code',
//   targetKey: 'variety_code'
// });
db.varietyModel.belongsTo(db.srp_varietyModel, {
  foreignKey: 'variety_code',
  targetKey: 'variety_code'
});

// db.varietyModel.hasMany(db.srp_varietyModel, {
//   foreignKey: 'variety_code',
//   sourceKey: 'variety_code',
//   as: 'srpVarieties',
// });

// db.srp_varietyModel.belongsTo(db.varietyModel, {
//   foreignKey: 'variety_code',
//   targetKey: 'variety_code',
//   as: 'varietyMaster',
// });

// SeedRollingPlanVarietyWise.belongsTo(db.m_crop_variety, {
//   foreignKey: 'variety_code',
//   targetKey: 'variety_code',
// });


db.designationModel.hasOne(db.userModel, {
    foreignKey: 'designation_id'
});
db.userModel.belongsTo(db.designationModel, {
    foreignKey: 'designation_id'
});

db.agencyDetailModel.belongsTo(db.categoryModel, {
    foreignKey: 'category'
});

db.agencyDetailModel.belongsTo(db.designationModel, {
    foreignKey: 'contact_person_designation_id'
});
db.designationModel.hasMany(db.agencyDetailModel, {
    foreignKey: 'contact_person_designation_id'
});

db.agencyDetailModel.belongsTo(db.categoryModel, {
    foreignKey: 'category'
});
db.userModel.belongsTo(db.agencyDetailModel, {
    foreignKey: 'agency_id'
})

db.indentOfBreederseedModel.belongsTo(db.userModel, {
    foreignKey: 'user_id',
    targetKey: 'id'
});

db.allocationToIndentorForLiftingBreederseedsModel.belongsTo(db.indentOfBreederseedModel, {
    foreignKey: 'indent_of_breeder_id',
    targetKey: 'id'
});

db.indentOfBreederseedModel.hasMany(db.allocationToIndentorForLiftingBreederseedsModel, {
    foreignKey: 'indent_of_breeder_id'
});

db.cropVerietyModel.belongsTo(db.indentOfBreederseedModel, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code'
});

db.indentOfBreederseedModel.belongsTo(db.agencyDetailModel, {
    foreignKey: 'user_id',
    targetKey: 'user_id'
});

db.userModel.belongsTo(db.agencyDetailModel, {
    foreignKey: 'agency_id',
    targetKey: 'id'
});

db.agencyDetailModel.hasMany(db.userModel, {
    foreignKey: 'id'
});

// db.bsp1Model.belongsTo(db.nucleusSeedAvailabityModel, {
//     foreignKey: 'production_center_id',
//     targetKey: 'production_center_id'
// });

db.bsp2Model.belongsTo(db.nucleusSeedAvailabityModel, {
    foreignKey: 'production_center_id',
    targetKey: 'production_center_id'
});

db.bsp3Model.belongsTo(db.nucleusSeedAvailabityModel, {
    foreignKey: 'production_center_id',
    targetKey: 'production_center_id'
});

db.bsp4Model.belongsTo(db.nucleusSeedAvailabityModel, {
    foreignKey: 'production_center_id',
    targetKey: 'production_center_id'
});

db.bsp5aModel.belongsTo(db.nucleusSeedAvailabityModel, {
    foreignKey: 'production_center_id',
    targetKey: 'production_center_id'
});

db.bsp5bModel.belongsTo(db.nucleusSeedAvailabityModel, {
    foreignKey: 'production_center_id',
    targetKey: 'production_center_id'
});

db.bsp6Model.belongsTo(db.nucleusSeedAvailabityModel, {
    foreignKey: 'production_center_id',
    targetKey: 'production_center_id'
});

db.bsp1Model.belongsTo(db.cropVerietyModel, {
    foreignKey: 'variety_id',
    targetKey: 'id'
});

db.bsp2Model.belongsTo(db.cropVerietyModel, {
    foreignKey: 'variety_id',
    targetKey: 'id'
});

db.bsp3Model.belongsTo(db.cropVerietyModel, {
    foreignKey: 'variety_id',
    targetKey: 'id'
});

db.bsp4Model.belongsTo(db.cropVerietyModel, {
    foreignKey: 'variety_id',
    targetKey: 'id'
});

db.bsp5aModel.belongsTo(db.cropVerietyModel, {
    foreignKey: 'variety_id',
    targetKey: 'id'
});

db.bsp5bModel.belongsTo(db.cropVerietyModel, {
    foreignKey: 'variety_id',
    targetKey: 'id'
});

db.bsp6Model.belongsTo(db.cropVerietyModel, {
    foreignKey: 'variety_id',
    targetKey: 'id'
});

db.cropVerietyModel.hasMany(db.bsp1Model, {
    foreignKey: 'id'
});

db.cropVerietyModel.hasMany(db.bsp2Model, {
    foreignKey: 'id'
});

db.cropVerietyModel.hasMany(db.bsp3Model, {
    foreignKey: 'id'
});

db.cropVerietyModel.hasMany(db.bsp4Model, {
    foreignKey: 'id'
});

db.cropVerietyModel.hasMany(db.bsp5aModel, {
    foreignKey: 'id'
});

db.cropVerietyModel.hasMany(db.bsp5bModel, {
    foreignKey: 'id'
});

db.cropVerietyModel.hasMany(db.bsp6Model, {
    foreignKey: 'id'
});

db.bsp3Model.belongsTo(db.monitoringReportModel, {
    foreignKey: 'user_mapping_id',
    targetKey: 'user_mapping_id'
});


//agency and state relation start
db.agencyDetailModel.belongsTo(db.stateModel, {
    foreignKey: 'state_id',
    targetKey: 'state_code',
});
db.stateModel.hasMany(db.agencyDetailModel, {
    foreignKey: 'state_id',
    targetKey: 'state_code',
});


db.agencyDetailModel.belongsTo(db.districtModel, {
    foreignKey: 'district_id',
    targetKey: 'district_code',
});
db.districtModel.hasMany(db.agencyDetailModel, {
    foreignKey: 'district_id',
    targetKey: 'district_code',
});

db.bsp2Model.belongsTo(db.bsp1Model, {
    foreignKey: 'bsp_1_id',
    targetKey: 'id'
});

db.bsp3Model.belongsTo(db.bsp2Model, {
    foreignKey: 'bsp_2_id',
    targetKey: 'id'
});

db.bsp4Model.belongsTo(db.bsp3Model, {
    foreignKey: 'bsp_3_id',
    targetKey: 'id'
});

db.bsp5aModel.belongsTo(db.bsp4Model, {
    foreignKey: 'bsp_4_id',
    targetKey: 'id'
});

db.bsp5bModel.belongsTo(db.bsp5aModel, {
    foreignKey: 'bsp_5_a_id',
    targetKey: 'id'
});
//agency and state relation end

//start reletion between bsp1 and bsp1_production table
db.bsp1Model.hasMany(db.bsp1ProductionCenter, {
    foreignKey: 'bsp_1_id',
    targetKey: 'bsp_1_id'
});
db.bsp1ProductionCenter.belongsTo(db.bsp1Model, {
    foreignKey: 'bsp_1_id',
})
//finish reletion between bsp1 and bsp1_production table

//start reletion between bsp1 and bsp1_production table
db.nucleusSeedAvailabityModel.hasMany(db.bsp1ProductionCenter, {
    foreignKey: 'production_center_id',
    targetKey: 'production_center_id'
});
db.bsp1ProductionCenter.belongsTo(db.nucleusSeedAvailabityModel, {
    foreignKey: 'production_center_id',
    targetKey: 'production_center_id'
})
//finish reletion between bsp1 and bsp1_production table

//start reletion between bsp1 and bsp2 table
db.bsp1Model.hasMany(db.bsp2Model, {
    foreignKey: 'bsp_1_id',
    targetKey: 'bsp_1_id'
});
db.bsp1Model.belongsTo(db.bsp2Model, {
    foreignKey: 'bsp_1_id',
})
//finish reletion between bsp1 and bsp2 table

//start reletion between bsp1 and bsp2 table
db.designationModel.hasMany(db.agencyDetailModel, {
    foreignKey: 'contact_person_designation_id',
    targetKey: 'contact_person_designation_id'
});
db.agencyDetailModel.belongsTo(db.designationModel, {
    foreignKey: 'contact_person_designation_id',
})
//finish reletion between bsp1 and bsp2 table

//plant and state relation start
db.plantDetails.belongsTo(db.stateModel, {
    foreignKey: 'state_id',
    targetKey: 'state_code',
});
db.stateModel.hasMany(db.plantDetails, {
    foreignKey: 'state_id',
    targetKey: 'state_code',
});
//============================
//plant and state relation start
db.plantDetails.belongsTo(db.designationModel, {
    foreignKey: 'contact_person_designation_id'
});
db.designationModel.hasMany(db.plantDetails, {
    foreignKey: 'contact_person_designation_id'
});
//============================
//indent of breederseeds and variery start
db.indentOfBreederseedModel.belongsTo(db.varietyModel, {
    foreignKey: 'variety_id',
    // targetKey:'variety_id' 
});
db.varietyModel.hasMany(db.indentOfBreederseedModel, {
    foreignKey: 'variety_id',
    targetKey: 'variety_id'
    // targetKey:'id'
});
//============================

//indent of SPA and variety==========
db.indentOfSpa.belongsTo(db.varietyModel, {
    foreignKey: 'variety_id',
    // targetKey:'variety_id' 
});
db.varietyModel.hasMany(db.indentOfSpa, {
    foreignKey: 'variety_id',
    targetKey: 'variety_id'
    // targetKey:'id'
});
//============================
//indent of SPA and cropmodel
db.indentOfSpa.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'
});
db.cropModel.hasMany(db.indentOfSpa, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'
    // targetKey:'id'
});
//============================
//indent of SPA and state
db.indentOfSpa.belongsTo(db.stateModel, {
    foreignKey: 'state_code',
    targetKey: 'state_code'
});
db.stateModel.hasMany(db.indentOfSpa, {
    foreignKey: 'state_code',
    targetKey: 'state_code'
    // targetKey:'id'
});
//============================

//indent of SPA and seasn

db.indentOfSpa.belongsTo(db.seasonModel, {
    foreignKey: 'season',
    targetKey: 'season_code'
});
db.seasonModel.hasMany(db.indentOfSpa, {
    foreignKey: 'season',
    targetKey: 'season'

});
//============================

//state and district reletion

db.plantDetails.belongsTo(db.districtModel, {
    foreignKey: 'district_id',
    targetKey: 'district_code',
});
db.districtModel.hasMany(db.plantDetails, {
    foreignKey: 'district_id',
    targetKey: 'district_code',

});
//===========================

//activities and freez timeline reletion

db.freezeTimeline.belongsTo(db.activitiesModel, {
    foreignKey: 'activitie_id',
    targetKey: 'id',
});
db.activitiesModel.hasMany(db.freezeTimeline, {
    foreignKey: 'activitie_id',
    targetKey: 'activitie_id',

});
//===========================

//start reletion between bsp1ProductionCenter and users table
db.userModel.hasMany(db.bsp1ProductionCenter, {
    foreignKey: 'production_center_id',
    targetKey: 'production_center_id'
});
db.bsp1ProductionCenter.belongsTo(db.userModel, {
    foreignKey: 'production_center_id',
})
//finish reletion between bsp1ProductionCenter and users table

//start reletion between bsp1ProductionCenter and users table
db.indentOfBreederseedModel.hasMany(db.bsp1Model, {
    foreignKey: 'indent_of_breederseed_id',
    targetKey: 'indent_of_breederseed_id'
});
db.bsp1Model.belongsTo(db.indentOfBreederseedModel, {
    foreignKey: 'indent_of_breederseed_id',
    // targetKey: 'indent_of_breederseed_id'

})
//finish reletion between bsp1 and m_crop table

//start reletion between bsp1ProductionCenter and users table
db.cropModel.hasMany(db.bsp1Model, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'
});
db.bsp1Model.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'

})
db.seasonModel.hasMany(db.bsp1Model, {
    foreignKey: 'season_code',
    targetKey: 'season_code'
});
db.bsp1Model.belongsTo(db.seasonModel, {
    foreignKey: 'season',
    targetKey: 'season_code'

})
//finish reletion between bsp1 and m_crop table

//start reletion between bsp1ProductionCenter and users table
db.userModel.hasMany(db.cropModel, {
    foreignKey: 'breeder_id',
    targetKey: 'breeder_id'
});
db.cropModel.belongsTo(db.userModel, {
    foreignKey: 'breeder_id',
    // targetKey: 'indent_of_breederseed_id'

})
//finish reletion between bsp1 and m_crop table

//start reletion between season and bsp2 table
db.seasonModel.hasMany(db.bsp2Model, {
    foreignKey: 'season_code',
    targetKey: 'season_code'
});
db.bsp2Model.belongsTo(db.seasonModel, {
    foreignKey: 'season',
    targetKey: 'season_code'

})
//finish reletion between season and bsp2 table

//start reletion between m_crop and bsp2 table
db.cropModel.hasMany(db.bsp2Model, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'
});
db.bsp2Model.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'

})
//finish reletion between m_crop and bsp2 table

//------------------- bsp 3 start -------------------------
db.seasonModel.hasMany(db.bsp3Model, {
    foreignKey: 'season',
    targetKey: 'season_code'
});
db.bsp3Model.belongsTo(db.seasonModel, {
    foreignKey: 'season',
    targetKey: 'season_code'

})
db.userModel.hasMany(db.bsp3Model, {
    foreignKey: 'production_center_id',
    targetKey: 'production_center_id'
});
db.bsp3Model.belongsTo(db.userModel, {
    foreignKey: 'production_center_id',
    // targetKey: 'season_code'

})
//----------------------bsp3 finish -----------------------------

//start reletion between m_crop and bsp2 table
db.cropModel.hasMany(db.bsp3Model, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'
});
db.bsp3Model.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'

})
//finish reletion between m_crop and bsp2 table


//--------- --- bsp 5a start -----------------
db.seasonModel.hasMany(db.bsp5aModel, {
    foreignKey: 'season_code',
    targetKey: 'season_code'
});
db.bsp5aModel.belongsTo(db.seasonModel, {
    foreignKey: 'season',
    targetKey: 'season_code'

})

db.cropModel.hasMany(db.bsp5aModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'
});
db.bsp5aModel.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'

})
db.agencyDetailModel.belongsTo(db.blockModel, {
    foreignKey: 'block_id',
    targetKey: 'block_code'

})
//--------- --- bsp 5a finish -----------------


//--------- --- bsp 5b start -----------------
db.seasonModel.hasMany(db.bsp5bModel, {
    foreignKey: 'season_code',
    targetKey: 'season_code'
});
db.bsp5bModel.belongsTo(db.seasonModel, {
    foreignKey: 'season',
    targetKey: 'season_code'

})

db.cropModel.hasMany(db.bsp5bModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'
});
db.bsp5bModel.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'

})


db.bsp2Model.hasMany(db.bsp1Model, {
    foreignKey: 'bsp_1_id',
    targetKey: 'bsp_1_id'
});
db.bsp1Model.belongsTo(db.bsp2Model, {
    foreignKey: 'bsp_1_id',
    // targetKey: 'crop_code'
});

db.indentOfBreederseedModel.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'


})
db.agencyDetailModel.belongsTo(db.centralModel, {
    foreignKey: 'sector_id',
    targetKey: 'central_id'


})
db.indentOfSpa.belongsTo(db.userModel, {
    foreignKey: 'user_id',
    targetKey: 'id'
})
db.indentOfSpa.belongsTo(db.agencyDetailModel, {
    foreignKey: 'user_id',
    targetKey: 'user_id'
})
db.userModel.belongsTo(db.indentOfBreederseedModel, {
    foreignKey: 'id',
    targetKey: 'user_id'
})
db.indentOfBreederseedModel.belongsTo(db.allocationToIndentorProductionCenterSeed, {
    foreignKey: 'id',
    targetKey: 'indent_of_breeder_id'
})
db.indentOfBreederseedModel.belongsTo(db.allocationtoIndentorliftingseeds, {
    foreignKey: 'id',
    targetKey: 'user_id'
})

db.allocationtoIndentorliftingseeds.belongsTo(db.allocationToIndentorProductionCenterSeed, {
    foreignKey: 'id',
    targetKey: 'allocation_to_indentor_for_lifting_seed_id'
})
db.agencyDetailModel.belongsTo(db.allocationtoIndentorliftingseeds, {
    foreignKey: 'id',
    targetKey: 'user_id'
})

db.userModel.belongsTo(db.allocationToIndentorProductionCenterSeed, {
    foreignKey: 'agency_id',
    targetKey: 'indent_of_breeder_id'
})
db.agencyDetailModel.belongsTo(db.indentOfBreederseedModel, {
    foreignKey: 'user_id',
    targetKey: 'user_id',
});
db.stateModel.belongsTo(db.districtModel, {
    foreignKey: 'state_code',
    targetKey: 'state_code'
});
db.indentOfSpa.belongsTo(db.allocationToSPAProductionCenterSeed, {
    foreignKey: 'spa_code',
    targetKey: 'spa_code'
})

db.allocationToSPAProductionCenterSeed.belongsTo(db.agencyDetailModel, {
    foreignKey: 'production_center_id',
    targetKey: 'id'
});

db.labelNumberForBreederseed.belongsTo(db.generatedLabelNumberModel, {
    foreignKey: 'id',
    targetKey: 'label_number_for_breeder_seeds'
});
db.varietyModel.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'
});
db.generateBills.belongsTo(db.varietyModel, {
    foreignKey: 'variety_id',
    targetKey: 'id'
});
db.cropModel.belongsTo(db.cropGroupModel, {
    foreignKey: 'group_code',
    targetKey: 'group_code'
});
db.agencyDetailModel.belongsTo(db.indentOfSpa, {
    foreignKey: 'state_id',
    targetKey: 'state_code'
});
db.generateBills.belongsTo(db.indentOfBreederseedModel, {
    foreignKey: 'indent_of_breederseed_id',
    targetKey: 'id'
});
db.generateBills.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'
});
// start breederCrop and breederCropVeriety model reletion
// db.breederCropsVerietiesModel.hasMany(db.breederCropModel, {
//     foreignKey: 'id',
//     // targetKey: 'id'
// });
db.breederCropModel.belongsTo(db.breederCropsVerietiesModel, {
    foreignKey: 'id',
    targetKey: 'breeder_crop_id'
});
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
    targetKey: 'season_code'

});
db.breederCropModel.belongsTo(db.userModel, {
    foreignKey: 'production_center_id',
    targetKey: 'id'

});

// --------------------lot number relation with crop tabel------------//
db.lotNumberModel.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'

})

//--------------end crop and lot number relation -------------//
// --------------------lot number relation with varierty tabel------------//
db.lotNumberModel.belongsTo(db.varietyModel, {
    foreignKey: 'variety_id',
    targetKey: 'id'

})

//--------------end varierty and lot number relation -------------//
// --------------------lot number relation with seedTestingReport tabel------------//
db.lotNumberModel.belongsTo(db.seedTestingReportsModel, {
    foreignKey: 'id',
    targetKey: 'lot_number'

})

//--------------end seedTestingReport and lot number relation -------------//

// --------------------crop  relation with bsp4 tabel------------//
db.bsp4Model.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'

})

//--------------end crop  relation with bsp4 relation -------------//
// --------------------user  relation with bsp4 tabel------------//
db.bsp4Model.belongsTo(db.userModel, {
    foreignKey: 'production_center_id',
    targetKey: 'id'

})

//--------------end user  relation with bsp4 relation -------------//
db.bsp4Model.belongsTo(db.bsp4ToPlant, {
    foreignKey: 'id',
    targetKey: 'bsp4_id'
});
db.bsp4ToPlant.belongsTo(db.plantDetails, {
    foreignKey: 'plant_id',
    targetKey: 'id'
});
// db.indentOfSpa.belongsTo(db.allocationToSPAProductionCenterSeed,{
//     foreignKey: 'state_code',
//     targetKey: 'state_code'
// })
//--------------end user  relation -------------//
db.userModel.hasMany(db.bsp5aModel, {
    foreignKey: 'production_center_id',
})

db.bsp5aModel.belongsTo(db.userModel, {
    foreignKey: 'production_center_id',
    targetKey: 'id'
})

db.userModel.hasMany(db.bsp5bModel, {
    foreignKey: 'production_center_id',
})

db.bsp5bModel.belongsTo(db.userModel, {
    foreignKey: 'production_center_id',
    targetKey: 'id'
})
db.bsp5bModel.belongsTo(db.indentOfBreederseedModel, {
    foreignKey: 'indent_of_breederseed_id',
    targetKey: 'id'
})
db.seedInventory.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'
})
db.seedInventory.belongsTo(db.varietyModel, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code'
})
db.seedInventory.belongsTo(db.agencyDetailModel, {
    foreignKey: 'bspc_id',
    targetKey: 'user_id'
})
db.seedInventory.belongsTo(db.stageModel, {
    foreignKey: 'stage_id',
    targetKey: 'id'
})
//--------- --- bsp 5b  finish-----------------

//-------------- start new flow reletion --------------
db.assignCropNewFlow.belongsTo(db.varietyModel, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code',
});
db.varietyModel.hasMany(db.assignCropNewFlow, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code',
});

db.assignCropNewFlow.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code',
});
db.cropModel.hasMany(db.assignCropNewFlow, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code',
});

db.assignCropNewFlow.belongsTo(db.userModel, {
    foreignKey: 'user_id',
    targetKey: 'id',
});
db.userModel.hasMany(db.assignCropNewFlow, {
    foreignKey: 'user_id',
    targetKey: 'user_id',
});

db.assignCropNewFlow.belongsTo(db.assignBspcCropNewFlow, {
    foreignKey: 'id',
    targetKey: 'assign_crop_id',
});
db.assignBspcCropNewFlow.hasMany(db.assignCropNewFlow, {
    foreignKey: 'id',
    targetKey: 'id',
});

db.assignBspcCropNewFlow.belongsTo(db.userModel, {
    foreignKey: 'bspc_id',
    targetKey: 'id',
});
db.userModel.hasMany(db.assignBspcCropNewFlow, {
    foreignKey: 'bspc_id',
    targetKey: 'bspc_id',
});
db.assignCropNewFlow.belongsTo(db.seasonModel, {
    foreignKey: 'season',
    targetKey: 'season_code',
});
db.seasonModel.hasMany(db.assignCropNewFlow, {
    foreignKey: 'season',
    targetKey: 'season',
});
// db.monitoringTeamPdpc.belongsTo(db.monitoringTeamPdpcDetails, {
//     foreignKey: 'id',
//     targetKey: 'monitoring_team_of_pdpc_id',
// });

db.monitoringTeamPdpc.belongsTo(db.monitoringTeamPdpcDetails, {
    foreignKey: 'id',
    targetKey: 'monitoring_team_of_pdpc_id',
});

// TableA.hasMany(TableB, { foreignKey: 'columnA', sourceKey: 'columnB' });
db.monitoringTeamPdpcDetails.belongsTo(db.stateModel, {
    foreignKey: 'state_code',
    targetKey: 'state_code',

})
// db.stateModel.belongsTo(db.monitoringTeamPdpcDetails,{
//     foreignKey: 'state_code',
// })
// db.monitoringTeamPdpcDetails.hasOne(db.districtModel,{
//     foreignKey: 'district_code',
// })
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
db.seedInventory.belongsTo(db.seedClassModel, {
    foreignKey: 'seed_class_id',
    targetKey: 'id'
});
db.seedInventory.belongsTo(db.seasonModel, {
    foreignKey: 'season',
    targetKey: 'season_code'
});

//indent of SPA and state
db.indenterSPAModel.belongsTo(db.stateModel, {
    foreignKey: 'state_code',
    targetKey: 'state_code'
});

//indent of SPA and crop
db.indenterSPAModel.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'
});
//indent of SPA and indent of breederseed
db.indenterSPAModel.belongsTo(db.indentOfBreederseedModel, {
    foreignKey: 'indente_breederseed_id',
    targetKey: 'id'
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

})
db.seedInventory.belongsTo(db.seedInventoryTags, {
    foreignKey: 'id',
    targetKey: 'seed_inventry_id'
});
db.bspPerformaBspOne.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'

})
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
db.assignCropNewFlow.belongsTo(db.mVarietyLinesModel, {
    foreignKey: 'variety_line_code',
    targetKey: 'line_variety_code',
});
// db.mVarietyLinesModel.belongsTo(db.assignCropNewFlow, {
//     foreignKey: 'variety_line_code',
//     targetKey: 'variety_line_code',
// });

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
db.bspPerformaBspTwo.belongsTo(db.varietLineModel, {
    foreignKey: 'variety_line_code',
    targetKey: 'line_variety_code',
    // as: 'agencyDetails'
});
db.bspPerformaBspOne.belongsTo(db.bspProformaOneBspc, {
    foreignKey: 'id',
    targetKey: 'bspc_proforma_1_id',
    // as: 'agencyDetails'
});
db.varietyModel.hasMany(db.seedForProductionModel, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code',
});

db.seedForProductionModel.belongsTo(db.varietyModel, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code'
});
db.bspPerformaBspTwo.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'
});
db.monitoringTeamPdpcDetails.belongsTo(db.designationModel, {
    foreignKey: 'desination_id',
    targetKey: 'id'
});
db.monitoringTeamPdpcDetails.belongsTo(db.agencytypeModel, {
    foreignKey: 'agency_type_id',
    targetKey: 'id'
});
db.bspPerformaBspOne.belongsTo(db.varietLineModel, {
    foreignKey: 'variety_line_code',
    targetKey: 'line_variety_code',
});
db.indentOfSpa.belongsTo(db.indentOfSpaLinesModel, {
    foreignKey: 'id',
    targetKey: 'indent_of_spa_id',
});

db.agencyDetailModel.belongsTo(db.designationModelSecond, {
    foreignKey: 'contact_person_designation_id',
    targetKey: 'id',
});


// agency_type_id
// db.indentOfBrseedLines.belongsTo(db.mVarietyLines, {
//     foreignKey: 'variety_code_line',
//     targetKey: 'line_variety_code'
// });
db.bspPerformaBspOne.belongsTo(db.seedForProductionModel, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code',
    as: 'seed_for_production'
});
db.bspPerformaBspTwo.belongsTo(db.carryOverSeedModel, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code',
    as: 'bsp2CarryOver'
});

db.indentOfSpaLinesModel.belongsTo(db.varietLineModel, {
    foreignKey: 'variety_code_line',
    targetKey: 'line_variety_code',
})

// db.bspPerformaBspTwo.belongsTo(db.carryOverSeedModel, {
//     foreignKey: 'variety_code',
//     targetKey: 'variety_code',
//     as:'bsp2CarryOver'
// });

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
db.varietyPriceList.belongsTo(db.varietyPriceListPackagesModel, {
    foreignKey: 'id',
    targetKey: 'variety_priece_list_id',
})

db.mAgroEcologicalRegionsModel.belongsTo(db.mAgroLogicalRegionstatesModel, {
    foreignKey: 'id',
    targetKey: 'm_agro_logical_region_id',
})
db.mAgroLogicalRegionstatesModel.belongsTo(db.stateModel, {
    foreignKey: 'state_code',
    targetKey: 'state_code',
})
//-------------- finish new flow reletion -------------


//-----Crop Variety Relation Start-------
db.cropCharactersticsModel.hasMany(db.varietyModel, {
    foreignKey: 'variety_code',
    sourceKey: 'variety_code'
});

db.varietyModel.belongsTo(db.cropCharactersticsModel, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code'
});
// //-----Crop Variety Relation Ends-------

// //Category Mapping Start
// db.varietyModel.hasMany(db.varietyCategoryMappingModel, {
//     foreignKey: 'variety_code',
//     sourceKey: 'variety_code'
// });


db.cropCharactersticsModel.belongsTo(db.responsibleInsitutionModel, {
    foreignKey: 'responsible_insitution_for_breeder_seed',
    targetKey: 'id'
});

// db.varietyModel.hasMany(db.varietyCategoryMappingModel, {
//     foreignKey: 'variety_code',
//     targetKey: 'variety_code'
//     // sourceKey: 'variety_code',
//     // as: 'category',
// });
db.varietyModel.belongsTo(db.varietyCategoryMappingModel, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code',
    // sourceKey: 'variety_code',
    // as: 'category',
});
// db.varietyCategoryMappingModel.belongsTo(db.varietyModel, {
//     foreignKey: 'variety_code',
//     targetKey: 'variety_code'
// });

db.varietyCategoryMappingModel.belongsTo(db.varietyCategoryModel, {
    foreignKey: 'm_variety_category_id',
    targetKey: 'id',
  });

db.allocationtoIndentorliftingseeds.hasMany(db.allocationToIndentorProductionCenterSeed, {
    foreignKey: 'allocation_to_indentor_for_lifting_seed_id',
});

db.allocationToIndentorProductionCenterSeed.belongsTo(db.allocationtoIndentorliftingseeds, {
    targetKey: 'id',
    foreignKey: 'allocation_to_indentor_for_lifting_seed_id'
});
db.allocationToIndentorProductionCenterSeed.belongsTo(db.agencyDetailModel, {
  foreignKey: 'indent_of_breeder_id',
  targetKey: 'user_id',
//   as: 'agencyDetails'
});
db.seedProcessingRegister.belongsTo(db.agencyDetailModel, {
  foreignKey: 'user_id',
  targetKey: 'user_id',
//   as: 'agencyDetails'
});
db.srp_cropModel.belongsTo(db.cropModel, {
  foreignKey: 'crop_code',
  targetKey: 'crop_code',
//   as: 'agencyDetails'
});

module.exports = db;
