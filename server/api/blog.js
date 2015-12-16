var express = require('express');
var faker = require('faker');
var app = express();

app.get('/', function (req, res) {
  var response = [];
  for (var i = 0; i < 20; i++) {
    response.push({
      title: faker.lorem.sentence()
    });
  }
  res.secureSend(response);
});

module.exports = app;
