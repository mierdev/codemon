export class AudioManager {
	constructor(scene) {
		this.audioIsEnabled = true;
		this.scene = scene;
	}
	playSoundEffect(key) {
		// If sound is not enabled return
		if (!this.audioIsEnabled) return;
		// Setting default to 0.4 to start
		const soundEffect = this.scene.sound.add(key, { volume: 0.4 });
		soundEffect.play();
		// Clean up after playing
		soundEffect.once("complete", () => {
			soundEffect.destroy();
		});
	}
	playMusic(key) {
		if (!this.audioIsEnabled) return;
		// Play audio
		const audioTrack = this.scene.sound.add(key, { volume: 0.5 });
		audioTrack.play();
	}
	toggleSoundEffect() {
		// handle audioIsEnabled
		this.audioIsEnabled = !this.audioIsEnabled;
		// toggle mute
		this.scene.sound.mute = !this.audioIsEnabled;
	}
	isAudioEnabled() {
		return this.audioIsEnabled;
	}
}
