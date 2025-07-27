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
		this.currentTurn = 1;
		this.battleState = "playerTurn";
		this.selectedAbility = 0;
		this.abilityButtons = [];
		this.hpBars = [];
		this.battleText = null;
		this.turnText = null;
		this.audioManager = null; // Added audio manage for sound effects
		this.isPlayerTurn = true;
		this.roundCooldowns = new Map();
	}

	/**
	 * Initializes the battle scene with Pokemon data from the previous scene.
	 * Resets battle state variables to their initial values for a fresh battle.
	 * @param {Object} data - Battle data containing pokemon1 and pokemon2 objects
	 */
	init(data) {
		this.pokemon1 = data.pokemon1;
		this.pokemon2 = data.pokemon2;
		this.currentTurn = 1;
		this.battleState = "playerTurn";
		this.selectedAbility = 0;
		this.isPlayerTurn = true;

		// Store tournament info if it exists
		if (data.tournamentInfo) {
			this.tournamentInfo = data.tournamentInfo;
			this.tournamentPlayerLanguage = data.playerLanguage;
		} else {
			this.tournamentInfo = null;
			this.tournamentPlayerLanguage = null;
		}

		if (data.playerLanguage) {
			this.tournamentPlayerLanguage = data.playerLanguage;
		}
	}

	/**
	 * Preloads audio files from assets folder
	 */
	//TODO:
	// update files
	preload() {
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

		this.add.rectangle(0, 0, 960, 720, 0x87ceeb).setOrigin(0, 0);

		this.add.rectangle(480, 360, 840, 600, 0x228b22).setOrigin(0.5);
		this.add.rectangle(480, 360, 820, 580, 0x32cd32).setOrigin(0.5);

		this.pokemon1Sprite = this.add.rectangle(240, 240, 80, 80, 0xff6b35);
		this.pokemon2Sprite = this.add.rectangle(720, 240, 80, 80, 0x4169e1);

		this.add
			.text(240, 144, this.pokemon1.name, {
				fontSize: "24px",
				fill: "#fff",
				stroke: "#000",
				strokeThickness: 3,
			})
			.setOrigin(0.5);

		this.add
			.text(720, 144, this.pokemon2.name, {
				fontSize: "24px",
				fill: "#fff",
				stroke: "#000",
				strokeThickness: 3,
			})
			.setOrigin(0.5);

		this.createHPBars();
		this.createBuffsDebuffsUI();
		this.createAbilityUI();
		this.createAbilityMessageBoxes();

		this.turnText = this.add
			.text(480, 500, `Turn: ${this.pokemon1.name}`, {
				fontSize: "16px",
				fill: "#fff",
				stroke: "#000",
				strokeThickness: 2,
			})
			.setOrigin(0.5);

		this.statusBar = this.add.rectangle(480, 696, 840, 48, 0x333333);
		this.battleText = this.add
			.text(
				480,
				696,
				"Your turn! Click an ability or use arrow keys + SPACE!",
				{
					fontSize: "12px",
					fill: "#fff",
					stroke: "#000",
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
			console.log("Nope, you broke it...");
		}

		this.updateUI();
	}

	/**
	 * Creates HP bars for both Pokemon.
	 * Sets up background and foreground rectangles for each Pokemon's HP display,
	 * storing references in the hpBars array for later updates.
	 */
	createHPBars() {
		const hpBar1Bg = this.add.rectangle(240, 180, 120, 20, 0x666666);
		const hpBar1 = this.add.rectangle(240, 180, 120, 20, 0x00ff00);
		this.hpBars.push({ bg: hpBar1Bg, bar: hpBar1, pokemon: this.pokemon1 });

		const hpBar2Bg = this.add.rectangle(720, 180, 120, 20, 0x666666);
		const hpBar2 = this.add.rectangle(720, 180, 120, 20, 0x00ff00);
		this.hpBars.push({ bg: hpBar2Bg, bar: hpBar2, pokemon: this.pokemon2 });
	}

	/**
	 * Creates the buffs and debuffs display UI for both Pokemon.
	 * Shows current stat modifications below each Pokemon.
	 */
	createBuffsDebuffsUI() {
		this.buffsDebuffsUI = {
			pokemon1: this.createPokemonBuffsDebuffs(this.pokemon1, 240, 220),
			pokemon2: this.createPokemonBuffsDebuffs(this.pokemon2, 720, 220),
		};
	}

	/**
	 * Creates buffs and debuffs display for a single Pokemon.
	 * @param {Object} pokemon - The Pokemon to create UI for
	 * @param {number} x - X position for the UI
	 * @param {number} y - Y position for the UI
	 * @returns {Object} UI elements for buffs and debuffs
	 */
	createPokemonBuffsDebuffs(pokemon, x, y) {
		// Create background box for status effects - positioned further down
		const boxWidth = 220;
		const boxHeight = 120;
		const boxY = y + 160; // Double the distance down

		const backgroundBox = this.add.rectangle(
			x,
			boxY,
			boxWidth,
			boxHeight,
			0x000000,
			0.7
		);
		backgroundBox.setStrokeStyle(2, 0xffffff);

		const ui = {
			backgroundBox: backgroundBox,
			buffsContainer: [],
			debuffsContainer: [],
			titleText: this.add
				.text(x, boxY - 45, "Status Effects:", {
					fontSize: "14px",
					fill: "#FFFFFF",
					stroke: "#000",
					strokeThickness: 2,
				})
				.setOrigin(0.5),
		};

		this.updateBuffsDebuffsDisplay(pokemon, ui);
		return ui;
	}

	/**
	 * Updates the buffs and debuffs display for a Pokemon.
	 * @param {Object} pokemon - The Pokemon to update
	 * @param {Object} ui - The UI elements to update
	 */
	updateBuffsDebuffsDisplay(pokemon, ui) {
		// Clear existing buff/debuff text elements
		ui.buffsContainer.forEach((text) => text.destroy());
		ui.debuffsContainer.forEach((text) => text.destroy());
		ui.buffsContainer = [];
		ui.debuffsContainer = [];

		const stats = [
			"attack",
			"specialAttack",
			"defense",
			"specialDefense",
			"speed",
		];
		let buffCount = 0;
		let debuffCount = 0;

		stats.forEach((stat) => {
			const buffStages = pokemon.buffs[stat] || 0;
			const debuffStages = pokemon.debuffs[stat] || 0;

			if (buffStages > 0) {
				const buffText = this.add
					.text(
						ui.titleText.x,
						ui.titleText.y + 15 + buffCount * 15,
						`• ${stat.toUpperCase()}: +${buffStages}`,
						{
							fontSize: "12px",
							fill: "#00FF00",
							stroke: "#000",
							strokeThickness: 1,
						}
					)
					.setOrigin(0.5);
				ui.buffsContainer.push(buffText);
				buffCount++;
			}
		});

		// Add debuffs after buffs
		stats.forEach((stat) => {
			const debuffStages = pokemon.debuffs[stat] || 0;

			if (debuffStages > 0) {
				const debuffText = this.add
					.text(
						ui.titleText.x,
						ui.titleText.y + 15 + (buffCount + debuffCount) * 15,
						`• ${stat.toUpperCase()}: -${debuffStages}`,
						{
							fontSize: "12px",
							fill: "#FF0000",
							stroke: "#000",
							strokeThickness: 1,
						}
					)
					.setOrigin(0.5);
				ui.debuffsContainer.push(debuffText);
				debuffCount++;
			}
		});

		// Show/hide title and background box based on whether there are any effects
		const hasEffects = buffCount > 0 || debuffCount > 0;
		ui.titleText.setVisible(hasEffects);
		ui.backgroundBox.setVisible(hasEffects);
	}

	/**
	 * Creates message boxes above each character for displaying ability messages.
	 * These boxes will show when abilities are used and their effects.
	 */
	createAbilityMessageBoxes() {
		// Message box for Pokemon 1 (left side) - moved higher up
		this.messageBox1 = this.add.rectangle(240, 80, 200, 60, 0x000000, 0.8);
		this.messageBox1.setStrokeStyle(2, 0xffffff);
		this.messageText1 = this.add
			.text(240, 80, "", {
				fontSize: "12px",
				fill: "#FFFFFF",
				wordWrap: { width: 180 },
			})
			.setOrigin(0.5);
		this.messageBox1.setVisible(false);
		this.messageText1.setVisible(false);

		// Message box for Pokemon 2 (right side) - moved higher up
		this.messageBox2 = this.add.rectangle(720, 80, 200, 60, 0x000000, 0.8);
		this.messageBox2.setStrokeStyle(2, 0xffffff);
		this.messageText2 = this.add
			.text(720, 80, "", {
				fontSize: "12px",
				fill: "#FFFFFF",
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
		this.battleLogBg = this.add.rectangle(720, 600, 300, 120, 0x000000, 0.8);
		this.battleLogBg.setStrokeStyle(2, 0xffffff);

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

		if (pokemonName === this.pokemon1.name) {
			messageBox = this.messageBox1;
			messageText = this.messageText1;
		} else if (pokemonName === this.pokemon2.name) {
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
		const abilities = this.pokemon1.abilities;
		const startX = 120;
		const startY = 580;
		const buttonWidth = 120;
		const buttonHeight = 40;
		const spacing = 10;

		abilities.forEach((ability, index) => {
			const x = startX + (index % 3) * (buttonWidth + spacing);
			const y = startY + Math.floor(index / 3) * (buttonHeight + spacing);

			const button = this.add.rectangle(
				x,
				y,
				buttonWidth,
				buttonHeight,
				0x444444
			);
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
				button.setFillStyle(0x666666);
				this.battleText.setText(
					`${ability.name} - ${ability.description} (Power: ${ability.power}, Accuracy: ${ability.accuracy}%)`
				);
			});
			button.on("pointerout", () => {
				button.setFillStyle(0x444444);
				if (this.battleState === "playerTurn") {
					this.battleText.setText(
						"Your turn! Click an ability or use arrow keys + SPACE!"
					);
				}
			});

			this.abilityButtons.push({ button, text, ability });
		});
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
		this.abilityButtons.forEach((buttonData, index) => {
			if (index === this.selectedAbility) {
				buttonData.button.setFillStyle(0x888888);
			} else {
				buttonData.button.setFillStyle(0x444444);
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
		const attacker = this.pokemon1;
		const defender = this.pokemon2;
		const ability = attacker.abilities[this.selectedAbility];

		this.battleState = "animating";
		this.battleText.setText(`${attacker.name} used ${ability.name}!`);

		this.abilityButtons.forEach((buttonData) => {
			buttonData.button.setFillStyle(0x222222);
		});

		const accuracy = Math.random() * 100;
		console.log(
			`ACCURACY CHECK: ${attacker.name} ${ability.name} (${
				ability.accuracy
			}% accuracy) - Rolled ${accuracy.toFixed(1)}%`
		);

		if (accuracy <= ability.accuracy) {
			console.log(`   HIT! (${accuracy.toFixed(1)}% ≤ ${ability.accuracy}%)`);

			// Use the new damage calculation system
			const damage = window.gameManager.calculateDamage(
				attacker,
				defender,
				ability
			);
			defender.hp = Math.max(0, defender.hp - damage);

			// Apply ability effects
			const effectMessages = this.applyAbilityEffects(
				attacker,
				defender,
				ability
			);

			// Show ability message above the attacker
			this.showAbilityMessage(
				attacker.name,
				`${ability.name}!\nDealt ${damage} damage!`
			);

			// Add to battle log
			this.addToBattleLog(`${attacker.name}: ${ability.name} (${damage} dmg)`);

			let message = `${attacker.name} used ${ability.name}! It dealt ${damage} damage!`;
			if (effectMessages.length > 0) {
				message += "\n" + effectMessages.join("\n");
			}
			this.battleText.setText(message);

			// Play sound effect - thought is that this might be best to render first
			// TODO:
			// Expore idea: maybe volume could be slightly lower for less damage and slightly higher for more damage
			this.playAbilitySound(ability, true);

			// Play hit animation on the defender (pokemon2)
			this.playHitAnimation(this.pokemon2Sprite);
		} else {
			console.log(`   MISS! (${accuracy.toFixed(1)}% > ${ability.accuracy}%)`);

			// Play sound effect
			this.playAbilitySound(ability, false);

			this.showAbilityMessage(attacker.name, `${ability.name}!\nMissed!`);

			// Add to battle log
			this.addToBattleLog(`${attacker.name}: ${ability.name} (MISS)`);

			this.battleText.setText(
				`${attacker.name} used ${ability.name}! But it missed!`
			);
		}

		this.updateHPBars();
		this.updateBuffsDebuffsUI();

		// if (defender.hp <= 0) {
		// 	this.battleState = "gameOver";
		// 	this.battleText.setText(
		// 		`${defender.name} fainted! ${attacker.name} wins!`
		// 	);
		// 	this.turnText.setText("Press SPACE or R to restart");
		// 	return;
		// }

		if (defender.hp <= 0) {
			console.log("Defender hp dropped below zero: ");
			this.battleState = "gameOver";

			if (window.gameManager.tournament) {
				const result = window.gameManager.recordWin();
				console.log("Execute player attack: ", result);

				if (result.completed) {
					// console.log("Player should have won: ", result);
					// // Handle finished tournament
					// this.battleText.setText(
					// 	"You won the tournament, congratulations! You get a shiny!"
					// );
					// this.turnText.setText(
					// 	`Final Score: ${result.wins}/${result.total} - Press SPACE or R to restart`
					// );
					this.scene.start("EndScene", {
						result: result,
						playerLanguage: this.tournamentPlayerLanguage,
					});
				} else {
					console.log("Getting next opponent.... ");
					const nextOpponent = result.nextOpponent;
					console.log("Getting next opponent: ", nextOpponent);
					this.nextOpponent = nextOpponent;
					this.battleText.setText(
						`${defender.name} fainted! ${attacker.name} wins`
					);
					this.turnText.setText("Press SPACE for next match");
				}
			} else {
				// Return single battle
				this.battleText.setText(
					`${defender.name} fainted! ${attacker.name} wins`
				);
				console.log("Single battle triggered");
				this.turnText.setText("Press SPACE or R to restart");
			}
			return;
		}

		this.time.delayedCall(2000, () => {
			this.startAITurn();
		});
	}

	/**
	 * Starts the AI's turn with a thinking delay.
	 * Updates the turn indicator and status text, then randomly selects an AI ability.
	 */
	startAITurn() {
		this.battleState = "aiTurn";
		this.turnText.setText(`Turn ${this.currentTurn}: ${this.pokemon2.name}`);
		this.battleText.setText(`${this.pokemon2.name} is thinking...`);

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
		const attacker = this.pokemon2;
		const defender = this.pokemon1;
		const ability = attacker.abilities[abilityIndex];

		this.battleState = "animating";
		this.battleText.setText(`${attacker.name} used ${ability.name}!`);

		const accuracy = Math.random() * 100;
		console.log(
			`ACCURACY CHECK: ${attacker.name} ${ability.name} (${
				ability.accuracy
			}% accuracy) - Rolled ${accuracy.toFixed(1)}%`
		);

		if (accuracy <= ability.accuracy) {
			console.log(`   HIT! (${accuracy.toFixed(1)}% ≤ ${ability.accuracy}%)`);

			// Use the new damage calculation system
			const damage = window.gameManager.calculateDamage(
				attacker,
				defender,
				ability
			);
			defender.hp = Math.max(0, defender.hp - damage);

			// Apply ability effects
			const effectMessages = this.applyAbilityEffects(
				attacker,
				defender,
				ability
			);

			// Show ability message above the attacker
			this.showAbilityMessage(
				attacker.name,
				`${ability.name}!\nDealt ${damage} damage!`
			);

			// Add to battle log
			this.addToBattleLog(`${attacker.name}: ${ability.name} (${damage} dmg)`);

			let message = `${attacker.name} used ${ability.name}! It dealt ${damage} damage!`;
			if (effectMessages.length > 0) {
				message += "\n" + effectMessages.join("\n");
			}
			this.battleText.setText(message);

			// Play hit audio for AI
			this.playAbilitySound(ability, true);

			// Play hit animation on the defender (pokemon1)
			this.playHitAnimation(this.pokemon1Sprite);
		} else {
			console.log(`   MISS! (${accuracy.toFixed(1)}% > ${ability.accuracy}%)`);
			this.showAbilityMessage(attacker.name, `${ability.name}!\nMissed!`);

			// Play miss audio
			this.playAbilitySound(ability, false);

			// Add to battle log
			this.addToBattleLog(`${attacker.name}: ${ability.name} (MISS)`);

			this.battleText.setText(
				`${attacker.name} used ${ability.name}! But it missed!`
			);
		}

		this.updateHPBars();
		this.updateBuffsDebuffsUI();

		// if (defender.hp <= 0) {
		// 	this.battleState = "gameOver";
		// 	this.battleText.setText(
		// 		`${defender.name} fainted! ${attacker.name} wins!`
		// 	);
		// 	this.turnText.setText("Press SPACE or R to restart");
		// 	return;
		// }
		if (defender.hp <= 0) {
			console.log(`Game over: ${defender.hp}`);

			this.battleState = "gameOver";

			if (window.gameManager.tournament) {
				const result = window.gameManager.recordLoss();
				// this.battleText.setText(
				// 	`${defender.name} fainted! Tournament over. Final score: ${result.wins}/${result.total} wins`
				// );
				// this.turnText.setText("Press SPACE or R to restart");
				this.scene.start("EndScene", {
					result: result,
					playerLanguage: this.tournamentPlayerLanguage,
				});
			} else {
				console.log("Single battle activated.... ");
				// Single battle
				this.battleText.setText(
					`${defender.name} fainted! ${attacker.name} wins!`
				);
				this.turnText.setText("Press SPACE or R to restart");
			}
			return;
		}

		this.time.delayedCall(2000, () => {
			this.startPlayerTurn();
		});
	}

	/**
	 * Starts the player's turn and resets the UI state.
	 * Resets ability selection, updates turn indicator, and re-enables ability buttons.
	 */
	startPlayerTurn() {
		this.currentTurn++;
		this.battleState = "playerTurn";
		this.selectedAbility = 0;
		this.turnText.setText(`Turn ${this.currentTurn}: ${this.pokemon1.name}`);
		this.battleText.setText(
			"Your turn! Click an ability or use arrow keys + SPACE!"
		);
		this.updateAbilitySelection();

		// Clear round-based cooldowns at the start of each new round
		this.clearRoundCooldowns();

		this.abilityButtons.forEach((buttonData) => {
			buttonData.button.setFillStyle(0x444444);
		});
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
		console.log("update UI called for: ", this.pokemon1?.name);
		console.log("Pokemon abilities in update: ", this.pokemon1?.abilities);
		console.log("ability buttons lenght: ", this.abilityButtons?.length);

		this.abilityButtons.forEach((buttonData, index) => {
			const abilities = this.pokemon1.abilities;
			if (index < abilities.length) {
				buttonData.text.setText(abilities[index].name);
				buttonData.ability = abilities[index];
			}
		});

		this.updateAbilitySelection();
	}

	/**
	 * Updates the buffs and debuffs display for both Pokemon.
	 */
	updateBuffsDebuffsUI() {
		this.updateBuffsDebuffsDisplay(this.pokemon1, this.buffsDebuffsUI.pokemon1);
		this.updateBuffsDebuffsDisplay(this.pokemon2, this.buffsDebuffsUI.pokemon2);
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
		const originalColor = sprite.fillColor;

		// Flash white effect
		sprite.setFillStyle(0xffffff);

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
					sprite.setFillStyle(originalColor);
				}
			},
		});

		// Also flash back to original color after a short delay
		this.time.delayedCall(200, () => {
			if (currentStep >= shakeSteps) {
				sprite.setFillStyle(originalColor);
			}
		});
	}

	/**
	 * Main update loop that runs every frame.
	 * Handles restart controls when the game is over (SPACE or R key).
	 */
	// update() {
	// 	if (
	// 		this.battleState === "gameOver" &&
	// 		this.nextOpponent &&
	// 		this.input.keyboard.checkDown(this.input.keyboard.addKey("SPACE"), 1000)
	// 	) {
	// 		// this.scene.start("BootScene");
	// 		const battleData = window.gameManager.startBattle(
	// 			this.tournamentPlayerLanguage,
	// 			this.nextOpponent.trainer.language
	// 		);
	// 		if (battleData) {
	// 			battleData.tournamentInfo = this.nextOpponent;
	// 			battleData.playerLanguage = this.tournamentPlayerLanguage;
	// 			this.scene.start("BattleScene", battleData);
	// 		}
	// 	} else if (
	// 		this.battleState === "gameOver" &&
	// 		!this.nextOpponent &&
	// 		this.input.keyboard.checkDown(this.input.keyboard.addKey("SPACE"), 1000)
	// 	) {
	// 		this.scene.start("BootScene");
	// 	}

	// 	// Allow R to always refresh
	// 	if (this.input.keyboard.checkDown(this.input.keyboard.addKey("R"), 1000)) {
	// 		this.scene.start("BootScene");
	// 	}
	// }
	update() {
		if (this.battleState === "gameOver") {
			// Check for SPACE key press
			if (
				this.input.keyboard.checkDown(this.input.keyboard.addKey("SPACE"), 1000)
			) {
				if (this.nextOpponent) {
					// Debug logging
					console.log(
						"Debug - tournamentPlayerLanguage:",
						this.tournamentPlayerLanguage
					);
					console.log("Debug - nextOpponent:", this.nextOpponent);
					console.log(
						"Debug - trainer language:",
						this.nextOpponent.trainer.language
					);

					// Check if these Pokemon IDs exist
					const pokemon1Data = window.gameManager.getPokemonData(
						this.tournamentPlayerLanguage
					);
					const pokemon2Data = window.gameManager.getPokemonData(
						this.nextOpponent.trainer.language
					);

					// console.log("Debug - pokemon1Data exists:", !!pokemon1Data);
					// console.log("Debug - pokemon2Data exists:", !!pokemon2Data);

					// There's a next opponent - start next battle
					const battleData = window.gameManager.startBattle(
						this.tournamentPlayerLanguage,
						this.nextOpponent.trainer.language
					);

					if (battleData) {
						battleData.tournamentInfo = this.nextOpponent;
						battleData.playerLanguage = this.tournamentPlayerLanguage;
						this.scene.start("BattleScene", battleData);
					} else {
						console.error("Failed to create battle data!");
					}
				} else {
					// No next opponent or tournament completed - go back to main menu
					this.scene.start("BootScene");
				}
			}

			// Allow R to always restart from beginning
			if (
				this.input.keyboard.checkDown(this.input.keyboard.addKey("R"), 1000)
			) {
				this.scene.start("BootScene");
			}
		}
	}
}
