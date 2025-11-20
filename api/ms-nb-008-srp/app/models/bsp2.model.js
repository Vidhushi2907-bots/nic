module.exports = (sql, Sequelize) => {
    const BSP2 = sql.define('bsp_2', {
        id: {
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
            type: Sequelize.INTEGER
        },
        area: {
            type: Sequelize.TEXT
        },
        bsp_1_id: {
            type: Sequelize.INTEGER
        },
        is_freeze: {
            type: Sequelize.INTEGER
        },
        is_active: {
            type: Sequelize.INTEGER
        },
        expected_production: {
            type: Sequelize.TEXT
        },
        field_location: {
            type: Sequelize.TEXT
        },
        date_of_sowing: {
            type: Sequelize.STRING
        },
        expected_inspection_from: {
            type: Sequelize.STRING
        },
        expected_inspection_to: {
            type: Sequelize.STRING
        },
        expected_harvest_from: {
            type: Sequelize.STRING
        },
        expected_harvest_to: {
            type: Sequelize.STRING
        },
        expected_availbility: {
            type: Sequelize.STRING
        },
        location_availbility_seed: {
            type: Sequelize.TEXT
        },
        reason: {
            type: Sequelize.TEXT
        },
        document: {
            type: Sequelize.TEXT
        },
        variety_id: {
            type: Sequelize.INTEGER
        },
        production_center_id: {
            type: Sequelize.INTEGER
        },
        year: {
            type: Sequelize.INTEGER
        },
        crop_code: {
            type: Sequelize.STRING
        },
        crop_group_code: {
            type: Sequelize.STRING,
        },
        user_id: {
            type: Sequelize.INTEGER
        },
        season:{
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
        // timezone: '+5:30'
    });
    return BSP2;
};