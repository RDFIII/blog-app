const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// APP CONFIG
mongoose.connect("mongodb://localhost/blog-app", { useMongoClient: true });
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

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
  Blog.create(req.body.blog, function(err, newBlog){
    if(err){
      console.log(err);
      res.render("new");
    } else {
      res.redirect("/blogs");
    };
  });
});

app.listen(3000, function(){
  console.log("Listening on 3000");
});
