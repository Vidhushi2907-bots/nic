module.exports = (sql, Sequelize) => {

    const stage = sql.define('stages', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      stage_field: {
        type: Sequelize.STRING,
      },
      
    },
      {
        tableName: 'stages',
        timestamps: false,
        timezone: '+5:30'
      })
    return stage
  }
