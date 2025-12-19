module.exports = (sql, Sequelize) => {

  const inabilityReallocates = sql.define('inability_reallocates', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    year: {
      type: Sequelize.INTEGER
    },
    season: {
      type: Sequelize.STRING,
    },
    crop_code: {
      type: Sequelize.STRING
    },
    variety_code: {
      type: Sequelize.STRING,
    },
    variety_line_code: {
      type: Sequelize.STRING,
    },
    user_id: {
      type: Sequelize.INTEGER,
    },
    total_dificit: {
      type: Sequelize.INTEGER,
    },
    is_active: {
      type: Sequelize.INTEGER,
    },
    // created_at: {
    //     type: Sequelize.DATE,
    //     default: Date.now()
    // },
    // updated_at: {
    //     type: Sequelize.DATE,
    //     default: Date.now()
    // },
    // createdAt: {type: Sequelize.DATE, field: 'created_at'},
    // updatedAt: {type: Sequelize.DATE, field: 'updated_at'},

  },
    {
      timestamps: false,
      // timezone: '+5:30'
    })
  return inabilityReallocates
}
