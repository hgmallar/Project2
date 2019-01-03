//keeping the API object to save our calls
var API = {
  addUser: function (newUser) {
    return $.ajax({
      type: "POST",
      url: "api/users/",
      data: newUser
    });
  }
};

//TicTacToeAnimation
const $element = $('.tictactoe-animation');
const imagePath = '/images';
const totalFrames = 9;
const animationDuration = 3000;
const timePerFrame = animationDuration / totalFrames;
let timeWhenLastUpdate;
let timeFromLastUpdate;
let frameNumber = 1;

function step(startTime) {
  if (!timeWhenLastUpdate) timeWhenLastUpdate = startTime;

  timeFromLastUpdate = startTime - timeWhenLastUpdate;

  if (timeFromLastUpdate > timePerFrame) {
    $element.attr('src', imagePath + `/TicTacToe-${frameNumber}.png`);
    timeWhenLastUpdate = startTime;

    if (frameNumber >= totalFrames) {
      frameNumber = 1;
    } else {
      frameNumber = frameNumber + 1;
    }
  }

  requestAnimationFrame(step);
}

//check users function
function checkUsers(userData) {

  //pull data from database
  $.get("api/users/", function (dbData) {
    console.log("Running get:" + userData);

    $("#modal-text").text("That username does not exist. Please make a new account!");

    for (i = 0; i < dbData.length; i++) {
      var currentUsername = dbData[i].username;
      var currentPassword = dbData[i].password;
      if (userData.username === currentUsername) {
        //check password and either allow user in or deny them
        if (userData.password === currentPassword) {
          //if password match, update the logOn
          sessionStorage.setItem("username", userData.username);
          sessionStorage.setItem("wins", dbData[i].wins);
          sessionStorage.setItem("losses", dbData[i].losses);
          console.log("Password is a match! Redirecting to game page");
          $(".modal-title").text("Logging in...");
          $("#modal-text").text("You're logged in! Redirecting to game page!");
          var playerStatus = {
            loggedOn: true
          }
          $.ajax("/api/users/" + userData.username, {
            type: "PUT",
            data: playerStatus
          }).then(
            function () {
              console.log("updated loggedOn " + userData.username);
            });

            setTimeout(function() {
              window.location.href = "/game";
            }, 5000);
        } else {
            $("#modal-text").text("Password is incorrect.");
            $(".modal").modal("show");
            return;
        }
      }
    };

    $(".modal").modal("show");
  });
};

function createUser(newUser) {
  //check to see if username is already taken

  $.get("api/users/", function (dbData) {
    var usernameExists = false;

    for (i = 0; i < dbData.length; i++) {
      var currentUsername = dbData[i].username;

      if (newUser.username === currentUsername) {
        $("#modal-text").text("Username already taken!");
        $(".modal").modal("show");
        usernameExists = true;
      };
    };

    if (!usernameExists) {
      API.addUser(newUser).then(function (data) {
        $(".modal-title").text("Welcome!");
        $("#modal-text").text("Your account is created! Logging you in...");
        $(".modal").modal("show");
        
        sessionStorage.setItem("username", newUser.username);
        sessionStorage.setItem("wins", newUser.wins);
        sessionStorage.setItem("losses", newUser.losses);

        setTimeout(function() {
          window.location.href = "/game";
        }, 5000);
      });
    };
  });
};


$(document).ready(function () {

  //on clicking the user submit button
  $("#usr-submit").on("click", function (event) {

    event.preventDefault();

    //pull user data
    var userData = {
      username: $("#username-input").val().trim(),
      password: $("#password-input").val().trim(),
      loggedOn: true
    };

    console.log("After hitting submit: " + userData);

    //run function to check users
    checkUsers(userData);
  });

  //on signup as a new user
  $("#new-usr-submit").on("click", function (event) {
    event.preventDefault();

    var newUser = {
      username: $("#new-username-input").val().trim(),
      password: $("#new-password-input").val().trim(),
      wins: 0,
      losses: 0,
      loggedOn: true
    };

    createUser(newUser);
  });

  $("#first-time").on("click", function (event) {
    $("#newuser").show();
    $("#login").hide();
  });
  $("#already").on("click", function (event) {
    $("#newuser").hide();
    $("#login").show();
  });

  //Load the Tic Tac Toe Animation
  for (var i = 1; i < totalFrames + 1; i++) {
    $('body').append(`<div id="preload-image-${i}" style="background-image: url('${imagePath}/TicTacToe-${i}.png');"></div>`);
  }
});

$(window).on('load', () => {
  requestAnimationFrame(step);
});




