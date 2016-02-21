var users = require('./data/users');

module.exports = function(server) {
  var io = require('socket.io')(server);

  io.on('connection', function (socket) {
  	var guid = (function() {
  		function s4() {
  			return Math.floor((1 + Math.random()) * 0x10000)
  			.toString(16)
  			.substring(1);
  		}
  		return function() {
  			return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
  			s4() + '-' + s4() + s4() + s4();
  		};
  	})();

  	socket.emit('authenticate', { });
  	socket.on('authentication', function (data) {
  		users.getKey(data.userId).then(function(key) {
        socket.key = key;
    		try {
    			var v = aes.dec(data.verification, socket.key);
    			if (v !== data.userId) {
    				socket.emit('accessdenied', {}, function () {
    					socket.close();
    				});
    				return;
    			}
    		} catch (ex) {
    			socket.emit('accessdenied', {}, function () {
    				socket.close();
    			});
    			return;
    		}

    		socket.id = data.userId;
    		socket.secureSend = function (data, type) {
    			type = (type || 'data');
    			data.type = type;
    			var key = guid();
    			var secureKey = aes.enc(key, socket.key)
    			var encrypted = aes.enc(JSON.stringify(data), key);
    			socket.emit('data', {
    				key: secureKey,
    				content: encrypted
    			});
    		};

    		socket.secureSend({
    			modules: ['app/desktop'],
    			say: 'Goodmorning private, your new mission briefing is waiting... The internet is counting on you'
    		}, 'loadmodules');
      });
  	});

  	socket.on('data', function (data) {
  		var key = aes.dec(data.key, socket.key);
  		var content = JSON.parse(aes.dec(data.content, key));
  	});
  });

}
