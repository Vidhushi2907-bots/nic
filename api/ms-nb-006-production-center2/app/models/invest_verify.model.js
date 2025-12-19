
  
  module.exports = (sql, Sequelize) => {

    const InvestVerfication = sql.define('invest_verification', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      qty_recieved: {
        type: Sequelize.INTEGER
      },
      bag_recieved: {
        type: Sequelize.INTEGER
      },
      user_id:{
        type: Sequelize.INTEGER
      },
      bspc_id:{
        type: Sequelize.INTEGER
      },
      year:{
        type: Sequelize.INTEGER
      },
      season:{
        type: Sequelize.STRING
      },
      crop_code:{
        type: Sequelize.STRING
      },
      invest_harvesting_id:{
        type: Sequelize.INTEGER
      },
      lot_num:{
        type: Sequelize.INTEGER
      },
      provision_lot:{
        type: Sequelize.STRING
      }
    
  
    },
  
  
      {
        tableName:'invest_verification',
        timestamps: false,
        // timezone: '+5:30'
        timestamps: false,
      },
      )
  
  
    return InvestVerfication;
  }
  