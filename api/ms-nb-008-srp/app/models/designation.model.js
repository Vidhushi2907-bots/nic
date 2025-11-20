module.exports = (sql, Sequelize) => {
  
    const Designation = sql.define('m_designations', {
        id: {
          type: Sequelize.INTEGER,
          allowNull:false,
          primaryKey: true,
          autoIncrement: true
        },
        name:{
          type: Sequelize.STRING
        },
        table_id:{
          type: Sequelize.INTEGER,
        },
        type:{
          type: Sequelize.STRING     
        }
        
    },
   
        
       {
         timestamps: false,
        // timezone: '+5:30'
       })
    
  
    return Designation
  }
  