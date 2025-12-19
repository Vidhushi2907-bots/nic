module.exports = (sql, Sequelize) => {
  const liftingCharges = sql.define('lifting_charges', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    additional_charges_id: {
      type: Sequelize.INTEGER,
    },
    gst: {
      type: Sequelize.INTEGER,
    },
    total_amount: {
      type: Sequelize.INTEGER,
    },
    after_apply_gst: {
      type: Sequelize.INTEGER,
    },
    lifting_details_id: {
      type: Sequelize.INTEGER,
    }
  },
    {
      timestamps: false,
      tableName: 'lifting_charges',
      // timezone: '+5:30'
    }
  )
  return liftingCharges
}
