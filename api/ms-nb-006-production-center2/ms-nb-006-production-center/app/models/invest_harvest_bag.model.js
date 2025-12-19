module.exports = (sql, Sequelize) => {

    const InvestHarvestingBag = sql.define('investing_harvesting_bag', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      ref_number: {
        type: Sequelize.INTEGER
      },
      investing_harvesting_id: {
        type: Sequelize.INTEGER
      },
      bags:{
        type: Sequelize.STRING
      },
      total_number: {
        type: Sequelize.INTEGER
      },
  
    },
  
  
      {
        tableName:'investing_harvesting_bag',
        timestamps: false,
        // timezone: '+5:30'
        timestamps: false,
      },
      )
  
  
    return InvestHarvestingBag;
  }
  