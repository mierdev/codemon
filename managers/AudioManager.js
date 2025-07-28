/**
 * Hande playing music
 */
export class AudioManager {
	constructor(scene) {
		this.audioIsEnabled = true;
		this.scene = scene;
		this.currentMusic = null;
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
	playMusic(key, options = {}) {
		if (!this.audioIsEnabled) return;

		// Stop current music if playing
		if (this.currentMusic) {
			this.currentMusic.stop();
			this.currentMusic.destroy();
		}

		// audio default options
		const audioConfig = {
			volume: options.volume || 0.5,
			loop: options.loop || false,
		};
		// Play audio
		const audioTrack = this.scene.sound.add(key, { volume: 0.5 });
		this.currentMusic = audioTrack;
		audioTrack.play();

		if (!audioConfig.loop) {
			audioTrack.once("complete", () => {
				audioTrack.destroy();
				if (this.currentMusic === audioTrack) {
					this.currentMusic = null;
				}
			});
		}
	}
	stopMusic() {
		if (this.currentMusic) {
			this.currentMusic.stop();
			this.currentMusic.destroy();
			this.currentMusic = null;
		}
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
