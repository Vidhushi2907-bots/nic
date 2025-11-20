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
    // breeder_production_centre_name: {
    //   type: Sequelize.STRING
    // },
    nucleus_availability_id: {
      type: Sequelize.INTEGER
    },
    date_of_reference: {
      type: Sequelize.DATE,
    },
    // contact_officer_designation: {
    //   type: Sequelize.DATE,
    // },
    // contact_officer_name: {
    //   type: Sequelize.STRING
    // },
    date_of_reference: {
      type: Sequelize.DATE
    },
    quantity: {
      type: Sequelize.INTEGER
    },
    officer_order_date: {
      type: Sequelize.DATE
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
    user_id: {
      type: Sequelize.INTEGER
    },
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
    updated_at: {
      type: Sequelize.DATE
    },
    created_at: {
      type: Sequelize.DATE
    },
  },
    {
      timestamps: false,
      timezone: '+5:30'
    })
  return NucleusSeedAvailabity
}
