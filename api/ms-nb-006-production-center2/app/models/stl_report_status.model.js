module.exports = (sql, Sequelize) => {
  const stlReportStatus = sql.define('stl_report_status', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    year: {
      type: Sequelize.INTEGER,
    },
    season: {
      type: Sequelize.STRING,
    },
    crop_code: {
      type: Sequelize.STRING,
    },
    variety_code: {
      type: Sequelize.STRING,
    },
    unique_code: {
      type: Sequelize.STRING,
    },
    total_processed_qnt: {
      type: Sequelize.STRING,
    },
    testing_lab: {
      type: Sequelize.STRING,
    },
    stack_no: {
      type: Sequelize.STRING,
    },
    sample_no: {
      type: Sequelize.STRING,
    },
    no_of_bags: {
      type: Sequelize.STRING,
    },
    lot_no: {
      type: Sequelize.STRING,
    },
    godown_no: {
      type: Sequelize.INTEGER,
    },
    class_of_seed: {
      type: Sequelize.STRING,
    },
    chemical_treatment: {
      type: Sequelize.STRING,
    },
    user_id: {
      type: Sequelize.INTEGER,
    },
    lot_id: {
      type: Sequelize.INTEGER,
    },
    variety_code_line: {
      type: Sequelize.STRING,
    },
    pure_seed: {
      type: Sequelize.INTEGER,
    },
    inert_matter: {
      type: Sequelize.INTEGER,
    },
    weed_seed_purity: {
      type: Sequelize.INTEGER,
    },
    other_crop_purity: {
      type: Sequelize.INTEGER,
    },
    weed_seed: {
      type: Sequelize.INTEGER,
    },
    other_seed: {
      type: Sequelize.INTEGER,
    },
    other_crop_seed: {
      type: Sequelize.INTEGER,
    },
    normal_seeding: {
      type: Sequelize.INTEGER,
    },
    abnormal_seeding: {
      type: Sequelize.INTEGER,
    },
    dead_seed: {
      type: Sequelize.INTEGER,
    },
    hard_seed: {
      type: Sequelize.INTEGER,
    },
    fresh_ungerminated: {
      type: Sequelize.INTEGER,
    },
    other_distinguisable_varieties: {
      type: Sequelize.INTEGER,
    },
    insect_damage: {
      type: Sequelize.INTEGER,
    },
    nematode: {
      type: Sequelize.INTEGER,
    },
    husk: {
      type: Sequelize.INTEGER,
    },
    status: {
      type: Sequelize.STRING,
    },
    germination:{
      type: Sequelize.INTEGER,
    },
    date_of_test:{
      type: Sequelize.STRING,
    },
    m: {
      type: Sequelize.STRING,
    },
    testing_lab: {
      type: Sequelize.STRING,
    }
  },
    {
      // tableName: 'm_variety_lines',
      timestamps: false,
      tableName: 'stl_report_status',
      // timezone: '+5:30'
    })
  return stlReportStatus
}