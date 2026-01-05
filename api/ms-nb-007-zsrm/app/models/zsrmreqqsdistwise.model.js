const sequelize = require("./db.js");
const Sequelize = require('sequelize');
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
module.exports = (sql, Sequelize) => {

    const ZsrmRefQsDist = sql.define('zsrm_req_qs_dist', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
        },
        // req: {
        //   type: Sequelize.DECIMAL,
        //   allowNull: false,
        // },
        // shtorsur: {
        //   type: Sequelize.DECIMAL,
        //   allowNull: false,
        // },
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
        district_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        },
        user_id : {
          type: Sequelize.INTEGER,
         allowNull: false,
        },
        zsrmreqqs_id: {
          type: Sequelize.INTEGER,
         allowNull: false,
        },
      createdAt: { type: Sequelize.DATE, field: 'created_at', default: Date.now() },
      updatedAt: { type: Sequelize.DATE, field: 'updated_at', default: Date.now() },
      deletedAt: { type: Sequelize.DATE, field: 'deleted_at', default: null }
    },
    
      {
        freezeTableName: true
        // timezone: '+5:30'
      })

   // ZsrmRefQsDist.sync({ alter: true });
    return ZsrmRefQsDist;
  };
  