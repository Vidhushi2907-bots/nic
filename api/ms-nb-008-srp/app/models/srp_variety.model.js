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
        type: Sequelize.BOOLEAN,
        
      },
      is_final_submit: { 
        type: Sequelize.BOOLEAN,
        
      },
      srp_crop_wise_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: { type: Sequelize.DATE, field: 'created_at' },
      updatedAt: { type: Sequelize.DATE, field: 'updated_at' },
    },
    {
      timestamps: true,
      timezone: '+5:30'
    }
  );

  return SeedRollingPlanVarietyWise;
};