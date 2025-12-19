module.exports = (sql, Sequelize) => {

    const assignSPA = sql.define('seed_rolling_plan_assign_spas', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        srp_final_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        spa_user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        certified_seed_quantity: {
            type: Sequelize.DOUBLE,
            allowNull: false,
        },
        is_active: {
            type: Sequelize.BOOLEAN,
        },
        is_draft: {
            type: Sequelize.BOOLEAN,
        },
        is_final_submit: {
            type: Sequelize.BOOLEAN,
        },
        createdAt: { type: Sequelize.DATE, field: 'created_at' },
        updatedAt: { type: Sequelize.DATE, field: 'updated_at' },
    },




        {
            timestamps: true,
            timezone: '+5:30'
        }
    )
    return assignSPA;
}