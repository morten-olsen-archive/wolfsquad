boot.def('ui/window', ['core', 'ui', 'ui/windowmanager'], function (exports, core, ui, windowmanager) {
	'use strict';

	var modifyValues,
		zIndex = 100,
		windowId = 0,
		blocking = document.createElement('div');

	blocking.style.left = '0';
	blocking.style.top = '0';
	blocking.style.right = '0';
	blocking.style.bottom = '0';
	blocking.style.background = 'transparent';

	var moveSetValues = function (type, elm, x, y) {
		modifyValues = {
			type: type,
			x: elm.offsetLeft,
			y: elm.offsetTop,
			startX: x,
			startY: y,
			elm: elm
		};
		if (type === 'resize') {
			modifyValues.x = elm.offsetWidth;
			modifyValues.y = elm.offsetHeight;
		}
	};

	var moveSetLocation = function (elm, x, y) {
		if (!modifyValues) return;

		requestAnimationFrame(function () {
			if (modifyValues.type === 'move') {
				var offsetX = modifyValues.x + (x - modifyValues.startX);
				modifyValues.elm.style.left = offsetX + 'px';

				var offsetY = modifyValues.y + (y - modifyValues.startY);
				modifyValues.elm.style.top = offsetY + 'px';

				modifyValues.elm.setRotation();
			}
			else if (modifyValues.type === 'resize') {
				var offsetX = modifyValues.x + (x - modifyValues.startX);
				modifyValues.elm.style.width = offsetX + 'px';

				var offsetY = modifyValues.y + (y - modifyValues.startY);
				modifyValues.elm.style.height = offsetY + 'px';
			}
		});
	}

	document.addEventListener('mousemove', function (evt) {
		if (evt.which === 0) {
			blocking.remove();
			modifyValues = null;
		}
		moveSetLocation(evt.target, evt.x, evt.y);
	});

	document.addEventListener('touchmove', function (evt) {
		moveSetLocation(evt.target, evt.changedTouches[0].clientX, evt.changedTouches[0].clientY);
	});

	document.addEventListener('mouseup', function (evt) {
		blocking.remove();
		modifyValues = null;
	});

	document.addEventListener('touchend', function (evt) {
		blocking.remove();
		modifyValues = null;
	});

	var constructor = function (options) {
		var w = {},
			container,
			host,
			id;

		options = options || {};
		zIndex++;
		windowId++;
		id = windowId;


		container = ui.createElement(function () {/**
			<div class="close">x</div>
			<div class="title"></div>
			<div class="inner"></div>
			<div class="resize">&nbsp;</div>
		**/});

		container.className = 'window';
		container.style.zIndex = zIndex;
		container.inner = container.querySelector('.inner');
		container.title = container.querySelector('.title');
		container.close = container.querySelector('.close');
		container.resize = container.querySelector('.resize');
		host = container.inner.createShadowRoot();

		if (!!options.width) container.inner.style.width = options.width;
		if (!!options.height) container.inner.style.height = options.height;
		if (!!options.title) container.querySelector('.title').innerHTML = options.title;
		if (!!options.html) host.innerHTML = options.html;
		if (options.close === false) container.close.style.display = 'none';
		if (options.resizable === false) container.resize.style.display = 'none';
		if (options.border === true) container.style.border = 'solid 1px #9e0b0f';

		container.setRotation = function (left) {
			if (window.innerWidth > 500) {
				left = left || container.offsetLeft;
				var rotation = 10 - (left / window.innerWidth) * 40; 
				container.style.transform = 'rotateY(' + rotation + 'deg)';
			} else {
				left = left || container.offsetLeft;
				var rotation = 3 - (left / window.innerWidth) * 15; 
				container.style.transform = 'rotateY(' + rotation + 'deg)';
			}
		};

		w.el = host;

		w.setLocation = function (options) {
			options = options || {};
			if (!options.left) options.left = container.offsetLeft + 'px';
			if (!options.top) options.top = container.offsetTop + 'px';

			container.style.left = options.left;
			container.style.top = options.top;

			container.setRotation();
		};

		w.getLocation = function () {
			return {
				left: container.offsetLeft,
				top: container.offsetTop
			}
		};

		w.setSize = function (options) {
			options = options || {};
			if (!options.width) options.width = container.offsetWidth + 'px';
			if (!options.height) options.height = container.offsetHeight + 'px';

			container.style.width = options.width;
			container.style.height = options.height;
		};

		w.getOuterSize = function () {
			return {
				width: container.offsetWidth,
				height: container.offsetHeight
			}
		}

		w.show = function (options) {
			options = options || {};

			if (!!options.left) container.style.left = options.left;
			if (!!options.top) container.style.top = options.top;

			windowmanager.attachWindow(id, w);

			document.body.appendChild(container);
		};

		w.hide = function () {
			container.remove();
		};

		w.close = function () {
			windowmanager.detachWindow(id);
			w = undefined;
		}

		window.addEventListener('resize', function (evt) {
			if (container.offsetWidth + container.offsetLeft > window.innerWidth) {
				container.style.left = window.innerWidth - container.offsetWidth + 'px';
			}
			if (container.offsetHeight + container.offsetTop > window.innerHeight) {
				container.style.top = window.innerHeight - container.offsetHeight + 'px';
			}
			if (container.offsetLeft < -container.offsetWidth + 50) {
				container.style.left ='0px';
			}
			if (container.offsetTop < 0) {
				container.style.top ='0px';
			}
			container.setRotation();
		});

		container.close.addEventListener('click', function () {
			w.hide();
			w.close();
		});


		container.addEventListener('touchstart', function (evt) {
			if (evt.target === container || evt.target === container.title) {
				moveSetValues('move', container, evt.changedTouches[0].clientX, evt.changedTouches[0].clientY);
			} else if (evt.target === container.resize) {
				moveSetValues('resize', container.inner, evt.changedTouches[0].clientX, evt.changedTouches[0].clientX);
			}
		});

		container.addEventListener('mousedown', function (evt) {
			if (container.style.zIndex < zIndex) {
				zIndex++;
				container.style.zIndex = zIndex;
			}
			blocking.style.zIndex = zIndex + 1;
			if (evt.target === container || evt.target === container.title) {
				document.body.appendChild(blocking);
				moveSetValues('move', container, evt.x, evt.y);
			} else if (evt.target === container.resize) {
				document.body.appendChild(blocking);
				moveSetValues('resize', container.inner, evt.x, evt.y);
			}
		});

		return w;
	};

	return constructor;
});