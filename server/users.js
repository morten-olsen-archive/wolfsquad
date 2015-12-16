
var Parse = require('parse/node');
exports.list = [];

exports.getKey = function (username) {
  for (var i = 0; i < exports.list.length; i++) {
    if (exports.list[i].username === username) {
      return exports.list[i].key;
    }
  }
}

exports.update = function() {
  return new Promise(function (resolve, failed) {
    exports.list = [];
    var q2 = new 	Parse.Query(Parse.User);
    q2.find({success:function(items){
      exports.list = items.map(function(item) {
        return {
          username: item.get('username'),
          key: item.get('key'),
        }
      })
      resolve(exports.list);
    }});
  });
}

exports.load = exports.update();
