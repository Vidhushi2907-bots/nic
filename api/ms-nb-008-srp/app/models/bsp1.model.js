module.exports = (sql, Sequelize) => {
    const BSP1 = sql.define('bsp_1s', {
        id: {
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
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
        user_id: {
            type: Sequelize.INTEGER
        },
        variety_id: {
            type: Sequelize.TEXT
        },
        indent_of_breederseed_id: {
            type: Sequelize.INTEGER
        },
        agency_detail_id: {
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
        tableName: 'bsp_1s'
        // timezone: '+5:30'
    });
    return BSP1;
};
