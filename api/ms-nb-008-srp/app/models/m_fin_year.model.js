module.exports = (sql, Sequelize) => {

    const finYear = sql.define('m_fin_year', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },

        year: {
            type: Sequelize.INTEGER,
        },

        fin_year: {
            type: Sequelize.STRING
        },
        table_id: {
            type: Sequelize.INTEGER
        },
        is_active: {
            type: Sequelize.BOOLEAN
        },

        // createdAt: { type: Sequelize.DATE, field: 'created_at' },
        // updatedAt: { type: Sequelize.DATE, field: 'updated_at' },
    },
        {
            tableName: 'm_fin_year',   // 👈 explicit
            freezeTableName: true,     // 👈 VERY IMPORTANT
            timestamps: false   // 👈 IMPORTANT
            // timezone: '+5:30'
        }
    )
    return finYear
}
