const sequelize = require("./db.js");
const Sequelize = require('sequelize');
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.cropModel = require("./crop.model")(sequelize, Sequelize);
db.userModel = require("./user.model")(sequelize, Sequelize);
db.varietyModel = require("./variety.model")(sequelize, Sequelize);
module.exports = (sql, Sequelize) => {

    const ZsrmRefFs = sql.define('zsrm_req_fs', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      year: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      season: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      crop_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      crop_code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      variety_code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      unit: {
        type: Sequelize.STRING,
        allowNull: false,
       },
      req: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      ssc: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      doa: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      sau: {
        type: Sequelize.DECIMAL,
      },
      nsc: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      shtorsur: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      total: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      pvt: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      others: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      remarks: {
        type: Sequelize.STRING,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      state_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      is_finalised: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },

      
      createdAt: { type: Sequelize.DATE, field: 'created_at', default: Date.now() },
      updatedAt: { type: Sequelize.DATE, field: 'updated_at', default: Date.now() },
      deletedAt: { type: Sequelize.DATE, field: 'deleted_at', default: null},
      finalisedAt: { type: Sequelize.DATE, field: 'finalised_at', default: null}
    },
    
      {
        freezeTableName: true
        // timezone: '+5:30'
      })

    // ZsrmRefFs.sync({ alter: true });
    return ZsrmRefFs;
  };
  