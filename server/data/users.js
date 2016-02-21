var db = require('./db');

exports.getKey = function (username) {
  return db.User.collection().fetchOne().then(function(user) {
    return user && user.get('key');
  });
}

exports.signup = function(email, key) {
  var user = new db.User({
    name: email,
    key: key
  });

  return user.save();
}
