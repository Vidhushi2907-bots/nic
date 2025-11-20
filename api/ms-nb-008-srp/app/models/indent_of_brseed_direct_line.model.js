module.exports = (sql, Sequelize) => {
    const VarietyCategory = sql.define('indent_of_brseed_direct_line', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      indent_of_breederseed_direct_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      quantity: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      variety_code_line: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },
      {
        timestamps: false,
        tableName: 'indent_of_brseed_direct_line',
        // timezone: '+5:30'
      }
    )
    return VarietyCategory
  }