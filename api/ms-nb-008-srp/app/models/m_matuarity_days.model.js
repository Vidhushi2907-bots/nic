module.exports = (sql, Sequelize) => {

  const mMatuarityDays = sql.define('m_matuarity_days', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    days: {
      type: Sequelize.STRING,
    },
  },
    {
      timestamps: false,
      // timezone: '+5:30'
    })
  return mMatuarityDays
}
