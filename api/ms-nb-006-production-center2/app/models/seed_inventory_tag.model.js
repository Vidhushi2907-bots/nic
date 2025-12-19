module.exports = (sql, Sequelize) => {

    return sql.define('seed_inventries_tags', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            bag_size: {
                type: Sequelize.INTEGER,
            },
            lot_number: {
                type: Sequelize.STRING
            },
            number_of_tag: {
                type: Sequelize.INTEGER,
            },
            quantity: {
                type: Sequelize.DOUBLE
            },
            quantity_used: {
                type: Sequelize.DOUBLE
            },
            quantity_remaining: {
                type: Sequelize.DOUBLE
            },
            seed_inventry_id: {
                type: Sequelize.INTEGER,
            },
            tag_range: {
                type: Sequelize.STRING,
            }
        },
        {
            tableName: 'seed_inventries_tags',
            timestamps: false,
            timezone: '+5:30'
        })
}
