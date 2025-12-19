module.exports = (sql, Sequelize) => {

    const srpFinal = sql.define('seed_rolling_plan_crop_variety_finals', {
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
        breeder_seed: {
            type: Sequelize.DOUBLE,
            allowNull: false,
        },
        foundation_seed: {
            type: Sequelize.DOUBLE,
            allowNull: false,
        },
        certified_seed: {
            type: Sequelize.DOUBLE,
            allowNull: false,
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
    return srpFinal;
}