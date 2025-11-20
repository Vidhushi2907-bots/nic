module.exports = (sql, Sequelize) => {
  
    const District = sql.define('m_districts', {
        id: {
          type: Sequelize.INTEGER,
          allowNull:false,
          primaryKey: true,
          autoIncrement: true
        },
        district_name:{
          type: Sequelize.STRING
        },
        district_code:{
          type: Sequelize.INTEGER,
        },
        state_name:{
          type: Sequelize.STRING
        },
        state_code:{
          type: Sequelize.INTEGER,
        },
        census_2001_code:{
          type: Sequelize.INTEGER,
        },
        census_2011_code:{
          type: Sequelize.INTEGER,
        },
        dt_short_name:{
          type: Sequelize.INTEGER,
        }
        
    },
   
        
       {
         timestamps: false,
        // timezone: '+5:30'
       })
    
  
    return District
  }
  