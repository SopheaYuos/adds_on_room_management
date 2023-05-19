var nodemailer = require('nodemailer');
const { generateOTP, generateUserSecret } = require('./otpHelper');

const EMAIL = process.env.EMAIl;
module.exports = async function sendMail(user_id, email, subject) {
    generateUserSecret(user_id);
    const code = generateOTP(user_id);

    var mailOptions = {

        from: `Room Management ${email}`,
        to: email,
        subject: subject,
        html: htmlTemplate(String(code))
    };
    //email admin
    var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: EMAIL,
            pass: process.env.PASSWORD
        },
        // tls: {
        //   rejectUnauthorized: false
        // }
    });
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, function (error, reply) {
            if (error) {
                reject({ success: false, message: error });
            } else {
                console.log('Mail sent successfully');
                resolve({ success: true, message: "Mail send successfully" });
            }
        });
    });
    // transporter.sendMail(mailOptions, function (error, reply) {
    //     if (error) {
    //         // res.status(400).json({ success: false, message: error });
    //         return { success: false, message: error }
    //     } else {
    //         console.log('fuck')
    //         return { success: true, message: "Mail send successfully" }
    //     };
    // });
}


const htmlTemplate = (otpNumber) => {
    return `
      <!DOCTYPE html>
    <html>
    <head>
      <title>Verification Code</title>
      <style>
        
        body {
          font-family: Arial, Helvetica, sans-serif;
          background-color: #f2f2f2;
        }
        .container {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #fff;
          border-radius: 10px;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
        }
        h1 {
          margin-top: 0;
          text-align: center;
          color: #333;
        }
        p {
          margin-bottom: 20px;
          line-height: 1.5;
          color: #666;
        }
            .container > .code {
                    width: 100%;
                  max-width: 600px;
                  margin: 0 auto;
                    text-align: center;
            }
        .code {
          width: 100%;
          display: inline-block;
          padding: 10px;
          background-color: #38d39f;
          border-radius: 20px;
          font-size: 24px;
          font-weight: bold;
          color: #fff;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
                margin-bottom: 10px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Verification Code</h1>
        <p>Your verification code is:</p>
        <div class="code">${otpNumber}</div>
        <p>Please enter this code on the verification page to complete the verification process.</p>
      </div>
    </body>
    </html>
`
}