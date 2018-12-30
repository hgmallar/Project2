var socket = io();

var textMark;
var opponentMark;

var gameboard = [" ", " ", " ", " ", " ", " ", " ", " ", " "];

var playerName = "";
var playerNumber;
var playerState = "wait";
var playerWins = 0;
var playerLosses = 0;

var gameOn = false;
socket.on('game begins', function () {
    gameOn = true;
})

//updates the player's turn
function updateState() {
    if (playerState === "turn") {
        playerState = "wait";
    }
    else {
        playerState = "turn";
    }
}

//assign the playername and status
function assignPlayer() {
    $.ajax("/api/users/", {
        type: "GET"
    }).then(
        function (dbPlayer) {
            console.log("player is " + dbPlayer[0].username);
            playerName = dbPlayer[0].username;
            playerWins = dbPlayer[0].wins;
            playerLosses = dbPlayer[0].losses;
            socket.emit('new player', dbPlayer[0].username);
            socket.on('player assignments', function (data) {
                textMark = data.letter;
                playerState = data.state;
                playerNumber = data.count;
                if (textMark === "X") {
                    opponentMark = "O";
                }
                else {
                    opponentMark = "X";
                }
            });
        });
}

// reset the game after a win
function reset() {
    gameboard = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
    renderBoard(gameboard);
    if (playerNumber === 1) {
        playerState = "turn";
    }
    else {
        playerState = "wait";
    }
}

//if win, update the player wins column in the database
function win() {
    playerWins += 1;
    var playerStatus = {
        wins: playerWins
    }
    $.ajax("/api/users/" + playerName, {
        type: "PUT",
        data: playerStatus
    }).then(
        function () {
            console.log("updated wins " + playerName);
        });
}

//if lose, update the player losses column in the database
function loss() {
    playerLosses += 1;
    var playerStatus = {
        losses: playerLosses
    }
    $.ajax("/api/users/" + playerName, {
        type: "PUT",
        data: playerStatus
    }).then(
        function () {
            console.log("updated losses " + playerName);
        });
}

//render the board
function renderBoard(data) {
    $("#00").text(data[0]);
    $("#01").text(data[1]);
    $("#02").text(data[2]);
    $("#10").text(data[3]);
    $("#11").text(data[4]);
    $("#12").text(data[5]);
    $("#20").text(data[6]);
    $("#21").text(data[7]);
    $("#22").text(data[8]);
}

//check score
function checkWins() {
    if ((($("#00").text() === textMark) && ($("#01").text() === textMark) && ($("#02").text() === textMark)) ||
        (($("#10").text() === textMark) && ($("#11").text() === textMark) && ($("#12").text() === textMark)) ||
        (($("#20").text() === textMark) && ($("#21").text() === textMark) && ($("#22").text() === textMark)) ||
        (($("#00").text() === textMark) && ($("#11").text() === textMark) && ($("#22").text() === textMark)) ||
        (($("#02").text() === textMark) && ($("#11").text() === textMark) && ($("#20").text() === textMark)) ||
        (($("#00").text() === textMark) && ($("#10").text() === textMark) && ($("#20").text() === textMark)) ||
        (($("#01").text() === textMark) && ($("#11").text() === textMark) && ($("#21").text() === textMark)) ||
        (($("#02").text() === textMark) && ($("#12").text() === textMark) && ($("#22").text() === textMark))) {
        win();
        reset();
    }
    else if ((($("#00").text() === opponentMark) && ($("#01").text() === opponentMark) && ($("#02").text() === opponentMark)) ||
        (($("#10").text() === opponentMark) && ($("#11").text() === opponentMark) && ($("#12").text() === opponentMark)) ||
        (($("#20").text() === opponentMark) && ($("#21").text() === opponentMark) && ($("#22").text() === opponentMark)) ||
        (($("#00").text() === opponentMark) && ($("#11").text() === opponentMark) && ($("#22").text() === opponentMark)) ||
        (($("#02").text() === opponentMark) && ($("#11").text() === opponentMark) && ($("#20").text() === opponentMark)) ||
        (($("#00").text() === opponentMark) && ($("#10").text() === opponentMark) && ($("#20").text() === opponentMark)) ||
        (($("#01").text() === opponentMark) && ($("#11").text() === opponentMark) && ($("#21").text() === opponentMark)) ||
        (($("#02").text() === opponentMark) && ($("#12").text() === opponentMark) && ($("#22").text() === opponentMark))) {
        loss();
        reset();
    }
    else if (($("#00").text() !== " ") && ($("#01").text() !== " ") && ($("#02").text() !== " ") &&
        ($("#10").text() !== " ") && ($("#11").text() !== " ") && ($("#12").text() !== " ") &&
        ($("#20").text() !== " ") && ($("#21").text() !== " ") && ($("#22").text() !== " ")) {
        //check for full gameboard
        reset();
    }
}

//when a tile is clicked, check if it's a turn, updated the gameboard, render the board, and check for a win
function tileClick(arrayIndex) {
    if (gameOn && (playerState === "turn")) {
        gameboard[arrayIndex] = textMark;
        socket.emit('movement', gameboard);
    }
}

//When tile is clicked, assign and check for a win
$("#00").on("click", function (event) {
    if ($("#00").text() === " ") {
        tileClick(0);
    }
});
$("#01").on("click", function (event) {
    if ($("#01").text() === " ") {
        tileClick(1);
    }
});
$("#02").on("click", function (event) {
    if ($("#02").text() === " ") {
        tileClick(2);
    }
});
$("#10").on("click", function (event) {
    if ($("#10").text() === " ") {
        tileClick(3);
    }
});
$("#11").on("click", function (event) {
    if ($("#11").text() === " ") {
        tileClick(4);
    }
});
$("#12").on("click", function (event) {
    if ($("#12").text() === " ") {
        tileClick(5);
    }
});
$("#20").on("click", function (event) {
    if ($("#20").text() === " ") {
        tileClick(6);
    }
});
$("#21").on("click", function (event) {
    if ($("#21").text() === " ") {
        tileClick(7);
    }
});
$("#22").on("click", function (event) {
    if ($("#22").text() === " ") {
        tileClick(8);
    }
});

socket.on('state', function (data) {
    gameboard = data;
    renderBoard(data);
    updateState();
    checkWins();
});

socket.on('disconnect', function (data) {
    if(gameOn) {
        gameOn = false;
        playerNumber = 1;
        textMark = "X";
        opponentMark = "O";
        reset();
    }
});

assignPlayer();