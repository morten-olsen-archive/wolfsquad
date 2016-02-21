var users = require('../data/users');
var aes = require('gibberish-aes/dist/gibberish-aes-1.0.0.js');
var concat = require('concat-stream');

module.exports = function (req, res, next) {
  req.pipe(concat(function(data){
    var userId = req.header('user-id');
  	users.getKey(userId).then(function (key) {
      console.log('data', data);

      if (data.length > 0) {
        var stringData = aes.dec(data, key);
        res.body = JSON.parse(stringData);
      }

      res.secureSend = function(data) {
        var stringData = JSON.stringify(data);
        var encryptedData = aes.enc(stringData, key);
        res.end(encryptedData);
      }

      next();
    });
  }));
}
