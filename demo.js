boot.load('core', 'window', function (core, Window) {
	window.w = new Window({
		html: core.ml(function () {/**
			<h1>Hello World</h1>
		**/})
    });
    w.show();
});