(function () {

	if (typeof speechSynthesis === 'undefined') {
		location.href = '/upgrade.html';
	}
	navigator.geolocation.getCurrentPosition(function (position) {
	});
	speechSynthesis.cancel();
	window.speechSynthesis.getVoices();
	window.auth = function(id, pass) {
		speechSynthesis.cancel();
		delete window.auth;

		var socket = io.connect('//' + location.host),
			calls = {};

		socket.on('authenticate', function (data) {
			socket.emit('authentication', {
				userId: id,
				verification: GibberishAES.enc(id, pass)
			});
		});

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

		socket.on('accessdenied', function () {
			var error = document.createElement('div');
			error.className = 'accessdenied';
			error.innerHTML = 'Access Denied';
			document.body.appendChild(error);
		});

		socket.on('data', function (data) {
			var key = GibberishAES.dec(data.key, pass);
			var content = JSON.parse(GibberishAES.dec(data.content, key));

			if (!!content.say) {
				boot.load('utils/voice', function (voice) {
					voice.say(content.say);
				});
				/*var msg = new SpeechSynthesisUtterance();
				var voices = window.speechSynthesis.getVoices();
				msg.voice = voices[2]; // Note: some voices don't support altering params
				msg.voiceURI = 'native';
				msg.volume = 1; // 0 to 1
				msg.rate = 1; // 0.1 to 10
				msg.pitch = 2; //0 to 2
				msg.text = content.say;
				msg.lang = 'en-UK';

				msg.onend = function(e) {
				  console.log('Finished in ' + event.elapsedTime + ' seconds.');
				};

				speechSynthesis.speak(msg);*/
			}
			if (content.type === 'loadmodules') {

				content.modules.push (function () {
					console.log('loaded');
				});

				console.log(content.modules);
				boot.load.apply(null, content.modules);
			} else {
				if (!!calls[data.key]) {
					calls[data.key](content);
				}
			}
		});

		window.apps = {};

		window.service = {};
		socket.secureSend = function(data, type, callback) {
			type = (type || 'data');
			data.type = type;

			var key = guid();
			var secureKey = GibberishAES.enc(key, pass);

			if (typeof callback === 'function') {
				calls[secureKey] = callback;
				data.sequence = true;
			}

			var encrypted = GibberishAES.enc(JSON.stringify(data), key);
			socket.emit('data', {
				key: secureKey,
				content: encrypted,
			});
		};

		/* Bootloader */
		(function () {
		    'use strict';

		    var me = window.boot = {},
		        cache = me.cache = {},
		        loading = me.loading = {},
		        waiting = me.waiting =  [],
		        version = window.jsversion || '0',
		        lCache = window.cache = (window.cache || {
		            get : function () { return false; },
		            set : function () {}
		        });




		    /**
		     * Actually invoke a waiting call with the dependancies
		     *
		     * @public
		     * @param {object} call - the waiting call
		     */
		    function invoke(call) {
		        var dep = [],
		            i = null;

		        for (i = 0; i < call.dep.length; i += 1) {
		            // Each dependency is added to the array
		            dep.push(cache[call.dep[i]]);
		        }
		        // the original callback is called with the dependencies as arguments
		        call.cb.apply(window, dep);
		    }




		    /**
		     * Creates an xhr loader.
		     * This is selfcontained, since the downloaded code is evaled, and should
		     * contain a R.def(...)
		     *
		     * @public
		     * @param {string} name - The name of the module to be loaded.
		     */
		    function getLoader(name) {
		        return function () {
		            var xhr = new XMLHttpRequest();
		            xhr.onload = function () {
		                // This is evil, but nessecary
		                var content = GibberishAES.dec(xhr.responseText, pass);
		                eval(content);
		                // Only if the local-storage cache module is loaded
		                lCache.set(name, content);
		            };
		            // Download the module from a versioned url
		            xhr.open('GET', '/modules/' + name, true);
		            xhr.setRequestHeader('user-id', id);
		            xhr.send();
		        };
		    }




		    /**
		     * Define a new module.
		     * @param {string} name - The name of the module
		     * @param {array} dependencies - A list of modules needed by the module
		     * @param {function} init - The constructor code
		     */
		    me.def = function (name, dep, init) {
		        // We actually need to load the module through the loader itself
		        // to ensure all dependencies are ready, therefor we
		        // add the creation code as the last element of the dependencies
		        // so we can use window.R.load('dep1', 'dep2', ..., callback);
		        dep.push(function () {
		            var args = Array.prototype.slice.call(arguments, 0),
		                obj = null,
		                i = 0,
		                missing = null;

		            // Add an empty object to the start of the array, to be 'exports'
		            args.unshift({
		            	socket: socket
		            });

		            // Invoke the actual constructor, with all dependancies loaded, and
		            // with exports as the first item.
		            obj = init.apply(window, args);

		            // Add it to the cache, so we don't have to load it again.
		            cache[name] = obj;

		            // Next we need to see it this module is the last needed by any of our
		            // waiting calls, so we can invoke them.
		            for (i = 0; i < waiting.length; i += 1) {

		                // Check if the current module is a dependency for the call
		                if (!!waiting[i].waiting[name]) {

		                    // If it is, remove it form the list of missing modules
		                    delete waiting[i].waiting[name];

		                    // Check if any missing modules left
		                    if (Object.keys(waiting[i].waiting).length === 0) {
		                        // If there are no more modules to wait for, the call is invoked
		                        invoke(waiting[i]);
		                    }
		                }
		            }
		        });
		        // Invoke the loader
		        me.load.apply(window, dep);
		    };




		    /**
		     * Fetch a series of module, using load('dep1', 'dep2', ..., function (dep1, dep2, ...) {
		     * });
		     *
		     * @public
		     */
		    me.load = function () {
		        // Creates a copy of arguments, which we can manipulate
		        var args = Array.prototype.slice.call(arguments, 0);

	            // Move the last argument to callback, so left is only the modules
	            var cb = args.pop(),
	                i = 0,
	                call = null,
	                data = null;

	            call = {
	                cb : cb,
	                dep : args,
	                waiting : {}
	            };

	            // Loop though all dependencies
	            for (i = 0; i < args.length; i += 1) {

	                // Check if local storage caching is enabled
	                if (lCache.get(args[i])) {
	                    // if, load the module data from it
	                    data = lCache.get(args[i]);
	                    // And load the module, so it is ready

	                    eval(data);
	                }

	                // Check if the module is previously loaded
	                if (!!cache[args[i]]) {
	                    continue;
	                }

	                // Add the module as a missing module to be loaded
	                call.waiting[args[i]] = true;

	                // See if the module is already loading
	                if (loading[args[i]]) {
	                    continue;
	                }

	                // Ensure that multible call to same dependencies,
	                // only download one
	                loading[args[i]] = true;

	                // Create a loader, and start it in a new thread
	                // note: might not be nessecary to use setTimeout?
	                setTimeout(getLoader(args[i]), 10);
	            }

	            // If no dependencies are missing...
	            if (Object.keys(call.waiting).length === 0) {
	                // ...then just invoke the call
	                invoke(call);
	            } else {
	                // Else add it to the list of waiting calls
	                waiting.push(call);
	            }
		    };
		}());

		document.getElementById('teaser').remove();
		terminal.remove();

		document.addEventListener("webkitfullscreenchange", function () {
			if (!document.webkitIsFullScreen) {
				location.href = location.href;
			};
		}, false);

		var elem = document.documentElement;
		if (elem.requestFullscreen) {
		  elem.requestFullscreen();
		} else if (elem.msRequestFullscreen) {
		  elem.msRequestFullscreen();
		} else if (elem.mozRequestFullScreen) {
		  elem.mozRequestFullScreen();
		} else if (elem.webkitRequestFullscreen) {
		  elem.webkitRequestFullscreen();
		}

		boot.load('utils/idletalk', function (b) { console.log('ready to talk')});

		document.querySelector('audio').volume = .3;
		document.querySelector('audio').play();

	}

	document.onbeforeunload= function () {
		return 'tet';
	}

	var username = null;
	document.getElementById('terminal').addEventListener('keyup', function (evt) {

		var terminal = document.getElementById('terminal');
		if (evt.keyCode === 13 && !evt.shiftKey) {
			if (username === null) {
				username = terminal.value;
				terminal.type = 'password';
				terminal.placeholder = 'password'
			} else {
				auth(username, terminal.value);
			}
			terminal.value = '';
		}
	});
	document.getElementById('terminal').focus();

	(function (c) {
		var oldLog = c.log;

		c.log = function () {
			oldLog.apply(this, arguments);
		};

	})(console);

	//auth('admin', 'password');
}());
