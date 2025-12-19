module.exports = (sql, Sequelize) => {

    const investVerifyStackComposition = sql.define('invest_verify_stack_composition', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      year: {
        type: Sequelize.INTEGER
    },
    season: {
        type: Sequelize.STRING,
    },
  
    bag_marka: {
        type: Sequelize.JSON
      },
      bag_marka_id: {
        type: Sequelize.INTEGER
      },
      invest_verify_id: {
        type: Sequelize.INTEGER
      },
   
      stack: {
        type: Sequelize.STRING
      },
      type_of_seed: {
        type: Sequelize.INTEGER
      },
      invest_harvesting_id:{
        type: Sequelize.INTEGER
      },
      godown_no:{
        type: Sequelize.INTEGER
      },
      stack_id:{
        type: Sequelize.INTEGER
      }
     
  
  
    },
  
  
      {
        tableName:'invest_verify_stack_composition',
        timestamps: false,
        // timezone: '+5:30'
        timestamps: false,
      },
      )
  
  
    return investVerifyStackComposition;
  }