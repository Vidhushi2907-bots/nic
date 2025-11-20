module.exports = (sql, Sequelize) => {

    const bspPerformaOne = sql.define('bsp_proforma_1s', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      crop_code: {
        type: Sequelize.STRING
      },
      variety_code: {
        type: Sequelize.STRING
      },
      season: {
        type: Sequelize.STRING
      },
      year: {
        type: Sequelize.INTEGER
      },
      is_final_submit:{
        type: Sequelize.INTEGER
      },
      is_freezed:{
        type: Sequelize.INTEGER
      },
      is_active: {
        type: Sequelize.INTEGER
      },
      user_id:{
        type: Sequelize.INTEGER
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
      })
  
  
    return bspPerformaOne
  }
  