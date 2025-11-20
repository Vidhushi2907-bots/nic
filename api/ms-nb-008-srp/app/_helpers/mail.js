require('dotenv').config()
// const template = import('../view/email/welcome-note.html')
const nodemailer = require('nodemailer')
const hbs = require('nodemailer-express-handlebars')
const path = require('path')
const viewPath =  path.resolve(__dirname, '../templates/views/')
const partialsPath = path.resolve(__dirname, '../templates/partials');
var fs = require('fs');

const sendMail = (emailDetails) => {

    var transporter = nodemailer.createTransport({
      service: 'gmail',
      port: 2525,
      auth: {
        user: `${process.env.EMAIL}`, 
        pass: `${process.env.PASSWORD}`
      }
    });

    transporter.use('compile', hbs({
      viewEngine: {
        extName: '.handlebars',
        // partialsDir: viewPath,
        layoutsDir: viewPath,
        defaultLayout: false,
        data: emailDetails.data,
        partialsDir: partialsPath,
      },
      viewPath: viewPath,
      extName: '.handlebars',
    }))

    var mailOptions = {
      from: process.env.FROM,
      to: emailDetails.emailId,
      subject: emailDetails.subject,
      // text: data.text,
      // html: template,
      template: emailDetails.template,
      context: {
        data: emailDetails.data,
        url: process.env.Base_URL,
        frontend_Base_URL: process.env.Frontend_Base_URL
      }
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        //console.log("error", error);
          let name = 'EMAIL Fail';
          fs.appendFile('./emaillog.txt',
              `\nLog Type: ${name}
              \n${emailDetails.emailId}              
              \n${emailDetails.subject}              
              \nMessage: ${error}
              \n----------------------------------------------------`
              ,
              ()=>{
                  //console.log('Successfully Logged');
              }
          )
      } else {
          let name = 'EMAIL Success';
          fs.appendFile('./emaillog.txt',
              `\nLog Type: ${name}
              \n${emailDetails.emailId}              
              \n${emailDetails.subject}              
              \nMessage: ${error}
              \n----------------------------------------------------`
              ,
              ()=>{
                  //console.log('Successfully Logged');
              }
          )
        //console.log('Email sent: ' + info.response);
      }
    });
}
  module.exports = sendMail;
