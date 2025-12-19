module.exports = (sql, Sequelize) => {

    const montoringTeamPdpcDetails = sql.define('monitoring_team_of_pdpc_details', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
   
      agency_type_id: {
        type: Sequelize.INTEGER,
      },
   
      desination_id: {
        type: Sequelize.INTEGER,
      },
      district_code: {
        type: Sequelize.STRING,
      },
      monitoring_team_of_pdpc_id: {
        type: Sequelize.INTEGER,
      },
      
      state_code: {
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
      timezone: '+5:30'
    }
     )
    return montoringTeamPdpcDetails
  }
  