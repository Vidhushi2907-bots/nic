const srpStateReplanning = require("../controllers/srp_state_replanning.controller");
const auth = require('../_middleware/auth');
// const apiValidation = require('../_middleware/api-validation');

// require('dotenv').config()

module.exports = app => {
    // app.post(`${process.env.MICRO_SERVICE}/api/web-login`, users.webLogin)

    // app.post(`${process.env.MICRO_SERVICE}/api/add-crop`, auth, users.addCrop)
    // app.get(`${process.env.MICRO_SERVICE}/api/get-crop-list`, auth, users.viewCrop)
    // app.post(`${process.env.MICRO_SERVICE}/api/get-crop-list`, auth, users.viewCrop)


    app.post(`${process.env.MICRO_SERVICE}/api/srp-state-replanning-year`, auth, srpStateReplanning.getSrpStateReplanningYearData);
     app.post(`${process.env.MICRO_SERVICE}/api/srp-state-replanning-season`, auth, srpStateReplanning.getSrpStateReplanningSeasonData);
      app.post(`${process.env.MICRO_SERVICE}/api/srp-state-replanning-crop`, auth, srpStateReplanning.getSrpStateReplanningCropData);
    
 app.post(`${process.env.MICRO_SERVICE}/api/srp-state-replanning-variety`, auth, srpStateReplanning.getSrpStateReplanningVareityData);
};
