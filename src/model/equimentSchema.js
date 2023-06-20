const equipmentSchema = `
CREATE TABLE equipment(
	id INT PRIMARY KEY AUTO_INCREMENT NOT NULL ,
	equipment_name varchar(100) NOT NULL,
    quantity INT NOT NULL,
	created DATETIME,
	modified DATETIME
);		
`;
exports.equipmentSchema = equipmentSchema;