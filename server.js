// Set up the app
var express = require('express');
var app = express();

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
router.get('/', function(req, res) {
  res.status(200).json({ message: "Hello there." });
});

// API routes ending in /succulents
router.route('/succulents')

  // Get all succulents
  .get(function(req, res) {
    Succulent.find(function(err, succulents) {
      if (err)
        res.send(err);
      res.status(200).json(succulents);
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
        res.send(err);
      res.status(200).json(succulent);
    });
  });

// API routes ending in /succulents/:succulent_id
router.route('/succulents/:succulent_id')

  // Delete a succulent
  .delete(function(req, res) {
    Succulent.remove({
      _id: req.params.succulent_id
    }, function(err, succulent) {
      if (err)
        res.send(err);
      res.json({ message: 'Succulent successfully deleted!' });
    });
  })

  // Get a single succulent
  .get(function(req, res) {
    Succulent.findById(req.params.succulent_id, function(err, succulent) {
      if (err)
        res.send(err);
      res.json(succulent);
    });
  })

  // Update a succulent
  .put(function(req, res) {

    // Find the succulent we want to update
    Succulent.findById(req.params.succulent_id, function(err, succulent) {
      if (err)
        res.send(err);

      // Overwrite existing succulent with new fields
      succulent.name = req.body.name;
      succulent.description = req.body.description;
      succulent.location = req.body.location;

      // Save changes
      succulent.save(function(err) {
        if (err)
          res.send(err);
        res.json({ message: "Succulent successfully updated!" });
      });
    });
  });

// Hook up all API routes
app.use('/api', router);
app.listen(port);
console.log("Cash me outside at " + port);

module.exports = app;
