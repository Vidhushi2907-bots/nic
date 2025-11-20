module.exports = (sql, Sequelize) => {

    const freezeTimelines = sql.define('freeze_timelines', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        season_name: {
            type: Sequelize.STRING,
        },

        start_date: {
            type: Sequelize.DATE,
        },
        end_date: {
            type: Sequelize.DATE,
        },
        year_of_indent: {
            type: Sequelize.INTEGER,
        },
        activitie_id: {
            type: Sequelize.INTEGER,
        },
        created_by: {
            type: Sequelize.INTEGER,
        },
        is_active: {
            type: Sequelize.INTEGER,
        },
        user_id: {
            type: Sequelize.INTEGER,
        },
        created_at: {
            type: Sequelize.DATE,
            default: Date.now()
        },
        updated_at: {
            type: Sequelize.DATE,
            default: Date.now()
        },
        createdAt: { type: Sequelize.DATE, field: 'created_at' },
        updatedAt: { type: Sequelize.DATE, field: 'updated_at' },

    },
    {
        // timestamps: false,
        // timezone: '+5:30'
      })
    return freezeTimelines
}
