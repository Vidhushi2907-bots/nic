module.exports = (sql, Sequelize) => {
    const Bsp6 = sql.define('bsp_6', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        year: {
            type: Sequelize.INTEGER
        },
        crop_code: {
            type: Sequelize.INTEGER
        },
        crop_group_code: {
            type: Sequelize.STRING,
        },
        is_active: {
            type: Sequelize.STRING
        },
        allocation_to_indentor_id: {
            type: Sequelize.INTEGER
        },
        target: {
            type: Sequelize.STRING
        },
        address: {
            type: Sequelize.STRING
        },
        user_id: {
            type: Sequelize.INTEGER
        },
        variety_id: {
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
    return Bsp6;
};