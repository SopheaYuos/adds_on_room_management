const bookingSchema = `
CREATE TABLE booking(
	id INT PRIMARY KEY AUTO_INCREMENT NOT NULL ,
	start_date DATETIME NOT NULL,
	end_date DATETIME NOT NULL,
	room_id INT,
	sub_room_id INT,
	number_of_people INT NOT NULL,
    event_type VARCHAR(100),
	responsibler VARCHAR(30) NOT NULL,
	status VARCHAR(50) NOT NULL,
	is_cancel BOOLEAN NOT NULL default 0,
	description VARCHAR(100),
	took_key BOOLEAN NOT NULL default 0,
	return_key BOOLEAN NOT NULL default 0,
	is_delete BOOLEAN default 0,
	created DATETIME,
	modified DATETIME,
	FOREIGN KEY(room_id) REFERENCES rooms(id),
	FOREIGN KEY(sub_room_id) REFERENCES sub_rooms(id),
	FOREIGN KEY(responsibler) REFERENCES users(user_id)
);		
`;
exports.bookingSchema = bookingSchema;