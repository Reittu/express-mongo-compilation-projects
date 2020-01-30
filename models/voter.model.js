const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const voterSchema = new Schema({
  ip: { type: String, required: true },
  likes: { type: [String], default: [] }
});

const Voter = mongoose.model('Voter', voterSchema);

module.exports = Voter;