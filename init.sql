postCREATE DATABASE IF NOT EXISTS jhan;

USE jhan;

CREATE TABLE IF NOT EXISTS post (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(125),
    name VARCHAR(25),
    text varchar(2048) NOT NULL,
    img VARCHAR(125),
    upload TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS comment (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(25),
    text varchar(2048) NOT NULL,
    img VARCHAR(125),
    op INT,
    upload TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (op)
        REFERENCES post(id)
        ON DELETE CASCADE
);
