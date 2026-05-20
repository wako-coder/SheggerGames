/**
 * CameraController - Handles third-person camera
 */
class CameraController {
    constructor(camera, player) {
        this.camera = camera;
        this.player = player;

        // Camera settings
        this.offset = new THREE.Vector3(0, 2, -8);
        this.lookAhead = 5;
        this.smoothness = 0.1;

        // Camera shake
        this.shakeIntensity = 0;
        this.shakeDecay = 0.95;

        // Target position
        this.targetPosition = new THREE.Vector3();
        this.targetLookAt = new THREE.Vector3();
    }

    /**
     * Update camera position
     */
    update() {
        // Calculate target position (behind and above player)
        this.targetPosition.copy(this.player.position);
        this.targetPosition.add(this.offset);

        // Add camera shake
        if (this.shakeIntensity > 0.01) {
            this.targetPosition.x += (Math.random() - 0.5) * this.shakeIntensity;
            this.targetPosition.y += (Math.random() - 0.5) * this.shakeIntensity;
            this.shakeIntensity *= this.shakeDecay;
        }

        // Smooth camera movement
        this.camera.position.lerp(this.targetPosition, this.smoothness);

        // Look at point ahead of player
        this.targetLookAt.copy(this.player.position);
        this.targetLookAt.z += this.lookAhead;

        this.camera.lookAt(this.targetLookAt);
    }

    /**
     * Trigger camera shake
     */
    shake(intensity = 0.5) {
        this.shakeIntensity = intensity;
    }

    /**
     * Adjust FOV (for speed boost effect)
     */
    setFOV(fov, duration = 1000) {
        const startFOV = this.camera.fov;
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            this.camera.fov = startFOV + (fov - startFOV) * progress;
            this.camera.updateProjectionMatrix();

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        animate();
    }

    /**
     * Reset camera
     */
    reset() {
        this.shakeIntensity = 0;
        this.camera.position.set(0, 2, -8);
        this.camera.lookAt(0, 0, 0);
    }
}
