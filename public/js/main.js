/**
 * Main game configuration and initialization.
 * Sets up the Phaser game instance with scene management and physics configuration.
 */
const config = {
	type: Phaser.AUTO,
	width: 960,
	height: 720,
	parent: "game-container",
	backgroundColor: "#000000",
	roundPixels: true,
	pixelArt: true,
	antialias: false,
	scene: [BootScene, BattleScene, EndScene],
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
const game = new Phaser.Game(config);

/**
 * Starts a new battle between two Pokemon.
 * Uses the global gameManager to create battle data and transitions to the BattleScene.
 * @param {string} pokemon1Id - The ID of the first Pokemon (player's Pokemon)
 * @param {string} pokemon2Id - The ID of the second Pokemon (AI's Pokemon)
 */
function startNewBattle(pokemon1Id, pokemon2Id) {
	if (window.gameManager) {
		const battleData = window.gameManager.startBattle(pokemon1Id, pokemon2Id);
		if (battleData) {
			game.scene.start("BattleScene", battleData);
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
