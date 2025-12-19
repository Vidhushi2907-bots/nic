module.exports = (sql, Sequelize) => {
  const carryOverSeedDetails = sql.define('carry_over_seed_details', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    class: {
      type: Sequelize.INTEGER,
    },
    lot_no: {
      type: Sequelize.STRING,
    },
   lot_id: {
      type: Sequelize.INTEGER,
    },
     season: {
      type: Sequelize.STRING,
    },
    stage_id: {
      type: Sequelize.INTEGER,
    },
    tag_no: {
      type: Sequelize.JSON,
    },
     year: {
      type: Sequelize.INTEGER,
    },
      carry_over_seed_id: {
      type: Sequelize.INTEGER,
    },
    quantity_available:{
      type: Sequelize.INTEGER,
    },
    quantity_recieved:{
      type: Sequelize.INTEGER,
    },
    tag_number:{
      type: Sequelize.STRING,
    },
    tag_value:{
      type: Sequelize.STRING,
    },
    tag_id:{
      type: Sequelize.STRING,
    }
  },
    {
      timestamps: false,
      tableName: 'carry_over_seed_details',
      // timezone: '+5:30'
    }
  )
  return carryOverSeedDetails
}
