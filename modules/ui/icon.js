boot.def('ui/icon', ['core', 'ui'], function (exports, core, ui) {
	return function (iconSrc, title) {
		var me = {},
			icon = ui.createElement(function() {/**
			<div>
				<div class="if" style="text-align:center;">
				</div>
				<div class="title" style="text-align:center; margin-top:10px;">Mission Briefing<div>
			</div>
			**/});

		icon.className = 'icon'
		icon.style.cursor = 'pointer';
		icon.querySelector('.title').innerHTML = title;

		var xhr = new XMLHttpRequest();
		xhr.open('get', 'Filled/small/' + iconSrc, true);
		xhr.onload = function () {
			icon.querySelector('.if').innerHTML = xhr.responseText;
		};
		xhr.send();

		icon.onclick = function () {
			if (typeof me.action === 'function') {
				me.action();
			}
		};

		me.el = icon;

		return me;
	};
});