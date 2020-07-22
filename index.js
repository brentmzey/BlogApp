const bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  express = require("express"),
  app = express();

// Set up mongoose
mongoose.connect("mongodb://localhost:27017/restful_blog");
// Set up some express primitives
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Set up SCHEMA and MODEL
const blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: { type: Date, default: Date.now },
});

// Set up server for app to listen
app.listen(2000, () => {
  console.log("Blog App server is running at 'localhost:2000'");
});
