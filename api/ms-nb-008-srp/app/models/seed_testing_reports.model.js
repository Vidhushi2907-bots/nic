module.exports = (sql, Sequelize) => {
    const SeedTestingReports = sql.define('seed_testing_reports', {
        id: {
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
            type: Sequelize.INTEGER
        },
        user_id: {
            type: Sequelize.INTEGER
        },
        reference_number: {
            type: Sequelize.STRING
        },
        date: {
            type: Sequelize.DATE
        },
        report_recieving_date: {
            type: Sequelize.DATE
        },
        seed_test_lab_id: {
            type: Sequelize.STRING
        },
        year_of_indent: {
            type: Sequelize.INTEGER
        },
        crop_code: {
            type: Sequelize.STRING
        },
        variety_id: {
            type: Sequelize.STRING
        },
        quantity_of_seed_produced: {
            type: Sequelize.STRING
        },
        lot_number:  {
            type: Sequelize.INTEGER
        },
        sample_number: {
            type: Sequelize.STRING
        },
        seed_class_normal: {
            type: Sequelize.STRING
        },
        seed_class_abnormal: {
            type: Sequelize.STRING
        },
        seed_class_hard: {
            type: Sequelize.STRING
        },
        fresh_ungerminated: {
            type: Sequelize.STRING
        },
        dead: {
            type: Sequelize.STRING
        },
        pure_seed: {
            type: Sequelize.STRING
        },
        other_crop_seed: {
            type: Sequelize.STRING
        },
        weed_seed: {
            type: Sequelize.STRING
        },
        inert_matter: {
            type: Sequelize.STRING
        },
        moisture: {
            type: Sequelize.STRING
        },
        is_active: {
            type: Sequelize.INTEGER
        },
        season: {
            type: Sequelize.TEXT
        },
        is_report_pass: {
            type: Sequelize.BOOLEAN,
        },
        is_occupied: {
            type: Sequelize.BOOLEAN,
            default: false
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
    return SeedTestingReports;
};