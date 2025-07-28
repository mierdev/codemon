/**
 * Main battle scene that handles the Pokemon battle gameplay.
 * Manages turn-based combat, UI elements, player input, AI behavior, and battle state.
 */
class BattleScene extends Phaser.Scene {
	/**
	 * Initializes the BattleScene with the scene key 'BattleScene'.
	 * Sets up initial battle state variables including Pokemon references, turn management,
	 * UI elements, and battle state tracking.
	 */
	constructor() {
		super({ key: "BattleScene" });
		this.pokemon1 = null;
		this.pokemon2 = null;
		this.battleState = "playerTurn";
		this.selectedAbility = 0;
		this.currentTurn = 1;
		this.abilityButtons = [];
		this.battleLog = [];
		this.tournamentInfo = null;
		this.tournamentPlayerLanguage = null;
		this.nextOpponent = null;
		this.tournamentResult = null;
		this.dialogueData = { pokemon1: null, pokemon2: null };
		this.trainerData = { pokemon1: null, pokemon2: null };
		this.audioManager = null;
	}

	/**
	 * Initializes the battle scene with Pokemon data from the previous scene.
	 * Resets battle state variables to their initial values for a fresh battle.
	 * @param {Object} data - Battle data containing pokemon1 and pokemon2 objects
	 */
	init(data) {
		if (data && data.tournamentPlayerLanguage) {
			this.tournamentPlayerLanguage = data.tournamentPlayerLanguage;
		}
		this.pokemon1 = data.pokemon1;
		this.pokemon2 = data.pokemon2;
		this.tournamentInfo = data.tournamentInfo;
		this.tournamentPlayerLanguage = data.tournamentPlayerLanguage;
		this.nextOpponent = data.nextOpponent;
		
		this.dialogueData = { pokemon1: null, pokemon2: null };
		this.trainerData = { pokemon1: null, pokemon2: null };
		
		this.battleState = "playerTurn";
		this.selectedAbility = 0;
		this.currentTurn = 1;
		
		this.abilityButtons = [];
		this.battleLog = [];
	}

	/**
	 * Preloads audio files from assets folder
	 */
	preload() {
		this.load.image("cave", ["assets/backgrounds/cave.png"]);
		this.load.image("desert", ["assets/backgrounds/desert.png"]);
		this.load.image("grasslands", ["assets/backgrounds/grasslands.png"]);
		this.load.image("birb", ["assets/codemon/birb.png"]);
		this.load.image("camel", ["assets/codemon/camel.png"]);
		this.load.image("crab", ["assets/codemon/crab.png"]);
		this.load.image("fox", ["assets/codemon/fox_with_many_tails.png"]);
		this.load.image("gopher", ["assets/codemon/gopher.png"]);
		this.load.image("lotus", ["assets/codemon/lotus_flower.png"]);
		this.load.image("lotus2", ["assets/codemon/lotus_flower2.png"]);
		this.load.image("snake", ["assets/codemon/snake.png"]);
		this.load.image("windows_logo", ["assets/codemon/windows_logo.png"]);
		this.load.audio("buff", ["assets/audio/effects/buff.mp3"]);
		this.load.audio("control", ["assets/audio/effects/control.wav"]);
		this.load.audio("debuff", ["assets/audio/effects/debuff.mp3"]);
		this.load.audio("defensive", ["assets/audio/effects/defensive.mp3"]);
		this.load.audio("passive", ["assets/audio/effects/passive.mp3"]);
		this.load.audio("physical", ["assets/audio/effects/physical.mp3"]);
		this.load.audio("recover", ["assets/audio/effects/recover.mp3"]);
		this.load.audio("special", ["assets/audio/effects/special.wav"]);
		this.load.audio("support", ["assets/audio/effects/support.mp3"]);
		this.load.audio("utility", ["assets/audio/effects/support.mp3"]);
		this.load.audio("miss", ["assets/audio/effects/miss.mp3"]);
		this.load.audio("cider", ["assets/audio/backgrounds/apple_cider.wav"]);
		this.load.image("sword", ["assets/UI/components/sword.png"]);
		this.load.image("langLeft", ["assets/UI/components/langLeft.png"]);
		this.load.image("langMid", ["assets/UI/components/langMid.png"]);
		this.load.image("langRight", ["assets/UI/components/langRight.png"]);
		this.load.image("battleLog", ["assets/UI/components/battleLog.png"]);
		this.load.image("statusEffects", [
			"assets/UI/components/statusEffects.png",
		]);
		this.load.image("enterButton", ["assets/UI/components/enterButton.png"]);
		this.load.image("enterPressed", ["assets/UI/components/enterPressed.png"]);
		this.load.image("greyPressed", ["assets/UI/components/goldPressed.png"]);
	}

	/**
	 * Creates the battle scene UI and initializes all game elements.
	 * Sets up the background, Pokemon sprites, HP bars, ability buttons, turn indicators,
	 * status bar, and input handlers. Displays an error message if Pokemon data is missing.
	 */
	create() {
		if (!this.pokemon1 || !this.pokemon2) {
			console.error("Pokemon data not available");
			this.add
				.text(480, 360, "Error: Pokemon data not available", {
					fontSize: "24px",
					fill: "#ff0000",
				})
				.setOrigin(0.5);
			return;
		}

		// Initialize AudioManager and play background music
		if (window.AudioManager) {
			this.audioManager = new window.AudioManager(this);
			// Only play music if no music is currently playing globally
			if (!window.currentMusic || !window.currentMusic.isPlaying) {
				this.audioManager.playMusic("cider", { loop: true, volume: 0.4 });
				window.currentMusic = this.audioManager.currentMusic;
			} else {
				// Use the existing music reference
				this.audioManager.currentMusic = window.currentMusic;
			}
		} else {
			console.log("Oops... something cursed happened to the audio manager");
		}

		// Adding grasslands backdrop as default
		const backdrop = this.add.image(480, 360, "grasslands");
		backdrop.setDisplaySize(960, 720);

		// Create Pokemon sprites
		const pokemon1SpriteKey = this.getLanguageSprite(this.pokemon1?.name);
		const pokemon2SpriteKey = this.getLanguageSprite(this.pokemon2?.name);

		// Assign sprites
		this.pokemon1Sprite = this.add.image(240, 220, pokemon1SpriteKey);
		// Crab sprite is 50% smaller
		if (pokemon1SpriteKey === "crab") {
			this.pokemon1Sprite.setScale(0.15);
		} else {
			this.pokemon1Sprite.setScale(0.3);
		}

		this.pokemon2Sprite = this.add.image(720, 220, pokemon2SpriteKey);
		// C# sprite is 3 times smaller due to larger source image
		if (pokemon2SpriteKey === "windows_logo") {
			this.pokemon2Sprite.setScale(0.1);
		} else if (pokemon2SpriteKey === "crab") {
			// Crab sprite is 50% smaller
			this.pokemon2Sprite.setScale(0.15);
		} else {
			this.pokemon2Sprite.setScale(0.3);
		}

		// Fetch trainer data and create language banners
		this.fetchAndCreateLanguageBanners();

		// Create UI elements
		this.createHPBars();
		this.createDialogueUI();
		this.createAbilityMessageBoxes();
		this.createAbilityUI();

		this.add.image(470, 470, "sword").setOrigin(0.5);
		this.turnText = this.add
			.text(480, 500, `Turn: ${this.pokemon1?.name}`, {
				fontSize: "16px",
				fill: "#fff",
				stroke: "#000",
				strokeThickness: 2,
			})
			.setOrigin(0.5);

		// this.statusBar = this.add.rectangle(480, 696, 840, 48, 0x333333);
		this.statusBar = this.add.image(480, 696, "greyPressed");
		this.statusBar.setDisplaySize(840, 48);

		this.battleText = this.add
			.text(
				480,
				696,
				"Your turn! Click an ability or use arrow keys + SPACE!",
				{
					fontSize: "12px",
					fill: "#000",
					stroke: "#fff",
					strokeThickness: 1,
				}
			)
			.setOrigin(0.5);

		// Initialize battle log
		this.battleLog = [];
		this.createBattleLog();

		this.setupInputHandlers();

		// Initialize AudioManager
		if (window.AudioManager) {
			this.audioManager = new window.AudioManager(this);
			console.log("AudioManager initialized!");
		} else {
			console.log("Something has gone wrong with the audio manager");
		}

		this.updateUI();
	}
	/**
	 * Maps language names to sprite keys
	 */
	getLanguageSprite(languageName) {
		const spriteMap = {
			"Python": "snake",
			"Go": "gopher",
			"Rust": "crab",
			"OCaml": "camel",
			"C#": "windows_logo",
			"JavaScript & TypeScript": "birb",
			"Ana": "fox"
		};
		return spriteMap[languageName] || "snake";
	}
	/**
	 * Fetches trainer data for a specific language from the database
	 * @param {string} languageId - The language ID to get trainers for
	 * @returns {Promise<Object|null>} Random trainer data or null if none found
	 */
	async fetchTrainerForLanguage(languageId) {
		try {
			const response = await fetch(`/api/language-abilities/trainers/${languageId}`);
			if (!response.ok) {
				console.warn(`Failed to fetch trainers for ${languageId}`);
				return null;
			}
			const trainers = await response.json();
			if (trainers && trainers.length > 0) {
				// Return a random trainer
				const randomIndex = Math.floor(Math.random() * trainers.length);
				return trainers[randomIndex];
			}
			return null;
		} catch (error) {
			console.error('Error fetching trainer data:', error);
			return null;
		}
	}

	/**
	 * Fetches trainer data for both Pokemon and creates language banners
	 */
	async fetchAndCreateLanguageBanners() {
		if (!this.pokemon1?.name || !this.pokemon2?.name) {
			return;
		}

		const pokemon1LanguageId = this.getLanguageId(this.pokemon1.name);
		const pokemon2LanguageId = this.getLanguageId(this.pokemon2.name);

		try {
			const pokemon1Trainer = await this.fetchTrainerForLanguage(pokemon1LanguageId);
			const pokemon2Trainer = await this.fetchTrainerForLanguage(pokemon2LanguageId);

			this.trainerData.pokemon1 = pokemon1Trainer;
			this.trainerData.pokemon2 = pokemon2Trainer;

			this.createLanguageBanner(this.pokemon1.name, 240, 100, pokemon1Trainer);
			this.createLanguageBanner(this.pokemon2.name, 720, 100, pokemon2Trainer);

			try {
				const pokemon1Dialogue = await this.fetchDialogueForTrainer(pokemon1Trainer?.name);
				const pokemon2Dialogue = await this.fetchDialogueForTrainer(pokemon2Trainer?.name);

				this.dialogueData.pokemon1 = pokemon1Dialogue;
				this.dialogueData.pokemon2 = pokemon2Dialogue;

				if (pokemon2Dialogue?.startDialogue) {
					this.showDialogue(pokemon2Dialogue.startDialogue, 3000);
					this.time.delayedCall(3000, () => {
						this.showAbilityButtons();
					});
				} else {
					this.showAbilityButtons();
				}
			} catch (error) {
				this.showAbilityButtons();
			}
		} catch (error) {
			this.createLanguageBanner(this.pokemon1.name, 240, 100);
			this.createLanguageBanner(this.pokemon2.name, 720, 100);
			this.showAbilityButtons();
		}
	}

	/**
	 * Maps language names to their database IDs
	 * @param {string} languageName - The language name to map
	 * @returns {string} The database language ID
	 */
	getLanguageId(languageName) {
		// Safety check for undefined or null languageName
		if (!languageName) {
			console.warn('getLanguageId called with undefined or null languageName');
			return 'unknown';
		}
		
		const languageMap = {
			'Python': 'python',
			'Go': 'go',
			'Rust': 'rust',
			'OCaml': 'ocaml',
			'C#': 'csharp',
			'JavaScript & TypeScript': 'javascript',
			'Ana': 'ana'
		};
		return languageMap[languageName] || languageName.toLowerCase();
	}

	createLanguageBanner(pokemonName, x, y, trainerData = null) {
		// Banner pieces
		const bannerLeft = this.add.image(x - 30, y, "langLeft");
		bannerLeft.setScale(1.5);
		const bannerMid = this.add.image(x, y, "langMid");
		bannerMid.setScale(1.5);
		const bannerRight = this.add.image(x + 30, y, "langRight");
		bannerRight.setScale(1.5);

		// Determine what text to display
		let displayText = pokemonName;
		if (trainerData && trainerData.name) {
			displayText = `${trainerData.name}\n${pokemonName}`;
		}

		// Add text to banner
		this.add
			.text(x, y, displayText, {
				fontSize: "16px",
				fill: "#fff",
				fontStyle: "bold",
				stroke: "#000",
				strokeThickness: 2,
				align: "center"
			})
			.setOrigin(0.5)
			.setDepth(1);
	}
	/**
	 * Creates HP bars for both Pokemon.
	 * Sets up background and foreground rectangles for each Pokemon's HP display,
	 * storing references in the hpBars array for later updates.
	 */
	createHPBars() {
		const hpBar1Bg = this.add.rectangle(240, 55, 120, 20, 0x666666);
		const hpBar1 = this.add.rectangle(240, 55, 120, 20, 0x00ff00);
		this.hpBars.push({ bg: hpBar1Bg, bar: hpBar1, pokemon: this.pokemon1 });

		const hpBar2Bg = this.add.rectangle(720, 55, 120, 20, 0x666666);
		const hpBar2 = this.add.rectangle(720, 55, 120, 20, 0x00ff00);
		this.hpBars.push({ bg: hpBar2Bg, bar: hpBar2, pokemon: this.pokemon2 });
	}

	/**
	 * Creates the dialogue UI for displaying trainer dialogue during battles
	 */
	createDialogueUI() {
		// Create dialogue box background
		this.dialogueBox = this.add.image(720, 340, "greyPressed");
		this.dialogueBox.setDisplaySize(384, 80);
		this.dialogueBox.setAlpha(0.9);

		// Create dialogue text
		this.dialogueText = this.add
			.text(720, 340, "", {
				fontSize: "14px",
				fill: "#000000",
				wordWrap: { width: 360 },
				align: "center"
			})
			.setOrigin(0.5);

		// Initially hide dialogue
		this.dialogueBox.setVisible(false);
		this.dialogueText.setVisible(false);
	}

	/**
	 * Fetches dialogue data for a specific trainer
	 * @param {string} trainerName - The name of the trainer to fetch dialogue for
	 * @returns {Promise<Object|null>} The dialogue data or null if not found
	 */
	async fetchDialogueForTrainer(trainerName) {
		try {
			const response = await fetch(`/api/language-abilities/dialogue/${encodeURIComponent(trainerName)}`);
			if (!response.ok) {
				console.warn(`Failed to fetch dialogue for ${trainerName}`);
				return null;
			}
			const dialogue = await response.json();
			return dialogue;
		} catch (error) {
			console.error(`Error fetching dialogue for ${trainerName}:`, error);
			return null;
		}
	}

	/**
	 * Shows dialogue for a specified duration
	 * @param {string} text - The dialogue text to display
	 * @param {number} duration - Duration in milliseconds (default: 3000)
	 */
	showDialogue(text, duration = 3000) {
		this.dialogueBox.setVisible(true);
		this.dialogueText.setVisible(true);
		this.dialogueText.setText(text);
		
		// Hide dialogue after duration
		this.time.delayedCall(duration, () => {
			this.dialogueBox.setVisible(false);
			this.dialogueText.setVisible(false);
		});
	}

	/**
	 * Shows a random battle dialogue for the AI trainer
	 * @param {string} trainerName - The name of the AI trainer
	 */
	showRandomBattleDialogue(trainerName) {
		// Find the dialogue data for the specific trainer
		let dialogue = null;
		if (this.trainerData.pokemon1 && this.trainerData.pokemon1.name === trainerName) {
			dialogue = this.dialogueData.pokemon1;
		} else if (this.trainerData.pokemon2 && this.trainerData.pokemon2.name === trainerName) {
			dialogue = this.dialogueData.pokemon2;
		}
		
		if (dialogue && dialogue.battleDialogue && dialogue.battleDialogue.length > 0) {
			const randomIndex = Math.floor(Math.random() * dialogue.battleDialogue.length);
			const randomDialogue = dialogue.battleDialogue[randomIndex];
			if (randomDialogue && randomDialogue.trim() !== "") {
				this.showDialogue(randomDialogue, 3000);
			}
		}
	}

	/**
	 * Creates message boxes above each character for displaying ability messages.
	 * These boxes will show when abilities are used and their effects.
	 */
	createAbilityMessageBoxes() {
		// Message box for Pokemon 1 (left side) - aligned with sprite center
		// this.messageBox1 = this.add.rectangle(240, 80, 200, 60, 0x000000, 0.8);
		// this.messageBox1.setStrokeStyle(2, 0xffffff);
		this.messageBox1 = this.add.image(240, 220, "greyPressed");
		this.messageBox1.setDisplaySize(200, 60);
		this.messageBox1.setAlpha(0.9);

		this.messageText1 = this.add
			.text(240, 220, "", {
				fontSize: "12px",
				fill: "#000000",
				wordWrap: { width: 180 },
			})
			.setOrigin(0.5);
		this.messageBox1.setVisible(false);
		this.messageText1.setVisible(false);

		// Message box for Pokemon 2 (right side) - aligned with sprite center
		// this.messageBox2 = this.add.rectangle(720, 80, 200, 60, 0x000000, 0.8);
		// this.messageBox2.setStrokeStyle(2, 0xffffff);
		this.messageBox2 = this.add.image(720, 220, "greyPressed");
		this.messageBox2.setDisplaySize(200, 60);
		this.messageBox2.setAlpha(0.9);

		this.messageText2 = this.add
			.text(720, 220, "", {
				fontSize: "12px",
				fill: "#000000",
				wordWrap: { width: 180 },
			})
			.setOrigin(0.5);
		this.messageBox2.setVisible(false);
		this.messageText2.setVisible(false);
	}

	/**
	 * Creates the battle log display in the bottom right corner.
	 * Shows the last 5 attack events above the status bar.
	 */
	createBattleLog() {
		// Background for battle log
		// this.battleLogBg = this.add.rectangle(720, 600, 300, 120, 0x000000, 0.8);
		// this.battleLogBg.setStrokeStyle(2, 0xffffff);
		this.battleLogBg = this.add.image(720, 600, "battleLog");
		this.battleLogBg.setDisplaySize(300, 120);

		// Title for battle log
		this.battleLogTitle = this.add
			.text(720, 550, "Battle Log:", {
				fontSize: "14px",
				fill: "#FFFFFF",
				stroke: "#000",
				strokeThickness: 2,
			})
			.setOrigin(0.5);

		// Container for log entries
		this.battleLogEntries = [];
		for (let i = 0; i < 5; i++) {
			const entry = this.add
				.text(720, 570 + i * 18, "", {
					fontSize: "10px",
					fill: "#CCCCCC",
					stroke: "#000",
					strokeThickness: 1,
				})
				.setOrigin(0.5);
			this.battleLogEntries.push(entry);
		}
	}

	/**
	 * Adds an event to the battle log and updates the display.
	 * @param {string} event - The event description to add
	 */
	addToBattleLog(event) {
		// Add new event to the beginning of the log
		this.battleLog.unshift(event);

		// Keep only the last 5 events
		if (this.battleLog.length > 5) {
			this.battleLog.pop();
		}

		// Update the display
		this.updateBattleLogDisplay();
	}

	/**
	 * Updates the battle log display with current events.
	 */
	updateBattleLogDisplay() {
		this.battleLogEntries.forEach((entry, index) => {
			if (index < this.battleLog.length) {
				entry.setText(this.battleLog[index]);
			} else {
				entry.setText("");
			}
		});
	}

	/**
	 * Checks if an ability is on round-based cooldown for a specific Pokemon.
	 * @param {Object} pokemon - The Pokemon using the ability
	 * @param {string} abilityName - The name of the ability
	 * @returns {boolean} True if the ability is on cooldown
	 */
	isAbilityOnRoundCooldown(pokemon, abilityName) {
		const key = `${pokemon.name}-${abilityName}`;
		return this.roundCooldowns.has(key);
	}

	/**
	 * Sets an ability on round-based cooldown for a specific Pokemon.
	 * @param {Object} pokemon - The Pokemon using the ability
	 * @param {string} abilityName - The name of the ability
	 */
	setAbilityRoundCooldown(pokemon, abilityName) {
		const key = `${pokemon.name}-${abilityName}`;
		this.roundCooldowns.set(key, this.currentTurn);
	}

	/**
	 * Clears round-based cooldowns at the start of each new round.
	 */
	clearRoundCooldowns() {
		this.roundCooldowns.clear();
	}

	/**
	 * Shows an ability message above a specific character.
	 * @param {string} pokemonName - The name of the Pokemon to show message for
	 * @param {string} message - The message to display
	 * @param {number} duration - How long to show the message (default 2000ms)
	 */
	showAbilityMessage(pokemonName, message, duration = 2000) {
		let messageBox, messageText;

		if (pokemonName === this.pokemon1?.name) {
			messageBox = this.messageBox1;
			messageText = this.messageText1;
		} else if (pokemonName === this.pokemon2?.name) {
			messageBox = this.messageBox2;
			messageText = this.messageText2;
		} else {
			return; // Invalid pokemon name
		}

		// Show the message
		messageText.setText(message);
		messageBox.setVisible(true);
		messageText.setVisible(true);

		// Hide after duration
		this.time.delayedCall(duration, () => {
			messageBox.setVisible(false);
			messageText.setVisible(false);
		});
	}

	/**
	 * Creates the sound to go along with ability buttons using the Audio manager
	 */
	playAbilitySound(ability, isHit = true) {
		if (!this.audioManager) return;
		if (!isHit) {
			this.audioManager.playSoundEffect("miss");
			return;
		}

		// Based on GameManager abilities
		const soundEffectMap = {
			Buff: "buff",
			Control: "control",
			Debuff: "debuff",
			Defensive: "defensive",
			Passive: "passive",
			Physical: "physical",
			Recover: "recover",
			Special: "special",
			Support: "support",
			Utility: "utility",
		};

		const soundKey = soundEffectMap[ability.type] || "physical";

		this.audioManager.playSoundEffect(soundKey);
	}

	/**
	 * Creates the ability UI buttons for the player's Pokemon.
	 * Generates clickable buttons for each ability with hover effects and tooltips.
	 * Buttons are arranged in a 3-column grid and display ability information on hover.
	 */
	createAbilityUI() {
		// clearing old buttons
		this.abilityButtons.forEach((buttonData) => {
			if (buttonData.button && buttonData.button.destroy) {
				buttonData.button.destroy();
			}
			if (buttonData.text && buttonData.button.destroy) {
				buttonData.text.destroy();
			}
		});
		this.abilityButtons = [];

		const abilities = this.pokemon1.abilities;
		const startX = 240;
		const startY = 400;
		const buttonWidth = 120;
		const buttonHeight = 40;
		const spacing = 10;

		abilities.forEach((ability, index) => {
			const x = startX + (index % 2) * (buttonWidth + spacing);
			const y = startY + Math.floor(index / 2) * (buttonHeight + spacing);

			// const button = this.add.rectangle(
			// 	x,
			// 	y,
			// 	buttonWidth,
			// 	buttonHeight,
			// 	0x444444
			// );
			const button = this.add.image(x, y, "enterButton");
			button.setDisplaySize(buttonWidth, buttonHeight);

			const text = this.add
				.text(x, y, ability.name, {
					fontSize: "12px",
					fill: "#fff",
					wordWrap: { width: buttonWidth - 10 },
				})
				.setOrigin(0.5);

			button.setInteractive();
			button.on("pointerdown", () => {
				if (this.battleState === "playerTurn") {
					this.selectedAbility = index;
					console.log("Player Selected Ability: ", this.selectedAbility);
					this.executePlayerAttack();
				}
			});
			button.on("pointerover", () => {
				// button.setFillStyle(0x666666);
				button.setTexture("enterPressed");
				this.battleText.setText(
					`${ability.name} - ${ability.description} (Power: ${ability.power}, Accuracy: ${ability.accuracy}%)`
				);
			});
			button.on("pointerout", () => {
				// button.setFillStyle(0x444444);
				button.setTexture("enterButton");
				if (this.battleState === "playerTurn") {
					this.battleText.setText(
						"Your turn! Click an ability or use arrow keys + SPACE!"
					);
				}
			});

			this.abilityButtons.push({ button, text, ability });
		});
		
		// Initially hide all ability buttons
		this.hideAbilityButtons();
	}
	
	/**
	 * Shows all ability buttons
	 */
	showAbilityButtons() {
		this.abilityButtons.forEach((buttonData) => {
			buttonData.button.setVisible(true);
			buttonData.text.setVisible(true);
		});
	}
	
	/**
	 * Hides all ability buttons
	 */
	hideAbilityButtons() {
		this.abilityButtons.forEach((buttonData) => {
			buttonData.button.setVisible(false);
			buttonData.text.setVisible(false);
		});
	}

	/**
	 * Shows the ability buttons for player selection
	 */
	showAbilityButtons() {
		if (this.abilityButtons) {
			this.abilityButtons.forEach(buttonData => {
				if (buttonData.button) {
					buttonData.button.setVisible(true);
				}
				if (buttonData.text) {
					buttonData.text.setVisible(true);
				}
			});
		}
	}

	/**
	 * Hides the ability buttons
	 */
	hideAbilityButtons() {
		if (this.abilityButtons) {
			this.abilityButtons.forEach(buttonData => {
				if (buttonData.button) {
					buttonData.button.setVisible(false);
				}
				if (buttonData.text) {
					buttonData.text.setVisible(false);
				}
			});
		}
	}

	/**
	 * Sets up keyboard input handlers for battle controls.
	 * Configures arrow key navigation for ability selection, SPACE/ENTER for attack execution,
	 * and restart controls (SPACE/R) for game over state.
	 */
	setupInputHandlers() {
		this.input.keyboard.on("keydown-UP", () => {
			if (this.battleState === "playerTurn") {
				this.selectedAbility = Math.max(0, this.selectedAbility - 3);
				this.updateAbilitySelection();
			}
		});

		this.input.keyboard.on("keydown-DOWN", () => {
			if (this.battleState === "playerTurn") {
				const maxAbilities = this.pokemon1.abilities.length;
				this.selectedAbility = Math.min(
					maxAbilities - 1,
					this.selectedAbility + 3
				);
				this.updateAbilitySelection();
			}
		});

		this.input.keyboard.on("keydown-LEFT", () => {
			if (this.battleState === "playerTurn") {
				this.selectedAbility = Math.max(0, this.selectedAbility - 1);
				this.updateAbilitySelection();
			}
		});

		this.input.keyboard.on("keydown-RIGHT", () => {
			if (this.battleState === "playerTurn") {
				const maxAbilities = this.pokemon1.abilities.length;
				this.selectedAbility = Math.min(
					maxAbilities - 1,
					this.selectedAbility + 1
				);
				this.updateAbilitySelection();
			}
		});

		this.input.keyboard.on("keydown-SPACE", () => {
			if (this.battleState === "playerTurn") {
				this.executePlayerAttack();
			} else if (this.battleState === "gameOver") {
				// Handle next battle in tournament
				this.startNextBattle();
			}
		});

		this.input.keyboard.on("keydown-ENTER", () => {
			if (this.battleState === "playerTurn") {
				this.executePlayerAttack();
			}
		});
	}

	/**
	 * Selects an ability by index and updates the UI accordingly.
	 * Only works during player turn and updates the visual selection state.
	 * @param {number} index - The index of the ability to select
	 */
	selectAbility(index) {
		if (this.battleState === "playerTurn") {
			this.selectedAbility = index;
			this.updateAbilitySelection();
		}
	}

	/**
	 * Updates the visual selection state of ability buttons.
	 * Highlights the currently selected ability and updates the status bar with ability details.
	 */
	updateAbilitySelection() {
		if (this.battleState === "gameOver") {
			return;
		}
		this.abilityButtons.forEach((buttonData, index) => {
			if (index === this.selectedAbility) {
				// buttonData.button.setFillStyle(0x888888);
				buttonData.button.setTexture("enterPressed");
			} else {
				// buttonData.button.setFillStyle(0x444444);
				buttonData.button.setTexture("enterButton");
			}
		});

		const selectedAbility = this.pokemon1.abilities[this.selectedAbility];
		this.battleText.setText(
			`${selectedAbility.name} - ${selectedAbility.description} (Power: ${selectedAbility.power}, Accuracy: ${selectedAbility.accuracy}%)`
		);
	}

	/**
	 * Executes the player's attack using the selected ability.
	 * Calculates damage based on ability power and accuracy, updates HP, and transitions to AI turn.
	 * Handles miss scenarios and game over conditions.
	 */
	executePlayerAttack() {
		this.hideAbilityButtons();

		if (!this.pokemon1 || !this.pokemon2) {
			return;
		}

		const ability = this.pokemon1.abilities[this.selectedAbility];
		if (!ability) {
			return;
		}

		const accuracy = Math.random() * 100;
		const hit = accuracy <= ability.accuracy;

		if (hit) {
			const damage = window.gameManager.calculateDamage(this.pokemon1, this.pokemon2, ability);
			this.pokemon2.hp = Math.max(0, this.pokemon2.hp - damage);

			this.showAbilityMessage(this.pokemon1.name, `${ability.name} deals ${damage} damage!`);
			this.playAbilitySound(ability, true);
			this.playHitAnimation(this.pokemon2Sprite);

			this.applyAbilityEffects(this.pokemon1, this.pokemon2, ability);
		} else {
			this.showAbilityMessage(this.pokemon1.name, `${ability.name} missed!`);
			this.playAbilitySound(ability, false);
		}

		this.updateHPBars();

		if (this.pokemon2.hp <= 0) {
			this.handlePlayerWin();
		} else {
			this.time.delayedCall(2000, () => {
				this.startAITurn();
			});
		}
	}
	
	/**
	 * Handles player win scenario
	 */
	async handlePlayerWin() {
		const result = await window.gameManager.recordWin();
		this.battleState = "gameOver";

		if (result) {
			this.tournamentResult = result;
			this.tournamentPlayerLanguage = this.tournamentInfo?.playerLanguage;
			this.turnText.setText("Press SPACE for next battle");
			this.nextOpponent = result.nextOpponent;
			
			if (result.nextOpponent && result.nextOpponent.trainer) {
				console.log(`Next match: ${this.tournamentPlayerLanguage} vs ${result.nextOpponent.trainer.codemon}`);
			}
		} else {
			this.turnText.setText("Press SPACE for next battle");
		}
	}

	/**
	 * Handles AI win scenario
	 */
	async handleAIWin() {
		const result = await window.gameManager.recordLoss();
		this.battleState = "gameOver";

		if (result) {
			this.tournamentResult = result;
			this.tournamentPlayerLanguage = this.tournamentInfo?.playerLanguage;
			this.turnText.setText("Press SPACE for next battle");
			this.nextOpponent = result.nextOpponent;
			
			if (result.nextOpponent && result.nextOpponent.trainer) {
				console.log(`Next match: ${this.tournamentPlayerLanguage} vs ${result.nextOpponent.trainer.codemon}`);
			}
		} else {
			this.turnText.setText("Press SPACE for next battle");
		}
	}

	/**
	 * Starts the AI's turn with a thinking delay.
	 * Updates the turn indicator and status text, then randomly selects an AI ability.
	 */
	startAITurn() {
		this.battleState = "aiTurn";
		this.turnText.setText(`Turn ${this.currentTurn}: ${this.pokemon2?.name}`);
		this.battleText.setText(`${this.pokemon2?.name} is thinking...`);

		const aiAbilityIndex = Math.floor(
			Math.random() * this.pokemon2.abilities.length
		);
		const aiAbility = this.pokemon2.abilities[aiAbilityIndex];

		this.time.delayedCall(1500, () => {
			this.executeAIAttack(aiAbilityIndex);
		});
	}

	/**
	 * Executes the AI's attack using the specified ability.
	 * Similar to player attack but for the AI Pokemon, with damage calculation and accuracy checks.
	 * @param {number} abilityIndex - The index of the ability the AI will use
	 */
	executeAIAttack(abilityIndex) {
		const ability = this.pokemon2.abilities[abilityIndex];
		if (!ability) {
			return;
		}

		const accuracy = Math.random() * 100;
		const hit = accuracy <= ability.accuracy;

		if (hit) {
			const damage = window.gameManager.calculateDamage(this.pokemon2, this.pokemon1, ability);
			this.pokemon1.hp = Math.max(0, this.pokemon1.hp - damage);

			this.showAbilityMessage(this.pokemon2.name, `${ability.name} deals ${damage} damage!`);
			this.playAbilitySound(ability, true);
			this.playHitAnimation(this.pokemon1Sprite);

			this.applyAbilityEffects(this.pokemon2, this.pokemon1, ability);
		} else {
			this.showAbilityMessage(this.pokemon2.name, `${ability.name} missed!`);
			this.playAbilitySound(ability, false);
		}

		this.updateHPBars();

		if (this.pokemon1.hp <= 0) {
			this.handleAIWin();
		} else {
			this.startPlayerTurn();
		}
	}

	/**
	 * Starts the player's turn and resets the UI state.
	 * Resets ability selection, updates turn indicator, and re-enables ability buttons.
	 */
	startPlayerTurn() {
		this.battleState = "playerTurn";
		this.showAbilityButtons();
	}

	/**
	 * Updates the HP bars to reflect current Pokemon health.
	 * Calculates HP percentage and changes bar color based on health level:
	 * Green (>50%), Yellow (25-50%), Red (<25%).
	 */
	updateHPBars() {
		this.hpBars.forEach((hpBar) => {
			const percentage = hpBar.pokemon.hp / hpBar.pokemon.maxHp;
			const width = 120 * percentage;
			hpBar.bar.width = width;

			if (percentage > 0.5) {
				hpBar.bar.setFillStyle(0x00ff00);
			} else if (percentage > 0.25) {
				hpBar.bar.setFillStyle(0xffff00);
			} else {
				hpBar.bar.setFillStyle(0xff0000);
			}
		});
	}

	/**
	 * Updates the UI elements to reflect current game state.
	 * Refreshes ability button text and updates the ability selection display.
	 */
	updateUI() {
		if (this.abilityButtons.length > 0) {
			this.abilityButtons.forEach((buttonData, index) => {
				if (index === this.selectedAbility) {
					buttonData.button.setTexture("enterPressed");
				} else {
					buttonData.button.setTexture("enterButton");
				}
			});
		}
	}

	/**
	 * Applies ability effects based on the ability type and name.
	 * @param {Object} attacker - The attacking Pokemon
	 * @param {Object} defender - The defending Pokemon
	 * @param {Object} ability - The ability being used
	 * @returns {Array} Array of effect messages
	 */
	applyAbilityEffects(attacker, defender, ability) {
		const messages = [];

		// console.log(`ABILITY EFFECTS: ${attacker.name} used ${ability.name}`);

		switch (ability.name) {
			// === PYTHON ABILITIES ===
			case "Rapid Prototype":
				// console.log(
				// 	`   Rapid Prototype: Python's innate speed and flexibility`
				// );
				// This is a passive ability, but we can show it's working
				messages.push(
					`${attacker.name} demonstrates rapid prototyping capabilities!`
				);
				break;

			case "Ecosystem Call":
				// console.log(
				// 	`   Ecosystem Call: Python imports a module for type advantage`
				// );
				// Simulate type change for 3 turns
				const pythonAvailableTypes = [
					"System",
					"Concurrent",
					"Functional",
					"Managed",
					"Web",
				];
				const opponentType = defender.type.split("/")[0]; // Get primary type

				// Find a type that's super effective against the opponent
				let bestType = pythonAvailableTypes[0];
				if (opponentType === "Managed" || opponentType === "Web") {
					bestType = "Script"; // Python's own type
				} else if (opponentType === "System") {
					bestType = "Script";
				} else if (opponentType === "Concurrent") {
					bestType = "System";
				} else if (opponentType === "Functional") {
					bestType = "System";
				}

				// console.log(`   Python temporarily gains ${bestType} type advantage!`);
				messages.push(
					`${attacker.name} imported ${bestType} module! Type advantage gained!`
				);
				break;

			case "GIL Lock":
				// console.log(
				// 	`   GIL Lock: Prevents multi-core/parallel execution abilities`
				// );
				// Mark the defender as GIL-locked for 2 turns
				defender.gilLocked = 2;
				messages.push(
					`${defender.name} is locked by Python's Global Interpreter Lock!`
				);
				messages.push(
					`${defender.name} cannot use multi-core abilities for 2 turns!`
				);
				break;

			// === GO ABILITIES ===
			case "Fast Compilation":
				// console.log(
				// 	`   Fast Compilation: Go's rapid compilation and robustness`
				// );
				// Check if fighting Script or Managed types for turn priority
				const opponentTypes = defender.type.split("/");
				if (
					opponentTypes.includes("Script") ||
					opponentTypes.includes("Managed")
				) {
					// console.log(
					// 	`   Go gains turn priority vs ${defender.name} (Script/Managed type)`
					// );
					messages.push(
						`${attacker.name} compiles faster against ${defender.name}!`
					);
				}
				break;

			case "Goroutine Swarm":
				console.log(
					`   Goroutine Swarm: 25% chance to inflict Concurrency Bottleneck`
				);
				if (Math.random() < 0.25) {
					// console.log(`   Concurrency Bottleneck triggered!`);
					messages.push(window.gameManager.applyDebuff(defender, "speed", 1));
					messages.push(`${defender.name} is overwhelmed by goroutines!`);
					messages.push(
						`${defender.name} is suffering from Concurrency Bottleneck!`
					);
				} else {
					console.log(`   Concurrency Bottleneck failed (75% chance)`);
				}
				break;

			case "Strict Typing":
				// console.log(
				// 	`   Strict Typing: Go ensures type safety and cleanses status`
				// );
				// Cleanse all status effects
				if (defender.statusEffects && defender.statusEffects.length > 0) {
					defender.statusEffects = [];
					messages.push(
						`${attacker.name} enforced strict typing! Status effects cleansed!`
					);
				}
				// Gain type safety shield
				attacker.typeSafetyShield = 1;
				messages.push(`${attacker.name} gained a type safety shield!`);
				break;

			// === RUST ABILITIES ===
			case "Borrow Checker":
				// console.log(`   Borrow Checker: Rust's memory safety protection`);
				// This is passive, but we can show it's working
				messages.push(
					`${attacker.name}'s borrow checker prevents memory corruption!`
				);
				break;

			case "Zero-Cost Abstraction":
				// console.log(
				// 	`   Zero-Cost Abstraction: Rust applies powerful optimizations`
				// );
				messages.push(window.gameManager.applyBuff(attacker, "attack", 1));
				messages.push(
					window.gameManager.applyBuff(attacker, "specialAttack", 1)
				);
				messages.push(`${attacker.name} applied zero-cost abstractions!`);
				messages.push(`These buffs cannot be copied or removed!`);
				break;

			case "Ownership Transfer":
				// console.log(`   Ownership Transfer: Rust transfers resource ownership`);
				const buffStats = Object.keys(defender.buffs).filter(
					(stat) => defender.buffs[stat] > 0
				);
				if (buffStats.length > 0) {
					const randomStat =
						buffStats[Math.floor(Math.random() * buffStats.length)];
					const oldBuff = defender.buffs[randomStat];
					defender.buffs[randomStat] = Math.max(
						0,
						defender.buffs[randomStat] - 1
					);
					// console.log(`   Rust transferred ownership of ${randomStat} buff`);
					messages.push(
						`${defender.name}'s ${randomStat} buff was transferred!`
					);
				} else {
					// console.log(`   No buffs to transfer - applying Rust-Bound`);
					defender.rustBound = 1;
					messages.push(
						`${defender.name} is Rust-Bound! Cannot use primary offensive ability!`
					);
				}
				break;

			// === OCAML ABILITIES ===
			case "Type Inference":
				// console.log(`   Type Inference: OCaml's strong, implicit typing`);
				// This is passive, but we can show it's working
				const hasMultipleTypes = defender.type.includes("/");
				if (hasMultipleTypes) {
					console.log(`   OCaml gains advantage vs multi-type target`);
					messages.push(
						`${attacker.name} inferred ${defender.name}'s complex types!`
					);
				}
				break;

			case "Pattern Matching":
				// console.log(
				// 	`   Pattern Matching: OCaml dissects logic and data structures`
				// );
				// Check if target is "complex" (C++ or JS/TS)
				if (
					defender.name === "C++" ||
					defender.name === "JavaScript & TypeScript"
				) {
					// console.log(
					// 	`   Pattern Matching gains +25 bonus vs complex language`
					// );
					messages.push(
						`${attacker.name} perfectly matched ${defender.name}'s patterns!`
					);
				}

				// 35% chance to disrupt passive ability
				if (Math.random() < 0.35) {
					console.log(`   Passive ability disrupted!`);
					defender.passiveDisrupted = 1;
					messages.push(`${defender.name}'s passive ability was disrupted!`);
				} else {
					console.log(`   Passive disruption failed (65% chance)`);
				}
				break;

			case "Immutability":
				// Check if Immutability is on round-based cooldown
				if (this.isAbilityOnRoundCooldown(attacker, "Immutability")) {
					// console.log(
					// 	`   Immutability: Already used this round, skipping effect`
					// );
					messages.push(
						`${attacker.name} cannot use Immutability again this round!`
					);
					break;
				}

				// console.log(`   Immutability: OCaml's state is immutable and pure`);
				const healAmount = Math.floor(attacker.maxHp * 0.35);
				attacker.hp = Math.min(attacker.maxHp, attacker.hp + healAmount);
				console.log(`   OCaml healed ${healAmount} HP through immutability`);
				messages.push(`${attacker.name} restored state through immutability!`);
				messages.push(`${attacker.name} healed ${healAmount} HP!`);

				// Set round-based cooldown
				this.setAbilityRoundCooldown(attacker, "Immutability");

				// Cleanse non-volatile status conditions
				if (attacker.statusEffects) {
					attacker.statusEffects = attacker.statusEffects.filter(
						(status) =>
							!["Memory Leak", "Crash", "Callback Hell"].includes(status)
					);
					messages.push(
						`${attacker.name} was cleansed of volatile status effects!`
					);
				}
				break;

			// === C++ ABILITIES ===
			case "Unsafe Block":
				// console.log(
				// 	`   Unsafe Block: C++ directly manipulates memory and hardware`
				// );
				if (Math.random() < 0.2) {
					console.log(`   Undefined Behavior triggered!`);
					const recoilDamage = Math.floor(attacker.maxHp * 0.15);
					attacker.hp = Math.max(0, attacker.hp - recoilDamage);

					// Apply random severe status
					const severeStatuses = ["Crash", "Memory Leak"];
					const randomStatus =
						severeStatuses[Math.floor(Math.random() * severeStatuses.length)];
					if (!attacker.statusEffects) attacker.statusEffects = [];
					attacker.statusEffects.push(randomStatus);

					// console.log(
					// 	`   C++ suffered ${randomStatus} from Undefined Behavior`
					// );
					messages.push(`${attacker.name} suffered Undefined Behavior!`);
					messages.push(`${attacker.name} took ${recoilDamage} recoil damage!`);
					messages.push(`${attacker.name} is afflicted with ${randomStatus}!`);
				} else {
					console.log(`   No Undefined Behavior (80% chance)`);
				}
				break;

			case "Optimized Parallelism":
				// console.log(
				// 	`   Optimized Parallelism: C++ leverages multi-core architectures`
				// );
				if (this.currentTurn % 2 === 0) {
					// console.log(`   Every 2 turns: Speed and Attack increase`);
					messages.push(window.gameManager.applyBuff(attacker, "speed", 1));
					messages.push(window.gameManager.applyBuff(attacker, "attack", 1));
					messages.push(`${attacker.name} optimized parallel execution!`);
				} else {
					console.log(`   Not turn 2: No parallel optimization`);
				}
				break;

			case "Legacy Integration":
				// console.log(`   Legacy Integration: C++ draws upon existing codebases`);
				attacker.compatibilityShield = 2;
				messages.push(`${attacker.name} integrated legacy systems!`);
				messages.push(
					`${attacker.name} gained Compatibility Shield for 2 turns!`
				);
				break;

			// === JAVASCRIPT & TYPESCRIPT ABILITIES ===
			case "Asynchronous Promise":
				// console.log(
				// 	`   Asynchronous Promise: JS/TS initiates non-blocking call`
				// );
				// Schedule delayed damage for next turn
				if (!attacker.pendingDamage) attacker.pendingDamage = [];
				attacker.pendingDamage.push({
					target: defender,
					damage: 25,
					turn: this.currentTurn + 1,
					description: "Async Promise delayed damage",
				});

				messages.push(`${attacker.name} initiated an asynchronous call!`);
				messages.push(`25 damage will be dealt next turn!`);

				// 25% chance of Callback Hell
				if (Math.random() < 0.25) {
					// console.log(`   Callback Hell inflicted!`);
					if (!defender.statusEffects) defender.statusEffects = [];
					defender.statusEffects.push("Callback Hell");
					messages.push(`${defender.name} is suffering from Callback Hell!`);
				} else {
					console.log(`   Callback Hell failed (75% chance)`);
				}
				break;

			case "Framework Flux":
				// console.log(
				// 	`   Framework Flux: JS/TS power fluctuates with framework landscape`
				// );
				const fluxRoll = Math.random();
				if (fluxRoll < 0.4) {
					const stats = [
						"attack",
						"specialAttack",
						"defense",
						"specialDefense",
						"speed",
					];
					const randomStat = stats[Math.floor(Math.random() * stats.length)];
					// console.log(
					// 	`   +1 ${randomStat} buff applied (${(fluxRoll * 100).toFixed(
					// 		1
					// 	)}% < 40%)`
					// );
					messages.push(window.gameManager.applyBuff(attacker, randomStat, 1));
					messages.push(`${attacker.name} adopted a new framework!`);
				} else if (fluxRoll < 0.5) {
					const stats = [
						"attack",
						"specialAttack",
						"defense",
						"specialDefense",
						"speed",
					];
					const randomStat = stats[Math.floor(Math.random() * stats.length)];
					// console.log(
					// 	`   -1 ${randomStat} debuff applied (${(fluxRoll * 100).toFixed(
					// 		1
					// 	)}% < 50%)`
					// );
					messages.push(
						window.gameManager.applyDebuff(attacker, randomStat, 1)
					);
					messages.push(`${attacker.name} deprecated an old framework!`);
				} else {
					// console.log(
					// 	`   No stat change (${(fluxRoll * 100).toFixed(1)}% > 50%)`
					// );
					messages.push(`${attacker.name} maintained framework stability!`);
				}
				break;

			case "Transpilation":
				// console.log(`   Transpilation: JS/TS changes to advantageous type`);
				const jsAvailableTypes = [
					"System",
					"Concurrent",
					"Functional",
					"Managed",
				];
				const opponentPrimaryType = defender.type.split("/")[0];

				// Choose type that's super effective against opponent
				let transpiledType = jsAvailableTypes[0];
				if (opponentPrimaryType === "System") {
					transpiledType = "Functional";
				} else if (opponentPrimaryType === "Concurrent") {
					transpiledType = "System";
				} else if (opponentPrimaryType === "Functional") {
					transpiledType = "System";
				} else if (opponentPrimaryType === "Managed") {
					transpiledType = "Functional";
				}

				// console.log(`   JS/TS transpiled to ${transpiledType} type!`);
				messages.push(`${attacker.name} transpiled to ${transpiledType}!`);
				messages.push(`Type advantage gained for 2 turns!`);
				break;
		}

		return messages;
	}

	/**
	 * Plays hit animation on the specified sprite.
	 * Creates a shake effect and flashes the sprite white when hit.
	 * @param {Phaser.GameObjects.Rectangle} sprite - The Pokemon sprite to animate
	 */
	playHitAnimation(sprite) {
		// Store original position and color
		const originalX = sprite.x;
		const originalY = sprite.y;
		// const originalColor = sprite.fillColor;
		const originalTint = sprite.tint;

		// Flash white effect
		// sprite.setFillStyle(0xffffff);
		sprite.setTint(0xffffff);

		// Create shake animation
		const shakeIntensity = 8;
		const shakeDuration = 400;
		const shakeSteps = 8;
		const stepDuration = shakeDuration / shakeSteps;

		let currentStep = 0;

		const shakeTimer = this.time.addEvent({
			delay: stepDuration,
			repeat: shakeSteps - 1,
			callback: () => {
				currentStep++;

				if (currentStep < shakeSteps) {
					// Random shake offset
					const offsetX = (Math.random() - 0.5) * shakeIntensity;
					const offsetY = (Math.random() - 0.5) * shakeIntensity;
					sprite.setPosition(originalX + offsetX, originalY + offsetY);
				} else {
					// Return to original position and color
					sprite.setPosition(originalX, originalY);
					// sprite.setFillStyle(originalColor);
					sprite.setTint(originalTint);
				}
			},
		});

		// Also flash back to original color after a short delay
		this.time.delayedCall(200, () => {
			if (currentStep >= shakeSteps) {
				// sprite.setFillStyle(originalColor);
				sprite.setTint(originalTint);
			}
		});
	}

	/**
	 * Main update loop that runs every frame.
	 */
	update() {
		// Tournament battles only - no restart functionality needed
	}

	/**
	 * Starts the next battle in the tournament
	 */
	startNextBattle() {
		if (!window.gameManager.isGameDataLoaded()) {
			this.scene.start("EndScene", {
				result: this.tournamentResult,
				playerLanguage: this.tournamentPlayerLanguage
			});
			return;
		}

		if (this.nextOpponent && this.nextOpponent.trainer) {
			const playerLanguageId = this.tournamentInfo?.playerLanguage || window.gameManager.tournament?.playerLanguage;
			
			const battleData = window.gameManager.startTournamentBattle(
				playerLanguageId,
				this.nextOpponent.trainer.codemon
			);
			
			if (battleData) {
				this.scene.start("BattleScene", {
					pokemon1: battleData.pokemon1,
					pokemon2: battleData.pokemon2,
					tournamentInfo: this.tournamentInfo,
					tournamentPlayerLanguage: playerLanguageId,
					nextOpponent: null
				});
			} else {
				this.scene.start("EndScene", {
					result: this.tournamentResult,
					playerLanguage: playerLanguageId
				});
			}
		} else {
			this.scene.start("EndScene", {
				result: this.tournamentResult,
				playerLanguage: this.tournamentPlayerLanguage
			});
		}
	}
}
