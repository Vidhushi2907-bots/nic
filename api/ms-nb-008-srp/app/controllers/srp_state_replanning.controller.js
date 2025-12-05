const { Op, literal, Sequelize } = require("sequelize");
const db = require("../models");
const response = require('../_helpers/response')
const status = require('../_helpers/status.conf')
const userModel = db.userModel;
const srpCropWise = db.seedRollingPlanCropWisesModel;
const cropModel = db.cropModel
const agencyDetail = db.agencyDetailModel
const srpVarietyWise = db.srp_varietyModel
class SrpWillingnessController {


    // static postSrpCropWiseData = async (req, res) => {
    //     try {
    //         const userId = req.body?.loginedUserid?.id;
    //         console.log(req.body?.loginedUserid?.id, "......................");
    //         // 1️⃣ Fetch user + cropCodes from agency_detail JSON
    //         const user = await userModel.findOne({
    //             where: { id: userId, user_type: "BR" },
    //             include: [
    //                 { model: agencyDetail, as: "agency_detail", attributes: [] }
    //             ],
    //             attributes: [
    //                 "id",
    //                 "name",
    //                 [
    //                     literal(`
    //                     ARRAY(
    //                         SELECT cd->>'crop_code'
    //                         FROM jsonb_array_elements("agency_detail"."crop_data"::jsonb) AS cd
    //                     )
    //                 `),
    //                     "cropCodes"
    //                 ]
    //             ],
    //             raw: true
    //         });

    //         if (!user) {
    //             return response(res, status.DATA_NOT_AVAILABLE, 404, []);
    //         }

    //         const cropCodes = user.cropCodes || [];

    //         // 2️⃣ Fetch only those crops which have SRP filled (INNER JOIN)
    //         const crops = await cropModel.findAll({
    //             where: {
    //                 crop_code: { [Op.in]: cropCodes }
    //             },



    //             include: [
    //                 {
    //                     model: srpCropWise,
    //                     as: "seed_rolling_plan_crop_wises",
    //                     required: true,   // INNER JOIN
    //                     where: {
    //                         is_active: true,
    //                         is_final_submit: true
    //                     },
    //                     attributes: [
    //                         "id",
    //                         "year",
    //                         "season",
    //                         "group_code",
    //                         "crop_code",
    //                         "total_required",
    //                         "user_id"


    //                     ]
    //                 }
    //             ],

    //             attributes: ["id", "crop_name", "crop_code"]
    //         });
    //         const formateData = crops.map((item) => {
    //             const srp = item.seed_rolling_plan_crop_wises?.[0] || {};
    //             return {
    //                 id: item.id,
    //                 season: srp.season,
    //                 year: srp.year,
    //                 crop_code: srp.crop_code,
    //                 crop_name:item.crop_name,
    //                 group_code: srp.group_code,
    //                 user_id: srp.user_id,

    //             }
    //         })

    //         return response(res, status.DATA_AVAILABLE, 200, formateData);

    //     } catch (error) {
    //         console.log(error);
    //         return res.status(500).json({
    //             status: false,
    //             message: "Server Error",
    //             error
    //         });
    //     }
    // };


    static getSrpStateReplanningYearData = async (req, res) => {
        try {
            const userId = req.body?.loginedUserid?.id;

            const user = await userModel.findOne({
                where: { id: userId, user_type: "IN" },
            });

            if (!user) {
                return response(res, status.DATA_NOT_AVAILABLE, 404, []);
            }

            const data = await db.seedRollingPlanCropWisesModel.findAll({
                attributes: ["year"],
                order: [["year", "ASC"]],
                where: {
                    is_active: true,
                    is_final_submit: true,
                }
            });

            const allYears = data.map(item => item.year);
            const uniqueYears = [...new Set(allYears)];
            const formattedYears = uniqueYears.map(year => ({ year }));

            return response(res, status.DATA_AVAILABLE, 200, formattedYears);

        } catch (error) {
            console.log(error);
            return response(res, "Server Error", 500, error);
        }
    };


    static getSrpStateReplanningSeasonData = async (req, res) => {
        try {
            const { year } = req.query;
            console.log(req.body?.loginedUserid?.id, "req.body?.loginedUserid?.id;")
            const userId = req.body?.loginedUserid?.id;
            const user = await userModel.findOne({
                where: { id: userId, user_type: "IN" },
            });

            if (!user) {
                return response(res, status.DATA_NOT_AVAILABLE, 404, []);//kgkgkg
            }
            console.log(year)
            const data = await db.seedRollingPlanCropWisesModel.findAll({
                where: {
                    year: year, is_active: true,
                    is_final_submit: true,
                },
                attributes: ["season"],


            });
            const allSeason = data.map(item => item.season);

            // Remove duplicates
            const uniqueSeason = [...new Set(allSeason)];

            // Format required output
            const formattedYears = uniqueSeason.map(season => ({ season }));
            return response(res, status.DATA_AVAILABLE, 200, formattedYears);

        } catch (error) {
            console.log(error);
            return response(res, "Server Error", 500, error)

        }
    };
    static getSrpStateReplanningCropData = async (req, res) => {
        try {
            const { year, season } = req.query;
            console.log(req.body?.loginedUserid?.id, "req.body?.loginedUserid?.id;")
            const userId = req.body?.loginedUserid?.id;
            const user = await userModel.findOne({
                where: { id: userId, user_type: "IN" },
            });

            if (!user) {
                return response(res, status.DATA_NOT_AVAILABLE, 404, []);//kgkgkg
            }
            const data = await db.srpCropModel.findAll({
                where: {
                    year: year, season: season, is_active: true,
                    is_final_submit: true,
                },

                include: [{
                    model: db.cropModel,
                    attibutes: ["crop_code", "crop_name"]

                }],
                attributes: ["crop_code"],

            });

            const formattedData = data.map(item => {
                return {
                    crop_code: item.crop_code,
                    crop_name: item.m_crop.crop_name
                }
            })
            console.log(formattedData, "formattedData")
            return response(res, status.DATA_AVAILABLE, 200, formattedData);

        } catch (error) {
            console.log(error);
            return response(res, "Server Error", 500, error)

        }
    };
  static getSrpStateReplanningVareityData = async (req, res) => {
    try {
        const { year, season, crop_code } = req.query;

        const srpCropData = await db.srpCropModel.findOne({
            where: { year, season, crop_code },
        });

        if (!srpCropData) {
            return response(res, "Data not Found", 404, []);
        }

        const varietyData = await db.srpVarietyModel.findAll({
            where: { srp_crop_wise_id: srpCropData.id },

            attributes: ["variety_code", "breeder_seed", "srp_crop_wise_id"],

            include: [
                {
                    model: db.varietyModel,
                    required: true,
                    attributes: ["variety_code", "variety_name"]
                },

                // ⭐ WILLINGNESS INCLUDE
                {
                    model: db.srpWillingnessModel,
                    required: true,
                 
                    // ⭐ REPLACE VARIETY INCLUDE (SHOW WHEN EXISTS)
                    include: [
                        {
                            model: db.srpWillingnessReplaceModel,
                            required: true,   // ⭐ SHOW ONLY WHEN EXISTS
                            where: {
                                srp_willingness_id: {
                                    [db.Sequelize.Op.col]:
                                        "seed_rolling_plan_willingnesses.id"
                                }
                            }
                        }
                    ],
                    raw:true
                }
            ]
        });

        return response(res, status.DATA_AVAILABLE, 200, varietyData);
    } catch (error) {
        console.log(error);
        return response(res, "Something Went wrong!", 500, []);
    }
};











}
module.exports = SrpWillingnessController
