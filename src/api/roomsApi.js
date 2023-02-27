import axios from "axios";
import { URL } from "./api";


export default {
    //room
    async getAllRooms() {
        try {
            return await axios.get(URL + '/room');
        }
        catch (err) {
            console.log(err)
            return err;
        }
    },
    async getFreeRoomToBook(data) {
        return await axios.post(URL + `/free_room_to_book`, data);
    },
    async getFreeSubRoomToBook(data) {
        return await axios.post(URL + `/free_sub_room_to_book`, data);
    },

    async getOneRoom(id) {
        return await axios.get(URL + `/room/${id}`);
    },
    async createNewRoom(data) {
        return await axios.post(URL + `/room`, data);
    },
    async updateRoom(data) {
        return await axios.put(URL + `/room`, data);
    },
    async deleteRoom(id) {
        return await axios.delete(URL + `/room/${id}`);
    },
    //sub rooms
    async getAllSubRooms() {
        try {
            return await axios.get(URL + '/subrooms');
        }
        catch (err) {
            console.log(err)
            return err;
        }
    },
    async getOneSubRoom(id) {
        return await axios.get(URL + `/subrooms/${id}`);
    },
    async createNewSubRoom(data) {
        return await axios.post(URL + `/subrooms`, data);
    },
    async updateSubRoom(data) {
        return await axios.put(URL + `/subrooms`, data);
    },
    async deleteSubRoom(id) {
        return await axios.delete(URL + `/subrooms/${id}`);
    },
}