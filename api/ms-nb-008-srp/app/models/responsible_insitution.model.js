module.exports = (sql, Sequelize) => {

    const mCropGroup = sql.define('responsible_insitutions', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      insitution_name: {
        type: Sequelize.STRING
      },
     
      
  
    },
      {
        timestamps: false,
        // timezone: '+5:30'
      })
  
  
    return mCropGroup
  }
  