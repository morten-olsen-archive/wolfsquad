boot.def('utils/idletalk', ['utils/voice'], function (exports, voice) {
	var whatToSay = [
		'Did you know that water is the heaviest at 3 point 7 degrees? i did not... fascinating',
		'So do you maybe want to grab lunch sometime? yeah I know what you are thinking, I am just an A.I.',
		'Damn. Have you seen the mission reports for the indinapolis mission? i know they are here somewhere',
		'Uh, i heard something funny the other day. Did you know that a third of the worlds population is bourne without ears? okay I made that up',
		'I know my smalltalk isn\'t the best, but i know that my creator is working on it',
		'Rome did not get build in a day. Well there is one to grow on you'
	]
	
	function getTime() {
	var time = Math.floor(Math.random() * 1000 * 60 + 40 * 1000);
	console.log(time);
		return time;
	};
	
	function getSentence() {
		return whatToSay[Math.floor(Math.random() * whatToSay.length)];
	}
	
	function saySomething() {
		voice.say(getSentence());
	}
	
	function sayStuff() {
		setTimeout(function () {
			voice.say(getSentence());
			sayStuff();
		}, getTime());
	};
	
	sayStuff();
	
	return {
		talk: saySomething
	};
});