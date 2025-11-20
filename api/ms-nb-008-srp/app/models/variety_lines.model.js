module.exports = (sql, Sequelize) => {
    const stage = sql.define('m_variety_lines', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      line: {
        type: Sequelize.STRING,
      },
      line_variety_code: {
        type: Sequelize.STRING,
      },
      line_variety_name: {
        type: Sequelize.STRING,
      },
      variety_code:{
        type: Sequelize.STRING,
      }
    },
      {
        // tableName: 'm_variety_lines',
        timestamps: false,
        timezone: '+5:30'
      })
    return stage
  }