module.exports = (sql, Sequelize) => {
  const seedProcessedStackOldStock = sql.define('seed_for_processed_stack_old_stocks', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
     godown_no: {
      type: Sequelize.INTEGER,
    },
    no_of_bag: {
      type: Sequelize.INTEGER,
    },
    seed_processing_register_old_stock_id: {
      type: Sequelize.INTEGER,
    },
      type_of_seed: {
      type: Sequelize.INTEGER,
    },
    stack_no: {
      type: Sequelize.STRING,
    },
    
    
   
  },
    {
      timestamps: false,
      tableName: 'seed_for_processed_stack_old_stocks',
      // timezone: '+5:30'
    }
  )
  return seedProcessedStackOldStock
}
