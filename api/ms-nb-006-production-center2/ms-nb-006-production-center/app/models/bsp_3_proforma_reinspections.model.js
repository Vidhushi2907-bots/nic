module.exports = (sql, Sequelize) => {

  return sql.define('bsp_3_proforma_reinspections', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    report: {
      type: Sequelize.STRING
    },
    crop_condition: {
      type: Sequelize.STRING
    },
    date_of_inspection: {
      type: Sequelize.DATE
    },
    report_ref_no: {
      type: Sequelize.STRING
    },

    rejected_area: {
      type: Sequelize.INTEGER
    },
    inspected_area: {
      type: Sequelize.INTEGER
    },
    field_img: {
      type: Sequelize.JSONB
    },
    field_code: {
      type: Sequelize.STRING
    },
    area_shown: {
      type: Sequelize.INTEGER
    },
    bsp3id: {
      type: Sequelize.INTEGER
    },
    // date_of_harvesting: {
    //   type: Sequelize.DATE
    // },
    date_of_showing: {
      type: Sequelize.DATE
    },
    estimated_production: {
      type: Sequelize.INTEGER
    },
    expected_production: {
      type: Sequelize.INTEGER
    },
    // harv_to_date: {
    //   type: Sequelize.DATE
    // },
    inspection_date: {
      type: Sequelize.DATE
    },
    latitude: {
      type: Sequelize.STRING
    },
    longitude: {
      type: Sequelize.STRING
    },
    reason: {
      type: Sequelize.STRING
    },
    rejected_area: {
      type: Sequelize.INTEGER
    },
    report_ref_no:{
      type: Sequelize.STRING
    }
  },
    {
      timestamps: false,
    })
}
