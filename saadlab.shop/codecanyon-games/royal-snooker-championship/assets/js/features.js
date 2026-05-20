/* ============================================================
   ROYAL SNOOKER — FEATURES v2 (features.js)
   Loaded AFTER script.js and enhancements.js.
   Pure extensions — nothing existing is removed or replaced.
   ============================================================ */

// ════════════════════════════════════════════════════════════
// 1. SHOT HISTORY LOG
//    Replaces the plain "Status" section with a rich log.
// ════════════════════════════════════════════════════════════

const BCOLORS = {
  white:'#f5eed6', red:'#c0392b', yellow:'#f1c40f', green:'#27ae60',
  brown:'#7b4f33', blue:'#2471a3', pink:'#e91e9a', black:'#1a1a1a',
};

let shotHistory = [];      // { type:'ok'|'foul'|'miss', text, pts, dotCol }
const MAX_HISTORY = 12;

function logShot(type, text, pts, dotCol) {
  shotHistory.unshift({ type, text, pts: pts || 0, dotCol: dotCol || '#c9a84c' });
  if (shotHistory.length > MAX_HISTORY) shotHistory.length = MAX_HISTORY;
  renderShotLog();
}

function renderShotLog() {
  const list = document.getElementById('shotLogList');
  if (!list) return;

  // Clear existing content safely
  list.textContent = '';

  // Empty state
  if (shotHistory.length === 0) {
    const emptyDiv = document.createElement('div');
    emptyDiv.className = 'slEmpty';
    emptyDiv.textContent = 'No shots yet…';
    list.appendChild(emptyDiv);
    return;
  }

  // Render entries safely
  shotHistory.forEach(e => {
    const entry = document.createElement('div');
    entry.className = `slEntry ${e.type || ''}`;

    const dot = document.createElement('div');
    dot.className = 'slDot';
    dot.style.background = e.dotCol || '#fff';

    const text = document.createElement('div');
    text.className = `slText ${e.type || ''}`;
    text.textContent = e.text || '';

    entry.appendChild(dot);
    entry.appendChild(text);

    if (e.pts) {
      const pts = document.createElement('div');
      pts.className = `slPts ${e.type || ''}`;
      pts.textContent = `+${e.pts}`;
      entry.appendChild(pts);
    }

    list.appendChild(entry);
  });
}
// Patch judgeShot to feed log entries
const _origJudgeShot = judgeShot;
window.judgeShot = function() {
  const pt = pottedThisTurn.slice();
  const wIn = pt.includes('white');
  const reds = pt.filter(id => { const b=balls.find(x=>x.id===id); return b&&b.kind==='red'; });
  const cols = pt.filter(id => { const b=balls.find(x=>x.id===id); return b&&b.kind!=='red'&&b.kind!=='white'; });
  const pName = curP === 0
    ? (document.getElementById('p1name').textContent)
    : (document.getElementById('p2name').textContent.replace(/\s*<[^>]*>/g,'').trim());

  _origJudgeShot();

  // Determine what happened and log it
  setTimeout(() => {
    if (wIn) {
      logShot('foul', `${pName} — cue ball`, 4, '#e55');
    } else if (reds.length > 0 && !wIn) {
      const pts = reds.length;
      logShot('ok', `${pName} — ${pts} red${pts>1?'s':''}`, pts, '#c0392b');
    } else if (cols.length > 0 && !wIn) {
      const b = balls.find(x => x.id === cols[0]);
      if (b) {
        logShot('ok', `${pName} — ${b.kind}`, b.pts, b.col);
      }
    } else {
      logShot('miss', `${pName} — no pot`, 0, 'rgba(201,168,76,.3)');
    }
  }, 200);
};

// ════════════════════════════════════════════════════════════
// 2. BALL-IN-HAND — drag cue ball freely inside the D
//    Activates whenever cue ball was potted (wIn foul).
// ════════════════════════════════════════════════════════════

let _bihActive = false;
let _bihPreviewX = FX + PW * 0.22;
let _bihPreviewY = FY + PH / 2;

// D zone geometry (matches script.js baulk line)
const _bX   = FX + PW * 0.44;
const _dRad  = PH * 0.18;

function isInD(x, y) {
  // Left half of the D arc + must be left of baulk line
  if (x > _bX) return false;
  const dx = x - _bX, dy = y - (FY + PH / 2);
  return (dx * dx + dy * dy) <= _dRad * _dRad;
}

function startBallInHand() {
  _bihActive = true;
  _bihPreviewX = FX + PW * 0.22;
  _bihPreviewY = FY + PH / 2;
  const wrap = document.getElementById('tableWrap');
  if (wrap) wrap.style.cursor = 'crosshair';
  const banner = document.getElementById('bihBanner');
  if (banner) banner.classList.add('active');
  updateUI('<span class="bih-hint">🎱 Place cue ball in D</span>');
}

function placeBallInHand(x, y) {
  // Clamp to D, or nearest valid point
  let px = x, py = y;
  if (!isInD(px, py)) {
    // Find nearest point on D boundary
    const dy2 = py - (FY + PH / 2);
    const maxX = _bX - Math.sqrt(Math.max(0, _dRad * _dRad - dy2 * dy2));
    px = Math.max(FX + R + 2, Math.min(_bX, x < _bX ? x : maxX));
    py = Math.max(FY + R + 2, Math.min(FY + PH - R - 2, py));
    if (!isInD(px, py)) {
      px = FX + PW * 0.22;
      py = FY + PH / 2;
    }
  }
  // Check no overlap with other balls
  const overlap = balls.some(b => b !== cue && b.onTable && Math.hypot(b.x - px, b.y - py) < R * 2.2);
  if (overlap) return false;
  return { x: px, y: py };
}

function commitBallInHand(x, y) {
  const pos = placeBallInHand(x, y);
  if (!pos) return;
  cue.x = pos.x;
  cue.y = pos.y;
  cue.vx = 0; cue.vy = 0;
  cue.onTable = true;
  _bihActive = false;
  const wrap = document.getElementById('tableWrap');
  if (wrap) wrap.style.cursor = '';
  const banner = document.getElementById('bihBanner');
  if (banner) banner.classList.remove('active');
  updateUI(isAI() ? '<span class="ai">🔥 AI\'s turn…</span>' : 'Your turn — aim & shoot');
  if (isAI()) triggerAI();
}

// Mouse events on canvas for BIH
canvas.addEventListener('mousemove', e => {
  if (!_bihActive) return;
  const coords = getCanvasCoords(e.clientX, e.clientY);
  _bihPreviewX = coords.x;
  _bihPreviewY = coords.y;
}, { capture: false });

canvas.addEventListener('click', e => {
  if (!_bihActive) return;
  const coords = getCanvasCoords(e.clientX, e.clientY);
  commitBallInHand(coords.x, coords.y);
}, { capture: false });

canvas.addEventListener('touchstart', e => {
  if (!_bihActive) return;
  e.preventDefault();
  const t = e.touches[0];
  const coords = getCanvasCoords(t.clientX, t.clientY);
  _bihPreviewX = coords.x;
  _bihPreviewY = coords.y;
}, { capture: false });

canvas.addEventListener('touchend', e => {
  if (!_bihActive) return;
  e.preventDefault();
  const t = e.changedTouches[0];
  const coords = getCanvasCoords(t.clientX, t.clientY);
  commitBallInHand(coords.x, coords.y);
}, { capture: false });

// Draw BIH preview in game loop — patch gameLoop-adjacent drawing
const _origDrawBall = typeof drawBall === 'function' ? drawBall : null;

// We hook into the requestAnimationFrame cycle by patching the post-draw
// The cleanest hook point is overriding the last part of gameLoop's draw call
const _origGameLoop = gameLoop;
window.gameLoop = function(now) {
  _origGameLoop(now);
};

// Additional canvas draw pass — injected via a secondary rAF after main loop
let _extraDrawScheduled = false;
function scheduleExtraDraw() {
  if (_extraDrawScheduled) return;
  _extraDrawScheduled = true;
  requestAnimationFrame(() => {
    _extraDrawScheduled = false;
    drawExtraLayer();
    scheduleExtraDraw();
  });
}

function drawExtraLayer() {
  if (_bihActive) drawBIHPreview();
  drawChargeGlow();
}

function drawBIHPreview() {
  const pos = placeBallInHand(_bihPreviewX, _bihPreviewY);
  const px = pos ? pos.x : _bihPreviewX;
  const py = pos ? pos.y : _bihPreviewY;
  const valid = !!pos;

  ctx.save();
  // D zone highlight
  ctx.beginPath();
  ctx.arc(_bX, FY + PH / 2, _dRad, -Math.PI / 2, Math.PI / 2, true);
  ctx.lineTo(_bX, FY + PH / 2 - _dRad);
  ctx.strokeStyle = valid ? 'rgba(110,240,160,.35)' : 'rgba(230,100,100,.3)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([6, 4]);
  ctx.stroke();
  ctx.setLineDash([]);

  // Preview ball
  ctx.globalAlpha = valid ? .75 : .35;
  ctx.shadowColor = valid ? 'rgba(110,240,160,.5)' : 'rgba(230,100,100,.4)';
  ctx.shadowBlur = 14;
  const bg = ctx.createRadialGradient(px - R*.3, py - R*.33, R*.04, px + R*.1, py + R*.1, R*1.05);
  bg.addColorStop(0, '#ffffff');
  bg.addColorStop(.4, '#f5eed6');
  bg.addColorStop(1, '#c8bfa2');
  ctx.beginPath(); ctx.arc(px, py, R, 0, Math.PI*2);
  ctx.fillStyle = bg; ctx.fill();

  // Border ring
  ctx.globalAlpha = valid ? .6 : .3;
  ctx.beginPath(); ctx.arc(px, py, R + 3, 0, Math.PI*2);
  ctx.strokeStyle = valid ? 'rgba(110,240,160,.8)' : 'rgba(230,100,100,.8)';
  ctx.lineWidth = 1.5; ctx.stroke();

  ctx.restore();
}

// Patch placeInD to trigger BIH instead (activated after a cue-ball foul)
const _origPlaceInD = placeInD;
window.placeInD = function() {
  // We don't auto-place — we start the BIH mode
  // But we still mark cue onTable=false to prevent aiming
  cue.onTable = false;
  cue.vx = 0; cue.vy = 0;
  // BIH will be started by the judgeShot patch below
};

// Intercept the foul path: after judgeShot resolves a cue-ball pot, start BIH
const _origJudgeShot2 = window.judgeShot;
window.judgeShot = function() {
  const hadCueIn = pottedThisTurn.includes('white');
  _origJudgeShot2();
  if (hadCueIn && !isAI()) {
    setTimeout(startBallInHand, 300);
  } else if (hadCueIn && isAI()) {
    // AI auto-places in center D
    setTimeout(() => {
      cue.x = FX + PW * 0.22;
      cue.y = FY + PH / 2;
      cue.onTable = true;
    }, 400);
  }
};

// ════════════════════════════════════════════════════════════
// 3. STATS MODAL
// ════════════════════════════════════════════════════════════

const frameStats = {
  shots:      [0, 0],
  pots:       [0, 0],
  fouls:      [0, 0],
  highBreak:  [0, 0],
  redsPotted: [0, 0],
  colsPotted: [0, 0],
  _curBreak:  [0, 0],
};

function resetStats() {
  Object.assign(frameStats, {
    shots:      [0, 0],
    pots:       [0, 0],
    fouls:      [0, 0],
    highBreak:  [0, 0],
    redsPotted: [0, 0],
    colsPotted: [0, 0],
    _curBreak:  [0, 0],
  });
}

// Track stats via shoot patch
const _origShoot = shoot;
window.shoot = function(ang, pwr) {
  frameStats.shots[curP]++;
  _origShoot(ang, pwr);
};

// Track pot/foul stats — integrated into the judgeShot chain
const _judgeStatsBase = window.judgeShot;
window.judgeShot = function() {
  const pt = pottedThisTurn.slice();
  const wIn = pt.includes('white');
  const reds = pt.filter(id => { const b=balls.find(x=>x.id===id); return b&&b.kind==='red'; });
  const cols = pt.filter(id => { const b=balls.find(x=>x.id===id); return b&&b.kind!=='red'&&b.kind!=='white'; });
  const p = curP;

  _judgeStatsBase();

  if (wIn) {
    frameStats.fouls[p]++;
    frameStats._curBreak[p] = 0;
  } else if (reds.length > 0) {
    frameStats.pots[p]++;
    frameStats.redsPotted[p] += reds.length;
    frameStats._curBreak[p] += reds.length;
    frameStats.highBreak[p] = Math.max(frameStats.highBreak[p], frameStats._curBreak[p]);
  } else if (cols.length > 0) {
    const b = balls.find(x => x.id === cols[0]);
    if (b) {
      frameStats.pots[p]++;
      frameStats.colsPotted[p]++;
      frameStats._curBreak[p] += b.pts;
      frameStats.highBreak[p] = Math.max(frameStats.highBreak[p], frameStats._curBreak[p]);
    }
  } else {
    frameStats._curBreak[p] = 0;
  }
};

function openStatsModal() {
  const p1 = document.getElementById('p1name').textContent || '';
  const p2 = document.getElementById('p2name').textContent || '';

  const s0 = scores[0], s1 = scores[1];
  const totalShots = (frameStats.shots[0] + frameStats.shots[1]) || 1;

  const statsBox = document.getElementById('statsBox');
  statsBox.textContent = ''; // clear safely

  // Close button
  const closeBtn = document.createElement('button');
  closeBtn.className = 'statsClose';
  closeBtn.textContent = '✕ Close';
  closeBtn.onclick = closeStatsModal;

  // Title
  const title = document.createElement('div');
  title.className = 'statsTitle';
  title.textContent = '♟ Frame Statistics';

  statsBox.appendChild(closeBtn);
  statsBox.appendChild(title);

  // Helper for stat cards
  function createCard(value, label) {
    const card = document.createElement('div');
    card.className = 'statCard';

    const val = document.createElement('div');
    val.className = 'statVal';
    val.textContent = value;

    const lbl = document.createElement('div');
    lbl.className = 'statLbl';
    lbl.textContent = label;

    card.appendChild(val);
    card.appendChild(lbl);
    return card;
  }

  // Grid
  const grid = document.createElement('div');
  grid.className = 'statsGrid';

  grid.appendChild(createCard(frameStats.shots[0] + frameStats.shots[1], 'Total Shots'));
  grid.appendChild(createCard(frameStats.pots[0] + frameStats.pots[1], 'Total Pots'));
  grid.appendChild(createCard(frameStats.fouls[0] + frameStats.fouls[1], 'Total Fouls'));

  const potRate = Math.round((frameStats.pots[0] + frameStats.pots[1]) / totalShots * 100);
  grid.appendChild(createCard(potRate + '%', 'Pot Rate'));

  statsBox.appendChild(grid);

  // Helper for player stats
  function createPlayerCol(name, i, score) {
    const col = document.createElement('div');
    col.className = 'statsPlayerCol';

    const nameEl = document.createElement('div');
    nameEl.className = 'spName';
    nameEl.textContent = name;

    col.appendChild(nameEl);

    function stat(label, value) {
      const row = document.createElement('div');
      row.className = 'spStat';

      const lbl = document.createElement('span');
      lbl.className = 'spStatLbl';
      lbl.textContent = label;

      const val = document.createElement('span');
      val.className = 'spStatVal';
      val.textContent = value;

      row.appendChild(lbl);
      row.appendChild(val);
      col.appendChild(row);
    }

    stat('Score', score);
    stat('Shots', frameStats.shots[i]);
    stat('Pots', frameStats.pots[i]);
    stat('Fouls', frameStats.fouls[i]);
    stat('Reds', frameStats.redsPotted[i]);
    stat('Colours', frameStats.colsPotted[i]);
    stat('High Break', frameStats.highBreak[i]);

    return col;
  }

  // Player row
  const playerRow = document.createElement('div');
  playerRow.className = 'statsPlayerRow';

  const col1 = createPlayerCol(p1, 0, s0);
  const divider = document.createElement('div');
  divider.className = 'statsPlayerDivider';
  const col2 = createPlayerCol(p2, 1, s1);

  playerRow.appendChild(col1);
  playerRow.appendChild(divider);
  playerRow.appendChild(col2);

  statsBox.appendChild(playerRow);

  document.getElementById('statsModal').classList.add('open');
}

function closeStatsModal() {
  document.getElementById('statsModal').classList.remove('open');
}

// Reset stats on new frame
const _origInitGame = initGame;
window.initGame = function() {
  _origInitGame();
  resetStats();
  shotHistory = [];
  renderShotLog();
};

// ════════════════════════════════════════════════════════════
// 4. SOUND CONTROLS — volume slider + mute toggle
// ════════════════════════════════════════════════════════════

let _masterVolume = 1.0;
let _muted = false;
let _masterGain = null;

function getMasterGain() {
  if (_masterGain) return _masterGain;
  try {
    const a = getAC();
    _masterGain = a.createGain();
    _masterGain.gain.value = _muted ? 0 : _masterVolume;
    _masterGain.connect(a.destination);
  } catch(e) {}
  return _masterGain;
}

// Patch all play functions to route through master gain
const _origPlayNoise = playNoise;
window.playNoise = function(dur, freq, gain, decay) {
  if (_muted) return;
  try {
    const a = getAC();
    const buf = a.createBuffer(1, ~~(a.sampleRate * dur), a.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++)
      d[i] = (Math.random()*2-1) * Math.exp(-i/(a.sampleRate*decay));
    const s = a.createBufferSource(); s.buffer = buf;
    const f = a.createBiquadFilter(); f.type='bandpass'; f.frequency.value=freq; f.Q.value=1;
    const g = a.createGain(); g.gain.value = gain * _masterVolume;
    s.connect(f); f.connect(g); g.connect(a.destination);
    s.start();
  } catch(e) {}
};

const _origPlayTone = playTone;
window.playTone = function(freq, dur, gain) {
  if (_muted) return;
  try {
    const a = getAC(), o = a.createOscillator(), g = a.createGain();
    o.frequency.value = freq;
    g.gain.setValueAtTime(gain * _masterVolume, a.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, a.currentTime + dur);
    o.connect(g); g.connect(a.destination);
    o.start(); o.stop(a.currentTime + dur);
  } catch(e) {}
};

function toggleMute() {
  _muted = !_muted;
  const btn = document.getElementById('soundToggleBtn');
  if (btn) {
    btn.textContent = _muted ? '🔇' : '🔊';
    btn.classList.toggle('muted', _muted);
  }
}

function setVolume(v) {
  _masterVolume = parseFloat(v);
  const fill = document.getElementById('volFill');
  if (fill) fill.style.width = (_masterVolume * 100) + '%';
}

// ════════════════════════════════════════════════════════════
// 5. CHARGE GLOW — animated ring on cue ball while charging
// ════════════════════════════════════════════════════════════

function drawChargeGlow() {
  if (!charging || power < 0.05 || !cue || !cue.onTable) return;
  ctx.save();
  const p = power;
  const rings = 3;
  for (let i = 0; i < rings; i++) {
    const prog = (p + i * 0.33) % 1;
    const radius = R + 4 + prog * 28;
    const alpha = (1 - prog) * p * 0.55;
    const hue = p < 0.5 ? `rgba(100,220,255,${alpha})` : `rgba(255,${Math.round(220*(1-p)+80*p)},${Math.round(100*(1-p))},${alpha})`;
    ctx.beginPath();
    ctx.arc(cue.x, cue.y, radius, 0, Math.PI * 2);
    ctx.strokeStyle = hue;
    ctx.lineWidth = 2.5 * (1 - prog);
    ctx.stroke();
  }
  // Inner glow
  const ig = ctx.createRadialGradient(cue.x, cue.y, R * 0.5, cue.x, cue.y, R * 2.5);
  ig.addColorStop(0, `rgba(180,240,255,${p * 0.25})`);
  ig.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.beginPath(); ctx.arc(cue.x, cue.y, R * 2.5, 0, Math.PI * 2);
  ctx.fillStyle = ig; ctx.fill();
  ctx.restore();
}

// ════════════════════════════════════════════════════════════
// 6. FLASH EFFECT — screen edge flash on foul/pot
// ════════════════════════════════════════════════════════════

function flashScreen(color, duration) {
  const el = document.getElementById('flashOverlay');
  if (!el) return;
  el.style.transition = 'none';
  el.style.background = color;
  el.style.opacity = '1';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.style.transition = `opacity ${duration}ms ease-out`;
      el.style.opacity = '0';
    });
  });
}

// Patch judgeShot to trigger flashes — final layer in the chain
const _judgeFlashBase = window.judgeShot;
window.judgeShot = function() {
  const pt = pottedThisTurn.slice();
  const wIn = pt.includes('white');
  const reds = pt.filter(id => { const b=balls.find(x=>x.id===id); return b&&b.kind==='red'; });
  const cols = pt.filter(id => { const b=balls.find(x=>x.id===id); return b&&b.kind!=='red'&&b.kind!=='white'; });

  _judgeFlashBase();

  if (wIn) {
    flashScreen('radial-gradient(ellipse at 50% 50%, rgba(200,30,30,0) 40%, rgba(200,30,30,.5) 100%)', 900);
  } else if (reds.length > 0 || cols.length > 0) {
    flashScreen('radial-gradient(ellipse at 50% 50%, rgba(50,200,100,0) 40%, rgba(50,200,100,.3) 100%)', 600);
  }
};

// ════════════════════════════════════════════════════════════
// DOM INJECTION — runs once on DOMContentLoaded
// ════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {

  // ── Sound Controls: inject into LEFT panel before spinGrid section
  const spinSec = document.getElementById('spinGrid')?.closest('.sec');
  if (spinSec) {
    const soundDiv = document.createElement('div');
    soundDiv.id = 'soundControls';

    const btn = document.createElement('button');
    btn.id = 'soundToggleBtn';
    btn.className = 'soundToggle';
    btn.title = 'Toggle sound';
    btn.textContent = '🔊';
    btn.addEventListener('click', toggleMute);

    const wrap = document.createElement('div');
    wrap.className = 'volSliderWrap';

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.className = 'volSlider';
    slider.id = 'volSlider';
    slider.min = '0';
    slider.max = '1';
    slider.step = '0.05';
    slider.value = '1';
    slider.title = 'Volume';

    slider.addEventListener('input', function () {
      setVolume(this.value);
    });

    wrap.appendChild(slider);

    const label = document.createElement('span');
    label.className = 'volLbl';
    label.textContent = 'VOL';

    soundDiv.appendChild(btn);
    soundDiv.appendChild(wrap);
    soundDiv.appendChild(label);

    spinSec.parentNode.insertBefore(soundDiv, spinSec);
  }

  // ── Flash overlay
  const flash = document.createElement('div');
  flash.id = 'flashOverlay';
  document.body.appendChild(flash);

  // ── BIH Banner (lives inside tableWrap)
  const tableWrap = document.getElementById('tableWrap');
  if (tableWrap) {
    tableWrap.style.position = 'relative';
    const bihBanner = document.createElement('div');
    bihBanner.id = 'bihBanner';
    bihBanner.textContent = '🎱 Click inside the D to place cue ball';
    tableWrap.appendChild(bihBanner);
  }

  // ── Stats modal (body level)
  const statsModal = document.createElement('div');
  statsModal.id = 'statsModal';

  // Create statsBox safely
  const statsBox = document.createElement('div');
  statsBox.id = 'statsBox';
  statsModal.appendChild(statsBox);

  // Close on backdrop click
  statsModal.addEventListener('click', function (e) {
    if (e.target === statsModal) closeStatsModal();
  });

  document.body.appendChild(statsModal);


  // ── Stats button in game controls bar
  const gcBar = document.getElementById('gameControls');

  if (gcBar) {
    const sep = document.createElement('div');
    sep.className = 'gcBtn-sep';

    const btn = document.createElement('button');
    btn.className = 'gcBtn stats-btn';
    btn.textContent = '📊 Stats';
    btn.addEventListener('click', openStatsModal);

    gcBar.insertBefore(sep, gcBar.firstChild);
    gcBar.insertBefore(btn, gcBar.firstChild);
  }

  // Start extra draw loop
  scheduleExtraDraw();
});
