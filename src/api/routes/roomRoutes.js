const { getAllRooms, getRoomById, getAllsubrooms, getSubroomById, createSubroom, createRoom, updateSubroom, updateRoom, deleteSubroomById, deleteRoomById, updateRoomV2 } = require("../controller/roomController")


module.exports = function (app) {
    app.route('/room')
        .get(async (req, res) => {
            const result = await getAllRooms();
            // console.log(result);
            res.status(200).json({
                success: true,
                data: result
            })
        })
        .post(async (req, res) => {
            const result = await createRoom(req.body);
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
            const result = await updateRoom(req.body);
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
    app.route('/v2/room/update')
        .put(async (req, res) => {
            const result = await updateRoomV2(req.body);
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
    
    app.route('/room/:id')
        .get(async (req, res) => {
            const result = await getRoomById(req.params.id);
            // console.log(result, 'here');
            res.status(200).json({
                success: true,
                data: result
            })
        })
        .delete(async (req, res) => {
            const result = await deleteRoomById(req.params.id);
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

    app.route('/subrooms')
        .get(async (req, res) => {
            const result = await getAllsubrooms();
            // console.log(result);
            res.status(200).json({
                success: true,
                data: result
            })
        })
        .post(async (req, res) => {
            const result = await createSubroom(req.body);
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
            const result = await updateSubroom(req.body);
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

    app.route('/subrooms/:id')
        .get(async (req, res) => {
            const result = await getSubroomById(req.params.id);
            res.status(200).json({
                success: true,
                data: result
            })
        })
        .delete(async (req, res) => {
            const result = await deleteSubroomById(req.params.id);
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



}

