module.exports = (sql, Sequelize) => {
    const bsp1ProductionCenters = sql.define('bsp1_production_center', {
        id: {
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
            type: Sequelize.INTEGER
        },
        bsp_1_id: {
            type: Sequelize.INTEGER
        },
        members: {
            type: Sequelize.STRING
        },
        production_center_id: {
            type: Sequelize.INTEGER
        },
        quantity_of_seed_produced: {
            type: Sequelize.STRING
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
        // tableName: 'bsp_1s'
        // timezone: '+5:30'
    });
    return bsp1ProductionCenters;
};
