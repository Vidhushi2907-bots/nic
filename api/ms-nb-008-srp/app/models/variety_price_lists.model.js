module.exports = (sql, Sequelize) => {

  const varietyPriceList = sql.define('variety_price_lists', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    year: {
      type: Sequelize.STRING
    },
    season: {
      type: Sequelize.INTEGER,
    },
    crop_code: {
      type: Sequelize.STRING,
    },
    
    variety_code: {
      type: Sequelize.STRING,
    },
    variety_line_code: {
      type: Sequelize.STRING,
    },
    per_quintal_mrp: {
      type: Sequelize.INTEGER,
    },
    valid_from: {
      type: Sequelize.INTEGER,
    },
    is_active: {
      type: Sequelize.INTEGER,
      defaultValue: 1
    },
    package_data:{
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
    user_id: {
      type: Sequelize.INTEGER,
    },
    createdAt: { type: Sequelize.DATE, field: 'created_at' },
    updatedAt: { type: Sequelize.DATE, field: 'updated_at' },

  },
    {
      // timestamps: false,
      timezone: '+5:30'
    })
  return varietyPriceList
}
