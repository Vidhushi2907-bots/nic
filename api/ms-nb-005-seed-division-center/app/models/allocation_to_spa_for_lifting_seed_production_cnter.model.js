module.exports = (sql, Sequelize) => {
    const allocationToSPAProductionCenterSeed = sql.define('allocation_to_spa_for_lifting_seed_production_cnters', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        qty: {
            type: Sequelize.DECIMAL
        },
        quantity_left_for_allocation: {
            type: Sequelize.DECIMAL
        },
        allocated_quantity: {
            type: Sequelize.DECIMAL
        },
        allocation_to_spa_for_lifting_seed_id: {
            type: Sequelize.INTEGER
        },
        spa_code: {
            type: Sequelize.STRING
        },
        state_code: {
            type: Sequelize.STRING
        },
        production_center_id: {
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
        indent_qty: {
            // default: Date.now(),
            type: Sequelize.INTEGER
        },
        updatedAt: { field: 'updated_at', type: Sequelize.DATE },
        createdAt: { field: 'created_at', type: Sequelize.DATE },
    }, {
        timestamps: false,
        // timezone: '+5:30'
    });
    return allocationToSPAProductionCenterSeed;
};