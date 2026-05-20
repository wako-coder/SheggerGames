/**
 * EffectsManager - Handles visual effects
 */
class EffectsManager {
    constructor(scene, camera, player) {
        this.scene = scene;
        this.camera = camera;
        this.player = player;
        this.particles = [];
        this.maxParticles = 50;

        this.initSpeedLines();
    }

    /**
     * Initialize speed line particles
     */
    initSpeedLines() {
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        const colors = [];

        for (let i = 0; i < this.maxParticles; i++) {
            // Random position around tunnel
            const angle = Math.random() * Math.PI * 2;
            const radius = 2 + Math.random() * 3;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const z = Math.random() * 50;

            positions.push(x, y, z);

            // Cyan color for neon effect
            colors.push(0, 1, 1);
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });

        this.speedLines = new THREE.Points(geometry, material);
        this.scene.add(this.speedLines);
    }

    /**
     * Update effects
     */
    update(deltaTime) {
        this.updateSpeedLines();
    }

    /**
     * Update speed line positions
     */
    updateSpeedLines() {
        const positions = this.speedLines.geometry.attributes.position.array;
        const playerZ = this.player.position.z;
        const speed = this.player.speed;

        for (let i = 0; i < positions.length; i += 3) {
            // Move particles backward relative to player
            positions[i + 2] -= speed * 2;

            // Reset particles that go behind player
            if (positions[i + 2] < playerZ - 10) {
                positions[i + 2] = playerZ + 50;

                // Randomize position
                const angle = Math.random() * Math.PI * 2;
                const radius = 2 + Math.random() * 3;
                positions[i] = Math.cos(angle) * radius;
                positions[i + 1] = Math.sin(angle) * radius;
            }
        }

        this.speedLines.geometry.attributes.position.needsUpdate = true;

        // Position speed lines relative to player
        this.speedLines.position.z = playerZ;
    }

    /**
     * Create explosion effect
     */
    createExplosion(position) {
        const particleCount = 20;
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        const velocities = [];

        for (let i = 0; i < particleCount; i++) {
            positions.push(position.x, position.y, position.z);

            // Random velocity
            velocities.push(
                (Math.random() - 0.5) * 0.2,
                (Math.random() - 0.5) * 0.2,
                (Math.random() - 0.5) * 0.2
            );
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({
            size: 0.2,
            color: 0xff0000,
            transparent: true,
            opacity: 1.0,
            blending: THREE.AdditiveBlending
        });

        const particles = new THREE.Points(geometry, material);
        this.scene.add(particles);

        // Animate explosion
        let life = 1.0;
        const animate = () => {
            const positions = particles.geometry.attributes.position.array;

            for (let i = 0; i < positions.length; i += 3) {
                positions[i] += velocities[i];
                positions[i + 1] += velocities[i + 1];
                positions[i + 2] += velocities[i + 2];
            }

            particles.geometry.attributes.position.needsUpdate = true;
            material.opacity = life;
            life -= 0.02;

            if (life > 0) {
                requestAnimationFrame(animate);
            } else {
                this.scene.remove(particles);
                geometry.dispose();
                material.dispose();
            }
        };

        animate();
    }

    /**
     * Boost effect
     */
    setBoostEffect(active) {
        if (active) {
            this.speedLines.material.size = 0.2;
            this.speedLines.material.opacity = 1.0;
        } else {
            this.speedLines.material.size = 0.1;
            this.speedLines.material.opacity = 0.6;
        }
    }

    /**
     * Reset effects
     */
    reset() {
        this.setBoostEffect(false);
    }
}
