const master = require("../controllers/master.controller.js");
const auth = require('../_middleware/auth');
// const apiValidation = require('../_middleware/api-validation');

// require('dotenv').config()

module.exports = app => {
    // app.post(`${process.env.MICRO_SERVICE}/api/web-login`, users.webLogin)

    // app.post(`${process.env.MICRO_SERVICE}/api/add-crop`, auth, users.addCrop)
    // app.get(`${process.env.MICRO_SERVICE}/api/get-crop-list`, auth, users.viewCrop)
    // app.post(`${process.env.MICRO_SERVICE}/api/get-crop-list`, auth, users.viewCrop)

    app.get(`${process.env.MICRO_SERVICE}/api/get-year-list`,auth, master.viewYear);
    app.post(`${process.env.MICRO_SERVICE}/api/add-year`,auth, master.createYear);
    app.patch(`${process.env.MICRO_SERVICE}/api/edit-year/:id`, auth,master.editYear);
    app.delete(`${process.env.MICRO_SERVICE}/api/delete-year/:id`,auth, master.deleteYear);
    app.get(`${process.env.MICRO_SERVICE}/api/get-one-year/:id`,auth, master.findOneYear);
    app.get(`${process.env.MICRO_SERVICE}/api/get-season-list`,auth, master.viewSeason)
};