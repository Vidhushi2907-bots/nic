module.exports = (sql, Sequelize) => {

return sql.define('bsp_proforma_2s', {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
        },
        address: {
          type: Sequelize.STRING
        },
        area_shown: {
          type: Sequelize.DOUBLE
        },
        crop_code: {
          type: Sequelize.STRING
        },
        date_of_showing: {
          type: Sequelize.DATE
        },
        district_code: {
          type: Sequelize.INTEGER
        },
        expected_harvest_from: {
          type: Sequelize.DATE
        },
        expected_harvest_to: {
          type: Sequelize.DATE
        },
        expected_inspection_from: {
          type: Sequelize.DATE
        },
        expected_inspection_to: {
          type: Sequelize.DATE
        },
        expected_production: {
          type: Sequelize.DOUBLE
        },
        field_code: {
          type: Sequelize.STRING
        },
        ref_no: {
          type: Sequelize.STRING
        },
        is_active: {
          type: Sequelize.INTEGER,
          default: 1
        },
        is_freezed: {
          type: Sequelize.INTEGER,
          default: 0
        },
        is_inspected: {
          type: Sequelize.BOOLEAN,
          default: false
        },
        quantity_of_bs_shown: {
          type: Sequelize.DOUBLE,
        },
        quantity_of_ns_shown: {
          type: Sequelize.DOUBLE,
        },
        season: {
          type: Sequelize.STRING,
        },
        user_id: {
          type: Sequelize.INTEGER
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
        req_data: {
          type: Sequelize.JSON,
        },
        plot_no: {
          type: Sequelize.INTEGER,
        },
        variety_line_code: {
          type: Sequelize.STRING,
        },
        class_of_seed_sown: {
          type: Sequelize.STRING,
        },
        qty_of_seed_sown: {
          type: Sequelize.STRING,
        },
        ref_number: {
          type: Sequelize.STRING,
        },
        production_type: {
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
        
        createdAt: {type: Sequelize.DATE, field: 'created_at'},
        updatedAt: {type: Sequelize.DATE, field: 'updated_at'},

      },
      {
        timestamps: false,
        // timezone: '+5:30'
      })
}
