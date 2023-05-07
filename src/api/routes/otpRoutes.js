const express = require('express');
const { generateOTP, validateOTP } = require('../controller/otpController');
const router = express.Router();

// Route for generating a new TOTP code
module.exports = (app) => {
    app.route('/generate-otp')
        .post(async (req, res) => {
            // console.log(req.body, 'sdfa')
            const result = generateOTP(req);
            res.send(`Code: ${result}`);
        }
        );
    app.route('/validate-otp')
        .post(async (req, res) => {
            const result = validateOTP(req);
            res.send(result)
        }
        );
}