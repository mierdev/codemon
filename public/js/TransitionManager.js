/**
 * Manages scene transitions using a grid-based square animation system
 * Provides smooth transitions between scenes with growing/shrinking square effects
 */
export class TransitionManager {
    /**
     * Initializes the TransitionManager with transition properties
     */
    constructor() {
        this.squareSize = 80;
        this.transitionDuration = 1200;
        this.squares = [];
        this.isTransitioning = false;
    }

    /**
     * Resets the transition state to allow new transitions
     * This should be called when a new scene starts to ensure clean state
     */
    resetTransitionState() {
        console.log('Resetting transition state...');
        this.isTransitioning = false;
        this.squares.forEach(square => square.destroy());
        this.squares = [];
    }

    /**
     * Creates a transition effect that covers the screen with growing squares
     * @param {Phaser.Scene} scene - The current scene
     * @param {string} fromScene - The name of the scene to transition from
     * @param {string} toScene - The name of the scene to transition to
     * @param {Object} data - Optional data to pass to the target scene
     */
    startTransition(scene, fromScene, toScene, data = {}) {
        if (this.isTransitioning) {
            console.log('Transition already in progress, ignoring new transition request');
            return;
        }
        
        this.isTransitioning = true;
        console.log(`Starting transition from ${fromScene} to ${toScene}`);
        console.log('Scene object:', scene);
        console.log('Scene key:', scene.scene.key);
        
        this.createTransitionSquares(scene);
        this.growSquares(scene, fromScene, toScene, data);
    }

    /**
     * Creates a grid of small squares that will grow to cover the screen
     * @param {Phaser.Scene} scene - The current scene
     */
    createTransitionSquares(scene) {
        this.squares = [];
        
        const gameWidth = scene.cameras.main.width;
        const gameHeight = scene.cameras.main.height;
        const cols = Math.ceil(gameWidth / this.squareSize) + 1;
        const rows = Math.ceil(gameHeight / this.squareSize) + 1;
        
        console.log(`Creating ${cols} x ${rows} transition squares`);
        
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const x = col * this.squareSize;
                const y = row * this.squareSize;
                
                const distance = Math.sqrt(x * x + y * y);
                const delay = distance * 0.5;
                
                const square = scene.add.rectangle(x, y, 5, 5, 0x000000);
                square.setOrigin(0, 0);
                square.delay = delay;
                square.maxSize = this.squareSize;
                square.currentSize = 5;
                square.isCompleted = false;
                
                this.squares.push(square);
            }
        }
    }

    /**
     * Animates squares growing to cover the screen, then changes scenes
     * @param {Phaser.Scene} scene - The current scene
     * @param {string} fromScene - The name of the scene to transition from
     * @param {string} toScene - The name of the scene to transition to
     * @param {Object} data - Optional data to pass to the target scene
     */
    growSquares(scene, fromScene, toScene, data) {
        let completedSquares = 0;
        const totalSquares = this.squares.length;
        
        console.log(`Starting grow animation with ${totalSquares} squares`);
        
        this.squares.forEach((square, index) => {
            const duration = this.transitionDuration + square.delay;
            
            scene.tweens.add({
                targets: square,
                currentSize: square.maxSize,
                duration: duration,
                ease: 'Power2',
                onUpdate: () => {
                    square.width = square.currentSize;
                    square.height = square.currentSize;
                    square.setFillStyle(0x000000);
                },
                onComplete: () => {
                    square.isCompleted = true;
                    completedSquares++;
                    
                    console.log(`Square ${index} completed. ${completedSquares}/${totalSquares}`);
                    
                    if (completedSquares >= totalSquares) {
                        console.log('All squares grown, changing scene...');
                        this.changeScene(scene, fromScene, toScene, data);
                    }
                }
            });
        });
    }

    /**
     * Changes to the target scene and starts the shrinking animation
     * @param {Phaser.Scene} scene - The current scene
     * @param {string} fromScene - The name of the scene to transition from
     * @param {string} toScene - The name of the scene to transition to
     * @param {Object} data - Optional data to pass to the target scene
     */
    changeScene(scene, fromScene, toScene, data) {
        scene.scene.stop(fromScene);
        scene.scene.start(toScene, data);
        
        scene.time.delayedCall(200, () => {
            this.shrinkSquares(scene);
        });
    }

    /**
     * Animates squares shrinking to reveal the new scene
     * @param {Phaser.Scene} scene - The current scene
     */
    shrinkSquares(scene) {
        let completedSquares = 0;
        const totalSquares = this.squares.length;
        
        this.squares.forEach((square, index) => {
            const duration = this.transitionDuration + square.delay;
            
            scene.tweens.add({
                targets: square,
                currentSize: 5,
                duration: duration,
                ease: 'Power2',
                onUpdate: () => {
                    square.width = square.currentSize;
                    square.height = square.currentSize;
                    square.setFillStyle(0x00FF00);
                },
                onComplete: () => {
                    square.isCompleted = true;
                    completedSquares++;
                    
                    if (completedSquares >= totalSquares) {
                        console.log('Transition complete!');
                        this.completeTransition(scene);
                    }
                }
            });
        });
    }

    /**
     * Completes the transition by cleaning up squares and resetting state
     * @param {Phaser.Scene} scene - The current scene
     */
    completeTransition(scene) {
        console.log('Completing transition, cleaning up squares...');
        this.squares.forEach(square => square.destroy());
        this.squares = [];
        this.isTransitioning = false;
        console.log('Transition completed, isTransitioning reset to false');
    }

    /**
     * Creates an initial shrink effect to reveal a scene
     * @param {Phaser.Scene} scene - The current scene
     * @param {Function} onComplete - Callback function when reveal is complete
     */
    revealScene(scene, onComplete) {
        this.createFullSquares(scene);
        this.shrinkSquaresToReveal(scene, onComplete);
    }

    /**
     * Creates full-size squares to cover the screen initially
     * @param {Phaser.Scene} scene - The current scene
     */
    createFullSquares(scene) {
        this.squares = [];
        
        const gameWidth = scene.cameras.main.width;
        const gameHeight = scene.cameras.main.height;
        const cols = Math.ceil(gameWidth / this.squareSize) + 1;
        const rows = Math.ceil(gameHeight / this.squareSize) + 1;
        
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const x = col * this.squareSize;
                const y = row * this.squareSize;
                
                const square = scene.add.rectangle(x, y, this.squareSize, this.squareSize, 0x000000);
                square.setOrigin(0, 0);
                square.currentSize = this.squareSize;
                
                this.squares.push(square);
            }
        }
    }

    /**
     * Animates squares shrinking to reveal the scene content
     * @param {Phaser.Scene} scene - The current scene
     * @param {Function} onComplete - Callback function when reveal is complete
     */
    shrinkSquaresToReveal(scene, onComplete) {
        let completedSquares = 0;
        const totalSquares = this.squares.length;
        
        const startX = 0;
        const startY = 0;
        
        this.squares.forEach((square, index) => {
            const distance = Math.sqrt(
                Math.pow(square.x - startX, 2) + Math.pow(square.y - startY, 2)
            );
            const startDelay = distance * 0.4;
            const duration = 600;
            
            scene.time.delayedCall(startDelay, () => {
                scene.tweens.add({
                    targets: square,
                    currentSize: 5,
                    duration: duration,
                    ease: 'Power2',
                    onUpdate: () => {
                        square.width = square.currentSize;
                        square.height = square.currentSize;
                        square.setFillStyle(0x000000);
                    },
                    onComplete: () => {
                        completedSquares++;
                        if (completedSquares >= totalSquares) {
                            this.squares.forEach(s => s.destroy());
                            this.squares = [];
                            if (onComplete) onComplete();
                        }
                    }
                });
            });
        });
    }
} 