boot.def('app/profiles/morten', ['ui/bgmap', 'app/location/maps'], function (exports, bgmap, map) {
	var me = {};

	me.open = function () {
		bgmap.setLocation('copenhagen, denmark');

		boot.load('core', 'ui/window' , function (core, Window) {
			var target = new Window ({
				title: 'Contact: Morten Olsen',
				resizable: false,
				border: true,
				html: core.ml(function () {/**
					<div style="padding: 30px">
						<div>Name: Morten Olsen</div>
						<div>Location: Copenhagen, Denmark</div>
						<div>Occupation: Developer</div>
						<div>Mail: morten@olsen.io</div>
					</div>
				**/})
			});
			target.show();

			var picture = new Window ({
				title: 'Picture',
				width: '200px',
				height: '200px',
				html: core.ml(function () {/**
					<div style="
						width:100%;
						height:100%; 
						background-image:url(https://lh3.googleusercontent.com/-SzOPQYYLnTk/Uu6llr1ebKI/AAAAAAAAU6M/TBcHFE2qF8A/w640-h642-no/me.jpg);
						background-size:cover;
						background-position: center;" />
				**/})
			});
			picture.show();

			var targetMap = map.open();

			targetMap.setAddress('Langebrogade 6, copenhagen');

			targetMap.setLocation({
				left: window.innerWidth - targetMap.getOuterSize().width - 50,
				top: 50
			});

			picture.setLocation({
				left: window.innerWidth - picture.getOuterSize().width - 50,
				top: targetMap.getOuterSize().height + targetMap.getLocation().top + 20
			});

			target.setLocation({
				left: picture.getLocation().left - target.getOuterSize().width - 40,
				top: targetMap.getOuterSize().height + targetMap.getLocation().top + 20
			})
		});

		boot.load('core', 'utils/voice', function(core, voice) {
			voice.say(core.ml(function () {/**
Your comander, Morten Olsen is a highly trained web and mobile developer.
Stationed out in Copenhagen where he works undercover at Trend Sales dot D K.
.He is also aspiering with internet security and the person who designed me.
			**/}));

			voice.say(core.ml(function () {/**
Your mission, should you choose to accept it. Will be to take contact to him in order to set up a meeting
where a plan for the current mission can be discussed.
			**/}));

			voice.say(core.ml(function () {/**
Be adviced, that some people regard him as a bit crazy from time to time. I mean, just look at this webpage.
			**/}));

			voice.say('Good luck private')
		});
	}

	return me;
});