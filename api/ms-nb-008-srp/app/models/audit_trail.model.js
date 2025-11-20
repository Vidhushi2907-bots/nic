module.exports = (sql, Sequelize) => {

    const auditTrail = sql.define('audit_trails', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        action_at: {
            type: Sequelize.STRING
        },
        action_by: {
            type: Sequelize.STRING,
        },
        column_id: {
            type: Sequelize.STRING
        },
        comment: {
            type: Sequelize.STRING,
        },
        form_type: {
            type: Sequelize.STRING,
        },
        ip: {
            type: Sequelize.STRING,
        },
        mac_number: {
            type: Sequelize.STRING,
        },
        table_id: {
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
        // deleted_at: {
        //     type: Sequelize.DATE
        // },
        createdAt: { type: Sequelize.DATE, field: 'created_at' },
        updatedAt: { type: Sequelize.DATE, field: 'updated_at' },
        // deletedAt: {type: Sequelize.DATE, field: 'deleted_at'},

    },


        {
            //  timestamps: false,
            timezone: '+5:30'
        })


    return auditTrail
}