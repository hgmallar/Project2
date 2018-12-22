USE tictacdb; 

CREATE TABLE users (
  id INT NOT NULL AUTO_INCREMENT,
  username VARCHAR(100) NOT NULL,
  password VARCHAR(100) NOT NULL,
  loggedOn BOOLEAN,
  wins INTEGER(100),
  losses INTEGER(200),
  createdAt datetime ,
  updatedAt datetime,
  PRIMARY KEY (id)
);

INSERT INTO users (username, password, loggedOn, wins, losses, createdAt, updatedAt)
VALUES ("hilary", "buzz", false, 19, 29, now(), now()), ("jon", "lightyear", false, 20, 10, now(), now()), ("minnie", "mouse", false, 100, 10, now(), now()), ("mouse", "car", false, 300, 12, now(), now()), ("beth", "kitty", false, 190, 29, now(), now()), ("david", "rudy", false, 200, 10, now(), now());
