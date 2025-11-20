module.exports = (sql, Sequelize) => {

  const mAgroEcologicalRegions = sql.define('m_agro_ecological_regions', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    regions_name: {
      type: Sequelize.STRING,
    },
    eco_region: {
      type: Sequelize.STRING,
    },
    soil_type: {
      type: Sequelize.STRING,
    },
    growing_period_from: {
      type: Sequelize.INTEGER,
    },
    growing_period_to: {
      type: Sequelize.INTEGER,
    },
  },
    {
      timestamps: false,
      // timezone: '+5:30'
    })
  return mAgroEcologicalRegions
}
