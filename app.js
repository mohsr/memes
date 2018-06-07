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

/* GET home page. */
app.get('/', function(req, res) {
	res.sendFile('index.html');
});

/* Listen on a port. */
app.listen(process.env.PORT || 3000);
