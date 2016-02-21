var express = require('express');
var app = express();
var server = require('http').Server(app);
var aes = require('gibberish-aes/dist/gibberish-aes-1.0.0.js');
var fs = require('fs');
var lessMiddleware = require('less-middleware');
var users = require('./server/data/users');
var db = require('./server/data/db');

db.init.then(function () {
	app.use('/login', require('./server/login'));
	app.use(lessMiddleware(__dirname + '/public'));
	app.use(express.static(__dirname + '/public'));
	app.use('/modules', require(__dirname + '/server/modulehandler.js'));
	app.use('/api', require('./server/api'));
	app.get('/gibberish', function (req, res) {
		res.sendFile(__dirname + '/node_modules/gibberish-aes/dist/gibberish-aes-1.0.0.js');
	});
	require('./server/socket')(server);
	server.listen(process.env.PORT || 3005);
}).catch(function (err) {
	process.stderr.write(err.stack);
});
