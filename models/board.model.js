const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const boardSchema = new Schema({
  name: { type: String, required: true },
  threads: [{ type: Schema.Types.ObjectId, ref: 'Thread' }]
});

const Board = mongoose.model('Board', boardSchema);

module.exports = Board;