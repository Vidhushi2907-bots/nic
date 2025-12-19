module.exports = (sql, Sequelize) => {
          const recieptGeneratesBag = sql.define('receipt_generate_bags', {
            id: {
              type: Sequelize.INTEGER,
              allowNull: false,
              primaryKey: true,
              autoIncrement: true
            },
            receipt_generate_id: {
              type: Sequelize.INTEGER,
            },
              created_at: {
              type: Sequelize.DATE(),
            },
            updated_at:{
             type: Sequelize.DATE(),
            },
             is_active:{
              type: Sequelize.INTEGER,
             },               
            bag_size: {
              type: Sequelize.INTEGER,
            },
            number_of_bag:{
             type: Sequelize.INTEGER,
            },
            bag_price:{
             type: Sequelize.INTEGER,
            },
            total_bag_price:{
               type: Sequelize.INTEGER,
             },
            },
            {
              timestamps: false,
              tableName: 'receipt_generate_bags',
              // timezone: '+5:30'
            }
          )
          return recieptGeneratesBag
        }
        