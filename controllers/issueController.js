const Issue = require("../models/issue.model");

exports.query = function(req, res) {
  Issue.find({ project_name: req.params.projectname, ...req.query })
    .then(issues => res.json(issues))
    .catch(err => res.status(400).json(err));
};

// Error and success message syntaxes are according to FCC tests.
// ... if you are wondering why they differ from other projects.

exports.add = function(req, res) {
  const newIssue = new Issue({
    project_name: req.params.projectname,
    ...req.body
  });

  newIssue
    .save()
    .then(() => res.json(newIssue))
    .catch(err => res.status(400).json(err));
};

exports.update = function(req, res) {
  const id = req.body.id;
  const body = { ...req.body };
  delete body.id;
  if (!req.body || !id) 
    return res.status(400).json({ failed: "no updated field sent" });

  Issue.findOneAndUpdate({ _id: id }, body)
    .then(issue => res.json({ success: "successfully updated" }))
    .catch(err => res.status(400).json({ failed: "could not update " + req.params.id }));
};

exports.delete = function(req, res) {
  if (!req.body.id) 
    return res.json("id error");

  Issue.findOneAndDelete({ _id: req.body.id })
    .then(issue => {
      if (issue) res.json({ success: "deleted " + req.body.id });
      else res.status(400).json("id error");
    })
    .catch(err => res.status(400).json({ failed: "could not delete " + req.body.id }));
};

exports.specificIssue = function(req, res) {
  Issue.find({ project_name: req.params.projectname, ...req.query })
    .then(issues => res.json(issues))
    .catch(err => res.status(400).json(err));
}