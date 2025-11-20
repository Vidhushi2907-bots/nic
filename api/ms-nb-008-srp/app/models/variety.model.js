const { DataTypes } = require('sequelize');
module.exports = (sql, Sequelize) => {

    const Variety = sql.define('m_crop_varieties', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        crop_code: {
            type: Sequelize.STRING,
        },
        variety_code: {
            type: Sequelize.STRING
        },
        variety_name: {
            type: Sequelize.STRING,
        },
        meeting_number: {
            type: Sequelize.STRING,
        },
        type: {
            type: Sequelize.STRING,
        },
        not_date: {
            type: Sequelize.DATE,
        },
        not_number: {
            type: Sequelize.STRING,
        },
        is_notified: {
            type: Sequelize.INTEGER,
        },
        developed_by: {
            type: Sequelize.STRING,
        },
        is_active: {
            type: Sequelize.INTEGER,
            defaultValue: 1
        },
        introduce_year: {
            type: Sequelize.DATE,
        },
        release_date:{
            type:Sequelize.DATE
        },
        crop_group_code:{
            type:Sequelize.STRING
        },
        user_id:{
            type: Sequelize.INTEGER
        },
        status:{
            type: DataTypes.ENUM('hybrid', 'variety', 'other')
            // type: Sequelize.ENUM
        },

        createdAt: { type: Sequelize.DATE, field: 'created_at' },
        updatedAt: { type: Sequelize.DATE, field: 'updated_at' },

    },


        {
            freezeTableName: true
        })


    return Variety
}
