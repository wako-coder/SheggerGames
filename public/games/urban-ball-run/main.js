/**
 * Urban Ball Run
 * Main game orchestrator
 */

// Global game variables
let scene, camera, renderer;
let player, tunnel, obstacleManager, powerUpManager; // tunnel variable name kept for compatibility
let collisionDetector, cameraController, effectsManager;
let gameManager, uiManager, audioManager, inputController;
let textureManager;
let lastTime = 0;
let isRunning = false;

/**
 * Initialize Three.js scene
 * URBAN BALL RUN - Realistic lighting setup
 */
function initScene() {
    console.log('initScene() called');
    // Scene setup
    scene = new THREE.Scene();

    // Clear sky background (realistic horizon)
    scene.background = new THREE.Color(0x222222); // Darker city sky fallback

    // Atmospheric urban fog - blends buildings and floor into the sky
    scene.fog = new THREE.Fog(0x333333, 50, 250); // Increased distance to match new path generation

    // Camera setup
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    camera = new THREE.PerspectiveCamera(
        isMobile ? 80 : 75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(0, 2, -8);

    // Renderer setup
    const canvas = document.getElementById('game-canvas');
    renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: !isMobile,
        alpha: false
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = false; // Keep shadows off for performance

    // REALISTIC LIGHTING - Sun + ambient (no neon)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // Neutral daylight
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff5e1, 0.8); // Warm sunlight
    sunLight.position.set(10, 15, -5);
    scene.add(sunLight);

    console.log('✓ Realistic urban lighting initialized');
    console.log('initScene() completed');
}

/**
 * Initialize game systems
 */
async function initGame() {
    console.log('initGame() called');

    // Load textures
    textureManager = new TextureManager();
    console.log('Loading textures...');
    await textureManager.loadAllTextures();
    console.log('All textures loaded!');

    // Apply sky texture to scene background
    const skyTexture = textureManager.get('sky');
    if (skyTexture) {
        scene.background = skyTexture;
        console.log('✓ Sky texture applied to scene background');
    } else {
        console.log('⚠ Sky texture not loaded, keeping blue background');
    }

    // Initialize managers
    audioManager = new AudioManager();
    console.log('Audio manager initialized');

    inputController = new InputController();
    uiManager = new UIManager();
    gameManager = new GameManager();
    console.log('UI and Game managers initialized');

    // Initialize game objects
    player = new Player(scene, textureManager);
    console.log('Player created');

    tunnel = new TunnelGenerator(scene, player, textureManager);
    console.log('Tunnel generator created');

    obstacleManager = new ObstacleManager(scene, player, textureManager, tunnel);
    powerUpManager = new PowerUpManager(scene, player, textureManager);
    console.log('Obstacle and PowerUp managers created');

    // Initialize systems
    collisionDetector = new CollisionDetector(player, obstacleManager, audioManager);
    cameraController = new CameraController(camera, player);
    effectsManager = new EffectsManager(scene, camera, player);
    console.log('Systems initialized');

    // Setup UI callbacks
    uiManager.addButtonListeners({
        onStart: startGame,
        onRestart: restartGame,
        onMenu: returnToMenu,
        onSoundToggle: toggleSound
    });
    console.log('Button listeners added');

    // Load all game sounds
    await audioManager.loadAllSounds();
    console.log('Sounds loaded');

    // Update high score display
    uiManager.updateHUD(0, player.speed, gameManager.highScore);

    // Show start screen
    setTimeout(async () => {
        uiManager.showScreen('start');

        // Resume audio context (browser autoplay policy)
        if (audioManager.context && audioManager.context.state === 'suspended') {
            await audioManager.context.resume();
            console.log('🔊 Audio context resumed');
        }

        // Start menu music
        audioManager.playMenuMusic();
        console.log('🎵 Menu music playing');
    }, 500);

    console.log('initGame() completed');
}

/**
 * Start game
 */
function startGame() {
    gameManager.start();
    gameManager.reset();

    player.reset();
    tunnel.reset();
    obstacleManager.reset();
    powerUpManager.reset();
    effectsManager.reset();
    cameraController.reset();

    // AUDIO: Stop menu music, start engine loop
    audioManager.stopMenuMusic();
    audioManager.playEngineLoop();
    audioManager.playSound('ui_click');

    uiManager.showScreen('hud');
    inputController.showMobileControls();

    isRunning = true;
    lastTime = performance.now();
    animate();
}

/**
 * Restart game
 */
function restartGame() {
    startGame();
}

/**
 * Return to main menu
 */
function returnToMenu() {
    isRunning = false;
    gameManager.gameState = 'menu';

    // AUDIO: Stop engine, resume menu music
    audioManager.stopEngineLoop();
    audioManager.playMenuMusic();
    audioManager.playSound('ui_click');

    inputController.hideMobileControls();
    uiManager.showScreen('start');
}

/**
 * Toggle sound
 */
function toggleSound() {
    const enabled = audioManager.toggle();
    uiManager.updateSoundToggle(enabled);

    // Resume music if re-enabled
    if (enabled) {
        if (gameManager.gameState === 'playing') {
            audioManager.playEngineLoop();
        } else {
            audioManager.playMenuMusic();
        }
    }
}

/**
 * Main game loop
 */
function animate() {
    if (!isRunning) return;

    const currentTime = performance.now();
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    const cappedDelta = Math.min(deltaTime, 100);

    // Get input
    const input = inputController.getInput();

    // JUMP DETECTION - Trigger jump when up/w is pressed OR swipe up
    if (inputController.keys['w'] || inputController.keys['ArrowUp'] || input.y > 0) {
        player.jump();
    }

    // Update game systems
    player.update(input, cappedDelta, tunnel);

    // CHECK FALLING DEATH (Early check - Manual Override)
    // Fix: Directly check position to ensure no logic is skipped
    if (player.isDead || player.position.y < -2) {
        if (!player.isDead) player.isDead = true;

        try {
            audioManager.playSound('crash');
        } catch (e) {
            console.error('Audio crash error:', e);
        }

        uiManager.showCrashMessage('FELL INTO VOID');
        isRunning = false;
        setTimeout(() => endGame(), 2000);
        return;
    }

    tunnel.update();
    obstacleManager.update(cappedDelta);
    powerUpManager.update(cappedDelta);
    effectsManager.update(cappedDelta);
    cameraController.update();
    gameManager.update(player, obstacleManager);

    // Check power-up collection
    const powerupType = powerUpManager.checkCollection(player, audioManager);
    if (powerupType) {
        uiManager.showPowerUpActivation(powerupType);
        uiManager.showPowerUpTimer();

        // Play power-up specific sound
        if (powerupType === 'shield') {
            // audioManager.playSound('shield_activate'); // Sound file missing
        } else {
            audioManager.playSound('boost_activate');
        }
    }

    // Update power-up timer display
    if (player.hasShield || player.speedBoost) {
        let remainingTime = 0;
        if (player.hasShield && player.shieldDuration !== undefined) {
            remainingTime = player.shieldDuration;
        } else if (player.speedBoost && player.boostDuration !== undefined) {
            remainingTime = player.boostDuration;
        }
        uiManager.updatePowerUpTimer(remainingTime, 10000);
    } else {
        uiManager.hidePowerUpTimer();
    }

    // Check collisions
    const collisionResult = collisionDetector.checkCollisions();

    if (collisionResult.collision) {
        const gameOver = player.handleCollision();

        if (gameOver) {
            // Play crash sound IMMEDIATELY
            audioManager.playSound('crash');
            effectsManager.createExplosion(player.position);
            cameraController.shake(1.0);

            cameraController.shake(1.0);

            // Show crash message
            uiManager.showCrashMessage('IMPACT DETECTED!');

            // Wait a bit before showing game over screen
            setTimeout(() => endGame(), 2500);
            isRunning = false;
            return;
        } else {
            // Shield absorbed hit
            audioManager.playSound('crash', 0.5);
            cameraController.shake(0.3);
        }
    }

    if (collisionResult.nearMiss) {
        cameraController.shake(0.1);
    }



    // Update UI
    uiManager.updateHUD(gameManager.score, gameManager.getSpeedValue(player), gameManager.highScore);
    uiManager.setShieldIndicator(player.hasShield);
    uiManager.setBoostIndicator(player.speedBoost);
    effectsManager.setBoostEffect(player.speedBoost);

    // Render scene
    renderer.render(scene, camera);

    // Continue loop
    requestAnimationFrame(animate);
}

/**
 * End game
 */
function endGame() {
    isRunning = false;
    const isNewRecord = gameManager.gameOver();

    // AUDIO: Stop engine, play gameover sound (crash already played immediately)
    audioManager.stopEngineLoop();
    audioManager.playSound('gameover');

    inputController.hideMobileControls();

    setTimeout(() => {
        uiManager.showGameOver(gameManager.score, gameManager.highScore, isNewRecord);

        // Resume menu music after showing game over screen
        setTimeout(() => {
            if (gameManager.gameState !== 'playing') {
                audioManager.playMenuMusic();
            }
        }, 1000);
    }, 1000);
}

/**
 * Handle window resize
 */
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize);

/**
 * Initialize on page load
 */
window.addEventListener('load', async () => {
    console.log('Window loaded, starting initialization...');
    initScene();
    await initGame();
});

// Enable audio on first user interaction (browser autoplay policy)
document.addEventListener('click', async function enableAudio() {
    if (audioManager && audioManager.context && audioManager.context.state === 'suspended') {
        await audioManager.context.resume();
        console.log('🔊 Audio enabled!');

        // Only play menu music if we're on the menu screen, not during gameplay
        if (gameManager && gameManager.gameState === 'menu') {
            audioManager.playMenuMusic();
        }
    }
}, { once: true });
