const { addNewBooking, getAllBooking, getBookingById, deleteBookingById, updateBooking, getFreeRoomToBook, updateStatus, getFreeSubRoomToBook, allBookedOneUser } = require("../controller/bookingController")
var express = require('express')
var app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

module.exports = function (app, id) {
    app.route('/book')
        .get(async (req, res) => {
            const result = await getAllBooking();
            res.status(200).json({
                success: true,
                data: result
            });
        })

        .post(async (req, res) => {
            const result = await addNewBooking(req.body);
            console.log(result, 'heeresss')
            if (result[0].affectedRows == 1) {
                res.status(200).json({
                    success: true,
                    message: 'Created sucessfully'
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: 'Fail to create'
                });
            }
        })
        .put(async (req, res) => {
            const result = await updateBooking(req.body);
            if (result[0].affectedRows == 1) {
                res.status(200).json({
                    success: true,
                    message: 'Updated sucessfully'
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: 'Fail to create'
                });
            }
        })

    app.route('/free_room_to_book')
        .post(async (req, res) => {
            const result = await getFreeRoomToBook(req.body);
            res.status(200).json({
                success: true,
                data: result
            });
        })
    app.route('/free_sub_room_to_book')
        .post(async (req, res) => {
            const result = await getFreeSubRoomToBook(req.body);
            res.status(200).json({
                success: true,
                data: result
            });
        })
    app.route('/book/status')
        .put(async (req, res) => {
            const result = await updateStatus(req.body);
            if (result[0].affectedRows == 1) {
                res.status(200).json({
                    success: true,
                    message: 'Status updated sucessfully'
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: 'Status fail to create'
                });
            }
        })

    app.route('/book/:id')
        .get(async (req, res) => {

            console.log(req.params.id)
            const result = await getBookingById(req.params.id);
            res.status(200).json({
                success: true,
                data: result
            });
        })
        .delete(async (req, res) => {
            const result = await deleteBookingById(req.params.id);
            console.log(result)
            if (result[0].affectedRows == 1) {
                res.status(200).json({
                    success: true,
                    message: 'Deleted sucessfully'
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: 'Not found'
                });
            }

        })
    app.route('/book/user/:id')
        .get(async (req, res) => {
            console.log(req.params.id)
            const result = await allBookedOneUser(req.params.id);
            res.status(200).json({
                success: true,
                data: result
            });
        })
}

