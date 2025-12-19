module.exports = (sql, Sequelize) => {
  const GotMonitoringTeams = sql.define("got_monitoring_team_members",
    {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      got_monitoring_team_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      designation_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      mobile_number: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      email_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      pin_code: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      user_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      is_team_lead: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: false,
      tableName: "got_monitoring_team_members",
    }
  );

  return GotMonitoringTeams;
};
