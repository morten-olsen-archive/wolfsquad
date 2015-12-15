boot.def('app/composemail', ['core', 'ui/window'], function (exports, core, Window) {
	var me = {};

	me.open = function () {
		var compose = new Window ({
			title: 'Compose Secure Maile',
			resizable: false,
			width: '500px',
			html: core.ml(function () {/**
				<style>

				input, textarea {
					display: block;
					user-resize: none;
					outline: none;
					width: 100%;
					border: none;
					padding: 15px;
					font-family: 'Special Elite', cursive;
					background: #fff;
					color: #222;
					font-size: 1.1em;
				}
				button {
					font-family: 'Orbitron', sans-serif;
					font-size: 1.1em;
					border: none;
					background: none;
					color: #fff;
					outline: none;
					float: right;
					padding: 15px;
				}

				button:hover {
					color: red;
				}
				</style>
				<div>
					<input class="time" />
					<input class="email" placeholder="blackhound@wolf-squad.inc" />
					<textarea style="height:400px;" placeholder="Message">
Dear Eagles Nest.

Today we went to the beach. It was fun. Private Johnson took my beachball, which was not so fun.

Best regards
Commander Blackhound
					</textarea>
					<button>Send</button>
					<button class="readback">Read back</button>
				</div>
			**/})

			
		});

		window.s = compose;
		var text = compose.el.querySelector('textarea');
		var email = compose.el.querySelector('.email');

		text.placeholder = text.value;
		text.value = '';
		compose.el.querySelector('.time').placeholder = (new Date());
		compose.el.querySelector('.readback').addEventListener('click', function () {
			boot.load('utils/voice', function (voice) {
				var content = text.value != '' ? text.value : text.placeholder;
				var from = email.value != '' ? email.value : email.placeholder;
				voice.say('from ' + from);
				voice.read(content);
			});
		});
		compose.show();

		compose.setLocation({
			left: window.innerWidth  / 2 - (compose.getOuterSize().width / 2),
			top: 50
		});
	}

	return me;
});
