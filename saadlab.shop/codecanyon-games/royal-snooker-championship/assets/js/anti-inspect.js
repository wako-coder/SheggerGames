// --- Disable Right Click ---
document.addEventListener("contextmenu", (e) => e.preventDefault());

// --- Disable Certain Keys ---
document.onkeydown = function (e) {
    // F12
    if (e.keyCode === 123) {
        e.preventDefault();
        return false;
    }

    // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
    if (e.ctrlKey && e.shiftKey && [73, 74, 67].includes(e.keyCode)) {
        e.preventDefault();
        return false;
    }

    // Ctrl+U (view source)
    if (e.ctrlKey && e.keyCode === 85) {
        e.preventDefault();
        return false;
    }

    // Ctrl+Shift+K (Firefox console)
    if (e.ctrlKey && e.shiftKey && e.keyCode === 75) {
        e.preventDefault();
        return false;
    }

    // Ctrl+S, Ctrl+P
    if (e.ctrlKey && [83, 80].includes(e.keyCode)) {
        e.preventDefault();
        return false;
    }
    
    // F11 - Allow fullscreen
    if (e.keyCode === 122) {
        return true;
    }
    
    // Also check for F12 by key string (works in fullscreen)
    if (e.key === "F12") {
        e.preventDefault();
        return false;
    }
};

// --- Disable Selection, Copy, Drag ---
document.addEventListener("copy", (e) => e.preventDefault());
document.addEventListener("cut", (e) => e.preventDefault());
document.addEventListener("paste", (e) => e.preventDefault());
document.addEventListener("dragstart", (e) => e.preventDefault());
document.addEventListener("selectstart", (e) => e.preventDefault());

// --- Anti-F12 with Mouse Buttons ---
document.addEventListener("mousedown", (e) => {
    if (e.button === 2) e.preventDefault();
});

// Silent protection for gameFrame iframe - Preserves backend communication
(function () {
    "use strict";

    // Get the iframe element
    const gameFrame = document.getElementById("gameFrame");

    if (!gameFrame) {
        console.warn("gameFrame iframe not found");
        return;
    }

    // Store reference to your communication channel
    let communicationChannel = null;

    // ==================== PRESERVE BACKEND COMMUNICATION ====================

    // Helper to safely communicate with iframe
    function sendMessageToIframe(data) {
        try {
            if (gameFrame.contentWindow) {
                gameFrame.contentWindow.postMessage(data, "*");
            }
        } catch (e) {
            // Silently fail - don't break protection
        }
    }

    // Listen for messages from iframe
    window.addEventListener("message", function (event) {
        // Handle messages from your iframe
        if (event.source === gameFrame.contentWindow) {
            // Process your backend data here
            // Don't modify or block these messages
            communicationChannel = event.data;
        }
    });

    // ==================== PROTECTION LAYERS (Non-intrusive) ====================

    // 1. Disable Right Click Silently - Doesn't affect POST messages
    function disableRightClick() {
        document.addEventListener("contextmenu", function (e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        });

        // Apply to iframe but preserve its functionality
        gameFrame.addEventListener("load", function () {
            try {
                const iframeDoc =
                    gameFrame.contentDocument ||
                    gameFrame.contentWindow.document;
                iframeDoc.addEventListener("contextmenu", function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                });
            } catch (e) {
                // Cross-origin iframe - communication still works via postMessage
            }
        });
    }

    // 2. Block DevTools Shortcuts - Doesn't block POST requests
    function blockDevToolsShortcuts() {
        document.addEventListener(
            "keydown",
            function (e) {
                // Only block inspection shortcuts
                const blockedKeys = [
                    123, // F12
                    73, // I
                    74, // J
                    67, // C
                    85, // U
                    75, // K
                ];

                // Check for inspection shortcuts
                if (
                    e.key === "F12" ||
                    e.keyCode === 123 ||
                    (e.ctrlKey &&
                        e.shiftKey &&
                        blockedKeys.includes(e.keyCode)) ||
                    (e.metaKey &&
                        e.altKey &&
                        blockedKeys.includes(e.keyCode)) ||
                    (e.ctrlKey && e.key === "u")
                ) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }

                // Allow all other shortcuts (including those needed for your app)
                return true;
            },
            true,
        );
    }

    // 3. Enhance iframe security while preserving communication
    function enhanceIframeSecurity() {
        if (gameFrame) {
            // Get current src
            const currentSrc = gameFrame.src;

            // Set sandbox with permissions needed for your backend communication
            gameFrame.setAttribute(
                "sandbox",
                "allow-scripts allow-same-origin allow-forms allow-popups allow-modals",
            );

            // Preserve src
            gameFrame.src = currentSrc;

            // Ensure iframe can receive messages
            gameFrame.setAttribute("allow", "microphone; camera; geolocation");
        }
    }

    // 4. Prevent selection without breaking form inputs
    function preventSelection() {
        document.addEventListener("selectstart", function (e) {
            // Only prevent on non-input elements
            if (
                !e.target.matches('input, textarea, [contenteditable="true"]')
            ) {
                e.preventDefault();
                return false;
            }
        });

        document.addEventListener("copy", function (e) {
            // Only prevent on non-input elements
            if (
                !e.target.matches('input, textarea, [contenteditable="true"]')
            ) {
                e.preventDefault();
                e.clipboardData.setData("text/plain", "");
                return false;
            }
        });
    }

    // 5. Maintain iframe communication focus
    function maintainCommunication() {
        // Don't force focus if user is interacting with other elements
        document.addEventListener("focusin", function (e) {
            // Only redirect focus if it's going to body and iframe exists
            if (e.target === document.body && gameFrame) {
                // But don't steal focus if user is typing in an input
                if (
                    !document.activeElement ||
                    !document.activeElement.matches(
                        'input, textarea, [contenteditable="true"]',
                    )
                ) {
                    gameFrame.focus();
                }
            }
        });
    }

    // 6. Preserve backend POST requests
    function preserveBackendRequests() {
        // Store original XMLHttpRequest and fetch
        const originalXHROpen = XMLHttpRequest.prototype.open;
        const originalFetch = window.fetch;

        // Don't override them - just ensure they work
        // This function exists to explicitly NOT modify them

        // If you need to monitor requests, do it without breaking
        if (window.fetch) {
            window.fetch = function () {
                // Just pass through - don't modify
                return originalFetch.apply(this, arguments);
            };
        }
    }

    // 7. Handle iframe communication errors gracefully
    function handleCommunicationErrors() {
        window.addEventListener(
            "error",
            function (e) {
                // Ignore cross-origin errors that might occur from inspection attempts
                if (e.message && e.message.includes("cross-origin")) {
                    e.preventDefault();
                    return false;
                }
            },
            true,
        );

        // Preserve postMessage functionality
        const originalPostMessage = window.postMessage;
        window.postMessage = function () {
            // Allow all postMessages - critical for backend communication
            return originalPostMessage.apply(this, arguments);
        };
    }

    // 8. Safe console override - only block logging, not functionality
    function safeConsoleOverride() {
        if (!window._consoleOverridden) {
            window._consoleOverridden = true;

            // Only block logging methods, keep other console functionality
            const methods = ["log", "info", "warn", "error", "debug"];
            methods.forEach((method) => {
                if (console[method]) {
                    const originalMethod = console[method];
                    console[method] = function () {
                        // Block only if devtools is likely open
                        if (window._blockConsole) {
                            return;
                        }
                        originalMethod.apply(console, arguments);
                    };
                }
            });
        }
    }

    // 9. Monitor iframe communication health
    function monitorIframeHealth() {
        let lastPing = Date.now();

        // Ping iframe to ensure communication is alive
        setInterval(function () {
            try {
                if (gameFrame && gameFrame.contentWindow) {
                    // Send a silent ping
                    gameFrame.contentWindow.postMessage({ type: "PING" }, "*");
                }
            } catch (e) {
                // Communication failed - might be due to protection
                // Don't do anything drastic
            }
        }, 30000);
    }

    // ==================== INITIALIZE WITH COMMUNICATION PRESERVED ====================

    function initProtection() {
        // First, preserve communication
        preserveBackendRequests();
        handleCommunicationErrors();

        // Then apply protections that don't interfere
        disableRightClick();
        blockDevToolsShortcuts();
        enhanceIframeSecurity();
        preventSelection();
        maintainCommunication();
        safeConsoleOverride();
        monitorIframeHealth();

        // Handle iframe load events
        gameFrame.addEventListener("load", function () {
            try {
                // Notify that iframe loaded
                sendMessageToIframe({
                    type: "IFRAME_READY",
                    timestamp: Date.now(),
                });

                // Apply minimal protections to iframe content
                const iframeDoc =
                    gameFrame.contentDocument ||
                    gameFrame.contentWindow.document;
                if (iframeDoc) {
                    // Only add essential listeners
                    iframeDoc.addEventListener("contextmenu", function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        return false;
                    });
                }
            } catch (e) {
                // Cross-origin - communication still works via postMessage
            }
        });

        // Handle iframe errors without breaking
        gameFrame.addEventListener("error", function (e) {
            // Silently handle iframe errors
            e.preventDefault();
        });

        // Ensure communication channel stays open
        window.addEventListener("beforeunload", function () {
            try {
                if (gameFrame && gameFrame.contentWindow) {
                    gameFrame.contentWindow.postMessage(
                        { type: "PAGE_UNLOADING" },
                        "*",
                    );
                }
            } catch (e) {
                // Ignore
            }
        });
    }

    // Start protection when DOM is ready
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initProtection);
    } else {
        initProtection();
    }

    // Export communication methods if needed
    window.sendToIframe = function (data) {
        sendMessageToIframe(data);
    };

    window.getIframeCommunication = function () {
        return communicationChannel;
    };
})();