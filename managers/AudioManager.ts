import Phaser from "phaser";

export class AudioManager {
	private scene: Phaser.Scene;
	private audioIsEnabled: boolean = true;

	constructor(scene: Phaser.Scene) {
		this.scene = scene;
	}

	playSoundEffect(key: string) {
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

	toggleSoundEffect() {
		// handle audioIsEnabled
		this.audioIsEnabled = !this.audioIsEnabled;
		// toggle mute
		this.scene.sound.mute = !this.audioIsEnabled;
	}

	isAudioEnabled(): boolean {
		return this.audioIsEnabled;
	}
}
