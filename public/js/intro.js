class IntroScene extends Phaser.Scene {
	constructor() {
		super({ key: "IntroScene" });
		this.currentFrame = 1;
		this.totalFrames = 100;
		this.frameRate = 24; // 24 FPS for smooth playback
		this.movieSprite = null;
		this.titleText = null;
		this.chaosText = null;
		this.fireSprites = [];
		this.textFadeInComplete = false;
		this.imagesLoaded = 0;
		this.audioManager = null;
	}

	preload() {
		// Add sound track
		this.load.audio("fire", ["assets/audio/backgrounds/fire.mp3"]);

		// Add loading text
		const loadingText = this.add
			.text(400, 300, "Loading...", {
				fontSize: "32px",
				color: "#ffffff",
			})
			.setOrigin(0.5);

		// Load all 100 frames with progress tracking
		for (let i = 1; i <= this.totalFrames; i++) {
			const frameNumber = i.toString().padStart(4, "0");
			this.load.image(
				`frame_${frameNumber}`,
				`assets/intro_images/output_${frameNumber}.png`
			);
		}

		// Track loading progress
		this.load.on("complete", () => {
			console.log("All images loaded successfully!");
			loadingText.destroy();
		});

		this.load.on("loaderror", (file) => {
			console.error("Failed to load:", file.src);
		});
	}

	create() {
		console.log("Creating intro scene...");

		// Check Audio manager has loaded
		if (window.AudioManager) {
			this.audioManager = new window.AudioManager(this);
		} else {
			console.log("something went wrong with the audio manager!");
		}

		// Set background to black
		this.cameras.main.setBackgroundColor("#000000");

		// Create movie sprite with first frame
		this.movieSprite = this.add.sprite(400, 300, "frame_0001");
		this.movieSprite.setScale(0.8); // Scale down to fit screen

		// Create title text at the top (initially invisible)
		this.titleText = this.add
			.text(400, 80, "LITTLE SHOP OF", {
				fontSize: "48px",
				fontFamily: "Arial",
				color: "#ffffff",
				fontStyle: "bold",
				stroke: "#000000",
				strokeThickness: 4,
				shadow: {
					offsetX: 2,
					offsetY: 2,
					color: "#000000",
					blur: 4,
					fill: true,
				},
			})
			.setOrigin(0.5)
			.setAlpha(0);

		// Create CHAOS text below title (initially invisible)
		this.chaosText = this.add
			.text(400, 140, "CHAOS", {
				fontSize: "72px",
				fontFamily: "Arial",
				color: "#ff4400",
				fontStyle: "bold",
				stroke: "#000000",
				strokeThickness: 4,
				shadow: {
					offsetX: 2,
					offsetY: 2,
					color: "#000000",
					blur: 4,
					fill: true,
				},
			})
			.setOrigin(0.5)
			.setAlpha(0);

		// Create fire effect AFTER text (so it renders on top)
		this.createFireEffect();

		// Start movie playback
		this.startMoviePlayback();

		// Start text fade-in after a delay
		this.time.delayedCall(2000, () => {
			this.fadeInText();
		});

		// Transition to BootScene after 5 seconds
		this.time.delayedCall(8000, () => {
			console.log("Intro complete, transitioning to BootScene...");
			this.scene.start("BootScene");
		});

		console.log("Intro scene created successfully");
	}

	createFireEffect() {
		console.log("Creating fire effect...");

		// Create a larger, more visible fire particle texture
		const fireGraphics = this.add.graphics();
		fireGraphics.fillStyle(0xffff00, 1);
		fireGraphics.fillCircle(0, 0, 8); // Larger circle
		fireGraphics.generateTexture("fire-particle", 16, 16); // Larger texture
		fireGraphics.destroy();

		// Create fire sprites for each letter of CHAOS
		const letterPositions = [
			{ x: 320, y: 140 }, // C
			{ x: 360, y: 140 }, // H
			{ x: 400, y: 140 }, // A
			{ x: 440, y: 140 }, // O
			{ x: 480, y: 140 }, // S
		];

		// Create many more fire sprites for each letter
		letterPositions.forEach((pos, letterIndex) => {
			for (let i = 0; i < 15; i++) {
				// 15 fire sprites per letter
				const fireSprite = this.add.sprite(pos.x, pos.y + 40, "fire-particle");
				fireSprite.setScale(1.2); // Slightly smaller for more density
				fireSprite.setAlpha(0);
				fireSprite.setTint(0xffff00); // Start with yellow
				fireSprite.letterIndex = letterIndex;
				fireSprite.spriteIndex = i;
				fireSprite.delay = i * 150; // Slower stagger (150ms instead of 100ms)
				this.fireSprites.push(fireSprite);

				// console.log(
				// 	`Created fire sprite ${letterIndex}-${i} at ${pos.x}, ${pos.y + 40}`
				// );
			}
		});

		console.log(`Created ${this.fireSprites.length} fire sprites total`);
		// Note: Fire animation will start later when CHAOS text fades in
	}

	startMoviePlayback() {
		console.log("Starting movie playback...");

		// HACK:
		// Not sure this is the best place to put this but it works
		console.log("start playing fire");
		this.audioManager.playSoundEffect("fire");
		console.log("Fire should be playing");

		// Create timer for frame updates
		this.movieTimer = this.time.addEvent({
			delay: 1000 / this.frameRate, // Convert FPS to milliseconds
			callback: this.updateFrame,
			callbackScope: this,
			loop: true,
		});
	}

	updateFrame() {
		this.currentFrame++;

		if (this.currentFrame > this.totalFrames) {
			// Loop the movie
			this.currentFrame = 1;
		}

		const frameNumber = this.currentFrame.toString().padStart(4, "0");
		const textureKey = `frame_${frameNumber}`;

		// Check if texture exists before setting it
		if (this.textures.exists(textureKey)) {
			this.movieSprite.setTexture(textureKey);
		} else {
			console.warn(`Texture not found: ${textureKey}`);
		}
	}

	fadeInText() {
		console.log("Starting text fade-in...");

		// Fade in "LITTLE SHOP OF"
		this.tweens.add({
			targets: this.titleText,
			alpha: 1,
			duration: 2000,
			ease: "Power2",
			onComplete: () => {
				console.log("Title text faded in");
				// After title fades in, fade in CHAOS with fire effect
				this.tweens.add({
					targets: this.chaosText,
					alpha: 1,
					duration: 1500,
					ease: "Power2",
					onComplete: () => {
						console.log("CHAOS text faded in - starting fire effect!");
						this.textFadeInComplete = true;

						// Start fire animation AFTER CHAOS text has fully faded in
						this.startFireAnimation();

						// Add some pulsing effect to CHAOS
						this.tweens.add({
							targets: this.chaosText,
							scaleX: 1.05,
							scaleY: 1.05,
							duration: 1000,
							yoyo: true,
							repeat: -1,
							ease: "Sine.easeInOut",
						});
					},
				});
			},
		});
	}

	startFireAnimation() {
		console.log("Starting fire animation...");

		// Start all fire sprites with staggered timing for constant effect
		this.fireSprites.forEach((sprite) => {
			this.time.delayedCall(sprite.delay, () => {
				this.animateFireSprite(sprite);
			});
		});
	}

	animateFireSprite(sprite) {
		// Get base position for this letter
		const letterPositions = [320, 360, 400, 440, 480];
		const baseX = letterPositions[sprite.letterIndex];
		const baseY = 180; // Bottom of letter

		// Set initial position
		sprite.setPosition(baseX + Phaser.Math.Between(-20, 20), baseY);
		sprite.setScale(1.2);
		sprite.setAlpha(1);
		sprite.setTint(0xffff00); // Start yellow

		// Create fire animation - SLOWER
		this.tweens.add({
			targets: sprite,
			y: baseY - 150, // Move upward more
			scale: 0.1, // Shrink as it rises
			alpha: 0, // Fade out
			duration: 2500, // Slower animation (2500ms instead of 1500ms)
			ease: "Power2",
			onUpdate: () => {
				// Change color from yellow to red as it rises
				const progress = 1 - (sprite.y - (baseY - 150)) / 150;
				if (progress < 0.2) {
					sprite.setTint(0xffff00); // Yellow
				} else if (progress < 0.4) {
					sprite.setTint(0xffaa00); // Orange-yellow
				} else if (progress < 0.6) {
					sprite.setTint(0xff6600); // Orange
				} else if (progress < 0.8) {
					sprite.setTint(0xff4400); // Red-orange
				} else {
					sprite.setTint(0xff0000); // Red
				}
			},
			onComplete: () => {
				// Restart animation after a longer delay for slower effect
				const restartDelay = Phaser.Math.Between(200, 600); // Longer delays
				this.time.delayedCall(restartDelay, () => {
					this.animateFireSprite(sprite);
				});
			},
		});
	}

	update() {
		// Add some dynamic movement to fire sprites
		if (this.textFadeInComplete && this.fireSprites) {
			this.fireSprites.forEach((sprite) => {
				// Slightly vary the position for more realistic fire
				if (sprite.alpha > 0) {
					sprite.x += Phaser.Math.Between(-1, 1);
				}
			});
		}
	}
}
