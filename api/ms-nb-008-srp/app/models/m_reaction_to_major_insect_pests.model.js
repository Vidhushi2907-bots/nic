module.exports = (sql, Sequelize) => {

  const mReactionToMajorInsectPests = sql.define('m_reaction_to_major_insect_pests', {
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
  return mReactionToMajorInsectPests
}
