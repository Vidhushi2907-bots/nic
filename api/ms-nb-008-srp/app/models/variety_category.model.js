module.exports = (sql, Sequelize) => {

    const VarietyCategory = sql.define('m_variety_category', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      category: {
        type: Sequelize.STRING,
      },
    },
      {
        timestamps: false,
        tableName: 'm_variety_category',
        // timezone: '+5:30'
      }
    )
    return VarietyCategory
  }
  