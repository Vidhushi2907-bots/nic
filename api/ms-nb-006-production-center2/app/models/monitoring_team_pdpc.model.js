module.exports = (sql, Sequelize) => {

    const montoringTeamPdpc = sql.define('monitoring_team_of_pdpcs', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
   
      crop_code: {
        type: Sequelize.STRING,
      },
      is_active:{
        type: Sequelize.INTEGER,
        default: 1
      },
      name: {
        type: Sequelize.STRING,
      },
      season: {
        type: Sequelize.STRING,
      },
      user_id: {
        type: Sequelize.INTEGER,
      },
      state_code: {
        type: Sequelize.INTEGER,
      },
      variety_code: {
        type: Sequelize.STRING,
      },
      year: {
        type: Sequelize.INTEGER,
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
        timezone: '+5:30'
      })
    return montoringTeamPdpc
  }
  