boot.def('app/desktop', ['core', 'ui/icon', 'ui/bgmap'], function (exports, core, Icon, bgmap) {

	var icons = [],
		height = 110,
		width = 150;

	var addIcon = function (iconSrc, title, action) {
		var icon = new Icon(iconSrc, title);
		icon.el.style.transition = 'all .3s';

		icon.action = action;

		document.body.appendChild(icon.el);
		icons.push(icon);

		positionIcons();
	};

	var positionIcons = function () {
		var row = 0,
			col = 0,
			maxRows = Math.floor((window.innerHeight - 40) / height) - 1;

		for (var i = 0; i < icons.length; i++) {
			if (row > maxRows) {
				row = 0;
				col++;
			};

			var icon =icons[i];
			icon.el.style.top = (20 + row * height) + 'px';
			icon.el.style.left = (20 + col * width) + 'px';

			row++;
		};
	}

	window.addEventListener('resize', function () {
		positionIcons();
	});

	addIcon('11-Users/id-1.svg', 'Commander Profile', function () {
		core.open('profiles/morten');
	});

	addIcon('10-Email/plane-paper-1.svg', 'Contact Commander', function () {
		core.open('composemail');
	});

	addIcon('10-Email/plane-paper-1.svg', 'Blog', function () {
		core.open('blog/main');
	});

	addIcon('18-Folders/folder-bookmark.svg', 'Browser Test', function () {
		core.open('browser', {
			src: 'https://www.dr.dk'
		});
		setTimeout(function () {
				boot.load('utils/voice', function (voice) {
					voice.say('This actually has no relevanse to the current mission.');
					voice.say('I think it might just be some developer test?');
				});
			}, 2000);
	});

	addIcon('14-Video/handycam.svg', 'Situation Report', function () {
		core.open('media/youtube', {
			id: 'y_0s9pfF6EQ'
		}, function (app) {
			app.setLocation({
				left: window.innerWidth - app.getOuterSize().width - 50,
				top: window.innerHeight - app.getOuterSize().height - 20
			});
			setTimeout(function () {
				boot.load('utils/voice', function (voice) {
					voice.say('My regards, that appears to be a bit broken. I know some new content is in the making, but for now you can enjoy some Danish culture.')
					voice.say('At least it is not ponies');
				});
			}, 4000);
		});
	});
});
