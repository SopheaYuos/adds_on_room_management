const { getAllUsers, getUserbyID, AddUser } = require("../controller/userController")
const User = require("../controller/userController")


module.exports = function (app) {
    app.route('/users')
        .get(async (req, res) => {
            const result = await User.getAllUsers();
            // res.status(200).json(result);
            console.log(result);
            res.status(200).json({
                success: true,
                data: result
            })
        })
        .post(async (req, res) => {
            //req.body
            const result = await User.AddUser(req.body);
            console.log(result, 'heisdf')
            if (typeof result === 'string') {
                res.status(200).json({
                    success: false,
                    message: 'Student exists'
                });
            } else {
                if (result[0].affectedRows == 1) {
                    res.status(200).json({
                        success: true,
                        message: 'Added successfully'
                    });
                } else {
                    res.status(404).json({
                        success: false,
                        message: 'Fail to add'
                    });
                }
            }


        })
        .put(async (req, res) => {
            const result = await User.updateUser(req.body);
            if (result[0].affectedRows == 1) {
                res.status(200).json({
                    success: true,
                    message: 'Updated succesfully'
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: 'failed to update'
                });

            }
        })
    app.route('/users/:user_id')
        .get(async (req, res) => {
            console.log(req.params)
            const result = await User.getUserbyID(req.params.user_id);
            console.log(result);
            res.status(200).json({
                success: true,
                data: result
            })
        })
        .delete(async (req, res) => {

            const result = await User.deleteUserbyId(req.params.user_id);
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
    app.route('/user/forgot-password')
        .post(async (req, res) => {
            //check the email existed in db or not 
            //true send email to users contian 6 digit code and if succes go to new page for new password

            console.log(req.body)
            const result = await User.UserByEmail(req.body);
            console.log(result);
            res.status(result.status).json({
                success: result.isSuccess,
                message: result.message,
                data: result?.data ?? []
            })

        })
    app.route('/user/reset-password')
        .post(async (req, res) => {
            //check the email existed in db or not 
            //true send email to users contian 6 digit code and if succes go to new page for new password

            console.log(req.body)
            const result = await User.resetNewPassword(req.body);
            console.log(result);
            res.status(result.status).json({
                success: result.isSuccess,
                message: result.message,
                data: result?.data ?? []
            })

        })

}


