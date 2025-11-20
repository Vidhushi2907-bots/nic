require('dotenv').config()
const response = require('../_helpers/response')
const status = require('../_helpers/status.conf')
const stl_lab = require('../_helpers/getstl-lebourity')
const db = require("../models");
let Validator = require('validatorjs');
const { getYear, parseISO } = require('date-fns');

const stateModel = db.stateModel;
const districtModel = db.districtModel;
const seasonModel = db.seasonModel;
const cropModel = db.cropModel;
const cropCharactersticsModel = db.cropCharactersticsModel;
const cropGroupModel = db.cropGroupModel;
const agencyDetailModel = db.agencyDetailModel
const designationModel = db.designationModel;
const userModel = db.userModel
const seedMultiplicationRatioModel = db.seedMultiplicationRatioModel
const cropVerietyModel = db.cropVerietyModel
const maxLotSizeModel = db.maxLotSizeModel
const seedLabTestModel = db.seedLabTestModel;
const bankDetailsModel = db.bankDetailsModel;
const seasonValueModel = db.seasonValueModel;
const districtLatLongModel = db.districtLatLongModel;
const indentOfBreederseedModel = db.indentOfBreederseedModel;
const varietyModel = db.varietyModel;
const paginateResponse = require("../_utility/generate-otp");
const characterStateModel = db.characterStateModel;
const responsibleInsitutionModel = db.responsibleInsitutionModel;
const allocationToIndentor = db.allocationToIndentor;
const bsp1Model = db.bsp1Model;
const bsp5bModel = db.bsp5bModel;
const plantDetail = db.plantDetail;
const mCategoryOrgnization = db.mCategoryOrgnization;
const otherFertilizerModel = db.otherFertilizerModel;
const otherFertilizerMapping = db.otherFertilizerMapping;
const lotNumberModel = db.lotNumberModel;
const seedTestingReportsModel = db.seedTestingReportsModel;
const varietyCategoryModel = db.varietyCategoryModel;
const allocationToIndentorProductionCenterSeed = db.allocationToIndentorProductionCenterSeed;
const allocationToIndentorSeed = db.allocationToIndentorSeed;
const seedProcessingRegister = db.seedProcessingRegister;
const liftingLotNumberModel = db.liftingLotNumberModel
const allocationtoIndentorliftingseeds = db.allocationtoIndentorliftingseeds
const bspProformaOneBspc = db.bspProformaOneBspc
const bspPerformaBspOne = db.bspPerformaBspOne
const availabilityOfBreederSeedModel = db.availabilityOfBreederSeedModel;
const bspProformaOneBspcModel = db.bspProformaOneBspcModel;
const liftingSeedDetailsModel = db.liftingSeedDetailsModel;
const bspProformaOneModel = db.bspProformaOneModel;
const seedProcessingRegisterModel = db.seedProcessingRegisterModel;
const mAgroLogicalRegionstatesModel = db.mAgroLogicalRegionstatesModel;
const mAgroEcologicalRegionsModel = db.mAgroEcologicalRegionsModel;
const allocationToSPASeed = db.allocationToSPASeed;
const allocationToSPAProductionCenterSeed = db.allocationToSPAProductionCenterSeed

const sequelize = require('sequelize');
const ConditionCreator = require('../_helpers/condition-creator');
const { crop } = require('imagemagick');
const Op = require('sequelize').Op;
const Minio = require("minio");
const Multer = require("multer");
const path = require('path');
const { condition, where } = require('sequelize');
const SeedUserManagement = require('../_helpers/create-user');
const seedhelper = require('../_helpers/seedhelper');

class SeedController {
  static clientSetUp = async () => {
    return new Minio.Client({
      endPoint: 'play.min.io',
      port: 9000,
      useSSL: true,
      accessKey: 'Q3AM3UQ867SPQQA43P2F',
      secretKey: 'zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG'
    });
  }

  static breederSeedssubmision = async (req, res) => {
    try {
      const user_id = req.body.loginedUserid.id
      const dataRow = {
        botanic_name: req.body.botanic_name,
        crop_code: req.body.crop_code,
        crop_name: req.body.crop_name,
        crop_group: req.body.crop_group,
        // group_code: req.body.group_code,
        season: req.body.season,
        srr: req.body.srr,
        group_code: req.body.group_code,
        is_active: req.body.active,
        hindi_name: req.body.crop_name_hindi ? req.body.crop_name_hindi : null,
        scientific_name: req.body.botanic_name,
        user_id: user_id,

      };

      // else{
      let tabledAlteredSuccessfully = false;
      if (req.params && req.params["id"]) {
        const existingDataBotanical = await cropModel.findAll(
          {
            where: {
              [Op.and]: [
                {
                  where: sequelize.where(
                    sequelize.fn('lower', sequelize.col('botanic_name')),
                    sequelize.fn('lower', (req.body.botanic_name))),

                },
                // {
                //   crop_group: {
                //     [Op.eq]:  req.body.crop_group
                //   }

                // },
                // {
                //   group_code: {
                //     [Op.eq]:  req.body.group_code
                //   }

                // },
                {
                  id: {
                    [Op.ne]: req.params["id"]
                  }

                }

              ]
            },


          }



        );

        if (existingDataBotanical && existingDataBotanical.length) {
          const returnresponse = {
            error: 'Botanical name is already registered for this crop'
          }
          return response(res, status.DATA_NOT_AVAILABLE, 402, returnresponse)
        }
        await cropModel.update(dataRow, { where: { id: req.params["id"] } }).then(function (item) {
          tabledAlteredSuccessfully = true;
        }).catch(function (err) {

        });
      }
      else {
        const existingData = await cropModel.findAll({
          where: sequelize.where(
            sequelize.fn('lower', sequelize.col('crop_name')),
            sequelize.fn('lower', (req.body.crop_name)),
          ),


        },


        );

        const existingDataBotanical = await cropModel.findAll(
          {
            where: {
              [Op.and]: [
                {
                  where: sequelize.where(
                    sequelize.fn('lower', sequelize.col('botanic_name')),
                    sequelize.fn('lower', (req.body.botanic_name))),

                }
              ]
            },
          }
        );

        const existingDataAll = await cropModel.findAll(
          {
            where: {
              [Op.and]: [
                {
                  crop_code: {
                    [Op.eq]: req.body.crop_code
                  }
                },
                {
                  group_code: {
                    [Op.eq]: req.body.group_code
                  }

                },
                {
                  season: {
                    [Op.eq]: req.body.season
                  }
                },
              ]
            },
          }
        );
        const existingDataCropCode = await cropModel.findAll(
          {
            where: {
              group_code: req.body.group_code,
              crop_code: req.body.crop_code,
            }
          }
        );
        if (existingDataCropCode && existingDataCropCode.length) {
          const returnresponse = {
            error: 'Crop Already Exist'
          }
          return response(res, status.DATA_NOT_AVAILABLE, 402, returnresponse)
        }
        if (existingDataBotanical && existingDataBotanical.length) {
          const returnresponse = {
            error: 'Botanical name is already registered'
          }
          return response(res, status.DATA_NOT_AVAILABLE, 402, returnresponse)
        }
        if (existingDataAll && existingDataAll.length) {
          const returnresponse = {
            error: 'Crop Already Exist'
          }
          return response(res, status.DATA_NOT_AVAILABLE, 402, returnresponse)
        }
        if (existingData === undefined || existingData.length < 1) {
          const data = await cropModel.create(dataRow);
          await data.save();
          tabledAlteredSuccessfully = true;
        }
      }
      if (tabledAlteredSuccessfully) {
        return response(res, status.DATA_SAVE, 200, {})
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
      // }


    }
    catch (error) {
      console.log(error, 'dataRow');
      return response(res, status.DATA_NOT_SAVE, 500)
    }
  }

  static getBreederSeedssubmisionWithId = async (req, res) => {
    try {
      const data = await cropModel.findAll({
        where: {
          id: req.params.id
        },
        include: [
          {
            model: cropGroupModel

          }
        ]
      });
      if (data && data.length > 0) {
        response(res, status.DATA_AVAILABLE, 200, data[0]);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    }
  }

  static getCroupGroupDeatils = async (req, res) => {
    let data = {};
    try {
      // let condition = {}
      let cropGroup;
      if (req.body.loginedUserid.user_type === "OILSEEDADMIN") {
        cropGroup = { group_code: { [Op.like]: 'A04%' } };
      }
      if (req.body.loginedUserid.user_type === "PULSESSEEDADMIN") {
        cropGroup = { group_code: { [Op.like]: 'A03%' } };
      }

      let condition = {
        where: {
          ...cropGroup
        }
      }

      condition.order = [['group_name', 'ASC']]
      data = await cropGroupModel.findAll(condition);
      // res.send(data)

      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static getSeedMultiplicationCroupGroupDeatils = async (req, res) => {
    let data = {};
    try {
      data = await cropGroupModel.findAll();
      // res.send(data)

      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }


//     static getCropDataByGroupCode = async (req, res) => {
//   try {
//     console.log('Received body:', req.body);
//     let groupCode = req.body.group_code;

//     let condition = {};


//     if (!groupCode || groupCode === 'ALL') {
//       condition = {};
//     } else {
//       condition = { group_code: groupCode };
//     }

//     const crops = await cropModel.findAll({
//       where: condition
//     });

//     return res.status(200).json({
//       status_code: 200,
//       message: crops.length ? 'Crops fetched successfully' : 'No crops found',
//       data: crops
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       status_code: 500,
//       message: 'Internal server error',
//       data: null
//     });
//   }
// };

static getCropDataByGroupCode = async (req, res) => {
  try {
    const { group_code, crop_code } = req.body;


    if (crop_code) {
      const varieties = await varietyModel.findAll({
        where: { crop_code: crop_code },
        attributes: [
          'id',
          'crop_code',
          'variety_code',
          'variety_name',
          'meeting_number',
          'type',
          'not_date',
          'not_number',
          'is_notified',
          'developed_by',
          'introduce_year',
          'release_date',
          'crop_group_code'
        ],
        order: [['id', 'ASC']]
      });

      return res.status(200).json({
        status_code: 200,
        message: varieties.length ? 'Varieties fetched successfully' : 'No varieties found',
        data: varieties
      });
    }

    let condition = {};
    if (group_code && group_code !== 'ALL') {
      condition.group_code = group_code;
    }

    const crops = await cropModel.findAll({
      where: condition,
      attributes: [
        'id',
        'crop_code',
        'crop_name',
        'crop_group',
        'group_code',
        'botanic_name',
        'season',
        'srr',
        [sequelize.literal(`(
          SELECT COUNT(*)
          FROM m_crop_varieties v
          WHERE v.crop_code = m_crop.crop_code
        )`), 'total_variety_count']
      ],
      order: [['id', 'ASC']]
    });

    return res.status(200).json({
      status_code: 200,
      message: crops.length ? 'Crops fetched successfully' : 'No crops found',
      total_crop_count: crops.length,
      data: crops
    });

  } catch (error) {
    console.error("❌ Error in getCropDataByGroupCode:", error);
    return res.status(500).json({
      status_code: 500,
      message: 'Internal server error',
      data: null
    });
  }
};


  // static getCropDataByGroupCode = async (req, res) => {
  //   try {
  //     console.log('Received body:', req.body);
  //     const groupCode = req.body.group_code;

  //     if (!groupCode) {
  //       return res.status(400).json({
  //         status_code: 400,
  //         message: 'Group code is required',
  //         data: null
  //       });
  //     }

  //     const crops = await cropModel.findAll({
  //       where: { group_code: groupCode }
  //     });

  //     res.status(200).json({
  //       status_code: 200,
  //       message: 'Crops fetched successfully',
  //       data: crops
  //     });

  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({
  //       status_code: 500,
  //       message: 'Internal server error',
  //       data: null
  //     });
  //   }
  // };

  // static getCropDataByGroupCode = async (req, res) => {
  //   try {
  //     console.log('Received body:', req.body);
  //     const data = await cropModel.findAll({
  //       where: {
  //         group_code: req.body.cropGroupCode
  //       }
  //     })

  //     response(res, status.DATA_AVAILABLE, 200, data)

  //   } catch (error) {
  //     console.log(error)
  //     response(res, status.UNEXPECTED_ERROR, 500)
  //   }
  // }
  static getSeasonDetails = async (req, res) => {
    let data = {};
    try {
      let condition = {};
      condition.order = [['id', 'asc']];
      data = await seasonModel.findAll(condition);
      // res.send(data)

      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static getBspOneSeasonDetails = async (req, res) => {
    let data = {};
    try {
      let condition = {
        include: [
          {
            model: seasonModel
          },
        ],
        where: {
          icar_freeze: 1
        },
        attribute: []
      };
      condition.order = [['id', 'asc']];
      data = await indentOfBreederseedModel.findAll(condition);
      // res.send(data)

      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }


  static indentorList = async (req, res) => {
    let data = {};
    try {
      let rules = {
        'search.state_code': 'integer',
        'search.district_id': 'integer',
        'search.agencyName': 'string',
      };

      let validation = new Validator(req.body, rules);

      const isValidData = validation.passes();

      if (!isValidData) {
        let errorResponse = {};
        for (let key in rules) {
          const error = validation.errors.get(key);
          if (error.length) {
            errorResponse[key] = error;
          }
        }
        return response(res, status.BAD_REQUEST, 400, errorResponse, internalCall)
      }

      let { page, pageSize } = req.body;

      // if (!page) page = 1;

      let condition = {
      };
      if (req.body.id) {
        condition = {
          include: [
            {
              model: designationModel,
              left: true,
              attributes: ['name']
            },
            {
              model: userModel,
              left: true,
              attributes: [],
              where: {
                user_type: 'BR'
              }
            },
            {
              model: stateModel,
              left: true,
              attributes: ['state_name'],
            },
            {
              model: districtModel,
              left: true,
              attributes: ['district_name'],
            },
          ],
          where: {
            id: req.body.id,

          }
        };
      } else {
        condition = {
          include: [
            {
              model: designationModel,
              left: true,
              attributes: ['name']
            },
            {
              model: userModel,
              left: true,
              attributes: [],
              where: {
                user_type: 'BR'
              }
            },
            {
              model: stateModel,
              left: true,
              attributes: ['state_name'],
            },
            {
              model: districtModel,
              left: true,
              attributes: ['district_name'],
            },
          ],
          where: {

          }
        };
      }
      if (page === undefined) page = 1;
      if (pageSize === undefined) pageSize = 10;
      // set pageSize to -1 to prevent sizing pageSize = 10;

      if (page > 0 && pageSize > 0) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }
      // const sortOrder = req.body.sort ? req.body.sort : 'id';
      // const sortDirection = req.body.order ? req.body.order : 'DESC';



      const sortOrder = req.body.sort ? req.body.sort : 'id';
      const sortDirection = req.body.order ? req.body.order : 'DESC';
      console.log('req.body.searchreq.body.search', req.body.search);
      if (req.body.search) {
        if (req.body.search.state_code) {
          condition.where.state_id = (req.body.search.state_code);
        }
        if (req.body.search.district_id) {
          condition.where.district_id = (req.body.search.district_id);
        }
        if (req.body.search.agencyName) {
          condition.where.agency_name = (req.body.search.agencyName);
        }
      }
      condition.order = [[sortOrder, sortDirection]];

      data = await agencyDetailModel.findAndCountAll(condition);
      // res.send(data)



      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static getDesignation = async (req, res) => {
    let data = {};
    try {
      data = await designationModel.findAll();
      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static addIndentor = async (req, res) => {
    let returnResponse = {};
    let condition = {};
    try {
      let tabledAlteredSuccessfully = false;
      const usersData = {
        agency_name: req.body.agency_name,
        created_by: 1,//req.body.created_by,
        category: req.body.category,
        // state_id: req.body.state,
        // district_id: req.body.district,
        short_name: req.body.display_name,
        address: req.body.address,
        contact_person_name: req.body.contact_person_name,
        contact_person_designation: req.body.contact_person_designation_id,
        // contact_person_mobile: req.body.mobile_number,
        phone_number: req.body.phone_number,
        fax_no: req.body.fax_no,
        longitude: req.body.longitude,
        latitude: req.body.latitude,
        email: req.body.email,
        bank_name: req.body.bank_name,
        bank_branch_name: req.body.bank_branch_name,
        bank_ifsc_code: req.body.bank_ifsc_code,
        bank_account_number: req.body.bank_account_number,
        state_id: req.body.state_id,
        district_id: req.body.district_id,
        mobile_number: req.body.mobile_number
      }

      const existingData = await agencyDetailModel.findAll({
        where: sequelize.where(
          sequelize.fn('lower', sequelize.col('short_name')),
          sequelize.fn('lower', req.body.display_name),
        )
      });

      if (existingData === undefined || existingData.length < 1) {
        const data = agencyDetailModel.build(usersData);
        const insertData = await data.save();
        const userData = userModel.build({
          agency_id: insertData.id,
          username: req.body.display_name,
          name: req.body.display_name,
          email_id: req.body.email,
          password: '123456',
          mobile_number: req.body.mobile_number,
          // designation_id: req.body.contact_person_designation,
          user_type: 'BR',
        });
        await userData.save();
        tabledAlteredSuccessfully = true;
      }

      if (tabledAlteredSuccessfully) {
        return response(res, status.DATA_SAVE, 200, returnResponse, internalCall)
      } else {
        return response(res, status.DATA_NOT_SAVE, 401, returnResponse, internalCall)
      }



      // if (req.body.search) {
      //   condition.where = {};
      //   if (req.body.search.state_id) {
      //     condition.where.state_id = parseInt(req.body.search.state_id);

      //   }
      //   if (req.body.search.state_id) {
      //     condition.where.state_id = parseInt(req.body.search.state_id);

      //   }
      //   let data = await agencyDetailModel.findAndCountAll(condition);
      //   if (data) {

      //     return response(res, status.DATA_AVAILABLE, 200, data)
      //   }
      //   else {
      //     return response(res, status.DATA_NOT_AVAILABLE, 400)
      //   }
      // }
      // return response(res, status.DATA_SAVE, 200, insertData)


    } catch (error) {
      returnResponse = {
        message: error.message
      };
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }

  static deleteBreederSeedssubmisionWithId = async (req, res) => {
    try {

      const condition = {
        where: {
          agency_id: Number(req.params.id)
        },
        attributes: ['id', 'code', 'username', 'user_type']
      };
      let data = await userModel.findOne(condition);

      // console.log("dtaaa111111111", data)
      const USER_API_KEY = process.env.APPKEY
      let seedUserData = { "appKey": USER_API_KEY, "stateCode": "CENTRAL", "role": data.user_type, "userid": data.username }
      console.log("seedUserData", seedUserData)
      await SeedUserManagement.inactiveUser(seedUserData);


      if (req.body !== undefined
        && req.body.crop_data !== undefined
        && req.body.crop_data.length > 0) {
        for (let index = 0; index < req.body.crop_data.length; index++) {
          const element = req.body.crop_data[index];
          console.log(element, 'element')
          const datas = cropModel.update({
            breeder_id: null
          }, {
            where: {
              crop_code: element.crop_code
            }
          })
        }
      }
      const param = {
        is_active: 0
      }
      agencyDetailModel.update(param, {
        where: {
          id: req.params.id
        }
      });
      userModel.update(param, {
        where: {
          agency_id: req.params.id
        }
      });
      response(res, status.DATA_DELETED, 200, {});
    }
    catch (error) {
      console.log(error)
      return response(res, status.UNEXPECTED_ERROR, 500)
    }
  }

  static deleteCropDetails = async (req, res) => {
    try {
      cropModel.destroy({
        where: {
          id: req.params.id
        }
      });
      response(res, status.DATA_DELETED, 200, {});
    }
    catch (error) {
      return response(res, status.UNEXPECTED_ERROR, 500)
    }
  }

  static updateIndentor = async (req, res) => {
    let internalCall = {};
    try {
      let tabledAlteredSuccessfully = false;
      const id = req.body.id;
      let usersData = {
        agency_name: req.body.agency_name,
        created_by: 1,//req.body.created_by,
        category: req.body.category,
        // state_id: req.body.state,
        // district_id: req.body.district,
        short_name: req.body.display_name,
        address: req.body.address,
        contact_person_name: req.body.contact_person_name,
        contact_person_designation: req.body.contact_person_designation_id,
        // contact_person_mobile: req.body.mobile_number,
        phone_number: req.body.phone_number,
        fax_no: req.body.fax_no,
        longitude: req.body.longitude,
        latitude: req.body.latitude,
        email: req.body.email,
        bank_name: req.body.bank_name,
        bank_branch_name: req.body.bank_branch_name,
        bank_ifsc_code: req.body.bank_ifsc_code,
        bank_account_number: req.body.bank_account_number,
        state_id: req.body.state_id,
        district_id: req.body.district_id,
        mobile_number: req.body.mobile_number
      };

      const existingData = await agencyDetailModel.findAll({
        where: sequelize.where(
          sequelize.fn('lower', sequelize.col('short_name')),
          sequelize.fn('lower', req.body.display_name),
        )
      });

      if (existingData === undefined || existingData.length < 1) {
        const data = await agencyDetailModel.update({ usersData }, {
          where: {
            id: id
          }
        });
        tabledAlteredSuccessfully = true;
      }


      if (tabledAlteredSuccessfully) {
        return response(res, status.DATA_SAVE, 200, returnResponse, internalCall)
      } else {
        return response(res, status.DATA_NOT_SAVE, 401, returnResponse, internalCall)
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_SAVE, 500, error)
    }
  }

  static viewIndentor = async (req, res) => {
    let data = {};
    try {

      let { page, pageSize } = req.body;

      if (!page) page = 1;


      let condition = {
        include: [
          {
            model: userModel,
            attributes: ['*']
          },
        ],

      };


      if (page && pageSize) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }

      condition.order = [['crop_name', 'ASC']];

      data = await agencyDetailModel.findAll(condition);
      // res.send(data)

      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500, error)
    }
  }



  static viewSeedMuliplicationRatio = async (req, res) => {
    try {
      let { page, pageSize, search, isReport } = req.body;
      let cropGroup;
      if (req.body.loginedUserid.user_type === "OILSEEDADMIN") {
        cropGroup = { group_code: { [Op.like]: 'A04%' } };
      }
      if (req.body.loginedUserid.user_type === "PULSESSEEDADMIN") {
        cropGroup = { group_code: { [Op.like]: 'A03%' } };
      }

      let condition = {
        include: [
          {
            model: cropModel,
            where: {
              [Op.and]: [
                {
                  crop_code: {
                    [Op.ne]: null
                  }

                },
                {
                  crop_code: {
                    [Op.ne]: ""
                  }

                }

              ]
            },
            include: [
              {
                model: cropGroupModel,
                where: {
                  ...cropGroup
                }
              }

            ],
            left: true,
            attributes: ['crop_name']
          },
        ],
        where: {
          [Op.and]: [
            {
              crop_code: {
                [Op.ne]: null
              }

            },
            {
              crop_code: {
                [Op.ne]: ""
              }

            }

          ]
        },


      }
      
      // if (page === undefined) page = 1;
      // // if (pageSize === undefined) pageSize = 50;

      // if (page > 0 && pageSize > 0) {
      //   condition.limit = pageSize;
      //   condition.offset = (page * pageSize) - pageSize;
      // }


      if (!isReport) {
        if (page === undefined) page = 1;
        // if (pageSize === undefined) pageSize = 50;
  
        if (page > 0 && pageSize > 0) {
          condition.limit = pageSize;
          condition.offset = (page * pageSize) - pageSize;
        }
      }
      else
      {
        
      }

      

      // const sortOrder = req.body.sort ? req.body.sort : 'id';
      // const sortDirection = req.body.order ? req.body.order : 'DESC';

      condition.order = [[sequelize.col('m_crop->m_crop_group.group_name'), 'ASC'], [sequelize.fn('lower', sequelize.col('m_crop.crop_name')), 'ASC']];

      if (search) {
        if (search.crop_group_code) {
          condition.where['crop_group_code'] = search.crop_group_code
        }

        if (search.crop_code) {
          condition.where['crop_code'] = search.crop_code
        }
      }

      const data = await seedMultiplicationRatioModel.findAndCountAll(condition);
      if (!data) {
        return response(res, status.DATA_NOT_AVAILABLE, 404);
      }

      return response(res, status.DATA_AVAILABLE, 200, data);
    }
    catch (error) {
      const returnResponse = {
        message: error.message,
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }

  static viewSeedMuliplicationRatioByCropCode = async (req, res) => {
    try {
      let { page, pageSize, search, isReport } = req.body;

      let condition = {
        include: [
          {
            model: cropModel,
            where: {
              [Op.and]: [
                {
                  crop_code: {
                    [Op.ne]: null
                  }

                },
                {
                  crop_code: {
                    [Op.ne]: ""
                  }

                }

              ]
            },
            include: [
              {
                model: cropGroupModel
              }

            ],
            left: true,
            attributes: ['crop_name']
          },
        ],
        where: {}
      }

      // if (page === undefined) page = 1;
      // if (pageSize === undefined) pageSize = 50;

      // if (page > 0 && pageSize > 0) {
      //   condition.limit = pageSize;
      //   condition.offset = (page * pageSize) - pageSize;
      // }

      if (!isReport) {
        if (page === undefined) page = 1;
      if (pageSize === undefined) pageSize = 50;

      if (page > 0 && pageSize > 0) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }

      }
      {

      }
      

      const sortOrder = req.body.sort ? req.body.sort : 'id';
      const sortDirection = req.body.order ? req.body.order : 'DESC';

      condition.order = [[sortOrder, sortDirection]];

      if (search.isSearch) {
        if (search.crop_group_code) {
          condition.where['crop_group_code'] = search.crop_group_code
        }

        if (search.crop_code) {
          condition.where['crop_code'] = search.crop_code
        }
      }

      const data = await seedMultiplicationRatioModel.findAndCountAll(condition);
      if (!data) {
        return response(res, status.DATA_NOT_AVAILABLE, 404);
      }

      return response(res, status.DATA_AVAILABLE, 200, data);
    }
    catch (error) {
      const returnResponse = {
        message: error.message,
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }


  static getTransactionsDetails = async (req, res) => {
    const { internalCall } = req.body;
    let returnResponse = {};
    try {

      let rules = {
        'search.crop_name': 'string',
        'search.crop_group_code': 'string',
      };

      let validation = new Validator(req.body, rules);

      const isValidData = validation.passes();

      if (!isValidData) {
        let errorResponse = {};
        for (let key in rules) {
          const error = validation.errors.get(key);
          if (error.length) {
            errorResponse[key] = error;
          }
        }
        return response(res, status.BAD_REQUEST, 400, errorResponse, internalCall)
      }

      let { page, pageSize, search } = req.body;


      let condition = {
        include: [{
          model: cropGroupModel
        }],
        where: {
          // is_active: 1
        },
        raw: false,

      };
      if (page === undefined) page = 1;
      if (pageSize === undefined) {
        pageSize = 10;
      } // set pageSize to -1 to prevent sizing

      if (page > 0 && pageSize > 0) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }

      const sortOrder = req.body.sort ? req.body.sort : 'crop_name';
      const sortDirection = req.body.order ? req.body.order : 'ASC';



      condition.order = [[sortOrder, sortDirection]];

      if (req.body.search) {

        if (req.body.search.group_code) {
          condition.where.group_code = (req.body.search.group_code);
        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = (req.body.search.crop_code);
        }
        if (req.body.search.crop_name_data) {

          condition.where.crop_group = (req.body.search.crop_name_data);
        }
        // if (req.body.search.crop_group) {

        //   condition.where.crop_group = (req.body.search.crop_group);
        // }

      }


      const queryData = await cropModel.findAndCountAll(condition);
      // returnResponse = await paginateResponse(queryData, page, pageSize);


      return response(res, status.OK, 200, queryData, internalCall);

    } catch (error) {
      returnResponse = {
        message: error.message
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }

  static getbreederList = async (req, res) => {
    const { internalCall } = req.body;
    let returnResponse = {};
    try {

      let rules = {
        'search.state_code': 'integer',
        'search.district_id': 'integer',
        'search.agencyName': 'string',
      };

      let validation = new Validator(req.body, rules);

      const isValidData = validation.passes();

      if (!isValidData) {
        let errorResponse = {};
        for (let key in rules) {
          const error = validation.errors.get(key);
          if (error.length) {
            errorResponse[key] = error;
          }
        }
        return response(res, status.BAD_REQUEST, 400, errorResponse, internalCall)
      }

      let { page, pageSize } = req.body;

      if (!page) page = 1;


      let condition = {

        where: {
          is_active: 1
        },
        raw: false,

      };


      const sortOrder = req.body.sort ? req.body.sort : 'created_at';
      const sortDirection = req.body.order ? req.body.order : 'DESC';

      if (page && pageSize) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }

      condition.order = [[sortOrder, sortDirection]];

      if (req.body.search) {

        if (req.body.search.state_code) {
          condition.where.state_id = (req.body.search.state_code);
        }

        if (req.body.search.district_id) {

          condition.where.district_id = (req.body.search.district_id);
        }
        if (req.body.search.agencyName) {

          condition.where.agency_name = (req.body.search.agencyName);
        }

      }


      const queryData = await agencyDetailModel.findAndCountAll(condition);
      returnResponse = await paginateResponse(queryData, page, pageSize);


      return response(res, status.OK, 200, returnResponse, internalCall);

    } catch (error) {
      returnResponse = {
        message: error.message
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }
  static getAgencyDetails = async (req, res) => {
    let data = {};


    try {
      data = await agencyDetailModel.findAll({
        order: [['agency_name', 'ASC']]
      });
      console.log('data', data)
      // res.send(data)

      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static getDynamicVarietyCode = async (req, res) => {
    const { internalCall } = req.body;
    let returnResponse = {};
    try {

      let rules = {
        'search.crop_code': 'string',
      };

      let validation = new Validator(req.body, rules);

      const isValidData = validation.passes();

      if (!isValidData) {
        let errorResponse = {};
        for (let key in rules) {
          const error = validation.errors.get(key);
          if (error.length) {
            errorResponse[key] = error;
          }
        }
        return response(res, status.BAD_REQUEST, 400, errorResponse, internalCall)
      }
      console.log("req.body.search.crop_code", req.body.search.crop_code);
      let condition = {

        where: {
          variety_code: {
            [Op.like]: "%" + req.body.search.crop_code + "%",
          },
          // id: req.body.search.variety_id,
          is_active: 1
        },
        raw: false,
        limit: 1
      };

      condition.order = [[sequelize.fn('LENGTH', sequelize.col('variety_code')), 'DESC'],
      ['variety_code', 'DESC'],]

      const queryData = await cropVerietyModel.findAll(condition);

      return response(res, status.OK, 200, queryData, internalCall);

    } catch (error) {
      returnResponse = {
        message: error.message
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }
  static getCropCode = async (req, res) => {
    const { internalCall } = req.body;
    let returnResponse = {};
    try {

      let rules = {
        'search.crop_name': 'string',
      };

      let validation = new Validator(req.body, rules);

      if (!isValidData) {
        let errorResponse = {};
        for (let key in rules) {
          const error = validation.errors.get(key);
          if (error.length) {
            errorResponse[key] = error;
          }
        }
        return response(res, status.BAD_REQUEST, 400, errorResponse, internalCall)
      }



      let condition = {

        where: {
          crop_name: req.body.search.crop_name,
          is_active: 1
        },
        raw: false,
        limit: 1
      };

      condition.order = [['crop_name', 'Asc']];

      const queryData = await cropModel.findAll(condition);

      return response(res, status.OK, 200, queryData, internalCall);

    } catch (error) {
      returnResponse = {
        message: error.message
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }
  static getDynamicCropCode = async (req, res) => {
    const { internalCall } = req.body;
    let returnResponse = {};
    try {

      let rules = {
        'search.group_code': 'string',
      };

      let validation = new Validator(req.body, rules);

      const isValidData = validation.passes();

      if (!isValidData) {
        let errorResponse = {};
        for (let key in rules) {
          const error = validation.errors.get(key);
          if (error.length) {
            errorResponse[key] = error;
          }
        }
        return response(res, status.BAD_REQUEST, 400, errorResponse, internalCall)
      }



      let condition = {

        where: {
          [Op.and]: [
            {
              group_code: {
                // [Op.like]: "%" + req.body.search.group_code + "%",
                [Op.eq]: req.body.search.group_code,
              },
            },
            {
              crop_code: {
                [Op.not]: null
              }
            },
            {
              crop_code: {
                [Op.not]: ''
              }
            }
          ]
          // is_active: 1
        },
        raw: false,
        // limit: 1
      };

      condition.order = [['id', 'DESC']];

      const queryData = await cropModel.findAll(condition);

      return response(res, status.OK, 200, queryData, internalCall);

    } catch (error) {
      returnResponse = {
        message: error.message
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }

  static checkAlreadyExistsCropCode = async (req, res) => {
    const { internalCall } = req.body;
    let returnResponse = {};
    try {

      let rules = {
        'search.crop_name': 'string',
      };

      let validation = new Validator(req.body, rules);

      const isValidData = validation.passes();

      if (!isValidData) {
        let errorResponse = {};
        for (let key in rules) {
          const error = validation.errors.get(key);
          if (error.length) {
            errorResponse[key] = error;
          }
        }
        return response(res, status.BAD_REQUEST, 400, errorResponse, internalCall)
      }

      let condition = {
        where: {
          crop_name: req.body.search.crop_name,
          is_active: 1
        },
        raw: false,
        limit: 1
      };
      const queryData = await cropModel.findAll(condition);

      return response(res, status.OK, 200, queryData, internalCall);

    } catch (error) {
      returnResponse = {
        message: error.message
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }

  static checkAlreadyExistsVarietyName = async (req, res) => {
    const { internalCall } = req.body;
    let returnResponse = {};
    try {

      let rules = {
        'search.variety_name': 'string',
      };

      let validation = new Validator(req.body, rules);

      const isValidData = validation.passes();

      if (!isValidData) {
        let errorResponse = {};
        for (let key in rules) {
          const error = validation.errors.get(key);
          if (error.length) {
            errorResponse[key] = error;
          }
        }
        return response(res, status.BAD_REQUEST, 400, errorResponse, internalCall)
      }

      let condition = {
        where: {
          variety_name: req.body.search.variety_name,
          is_active: 1
        },
        raw: false,
        limit: 1
      };
      const queryData = await cropVerietyModel.findAll(condition);

      return response(res, status.OK, 200, queryData, internalCall);

    } catch (error) {
      returnResponse = {
        message: error.message
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }

  static getCropVarietyCharacteristics = async (req, res) => {
    let data = {};
    try {
      let condition = {};
      if (req.body.id) {
        condition = {
          // include: [
          //   {
          //     model:designationModel,
          //     left: true,
          //     attributes: ['name']
          //   },
          //   {
          //     model:userModel,
          //     left: true,
          //     attributes: [],
          //     where:{
          //       user_type:'agency'
          //     }
          //   },
          // ],
          where: {
            id: req.body.id,
          }
        };
      } else {
        condition = {
          // include: [
          //   {
          //     model:designationModel,
          //     left: true,
          //     attributes: ['name']
          //   },
          //   {
          //     model:userModel,
          //     left: true,
          //     attributes: [],
          //     where:{
          //       user_type:'agency'
          //     }
          //   },
          // ],
          where: {

          }
        };
      }


      const sortOrder = req.body.sort ? req.body.sort : 'id';
      const sortDirection = req.body.order ? req.body.order : 'DESC';

      let { page, pageSize, search } = req.body;
      if (page === undefined) page = 1;
      if (pageSize === undefined) pageSize = 5; // set pageSize to -1 to prevent sizing

      if (page > 0 && pageSize > 0) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }

      condition.order = [[sortOrder, sortDirection]];
      if (req.body.search) {
        if (req.body.search.crop_group_id) {
          condition.where.crop_group_id = (req.body.search.crop_group_id);
        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = (req.body.search.crop_code);
        }
        if (req.body.search.variety_id) {
          condition.where.variety_id = (req.body.search.variety_id);
        }
      }

      data = await cropCharactersticsModel.findAndCountAll(condition);
      let returnResponse = await paginateResponse(data, page, pageSize);
      response(res, status.DATA_AVAILABLE, 200, returnResponse)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static addCropVarietyCharacteristics = async (req, res) => {
    let returnResponse = {};
    let condition = {};
    try {
      let rules = {
        // 'crop_group_id': 'string',
        // 'crop_code': 'string',
        // 'variety_id': 'string',
        // 'iet_number': 'string',
        // 'resemblance_to_variety': 'string',
        // 'parentage': 'string',
        // 'maturity_from': 'string',
        // 'maturity_to': 'string',
        // 'maturity_date': 'string',
        // 'spacing_from': 'string',
        // 'spacing_to': 'string',
        // 'spacing_date': 'string',
        // 'generic_morphological_characteristics': 'string',
        // 'specific_morphological_characteristics': 'string',
        // 'seed_rate': 'string',
        // 'average_from': 'string',
        // 'average_to': 'string',
        // 'average_total': 'string',
        // 'fertilizer_dosage': 'string',
        // 'agronomic_features': 'string',
        // 'recommended_ecology': 'string',
        // 'abiotic_stress': 'string',
        // 'major_diseases': 'string',
        // 'major_pest': 'string',
      };

      let validation = new Validator(req.body, rules);

      const isValidData = validation.passes();

      if (!isValidData) {
        let errorResponse = {};
        for (let key in rules) {
          const error = validation.errors.get(key);
          if (error.length) {
            errorResponse[key] = error;
          }
        }
        return response(res, status.BAD_REQUEST, 400, errorResponse, internalCall)
      }
      const data = agencyDetailModel.build({
        crop_group_id: req.body.crop_group_id,
        crop_code: req.body.crop_code,
        variety_id: req.body.variety_id,
        iet_number: req.body.iet_number,
        resemblance_to_variety: req.body.resemblance_to_variety,
        parentage: req.body.parentage,
        maturity_from: req.body.maturity_from,
        maturity_to: req.body.maturity_to,
        maturity_date: req.body.maturity_date,
        spacing_from: req.body.spacing_from,
        spacing_to: req.body.spacing_to,
        spacing_date: req.body.spacing_date,
        generic_morphological: req.body.generic_morphological_characteristics,
        specific_morphological_characteristics: req.body.specific_morphological_characteristics,
        seed_rate: req.body.seed_rate,
        average_yeild_from: req.body.average_from,
        average_yeild_to: req.body.average_to,
        average_total: req.body.average_total,
        fertilizer_dosage: req.body.fertilizer_dosage,
        agronomic_features: req.body.agronomic_features,
        adoptation: req.body.recommended_ecology,
        abiotic_stress: req.body.abiotic_stress,
        major_diseases: req.body.major_diseases,
        major_pest: req.body.major_pest,
      });


      const insertData = await data.save();


      const userData = userModel.build({
        agency_id: insertData.id,
        username: req.body.display_name,
        name: req.body.display_name,
        email_id: req.body.email,
        password: '123456',
        mobile_number: req.body.mobile_number,
        // designation_id: req.body.contact_person_designation,
        user_type: 'BR',
      });
      await userData.save();

      if (req.body.search) {
        condition.where = {};
        if (req.body.search.state_id) {
          condition.where.state_id = parseInt(req.body.search.state_id);

        }
        if (req.body.search.state_id) {
          condition.where.state_id = parseInt(req.body.search.state_id);

        }
        let data = await agencyDetailModel.findAndCountAll(condition);
        if (data) {

          return response(res, status.DATA_AVAILABLE, 200, data)
        }
        else {
          return response(res, status.DATA_NOT_AVAILABLE, 400)
        }
      }
      return response(res, status.DATA_SAVE, 200, insertData)


    } catch (error) {
      returnResponse = {
        message: error.message
      };
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }

  static getBreederWithId = async (req, res) => {
    try {
      const data = await agencyDetailModel.findAll({
        where: {
          id: req.params.id
        }
      });
      if (data && data.length > 0) {
        response(res, status.DATA_AVAILABLE, 200, data[0]);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    }
  }

  static test = async (req, res) => {
    try {
      response(res, "Api Working fine", 200, "Success")
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_SAVE, 500)
    }
  }
  static addCropMaxLotSizeData = async (req, res) => {
    let returnResponse = {};
    let internalCall = {};
    try {
      let rules = {
        'crop': 'string',
        'max_lot_size': 'string',
        'group_code': 'string',
        'group_name': 'string',
        'crop_code': 'string'
      };

      let validation = new Validator(req.body, rules);

      const isValidData = validation.passes();

      if (!isValidData) {
        let errorResponse = {};
        for (let key in rules) {
          const error = validation.errors.get(key);
          if (error.length) {
            errorResponse[key] = error;
          }
        }
        return response(res, status.BAD_REQUEST, 400, errorResponse, internalCall)
      }

      let data = {
        crop: req.body.crop,
        is_active: 1,
        user_id: req.body.user_id,
        created_by: req.body.user_id,
        updated_by: req.body.user_id,
        max_lot_size: req.body.max_lot_size,
        group_code: req.body.group_code,
        group_name: req.body.group_name,
        crop_code: req.body.crop_code
      }
      const maxLotSizeData = maxLotSizeModel.create(data);
      returnResponse = {};
      return response(res, status.DATA_SAVE, 200, returnResponse, internalCall)

    } catch (error) {
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }

  static updateCropMaxLotSizeData = async (req, res) => {
    let returnResponse = {};
    let internalCall = {};
    try {
      let rules = {
        'crop': 'string',
        'max_lot_size': 'string',
        'group_code': 'string',
        'group_name': 'string',
        'crop_code': 'string',
      };

      let validation = new Validator(req.body, rules);

      const isValidData = validation.passes();

      if (!isValidData) {
        let errorResponse = {};
        for (let key in rules) {
          const error = validation.errors.get(key);
          if (error.length) {
            errorResponse[key] = error;
          }
        }
        return response(res, status.BAD_REQUEST, 400, errorResponse, internalCall)
      }

      let data = {
        crop: req.body.crop,
        updated_by: req.body.updated_by,
        max_lot_size: req.body.max_lot_size,
        group_code: req.body.group_code,
        group_name: req.body.group_name,
        crop_code: req.body.crop_code,
        is_active: req.body.active,
      }
      const maxLotSizeData = maxLotSizeModel.update(data, { where: { id: req.body.id } });
      returnResponse = {};
      return response(res, status.DATA_UPDATED, 200, returnResponse, internalCall)

    } catch (error) {
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }

  static getCropMaxLotSizeData = async (req, res) => {
    let returnResponse = {};
    try {
      let rules = {
        'id': 'integer',
        'crop': 'string',
        'max_lot_size': 'string',
        'search.crop_name': 'string',
        'search.group_code': 'string'

      };

      let validation = new Validator(req.body, rules);

      const isValidData = validation.passes();

      if (!isValidData) {
        let errorResponse = {};
        for (let key in rules) {
          const error = validation.errors.get(key);
          if (error.length) {
            errorResponse[key] = error;
          }
        }
        return response(res, status.BAD_REQUEST, 400, errorResponse, internalCall)
      }

      let cropGroup;
      if (req.body.loginedUserid.user_type === "OILSEEDADMIN") {
        cropGroup = { crop_code: { [Op.like]: 'A04%' } };
      }
      if (req.body.loginedUserid.user_type === "PULSESSEEDADMIN") {
        cropGroup = { crop_code: { [Op.like]: 'A03%' } };
      }

      let condition = {
        include: [
          {
            model: cropModel,
            include: [
              {
                model: cropGroupModel,
                required: true,

              },
            ],
            // where: {
            //   is_active: 1

            // }
          }

        ],
        where: {
          // is_active:1
          ...cropGroup
        }
      };

      // const userId = req.body.loginedUserid.id
      // if (userId) {
      //   condition.where.user_id = userId
      // }

      if (req.body.search) {
        if (req.body.search.id) {
          condition.where.id = req.body.search.id;
        }
        if (req.body.search.crop_name) {
          condition.where.crop_code = req.body.search.crop_name;
        }
        if (req.body.search.group_code) {
          condition.include[0].where = {};
          condition.include[0].where.group_code = req.body.search.group_code;
          // condition.include[0].where.is_active = 1;
        }
      }
      let { page, pageSize, search } = req.body;

      // if (page === undefined) page = 1;
      // if (pageSize === undefined)
      //   pageSize = 10; // set pageSize to -1 to prevent sizing

      // if (page > 0 && pageSize > 0) {
      //   condition.limit = pageSize;
      //   condition.offset = (page * pageSize) - pageSize;
      // }

      if (!search?.isReport) {
        if (page === undefined) page = 1;
      if (pageSize === undefined)
        pageSize = 10; // set pageSize to -1 to prevent sizing

      if (page > 0 && pageSize > 0) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }
      }
      else
      {
        
      }
  

      // condition.order = [['group_name', 'ASC'], ['crop', 'ASC']];
      condition.order = [[sequelize.col('m_crop->m_crop_group.group_name'), 'ASC'], [sequelize.col('m_crop.crop_name'), 'ASC']]
      const data = await maxLotSizeModel.findAndCountAll(condition);
      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, data);
      }
      if (!data) {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }

  static getCropMaxLotSizeDataByCropCode = async (req, res) => {
    try {

      const data = await maxLotSizeModel.findAll({
        where: {
          crop_code: req.params.id
        }
      });
      if (data && data.length > 0) {
        response(res, status.DATA_AVAILABLE, 200, data[0]);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      console.log(error)
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    }
  }

  static deleteCropMaxLotSizeData = async (req, res) => {
    try {
      console.log('delete', req.params.id);
      maxLotSizeModel.destroy({
        where: {
          id: req.params.id
        }
      });
      response(res, status.DATA_DELETED, 200, {});
    }
    catch (error) {
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    }
  }
  static updateStatusCropMaxLotSizeData = async (req, res) => {
    try {
      console.log('delete', req.params.id);
      let data = {
        is_active: 0,
        updated_by: req.body.user_id
      }
      maxLotSizeModel.update(data, {
        where: {
          id: req.body.id
        }
      });
      response(res, status.DATA_DELETED, 200, {});
    }
    catch (error) {
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    }
  }

  //lab TEST api
  static addLabTestData = async (req, res) => {
    let returnResponse = {};
    let internalCall = {};
    let tabledAlteredSuccessfully = false;
    try {
      let rules = {
        'lab_name': 'string',
        // 'max_lot_size': 'string'
      };

      let validation = new Validator(req.body, rules);

      const isValidData = validation.passes();

      if (!isValidData) {
        let errorResponse = {};
        for (let key in rules) {
          const error = validation.errors.get(key);
          if (error.length) {
            errorResponse[key] = error;
          }
        }
        return response(res, status.BAD_REQUEST, 400, errorResponse, internalCall)
      }

      let data = {
        user_id: req.body.user_id,
        created_by: req.body.user_id,
        updated_by: req.body.user_id,
        lab_name: req.body.lab_name,
        address: req.body.address,
        state_id: req.body.state_id,
        district_id: req.body.district_id,
        short_name: req.body.short_name,
        mobile_number: req.body.mobile_number,
        phone_number: req.body.phone_number,
        fax_number: req.body.fax_number,
        email: req.body.email,
        latitude: req.body.lattiude,
        longitude: req.body.longitude,
        contact_person_name: req.body.contact_person_name,
        designation_id: req.body.contact_person_designation,
        is_active: 1,
      };
      console.log('req.body.contact_person_designation', req.body.contact_person_designation)

      const existingData = await seedLabTestModel.findAll({
        where: {
          [Op.or]: [
            sequelize.where(
              sequelize.fn('lower', sequelize.col('short_name')),
              sequelize.fn('lower', req.body.short_name),
            ),

          ]
        }
      });
      const LabData = await seedLabTestModel.findAll({
        where: {
          [Op.or]: [
            sequelize.where(
              sequelize.fn('lower', sequelize.col('lab_name')),
              sequelize.fn('lower', req.body.lab_name),
            )
          ]
        }
      })
      if (LabData.length != 0) {
        returnResponse = {
          error: 'Laboratory name is Already registered'
        }

        return response(res, status.DATA_NOT_SAVE, 402, returnResponse)
      }
      let existingEmaiData = await seedLabTestModel.findAll({
        // where: sequelize.where(
        //   sequelize.fn('lower', sequelize.col('short_name')),
        //   sequelize.fn('lower', req.body.display_name),
        // )
        where: {
          [Op.and]: [
            {
              where: sequelize.where(
                sequelize.fn('lower', sequelize.col('email')),
                sequelize.fn('lower', req.body.email),
              ),

            },


          ]
        },
      });

      if (existingEmaiData.length != 0) {
        returnResponse = {
          error: 'Email is Already registered'
        }

        return response(res, status.DATA_NOT_SAVE, 403, returnResponse)
      }


      if (existingData === undefined || existingData.length < 1) {
        const maxLotSizeData = seedLabTestModel.create(data);
        returnResponse = maxLotSizeData;
        tabledAlteredSuccessfully = true;
      }
      if (tabledAlteredSuccessfully) {
        return response(res, status.DATA_SAVE, 200, returnResponse, internalCall)
      } else {
        return response(res, status.DATA_NOT_SAVE, 401, returnResponse, internalCall)
      }

    } catch (error) {
      console.log('error =====', error);
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }

  static updateLabTestData = async (req, res) => {
    let returnResponse = {};
    let internalCall = {};
    try {
      let rules = {
        // 'crop': 'string',
        // 'max_lot_size': 'string'
      };

      let validation = new Validator(req.body, rules);

      const isValidData = validation.passes();

      if (!isValidData) {
        let errorResponse = {};
        for (let key in rules) {
          const error = validation.errors.get(key);
          if (error.length) {
            errorResponse[key] = error;
          }
        }
        return response(res, status.BAD_REQUEST, 400, errorResponse, internalCall)
      }

      let data = {
        updated_by: req.body.user_id,
        lab_name: req.body.lab_name,
        address: req.body.address,
        state_id: req.body.state_id,
        district_id: req.body.district_id,
        short_name: req.body.short_name,
        mobile_number: req.body.mobile_number,
        phone_number: req.body.phone_number,
        fax_number: req.body.fax_number,
        email: req.body.email,
        latitude: req.body.lattiude,
        longitude: req.body.longitude,
        designation_id: req.body.contact_person_designation,
        contact_person_name: req.body.contact_person_name,
        is_active: req.body.active
      };
      console.log('data', data.address)
      let existingEmaiData = await seedLabTestModel.findAll({
        // where: sequelize.where(
        //   sequelize.fn('lower', sequelize.col('short_name')),
        //   sequelize.fn('lower', req.body.display_name),
        // )
        where: {
          [Op.and]: [
            {
              where: sequelize.where(
                sequelize.fn('lower', sequelize.col('email')),
                sequelize.fn('lower', req.body.email),
              ),
              id: { [Op.ne]: req.body.id }

            },


          ]
        },
      });
      if (existingEmaiData.length != 0) {
        const returnResponse = {
          error: 'Email is Already exist'
        }

        return response(res, status.DATA_NOT_SAVE, 403, returnResponse)
      }

      const LabData = await seedLabTestModel.findAll({
        where: {
          [Op.and]: [
            {
              where: sequelize.where(
                sequelize.fn('lower', sequelize.col('lab_name')),
                sequelize.fn('lower', req.body.lab_name),
              ),
              id: { [Op.ne]: req.body.id }
            }
          ]

        }
      })
      if (LabData.length != 0) {
        returnResponse = {
          error: 'Laboratory name is Already registered'
        }

        return response(res, status.DATA_NOT_SAVE, 401, returnResponse)
      }
      const existingData = await seedLabTestModel.findAll({
        where: {
          [Op.and]: [
            {
              where: sequelize.where(
                sequelize.fn('lower', sequelize.col('short_name')),
                sequelize.fn('lower', req.body.short_name),
              ),
              id: { [Op.ne]: req.body.id }
            }
          ]
        }

      });
      if (existingData.length != 0) {
        returnResponse = {
          error: 'Short name is Already registered'
        }

        return response(res, status.DATA_NOT_SAVE, 402, returnResponse)
      }

      const maxLotSizeData = seedLabTestModel.update(data, { where: { id: req.body.id } });
      returnResponse = {};
      return response(res, status.DATA_UPDATED, 200, returnResponse, internalCall)

    } catch (error) {
      console.log('er', error)
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }

  static getLabTestDataforSeedTesting = async (req, res) => {
    try {
      const condition = {
        attributes: ['lab_name', 'id'],
        raw: true,
        where: {
          state_id: req.body.loginedUserid.state_id
        }
      }
      console.log(req.body.loginedUserid.state_id, 'req.body.loginedUserid')

      condition.order = [['lab_name', 'ASC']];

      const data = await seedLabTestModel.findAndCountAll(condition);
      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, data);
      }
      if (!data) {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    } catch (error) {
      console.log(error.message)
      return response(res, status.UNEXPECTED_ERROR, 500, error.message);
    }
  }

  static getLabTestDataold = async (req, res) => {
    let returnResponse = {};
    try {
      let rules = {
        'id': 'integer',
        'state_id': 'string',
        'district_id': 'string',
        'lab_name': 'string'
      };

      // const stvvv = await stlLab(req.body.stateCode);

      let validation = new Validator(req.body, rules);

      const isValidData = validation.passes();

      if (!isValidData) {
        let errorResponse = {};
        for (let key in rules) {
          const error = validation.errors.get(key);
          if (error.length) {
            errorResponse[key] = error;
          }
        }
        return response(res, status.BAD_REQUEST, 400, errorResponse, internalCall)
      }

      //check & get state id 
      let userId = req.body.loginedUserid.id;
      const condition1 = {
        attributes: ['state_id'],
        where: {
          user_id: userId
        },
        raw: true
      }
      const stateData = await agencyDetailModel.findAll(condition1);
      let condition = {
        include: [
          {
            model: stateModel,
            left: false,
            raw: false

          },
          {
            model: districtModel,
            left: false,
            raw: false

          },
          {
            model: designationModel,
            left: false,
            raw: false

          },

        ],
        where: {
          // is_active:1
        }
      };
      // const userId = req.body.loginedUserid.id
      // console.log('audhdata===========', userId);
      // if (userId) {
      //   condition.where.user_id = userId
      // }

      if (req.body.search) {
        if (req.body.search.type == 'bsp-lab-report') {
          if (stateData && stateData[0]) {
            if (stateData[0].state_id) {
              condition.where.state_id = stateData[0].state_id;
            }
          }
        }
        if (req.body.search.id) {
          condition.where.id = req.body.search.id;
        }
        if (req.body.search.state_id) {
          condition.where.state_id = (req.body.search.state_id);
        }
        if (req.body.search.district_id) {
          condition.where.district_id = (req.body.search.district_id);
        }
        if (req.body.search.lab_name) {
          condition.where.lab_name = req.body.search.lab_name;
        }
        // if (req.body.search.state) {
        //   condition.where.state_id = req.body.search.state_id;
        // }
      }
      let { page, pageSize } = req.body;
      if (page === undefined) page = 1;
      if (pageSize === undefined) {
        // pageSize = 10;
      } // set pageSize to -1 to prevent sizing

      if (page > 0 && pageSize > 0) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }
      condition.order = [['lab_name', 'ASC'], ['short_name', 'ASC'], [sequelize.col('m_district.district_name'), 'ASC'], [sequelize.col('m_state.state_name'), 'ASC']];
      const data = await seedLabTestModel.findAndCountAll(condition);
      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, data);
      }
      if (!data) {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    } catch (error) {
      console.log(error)
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }

  static getLabTestData = async (req, res) => {
    let returnResponse = {};
    try {
      let rules = {
        'id': 'integer',
        'state_id': 'string',
      };

      console.log(req.body.search.state_code, "***************");



      let validation = new Validator(req.body, rules);

      const isValidData = validation.passes();

      if (!isValidData) {
        let errorResponse = {};
        for (let key in rules) {
          const error = validation.errors.get(key);
          if (error.length) {
            errorResponse[key] = error;
          }
        }
        return response(res, status.BAD_REQUEST, 400, errorResponse, internalCall)
      }
      else {
        // console.log("jfhhuj");
        const stlnewLab = await stl_lab(req.body.search.state_code);
        const data = stlnewLab.data.map(item => ({
          ...item,
          // idtype: typeof item.labId,
          lab_name: item.labName || 'NA',
          lab_code: item.labCode || 'NA'
        }));

        console.log("Modified Data:", data);
        if (data) {
          return response(res, status.DATA_AVAILABLE, 200, { count: data.length, rows: data });

          // return response(res, status.DATA_AVAILABLE, 200, data);
        }
        if (!data) {
          return response(res, status.DATA_NOT_AVAILABLE, 404)
        }
      }
    } catch (error) {
      console.log(error)
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }

  static getLabTestNameData = async (req, res) => {
    let returnResponse = {};
    try {
      let rules = {

        'state_id': 'string',
        'district_id': 'string',

      };

      let validation = new Validator(req.body, rules);

      const isValidData = validation.passes();

      if (!isValidData) {
        let errorResponse = {};
        for (let key in rules) {
          const error = validation.errors.get(key);
          if (error.length) {
            errorResponse[key] = error;
          }
        }
        return response(res, status.BAD_REQUEST, 400, errorResponse, internalCall)
      }

      let condition = {
        attributes: ['lab_name'],
        where: {}
      };
      if (req.body.search) {
        if (req.body.search.id) {
          condition.where.id = req.body.search.id;
        }
        if (req.body.search.state_id) {
          condition.where.state_id = (req.body.search.state_id);
        }
        if (req.body.search.district_id) {
          condition.where.district_id = (req.body.search.district_id);
        }

      }
      let { page, pageSize } = req.body;
      if (page === undefined) page = 1;
      if (pageSize === undefined) {
        // pageSize = 10;
      } // set pageSize to -1 to prevent sizing

      if (page > 0 && pageSize > 0) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }
      condition.order = [['lab_name', 'ASC']];
      const data = await seedLabTestModel.findAndCountAll(condition);
      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, data);
      }
      if (!data) {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    } catch (error) {
      console.log(error)
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }
  static deleteLabTestData = async (req, res) => {
    try {
      console.log('delete', req.params.id);
      seedLabTestModel.destroy({
        where: {
          id: req.params.id
        }
      });
      response(res, status.DATA_DELETED, 200, {});
    }
    catch (error) {
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    }
  }
  //update status on delete data
  static updateStatusLabTestData = async (req, res) => {
    try {
      console.log('delete', req.params.id);
      let data = {
        is_active: 0,
        updated_by: req.body.user_id
      }
      seedLabTestModel.update(data, {
        where: {
          id: req.body.id
        },
      });
      response(res, status.DATA_DELETED, 200, {});
    }
    catch (error) {
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    }
  }

  static addCropCharacteristics = async (req, res) => {
    let tabledAlteredSuccessfully = false;
    try {
      let condition = {
        where: {}
      };
      const user_id = req.body.loginedUserid.id
      let fertilizerOtherData;
      req.body.notification_date
      const dataRow = {
        crop_group_id: req.body.crop_group_id,
        // crop_code: req.body.crop_code,
        variety_id: req.body.variety_id,
        image_url: req.body.data,
        variety_code: req.body.variety_code,
        notification_date: req.body.notification_date,
        notification_year: req.body.notification_year,
        meeting_number: req.body.meeting_number,
        variety_name: req.body.variety_name,
        iet_number: req.body.iet_number,
        year_of_introduction_market: req.body.year_of_introduction_market,
        notification_number: req.body.notification_number,
        resemblance_to_variety: req.body.resemblance_to_variety,
        percentage: req.body.percentage,
        select_state_release: req.body.select_state_release,
        state_of_release: req.body.recommended_state ? req.body.recommended_state : null,
        matuarity_day_from: req.body.maturity_from,
        matuarity_day_to: req.body.maturity_to,
        maturity_date: req.body.maturity_date,
        spacing_from: req.body.spacing_from,
        climate_resilience_json: req.body.climate_resilience,
        matuarity_type_id: req.body.matuarity_type_id,
        spacing_to: req.body.spacing_to,
        spacing_date: req.body.spacing_date,
        generic_morphological: req.body.generic_morphological,
        specific_morphological: req.body.specific_morphological_characteristics,
        seed_rate: req.body.seed_rate,
        average_yeild_from: req.body.average_yeild_from,
        average_yeild_to: req.body.average_yeild_to,
        average_total: req.body.average_total,
        fertilizer_dosage: req.body.fertilizer_dosage,
        agronomic_features: req.body.agronomic_features,
        adoptation: req.body.recommended_ecology,
        responsible_insitution_for_breeder_seed: req.body.responsible_insitution_for_breeder_seed,
        reaction_abiotic_stress: req.body.abiotic_stress,
        // reaction_major_diseases: req.body.major_diseases,
        // reaction_to_pets: req.body.major_pest,
        reaction_to_pets_json: req.body.major_pest,
        reaction_major_diseases_json: req.body.major_diseases,
        crop_code: req.body.crop_code,
        year_of_release: req.body.year_release,
        user_id: user_id,
        crop_name: req.body.crop_name,
        crop_group: req.body.crop_group,
        nitrogen: req.body.nitrogen,
        phosphorus: req.body.phosphorus,
        potash: req.body.potash,
        other: req.body.other,
        state_data: req.body.state,
        region_data: req.body.region_data,
        // climate_resilience: req.body.climate_resilience,
        product_quality_attributes: req.body.product_quality_attributes,
        gi_tagged_reg_no: req.body.gi_tagged_reg_no,
        ip_protected_reg_no: req.body.ip_protected_reg_no,
      };


      // if (req.body.search) {
      //   // if (req.body.search.crop_group_id) {
      //   //   condition.where.crop_group_id = req.body.search.crop_group_id;
      //   // }
      //   if (req.body.search.variety_id) {
      //     condition.where.variety_id = req.body.search.variety_id;
      //   }
      //   // if (req.body.search.crop_code) {
      //   //   condition.where.crop_code = req.body.search.crop_code;
      //   // }
      // }
      const cropNameexisitingData = await cropCharactersticsModel.findAll({
        where: {
          [Op.or]: [{ variety_id: req.body.variety_id }],
          // is_active: 1
        }
      });




      if ((cropNameexisitingData && cropNameexisitingData.length)) {
        const errorResponse = {
          subscriber_id: 'Variety Name  is already exits.'
        }
        return response(res, status.USER_EXISTS, 409, errorResponse)
      }

      // const existingData = await cropCharactersticsModel.findAll(condition);
      // === undefined || existingData.length < 1
      if (cropNameexisitingData && !cropNameexisitingData.length) {
        const data = await cropCharactersticsModel.create(dataRow);
        let diseasesData;
        let pestsData;
        let climateResilence;
        let regionMapping;
        if (data) {

          if (req.body.climate_resilience && req.body.climate_resilience.length) {
            for (let key of req.body.climate_resilience) {
              climateResilence = await db.mMajorClimateResiliencemapsModel.create({
                m_variety_characterstic_id: data.dataValues.id,
                climate_resilience_id: key.id
              })
            }
          }
          if (req.body.regions && req.body.regions.length) {
            for (let key of req.body.regions) {
              if (key.regions_checkbox && key.regions_checkbox == true) {
                regionMapping = await db.mCharactersticAgroRegionMappingModel.create({
                  variety_code: req.body.variety_code,
                  variety_id: req.body.variety_id,
                  region_id: key.regions_id,
                  is_checked: key.regions_checkbox ? key.regions_checkbox : false
                })
              }
            }
          }
          if (req.body.major_pest && req.body.major_pest.length) {
            for (let key of req.body.major_pest) {
              pestsData = await db.mMajorInsectPestsMapModel.create({
                m_variety_characterstic_id: data.dataValues.id,
                insect_pests_id: key.id
              })
            }
          }
          if (req.body.major_pest && req.body.major_diseases.length) {
            for (let key of req.body.major_diseases) {
              diseasesData = await db.mMajorDiseasesMapModel.create({
                m_variety_characterstic_id: data.dataValues.id,
                diseases_id: key.id
              })
            }
          }
        }
        await data.save();
        tabledAlteredSuccessfully = true;
        if (req.body !== undefined
          && req.body.fertilizerother !== undefined
          && req.body.fertilizerother.length > 0) {

          for (let index = 0; index < req.body.fertilizerother.length; index++) {

            const element = req.body.fertilizerother[index];
            let otherFertilizer = {
              other_fertilizer_name: element.fertilizer_other_name,
              other_fertilizer_value: element.fertilizer_other_value,
              characterstics_id: data.id
            }
            fertilizerOtherData = await otherFertilizerModel.create(otherFertilizer)
            await fertilizerOtherData.save()
            let mappingOtherFertilizerData = {
              other_fertilizer_id: fertilizerOtherData.id,
              characterstics_id: data.id
            }
            let otherMappingData = await otherFertilizerMapping.create(mappingOtherFertilizerData)
            await otherMappingData.save()

            tabledAlteredSuccessfully = true;

            // console.log('otherFertilizer',otherFertilizer)
          }
        }
      }
      if (tabledAlteredSuccessfully) {
        return response(res, status.DATA_SAVE, 200, {})
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }

      // console.log('data====>', data.state_data);

      // const insertData = await data.save();
      // console.log(data);

      // if (insertData) {
      //   return response(res, status.DATA_SAVE, 200, {})
      // } else {
      //   return response(res, status.DATA_NOT_AVAILABLE, 404)
      // }
    }
    catch (error) {
      console.log(error, 'dataRow');
      return response(res, status.DATA_NOT_SAVE, 500)
    }
  }

  static updateAddBreederCharacterstics = async (req, res) => {
    let tabledAlteredSuccessfully = false;
    try {
      const id = req.body.id;
      let condition = {
        where: {
          id: {
            [Op.ne]: id
          }
        }
      };
      let dataRow;
      dataRow = {
        crop_group_id: req.body.crop_group_id,
        variety_code: req.body.variety_code,

        variety_id: req.body.varierty_id,
        image_url: req.body.image_url,
        variety_code: req.body.variety_code,
        // notification_date: req.body.notification_date,
        // notification_year:req.body.notification_year,
        // meeting_number: req.body.meeting_number,
        iet_number: req.body.iet_number,
        year_of_introduction_market: req.body.year_of_introduction_market,
        notification_number: req.body.notification_number,
        resemblance_to_variety: req.body.resemblance_to_variety,
        percentage: req.body.percentage,
        select_state_release: req.body.select_state_release,
        // state_of_release: req.body.recommended_state,
        matuarity_day_from: req.body.maturity_from,
        matuarity_day_to: req.body.maturity_to,
        maturity_date: req.body.maturity_date,
        spacing_from: req.body.spacing_from,
        matuarity_type_id: req.body.matuarity_type_id,
        spacing_to: req.body.spacing_to,
        spacing_date: req.body.spacing_date,
        generic_morphological: req.body.generic_morphologimajor_pestcal,
        specific_morphological: req.body.specific_morphological_characteristics,
        seed_rate: req.body.seed_rate,
        average_yeild_from: req.body.average_yeild_from,
        average_yeild_to: req.body.average_yeild_to,
        average_total: req.body.average_total,
        fertilizer_dosage: req.body.fertilizer_dosage,
        agronomic_features: req.body.agronomic_features,
        adoptation: req.body.recommended_ecology,
        responsible_insitution_for_breeder_seed: req.body.responsible_insitution_for_breeder_seed,
        reaction_abiotic_stress: req.body.abiotic_stress,
        climate_resilience_json: req.body.climate_resilience,
        // reaction_major_diseases: req.body.major_diseases,
        // reaction_to_pets: req.body.major_pest,
        reaction_to_pets_json: req.body.major_pest,
        reaction_major_diseases_json: req.body.major_diseases,
        crop_code: req.body.crop_code,
        year_of_release: req.body.year_release,
        user_id: 1,
        crop_name: req.body.crop_name,
        crop_group: req.body.crop_group,
        nitrogen: req.body.nitrogen,
        phosphorus: req.body.phosphorus,
        potash: req.body.potash,
        other: req.body.other,
        // fertilizer_other_name: req.body.fertilizer_other_name,
        // fertilizer_other_value: req.body.fertilizer_other_value,
        state_data: req.body.state,
        variety_name: req.body.variety_name,
        is_active: req.body.active,
        region_data: req.body.region_data,
        // climate_resilience: ,
        climate_resilience_json: req.body.climate_resilience,
        product_quality_attributes: req.body.product_quality_attributes,
        gi_tagged_reg_no: req.body.gi_tagged_reg_no,
        ip_protected_reg_no: req.body.ip_protected_reg_no,
      }
      // db.mMajorInsectPestsMapModel
      // db.mMajorDiseasesMapModel 
      if (req.body !== undefined
        && req.body.fertilizerother !== undefined
        && req.body.fertilizerother.length > 0) {
        otherFertilizerModel.destroy({
          where: {
            characterstics_id: req.body.id
          }
        })
        for (let index = 0; index < req.body.fertilizerother.length; index++) {

          const element = req.body.fertilizerother[index];
          let otherFertilizer = {
            other_fertilizer_name: element.fertilizer_other_name,
            other_fertilizer_value: element.fertilizer_other_value,
            characterstics_id: req.body.id
          }
          let fertilizerOtherData = await otherFertilizerModel.create(otherFertilizer)
          let diseasesData;
          let pestsData;
          if (fertilizerOtherData) {
            if (req.body.major_pest && req.body.major_pest.length) {
              for (let key of req.body.major_pest) {
                pestsData = await db.mMajorInsectPestsMapModel.create({
                  m_variety_characterstic_id: fertilizerOtherData.dataValues.id,
                  insect_pests_id: key.id
                })
              }
            }
            if (req.body.major_pest && req.body.major_diseases.length) {
              for (let key of req.body.major_diseases) {
                diseasesData = await db.mMajorDiseasesMapModel.create({
                  m_variety_characterstic_id: fertilizerOtherData.dataValues.id,
                  diseases_id: key.id
                })
              }
            }
          }
          await fertilizerOtherData.save()
          // let mappingOtherFertilizerData={
          //   other_fertilizer_id:fertilizerOtherData.id,
          //   characterstics_id:data.id
          // }
          // let otherMappingData = await otherFertilizerMapping.create(mappingOtherFertilizerData)
          // await otherMappingData.save()

          tabledAlteredSuccessfully = true;

          // console.log('otherFertilizer',otherFertilizer)
        }
      }
      // console.log('dataRow', dataRow)

      // const existingData = await cropCharactersticsModel.findAll({
      //   where: {
      //     [Op.and]: [
      //       {
      //         where: sequelize.where(
      //           sequelize.fn('lower', sequelize.col('variety_id')),
      //           sequelize.fn('lower', (req.body.varierty_id)),
      //         ),
      //         id: { [Op.ne]: id }
      //       },


      //     ]
      //   },
      // }

      // );

      // if (existingData.length != 0) {

      //   const returnResponse = {
      //     error: 'Varitey Name is Already exist'
      //   }

      //   return response(res, status.DATA_NOT_SAVE, 401, returnResponse)
      // }



      let isExist = await cropCharactersticsModel.findOne({ where: { variety_code: req.body.variety_code } });
      let data;
      if (isExist) {
        data = await cropCharactersticsModel.update(dataRow, {
          where: {
            id: isExist.id
          }
        });
        if (isExist) {
          // if(fertilizerOtherData){
          let isExitDelete = await db.mMajorInsectPestsMapModel.destroy({
            where: {
              m_variety_characterstic_id: isExist.id
            }
          });
          let isExitDelete1 = await db.mMajorDiseasesMapModel.destroy({
            where: {
              m_variety_characterstic_id: isExist.id
            }
          })
          let isExitDelete3 = await db.mMajorClimateResiliencemapsModel.destroy({
            where: {
              m_variety_characterstic_id: isExist.id
            }
          })
          let isExitDelete4 = await db.mCharactersticAgroRegionMappingModel.destroy({
            where: {
              variety_id: req.body.varierty_id,
              variety_code: req.body.variety_code
            }
          })
          let pestsData;
          let pestsData1;
          let climateResilence;
          let regionMapping;
          if (isExitDelete || isExitDelete1) {
            if (req.body.major_pest && req.body.major_pest.length) {
              for (let key of req.body.major_pest) {
                pestsData = await db.mMajorInsectPestsMapModel.create({
                  m_variety_characterstic_id: isExist.id,
                  insect_pests_id: key.id
                })
              }
            }
            if (req.body.major_pest && req.body.major_diseases.length) {
              for (let key of req.body.major_diseases) {
                pestsData1 = await db.mMajorDiseasesMapModel.create({
                  m_variety_characterstic_id: isExist.id,
                  diseases_id: key.id
                })
              }
            }
          }
          if (isExitDelete3) {
            if (req.body.climate_resilience && req.body.climate_resilience.length) {
              for (let key of req.body.climate_resilience) {
                climateResilence = await db.mMajorClimateResiliencemapsModel.create({
                  m_variety_characterstic_id: isExist.id,
                  climate_resilience_id: key.id
                })
              }
            }
          }
          // if(isExitDelete4){
          if (req.body.regions && req.body.regions.length) {
            for (let key of req.body.regions) {
              if (key.regions_checkbox && key.regions_checkbox == true) {
                regionMapping = await db.mCharactersticAgroRegionMappingModel.create({
                  variety_code: req.body.variety_code,
                  variety_id: req.body.varierty_id,
                  region_id: key.regions_id,
                  is_checked: key.regions_checkbox ? key.regions_checkbox : false
                })
              }
            }
          }
          // }

          // }
        }
      } else {
        data = await cropCharactersticsModel.create(dataRow);
        if (data) {
          // if(fertilizerOtherData){
          // let isExitDelete = await db.mMajorInsectPestsMapModel.destroy({where:{
          //   m_variety_characterstic_id:data.dataValues.id
          // }});
          // let isExitDelete1 = await db.mMajorDiseasesMapModel.destroy({where:{
          //   m_variety_characterstic_id:data.dataValues.id
          // }})
          // let isExitDelete3 = await db.mMajorClimateResiliencemapsModel.destroy({where:{
          //   m_variety_characterstic_id:data.dataValues.id
          // }})
          // let isExitDelete4 = await db.mCharactersticAgroRegionMappingModel.destroy({where:{
          //   variety_id:req.body.varierty_id,
          //   variety_code:req.body.variety_code
          // }})
          let pestsData;
          let pestsData1;
          let climateResilence;
          let regionMapping;
          // if(isExitDelete || isExitDelete1){
          if (req.body.major_pest && req.body.major_pest.length) {
            for (let key of req.body.major_pest) {
              pestsData = await db.mMajorInsectPestsMapModel.create({
                m_variety_characterstic_id: data.dataValues.id,
                insect_pests_id: key.id
              })
            }
          }
          if (req.body.major_pest && req.body.major_diseases.length) {
            for (let key of req.body.major_diseases) {
              pestsData1 = await db.mMajorDiseasesMapModel.create({
                m_variety_characterstic_id: data.dataValues.id,
                diseases_id: key.id
              })
            }
          }
          // }
          // if(isExitDelete3){
          if (req.body.climate_resilience && req.body.climate_resilience.length) {
            for (let key of req.body.climate_resilience) {
              climateResilence = await db.mMajorClimateResiliencemapsModel.create({
                m_variety_characterstic_id: data.dataValues.id,
                climate_resilience_id: key.id
              })
            }
          }
          // }
          // if(isExitDelete4){
          if (req.body.regions && req.body.regions.length) {
            for (let key of req.body.regions) {
              if (key.regions_checkbox && key.regions_checkbox == true) {
                regionMapping = await db.mCharactersticAgroRegionMappingModel.create({
                  variety_code: req.body.variety_code,
                  variety_id: req.body.varierty_id,
                  region_id: key.regions_id,
                  is_checked: key.regions_checkbox ? key.regions_checkbox : false
                })
              }
            }
          }
          // }

          // }
        }
      }


      tabledAlteredSuccessfully = true;

      if (tabledAlteredSuccessfully) {
        return response(res, status.DATA_SAVE, 200, {})
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }


      // if (data) {
      //   response(res, status.DATA_UPDATED, 200, data)
      // }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_SAVE, 500, error)
    }
  }

  static deleteCropCharactersticsDetails = async (req, res) => {
    try {
      cropCharactersticsModel.destroy({
        where: {
          id: req.params.id
        }
      });
      response(res, status.DATA_DELETED, 200, {});
    }
    catch (error) {
      return response(res, status.UNEXPECTED_ERROR, 500)
    }
  }

  static addCropCharacteristicsList = async (req, res) => {
    try {
      let data = {};
      let { page, pageSize, search } = req.body;
      let condition = {}
      function transformFlatArrayToNestedArray(inputArray) {
        return inputArray.map(input => ({
          id: input.id,
          developed_by: input.developed_by,
          crop_code: input.crop_code,
          introduce_year: input.introduce_year,
          crop_group_code: input.crop_group_code,
          is_notified: input.is_notified,
          meeting_number: input.meeting_number,
          not_date: input.not_date,
          not_number: input.not_number,
          release_date: input.release_date,
          type: input.type,
          user_id: input.user_id || null,
          variety_code: input.variety_code,
          variety_name: input.variety_name,
          is_active: input.is_active,
          is_status_active: input.is_status_active,
          status: input.status,
          created_at: input.created_at,
          updated_at: input.updated_at,
          m_crop: input["m_crop.id"] ? {
            id: input["m_crop.id"],
            botanic_name: input["m_crop.botanic_name"],
            crop_code: input["m_crop.crop_code"],
            crop_group: input["m_crop.crop_group"],
            crop_name: input["m_crop.crop_name"],
            group_code: input["m_crop.group_code"],
            season: input["m_crop.season"],
            srr: input["m_crop.srr"],
            is_active: input["m_crop.is_active"],
            breeder_id: input["m_crop.breeder_id"],
            hindi_name: input["m_crop.hindi_name"],
            scientific_name: input["m_crop.scientific_name"],
            created_at: input["m_crop.created_at"],
            updated_at: input["m_crop.updated_at"],
            m_crop_group: input["m_crop.m_crop_group.id"] ? {
              id: input["m_crop.m_crop_group.id"],
              group_name: input["m_crop.m_crop_group.group_name"],
              group_code: input["m_crop.m_crop_group.group_code"],
              is_active: input["m_crop.m_crop_group.is_active"]
            } : null
          } : null,
          m_variety_characteristic: input["m_variety_characteristic.id"] ? {
            id: input["m_variety_characteristic.id"],
            variety_name: input["m_variety_characteristic.variety_name"],
            crop_code: input["m_variety_characteristic.crop_code"],
            variety_code: input["m_variety_characteristic.variety_code"],
            crop_group: input["m_variety_characteristic.crop_group"],
            year_of_release: input["m_variety_characteristic.year_of_release"],
            year_of_introduction_market: input["m_variety_characteristic.year_of_introduction_market"],
            agronomic_features: input["m_variety_characteristic.agronomic_features"],
            adoptation: input["m_variety_characteristic.adoptation"],
            average_yeild_from: input["m_variety_characteristic.average_yeild_from"],
            average_yeild_to: input["m_variety_characteristic.average_yeild_to"],
            spacing_from: input["m_variety_characteristic.spacing_from"],
            spacing_to: input["m_variety_characteristic.spacing_to"],
            seed_rate: input["m_variety_characteristic.seed_rate"],
            recommended_state: input["m_variety_characteristic.recommended_state"],
            resemblance_to_variety: input["m_variety_characteristic.resemblance_to_variety"],
            reaction_major_diseases: input["m_variety_characteristic.reaction_major_diseases"],
            reaction_to_pets: input["m_variety_characteristic.reaction_to_pets"],
            reaction_abiotic_stress: input["m_variety_characteristic.reaction_abiotic_stress"],
            product_quality_attributes: input["m_variety_characteristic.product_quality_attributes"],
            climate_resilience: input["m_variety_characteristic.climate_resilience"],
            created_at: input["m_variety_characteristic.created_at"],
            updated_at: input["m_variety_characteristic.updated_at"]
          } : null
        }));
      }

      condition = {
        include: [
          {
            model: cropModel,
            required: false, // LEFT OUTER JOIN
            attributes: [
              'id', 'crop_name', 'crop_code', 'botanic_name',
              'group_code', 'crop_group', 'srr', 'season',
              'is_active', 'breeder_id', 'hindi_name', 'scientific_name',
              'created_at', 'updated_at'
            ],
            include: [
              {
                model: cropGroupModel,
                required: false, // LEFT OUTER JOIN
                attributes: ['id', 'group_name', 'group_code', 'is_active']
              }
            ]
          },
          {
            model: cropCharactersticsModel,
            required: false, // LEFT OUTER JOIN
            attributes: [
              'id', 'variety_name', 'crop_code', 'variety_code', 'crop_group',
              'year_of_release', 'year_of_introduction_market',
              'agronomic_features', 'adoptation', 'average_yeild_from', 'average_yeild_to',
              'spacing_from', 'spacing_to', 'seed_rate', 'recommended_state',
              'resemblance_to_variety', 'reaction_major_diseases', 'reaction_to_pets',
              'reaction_abiotic_stress', 'product_quality_attributes', 'climate_resilience',
              'created_at', 'updated_at'
            ]
          }
        ],
        attributes: [
          'id', 'variety_name', 'variety_code', 'status', 'developed_by',
          'introduce_year', 'crop_code', 'crop_group_code',
          'is_notified', 'not_date', 'not_number', 'meeting_number',
          'release_date', 'type', 'is_active', 'is_status_active',
          'created_at', 'updated_at'
        ],
        where: {
          [Op.or]: [
            { status: 'hybrid' },
            { status: 'variety' },
            { status: null },
          ],
        },
        order: [
          [cropModel, cropGroupModel, 'group_name', 'ASC'],
          [cropModel, 'crop_name', 'ASC'],
          ['variety_name', 'ASC']
        ],
        raw: true
      }
      if (req.body.page) {
        if (page === undefined) page = 1;
        if (pageSize === undefined) {
          pageSize = 10;
        }
        if (page > 0 && pageSize > 0) {
          condition.limit = pageSize;
          condition.offset = (page * pageSize) - pageSize;
        }
      }

      condition.order = [[sequelize.col('m_crop->m_crop_group.group_name'), 'ASC'], [sequelize.col('m_crop.crop_name'), 'ASC'], ['variety_name', 'ASC']];
      if (search) {
        condition.where = {};
        if (req.body.search.crop_group) {
          condition.include[0].where = {};
          condition.include[0].where.group_code = (req.body.search.crop_group);
        }
        if (req.body.search.crop_name) {
          condition.where.crop_code = (req.body.search.crop_name);
        }
        if (req.body.search.is_notified) {
          if (req.body.search.is_notified == "notified") {
            console.log('req.body.search.is_notified', req.body.search.is_notified);
            condition.where.not_date = {
              [Op.or]: [
                { [Op.not]: null },
                { [Op.not]: '' },
              ]
            };
          }
          if (req.body.search.is_notified == "non_notified") {
            console.log('req.body.search.is_notified', req.body.search.is_notified);
            condition.where.not_date = {
              [Op.or]: [
                { [Op.eq]: null },
                { [Op.eq]: '' },
              ]
            };
          }
        }
        if (req.body.search.variety_name) {
          condition.where.variety_code = (req.body.search.variety_name);
        }
        if (req.body.search.notification_date) {
          condition.where.notification_year = (parseInt(req.body.search.notification_date));
        }
        if (req.body.search.variety_name_filter) {
          condition.where.variety_name = {
            [Op.or]: [
              { [Op.iLike]: "%" + req.body.search.variety_name_filter.toLowerCase().trim() + "%" },
            ]
          };
        }
        if (req.body.search.notification_no) {
          condition.where.not_number = {
            [Op.or]: [
              { [Op.iLike]: "%" + req.body.search.notification_no.toLowerCase().trim() + "%" },
            ]
          };
        }
      }

      condition.where.status = { [Op.notIn]: ['other'] }
      condition.where.status = {
        [Op.or]: [
          {
            [Op.in]: ['hybrid', 'variety']
          },
          {
            [Op.eq]: null
          },
        ]
      };
      if (req.body.search.user_type == 'ICAR') {
        condition.where.crop_code = { [Op.like]: 'A%' };
      }
      if (req.body.search.user_type == 'HICAR') {
        condition.where.crop_code = { [Op.like]: 'H%' };
      }
      if (req.body.search.user_type == 'OILSEEDADMIN') {
        console.log("----------OILSEEDADMIN--------")
        console.log("----------OILSEEDADMIN--------")
        console.log("----------OILSEEDADMIN--------")
        console.log("----------OILSEEDADMIN--------")

        condition.where.crop_code = { [Op.like]: 'A04%' };
      }
      if (req.body.search.user_type == 'PULSESSEEDADMIN') {
        console.log("----------PULSESSEEDADMIN--------")
        console.log("----------PULSESSEEDADMIN--------")
        console.log("----------PULSESSEEDADMIN--------")
        console.log("----------PULSESSEEDADMIN--------")
        condition.where.crop_code = { [Op.like]: 'A03%' };
      }

      data = await cropVerietyModel.findAndCountAll(condition);
      const nestedArray = transformFlatArrayToNestedArray(data.rows);
      response(res, status.DATA_AVAILABLE, 200, { count: data.count, rows: nestedArray })
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static addCropCharacteristicsListWithDynamicFieldOLd = async (req, res) => {
    let data = {};
    try {
      // let userId = req.body.loginedUserid.id
      // console.log('userId', userId);
      let attributesData = [];
      let temp = [];
      if (req.body.search) {
        if (req.body.search.fieldData !== undefined && req.body.search.fieldData.length >= 1) {
          req.body.search.fieldData.forEach(async (items) => {

            if (items && items.value == "crop_group") {
              temp = [sequelize.col('m_crop->m_crop_group.group_name'), 'group_name'];
            }
            else if (items && items.value == "variety_name") {
              temp = [sequelize.col('m_crop_variety.variety_name'), 'variety_name'];
            }
            else if (items && items.value == "crop_name") {
              temp = [sequelize.col('m_crop.crop_name'), 'crop_name'];
            }
            else if (items && items.value == "variety_code") {
              temp = [sequelize.col('m_crop_variety.variety_code'), 'variety_code']
            }
            else if (items && items.value == "developed_by") {
              temp = [sequelize.col('m_variety_characteristics.developed_by'), 'developed_by']
            }
            else if (items && items.value == "matuarity_day_from") {
              temp = [sequelize.col('m_variety_characteristics.matuarity_day_from'), 'matuarity_day_from']
            }
            else if (items && items.value == "matuarity_day_to") {
              temp = [sequelize.col('m_variety_characteristics.matuarity_day_to'), 'matuarity_day_to']
            }
            else if (items && items.value == "spacing_from") {
              temp = [sequelize.col('m_variety_characteristics.spacing_from'), 'spacing_from']
            }
            else if (items && items.value == "spacing_to") {
              temp = [sequelize.col('m_variety_characteristics.spacing_to'), 'spacing_to']
            } else if (items && items.value == "generic_morphological") {
              temp = [sequelize.col('m_variety_characteristics.generic_morphological'), 'generic_morphological']
            } else if (items && items.value == "seed_rate") {
              temp = [sequelize.col('m_variety_characteristics.seed_rate'), 'seed_rate']
            } else if (items && items.value == "average_yeild_from") {
              temp = [sequelize.col('m_variety_characteristics.average_yeild_from'), 'average_yeild_from']
            } else if (items && items.value == "average_yeild_to") {
              temp = [sequelize.col('m_variety_characteristics.average_yeild_to'), 'average_yeild_to']
            } else if (items && items.value == "fertilizer_dosage") {
              temp = [sequelize.col('m_variety_characteristics.fertilizer_dosage'), 'fertilizer_dosage']
            } else if (items && items.value == "agronomic_features") {
              temp = [sequelize.col('m_variety_characteristics.agronomic_features'), 'agronomic_features']
            } else if (items && items.value == "adoptation") {
              temp = [sequelize.col('m_variety_characteristics.adoptation'), 'adoptation']
            } else if (items && items.value == "reaction_abiotic_stress") {
              temp = [sequelize.col('m_variety_characteristics.reaction_abiotic_stress'), 'reaction_abiotic_stress']
            } else if (items && items.value == "reaction_major_diseases") {
              temp = [sequelize.col('m_variety_characteristics.reaction_major_diseases'), 'reaction_major_diseases']
            } else if (items && items.value == "reaction_to_pets") {
              temp = [sequelize.col('m_variety_characteristics.reaction_to_pets'), 'reaction_to_pets']
            } else if (items && items.value == "specific_morphological") {
              temp = [sequelize.col('m_variety_characteristics.specific_morphological'), 'specific_morphological']
            } else if (items && items.value == "notification_date") {
              temp = [sequelize.col('m_variety_characteristics.notification_date'), 'notification_date']
            } else if (items && items.value == "year_of_introduction_market") {
              temp = [sequelize.col('m_variety_characteristics.year_of_introduction_market'), 'year_of_introduction_market']
            } else if (items && items.value == "notification_number") {
              temp = [sequelize.col('m_variety_characteristics.notification_number'), 'notification_number']
            } else if (items && items.value == "meeting_number") {
              temp = [sequelize.col('m_variety_characteristics.meeting_number'), 'meeting_number']
            } else if (items && items.value == "year_of_release") {
              temp = [sequelize.col('m_variety_characteristics.year_of_release'), 'year_of_release']
            } else if (items && items.value == "nitrogen") {
              temp = [sequelize.col('m_variety_characteristics.nitrogen'), 'nitrogen']
            } else if (items && items.value == "phosphorus") {
              temp = [sequelize.col('m_variety_characteristics.phosphorus'), 'phosphorus']
            } else if (items && items.value == "potash") {
              temp = [sequelize.col('m_variety_characteristics.potash'), 'potash']
            } else if (items && items.value == "other") {
              temp = [sequelize.col('m_variety_characteristics.other'), 'other']
            } else if (items && items.value == "fertilizer_other_name") {
              temp = [sequelize.col('m_variety_characteristics.fertilizer_other_name'), 'fertilizer_other_name']
            } else if (items && items.value == "fertilizer_other_value") {
              temp = [sequelize.col('m_variety_characteristics.fertilizer_other_value'), 'fertilizer_other_value']
            } else if (items && items.value == "maturity") {
              temp = [sequelize.col('m_variety_characteristics.maturity'), 'maturity']
            } else if (items && items.value == "type") {
              temp = [sequelize.col('m_variety_characteristics.type'), 'type']
            } else if (items && items.value == "ecology") {
              temp = [sequelize.col('m_variety_characteristics.eology'), 'eology']
            }
            else if (items && items.value == "resemblance_to_variety") {
              temp = [sequelize.col('m_variety_characteristics.resemblance_to_variety'), 'resemblance_to_variety']
            }
            else if (items && items.value == "recommended_state_for_cultivation") {
              temp = [sequelize.col('m_variety_characteristics.state_data'), 'state_data']
            }
            else if (items && items.value == "responsible_insitution_developing_seed") {
              temp = [sequelize.col('m_variety_characteristics.responsible_insitution_for_breeder_seed'), 'responsible_insitution_for_breeder_seed']
            }
            else {
              temp = [sequelize.col('m_variety_characteristics.id'), 'id'];
            }
            attributesData.push(temp);

          });
          attributesData.push([sequelize.col('m_variety_characteristics.is_active'), 'is_active'])
        }
      }
      console.log('attributesData', attributesData);
      let condition = {}
      condition = {
        include: [
          {
            model: cropModel,
            attributes: [],
            include: [{
              model: cropGroupModel,
              attributes: [],
            }],
            left: true,
            // where: { is_active: 1 }
          },
          {
            model: cropVerietyModel,
            // where: { is_active: 1 },
            attributes: [],
            left: true
          }

        ],
        attributes: attributesData,
        raw: true,
        where: {
        }
      };
      let { page, pageSize, search } = req.body;
      if (req.body.page) {
        if (page === undefined) page = 1;
        if (pageSize === undefined) {
          pageSize = 10; // set pageSize to -1 to prevent sizing
        }

        if (page > 0 && pageSize > 0) {
          condition.limit = pageSize;
          condition.offset = (page * pageSize) - pageSize;
        }
      }

      const sortOrder = req.body.sort ? req.body.sort : 'id';
      const sortDirection = req.body.order ? req.body.order : 'DESC';
      // condition.order = [[sortOrder, sortDirection]];


      condition.order = [[sequelize.col('m_crop.crop_group'), 'ASC'], [sequelize.col('m_crop.crop_name'), 'ASC'], [sequelize.col('m_crop_variety.variety_name'), 'ASC']];
      // condition.where.user_id = userId;
      if (search) {
        condition.where = {};
        // if (req.body.search.cropGroup) {
        //   condition.where.crop_group_code = (req.body.search.cropGroup);
        // }
        if (req.body.search.crop_group) {
          condition.include[0].where = {};
          condition.include[0].where.group_code = (req.body.search.crop_group);

          // condition.include[0].where.is_active = 1;
        }
        if (req.body.search.crop_name) {
          condition.where.crop_code = (req.body.search.crop_name);
        }


        // if (req.body.search.user_id) {
        //   condition.where.user_id = req.body.search.user_id;
        // }
        if (req.body.search.variety_name) {
          condition.where.variety_code = (req.body.search.variety_name);
        }
        if (req.body.search.is_notified) {
          if (req.body.search.is_notified == "notified") {
            console.log('req.body.search.is_notified', req.body.search.is_notified);
            condition.where.notification_date = {
              [Op.or]: [
                { [Op.not]: null },
                { [Op.not]: '' },
              ]
            };
          }

          if (req.body.search.is_notified == "non_notified") {
            console.log('req.body.search.is_notified', req.body.search.is_notified);
            condition.where.notification_date = {
              [Op.or]: [
                { [Op.eq]: null },
                { [Op.eq]: '' },
              ]
            };
          }

        }
      }

      // console.log('user_id',req.body.loginedUserid.id);


      // if (req.body.search) {
      //   if (req.body.search.group_code) {

      //     condition.include[0].where.group_code = (req.body.search.group_code);
      //   }
      //   if (req.body.search.crop_name) {
      //     condition.where.crop_code = (req.body.search.crop_name);
      //   }
      //   if (req.body.search.variety_name) {
      //     condition.where.variety_code = (req.body.search.variety_name);
      //   }
      // }
      // condition
      data = await cropCharactersticsModel.findAndCountAll(condition);
      // console.log(data);



      //  datas = resa.sort((a, b) => {
      //   if (a.m_crop.crop_group < b.m_crop.crop_group ) {
      //     if( a.m_crop.crop_name < b.m_crop.crop_name){

      //       return -1;
      //     }
      //   }
      // });
      // datasValue = datas.sort((a, b) => {
      //   if (e) {
      //     return -1;
      //   }
      // });

      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static addCropCharacteristicsListWithDynamicField = async (req, res) => {
    try {
      let attributesData = [];

      // Field-to-column mapping
      const fieldMap = {
        crop_group: ['m_crop->m_crop_group.group_name', 'group_name'],
        variety_name: ['m_crop_varieties.variety_name', 'variety_name'],
        crop_name: ['m_crop.crop_name', 'crop_name'],
        variety_code: ['m_crop_varieties.variety_code', 'variety_code'],
        developed_by: ['m_crop_varieties.developed_by', 'developed_by'],
        matuarity_day_from: ['m_variety_characteristic.matuarity_day_from', 'matuarity_day_from'],
        matuarity_day_to: ['m_variety_characteristic.matuarity_day_to', 'matuarity_day_to'],
        spacing_from: ['m_variety_characteristic.spacing_from', 'spacing_from'],
        spacing_to: ['m_variety_characteristic.spacing_to', 'spacing_to'],
        generic_morphological: ['m_variety_characteristic.generic_morphological', 'generic_morphological'],
        seed_rate: ['m_variety_characteristic.seed_rate', 'seed_rate'],
        average_yeild_from: ['m_variety_characteristic.average_yeild_from', 'average_yeild_from'],
        average_yeild_to: ['m_variety_characteristic.average_yeild_to', 'average_yeild_to'],
        fertilizer_dosage: ['m_variety_characteristic.fertilizer_dosage', 'fertilizer_dosage'],
        agronomic_features: ['m_variety_characteristic.agronomic_features', 'agronomic_features'],
        adoptation: ['m_variety_characteristic.adoptation', 'adoptation'],
        reaction_abiotic_stress: ['m_variety_characteristic.reaction_abiotic_stress', 'reaction_abiotic_stress'],
        reaction_major_diseases: ['m_variety_characteristic.reaction_major_diseases', 'reaction_major_diseases'],
        reaction_to_pets: ['m_variety_characteristic.reaction_to_pets', 'reaction_to_pets'],
        specific_morphological: ['m_variety_characteristic.specific_morphological', 'specific_morphological'],
        notification_date: ['m_variety_characteristic.notification_date', 'notification_date'],
        year_of_introduction_market: ['m_variety_characteristic.year_of_introduction_market', 'year_of_introduction_market'],
        notification_number: ['m_crop_varieties.not_number', 'notification_number'],
        meeting_number: ['m_crop_varieties.meeting_number', 'meeting_number'],
        year_of_release: ['m_variety_characteristic.year_of_release', 'year_of_release'],
        nitrogen: ['m_variety_characteristic.nitrogen', 'nitrogen'],
        phosphorus: ['m_variety_characteristic.phosphorus', 'phosphorus'],
        potash: ['m_variety_characteristic.potash', 'potash'],
        other: ['m_variety_characteristic.other', 'other'],
        fertilizer_other_name: ['m_variety_characteristic.fertilizer_other_name', 'fertilizer_other_name'],
        fertilizer_other_value: ['m_variety_characteristic.fertilizer_other_value', 'fertilizer_other_value'],
        maturity: ['m_variety_characteristic.maturity', 'maturity'],
        type: ['m_crop_varieties.type', 'type'],
        ecology: ['m_variety_characteristic.eology', 'eology'], // check spelling
        resemblance_to_variety: ['m_variety_characteristic.resemblance_to_variety', 'resemblance_to_variety'],
        recommended_state_for_cultivation: ['m_variety_characteristic.state_data', 'state_data'],
        responsible_insitution_developing_seed: ['m_variety_characteristic.responsible_insitution_for_breeder_seed', 'responsible_insitution_for_breeder_seed']
      };

      // Build attributesData from request
      if (req.body.search?.fieldData?.length) {
        for (const item of req.body.search.fieldData) {
          if (item?.value && fieldMap[item.value]) {
            const [col, alias] = fieldMap[item.value];
            attributesData.push([sequelize.col(col), alias]);
          } else {
            attributesData.push([sequelize.col('m_variety_characteristic.id'), 'id']);
          }
        }
      }

      // Always include is_active
      attributesData.push([sequelize.col('m_variety_characteristic.is_active'), 'is_active']);

      const condition = {
        include: [
          {
            model: cropModel,
            attributes: [],
            include: [{ model: cropGroupModel, attributes: [] }],
            left: true
          },
          {
            model: cropCharactersticsModel,
            attributes: [],
            required: false
          }
        ],
        attributes: attributesData,
        raw: true,
        where: {}
      };

      // Pagination
      let { page = 1, pageSize = 10, search } = req.body;
      if (page > 0 && pageSize > 0) {
        condition.limit = pageSize;
        condition.offset = (page - 1) * pageSize;
      }

      // Sorting
      condition.order = [
        [sequelize.col('m_crop.crop_group'), 'ASC'],
        [sequelize.col('m_crop.crop_name'), 'ASC'],
        [sequelize.col('m_crop_varieties.variety_name'), 'ASC']
      ];

      // Filters
      if (search) {
        if (search.crop_group) {
          condition.include[0].where = { group_code: search.crop_group };
        }
        if (search.crop_name) {
          condition.where.crop_code = search.crop_name;
        }
        if (search.variety_name) {
          condition.where.variety_code = search.variety_name;
        }
        if (search.is_notified) {
          // condition.where.notification_date =
          //   search.is_notified === 'notified'
          //     ? { [Op.or]: [{ [Op.not]: null }, { [Op.not]: '' }] }
          //     : { [Op.or]: [{ [Op.eq]: null }, { [Op.eq]: '' }] };
        }
      }

      const data = await cropVerietyModel.findAndCountAll(condition);
      response(res, status.DATA_AVAILABLE, 200, data);
    } catch (error) {
      console.error(error);
      response(res, status.DATA_NOT_AVAILABLE, 500);
    }
  };

  //Add/update seed multiplication ratio
  static addSeedMultiplicationRatioData = async (req, res) => {
    try {
      let tabledAlteredSuccessfully = false;
      let tabledExtracted = false;
      if (req.body !== undefined
        && req.body.nucleusSeed !== undefined
        && req.body.nucleusSeed.length > 0) {
        tabledExtracted = true;
        for (let index = 0; index < req.body.nucleusSeed.length; index++) {
          const element = req.body.nucleusSeed[index];
          const dataRow = {
            crop_name: element.crop_name,
            user_id: element.user_id,
            created_by: element.user_id,
            updated_by: element.user_id,
            crop_code: element.crop_code,
            croup_group_code: element.group_code.group_code,
            crop_group_code: element.group_code.group_code,
            nucleus_to_breeder: (element.nucleus_breader),
            breeder_to_foundation: element.breader_to_foundation_1,
            foundation_1_to_2: element.foundation_1_to_foundation_2,
            foundation_2_to_cert: element.foundation_2_to_certified,
            status: 'Active',
            is_active: 1,
            created_at: Date.now(),
            updated_at: Date.now(),
          };
          console.log('data============row', dataRow);
          if (element.id > 0) {
            await seedMultiplicationRatioModel.update(dataRow, { where: { id: element.id } }).then(function (item) {
              tabledAlteredSuccessfully = true;
            }).catch(function (err) {
            });
          } else {
            const existingData = await seedMultiplicationRatioModel.findAll({
              where: sequelize.where(
                sequelize.fn('lower', sequelize.col('crop_group_code')),
                sequelize.fn('lower', element.group_code.group_code),
              )
            });
            if (1) {
              const newData = await seedMultiplicationRatioModel.build(dataRow);
              await newData.save();
              tabledAlteredSuccessfully = true;
            }
          }
        }
      }
      if (!tabledExtracted) {
        return response(res, status.REQUEST_DATA_MISSING, 204);
      } else {
        if (tabledAlteredSuccessfully) {
          return response(res, status.DATA_SAVE, 200, {})
        } else {
          return response(res, status.DATA_NOT_AVAILABLE, 404)
        }
      }
    } catch (error) {
      // console.log('qwertyuiop', error);
      return response(res, status.UNEXPECTED_ERROR, 500)
    }
  }
  static updateSeedMultiplicationRatioData = async (req, res) => {
    let returnResponse = {};
    let internalCall = {};
    try {
      let rules = {
        'crop': 'string',
        'max_lot_size': 'string',
        'group_code': 'string',
        'group_name': 'string',
      };
      let validation = new Validator(req.body, rules);
      const isValidData = validation.passes();
      if (!isValidData) {
        let errorResponse = {};
        for (let key in rules) {
          const error = validation.errors.get(key);
          if (error.length) {
            errorResponse[key] = error;
          }
        }
        return response(res, status.BAD_REQUEST, 400, errorResponse, internalCall)
      }
      console.log('active', req.body.active);
      let data = {
        crop_name: req.body.crop_name,
        crop_code: req.body.crop_code,
        croup_group_code: req.body.group_code,
        crop_group_code: req.body.group_code,
        nucleus_to_breeder: (req.body.nucleus_breader),
        breeder_to_foundation: req.body.breader_to_foundation_1,
        foundation_1_to_2: req.body.foundation_1_to_foundation_2,
        foundation_2_to_cert: req.body.foundation_2_to_certified,
        status: 'Active',
        is_active: req.body.active,
        updated_by: req.body.user_id,
        created_at: Date.now(),
        updated_at: Date.now(),
        active: req.body.is_active
      }
      const seedMultiplicationData = seedMultiplicationRatioModel.update(data, { where: { id: req.body.id } });
      returnResponse = {};
      return response(res, status.DATA_UPDATED, 200, returnResponse, internalCall)
    } catch (error) {
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }
  // Get seed multiplication ratio
  static getSeedMultiplicationRatioData = async (req, res) => {
    let returnResponse = {};
    try {
      let rules = {
        'id': 'integer',
        'group_code': 'string',
        'crop_name': 'string',
      };
      let validation = new Validator(req.body, rules);
      const isValidData = validation.passes();
      if (!isValidData) {
        let errorResponse = {};
        for (let key in rules) {
          const error = validation.errors.get(key);
          if (error.length) {
            errorResponse[key] = error;
          }
        }
        return response(res, status.BAD_REQUEST, 400, errorResponse, internalCall)
      }
      let condition = {
        include: [{
          model: cropModel,
          // where: {
          //   group_code : (req.body.search.group_code)
          //   // is_active:1
          // }
        },


        ],
        left: true,
        raw: false
      };
      if (req.body.search) {
        condition.where = {};
        if (req.body.search.id) {
          condition.where.id = req.body.search.id;
        }
        if (req.body.search.crop_name) {
          condition.where.crop_code = (req.body.search.crop_name);
        }
        if (req.body.search.group_code) {
          condition.include[0].where = {};
          condition.include[0].where = req.body.search.group_code
        }

      }
      let { page, pageSize } = req.body;
      if (page === undefined) page = 1;
      if (pageSize === undefined)
        pageSize = 10; // set pageSize to -1 to prevent sizing

      if (page > 0 && pageSize > 0) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }
      condition.order = [['crop_name', 'ASC']];
      const data = await seedMultiplicationRatioModel.findAndCountAll(condition);
      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, data);
      }
      if (!data) {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }
  static deleteSeedMultiplicationRatioData = async (req, res) => {
    try {
      console.log('delete', req.params.id);
      seedMultiplicationRatioModel.destroy({
        where: {
          id: req.params.id
        }
      });
      response(res, status.DATA_DELETED, 200, {});
    }
    catch (error) {
      console.log(error);
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    }
  }

  //update status on delete data
  static updateStatusSeedMultiplicationRatioData = async (req, res) => {
    try {
      console.log('delete', req.params.id);
      let data = {
        is_active: 0,
        updated_by: req.body.user_id
      }
      seedMultiplicationRatioModel.update(data, {
        where: {
          id: req.body.id
        },
      });
      response(res, status.DATA_DELETED, 200, {});
    }
    catch (error) {
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    }
  }

  static getseedMultRatioSeedCropData = async (req, res) => {
    try {
      let condition = {
      }
      let { page, pageSize, search } = req.body;
      if (page === undefined) page = 1;
      if (pageSize === undefined) pageSize = 5; // set pageSize to -1 to prevent sizing
      if (page > 0 && pageSize > 0) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }
      //implement sort
      const sortOrder = req.body.sort ? req.body.sort : 'id';
      const sortDirection = req.body.order ? req.body.order : 'DESC';
      //sort condition
      condition.order = [[sortOrder, sortDirection]];
      if (search) {
        condition.where = {};
        for (let index = 0; index < search.length; index++) {
          const element = search[index];
          if (element.columnNameInItemList.toLowerCase() == "year.value") {
            condition.where["year"] = element.value;
          }
          if (element.columnNameInItemList.toLowerCase() == "crop.value") {
            condition.where["group_code"] = element.value;
          }
          if (element.columnNameInItemList.toLowerCase() == "variety.value") {
            condition.where["variety_id"] = element.value;
          }
          if (element.columnNameInItemList.toLowerCase() == "id") {
            condition.where["id"] = element.value;
          }
        }
      }
      if (req.body.search) {
        if (req.body.search.year) {
          condition.where.year = (req.body.search.year);
        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = (req.body.search.crop_code);
        }
        // if (req.body.search.variety_code) {
        //   condition.where.variety_code = (req.body.search.variety_code);
        // }
      }
      let data = await cropModel.findAndCountAll(condition);
      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      return response(res, status.DATA_NOT_AVAILABLE, 500, error);
    }

  }


  static getAgencyDetailsName = async (req, res) => {
    try {
      let condition = {
        include: [
          {
            model: userModel,
            attributes: [],
            left: true,
            where: {
              'user_type': 'IN'
            }
          },
        ],

        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('agency_details.agency_name')), 'agency_name'],
          'id'
        ],
        where: {

        }
      }

      if (req.body.search) {
        if (req.body.search.state_id) {
          condition.where.state_id = req.body.search.state_id;
        }

        if (req.body.search.district_id) {
          condition.where.district_id = req.body.search.district_id;
        }
      }
      condition.order = [['agency_name', 'ASC']];
      let data = await agencyDetailModel.findAndCountAll(condition);
      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      console.log('error================', error);
      return response(res, status.DATA_NOT_AVAILABLE, 500, error);
    }
  }



  static getBankNameDetails = async (req, res) => {
    try {
      let condition = {
        where: {
          // branch_name:'ALLAHABAD UP GRAMIN BANK BELATAD'
        },
        attributes: [[sequelize.fn('DISTINCT', sequelize.col('bank_name')), 'bank_name']],
      }

      if (req.body.search) {
        if (req.body.search.state_code) {
          condition.where.dbt_state_code = req.body.search.state_code.toString();
        }
      }


      condition.order = [['bank_name', 'asc']];
      let data = await bankDetailsModel.findAndCountAll(condition);


      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      console.log('error======', error);
      return response(res, status.DATA_NOT_AVAILABLE, 500, error);
    }
  }
  static getBankBranchNameDetails = async (req, res) => {
    let data = {};
    try {
      let condition = {
        where: {
          [Op.and]: [
            {
              branch_name: {
                [Op.ne]: null
              }

            },
            {
              branch_name: {
                [Op.ne]: ""
              }

            },
            {
              branch_name: {
                [Op.ne]: "#ERROR!"
              }

            },
            {
              branch_name: {
                [Op.ne]: "#NAME?"
              }

            }

          ]
        },

        raw: false,
        // attributes: [
        //   [sequelize.literal('DISTINCT(crop_name)'),'crop_name'],
        //   [sequelize.col('crop_code'), 'crop_code'],
        // ],
      };
      condition.order = [['branch_name', 'asc']];
      if (req.body.search) {
        if (req.body.search.bank_name) {
          condition.where.bank_name = (req.body.search.bank_name);
        }
        if (req.body.search.branch_name) {
          condition.where.branch_name = (req.body.search.branch_name);
        }
        if (req.body.search.state_code) {
          condition.where.dbt_state_code = req.body.search.state_code.toString();
        }
      }
      data = await bankDetailsModel.findAll(condition);

      // res.send(data)

      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static getIfscCodeDetails = async (req, res) => {
    let data = {};
    try {
      let condition = {
        where: {

        },
        raw: false,
        // attributes: [
        //   [sequelize.literal('DISTINCT(crop_name)'),'crop_name'],
        //   [sequelize.col('crop_code'), 'crop_code'],
        // ],
      };

      if (req.body.search) {
        if (req.body.search.bank_name) {
          condition.where.bank_name = (req.body.search.bank_name);
        }
        if (req.body.search.branch_name) {
          condition.where.branch_name = (req.body.search.branch_name);
        }
      }
      data = await bankDetailsModel.findAll(condition);

      // res.send(data)

      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getVarietyDataDetails = async (req, res) => {
    let data = {};
    try {
      let condition = {
        where: {

        },
        raw: false,
        // attributes: [
        //   [sequelize.literal('DISTINCT(crop_name)'),'crop_name'],
        //   [sequelize.col('crop_code'), 'crop_code'],
        // ],
      };

      if (req.body.search) {
        if (req.body.search.variety_name) {
          condition.where.variety_name = (req.body.search.id);
        }

      }
      data = await cropVerietyModel.findAll(condition);

      // res.send(data)

      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }




  // static addSeasonValue = async (req, res) => {
  //   try {

  //     for (let index = 0; index < req.body.nucleusSeed.length; index++) {
  //       const element = req.body.nucleusSeed[index];
  //       const dataRow={

  //         seasons:element.season,
  //           crop_id:element.crop_id
  //       }

  //     const newData = await seasonValueModel.build(dataRow);
  //     await newData.save();
  //     if (newData) {
  //       return response(res, status.DATA_SAVE, 200, {})
  //     } else {
  //       return response(res, status.DATA_NOT_AVAILABLE, 404)
  //     }
  //     }

  //     // const data = seasonValueModel.build({

  //     // });




  //   }
  //   catch (error) {
  //     console.log(error, 'dataRow');
  //     return response(res, status.DATA_NOT_SAVE, 500)
  //   }
  // }






  // -=------------//

  static addSeasonValue = async (req, res) => {
    try {
      let tabledAlteredSuccessfully = false;
      let tabledExtracted = false;
      // console.log(tabledExtracted,'tabledExtracted,2339');
      console.log(req.body, 'req');
      if (req.body !== undefined
        && req.body.nucleusSeed !== undefined
      ) {
        tabledExtracted = true;
        // console.log(req.body.nucleusSeed.season);
        console.log("tabledExtracted", tabledExtracted, '2345');
        for (let index = 0; index < req.body.nucleusSeed.season.length; index++) {
          const element = req.body.nucleusSeed.season[index];
          const data = req.body.nucleusSeed[index];
          console.log(req.body.nucleusSeed.crop_id, '<::allDarta');
          console.log(data, '<::elemenr');
          const dataRow = {

            seasons: element,
            crop_id: req.body.nucleusSeed.crop_id

          };
          // console.log('data===>',dataRow);
          if (element.id > 0) {
            // update
            await seasonValueModel.update(dataRow, { where: { id: element.id } }).then(function (item) {
              tabledAlteredSuccessfully = true;
            }).catch(function (err) {

            });
          }
          else {
            const newData = await seasonValueModel.build(dataRow);
            await newData.save();
            tabledAlteredSuccessfully = true;
          }
        }
      }
      if (!tabledExtracted) {
        return response(res, status.REQUEST_DATA_MISSING, 204);
      }
      else {
        if (tabledAlteredSuccessfully) {
          return response(res, status.DATA_SAVE, 200, {})
        } else {
          return response(res, status.DATA_NOT_AVAILABLE, 404)
        }

      }
    }
    catch (error) {
      console.log('qwertyuiop', error);
      return response(res, status.UNEXPECTED_ERROR, 500)
    }
  }


  static converDate(dateString) {

    var date = new Date(dateString);
    var yr = date.getFullYear();
    var mo = date.getMonth() + 1;
    var day = date.getDate();

    var hours = date.getHours();
    var hr = hours < 10 ? '0' + hours : hours;

    var minutes = date.getMinutes();
    var min = (minutes < 10) ? '0' + minutes : minutes;

    var seconds = date.getSeconds();
    var sec = (seconds < 10) ? '0' + seconds : seconds;

    var newDateString = yr + '-' + mo + '-' + day;
    var newTimeString = hr + ':' + min + ':' + sec;

    var excelDateString = newDateString + ' ' + newTimeString;

    return excelDateString;
  }
  static getvarietCode = async (req, res) => {
    let returnResponse = {};
    try {
      let rules = {
        'variety_id': 'integer',
        // 'state_id': 'string',
        // 'district_id': 'string',
        // 'lab_name': 'string'
      };

      let validation = new Validator(req.body, rules);

      const isValidData = validation.passes();

      if (!isValidData) {
        let errorResponse = {};
        for (let key in rules) {
          const error = validation.errors.get(key);
          if (error.length) {
            errorResponse[key] = error;
          }
        }
        return response(res, status.BAD_REQUEST, 400, errorResponse, internalCall)
      }

      let condition = {

        where: {}
      };
      if (req.body.search) {
        if (req.body.search.variety_id) {
          condition.where.id = req.body.search.variety_id;
        }

      }
      let { page, pageSize } = req.body;
      if (page === undefined) page = 1;
      if (pageSize === undefined) {
        // pageSize = 10;
      } // set pageSize to -1 to prevent sizing

      if (page > 0 && pageSize > 0) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }
      condition.order = [['id', 'DESC']];
      const data = await cropVerietyModel.findAndCountAll(condition);
      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, data);
      }
      if (!data) {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    } catch (error) {
      console.log(error)
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }


  static getDistrictLatLong = async (req, res) => {
    const { internalCall } = req.body;
    let returnResponse = {};
    try {

      let rules = {
        'search.district_id': 'integer',
      };

      let validation = new Validator(req.body, rules);

      const isValidData = validation.passes();

      if (!isValidData) {
        let errorResponse = {};
        for (let key in rules) {
          const error = validation.errors.get(key);
          if (error.length) {
            errorResponse[key] = error;
          }
        }
        return response(res, status.BAD_REQUEST, 400, errorResponse, internalCall)
      }

      let condition = {

        where: {
          district_code_LG: req.body.search.district_id,
          // min_longitude: { [Op.gt]:  req.body.search.min_longitude},
          // max_longitude: { [Op.lt]: req.body.search.min_longitude},
          // variety_code: {
          //   [Op.like]: "%" + req.body.search.crop_code + "%",
          // },
          // id: req.body.search.variety_id,
          // is_active: 1
        },
        // raw: false,
        // limit: 1
      };

      // condition.order = [['variety_code', 'Desc']];

      let queryData = await districtLatLongModel.findAll(condition);


      console.log('queryData', queryData);
      console.log(queryData);
      return response(res, status.OK, 200, queryData, internalCall);

    } catch (error) {
      returnResponse = {
        message: error
      };
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }
  static getDynamicVarietyCodeCharacterstics = async (req, res) => {
    const { internalCall } = req.body;
    let returnResponse = {};
    try {

      let rules = {
        'search.variety_id': 'integer',
      };

      let validation = new Validator(req.body, rules);

      const isValidData = validation.passes();

      if (!isValidData) {
        let errorResponse = {};
        for (let key in rules) {
          const error = validation.errors.get(key);
          if (error.length) {
            errorResponse[key] = error;
          }
        }
        return response(res, status.BAD_REQUEST, 400, errorResponse, internalCall)
      }

      let condition = {
        include: [
          {
            model: db.varietyCategoryMappingModel,
            attributes: ['m_variety_category_id'],
            as: 'category',
            include: [
              {
                model: db.varietyCategoryModel,
                attributes: ['category'],
                require: true
              },
            ],
          }
        ],
        where: {
          id: req.body.search.variety_id,
          // id: req.body.search.variety_id,
          // is_active: 1
        },
        raw: false,
        limit: 1
      };

      condition.order = [['variety_code', 'Desc']];

      const queryData = await cropVerietyModel.findAll(condition);

      return response(res, status.OK, 200, queryData, internalCall);

    } catch (error) {
      returnResponse = {
        message: error.message
      };
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }


  static freezeIndentBreederSeedData = async (req, res) => {
    try {
      const id = [] = req.body.search.id;
      console.log('gauravgauarv', id);
      const data = await indentOfBreederseedModel.update({
        is_freeze: 1,
        // is_forward:1
      }, {
        where: {
          id: id
        }
      })
      if (data) {
        response(res, status.DATA_UPDATED, 200, data)
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_SAVE, 500, error)
    }
  }

  static freezeIndentBreederSeedDataForward = async (req, res) => {
    try {
      const id = [] = req.body.search.id;
      const data = await indentOfBreederseedModel.update({
        is_forward: 1
      }, {
        where: {
          id: id
        }
      })
      if (data) {
        response(res, status.DATA_UPDATED, 200, data)
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_SAVE, 500, error)
    }
  }


  static freezeIndentBreederSeedReport = async (req, res) => {
    let data = {};
    try {
      let condition = {};
      if (req.body.search.icar) {
        condition = {
          include: [
            {
              model: userModel,
              attributes: ['id'],
              left: true,
              include: [
                {
                  model: agencyDetailModel,
                  left: true,
                  attributes: ['id', 'short_name', 'agency_name'],
                  // include: [{
                  //   model: stateModel,
                  //   left: true,
                  //   attributes: ['id', 'state_code', 'state_short_name'],
                  // }]
                },
              ],
              where: {
                user_type: 'IN',
                // id: {
                //   [Op.ne]: null,
                // },
              }

            },
            {
              model: varietyModel,
              left: true,
              attributes: ['variety_name', 'variety_code'],
            }
          ],
          attributes: ['id', 'user_id', 'variety_id', 'indent_quantity', 'icar_freeze'],
          // where: {
          //   user_id: {
          //     [Op.ne]: null,
          //     // distinct: true
          //   },
          //   is_freeze: 1
          //   // state_short_name:{
          //   //   [Op.ne]: null,
          //   // }
          //   // attributes:['id','indent_quantity','unit','agency_id','state_short_name','state_id']
          //   // raw: false,
          // },
          where: {
            [Op.and]: [
              {
                user_id: {
                  [Op.ne]: null
                }

              },
            ]
          },
          // group:['indent_of_breederseeds.variety_id']

        };
      }
      else {
        condition = {
          include: [
            {
              model: userModel,
              attributes: ['id'],
              left: true,
              include: [
                {
                  model: agencyDetailModel,
                  left: true,
                  attributes: ['id', 'short_name', 'agency_name'],
                  // include: [{
                  //   model: stateModel,
                  //   left: true,
                  //   attributes: ['id', 'state_code', 'state_short_name'],
                  // }]
                },
              ],
              where: {
                user_type: 'IN',
                // id: {
                //   [Op.ne]: null,
                // },
              }

            },
            {
              model: varietyModel,
              left: true,
              attributes: ['variety_name', 'variety_code'],
            }
          ],
          attributes: ['id', 'user_id', 'variety_id', 'indent_quantity', 'icar_freeze'],
          // where: {
          //   user_id: {
          //     [Op.ne]: null,
          //     // distinct: true
          //   },
          //   is_freeze: 1
          //   // state_short_name:{
          //   //   [Op.ne]: null,
          //   // }
          //   // attributes:['id','indent_quantity','unit','agency_id','state_short_name','state_id']
          //   // raw: false,
          // },
          where: {
            [Op.or]: [
              {
                user_id: {
                  [Op.ne]: null
                }
              },
            ]
          },
          // group:['indent_of_breederseeds.variety_id']

        };
      }

      if (req.body.search) {
        if (req.body.search.year) {
          condition.where.year = req.body.search.year;
        }

        if (req.body.search.season) {
          condition.where.season = req.body.search.season;
        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = req.body.search.crop_code;
        }
        if (req.body.search.type) {
          if (req.body.search.type == "nodal") {
            // condition.where.is_freeze = 1;
            // condition.where.icar_freeze = 0;
            if (req.body.search.crop_type) {
              condition.where.crop_code = {
                [Op.like]: req.body.search.crop_type + "%"
              }
            }
          }

        } else {
          condition.where = {
            is_freeze: {
              [Op.eq]: 1
            },
            icar_freeze: {
              [Op.eq]: 0
            }

          }
        }
      }
      data = await indentOfBreederseedModel.findAndCountAll(condition);
      // data = await indentorBreederSeedModel.findAndCountAll(condition);
      // res.send(data)
      let returnResponse = await paginateResponse(data);
      // console.log("data", returnResponse)
      response(res, status.DATA_AVAILABLE, 200, returnResponse)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  //add-state-characterstrics
  static addStateCharacterstics = async (req, res) => {
    try {
      // console.log(r);
      let tabledAlteredSuccessfully = false;
      let tabledExtracted = false;
      if (req.body !== undefined
        && req.body.nucleusSeed !== undefined
        && req.body.nucleusSeed.length > 0) {
        tabledExtracted = true;
        for (let index = 0; index < req.body.nucleusSeed.length; index++) {
          const element = req.body.nucleusSeed[index];
          const dataRow = {
            state_code: element.state_code,
            state_name: element.state_name,
            state_data: element
          };
          // console.log('data============row', dataRow);
          if (element.id > 0) {
            // update
            await characterStateModel.update(dataRow, { where: { id: element.id } }).then(function (item) {
              tabledAlteredSuccessfully = true;
            }).catch(function (err) {
            });
          }
          else {
            const newData = await characterStateModel.build(dataRow);
            await newData.save();
            tabledAlteredSuccessfully = true;
          }
        }
      }
      if (!tabledExtracted) {
        return response(res, status.REQUEST_DATA_MISSING, 204);
      }
      else {
        if (tabledAlteredSuccessfully) {
          return response(res, status.DATA_SAVE, 200, {})
        } else {
          return response(res, status.DATA_NOT_AVAILABLE, 404)
        }
      }
    }
    catch (error) {
      console.log('qwertyuiop', error);
      return response(res, status.UNEXPECTED_ERROR, 500)
    }
  }


  static upload = async (req, res) => {
    // console.log('hiiiiiiiii');
    console.log('req.body======>', req.files.name.name, req.files.name.data
    );
    const minioClient = await this.clientSetUp();
    const isExist = await minioClient.bucketExists("seeds");
    console.log('hellllllllllloooooooooooo');
    if (!isExist) {
      console.log('hiiiiiii');
      const createBucket = await minioClient.makeBucket('seeds', 'us-east-1');
      console.log('Bucket created successfully in "us-east-1".')
      // console.log('createBucket', createBucket);
    }
    console.log('isExist', isExist);

    const uploadFile = await minioClient.putObject('seeds', req.files.name.name, req.files.name.data);
    console.log('upload', req.files);
    if (!uploadFile) {
      return console.log(uploadFile)
    }
    const dataRow = {
      image_url: uploadFile.etag
    }
    const data = await cropCharactersticsModel.create(dataRow);
    data.save();



    console.log('File uploaded successfully.');
    res.json({
      message: 'File uploaded successfully.',
      status: 200,
    });
  }
  static download = async (req, res) => {
    const { filename = "" } = req.query;
    console.log('filename', filename);
    const minioClient = await this.clientSetUp();
    const file = await minioClient.getObject('seeds', filename);
    return file.pipe(res);
  }

  static getData = async (req, res) => {
    let returnResponse = {};
    let condition = {};
    try {

      condition = {
        include: [
          {
            model: userModel,
            left: true,
            attributes: ['name', 'username', 'password']
          }
        ],
        where: {
          id: req.body.search.id
        }
      }

      let data = await agencyDetailModel.findAndCountAll(condition);
      if (data) {

        return response(res, status.DATA_AVAILABLE, 200, data)
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 400)
      }
      return response(res, status.DATA_SAVE, 200, insertData)


    } catch (error) {
      returnResponse = {
        message: error.message
      };
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }


  static checkAlreadyExistsCropName = async (req, res) => {
    const { internalCall } = req.body;
    let returnResponse = {};
    try {

      let rules = {
        'search.crop_name': 'string',
        'search.crop_group': 'string',
      };

      let validation = new Validator(req.body, rules);

      const isValidData = validation.passes();

      if (!isValidData) {
        let errorResponse = {};
        for (let key in rules) {
          const error = validation.errors.get(key);
          if (error.length) {
            errorResponse[key] = error;
          }
        }
        return response(res, status.BAD_REQUEST, 400, errorResponse, internalCall)
      }

      let condition = {

      };
      let existingData;
      if (req.body.search.id) {
        existingData = await cropModel.findAll({
          where: {
            [Op.and]: [
              sequelize.where(
                sequelize.fn('lower', sequelize.col('crop_name')),
                sequelize.fn('lower', req.body.search.crop_name),
              ),
              // sequelize.where(sequelize.col('crop_group'), req.body.search.crop_group),
            ],
            id: {
              [Op.ne]: req.body.search.id
            }
          }
        });
      } else {
        existingData = await cropModel.findAll({
          where: {
            [Op.and]: [
              sequelize.where(
                sequelize.fn('lower', sequelize.col('crop_name')),
                sequelize.fn('lower', req.body.search.crop_name),
              ),
              // sequelize.where(sequelize.col('crop_group'), req.body.search.crop_group),
            ],
          }
        });
      }
      let tabledAlteredSuccessfully = false;
      if (existingData === undefined || existingData.length < 1) {
        // const data = await cropModel.create(dataRow);
        // await data.save();
        tabledAlteredSuccessfully = true;
      }

      if (tabledAlteredSuccessfully) {
        return response(res, status.DATA_SAVE, 200, {})
      } else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }


    } catch (error) {
      returnResponse = {
        message: error.message
      };
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }

  static checkAlreadyExistsVarietyNames = async (req, res) => {
    const { internalCall } = req.body;
    let returnResponse = {};
    try {

      let rules = {
        'search.variety_name': 'string',
      };

      let validation = new Validator(req.body, rules);

      const isValidData = validation.passes();

      if (!isValidData) {
        let errorResponse = {};
        for (let key in rules) {
          const error = validation.errors.get(key);
          if (error.length) {
            errorResponse[key] = error;
          }
        }
        return response(res, status.BAD_REQUEST, 400, errorResponse, internalCall)
      }

      let condition = {

      };
      // aritData = await cropVerietyModel.findAll({
      //   where: {
      //     [Op.or]: [{ variety_name: req.body.variety_name }],
      //     is_active: 1
      //   }
      // });




      // if ((varitData && varitData.length)) {
      //   const errorResponse = {
      //     subscriber_id: 'Variety Name no is already registered. Please fill form correctly'
      //   }
      //   return response(res, status.USER_EXISTS, 409, errorResponse)
      // }
      // else{
      console.log("req.body.search.variety_name===", req.body.search.variety_name);
      let varitData = await cropVerietyModel.findAll({
        where: {
          [Op.or]: [{ variety_name: req.body.search.variety_name }],
          is_active: 1
        }
      });

      if ((varitData && varitData.length)) {
        const errorResponse = {
          inValid: true
        }
        return response(res, status.USER_EXISTS, 409, errorResponse)
      }
      else {

        const errorResponse = {
          inValid: false
        }
        return response(res, status.OK, 200, errorResponse, internalCall);
      }


    } catch (error) {
      returnResponse = {
        message: error.message
      };
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }


  static checkAlreadyExistsMaxLotSize = async (req, res) => {
    const { internalCall } = req.body;
    let returnResponse = {};
    try {

      let rules = {
        'search.crop': 'string',
        // 'search.max_lot_size':'string'
      };

      let validation = new Validator(req.body, rules);

      const isValidData = validation.passes();

      if (!isValidData) {
        let errorResponse = {};
        for (let key in rules) {
          const error = validation.errors.get(key);
          if (error.length) {
            errorResponse[key] = error;
          }
        }
        return response(res, status.BAD_REQUEST, 400, errorResponse, internalCall)
      }

      let condition = {

      };
      // aritData = await cropVerietyModel.findAll({
      //   where: {
      //     [Op.or]: [{ variety_name: req.body.variety_name }],
      //     is_active: 1
      //   }
      // });




      // if ((varitData && varitData.length)) {
      //   const errorResponse = {
      //     subscriber_id: 'Variety Name no is already registered. Please fill form correctly'
      //   }
      //   return response(res, status.USER_EXISTS, 409, errorResponse)
      // }
      // else{
      let maxLotSize = await maxLotSizeModel.findAll({
        where: {
          [Op.or]: [{ crop: req.body.search.crop }],
          // [Op.and]: [{ max_lot_size: req.body.search.max_lot_size }],
          // is_active: 1
        }
      });

      if ((maxLotSize && maxLotSize.length)) {
        const errorResponse = {
          inValid: true
        }
        return response(res, status.USER_EXISTS, 409, errorResponse)
      }
      else {

        const errorResponse = {
          inValid: false
        }
        return response(res, status.OK, 200, errorResponse, internalCall);
      }


    } catch (error) {
      returnResponse = {
        message: error.message
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }



  static getInsitutionData = async (req, res) => {
    let returnResponse = {};
    let condition = {};
    try {
      condition = {}
      let data = await responsibleInsitutionModel.findAndCountAll(condition);
      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, data)
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 400)
      }


    } catch (error) {
      returnResponse = {
        message: error.message
      };
      console.log(error);
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }
  static checkCropNameinSeedLabrotary = async (req, res) => {
    const { internalCall } = req.body;
    let returnResponse = {};
    try {

      let rules = {
        'search.crop_name': 'string',
        // 'search.max_lot_size':'string'
      };

      let validation = new Validator(req.body, rules);

      const isValidData = validation.passes();

      if (!isValidData) {
        let errorResponse = {};
        for (let key in rules) {
          const error = validation.errors.get(key);
          if (error.length) {
            errorResponse[key] = error;
          }
        }
        return response(res, status.BAD_REQUEST, 400, errorResponse, internalCall)
      }

      let condition = {

      };
      // aritData = await cropVerietyModel.findAll({
      //   where: {
      //     [Op.or]: [{ variety_name: req.body.variety_name }],
      //     is_active: 1
      //   }
      // });




      // if ((varitData && varitData.length)) {
      //   const errorResponse = {
      //     subscriber_id: 'Variety Name no is already registered. Please fill form correctly'
      //   }
      //   return response(res, status.USER_EXISTS, 409, errorResponse)
      // }
      // else{
      let seedMultiplicationData = await seedMultiplicationRatioModel.findAll({
        where: {
          [Op.or]: [{ crop_name: req.body.crop_name }],
          // [Op.and]: [{ max_lot_size: req.body.search.max_lot_size }],
          // is_active: 1
        }
      });

      if ((seedMultiplicationData && seedMultiplicationData.length)) {
        const errorResponse = {
          inValid: true
        }
        return response(res, status.USER_EXISTS, 409, errorResponse)
      }
      else {
        const errorResponse = {
          inValid: false
        }
        return response(res, status.OK, 200, errorResponse, internalCall);
      }

    } catch (error) {
      returnResponse = {
        message: error.message
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }

  static checkAlreadyExistsSeedMultiplicationRatioData = async (req, res) => {
    const { internalCall } = req.body;
    let returnResponse = {};

    try {
      let rules = {
        'search.crop_code': 'string',
        'search.user_id': 'integer'
      };
      let validation = new Validator(req.body, rules);

      const isValidData = validation.passes();

      if (!isValidData) {
        let errorResponse = {};
        for (let key in rules) {
          const error = validation.errors.get(key);
          if (error.length) {
            errorResponse[key] = error;
          }
        }
        return response(res, status.BAD_REQUEST, 400, errorResponse, internalCall)
      }

      if (req.body.search) {
        if (req.body.search.year) {
          condition.where.year = (req.body.search.year);
        }
        if ((req.body.search.crop_code) && (req.body.search.user_id)) {
          if (req.body.search.crop_code) {
            condition.where.crop_group_code = (req.body.search.crop_code);
          }
          if (req.body.search.user_id) {
            condition.where.user_id = parseInt(req.body.search.user_id);
          }
        }
        // if (req.body.search.variety_code) {
        //   condition.where.variety_code = (req.body.search.variety_code);
        // }
      }
      let checkdata = await seedMultiplicationRatioModel.findAndCountAll(condition);
      // console.log('checkdata======0', checkdata);
      if ((checkdata.count && checkdata.count > 0)) {
        // console.log('checkdata====1', checkdata);
        const errorResponse = {
          inValid: true
        }
        return response(res, status.USER_EXISTS, 409, errorResponse)
      }
      else {
        console.log('checkdata====2', checkdata);
        const errorResponse = {
          inValid: false
        }
        return response(res, status.OK, 200, errorResponse, internalCall);
      }

    } catch (error) {
      returnResponse = {
        message: error.message
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }

  }
  static getCropIndentorVerietyList = async (req, res) => {
    try {
      let condition = {
        include: [
          {
            model: cropVerietyModel,
            // left: true,
            // attributes: ['name']
          },
        ],
        where: {

        }
      }



      if (req.body.search) {
        if (req.body.search.crop_code) {
          condition.where.crop_code = req.body.search.crop_code;
        }
      }

      let data = await indentOfBreederseedModel.findAndCountAll(condition);

      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      return response(res, status.DATA_NOT_SAVE, 500, error);
    }
  }

  static getCropIndentorCropList = async (req, res) => {
    try {
      let condition = {
        include: [
          {
            model: cropModel,
            // left: true,
            // attributes: ['name']
          },
        ],
        where: {

        }
      }



      if (req.body.search) {
        if (req.body.search.year) {
          condition.where.year = parseInt(req.body.search.year);
        }
      }

      let data = await indentOfBreederseedModel.findAndCountAll(condition);

      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      console.log(error);
      return response(res, status.DATA_NOT_SAVE, 500, error);
    }
  }

  static getCropMaxLotSizeDataforReports = async (req, res) => {
    try {
      let condition = {
        include: [
          {
            model: cropModel,
            left: true,
            raw: false,
            // required:true,
            // include: [
            //   {
            //     model: cropGroupModel,
            //     required:true
            //   }
            // ]
          },
          {
            model: cropGroupModel,
            left: true,
            raw: false,

            // required:true,


          }


        ],
        left: true,
        raw: false,

        // required:true,
        // attributes: ['crop', 'max_lot_size', 'crop_code'],
        where: {},

      }

      let { page, pageSize, searchData } = req.body;
      console.log(req.body)
      if (req.body.page) {
        if (page === undefined) page = 1;
        if (pageSize === undefined) pageSize = 50;
        if (page > 0 && pageSize > 0) {
          condition.limit = pageSize;
          condition.offset = (page * pageSize) - pageSize;
        }
      }


      if (searchData && searchData.isSearch === true) {
        if (searchData.crop_group_code) {
          condition.where['group_code'] = searchData.crop_group_code
        }
        if (searchData.crop_name) {
          condition.where['crop_code'] = searchData.crop_name
        }

        // if (searchData.year) {
        //   condition.where['year'] = searchData.year
        // }
      }
      // condition.order = [[sequelize.fn('lower', sequelize.col('m_crop.crop_name')), 'ASC']];

      // condition.order = [(sequelize.col('m_crop->m_crop_group.group_name', 'ASC')), (sequelize.col('m_crop.crop_name', 'ASC'))];
      // const sortOrder = req.body.sort ? req.body.sort : 'id';
      // const sortDirection = req.body.order ? req.body.order : 'DESC';

      // condition.order = [[sortOrder, sortDirection]];
      condition.order = [[sequelize.col('m_crop_group.group_name', 'ASC')]]

      let data = await maxLotSizeModel.findAndCountAll(condition);

      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      console.log(error);
      return response(res, status.DATA_NOT_SAVE, 500, error);
    }
  }


  static getSeedTestingLabDataforReports = async (req, res) => {
    try {
      let { page, pageSize, searchData } = req.body;

      let condition = {
        include: [
          // {
          //   model:designationModel,
          //   attributes:['name']

          // },

          {
            model: districtModel,
            left: false,
            raw: false,
            attributes: ['district_name', 'state_name']
          },
          {
            model: designationModel,
            left: false,
            raw: false,
            // attributes: ['district_name', 'state_name']
          },


        ],
        where: {}
      }
      // if (req.body.page) {
      //   if (page === undefined) page = 1;
      //   if (pageSize === undefined) pageSize = 10;
      //   if (page > 0 && pageSize > 0) {
      //     condition.limit = pageSize;
      //     condition.offset = (page * pageSize) - pageSize;
      //   }
      // }

      if (!searchData?.isReport) {
        if (req.body.page) {
          if (page === undefined) page = 1;
          if (pageSize === undefined) pageSize = 10;
          if (page > 0 && pageSize > 0) {
            condition.limit = pageSize;
            condition.offset = (page * pageSize) - pageSize;
          }
        }
      }
      else
      {
        
      }


      if (searchData && searchData.isSearch === true) {
        if (searchData.state_id) {
          condition.where['state_id'] = searchData.state_id;
        }
        if (searchData.district) {
          condition.where['district_id'] = searchData.district;
        }
      }

      // const sortOrder = req.body.sort ? req.body.sort : 'id';
      // const sortDirection = req.body.order ? req.body.order : 'DESC';

      // condition.order = [[sortOrder, sortDirection]];
      condition.order = [(sequelize.col('m_seed_test_laboratories.lab_name', 'ASC')),
      (sequelize.col('m_seed_test_laboratories.address', 'ASC')),
      (sequelize.col('m_district.state_name', 'ASC')),
      (sequelize.col('m_district.district_name', 'ASC'))
      ];

      const data = await seedLabTestModel.findAndCountAll(condition);

      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      console.log(error);
      return response(res, status.DATA_NOT_SAVE, 500, error);
    }
  }
  static getAddCropCharacterDetails = async (req, res) => {
    let returnResponse = {};
    try {
      let condition = {
        include: [
          // {
          //   model: cropGroupModel,
          //   left: true,
          //   attribute: ['group_name', 'group_code'],
          //   order: [['group_name']]
          // },
          {
            model: cropModel,
            include: [{
              model: cropGroupModel,
              left: true,
              attribute: ['group_name', 'group_code'],
              order: [['group_name']]
            }],
            left: true,
            attribute: ['crop_name'],

          },
        ],

        where: {

        }
      };

      let { page, pageSize, search } = req.body;
      if (page === undefined) page = 1;
      if (pageSize === undefined)
        pageSize = 10; // set pageSize to -1 to prevent sizing

      if (page > 0 && pageSize > 0) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }
      const sortOrder = req.body.sort ? req.body.sort : 'id';
      const sortDirection = req.body.order ? req.body.order : 'DESC';


      // condition.order = [[sortOrder, sortDirection]];
      // condition.order = [['crop_group','ASC'],['crop_name','ASC']];
      condition.order = [(sequelize.col('m_crop.crop_group', 'ASC')), (sequelize.col('m_crop.crop_name', 'ASC'))];
      // condition.order = [[sequelize.col('m_crop.crop_group'),'ASC'],[sequelize.col('m_crop.crop_name'),'ASC'],['variety_name','ASC']];

      if (search) {
        condition.where = {};


        // if (req.body.search.cropGroup) {
        //   condition.where.crop_group_code = (req.body.search.cropGroup);
        // }
        if (req.body.search.crop_group) {
          condition.include[0].where = {};
          condition.include[0].where.group_code = (req.body.search.crop_group);

        }
        if (req.body.search.crop_name) {
          condition.where.crop_code = (req.body.search.crop_name);
        }
        if (req.body.search.variety_name) {
          condition.where.variety_code = (req.body.search.variety_name);
        }
      }

      // condition.order = [ (sequelize.col('m_crop.crop_group','ASC')),(sequelize.col('m_crop.crop_name','ASC'))];

      let data = await cropCharactersticsModel.findAndCountAll(condition);
      // returnResponse = await paginateResponse(data, page, pageSize);

      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      console.log(error);
      return response(res, status.DATA_NOT_SAVE, 500, error);
    }
  }

  static getSeedMultiplicationRatioDataSecond = async (req, res) => {
    let returnResponse = {};
    try {
      // const userId = req.body.loginedUserid.id
      let condition = {
        include: [
          // {
          //   model: cropGroupModel,
          //   left: true,
          //   attribute: ['group_name', 'group_code'],
          //   order: [['group_name']]
          // },
          {
            model: cropModel,
            include: [{
              model: cropGroupModel,
              left: true,
              attribute: ['group_name', 'group_code'],
              // order: [['group_name']]
            }],
            left: true,
            attribute: ['crop_name'],
            // where: {
            //   is_active: 1
            // }

          },
        ],


      };

      // if (userId) {
      //   console.log('audhdata===========', userId);
      //   condition.where.user_id = userId;
      //   // console.log("byee",condition.where.user_id);
      // }

      let { page, pageSize, search } = req.body;
      if (page === undefined) page = 1;
      if (pageSize === undefined)
        pageSize = 10; // set pageSize to -1 to prevent sizing

      if (page > 0 && pageSize > 0) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }
      // const sortOrder = req.body.sort ? req.body.sort : 'id';
      // const sortDirection = req.body.order ? req.body.order : 'DESC';



      // condition.order = [[sortOrder, sortDirection]];
      // condition.order = [['crop_group','ASC'],['crop_name','ASC']];
      // condition.order = [[sequelize.col('m_crop.crop_name'),'ASC']];
      // [sequelize.col('m_crop.crop_group'),'ASC']
      condition.order = [['crop_name', 'ASC']];

      if (search) {
        condition.where = {};


        // if (req.body.search.cropGroup) {
        //   condition.where.crop_group_code = (req.body.search.cropGroup);
        // }
        if (req.body.search.group_code) {
          condition.include[0].where = {};
          condition.include[0].where.group_code = (req.body.search.group_code);
          // condition.include[0].where.is_active = 1;

        }
        if (req.body.search.id) {
          condition.where.id = req.body.search.id;
        }
        // if (req.body.search.user_id) {
        //   condition.where.user_id = req.body.search.user_id;
        // }
        if (req.body.search.crop_name) {
          condition.where.crop_code = (req.body.search.crop_name);
        }
      }

      // condition.order = [ (sequelize.col('m_crop.crop_group','ASC')),(sequelize.col('m_crop.crop_name','ASC'))];

      let data = await seedMultiplicationRatioModel.findAndCountAll(condition);
      // returnResponse = await paginateResponse(data, page, pageSize);

      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      console.log(error);
      return response(res, status.DATA_NOT_SAVE, 500, error);
    }
  }

  static totalIndent = async (req, res) => {
    let data = [];
    try {
      let condition = {}
      if (req.body.search && req.body.search.crop_type) {

        condition = {
          attributes: [
            [sequelize.literal("Sum(indent_quantity)"), "indent_quantity"]
          ],
          where: {
            is_active: 1,
            crop_code: {
              [Op.like]: req.body.search.crop_type + '%'
            }
          }
        };
      } else {
        condition = {
          attributes: [
            [sequelize.literal("Sum(indent_quantity)"), "indent_quantity"]
          ],
          where: {
            is_active: 1,
            // crop_code: {
            //   [Op.like]: req.body.search.crop_type + '%'
            // }
          }
        };
      }
      let data = await indentOfBreederseedModel.findAll(condition);
      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static getTotalLiftedCount = async (req, res) => {
    let data = [];
    try {
      let condition = {}
      if (req.body.search && req.body.search.crop_type) {

        condition = {
          attributes: [
            [sequelize.literal("Sum(lifting_quantity)"), "lifting_quantity"]
          ],
          where: {
            is_active: 1,
            crop_code: {
              [Op.like]: req.body.search.crop_type + '%'
            }
          }
        };
      } else {
        condition = {
          attributes: [
            [sequelize.literal("Sum(lifting_quantity)"), "lifting_quantity"]
          ],
          where: {
            is_active: 1,
            // crop_code: {
            //   [Op.like]: req.body.search.crop_type + '%'
            // }
          }
        };
      }
      let data = await bsp5bModel.findAll(condition);
      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static getIndenterDetails = async (req, res) => {
    let data = {};
    let condition = {};
    try {
      console.log(req.body.loginedUserid.user_type, 'submission-of-indent-of-breeder-seed-by-state-report')
      if (req.body.search && req.body.search.crop_type) {
        if (req.body.loginedUserid.user_type == 'SD') {
          condition = {
            include: [
              {
                model: cropModel,
                attributes: ['id', 'crop_code', 'crop_name'],
                left: true
              },
              {
                model: varietyModel,
                attributes: ['id', 'variety_code', 'variety_name'],
                left: true
              },
              {
                model: bsp5bModel,
                attributes: ['id'],
                left: true
              },
              {
                model: bsp1Model,
                attributes: ['id'],
                left: true
              }
            ],
            // attributes:['*'],
            where: {
              crop_code: {
                [Op.like]: req.body.search.crop_type + '%'
              },
              is_indenter_freeze: 1
            }
          };
        } else {
          condition = {
            include: [
              {
                model: cropModel,
                attributes: ['id', 'crop_code', 'crop_name'],
                left: true
              },
              {
                model: varietyModel,
                attributes: ['id', 'variety_code', 'variety_name'],
                left: true
              },
              {
                model: bsp5bModel,
                attributes: ['id'],
                left: true
              },
              {
                model: bsp1Model,
                attributes: ['id'],
                left: true
              }
            ],
            // attributes:['*'],
            where: {
              crop_code: {
                [Op.like]: req.body.search.crop_type + '%'
              },
              // is_indenter_freeze:1
            }
          };
        }

      } else {
        if (req.body.loginedUserid.user_type == 'SD') {

          condition = {
            include: [
              {
                model: cropModel,
                attributes: ['id', 'crop_code', 'crop_name'],
                left: true
              },
              {
                model: varietyModel,
                attributes: ['id', 'variety_code', 'variety_name'],
                left: true
              },
              {
                model: bsp5bModel,
                attributes: ['id'],
                left: true
              },
              {
                model: bsp1Model,
                attributes: ['id'],
                left: true
              }
            ],
            where: {
              is_indenter_freeze: 1
            }
            // attributes:['*'],
            // where: {
            //   crop_code: {
            //     [Op.like]: req.body.search.crop_type + '%'
            //   }
            // }
          };
        } else {
          condition = {
            include: [
              {
                model: cropModel,
                attributes: ['id', 'crop_code', 'crop_name'],
                left: true
              },
              {
                model: varietyModel,
                attributes: ['id', 'variety_code', 'variety_name'],
                left: true
              },
              {
                model: bsp5bModel,
                attributes: ['id'],
                left: true
              },
              {
                model: bsp1Model,
                attributes: ['id'],
                left: true
              }
            ],

            // attributes:['*'],
            // where: {
            //   crop_code: {
            //     [Op.like]: req.body.search.crop_type + '%'
            //   }
            // }
          };
        }
      }
      const sortOrder = req.body.sort ? req.body.sort : 'year';
      const sortDirection = req.body.order ? req.body.order : 'DESC';
      condition.order = [[sortOrder, sortDirection]];
      if (req.body.search) {
        if (req.body.search.year) {
          condition.where.year = req.body.search.year;
        }
        if (req.body.search.season) {
          condition.where.season = req.body.search.season;
        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = req.body.search.crop_code;
        }
        if (req.body.search.variety) {
          condition.where.variety_id = req.body.search.variety;
        }

      }
      data = await indentOfBreederseedModel.findAll(condition);


      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }


  static getVariety = async (req, res) => {
    let data = {};
    try {
      let condition = {
        include: [
          {
            model: varietyModel,
            attribute: ['id', 'variety_code', 'variety_name']
          }
        ],
        attributes: ['id', 'variety_id'],
        where: {
          crop_code: req.body.search.crop_code,
        }
      };
      const sortOrder = req.body.sort ? req.body.sort : 'variety_name';
      const sortDirection = req.body.order ? req.body.order : 'ASC';
      condition.order = [[sortOrder, sortDirection]];
      data = await indentOfBreederseedModel.findAll(condition);
      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static getChartIndentData = async (req, res) => {
    let data = {};
    try {
      let condition = {}
      let indenterUserId;
      let isFlagFilter;
      let indentOfBreederId;
      if (req.body.search && req.body.search.graphType == "indenter") {
        indenterUserId = { user_id: req.body.loginedUserid.id }
        // isFlagFilter = { is_indenter_freeze: 1 }
        indentOfBreederId = { indent_of_breeder_id: req.body.loginedUserid.id }
      }
      else if (req.body.search && req.body.search.graphType == "nodal") {
        isFlagFilter = { is_freeze: 1 }
      }
      else if (req.body.search && req.body.search.graphType == "seed-division") {
        isFlagFilter = { is_indenter_freeze: 1 }
      } else {
        isFlagFilter = { icar_freeze: 1 }
      }

      if (req.body.search && req.body.search.crop_type) {

        condition = {
          include: [
            {
              model: allocationToIndentor,
              attributes: []
            },
            // {
            //   model: bsp5bModel,
            //   attributes: []
            // },
          ],
          attributes: [
            [sequelize.fn('DISTINCT', sequelize.col('indent_of_breederseeds.crop_name')), 'crop_name'],
            [sequelize.col('indent_of_breederseeds.crop_code'), 'crop_code'],
            [sequelize.literal("Sum(indent_of_breederseeds.indent_quantity)"), "indent_quantity"],
            [sequelize.literal("Sum(allocation_to_indentor_for_lifting_breederseed.quantity)"), "quantity"],
            // [sequelize.literal("Sum(bsp_5_b.lifting_quantity)"), "lifting_quantity"],
          ],
          where: {
            [Op.and]: [
              {
                crop_code: {
                  [Op.like]: req.body.search.crop_type + '%'
                },
              }
            ],
            // icar_freeze: 1
            ...indenterUserId,
            ...isFlagFilter
          },
          order: [['indent_quantity', 'DESC']],
          raw: true
        };
      } else {
        condition = {
          include: [
            {
              model: allocationToIndentor,
              attributes: []
            },
            // {
            //   model: bsp5bModel,
            //   attributes: []
            // },
          ],
          attributes: [
            [sequelize.fn('DISTINCT', sequelize.col('indent_of_breederseeds.crop_name')), 'crop_name'],
            [sequelize.col('indent_of_breederseeds.crop_code'), 'crop_code'],
            [sequelize.literal("Sum(indent_of_breederseeds.indent_quantity)"), "indent_quantity"],
            [sequelize.literal("Sum(allocation_to_indentor_for_lifting_breederseed.quantity)"), "quantity"],
            // [sequelize.literal("Sum(bsp_5_b.lifting_quantity)"), "lifting_quantity"],
          ],
          where: {

            ...indenterUserId,
            ...isFlagFilter
          },
          order: [['indent_quantity', 'DESC']],
          raw: true
        };
      }

      if (req.body.search) {
        if (req.body.search.year) {
          condition.where.year = req.body.search.year
        }
        if (req.body.search.season) {
          condition.where.season = req.body.search.season
        }
        if (req.body.search.crop_code && req.body.search.crop_code != undefined && req.body.search.crop_code.length > 0) {
          condition.where.crop_code = {
            [Op.in]: req.body.search.crop_code
          }
        }
      }
      let page;
      let pageSize;
      if (page === undefined) page = 1;
      if (pageSize === undefined) {
        pageSize = 10;
      }

      if (page > 0 && pageSize > 0) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }
      condition.group = [['crop_name'], [sequelize.col('indent_of_breederseeds.crop_code'), 'crop_code']];
      data = await indentOfBreederseedModel.findAll(condition);

      let cropCodeArray = [];
      data.forEach(ele => {
        if (ele && ele.crop_code) {
          cropCodeArray.push(ele.crop_code);
        }
      });
      let seasonData;
      if (req.body.search.season) {
        seasonData = {
          season: {
            [Op.eq]: req.body.search.season
          }
        };
      }
      let productionData;
      if (cropCodeArray && cropCodeArray.length > 0 && req.body.search && req.body.search.crop_type) {

        productionData = await lotNumberModel.findAll({
          include: [
            {
              model: seedTestingReportsModel,
              attributes: [],
              where: {
                is_report_pass: true
              }
            },
          ],
          attributes: [
            [sequelize.fn('DISTINCT', sequelize.col('lot_number_creations.crop_code')), 'crop_code'],
            [sequelize.literal("Sum(lot_number_creations.lot_number_size)"), "production"],
          ],

          where: {
            [Op.and]: {
              crop_code: {
                [Op.like]: req.body.search.crop_type + '%'
              },

              crop_code: {
                [Op.in]: cropCodeArray
              },
              year: {
                [Op.eq]: req.body.search.year
              },
              ...seasonData
            }
          },
          raw: true,
          group: [[sequelize.col('lot_number_creations.crop_code')]],
        });
      } else if (req.body.search && req.body.search.crop_type) {
        productionData = await lotNumberModel.findAll({
          include: [
            {
              model: seedTestingReportsModel,
              attributes: [],
              where: {
                is_report_pass: true
              }
            },
          ],
          attributes: [
            [sequelize.fn('DISTINCT', sequelize.col('lot_number_creations.crop_code')), 'crop_code'],
            [sequelize.literal("Sum(lot_number_creations.lot_number_size)"), "production"],
          ],

          where: {
            [Op.and]: {
              crop_code: {
                [Op.like]: req.body.search.crop_type + '%'
              },


              year: {
                [Op.eq]: req.body.search.year
              },
              ...seasonData
            }
          },
          raw: true,
          group: [[sequelize.col('lot_number_creations.crop_code')]],
        });
      } else if (cropCodeArray && cropCodeArray.length > 0) {
        productionData = await lotNumberModel.findAll({
          include: [
            {
              model: seedTestingReportsModel,
              attributes: [],
              where: {
                is_report_pass: true
              }
            },
          ],
          attributes: [
            [sequelize.fn('DISTINCT', sequelize.col('lot_number_creations.crop_code')), 'crop_code'],
            [sequelize.literal("Sum(lot_number_creations.lot_number_size)"), "production"],
          ],

          where: {
            [Op.and]: {
              crop_code: {
                [Op.in]: cropCodeArray
              },


              year: {
                [Op.eq]: req.body.search.year
              },
              ...seasonData
            }
          },
          raw: true,
          group: [[sequelize.col('lot_number_creations.crop_code')]],
        });
      }
      else {
        productionData = await lotNumberModel.findAll({
          include: [
            {
              model: seedTestingReportsModel,
              attributes: [],
              where: {
                is_report_pass: true
              }
            },
          ],
          attributes: [
            [sequelize.fn('DISTINCT', sequelize.col('lot_number_creations.crop_code')), 'crop_code'],
            [sequelize.literal("Sum(lot_number_creations.lot_number_size)"), "production"],
          ],

          where: {
            [Op.and]: {



              year: {
                [Op.eq]: req.body.search.year
              },
              ...seasonData
            }
          },
          raw: true,
          group: [[sequelize.col('lot_number_creations.crop_code')]],
        });
      }
      let filterData = [];
      if (req.body.search) {
        if (req.body.search.crop_type) {
          filterData.push({
            crop_code: {
              [Op.like]: req.body.search.crop_type + '%'
            }
          })
        }
        if (req.body.search.year) {
          filterData.push({
            year: {
              [Op.eq]: req.body.search.year
            },
          })

        }
        if (req.body.search.season) {
          filterData.push({
            season: {
              [Op.eq]: req.body.search.season
            }
          });
        }

      }
      if (cropCodeArray && cropCodeArray.length > 0) {
        filterData.push({
          crop_code: {
            [Op.in]: cropCodeArray
          },

        })
      }

      let AllocatedData;
      AllocatedData = await allocationToIndentorSeed.findAll({
        include: [
          {
            model: allocationToIndentorProductionCenterSeed,
            attributes: [],
            where: {
              // is_report_pass: true,
              ...indentOfBreederId
            }
          },
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('allocation_to_indentor_for_lifting_seeds.crop_code')), 'crop_code'],
          [sequelize.literal("Sum(allocation_to_indentor_for_lifting_seed_production_cnters.qty)"), "allocated"],
        ],
        where: {
          [Op.and]: filterData ? filterData : [],


        },
        raw: true,
        group: [[sequelize.col('allocation_to_indentor_for_lifting_seeds.crop_code')]],
      });

      // data.forEach((ele, i) => {
      //   data[i].production = 0
      //   productionData.forEach((elem, index) => {
      //     // console.log('element', ele.crop_code)
      //     if (ele.crop_code == elem.crop_code) {
      //       data[index].production = elem.production
      //     }
      //   })
      // })
      // data.forEach((ele, i) => {
      //   data[i].allocated = 0
      //   AllocatedData.forEach((elem, index) => {
      //     // console.log('element', elem.crop_code)
      //     if (ele.crop_code == elem.crop_code) {

      //       data[index].allocated = elem.allocated ? elem.allocated : 0
      //     }
      //   })
      // })

      productionData.forEach(elem => {

        data.forEach((ele, i) => {
          // console.log(ele,'eleele')
          if (ele.crop_code == elem.crop_code) {
            data[i].production = elem.production
          }

        })
      })

      AllocatedData.forEach(elem => {

        data.forEach((ele, i) => {
          // console.log(ele,'eleele')
          if (ele.crop_code == elem.crop_code) {
            data[i].allocated = elem.allocated ? elem.allocated : 0
          }

        })
      })

      let data1 = await db.bsp5bModel.findAll({
        // include: [
        //   {
        //     model: allocationToIndentorProductionCenterSeed
        //   }
        // ],
        attributes: [
          [sequelize.fn('SUM', sequelize.col('lifting_quantity')), 'total_lifting'],
          [sequelize.col('crop_code'), 'crop_code']
        ],
        group: [
          'crop_code'
          // [sequelize.col('id'), 'id'],
        ],
        where: { [Op.and]: filterData ? filterData : [] },
        raw: true
      }
      );
      data1.forEach(item => {
        data.forEach((elem, i) => {
          if (elem.crop_code == item.crop_code) {
            data[i].total_lifting = item && item.total_lifting ? parseFloat(item.total_lifting) : 0
          }
        })
      })
      // let dataReportArray = data.map(ele=>{
      //   productionData.forEach(item=>{
      //     ele=> ele.crop_code == item.crop_code
      //   })
      // })
      // const mappedArray = productionData.map((element, index) => {
      //   console.log('element.crop_code====',element.crop_code);
      //   const correspondingValue = data[element.crop_code];
      //   // Perform any mapping or transformation logic here
      //   return correspondingValue;
      // });

      // console.log('dataReportArray==========', mappedArray);
      // const matchingElements = data.filter((element) =>
      //  productionData.includes(element));
      // console.log('matchingElements',matchingElements);
      // const combinedArray = [];
      // matchingElements.forEach((element) => {
      //   combinedArray.push(element);
      // });
      // console.log('combinedArray================',combinedArray);
      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static getDashboardItemCount = async (req, res) => {
    let data = [];
    try {
      const { graphType, crop_type } = req.body.search || {};
      let include = [];
      let whereCondition = { is_active: 1 };

      // If oil-seeds, join cropGroupModel and filter group_code
      if (graphType === 'oil-seeds') {
        include.push({
          model: cropGroupModel,
          attributes: [],
          required: true,
          where: { group_code: 'A04' }
        });
      } else if  (graphType === 'pulses-seeds') {
        include.push({
          model: cropGroupModel,
          attributes: [],
          required: true,
          where: { group_code: 'A03' }
        });
      } else if (graphType === 'nodal') {
        whereCondition.crop_code = { [Op.like]: `${crop_type}%` };
      } 

      const cropCount = await cropModel.findOne({
        attributes: [
          [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('crop_code'))), 'total_crop']
        ],
        where: whereCondition,
        include,
        raw: true
      });

      data.push({ total_crop: cropCount.total_crop });

    } catch (error) {
      console.error(error);
      response(res, status.DATA_NOT_AVAILABLE, 500);
    }
    try {
      const { graphType, crop_type } = req.body.search || {};
      const statusCondition = {
        [Op.or]: [
          { status: { [Op.in]: ['hybrid', 'variety'] } },
          { status: null }
        ]
      };

      // Filter by group_code for oil-seeds
      let include = [];
      if (graphType == 'oil-seeds') {
        include.push({
          model: cropModel,
          attributes: [],
          required: true,
          include: [
            {
              model: cropGroupModel,
              attributes: [],
              required: true,
              where: { group_code: 'A04' }
            }
          ]
        }
        );
      } else if (graphType === 'nodal') {
        statusCondition.crop_code = { [Op.like]: `${crop_type}%` };
      }

      const varietyCount = await cropVerietyModel.findAll({
        attributes: ["variety_code"],
        include,
        where: statusCondition,
        raw: true
      });

      data.push({ total_variety: varietyCount.length || 0 });

    } catch (error) {
      console.error(error);
      return response(res, status.DATA_NOT_AVAILABLE, 500);
    }
    try {
      let condition = {
        attributes: [
          [sequelize.literal("COUNT(DISTINCT(username))"), "username"],
        ],
        where: {
          // is_active: 1,
          user_type: 'IN'
        }
      };
      let indenterCount = await userModel.findAll(condition);
      data.push({ "total_indenter": indenterCount[0].dataValues.username });

    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
    try {
      const { graphType, crop_type } = req.body.search || {};
      let whereCondition = {
        is_active: 1,
        user_type: 'BR'
      };

      let include = [];
      if (graphType === 'oil-seeds') {
        include.push({
          model: cropModel,
          attributes: [],
          required: true,
          where: { group_code: 'A04' }
        });
      } else if (graphType === 'nodal') {
        include.push({
          model: cropModel,
          attributes: [],
          required: true,
          where: {
            crop_code: { [Op.like]: `${crop_type}%` },
            breeder_id: { [Op.ne]: null }
          }
        });
      }

      // Just one aggregated result
      let result = await userModel.findAll({
        attributes: ['id'],
        group: ['user.id'],
        where: whereCondition,
        include,
        raw: true
      });
      data.push({ total_icar: result?.length || 0 });

    } catch (error) {
      console.error(error);
      response(res, status.DATA_NOT_AVAILABLE, 500);
    }

    try {
      let condition = {
        attributes: [
          [sequelize.literal("COUNT(DISTINCT(username))"), "username"],
        ],
        where: {
          is_active: 1,
          user_type: 'BPC'
        },

      };
      let BPCCount = await userModel.findAll(condition);

      data.push({ "total_bpc": BPCCount[0].dataValues.username });

    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
    try {
      let condition = {
        attributes: [
          [sequelize.literal("COUNT(DISTINCT(username))"), "username"],
        ],
        where: {
          // is_active: 1,
          user_type: 'SPP'
        },
        raw: true
      };
      let BPCCount = await userModel.findAll(condition);
      data.push({ "total_spp": BPCCount && BPCCount[0] && BPCCount[0].username ? BPCCount[0].username : 0 });

    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }

    try {
      let condition = {
        attributes: [
          [sequelize.literal("COUNT(id)"), "totallab"],
        ],
        where: {
          is_active: 1,
        },
        raw: true
      };

      let totalLab = await db.seedLabTestModel.findAll(condition);
      data.push({ "total_lab": totalLab && totalLab[0] && totalLab[0].totallab ? totalLab[0].totallab : 0 });

    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
    response(res, status.DATA_AVAILABLE, 200, data)
  }

  static findLatestYearAndSeasons = async (req, res) => {
    try {
      const targetSeasons = ['Kharif', 'Rabi'];
      const currentYear = new Date().getFullYear();

      const lastTwoYears = [
        `${currentYear}-${(currentYear + 1).toString().slice(-2)}`,
        `${currentYear - 1}-${currentYear.toString().slice(-2)}`
      ];

      const seasonYears = lastTwoYears.flatMap(year => {
        return targetSeasons.map(season => `${season} ${year}`);
      });

      return response(res, status.DATA_AVAILABLE, 200, seasonYears);
    } catch (error) {
      console.error('Error:', error);
      return response(res, status.DATA_NOT_AVAILABLE, 500, { error: error.message });
    }
  };

  static async indentOfBreederseedFilters(body) {
    const { search, loginedUserid } = body;
    const whereCondition = {};
    if (search?.year) whereCondition.year = search.year;
    if (search?.season) whereCondition.season = search.season;
    if (search?.crop_code) whereCondition.crop_code = search.crop_code;
    if (search?.group_code) whereCondition.group_code = search.group_code;
    if (search?.graphType === 'seed-devision') {
      // whereCondition.is_indenter_freeze = 1;
    } else if (search?.graphType === 'indenter') {
      whereCondition.user_id = loginedUserid.id;
    } else if (search?.graphType === 'nodal') {
      whereCondition.crop_code = { [Op.like]: `${search.crop_type}%` };
      whereCondition.is_freeze = 1;
      whereCondition.is_forward = 1;
    } else if (search?.graphType === 'oil-seeds') {
      whereCondition.group_code = 'A04';
      // whereCondition.is_freeze = 1;
    } else if (search?.graphType === 'bspc') {
      const bspcPerform1Data = await bspProformaOneModel.findOne({
        attributes: ['year', 'season', 'crop_code'],
        include: [
          {
            model: bspProformaOneBspcModel,
            attributes: [],
            // where: { bspc_id: 601 }
            where: { bspc_id: loginedUserid.id }
          }
        ],
        raw: false,
      });
      if (!bspcPerform1Data) return null;

      whereCondition.is_freeze = 1;
      whereCondition.icar_freeze = 1;
      whereCondition.user_id = loginedUserid.id;
      if (bspcPerform1Data?.dataValues?.year) whereCondition.year = bspcPerform1Data?.dataValues.year;
      if (bspcPerform1Data?.dataValues?.season) whereCondition.season = bspcPerform1Data?.dataValues.season;
      if (bspcPerform1Data?.dataValues?.crop_code) whereCondition.crop_code = bspcPerform1Data?.dataValues.crop_code;
    } else if (search?.graphType === 'BR') {
      // PDPc do later
    }
    return whereCondition;
  }

  static async seedProcessingRegisterFilters(body) {
    const { search, loginedUserid } = body;
    const whereCondition = {};
    if (search?.year) whereCondition.year = search.year;
    if (search?.season) whereCondition.season = search.season;
    if (search?.crop_code) whereCondition.crop_code = search.crop_code;
    if (search?.group_code) whereCondition.crop_code = { [Op.like]: `${search.group_code}%` };
    whereCondition.is_active = 1;
    if (search?.graphType === 'indenter') {
      whereCondition.user_id = loginedUserid.id;
    } else if (search?.graphType === 'nodal') {
      whereCondition.crop_code = { [Op.like]: `${search.crop_type}%` };
    } else if (search?.graphType === 'oil-seeds') {
      whereCondition.crop_code = { [Op.like]: `A04%` };
    } else if (search?.graphType === 'bspc') {
      const bspcPerform1Data = await bspProformaOneModel.findOne({
        attributes: ['year', 'season', 'crop_code'],
        include: [
          {
            model: bspProformaOneBspcModel,
            attributes: [],
            where: { bspc_id: loginedUserid.id }
          }
        ],
        raw: false,
      });
      if (!bspcPerform1Data) return null;

      whereCondition.bspc_id = loginedUserid.id;
      if (bspcPerform1Data?.dataValues?.year) whereCondition.year = bspcPerform1Data?.dataValues.year;
      if (bspcPerform1Data?.dataValues?.season) whereCondition.season = bspcPerform1Data?.dataValues.season;
      if (bspcPerform1Data?.dataValues?.crop_code) whereCondition.crop_code = bspcPerform1Data?.dataValues.crop_code;
    } else if (search?.graphType === 'BR') {
      // PDPc do later
    }
    return whereCondition;
  }

  static async allocationToIndentorSeedFilters(body) {
    const { search, loginedUserid } = body;
    const whereCondition = {};
    if (search?.year) whereCondition.year = search.year;
    if (search?.season) whereCondition.season = search.season;
    if (search?.crop_code) whereCondition.crop_code = search.crop_code;
    if (search?.group_code) whereCondition.crop_group_code = search.group_code;
    whereCondition.is_active = 1;
    if (search?.graphType === 'indenter') {
      // whereCondition.indent_of_breeder_id = loginedUserid.id; // in joining table
      // whereCondition.is_freeze = 1;
      // whereCondition.is_variety_submitted = 1;
    } else if (search?.graphType === 'nodal') {
      whereCondition.crop_code = { [Op.like]: `${search.crop_type}%` };
      whereCondition.is_freeze = 1;
      // whereCondition.is_variety_submitted = 1;
    } else if (search?.graphType === 'oil-seeds') {
      whereCondition.crop_group_code = 'A04';
      // whereCondition.is_freeze = 1;
      // whereCondition.is_variety_submitted = 1;
    } else if (search?.graphType === 'bspc') {
      const bspcPerform1Data = await bspProformaOneModel.findOne({
        attributes: ['year', 'season', 'crop_code'],
        include: [
          {
            model: bspProformaOneBspcModel,
            attributes: [],
            where: { bspc_id: loginedUserid.id }
          }
        ],
        raw: false,
      });
      if (!bspcPerform1Data) return null;

      whereCondition.is_freeze = 1;
      whereCondition.is_variety_submitted = 1;
      // whereCondition.indent_of_breeder_id = loginedUserid.id;  // in joining table
      if (bspcPerform1Data?.dataValues?.year) whereCondition.year = bspcPerform1Data?.dataValues.year;
      if (bspcPerform1Data?.dataValues?.season) whereCondition.season = bspcPerform1Data?.dataValues.season;
      if (bspcPerform1Data?.dataValues?.crop_code) whereCondition.crop_code = bspcPerform1Data?.dataValues.crop_code;
    } else if (search?.graphType === 'BR') {
      // PDPc do later
    }
    return whereCondition;
  }

  static async liftingSeedDetailsFilters(body) {
    const { search, loginedUserid } = body;
    const whereCondition = {};
    if (search?.year) whereCondition.year = search.year;
    if (search?.season) whereCondition.season = search.season;
    if (search?.crop_code) whereCondition.crop_code = search.crop_code;
    if (search?.group_code) whereCondition.crop_code = { [Op.like]: `${search.group_code}%` };

    if (search?.graphType === 'indenter') {
      whereCondition.indentor_id = loginedUserid.id
    } else if (search?.graphType === 'nodal') {
      whereCondition.crop_code = { [Op.like]: `${search.crop_type}%` };
    } else if (search?.graphType === 'oil-seeds') {
      whereCondition.crop_code = { [Op.like]: `A04%` };
    } else if (search?.graphType === 'bspc') {
      const bspcPerform1Data = await bspProformaOneModel.findOne({
        attributes: ['year', 'season', 'crop_code'],
        include: [
          {
            model: bspProformaOneBspcModel,
            attributes: [],
            where: { bspc_id: loginedUserid.id }
          }
        ],
        raw: false,
      });
      if (!bspcPerform1Data) return null;

      whereCondition.user_id = loginedUserid.id;
      if (bspcPerform1Data?.dataValues?.year) whereCondition.year = bspcPerform1Data?.dataValues.year;
      if (bspcPerform1Data?.dataValues?.season) whereCondition.season = bspcPerform1Data?.dataValues.season;
      if (bspcPerform1Data?.dataValues?.crop_code) whereCondition.crop_code = bspcPerform1Data?.dataValues.crop_code;
    } else if (search?.graphType === 'BR') {
      // PDPc do later
    }
    return whereCondition;
  }

  static getChartIndentCropWise = async (req, res) => {
    try {
      const { search, loginedUserid } = req.body;
      const dummyData = {
        crop_code: null,
        crop_name: null,
        total_indent_quantity: 0,
        total_produced_quantity: 0,
        total_allocate_quantity: 0,
        total_lifted_quantity: 0,
      };
      if (search?.graphType === 'nodal' && !search.crop_type) {
        return response(res, 'Crop Type is required', 400, null);
      }

      // Fetch filters
      const [indentOfBreederseedFilter, seedProcessingRegisterFilter, allocationToIndentorSeedFilter, liftingSeedDetailsFilter] =
        await Promise.all([
          this.indentOfBreederseedFilters(req.body),
          this.seedProcessingRegisterFilters(req.body),
          this.allocationToIndentorSeedFilters(req.body),
          this.liftingSeedDetailsFilters(req.body),
        ]);

      if (!indentOfBreederseedFilter || !seedProcessingRegisterFilter || !allocationToIndentorSeedFilter || !liftingSeedDetailsFilter) {
        return response(res, status.DATA_AVAILABLE, 200, dummyData);
      }

      const allocationToIndentorProductionCenterSeedWhere = {};
      if (['bspc', 'indenter'].includes(search?.graphType)) {
        allocationToIndentorProductionCenterSeedWhere.indent_of_breeder_id = loginedUserid.id;
      }

      // Fetch raw data
      const [indentDataRaw, produceDataRaw, allocatedDataRaw, liftingDataRaw] = await Promise.all([
        indentOfBreederseedModel.findAll({
          attributes: ['crop_code', 'indent_quantity'],
          where: indentOfBreederseedFilter,
          raw: true
        }),
        seedProcessingRegisterModel.findAll({
          attributes: ['crop_code', 'total_processed_qty'],
          where: seedProcessingRegisterFilter,
          raw: true
        }),
        allocationToIndentorSeed.findAll({
          attributes: ['crop_code', [sequelize.col('allocation_to_indentor_for_lifting_seed_production_cnters.allocated_quantity'), 'total_allocate_quantity']],
          where: allocationToIndentorSeedFilter,
          include: [
            {
              model: allocationToIndentorProductionCenterSeed,
              attributes: [], ...(Object.keys(allocationToIndentorProductionCenterSeedWhere).length ? { where: allocationToIndentorProductionCenterSeedWhere } : {})
            }
          ],
          raw: true,
        }),
        liftingSeedDetailsModel.findAll({ attributes: ['crop_code', 'no_of_bag', 'bag_weight'], where: liftingSeedDetailsFilter, raw: true }),
      ]);

      // Utility to sum up quantities with optional conversion
      const sumQuantities = (rows, qtyKey, conversionFn = (c, q) => q) => {
        return rows.reduce((map, row) => {
          const quantity = conversionFn(row.crop_code, Number(row[qtyKey]) || 0);
          map[row.crop_code] = (map[row.crop_code] || 0) + quantity;
          return map;
        }, {});
      };
      const maybeConvert = (code, qty) => code.startsWith('H') ? qty / 100 : qty;

      // Reduce all data
      const indentData = sumQuantities(indentDataRaw, 'indent_quantity', maybeConvert);
      const produceData = sumQuantities(produceDataRaw, 'total_processed_qty', maybeConvert);
      const allocatedData = sumQuantities(allocatedDataRaw, 'total_allocate_quantity', maybeConvert);
      const liftingData = liftingDataRaw.reduce((map, row) => {
        let total = Number(row.no_of_bag) * Number(row.bag_weight);
        // total = maybeConvert(row.crop_code, total);
        total = total / 100;
        map[row.crop_code] = (map[row.crop_code] || 0) + total;
        return map;
      }, {});

      // Gather all crop codes
      const allCropCodes = new Set([...Object.keys(indentData), ...Object.keys(produceData), ...Object.keys(allocatedData), ...Object.keys(liftingData)]);
      if (!allCropCodes.size) return response(res, status.DATA_AVAILABLE, 200, dummyData);

      // Fetch crop names
      const crops = await cropModel.findAll({ attributes: ['crop_code', 'crop_name'], where: { crop_code: Array.from(allCropCodes) }, raw: true });
      const cropNameMap = crops.reduce((map, c) => { map[c.crop_code] = c.crop_name; return map; }, {});

      // Build final response
      const finalDataWithNames = Array.from(allCropCodes).map((code) => ({
        crop_code: code,
        crop_name: cropNameMap[code] || null,
        total_indent_quantity: indentData[code] || 0,
        total_produced_quantity: produceData[code] || 0,
        total_allocate_quantity: allocatedData[code] || 0,
        total_lifted_quantity: liftingData[code] || 0,
      }));

      // Sort by total_indent_quantity in descending order
      finalDataWithNames.sort((a, b) => b.total_indent_quantity - a.total_indent_quantity);
      return response(res, status.DATA_AVAILABLE, 200, finalDataWithNames.length ? finalDataWithNames : dummyData);
    } catch (error) {
      console.error('Error in getChartIndentData:', error);
      return response(res, status.DATA_NOT_AVAILABLE, 500, { error: error.message });
    }
  };

  static getChartIndentCropWiseCropList = async (req, res) => {
    try {
      const { search, loginedUserid } = req.body;
      const dummyData = {
        crop_code: null,
        crop_name: null,
      };
      if (search?.graphType === 'nodal' && !search.crop_type) {
        return response(res, 'Crop Type is required', 400, null);
      }

      // Fetch filters
      const [indentOfBreederseedFilter, seedProcessingRegisterFilter, allocationToIndentorSeedFilter, liftingSeedDetailsFilter] =
        await Promise.all([
          this.indentOfBreederseedFilters(req.body),
          this.seedProcessingRegisterFilters(req.body),
          this.allocationToIndentorSeedFilters(req.body),
          this.liftingSeedDetailsFilters(req.body),
        ]);

      if (!indentOfBreederseedFilter || !seedProcessingRegisterFilter || !allocationToIndentorSeedFilter || !liftingSeedDetailsFilter) {
        return response(res, status.DATA_AVAILABLE, 200, dummyData);
      }

      const allocationToIndentorProductionCenterSeedWhere = {};
      if (['bspc', 'indenter'].includes(search?.graphType)) {
        allocationToIndentorProductionCenterSeedWhere.indent_of_breeder_id = loginedUserid.id;
      }

      // Fetch raw data
      const [indentData, produceData, allocatedData, liftingData] = await Promise.all([
        indentOfBreederseedModel.findAll({
          attributes: ['crop_code'],
          where: indentOfBreederseedFilter,
          raw: true
        }),
        seedProcessingRegisterModel.findAll({
          attributes: ['crop_code'],
          where: seedProcessingRegisterFilter,
          raw: true
        }),
        allocationToIndentorSeed.findAll({
          attributes: ['crop_code'],
          where: allocationToIndentorSeedFilter,
          include: [
            {
              model: allocationToIndentorProductionCenterSeed,
              attributes: [], ...(Object.keys(allocationToIndentorProductionCenterSeedWhere).length ? { where: allocationToIndentorProductionCenterSeedWhere } : {})
            }
          ],
          raw: true,
        }),
        liftingSeedDetailsModel.findAll({
          attributes: ['crop_code'],
          where: liftingSeedDetailsFilter,
          raw: true
        }),
      ]);

      const allCropCodes = Array.from(new Set([
        ...indentData.map(item => item.crop_code),
        ...produceData.map(item => item.crop_code),
        ...allocatedData.map(item => item.crop_code),
        ...liftingData.map(item => item.crop_code),
      ]));

      // If no crop codes found, return dummy
      if (!allCropCodes.length) return response(res, status.DATA_AVAILABLE, 200, dummyData);

      // Fetch crop names
      const crops = await cropModel.findAll({
        attributes: ['crop_code', 'crop_name'],
        where: { crop_code: allCropCodes },
        raw: true,
      });

      // Return array of { crop_code, crop_name }
      return response(res, status.DATA_AVAILABLE, 200, crops.length ? crops : dummyData);
    } catch (error) {
      console.error('Error in getChartIndentData:', error);
      return response(res, status.DATA_NOT_AVAILABLE, 500, { error: error.message });
    }
  };

  static getChartIndentCropToVarietieWise = async (req, res) => {
    try {
      const { search, loginedUserid } = req.body;
      const dummyData = {
        variety_code: null,
        variety_name: null,
        total_indent_quantity: 0,
        total_produced_quantity: 0,
        total_allocate_quantity: 0,
        total_lifted_quantity: 0,
      };
      if (!search?.crop_code) {
        return response(res, 'Crop code is required', 400, null);
      }

      if (search?.graphType === 'nodal' && !search.crop_type) {
        return response(res, 'Crop Type is required', 400, null);
      }

      // Fetch filters
      const [indentOfBreederseedFilter, seedProcessingRegisterFilter, allocationToIndentorSeedFilter, liftingSeedDetailsFilter] =
        await Promise.all([
          this.indentOfBreederseedFilters(req.body),
          this.seedProcessingRegisterFilters(req.body),
          this.allocationToIndentorSeedFilters(req.body),
          this.liftingSeedDetailsFilters(req.body),
        ]);

      if (!indentOfBreederseedFilter || !seedProcessingRegisterFilter || !allocationToIndentorSeedFilter || !liftingSeedDetailsFilter) {
        return response(res, status.DATA_AVAILABLE, 200, dummyData);
      }

      const allocationToIndentorProductionCenterSeedWhere = {};
      if (['bspc', 'indenter'].includes(search?.graphType)) {
        allocationToIndentorProductionCenterSeedWhere.indent_of_breeder_id = loginedUserid.id;
      }

      // Fetch raw data
      const [indentDataRaw, produceDataRaw, allocatedDataRaw, liftingDataRaw] = await Promise.all([
        indentOfBreederseedModel.findAll({
          attributes: ['indent_quantity', [sequelize.col('m_crop_variety.variety_code'), 'variety_code']],
          where: indentOfBreederseedFilter,
          include: [
            {
              model: varietyModel,
              attributes: []
            }
          ],
          raw: true
        }),
        seedProcessingRegisterModel.findAll({
          attributes: ['variety_code', 'total_processed_qty'],
          where: seedProcessingRegisterFilter,
          raw: true
        }),
        allocationToIndentorSeed.findAll({
          attributes: ['variety_code', [sequelize.col('allocation_to_indentor_for_lifting_seed_production_cnters.allocated_quantity'), 'total_allocate_quantity'],
            [sequelize.col('m_crop_variety.variety_code'), 'variety_code']
          ],
          where: allocationToIndentorSeedFilter,
          include: [
            {
              model: allocationToIndentorProductionCenterSeed,
              attributes: [], ...(Object.keys(allocationToIndentorProductionCenterSeedWhere).length ? { where: allocationToIndentorProductionCenterSeedWhere } : {})
            },
            {
              model: varietyModel,
              attributes: []
            }
          ],
          raw: true,
        }),
        liftingSeedDetailsModel.findAll({ attributes: ['variety_code', 'no_of_bag', 'bag_weight'], where: liftingSeedDetailsFilter, raw: true }),
      ]);

      // Utility to sum up quantities with optional conversion
      const sumQuantities = (rows, qtyKey, conversionFn = (c, q) => q) => {
        return rows.reduce((map, row) => {
          const quantity = conversionFn(row.variety_code, Number(row[qtyKey]) || 0);
          map[row.variety_code] = (map[row.variety_code] || 0) + quantity;
          return map;
        }, {});
      };

      // Reduce all data
      const indentData = sumQuantities(indentDataRaw, 'indent_quantity');
      const produceData = sumQuantities(produceDataRaw, 'total_processed_qty');
      const allocatedData = sumQuantities(allocatedDataRaw, 'total_allocate_quantity');

      const liftingData = liftingDataRaw.reduce((map, row) => {
        let total = Number(row.no_of_bag) * Number(row.bag_weight);
        map[row.variety_code] = (map[row.variety_code] || 0) + total;
        return map;
      }, {});

      // Gather all crop codes
      const allVarietyCodes = new Set([...Object.keys(indentData), ...Object.keys(produceData), ...Object.keys(allocatedData), ...Object.keys(liftingData)]);
      if (!allVarietyCodes.size) return response(res, status.DATA_AVAILABLE, 200, dummyData);

      // Fetch crop names
      const varietys = await varietyModel.findAll({ attributes: ['variety_code', 'variety_name'], where: { variety_code: Array.from(allVarietyCodes) }, raw: true });
      const varietyNameMap = varietys.reduce((map, c) => { map[c.variety_code] = c.variety_name; return map; }, {});

      // Build final response
      let finalDataWithNames = Array.from(allVarietyCodes).map((code) => {
        const convert = (val) => search.crop_code.startsWith('H') ? val / 100 : val;
        return {
          variety_code: code,
          variety_name: varietyNameMap[code] || null,
          total_indent_quantity: convert(indentData[code] || 0),
          total_produced_quantity: convert(produceData[code] || 0),
          total_allocate_quantity: convert(allocatedData[code] || 0),
          total_lifted_quantity: liftingData[code] / 100 || 0,
        };
      });

      // Sort by total_indent_quantity in descending order
      finalDataWithNames.sort((a, b) => b.total_indent_quantity - a.total_indent_quantity);
      return response(res, status.DATA_AVAILABLE, 200, finalDataWithNames.length ? finalDataWithNames : dummyData);
    } catch (error) {
      console.error('Error in getChartIndentData:', error);
      return response(res, status.DATA_NOT_AVAILABLE, 500, { error: error.message });
    }
  };

  static getChartIndentDataVariety = async (req, res) => {
    let data = {};
    try {
      // let filterData = [{ icar_freeze: 1 }];
      let filterData = [];
      let indenterUserId;
      let isFlagFilter;
      let indentOfBreederId;
      if (req.body.search && req.body.search.graphType == "indenter") {
        indenterUserId = { user_id: req.body.loginedUserid.id }
        // isFlagFilter = { is_indenter_freeze: 1 }
        indentOfBreederId = { indent_of_breeder_id: req.body.loginedUserid.id }
      }
      // else if (req.body.search && req.body.search.graphType == "nodal") 
      // {
      //   indenterUserId = { user_id: req.body.loginedUserid.id }
      //   isFlagFilter = { is_indenter_freeze: 1 }
      //   filterData = [{ is_indenter_freeze: 1 }]
      // }
      else if (req.body.search && req.body.search.graphType == "nodal") {
        isFlagFilter = { is_freeze: 1 }
        filterData = [{ is_freeze: 1 }]
      }
      else if (req.body.search && req.body.search.graphType == "seed-division") {
        isFlagFilter = { is_indenter_freeze: 1 }
        filterData = [{ is_indenter_freeze: 1 }]
      } else {
        isFlagFilter = { icar_freeze: 1 }
        filterData = [{ icar_freeze: 1 }]
      }
      if (req.body.search && req.body.search.crop_type) {
        filterData.push({
          crop_code: {
            [Op.like]: req.body.search.crop_type + '%'
          },
        })
      }

      let condition = {
        include: [
          {
            model: allocationToIndentor,
            attributes: []
          },
          // {
          //   model: bsp5bModel,
          //   attributes: []
          // },
          {
            model: varietyModel,
            attributes: []
          },
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('indent_of_breederseeds.variety_id')), 'variety_id'],
          // [sequelize.fn('DISTINCT', ), 'crop_code'],
          // [sequelize.col('indent_of_breederseeds.crop_code'),'crop_code'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [sequelize.fn('SUM', sequelize.col('indent_of_breederseeds.indent_quantity')), 'indent_quantity'],
          [sequelize.fn('SUM', sequelize.col('allocation_to_indentor_for_lifting_breederseed.quantity')), 'quantity'],
          // [sequelize.fn('SUM', sequelize.col('bsp_5_b.lifting_quantity')), 'lifting_quantity'],
        ],

        where: {
          [Op.and]: filterData ? filterData : [], ...indenterUserId,
          // ...isFlagFilter,

        },
        // where: {
        //   [Op.and]: [{
        //     crop_code: {
        //       [Op.like]: req.body.search.crop_type + '%'
        //     },
        //     icar_freeze: 1
        //   }
        //   ]

        // },
        raw: true
      };
      let seasonData;
      if (req.body.search.season) {
        seasonData = {
          season: {
            [Op.eq]: req.body.search.season
          }
        };
      }
      if (req.body.search) {
        if (req.body.search.year) {
          condition.where.year = req.body.search.year
        }
        if (req.body.search.season) {
          condition.where.season = req.body.search.season
        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = req.body.search.crop_code
        }
        // if (req.body.search.crop_code && req.body.search.crop_code !== undefined && req.body.search.crop_code.length > 0) {
        //   condition.where.crop_code = {
        //     [Op.in]: (req.body.search.crop_code)
        //   };
        // }
      }
      condition.group = [
        [sequelize.col('indent_of_breederseeds.variety_id'), 'variety_id'],
        [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
      ];
      data = await indentOfBreederseedModel.findAll(condition);

      let filterData1 = [];
      if (req.body && req.body.search) {
        if (req.body.search.crop_type) {
          filterData1.push({
            crop_code: {
              [Op.like]: req.body.search.crop_type + '%'
            }
          })
        }
        // if (req.body.search.crop_code && req.body.search.crop_code !== undefined && req.body.search.crop_code.length > 0) {
        //   filterData1.push({
        //     crop_code: {
        //       [Op.in]: (req.body.search.crop_code)
        //     }
        //   })
        // }
        if (req.body.search.crop_code) {
          filterData1.push({
            crop_code: {
              [Op.eq]: (req.body.search.crop_code)
            }
          })
        }
        if (req.body.search.year) {
          filterData1.push({
            year: {
              [Op.eq]: req.body.search.year
            }
          })
        }
        if (req.body.search.season) {

          filterData1.push({
            season: {
              [Op.eq]: req.body.search.season
            }
          })
        }
      }
      let varietyArr = [];
      if (data && data.length > 0) {

        data.forEach(ele => {
          varietyArr.push(ele && ele.variety_id ? ele.variety_id : '')
        })
      }
      let liftedData;
      if (varietyArr && varietyArr.length > 0) {

        liftedData = await bsp5bModel.findAll({
          attributes: [
            [sequelize.fn('DISTINCT', sequelize.col('bsp_5_b.variety_id')), 'variety_id'],
            // [sequelize.col('indent_of_breederseeds.crop_code'), 'crop_code'],
            [sequelize.literal("Sum(bsp_5_b.lifting_quantity)"), "total_lifting"]
          ],
          group: [
            [sequelize.col('bsp_5_b.variety_id'), 'variety_id']
          ],
          where: {
            // ... filterData1,
            [Op.and]: filterData1 ? filterData1 : [],
            // variety_id: {
            //   [Op.in]: varietyArr
            // }
          },

          // where: {
          //   ...filterData1,

          //  [Op.and]:filterData1 ? filterData1 :[],
          //  ...varietyArr

          // [Op.in]:variety_id :varietyArr
          // },
          raw: true,

        })
      }
      else {
        liftedData = await bsp5bModel.findAll({
          where: {
            [Op.and]: filterData1 ? filterData1 : [],
            // ...varietyArr
          },
          raw: true,

        })
      }

      let productionData = await lotNumberModel.findAll({
        include: [
          {
            model: seedTestingReportsModel,
            attributes: [],
            where: {
              is_report_pass: true
            }
          },
          // {
          //   model: bsp5bModel,
          //   attributes: []
          // },
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('lot_number_creations.variety_id')), 'variety_id'],
          // [sequelize.col('indent_of_breederseeds.crop_code'), 'crop_code'],
          [sequelize.literal("Sum(lot_number_creations.lot_number_size)"), "production"]
          // [sequelize.literal("Sum(allocation_to_indentor_for_lifting_breederseed.quantity)"), "quantity"],
          // [sequelize.literal("Sum(bsp_5_b.lifting_quantity)"), "lifting_quantity"],
        ],
        where: { [Op.and]: filterData1 ? filterData1 : [] },
        raw: true,
        group: [[sequelize.col('lot_number_creations.variety_id')]],
        // order:[['indent_quantity', 'DESC']]
      });

      let AllocatedData = await allocationToIndentorSeed.findAll({
        include: [
          {
            model: allocationToIndentorProductionCenterSeed,
            attributes: [],
            where: {
              // is_report_pass: true
              ...indentOfBreederId
            }
          },
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('allocation_to_indentor_for_lifting_seeds.crop_code')), 'crop_code'],
          // [sequelize.fn('DISTINCT', sequelize.col('allocation_to_indentor_for_lifting_seeds.variety_id')), 'crop_code'],
          [sequelize.col('allocation_to_indentor_for_lifting_seeds.variety_id'), 'variety_id'],
          [sequelize.literal("Sum(allocation_to_indentor_for_lifting_seed_production_cnters.qty)"), "allocated"],
        ],
        // where: {
        //   [Op.and]: {
        //     crop_code: {
        //       [Op.like]: req.body.search.crop_type + '%'
        //     },
        //     crop_code: {
        //       [Op.eq]: req.body.search.crop_code
        //     },
        //     year: {
        //       [Op.eq]: req.body.search.year
        //     },
        //     ...seasonData
        //   }
        // },
        where: { [Op.and]: filterData1 ? filterData1 : [] },
        raw: true,
        group: [[sequelize.col('allocation_to_indentor_for_lifting_seeds.crop_code')],
        [sequelize.col('allocation_to_indentor_for_lifting_seeds.variety_id')]
        ],
      });

      productionData.forEach(elem => {
        data.forEach((ele, i) => {
          if (ele.variety_id == elem.variety_id) {
            data[i].production = elem.production ? elem.production : '0'
          }

        })
      })

      // console.log('mergedArraymergedArray',mergedArray)
      AllocatedData.forEach(elem => {
        data.forEach((ele, i) => {
          if (ele.variety_id == elem.variety_id) {
            // console.log('hiii')
            data[i].allocated = elem.allocated ? elem.allocated : 0
          }

        })

      })


      if (liftedData && liftedData.length > 0) {
        liftedData.forEach(item => {
          data.forEach((elem, i) => {
            if (elem.variety_id == item.variety_id) {
              data[i].lifting_qty = item && item.total_lifting ? parseFloat(item.total_lifting) : 0
            }
          })

        })
      }

      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static getChartDataByCrop = async (req, res) => {
    let data = {};
    try {
      let condition = {
        include: [
          {
            model: allocationToIndentor,
            attributes: []
          },
          {
            model: varietyModel,
            attributes: []
          },
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('m_crop_variety.variety_name')), 'variety_name'],
          [sequelize.literal("Sum(indent_of_breederseeds.indent_quantity)"), "indent_quantity"],
          [sequelize.literal("Sum(allocation_to_indentor_for_lifting_breederseed.quantity)"), "quantity"]
        ],
        where: {
          crop_code: {
            [Op.like]: req.body.search.crop_type + '%'
          }
        }
      };
      if (req.body.search) {
        if (req.body.search.year) {
          condition.where.year = req.body.search.year
        }
        if (req.body.search.season) {
          condition.where.season = req.body.search.season
        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = req.body.search.crop_code
        }
      }
      condition.group = [['indent_of_breederseeds.crop_name'], ['m_crop_variety.variety_name']];
      data = await indentOfBreederseedModel.findAll(condition);
      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static getCropCharactersticsWithId = async (req, res) => {
    try {

      
      // let { page, pageSize, search } = req.body;
      let condition = {}
      if (req.body.search.view) {
        condition = {
          include: [
            {
              model: cropModel,
              left: true,
              include: [
                {
                  model: cropGroupModel
                }
              ],
              // attributes: ['crop_name']
            },
            {
              model: cropCharactersticsModel,
              include: [
                {
                  model: db.mCharactersticAgroRegionMappingModel,
                  attributes: ['is_checked', 'region_id'],
                  as: 'regions',
                  // include: [
                  //   {
                  //     model: db.varietyCategoryModel,
                  //     attributes: ['category'],
                  //     require: true
                  //   },
                  // ],
                }
              ]
            },
          ],
          where: {}
        }
      }
      else {
        condition = {
          include: [
            {
              model: cropModel,
              where: {
                is_active: 1
              },
              left: true,
              include: [
                {
                  model: cropGroupModel
                }
              ],
              // attributes: ['crop_name']
            },
            {
              model: cropCharactersticsModel
            },
            // {
            //   model: db.mCharactersticAgroRegionMappingModel,
            //   attributes: ['is_checked','region_id'],
            //   as: 'regions',
            //   // include: [
            //   //   {
            //   //     model: db.varietyCategoryModel,
            //   //     attributes: ['category'],
            //   //     require: true
            //   //   },
            //   // ],
            //   left:true
            // },

          ],
          // nest:true,
          where: {}
        }
      }


      // if (page === undefined) page = 1;
      // if (pageSize === undefined) pageSize = 10;

      // if (page > 0 && pageSize > 0) {
      //   condition.limit = pageSize;
      //   condition.offset = (page * pageSize) - pageSize;
      // }

      // const sortOrder = req.body.sort ? req.body.sort : 'id';
      // const sortDirection = req.body.order ? req.body.order : 'DESC';

      // condition.order = [[sortOrder, sortDirection]];

      const isNumericId = /^\d+$/.test(req.params.id);

      if (req.params.id) {
        if (isNumericId) {
          condition.where.id = parseInt(req.params.id); // safely use as number
        } else {
          condition.where.variety_code = req.params.id; // use different field (e.g. variety_code)
        }
      }
      // if (req.params.id) {
      //   if (req.params.id) {
      //     condition.where.id = req.params.id
      //   }

      //   // if (search.crop_code) {
      //   //   condition.where['crop_code'] = search.crop_code
      //   // }
      // }

      const data = await cropVerietyModel.findAll(condition);
      console.log('datadata=====', data);
      if (!data) {
        return response(res, status.DATA_NOT_AVAILABLE, 404);
      }

      return response(res, status.DATA_AVAILABLE, 200, data);
    }
    catch (error) {
      const returnResponse = {
        message: error.message,
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }


  static getLabDistrictNameData = async (req, res) => {
    let returnResponse = {};
    try {
      let rules = {
        'state_id': 'string',
      };

      let validation = new Validator(req.body, rules);

      const isValidData = validation.passes();

      if (!isValidData) {
        let errorResponse = {};
        for (let key in rules) {
          const error = validation.errors.get(key);
          if (error.length) {
            errorResponse[key] = error;
          }
        }
        return response(res, status.BAD_REQUEST, 400, errorResponse, internalCall)
      }

      let condition = {
        include: [

          {
            model: districtModel,
            attributes: [],
            // attributes: [[sequelize.fn('DISTINCT', sequelize.col('state_code')), 'state_code']],
            left: true,
            raw: true,
            // group:[ sequelize.col('district_code')]


          },

        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('m_district.district_code')), 'district_code'],
          [sequelize.col('m_district.district_name'), 'district_name'],
        ],

        where: {},
        raw: true
      };
      if (req.body.search) {

        if (req.body.search.state_code) {

          condition.where.state_id = (req.body.search.state_code);
        }


      }
      // let { page, pageSize } = req.body;
      // if (page === undefined) page = 1;
      // if (pageSize === undefined) {
      //   // pageSize = 10;
      // } // set pageSize to -1 to prevent sizing

      // if (page > 0 && pageSize > 0) {
      //   condition.limit = pageSize;
      //   condition.offset = (page * pageSize) - pageSize;
      // }
      condition.order = [[sequelize.col('m_district.district_name'), 'ASC']];
      const data = await seedLabTestModel.findAndCountAll(condition);
      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, data);
      }
      if (!data) {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    } catch (error) {
      console.log(error)
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }



  // ------------//
  static checkAlreadyExistsSeedMultiplicationRatioDataSecond = async (req, res) => {
    const { internalCall } = req.body;
    let returnResponse = {};

    try {
      let rules = {
        'search.crop_code': 'string',
        'search.user_id': 'integer'
      };
      let validation = new Validator(req.body, rules);

      const isValidData = validation.passes();

      if (!isValidData) {
        let errorResponse = {};
        for (let key in rules) {
          const error = validation.errors.get(key);
          if (error.length) {
            errorResponse[key] = error;
          }
        }
        return response(res, status.BAD_REQUEST, 400, errorResponse, internalCall)
      }

      // console.log('nucleusSeed',req.body.nucleusSeed.crop_name)
      let cropCode = [];
      let userId = [];
      if (req.body !== undefined
        && req.body.nucleusSeed !== undefined
        && req.body.nucleusSeed.length > 0) {
        // console.log(req.body.nucleusSeed)
        // tabledExtracted = true;

        for (let index = 0; index < req.body.nucleusSeed.length; index++) {
          const element = req.body.nucleusSeed[index];
          cropCode.push(element.crop_code)

          console.log(cropCode, 'crop_code')
          // if ((element.crop_code)) {
          //   for(let i =0; i<cropCode.length;i++){

          //     condition.where.crop_code = [cropCode]
          //   }

          // }


        }

      }
      let condition = {
        where: {

          crop_code: cropCode,
          // user_id:req./
        }

      }
      // if (req.body !== undefined
      //   && req.body.nucleusSeed !== undefined
      //   && req.body.nucleusSeed.length > 0) {
      //     // console.log(req.body.nucleusSeed)
      //   // tabledExtracted = true;
      //   let cropCode =[];
      //   for (let index = 0; index < req.body.nucleusSeed.length; index++) {
      //     const element = req.body.nucleusSeed[index];
      //     cropCode.push(element.crop_code)
      //     console.log(cropCode,'crop_code')
      //     if ((element.crop_code)) {
      //       for(let i =0; i<cropCode.length;i++){

      //         condition.where.crop_code = [cropCode]
      //       }

      //     }


      //   }

      // }

      let checkdata = await seedMultiplicationRatioModel.findAndCountAll(condition);
      if ((checkdata.count && checkdata.count > 0)) {
        // console.log('checkdata====1', checkdata);
        const errorResponse = {
          inValid: true
        }
        return response(res, status.USER_EXISTS, 409, errorResponse)
      }
      else {
        // console.log('checkdata====2', checkdata);
        const errorResponse = {
          inValid: false
        }
        return response(res, status.OK, 200, errorResponse, internalCall);
      }
      // if (req.body.search) {
      //   if (req.body.search.year) {
      //     condition.where.year = (req.body.search.year);
      //   }
      //   if ((req.body.search.crop_code) && (req.body.search.user_id)) {
      //     if (req.body.search.crop_code) {
      //       condition.where.crop_group_code = (req.body.search.crop_code);
      //     }
      //     if (req.body.search.user_id) {
      //       condition.where.user_id = parseInt(req.body.search.user_id);
      //     }
      //   }
      //   // if (req.body.search.variety_code) {
      //   //   condition.where.variety_code = (req.body.search.variety_code);
      //   // }
      // }

      // console.log('checkdata======0', checkdata);


    } catch (error) {
      returnResponse = {
        message: error.message
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }

  }
  static getCordinatorDistrict = async (req, res) => {
    let returnResponse = {};
    try {
      let rules = {
        'state_id': 'string',
      };

      let validation = new Validator(req.body, rules);

      const isValidData = validation.passes();

      if (!isValidData) {
        let errorResponse = {};
        for (let key in rules) {
          const error = validation.errors.get(key);
          if (error.length) {
            errorResponse[key] = error;
          }
        }
        return response(res, status.BAD_REQUEST, 400, errorResponse, internalCall)
      }

      let condition = {
        include: [
          {
            model: userModel,
            attributes: [],
            where: {
              'user_type': 'BR'
              // user_type: 'breeder'
              // created_by:2
            }
          },

          {
            model: districtModel,
            attributes: [],
            left: false,
            raw: false
          },

          // [sequelize.fn('DISTINCT', sequelize.col('m_district.district_code')) ,'district_code'],
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('m_district.district_code')), 'district_code'],
          sequelize.col('m_district.district_name')
        ],
        raw: true,
        where: {
          // user_type: 'breeder'
          //  crea
        }
      };
      if (req.body.search) {
        if (req.body.search.state_code) {
          condition.where.state_id = (req.body.search.state_code);
        }
      }
      // let { page, pageSize } = req.body;
      // if (page === undefined) page = 1;
      // if (pageSize === undefined) {
      //   // pageSize = 10;
      // } // set pageSize to -1 to prevent sizing

      // if (page > 0 && pageSize > 0) {
      //   condition.limit = pageSize;
      //   condition.offset = (page * pageSize) - pageSize;
      // }
      condition.order = [[sequelize.col('m_district.district_name'), 'ASC']];
      const data = await agencyDetailModel.findAndCountAll(condition);
      if (data) {
        return response(res, status.DATA_AVAILABLE, 200, data);
      }
      if (!data) {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    } catch (error) {
      console.log(error)
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }

  static getChartAllIndentor = async (req, res) => {
    let data = {};
    try {
      let condition = {}
      let condition2 = {}
      let isFlagFilter;
      if (req.body.search && req.body.search.graphType == "indenter") {
        indenterUserId = { user_id: req.body.loginedUserid.id }
        isFlagFilter = { is_indenter_freeze: 1 }
      }
      else if (req.body.search && req.body.search.graphType == "nodal") {
        isFlagFilter = { is_freeze: 1 }
      }
      else if (req.body.search && req.body.search.graphType == "seed-division") {
        isFlagFilter = { is_indenter_freeze: 1 }
      } else {
        isFlagFilter = { icar_freeze: 1 }
      }

      if (req.body.search && req.body.search.crop_type) {

        condition = {
          include: [
            {
              model: allocationToIndentor,
              attributes: []
            },
            {
              model: userModel,
              attributes: []
            },
            // {
            //   model: bsp5bModel,
            //   attributes: []
            // },
          ],
          attributes: [
            [sequelize.literal("Sum(indent_of_breederseeds.indent_quantity)"), "indent_quantity"],
            [sequelize.col("user.name"), "name"],
            [sequelize.col("user.id"), "id"],
            // [sequelize.literal("Sum(bsp_5_b.lifting_quantity)"), "lifting_quantity"],
            [sequelize.literal("Sum(allocation_to_indentor_for_lifting_breederseed.quantity)"), "quantity"],
          ],
          where: {
            crop_code: {
              [Op.like]: req.body.search.crop_type + '%'
            },
            ...isFlagFilter
          },
          raw: true
        };
      } else {
        condition = {
          include: [
            {
              model: allocationToIndentor,
              attributes: []
            },
            {
              model: userModel,
              attributes: []
            },
            // {
            //   model: bsp5bModel,
            //   attributes: []
            // },
          ],
          attributes: [
            [sequelize.literal("Sum(indent_of_breederseeds.indent_quantity)"), "indent_quantity"],
            [sequelize.col("user.name"), "name"],
            [sequelize.col("user.id"), "id"],
            // [sequelize.literal("Sum(bsp_5_b.lifting_quantity)"), "lifting_quantity"],
            [sequelize.literal("Sum(allocation_to_indentor_for_lifting_breederseed.quantity)"), "quantity"],
          ],
          where: {
            // crop_code: {
            //   [Op.like]: req.body.search.crop_type + '%'
            // },
            icar_freeze: 1
          },
          raw: true
        };
      }
      if (req.body.search) {
        if (req.body.search.year) {
          condition.where.year = req.body.search.year
        }
        if (req.body.search.season) {
          condition.where.season = req.body.search.season
        }
        if (req.body.search.crop_code && req.body.search.crop_code !== undefined && req.body.search.crop_code.length > 0) {
          condition.where.crop_code = {
            [Op.and]: {
              [Op.in]: req.body.search.crop_code
            }
          }
        }
      }
      condition.group = [['user.name'], ['user.id']];
      data = await indentOfBreederseedModel.findAll(condition);

      let seasonData;
      if (req.body.search.season) {
        seasonData = {
          season: {
            [Op.eq]: req.body.search.season
          }
        };
      }
      let cropCodeData;
      if (req.body.search.crop_code && req.body.search.crop_code != undefined && req.body.search.crop_code.length > 0) {
        cropCodeData = {
          crop_code: {
            [Op.in]: req.body.search.crop_code
          },
        }
      }
      // crop_code: {
      //   [Op.in]: cropCodeArray
      // },
      let userIdArray = [];
      let user_id;
      data.forEach(item => {
        userIdArray.push(item.id);
      });


      if (userIdArray.length != undefined && userIdArray.length > 0) {
        user_id = {
          id: {
            [Op.in]: userIdArray
          },
        }
      }

      let allocatedData;
      if (req.body.search && req.body.search.crop_type) {

        allocatedData = await allocationToIndentorSeed.findAll({
          include: [
            {
              model: allocationToIndentorProductionCenterSeed,
              attributes: [],
              include: [
                {
                  model: userModel,
                  attribute: [],
                  where: {
                    [Op.and]: {
                      ...user_id
                    }
                  }
                },
              ],
            },
          ],
          attributes: [
            [sequelize.fn('DISTINCT', sequelize.col('allocation_to_indentor_for_lifting_seed_production_cnters->user.id')), 'id'],
            // [sequelize.fn('DISTINCT', sequelize.col('allocation_to_indentor_for_lifting_seeds.crop_code')), 'crop_code'],
            // [sequelize.col("allocation_to_indentor_for_lifting_seed_production_cnters->user.id"),"id"],
            [sequelize.literal("Sum(allocation_to_indentor_for_lifting_seed_production_cnters.qty)"), "allocated"],
          ],
          where: {
            [Op.and]: {
              crop_code: {
                [Op.like]: req.body.search.crop_type + '%'
              },
              year: {
                [Op.eq]: req.body.search.year
              },
              ...cropCodeData,
              ...seasonData
            }
          },
          raw: true,
          group: [
            // [sequelize.col('allocation_to_indentor_for_lifting_seed_production_cnters.id')],
            [sequelize.col("allocation_to_indentor_for_lifting_seed_production_cnters->user.id")]
          ],
        });
      } else {
        allocatedData = await allocationToIndentorSeed.findAll({
          include: [
            {
              model: allocationToIndentorProductionCenterSeed,
              attributes: [],
              include: [
                {
                  model: userModel,
                  attribute: [],
                  where: {
                    [Op.and]: {
                      ...user_id
                    }
                  }
                },
              ],
            },
          ],
          attributes: [
            [sequelize.fn('DISTINCT', sequelize.col('allocation_to_indentor_for_lifting_seed_production_cnters->user.id')), 'id'],
            // [sequelize.fn('DISTINCT', sequelize.col('allocation_to_indentor_for_lifting_seeds.crop_code')), 'crop_code'],
            // [sequelize.col("allocation_to_indentor_for_lifting_seed_production_cnters->user.id"),"id"],
            [sequelize.literal("Sum(allocation_to_indentor_for_lifting_seed_production_cnters.qty)"), "allocated"],
          ],
          where: {
            [Op.and]: {
              // crop_code: {
              //   [Op.like]: req.body.search.crop_type + '%'
              // },
              year: {
                [Op.eq]: req.body.search.year
              },
              ...cropCodeData,
              ...seasonData
            }
          },
          raw: true,
          group: [
            // [sequelize.col('allocation_to_indentor_for_lifting_seed_production_cnters.id')],
            [sequelize.col("allocation_to_indentor_for_lifting_seed_production_cnters->user.id")]
          ],
        });
      }
      // indenetor Data//
      // let filterData = 

      // let filterData = 
      let filter = []
      if (req.body.search) {
        if (req.body.search.crop_type) {
          filter.push({
            crop_code: {
              [Op.like]: req.body.search.crop_type + '%'
            }
          })
        }
        if (req.body.search.year) {
          filter.push({
            year: {
              [Op.eq]: req.body.search.year
            },
          })

        }
        if (req.body.search.season) {
          filter.push({
            season: {
              [Op.eq]: req.body.search.season
            }
          });
        }
        if (req.body.search.crop_code && req.body.search.crop_code.length > 0 && req.body.search.crop_code != undefined) {
          filter.push({
            crop_code: {
              [Op.in]: req.body.search.crop_code ? req.body.search.crop_code : ""
            }
          })

        }
      }


      let liftedQty;
      liftedQty = await bsp5bModel.findAll({
        where: {
          [Op.and]: filter ? filter : []
        },
        include: [
          {
            model: indentOfBreederseedModel,
            attributes: []
          }
        ],
        attributes: [
          [sequelize.col('bsp_5_b.indent_of_breederseed_id'), 'indent_of_breederseed_id'],
          [sequelize.col('bsp_5_b.lifting_quantity'), 'lifting_quantity'],
          [sequelize.col('indent_of_breederseed.user_id'), 'user_id'],
          // [sequelize.col('bsp_5_b.lifting_quantity'),'lifting_quantity'],
        ],
        raw: true
      })
      let sumofliftedQty = ConditionCreator.sumofDuplicateDataLiftedIndentQty(liftedQty, 'user_id')

      allocatedData.forEach(elem => {

        data.forEach((ele, i) => {
          if (ele.id == elem.id) {
            data[i].allocated = elem.allocated ? elem.allocated : 0
          }

        })
      })
      if (sumofliftedQty && sumofliftedQty.length > 0) {
        sumofliftedQty.forEach(elem => {
          data.forEach((ele, i) => {
            if (ele.id == elem.user_id) {
              data[i].lifting_quantity = elem.lifting_quantity ? elem.lifting_quantity : 0
            }

          })
        })
      }
      // console.log(' this.chartCrop_sec this.chartCrop_sec this.chartCrop_sec', data);
      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error);
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getChartAllIndentorVariety = async (req, res) => {
    let data = {};
    try {
      let condition = {}
      let isFlagFilter;
      if (req.body.search && req.body.search.graphType == "indenter") {
        indenterUserId = { user_id: req.body.loginedUserid.id }
        isFlagFilter = { is_indenter_freeze: 1 }
      }
      else if (req.body.search && req.body.search.graphType == "nodal") {
        isFlagFilter = { is_freeze: 1 }
      }
      else if (req.body.search && req.body.search.graphType == "seed-division") {
        isFlagFilter = { is_indenter_freeze: 1 }
      } else {
        isFlagFilter = { icar_freeze: 1 }
      }

      if (req.body.search && req.body.search.crop_type) {

        condition = {
          include: [
            {
              model: allocationToIndentor,
              attributes: []
            },
            {
              model: userModel,
              attributes: [],
              where: {}
            },
            // {
            //   model: bsp5bModel,
            //   attributes: []
            // },
          ],
          attributes: [
            [sequelize.literal("DISTINCT(indent_of_breederseeds.crop_code)"), "crop_code"],
            [sequelize.literal("(indent_of_breederseeds.crop_name)"), "crop_name"],
            [sequelize.col("user.id"), "id"],
            [sequelize.literal("Sum(indent_of_breederseeds.indent_quantity)"), "indent_quantity"],

            // [sequelize.col("user.name"), "name"],
            // [sequelize.literal("Sum(bsp_5_b.lifting_quantity)"), "lifting_quantity"],
            [sequelize.literal("Sum(allocation_to_indentor_for_lifting_breederseed.quantity)"), "quantity"],
          ],
          where: {
            crop_code: {
              [Op.like]: req.body.search.crop_type + '%'
            },
            // icar_freeze: 1
            ...isFlagFilter
          },
          raw: true
        };
      } else {
        condition = {
          include: [
            {
              model: allocationToIndentor,
              attributes: []
            },
            {
              model: userModel,
              attributes: [],
              where: {}
            },
            // {
            //   model: bsp5bModel,
            //   attributes: []
            // },
          ],
          attributes: [
            [sequelize.literal("DISTINCT(indent_of_breederseeds.crop_code)"), "crop_code"],
            [sequelize.literal("(indent_of_breederseeds.crop_name)"), "crop_name"],
            [sequelize.col("user.id"), "id"],
            [sequelize.literal("Sum(indent_of_breederseeds.indent_quantity)"), "indent_quantity"],

            // [sequelize.col("user.name"), "name"],
            // [sequelize.literal("Sum(bsp_5_b.lifting_quantity)"), "lifting_quantity"],
            [sequelize.literal("Sum(allocation_to_indentor_for_lifting_breederseed.quantity)"), "quantity"],
          ],
          where: {
            // crop_code: {
            //   [Op.like]: req.body.search.crop_type + '%'
            // },
            ...isFlagFilter
          },
          raw: true
        };
      }

      if (req.body.search) {
        if (req.body.search.year) {
          condition.where.year = req.body.search.year
        }
        if (req.body.search.season) {
          condition.where.season = req.body.search.season
        }
        // if (req.body.search.crop_code) {
        //   condition.where.crop_code = req.body.search.crop_code
        // }
        if (req.body.search.crop_code && req.body.search.crop_code !== undefined && req.body.search.crop_code.length > 0) {
          condition.where.crop_code = { [Op.in]: req.body.search.crop_code }
        }
        if (req.body.search.user_id) {
          condition.include[1].where.id = parseInt(req.body.search.user_id)
        }
      }
      condition.group = [
        [sequelize.col('indent_of_breederseeds.crop_code'), 'crop_code'],
        [sequelize.col('indent_of_breederseeds.crop_name'), 'crop_name'],
        [sequelize.col("user.id"), "id"],
      ];

      data = await indentOfBreederseedModel.findAll(condition);
      let seasonData;
      if (req.body.search.season) {
        seasonData = {
          season: {
            [Op.eq]: req.body.search.season
          }
        };
      }
      let cropCodeData;
      if (req.body.search.crop_code && req.body.search.crop_code != undefined && req.body.search.crop_code.length > 0) {
        cropCodeData = {
          crop_code: {
            [Op.in]: req.body.search.crop_code
          },
        }
      }
      // crop_code: {
      //   [Op.in]: cropCodeArray
      // },
      let userIdArray = [];
      let user_id;
      console.log('data====', data)
      data.forEach(item => {
        userIdArray.push(item.id);
      });

      userIdArray = [... new Set(userIdArray)]
      console.log(userIdArray, 'userIdArray')
      if (userIdArray.length != undefined && userIdArray.length > 0) {
        user_id = {
          id: {
            [Op.in]: userIdArray
          },
        }
      }

      let allocatedDatasecond;
      let cropTypeSecond;

      if (req.body.search && req.body.search.crop_type) {
        cropTypeSecond = {
          crop_code: {
            [Op.like]: req.body.search.crop_type + '%'
          },
        }
      }

      if (req.body.search && req.body.search.crop_type) {

        allocatedDatasecond = await allocationToIndentorSeed.findAll({
          // where:{}

          include: [
            {
              model: allocationToIndentorProductionCenterSeed,
              attributes: [],
              include: [
                {
                  model: userModel,
                  attribute: [],
                  where: {
                    [Op.and]: {
                      ...user_id
                    }
                  }
                },
              ],
            },
          ],
          attributes: [
            [sequelize.col('allocation_to_indentor_for_lifting_seeds.crop_code'), 'crop_code'],
            [sequelize.literal("Sum(allocation_to_indentor_for_lifting_seed_production_cnters.qty)"), "allocated"],
          ],
          group: [
            [sequelize.col('allocation_to_indentor_for_lifting_seeds.crop_code'), 'crop_code'],
            [sequelize.col('allocation_to_indentor_for_lifting_seeds.id'), 'id'],
            [sequelize.col('allocation_to_indentor_for_lifting_seed_production_cnters->user.id'), 'id'],

          ],
          // attributes:[
          //   [sequelize.col('allocation_to_indentor_for_lifting_breederseed.crop_code'),'crop_code']

          // ],
          where: {
            [Op.and]: {
              ...cropTypeSecond,
              year: {
                [Op.eq]: req.body.search.year
              },
              ...cropCodeData,
              ...seasonData
            }
          },
          raw: true,
        })
      } else {
        allocatedDatasecond = await allocationToIndentorSeed.findAll({
          // where:{}

          include: [
            {
              model: allocationToIndentorProductionCenterSeed,
              attributes: [],
              include: [
                {
                  model: userModel,
                  attribute: [],
                  where: {
                    [Op.and]: {
                      ...user_id
                    }
                  }
                },
              ],
            },
          ],
          // attributes: [
          //   [sequelize.col('allocation_to_indentor_for_lifting_seeds.crop_code'), 'crop_code'],
          //   [sequelize.col('allocation_to_indentor_for_lifting_seed_production_cnters.qty'), 'qty'],
          //   [sequelize.col('allocation_to_indentor_for_lifting_seed_production_cnters->user.id'), 'id']
          //   // [sequelize.literal("Sum(allocation_to_indentor_for_lifting_seed_production_cnters.qty)"), "allocated"],
          // ],
          // // group:[
          // //   [sequelize.col('allocation_to_indentor_for_lifting_seeds.crop_code'),'crop_code'],
          // //   [sequelize.col('allocation_to_indentor_for_lifting_seeds.id'),'id'],
          // //   [sequelize.col('allocation_to_indentor_for_lifting_seed_production_cnters->user.id'),'id'],

          // // ],
          raw: true,
          attributes: [
            [sequelize.col('allocation_to_indentor_for_lifting_seeds.crop_code'), 'crop_code'],
            [sequelize.literal("Sum(allocation_to_indentor_for_lifting_seed_production_cnters.qty)"), "allocated"],
          ],
          group: [
            [sequelize.col('allocation_to_indentor_for_lifting_seeds.crop_code'), 'crop_code'],
            [sequelize.col('allocation_to_indentor_for_lifting_seeds.id'), 'id'],
            [sequelize.col('allocation_to_indentor_for_lifting_seed_production_cnters->user.id'), 'id'],

          ],
          where: {
            [Op.and]: {

              year: {
                [Op.eq]: req.body.search.year
              },
              ...cropCodeData,
              ...seasonData
            }
          },
          raw: true,
        })

      }
      const uniqueIndentorDataMap = []
      let uniqueJsonArrays;
      if (allocatedDatasecond && allocatedDatasecond.length > 0) {
        uniqueJsonArrays = seedhelper.sumofDuplicateDataAllocated(allocatedDatasecond)
      }
      if (uniqueJsonArrays && uniqueJsonArrays.length > 0) {

        console.log(uniqueJsonArrays, 'allocatedDataallocatedData')
        uniqueJsonArrays.forEach(elem => {
          data.forEach((ele, i) => {
            if (ele.crop_code == elem.crop_code) {
              data[i].allocated = elem && elem.allocated ? parseFloat(elem.allocated) : 0;

            }
          })
          // console.log(elem,'allocatedData')
        })
      }
      let filter = []
      if (req.body.search) {
        if (req.body.search.crop_type) {
          filter.push({
            crop_code: {
              [Op.like]: req.body.search.crop_type + '%'
            }
          })
        }
        if (req.body.search.year) {
          filter.push({
            year: {
              [Op.eq]: req.body.search.year
            },
          })

        }
        if (req.body.search.season) {
          filter.push({
            season: {
              [Op.eq]: req.body.search.season
            }
          });
        }
        if (req.body.search.crop_code && req.body.search.crop_code.length > 0 && req.body.search.crop_code != undefined) {
          filter.push({
            crop_code: {
              [Op.in]: req.body.search.crop_code ? req.body.search.crop_code : ""
            }
          })

        }
      }
      let cropArr = []
      data.forEach(item => {
        cropArr.push(item && item.crop_code ? item.crop_code : '')
      })
      let liftedQty;
      if (cropArr && cropArr.length > 0) {
        if (req.body.search && req.body.search.user_id) {

          liftedQty = await bsp5bModel.findAll({
            where: {
              [Op.and]: filter ? filter : [],
              crop_code: {
                [Op.in]: cropArr
              }

            },
            include: [
              {
                model: indentOfBreederseedModel,
                where: {
                  user_id: req.body.search.user_id
                },
                attributes: [],
              }


            ],
            attributes: [
              [sequelize.fn('SUM', sequelize.col('bsp_5_b.lifting_quantity')), 'lifting_quantity'],
              [sequelize.col('bsp_5_b.crop_code'), 'crop_code']
            ],
            group: [
              [sequelize.col('bsp_5_b.crop_code'), 'crop_code'],
            ],
            raw: true
          })
        } else {
          liftedQty = await bsp5bModel.findAll({
            where: {
              [Op.and]: filter ? filter : [],
              crop_code: {
                [Op.in]: cropArr
              }

            },
            include: [
              {
                model: indentOfBreederseedModel,
                attributes: []
              }

            ],
            attributes: [
              [sequelize.fn('SUM', sequelize.col('bsp_5_b.lifting_quantity')), 'lifting_quantity'],
              [sequelize.col('bsp_5_b.crop_code'), 'crop_code']
            ],
            group: [
              [sequelize.col('bsp_5_b.crop_code'), 'crop_code']
            ],
            raw: true
          })
        }

      } else {
        if (req.body.search && req.body.search.user_id) {

          liftedQty = await bsp5bModel.findAll({
            where: {
              [Op.and]: filter ? filter : [],


            },
            include: [
              {
                model: indentOfBreederseedModel,
                where: {
                  user_id: req.body.search.user_id
                },
                attributes: []
              }

            ],
            attributes: [
              [sequelize.fn('SUM', sequelize.col('bsp_5_b.lifting_quantity')), 'lifting_quantity'],
              [sequelize.col('bsp_5_b.crop_code'), 'crop_code']
            ],
            group: [
              [sequelize.col('bsp_5_b.crop_code'), 'crop_code']
            ],
            raw: true
          })
        }
        else {

          liftedQty = await bsp5bModel.findAll({
            where: {
              [Op.and]: filter ? filter : [],

            },
            include: [
              {
                model: indentOfBreederseedModel,
                attributes: []
              }

            ],
            attributes: [
              [sequelize.fn('SUM', sequelize.col('bsp_5_b.lifting_quantity')), 'lifting_quantity'],
              [sequelize.col('bsp_5_b.crop_code'), 'crop_code']
            ],
            group: [
              [sequelize.col('bsp_5_b.crop_code'), 'crop_code']
            ],
            raw: true
          })
        }
      }
      if (liftedQty && liftedQty.length > 0) {
        liftedQty.forEach(item => {
          data.forEach((ele, i) => {
            if (ele.crop_code == item.crop_code) {
              data[i].lifting_qty = item && item.lifting_quantity ? item.lifting_quantity : 0;
            }
          })
        })
      }


      // data.forEach((ele, i) => {
      //   data[i].allocated = 0
      //   allocatedData.forEach((elem, index) => {
      //     if (ele.id == elem.id) {
      //       data[index].allocated = elem.allocated ? elem.allocated : 0;
      //     }
      //   })
      // });
      // console.log(' this.chartCrop_sec this.chartCrop_sec this.chartCrop_sec', data);
      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error);
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }


  static getTotalAllocateLiftingCount = async (req, res) => {
    let data = {};
    try {
      let condition = {}
      if (req.body.search && req.body.search.crop_type) {

        condition = {
          include: [
            {
              model: indentOfBreederseedModel,
              attributes: [],
              where: {
                //  user_id: req.body.search.user_id,
                crop_code: {
                  [Op.like]: req.body.search.crop_type + '%'
                }
              }
            }
          ],
          attributes: [
            // [sequelize.fn('sum', sequelize.col('allocation_to_indentor_for_lifting_breederseed.quantity')),'quantity']
            'quantity'
          ],
          where: {

          },
          row: true
        };
      } else {
        condition = {
          include: [
            {
              model: indentOfBreederseedModel,
              attributes: [],
              // where: {
              //   user_id: req.body.search.user_id,
              //   crop_code: {
              //     [Op.like]: req.body.search.crop_type + '%'
              //   }
              // }
            }
          ],
          attributes: [
            // [sequelize.fn('sum', sequelize.col('allocation_to_indentor_for_lifting_breederseed.quantity')),'quantity']
            'quantity'
          ],
          where: {

          },
          row: true
        };
      }
      data = await allocationToIndentor.findAll(condition);
      let qt = [];
      let total = 0;
      if (data.length != 0) {
        data.forEach(element => {
          qt.push(element.dataValues.quantity);
        });
        total = qt.reduce(function (curr, prev) { return curr + prev; });
      }
      response(res, status.DATA_AVAILABLE, 200, total);
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }


  static editProfile = async (req, res) => {
    let returnResponse = {};
    let internalCall = {};
    let mobileno;
    try {
      let existingAgencyData = undefined;
      let existingData = undefined;
      if (req.body.mobile_number) {
        mobileno = req.body.mobile_number;
      } else if (req.body.mobile) {
        mobileno = req.body.mobile;
      }
      console.log(mobileno, 'mobileno')
      let tabledAlteredSuccessfully = false;
      const id = parseInt(req.body.id);
      let condition = {
        where: {
          id: id
        }
      }
      let usersData = {
        agency_name: (req.body.agency_name).toUpperCase(),
        updated_by: req.body.updated_by,
        category: req.body.category_agency,
        state_id: req.body.state,
        district_id: req.body.district,


        contact_person_name: req.body.contact_person_name,
        contact_person_designation: req.body.contact_person_designation_id,
        contact_person_designation: req.body.contact_person_designation,
        // contact_person_mobile: req.body.mobile_number,
        phone_number: req.body.phone,
        fax_no: req.body.fax_number,

        email: req.body.email,
        bank_name: req.body.bank_name,
        bank_branch_name: req.body.bank_branch_name,
        bank_ifsc_code: req.body.bank_ifsc_code,
        bank_account_number: req.body.bank_account_number,
        created_by: req.body.created_by,
        // state_id: req.body.state_id,
        // district_id: req.body.district_id,
        mobile_number: mobileno,
        pincode: req.body.pincode,
        is_active: req.body.active,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        address: req.body.address
      };


      existingAgencyData = await agencyDetailModel.findAll({
        where: {
          [Op.and]: [
            {
              where: sequelize.where(
                sequelize.fn('lower', sequelize.col('agency_name')),
                sequelize.fn('lower', req.body.agency_name),

                // created_by:{[Op.and]:req.body.createdby}
              ),
              created_by: { [Op.eq]: req.body.created_by },
              id: { [Op.ne]: id },


            },



          ]
        },



      });
      if (existingAgencyData && existingAgencyData.length) {
        returnResponse = {
          error: 'Agency Name Already exist'
        }
        return response(res, status.DATA_NOT_SAVE, 401, returnResponse)
      }






      if (existingData === undefined || existingData.length < 1) {
        const data = await agencyDetailModel.update(usersData, condition);
        console.log('hiii')
        const updateUsertableData = {
          name: (req.body.agency_name).toUpperCase(),

          email_id: req.body.email,

        }
        const user_data = await userModel.update(updateUsertableData, { where: { id: req.body.user_id } })
        tabledAlteredSuccessfully = true;
        //createUser()
      }


      if (tabledAlteredSuccessfully) {
        return response(res, status.DATA_SAVE, 200, returnResponse, internalCall)
      } else {
        return response(res, status.DATA_NOT_SAVE, 401, returnResponse, internalCall)
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_SAVE, 500, error)
    }
  }
  static getProfile = async (req, res) => {
    const { internalCall } = req.body;
    let returnResponse = {};
    try {

      let rules = {
        'search.agency_id': 'integer',

      };

      let validation = new Validator(req.body, rules);

      const isValidData = validation.passes();

      if (!isValidData) {
        let errorResponse = {};
        for (let key in rules) {
          const error = validation.errors.get(key);
          if (error.length) {
            errorResponse[key] = error;
          }
        }
        return response(res, status.BAD_REQUEST, 400, errorResponse, internalCall)
      }

      let { page, pageSize, search } = req.body;


      let condition = {

        where: {
          id: req.body.search.agency_id
          // is_active: 1
        },
        raw: false,

      };
      // if (page === undefined) page = 1;
      // if (pageSize === undefined) {
      //   pageSize = 10;
      // } // set pageSize to -1 to prevent sizing

      // if (page > 0 && pageSize > 0) {
      //   condition.limit = pageSize;
      //   condition.offset = (page * pageSize) - pageSize;
      // }

      // const sortOrder = req.body.sort ? req.body.sort : 'crop_name';
      // const sortDirection = req.body.order ? req.body.order : 'ASC';



      // condition.order = [[sortOrder, sortDirection]];

      // if (req.body.search) {

      //   if (req.body.search.agency_id) {
      //     condition.where.id = (req.body.search.agency_id);
      //   }
      //   // if (req.body.search.crop_code) {
      //   //   condition.where.crop_code = (req.body.search.crop_code);
      //   // }
      //   // if (req.body.search.crop_name_data) {

      //   //   condition.where.crop_group = (req.body.search.crop_name_data);
      //   // }
      //   // if (req.body.search.crop_group) {

      //   //   condition.where.crop_group = (req.body.search.crop_group);
      //   // }

      // }


      const queryData = await agencyDetailModel.findAndCountAll(condition);
      // returnResponse = await paginateResponse(queryData, page, pageSize);


      return response(res, status.OK, 200, queryData, internalCall);

    } catch (error) {
      returnResponse = {
        message: error.message
      };
      console.log(error)
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }
  static updateProfileData = async (req, res) => {
    const { internalCall } = req.body;
    let returnResponse = {};
    try {
      const { contact_person_name, contactPersonDesignation, user_id, showMobileNumber, mobile, email, contact_person_designation, latitude, longitude, agency_id, fax_number, phone, pincode, crop_data, image_url } = req.body;
      let data;
      let dataRow = {
        // contact_person_designation:contact_person_designation ? contact_person_designation :'',
        contact_person_name: contact_person_name ? contact_person_name : null,
        crop_data: crop_data ? crop_data : null,
        latitude: latitude ? latitude : null,
        longitude: longitude ? longitude : null,
        email: email ? email : null,
        fax_no: fax_number ? fax_number : null,
        phone_number: phone ? phone : null,
        image_url: image_url ? image_url : null,
        // mobile_number:mobile ? mobile :null, 
        contact_person_designation_id: contact_person_designation,
        pincode: pincode ? pincode : null,
        mobile_number: mobile ? mobile : null,
        contact_person_mobile: mobile ? mobile : null
      }
      if (contactPersonDesignation) {
        dataRow.contact_person_designation = contact_person_designation ? contact_person_designation : '';
      } else {
        dataRow.contact_person_designation_id = contact_person_designation ? contact_person_designation : '';
      }

      data = await db.agencyDetailModel.update(dataRow, {
        where: {
          id: agency_id
        }
      })

      // 
      if (data) {
        return response(res, status.OK, 200, data, internalCall);

      }
      else {
        return response(res, status.ID_NOT_FOUND, 200, data, internalCall);

      }
      // const queryData = await agencyDetailModel.findAndCountAll(condition);
      // returnResponse = await paginateResponse(queryData, page, pageSize);



    } catch (error) {
      returnResponse = {
        message: error.message
      };
      console.log(error)
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }
  static CheckEmeailId = async (req, res) => {
    const { internalCall } = req.body;
    let returnResponse = {};
    try {

      let rules = {

        'search.email_id': 'string',
        'search.password': 'string',
        'search.id': 'integer',

      };

      let validation = new Validator(req.body, rules);

      const isValidData = validation.passes();

      if (!isValidData) {
        let errorResponse = {};
        for (let key in rules) {
          const error = validation.errors.get(key);
          if (error.length) {
            errorResponse[key] = error;
          }
        }
        return response(res, status.BAD_REQUEST, 400, errorResponse, internalCall)
      }

      let { page, pageSize, search } = req.body;


      let condition = {

        where: {
          email_id: req.body.search.email_id,
          password: req.body.search.password,
          id: req.body.search.id
          // is_active: 1
        },
        raw: false,

      };
      // if (page === undefined) page = 1;
      // if (pageSize === undefined) {
      //   pageSize = 10;
      // } // set pageSize to -1 to prevent sizing

      // if (page > 0 && pageSize > 0) {
      //   condition.limit = pageSize;
      //   condition.offset = (page * pageSize) - pageSize;
      // }

      const queryData = await userModel.findAndCountAll(condition);
      let emailResponse;

      console.log('queryData', queryData.rows.length);

      if (queryData.rows.length > 0) {
        emailResponse = {
          emailAlreadyRegistered: true
        }

      }
      else {
        emailResponse = {
          emailAlreadyRegistered: false
        }
      }
      // returnResponse = await paginateResponse(queryData, page, pageSize);


      return response(res, status.OK, 200, emailResponse, internalCall);

    } catch (error) {
      returnResponse = {
        message: error.message
      };
      console.log(error)
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }
  static UpdatePassword = async (req, res) => {
    const { internalCall } = req.body;
    let returnResponse = {};

    try {
      console.log(req)

      let rules = {
        'search.email_id': 'string',
        'search.password': 'string',
        'search.id': 'integer',
      };

      let validation = new Validator(req.body, rules);

      const isValidData = validation.passes();

      if (!isValidData) {
        let errorResponse = {};
        for (let key in rules) {
          const error = validation.errors.get(key);
          if (error.length) {
            errorResponse[key] = error;
          }
        }
        return response(res, status.BAD_REQUEST, 400, errorResponse, internalCall)
      }

      let { page, pageSize, search } = req.body;
      let whereClause = {}
      let { email_id } = req.body.search;
      if (email_id) {
        whereClause.email_id = email_id
      }
      let condition = {

        where: {
          ...whereClause,
          // email_id: req.body.search.email_id,
          // password: req.body.search.currentpassword,
          id: req.params.id,

        },
        raw: false,

      };

      const queryData = await userModel.findAndCountAll(condition);

      if (queryData.rows.length > 0) {
        const data = {
          // password: req.body.search.password,
          is_change_password: true,
        }
        const user_data = await userModel.update(data, { where: { id: req.params.id } })
      }

      return response(res, status.OK, 200, 'data updated successfully', internalCall);

    } catch (error) {
      returnResponse = {
        message: error.message
      };
      console.log(error)
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
    }
  }


  // static getPlantDeatils = async (req, res) => {
  //   const { internalCall } = req.body;
  //   let returnResponse = {};
  //   try {

  //     let rules = {
  //       'search.state_code': 'integer',
  //       'search.district_code': 'integer',

  //     };

  //     let validation = new Validator(req.body, rules);

  //     const isValidData = validation.passes();

  //     if (!isValidData) {
  //       let errorResponse = {};
  //       for (let key in rules) {
  //         const error = validation.errors.get(key);
  //         if (error.length) {
  //           errorResponse[key] = error;
  //         }
  //       }
  //       return response(res, status.BAD_REQUEST, 400, errorResponse, internalCall)
  //     }

  //     let { page, pageSize, isReport } = req.body;

  //     if (!page) page = 1;
  //     let condition = {
  //       include: [
  //         {

  //           model: stateModel,
  //         },
  //         {
  //           model: districtModel
  //         },
  //         {
  //           model: designationModel
  //         }
  //       ],
  //       where: {
  //         // state_id : req.body.search.state_code ? req.body.search.state_code : undefined
  //       }


  //     };





  //     // const sortOrder = req.body.sort ? req.body.sort : 'created_at';
  //     // const sortDirection = req.body.order ? req.body.order : 'DESC';

  //     if(!isReport)
  //     {
  //       if (page && pageSize) {
  //         condition.limit = pageSize;
  //         condition.offset = (page * pageSize) - pageSize;
  //       }
  //     }
  //     else
  //     {

  //     }
     

  //     condition.order = [[sequelize.col('plant_details.plant_name'), 'asc'],
  //     [sequelize.col('m_state.state_name'), 'asc'],

  //     [sequelize.col('m_district.district_name'), 'asc'],
  //     [sequelize.col('plant_details.latitude'), 'asc'],
  //     [sequelize.col('plant_details.longitude'), 'asc'], 


  //     ]

  //     // condition.order = [[sortOrder, sortDirection]];

  //     if (req.body.search) {

  //       if (req.body.search.state_code) {

  //         condition.where.state_id = parseInt(req.body.search.state_code);
  //       }

  //       if (req.body.search.district_code) {

  //         condition.where.district_id = (req.body.search.district_code);
  //       }


  //     }


  //     const queryData = await plantDetail.findAndCountAll(condition);



  //     return response(res, status.OK, 200, queryData, internalCall);

  //   } catch (error) {
  //     returnResponse = {
  //       message: error.message
  //     };
  //     return response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
  //   }
  // }
  static getSPPDeatils = async (req, res) => {
  const { internalCall } = req.body;
  let returnResponse = {};
  try {
    let rules = {
      'search.state_code': 'integer',
      'search.district_code': 'integer',
    };

    let validation = new Validator(req.body, rules);
    if (!validation.passes()) {
      let errorResponse = {};
      for (let key in rules) {
        const error = validation.errors.get(key);
        if (validation.errors.get(key).length) {
          errorResponse[key] = validation.errors.get(key);
        }
      }
      return response(res, status.BAD_REQUEST, 400, errorResponse, internalCall);
    }

    let { page, pageSize, isReport } = req.body;
    if (!page) page = 1;

    let condition = {
      attributes: [
        'code',
        'is_active',
      ],
      include: [
        {
          model: agencyDetailModel,
          attributes: [
            'agency_name',
            'address',
            'contact_person_name',
            'mobile_number',
            'email',
          ],
          include: [
            {
              model: stateModel,
              attributes: ['state_name'],
            },
            {
              model: districtModel,
              attributes: ['district_name'],
            },
            {
              model: designationModel,
              attributes: [['name', 'designation_name']],
            },
          ],
        },
      ],
      where: {
        user_type: 'SPP',
      },
    };

    // Pagination
    if (!isReport) {
      if (page && pageSize) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }
    }

    // Filters
    if (req.body.search) {
      if (req.body.search.state_code) {
        condition.include[0].where = {
          ...(condition.include[0].where || {}),
          state_id: parseInt(req.body.search.state_code),
        };
      }
      if (req.body.search.district_code) {
        condition.include[0].where = {
          ...(condition.include[0].where || {}),
          district_id: req.body.search.district_code,
        };
      }
    }

    // Ordering
     condition.order = [
  ['code', 'ASC'],
  ['is_active', 'ASC'],
  [agencyDetailModel, stateModel, 'state_name', 'ASC'],
  [agencyDetailModel, districtModel, 'district_name', 'ASC'],
  [agencyDetailModel, 'agency_name', 'ASC'],
  [agencyDetailModel, 'address', 'ASC'],
  [agencyDetailModel, 'contact_person_name', 'ASC'],
  [agencyDetailModel, 'mobile_number', 'ASC'],
  [agencyDetailModel, 'email', 'ASC'],
];


    const queryData = await userModel.findAndCountAll(condition);

    return response(res, status.OK, 200, queryData, internalCall);
  } catch (error) {
    returnResponse = { message: error.message };
    return response(res, status.UNEXPECTED_ERROR, 500, returnResponse, internalCall);
  }
};

  
  static getPlantDistrictDetails = async (req, res) => {
    let data = [];
    try {
      let condition = {
        include: [

          {
            model: districtModel,
            attribute: ['district_name'],
            raw: true
          },

        ],

        where: {
          state_id: req.body.search.state
          // is_active: 1,
          // crop_code: {
          //   [Op.like]: req.body.search.crop_type + '%'
          // }
        },
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('m_district.district_name')), 'district_name'],
          // [sequelize.fn('DISTINCT', sequelize.col('agency_name')), 'agency_name'],
          // 'id'
        ],
        raw: true,
      };
      let data = await plantDetail.findAndCountAll(condition);
      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getProjectCoordinatorReport = async (req, res) => {
    try {
      let { page, pageSize } = req.body;
      let stateId = {}

      let condition = {
        include: [
          {
            model: agencyDetailModel,
            left: true,
            attributes: ['agency_name', 'category', 'district_id', 'short_name', 'address', 'contact_person_name', 'contact_person_mobile', 'email', 'latitude', 'longitude'],
            include: [
              {
                model: stateModel,
                left: true,
                // attributes: ['state_code', 'state_code', 'district_code'],
                where: {}
              },
              {
                model: districtModel,
                left: true,
                attributes: ['district_name', 'state_code', 'district_code'],
                where: {}
              },
              {
                model: designationModel,
                left: true,
                attributes: ['name'],
                where: {}
              },
              {
                model: mCategoryOrgnization,
                left: true
              }
            ],
            ...stateId
          },
        ],
        // raw:true,
        where: {
          user_type: 'BR'
        },
        // attributes: ['user_type', 'agency_id']
      };
      if (req.body.search) {
        // if (req.body.search.state_code) {
        //   condition.include.where.state_id = parseInt(req.body.search.state_code);
        // }
      }
      if (page === undefined) page = 1;
      if (pageSize === undefined) pageSize = 10;

      if (page > 0 && pageSize > 0) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }

      // const sortOrder = req.body.sort ? req.body.sort : 'id';
      // const sortDirection = req.body.order ? req.body.order : 'DESC';

      // condition.order = [[sortOrder, sortDirection]];

      // condition.order = [[sequelize.col('agency_detail.agency_name'), 'asc'],
      // [sequelize.col('agency_detail.category'), 'asc'],
      // [sequelize.col('agency_detail->m_state.state_name'), 'asc'],
      // [sequelize.col('agency_detail.m_district.district_name'), 'asc'],]


      const data = await userModel.findAndCountAll(condition);
      if (!data) {
        return response(res, status.DATA_NOT_AVAILABLE, 404);
      }

      return response(res, status.DATA_AVAILABLE, 200, data);
    }
    catch (error) {
      console.log(error)
      return response(res, status.UNEXPECTED_ERROR, 500, error)
    }
  }
  static getProjectCoordinatorReportCordinator = async (req, res) => {
    try {
      let { page, pageSize } = req.body;
      let stateId = {}

      let condition = {
        include: [
          {
            model: userModel,
            where: {
              user_type: 'BR'
            },
          },
          {
            model: stateModel
          }


        ],
        // raw:true,
        where: {
          state_id: req.body.search.state_id
          // user_type: '
        },

      };
      if (req.body.search) {
        // if (req.body.search.state_code) {
        //   condition.include.where.state_id = parseInt(req.body.search.state_code);
        // }
      }
      if (page === undefined) page = 1;
      if (pageSize === undefined) pageSize = 10;

      if (page > 0 && pageSize > 0) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }

      // const sortOrder = req.body.sort ? req.body.sort : 'id';
      // const sortDirection = req.body.order ? req.body.order : 'DESC';

      // condition.order = [[sortOrder, sortDirection]];

      // condition.order = [[sequelize.col('agency_detail.agency_name'), 'asc'],
      // [sequelize.col('agency_detail.category'), 'asc'],
      // [sequelize.col('agency_detail->m_state.state_name'), 'asc'],
      // [sequelize.col('agency_detail.m_district.district_name'), 'asc'],]


      const data = await agencyDetailModel.findAndCountAll(condition);
      if (!data) {
        return response(res, status.DATA_NOT_AVAILABLE, 404);
      }

      return response(res, status.DATA_AVAILABLE, 200, data);
    }
    catch (error) {
      console.log(error)
      return response(res, status.UNEXPECTED_ERROR, 500, error)
    }
  }
  static getProjectCoordinatorReportCordinatorDistrict = async (req, res) => {
    try {
      let { page, pageSize } = req.body;
      let stateId = {}

      let condition = {
        include: [
          {
            model: userModel,
            where: {
              user_type: 'BR'
            },
          },
          {
            model: districtModel,
          }


        ],
        // raw:true,
        where: {
          state_id: req.body.search.state_id
          // user_type: '
        },
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('m_district.district_name')), 'district_name'],
          // [sequelize.fn('DISTINCT', sequelize.col('m_district.district_code')), 'district_code'],
          // [sequelize.col('m_district.district_code'),'district_code'],
          // [sequelize.fn('DISTINCT', sequelize.col('agency_name')), 'agency_name'],
          // [sequelize.fn('DISTINCT', sequelize.col('m_district.district_code')), 'district_code'],

          'id'
        ],
        // raw:true,

      };
      if (req.body.search) {
        // if (req.body.search.state_code) {
        //   condition.include.where.state_id = parseInt(req.body.search.state_code);
        // }
      }
      if (page === undefined) page = 1;
      if (pageSize === undefined) pageSize = 10;

      if (page > 0 && pageSize > 0) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }


      // const sortOrder = req.body.sort ? req.body.sort : 'id';
      // const sortDirection = req.body.order ? req.body.order : 'DESC';

      // condition.order = [[sortOrder, sortDirection]];

      // condition.order = [[sequelize.col('agency_detail.agency_name'), 'asc'],
      // [sequelize.col('agency_detail.category'), 'asc'],
      // [sequelize.col('agency_detail->m_state.state_name'), 'asc'],
      // [sequelize.col('agency_detail.m_district.district_name'), 'asc'],]
      condition.order = [[sequelize.col('m_district.district_name'), 'asc']]


      const data = await agencyDetailModel.findAndCountAll(condition);
      if (!data) {
        return response(res, status.DATA_NOT_AVAILABLE, 404);
      }

      return response(res, status.DATA_AVAILABLE, 200, data);
    }
    catch (error) {
      console.log(error)
      return response(res, status.UNEXPECTED_ERROR, 500, error)
    }
  }
  static getBspcReportDistrict = async (req, res) => {
    try {

      const usertype = req.query.usertype;
      console.log(usertype)
      let condition = {
        where: {
          user_type: 'BPC'
        },
        attributes: ['name', 'mobile_number', 'email_id', 'mobile_number',],
        include: [
          {
            model: agencyDetailModel,
            left: false,
            raw: false,
            where: {},
            attributes: ['address',],

            include: [{
              model: districtModel,
              attributes: ['district_name', 'district_code'],
              where: {}
            },
            {
              model: stateModel,
              attributes: ['state_name', 'state_code']
            }
            ]
          },

        ],
      }

      let { page, pageSize, searchData } = req.body;

      // if (page === undefined) page = 1;
      // if (pageSize === undefined) pageSize = 10;
      // if (page > 0 && pageSize > 0) {
      //   condition.limit = pageSize;
      //   condition.offset = (page * pageSize) - pageSize;
      // }

      if (req.body.search) {
        console.log("Breeder Production Center")
        // if (searchData.breeder_id) {
        //   condition.where['created_by'] = searchData.breeder_id;
        // }

        if (req.body.search.state_id) {
          condition.include[0].include[0].where['state_code'] = req.body.search.state_id;
        }
      }



      // const sortOrder = req.body.sort ? req.body.sort : 'id';
      // const sortDirection = req.body.order ? req.body.order : 'DESC';

      // condition.order = [[sortOrder, sortDirection]];

      condition.order = [
        // (sequelize.col('users.name', 'ASC')),
        // (sequelize.col('agency_detail.short_name', 'ASC'))
        // (sequelize.col('agency_detail->m_state.state_name', 'ASC')),
        (sequelize.col('agency_detail->m_district.district_name', 'ASC')),
        // (sequelize.col('agency_detail.latitute', 'ASC')),
        // (sequelize.col('agency_detail.longitute', 'ASC'))

      ];

      let data = await userModel.findAndCountAll(condition);

      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      console.log(error);
      return response(res, status.DATA_NOT_SAVE, 500, error);
    }
  }
  static getBspcReportName = async (req, res) => {
    try {

      const usertype = req.query.usertype;
      console.log(usertype)
      let condition = {
        where: {
          user_type: 'BPC'
        },
        // attributes: ['name', 'mobile_number', 'email_id', 'mobile_number',],
        include: [
          {
            model: agencyDetailModel,
            left: false,
            raw: false,
            where: {},
            attributes: []
            // attributes: ['address', 'agency_name'],
          },

        ],
        attributes: [
          [sequelize.col('agency_detail.agency_name'), 'agency_name'],
          [sequelize.col('agency_detail.id'), 'agency_id']
        ],
        raw: true
      }

      let { page, pageSize, searchData } = req.body;

      // if (page === undefined) page = 1;
      // if (pageSize === undefined) pageSize = 10;
      // if (page > 0 && pageSize > 0) {
      //   condition.limit = pageSize;
      //   condition.offset = (page * pageSize) - pageSize;
      // }

      if (req.body.search) {
        console.log("Breeder Production Center")
        // if (searchData.breeder_id) {
        //   condition.where['created_by'] = searchData.breeder_id;
        // }

        if (req.body.search.state_id) {
          condition.include[0].where['state_id'] = req.body.search.state_id;
        }

        if (req.body.search.district_id) {
          condition.include[0].where['district_id'] = req.body.search.district_id;
        }
      }



      // const sortOrder = req.body.sort ? req.body.sort : 'id';
      // const sortDirection = req.body.order ? req.body.order : 'DESC';

      // condition.order = [[sortOrder, sortDirection]];

      condition.order = [
        // (sequelize.col('users.name', 'ASC')),
        // (sequelize.col('agency_detail.short_name', 'ASC'))
        // (sequelize.col('agency_detail->m_state.state_name', 'ASC')),
        [sequelize.fn('lower', sequelize.col('agency_detail.agency_name')), 'ASC'],
        // (sequelize.col('agency_detail.latitute', 'ASC')),
        // (sequelize.col('agency_detail.longitute', 'ASC'))

      ];

      let data = await userModel.findAndCountAll(condition);

      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      console.log(error);
      return response(res, status.DATA_NOT_SAVE, 500, error);
    }
  }
  static getDistrictSeedTestingReport = async (req, res) => {
    try {

      const usertype = req.query.usertype;
      console.log(usertype)
      let condition = {

        // attributes: ['name', 'mobile_number', 'email_id', 'mobile_number',],
        include: [
          {
            model: districtModel,
            left: false,
            raw: false,

            // attributes: ['address','agency_name' ],


          },

        ],
        where: {
          state_id: req.body.search.state_id
        },
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('m_district.district_name')), 'district_name'],
        ],
        raw: true
      }

      let { page, pageSize, searchData } = req.body;

      // if (page === undefined) page = 1;
      // if (pageSize === undefined) pageSize = 10;
      // if (page > 0 && pageSize > 0) {
      //   condition.limit = pageSize;
      //   condition.offset = (page * pageSize) - pageSize;
      // }

      //       if (req.body.search) {


      // console.log(' req.body.search.state_id', req.body.search.state_id)
      //         if (req.body.search.state_id) {
      //           condition.where['state_id'] = req.body.search.state_id;
      //         }


      //       }



      // const sortOrder = req.body.sort ? req.body.sort : 'id';
      // const sortDirection = req.body.order ? req.body.order : 'DESC';

      // condition.order = [[sortOrder, sortDirection]];

      condition.order = [


        (sequelize.col('m_district.district_name', 'ASC')),


      ];

      let data = await seedLabTestModel.findAndCountAll(condition);

      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      console.log(error);
      return response(res, status.DATA_NOT_SAVE, 500, error);
    }
  }
  static updateusertable = async (req, res) => {
    let returnResponse = {};
    let internalCall = {};
    let mobileno;
    try {
      let existingAgencyData = undefined;
      let existingData = undefined;
      if (req.body.mobile_number) {
        mobileno = req.body.mobile_number;
      } else if (req.body.mobile) {
        mobileno = req.body.mobile;
      }
      console.log(mobileno, 'mobileno')
      let tabledAlteredSuccessfully = false;
      const id = parseInt(req.body.id);
      let condition = {
        where: {
          id: id
        }
      }
      let usersData = {
        agency_name: (req.body.agency_name).toUpperCase(),
        updated_by: req.body.updated_by,
        category: req.body.category_agency,
        state_id: req.body.state,
        district_id: req.body.district,


        contact_person_name: req.body.contact_person_name,
        contact_person_designation: req.body.contact_person_designation_id,
        contact_person_designation: req.body.contact_person_designation,
        // contact_person_mobile: req.body.mobile_number,
        phone_number: req.body.phone,
        fax_no: req.body.fax_number,

        email: req.body.email,
        bank_name: req.body.bank_name,
        bank_branch_name: req.body.bank_branch_name,
        bank_ifsc_code: req.body.bank_ifsc_code,
        bank_account_number: req.body.bank_account_number,
        created_by: req.body.created_by,
        // state_id: req.body.state_id,
        // district_id: req.body.district_id,
        mobile_number: mobileno,
        pincode: req.body.pincode,
        is_active: req.body.active
      };


      existingAgencyData = await agencyDetailModel.findAll({
        where: {
          [Op.and]: [
            {
              where: sequelize.where(
                sequelize.fn('lower', sequelize.col('agency_name')),
                sequelize.fn('lower', req.body.agency_name),

                // created_by:{[Op.and]:req.body.createdby}
              ),
              created_by: { [Op.eq]: req.body.created_by },
              id: { [Op.ne]: id },


            },



          ]
        },



      });
      if (existingAgencyData && existingAgencyData.length) {
        returnResponse = {
          error: 'Agency Name Already exist'
        }
        return response(res, status.DATA_NOT_SAVE, 401, returnResponse)
      }






      if (existingData === undefined || existingData.length < 1) {
        // const data = await agencyDetailModel.update(usersData, condition);
        // console.log('hiii')
        const updateUsertableData = {
          name: (req.body.agency_name).toUpperCase(),

          email_id: req.body.email,

        }
        const user_data = await userModel.update(updateUsertableData, { where: { id: req.body.id } })
        tabledAlteredSuccessfully = true;
        //createUser()
      }


      if (tabledAlteredSuccessfully) {
        return response(res, status.DATA_SAVE, 200, returnResponse, internalCall)
      } else {
        return response(res, status.DATA_NOT_SAVE, 401, returnResponse, internalCall)
      }
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_SAVE, 500, error)
    }
  }

  static getCropNameofSeedMultiplictionRatioReport = async (req, res) => {
    try {
      let { page, pageSize, search, isReport } = req.body;
      let cropGroup;
      if (req.body.loginedUserid.user_type === "OILSEEDADMIN") {
        cropGroup = { crop_code: { [Op.like]: 'A04%' } };
      }
      let condition = {
        include: [
          {
            model: cropModel,

            left: true,
            attributes: ['crop_name', 'crop_code']
          },

        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('m_crop.crop_name')), 'cropName'],
        ],
        raw: true,
        where: {
          crop_group_code: req.body.search.cropGroupCode,
          ...cropGroup
        }
      }


      // if (page === undefined) page = 1;
      // if (pageSize === undefined) pageSize = 10;

      // if (page > 0 && pageSize > 0) {
      //   condition.limit = pageSize;
      //   condition.offset = (page * pageSize) - pageSize;
      // }

      if (!isReport) {
        if (page === undefined) page = 1;
        if (pageSize === undefined) pageSize = 10;
  
        if (page > 0 && pageSize > 0) {
          condition.limit = pageSize;
          condition.offset = (page * pageSize) - pageSize;
        }
      }
      else
      {
        
      }

      // const sortOrder = req.body.sort ? req.body.sort : 'id';
      // const sortDirection = req.body.order ? req.body.order : 'DESC';

      condition.order = [[sequelize.col('m_crop.crop_name'), 'asc']];

      // if (req.body.search) {
      //   if (req.body.search.cropGroupCode) {
      //     // condition.include[0].where = {};
      //     condition.include.where.crop_group_code= req.body.search.cropGroupCode
      //   }


      // }

      const data = await seedMultiplicationRatioModel.findAndCountAll(condition);
      if (!data) {
        return response(res, status.DATA_NOT_AVAILABLE, 404);
      }

      return response(res, status.DATA_AVAILABLE, 200, data);
    }
    catch (error) {
      const returnResponse = {
        message: error.message,
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }

  static getCropNameofMaximumLotsizeReport = async (req, res) => {
    try {
      let { page, pageSize, search } = req.body;
      let cropGroup;
      if (req.body.loginedUserid.user_type === "OILSEEDADMIN") {
        cropGroup = { crop_code: { [Op.like]: 'A04%' } };
      }
      let condition = {
        include: [
          {
            model: cropModel,

            left: true,
            attributes: ['crop_name', 'crop_code']
          },

        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('m_crop.crop_name')), 'crop_name'],
        ],
        raw: true,
        where: {
          ...cropGroup
        }
      }
      if (page === undefined) page = 1;
      if (pageSize === undefined) pageSize = 10;

      if (page > 0 && pageSize > 0) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }

      // const sortOrder = req.body.sort ? req.body.sort : 'id';
      // const sortDirection = req.body.order ? req.body.order : 'DESC';

      condition.order = [[sequelize.col('m_crop.crop_name'), 'asc']];

      if (req.body.search) {
        if (req.body.search.cropGroupCode) {
          condition.include[0].where = {};
          condition.include[0].where.group_code = req.body.search.cropGroupCode;
          // condition.where.include[0]={}

          // condition.where.group_code = req.body.search.cropGroupCode
        }
      }

      const data = await maxLotSizeModel.findAndCountAll(condition);
      if (!data) {
        return response(res, status.DATA_NOT_AVAILABLE, 404);
      }

      return response(res, status.DATA_AVAILABLE, 200, data);
    }
    catch (error) {
      const returnResponse = {
        message: error.message,
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }
  static checksmrcropgroupisAlreayexit = async (req, res) => {
    try {
      let { page, pageSize, search } = req.body;

      let condition = {
        include: [
          // {
          //   model: cropModel,

          //   left: true,
          //   attributes: ['crop_name','crop_code']
          // },

        ],

        where: {}
      }
      if (page === undefined) page = 1;
      if (pageSize === undefined) pageSize = 10;

      if (page > 0 && pageSize > 0) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }

      // const sortOrder = req.body.sort ? req.body.sort : 'id';
      // const sortDirection = req.body.order ? req.body.order : 'DESC';

      // condition.order = [[sequelize.col('m_crop.crop_name'), 'asc']];

      if (req.body.search) {
        if (req.body.search.cropGroupCode) {

          condition.where.crop_group_code = req.body.search.cropGroupCode
        }


      }

      const data = await seedMultiplicationRatioModel.findAndCountAll(condition);
      console.log(data.rows.length);

      if (!data) {
        return response(res, status.DATA_NOT_AVAILABLE, 400);
      }
      else {
        return response(res, status.DATA_AVAILABLE, 200, data);
      }


    }
    catch (error) {
      const returnResponse = {
        message: error.message,
      };
      console.log(error)
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }
  static getPlantDeatilsState = async (req, res) => {
    try {
      let { page, pageSize, search } = req.body;

      let condition = {
        include: [
          {
            model: stateModel,
            attributes: [],
            left: true,
          },


        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('m_state.state_name')), 'state_name'],
          [sequelize.col('m_state.state_code'), 'state_code']
        ],
        raw: true,

        // where: {
        //   state_id : req.body.search.state_code
        // }
      }
      condition.order = [[sequelize.col('m_state.state_name'), 'ASC']];
      const data = await plantDetail.findAndCountAll(condition);
      if (!data) {
        return response(res, status.DATA_NOT_AVAILABLE, 404);
      }

      return response(res, status.DATA_AVAILABLE, 200, data);


    }
    catch (error) {
      const returnResponse = {
        message: error.message,
      };
      console.log(error)
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }
  static getPlantDeatilsDistrict = async (req, res) => {
    try {
      let { page, pageSize, search } = req.body;

      let condition = {
        include: [
          {
            model: districtModel,
            attributes: [],

            left: true,
            // attributes: ['crop_name','crop_code']
          },
          {
            model: userModel,
            attributes: [],
            where: {
              user_type: 'SPP'
            },
            left: true,
            // attributes: ['crop_name','crop_code']
          },

        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('m_district.district_code')), 'district_code'],
          [sequelize.col('m_district.district_name'), 'district_name']
        ],
        raw: true,
        order: [[sequelize.col('m_district.district_name'), 'ASC']],
        where: {
          state_id: req.body.search.state_code
        }
      }

      const data = await agencyDetailModel.findAndCountAll(condition);
      if (!data) {
        return response(res, status.DATA_NOT_AVAILABLE, 404);
      }

      return response(res, status.DATA_AVAILABLE, 200, data);


    }
    catch (error) {
      const returnResponse = {
        message: error.message,
      };
      console.log(error)
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }
  static getPlantDeatilsNameofInstution = async (req, res) => {
    try {
      let { page, pageSize, search } = req.body;

      let condition = {
        include: [
          {
            model: userModel,
            where: {
              user_type: 'SPP'
            }
          }
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('agency_details.agency_name')), 'plant_name'],
        ],
        raw: true,
        where: {
          state_id: req.body.search.state_id,
          district_id: req.body.search.district_id,
        }
      }
      // if (page === undefined) page = 1;
      // if (pageSize === undefined) pageSize = 10;

      // if (page > 0 && pageSize > 0) {
      //   condition.limit = pageSize;
      //   condition.offset = (page * pageSize) - pageSize;
      // }

      // const sortOrder = req.body.sort ? req.body.sort : 'id';
      // const sortDirection = req.body.order ? req.body.order : 'DESC';

      // condition.order = [[sequelize.col('m_crop.crop_name'), 'asc']];

      // if (req.body.search) {
      //   if (req.body.search.cropGroupCode) {

      //     condition.where.crop_group_code = req.body.search.cropGroupCode
      //   }


      // }
      condition.order = [[sequelize.col('agency_details.agency_name'), 'ASC']];

      // condition.order[[sequelize.col('plant_name'),'ASC']]

      const data = await agencyDetailModel.findAndCountAll(condition);
      if (!data) {
        return response(res, status.DATA_NOT_AVAILABLE, 404);
      }

      return response(res, status.DATA_AVAILABLE, 200, data);


    }
    catch (error) {
      const returnResponse = {
        message: error.message,
      };
      console.log(error)
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }

  static getProjectPoordinatorreportName = async (req, res) => {
    try {
      let condition = {
        include: [
          {
            model: userModel,
            where: {
              user_type: 'BR'
            }
          }
        ],
        where: {
          state_id: req.body.search.state_id
        },
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('agency_name')), 'agency_name'],
          'id'
        ]


      }

      let { page, pageSize, search } = req.body;
      // console.log(search[0].value,'search')

      // if (pageSize === undefined) pageSize = 5; // set pageSize to -1 to prevent sizing
      // if (page > 0 && pageSize > 0) {
      //   condition.limit = pageSize;
      //   condition.offset = (page * pageSize) - pageSize;
      // }
      //implement sort
      const sortOrder = req.body.sort ? req.body.sort : 'id';
      const sortDirection = req.body.order ? req.body.order : 'DESC';
      //sort condition
      condition.order = [['agency_name', 'asc']];




      let data = await agencyDetailModel.findAndCountAll(condition);
      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }

    }
    catch (error) {
      console.log(error)
      return response(res, status.DATA_NOT_AVAILABLE, 500, error);
    }
  }

  static getseedMultRatioSeedUniqueCropDataincropModel = async (req, res) => {
    try {
      let condition = {
        // include:[
        //   {
        //     model:cropModel,
        //     where:{
        //       [Op.and]: [
        //         {
        //           group_code: {
        //             [Op.eq]: req.body.group
        //           }

        //         },
        //         {
        //           crop_code: {
        //             [Op.notIn]: req.body.crop_code
        //           }

        //         }

        //       ]
        //     }

        //   }


        // ],

        // required:true,
        where: {
          [Op.and]: [
            {
              group_code: {
                [Op.eq]: req.body.search.group_code
              }

            },
            {
              is_active: {
                [Op.eq]: 1
              }
            }
            // {
            //   crop_code: {
            //     [Op.in]: req.body.crop_code
            //   }

            // }

          ]

        }
      }

      let { page, pageSize, search } = req.body;
      // console.log(search[0].value,'search')
      if (page === undefined) page = 1;
      // if (pageSize === undefined) pageSize = 5; // set pageSize to -1 to prevent sizing
      // if (page > 0 && pageSize > 0) {
      //   condition.limit = pageSize;
      //   condition.offset = (page * pageSize) - pageSize;
      // }
      //implement sort
      const sortOrder = req.body.sort ? req.body.sort : 'id';
      const sortDirection = req.body.order ? req.body.order : 'DESC';
      //sort condition
      condition.order = [[sortOrder, sortDirection]];

      // sequelize.query(
      //   `SELECT crop_code FROM m_crop
      //    UNION
      //    SELECT  crop_code FROM seed_multiplication_ratios where crop_group_code = ${search[0].value}`,
      //   { type: QueryTypes.SELECT }
      // );
      // if (search) {
      //   condition.where = {};
      //   for (let index = 0; index < search.length; index++) {
      //     const element = search[index];

      //     // if (element.columnNameInItemList.toLowerCase() == "year.value") {
      //     //   condition.where["year"] = element.value;
      //     // }
      //     if (element.columnNameInItemList.toLowerCase() == "crop.value") {
      //       condition.where["group_code"] = element.value;
      //     }
      //     // if (element.columnNameInItemList.toLowerCase() == "variety.value") {
      //     //   condition.where["variety_id"] = element.value;
      //     // }
      //     // if (element.columnNameInItemList.toLowerCase() == "id") {
      //     //   condition.where["id"] = element.value;
      //     // }
      //   }
      // }
      // if (req.body.search) {

      //   if (req.body.search.group_code) {
      //     condition.where.group_code = (req.body.search.group_code);
      //   }

      // }
      let data = await cropModel.findAndCountAll(condition);
      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }

    }
    catch (error) {
      console.log(error)
      return response(res, status.DATA_NOT_AVAILABLE, 500, error);
    }
  }

  static getseedMultRatioSeedUniqueCropData = async (req, res) => {
    try {
      let newdata = []
      let groupcode;
      if (req.body.search) {

        for (let index = 0; index < req.body.search.length; index++) {
          const element = req.body.search[index];
          // console.log(element.smr_crop_code)
          newdata = element.smr_crop_code;
          groupcode = element.value

        }
      }
      console.log('newdata', newdata)
      let condition = {
        // required:true,

        // where: {
        //   is_active: 1,
        //   [Op.notIn]:req.body.search.smr_crop_code

        // }

        where: {
          [Op.and]: [
            {
              is_active: {
                [Op.eq]: 1
              }

            },
            {
              group_code: {
                [Op.eq]: groupcode
              }

            },
            {
              crop_name: {
                [Op.notIn]: newdata
              }

            },

          ]
        },



      }
      console.log('smr_crop_code', req.body.smr_crop_code)

      let { page, pageSize, search } = req.body;
      // console.log(search[0].value,'search')
      // if (page === undefined) page = 1;
      // if (pageSize === undefined) pageSize = 5; // set pageSize to -1 to prevent sizing
      // if (page > 0 && pageSize > 0) {
      //   condition.limit = pageSize;
      //   condition.offset = (page * pageSize) - pageSize;
      // }
      //implement sort
      const sortOrder = req.body.sort ? req.body.sort : 'crop_name';
      const sortDirection = req.body.order ? req.body.order : 'ASC';
      //sort condition
      condition.order = [[sortOrder, sortDirection]];

      // sequelize.query(
      //   `SELECT crop_code FROM m_crop
      //    UNION
      //    SELECT  crop_code FROM seed_multiplication_ratios where crop_group_code = ${search[0].value}`,
      //   { type: QueryTypes.SELECT }
      // );
      // if (search) {
      //   condition.where = {};
      //   for (let index = 0; index < search.length; index++) {
      //     const element = search[index];
      //     console.log(element.smr_crop_code)

      //     if (element.columnNameInItemList.toLowerCase() == "year.value") {
      //       condition.where["year"] = element.value;
      //     }
      //     if (element.columnNameInItemList.toLowerCase() == "crop.value") {
      //       condition.where["crop_group_code"] = element.value;
      //     }
      //     if (element.columnNameInItemList.toLowerCase() == "variety.value") {
      //       condition.where["variety_id"] = element.value;
      //     }
      //     if (element.columnNameInItemList.toLowerCase() == "id") {
      //       condition.where["id"] = element.value;
      //     }

      //   }
      // }
      // if (req.body.search) {
      //   if (req.body.search.year) {
      //     condition.where.year = (req.body.search.year);
      //   }
      //   if (req.body.search.crop_code) {
      //     condition.where.crop_code = (req.body.search.crop_code);
      //   }

      // }
      let data = await cropModel.findAndCountAll(condition);
      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      console.log(error)
      return response(res, status.DATA_NOT_AVAILABLE, 500, error);
    }

  }

  static getseedMultRatioSeedUniqueCropDataincropModelsecond = async (req, res) => {
    try {
      let condition = {
        // include:[
        //   {
        //     model:cropModel,
        //     where:{
        //       [Op.and]: [
        //         {
        //           group_code: {
        //             [Op.substring]: req.body.search.group_code
        //           }

        //         },
        //         // {
        //         //   crop_code: {
        //         //     [Op.notIn]: req.body.crop_code
        //         //   }

        //         // }

        //       ]
        //     }

        //   }


        // ],

        // required:true,
        // where:{
        //   [Op.and]: [
        //     {
        //       crop_group_code: {
        //         [Op.eq]: req.body.search.group_code
        //       }

        //     },
        //     // {
        //     //   crop_code: {
        //     //     [Op.in]: req.body.crop_code
        //     //   }

        //     // }

        //   ],
        // // raw:true
        // },
        //         attributes:[
        //          `(
        //           SELECT 
        //    *,
        //    (
        //       SELECT COUNT(*)
        //       FROM reactions AS reaction
        //       WHERE reaction.postId = post.id
        //       AND reaction.type = “Laugh”
        //    ) AS laughReactionsCount
        // FROM posts AS post
        //          )` 
        //         //   // [sequelize.fn('DISTINCT', sequelize.col('m_crop.crop_code')), 'crop_code'],
        //         //   // [sequelize.fn('DISTINCT', sequelize.col('crop_code')), 'crop_code'],
        //         ]
        // raw:true
      }

      let { page, pageSize, search } = req.body;
      // console.log(search[0].value,'search')
      if (page === undefined) page = 1;
      if (pageSize === undefined) pageSize = 5; // set pageSize to -1 to prevent sizing
      if (page > 0 && pageSize > 0) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }
      //implement sort
      const sortOrder = req.body.sort ? req.body.sort : 'id';
      const sortDirection = req.body.order ? req.body.order : 'DESC';
      //sort condition
      // condition.order = [[sortOrder, sortDirection]];

      // sequelize.query(
      //   `SELECT crop_code FROM m_crop
      //    UNION
      //    SELECT  crop_code FROM seed_multiplication_ratios where crop_group_code = ${search[0].value}`,
      //   { type: QueryTypes.SELECT }
      // );
      // if (search) {
      //   condition.where = {};
      //   for (let index = 0; index < search.length; index++) {
      //     const element = search[index];

      //     // if (element.columnNameInItemList.toLowerCase() == "year.value") {
      //     //   condition.where["year"] = element.value;
      //     // }
      //     if (element.columnNameInItemList.toLowerCase() == "crop.value") {
      //       condition.where["group_code"] = element.value;
      //     }
      //     // if (element.columnNameInItemList.toLowerCase() == "variety.value") {
      //     //   condition.where["variety_id"] = element.value;
      //     // }
      //     // if (element.columnNameInItemList.toLowerCase() == "id") {
      //     //   condition.where["id"] = element.value;
      //     // }
      //   }
      // }
      // if (req.body.search) {

      //   if (req.body.search.group_code) {
      //     condition.where.group_code = (req.body.search.group_code);
      //   }

      // }
      // let data = await seedMultiplicationRatioModel.findAll(condition
      // include:{
      //   model:cropModel,
      //   // where:{group_code :  req.body.search.group_code}
      //   where:{
      //       [Op.and]: [
      //     {
      //       crop_group_code: {
      //         [Op.substring]: req.body.search.group_code
      //       }

      //     },
      //     // {
      //     //   crop_code: {
      //     //     [Op.in]: req.body.crop_code
      //     //   }

      //     // }

      //   ],
      //   }
      // },
      // where:{

      // }

      //   {
      //   attributes:[[sequelize.literal('DISTINCT "seed_multiplication_ratios".crop_code'), 'seed_multiplication_ratios.crop_code']],
      // }
      // );
      // SELECT crop_code FROM seed_multiplication_ratios  UNION   SELECT crop_code FROM m_crops
      const data = await db.sequelize.query(`SELECT crop_name,crop_code,crop_group_code FROM seed_multiplication_ratios WHERE crop_group_code='A01'  UNION   SELECT crop_name,crop_code,group_code FROM m_crops WHERE group_code='A01' `)



      console.log(data, 'nonMatchingRows');

      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }

    }
    catch (error) {
      console.log(error)
      return response(res, status.DATA_NOT_AVAILABLE, 500, error);
    }

  }


  static getBspcCode = async (req, res) => {
    try {
      let { page, pageSize, search } = req.body;

      let condition = {


        raw: true,

        where: {
          agency_id: req.body.search.agency_id,

        }
      }


      const data = await userModel.findAndCountAll(condition);
      if (!data) {
        return response(res, status.DATA_NOT_AVAILABLE, 404);
      }

      return response(res, status.DATA_AVAILABLE, 200, data);


    }
    catch (error) {
      const returnResponse = {
        message: error.message,
      };
      console.log(error)
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }

  static getCropName = async (req, res) => {
    let data = {};
    try {
      let condition = {
        where: {


        },
        raw: false,
        attributes: [
          [sequelize.literal('DISTINCT(crop_name)'), 'crop_name'],
          // [sequelize.fn('DISTINCT', sequelize.col('crop_name')) ,'crop_name'],
          // 'crop_code'

          [sequelize.col('crop_code'), 'crop_code'],
        ],

      };
      condition.order = [['crop_name', 'asc']];
      if (req.body.search) {
        if (req.body.search.group_code) {
          condition.where.group_code = (req.body.search.group_code);
        }
      }
      data = await cropModel.findAll(condition);

      // res.send(data)

      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getIndentorStateList = async (req, res) => {
    try {
      let condition = {
        include: [
          {
            model: userModel,
            attributes: [],
            left: true,
            where: {
              'user_type': 'IN'
              // [sequelize.col('user.user_type')]:'IN'
            }

          },
          {
            model: stateModel,
            attributes: [],
            left: true,


          },


        ],

        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('m_state.state_name')), 'state_name'],
          [sequelize.col('m_state.state_code'), 'state_code'],

        ],
        raw: true

      }



      // if (req.body.search) {
      //   if (req.body.search.state_id) {
      //     condition.where.state_id = req.body.search.state_id;
      //   }

      // }
      // condition.order = [['agency_name', 'ASC']];
      condition.order = [[sequelize.col('m_state.state_name'), 'ASC']];
      let data = await agencyDetailModel.findAndCountAll(condition);


      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      return response(res, status.DATA_NOT_AVAILABLE, 500, error);
    }
  }
  static getSeedTestingStateList = async (req, res) => {
    try {
      let { page, pageSize, search } = req.body;

      let condition = {
        include: [
          {
            model: stateModel,

            left: true,
            attributes: []
          },


        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('m_state.state_code')), 'state_code'],
          [sequelize.col('m_state.state_name'), 'state_name']
          // [sequelize.fn('DISTINCT', sequelize.col('m_state.state_c')), 'state_code'],
        ],
        raw: true,
      }
      condition.order = [[sequelize.col('m_state.state_name'), 'ASC']]
      const data = await seedLabTestModel.findAndCountAll(condition);
      if (!data) {
        return response(res, status.DATA_NOT_AVAILABLE, 404);
      }

      return response(res, status.DATA_AVAILABLE, 200, data);


    }
    catch (error) {
      const returnResponse = {
        message: error.message,
      };
      console.log(error)
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }
  static getProjectCoordinatorStateList = async (req, res) => {
    try {
      let condition = {
        include: [
          {
            model: userModel,
            attributes: [],
            left: true,
            where: {
              'user_type': 'BR'
              // [sequelize.col('user.user_type')]:'IN'
            }
          },
          {
            model: stateModel,
            left: true,
          },
        ],

        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('m_state.state_name')), 'state_name'],
          [sequelize.col('m_state.state_code'), 'state_code']
        ],
        raw: true

      }

      condition.order = [[sequelize.col('m_state.state_name'), 'ASC']];
      let data = await agencyDetailModel.findAndCountAll(condition);


      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      return response(res, status.DATA_NOT_AVAILABLE, 500, error);
    }
  }
  static getBspcStateList = async (req, res) => {
    try {
      let condition = {
        include: [
          {
            model: userModel,
            attributes: [],
            left: true,
            where: {
              'user_type': 'BPC'
              // [sequelize.col('user.user_type')]:'IN'
            }

          },
          {
            model: stateModel,
            left: true,


          },


        ],
        where: {
          [Op.and]: [{ state_id: { [Op.ne]: null } }]
          // 'users.user_type' : 'IN'
          // [sequelize.col('user.user_type')]:'IN'
        },
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('m_state.state_code')), 'state_code'],
          [sequelize.col('m_state.state_name'), 'state_name']
          // [sequelize.fn('DISTINCT', sequelize.col('agency_name')), 'agency_name'],
          // 'id'
        ],
        raw: true

      }


      condition.order = [[sequelize.col('m_state.state_name'), 'ASC']];
      let data = await agencyDetailModel.findAndCountAll(condition);


      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      return response(res, status.DATA_NOT_AVAILABLE, 500, error);
    }
  }

  static getMaximumCropNameList = async (req, res) => {
    try {
      let condition = {
        include: [
          {
            model: cropModel,
          }

        ],

        where: {
          group_code: req.body.search.group_code
        },
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('m_crop.crop_name')), 'crop_name'],

        ],
        raw: true


      }

      condition.order = [[sequelize.col('m_crop.crop_name'), 'ASC']];
      let data = await maxLotSizeModel.findAndCountAll(condition);


      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      console.log('err', error)
      return response(res, status.DATA_NOT_AVAILABLE, 500, error);
    }
  }
  static getdistinctMaximumCropNameList = async (req, res) => {
    try {
      let condition = {


        where: {
          [Op.and]: [
            {
              group_code: {
                [Op.eq]: req.body.search.group_code
              }

            },
            {
              crop_name: {
                [Op.notIn]: req.body.search.crop_code
              }

            },
            {
              is_active: {
                [Op.eq]: 1
              }

            }
          ]
        },

        // raw:true,

      }

      condition.order = [[sequelize.col('m_crop.crop_name'), 'ASC']];
      let data = await cropModel.findAndCountAll(condition);


      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      console.log('err', error)
      return response(res, status.DATA_NOT_AVAILABLE, 500, error);
    }
  }
  static deletesmrlistdata = async (req, res) => {
    try {

      seedMultiplicationRatioModel.destroy({
        where: {
          id: req.body.id
        },
      });
      // const userData = await userModel.destroy({
      //   where: {
      //     agency_id: req.body.id,
      //     user_type: 'IN'
      //   }
      // });
      response(res, status.DATA_DELETED, 200, {});
    }
    catch (error) {
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    }
  }
  static deletemaximumlistdata = async (req, res) => {
    try {

      maxLotSizeModel.destroy({
        where: {
          id: req.body.id
        },
      });
      // const userData = await userModel.destroy({
      //   where: {
      //     agency_id: req.body.id,
      //     user_type: 'IN'
      //   }
      // });
      response(res, status.DATA_DELETED, 200, {});
    }
    catch (error) {
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    }
  }
  static deleteLabtestlistdata = async (req, res) => {
    try {

      seedLabTestModel.destroy({
        where: {
          id: req.body.id
        },
      });
      // const userData = await userModel.destroy({
      //   where: {
      //     agency_id: req.body.id,
      //     user_type: 'IN'
      //   }
      // });
      response(res, status.DATA_DELETED, 200, {});
    }
    catch (error) {
      return response(res, status.DATA_NOT_AVAILABLE, 404)
    }
  }
  static getIndentorDistrictList = async (req, res) => {
    try {
      let condition = {
        include: [
          {
            model: userModel,
            attributes: [],
            left: true,
            where: {
              'user_type': 'IN'
            }
          },
          {
            model: districtModel,
            attributes: [],
            left: true,
          },
        ],
        where: {
          state_id: req.body.search.state,
          [Op.and]: [

            {
              district_id: {
                [Op.ne]: null
              }
            },
            // {
            //   district_id: {
            //     [Op.ne]: ""
            //   }
            // }
          ]
        },
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('m_district.district_code')), 'district_code'],
          [sequelize.col('m_district.district_name'), 'district_name']
        ],
        raw: true
      }
      condition.order = [[sequelize.col('m_district.district_name'), 'ASC']];
      let data = await agencyDetailModel.findAndCountAll(condition);


      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      console.log(error)
      return response(res, status.DATA_NOT_AVAILABLE, 500, error);
    }
  }

  static getCropdatainseedmutiplicationRatio = async (req, res) => {
    try {
      let condition = {

        where: {
          crop_group_code: req.body.search.group_code

          // 'users.user_type' : 'IN'
          // [sequelize.col('user.user_type')]:'IN'
        },
        // attributes: [
        //   [sequelize.fn('DISTINCT', sequelize.col('crop_group_code')), 'crop_group_code'],
        //   'crop_name','crop_code'
        //   // [sequelize.fn('DISTINCT', sequelize.col('agency_name')), 'agency_name'],
        //   // 'id'
        // ],
        raw: true

      }



      // if (req.body.search) {
      //   if (req.body.search.state_id) {
      //     condition.where.state_id = req.body.search.state_id;
      //   }

      // }
      // condition.order = [['agency_name', 'ASC']];
      // condition.order = [[sequelize.col('m_district.district_name'), 'ASC']];
      let data = await seedMultiplicationRatioModel.findAndCountAll(condition);


      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      console.log(error)
      return response(res, status.DATA_NOT_AVAILABLE, 500, error);
    }
  }

  static getIndentorStateSppDetails = async (req, res) => {
    try {
      let condition = {
        include: [
          {
            model: userModel,
            left: true,
            where: {
              'user_type': 'SPA'
              // [sequelize.col('user.user_type')]:'IN'
            }

          },
          {
            model: stateModel,
            left: true,


          },


        ],
        where: {

          // 'users.user_type' : 'IN'
          // [sequelize.col('user.user_type')]:'IN'
        },
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('m_state.state_name')), 'state_name'],
          // [sequelize.fn('DISTINCT', sequelize.col('agency_name')), 'agency_name'],
          // 'id'
        ],
        raw: true

      }



      // if (req.body.search) {
      //   if (req.body.search.state_id) {
      //     condition.where.state_id = req.body.search.state_id;
      //   }

      // }
      // condition.order = [['agency_name', 'ASC']];
      condition.order = [[sequelize.col('m_state.state_name'), 'ASC']];
      let data = await agencyDetailModel.findAndCountAll(condition);


      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      return response(res, status.DATA_NOT_AVAILABLE, 500, error);
    }
  }
  static getIndentorDistrictSppList = async (req, res) => {
    try {
      let condition = {
        include: [
          {
            model: userModel,
            left: true,
            where: {
              'user_type': 'SPA'
              // [sequelize.col('user.user_type')]:'IN'
            }

          },
          {
            model: districtModel,
            left: true,


          },


        ],
        where: {
          state_id: req.body.search.state

          // 'users.user_type' : 'IN'
          // [sequelize.col('user.user_type')]:'IN'
        },
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('m_district.district_name')), 'district_name'],
          // [sequelize.fn('DISTINCT', sequelize.col('agency_name')), 'agency_name'],
          // 'id'
        ],
        raw: true

      }



      // if (req.body.search) {
      //   if (req.body.search.state_id) {
      //     condition.where.state_id = req.body.search.state_id;
      //   }

      // }
      // condition.order = [['agency_name', 'ASC']];
      condition.order = [[sequelize.col('m_district.district_name'), 'ASC']];
      let data = await agencyDetailModel.findAndCountAll(condition);


      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      console.log(error)
      return response(res, status.DATA_NOT_AVAILABLE, 500, error);
    }
  }
  static getAgencyDetailsIndentorSppName = async (req, res) => {
    try {
      let condition = {
        include: [
          {
            model: userModel,
            left: true,
            where: {
              'user_type': 'SPA'
              // [sequelize.col('user.user_type')]:'IN'
            }

          },


        ],
        where: {

          // 'users.user_type' : 'IN'
          // [sequelize.col('user.user_type')]:'IN'
        },
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('agency_details.agency_name')), 'agency_name'],
          // [sequelize.fn('DISTINCT', sequelize.col('agency_name')), 'agency_name'],
          'id'
        ],

      }



      if (req.body.search) {
        if (req.body.search.state_id) {
          condition.where.state_id = req.body.search.state_id;
        }

        if (req.body.search.district_id) {
          condition.where.district_id = req.body.search.district_id;
        }
      }
      condition.order = [['agency_name', 'ASC']];

      let data = await agencyDetailModel.findAndCountAll(condition);


      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      return response(res, status.DATA_NOT_AVAILABLE, 500, error);
    }
  }
  static getCropNameData = async (req, res) => {
    try {
      let condition = {}
      let data;
      if (req.body.cropName) {

        data = await db.sequelize.query(`SELECT * FROM m_crops where lower(crop_name) LIKE '${req.body.cropName}%'`)
      }

      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      console.log(error)
      return response(res, status.DATA_NOT_AVAILABLE, 500, error);
    }
  }
  static getCropNameDataAlreadyExit = async (req, res) => {
    try {
      let condition = {}
      if (req.body.search.id) {

        condition = {

          where: {
            [Op.and]: [
              sequelize.where(
                sequelize.fn('lower', sequelize.col('crop_name')),
                sequelize.fn('lower', req.body.search.cropName),
              ),
              {
                id: {
                  [Op.ne]: req.body.search.id
                }

              }
              // sequelize.where(sequelize.col('crop_group'), req.body.search.crop_group),
            ],

          },



        }

      }
      else {
        condition = {

          where: {
            [Op.and]: [
              sequelize.where(
                sequelize.fn('lower', sequelize.col('crop_name')),
                sequelize.fn('lower', req.body.search.cropName),
              ),

              // sequelize.where(sequelize.col('crop_group'), req.body.search.crop_group),
            ],

          },



        }
      }




      let data = await cropModel.findAndCountAll(condition);


      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      console.log(error)
      return response(res, status.DATA_NOT_AVAILABLE, 500, error);
    }
  }
  static getVarietyNameData = async (req, res) => {
    try {
      let condition = {}

      // condition = {

      //   where: {
      //     [Op.and]: [
      //       {
      //         variety_name: {
      //           [Op.like]: '%' + req.body.variety_name + '%'
      //         }

      //       },             
      //     ]
      //   },
      //   attributes:['variety_name']
      // }     
      // let data = await cropVerietyModel.findAndCountAll(condition);
      let data;
      if (req.body.variety_name) {

        data = await db.sequelize.query(`SELECT * FROM m_crop_varieties where lower(variety_name) LIKE '${req.body.variety_name}%'`)
      }
      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      console.log(error)
      return response(res, status.DATA_NOT_AVAILABLE, 500, error);
    }
  }
  static getOtherData = async (req, res) => {
    try {
      let condition = {
        where: {
          characterstics_id: req.query.characterstics_id
        },

      }
      let data = await otherFertilizerModel.findAndCountAll(condition);

      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      return response(res, status.DATA_NOT_AVAILABLE, 500, error);
    }
  }
  static getSeedCharactersticsCropGroupData = async (req, res) => {

    let returnResponse = {};
    try {
      let condition = {
        include: [
          {
            model: cropModel,
            attributes: [],
            include: [
              {
                model: cropGroupModel,
                attributes: [],
              }
            ]
          },

        ],
        where: {
          [Op.or]: [
            {
              crop_code: {
                [Op.ne]: null
              }

            },
            {
              crop_code: {
                [Op.ne]: ""
              }

            }

          ]
        },
        attributes: [
          // [sequelize.fn('DISTINCT', sequelize.col('m_crop->m_crop_group.group_code')), 'group_code'],
          // [sequelize.fn('DISTINCT', sequelize.col('m_crop->m_crop_group.group_code')), 'group_code'],
          [sequelize.col('m_crop->m_crop_group.group_code'), 'group_code'],
          [sequelize.col('m_crop->m_crop_group.group_name'), 'group_name'],
          // 'id'

        ],
        group: [
          [sequelize.col('m_crop->m_crop_group.group_code'), 'group_code'],
          [sequelize.col('m_crop->m_crop_group.group_name'), 'group_name'],
          // [sequelize.col('m_crop_varieties.id'), 'id'],
        ],
        get group() {
          return this._group;
        },
        set group(value) {
          this._group = value;
        },
        // m_crop->m_crop_group
      };

      let { search } = req.body;

      if (search) {
        condition.where = {};
        if (req.body.search.type == 'reporticar') {
          if (req.body.search.user_type == 'ICAR') {
            condition.where.crop_code = {
              [Op.or]: [
                { [Op.like]: 'A' + "%" },
              ]
            }

          } if (req.body.search.user_type == 'HICAR') {
            condition.where.crop_code = {
              [Op.or]: [
                { [Op.like]: 'H' + "%" },
              ]
            }
          }

          // condition.where.crop_group = (req.body.search.crop_name_data);
        }
      }
      condition.order = [[sequelize.col('m_crop->m_crop_group.group_name'), 'ASC']];

      let data = await cropVerietyModel.findAndCountAll(condition);
      let filterdata = []
      data.rows.forEach(element => {
        if (element.dataValues.group_code != null) {

          const spaIndex = filterdata.findIndex(item => item.group_code === element.dataValues.group_code);
          if (spaIndex == -1) {
            filterdata.push({
              group_code: element.dataValues.group_code,
              group_name: element.dataValues.group_name

            })
          }
        }

      });


      if (data) {
        response(res, status.DATA_AVAILABLE, 200, filterdata);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 200)
      }



    }
    catch (error) {
      console.log(error);
      return response(res, status.DATA_NOT_SAVE, 500, error);
    }
  }

  static getBankdetailsData = async (req, res) => {
    try {
      let condition = {
        where: {
          ifsc_code: req.body.search.ifsc_code

        },
        attributes: ['branch_name', 'bank_name']

      }
      let data = await bankDetailsModel.findAndCountAll(condition);
      if (data) {
        response(res, status.DATA_AVAILABLE, 200, data);
      }
      else {
        return response(res, status.DATA_NOT_AVAILABLE, 404)
      }
    }
    catch (error) {
      return response(res, status.DATA_NOT_AVAILABLE, 500, error);
    }
  }
  static getBspcDatainCharactersticsSecond = async (req, res) => {
    try {
      const condition = {
        include: [
          {
            model: userModel,
            where: {
              user_type: 'BPC'
            }
          }
        ]


      };
      condition.order = [['agency_name', 'ASC']]
      let data = await agencyDetailModel.findAndCountAll(condition);
      if (!data) {
        return response(res, status.DATA_NOT_AVAILABLE, 404);
      }

      return response(res, status.DATA_AVAILABLE, 200, data);
    }
    catch (error) {
      const returnResponse = {
        message: error.message,
      };
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }

  }
  static activitiesListSecond = async (req, res) => {
    let returnResponse = {}
    try {
      let condition = {
        attributes: ['id', 'name', 'is_active']
      }
      condition.order = [[sequelize.col('name'), 'ASC']]
      let activitiesData = await db.activitiesModel.findAll(condition);
      if (activitiesData) {
        returnResponse = activitiesData;
        return response(res, status.DATA_AVAILABLE, 200, returnResponse);
      } else {
        returnResponse = {};
        return response(res, status.DATA_NOT_AVAILABLE, 401, returnResponse);
      }
    } catch (error) {
      console.log('error', error);
      return response(res, status.UNEXPECTED_ERROR, 500, returnResponse);
    }
  }
  static getIndenterDetailsSecond = async (req, res) => {
    let data = {};
    let condition = {};
    try {
      let isFlagFilter;
      let indenterUserId;
      if (req.body.search && req.body.search.graphType && req.body.search.graphType == "indenter") {
        indenterUserId = { user_id: req.body.loginedUserid.id }
        // isFlagFilter = { is_indenter_freeze: 1 }
      }
      else if (req.body.search && req.body.search.graphType == "nodal") {
        isFlagFilter = { is_freeze: 1 }
      }
      else if (req.body.search && req.body.search.graphType == "seed-division") {
        isFlagFilter = { is_indenter_freeze: 1 }
      } else {
        isFlagFilter = { icar_freeze: 1 }
      }
      if (req.body.search && req.body.search.crop_type) {

        condition = {
          include: [
            {
              model: cropModel,
              attributes: [],
              left: true
            },



          ],
          attributes: [
            [sequelize.fn('DISTINCT', sequelize.col('indent_of_breederseeds.crop_code')), 'crop_code'],
            [sequelize.col('m_crop.crop_name'), 'crop_name']
          ],
          raw: true,
          where: {
            crop_code: {
              [Op.like]: req.body.search.crop_type + '%'
            },
            user_id: req.body.search.user_id,
            ...isFlagFilter
          }
        };
      } else {
        condition = {
          include: [
            {
              model: cropModel,
              attributes: [],
              left: true
            },



          ],
          where: {
            user_id: req.body.search.user_id
          },
          attributes: [
            [sequelize.fn('DISTINCT', sequelize.col('indent_of_breederseeds.crop_code')), 'crop_code'],
            [sequelize.col('m_crop.crop_name'), 'crop_name']
          ],
          raw: true,
          // where: {
          //   crop_code: {
          //     [Op.like]: req.body.search.crop_type + '%'
          //   }
          // }
        };

      }
      // const sortOrder = req.body.sort ? req.body.sort : 'year';
      // const sortDirection = req.body.order ? req.body.order : 'DESC';
      // condition.order = [[sortOrder, sortDirection]];
      if (req.body.search) {
        if (req.body.search.year) {
          condition.where.year = req.body.search.year;
        }
        if (req.body.search.season) {
          condition.where.season = req.body.search.season;
        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = req.body.search.crop_code;
        }
        if (req.body.search.variety) {
          condition.where.variety_id = req.body.search.variety;
        }

      }
      data = await indentOfBreederseedModel.findAll(condition);


      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static getChartIndentDataSecond = async (req, res) => {
    let data = {};
    try {
      let condition = {}
      let filterDataIndent = [];
      if (req.body.search) {
        if (req.body.search.crop_type) {
          filterDataIndent.push({
            crop_code: {
              [Op.like]: req.body.search.crop_type + '%'
            }
          })
        }
        if (req.body.search.year) {
          filterDataIndent.push({
            year: {
              [Op.eq]: req.body.search.year
            },
          })

        }
        if (req.body.search.season) {
          filterDataIndent.push({
            season: {
              [Op.eq]: req.body.search.season
            }
          });
        }

      }
      if (req.body.search.crop_code && (req.body.search.crop_code != undefined) && req.body.search.crop_code.length > 0) {
        filterDataIndent.push({
          crop_code: {
            [Op.in]: req.body.search.crop_code
          },

        })
      }
      if (req.body.search && req.body.search.crop_type) {
        condition = {
          include: [
            // {
            //   model: userModel,
            //   attributes: []
            // },
            {
              model: cropModel,
              attributes: [],
              where: {
                breeder_id: req.body.loginedUserid.id
              }
            },
            // {
            //   model: bsp1Model,
            //   where: {
            //     user_id: req.body.loginedUserid.id
            //   },
            //   attributes: []
            // },


          ],
          where: {
            [Op.and]: filterDataIndent ? filterDataIndent : [],
            icar_freeze: 1,
            // crop_code: {
            //   [Op.like]: req.body.search.crop_type + '%'
            // },


          },
          raw: true,
          attributes: [
            [sequelize.literal("Sum(indent_of_breederseeds.indent_quantity)"), "indent_quantity"],
            // [sequelize.literal("Sum(indent_of_breederseeds.crop_code)"), "crop_code"],
            [sequelize.col("indent_of_breederseeds.crop_code"), "crop_code"],
            // [sequelize.col("m_crop.crop_name"), "crop_name"],
            // [sequelize.col("user.id"), "id"],
            // [sequelize.literal("Sum(bsp_5_b.lifting_quantity)"), "lifting_quantity"],
            // [sequelize.literal("Sum(allocation_to_indentor_for_lifting_breederseed.quantity)"), "quantity"],
          ],
          // group:[
          //   [sequelize.col("indent_of_breederseeds.crop_code"), "crop_code"],
          // ]
        }
      }
      else {
        condition = {
          include: [
            // {
            //   model: userModel,
            //   attributes: []
            // },
            // {
            //   model: bsp1Model,
            //   where: {
            //     user_id: req.body.loginedUserid.id
            //   },
            //   attributes: []
            // },{
            //   model: bsp1Model,
            //   where: {
            //     user_id: req.body.loginedUserid.id
            //   },
            //   attributes: []
            // },
            {
              model: cropModel,
              attributes: [],
              where: {
                breeder_id: req.body.loginedUserid.id
              }
            },

          ],

          raw: true,
          attributes: [
            [sequelize.literal("Sum(indent_of_breederseeds.indent_quantity)"), "indent_quantity"],
            // [sequelize.literal("Sum(indent_of_breederseeds.crop_code)"), "crop_code"],
            [sequelize.col("indent_of_breederseeds.crop_code"), "crop_code"],
            // [sequelize.col("m_crop.crop_name"), "crop_name"],

          ],
          // group:[
          //   [sequelize.col("indent_of_breederseeds.crop_code"), "crop_code"],
          // ]
          where: {
            [Op.and]: filterDataIndent ? filterDataIndent : [],
            icar_freeze: 1
          }
        }
      }

      // if (req.body.search) {
      //   if (req.body.search.year) {
      //     condition.where.year = req.body.search.year
      //   }
      //   if (req.body.search.season) {
      //     condition.where.season = req.body.search.season
      //   }
      //   if (req.body.search.crop_code && req.body.search.crop_code != undefined && req.body.search.crop_code.length > 0) {
      //     condition.where.crop_code = {
      //       [Op.in]: req.body.search.crop_code
      //     }
      //   }
      // }
      let page;
      let pageSize;
      if (page === undefined) page = 1;
      if (pageSize === undefined) {
        pageSize = 10;
      }

      if (page > 0 && pageSize > 0) {
        condition.limit = pageSize;
        condition.offset = (page * pageSize) - pageSize;
      }
      condition.group = [[sequelize.col('indent_of_breederseeds.crop_code'), 'crop_code']];
      data = await indentOfBreederseedModel.findAll(condition);

      let cropCodeArray = [];
      data.forEach(ele => {
        if (ele && ele.crop_code) {
          cropCodeArray.push(ele.crop_code);
        }
      });
      let seasonData;
      if (req.body.search.season) {
        seasonData = {
          season: {
            [Op.eq]: req.body.search.season
          }
        };
      }
      let breederId;
      if (req.body && req.body.search) {
        if (req.body.search.graphType === "pd-pc") {

          breederId = {
            breeder_id: req.body.loginedUserid.id
          }
        }
      }

      let productionData;
      if (cropCodeArray && cropCodeArray.length > 0 && req.body.search && req.body.search.crop_type) {

        productionData = await lotNumberModel.findAll({
          include: [
            {
              model: seedTestingReportsModel,
              attributes: [],
              where: {
                is_report_pass: true
              }
            },
            {
              model: cropModel,
              attributes: [],
              // where: {
              //   breeder_id: req.body.loginedUserid.id
              // }
            }
          ],
          attributes: [
            [sequelize.fn('DISTINCT', sequelize.col('lot_number_creations.crop_code')), 'crop_code'],
            [sequelize.literal("Sum(lot_number_creations.lot_number_size)"), "production"],
          ],

          where: {
            [Op.and]: {
              crop_code: {
                [Op.like]: req.body.search.crop_type + '%'
              },

              crop_code: {
                [Op.in]: cropCodeArray
              },
              year: {
                [Op.eq]: req.body.search.year
              },
              ...seasonData
            }
          },
          raw: true,
          group: [[sequelize.col('lot_number_creations.crop_code')]],
        });
      } else if (req.body.search && req.body.search.crop_type) {
        productionData = await lotNumberModel.findAll({
          include: [
            {
              model: seedTestingReportsModel,
              attributes: [],
              where: {
                is_report_pass: true
              }
            },
            {
              model: cropModel,
              attributes: [],
              // where: {
              //   breeder_id: req.body.loginedUserid.id
              //   // ...breeder_id
              // }
            }
          ],
          attributes: [
            [sequelize.fn('DISTINCT', sequelize.col('lot_number_creations.crop_code')), 'crop_code'],
            [sequelize.literal("Sum(lot_number_creations.lot_number_size)"), "production"],
          ],

          where: {
            [Op.and]: {
              crop_code: {
                [Op.like]: req.body.search.crop_type + '%'
              },


              year: {
                [Op.eq]: req.body.search.year
              },
              ...seasonData
            }
          },
          raw: true,
          group: [[sequelize.col('lot_number_creations.crop_code')]],
        });
      } else if (cropCodeArray && cropCodeArray.length > 0) {
        productionData = await lotNumberModel.findAll({
          include: [
            {
              model: seedTestingReportsModel,
              attributes: [],
              where: {
                is_report_pass: true
              }
            },
            {
              model: cropModel,
              attributes: [],
              // where: {
              //   breeder_id: req.body.loginedUserid.id
              //   // ...breeder_id
              // }
            }
          ],
          attributes: [
            [sequelize.fn('DISTINCT', sequelize.col('lot_number_creations.crop_code')), 'crop_code'],
            [sequelize.literal("Sum(lot_number_creations.lot_number_size)"), "production"],
          ],

          where: {
            [Op.and]: {
              crop_code: {
                [Op.in]: cropCodeArray
              },


              year: {
                [Op.eq]: req.body.search.year
              },
              ...seasonData
            }
          },
          raw: true,
          group: [[sequelize.col('lot_number_creations.crop_code')]],
        });
      }
      else {
        productionData = await lotNumberModel.findAll({
          include: [
            {
              model: seedTestingReportsModel,
              attributes: [],
              where: {
                is_report_pass: true
              }
            },
            {
              model: cropModel,
              attributes: [],
              // where: {
              //   breeder_id: req.body.loginedUserid.id
              //   // ...breeder_id
              // }
            }
          ],
          attributes: [
            [sequelize.fn('DISTINCT', sequelize.col('lot_number_creations.crop_code')), 'crop_code'],
            [sequelize.literal("Sum(lot_number_creations.lot_number_size)"), "production"],
          ],

          where: {
            [Op.and]: {



              year: {
                [Op.eq]: req.body.search.year
              },
              ...seasonData
            }
          },
          raw: true,
          group: [[sequelize.col('lot_number_creations.crop_code')]],
        });
      }
      let filterData = [];
      if (req.body.search) {
        if (req.body.search.crop_type) {
          filterData.push({
            crop_code: {
              [Op.like]: req.body.search.crop_type + '%'
            }
          })
        }
        if (req.body.search.year) {
          filterData.push({
            year: {
              [Op.eq]: req.body.search.year
            },
          })

        }
        if (req.body.search.season) {
          filterData.push({
            season: {
              [Op.eq]: req.body.search.season
            }
          });
        }

      }
      if (cropCodeArray && cropCodeArray.length > 0) {
        filterData.push({
          crop_code: {
            [Op.in]: cropCodeArray
          },

        })
      }

      let AllocatedData;
      let filterData1 = []
      if (req.body.search) {
        if (req.body.search.year) {
          filterData1.push({
            year: {
              [Op.eq]: req.body.search.year
            }
          });

        }
        if (req.body.search.crop_code && req.body.search.crop_code.length > 0 && req.body.search.crop_code != undefined) {
          filterData1.push({
            crop_code: {
              [Op.in]: req.body.search.crop_code ? req.body.search.crop_code : ""
            }
          })

        }
        if (req.body.search.season) {

          filterData1.push({
            season: {
              [Op.eq]: req.body.search.season
            },
          })
        }
        if (req.body.search.crop_type) {

          filterData1.push({
            crop_code: {
              [Op.like]: req.body.search.crop_type + '%'
            },
          })
        }

      }
      if (req.body.search && req.body.search.crop_type) {

        AllocatedData = await bsp1Model.findAll({

          include: [

            {
              model: db.bsp1ProductionCenterModel,
              attributes: [],
              where: {},
            },
            {
              model: cropModel,
              attributes: [],
              where: {
                crop_code: {
                  [Op.like]: req.body.search.crop_type + '%'
                }
              },


            }
          ],
          attributes: [

            [sequelize.literal("Sum(bsp1_production_centers.quantity_of_seed_produced)"), "quantity_of_seed_produced"],
            [sequelize.col('m_crop.crop_code'), 'crop_code'],

          ],
          group: [
            [sequelize.col('m_crop.crop_code'), 'crop_code']
          ],
          where: {
            [Op.and]: filterData1 ? filterData1 : [],
            user_id: req.body.loginedUserid.id,
          },
          // where:{
          //   year:req.body.search.year,
          //   season : req.body.search.season,
          //   crop_code:{
          //     [Op.like]:req.body.search.crop_type + "%"
          //   },
          //   user_id: req.body.search.user_id,
          // },

          raw: true

        })
      } else {
        AllocatedData = await bsp1Model.findAll({

          include: [

            {
              model: db.bsp1ProductionCenterModel,
              attributes: [],
              where: {},
            },
            {
              model: cropModel,
              attributes: [],
            },
          ],
          raw: true,
          attributes: [
            [sequelize.literal("Sum(bsp1_production_centers.quantity_of_seed_produced)"), "quantity_of_seed_produced"],
            [sequelize.col('m_crop.crop_code'), 'crop_code']
          ],
          group: [
            [sequelize.col('m_crop.crop_code'), 'crop_code']
          ],
          where: {
            [Op.and]: filterData1 ? filterData1 : [],
            user_id: req.body.loginedUserid.id,
          },

          raw: true

        })
      }
      if (AllocatedData && (AllocatedData.length > 0)) {
        AllocatedData.forEach(elem => {

          data.forEach((ele, i) => {
            // console.log(ele,'eleele')
            if (ele.crop_code == elem.crop_code) {
              data[i].allocated = elem && elem.quantity_of_seed_produced ? elem.quantity_of_seed_produced : 0
            }

          })
        })
      }
      productionData.forEach(elem => {

        data.forEach((ele, i) => {
          // console.log(ele,'eleele')
          if (ele.crop_code == elem.crop_code) {
            data[i].production = elem.production
          }

        })
      })


      // AllocatedData.forEach(elem => {

      //   data.forEach((ele, i) => {
      //     // console.log(ele,'eleele')
      //     if (ele.crop_code == elem.crop_code) {
      //       data[i].allocated = elem.allocated ? elem.allocated : 0
      //     }

      //   })
      // })

      let data1 = await db.bsp5bModel.findAll({
        include: [
          {
            model: cropModel,
            attributes: [],
            // where: {
            //   breeder_id: req.body.loginedUserid.id
            // }
          }
        ],
        attributes: [
          [sequelize.fn('SUM', sequelize.col('lifting_quantity')), 'total_lifting'],
          // [sequelize.col('lifting_quantity'), 'total_lifting'],
          [sequelize.col('bsp_5_b.crop_code'), 'crop_code'],
          // [sequelize.col('crop_code'), 'crop_code']
        ],
        group: [
          [sequelize.col('bsp_5_b.crop_code'), 'crop_code'],
          // [sequelize.col('crop_code'), 'crop_code']
          // [sequelize.col('id'), 'id'],
        ],
        where: { [Op.and]: filterData ? filterData : [] },
        raw: true
      }
      );
      data1.forEach(item => {
        data.forEach((elem, i) => {
          if (elem.crop_code == item.crop_code) {
            data[i].total_lifting = item && item.total_lifting ? parseFloat(item.total_lifting) : 0
          }
        })
      })
      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static getChartIndentDataVarietyforpdpc = async (req, res) => {
    let data = {};
    try {
      let filterData = [{ icar_freeze: 1 }];
      if (req.body.search && req.body.search.crop_type) {
        filterData.push({
          crop_code: {
            [Op.like]: req.body.search.crop_type + '%'
          },
        })
      }

      let condition = {
        include: [
          {
            model: allocationToIndentor,
            attributes: []
          },
          {
            model: cropModel,
            attributes: [],
            where:
            {
              breeder_id: req.body.loginedUserid.id
            }
          },
          // {
          //   model: bsp5bModel,
          //   attributes: []
          // },
          {
            model: varietyModel,
            attributes: []
          },
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('indent_of_breederseeds.variety_id')), 'variety_id'],
          // [sequelize.fn('DISTINCT', ), 'crop_code'],
          // [sequelize.col('indent_of_breederseeds.crop_code'),'crop_code'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [sequelize.fn('SUM', sequelize.col('indent_of_breederseeds.indent_quantity')), 'indent_quantity'],
          [sequelize.fn('SUM', sequelize.col('allocation_to_indentor_for_lifting_breederseed.quantity')), 'quantity'],
          // [sequelize.fn('SUM', sequelize.col('bsp_5_b.lifting_quantity')), 'lifting_quantity'],
        ],

        where: {
          [Op.and]: filterData ? filterData : [],
          icar_freeze: 1

        },
        // where: {
        //   [Op.and]: [{
        //     crop_code: {
        //       [Op.like]: req.body.search.crop_type + '%'
        //     },
        //     icar_freeze: 1
        //   }
        //   ]

        // },
        raw: true
      };
      let seasonData;
      if (req.body.search.season) {
        seasonData = {
          season: {
            [Op.eq]: req.body.search.season
          }
        };
      }
      if (req.body.search) {
        if (req.body.search.year) {
          condition.where.year = req.body.search.year
        }
        if (req.body.search.season) {
          condition.where.season = req.body.search.season
        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = req.body.search.crop_code
        }
        // if (req.body.search.crop_code && req.body.search.crop_code !== undefined && req.body.search.crop_code.length > 0) {
        //   condition.where.crop_code = {
        //     [Op.in]: (req.body.search.crop_code)
        //   };
        // }
      }
      condition.group = [
        [sequelize.col('indent_of_breederseeds.variety_id'), 'variety_id'],
        [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
      ];
      let data = await indentOfBreederseedModel.findAll(condition);

      let filterData1 = [];
      if (req.body.search) {
        if (req.body.search.crop_type) {
          filterData1.push({
            crop_code: {
              [Op.like]: req.body.search.crop_type + '%'
            }
          })
        }
        // if (req.body.search.crop_code && req.body.search.crop_code !== undefined && req.body.search.crop_code.length > 0) {
        //   filterData1.push({
        //     crop_code: {
        //       [Op.in]: (req.body.search.crop_code)
        //     }
        //   })
        // }
        if (req.body.search.crop_code) {
          filterData1.push({
            crop_code: {
              [Op.eq]: (req.body.search.crop_code)
            }
          })
        }
        if (req.body.search.year) {
          filterData1.push({
            year: {
              [Op.eq]: req.body.search.year
            }
          })
        }
        if (req.body.search.season) {

          filterData1.push({
            season: {
              [Op.eq]: req.body.search.season
            }
          })
        }
      }
      let varietyArr = [];
      if (data && data.length > 0) {

        data.forEach(ele => {
          varietyArr.push(ele && ele.variety_id ? ele.variety_id : '')
        })
      }
      let liftedData;
      if (varietyArr && varietyArr.length > 0) {

        liftedData = await bsp5bModel.findAll({
          attributes: [
            [sequelize.fn('DISTINCT', sequelize.col('bsp_5_b.variety_id')), 'variety_id'],
            // [sequelize.col('indent_of_breederseeds.crop_code'), 'crop_code'],
            [sequelize.literal("Sum(bsp_5_b.lifting_quantity)"), "total_lifting"]
          ],
          group: [
            [sequelize.col('bsp_5_b.variety_id'), 'variety_id']
          ],
          where: {
            // ... filterData1,
            [Op.and]: filterData1 ? filterData1 : [],
            // variety_id: {
            //   [Op.in]: varietyArr
            // }
          },

          // where: {
          //   ...filterData1,

          //  [Op.and]:filterData1 ? filterData1 :[],
          //  ...varietyArr

          // [Op.in]:variety_id :varietyArr
          // },
          raw: true,

        })
      }
      else {
        liftedData = await bsp5bModel.findAll({
          where: {
            [Op.and]: filterData1 ? filterData1 : [],
            // ...varietyArr
          },
          raw: true,

        })
      }

      let productionData = await lotNumberModel.findAll({
        include: [
          {
            model: seedTestingReportsModel,
            attributes: [],
            where: {
              is_report_pass: true
            }
          },
          {
            model: cropModel,
            attributes: [],
            // wher: {
            //   breeder_id: req.body.loginedUserid.id
            // }
          }
          // {
          //   model: bsp5bModel,
          //   attributes: []
          // },
        ],
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('lot_number_creations.variety_id')), 'variety_id'],
          // [sequelize.col('indent_of_breederseeds.crop_code'), 'crop_code'],
          [sequelize.literal("Sum(lot_number_creations.lot_number_size)"), "production"]
          // [sequelize.literal("Sum(allocation_to_indentor_for_lifting_breederseed.quantity)"), "quantity"],
          // [sequelize.literal("Sum(bsp_5_b.lifting_quantity)"), "lifting_quantity"],
        ],
        where: { [Op.and]: filterData1 ? filterData1 : [] },
        raw: true,
        group: [[sequelize.col('lot_number_creations.variety_id')]],
        // order:[['indent_quantity', 'DESC']]
      });



      productionData.forEach(elem => {
        data.forEach((ele, i) => {
          if (ele.variety_id == elem.variety_id) {
            data[i].production = elem.production ? elem.production : '0'
          }

        })
      })

      let AllocatedData;
      let filterData2 = []
      AllocatedData = await bsp1Model.findAll({
        include: [

          {
            model: db.bsp1ProductionCenterModel,
            attributes: [],
            where: {},
          },

          {
            model: varietyModel,
            attributes: []

          }
        ],
        attributes: [
          [sequelize.literal("Sum(quantity_of_seed_produced)"), "quantity_of_seed_produced"],
          [sequelize.col('m_crop_variety.id'), 'id']
        ],
        group: [
          [sequelize.col('m_crop_variety.id'), 'id']
        ],
        where: {
          [Op.and]: filterData1 ? filterData1 : [],
          user_id: req.body.loginedUserid.id,
        },


        raw: true

      })

      if (AllocatedData && (AllocatedData.length > 0)) {
        AllocatedData.forEach(elem => {

          data.forEach((ele, i) => {
            if (ele.variety_id == elem.id) {
              data[i].allocated = elem && elem.quantity_of_seed_produced ? elem.quantity_of_seed_produced : 0
            }

          })
        })
      }

      if (liftedData && liftedData.length > 0) {
        liftedData.forEach(item => {
          data.forEach((elem, i) => {
            if (elem.variety_id == item.variety_id) {
              data[i].lifting_qty = item && item.total_lifting ? parseFloat(item.total_lifting) : 0
            }
          })

        })
      }

      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static getIndenterDetailsforPdpc = async (req, res) => {
    let data = {};
    let condition = {};
    try {
      if (req.body.search && req.body.search.crop_type) {
        if (req.body.loginedUserid.user_type == 'SD') {
          condition = {
            include: [
              {
                model: cropModel,
                attributes: ['id', 'crop_code', 'crop_name'],
                left: true
              },
              {
                model: varietyModel,
                attributes: ['id', 'variety_code', 'variety_name'],
                left: true
              },
              {
                model: bsp5bModel,
                attributes: ['id'],
                left: true
              },
              {
                model: bsp1Model,
                where: {
                  user_id: req.body.loginedUserid.id
                },
                attributes: ['id'],
                left: true
              }
            ],
            // attributes:['*'],
            where: {
              crop_code: {
                [Op.like]: req.body.search.crop_type + '%'
              },
              // is_indenter_freeze: 1
            }
          };
        } else {
          condition = {
            include: [
              {
                model: cropModel,
                attributes: ['id', 'crop_code', 'crop_name'],
                left: true
              },
              {
                model: varietyModel,
                attributes: ['id', 'variety_code', 'variety_name'],
                left: true
              },
              {
                model: bsp5bModel,
                attributes: ['id'],
                left: true
              },
              {
                model: bsp1Model,
                attributes: ['id'],
                where: {
                  user_id: req.body.loginedUserid.id
                },
                left: true
              }
            ],
            // attributes:['*'],
            where: {
              crop_code: {
                [Op.like]: req.body.search.crop_type + '%'
              },
              // is_indenter_freeze:1
            }
          };
        }

      } else {
        if (req.body.loginedUserid.user_type == 'SD') {

          condition = {
            include: [
              {
                model: cropModel,
                attributes: ['id', 'crop_code', 'crop_name'],
                left: true
              },
              {
                model: varietyModel,
                attributes: ['id', 'variety_code', 'variety_name'],
                left: true
              },
              {
                model: bsp5bModel,
                attributes: ['id'],
                left: true
              },
              {
                model: bsp1Model,
                attributes: ['id'],
                left: true
              }
            ],
            where: {
              is_indenter_freeze: 1
            }
            // attributes:['*'],
            // where: {
            //   crop_code: {
            //     [Op.like]: req.body.search.crop_type + '%'
            //   }
            // }
          };
        } else {
          condition = {
            include: [
              {
                model: cropModel,
                attributes: ['id', 'crop_code', 'crop_name'],
                left: true
              },
              {
                model: varietyModel,
                attributes: ['id', 'variety_code', 'variety_name'],
                left: true
              },
              {
                model: bsp5bModel,
                attributes: ['id'],
                left: true
              },
              {
                model: bsp1Model,
                where: {
                  user_id: req.body.loginedUserid.id
                },
                attributes: ['id'],
                left: true
              }
            ],

            // attributes:['*'],
            // where: {
            //   crop_code: {
            //     [Op.like]: req.body.search.crop_type + '%'
            //   }
            // }
          };
        }
      }
      const sortOrder = req.body.sort ? req.body.sort : 'year';
      const sortDirection = req.body.order ? req.body.order : 'DESC';
      condition.order = [[sortOrder, sortDirection]];
      if (req.body.search) {
        if (req.body.search.year) {
          condition.where.year = req.body.search.year;
        }
        if (req.body.search.season) {
          condition.where.season = req.body.search.season;
        }
        if (req.body.search.crop_code) {
          condition.where.crop_code = req.body.search.crop_code;
        }
        if (req.body.search.variety) {
          condition.where.variety_id = req.body.search.variety;
        }

      }
      data = await indentOfBreederseedModel.findAll(condition);


      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error)
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getChartAllIndentorforpdpc = async (req, res) => {
    let data = {};
    try {
      let condition = {}
      let condition2 = {}
      if (req.body.search.graphType == 'pdpc') {

        condition = {
          // where: {
          //   user_id: req.body.loginedUserid.id
          // },
          include: [
            // {
            //   model: cropModel,
            //   where: {
            //     breeder_id: req.body.loginedUserid.id
            //   },
            //   attributes: ['crop_name', 'crop_code']
            // },
            {
              model: cropModel,
              attributes: [],
              // where:{
              //   breeder_id:req.body.loginedUserid.id
              // }

            }
          ],
          where: {
            user_id: req.body.loginedUserid.id
          },
          // where: {
          //   icar_freeze: 1
          // }
        }
      } else {
        condition = {

          include: [
            {
              model: cropModel,


              attributes: ['crop_name', 'crop_code']
            }
          ],
          where: {
            user_id: req.body.loginedUserid.id
          },
          // where: {
          //   icar_freeze: 1
          // }
        }

      }
      // if (req.body.search) {
      //   if (req.body.search.year) {
      //     condition.where.year = req.body.search.year
      //   }
      //   if (req.body.search.season) {
      //     condition.where.season = req.body.search.season
      //   }
      //   if (req.body.search.crop_code && req.body.search.crop_code !== undefined && req.body.search.crop_code.length > 0) {
      //     condition.where.crop_code = {
      //       [Op.and]: {
      //         [Op.in]: req.body.search.crop_code
      //       }
      //     }
      //   }
      // }
      // condition.group = [['user.name'], ['user.id']];
      data = await db.breederCropModel.findAll(condition);
      // if (req.body.search.graphType == 'pdpc') {

      // } else {
      //   data = await bsp1Model.findAll(condition);
      // }





      // console.log(' this.chartCrop_sec this.chartCrop_sec this.chartCrop_sec', data);
      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error);
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getChartAllIndentorCropFilterforpdpc = async (req, res) => {
    let data = {};
    try {
      let condition = {}
      let condition2 = {}
      if (req.body.search && req.body.search.graphType == 'pdpc') {

        condition = {
          where: {
            user_id: req.body.loginedUserid.id
          },
          include: [
            {
              model: cropModel,

              attributes: []
            },

            // {
            //   model: bsp1Model,

            //   attributes: []
            // },
          ],
          // where: {
          //   icar_freeze: 1
          // },
          attributes: [
            [sequelize.col('m_crop.crop_name'), 'crop_name'],
            [sequelize.col('m_crop.crop_code'), 'crop_code'],
            // [sequelize.fn('DISTINCT', sequelize.col('m_crop.crop_code')), 'crop_code'],
          ],
          group: [
            [sequelize.col('m_crop.crop_code'), 'crop_code'],
            [sequelize.col('m_crop.crop_name'), 'crop_name'],
          ],
          raw: true
        }
      } else {
        condition = {
          where: {
            user_id: req.body.loginedUserid.id
          },

          include: [
            {
              model: cropModel,
              // where: {
              //   breeder_id: req.body.loginedUserid.id
              // },
              attributes: []
            },
            // {
            //   model: bsp1Model,
            // where:{
            //   user_id:req.body.loginedUserid.id
            // },
            //   attributes: []
            // },
          ],
          attributes: [
            [sequelize.col('m_crop.crop_name'), 'crop_name'],
            [sequelize.col('m_crop.crop_code'), 'crop_code'],
            // [sequelize.fn('DISTINCT', sequelize.col('m_crop.crop_code')), 'crop_code'],
          ],
          group: [
            [sequelize.col('m_crop.crop_code'), 'crop_code'],
            [sequelize.col('m_crop.crop_name'), 'crop_name'],
          ],
          raw: true
        }
      }

      if (req.body.search) {
        if (req.body.search.year) {
          condition.where.year = req.body.search.year
        }
        if (req.body.search.season) {
          condition.where.season = req.body.search.season
        }
        if (req.body.search.crop_type) {
          condition.where.crop_code = {
            [Op.like]: req.body.search.crop_type + '%'
          }
        }
        if (req.body.search.crop_code && req.body.search.crop_code !== undefined && req.body.search.crop_code.length > 0) {
          condition.where.crop_code = {
            [Op.and]: {
              [Op.in]: req.body.search.crop_code
            }
          }
        }
      }
      // condition.group = [['user.name'], ['user.id']];

      // if (req.body.search && req.body.search.graphType == 'pdpc') {

      //   data = await indentOfBreederseedModel.findAll(condition);
      // } else {

      // }
      data = await db.breederCropModel.findAll(condition);





      // console.log(' this.chartCrop_sec this.chartCrop_sec this.chartCrop_sec', data);
      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error);
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }
  static getChartAllIndentorforPdpcSecond = async (req, res) => {
    let condition = {}
    let filterDataIndent = [];
    if (req.body.search) {
      if (req.body.search.crop_type) {
        filterDataIndent.push({
          crop_code: {
            [Op.like]: req.body.search.crop_type + '%'
          }
        })
      }
      if (req.body.search.year) {
        filterDataIndent.push({
          year: {
            [Op.eq]: req.body.search.year
          },
        })

      }
      if (req.body.search.season) {
        filterDataIndent.push({
          season: {
            [Op.eq]: req.body.search.season
          }
        });
      }

    }
    if (req.body.search.crop_code && (req.body.search.crop_code != undefined) && req.body.search.crop_code.length > 0) {
      filterDataIndent.push({
        crop_code: {
          [Op.in]: req.body.search.crop_code
        },

      })
    }
    if (req.body.search && req.body.search.crop_type) {
      condition = {
        include: [
          {
            model: userModel,
            attributes: []
          },
          // {
          //   model: bsp1Model,
          //   wher: {
          //     user_id: req.body.loginedUserid.id
          //   },
          //   attributes: []
          // },

          {
            model: cropModel,
            attributes: [],
            where: {
              breeder_id: req.body.loginedUserid.id
            }
          }
        ],
        where: {
          crop_code: {
            [Op.like]: req.body.search.crop_type + '%'
          },

        },
        raw: true,
        attributes: [
          [sequelize.literal("Sum(indent_of_breederseeds.indent_quantity)"), "indent_quantity"],
          [sequelize.col("user.name"), "name"],
          [sequelize.col("user.id"), "id"],
          // [sequelize.literal("Sum(bsp_5_b.lifting_quantity)"), "lifting_quantity"],
          // [sequelize.literal("Sum(allocation_to_indentor_for_lifting_breederseed.quantity)"), "quantity"],
        ],
        group: [
          [sequelize.col("user.name"), "name"],
          [sequelize.col("user.id"), "id"],
        ],
        where: {
          [Op.and]: filterDataIndent ? filterDataIndent : [],
          icar_freeze: 1
        },
        require: true,
      }
    }
    else {
      condition = {
        include: [
          {
            model: userModel,
            attributes: [],
            require: true,
          },

          // {
          //   model: bsp1Model,
          //   wher: {
          //     user_id: req.body.loginedUserid.id
          //   },
          //   attributes: []
          // },
          {
            model: cropModel,
            attributes: [],
            where: {
              breeder_id: req.body.loginedUserid.id
            }
          }

        ],

        raw: true,
        attributes: [
          [sequelize.literal("Sum(indent_of_breederseeds.indent_quantity)"), "indent_quantity"],
          [sequelize.col("user.name"), "name"],
          [sequelize.col("user.id"), "id"],
          // [sequelize.literal("Sum(bsp_5_b.lifting_quantity)"), "lifting_quantity"],
          // [sequelize.literal("Sum(allocation_to_indentor_for_lifting_breederseed.quantity)"), "quantity"],
        ],
        group: [
          [sequelize.col("user.name"), "name"],
          [sequelize.col("user.id"), "id"],
        ],
        require: true,
        where: {
          [Op.and]: filterDataIndent ? filterDataIndent : [],
          icar_freeze: 1
        }
      }

    }
    // if (req.body.search) {
    //   if (req.body.search.year) {
    //     condition.where.year = req.body.search.year
    //   }
    //   if (req.body.search.season) {
    //     condition.where.season = req.body.search.season
    //   }
    //   if (req.body.search.crop_code && req.body.search.crop_code !== undefined && req.body.search.crop_code.length > 0) {
    //     condition.where.crop_code = {
    //       [Op.and]: {
    //         [Op.in]: req.body.search.crop_code
    //       }
    //     }
    //   }
    // }
    // condition.group = [['user.name'], ['user.id']];

    let data = await indentOfBreederseedModel.findAll(condition);

    let allocatedData = [];
    let filterData = [];
    if (req.body.search) {
      if (req.body.search.crop_type) {
        filterData.push({
          crop_code: {
            [Op.like]: req.body.search.crop_type + '%'
          }
        })
      }
      if (req.body.search.year) {
        filterData.push({
          year: {
            [Op.eq]: req.body.search.year
          },
        })

      }
      if (req.body.search.season) {
        filterData.push({
          season: {
            [Op.eq]: req.body.search.season
          }
        });
      }
      if (req.body.search.crop_code) {
        filterData.push({
          crop_code: {
            [Op.in]: req.body.search.crop_code
          }
        });
      }

    }
    allocatedData = await bsp1Model.findAll({
      include: [
        {
          model: db.bsp1ProductionCenterModel,
          attributes: []

        },
        {
          model: indentOfBreederseedModel,
          attributes: []
        }
      ],
      where: {
        [Op.and]: filterData ? filterData : [],
        user_id: req.body.loginedUserid.id
      },
      attributes: [
        [sequelize.col('indent_of_breederseed.user_id'), 'user_id'],
        [sequelize.col('bsp1_production_centers.quantity_of_seed_produced'), 'quantity_of_seed_produced']
        // [sequelize.fn('SUM', sequelize.col('bsp1_production_centers.quantity_of_seed_produced')), 'quantity_of_seed_produced'],
        // bsp1_production_centers.quantity_of_seed_produced

      ],

      raw: true,
      // group:[
      //   [sequelize.col('indent_of_breederseed.user_id'),'user_id'],
      //   [sequelize.col('bsp_1s.id'),'id'],
      // ]
    })
    let allocate;
    if (allocatedData && allocatedData.length > 0) {
      allocate = seedhelper.sumofDuplicateData(allocatedData)
    }
    if (allocate && allocate.length > 0) {
      if (data && data.length > 0) {
        allocate.forEach(item => {
          data.forEach((el, i) => {
            if (el.id == item.user_id) {

              data[i].allocated = item && item.quantity_of_seed_produced ? parseFloat(item.quantity_of_seed_produced) : 0
            }
          })
        })
      }
    }
    let bspliftingQty = await db.bsp5bModel.findAll({
      include: [
        {
          model: cropModel,
          where: {
            breeder_id: req.body.loginedUserid.id
          },
          attributes: [],

        },
        {
          model: indentOfBreederseedModel,

          attributes: [],

        }
      ],
      attributes: [
        [sequelize.col('bsp_5_b.indent_of_breederseed_id'), 'indent_of_breederseed_id'],
        [sequelize.col('bsp_5_b.lifting_quantity'), 'lifting_quantity'],
        [sequelize.col('indent_of_breederseed.user_id'), 'user_id']
      ],
      // group:[
      //   'indent_of_breederseed_id'
      // ],
      where: { [Op.and]: filterData ? filterData : [] },
      raw: true
    }
    );
    let liftingdata;
    if (bspliftingQty && bspliftingQty.length > 0) {
      liftingdata = seedhelper.sumofDuplicateDataIndenter(bspliftingQty)
    }
    if (liftingdata && liftingdata.length > 0) {
      if (data && data.length > 0) {
        liftingdata.forEach(item => {
          data.forEach((el, i) => {
            if (el.id == item.user_id) {

              data[i].lifting_quantity = item && item.lifting_quantity ? parseFloat(item.lifting_quantity) : 0
            }
          })
        })
      }
    }
    let allocationData;
    allocationData = await allocationToIndentorSeed.findAll(
      {
        include: [
          {
            model: allocationToIndentorProductionCenterSeed,
            attributes: []
          }
        ],
        where: {
          [Op.and]: filterData ? filterData : []
        },
        attributes: [
          //  [sequelize.fn('SUM', sequelize.col('allocation_to_indentor_for_lifting_seed_production_cnters.qty')), 'qty'],
          [sequelize.col('allocation_to_indentor_for_lifting_seed_production_cnters.qty'), 'qty'],
          [sequelize.col('allocation_to_indentor_for_lifting_seed_production_cnters.indent_of_breeder_id'), 'user_id'],

        ],

        raw: true
      },

    )
    let allocationDataSum;
    if (allocationData && allocationData.length > 0) {
      allocationDataSum = seedhelper.sumofDuplicateDataAllocatedQty(allocationData)
    }
    if (allocationDataSum && allocationDataSum.length > 0) {
      if (data && data.length > 0) {
        allocationDataSum.forEach(ele => {
          data.forEach((item, i) => {
            console.log(ele, 'ele.qty')
            if (item.id == ele.user_id) {
              data[i].allocatedQtySecond = ele && ele.qty ? parseFloat(ele.qty) : 0
            }
          })
        })
      }
    }


    // console.log(allocate,'allocate')
    response(res, status.DATA_AVAILABLE, 200, data)
  }

  static getChartAllIndentorVarietyforpdpc = async (req, res) => {
    let data = {};
    try {
      let condition = {}
      let filterData2 = [];
      if (req.body.search) {
        if (req.body.search.crop_type) {
          filterData2.push({
            crop_code: {
              [Op.like]: req.body.search.crop_type + '%'
            }
          })
        }
        if (req.body.search.year) {
          filterData2.push({
            year: {
              [Op.eq]: req.body.search.year
            },
          })

        }
        if (req.body.search.season) {
          filterData2.push({
            season: {
              [Op.eq]: req.body.search.season
            }
          });
        }
        if (req.body.search.crop_code) {
          filterData2.push({
            crop_code: {
              [Op.in]: req.body.search.crop_code
            }
          });
        }

      }
      if (req.body.search && req.body.search.crop_type) {

        condition = {
          include: [
            {
              model: userModel,
              attributes: [],
              where: {}
            },
            {
              model: cropModel,
              // left:true,
              attributes: [],
              where: {
                breeder_id: req.body.loginedUserid.id
              }
            }
            // {
            //   model: bsp5bModel,
            //   attributes: []
            // },
          ],
          attributes: [
            [sequelize.fn('SUM', sequelize.col('indent_of_breederseeds.indent_quantity')), 'indent_quantity'],
            [sequelize.col('indent_of_breederseeds.crop_code'), 'crop_code']
          ],
          group: [
            [sequelize.col('indent_of_breederseeds.crop_code'), 'crop_code']
          ],

          where: {
            [Op.and]: filterData2 ? filterData2 : [],
            user_id: req.body.search.user_id,
            icar_freeze: 1

          },
          // where: {
          //   crop_code: {
          //     [Op.like]: req.body.search.crop_type + '%'
          //   },
          //   year: req.body.search.year,
          //   season: req.body.search.season,
          //   user_id: req.body.search.user_id

          //   // crop_code:req.body.search.crop_code,

          //   // where:{
          //   // },
          //   // icar_freeze: 1
          // },
          raw: true
        };
      } else {
        condition = {
          include: [

            {
              model: userModel,
              attributes: [],
              where: {}
            },
            {
              model: cropModel,
              attributes: [],
              where: {
                breeder_id: req.body.loginedUserid.id
              }
            }
            // {
            //   model: bsp5bModel,
            //   attributes: []
            // },
          ],
          attributes: [
            [sequelize.fn('SUM', sequelize.col('indent_of_breederseeds.indent_quantity')), 'indent_quantity'],
            [sequelize.col('indent_of_breederseeds.crop_code'), 'crop_code']
          ],
          group: [
            [sequelize.col('indent_of_breederseeds.crop_code'), 'crop_code']
          ],

          where: {
            [Op.and]: filterData2 ? filterData2 : [],
            user_id: req.body.search.user_id,
            icar_freeze: 1

          },
          raw: true
        };
      }



      data = await indentOfBreederseedModel.findAll(condition);
      let filterData = [];
      if (req.body.search) {
        if (req.body.search.crop_type) {
          filterData.push({
            crop_code: {
              [Op.like]: req.body.search.crop_type + '%'
            }
          })
        }
        if (req.body.search.year) {
          filterData.push({
            year: {
              [Op.eq]: req.body.search.year
            },
          })

        }
        if (req.body.search.season) {
          filterData.push({
            season: {
              [Op.eq]: req.body.search.season
            }
          });
        }
        if (req.body.search.crop_code) {
          filterData.push({
            crop_code: {
              [Op.in]: req.body.search.crop_code
            }
          });
        }

      }
      let allocatedData = []
      allocatedData = await bsp1Model.findAll({
        include: [
          {
            model: db.bsp1ProductionCenterModel,
            attributes: []

          },
          {
            model: indentOfBreederseedModel,
            attributes: [],
            where: {
              user_id: req.body.search.user_id,
            }
          },
          {
            model: cropModel,
            attributes: []
          },
        ],
        attributes: [
          [sequelize.col('bsp1_production_centers.quantity_of_seed_produced'), 'quantity_of_seed_produced'],
          // [sequelize.literal("Sum(quantity_of_seed_produced)"), "quantity_of_seed_produced"],
          [sequelize.col('m_crop.crop_code'), 'crop_code']
        ],

        // attributes:[
        //    [sequelize.col('m_crop_variety.id'),'varietyid'],
        //   [sequelize.col('bsp1_production_centers.quantity_of_seed_produced'),'quantity_of_seed_produced']
        //   // [sequelize.col('m_crop_variety.id'),'id'],
        //   // [sequelize.fn('SUM', sequelize.col('bsp1_production_centers.quantity_of_seed_produced')), 'quantity_of_seed_produced'],

        // ],
        // group:[
        //   [sequelize.col('m_crop_variety.id'),'id'],
        // ],
        where: {
          [Op.and]: filterData ? filterData : [],
          user_id: req.body.loginedUserid.id
        },
        raw: true
      })
      let allocate;
      if (allocatedData && allocatedData.length > 0) {
        allocate = seedhelper.sumofDuplicateDataVariety(allocatedData)
      }
      if (allocate && allocate.length > 0) {
        if (data && data.length > 0) {
          allocate.forEach(item => {
            data.forEach((el, i) => {
              if (el.crop_code == item.crop_code) {
                console.log(item.quantity_of_seed_produced, 'allocate')
                data[i].allocated = item && item.quantity_of_seed_produced ? parseFloat(item.quantity_of_seed_produced) : 0
              }

            })
          })

        }
      }
      let liftedQty;
      liftedQty = await bsp5bModel.findAll({
        include: [
          {
            model: indentOfBreederseedModel,
            attributes: [],
            where: {
              user_id: req.body.search.user_id,

            },
            include: [
              {
                model: cropModel,
                attributes: [],
                where: {
                  breeder_id: req.body.loginedUserid.id

                }
              }
            ],
            attributes: []
          },
          {
            model: cropModel,
            attributes: [],

          },
        ],

        where: {
          [Op.and]: filterData ? filterData : []

        },
        attributes: [
          // [sequelize.col('lifting_quantity'),'lifting_quantity'],
          [sequelize.fn('SUM', sequelize.col('lifting_quantity')), 'total_lifting'],
          [sequelize.col('m_crop.crop_code'), 'crop_code']
        ],

        group: [
          [sequelize.col('m_crop.crop_code'), 'crop_code']
        ],
        raw: true

      })
      if (liftedQty && liftedQty.length > 0) {
        if (data && data.length > 0) {
          liftedQty.forEach(el => {
            data.forEach((item, i) => {
              if (item.crop_code == el.crop_code) {
                data[i].lifting_quantity = el && el.total_lifting ? parseFloat(el.total_lifting) : 0
              }
            })
          })
        }
      }
      let allocationData;
      allocationData = await allocationToIndentorSeed.findAll(
        {
          include: [
            {
              model: cropModel,
              attributes: []
            },
            {
              model: allocationToIndentorProductionCenterSeed,
              where: {
                indent_of_breeder_id: req.body.search.user_id

              },
              attributes: []
            }
          ],
          where: {
            [Op.and]: filterData ? filterData : []
          },
          attributes: [
            [sequelize.fn('SUM', sequelize.col('allocation_to_indentor_for_lifting_seed_production_cnters.qty')), 'qty'],
            //  [sequelize.fn('SUM', sequelize.col('allocation_to_indentor_for_lifting_seed_production_cnters.qty')), 'qty'],
            //  [sequelize.col('allocation_to_indentor_for_lifting_seed_production_cnters.qty'),'qty'],
            [sequelize.col('m_crop.crop_code'), 'crop_code'],

          ],
          group: [
            [sequelize.col('m_crop.crop_code'), 'crop_code'],

          ],
          raw: true
        },

      )
      if (allocationData && allocationData.length > 0) {
        if (data && data.length > 0) {
          allocationData.forEach(ele => {
            data.forEach((item, i) => {

              if (item.crop_code == ele.crop_code) {
                data[i].allocatedQtySecondcrop = ele && ele.qty ? parseFloat(ele.qty) : 0
              }
            })
          })
        }
      }
      response(res, status.DATA_AVAILABLE, 200, data)
    } catch (error) {
      console.log(error);
      response(res, status.DATA_NOT_AVAILABLE, 500)
    }
  }

  static getVarietyCategoryList = async (req, res) => {
    try {
      const varietyCategory = await varietyCategoryModel.findAll({
      });
      return response(res, status.SUCCESS, 200, varietyCategory, {
        message: "variety Category list retrieve successfully."
      });

    } catch (error) {
      console.error("variety Category list:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
  static getCharactersticAgroRegionMapingData = async (req, res) => {
    try {
      const agroRegionData = await db.mCharactersticAgroRegionMappingModel.findAll();
      if (agroRegionData.length) {
        return response(res, status.SUCCESS, 200, agroRegionData);
      } else {
        return response(res, status.SUCCESS, 201, []);
      }
    } catch (error) {
      console.error("variety Category list:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }


  static getFreezedIndentDonutChartData_WithQuantity = async (req, res) => {
    try {
      const { search, loginedUserid } = req.body;
      console.log("loginedUserid", loginedUserid.id)
      console.log("------search.crop_type---", search.crop_type)

      const whereCondition = {};
      const whereConditionIndentor = {};
      const whereConditionNodal = {};
      const whereConditionBspc = {};
      const whereConditionOilSeed = {};

      if (search?.year) whereCondition.year = search.year;
      if (search?.season) whereCondition.season = search.season;
      if (search?.crop_code) whereCondition.crop_code = search.crop_code;

      if (search?.graphType === "indenter") {
        whereConditionIndentor.user_id = loginedUserid.id;
      }

      if (search?.graphType === "nodal") {
        if (!search.crop_type)
          return response(res, status.BAD_REQUEST, 400, "Crop Type is required.");
        whereConditionNodal.crop_code = { [Op.like]: `${search.crop_type}%` };
        whereConditionNodal.is_freeze = 1;
      }
      if (search?.graphType === "oil-seeds") {
        whereConditionOilSeed.group_code = "A04";
      }
      if (search?.graphType === "bspc") {
        const bspcPerform1Data = await bspProformaOneModel.findOne({
          attributes: ["year", "season", "crop_code"],
          include: [
            {
              model: bspProformaOneBspcModel,
              attribute: [],
              where: { bspc_id: 601 },
            },
          ],
          raw: false,
        });
        return response(res, status.DATA_AVAILABLE, 200, bspcPerform1Data);
      }
      const indentData = await indentOfBreederseedModel.findAll({
        attributes: ["indent_quantity", "is_freeze"],
        where: {
          ...whereConditionIndentor,
          ...whereCondition,
          ...whereConditionNodal,
          ...whereConditionOilSeed,
          is_active: 1,
        },
        raw: true,
      });

      let completed = 0;
      let pending = 0;
      let total = 0;

      for (const row of indentData) {
        const qty = Number(row.indent_quantity) || 0;
        total += qty;

        if (row.is_freeze === 1) {
          completed += qty;
        } else {
          pending += qty;
        }
      }

      const completedInPercentage = total > 0 ? Number(((completed / total) * 100).toFixed(2)) : 0;
      const pendingInPercentage = total > 0 ? Number(((pending / total) * 100).toFixed(2)) : 0;

      const result = {
        total,
        completed,
        pending,
        completedInPercentage,
        pendingInPercentage,
      };

      return response(res, status.DATA_AVAILABLE, 200, result);
    } catch (error) {
      console.error("getFreezedIndentDonutChartData error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  static getFreezedIndentDonutChartDataBackup = async (req, res) => {
    try {
      const { search, loginedUserid } = req.body;

      const whereCondition = {};
      const whereConditionIndentor = {};
      const whereConditionNodal = {};
      const whereConditionBspc = {};
      const whereConditionOilSeed = {};


      if (search?.year) whereCondition.year = search.year;
      if (search?.season) whereCondition.season = search.season;
      if (search?.crop_code) whereCondition.crop_code = search.crop_code;

      // ✅ New: If group_code exists, fetch crop_codes first
      if (search?.group_code) {
        const crops = await db.cropModel.findAll({
          attributes: ['crop_code'],
          where: {
            group_code: search.group_code,
            is_active: 1 // ✅ Corrected syntax: use colon instead of equals
          },
          raw: true
        });

        const cropCodes = crops.map(row => row.crop_code);
        if (cropCodes.length === 0) {
          return response(res, status.DATA_AVAILABLE, 200, []); // No crops for this group_code, return empty
        }

        whereCondition.crop_code = { [Op.in]: cropCodes };
      }


      if (search?.graphType === "indenter") {
        whereConditionIndentor.user_id = loginedUserid.id;
      }

      if (search?.graphType === "nodal") {
        if (!search.crop_type)
          return response(res, status.BAD_REQUEST, 400, "Crop Type is required.");
        whereConditionNodal.crop_code = { [Op.like]: `${search.crop_type}%` };
        whereConditionNodal.is_freeze = 1;
        whereConditionNodal.is_forward = 1;
      }

      if (search?.graphType === "oil-seeds") {
        whereConditionOilSeed.group_code = "A04";
      }

      if (search?.graphType === "bspc") {
        const bspcPerform1Data = await bspProformaOneModel.findOne({
          attributes: ["year", "season", "crop_code"],
          include: [
            {
              model: bspProformaOneBspcModel,
              attribute: [],
              where: { bspc_id: loginedUserid?.id || 601 },
            },
          ],
          raw: false,
        });
        return response(res, status.DATA_AVAILABLE, 200, bspcPerform1Data);
      }

      const indentData = await indentOfBreederseedModel.findAll({
        attributes: ["crop_code", "is_freeze"],
        where: {
          ...whereConditionIndentor,
          ...whereCondition,
          ...whereConditionNodal,
          ...whereConditionOilSeed,
          is_active: 1,
        },
        raw: true,
      });

      const allCropSet = new Set();
      const completedCropSet = new Set();
      const pendingCropSet = new Set();

      for (const row of indentData) {
        if (!row.crop_code) continue;
        allCropSet.add(row.crop_code);

        if (row.is_freeze === 1) {
          completedCropSet.add(row.crop_code);
        } else {
          pendingCropSet.add(row.crop_code);
        }
      }
      console.log("----indentData", indentData)
      const total = allCropSet.size;
      const completed = completedCropSet.size;
      const pending = pendingCropSet.size;

      console.log("----total indentData", total)
      console.log("----completed indentData", completed)
      console.log("----pending indentData", pending)


      const completedInPercentage = total > 0 ? Number(((completed / total) * 100).toFixed(2)) : 0;
      const pendingInPercentage = total > 0 ? Number(((pending / total) * 100).toFixed(2)) : 0;

      const result = {
        total,
        completed,
        pending,
        completedInPercentage,
        pendingInPercentage,
      };

      return response(res, status.DATA_AVAILABLE, 200, result);
    } catch (error) {
      console.error("getFreezedIndentDonutChartData error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  static getFreezedIndentDonutChartData = async (req, res) => {
    try {
      const { search, loginedUserid } = req.body;

      const whereCondition = {
        is_active: 1
      };

      if (search?.year) whereCondition.year = search.year;
      if (search?.season) whereCondition.season = search.season;
      if (search?.crop_code) whereCondition.crop_code = search.crop_code;

      // ✅ If group_code exists, fetch crop_codes first
      if (search?.group_code) {
        const crops = await db.cropModel.findAll({
          attributes: ['crop_code'],
          where: {
            group_code: search.group_code,
            is_active: 1
          },
          raw: true
        });

        const cropCodes = crops.map(row => row.crop_code);
        if (cropCodes.length === 0) {
          return response(res, status.DATA_AVAILABLE, 200, []); // No crops for this group_code
        }

        whereCondition.crop_code = { [Op.in]: cropCodes };
      }

      // ✅ Adjust where condition based on graphType
      switch (search?.graphType) {
        case "indenter":
          whereCondition.user_id = loginedUserid.id;
          break;

        case "nodal":
          if (!search.crop_type) {
            return response(res, status.BAD_REQUEST, 400, "Crop Type is required.");
          }
          whereCondition.crop_code = { [Op.like]: `${search.crop_type}%` };
          whereCondition.is_freeze = 1;
          whereCondition.is_forward = 1;
          break;

        case "oil-seeds":
          whereCondition.group_code = "A04";
          break;

        case "pulses-seeds":
          whereCondition.group_code = "A03";
          break;

        case "bspc":
          const bspcPerform1Data = await bspProformaOneModel.findOne({
            attributes: ["year", "season", "crop_code"],
            include: [{
              model: bspProformaOneBspcModel,
              where: { bspc_id: loginedUserid?.id || 601 },
            }],
            raw: false,
          });
          return response(res, status.DATA_AVAILABLE, 200, bspcPerform1Data);

        default:
          break;
      }

      const indentData = await indentOfBreederseedModel.findAll({
        attributes: [
          [db.Sequelize.fn('DISTINCT', db.Sequelize.col('crop_code')), 'crop_code'],
          [db.Sequelize.fn('MAX', db.Sequelize.col('is_freeze')), 'max_is_freeze']
        ],
        where: whereCondition,
        group: ['crop_code'],
        raw: true,
      });

      const total = indentData.length;
      const completed = indentData.filter(row => row.max_is_freeze == 1).length;
      const pending = total - completed;

      const completedInPercentage = total > 0 ? Number(((completed / total) * 100).toFixed(2)) : 0;
      const pendingInPercentage = total > 0 ? Number(((pending / total) * 100).toFixed(2)) : 0;

      const result = {
        total,
        completed,
        pending,
        completedInPercentage,
        pendingInPercentage,
      };

      return response(res, status.DATA_AVAILABLE, 200, result);
    } catch (error) {
      console.error("getFreezedIndentDonutChartData error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };


  static getAssignToPDPCDonutChartData1 = async (req, res) => {
    try {
      const { search, loginedUserid } = req.body;

      const whereCondition = {};
      const whereConditionIndentor = {};
      const whereConditionNodal = {};
      const whereConditionOilSeed = {};

      // ✅ New: If group_code exists, fetch crop_codes first
      if (search?.group_code) {
        const crops = await db.cropModel.findAll({
          attributes: ['crop_code'],
          where: {
            group_code: search.group_code,
            is_active: 1 // ✅ Corrected syntax: use colon instead of equals
          },
          raw: true
        });

        const cropCodes = crops.map(row => row.crop_code);
        if (cropCodes.length === 0) {
          return response(res, status.DATA_AVAILABLE, 200, []); // No crops for this group_code, return empty
        }

        whereCondition.crop_code = { [Op.in]: cropCodes };
      }

      if (search?.year) whereCondition.year = search.year;
      if (search?.season) whereCondition.season = search.season;
      if (search?.crop_code) whereCondition.crop_code = search.crop_code;

      if (search?.graphType === "indenter") {
        whereConditionIndentor.user_id = loginedUserid?.id;
      }

      if (search?.graphType === "nodal") {
        if (!search.crop_type) {
          return response(res, status.BAD_REQUEST, 400, 'Crop Type is required.');
        }
        whereConditionNodal.crop_code = { [Op.like]: `${search.crop_type}%` };
      }

      if (search?.graphType === "oil-seeds") {
        whereConditionOilSeed.group_code = 'A04';
      }

      if (search?.graphType === "bspc") {
        const bspcPerform1Data = await bspProformaOneModel.findOne({
          attributes: ['year', 'season', 'crop_code'],
          include: [
            {
              model: bspProformaOneBspcModel,
              where: { bspc_id: loginedUserid?.id },
              attributes: []
            }
          ],
          raw: false,
        });
        return response(res, status.DATA_AVAILABLE, 200, bspcPerform1Data);
      }
      // Fetch indent data with crop join
      const indentData = await db.indentOfBreederseedModel.findAll({
        attributes: ['crop_code', 'is_freeze', 'icar_freeze', 'is_forward'],
        include: [
          {
            model: db.cropModel,
            as: 'm_crop',
            required: true,
            attributes: ['breeder_id'],
            where: {
              breeder_id: { [Op.ne]: null },
              ...whereConditionOilSeed,
            },
          },
        ],
        where: {
          ...whereCondition,
          ...whereConditionIndentor,
          ...whereConditionNodal,
          is_active: 1,
        },
        raw: true,
      });
      const totalSet = new Set();
      const completedSet = new Set();
      const pendingSet = new Set();

      for (const row of indentData) {
        const cropCode = row.crop_code;
        if (!cropCode) continue;

        totalSet.add(cropCode);

        if ((row.is_freeze === 1 && row.icar_freeze === 1 && row.is_forward === 1) && row['m_crop.breeder_id']) {
          completedSet.add(cropCode);
        } else {
          pendingSet.add(cropCode);
        }
      }

      const total = totalSet.size;
      // const completed = completedSet.size;
      const completed = totalSet.size - pendingSet.size;

      const pending = pendingSet.size;
      const completedInPercentage = total > 0 ? parseFloat(((completed / total) * 100).toFixed(2)) : 0;
      const pendingInPercentage = total > 0 ? parseFloat(((pending / total) * 100).toFixed(2)) : 0;

      const result = {
        total,                  // distinct crop_code count
        completed,              // distinct crop_code count where freeze + icar_freeze = 1
        pending,                // distinct crop_code count where not both frozen
        completedInPercentage,
        pendingInPercentage,
      };

      return response(res, status.DATA_AVAILABLE, 200, result);
    } catch (error) {
      console.error("getAssignToPDPCDonutChartData error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };
  static getAssignToPDPCDonutChartData = async (req, res) => {
    try {
      const { search, loginedUserid } = req.body;

      const whereCondition = {
        is_active: 1
      };
      const whereConditionIndentor = {};
      const whereConditionNodal = {};
      const whereConditionOilSeed = {};

      // ✅ If group_code exists, fetch crop_codes first
      if (search?.group_code) {
        const crops = await db.cropModel.findAll({
          attributes: ['crop_code'],
          where: {
            group_code: search.group_code,
            is_active: 1
          },
          raw: true 
        });

        const cropCodes = crops.map(row => row.crop_code);
        if (cropCodes.length === 0) {
          return response(res, status.DATA_AVAILABLE, 200, []); // No crops for this group_code
        }

        whereCondition.crop_code = { [Op.in]: cropCodes };
      }

      if (search?.year) whereCondition.year = search.year;
      if (search?.season) whereCondition.season = search.season;
      if (search?.crop_code) whereCondition.crop_code = search.crop_code;

      if (search?.graphType === "indenter") {
        whereConditionIndentor.user_id = loginedUserid?.id;
      }

      if (search?.graphType === "nodal") {
        if (!search.crop_type) {
          return response(res, status.BAD_REQUEST, 400, 'Crop Type is required.');
        }
        whereConditionNodal.crop_code = { [Op.like]: `${search.crop_type}%` };
      }

      if (search?.graphType === "oil-seeds") {
        whereConditionOilSeed.group_code = 'A04';
      }
      if (search?.graphType === "pulses-seeds") {
        whereConditionOilSeed.group_code = 'A03';
      }

      if (search?.graphType === "bspc") {
        const bspcPerform1Data = await bspProformaOneModel.findOne({
          attributes: ['year', 'season', 'crop_code'],
          include: [
            {
              model: bspProformaOneBspcModel,
              where: { bspc_id: loginedUserid?.id },
              attributes: []
            }
          ],
          raw: false,
        });
        return response(res, status.DATA_AVAILABLE, 200, bspcPerform1Data);
      }

      // ⭐ Use single aggregated query with GROUP BY and join conditions
      const indentData = await db.indentOfBreederseedModel.findAll({
        attributes: [
          [db.Sequelize.col('indent_of_breederseeds.crop_code'), 'crop_code'],
          [db.Sequelize.fn('MAX', db.Sequelize.col('indent_of_breederseeds.is_freeze')), 'max_is_freeze'],
          [db.Sequelize.fn('MAX', db.Sequelize.col('indent_of_breederseeds.icar_freeze')), 'max_icar_freeze'],
          [db.Sequelize.fn('MAX', db.Sequelize.col('indent_of_breederseeds.is_forward')), 'max_is_forward'],
          [db.Sequelize.fn('MAX', db.Sequelize.col('m_crop.breeder_id')), 'breeder_id']
        ],
        include: [
          {
            model: db.cropModel,
            as: 'm_crop',
            required: true,
            attributes: [],
            where: {
              breeder_id: { [Op.ne]: null },
              ...whereConditionOilSeed,
            },
          },
        ],
        where: {
          ...whereCondition,
          ...whereConditionIndentor,
          ...whereConditionNodal,
        },
        group: ['indent_of_breederseeds.crop_code'],
        raw: true,
      });

      const total = indentData.length;

      // ✅ Calculate completed count directly from aggregated results
      const completed = indentData.filter(row =>
        row.max_is_freeze == 1 &&
        row.max_icar_freeze == 1 &&
        row.max_is_forward == 1 &&
        row.breeder_id != null
      ).length;

      const pending = total - completed;

      const completedInPercentage = total > 0 ? Number(((completed / total) * 100).toFixed(2)) : 0;
      const pendingInPercentage = total > 0 ? Number(((pending / total) * 100).toFixed(2)) : 0;

      const result = {
        total,                  // distinct crop_code count
        completed,              // distinct crop_code count where freeze + icar_freeze + forward + breeder_id exist
        pending,
        completedInPercentage,
        pendingInPercentage,
      };

      return response(res, status.DATA_AVAILABLE, 200, result);

    } catch (error) {
      console.error("getAssignToPDPCDonutChartData error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };


  static getProductionDonutChartDataBackup = async (req, res) => {
    try {
      const { search, loginedUserid } = req.body;
      // ✅ New: If group_code exists, fetch crop_codes first
      if (search?.group_code) {
        const crops = await db.cropModel.findAll({
          attributes: ['crop_code'],
          where: {
            group_code: search.group_code,
            is_active: 1 // ✅ Corrected syntax: use colon instead of equals
          },
          raw: true
        });

        const cropCodes = crops.map(row => row.crop_code);
        if (cropCodes.length === 0) {
          return response(res, status.DATA_AVAILABLE, 200, []); // No crops for this group_code, return empty
        }

        whereCondition.crop_code = { [Op.in]: cropCodes };
      }

      const whereCondition = {};
      const whereConditionIndentor = {};
      const whereConditionNodal = {};
      const whereConditionOilSeed = {};

      if (search?.year) whereCondition.year = search.year;
      if (search?.season) whereCondition.season = search.season;
      if (search?.crop_code) whereCondition.crop_code = search.crop_code;

      if (search?.graphType === "indenter") {
        whereConditionIndentor.user_id = loginedUserid?.id;
      }

      if (search?.graphType === "nodal") {
        if (!search.crop_type) {
          return response(res, status.BAD_REQUEST, 400, 'Crop Type is required.');
        }
        whereConditionNodal.crop_code = { [Op.like]: `${search.crop_type}%` };
      }

      if (search?.graphType === "oil-seeds") {
        whereConditionOilSeed.group_code = 'A04';
      }

      // Step 1: Fetch bspPerformaBspOne and associated bspc_id
      const bspOneData = await db.bspPerformaBspOne.findAll({
        attributes: ['id', 'crop_code', 'user_id'],
        where: {
          ...whereCondition,
          ...whereConditionIndentor,
          ...whereConditionNodal,
        },
        include: [
          {
            model: db.cropModel,
            as: 'm_crop',
            required: true,
            attributes: ['group_code'],
            where: {
              ...whereConditionOilSeed,
            },
          },
          {
            model: db.bspProformaOneBspc,
            as: 'bspc_mapping',
            attributes: ['bspc_proforma_1_id', 'bspc_id'],
          },
        ],
        raw: true,
      });



      // Step 2: Group crop_code → unique bspc_id set
      const cropToBspcIdsMap = new Map();

      for (const row of bspOneData) {
        const cropCode = row.crop_code;
        const bspcId = row['bspc_mapping.bspc_id'];
        const bspcProforma1Id = row['bspc_mapping.bspc_proforma_1_id'];

        if (!cropCode || !bspcId || !bspcProforma1Id) continue;

        if (!cropToBspcIdsMap.has(cropCode)) {
          cropToBspcIdsMap.set(cropCode, new Set());
        }
        cropToBspcIdsMap.get(cropCode).add(bspcId);
      }

      // Step 3: Fetch all submitted bspc user_ids
      const submittedUsers = await db.availabilityOfBreederSeedModel.findAll({
        attributes: ['user_id'],
        where: { is_final_submit: 1 },
        raw: true,
      });

      const submittedUserIds = new Set(submittedUsers.map(row => row.user_id));

      // Step 4: Count how many crop codes are fully completed
      let completed = 0;

      for (const [cropCode, bspcIdSet] of cropToBspcIdsMap.entries()) {
        const allSubmitted = [...bspcIdSet].every(id => submittedUserIds.has(id));
        if (allSubmitted) completed++;
      }

      const total = cropToBspcIdsMap.size;
      const pending = total - completed;

      const completedInPercentage = total > 0 ? parseFloat(((completed / total) * 100).toFixed(2)) : 0;
      const pendingInPercentage = total > 0 ? parseFloat(((pending / total) * 100).toFixed(2)) : 0;

      const result = {
        total,
        completed,
        pending,
        completedInPercentage,
        pendingInPercentage,
      };

      return response(res, status.DATA_AVAILABLE, 200, result);
    } catch (error) {
      console.error("getProductionDonutChartData error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  static getProductionDonutChartData = async (req, res) => {
    try {
      const { search, loginedUserid } = req.body;

      const whereCondition = {};
      const whereConditionIndentor = {};
      const whereConditionNodal = {};
      const whereConditionOilSeed = {};
      const whereConditionPulseSeed ={};

      // ⭐ Populate conditions
      if (search?.year) whereCondition.year = search.year;
      if (search?.season) whereCondition.season = search.season;
      if (search?.crop_code) whereCondition.crop_code = search.crop_code;

      if (search?.graphType === "indenter") {
        whereConditionIndentor.user_id = loginedUserid?.id;
      }

      if (search?.graphType === "nodal") {
        if (!search.crop_type) {
          return response(res, status.BAD_REQUEST, 400, "Crop Type is required.");
        }
        whereConditionNodal.crop_code = { [Op.like]: `${search.crop_type}%` };
      }

      if (search?.graphType === "oil-seeds") {
        whereConditionOilSeed.group_code = "A04";
      }

      if (search?.graphType === "pulses-seeds") {
        whereConditionPulseSeed.group_code = "A03";
      }

      // ⭐ If group_code exists, fetch crop_codes first
      if (search?.group_code) {
        const crops = await db.cropModel.findAll({
          attributes: ["crop_code"],
          where: {
            group_code: search.group_code,
            is_active: 1,
          },
          raw: true,
        });

        const cropCodes = crops.map(row => row.crop_code);
        if (cropCodes.length === 0) {
          return response(res, status.DATA_AVAILABLE, 200, []); // No crops for this group_code
        }

        whereCondition.crop_code = { [Op.in]: cropCodes };
      }

      // ⭐ Step 1: Fetch bspPerformaBspOne ids and crop_codes
      const bspOneData = await db.bspPerformaBspOne.findAll({
        attributes: ["id", "crop_code"],
        where: {
          ...whereCondition,
          ...whereConditionIndentor,
          ...whereConditionNodal,
        },
        include: [
          {
            model: db.cropModel,
            as: "m_crop",
            required: true,
            attributes: ["group_code"],
            where: {
              ...whereConditionOilSeed,
              ...whereConditionPulseSeed
            },
          },
        ],
        raw: true,
      });

      const bspOneIds = bspOneData.map(row => row.id);
      const allCropCodesSet = new Set(bspOneData.map(row => row.crop_code).filter(code => !!code));

      if (bspOneIds.length === 0) {
        return response(res, status.DATA_AVAILABLE, 200, {
          total: 0,
          completed: 0,
          pending: 0,
          completedInPercentage: 0,
          pendingInPercentage: 0,
        });
      }

      // ⭐ Step 2: Get bspc_proforma_1_id and bspc_id from bspProformaOneBspc
      const bspcMappings = await db.bspProformaOneBspc.findAll({
        attributes: ["bspc_proforma_1_id", "bspc_id"],
        where: {
          bspc_proforma_1_id: { [Op.in]: bspOneIds },
        },
        raw: true,
      });

      // ⭐ Step 3: Build crop_code to bspc_id map
      const cropToBspcIdsMap = new Map();
      bspcMappings.forEach(row => {
        const bspOne = bspOneData.find(b => b.id === row.bspc_proforma_1_id);
        if (bspOne && bspOne.crop_code && row.bspc_id) {
          if (!cropToBspcIdsMap.has(bspOne.crop_code)) {
            cropToBspcIdsMap.set(bspOne.crop_code, new Set());
          }
          cropToBspcIdsMap.get(bspOne.crop_code).add(row.bspc_id);
        }
      });

      // ⭐ Step 4: Fetch availabilityOfBreederSeedModel rows for these bspc_ids and crop_codes
      const availabilityData = await db.availabilityOfBreederSeedModel.findAll({
        attributes: ["crop_code", "user_id", "is_final_submit"],
        where: {
          crop_code: { [Op.in]: Array.from(cropToBspcIdsMap.keys()) },
          user_id: { [Op.in]: Array.from(new Set([].concat(...Array.from(cropToBspcIdsMap.values()).map(set => Array.from(set))))) },
        },
        raw: true,
      });

      // ⭐ Step 5: Group by crop_code and check if all rows have is_final_submit = 1
      const cropCompletionStatus = new Map();

      availabilityData.forEach(row => {
        const status = cropCompletionStatus.get(row.crop_code);
        if (status === "pending") return; // already marked pending
        if (row.is_final_submit === 0) {
          cropCompletionStatus.set(row.crop_code, "pending");
        } else if (!status) {
          cropCompletionStatus.set(row.crop_code, "completed");
        }
      });

      // ⭐ Step 6: Calculate counts
      const total = cropToBspcIdsMap.size;
      let completed = 0;
      let pending = 0;

      cropToBspcIdsMap.forEach((_, cropCode) => {
        if (cropCompletionStatus.get(cropCode) === "completed") {
          completed++;
        } else {
          pending++;
        }
      });

      const completedInPercentage = total > 0 ? parseFloat(((completed / total) * 100).toFixed(2)) : 0;
      const pendingInPercentage = total > 0 ? parseFloat(((pending / total) * 100).toFixed(2)) : 0;

      const result = {
        total,
        completed,
        pending,
        completedInPercentage,
        pendingInPercentage,
      };

      return response(res, status.DATA_AVAILABLE, 200, result);
    } catch (error) {
      console.error("getProductionDonutChartData error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };




  static getAllocationDonutChartDataBackup = async (req, res) => {
    try {
      const { search, loginedUserid } = req.body;
      console.log("--search?.crop_code-", search?.crop_code, search?.season, search?.year)

      if (!search?.year || !search?.season) {
        return response(res, { message: "Season, and year are required." }, 400, []);
      }
      const whereCondition = {};
      const whereConditionIndentor = {};
      const whereConditionNodal = {};
      const whereConditionNodalFinalSubmit = {};
      const whereConditionOilSeed = {};
      // ✅ New: If group_code exists, fetch crop_codes first
      if (search?.group_code) {
        const crops = await db.cropModel.findAll({
          attributes: ['crop_code'],
          where: {
            group_code: search.group_code,
            is_active: 1 // ✅ Corrected syntax: use colon instead of equals
          },
          raw: true
        });

        const cropCodes = crops.map(row => row.crop_code);
        if (cropCodes.length === 0) {
          return response(res, status.DATA_AVAILABLE, 200, []); // No crops for this group_code, return empty
        }

        whereCondition.crop_code = { [Op.in]: cropCodes };
      }

      if (search?.year) whereCondition.year = search.year;
      if (search?.season) whereCondition.season = search.season;
      if (search?.crop_code) whereCondition.crop_code = search.crop_code;

      if (search?.graphType === 'indenter') {
        whereConditionIndentor.user_id = loginedUserid?.id;
      }
      if (search?.graphType === 'nodal') {
        if (!search.crop_type) {
          return response(res, status.BAD_REQUEST, 400, 'Crop Type is required.');
        }
        whereConditionNodal.crop_code = { [Op.like]: `${search.crop_type}%` };
        whereConditionNodalFinalSubmit.is_final_submit = 1;
      }
      if (search?.graphType === 'oil-seeds') {
        whereConditionOilSeed.group_code = 'A04';
      }

      // For BSPC Work Is Pending

      // if (search?.graphType === 'bspc') {
      //   const bspcData = await bspProformaOneModel.findOne({
      //     attributes: ['year', 'season', 'crop_code'],
      //     include: [
      //       {
      //         model: bspProformaOneBspcModel,
      //         where: { bspc_id: loginedUserid?.id || 601 }
      //       }
      //     ],
      //     raw: false
      //   });

      //   return response(res, status.DATA_AVAILABLE, 200, bspcData);
      // }

      // Total crop_codes from availability


      const totalCrops = await db.availabilityOfBreederSeedModel.findAll({
        attributes: ['crop_code', 'is_final_submit'],
        include: [
          {
            model: db.cropModel,
            as: 'm_crop',
            attributes: [],
            where: {
              ...(search?.graphType === 'oil-seeds' ? { group_code: 'A04' } : {})
            }
          }
        ],

        where: {
          ...whereCondition,
          ...whereConditionIndentor,
          ...whereConditionNodal,
          ...whereConditionNodalFinalSubmit
        },
        raw: true
      });

      const total = totalCrops.length;
      // Completed crop_codes from allocation with join to cropModel
      const completedCrops = await db.allocationToIndentorSeed.findAll({
        attributes: ['crop_code'],
        include: [
          {
            model: db.cropModel,
            as: 'm_crop',
            attributes: [],
            where: {
              ...(search?.graphType === 'oil-seeds' ? { group_code: 'A04' } : {})
            }
          }
        ],
        where: {
          is_variety_submitted: 1,
          ...whereCondition,
          ...whereConditionIndentor,
          ...whereConditionNodal
        },
        raw: true
      });

      const completed = completedCrops.length;
      const pending = total - completed;

      const completedInPercentage = total > 0 ? parseFloat(((completed / total) * 100).toFixed(2)) : 0;
      const pendingInPercentage = total > 0 ? parseFloat(((pending / total) * 100).toFixed(2)) : 0;

      const result = {
        total,
        completed,
        pending,
        completedInPercentage,
        pendingInPercentage
      };

      return response(res, status.DATA_AVAILABLE, 200, result);
    } catch (error) {
      console.error("getAllocationDonutChartData error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  static getAllocationDonutChartDataWOrking = async (req, res) => {
    try {
      const { search, loginedUserid } = req.body;
      console.log("--search?.crop_code-", search?.crop_code, search?.season, search?.year);

      if (!search?.year || !search?.season) {
        return response(res, { message: "Season and year are required." }, 400, []);
      }

      const whereCondition = {
        year: search.year,
        season: search.season,
        is_final_submit: 1
      };
      const whereConditionIndentor = {};
      const whereConditionNodal = {};
      const whereConditionNodalFinalSubmit = {};
      const whereConditionOilSeed = {};

      if (search?.group_code) {
        const crops = await db.cropModel.findAll({
          attributes: ['crop_code'],
          where: {
            group_code: search.group_code,
            is_active: 1
          },
          raw: true
        });

        const cropCodes = crops.map(row => row.crop_code);
        if (cropCodes.length === 0) {
          return response(res, status.DATA_AVAILABLE, 200, []);
        }

        whereCondition.crop_code = { [Op.in]: cropCodes };
      }

      if (search?.crop_code) whereCondition.crop_code = search.crop_code;

      if (search?.graphType === 'indenter') {
        whereConditionIndentor.user_id = loginedUserid?.id;
      }

      if (search?.graphType === 'nodal') {
        if (!search.crop_type) {
          return response(res, status.BAD_REQUEST, 400, 'Crop Type is required.');
        }
        whereConditionNodal.crop_code = { [Op.like]: `${search.crop_type}%` };
        whereConditionNodalFinalSubmit.is_final_submit = 1;
      }

      if (search?.graphType === 'oil-seeds') {
        whereConditionOilSeed.group_code = 'A04';
      }

      // ✅ Step 1: Fetch availability data (Table 1)
      const availabilityData = await db.availabilityOfBreederSeedModel.findAll({
        attributes: ['crop_code', 'user_id'],
        include: [
          {
            model: db.cropModel,
            as: 'm_crop',
            attributes: [],
            where: {
              ...(search?.graphType === 'oil-seeds' ? { group_code: 'A04' } : {})
            }
          }
        ],
        where: {
          ...whereCondition,
          ...whereConditionIndentor,
          ...whereConditionNodal,
          ...whereConditionNodalFinalSubmit
        },
        raw: true
      });

      const uniqueCropCodes = [...new Set(availabilityData.map(a => a.crop_code))];
      const total = uniqueCropCodes.length;

      let completed = 0;

      // ✅ Step 2: For each crop_code, check ALL rows submitted
      for (const crop_code of uniqueCropCodes) {
        const usersForCrop = availabilityData
          .filter(a => a.crop_code === crop_code)
          .map(a => a.user_id);

        let allRecordsSubmittedForCrop = true;

        for (const user_id of usersForCrop) {
          // 🔗 Table 2: allocationToIndentorProductionCenterSeed
          const productionCenters = await db.allocationToIndentorProductionCenterSeed.findAll({
            attributes: ['allocation_to_indentor_for_lifting_seed_id'],
            where: { production_center_id: user_id },
            raw: true
          });

          const allocationIds = productionCenters.map(p => p.allocation_to_indentor_for_lifting_seed_id);

          if (allocationIds.length === 0) {
            allRecordsSubmittedForCrop = false;
            break;
          }

          // 🔗 Table 3: allocationToIndentorSeed
          const allocations = await db.allocationToIndentorSeed.findAll({
            attributes: ['is_variety_submitted'],
            where: {
              id: { [Op.in]: allocationIds },
              crop_code,
              year: search.year,
              season: search.season
            },
            raw: true
          });

          if (allocations.length === 0) {
            allRecordsSubmittedForCrop = false;
            break;
          }

          // ✅ 🚨 Final required condition:
          // If ANY record has is_variety_submitted = 0 ➔ mark as pending
          const anyNotSubmitted = allocations.some(a => a.is_variety_submitted == 0);

          if (anyNotSubmitted) {
            allRecordsSubmittedForCrop = false;
            break;
          }
        }

        if (allRecordsSubmittedForCrop) completed++;
      }

      const pending = total - completed;

      const completedInPercentage = total > 0 ? parseFloat(((completed / total) * 100).toFixed(2)) : 0;
      const pendingInPercentage = total > 0 ? parseFloat(((pending / total) * 100).toFixed(2)) : 0;

      const result = {
        total,
        completed,
        pending,
        completedInPercentage,
        pendingInPercentage
      };

      return response(res, status.DATA_AVAILABLE, 200, result);

    } catch (error) {
      console.error("getAllocationDonutChartData error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  static getAllocationDonutChartData = async (req, res) => {
    try {
      const { search, loginedUserid } = req.body;
      console.log("--search?.crop_code-", search?.crop_code, search?.season, search?.year);

      if (!search?.year || !search?.season) {
        return response(res, { message: "Season and year are required." }, 400, []);
      }

      // ✅ Build where conditions
      const whereCondition = {
        year: search.year,
        season: search.season,
        is_final_submit: 1
      };
      const whereConditionIndentor = {};
      const whereConditionNodal = {};
      const whereConditionNodalFinalSubmit = {};

      if (search?.group_code) {
        const crops = await db.cropModel.findAll({
          attributes: ['crop_code'],
          where: {
            group_code: search.group_code,
            is_active: 1
          },
          raw: true
        });

        const cropCodes = crops.map(row => row.crop_code);
        if (cropCodes.length === 0) {
          return response(res, status.DATA_AVAILABLE, 200, []);
        }

        whereCondition.crop_code = { [Op.in]: cropCodes };
      }

      if (search?.crop_code) whereCondition.crop_code = search.crop_code;

      if (search?.graphType === 'indenter') {
        whereConditionIndentor.user_id = loginedUserid?.id;
      }

      if (search?.graphType === 'nodal') {
        if (!search.crop_type) {
          return response(res, status.BAD_REQUEST, 400, 'Crop Type is required.');
        }
        whereConditionNodal.crop_code = { [Op.like]: `${search.crop_type}%` };
        whereConditionNodalFinalSubmit.is_final_submit = 1;
      }

      // ✅ Fetch availability data (Table 1) in one go
      const availabilityData = await db.availabilityOfBreederSeedModel.findAll({
        attributes: ['crop_code', 'user_id'],
        include: [{
          model: db.cropModel,
          as: 'm_crop',
          attributes: [],
          where: search?.graphType === 'oil-seeds' ? { group_code: 'A04' } : 
                search?.graphType === 'pulses-seeds' ? { group_code: 'A03' } : {}
        }],
        where: {
          ...whereCondition,
          ...whereConditionIndentor,
          ...whereConditionNodal,
          ...whereConditionNodalFinalSubmit
        },
        raw: true
      });

      const uniqueCropCodes = [...new Set(availabilityData.map(a => a.crop_code))];
      const total = uniqueCropCodes.length;

      // ✅ Fetch all production centers in one query
      const userIds = availabilityData.map(a => a.user_id);
      const productionCenters = await db.allocationToIndentorProductionCenterSeed.findAll({
        attributes: ['production_center_id', 'allocation_to_indentor_for_lifting_seed_id'],
        where: { production_center_id: { [Op.in]: userIds } },
        raw: true
      });

      // ✅ Fetch all allocation records in one query
      const allocationIds = productionCenters.map(p => p.allocation_to_indentor_for_lifting_seed_id);
      const allocations = await db.allocationToIndentorSeed.findAll({
        attributes: ['id', 'crop_code', 'is_variety_submitted'],
        where: {
          id: { [Op.in]: allocationIds },
          year: search.year,
          season: search.season
        },
        raw: true
      });

      // ✅ Group allocations by crop_code for easy lookup
      const allocationMap = {};
      allocations.forEach(a => {
        if (!allocationMap[a.crop_code]) allocationMap[a.crop_code] = [];
        allocationMap[a.crop_code].push(a.is_variety_submitted);
      });

      // ✅ Calculate completed count efficiently
      let completed = 0;
      uniqueCropCodes.forEach(crop_code => {
        const submittedStatuses = allocationMap[crop_code] || [];
        if (submittedStatuses.length > 0 && submittedStatuses.every(status => status == 1)) {
          completed++;
        }
      });

      const pending = total - completed;
      const completedInPercentage = total > 0 ? parseFloat(((completed / total) * 100).toFixed(2)) : 0;
      const pendingInPercentage = total > 0 ? parseFloat(((pending / total) * 100).toFixed(2)) : 0;

      const result = {
        total,
        completed,
        pending,
        completedInPercentage,
        pendingInPercentage
      };

      return response(res, status.DATA_AVAILABLE, 200, result);

    } catch (error) {
      console.error("getAllocationDonutChartData error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };


  static getLiftingDonutChartData = async (req, res) => {
    try {
      const { search, loginedUserid } = req.body;

      // ✅ Build filter conditions
      const whereCondition = {};
      const whereConditionIndentor = {};
      const whereConditionNodal = {};
      const whereConditionOilSeed = {};
      const whereConditionPulseSeed = {};

      if (search?.year) whereCondition.year = search.year;
      if (search?.season) whereCondition.season = search.season;
      if (search?.group_code) whereCondition.crop_group_code = search.group_code;

      if (search?.group_code) {
        const cropsGroup = await db.cropModel.findAll({
          attributes: ['crop_code'],
          where: {
            group_code: search.group_code,
            is_active: 1
          },
          raw: true
        });

        const cropCodes = cropsGroup.map(row => row.crop_code);
        if (cropCodes.length === 0) {
          return response(res, status.DATA_AVAILABLE, 200, []);
        }

        whereCondition.crop_code = { [Op.in]: cropCodes };
      }

      if (search?.graphType === 'indenter') {
        whereConditionIndentor.bspc_id = loginedUserid?.id;
      }

      if (search?.graphType === 'nodal') {
        if (!search.crop_type) {
          return response(res, status.BAD_REQUEST, 400, 'Crop Type is required.');
        }
        whereConditionNodal.crop_code = { [Op.like]: `${search.crop_type}%` };
      }

      if (search?.graphType === 'oil-seeds') {
        whereConditionOilSeed.crop_group_code = 'A04';
      }

      if (search?.graphType === 'pulses-seeds') {
        whereConditionPulseSeed.crop_group_code = 'A03';
      }

      // ✅ Fetch crops with IDs
      const crops = await db.allocationToSPASeed.findAll({
        attributes: ['crop_code', 'id'],
        where: {
          ...whereCondition,
          ...whereConditionIndentor,
          ...whereConditionNodal,
          ...whereConditionOilSeed,
          ...whereConditionPulseSeed
        },
        raw: true
      });


      // ✅ Group IDs per crop_code
      const cropIdMap = {};
      for (const crop of crops) {
        if (!cropIdMap[crop.crop_code]) cropIdMap[crop.crop_code] = [];
        cropIdMap[crop.crop_code].push(crop.id);
      }

      let total = Object.keys(cropIdMap).length;
      let completed = 0;
      let pending = 0;

      const completedCropCodes = [];
      const pendingCropCodes = [];

      // ✅ For each crop_code, fetch mapping data and validate in liftingSeedDetailsModel
      for (const [cropCode, ids] of Object.entries(cropIdMap)) {
        const mappings = await db.allocationToSPAProductionCenterSeed.findAll({
          attributes: ['production_center_id', 'spa_code', 'state_code'],
          where: {
            allocation_to_spa_for_lifting_seed_id: { [Op.in]: ids }
          },
          raw: true
        });

        // 🔴 If no mappings at all, mark as pending and continue
        if (!mappings || mappings.length === 0) {
          pending += 1;
          pendingCropCodes.push(cropCode);
          continue;
        }

        // ✅ Get unique mappings
        const uniqueMappings = [];
        const seen = new Set();
        for (const map of mappings) {
          const key = `${map.production_center_id}-${map.spa_code}-${map.state_code}`;
          if (!seen.has(key)) {
            seen.add(key);
            uniqueMappings.push(map);
          }
        }

        let allMatched = true;

        // ✅ Check each mapping in liftingSeedDetailsModel
        for (const map of uniqueMappings) {
          const exists = await db.liftingSeedDetailsModel.findOne({
            where: {
              user_id: map.production_center_id,
              spa_code: map.spa_code,
              spa_state_code: map.state_code,
              crop_code: cropCode,
              year: search.year,
              season: search.season
            },
            raw: true
          });

          // 🔴 If liftingSeedDetailsModel record not found for mapping, mark as pending
          if (!exists) {
            allMatched = false;
            break;
          }
        }

        // ✅ Update counts and crop_codes list
        if (allMatched) {
          completed += 1;
          completedCropCodes.push(cropCode);
        } else {
          pending += 1;
          pendingCropCodes.push(cropCode);
        }
      }

      // ✅ Calculate percentages with max 100%
      let completedInPercentage = 0;
      let pendingInPercentage = 0;

      if (total > 0) {
        completedInPercentage = parseFloat(((completed / total) * 100).toFixed(2));
        pendingInPercentage = parseFloat(((pending / total) * 100).toFixed(2));

        completedInPercentage = Math.min(completedInPercentage, 100);
        pendingInPercentage = Math.min(pendingInPercentage, 100);

      }

      const result = {
        total,
        completed,
        pending,
        completedInPercentage,
        pendingInPercentage,

      };

      return response(res, status.DATA_AVAILABLE, 200, result);

    } catch (error) {
      console.error("getLiftingDonutChartData error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };


















  static getState = async (req, res) => {
    try {
      const { year, season, group_code } = req.body.search || {};
      const whereCondition = {};

      // ⭐ Add year and season filters if provided
      if (year) whereCondition.year = year;
      if (season) whereCondition.season = season;

      // ⭐ If group_code is provided, filter by its crops
      if (group_code) {
        const crops = await db.cropModel.findAll({
          attributes: ['crop_code'],
          where: {
            group_code: group_code,
            is_active: 1
          },
          raw: true
        });

        const cropCodes = crops.map(row => row.crop_code);

        if (cropCodes.length === 0) {
          return response(res, status.DATA_AVAILABLE, 200, []); // No crops for this group_code, return empty
        }

        whereCondition.crop_code = { [Op.in]: cropCodes };
      }

      // Fetch distinct state codes from bspPerformaBspTwo with filters
      const stateCodes = await db.bspPerformaBspTwo.findAll({
        attributes: [
          [db.Sequelize.fn('DISTINCT', db.Sequelize.col('state_code')), 'state_code']
        ],
        where: whereCondition,
        raw: true
      });

      const uniqueStateCodes = stateCodes.map(row => row.state_code).filter(code => code);

      // Fetch state names for these codes from stateModel
      const stateInfo = await db.stateModel.findAll({
        attributes: ['state_code', 'state_name'],
        where: {
          state_code: { [Op.in]: uniqueStateCodes }
        },
        raw: true
      });

      // Format final response as [{ id, stateName }]
      const stateData = stateInfo.map((state) => ({
        id: state.state_code,
        state_name: state.state_name
      }));

      return response(res, status.DATA_AVAILABLE, 200, stateData);

    } catch (error) {
      console.error("getState error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  static getAreaSownByStateChartData = async (req, res) => {
    try {
      const { search, loginedUserid } = req.body;

      const whereCondition = {};
      const whereConditionIndentor = {};
      const whereConditionNodal = {};
      const whereConditionOilSeed = {};
      const whereConditionPulsesSeed = {};

      // ✅ New: If group_code exists, fetch crop_codes first
      if (search?.group_code) {
        const crops = await db.cropModel.findAll({
          attributes: ['crop_code'],
          where: {
            group_code: search.group_code,
            is_active: 1 // ✅ Corrected syntax: use colon instead of equals
          },
          raw: true
        });

        const cropCodes = crops.map(row => row.crop_code);
        if (cropCodes.length === 0) {
          return response(res, status.DATA_AVAILABLE, 200, []); // No crops for this group_code, return empty
        }

        whereCondition.crop_code = { [Op.in]: cropCodes };
      }

      // Common filters
      if (search?.year) whereCondition.year = search.year;
      if (search?.season) whereCondition.season = search.season;
      if (search?.crop_code) whereCondition.crop_code = search.crop_code;
      if (search?.state_code) whereCondition.state_code = search.state_code; // ✅ used as filter if passed

      // Graph type specific filters
      if (search?.graphType === 'indenter') {
        whereConditionIndentor.user_id = loginedUserid?.id;
      }

      if (search?.graphType === 'nodal') {
        if (!search.crop_type) {
          return response(res, status.BAD_REQUEST, 400, 'Crop Type is required.');
        }
        whereConditionNodal.crop_code = { [Op.like]: `${search.crop_type}%` };
      }

      if (search?.graphType === 'oil-seeds') {
        whereCondition.crop_code = { [Op.like]: `A04%` };
      }

      if (search?.graphType === 'pulses-seeds') {
        whereConditionPulsesSeed.crop_code = { [Op.like]: `A03%` };
      }

      // Step 1: Get BSP2 data
      const bspTwoData = await db.bspPerformaBspTwo.findAll({
        attributes: ['id', 'state_code', 'crop_code', 'area_shown'],
        where: {
          ...whereCondition,
          ...whereConditionIndentor,
          ...whereConditionNodal,
          ...whereConditionOilSeed,
          ...whereConditionPulsesSeed
        },
        raw: true
      });

      const bspTwoIds = bspTwoData.map(row => row.id);

      // Step 2: Create map from BSP2
      const bspTwoMap = bspTwoData.reduce((map, row) => {
        map[row.id] = {
          state_code: row.state_code,
          crop_code: row.crop_code,
          area_shown: Number(row.area_shown) || 0
        };
        return map;
      }, {});

      // Step 3: Fetch BSP3 data
      const bspThreeData = await db.bspPerformaBspThree.findAll({
        attributes: ['bsp_proforma_2_id', 'rejected_area', 'inspected_area'],
        where: {
          bsp_proforma_2_id: { [Op.in]: bspTwoIds }
        },
        raw: true,
        order: [['inspected_area', 'DESC']], // ✅ Sorting by inspected_area descending
      });

      // Step 4: Aggregate data

      const isCropWise = !!search.state_code; // ✅ check if crop-wise needed

      const aggMap = {};

      for (const row of bspThreeData) {
        const bsp2 = bspTwoMap[row.bsp_proforma_2_id];
        if (!bsp2) continue;

        const groupKey = isCropWise ? bsp2.crop_code : bsp2.state_code; // ⭐ dynamic grouping

        const inspected = Number(row.inspected_area) || 0;
        const rejected = Number(row.rejected_area) || 0;
        const complete = bsp2.area_shown;

        if (!aggMap[groupKey]) {
          aggMap[groupKey] = {
            complete_area: 0,
            inspected_area: 0,
            rejected_area: 0
          };
        }

        aggMap[groupKey].complete_area += complete;
        aggMap[groupKey].inspected_area += inspected;
        aggMap[groupKey].rejected_area += rejected;
      }

      // Step 5: Fetch names (state or crop)
      const uniqueKeys = Object.keys(aggMap);

      let nameInfo = [];
      let nameMap = {};

      if (isCropWise) {
        nameInfo = await db.cropModel.findAll({
          attributes: ['crop_code', 'crop_name'],
          where: { crop_code: { [Op.in]: uniqueKeys } },
          raw: true
        });
        nameMap = nameInfo.reduce((map, row) => {
          map[row.crop_code] = row.crop_name;
          return map;
        }, {});
      } else {
        nameInfo = await db.stateModel.findAll({
          attributes: ['state_code', 'state_name'],
          where: { state_code: { [Op.in]: uniqueKeys } },
          raw: true
        });
        nameMap = nameInfo.reduce((map, row) => {
          map[row.state_code] = row.state_name;
          return map;
        }, {});
      }

      // Step 6: Format final chart data
      const chartData = Object.entries(aggMap).map(([key, data]) => {
        const complete = data.complete_area || 1;
        const inspected = data.inspected_area;
        const rejected = data.rejected_area;
        const pending = Math.max(data.complete_area - (inspected + rejected), 0);

        if (isCropWise) {
          return {
            crop_code: key,
            crop_name: nameMap[key] || key,
            complete_area: data.complete_area,
            inspected_area: inspected,
            inspected_percentage: Number(((inspected / complete) * 100).toFixed(2)),
            rejected_area: rejected,
            rejected_percentage: Number(((rejected / complete) * 100).toFixed(2)),
            pending_area: pending,
            pending_percentage: Number(((pending / complete) * 100).toFixed(2))
          };
        } else {
          return {
            state_code: key,
            state_name: nameMap[key] || key,
            complete_area: data.complete_area,
            inspected_area: inspected,
            inspected_percentage: Number(((inspected / complete) * 100).toFixed(2)),
            rejected_area: rejected,
            rejected_percentage: Number(((rejected / complete) * 100).toFixed(2)),
            pending_area: pending,
            pending_percentage: Number(((pending / complete) * 100).toFixed(2))
          };
        }
      });
      chartData.sort((a, b) => b.inspected_area - a.inspected_area);

      return response(res, status.DATA_AVAILABLE, 200, chartData);
    } catch (error) {
      console.error("getAreaSownByStateChartData error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  static getYearFromVariety = async (req, res) => {
    try {
      let cropGroup;
      if (req.body.loginedUserid.user_type === "OILSEEDADMIN") {
        cropGroup = { crop_code: { [Op.like]: 'A04%' } };
      }
      const result = await varietyModel.findOne({
        where: {
          not_date: {
            [sequelize.Op.and]: [
              { [sequelize.Op.ne]: null },
              sequelize.where(sequelize.fn('TRIM', sequelize.col('not_date')), { [sequelize.Op.ne]: '' }),
              { [sequelize.Op.ne]: 'Invalid date' }
            ],
            ...cropGroup
          }
        },
        attributes: ['not_date'],
        order: [sequelize.literal(`CAST("not_date" AS DATE) ASC`)],
        raw: true
      });

      if (!result || !result.not_date) {
        return response(res, status.DATA_AVAILABLE, 200, []);
      }

      const startYear = new Date(result.not_date).getFullYear();
      const currentYear = new Date().getFullYear();
      const years = [];
      for (let year = startYear; year <= currentYear; year++) {
        years.push(year);
      }
      return response(res, status.DATA_AVAILABLE, 200, years);
    } catch (error) {
      console.error('Error in getYearRangeFromVariety:', error);
      return response(res, status.DATA_NOT_AVAILABLE, 500, { error: error.message });
    }
  };

  // static getDataGroupCodeWiseReportOne = async (req, res) => {
  //   try {
  //     const { search } = req.body;
  //     let cropGroup;
  //     if (req.body.loginedUserid.user_type === "OILSEEDADMIN") {
  //       cropGroup = { crop_code: { [Op.like]: 'A04%' } };
  //     }
  //     if (req.body.loginedUserid.user_type === "PULSESSEEDADMIN") {
  //       cropGroup = { crop_code: { [Op.like]: 'A03%' } };
  //     }
  //     const now = new Date();
  //     let whereClause = {};
  //     let whereClauseCrop = {};

  //     if (search?.search_filter) {
  //       whereClause.group_name = { [Op.iLike]: `%${search.search_filter}%` };
  //     }
  //     if (search?.year_from || search?.year_to) {
  //       const fromDate = search.year_from ? new Date(`${search.year_from}-01-01T00:00:00`) : new Date('1900-01-01T00:00:00');
  //       const toDate = search.year_to ? new Date(`${search.year_to}-12-31T23:59:59`) : now;
  //       whereClause['$crops.m_crop_varieties.not_date$'] = { [Op.between]: [fromDate, toDate] };
  //     }
  //     const groupData = await cropGroupModel.findAll({
  //       attributes: [
  //         'group_code',
  //         'group_name',
  //         [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('crops.id'))), 'total_crop_count'],
  //         [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('crops.m_crop_varieties.id'))), 'total_variety_count'],
  //       ],
  //       required: true,
  //       include: [
  //         {
  //           model: cropModel,
  //           as: 'crops',
  //           attributes: [],
  //           required: true,
  //           where: 
  //             {
  //               whereClauseCrop 
  //             },
  //           include: [
  //             {
  //               model: varietyModel,
  //               attributes: [],
  //               required: false,
  //               where:
  //               {
  //                 ...cropGroup
  //               }
  //             }
  //           ]
  //         }
  //       ],
  //       where:
  //               {
  //                 whereClause,
  //                 // ...cropGroup
  //               }  ,
  //       group: ['m_crop_groups.group_code', 'm_crop_groups.group_name'],
  //       raw: true,
  //     });

  //     // Grand totals
  //     let grandTotalCropCount = 0;
  //     let grandTotalVarietyCount = 0;

  //     groupData.forEach(item => {
  //       grandTotalCropCount += parseInt(item.total_crop_count || 0);
  //       grandTotalVarietyCount += parseInt(item.total_variety_count || 0);
  //     });

  //     const responseData = {
  //       total_crop_count: grandTotalCropCount,
  //       total_variety_count: grandTotalVarietyCount,
  //       data: groupData,
  //     };

  //     response(res, status.DATA_AVAILABLE, 200, responseData);
  //   } catch (error) {
  //     console.error('Error in getDataGroupCodeWise:', error);
  //     response(res, status.DATA_NOT_AVAILABLE, 500);
  //   }
  // };
  static getDataGroupCodeWiseReportOne = async (req, res) => {
  try {
    const { search } = req.body;

    // Determine crop group filter based on user_type
    let cropGroupLike = null;
    if (req.body.loginedUserid.user_type === "OILSEEDADMIN") {
      cropGroupLike = 'A04%';
    }
    if (req.body.loginedUserid.user_type === "PULSESSEEDADMIN") {
      cropGroupLike = 'A03%';
    }

    const now = new Date();
    let whereClause = {};

    if (search?.search_filter) {
      whereClause.group_name = { [Op.iLike]: `%${search.search_filter}%` };
    }

    if (search?.year_from || search?.year_to) {
      const fromDate = search.year_from
        ? new Date(`${search.year_from}-01-01T00:00:00`)
        : new Date('1900-01-01T00:00:00');
      const toDate = search.year_to
        ? new Date(`${search.year_to}-12-31T23:59:59`)
        : now;
      whereClause['$crops.m_crop_varieties.not_date$'] = {
        [Op.between]: [fromDate, toDate],
      };
    }

    const groupData = await cropGroupModel.findAll({
      attributes: [
        'group_code',
        'group_name',
        [
          sequelize.fn(
            'COUNT',
            sequelize.fn('DISTINCT', sequelize.col('crops.id'))
          ),
          'total_crop_count',
        ],
        [
          sequelize.fn(
            'COUNT',
            sequelize.fn('DISTINCT', sequelize.col('crops.m_crop_varieties.id'))
          ),
          'total_variety_count',
        ],
      ],
      include: [
        {
          model: cropModel,
          as: 'crops',
          attributes: [],
          required: true, // INNER JOIN crops
          include: [
            {
              model: varietyModel,
              attributes: [],
              required: false, // LEFT JOIN varieties
              on: cropGroupLike
                ? {
                    [Op.and]: [
                      sequelize.where(
                        sequelize.col('crops->m_crop_varieties.crop_code'),
                        { [Op.like]: cropGroupLike }
                      ),
                    ],
                  }
                : undefined,
            },
          ],
        },
      ],
      where: {
        ...whereClause,
        ...(cropGroupLike === 'A03%' && { group_code: 'A03' }),
        ...(cropGroupLike === 'A04%' && { group_code: 'A04' }),
      },
      group: ['m_crop_groups.group_code', 'm_crop_groups.group_name'],
      raw: true,
    });

    // Grand totals
    let grandTotalCropCount = 0;
    let grandTotalVarietyCount = 0;

    groupData.forEach((item) => {
      grandTotalCropCount += parseInt(item.total_crop_count || 0);
      grandTotalVarietyCount += parseInt(item.total_variety_count || 0);
    });

    const responseData = {
      total_crop_count: grandTotalCropCount,
      total_variety_count: grandTotalVarietyCount,
      data: groupData,
    };

    response(res, status.DATA_AVAILABLE, 200, responseData);
  } catch (error) {
    console.error('Error in getDataGroupCodeWiseReportOne:', error);
    response(res, status.DATA_NOT_AVAILABLE, 500);
  }
};

  static getDataCropWiseReportOne = async (req, res) => {
    try {
      const { search } = req.body;
      const now = new Date();
      let whereClause = {};

      if (!search?.group_code) {
        return response(res, 'Group code is required', 400, null);
      }
      if (search?.search_filter) {
        whereClause.crop_name = { [Op.iLike]: `%${search.search_filter}%` };
      }
      if (search?.year_from || search?.year_to) {
        const fromDate = search.year_from ? new Date(`${search.year_from}-01-01T00:00:00`) : new Date('1900-01-01T00:00:00');
        const toDate = search.year_to ? new Date(`${search.year_to}-12-31T23:59:59`) : now;
        whereClause['$m_crop_varieties.not_date$'] = { [Op.between]: [fromDate, toDate] };
      }
      whereClause.group_code = search.group_code;

      const cropData = await cropModel.findAll({
        attributes: [
          'crop_code',
          'crop_name',
          [sequelize.fn('MIN', sequelize.col('m_crop_group.group_name')), 'group_name'],
          [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('m_crop_varieties.id'))), 'total_variety_count'],
        ],
        include: [
          {
            model: varietyModel,
            attributes: [],
            // required: true,
            required: false,
          },
          {
            model: cropGroupModel,
            attributes: [],
            required: true,
          }
        ],
        where: whereClause,
        group: ['m_crop.crop_code', 'm_crop.crop_name'],
        raw: true,
      });
      // Grand totals
      let total_variety_count = 0;

      cropData.forEach(item => {
        total_variety_count += parseInt(item.total_variety_count || 0);
      });

      const responseData = {
        total_variety_count,
        data: cropData,
      };

      response(res, status.DATA_AVAILABLE, 200, responseData);
    } catch (error) {
      console.error('Error in getDataGroupCodeWise:', error);
      response(res, status.DATA_NOT_AVAILABLE, 500);
    }
  };

  static getDataVarietyWiseReportOne = async (req, res) => {
    try {
      const { search } = req.body;
      const now = new Date();
      let whereClause = {};
      if (search?.group_code) {
        whereClause.crop_code = { [Op.like]: `${search.group_code}%` };
      }
      if (search?.crop_code) {
        whereClause.crop_code = search.crop_code;
      }
      if (search?.search_filter) {
        whereClause.variety_name = { [Op.iLike]: `%${search.search_filter}%` };
      }
      if (search?.year_from || search?.year_to) {
        const fromDate = search.year_from ? new Date(`${search.year_from}-01-01T00:00:00`) : new Date('1900-01-01T00:00:00');
        const toDate = search.year_to ? new Date(`${search.year_to}-12-31T23:59:59`) : now;
        whereClause.not_date = {
          [Op.between]: [fromDate, toDate]
        };
      }

      const varietyData = await varietyModel.findAll({
        attributes: [
          'crop_code',
          'variety_code',
          'variety_name',
          ['not_number', 'notification_number'],
          ['not_date', 'notification_date'],
          [sequelize.col('m_crop.m_crop_group.group_name'), 'group_name'],
          [sequelize.col('m_crop.crop_name'), 'crop_name'],
        ],
        required: true,
        where: whereClause,
        include: [
          {
            model: cropModel,
            attributes: [],
            required: true,
            include: [
              {
                model: cropGroupModel,
                attributes: [],
                required: true,
              }
            ]
          }
        ],
        raw: true,
      });

      response(res, status.DATA_AVAILABLE, 200, varietyData);
    } catch (error) {
      console.error('Error in getDataGroupCodeWise:', error);
      response(res, status.DATA_NOT_AVAILABLE, 500);
    }
  };

  static getStateDataStateWiseReportTwo = async (req, res) => {
    try {
      const { search } = req.body;
      let whereClause = {};
      let whereClauseForState = {};

      if (search?.search_filter) {
        whereClauseForState.state_name = { [Op.iLike]: `%${search.search_filter}%` };
      }
      if (search?.group_code) {
        whereClause['$m_crop.m_crop_group.group_code$'] = search.group_code;
      }
      console.log("----req.body.loginedUserid.user_type", req.body.loginedUserid.user_type)
      if (req.body.loginedUserid.user_type === "OILSEEDADMIN") {
        // cropGroup = { crop_code: { [Op.like]: 'A04%' } };
        whereClause['$m_variety_characteristics.crop_code$'] = {
          [Op.like]: 'A04%'
        }
      };
      if (req.body.loginedUserid.user_type === "PULSESSEEDADMIN") {
        // cropGroup = { crop_code: { [Op.like]: 'A04%' } };
        whereClause['$m_variety_characteristics.crop_code$'] = {
          [Op.like]: 'A03%'
        }
      };
      const groupData = await cropCharactersticsModel.findAll({
        attributes: [
          [sequelize.col('m_state.state_name'), 'state_name'],
          [sequelize.col('m_state.state_code'), 'state_code'],
          [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('m_crop.m_crop_group.id'))), 'total_crop_group_count'],
          [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('m_variety_characteristics.crop_code'))), 'total_crop_count'],
          [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('m_variety_characteristics.variety_id'))), 'total_variety_count']
        ],
        include: [
          {
            model: stateModel,
            attributes: [],
            required: true,
            where: whereClauseForState,
            on: sequelize.literal(`CAST("m_variety_characteristics"."state_id" AS INTEGER) = "m_state"."state_code"`)
          },
          {
            model: cropModel,
            attributes: [],
            required: true,
            include: [
              {
                model: cropGroupModel,
                attributes: [],
                required: true,
              }
            ]
          },
          {
            model: varietyModel,
            attributes: [],
            required: true,
            where: {
              // ...cropGroup
            }
          },
        ],
        where: whereClause,
        group: ['m_state.state_name', 'm_state.state_code'],
        raw: true,
      });
      response(res, status.DATA_AVAILABLE, 200, groupData);
    } catch (error) {
      console.error('Error in getDataGroupCodeWise:', error);
      response(res, status.DATA_NOT_AVAILABLE, 500);
    }
  };

  static getStateDataCropGroupWiseReportTwo = async (req, res) => {
    try {
      const { search } = req.body;
      let whereClause = {};
      let whereClauseForCropGroup = {};

      if (!search?.state_code) {
        return response(res, 'State code is required', 400, null);
      }

      if (search?.search_filter) {
        whereClauseForCropGroup.group_name = { [Op.iLike]: `%${search.search_filter}%` };
      }
      whereClause.state_id = String(search.state_code);

      if (req.body.loginedUserid?.user_type === "OILSEEDADMIN") {
        whereClause['$m_variety_characteristics.crop_code$'] = {
          [Op.like]: 'A04%'
        }
      }
     

      const groupData = await cropCharactersticsModel.findAll({
        attributes: [
          [sequelize.col('m_crop.m_crop_group.group_name'), 'group_name'],
          [sequelize.col('m_crop.m_crop_group.group_code'), 'group_code'],
          [sequelize.fn('MIN', sequelize.col('m_state.state_name')), 'state_name'],
          [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('m_variety_characteristics.crop_code'))), 'total_crop_count'],
          [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('m_variety_characteristics.variety_id'))), 'total_variety_count']
        ],
        include: [
          {
            model: stateModel,
            attributes: [],
            required: true,
            on: sequelize.literal(`CAST("m_variety_characteristics"."state_id" AS INTEGER) = "m_state"."state_code"`)
          },
          {
            model: cropModel,
            attributes: [],
            required: true,
            include: [
              {
                model: cropGroupModel,
                attributes: [],
                required: true,
                where: whereClauseForCropGroup,
              },
            ]
          },
          {
            model: varietyModel,
            attributes: [],
            required: true,
          },
        ],
        where: whereClause,
        group: ['m_crop.m_crop_group.group_name', 'm_crop.m_crop_group.group_code'],
        raw: true,
      });
      response(res, status.DATA_AVAILABLE, 200, groupData);
    } catch (error) {
      console.error('Error in getDataGroupCodeWise:', error);
      response(res, status.DATA_NOT_AVAILABLE, 500);
    }
  };

  static getCropDataCropGroupWiseReportTwo = async (req, res) => {
    try {
      const { search } = req.body;

      let whereClause = {};

      if (search?.search_filter) {
        whereClause.group_name = { [Op.iLike]: `%${search.search_filter}%` };
      }
      if (req.body.loginedUserid.user_type === "OILSEEDADMIN") {
        // cropGroup = { crop_code: { [Op.like]: 'A04%' } };
        whereClause['$m_variety_characteristics.crop_code$'] = {
          [Op.like]: 'A04%'
        }
      };
      if (req.body.loginedUserid.user_type === "PULSESSEEDADMIN") {
        // cropGroup = { crop_code: { [Op.like]: 'A04%' } };
        whereClause['$m_variety_characteristics.crop_code$'] = {
          [Op.like]: 'A03%'
        }
      };

      const groupData = await cropCharactersticsModel.findAll({
        attributes: [
          [sequelize.col('m_crop.m_crop_group.group_name'), 'group_name'],
          [sequelize.col('m_crop.m_crop_group.group_code'), 'group_code'],
          [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('m_variety_characteristics.state_id'))), 'total_state_count'],
          [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('m_variety_characteristics.crop_code'))), 'total_crop_count'],
          [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('m_variety_characteristics.variety_id'))), 'total_variety_count']
        ],
        include: [
          {
            model: stateModel,
            attributes: [],
            required: true,
            on: sequelize.literal(`CAST("m_variety_characteristics"."state_id" AS INTEGER) = "m_state"."state_code"`)
          },
          {
            model: cropModel,
            attributes: [],
            required: true,
            include: [
              {
                model: cropGroupModel,
                attributes: [],
                required: true,
                where: whereClause,
              },
            ]
          },
          {
            model: varietyModel,
            attributes: [],
            required: true,
          },
        ],
        group: ['m_crop.m_crop_group.group_code', 'm_crop.m_crop_group.group_name'],
        raw: true,
      });
      response(res, status.DATA_AVAILABLE, 200, groupData);
    } catch (error) {
      console.error('Error in getDataGroupCodeWise:', error);
      response(res, status.DATA_NOT_AVAILABLE, 500);
    }
  };

  static getCropDataStateWiseReportTwo = async (req, res) => {
    try {
      const { search } = req.body;
      let whereClause = {};
      let whereClauseForState = {};

      if (search?.search_filter) {
        whereClauseForState.state_name = { [Op.iLike]: `%${search.search_filter}%` };
      }
      if (search?.group_code) {
        whereClause['$m_crop.m_crop_group.group_code$'] = search.group_code;
      }

      const groupData = await cropCharactersticsModel.findAll({
        attributes: [
          [sequelize.col('m_state.state_name'), 'state_name'],
          [sequelize.col('m_state.state_code'), 'state_code'],
          [sequelize.fn('MIN', sequelize.col('m_crop.m_crop_group.group_code')), 'group_code'],
          [sequelize.fn('MIN', sequelize.col('m_crop.m_crop_group.group_name')), 'group_name'],
          [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('m_variety_characteristics.crop_group_id'))), 'total_crop_group_count'],
          [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('m_variety_characteristics.crop_code'))), 'total_crop_count'],
          [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('m_variety_characteristics.variety_id'))), 'total_variety_count']
        ],
        include: [
          {
            model: stateModel,
            attributes: [],
            required: true,
            where: whereClauseForState,
            on: sequelize.literal(`CAST("m_variety_characteristics"."state_id" AS INTEGER) = "m_state"."state_code"`)
          },
          {
            model: cropModel,
            attributes: [],
            required: true,
            include: [
              {
                model: cropGroupModel,
                attributes: [],
                required: true,
              }
            ]
          },
          {
            model: varietyModel,
            attributes: [],
            required: true,
          },
        ],
        where: whereClause,
        group: ['m_state.state_code', 'm_state.state_name'],
        raw: true,
      });
      response(res, status.DATA_AVAILABLE, 200, groupData);
    } catch (error) {
      console.error('Error in getDataGroupCodeWise:', error);
      response(res, status.DATA_NOT_AVAILABLE, 500);
    }
  };

  static getDataCropWiseReportTwo = async (req, res) => {
    try {
      const { search } = req.body;
      let whereClause = {};
      let whereClauseForCrop = {};

      if (search?.state_code) {
        whereClause.state_id = String(search.state_code);
      }

      if (search?.group_code) {
        whereClause['$m_crop.m_crop_group.group_code$'] = search.group_code;
      }

      if (search?.search_filter) {
        whereClauseForCrop.crop_name = { [Op.iLike]: `%${search.search_filter}%` };
      }

      if (req.body.loginedUserid?.user_type === "OILSEEDADMIN") {
        whereClause['$m_variety_characteristics.crop_code$'] = {
          [Op.like]: 'A04%'
        }
      }

      const groupData = await cropCharactersticsModel.findAll({
        attributes: [
          [sequelize.fn('MIN', sequelize.col('m_state.state_name')), 'state_name'],
          [sequelize.fn('MIN', sequelize.col('m_crop.m_crop_group.group_name')), 'group_name'],
          [sequelize.col('m_crop.crop_name'), 'crop_name'],
          [sequelize.col('m_crop.crop_code'), 'crop_code'],
          [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('m_variety_characteristics.variety_id'))), 'total_variety_count']
        ],
        include: [
          {
            model: stateModel,
            attributes: [],
            required: true,
            on: sequelize.literal(`CAST("m_variety_characteristics"."state_id" AS INTEGER) = "m_state"."state_code"`)
          },
          {
            model: cropModel,
            attributes: [],
            where: whereClauseForCrop,
            required: true,
            include: [
              {
                model: cropGroupModel,
                attributes: [],
                required: true,
              }
            ]
          },
          {
            model: varietyModel,
            attributes: [],
            required: true,
          },
        ],
        where: whereClause,
        group: ['m_crop.crop_name', 'm_crop.crop_code'],
        raw: true,
      });
      response(res, status.DATA_AVAILABLE, 200, groupData);
    } catch (error) {
      console.error('Error in getDataGroupCodeWise:', error);
      response(res, status.DATA_NOT_AVAILABLE, 500);
    }
  };

  static getDataVarietyWiseReportTwo = async (req, res) => {
    try {
      const { search } = req.body;
      const now = new Date();
      let whereClause = {};
      let whereClauseForVariety = {};

      if (search?.state_code) {
        whereClause.state_id = String(search.state_code);
      }
      if (search?.group_code) {
        whereClause['$m_crop.m_crop_group.group_code$'] = search.group_code;
      }
      if (search?.crop_code) {
        whereClause.crop_code = search.crop_code;
      }
      if (search?.year_from || search?.year_to) {
        const fromDate = search.year_from ? new Date(`${search.year_from}-01-01T00:00:00`) : new Date('1900-01-01T00:00:00');
        const toDate = search.year_to ? new Date(`${search.year_to}-12-31T23:59:59`) : now;
        whereClauseForVariety.not_date = {
          [Op.between]: [fromDate, toDate]
        };
      }

      if (search?.search_filter) {
        whereClauseForVariety.variety_name = { [Op.iLike]: `%${search.search_filter}%` };
      }
      

      if (req.body.loginedUserid?.user_type === "OILSEEDADMIN") {
        whereClause['$m_crop.crop_code$'] = {
          [Op.like]: 'A04%'
        };
      }
  

      const groupData = await cropCharactersticsModel.findAll({
        attributes: [
          [sequelize.col('m_crop_variety.variety_code'), 'variety_code'],
          [sequelize.col('m_crop_variety.variety_name'), 'variety_name'],
          [sequelize.col('m_crop_variety.not_date'), 'notification_date'],
          [sequelize.col('m_crop_variety.not_number'), 'notification_number'],
          [sequelize.col('m_state.state_name'), 'state_name'],
          [sequelize.col('m_crop.m_crop_group.group_name'), 'group_name'],
          [sequelize.col('m_crop.crop_name'), 'crop_name'],
        ],
        include: [
          {
            model: stateModel,
            attributes: [],
            required: true,
            on: sequelize.literal(`CAST("m_variety_characteristics"."state_id" AS INTEGER) = "m_state"."state_code"`)
          },
          {
            model: cropModel,
            attributes: [],
            required: true,
            include: [
              {
                model: cropGroupModel,
                attributes: [],
                required: true,
              }
            ]
          },
          {
            model: varietyModel,
            attributes: [],
            where: whereClauseForVariety,
            required: true,
          },
        ],
        where: whereClause,
        raw: true,
      });
      response(res, status.DATA_AVAILABLE, 200, groupData);
    } catch (error) {
      console.error('Error in getDataGroupCodeWise:', error);
      response(res, status.DATA_NOT_AVAILABLE, 500);
    }
  };

  static getAllVarietyDetails = async (req, res) => {
    try {
      const { search } = req.body;
      let whereClause = {};

      if (!search?.variety_code) {
        return response(res, 'Variety code is required', 400, null);
      }
      whereClause.variety_code = search.variety_code;

      const groupData = await varietyModel.findOne({
        attributes: [
          'variety_code',
          'variety_name',
          ['developed_by', 'developed_by'],
          ['is_notified', 'is_notified'],
          ['status', 'select_type'],
          ['type', 'released_by'],
          ['introduce_year', 'year_of_introduction'],
          ['meeting_number', 'meeting_number'],
          ['not_date', 'notification_date'],
          ['not_number', 'notification_number'],
          [sequelize.col('m_crop.crop_name'), 'crop_name'],
          [sequelize.col('m_crop.botanic_name'), 'botanic_name'],
          [sequelize.col('m_crop.hindi_name'), 'crop_name_hindi'],
          [sequelize.col('m_crop.m_crop_group.group_name'), 'group_name'],
          [sequelize.col('m_variety_characteristic.average_yeild_from'), 'average_yeild_from'],
          [sequelize.col('m_variety_characteristic.average_yeild_to'), 'average_yeild_to'],
          [sequelize.col('m_variety_characteristic.ip_protected_reg_no'), 'ip_protected'],
          [sequelize.col('m_variety_characteristic.gi_tagged_reg_no'), 'ig_tagged'],
          [sequelize.col('m_variety_characteristic.state_data'), 'states_for_cultivation'],
          [sequelize.col('m_variety_characteristic.climate_resilience_json'), 'climate_resilience'],
          [sequelize.col('m_variety_characteristic.reaction_to_pets_json'), 'reaction_insect_pests'],
          [sequelize.col('m_variety_characteristic.reaction_major_diseases_json'), 'reaction_major_diseases'],
          [sequelize.col('m_variety_characteristic.m_state.state_name'), 'state_name'],
          [sequelize.col('m_variety_characteristic.m_agro_logical_region_state.m_agro_ecological_region.regions_name'), 'agro_ecological_regions'],
        ],
        include: [
          {
            model: cropModel,
            attributes: [],
            required: true,
            include: [
              {
                model: cropGroupModel,
                attributes: [],
                required: true,
              }
            ]
          },
          {
            model: cropCharactersticsModel,
            attributes: [],
            required: false,
            include: [
              {
                model: stateModel,
                attributes: [],
                required: true,
                on: sequelize.literal(`CAST("m_variety_characteristic"."state_id" AS INTEGER) = "m_variety_characteristic->m_state"."state_code"`)
              },
              {
                model: mAgroLogicalRegionstatesModel,
                attributes: [],
                required: true,
                on: sequelize.literal(`CAST("m_variety_characteristic"."state_id" AS INTEGER) = "m_variety_characteristic->m_agro_logical_region_state"."state_code"`),
                include: [
                  {
                    model: mAgroEcologicalRegionsModel,
                    attributes: [],
                    required: true,
                  }
                ]
              }
            ]
          }
        ],
        where: whereClause,
        raw: true,
      });

      response(res, status.DATA_AVAILABLE, 200, groupData);
    } catch (error) {
      console.error('Error in getAllVarietyDetails:', error);
      response(res, status.DATA_NOT_AVAILABLE, 500);
    }
  };

  static getAllVarietyDetailsForExcel = async (req, res) => {
    try {
      const { search } = req.body;
      const now = new Date();
      let whereClause = {};

      if (search?.group_code) {
        whereClause['$m_crop.m_crop_group.group_code$'] = search.group_code;
      }
      if (search?.state_code) {
        whereClause['$m_variety_characteristic.state_id$'] = String(search.state_code);
      }
      if (search?.crop_code) {
        whereClause.crop_code = search.crop_code;
      }
      if (search?.variety_code) {
        whereClause.variety_code = search.variety_code;
      }
      if (search?.search_filter) {
        whereClause.variety_name = { [Op.iLike]: `%${search.search_filter}%` };
      }
      if (search?.year_from || search?.year_to) {
        const fromDate = search.year_from ? new Date(`${search.year_from}-01-01T00:00:00`) : new Date('1900-01-01T00:00:00');
        const toDate = search.year_to ? new Date(`${search.year_to}-12-31T23:59:59`) : now;
        whereClause.not_date = {
          [Op.between]: [fromDate, toDate]
        };
      }

      const groupData = await varietyModel.findAll({
        attributes: [
          'variety_code',
          'variety_name',
          ['developed_by', 'developed_by'],
          ['is_active', 'is_active'],
          ['is_notified', 'is_notified'],
          ['status', 'select_type'],
          ['type', 'released_by'],
          ['introduce_year', 'year_of_introduction'],
          ['meeting_number', 'meeting_number'],
          ['not_date', 'notification_date'],
          ['not_number', 'notification_number'],
          [sequelize.col('m_variety_characteristic.average_yeild_from'), 'average_yeild_from'],
          [sequelize.col('m_variety_characteristic.average_yeild_to'), 'average_yeild_to'],
          [sequelize.col('m_variety_characteristic.generic_morphological'), 'generic_morphological'],
          [sequelize.col('m_variety_characteristic.specific_morphological'), 'specific_morphological'],
          [sequelize.col('m_variety_characteristic.agronomic_features'), 'agronomic_features'],
          [sequelize.col('m_variety_characteristic.fertilizer_dosage'), 'fertilizer_dosage'],
          [sequelize.col('m_variety_characteristic.adoptation'), 'adoptation_ecology'],
          [sequelize.col('m_variety_characteristic.state_data'), 'states_for_cultivation'],
          [sequelize.col('m_variety_characteristic.climate_resilience_json'), 'climate_resilience'],
          [sequelize.col('m_variety_characteristic.reaction_to_pets_json'), 'reaction_insect_pests'],
          [sequelize.col('m_variety_characteristic.reaction_major_diseases_json'), 'reaction_major_diseases'],
          [sequelize.col('m_variety_characteristic.m_state.state_name'), 'state_name'],
          [sequelize.col('m_crop.crop_name'), 'crop_name'],
          [sequelize.col('m_crop.m_crop_group.group_name'), 'group_name'],
        ],
        include: [
          {
            model: cropCharactersticsModel,
            attributes: [],
            required: search.crop_characterstic_require,
            include: [
              {
                model: stateModel,
                attributes: [],
                required: true,
                on: sequelize.literal(`CAST("m_variety_characteristic"."state_id" AS INTEGER) = "m_variety_characteristic->m_state"."state_code"`)
              }
            ]
          },
          {
            model: cropModel,
            attributes: [],
            required: true,
            include: [
              {
                model: cropGroupModel,
                attributes: [],
                required: true,
              }
            ]
          }
        ],
        where: whereClause,
        raw: true,
      });

      response(res, status.DATA_AVAILABLE, 200, groupData);
    } catch (error) {
      console.error('Error in getAllVarietyDetailsForExcel:', error);
      response(res, status.DATA_NOT_AVAILABLE, 500);
    }
  };
}

module.exports = SeedController;
