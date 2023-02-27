var nodemailer = require('nodemailer');
const promiseCon = require("../../config/promiseCon");

module.exports = async function sendMailController(req, res) {
  const { email_user, status, user_id } = req.body;
  result = await (await promiseCon).query(`SELECT email FROM users where user_id = "${user_id}"`);
  // console.log(result[0][0].email);

  var mailOptions = {
    from: 'phannetpov@gmail.com',
    to: result[0][0].email,
    subject: 'Approval your booking',
    Text: 'Send Mail',
  };
  //email admin
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: 'phannetpov@gmail.com',
      pass: '***********',
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  transporter.sendMail(mailOptions, function (error, reply) {
    if (error) {
      res.status(400).json({ success: false, message: error });
    } else {
      res.status(200).json({ success: true, message: "Mail send successfully" });
    }
  });
}