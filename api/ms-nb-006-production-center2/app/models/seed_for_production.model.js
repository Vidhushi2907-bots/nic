module.exports = (sql, Sequelize) => {

  const seedForProduction = sql.define('seed_for_productions', {
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
    is_active: {
      type: Sequelize.INTEGER,
    },
    willing_to_produce: {
      type: Sequelize.INTEGER,
    },
    variety_code: {
      type: Sequelize.STRING,
    },
    nucleus_seed_to_use: {
      type: Sequelize.INTEGER,
    },
    breeder_seed_to_use: {
      type: Sequelize.INTEGER,
    },
    nucleus_seed_available_qnt:{
      type: Sequelize.INTEGER,
    },
    breeder_seed_available_qnt:{
      type: Sequelize.INTEGER,
    },
    direct_indent_qnt:{
      type: Sequelize.INTEGER,
    },
    comment_id: {
      type: Sequelize.INTEGER,
    },
    season: {
      type: Sequelize.STRING,
    },
    comment_id: {
      type: Sequelize.INTEGER,
    },
    user_id: {
      type: Sequelize.INTEGER,
    },
    is_final_submitted: {
      type: Sequelize.INTEGER,
    },
    line_variety_code:{
      type: Sequelize.STRING,
    },
    variety_line_code:{
      type: Sequelize.STRING,
    },
    reason_for_delay:{
      type: Sequelize.STRING,
    },
    production_delay: {
      type: Sequelize.INTEGER,
    },
    production_type:{
      type: Sequelize.STRING,
    },
    expected_date: {
      type: Sequelize.DATE,
    },
  
    created_at: {
      type: Sequelize.DATE,
      default: Date.now()
    },
    updated_at: {
      type: Sequelize.DATE,
      default: Date.now()
    },
    createdAt: { type: Sequelize.DATE, field: 'created_at' },
    updatedAt: { type: Sequelize.DATE, field: 'updated_at' },
  },
    {
      // tableName:'seed_for_productions',
      // timestamps: false,
      timezone: '+5:30'
    }
  )
  return seedForProduction
}
