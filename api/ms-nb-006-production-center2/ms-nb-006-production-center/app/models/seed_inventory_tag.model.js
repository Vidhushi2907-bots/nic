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
        },
        created_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
        updated_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        }
    },
        {
            tableName: 'seed_inventries_tags',
            timestamps: true,  // Enable automatic timestamps
            createdAt: 'created_at', // Map Sequelize's createdAt to created_at in DB
            updatedAt: 'updated_at', // Map Sequelize's updatedAt to updated_at in DB
            // timezone: '+5:30'
        })
}
