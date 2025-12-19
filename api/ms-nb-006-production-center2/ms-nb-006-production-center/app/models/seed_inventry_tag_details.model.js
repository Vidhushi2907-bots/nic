module.exports = (sql, Sequelize) => {

    const seedInventoryTagsDetails = sql.define('seed_inventry_tag_details', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      is_used: {
        type: Sequelize.INTEGER,
      },
     
      
      seed_inventry_tag_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
     
     
      tag_number: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      temp_used: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      weight: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      weight_used: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      weight_remaining: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
     
    },
      {
        timestamps: false,
        timezone: '+5:30'
      })
    return seedInventoryTagsDetails
  }
  