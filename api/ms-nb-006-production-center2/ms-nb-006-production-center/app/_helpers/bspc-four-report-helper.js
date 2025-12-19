const db = require("../models");
const sequelize = require('sequelize');
const Op = require('sequelize').Op;

class bspcFourReportHelper {
 
  //Helper function for conditions bsp 4
  static processData(bsp2, bsp3, seed_proceesing_register, intake) {
    return bsp2.map((record) => {
      let filterCondition = (item) =>
        item.variety_code === record.variety_code &&
        item.variety_line_code === record.variety_line_code
      let matchSeedProcessing = seed_proceesing_register.find(filterCondition);
      if (matchSeedProcessing) {
        return {
          ...record,
          letest: "spr",
          total_processed_qty: matchSeedProcessing.total_processed_qty,
        };
      }
      let intakeData = intake.find(filterCondition);
      if (intakeData) {
        return {
          ...record,
          letest: "intake",
          total_processed_qty: intakeData.raw_seed_produced,
        };
      }
      let matchBsp3 = bsp3.find(filterCondition);
      if (matchBsp3) {
        return {
          ...record,
          letest: "bsp3",
          total_processed_qty: matchBsp3.estimated_production,
        };
      }
      return {
        ...record,
        letest: "bsp2",
        total_processed_qty: record.expected_production
      };
    });
  }
  static getSeedProcess = async (filterData2, userId) => {
    return db.seedProcessingRegister.findAll({
      where: {
        [Op.and]: filterData2 ? filterData2 : [],
        bspc_id: userId,
      },
      include: [
        { model: db.varietyModel, attributes: [] },
        { model: db.varietLineModel, attributes: [] },
      ],
      attributes: [
        [sequelize.col("seed_processing_register.variety_code_line"), "variety_code_line"],
        [sequelize.col("seed_processing_register.variety_code"), "variety_code"],
        [sequelize.col("m_variety_line.line_variety_name"), "line_variety_name"],
        [sequelize.col("m_crop_variety.variety_name"), "variety_name"],
      ],
      group: [
        [sequelize.col("seed_processing_register.variety_code_line"), "variety_code_line"],
        [sequelize.col("seed_processing_register.variety_code"), "variety_code"],
        [sequelize.col("m_crop_variety.variety_name"), "variety_name"],
        [sequelize.col("m_variety_line.line_variety_name"), "line_variety_name"],
      ],
      raw: true,
    });
  };

  static getBreederSeedProduced = async (filterData2, userId, isFinalSubmittedCheck) => {
    return db.seedProcessingRegister.findAll({
      where: {
        [Op.and]: filterData2 ? filterData2 : [],
        bspc_id: userId,
        get_carry_over: { [Op.eq]: 1 },
        ...isFinalSubmittedCheck,
        action: 1,
      },
      include: [
        { model: db.varietyModel, attributes: [] },
        { model: db.varietLineModel, attributes: [] },
      ],
      attributes: [
        [sequelize.col("seed_processing_register.variety_code_line"), "variety_code_line"],
        [sequelize.col("seed_processing_register.variety_code"), "variety_code"],
        [sequelize.col("m_variety_line.line_variety_name"), "line_variety_name"],
        [sequelize.col("m_crop_variety.variety_name"), "variety_name"],
        [sequelize.col("seed_processing_register.lot_no"), "lot_no"],
        [sequelize.literal("SUM(seed_processing_register.total_processed_qty)"), "total_processed_qty"],
      ],
      group: [
        [sequelize.col("seed_processing_register.variety_code_line"), "variety_code_line"],
        [sequelize.col("seed_processing_register.variety_code"), "variety_code"],
        [sequelize.col("m_crop_variety.variety_name"), "variety_name"],
        [sequelize.col("m_variety_line.line_variety_name"), "line_variety_name"],
        [sequelize.col("seed_processing_register.lot_no"), "lot_no"],
      ],
      raw: true,
    });
  };

  static getBreederSeedProducedTotal = async (filterData2, userId, isFinalSubmittedCheck) => {
    return db.seedProcessingRegister.findAll({
      where: {
        [Op.and]: filterData2 ? filterData2 : [],
        bspc_id: userId,
        get_carry_over: { [Op.eq]: 1 },
        action: 2,
        ...isFinalSubmittedCheck,
      },
      include: [
        { model: db.varietyModel, attributes: [] },
        { model: db.varietLineModel, attributes: [] },
      ],
      attributes: [
        [sequelize.col("seed_processing_register.variety_code_line"), "variety_code_line"],
        [sequelize.col("seed_processing_register.variety_code"), "variety_code"],
        [sequelize.col("m_variety_line.line_variety_name"), "line_variety_name"],
        [sequelize.col("m_crop_variety.variety_name"), "variety_name"],
        [sequelize.col("seed_processing_register.lot_no"), "lot_no"],
        [sequelize.literal("SUM(seed_processing_register.recover_qty)"), "recover_qty"],
      ],
      group: [
        [sequelize.col("seed_processing_register.variety_code_line"), "variety_code_line"],
        [sequelize.col("seed_processing_register.variety_code"), "variety_code"],
        [sequelize.col("m_crop_variety.variety_name"), "variety_name"],
        [sequelize.col("m_variety_line.line_variety_name"), "line_variety_name"],
        [sequelize.col("seed_processing_register.lot_no"), "lot_no"],
      ],
      raw: true,
    });
  };

  static getAvailabilityOfBreederSeed = async (filterData2, userId) => {
    return db.availabilityOfBreederSeedModel.findAll({
      where: {
        [Op.and]: filterData2 ? filterData2 : [],
        user_id: userId,
      },
      attributes: [
        [sequelize.col("availability_of_breeder_seed.variety_line_code"), "variety_code_line"],
        [sequelize.col("availability_of_breeder_seed.variety_code"), "variety_code"],
        [sequelize.col("availability_of_breeder_seed.save_as_draft"), "save_as_draft"],
        [sequelize.col("availability_of_breeder_seed.allocate_qty"), "allocate_qty"],
        [sequelize.col("availability_of_breeder_seed.is_final_submit"), "is_final_submit"],
        [sequelize.col("availability_of_breeder_seed.id"), "avialability_id"],
        [sequelize.col("availability_of_breeder_seed.bsp2_qty"), "bsp2_qty"],
        [sequelize.col("availability_of_breeder_seed.bsp2_per_qty"), "bsp2_per_qty"],
        [sequelize.col("availability_of_breeder_seed.bsp3_qty"), "bsp3_qty"],
        [sequelize.col("availability_of_breeder_seed.bsp3_per_qty"), "bsp3_per_qty"],
        [sequelize.col("availability_of_breeder_seed.intake_vrfictn_qty"), "intake_vrfictn_qty"],
        [sequelize.col("availability_of_breeder_seed.intake_vrfictn__pr_qty"), "intake_vrfictn__pr_qty"],
        [sequelize.col("availability_of_breeder_seed.check_status"), "check_status"],
      ],
      raw: true,
    });
  };

  static getIsSubmittedCheck = async (search, userId) => {
    return db.seedProcessingRegister.findAll({
      where: {
        year: search.year,
        season: search.season,
        crop_code: search.crop_code,
        is_bsp_4_submitted: 1,
        bspc_id: userId,
      },
    });
  };

  static getCarryOverExistCheck = async (search, userId) => {
    return db.seedProcessingRegister.findAll({
      where: {
        year: search.year,
        season: search.season,
        crop_code: search.crop_code,
        get_carry_over: 2,
        action: 1,
        bspc_id: userId,
      },
    });
  };

  static getStlReportStatus = async (search, userId) => {
    return db.stlReportStatusModel.findAll({
      where: {
        year: search.year,
        season: search.season,
        crop_code: search.crop_code,
        user_id: userId,
      },
      raw: true,
    });
  };

  static getBsp2DataCheck = async (search, userId) => {
    return db.bspPerformaBspTwo.findAll({
      include: [
        { model: db.varietyModel, attributes: [] },
        { model: db.mVarietyLinesModel, attributes: [] },
      ],
      attributes: [
        [sequelize.col("bsp_proforma_2s.variety_line_code"), "variety_code_line"],
        [sequelize.col("bsp_proforma_2s.variety_code"), "variety_code"],
        [sequelize.col("m_variety_line.line_variety_name"), "line_variety_name"],
        [sequelize.col("m_crop_variety.variety_name"), "variety_name"],
        [sequelize.literal("SUM(bsp_proforma_2s.expected_production)"), "expected_production"],
      ],
      group: [
        [sequelize.col("bsp_proforma_2s.variety_line_code"), "variety_code_line"],
        [sequelize.col("bsp_proforma_2s.variety_code"), "variety_code"],
        [sequelize.col("m_crop_variety.variety_name"), "variety_name"],
        [sequelize.col("m_variety_line.line_variety_name"), "line_variety_name"],
      ],
      where: {
        year: search.year,
        season: search.season,
        crop_code: search.crop_code,
        user_id: userId,
      },
      raw: true,
    });
  };

  static getBsp3DataCheck = async (search, userId) => {
    return db.bspPerformaBspThree.findAll({
      include: [
        {
          required: true,
          model: db.bspPerformaBspTwo,
          attributes: [],
          where: {
            user_id: userId,
            is_inspected: true,
            id: [sequelize.col("bsp_proforma_3s.bsp_proforma_2_id")],
          },
          include: [
            { model: db.varietyModel, attributes: [] },
            { model: db.mVarietyLinesModel, attributes: [] },
          ],
        },
      ],
      attributes: [
        [sequelize.col("bsp_proforma_3s.variety_line_code"), "variety_code_line"],
        [sequelize.col("bsp_proforma_3s.variety_code"), "variety_code"],
        [sequelize.col("bsp_proforma_2->m_variety_line.line_variety_name"), "line_variety_name"],
        [sequelize.col("bsp_proforma_2->m_crop_variety.variety_name"), "variety_name"],
        [sequelize.literal("SUM(bsp_proforma_3s.estimated_production)"), "estimated_production"],
      ],
      group: [
        [sequelize.col("bsp_proforma_3s.variety_line_code"), "variety_code_line"],
        [sequelize.col("bsp_proforma_3s.variety_code"), "variety_code"],
        [sequelize.col("bsp_proforma_2->m_crop_variety.variety_name"), "variety_name"],
        [sequelize.col("bsp_proforma_2->m_variety_line.line_variety_name"), "line_variety_name"],
      ],
      where: {
        year: search.year,
        season: search.season,
        crop_code: search.crop_code,
        report: { [Op.notILike]: "Re-monitoring after 15 days" },
      },
      raw: true,
    });
  };

  static getIntakeDataCheck = async (search, userId) => {
    return db.investHarvestingModel.findAll({
      include: [
        { model: db.varietyModel, attributes: [] },
        { model: db.mVarietyLinesModel, attributes: [] },
      ],
      attributes: [
        [sequelize.col("invest_harvesting.variety_line_code"), "variety_code_line"],
        [sequelize.col("invest_harvesting.variety_code"), "variety_code"],
        [sequelize.col("m_variety_line.line_variety_name"), "line_variety_name"],
        [sequelize.col("m_crop_variety.variety_name"), "variety_name"],
        [sequelize.literal("SUM(invest_harvesting.raw_seed_produced)"), "raw_seed_produced"],
      ],
      group: [
        [sequelize.col("invest_harvesting.variety_line_code"), "variety_code_line"],
        [sequelize.col("invest_harvesting.variety_code"), "variety_code"],
        [sequelize.col("m_variety_line.line_variety_name"), "line_variety_name"],
        [sequelize.col("m_crop_variety.variety_name"), "variety_name"],
      ],
      where: {
        year: search.year,
        season: search.season,
        crop_code: search.crop_code,
        user_id: userId,
        check_status: { [Op.not]: null },
      },
      raw: true,
    });
  };

}
module.exports = bspcFourReportHelper