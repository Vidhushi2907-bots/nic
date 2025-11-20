require('dotenv').config()
const response = require('../_helpers/response')
const status = require('../_helpers/status.conf')
const db = require("../models");
const paginateResponse = require("../_utility/generate-otp");
let Validator = require('validatorjs');
const masterHelper = require('../_helpers/masterhelper')
const JWT = require('jsonwebtoken')
const srpYearWise = db.srpYearModel;
const season = db.seasonModel;
require('dotenv').config()
const Token = db.tokens;

class MasterController {

    //view Year
    static viewYear = async (req, res) => {
        try {
            const data = await db.srpYearModel.findAll();

            if (data && data.length > 0) {
                response(res, status.DATA_AVAILABLE, 200, data);
            } else {
                response(res, status.DATA_NOT_AVAILABLE, 404, []);
            }

        } catch (error) {
            console.error('Error in cropVariety:', error);
            response(res, status.DATA_NOT_AVAILABLE, 500);
        }
    };
    
    //Update Year 
    static editYear = async (req, res) => {
        try {
            const { id } = req.params;
            const { year, year_range } = req.body;

            // Update record
            const [updatedCount] = await srpYearWise.update(
                { year, year_range },
                { where: { id } }
            );

            // If no rows updated
            if (updatedCount === 0) {
                return response(res, status.DATA_NOT_FOUND, 404, null);
            }

            // ✅ Fetch the updated record correctly
            const updatedData = await srpYearWise.findOne({ where: { id } });

            console.log(updatedData, 'updated record');

            if (updatedData) {
                response(res, status.DATA_UPDATED, 200, updatedData);
            }
        } catch (error) {
            console.error('Error in editYear:', error);
            response(res, status.DATA_NOT_SAVE, 500);
        }
    };

    //create year
    static createYear = async (req, res) => {
        try {
            const { year, year_range, is_active } = req.body;

            // Validation
            if (!year || !year_range) {
                return res.status(400).json({ message: 'year and year_range are required' });
            }

            // Prevent duplicate year
            // const existing = await SrpYearWise.findOne({ where: { year } });
            // if (existing) {
            //     return res.status(409).json({ message: 'Year already exists' });
            // }

            // Create entry
            const newYear = await srpYearWise.create({
                year,
                year_range,
                is_active: is_active !== undefined ? is_active : true,
            });

            response(res, status.DATA_AVAILABLE, 200, newYear);
        } catch (error) {
            console.error(error);
            response(res, status.DATA_NOT_AVAILABLE, 500);
        }
    };

    //find one year
    static findOneYear = async (req, res) => {
        try {
            const { id } = req.params; // you can find by ID from URL param

            const yearData = await srpYearWise.findOne({ where: { id } });

            if (!yearData) {
                return response(res, status.DATA_NOT_FOUND, 404, null);
            }

            response(res, status.DATA_AVAILABLE, 200, yearData);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error', error: error.message });
        }
    };

    //Delete Year by ID
    static deleteYear = async (req, res) => {
        try {
            const { id } = req.params;

            const yearData = await srpYearWise.findOne({ where: { id } });

            if (!yearData) {
                return response(res, status.DATA_NOT_FOUND, 404, null);
            }

            const data = await srpYearWise.destroy({ where: { id } });

            response(res, status.DATA_DELETED, 200, data);
        } catch (error) {
            console.error(error);
            response(res, status.DATA_NOT_AVAILABLE, 500);
        }
    };

    //findall season
    static viewSeason = async (req, res) => {
        try {
            const data = await db.seasonModel.findAll();

            if (data && data.length > 0) {
                response(res, status.DATA_AVAILABLE, 200, data);
            } else {
                response(res, status.DATA_NOT_AVAILABLE, 404, []);
            }

        } catch (error) {
            console.error('Error in cropVariety:', error);
            response(res, status.DATA_NOT_AVAILABLE, 500);
        }
    };

    //Update season 
    static editSeason = async (req, res) => {
        try {
            const { id } = req.params;
            const { season, season_code } = req.body;

            // Update record
            const [updatedCount] = await db.seasonModel.update(
                { season,season_code },
                { where: { id } }
            );

            // If no rows updated
            if (updatedCount === 0) {
                return response(res, status.DATA_NOT_FOUND, 404, null);
            }

            // ✅ Fetch the updated record correctly
            const updatedData = await db.seasonModel.findOne({ where: { id } });

            console.log(updatedData, 'updated record');

            if (updatedData) {
                response(res, status.DATA_UPDATED, 200, updatedData);
            }
        } catch (error) {
            console.error('Error in editYear:', error);
            response(res, status.DATA_NOT_SAVE, 500);
        }
    };

    //create season
    static createSeason = async (req, res) => {
        try {
            const { season, season_code, is_active } = req.body;

            // Validation
            if (!season || !season_code) {
                return response(res, status.DATA_NOT_FOUND, 404, null);
            }

            // Create entry
            const newYear = await db.seasonModel.create({
                season,
                season_code,
                is_active: is_active !== undefined ? is_active : true,
            });

            response(res, status.DATA_AVAILABLE, 200, newYear);
        } catch (error) {
            console.error(error);
            response(res, status.DATA_NOT_AVAILABLE, 500);
        }
    };

    //findone season
    static findOneSeason = async (req, res) => {
        try {
            const { id } = req.params; // you can find by ID from URL param

            const seasonData = await db.seasonModel.findOne({ where: { id } });

            if (!seasonData) {
                return response(res, status.DATA_NOT_FOUND, 404, null);
            }

            response(res, status.DATA_AVAILABLE, 200, yearData);
        } catch (error) {
            console.error(error);
            rresponse(res, status.DATA_NOT_AVAILABLE, 500,[]);
        }
    };

    //Delete Season by ID
    static deleteSeason = async (req, res) => {
        try {
            const { id } = req.params;

            const seasonData = await db.seasonModel.findOne({ where: { id } });

            if (!seasonData) {
               return response(res, status.DATA_NOT_FOUND, 404, null);
            }

            const data = await db.seasonModel.destroy({ where: { id } });

            response(res, status.DATA_DELETED, 200, data);
        } catch (error) {
            console.error(error);
            response(res, status.DATA_NOT_AVAILABLE, 500,[]);
        }
    };

}
module.exports = MasterController