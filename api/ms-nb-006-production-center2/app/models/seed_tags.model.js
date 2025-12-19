module.exports = (sql, Sequelize) => {

    const seedTags = sql.define('seed_tags', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      bag_size: {
        type: Sequelize.INTEGER
      },
      is_active: {
        type: Sequelize.INTEGER,
        // defaultValue: 1
      },
      no_of_bags: {
        type: Sequelize.INTEGER,
      },
      seed_tag_details_id:{
        type: Sequelize.INTEGER,        
      },
      tag_no:{
        type: Sequelize.STRING
      },
      seed_tag_range_id:{
        type: Sequelize.INTEGER,        
      },
    },
      {
        timestamps: false,
        // timezone: '+5:30'
      })
    return seedTags
  }
  