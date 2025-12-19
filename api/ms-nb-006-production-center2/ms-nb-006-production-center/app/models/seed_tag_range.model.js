module.exports = (sql, Sequelize) => {

    const seedTagsRange = sql.define('seed_tag_ranges', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      bag_weight: {
        type: Sequelize.INTEGER
      },
      no_of_bags: {
        type: Sequelize.INTEGER,
        // defaultValue: 1
      },
      seed_tag_details_id: {
        type: Sequelize.INTEGER,
      },
      tag_range:{
        type: Sequelize.STRING,        
      },
      start_range: {
        type: Sequelize.INTEGER,
      },
      end_range: {
        type: Sequelize.INTEGER,
      },
      qty: {
        type: Sequelize.INTEGER,
      },
      year: {
        type: Sequelize.INTEGER,
      },
     
    },
      {
        timestamps: false,
        // timezone: '+5:30'
      })
    return seedTagsRange
  }
  