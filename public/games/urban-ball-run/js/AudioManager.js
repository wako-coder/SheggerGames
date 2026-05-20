/**
 * AudioManager - Handles all game sounds and music
 */
class AudioManager {
    constructor() {
        this.context = null;
        this.sounds = {};
        this.enabled = true;
        this.musicVolume = 0.3;
        this.sfxVolume = 0.5;

        // Separate sources for menu music and gameplay engine
        this.menuMusicSource = null;
        this.engineLoopSource = null;
        this.menuMusicGain = null;
        this.engineLoopGain = null;

        this.initAudioContext();
    }

    initAudioContext() {
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            this.context = new AudioContext();
        } catch (e) {
            console.warn('Web Audio API not supported');
        }
    }

    /**
     * Load all game sounds
     */
    async loadAllSounds() {
        if (!this.context) return;

        console.log('🔊 Loading all game sounds...');

        const soundFiles = {
            'crash': 'assets/sounds/ball hit.mp3',
            'boost_activate': 'assets/sounds/boost_activate.wav',
            'ui_click': 'assets/sounds/ui_click.mp3',
            'background_music': 'assets/sounds/background_music.mp3',
            'engine_loop': 'assets/sounds/engine_loop.mp3',
            'gameover': 'assets/sounds/game over.mp3'
        };

        const loadPromises = Object.entries(soundFiles).map(([name, url]) =>
            this.loadSound(name, url)
        );

        await Promise.all(loadPromises);
        console.log('✅ All sounds loaded!');
    }

    /**
     * Load a single sound file
     */
    async loadSound(name, url) {
        if (!this.context) return;

        try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
            this.sounds[name] = audioBuffer;
            console.log(`✓ Loaded: ${name}`);
        } catch (e) {
            console.warn(`Failed to load sound: ${name}`, e);
            // No fallback beep as requested
        }
    }

    /**
     * Play a sound effect
     */
    playSound(name, volume = 1.0) {
        if (!this.enabled || !this.context || !this.sounds[name]) return;

        const source = this.context.createBufferSource();
        const gainNode = this.context.createGain();

        source.buffer = this.sounds[name];
        gainNode.gain.value = volume * this.sfxVolume;

        source.connect(gainNode);
        gainNode.connect(this.context.destination);

        source.start(0);
    }

    /**
     * Play BACKGROUND MUSIC (menu screens - homepage, game over)
     */
    playMenuMusic() {
        if (!this.enabled || !this.context || !this.sounds['background_music']) return;

        this.stopMenuMusic(); // Stop if already playing

        this.menuMusicSource = this.context.createBufferSource();
        this.menuMusicGain = this.context.createGain();

        this.menuMusicSource.buffer = this.sounds['background_music'];
        this.menuMusicSource.loop = true;
        this.menuMusicGain.gain.value = this.musicVolume;

        this.menuMusicSource.connect(this.menuMusicGain);
        this.menuMusicGain.connect(this.context.destination);

        this.menuMusicSource.start(0);
        console.log('🎵 Menu music playing');
    }

    /**
     * Stop menu background music
     */
    stopMenuMusic() {
        if (this.menuMusicSource) {
            try {
                this.menuMusicSource.stop();
            } catch (e) {
                // Already stopped
            }
            this.menuMusicSource = null;
            this.menuMusicGain = null;
        }
    }

    /**
     * Play ENGINE LOOP (during gameplay only)
     */
    playEngineLoop() {
        if (!this.enabled || !this.context || !this.sounds['engine_loop']) return;

        this.stopEngineLoop(); // Stop if already playing

        this.engineLoopSource = this.context.createBufferSource();
        this.engineLoopGain = this.context.createGain();

        this.engineLoopSource.buffer = this.sounds['engine_loop'];
        this.engineLoopSource.loop = true;
        this.engineLoopGain.gain.value = this.musicVolume * 0.8; // Slightly quieter

        this.engineLoopSource.connect(this.engineLoopGain);
        this.engineLoopGain.connect(this.context.destination);

        this.engineLoopSource.start(0);
        console.log('🚁 Engine loop playing');
    }

    /**
     * Stop engine loop
     */
    stopEngineLoop() {
        if (this.engineLoopSource) {
            try {
                this.engineLoopSource.stop();
            } catch (e) {
                // Already stopped
            }
            this.engineLoopSource = null;
            this.engineLoopGain = null;
        }
    }

    /**
     * Stop all looping sounds
     */
    stopAllLoops() {
        this.stopMenuMusic();
        this.stopEngineLoop();
    }

    /**
     * Toggle sound on/off
     */
    toggle() {
        this.enabled = !this.enabled;
        if (!this.enabled) {
            this.stopAllLoops();
        }
        return this.enabled;
    }
}
