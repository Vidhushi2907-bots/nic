module.exports = (sql, Sequelize) => {
    const IndentYearModel = sql.define('m_fin_year', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        year: {
            type: Sequelize.STRING
        },
        table_id: {
            type: Sequelize.INTEGER
        },
        fin_year: {
            type: Sequelize.STRING
        },
        is_active: {
            type: Sequelize.INTEGER
        }
    }, {
        timestamps: false,
        tableName: 'm_fin_year',
        // timezone: '+5:30'
    });
    return IndentYearModel;
};