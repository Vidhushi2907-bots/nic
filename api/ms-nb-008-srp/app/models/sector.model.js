module.exports = (sql, Sequelize) => {
  
    const Sector = sql.define('sectors', {
        id: {
          type: Sequelize.INTEGER,
          allowNull:false,
          primaryKey: true,
          autoIncrement: true
        },
        name:{
          type: Sequelize.STRING
        },
        central_id:{
          type: Sequelize.INTEGER,
        },
        type:{
          type: Sequelize.STRING
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
    return Sector
  }
  