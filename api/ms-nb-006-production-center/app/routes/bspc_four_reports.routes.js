const seeders = require("../controllers/seeder.controller.js");
const bspcFourReports = require("../controllers/bspc_four_reports.controller.js");

const apiValidation = require('../_middleware/api-validation.js');
require('dotenv').config()

const auth = require('../_middleware/auth');
module.exports = app => {
    app.post(`${process.env.MICRO_SERVICE}/api/get-data-of-bsp-four`, auth, bspcFourReports.getDataOfBspFourOptimize);
    // app.post(`${process.env.MICRO_SERVICE}/api/get-data-of-bsp-four`, auth, bspcFourReports.getDataOfBspFourOld);
};

