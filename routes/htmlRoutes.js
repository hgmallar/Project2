var db = require("../models");

module.exports = function(app) {
  // Load index page
  // app.get("/", function(req, res) {
  //   db.User.findAll({}).then(function(dbUsers) {
  //     res.render("index", {
  //       msg: "Welcome!",
  //       users: dbUsers
  //     });
  //   });
  // });

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

  // // Load example page and pass in an example by id
  // app.get("/user/:id", function(req, res) {
  //   db.User.findOne({ where: { id: req.params.id } }).then(function(dbUser) {
  //     res.render("example", {
  //       example: dbUser
  //     });
  //   });
  // });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
