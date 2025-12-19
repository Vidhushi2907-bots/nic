class Generic {
    static uploadDocuments = (req, res, callbackBeforeResponse) => {
        let attachment;
        let uploadPath, uploadUrl;
        if (!callbackBeforeResponse)
            callbackBeforeResponse = (uploadedURL, isAnError) => { };

        if (!req.files || Object.keys(req.files).length === 0) {
            callbackBeforeResponse(null, true);
            res.status(400).send('No files were uploaded.');
            return;
        }
        // //console.log('req.files >>>', req.files); // eslint-disable-line

        attachment = req.files.attachment;
        var extainsionCount = attachment.name.split('.').length;
        if (extainsionCount > 2) {
            callbackBeforeResponse(null, true);
            res.status(400).send('invalid file.');
            return;
        }
        let fix = new Date().getTime() + '-';
        uploadPath = "/var/www/html/fertilizer-api"+ '/uploads/' + fix + attachment.name;
uploadUrl = (req.headers.host == 'frs.dbtfert.nic.in') ? "https" :req.protocol;
uploadUrl = uploadUrl + `://${req.headers.host}` + '/api/uploads/' + fix+attachment.name;

       // uploadUrl = `${req.protocol}://${req.headers.host}` + '/api/uploads/' + fix + attachment.name;
        try {
            attachment.mv(uploadPath, function (err) {
                if (err) {
                    callbackBeforeResponse(null, true);
                    return res.status(500).send(err);
                }
                if (uploadPath.split('.').pop() == "pdf") {
                    callbackBeforeResponse(uploadUrl, false);
                    res.json({ 'url': uploadUrl });
                }
                else
                    sizeOf(uploadPath, function (err, dimensions) {
                        //console.log("----------",dimensions);
                        if (dimensions) {
                            callbackBeforeResponse(uploadUrl, false);
                            res.json({ 'url': uploadUrl });

                        } else {
                            callbackBeforeResponse(null, true);
                            res.json({ 'url': "image not uploaded" });
                        }
                    });
                // res.json({'url':uploadUrl});
            });
        } catch (error) {
            callbackBeforeResponse(null, true);
            res.json({ 'url': "errrororor" + error });
        }
    }
}

module.exports = Generic;