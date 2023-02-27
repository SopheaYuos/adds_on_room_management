const subRoomSchema = `
CREATE TABLE sub_rooms(
	id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
	room_id INT,
	room_name VARCHAR(30) NOT NULL,
	is_delete BOOLEAN default 0,
	created DATETIME,
	modified DATETIME,
	FOREIGN KEY(room_id) REFERENCES rooms(id)
);
`;
exports.subRoomSchema = subRoomSchema;