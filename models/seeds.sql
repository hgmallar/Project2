USE tictacdb;

CREATE TABLE users
(
  id INT NOT NULL
  AUTO_INCREMENT,
  username VARCHAR
  (100) NOT NULL,
  password VARCHAR
  (100) NOT NULL,
  profileUrl VARCHAR
  (1000),
  userPokemon INTEGER
  (100),
  loggedOn BOOLEAN,
  wins INTEGER
  (100),
  losses INTEGER
  (200),
  createdAt datetime ,
  updatedAt datetime,
  PRIMARY KEY
  (id)
);

  INSERT INTO users
    (username, password, profileUrl, userPokemon, loggedOn, wins, losses, createdAt, updatedAt)
  VALUES
    ("hilary", "buzz", "https://i.imgur.com/u4qSjQL.jpg", 1, false, 19, 29, now(), now()),
    ("jon", "lightyear", "https://i.imgur.com/BBcy6Wc.jpg", 2, false, 20, 10, now(), now()),
    ("minnie", "mouse", "https://i.imgur.com/0cptOAb.jpg", 3, false, 100, 10, now(), now()),
    ("mouse", "car", "https://i.imgur.com/WkomVeG.jpg", 4, false, 300, 12, now(), now()),
    ("beth", "kitty", "https://i.imgur.com/fBeHsfk.jpg", 3, false, 190, 29, now(), now()),
    ("david", "rudy", "https://i.imgur.com/dnsY3cX.jpg", 2, false, 200, 10, now(), now()),
    ("trump", "loser", "https://i.imgur.com/YK6iaut.jpg", 3, false, 0, 200, now(), now());
