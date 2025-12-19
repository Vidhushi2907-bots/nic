module.exports = (sql, Sequelize) => {

    const bsp4 = sql.define('bsp_4', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      actual_seed_production: {
        type: Sequelize.STRING
      },
      carry_over_current_year_germination: {
        type: Sequelize.STRING
      },
      carry_over_last_year_germination: {
        type: Sequelize.INTEGER
      },
      carry_over_seed_amount: {
        type: Sequelize.INTEGER
      },
      crop_code: {
        type: Sequelize.STRING
      },
      document: {
        type: Sequelize.STRING
      },
    
      number_of_sample: {
        type: Sequelize.INTEGER
      },
      pd_letter_number: {
        type: Sequelize.STRING
      },
      production_center_id: {
        type: Sequelize.INTEGER
      },
      reason_for_dificit: {
        type: Sequelize.STRING
      },
      shor_fall_reason: {
        type: Sequelize.STRING
      },
      short_fall_document: {
        type: Sequelize.STRING
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      variety_id: {
        type: Sequelize.INTEGER
      },
      year: {
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
      production_year: {
        type: Sequelize.DATE,
        default: Date.now()
      },
      createdAt: {type: Sequelize.DATE, field: 'created_at'},
      updatedAt: {type: Sequelize.DATE, field: 'updated_at'},
      productionYear: {type: Sequelize.DATE, field: 'production_year'},
  
    },
    {
    timestamps: false,
    tableName: 'bsp_4s'
    // timezone: '+5:30'
    })
  
  
    return bsp4
  }
  