import axios from "axios";
import { URL } from "./api";


export default {
    async sendMail(data) {
        try {
            return await axios.post(URL + '/sendmail', data);
        }
        catch (err) {
            console.log(err)
            return err;
        }
    },

}