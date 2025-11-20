module.exports = (sql, Sequelize) => {
  const carryOverSeed = sql.define('processed_seed_details', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
     action: {
      type: Sequelize.INTEGER,
    },
    no_of_bags: {
      type: Sequelize.INTEGER,
    },
    bag_size: {
      type: Sequelize.INTEGER,
    },
     qty: {
      type: Sequelize.INTEGER,
    },
      seed_processing_register_id: {
      type: Sequelize.INTEGER,
    },
    
    
   
  },
    {
      timestamps: false,
      tableName: 'processed_seed_details',
      // timezone: '+5:30'
    }
  )
  return carryOverSeed
}
