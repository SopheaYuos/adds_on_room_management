const notificationSchema = `
		CREATE TABLE notifications(
		id INT PRIMARY KEY AUTO_INCREMENT,
		user_id VARCHAR(30) NOT NULL,
		booking_id INT NOT NULL,
		message VARCHAR(255) NOT NULL,
		is_read BOOLEAN DEFAULT FALSE,
		created DATETIME,
		modified DATETIME,
		FOREIGN KEY(user_id) REFERENCES users(user_id),
		FOREIGN KEY(booking_id) REFERENCES booking(id)

	);
`;
exports.notificationSchema = notificationSchema;