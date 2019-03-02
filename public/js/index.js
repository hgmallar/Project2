//API object to add a user
var API = {
  addUser: function(newUser) {
    return $.ajax({
      type: "POST",
      url: "api/users/",
      data: newUser
    });
  }
};

//TicTacToeAnimation
const $element = $(".tictactoe-animation");
const imagePath = "/images";
const totalFrames = 9;
const animationDuration = 3000;
const timePerFrame = animationDuration / totalFrames;
let timeWhenLastUpdate;
let timeFromLastUpdate;
let frameNumber = 1;

//callback function for requestAnimationFrame
function step(startTime) {
  if (!timeWhenLastUpdate) timeWhenLastUpdate = startTime;

  timeFromLastUpdate = startTime - timeWhenLastUpdate;

  if (timeFromLastUpdate > timePerFrame) {
    $element.attr("src", imagePath + `/TicTacToe-${frameNumber}.png`);
    timeWhenLastUpdate = startTime;

    if (frameNumber >= totalFrames) {
      frameNumber = 1;
    } else {
      frameNumber = frameNumber + 1;
    }
  }

  requestAnimationFrame(step);
}

//check if user already exists, and if so, check that the password is correct
function checkUsers(userData) {
  //pull data from database
  $.get("api/users/", function(dbData) {
    console.log("Running get:" + userData);

    $("#modal-text").text(
      "That username does not exist. Please make a new account!"
    );

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
          sessionStorage.setItem("profilePic", dbData[i].profileUrl);
          sessionStorage.setItem("profilePoke", dbData[i].userPokemon);

          console.log(dbData[i].profileUrl);

          console.log("Password is a match! Redirecting to game page");
          $(".modal-title").text("Logging in...");
          $("#modal-text").text("You're logged in! Redirecting to game page!");
          var playerStatus = {
            loggedOn: true
          };
          $.ajax("/api/users/" + userData.username, {
            type: "PUT",
            data: playerStatus
          }).then(function() {
            console.log("updated loggedOn " + userData.username);
          });

          setTimeout(function() {
            window.location.href = "/game";
          }, 3000);
        } else {
          $("#modal-text").text("Password is incorrect.");
          $(".modal").modal("show");
          return;
        }
      }
    }

    $(".modal").modal("show");
  });
}

//create a new user, as long as the username does not already exist
function createUser(newUser) {
  //check to see if username is already taken

  $.get("api/users/", function(dbData) {
    var usernameExists = false;

    for (i = 0; i < dbData.length; i++) {
      var currentUsername = dbData[i].username;

      if (newUser.username === currentUsername) {
        $("#modal-text").text("Username already taken!");
        $(".modal").modal("show");
        usernameExists = true;
      }
    }

    if (!usernameExists) {
      API.addUser(newUser).then(function(data) {
        $(".modal-title").text("Welcome!");
        $("#modal-text").text("Your account is created! Logging you in...");
        $(".modal").modal("show");

        sessionStorage.setItem("username", newUser.username);
        sessionStorage.setItem("wins", newUser.wins);
        sessionStorage.setItem("losses", newUser.losses);
        sessionStorage.setItem("profilePic", newUser.imageUrl);
        sessionStorage.setItem("profilePoke", newUser.userPokemon);

        setTimeout(function() {
          window.location.href = "/game";
        }, 3000);
      });
    }
  });
}

$(document).ready(function() {
  //on clicking the user submit button, check the user
  $("#usr-submit").on("click", function(event) {
    event.preventDefault();

    //pull user data
    var userData = {
      username: $("#username-input")
        .val()
        .trim(),
      password: $("#password-input")
        .val()
        .trim(),
      loggedOn: true
    };

    console.log("After hitting submit: " + userData);

    //run function to check users
    checkUsers(userData);

    $("#username-input").val("");
    $("#password-input").val("");
  });

  //on signup as a new user, create a user
  $("#new-usr-submit").on("click", function(event) {
    event.preventDefault();

    var newUser = {
      username: $("#new-username-input")
        .val()
        .trim(),
      password: $("#new-password-input")
        .val()
        .trim(),
      profileUrl: $("#user-pic")
        .val()
        .trim(),
      userPokemon: $("input[name=radAnswer]:checked").val(),
      wins: 0,
      losses: 0,
      loggedOn: true
    };
    createUser(newUser);

    $("#new-username-input").val("");
    $("#new-password-input").val("");
    $("#user-pic").val("");
  });

  //if first time user link is clicked, show the first time user form, and hide the login form
  $("#first-time").on("click", function(event) {
    $("#newuser").show();
    $("#login").hide();
  });
  // if already logged in link is clicked, show the login form, and hide the new user login form
  $("#already").on("click", function(event) {
    $("#newuser").hide();
    $("#login").show();
  });
});

//start the animation
requestAnimationFrame(step);
