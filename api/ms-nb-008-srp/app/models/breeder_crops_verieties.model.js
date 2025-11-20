module.exports = (sql, Sequelize) => {

    const breederCropsVerieties = sql.define('breeder_crops_verieties', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      breeder_crop_id: {
        type: Sequelize.INTEGER
      },
        variety_id: {
          type: Sequelize.INTEGER
        },
    },
      {
        timestamps: false,
        // timezone: '+5:30'
      })
  
  
    return breederCropsVerieties
  }
  