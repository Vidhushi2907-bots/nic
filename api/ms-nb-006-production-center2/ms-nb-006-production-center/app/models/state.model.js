module.exports = (sql, Sequelize) => {
  
  const State = sql.define('m_states', {
      id: {
        type: Sequelize.INTEGER,
        allowNull:false,
        primaryKey: true,
        autoIncrement: true
      },
      // name:{
      //   type: Sequelize.STRING
      // },
      state_name:{
        type: Sequelize.STRING
      },
      state_code:{
        type: Sequelize.INTEGER,
      }
      
  },
 
      // product_name: {
      //   type: Sequelize.STRING
      // },
      // type: {
      //   type: Sequelize.INTEGER
      // },
      // category: {
      //   type: Sequelize.INTEGER
      // },
      // condition: {
      //   type: Sequelize.STRING
      // },
      // dosage: {
      //   type: Sequelize.STRING(100)
      // },
      // crop_desc: {
      //   type: Sequelize.STRING
      // },
      // chemical_name: {
      //   type: Sequelize.STRING
      // },
      // used_outside:{
      //   type: Sequelize.BOOLEAN
      // },
      // trial_institute:{
      //   type: Sequelize.STRING
      // },
      // method:{
      //   type: Sequelize.INTEGER
      // },
      // status:{
      //   type: Sequelize.STRING
      // },
      // crop_name:{
      //   type: Sequelize.STRING
      // },
      // crop_type:{
      //   type: Sequelize.STRING(100)
      // },
  
//	{ freezeTableName: true},
     {
       timestamps: false,
      // timezone: '+5:30'
     })
  // Product.associate= model =>{
  //   Product.hasMany(model.Specification,{
  //     onDelete:'cascade'
  //   })
  //   Product.hasMany(model.Trials,{
  //     onDelete:'cascade'
  //   })
  // }
  //  Product.sync({ alter: true });

  return State
}
