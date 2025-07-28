/**
 * Hande playing music
 */
export class AudioManager {
	constructor(scene) {
		this.audioIsEnabled = true;
		this.scene = scene;
		this.currentMusic = null;
		this.soundPool = new Map(); // Cache for sound effects
	}
	
	playSoundEffect(key) {
		// If sound is not enabled return
		if (!this.audioIsEnabled) return;
		
		// Check if we already have this sound in our pool
		let soundEffect = this.soundPool.get(key);
		
		if (!soundEffect) {
			// Create new sound instance and cache it
			soundEffect = this.scene.sound.add(key, { volume: 0.4 });
			this.soundPool.set(key, soundEffect);
		}
		
		// Stop the sound if it's currently playing to prevent overlap
		if (soundEffect.isPlaying) {
			soundEffect.stop();
		}
		
		// Play the sound
		soundEffect.play();
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
		const audioTrack = this.scene.sound.add(key, {
			volume: audioConfig.volume,
			loop: audioConfig.loop,
		});
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
	
	// HACK:
	// Trying to stop all audio
	stopAll() {
		this.scene.sound.stopAll();
		// Clear the sound pool
		this.soundPool.clear();
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
