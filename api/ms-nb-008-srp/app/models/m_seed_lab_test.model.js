module.exports = (sql, Sequelize) => {

  return sql.define('m_seed_test_laboratories', {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
        },
        lab_name: {
          type: Sequelize.STRING,
        },
        designation: {
          type: Sequelize.STRING,
        },
        designation_id: {
          type: Sequelize.INTEGER,
        },
        address: {
          type: Sequelize.STRING,
        },
        state_id: {
          type: Sequelize.INTEGER,
        },
        district_id: {
          type: Sequelize.INTEGER,
        },
        user_id: {
          type: Sequelize.STRING,
        },
        created_by: {
          type: Sequelize.STRING,
        },
        updated_by: {
          type: Sequelize.STRING,
        },
        short_name: {
          type: Sequelize.STRING,
        },
        mobile_number: {
          type: Sequelize.STRING,
        },
        phone_number: {
          type: Sequelize.STRING,
        },
        report_recieving_date: {
          type: Sequelize.STRING,
        },
        fax_number: {
          type: Sequelize.STRING,
        },
        email: {
          type: Sequelize.STRING,
        },
        latitude: {
          type: Sequelize.STRING,
        },
        longitude: {
          type: Sequelize.STRING,
        },
        contact_person_name: {
          type: Sequelize.STRING,
        },
        is_active: {
          type: Sequelize.INTEGER,
          default: 1
        },
        type: {
          type: Sequelize.STRING
        },
        lab_code: {
          type: Sequelize.STRING
        },
        stl_name: {
          type: Sequelize.STRING
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
        timezone: '+5:30'
      })
}
