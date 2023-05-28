const promiseCon = require("../../config/promiseCon");
const formatDate = require("../../utils/formatDate");


module.exports = {
    addNewBooking: async function insertNew(reqBody) {
        const created = formatDate(new Date()) //generate current date
        const sql = `
        INSERT INTO booking(start_date, end_date, room_id, sub_room_id, number_of_people,event_type,responsibler, status, description, created, modified)
                    values("${reqBody.start_date}", "${reqBody.end_date}", ${reqBody.room_id}, ${reqBody.sub_room_id}, ${reqBody.number_of_people}, "${reqBody.event_type}", "${reqBody.responsibler}", "${reqBody.status}"," ${reqBody.description}", "${created}", "${created}")`;
        console.log(sql, "sql")
        const result = await (await promiseCon).query(sql);
        return result;
    },
    updateBooking: async function updateBooking(reqBody) {
        const created = formatDate(new Date()); //generate current date
        console.log(reqBody.start_date)
        const sql = `
        UPDATE  booking SET
                        start_date = "${reqBody.start_date}",
                        end_date = "${reqBody.end_date}",
                        room_id = ${reqBody.room_id},
                        sub_room_id = ${reqBody.sub_room_id},
                        number_of_people = ${reqBody.number_of_people},
                        event_type = "${reqBody.event_type}",
                        responsibler = "${reqBody.responsibler}",
                        status = "${reqBody.status}", 
                        is_cancel = ${reqBody.is_cancel},
                        took_key = ${reqBody.took_key},
                        return_key = ${reqBody.return_key},
                        is_delete = ${reqBody.is_delete},
                        description = "${reqBody.description}",
                        modified = "${created}"
                WHERE id = ${reqBody.id}; `;
        const result = await (await promiseCon).query(sql);
        return result;
    },
    getAllBooking: async function readBooking() {
        const result = await (await promiseCon).query(' SELECT * FROM booking where is_delete = false');
        const getFT = await getForeignTables(result);
        return getFT[0];
    },
    getFreeRoomToBook: async function getFreeRoomToBook(body) {
        console.log(body)
        const result = await (await promiseCon).query(
            `
            SELECT tb1.id, tb1.room_name, tb1.room_type, tb1.image_url as room_image_url,
            CASE WHEN tb2.status IS NULL THEN true 
            ELSE false
            END AS 'is_free' 
            FROM 
                    (SELECT r.id, r.room_name, r.room_type,  r.image_url FROM  rooms r
                    LEFT JOIN sub_rooms s
                    ON r.id = s.room_id
                    WHERE s.id IS NULL AND r.is_delete = FALSE
                    ORDER BY r.room_name ASC) 
                    as tb1
                LEFT  JOIN 
                    (SELECT b.start_date, b.end_date,b.room_id, b.status FROM booking b  JOIN rooms r
                    WHERE 
                        r.id = b.room_id AND 
                        b.start_date ='${body.start_date}' AND 
                        b.end_date ='${body.end_date}' AND 
                        b.status = "Approved" AND
                        b.is_delete = FALSE) 
                        as tb2
                    ON  tb1.id = tb2.room_id;
                    `);
        return result[0];
    },
    getFreeSubRoomToBook: async function getFreeRoomToBook(body) {
        console.log(body)
        const result = await (await promiseCon).query(
            `
             SELECT B.*,
                CASE WHEN A.sub_room_id IS NULL THEN true
                ELSE false
                END AS 'is_free'
            FROM (

                    SELECT b.sub_room_id, b.status FROM  booking b JOIN  sub_rooms s
                                where
                                    b.room_id = s.room_id AND
                                    b.sub_room_id = s.id AND
                                    b.status = "Approved" AND
                                    b.start_date >= '${body.start_date}' AND 
                                    b.end_date <= '${body.end_date}' AND 
                                    b.is_delete = FALSE)
                    AS A
                    RIGHT  JOIN (SELECT s.id, s.room_id, r.room_name AS room, s.room_name AS sub_room, r.room_type, r.image_url AS room_image_url, s.image_url AS sub_room_image_url FROM  rooms r
                                JOIN sub_rooms s
                                    ON r.id = s.room_id
                                    WHERE r.is_delete = FALSE
                                    ) AS B
            ON A.sub_room_id = B.id
            ORDER BY B.room_id, B.sub_room;
            `);
        return result[0];
    },
    updateStatus: async function updateStatus(reqBody) {
        const created = formatDate(new Date());
        console.log(reqBody.start_date)
        const sql = `
        UPDATE  booking SET
                        status = "${reqBody.status}"
                WHERE id = ${reqBody.id}; `;
        const result = await (await promiseCon).query(sql);
        return result;
    },
    getBookingById: async function getOneBooking(id) {
        const result = await (await promiseCon).query(`SELECT * FROM booking where id = ${id} `);
        const getFT = await getForeignTables(result);
        return getFT[0];
    },
    deleteBookingById: async function deleteOnceBooking(id) {
        const result = await (await promiseCon).query(`
        UPDATE  booking
        SET 
            is_delete = true,
            modified = "${formatDate(new Date())}"    
        WHERE id = ${id}`);

        return result;
    },
    allBookedOneUser: async (id) => {
        const result = await (await promiseCon).query(
            `        
            SELECT b.* FROM booking b JOIN users u
            ON b.responsibler = u.user_id
            WHERE b.responsibler ="${id}"
            AND u.is_delete = FALSE AND b.is_delete = FALSE ;
             `);
        const res = await getForeignTables(result);
        return res[0]
    },
}
async function getForeignTables(result) {
    for (let i = 0; i < result[0].length; i++) {
        //get user id;
        const userId = result[0][i].responsibler;
        const roomId = result[0][i].room_id;
        const subRoomId = result[0][i].sub_room_id;
        const getResponsbiler = await (await promiseCon).query(` select * from users where user_id = '${userId}'`);
        const room = await (await promiseCon).query(` select * from rooms where id = '${roomId}'`);
        const subRoom = await (await promiseCon).query(` select * from sub_rooms where id = '${subRoomId}'`);
        //get subrooms and rooms
        result[0][i].responsibler = getResponsbiler[0][0];
        result[0][i].room_id = room[0][0];
        result[0][i].sub_room_id = subRoom[0][0] || null;


    }
    return result;
}