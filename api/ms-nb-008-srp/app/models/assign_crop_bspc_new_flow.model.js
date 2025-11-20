module.exports = (sql, Sequelize) => {

  const assignCropBspcMapping = sql.define('assign_crop_bspc_mappings', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    assign_crop_id: {
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
  return assignCropBspcMapping
}
