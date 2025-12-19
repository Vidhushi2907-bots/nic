module.exports = (sql, Sequelize) => {
  const seedProceesingRegisterOldStock = sql.define('seed_processing_register_old_stocks', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    bspc_id: {
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
    is_active: {
      type: Sequelize.INTEGER,
    },

    lot_id: {
      type: Sequelize.INTEGER,
    },

    lot_no: {
      type: Sequelize.STRING,
    },

    no_of_bags: {
      type: Sequelize.INTEGER,
    },

    processing_loss: {
      type: Sequelize.INTEGER,
    },
    rejected__qty: {
      type: Sequelize.INTEGER,
    },

    stack_id: {
      type: Sequelize.INTEGER,
    },

    stack_no: {
      type: Sequelize.STRING,
    },
    total_processed_qty: {
      type: Sequelize.INTEGER,
    },
    undersize: {
      type: Sequelize.INTEGER,
    },
    variety_code: {
      type: Sequelize.STRING,
    },
    user_id: {
      type: Sequelize.INTEGER,
    },
    variety_line_code:{
      type: Sequelize.STRING,
    }
  },
    {
      timestamps: false,
      tableName: 'seed_processing_register_old_stocks',
      // timezone: '+5:30'
    }
  )
  return seedProceesingRegisterOldStock
}
