module.exports = (sql, Sequelize) => {
    const breederCertificate = sql.define('generation_of_breeder_seed_certificate', {
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
        is_active: {
            type: Sequelize.INTEGER
        },
        user_id: {
            type: Sequelize.INTEGER
        },
        variety_id: {
            type: Sequelize.INTEGER
        },
        indent_of_breederseed_id: {
            type: Sequelize.INTEGER
        },
        generation_date: {
            type: Sequelize.STRING
        },
        season: {
            type: Sequelize.STRING
        },
        label_number: {
            type: Sequelize.TEXT
        },
        net_weight: {
            type: Sequelize.INTEGER
        },
        year_of_production: {
            type: Sequelize.STRING
        },
        bill_number: {
            type: Sequelize.STRING
        },
        date_of_bill: {
            type: Sequelize.STRING
        },
        upload: {
            type: Sequelize.STRING
        },
        date_of_inspection: {
            type: Sequelize.STRING
        },
        left_over_amount: {
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
    return breederCertificate;
};