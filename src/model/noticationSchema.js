const roomSchema = `
CREATE TABLE notifications(
	id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
	user_id VARCHAR(30) NOT NULL,
	approver_id VARCHAR(100),
	booking_id varchar(30) default 0,
	created DATETIME,
	modified DATETIME,
    FOREIG KEY SUB ROOMS
	);
`;
exports.roomSchema = roomSchema;