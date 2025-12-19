module.exports = (sql, Sequelize) => {

  return sql.define('monitoring_team_of_bspc_plots', {
          id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
          },
          monitoring_team_of_id:{
            type: Sequelize.INTEGER,
          },
          plots:{
            type: Sequelize.STRING,
          }
        },
        {
          timestamps: false
        }
    )
  }
