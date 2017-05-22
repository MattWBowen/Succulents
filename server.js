// Set up the app
var express = require('express');
var app = express();
app.use(express.static(__dirname + '/public'));

// Set up file uploads
var multer = require('multer');
var upload = multer({dest: 'uploads/'})

// Set up mongoose
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/succulents');

// Import succulent schema
var Succulent = require('./app/models/succulent');

// Set up parsing of request bodies
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Port to host app
var port = process.env.PORT || 8080;

// Set up router for API
router = express.Router();

// Root route
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

// API routes ending in /succulents
router.route('/succulents')

  // Get all succulents
  .get(function(req, res) {
    Succulent.find(function(err, succulents) {
      if (err)
        return res.send(err);
      return res.status(200).json(succulents);
    });
  })

  // Create a new succulent
  .post(function(req, res) {
    var newSucculent = new Succulent();
    newSucculent.name = req.body.name;
    newSucculent.description = req.body.description;
    newSucculent.location = req.body.location;

    // Return the succulent that was just saved
    newSucculent.save(function(err, succulent) {
      if (err)
        return res.status(403).send({
          message: "No puedo hacerlo.",
          error: err
        });
      return res.status(200).json(succulent);
    });
  });

// API routes ending in /succulents/:succulent_id
router.route('/succulents/:succulent_id')

  // Delete a succulent
  .delete(function(req, res) {
    Succulent.remove({
      _id: req.params.succulent_id
    }, function(err, succulent) {

      // Cannot find the succulent
      if (err)
        return res.status(404).send({
          message: "Unable to find succulent.",
          error: err
        });

      return res.json({ message: 'Succulent successfully deleted!' });
    });
  })

  // Get a single succulent
  .get(function(req, res) {
    Succulent.findById(req.params.succulent_id, function(err, succulent) {
      if (err)
        return res.status(404).send({
          message: "No esta aqui!",
          error: err
        });
      return res.json(succulent);
    });
  })

  // Update a succulent
  .put(function(req, res) {

    // Find the succulent we want to update
    Succulent.findById(req.params.succulent_id, function(err, succulent) {

      // Unable to find succulent
      if (!succulent) {
        return res.status(404).send({
          message: "Can't find it!"
        });
      }

      // Some other error
      if (err) {
        return res.status(400).send(err);
      }

      // Overwrite existing succulent with new fields
      succulent.name = req.body.name;
      succulent.description = req.body.description;
      succulent.location = req.body.location;

      // Save changes
      succulent.save(function(err, succulent) {
        if (err)
          return res.status(400).send({
            message: "Invalid succulent update.",
            error: err
          });
        return res.json(succulent);
      });
    });
  });

// Hook up all API routes
app.use('/api', router);

//
// Testing file uploads with multer.
// Send a POST request, encoded as "multipart/form-data". The file associated
// with the "avatar" key will be saved in "uploads/" (you need to create it).
// Notice that all the upload functionality is handled in the upload middleware
// (upload.single('avatar')) and all the code in here is just print statements.
//
app.post('/api/file-upload-test', upload.single('avatar'), function(req, res, next) {

  // Check if a file was uploaded
  if (req.file) {
    console.log("File saved as: " + req.file.filename);
    console.log("Original filename: " + req.file.originalname);

    res.send({
      message: "nice going bro"
    });
  }

  // File was not uploaded
  else {
    console.log("no files here bro");
    res.send({
      message: "no files here bro"
    });
  }

  // We still have access to all other fields passed in with the call
  console.log("BODY: " + req.body.name);
});

app.listen(port);
console.log("Cash me outside at " + port);

module.exports = app;
