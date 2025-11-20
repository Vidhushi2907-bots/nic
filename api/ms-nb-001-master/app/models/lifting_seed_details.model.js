module.exports = (sql, Sequelize) => {
  const liftingSeedDetails = sql.define('lifting_seed_details', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    year: {
      type: Sequelize.INTEGER,
    },
    season: {
      type: Sequelize.STRING,
    },
    crop_code: {
      type: Sequelize.STRING,
    },
    variety_code: {
      type: Sequelize.STRING,
    },
    variety_line_code: {
      type: Sequelize.STRING,
    },
    spa_state_code: {
      type: Sequelize.INTEGER,
    },
    spa_code:{
      type: Sequelize.STRING,
    },
    user_id: {
      type: Sequelize.INTEGER,
    },
    reason_id: {
      type: Sequelize.INTEGER,
    },
    per_unit_price:{
      type: Sequelize.INTEGER,
    },
    payment_method_no:{
      type: Sequelize.STRING,
    },
    paid_by:{
      type: Sequelize.STRING,
    },
    created_at: {
      type: Sequelize.DATE,
      default: Date.now()
    },
    updated_at: {
      type: Sequelize.DATE,
      default: Date.now()
    },
    breeder_class:{
      type: Sequelize.STRING,
    }, 
    bag_weight:{
      type: Sequelize.INTEGER,
    },
    no_of_bag:{
      type: Sequelize.INTEGER,
    },
    total_price:{
      type: Sequelize.INTEGER,
    },
    lifting_bill_no:{
      type: Sequelize.STRING,
    },
    indentor_id:{
      type: Sequelize.INTEGER,
    }
  },
    {
      timestamps: false,
      tableName: 'lifting_seed_details',
      // timezone: '+5:30'
    }
  )
  return liftingSeedDetails
}
