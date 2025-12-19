const { Op, literal, Sequelize, NUMBER } = require("sequelize");
const db = require("../models");
const response = require('../_helpers/response')
const status = require('../_helpers/status.conf')
const userModel = db.userModel;
const srpCropWise = db.seedRollingPlanCropWisesModel;
const cropModel = db.cropModel
const agencyDetail = db.agencyDetailModel
const srpVarietyWise = db.srp_varietyModel
class SrpWillingnessController {



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

     
            const allYears = years.flatMap(item =>
                item.seed_rolling_plan_crop_wises.map(srp => srp.year)
            );

           
            const uniqueYears = [...new Set(allYears)];

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

            const willingnessData = await db.srpWillingnessModel.findAll({
                where: { year, season, crop_code },
                attributes: [
                    "id",
                    "variety_code",
                    "willingness",
                    "quantity",
                    "is_active",
                    "is_additional",
                    "is_final_submit", "is_draft",
                    "remarks",

                    [db.Sequelize.col("vw->m_crop_variety.variety_name"), "variety_name"]
                ],
                include: [
                    {
                        model: db.srpVarietyModel,
                        as: "vw",             // ✅ FIXED ALIAS
                        required: true,
                        attributes: [],
                        include: [
                            {
                                model: db.varietyModel,
                                as: "m_crop_variety",
                                required: true,
                                attributes: []
                            }
                        ]
                    }
                ],
                group: [
                    "seed_rolling_plan_willingnesses.id",
                    "seed_rolling_plan_willingnesses.variety_code",
                    "vw->m_crop_variety.variety_name",
                    "seed_rolling_plan_willingnesses.willingness",
                    "seed_rolling_plan_willingnesses.quantity",
                    "seed_rolling_plan_willingnesses.is_active",
                    "seed_rolling_plan_willingnesses.is_additional",
                    "seed_rolling_plan_willingnesses.remarks"
                ],
                raw: true
            });

            const breederSeedSum = await db.srpVarietyModel.findAll({

                include: [
                    {
                        model: db.srpCropModel,
                        as: "seed_rolling_plan_crop_wises",
                        where: { year, season, crop_code, is_active: true, is_final_submit: true },
                        required: true,
                        attributes: []
                    },],
                attributes: [
                    "variety_code",
                    [db.Sequelize.fn("SUM", db.Sequelize.col("breeder_seed")), "total_breeder_seed"]
                ],
                group: ["variety_code"],
                raw: true
            });

            const data = willingnessData.map(item => {
                const total = breederSeedSum.find(x => x.variety_code === item.variety_code);
                return { ...item, total_breeder_seed: total ? (total.total_breeder_seed).toFixed(2) : 0 };
            });

            const newVarietyWillingnessData = await db.srpWillingnessModel.findAll({
                where: { year, season, crop_code, is_additional: true, is_active: true },
                attributes: [
                    "id",
                    "variety_code",
                    "willingness",
                    "quantity",
                    "is_active",
                    "is_additional",
                    "remarks", "is_draft", "is_final_submit"
                ],
                include: [
                    {
                        model: db.varietyModel,
                        as: "m_crop_variety",
                        required: true,
                        attributes: ["variety_code", "variety_name"]
                    }
                ],
                raw: true
            });

            const replaceMap = {};
            const replaceVarietyWillingnessData = await db.srpWillingnessReplaceModel.findAll({
                where: { is_active: true },
                attributes: ["id", "srp_willingness_id", "replace_variety_code", "quantity",],
                include: [
                    {
                        model: db.varietyModel,
                        as: "m_crop_variety",
                        required: true,
                        attributes: ["variety_code", "variety_name"]
                    }
                ],
                raw: true
            });

            replaceVarietyWillingnessData.forEach(r => {
                if (!replaceMap[r.srp_willingness_id]) {
                    replaceMap[r.srp_willingness_id] = [];
                }

                replaceMap[r.srp_willingness_id].push({
                    id: r.id,
                    replace_variety_code: r.replace_variety_code,
                    quantity: r.quantity,
                    replace_variety_name: r["m_crop_variety.variety_name"]
                });
            });

            function finalData(wData, newData, replaceMap) {
                const normal = wData.map(item => ({
                    ...item,
                    replace_varieties: replaceMap[item.id] || []
                }));

                const additionals = newData.map(item => ({
                    id: item.id,
                    variety_code: item.variety_code,
                    willingness: item.willingness,
                    quantity: item.quantity,
                    is_active: item.is_active,
                    is_additional: item.is_additional,
                    is_draft: item.is_draft,
                    is_final_submit: item.is_final_submit,
                    remarks: item.remarks ?? null,
                    total_breeder_seed: 0,
                    variety_name: item["m_crop_variety.variety_name"],
                    replace_varieties: []
                }));

                return [...normal, ...additionals];
            }

            if (data.length > 0 || data.length > 0) {
                return response(
                    res,
                    "Data Available willingness",
                    200,
                    finalData(data, newVarietyWillingnessData, replaceMap)
                );
            }

            const varietyData = await db.srpVarietyModel.findAll({
                where: { is_active: true, is_final_submit: true },
                include: [
                    {
                        model: db.srpCropModel,
                        as: "seed_rolling_plan_crop_wises",
                        where: { year, season, crop_code, is_active: true, is_final_submit: true },
                        required: true,
                        attributes: []
                    },
                    {
                        model: db.varietyModel,
                        as: "m_crop_variety",
                        attributes: ["variety_name"],
                        required: true
                    }
                ],
                attributes: [
                    "variety_code",
                    [db.Sequelize.col("m_crop_variety.variety_name"), "variety_name"],
                    [
                        db.Sequelize.fn(
                            "ROUND",
                            db.Sequelize.cast(
                                db.Sequelize.fn("SUM", db.Sequelize.col("breeder_seed")),
                                "numeric"
                            ),
                            2
                        ),
                        "total_breeder_seed"
                    ]
                ],
                group: [
                    "seed_rolling_plan_variety_wises.variety_code",
                    "m_crop_variety.variety_name",
                    "m_crop_variety.id"
                ]
            });


            if (varietyData.length > 0) {
                return response(res, "Data Available", 200, varietyData);
            }

        } catch (error) {
            console.log(error);
            return response(res, "Server Error", 500, error);
        }
    };

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
            const { willingnessData, year, season, crop_code, action } = req.body;

            const user_id = req.body?.loginedUserid?.id;
            const userData = await db.userModel.findOne({ where: { id: user_id } });

            if (userData.user_type !== "BR") {
                return response(res, 'Not Access Other User', 403);
            }

            const isDraft = action === "draft" ? 1 : 1;
            const isFinalSubmit = action === "final" ? 1 : 0;
            const savedRecords = [];

            for (const crop of willingnessData) {

                const {
                    variety_code,
                    quantity,
                    is_additional,
                    willingness,
                    replace_varieties
                } = crop;

                const remarks =
                    is_additional ? (crop.remarks ?? null) : null;

                const existing = await db.srpWillingnessModel.findOne({
                    where: { year, season, crop_code, variety_code }
                });

                console.log("step:1........existing..................")
                if (!existing) {


                    if (willingness === true) {
                        console.log(willingness, "step:2")
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

                    // CASE NEW NO
                    else {
                        console.log("step:3......................existing")
                        const baseEntry = await db.srpWillingnessModel.create({
                            crop_code,
                            variety_code,
                            year,
                            season,
                            is_active: false,
                            quantity,                // ✔ NO always 0
                            is_additional,
                            remarks,
                            user_id,
                            willingness,
                            is_draft: isDraft,
                            is_final_submit: isFinalSubmit
                        });

                        savedRecords.push(baseEntry);
                        console.log(replace_varieties, "replace_varities.................")
                        // CREATE MULTIPLE REPLACEMENTS
                        if (Array.isArray(replace_varieties)) {
                            for (const item of replace_varieties) {
                                console.log("step:5......................existing")
                                const rep = await db.srpWillingnessReplaceModel.create({
                                    srp_willingness_id: baseEntry.id,
                                    replace_variety_code: item.replace_variety_code,
                                    quantity: item.quantity,
                                    is_active: true
                                });
                                savedRecords.push(rep);
                            }
                            console.log("step:......................existing")
                        }
                    }

                    continue;
                }

                // -------------------------------------------------------
                // 2️⃣ EXISTING RECORD CASES
                // -------------------------------------------------------
                else {

                    if (willingness === true) {

                        await existing.update({
                            is_active: true,
                            quantity,
                            is_additional: existing.remarks ? true : false, // <-- check remarks
                            remarks: existing.remarks ?? null,        // YES → always null
                            willingness: true,
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

                    // -----------------------------
                    // CASE: YES → NO
                    // -----------------------------
                    else {

                        await existing.update({
                            is_active: false,
                            quantity: 0,            // NO → always 0
                            is_additional,
                            remarks,
                            willingness: false,
                            is_draft: isDraft,
                            is_final_submit: isFinalSubmit
                        });

                        savedRecords.push(existing);

                        // deactivate all old replace varieties
                        await db.srpWillingnessReplaceModel.update(
                            { is_active: false },
                            { where: { srp_willingness_id: existing.id, is_active: true } }
                        );

                        // Insert new replace varieties (multiple)
                        if (Array.isArray(replace_varieties) && replace_varieties.length > 0) {

                            for (const item of replace_varieties) {

                                // check existing (optional)
                                const existingReplace = await db.srpWillingnessReplaceModel.findOne({
                                    where: {
                                        srp_willingness_id: existing.id,
                                        replace_variety_code: item.replace_variety_code
                                    }
                                });

                                // Update existing replace row
                                if (existingReplace) {
                                    await existingReplace.update({
                                        quantity: item.quantity ?? 0,
                                        is_active: true
                                    });

                                    savedRecords.push(existingReplace);
                                }
                                // Create new replace row
                                else {
                                    const newReplace = await db.srpWillingnessReplaceModel.create({
                                        srp_willingness_id: existing.id,
                                        replace_variety_code: item.replace_variety_code,
                                        quantity: item.quantity ?? 0,
                                        is_active: true
                                    });

                                    savedRecords.push(newReplace);
                                }
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

    static getSrpWillingnessDetails = async (req, res) => {
        const { year, season, crop_code } = req.query;
        const varietyData = await db.srpVarietyModel.findAll({
            where: {
                is_active: true,
                is_final_submit: true
            },
            include: [
                {
                    model: db.srpCropModel,
                    as: "seed_rolling_plan_crop_wises",
                    where: { year, season, crop_code, is_active: true, is_final_submit: true },
                    required: true,
                    attributes: []
                },
                {
                    model: db.varietyModel,
                    as: "m_crop_variety",
                    attributes: ["variety_name"],
                    required: true
                }
            ],
            attributes: [
                "variety_code",
                [db.Sequelize.col("m_crop_variety.variety_name"), "variety_name"],
                [db.Sequelize.fn("SUM", db.Sequelize.col("breeder_seed")), "total_breeder_seed"]
            ],
            group: [
                "seed_rolling_plan_variety_wises.variety_code",
                "m_crop_variety.variety_name", "m_crop_variety.id"
            ]
        });
        if (varietyData.length > 0) { return response(res, "Data Available", 200, varietyData); }
    }

    static deleteSrpWillingnessRepalce = async (req, res) => {
        try {
            const { id } = req.query;

            // Check if exists
            const data = await db.srpWillingnessReplaceModel.findOne({
                where: { id }
            });

            if (!data) {
                return response(res, "Not Found", 404, []);
            }

            // Update is_active
            const updateData = await db.srpWillingnessReplaceModel.update(
                { is_active: false },     // values to update
                { where: { id } }         // condition
            );

            return response(res, "Data Deleted Successfully!", 200, updateData);

        } catch (error) {
            console.log(error);
            return response(res, "Something went wrong", 500, []);
        }
    }

    static deleteSrpWillingness = async (req, res) => {
        try {
            const { id } = req.query;

            // Check if exists
            const data = await db.srpWillingnessModel.findOne({
                where: { id }
            });

            if (!data) {
                return response(res, "Not Found", 404, []);
            }

            // Update is_active
            const updateData = await db.srpWillingnessModel.update(
                { is_active: false },     // values to update
                { where: { id, is_additional: true } }         // condition
            );
            if (updateData[0] === 0) {
                return response(res, "Already Inactive or is_additional = false", 400, []);
            }

            return response(res, "Data Deleted Successfully!", 200, updateData);

        } catch (error) {
            console.log(error);
            return response(res, "Something went wrong", 500, []);
        }
    }

}
module.exports = SrpWillingnessController
