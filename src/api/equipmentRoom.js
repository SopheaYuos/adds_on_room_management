import axios from "axios";
import { URL } from "./api";


export default {
    async getRoomEquipmentById(id) {
        try {
            return await axios.get(URL + '/room/view-equipment/'+id);
        }
        catch (err) {
            return err;
        }
    }
}