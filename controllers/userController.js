const User = require("../models/user.model");

exports.all = function(req, res) {
  User.find({}, "_id username")
    .then(users => res.json(users))
    .catch(err => res.status(400).json(err));
};

exports.add = async function(req, res) {
  const username = req.body.username;
  const user = await User.findOne({ username });
  if (user)
    return res.json({
      alreadyExists: true,
      username: user.username,
      _id: user._id
    });
  const newUser = new User({ username });
  newUser
    .save()
    .then(() => res.json({ username: newUser.username, _id: newUser._id }))
    .catch(err => res.status(400).json(err));
};
