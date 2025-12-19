module.exports = (sql, Sequelize) => {

    const indentOfSpaLines = sql.define('indent_of_spa_lines', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        indent_of_spa_id: {
            type: Sequelize.INTEGER
        },
        variety_code_line: {
            type: Sequelize.STRING,
        },
        quantity: {
            type: Sequelize.INTEGER
        },
    },
        {
            timestamps: false,
        })
    return indentOfSpaLines
};