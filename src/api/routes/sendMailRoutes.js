const sendMailController = require('../controller/sendMailController');
module.exports = function (app) {
    app.route('/sendmail')
        .post(async (req, res) => {
            const result = await sendMailController(req, res);
            console.log(result, 'we go');
            res.status(200).json(result);
        }
        );
}

