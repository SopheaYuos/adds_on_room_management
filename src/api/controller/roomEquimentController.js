const promiseCon = require("../../config/promiseCon");
const formatDate = require("../../utils/formatDate");

module.exports = {
    getRoomEquimentById: async (id) => {
        if (!isNaN(id) && typeof +id === "number"){
            const sql = `
                SELECT re.*, e.id AS equipment_id, e.equipment_name, r.room_name, r.room_type,
                 r.image_url as room_image_url, sr.room_name AS sub_room_name FROM
				room_has_equipment re  JOIN equipment e ON re.equipment_id = e.id
				JOIN rooms r ON re.room_id = r.id
				LEFT JOIN sub_rooms sr ON re.sub_room_id = sr.id
		        WHERE r.is_delete = 0
				AND  re.room_id = ${id}; 
        `;
            const result = await (await promiseCon).query(sql);
            return result[0];
        }
        else{
            return 'Invalid id';
        }
        
    },
}
