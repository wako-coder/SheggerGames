const canvas = document.getElementById("c");
const ctx = canvas.getContext("2d");

// ── TABLE LAYOUT ──────────────────────────────────────────────
// Playfield size (inside cushions)
const PW = 820,
  PH = 420;
const RAIL = 46;
const CW = PW + RAIL * 2,
  CH = PH + RAIL * 2;
canvas.width = CW;
canvas.height = CH;

// Felt area origin
const FX = RAIL,
  FY = RAIL;

const R = 11; // ball radius
const PR = 22; // pocket radius
const FRIC = 0.982; // friction per frame
const STOP = 0.12; // speed below which ball stops

// Pockets: corner + mid
const POCKETS = [
  { x: FX, y: FY },
  { x: FX + PW / 2, y: FY - 4 },
  { x: FX + PW, y: FY },
  { x: FX, y: FY + PH },
  { x: FX + PW / 2, y: FY + PH + 4 },
  { x: FX + PW, y: FY + PH },
];

// ── BALL SPECS ────────────────────────────────────────────────
const BSPEC = {
  white: { col: "#f5eed6", pts: 0 },
  red: { col: "#c0392b", pts: 1 },
  yellow: { col: "#f1c40f", pts: 2 },
  green: { col: "#27ae60", pts: 3 },
  brown: { col: "#7b4f33", pts: 4 },
  blue: { col: "#2471a3", pts: 5 },
  pink: { col: "#e91e9a", pts: 6 },
  black: { col: "#1a1a1a", pts: 7 },
};
const C_ORDER = ["yellow", "green", "brown", "blue", "pink", "black"];
const C_SPOTS = {
  yellow: { x: FX + PW * 0.44, y: FY + PH / 2 - 46 },
  green: { x: FX + PW * 0.44, y: FY + PH / 2 + 46 },
  brown: { x: FX + PW * 0.44, y: FY + PH / 2 },
  blue: { x: FX + PW * 0.5, y: FY + PH / 2 },
  pink: { x: FX + PW * 0.73, y: FY + PH / 2 },
  black: { x: FX + PW * 0.88, y: FY + PH / 2 },
};

// ── ACCURATE COORDINATE MAPPING ─────────────────────────────────
function getCanvasCoords(clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (clientX - rect.left) * (canvas.width / rect.width),
    y: (clientY - rect.top) * (canvas.height / rect.height)
  };
}

// ── HELPERS ───────────────────────────────────────────────────
const D = (a, b) => Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
function lh(h, n) {
  let r = parseInt(h.slice(1, 3), 16),
    g = parseInt(h.slice(3, 5), 16),
    b = parseInt(h.slice(5, 7), 16);
  return `rgb(${Math.min(255, r + n)},${Math.min(255, g + n)},${Math.min(255, b + n)})`;
}
function dk(h, n) {
  let r = parseInt(h.slice(1, 3), 16),
    g = parseInt(h.slice(3, 5), 16),
    b = parseInt(h.slice(5, 7), 16);
  return `rgb(${Math.max(0, r - n)},${Math.max(0, g - n)},${Math.max(0, b - n)})`;
}
function cap(s) {
  return s[0].toUpperCase() + s.slice(1);
}

function mkBall(id, kind, x, y, sx, sy) {
  return {
    id,
    kind,
    x,
    y,
    vx: 0,
    vy: 0,
    col: BSPEC[kind].col,
    pts: BSPEC[kind].pts,
    onTable: true,
    r: R,
    sx: sx ?? x,
    sy: sy ?? y,
  };
}

function separateBalls(ballsArray, ballRadius) {
  for (let i = 0; i < ballsArray.length; i++) {
    for (let j = i + 1; j < ballsArray.length; j++) {
      const a = ballsArray[i];
      const b = ballsArray[j];
      if (!a.onTable || !b.onTable) continue;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      const minDist = ballRadius * 2;
      if (d < minDist && d > 0.01) {
        const overlap = (minDist - d) / 2;
        const nx = dx / d;
        const ny = dy / d;
        a.x -= nx * overlap;
        a.y -= ny * overlap;
        b.x += nx * overlap;
        b.y += ny * overlap;
      }
    }
  }
}

function makeBalls() {
  const B = [];
  
  // White cue ball
  B.push(mkBall("white", "white", FX + PW * 0.22, FY + PH / 2));
  
  // Colored balls with standard snooker positions
  const spots = {
    yellow: { x: FX + PW * 0.44, y: FY + PH / 2 - 46 },
    green:  { x: FX + PW * 0.44, y: FY + PH / 2 + 46 },
    brown:  { x: FX + PW * 0.44, y: FY + PH / 2 },
    blue:   { x: FX + PW * 0.50, y: FY + PH / 2 },
    pink:   { x: FX + PW * 0.71, y: FY + PH / 2 },
    black:  { x: FX + PW * 0.91, y: FY + PH / 2 },
  };
  
  for (const [k, s] of Object.entries(spots)) {
    B.push(mkBall(k, k, s.x, s.y, s.x, s.y));
  }
  
  // RED TRIANGLE - All 15 reds
  const apexX = spots.pink.x + (R * 2.5);
  const apexY = FY + PH / 2;
  const spacing = R * 2.1;
  
  let redId = 0;
  
  B.push(mkBall("r" + redId++, "red", apexX, apexY));
  B.push(mkBall("r" + redId++, "red", apexX + spacing, apexY - spacing/2));
  B.push(mkBall("r" + redId++, "red", apexX + spacing, apexY + spacing/2));
  
  const row2X = apexX + spacing * 2;
  B.push(mkBall("r" + redId++, "red", row2X, apexY - spacing));
  B.push(mkBall("r" + redId++, "red", row2X, apexY));
  B.push(mkBall("r" + redId++, "red", row2X, apexY + spacing));
  
  const row3X = apexX + spacing * 3;
  B.push(mkBall("r" + redId++, "red", row3X, apexY - spacing * 1.5));
  B.push(mkBall("r" + redId++, "red", row3X, apexY - spacing/2));
  B.push(mkBall("r" + redId++, "red", row3X, apexY + spacing/2));
  B.push(mkBall("r" + redId++, "red", row3X, apexY + spacing * 1.5));
  
  const row4X = apexX + spacing * 4;
  B.push(mkBall("r" + redId++, "red", row4X, apexY - spacing * 2));
  B.push(mkBall("r" + redId++, "red", row4X, apexY - spacing));
  B.push(mkBall("r" + redId++, "red", row4X, apexY));
  B.push(mkBall("r" + redId++, "red", row4X, apexY + spacing));
  B.push(mkBall("r" + redId++, "red", row4X, apexY + spacing * 2));
  
  separateBalls(B, R);
  return B;
}

// ── GAME STATE ────────────────────────────────────────────────
let GMODE = "ai",
  DIFF = "medium";
let balls = [], cue, mX, mY;
let charging,
  chStart,
  power = 0;
let aimLocked = false,
  lockAng = 0;
let phase = "aiming";
let pottedThisTurn = [];
  curP = 0;
  scores = [0, 0],
  brk = 0,
  frameN = 1;
let needRed = true,
  allRed = false;
let spin = { x: 0, y: 0 };
let aiOn = false,
  aiAng = 0,
  aiPwr = 0;

// Track which colors have been potted in final phase (DO NOT RESPAWN)
let pottedInFinalPhase = [];

// ── AUDIO ─────────────────────────────────────────────────────
let AC;
function getAC() {
  return AC || (AC = new (window.AudioContext || window.webkitAudioContext)());
}
function playNoise(dur, freq, gain, decay) {
  try {
    const a = getAC(),
      buf = a.createBuffer(1, ~~(a.sampleRate * dur), a.sampleRate),
      d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++)
      d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (a.sampleRate * decay));
    const s = a.createBufferSource();
    s.buffer = buf;
    const f = a.createBiquadFilter();
    f.type = "bandpass";
    f.frequency.value = freq;
    f.Q.value = 1;
    const g = a.createGain();
    g.gain.value = gain;
    s.connect(f);
    f.connect(g);
    g.connect(a.destination);
    s.start();
  } catch (e) {}
}
function playTone(freq, dur, gain) {
  try {
    const a = getAC(),
      o = a.createOscillator(),
      g = a.createGain();
    o.frequency.value = freq;
    g.gain.setValueAtTime(gain, a.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, a.currentTime + dur);
    o.connect(g);
    g.connect(a.destination);
    o.start();
    o.stop(a.currentTime + dur);
  } catch (e) {}
}
const sStrike = (p) => playNoise(0.1, 2000, Math.min(p, 0.9) * 0.4, 0.04);
const sHit = (v) => {
  if (v > 1) playNoise(0.06, 1600, 0.25, 0.02);
};
const sPocket = () => {
  playTone(80, 0.25, 0.5);
  playNoise(0.25, 200, 0.35, 0.08);
};
const sWall = (v) => {
  if (v > 2) playNoise(0.05, 1100, 0.18, 0.025);
};

// ── INIT ──────────────────────────────────────────────────────
function initGame() {
  balls = makeBalls();
  cue = balls.find((b) => b.id === "white");
  mX = cue.x;
  mY = cue.y - 100;
  charging = false;
  power = 0;
  aimLocked = false;
  curP = Math.random() < 0.5 ? 0 : 1;
  scores = [0, 0];
  brk = 0;
  frameN = frameN || 1;
  needRed = true;
  allRed = false;
  phase = "aiming";
  pottedThisTurn = [];
  pottedInFinalPhase = [];
  spin = { x: 0, y: 0 };
  aiOn = false;
  aiAng = 0;
  aiPwr = 0;
  updateUI("Your turn — aim & shoot");

  if (isAI()) {
    updateUI('<span class="ai">🔥 AI breaking…</span>');
    setTimeout(triggerAI, 600);
  }
}

// ── TABLE DRAWING ─────────────────────────────────────────────
let feltPat = null;
function makeFelt() {
  const o = document.createElement("canvas");
  o.width = 8;
  o.height = 8;
  const oc = o.getContext("2d");
  oc.fillStyle = "#0d5826";
  oc.fillRect(0, 0, 8, 8);
  oc.fillStyle = "rgba(0,0,0,.08)";
  oc.fillRect(0, 0, 4, 4);
  oc.fillRect(4, 4, 4, 4);
  oc.fillStyle = "rgba(255,255,255,.015)";
  oc.fillRect(4, 0, 4, 4);
  oc.fillRect(0, 4, 4, 4);
  feltPat = ctx.createPattern(o, "repeat");
}

function drawTable() {
  const rg = ctx.createLinearGradient(0, 0, CW, CH);
  rg.addColorStop(0, "#160701");
  rg.addColorStop(0.2, "#5a240a");
  rg.addColorStop(0.45, "#8b3e14");
  rg.addColorStop(0.55, "#6b2e0e");
  rg.addColorStop(0.8, "#8b3e14");
  rg.addColorStop(1, "#160701");
  ctx.fillStyle = rg;
  ctx.beginPath();
  ctx.roundRect(0, 0, CW, CH, 6);
  ctx.fill();
  ctx.strokeStyle = "rgba(201,168,76,.2)";
  ctx.lineWidth = 0.8;
  [4, 9, 14].forEach((o) => ctx.strokeRect(o, o, CW - o * 2, CH - o * 2));

  if (!feltPat) makeFelt();
  ctx.fillStyle = feltPat;
  ctx.fillRect(FX, FY, PW, PH);

  const fv = ctx.createRadialGradient(
    FX + PW / 2,
    FY + PH / 2,
    PH * 0.1,
    FX + PW / 2,
    FY + PH / 2,
    PW * 0.65,
  );
  fv.addColorStop(0, "rgba(30,120,55,.08)");
  fv.addColorStop(1, "rgba(0,0,0,.35)");
  ctx.fillStyle = fv;
  ctx.fillRect(FX, FY, PW, PH);

  [
    [FX, FY, PW, 13],
    [FX, FY + PH - 13, PW, 13],
    [FX, FY, 13, PH],
    [FX + PW - 13, FY, 13, PH],
  ].forEach(([x, y, w, h]) => {
    const cg = ctx.createLinearGradient(
      x,
      y,
      x + (w > h ? 0 : w),
      y + (h > w ? 0 : h),
    );
    cg.addColorStop(0, "rgba(0,0,0,.45)");
    cg.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = cg;
    ctx.fillRect(x, y, w, h);
  });

  const bX = FX + PW * 0.44;
  ctx.strokeStyle = "rgba(255,255,255,.14)";
  ctx.lineWidth = 1.5;
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(bX, FY + 10);
  ctx.lineTo(bX, FY + PH - 10);
  ctx.stroke();
  const dR = PH * 0.18;
  ctx.beginPath();
  ctx.arc(bX, FY + PH / 2, dR, -Math.PI / 2, Math.PI / 2);
  ctx.stroke();

  ctx.fillStyle = "rgba(255,255,255,.25)";
  Object.values(C_SPOTS).forEach((s) => {
    ctx.beginPath();
    ctx.arc(s.x, s.y, 2, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.fillStyle = "rgba(201,168,76,.38)";
  [FY + PH * 0.25, FY + PH * 0.5, FY + PH * 0.75].forEach((y) => {
    dia(FX - RAIL * 0.42, y, 4);
    dia(FX + PW + RAIL * 0.42, y, 4);
  });
  [FX + PW * 0.25, FX + PW * 0.5, FX + PW * 0.75].forEach((x) => {
    dia(x, FY - RAIL * 0.42, 4);
    dia(x, FY + PH + RAIL * 0.42, 4);
  });
}

function dia(x, y, s) {
  ctx.beginPath();
  ctx.moveTo(x, y - s);
  ctx.lineTo(x + s * 0.6, y);
  ctx.lineTo(x, y + s);
  ctx.lineTo(x - s * 0.6, y);
  ctx.closePath();
  ctx.fill();
}

function drawPockets() {
  POCKETS.forEach((p) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, PR + 5, 0, Math.PI * 2);
    ctx.fillStyle = "#100600";
    ctx.fill();
    const g = ctx.createRadialGradient(p.x - 2, p.y - 2, 0, p.x, p.y, PR + 2);
    g.addColorStop(0, "#010000");
    g.addColorStop(0.7, "#080400");
    g.addColorStop(1, "rgba(20,6,2,.6)");
    ctx.beginPath();
    ctx.arc(p.x, p.y, PR + 2, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(p.x, p.y, PR + 4, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(201,168,76,.5)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  });
}

function drawBall(b) {
  if (!b.onTable) return;
  const { x, y, r, col } = b;
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,.7)";
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 4;
  const bg = ctx.createRadialGradient(
    x - r * 0.3,
    y - r * 0.33,
    r * 0.04,
    x + r * 0.1,
    y + r * 0.1,
    r * 1.05,
  );
  bg.addColorStop(0, lh(col, 70));
  bg.addColorStop(0.3, lh(col, 20));
  bg.addColorStop(0.7, col);
  bg.addColorStop(1, dk(col, 55));
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = bg;
  ctx.fill();
  ctx.shadowColor = "transparent";
  const sg = ctx.createRadialGradient(
    x - r * 0.38,
    y - r * 0.42,
    0,
    x - r * 0.08,
    y - r * 0.14,
    r * 0.65,
  );
  sg.addColorStop(0, "rgba(255,255,255,.88)");
  sg.addColorStop(0.4, "rgba(255,255,255,.18)");
  sg.addColorStop(1, "rgba(255,255,255,0)");
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = sg;
  ctx.fill();
  if (b.kind !== "white" && b.kind !== "red") {
    ctx.fillStyle = "rgba(255,255,255,.72)";
    ctx.font = `bold ${r * 0.92}px Cinzel,serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(b.pts, x, y + 0.5);
  }
  ctx.restore();
}

function rayDist(ox, oy, dx, dy, skipBall) {
  let minT = 2000,
    hitBall = null;
  for (const b of balls) {
    if (b === skipBall || !b.onTable) continue;
    const ex = b.x - ox,
      ey = b.y - oy;
    const proj = ex * dx + ey * dy;
    if (proj <= 0) continue;
    const perp = Math.abs(ex * dy - ey * dx);
    if (perp >= R * 2) continue;
    const t = proj - Math.sqrt(Math.max(0, (R * 2) ** 2 - perp * perp));
    if (t > R * 0.5 && t < minT) {
      minT = t;
      hitBall = b;
    }
  }
  const wt = [];
  if (Math.abs(dx) > 0.001) {
    wt.push((FX + R - ox) / dx);
    wt.push((FX + PW - R - ox) / dx);
  }
  if (Math.abs(dy) > 0.001) {
    wt.push((FY + R - oy) / dy);
    wt.push((FY + PH - R - oy) / dy);
  }
  for (const t of wt)
    if (t > 2 && t < minT) {
      minT = t;
      hitBall = null;
    }
  return { t: minT, ball: hitBall };
}

function getAng() {
  if (aiOn) return aiAng;
  if (aimLocked) return lockAng;
  return Math.atan2(mY - cue.y, mX - cue.x);
}

function drawAimAndCue() {
  if (phase !== "aiming" || !cue.onTable) return;
  const ang = getAng(),
    dx = Math.cos(ang),
    dy = Math.sin(ang);
  const ox = cue.x,
    oy = cue.y;
  ctx.save();

  const ray = rayDist(ox, oy, dx, dy, cue);
  ctx.setLineDash([9, 7]);
  ctx.strokeStyle = aiOn ? "rgba(136,204,255,.22)" : "rgba(255,255,255,.2)";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(ox + dx * R, oy + dy * R);
  ctx.lineTo(ox + dx * ray.t, oy + dy * ray.t);
  ctx.stroke();

  ctx.setLineDash([]);
  ctx.strokeStyle = aiOn ? "rgba(136,204,255,.5)" : "rgba(255,245,160,.5)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(ox + dx * (R + 1), oy + dy * (R + 1));
  ctx.lineTo(ox + dx * Math.min(60, ray.t), oy + dy * Math.min(60, ray.t));
  ctx.stroke();

  if (ray.ball) {
    const gx = ox + dx * ray.t,
      gy = oy + dy * ray.t;
    ctx.globalAlpha = 0.35;
    const gc = ctx.createRadialGradient(
      gx - R * 0.3,
      gy - R * 0.35,
      0,
      gx,
      gy,
      R,
    );
    gc.addColorStop(0, "rgba(255,255,255,.9)");
    gc.addColorStop(1, "rgba(200,200,200,.1)");
    ctx.beginPath();
    ctx.arc(gx, gy, R, 0, Math.PI * 2);
    ctx.fillStyle = gc;
    ctx.fill();
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.arc(gx, gy, R, 0, Math.PI * 2);
    ctx.strokeStyle = aiOn ? "rgba(136,204,255,.9)" : "rgba(255,255,180,.9)";
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.globalAlpha = 1;
    const nx = (gx - ray.ball.x) / (R * 2),
      ny = (gy - ray.ball.y) / (R * 2);
    arrow(
      ray.ball.x,
      ray.ball.y,
      ray.ball.x - nx * 55,
      ray.ball.y - ny * 55,
      "rgba(255,200,55,.7)",
    );
    const dot = dx * nx + dy * ny,
      cdx = dx - nx * dot * 2,
      cdy = dy - ny * dot * 2,
      cd = Math.sqrt(cdx * cdx + cdy * cdy) || 1;
    arrow(
      gx,
      gy,
      gx + (cdx / cd) * 32,
      gy + (cdy / cd) * 32,
      "rgba(170,220,255,.5)",
    );
  }

  const curPwr = aiOn ? aiPwr : power;
  const pull = R + 4 + curPwr * 90;
  const sx = ox - dx * pull,
    sy = oy - dy * pull,
    el = 210;
  const ex = sx - dx * el,
    ey = sy - dy * el;
  if (charging && power > 0.08 && !aiOn) {
    ctx.beginPath();
    ctx.arc(sx, sy, 5 + power * 5, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(100,200,255,${power * 0.4})`;
    ctx.fill();
  }
  const cg = ctx.createLinearGradient(sx, sy, ex, ey);
  cg.addColorStop(0, aiOn ? "#88ccff" : "#5bc8f5");
  cg.addColorStop(0.04, "#e0d5b0");
  cg.addColorStop(0.15, "#f5e8c2");
  cg.addColorStop(0.5, "#d4a84b");
  cg.addColorStop(0.75, "#8b4a14");
  cg.addColorStop(1, "#1e0901");
  ctx.lineCap = "round";
  ctx.lineWidth = 6;
  ctx.strokeStyle = "#180802";
  ctx.beginPath();
  ctx.moveTo(sx, sy);
  ctx.lineTo(ex, ey);
  ctx.stroke();
  ctx.lineWidth = 4;
  ctx.strokeStyle = cg;
  ctx.beginPath();
  ctx.moveTo(sx, sy);
  ctx.lineTo(ex, ey);
  ctx.stroke();
  const px = -dy,
    py = dx;
  ctx.lineWidth = 0.9;
  ctx.strokeStyle = "rgba(255,255,255,.18)";
  ctx.beginPath();
  ctx.moveTo(sx + px * 1.5, sy + py * 1.5);
  ctx.lineTo(ex + px * 1.5, ey + py * 1.5);
  ctx.stroke();
  ctx.restore();
}

function arrow(x1, y1, x2, y2, clr) {
  const ang = Math.atan2(y2 - y1, x2 - x1),
    ah = 9;
  ctx.save();
  ctx.strokeStyle = clr;
  ctx.fillStyle = clr;
  ctx.lineWidth = 1.8;
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - ah * Math.cos(ang - 0.38), y2 - ah * Math.sin(ang - 0.38));
  ctx.lineTo(x2 - ah * Math.cos(ang + 0.38), y2 - ah * Math.sin(ang + 0.38));
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

// ── PHYSICS ───────────────────────────────────────────────────
function shoot(ang, pwr) {
    if (phase !== 'aiming' || !cue.onTable) return;
    cue.vx = Math.cos(ang) * pwr * 22 + spin.x * 1.5;
    cue.vy = Math.sin(ang) * pwr * 22 + spin.y * 1.5;
    sStrike(pwr);
    phase = 'rolling'; pottedThisTurn = []; aimLocked = false; aiOn = false;
}


// ── PHYSICS ───────────────────────────────────────────────────
function physStep() {
    if (phase !== 'rolling') return;
        let moving = false;
        for (const b of balls) {
            if (!b.onTable) continue;
            const spd = Math.sqrt(b.vx ** 2 + b.vy ** 2);
            if (spd > STOP) moving = true;
            b.x += b.vx; b.y += b.vy;
            b.vx *= FRIC; b.vy *= FRIC;
            if (Math.abs(b.vx) < STOP * .5) b.vx = 0;
            if (Math.abs(b.vy) < STOP * .5) b.vy = 0;
            // Cushion bounces
            if (b.x - R < FX) { b.x = FX + R; b.vx = Math.abs(b.vx) * .75; sWall(Math.abs(b.vx)) }
            if (b.x + R > FX + PW) { b.x = FX + PW - R; b.vx = -Math.abs(b.vx) * .75; sWall(Math.abs(b.vx)) }
            if (b.y - R < FY) { b.y = FY + R; b.vy = Math.abs(b.vy) * .75; sWall(Math.abs(b.vy)) }
            if (b.y + R > FY + PH) { b.y = FY + PH - R; b.vy = -Math.abs(b.vy) * .75; sWall(Math.abs(b.vy)) }
    }
    // Ball-ball collisions
    for (let i = 0; i < balls.length; i++) {
    const a = balls[i]; if (!a.onTable) continue;
    for (let j = i + 1; j < balls.length; j++) {
        const b = balls[j]; if (!b.onTable) continue;
        const dx = b.x - a.x, dy = b.y - a.y, d = Math.sqrt(dx * dx + dy * dy);
        if (d < R * 2 && d > 0.01) {
        const ov = (R * 2 - d) / 2, nx = dx / d, ny = dy / d;
        a.x -= nx * ov; a.y -= ny * ov; b.x += nx * ov; b.y += ny * ov;
        const rel = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;
        if (rel > 0) {
            a.vx -= rel * nx; a.vy -= rel * ny; b.vx += rel * nx; b.vy += rel * ny;
            sHit(Math.abs(rel));
            }
          }
        }
      }
      // Pocket sink
      for (const b of balls) {
        if (!b.onTable) continue;
        for (const p of POCKETS) {
          if (Math.sqrt((b.x - p.x) ** 2 + (b.y - p.y) ** 2) < PR) {
            b.onTable = false; b.vx = 0; b.vy = 0;
            pottedThisTurn.push(b.id); sPocket(); break;
          }
        }
      }
      if (!moving) { phase = 'judging'; setTimeout(judgeShot, 150) }
    }

// ── RULES ─────────────────────────────────────────────────────
function redsLeft() {
  return balls.filter((b) => b.kind === "red" && b.onTable).length;
}
function coloursLeft() {
  return balls.filter(
    (b) => b.kind !== "red" && b.kind !== "white" && b.onTable,
  ).length;
}

function respotBall(id) {
  const b = balls.find((x) => x.id === id);
  if (!b) return;
  // In final phase, do NOT respot colors that have been potted
  if (allRed && b.kind !== "red" && b.kind !== "white") {
    if (pottedInFinalPhase.includes(b.id)) return;
  }
  const pos = spotOk(b.sx, b.sy) ? { x: b.sx, y: b.sy } : findSpot(b.sx, b.sy);
  b.x = pos.x;
  b.y = pos.y;
  b.vx = 0;
  b.vy = 0;
  b.onTable = true;
}
function spotOk(x, y) {
  return !balls.some((b) => b.onTable && D({ x, y }, b) < R * 2.2);
}
function findSpot(ox, oy) {
  for (let d = 12; d < 500; d += 10)
    for (let a = 0; a < Math.PI * 2; a += 0.25) {
      const x = ox + Math.cos(a) * d,
        y = oy + Math.sin(a) * d;
      if (
        x > FX + R &&
        x < FX + PW - R &&
        y > FY + R &&
        y < FY + PH - R &&
        spotOk(x, y)
      )
        return { x, y };
    }
  return { x: ox, y: oy };
}
function placeInD() {
  cue.x = FX + PW * 0.33;
  cue.y = FY + PH / 2;
  cue.vx = 0;
  cue.vy = 0;
  cue.onTable = true;
}
function swapPlayer() {
  curP = 1 - curP;
  brk = 0;
}
const isAI = () => GMODE === "ai" && curP === 1;

function judgeShot() {
  const pt = pottedThisTurn.slice();
  const wIn = pt.includes("white");
  const reds = pt.filter((id) => {
    const b = balls.find((x) => x.id === id);
    return b && b.kind === "red";
  });
  const cols = pt.filter((id) => {
    const b = balls.find((x) => x.id === id);
    return b && b.kind !== "red" && b.kind !== "white";
  });
  const rL = redsLeft();
  let foul = false,
    fp = 4,
    msg = "";

  if (wIn) {
    foul = true;
    fp = 4;
    msg = '<span class="foul">⚠ Cue ball potted — FOUL +4</span>';
    placeInD();
  }

  if (!foul) {
    if (!allRed) {
      if (needRed) {
        if (reds.length > 0) {
          scores[curP] += reds.length;
          brk += reds.length;
          msg = `<span class="ok">✓ ${reds.length} Red${reds.length > 1 ? "s" : ""} +${reds.length}pt${reds.length > 1 ? "s" : ""} · Pot a colour</span>`;
          needRed = false;
          if (rL === 0) {
            allRed = true;
            needRed = true;
          }
        } else if (cols.length > 0) {
          fp = Math.max(
            4,
            ...cols.map((id) => {
              const b = balls.find((x) => x.id === id);
              return b ? b.pts : 4;
            }),
          );
          foul = true;
          msg = `<span class="foul">⚠ Must pot red — FOUL +${fp}</span>`;
          cols.forEach(respotBall);
        } else {
          msg = "No ball potted · Switch player";
          swapPlayer();
        }
      } else {
        if (cols.length > 0) {
          const b = balls.find((x) => x.id === cols[0]),
            pts = b ? b.pts : 0;
          scores[curP] += pts;
          brk += pts;
          msg = `<span class="ok">✓ ${cap(b ? b.kind : "colour")} +${pts}pts · Pot a red</span>`;
          if (rL > 0) {
            respotBall(cols[0]);
          }
          needRed = true;
          if (rL === 0) {
            allRed = true;
          }
        } else if (reds.length > 0) {
          foul = true;
          fp = 4;
          msg = '<span class="foul">⚠ Must pot colour — FOUL +4</span>';
        } else {
          msg = "No ball potted · Switch player";
          swapPlayer();
          needRed = true;
        }
      }
    } else {
      // FINAL PHASE - ALL REDS GONE
      const nextColor = C_ORDER.find((c) =>
        balls.find((b) => b.id === c && b.onTable),
      );

      if (!nextColor) {
        endFrame();
        return;
      }

      if (cols.length > 0 && cols[0] === nextColor) {
        // CORRECT color potted - DO NOT RESPAWN
        const b = balls.find((x) => x.id === nextColor),
          pts = b ? b.pts : 0;
        scores[curP] += pts;
        brk += pts;
        pottedInFinalPhase.push(nextColor);
        msg = `<span class="ok">✓ ${cap(nextColor)} +${pts}pts!</span>`;
        // Continue with next color
      } else if (cols.length > 0) {
        // WRONG color potted - FOUL and respawn
        const b = balls.find((x) => x.id === nextColor);
        fp = Math.max(4, b ? b.pts : 4);
        foul = true;
        msg = `<span class="foul">⚠ Wrong colour — FOUL +${fp}</span>`;
        cols.forEach(respotBall);
      } else {
        msg = "No ball potted · Switch player";
        swapPlayer();
      }

      // Check if all colors are potted (game over)
      const remainingColors = C_ORDER.filter(c => {
        const ball = balls.find(b => b.id === c);
        return ball && ball.onTable;
      });
      
      if (remainingColors.length === 0) {
        endFrame();
        return;
      }
    }
  }

  if (foul) {
    scores[1 - curP] += fp;
    brk = 0;
    swapPlayer();
    needRed = true;
  }

  const turnMsg = isAI()
    ? '<span class="ai">🔥 AI\'s turn…</span>'
    : "Your turn — aim & shoot";
  updateUI(msg || turnMsg);
  phase = "aiming";
  if (isAI()) triggerAI();
}

function endFrame() {
  const who =
    GMODE === "2p"
      ? scores[0] > scores[1]
        ? "Player 1"
        : "Player 2"
      : scores[0] > scores[1]
        ? "You win!"
        : "AI wins!";
  updateUI(`<span class="hi">🏆 ${who}</span>`);
  frameN++;
  setTimeout(() => {
    if (confirm(`Frame over! ${who}\nPlay next frame?`)) initGame();
  }, 700);
}

 // ════════════════════════════════════════════════════════════════
    //  AI ENGINE v2 — Hard mode significantly upgraded
    //  • Ghost-ball geometry with simulation verification
    //  • Advanced positional scoring (cue ball angle to next target)
    //  • Strategic safety play when no pot available
    //  • Smarter break shot (targets most exposed red)
    //  • Hard: near-perfect accuracy, aggressive multi-ball planning
    //  • One-cushion trick shots on Expert when all direct lines blocked
    // ════════════════════════════════════════════════════════════════

    const AI_DIFF = {
      easy:   { noise: 0.13,  miss: 0.48, thinkMs: 600,  trickShots: false, safetyPlay: false },
      medium: { noise: 0.032, miss: 0.08, thinkMs: 950,  trickShots: false, safetyPlay: true  },
      hard:   { noise: 0.004, miss: 0.0,  thinkMs: 1300, trickShots: true,  safetyPlay: true  },
    };

    // Silent physics clone
    function aiClone() { return balls.map(b => ({ ...b })); }

    function aiPhys(bs, steps) {
      const sunk = [];
      const PHY_F = 0.9835, PHY_S = 0.08, PHY_REST = 0.80, PHY_PR_C = 20, PHY_PR_M = 24;
      for (let s = 0; s < steps; s++) {
        let mv = false;
        for (const b of bs) {
          if (!b.onTable) continue;
          // Sub-step to prevent tunneling
          for (let ss = 0; ss < 2; ss++) {
            b.x += b.vx * 0.5; b.y += b.vy * 0.5;
            for (let pi = 0; pi < POCKETS.length; pi++) {
              const p = POCKETS[pi], pr = (pi===1||pi===4) ? PHY_PR_M : PHY_PR_C;
              if (Math.hypot(b.x-p.x, b.y-p.y) < pr) {
                b.onTable=false; b.vx=0; b.vy=0; sunk.push(b.id); break;
              }
            }
            if (!b.onTable) break;
          }
          if (!b.onTable) continue;
          b.vx *= PHY_F; b.vy *= PHY_F;
          if (Math.abs(b.vx) < PHY_S*0.4) b.vx=0; if (Math.abs(b.vy) < PHY_S*0.4) b.vy=0;
          if (b.x-R<FX)       { b.x=FX+R;     b.vx= Math.abs(b.vx)*PHY_REST; }
          else if (b.x+R>FX+PW){ b.x=FX+PW-R; b.vx=-Math.abs(b.vx)*PHY_REST; }
          if (b.y-R<FY)       { b.y=FY+R;     b.vy= Math.abs(b.vy)*PHY_REST; }
          else if (b.y+R>FY+PH){ b.y=FY+PH-R; b.vy=-Math.abs(b.vy)*PHY_REST; }
          if (b.vx || b.vy) mv = true;
        }
        for (let i=0; i<bs.length; i++) {
          const a=bs[i]; if (!a.onTable) continue;
          for (let j=i+1; j<bs.length; j++) {
            const b=bs[j]; if (!b.onTable) continue;
            const dx=b.x-a.x, dy=b.y-a.y, d=Math.sqrt(dx*dx+dy*dy);
            if (d < R*2 && d > 0.01) {
              const ov=(R*2-d)/2, nx=dx/d, ny=dy/d;
              a.x-=nx*ov; a.y-=ny*ov; b.x+=nx*ov; b.y+=ny*ov;
              const rel=(a.vx-b.vx)*nx+(a.vy-b.vy)*ny;
              if (rel>0) { a.vx-=rel*nx; a.vy-=rel*ny; b.vx+=rel*nx; b.vy+=rel*ny; }
            }
          }
        }
        if (!mv) break;
      }
      const cf = bs.find(b => b.id === 'white');
      return { sunk, cueFX: cf?cf.x:0, cueFY: cf?cf.y:0, cueIn: !cf||!cf.onTable };
    }

    function aiSim(ang, pwr) {
      const bs = aiClone();
      const cb = bs.find(b => b.id === 'white');
      if (!cb || !cb.onTable) return null;
      cb.vx = Math.cos(ang)*pwr*22; cb.vy = Math.sin(ang)*pwr*22;
      return aiPhys(bs, 1800);
    }

    function ghostAngle(tgt, pocket) {
      const tpx = pocket.x - tgt.x, tpy = pocket.y - tgt.y;
      const tpd = Math.sqrt(tpx*tpx + tpy*tpy);
      if (tpd < 1) return null;
      const ux = tpx/tpd, uy = tpy/tpd;
      const gx = tgt.x - ux*R*2, gy = tgt.y - uy*R*2;
      const cgx = gx - cue.x, cgy = gy - cue.y;
      const cgd = Math.sqrt(cgx*cgx + cgy*cgy);
      if (cgd < 2) return null;
      const ang = Math.atan2(cgy, cgx);
      const udx = cgx/cgd, udy = cgy/cgd;
      let blocked = false;
      for (const b of balls) {
        if (b===cue || b===tgt || !b.onTable) continue;
        const ex=b.x-cue.x, ey=b.y-cue.y;
        const proj=ex*udx+ey*udy;
        if (proj < R || proj > cgd-R) continue;
        const perp=Math.abs(ex*udy-ey*udx);
        if (perp < R*2-0.5) { blocked=true; break; }
      }
      // Also check if target→pocket path is clear
      let pocketBlocked = false;
      for (const b of balls) {
        if (b===tgt || !b.onTable) continue;
        const ex=b.x-tgt.x, ey=b.y-tgt.y;
        const proj=ex*ux+ey*uy;
        if (proj < R || proj > tpd-R) continue;
        const perp=Math.abs(ex*uy-ey*ux);
        if (perp < R*1.8) { pocketBlocked=true; break; }
      }
      return { angle:ang, blocked, pocketBlocked, cueToDist:cgd, tgtToPocket:tpd, gx, gy };
    }

    function calcPower(cueDist, tgtDist) {
      const total = cueDist + tgtDist * 1.15;
      const needed = total / 1050;
      return Math.max(0.28, Math.min(0.94, needed + 0.10));
    }

    // Advanced positional scoring: rewards cue ball positions that
    // give a clear, well-angled approach to the NEXT target ball.
    function posScore(cueFX, cueFY, nextTargets) {
      if (!nextTargets.length) return 50;
      let best = 0;
      for (const t of nextTargets) {
        const d = D({ x:cueFX, y:cueFY }, t);
        // Sweet spot: 60-280px from next target
        const distScore = d < 40 ? d/40 : d < 280 ? 1 : Math.max(0, 1-(d-280)/350);
        // Prefer positions away from cushions (more angles available)
        const rail = Math.min(cueFX-FX, FX+PW-cueFX, cueFY-FY, FY+PH-cueFY);
        const railScore = rail > 50 ? 1 : rail / 50;
        // Prefer positions that give a clear line to the next target's pockets
        let angleClear = 0;
        for (const pocket of POCKETS) {
          const g = ghostAngle(t, pocket);
          if (g && !g.blocked && !g.pocketBlocked) {
            // How well does cue ball position align with this ghost angle?
            const dx = cueFX - g.gx, dy = cueFY - g.gy;
            const cd = Math.sqrt(dx*dx+dy*dy);
            if (cd < 300) angleClear = Math.max(angleClear, 1 - cd/300);
          }
        }
        best = Math.max(best, distScore * 60 + railScore * 25 + angleClear * 40);
      }
      return best;
    }

    function aiGetTargets() {
      if (!allRed) {
        if (needRed) return balls.filter(b => b.kind==='red' && b.onTable);
        return balls.filter(b => b.kind!=='red' && b.kind!=='white' && b.onTable);
      }
      const nC = C_ORDER.find(c => balls.find(b => b.id===c && b.onTable));
      return nC ? balls.filter(b => b.id===nC && b.onTable) : [];
    }

    function nextPool() {
      if (!allRed) {
        if (needRed) return balls.filter(b => b.kind!=='red' && b.kind!=='white' && b.onTable).sort((a,b)=>b.pts-a.pts);
        return balls.filter(b => b.kind==='red' && b.onTable);
      }
      const i = C_ORDER.findIndex(c => balls.find(b => b.id===c && b.onTable));
      const nx = C_ORDER[i+1];
      return nx ? balls.filter(b => b.id===nx && b.onTable) : [];
    }

    function computeAIShot() {
      const cfg = AI_DIFF[DIFF];

      // ── OPENING BREAK ──────────────────────────────────────────
      const allReds = balls.filter(b => b.kind==='red' && b.onTable);
      if (allReds.length === 15) {
        // Target the most exposed red (closest to an edge of the pack)
        const packCX = allReds.reduce((s,b)=>s+b.x,0)/allReds.length;
        const packCY = allReds.reduce((s,b)=>s+b.y,0)/allReds.length;
        // Find red closest to pack edge (farthest from center)
        const edgeRed = allReds.reduce((best,b) => D(b,{x:packCX,y:packCY}) > D(best,{x:packCX,y:packCY}) ? b : best);
        // Aim slightly off-center for a spread break
        const noise = DIFF==='easy' ? (Math.random()-0.5)*0.15 : (Math.random()-0.5)*0.04;
        return {
          angle: Math.atan2(packCY - cue.y, packCX - cue.x) + noise,
          power: DIFF==='hard' ? 0.98 : 0.92,
          type: 'break', label: 'Breaking off'
        };
      }

      const targets = aiGetTargets();
      if (!targets.length || !cue.onTable) return aiEmergency();

      const np = nextPool();
      const confirmed = [];

      // ── DIRECT POTS ────────────────────────────────────────────
      for (const tgt of targets) {
        for (const pocket of POCKETS) {
          const g = ghostAngle(tgt, pocket);
          if (!g || g.blocked || g.pocketBlocked) continue;
          if (Math.random() < cfg.miss) continue;

          const pwr = calcPower(g.cueToDist, g.tgtToPocket);
          const ang = g.angle + (Math.random()*2-1) * cfg.noise;

          const sim = aiSim(ang, pwr);
          if (!sim || sim.cueIn) continue;
          const potted = sim.sunk.some(id => { const b=balls.find(x=>x.id===id); return b && b.kind===tgt.kind; });
          if (!potted) continue;

          const ps = posScore(sim.cueFX, sim.cueFY, np);
          // Hard mode: heavily reward high-value targets and good position
          const diffBonus = DIFF==='hard' ? tgt.pts*30 + ps*0.8 : tgt.pts*20 + ps*0.5;
          // Penalise very long shots slightly (less reliable even at zero noise)
          const distPenalty = (g.cueToDist + g.tgtToPocket) * (DIFF==='hard' ? 0.02 : 0.04);
          const score = 300 + diffBonus - distPenalty;
          confirmed.push({ angle:ang, power:pwr, score, type:'direct', label:`Potting ${tgt.kind}` });
        }
      }

      // ── ONE-CUSHION TRICKS (Hard only, when no direct line) ────
      if (cfg.trickShots && confirmed.length === 0) {
        for (const tgt of targets) {
          for (const pocket of POCKETS) {
            const tpx=pocket.x-tgt.x, tpy=pocket.y-tgt.y, tpd=Math.sqrt(tpx*tpx+tpy*tpy);
            if (tpd<1) continue;
            const gx=tgt.x-(tpx/tpd)*R*2, gy=tgt.y-(tpy/tpd)*R*2;
            const mirrors = [
              [gx, 2*FY-gy],
              [gx, 2*(FY+PH)-gy],
              [2*FX-gx, gy],
              [2*(FX+PW)-gx, gy],
            ];
            for (const [mx,my] of mirrors) {
              const dx=mx-cue.x, dy=my-cue.y, d=Math.sqrt(dx*dx+dy*dy);
              if (d<10) continue;
              const ang = Math.atan2(dy,dx);
              const pwr = Math.max(0.40, Math.min(0.88, d/950+0.18));
              const sim = aiSim(ang+(Math.random()*2-1)*cfg.noise*0.5, pwr);
              if (!sim || sim.cueIn) continue;
              const potted = sim.sunk.some(id => { const b=balls.find(x=>x.id===id); return b&&b.kind===tgt.kind; });
              if (!potted) continue;
              const ps = posScore(sim.cueFX, sim.cueFY, np);
              confirmed.push({ angle:ang, power:pwr, score:240+tgt.pts*22+ps*0.5, type:'trick', label:'Cushion trick!' });
            }
          }
        }
      }

      // ── SAFETY PLAY (Medium/Hard when no pot found) ────────────
      if (confirmed.length === 0 && cfg.safetyPlay) {
        const safety = aiSafetyShot(targets);
        if (safety) return safety;
      }

      if (confirmed.length === 0) return aiEmergency();

      // Hard mode: pick from top 3 shots with slight randomness to be less robotic
      confirmed.sort((a,b) => b.score - a.score);
      if (DIFF === 'hard' && confirmed.length > 1) {
        const topN = Math.min(3, confirmed.length);
        const weights = confirmed.slice(0,topN).map((_,i) => 1/(i+1));
        const total = weights.reduce((s,w)=>s+w,0);
        let rnd = Math.random()*total;
        for (let i=0; i<topN; i++) { rnd -= weights[i]; if (rnd<=0) return confirmed[i]; }
      }
      return confirmed[0];
    }

    // Strategic safety shot: nudge target ball to cushion, hide cue ball
    function aiSafetyShot(targets) {
      let best = null, bestScore = -1;
      const attempts = DIFF==='hard' ? 40 : 25;
      for (let i=0; i<attempts; i++) {
        const tgt = targets[i % targets.length];
        // Gentle tap towards nearest cushion
        const angToTarget = Math.atan2(tgt.y-cue.y, tgt.x-cue.x);
        const ang = angToTarget + (Math.random()-0.5)*0.4;
        const pwr = 0.10 + Math.random()*0.20;
        const sim = aiSim(ang, pwr);
        if (!sim || sim.cueIn) continue;
        // Score: cue ball far from targets + close to cushion = good safety
        const allT = aiGetTargets();
        const minDistToTarget = Math.min(...allT.map(t => D({x:sim.cueFX,y:sim.cueFY}, t)));
        const rail = Math.min(sim.cueFX-FX, FX+PW-sim.cueFX, sim.cueFY-FY, FY+PH-sim.cueFY);
        const sc = minDistToTarget * 0.35 + (rail < 35 ? 50 : 0);
        if (sc > bestScore) { bestScore=sc; best={angle:ang, power:pwr, type:'safety', label:'Playing safe'}; }
      }
      return best;
    }

    function aiEmergency() {
      const t = aiGetTargets();
      if (!t.length || !cue.onTable) return null;
      const tgt = t.reduce((a,b) => D(cue,b)<D(cue,a) ? b : a);
      const d = D(cue, tgt);
      const pwr = calcPower(d, 0);
      return { angle:Math.atan2(tgt.y-cue.y, tgt.x-cue.x), power:pwr, type:'direct', label:'Hitting ball' };
    }

    // ── AI ANIMATION ──────────────────────────────────────────────
    function triggerAI() {
      if (!isAI() || phase !== 'aiming') return;

      aiOn = true;
      const cfg = AI_DIFF[DIFF];

      document.getElementById('aiDots').classList.add('show');

      const stmsg = document.getElementById('stmsg');

      stmsg.textContent = '';
      const analyzing = document.createElement('span');
      analyzing.className = 'ai';
      analyzing.textContent = '🔥 Analysing…';
      stmsg.appendChild(analyzing);

      setTimeout(() => {
        if (phase !== 'aiming') {
          aiOn = false;
          document.getElementById('aiDots').classList.remove('show');
          return;
        }

        const shot = computeAIShot();

        if (!shot) {
          aiOn = false;
          document.getElementById('aiDots').classList.remove('show');
          return;
        }

        stmsg.textContent = '';
        const shotSpan = document.createElement('span');
        shotSpan.className = 'ai';
        shotSpan.textContent = `🔥 ${shot.label || 'Shooting…'}`;
        stmsg.appendChild(shotSpan);

        aiSwingAndFire(shot);

      }, cfg.thinkMs);
    }

    function aiSwingAndFire(shot) {
      if (phase !== 'aiming') { aiOn = false; return }
      const startAng = aiAng || Math.atan2(mY - cue.y, mX - cue.x);
      const targetAng = shot.angle;
      let delta = targetAng - startAng;
      while (delta > Math.PI) delta -= Math.PI * 2;
      while (delta < -Math.PI) delta += Math.PI * 2;
      const dur = 420, t0 = Date.now();
      aiAng = startAng; aiPwr = 0;

      function swing() {
        if (phase !== 'aiming') { aiOn = false; document.getElementById('aiDots').classList.remove('show'); return }
        const t = Math.min((Date.now() - t0) / dur, 1);
        const e = t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        aiAng = startAng + delta * e;
        t < 1 ? requestAnimationFrame(swing) : chargeAndFire(shot);
      }
      requestAnimationFrame(swing);
    }

    function chargeAndFire(shot) {
      if (phase !== 'aiming') { aiOn = false; return }
      const dur = 350, t0 = Date.now();
      aiAng = shot.angle;

      function charge() {
        if (phase !== 'aiming') { aiOn = false; document.getElementById('aiDots').classList.remove('show'); return }
        const t = Math.min((Date.now() - t0) / dur, 1);
        aiPwr = t * shot.power;
        document.getElementById('pwrInner').style.width = (aiPwr * 100) + '%';
        if (t < 1) { requestAnimationFrame(charge) }
        else {
          document.getElementById('aiDots').classList.remove('show');
          document.getElementById('pwrInner').style.width = '0%';
          shoot(shot.angle, shot.power);
        }
      }
      requestAnimationFrame(charge);
    }

// ── UI ────────────────────────────────────────────────────────
function updateUI(msg) {
  document.getElementById("p1s").textContent = scores[0];
  document.getElementById("p2s").textContent = scores[1];
  document.getElementById("brkVal").textContent = brk;
  document.getElementById("redsVal").textContent = redsLeft();
  document.getElementById("frmVal").textContent = String(frameN).padStart(
    2,
    "0",
  );
  document.getElementById("p1b").classList.toggle("act", curP === 0);
  document.getElementById("p2b").classList.toggle("act", curP === 1);

  let ntxt = "Red",
    nc = "#c0392b";
  if (!allRed) {
    if (!needRed) {
      ntxt = "Any Colour";
      nc = "#c9a84c";
    }
  } else {
    const nC = C_ORDER.find((c) => balls.find((b) => b.id === c && b.onTable));
    if (nC) {
      ntxt = cap(nC);
      const b = balls.find((x) => x.id === nC);
      nc = b ? b.col : "#c9a84c";
    }
  }

  // NTXT (safe)
  const ntxtEl = document.getElementById("ntxt");
  ntxtEl.textContent = '';

  const span = document.createElement("span");
  span.style.color = nc;
  span.textContent = ntxt;

  ntxtEl.appendChild(span);

  // NDOT (safe, already fine)
  document.getElementById("ndot").style.background = nc;

  // RACK (safe, already good)
  const rack = document.getElementById("rack");
  rack.textContent = "";

  balls
    .filter((b) => b.onTable && b.kind !== "white")
    .forEach((b) => {
      const d = document.createElement("div");
      d.className = "rb";
      d.style.background = b.col;
      rack.appendChild(d);
    });

  // STATUS MESSAGE (safe)
  if (msg !== undefined) {
    const stmsg = document.getElementById("stmsg");
    stmsg.textContent = msg || "Aim & shoot";
  }
  }


  function setupNames() {
    if (GMODE === "ai") {
      document.getElementById("p1name").textContent = "YOU";

      // AI name container
      const p2name = document.getElementById("p2name");
      p2name.textContent = "";

      const aiText = document.createElement("span");
      aiText.textContent = "AI";

      const badge = document.createElement("span");
      badge.className = "aibadge";
      badge.textContent = "CPU";

      p2name.appendChild(aiText);
      p2name.appendChild(document.createTextNode(" "));
      p2name.appendChild(badge);

      document.getElementById("p2lbl").textContent = cap(DIFF) + " AI";
      document.getElementById("p2turn").textContent = "▸ AI thinking";
      document.getElementById("modeLbl").textContent = "vs AI · " + cap(DIFF);

    } else {
      document.getElementById("p1name").textContent = "PLAYER 1";
      document.getElementById("p2name").textContent = "PLAYER 2";
      document.getElementById("p2lbl").textContent = "Player Two";
      document.getElementById("p2turn").textContent = "▸ at table";
      document.getElementById("modeLbl").textContent = "2 Players";
    }
 }

function drawTableOn(c) {
  const rg = c.createLinearGradient(0, 0, CW, CH);
  rg.addColorStop(0, "#160701");
  rg.addColorStop(0.2, "#5a240a");
  rg.addColorStop(0.45, "#8b3e14");
  rg.addColorStop(0.55, "#6b2e0e");
  rg.addColorStop(0.8, "#8b3e14");
  rg.addColorStop(1, "#160701");
  c.fillStyle = rg;
  c.beginPath();
  c.roundRect(0, 0, CW, CH, 6);
  c.fill();
  c.strokeStyle = "rgba(201,168,76,.2)";
  c.lineWidth = 0.8;
  [4, 9, 14].forEach((o) => c.strokeRect(o, o, CW - o * 2, CH - o * 2));
  const off2 = document.createElement("canvas");
  off2.width = 8;
  off2.height = 8;
  const oc2 = off2.getContext("2d");
  oc2.fillStyle = "#0d5826";
  oc2.fillRect(0, 0, 8, 8);
  oc2.fillStyle = "rgba(0,0,0,.08)";
  oc2.fillRect(0, 0, 4, 4);
  oc2.fillRect(4, 4, 4, 4);
  oc2.fillStyle = "rgba(255,255,255,.015)";
  oc2.fillRect(4, 0, 4, 4);
  oc2.fillRect(0, 4, 4, 4);
  const pat = c.createPattern(off2, "repeat");
  c.fillStyle = pat;
  c.fillRect(FX, FY, PW, PH);
  const fv = c.createRadialGradient(
    FX + PW / 2,
    FY + PH / 2,
    PH * 0.1,
    FX + PW / 2,
    FY + PH / 2,
    PW * 0.65,
  );
  fv.addColorStop(0, "rgba(30,120,55,.08)");
  fv.addColorStop(1, "rgba(0,0,0,.35)");
  c.fillStyle = fv;
  c.fillRect(FX, FY, PW, PH);
  [
    [FX, FY, PW, 13],
    [FX, FY + PH - 13, PW, 13],
    [FX, FY, 13, PH],
    [FX + PW - 13, FY, 13, PH],
  ].forEach(([x, y, w, h]) => {
    const cg = c.createLinearGradient(
      x,
      y,
      x + (w > h ? 0 : w),
      y + (h > w ? 0 : h),
    );
    cg.addColorStop(0, "rgba(0,0,0,.45)");
    cg.addColorStop(1, "rgba(0,0,0,0)");
    c.fillStyle = cg;
    c.fillRect(x, y, w, h);
  });
  const bX = FX + PW * 0.44,
    dR = PH * 0.18;
  c.strokeStyle = "rgba(255,255,255,.14)";
  c.lineWidth = 1.5;
  c.setLineDash([]);
  c.beginPath();
  c.moveTo(bX, FY + 10);
  c.lineTo(bX, FY + PH - 10);
  c.stroke();
  c.beginPath();
  c.arc(bX, FY + PH / 2, dR, -Math.PI / 2, Math.PI / 2);
  c.stroke();
  c.fillStyle = "rgba(255,255,255,.25)";
  Object.values(C_SPOTS).forEach((s) => {
    c.beginPath();
    c.arc(s.x, s.y, 2, 0, Math.PI * 2);
    c.fill();
  });
  const cx2 = FX + PW / 2,
    cy2 = FY + PH / 2;
  c.fillStyle = "rgba(255,255,255,.18)";
  c.beginPath();
  c.moveTo(cx2, cy2 - 5);
  c.lineTo(cx2 + 4, cy2);
  c.lineTo(cx2, cy2 + 5);
  c.lineTo(cx2 - 4, cy2);
  c.closePath();
  c.fill();
  c.fillStyle = "rgba(201,168,76,.38)";
  function _dia(x, y, s) {
    c.beginPath();
    c.moveTo(x, y - s);
    c.lineTo(x + s * 0.6, y);
    c.lineTo(x, y + s);
    c.lineTo(x - s * 0.6, y);
    c.closePath();
    c.fill();
  }
  [FY + PH * 0.25, FY + PH * 0.5, FY + PH * 0.75].forEach((y) => {
    _dia(FX - RAIL * 0.42, y, 4);
    _dia(FX + PW + RAIL * 0.42, y, 4);
  });
  [FX + PW * 0.25, FX + PW * 0.5, FX + PW * 0.75].forEach((x) => {
    _dia(x, FY - RAIL * 0.42, 4);
    _dia(x, FY + PH + RAIL * 0.42, 4);
  });
}

function drawPocketsOn(c) {
  POCKETS.forEach((p) => {
    c.beginPath();
    c.arc(p.x, p.y, PR + 5, 0, Math.PI * 2);
    c.fillStyle = "#100600";
    c.fill();
    const g = c.createRadialGradient(p.x - 2, p.y - 2, 0, p.x, p.y, PR + 2);
    g.addColorStop(0, "#010000");
    g.addColorStop(0.7, "#080400");
    g.addColorStop(1, "rgba(20,6,2,.6)");
    c.beginPath();
    c.arc(p.x, p.y, PR + 2, 0, Math.PI * 2);
    c.fillStyle = g;
    c.fill();
    c.beginPath();
    c.arc(p.x, p.y, PR + 4, 0, Math.PI * 2);
    c.strokeStyle = "rgba(201,168,76,.5)";
    c.lineWidth = 1.5;
    c.stroke();
  });
}

let tableCache = null;
function buildTableCache() {
  const off = document.createElement("canvas");
  off.width = CW;
  off.height = CH;
  const oc = off.getContext("2d");
  drawTableOn(oc);
  drawPocketsOn(oc);
  tableCache = off;
}

let _lastT = 0,
  _accum = 0;
const TICK = 16;

function gameLoop(now) {
  const dt = Math.min(now - _lastT, 66);
  _lastT = now;
  _accum += dt;
  while (_accum >= TICK) {
    physStep();
    _accum -= TICK;
  }
  if (!tableCache) buildTableCache();
  ctx.clearRect(0, 0, CW, CH);
  ctx.drawImage(tableCache, 0, 0);
  balls.forEach(drawBall);
  drawAimAndCue();
  if (!aiOn)
    document.getElementById("pwrInner").style.width = power * 100 + "%";
  requestAnimationFrame(gameLoop);
}

// ── ACCURATE INPUT HANDLING ─────────────────────────────────────
canvas.addEventListener("mousemove", (e) => {
  if (isAI()) return;
  const coords = getCanvasCoords(e.clientX, e.clientY);
  mX = coords.x;
  mY = coords.y;
  
  if (!charging && phase === "aiming") {
    lockAng = Math.atan2(mY - cue.y, mX - cue.x);
    aimLocked = true;
  }
  
  if (charging) {
    power = Math.min((Date.now() - chStart) / 1000, 1);
  }
});

canvas.addEventListener("mousedown", (e) => {
  if (e.button !== 0 || phase !== "aiming" || !cue.onTable || isAI()) return;
  const coords = getCanvasCoords(e.clientX, e.clientY);
  lockAng = Math.atan2(coords.y - cue.y, coords.x - cue.x);
  aimLocked = true;
  charging = true;
  chStart = Date.now();
  power = 0;
});

canvas.addEventListener("mouseup", (e) => {
  if (e.button !== 0 || !charging || isAI()) return;
  charging = false;
  if (power > 0.02) shoot(lockAng, power);
  power = 0;
  aimLocked = false;
});

canvas.addEventListener("contextmenu", (e) => e.preventDefault());

let touchStartTime = null;
let touchStartPos = null;
let touchMoved = false;

canvas.addEventListener("touchstart", (e) => {
  e.preventDefault();
  if (isAI() || phase !== "aiming" || !cue.onTable) return;

  const touch = e.touches[0];
  const coords = getCanvasCoords(touch.clientX, touch.clientY);
  
  mX = coords.x;
  mY = coords.y;

  lockAng = Math.atan2(mY - cue.y, mX - cue.x);
  aimLocked = true;
  charging = true;
  touchStartTime = Date.now();
  touchStartPos = { x: mX, y: mY };
  touchMoved = false;
  power = 0;
  
  canvas.style.opacity = "0.9";
});

canvas.addEventListener("touchmove", (e) => {
  e.preventDefault();
  if (!charging || isAI()) return;

  const touch = e.touches[0];
  const coords = getCanvasCoords(touch.clientX, touch.clientY);
  const newX = coords.x;
  const newY = coords.y;

  if (touchStartPos) {
    const dx = newX - touchStartPos.x;
    const dy = newY - touchStartPos.y;
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      touchMoved = true;
      lockAng = Math.atan2(newY - cue.y, newX - cue.x);
      aimLocked = true;
    }
  }

  mX = newX;
  mY = newY;
  power = Math.min((Date.now() - touchStartTime) / 1000, 1);
});

canvas.addEventListener("touchend", (e) => {
  e.preventDefault();
  
  if (!charging || isAI()) {
    charging = false;
    power = 0;
    aimLocked = false;
    canvas.style.opacity = "1";
    return;
  }

  charging = false;

  if (power > 0.08) {
    shoot(lockAng, power);
  }

  power = 0;
  aimLocked = false;
  touchStartTime = null;
  touchStartPos = null;
  touchMoved = false;
  canvas.style.opacity = "1";
});

canvas.addEventListener("touchcancel", (e) => {
  e.preventDefault();
  charging = false;
  power = 0;
  aimLocked = false;
  canvas.style.opacity = "1";
});

document.querySelectorAll(".sb").forEach((b) => {
  b.addEventListener("click", () => {
    if (isAI()) return;
    document.querySelectorAll(".sb").forEach((x) => x.classList.remove("on"));
    b.classList.add("on");
    const M = {
      tl: { x: -1, y: -1 },
      t: { x: 0, y: -1 },
      tr: { x: 1, y: -1 },
      l: { x: -1, y: 0 },
      c: { x: 0, y: 0 },
      r: { x: 1, y: 0 },
      bl: { x: -1, y: 1 },
      b: { x: 0, y: 1 },
      br: { x: 1, y: 1 },
    };
    spin = M[b.dataset.s] || { x: 0, y: 0 };
  });
});

function setMode(m) {
  GMODE = m;
  document.getElementById("mAI").classList.toggle("sel", m === "ai");
  document.getElementById("m2P").classList.toggle("sel", m === "2p");
  document.getElementById("diffSec").style.display = m === "ai" ? "" : "none";
}
function setDiff(d) {
  DIFF = d;
  ["dE", "dM", "dH"].forEach((id) =>
    document.getElementById(id).classList.remove("sel"),
  );
  document
    .getElementById({ easy: "dE", medium: "dM", hard: "dH" }[d])
    .classList.add("sel");
}
function startGame() {
  document.getElementById("ov").style.display = "none";
  frameN = 1;
  setupNames();
  initGame();
  tableCache = null;
  _lastT = performance.now();
  _accum = 0;
  requestAnimationFrame(gameLoop);
}

// Add roundRect if not defined
if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    this.moveTo(x+r, y);
    this.lineTo(x+w-r, y);
    this.quadraticCurveTo(x+w, y, x+w, y+r);
    this.lineTo(x+w, y+h-r);
    this.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
    this.lineTo(x+r, y+h);
    this.quadraticCurveTo(x, y+h, x, y+h-r);
    this.lineTo(x, y+r);
    this.quadraticCurveTo(x, y, x+r, y);
    return this;
  };
}