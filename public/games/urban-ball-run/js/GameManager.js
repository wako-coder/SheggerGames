/**
 * GameManager - Core game logic and state management
 */
class GameManager {
    constructor() {
        this.score = 0;
        this.highScore = this.loadHighScore();
        this.difficulty = 1;
        this.gameState = 'menu'; // menu, playing, gameover
        this.lastDifficultyIncrease = 0;
        this.difficultyInterval = 10000; // Increase difficulty every 10 seconds (gradual)
        this.startTime = 0;
        this.gameTime = 0;
    }

    /**
     * Start game
     */
    start() {
        this.score = 0;
        this.difficulty = 1;
        this.gameState = 'playing';
        this.startTime = Date.now();
        this.lastDifficultyIncrease = 0;
    }

    /**
     * Update game state
     * URBAN BALL RUN - Added fall detection
     */
    update(player, obstacleManager) {
        if (this.gameState !== 'playing') return;

        // Update score (distance traveled)
        this.score = Math.floor(player.position.z / 5);

        // Update game time
        this.gameTime = Date.now() - this.startTime;

        // Update speed over time (this method needs to be defined or its logic integrated)
        // For now, integrating the original speed/difficulty logic here
        if (this.gameTime - this.lastDifficultyIncrease > this.difficultyInterval) {
            this.difficulty += 0.2; // Gradual increase
            this.lastDifficultyIncrease = this.gameTime;

            // Increase player speed gradually from 0.1
            player.baseSpeed = 0.1 + (this.difficulty - 1) * 0.15; // Gradual speed increase
            player.maxSpeed = 2.0 + (this.difficulty - 1) * 0.2; // Gradual max speed increase
            if (!player.speedBoost) {
                player.speed = player.baseSpeed;
            }

            // Increase obstacle difficulty
            obstacleManager.increaseDifficulty(this.difficulty);

            console.log(`📈 Difficulty ${this.difficulty.toFixed(1)} | Speed: ${player.baseSpeed.toFixed(2)}`);
        }

        // ADDITIONAL: Scale difficulty with score
        const scoreDifficulty = 1 + (this.score / 500); // Every 500 points
        obstacleManager.spawnDistance = Math.max(30, 50 - (scoreDifficulty * 5)); // Gradual spawn distance
    }

    /**
     * End game
     */
    gameOver() {
        this.gameState = 'gameover';

        // Check and save high score
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.saveHighScore();
            return true; // New record
        }

        return false;
    }

    /**
     * Load high score from localStorage
     */
    loadHighScore() {
        const saved = localStorage.getItem('urbanball_highscore');
        return saved ? parseFloat(saved) : 0;
    }

    /**
     * Save high score to localStorage
     */
    saveHighScore() {
        localStorage.setItem('urbanball_highscore', this.highScore.toString());
    }

    /**
     * Reset game
     */
    reset() {
        this.score = 0;
        this.difficulty = 1;
        this.gameTime = 0;
        this.lastDifficultyIncrease = 0;
    }

    /**
     * Get current speed display value
     */
    getSpeedValue(player) {
        return player.speed;
    }
}
