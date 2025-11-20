module.exports = (sql, Sequelize) => {
  const carryOverSeed = sql.define('carry_over_seed', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    crop_code: {
      type: Sequelize.STRING,
    },
    is_active: {
      type: Sequelize.INTEGER,
    },
    meet_target: {
      type: Sequelize.INTEGER,
    },
    req_data: {
      type: Sequelize.JSON,
    },
     season: {
      type: Sequelize.STRING,
    },
     total_qty: {
      type: Sequelize.INTEGER
    },
     user_id: {
      type: Sequelize.INTEGER,
    },
     variety_code: {
      type: Sequelize.STRING,
    },
     year: {
      type: Sequelize.STRING,
    },
    is_freezed: {
      type: Sequelize.STRING,
    },
      created_at: {
            type: Sequelize.DATE,
            default: Date.now()
        },
        updated_at: {
            type: Sequelize.DATE,
            default: Date.now()
        },
  },
    {
      timestamps: false,
      tableName: 'carry_over_seed',
      // timezone: '+5:30'
    }
  )
  return carryOverSeed
}
