module.exports = (sql, Sequelize) => {
  const reprintTags = sql.define('reprint_tags', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    year: {
      type: Sequelize.INTEGER,
    },
    season: {
      type: Sequelize.STRING,
    },
    crop_code: {
      type: Sequelize.STRING,
    },
    variety_code: {
      type: Sequelize.STRING,
    },
    lot_no: {
      type: Sequelize.STRING,
    },
    user_id: {
      type: Sequelize.INTEGER,
    },
    lot_id: {
      type: Sequelize.INTEGER,
    },
    variety_line_code: {
      type: Sequelize.STRING,
    },
    is_active: {
      type: Sequelize.INTEGER,
    },
    reason:{
      type: Sequelize.INTEGER,
    },
    is_approved: {
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
    createdAt: { type: Sequelize.DATE, field: 'created_at' },
    updatedAt: { type: Sequelize.DATE, field: 'updated_at' },
  },
  {
    timestamps: true,
    timezone: '+5:30'
  })
  return reprintTags
}