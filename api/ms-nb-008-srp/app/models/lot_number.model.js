module.exports = (sql, Sequelize) => {

    const lotNumber = sql.define('lot_number_creations', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      crop_code: {
        type: Sequelize.STRING,
      },
      year: {
        type: Sequelize.INTEGER,
      },
      variety_id: {
        type: Sequelize.INTEGER,
      },
      lot_number: {
        type: Sequelize.STRING
      },
      is_active: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      user_id: {
        type: Sequelize.INTEGER,
      },
      created_at: {
        type: Sequelize.DATE,
        default: Date.now()
      },
      updated_at: {
        type: Sequelize.DATE,
        default: Date.now()
      },
      breeder_production_center_id: {
        type: Sequelize.INTEGER,
      },
      running_number: {
        type: Sequelize.INTEGER,
      },
      reserved_lot_number: {
        type: Sequelize.BOOLEAN,
        default: false
      },
      lot_number_size: {
        type: Sequelize.INTEGER,
      },
      season: {
        type: Sequelize.STRING
      },
      spp_id: {
        type: Sequelize.INTEGER
      },
      forward_by_pdpc: {
        type: Sequelize.INTEGER
      },
      forward_by_icar: {
        type: Sequelize.INTEGER
      },
      current_year: {
        type: Sequelize.INTEGER,
      },
      current_month: {
        type: Sequelize.INTEGER
      },
      bspc_code: {
        type: Sequelize.STRING
      },
      spp_code: {
        type: Sequelize.STRING
      },
      createdAt: { type: Sequelize.DATE, field: 'created_at' },
      updatedAt: { type: Sequelize.DATE, field: 'updated_at' },
  
    },
  
  
      {
        timestamps: false,
        // timezone: '+5:30'
      })
  
  
    return lotNumber
  }
  
  