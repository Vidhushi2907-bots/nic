module.exports = (sql, Sequelize) => {
    const BSP1ProductionCenter = sql.define('bsp1_production_centers', {
        id: {
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
            type: Sequelize.INTEGER
        },
        bsp_1_id: {
            type: Sequelize.INTEGER
        },
        production_center_id: {
            type: Sequelize.INTEGER
        },
        quantity_of_seed_produced: {
            type: Sequelize.STRING
        },
        members: {
            type: Sequelize.INTEGER
        },
        created_at: {
            default: Date.now(),
            type: Sequelize.DATE
        },
        updated_at: {
            default: Date.now(),
            type: Sequelize.DATE
        },
        updatedAt: { field: 'updated_at', type: Sequelize.DATE },
        createdAt: { field: 'created_at', type: Sequelize.DATE },
    }, {
        timestamps: false,
        // timezone: '+5:30'
    });
    return BSP1ProductionCenter;
};
