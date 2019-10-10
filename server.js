const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const mongoose = require('mongoose')
const logger = require('morgan')

let db = require('./models')

var PORT = 3000

let app = express()

mongoose.connect("mongodb://localhost/webscraper", { useNewUrlParser: true });

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

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

app.post('/articles/:id', function(req, res) {
    db.Comment.create(req.body)
        .then(function(dbComment) {
            return db.Article.findOneAndUpdate({}, { $push: { Comment: dbComment._id } }, { new: true });
        })
        .then(function(dbArticle) {
            console.log(dbArticle)
            res.json(dbArticle)
        })
        .catch(function(err) {
            res.json(err)
        })
})



app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});





