const roomHasEquipmentSchema = `
CREATE TABLE room_has_equipment(
	id INT PRIMARY KEY AUTO_INCREMENT NOT NULL ,
	room_id INT NOT NULL,
	sub_room_id INT DEFAULT NULL,
	equipment_id INT NOT NULL,
    quantity_in_room INT NOT NULL,
	created DATETIME,
	modified DATETIME,
    FOREIGN KEY(equipment_id) REFERENCES equipment(id),
    FOREIGN KEY(sub_room_id) REFERENCES sub_rooms(id),
    FOREIGN KEY(room_id) REFERENCES rooms(id)
);		
`;
exports.roomHasEquipmentSchema = roomHasEquipmentSchema;