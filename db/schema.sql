--- load with 
--- sqlite3 database.db < schema.sql

-- CREATE TABLE counter (
-- 	counterName VARCHAR(20) PRIMARY KEY,
-- 	counterValue INTEGER DEFAULT 0
-- );
CREATE TABLE users (
	username VARCHAR(20) PRIMARY KEY,
	password VARCHAR(20) NOT NULL,
	email VARCHAR(20) NOT NULL,
	score INTEGER DEFAULT 0,
	gender VARCHAR NOT NULL,
	Month VARCHAR(20) NULL, 
	Day VARCHAR(20) NOT NULL, 
	Year VARCHAR(20) NOT NULL,
	bio VARCHAR(40)
);