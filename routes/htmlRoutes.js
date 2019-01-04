var db = require("../models");

module.exports = function(app) {

  //When rendering the frontpage, get the top 5 leaders from the database and send the info to chart.js
  app.get("/", function(req, res) {
    db.User.findAll({limit: 5, order: [['wins', 'DESC']]}).then(function(dbUsers) {
      var data=[];
      var leaders = [];
      for(i=0; i<dbUsers.length; i++) {
        data.push(parseInt(dbUsers[i].wins));
        leaders.push(dbUsers[i].username.toString());
      }
      res.render("index", {
        data: data,
        leaders: leaders
      });
    });
  });

  app.get("/game", function(req, res) {
    res.render("game", {  
    });
  });

  app.get("/newuser", function(req, res) {
    res.render("newuser", {  
    });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
