const router = require("express").Router();

const timestamp_controller = require("../controllers/timestampController");
const whoami_controller = require("../controllers/whoamiController");
const shorturl_controller = require("../controllers/shorturlController");
const exercise_controller = require("../controllers/exerciseController");
const user_controller = require("../controllers/userController");
const upload_controller = require("../controllers/uploadController");
const convert_controller = require("../controllers/convertController");
const issue_controller = require("../controllers/issueController");
const book_controller = require("../controllers/bookController");
const stock_controller = require("../controllers/stockController");
const board_controller = require("../controllers/boardController");
const visitor_controller = require("../controllers/visitorController");

router.route("/").get((req, res) => res.sendFile(process.cwd() + "/views/index.html"));

router.route("/timestamp").get(timestamp_controller.index);
router.route("/timestamp/:date_string").get(timestamp_controller.date_string);

router.route("/whoami").get(whoami_controller.index);

router.route("/shorturl").get(shorturl_controller.index);
router.route("/shorturl/:shortUrl").get(shorturl_controller.query);
router.route("/shorturl/new/*").get(shorturl_controller.new);

// Challenge specific routes (remove later)
router.route("/exercise/users").get(user_controller.all);
router.route("/exercise/new-user").post(user_controller.add);

router.route("/exercise").get((req, res) => res.sendFile(process.cwd() + "/views/exercise_demo.html"));
router.route("/exercise/all").get(exercise_controller.all);
router.route("/exercise/add").post(exercise_controller.add);
router.route("/exercise/log").get(exercise_controller.log);
router.route("/exercise/update/:id").put(exercise_controller.update);
router.route("/exercise/:id").get(exercise_controller.query);
router.route("/exercise/:id").delete(exercise_controller.delete);

router.route("/user/all").get(user_controller.all);
router.route("/user/add").post(user_controller.add);

router.route("/fileanalyse").get((req, res) => res.sendFile(process.cwd() + "/views/analyse_demo.html"));
router.route("/fileanalyse").post(upload_controller.fileupload);

router.route("/convert").get(convert_controller.index);

router.route("/issues").get((req, res) => res.sendFile(process.cwd() + "/views/issue_demo.html"));
router.route("/issues/:projectname").get(issue_controller.query);
router.route("/issues/:projectname").post(issue_controller.add);
router.route("/issues/:projectname").put(issue_controller.update);
router.route("/issues/:projectname").delete(issue_controller.delete);

router.route("/books").get(book_controller.all);
router.route("/books").post(book_controller.addBook);
router.route("/books").delete(book_controller.deleteAll);
router.route("/books/:id").get(book_controller.query);
router.route("/books/:id").post(book_controller.addComment);
router.route("/books/:id").delete(book_controller.delete);

router.route("/stock-prices").get(stock_controller.index);

router.route("/boards").get(board_controller.allBoards);
router.route("/boards").post(board_controller.addBoard);
router.route("/threads").get((req, res) => res.sendFile(process.cwd() + "/views/index.html"));
router.route("/threads/:board").get(board_controller.allThreads);
router.route("/threads/:board").post(board_controller.addThread);
router.route("/threads/:board").delete(board_controller.deleteThread);
router.route("/threads/:board").put(board_controller.reportThread); // report
router.route("/replies").get(board_controller.allReplies);
router.route("/replies/:board").get(board_controller.allReplies); // required only for FCC test
router.route("/replies/:board").post(board_controller.addReply);
router.route("/replies/:board").delete(board_controller.deleteReply); // change text to [deleted]
router.route("/replies/:board").put(board_controller.reportReply); // report

router.route("/visitors").get(visitor_controller.count);
router.route("/visitors/new").get(visitor_controller.new);

module.exports = router;
