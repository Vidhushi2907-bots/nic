module.exports = (sequelize, Sequelize) => {
  const SeedRollingPlanVarietyWise = sequelize.define(
    'seed_rolling_plan_variety_wises',
    {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      variety_code: {
        type: Sequelize.STRING,
      },
      required_qty_of_certified_seeds: {
        type: Sequelize.DOUBLE,
        defaultValue: 0,
      },
      foundation_seed: {
        type: Sequelize.DOUBLE,
        defaultValue: 0,
      },
      breeder_seed: {
        type: Sequelize.DOUBLE,
        defaultValue: 0,
      },
      // notification_year: {
      //   type: Sequelize.INTEGER,
      //   allowNull: true,
      // },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      is_draft: {
        type: Sequelize.SMALLINT,
        defaultValue: 0,
      },
      is_final_submit: {
        type: Sequelize.SMALLINT,
        defaultValue: 0,
      },
      srp_crop_wise_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        field: 'created_at',
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        field: 'updated_at',
        defaultValue: Sequelize.NOW,
      },
    },
    {
      tableName: 'seed_rolling_plan_variety_wises', // ensure correct table mapping
      timestamps: true,
      underscored: true, // ensures snake_case mapping for created_at / updated_at
      freezeTableName: true, // prevent Sequelize from pluralizing
      timezone: '+05:30',
    }
  );
 
  return SeedRollingPlanVarietyWise;
};