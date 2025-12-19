module.exports = (sql, Sequelize) => {

  return sql.define('self_plant_observation', {
          id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
          },
          self_plant: {
            type: Sequelize.INTEGER
          },
          replica_id: {
            type: Sequelize.INTEGER
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
