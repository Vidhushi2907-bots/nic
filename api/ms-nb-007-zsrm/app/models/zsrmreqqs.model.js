const sequelize = require("./db.js");
const Sequelize = require('sequelize');
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
module.exports = (sql, Sequelize) => {

    const ZsrmRefQs = sql.define('zsrm_req_qs', {
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
      sscCs: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      sscQs: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      doaCs: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      doaQs: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      sauCs: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      sauQs: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      nscCs: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      nscQs: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      seedhubsCs: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      seedhubsQs: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      pvtCs: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      pvtQs: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      othersCs: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      othersQs: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      shtorsur: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      csavl: {
          type: Sequelize.DECIMAL,
          allowNull: false,
        },
        qsavl: {
          type: Sequelize.DECIMAL,
          allowNull: false,
        },
        totalavl: {
          type: Sequelize.DECIMAL,
          allowNull: false,
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

      isFinalSubmitted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      is_finalised: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      
      createdAt: { type: Sequelize.DATE, field: 'created_at', default: Date.now() },
      updatedAt: { type: Sequelize.DATE, field: 'updated_at', default: Date.now() },
      deletedAt: { type: Sequelize.DATE, field: 'deleted_at', default: null },
      finalisedAt: { type: Sequelize.DATE, field: 'finalised_at', default: null}
    },
    
      {
        freezeTableName: true
        // timezone: '+5:30'
      })

      // ZsrmRefQs.sync({ alter: true });
    return ZsrmRefQs;
  };
  