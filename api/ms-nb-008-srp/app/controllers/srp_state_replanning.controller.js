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

    //     static getSrpStateReplanningVareityData = async (req, res) => {
    //         try {
    //             const { year, season, crop_code } = req.query;
    //             const userId = req.body?.loginedUserid?.id;

    //             const user = await userModel.findOne({
    //                 where: { id: userId, user_type: "IN" },
    //             });

    //             if (!user) {
    //                 return response(res, status.DATA_NOT_AVAILABLE, 404, []);
    //             }

    //             const srpCropData = await db.srpCropModel.findOne({
    //                 where: { year, season, crop_code },
    //                 attributes: ["year", "season", "crop_code", "id"]
    //             });

    //             if (!srpCropData) {
    //                 return response(res, "Data not Found", 404, []);
    //             }
    //             const varietyData = await db.srpVarietyModel.findAll({
    //                 where: { srp_crop_wise_id: srpCropData.id },
    //                 attributes: ["variety_code", "breeder_seed", "srp_crop_wise_id"],
    //                 include: [
    //                     {
    //                         model: db.varietyModel,
    //                         required: true,
    //                         attributes: ["variety_name"]
    //                     },
    //                     {
    //                         model: db.srpWillingnessModel,
    //                         as: "vw",
    //                         required: true,
    //                         attributes: ["id", "willingness", "quantity", "is_additional","remarks"],
    //                         include: [
    //                             {
    //                                 model: db.srpWillingnessReplaceModel,
    //                                 as: "seed_rolling_plan_willingness_replaces",
    //                                 required: false,
    //                                 attributes: ["id", "replace_variety_code", "quantity"],
    //                                 include: [
    //                                     {
    //                                         model: db.varietyModel,
    //                                         as: "m_crop_variety",
    //                                         required: true,
    //                                         attributes: ["variety_code", "variety_name"]
    //                                     }
    //                                 ]
    //                             }
    //                         ]
    //                     }
    //                 ]
    //             });
    //             console.log(varietyData,"varietyData")
    //             const sqlQuery = `
    //           SELECT 
    //     c.year,c.season,c.crop_code,
    //     v.variety_code,
    //    sum(cast(v.breeder_seed as numeric(10,2)) )
    // FROM seed_rolling_plan_crop_wises c
    // JOIN seed_rolling_plan_variety_wises v
    //     ON v.srp_crop_wise_id = c.id
    // 	  WHERE c.year = :year
    //               AND c.season = :season
    //               AND c.crop_code = :crop_code
    // group BY  c.year,c.season,c.crop_code,
    //     v.variety_code

    //         `;

    //             const formattedData = varietyData.map(v => {
    //                 const vwData = Array.isArray(v.vw) && v.vw.length > 0 ? v.vw[0] : null;

    //                 return {
    //                     variety_code: v.variety_code,
    //                     breeder_seed: v.breeder_seed,
    //                     srp_crop_wise_id: v.srp_crop_wise_id,
    //                     variety_name: v.m_crop_variety?.variety_name || null,

    //                     sum_breeder_seed: null, // will fill later
    //                     total_seed_allocation: null, // will calculate later

    //                     // --- Direct Willingness Fields ---
    //                     willingness: vwData ? vwData.willingness : null,
    //                     quantity: vwData ? vwData.quantity : null,
    //                     remarks: vwData ? vwData.remarks : null,

    //                     seed_rolling_plan_willingness_replaces: vwData
    //                         ? vwData.seed_rolling_plan_willingness_replaces?.map(r => ({
    //                             id: r.id,
    //                             replace_variety_code: r.replace_variety_code,
    //                             quantity: r.quantity,
    //                             variety_detail: r.m_crop_variety
    //                                 ? {
    //                                     variety_code: r.m_crop_variety.variety_code,
    //                                     variety_name: r.m_crop_variety.variety_name
    //                                 }
    //                                 : null
    //                         })) || []
    //                         : []
    //                 };
    //             });

    //             // Step 2: SQL Result
    //             const varietyData1 = await db.sequelize.query(sqlQuery, {
    //                 replacements: { year, season, crop_code },
    //                 type: db.Sequelize.QueryTypes.SELECT
    //             });

    //             // Step 3: Merge sum_breeder_seed and calculate total_seed_allocation
    //             formattedData.forEach(item => {
    //                 const match = varietyData1.find(v => v.variety_code === item.variety_code);
    //                 if (match) {
    //                     item.sum_breeder_seed = parseFloat(match.sum);

    //                     if (item.quantity != null) {
    //                         item.total_seed_allocation = item.breeder_seed / item.sum_breeder_seed * item.quantity; // breeder_seed * quantity
    //                     }
    //                 }
    //             });

    //             return response(res, "Data Available", 200, varietyData);

    //         } catch (error) {
    //             console.log(error);
    //             return response(res, "Something Went wrong!", 500, []);
    //         }
    //     };

    static getSrpStateReplanningVareityData = async (req, res) => {
        try {
            const { year, season, crop_code } = req.query;
            const userId = req.body?.loginedUserid?.id;

            const user = await userModel.findOne({
                where: { id: userId, user_type: "IN" },
            });

            if (!user) {
                return response(res, status.DATA_NOT_AVAILABLE, 404, []);
            }

            const srpCropData = await db.srpCropModel.findOne({
                where: { year, season, crop_code },
                attributes: ["year", "season", "crop_code", "id"]
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
                        as: "m_crop_variety", // <- this alias must match how you access it
                        required: true,
                        attributes: ["variety_name"]
                    },
                    {
                        model: db.srpWillingnessModel,
                        as: "vw",
                        required: true,
                        attributes: ["id", "willingness", "quantity", "is_additional", "remarks"],
                        include: [
                            {
                                model: db.srpWillingnessReplaceModel,
                                as: "seed_rolling_plan_willingness_replaces",
                                required: false,
                                attributes: ["id", "replace_variety_code", "quantity"],
                                include: [
                                    {
                                        model: db.varietyModel,
                                        as: "m_crop_variety",
                                        required: true,
                                        attributes: ["variety_code", "variety_name"]
                                    }
                                ],
                                raw: true
                            }
                        ],

                    }
                ]
            });

            const sqlQuery = `
            SELECT 
                c.year, c.season, c.crop_code,
                v.variety_code,
                sum(cast(v.breeder_seed as numeric(10,2))) as sum
            FROM seed_rolling_plan_crop_wises c
            JOIN seed_rolling_plan_variety_wises v
                ON v.srp_crop_wise_id = c.id
            WHERE c.year = :year
                AND c.season = :season
                AND c.crop_code = :crop_code
            GROUP BY c.year, c.season, c.crop_code, v.variety_code
        `;

            const varietyData1 = await db.sequelize.query(sqlQuery, {
                replacements: { year, season, crop_code },
                type: db.Sequelize.QueryTypes.SELECT
            });

            // Format Data
            const formattedData = varietyData.map(v => {
                const vwData = Array.isArray(v.vw) && v.vw.length > 0 ? v.vw[0] : null;

                // Get sum from SQL query
                const sumMatch = varietyData1.find(f => f.variety_code === v.variety_code);
                const sum_breeder_seed = sumMatch ? parseFloat(sumMatch.sum) : null;

                return {
                    variety_code: v.variety_code,
                    breeder_seed: v.breeder_seed,
                    srp_crop_wise_id: v.srp_crop_wise_id,
                    variety_name: v.m_crop_variety?.variety_name || v.m_crop_variety?.variet, // use correct field
                    sum_breeder_seed,
                    total_seed_allocation: (vwData && sum_breeder_seed)
                        ? (v.breeder_seed / sum_breeder_seed) * vwData.quantity
                        : null,

                    // Direct Willingness Fields
                    willingness: vwData ? vwData.willingness : null,
                    quantity: vwData ? vwData.quantity : null,
                    remarks: vwData ? vwData.remarks : null,

                    seed_rolling_plan_willingness_replaces: vwData
                        ? vwData.seed_rolling_plan_willingness_replaces?.map(r => {
                            // extract plain object
                            const variety = r.m_crop_variety?.get?.({ plain: true }) || null;

                            console.log(variety, "variety_name"); // debug log

                            return {
                                id: r.id,
                                replace_variety_code: r.replace_variety_code,
                                quantity: r.quantity,
                                      replace_variety_name: variety ? variety.variet : null, // renamed field
                                      
                                
                            };
                        }) || []
                        : []
                };

            });

            return response(res, "Data Available", 200,  formattedData );

        } catch (error) {
            console.log(error);
            return response(res, "Something Went wrong!", 500, []);
        }
    };



    async getBreederSeedByVariety(variety_code) {
        const result = await db.seedRollingPlanVarietyWises.findOne({
            attributes: [
                "variety_code",
                [db.Sequelize.fn("SUM", db.Sequelize.col("breeder_seed")), "breeder_seed"]
            ],
            where: { variety_code },
            group: ["variety_code"],
            raw: true
        });

        return result || { variety_code, breeder_seed: 0 };
    }











}
module.exports = SrpWillingnessController
