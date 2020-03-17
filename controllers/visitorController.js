const Visitor = require("../models/visitor.model");

exports.new = function(req, res) {
  if(!req.headers["x-forwarded-for"]) return res.status(400).json("Visitor logging failed");
  const ip = req.headers["x-forwarded-for"].split(",")[0];
  if(/^40.94/.test(ip)) return res.status(403).json("Microsoft bot");
  const newVisitor = new Visitor({ ip });
  newVisitor
    .save()
    .then(() => res.json("First visit from this IP"))
    .catch(err => res.json("Already visited before"));
};

exports.count = function(req, res) {
  Visitor.estimatedDocumentCount()
    .then(count => res.json({visitors: count, lastReset: "March 8th, 2020"}))
    .catch(err => res.status(500).json(err));
};