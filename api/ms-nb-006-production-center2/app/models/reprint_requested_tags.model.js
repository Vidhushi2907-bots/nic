module.exports = (sql, Sequelize) => {
  const reprintRequestedTags = sql.define('reprint_requested_tags', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    reprint_tag_id: {
      type: Sequelize.INTEGER,
    },
    tag_no: {
      type: Sequelize.STRING,
    },
  },
    {
      // tableName: 'm_variety_lines',
      timestamps: false,
      tableName: 'reprint_requested_tags',
      // timezone: '+5:30'
    })
  return reprintRequestedTags
}