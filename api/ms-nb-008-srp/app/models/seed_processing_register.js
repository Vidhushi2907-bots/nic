module.exports = (sql, Sequelize) => {
  const carryOverSeed = sql.define('seed_processing_register', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    action: {
      type: Sequelize.INTEGER,
    },
    class_of_seed: {
      type: Sequelize.STRING,
    },
    crop_code: {
      type: Sequelize.STRING,
    },
    godown_no: {
      type: Sequelize.INTEGER,
    },
    lot_no: {
      type: Sequelize.STRING,
    },
    lot_qty: {
      type: Sequelize.INTEGER,
    },
    no_of_bags: {
      type: Sequelize.INTEGER,
    },
    process_loss: {
      type: Sequelize.INTEGER,
    },
    season: {
      type: Sequelize.STRING,
    },

    stack_no: {
      type: Sequelize.STRING,
    },
    total_processed_qty: {
      type: Sequelize.INTEGER,
    },
    total_rejected_qty: {
      type: Sequelize.INTEGER,
    },

    undersize_qty: {
      type: Sequelize.INTEGER,
    },
    variety_code: {
      type: Sequelize.STRING,
    },
    variety_code_line:{
      type: Sequelize.STRING,
    },
    year: {
      type: Sequelize.INTEGER,
    },
    lot_id: {
      type: Sequelize.INTEGER,
    },
    get_carry_over: {
      type: Sequelize.INTEGER,
    }

  },
    {
      timestamps: false,
      tableName: 'seed_processing_register',
      // timezone: '+5:30'
    }
  )
  return carryOverSeed
}
