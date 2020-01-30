const router = require("express").Router();

const issue_controller = require("../controllers/issueController");

const issue_template = require("../templates/issue");

router.route("/").get((req, res) => res.sendFile(process.cwd() + "/views/issue_demo.html"));
router.route("/:projectname").get(async (req, res) => res.send(await issue_template.specific({project: req.params.projectname})));


module.exports = router;

                                  //res.sendFile(process.cwd() + "/views/specific_issue.html"));