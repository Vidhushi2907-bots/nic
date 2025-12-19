const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const app = express();
const fileUpload = require('express-fileupload');
const jwt = require('./app/_middleware/jwt');
const errorHandler = require('./app/_middleware/error-handler');
const decryption = require('./app/_middleware/decryption');
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
var sizeOf = require('image-size');
global.sizeOf = require('image-size');
require('dotenv').config()
Frontend_Base_URL = process.env.Frontend_Base_URL

//For Response Header Security
app.use(helmet());
app.use(function (req, res, next) {
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('X-Frame-Options','deny');
  next();
});


//For Response Header Security END
console.log("-----");
const data= new Date().toLocaleString('en-US', {
  timeZone: 'Asia/Calcutta'
});

// app.use('/api',express.static('assets/images'));
// app.use('/api',express.static('assets/secure'));
app.use(fileUpload());

app.use(bodyParser.json({limit: '10mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({credentials: true, origin: Frontend_Base_URL}));

const allowedMethods = [ 'GET', 'POST']
app.use((req, res, next) => {
  if (!allowedMethods.includes(req.method)) {
    let jsonData = {
      "code": 400,
      "failed": "Method not Allowed"
    }
    return res.send({"EncryptedResponse": jsonData })
  }
  return next()
})

// app.use('/api',express.static('public'));
// app.use('/uploads',express.static('uploads'));
require("./app/routes/user.routes.js")(app);
require("./app/routes/bspc_new_flow.routes.js")(app);
require("./app/routes/monitoring_team_details.routes.js")(app);
require("./app/routes/stl_form.routes.js")(app);
require("./app/routes/tag_print.routes.js")(app);
require("./app/routes/lifting_seeds.routes.js")(app);
require("./app/routes/inability_reallocate.routes.js")(app);

require("./app/routes/got.routes.js")(app);

app.use(errorHandler);
const PORT = process.env.PORT || 3006;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});




