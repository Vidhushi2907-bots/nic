module.exports = (sql, Sequelize) => {

    const bspProformaFiveBspcs = sql.define('bsp_proforma_5as', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
       year: {
        type: Sequelize.INTEGER
      },
      crop_code: {
        type: Sequelize.STRING
      },
      season: {
        type: Sequelize.STRING
      },
    
      variety_code: {
        type: Sequelize.STRING
      },
      lot_no : {
        type: Sequelize.STRING
      },
      got_unique_code :{
        type: Sequelize.STRING
      },
      lod_id : {
        type: Sequelize.INTEGER
      },
      consignment_no : {
        type: Sequelize.STRING
      },
      
      got_unique_code:{
        type: Sequelize.STRING
      },
      number_sample_taken:{
        type: Sequelize.INTEGER
      },
      area_shown:{
        type: Sequelize.STRING
      },
      date_of_bsp_2:{
        type: Sequelize.STRING
      },
      date_of_bsp_3:{
        type: Sequelize.STRING
      },
      total_plant_ovserved: {
        type: Sequelize.INTEGER
      },
      self_plant:{
        type: Sequelize.INTEGER
      },
      off_type_plant:{
        type: Sequelize.INTEGER
      },
      true_plant :{
        type: Sequelize.INTEGER
      },
      genetic_purity:{
      type: Sequelize.INTEGER
      },
      bspc_id: {
        type: Sequelize.INTEGER,
      },
    
      createdAt: { type: Sequelize.DATE, field: 'created_at' },
      updatedAt: { type: Sequelize.DATE, field: 'updated_at' },
    },
      {
        timestamps: false,
        // timezone: '+5:30'
      }
    )
    return bspProformaFiveBspcs
  }
  