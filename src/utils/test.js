const otplib = require('otplib');

// An object to store the secret keys for each user
const userSecrets = {};

// Generate a new secret key for a user and store it in the userSecrets object
function generateUserSecret(userId) {
    const secret = otplib.authenticator.generateSecret(16);
    userSecrets[userId] = secret;
    return secret;
}

// Generate an OTP code for a user with a given userId
function generateOTP(userId, digits = 6) {
    // Retrieve the user's secret key from the userSecrets object
    console.log(userSecrets[userId], 'abc')
    const secret = userSecrets[userId];

    // Generate a code with the specified number of digits
    otplib.authenticator.options = { digits: digits };
    const code = otplib.authenticator.generate(secret);

    // Return the code to the user
    return code;
}

// Validate an OTP code for a user with a given userId
function validateOTP(userId, code, window = 0) {
    // Retrieve the user's secret key from the userSecrets object
    const secret = userSecrets[userId];

    // Validate the code using the user's secret key and the specified window
    return otplib.authenticator.check(code, secret, { window });
}

// Example usage: generate and validate OTP codes for 100 users
for (let i = 1; i <= 10; i++) {
    const userId = `user${i}`;
    generateUserSecret(userId);
    const code = generateOTP(userId);
    const isValid = validateOTP(userId, code);
    console.log(`User ${userId} code is ${isValid ? 'valid' : 'invalid'}`);
}

console.log(userSecrets, 'sse')
