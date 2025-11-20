module.exports = (sql, Sequelize) => {

  const varietyPriceListPackages = sql.define('variety_price_list_packages', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    variety_priece_list_id: {
      type: Sequelize.STRING
    },
    per_qnt_mrp: {
      type: Sequelize.INTEGER,
    },
    packages_size: {
      type: Sequelize.STRING,
    },
    is_active:{
      type: Sequelize.INTEGER,
      defaultValue: 1
    },
    per_quintal_price:{
      type: Sequelize.INTEGER,
      // defaultValue: 1
    }
  },
    {
      timestamps: false,
      // timezone: '+5:30'
    })
  return varietyPriceListPackages
}
