/* ============================================================
   ROYAL SNOOKER — ENHANCEMENTS (enhancements.js)
   Loaded AFTER script.js. Extends, never overwrites.
   ============================================================ */

// ── TABLE THEMES ─────────────────────────────────────────────
const TABLE_THEMES = {
  classic: {
    feltColor: '#0d5826',
    feltAlt: 'rgba(0,0,0,.08)',
    railGrad: ['#160701','#5a240a','#8b3e14','#6b2e0e','#8b3e14','#160701'],
    cushionDark: 'rgba(0,0,0,.45)',
    lineColor: 'rgba(255,255,255,.14)',
    railBg: 'linear-gradient(135deg,#1e0b02,#5c2d0a,#3d1a06,#8b4a18,#2a1204)',
    pocketRim: 'rgba(201,168,76,.5)',
  },
  midnight: {
    feltColor: '#0d2a5e',
    feltAlt: 'rgba(0,0,30,.12)',
    railGrad: ['#010410','#0a1840','#152b72','#0e2155','#152b72','#010410'],
    cushionDark: 'rgba(0,0,30,.5)',
    lineColor: 'rgba(180,210,255,.16)',
    railBg: 'linear-gradient(135deg,#020818,#0a1840,#071230,#152b72,#040e28)',
    pocketRim: 'rgba(100,160,255,.45)',
  },
  burgundy: {
    feltColor: '#5e0d1a',
    feltAlt: 'rgba(30,0,0,.1)',
    railGrad: ['#0f0103','#3a0a12','#6b1424','#4a0c18','#6b1424','#0f0103'],
    cushionDark: 'rgba(30,0,0,.48)',
    lineColor: 'rgba(255,180,180,.14)',
    railBg: 'linear-gradient(135deg,#180204,#5a100c,#3d0a0e,#8b1824,#2a0406)',
    pocketRim: 'rgba(201,76,76,.5)',
  },
  slate: {
    feltColor: '#2c3640',
    feltAlt: 'rgba(0,0,0,.09)',
    railGrad: ['#080c0f','#1a2630','#2e4050','#203040','#2e4050','#080c0f'],
    cushionDark: 'rgba(0,0,0,.44)',
    lineColor: 'rgba(180,220,240,.12)',
    railBg: 'linear-gradient(135deg,#0a0e12,#1e2e3a,#142030,#2a3e4e,#101820)',
    pocketRim: 'rgba(120,180,220,.45)',
  },
};

// ── CUE THEMES ────────────────────────────────────────────────
const CUE_THEMES = {
  classic: {
    tip: '#5bc8f5',
    stops: [
      [0,    '#5bc8f5'],
      [0.04, '#e0d5b0'],
      [0.15, '#f5e8c2'],
      [0.50, '#d4a84b'],
      [0.75, '#8b4a14'],
      [1,    '#1e0901'],
    ],
    shadow: '#180802',
  },
  ebony: {
    tip: '#a0c8f0',
    stops: [
      [0,    '#a0c8f0'],
      [0.04, '#dddddd'],
      [0.15, '#eeeeee'],
      [0.50, '#888888'],
      [0.75, '#333333'],
      [1,    '#101010'],
    ],
    shadow: '#080808',
  },
  crimson: {
    tip: '#f59b5b',
    stops: [
      [0,    '#f59b5b'],
      [0.04, '#e8ccc0'],
      [0.15, '#f5e2c2'],
      [0.50, '#c94848'],
      [0.75, '#7a1414'],
      [1,    '#1e0101'],
    ],
    shadow: '#180202',
  },
  jade: {
    tip: '#5bf5a0',
    stops: [
      [0,    '#5bf5a0'],
      [0.04, '#b0e8c2'],
      [0.15, '#c2f5d4'],
      [0.50, '#3aad6e'],
      [0.75, '#145e32'],
      [1,    '#011e0a'],
    ],
    shadow: '#021008',
  },
};

let activeTable = 'classic';
let activeCue   = 'classic';

function setTableTheme(id) {
  activeTable = id;
  // Invalidate the table cache so it rebuilds with new theme
  tableCache = null;
  document.querySelectorAll('.tCard').forEach(c => c.classList.toggle('sel', c.dataset.theme === id));
}

function setCueTheme(id) {
  activeCue = id;
  document.querySelectorAll('.cueCard').forEach(c => c.classList.toggle('sel', c.dataset.cue === id));
}

// ── PATCH: drawTableOn / drawAimAndCue use active theme ───────
// We intercept buildTableCache to use theme-aware drawing
const _origBuildTableCache = buildTableCache;
window.buildTableCache = function() {
  const off = document.createElement('canvas');
  off.width  = CW;
  off.height = CH;
  const oc = off.getContext('2d');
  drawTableOnThemed(oc);
  drawPocketsOnThemed(oc);
  tableCache = off;
};

function drawTableOnThemed(c) {
  const T = TABLE_THEMES[activeTable];

  // Rail gradient
  const rg = c.createLinearGradient(0, 0, CW, CH);
  T.railGrad.forEach((col, i) => rg.addColorStop(i / (T.railGrad.length - 1), col));
  c.fillStyle = rg;
  c.beginPath();
  c.roundRect(0, 0, CW, CH, 6);
  c.fill();
  c.strokeStyle = 'rgba(201,168,76,.2)';
  c.lineWidth = 0.8;
  [4, 9, 14].forEach(o => c.strokeRect(o, o, CW - o * 2, CH - o * 2));

  // Felt pattern
  const feltOff = document.createElement('canvas');
  feltOff.width = 8; feltOff.height = 8;
  const fc = feltOff.getContext('2d');
  fc.fillStyle = T.feltColor;
  fc.fillRect(0, 0, 8, 8);
  fc.fillStyle = T.feltAlt;
  fc.fillRect(0, 0, 4, 4);
  fc.fillRect(4, 4, 4, 4);
  fc.fillStyle = 'rgba(255,255,255,.015)';
  fc.fillRect(4, 0, 4, 4);
  fc.fillRect(0, 4, 4, 4);
  const pat = c.createPattern(feltOff, 'repeat');
  c.fillStyle = pat;
  c.fillRect(FX, FY, PW, PH);

  // Vignette
  const fv = c.createRadialGradient(FX+PW/2, FY+PH/2, PH*.1, FX+PW/2, FY+PH/2, PW*.65);
  fv.addColorStop(0, 'rgba(30,120,55,.06)');
  fv.addColorStop(1, 'rgba(0,0,0,.32)');
  c.fillStyle = fv;
  c.fillRect(FX, FY, PW, PH);

  // Cushion shadows
  [[FX,FY,PW,13],[FX,FY+PH-13,PW,13],[FX,FY,13,PH],[FX+PW-13,FY,13,PH]].forEach(([x,y,w,h]) => {
    const cg = c.createLinearGradient(x, y, x+(w>h?0:w), y+(h>w?0:h));
    cg.addColorStop(0, T.cushionDark);
    cg.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = cg;
    c.fillRect(x, y, w, h);
  });

  // Baulk line + D
  const bX = FX + PW * 0.44;
  c.strokeStyle = T.lineColor;
  c.lineWidth = 1.5;
  c.setLineDash([]);
  c.beginPath(); c.moveTo(bX, FY+10); c.lineTo(bX, FY+PH-10); c.stroke();
  const dR = PH * 0.18;
  c.beginPath(); c.arc(bX, FY+PH/2, dR, -Math.PI/2, Math.PI/2); c.stroke();

  // Spots
  c.fillStyle = 'rgba(255,255,255,.25)';
  Object.values(C_SPOTS).forEach(s => {
    c.beginPath(); c.arc(s.x, s.y, 2, 0, Math.PI*2); c.fill();
  });

  // Diamonds
  c.fillStyle = 'rgba(201,168,76,.38)';
  function _dia(x, y, s) {
    c.beginPath(); c.moveTo(x, y-s); c.lineTo(x+s*.6, y); c.lineTo(x, y+s); c.lineTo(x-s*.6, y); c.closePath(); c.fill();
  }
  [FY+PH*.25, FY+PH*.5, FY+PH*.75].forEach(y => { _dia(FX-RAIL*.42, y, 4); _dia(FX+PW+RAIL*.42, y, 4); });
  [FX+PW*.25, FX+PW*.5, FX+PW*.75].forEach(x => { _dia(x, FY-RAIL*.42, 4); _dia(x, FY+PH+RAIL*.42, 4); });
}

function drawPocketsOnThemed(c) {
  const T = TABLE_THEMES[activeTable];
  POCKETS.forEach(p => {
    c.beginPath(); c.arc(p.x, p.y, PR+5, 0, Math.PI*2); c.fillStyle='#100600'; c.fill();
    const g = c.createRadialGradient(p.x-2,p.y-2,0,p.x,p.y,PR+2);
    g.addColorStop(0,'#010000'); g.addColorStop(.7,'#080400'); g.addColorStop(1,'rgba(20,6,2,.6)');
    c.beginPath(); c.arc(p.x,p.y,PR+2,0,Math.PI*2); c.fillStyle=g; c.fill();
    c.beginPath(); c.arc(p.x,p.y,PR+4,0,Math.PI*2);
    c.strokeStyle = T.pocketRim;
    c.lineWidth = 1.5; c.stroke();
  });
}

// Patch cue drawing to use active theme
const _origDrawAimAndCue = drawAimAndCue;
window.drawAimAndCue = function() {
  if (phase !== 'aiming' || !cue.onTable) return;
  const ang = getAng(), dx = Math.cos(ang), dy = Math.sin(ang);
  const ox = cue.x, oy = cue.y;
  ctx.save();

  const ray = rayDist(ox, oy, dx, dy, cue);
  ctx.setLineDash([9,7]);
  ctx.strokeStyle = aiOn ? 'rgba(136,204,255,.22)' : 'rgba(255,255,255,.2)';
  ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.moveTo(ox+dx*R, oy+dy*R); ctx.lineTo(ox+dx*ray.t, oy+dy*ray.t); ctx.stroke();

  ctx.setLineDash([]);
  ctx.strokeStyle = aiOn ? 'rgba(136,204,255,.5)' : 'rgba(255,245,160,.5)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(ox+dx*(R+1), oy+dy*(R+1)); ctx.lineTo(ox+dx*Math.min(60,ray.t), oy+dy*Math.min(60,ray.t)); ctx.stroke();

  if (ray.ball) {
    const gx = ox+dx*ray.t, gy = oy+dy*ray.t;
    ctx.globalAlpha = .35;
    const gc = ctx.createRadialGradient(gx-R*.3, gy-R*.35, 0, gx, gy, R);
    gc.addColorStop(0,'rgba(255,255,255,.9)'); gc.addColorStop(1,'rgba(200,200,200,.1)');
    ctx.beginPath(); ctx.arc(gx,gy,R,0,Math.PI*2); ctx.fillStyle=gc; ctx.fill();
    ctx.globalAlpha = .5;
    ctx.beginPath(); ctx.arc(gx,gy,R,0,Math.PI*2);
    ctx.strokeStyle = aiOn ? 'rgba(136,204,255,.9)' : 'rgba(255,255,180,.9)';
    ctx.lineWidth = 1.2; ctx.stroke();
    ctx.globalAlpha = 1;
    const nx=(gx-ray.ball.x)/(R*2), ny=(gy-ray.ball.y)/(R*2);
    arrow(ray.ball.x,ray.ball.y,ray.ball.x-nx*55,ray.ball.y-ny*55,'rgba(255,200,55,.7)');
    const dot=dx*nx+dy*ny, cdx=dx-nx*dot*2, cdy=dy-ny*dot*2, cd=Math.sqrt(cdx*cdx+cdy*cdy)||1;
    arrow(gx,gy,gx+(cdx/cd)*32,gy+(cdy/cd)*32,'rgba(170,220,255,.5)');
  }

  const curPwr = aiOn ? aiPwr : power;
  const pull = R+4+curPwr*90;
  const sx = ox-dx*pull, sy = oy-dy*pull, el = 210;
  const ex = sx-dx*el, ey = sy-dy*el;

  if (charging && power > .08 && !aiOn) {
    ctx.beginPath(); ctx.arc(sx,sy,5+power*5,0,Math.PI*2);
    ctx.fillStyle = `rgba(100,200,255,${power*.4})`; ctx.fill();
  }

  const CT = CUE_THEMES[activeCue];
  const cg = ctx.createLinearGradient(sx,sy,ex,ey);
  CT.stops.forEach(([pos,col]) => cg.addColorStop(pos,col));

  ctx.lineCap = 'round';
  ctx.lineWidth = 6;
  ctx.strokeStyle = CT.shadow;
  ctx.beginPath(); ctx.moveTo(sx,sy); ctx.lineTo(ex,ey); ctx.stroke();
  ctx.lineWidth = 4;
  ctx.strokeStyle = cg;
  ctx.beginPath(); ctx.moveTo(sx,sy); ctx.lineTo(ex,ey); ctx.stroke();

  const px=-dy, py=dx;
  ctx.lineWidth = .9;
  ctx.strokeStyle = 'rgba(255,255,255,.18)';
  ctx.beginPath(); ctx.moveTo(sx+px*1.5,sy+py*1.5); ctx.lineTo(ex+px*1.5,ey+py*1.5); ctx.stroke();
  ctx.restore();
};

// ── PREMIUM POPUP ENGINE ──────────────────────────────────────
function rsPopup({ icon = '♟', title = '', msg = '', btns = [] }) {
  return new Promise(resolve => {
    const backdrop = document.createElement('div');
    backdrop.className = 'rsPopupBackdrop';

    const box = document.createElement('div');
    box.className = 'rsPopupBox';

    // Icon
    const iconEl = document.createElement('span');
    iconEl.className = 'rsPopupIcon';
    iconEl.textContent = icon;

    // Title
    const titleEl = document.createElement('div');
    titleEl.className = 'rsPopupTitle';
    titleEl.textContent = title;

    // Message
    const msgEl = document.createElement('div');
    msgEl.className = 'rsPopupMsg';
    msgEl.textContent = msg;

    // Buttons container
    const btnWrap = document.createElement('div');
    btnWrap.className = 'rsPopupBtns';

    btns.forEach((b, i) => {
      const btn = document.createElement('button');

      // Optional: whitelist classes
      const safeClass = (b.cls && /^[a-zA-Z0-9_\- ]+$/.test(b.cls))
        ? b.cls
        : 'rsConfirm';

      btn.className = safeClass;
      btn.textContent = b.label || 'OK';
      btn.dataset.idx = i;

      btn.addEventListener('click', () => {
        document.body.removeChild(backdrop);
        resolve(i);
      });

      btnWrap.appendChild(btn);
    });

    // Assemble
    box.appendChild(iconEl);
    box.appendChild(titleEl);
    box.appendChild(msgEl);
    box.appendChild(btnWrap);

    backdrop.appendChild(box);
    document.body.appendChild(backdrop);

    // Optional: click outside to close (if needed)
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        document.body.removeChild(backdrop);
        resolve(-1); // dismissed
      }
    });
  });
}

// ── PAUSE SCREEN ──────────────────────────────────────────────
let _isPaused = false;

function pauseGame() {
  if (phase === 'rolling') return; // can't pause while balls moving
  _isPaused = true;
  document.getElementById('pauseScreen').classList.add('active');
}

function resumeGame() {
  _isPaused = false;
  document.getElementById('pauseScreen').classList.remove('active');
}

async function gcResume() {
  if (!_isPaused) {
    pauseGame();
  } else {
    resumeGame();
  }
}

async function gcQuit() {
  const choice = await rsPopup({
    icon: '⚑',
    title: 'Forfeit Frame',
    msg: 'Are you sure you want to forfeit this frame?<br>Your opponent will be awarded the win.',
    btns: [
      { label: 'Yes, Forfeit', cls: 'rsDanger' },
      { label: 'Cancel',       cls: 'rsCancel' },
    ]
  });
  if (choice === 0) {
    resumeGame();
    await rsPopup({
      icon: '🏆',
      title: 'Frame Awarded',
      msg: isAI() || GMODE==='ai' ? 'AI has been awarded the frame.' : 'Player 2 has been awarded the frame.',
      btns: [{ label: 'Continue', cls: 'rsConfirm' }]
    });
    // Give win to opponent
    scores[1-curP] += 200;
    endFrame();
  }
}

async function gcAssignWin() {
  const oppName = GMODE==='2p' ? (curP===0?'Player 2':'Player 1') : 'AI';
  const choice = await rsPopup({
    icon: '🎱',
    title: 'Assign Win',
    msg: `Assign the frame win to <strong style="color:#f0d080">${oppName}</strong>?`,
    btns: [
      { label: 'Assign Win', cls: 'rsDanger' },
      { label: 'Cancel',     cls: 'rsCancel' },
    ]
  });
  if (choice === 0) {
    resumeGame();
    scores[1-curP] += 200;
    endFrame();
  }
}

async function gcMainMenu() {
  const choice = await rsPopup({
    icon: '♛',
    title: 'Main Menu',
    msg: 'Return to the main menu?<br>Current frame progress will be lost.',
    btns: [
      { label: 'Return to Menu', cls: 'rsConfirm' },
      { label: 'Keep Playing',   cls: 'rsCancel'  },
    ]
  });
  if (choice === 0) {
    resumeGame();
    document.getElementById('gameControls').classList.remove('visible');
    document.getElementById('ov').style.display = '';
    // Reset game state
    balls = [];
    tableCache = null;
  }
}

// ── PATCH endFrame → premium popup instead of confirm() ───────
window.endFrame = async function() {
  const p1 = document.getElementById('p1name').textContent;
  const p2 = document.getElementById('p2name').textContent;
  const s0 = scores[0], s1 = scores[1];

  let winner;
  if (GMODE === '2p') winner = s0 > s1 ? p1 : (s1 > s0 ? p2 : 'Draw');
  else                winner = s0 > s1 ? 'You win!' : (s1 > s0 ? 'AI wins!' : 'Draw!');

  updateUI(`<span class="hi">🏆 ${winner}</span>`);
  frameN++;

  // Build popup
  const w0 = s0 >= s1, w1 = s1 >= s0;
  const backdrop = document.createElement('div');
  backdrop.className = 'rsPopupBackdrop';
  backdrop.id = 'frameEndPopup';
  const box = document.createElement('div');
  box.className = 'rsPopupBox';

  const icon = document.createElement('span');
  icon.className = 'rsPopupIcon';
  icon.textContent = '🏆';

  const title = document.createElement('div');
  title.className = 'rsPopupTitle';
  title.textContent = winner;

  const msg = document.createElement('div');
  msg.className = 'rsPopupMsg';
  msg.textContent = `Frame ${frameN - 1} Complete`;

  const scoresWrap = document.createElement('div');
  scoresWrap.className = 'frameScores';

  // Player 1
  const p1Wrap = document.createElement('div');
  p1Wrap.className = `frameScoreItem ${w0 ? 'winner' : ''}`;

  const p1Name = document.createElement('div');
  p1Name.className = 'fsName';
  p1Name.textContent = p1;

  const p1Val = document.createElement('div');
  p1Val.className = 'fsVal';
  p1Val.textContent = s0;

  p1Wrap.appendChild(p1Name);
  p1Wrap.appendChild(p1Val);

  // Divider
  const divider = document.createElement('div');
  divider.className = 'frameDivider';
  divider.textContent = '·';

  // Player 2
  const p2Wrap = document.createElement('div');
  p2Wrap.className = `frameScoreItem ${w1 ? 'winner' : ''}`;

  const p2Name = document.createElement('div');
  p2Name.className = 'fsName';
  p2Name.textContent = p2;

  const p2Val = document.createElement('div');
  p2Val.className = 'fsVal';
  p2Val.textContent = s1;

  p2Wrap.appendChild(p2Name);
  p2Wrap.appendChild(p2Val);

  // Assemble scores
  scoresWrap.appendChild(p1Wrap);
  scoresWrap.appendChild(divider);
  scoresWrap.appendChild(p2Wrap);

  const btnWrap = document.createElement('div');
  btnWrap.className = 'rsPopupBtns';

  const nextBtn = document.createElement('button');
  nextBtn.className = 'rsConfirm';
  nextBtn.id = 'fepNext';
  nextBtn.textContent = 'Next Frame';

  const menuBtn = document.createElement('button');
  menuBtn.className = 'rsCancel';
  menuBtn.id = 'fepMenu';
  menuBtn.textContent = 'Main Menu';

  btnWrap.appendChild(nextBtn);
  btnWrap.appendChild(menuBtn);

  // Assemble all
  box.appendChild(icon);
  box.appendChild(title);
  box.appendChild(msg);
  box.appendChild(scoresWrap);
  box.appendChild(btnWrap);

  // Append to backdrop
  backdrop.appendChild(box);
    document.body.appendChild(backdrop);

    document.getElementById('fepNext').onclick = () => {
      document.body.removeChild(backdrop);
      initGame();
    };
    document.getElementById('fepMenu').onclick = () => {
      document.body.removeChild(backdrop);
      document.getElementById('gameControls').classList.remove('visible');
      document.getElementById('ov').style.display = '';
      balls = [];
      tableCache = null;
    };
  };

// ── PATCH startGame → show controls bar ───────────────────────
const _origStartGame = startGame;
window.startGame = function() {
  document.getElementById('ov').style.display = 'none';
  // Apply selected themes
  tableCache = null;
  frameN = 1;
  setupNames();
  initGame();
  tableCache = null;
  _lastT = performance.now();
  _accum = 0;
  requestAnimationFrame(gameLoop);
  document.getElementById('gameControls').classList.add('visible');
};

// ── INJECT HTML INTO EXISTING PAGE ───────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // 1. Game controls bar (inserted between #hdr and #wrap)
  const hdr = document.getElementById('hdr');
  const gcBar = document.createElement('div');
  gcBar.id = 'gameControls';
  gcBar.textContent = '';

  // Pause
  const pauseBtn = document.createElement('button');
  pauseBtn.className = 'gcBtn';
  pauseBtn.textContent = '⏸ Pause';
  pauseBtn.addEventListener('click', gcResume);

  // Separator
  const sep1 = document.createElement('div');
  sep1.className = 'gcBtn-sep';

  // Menu
  const menuBtn = document.createElement('button');
  menuBtn.className = 'gcBtn';
  menuBtn.textContent = '⌂ Menu';
  menuBtn.addEventListener('click', gcMainMenu);

  // Separator
  const sep2 = document.createElement('div');
  sep2.className = 'gcBtn-sep';

  // Assign Win
  const winBtn = document.createElement('button');
  winBtn.className = 'gcBtn danger';
  winBtn.textContent = '⚑ Assign Win';
  winBtn.addEventListener('click', gcAssignWin);

  // Separator
  const sep3 = document.createElement('div');
  sep3.className = 'gcBtn-sep';

  // Forfeit
  const quitBtn = document.createElement('button');
  quitBtn.className = 'gcBtn danger';
  quitBtn.textContent = '✕ Forfeit';
  quitBtn.addEventListener('click', gcQuit);

  // Append all
  gcBar.appendChild(pauseBtn);
  gcBar.appendChild(sep1);
  gcBar.appendChild(menuBtn);
  gcBar.appendChild(sep2);
  gcBar.appendChild(winBtn);
  gcBar.appendChild(sep3);
  gcBar.appendChild(quitBtn);
  hdr.parentNode.insertBefore(gcBar, hdr.nextSibling);

  // 2. Pause screen (fixed overlay)
  const pauseScreen = document.createElement('div');
  pauseScreen.id = 'pauseScreen';
  pauseScreen.textContent = '';

  // Box
  const box = document.createElement('div');
  box.className = 'rsPopupBox';

  // Icon
  const icon = document.createElement('span');
  icon.className = 'rsPopupIcon';
  icon.textContent = '⏸';

  // Title
  const title = document.createElement('div');
  title.className = 'rsPopupTitle';
  title.textContent = 'Game Paused';
  
  const msg = document.createElement('div');
  msg.className = 'rsPopupMsg';

  const text1 = document.createElement('div');
  text1.textContent = 'Take your time.';

  const text2 = document.createElement('div');
  text2.textContent = 'The table awaits your return.';

  msg.appendChild(text1);
  msg.appendChild(text2);

  // Buttons container
  const btnWrap = document.createElement('div');
  btnWrap.className = 'rsPopupBtns';

  // Resume button
  const resumeBtn = document.createElement('button');
  resumeBtn.className = 'rsConfirm';
  resumeBtn.textContent = 'Resume';
  resumeBtn.addEventListener('click', resumeGame);

  // Menu button
  const mainMenuBtn  = document.createElement('button');
  mainMenuBtn .className = 'rsCancel';
  mainMenuBtn .textContent = 'Main Menu';
  mainMenuBtn .addEventListener('click', gcMainMenu);

  // Assemble
  btnWrap.appendChild(resumeBtn);
  btnWrap.appendChild(mainMenuBtn );

  box.appendChild(icon);
  box.appendChild(title);
  box.appendChild(msg);
  box.appendChild(btnWrap);

  pauseScreen.appendChild(box);
  document.body.appendChild(pauseScreen);

  // 3. Table + Cue selectors in the overlay
  const ovBox = document.getElementById('ovBox');
  const igrid = ovBox.querySelector('.igrid');

  const custHTML = `
    <div class="custSection">
      <div class="dlbl">Table Design</div>
      <div class="custRow" id="tableCards">
        <div class="tCard sel" data-theme="classic" onclick="setTableTheme('classic')">
          <div class="tCardFelt tFelt-classic"></div>
          <div class="tCardLabel">Classic</div>
        </div>
        <div class="tCard" data-theme="midnight" onclick="setTableTheme('midnight')">
          <div class="tCardFelt tFelt-midnight"></div>
          <div class="tCardLabel">Midnight</div>
        </div>
        <div class="tCard" data-theme="burgundy" onclick="setTableTheme('burgundy')">
          <div class="tCardFelt tFelt-burgundy"></div>
          <div class="tCardLabel">Burgundy</div>
        </div>
        <div class="tCard" data-theme="slate" onclick="setTableTheme('slate')">
          <div class="tCardFelt tFelt-slate"></div>
          <div class="tCardLabel">Slate</div>
        </div>
      </div>
    </div>
    <div class="custSection">
      <div class="dlbl">Cue Stick</div>
      <div class="custRow" id="cueCards">
        <div class="cueCard sel" data-cue="classic" onclick="setCueTheme('classic')">
          <div class="cuePreview cuePrev-classic"></div>
          <div class="cueCardLabel">Classic</div>
        </div>
        <div class="cueCard" data-cue="ebony" onclick="setCueTheme('ebony')">
          <div class="cuePreview cuePrev-ebony"></div>
          <div class="cueCardLabel">Ebony</div>
        </div>
        <div class="cueCard" data-cue="crimson" onclick="setCueTheme('crimson')">
          <div class="cuePreview cuePrev-crimson"></div>
          <div class="cueCardLabel">Crimson</div>
        </div>
        <div class="cueCard" data-cue="jade" onclick="setCueTheme('jade')">
          <div class="cuePreview cuePrev-jade"></div>
          <div class="cueCardLabel">Jade</div>
        </div>
      </div>
    </div>`;

  // Insert before the instructions grid
  igrid.insertAdjacentHTML('beforebegin', custHTML);

  // 4. Pause state guard: block input during pause
  const origMousedown = canvas.onmousedown;
  canvas.addEventListener('mousedown', e => {
    if (_isPaused) e.stopImmediatePropagation();
  }, true);
  canvas.addEventListener('touchstart', e => {
    if (_isPaused) e.stopImmediatePropagation();
  }, true);
});
