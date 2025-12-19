module.exports = (sql, Sequelize) => {
  const recieptGenerates = sql.define('receipt_generates', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
      cgst: {
      type: Sequelize.INTEGER,
    },
      created_at: {
      type: Sequelize.DATE(),
    },
    
     igst: {
      type: Sequelize.INTEGER,
    },
    is_active:{
     type: Sequelize.INTEGER,
    },
    seed_amount_gst: {
      type: Sequelize.INTEGER,
     },
 
    reciept_request_id:{
     type: Sequelize.INTEGER,
    },
     total_amount:{
       type: Sequelize.INTEGER,
     },
     total_bag:{
     type: Sequelize.INTEGER,
     },
     updated_at:{
     type: Sequelize.DATE(),
     },
      user_id:{
     type: Sequelize.INTEGER,
     },  
     mou_amount:{
      type: Sequelize.INTEGER,
     },
     mou_gst:{
      type: Sequelize.INTEGER,
     },
     mou_total_amount:{
      type: Sequelize.INTEGER,
     },
     licence_amount:{
      type: Sequelize.INTEGER,
     },
     licence_gst:{
      type: Sequelize.INTEGER,
     },
     licence_total_amount:{
      type: Sequelize.INTEGER,
     },
     ppv_amount:{
      type: Sequelize.INTEGER,
     },
     ppv_gst:{
      type: Sequelize.INTEGER,
     },
     ppv_total_amount:{
      type: Sequelize.INTEGER,
     },
     royality_amount:{
      type: Sequelize.INTEGER,
     },
     royality_gst:{
      type: Sequelize.INTEGER,
     },
     royality_total_amount:{
      type: Sequelize.INTEGER,
     },
     receipt_number:{
      type: Sequelize.INTEGER,
     },
     grand_total:{
      type: Sequelize.INTEGER,
     },
    },
    {
      timestamps: false,
      tableName: 'receipt_generates',
      // timezone: '+5:30'
    }
  )
  return recieptGenerates
}
