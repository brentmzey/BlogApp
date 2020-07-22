const bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  express = require("express"),
  app = express();

// APP CONFIG
mongoose
  .connect("mongodb://localhost:27017/restful_blog", {
    // need to use the localhost port of 27017 since our local instance of Mongo runs/listens here
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to 'restful_blog' DB!"))
  .catch((error) => console.log(error.message));
// Set up some express primitives
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Mongoose SCHEMA & MODEL CONFIG
const blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: { type: Date, default: Date.now },
});
const Blog = mongoose.model("Blog", blogSchema);

// RESTful ROUTES
app.get("/", (req, res) => {
  res.redirect("/blogs");
});

// INDEX Route
app.get("/blogs", (req, res) => {
  Blog.find({}, (err, blogs) => {
    if (err) {
      console.log(err);
    } else {
      res.render("index", { blogs: blogs });
    }
  });
});

// NEW Route
app.get("/blogs/new", (req, res) => {
  res.render("new");
});

// CREATE Route
app.post("/blogs", (req, res) => {
  // Create blog
  Blog.create(req.body.blog, (err, newBlog) => {
    if (err) {
      res.render("new");
    } else {
      // Then redirect to the index
      res.redirect("/blogs");
    }
  });
});

// Set up server for app to listen
app.listen(2000, () => {
  console.log("Blog App server is running at 'localhost:2000'");
});
