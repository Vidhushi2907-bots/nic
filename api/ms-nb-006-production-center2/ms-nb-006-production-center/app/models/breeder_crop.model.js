module.exports = (sql, Sequelize) => {

    const breederCrops = sql.define('breeder_crops', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      crop_code: {
        type: Sequelize.STRING
      },
      crop_group_code: {
        type: Sequelize.STRING
      },
      season: {
        type: Sequelize.STRING
      },
      production_center_id: {
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      crop_name_id: {
        type: Sequelize.INTEGER
      },
      variety_id: {
        type: Sequelize.INTEGER
      },
    
      variety: {
        type: Sequelize.STRING
      },
      is_active: {
        type: Sequelize.INTEGER
      },
      created_at: {
          type: Sequelize.DATE,
          default: Date.now()
      },
      updated_at: {
          type: Sequelize.DATE,
          default: Date.now()
      },
      createdAt: {type: Sequelize.DATE, field: 'created_at'},
      updatedAt: {type: Sequelize.DATE, field: 'updated_at'},
  
    },
      {
        timestamps: false,
        // timezone: '+5:30'
      })
  
  
    return breederCrops
  }
  