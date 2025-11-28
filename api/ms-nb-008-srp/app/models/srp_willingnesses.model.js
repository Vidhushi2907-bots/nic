module.exports = (sql, Sequelize) => {

    const seedRollingWillingness = sql.define('seed_rolling_plan_willingnesses', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true

        },
        year: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        season: {
            type: Sequelize.STRING,
            allowNull: false,
        },

        crop_code: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        variety_code: {
            type: Sequelize.STRING,
          
        },
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        willingness: {
            type: Sequelize.BOOLEAN,
            
        },
        quantity: {
            type: Sequelize.DOUBLE ,
            allowNull: false,
        },

        is_additional: {
            type: Sequelize.BOOLEAN,
            defaultValue:false,
        },
        remarks: {
            type: Sequelize.STRING,
        
        },
        is_active:{
            type: Sequelize.BOOLEAN,
           
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
    return seedRollingWillingness;
}