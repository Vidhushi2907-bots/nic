module.exports = (sql, Sequelize) => {

  const season = sql.define('m_seasons', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },

    season_code: {
      type: Sequelize.STRING,
    },
    season: {
      type: Sequelize.STRING
    },
  },
    {
      timestamps: false,
      // timezone: '+5:30'
    }
  )
  return season
}
