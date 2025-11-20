module.exports = (sql, Sequelize) => {
  const availibiltyOfBreederSeed = sql.define('availability_of_breeder_seed', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    allocate_qty: {
      type: Sequelize.INTEGER,
    },
    breeder_see_qty: {
      type: Sequelize.INTEGER,
    },
    carry_over_qty: {
      type: Sequelize.INTEGER,
    },
    crop_code: {
      type: Sequelize.STRING,
    },
    is_final_submit: {
      type: Sequelize.INTEGER,
    },
    save_as_draft: {
      type: Sequelize.INTEGER,
    },
   season:{
type: Sequelize.STRING,
  },
    target_qty_direcy: {
      type: Sequelize.INTEGER,
    },
      target_qty_national: {
      type: Sequelize.INTEGER,
    },
     total_breeder_seed_qty: {
      type: Sequelize.INTEGER,
    },
      variety_code: {
      type: Sequelize.STRING,
    },
    variety_line_code:{
     type: Sequelize.STRING,
    },
    year:{
    type: Sequelize.INTEGER,
    },
    user_id:{
      type: Sequelize.INTEGER,
    },
    },
    {
      timestamps: false,
      tableName: 'availability_of_breeder_seed',
      // timezone: '+5:30'
    }
  )
  return availibiltyOfBreederSeed
}
