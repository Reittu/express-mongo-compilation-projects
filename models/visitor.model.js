const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const visitorSchema = new Schema({
  ip: {
    type: String,
    required: true,
    unique: true
  },
}, {
  timestamps: true,
});

const Visitor = mongoose.model('Visitor', visitorSchema);

module.exports = Visitor;