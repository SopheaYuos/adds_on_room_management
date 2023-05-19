var nodemailer = require('nodemailer');
const promiseCon = require("../../config/promiseCon");
const sendMail = require('../../utils/sendMail');

module.exports = async function sendMailController(req, res) {
  const { user_id, subject } = req.body;
  result = await (await promiseCon).query(`SELECT email FROM users where user_id = "${user_id}"`);
  console.log(result[0][0].email, 'emaillll');
  // generateUserSecret(user_id);
  // const code = generateOTP(user_id);
  // const res2 = 
  // console.log(res2, 'res in senmailcontroller.js')
  return await sendMail(user_id, result[0][0].email, subject);
}