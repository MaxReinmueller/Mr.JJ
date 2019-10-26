var db = require("../models");
// var formidable = require("formidable");
module.exports = function(app) {
  // Get all examples
  app.get("/api/examples", function(req, res) {
    db.Example.findAll({}).then(function(dbExamples) {
      res.json(dbExamples);
    });
  });

  // Create a new example
  app.post("/api/examples", function(req, res) {
    db.Example.create(req.body).then(function(dbExample) {
      res.json(dbExample);
    });
  });

  // Delete an example by id
  app.delete("/api/examples/:id", function(req, res) {
    db.Example.destroy({ where: { id: req.params.id } }).then(function(
      dbExample
    ) {
      res.json(dbExample);
    });
  });

  // subject api routes
  app.get("/api/subjects", function(req, res) {
    // var query = {};
    // if (req.query.flashcard_id) {
    //   query.FlashcardId = req.query.flashcard_id;
    // }
    // 1. Add a join to include all of each Subject's Posts
    db.Subject.findAll({
      // where: query,
      // include: [db.Post]
    }).then(function(dbSubject) {
      res.json(dbSubject);
    });
  });

  app.get("/api/subjects/:id", function(req, res) {
    // 2; Add a join to include all of the Subject's Posts here
    db.Subject.findOne({
      where: {
        id: req.params.id,
        include: [db.Flashcard]
      }
    }).then(function(dbSubject) {
      res.json(dbSubject);
    });
  });

  app.post("/api/subjects", function(req, res) {
    db.Subject.create(req.body).then(function(dbSubject) {
      res.json(dbSubject);
    });
  });

  app.delete("/api/subjects/:id", function(req, res) {
    db.Subject.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(dbSubject) {
      res.json(dbSubject);
    });
  });

  // GET route for getting all of the flashcards
  app.get("/api/flashcards", function(req, res) {
    var query = {};
    if (req.query.subject_id) {
      query.SubjectId = req.query.subject_id;
    }
    // 1. Add a join here to include all of the Subjects to these flashcards
    db.Flashcard.findAll({
      where: query,
      include: [db.Subject]
    }).then(function(dbFlashcard) {
      res.json(dbFlashcard);
    });
  });

  // Get route for retrieving a single flashcard
  app.get("/api/flashcards/:id", function(req, res) {
    // 2. Add a join here to include the Subject who wrote the Flashcard
    db.Flashcard.findOne({
      where: {
        id: req.params.id,
        include: [db.Subject]
      }
    }).then(function(dbFlashcard) {
      console.log(dbFlashcard);
      res.json(dbFlashcard);
    });
  });

  // POST route for saving a new flashcard
  app.post("/api/flashcards", function(req, res) {
    db.Flashcard.create(req.body).then(function(dbFlashcard) {
      res.json(dbFlashcard);
    });
  });

  // DELETE route for deleting flashcards
  app.delete("/api/flashcards/:id", function(req, res) {
    db.Flashcard.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(dbFlashcard) {
      res.json(dbFlashcard);
    });
  });

  // PUT route for updating flashcards
  app.put("/api/flashcards", function(req, res) {
    db.Flashcard.update(req.body, {
      where: {
        id: req.body.id
      }
    }).then(function(dbFlashcard) {
      res.json(dbFlashcard);
    });
  });

  // app.post("/api/upload", function(req, res) {
  //   var form = new formidable.IncomingForm();

  //   form.parse(req);

  //   form.on("fileBegin", function(name, file) {
  //     file.path = __dirname + "/uploads/" + file.name;
  //   });

  //   form.on("file", function(name, file) {
  //     console.log("Uploaded " + file.name);
  //   });

  //   res.sendFile(__dirname + "/uploads");
  // });
};
