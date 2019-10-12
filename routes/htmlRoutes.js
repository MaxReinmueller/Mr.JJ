var db = require("../models");

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    // db.Example.findAll({}).then(function(dbExamples) {
    res.render("index", {
      // msg: "Welcome!",
      // examples: dbExamples
    });
  });
  // });

  // Load example page and pass in an example by id
  app.get("/example/:id", function(req, res) {
    db.Example.findOne({ where: { id: req.params.id } }).then(function(
      dbExample
    ) {
      res.render("example", {
        example: dbExample
      });
    });
  });

  app.get("/user", function(req, res) {
    res.render("user", {});
  });

  app.get("/view_cards", function(req, res) {
    res.render("viewCards", {});
  });

  app.get("/create", function(req, res) {
    res.render("create", {});
  });

  app.get("/subjects", function(req, res) {
    res.render("subjects", {});
  });

  app.get("/upload", function(req, res) {
    res.render("upload", {});
  });

  app.get("/login", function(req, res) {
    res.render("login", {});
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
