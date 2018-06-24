/* Require dependencies. */
var express    = require('express');
var path       = require('path');
var crypto     = require('crypto');
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
    /* Generate HTML so that it can't be directly accessed by filename. */
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
                     '<input type="text" id="memetxt" ' +
                     'oninput="bEmoji()"/><br/>' +
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
    if (req.query.tkn == null) {
        res.sendStatus(400);
    }
    db.collection('tokens', function(error, coll) {
        if (error) {
            res.sendStatus(500);
        } else {
            coll.find({id: req.query.tkn}).toArray(function(error, results) {
                if (error) {
                    res.sendStatus(500);
                } else {
                    if (results.length == 0) {
                        res.sendStatus(400);
                    } else {
                        db.collection('memes', function(error, coll) {
                            if (error) {
                                res.sendStatus(500);
                            } else {
                                coll.find().toArray(function(error, results) {
                                    if (error) {
                                            res.sendStatus(500);
                                    } else {
                                        /* List memes chronologically. */
                                        results.reverse();
                                        res.send(results);
                                    }
                                });
                            }
                        });
                    }
                }
            });
        }
    });
});

/* POST login to meme page. */
app.post('/login', function(req, res) {
    if (req.body.pwd == null) {
        res.sendStatus(400);
    } else if (req.body.pwd != process.env.MEMEPWD) {
        res.sendStatus(501);
    } else {
        var token = crypto.randomBytes(12).toString('hex');
        db.collection('tokens', function(error, coll) {
            if (error) {
                res.sendStatus(500);
            } else {
                coll.insert({id: token, time: new Date()});
                /* Clear old tokens. */
                coll.find().toArray(function(error, results) {
                    for (var i = 0; i < results.length; i++) {
                        var rn   = new Date();
                        var mins = (rn.getTime() - results[i].time.getTime());
                        mins /= 6000;
                        if (mins >= 3) {
                            coll.deleteOne({id: results[i].id});
                        }
                    }
                });
            }
        });

        var obj = {
            tokenid: token,
            url:     process.env.MEMEPAGE
        }
        res.send(obj);
    }
});

/* POST meme to database. */
app.post('/submitmeme', function(req, res){ 
    if (req.body.name == null || 
        req.body.txt == null  || 
        req.body.tkn == null) {
        res.sendStatus(400);
    } else {
        /* Check for token in database. */
        db.collection('tokens', function(error, coll) {
            if (error) {
                res.sendStatus(500);
            } else {
                coll.find({id: req.body.tkn}).toArray(function(error, results) {
                    if (error) {
                        res.sendStatus(500);
                    } else {
                        if (results.length == 0) {
                            res.sendStatus(400);
                        } else {
                            /* Implement XSS protection. */
                            var meme = {
                                name: req.body.name.replace('<', ''),
                                txt:  req.body.txt.replace('<', '')
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
                    }
                });
            }
        });
    }
});

/* Listen on a port. */
app.listen(process.env.PORT || 3000);
