// module.exports = (sql, Sequelize) => {

//     const seedInventoryTags = sql.define('seed_inventries_tags', {
//       id: {
//         type: Sequelize.INTEGER,
//         allowNull: false,
//         primaryKey: true,
//         autoIncrement: true
//       },
//       bag_size: {
//         type: Sequelize.INTEGER,
//       },
      
//       lot_number: {
//         type: Sequelize.INTEGER
//       },
//       number_of_tag: {
//         type: Sequelize.INTEGER,
//       },
//       quantity_remaining:{
//         type: Sequelize.INTEGER,
//       },
//       quantity: {
//         type: Sequelize.INTEGER
//       },
//       quantity_used: {
//         type: Sequelize.INTEGER
//       },
//       seed_inventry_id: {
//         type: Sequelize.INTEGER,
//         allowNull: true,
//       },
     
     
//       tag_range: {
//         type: Sequelize.STRING,
//         allowNull: true,
//       },
     
//     },
//     {
//       timestamps: false,
//       timezone: '+5:30'
//     }
//     )
//     return seedInventoryTags
//   }
module.exports = (sql, Sequelize) => {
  const seedInventoryTags = sql.define('seed_inventries_tags', {
      id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
      },
      bag_size: {
          type: Sequelize.INTEGER,
      },
      lot_number: {
          type: Sequelize.INTEGER
      },
      number_of_tag: {
          type: Sequelize.INTEGER,
      },
      quantity_remaining: {
          type: Sequelize.INTEGER,
      },
      quantity: {
          type: Sequelize.INTEGER
      },
      quantity_used: {
          type: Sequelize.INTEGER
      },
      seed_inventry_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
      },
      tag_range: {
          type: Sequelize.STRING,
          allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    }, {
      timestamps: true, // Enables automatic handling of createdAt & updatedAt
      underscored: true, // Ensures snake_case naming (created_at, updated_at)
      tableName: 'seed_inventries_tags'
    }); 

  return seedInventoryTags;
};


