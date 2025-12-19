module.exports = (sql, Sequelize) => {
  const discardRequestedTags = sql.define('discard_tag_requests', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    discard_id: {
      type: Sequelize.INTEGER,
    },
    tag_no: {
      type: Sequelize.STRING,
    },
  },
    {
      // tableName: 'm_variety_lines',
      timestamps: false,
      tableName: 'discard_tag_requests',
      // timezone: '+5:30'
    })
  return discardRequestedTags
}