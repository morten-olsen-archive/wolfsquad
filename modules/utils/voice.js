boot.def('utils/voice', [], function (exports) {
	var me = {};

	me.read = function (message, cb) {
		var msg = new SpeechSynthesisUtterance();
		var voices = window.speechSynthesis.getVoices().filter(v => v.lang === 'en-GB');
		msg.voice = voices[0];
		msg.text = message.replace(/\./g, ' .stop. ');

		msg.onend = function(e) {
			if (!!cb) cb();
		};
		console.log(msg);
		speechSynthesis.speak(msg);
	}

	me.say = function (message, cb) {
		var msg = new SpeechSynthesisUtterance();
		var voices = window.speechSynthesis.getVoices().filter(v => v.lang === 'en-GB');
		msg.voice = voices[1];
		msg.text = message;

		msg.onend = function(e) {
			if (!!cb) cb();
		};
		console.log(msg);
		speechSynthesis.speak(msg);
	}

	return me;
})
