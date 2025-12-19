module.exports = (sql, Sequelize) => {
  const generateCertificate = sql.define('generate_breeder_seed_certificates', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    variety_code: {
      type: Sequelize.STRING,
    },
    indenter_id: {
      type: Sequelize.INTEGER,
    },
    spa_code: {
      type: Sequelize.STRING,
    },
   
    state_code: {
      type: Sequelize.INTEGER,
    },
    lifting_id: {
      type: Sequelize.INTEGER,
    },
    is_active:{
      type: Sequelize.INTEGER,
    },
    status:{
      type: Sequelize.INTEGER,
    },
    is_created:{
      type: Sequelize.DATE,
    },
    
    is_updated:{
    type: Sequelize.DATE,
  },
  lifting_id:{
    type: Sequelize.INTEGER,
  }
},
  {
    timestamps: false,
    tableName: 'generate_breeder_seed_certificates',
    // timezone: '+5:30'
  }
  )
  return generateCertificate
}
