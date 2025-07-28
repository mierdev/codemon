/**
 * Main game configuration and initialization.
 * Sets up the Phaser game instance with scene management and physics configuration.
 */
/**
 * Initializes the game with database data loading
 * Ensures all scenes are loaded and game data is fetched before creating the Phaser game instance
 */
async function initializeGame() {
	// Check if all required scenes are available
	if (typeof TitlePage === 'undefined' || typeof IntroScene === 'undefined' || typeof BootScene === 'undefined' || 
		typeof BattleScene === 'undefined' || typeof EndScene === 'undefined') {
		setTimeout(initializeGame, 100);
		return;
	}

	// Initialize game manager and load data from database
	window.gameManager = new GameManager();
	
	try {
		await new Promise(resolve => setTimeout(resolve, 100));
		await window.gameManager.loadGameData();
	} catch (error) {
		console.error('Failed to load game data from database, using fallback data:', error);
	}

	// Create the Phaser game instance
	const config = {
		type: Phaser.AUTO,
		width: 960,
		height: 720,
		parent: 'game-container',
		backgroundColor: "#000000",
		roundPixels: true,
		pixelArt: true,
		antialias: false,
		scene: [TitlePage, IntroScene, BootScene, BattleScene, EndScene],
		physics: {
			default: 'arcade',
			arcade: {
				gravity: { y: 0 },
				debug: false
			}
		}
	};

	window.game = new Phaser.Game(config);
	
	// Initialize transition manager
	window.transitionManager = new window.TransitionManager();
	
}

// Initialize game when DOM is ready
if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", initializeGame);
} else {
	initializeGame();
}

/**
 * Global transition manager instance for scene transitions
 */
window.transitionManager = null;

/**
 * Starts a new battle with the selected languages
 * @param {string} playerLanguage - The player's selected language
 * @param {string} opponentLanguage - The opponent's language
 */
function startNewBattle(playerLanguage, opponentLanguage) {
	if (window.game && window.gameManager) {
		window.transitionManager.startTransition(window.game.scene.getScene('BootScene'), 'BootScene', 'BattleScene', {
			playerLanguage: playerLanguage,
			opponentLanguage: opponentLanguage
		});
	} else {
		console.error('Game or GameManager not initialized');
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
