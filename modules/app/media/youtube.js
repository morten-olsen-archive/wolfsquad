boot.def('app/media/youtube', ['core', 'ui/window'], function (exports, core, Window) {
	var me = {};

	me.open = function (options) {
		var target = new Window ({
			title: 'Video',
			resizable: true,
			width: '500px',
			height: '400px',
			html: core.ml(function () {/**
				<iframe seamless style="border: none; width: 100%; height: 100%;" />
			**/})
		});

		window.t = target.el.querySelector('iframe');
		target.el.querySelector('iframe').src = '//www.youtube.com/embed/' + options.id + '?autoplay=true&showInfo=false'
		target.show();


		document.querySelector('audio').pause();
		var c = target.close;
		target.close = function () {
		document.querySelector('audio').play();
			c();
		};
		return target;
	}

	return me;
});