module.exports = (sql, Sequelize) => {

return sql.define('bsp_proforma_3s', {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
        },
        bsp_proforma_2_id: {
          type: Sequelize.INTEGER
        },
        comment_id: {
          type: Sequelize.INTEGER
        },
        crop_code: {
          type: Sequelize.STRING
        },
        estimated_production: {
          type: Sequelize.DOUBLE
        },
        is_freezed: {
          type: Sequelize.INTEGER,
          default: 0
        },
        monitoring_team_of_id: {
          type: Sequelize.INTEGER
        },
        report: {
          type: Sequelize.STRING
        },
        season: {
          type: Sequelize.STRING
        },
        status: {
          type: Sequelize.STRING
        },
        variety_code: {
          type: Sequelize.STRING
        },
        year: {
          type: Sequelize.INTEGER,
        },
        ref_no: {
            type: Sequelize.STRING
        },
        variety_line_code: {
            type: Sequelize.STRING,
        },
      },
      {
        timestamps: false,
      })
}
