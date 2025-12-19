module.exports = (sql, Sequelize) => {

  return sql.define('bsp_proforma_3_members', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    monitoring_team_of_bspc_members_id: {
      type: Sequelize.INTEGER
    },
    bsp3_id: {
      type: Sequelize.INTEGER
    },
    is_active:{
      type: Sequelize.INTEGER
    }
  },
    {
      timestamps: false,
    })
}
