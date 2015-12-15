var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var aes = require('gibberish-aes/dist/gibberish-aes-1.0.0.js');
var fs = require('fs');
var lessMiddleware = require('less-middleware');

server.listen(process.env.PORT || 3005);

app.use(lessMiddleware(__dirname + '/public'));
app.use(express.static(__dirname + '/public'));

app.use('/modules', require(__dirname + '/modulehandler.js'));

app.get('/gibberish', function (req, res) {
	res.sendFile(__dirname + '/node_modules/gibberish-aes/dist/gibberish-aes-1.0.0.js');
});

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

		socket.key = 'password';

		try {
			var v = aes.dec(data.verification, socket.key);
			if (data.userId !== 'admin' || v !== data.userId) {
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
		/*socket.sendApp = function (name) {
			var script = fs.readFileSync(__dirname + '/apps/' + name + '.js', 'utf-8');
			socket.secureSend({
				name: name,
				script: script
			}, 'app');
		};*/

		//socket.sendApp('desktop');

	});

	socket.on('data', function (data) {
		var key = aes.dec(data.key, socket.key);
		var content = JSON.parse(aes.dec(data.content, key));

		/*if (content.type == 'app') {
			socket.sendApp(content.name);
		}*/
	});
});
