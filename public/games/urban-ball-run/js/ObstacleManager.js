/**
 * ObstacleManager - Spawns and manages realistic urban obstacles
 * URBAN BALL RUN - Traffic cones, barriers, crates, blocks, carts
 */
class ObstacleManager {
    constructor(scene, player, textureManager, pathGenerator) {
        this.scene = scene;
        this.player = player;
        this.textureManager = textureManager;
        this.pathGenerator = pathGenerator; // Store path generator to check for gaps
        this.obstacles = [];
        this.spawnDistance = 50;
        this.lastSpawnZ = 0;
        this.difficulty = 1;

        // Urban obstacle types
        this.types = ['cone', 'barrier', 'crate', 'block', 'cart'];
    }

    /**
     * Update obstacles and spawn new ones
     */
    update(deltaTime) {
        const playerZ = this.player.position.z;

        // Spawn new obstacles
        if (playerZ > this.lastSpawnZ + this.spawnDistance / this.difficulty) {
            this.spawnObstacle(playerZ + 100);
            this.lastSpawnZ = playerZ;
        }

        // Update existing obstacles
        this.obstacles.forEach(obstacle => {
            this.updateObstacle(obstacle, deltaTime);
        });

        // Remove obstacles behind player
        this.obstacles.forEach(obstacle => {
            if (obstacle.position.z < playerZ - 50) {
                this.removeObstacle(obstacle);
            }
        });

        // Clean up array
        this.obstacles = this.obstacles.filter(obstacle => obstacle.position.z >= playerZ - 50);
    }

    /**
     * Spawn a new obstacle
     */
    spawnObstacle(z) {
        // GAP CHECK: Don't spawn obstacles if there is no road at this position
        if (this.pathGenerator && !this.pathGenerator.isGroundAt(z)) {
            console.log('Skipping obstacle spawn - Gap detected at Z:', z);
            return;
        }

        const type = this.types[Math.floor(Math.random() * this.types.length)];
        let obstacle;

        switch (type) {
            case 'cone':
                obstacle = this.createTrafficCone(z);
                break;
            case 'barrier':
                obstacle = this.createRoadBarrier(z);
                break;
            case 'crate':
                obstacle = this.createWoodenCrate(z);
                break;
            case 'block':
                obstacle = this.createConstructionBlock(z);
                break;
            case 'cart':
                obstacle = this.createServiceCart(z);
                break;
        }

        if (obstacle) {
            this.obstacles.push(obstacle);
        }
    }

    /**
     * Create traffic cone (with realistic texture sprite)
     * URBAN BALL RUN - Uses cone.png texture
     */
    createTrafficCone(z) {
        const coneTexture = this.textureManager.get('obstacle_cone');

        if (coneTexture) {
            const spriteMaterial = new THREE.SpriteMaterial({
                map: coneTexture,
                transparent: true,
                alphaTest: 0.1 // Removes soft edges/shadows from the render
            });

            const sprite = new THREE.Sprite(spriteMaterial);
            sprite.scale.set(1.5, 2.2, 1); // Larger, more imposing cone
            sprite.position.set((Math.random() - 0.5) * 6, 1.1, z); // Adjusted Y for larger scale

            sprite.userData = { type: 'cone', dangerous: true };
            this.scene.add(sprite);
            return sprite;
        }

        // Fallback
        const group = new THREE.Group();
        const coneGeometry = new THREE.ConeGeometry(0.4, 1.2, 12);
        const coneMaterial = new THREE.MeshStandardMaterial({ color: 0xff6600 });
        const cone = new THREE.Mesh(coneGeometry, coneMaterial);
        cone.position.y = 0.6;
        group.add(cone);
        group.position.set((Math.random() - 0.5) * 6, 0, z);
        group.userData = { type: 'cone', dangerous: true };
        this.scene.add(group);
        return group;
    }

    /**
     * Create road barrier (LOW-POLY) - Orange/white construction barrier
     */
    createRoadBarrier(z) {
        const barrierTexture = this.textureManager.get('obstacle_barrier');

        if (barrierTexture) {
            const spriteMaterial = new THREE.SpriteMaterial({
                map: barrierTexture,
                transparent: true,
                alphaTest: 0.1
            });

            const sprite = new THREE.Sprite(spriteMaterial);
            sprite.scale.set(5, 1.8, 1); // Massive barrier
            sprite.position.set((Math.random() - 0.5) * 4, 0.9, z);

            sprite.userData = { type: 'barrier', dangerous: true };
            this.scene.add(sprite);
            return sprite;
        }

        // Fallback
        const group = new THREE.Group();
        const barrierGeometry = new THREE.BoxGeometry(3, 1, 0.2);
        const barrierMaterial = new THREE.MeshStandardMaterial({ color: 0xff9900 });
        const barrier = new THREE.Mesh(barrierGeometry, barrierMaterial);
        barrier.position.y = 0.5;
        group.add(barrier);
        group.position.set(0, 0, z);
        group.userData = { type: 'barrier', dangerous: true };
        this.scene.add(group);
        return group;
    }

    /**
     * Create wooden crate (LOW-POLY) - Simple brown cube
     */
    createWoodenCrate(z) {
        const crateTexture = this.textureManager.get('obstacle_crate');

        if (crateTexture) {
            const spriteMaterial = new THREE.SpriteMaterial({
                map: crateTexture,
                transparent: true,
                alphaTest: 0.1
            });

            const sprite = new THREE.Sprite(spriteMaterial);
            sprite.scale.set(2.2, 2.2, 1); // Large crate
            sprite.position.set((Math.random() - 0.5) * 6, 1.1, z);

            sprite.userData = { type: 'crate', dangerous: true };
            this.scene.add(sprite);
            return sprite;
        }

        const crate = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: 0x8B4513 }));
        crate.position.set((Math.random() - 0.5) * 6, 0.5, z);
        crate.userData = { type: 'crate', dangerous: true };
        this.scene.add(crate);
        return crate;
    }

    /**
     * Create construction block (LOW-POLY) - Concrete cube
     */
    createConstructionBlock(z) {
        const blockTexture = this.textureManager.get('obstacle_block');

        if (blockTexture) {
            const spriteMaterial = new THREE.SpriteMaterial({
                map: blockTexture,
                transparent: true,
                alphaTest: 0.1
            });

            const sprite = new THREE.Sprite(spriteMaterial);
            const size = 1.2 + Math.random() * 0.5;
            sprite.scale.set(size, size, 1);

            const xPos = (Math.random() - 0.5) * 6;
            sprite.position.set(xPos, size / 2, z);

            sprite.userData = { type: 'block', dangerous: true };
            this.scene.add(sprite);
            return sprite;
        }

        // Fallback
        const block = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 1.2), new THREE.MeshStandardMaterial({ color: 0x808080 }));
        block.position.set((Math.random() - 0.5) * 6, 0.6, z);
        block.userData = { type: 'block', dangerous: true };
        this.scene.add(block);
        return block;
    }

    /**
     * Create service cart (LOW-POLY) - Moving cart obstacle
     */
    createServiceCart(z) {
        const cartTexture = this.textureManager.get('obstacle_cart');

        if (cartTexture) {
            const spriteMaterial = new THREE.SpriteMaterial({
                map: cartTexture,
                transparent: true,
                alphaTest: 0.1
            });

            const sprite = new THREE.Sprite(spriteMaterial);
            sprite.scale.set(1.5, 1.2, 1);

            // Move carts side to side in update()
            sprite.position.set(-4, 0.6, z);

            sprite.userData = {
                type: 'cart',
                dangerous: true,
                moveSpeed: 0.03,
                moveDirection: 1
            };
            this.scene.add(sprite);
            return sprite;
        }

        // Fallback
        const group = new THREE.Group();
        const body = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.8, 0.8), new THREE.MeshStandardMaterial({ color: 0x666666 }));
        body.position.y = 0.5;
        group.add(body);
        group.position.set(-4, 0, z);
        group.userData = { type: 'cart', dangerous: true, moveSpeed: 0.03, moveDirection: 1 };
        this.scene.add(group);
        return group;
    }

    /**
     * Update individual obstacle
     */
    updateObstacle(obstacle, deltaTime) {
        const data = obstacle.userData;

        // Move carts side to side
        if (data.type === 'cart') {
            obstacle.position.x += data.moveSpeed * data.moveDirection;

            // Reverse direction at boundaries
            if (obstacle.position.x > 4) data.moveDirection = -1;
            if (obstacle.position.x < -4) data.moveDirection = 1;

            // Rotate wheels (visual only) if using geometry fallback
            if (obstacle.children.length > 0) {
                obstacle.children.forEach(child => {
                    if (child.geometry && child.geometry.type === 'CylinderGeometry') {
                        child.rotation.x += data.moveSpeed * 2;
                    }
                });
            }
        }
    }

    /**
     * Remove obstacle
     */
    removeObstacle(obstacle) {
        this.scene.remove(obstacle);
        obstacle.traverse(child => {
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
     * Increase difficulty
     */
    increaseDifficulty(level) {
        this.difficulty = Math.min(level, 3);
    }

    /**
     * Reset obstacles
     */
    reset() {
        this.obstacles.forEach(obstacle => {
            this.removeObstacle(obstacle);
        });
        this.obstacles = [];
        this.lastSpawnZ = 0;
        this.difficulty = 1;
    }

    /**
     * Get all dangerous obstacles
     */
    getObstacles() {
        return this.obstacles.filter(o => o.userData.dangerous);
    }
}
