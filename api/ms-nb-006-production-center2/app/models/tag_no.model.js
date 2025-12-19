module.exports = (sql, Sequelize) => {

  return sql.define('lifting_tag_numbers', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            tag_no: {
                type: Sequelize.STRING
            },
            tag_size: {
                type: Sequelize.STRING,
            }, 
            lifting_lot_no_id: {
                type: Sequelize.STRING,
            },

        }, {
            tableName: 'lifting_tag_numbers',            
                // tableName: 'm_variety_lines',
                timestamps: false,
                timezone: '+5:30'
              
        }
    )
    
  }
