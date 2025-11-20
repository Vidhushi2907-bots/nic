module.exports = (sql, Sequelize) => {

    const GeneratedLabelNumber = sql.define('generated_label_numbers', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        label_number_for_breeder_seeds: {
            type: Sequelize.INTEGER
        },
        generated_label_name: {
            type: Sequelize.STRING,
        },
        created_at: {
            type: Sequelize.DATE,
            default: Date.now()
        },
        updated_at: {
            type: Sequelize.DATE,
            default: Date.now()
        },
        weight: {
            type: Sequelize.STRING,
        },
        user_id: {
            type: Sequelize.INTEGER,
        },
        unique_label_number: {
            type: Sequelize.STRING,
        },

        createdAt: { type: Sequelize.DATE, field: 'created_at' },
        updatedAt: { type: Sequelize.DATE, field: 'updated_at' },
    },

        {
            timestamps: false,
            // timezone: '+5:30'
        })

    return GeneratedLabelNumber;
};
