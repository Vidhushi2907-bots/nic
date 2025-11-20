module.exports = (sql, Sequelize) => {

  const IndenteOfSpa = sql.define('indent_of_spas', {
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
   
    crop_type: {
      type: Sequelize.STRING,
    },
    crop_code: {
      type: Sequelize.STRING,
    },
    
    spa_code: {
      type: Sequelize.STRING,
    },
    state_code: {
      type: Sequelize.INTEGER,
    },
    variety_id: {
      type: Sequelize.INTEGER,
    },
    variety_code: {
      type: Sequelize.INTEGER,
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
    indente_breederseed_id: {
      type: Sequelize.INTEGER
    },
    indenter_id: {
      type: Sequelize.INTEGER
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
    createdAt: { type: Sequelize.DATE, field: 'created_at', default: Date.now() },
    updatedAt: { type: Sequelize.DATE, field: 'updated_at', default: Date.now() },
  },

    {
      freezeTableName: true
      // timezone: '+5:30'
    })

  return IndenteOfSpa;
};
