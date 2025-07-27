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
	}

	/**
	 * Creates the boot scene and initializes the game.
	 * Creates a new GameManager instance, starts a battle between Charizard and Blastoise,
	 * and transitions to the BattleScene with the battle data.
	 * If battle initialization fails, logs an error to the console.
	 */
	create() {
		window.gameManager = new GameManager();

		// Get all available language IDs
		// const availableLanguages = ['python', 'go', 'rust', 'ocaml', 'cpp', 'javascript'];

		// // Randomly select 2 different languages
		// const shuffled = availableLanguages.sort(() => 0.5 - Math.random());
		// const language1 = shuffled[0];
		// const language2 = shuffled[1];

		// console.log(`Starting battle: ${language1} vs ${language2}`);

		// const battleData = window.gameManager.startBattle(language1, language2);

		// if (battleData) {
		//     this.scene.start('BattleScene', battleData);
		// } else {
		//     console.error('Failed to start battle');
		// }

		// Simple background
		this.add.rectangle(0, 0, 960, 720, 0x2c3e50).setOrigin(0, 0);

		// Title
		this.add
			.text(480, 100, "CODEMON", {
				fontSize: "36px",
				fill: "#fff",
			})
			.setOrigin(0.5);

		// Tournament buttons
		this.add
			.text(480, 200, "Choose Tournament: ", { fontSize: "24px", fill: "#fff" })
			.setOrigin(0.5);

		this.createTournamentButton(3, "3 Matches (Bronze)", 280, 250);
		this.createTournamentButton(5, "5 Matches (Silver)", 480, 250);
		this.createTournamentButton(7, "7 Matches (Gold)", 680, 250);

		// Language buttons
		this.add
			.text(480, 350, "Choose language: ", { fontSize: "24px", fill: "#fff" })
			.setOrigin(0.5);

		this.createLanguageButton("python", "Python", 280, 400);
		this.createLanguageButton("go", "Go", 480, 400);
		this.createLanguageButton("javascript", "JavaScript", 680, 400);

		// Start button
		const startButton = this.add.rectangle(480, 500, 200, 60, 0x27ae60);
		this.add
			.text(480, 500, "COMPILE BATTLE", { fontSize: "24px", fill: "#fff" })
			.setOrigin(0.5);
		startButton.setInteractive();
		startButton.on("pointerdown", () => this.startTournament());

		// Show current selection
		this.selectionText = this.add
			.text(
				480,
				600,
				`Selected: ${this.selectedTournament} matches as ${this.selectedLanguage}`,
				{ fontSize: "18px", fill: "#fff" }
			)
			.setOrigin(0.5);
	}

	createTournamentButton(matches, text, x, y) {
		const button = this.add.rectangle(
			x,
			y,
			180,
			50,
			this.selectedTournament === matches ? 0x3498db : 0x34495e
		);
		this.add
			.text(x, y, text, { fontSize: "14px", fill: "#fff" })
			.setOrigin(0.5);

		button.setInteractive();
		button.on("pointerdown", () => {
			this.selectedTournament = matches;
			// UI Update
			this.scene.restart();
		});
	}

	createLanguageButton(id, name, x, y) {
		const button = this.add.rectangle(
			x,
			y,
			120,
			50,
			this.selectedLanguage === id ? 0xe74c3c : 0x34495e
		);
		this.add
			.text(x, y, name, { fontSize: "14px", fill: "#fff" })
			.setOrigin(0.5);

		button.setInteractive();
		button.on("pointerdown", () => {
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
		if (battleData) {
			battleData.tournamentInfo = tournamentSetup;
			battleData.playerLanguage = this.selectedLanguage;
			this.scene.start("BattleScene", battleData);
		}
	}
}
