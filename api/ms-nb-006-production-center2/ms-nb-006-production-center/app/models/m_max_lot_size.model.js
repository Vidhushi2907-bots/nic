module.exports = (sql, Sequelize) => {

  const maxLotSize = sql.define('m_max_lot_size', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    crop: {
      type: Sequelize.STRING
    },
    crop_code: {
      type: Sequelize.STRING
    },
    max_lot_size: {
      type: Sequelize.STRING,
    },
    group_code:{
      type: Sequelize.STRING,
    },
    group_name:{
      type: Sequelize.STRING,
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
      timezone: '+5:30'
    })
  return maxLotSize
}
