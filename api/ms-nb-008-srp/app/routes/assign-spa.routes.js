// const users = require("../controllers/user.controller.js");
const spaRoutes = require("../controllers/assign-spa.controller");
const auth = require('../_middleware/auth');
// const apiValidation = require('../_middleware/api-validation');

// require('dotenv').config()

module.exports = app => {
    app.post(`${process.env.MICRO_SERVICE}/api/get-variety`,auth, spaRoutes.getSrpVarietyAssignBySpa);
    app.post(`${process.env.MICRO_SERVICE}/api/get-state`,auth, spaRoutes.getSrpSpaStateId);
    app.post(`${process.env.MICRO_SERVICE}/api/add-spa-details`,auth,spaRoutes.postSrpSpaData)
};
