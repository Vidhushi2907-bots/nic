module.exports = (sql, Sequelize) => {

    const mCropGroup = sql.define('comments', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        comment: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        type: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        is_active: {
            type: Sequelize.SMALLINT,
            allowNull: false,
            defaultValue: 1,
        },
    }, {
        timestamps: false,
    })
    return mCropGroup
}
