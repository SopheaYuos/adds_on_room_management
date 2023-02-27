const promiseCon = require("../../config/promiseCon");
const formatDate = require("../../utils/formatDate");
const { encryptPass, decryptPass } = require("../../utils/encryptDecrypt");

module.exports = {
    getAllUsers: async function getUsers() {

        const sql = `SELECT * FROM users `;
        const result = await (await promiseCon).query(sql)
        return result[0];

    },
    getUserbyID: async function getUserbyID(user_id) {
        const sql = `select * from users where user_id = '${user_id}'`
        const result = await (await promiseCon).query(sql);
        return result[0];
    },
    AddUser: async function addnew(reqBody) {
        const created = formatDate(new Date());
        const encpassword = encryptPass(reqBody.password);
        const decpasword = decryptPass(encpassword, reqBody.password);
        console.log(encpassword);
        console.log(decpasword);
        const sql = `
        INSERT INTO users (user_id,name,password,gender,department,mobile,email,position, role,created,modified)
            values ("${reqBody.user_id}","${reqBody.name}", "${encpassword}", "${reqBody.gender}", "${reqBody.department}","${reqBody.mobile}", "${reqBody.email}", "${reqBody.position}", "${reqBody.role}",  "${created}","${created}" )
        `;
        const result = await (await promiseCon).query(sql);
        return result;

    },
    updateUser: async function updateUser(reqBody) {
        const created = formatDate(new Date());
        const encpassword = encryptPass(reqBody.password);
        // const decpassword= decryptPass(encpassword, reqBody.password);
        //  console.log(encpassword)
        // console.log(decpassword)
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


    }


}

