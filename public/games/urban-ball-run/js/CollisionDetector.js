/**
 * CollisionDetector - Handles collision detection
 */
class CollisionDetector {
    constructor(player, obstacleManager, audioManager) {
        this.player = player;
        this.obstacleManager = obstacleManager;
        this.audioManager = audioManager;
        this.nearMissDistance = 2.0;
    }

    /**
     * Check collisions with obstacles
     */
    checkCollisions() {
        const playerSphere = this.player.getBoundingSphere();
        const obstacles = this.obstacleManager.getObstacles();

        let nearMiss = false;

        for (let obstacle of obstacles) {
            // Only check obstacles near the player (optimization)
            const zDistance = Math.abs(obstacle.position.z - this.player.position.z);
            if (zDistance > 10) continue;

            const collision = this.checkObstacleCollision(playerSphere, obstacle);

            if (collision.hit) {
                return { collision: true, nearMiss: false };
            }

            if (collision.nearMiss) {
                nearMiss = true;
            }
        }

        return { collision: false, nearMiss };
    }

    /**
     * Check collision with a single obstacle
     * URBAN BALL RUN - Simple sphere/box collision for all obstacle types
     */
    checkObstacleCollision(playerSphere, obstacle) {
        const data = obstacle.userData;

        // Simple distance-based collision for all urban obstacles
        // All obstacles use similar box/sphere collision logic
        switch (data.type) {
            case 'cone':
            case 'crate':
            case 'block':
            case 'cart':
                return this.checkSimpleCollision(playerSphere, obstacle, 1.0); // 1.0 = collision radius

            case 'barrier':
                return this.checkBarrierCollision(playerSphere, obstacle);

            default:
                return { hit: false, nearMiss: false };
        }
    }

    /**
     * Simple sphere-to-sphere collision (for cones, crates, blocks, carts)
     * URBAN BALL RUN - Includes Y-axis check for jump-over mechanics
     */
    checkSimpleCollision(playerSphere, obstacle, collisionRadius) {
        const dist = playerSphere.center.distanceTo(obstacle.position);

        // Check if ball is HIGH ENOUGH to jump over obstacle
        const yDiff = playerSphere.center.y - obstacle.position.y;
        const obstacleHeight = 1.0; // Typical obstacle height

        // If ball is above obstacle (jumped over), no collision
        if (yDiff > obstacleHeight) {
            return { hit: false, nearMiss: false };
        }

        if (dist < playerSphere.radius + collisionRadius) {
            return { hit: true, nearMiss: false };
        }

        if (dist < playerSphere.radius + collisionRadius + 0.5) {
            return { hit: false, nearMiss: true };
        }

        return { hit: false, nearMiss: false };
    }

    /**
     * Check collision with barrier (box-shaped, crosses path)
     * URBAN BALL RUN - Includes Y-axis check for jump-over mechanics
     */
    checkBarrierCollision(playerSphere, barrier) {
        const zDist = Math.abs(playerSphere.center.z - barrier.position.z);

        if (zDist < 1.5) {
            // Check if ball is HIGH ENOUGH to jump over barrier
            const yDiff = playerSphere.center.y - barrier.position.y;
            const barrierHeight = 0.8; // Barrier height

            // If ball is above barrier (jumped over), no collision
            if (yDiff > barrierHeight + 0.2) {
                return { hit: false, nearMiss: false };
            }

            // Barrier is wide (3 units), check if player position overlaps
            const xDist = Math.abs(playerSphere.center.x - barrier.position.x);

            if (xDist < 1.5 + playerSphere.radius) { // Half barrier width + player radius
                return { hit: true, nearMiss: false };
            }

            if (xDist < 2.0 + playerSphere.radius) {
                return { hit: false, nearMiss: true };
            }
        }

        return { hit: false, nearMiss: false };
    }

    /**
     * Check collision with rotating blade
     */
    checkBladeCollision(playerSphere, blade) {
        // Check if player is in the same Z plane as blade
        const zDist = Math.abs(playerSphere.center.z - blade.position.z);

        if (zDist < 1.0) {
            // Check if player is within blade radius
            const xyDist = Math.sqrt(
                Math.pow(playerSphere.center.x - blade.position.x, 2) +
                Math.pow(playerSphere.center.y - blade.position.y, 2)
            );

            if (xyDist < 3.5 && xyDist > 0.5) {
                return { hit: true, nearMiss: false };
            }

            if (xyDist < 4.0) {
                return { hit: false, nearMiss: true };
            }
        }

        return { hit: false, nearMiss: false };
    }

    /**
     * Check collision with shrinking door
     */
    checkDoorCollision(playerSphere, door, data) {
        const zDist = Math.abs(playerSphere.center.z - door.position.z);

        if (zDist < 1.0) {
            const scale = 0.5 + Math.abs(Math.sin(data.pulseTime)) * 0.5;
            const gapX = 4 * scale;
            const gapY = 5 * scale;

            const playerX = Math.abs(playerSphere.center.x);
            const playerY = Math.abs(playerSphere.center.y);

            // Check if player is outside the gap
            if (playerX + playerSphere.radius > gapX || playerY + playerSphere.radius > gapY) {
                return { hit: true, nearMiss: false };
            }

            if (playerX + playerSphere.radius > gapX - 1 || playerY + playerSphere.radius > gapY - 1) {
                return { hit: false, nearMiss: true };
            }
        }

        return { hit: false, nearMiss: false };
    }

    /**
     * Check collision with laser ring
     */
    checkLaserCollision(playerSphere, laserRing) {
        const zDist = Math.abs(playerSphere.center.z - laserRing.position.z);

        if (zDist < 2.0) {
            // Check each laser beam
            for (let beam of laserRing.children) {
                const beamPos = new THREE.Vector3();
                beam.getWorldPosition(beamPos);

                const dist = playerSphere.center.distanceTo(beamPos);

                if (dist < playerSphere.radius + 0.5) {
                    return { hit: true, nearMiss: false };
                }

                if (dist < playerSphere.radius + 1.0) {
                    return { hit: false, nearMiss: true };
                }
            }
        }

        return { hit: false, nearMiss: false };
    }

    /**
     * Check collision with block
     */
    checkBlockCollision(playerSphere, block) {
        const blockSphere = new THREE.Sphere(block.position, 0.7);

        if (playerSphere.intersectsSphere(blockSphere)) {
            return { hit: true, nearMiss: false };
        }

        const dist = playerSphere.center.distanceTo(block.position);
        if (dist < playerSphere.radius + 1.5) {
            return { hit: false, nearMiss: true };
        }

        return { hit: false, nearMiss: false };
    }
}
