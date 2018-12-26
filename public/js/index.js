
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

$(document).ready(function() {

  //keeping the API object to save our calls
  var API = {
    addUser: function(newUser) {
      return $.ajax({
        type: "POST",
        url: "api/users/",
        data: newUser
      });
    }
  };
  
  //on clicking the user submit button
  $("#usr-submit").on("click", function() {
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

  //check users function
  function checkUsers(userData) {
    //pull data from database
    $.get("api/users/", function(dbData) {
      console.log("Running get:" + userData);

      

      for (i=0; i<=dbData.length; i++) {
        var currentUsername = dbData[i].username;
        var currentPassword = dbData[i].password;

        console.log(currentUsername);

        if (userData.username === currentUsername) {
          //check password and either allow user in or deny them
          if (userData.password === currentPassword) {
            console.log("Password is a match! Redirecting to game page");
            window.location.href = "/game";
            break;
          } else {
            console.log("Incorrect Password");
            break;
          };
        //  else {
        //   //create new user
        //   API.addUser(userData).then(function(data) {
        //     //add user to DB then send them to game page.
        //     console.log("Adding new user!");
        //     window.location.href = "/game";
        //   });
        // };
      
        };
      };
    });
  };
  
  //Load the Tic Tac Toe Animation
  for (var i = 1; i < totalFrames + 1; i++) {
    $('body').append(`<div id="preload-image-${i}" style="background-image: url('${imagePath}/TicTacToe-${i}.png');"></div>`);
  }

  $(window).on('load', () => {
    requestAnimationFrame(step);
  });
  
});

// keeping the example code for the time being for reference

// Get references to page elements
// var $exampleText = $("#example-text");
// var $exampleDescription = $("#example-description");
// var $submitBtn = $("#submit");
// var $exampleList = $("#example-list");

// // The API object contains methods for each kind of request we'll make
// var API = {
//   saveExample: function(example) {
//     return $.ajax({
//       headers: {
//         "Content-Type": "application/json"
//       },
//       type: "POST",
//       url: "api/examples",
//       data: JSON.stringify(example)
//     });
//   },
//   getExamples: function() {
//     return $.ajax({
//       url: "api/examples",
//       type: "GET"
//     });
//   },
//   deleteExample: function(id) {
//     return $.ajax({
//       url: "api/examples/" + id,
//       type: "DELETE"
//     });
//   }
// };

// // refreshExamples gets new examples from the db and repopulates the list
// var refreshExamples = function() {
//   API.getExamples().then(function(data) {
//     var $examples = data.map(function(example) {
//       var $a = $("<a>")
//         .text(example.text)
//         .attr("href", "/example/" + example.id);

//       var $li = $("<li>")
//         .attr({
//           class: "list-group-item",
//           "data-id": example.id
//         })
//         .append($a);

//       var $button = $("<button>")
//         .addClass("btn btn-danger float-right delete")
//         .text("ｘ");

//       $li.append($button);

//       return $li;
//     });

//     $exampleList.empty();
//     $exampleList.append($examples);
//   });
// };

// // handleFormSubmit is called whenever we submit a new example
// // Save the new example to the db and refresh the list
// var handleFormSubmit = function(event) {
//   event.preventDefault();

//   var example = {
//     text: $exampleText.val().trim(),
//     description: $exampleDescription.val().trim()
//   };

//   if (!(example.text && example.description)) {
//     alert("You must enter an example text and description!");
//     return;
//   }

//   API.saveExample(example).then(function() {
//     refreshExamples();
//   });

//   $exampleText.val("");
//   $exampleDescription.val("");
// };

// // handleDeleteBtnClick is called when an example's delete button is clicked
// // Remove the example from the db and refresh the list
// var handleDeleteBtnClick = function() {
//   var idToDelete = $(this)
//     .parent()
//     .attr("data-id");

//   API.deleteExample(idToDelete).then(function() {
//     refreshExamples();
//   });
// };

// // Add event listeners to the submit and delete buttons
// $submitBtn.on("click", handleFormSubmit);
// $exampleList.on("click", ".delete", handleDeleteBtnClick);



