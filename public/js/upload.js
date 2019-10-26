var formidable = require("formidable");
var express = require("express");
var other = express();

other.get("/upload", function(req, res) {
  res.sendFile(__dirname + "/upload");
});

other.post("/upload", function(req, res) {
  var form = new formidable.IncomingForm();

  form.parse(req);

  form.on("fileBegin", function(name, file) {
    file.path = __dirname + "/uploads/" + file.name;
  });

  form.on("file", function(name, file) {
    console.log("Uploaded " + file.name);
  });

  res.sendFile(__dirname + "/upload");
});
