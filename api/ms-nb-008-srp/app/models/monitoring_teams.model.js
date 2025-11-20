module.exports = (sql, Sequelize) => {

  const MonitoringTeams = sql.define('monitoring_teams', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    mobile_number: {
      type: Sequelize.STRING,
    },
    institute_name: {
        type: Sequelize.STRING,
    },
    address: {
      type: Sequelize.STRING,
    },
    is_active: {
      type: Sequelize.INTEGER
    },
    user_id: {
      type: Sequelize.INTEGER
    },
    designation: {
      type: Sequelize.STRING
    },
    user_mapping_id: {
      type: Sequelize.INTEGER
    },
    name: {
      type: Sequelize.STRING
    },
    updated_at: {
      type: Sequelize.DATE
    },
    created_at: {
      type: Sequelize.DATE
    },
  },
  {
    timestamps: false,
    timezone: '+5:30'
  })
  return MonitoringTeams
}
