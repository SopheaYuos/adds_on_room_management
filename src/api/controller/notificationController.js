const promiseCon = require("../../config/promiseCon");

module.exports = {
    createNewNotification: async (reqBody) => {
        const { user_id, approver_id, booking_id } = req.body;

        try {
            const query = `
                    INSERT INTO notifications (user_id, approver_id, booking_id, is_read, created, modified)
                    VALUES (?, ?, ?, false, NOW(), NOW())
                    `;
            const values = [user_id, approver_id, booking_id];

            await pool.query(query, values);

            res.status(200).json({ success: true, message: 'Notification created successfully' });
        } catch (error) {
            console.error('Error creating notification:', error);
            res.status(500).json({ success: false, message: 'Failed to create notification' });
        }
    }
    // getNotificationsByUserId: async (id) => {
        
    // },
}
