module.exports = (sql, Sequelize) => {
 
    const srpStateReplanning = sql.define('seed_rolling_plan_state_replannings', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        srp_crop_wise_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        srp_variety_wise_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        is_available: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
        },
        quantity: {
            type: Sequelize.DOUBLE,
            allowNull: false,
        },
        is_draft:{
            type: Sequelize.BOOLEAN,
        },
        is_final_submit:{
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
    return srpStateReplanning;
}