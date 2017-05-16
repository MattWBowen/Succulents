var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var succulentSchema = new Schema({
  name: String,
  description: String,
  found: {
    type: Date,
    default: Date.now
  },
  location: {
    type: [Number]
  }
});

succulentSchema.index({ location: '2dsphere'});
module.exports = mongoose.model('Succulent', succulentSchema);
