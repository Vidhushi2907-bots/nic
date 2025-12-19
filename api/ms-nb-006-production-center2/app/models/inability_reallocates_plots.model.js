module.exports = (sql, Sequelize) => {

  const inabilityReallocatesPlots = sql.define('inability_reallocates_plots', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },

    inability_reallocates_id: {
      type: Sequelize.INTEGER
    },
    plot: {
      type: Sequelize.STRING,
    },
    reports: {
      type: Sequelize.STRING
    },
    expected_production: {
      type: Sequelize.INTEGER,
    },
    estimated_production: {
      type: Sequelize.INTEGER,
    },
    crop_failure: {
      type: Sequelize.INTEGER,
    },
    dificit_qnt: {
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
  return inabilityReallocatesPlots
}
