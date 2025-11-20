const users = require("../controllers/user.controller.js");
const auth = require('../_middleware/auth');

require('dotenv').config()

module.exports = app => {
    app.post(`${process.env.MICRO_SERVICE}/api/add-state`, auth,  users.addState)
    app.get(`${process.env.MICRO_SERVICE}/api/get-state-list`,  auth,users.viewState)
    app.post(`${process.env.MICRO_SERVICE}/api/get-all-states`, auth,  users.getAllState)
    app.post(`${process.env.MICRO_SERVICE}/api/edit-state`, auth,  users.editState)
    app.post(`${process.env.MICRO_SERVICE}/api/delete-state`, auth,  users.deleteState)
    app.get(`${process.env.MICRO_SERVICE}/api/test`,  users.test)
    app.post(`${process.env.MICRO_SERVICE}/api/add-district`, auth,  users.addDistrict)
    app.post(`${process.env.MICRO_SERVICE}/api/get-district-list`, auth,  users.viewDistrict)
    app.post(`${process.env.MICRO_SERVICE}/api/edit-district`, auth,  users.editDistrict)
    app.post(`${process.env.MICRO_SERVICE}/api/delete-district`, auth,  users.deleteDistrict)
    // app.post(`${process.env.MICRO_SERVICE}/api/add-crop`, auth, users.addCrop)
    app.get(`${process.env.MICRO_SERVICE}/api/get-crop-list1`, auth,  users.viewCrop1)
    app.get(`${process.env.MICRO_SERVICE}/api/get-crop-list`, auth, users.viewCrop)
    app.get(`${process.env.MICRO_SERVICE}/api/get-crop1`, auth,  users.getCrop)
    app.post(`${process.env.MICRO_SERVICE}/api/get-crop1`, auth,  users.getCrop)
    app.post(`${process.env.MICRO_SERVICE}/api/edit-crop`, auth,  users.editCrop)
    app.post(`${process.env.MICRO_SERVICE}/api/delete-crop`, auth,  users.deleteCrop)
    app.post(`${process.env.MICRO_SERVICE}/api/add-user`, auth,  users.addUser)
    app.get(`${process.env.MICRO_SERVICE}/api/get-user-list`, auth,  users.viewUser)
    app.post(`${process.env.MICRO_SERVICE}/api/edit-user`, auth,  users.editUser)
    app.post(`${process.env.MICRO_SERVICE}/api/delete-user`, auth,  users.deleteUser);
    app.post(`${process.env.MICRO_SERVICE}/api/add-crop`, auth,  users.addCrop);
    app.post(`${process.env.MICRO_SERVICE}/api/update-crop`, auth,  users.editupdateCrop);

    app.post(`${process.env.MICRO_SERVICE}/api/crop-group`, users.viewCropGroup);
    app.get(`${process.env.MICRO_SERVICE}/api/get-distinct-crop`, auth,  users.distinctCrop);
    app.post(`${process.env.MICRO_SERVICE}/api/get-crop-name`, auth,  users.cropName);
    app.post(`${process.env.MICRO_SERVICE}/api/get-crop-indenting-data`,  users.cropIndentingdata);

    // 
    app.post(`${process.env.MICRO_SERVICE}/api/get-crop-code`, auth,  users.cropCode);
    app.post(`${process.env.MICRO_SERVICE}/api/add-crop-characterstics`, auth,  users.addCropCharacterstics);
    app.post(`${process.env.MICRO_SERVICE}/api/add-crop-list`, auth,  users.getAddCropList);
    app.post(`${process.env.MICRO_SERVICE}/api/add-crop-characterstics-list`, auth,  users.getAddCropChararactersticsList);
    app.post(`${process.env.MICRO_SERVICE}/api/delete-list`, auth,  users.deletelist);


    //shubham
    app.post(`${process.env.MICRO_SERVICE}/api/get-crop-list`,auth, users.viewCrop) 
    app.post(`${process.env.MICRO_SERVICE}/api/get-crop-list`,auth, users.viewCrop) 
    app.post(`${process.env.MICRO_SERVICE}/api/get-crop-group`, auth,  users.getCropGroup);
    // app.post(`${process.env.MICRO_SERVICE}/api/add-crop-veriety-submission`, auth,  users.addCropVerietySubmission);
    app.post(`${process.env.MICRO_SERVICE}/api/add-crop-veriety-submission`, auth,  users.addCropVerietySubmissionSachin);
    app.post(`${process.env.MICRO_SERVICE}/api/update-crop-veriety-submission`, auth,  users.updateCropVerietySubmission);
    app.post(`${process.env.MICRO_SERVICE}/api/get-variety-list`, auth,  users.getVarietyList);


    app.post(`${process.env.MICRO_SERVICE}/api/get-crop-veriety-data`, auth,  users.getCropVerietyData)
    app.post(`${process.env.MICRO_SERVICE}/api/get-crop-veriety-data-with-dynamic-filed`, auth, users.getCropVerietyDataWithDynamicField)
    app.post(`${process.env.MICRO_SERVICE}/api/get-crop-veriety-list`,auth,  users.getCropVerietyList)
    app.post(`${process.env.MICRO_SERVICE}/api/get-crop-veriety-code-list`,auth,  users.getCropVerietyCodeList)

    app.post(`${process.env.MICRO_SERVICE}/api/delete-nget-crop-veriety-data/:id`, auth,  users.deleteCropVerietyId);



    app.post(`${process.env.MICRO_SERVICE}/api/edit-crop`, auth,  users.editCrop)
    app.post(`${process.env.MICRO_SERVICE}/api/delete-crop`, auth,  users.deleteCrop)
    app.post(`${process.env.MICRO_SERVICE}/api/add-user`, auth,  users.addUser)
    app.post(`${process.env.MICRO_SERVICE}/api/get-user-list`, auth,  users.viewUser)
    app.post(`${process.env.MICRO_SERVICE}/api/edit-user`, auth,  users.editUser)
    app.post(`${process.env.MICRO_SERVICE}/api/delete-user`, auth,  users.deleteUser);
    app.post(`${process.env.MICRO_SERVICE}/api/add-crop`, auth,  users.addCrop);
    app.post(`${process.env.MICRO_SERVICE}/api/update-crop`, auth,  users.editupdateCrop);
    app.post(`${process.env.MICRO_SERVICE}/api/crop-name`, auth,  users.viewCropName);
    // app.post(`${process.env.MICRO_SERVICE}/api/crop-group`, auth, users.viewCropGroup);
    app.post(`${process.env.MICRO_SERVICE}/api/add-crop-characterstics`, auth,  users.addCropCharacterstics);
    app.post(`${process.env.MICRO_SERVICE}/api/add-crop-list`, auth,  users.getAddCropList);
    app.post(`${process.env.MICRO_SERVICE}/api/delete-list`, auth,  users.deletelist);
    app.post(`${process.env.MICRO_SERVICE}/api/filter-data`, auth,  users.filterData);
    // app.post(`${process.env.MICRO_SERVICE}/api/delete-list`, auth, users.filterlist);


    app.post(`${process.env.MICRO_SERVICE}/api/get-crop-group-code`, auth,  users.getCropGroupCode);
    app.post(`${process.env.MICRO_SERVICE}/api/distinct-crop-name`,  users.distinctCropName);
    app.post(`${process.env.MICRO_SERVICE}/api/distinct-crop-name-add-breder`,  users.distinctCropNameAddBreeder);

    app.post(`${process.env.MICRO_SERVICE}/api/distinct-crop-name`, auth, users.distinctCropName);
    app.post(`${process.env.MICRO_SERVICE}/api/get-breeder-name-by-district`, auth,  users.getBreederNameByDistrict);
    app.post(`${process.env.MICRO_SERVICE}/api/get-distrinct-crop-name`, auth,  users.getCropNameData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-distrinct-seed-variety-crop-name`, auth,  users.getSeedVarietyCropNameData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-distrinct-crop-name-characterstics`, users.getCropNamecharacterData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-distrinct-variety-name`, auth, users.getVarietyNameData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-distrinct-variety-name-characterstics`,  users.getVarietyNamecharacterData);

    // app.post(`${process.env.MICRO_SERVICE}/api/getAllIndentorsList`, auth,  users.getAllIndentorsList);

    app.post(`${process.env.MICRO_SERVICE}/api/getAllIndentorsList`, auth,  users.getAllIndentorsList)
    app.post(`${process.env.MICRO_SERVICE}/api/get-max-lot-size-crop-name`, auth,  users.getMaxLotSizeCropName)
    
    //implement audit trail
    app.post(`${process.env.MICRO_SERVICE}/api/audit-trail-history`, auth,  users.auditTrailHistory);
    app.post(`${process.env.MICRO_SERVICE}/api/utils/upload`,auth,   users.upload);
    app.get(`${process.env.MICRO_SERVICE}/api/utils/file-download`, auth,  users.getFile);
    app.post(`${process.env.MICRO_SERVICE}/api/edit-crop-variety`, auth,  users.editcropVarietyCharacterstics);
    app.post(`${process.env.MICRO_SERVICE}/api/get-crop-name-of-seed-multiplication`, auth,  users.getSeedMultiplicationCropNameData)
    app.post(`${process.env.MICRO_SERVICE}/api/getdistinctCropNameInVariety`, auth, users.getdistinctCropNameInVariety)
    app.post(`${process.env.MICRO_SERVICE}/api/getdistinctVariettyNameIncharacterstics`,  users.getdistinctVariettyNameIncharacterstics)
    app.post(`${process.env.MICRO_SERVICE}/api/distinctCropNamegrid`, auth,  users.distinctCropNamegrid)
    app.post(`${process.env.MICRO_SERVICE}/api/getdistinctVariettyNameIncharactersticsfromCharacterstics`,  users.getdistinctVariettyNameIncharactersticsfromCharacterstics)
    app.post(`${process.env.MICRO_SERVICE}/api/getCropDataList`, auth,  users.getCropDataList)
    app.post(`${process.env.MICRO_SERVICE}/api/viewCropGroupReport`, auth,  users.viewCropGroupReport)
    app.post(`${process.env.MICRO_SERVICE}/api/getCropListReport`, auth,  users.getCropListReport)
    app.post(`${process.env.MICRO_SERVICE}/api/isStatusUpdate`, auth,  users.updateStatusActive)
    // rought 
    app.post(`${process.env.MICRO_SERVICE}/api/islastLogin`,auth,users.useridByLogOn)
    
    // variety charaterstic data 
    app.post(`${process.env.MICRO_SERVICE}/api/get-no-year-character-data`,  users.getNoYearcharacterData);
    app.post(`${process.env.MICRO_SERVICE}/api/get-masters-institute-list`,  users.getMastersInstituteList);
    
    // app.post(`${process.env.MICRO_SERVICE}/api/distinctCropNameinCharacterstics`, auth,  users.distinctCropNameinCharacterstics)
};

