const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const stockSchema = new Schema({
  symbol: { type: String, required: true },
  likes: { type: Number, default: 0 }
});

const Stock = mongoose.model('Stock', stockSchema);

module.exports = Stock;