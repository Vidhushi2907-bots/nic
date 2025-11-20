module.exports = (sql, Sequelize) => {

  return sql.define('monitoring_team_of_bspc_members', {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
        },
        address: {
          type: Sequelize.STRING,
        },
        designation_id: {
          type: Sequelize.INTEGER,
        },
        district_code: {
          type: Sequelize.INTEGER,
        },
        monitoring_team_of_bspc_id: {
          type: Sequelize.INTEGER,
        },
        is_active: {
          type: Sequelize.INTEGER,
          default: 1
        },
        is_team_lead: {
          type: Sequelize.INTEGER,
          default: 0
        },
        email_id: {
          type: Sequelize.STRING,
        },
        mobile_number: {
          type: Sequelize.STRING,
        },
        name: {
          type: Sequelize.STRING,
        },
        otp: {
          type: Sequelize.INTEGER,
        },
        state_code: {
          type: Sequelize.INTEGER,
        },
        type_of_agency: {
          type: Sequelize.INTEGER,
        }
      },
      {
        timestamps: false
      }
  )
}
