module.exports = (sql, Sequelize) => {
  const liftingTagNumber = sql.define('lifting_tag_number', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    lifting_lot_no_id: {
      type: Sequelize.INTEGER,
    },
    tag_no: {
      type: Sequelize.STRING,
    },
    tag_size: {
      type: Sequelize.INTEGER,
    },
    no_of_bags: {
      type: Sequelize.INTEGER,
    },
    litting_seed_details_id: {
      type: Sequelize.INTEGER,
    },
    tag_id:{
      type: Sequelize.INTEGER,
    }
  },
    {
      timestamps: false,
      tableName: 'lifting_tag_number',
      // timezone: '+5:30'
    }
  )
  return liftingTagNumber
}
