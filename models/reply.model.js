const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const replySchema = new Schema({
  text: { type: String, required: true },
  reported: { type: Boolean, default: false },
  delete_password: { type: String, required: true }
}, {
  timestamps: { createdAt: 'created_on' }
});

const Reply = mongoose.model('Reply', replySchema);

module.exports = Reply;