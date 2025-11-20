module.exports = (sql, Sequelize) => {

    const bspcToPlants = sql.define('bspc_to_plants', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        plant_id: {
            type: Sequelize.INTEGER
        },
        user_id: {
            type: Sequelize.INTEGER
        },
        agency_id: {
            type: Sequelize.INTEGER
        },
        createdAt: { type: Sequelize.DATE, field: 'created_at' },
        updatedAt: { type: Sequelize.DATE, field: 'updated_at' },
    },

        {
            timestamps: false,
        })

    return bspcToPlants
}
