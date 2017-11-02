const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const expressSanitzier = require("express-sanitizer");

// APP CONFIG
mongoose.connect("mongodb://localhost/blog-app", { useMongoClient: true });
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitzier());

// MONGOOSE/MODEL CONFIG
let blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {type: Date, default: Date.now}
});

let Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//   title: "Larivee",
//   image: "https://www.sheltonsguitars.com/images/2010/5-29-10/larrivee%20d03/big/big%20larrivee%20d03DSCN9225.jpg",
//   body: "Just got my new Larivee D03.  It is pretty dang sweet.  Got it on the cheap too!"
// });



// RESTFUL ROUTES

// ROOT ROUTE
app.get("/", function(req, res){
  res.redirect("/blogs");
});

// INDEX ROUTE
app.get("/blogs", function(req, res){
  Blog.find({}, function(err, blogs){
    if(err){
      console.log(err);
    } else {
      res.render("index", {blogs: blogs});
    };
  });
});

// NEW ROUTE
app.get("/blogs/new", function(req, res){
  res.render("new");
});

// CREATE ROUTE
app.post("/blogs", function(req, res){
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.create(req.body.blog, function(err, newBlog){
    if(err){
      console.log(err);
      res.render("new");
    } else {
      res.redirect("/blogs");
    };
  });
});

// SHOW ROUTE
app.get("/blogs/:id", function(req, res){
  Blog.findById(req.params.id, function(err, foundBlog){
    if(err){
      console.log(err);
      res.redirect("/blogs");
    } else {
      res.render("show", {blog: foundBlog});
    };
  });
});

// EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
  Blog.findById(req.params.id, function(err, foundBlog){
    if(err){
      console.log(err);
      res.redirect("/blogs");
    } else {
      res.render("edit", {blog: foundBlog});
    };
  });
});

// UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
    if(err){
      console.log(err);
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs/" + req.params.id);
    };
  });
});

// DESTROY ROUTE
app.delete("/blogs/:id", function(req, res){
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findByIdAndRemove(req.params.id, function(err){
    if(err){
      console.log(err);
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs");
    };
  });
});

app.listen(3000, function(){
  console.log("Listening on 3000");
});
