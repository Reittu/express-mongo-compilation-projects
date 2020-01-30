const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const threadSchema = new Schema({
  text: { type: String, required: true },
  reported: { type: Boolean, default: false },
  delete_password: { type: String, required: true },
  replies: [{ type: Schema.Types.ObjectId, ref: 'Reply'}]
}, {
  timestamps: { createdAt: 'created_on', updatedAt: 'bumped_on' }
});

const Thread = mongoose.model('Thread', threadSchema);

module.exports = Thread;