module.exports = (sql, Sequelize) => {

  const seedRollingPlanCropWises = sql.define('seed_rolling_plan_crop_wises', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true

    },
    year: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    season: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    group_code: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    crop_code: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    total_area: {
      type: Sequelize.DOUBLE,
      allowNull: false,

    },
    total_required: {
      type: Sequelize.DOUBLE,
      allowNull: false,
    },

    is_active: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
    srr: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    seed_rate: {
      type: Sequelize.DOUBLE,
      defaultValue: 0,
    },
    is_draft: {
      type: Sequelize.BOOLEAN, defaultValue: false
    },
    is_final_submit: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },

    createdAt: { type: Sequelize.DATE, field: 'created_at' },
    updatedAt: { type: Sequelize.DATE, field: 'updated_at' },
  },
    {
      timestamps: true,
      timezone: '+5:30'
    }
  )
  return seedRollingPlanCropWises
}