var express = require('express');

var app = express();

app.use(require('./security'));
app.use('/blog', require('./blog'));

module.exports = app;
