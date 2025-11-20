module.exports = (sql, Sequelize) => {
  const liftingLotNumbers = sql.define('lifting_lot_numbers', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },

    lifting_details_id: {
      type: Sequelize.INTEGER,
    },
    lot_no: {
      type: Sequelize.STRING,
    },
    lot_id:{
      type: Sequelize.INTEGER,
    }
  },
    {
      timestamps: false,
      tableName: 'lifting_lot_numbers',
      // timezone: '+5:30'
    }
  )
  return liftingLotNumbers
}
