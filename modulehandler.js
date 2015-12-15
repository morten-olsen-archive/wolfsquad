var express = require('express'),
	fs = require('fs'),
	app = express(),
	aes = require('gibberish-aes/dist/gibberish-aes-1.0.0.js');

app.get('*', function (req, res, next) {
	var userId = req.header('user-id');

	var content = fs.readFileSync(__dirname + '/modules' + req.params[0] + '.js', 'utf-8');
	if (userId != 'admin') {
		res.end();
	}

	var encrypted = aes.enc(content, 'password');

	res.end(encrypted);
});

exports = module.exports = app;