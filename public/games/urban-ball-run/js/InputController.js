/**
 * InputController - Handles keyboard and touch input
 */
class InputController {
    constructor() {
        this.keys = {};
        this.touchInput = {
            active: false,
            x: 0,
            y: 0,
            startX: 0,
            startY: 0
        };

        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        this.initKeyboard();
        // Always initialize touch listeners for hybrid devices or dev tools testing
        this.initTouch();
    }

    /**
     * Initialize keyboard controls
     */
    initKeyboard() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
            this.keys[e.code] = true;
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
            this.keys[e.code] = false;
        });
    }

    /**
     * Initialize touch controls (Drag to steer, Swipe to jump)
     */
    initTouch() {
        // Touch Start
        document.addEventListener('touchstart', (e) => {
            // e.preventDefault(); // Prevent scrolling - Removed to allow some default behaviors if needed, check conflicts
            const touch = e.touches[0];
            this.touchInput.active = true;
            this.touchInput.startX = touch.clientX;
            this.touchInput.startY = touch.clientY;
            this.touchInput.x = 0; // Reset on new touch
            this.touchInput.y = 0;
        }, { passive: false });

        // Touch Move
        document.addEventListener('touchmove', (e) => {
            if (!this.touchInput.active) return;
            // e.preventDefault(); // Prevent screen scrolling while playing

            const touch = e.touches[0];
            const deltaX = touch.clientX - this.touchInput.startX;
            const deltaY = touch.clientY - this.touchInput.startY;

            // Sensitivity threshold (Lower = more sensitive)
            const threshold = 1;

            // X-Axis Steering (Drag Left/Right)
            if (deltaX > threshold) {
                this.touchInput.x = -1; // Drag Right -> Move Right (Negative X)
            } else if (deltaX < -threshold) {
                this.touchInput.x = 1;  // Drag Left -> Move Left (Positive X)
            } else {
                this.touchInput.x = 0;
            }

            // Y-Axis (Swipe Up for Jump)
            if (deltaY < -threshold * 2) { // Drag Up
                this.touchInput.y = 1; // Jump
            } else {
                this.touchInput.y = 0;
            }

        }, { passive: false });

        // Touch End
        document.addEventListener('touchend', (e) => {
            this.touchInput.active = false;
            this.touchInput.x = 0;
            this.touchInput.y = 0;
        });

        document.addEventListener('touchcancel', (e) => {
            this.touchInput.active = false;
            this.touchInput.x = 0;
            this.touchInput.y = 0;
        });
    }

    /**
     * Get normalized input values (-1 to 1)
     */
    getInput() {
        let x = 0;
        let y = 0;

        // Keyboard input
        if (this.keys['a'] || this.keys['ArrowLeft']) x += 1;  // Left
        if (this.keys['d'] || this.keys['ArrowRight']) x -= 1; // Right
        if (this.keys['w'] || this.keys['ArrowUp']) y += 1;
        if (this.keys['s'] || this.keys['ArrowDown']) y -= 1;

        // Touch input (Add to keyboard input)
        if (this.touchInput.active || this.touchInput.x !== 0) {
            // If touch is providing direction, override or add to keyboard
            if (this.touchInput.x !== 0) x = this.touchInput.x;
            if (this.touchInput.y !== 0) y = this.touchInput.y;
        }

        return { x, y };
    }

    /**
     * Show mobile controls
     */
    showMobileControls() {
        if (this.isMobile) {
            document.getElementById('mobile-controls').classList.remove('hidden');
        }
    }

    /**
     * Hide mobile controls
     */
    hideMobileControls() {
        document.getElementById('mobile-controls').classList.add('hidden');
    }
}
