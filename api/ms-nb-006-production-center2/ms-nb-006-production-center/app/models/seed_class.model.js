module.exports = (sql, Sequelize) => {
  
    const seedClass = sql.define('m_seed_classes', {
        id: {
          type: Sequelize.INTEGER,
          allowNull:false,
          primaryKey: true,
          autoIncrement: true
        },
        class_name:{
          type: Sequelize.STRING
        },
        class_id:{
          type: Sequelize.STRING,
        },
        type:{
          type: Sequelize.STRING
        },
            
    }, {
        tableName: 'm_seed_classes'
    }
  )
    return seedClass
  }
