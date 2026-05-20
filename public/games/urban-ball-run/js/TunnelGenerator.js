/**
 * PathGenerator - Procedurally generates endless urban paths
 * URBAN BALL RUN - Flat paths (asphalt, sidewalk, rooftops, bridges)
 */
class PathGenerator {
    constructor(scene, player, textureManager) {
        this.scene = scene;
        this.player = player;
        this.textureManager = textureManager;
        this.segments = [];
        this.segmentLength = 5; // REDUCED for better gap granularity
        this.pathWidth = 10;
        this.segmentsAhead = 100; // HUGE BUFFER to prevent void at high (144hz+) frame rates
        this.segmentsBehind = 5;
        this.currentSegment = 0;
        this.gapIndices = new Set(); // Track segments with missing road

        this.init();
    }

    /**
     * Initialize path segments
     */
    init() {
        for (let i = -this.segmentsBehind; i < this.segmentsAhead; i++) {
            this.createSegment(i);
        }
    }

    /**
     * Create a single path segment
     * URBAN BALL RUN - Procedural gaps added
     */
    createSegment(index) {
        const group = new THREE.Group();
        const zPosition = index * this.segmentLength;

        // PROCEDURAL GAPS LOGIC
        // Don't create gaps in the first 20 segments (safe start)
        let isGap = false;
        if (index > 20) {
            // 20% chance of a gap appearing
            // RESTRICTION: Gaps can ONLY be 1 segment long for playability
            const prevWasGap = this.gapIndices.has(index - 1);

            if (!prevWasGap) {
                isGap = Math.random() < 0.15; // 15% chance for a new gap
            }
        }

        if (isGap) {
            this.gapIndices.add(index);
        }

        // Only create the path mesh if it's NOT a gap
        if (!isGap) {
            // REALISTIC TEXTURES - Alternate between asphalt and concrete
            const useAsphalt = Math.random() > 0.3;
            const pathTexture = useAsphalt
                ? this.textureManager.get('ground_asphalt')
                : this.textureManager.get('ground_concrete');

            if (pathTexture) {
                pathTexture.wrapS = THREE.RepeatWrapping;
                pathTexture.wrapT = THREE.RepeatWrapping;
                pathTexture.repeat.set(2, 1); // Adjusted for shorter segmentLength
                pathTexture.anisotropy = 16;
            }

            const pathGeometry = new THREE.PlaneGeometry(this.pathWidth, this.segmentLength);
            const pathMaterial = new THREE.MeshStandardMaterial({
                map: pathTexture || null,
                color: pathTexture ? 0xffffff : 0x666666,
                roughness: 0.9,
                metalness: 0.05
            });

            const path = new THREE.Mesh(pathGeometry, pathMaterial);
            path.rotation.x = -Math.PI / 2;
            path.position.z = this.segmentLength / 2;
            path.receiveShadow = true;
            group.add(path);

            // Add guardrails only on non-gap segments
            if (index % 4 === 0) {
                const railGeometry = new THREE.BoxGeometry(0.2, 0.5, this.segmentLength);
                const railMaterial = new THREE.MeshStandardMaterial({
                    color: 0x888888,
                    roughness: 0.7,
                    metalness: 0.3
                });

                const railLeft = new THREE.Mesh(railGeometry, railMaterial);
                railLeft.position.set(-this.pathWidth / 2, 0.25, 0);
                group.add(railLeft);

                const railRight = new THREE.Mesh(railGeometry, railMaterial);
                railRight.position.set(this.pathWidth / 2, 0.25, 0);
                group.add(railRight);
            }
        }

        // Background buildings (Always spawn, even if there's a gap in the road)
        if (index % 10 === 0) {
            const buildingTexture = Math.random() > 0.5
                ? this.textureManager.get('building1')
                : this.textureManager.get('building2');

            const buildingWidth = 10 + Math.random() * 5;
            const buildingHeight = 40 + Math.random() * 40;
            const buildingDepth = 12 + Math.random() * 8;

            const buildingGeometry = new THREE.BoxGeometry(buildingWidth, buildingHeight, buildingDepth);
            const buildingMaterial = new THREE.MeshStandardMaterial({
                map: buildingTexture || null,
                color: buildingTexture ? 0xffffff : 0x555555,
                roughness: 0.7,
                metalness: 0.2
            });

            if (buildingTexture) {
                buildingTexture.wrapS = THREE.RepeatWrapping;
                buildingTexture.wrapT = THREE.RepeatWrapping;
                buildingTexture.repeat.set(buildingWidth / 4, buildingHeight / 8);
            }

            const foundationDepth = 30;
            const buildingLeft = new THREE.Mesh(buildingGeometry, buildingMaterial);
            buildingLeft.position.set(-20, (buildingHeight / 2) - foundationDepth, 0);
            group.add(buildingLeft);

            const buildingRight = new THREE.Mesh(buildingGeometry.clone(), buildingMaterial);
            buildingRight.position.set(20, (buildingHeight / 2) - foundationDepth, 0);
            group.add(buildingRight);
        }

        // Urban Floor - Keep it massive to grounding the scene
        const floorGeometry = new THREE.PlaneGeometry(400, this.segmentLength);
        const floorMaterial = new THREE.MeshStandardMaterial({
            color: 0x050505,
            roughness: 1.0,
            metalness: 0.0
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -20; // Move floor MUCH lower so falling is visible
        floor.position.z = this.segmentLength / 2;
        group.add(floor);

        group.position.z = zPosition;
        group.userData.index = index;

        this.scene.add(group);
        this.segments.push(group);
    }

    /**
     * Check if there is ground at a specific Z coordinate
     */
    isGroundAt(z) {
        const index = Math.floor(z / this.segmentLength);
        return !this.gapIndices.has(index);
    }

    /**
     * Check if there are fences/guardrails at a specific Z coordinate
     */
    hasFenceAt(z) {
        const index = Math.floor(z / this.segmentLength);
        // Fences appear on segments divisible by 4, but NOT on gaps
        return (index % 4 === 0) && !this.gapIndices.has(index);
    }

    /**
     * Update path - generate new segments, remove old ones
     * Fix: Use while loop to handle high speeds (skip prevention)
     */
    update() {
        const playerZ = this.player.position.z;
        const targetSegmentIndex = Math.floor(playerZ / this.segmentLength);

        // Generate all segments between current and target (fixes high speed skipping)
        while (this.currentSegment < targetSegmentIndex) {
            this.currentSegment++; // Move forward one segment

            const newSegmentIndex = this.currentSegment + this.segmentsAhead;
            this.createSegment(newSegmentIndex);

            const removeIndex = this.currentSegment - this.segmentsBehind - 1;
            const segmentToRemove = this.segments.find(s => s.userData.index === removeIndex);

            if (segmentToRemove) {
                this.scene.remove(segmentToRemove);
                segmentToRemove.traverse(child => {
                    if (child.geometry) child.geometry.dispose();
                    if (child.material) {
                        if (Array.isArray(child.material)) {
                            child.material.forEach(m => m.dispose());
                        } else {
                            child.material.dispose();
                        }
                    }
                });
                this.segments = this.segments.filter(s => s.userData.index !== removeIndex);
                this.gapIndices.delete(removeIndex);
            }
        }
    }

    getRadiusAt(z) {
        return this.pathWidth / 2;
    }

    reset() {
        this.segments.forEach(segment => {
            this.scene.remove(segment);
            segment.traverse(child => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) {
                    if (Array.isArray(child.material)) {
                        child.material.forEach(m => m.dispose());
                    } else {
                        child.material.dispose();
                    }
                }
            });
        });

        this.segments = [];
        this.gapIndices.clear();
        this.currentSegment = 0;
        this.init();
    }
}

// Maintain backward compatibility with old class name
const TunnelGenerator = PathGenerator;
