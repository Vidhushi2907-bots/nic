module.exports = (sql, Sequelize) => {

return sql.define('bsp_proforma_2_seed', {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
        },
        bsp_proforma_2_id: {
          type: Sequelize.INTEGER
        },
        seed_class_id: {
          type: Sequelize.INTEGER
        },
        lot_number: {
          type: Sequelize.STRING
        },
        quantity_sown: {
          type: Sequelize.DOUBLE
        },
        season: {
          type: Sequelize.STRING
        },
        stage_id: {
          type: Sequelize.INTEGER
        },
        tag_id: {
          type: Sequelize.INTEGER
        },
        lot_id: {
          type: Sequelize.INTEGER
        },
        tag_range: {
          type: Sequelize.STRING,
        },
        year: {
          type: Sequelize.INTEGER
        },
        variety_line_code: {
          type: Sequelize.STRING
        }
      },
      {
        timestamps: false,
        // timezone: '+5:30'
      })
}
