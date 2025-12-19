module.exports = (sql, Sequelize) => {
  
    const User = sql.define('user', {
        id: {
          type: Sequelize.INTEGER,
          allowNull:false,
          primaryKey: true,
          autoIncrement: true
        },
        agency_id:{
          type: Sequelize.STRING
        },
        code:{
          type: Sequelize.INTEGER
        },
        agency_id:{
          type: Sequelize.STRING
        },
        
        designation_id:{
          type: Sequelize.INTEGER
        },
        email_id:{
          type: Sequelize.STRING,
        },
        mobile_number:{
          type: Sequelize.INTEGER,
        },
        name:{
          type: Sequelize.STRING,
        },
        password:{
          type: Sequelize.STRING,
        },
        user_type:{
          type: Sequelize.INTEGER,
        },
        username:{
          type: Sequelize.STRING,
        },
        spa_code:{
          type: Sequelize.STRING,
        },
        created_by:{
          type: Sequelize.INTEGER,
        },
        updated_by:{
          type: Sequelize.INTEGER,
        },
        is_active: {
            type: Sequelize.INTEGER,
            defaultValue: 1
        },
        created_at: {
            type: Sequelize.DATE,
            default: Date.now()
        },
        updated_at: {
            type: Sequelize.DATE,
            default: Date.now()
        },
        is_deleted: {
            type: Sequelize.INTEGER
        },
        createdAt: {type: Sequelize.DATE, field: 'created_at'},
        updatedAt: {type: Sequelize.DATE, field: 'updated_at'},
        
    },
   
        
       {
         timestamps: false,
        // timezone: '+5:30'
       })
    
  
    return User
  }
  