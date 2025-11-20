module.exports = (sql, Sequelize) => {

  const assignCropsNewFlow = sql.define('assign_crops', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    is_active: {
      type: Sequelize.INTEGER,
    },
    crop_code: {
      type: Sequelize.STRING,
    },
    variety_code: {
      type: Sequelize.STRING,
    },
    year: {
      type: Sequelize.INTEGER,
    },
    season: {
      type: Sequelize.STRING,
    },
    comment_id: {
      type: Sequelize.INTEGER,
    },
    willing_to_praduced: {
      type: Sequelize.INTEGER,
    },
    user_id: {
      type: Sequelize.INTEGER,
    },
    bspc_data:{
      type: Sequelize.JSON,
    },
    created_at: {
      type: Sequelize.DATE,
      default: Date.now()
    },
    updated_at: {
      type: Sequelize.DATE,
      default: Date.now()
    },
    variety_line_code:{
      type: Sequelize.STRING,
    },
    createdAt: { type: Sequelize.DATE, field: 'created_at' },
    updatedAt: { type: Sequelize.DATE, field: 'updated_at' },
  },
    {
      // timestamps: false,
      timezone: '+5:30'
    }
  )
  return assignCropsNewFlow
}
