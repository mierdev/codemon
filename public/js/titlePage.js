class TitlePage extends Phaser.Scene {
	/**
	 * Initialize click through scene to allow for loading scene to have working audio
	 */
	constructor() {
		super({ key: "ClickThroughScene" });
		this.enterButton = null;
		this.titleText = null;
	}
	preload() {
		// Backdrop, button, and cursor images
		this.load.image("bootsSky", ["assets/boots_screens/bootsandsky.png"]);
		this.load.image("enterButton", ["assets/UI/components/enterButton.png"]);
	}
	create() {
		// Backdrop
		const backdrop = this.add.image(480, 360, "bootsSky");
		backdrop.setDisplaySize(960, 720);

		// Enter button
		this.enterButton = this.add.image(650, 400, "enterButton");
		this.enterButton.setInteractive({ useHandCursor: false });

		this.titleText = this.add
			.text(650, 400, "ENTER", {
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

		// Click handlers
		this.enterButton.on("pointerdown", () => {
			this.scene.start("IntroScene");
		});

		this.titleText.on("pointerdown", () => {
			this.scene.start("IntroScene");
		});

		// Hover effect
		this.enterButton.on("pointerover", () => {
			this.enterButton.setTint(0x87ceeb);
			this.titleText.setTint(0xaaccff);
		});

		// Hover out
		this.enterButton.on("pointerout", () => {
			this.enterButton.clearTint();
			this.titleText.clearTint();
		});

		// Make hover text interactive
	}
}
