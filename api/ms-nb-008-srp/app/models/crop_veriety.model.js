module.exports = (sql, Sequelize) => {
  
    const CropVeriety = sql.define('m_crop_varieties', {
        id: {
          type: Sequelize.INTEGER,
          allowNull:false,
          primaryKey: true,
          autoIncrement: true
        },
        developed_by:{
          type: Sequelize.STRING
        },
        crop_code:{
          type: Sequelize.STRING,
        },
        introduce_year:{
          type: Sequelize.STRING,
        },
        // crop_name:{
        //   type: Sequelize.STRING,
        // },
        crop_group_code:{
          type: Sequelize.STRING,
        },
        is_notified:{
          type: Sequelize.INTEGER,
        },
        meeting_number:{
          type: Sequelize.STRING,
        },
        not_date:{
          type: Sequelize.STRING,
        },
        not_number:{
          type: Sequelize.STRING,
        },
        release_date:{
          type: Sequelize.STRING,
        },
        type:{
          type: Sequelize.STRING,
        },
        user_id:{
          type: Sequelize.INTEGER,
        },
        variety_code:{
          type: Sequelize.STRING,
        },
        type:{
          type: Sequelize.STRING,
        },
        variety_name:{
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
    
  
    return CropVeriety
  }
  