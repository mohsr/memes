/* Require dependencies. */
var express    = require('express');
var path       = require('path');
var bodyparser = require('body-parser');
var validator  = require('validator');
var app = express();

/* Require and configure MongoDB. */
var mongoUri = /*MONGODBURI*/"";
var mongo  = require('mongodb').MongoClient;
var format = require('util').format;
var db = mongo.connect(mongoUri, function(error, dbconnection) {
    db = dbconnection;
});

/* Set up app for use. */
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'client')));

/* GET home page. */
app.get('/', function(req, res) {
    res.sendFile('index.html');
});

/* GET main meme page. */
app.get('/' + process.env.MEMEPAGE, function(req, res) {
    res.sendFile('memes.html');
});

/* GET memes from database. */
/* NOTE: currently only text memes are supported. */
app.get('/getmemes', function(req,res) {
    db.collection('memes', function(error, coll) {
        if (error) {
            res.sendStatus(500);
        } else {
            coll.find().toArray(function(error, results) {
                if (error) {
                        res.sendStatus(500);
                } else {
                    results.reverse();
                    res.send(results);
                }
            });
        }
    });
});

/* POST login to meme page. */
/* NOTE: this website uses the world's worst authentication. Maybe I'll 
         make it better later, but it doesn't need much right now. */
app.post('/login', function(req, res) {
    if (req.body.pwd == null) {
        res.sendStatus(400);
    } else if (req.body.pwd != process.env.MEMEPWD) {
        res.sendStatus(501);
    } else {
        res.send(process.env.MEMEPAGE);
    }
});

/* Listen on a port. */
app.listen(process.env.PORT || 3000);
