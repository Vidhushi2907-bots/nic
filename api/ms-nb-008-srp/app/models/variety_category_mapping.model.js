module.exports = (sql, Sequelize) => {

    const VarietyCategoryMapping = sql.define('m_variety_category_mapping', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      variety_code: {
        type: Sequelize.STRING,
      },
      m_variety_category_id: {
        type: Sequelize.INTEGER,
      },
    },
      {
        timestamps: false,
        tableName: 'm_variety_category_mapping',
        // timezone: '+5:30'
      }
    )
    return VarietyCategoryMapping
  }
  