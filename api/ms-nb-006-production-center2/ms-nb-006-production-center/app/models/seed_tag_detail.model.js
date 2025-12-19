module.exports = (sql, Sequelize) => {
    const seedTagsDetails = sql.define('seed_tag_details', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
    
       class_of_seed: {
        type: Sequelize.STRING,
      },
       crop_code: {
        type: Sequelize.STRING,
      },
      date_of_test: {
        type: Sequelize.DATE,
      },
      germination: {
        type: Sequelize.INTEGER,
      },
      godown_no: {
        type: Sequelize.INTEGER,
      },
      inert_matter:{
        type: Sequelize.INTEGER,
      },
      is_active:{
        type: Sequelize.INTEGER,
      },
      lot_id:{
        type: Sequelize.INTEGER,
      },
      lot_no:{
        type: Sequelize.STRING,
      },
      lot_qty:{
        type: Sequelize.INTEGER,
      },
      no_of_bags:{
        type: Sequelize.INTEGER,
      },
      pure_seed:{
        type: Sequelize.INTEGER,
      },
      season:{
        type: Sequelize.STRING,
      },
      stack_no:{
        type: Sequelize.STRING,
      },
      user_id:{
        type: Sequelize.INTEGER,
      },

      valid_upto:{
        type: Sequelize.STRING,
      },
      variety_code:{
        type: Sequelize.STRING,
      },
      variety_line_code:{
        type: Sequelize.STRING,
      },
      year:{
        type: Sequelize.INTEGER,
      },
      created_at:{
        type: Sequelize.DATE,
        default: Date.now()
      },
      updated_at:{
        type: Sequelize.DATE,
        default: Date.now()
      },
      is_status:{
        type: Sequelize.INTEGER,
      }
         },
      {
        timestamps: false,
        tableName: 'seed_tag_details',
        // timezone: '+5:30'
      }
    )
    return seedTagsDetails
  }
  