module.exports = (sql, Sequelize) => {

    const year = sql.define('srp_year_wises', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },

        year: {
            type: Sequelize.INTEGER,
        },

        year_range: {
            type: Sequelize.STRING

        },

        is_active: {
            type: Sequelize.BOOLEAN
        },

        createdAt: { type: Sequelize.DATE, field: 'created_at' },
        updatedAt: { type: Sequelize.DATE, field: 'updated_at' },
    },
        {
            timestamps: true,
            timezone: '+5:30'
        }
    )
    return year
}
