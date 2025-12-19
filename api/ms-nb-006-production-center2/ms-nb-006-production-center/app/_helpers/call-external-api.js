require('dotenv').config()
const axios = require('axios');
var https = require('https');

class CallExternalAPI {
    static post = async (url = null, data=[]) => {
        // const {msg, mobile} = smsData
        // const USER_API_URL = process.env.USER_API_URL
        // const SPA_USER_API_URL = process.env.SPA_USER_API_URL

        const ENVIRONMENT = process.env.ENVIRONMENT

        // console.log("USER_API_URL", USER_API_URL)
        console.log("ENVIRONMENT", ENVIRONMENT)
        console.log("userData", data)
        if (ENVIRONMENT == 'AEOLOGIC') {
		 return true;
        }

        const httpsAgent = new https.Agent({ rejectUnauthorized: false });

        return new Promise((resolve, reject) => {
            axios({
                url: url,
                method: 'post',
                httpsAgent: httpsAgent,
                data: data
            }).then(function (response) {
                console.log("response.stateCode == 200", response.status)
                // console.log("aaaaaaaresponseresponse", response)
                if (response.status == 200) {
                    //console.log("responseresponseDDDDDDDDDDDDDD", response.data)

                    if (response.data == "user created succesfully.") {
                        // resolve("done")
                        resolve(response.data)

                    }
                    resolve(response.data)
                } else {
                    resolve(response.data)
                }
                //    resolve("done")

            }).catch(function (error) {
                // handle error
                console.log("eroror", error);
            })
        });


        // let xhr = new XMLHttpRequest();

        // xhr.open("POST", USER_API_URL, true);
        // xhr.onreadystatechange = function(){
        // if (xhr.readyState == 4 && xhr.status == 200) {
        //     console.log('success');
        // }
        // };
        // // xhr.send();
        // let stringData = JSON.stringify(userData)
        // console.log("stringData", stringData)
        // xhr.send(stringData);
    }

}
module.exports = CallExternalAPI;
