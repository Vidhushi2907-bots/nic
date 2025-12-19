module.exports = (sql, Sequelize) => {
    const generateSampleSlipsTests = sql.define('generate_sample_slips_tests', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      test_id: {
        type: Sequelize.INTEGER,
      },
      generate_sample_slip_id: {
        type: Sequelize.INTEGER,
      },
    },
      {
        // tableName: 'm_variety_lines',
        timestamps: false,
        // timezone: '+5:30'
      })
    return generateSampleSlipsTests
  }