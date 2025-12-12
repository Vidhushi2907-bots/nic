const { Op, literal, Sequelize, Model, NOW } = require("sequelize");
const db = require("../models");
const response = require('../_helpers/response')
const status = require('../_helpers/status.conf')
const userModel = db.userModel;
const srpCropWise = db.seedRollingPlanCropWisesModel;
const cropModel = db.cropModel
const agencyDetail = db.agencyDetailModel



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
                attributes: ["id", "crop_code"],

            });

            const formattedData = data.map(item => {
                return {
                    id: item.id,
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

    static postSrpStateReplanningVarietyData = async (req, res) => {
        try {
            const { replanningData, action } = req.body;
            const isDraft = action === "draft";
            const isFinalSubmit = action === "final";

            if (!Array.isArray(replanningData) || replanningData.length === 0) {
                return response(res, "Replanning data is required", 400, []);
            }

            const savedRecords = [];

            for (const replanData of replanningData) {
                const {
                    srp_crop_wise_id,
                    srp_variety_wise_id,
                    is_available,
                    quantity,
                    replace_varieties = [],
                    new_variety_code,
                    quantity_required,
                    quantity_available,
                    is_accept,
                } = replanData;
                console.log(replanData, "replanData")
                // 1️⃣ Validate Crop
                const srpCropData = await db.srpCropModel.findOne({
                    where: { id: srp_crop_wise_id }
                });
                if (!srpCropData) return response(res, "Crop not found", 404, []);

                let replanningEntry;

                if (srp_variety_wise_id) {
                    // 2️⃣ Validate Variety
                    const srpVarietyData = await db.srpVarietyModel.findOne({
                        where: { srp_crop_wise_id, id: srp_variety_wise_id }
                    });
                    if (!srpVarietyData) return response(res, "Variety not found", 404, []);

                    // 3️⃣ Create/Update Master Replanning
                    replanningEntry = await db.srpStateReplanningModel.findOne({
                        where: { srp_crop_wise_id, srp_variety_wise_id }
                    });

                    if (replanningEntry) {
                        await replanningEntry.update({
                            quantity,
                            is_draft: isDraft,
                            is_final_submit: isFinalSubmit,
                            updatedAt: new Date()
                        });
                    } else {
                        replanningEntry = await db.srpStateReplanningModel.create({
                            srp_crop_wise_id,
                            srp_variety_wise_id,
                            is_available,
                            quantity,
                            is_draft: isDraft,
                            is_final_submit: isFinalSubmit
                        });
                    }

                    savedRecords.push(replanningEntry);

                    // 4️⃣ Handle Replace Varieties
                    if (is_available === false && Array.isArray(replace_varieties)) {
                        for (const item of replace_varieties) {
                            const { replace_variety_code, replace_quantity, is_accept: replace_is_accept } = item;
                            if (!replace_variety_code) continue;

                            const existingReplace = await db.srpStateReplanningReplaceVaritiesModel.findOne({
                                where: { srp_replanning_id: replanningEntry.id, replace_variety_code }
                            });

                            if (existingReplace) {
                                await existingReplace.update({
                                    replace_quantity,
                                    is_accept: replace_is_accept,
                                    is_draft: isDraft,
                                    is_final_submit: isFinalSubmit, updatedAt: new Date()
                                });
                            } else {
                                await db.srpStateReplanningReplaceVaritiesModel.create({
                                    srp_replanning_id: replanningEntry.id,
                                    replace_variety_code,
                                    replace_quantity,
                                    is_accept: replace_is_accept,
                                    is_draft: isDraft,
                                    is_final_submit: isFinalSubmit
                                });
                            }
                        }
                    }
                }

                // 5️⃣ Handle New Variety (Optional)

                if (new_variety_code) {
                    let isCheckExistingNewVariety;

                    isCheckExistingNewVariety = await db.srpStateReplanningNewVarietiesModel.findOne({
                        where: {
                            srp_crop_wise_id,
                            new_variety_code,
                        }
                    })

                    if (!isCheckExistingNewVariety) {
                        isCheckExistingNewVariety = await db.srpStateReplanningNewVarietiesModel.create({
                            srp_crop_wise_id,
                            new_variety_code,
                            quantity_required,
                            quantity_available,   // must match model
                            is_accept,
                            is_draft: isDraft,
                            is_final_submit: isFinalSubmit
                        });

                    }
                    else {
                        isCheckExistingNewVariety.update({
                            quantity_required,   // must match model
                            is_accept,
                            is_draft: isDraft,
                            is_final_submit: isFinalSubmit,
                            updatedAt: new Date()
                        });
                    }

                    savedRecords.push(isCheckExistingNewVariety);
                }
            }

            return response(res, "Replanning saved successfully", 200, savedRecords);
        } catch (error) {
            console.error(error);
            return response(res, "Something went wrong!", 500, []);
        }

    };

    static getSrpStateReplanningVareityData = async (req, res) => {
        const { year, season, crop_code } = req.query;
        const userId = req.body?.loginedUserid?.id;

        const user = await userModel.findOne({
            where: { id: userId, user_type: "IN" },
        });

        if (!user) {
            return response(res, status.DATA_NOT_AVAILABLE, 404, []);
        }

        // 1️⃣ Fetch the crop data
        const crop_data = await db.srpCropModel.findOne({
            where: { year: year, season: season, crop_code: crop_code, user_id: userId }
        });
        if (!crop_data) {
            return response(res, "Crop data not found", 404);
        }
        const replanningExists = await db.srpStateReplanningModel.findOne({
            where: { srp_crop_wise_id: crop_data.id }
        })

        if (replanningExists) {
            // 🔵 CASE 2: Replanning Already Saved
            const result = await getReplanningData(crop_data.id);
            return response(res, "Replanning Data Available", 200, result);
        } else {
            // 🟢 CASE 1: Fresh Load (No replanning yet)
            const result = await getFreshData(crop_data.id, year, season, crop_code);
            return response(res, "Fresh Data Available", 200, result);
        }
    }
}

async function getReplanningData(crop_wise_id) {


    const variety_data = await db.srpVarietyModel.findAll({
        where: { srp_crop_wise_id: crop_wise_id },

        include: [
            {
                model: db.varietyModel,
                required: true,
                attributes: ["id", "variety_code", "variety_name"]
            }
        ],
        attributes: ["id", "breeder_seed", "variety_code"],
    });

    const variety_ids = variety_data.map(v => v.id);

    const srp_variety_data = await db.srpStateReplanningModel.findAll({
        where: {
            srp_crop_wise_id: crop_wise_id,
            srp_variety_wise_id: { [Op.in]: variety_ids }
        },
        include: [
            {
                model: db.srpVarietyModel,
                attributes: ["variety_code", "breeder_seed"],
                include: [
                    {
                        model: db.varietyModel,
                        attributes: ["variety_name"]
                    }
                ]
            }
        ],
        attributes: ["id", "srp_crop_wise_id", "srp_variety_wise_id", "is_available", "quantity"]
    });

    const replanning_ids = srp_variety_data.map(v => v.id);

    const replace_varieties = await db.srpStateReplanningReplaceVaritiesModel.findAll({
        where: { srp_replanning_id: { [Op.in]: replanning_ids } },
        include: [{
            model: db.varietyModel,
            required: true,
            attributes: ["variety_name", "variety_code"]
        }],
        attributes: ["srp_replanning_id", "replace_variety_code", "replace_quantity", "is_accept"]
    });

    const formattedVarieties = srp_variety_data.map(item => {

        const v = item.seed_rolling_plan_variety_wise; // included alias
        const children = replace_varieties.filter(r => r.srp_replanning_id === item.id);
        children.forEach(c => {
            console.log(c.m_crop_variety.variety_name);
        });
        return {
            id: item.id,
            srp_crop_wise_id: item.srp_crop_wise_id,
            srp_variety_wise_id: item.srp_variety_wise_id,
            variety_code: v?.variety_code || null,
            variety_name: v?.m_crop_variety?.variety_name || null,
            willingness: item.is_available,
            target_breeder_seed: v.breeder_seed,
            tentative_quantity: item.quantity,
            replace_varieties: children.map(c => ({
                srp_replanning_id: item.id,
                replace_variety_code: c.replace_variety_code,

                // ✅ Correct key
                replace_variety_name: c.m_crop_variety?.variety_name || null,

                replace_quantity: c.replace_quantity,
                replace_is_accept: c.is_accept
            }))
        };
    });

    // 6️⃣ Fetch new varieties in one go
    const new_variety_data = await db.srpStateReplanningNewVarietiesModel.findAll({
        where: { srp_crop_wise_id: crop_wise_id },
        include: [
            {
                model: db.varietyModel,
                required: true,
                attributes: ["variety_name", "variety_code"]
            }
        ],
        attributes: ["id", "quantity_available", "quantity_required", "is_accept", "srp_crop_wise_id"]
    });

    // 7️⃣ Combine both normal and new varieties in a single array
    const combinedData = [
        ...formattedVarieties,
        ...new_variety_data.map(v => ({
            id: v.id,
            new_variety_code: v.m_crop_variety?.variety_code,
            new_variety_name: v.m_crop_variety?.variety_name,
            new_quantity_available: v.quantity_available,
            new_quantity_required: v.quantity_required,
            new_is_accept: v.is_accept,
            srp_crop_wise_id: v.srp_crop_wise_id
        }))
    ];
    return combinedData;

}
async function getFreshData(crop_wise_id, year, season, crop_code) {
    const varietyData = await db.srpVarietyModel.findAll({
        where: { srp_crop_wise_id: crop_wise_id },
        attributes: ["id", "variety_code", "breeder_seed", "srp_crop_wise_id"],
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

    const sum_of_breeder_seed_data = await db.sequelize.query(sqlQuery, {
        replacements: { year, season, crop_code },
        type: db.Sequelize.QueryTypes.SELECT
    });
    // Format Data
    const formattedData = varietyData.map(v => {
        const vwData = Array.isArray(v.vw) && v.vw.length > 0 ? v.vw[0] : null; //willingness data
        // Get sum from SQL query
        const sumMatch = sum_of_breeder_seed_data.find(f => f.variety_code === v.variety_code);//variety code match karne ke liya
        const sum_breeder_seed = sumMatch ? parseFloat(sumMatch.sum) : null;
        return {
            id: v.id,
            variety_code: v.variety_code,
            target_breeder_seed: v.breeder_seed,
            srp_crop_wise_id: v.srp_crop_wise_id,
            variety_name: v.m_crop_variety?.variety_name || v.m_crop_variety?.variet, // use correct field
            sum_breeder_seed,
            tentative_quantity: (vwData && sum_breeder_seed)
                ? Number(((v.breeder_seed / sum_breeder_seed) * vwData.quantity).toFixed(2))
                : null,
            willingness: vwData ? vwData.willingness : null,
            quantity: vwData ? vwData.quantity : null,
            remarks: vwData ? vwData.remarks : null,
            is_additional: vwData ? vwData.is_additional : null,

           replace_varieties: vwData
                ? vwData.seed_rolling_plan_willingness_replaces?.map(r => {
                    const variety = r.m_crop_variety?.get?.({ plain: true }) || null;
                    console.log(variety.variet, "variety.variety_name ")
                    return {
                        replace_id: r.id,
                        replace_variety_code: r.replace_variety_code,
                        replace_quantity: r.quantity,
                        replace_variety_name: variety ? variety.variet : null,
                        replace_tentative_quantity: (vwData && sum_breeder_seed)
                            ? Number(((v.breeder_seed / sum_breeder_seed) * r.quantity).toFixed(2))
                            : null,
                    };
                }) || []
                : []
        };

    });
    return formattedData;
}
module.exports = SrpWillingnessController
