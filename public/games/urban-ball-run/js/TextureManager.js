/**
 * TextureManager - Loads and manages all game textures
 */
class TextureManager {
    constructor() {
        this.loader = new THREE.TextureLoader();
        this.textures = {};
        this.loaded = false;
        this.loadingProgress = 0;
    }

    /**
     * Load all game textures
     */
    async loadAllTextures() {
        console.log('Starting texture loading...');

        const texturePaths = {
            // REALISTIC TEXTURES - Urban Ball Run
            'ball_concrete': 'assets/images/textures/ball/ball texture.png',
            'ground_asphalt': 'assets/images/textures/ground/path1.png',
            'ground_concrete': 'assets/images/textures/ground/path2.png',

            // Building and sky textures
            'building1': 'assets/images/textures/buildings/building1.png',
            'building2': 'assets/images/textures/buildings/building2.png',
            'sky': 'assets/images/textures/sky/sky.png',

            // Obstacle textures
            'obstacle_cone': 'assets/images/textures/obstacles/cone.png',
            'obstacle_barrier': 'assets/images/textures/obstacles/barrier.png',
            'obstacle_crate': 'assets/images/textures/obstacles/crate.png',
            'obstacle_block': 'assets/images/textures/obstacles/block.png',
            'obstacle_cart': 'assets/images/textures/obstacles/cart.png',

            // Power-ups
            // Power-ups (3D objects used, no textures needed)
            // shield: 'assets/images/powerups/shield_icon.png',
            // speedBoost: 'assets/images/powerups/speed_boost_icon.png'
        };

        const totalTextures = Object.keys(texturePaths).length;
        let loadedCount = 0;

        const loadPromises = Object.entries(texturePaths).map(([name, path]) => {
            return new Promise((resolve) => {
                this.loader.load(
                    path,
                    (texture) => {
                        this.textures[name] = texture;
                        loadedCount++;
                        this.loadingProgress = (loadedCount / totalTextures) * 100;
                        console.log(`✓ Loaded: ${name} (${Math.round(this.loadingProgress)}%)`);
                        resolve();
                    },
                    undefined,
                    (error) => {
                        console.warn(`✗ Failed to load: ${name} from ${path}`);
                        loadedCount++;
                        this.loadingProgress = (loadedCount / totalTextures) * 100;
                        resolve(); // Continue even if texture fails
                    }
                );
            });
        });

        await Promise.all(loadPromises);
        this.loaded = true;
        console.log('All textures loaded!');
        return true;
    }

    /**
     * Get texture by name
     */
    get(name) {
        return this.textures[name] || null;
    }

    /**
     * Check if a specific texture is loaded
     */
    has(name) {
        return this.textures[name] !== undefined && this.textures[name] !== null;
    }
}
