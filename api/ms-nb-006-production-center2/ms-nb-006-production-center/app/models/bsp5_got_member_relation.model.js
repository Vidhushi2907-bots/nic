module.exports = (sql, Sequelize) => {

  return sql.define('bsp5_got_member_relation', {
          id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
          },
          bsp_5as_id: {
            type: Sequelize.INTEGER
          },
          got_member_id: {
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
