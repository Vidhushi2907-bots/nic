require('dotenv').config();
 const axios = require('axios');
var https = require('https');

const getstlstate = async (statecode) => {
    const Stl_Lab_State_Code = `${process.env.Base_LIVE}/api/getLabDetails?stateCode=${statecode}&apiKey=${process.env.apiKey_LIVE}`;
  
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    };
  
    const httpsAgent = new https.Agent({ rejectUnauthorized: false });
  
    try {
      const response = await axios({
        url: Stl_Lab_State_Code,
        method: 'GET',
        httpsAgent: httpsAgent,
        headers: headers,
      });
      const modifiedData = response;
  
      // Modify the response to clean up the labId field
      // const modifiedData = response.data.map(item => {
      //       return {
      //       ...item,
      //       idtype: typeof item.labId,
      //       id: item.labId ? item.labId.split('-')[1] : null,
      //       newid: item.labId ? parseInt(item.labId.split('-')[0], 10) || null : null,
      //       lab_name: item.labName || 'NA'
      //     };
      // });
  
      // console.log("success", modifiedData);
      return modifiedData; // Return the modified data
    } catch (error) {
      console.error("error", error);
      throw error;
    }
  };
  
  module.exports = getstlstate;
  

  

