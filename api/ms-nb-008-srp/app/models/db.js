const Sequelize = require('sequelize');
require('dotenv').config()

// var connection = mysql.createPool({
//   host: process.env.HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB
// });

//Sequelize connection
// const path = `mysql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.HOST}:3306/${process.env.DB}`;
// const connection = new Sequelize(path, { operatorsAliases: false });

//Sequelize connection
var connection = new Sequelize(process.env.DB, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.HOST,
  port: process.env.DB_PORT,
  dialect: 'postgres',
});
connection.authenticate()
    .then(function () {
        console.log("DB CONNECTED! ");
        //connection.sync();
    })
    .catch(function (err) {
        //console.log(err.message);
    })
module.exports = connection;
