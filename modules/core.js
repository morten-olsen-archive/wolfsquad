boot.def('core', [], function (exports) {
	var me = {};

	me.ml = function (f) {
		return f.toString().split('\n').slice(1, -1).join('\n');
	}

	me.open = function (name, options, cb) {
		boot.load('app/' + name, function (app) {
			if (typeof app.open === 'function') {
				var i = app.open(options);


				if (!!cb) cb(i);
			}
		});
	}

	return me;

});