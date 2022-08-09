//////////// REQUIRE SECTION ////////////

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require ("ejs");

const app = new express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//////////// CONNECTION SECTION ////////////

let uri = "mongodb+srv://REDickerson:Wpsm51613@cluster0.xlpprvk.mongodb.net/wikiDB";

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true}, function(err){
    if (err) {return};
    console.log("Database successfully connected.");
});

//////////// MONGOOSE SECTION ////////////

//Mongoose Schemas

const articleSchema = {
    title: String,
    content: String
};

//Mongoose Models

const Article = mongoose.model("Article", articleSchema);

//////////// ROUTING SECTION ////////////

// ----- Requests targeting all articles -----

//articles route

app.route("/articles")

//get method: returns all articles found

.get(function(req, res){
   
    Article.find({}, function(err, foundArticles){
        if (!err) {
        res.send(foundArticles);
        } else {
            console.log(err);
        }
    });

})

//post method: creates new article at /articles

.post(function(req, res){

    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content 
    });

    newArticle.save(function(err){
        if (err) { res.send(err); return};
        res.send("Successfully added a new article.")
    });
    
})

//delete method: deletes ALL articles from /articles

.delete(function(req, res){
    Article.deleteMany(function(err){
        if (err) {res.send(err); return;}
        res.send("All articles successfully deleted.");
    })
});

// ----- Requests targeting specific articles -----

//articles/# route

app.route("/articles/:articleTitle")

//get method: returns a specific article that matches the query

.get(function(req, res){    

    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
        if (err) {res.send(err); return;}

        if (foundArticle) {
            res.send(foundArticle);
        } else {
            res.send("There were no articles found that match the request.");
        }
    });


})

//put method: replaces the specific object entirely with a new one

.put(function(req, res){
   
    Article.update(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        {overwrite: true},
        function(err){
            if (!err) {
            res.send("Succesfully updated the article.");
        }
    })

})

//patch method: updates the specific article with new information only

.patch(function(req, res){

    Article.update(
        {title: req.params.articleTitle},
        {$set: req.body},
        function(err){
            if (err) { res.send(err); return}
            
            res.send("Succesfully updated the article.");            
    })
    
})

//delete method: deletes the specific article that matches the query

.delete(function(req, res){
    Article.deleteOne({title: req.params.articleTitle}, function(err){
        if (err) {console.log(err); return}
        res.send("The article was successfully deleted.");
    })
});







//////////// LISTENER SECTION ////////////

let port = 3000;

app.listen(port, function(err){
    if (err) {return};
    
    console.log("Server successfully started on port: " + port);
});