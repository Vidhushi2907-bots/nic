module.exports = (sql, Sequelize) => {
  const GotShowingDetails = sql.define(
    "got_showing_details",
    {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      got_testing_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      state_code: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      district_code: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      area_shown: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      date_of_showing: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      expected_start_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      expected_end_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      is_report_genertaed: {
        type: Sequelize.DOUBLE,
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
      tableName: "got_showing_details",
    }
  );

  return GotShowingDetails;
};
