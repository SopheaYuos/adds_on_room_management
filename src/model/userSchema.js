const userSchema = `
CREATE TABLE users(
	user_id VARCHAR(30) NOT NULL,
	name VARCHAR(100) NOT NULL,
	password VARCHAR(255) NOT NULL ,
	gender VARCHAR(10),
	department VARCHAR(50), 
	mobile VARCHAR(20) NOT NULL,
	email VARCHAR(30),
	position VARCHAR(30),
	role VARCHAR(20),
	is_delete BOOLEAN default 0,
	created DATETIME,
	modified DATETIME,
	PRIMARY KEY (user_id)
);
`;

exports.userSchema = userSchema;