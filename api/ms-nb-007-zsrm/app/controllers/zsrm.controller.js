require('dotenv').config()
const response = require('../_helpers/response')
const status = require('../_helpers/status.conf')
const sequelize = require('sequelize');
const { Op } = require('sequelize');
const ConditionCreator = require('../_helpers/condition-creator')
const paginateResponse = require("../_utility/generate-otp");
const { raw } = require('body-parser');
const db = require("../models");
const { cloneDeep } = require('sequelize/lib/utils');
const indenterModel = db.indenterModel;
const agencyDetailModel = db.agencyDetailModel
const userModel = db.userModel
const stateModel = db.stateModel;
const seasonModel = db.seasonModel;
const cropGroupModel = db.cropGroupModel;
const cropVerietyModel = db.cropVerietyModel;
const varietyModel = db.varietyModel;
const cropDataModel = db.cropModel
const districtModel = db.districtModel;
const zsemreqfsModel = db.zsrmReqFs;
const zsrmreqqsModel = db.zsrmReqQs;
const zsrmreqqsdistModel = db.zsrmReqQsDistWise;
const cropcharactersModel = db.cropCharactersticsModel;
const srpModel = db.srpModel;
const srrModel = db.srrModel;
const zsrmbstofsModel = db.ZsrmBsToFs; //
const zsrmfstocsModel = db.ZsrmFsToCs;
const zsrmcsqsdistModel = db.ZsrmCSQsDist;
const zsrmcsfsarea = db.zsrmcsfsarea;
//ZSRM requriement for FS 


exports.getUserStateCode = async (req, res) => {
  try {

    let state = await agencyDetailModel.findOne({
      where: {
        user_id: req.body.loginedUserid.id,
      },
      attributes: ['state_id']
    }
    )
    if (state) {
      const result = {
        state_code: state.state_id
      }

      return response(res, status.DATA_AVAILABLE, 200, result);
    }
    else {
      return response(res, status.DATA_NOT_AVAILABLE, 501, []);
    }
  }
  catch (error) {
    return response(res, status.UNEXPECTED_ERROR, 501);
  }
}

exports.getCropList = async (req, res) => {
  try {
    const cropList = await cropDataModel.findAll({
      where: { is_active: 1 },
      attributes: ['id', 'crop_code', 'crop_name', 'srr',],
      order: [['crop_name', 'ASC']]
    });
    console.log(cropList);

    if (cropList.length > 0) {

      return response(res, status.DATA_AVAILABLE, 200, cropList);
    }
    else {
      return response(res, status.DATA_NOT_AVAILABLE, 501, []);
    }
  }
  catch (error) {
    return response(res, status.UNEXPECTED_ERROR, 501);
  }
}

exports.getVarietyList = async (req, res) => {
  try {
    const crop_code = req.query.crop_code;
    console.log(crop_code);
    const varietyList = await varietyModel.findAll({
      include: [
        {
          model: cropcharactersModel,
          attributes: []
        },
      ],
      where: { is_active: 1, crop_code: crop_code },
      attributes: [
        'id',
        'variety_code',
        'variety_name',
        'status',
        'developed_by',

        // Correct usage of SUBSTRING function for extracting the first 4 characters from 'not_date'
        [
          sequelize.fn('SUBSTRING', sequelize.col('not_date'), 1, 4),
          'not_date_substring'
        ],

        // // CASE statement for 'matuarity_day_from' field
        [
          sequelize.literal(`
        CASE
          WHEN "matuarity_day_from" = '1' THEN 'Early'
          WHEN "matuarity_day_from" = '2' THEN 'Medium'
          WHEN "matuarity_day_from" = '3' THEN 'Late'
          WHEN "matuarity_day_from" = '4' THEN 'Perennial'
          ELSE 'NA'
        END
      `),
          'maturity_type'
        ],

        // CASE statement for 'is_notified' field
        [
          sequelize.literal(`
        CASE
          WHEN "is_notified" = 1 THEN 'Notified'
          ELSE 'Non-Notified'
        END
      `),
          'notification_status'
        ]
      ],
      order: [['variety_name', 'ASC']]
    });
    console.log(varietyList);

    if (varietyList.length > 0) {

      return response(res, status.DATA_AVAILABLE, 200, varietyList);
    }
    else {
      return response(res, status.DATA_NOT_AVAILABLE, 501, []);
    }
  }
  catch (error) {
    return response(res, status.UNEXPECTED_ERROR, 501, error.message);
  }
}


exports.getVarietyData = async (req, res) => {
  try {
    const variety_code = req.query.variety_code;

    const varietyData = await varietyModel.findOne({
      include: [
        {
          model: cropcharactersModel,
          attributes: []
        },
        {
          model: cropDataModel,
          attributes: []
        },
      ],
      where: { is_active: 1, variety_code: variety_code },
      attributes: [
        'id',
        'variety_code',
        'variety_name',
        'status',
        'developed_by',

        // Correct usage of SUBSTRING function for extracting the first 4 characters from 'not_date'
        [
          sequelize.fn('SUBSTRING', sequelize.col('not_date'), 1, 4),
          'not_date_substring'
        ],

        // // CASE statement for 'matuarity_day_from' field
        [
          sequelize.literal(`
        CASE
          WHEN "matuarity_day_from" = '1' THEN 'Early'
          WHEN "matuarity_day_from" = '2' THEN 'Medium'
          WHEN "matuarity_day_from" = '3' THEN 'Late'
          WHEN "matuarity_day_from" = '4' THEN 'Perennial'
          ELSE 'NA'
        END
      `),
          'maturity_type'
        ],

        // CASE statement for 'is_notified' field
        [
          sequelize.literal(`
        CASE
          WHEN "is_notified" = 1 THEN 'Notified'
          ELSE 'Non-Notified'
        END
      `),
          'notification_status'
        ],
        [sequelize.col('m_crop.srr'), 'srr']
      ],
      order: [['variety_name', 'ASC']]
    });

    if (varietyData) {

      return response(res, status.DATA_AVAILABLE, 200, varietyData);
    }
    else {
      return response(res, status.DATA_NOT_AVAILABLE, 404, []);
    }
  }
  catch (error) {
    return response(res, status.UNEXPECTED_ERROR, 501, error.message);
  }
}

exports.saveZsrmReqFs = async (req, res) => {

  try {
    const body = req.body;
    console.log(body.loginedUserid.id);
    let crop_type = "";
    let unit = "";
    let cropExist = await cropDataModel.findOne({
      where: {
        crop_code: body.crop_code,
      },
    });
    console.log(
      body.crop_code)
    console.log("crop:", cropExist);
    if (!cropExist) {
      return response(res, "Crop Not Found", 404, {});
    }

    let varietyExist = await varietyModel.findOne({
      where: {
        variety_code: body.variety_code,
      },
    });
    console.log("varity:", varietyExist);
    if (!varietyExist) {
      return response(res, "Variety Not Found", 404, {});
    }


    let recordExist = await zsemreqfsModel.findOne({
      where: {
        year: body.year,
        season: body.season,
        crop_code: body.crop_code,
        variety_code: body.variety_code,
        user_id: body.loginedUserid.id,
        is_active: true
      },
    });
    if (recordExist) {
      return response(res, "Record already exist", 409, {});
    }
    if ((cropExist.crop_code).slice(0, 1) == 'A') {
      crop_type = 'agriculture';
      unit = 'qt';
    }
    else if ((cropExist.crop_code).slice(0, 1) == 'H') {
      crop_type = 'horticulture'
      unit = 'kg';
    }
    console.log("crop_type:", crop_type);
    console.log("unit:", unit);

    let state = await agencyDetailModel.findOne({
      where: {
        user_id: body.loginedUserid.id,
      },
      attributes: ['state_id']
    }
    )
    console.log("state_id:", state);


    let data = await zsemreqfsModel.create({
      year: body.year,
      season: body.season,
      crop_type: crop_type,
      crop_code: body.crop_code,
      variety_code: body.variety_code,
      user_id: body.loginedUserid.id,
      unit: unit,
      req: body.req,
      ssc: body.ssc,
      doa: body.doa,
      sau: body.sau,
      nsc: body.nsc,
      pvt: body.pvt,
      others: body.others,
      total: body.total,
      shtorsur: body.shtorsur,
      remarks: body.remarks,
      state_id: state.state_id,
    })
    console.log("data added", data);
    if (data) {
      response(res, status.DATA_SAVE, 200, data);
    }
    else {
      return response(res, status.DATA_NOT_SAVE, 404)
    }
  } catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }

}

exports.updateZsrmReqFsById = async (req, res) => {

  try {
    const body = req.body;
    const recordExist = await zsemreqfsModel.findOne({
      where: {
        id: req.params.id, is_active: true, user_id: body.loginedUserid.id,
        is_finalised: false
      }
    });
    if (!recordExist) {
      return response(res, status.DATA_NOT_AVAILABLE, 404);
    }
    await zsemreqfsModel.update({
      req: body.req,
      ssc: body.ssc,
      doa: body.doa,
      sau: body.sau,
      nsc: body.nsc,
      total: body.total,
      shtorsur: body.shtorsur,
      pvt: body.pvt,
      others: body.others,
      remarks: body.remarks,
      updated_at: Date.now()
    },
      {
        where: {
          id: req.params.id,
        },
      },).then(() => response(res, status.DATA_UPDATED, 200, {}))
      .catch(() => response(res, status.DATA_NOT_UPDATED, 500));

  } catch (error) {
    return response(res, status.UNEXPECTED_ERROR, 501)
  }

}


exports.finaliseZsrmReqFs = async (req, res) => {
  try {
    const recordsExist = await zsemreqfsModel.findAll({ where: { year: req.query.year, season: req.query.season, is_active: true, user_id: req.body.loginedUserid.id } });
    if (recordsExist.length === 0) {
      return response(res, status.DATA_NOT_AVAILABLE, 404);
    }
    await zsemreqfsModel.update({
      is_finalised: true,
      finalisedAt: Date.now()
    },
      {
        where: { year: req.query.year, season: req.query.season, is_active: true, user_id: req.body.loginedUserid.id }
      },).then(() => response(res, status.DATA_UPDATED, 200, {}))
      .catch(() => response(res, status.DATA_NOT_UPDATED, 500));

  } catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }

}



exports.getZsrmReqFsById = async (req, res) => {

  try {
    const body = req.body;
    const recordExist = await zsemreqfsModel.findOne({ where: { id: req.params.id, is_active: true, user_id: body.loginedUserid.id } });
    if (!recordExist) {
      return response(res, status.DATA_NOT_AVAILABLE, 404);
    }

    return response(res, status.DATA_AVAILABLE, 200, recordExist)

  } catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }

}

exports.deleteZsrmReqFsById = async (req, res) => {
  try {

    const data = await zsemreqfsModel.findOne({
      where: {
        id: req.params.id, is_active: true, user_id: req.body.loginedUserid.id,
        is_finalised: false
      }
    });

    if (!data) {
      return response(res, status.DATA_NOT_AVAILABLE, 404);
    }

    await zsemreqfsModel.update({ is_active: false, deletedAt: Date.now() },
      {
        where: {
          id: req.params.id,
        },
      },).then(() => response(res, status.DATA_DELETED, 200, {}))
      .catch(() => response(res, status.DATA_NOT_DELETED, 500));
  }
  catch (error) {
    return response(res, status.UNEXPECTED_ERROR, 500)
  }
}

//view result on the basis of year and season
exports.viewZsrmReqFsAll = async (req, res) => {

  try {
    // const body = req.body;

    const { page, limit } = req.query;  // Extract pagination params from query string
    console.log(page, limit);

    // let userExist = await userModel.findOne({
    //   where: {
    //     id: body.user_id,
    //   },
    // });
    // console.log("user:", userExist);
    // if(!userExist) {
    //   return response(res, "User Not Found", 404, {});
    // }

    // Calculate offset based on page and limit
    const offset = (page - 1) * limit;


    let data = await db.zsrmReqFs.findAll({
      include: [
        {
          model: cropDataModel,
          attributes: ['crop_name']
        },
        {
          model: varietyModel,
          attributes: ['variety_name']
        },
        {
          model: stateModel,
          attributes: ['state_name']
        },
        {
          model: userModel,
          attributes: ['name']
        }
      ],
      where: {
        year: req.query.year,
        season: req.query.season,
        user_id: req.body.loginedUserid.id,
        is_active: true
      },

      order: [
        [cropDataModel, 'crop_name', 'ASC'],  // Ordering by crop_name in ascending order
        [varietyModel, 'variety_name', 'ASC'],
        [stateModel, 'state_name', 'ASC'],
        [userModel, 'name', 'ASC']
      ],

      attributes: {
        exclude: ['createdAt', 'updatedAt', 'deletedAt', 'crop_type', 'is_active']
      },
      limit: limit,      // Limit the number of records returned
      offset: offset,    // Skip records based on page

    });
    console.log("data found", data);

    if (data.length > 0) {

      const result = data.map((item) => {
        return {
          year: item.year,
          season: item.season,
          user_id: item.user_id,
          crop_name: item.m_crop.crop_name,
          variety_name: item.m_crop_variety.variety_name,
          state_name: item.m_state.state_name,
          user_name: item.user.name,
          unit: item.unit,
          req: parseFloat(item.req),
          ssc: parseFloat(item.ssc),
          doa: parseFloat(item.doa),
          sau: parseFloat(item.sau),
          nsc: parseFloat(item.nsc),
          total: parseFloat(item.total),
          shtorsur: parseFloat(item.shtorsur),
          pvt: parseFloat(item.pvt),
          others: parseFloat(item.others),
          remarks: item.remarks,
          is_finalised: item.is_finalised
        }
      });

      // Get total records for pagination
      const totalRecords = await db.zsrmReqFs.count({
        where: {
          year: req.query.year,
          season: req.query.season,
          user_id: req.body.loginedUserid.id,
          is_active: true
        },
      });

      const totalPages = Math.ceil(totalRecords / limit);  // Calculate total pages

      response(res, status.DATA_AVAILABLE, 200, {
        data: result,
        pagination: {
          currentPage: parseInt(page),
          totalRecords: totalRecords,
          totalPages: totalPages,
          pageSize: parseInt(limit),
        },
      });
    }
    else {
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    }
  } catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }

}
//view result on the basis of year and season crop
exports.viewZsrmReqFsCrop = async (req, res) => {

  try {
    //const body = req.body;
    const { page, limit } = req.query;  // Extract pagination params from query string
    console.log(page, limit);

    // let userExist = await userModel.findOne({
    //   where: {
    //     id: body.user_id,
    //   },
    // });
    // console.log("user:", userExist);
    // if(!userExist) {
    //   return response(res, "User Not Found", 404, {});
    // }


    let cropExist = await cropDataModel.findOne({
      where: {
        crop_code: req.query.crop_code,
      },
    });
    console.log(
      req.query.crop_code)
    console.log("crop:", cropExist);
    if (!cropExist) {
      return response(res, "Crop Not Found", 404, {});
    }

    // Calculate offset based on page and limit
    const offset = (page - 1) * limit;

    let data = await db.zsrmReqFs.findAll({
      include: [
        {
          model: cropDataModel,
          attributes: ['crop_name']
        },
        {
          model: varietyModel,
          attributes: ['variety_name']
        },
        {
          model: stateModel,
          attributes: ['state_name']
        }, {
          model: userModel,
          attributes: ['name']
        }
      ],
      where: {
        year: req.query.year,
        season: req.query.season,
        crop_code: req.query.crop_code,
        user_id: req.body.loginedUserid.id,
        is_active: true
      },
      order: [
        [cropDataModel, 'crop_name', 'ASC'],  // Ordering by crop_name in ascending order
        [varietyModel, 'variety_name', 'ASC'],
        [stateModel, 'state_name', 'ASC'],
        [userModel, 'name', 'ASC']
      ],


      attributes: {
        exclude: ['createdAt', 'updatedAt', 'deletedAt', 'crop_type', 'is_active']
      },
      limit: limit,      // Limit the number of records returned
      offset: offset,    // Skip records based on page
    });
    console.log("data found", data);

    if (data.length > 0) {

      const result = data.map((item) => {
        return {
          year: item.year,
          season: item.season,
          user_id: item.user_id,
          crop_name: item.m_crop.crop_name,
          variety_name: item.m_crop_variety.variety_name,
          state_name: item.m_state.state_name,
          user_name: item.user.name,
          unit: item.unit,
          req: parseFloat(item.req),
          ssc: parseFloat(item.ssc),
          doa: parseFloat(item.doa),
          sau: parseFloat(item.sau),
          nsc: parseFloat(item.nsc),
          total: parseFloat(item.total),
          shtorsur: parseFloat(item.shtorsur),
          pvt: parseFloat(item.pvt),
          others: parseFloat(item.others),
          remarks: item.remarks,
        }
      })
      // Get total records for pagination
      const totalRecords = await db.zsrmReqFs.count({
        where: {
          year: req.query.year,
          season: req.query.season,
          user_id: req.body.loginedUserid.id,
          crop_code: req.query.crop_code,
          is_active: true
        },
      });

      const totalPages = Math.ceil(totalRecords / limit);  // Calculate total pages

      response(res, status.DATA_AVAILABLE, 200, {
        data: result,
        pagination: {
          currentPage: parseInt(page),
          totalRecords: totalRecords,
          totalPages: totalPages,
          pageSize: parseInt(limit),
        },
      });
    }
    else {
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    }
  } catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }

}
//view result on the basis of year and season crop season
exports.viewZsrmReqFsCropVariety = async (req, res) => {

  try {
    // const body = req.body;

    // let userExist = await userModel.findOne({
    //   where: {
    //     id: body.user_id,
    //   },
    // });
    // console.log("user:", userExist);
    // if(!userExist) {
    //   return response(res, "User Not Found", 404, {});
    // }


    let cropExist = await cropDataModel.findOne({
      where: {
        crop_code: req.query.crop_code,
      },
    });
    console.log(
      req.query.crop_code)
    console.log("crop:", cropExist);
    if (!cropExist) {
      return response(res, "Crop Not Found", 404, {});
    }

    let varietyExist = await varietyModel.findOne({
      where: {
        variety_code: req.query.variety_code,
      },
    });
    console.log("varity:", varietyExist);
    if (!varietyExist) {
      return response(res, "Variety Not Found", 404, {});
    }

    let data = await db.zsrmReqFs.findOne({
      include: [
        {
          model: cropDataModel,
          attributes: ['crop_name']
        },
        {
          model: varietyModel,
          attributes: ['variety_name']
        },
        {
          model: stateModel,
          attributes: ['state_name']
        },
        {
          model: userModel,
          attributes: ['name']
        }
      ],
      where: {
        year: req.query.year,
        season: req.query.season,
        crop_code: req.query.crop_code,
        variety_code: req.query.variety_code,
        user_id: req.body.loginedUserid.id,
        is_active: true
      },

      attributes: {
        exclude: ['createdAt', 'updatedAt', 'deletedAt', 'crop_type', 'is_active']
      }
    });
    console.log("data found", data);

    if (data) {
      const result = {
        year: data.year,
        season: data.season,
        user_id: data.user_id,
        crop_name: data.m_crop.crop_name,
        variety_name: data.m_crop_variety.variety_name,
        state_name: data.m_state.state_name,
        user_name: data.user.name,
        unit: data.unit,
        req: parseFloat(data.req),
        ssc: parseFloat(data.ssc),
        doa: parseFloat(data.doa),
        sau: parseFloat(data.sau),
        nsc: parseFloat(data.nsc),
        total: parseFloat(data.total),
        shtorsur: parseFloat(data.shtorsur),
        pvt: parseFloat(data.pvt),
        others: parseFloat(data.others),
        remarks: data.remarks,
      };
      response(res, status.DATA_AVAILABLE, 200, result);
    }
    else {
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    }
  } catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }

}

// data of all indenters on the basis of year and season for seed division report
exports.viewZsrmReqFsAllSD = async (req, res) => {

  try {
    const { page, limit } = req.query;  // Extract pagination params from query string
    console.log(page, limit);

    // let userExist = await userModel.findOne({
    //   where: {
    //     id: body.user_id,
    //   },
    // });
    // console.log("user:", userExist);
    // if(!userExist) {
    //   return response(res, "User Not Found", 404, {});
    // }

    // Calculate offset based on page and limit
    const offset = (page - 1) * limit;


    let data = await db.zsrmReqFs.findAll({
      include: [
        {
          model: cropDataModel,
          attributes: ['crop_name']
        },
        {
          model: varietyModel,
          attributes: ['variety_name', [
            sequelize.fn('SUBSTRING', sequelize.col('not_date'), 1, 4),  // Extract substring from 'variety_name' starting at position 1, length 5
            'not_date'  // Alias the result as 'variety_name_substring'
          ]]
        },
        {
          model: userModel,
          attributes: ['name']
        }
      ],
      where: {
        year: req.query.year,
        season: req.query.season,
        is_active: true
      },

      order: [
        [cropDataModel, 'crop_name', 'ASC'],  // Ordering by crop_name in ascending order
        [varietyModel, 'variety_name', 'ASC'],
        [userModel, 'name', 'ASC']
      ],

      attributes: {
        exclude: ['createdAt', 'updatedAt', 'deletedAt', 'crop_type', 'is_active', 'user_id', 'year', 'season']
      },
      limit: limit,      // Limit the number of records returned
      offset: offset,    // Skip records based on page

    });
    console.log("data found", data);

    if (data.length > 0) {

      const result = data.map((item) => {
        return {
          year: item.year,
          season: item.season,
          user_id: item.user_id,
          crop_name: item.m_crop.crop_name,
          variety_name: item.m_crop_variety.variety_name,
          not_year: item.m_crop_variety.not_date,
          user_name: item.user.name,
          unit: item.unit,
          req: parseFloat(item.req),
          ssc: parseFloat(item.ssc),
          doa: parseFloat(item.doa),
          sau: parseFloat(item.sau),
          nsc: parseFloat(item.nsc),
          total: parseFloat(item.total),
          shtorsur: parseFloat(item.shtorsur),
          pvt: parseFloat(item.pvt),
          others: parseFloat(item.others),
          remarks: item.remarks,
        }
      });

      // Get total records for pagination
      const totalRecords = await db.zsrmReqFs.count({
        where: {
          year: req.query.year,
          season: req.query.season,
          is_active: true
        },
      });

      const totalPages = Math.ceil(totalRecords / limit);  // Calculate total pages

      response(res, status.DATA_AVAILABLE, 200, {
        data: result,
        pagination: {
          currentPage: parseInt(page),
          totalRecords: totalRecords,
          totalPages: totalPages,
          pageSize: parseInt(limit),
        },
      });
    }
    else {
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    }
  } catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }

}

// data of all indenters on the basis of year and season for seed division report 
// indenter wise crop wise req, total and shortorsurplus
exports.viewZsrmReqFsAllSDCropWiseReport = async (req, res) => {
  try {

    const { page, limit } = req.query;  // Extract pagination params from query string
    console.log(page, limit);

    // Calculate offset based on page and limit
    const offset = (page - 1) * limit;


    let data = await db.zsrmReqFs.findAll({
      include: [
        {
          model: cropDataModel,
          attributes: []
        },
        {
          model: userModel,
          attributes: []
        }],
      where: {
        year: req.query.year,
        season: req.query.season,
        is_active: true
      },
      attributes: [
        // Grouping by crop_name and user_name  
        [sequelize.col('user.name'), 'user_name'],
        [sequelize.col('m_crop.crop_name'), 'crop_name'],
        [sequelize.fn('SUM', sequelize.col('zsrm_req_fs.req')), 'req'], // Count of records in 'zsrmReqFs'
        [sequelize.fn('SUM', sequelize.col('zsrm_req_fs.total')), 'total'], // Sum of 'total' from 'zsrmReqFs'
        [sequelize.fn('SUM', sequelize.col('zsrm_req_fs.shtorsur')), 'shtorsur'],
      ],
      group: [[sequelize.col('user.id'), 'user_id'],
      [sequelize.col('m_crop.crop_code'), 'crop_code'],
      [sequelize.col('user.name'), 'user_name'],
      [sequelize.col('m_crop.crop_name'), 'crop_name']], // Grouping by user_id and crop_id (or crop_name depending on your logic)

      limit: limit,  // Limit the number of records returned
      offset: offset,  // Skip records based on page

      order: [
        [cropDataModel, 'crop_name', 'ASC'],  // Ordering by crop_name in ascending order
        [userModel, 'name', 'ASC']
      ],
    });
    console.log("data found", data);

    if (data.length > 0) {

      // Get total records for pagination
      const totalRecords = await db.zsrmReqFs.count({
        distinct: true, // This ensures that we count the distinct groups.
        group: ['user_id', 'crop_code'], // We are grouping by user_id and crop_id.
        where: {
          year: req.query.year,
          season: req.query.season,
          is_active: true
        }
      });
      console.log(totalRecords.length);
      const totalPages = Math.ceil(totalRecords.length / limit);  // Calculate total pages

      response(res, status.DATA_AVAILABLE, 200, {
        data: data,
        pagination: {
          currentPage: parseInt(page),
          totalRecords: totalRecords.length,
          totalPages: totalPages,
          pageSize: parseInt(limit),
        },
      });
    }
    else {
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    }
  } catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }

}

// data on the basis of inputs given year or season or crop or variety in search for any indenter
exports.viewZsrmReqFsAllUpdated = async (req, res) => {

  try {
    // const { search } = req.body;
    const userid = req.body.loginedUserid.id;

    // const { page, limit } = req.query;  // Extract pagination params from query string
    // console.log(page, limit);

    // let userExist = await userModel.findOne({
    //   where: {
    //     id: body.user_id,
    //   },
    // });
    // console.log("user:", userExist);
    // if(!userExist) {
    //   return response(res, "User Not Found", 404, {});
    // }

    // Calculate offset based on page and limit
    //  const offset = (page - 1) * limit;

    let condition = {
      include: [
        {
          model: cropDataModel,
          attributes: ['crop_name']
        },
        {
          model: varietyModel,
          attributes: ['variety_name']
        },
        {
          model: stateModel,
          attributes: ['state_name']
        },
        {
          model: userModel,
          attributes: ['name']
        }
      ],
      where: { user_id: userid, is_active: true },
      order: [[cropDataModel, 'crop_name', 'ASC'],  // Ordering by crop_name in ascending order
      [varietyModel, 'variety_name', 'ASC'],
      [stateModel, 'state_name', 'ASC'],
      [userModel, 'name', 'ASC']],
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'deletedAt', 'crop_type', 'is_active']
      },
      // limit: limit,      // Limit the number of records returned
      // offset: offset, 
    };
    // if (req.body.search) {
    //   if (req.body.search.year) {
    //     condition.where.year = (req.body.search.year);
    //   }
    //   if (req.body.search.season) {
    //     condition.where.season = (req.body.search.season);
    //   }
    //   if (req.body.search.crop_id) {
    //     condition.where.crop_id = (req.body.search.crop_id);
    //   }
    //   if(req.body.search.variety_id) {
    //     condition.where.variety_id = (req.body.search.variety_id);
    //   }
    // } 

    if (req.query.year) {
      condition.where.year = (req.query.year);
    }
    if (req.query.season) {
      condition.where.season = (req.query.season);
    }
    if (req.query.crop_code) {
      condition.where.crop_code = (req.query.crop_code);
    }
    if (req.query.variety_code) {
      condition.where.variety_code = (req.query.variety_code);
    }
    let data = await db.zsrmReqFs.findAll(condition);
    console.log("data found", data);
    if (data.length == 0)
      //res.status(404).json({message: "No data found"})
      return response(res, status.DATA_NOT_AVAILABLE, 404, data)

    const result = data.map((item) => {
      return {
        id: item.id,
        year: item.year,
        season: item.season,
        user_id: item.user_id,
        crop_code: item.crop_code,
        variety_code: item.variety_code,
        crop_name: item.m_crop.crop_name,
        variety_name: item.m_crop_variety.variety_name,
        state_name: item.m_state.state_name,
        user_name: item.user.name,
        unit: item.unit,
        req: parseFloat(item.req),
        ssc: parseFloat(item.ssc),
        doa: parseFloat(item.doa),
        sau: parseFloat(item.sau),
        nsc: parseFloat(item.nsc),
        total: parseFloat(item.total),
        shtorsur: parseFloat(item.shtorsur),
        pvt: parseFloat(item.pvt),
        others: parseFloat(item.others),
        remarks: item.remarks,
        is_finalised: item.is_finalised,
      }
    });



    response(res, status.DATA_AVAILABLE, 200, result,
    );


  } catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }

}
// ZSRM QS requirement and availability form 

exports.addZsrmReqQsDistWise = async (req, res) => {
  try {
    const body = req.body;

    let crop_type = "";
    let unit = "";
    let cropExist = await cropDataModel.findOne({
      where: {
        crop_code: body.crop_code,
      },
    });
    if (!cropExist) {
      return response(res, "Crop Not Found", 404, {});
    }

    let varietyExist = await varietyModel.findOne({
      where: {
        variety_code: body.variety_code,
      },
    });
    if (!varietyExist) {
      return response(res, "Variety Not Found", 404, {});
    }

    let recordExist = await zsrmreqqsModel.findOne({
      where: {
        year: body.year,
        season: body.season,
        crop_code: body.crop_code,
        variety_code: body.variety_code,
        // seedType: body.seed_type,
        user_id: body.loginedUserid.id,
        is_active: true
      },
    });
    if (recordExist) {

      if (await zsrmreqqsdistModel.findOne({ where: { zsrmreqqs_id: recordExist.id, is_active: true } })) {
        return response(res, "Record already exist for this district", 409, {});
      }

      await zsrmreqqsdistModel.create(
        {
          zsrmreqqs_id: recordExist.id,
          district_id: body.district_id,
          csavl: body.district_csavl,
          qsavl: body.district_qsavl,
          totalavl: body.district_totalavl,
          user_id: body.loginedUserid.id,
        }
      ).then(() => response(res, status.DATA_SAVE, 200, recordExist))
        .catch(() => response(res, status.DATA_NOT_SAVE, 404));
    }
    else {
      if ((cropExist.crop_code).slice(0, 1) == 'A') {
        crop_type = 'agriculture';
        unit = 'qt';
      }
      else if ((cropExist.crop_code).slice(0, 1) == 'H') {
        crop_type = 'horticulture'
        unit = 'kg';
      }
      console.log("crop_type:", crop_type);
      console.log("unit:", unit);

      let state = await agencyDetailModel.findOne({
        where: {

          user_id: body.loginedUserid.id,
        },
        attributes: ['state_id']
      }
      )


      let data = await zsrmreqqsModel.create({
        year: body.year,
        season: body.season,
        crop_type: crop_type,
        crop_code: body.crop_code,
        variety_code: body.variety_code,
        user_id: body.loginedUserid.id,
        unit: unit,
        state_id: state.state_id,
        req: body.req,
        sscCs: body.sscCs,
        doaCs: body.doaCs,
        sauCs: body.sauCs,
        nscCs: body.nscCs,
        seedhubsCs: body.seedhubsCs,
        pvtCs: body.pvtCs,
        othersCs: body.othersCs,
        sscQs: body.sscQs,
        doaQs: body.doaQs,
        sauQs: body.sauQs,
        nscQs: body.nscQs,
        seedhubsQs: body.seedhubsQs,
        pvtQs: body.pvtQs,
        othersQs: body.othersQs,
        csavl: body.csavl,
        qsavl: body.qsavl,
        totalavl: body.totalavl,
        shtorsur: body.shtorsur
      })
      if (data) {
        let dataDist = zsrmreqqsdistModel.create(
          {
            zsrmreqqs_id: data.id,
            district_id: body.district_id,
            csavl: body.district_csavl,
            qsavl: body.district_qsavl,
            totalavl: body.district_totalavl,
            user_id: body.loginedUserid.id,
          }
        )
        if (dataDist) {
          return response(res, status.DATA_SAVE, 200, data);
        }
        else {
          return response(res, status.DATA_NOT_SAVE, 404)
        }

      }
    }
  } catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }
}


exports.addZsrmReqQsFinal = async (req, res) => {
  try {
        const body = req.body;
    console.log(body.loginedUserid.id);
    let crop_type = "";
    let unit = "";
    let cropExist = await cropDataModel.findOne({
      where: {
        crop_code: body.crop_code,
      },
    });
    console.log(
      body.crop_code)
    console.log("crop:", cropExist);
    if (!cropExist) {
      return response(res, "Crop Not Found", 404, {});
    }

    let varietyExist = await varietyModel.findOne({
      where: {
        variety_code: body.variety_code,
      },
    });
    console.log("varity:", varietyExist);
    if (!varietyExist) {
      return response(res, "Variety Not Found", 404, {});
    }
    let recordExist = await zsrmreqqsModel.findOne({
      where: {
        year: body.year,
        season: body.season,
        crop_code: body.crop_code,
        variety_code: body.variety_code,
        // seedType: body.seed_type,
        user_id: body.loginedUserid.id,
        is_active: true
      },
    });
    if (recordExist == true) {
      return response(res, "Record already exist", 409, {});
    }
    else {
      if ((cropExist.crop_code).slice(0, 1) == 'A') {
      crop_type = 'agriculture';
      unit = 'qt';
    }
    else if ((cropExist.crop_code).slice(0, 1) == 'H') {
      crop_type = 'horticulture'
      unit = 'kg';
    }
    console.log("crop_type:", crop_type);
    console.log("unit:", unit);

    let state = await agencyDetailModel.findOne({
      where: {
        user_id: body.loginedUserid.id,
      },
      attributes: ['state_id']
    }
    )
    console.log("state_id:", state);

 let data = await zsrmreqqsModel.create({
      year: body.year,
      season: body.season,
      crop_type: crop_type,
      crop_code: body.crop_code,
      variety_code: body.variety_code,
      user_id: body.loginedUserid.id,
      unit: unit,
       req: body.req,
        sscCs: body.sscCs,
        doaCs: body.doaCs,
        sauCs: body.sauCs,
        nscCs: body.nscCs,
        seedhubsCs: body.seedhubsCs,
        pvtCs: body.pvtCs,
        othersCs: body.othersCs,
        sscQs: body.sscQs,
        doaQs: body.doaQs,
        sauQs: body.sauQs,
        nscQs: body.nscQs,
        seedhubsQs: body.seedhubsQs,
        pvtQs: body.pvtQs,
        othersQs: body.othersQs,
        csavl: body.csavl,
        qsavl: body.qsavl,
        totalavl: body.totalavl,
        shtorsur: body.shtorsur,
      state_id: state.state_id,
    });
    if (data) {
      response(res, status.DATA_SAVE, 200, data);
    }
    else {
      return response(res, status.DATA_NOT_SAVE, 404)
    }
    }
  } catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }
}

exports.updateZsrmReqQs = async (req, res) => {
  try {
    const body = req.body;
    console.log(body.loginedUserid.id);
    let recordExist = await zsrmreqqsModel.findOne({
      where: {
        id: req.params.id,
        user_id: body.loginedUserid.id,
        is_active: true,
        is_finalised: false
      },
    });
    if (!recordExist) {
      return response(res, status.DATA_NOT_AVAILABLE, 404);
    }

    await recordExist.update({
      req: body.req,
      sscCs: body.sscCs,
      doaCs: body.doaCs,
      sauCs: body.sauCs,
      nscCs: body.nscCs,
      seedhubsCs: body.seedhubsCs,
      pvtCs: body.pvtCs,
      othersCs: body.othersCs,
      sscQs: body.sscQs,
      doaQs: body.doaQs,
      sauQs: body.sauQs,
      nscQs: body.nscQs,
      seedhubsQs: body.seedhubsQs,
      pvtQs: body.pvtQs,
      othersQs: body.othersQs,
      csavl: body.csavl,
      qsavl: body.qsavl,
      totalavl: body.totalavl,
      shtorsur: body.shtorsur
    }).then(() => response(res, status.DATA_UPDATED, 200, {}))
      .catch(() => response(res, status.DATA_NOT_UPDATED, 500));
  } catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }
}

exports.updateZsrmReqQsDist = async (req, res) => {
  try {
    const body = req.body;
    console.log(body.loginedUserid.id);

    let recordExist = await zsrmreqqsdistModel.findOne({
      where: {
        id: req.params.id,
        user_id: body.loginedUserid.id,
        is_active: true
      },
    });
    console.log(recordExist, 'recordExist');

    if (!recordExist) {
      return response(res, status.DATA_NOT_FOUND, 404);
    }

    const updatedRecord = await recordExist.update({
      csavl: body.district_csavl,
      qsavl: body.district_qsavl,
      totalavl: body.district_totalavl,
    });
    console.log(updatedRecord, 'updatedRecord');
    return response(res, status.DATA_UPDATED, 200, updatedRecord);

  } catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501);
  }
};


exports.deleteZsrmReqQsDistWise = async (req, res) => {
  try {
    const body = req.body;
    const data = await zsrmreqqsdistModel.findOne({ where: { id: req.params.id, is_active: true, user_id: body.loginedUserid.id } });
    const result = {
      zsrmreqqs_id: data.zsrmreqqs_id
    }
    if (!data) {
      return response(res, status.DATA_NOT_AVAILABLE, 404);
    }

    await zsrmreqqsdistModel.update({ is_active: false, deletedAt: Date.now() },
      {
        where: {
          id: req.params.id,
        },
      },).then(() => response(res, status.DATA_DELETED, 200, result))
      .catch(() => response(res, status.DATA_NOT_DELETED, 500));
  }
  catch (error) {
    return response(res, status.UNEXPECTED_ERROR, 500)
  }
}

exports.deleteZsrmReqQs = async (req, res) => {
  try {
    const body = req.body;
    console.log(body.loginedUserid.id);
    const data = await zsrmreqqsModel.findOne({ where: { id: req.params.id, is_active: true, user_id: body.loginedUserid.id } });
    console.log(data);
    if (!data) {
      return response(res, status.DATA_NOT_AVAILABLE, 404);
    }

      await zsrmreqqsModel.update({ is_active: false, deletedAt: Date.now() },
        {
          where: {
            id: req.params.id,
          },
        },).then(() => response(res, status.DATA_DELETED, 200, {}))
        .catch(() => response(res, status.DATA_NOT_DELETED, 500));

  }
  catch (error) {
    console.log(error, 'error')
    return response(res, status.UNEXPECTED_ERROR, 500)
  }
}

exports.viewZsrmReqQs = async (req, res) => {

  try {
    // const { search } = req.body;
    const userid = req.body.loginedUserid.id;

    let condition = {
      include: [
        {
          model: cropDataModel,
          attributes: ['crop_name']
        },
        {
          model: varietyModel,
          attributes: ['variety_name']
        },
        {
          model: stateModel,
          attributes: ['state_name']
        },
        {
          model: userModel,
          attributes: ['name']
        },
      ],
      where: { user_id: userid, is_active: true },
      order: [[cropDataModel, 'crop_name', 'ASC'],  // Ordering by crop_name in ascending order
      [varietyModel, 'variety_name', 'ASC'],
      [stateModel, 'state_name', 'ASC'],
      [userModel, 'name', 'ASC']],
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'deletedAt', 'crop_type', 'is_active']
      },
    };

    if (req.query.year) {
      condition.where.year = (req.query.year);
    }
    if (req.query.season) {
      condition.where.season = (req.query.season);
    }
    if (req.query.crop_code) {
      condition.where.crop_code = (req.query.crop_code);
    }
    if (req.query.variety_code) {
      condition.where.variety_code = (req.query.variety_code);
    }

    let data = await zsrmreqqsModel.findAll(condition);
    if (data.length == 0)
      //res.status(404).json({message: "No data found"})
      return response(res, status.DATA_NOT_AVAILABLE, 404)

    const result = data.map((item) => {
      return {
        id: item.id,
        year: item.year,
        season: item.season,
        user_id: item.user_id,
        crop_code: item.crop_code,
        variety_code: item.variety_code,
        crop_name: item.m_crop.crop_name,
        variety_name: item.m_crop_variety.variety_name,
        state_id: item.state_id,
        state_name: item.m_state.state_name,
        user_name: item.user.name,
        unit: item.unit,
        req: parseFloat(item.req),
        sscCs: parseFloat(item.sscCs),
        sscQs: parseFloat(item.sscQs),
        doaCs: parseFloat(item.doaCs),
        doaQs: parseFloat(item.doaQs),
        sauCs: parseFloat(item.sauCs),
        sauQs: parseFloat(item.sauQs),
        nscCs: parseFloat(item.nscCs),
        nscQs: parseFloat(item.nscQs),
        seedhubsCs: parseFloat(item.seedhubsCs),
        seedhubsQs: parseFloat(item.seedhubsQs),
        pvtCs: parseFloat(item.pvtCs),
        pvtQs: parseFloat(item.pvtQs),
        othersCs: parseFloat(item.othersCs),
        othersQs: parseFloat(item.othersQs),
        csavl: parseFloat(item.csavl),
        qsavl: parseFloat(item.qsavl),
        totalavl: parseFloat(item.totalavl),
        shtorsur: parseFloat(item.shtorsur),
        is_finalised: item.is_finalised
      }
    });

    response(res, status.DATA_AVAILABLE, 200, result);


  } catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }

}

// exports.viewZsrmReqQsDistWise = async (req, res) => {
//   try {
//     // const { search } = req.body;
//     const userid = req.body.loginedUserid.id;

//     const { zsrmreqqs_id } = req.query;  // Extract pagination params from query string

//     let condition = {
//       include: [
//         {
//           model: districtModel,
//           attributes: ['district_name']
//         },
//       ],
//       where: { user_id: userid, zsrmreqqs_id: zsrmreqqs_id, is_active: true },
//       order: [[districtModel, 'district_name', 'ASC'],  // Ordering by crop_name in ascending order
//       ],
//       attributes:
//       {
//         exclude: ['createdAt', 'updatedAt', 'deletedAt', 'is_active']
//       }
//     };
//     let data = await db.zsrmReqQsDistWise.findAll(condition);

//     let dataSum = await db.zsrmReqQsDistWise.findAll({
//       where: {
//         user_id: userid, zsrmreqqs_id: zsrmreqqs_id, is_active: true
//       },
//       attributes: [
//         // Grouping by crop_name and user_name  
//         [sequelize.fn('SUM', sequelize.col('csavl')), 'csavl'], // Count of records in 'zsrmReqFs'
//         [sequelize.fn('SUM', sequelize.col('qsavl')), 'qsavl'], // Count of records in 'zsrmReqFs'
//         [sequelize.fn('SUM', sequelize.col('totalavl')), 'totalavl'], // Sum of 'total' from 'zsrmReqFs'
//       ],
//       group: [[sequelize.col('zsrmreqqs_id'), 'zsrmreqqs_id'],], // Grouping by user_id and crop_id (or crop_name depending on your logic)
//     });

//     // if (data.length == 0)
//     // //res.status(404).json({message: "No data found"})
//     // return response(res, status.DATA_NOT_AVAILABLE, 404)

//     const result = data.map((item) => {
//       return {
//         id: item.id,
//         csavl: parseFloat(item.csavl),
//         qsavl: parseFloat(item.qsavl),
//         totalavl: parseFloat(item.totalavl),
//         district_id: item.district_id,
//         district_name: item.m_district.district_name
//       }
//     });
//     console.log(result, 'totalavl')
//     response(res, status.DATA_AVAILABLE, 200, {
//       result: result,
//       total_req: dataSum.length ? dataSum[0].req : 0,
//       total_avl: dataSum.length ? dataSum[0].avl : 0,
//       total_shtorsur: dataSum.length ? dataSum[0].shtorsur : 0,
//     });
//   } catch (error) {
//     console.log(error);
//     return response(res, status.UNEXPECTED_ERROR, 501)
//   }

// }
exports.finaliseZsrmReqQs = async (req, res) => {
  try {
    const recordsExist = await zsrmreqqsModel.findAll({ where: { year: req.query.year, season: req.query.season, is_active: true, user_id: req.body.loginedUserid.id, } });
    if (recordsExist.length === 0) {
      return response(res, status.DATA_NOT_AVAILABLE, 404);
    }
    await zsrmreqqsModel.update({
      is_finalised: true,
      finalisedAt: Date.now()
    },
      {
        where: { year: req.query.year, season: req.query.season, is_active: true, user_id: req.body.loginedUserid.id }
      },).then(() => response(res, status.DATA_UPDATED, 200, {}))
      .catch(() => response(res, status.DATA_NOT_UPDATED, 500));

  } catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }

}

//srr 

exports.addSrp = async (req, res) => {
  try {

    const body = req.body;
    let crop_type = "";
    let unit = "";
    let cropExist = await cropDataModel.findOne({
      where: {
        crop_code: body.crop_code,
      },
    });
    console.log(
      body.crop_code)
    console.log("crop:", cropExist);
    if (!cropExist) {
      return response(res, "Crop Not Found", 404, {});
    }

    let varietyExist = await varietyModel.findOne({
      where: {
        variety_code: body.variety_code,
      },
    });
    console.log("varity:", varietyExist);
    if (!varietyExist) {
      return response(res, "Variety Not Found", 404, {});
    }

    let recordExist = await srpModel.findOne({
      where: {
        year: body.year,
        season: body.season,
        crop_code: body.crop_code,
        variety_code: body.variety_code,
        user_id: body.loginedUserid.id,
        is_active: true
      },
    });
    if (recordExist) {
      return response(res, "Record already exist", 404, {});
    }
    let state = await agencyDetailModel.findOne({
      where: {

        user_id: body.loginedUserid.id,
      },
      attributes: ['state_id']
    }
    )
    console.log("state_id:", state);

    let data = await srpModel.create({
      year: body.year,
      season: body.season,
      crop_type: crop_type,
      crop_code: body.crop_code,
      crop_group_code: cropExist.group_code,
      variety_code: body.variety_code,
      user_id: body.loginedUserid.id,
      unit: 'qt',
      proposedAreaUnderVariety: body.proposedAreaUnderVariety,
      seedrate: body.seedrate,
      SRRTargetbySTATE: body.SRRTargetbySTATE,
      seedRequired: body.seedRequired,
      qualityquant: body.qualityquant,
      certifiedquant: body.certifiedquant,
      doa: body.doa,
      ssfs: body.ssfs,
      saus: body.saus,
      ssc: body.ssc,
      nsc: body.nsc,
      othergovpsu: body.othergovpsu,
      coop: body.coop,
      seedhub: body.seedhub,
      pvt: body.pvt,
      others: body.others,
      total: body.total,
      shtorsur: body.shtorsur,
      SMRKeptBSToFS: body.SMRKeptBSToFS,
      SMRKeptFSToCS: body.SMRKeptFSToCS,
      FSRequiredtomeettargetsofCS: body.FSRequiredtomeettargetsofCS,
      BSRequiredtomeettargetsofFS: body.BSRequiredtomeettargetsofFS,
      state_id: state.state_id,

    })
    console.log("data added", data);
    if (data) {
      return response(res, status.DATA_SAVE, 200, data);
    }
    else {
      return response(res, status.DATA_NOT_SAVE, 404)
    }

  }
  catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }
}

exports.deleteSrp = async (req, res) => {
  try {
    const data = await srpModel.findOne({
      where: {
        id: req.params.id, is_active: true,
        is_finalised: false, user_id: req.body.loginedUserid.id
      }
    });
    if (!data) {
      return response(res, status.DATA_NOT_AVAILABLE, 404);
    }
    await srpModel.update({ is_active: false, deletedAt: Date.now() },
      {
        where: {
          id: req.params.id,
        },
      },).then(() => response(res, status.DATA_DELETED, 200, {}))
      .catch(() => response(res, status.DATA_NOT_DELETED, 500));
  }
  catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }

}

exports.updateSrp = async (req, res) => {

  try {
    const body = req.body;
    const recordExist = await srpModel.findOne({
      where: {
        id: req.params.id, is_active: true,
        is_finalised: false, user_id: body.loginedUserid.id
      }
    });
    if (!recordExist) {
      return response(res, status.DATA_NOT_AVAILABLE, 404);
    }

    await srpModel.update({
      proposedAreaUnderVariety: body.proposedAreaUnderVariety,
      seedrate: body.seedrate,
      SRRTargetbySTATE: body.SRRTargetbySTATE,
      seedRequired: body.seedRequired,
      qualityquant: body.qualityquant,
      certifiedquant: body.certifiedquant,
      doa: body.doa,
      ssfs: body.ssfs,
      saus: body.saus,
      ssc: body.ssc,
      nsc: body.nsc,
      othergovpsu: body.othergovpsu,
      coop: body.coop,
      seedhub: body.seedhub,
      pvt: body.pvt,
      others: body.others,
      total: body.total,
      shtorsur: body.shtorsur,
      SMRKeptBSToFS: body.SMRKeptBSToFS,
      SMRKeptFSToCS: body.SMRKeptFSToCS,
      FSRequiredtomeettargetsofCS: body.FSRequiredtomeettargetsofCS,
      BSRequiredtomeettargetsofFS: body.BSRequiredtomeettargetsofFS,
      updated_at: Date.now(),
    },
      {
        where: {
          id: req.params.id,
        },
      },).then(() => response(res, status.DATA_UPDATED, 200, {}))
      .catch(() => response(res, status.DATA_NOT_UPDATED, 500));

  } catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }

}

exports.finaliseSrp = async (req, res) => {

  try {

    const recordsExist = await srpModel.findAll({ where: { year: req.query.year, is_active: true, user_id: req.body.loginedUserid.id } });
    if (recordsExist.length === 0) {
      return response(res, status.DATA_NOT_AVAILABLE, 404);
    }
    await srpModel.update({
      is_finalised: true,
      finalisedAt: Date.now()
    },
      {
        where: { year: req.query.year, is_active: true, user_id: req.body.loginedUserid.id }
      },).then(() => response(res, status.DATA_UPDATED, 200, {}))
      .catch(() => response(res, status.DATA_NOT_UPDATED, 500));

  } catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }

}


exports.viewSrpById = async (req, res) => {
  try {
    const data = await srpModel.findOne({
      where: { id: req.params.id, is_active: true, user_id: req.body.loginedUserid.id },
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'deletedAt', 'crop_type', 'is_active']
      },
    },

    );
    if (!data) {
      return response(res, status.DATA_NOT_AVAILABLE, 404);
    }
    return response(res, status.DATA_AVAILABLE, 200, data);
  }
  catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }
}

//all records filter year, season, crop_code, variety_code
exports.viewSrpAll = async (req, res) => {
  try {
    const userid = req.body.loginedUserid.id;



    let condition = {
      include: [
        {
          model: cropDataModel,
          attributes: ['crop_name', 'srr']
        },
        {
          model: varietyModel,
          attributes: [
            'variety_name',
            'status',
            'developed_by',

            // Correct usage of SUBSTRING function for extracting the first 4 characters from 'not_date'
            [
              sequelize.fn('SUBSTRING', sequelize.col('not_date'), 1, 4),
              'not_date'
            ],
            'is_notified'

            // // // CASE statement for 'matuarity_day_from' field
            // [
            //   sequelize.literal(`
            //     CASE
            //       WHEN "matuarity_day_from" = '1' THEN 'Early'
            //       WHEN "matuarity_day_from" = '2' THEN 'Medium'
            //       WHEN "matuarity_day_from" = '3' THEN 'Late'
            //       WHEN "matuarity_day_from" = '4' THEN 'Perennial'
            //       ELSE 'NA'
            //     END
            //   `),
            //   'maturity_type'
            // ],

            // CASE statement for 'is_notified' field
            // [
            //   sequelize.literal(`
            //     CASE
            //       WHEN "is_notified" = 1 THEN 'Notified'
            //       ELSE 'Non-Notified'
            //     END
            //   `),
            //   'notification_status'
            // ]
          ]
        },
        {
          model: db.cropCharactersticsModel,
          attributes: ['matuarity_day_from']
        },
        {
          model: stateModel,
          attributes: ['state_name']
        },
        {
          model: userModel,
          attributes: ['name']
        }
      ],
      where: { user_id: userid, is_active: true },
      order: [['year', 'ASC'],
      ['season', 'ASC'],
      [cropDataModel, 'crop_name', 'ASC'],  // Ordering by crop_name in ascending order
      [varietyModel, 'variety_name', 'ASC'],
      [stateModel, 'state_name', 'ASC'],
      [userModel, 'name', 'ASC']],
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'deletedAt', 'crop_type', 'is_active',]
      },

    };
    if (req.query.year) {
      condition.where.year = (req.query.year);
    }
    if (req.query.season) {
      condition.where.season = (req.query.season);
    }

    if (req.query.crop_code) {
      condition.where.crop_code = (req.query.crop_code);
    }
    if (req.query.variety_code) {
      condition.where.variety_code = (req.query.variety_code);
    }
    let data = await srpModel.findAll(condition);

    if (data.length == 0)
      //res.status(404).json({message: "No data found"})
      return response(res, status.DATA_NOT_AVAILABLE, 404)

    const result = data.map((item) => {

      return {
        id: item.id,
        year: item.year,
        season: item.season,
        crop_code: item.crop_code,
        variety_code: item.variety_code,
        crop_name: item.m_crop.crop_name,
        variety_name: item.m_crop_variety.variety_name,
        not_year: item.m_crop_variety.not_date,
        status: item.m_crop_variety.status,
        developed_by: item.m_crop_variety.developed_by,
        maturity_type: item.m_variety_characteristic ?
          (item.m_variety_characteristic.matuarity_day_from == '1' ? 'Early' :
            (item.m_variety_characteristic.matuarity_day_from == '2' ? 'Medium' :
              (item.m_variety_characteristic.matuarity_day_from == '3' ? 'Late' :
                (item.m_variety_characteristic.matuarity_day_from == '4' ? 'Perennial' : 'NA')
              )
            )) : 'NA',
        notification_status: item.m_crop_variety.is_notified == 1 ? 'Notified' : 'Non-Notified',
        unit: item.unit,
        proposedAreaUnderVariety: parseFloat(item.proposedAreaUnderVariety),
        seedrate: parseFloat(item.seedrate),
        SRRTargetbyGOI: parseFloat(item.m_crop.srr) || 0.0,
        SRRTargetbySTATE: parseFloat(item.SRRTargetbySTATE),
        seedRequired: parseFloat(item.seedRequired),
        qualityquant: parseFloat(item.qualityquant),
        certifiedquant: parseFloat(item.certifiedquant),
        doa: parseFloat(item.doa),
        ssfs: parseFloat(item.ssfs),
        saus: parseFloat(item.saus),
        ssc: parseFloat(item.ssc),
        nsc: parseFloat(item.nsc),
        othergovpsu: parseFloat(item.othergovpsu),
        coop: parseFloat(item.coop),
        seedhub: parseFloat(item.seedhub),
        pvt: parseFloat(item.pvt),
        others: parseFloat(item.others),
        total: parseFloat(item.total),
        shtorsur: parseFloat(item.shtorsur),
        SMRKeptBSToFS: parseFloat(item.SMRKeptBSToFS),
        SMRKeptFSToCS: parseFloat(item.SMRKeptFSToCS),
        FSRequiredtomeettargetsofCS: parseFloat(item.FSRequiredtomeettargetsofCS),
        BSRequiredtomeettargetsofFS: parseFloat(item.BSRequiredtomeettargetsofFS),
        is_finalised: item.is_finalised
      }
    });


    response(res, status.DATA_AVAILABLE, 200, result);


  } catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }
}


exports.getSrpYear = async (req, res) => {

  try {
    // const { search } = req.body;
    const userid = req.body.loginedUserid.id;
    let data = await srpModel.findAll({
      attributes: [[sequelize.fn('DISTINCT', sequelize.col('year')), 'year'],],
      distinct: true,
      where: { user_id: userid, is_active: true },
      order: [['year', 'Desc']],
    });
    console.log("data found", data);
    if (data.length == 0)
      //res.status(404).json({message: "No data found"})
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    response(res, status.DATA_AVAILABLE, 200, data);
  } catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }

}
exports.getSrpYearSD = async (req, res) => {

  try {
    // const { search } = req.body;
    const userid = req.body.loginedUserid.id;
    let data = await srpModel.findAll({
      attributes: [[sequelize.fn('DISTINCT', sequelize.col('year')), 'year'],],
      distinct: true,
      where: { is_active: true },
      order: [['year', 'Desc']],
    });
    console.log("data found", data);
    if (data.length == 0)
      //res.status(404).json({message: "No data found"})
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    response(res, status.DATA_AVAILABLE, 200, data);
  } catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }

}

exports.getSrpSeason = async (req, res) => {

  try {
    // const { search } = req.body;
    const userid = req.body.loginedUserid.id;
    let data = await srpModel.findAll({
      attributes: [[sequelize.fn('DISTINCT', sequelize.col('season')), 'season'],],
      distinct: true,
      where: { user_id: userid, is_active: true, year: req.query.year },
      order: [['season', 'Asc']],
    });
    console.log("data found", data);
    if (data.length == 0)
      //res.status(404).json({message: "No data found"})
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    response(res, status.DATA_AVAILABLE, 200, data);
  } catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }

}
exports.getSrpSeasonSD = async (req, res) => {

  try {
    // const { search } = req.body;
    const userid = req.body.loginedUserid.id;
    let data = await srpModel.findAll({
      attributes: [[sequelize.fn('DISTINCT', sequelize.col('season')), 'season'],],
      distinct: true,
      where: { is_active: true, year: req.query.year },
      order: [['season', 'Asc']],
    });
    console.log("data found", data);
    if (data.length == 0)
      //res.status(404).json({message: "No data found"})
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    response(res, status.DATA_AVAILABLE, 200, data);
  } catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }

}

exports.getSrpCropType = async (req, res) => {

  try {
    // const { search } = req.body;
    const userid = req.body.loginedUserid.id;
    let data = await srpModel.findAll({
      attributes: [[sequelize.fn('DISTINCT', sequelize.col('crop_type')), 'crop_type'],],
      distinct: true,
      where: { user_id: userid, is_active: true, year: req.query.year, season: req.query.season },
      order: [['crop_type', 'Asc']],
    });
    console.log("data found", data);
    if (data.length == 0)
      //res.status(404).json({message: "No data found"})
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    response(res, status.DATA_AVAILABLE, 200, data);
  } catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }

}
exports.getSrpCropTypeSD = async (req, res) => {

  try {
    // const { search } = req.body;
    const userid = req.body.loginedUserid.id;
    let data = await srpModel.findAll({
      attributes: [[sequelize.fn('DISTINCT', sequelize.col('crop_type')), 'crop_type'],],
      distinct: true,
      where: { is_active: true, year: req.query.year, season: req.query.season },
      order: [['crop_type', 'Asc']],
    });
    console.log("data found", data);
    if (data.length == 0)
      //res.status(404).json({message: "No data found"})
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    response(res, status.DATA_AVAILABLE, 200, data);
  } catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }

}

exports.getSrpCropTypeSDYearBased = async (req, res) => {

  try {
    // const { search } = req.body;
    const userid = req.body.loginedUserid.id;
    let data = await srpModel.findAll({
      attributes: [[sequelize.fn('DISTINCT', sequelize.col('crop_type')), 'crop_type'],],
      distinct: true,
      where: { is_active: true, year: req.query.year },
      order: [['crop_type', 'Asc']],
    });
    console.log("data found", data);
    if (data.length == 0)
      //res.status(404).json({message: "No data found"})
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    response(res, status.DATA_AVAILABLE, 200, data);
  } catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }

}

exports.getSrpCrop = async (req, res) => {

  try {
    // const { search } = req.body;
    const userid = req.body.loginedUserid.id;
    let condition = {

      include: [
        {
          model: cropDataModel,
          attributes: []
        },
      ],
      where: {
        user_id: userid, is_active: true, year: req.query.year
      },
      order: [[cropDataModel, 'crop_name', 'ASC'],  // Ordering by crop_name in ascending order
      ],

      attributes: [[sequelize.col('crop_name'), 'crop_name'],
      [sequelize.col('seedrollingplan.crop_code'), 'crop_code']
      ],
      distinct: true, // Ensure distinct rows based on crop_name and crop_code
      group: [
        sequelize.col('seedrollingplan.crop_code'),
        sequelize.col('crop_name')
      ] // This groups by crop_name and crop_code to ensure uniqueness
    }
    if (req.query.season) {
      condition.where.season = req.query.season;
    }

    let data = await srpModel.findAll(condition);
    console.log("data found", data);
    if (data.length == 0)
      //res.status(404).json({message: "No data found"})
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    response(res, status.DATA_AVAILABLE, 200, data);
  } catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }

}

exports.getSrpStateSD = async (req, res) => {

  try {
    // const { search } = req.body;

    let condition = {

      include: [
        {
          model: userModel,
          attributes: []
        },
      ],
      where: {
        is_active: true, year: req.query.year,

      },
      order: [[userModel, 'name', 'ASC'],  // Ordering by crop_name in ascending order
      ],

      attributes: [[sequelize.col('name'), 'name'],
      [sequelize.col('seedrollingplan.user_id'), 'user_id']
      ],
      distinct: true, // Ensure distinct rows based on crop_name and crop_code
      group: [
        sequelize.col('seedrollingplan.user_id'),
        sequelize.col('name')
      ] // This groups by crop_name and crop_code to ensure uniqueness
    }
    if (req.query.season) {
      condition.where.season = req.query.season;
    }
    let data = await srpModel.findAll(condition);
    console.log("data found", data);
    if (data.length == 0)
      //res.status(404).json({message: "No data found"})
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    response(res, status.DATA_AVAILABLE, 200, data);
  } catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }

}


exports.viewSrpAllMasterReport = async (req, res) => {
  try {

    let filters = await ConditionCreator.filters(req.body.search);
    let condition = {
      include: [
        {
          model: cropDataModel,
          attributes: ['crop_name', 'srr']
        },
        {
          model: varietyModel,
          attributes: [
            'variety_name',
            'status',
            'developed_by',

            // Correct usage of SUBSTRING function for extracting the first 4 characters from 'not_date'
            [
              sequelize.fn('SUBSTRING', sequelize.col('not_date'), 1, 4),
              'not_date'
            ],
          ]
        },
      ],
      where: filters,
      order: [['year', 'ASC'],
      ['season', 'ASC'],
      [cropDataModel, 'crop_name', 'ASC'],  // Ordering by crop_name in ascending order
      [varietyModel, 'variety_name', 'ASC'],],
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'deletedAt', 'crop_type', 'is_active',]
      },

    };
    condition.where.user_id = req.body.loginedUserid.id;
    condition.where.is_active = true;
    let data = await srpModel.findAll(condition);
    console.log(data.sql);
    console.log("data found", data);
    if (data.length == 0)
      //res.status(404).json({message: "No data found"})
      return response(res, status.DATA_NOT_AVAILABLE, 404)

    const result = data.map((item) => {
      return {
        year: item.year,
        season: item.season,
        crop_code: item.crop_code,
        variety_code: item.variety_code,
        crop_name: item.m_crop.crop_name,
        variety_name: item.m_crop_variety.variety_name,
        not_year: item.m_crop_variety.not_date,
        proposedAreaUnderVariety: parseFloat(item.proposedAreaUnderVariety),
        seedrate: parseFloat(item.seedrate),
        SRRTargetbyGOI: parseFloat(item.m_crop.srr) || 0.0,
        SRRTargetbySTATE: parseFloat(item.SRRTargetbySTATE),
        seedRequired: parseFloat(item.seedRequired),
        qualityquant: parseFloat(item.qualityquant),
        certifiedquant: parseFloat(item.certifiedquant),
        doa: parseFloat(item.doa),
        ssfs: parseFloat(item.ssfs),
        saus: parseFloat(item.saus),
        ssc: parseFloat(item.ssc),
        nsc: parseFloat(item.nsc),
        othergovpsu: parseFloat(item.othergovpsu),
        coop: parseFloat(item.coop),
        seedhub: parseFloat(item.seedhub),
        pvt: parseFloat(item.pvt),
        others: parseFloat(item.others),
        total: parseFloat(item.total),
        shtorsur: parseFloat(item.shtorsur),
        SMRKeptBSToFS: parseFloat(item.SMRKeptBSToFS),
        SMRKeptFSToCS: parseFloat(item.SMRKeptFSToCS),
        FSRequiredtomeettargetsofCS: parseFloat(item.FSRequiredtomeettargetsofCS),
        BSRequiredtomeettargetsofFS: parseFloat(item.BSRequiredtomeettargetsofFS),
      }
    });
    //  console.log(result,'result')
    // Get total records for pagination
    response(res, status.DATA_AVAILABLE, 200, result);
  } catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }
}

exports.viewSrpAllCropWiseSummary = async (req, res) => {
  try {

    let filters = await ConditionCreator.filters(req.body.search);
    let condition = {
      include: [
        {
          model: cropDataModel,
          attributes: []
        },],
      where: filters,
      attributes: [
        // Grouping by crop_name and user_name  
        [sequelize.col('year'), 'year'],
        [sequelize.col('seedrollingplan.season'), 'season'], [sequelize.col('seedrollingplan.crop_code'), 'crop_code'],
        [sequelize.col('m_crop.crop_name'), 'crop_name'],
        [sequelize.fn('SUM', sequelize.col('seedRequired')), 'req'], // Count of records in 'zsrmReqFs'
        [sequelize.fn('SUM', sequelize.col('total')), 'total'], // Sum of 'total' from 'zsrmReqFs'
        [sequelize.fn('SUM', sequelize.col('shtorsur')), 'shtorsur'],
      ],
      group: [[sequelize.col('year'), 'year'],
      [sequelize.col('seedrollingplan.season'), 'season'],
      [sequelize.col('seedrollingplan.crop_code'), 'crop_code'], [sequelize.col('m_crop.crop_name'), 'crop_name']
      ],
      order: [
        ['year', 'ASC'],
        ['season', 'ASC'],
        [sequelize.col('m_crop.crop_name'), 'ASC'],
      ],
    }

    condition.where.user_id = req.body.loginedUserid.id;
    condition.where.is_active = true;
    let data = await srpModel.findAll(condition);
    console.log("data found", data);
    if (data.length == 0)
      //res.status(404).json({message: "No data found"})
      return response(res, status.DATA_NOT_AVAILABLE, 404)

    response(res, status.DATA_AVAILABLE, 200, data);


  } catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }
}

exports.viewSrpAllCropWise = async (req, res) => {
  try {
    let filters = await ConditionCreator.filters(req.body.search);
    let condition = {
      include: [
        {
          model: cropDataModel,
          attributes: []
        },],
      where: filters,
      attributes: [
        // Grouping by crop_name and user_name  
        [sequelize.col('year'), 'year'],
        [sequelize.col('seedrollingplan.season'), 'season'], [sequelize.col('seedrollingplan.crop_code'), 'crop_code'],
        [sequelize.col('m_crop.crop_name'), 'crop_name'],
        [sequelize.fn('SUM', sequelize.col('proposedAreaUnderVariety')), 'AreaUnderVariety'],
        [sequelize.fn('SUM', sequelize.col('seedRequired')), 'SeedRequired'],
        [sequelize.fn('SUM', sequelize.col('doa')), 'doa'],
        [sequelize.fn('SUM', sequelize.col('ssfs')), 'ssfs'],
        [sequelize.fn('SUM', sequelize.col('ssc')), 'ssc'],
        [sequelize.fn('SUM', sequelize.col('nsc')), 'nsc'],
        [sequelize.fn('SUM', sequelize.col('saus')), 'saus'],
        [sequelize.fn('SUM', sequelize.col('othergovpsu')), 'othergovpsu'],
        [sequelize.fn('SUM', sequelize.col('coop')), 'coop'],
        [sequelize.fn('SUM', sequelize.col('pvt')), 'pvt'],
        [sequelize.fn('SUM', sequelize.col('seedhub')), 'seedhub'],
        [sequelize.fn('SUM', sequelize.col('others')), 'others'],
        [sequelize.fn('SUM', sequelize.col('total')), 'total'], // Sum of 'total' from 'zsrmReqFs'
        [sequelize.fn('SUM', sequelize.col('shtorsur')), 'shtorsur'],
        [sequelize.fn('SUM', sequelize.col('BSRequiredtomeettargetsofFS')), 'BSRequiredtomeettargetsofFS'],
        [sequelize.fn('SUM', sequelize.col('FSRequiredtomeettargetsofCS')), 'FSRequiredtomeettargetsofCS'],
      ],
      group: [[sequelize.col('year'), 'year'],
      [sequelize.col('seedrollingplan.season'), 'season'],
      [sequelize.col('seedrollingplan.crop_code'), 'crop_code'], [sequelize.col('m_crop.crop_name'), 'crop_name']
      ],
      //  [sequelize.col('m_crop.crop_name'), 'crop_name']], // Grouping by user_id and crop_id (or crop_name depending on your logic)
      order: [
        ['year', 'ASC'],
        ['season', 'ASC'],
        [sequelize.col('m_crop.crop_name'), 'ASC'],
      ],
    }
    condition.where.user_id = req.body.loginedUserid.id;
    condition.where.is_active = true;
    let data = await srpModel.findAll(condition);
    console.log("data found", data);
    if (data.length == 0)
      //res.status(404).json({message: "No data found"})
      return response(res, status.DATA_NOT_AVAILABLE, 404)

    // Send the response with the data and totals
    response(res, status.DATA_AVAILABLE, 200, data);



  } catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }
}

exports.viewSrpAllSD = async (req, res) => {
  try {
    let filters = await ConditionCreator.filters(req.body.search);
    let condition = {
      include: [
        {
          model: cropDataModel,
          attributes: ['crop_name', 'srr']
        },
        {
          model: varietyModel,
          attributes: [
            'variety_name',
            'status',
            'developed_by',

            // Correct usage of SUBSTRING function for extracting the first 4 characters from 'not_date'
            [
              sequelize.fn('SUBSTRING', sequelize.col('not_date'), 1, 4),
              'not_date'
            ],
            'is_notified'

            // // // CASE statement for 'matuarity_day_from' field
            // [
            //   sequelize.literal(`
            //     CASE
            //       WHEN "matuarity_day_from" = '1' THEN 'Early'
            //       WHEN "matuarity_day_from" = '2' THEN 'Medium'
            //       WHEN "matuarity_day_from" = '3' THEN 'Late'
            //       WHEN "matuarity_day_from" = '4' THEN 'Perennial'
            //       ELSE 'NA'
            //     END
            //   `),
            //   'maturity_type'
            // ],

            // CASE statement for 'is_notified' field
            // [
            //   sequelize.literal(`
            //     CASE
            //       WHEN "is_notified" = 1 THEN 'Notified'
            //       ELSE 'Non-Notified'
            //     END
            //   `),
            //   'notification_status'
            // ]
          ]
        },
        {
          model: db.cropCharactersticsModel,
          attributes: ['matuarity_day_from']
        },
        {
          model: userModel,
          attributes: ['name']
        }
      ],
      where: filters,
      order: [[userModel, 'name', 'ASC'],
      ['year', 'ASC'],
      ['season', 'ASC'],
      [cropDataModel, 'crop_name', 'ASC'],  // Ordering by crop_name in ascending order
      [varietyModel, 'variety_name', 'ASC'],
      ],
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'deletedAt', 'crop_type', 'is_active',]
      }
    };
    condition.where.is_active = true;
    let data = await srpModel.findAll(condition);
    console.log("data found", data);
    if (data.length == 0)
      //res.status(404).json({message: "No data found"})
      return response(res, status.DATA_NOT_AVAILABLE, 404)

    const result = data.map((item) => {
      console.log(item.m_crop_variety.not_year);
      return {
        id: item.id,
        user_id: item.user_id,
        user_name: item.user.name,
        year: item.year,
        season: item.season,
        crop_code: item.crop_code,
        crop_name: item.m_crop.crop_name,
        variety_code: item.variety_code,
        variety_name: item.m_crop_variety.variety_name,
        not_year: item.m_crop_variety.not_date,
        status: item.m_crop_variety.status,
        developed_by: item.m_crop_variety.developed_by,
        maturity_type: item.m_variety_characteristic ?
          (item.m_variety_characteristic.matuarity_day_from == '1' ? 'Early' :
            (item.m_variety_characteristic.matuarity_day_from == '2' ? 'Medium' :
              (item.m_variety_characteristic.matuarity_day_from == '3' ? 'Late' :
                (item.m_variety_characteristic.matuarity_day_from == '4' ? 'Perennial' : 'NA')
              )
            )) : 'NA',
        notification_status: item.m_crop_variety.is_notified == 1 ? 'Notified' : 'Non-Notified',
        unit: item.unit,
        proposedAreaUnderVariety: parseFloat(item.proposedAreaUnderVariety),
        seedrate: parseFloat(item.seedrate),
        SRRTargetbyGOI: parseFloat(item.m_crop.srr),
        SRRTargetbySTATE: parseFloat(item.SRRTargetbySTATE),
        seedRequired: parseFloat(item.seedRequired),
        qualityquant: parseFloat(item.qualityquant),
        certifiedquant: parseFloat(item.certifiedquant),
        doa: parseFloat(item.doa),
        ssfs: parseFloat(item.ssfs),
        saus: parseFloat(item.saus),
        ssc: parseFloat(item.ssc),
        nsc: parseFloat(item.nsc),
        othergovpsu: parseFloat(item.othergovpsu),
        coop: parseFloat(item.coop),
        seedhub: parseFloat(item.seedhub),
        pvt: parseFloat(item.pvt),
        others: parseFloat(item.others),
        total: parseFloat(item.total),
        shtorsur: parseFloat(item.shtorsur),
        SMRKeptBSToFS: parseFloat(item.SMRKeptBSToFS),
        SMRKeptFSToCS: parseFloat(item.SMRKeptFSToCS),
        FSRequiredtomeettargetsofCS: parseFloat(item.FSRequiredtomeettargetsofCS),
        BSRequiredtomeettargetsofFS: parseFloat(item.BSRequiredtomeettargetsofFS),
      }
    });
    response(res, status.DATA_AVAILABLE, 200, result);


  } catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }
}

exports.viewSrpAllCropWiseSD = async (req, res) => {
  try {
    let filters = await ConditionCreator.filters(req.body.search);
    let condition = {
      include: [
        {
          model: cropDataModel,
          attributes: []
        },
        {
          model: userModel,
          attributes: []
        }],
      where: filters,
      attributes: [
        [sequelize.col('seedrollingplan.user_id'), 'user_id'],
        [sequelize.col('user.name'), 'name'],
        [sequelize.col('year'), 'year'],
        [sequelize.col('seedrollingplan.season'), 'season'], [sequelize.col('seedrollingplan.crop_code'), 'crop_code'],
        [sequelize.col('m_crop.crop_name'), 'crop_name'],
        [sequelize.fn('SUM', sequelize.col('proposedAreaUnderVariety')), 'AreaUnderVariety'],
        [sequelize.fn('SUM', sequelize.col('seedRequired')), 'SeedRequired'],
        [sequelize.fn('SUM', sequelize.col('doa')), 'doa'],
        [sequelize.fn('SUM', sequelize.col('ssfs')), 'ssfs'],
        [sequelize.fn('SUM', sequelize.col('ssc')), 'ssc'],
        [sequelize.fn('SUM', sequelize.col('nsc')), 'nsc'],
        [sequelize.fn('SUM', sequelize.col('saus')), 'saus'],
        [sequelize.fn('SUM', sequelize.col('othergovpsu')), 'othergovpsu'],
        [sequelize.fn('SUM', sequelize.col('coop')), 'coop'],
        [sequelize.fn('SUM', sequelize.col('pvt')), 'pvt'],
        [sequelize.fn('SUM', sequelize.col('seedhub')), 'seedhub'],
        [sequelize.fn('SUM', sequelize.col('others')), 'others'],
        [sequelize.fn('SUM', sequelize.col('total')), 'total'], // Sum of 'total' from 'zsrmReqFs'
        [sequelize.fn('SUM', sequelize.col('shtorsur')), 'shtorsur'],
        [sequelize.fn('SUM', sequelize.col('BSRequiredtomeettargetsofFS')), 'BSRequiredtomeettargetsofFS'],
        [sequelize.fn('SUM', sequelize.col('FSRequiredtomeettargetsofCS')), 'FSRequiredtomeettargetsofCS'],
      ],
      group: [[sequelize.col('seedrollingplan.user_id'), 'user_id'],
      [sequelize.col('user.name'), 'name'],
      [sequelize.col('year'), 'year'],
      [sequelize.col('seedrollingplan.season'), 'season'],
      [sequelize.col('seedrollingplan.crop_code'), 'crop_code'], [sequelize.col('m_crop.crop_name'), 'crop_name']
      ],
      order: [
        [sequelize.col('user.name'), 'ASC'],
        ['year', 'ASC'],
        ['season', 'ASC'],
        [sequelize.col('m_crop.crop_name'), 'ASC'],
      ],
    }
    condition.where.is_active = true;

    let data = await srpModel.findAll(condition);
    console.log("data found", data);
    if (data.length == 0)
      //res.status(404).json({message: "No data found"})
      return response(res, status.DATA_NOT_AVAILABLE, 404)

    // Get total records for pagination

    response(res, status.DATA_AVAILABLE, 200, data);


  } catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }
}


exports.viewSrpAllCropWiseSummarySD = async (req, res) => {
  try {
    let filters = await ConditionCreator.filters(req.body.search);
    let condition = {
      include: [
        {
          model: cropDataModel,
          attributes: []
        },
        {
          model: userModel,
          attributes: []
        }],
      where: filters,
      attributes: [
        [sequelize.col('seedrollingplan.user_id'), 'user_id'],
        [sequelize.col('user.name'), 'name'],
        [sequelize.col('year'), 'year'],
        [sequelize.col('seedrollingplan.season'), 'season'], [sequelize.col('seedrollingplan.crop_code'), 'crop_code'],
        [sequelize.col('m_crop.crop_name'), 'crop_name'],
        [sequelize.fn('SUM', sequelize.col('seedRequired')), 'req'], // Count of records in 'zsrmReqFs'
        [sequelize.fn('SUM', sequelize.col('total')), 'total'], // Sum of 'total' from 'zsrmReqFs'
        [sequelize.fn('SUM', sequelize.col('shtorsur')), 'shtorsur'],
      ],
      group: [
        [sequelize.col('seedrollingplan.user_id'), 'user_id'],
        [sequelize.col('user.name'), 'name'],
        [sequelize.col('year'), 'year'],
        [sequelize.col('seedrollingplan.season'), 'season'],
        [sequelize.col('seedrollingplan.crop_code'), 'crop_code'], [sequelize.col('m_crop.crop_name'), 'crop_name']
      ],
      order: [
        [sequelize.col('user.name'), 'ASC'],
        ['year', 'ASC'],
        ['season', 'ASC'],
        [sequelize.col('m_crop.crop_name'), 'ASC'],
      ],
    }
    condition.where.is_active = true;

    let data = await srpModel.findAll(condition);
    console.log("data found", data);
    if (data.length == 0)
      //res.status(404).json({message: "No data found"})
      return response(res, status.DATA_NOT_AVAILABLE, 404)

    response(res, status.DATA_AVAILABLE, 200, data);


  } catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }
}

exports.dashboardSrpCardCount = async (req, res) => {
  let filters = await ConditionCreator.filters(req.body.search);
  try {
    let condition = {
      where: filters,
      attributes: [
        [sequelize.col('year'), 'year'],
        [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('crop_code'))), 'crops'],
        [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('variety_code'))), 'varieties'],
        [sequelize.fn('SUM', sequelize.col('seedRequired')), 'req'],
        [sequelize.fn('SUM', sequelize.col('total')), 'total'],
        [sequelize.fn('SUM', sequelize.col('certifiedquant')), 'certifiedquant'],
        [sequelize.fn('SUM', sequelize.col('qualityquant')), 'qualityquant'],
        [sequelize.fn('SUM', sequelize.col('shtorsur')), 'shtorsur'],
      ],
      group: [
        [sequelize.col('year'), 'year']],

    }
    condition.where.is_active = true;

    let data = await srpModel.findAll(condition);
    console.log("data found", data);
    if (data.length == 0)
      //res.status(404).json({message: "No data found"})
      return response(res, status.DATA_NOT_AVAILABLE, 404)

    response(res, status.DATA_AVAILABLE, 200, data);


  } catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }
}

exports.dashboardCropWiseData = async (req, res) => {
  try {
    let filters = await ConditionCreator.filters(req.body.search);
    let condition = {
      include: [
        {
          model: cropDataModel,
          attributes: []
        },],
      where: filters,
      attributes: [
        [sequelize.col('seedrollingplan.crop_code'), 'crop_code'],
        [sequelize.col('m_crop.crop_name'), 'crop_name'],
        [sequelize.fn('SUM', sequelize.col('seedRequired')), 'req'], // Count of records in 'zsrmReqFs'
        [sequelize.fn('SUM', sequelize.col('total')), 'total'], // Sum of 'total' from 'zsrmReqFs'
        [sequelize.fn('SUM', sequelize.col('shtorsur')), 'shtorsur'],
      ],
      group: [
        [sequelize.col('seedrollingplan.crop_code'), 'crop_code'], [sequelize.col('m_crop.crop_name'), 'crop_name']
      ],
      order: [
        [sequelize.col('m_crop.crop_name'), 'ASC'],
      ],
    }
    condition.where.is_active = true;

    let data = await srpModel.findAll(condition);
    console.log("data found", data);
    if (data.length == 0)
      //res.status(404).json({message: "No data found"})
      return response(res, status.DATA_NOT_AVAILABLE, 404)

    response(res, status.DATA_AVAILABLE, 200, data);


  } catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }
}

exports.dashboardPieData = async (req, res) => {
  try {
    let filters = await ConditionCreator.filters(req.body.search);
    let condition = {
      where: filters,
      attributes: [
        [sequelize.col('year'), 'year'],
        [sequelize.fn('SUM', sequelize.col('doa')), 'doa'],
        [sequelize.fn('SUM', sequelize.col('ssfs')), 'ssfs'],
        [sequelize.fn('SUM', sequelize.col('ssc')), 'ssc'],
        [sequelize.fn('SUM', sequelize.col('nsc')), 'nsc'],
        [sequelize.fn('SUM', sequelize.col('saus')), 'saus'],
        [sequelize.fn('SUM', sequelize.col('othergovpsu')), 'othergovpsu'],
        [sequelize.fn('SUM', sequelize.col('coop')), 'coop'],
        [sequelize.fn('SUM', sequelize.col('pvt')), 'pvt'],
        [sequelize.fn('SUM', sequelize.col('seedhub')), 'seedhub'],
        [sequelize.fn('SUM', sequelize.col('others')), 'others'],
        [sequelize.fn('SUM', sequelize.col('total')), 'total'],
      ],
      group: [
        [sequelize.col('year'), 'year']
      ],
      order: [
        ['year', 'ASC'],
      ],
    }
    condition.where.is_active = true;

    let data = await srpModel.findAll(condition);
    console.log("data found", data);
    let result = {
      doa: 0.00,
      ssfs: 0.00,
      ssc: 0.00,
      nsc: 0.00,
      saus: 0.00,
      othergovpsu: 0.00,
      coop: 0.00,
      pvt: 0.00,
      seedhub: 0.00,
      others: 0.00,
    };
    result.doa = ((parseFloat(data[0].doa) / parseFloat(data[0].total)) * 100).toFixed(2) || 0.00;
    result.ssfs = ((parseFloat(data[0].ssfs) / parseFloat(data[0].total)) * 100).toFixed(2) || 0.00;
    result.ssc = ((parseFloat(data[0].ssc) / parseFloat(data[0].total)) * 100).toFixed(2) || 0.00;
    result.nsc = ((parseFloat(data[0].nsc) / parseFloat(data[0].total)) * 100).toFixed(2) || 0.00;
    result.saus = ((parseFloat(data[0].saus) / parseFloat(data[0].total)) * 100).toFixed(2) || 0.00;
    result.othergovpsu = ((parseFloat(data[0].othergovpsu) / parseFloat(data[0].total)) * 100).toFixed(2) || 0.00;
    result.coop = ((parseFloat(data[0].coop) / parseFloat(data[0].total)) * 100).toFixed(2) || 0.00;
    result.pvt = ((parseFloat(data[0].pvt) / parseFloat(data[0].total)) * 100).toFixed(2) || 0.00;
    result.seedhub = ((parseFloat(data[0].seedhub) / parseFloat(data[0].total)) * 100).toFixed(2) || 0.00;
    result.others = ((parseFloat(data[0].others) / parseFloat(data[0].total)) * 100).toFixed(2) || 0.00;
    console.log("totals found", result);

    if (data.length == 0)
      //res.status(404).json({message: "No data found"})
      return response(res, status.DATA_NOT_AVAILABLE, 404)

    // Get total records for pagination

    response(res, status.DATA_AVAILABLE, 200, result);


  } catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }
}

exports.dashboardCropVarietyWiseData = async (req, res) => {
  try {
    //  let filters = await ConditionCreator.filters(req.body.search); 
    let condition = {
      include: [
        {
          model: varietyModel,
          attributes: []
        },],
      where: {
        year: req.body.search.year,
        crop_code: req.body.search.crop_code
      },
      attributes: [
        [sequelize.col('seedrollingplan.variety_code'), 'variety_code'],
        [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
        [sequelize.fn('SUM', sequelize.col('seedRequired')), 'req'], // Count of records in 'zsrmReqFs'
        [sequelize.fn('SUM', sequelize.col('total')), 'total'], // Sum of 'total' from 'zsrmReqFs'
        [sequelize.fn('SUM', sequelize.col('shtorsur')), 'shtorsur'],
      ],
      group: [
        [sequelize.col('seedrollingplan.variety_code'), 'variety_code'],
        [sequelize.col('m_crop_variety.variety_name'), 'variety_name']
      ],
      order: [
        [sequelize.col('m_crop_variety.variety_name'), 'ASC'],
      ],
    }
    condition.where.is_active = true;

    let data = await srpModel.findAll(condition);
    console.log("data found", data);
    if (data.length == 0)
      //res.status(404).json({message: "No data found"})
      return response(res, status.DATA_NOT_AVAILABLE, 404)

    response(res, status.DATA_AVAILABLE, 200, data);


  } catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }
}

exports.dashboardStateWiseData = async (req, res) => {
  try {
    let filters = await ConditionCreator.filters(req.body.search);
    let condition = {
      include: [
        {
          model: userModel,
          attributes: []
        }],
      where: filters,
      attributes: [
        [sequelize.col('seedrollingplan.user_id'), 'user_id'],
        [sequelize.col('user.name'), 'name'],
        [sequelize.fn('SUM', sequelize.col('seedRequired')), 'req'], // Count of records in 'zsrmReqFs'
        [sequelize.fn('SUM', sequelize.col('total')), 'total'], // Sum of 'total' from 'zsrmReqFs'
        [sequelize.fn('SUM', sequelize.col('shtorsur')), 'shtorsur'],
      ],
      group: [
        [sequelize.col('seedrollingplan.user_id'), 'user_id'],
        [sequelize.col('user.name'), 'name'],
      ],
      order: [
        [sequelize.col('user.name'), 'ASC'],
      ],
    }
    condition.where.is_active = true;

    let data = await srpModel.findAll(condition);
    console.log("data found", data);
    if (data.length == 0)
      //res.status(404).json({message: "No data found"})
      return response(res, status.DATA_NOT_AVAILABLE, 404)

    response(res, status.DATA_AVAILABLE, 200, data);


  } catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }
}

exports.dashboardStateCropWiseData = async (req, res) => {
  try {
    let filters = await ConditionCreator.filters(req.body.search);
    let condition = {
      include: [
        {
          model: cropDataModel,
          attributes: []
        },],
      where: filters,
      attributes: [
        [sequelize.col('seedrollingplan.crop_code'), 'crop_code'],
        [sequelize.col('m_crop.crop_name'), 'crop_name'],
        [sequelize.fn('SUM', sequelize.col('seedRequired')), 'req'], // Count of records in 'zsrmReqFs'
        [sequelize.fn('SUM', sequelize.col('total')), 'total'], // Sum of 'total' from 'zsrmReqFs'
        [sequelize.fn('SUM', sequelize.col('shtorsur')), 'shtorsur'],
      ],
      group: [
        [sequelize.col('seedrollingplan.crop_code'), 'crop_code'], [sequelize.col('m_crop.crop_name'), 'crop_name']
      ],
      order: [
        [sequelize.col('m_crop.crop_name'), 'ASC'],
      ],
    }
    condition.where.is_active = true;

    let data = await srpModel.findAll(condition);
    console.log("data found", data);
    if (data.length == 0)
      //res.status(404).json({message: "No data found"})
      return response(res, status.DATA_NOT_AVAILABLE, 404)

    response(res, status.DATA_AVAILABLE, 200, data);


  } catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }
}

exports.srpStatusReportCheckStatus = async (req, res) => {
  try {


    let conditionSrp = {
      where: { year: req.year, user_id: req.user_id, is_active: true },
      attributes: ['is_finalised', 'finalisedAt']
    };


    // Fetch data from srp model
    const srpData = await srpModel.findOne(conditionSrp);

    let status = "Pending";
    let submit_date = "";
    console.log("user_id", srpData)
    // Check conditions based on fetched data
    if (srpData) {
      // Check if both conditions (icar_freeze and is_final_submit) are met
      console.log("is_finalised", srpData.is_finalised)
      if (srpData.is_finalised === true) {
        status = "Completed";
        submit_date = srpData.finalisedAt || "";
      } else {
        status = "Working";
        // submit_date = indentData.updated_at || "";
      }
    }
    else {
      status = "Pending";
      submit_date = "";
    }
    console.log(req.user_id, status, submit_date)

    return { status, submit_date };

  } catch (error) {
    console.error('Error:', error);
    return response(res, status.UNEXPECTED_ERROR, 501, []);
  }
};
exports.srpStatusReport = async (req, res) => {
  try {
    let userData = await userModel.findAll({
      attributes: [
        ['id', 'user_id'],
        ['name', 'name'],
      ],
      order: [
        ['name', 'ASC'],
      ],
      where: {
        user_type: 'IN', is_active: 1
      }
    })
    if (userData && userData.length) {
      let final_array = [];
      for (let key of userData) {
        if (key && key.user_id) {
          let request = {
            "year": req.query.year,
            "user_id": key.user_id
          }
          let data = await this.srpStatusReportCheckStatus(request);
          final_array.push({
            "user_id": key.user_id,
            "name": key.name,
            "status": data.status,
            "submit_date": data.submit_date
          })
        }
      }
      return response(res, status.DATA_AVAILABLE, 200, final_array);
    } else {
      return response(res, status.DATA_NOT_AVAILABLE, 201, {})
    }
  } catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501, [])
  }
}

exports.addSrr = async (req, res) => {
  try {

    const body = req.body;
    let crop_type = "";
    let unit = "";

    let startYear = parseInt(body.year.split('-')[0]);

    // Calculate the next year range
    let nextYear = `${startYear + 1}-${(startYear + 2).toString().slice(-2)}`;

    let cropExist = await cropDataModel.findOne({
      where: {
        crop_code: body.crop_code,
      },
    });
    console.log(
      body.crop_code)
    console.log("crop:", cropExist);
    if (!cropExist) {
      return response(res, "Crop Not Found", 404, {});
    }

    let recordExist = await srrModel.findOne({
      where: {
        year: body.year,
        crop_code: body.crop_code,
        seed_type: body.seed_type,
        user_id: body.loginedUserid.id,
        is_active: true
      },
    });


    console.log(nextYear);
    let recordExistForNext = await srrModel.findOne({
      where: {
        year: nextYear,
        crop_code: body.crop_code,
        seed_type: body.seed_type,
        user_id: body.loginedUserid.id,
      },
    });

    if (recordExist && recordExistForNext)
      return response(res, "Seed Roll Plan already exist for this year", 409, {});


    if (!recordExist)  //first time entry case     
    {

      if ((cropExist.crop_code).slice(0, 1) == 'A') {
        crop_type = 'agriculture';
        unit = 'qt';
      }
      else if ((cropExist.crop_code).slice(0, 1) == 'H') {
        crop_type = 'horticulture'
        unit = 'kg';
      }
      let state = await agencyDetailModel.findOne({
        where: {
          user_id: body.loginedUserid.id,
        },
        attributes: ['state_id']
      }
      )
      const data = await srrModel.create({
        year: body.year,
        crop_type: crop_type,
        crop_code: body.crop_code,
        crop_group_code: cropExist.group_code,
        seed_type: body.seed_type,
        user_id: body.loginedUserid.id,
        state_id: state.state_id,
        unit: unit,
        plannedAreaUnderCropInHa: 0.00,
        seedRateInQtPerHt: 0.00,
        plannedSeedQuanDis: 0.00,
        plannedSrr: 0.00,
        areaSownUnderCropInHa: body.areaSownUnderCropInHa,
        seedRateAcheived: body.seedRateAcheived,
        seedQuanDis: body.seedQuanDis,
        acheivedSrr: body.acheivedSrr,
        prevYearId: null,
      });
      const nextYearData = await srrModel.create({
        year: nextYear,
        crop_type: crop_type,
        crop_code: body.crop_code,
        crop_group_code: cropExist.group_code,
        seed_type: body.seed_type,
        user_id: body.loginedUserid.id,
        state_id: state.state_id,
        unit: unit,
        plannedAreaUnderCropInHa: body.plannedAreaUnderCropInHa,
        seedRateInQtPerHt: body.seedRateInQtPerHt,
        plannedSeedQuanDis: body.plannedSeedQuanDis,
        plannedSrr: body.plannedSrr,
        areaSownUnderCropInHa: 0.00,
        seedRateAcheived: 0.00,
        seedQuanDis: 0.00,
        acheivedSrr: 0.00,
        prevYearId: data.id
      });
      return response(res, status.DATA_SAVE, 200, {});
    }
    else {
      await recordExist.update({
        areaSownUnderCropInHa: body.areaSownUnderCropInHa,
        seedRateAcheived: body.seedRateAcheived,
        seedQuanDis: body.seedQuanDis,
        acheivedSrr: body.acheivedSrr,
        update_at: Date.now(),
      },);
      const nextYearData = await srrModel.create({
        year: nextYear,
        crop_type: recordExist.crop_type,
        crop_code: recordExist.crop_code,
        crop_group_code: recordExist.crop_group_code,
        seed_type: recordExist.seed_type,
        user_id: recordExist.user_id,
        unit: recordExist.unit,
        state_id: recordExist.state_id,
        plannedAreaUnderCropInHa: body.plannedAreaUnderCropInHa,
        seedRateInQtPerHt: body.seedRateInQtPerHt,
        plannedSeedQuanDis: body.plannedSeedQuanDis,
        plannedSrr: body.plannedSrr,
        areaSownUnderCropInHa: 0.00,
        seedRateAcheived: 0.00,
        seedQuanDis: 0.00,
        acheivedSrr: 0.00,
        prevYearId: recordExist.id
      });

      response(res, status.DATA_SAVE, 200, {});
    }
  }
  catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }
}

exports.viewSrrByYearCropSeedType = async (req, res) => {
  try {
    const userid = req.body.loginedUserid.id;
    let startYear = parseInt(req.query.year.split('-')[0]);
    // Calculate the next year range
    let nextYear = `${startYear + 1}-${(startYear + 2).toString().slice(-2)}`;
    let cropExist = await cropDataModel.findOne({
      where: {
        crop_code: req.query.crop_code,
      },
    });
    let recordExist = await srrModel.findOne({
      where: {
        year: req.query.year,
        crop_code: req.query.crop_code,
        seed_type: req.query.seed_type,
        user_id: userid,
        is_active: true
      },
    });

    let recordExistForNext = await srrModel.findOne({
      where: {
        year: nextYear,
        crop_code: req.query.crop_code,
        seed_type: req.query.seed_type,
        user_id: userid,
        is_active: true
      },
    });
    if (!recordExist) {
      data = {
        srr: cropExist.srr,
        plannedAreaUnderCropInHa: 0.00,
        seedRateInQtPerHt: 0.00,
        plannedSeedQuanDis: 0.00,
        plannedSrr: 0.00
      }
      return response(res, status.DATA_AVAILABLE, 200, data)
    }
    else if (recordExist && !recordExistForNext) {
      data = {
        srr: cropExist.srr,
        plannedAreaUnderCropInHa: recordExist.plannedAreaUnderCropInHa,
        seedRateInQtPerHt: recordExist.seedRateInQtPerHt,
        plannedSeedQuanDis: recordExist.plannedSeedQuanDis,
        plannedSrr: recordExist.plannedSrr
      }
      return response(res, status.DATA_AVAILABLE, 200, data)
    }
    else if (recordExist && recordExistForNext) {
      //   let condition = {
      //     include: [
      //       {
      //         model: srrModel,
      //         as: 'nextYearData',
      //         required: true, 
      //         attributes: ['plannedAreaUnderCropInHa','seedRateInQtPerHt','plannedSeedQuanDis', 'plannedSrr',]
      //       },
      //       {
      //         model: cropDataModel,
      //         attributes: ['crop_name', 'srr']
      //       },
      //     ],
      //     where: {   
      //       year:req.query.year,
      //       crop_code: req.query.crop_code,
      //       seed_type: req.query.seed_type,
      //       user_id: userid, is_active: true},
      //     attributes: {
      //       exclude: ['createdAt', 'updatedAt', 'deletedAt', 'crop_type', 'is_active',  ]
      //     }
      //   };
      //   let data = await srrModel.findOne(condition);
      //  const result = {    
      //     id: data.id,
      //     year: data.year,
      //     crop_code: data.crop_code,
      //     crop_name: data.m_crop.crop_name,
      //     srr: data.m_crop.srr,
      //     seed_type: data.seed_type,
      //     unit: data.unit,
      //     areaSownUnderCropInHa:parseFloat(data.areaSownUnderCropInHa),
      //     seedRateAcheived: parseFloat(data.seedRateAcheived),
      //     seedQuanDis: parseFloat(data.seedQuanDis),
      //     acheivedSrr: parseFloat(data.acheivedSrr),
      //     NextYearAreaUnderCropInHa: parseFloat(data.nextYearData.plannedAreaUnderCropInHa),
      //     NextYearseedRateInQtPerHt: parseFloat(data.nextYearData.seedRateInQtPerHt),
      //     NextYearSeedQuanDis: parseFloat(data.nextYearData.plannedSeedQuanDis),
      //     NextYearSrr: parseFloat(data.nextYearData.plannedSrr),
      //   };
      //   // Get total records for pagination
      return response(res, "Record already exist", 409, {});


    }
  } catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }
}

exports.viewSrrAll = async (req, res) => {
  try {
    const userid = req.body.loginedUserid.id;
    const { page, limit } = req.query;  // Extract pagination params from query string
    console.log(page, limit);
    const offset = (page - 1) * limit;

    let condition = {
      include: [
        {
          model: srrModel,
          as: 'nextYearData',
          required: true,
          attributes: ['plannedAreaUnderCropInHa', 'seedRateInQtPerHt', 'plannedSeedQuanDis', 'plannedSrr',]
        },
        {
          model: cropDataModel,
          attributes: ['crop_name', 'srr']
        },
        {
          model: stateModel,
          attributes: ['state_name']
        },
        {
          model: userModel,
          attributes: ['name']
        }
      ],
      where: { user_id: userid, is_active: true },
      order: [['year', 'ASC'],
      [cropDataModel, 'crop_name', 'ASC'],  // Ordering by crop_name in ascending order
      ['seed_type', 'ASC'],
      [stateModel, 'state_name', 'ASC'],
      [userModel, 'name', 'ASC']],
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'deletedAt', 'crop_type', 'is_active',]
      },
      limit: limit,      // Limit the number of records returned
      offset: offset,
    };
    if (req.query.year) {
      condition.where.year = (req.query.year);
    }
    if (req.query.crop_code) {
      condition.where.crop_code = (req.query.crop_code);
    }
    if (req.query.seed_type) {
      condition.where.seed_type = (req.query.seed_type);
    }
    let data = await srrModel.findAll(condition);
    console.log("data found", data);
    if (data.length == 0)
      //res.status(404).json({message: "No data found"})
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    let count = 0

    const result = data.map((item) => {
      return {
        id: item.id,
        year: item.year,
        crop_code: item.crop_code,
        crop_name: item.m_crop.crop_name,
        srr: item.m_crop.srr,
        seed_type: item.seed_type,
        unit: item.unit,
        targetAreaUnderCropInHa: parseFloat(item.plannedAreaUnderCropInHa),
        targetSeedRateInQtPerHt: parseFloat(item.seedRateInQtPerHt),
        targetSeedQuanDis: parseFloat(item.plannedSeedQuanDis),
        targetSrr: parseFloat(item.plannedSrr),
        areaSownUnderCropInHa: parseFloat(item.areaSownUnderCropInHa),
        seedRateAcheived: parseFloat(item.seedRateAcheived),
        seedQuanDis: parseFloat(item.seedQuanDis),
        acheivedSrr: parseFloat(item.acheivedSrr),
        NextYearAreaUnderCropInHa: parseFloat(item.nextYearData.plannedAreaUnderCropInHa),
        NextYearseedRateInQtPerHt: parseFloat(item.nextYearData.seedRateInQtPerHt),
        NextYearSeedQuanDis: parseFloat(item.nextYearData.plannedSeedQuanDis),
        NextYearSrr: parseFloat(item.nextYearData.plannedSrr),
      }
   
    });
   console.log(result),"   console.log(result)"
    // Get total records for pagination
    let totalRecords = await srrModel.count(condition);
    const totalPages = Math.ceil(totalRecords / limit);  // Calculate total pages
    response(res, status.DATA_AVAILABLE, 200, {
      data: result,
      pagination: {
        currentPage: parseInt(page),
        totalRecords: totalRecords,
        totalPages: totalPages,
        pageSize: parseInt(limit),
      },
    });


  } catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }
}

exports.viewSrrAllReport = async (req, res) => {
  try {
    const userid = req.body.loginedUserid.id;
    const { page, limit } = req.query;  // Extract pagination params from query string
    console.log(page, limit);
    const offset = (page - 1) * limit;

    let condition = {
      include: [
        {
          model: srrModel,
          as: 'nextYearData',
          required: true,
          attributes: ['plannedAreaUnderCropInHa', 'seedRateInQtPerHt', 'plannedSeedQuanDis', 'plannedSrr',]
        },
        {
          model: cropDataModel,
          attributes: ['crop_name', 'srr']
        },
        {
          model: stateModel,
          attributes: ['state_name']
        },
        {
          model: userModel,
          attributes: ['name']
        }
      ],
      where: { user_id: userid, is_active: true },
      order: [['year', 'ASC'],
      [cropDataModel, 'crop_name', 'ASC'],  // Ordering by crop_name in ascending order
      ['seed_type', 'ASC'],
      [stateModel, 'state_name', 'ASC'],
      [userModel, 'name', 'ASC']],
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'deletedAt', 'crop_type', 'is_active',]
      },
      limit: limit,      // Limit the number of records returned
      offset: offset,
    };
    // Handle multiple years (if provided in the body)
    if (req.body.year) {
      condition.where.year = Array.isArray(req.body.year) ? { [Op.in]: req.body.year } : req.body.year;
    }

    // Handle multiple crop_codes (if provided in the body)
    if (req.body.crop_code) {
      condition.where.crop_code = Array.isArray(req.body.crop_code) ? { [Op.in]: req.body.crop_code } : req.body.crop_code;
    }

    // Handle seed_type if provided in the body
    if (req.body.seed_type) {
      condition.where.seed_type = req.body.seed_type;
    }
    let data = await srrModel.findAll(condition);
    console.log("data found", data);
    if (data.length == 0)
      //res.status(404).json({message: "No data found"})
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    const result = data.map((item) => {
      return {
        id: item.id,
        year: item.year,
        crop_code: item.crop_code,
        crop_name: item.m_crop.crop_name,
        srr: item.m_crop.srr,
        seed_type: item.seed_type,
        unit: item.unit,
        plannedAreaUnderCropInHa: parseFloat(item.plannedAreaUnderCropInHa),
        seedRateInQtPerHt: parseFloat(item.seedRateInQtPerHt),
        plannedSeedQuanDis: parseFloat(item.plannedSeedQuanDis),
        plannedSrr: parseFloat(item.plannedSrr),
        areaSownUnderCropInHa: parseFloat(item.areaSownUnderCropInHa),
        seedRateAcheived: parseFloat(item.seedRateAcheived),
        seedQuanDis: parseFloat(item.seedQuanDis),
        acheivedSrr: parseFloat(item.acheivedSrr),
        NextYearAreaUnderCropInHa: parseFloat(item.nextYearData.plannedAreaUnderCropInHa),
        NextYearseedRateInQtPerHt: parseFloat(item.nextYearData.seedRateInQtPerHt),
        NextYearSeedQuanDis: parseFloat(item.nextYearData.plannedSeedQuanDis),
        NextYearSrr: parseFloat(item.nextYearData.plannedSrr),
      }
    });

    // Get total records for pagination
    let totalRecords = await srrModel.count(condition);
    const totalPages = Math.ceil(totalRecords / limit);  // Calculate total pages
    response(res, status.DATA_AVAILABLE, 200, {
      data: result,
      pagination: {
        currentPage: parseInt(page),
        totalRecords: totalRecords,
        totalPages: totalPages,
        pageSize: parseInt(limit),
      },
    });


  } catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }
}


// exports.deleteSrr = async (req, res) => {
//   try{
//     const data = await srrModel.findOne({ where: { id: req.params.id, is_active:true, user_id:req.body.loginedUserid.id}});
//     if (!data) {
//       return response(res, status.DATA_NOT_AVAILABLE, 404);
//     }
//     await data.update({ is_active: false,  deletedAt: Date.now()},);
//      await srrModel.update({
//       is_active: false,  deletedAt: Date.now()
//      },
//      {where: {
//       prevYearId:data.id
//      }});
//       return response(res, status.DATA_DELETED, 200, {});
//   }
//   catch (error) {
//     console.log(error);
//     return response(res, status.UNEXPECTED_ERROR, 501)
//   }

//   }

exports.updateSrr = async (req, res) => {

  try {
    const body = req.body;
    const recordExist = await srrModel.findOne({ where: { id: req.params.id, is_active: true, user_id: body.loginedUserid.id } });
    if (!recordExist) {
      return response(res, status.DATA_NOT_AVAILABLE, 404);
    }

    await recordExist.update({
      areaSownUnderCropInHa: body.areaSownUnderCropInHa,
      seedRateAcheived: body.seedRateAcheived,
      seedQuanDis: body.seedQuanDis,
      acheivedSrr: body.acheivedSrr,
      update_at: Date.now(),
    },);
    await srrModel.update({
      plannedAreaUnderCropInHa: body.plannedAreaUnderCropInHa,
      seedRateInQtPerHt: body.seedRateInQtPerHt,
      plannedSeedQuanDis: body.plannedSeedQuanDis,
      plannedSrr: body.plannedSrr,
      update_at: Date.now(),
    },
      {
        where: {
          prevYearId: recordExist.id
        }
      });
    return response(res, status.DATA_UPDATED, 200, {});

  } catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }

}


exports.viewSrrAllReportSD = async (req, res) => {
  try {
    // Extract pagination params from query string
    let { page = 1, limit = 10, year } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;

    // Ensure `year` is provided and parse it
    let startYear = parseInt(year.split('-')[0]);

    // Calculate the previous and previous-to-previous year ranges
    let previousYear = `${startYear - 1}-${(startYear).toString().slice(-2)}`;
    let previousToPreviousYear = `${startYear - 2}-${(startYear - 1).toString().slice(-2)}`;

    console.log(previousYear, previousToPreviousYear);

    // Condition to fetch data for 2020-21, 2021-22, and 2022-23
    let condition = {
      include: [
        {
          model: userModel,
          attributes: [],
        },
        {
          model: cropGroupModel,
          attributes: [],
        },
        {
          model: cropDataModel,
          attributes: [],
        },
      ],
      where: {
        year: { [Op.in]: [previousToPreviousYear, previousYear, year] },
        is_active: true,
      },
      order: [
        [userModel, 'name', 'ASC'],
        [cropGroupModel, 'group_name', 'ASC'],
        [cropDataModel, 'crop_name', 'ASC'],
      ],
      attributes: [
        //[sequelize.col('year'), 'year'],
        [sequelize.col('user.name'), 'user_name'],
        [sequelize.col('m_crop_group.group_name'), 'group_name'],
        [sequelize.col('m_crop.crop_name'), 'crop_name'],
        [sequelize.col('seed_type'), 'seed_type'],
        [sequelize.col('m_crop.srr'), 'srr'],
        //[sequelize.col('acheivedSrr'), 'acheivedSrr'],
        //Corrected SUM with CASE WHEN and achievedSrr from srrModel

        [
          sequelize.fn("SUM", sequelize.literal(`CASE WHEN year='${previousToPreviousYear}' THEN "seedrepalcementrate"."acheivedSrr" ELSE 0 END`)),
          'previousToPreviousYear',
        ],
        [
          sequelize.fn("SUM", sequelize.literal(`CASE WHEN year='${previousYear}' THEN  "seedrepalcementrate"."acheivedSrr" ELSE 0 END`)),
          'previousYear',
        ],
        [
          sequelize.fn("SUM", sequelize.literal(`CASE WHEN year='${year}' THEN  "seedrepalcementrate"."acheivedSrr" ELSE 0 END`)),
          'year',
        ],
      ],
      group: [
        [sequelize.col('user.name'), 'user_name'],
        [sequelize.col('m_crop_group.group_name'), 'group_name'],
        [sequelize.col('m_crop.crop_name'), 'crop_name'],
        [sequelize.col('seed_type'), 'seed_type'],
        [sequelize.col('m_crop.srr'), 'srr'],
      ],
      limit: limit,
      offset: offset,
    };

    console.log(condition);
    if (req.body.crop_code) {
      condition.where.crop_code = Array.isArray(req.body.crop_code) ? { [Op.in]: req.body.crop_code } : req.body.crop_code;
    }

    if (req.body.user_id) {
      condition.where.user_id = Array.isArray(req.body.user_id) ? { [Op.in]: req.body.user_id } : req.body.user_id;
    }


    // Fetching the data
    const data = await srrModel.findAll(condition);

    console.log(data);

    // If no data is found
    if (data.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }

    const totalRecords = await srrModel.count(condition);

    const totalPages = Math.ceil(totalRecords.length / limit);  // Calculate total pages

    return res.status(200).json({
      data,
      pagination: {
        currentPage: page,
        totalRecords: totalRecords.length,
        totalPages: totalPages,
        pageSize: limit,
      },
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An unexpected error occurred" });
  }
};

//zsrmbstofs
exports.addZsrmBsToFs = async (req, res) => {

  try {
    const body = req.body;
    console.log(body.loginedUserid.id);
    let crop_type = "";
    let unit = "";
    let cropExist = await cropDataModel.findOne({
      where: {
        crop_code: body.crop_code,
      },
    });
    if (!cropExist) {
      return response(res, "Crop Not Found", 404, {});
    }

    let varietyExist = await varietyModel.findOne({
      where: {
        variety_code: body.variety_code,
      },
    });
    if (!varietyExist) {
      return response(res, "Variety Not Found", 404, {});
    }

    let recordExist = await zsrmbstofsModel.findOne({
      where: {
        year: body.year,
        season: body.season,
        crop_code: body.crop_code,
        variety_code: body.variety_code,
        user_id: body.loginedUserid.id,
        is_active: true
      },
    });
    if (recordExist) {
      return response(res, "Record already exist", 409, {});
    }
    if ((cropExist.crop_code).slice(0, 1) == 'A') {
      crop_type = 'agriculture';
      unit = 'qt';
    }
    else if ((cropExist.crop_code).slice(0, 1) == 'H') {
      crop_type = 'horticulture'
      unit = 'kg';
    }
    let state = await agencyDetailModel.findOne({
      where: {
        user_id: body.loginedUserid.id,
      },
      attributes: ['state_id']
    }
    )
    console.log("state_id:", state);

    let data = await zsrmbstofsModel.create({
      year: body.year,
      season: body.season,
      crop_type: crop_type,
      crop_code: body.crop_code,
      crop_group_code: cropExist.group_code,
      variety_code: body.variety_code,
      user_id: body.loginedUserid.id,
      unit: unit,
      norms: body.norms,
      bsLiftedIcar: body.bsLiftedIcar,
      bsLiftedSau: body.bsLiftedSau,
      bsLiftedOthers: body.bsLiftedOthers,
      bsLiftedTotal: body.bsLiftedTotal,
      bsUsedIcar: body.bsUsedIcar,
      bsUsedSau: body.bsUsedSau,
      bsUsedOthers: body.bsUsedOthers,
      bsUsedTotal: body.bsUsedTotal,
      fsProdFromBs: body.fsProdFromBs,
      smrAchieved: body.smrAchieved,
      percentAchievement: body.percentAchievement,
      fsProdOutOfFs: body.fsProdOutOfFs,
      carryOverFs: body.carryOverFs,
      totalFsAvl: body.totalFsAvl,
      state_id: state.state_id,

    })
    console.log("data added", data);
    if (data) {
      response(res, status.DATA_SAVE, 200, data);
    }
    else {
      return response(res, status.DATA_NOT_SAVE, 404)
    }
  } catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }

}


exports.deleteZsrmBsToFs = async (req, res) => {
  try {
    const data = await zsrmbstofsModel.findOne({ where: { id: req.params.id, is_active: true, user_id: req.body.loginedUserid.id } });
    if (!data) {
      return response(res, status.DATA_NOT_AVAILABLE, 404);
    }
    await data.update({ is_active: false, deletedAt: Date.now() },
    ).then(() => response(res, status.DATA_DELETED, 200, {}))
      .catch(() => response(res, status.DATA_NOT_DELETED, 500));
  }
  catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }

}

exports.updateZsrmBsToFs = async (req, res) => {

  try {
    const body = req.body;
    const recordExist = await zsrmbstofsModel.findOne({ where: { id: req.params.id, is_active: true, user_id: body.loginedUserid.id } });
    if (!recordExist) {
      return response(res, status.DATA_NOT_AVAILABLE, 404);
    }

    await recordExist.update({
      norms: body.norms,
      bsLiftedIcar: body.bsLiftedIcar,
      bsLiftedSau: body.bsLiftedSau,
      bsLiftedOthers: body.bsLiftedOthers,
      bsLiftedTotal: body.bsLiftedTotal,
      bsUsedIcar: body.bsUsedIcar,
      bsUsedSau: body.bsUsedSau,
      bsUsedOthers: body.bsUsedOthers,
      bsUsedTotal: body.bsUsedTotal,
      fsProdFromBs: body.fsProdFromBs,
      smrAchieved: body.smrAchieved,
      percentAchievement: body.percentAchievement,
      fsProdOutOfFs: body.fsProdOutOfFs,
      carryOverFs: body.carryOverFs,
      totalFsAvl: body.totalFsAvl,
      updated_at: Date.now(),
    },
    ).then(() => response(res, status.DATA_UPDATED, 200, {}))
      .catch(() => response(res, status.DATA_NOT_UPDATED, 500));

  } catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }

}

exports.viewZsrmBsToFs = async (req, res) => {

  try {
    // const { search } = req.body;
    const userid = req.body.loginedUserid.id;

    const { page, limit } = req.query;  // Extract pagination params from query string
    console.log(page, limit);
    const offset = (page - 1) * limit;

    let condition = {
      include: [
        {
          model: cropDataModel,
          attributes: ['crop_name']
        },
        {
          model: varietyModel,
          attributes: ['variety_name']
        },
        {
          model: stateModel,
          attributes: ['state_name']
        },
        {
          model: userModel,
          attributes: ['name']
        }
      ],
      where: { user_id: userid, is_active: true },
      order: [[cropDataModel, 'crop_name', 'ASC'],  // Ordering by crop_name in ascending order
      [varietyModel, 'variety_name', 'ASC'],
      [stateModel, 'state_name', 'ASC'],
      [userModel, 'name', 'ASC']],
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'deletedAt', 'crop_type', 'is_active']
      },
      limit: limit,      // Limit the number of records returned
      offset: offset,
    }

    if (req.query.year) {
      condition.where.year = (req.query.year);
    }
    if (req.query.season) {
      condition.where.season = (req.query.season);
    }
    if (req.query.crop_code) {
      condition.where.crop_code = (req.query.crop_code);
    }
    if (req.query.variety_code) {
      condition.where.variety_code = (req.query.variety_code);
    }
    let data = await zsrmbstofsModel.findAll(condition);
    console.log("data found", data);
    if (data.length == 0)
      //res.status(404).json({message: "No data found"})
      return response(res, status.DATA_NOT_AVAILABLE, 404)

    const result = data.map((item) => {
      return {
        id: item.id,
        year: item.year,
        season: item.season,
        user_id: item.user_id,
        crop_code: item.crop_code,
        variety_code: item.variety_code,
        crop_name: item.m_crop.crop_name,
        variety_name: item.m_crop_variety.variety_name,
        state_name: item.m_state.state_name,
        user_name: item.user.name,
        unit: item.unit,
        norms: parseFloat(item.norms),
        bsLiftedIcar: parseFloat(item.bsLiftedIcar),
        bsLiftedSau: parseFloat(item.bsLiftedSau),
        bsLiftedOthers: parseFloat(item.bsLiftedOthers),
        bsLiftedTotal: parseFloat(item.bsLiftedTotal),
        bsUsedIcar: parseFloat(item.bsUsedIcar),
        bsUsedSau: parseFloat(item.bsUsedSau),
        bsUsedOthers: parseFloat(item.bsUsedOthers),
        bsUsedTotal: parseFloat(item.bsUsedTotal),
        fsProdFromBs: parseFloat(item.fsProdFromBs),
        smrAchieved: parseFloat(item.smrAchieved),
        percentAchievement: parseFloat(item.percentAchievement),
        fsProdOutOfFs: parseFloat(item.fsProdOutOfFs),
        carryOverFs: parseFloat(item.carryOverFs),
        totalFsAvl: parseFloat(item.totalFsAvl),
      }
    });

    // Get total records for pagination
    const totalRecords = await zsrmbstofsModel.count(condition);

    const totalPages = Math.ceil(totalRecords / limit);  // Calculate total pages

    response(res, status.DATA_AVAILABLE, 200, {
      data: result,
      pagination: {
        currentPage: parseInt(page),
        totalRecords: totalRecords,
        totalPages: totalPages,
        pageSize: parseInt(limit),
      },
    });


  } catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }

}





//zsrmfstocs
exports.addZsrmFsToCs = async (req, res) => {
  try {
    const body = req.body;
    console.log(body.loginedUserid.id);
    let crop_type = "";
    let unit = "";
    let cropExist = await cropDataModel.findOne({
      where: {
        crop_code: body.crop_code,
      },
    });
    if (!cropExist) {
      return response(res, "Crop Not Found", 404, {});
    }

    let varietyExist = await varietyModel.findOne({
      where: {
        variety_code: body.variety_code,
      },
    });
    if (!varietyExist) {
      return response(res, "Variety Not Found", 404, {});
    }

    let recordExist = await zsrmfstocsModel.findOne({
      where: {
        year: body.year,
        season: body.season,
        crop_code: body.crop_code,
        variety_code: body.variety_code,
        user_id: body.loginedUserid.id,
        is_active: true
      },
    });
    if (recordExist) {
      return response(res, "Record already exist", 409, {});
    }
    if ((cropExist.crop_code).slice(0, 1) == 'A') {
      crop_type = 'agriculture';
      unit = 'qt';
    }
    else if ((cropExist.crop_code).slice(0, 1) == 'H') {
      crop_type = 'horticulture'
      unit = 'kg';
    }
    let state = await agencyDetailModel.findOne({
      where: {
        user_id: body.loginedUserid.id,
      },
      attributes: ['state_id']
    }
    )
    console.log("state_id:", state);

    let data = await zsrmfstocsModel.create({
      year: body.year,
      season: body.season,
      crop_type: crop_type,
      crop_code: body.crop_code,
      crop_group_code: cropExist.group_code,
      variety_code: body.variety_code,
      user_id: body.loginedUserid.id,
      unit: unit,
      norms: body.norms,
      fsLiftedDao: body.fsLiftedDao,
      fsLiftedSsc: body.fsLiftedSsc,
      fsLiftedSau: body.fsLiftedSau,
      fsLiftedCoop: body.fsLiftedCoop,
      fsLiftedOthers: body.fsLiftedOthers,
      fsLiftedTotal: body.fsLiftedTotal,
      fsUsedDao: body.fsUsedDao,
      fsUsedSsc: body.fsUsedSsc,
      fsUsedSau: body.fsUsedSau,
      fsUsedCoop: body.fsUsedCoop,
      fsUsedOthers: body.fsUsedOthers,
      fsUsedTotal: body.fsUsedTotal,
      csProdFromfs: body.csProdFromfs,
      smrAchieved: body.smrAchieved,
      percentAchievement: body.percentAchievement,
      csProdOutOfCs: body.csProdOutOfCs,
      carryOverCs: body.carryOverCs,
      totalCsAvl: body.totalCsAvl,
      state_id: state.state_id,
    })
    console.log("data added", data);
    if (data) {
      response(res, status.DATA_SAVE, 200, data);
    }
    else {
      return response(res, status.DATA_NOT_SAVE, 404)
    }
  } catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }

}


exports.deleteZsrmFsToCs = async (req, res) => {
  try {
    const data = await zsrmfstocsModel.findOne({ where: { id: req.params.id, is_active: true, user_id: req.body.loginedUserid.id } });
    if (!data) {
      return response(res, status.DATA_NOT_AVAILABLE, 404);
    }
    await data.update({ is_active: false, deletedAt: Date.now() },
    ).then(() => response(res, status.DATA_DELETED, 200, {}))
      .catch(() => response(res, status.DATA_NOT_DELETED, 500));
  }
  catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }

}

exports.updateZsrmFsToCs = async (req, res) => {

  try {
    const body = req.body;
    const recordExist = await zsrmfstocsModel.findOne({ where: { id: req.params.id, is_active: true, user_id: body.loginedUserid.id } });
    if (!recordExist) {
      return response(res, status.DATA_NOT_AVAILABLE, 404);
    }

    await recordExist.update({
      norms: body.norms,
      fsLiftedDao: body.fsLiftedDao,
      fsLiftedSsc: body.fsLiftedSsc,
      fsLiftedSau: body.fsLiftedSau,
      fsLiftedCoop: body.fsLiftedCoop,
      fsLiftedOthers: body.fsLiftedOthers,
      fsLiftedTotal: body.fsLiftedTotal,
      fsUsedDao: body.fsUsedDao,
      fsUsedSsc: body.fsUsedSsc,
      fsUsedSau: body.fsUsedSau,
      fsUsedCoop: body.fsUsedCoop,
      fsUsedOthers: body.fsUsedOthers,
      fsUsedTotal: body.fsUsedTotal,
      csProdFromfs: body.csProdFromfs,
      smrAchieved: body.smrAchieved,
      percentAchievement: body.percentAchievement,
      csProdOutOfCs: body.csProdOutOfCs,
      carryOverCs: body.carryOverCs,
      totalCsAvl: body.totalCsAvl,
      updated_at: Date.now(),
    },
    ).then(() => response(res, status.DATA_UPDATED, 200, {}))
      .catch(() => response(res, status.DATA_NOT_UPDATED, 500));

  } catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }

}

exports.viewZsrmFsToCs = async (req, res) => {

  try {
    // const { search } = req.body;
    const userid = req.body.loginedUserid.id;

    const { page, limit } = req.query;  // Extract pagination params from query string
    console.log(page, limit);
    const offset = (page - 1) * limit;

    let condition = {
      include: [
        {
          model: cropDataModel,
          attributes: ['crop_name']
        },
        {
          model: varietyModel,
          attributes: ['variety_name']
        },
        {
          model: stateModel,
          attributes: ['state_name']
        },
        {
          model: userModel,
          attributes: ['name']
        }
      ],
      where: { user_id: userid, is_active: true },
      order: [[cropDataModel, 'crop_name', 'ASC'],  // Ordering by crop_name in ascending order
      [varietyModel, 'variety_name', 'ASC'],
      [stateModel, 'state_name', 'ASC'],
      [userModel, 'name', 'ASC']],
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'deletedAt', 'crop_type', 'is_active']
      },
      limit: limit,      // Limit the number of records returned
      offset: offset,
    }

    if (req.query.year) {
      condition.where.year = (req.query.year);
    }
    if (req.query.season) {
      condition.where.season = (req.query.season);
    }
    if (req.query.crop_code) {
      condition.where.crop_code = (req.query.crop_code);
    }
    if (req.query.variety_code) {
      condition.where.variety_code = (req.query.variety_code);
    }
    let data = await zsrmfstocsModel.findAll(condition);
    console.log("data found", data);
    if (data.length == 0)
      //res.status(404).json({message: "No data found"})
      return response(res, status.DATA_NOT_AVAILABLE, 404)

    const result = data.map((item) => {
      return {
        id: item.id,
        year: item.year,
        season: item.season,
        user_id: item.user_id,
        crop_code: item.crop_code,
        variety_code: item.variety_code,
        crop_name: item.m_crop.crop_name,
        variety_name: item.m_crop_variety.variety_name,
        state_name: item.m_state.state_name,
        user_name: item.user.name,
        unit: item.unit,
        norms: parseFloat(item.norms),
        fsLiftedDao: parseFloat(item.fsLiftedDao),
        fsLiftedSsc: parseFloat(item.fsLiftedSsc),
        fsLiftedSau: parseFloat(item.fsLiftedSau),
        fsLiftedCoop: parseFloat(item.fsLiftedCoop),
        fsLiftedOthers: parseFloat(item.fsLiftedOthers),
        fsLiftedTotal: parseFloat(item.fsLiftedTotal),
        fsUsedDao: parseFloat(item.fsUsedDao),
        fsUsedSsc: parseFloat(item.fsUsedSsc),
        fsUsedSau: parseFloat(item.fsUsedSau),
        fsUsedCoop: parseFloat(item.fsUsedCoop),
        fsUsedOthers: parseFloat(item.fsUsedOthers),
        fsUsedTotal: parseFloat(item.fsUsedTotal),
        csProdFromfs: parseFloat(item.csProdFromfs),
        smrAchieved: parseFloat(item.smrAchieved),
        percentAchievement: parseFloat(item.percentAchievement),
        csProdOutOfCs: parseFloat(item.csProdOutOfCs),
        carryOverCs: parseFloat(item.carryOverCs),
        totalCsAvl: parseFloat(item.totalCsAvl),
      }
    });
    // Get total records for pagination
    const totalRecords = await zsrmfstocsModel.count(condition);
    const totalPages = Math.ceil(totalRecords / limit);  // Calculate total pages
    response(res, status.DATA_AVAILABLE, 200, {
      data: result,
      pagination: {
        currentPage: parseInt(page),
        totalRecords: totalRecords,
        totalPages: totalPages,
        pageSize: parseInt(limit),
      },
    });
  } catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }

}



//zsrmcsqsdist
exports.addZsrmCsQsDist = async (req, res) => {
  try {
    const body = req.body;
    console.log(body.loginedUserid.id);
    let crop_type = "";
    let unit = "";
    let cropExist = await cropDataModel.findOne({
      where: {
        crop_code: body.crop_code,
      },
    });
    if (!cropExist) {
      return response(res, "Crop Not Found", 404, {});
    }

    let varietyExist = await varietyModel.findOne({
      where: {
        variety_code: body.variety_code,
      },
    });
    if (!varietyExist) {
      return response(res, "Variety Not Found", 404, {});
    }

    let recordExist = await zsrmcsqsdistModel.findOne({
      where: {
        year: body.year,
        season: body.season,
        crop_code: body.crop_code,
        variety_code: body.variety_code,
        user_id: body.loginedUserid.id,
        is_active: true
      },
    });
    if (recordExist) {
      return response(res, "Record already exist", 409, {});
    }
    if ((cropExist.crop_code).slice(0, 1) == 'A') {
      crop_type = 'agriculture';
      unit = 'qt';
    }
    else if ((cropExist.crop_code).slice(0, 1) == 'H') {
      crop_type = 'horticulture'
      unit = 'kg';
    }
    let state = await agencyDetailModel.findOne({
      where: {
        user_id: body.loginedUserid.id,
      },
      attributes: ['state_id']
    }
    )
    console.log("state_id:", state);

    let data = await zsrmcsqsdistModel.create({
      year: body.year,
      season: body.season,
      crop_type: crop_type,
      crop_code: body.crop_code,
      crop_group_code: cropExist.group_code,
      variety_code: body.variety_code,
      user_id: body.loginedUserid.id,
      unit: unit,
      sscCs: body.sscCs,
      doaCs: body.doaCs,
      sauCs: body.sauCs,
      nscCs: body.nscCs,
      seedhubsCs: body.seedhubsCs,
      pvtCs: body.pvtCs,
      othersCs: body.othersCs,
      sscQs: body.sscQs,
      doaQs: body.doaQs,
      sauQs: body.sauQs,
      nscQs: body.nscQs,
      seedhubsQs: body.seedhubsQs,
      pvtQs: body.pvtQs,
      othersQs: body.othersQs,
      totalCs: body.totalCs,
      totalQs: body.totalQs,
      total: body.total,
      state_id: state.state_id,
    })
    console.log("data added", data);
    if (data) {
      response(res, status.DATA_SAVE, 200, data);
    }
    else {
      return response(res, status.DATA_NOT_SAVE, 404)
    }
  } catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }

}


exports.deleteZsrmCsQsDist = async (req, res) => {
  try {
    const data = await zsrmcsqsdistModel.findOne({ where: { id: req.params.id, is_active: true, user_id: req.body.loginedUserid.id } });
    if (!data) {
      return response(res, status.DATA_NOT_AVAILABLE, 404);
    }
    await data.update({ is_active: false, deletedAt: Date.now() },
    ).then(() => response(res, status.DATA_DELETED, 200, {}))
      .catch(() => response(res, status.DATA_NOT_DELETED, 500));
  }
  catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }

}

exports.updateZsrmCsQsDist = async (req, res) => {

  try {
    const body = req.body;
    const recordExist = await zsrmcsqsdistModel.findOne({ where: { id: req.params.id, is_active: true, user_id: body.loginedUserid.id, is_finalised: false } });
    if (!recordExist) {
      return response(res, status.DATA_NOT_AVAILABLE, 404);
    }

    await recordExist.update({
      sscCs: body.sscCs,
      doaCs: body.doaCs,
      sauCs: body.sauCs,
      nscCs: body.nscCs,
      seedhubsCs: body.seedhubCs,
      pvtCs: body.pvtCs,
      othersCs: body.othersCs,
      sscQs: body.sscQs,
      doaQs: body.doaQs,
      sauQs: body.sauQs,
      nscQs: body.nscQs,
      seedhubsQs: body.seedhubQs,
      pvtQs: body.pvtQs,
      othersQs: body.offsetQs,
      totalCs: body.totalCs,
      totalQs: body.totalCs,
      total: body.total,
      updated_at: Date.now(),
    },
    ).then(() => response(res, status.DATA_UPDATED, 200, {}))
      .catch(() => response(res, status.DATA_NOT_UPDATED, 500));

  } catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }

}

exports.viewZsrmCsQsDistSingle = async (req, res) => {
  try {
    const userid = req.body.loginedUserid.id;
    const item = await zsrmcsqsdistModel.findOne({ where: { id: req.params.id, is_active: true, user_id: userid, is_finalised: false } });
    console.log("data found", item);

    if (!item) {
      return response(res, status.DATA_NOT_AVAILABLE, 404);
    }

    const result = {
      id: item.id,
    
   

    
   
      sscCs: parseFloat(item.sscCs),
      sscQs: parseFloat(item.sscQs),
      doaCs: parseFloat(item.doaCs),
      doaQs: parseFloat(item.doaQs),
      sauCs: parseFloat(item.sauCs),
      sauQs: parseFloat(item.sauQs),
      nscCs: parseFloat(item.nscCs),
      nscQs: parseFloat(item.nscQs),
      seedhubsCs: parseFloat(item.seedhubsCs),
      seedhubsQs: parseFloat(item.seedhubsQs),
      pvtCs: parseFloat(item.pvtCs),
      pvtQs: parseFloat(item.pvtQs),
      othersCs: parseFloat(item.othersCs),
      othersQs: parseFloat(item.othersQs),
      totalCs: parseFloat(item.totalCs),
      totalQs: parseFloat(item.totalQs),
      total: parseFloat(item.total)
    };

    return response(res, status.DATA_AVAILABLE, 200, result);
  } catch (error) {
    console.error(error);
    return response(res, status.UNEXPECTED_ERROR, 501);
  }
};

exports.viewZsrmCsQsDist = async (req, res) => {

  try {
    // const { search } = req.body;
    const userid = req.body.loginedUserid.id;
    let condition = {
      include: [
        {
          model: cropDataModel,
          attributes: ['crop_name']
        },
        {
          model: varietyModel,
          attributes: ['variety_name']
        },
        {
          model: stateModel,
          attributes: ['state_name']
        },
        {
          model: userModel,
          attributes: ['name']
        }
      ],
      where: { user_id: userid, is_active: true },
      order: [[cropDataModel, 'crop_name', 'ASC'],  // Ordering by crop_name in ascending order
      [varietyModel, 'variety_name', 'ASC'],
      [stateModel, 'state_name', 'ASC'],
      [userModel, 'name', 'ASC']],
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'deletedAt', 'crop_type', 'is_active']
      },
    }

    if (req.query.year) {
      condition.where.year = (req.query.year);
    }
    if (req.query.season) {
      condition.where.season = (req.query.season);
    }
    if (req.query.crop_code) {
      condition.where.crop_code = (req.query.crop_code);
    }
    if (req.query.variety_code) {
      condition.where.variety_code = (req.query.variety_code);
    }
    if (req.query.seed_type) {
      condition.where.seedType = (req.query.seed_type);
    }
    let data = await zsrmcsqsdistModel.findAll(condition);
    console.log("data found", data);
    if (data.length == 0)
      //res.status(404).json({message: "No data found"})
      return response(res, status.DATA_NOT_AVAILABLE, 404)

    const result = data.map((item) => {
      return {
        id: item.id,
        year: item.year,
        season: item.season,
        user_id: item.user_id,
        crop_code: item.crop_code,
        variety_code: item.variety_code,
        crop_name: item.m_crop.crop_name,
        variety_name: item.m_crop_variety.variety_name,
        state_name: item.m_state.state_name,
        user_name: item.user.name,
        unit: item.unit,
        sscCs: parseFloat(item.sscCs),
        sscQs: parseFloat(item.sscQs),
        doaCs: parseFloat(item.doaCs),
        doaQs: parseFloat(item.doaQs),
        sauCs: parseFloat(item.sauCs),
        sauQs: parseFloat(item.sauQs),
        nscCs: parseFloat(item.nscCs),
        nscQs: parseFloat(item.nscQs),
        seedhubsCs: parseFloat(item.seedhubsCs),
        seedhubsQs: parseFloat(item.seedhubsQs),
        pvtCs: parseFloat(item.pvtCs),
        pvtQs: parseFloat(item.pvtQs),
        othersCs: parseFloat(item.othersCs),
        othersQs: parseFloat(item.othersQs),
        totalCs: parseFloat(item.totalCs),
        totalQs: parseFloat(item.totalQs),
        total: parseFloat(item.total),
        is_finalised:item.is_finalised
      }
    });

    response(res, status.DATA_AVAILABLE, 200,
      result);
  } catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }

}

exports.getZsrmCsQsDistYear = async (req, res) => {

  try {
    // const { search } = req.body;
    const userid = req.body.loginedUserid.id;
    let data = await zsrmcsqsdistModel.findAll({
      attributes: [[sequelize.fn('DISTINCT', sequelize.col('year')), 'year'],],
      distinct: true,
      where: { user_id: userid, is_active: true },
      order: [['year', 'Desc']],
    });
    console.log("data found", data);
    if (data.length == 0)
      //res.status(404).json({message: "No data found"})
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    response(res, status.DATA_AVAILABLE, 200, data);
  } catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }

}
exports.getZsrmCsQsDistYearSD = async (req, res) => {

  try {
    // const { search } = req.body;
    const userid = req.body.loginedUserid.id;
    let data = await zsrmcsqsdistModel.findAll({
      attributes: [[sequelize.fn('DISTINCT', sequelize.col('year')), 'year'],],
      distinct: true,
      where: { is_active: true },
      order: [['year', 'Desc']],
    });
    console.log("data found", data);
    if (data.length == 0)
      //res.status(404).json({message: "No data found"})
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    response(res, status.DATA_AVAILABLE, 200, data);
  } catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }

}

exports.getZsrmCsQsDistSeason = async (req, res) => {

  try {
    // const { search } = req.body;
    const userid = req.body.loginedUserid.id;
    let data = await zsrmcsqsdistModel.findAll({
      attributes: [[sequelize.fn('DISTINCT', sequelize.col('season')), 'season'],],
      distinct: true,
      where: { user_id: userid, is_active: true, year: req.query.year },
      order: [['season', 'Asc']],
    });
    console.log("data found", data);
    if (data.length == 0)
      //res.status(404).json({message: "No data found"})
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    response(res, status.DATA_AVAILABLE, 200, data);
  } catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }

}
exports.getZsrmCsQsDistSeasonSD = async (req, res) => {

  try {
    // const { search } = req.body;
    const userid = req.body.loginedUserid.id;
    let data = await zsrmcsqsdistModel.findAll({
      attributes: [[sequelize.fn('DISTINCT', sequelize.col('season')), 'season'],],
      distinct: true,
      where: { is_active: true, year: req.query.year },
      order: [['season', 'Asc']],
    });
    console.log("data found", data);
    if (data.length == 0)
      //res.status(404).json({message: "No data found"})
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    response(res, status.DATA_AVAILABLE, 200, data);
  } catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }

}

exports.getZsrmCsQsDistCropType = async (req, res) => {

  try {
    // const { search } = req.body;
    const userid = req.body.loginedUserid.id;
    let data = await zsrmcsqsdistModel.findAll({
      attributes: [[sequelize.fn('DISTINCT', sequelize.col('crop_type')), 'crop_type'],],
      distinct: true,
      where: { user_id: userid, is_active: true, year: req.query.year, season: req.query.season },
      order: [['crop_type', 'Asc']],
    });
    console.log("data found", data);
    if (data.length == 0)
      //res.status(404).json({message: "No data found"})
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    response(res, status.DATA_AVAILABLE, 200, data);
  } catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }

}
exports.getZsrmCsQsDistCropTypeSD = async (req, res) => {

  try {
    // const { search } = req.body;
    const userid = req.body.loginedUserid.id;
    let data = await zsrmcsqsdistModel.findAll({
      attributes: [[sequelize.fn('DISTINCT', sequelize.col('crop_type')), 'crop_type'],],
      distinct: true,
      where: { is_active: true, year: req.query.year, season: req.query.season },
      order: [['crop_type', 'Asc']],
    });
    console.log("data found", data);
    if (data.length == 0)
      //res.status(404).json({message: "No data found"})
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    response(res, status.DATA_AVAILABLE, 200, data);
  } catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }

}

exports.getZsrmCsQsDistCropTypeSDYearBased = async (req, res) => {

  try {
    // const { search } = req.body;
    const userid = req.body.loginedUserid.id;
    let data = await zsrmcsqsdistModel.findAll({
      attributes: [[sequelize.fn('DISTINCT', sequelize.col('crop_type')), 'crop_type'],],
      distinct: true,
      where: { is_active: true, year: req.query.year },
      order: [['crop_type', 'Asc']],
    });
    console.log("data found", data);
    if (data.length == 0)
      //res.status(404).json({message: "No data found"})
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    response(res, status.DATA_AVAILABLE, 200, data);
  } catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }

}

exports.getZsrmCsQsDistCrop = async (req, res) => {

  try {
    // const { search } = req.body;
    const userid = req.body.loginedUserid.id;
    let condition = {

      include: [
        {
          model: cropDataModel,
          attributes: []
        },
      ],
      where: {
        user_id: userid, is_active: true, year: req.query.year, season: req.query.season,
        crop_type: req.query.crop_type
      },
      order: [[cropDataModel, 'crop_name', 'ASC'],  // Ordering by crop_name in ascending order
      ],

      attributes: [[sequelize.col('crop_name'), 'crop_name'],
      [sequelize.col('zsrm_cs_qs_seed_dist.crop_code'), 'crop_code']
      ],
      distinct: true, // Ensure distinct rows based on crop_name and crop_code
      group: [
        sequelize.col('zsrm_cs_qs_seed_dist.crop_code'),
        sequelize.col('crop_name')
      ] // This groups by crop_name and crop_code to ensure uniqueness
    }

    let data = await zsrmcsqsdistModel.findAll(condition);
    console.log("data found", data);
    if (data.length == 0)
      //res.status(404).json({message: "No data found"})
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    response(res, status.DATA_AVAILABLE, 200, data);
  } catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }

}

exports.getZsrmCsQsDistStateSD = async (req, res) => {

  try {
    // const { search } = req.body;

    let condition = {

      include: [
        {
          model: userModel,
          attributes: []
        },
      ],
      where: {
        is_active: true, year: req.query.year, season: req.query.season,
        crop_type: req.query.crop_type
      },
      order: [[userModel, 'name', 'ASC'],  // Ordering by crop_name in ascending order
      ],

      attributes: [[sequelize.col('name'), 'name'],
      [sequelize.col('zsrm_cs_qs_seed_dist.user_id'), 'user_id']
      ],
      distinct: true, // Ensure distinct rows based on crop_name and crop_code
      group: [
        sequelize.col('zsrm_cs_qs_seed_dist.user_id'),
        sequelize.col('name')
      ] // This groups by crop_name and crop_code to ensure uniqueness
    }

    let data = await zsrmcsqsdistModel.findAll(condition);
    console.log("data found", data);
    if (data.length == 0)
      //res.status(404).json({message: "No data found"})
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    response(res, status.DATA_AVAILABLE, 200, data);
  } catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }

}


exports.getZsrmCsQsDistData = async (req, res) => {
  let data = {};
  try {
    let condition = {}
    console.log(req.body)
    let filters = await ConditionCreator.filters(req.body.search);
    console.log(filters, "filters")

    condition = {
      where: filters,
      include: [
        {
          model: cropDataModel,
          attributes: [],
          attributes: ['id', 'crop_name', 'crop_code'],
        },
        {
          model: varietyModel,
          attributes: ['variety_name',]
        },
      ],
      attributes: [
        [sequelize.col('zsrm_cs_qs_seed_dist.crop_code'), 'crop_code'],
        [sequelize.col('m_crop.crop_name'), 'crop_name'],
        [sequelize.col('m_crop_variety.variety_code'), 'variety_code'],
        [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
        [sequelize.col('zsrm_cs_qs_seed_dist.seedType'), 'seedType'],
        [sequelize.col('zsrm_cs_qs_seed_dist.doa'), 'doa'],
        [sequelize.col('zsrm_cs_qs_seed_dist.ssc'), 'ssc'],
        [sequelize.col('zsrm_cs_qs_seed_dist.others'), 'others'],
        [sequelize.col('zsrm_cs_qs_seed_dist.nsc'), 'nsc'],
        [sequelize.col('zsrm_cs_qs_seed_dist.sfci'), 'sfci'],
        [sequelize.col('zsrm_cs_qs_seed_dist.private'), 'private'],
        [sequelize.col('zsrm_cs_qs_seed_dist.total'), 'total'],
      ],
    };
    condition.order = [[sequelize.col('m_crop.crop_name'), 'ASC'], [sequelize.col('m_crop_variety.variety_name'), 'ASC'],
    [sequelize.col('zsrm_cs_qs_seed_dist.seedType'), 'ASC']];
    condition.where.user_id = req.body.loginedUserid.id;
    condition.where.is_active = true;
    data = await zsrmcsqsdistModel.findAll(condition);
    let filteredData = []
    data.forEach(el => {
      const cropIndex = filteredData.findIndex(item => item.crop_code === el.crop_code);
      if (cropIndex === -1) {
        filteredData.push({
          "crop_name": el.m_crop.crop_name,
          "crop_code": el.crop_code,
          "crop_total_dist": parseFloat(el.total).toFixed(2),
          "variety_count": 1,
          "total_seed_count": 1,
          "variety": [
            {
              "variety_code": el.variety_code,
              "variety_name": el.m_crop_variety.variety_name,
              "total_dist": parseFloat(el.total).toFixed(2),
              "seed_count": 1,
              "seeds": [
                {
                  "seed_type": el && el.seedType ? el.seedType : '',
                  "doa": el && el.doa ? parseFloat(el.doa).toFixed(2) : '',
                  "ssc": el && el.ssc ? parseFloat(el.ssc).toFixed(2) : '',
                  "others": el && el.others ? parseFloat(el.others).toFixed(2) : '',
                  "nsc": el && el.nsc ? parseFloat(el.nsc).toFixed(2) : '',
                  "sfci": el && el.sfci ? parseFloat(el.sfci).toFixed(2) : '',
                  "private": el && el.private ? parseFloat(el.private).toFixed(2) : '',
                  "total": el && el.total ? parseFloat(el.total).toFixed(2) : '',
                }
              ]
            }
          ]
        });
      } else {
        // console.log('filteredData88888888888',el.agency_name, filteredData[cropIndex]);
        const varietyIndex = filteredData[cropIndex].variety.findIndex(item => item.variety_code === el.variety_code);
        //	          const cropIndex = filteredData.findIndex(item => item.state_code === el.state_code && item.spa_code === el.spa_code );

        if (varietyIndex !== -1) {
          // console.log('>>>>', varietyIndex);
          filteredData[cropIndex].crop_total_dist = parseFloat(parseFloat(filteredData[cropIndex].crop_total_dist) + parseFloat(el.total)).toFixed(2);

          filteredData[cropIndex].variety[varietyIndex].total_dist = parseFloat(parseFloat(filteredData[cropIndex].variety[varietyIndex].total_dist) + parseFloat(el.total)).toFixed(2);
          filteredData[cropIndex].variety_count = filteredData[cropIndex].variety_count + 1;
          filteredData[cropIndex].variety[varietyIndex].seed_count = filteredData[cropIndex].variety[varietyIndex].seed_count + 1;
          filteredData[cropIndex].total_seed_count = filteredData[cropIndex].total_seed_count + 1;

          filteredData[cropIndex].variety[varietyIndex].seeds.push(
            {
              "seed_type": el && el.seedType ? el.seedType : '',
              "doa": el && el.doa ? parseFloat(el.doa).toFixed(2) : '',
              "ssc": el && el.ssc ? parseFloat(el.ssc).toFixed(2) : '',
              "others": el && el.others ? parseFloat(el.others).toFixed(2) : '',
              "nsc": el && el.nsc ? parseFloat(el.nsc).toFixed(2) : '',
              "sfci": el && el.sfci ? parseFloat(el.sfci).toFixed(2) : '',
              "private": el && el.private ? parseFloat(el.private).toFixed(2) : '',
              "total": el && el.total ? parseFloat(el.total).toFixed(2) : '',
            }
          );
        } else {
          // console.log("fil/teredDataaaaaaaaaaaaa", filteredData)
          filteredData[cropIndex].crop_total_dist = parseFloat(parseFloat(filteredData[cropIndex].crop_total_dist) + parseFloat(el.total)).toFixed(2);
          filteredData[cropIndex].variety_count = filteredData[cropIndex].variety_count + 1;
          filteredData[cropIndex].total_seed_count = filteredData[cropIndex].total_seed_count + 1;

          filteredData[cropIndex].variety.push({

            "variety_code": el.variety_code,
            "variety_name": el.m_crop_variety.variety_name,
            "total_dist": parseFloat(el.total).toFixed(2),

            "seed_count": 1,
            "seeds": [
              {
                "seed_type": el && el.seedType ? el.seedType : '',
                "doa": el && el.doa ? parseFloat(el.doa).toFixed(2) : '',
                "ssc": el && el.ssc ? parseFloat(el.ssc).toFixed(2) : '',
                "others": el && el.others ? parseFloat(el.others).toFixed(2) : '',
                "nsc": el && el.nsc ? parseFloat(el.nsc).toFixed(2) : '',
                "sfci": el && el.sfci ? parseFloat(el.sfci).toFixed(2) : '',
                "private": el && el.private ? parseFloat(el.private).toFixed(2) : '',
                "total": el && el.total ? parseFloat(el.total).toFixed(2) : '',
              }
            ]
          });
        }
      }
    });
    if (filteredData) {
      return response(res, status.DATA_AVAILABLE, 200, filteredData)
    } else {
      return response(res, "Data Not Found", 200, {})
    }
  } catch (error) {
    console.log(error)
    response(res, status.DATA_NOT_AVAILABLE, 500)
  }
}

exports.getZsrmCsQsDistDataSeedDiv = async (req, res) => {
  let data = {};
  try {
    let condition = {}
    let filters = await ConditionCreator.filters(req.body.search);
    console.log(filters, "filters")

    condition = {
      where: filters,
      include: [
        {
          model: cropDataModel,
          attributes: ['crop_name'],
        },
        {
          model: varietyModel,
          attributes: ['variety_name']
        },
        {
          model: userModel,
          attributes: ['name']
        }
      ],
      attributes: [
        [sequelize.col('user.name'), 'name'],
        [sequelize.col('zsrm_cs_qs_seed_dist.user_id'), 'user_id'],
        [sequelize.col('zsrm_cs_qs_seed_dist.crop_code'), 'crop_code'],
        [sequelize.col('m_crop.crop_name'), 'crop_name'],
        [sequelize.col('zsrm_cs_qs_seed_dist.variety_code'), 'variety_code'],
        [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
        [sequelize.col('zsrm_cs_qs_seed_dist.seedType'), 'seedType'],
        [sequelize.col('zsrm_cs_qs_seed_dist.doa'), 'doa'],
        [sequelize.col('zsrm_cs_qs_seed_dist.ssc'), 'ssc'],
        [sequelize.col('zsrm_cs_qs_seed_dist.others'), 'others'],
        [sequelize.col('zsrm_cs_qs_seed_dist.nsc'), 'nsc'],
        [sequelize.col('zsrm_cs_qs_seed_dist.sfci'), 'sfci'],
        [sequelize.col('zsrm_cs_qs_seed_dist.private'), 'private'],
        [sequelize.col('zsrm_cs_qs_seed_dist.total'), 'total'],
      ],
    };
    condition.order = [[sequelize.col('user.name'), 'ASC'],
    [sequelize.col('m_crop.crop_name'), 'ASC'], [sequelize.col('m_crop_variety.variety_name'), 'ASC'],
    [sequelize.col('zsrm_cs_qs_seed_dist.seedType'), 'ASC']];
    condition.where.is_active = true;

    data = await zsrmcsqsdistModel.findAll(condition);

    let filteredData = [];

    data.forEach(el => {
      // Check if user already exists in filteredData
      const userIndex = filteredData.findIndex(item => item.user === el.user_id);

      if (userIndex === -1) {
        // If the user doesn't exist, create a new user entry
        filteredData.push({
          "name": el.user.name,
          "user": el.user_id,
          "user_total_dist": parseFloat(el.total).toFixed(2),
          "total_crop_count": 1, // Initially 1 as we are adding the first crop
          "total_variety_count": 1, // Initially 1 as we are adding the first variety
          "total_seeds_count": 1, // Initially 1 as we are adding the first seed
          "crops": [
            {
              "crop_name": el.m_crop.crop_name,
              "crop_code": el.crop_code,
              "crop_total_dist": parseFloat(el.total).toFixed(2),
              "variety_count": 1,
              "total_seed_count": 1,
              "variety": [
                {
                  "variety_code": el.variety_code,
                  "variety_name": el.m_crop_variety.variety_name,
                  "total_dist": parseFloat(el.total).toFixed(2),
                  "seed_count": 1,
                  "seeds": [
                    {
                      "seed_type": el.seedType || '',
                      "doa": el.doa ? parseFloat(el.doa).toFixed(2) : '',
                      "ssc": el.ssc ? parseFloat(el.ssc).toFixed(2) : '',
                      "others": el.others ? parseFloat(el.others).toFixed(2) : '',
                      "nsc": el.nsc ? parseFloat(el.nsc).toFixed(2) : '',
                      "sfci": el.sfci ? parseFloat(el.sfci).toFixed(2) : '',
                      "private": el.private ? parseFloat(el.private).toFixed(2) : '',
                      "total": el.total ? parseFloat(el.total).toFixed(2) : '',
                    }
                  ]
                }
              ]
            }
          ]
        });
      } else {
        // If the user already exists, find the cropIndex
        const cropIndex = filteredData[userIndex].crops.findIndex(item => item.crop_code === el.crop_code);

        if (cropIndex === -1) {
          // If the crop doesn't exist for this user, create a new crop entry
          filteredData[userIndex].crops.push({
            "crop_name": el.m_crop.crop_name,
            "crop_code": el.crop_code,
            "crop_total_dist": parseFloat(el.total).toFixed(2),
            "variety_count": 1,
            "total_seed_count": 1,
            "variety": [
              {
                "variety_code": el.variety_code,
                "variety_name": el.m_crop_variety.variety_name,
                "total_dist": parseFloat(el.total).toFixed(2),
                "seed_count": 1,
                "seeds": [
                  {
                    "seed_type": el.seedType || '',
                    "doa": el.doa ? parseFloat(el.doa).toFixed(2) : '',
                    "ssc": el.ssc ? parseFloat(el.ssc).toFixed(2) : '',
                    "others": el.others ? parseFloat(el.others).toFixed(2) : '',
                    "nsc": el.nsc ? parseFloat(el.nsc).toFixed(2) : '',
                    "sfci": el.sfci ? parseFloat(el.sfci).toFixed(2) : '',
                    "private": el.private ? parseFloat(el.private).toFixed(2) : '',
                    "total": el.total ? parseFloat(el.total).toFixed(2) : '',
                  }
                ]
              }
            ]
          });
          // Increment user crop count
          filteredData[userIndex].total_crop_count += 1;
          filteredData[userIndex].total_variety_count += 1;  // Increment user variety count
          filteredData[userIndex].total_seeds_count += 1;
          filteredData[userIndex].user_total_dist = (parseFloat(filteredData[userIndex].user_total_dist) + parseFloat(el.total)).toFixed(2);

        } else {
          // If the crop exists, find the varietyIndex
          const varietyIndex = filteredData[userIndex].crops[cropIndex].variety.findIndex(item => item.variety_code === el.variety_code);

          if (varietyIndex !== -1) {
            // Update the total distribution and seed counts for the variety and crop
            filteredData[userIndex].crops[cropIndex].crop_total_dist = (parseFloat(filteredData[userIndex].crops[cropIndex].crop_total_dist) + parseFloat(el.total)).toFixed(2);
            filteredData[userIndex].crops[cropIndex].variety[varietyIndex].total_dist = (parseFloat(filteredData[userIndex].crops[cropIndex].variety[varietyIndex].total_dist) + parseFloat(el.total)).toFixed(2);

            filteredData[userIndex].crops[cropIndex].variety[varietyIndex].seed_count += 1;  // Update seed count
            filteredData[userIndex].crops[cropIndex].total_seed_count += 1;  // Update total seed count
            filteredData[userIndex].total_seeds_count += 1;
            filteredData[userIndex].user_total_dist = (parseFloat(filteredData[userIndex].user_total_dist) + parseFloat(el.total)).toFixed(2);
            filteredData[userIndex].crops[cropIndex].variety[varietyIndex].seeds.push(
              {
                "seed_type": el.seedType || '',
                "doa": el.doa ? parseFloat(el.doa).toFixed(2) : '',
                "ssc": el.ssc ? parseFloat(el.ssc).toFixed(2) : '',
                "others": el.others ? parseFloat(el.others).toFixed(2) : '',
                "nsc": el.nsc ? parseFloat(el.nsc).toFixed(2) : '',
                "sfci": el.sfci ? parseFloat(el.sfci).toFixed(2) : '',
                "private": el.private ? parseFloat(el.private).toFixed(2) : '',
                "total": el.total ? parseFloat(el.total).toFixed(2) : '',
              }
            );
          } else {
            // If the variety doesn't exist for the crop, add it
            filteredData[userIndex].crops[cropIndex].crop_total_dist = (parseFloat(filteredData[userIndex].crops[cropIndex].crop_total_dist) + parseFloat(el.total)).toFixed(2);
            filteredData[userIndex].crops[cropIndex].variety_count += 1; // Increment variety count
            filteredData[userIndex].crops[cropIndex].total_seed_count += 1; // Increment seed count  
            filteredData[userIndex].total_variety_count += 1;
            filteredData[userIndex].total_seeds_count += 1;
            filteredData[userIndex].user_total_dist = (parseFloat(filteredData[userIndex].user_total_dist) + parseFloat(el.total)).toFixed(2);
            filteredData[userIndex].crops[cropIndex].variety.push({
              "variety_code": el.variety_code,
              "variety_name": el.m_crop_variety.variety_name,
              "total_dist": parseFloat(el.total).toFixed(2),
              "seed_count": 1,
              "seeds": [
                {
                  "seed_type": el.seedType || '',
                  "doa": el.doa ? parseFloat(el.doa).toFixed(2) : '',
                  "ssc": el.ssc ? parseFloat(el.ssc).toFixed(2) : '',
                  "others": el.others ? parseFloat(el.others).toFixed(2) : '',
                  "nsc": el.nsc ? parseFloat(el.nsc).toFixed(2) : '',
                  "sfci": el.sfci ? parseFloat(el.sfci).toFixed(2) : '',
                  "private": el.private ? parseFloat(el.private).toFixed(2) : '',
                  "total": el.total ? parseFloat(el.total).toFixed(2) : '',
                }
              ]
            });
          }
        }
      }
    });

    // Return the filtered data with the totals for each user
    if (filteredData.length > 0) {
      console.log(filteredData)
      return response(res, status.DATA_AVAILABLE, 200, filteredData);
    } else {
      return response(res, "Data Not Found", 200, {});
    }
  } catch (error) {
    console.log(error)
    response(res, status.DATA_NOT_AVAILABLE, 500)
  }
}

exports.getZsrmCsQsDistDataCropWiseSeedDiv = async (req, res) => {
  try {
    let filters = await ConditionCreator.filters(req.body.search);
    // Condition to fetch data for 2020-21, 2021-22, and 2022-23
    let condition = {
      where: filters,
      include: [
        {
          model: cropGroupModel,
          attributes: [],
        },
        {
          model: cropDataModel,
          attributes: [],
        },
      ],
      order: [
        [cropGroupModel, 'group_name', 'ASC'],
        [cropDataModel, 'crop_name', 'ASC'],
      ],
      attributes: [
        [sequelize.col('m_crop_group.group_name'), 'group_name'],
        [sequelize.col('zsrm_cs_qs_seed_dist.crop_group_code'), 'crop_group_code'],
        [sequelize.col('m_crop.crop_name'), 'crop_name'],
        [sequelize.col('zsrm_cs_qs_seed_dist.crop_code'), 'crop_code'],
        [
          sequelize.fn("SUM", sequelize.literal(`CASE WHEN "zsrm_cs_qs_seed_dist"."seedType"='Certified' and "zsrm_cs_qs_seed_dist"."season"='Kharif' THEN COALESCE("zsrm_cs_qs_seed_dist"."total", 0)  ELSE 0 END`)),
          'cert_total_k',
        ],
        [
          sequelize.fn("SUM", sequelize.literal(`CASE WHEN "zsrm_cs_qs_seed_dist"."seedType"='Quality' and "zsrm_cs_qs_seed_dist"."season"='Kharif' THEN COALESCE("zsrm_cs_qs_seed_dist"."total", 0)  ELSE 0 END`)),
          'qua_total_k',
        ],
        [
          sequelize.fn("SUM", sequelize.literal(`CASE WHEN "zsrm_cs_qs_seed_dist"."seedType"='Certified' and "zsrm_cs_qs_seed_dist"."season"='Rabi' THEN COALESCE("zsrm_cs_qs_seed_dist"."total", 0)  ELSE 0 END`)),
          'cert_total_r',
        ],
        [
          sequelize.fn("SUM", sequelize.literal(`CASE WHEN "zsrm_cs_qs_seed_dist"."seedType"='Quality' and "zsrm_cs_qs_seed_dist"."season"='Rabi' THEN COALESCE("zsrm_cs_qs_seed_dist"."total", 0)  ELSE 0 END`)),
          'qua_total_r',
        ],

      ],
      group: [

        [sequelize.col('m_crop_group.group_name'), 'group_name'],
        [sequelize.col('m_crop_group.id'), 'id'],
        [sequelize.col('m_crop.crop_name'), 'crop_name'],
        [sequelize.col('zsrm_cs_qs_seed_dist.crop_group_code'), 'crop_group_code'],
        [sequelize.col('zsrm_cs_qs_seed_dist.crop_code'), 'crop_code'],
        [sequelize.col('m_crop.id'), 'id'],
      ],
    };


    // Fetching the data
    const data = await zsrmcsqsdistModel.findAll(condition);

    //     let filteredData = []
    //     data.forEach(el => {
    //     const cropGroupIndex = filteredData.findIndex(item => item.crop_group_code === el.crop_group_code);
    //     console.log
    //     if (cropGroupIndex === -1) {
    //     filteredData.push({
    //       "crop_group_code": el.crop_group_code,
    //       "group_name": el.m_crop_group.group_name,
    //       "crop_count": 1,
    //       "crop_cert_k": parseFloat(el.cert_total_k).toFixed(2), 
    //       "crop_qua_k": parseFloat(el.qua_total_k).toFixed(2), 
    //       "crop_cert_r": parseFloat(el.cert_total_r).toFixed(2), 
    //       "crop_qua_r": parseFloat(el.qua_total_r).toFixed(2), 
    //       "crop_total": parseFloat(el.cert_total_k).toFixed(2) + parseFloat(el.qua_total_k).toFixed(2) 
    //       + parseFloat(el.cert_total_r).toFixed(2)+ parseFloat(el.qua_total_r).toFixed(2),
    //       "crops": [
    //         {
    //           "crop_name": el.m_crop.crop_name,
    //           "crop_code": el.crop_code,
    //           "cert_total_k":  parseFloat(el.cert_total_k).toFixed(2), 
    //           "qua_total_k": parseFloat(el.qua_total_k).toFixed(2),
    //           "cert_total_r": parseFloat(el.cert_total_r).toFixed(2),
    //           "qua_total_r": parseFloat(el.qua_total_r).toFixed(2),
    //           "total":  (parseFloat(el.cert_total_k) + parseFloat(el.qua_total_k) 
    //           +parseFloat(el.cert_total_r)+parseFloat(el.qua_total_r)).toFixed(2),
    //         }
    //       ]
    //     });
    //   } else {
    //       filteredData[cropGroupIndex].crop_count +=1;
    //       filteredData[cropGroupIndex].crop_cert_k = (parseFloat(filteredData[cropGroupIndex].crop_cert_k) + parseFloat(el.cert_total_k)).toFixed(2);
    //       filteredData[cropGroupIndex].crop_qua_k = (parseFloat(filteredData[cropGroupIndex].crop_qua_k) + parseFloat(el.qua_total_k)).toFixed(2);
    //       filteredData[cropGroupIndex].crop_cert_r = (parseFloat(filteredData[cropGroupIndex].crop_cert_r) + parseFloat(el.cert_total_r)).toFixed(2);
    //       filteredData[cropGroupIndex].crop_qua_r = (parseFloat(filteredData[cropGroupIndex].crop_qua_r) + parseFloat(el.qua_total_r)).toFixed(2);
    //       filteredData[cropGroupIndex].crop_total = (parseFloat(filteredData[cropGroupIndex].crop_total) + parseFloat(el.cert_total_k) + parseFloat(el.qua_total_k) + parseFloat(el.cert_total_r) + parseFloat(el.qua_total_r)).toFixed(2);
    //       filteredData[cropGroupIndex].crops.push(
    //         {
    //           "crop_name": el.m_crop.crop_name,
    //           "crop_code": el.crop_code,
    //           "crop_cert_k":parseFloat(el.cert_total_k).toFixed(2), 
    //       "crop_qua_k":parseFloat(el.qua_total_k).toFixed(2),
    //       "crop_cert_r": parseFloat(el.cert_total_r).toFixed(2),
    //       "crop_qua_r":parseFloat(el.qua_total_r).toFixed(2),
    //           "total": (parseFloat(el.cert_total_k) + parseFloat(el.qua_total_k)
    //           +parseFloat(el.cert_total_r)+parseFloat(el.qua_total_r)).toFixed(2),
    //         }
    //       );

    //   }
    // });
    if (data.length == 0) {
      return response(res, "Data Not Found", 200, {})

    } else {
      return response(res, status.DATA_AVAILABLE, 200, data)
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An unexpected error occurred" });
  }
};


exports.finaliseZsrmCsQsDist = async (req, res) => {
  try {
    const recordsExist = await zsrmcsqsdistModel.findAll({ where: { year: req.query.year, season: req.query.season, is_active: true, user_id: req.body.loginedUserid.id, } });
    if (recordsExist.length === 0) {
      return response(res, status.DATA_NOT_AVAILABLE, 404);
    }
    await zsrmcsqsdistModel.update({
      is_finalised: true,
      finalisedAt: Date.now()
    },
      {
        where: { year: req.query.year, season: req.query.season, is_active: true, user_id: req.body.loginedUserid.id }
      },).then(() => response(res, status.DATA_UPDATED, 200, {}))
      .catch(() => response(res, status.DATA_NOT_UPDATED, 500));

  } catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }

}

//zsrmcsfsarea
exports.addZsrmCsFsArea = async (req, res) => {
  try {
    const body = req.body;
    console.log(body.loginedUserid.id);
    let crop_type = "";
    let unit = "";
    let cropExist = await cropDataModel.findOne({
      where: {
        crop_code: body.crop_code,
      },
    });
    if (!cropExist) {
      return response(res, "Crop Not Found", 404, {});
    }

    let varietyExist = await varietyModel.findOne({
      where: {
        variety_code: body.variety_code,
      },
    });
    if (!varietyExist) {
      return response(res, "Variety Not Found", 404, {});
    }

    let recordExist = await zsrmcsfsarea.findOne({
      where: {
        year: body.year,
        season: body.season,
        crop_code: body.crop_code,
        variety_code: body.variety_code,
        user_id: body.loginedUserid.id,
        category: body.category,
        is_active: true
      },
    });
    if (recordExist) {
      return response(res, "Record already exist", 409, {});
    }
    if ((cropExist.crop_code).slice(0, 1) == 'A') {
      crop_type = 'agriculture';
      unit = 'qt';
    }
    else if ((cropExist.crop_code).slice(0, 1) == 'H') {
      crop_type = 'horticulture'
      unit = 'kg';
    }
    let state = await agencyDetailModel.findOne({
      where: {
        user_id: body.loginedUserid.id,
      },
      attributes: ['state_id']
    }
    )
    console.log("state_id:", state);

    let data = await zsrmcsfsarea.create({
      year: body.year,
      season: body.season,
      crop_type: crop_type,
      crop_code: body.crop_code,
      crop_group_code: cropExist.group_code,
      variety_code: body.variety_code,
      user_id: body.loginedUserid.id,
      unit: unit,
      category: body.category,
      cs_area: body.cs_area,
      cs_quant: body.cs_quant,
      fs_area: body.fs_area,
      fs_quant: body.fs_quant,
      state_id: state.state_id,
    })
    console.log("data added", data);
    if (data) {
      response(res, status.DATA_SAVE, 200, data);
    }
    else {
      return response(res, status.DATA_NOT_SAVE, 404)
    }
  } catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }

}


exports.deleteZsrmCsFsArea = async (req, res) => {
  try {
    const data = await zsrmcsfsarea.findOne({ where: { id: req.params.id, is_active: true, user_id: req.body.loginedUserid.id } });
    if (!data) {
      return response(res, status.DATA_NOT_AVAILABLE, 404);
    }
    await data.update({ is_active: false, deletedAt: Date.now() },
    ).then(() => response(res, status.DATA_DELETED, 200, {}))
      .catch(() => response(res, status.DATA_NOT_DELETED, 500));
  }
  catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }

}

exports.updateZsrmCsFsArea = async (req, res) => {

  try {
    const body = req.body;
    const recordExist = await zsrmcsfsarea.findOne({ where: { id: req.params.id, is_active: true, user_id: body.loginedUserid.id } });
    if (!recordExist) {
      return response(res, status.DATA_NOT_AVAILABLE, 404);
    }
    console.log(body, "body");
    await recordExist.update({
      cs_area: body.cs_area,
      cs_quant: body.cs_quant,
      fs_area: body.fs_area,
      fs_quant: body.fs_quant,
      updated_at: Date.now(),
    },
    ).then(() => response(res, status.DATA_UPDATED, 200, {}))
      .catch(() => response(res, status.DATA_NOT_UPDATED, 500));

  } catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }

}

exports.viewZsrmCsFsArea = async (req, res) => {

  try {
    // const { search } = req.body;
    const userid = req.body.loginedUserid.id;

    const { page, limit } = req.query;  // Extract pagination params from query string
    console.log(page, limit);
    const offset = (page - 1) * limit;

    let condition = {
      include: [
        {
          model: cropDataModel,
          attributes: ['crop_name']
        },
        {
          model: varietyModel,
          attributes: ['variety_name']
        },
        {
          model: stateModel,
          attributes: ['state_name']
        },
        {
          model: userModel,
          attributes: ['name']
        }
      ],
      where: { user_id: userid, is_active: true },
      order: [[cropDataModel, 'crop_name', 'ASC'],  // Ordering by crop_name in ascending order
      [varietyModel, 'variety_name', 'ASC'],
      [stateModel, 'state_name', 'ASC'],
      [userModel, 'name', 'ASC']],
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'deletedAt', 'crop_type', 'is_active']
      },
      limit: limit,      // Limit the number of records returned
      offset: offset,
    }

    if (req.query.year) {
      condition.where.year = (req.query.year);
    }
    if (req.query.season) {
      condition.where.season = (req.query.season);
    }
    if (req.query.crop_code) {
      condition.where.crop_code = (req.query.crop_code);
    }
    if (req.query.variety_code) {
      condition.where.variety_code = (req.query.variety_code);
    }
    if (req.query.category) {
      condition.where.category = (req.query.category);
    }
    let data = await zsrmcsfsarea.findAll(condition);
    console.log("data found", data);
    if (data.length == 0)
      //res.status(404).json({message: "No data found"})
      return response(res, status.DATA_NOT_AVAILABLE, 404)

    const result = data.map((item) => {
      return {
        id: item.id,
        year: item.year,
        season: item.season,
        user_id: item.user_id,
        crop_code: item.crop_code,
        variety_code: item.variety_code,
        crop_name: item.m_crop.crop_name,
        variety_name: item.m_crop_variety.variety_name,
        state_name: item.m_state.state_name,
        user_name: item.user.name,
        unit: item.unit,
        category: item.category,
        cs_area: parseFloat(item.cs_area),
        cs_quant: parseFloat(item.cs_quant),
        fs_area: parseFloat(item.fs_area),
        fs_quant: parseFloat(item.fs_quant),
      }
    });
    // Get total records for pagination
    const totalRecords = await zsrmcsfsarea.count(condition);
    const totalPages = Math.ceil(totalRecords / limit);  // Calculate total pages
    response(res, status.DATA_AVAILABLE, 200, {
      data: result,
      pagination: {
        currentPage: parseInt(page),
        totalRecords: totalRecords,
        totalPages: totalPages,
        pageSize: parseInt(limit),
      },
    });
  } catch (error) {
    console.log(error);
    return response(res, status.UNEXPECTED_ERROR, 501)
  }

}

