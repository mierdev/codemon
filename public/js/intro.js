/**
 * Intro scene that plays an animated sequence before the main game
 * Displays a movie sequence with fire effects and text animations
 */
class IntroScene extends Phaser.Scene {
    /**
     * Initializes the IntroScene with animation properties
     */
    constructor() {
        super({ key: 'IntroScene' });
        this.currentFrame = 1;
        this.totalFrames = 100; // Back to original 100 frames
        this.frameRate = 24;
        this.movieSprite = null;
        this.titleText = null;
        this.chaosText = null;
        this.fireSprites = [];
        this.textFadeInComplete = false;
        this.imagesLoaded = 0;
    }

    /**
     * Preloads all intro movie frames and sets up loading callbacks
     */
    preload() {
        const loadingText = this.add.text(400, 300, 'Loading...', {
            fontSize: '32px',
            color: '#ffffff'
        }).setOrigin(0.5);

        for (let i = 1; i <= this.totalFrames; i++) {
            const frameNumber = i.toString().padStart(4, '0');
            this.load.image(`frame_${frameNumber}`, `assets/intro_images/output_${frameNumber}.png`);
        }
        
        this.load.on('complete', () => {
            console.log('All images loaded successfully!');
            loadingText.destroy();
        });
        
        this.load.on('loaderror', (file) => {
            console.error('Failed to load:', file.src);
        });
    }

    /**
     * Creates the intro scene with movie sprite, text elements, and fire effects
     * Sets up the complete intro sequence with timing for transitions
     */
    create() {
        console.log('Creating intro scene...');
        
        // Reset transition state to ensure clean transitions
        if (window.transitionManager) {
            window.transitionManager.resetTransitionState();
        }
        
        this.cameras.main.setBackgroundColor('#000000');
        
        this.movieSprite = this.add.sprite(480, 360, 'frame_0001');
        this.movieSprite.setScale(0.8);
        
        this.titleText = this.add.text(480, 80, 'LITTLE SHOP OF', {
            fontSize: '48px',
            fontFamily: 'Arial',
            color: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4,
            shadow: {
                offsetX: 2,
                offsetY: 2,
                color: '#000000',
                blur: 4,
                fill: true
            }
        }).setOrigin(0.5).setAlpha(0);
        
        this.chaosText = this.add.text(480, 140, 'CHAOS', {
            fontSize: '72px',
            fontFamily: 'Arial',
            color: '#ff4400',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4,
            shadow: {
                offsetX: 2,
                offsetY: 2,
                color: '#000000',
                blur: 4,
                fill: true
            }
        }).setOrigin(0.5).setAlpha(0);
        
        this.startMoviePlayback();
        
        this.time.delayedCall(2000, () => {
            this.fadeInText();
        });
        
        // Create fire effect after text fades in
        this.time.delayedCall(3000, () => {
            this.createFireEffect();
        });
        
        this.time.delayedCall(8000, () => {
            console.log('Intro complete, transitioning to BootScene...');
            console.log('Transition manager available:', !!window.transitionManager);
            console.log('Current scene:', this.scene.key);
            
            // Stop fire effect before transitioning
            this.stopFireEffect();
            
            // Use transition manager if available, otherwise fall back to direct scene change
            if (window.transitionManager) {
                console.log('Using transition manager for transition');
                window.transitionManager.startTransition(this, 'IntroScene', 'BootScene');
            } else {
                console.log('Using direct scene change');
                this.scene.start('BootScene');
            }
        });
        
        console.log('Intro scene created successfully');
    }

    /**
     * Creates animated fire sprites around the screen edges
     * Generates multiple fire particles with random positioning and animation
     */
    createFireEffect() {
        console.log('Creating fire effect...');
        
        this.fireSprites = []; // Reset array
        this.fireActive = true; // Flag to control particle creation
        
        // Position fire particles at the base of the CHAOS text
        const chaosTextX = 480; // Center X of CHAOS text
        const chaosTextY = 140; // Y position of CHAOS text
        const fireBaseY = chaosTextY + 25; // Base of the fire (below the text)
        const fireWidth = 200; // Increased from 100 to 200 (100% wider)
        
        // Store fire parameters for particle creation
        this.fireParams = {
            chaosTextX: chaosTextX,
            fireBaseY: fireBaseY,
            fireWidth: fireWidth,
            colors: [0xff4400, 0xff6600, 0xff8800, 0xffaa00, 0xffcc00]
        };
        
        // Start creating particles over time instead of all at once
        this.startParticleCreation();
        
        console.log(`Starting fire effect with ${fireWidth}px width`);
    }

    /**
     * Starts the movie playback sequence
     * Begins playing the intro movie frames at the specified frame rate
     */
    startMoviePlayback() {
        console.log('Starting movie playback...');
        console.log('start playing fire');
        
        // Note: Fire sound effect removed as it's not available in the audio assets
        // The visual fire effects will still play without audio
        
        this.time.addEvent({
            delay: 1000 / this.frameRate,
            callback: this.updateFrame,
            callbackScope: this,
            loop: true
        });
    }

    /**
     * Updates the current movie frame to the next frame in sequence
     * Handles frame progression and loops back to the beginning when complete
     */
    updateFrame() {
        this.currentFrame++;
        
        if (this.currentFrame > this.totalFrames) {
            this.currentFrame = 1;
        }
        
        const frameNumber = this.currentFrame.toString().padStart(4, '0');
        this.movieSprite.setTexture(`frame_${frameNumber}`);
    }

    /**
     * Fades in the title and chaos text with staggered timing
     * Creates a dramatic reveal effect for the game title
     */
    fadeInText() {
        this.tweens.add({
            targets: this.titleText,
            alpha: 1,
            duration: 1000,
            ease: 'Power2'
        });
        
        this.time.delayedCall(500, () => {
            this.tweens.add({
                targets: this.chaosText,
                alpha: 1,
                duration: 1000,
                ease: 'Power2'
            });
        });
        
        this.textFadeInComplete = true;
    }

    /**
     * Animates a single fire sprite with realistic fire motion
     * @param {Phaser.GameObjects.Graphics} sprite - The fire sprite to animate
     */
    animateFireSprite(sprite) {
        const startX = sprite.startX;
        const startY = sprite.startY;
        const maxHeight = sprite.maxHeight;
        
        // Create consistent fire motion - particles rise steadily
        this.tweens.add({
            targets: sprite,
            y: startY - maxHeight, // Move upward
            x: startX + (Math.random() - 0.5) * 15, // Reduced horizontal drift for consistency
            alpha: 0, // Fade out as it rises
            scaleX: 0.5, // Less shrinking for consistency
            scaleY: 0.5,
            duration: 3000 + Math.random() * 500, // More consistent timing (3-3.5 seconds)
            ease: 'Power1',
            onComplete: () => {
                // Remove this sprite from the array and destroy it
                const index = this.fireSprites.indexOf(sprite);
                if (index > -1) {
                    this.fireSprites.splice(index, 1);
                }
                sprite.destroy();
            }
        });
        
        // Add gentle flickering effect (less dramatic)
        this.tweens.add({
            targets: sprite,
            alpha: 0.5 + Math.random() * 0.3, // Less dramatic alpha change
            duration: 200 + Math.random() * 300, // Slower flickering for consistency
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });
        
        // Add subtle color cycling for fire effect
        this.tweens.add({
            targets: sprite,
            duration: 800 + Math.random() * 400, // Slower color changes
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1,
            onUpdate: () => {
                const colors = [0xff4400, 0xff6600, 0xff8800, 0xffaa00, 0xffcc00];
                const color = colors[Math.floor(Math.random() * colors.length)];
                sprite.setFillStyle(color);
            }
        });
    }

    /**
     * Stops and deletes all fire particles
     * Called when transitioning to clean up the fire effect
     */
    stopFireEffect() {
        console.log('Stopping fire effect...');
        
        // Stop creating new particles
        this.fireActive = false;
        
        // Stop all particle creation events
        this.time.removeAllEvents();
        
        this.fireSprites.forEach(sprite => {
            // Stop all tweens on this sprite
            this.tweens.killTweensOf(sprite);
            // Destroy the sprite
            sprite.destroy();
        });
        this.fireSprites = [];
        console.log('Fire effect stopped and cleaned up');
    }

    /**
     * Starts creating fire particles over time instead of all at once
     * Creates a more natural fire effect with particles appearing randomly
     */
    startParticleCreation() {
        // Create a new particle every 25-75ms (4x faster than before)
        this.time.addEvent({
            delay: 25 + Math.random() * 50,
            callback: this.createFireParticle,
            callbackScope: this,
            loop: true
        });
    }

    /**
     * Creates a single fire particle at a random position along the base
     */
    createFireParticle() {
        if (!this.fireActive) return; // Stop creating particles if fire is stopped
        
        const params = this.fireParams;
        
        // Random position along the base of the fire
        const x = params.chaosTextX + (Math.random() - 0.5) * params.fireWidth;
        const y = params.fireBaseY + Math.random() * 10;
        
        const color = params.colors[Math.floor(Math.random() * params.colors.length)];
        const size = Math.random() * 4 + 2;
        
        const fireSprite = this.add.circle(x, y, size, color);
        fireSprite.setAlpha(0.8);
        fireSprite.setDepth(10);
        
        // Store initial position for animation
        fireSprite.startX = x;
        fireSprite.startY = y;
        fireSprite.maxHeight = 40 + Math.random() * 20;
        
        this.fireSprites.push(fireSprite);
        
        // Start animating this particle
        this.animateFireSprite(fireSprite);
        
        // Limit total particles to prevent performance issues
        if (this.fireSprites.length > 120) {
            const oldestSprite = this.fireSprites.shift();
            this.tweens.killTweensOf(oldestSprite);
            oldestSprite.destroy();
        }
    }

    /**
     * Update method called every frame
     * Currently empty but available for future frame-specific logic
     */
    update() {
    }
} 