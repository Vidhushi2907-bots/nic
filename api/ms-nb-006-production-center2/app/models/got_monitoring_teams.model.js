module.exports = (sql, Sequelize) => {
  const GotMonitoringTeams = sql.define(
    "got_monitoring_teams",
    {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      team_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      is_active: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      got_test_number: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    },
    {
      timestamps: false,
      tableName: "got_monitoring_teams",
    }
  );

  return GotMonitoringTeams;
};
