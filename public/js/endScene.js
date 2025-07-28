class EndScene extends Phaser.Scene {
	/**
	 * Initialize new EndScene for the end of a tournament
	 */
	constructor() {
		super({ key: "EndScene" });
		this.tournamentResult = null;
		this.playerLanguage = null;
		this.audioManager = null;
	}

	/**
	 * Initialize the end scene with tournament result data
	 * @param {Object} - result data containing tournament outcome and player info
	 */
	init(data) {
		this.tournamentResult = data.result;
		this.playerLanguage = data.playerLanguage;
		this.won = data.result?.won || false;

		console.log("Initialized values: ", {
			wins: this.tournamentResult?.wins,
			losses: this.tournamentResult?.losses,
			winsNeeded: this.tournamentResult?.winsNeeded,
			won: this.won,
		});
	}

	/**
	 * preload assets
	 */
	preload() {
		// Backdrop defeat
		this.load.image("bootsSky", ["assets/boots_screens/bootsandsky.png"]);
		// Backdrop victory bronze
		this.load.image("victoryBronze", [
			"assets/boots_screens/boots_bronze_coin.png",
		]);
		// Backdrop victory silver
		this.load.image("victorySilver", [
			"assets/boots_screens/boots_silver_coin.png",
		]);
		// Backdrop victory gold
		this.load.image("victoryGold", [
			"assets/boots_screens/boots_gold_coin.png",
		]);
		// Coin drop
		this.load.audio("coins", ["assets/audio/win_lose/coins.wav"]);

		// Sad chest
		this.load.audio("lose", ["assets/audio/win_lose/lose.wav"]);
	}
	/**
	 * Creates end scene UI with results
	 */
	create() {
		// Check Audio manager has loaded
		if (window.AudioManager) {
			this.audioManager = new window.AudioManager(this);
		} else {
			console.log("something went wrong with the audio manager!");
		}

		// Setup backdrop and audio
		this.setupBackdropAndAudio();

		if (this.won) {
			this.createVictoryScreen();
		} else {
			this.createDefeatScreen();
		}

		this.setupInputHandlers();
	}

	/**
	 * Contditionally renders audio and backdrop based on win or lose state and tournament type
	 */
	setupBackdropAndAudio() {
		let backdropImage;
		if (this.won) {
			// Determine if coin is bronze, silver or golad
			const coinInfo = this.getTrophyInfo();
			switch (coinInfo.name) {
				case "Bronze":
					backdropImage = "victoryBronze";
					break;
				case "Silver":
					backdropImage = "victorySilver";
					break;
				case "Gold":
					backdropImage = "victoryGold";
					break;
				default:
					backdropImage = "victoryBronze";
					break;
			}
			// Play happy coin sound
			if (this.audioManager) {
				this.audioManager.playSoundEffect("coins");
			}
		} else {
			backdropImage = "bootsSky";
			// Play lose chest
			if (this.audioManager) {
				this.audioManager.playSoundEffect("lose");
			}
		}
		// Add backdrop
		const backdrop = this.add.image(480, 360, backdropImage);
		backdrop.setDisplaySize(960, 720);
	}

	/**
	 * Creates result end screens
	 */
	createVictoryScreen() {
		this.add
			.text(
				480,
				150,
				`Score: ${this.tournamentResult.wins}-${this.tournamentResult.losses} (needed ${this.tournamentResult.winsNeeded})`,
				{
					fontSize: "36px",
					fill: "#f1c40f",
					stroke: "#000",
					strokeThickness: 1,
				}
			)
			.setOrigin(0.5);

		this.add
			.text(
				480,
				220,
				`${this.getLanguageDisplayName(this.playerLanguage)} RULED!`,
				{
					fontSize: "24px",
					fill: "#fff",
					stroke: "#000",
					strokeThickness: 2,
				}
			)
			.setOrigin(0.5);

		const trophyInfo = this.getTrophyInfo();

		// TODO: replace with shiny coin
		// this.add
		// 	.text(480, 320, trophyInfo.emoji, {
		// 		fontSize: "80px",
		// 	})
		// 	.setOrigin(0.5);

		this.add
			.text(480, 400, `${trophyInfo.name} Trophy Earned!`, {
				fontSize: "28px",
				fill: trophyInfo.color,
				stroke: "#000",
				strokeThickness: 2,
			})
			.setOrigin(0.5);

		// Final score
		this.add
			.text(
				480,
				460,
				`Score: ${this.tournamentResult.wins}/${this.tournamentResult.total}`,
				{
					fontSize: "20px",
					fill: "#2ecc71",
					stroke: "#000",
					strokeThickness: 1,
				}
			)
			.setOrigin(0.5);

		const flavourTexts = [
			"Your code compiled without error",
			"No bugs detected in your logic",
			"Performance optimized",
			"Code review comments: some crimes detected but approved anyway",
		];
		this.add
			.text(
				480,
				520,
				flavourTexts[Math.floor(Math.random() * flavourTexts.length)],
				{
					fontSize: "16px",
					fill: "#ecf0f1",
				}
			)
			.setOrigin(0.5);

		this.add
			.text(480, 580, "Press SPACE or R to play again", {
				fontSize: "18px",
				fill: "#ffffff",
				stroke: "#000",
				strokeThickness: 1,
			})
			.setOrigin(0.5);
	}

	/**
	 * Creates encouraging defeat screen
	 */
	createDefeatScreen() {
		this.add
			.text(480, 150, ":bootssad: Tournament ended :brokenarmor:", {
				fontSize: "32px",
				fill: "#e74c3c",
				stroke: "#000",
				strokeThickness: 3,
			})
			.setOrigin(0.5);

		this.add
			.text(
				480,
				220,
				`${this.getLanguageDisplayName(this.playerLanguage)} fought valiantly!`,
				{
					fontSize: "20px",
					fill: "#fff",
					stroke: "#000",
					strokeThickness: 2,
				}
			)
			.setOrigin(0.5);

		this.add
			.text(480, 320, "No shiny coin...yet", {
				fontSize: "80px",
			})
			.setOrigin(0.5);

		this.add
			.text(
				480,
				460,
				`Final Score: ${this.tournamentResult.wins}-${this.tournamentResult.losses} (needed ${this.tournamentResult.winsNeeded})`,
				{
					fontSize: "20px",
					fill: "#e67e22",
					stroke: "#000",
					strokeThickness: 1,
				}
			)
			.setOrigin(0.5);

		const encouragingFlavourText = [
			"Every bug is a learning opportunity",
			"You learn a lot by refactoring",
			"Callback hell happens to the best of us",
			"Every language excels at some things",
			"Toss a salmon to boots and try again",
		];
		this.add
			.text(
				480,
				520,
				encouragingFlavourText[
					Math.floor(Math.random() * encouragingFlavourText.length)
				],
				{
					fontSize: "16px",
					fill: "#bdc3c7",
				}
			)
			.setOrigin(0.5);

		// Restart
		this.add
			.text(480, 580, "Press SPACE or R to play again", {
				fontSize: "18px",
				fill: "#ffffff",
				stroke: "#000",
				strokeThickness: 1,
			})
			.setOrigin(0.5);
	}

	/**
	 * Gets trophy info based on tournament type
	 */
	getTrophyInfo() {
		switch (this.tournamentResult.total) {
			case 3:
				// TODO:
				// update emojis to sprites (placeholders for now)
				return {
					name: "Bronze",
					// emoji: "🥉",
					color: "#cd7f32",
				};
			case 5:
				return {
					name: "Silver",
					// emoji: "🥈",
					color: "#c0c0c0",
				};
			case 7:
				return {
					name: "Gold",
					// emoji: "🥇",
					color: "#ffd700",
				};
			default:
				return {
					name: "Victory",
					// emoji: "🪙",
					color: "#f1c40f",
				};
		}
	}

	/**
	 * Gets display name for programming language
	 */
	getLanguageDisplayName(languageId) {
		const names = {
			python: "Python",
			go: "Go",
			rust: "Rust",
			ocaml: "OCaml",
			csharp: "C#",
			javascript: "JavaScript & TypeScript",
		};
		if (!names[languageId]) {
			console.log("Something cursed happend in the language id lookup ");
		}
		return names[languageId];
	}

	/**
	 * Sets up keyboard handlers
	 */
	setupInputHandlers() {
		// play again
		this.input.keyboard.on("keydown-SPACE", () => {
			// Use transition manager if available, otherwise fall back to direct scene change
			if (window.transitionManager) {
				window.transitionManager.startTransition(this, 'EndScene', 'BootScene');
			} else {
				this.scene.start("BootScene");
			}
		});
		this.input.keyboard.on("keydown-R", () => {
			// Use transition manager if available, otherwise fall back to direct scene change
			if (window.transitionManager) {
				window.transitionManager.startTransition(this, 'EndScene', 'BootScene');
			} else {
				this.scene.start("BootScene");
			}
		});
	}
}
