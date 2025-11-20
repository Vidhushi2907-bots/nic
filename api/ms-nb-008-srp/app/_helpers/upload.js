const Buffer = require('buffer').Buffer;
const path = require('path');
const fs = require('fs');
const { BlobServiceClient } = require("@azure/storage-blob");

class FileUpload {
    static uplaod = async (base64str, folder, type) => {
        let buf = Buffer.from(base64str, 'base64');
        // const filename =  `${newDate.getTime()}.${type}`
        // //console.log("filenamefilenamefilename", `${folder}${newDate.getTime()}.${type}`)
        // return `dsdsad${filename}`
        return fs.writeFile(path.join('assets/images/' + folder), buf, async (error, folder) => {
            if (error) {
                throw error;
            } else {
                //console.log('File created from base64 string!');
                return folder;
            }
        });
    }

    static uploadToAzureBucket = async (base64str, imagePath) => {
        let containerName = 'insureereceipts';

        const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
        const containerClient = await blobServiceClient.getContainerClient(containerName);
        const blockBlobClient = containerClient.getBlockBlobClient(imagePath);
        const buffer = new Buffer.from(base64str, 'base64');
        const file = blockBlobClient.upload(buffer, buffer.byteLength );

        return file
    }
}
module.exports = FileUpload
