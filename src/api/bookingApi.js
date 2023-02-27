import axios from "axios";
import { URL } from "./api";


export default {
    async getAllBooking() {
        try {
            return await axios.get(URL + '/book');
        }
        catch (err) {
            console.log(err)
            return err;
        }
    },
    async getOneBooking(id) {
        return await axios.get(URL + `/book/${id}`);
    },
    async createNewBooking(data) {
        return await axios.post(URL + `/book`, data);
    },
    async updateBooking(data) {
        return await axios.put(URL + `/book`, data);
    },
    async deleteBooking(id) {
        return await axios.delete(URL + `/book/${id}`);
    },
    async updateStatus(data) {
        return await axios.put(URL + `/book/status`, data);
    },

}