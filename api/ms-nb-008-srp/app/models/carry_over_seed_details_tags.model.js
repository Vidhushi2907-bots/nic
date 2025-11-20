module.exports = (sql, Sequelize) => {
  const carryOverSeedDetailsTags = sql.define('carry_over_seed_details_tags', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    tag_id: {
      type: Sequelize.INTEGER,
    },
    tag_no: {
      type: Sequelize.STRING,
    },
 used_quantity: {
      type: Sequelize.INTEGER,
    },
    lot_id: {
      type: Sequelize.INTEGER,
    },
    
    carry_over_seed_details_id: {
      type: Sequelize.INTEGER,
    },
   
  },
    {
      timestamps: false,
      tableName: 'carry_over_seed_details_tags',
      // timezone: '+5:30'
    }
  )
  return carryOverSeedDetailsTags
}
