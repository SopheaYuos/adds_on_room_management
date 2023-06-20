const promiseCon = require("../../config/promiseCon");
const formatDate = require("../../utils/formatDate");

module.exports = {
    getAllRooms: async () => {
        const sql = `SELECT r.id, r.room_name, r.room_type, r.image_url AS room_image_url,
        s.room_name AS sub_room_name, s.image_url AS sub_room_image_url FROM 
		rooms r LEFT JOIN sub_rooms s
	    ON r.id = s.room_id
        WHERE r.is_delete = 0
        ORDER BY r.room_name;
        `;
        const result = await (await promiseCon).query(sql);
        return result[0];
    },
    getRoomById: async (id) => {
        const sql = `select * from rooms where id = ${id}`
        const result = await (await promiseCon).query(sql);
        return result[0];
    },
    getAllsubrooms: async () => {
        const sql = `select *from sub_rooms`;
        const result = await (await promiseCon).query(sql);
        return result[0];

    },
    getSubroomById: async (id) => {
        const sql = `select * from sub_rooms where id =${id}`
        const result = await (await promiseCon).query(sql);
        return result[0];
    },
    createSubroom: async function(reqBody) {
        const created = formatDate(new Date()); //generate current date
        const sql = `
            INSERT INTO sub_rooms(room_id, room_name,created, modified)
                        values(${reqBody.room_id}, "${reqBody.room_name}", "${created}","${created}")`;
        const result = await (await promiseCon).query(sql);
        return result;
    },
    createRoom: async function insertNew(reqBody) {
        const created = formatDate(new Date()); //generate current date;
        const {room_name, room_type, image_url = null, has_sub_room = false, sub_room_name} = reqBody;

        const sql = `
                        INSERT INTO rooms(room_name,room_type, image_url, created, modified)
                        values(?, ?, ?, ?,?)`;
        const values = [room_name, room_type, image_url, created,created];
        
        const result = await (await promiseCon).query(sql, values);
        if (has_sub_room) {
            await Promise.all(sub_room_name.map(async (subroom) => {
                const obj = {
                    room_id: result[0].insertId,
                    room_name: subroom
                };
                await module.exports.createSubroom(obj);
            })); 
        }
        return result;
    },
    updateRoomV2: async function updateRoomV2(reqBody){
    const updated = formatDate(new Date()); // generate current date;
    const { room_id, room_name, room_type, image_url = null, has_sub_room = false, sub_room_name } = reqBody;

    const sql = `
    UPDATE rooms
    SET room_name = ?, room_type = ?, image_url = ?, modified = ?
        WHERE id = ? `;
    const values = [room_name, room_type, image_url, updated, room_id];

    const result = await (await promiseCon).query(sql, values);

    if (has_sub_room) {
        // Delete existing subrooms related to the room
        const deleteSql = `
            DELETE FROM sub_rooms
            WHERE room_id = ? `;
        const deleteValues = [room_id];

        await (await promiseCon).query(deleteSql, deleteValues);

        // Create new subrooms
        await Promise.all(sub_room_name.map(async (subroom) => {
            const obj = {
                room_id,
                room_name: subroom
            };
            await module.exports.createSubroom(obj);
        }));
    }

return result;
    },
    updateRoom: async function updateRoom(reqBody) {
        const created = formatDate(new Date()); //generate current date
        // console.log(reqBody.start_date)
        const sql = `
            UPDATE  rooms SET
                            room_name= "${reqBody.room_name}",
                            room_type = "${reqBody.room_type}",
                            is_delete = "${reqBody.is_delete}",
                            modified = "${created}"
                    WHERE id = ${reqBody.id}; `;
        const result = await (await promiseCon).query(sql);
        return result;
    },
    updateSubroom: async function updateSubroom(reqBody) {
        const created = formatDate(new Date()); //generate current date
        // console.log(reqBody.start_date)
        const sql = `
            UPDATE  sub_rooms SET
                            room_name= "${reqBody.room_name}",
                            modified = "${created}"
                    WHERE id = ${reqBody.id}; `;
        const result = await (await promiseCon).query(sql);
        return result;
    },
    updateRoom: async function updateRoom(reqBody) {
        const created = formatDate(new Date()); //generate current date
        // console.log(reqBody.start_date)
        const sql = `
            UPDATE  rooms SET
                            room_name= "${reqBody.room_name}",
                            room_type = "${reqBody.room_type}",
                            modified = "${created}"
                    WHERE id = ${reqBody.id}; `;
        const result = await (await promiseCon).query(sql);
        return result;
    },
    deleteRoomById: async function deleteRoomById(id) {
        const result = await (await promiseCon).query(`
            UPDATE  rooms
            SET 
                is_delete = true,
                modified = "${formatDate(new Date())}"    
            WHERE id = ${id}`);

        return result;
    },
    deleteSubroomById: async function deleteSubroomById(id) {
        const result = await (await promiseCon).query(`
            UPDATE  sub_rooms
            SET 
                is_delete = true,
                modified = "${formatDate(new Date())}"    
            WHERE id = ${id}`);

        return result;
    }
}
