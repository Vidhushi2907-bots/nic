module.exports = (sql, Sequelize) => {

    const labelNumberForBreederseed = sql.define('label_number_for_breederseeds', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      year_of_indent: {
        type: Sequelize.INTEGER
      },
      crop_code: {
        type: Sequelize.STRING,
      },
      variety_id: {
        type: Sequelize.INTEGER,
      },
      lot_number: {
        type: Sequelize.STRING
      },
      lot_number_creation_id: {
        type: Sequelize.INTEGER
      },
      // label_number: {
      //   type: Sequelize.INTEGER
      // },
      pure_seed: {
        type: Sequelize.STRING
      },
      inert_matter: {
        type: Sequelize.STRING
      },
      germination: {
        type: Sequelize.STRING
      },
  
      total_production: {
        type: Sequelize.STRING
      },
      quantity: {
        type: Sequelize.STRING
      },
      date_of_test: {
        type: Sequelize.STRING
      },
  
      weight: {
        type: Sequelize.STRING,
      },
      number_of_bags: {
        type: Sequelize.INTEGER
      },
      valid_upto: {
        type: Sequelize.STRING
      },
      is_active: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      user_id: {
        type: Sequelize.INTEGER,
      },
      season: {
        type: Sequelize.STRING
      },
      seed_testing_reports_id: {
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
  
      createdAt: { type: Sequelize.DATE, field: 'created_at' },
      updatedAt: { type: Sequelize.DATE, field: 'updated_at' },
  
    },
  
  
      {
        timestamps: false,
        // timezone: '+5:30'
      })
  
  
    return labelNumberForBreederseed;
  }
  