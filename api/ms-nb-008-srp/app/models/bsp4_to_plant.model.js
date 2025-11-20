module.exports = (sql, Sequelize) => {

    const bsp4ToPlant = sql.define('bsp4_to_plants', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        year: {
            type: Sequelize.INTEGER
        },
        season: {
            type: Sequelize.STRING
        },
        crop_code: {
            type: Sequelize.STRING
        },
        bsp4_id: {
            type: Sequelize.INTEGER
        },
        variety_id: {
            type: Sequelize.INTEGER
        },
        plant_id: {
            type: Sequelize.INTEGER
        },
        quantity: {
            type: Sequelize.STRING
        },
        user_id: {
            type: Sequelize.INTEGER
        },
        createdAt: { type: Sequelize.DATE, field: 'created_at' },
        updatedAt: { type: Sequelize.DATE, field: 'updated_at' },
    },

        {
            timestamps: false,
        })

    return bsp4ToPlant
}
