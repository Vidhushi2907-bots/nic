const inabilityReallocate = require("../controllers/inability_reallocate.controller.js");

require('dotenv').config()

const auth = require('../_middleware/auth.js');
module.exports = app => {
    app.post(`${process.env.MICRO_SERVICE}/api/get-harvesting-inatake-variety-inability`, auth, inabilityReallocate.getHarvestingIntakeVariety);
    app.post(`${process.env.MICRO_SERVICE}/api/get-inability-reallocated-data`,auth,  inabilityReallocate.getInabilityReallocatedData);
    app.post(`${process.env.MICRO_SERVICE}/api/modify-inability-reallocated-data`,auth,inabilityReallocate.modifyInabilityReallocatedData);
    app.get(`${process.env.MICRO_SERVICE}/api/delete-inability-reallocated-data/:id`,auth,inabilityReallocate.deleteInabilityReallocatedData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-all-willing-bspc-list-data`,inabilityReallocate.getAllWillingBspcListData);    
};

