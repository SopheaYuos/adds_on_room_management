const promiseCon = require("../../config/promiseCon");

module.exports = {
    createNewNotification: async (reqBody) => {
        const { user_id, booking_id, message } = reqBody;
        
        try {
            const query = `
                    INSERT INTO notifications (user_id, booking_id, message, is_read, created, modified)
                    VALUES (?, ?, ?, false, NOW(), NOW())
                    `;
            const values = [user_id, booking_id, message];

            const result = await promiseCon.query(query, values);
            return result;
        } catch (error) {
            console.error('Error creating notification:', error);
        }
    },
    getNotificationByUserId: async (user_id, notificationRowId = null) => {
        try {
            let query = `

                    SELECT n.*, r.room_name, r.image_url AS room_image_url,
                    sr.room_name AS sub_room_name, sr.image_url AS sub_room_image_url
                    FROM notifications n
                    JOIN booking b ON n.booking_id = b.id
                    JOIN rooms r ON b.room_id = r.id
                    LEFT JOIN sub_rooms sr ON b.sub_room_id = sr.id
                    WHERE n.user_id = '${user_id}'`;

            if (notificationRowId) {
                query += ` AND n.id = '${notificationRowId}'`;
            }
            query += ` ORDER BY n.id DESC`;

            const result = await promiseCon.query(query);
            return result[0];
        } catch (error) {
            // Handle error
        }
    }

    
    // getNotificationsByUserId: async (id) => {
        
    // },
}
