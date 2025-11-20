module.exports = (sql, Sequelize) => {

  const DeleteIndenteOfIndenter = sql.define('deleted_indent_of_indenters', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    // year: {
    //   type: Sequelize.INTEGER
    // },
    // season: {
    //   type: Sequelize.INTEGER,
    // },
   
    // crop_type: {
    //   type: Sequelize.STRING,
    // },
    indent_of_breederseed_id: {
      type: Sequelize.INTEGER,
    },
    
    // spa_code: {
    //   type: Sequelize.STRING,
    // },
    user_id: {
      type: Sequelize.INTEGER,
    },
    indented_data:{
      type: Sequelize.STRING,
      allowNull:false,
    },
  //   variety_id: {
  //     type: Sequelize.INTEGER,
  //   },
  //   variety_code: {
  //     type: Sequelize.INTEGER,
  //   },
  //   variety_notification_year: {
  //     type: Sequelize.STRING,
  //   },
  //   indent_quantity: {
  //     type: Sequelize.STRING
  //   },
  //   unit: {
  //     type: Sequelize.STRING
  //   },
  //   indente_breederseed_id: {
  //     type: Sequelize.INTEGER
  //   },
  //   indenter_id: {
  //     type: Sequelize.INTEGER
  //   },
  //   is_active: {
  //     type: Sequelize.INTEGER
  //   },
  //   is_freeze: {
  //     type: Sequelize.INTEGER,
  //     defaultValue: 0
  // },
  //   user_id: {
  //     type: Sequelize.INTEGER
  //   },
    createdAt: { type: Sequelize.DATE, field: 'created_at', default: Date.now() },
    updatedAt: { type: Sequelize.DATE, field: 'updated_at', default: Date.now() },
  },

    {
      freezeTableName: true
      // timezone: '+5:30'
    })

  return DeleteIndenteOfIndenter;
};
