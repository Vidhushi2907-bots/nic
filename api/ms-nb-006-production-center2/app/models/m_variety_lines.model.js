module.exports = (sql, Sequelize) => {

    const mVarietyLines = sql.define('m_variety_lines', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        variety_code: {
            type: Sequelize.STRING
        },
        line_variety_code: {
            type: Sequelize.STRING,
        },
        line_variety_name: {
            type: Sequelize.STRING,
        },
        line: {
            type: Sequelize.STRING,
        },
    },
    
        {
            timestamps: false,
        })
    return mVarietyLines
};