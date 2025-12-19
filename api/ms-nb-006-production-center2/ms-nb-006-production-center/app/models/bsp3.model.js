module.exports = (sql, Sequelize) => {
    const Bsp3 = sql.define('bsp_3s', {
        bsp_2_id: {
            type: Sequelize.INTEGER
        },
        crop_code: {
            type: Sequelize.STRING
        },
        date_of_inspection: {
            type: Sequelize.STRING
        },
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        is_active: {
            type: Sequelize.INTEGER
        },
        is_freeze: {
            type: Sequelize.INTEGER
        },
        isdraft: {
            type: Sequelize.INTEGER,
            default: 0
        },
        monitor_report: {
            type: Sequelize.TEXT
        },
        monitor_team_report: {
            type: Sequelize.INTEGER
        },
        production_center_id: {
            type: Sequelize.INTEGER
        },
        user_id: {
            type: Sequelize.INTEGER
        },
        user_mapping_id: {
            type: Sequelize.INTEGER
        },
        variety_id: {
            type: Sequelize.INTEGER
        },
        year: {
            type: Sequelize.INTEGER
        },
        document: {
            type: Sequelize.TEXT
        },
        season: {
            type: Sequelize.TEXT
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
    return Bsp3;
};