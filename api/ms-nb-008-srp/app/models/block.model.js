module.exports = (sql, Sequelize) => {

    const block = sql.define('block', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      district_code: {
        type: Sequelize.INTEGER,
      },
      block_code: {
        type: Sequelize.INTEGER,
      },
      block_name: {
        type: Sequelize.STRING,
      },
      created_at: {
        type: Sequelize.DATE,
        default: Date.now()
      },
      updated_at: {
        type: Sequelize.DATE,
        default: Date.now()
      },
      createdAt: { type: Sequelize.DATE, field: 'created_at' },
      updatedAt: { type: Sequelize.DATE, field: 'updated_at' },
    },
      
    {
        timestamps: false,
        // timezone: '+5:30'
      }
    
      
    )
    return block
  }
  