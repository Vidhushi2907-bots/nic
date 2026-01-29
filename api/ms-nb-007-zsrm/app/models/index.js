const sequelize = require("./db.js");
const Sequelize = require('sequelize');
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
 
db.cropModel = require("./crop.model")(sequelize, Sequelize);
db.varietyModel = require("./variety.model")(sequelize, Sequelize);
db.agencyDetailModel = require("./agency_detail.model")(sequelize, Sequelize);
db.userModel = require("./user.model")(sequelize, Sequelize);
db.cropGroupModel = require("./crop_group.model")(sequelize, Sequelize);
db.tokens = require("../models/token.model.js")(sequelize, Sequelize);
db.cropVerietyModel = require("./crop_veriety.model")(sequelize, Sequelize);
db.cropCharactersticsModel = require("./crop_characteristics.model")(sequelize, Sequelize);
db.stateModel = require("./state.model")(sequelize, Sequelize);
db.seasonModel = require('./season.model.js')(sequelize, Sequelize);
db.districtModel = require('./district.model.js')(sequelize, Sequelize);
db.varietLineModel = require('./variety_line.model.js')(sequelize, Sequelize);
db.zsrmReqFs = require('./zsrmreqfs.model.js')(sequelize, Sequelize);
db.zsrmReqQs = require('./zsrmreqqs.model.js')(sequelize, Sequelize);
db.zsrmReqQsDistWise = require('./zsrmreqqsdistwise.model.js')(sequelize, Sequelize);
db.srpModel = require('./srp.model.js')(sequelize,Sequelize);
db.srrModel = require('./srr.model.js')(sequelize,Sequelize);
db.ZsrmBsToFs = require('./zsrmbstofs.model.js')(sequelize,Sequelize);
db.ZsrmFsToCs = require('./zsrmfstocs.model.js')(sequelize,Sequelize);
db.ZsrmCSQsDist = require('./zsrmcsqsdist.model.js')(sequelize, Sequelize);
db.zsrmcsfsarea = require('./zsrmcsfsarea.model.js')(sequelize, Sequelize);

module.exports = db;

//============================

//m_crom of spa and cropGroup

db.cropModel.belongsTo(db.cropGroupModel, {
    foreignKey: 'group_code',
    targetKey: 'group_code'
});
db.cropGroupModel.hasMany(db.cropModel, {
    foreignKey: 'group_code',
    targetKey: 'group_code'
});

/*db.agencyDetailModel.hasMany(db.userModel, {
    foreignKey: 'id',
    targetKey: 'agency_id'
});*/
//============================


db.varietyModel.belongsTo(db.cropModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'
});
db.cropModel.hasMany(db.varietyModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'
});



// --------------- user model -----------------
db.agencyDetailModel.hasOne(db.userModel, {
    foreignKey: 'agency_id'
});
db.userModel.belongsTo(db.agencyDetailModel, {
    foreignKey: 'agency_id'
});
db.agencyDetailModel.belongsTo(db.districtModel, {
    foreignKey: 'district_id',
    targetKey: 'district_code',
});
db.districtModel.hasMany(db.agencyDetailModel, {
    foreignKey: 'district_id',
    targetKey: 'district_code',
});
db.agencyDetailModel.belongsTo(db.stateModel, {
    foreignKey: 'state_id',
    targetKey: 'state_code',
});
db.stateModel.hasMany(db.agencyDetailModel, {
    foreignKey: 'state_id',
    targetKey: 'state_code',
});


//zsrm

db.cropModel.hasMany(db.zsrmReqFs, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'

});

db.zsrmReqFs.belongsTo(db.cropModel, {
     foreignKey: 'crop_code',
    targetKey: 'crop_code'

});

db.userModel.hasMany(db.zsrmReqFs, {
    foreignKey: 'user_id',
    targetKey: 'id'
});

db.zsrmReqFs.belongsTo(db.userModel, {
    foreignKey: 'user_id',
    targetKey: 'id'
});

db.varietyModel.hasMany(db.zsrmReqFs, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code'
});

db.zsrmReqFs.belongsTo(db.varietyModel, {
    foreignKey: 'variety_code',
     targetKey: 'variety_code'
});

db.agencyDetailModel.hasOne(db.userModel, {
    foreignKey: 'user_id',
    targetKey: 'id'
});

db.stateModel.hasMany(db.zsrmReqFs, {
    foreignKey: 'state_id',
    targetKey: 'state_code'
});

db.zsrmReqFs.belongsTo(db.stateModel, {
    foreignKey: 'state_id',
    targetKey: 'state_code'
});


//---ZSRMQService--------------------------------

db.cropModel.hasMany(db.zsrmReqQs, {
       foreignKey: 'crop_code',
    targetKey: 'crop_code'

});

db.zsrmReqQs.belongsTo(db.cropModel, {
     foreignKey: 'crop_code',
    targetKey: 'crop_code'

});

db.userModel.hasMany(db.zsrmReqQs, {
    foreignKey: 'user_id',
    targetKey: 'id'
});

db.zsrmReqQs.belongsTo(db.userModel, {
    foreignKey: 'user_id',
    targetKey: 'id'
});

db.varietyModel.hasMany(db.zsrmReqQs, {
   foreignKey: 'variety_code',
     targetKey: 'variety_code'
});

db.zsrmReqQs.belongsTo(db.varietyModel, {
foreignKey: 'variety_code',
     targetKey: 'variety_code'
});

db.stateModel.hasMany(db.zsrmReqQs, {
    foreignKey: 'state_id',
    targetKey: 'state_code'
});

db.zsrmReqQs.belongsTo(db.stateModel, {
    foreignKey: 'state_id',
    targetKey: 'state_code'
});

// //---ZSRMQServiceDistWise--------------------------------
// db.zsrmReqQs.hasMany(db.zsrmReqQsDistWise, {

//     foreignKey: 'zsrmreqqs_id',
//     targetKey: 'id'
// });

// db.zsrmReqQsDistWise.belongsTo(db.zsrmReqQs, {
//     foreignKey: 'zsrmreqqs_id',
//     targetKey: 'id'
// });

// db.districtModel.hasMany(db.zsrmReqQsDistWise, {
//     foreignKey: 'district_id',
//     targetKey: 'district_code'
// });

// db.zsrmReqQsDistWise.belongsTo(db.districtModel, {
//     foreignKey: 'district_id',
//     targetKey: 'district_code'
// });

// db.userModel.hasMany(db.zsrmReqQsDistWise, {
//     foreignKey: 'user_id',
//     targetKey: 'id'
// });

// db.zsrmReqQsDistWise.belongsTo(db.userModel, {
//     foreignKey: 'user_id',
//     targetKey: 'id'
// });



db.cropCharactersticsModel.hasOne(db.varietyModel, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code'

});
db.varietyModel.belongsTo(db.cropCharactersticsModel, {
     foreignKey: 'variety_code',
     targetKey: 'variety_code'
});

//srp
db.cropModel.hasMany(db.srpModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'

});

db.srpModel.belongsTo(db.cropModel, {
     foreignKey: 'crop_code',
    targetKey: 'crop_code'

});

db.userModel.hasMany(db.srpModel, {
    foreignKey: 'user_id',
    targetKey: 'id'
});

db.srpModel.belongsTo(db.userModel, {
    foreignKey: 'user_id',
    targetKey: 'id'
});

db.varietyModel.hasMany(db.srpModel, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code'
});

db.srpModel.belongsTo(db.varietyModel, {
    foreignKey: 'variety_code',
     targetKey: 'variety_code'
});

db.cropCharactersticsModel.hasMany(db.srpModel, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code'
});

db.srpModel.belongsTo(db.cropCharactersticsModel, {
    foreignKey: 'variety_code',
     targetKey: 'variety_code'
});

db.stateModel.hasMany(db.srpModel, {
    foreignKey: 'state_id',
    targetKey: 'state_code'
});

db.srpModel.belongsTo(db.stateModel, {
    foreignKey: 'state_id',
    targetKey: 'state_code'
});

//srr

//srr
db.cropModel.hasMany(db.srrModel, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'

});

db.srrModel.belongsTo(db.cropModel, {
     foreignKey: 'crop_code',
    targetKey: 'crop_code'

});

db.cropGroupModel.hasMany(db.srrModel, {
    foreignKey: 'crop_group_code',
    targetKey: 'group_code'

});

db.srrModel.belongsTo(db.cropGroupModel, {
     foreignKey: 'crop_group_code',
    targetKey: 'group_code'

});

db.userModel.hasMany(db.srrModel, {
    foreignKey: 'user_id',
    targetKey: 'id'
});

db.srrModel.belongsTo(db.userModel, {
    foreignKey: 'user_id',
    targetKey: 'id'
});


db.stateModel.hasMany(db.srrModel, {
    foreignKey: 'state_id',
    targetKey: 'state_code'
});

db.srrModel.belongsTo(db.stateModel, {
    foreignKey: 'state_id',
    targetKey: 'state_code'
});


db.srrModel.hasOne(db.srrModel, {
    foreignKey: 'prevYearId',  
    targetKey: 'id',
    as: 'nextYearData'
  });
  
db.srrModel.belongsTo(db.srrModel, {
    foreignKey: 'prevYearId',  
    targetKey: 'id',
    as: 'previousYearData'
  });
  
//zsrmbstofs
db.cropModel.hasMany(db.ZsrmBsToFs, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'

});

db.ZsrmBsToFs.belongsTo(db.cropModel, {
     foreignKey: 'crop_code',
    targetKey: 'crop_code'

});

db.varietyModel.hasMany(db.ZsrmBsToFs, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code'
});

db.cropGroupModel.hasMany(db.ZsrmBsToFs, {
    foreignKey: 'crop_group_code',
    targetKey: 'group_code'

});

db.ZsrmBsToFs.belongsTo(db.cropGroupModel, {
     foreignKey: 'crop_group_code',
    targetKey: 'group_code'

});

db.ZsrmBsToFs.belongsTo(db.varietyModel, {
    foreignKey: 'variety_code',
     targetKey: 'variety_code'
});


db.userModel.hasMany(db.ZsrmBsToFs, {
    foreignKey: 'user_id',
    targetKey: 'id'
});

db.ZsrmBsToFs.belongsTo(db.userModel, {
    foreignKey: 'user_id',
    targetKey: 'id'
});


db.stateModel.hasMany(db.ZsrmBsToFs, {
    foreignKey: 'state_id',
    targetKey: 'state_code'
});

db.ZsrmBsToFs.belongsTo(db.stateModel, {
    foreignKey: 'state_id',
    targetKey: 'state_code'
});

//zsrmfstocs
db.cropModel.hasMany(db.ZsrmFsToCs, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'

});

db.ZsrmFsToCs.belongsTo(db.cropModel, {
     foreignKey: 'crop_code',
    targetKey: 'crop_code'

});

db.varietyModel.hasMany(db.ZsrmFsToCs, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code'
});

db.ZsrmFsToCs.belongsTo(db.varietyModel, {
    foreignKey: 'variety_code',
     targetKey: 'variety_code'
});

db.cropGroupModel.hasMany(db.ZsrmFsToCs, {
    foreignKey: 'crop_group_code',
    targetKey: 'group_code'

});

db.ZsrmFsToCs.belongsTo(db.cropGroupModel, {
     foreignKey: 'crop_group_code',
    targetKey: 'group_code'

});




db.userModel.hasMany(db.ZsrmFsToCs, {
    foreignKey: 'user_id',
    targetKey: 'id'
});

db.ZsrmFsToCs.belongsTo(db.userModel, {
    foreignKey: 'user_id',
    targetKey: 'id'
});


db.stateModel.hasMany(db.ZsrmFsToCs, {
    foreignKey: 'state_id',
    targetKey: 'state_code'
});

db.ZsrmFsToCs.belongsTo(db.stateModel, {
    foreignKey: 'state_id',
    targetKey: 'state_code'
});


//zsrmcsqsdist
db.cropModel.hasMany(db.ZsrmCSQsDist, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'

});

db.ZsrmCSQsDist.belongsTo(db.cropModel, {
     foreignKey: 'crop_code',
    targetKey: 'crop_code'

});

db.varietyModel.hasMany(db.ZsrmCSQsDist, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code'
});

db.ZsrmCSQsDist.belongsTo(db.varietyModel, {
    foreignKey: 'variety_code',
     targetKey: 'variety_code'
});





db.userModel.hasMany(db.ZsrmCSQsDist, {
    foreignKey: 'user_id',
    targetKey: 'id'
});

db.ZsrmCSQsDist.belongsTo(db.userModel, {
    foreignKey: 'user_id',
    targetKey: 'id'
});

db.zsrmReqQs.hasMany(db.ZsrmCSQsDist, {
    foreignKey: 'zsrmreqqs_id',
    targetKey: 'id'
});

db.ZsrmCSQsDist.belongsTo(db.zsrmReqQs, {
    foreignKey: 'zsrmreqqs_id',
    targetKey: 'id'
});



db.stateModel.hasMany(db.ZsrmCSQsDist, {
    foreignKey: 'state_id',
    targetKey: 'state_code'
});

db.ZsrmCSQsDist.belongsTo(db.stateModel, {
    foreignKey: 'state_id',
    targetKey: 'state_code'
});

//zsrmcsfsarea
db.cropModel.hasMany(db.zsrmcsfsarea, {
    foreignKey: 'crop_code',
    targetKey: 'crop_code'

});

db.zsrmcsfsarea.belongsTo(db.cropModel, {
     foreignKey: 'crop_code',
    targetKey: 'crop_code'

});

db.varietyModel.hasMany(db.zsrmcsfsarea, {
    foreignKey: 'variety_code',
    targetKey: 'variety_code'
});

db.zsrmcsfsarea.belongsTo(db.varietyModel, {
    foreignKey: 'variety_code',
     targetKey: 'variety_code'
});

db.cropGroupModel.hasMany(db.zsrmcsfsarea, {
    foreignKey: 'crop_group_code',
    targetKey: 'group_code'

});

db.zsrmcsfsarea.belongsTo(db.cropGroupModel, {
     foreignKey: 'crop_group_code',
    targetKey: 'group_code'

});

db.userModel.hasMany(db.zsrmcsfsarea, {
    foreignKey: 'user_id',
    targetKey: 'id'
});

db.zsrmcsfsarea.belongsTo(db.userModel, {
    foreignKey: 'user_id',
    targetKey: 'id'
});


db.stateModel.hasMany(db.zsrmcsfsarea, {
    foreignKey: 'state_id',
    targetKey: 'state_code'
});

db.zsrmcsfsarea.belongsTo(db.stateModel, {
    foreignKey: 'state_id',
    targetKey: 'state_code'
});