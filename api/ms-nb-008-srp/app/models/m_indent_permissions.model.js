module.exports = (sql, Sequelize) => {

  const mIndentPermissions = sql.define('m_indent_permissions', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    year: {
      type: Sequelize.INTEGER
    },
    season: {
      type: Sequelize.STRING,
    },
    is_allowed_new: {
      type: Sequelize.INTEGER
    },
    is_allowed_update: {
      type: Sequelize.INTEGER
    },
    is_deleted:{
      type: Sequelize.INTEGER
    }
  },
    {
      timestamps: false,
      // timezone: '+5:30'
    })
  return mIndentPermissions
}
