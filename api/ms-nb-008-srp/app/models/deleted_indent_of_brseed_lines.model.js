module.exports = (sql, Sequelize) => {

    const deletedIndentOfBrseedLines = sql.define('deleted_indent_of_brseed_lines', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        indent_of_breederseed_id: {
            type: Sequelize.INTEGER
        },
        indent_line_data: {
            type: Sequelize.STRING,
            allowNull:false,
        },
        createdAt: { type: Sequelize.DATE, field: 'created_at', default: Date.now() },
        updatedAt: { type: Sequelize.DATE, field: 'updated_at', default: Date.now() },
    },
        {
            timestamps: true,
            timezone: '+5:30'
        })
    return deletedIndentOfBrseedLines
};