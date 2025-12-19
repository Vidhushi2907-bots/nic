module.exports = (sql, Sequelize) => {
  const processedSeedDetailsBkps = sql.define('processed_seed_details_bkps', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
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
      tableName: 'processed_seed_details_bkps',
      // timezone: '+5:30'
    }
  )
  return processedSeedDetailsBkps
}
