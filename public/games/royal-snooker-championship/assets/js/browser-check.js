(function () {
  'use strict';

  // ── CHECKS ───────────────────────────────────────────────────
  function detect() {
    const ua = navigator.userAgent;
    const issues = [];
    
    // Canvas 2D support (core game requirement)
    const testCanvas = document.createElement('canvas');
    const hasCanvas = !!(testCanvas.getContext && testCanvas.getContext('2d'));
    if (!hasCanvas) issues.push({ icon: '🎨', title: 'Canvas Not Supported', desc: 'Your browser cannot render the game graphics (HTML5 Canvas is required).' });

    // requestAnimationFrame
    if (!window.requestAnimationFrame) issues.push({ icon: '⚙️', title: 'Animation API Missing', desc: 'requestAnimationFrame is required for smooth gameplay.' });

    // ES6: arrow functions, const, template literals, destructuring
    let hasES6 = true;
    try { eval('"use strict"; const f = () => {}; let [a] = [1]; const {x=1}={};'); }
    catch (e) { hasES6 = false; }
    if (!hasES6) issues.push({ icon: '📜', title: 'Outdated JavaScript Engine', desc: 'Your browser does not support modern JavaScript (ES6+) required by the game.' });

    // CSS Custom Properties (used by UI)
    const hasCSS = window.CSS && window.CSS.supports && window.CSS.supports('color', 'var(--x)');
    // Not fatal — skip

    // WebGL (optional, nice to detect)
    let hasWebGL = false;
    try {
      const gl = document.createElement('canvas').getContext('webgl') || document.createElement('canvas').getContext('experimental-webgl');
      hasWebGL = !!gl;
    } catch (e) {}

    // Touch events (mobile info only)
    const isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;

    // Browser name + version
    let browserName = 'Unknown Browser';
    let browserVer  = '';
    let isOld = false;

    if (/Trident|MSIE/.test(ua)) {
      browserName = 'Internet Explorer'; isOld = true;
      issues.push({ icon: '🚫', title: 'Internet Explorer Detected', desc: 'IE is not supported. Please use a modern browser like Chrome, Firefox, Edge or Safari.' });
    } else if (/Edg\//.test(ua)) {
      browserName = 'Microsoft Edge';
      const m = ua.match(/Edg\/(\d+)/); browserVer = m ? m[1] : '';
      if (parseInt(browserVer) < 90) isOld = true;
    } else if (/Chrome\//.test(ua) && !/Chromium/.test(ua)) {
      browserName = 'Google Chrome';
      const m = ua.match(/Chrome\/(\d+)/); browserVer = m ? m[1] : '';
      if (parseInt(browserVer) < 80) isOld = true;
    } else if (/Firefox\//.test(ua)) {
      browserName = 'Mozilla Firefox';
      const m = ua.match(/Firefox\/(\d+)/); browserVer = m ? m[1] : '';
      if (parseInt(browserVer) < 75) isOld = true;
    } else if (/Safari\//.test(ua) && !/Chrome/.test(ua)) {
      browserName = 'Apple Safari';
      const m = ua.match(/Version\/(\d+)/); browserVer = m ? m[1] : '';
      if (parseInt(browserVer) < 13) isOld = true;
    } else if (/OPR\//.test(ua)) {
      browserName = 'Opera';
      const m = ua.match(/OPR\/(\d+)/); browserVer = m ? m[1] : '';
    }

    if (isOld && !issues.find(i => i.title.includes('Internet Explorer'))) {
      issues.push({ icon: '⚠️', title: 'Outdated Browser Version', desc: `${browserName} ${browserVer} is outdated. Please update to the latest version for the best experience.` });
    }

    return { issues, browserName, browserVer, hasCanvas, hasES6, hasWebGL, isTouch };
  }

  const result = detect();

  // No critical issues → let game load normally
  if (result.issues.length === 0) return;

  // ── BUILD UNSUPPORTED PAGE ────────────────────────────────────
  const recommended = [
    { name: 'Google Chrome',   icon: '🌐', url: 'https://www.google.com/chrome/',        label: 'Download Chrome'   },
    { name: 'Mozilla Firefox', icon: '🦊', url: 'https://www.mozilla.org/firefox/',       label: 'Download Firefox'  },
    { name: 'Microsoft Edge',  icon: '🔷', url: 'https://www.microsoft.com/edge',         label: 'Download Edge'     },
    { name: 'Apple Safari',    icon: '🧭', url: 'https://support.apple.com/downloads/safari', label: 'Update Safari' },
  ];

  const issueCards = result.issues.map(i => `
    <div class="bs-issue">
      <span class="bs-issue-icon">${i.icon}</span>
      <div>
        <div class="bs-issue-title">${i.title}</div>
        <div class="bs-issue-desc">${i.desc}</div>
      </div>
    </div>
  `).join('');

  const browserCards = recommended.map(b => `
    <a class="bs-browser-btn" href="${b.url}" target="_blank" rel="noopener">
      <span class="bs-browser-icon">${b.icon}</span>
      <span class="bs-browser-name">${b.name}</span>
      <span class="bs-browser-action">${b.label} →</span>
    </a>
  `).join('');

  const html = `
    <div id="bs-overlay">
      <div id="bs-box">
        <div id="bs-crown">♛</div>
        <h1 id="bs-title">ROYAL SNOOKER</h1>
        <div id="bs-subtitle">Championship Edition</div>
        <div class="bs-divider"></div>

        <div id="bs-headline">Browser Not Supported</div>
        <p id="bs-intro">
          Your current browser — <strong>${result.browserName}${result.browserVer ? ' ' + result.browserVer : ''}</strong> —
          does not meet the requirements to run this game. Please switch to one of the
          recommended browsers below for the full Royal Snooker experience.
        </p>

        <div id="bs-issues">${issueCards}</div>

        <div class="bs-section-label">Recommended Browsers</div>
        <div id="bs-browsers">${browserCards}</div>

        <div class="bs-divider"></div>
        <div id="bs-continue">
          <button id="bs-try-anyway">Try Anyway — I Understand the Risks</button>
        </div>

        <div id="bs-detected">
          Detected: ${result.browserName}${result.browserVer ? ' v' + result.browserVer : ''} ·
          Canvas: ${result.hasCanvas ? '✓' : '✗'} ·
          ES6: ${result.hasES6 ? '✓' : '✗'} ·
          WebGL: ${result.hasWebGL ? '✓' : '✗'} ·
          Touch: ${result.isTouch ? 'Yes' : 'No'}
        </div>
      </div>
    </div>

    <style>
      @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@900&family=Cinzel:wght@600&family=Cormorant+Garamond:ital,wght@1,400&display=swap');

      #bs-overlay {
        position: fixed; inset: 0; z-index: 99999;
        background: radial-gradient(ellipse at 50% 30%, #1a1206 0%, #0a0703 50%, #060402 100%);
        display: flex; align-items: center; justify-content: center;
        font-family: 'Cinzel', serif;
        overflow-y: auto;
        padding: 20px;
      }

      #bs-box {
        max-width: 640px; width: 100%;
        background: linear-gradient(160deg, #110e06, #1a1408, #0e0b04);
        border: 1px solid rgba(201,168,76,.25);
        padding: 44px 52px;
        position: relative;
        text-align: center;
        box-shadow: 0 0 80px rgba(0,0,0,.9), 0 0 0 1px rgba(201,168,76,.08) inset;
      }
      #bs-box::before {
        content: '';
        position: absolute; inset: 8px;
        border: 1px solid rgba(201,168,76,.07);
        pointer-events: none;
      }

      #bs-crown {
        font-size: 2.4rem;
        filter: drop-shadow(0 0 20px rgba(201,168,76,.6));
        margin-bottom: 10px;
      }

      #bs-title {
        font-family: 'Cinzel Decorative', cursive;
        font-size: 2.2rem; font-weight: 900;
        color: #f0d080;
        letter-spacing: 6px;
        text-shadow: 0 0 35px rgba(201,168,76,.45);
        margin: 0 0 4px;
        line-height: 1.1;
      }

      #bs-subtitle {
        font-family: 'Cormorant Garamond', serif;
        font-style: italic; font-size: .85rem;
        letter-spacing: 6px;
        color: rgba(201,168,76,.4);
        margin-bottom: 22px;
      }

      .bs-divider {
        height: 1px;
        background: linear-gradient(90deg, transparent, #c9a84c, transparent);
        margin: 20px 0;
      }

      #bs-headline {
        font-family: 'Cinzel', serif;
        font-size: 1.1rem; letter-spacing: 4px;
        color: #e74c3c;
        text-transform: uppercase;
        margin-bottom: 12px;
        text-shadow: 0 0 20px rgba(231,76,60,.4);
      }

      #bs-intro {
        font-family: 'Cormorant Garamond', serif;
        font-size: .95rem; line-height: 1.65;
        color: rgba(245,238,214,.55);
        margin-bottom: 22px;
      }
      #bs-intro strong {
        color: #c9a84c;
        font-style: italic;
      }

      #bs-issues {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-bottom: 24px;
        text-align: left;
      }
      .bs-issue {
        display: flex;
        align-items: flex-start;
        gap: 14px;
        background: rgba(231,76,60,.06);
        border: 1px solid rgba(231,76,60,.18);
        padding: 12px 14px;
      }
      .bs-issue-icon {
        font-size: 1.3rem;
        flex-shrink: 0;
        margin-top: 1px;
      }
      .bs-issue-title {
        font-family: 'Cinzel', serif;
        font-size: .6rem; letter-spacing: 2px;
        color: #e8a090;
        text-transform: uppercase;
        margin-bottom: 4px;
      }
      .bs-issue-desc {
        font-family: 'Cormorant Garamond', serif;
        font-size: .85rem; line-height: 1.5;
        color: rgba(245,238,214,.45);
      }

      .bs-section-label {
        font-family: 'Cormorant Garamond', serif;
        font-size: .6rem; letter-spacing: 5px;
        text-transform: uppercase;
        color: rgba(201,168,76,.35);
        margin-bottom: 12px;
      }

      #bs-browsers {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
        margin-bottom: 4px;
      }

      .bs-browser-btn {
        display: flex; flex-direction: column; align-items: center;
        gap: 5px;
        padding: 14px 10px;
        background: rgba(201,168,76,.04);
        border: 1px solid rgba(201,168,76,.15);
        text-decoration: none;
        transition: all .2s;
        cursor: pointer;
      }
      .bs-browser-btn:hover {
        background: rgba(201,168,76,.1);
        border-color: #c9a84c;
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(201,168,76,.2);
      }
      .bs-browser-icon { font-size: 1.6rem; }
      .bs-browser-name {
        font-family: 'Cinzel', serif;
        font-size: .58rem; letter-spacing: 2px;
        color: #c9a84c; text-transform: uppercase;
      }
      .bs-browser-action {
        font-family: 'Cormorant Garamond', serif;
        font-size: .75rem;
        color: rgba(245,238,214,.35);
      }

      #bs-continue { margin-top: 4px; }
      #bs-try-anyway {
        font-family: 'Cinzel', serif;
        font-size: .58rem; letter-spacing: 3px;
        text-transform: uppercase;
        color: rgba(245,238,214,.3);
        background: transparent;
        border: 1px solid rgba(245,238,214,.1);
        padding: 10px 24px;
        cursor: pointer;
        transition: all .2s;
      }
      #bs-try-anyway:hover {
        color: rgba(245,238,214,.6);
        border-color: rgba(245,238,214,.25);
      }

      #bs-detected {
        font-family: 'Cormorant Garamond', serif;
        font-style: italic; font-size: .65rem;
        letter-spacing: 1px;
        color: rgba(201,168,76,.2);
        margin-top: 18px;
      }

      /* Decorative corner flourishes */
      #bs-box::after {
        content: '✦';
        position: absolute; top: 14px; left: 50%;
        transform: translateX(-50%);
        color: rgba(201,168,76,.15);
        font-size: .7rem; letter-spacing: 20px;
        pointer-events: none;
      }

      @media (max-width: 520px) {
        #bs-box { padding: 30px 22px; }
        #bs-title { font-size: 1.5rem; letter-spacing: 4px; }
        #bs-browsers { grid-template-columns: 1fr; }
      }
    </style>
  `;

  // Inject overlay
  document.write(html);

  // "Try anyway" removes overlay and lets game continue
  document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('bs-try-anyway');
    if (btn) {
      btn.addEventListener('click', function () {
        const overlay = document.getElementById('bs-overlay');
        if (overlay) overlay.remove();
      });
    }
  });

})();
