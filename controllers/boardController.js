const Board = require("../models/board.model");
const Thread = require("../models/thread.model");
const Reply = require("../models/reply.model");
const bcrypt = require("bcrypt");
const saltRounds = 8; // Conserving the free glitch server.

// Boards

exports.allBoards = function(req, res) {
  Board.aggregate([
    {
      $project: {
        _id: 0,
        name: 1,
        threadCount: { $size: "$threads" }
      }
    }
  ])
    .then(boards => res.json(boards))
    .catch(err => res.status(500).json(err));
};

exports.addBoard = function(req, res) {
  if (!req.body.name) return res.status(400).json("Missing parameter: name");
  const newBoard = new Board({ name: req.body.name, threads: [] });
  newBoard
    .save()
    .then(() => res.redirect("/b/"))
    .catch(err => res.json(err));
};

// Threads

// Ideally this would be cached on server and kept updated as it will be a frequent query.
// bumped_on (thread) and created_on (reply) should be indexed as we are sorting by them.

exports.allThreads = function(req, res) {
  let skipAmount;
  const pageNum = Number(req.query.page);
  if (isNaN(pageNum) || !Number.isInteger(pageNum) || pageNum < 1)
    skipAmount = 0;
  else skipAmount = (pageNum - 1) * 10;
  // Populate the board with 10 most recent threads
  // Populate threads with 3 most recent replies
  Board.findOne({ name: req.params.board }, "text threads")
    .populate({
      path: "threads",
      options: {
        skip: skipAmount,
        limit: 10,
        sort: { bumped_on: -1 },
        select: "text replies created_on bumped_on"
      },
      populate: {
        path: "replies",
        options: {
          limit: 3,
          sort: { created_on: -1 },
          select: "text created_on"
        }
      }
    })
    .then(board => {
      if (!board) throw Error("invalid board id");
      res.json(board);
    })
    .catch(err => res.status(400).json(err.message || err));
};

exports.addThread = function(req, res) {
  generateHash(req.body.password, saltRounds)
    .then(hash => 
     new Thread({
        text: req.body.text,
        delete_password: hash
      }).save()
    )
    .then(newThread =>
      Board.findOneAndUpdate(
        { name: req.params.board },
        { $push: { threads: newThread._id } },
        { upsert: true }
      )
    )
    .then(() => res.redirect("/b/" + req.params.board))
    .catch(err => res.status(400).json(err));
};

exports.deleteThread = function(req, res) {
  Thread.findOne({ _id: req.body.thread_id })
    .then(async thread => {
      if (!thread) throw Error("invalid thread id");
      await compareHash(req.body.password, thread.delete_password); // Throws if incorrect
      await Reply.deleteMany({ _id: { $in: thread.replies} });
      thread.remove();
    })
    .then(() => 
      // Remove the reference id from board's threads array.
      Board.findOneAndUpdate(
        { name: req.params.board },
        { $pull: { threads: req.body.thread_id } }
      )
    )
    .then(() => res.json("success"))
    .catch(err => res.status(400).json(err.message || err));
  // err.message is required if error is thrown manually.
};

exports.reportThread = function(req, res) {
  Thread.findOneAndUpdate({ _id: req.body.thread_id }, { reported: true })
    .then(() => res.json("success"))
    .catch(err => res.status(400).json(err));
};

// Replies

exports.allReplies = function(req, res) {
  // Populate the thread with all replies
  Thread.findOne(
    { _id: req.query.thread_id },
    "text created_on bumped_on replies"
  )
    .populate({
      path: "replies",
      options: { select: "text created_on", sort: { bumped_on: -1 } }
    })
    .then(thread => {
      if (!thread) throw Error("invalid thread id");
      res.json(thread);
    })
    .catch(err => res.status(400).json(err.message || err));
};

exports.addReply = function(req, res) {
  generateHash(req.body.password, saltRounds)
    .then(hash => {
      return new Reply({
        text: req.body.text,
        delete_password: hash
      }).save();
    })
    .then(newReply =>
      Thread.findOneAndUpdate(
        { _id: req.body.thread_id },
        { $push: { replies: newReply._id } }
      )
    )
    .then(() =>
      res.redirect("/b/" + req.params.board + "/" + req.body.thread_id)
    )
    .catch(err => res.status(400).json(err));
};

exports.deleteReply = function(req, res) {
  Reply.findOne({ _id: req.body.reply_id })
    .then(async reply => {
      if (!reply) throw Error("invalid reply id");
      await compareHash(req.body.password, reply.delete_password); // Throws if incorrect
      reply.text = "[deleted]";
      reply.save();
    })
    .then(() => res.json("success"))
    .catch(err => res.status(400).json(err.message || err));
};

exports.reportReply = function(req, res) {
  Reply.findOneAndUpdate({ _id: req.body.reply_id }, { reported: true })
    .then(() => res.json("success"))
    .catch(err => res.status(400).json(err));
};

function generateHash(password, saltRounds) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) reject(err);
      resolve(hash);
    });
  });
}

function compareHash(password, hash) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, (err, res) => {
      if (res === false) reject("incorrect password");
      resolve(true);
    });
  });
}
