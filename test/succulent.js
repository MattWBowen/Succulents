var mongoose = require('mongoose');

// Require the dev dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');

// Set up assertions
var should = chai.should();
chai.use(chaiHttp);

var Succulent = mongoose.model('Succulent');
describe('Succulents', function() {

  // Before each test, empty the database
  beforeEach(function(done) {
    Succulent.remove({}, function(err) {
      done();
    });
  });

  // GET the succulents
  describe('/GET all succulents.', function() {

    // Nothing should be returned
    it('It should get nothing.', function(done) {
      chai.request(server)
        .get('/api/succulents')
        .end(function(err, res) {
          res.should.have.status(200);
          res.body.length.should.be.eql(0);
          res.body.should.be.a('array');
          done();
        });
    });

    // Get a single succulent
    it('It should get one succulent', function(done) {

      // Create a new succulent
      var newSucculent = Succulent({
        name: "Jonathan",
        description: "desc",
        location: [1, 1]
      });
      newSucculent.save(function(err, succulent) {

        // Get the succulent
        chai.request(server)
          .get('/api/succulents/')
          .end(function(err, res) {
            res.should.have.status(200);
            res.body.length.should.be.eql(1);
            res.body.should.be.a('array');
            done();
          });
      });
    });
  });

  // Get a single succulent
  describe('/GET a single succulent.', function() {

    // Successfully get a succulent
    it('It should get a single succulent.', function(done) {

      // Create a new succulent
      var newSucculent = Succulent({
        name: "Jonathan",
        description: "desc",
        location: [1, 1]
      });
      newSucculent.save(function(err, succulent) {

        // Update the succulent
        chai.request(server)
          .get('/api/succulents/' + newSucculent.id)
          .end(function(err, res) {
            res.should.have.status(200);
            res.body.should.have.property('name').eql("Jonathan");
            res.body.should.have.property('description').eql("desc");
            res.body.should.have.property('location').eql([1, 1]);
            done();
          });
      });
    });

    // Unable to get a succulent
    it('It should fail on an invalid succulent id.', function(done) {

      // Get a succulent with an invalid id
      chai.request(server)
        .get('/api/succulents/1')
        .end(function(err, res) {
          res.should.have.status(404);
          res.body.should.have.property('message').eql("No esta aqui!");
          res.body.should.have.property('error');
          done();
        });
    });
  });

  // Create a succulent
  describe('/POST a succulent.', function() {

    // Successfully create a succulent
    it('It should create a succulent', function(done) {

      // Populate fields for succulent
      var newSucculent = {
        name: "Jonathan",
        description: "Just a test.",
        location: [32, 32]
      };

      chai.request(server)
        .post('/api/succulents')
        .send(newSucculent)
        .end(function(err, res) {
          res.should.have.status(200);
          res.body.should.have.property('name');
          res.body.should.have.property('description');
          res.body.should.have.property('location');
          done();
        });
    });

    // Unsuccessfully create a succulent without a name field
    it('It should fail without a name field.', function(done) {

      // Create a succulent object without name
      var newSucculent = {
        description: "desc",
        location: [1, 1]
      };

      // Try to save it to db
      chai.request(server)
        .post('/api/succulents')
        .send(newSucculent)
        .end(function(err, res) {
          res.should.have.status(403);
          res.body.should.have.property('message').eql("No puedo hacerlo.");
          res.body.should.have.property('error');
          done();
        });
    });

    // Successfully create a succulent without a location field
    it('It should create a succulent without a location field.', function(done) {

      // Create a succulent object without a location
      var newSucculent = {
        name: "Jonathan",
        description: "desc",
      };

      // Try to save it to db
      chai.request(server)
        .post('/api/succulents')
        .send(newSucculent)
        .end(function(err, res) {
          res.should.have.status(200);
          res.body.should.have.property('name').eql("Jonathan");
          res.body.should.have.property('description').eql("desc");
          res.body.should.not.have.property('location');
          done();
        });
    });

    // Successfully create a succulent without a description field
    it('It should create a succulent without a location field.', function(done) {

      // Create a succulent object without a description
      var newSucculent = {
        name: "Jonathan",
        location: [1, 1]
      };

      // Try to save it to db
      chai.request(server)
        .post('/api/succulents')
        .send(newSucculent)
        .end(function(err, res) {
          res.should.have.status(200);
          res.body.should.have.property('name').eql("Jonathan");
          res.body.should.not.have.property('description');
          res.body.should.have.property('location').eql([1, 1]);
          done();
        });
    });
  });



  // Update a succulent
  describe('/PUT a succulent.', function() {

    // Successfully update the succulent
    it('It should update a succulent', function(done) {

      // Create a new succulent
      var newSucculent = Succulent({
        name: "Jonathan",
        description: "desc",
        location: [1, 1]
      });
      newSucculent.save(function(err, succulent) {

        // Update the succulent
        chai.request(server)
          .put('/api/succulents/' + newSucculent.id)
          .send({name: "Johnny", description: "newnew", location: [2, 2]})
          .end(function(err, res) {
            res.should.have.status(200);
            res.body.should.have.property('name').eql("Johnny");
            res.body.should.have.property('description').eql("newnew");
            res.body.should.have.property('location').eql([2, 2]);
            done();
          });
      });
    });

    // Unsuccessfully update a succulent with invalid ID
    it('It should not update a succulent with an invalid ID', function(done) {

      // Update the succulent using an invalid ID
      chai.request(server)
        .put('/api/succulents/1')
        .send({name: "Johnny", description: "newnew", location: [2, 2]})
        .end(function(err, res) {
          res.should.have.status(404);
          res.body.should.have.property('message').eql("Can't find it!");
          done();
        });
    });

    // Unsuccessfully update a succulent with an empty object
    it("It should not update a succulent with an empty object.", function(done) {

      // Create a new succulent
      var newSucculent = Succulent({
        name: "Jonathan",
        description: "desc",
        location: [1, 1]
      });
      newSucculent.save(function(err, succulent) {

        // Update the succulent
        chai.request(server)
          .put('/api/succulents/' + newSucculent.id)
          .end(function(err, res) {
            res.should.have.status(400);
            res.body.should.have.property('message').eql("Invalid succulent update.");
            res.body.should.have.property('error');
            done();
          });
      });
    });

    // The updated succulent must provide at least a name
    it("It should not update a succulent to have no name.", function(done) {

      // Create a new succulent
      var newSucculent = Succulent({
        name: "Jonathan",
        description: "desc",
        location: [1, 1]
      });
      newSucculent.save(function(err, succulent) {

        // Update the succulent
        chai.request(server)
          .put('/api/succulents/' + newSucculent.id)
          .send({description: "new desc", location: [2, 2]})
          .end(function(err, res) {
            res.should.have.status(400);
            res.body.should.have.property('message').eql("Invalid succulent update.");
            res.body.should.have.property('error');
            done();
          });
      });
    });
  });

  // Delete a succulent
  describe('/DELETE a succulent.', function() {
    it('It should successfully delete a succulent.', function(done) {

      // Create a new succulent
      var newSucculent = Succulent({
        name: "Jonathan",
        description: "desc",
        location: [1, 1]
      });
      newSucculent.save(function(err, succulent) {

        // Then delete it
        chai.request(server)
          .delete('/api/succulents/' + newSucculent.id)
          .end(function(err, res) {
            res.should.have.status(200);
            res.body.should.have.property('message')
              .eql('Succulent successfully deleted!');

            done();
          });
      });
    });

    // Cannot find the succulent to delete
    it("It should not delete a succulent with an invalid ID.", function(done) {
      chai.request(server)
        .delete('/api/succulents/1')
        .end(function(err, res) {
          res.should.have.status(404);
          res.body.should.have.property('message').eql("Unable to find succulent.");
          res.body.should.have.property('error');
          done();
        });
    });
  });
});
