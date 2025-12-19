module.exports = (sql, Sequelize) => {

  return sql.define('bsp_proforma_5as_response', {
          id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
          },
          res_data: {
            type: Sequelize.JSON
          },
          bsp_5as_id: {
            type: Sequelize.INTEGER
          },
          createdAt: {type: Sequelize.DATE, field: 'created_at'},
          updatedAt: {type: Sequelize.DATE, field: 'updated_at'},
        },
        {
          timestamps: false,
        }
    )
  }
