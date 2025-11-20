module.exports = (sql, Sequelize) => {
  const seedProcessedStack = sql.define('seed_for_processed_stack', {
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
     seed_processing_register_id: {
      type: Sequelize.INTEGER,
    },
      type_of_seed: {
      type: Sequelize.INTEGER,
    },
    
    
   
  },
    {
      timestamps: false,
      tableName: 'seed_for_processed_stack',
      // timezone: '+5:30'
    }
  )
  return seedProcessedStack
}
