module.exports = (sql, Sequelize) => {

    const bspProformaOneBspcs = sql.define('bsp_proforma_1_bspcs', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      bspc_id: {
        type: Sequelize.INTEGER,
      },
      bspc_proforma_1_id: {
        type: Sequelize.INTEGER,
      },
      target_qunatity:{
        type: Sequelize.INTEGER,
      },
      isPermission:{
        type: Sequelize.BOOLEAN,
      },
      production_type:{
        type: Sequelize.STRING,
      },
      // created_at: {
      //   type: Sequelize.DATE,
      //   default: Date.now()
      // },
      // updated_at: {
      //   type: Sequelize.DATE,
      //   default: Date.now()
      // },
      // createdAt: { type: Sequelize.DATE, field: 'created_at' },
      // updatedAt: { type: Sequelize.DATE, field: 'updated_at' },
    },
      {
        timestamps: false,
        // timezone: '+5:30'
      }
    )
    return bspProformaOneBspcs
  }
  