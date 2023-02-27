import axios from "axios";
import { URL } from "./api";


export default {
    async getAllUsers() {
        try {
            return await axios.get(URL + '/users');
        }
        catch (err) {
            console.log(err)
            return err;
        }
    },
    async getOneUser(id) {
        return await axios.get(URL + `/users/${id}`);
    },
    async createNewUser(data) {
        return await axios.post(URL + `/users`, data);
    },
    async updateUser(data) {
        return await axios.put(URL + `/users`, data);
    },
    async deleteUser(id) {
        return await axios.delete(URL + `/users/${id}`);
    },

}