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
        super({ key: 'BattleScene' });
        this.pokemon1 = null;
        this.pokemon2 = null;
        this.currentTurn = 1;
        this.battleState = 'playerTurn';
        this.selectedAbility = 0;
        this.abilityButtons = [];
        this.hpBars = [];
        this.battleText = null;
        this.turnText = null;
        this.isPlayerTurn = true;
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
        this.battleState = 'playerTurn';
        this.selectedAbility = 0;
        this.isPlayerTurn = true;
    }

    /**
     * Creates the battle scene UI and initializes all game elements.
     * Sets up the background, Pokemon sprites, HP bars, ability buttons, turn indicators,
     * status bar, and input handlers. Displays an error message if Pokemon data is missing.
     */
    create() {
        if (!this.pokemon1 || !this.pokemon2) {
            console.error('Pokemon data not available');
            this.add.text(480, 360, 'Error: Pokemon data not available', {
                fontSize: '24px',
                fill: '#ff0000'
            }).setOrigin(0.5);
            return;
        }

        this.add.rectangle(0, 0, 960, 720, 0x87CEEB).setOrigin(0, 0);
        
        this.add.rectangle(480, 360, 840, 600, 0x228B22).setOrigin(0.5);
        this.add.rectangle(480, 360, 820, 580, 0x32CD32).setOrigin(0.5);

        this.pokemon1Sprite = this.add.rectangle(240, 240, 80, 80, 0xFF6B35);
        this.pokemon2Sprite = this.add.rectangle(720, 240, 80, 80, 0x4169E1);
        
        this.add.text(240, 144, this.pokemon1.name, { 
            fontSize: '24px', 
            fill: '#fff',
            stroke: '#000',
            strokeThickness: 3
        }).setOrigin(0.5);
        
        this.add.text(720, 144, this.pokemon2.name, { 
            fontSize: '24px', 
            fill: '#fff',
            stroke: '#000',
            strokeThickness: 3
        }).setOrigin(0.5);

        this.createHPBars();
        
        this.createAbilityUI();
        
        this.turnText = this.add.text(480, 540, `Turn: ${this.pokemon1.name}`, {
            fontSize: '16px',
            fill: '#fff',
            stroke: '#000',
            strokeThickness: 2
        }).setOrigin(0.5);
        
        this.statusBar = this.add.rectangle(480, 696, 840, 48, 0x333333);
        this.battleText = this.add.text(480, 696, 'Your turn! Click an ability or use arrow keys + SPACE!', {
            fontSize: '16px',
            fill: '#fff',
            stroke: '#000',
            strokeThickness: 1
        }).setOrigin(0.5);

        this.setupInputHandlers();
        
        this.updateUI();
    }

    /**
     * Creates HP bars for both Pokemon.
     * Sets up background and foreground rectangles for each Pokemon's HP display,
     * storing references in the hpBars array for later updates.
     */
    createHPBars() {
        const hpBar1Bg = this.add.rectangle(240, 180, 120, 20, 0x666666);
        const hpBar1 = this.add.rectangle(240, 180, 120, 20, 0x00FF00);
        this.hpBars.push({ bg: hpBar1Bg, bar: hpBar1, pokemon: this.pokemon1 });
        
        const hpBar2Bg = this.add.rectangle(720, 180, 120, 20, 0x666666);
        const hpBar2 = this.add.rectangle(720, 180, 120, 20, 0x00FF00);
        this.hpBars.push({ bg: hpBar2Bg, bar: hpBar2, pokemon: this.pokemon2 });
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
            
            const button = this.add.rectangle(x, y, buttonWidth, buttonHeight, 0x444444);
            const text = this.add.text(x, y, ability.name, {
                fontSize: '12px',
                fill: '#fff'
            }).setOrigin(0.5);
            
            button.setInteractive();
            button.on('pointerdown', () => {
                if (this.battleState === 'playerTurn') {
                    this.selectedAbility = index;
                    this.executePlayerAttack();
                }
            });
            button.on('pointerover', () => {
                button.setFillStyle(0x666666);
                this.battleText.setText(`${ability.name} - ${ability.description} (Power: ${ability.power}, Accuracy: ${ability.accuracy}%)`);
            });
            button.on('pointerout', () => {
                button.setFillStyle(0x444444);
                if (this.battleState === 'playerTurn') {
                    this.battleText.setText('Your turn! Click an ability or use arrow keys + SPACE!');
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
        this.input.keyboard.on('keydown-UP', () => {
            if (this.battleState === 'playerTurn') {
                this.selectedAbility = Math.max(0, this.selectedAbility - 3);
                this.updateAbilitySelection();
            }
        });
        
        this.input.keyboard.on('keydown-DOWN', () => {
            if (this.battleState === 'playerTurn') {
                const maxAbilities = this.pokemon1.abilities.length;
                this.selectedAbility = Math.min(maxAbilities - 1, this.selectedAbility + 3);
                this.updateAbilitySelection();
            }
        });
        
        this.input.keyboard.on('keydown-LEFT', () => {
            if (this.battleState === 'playerTurn') {
                this.selectedAbility = Math.max(0, this.selectedAbility - 1);
                this.updateAbilitySelection();
            }
        });
        
        this.input.keyboard.on('keydown-RIGHT', () => {
            if (this.battleState === 'playerTurn') {
                const maxAbilities = this.pokemon1.abilities.length;
                this.selectedAbility = Math.min(maxAbilities - 1, this.selectedAbility + 1);
                this.updateAbilitySelection();
            }
        });
        
        this.input.keyboard.on('keydown-SPACE', () => {
            if (this.battleState === 'playerTurn') {
                this.executePlayerAttack();
            }
        });
        
        this.input.keyboard.on('keydown-ENTER', () => {
            if (this.battleState === 'playerTurn') {
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
        if (this.battleState === 'playerTurn') {
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
        this.battleText.setText(`${selectedAbility.name} - ${selectedAbility.description} (Power: ${selectedAbility.power}, Accuracy: ${selectedAbility.accuracy}%)`);
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
        
        this.battleState = 'animating';
        this.battleText.setText(`${attacker.name} used ${ability.name}!`);
        
        this.abilityButtons.forEach(buttonData => {
            buttonData.button.setFillStyle(0x222222);
        });
        
        const accuracy = Math.random() * 100;
        if (accuracy <= ability.accuracy) {
            const damage = Math.floor(ability.power * (Math.random() * 0.3 + 0.85));
            defender.hp = Math.max(0, defender.hp - damage);
            this.battleText.setText(`${attacker.name} used ${ability.name}! It dealt ${damage} damage!`);
            
            // Play hit animation on the defender (pokemon2)
            this.playHitAnimation(this.pokemon2Sprite);
        } else {
            this.battleText.setText(`${attacker.name} used ${ability.name}! But it missed!`);
        }
        
        this.updateHPBars();
        
        if (defender.hp <= 0) {
            this.battleState = 'gameOver';
            this.battleText.setText(`${defender.name} fainted! ${attacker.name} wins!`);
            this.turnText.setText('Press SPACE or R to restart');
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
        this.battleState = 'aiTurn';
        this.turnText.setText(`Turn: ${this.pokemon2.name}`);
        this.battleText.setText(`${this.pokemon2.name} is thinking...`);
        
        const aiAbilityIndex = Math.floor(Math.random() * this.pokemon2.abilities.length);
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
        
        this.battleState = 'animating';
        this.battleText.setText(`${attacker.name} used ${ability.name}!`);
        
        const accuracy = Math.random() * 100;
        if (accuracy <= ability.accuracy) {
            const damage = Math.floor(ability.power * (Math.random() * 0.3 + 0.85));
            defender.hp = Math.max(0, defender.hp - damage);
            this.battleText.setText(`${attacker.name} used ${ability.name}! It dealt ${damage} damage!`);
            
            // Play hit animation on the defender (pokemon1)
            this.playHitAnimation(this.pokemon1Sprite);
        } else {
            this.battleText.setText(`${attacker.name} used ${ability.name}! But it missed!`);
        }
        
        this.updateHPBars();
        
        if (defender.hp <= 0) {
            this.battleState = 'gameOver';
            this.battleText.setText(`${defender.name} fainted! ${attacker.name} wins!`);
            this.turnText.setText('Press SPACE or R to restart');
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
        this.battleState = 'playerTurn';
        this.selectedAbility = 0;
        this.turnText.setText(`Turn: ${this.pokemon1.name}`);
        this.battleText.setText('Your turn! Click an ability or use arrow keys + SPACE!');
        this.updateAbilitySelection();
        
        this.abilityButtons.forEach(buttonData => {
            buttonData.button.setFillStyle(0x444444);
        });
    }

    /**
     * Updates the HP bars to reflect current Pokemon health.
     * Calculates HP percentage and changes bar color based on health level:
     * Green (>50%), Yellow (25-50%), Red (<25%).
     */
    updateHPBars() {
        this.hpBars.forEach(hpBar => {
            const percentage = hpBar.pokemon.hp / hpBar.pokemon.maxHp;
            const width = 120 * percentage;
            hpBar.bar.width = width;
            
            if (percentage > 0.5) {
                hpBar.bar.setFillStyle(0x00FF00);
            } else if (percentage > 0.25) {
                hpBar.bar.setFillStyle(0xFFFF00);
            } else {
                hpBar.bar.setFillStyle(0xFF0000);
            }
        });
    }

    /**
     * Updates the UI elements to reflect current game state.
     * Refreshes ability button text and updates the ability selection display.
     */
    updateUI() {
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
        sprite.setFillStyle(0xFFFFFF);
        
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
            }
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
    update() {
        if (this.battleState === 'gameOver' && this.input.keyboard.checkDown(this.input.keyboard.addKey('SPACE'), 1000)) {
            this.scene.start('BootScene');
        }
        
        if (this.input.keyboard.checkDown(this.input.keyboard.addKey('R'), 1000)) {
            this.scene.start('BootScene');
        }
    }
} 