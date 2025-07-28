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
        this.load.image("chaos", ["assets/intro/chaos.png"]);
        this.load.audio("fire", ["assets/audio/backgrounds/fire.mp3"]);
    }

    /**
     * Creates the intro scene with movie sprite, text elements, and fire effects
     * Sets up the complete intro sequence with timing for transitions
     */
    create() {
        this.createIntroScene();
    }

    /**
     * Creates the intro scene with movie sprite, text elements, and fire effects
     * Sets up the complete intro sequence with timing for transitions
     */
    createIntroScene() {
        this.movieSprite = this.add.image(480, 360, "chaos");
        this.movieSprite.setScale(0.8);

        this.currentFrame = 0;
        this.totalFrames = 100;
        this.frameRate = 24;

        this.startMoviePlayback();
    }

    /**
     * Starts the movie playback sequence
     * Begins playing the intro movie frames at the specified frame rate
     */
    startMoviePlayback() {
        this.sound.play('fire');
        
        this.time.addEvent({
            delay: 1000 / this.frameRate,
            repeat: this.totalFrames - 1,
            callback: () => {
                this.currentFrame++;
                if (this.currentFrame >= this.totalFrames) {
                    this.introComplete();
                }
            }
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
        if (this.fireParticleTimer) {
            this.fireParticleTimer.destroy();
            this.fireParticleTimer = null;
        }

        this.fireSprites.forEach(sprite => {
            sprite.destroy();
        });
        this.fireSprites = [];
    }

    /**
     * Starts creating fire particles over time instead of all at once
     * Creates a more natural fire effect with particles appearing randomly
     */
    startParticleCreation() {
        this.fireParticleTimer = this.time.addEvent({
            delay: 25 + Math.random() * 50,
            repeat: -1,
            callback: () => {
                this.createFireParticle();
            }
        });
    }

    /**
     * Creates a single fire particle at a random position along the base
     */
    createFireParticle() {
        if (this.fireSprites.length >= 120) {
            const oldestSprite = this.fireSprites.shift();
            if (oldestSprite) {
                oldestSprite.destroy();
            }
        }

        const x = 480 + (Math.random() - 0.5) * 200;
        const y = 670;
        const size = 2 + Math.random() * 4;

        const particle = this.add.circle(x, y, size, 0xff4400);
        particle.setDepth(10);

        this.fireSprites.push(particle);
        this.animateFireSprite(particle);
    }

    /**
     * Update method called every frame
     * Currently empty but available for future frame-specific logic
     */
    update() {
    }

    introComplete() {
        if (window.transitionManager) {
            window.transitionManager.startTransition(this, 'IntroScene', 'BootScene');
        } else {
            this.scene.start("BootScene");
        }
    }
} 