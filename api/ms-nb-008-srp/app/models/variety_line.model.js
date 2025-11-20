module.exports = (sql, Sequelize) => {

  return sql.define('m_variety_lines', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            line_variety_name: {
                type: Sequelize.STRING
            },
            variety_code: {
                type: Sequelize.STRING,
            },
            line: {
                type: Sequelize.STRING
            },
            line_variety_code: {
                type: Sequelize.STRING
            },

        }, {
            tableName: 'm_variety_lines',            
                // tableName: 'm_variety_lines',
                timestamps: false,
                timezone: '+5:30'
              
        }
    )
    
  }
