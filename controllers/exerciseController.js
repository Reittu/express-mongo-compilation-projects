const Exercise = require("../models/exercise.model");
const User = require("../models/user.model");

exports.all = function(req, res) {
  Exercise.find()
    .then(exercises => res.json(exercises))
    .catch(err => res.status(400).json(err));
};

exports.query = function(req, res) {
  Exercise.findById(req.params.id)
    .then(exercise => res.json(exercise))
    .catch(err => res.status(400).json(err));
};

exports.add = async function(req, res) {
  const userId = req.body.userId,
    description = req.body.description,
    duration = Number(req.body.duration),
    date = Date.parse(req.body.date) || new Date().toJSON(),
    newExercise = new Exercise({
      userId,
      description,
      duration,
      date
    }),
    user = await User.findOne({ _id: userId }).catch(err =>
      console.log("Validation error: " + err)
    );
  if (!user) 
    return res.json("Error: This user does not exist");
  
  newExercise
    .save()
    .then(() => {
      res.json({
        username: user.username,
        description,
        duration,
        _id: userId,
        date
      });
    })
    .catch(err => res.status(400).json(err));
};

exports.delete = function(req, res) {
  Exercise.findOneAndDelete({ _id: req.params.id })
    .then(() => res.json("Exercise deleted."))
    .catch(err => res.status(400).json(err));
};

// Should just use findOneAndUpdate; I am testing "then chaining" and error bubbling here.
exports.update = function(req, res) {
  Exercise.findById(req.params.id)
    .then(exercise => {
      if(!exercise) throw Error("This exercise does not exist.");
      exercise.description = req.body.description || exercise.description;
      exercise.duration = Number(req.body.duration) || exercise.duration;
      return exercise.save();
    })
    .then(() => res.json("Exercise updated!"))
    .catch(err => res.status(400).json(err.message || err));
};

exports.log = function(req, res) {
  const lim = Number(req.query.limit) || 0,
    from = req.query.from ? new Date(req.query.from) : new Date(0),
    to = req.query.to ? new Date(req.query.to) : new Date();
  Exercise.find({
    userId: req.query.userId,
    date: {
      $gte: from.toJSON(),
      $lte: to.toJSON()
    }
  })
    .limit(lim)
    .then(async exercises => {
      const user = await User.findOne({ _id: req.query.userId });
      res.json({ ...user._doc, log: exercises, count: exercises.length });
    })
    .catch(err => res.status(400).json(err));
};
