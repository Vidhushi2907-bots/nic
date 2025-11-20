const express = require('express');
const nodemailer = require('nodemailer')
const sendMail = (to, subject, text) => {
  
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'divyanityagi9118@gmail.com',
        pass: '8787241707'
      }
    });
    var mailOptions = {
      from: 'divyanityagi9118@gmail.com',
      to: to,
      subject: subject,
      text: text 
    };
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        //console.log("Error",error);
      } else {
        //console.log('Email sent: ' + info.response);
      }
    });
  
  }
  module.exports = sendMail;

