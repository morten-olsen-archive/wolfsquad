boot.def('ui/windowmanager', ['core'], function (exports, core) {
	var me = {},
		windows = {};

	me.attachWindow = function (id, w) {
		windows[id] = w;
	}

	me.detachWindow = function (id) {
		delete windows[id];
	}

	return me;
});