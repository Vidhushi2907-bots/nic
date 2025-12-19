module.exports = (sql, Sequelize) => {
  const Chats = sql.define('chats', {
      id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true  // Ensure autoIncrement is set to true
      }, 
      is_read: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      sender_id: {
          type: Sequelize.INTEGER,
          allowNull: false
      }, 
      receiver_id: {
          type: Sequelize.INTEGER, // Assuming this is an integer as well
          allowNull: false
      },
      msg: {
          type: Sequelize.TEXT,
          allowNull: false
      }, 
      created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          default: Date.now()
      },
      updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
          default: Date.now()
      },
      is_active: {
          type: Sequelize.SMALLINT,
          allowNull: false,
          defaultValue: 1
      }
  }, {
      timestamps: false
  });
  
  return Chats;
};
