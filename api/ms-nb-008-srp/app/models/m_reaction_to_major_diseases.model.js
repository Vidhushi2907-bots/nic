module.exports = (sql, Sequelize) => {

  const mReactionToMajorDiseases = sql.define('m_reaction_to_major_diseases', {
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
  return mReactionToMajorDiseases
}
