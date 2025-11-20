module.exports = (sql, Sequelize) => {

  const plantDetail = sql.define('plant_details', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    created_by: {
      type: Sequelize.INTEGER
    },
    updated_by: {
      type: Sequelize.INTEGER
    },
    plant_name: {
      type: Sequelize.STRING,
    },
    category: {
      type: Sequelize.STRING
    },
    state_id: {
      type: Sequelize.INTEGER,
    },
    district_id: {
      type: Sequelize.INTEGER,
    },
    user_id: {
      type: Sequelize.INTEGER,
    },
    short_name: {
      type: Sequelize.STRING,
    },
    address: {
      type: Sequelize.STRING,
    },
    name_of_spa: {
      type: Sequelize.STRING,
    },
    contact_person_name: {
      type: Sequelize.STRING,
    },
    contact_person_mobile: {
      type: Sequelize.STRING,
    },
    contact_person_designation_id: {
      type: Sequelize.INTEGER,
    },
    mobile_number: {
      type: Sequelize.INTEGER,
    },
    email: {
      type: Sequelize.STRING,
    },
    phone_number: {
      type: Sequelize.INTEGER,
    },
    pincode: {
      type: Sequelize.INTEGER,
    },
    fax_no: {
      type: Sequelize.INTEGER,
    },
    latitude: {
      type: Sequelize.STRING,
    },
    longitude: {
      type: Sequelize.STRING,
    },
    is_active: {
      type: Sequelize.INTEGER,
      defaultValue: 1
    },
    created_at: {
      type: Sequelize.DATE,
      default: Date.now()
    },
    updated_at: {
      type: Sequelize.DATE,
      default: Date.now()
    },
    code: {
      type: Sequelize.STRING,
      
    },
    createdAt: { type: Sequelize.DATE, field: 'created_at' },
    updatedAt: { type: Sequelize.DATE, field: 'updated_at' },

  },
    {
      timestamps: true,
      timezone: '+5:30'
    })
  return plantDetail
}
