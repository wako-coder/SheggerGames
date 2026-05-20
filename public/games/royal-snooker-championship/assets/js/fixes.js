/* ============================================================
   ROYAL SNOOKER — fixes.js  (v2 — full rewrite)
   Loaded last (after features.js). Fixes all reported issues.
   ============================================================

   FIX 1 — AI continues during any open modal / popup / pause
   FIX 2 — White ball / foul handling (full BIH rebuild, no freeze)
   FIX 3 — AI never overrides player cue ball placement
   FIX 4 — User spin disabled during AI turn
   FIX 5 — Wrong-colour foul fires on correct ball in final phase
   FIX 6 — Physics: cushion restitution, friction, tunneling
   ============================================================ */

// ════════════════════════════════════════════════════════════
// SHARED UTILITY — is any blocking UI open?
// ════════════════════════════════════════════════════════════
function isUIBlocking() {
  if (typeof _isPaused !== 'undefined' && _isPaused) return true;
  if (document.querySelector('.rsPopupBackdrop')) return true;
  const sm = document.getElementById('statsModal');
  if (sm && sm.classList.contains('open')) return true;
  if (document.getElementById('frameEndPopup')) return true;
  return false;
}

// ════════════════════════════════════════════════════════════
// FIX 4 — DISABLE SPIN BUTTONS DURING AI TURN
// ════════════════════════════════════════════════════════════

// Replace all spin button listeners with guarded versions
document.querySelectorAll('.sb').forEach(b => {
  const fresh = b.cloneNode(true);
  b.parentNode.replaceChild(fresh, b);
  fresh.addEventListener('click', () => {
    if (isAI() || aiOn || phase !== 'aiming') return;
    document.querySelectorAll('.sb').forEach(x => x.classList.remove('on'));
    fresh.classList.add('on');
    const M = {
      tl:{x:-1,y:-1}, t:{x:0,y:-1}, tr:{x:1,y:-1},
      l:{x:-1,y:0},   c:{x:0,y:0},  r:{x:1,y:0},
      bl:{x:-1,y:1},  b:{x:0,y:1},  br:{x:1,y:1},
    };
    spin = M[fresh.dataset.s] || {x:0,y:0};
  });
});

const _spinGrid = document.getElementById('spinGrid');
function syncSpinGridState() {
  if (_spinGrid) {
    const blocked = isAI() || aiOn;
    _spinGrid.style.pointerEvents = blocked ? 'none' : '';
    _spinGrid.style.opacity = blocked ? '0.35' : '';
  }
}

// ════════════════════════════════════════════════════════════
// ADDENDUM — resumeGame re-triggers AI if needed
// ════════════════════════════════════════════════════════════
const _origResumeGame = typeof resumeGame === 'function' ? resumeGame : null;
window.resumeGame = function() {
  if (_origResumeGame) _origResumeGame();
  else {
    _isPaused = false;
    document.getElementById('pauseScreen')?.classList.remove('active');
  }
  setTimeout(() => {
    if (phase === 'aiming' && isAI()) { aiOn = true; triggerAI(); }
  }, 150);
};

// ════════════════════════════════════════════════════════════
// FIX 1 — AI BLOCKED BY ANY OPEN MODAL
// ════════════════════════════════════════════════════════════
const _origTriggerAI = triggerAI;
window.triggerAI = function() {
  if (isUIBlocking()) {
    const poll = setInterval(() => {
      if (!isUIBlocking() && phase === 'aiming' && isAI()) { clearInterval(poll); _origTriggerAI(); }
      else if (phase !== 'aiming') clearInterval(poll);
    }, 120);
    return;
  }
  _origTriggerAI();
};

const _origAiSwingAndFire = aiSwingAndFire;
window.aiSwingAndFire = function(shot) {
  if (isUIBlocking() || phase !== 'aiming') { aiOn = false; return; }
  _origAiSwingAndFire(shot);
};

const _origChargeAndFire = chargeAndFire;
window.chargeAndFire = function(shot) {
  if (isUIBlocking() || phase !== 'aiming') { aiOn = false; return; }
  _origChargeAndFire(shot);
};

const _origPauseGame = typeof pauseGame === 'function' ? pauseGame : null;
window.pauseGame = function() {
  aiOn = false;
  if (_origPauseGame) _origPauseGame();
  else { _isPaused = true; document.getElementById('pauseScreen')?.classList.add('active'); }
};

// ════════════════════════════════════════════════════════════
// FIX 2 & 3 — BALL-IN-HAND FULL REBUILD + AI PLACEMENT GUARD
// ════════════════════════════════════════════════════════════
const BIH_BX = FX + PW * 0.44;
const BIH_CY = FY + PH / 2;
const BIH_R  = PH * 0.18;

function bihPointInD(x, y) {
  if (x > BIH_BX) return false;
  const dx = x - BIH_BX, dy = y - BIH_CY;
  return (dx * dx + dy * dy) <= BIH_R * BIH_R;
}

function bihClampToD(rawX, rawY) {
  if (bihPointInD(rawX, rawY)) return { x: rawX, y: rawY, valid: true };
  const dx = rawX - BIH_BX, dy = rawY - BIH_CY;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist < 0.1) return { x: BIH_BX - BIH_R, y: BIH_CY, valid: true };
  let nx = dx / dist, ny = dy / dist;
  let cx = BIH_BX + nx * BIH_R, cy = BIH_CY + ny * BIH_R;
  if (cx > BIH_BX) { cx = BIH_BX; cy = Math.max(BIH_CY - BIH_R, Math.min(BIH_CY + BIH_R, rawY)); }
  cx = Math.max(FX + R + 2, Math.min(BIH_BX, cx));
  cy = Math.max(FY + R + 2, Math.min(FY + PH - R - 2, cy));
  return { x: cx, y: cy, valid: bihPointInD(cx, cy) };
}

function bihHasOverlap(x, y) {
  return balls.some(b => b !== cue && b.onTable && Math.hypot(b.x - x, b.y - y) < R * 2.1);
}

let bihMode    = false;
let bihCursorX = BIH_BX - BIH_R * 0.5;
let bihCursorY = BIH_CY;

function bihStart() {
  if (typeof window._bihActive !== 'undefined') window._bihActive = false;
  bihMode    = true;
  bihCursorX = BIH_BX - BIH_R * 0.5;
  bihCursorY = BIH_CY;
  phase = 'bih';
  cue.onTable = false; cue.vx = 0; cue.vy = 0;
  document.getElementById('bihBanner')?.classList.add('active');
  updateUI('<span class="bih-hint">🎱 Click inside the D to place cue ball</span>');
}

function bihCommit(rawX, rawY) {
  const clamped = bihClampToD(rawX, rawY);
  let px = clamped.x, py = clamped.y;
  if (bihHasOverlap(px, py)) {
    let placed = false;
    for (let a = 0; a < Math.PI * 2; a += 0.2) {
      for (let d = R * 2.2; d < BIH_R; d += R) {
        const tx = BIH_BX - BIH_R * 0.5 + Math.cos(a) * d;
        const ty = BIH_CY + Math.sin(a) * d;
        if (bihPointInD(tx, ty) && !bihHasOverlap(tx, ty)) { px = tx; py = ty; placed = true; break; }
      }
      if (placed) break;
    }
    if (!placed) return;
  }
  cue.x = px; cue.y = py; cue.vx = 0; cue.vy = 0; cue.onTable = true;
  bihMode = false;
  phase = 'aiming';
  document.getElementById('bihBanner')?.classList.remove('active');
  mX = px; mY = py - 100;
  lockAng = Math.atan2(mY - cue.y, mX - cue.x);
  aimLocked = true;
  updateUI(isAI() ? '<span class="ai">🔥 AI\'s turn…</span>' : 'Your turn — aim & shoot');
  if (isAI()) setTimeout(triggerAI, 200);
}

canvas.addEventListener('mousemove', e => {
  if (!bihMode) return;
  const c = getCanvasCoords(e.clientX, e.clientY);
  bihCursorX = c.x; bihCursorY = c.y;
}, { capture: true });

canvas.addEventListener('mousedown', e => {
  if (!bihMode || e.button !== 0) return;
  e.stopImmediatePropagation();
  const c = getCanvasCoords(e.clientX, e.clientY);
  bihCommit(c.x, c.y);
}, { capture: true });

canvas.addEventListener('touchstart', e => {
  if (!bihMode) return;
  e.preventDefault(); e.stopImmediatePropagation();
  const t = e.touches[0], c = getCanvasCoords(t.clientX, t.clientY);
  bihCursorX = c.x; bihCursorY = c.y;
}, { capture: true });

canvas.addEventListener('touchmove', e => {
  if (!bihMode) return;
  e.preventDefault(); e.stopImmediatePropagation();
  const t = e.touches[0], c = getCanvasCoords(t.clientX, t.clientY);
  bihCursorX = c.x; bihCursorY = c.y;
}, { capture: true });

canvas.addEventListener('touchend', e => {
  if (!bihMode) return;
  e.preventDefault(); e.stopImmediatePropagation();
  const t = e.changedTouches[0], c = getCanvasCoords(t.clientX, t.clientY);
  bihCommit(c.x, c.y);
}, { capture: true });

// Block ALL normal canvas input during BIH
canvas.addEventListener('mousedown', e => { if (bihMode || phase === 'bih') e.stopImmediatePropagation(); }, { capture: true });
canvas.addEventListener('touchstart', e => { if (bihMode || phase === 'bih') e.stopImmediatePropagation(); }, { capture: true });

function drawBIH() {
  if (!bihMode) return;
  ctx.save();
  ctx.beginPath();
  ctx.arc(BIH_BX, BIH_CY, BIH_R, -Math.PI/2, Math.PI/2, true);
  ctx.lineTo(BIH_BX, BIH_CY - BIH_R);
  ctx.strokeStyle = 'rgba(201,168,76,.45)'; ctx.lineWidth = 1.8;
  ctx.setLineDash([6,4]); ctx.stroke(); ctx.setLineDash([]);
  ctx.beginPath();
  ctx.arc(BIH_BX, BIH_CY, BIH_R, -Math.PI/2, Math.PI/2, true);
  ctx.lineTo(BIH_BX, BIH_CY - BIH_R);
  ctx.fillStyle = 'rgba(201,168,76,.06)'; ctx.fill();
  const clamped = bihClampToD(bihCursorX, bihCursorY);
  const px = clamped.x, py = clamped.y;
  const valid = clamped.valid && !bihHasOverlap(px, py);
  ctx.globalAlpha = 0.82;
  ctx.shadowColor = valid ? 'rgba(110,240,160,.6)' : 'rgba(230,80,80,.5)'; ctx.shadowBlur = 16;
  const bg = ctx.createRadialGradient(px-R*.3,py-R*.33,R*.04,px+R*.1,py+R*.1,R*1.05);
  bg.addColorStop(0,'rgba(255,255,255,.95)'); bg.addColorStop(.4,'#f5eed6'); bg.addColorStop(1,'#b8a882');
  ctx.beginPath(); ctx.arc(px,py,R,0,Math.PI*2); ctx.fillStyle=bg; ctx.fill();
  ctx.shadowBlur=0; ctx.globalAlpha=valid?.7:.4;
  ctx.beginPath(); ctx.arc(px,py,R+4,0,Math.PI*2);
  ctx.strokeStyle=valid?'rgba(110,240,160,.9)':'rgba(230,80,80,.9)'; ctx.lineWidth=2; ctx.stroke();
  ctx.restore();
}

// Nullify features.js BIH after DOM ready so ours is the only active system
document.addEventListener('DOMContentLoaded', () => {
  window.commitBallInHand = function() {};
  window.startBallInHand  = function() {};
  window._bihActive = false;
});

// ════════════════════════════════════════════════════════════
// FIX 5 — WRONG-COLOUR FOUL IN FINAL PHASE
// ════════════════════════════════════════════════════════════
let _colorOrderAtShotStart = null;

const _origShoot_fix5 = window.shoot || shoot;
window.shoot = function(ang, pwr) {
  _colorOrderAtShotStart = {};
  for (const c of C_ORDER) {
    const b = balls.find(x => x.id === c);
    _colorOrderAtShotStart[c] = b ? b.onTable : false;
  }
  _origShoot_fix5(ang, pwr);
};

// ════════════════════════════════════════════════════════════
// MASTER judgeShot REPLACEMENT
// ════════════════════════════════════════════════════════════
window.judgeShot = function() {
  const pt   = pottedThisTurn.slice();
  const wIn  = pt.includes('white');
  const reds = pt.filter(id => { const b = balls.find(x => x.id === id); return b && b.kind === 'red'; });
  const cols = pt.filter(id => { const b = balls.find(x => x.id === id); return b && b.kind !== 'red' && b.kind !== 'white'; });
  const rL   = redsLeft();
  let foul = false, fp = 4, msg = '';

  // ── White ball potted ────────────────────────────────────
  if (wIn) {
    foul = true; fp = 4;
    msg = '<span class="foul">⚠ Cue ball potted — FOUL +4</span>';
    scores[1 - curP] += fp;
    brk = 0;
    swapPlayer();
    needRed = true;
    updateUI(msg);
    if (!isAI()) {
      setTimeout(bihStart, 80);
    } else {
      phase = 'bih';
      setTimeout(() => {
        cue.x = BIH_BX - BIH_R * 0.5; cue.y = BIH_CY;
        cue.vx = 0; cue.vy = 0; cue.onTable = true;
        phase = 'aiming';
        updateUI('<span class="ai">🔥 AI\'s turn…</span>');
        setTimeout(triggerAI, 300);
      }, 350);
    }
    return; // ← do NOT fall through
  }

  // ── Normal shot logic ────────────────────────────────────
  if (!allRed) {
    if (needRed) {
      if (reds.length > 0) {
        scores[curP] += reds.length; brk += reds.length;
        msg = '<span class="ok">✓ ' + reds.length + ' Red' + (reds.length>1?'s':'') + ' +' + reds.length + 'pt' + (reds.length>1?'s':'') + ' · Pot a colour</span>';
        needRed = false;
        if (rL === 0) { allRed = true; needRed = true; }
      } else if (cols.length > 0) {
        fp = Math.max(4, ...cols.map(id => { const b = balls.find(x=>x.id===id); return b?b.pts:4; }));
        foul = true;
        msg = '<span class="foul">⚠ Must pot red — FOUL +' + fp + '</span>';
        cols.forEach(respotBall);
      } else {
        msg = 'No ball potted · Switch player'; swapPlayer();
      }
    } else {
      if (cols.length > 0) {
        const b = balls.find(x=>x.id===cols[0]), pts = b?b.pts:0;
        scores[curP] += pts; brk += pts;
        msg = '<span class="ok">✓ ' + cap(b?b.kind:'colour') + ' +' + pts + 'pts · Pot a red</span>';
        if (rL > 0) respotBall(cols[0]);
        needRed = true;
        if (rL === 0) allRed = true;
      } else if (reds.length > 0) {
        foul = true; fp = 4;
        msg = '<span class="foul">⚠ Must pot colour — FOUL +4</span>';
      } else {
        msg = 'No ball potted · Switch player'; swapPlayer(); needRed = true;
      }
    }
  } else {
    // ── FINAL PHASE ─────────────────────────────────────────
    let nextColor = null;
    if (_colorOrderAtShotStart) {
      nextColor = C_ORDER.find(c => _colorOrderAtShotStart[c] === true && !pottedInFinalPhase.includes(c));
    }
    if (!nextColor) {
      nextColor = C_ORDER.find(c => {
        const b = balls.find(x=>x.id===c);
        return b && (b.onTable || pt.includes(c)) && !pottedInFinalPhase.includes(c);
      });
    }
    if (!nextColor) { endFrame(); return; }

    if (cols.length > 0 && cols[0] === nextColor) {
      const b = balls.find(x=>x.id===nextColor), pts = b?b.pts:0;
      scores[curP] += pts; brk += pts;
      pottedInFinalPhase.push(nextColor);
      msg = '<span class="ok">✓ ' + cap(nextColor) + ' +' + pts + 'pts!</span>';
    } else if (cols.length > 0) {
      const b = balls.find(x=>x.id===nextColor);
      fp = Math.max(4, b?b.pts:4); foul = true;
      msg = '<span class="foul">⚠ Wrong colour — FOUL +' + fp + '</span>';
      cols.forEach(respotBall);
    } else {
      msg = 'No ball potted · Switch player'; swapPlayer();
    }

    const remaining = C_ORDER.filter(c => {
      const b = balls.find(x=>x.id===c);
      return b && (b.onTable||cols.includes(c)) && !pottedInFinalPhase.includes(c) && !cols.includes(c);
    });
    if (remaining.length === 0 && !foul) { endFrame(); return; }
  }

  if (foul) { scores[1-curP] += fp; brk = 0; swapPlayer(); needRed = true; }

  const turnMsg = isAI() ? '<span class="ai">🔥 AI\'s turn…</span>' : 'Your turn — aim & shoot';
  updateUI(msg || turnMsg);
  phase = 'aiming';
  syncSpinGridState();
  if (isAI()) triggerAI();
};

// ════════════════════════════════════════════════════════════
// FIX 6 — IMPROVED PHYSICS
// ════════════════════════════════════════════════════════════
const PHY_FRIC        = 0.9835;
const PHY_RESTITUTION = 0.80;
const PHY_STOP        = 0.08;
const PHY_PR_CORNER   = 20;
const PHY_PR_MID      = 24;
const PHY_MAX_SPEED   = 28;

function pocketRadius(i) { return (i===1||i===4) ? PHY_PR_MID : PHY_PR_CORNER; }

window.physStep = function() {
  if (phase !== 'rolling') return;
  let moving = false;

  for (const b of balls) {
    if (!b.onTable) continue;
    const spd = Math.sqrt(b.vx*b.vx + b.vy*b.vy);
    if (spd > PHY_MAX_SPEED) { b.vx *= PHY_MAX_SPEED/spd; b.vy *= PHY_MAX_SPEED/spd; }
    if (spd > PHY_STOP) moving = true;

    for (let step = 0; step < 2; step++) {
      b.x += b.vx*0.5; b.y += b.vy*0.5;
      let pocketed = false;
      for (let pi = 0; pi < POCKETS.length; pi++) {
        const p = POCKETS[pi];
        if (Math.hypot(b.x-p.x, b.y-p.y) < pocketRadius(pi)) {
          b.onTable=false; b.vx=0; b.vy=0;
          if (!pottedThisTurn.includes(b.id)) { pottedThisTurn.push(b.id); sPocket(); }
          pocketed=true; break;
        }
      }
      if (pocketed) break;
    }
    if (!b.onTable) continue;

    b.vx *= PHY_FRIC; b.vy *= PHY_FRIC;
    if (Math.abs(b.vx) < PHY_STOP*0.4) b.vx=0;
    if (Math.abs(b.vy) < PHY_STOP*0.4) b.vy=0;

    if (b.x-R<FX)       { b.x=FX+R;     b.vx= Math.abs(b.vx)*PHY_RESTITUTION; sWall(Math.abs(b.vx)); }
    else if (b.x+R>FX+PW){ b.x=FX+PW-R; b.vx=-Math.abs(b.vx)*PHY_RESTITUTION; sWall(Math.abs(b.vx)); }
    if (b.y-R<FY)       { b.y=FY+R;     b.vy= Math.abs(b.vy)*PHY_RESTITUTION; sWall(Math.abs(b.vy)); }
    else if (b.y+R>FY+PH){ b.y=FY+PH-R; b.vy=-Math.abs(b.vy)*PHY_RESTITUTION; sWall(Math.abs(b.vy)); }
  }

  const onTable = balls.filter(b=>b.onTable);
  for (let i=0; i<onTable.length; i++) {
    for (let j=i+1; j<onTable.length; j++) {
      const a=onTable[i], b=onTable[j];
      const dx=b.x-a.x, dy=b.y-a.y, distSq=dx*dx+dy*dy, minDist=R*2;
      if (distSq < minDist*minDist && distSq > 0.0001) {
        const dist=Math.sqrt(distSq), nx=dx/dist, ny=dy/dist;
        const overlap=(minDist-dist)*0.5;
        a.x-=nx*overlap; a.y-=ny*overlap; b.x+=nx*overlap; b.y+=ny*overlap;
        const dot=(b.vx-a.vx)*nx+(b.vy-a.vy)*ny;
        if (dot<0) {
          a.vx+=dot*nx; a.vy+=dot*ny; b.vx-=dot*nx; b.vy-=dot*ny;
          const kePost=a.vx*a.vx+a.vy*a.vy+b.vx*b.vx+b.vy*b.vy;
          const kePre=(a.vx-dot*nx)**2+(a.vy-dot*ny)**2+(b.vx+dot*nx)**2+(b.vy+dot*ny)**2;
          if (kePost>kePre*1.001) { const sc=Math.sqrt(kePre/kePost); a.vx*=sc;a.vy*=sc;b.vx*=sc;b.vy*=sc; }
          sHit(Math.abs(dot));
        }
      }
    }
  }

  if (!moving) { phase='judging'; setTimeout(judgeShot,150); }
};

// ════════════════════════════════════════════════════════════
// ARROW KEY FINE AIM
// ════════════════════════════════════════════════════════════
document.addEventListener('keydown', e => {
  if (phase !== 'aiming' || !cue || !cue.onTable || isAI()) return;
  const step = e.shiftKey ? 0.001 : 0.006;
  if (e.key === 'ArrowLeft')  { e.preventDefault(); lockAng -= step; aimLocked = true; }
  if (e.key === 'ArrowRight') { e.preventDefault(); lockAng += step; aimLocked = true; }
  if (e.key === ' ') {
    e.preventDefault();
    if (!charging) { charging=true; chStart=Date.now(); power=0; }
    else { charging=false; if (power>0.02) shoot(lockAng,power); power=0; aimLocked=false; }
  }
});

// ════════════════════════════════════════════════════════════
// HOOK drawBIH + syncSpinGridState INTO GAME LOOP
// ════════════════════════════════════════════════════════════
const _origGameLoopFix = window.gameLoop;
window.gameLoop = function(now) {
  _origGameLoopFix(now);
  drawBIH();
  syncSpinGridState();
};
