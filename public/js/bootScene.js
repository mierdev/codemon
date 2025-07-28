/**
 * Boot scene that initializes the game manager and starts the battle.
 * Acts as the entry point for the game, setting up the GameManager and transitioning to the battle.
 */
class BootScene extends Phaser.Scene {
	/**
	 * Initializes the BootScene with the scene key 'BootScene'.
	 * Sets up the scene for game initialization.
	 */
	constructor() {
		super({ key: "BootScene" });
		this.selectedTournament = 3;
		this.selectedLanguage = "python";
		this.audioManager = null;
	}
	/**
	 * Preloads assets
	 */
	preload() {
		// Backdrop
		this.load.image("danLaneStandoff", [
			"assets/backgrounds/dan-lane-standoff.png",
		]);
		// Codemon banner
		this.load.image("bannerLeft", ["assets/UI/components/bannerLeft.png"]);
		this.load.image("bannerMid", ["assets/UI/components/bannerMid.png"]);
		this.load.image("bannerRight", ["assets/UI/components/bannerRight.png"]);

		// TODO:
		// Clear if unused
		this.load.image("brownPressed", ["assets/UI/components/brownPressed.png"]);
		this.load.image("brownUnpressed", [
			"assets/UI/components/brownUnpressed.png",
		]);
		// Language buttons
		this.load.image("enterButton", ["assets/UI/components/enterButton.png"]);
		this.load.image("enterPressed", ["assets/UI/components/enterPressed.png"]);
		// Tournament Buttons
		this.load.image("goldPressed", ["assets/UI/components/goldPressed.png"]);
		this.load.image("goldUnpressed", [
			"assets/UI/components/goldUnpressed.png",
		]);
		// Start Button
		this.load.image("greyPressed", ["assets/UI/components/greyPressed.png"]);
		this.load.image("greyUnpressed", [
			"assets/UI/components/greyUnpressed.png",
		]);
		// Background music (cider)
		this.load.audio("cider", ["assets/audio/backgrounds/apple_cider.wav"]);
	}

	/**
	 * Creates the boot scene and initializes the game.
	 * Creates a new GameManager instance, starts a battle between Charizard and Blastoise,
	 * and transitions to the BattleScene with the battle data.
	 * If battle initialization fails, logs an error to the console.
	 */
	create() {
		// Reset transition state to ensure clean transitions
		if (window.transitionManager) {
			window.transitionManager.resetTransitionState();
		}

		// Initialize transition manager
		if (window.TransitionManager && !window.transitionManager) {
			window.transitionManager = new window.TransitionManager();
			console.log("Transition manager initialized");
		}

		// Check Audio manager has loaded
		if (!window.audioManager && window.AudioManager) {
			this.audioManager = new window.AudioManager(this);
		} else {
			console.log("something went wrong with the audio manager!");
		}

		console.log("About to play cider");
		if (this.audioManager && (!window.currentMusic || !window.currentMusic.isPlaying)) {
			this.audioManager.playMusic("cider", { loop: true, volume: 0.4 });
			window.currentMusic = this.audioManager.currentMusic;
		}
		console.log("Should be playing cider");

		// Simple background
		// this.add.rectangle(0, 0, 960, 720, 0x2c3e50).setOrigin(0, 0);
		const backdrop = this.add.image(480, 360, "danLaneStandoff");
		backdrop.setDisplaySize(960, 720);

		this.createCodemonBanner();

		// Tournament buttons
		this.add
			.text(480, 180, "Choose Tournament: ", { fontSize: "24px", fill: "#fff" })
			.setOrigin(0.5);

		this.createTournamentButton(3, "3 Matches", 280, 240);
		this.createTournamentButton(5, "5 Matches", 480, 240);
		this.createTournamentButton(7, "7 Matches", 680, 240);

		// Language selection
		this.add
			.text(480, 320, "Choose Your Language: ", { fontSize: "24px", fill: "#fff" })
			.setOrigin(0.5);

		// Create language buttons dynamically from database data
		this.createLanguageButtons();

		// Start button
		const startButton = this.add.image(480, 520, "greyUnpressed");
		startButton.setInteractive();

		this.add
			.text(480, 520, "COMPILE", { fontSize: "18px", fill: "#0066ff" })
			.setOrigin(0.5);

		startButton.on("pointerover", () => {
			startButton.setTint(0xdddddd);
		});

		startButton.on("pointerout", () => {
			startButton.clearTint();
		});

		startButton.on("pointerdown", () => {
			this.startTournament();
		});
	}

	/**
	 * Creates language buttons for only Python, Go, and JavaScript/TypeScript
	 * Filters available languages to show only the three selectable options
	 */
	createLanguageButtons() {
		// Define the three selectable languages
		const selectableLanguages = [
			{ id: "python", name: "Python" },
			{ id: "go", name: "Go" },
			{ id: "javascript", name: "JavaScript & TypeScript" }
		];

		if (!window.gameManager || typeof window.gameManager.isGameDataLoaded !== 'function' || !window.gameManager.isGameDataLoaded()) {
			console.warn('Game data not loaded, using fallback language buttons');
			// Fallback to hardcoded buttons for the three selectable languages
			this.createLanguageButton("python", "Python", 280, 400);
			this.createLanguageButton("go", "Go", 480, 400);
			this.createLanguageButton("javascript", "JavaScript & TypeScript", 680, 400);
			return;
		}

		// Create buttons for only the three selectable languages
		selectableLanguages.forEach((language, index) => {
			const languageData = window.gameManager.getLanguageData(language.id);
			if (languageData) {
				// Position the three buttons in a row
				const x = 280 + (index * 200); // 280, 480, 680
				const y = 400;
				
				this.createLanguageButton(language.id, languageData.name, x, y);
			}
		});
	}

	createCodemonBanner() {
		const bannerY = 100;
		const centerX = 480;
		const bannerScale = 2.5;

		const bannerLeft = this.add.image(centerX - 80, bannerY, "bannerLeft");
		bannerLeft.setScale(bannerScale);

		const bannerMid = this.add.image(centerX, bannerY, "bannerMid");
		bannerMid.setScale(bannerScale);

		const bannerRight = this.add.image(centerX + 80, bannerY, "bannerRight");
		bannerRight.setScale(bannerScale);

		// Title
		this.add
			.text(480, 105, "CODEMON", {
				fontSize: "36px",
				fill: "#fff",
				fontStyle: "bold",
				stroke: "#000",
				strokeThickness: 2,
				shadow: {
					offsetX: 2,
					offsetY: 2,
					color: "#000000",
					blur: 4,
					fill: true,
				},
			})
			.setOrigin(0.5)
			.setDepth(1);
	}

	createTournamentButton(matches, text, x, y) {
		const isSelected = this.selectedTournament === matches;
		const tournamentButton = this.add.image(
			x,
			y,
			isSelected ? "goldPressed" : "goldUnpressed"
		);

		this.add
			.text(x, y, text, { fontSize: "14px", fill: "#fff" })
			.setOrigin(0.5);

		// Tinting for extra visual feedback
		if (isSelected) {
			tournamentButton.setTint(0xffd700);
		}
		tournamentButton.setInteractive();

		tournamentButton.on("pointerover", () => {
			if (!isSelected) {
				tournamentButton.setTint(0xdddddd);
			}
		});

		tournamentButton.on("pointerout", () => {
			if (!isSelected) {
				tournamentButton.clearTint();
			}
		});

		tournamentButton.on("pointerdown", () => {
			this.selectedTournament = matches;
			// UI Update
			this.scene.restart();
		});
	}

	createLanguageButton(id, name, x, y) {
		const isSelected = this.selectedLanguage === id;
		const languageButton = this.add.image(
			x,
			y,
			isSelected ? "enterPressed" : "enterButton"
		);

		if (isSelected) {
			languageButton.setTint(0x87ceeb);
		}

		this.add
			.text(x, y, name, { fontSize: "14px", fill: "#fff" })
			.setOrigin(0.5);

		languageButton.setInteractive();

		languageButton.on("pointerover", () => {
			if (!isSelected) {
				languageButton.setTint(0xdddddd);
			}
		});

		languageButton.on("pointerout", () => {
			if (!isSelected) {
				languageButton.clearTint();
			}
		});

		languageButton.on("pointerdown", () => {
			this.selectedLanguage = id;
			// UI update
			this.scene.restart();
		});
	}

	startTournament() {
		console.log(
			`Starting tournament: ${this.selectedTournament} match as ${this.selectedLanguage}`
		);

		const tournamentSetup = window.gameManager.startTournament(
			this.selectedTournament,
			this.selectedLanguage
		);

		const initialOpponent = tournamentSetup.trainer;

		const battleData = window.gameManager.startBattle(
			this.selectedLanguage,
			initialOpponent.language
		);
		if (this.audioManager) {
			this.audioManager.stopMusic();
		}
		if (battleData) {
			battleData.tournamentInfo = tournamentSetup;
			battleData.playerLanguage = this.selectedLanguage;
			
			// Use transition manager if available, otherwise fall back to direct scene change
			if (window.transitionManager) {
				window.transitionManager.startTransition(this, 'BootScene', 'BattleScene', battleData);
			} else {
				this.scene.start("BattleScene", battleData);
			}
		}
	}
}
