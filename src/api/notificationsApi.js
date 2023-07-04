import axios from "axios";
import { URL } from "./api";


export default {
    async getAllNotificationByUserId(id) {
        try {
            return await axios.get(URL + `/get-notifications/${id}`);
        }
        catch (err) {
            console.log(err)
            return err;
        }
    },
}