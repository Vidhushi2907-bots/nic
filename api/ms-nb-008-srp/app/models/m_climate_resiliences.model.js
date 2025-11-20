module.exports = (sql, Sequelize) => {

  const mClimateResiliences = sql.define('m_climate_resiliences', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING,
    },
  },
    {
      timestamps: false,
      // timezone: '+5:30'
    })
  return mClimateResiliences
}
