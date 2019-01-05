var socket = io();

var textMark;
var opponentMark;

var gameboard = [" ", " ", " ", " ", " ", " ", " ", " ", " "];

var playerName = "";
var playerNumber;
var playerState = "wait";
var playerWins = 0;
var playerLosses = 0;
var $users13 = $('#users13');
var profilePic = "";

var player1 = "";
var wins1 = 0;
var player2 = "";
var wins2 = 0;
var profpic1 = "";
var profpic2 = "";

var gameOn = false;

//updates the player's turn, changes the states for players and resets the player name bubbles
function updateState() {
    if (playerState === "turn") {
        playerState = "wait";
    }
    else if (playerState === "wait") {
        playerState = "turn";
    }
    if ($("#koh-turn").text() !== "") {
        $("#koh-turn").text("");
        $("#chal-turn").text(player2);
        $("#chal-turn").css("background", "khaki");
        $("#koh-turn").css("background", "grey");

    }
    else if ($("#chal-turn").text() !== "") {
        $("#koh-turn").text(player1);
        $("#chal-turn").text("");
        $("#chal-turn").css("background", "grey");
        $("#koh-turn").css("background", "khaki");
    }
}

//assign the playername and states
function assignPlayer() {
    playerName = sessionStorage.getItem("username");
    playerWins = parseInt(sessionStorage.getItem("wins"));
    playerLosses = parseInt(sessionStorage.getItem("losses"));
    profilePic = sessionStorage.getItem("profilePic");
    //tell the socket a new player has been added
    socket.emit('new player', playerName, playerWins, profilePic);
    //when the players have been assigned by the server, update the marks and text on the screen
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
        if (playerNumber === 1) {
            $("#player1").text(playerName);
            $("#wins1").text("Wins: " + playerWins);
            $("#prof-pic1").attr("src", profilePic);
            playerState = "turn";
        }
        else if (playerNumber === 2) {
            $("#player2").text(playerName);
            $("#wins2").text("Wins: " + playerWins);
            $("#prof-pic2").attr("src", profilePic);
            playerState = "wait";
        }
        if (playerNumber > 2) {
            $(".modal-title").text("Game is already in session!");
            $(".modal-body").text("There are already two players logged in and playing the game. You are watching the game and will be able to play when a user logs out.");
            $("#myModal").modal("show");
            playerState = "hold";
            renderBoard(gameboard);
        }
    });
}

// reset the game after a win
function reset() {
    gameboard = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
    renderBoard(gameboard);

    $("#myModal").modal("hide");

    //let the socket know the gameboard has been reset
    socket.emit('movement', gameboard);
}

//if win, update the player wins column in the database, display a modal with the winner name, and update the wins text on the screen
function win() {
    if (playerState != "hold") {
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
        sessionStorage.setItem("wins", playerWins);
        socket.emit("player won", playerWins);
    }
    if (player1 === playerName) {
        wins1++;
        $(".modal-title").text(player1 + " wins!");
    }
    else if (player2 === playerName) {
        wins2++;
        $(".modal-title").text(player2 + " wins!");
    }
    else {
        //update the wins for the waiting cue
        if (textMark === "X") {
            $(".modal-title").text(player1 + " wins!");
            wins1++;
        }
        else {
            $(".modal-title").text(player2 + " wins!");
            wins2++;
        }
    }
    $("#wins1").text("Wins: " + wins1);
    $("#wins2").text("Wins: " + wins2);
    console.log("modal has changed");
    $(".modal-body").text("Preparing another game...");
}

//if lose, update the player losses column in the database, display a modal with the winner name, and update the wins text on the screen 
function loss() {
    if (player1 === playerName) {
        wins2++;
        $(".modal-title").text(player2 + " wins!");
    }
    else if (player2 === playerName) {
        wins1++;
        $(".modal-title").text(player1 + " wins!");
    }
    else {
        //update the wins for the waiting cue
        if (textMark === "O") {
            $(".modal-title").text(player1 + " wins!");
            wins1++;
        }
        else {
            $(".modal-title").text(player2 + " wins!");
            wins2++;
        }
    }
    $("#wins1").text("Wins: " + wins1)
    $("#wins2").text("Wins: " + wins2);
    console.log("modal has changed");
    $(".modal-body").text("Preparing another game...");
    if (playerState != "hold") {
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
        sessionStorage.setItem("losses", playerLosses);
        //refresh the browser of the loser, so they get knocked out and rebooted to the back of the queue
        //remove the reload if you don't want to do knockout anymore
        location.reload();
    }  
}

//render the board on the page
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

//check for wins, losses, and a full board
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
        $("#myModal").modal("show");
        setTimeout(reset, 5000);
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
        $("#myModal").modal("show");
        setTimeout(reset, 5000);
    }
    else if (($("#00").text() !== " ") && ($("#01").text() !== " ") && ($("#02").text() !== " ") &&
        ($("#10").text() !== " ") && ($("#11").text() !== " ") && ($("#12").text() !== " ") &&
        ($("#20").text() !== " ") && ($("#21").text() !== " ") && ($("#22").text() !== " ")) {
        //check for full gameboard
        $(".modal-title").text("Nobody won!");
        $(".modal-body").text("Preparing another game...");
        $("#myModal").modal("show");
        setTimeout(reset, 5000);
    }
}

//when a tile is clicked, check if it's a turn, updated the gameboard, and tell the socket a movement has happened
function tileClick(arrayIndex) {
    if (gameOn && (playerState === "turn")) {
        gameboard[arrayIndex] = textMark;
        socket.emit('movement', gameboard);
    }
}

//When tile is clicked, call tileClick
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

//when server says a game begins, assign players
socket.on('game begins', function (data) {
    gameOn = true;
    player1 = data[0].name;
    profpic1 = data[0].profpic;
    wins1 = data[0].win;
    player2 = data[1].name;
    profpic2 = data[1].profpic;
    wins2 = data[1].win;
    $("#koh-turn").text(player1);
    $("#chal-turn").text("");
    $("#player1").text(player1);
    $("#prof-pic1").attr("src", profpic1);
    $("#player2").text(player2);
    $("#wins1").text("Wins: " + wins1);
    $("#wins2").text("Wins: " + wins2);
    $("#prof-pic2").attr("src", profpic2);

    if (playerName === player1) {
        $(".modal-body").text("You are player1");
        playerNumber = 1;
        playerState = "turn";
        textMark = "X";
        opponentMark = "O";
    }
    else if (playerName === player2) {
        $(".modal-body").text("You are player2");
        playerNumber = 2;
        playerState = "wait";
        textMark = "O";
        opponentMark = "X";
    }
    if ((playerName === player1) || (playerName === player2)) {
        $(".modal-title").text("A new game session has begun!");
        $("#myModal").modal("show");
        setTimeout(reset, 5000);
    }
    else {
        reset();
    }
});

//when a game is in play, assign players, and add queue because there is now a player in the queue
socket.on('game in play', function (data, playerNames) {
    gameboard = data;
    renderBoard(data);

    $("#player1").text(playerNames[0].name);
    $("#player2").text(playerNames[1].name);
    $("#prof-pic1").attr("src", playerNames[0].profpic);
    $("#prof-pic2").attr("src", playerNames[1].profpic);
    player1 = playerNames[0].name;
    player2 = playerNames[1].name;
    wins1 = playerNames[0].win;
    wins2 = playerNames[1].win;
    $("#wins1").text(wins1);
    $("#wins2").text(wins2);
    
    var html = '';
    for (i = 2; i < playerNames.length; i++) {
        html += '<li class="list-group-item">' + playerNames[i].name + '</li>'
    }
    $users13.html(html);

});

//when a player has moved, get the gameboard, render the board, update the player state, and check for wins
socket.on('state', function (data) {
    gameboard = data;
    renderBoard(data);
    updateState();
    checkWins();
});

//when a player has disconnected 
socket.on('disconnect', function (data, playerNames) {
    if (gameOn && (data < 2)) {
        //if a game was in play and there is only 1 player connected now, reset the text on the screen. 
        gameOn = false;
        playerNumber = 1;
        textMark = "X";
        opponentMark = "O";
        reset();
        $("#koh-turn").text("");
        $("#chal-turn").text("");
        $("#player1").text(player1);
        playerState = "turn";
        $("#wins1").text("Wins: " + wins1)
        $("#player2").text("");
        $("#wins2").text("");
        socket.emit('movement', gameboard);
    }
    else if (data === 2) {
        //if there are only 2 players left, remove the queue
        $users13.html("<p></p>");
    }
    else if (data > 2) {
        //there are still more than 2 players, so reset the queue
        var html = '';
        for (i = 2; i < playerNames.length; i++) {
            html += '<li class="list-group-item">' + playerNames[i].name + '</li>'
        }
        $users13.html(html);
    }
});

//start by assigning the player
assignPlayer();