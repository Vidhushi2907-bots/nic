module.exports = (sql, Sequelize) => {

    const mCropGroup = sql.define('m_crop_groups', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      group_name: {
        type: Sequelize.STRING
      },
      group_code: {
        type: Sequelize.STRING
      },
      is_active: {
        type: Sequelize.INTEGER
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
  
  
    return mCropGroup
  }
  