module.exports = (sql, Sequelize) => {
  const VarietyCategory = sql.define('m_variety_lines', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    line_variety_name: {
      type: Sequelize.STRING,
    },
    variety_code: {
      type: Sequelize.STRING,
    },
    line: {
      type: Sequelize.STRING,
    },
    line_variety_code: {
      type: Sequelize.STRING,
    },
  },
    {
      timestamps: false,
      tableName: 'm_variety_lines',
      // timezone: '+5:30'
    }
  )
  return VarietyCategory
}