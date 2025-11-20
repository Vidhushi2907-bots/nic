module.exports = (sql, Sequelize) => {
  const carryOverSeed = sql.define('intake_verification_tags', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
     lot_number: {
      type: Sequelize.STRING,
    },
    qty: {
      type: Sequelize.INTEGER,
    },
     invest_verify_id: {
      type: Sequelize.INTEGER,
    },
   
    
    
   
  },
    {
      timestamps: false,
      tableName: 'intake_verification_tags',
      // timezone: '+5:30'
    }
  )
  return carryOverSeed
}
