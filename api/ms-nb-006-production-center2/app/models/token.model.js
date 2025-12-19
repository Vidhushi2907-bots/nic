module.exports = (sql, DataTypes) => {

  const Token = sql.define('tokens', {
    user_id: {
      type: DataTypes.INTEGER
    },
    token: {
      type: DataTypes.TEXT
    },
  },
  {
    timestamps: false,
    timezone: '+5:30'
  });

  return Token
}

