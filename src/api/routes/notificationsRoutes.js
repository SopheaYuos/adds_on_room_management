var express = require('express');
const { getNotificationByUserId } = require('../controller/notificationController');
var app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

module.exports = function (app, io) {
    app.route('/get-notifications/:id')
        .get(async (req, res) => {
            const result = await getNotificationByUserId(req.params.id);
            res.status(200).json({
                success: true,
                data: result
            });
        })
    }   