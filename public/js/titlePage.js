/**
 * Title page scene that displays the game title and enter button
 * Acts as a click-through scene to allow loading scene to have working audio
 */
class TitlePage extends Phaser.Scene {
	/**
	 * Initializes the TitlePage scene with interactive elements
	 */
	constructor() {
		super({ key: "TitlePage" });
		this.enterButton = null;
		this.titleText = null;
	}

	/**
	 * Preloads assets for the title page including backdrop and button images
	 */
	preload() {
		this.load.image("bootsSky", ["assets/boots_screens/bootsandsky.png"]);
		this.load.image("enterButton", ["assets/UI/components/enterButton.png"]);
	}

	/**
	 * Creates the title page UI with backdrop, enter button, and interactive elements
	 * Sets up click handlers and hover effects for user interaction
	 */
	create() {
		const backdrop = this.add.image(480, 360, "bootsSky");
		backdrop.setDisplaySize(960, 720);

		this.enterButton = this.add.image(650, 400, "enterButton");
		this.enterButton.setInteractive({ useHandCursor: false });

		this.titleText = this.add
			.text(650, 398, "ENTER", {
				fontSize: "32px",
				fontFamily: "Arial",
				color: "#f6f5e9ff",
				fontStyle: "bold",
				stroke: "#4A90E2",
				strokeThickness: 3,
				shadow: {
					offsetX: 2,
					offsetY: 2,
					color: "#000000",
					blur: 6,
					fill: true,
				},
			})
			.setOrigin(0.5);

		this.enterButton.on("pointerdown", () => {
			// Use transition manager if available, otherwise fall back to direct scene change
			if (window.transitionManager) {
				window.transitionManager.startTransition(
					this,
					"TitlePage",
					"IntroScene"
				);
			} else {
				this.scene.start("IntroScene");
			}
		});

		this.titleText.on("pointerdown", () => {
			// Use transition manager if available, otherwise fall back to direct scene change
			if (window.transitionManager) {
				window.transitionManager.startTransition(
					this,
					"TitlePage",
					"IntroScene"
				);
			} else {
				this.scene.start("IntroScene");
			}
		});

		this.enterButton.on("pointerover", () => {
			this.enterButton.setTint(0x87ceeb);
			this.titleText.setTint(0xaaccff);
		});

		this.enterButton.on("pointerout", () => {
			this.enterButton.clearTint();
			this.titleText.clearTint();
		});
	}
}
