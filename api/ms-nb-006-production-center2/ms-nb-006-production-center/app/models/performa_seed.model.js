module.exports = (sql, Sequelize) => {

    const TagPerformasSeed = sql.define('tag_performas', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      is_active: {
        type: Sequelize.INTEGER,
        default: 1
      },
      year_of_indent: {
        type: Sequelize.INTEGER,
      
      },
      season: {
        type: Sequelize.STRING,
      
      },

      crop_code: {
        type: Sequelize.STRING,
      },
      group_code: {
        type: Sequelize.STRING,
      },
      germination: {
        type: Sequelize.STRING
      },
      inert_matter: {
        type: Sequelize.STRING,
      },
      label_number: {
        type: Sequelize.INTEGER,
      },
      lot_number: {
        type: Sequelize.STRING
      },
      net_weight: {
        type: Sequelize.INTEGER
      },
      pure_seed: {
        type: Sequelize.INTEGER
      },
      test_date: {
        type: Sequelize.DATE
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      variety_id: {
        type: Sequelize.INTEGER
      },
      valid_upto:{
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
      // createdAt: { type: Sequelize.DATE, field: 'created_at' },
      // updatedAt: { type: Sequelize.DATE, field: 'updated_at' },
    },
      {
        timestamps: false,
        timezone: '+5:30',
        freezeTableName: true
      })
    return TagPerformasSeed
  }
