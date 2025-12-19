module.exports = (sql, Sequelize) => {

  return sql.define('lifting_lot_numbers', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            lot_no: {
                type: Sequelize.STRING
            },
            lifting_details_id: {
                type: Sequelize.STRING,
            }, 

        }, {
            tableName: 'lifting_lot_numbers',            
                // tableName: 'm_variety_lines',
                timestamps: false,
                timezone: '+5:30'
              
        }
    )
    
  }
