module.exports = (sql, Sequelize) => {

    const agencyType = sql.define('agency_types', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      is_active: {
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
   
    },
    {
      timestamps: false,
      timezone: '+5:30'
    }
    )
    return agencyType
  }
  