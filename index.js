const expressSanitizer = require("express-sanitizer"),
  methodOverride = require("method-override"),
  bodyParser = require("body-parser"),
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
app.use(expressSanitizer()); // Needs to go after "body-parser"
app.use(methodOverride("_method")); // helps us tell app to use PUT & DELETE requests

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
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.create(req.body.blog, (err, newBlog) => {
    if (err) {
      res.render("new");
    } else {
      // Then redirect to the index
      res.redirect("/blogs");
    }
  });
});

// SHOW Route
app.get("/blogs/:id", (req, res) => {
  Blog.findById(req.params.id, (err, foundBlog) => {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.render("show", { blog: foundBlog });
    }
  });
});

// EDIT Route
app.get("/blogs/:id/edit", (req, res) => {
  Blog.findById(req.params.id, (err, foundBlog) => {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.render("edit", { blog: foundBlog });
    }
  });
});

// UPDATE Route
app.put("/blogs/:id", (req, res) => {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs/" + req.params.id);
    }
  });
});

// DELETE/DESTROY Route
app.delete("/blogs/:id", (req, res) => {
  // Destroy blog post
  Blog.findByIdAndDelete(req.params.id, (err) => {
    if (err) {
      res.redirect("/blogs");
    } else {
      // Redirect somewhere
      res.redirect("/blogs");
    }
  });
});

// Set up server for app to listen
app.listen(2000, () => {
  console.log("Blog App server is running at 'localhost:2000'");
});
