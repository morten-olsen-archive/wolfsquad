var Parse = require('parse/node');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var faker = require('faker');
var users = require('./users');

const app = express();

app.get('/create', function(req, res) {
  res.sendFile(path.join(__dirname, '../pages/create_start.html'))
});

app.post('/create', urlencodedParser, function(req, res) {
  var key = faker.internet.password();
  Parse.User.signUp(req.body.mail, 'nopassword', {
    type: req.body.logintype,
    key: key,
  });
  users.update();
  res.end('done, ' + key);
});

module.exports = app;
