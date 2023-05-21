import axios from "axios";
import { URL } from "./api";


export default {
    async validateOtp(data) {
        try {
            return await axios.post(URL + '/validate-otp', data);
        }
        catch (err) {
            console.log(err)
            return err;
        }
    },

}