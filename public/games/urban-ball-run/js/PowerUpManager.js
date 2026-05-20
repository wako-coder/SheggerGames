/**
 * PowerUpManager - Manages power-up spawning and collection
 */
class PowerUpManager {
    constructor(scene, player, textureManager) {
        this.scene = scene;
        this.player = player;
        this.textureManager = textureManager;
        this.powerUps = [];
        this.spawnDistance = 80;
        this.lastSpawnZ = 0;

        this.types = ['boost'];
    }

    /**
     * Update power-ups
     */
    update(deltaTime) {
        const playerZ = this.player.position.z;

        // Spawn new power-ups
        if (playerZ > this.lastSpawnZ + this.spawnDistance) {
            if (Math.random() < 0.7) { // 70% chance to spawn
                this.spawnPowerUp(playerZ + 80);
            }
            this.lastSpawnZ = playerZ;
        }

        // Animate existing power-ups
        this.powerUps.forEach(powerUp => {
            powerUp.rotation.y += 0.05;
            powerUp.position.y += Math.sin(Date.now() * 0.005) * 0.01;
        });

        // Remove power-ups behind player
        this.powerUps = this.powerUps.filter(powerUp => {
            if (powerUp.position.z < playerZ - 50) {
                this.removePowerUp(powerUp);
                return false;
            }
            return true;
        });
    }

    /**
     * Spawn a power-up (using realistic icon images)
     */
    /**
     * Spawn a power-up (3D Object)
     */
    spawnPowerUp(z) {
        // URBAN BALL RUN - Only Speed Boost exists now (Shield removed)
        const type = 'boost';

        // Random position within tunnel (width -5 to 5)
        const xPos = (Math.random() * 8) - 4; // Keep it somewhat central

        // Create 3D Arrow / Bolt Shape
        const group = new THREE.Group();

        // Material - Glowing Neon Yellow
        const material = new THREE.MeshStandardMaterial({
            color: 0xFFD700,    // Gold/Yellow
            emissive: 0xFF4500, // Orange-red emissive for speed look
            emissiveIntensity: 0.8,
            roughness: 0.2,
            metalness: 0.8
        });

        // Construct an Arrow shape using boxes (more performance friendly than custom geometry)
        // Left arm of arrow
        const arm1 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.0, 0.3), material);
        arm1.position.set(-0.35, 0, 0);
        arm1.rotation.z = Math.PI / 6; // 30 degrees
        group.add(arm1);

        // Right arm of arrow
        const arm2 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.0, 0.3), material);
        arm2.position.set(0.35, 0, 0);
        arm2.rotation.z = -Math.PI / 6; // -30 degrees
        group.add(arm2);

        // Center spine
        const spine = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.2, 0.2), material);
        spine.position.y = -0.2;
        group.add(spine);

        // Add a PointLight for glow effect
        const light = new THREE.PointLight(0xFFAA00, 2, 8);
        light.position.set(0, 0, 0);
        group.add(light);

        // Position the group
        group.position.set(xPos, 0.5, z); // Hover above ground

        // Store data
        group.userData = {
            type: type,
            collected: false
        };

        this.scene.add(group);
        this.powerUps.push(group);

        console.log(`✓ Spawned 3D Speed Boost at Z: ${Math.floor(z)}`);
    }

    /**
     * Remove power-up and clean up
     */
    removePowerUp(powerUp) {
        this.scene.remove(powerUp);

        powerUp.traverse(child => {
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
                if (Array.isArray(child.material)) {
                    child.material.forEach(m => m.dispose());
                } else {
                    child.material.dispose();
                }
            }
        });
    }

    /**
     * Check collection and apply effect
     */
    checkCollection(player, audioManager) {
        let collected = false;

        this.powerUps.forEach((powerUp, index) => {
            if (powerUp.userData.collected) return;

            const distance = player.position.distanceTo(powerUp.position);

            if (distance < 1.0) {
                powerUp.userData.collected = true;
                collected = true; // Mark that we collected something

                // Apply power-up effect
                if (powerUp.userData.type === 'boost') {
                    player.activateBoost();
                }

                // Sound handled in main.js
                // audioManager.playSound('pickup');

                // Remove power-up
                this.removePowerUp(powerUp);
                this.powerUps.splice(index, 1);
            }
        });

        return collected ? 'boost' : null; // Return type if collected
    }

    /**
     * Reset power-ups
     */
    reset() {
        this.powerUps.forEach(powerUp => {
            this.removePowerUp(powerUp);
        });

        this.powerUps = [];
        this.lastSpawnZ = 0;
    }
}
