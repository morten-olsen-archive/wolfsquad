boot.def('app/browser', ['core', 'ui/window'], function (exports, core, Window) {
	var me = {};

	me.open = function (options) {
		var target = new Window ({
			title: 'Contact: Morten Olsen',
			resizable: true,
			width: '500px',
			height: '400px',
			html: core.ml(function () {/**
				<iframe seamless style="border: none; width: 100%; height: 100%;" />
			**/})
		});

		window.t = target.el.querySelector('iframe');
		target.el.querySelector('iframe').src = options.src
		target.show();
	}

	return me;
});
