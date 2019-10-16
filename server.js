//adding dependencies
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const mongoose = require('mongoose')
const logger = require('morgan')
require('dotenv').config();

//reference to models
let db = require('./models')
//setting port for heroku
const PORT = process.env.PORT || 3000;
//instantiating express
let app = express()
//setting up mongo for heroku
mongoose.Promise = Promise
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/webscraper", {useNewUrlParser: true, useUnifiedTopology: true});

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

//grabs articles from the huffington post
app.get("/scrape", function (req, res) {
    axios.get("https://www.huffpost.com/").then(function (response) {
      var $ = cheerio.load(response.data);
  
  
      $(".card__headlines").each(function (i, element) {
  
        var link = $(element).children(".card__headline").children("a").attr("href");
        var title = $(element).children(".card__headline").children("a").children(".card__headline__text").text();
        var summary = $(element).children(".card__description").children("a").text();
  
        if (title && link && summary) {
          db.Article.create({
            title: title,
            summary: summary,
            link: link
          })
            .then(function (dbArticle) {
              console.log(dbArticle);
            })
            .catch(function (err) {
              console.log(err);
            });
        };
        });
  
      res.send("News Loaded");
    });
});
  
//finding all the articles in the database
app.get('/articles', function(req, res) {
    db.Article.find({})
        .then(function(dbArticle) {
            res.json(dbArticle)
            console.log(dbArticle)
        })
        .catch(function(err) {
            res.json(err)
        })
})

//allowing the comments to be associated with the article
app.get('/articles/:id', function(req, res) {
    db.Article.findOne(
        {
            _id: req.params.id
        },
    )
    .populate('Comment')
    .then(function(dbArticle) {
        console.log(dbArticle)
        res.json(dbArticle)
    })
    .catch(function(err) {
        res.json(err)
    });
});

//allows comments to be posted
app.post('/articles/:id', function(req, res) {
    db.Comment.create(req.body)
        .then(function(dbComment) {
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { comment: dbComment._id }, { new: true });  
        })
        .then(function(dbArticle) {
            console.log(dbArticle)
            res.json(dbArticle)
        })
        .catch(function(err) {
            res.json(err)
        })
})

//deletes an article
app.delete("/articles/:id", function (req, res) {
    db.Article
        .remove({ _id: req.params.id })
        .then(function (dbArticle) {
            res.json(dbArticle)
        })
});


//starts the server at the specified port
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});





