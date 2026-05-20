function injectAimWidget() {

  // ── CSS ──────────────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    /* Widget hidden by default always */
    #mobileAimWidget {
      display: none;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      padding: 12px 14px 10px;
      background: rgba(6,4,2,.97);
      border: 1px solid rgba(201,168,76,.18);
      border-top: 2px solid rgba(201,168,76,.25);
      user-select: none;
      touch-action: none;
      width: 100%;
      max-width: 900px;
      margin: 0 auto;
      box-sizing: border-box;
    }

    /* ONLY show when .visible class is added AND on mobile/tablet */
    #mobileAimWidget.visible {
      display: flex !important;
    }

    /* Always hide on desktop regardless of .visible */
    @media (min-width: 1400px) {
      #mobileAimWidget.visible {
        display: none !important;
      }
    }

    .mawLabel {
      font-family: 'Cinzel', serif;
      font-size: .48rem; letter-spacing: 3px; text-transform: uppercase;
      color: rgba(201,168,76,.45);
    }

    #aimJoystick {
      width: 100%;
      max-width: 260px;
      height: 46px;
      background: rgba(201,168,76,.04);
      border: 1px solid rgba(201,168,76,.18);
      border-radius: 23px;
      position: relative;
      cursor: grab;
      overflow: hidden;
      touch-action: none;
    }
    #aimJoystick::before {
      content: '‹  drag to aim  ›';
      position: absolute; inset: 0;
      display: flex; align-items: center; justify-content: center;
      font-family: 'Cinzel', serif; font-size: .5rem; letter-spacing: 3px;
      color: rgba(201,168,76,.28); pointer-events: none;
    }
    #aimJoystickKnob {
      position: absolute; top: 5px;
      width: 36px; height: 36px; border-radius: 50%;
      background: linear-gradient(135deg,#c9a84c,#f0d080);
      box-shadow: 0 2px 10px rgba(201,168,76,.4);
      left: 50%;
      transform: translateX(-50%);
      transition: box-shadow .1s;
      pointer-events: none;
    }
    #aimJoystickKnob.active { box-shadow: 0 0 20px rgba(201,168,76,.8); }

    #mawPowerWrap {
      display: flex; align-items: center; gap: 12px; width: 100%;
    }
    #mawPowerTrack {
      flex: 1; height: 8px;
      background: rgba(0,0,0,.6);
      border: 1px solid rgba(201,168,76,.12);
      border-radius: 4px; overflow: hidden;
    }
    #mawPowerFill {
      height: 100%; width: 0%;
      background: linear-gradient(90deg,#2ecc71 0%,#f1c40f 55%,#e74c3c 100%);
      border-radius: 4px;
      transition: none;
    }
    #mawFireBtn {
      font-family: 'Cinzel', serif; font-size: .55rem; letter-spacing: 2px;
      text-transform: uppercase; color: #080502;
      background: linear-gradient(135deg,#c9a84c,#f0d080,#c9a84c);
      border: none; padding: 10px 20px; cursor: pointer;
      white-space: nowrap;
      box-shadow: 0 3px 14px rgba(201,168,76,.35);
      transition: transform .1s, box-shadow .1s;
      touch-action: none;
    }
    #mawFireBtn:active { transform: scale(.95); box-shadow: 0 1px 6px rgba(201,168,76,.2); }

    #mawNudge { display: flex; gap: 8px; }
    .mawNudgeBtn {
      font-family: 'Cinzel', serif; font-size: .7rem;
      color: rgba(201,168,76,.65);
      background: rgba(201,168,76,.05);
      border: 1px solid rgba(201,168,76,.15);
      padding: 7px 16px; cursor: pointer;
      transition: all .15s;
      touch-action: none;
    }
    .mawNudgeBtn:active { background: rgba(201,168,76,.16); color: #f0d080; }
  `;
  document.head.appendChild(style);

  // ── HTML ─────────────────────────────────────────────────────
  const widget = document.createElement('div');
  widget.id = 'mobileAimWidget';

  // Label
  const label = document.createElement('div');
  label.className = 'mawLabel';
  label.textContent = 'Drag Cue Control';

  // Joystick
  const joystick = document.createElement('div');
  joystick.id = 'aimJoystick';

  const knob = document.createElement('div');
  knob.id = 'aimJoystickKnob';
  joystick.appendChild(knob);

  // Power section
  const powerWrap = document.createElement('div');
  powerWrap.id = 'mawPowerWrap';

  const powerTrack = document.createElement('div');
  powerTrack.id = 'mawPowerTrack';

  const powerFill = document.createElement('div');
  powerFill.id = 'mawPowerFill';

  powerTrack.appendChild(powerFill);

  const fireBtn = document.createElement('button');
  fireBtn.id = 'mawFireBtn';
  fireBtn.textContent = '● SHOOT';

  // Nudge controls
  const nudge = document.createElement('div');
  nudge.id = 'mawNudge';

  const nudgeL = document.createElement('button');
  nudgeL.className = 'mawNudgeBtn';
  nudgeL.id = 'mawNudgeL';
  nudgeL.textContent = '◂ Fine';

  const nudgeR = document.createElement('button');
  nudgeR.className = 'mawNudgeBtn';
  nudgeR.id = 'mawNudgeR';
  nudgeR.textContent = 'Fine ▸';

  // Assemble
  powerWrap.appendChild(powerTrack);
  powerWrap.appendChild(fireBtn);

  nudge.appendChild(nudgeL);
  nudge.appendChild(nudgeR);

  widget.appendChild(label);
  widget.appendChild(joystick);
  widget.appendChild(powerWrap);
  widget.appendChild(nudge);
  // ── INSERT: directly after #tableWrap (below the table) ──────
  const tableWrap = document.getElementById('tableWrap');
  if (tableWrap && tableWrap.parentNode) {
    tableWrap.parentNode.insertBefore(widget, tableWrap.nextSibling);
  } else {
    document.body.appendChild(widget);
  }

  // ── SHOW WIDGET ON GAME START ─────────────────────────────────
  const _origSG = window.startGame;
  window.startGame = function() {
    if (typeof _origSG === 'function') _origSG.apply(this, arguments);
    widget.classList.add('visible');
  };

  // ── DOM REFS ──────────────────────────────────────────────────
  const joysticke  = document.getElementById('aimJoystick');
  const knobe      = document.getElementById('aimJoystickKnob');
  const powerFille = document.getElementById('mawPowerFill');
  const fireBtne   = document.getElementById('mawFireBtn');
  const nudgeLe    = document.getElementById('mawNudgeL');
  const nudgeRe    = document.getElementById('mawNudgeR');

  const AIM_SENS = 0.008;

  // ── JOYSTICK STATE ────────────────────────────────────────────
  let jsActive = false, jsPrevX = 0, jsKnobOffset = 0;

  function getJoystickHalf() {
    const jw = joysticke.offsetWidth || 260;
    return (jw - 36) / 2;
  }

  function updateKnob(offset) {
    const half = getJoystickHalf();
    jsKnobOffset = Math.max(-half, Math.min(half, offset));
    const jw = joysticke.offsetWidth || 260;
    knobe.style.left = (jw / 2 + jsKnobOffset) + 'px';
    knobe.style.transform = 'translateX(-50%)';
  }

  function jsStart(clientX) {
    if (phase !== 'aiming' || !cue || !cue.onTable || isAI()) return;
    jsActive = true;
    jsPrevX  = clientX;
    jsKnobOffset = 0;
    knobe.classList.add('active');
  }

  function jsMove(clientX) {
    if (!jsActive) return;
    const delta = clientX - jsPrevX;
    jsPrevX = clientX;
    lockAng  += delta * AIM_SENS;
    aimLocked = true;
    updateKnob(jsKnobOffset + delta * 0.5);
  }

  function jsEnd() {
    if (!jsActive) return;
    jsActive = false;
    knobe.classList.remove('active');
    knobe.style.transition = 'left .25s ease';
    updateKnob(0);
    setTimeout(() => { knobe.style.transition = ''; }, 260);
  }

  joysticke.addEventListener('mousedown',  e => { e.preventDefault(); jsStart(e.clientX); });
  window.addEventListener('mousemove',   e => { if (jsActive) { e.preventDefault(); jsMove(e.clientX); } });
  window.addEventListener('mouseup',     () => jsEnd());

  joysticke.addEventListener('touchstart', e => { e.preventDefault(); jsStart(e.touches[0].clientX); }, { passive: false });
  joysticke.addEventListener('touchmove',  e => { e.preventDefault(); jsMove(e.touches[0].clientX); }, { passive: false });
  joysticke.addEventListener('touchend',   e => { e.preventDefault(); jsEnd(); },                       { passive: false });

  // ── NUDGE BUTTONS ─────────────────────────────────────────────
  let nudgeInterval = null;

  function applyNudge(dir) {
    if (phase !== 'aiming' || isAI()) return;
    lockAng += dir * 0.012;
    aimLocked = true;
  }

  function startNudge(dir, e) {
    e.preventDefault();
    applyNudge(dir);
    nudgeInterval = setInterval(() => applyNudge(dir), 80);
  }

  function stopNudge() {
    clearInterval(nudgeInterval);
    nudgeInterval = null;
  }

  nudgeLe.addEventListener('pointerdown', e => startNudge(-1, e));
  nudgeRe.addEventListener('pointerdown', e => startNudge(+1, e));
  window.addEventListener('pointerup', stopNudge);

  // ── FIRE BUTTON ───────────────────────────────────────────────
  let fireCharging = false;

  function fireDown(e) {
    e.preventDefault();
    if (phase !== 'aiming' || !cue || !cue.onTable || isAI()) return;
    fireCharging = true;
    charging     = true;
    chStart      = Date.now();
    power        = 0;
  }

  function fireUp(e) {
    if (!fireCharging) return;
    e.preventDefault();
    fireCharging = false;
    charging     = false;
    const finalPower = Math.min((Date.now() - chStart) / 1000, 1);
    if (finalPower > 0.02) shoot(lockAng, finalPower);
    power = 0;
    aimLocked = false;
    powerFille.style.width = '0%';
  }

  fireBtne.addEventListener('mousedown',  fireDown);
  fireBtne.addEventListener('touchstart', fireDown, { passive: false });
  window.addEventListener('mouseup',  fireUp);
  window.addEventListener('touchend', fireUp, { passive: false });

  // ── Power bar sync loop ───────────────────────────────────────
  (function powerBarLoop() {
    if (fireCharging || charging) {
      const p = Math.min((Date.now() - chStart) / 1000, 1);
      powerFille.style.width = (p * 100) + '%';
    } else {
      powerFille.style.width = (power * 100) + '%';
    }

    const inBIH = (typeof bihMode !== 'undefined') ? bihMode : false;
    widget.style.opacity       = inBIH ? '0.3' : '1';
    widget.style.pointerEvents = inBIH ? 'none' : '';

    requestAnimationFrame(powerBarLoop);
  })();
}

injectAimWidget();
