var express = require("express");
var exphbs = require("express-handlebars");
var http = require("http");
var path = require("path");
var socketIO = require("socket.io");

var db = require("./models");

var app = express();
var server = http.Server(app);
var io = socketIO(server);
var PORT = process.env.PORT || 3000;

var playerCount = 0;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

// Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

// Routes
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

var syncOptions = { force: false };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}

// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(function() {
  server.listen(PORT, function() {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });
});

//Socket.io
var playerState = "wait";
var playerLetter = "O";
var players = {};
var playerNames = [];
var gameboard = ["", "", "", "", "", "", "", "", ""];

//user connected
io.on("connection", function(socket) {
  //a new player is detected, set the playerCount, add the player to the array of player names, set the state and assign the letter
  socket.on("new player", function(userName, wins, profilePic, profilePoke) {
    playerCount = io.engine.clientsCount;
    console.log("There are " + playerCount + " players logged in.");
    playerNames[playerCount - 1] = {
      name: userName,
      win: wins,
      profpic: profilePic,
      userpoke: profilePoke
    };
    if (playerCount === 1) {
      playerState = "turn";
      playerLetter = "X";
    } else {
      playerState = "wait";
      playerLetter = "O";
    }
    players[socket.id] = {
      name: userName,
      count: playerCount,
      state: playerState,
      letter: playerLetter,
      profpic: profilePic,
      userpoke: profilePoke
    };
    //tell the socket that the player has been added
    socket.emit("player assignments", players[socket.id]);
    if (playerCount === 2) {
      //if there are now 2 players, emit to all sockets that the game has begun
      gameboard = ["", "", "", "", "", "", "", "", ""];
      io.emit("game begins", playerNames);
    }
    if (playerCount > 2) {
      //if there are now more than 2 players, emit to all sockets that there is a game in play
      io.emit("game in play", gameboard, playerNames);
    }
  });

  //a movement has been detected on the gameboard
  socket.on("movement", function(data) {
    gameboard = data;
    //emit the movement to all sockets
    io.emit("state", data);
  });

  //a reset has been detected on the gameboard
  socket.on("reset", function(data) {
    gameboard = data;
    //emit the movement to all sockets
    //io.emit('state', data);
  });

  //force a disconnect when a player loses so they get bumped to the bottom of the queue
  socket.on("forceDisconnect", function() {
    socket.disconnect();
  });

  //a player has won, increase the amount of wins stored in the playerNames array
  socket.on("player won", function(playerWins) {
    for (var i = 0; i < playerNames.length; i++) {
      if (players[socket.id].name === playerNames[i].name) {
        playerNames[i].win = playerWins;
      }
    }
  });

  //a user has disconnected, delete them from the playerNames array, reset the playerCount
  socket.on("disconnect", function(data) {
    if (players[socket.id]) {
      var index;
      for (var i = 0; i < playerNames.length; i++) {
        if (players[socket.id].name === playerNames[i].name) {
          index = i;
        }
      }
      playerNames.splice(index, 1);
      if (playerCount != 0) {
        playerCount = io.engine.clientsCount;
      }
      console.log("user disconnected.  count is " + playerCount);
      //emit that a player has disconnected so that the game page can be reset as needed
      io.emit("disconnect", playerCount, playerNames);
      if (playerCount >= 2 && index < 2) {
        //if it was one of the players that disconnected, emit game begins because the game needs to be reset and restarted with the new array of players
        io.emit("game begins", playerNames);
      }
    }
  });
});

module.exports = app;
