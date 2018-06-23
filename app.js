/* Require dependencies. */
var express    = require('express');
var path       = require('path');
var bodyparser = require('body-parser');
var validator  = require('validator');
var app = express();

/* Require and configure MongoDB. */
var mongoUri = "mongodb://" + process.env.DBUSER + ":" + 
               process.env.DBPASS + "@ds117111.mlab.com:17111/memes2018";
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
    res.send('<!doctype html>' +
             '<html>' +
                 '<head>' +
                     '<title>Memes</title>' +
                     '<meta charset="utf-8" />' +
                     '<link href="style.css" rel="stylesheet" />' +
                     '<script src="js/jquery-3.3.1.min.js"></script>' +
                     '<script src="js/memeOps.js"></script>' +
                 '</head>' +
                 '<body>' +
                     '<div id="title">Memes</div>' +
                     '<div id="submit">' +
                     '<br/><label>What\'s your meme?</label><br/>' +
                     '<input type="text" id="memetxt"/><br/>' +
                     '<label>Who are you?</label><br/>' +
                     '<input type="text" id="memename"/><br/>' +
                     '<button type="button" onclick="submitMeme()">' +
                     'Submit the meme</button><br/><br/>' +
                     '<label id="ty"></label>' +
                     '</div>' +
                     '<label id="errormsg"></label>' +
                     '<div id="memes">' +
                     '</div>' +
                 '</body>' +
             '</html>');
});

/* GET memes from database. */
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

/* POST meme to database. */
app.post('/submitmeme', function(req, res){ 
    if (req.body.name == null || req.body.txt == null) {
        res.sendStatus(400);
    } else {
        var meme = {
            name: req.body.name,
            txt:  req.body.txt
        }
        db.collection('memes', function(error, coll) {
            if (error) {
                res.sendStatus(500);
            } else {
                coll.insert(meme);
                res.sendStatus(200);
            }
        });
    }
});

/* Listen on a port. */
app.listen(process.env.PORT || 3000);
