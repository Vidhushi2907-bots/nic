module.exports = (sql, Sequelize) => {

  const AgencyDetail = sql.define('m_user_type', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    code: {
      type: Sequelize.STRING,
    },
    name: {
      type: Sequelize.STRING,
    },

    is_active: {
      type: Sequelize.INTEGER,
      defaultValue: 1
    },
    // created_at: {
    //     type: Sequelize.DATE,
    //     default: Date.now()
    // },
    // updated_at: {
    //     type: Sequelize.DATE,
    //     default: Date.now()
    // },
    // createdAt: {type: Sequelize.DATE, field: 'created_at'},
    // updatedAt: {type: Sequelize.DATE, field: 'updated_at'},

  },


    {
      timestamps: false,
      // timezone: '+5:30'
    })


  return AgencyDetail
}
