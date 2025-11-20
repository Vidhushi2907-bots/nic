module.exports = (sql, Sequelize) => {
  const mAgroLogicalRegionStates = sql.define('m_agro_logical_region_states', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    state_code: {
      type: Sequelize.INTEGER,
    },
    m_agro_logical_region_id: {
      type: Sequelize.INTEGER,
    },
  },
    {
      timestamps: false,
      // timezone: '+5:30'
    })
  return mAgroLogicalRegionStates
}
