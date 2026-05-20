/**
 * UIManager - Handles all UI updates and screens
 */
class UIManager {
    constructor() {
        // Screens
        this.loadingScreen = document.getElementById('loading-screen');
        this.startScreen = document.getElementById('start-screen');
        this.gameHUD = document.getElementById('game-hud');
        this.gameOverScreen = document.getElementById('gameover-screen');

        // HUD elements
        this.scoreValue = document.getElementById('score-value');
        this.speedValue = document.getElementById('speed-value');
        this.highScoreValue = document.getElementById('highscore-value');
        this.shieldIndicator = document.getElementById('shield-indicator');
        this.boostIndicator = document.getElementById('boost-indicator');

        // Power-up UI elements
        this.powerupMessage = document.getElementById('powerup-message');
        this.powerupText = document.getElementById('powerup-text');
        this.powerupTimer = document.getElementById('powerup-timer');
        this.timerBar = document.getElementById('timer-bar');
        this.timerSeconds = document.getElementById('timer-seconds');
        this.crashMessage = document.getElementById('crash-message');

        // Game over elements
        this.finalScoreValue = document.getElementById('final-score-value');
        this.finalHighScoreValue = document.getElementById('final-highscore-value');
        this.newRecordIndicator = document.getElementById('new-record');

        // Buttons
        this.startBtn = document.getElementById('start-btn');
        this.restartBtn = document.getElementById('restart-btn');
        this.menuBtn = document.getElementById('menu-btn');
        this.soundToggle = document.getElementById('sound-toggle');
    }

    /**
     * Show screen
     */
    showScreen(screenName) {
        this.hideAllScreens();

        switch (screenName) {
            case 'loading':
                this.loadingScreen.classList.remove('hidden');
                break;
            case 'start':
                this.startScreen.classList.remove('hidden');
                break;
            case 'hud':
                this.gameHUD.classList.remove('hidden');
                break;
            case 'gameover':
                this.gameOverScreen.classList.remove('hidden');
                break;
        }
    }

    /**
     * Hide all screens
     */
    hideAllScreens() {
        this.loadingScreen.classList.add('hidden');
        this.startScreen.classList.add('hidden');
        this.gameHUD.classList.add('hidden');
        this.gameOverScreen.classList.add('hidden');
    }

    /**
     * Update HUD values
     */
    updateHUD(score, speed, highScore) {
        this.scoreValue.textContent = Math.floor(score);
        this.speedValue.textContent = Math.floor(speed * 100);
        this.highScoreValue.textContent = Math.floor(highScore);
    }

    /**
     * Show/hide shield indicator
     */
    setShieldIndicator(active) {
        if (!this.shieldIndicator) return; // Element doesn't exist

        if (active) {
            this.shieldIndicator.classList.remove('hidden');
        } else {
            this.shieldIndicator.classList.add('hidden');
        }
    }

    /**
     * Show/hide boost indicator
     */
    setBoostIndicator(active) {
        if (!this.boostIndicator) return; // Element doesn't exist

        if (active) {
            this.boostIndicator.classList.remove('hidden');
        } else {
            this.boostIndicator.classList.add('hidden');
        }
    }

    /**
     * Show game over screen with scores
     */
    showGameOver(finalScore, highScore, isNewRecord) {
        this.finalScoreValue.textContent = Math.floor(finalScore);
        this.finalHighScoreValue.textContent = Math.floor(highScore);

        if (isNewRecord) {
            this.newRecordIndicator.classList.remove('hidden');
        } else {
            this.newRecordIndicator.classList.add('hidden');
        }

        this.showScreen('gameover');
    }

    /**
     * Update sound toggle button
     */
    updateSoundToggle(enabled) {
        this.soundToggle.textContent = enabled ? '🔊 SOUND ON' : '🔇 SOUND OFF';
    }

    /**
     * Add button listeners
     */
    addButtonListeners(callbacks) {
        this.startBtn.addEventListener('click', callbacks.onStart);
        this.restartBtn.addEventListener('click', callbacks.onRestart);
        this.menuBtn.addEventListener('click', callbacks.onMenu);
        this.soundToggle.addEventListener('click', callbacks.onSoundToggle);
    }

    /**
     * Show power-up activation message
     */
    showPowerUpActivation(type) {
        const messages = {
            shield: '🛡️ Shield Activated!',
            boost: '⚡ Speed Boost Activated!'
        };

        this.powerupText.textContent = messages[type] || 'Power-up Activated!';
        this.powerupMessage.classList.remove('hidden');

        // Hide after 2 seconds
        setTimeout(() => {
            this.powerupMessage.classList.add('hidden');
        }, 2000);
    }

    /**
     * Show power-up timer
     */
    showPowerUpTimer() {
        this.powerupTimer.classList.remove('hidden');
    }

    /**
     * Update power-up timer (remaining seconds and progress bar)
     */
    updatePowerUpTimer(remainingSeconds, totalSeconds) {
        this.timerSeconds.textContent = Math.ceil(remainingSeconds / 1000) + 's';
        const percentage = (remainingSeconds / totalSeconds) * 100;
        this.timerBar.style.width = Math.max(0, percentage) + '%';

        // Change color based on remaining time
        if (percentage > 60) {
            this.timerBar.style.backgroundColor = '#00ff00'; // Green
            this.timerBar.style.boxShadow = '0 0 15px rgba(0, 255, 0, 0.8)';
        } else if (percentage > 30) {
            this.timerBar.style.backgroundColor = '#ffaa00'; // Yellow/Orange
            this.timerBar.style.boxShadow = '0 0 15px rgba(255, 170, 0, 0.8)';
        } else {
            this.timerBar.style.backgroundColor = '#ff0000'; // Red
            this.timerBar.style.boxShadow = '0 0 15px rgba(255, 0, 0, 0.8)';
        }
    }

    /**
     * Hide power-up timer
     */
    hidePowerUpTimer() {
        this.powerupTimer.classList.add('hidden');
    }

    /**
     * Show crash message (OOPS!!!)
     */
    showCrashMessage(message = 'CRASHED!') {
        // Update the text content
        const textElement = this.crashMessage.querySelector('.crash-text');
        if (textElement) {
            textElement.textContent = message;
        }

        this.crashMessage.classList.remove('hidden');

        // Hide after 2 seconds
        setTimeout(() => {
            this.crashMessage.classList.add('hidden');
        }, 2000);
    }
}
