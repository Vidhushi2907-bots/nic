module.exports = (sql, Sequelize) => {

  return sql.define('bsp_proforma_5as', {
          id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
          },
          is_finished: {
            type: Sequelize.STRING
          },
          test_no: {
            type: Sequelize.STRING
          },
          show_report_no: {
            type: Sequelize.STRING
          },
          report_no: {
            type: Sequelize.STRING
          },
          standards_meet: {
            type: Sequelize.BOOLEAN
          },
          certification_eligibility: {
            type: Sequelize.STRING
          },
          eligible: {
            type: Sequelize.STRING
          },
          show_test_no: {
            type: Sequelize.STRING
          },
          stage_growth: {
            type: Sequelize.STRING
          },
          year: {
            type: Sequelize.INTEGER
          },
          season: {
            type: Sequelize.STRING
          },
          lot_num: {
            type: Sequelize.STRING
          },
          unique_code: {
            type: Sequelize.STRING
          },
          source_class: {
            type: Sequelize.STRING
          },
          dest_class: {
            type: Sequelize.STRING
          },
          variety_code: {
            type: Sequelize.STRING
          },
          variety_name: {
            type: Sequelize.STRING
          },
          crop_code: {
            type: Sequelize.STRING
          },
          crop_name: {
            type: Sequelize.STRING
          },
          crop_reg_code: {
            type: Sequelize.STRING
          },
          spa_code: {
            type: Sequelize.STRING
          },
          spa_name: {
            type: Sequelize.STRING
          },
          spp_code: {
            type: Sequelize.STRING
          },
          spp_name: {
            type: Sequelize.STRING
          },
          date_of_sowing: {
            type: Sequelize.DATE
          },
          observed_on: {
            type: Sequelize.DATE
          },
          certified_on: {
            type: Sequelize.DATE
          },
          longitude: {
            type: Sequelize.STRING
          },
          latitude: {
            type: Sequelize.STRING
          },
          team_member: {
            type: Sequelize.STRING
          },
          got_status: {
            type: Sequelize.STRING
          },
          remark: {
            type: Sequelize.STRING
          },
          sync_date: {
            type: Sequelize.DATE
          },
          sci_name: {
            type: Sequelize.STRING
          },
          sci_code: {
            type: Sequelize.STRING
          },
          lot_id: {
            type: Sequelize.INTEGER
          },
          reference_no: {
            type: Sequelize.STRING
          },
          reference_index: {
            type: Sequelize.INTEGER
          },
          bspc_id: {
            type: Sequelize.INTEGER,
          },
          createdAt: {type: Sequelize.DATE, field: 'created_at'},
          updatedAt: {type: Sequelize.DATE, field: 'updated_at'},
        },
        {
          timestamps: false,
        }
    )
  }
