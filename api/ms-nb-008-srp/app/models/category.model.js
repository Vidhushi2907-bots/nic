module.exports = (sql, Sequelize) => {
  
    const Category = sql.define('m_category_of_oragnizations', {
        id: {
          type: Sequelize.INTEGER,
          allowNull:false,
          primaryKey: true,
          autoIncrement: true
        },
        category_code:{
          type: Sequelize.INTEGER,
        },
        category_name:{
          type: Sequelize.STRING,
        },
        type:{
          type: Sequelize.STRING     
        }
    },
      
    {
      timestamps: false,
     // timezone: '+5:30'
    }
    ) 
    return Category
  }
  