const { getRoomEquimentById } = require("../controller/roomEquimentController");


module.exports = function (app) {
    app.route('/room/view-equipment/:id')
    .get(async (req, res) => {
        const id = req.params.id || 0;
        console.log(req.params.id, ' req params')
            const result = await getRoomEquimentById(id);
            // console.log(result);
            res.status(200).json({
                success: true,
                data: result
            })
        })
}

