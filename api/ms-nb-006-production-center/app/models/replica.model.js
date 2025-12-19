module.exports = (sql, Sequelize) => {

  return sql.define('replica', {
          id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
          },
          no_of_self_plant: {
            type: Sequelize.INTEGER
          },
          no_of_off_type: {
            type: Sequelize.INTEGER
          },
          total_plants_observed: {
            type: Sequelize.INTEGER
          },
          no_of_true_plants: {
            type: Sequelize.INTEGER
          },
          replica_index: {
            type: Sequelize.INTEGER
          },
          bsp_5as_id: {
            type: Sequelize.STRING
          },
          createdAt: {type: Sequelize.DATE, field: 'created_at'},
          updatedAt: {type: Sequelize.DATE, field: 'updated_at'},
        },
        {
          timestamps: false,
        }
    )
  }
