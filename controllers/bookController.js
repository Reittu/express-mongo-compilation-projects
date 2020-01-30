const Book = require("../models/book.model");

exports.all = function(req, res) {  
  // Could also simply use Book.find() and process the length manually before sending
  // the response. E.g. "book.commentcount = book.comments.length; delete book.comments;"
  // Using aggregate for future reference.
  Book.aggregate([
      {
         $project: {
            // _id: 0, would exclude the id
            title: 1, // removing this line would exclude the title
            commentcount: { $size: "$comments" }
         }
      }
   ])
    .then(books => res.json(books))
    .catch(err => res.status(400).json(err));
};

exports.query = function(req, res) {
  Book.findOne({ _id: req.params.id })
    .then(book => {
      if (!book) throw Error("no book exits");
      res.json(book);
    })
    .catch(err => res.status(400).json(err.message || err));
};

exports.addBook = function(req, res) {
  const newBook = new Book({
    title: req.body.title
  });

  newBook
    .save()
    .then(() => res.json(newBook))
    .catch(err => res.status(400).json(err));
};

exports.addComment = function(req, res) {
  Book.findOne({ _id: req.params.id })
    .then(book => {
      book.comments = [...book.comments, req.body.comment];
      book.save();
      res.json(book);
    })
    .catch(err => res.status(400).json(err));
};

exports.delete = function(req, res) {
  Book.findOneAndDelete({ _id: req.params.id })
    .then(book => {
      if (!book) throw Error("id error")
      else res.json("delete successful");;
    })
    .catch(err => res.status(400).json(err.message || err));
};

exports.deleteAll = function(req, res) {
  Book.deleteMany()
    .then(() => res.json("complete delete successful"))
    .catch(err => res.status(400).json(err));
};
