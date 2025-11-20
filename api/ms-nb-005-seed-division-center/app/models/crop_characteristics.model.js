module.exports = (sql, Sequelize) => {

    const cropCharacteristics = sql.define('m_variety_characteristics', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },

        adoptation: {
            type: Sequelize.STRING
        },
        agronomic_features: {
            type: Sequelize.STRING
        },
        average_yeild_from: {
            type: Sequelize.INTEGER
        },
        average_yeild_to: {
            type: Sequelize.INTEGER
        },
        notification_date: {
            type: Sequelize.STRING
        },
        variety_code: {
            type: Sequelize.STRING
        },
        year_of_introduction_market: {
            type: Sequelize.STRING
        },
        // notification_number: {
        //     type: Sequelize.STRING
        // },
        // meeting_number: {
        //     type: Sequelize.STRING
        // },
        crop_code: {
            type: Sequelize.STRING
        },
        crop_group_id: {
            type: Sequelize.INTEGER
        },
        fertilizer_dosage: {
            type: Sequelize.STRING
        },
        generic_morphological: {
            type: Sequelize.STRING
        },
        crop_group: {
            type: Sequelize.STRING
        },
        iet_number: {
            type: Sequelize.STRING
        },
        year_of_release: {
            type: Sequelize.STRING
        },
        image_url: {
            type: Sequelize.STRING
        },
        responsible_insitution_for_breeder_seed: {
            type: Sequelize.STRING
        },
        intitution_id: {
            type: Sequelize.INTEGER
        },
        matuarity_day_from: {
            type: Sequelize.INTEGER
        },
        matuarity_day_to: {
            type: Sequelize.INTEGER
        },
        matuarity_type_id: {
            type: Sequelize.INTEGER
        },
        percentage: {
            type: Sequelize.INTEGER
        },
        select_state_release: {
            type: Sequelize.INTEGER
        },
        reaction_abiotic_stress: {
            type: Sequelize.STRING
        },
        reaction_major_diseases: {
            type: Sequelize.STRING
        },
        reaction_to_pets: {
            type: Sequelize.STRING
        },
        crop_name: {
            type: Sequelize.STRING
        },
        recommended_state: {
            type: Sequelize.STRING
        },
        resemblance_to_variety: {
            type: Sequelize.STRING
        },
        seed_rate: {
            type: Sequelize.STRING
        },
        spacing_from: {
            type: Sequelize.INTEGER
        },
        spacing_to: {
            type: Sequelize.INTEGER
        },
        specific_morphological: {
            type: Sequelize.STRING
        },
        state_id: {
            type: Sequelize.INTEGER
        },
        user_id: {
            type: Sequelize.INTEGER
        },
        variety_id: {
            type: Sequelize.INTEGER
        },
        spacing_date: {
            type: Sequelize.STRING
        },
        variety_name: {
            type: Sequelize.STRING
        },
        maturity_date: {
            type: Sequelize.STRING
        },
        average_total: {
            type: Sequelize.STRING
        },
        nitrogen: {
            type: Sequelize.STRING,
        },
        phosphorus: {
            type: Sequelize.STRING,
        },
        potash: {
            type: Sequelize.STRING,
        },
        other: {
            type: Sequelize.STRING,
        },
        fertilizer_other_name: {
            type: Sequelize.STRING,
        },
        fertilizer_other_value: {
            type: Sequelize.STRING,
        },
        eology: {
            type: Sequelize.STRING,
        },
        maturity: {
            type: Sequelize.STRING,
        },
        state_data: {
            type: Sequelize.JSON,
        },
        // type:{
        //     type: Sequelize.STRING,
        // },
        // developed_by:{
        //     type: Sequelize.STRING,
        // },
        state_of_release: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        region_data: {
            type: Sequelize.JSON,
        },
        product_quality_attributes: {
            type: Sequelize.STRING,
        },
        climate_resilience: {
            type: Sequelize.STRING,
        },
        gi_tagged_reg_no: {
            type: Sequelize.STRING,
        },
        ip_protected_reg_no: {
            type: Sequelize.STRING,
        },
        is_active: {
            type: Sequelize.INTEGER,
            defaultValue: 1
        },
        reaction_to_pets_json: {
            type: Sequelize.JSON,
        },
        reaction_major_diseases_json: {
            type: Sequelize.JSON,
        },
        created_at: {
            type: Sequelize.DATE,
            default: Date.now()
        },
        updated_at: {
            type: Sequelize.DATE,
            default: Date.now()
        },
        // notification_year:{
        //     type: Sequelize.INTEGER,
        // },
        climate_resilience_json: {
            type: Sequelize.JSON,
        },
        developed_by: {
            type: Sequelize.STRING,
        },
        createdAt: { type: Sequelize.DATE, field: 'created_at' },
        updatedAt: { type: Sequelize.DATE, field: 'updated_at' },

    },


        {
            timestamps: false,
            // timezone: '+5:30'
        })


    return cropCharacteristics
}
