const roomSchema = `
CREATE TABLE rooms(
	id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
	room_name VARCHAR(30) NOT NULL,
	room_type VARCHAR(100),
	is_delete BOOLEAN default 0,
	created DATETIME,
	modified DATETIME
	);
`;
exports.roomSchema = roomSchema;