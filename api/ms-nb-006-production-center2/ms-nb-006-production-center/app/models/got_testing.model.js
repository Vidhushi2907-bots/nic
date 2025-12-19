module.exports = (sql, Sequelize) => {
  const GotTesting = sql.define("got_testing",
    {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      bspc_id: {
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
      },
     year: {
        type: Sequelize.INTEGER,
      },
      crop_code: {
        type: Sequelize.STRING,
      },
      variety_code: {
        type: Sequelize.STRING,
      },
      season: {
        type: Sequelize.STRING,
      },
      consignment_number: {
        type: Sequelize.STRING,
      },
      variety_line_code: {
        type: Sequelize.STRING,
      },

      is_sample_received:{
        type: Sequelize.STRING,
      },
      reason_id : {
        type: Sequelize.INTEGER,
      },
      unique_code: {
        type: Sequelize.STRING,
      },
      test_number: {
        type: Sequelize.STRING,
      },
      status:{
        type: Sequelize.STRING,
      },
      got_monitoring_team_id: {
        type: Sequelize.INTEGER,
        // allowNull: true,
      }
    },
      {
        // tableName: 'm_variety_lines',
        timestamps: false,
        tableName: 'got_testing',
        // timezone: '+5:30'
      })
    return GotTesting
  }


//   autoIncrement: true,
//       },
//       bspc_id: {
//         type: Sequelize.INTEGER,
//         allowNull: false,
//       },
//       year: {
//         type: Sequelize.INTEGER,
//         allowNull: false,
//       },
//       crop_code: {
//         type: Sequelize.STRING,
//         allowNull: false,
//       },
//       variety_code: {
//         type: Sequelize.STRING,
//         allowNull: false,
//       },
//       consignment_number: {
//         type: Sequelize.STRING,
//         allowNull: false,
//       },
//       variety_line_code: {
//         type: Sequelize.STRING,
//         allowNull: false,
//       },
//       is_sample_received: {
//         type: Sequelize.DOUBLE,
//         allowNull: false,
//       },

//       status: {
//         type: Sequelize.STRING,
//         allowNull: false,
//       },
//       test_number: {
//         type: Sequelize.STRING,
//         allowNull: false,
//       },
//       unique_code: {
//         type: Sequelize.STRING,
//         allowNull: false,
//       },
//       reason_id: {
//         type: Sequelize.INTEGER,
//         allowNull: false,
//       },
//       got_monitoring_team_id: {
//         type: Sequelize.INTEGER,
//         allowNull: false,
//       },
//     },
//     {
//       timestamps: false,
//       tableName: "got_testing",
//     }
//   );
//   return GotTesting;
// };
