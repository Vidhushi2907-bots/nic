module.exports = (sql, Sequelize) => {

    const seedRollingWillingness = sql.define('seed_rolling_plan_willingness', {
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
            allowNull: false,
        },
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        willingness: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
        },
        quantity: {
            type: Sequelize.DOUBLE ,
            allowNull: false,
        },

        is_additional: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
        },
        remarks: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        is_active:{
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
    return seedRollingWillingness;
}