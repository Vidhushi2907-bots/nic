module.exports = (sql, Sequelize) => {
 
    const srpNewReplacement = sql.define('seed_rolling_plan_state_replanning_new_varieties', {
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
     
        new_variety_code: {
            type: Sequelize.STRING,
            allowNull: false,
        },
 
       quantity_available: {
            type: Sequelize.DOUBLE,
            allowNull: false,
        },
        quantity_required:{
            type: Sequelize.DOUBLE,
            allowNull: false,
        },
        is_accept:{
            type:Sequelize.BOOLEAN,
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
    return srpNewReplacement;
}