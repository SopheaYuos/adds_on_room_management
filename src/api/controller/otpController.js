
const { generateOTP, validateOTP, generateUserSecret } = require('../../utils/otpHelper');
let secret1;
let test1;
module.exports = {
    generateOTP: (req) => {
        const secret = generateUserSecret(req.body.user_id);
        const code = generateOTP(req.body.user_id);
        return code + " " + secret;
    },
    validateOTP: (req) => {
        const code = req.body.code;
        const user_id = req.body.user_id;
        console.log(req.body, 'her we goss')
        const isValid = validateOTP(user_id, code);

        if (isValid) {
            // res.send('TOTP is valid');
            return 'valid'
            // Allow user to proceed with authentication
        } else {
            return 'invalid'
            // res.status(400).send('TOTP is invalid');
            // Display error message to user
        }
    }
}
