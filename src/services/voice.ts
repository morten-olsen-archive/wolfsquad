enum Voices {
  // UK
  Daniel = 'Daniel',
  // US
  Alex = 'Alex',
  Fred = 'Fred',
  Samantha = 'Samantha',
  Victoria = 'Victoria',
};

speechSynthesis.cancel();

class VoiceService {
  running: boolean = false;
  queue: {
    talk: () => Promise<any>,
    callback: () => void;
  }[] = [];

  private startTalk = async () => {
    this.running = true;
    const item = this.queue.pop();
    if (item) {
      console.log('item started')
      await item.talk();
      console.log('item done');
      item.callback();
      await this.startTalk();
    } else {
      this.running = false;
    }
  }

  say = (message: string, voice: Voices = Voices.Samantha) => {
    return new Promise(async (resolve) => {
      const msg = new SpeechSynthesisUtterance();
      const voices = await window.speechSynthesis.getVoices().filter(a => a.name === voice);
      msg.voice = voices[0];
      msg.text = message;
      msg.onend = (e) => {
        console.log('done');
        resolve();
      };
      msg.onstart = (e) => {
        console.log('started');
      };
      speechSynthesis.speak(msg);
    });
  }
}

export {
  Voices,
};

export default new VoiceService();