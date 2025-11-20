const { Op, literal,Sequelize } = require("sequelize");
const db = require("../models");

const userModel = db.userModel;
const srpCropWise = db.seedRollingPlanCropWisesModel;
const cropModel = db.cropModel
const agencyDetail = db.agencyDetailModel
class SrpWillingnessController {


static postSrpCropWiseData = async (req, res) => {
    try {
        const userId = req.body.id;

        // 1️⃣ Fetch user + cropCodes from agency_detail JSON
        const user = await userModel.findOne({
            where: { id: userId, user_type: "BR" },
            include: [
                { model: agencyDetail, as: "agency_detail", attributes: [] }
            ],
            attributes: [
                "id",
                "name",
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
            return res.status(404).json({ status: false, message: "User not found" });
        }

        const cropCodes = user.cropCodes || [];

        // 2️⃣ Fetch only those crops which have SRP filled (INNER JOIN)
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
                        is_final_submit: true
                    },
                    attributes: [
                        "id",
                        "year",
                        "season",
                        "group_code",
                        "crop_code",
                        "total_area",
                        "total_required",
                        "is_active",
                        "srr",
                        "seed_rate",
                        "is_draft",
                        "is_final_submit",
                        ["created_at", "createdAt"],
                        ["updated_at", "updatedAt"]
                    ]
                }
            ],

            attributes: ["id", "crop_name", "crop_code"]
        });

        return res.status(200).json({ status: true, data: crops });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: "Server Error",
            error
        });
    }
};




}
module.exports = SrpWillingnessController
