const router = require("express").Router();

const board_controller = require("../controllers/boardController");

router.route("/").get((req, res) => res.sendFile(process.cwd() + "/views/board_index.html"));
router.route("/:board").get((req, res) => res.sendFile(process.cwd() + "/views/board_specific.html"));
router.route("/:board/:thread").get((req, res) => res.sendFile(process.cwd() + "/views/thread_specific.html"));

module.exports = router;
