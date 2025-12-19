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
    report_ref_no: {
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
    crop_condition: {
      type: Sequelize.STRING
    },
    inspection_date: {
      type: Sequelize.DATE
    },
    date_of_harvesting: {
      type: Sequelize.DATE
    },
    harv_to_date: {
      type: Sequelize.DATE
    },
    area_reduce_reason: {
      type: Sequelize.STRING
    },
    rejected_area: {
      type: Sequelize.INTEGER
    },
    area_shown: {
      type: Sequelize.INTEGER
    },
    longitude: {
      type: Sequelize.STRING
    },
    latitude: {
      type: Sequelize.STRING
    },
    inspected_area:{
      type: Sequelize.DOUBLE
    },
    field_img:{
      type: Sequelize.JSONB
    },
    is_variefy:{
      type: Sequelize.INTEGER
    },
    date_of_showing:{
      type: Sequelize.DATE
    },
    expected_production:{
      type: Sequelize.INTEGER
    },
    reason:{
      type: Sequelize.STRING
    },
    report_ref_no:{
      type: Sequelize.STRING
    }
  },
    {
      timestamps: false,
    })
}
