module.exports = (sql, Sequelize) => {

    const AllocationToIndentorForLiftingBreederseeds = sql.define('allocation_to_indentor_for_lifting_breederseeds', {

        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        year: {
            type: Sequelize.INTEGER
        },
        breeder_seed_id: {
            type: Sequelize.INTEGER
        },
        variety_id: {
            type: Sequelize.INTEGER
        },
        user_id: {
            type: Sequelize.INTEGER
        },
        is_freeze: {
            type: Sequelize.INTEGER
        },
        indent_of_breeder_id: {
            type: Sequelize.INTEGER
        },
        breeder_seed_quantity_left: {
            type: Sequelize.STRING,
        },
        crop_code: {
            type: Sequelize.STRING,
        },
        crop_group_code: {
            type: Sequelize.STRING,
        },
        is_active: {
            type: Sequelize.INTEGER,
            defaultValue: 1
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
            timestamps: false,
            // timezone: '+5:30'
        })
    return AllocationToIndentorForLiftingBreederseeds
}
