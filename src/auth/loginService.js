
const jwt = require('jsonwebtoken');
const { getUserbyID } = require('../api/controller/userController');
const { decryptPass } = require('../utils/encryptDecrypt');

const SECRET = process.env.SECRET;

module.exports = function (app) {
    app.route('/api/login')
        .post(async (req, res) => {
            const user_id = req.body.user_id;
            const password = req.body.password;
            //check a user is logged in
            const bearer = req?.headers?.authorization?.split(" ")[1];
            const decoded = jwt.verify(bearer, SECRET, function (err, decoded) {
                return err, decoded
            })
            if (decoded?.user_id == user_id) {
                res.status(400).json({
                    success: false,
                    message: 'Already logged in'
                });
            } else {
                const result = await getUserbyID(user_id);
                if (result != 0 && decryptPass(result[0]?.password, password)) {
                    //generate token
                    const token = jwt.sign(
                        { user_id: result[0].user_id, user_role: result[0].role }, SECRET, { expiresIn: "7d", }
                    );
                    res.status(200).json({
                        success: true,
                        message: 'Logged in successfully',
                        token: token
                    });
                } else {
                    res.status(200).json({
                        success: false,
                        message: 'Incorrect password or username'
                    });

                }
            }
        })


}


