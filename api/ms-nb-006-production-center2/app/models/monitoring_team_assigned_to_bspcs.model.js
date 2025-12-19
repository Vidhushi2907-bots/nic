module.exports = (sql, Sequelize) => {

  const monitoringTeamAssignedToBspcs = sql.define('monitoring_team_assigned_to_bspcs', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    monitoring_team_of_pdpc_id: {
      type: Sequelize.INTEGER,
    },
    bspc_id: {
      type: Sequelize.INTEGER,
    },
  },
    {
      timestamps: false,
      // timezone: '+5:30'
    }
  )
  return monitoringTeamAssignedToBspcs
}
