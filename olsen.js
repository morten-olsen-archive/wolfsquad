var express = require('express');
var app = express();
var server = require('http').Server(app);
var aes = require('gibberish-aes/dist/gibberish-aes-1.0.0.js');
var fs = require('fs');
var lessMiddleware = require('less-middleware');
var Parse = require('parse/node');
Parse.initialize("3ZmEJnVmCsDDqW4CbOquu3ju462o1nTb4Swgtmfw", "KLkPl6kNEr4w4bGAYLLegiHD0ZbUz21FSIPGjgoh");
var users = require('./server/users');

server.listen(process.env.PORT || 3005);

users.load.then(function (u) {
	app.use(lessMiddleware(__dirname + '/public'));
	app.use(express.static(__dirname + '/public'));
	app.use('/modules', require(__dirname + '/server/modulehandler.js'));
	app.use('/login', require('./server/login'));
	app.use('/api', require('./server/api'));
	app.get('/gibberish', function (req, res) {
		res.sendFile(__dirname + '/node_modules/gibberish-aes/dist/gibberish-aes-1.0.0.js');
	});
	require('./server/socket')(server);
}).catch(function (err) {
	console.error(err);
});
