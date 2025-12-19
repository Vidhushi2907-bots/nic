module.exports = (sql, Sequelize) => {

  const NucleusSeedAvailabity = sql.define('nucleus_seed_availabilities', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    is_active: {
      type: Sequelize.INTEGER,
    },
    breeder_production_centre_name: {
      type: Sequelize.STRING
    },
    nucleus_availability_id: {
      type: Sequelize.INTEGER
    },
    date_of_reference: {
      type: Sequelize.DATE,
    },
    contact_officer_designation: {
      type: Sequelize.STRING,
    },
    contact_officer_name: {
      type: Sequelize.STRING
    },
    date_of_reference: {
      type: Sequelize.DATE
    },
    quantity: {
      type: Sequelize.INTEGER
    },
    officer_order_date: {
      type: Sequelize.DATE
    },
    season:{
      type: Sequelize.STRING
    },
    variety_code:{
      type: Sequelize.STRING
    },
    production_center_id: {
      type: Sequelize.INTEGER
    },
    reference_number_officer_order: {
      type: Sequelize.STRING
    },
    refernce_number_moa: {
      type: Sequelize.STRING
    },
    // user_id: {
    //   type: Sequelize.INTEGER
    // },
    crop_code: {
      type: Sequelize.INTEGER
    },
    nucleus_seed_source: {
      type: Sequelize.STRING
    },
    variety_id: {
      type: Sequelize.INTEGER
    },
    year: {
      type: Sequelize.INTEGER
    },
    is_flag: {
      type: Sequelize.INTEGER
    },
    created_at: {
      type: Sequelize.DATE,
      default: Date.now()
    },
    updated_at: {
      type: Sequelize.DATE,
      default: Date.now()
    },
    // createdAt: { type: Sequelize.DATE, field: 'created_at' },
    // updatedAt: { type: Sequelize.DATE, field: 'updated_at' },
  },
    {
      timestamps: false,
      timezone: '+5:30',
      freezeTableName: true
    })
  return NucleusSeedAvailabity
}
