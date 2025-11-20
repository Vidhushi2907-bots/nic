module.exports = (sql, Sequelize) => {
    const generateBills = sql.define('generate_bills', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        is_active: {
            type: Sequelize.INTEGER
        },
        available_quantity: {
            type: Sequelize.DECIMAL
        },
        total_quantity: {
            type: Sequelize.DECIMAL
        },
        amount: {
            type: Sequelize.INTEGER
        },
        bsp_1_id: {
            type: Sequelize.INTEGER
        },
        label_number: {
            type: Sequelize.STRING
        },
        bill_number: {
            type: Sequelize.STRING
        },
        bill_date: {
            type: Sequelize.STRING
        },
        lot_id: {
            type: Sequelize.STRING
        },
        production_center_id: {
            type: Sequelize.INTEGER
        },
        variety_id: {
            type: Sequelize.INTEGER
        },
        year: {
            type: Sequelize.INTEGER
        },
        user_id: {
            type: Sequelize.INTEGER
        },
        isdraft: {
            type: Sequelize.INTEGER,
            default: 0
        },
        is_certificate_generated: {
            type: Sequelize.BOOLEAN,
            default: false
        },
        is_payment_completed: {
            type: Sequelize.BOOLEAN,
            default: false
        },
        bsp_4_id: {
            type: Sequelize.INTEGER
        },
        indent_of_breederseed_id: {
            type: Sequelize.INTEGER
        },
        crop_code: {
            type: Sequelize.STRING
        },
        crop_group_code: {
            type: Sequelize.STRING,
        },
        season: {
            type: Sequelize.TEXT
        },
        spa_code: {
            type: Sequelize.STRING,
        },
        state_code: {
            type: Sequelize.STRING
        },
        region: {
            type: Sequelize.INTEGER,
        },
        region_name:{
            type: Sequelize.STRING
        },
        is_payment_completed: {
            type: Sequelize.BOOLEAN
        },
        is_certificate_generated: {
            type: Sequelize.BOOLEAN
        },
        created_at: {
            default: Date.now(),
            type: Sequelize.DATE
        },
        updated_at: {
            default: Date.now(),
            type: Sequelize.DATE
        },

        serial_number: {
            type: Sequelize.INTEGER
        },
        updatedAt: { field: 'updated_at', type: Sequelize.DATE },
        createdAt: { field: 'created_at', type: Sequelize.DATE },
    }, {
        timestamps: false,
        // timezone: '+5:30'
    });
    return generateBills;
};