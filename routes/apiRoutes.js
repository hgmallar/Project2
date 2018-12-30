var db = require("../models");

module.exports = function (app) {
  // Get all examples
  app.get("/api/users", function (req, res) {
    db.User.findAll().then(function (dbUser) {
      res.json(dbUser);
    });
  });

  // Get most recent user
  app.get("/api/users/lastuser", function (req, res) {
    db.User.findAll({ limit: 1, order: [['updatedAt', 'DESC']] }).then(function (dbUser) {
      res.json(dbUser);
    });
  });

  // Adding a new user
  app.post("/api/users", function (req, res) {
    db.User.create(req.body).then(function (dbUser) {
      res.json(dbUser);
    });
  });

  // Pulling up user information
  app.get("/api/users/:id", function (req, res) {
    db.User.findOne({ where: { id: req.params.id } }).then(function (dbUser) {
      var username = req.username;
      var id = req.params.id;
      console.log(id);
      console.log(username);
      res.json(dbUser);
    });
  });

  // PUT route for incrementing a users wins or losses.
  app.put("/api/users/:username", function (req, res) {
    db.User.update(
      req.body,
      {
        where: { username: req.params.username }
      }).then(function (dbUser) {
        res.json(dbUser);
      });
  });

  // Delete an example by id
  // app.delete("/api/examples/:id", function(req, res) {
  //   db.Example.destroy({ where: { id: req.params.id } }).then(function(dbExample) {
  //     res.json(dbExample);
  //   });
  // });
};
