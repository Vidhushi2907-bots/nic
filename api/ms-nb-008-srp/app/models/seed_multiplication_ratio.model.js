module.exports = (sql, Sequelize) => {
  
    const seedMultiPlicationRatio = sql.define('seed_multiplication_ratios', {
        id: {
          type: Sequelize.INTEGER,
          allowNull:false,
          primaryKey: true,
          autoIncrement: true
        },
        crop_group_code:{
          type: Sequelize.STRING
        },
        // croup_group_code:{
        //   type: Sequelize.STRING
        // },
        // created_by: {
        //   type: Sequelize.INTEGER,
        // },
        // updated_by: {
        //   type: Sequelize.INTEGER,
        // },
        crop_code:{
          type: Sequelize.STRING
        },   
        crop_name:{
          type: Sequelize.STRING
        },
        user_id:{
          type: Sequelize.INTEGER,
        },
        nucleus_to_breeder:{
          type: Sequelize.INTEGER,
        },
        breeder_to_foundation:{
          type: Sequelize.STRING,
        },
        foundation_1_to_2:{
          type: Sequelize.STRING,
        },
        foundation_2_to_cert:{
          type: Sequelize.STRING,
        },
        status:{
          type: Sequelize.STRING,
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
        createdAt: {type: Sequelize.DATE, field: 'created_at'},
        updatedAt: {type: Sequelize.DATE, field: 'updated_at'},
        
    },
   
        
       {
         timestamps: false,
        // timezone: '+5:30'
       })
    
  
    return seedMultiPlicationRatio
  }
  