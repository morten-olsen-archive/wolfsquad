boot.def('utils/voice', [], function (exports) {
	var me = {};

	me.read = function (message, cb) {
		var msg = new SpeechSynthesisUtterance();
		var voices = window.speechSynthesis.getVoices();
		msg.voiceURI = 'native';
		msg.volume = 1; // 0 to 1
		msg.rate = 1; // 0.1 to 10
		msg.pitch = 1; //0 to 2
		msg.text = message.replace(/\./g, ' .stop. ');
		msg.lang = 'en-UK';

		msg.onend = function(e) {
			if (!!cb) cb();
		};

		msg.voice = voices[1]; // Note: some voices don't support altering params
		console.log(msg);
		speechSynthesis.speak(msg);
	}

	me.say = function (message, cb) {
		var msg = new SpeechSynthesisUtterance();
		var voices = window.speechSynthesis.getVoices();
		msg.voiceURI = 'native';
		msg.volume = 1; // 0 to 1
		msg.rate = 1; // 0.1 to 10
		msg.pitch = 1; //0 to 2
		msg.text = message;
		msg.lang = 'en-UK';

		msg.onend = function(e) {
			if (!!cb) cb();
		};

		msg.voice = voices[2]; // Note: some voices don't support altering params
		console.log(msg);
		speechSynthesis.speak(msg);
	}

	return me;
})