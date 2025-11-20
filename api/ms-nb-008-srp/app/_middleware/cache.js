require('dotenv').config()
const redis = require('redis')
// const client = redis.createClient();

let client = redis.createClient(6379);
client.auth("password");

//Incase any error pops up, log it
client.on("error", function(err) {
  //console.log("Error :" + err);
})

module.exports = client
