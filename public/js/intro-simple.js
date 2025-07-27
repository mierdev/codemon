import Phaser from 'phaser';

class IntroScene extends Phaser.Scene {
    constructor() {
        super({ key: 'IntroScene' });
        this.currentFrame = 1;
        this.totalFrames = 100;
        this.frameRate = 12; // Slower for testing
        this.movieSprite = null;
        this.titleText = null;
        this.chaosText = null;
    }

    preload() {
        // Add loading text
        const loadingText = this.add.text(400, 300, 'Loading Movie Frames...', {
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Load first 10 frames for testing
        for (let i = 1; i <= 10; i++) {
            const frameNumber = i.toString().padStart(4, '0');
            this.load.image(`frame_${frameNumber}`, `assets/output_${frameNumber}.png`);
        }
        
        // Track loading progress
        this.load.on('complete', () => {
            console.log('Images loaded successfully!');
            loadingText.setText('Loading Complete!');
            this.time.delayedCall(1000, () => {
                loadingText.destroy();
            });
        });
        
        this.load.on('loaderror', (file) => {
            console.error('Failed to load:', file.src);
            loadingText.setText('Error loading images!');
        });
    }

    create() {
        console.log('Creating intro scene...');
        
        // Set background to black
        this.cameras.main.setBackgroundColor('#000000');
        
        // Create movie sprite with first frame
        this.movieSprite = this.add.sprite(400, 300, 'frame_0001');
        this.movieSprite.setScale(0.6); // Scale down to fit screen
        
        // Create title text (initially invisible)
        this.titleText = this.add.text(400, 450, 'LITTLE SHOP OF', {
            fontSize: '36px',
            fontFamily: 'Arial',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5).setAlpha(0);
        
        // Create CHAOS text (initially invisible)
        this.chaosText = this.add.text(400, 500, 'CHAOS', {
            fontSize: '48px',
            fontFamily: 'Arial',
            color: '#ff4400',
            fontStyle: 'bold',
            stroke: '#ff0000',
            strokeThickness: 3
        }).setOrigin(0.5).setAlpha(0);
        
        // Start movie playback
        this.startMoviePlayback();
        
        // Start text fade-in after a delay
        this.time.delayedCall(3000, () => {
            this.fadeInText();
        });
        
        console.log('Intro scene created successfully');
    }
    
    startMoviePlayback() {
        console.log('Starting movie playback...');
        
        // Create timer for frame updates
        this.movieTimer = this.time.addEvent({
            delay: 1000 / this.frameRate,
            callback: this.updateFrame,
            callbackScope: this,
            loop: true
        });
    }
    
    updateFrame() {
        this.currentFrame++;
        
        if (this.currentFrame > 10) { // Only loop through first 10 frames for testing
            this.currentFrame = 1;
        }
        
        const frameNumber = this.currentFrame.toString().padStart(4, '0');
        const textureKey = `frame_${frameNumber}`;
        
        // Check if texture exists before setting it
        if (this.textures.exists(textureKey)) {
            this.movieSprite.setTexture(textureKey);
            console.log(`Frame updated to: ${textureKey}`);
        } else {
            console.warn(`Texture not found: ${textureKey}`);
        }
    }
    
    fadeInText() {
        console.log('Starting text fade-in...');
        
        // Fade in "LITTLE SHOP OF"
        this.tweens.add({
            targets: this.titleText,
            alpha: 1,
            duration: 2000,
            ease: 'Power2',
            onComplete: () => {
                console.log('Title text faded in');
                // After title fades in, fade in CHAOS
                this.tweens.add({
                    targets: this.chaosText,
                    alpha: 1,
                    duration: 1500,
                    ease: 'Power2',
                    onComplete: () => {
                        console.log('CHAOS text faded in');
                        // Add some pulsing effect to CHAOS
                        this.tweens.add({
                            targets: this.chaosText,
                            scaleX: 1.1,
                            scaleY: 1.1,
                            duration: 1000,
                            yoyo: true,
                            repeat: -1,
                            ease: 'Sine.easeInOut'
                        });
                    }
                });
            }
        });
    }
}

// Game configuration
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    backgroundColor: '#000000',
    scene: IntroScene,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    }
};

// Create the game instance
const game = new Phaser.Game(config); 