module.exports = (sql, Sequelize) => {

    const Comments = sql.define('comments', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      comment: {
        type: Sequelize.STRING,
      },
     
      type: {
        type: Sequelize.STRING,
      },
      is_active:{
        type: Sequelize.INTEGER,
      },
    },
      
    {
        timestamps: false,
        // timezone: '+5:30'
      }
    
      
    )
    return Comments
  }
  