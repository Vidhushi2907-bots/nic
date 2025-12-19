module.exports = (sql, Sequelize) => {
  const ProcessedOldStock = sql.define('processed_seed_details_old_stocks', {
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
      tableName: 'processed_seed_details_old_stocks',
      // timezone: '+5:30'
    }
  )
  return ProcessedOldStock
}
