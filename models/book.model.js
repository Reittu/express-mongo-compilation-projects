const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: { type: String, required: true },
  comments: { type: [String], default: [] }
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;

/*

Can also use subdocuments (subschemas) to make array of objects

bookController -> addComment
  book.comments = [...book.comments, req.body.comment]
    replace req.body.comment with { comment: req.body.comment }
    
And replace the current schema:

const commentSchema = new Schema({ comment: 'string' }, { _id : false });

const bookSchema = new Schema({
  title: { type: String, required: true },
  comments: { type: [commentSchema], default: [] }
});


*/