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


    static getSrpWillingnessYearData = async (req, res) => {
        try {
            const userId = req.body?.loginedUserid?.id;

            // 1️⃣ Find BR user's crop_codes from agency_detail
            const user = await userModel.findOne({
                where: { id: userId, user_type: "BR" },
                include: [
                    { model: agencyDetail, as: "agency_detail", attributes: [] }
                ],
                attributes: [
                    "id",
                    [
                        literal(`
                        ARRAY(
                            SELECT cd->>'crop_code'
                            FROM jsonb_array_elements("agency_detail"."crop_data"::jsonb) AS cd
                        )
                    `),
                        "cropCodes"
                    ]
                ],
                raw: true
            });

            if (!user) {
                return response(res, status.DATA_NOT_AVAILABLE, 404, []);//kgkgkg
            }

            const cropCodes = user.cropCodes || [];

            const years = await cropModel.findAll({
                where: {
                    crop_code: { [Op.in]: cropCodes }
                },
                include: [
                    {
                        model: srpCropWise,
                        as: "seed_rolling_plan_crop_wises",
                        required: true,   // INNER JOIN
                        where: {
                            is_active: true,
                            is_final_submit: true,

                        },
                        attributes:
                            ["year"]
                        ,
                        order: [["year", "ASC"]],
                    }
                ],

            });

            // 🔹 Extract all years
            const allYears = years.flatMap(item =>
                item.seed_rolling_plan_crop_wises.map(srp => srp.year)
            );

            // 🔹 Remove duplicate years
            const uniqueYears = [...new Set(allYears)];

            // 🔹 Format to your required response
            const formattedYears = uniqueYears.map(year => ({ year }));
            return response(res, status.DATA_AVAILABLE, 200, formattedYears);

        } catch (error) {
            console.log(error);
            return response(res, "Server Error", 500, error)

        }
    };
    static getSrpWillingnessSeasonData = async (req, res) => {
        try {
            const userId = req.body?.loginedUserid?.id;
            const { year } = req.query;

            if (!userId) {
                return response(res, status.DATA_NOT_AVAILABLE, 400, "User ID Required");
            }

            // 1️⃣ Get BR user's crop codes
            const user = await userModel.findOne({
                where: { id: userId, user_type: "BR" },
                include: [
                    { model: agencyDetail, as: "agency_detail", attributes: [] }
                ],
                attributes: [
                    "id",
                    [
                        literal(`
                        ARRAY(
                            SELECT cd->>'crop_code'
                            FROM jsonb_array_elements("agency_detail"."crop_data"::jsonb) AS cd
                        )
                    `),
                        "cropCodes"
                    ]
                ],
                raw: true
            });

            if (!user) {
                return response(res, status.DATA_NOT_AVAILABLE, 404, []);
            }

            const cropCodes = user.cropCodes || [];

            // 2️⃣ Get SEASONS for the selected YEAR
            const seasons = await cropModel.findAll({
                where: {
                    crop_code: { [Op.in]: cropCodes }
                },
                include: [
                    {
                        model: srpCropWise,
                        as: "seed_rolling_plan_crop_wises",
                        required: true,   // INNER JOIN
                        where: {
                            is_active: true,
                            is_final_submit: true,
                            year: year
                        },
                        attributes:
                            ["season"]
                        ,
                        order: [["season", "ASC"]],
                    }
                ],

            });
            const allSeason = seasons.flatMap(item =>
                item.seed_rolling_plan_crop_wises.map(srp => srp.season)
            );

            // Remove duplicates (now works!)
            const uniqueSeason = [...new Set(allSeason)];

            // Format result
            const formattedSeasons = uniqueSeason.map(season => ({ season }));

            console.log(formattedSeasons, "formatted");

            return response(res, status.DATA_AVAILABLE, 200, formattedSeasons);

        } catch (error) {
            console.log(error);
            return response(res, "Server Error", 500, error)
        }
    };

    static getSrpWillingnessCropData = async (req, res) => {
        try {
            const userId = req.body?.loginedUserid?.id;
            const { year, season } = req.query;

            if (!userId) {
                return response(res, status.DATA_NOT_AVAILABLE, 400, "User ID Required");
            }

            // 1️⃣ Get BR user's crop codes
            const user = await userModel.findOne({
                where: { id: userId, user_type: "BR" },
                include: [
                    { model: agencyDetail, as: "agency_detail", attributes: [] }
                ],
                attributes: [
                    "id",
                    [
                        literal(`
                        ARRAY(
                            SELECT cd->>'crop_code'
                            FROM jsonb_array_elements("agency_detail"."crop_data"::jsonb) AS cd
                        )
                    `),
                        "cropCodes"
                    ]
                ],
                raw: true
            });

            if (!user) {
                return response(res, status.DATA_NOT_AVAILABLE, 404, []);
            }

            const cropCodes = user.cropCodes || [];

            //fetch crop search on year and season
            const crops = await cropModel.findAll({
                where: {
                    crop_code: { [Op.in]: cropCodes }
                },



                include: [
                    {
                        model: srpCropWise,
                        as: "seed_rolling_plan_crop_wises",
                        required: true,   // INNER JOIN
                        where: {
                            is_active: true,
                            is_final_submit: true,
                            year: year,
                            season: season
                        },
                        attributes: [
                            "id",
                            "year",
                            "season",
                            "group_code",
                            "crop_code",
                            "total_required",
                            "user_id"


                        ]
                    }
                ],

                attributes: ["id", "crop_name", "crop_code"]
            });
            const formateData = crops.map((item) => {
                const srp = item.seed_rolling_plan_crop_wises?.[0] || {};
                return {
                    id: item.id,
                    season: srp.season,
                    year: srp.year,
                    crop_code: srp.crop_code,
                    crop_name: item.crop_name,
                    group_code: srp.group_code,
                    user_id: srp.user_id,

                }
            })

            return response(res, status.DATA_AVAILABLE, 200, formateData);


        } catch (error) {
            console.log(error);
            return response(res, "Server Error", 500, error)
        }
    };


    static getSrpWillingnessVarietyData = async (req, res) => {
        try {
            const { year, season, crop_code } = req.query;

            const varieties = await db.srpVarietyModel.findAll({
                where: {
                    is_active: true,
                    is_final_submit: true
                },
                include: [
                    {
                        model: db.srpCropModel,
                        as: "seed_rolling_plan_crop_wises",
                        required: true,
                        where: {
                            year, season, crop_code,
                            is_active: true,
                            is_final_submit: true
                        },
                        attributes: []
                    },
                    {
                        model: db.varietyModel,
                        as: "m_crop_variety",
                        required: true,
                        attributes: []  // attributes blank because we will pick in main select
                    }
                ],

                attributes: [
                    "variety_code",

                    // JOIN table values
                    [db.Sequelize.col("seed_rolling_plan_crop_wises.year"), "year"],
                    [db.Sequelize.col("seed_rolling_plan_crop_wises.season"), "season"],
                    [db.Sequelize.col("seed_rolling_plan_crop_wises.crop_code"), "crop_code"],

                    // 🎯 FIX: include variety_name here
                    [db.Sequelize.col("m_crop_variety.variety_name"), "variety_name"],

                    // SUM
                    [db.Sequelize.fn("SUM", db.Sequelize.col("breeder_seed")), "total_breeder_seed"]
                ],

                group: [
                    "seed_rolling_plan_crop_wises.year",
                    "seed_rolling_plan_crop_wises.season",
                    "seed_rolling_plan_crop_wises.crop_code",
                    "seed_rolling_plan_variety_wises.variety_code",
                    "m_crop_variety.variety_name"
                ],

                raw: true
            });

            return response(res, status.DATA_AVAILABLE, 200, varieties);

        } catch (error) {
            console.log(error);
            return response(res, "Server Error", 500, error)
        }
    };
    // static getSrpWillingnessVarietyData = async (req, res) => {
    //     try {
    //         const { year, season, crop_code } = req.query;

    //         const varieties = await db.srpVarietyModel.findAll({
    //             where: {
    //                 is_active: true,
    //                 is_final_submit: true
    //             },
    //             include: [
    //                 {
    //                     model: db.srpCropModel,
    //                     as: "seed_rolling_plan_crop_wises",
    //                     required: true,
    //                     where: {
    //                         year, season, crop_code,
    //                         is_active: true,
    //                         is_final_submit: true
    //                     },
    //                     attributes: []
    //                 },
    //                 {
    //                     model: db.varietyModel,
    //                     as: "m_crop_variety",
    //                     required: true,
    //                     attributes: []  // attributes blank because we will pick in main select
    //                 }
    //             ],

    //             attributes: [
    //                 "variety_code",

    //                 // JOIN table values
    //                 [db.Sequelize.col("seed_rolling_plan_crop_wises.year"), "year"],
    //                 [db.Sequelize.col("seed_rolling_plan_crop_wises.season"), "season"],
    //                 [db.Sequelize.col("seed_rolling_plan_crop_wises.crop_code"), "crop_code"],

    //                 // 🎯 FIX: include variety_name here
    //                 [db.Sequelize.col("m_crop_variety.variety_name"), "variety_name"],

    //                 // SUM
    //                 [db.Sequelize.fn("SUM", db.Sequelize.col("breeder_seed")), "total_breeder_seed"]
    //             ],

    //             group: [
    //                 "seed_rolling_plan_crop_wises.year",
    //                 "seed_rolling_plan_crop_wises.season",
    //                 "seed_rolling_plan_crop_wises.crop_code",
    //                 "seed_rolling_plan_variety_wises.variety_code",
    //                 "m_crop_variety.variety_name"
    //             ],

    //             raw: true
    //         });

    //         return response(res, status.DATA_AVAILABLE, 200, varieties);

    //     } catch (error) {
    //         console.log(error);
    //         return response(res, "Server Error", 500, error)
    //     }
    // };
    static getSrpWillingnessIndentorName = async (req, res) => {
        try {
            const { year, season, crop_code, variety_code } = req.query;

            const varieties = await db.srpVarietyModel.findAll({
                where: {
                    ...(variety_code && { variety_code }),
                    is_active: true,
                    is_final_submit: true
                },

                include: [
                    {
                        model: db.srpCropModel,
                        as: "seed_rolling_plan_crop_wises",
                        required: true,
                        where: {
                            year, season, crop_code,
                            is_active: true,
                            is_final_submit: true
                        },
                        attributes: [],

                        include: {
                            model: db.userModel,
                            required: true,
                            attributes: ["name", "user_type",]
                        }
                    },
                ],
                attributes: ["breeder_seed"],



                raw: true
            });

            // const formattedData = varieties.map(item => {
            //     return {
            //         breeder_seed: item.breeder_seed,
            //         user_name: item.seed_rolling_plan_crop_wises.user.name
            //     };
            // });
            const formattedData = varieties.map(item => ({
                breeder_seed: item.breeder_seed,
                user_name: item["seed_rolling_plan_crop_wises.user.name"]
            }));
            return response(res, status.DATA_AVAILABLE, 200, formattedData);

        } catch (error) {
            console.log(error);
            return response(res, "Server Error", 500, error)
        }
    };
    static getVarietyData = async (req, res) => {
        try {
            const { crop_code } = req.query;


            const usedVarieties = await db.srpVarietyModel.findAll({
                attributes: ["variety_code"],
                raw: true
            });

            const usedCodes = usedVarieties.map(v => v.variety_code);


            const varieties = await db.varietyModel.findAll({
                where: {
                    crop_code: crop_code,
                    variety_code: {

                        [db.Sequelize.Op.notIn]: usedCodes
                    }
                },
                order: [["variety_name", "ASC"]],
                raw: true
            });

            return response(res, status.DATA_AVAILABLE, 200, varieties);

        } catch (error) {
            console.log(error);
            return response(res, "Server Error", 500, error)
        }
    };
    static postSrpWillingnessData = async (req, res) => {
        try {
            const { willingnessData, action } = req.body;

            const user_id = req.body?.loginedUserid?.id;
            const userData = await db.userModel.findOne({
                where: { id: user_id }
            });

            if (userData.user_type !== "BR") {
                return response(res, 'Not Access Other User', 403);
            }

            const isDraft = action === "draft";
            const isFinalSubmit = action === "final";
            const savedRecords = [];

            // 🌟 LOOP STARTS
            for (const crop of willingnessData) {

                const {
                    crop_code,
                    variety_code,
                    year,
                    season,
                    quantity,
                    is_additional,
                    willingness,
                    replace_variety_code
                } = crop;

                const remarks =
                    is_additional === true
                        ? (crop.remarks ?? null)
                        : null;

                const existing = await db.srpWillingnessModel.findOne({
                    where: { year, season, crop_code, variety_code }
                });

                if (!existing) {

                    if (willingness === true) {
                        const newCrop = await db.srpWillingnessModel.create({
                            crop_code,
                            variety_code,
                            year,
                            season,
                            is_active: true,
                            quantity,
                            is_additional,
                            remarks,
                            user_id,
                            willingness,
                            is_draft: isDraft,
                            is_final_submit: isFinalSubmit
                        });

                        savedRecords.push(newCrop);
                    }
                    else {

                        const baseEntry = await db.srpWillingnessModel.create({
                            crop_code,
                            variety_code,
                            year,
                            season,
                            is_active: false,
                            quantity: 0.0,
                            is_additional,
                            remarks,
                            user_id,
                            willingness,
                            is_draft: isDraft,
                            is_final_submit: isFinalSubmit
                        });

                        savedRecords.push(baseEntry);

                        if (replace_variety_code) {
                            const replaceEntry = await db.srpWillingnessReplaceModel.create({
                                srp_willingness_id: baseEntry.id,
                                replace_variety_code,
                                is_active: true,
                                quantity
                            });

                            savedRecords.push(replaceEntry);
                        }
                    }
                }
                else {

                    if (willingness === true) {

                        await existing.update({
                            is_active: true,
                            quantity,
                            is_additional,
                            remarks: null,
                            willingness,
                            is_draft: isDraft,
                            is_final_submit: isFinalSubmit
                        });

                        savedRecords.push(existing);

                        // deactivate old replace entries
                        await db.srpWillingnessReplaceModel.update(
                            { is_active: false },
                            { where: { srp_willingness_id: existing.id, is_active: true } }
                        );
                    }
                    else {

                        await existing.update({
                            is_active: false,
                            quantity: 0.0,
                            is_additional,
                            remarks,
                            willingness,
                            is_draft: isDraft,
                            is_final_submit: isFinalSubmit
                        });

                        savedRecords.push(existing);

                        if (replace_variety_code) {

                            const existingReplace = await db.srpWillingnessReplaceModel.findOne({
                                where: { srp_willingness_id: existing.id }
                            });

                            if (existingReplace) {
                                await existingReplace.update({
                                    replace_variety_code,
                                    quantity,
                                    is_active: true
                                });

                                savedRecords.push(existingReplace);
                            }
                            else {
                                const newReplace = await db.srpWillingnessReplaceModel.create({
                                    srp_willingness_id: existing.id,
                                    replace_variety_code,
                                    quantity,
                                    is_active: true
                                });

                                savedRecords.push(newReplace);
                            }
                        }
                    }

                    savedRecords.push(existing);
                }
            }
            const message =
                action === "final"
                    ? "Crop data finalized successfully"
                    : "Crop data saved as draft successfully";

            return response(res, message, 200, savedRecords);

        } catch (error) {
            console.error("Error in postSrpCropWiseData:", error);
            return response(res, status.DATA_NOT_AVAILABLE, 500);
        }
    };
    static getSrpWillingnessDetails= async(req,res)=>{
    }







}
module.exports = SrpWillingnessController
