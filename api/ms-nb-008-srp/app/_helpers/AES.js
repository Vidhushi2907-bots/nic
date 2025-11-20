const CryptoJS = require('crypto-js')
require('dotenv').config()

class AES {
    static AES_KEY = process.env.AES_SECRET
    static encryption(jsonData) {

        // return {"EncryptedResponse": jsonData };

        const key = CryptoJS.enc.Utf8.parse(this.AES_KEY);
        const iv = CryptoJS.enc.Utf8.parse(this.AES_KEY);

        const encryptedText = CryptoJS.AES.encrypt(
            JSON.stringify(jsonData),
            key, {
                    keySize: 128,
                    blockSize: 128,
                    iv: iv,
                    mode: CryptoJS.mode.CBC,
                    padding: CryptoJS.pad.Pkcs7
                }
        ).toString();
        return {"EncryptedResponse": encryptedText };
    }

    static encryptReal(jsonData) {

        const key = CryptoJS.enc.Utf8.parse(this.AES_KEY);
        const iv = CryptoJS.enc.Utf8.parse(this.AES_KEY);

        const encryptedText = CryptoJS.AES.encrypt(
            JSON.stringify(jsonData),
            key, {
                keySize: 128,
                blockSize: 128,
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            }
        ).toString();
        return {"EncryptedResponse": encryptedText };
    }

    static decryption(encryptedText) {

        // return encryptedText;

        const key = CryptoJS.enc.Utf8.parse(this.AES_KEY);
        const iv = CryptoJS.enc.Utf8.parse(this.AES_KEY);
        const base64Decoded = CryptoJS.AES.decrypt(
            encryptedText,
            key, {
                    keySize: 128,
                    blockSize: 128,
                    iv: iv,
                    mode: CryptoJS.mode.CBC,
                    padding: CryptoJS.pad.Pkcs7
                }
            ).toString(CryptoJS.enc.Utf8);
        return base64Decoded;
    }

    static cscDecryption(encryptedText) {

        // return encryptedText;
        const secretKey = "bbd8409829c6c214";
        const key = CryptoJS.enc.Utf8.parse(secretKey);
        const iv = CryptoJS.enc.Utf8.parse(secretKey);
        const base64Decoded = CryptoJS.AES.decrypt(
            encryptedText,
            key, {
                    keySize: 128,
                    blockSize: 128,
                    iv: iv,
                    mode: CryptoJS.mode.CBC,
                    padding: CryptoJS.pad.Pkcs7
                }
            ).toString(CryptoJS.enc.Utf8);
        return base64Decoded;
    }

    static cscEncryption(jsonData) {

        // return {"EncryptedResponse": jsonData };
        const secretKey = "bbd8409829c6c214";
        const key = CryptoJS.enc.Utf8.parse(secretKey);
        const iv = CryptoJS.enc.Utf8.parse(secretKey);

        const encryptedText = CryptoJS.AES.encrypt(
            JSON.stringify(jsonData),
            key, {
                    keySize: 128,
                    blockSize: 128,
                    iv: iv,
                    mode: CryptoJS.mode.CBC,
                    padding: CryptoJS.pad.Pkcs7
                }
        ).toString();
        return encryptedText;
    }

    static tokenDecryption(encryptedText) {
        const secretKey =  "UIYE7R94R93734N9";
        const key = CryptoJS.enc.Utf8.parse(secretKey);
        const iv = CryptoJS.enc.Utf8.parse(secretKey);
        const base64Decoded = CryptoJS.AES.decrypt(
            encryptedText,
            key, {
                    keySize: 128,
                    blockSize: 128,
                    iv: iv,
                    mode: CryptoJS.mode.CBC,
                    padding: CryptoJS.pad.Pkcs7
                }
            ).toString(CryptoJS.enc.Utf8);
        return base64Decoded;
    }

    static tokenEncryption(jsonData) {
        const secretKey = "UIYE7R94R93734N9";
        const key = CryptoJS.enc.Utf8.parse(secretKey);
        const iv = CryptoJS.enc.Utf8.parse(secretKey);

        const encryptedText = CryptoJS.AES.encrypt(
            JSON.stringify(jsonData),
            key, {
                    keySize: 128,
                    blockSize: 128,
                    iv: iv,
                    mode: CryptoJS.mode.CBC,
                    padding: CryptoJS.pad.Pkcs7
                }
        ).toString();
        return encryptedText;
    }
}

module.exports = AES
