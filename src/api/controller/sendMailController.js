var nodemailer = require('nodemailer');
const promiseCon = require("../../config/promiseCon");
// const generate6DigitCode = require('../../utils/SixDigitRandom');
const EMAIL = process.env.EMAIl;
module.exports = async function sendMailController(req, res) {
  const { email_user, status, user_id } = req.body;
  result = await (await promiseCon).query(`SELECT email FROM users where user_id = "${user_id}"`);
  console.log(result[0][0].email, 'emaillll');

  // const sixDigitCode = generate6DigitCode();
  var mailOptions = {
    from: EMAIL,
    to: result[0][0].email,
    subject: 'Approval your booking',
    Text: 'Send Mail',
  };
  console.log(mailOptions)
  console.log(process.env.PASSWORD)
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

  transporter.sendMail(mailOptions, function (error, reply) {
    if (error) {
      res.status(400).json({ success: false, message: error });
    } else {
      res.status(200).json({ success: true, message: "Mail send successfully" });
    }
  });
}