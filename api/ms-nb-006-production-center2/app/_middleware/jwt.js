require('dotenv').config()
const expressJwt = require('express-jwt');
const userService = require('../controllers/user.controller');

const jwt = ()=> {
    const secret = process.env.JWT_SECRET;
    return expressJwt({ secret, algorithms: ['HS256'], isRevoked }).unless({
        path: [
            '/signup',
            '/login',
            '/validate-sign-in',
            '/validate-otp',
            '/resend-otp',
            '/forgot-password-validate',
            '/send_mail',
            '/reset-password',
            '/validate-sign-up',
            '/get-city-list',
            '/get-state-list',
            '/get-gender-list',
            '/get-marital-list',
            '/get-annual-income-list',
            '/validate-sign-up-otp'
        ]
    });
}

async function isRevoked(req, payload, done) {
    // const user = await userService.getById(payload.sub);
    // if (!user) {
    //     return done(null, true);
    // }
    done();
}

module.exports = jwt;
