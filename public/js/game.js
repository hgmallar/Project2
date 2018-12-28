var textMark = "X";
var opponentMark = "O";

var availableSpots = ["00", "01", "02", "10", "11", "12", "20", "21", "22"];

var playerName = "";
var playerWins = 0;
var playerLosses = 0;

function switchUser() {
    var randomIndex = Math.floor(Math.random() * Math.floor(availableSpots.length - 1));
    var idToUpdate = "#" + availableSpots[randomIndex];
    $(idToUpdate).text(opponentMark);
    availableSpots.splice(randomIndex,1);
}

function assignPlayer() {
    $.ajax("/api/users/", {
        type: "GET"
    }).then(
        function (dbPlayer) {
            console.log("player is " + dbPlayer[0].username);
            playerName = dbPlayer[0].username;
            playerWins = dbPlayer[0].wins;
            playerLosses = dbPlayer[0].losses;
        });
}

function reset() {
    $(".tic-box").text("C");
}

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
    }
    else if (($("#00").text() !== "C") && ($("#01").text() !== "C") && ($("#02").text() !== "C") &&
        ($("#10").text() !== "C") && ($("#11").text() !== "C") && ($("#12").text() !== "C") &&
        ($("#20").text() !== "C") && ($("#21").text() !== "C") && ($("#22").text() !== "C")) {
        //check for full gameboard
        reset();
    }
    else {
        //if no winner and game not over, switch turns
        switchUser();
    }
}

//When tile is clicked, assign and check for a win
$("#00").on("click", function (event) {
    //if a username has been entered, add the message to the database
    $("#00").text(textMark);
    availableSpots.splice(availableSpots.indexOf("00"),1);
    checkWins();
});
$("#01").on("click", function (event) {
    //if a username has been entered, add the message to the database
    $("#01").text(textMark);
    availableSpots.splice(availableSpots.indexOf("01"),1);
    checkWins();
});
$("#02").on("click", function (event) {
    //if a username has been entered, add the message to the database
    $("#02").text(textMark);
    availableSpots.splice(availableSpots.indexOf("02"),1);
    checkWins();
});
$("#10").on("click", function (event) {
    //if a username has been entered, add the message to the database
    $("#10").text(textMark);
    availableSpots.splice(availableSpots.indexOf("10"),1);
    checkWins();
});
$("#11").on("click", function (event) {
    //if a username has been entered, add the message to the database
    $("#11").text(textMark);
    availableSpots.splice(availableSpots.indexOf("11"),1);
    checkWins();
});
$("#12").on("click", function (event) {
    //if a username has been entered, add the message to the database
    $("#12").text(textMark);
    availableSpots.splice(availableSpots.indexOf("12"),1);
    checkWins();
});
$("#20").on("click", function (event) {
    //if a username has been entered, add the message to the database
    $("#20").text(textMark);
    availableSpots.splice(availableSpots.indexOf("20"),1);
    checkWins();
});
$("#21").on("click", function (event) {
    //if a username has been entered, add the message to the database
    $("#21").text(textMark);
    availableSpots.splice(availableSpots.indexOf("21"),1);
    checkWins();
});
$("#22").on("click", function (event) {
    //if a username has been entered, add the message to the database
    $("#22").text(textMark);
    availableSpots.splice(availableSpots.indexOf("22"),1);
    checkWins();
});

assignPlayer();