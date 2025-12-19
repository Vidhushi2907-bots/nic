module.exports = (sql, Sequelize) => {

    const indentOfBrseedLines = sql.define('indent_of_brseed_lines', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        indent_of_breederseed_id: {
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
    return indentOfBrseedLines
};