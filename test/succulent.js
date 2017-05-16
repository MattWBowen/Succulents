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

  // GET the succulents. There should be none
  describe('/GET succulents (none)', function() {
    it('It should get all the succulents', function(done) {
      chai.request(server)
        .get('/api/succulents')
        .end(function(err, res) {
          res.should.have.status(200);
          res.body.length.should.be.eql(0);
          res.body.should.be.a('array');
          done();
        });
    });
  });

  // Create a succulent
  describe('/POST a succulent.', function() {
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
  });
});
