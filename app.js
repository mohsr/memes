/* Require dependencies. */
var express    = require('express');
var path       = require('path');
var bodyparser = require('body-parser');
var validator  = require('validator');
var app = express();

/* Set up app for use. */
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'client')));

/* GET home login page. */
app.get('/', function(req, res) {
	res.sendFile('index.html');
});

/* GET main meme page. */
app.get(process.env.MEMEPAGE, function(req, res) {
	res.sendFile(process.env.MEMEPAGE + '.html');
});

/* POST login password. */
app.post('/login', function(req, res) {
	var pwd = req.body.pwd;
	if (pwd == null || pwd != process.env.MEMEPWD) {
		res.sendStatus(404);
	} else {
		res.send('/main');
	}
});

/* Listen on a port. */
app.listen(process.env.PORT || 3000);
