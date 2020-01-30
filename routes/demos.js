const router = require("express").Router();

const board_controller = require("../controllers/boardController");

router.route("/exercisetracker").get((req, res) => res.sendFile(process.cwd() + "/views/exercise_demo.html"));
router.route("/fileanalyse").get((req, res) => res.sendFile(process.cwd() + "/views/analyse_demo.html"));
router.route("/issuetracker").get((req, res) => res.sendFile(process.cwd() + "/views/issue_demo.html"));
router.route("/library").get((req, res) => res.sendFile(process.cwd() + "/views/library_demo.html"));


module.exports = router;
