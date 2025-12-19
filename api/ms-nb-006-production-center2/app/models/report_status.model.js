module.exports = (sql, Sequelize) => {
    const reportStatus = sql.define('report_statu', {
        id: {
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
            type: Sequelize.INTEGER
        },
        report_name: {
            type: Sequelize.STRING
        },
        running_number: {
            type: Sequelize.INTEGER
        },
        year: {
            type: Sequelize.INTEGER
        },
        season: {
            type: Sequelize.STRING
        },
        // created_at: {
        //     default: Date.now(),
        //     type: Sequelize.DATE
        // },
        // updated_at: {
        //     default: Date.now(),
        //     type: Sequelize.DATE
        // },
        // updatedAt: { field: 'updated_at', type: Sequelize.DATE },
        // createdAt: { field: 'created_at', type: Sequelize.DATE },
    }, {
        timestamps: false,
        // timezone: '+5:30'
    });
    return reportStatus;
};
