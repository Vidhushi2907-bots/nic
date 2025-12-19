module.exports = (sql, Sequelize) => {

    return sql.define('off_type_observation', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            off_type_plant: {
                type: Sequelize.INTEGER
            },
            reason: {
                type: Sequelize.TEXT
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
