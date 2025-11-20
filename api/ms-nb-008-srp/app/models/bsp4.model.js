module.exports = (sql, Sequelize) => {
    const Bsp4 = sql.define('bsp_4', {
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
        bsp_3_id: {
            type: Sequelize.INTEGER
        },
        variety_id: {
            type: Sequelize.INTEGER
        },
        pd_letter_number: {
            type: Sequelize.TEXT
        },
        actual_seed_production: {
            type: Sequelize.TEXT
        },
        production_year: {
            type: Sequelize.STRING
        },
        carry_over_seed_amount: {
            type: Sequelize.INTEGER
        },
        carry_over_last_year_germination: {
            type: Sequelize.TEXT
        },
        carry_over_current_year_germination: {
            type: Sequelize.TEXT
        },
        reason_for_dificit: {
            type: Sequelize.TEXT
        },
        document: {
            type: Sequelize.TEXT
        },
        number_of_sample: {
            type: Sequelize.INTEGER
        },
        shor_fall_reason: {
            type: Sequelize.TEXT
        },
        short_fall_document: {
            type: Sequelize.TEXT
        },
        production_center_id: {
            type: Sequelize.INTEGER
        },
        total_availability: {
            type: Sequelize.INTEGER
        },
        production_surplus: {
            type: Sequelize.INTEGER
        },
        year: {
            type: Sequelize.INTEGER
        },
        user_id: {
            type: Sequelize.INTEGER
        },
        crop_code: {
            type: Sequelize.STRING
        },
        crop_group_code: {
            type: Sequelize.STRING,
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
    return Bsp4;
};