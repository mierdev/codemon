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
        super({ key: 'BootScene' });
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
        const availableLanguages = ['python', 'go', 'rust', 'ocaml', 'cpp', 'javascript'];
        
        // Randomly select 2 different languages
        const shuffled = availableLanguages.sort(() => 0.5 - Math.random());
        const language1 = shuffled[0];
        const language2 = shuffled[1];
        
        console.log(`Starting battle: ${language1} vs ${language2}`);
        
        const battleData = window.gameManager.startBattle(language1, language2);
        
        if (battleData) {
            this.scene.start('BattleScene', battleData);
        } else {
            console.error('Failed to start battle');
        }
    }
} 