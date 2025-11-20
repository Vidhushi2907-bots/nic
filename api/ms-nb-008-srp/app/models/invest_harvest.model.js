module.exports = (sql, Sequelize) => {

    const labelNumberForBreederseed = sql.define('invest_harvesting', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      year: {
        type: Sequelize.INTEGER
      },
      crop_code: {
        type: Sequelize.STRING,
      },
      season: {
        type: Sequelize.STRING,
      },
      crop_code: {
        type: Sequelize.STRING
      },
      variety_code: {
        type: Sequelize.STRING
      },
      variety_line_code: {
        type: Sequelize.STRING
      },
      plot_code: {
        type: Sequelize.STRING
      },
      actual_harvest_date: {
        type: Sequelize.DATE
      },
  
      raw_seed_produced: {
        type: Sequelize.STRING
      },
      no_of_bags: {
        type: Sequelize.STRING
      },
      spp_id: {
        type: Sequelize.STRING
      },
      bag_marka: {
        type: Sequelize.STRING
      },
  

      user_id: {
        type: Sequelize.INTEGER,
      },
      ref_number:{
        type: Sequelize.INTEGER,
      },
     
      plot_id:{
        type: Sequelize.INTEGER,
      },
      check_status:{
        type: Sequelize.INTEGER,
      }
     
  
  
    },
  
  
      {
        tableName:'invest_harvesting',
        timestamps: false,
        // timezone: '+5:30'
        timestamps: false,
      },
      )
  
  
    return labelNumberForBreederseed;
  }
  