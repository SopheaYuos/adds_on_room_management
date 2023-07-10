const promiseCon = require("../../config/promiseCon");
const {formatDate} = require("../../utils/formatDate");
const { encryptPass, decryptPass } = require("../../utils/encryptDecrypt");
const sendMailController = require("./sendMailController");
const sendMail = require("../../utils/sendMail");

module.exports = {
    getAllUsers: async function getUsers() {

        const sql = `SELECT * FROM users `;
        const result = await promiseCon.query(sql)
        return result[0];

    },
    getUserbyID: async function getUserbyID(user_id) {
        const sql = `select * from users where user_id = '${user_id}'`
        const result = await (await promiseCon).query(sql);
        return result[0];
    },
    UserByEmail: async function getUserByEmail(params) {
        if (!params.value || !params.column) {
            return {
                status: 400,
                message: 'Invalid request parameter',
                isSuccess: false,
            }
        }
        try {
            const sql = `CALL GetUserProc('${params.value}', '${params.column}');`;
            const result = await promiseCon.query(sql);
            let isUserExistedInDB = false;
            if (result[0][0].length > 0) {
                isUserExistedInDB = true;
                await sendMail(result[0][0][0].user_id, result[0][0][0].email, params.subject);

                return {
                    status: 200,
                    message: 'If you entered a correct email, we will send verification code to your email',
                    isSuccess: true,
                    data: result[0][0]
                }
            } else {
                return {
                    status: 200,
                    message: 'If you entered a correct email, we will send verification code to your email',
                    isSuccess: false,
                }
            }
        } catch (err) {
            return {
                status: 400,
                message: 'Somthing went wrong',
                isSuccess: false,

            }
        }
    },
    // AddUser: async function addnew(reqBody) {
    //     const created = formatDate(new Date());
    //     const encpassword = encryptPass(reqBody.password);
    //     const decpasword = decryptPass(encpassword, reqBody.password);
    //     console.log(encpassword);
    //     console.log(decpasword);
    //     const verifiedExistingUser = await this.getUserbyID(reqBody.user_id);
    //     if (verifiedExistingUser.length !== 0) return 'Student ID Existed';
    //     // if (verifiedExistingUser)
    //     const sql = `
    //     INSERT INTO users (user_id,name,password,gender,department,mobile,email,position, role,created,modified)
    //         values ("${reqBody.user_id}","${reqBody.name}", "${encpassword}", "${reqBody.gender || "NULL"}", "${reqBody.department ?? "NULL"}","${reqBody.mobile || "NULL"}", "${reqBody.email}", "${reqBody.position}", "${reqBody.role}",  "${created}","${created}" )
    //     `;
    //     const result = await (await promiseCon).query(sql);
    //     return result;

    // },
    AddUser: async function addnew(reqBody) {
        const created = formatDate(new Date());
        const encpassword = encryptPass(reqBody.password);
        const decpasword = decryptPass(encpassword, reqBody.password);
        const verifiedExistingUser = await this.getUserbyID(reqBody.user_id);
        if (verifiedExistingUser.length !== 0) return 'Student ID Existed';

        const sql = "CALL AddUserProc(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const values = [
            reqBody.user_id,
            reqBody.name,
            encpassword,
            reqBody.gender,
            reqBody.department,
            reqBody.mobile,
            reqBody.email,
            reqBody.position,
            reqBody.role,
            created,
            created
        ];

        const result = await (await promiseCon).query(sql, values);
        return result;
    },
    updateUser: async function updateUser(reqBody) {
        const created = formatDate(new Date());
        const encpassword = encryptPass(reqBody.password);
        const sql = `
        UPDATE users SET 
                        user_id= "${reqBody.user_id}",
                        name= "${reqBody.name}",
                        password= "${encpassword}",
                        gender= "${reqBody.gender}",
                        department= "${reqBody.department}",
                        mobile= "${reqBody.mobile}",
                        email= "${reqBody.email}",
                        position= "${reqBody.position}",
                        role= "${reqBody.role}", 
                        modified="${created}"
                WHERE user_id = "${reqBody.user_id}"; `;
        const result = await (promiseCon).query(sql);
        return result;
    },
    updateProfileUser: async function updateProfile(reqBody) {
        const created = formatDate(new Date());
        const sql = `
        UPDATE users SET 
                        name= "${reqBody.name}",
                        gender= "${reqBody.gender}",
                        department= "${reqBody.department}",
                        mobile= "${reqBody.mobile}",
                        email= "${reqBody.email}",
                        modified="${created}"
                WHERE user_id = "${reqBody.user_id}"; `;
        const result = await (promiseCon).query(sql);
        return result;
    },
    deleteUserbyId: async function deleteUserbyId(user_id) {
        // console.log(user_id)
        // console.log(formatDate (new Date()))
        const result = await (await promiseCon).query(`
        UPDATE users
        SET
            is_delete = true, 
            modified = "${formatDate(new Date())}"
        WHERE user_id = "${user_id}"`);
        // console.log(result[0], user_id)
        return result;


    },
    resetNewPassword: async function resetNewPassword(params) {
        const { user_id, password, confirm_password } = params;

        if (!user_id || !password || !confirm_password) {
            return {
                status: 400,
                message: 'Invalid request parameter',
                isSuccess: false,
            }
        }
        if (password !== confirm_password) {
            return {
                status: 400,
                message: 'Password & confirm password must be the same',
                isSuccess: false,
            }
        }

        try {
            const created = formatDate(new Date());
            const encpassword = encryptPass(password);
            const sql = `
                     UPDATE users SET password= "${encpassword}"
                WHERE user_id = "${user_id}"; `;
            const result = await promiseCon.query(sql);
            console.log(result);

            if (result[0].affectedRows == 1) {
                return {
                    status: 200,
                    message: 'Password has been reset',
                    isSuccess: true,
                }
            } else {
                return {
                    status: 200,
                    message: 'Failed to reset password',
                    isSuccess: false,
                }
            }
        } catch (err) {
            return {
                status: 400,
                message: 'Somthing went wrong',
                isSuccess: false,

            }
        }
    },


}

