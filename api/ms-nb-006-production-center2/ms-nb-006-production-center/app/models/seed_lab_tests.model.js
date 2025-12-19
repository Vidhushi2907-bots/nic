module.exports = (sql, Sequelize) => {

    const seedLabTests = sql.define('seed_lab_tests', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        lab_test_name: {
            type: Sequelize.STRING
        },
    }, {
        // tableName: 'm_variety_lines',
        timestamps: false,
        // timezone: '+5:30'

    });
    return seedLabTests
}
