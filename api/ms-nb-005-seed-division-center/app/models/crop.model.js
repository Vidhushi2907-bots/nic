// module.exports = (sql, Sequelize) => {
  
//     const Crop = sql.define('m_crop', {
//         id: {
//           type: Sequelize.INTEGER,
//           allowNull:false,
//           primaryKey: true,
//           autoIncrement: true
//         },
//         botanic_name:{
//           type: Sequelize.STRING
//         },
//         crop_code:{
//           type: Sequelize.INTEGER,
//         },
//         crop_group:{
//           type: Sequelize.STRING
//         },
//         crop_name:{
//           type: Sequelize.STRING,
//         },
//         group_code:{
//           type: Sequelize.STRING,
//         },
//         season:{
//           type: Sequelize.STRING,
//         },
//         srr:{
//           type: Sequelize.STRING,
//         },
//         is_active: {
//             type: Sequelize.INTEGER,
//             defaultValue: 1
//         },
//         breeder_id:{
//           type: Sequelize.INTEGER,
//         },
//         created_at: {
//             type: Sequelize.DATE,
//             default: Date.now()
//         },
//         updated_at: {
//             type: Sequelize.DATE,
//             default: Date.now()
//         },
//         hindi_name:{
//           type: Sequelize.STRING,

//         },
//         scientific_name:{
//           type: Sequelize.STRING,
//         },
//         createdAt: {type: Sequelize.DATE, field: 'created_at'},
//         updatedAt: {type: Sequelize.DATE, field: 'updated_at'},
        
//     },
   
        
//        {
//          timestamps: false,
//         // timezone: '+5:30'
//        })
    
  
//     return Crop
//   }
  
module.exports = (sql, Sequelize) => {
  const Crop = sql.define('m_crop', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    botanic_name: {
      type: Sequelize.STRING
    },
    crop_code: {
      type: Sequelize.INTEGER,
    },
    crop_group: {
      type: Sequelize.STRING
    },
    crop_name: {
      type: Sequelize.STRING,
    },
    group_code: {
      type: Sequelize.STRING,
    },
    season: {
      type: Sequelize.STRING,
    },
    srr: {
      type: Sequelize.STRING,
    },
    is_active: {
      type: Sequelize.INTEGER,
      defaultValue: 1
    },
    breeder_id: {
      type: Sequelize.INTEGER,
    },
    hindi_name: {
      type: Sequelize.STRING,
    },
    scientific_name: {
      type: Sequelize.STRING,
    }
  }, {
    timestamps: true, // Enable timestamps, Sequelize will automatically handle createdAt and updatedAt
    createdAt: 'created_at', // Custom name for createdAt
    updatedAt: 'updated_at', // Custom name for updatedAt
    defaultScope: {
      // Automatically set current timestamp for createdAt and updatedAt
      createdAt: Sequelize.NOW,
      updatedAt: Sequelize.NOW
    },
    underscored: true // Ensures that the column names are in snake_case (e.g., created_at, updated_at)
  });

  return Crop;
};

