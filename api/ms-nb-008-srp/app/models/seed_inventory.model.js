module.exports = (sql, Sequelize) => {

  const seedInventory = sql.define('seed_inventries', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    year: {
      type: Sequelize.INTEGER,
    },
    // breeder_production_centre_name: {
    //   type: Sequelize.STRING
    // },
    season: {
      type: Sequelize.STRING
    },
    crop_code: {
      type: Sequelize.STRING,
    },

    // contact_officer_designation: {
    //   type: Sequelize.DATE,
    // },
    // contact_officer_name: {
    //   type: Sequelize.STRING
    // },
    variety_code: {
      type: Sequelize.STRING
    },
    developed_by_bspc: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    seed_class_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },

    bspc_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    developed_bspc_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    moa_number: {
      type: Sequelize.STRING
    },
    moa_date: {
      type: Sequelize.DATE
    },
    reference_number: {
      type: Sequelize.STRING
    },
    officer_order_date: {
      type: Sequelize.DATE
    },
    stage_id: {
      type: Sequelize.INTEGER

    },


    is_active: {
      type: Sequelize.INTEGER
    },
    line_variety_code: {
      type: Sequelize.STRING
    },
    is_hybrid: {
      type: Sequelize.INTEGER
    },
    user_id: {
      type: Sequelize.INTEGER
    },
    updated_at: {
      default: Date.now(),
      type: Sequelize.DATE
    },
    created_at: {
      default: Date.now(),
      type: Sequelize.DATE
    },
  },
    {
      timestamps: true,
      underscored: true,  // Makes sure fields are `created_at` and `updated_at` instead of `createdAt` and `updatedAt`
      timezone: '+5:30'
    })
  return seedInventory
}
