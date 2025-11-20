module.exports = (sql, Sequelize) => {

  const Indenter = sql.define('indent_of_breederseeds', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    year: {
      type: Sequelize.INTEGER
    },
    season: {
      type: Sequelize.INTEGER,
    },
    crop_code: {
      type: Sequelize.STRING,
    },
    crop_type: {
      type: Sequelize.STRING,
    },
    crop_name: {
      type: Sequelize.STRING,
    },
    group_name: {
      type: Sequelize.STRING,
    },
    group_code: {
      type: Sequelize.STRING,
    },
    variety_id: {
      type: Sequelize.INTEGER,
    },
    variety_name: {
      type: Sequelize.STRING,
    },
    variety_code: {
      type: Sequelize.STRING,
    },
    variety_notification_year: {
      type: Sequelize.STRING,
    },
    indent_quantity: {
      type: Sequelize.STRING
    },
    unit: {
      type: Sequelize.STRING
    },
    is_active: {
      type: Sequelize.INTEGER
    },
    is_freeze: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    user_id: {
      type: Sequelize.INTEGER
    },
    is_forward:{
      type: Sequelize.INTEGER
    },
    createdAt: { type: Sequelize.DATE, field: 'created_at', default: Date.now() },
    updatedAt: { type: Sequelize.DATE, field: 'updated_at', default: Date.now() },
  },

    {
      freezeTableName: true
      // timezone: '+5:30'
    })

  return Indenter;
};
