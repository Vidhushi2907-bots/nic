module.exports = (sql, Sequelize) => {

  const receiptPayMent = sql.define('receipt_requests', {
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
    
    variety_code: {
      type: Sequelize.STRING,
    },
    variety_line_code: {
      type: Sequelize.STRING,
    },
    transaction_number: {
      type: Sequelize.STRING,
    },
    state_code: {
      type: Sequelize.INTEGER,
    },
    spa_code: {
      type: Sequelize.STRING,
      defaultValue: 1
    },
    payment_status:{
      type: Sequelize.STRING,
    },
    payment_request:{
    type: Sequelize.STRING,
    },
      payment_method:{
    type: Sequelize.STRING,
    },
      invoice_amount:{
    type: Sequelize.INTEGER,
    },  
     indenter_id:{
    type: Sequelize.INTEGER,
    },
    available_breederseed_as_per_invoice:{
    type: Sequelize.INTEGER,
    },
    amount_paid:{
    type: Sequelize.INTEGER,
    },
    bspc_id:{
      type: Sequelize.INTEGER,
    },
    allocation_spa_id:{
      type: Sequelize.INTEGER,
    },
    sector:{
      type: Sequelize.STRING,
    },
    amount:{
      type: Sequelize.INTEGER,
    },
  },
    {
      timestamps: false,
      timezone: '+5:30'
    })
  return receiptPayMent
}
