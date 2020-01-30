const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const shortenerSchema = new Schema({
  url: { type: String, required: true },
  shortUrl: { type: Number, required: true },
}, {
  timestamps: true,
});

const Shortener = mongoose.model('Shortener', shortenerSchema);

module.exports = Shortener;