module.exports = (sql, Sequelize) => {
    const DirectIndentModel = sql.define('indent_of_breederseed_direct', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        year: {
            type: Sequelize.STRING
        },
        season: {
            type: Sequelize.STRING
        },
        crop_code: {
            type: Sequelize.STRING
        },
        variety_code: {
            type: Sequelize.STRING
        },
        state_code: {
            type: Sequelize.INTEGER
        },
        district_code: {
            type: Sequelize.STRING
        },
        spa_name: {
            type: Sequelize.STRING
        },
        spa_id: {
            type: Sequelize.STRING
        },
        spa_address: {
            type: Sequelize.STRING
        },
        spa_mobile_number: {
            type: Sequelize.INTEGER
        },
        quantity: {
            type: Sequelize.INTEGER
        },
        is_active: {
            type: Sequelize.INTEGER
        },  
        user_id: {
            type: Sequelize.INTEGER,
        },
        email_id: {
            type: Sequelize.STRING,
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
        timestamps: true,
        tableName: 'indent_of_breederseed_direct',
        timezone: '+5:30'
    });
    return DirectIndentModel;
};