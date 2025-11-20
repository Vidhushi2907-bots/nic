module.exports = (sql, Sequelize) => {

  return sql.define('monitoring_team_of_bspc', {
          id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
          },
          crop_code: {
            type: Sequelize.STRING,
          },
          variety_code: {
            type: Sequelize.STRING,
          },
          is_active: {
            type: Sequelize.INTEGER,
            default: 1
          },
          name: {
            type: Sequelize.STRING,
          },
          season: {
            type: Sequelize.STRING,
          },
          user_id: {
            type: Sequelize.INTEGER,
          },
          year: {
            type: Sequelize.INTEGER,
          },
          created_at: {
            type: Sequelize.DATE,
            default: Date.now()
          },
          updated_at: {
            type: Sequelize.DATE,
            default: Date.now()
          },
          createdAt: {type: Sequelize.DATE, field: 'created_at'},
          updatedAt: {type: Sequelize.DATE, field: 'updated_at'},
        },
        {
            tableName: 'monitoring_team_of_bspc',
            timezone: '+5:30'
        }
    )
  }
