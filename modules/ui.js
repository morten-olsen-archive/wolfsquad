boot.def('ui', ['core'], function (exports, core) {
	'use strict';

	var modifyValues;

	exports.createElement = function (content, type) {
		type = (type || 'div')
		var element = document.createElement(type);
		element.innerHTML = core.ml(content);
		return element;
	};

	return exports;
});