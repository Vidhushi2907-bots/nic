module.exports = (sql, Sequelize) => {

    return sql.define('seed_inventry_tag_details', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            is_used: {
                type: Sequelize.INTEGER,
                default: 0
            },
            seed_inventry_tag_id: {
                type: Sequelize.INTEGER
            },
            tag_number: {
                type: Sequelize.INTEGER,
            },
            temp_used: {
                type: Sequelize.INTEGER,
                default: 0
            },
            weight: {
                type: Sequelize.DOUBLE,
            },
            weight_used: {
                type: Sequelize.DOUBLE,
            },
            weight_remaining: {
                type: Sequelize.DOUBLE,
            }
        },
        {
            tableName: 'seed_inventry_tag_details',
            timestamps: false,
            timezone: '+5:30'
        })
}
