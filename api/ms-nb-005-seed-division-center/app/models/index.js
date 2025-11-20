const sequelize = require("./db.js");
const Sequelize = require('sequelize');
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.stateModel = require("./state.model")(sequelize, Sequelize);
db.districtModel = require("./district.model")(sequelize, Sequelize);
db.userModel = require("./user.model")(sequelize, Sequelize);
db.cropModel = require("./crop.model")(sequelize, Sequelize);
db.cropGroupModel = require("./crop_group.model")(sequelize, Sequelize);
// db.cropGroupModel = require("./crop.group.model")(sequelize, Sequelize);
db.addcropModel = require("./add.crop.model")(sequelize, Sequelize);
// db.cropNameModel = require("./crop.name.model")(sequelize, Sequelize);
db.cropCharactersticsModel = require("./crop_characteristics.model")(sequelize, Sequelize);
db.cropVerietyModel = require("./crop_veriety.model")(sequelize, Sequelize);
db.seedCropGroupModel = require("./croup.group.model.js")(sequelize, Sequelize);
db.seasonModel = require("./season.model.js")(sequelize, Sequelize);
db.agencyDetailModel = require("./agency_detail.model")(sequelize, Sequelize);
db.designationModel = require("./designation.model")(sequelize, Sequelize);
db.userModel = require("./user.model")(sequelize, Sequelize);
db.maxLotSizeModel = require("./m_max_lot_size.model")(sequelize, Sequelize);
db.seedMultiplicationRatioModel = require("./seed_multiplication_ratio.model")(sequelize, Sequelize);
db.seedLabTestModel = require("./m_seed_lab_test.model")(sequelize, Sequelize);
db.bankDetailsModel = require('./bank_details.model')(sequelize, Sequelize);
db.seasonValueModel = require('./season_value.model')(sequelize, Sequelize);
db.characterStateModel = require('./characterstics_state.model')(sequelize, Sequelize);
db.districtLatLongModel = require('./district_lat_long.model')(sequelize, Sequelize);
db.indentOfBreederseedModel = require('./indent_of_breederseed.model')(sequelize, Sequelize);
db.responsibleInsitutionModel = require('./responsible_insitution.model')(sequelize, Sequelize);
db.varietyModel = require('./variety.model')(sequelize, Sequelize);
db.auditTail = require('./audit_trail.model.js')(sequelize, Sequelize);
db.bsp1Model = require("./bsp1.model")(sequelize, Sequelize);
db.bsp5bModel = require("./bsp5b.model")(sequelize, Sequelize);
db.tokens = require("../models/token.model.js")(sequelize, Sequelize);
db.allocationToIndentor = require("../models/allocation_to_indentor.model.js")(sequelize, Sequelize);
db.mCategoryOrgnization = require("../models/m_category_orgnization.model.js")(sequelize, Sequelize);
db.plantDetail = require("../models/plant_details.model.js")(sequelize, Sequelize);
db.otherFertilizerModel = require("../models/other_fertilizer.model.js")(sequelize, Sequelize);
db.otherFertilizerMapping = require("../models/other_fertilizer_mapping.model.js")(sequelize, Sequelize);
db.lotNumberModel = require("./lot_number.model")(sequelize, Sequelize);
db.seedTestingReportsModel = require("./seed_testing_reports.model")(sequelize, Sequelize);
db.allocationToIndentorSeed = require("./allocation_to_indentor_for_lifting_seeds.model")(sequelize, Sequelize);
db.allocationToIndentorProductionCenterSeed = require("./allocation_to_indentor_for_lifting_seed_production_cnter.model")(sequelize, Sequelize);
db.activitiesModel = require('./activities.model.js')(sequelize, Sequelize);
db.generateBills = require("./generate_bill.model")(sequelize, Sequelize);
db.bsp1ProductionCenterModel = require("./bsp1_production_center.model")(sequelize, Sequelize)
db.breederCropModel = require("./breeder_crop.model")(sequelize, Sequelize);
db.varietyCategoryModel = require("./variety_category.model.js")(sequelize, Sequelize);
db.varietyLineModel = require("./variety_lines.model.js")(sequelize, Sequelize);
db.varietyCategoryMappingModel = require("./variety_category_mapping.model.js")(sequelize, Sequelize);

db.mMajorDiseasesMapModel = require("./m_major_diseases_map.model.js")(sequelize, Sequelize);
db.mMajorInsectPestsMapModel = require("./m_major_insect_pests_map.model.js")(sequelize, Sequelize);

db.mCharactersticAgroRegionMappingModel = require("./m_characterstic_agro_region_mapping.model.js")(sequelize, Sequelize);
db.mMajorClimateResiliencemapsModel = require("./m_major_climate_resilience_maps.model.js")(sequelize, Sequelize);
db.mInstitutesModel = require("./m_institutes.model.js")(sequelize, Sequelize);

db.seedProcessingRegister = require('./seed_processing_register.js')(sequelize, Sequelize);
db.liftingLotNumberModel = require('./lifting_lot_number.model.js')(sequelize, Sequelize);
db.allocationtoIndentorliftingseeds = require('./allocation_to_indentor_for_lifting_seeds.model.js')(sequelize, Sequelize);
db.bspPerformaBspTwo = require('./bsp_proforma_2.model.js')(sequelize, Sequelize);
db.bspPerformaBspThree = require('./bsp_proforma_3.model.js')(sequelize, Sequelize);
db.bspProformaOneBspc = require('./bsp_proforma_one_bspc.model')(sequelize, Sequelize);
db.bspPerformaBspOne = require('./bsp_proforma_1.model.js')(sequelize, Sequelize);
db.availabilityOfBreederSeedModel = require("./availability_of_breeder_seed.model.js")(sequelize, Sequelize);
db.bspProformaOneBspcModel = require('./bsp_proforma_1_bspcs.model.js')(sequelize, Sequelize);
db.liftingSeedDetailsModel = require('./lifting_seed_details.model.js')(sequelize, Sequelize);
db.bspProformaOneModel = require('./bsp_proforma_1s.model.js')(sequelize, Sequelize);
db.seedProcessingRegisterModel = require('./seed_processing_register.js')(sequelize, Sequelize);
db.mAgroLogicalRegionstatesModel = require('./m_agro_logical_region_states.model.js')(sequelize, Sequelize);
db.mAgroEcologicalRegionsModel = require("./m_agro_ecological_regions.model.js")(sequelize, Sequelize);


db.allocationToSPAProductionCenterSeed = require("./allocation_to_spa_for_lifting_seed_production_cnter.model")(sequelize, Sequelize);
db.allocationToSPASeed = require("./allocation_to_spa_for_lifting_seeds.model")(sequelize, Sequelize);


//reletion start here
db.agencyDetailModel.hasOne(db.userModel, {
    foreignKey: 'agency_id'
});


db.userModel.belongsTo(db.agencyDetailModel, {
    foreignKey: 'agency_id'
});
db.agencyDetailModel.belongsTo(db.designationModel, {
    foreignKey: 'contact_person_designation_id'
});
db.designationModel.hasMany(db.agencyDetailModel, {
    foreignKey: 'contact_person_designation_id'
});
// 
db.cropCharactersticsModel.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'
});
// db.cropModel.belongsTo(db.cropCharactersticsModel, {
//     foreignKey: 'crop_code',
//     targetKey: 'crop_code'
// });
// 
db.cropCharactersticsModel.belongsTo(db.cropVerietyModel, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code'
});

//seedLabTestModel <=>stateModel==========
db.seedLabTestModel.belongsTo(db.stateModel, {
    foreignKey: 'state_id',
    targetKey: 'state_code',
});
db.stateModel.hasMany(db.seedLabTestModel, {
    foreignKey: 'state_id',
    targetKey: 'state_code',
});

//seedLabTestModel <=>stateModel=============
db.seedLabTestModel.belongsTo(db.districtModel, {
    foreignKey: 'district_id',
    targetKey: 'district_code',
});
db.stateModel.hasMany(db.seedLabTestModel, {
    foreignKey: 'district_id',
    targetKey: 'district_code',
});
db.agencyDetailModel.belongsTo(db.stateModel, {
    foreignKey: 'state_id',
    targetKey: 'state_code',
});
db.agencyDetailModel.belongsTo(db.districtModel, {
    foreignKey: 'district_id',
    targetKey: 'district_code'
});

db.cropVerietyModel.belongsTo(db.cropGroupModel, {
    foreignKey: 'crop_group_code',
    targetKey: 'group_code'
});

db.cropVerietyModel.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'
});
db.cropModel.belongsTo(db.cropGroupModel, {
    foreignKey: 'group_code',
    targetKey: 'group_code'
});
db.cropGroupModel.belongsTo(db.cropModel, {
    foreignKey: 'group_code',
    targetKey: 'group_code'
});

db.indentOfBreederseedModel.belongsTo(db.userModel, {
    foreignKey: 'user_id',
    targetKey: 'id'

});
db.indentOfBreederseedModel.belongsTo(db.varietyModel, {
    foreignKey: 'variety_id',
    // targetKey: 'id'

});
db.indentOfBreederseedModel.belongsTo(db.cropVerietyModel, {
    foreignKey: 'variety_id',
    targetKey: 'id'
});
db.cropVerietyModel.belongsTo(db.indentOfBreederseedModel, {
    foreignKey: 'id',
    targetKey: 'variety_id'
});
// db.indentOfBreederseedModel.belongsTo(db.bsp5bModel, {
//     foreignKey: 'id',
//     targetKey: 'indent_of_breederseed_id'
// });
// db.indentOfBreederseedModel.belongsTo(db.bsp1Model, {
//     foreignKey: 'id',
//     targetKey: 'indent_of_breederseed_id'
// });
db.cropModel.hasMany(db.cropVerietyModel, {
    foreignKey: 'crop_code',
});
db.cropModel.belongsTo(db.cropVerietyModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'
});
// db.cropVerietyModel.belongsTo(db.cropGroupModel, {
//     foreignKey: 'crop_code',
//     // targetKey: 'crop_code',
// });

// db.cropVerietyModel.belongsTo(db.cropGroupModel, {
//     foreignKey: 'crop_code',
//     targetKey: 'crop_code'
// });
// db.cropGroupModel.belongsTo(db.cropVerietyModel, {
//     foreignKey: 'group_code',
//     targetKey: 'group_code'
// });


db.seedMultiplicationRatioModel.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'
})

db.indentOfBreederseedModel.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'
})
db.maxLotSizeModel.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'
})
db.cropModel.belongsTo(db.cropGroupModel, {
    foreignKey: 'group_code',
    targetKey: 'group_code'
})
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

db.indentOfBreederseedModel.belongsTo(db.bsp1Model, {
    foreignKey: 'id',
    targetKey: 'indent_of_breederseed_id'
});

//start reletion between m_categories and agency details
db.mCategoryOrgnization.hasMany(db.agencyDetailModel, {
    foreignKey: 'category',
    targetKey: 'category'
    // targetKey: 'category'
});
db.agencyDetailModel.belongsTo(db.mCategoryOrgnization, {
    foreignKey: 'category',
    // targetKey: 'category'
});
//finish reletion between m_categories and agency details

//start reletion between m_crop and indenting_crop details
db.cropModel.hasMany(db.indentOfBreederseedModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'
    // targetKey: 'category'
});
db.indentOfBreederseedModel.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'
});

db.plantDetail.belongsTo(db.stateModel, {
    foreignKey: 'state_id',
    targetKey: 'state_code',
});
db.plantDetail.belongsTo(db.districtModel, {
    foreignKey: 'district_id',
    targetKey: 'district_code',
});
db.plantDetail.belongsTo(db.designationModel, {
    foreignKey: 'contact_person_designation_id',
    targetKey: 'id',
});
db.cropCharactersticsModel.belongsTo(db.otherFertilizerModel, {
    foreignKey: 'id',
    targetKey: 'characterstics_id',
});
db.seedLabTestModel.belongsTo(db.designationModel, {
    foreignKey: 'designation_id',
    targetKey: 'id',
});
// db.seedLabTestModel.belongsTo(db.designationModel, {
//     foreignKey: 'contact_person_designation_id',
//     targetKey: 'id',
// });
//finish reletion between m_categories and agency details

// ------------------- crop variety characterstic and variety reletion
db.cropCharactersticsModel.hasMany(db.cropVerietyModel, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code'

});
db.cropVerietyModel.belongsTo(db.cropCharactersticsModel, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code'
});

db.lotNumberModel.belongsTo(db.seedTestingReportsModel, {
    foreignKey: 'id',
    targetKey: 'lot_number'
});

// ------------- reletion beetween allocation_to_indentor_for_lifting_seed/-allocationToIndentorProductionCenterSeed-----------------------
db.allocationToIndentorSeed.hasMany(db.allocationToIndentorProductionCenterSeed, {
    foreignKey: 'allocation_to_indentor_for_lifting_seed_id',
});

db.allocationToIndentorProductionCenterSeed.belongsTo(db.allocationToIndentorSeed, {
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

db.bsp1Model.hasMany(db.bsp1ProductionCenterModel, {
    foreignKey: {
        allowNull: false,
        name: 'bsp_1_id'
    },
});

db.bsp1ProductionCenterModel.belongsTo(db.bsp1Model, {
    foreignKey: 'bsp_1_id'
});

db.bsp1Model.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'
});
db.bsp1Model.belongsTo(db.varietyModel, {
    foreignKey: 'variety_id'
});
db.indentOfBreederseedModel.belongsTo(db.bsp1Model, {
    foreignKey: 'id',
    targetKey: 'indent_of_breederseed_id'
});
db.bsp1Model.belongsTo(db.indentOfBreederseedModel, {
    foreignKey: 'indent_of_breederseed_id'
});
db.bsp5bModel.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey:'crop_code'
});
db.allocationToIndentorSeed.belongsTo(db.allocationToIndentorProductionCenterSeed, {
    foreignKey: 'id',
    targetKey:'allocation_to_indentor_for_lifting_seed_id'
});
db.allocationToIndentorSeed.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey:'crop_code'
});
db.indentOfBreederseedModel.belongsTo(db.allocationToIndentorProductionCenterSeed, {
    foreignKey: 'user_id',
    targetKey:'indent_of_breeder_id'
});
db.lotNumberModel.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey:'crop_code'
});
db.bsp5bModel.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey:'crop_code'
});

db.breederCropModel.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey:'crop_code'
});
db.maxLotSizeModel.belongsTo(db.cropGroupModel, {
    foreignKey: 'group_code',
    targetKey:'group_code'
});

db.cropVerietyModel.hasMany(db.varietyLineModel, {
    foreignKey: 'variety_code',
    sourceKey: 'variety_code',
  });

  db.cropVerietyModel.hasMany(db.varietyCategoryMappingModel, {
    foreignKey: 'variety_code',
    sourceKey: 'variety_code',
    as: 'category',
  });
  
  db.varietyCategoryMappingModel.belongsTo(db.varietyCategoryModel, {
    foreignKey: 'm_variety_category_id',
    targetKey: 'id',
  });
  db.cropCharactersticsModel.belongsTo(db.mCharactersticAgroRegionMappingModel, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code',
    //  as: 'regions'
  });
  db.bspProformaOneModel.belongsTo(db.bspProformaOneBspcModel, {
    foreignKey: 'id',
    targetKey: 'bspc_proforma_1_id'
});


  db.availabilityOfBreederSeedModel.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey:'crop_code'
});


db.bspPerformaBspOne.belongsTo(db.bspProformaOneBspc, {
    foreignKey: 'id',
    targetKey: 'bspc_proforma_1_id',
    as: 'bspc_mapping' // <-- define the alias explicitly
  });

  db.bspPerformaBspOne.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'

})
  db.bspPerformaBspTwo.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'
})
db.allocationToIndentorSeed.belongsTo(db.varietyModel, {
    foreignKey: 'variety_id'
});

db.cropModel.hasMany(db.varietyModel, {
  foreignKey: 'crop_code',
  sourceKey: 'crop_code',
});

db.cropGroupModel.hasMany(db.cropModel, {
  foreignKey: 'group_code',
  sourceKey: 'group_code',
  as: 'crops',
});

db.varietyModel.belongsTo(db.cropGroupModel, {
    foreignKey: 'crop_group_code',
    targetKey: 'group_code'
});
db.varietyModel.belongsTo(db.cropCharactersticsModel, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code'
});
db.varietyModel.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'
});
db.cropCharactersticsModel.belongsTo(db.stateModel, {
    foreignKey: 'state_id',
    targetKey: 'state_code'
});
db.cropCharactersticsModel.belongsTo(db.mAgroLogicalRegionstatesModel, {
    foreignKey: 'state_id',
    targetKey: 'state_code'
});  
db.mAgroLogicalRegionstatesModel.belongsTo(db.mAgroEcologicalRegionsModel, {
    foreignKey: 'm_agro_logical_region_id',
    targetKey: 'id'
});
db.userModel.hasMany(db.cropModel, {
    foreignKey: 'breeder_id',
    targetKey: 'id',
});

module.exports = db;
