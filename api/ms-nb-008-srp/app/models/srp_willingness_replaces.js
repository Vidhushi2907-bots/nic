module.exports = (sql, Sequelize) => {

    const seedRollingPlanWillingnessReplacement = sql.define('seed_rolling_plan_willingness_replaces', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true

        },

        srp_willingness_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },

        replace_variety_code: {
            type: Sequelize.STRING,
            allowNull: false,
        },

        quantity: {
            type: Sequelize.DOUBLE,
            allowNull: false,
        },

        is_active: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
        },
        createdAt: { type: Sequelize.DATE, field: 'created_at' },
        updatedAt: { type: Sequelize.DATE, field: 'updated_at' },
    },
        {
            timestamps: true,
            timezone: '+5:30'
        }
    )
    return seedRollingPlanWillingnessReplacement;
}