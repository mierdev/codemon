/**
 * Main game configuration and initialization.
 * Sets up the Phaser game instance with scene management and physics configuration.
 */
function initializeGame() {
	// Check if all required classes are available
	if (typeof IntroScene === "undefined") {
		console.error("IntroScene not found, retrying...");
		setTimeout(initializeGame, 100);
		return;
	}

	if (typeof BootScene === "undefined") {
		console.error("BootScene not found, retrying...");
		setTimeout(initializeGame, 100);
		return;
	}

	if (typeof BattleScene === "undefined") {
		console.error("BattleScene not found, retrying...");
		setTimeout(initializeGame, 100);
		return;
	}

	if (typeof EndScene === "undefined") {
		console.error("EndScene not found, retrying...");
		setTimeout(initializeGame, 100);
		return;
	}

	console.log("All scenes loaded, initializing game...");

	const config = {
		type: Phaser.AUTO,
		width: 960,
		height: 720,
		parent: "game-container",
		backgroundColor: "#000000",
		roundPixels: true,
		pixelArt: true,
		antialias: false,
		scene: [TitlePage, IntroScene, BootScene, BattleScene, EndScene],
		physics: {
			default: "arcade",
			arcade: {
				gravity: { y: 0 },
				debug: false,
			},
		},
	};

	/**
	 * The main Phaser game instance.
	 * Initializes the game with the specified configuration and manages scene transitions.
	 */
	window.game = new Phaser.Game(config);
}

// Initialize game when DOM is ready
if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", initializeGame);
} else {
	initializeGame();
}

/**
 * Starts a new battle between two Pokemon.
 * Uses the global gameManager to create battle data and transitions to the BattleScene.
 * @param {string} pokemon1Id - The ID of the first Pokemon (player's Pokemon)
 * @param {string} pokemon2Id - The ID of the second Pokemon (AI's Pokemon)
 */
function startNewBattle(pokemon1Id, pokemon2Id) {
	if (window.gameManager && window.game) {
		const battleData = window.gameManager.startBattle(pokemon1Id, pokemon2Id);
		if (battleData) {
			window.game.scene.start("BattleScene", battleData);
		}
	}
}

/**
 * Updates Pokemon data from external API sources.
 * Allows dynamic updates to Pokemon data without restarting the game.
 * @param {string} pokemonId - The ID of the Pokemon to update
 * @param {Object} apiData - The new Pokemon data from the API
 */
function updatePokemonFromAPI(pokemonId, apiData) {
	if (window.gameManager) {
		window.gameManager.updatePokemonFromAPI(pokemonId, apiData);
	}
}
