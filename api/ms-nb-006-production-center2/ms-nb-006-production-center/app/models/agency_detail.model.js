module.exports = (sql, Sequelize) => {
  
    const AgencyDetail = sql.define('agency_details', {
        id: {
          type: Sequelize.INTEGER,
          allowNull:false,
          primaryKey: true,
          autoIncrement: true
        },
        created_by:{
          type: Sequelize.INTEGER
        },
        user_id:{
          type: Sequelize.INTEGER
        },
        agency_name:{
          type: Sequelize.STRING,
        },
        category:{
          type: Sequelize.STRING
        },
        state_id:{
          type: Sequelize.INTEGER,
        },
        district_id:{
          type: Sequelize.INTEGER,
        },
        short_name:{
          type: Sequelize.STRING,
        },
        address:{
          type: Sequelize.STRING,
        },
        contact_person_name:{
          type: Sequelize.STRING,
        },
        contact_person_mobile:{
          type: Sequelize.STRING,
        },
        contact_person_designation_id:{
          type: Sequelize.INTEGER,
        },
        mobile_number:{
          type: Sequelize.INTEGER,
        },
        email:{
          type: Sequelize.STRING,
        },
        phone_number:{
          type: Sequelize.INTEGER,
        },
        pincode:{
          type: Sequelize.INTEGER,
        },
        fax_no:{
          type: Sequelize.INTEGER,
        },
        latitude:{
          type: Sequelize.STRING,
        },
        longitude:{
          type: Sequelize.STRING,
        },
        bank_name:{
          type: Sequelize.STRING,
        },
        bank_branch_name:{
          type: Sequelize.STRING,
        },
        bank_ifsc_code:{
          type: Sequelize.STRING,
        },
        bank_account_number:{
          type: Sequelize.STRING,
        },
        is_active: {
            type: Sequelize.INTEGER,
            defaultValue: 1
        },
        // created_at: {
        //     type: Sequelize.DATE,
        //     default: Date.now()
        // },
        // updated_at: {
        //     type: Sequelize.DATE,
        //     default: Date.now()
        // },
        // createdAt: {type: Sequelize.DATE, field: 'created_at'},
        // updatedAt: {type: Sequelize.DATE, field: 'updated_at'},
        
    },
   
        
       {
         timestamps: false,
        // timezone: '+5:30'
       })
    
  
    return AgencyDetail
  }
  