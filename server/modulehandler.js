var express = require('express'),
	fs = require('fs'),
	app = express(),
	users = require('./users');
	aes = require('gibberish-aes/dist/gibberish-aes-1.0.0.js');

app.get('*', function (req, res, next) {
	var userId = req.header('user-id');
	var key = users.getKey(userId);
	if (!key) {
		res.end();
	}
	var content = fs.readFileSync(__dirname + '/../modules' + req.params[0] + '.js', 'utf-8');
	var encrypted = aes.enc(content, key);
	res.end(encrypted);
});

exports = module.exports = app;
