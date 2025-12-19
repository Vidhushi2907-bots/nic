const monitoringTeamDetails = require("../controllers/monitoring_team_details.controller.js");

require('dotenv').config()

const auth = require('../_middleware/auth.js');
module.exports = app => {
    app.post(`${process.env.MICRO_SERVICE}/api/get-team-monotoring-team-all-data`,auth,monitoringTeamDetails.getTeamMonotoringTeamAllData);
    app.post(`${process.env.MICRO_SERVICE}/api/add-team-monotoring-team-all-data`,auth,monitoringTeamDetails.addTeamMonotoringTeamAllData);
    app.post(`${process.env.MICRO_SERVICE}/api/delete-team-monotoring-team-all-data`,auth,monitoringTeamDetails.deleteTeamMonotoringTeamAllData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-team-monotoring-team-year-data`,auth,monitoringTeamDetails.getTeamMonotoringTeamYearData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-team-monotoring-team-season-data`,auth,monitoringTeamDetails.getTeamMonotoringTeamSeasonData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-team-monotoring-team-crop-data`,auth,monitoringTeamDetails.getTeamMonotoringTeamCroplData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-team-monotoring-team-list-data`,auth,monitoringTeamDetails.getTeamMonotoringTeamListData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-team-monotoring-team-list-direct-data`,auth,monitoringTeamDetails.getTeamMonotoringTeamListDirectData);
    app.post(`${process.env.MICRO_SERVICE}/api/check-team-monotoring-team-user-data`,auth,monitoringTeamDetails.checkTeamMonotoringTeamUserData);
    app.post(`${process.env.MICRO_SERVICE}/api/check-team-monotoring-is-exits`,auth,monitoringTeamDetails.checkTeamMonotoringIsExits);
    app.post(`${process.env.MICRO_SERVICE}/api/check-team-monotoring-is-exits-direct`,auth,monitoringTeamDetails.checkTeamMonotoringIsExitsDirect);
    app.post(`${process.env.MICRO_SERVICE}/api/get-team-monotoring-team-all-data-direct`,auth,monitoringTeamDetails.getTeamMonotoringTeamAllDataDirect);
    app.post(`${process.env.MICRO_SERVICE}/api/check-auto-select`,auth,monitoringTeamDetails.checkAutoSelect);
};

