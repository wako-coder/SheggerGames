/**
 * Player - Rolling Ball controller
 * URBAN BALL RUN - Realistic ball physics
 */
class Player {
    constructor(scene, textureManager) {
        this.scene = scene;
        this.textureManager = textureManager;
        this.mesh = null;
        this.position = new THREE.Vector3(0, 0.5, 0); // START AT Y = 0.5 (radius above ground)
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.baseSpeed = 0.1; // Start very slow
        this.speed = 0.1; // Current speed
        this.maxSpeed = 2.0;
        this.moveSpeed = 0.15;
        this.boundaryRadius = 4.5; // Path width boundary

        // GRAVITY & JUMP - Simple physics
        this.ballRadius = 0.5; // Ball size
        this.groundLevel = this.ballRadius; // Ball sits on ground (Y = radius = 0.5)
        this.gravity = 0.0015; // Simple gravity constant
        this.jumpForce = 0.8; // Jump impulse (INCREASED to 0.8 to ensure gap clearance)
        this.isGrounded = true; // Track if ball is on ground

        // Power-up states
        this.speedBoost = false;
        this.boostDuration = 0;
        this.isDead = false; // Initialize death state

        this.createMesh();
    }

    /**
     * Create realistic rolling ball
     * URBAN BALL RUN - Realistic concrete textured ball
     */
    createMesh() {
        // Simple sphere geometry (LOW-POLY for mobile performance)
        const ballGeometry = new THREE.SphereGeometry(0.5, 32, 32); // 32 segments for smooth texture mapping

        // Load realistic concrete texture
        const concreteTexture = this.textureManager.get('ball_concrete');

        if (concreteTexture) {
            // Configure texture wrapping
            concreteTexture.wrapS = THREE.RepeatWrapping;
            concreteTexture.wrapT = THREE.RepeatWrapping;

            // Ball material - realistic concrete
            const ballMaterial = new THREE.MeshStandardMaterial({
                map: concreteTexture, // Apply realistic texture
                roughness: 0.95, // Very rough (concrete)
                metalness: 0.0,  // No metallic shine
                color: 0xffffff  // WHITE tint to let texture show through
            });

            this.mesh = new THREE.Mesh(ballGeometry, ballMaterial);
            this.mesh.castShadow = true;
            this.mesh.receiveShadow = true;

            console.log('✓ Using realistic concrete ball texture');
        } else {
            // Fallback to simple gray material
            const ballMaterial = new THREE.MeshStandardMaterial({
                color: 0x808080,
                roughness: 0.9,
                metalness: 0.1
            });

            this.mesh = new THREE.Mesh(ballGeometry, ballMaterial);
            this.mesh.castShadow = true;
            this.mesh.receiveShadow = true;

            console.log('⚠ Concrete texture not loaded, using fallback');
        }

        this.scene.add(this.mesh);
    }

    /**
     * Update player position and movement URBAN BALL RUN - Simple arcade physics with GRAVITY
     */
    update(input, deltaTime, pathGenerator) {
        // Simple forward velocity
        this.velocity.x = input.x * this.moveSpeed;

        // GRAVITY - Simple downward force
        if (!this.isGrounded) {
            this.velocity.y -= this.gravity * deltaTime;
        }

        // Update position
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.position.z += this.speed;

        // GROUND DETECTION - Check if there's road under the ball
        // URBAN BALL RUN - Check both Z (gaps) and X (width)
        const pathWidth = 10; // Total width from TunnelGenerator
        const halfWidth = pathWidth / 2;

        // Check Z for gaps
        const isGroundAtZ = pathGenerator.isGroundAt(this.position.z);

        // Check X for road width
        const isWithinWidth = Math.abs(this.position.x) <= halfWidth;

        // FENCE CHECK: If there is a fence, clamp position
        const hasFence = pathGenerator.hasFenceAt(this.position.z);
        if (hasFence && Math.abs(this.position.x) > this.boundaryRadius) {
            this.position.x = this.boundaryRadius * Math.sign(this.position.x);
        }

        // Is there road directly under the ball?
        const isOverRoad = isGroundAtZ && (hasFence || isWithinWidth);

        // If we are at ground level (y <= 0.5)
        // Fix: Only snap to ground if we are close to it (prevent teleporting up from deep void)
        if (this.position.y <= this.groundLevel && this.position.y > this.groundLevel - 1.5) {
            if (isOverRoad) {
                // Land on the road
                this.position.y = this.groundLevel;
                this.velocity.y = 0;
                this.isGrounded = true;
            } else {
                // Over a gap OR off the side! Allow falling
                this.isGrounded = false;
            }
        } else {
            // Above ground level (jumping or falling)
            this.isGrounded = false;
        }

        // DEATH CHECK - If fallen too far
        // URBAN BALL RUN - Faster death trigger
        if (this.position.y < -2) {
            this.isDead = true;
            console.log('💀 Player died: Fallen below threshold');
        }

        // REMOVED: Boundary clamp that prevented falling off sides
        // The ball can now roll off the edge (x > 5 or x < -5)

        // Update mesh position
        this.mesh.position.copy(this.position);

        // ROLLING ANIMATION - Visual only, synced to movement
        // Forward roll
        this.mesh.rotation.x += this.speed * 2; // Roll based on forward speed

        // Lateral tilt (NOT rotation - just visual feedback)
        this.mesh.rotation.z = -input.x * 0.3; // Tilt when moving left/right

        // Update boost timer
        if (this.speedBoost) {
            this.boostDuration -= deltaTime;
            if (this.boostDuration <= 0) {
                this.deactivateBoost();
            }
        }
    }

    /**
     * Jump (OPTIONAL - game works without it)
     * Simple impulse force - called from InputController
     */
    jump() {
        if (this.isGrounded) {
            this.velocity.y = this.jumpForce;
            this.isGrounded = false;
            console.log('Jump!');
        }
    }



    /**
     * Activate speed boost power-up
     * URBAN BALL RUN - Simple speed increase (no emissive effects)
     */
    activateBoost() {
        this.speedBoost = true;
        this.boostDuration = 3000; // 3 seconds
        this.speed = this.baseSpeed * 2;

        // Visual feedback: slightly enlarge ball during boost
        this.mesh.scale.set(1.1, 1.1, 1.1);
    }

    /**
     * Deactivate speed boost
     * URBAN BALL RUN - Reset ball scale
     */
    deactivateBoost() {
        this.speedBoost = false;
        this.speed = this.baseSpeed;

        // Reset ball scale
        this.mesh.scale.set(1, 1, 1);
    }

    /**
     * Handle collision
     */
    handleCollision() {
        return true; // Game over - no shield support
    }

    /**
     * Reset player state
     */
    reset() {
        this.position.set(0, 0.5, 0); // Start at Y = 0.5 (ball radius)
        this.velocity.set(0, 0, 0);

        // CRITICAL: Reset speed to initial values
        this.baseSpeed = 0.1; // Start very slow
        this.speed = 0.1; // Current speed starts at 0.1
        this.maxSpeed = 2.0;

        this.speedBoost = false;
        this.boostDuration = 0;
        this.isGrounded = true; // Start grounded
        this.isDead = false; // Reset death state
        this.deactivateBoost();
        this.mesh.position.copy(this.position);

        console.log('🔄 Player reset - Position Y: 0.5, Speed: 0.1');
    }

    /**
     * Get bounding sphere for collision
     */
    getBoundingSphere() {
        return new THREE.Sphere(this.position.clone(), 0.5); // Ball radius = 0.5
    }
}
