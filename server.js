const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const apiRouter = require("./routes/api");
const boardRouter = require("./routes/board");
const issueRouter = require("./routes/issues");
const demoRouter = require("./routes/demos");


const app = express();
const port = process.env.PORT || 3000;

app.use(
  helmet({
    hidePoweredBy: { setTo: "PHP 4.2.0" },
    noCache: {},
    referrerPolicy: { policy: "same-origin" }
  })
);

// Required for html forms (with fetch can use Content-Type: application-json).
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());
app.use(express.json());
// Allow caching for static public files; override and remove some headers set by Helmet.js
app.use(express.static("public",  { etag: false, setHeaders: function(res, path) { 
    res.setHeader("Cache-Control","public, max-age=10800");  
    res.removeHeader("pragma");
} }));

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/views/index.html");
});

app.use("/api", apiRouter);
app.use("/b", boardRouter);
app.use("/issues", issueRouter);
app.use("/demos", demoRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
