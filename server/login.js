var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var faker = require('faker');
var users = require('./data/users');

const app = express();

app.get('/create', function(req, res) {
  res.sendFile(path.join(__dirname, '../pages/create_start.html'))
});

app.post('/create', urlencodedParser, function(req, res) {
  var key = faker.internet.password();
  users.signup(req.body.mail, key).then(function (user) {
    console.log(user);
    res.end('done, ' + key);
  });
});

module.exports = app;
