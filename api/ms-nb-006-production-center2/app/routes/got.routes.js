const got = require("../controllers/got.controller.js");
const users = require("../controllers/user.controller.js");
const indentor = require("../controllers/indentor.controller.js");
const processedSeed = require("../controllers/processed_seed.controller.js");
const apiValidation = require('../_middleware/api-validation.js');

require('dotenv').config()

const auth = require('../_middleware/auth');
module.exports = app => {
    app.post(`${process.env.MICRO_SERVICE}/api/get-got-sample-reception-year`, auth, got.getGotSampleReceptionYear);
    app.post(`${process.env.MICRO_SERVICE}/api/get-got-sample-reception-season`, auth, got.getGotSampleReceptionSeason);
    app.post(`${process.env.MICRO_SERVICE}/api/get-got-sample-reception-crop`, auth, got.getGotSampleReceptionCrop);
    app.post(`${process.env.MICRO_SERVICE}/api/get-got-sample-reception-consignment`, auth, got.getGotSampleReceptionConsignment);
    app.post(`${process.env.MICRO_SERVICE}/api/get-got-sample-reception-list`, auth, got.getGotSampleReceptionList);
    app.post(`${process.env.MICRO_SERVICE}/api/get-got-sample-reception-reason`, auth, got.getGotSampleReceptionReason);
    app.post(`${process.env.MICRO_SERVICE}/api/got-sample-reception-update-status`, auth, got.gotSampleReceptionUpdateStatus);
    app.post(`${process.env.MICRO_SERVICE}/api/got-sowing-details-test-number`, auth, got.getGotSowingDetailsTestNumber);
    app.post(`${process.env.MICRO_SERVICE}/api/got-sowing-details-test-number-details`, auth, got.getGotSowingDetailsTestNumberDetails);
    app.post(`${process.env.MICRO_SERVICE}/api/save-got-showing-details`, auth, got.saveGotShowingDetails);
    app.post(`${process.env.MICRO_SERVICE}/api/get-got-showing-details-list`, auth, got.getGotShowingDetailsList);
    app.post(`${process.env.MICRO_SERVICE}/api/delete-got-showing-detail`, auth, got.deleteGotShowingDetail);
    app.post(`${process.env.MICRO_SERVICE}/api/update-got-showing-details`, auth, got.updateGotShowingDetails);
    app.post(`${process.env.MICRO_SERVICE}/api/get-got-monitoring-team-year`, auth, got.getMonitoringTeamYear);
    app.post(`${process.env.MICRO_SERVICE}/api/get-got-monitoring-team-season`, auth, got.getMonitoringTeamSeason);
    app.post(`${process.env.MICRO_SERVICE}/api/get-got-monitoring-team-crop`, auth, got.getMonitoringTeamCrop);
    app.post(`${process.env.MICRO_SERVICE}/api/get-got-monitoring-team-name`, auth, got.getMonitoringTeamName);
    app.post(`${process.env.MICRO_SERVICE}/api/get-got-monitoring-team-designation`, auth, got.getMonitoringTeamDesignation);
    app.post(`${process.env.MICRO_SERVICE}/api/save-monitoring-team`, auth, got.saveMonitoringTeam);
    app.post(`${process.env.MICRO_SERVICE}/api/get-monitoring-team-list`, auth, got.getMonitoringTeamList);
    app.post(`${process.env.MICRO_SERVICE}/api/update-monitoring-team`, auth, got.updateMonitoringTeam);
    app.post(`${process.env.MICRO_SERVICE}/api/delete-monitoring-team`, auth, got.deleteMonitoringTeam);
    app.post(`${process.env.MICRO_SERVICE}/api/get-got-monitoring-team-test-number`, auth, got.getGotMonitoringTeamTestNumber);
};

