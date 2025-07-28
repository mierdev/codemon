/**
 * Manages audio playback for the game including music and sound effects
 */
export class AudioManager {
	/**
	 * Initializes the AudioManager with scene reference and audio state
	 * @param {Object} scene - The Phaser scene instance
	 */
	constructor(scene) {
		this.audioIsEnabled = true;
		this.scene = scene;
		this.currentMusic = null;
		this.soundPool = new Map();
		this.currentSoundEffect = null;
	}
	
	/**
	 * Plays a sound effect with pooling to prevent overlapping sounds
	 * @param {string} key - The sound effect key to play
	 */
	playSoundEffect(key) {
		if (!this.audioIsEnabled) return;
		
		if (this.currentSoundEffect && this.currentSoundEffect.isPlaying) {
			this.currentSoundEffect.stop();
		}
		
		let soundEffect = this.soundPool.get(key);
		
		if (!soundEffect) {
			soundEffect = this.scene.sound.add(key, { volume: 0.4 });
			this.soundPool.set(key, soundEffect);
		}
		
		this.currentSoundEffect = soundEffect;
		soundEffect.play();
		
		soundEffect.once("complete", () => {
			if (this.currentSoundEffect === soundEffect) {
				this.currentSoundEffect = null;
			}
		});
	}
	
	/**
	 * Plays background music with configurable options
	 * @param {string} key - The music key to play
	 * @param {Object} options - Configuration options for music playback
	 * @param {number} options.volume - Volume level (0-1)
	 * @param {boolean} options.loop - Whether to loop the music
	 */
	playMusic(key, options = {}) {
		if (!this.audioIsEnabled) return;

		if (this.currentMusic) {
			this.currentMusic.stop();
			this.currentMusic.destroy();
		}

		const audioConfig = {
			volume: options.volume || 0.5,
			loop: options.loop || false,
		};

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
	
	/**
	 * Stops the currently playing music
	 */
	stopMusic() {
		if (this.currentMusic) {
			this.currentMusic.stop();
			this.currentMusic.destroy();
			this.currentMusic = null;
		}
	}
	
	/**
	 * Fades out the currently playing music over a specified duration
	 * @param {number} duration - Duration in milliseconds for the fade out
	 */
	fadeOutMusic(duration = 1000) {
		if (this.currentMusic && this.currentMusic.isPlaying) {
			const startVolume = this.currentMusic.volume;
			this.scene.tweens.add({
				targets: this.currentMusic,
				volume: 0,
				duration: duration,
				ease: 'Power2',
				onComplete: () => {
					this.currentMusic.stop();
					this.currentMusic.destroy();
					this.currentMusic = null;
				}
			});
		}
	}
	
	/**
	 * Stops all audio playback and clears sound pools
	 */
	stopAll() {
		this.scene.sound.stopAll();
		this.soundPool.clear();
		this.currentSoundEffect = null;
	}

	/**
	 * Toggles audio on/off state
	 */
	toggleSoundEffect() {
		this.audioIsEnabled = !this.audioIsEnabled;
		this.scene.sound.mute = !this.audioIsEnabled;
	}
	
	/**
	 * Returns the current audio enabled state
	 * @returns {boolean} Whether audio is currently enabled
	 */
	isAudioEnabled() {
		return this.audioIsEnabled;
	}
}
