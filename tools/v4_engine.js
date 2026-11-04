// ---------- v4: one continuous film. Every visual state is a function of scroll progress p ----------
const sec = $('#top'), stage = $('#stage');
const vis = $('#vis'), bgcorr = $('#bgcorr'), dim = $('#dim'), cloud = $('#cloud');
const HOLD = 65.5, VIS = 20.1; // the film rests on HOLD from the scan through the platform; VIS is the length of the Vision film
const mfade = $('#mfade');
const compactMQ = matchMedia('(max-width:1199px),(max-aspect-ratio:3/2)'), phoneMQ = matchMedia('(max-width:860px)');
const isCompact = () => compactMQ.matches, isPhone = () => phoneMQ.matches;
// [name, scroll weight in viewport heights, film time from, film time to, kind]
const SEG = [
  ['intro', 150, 0, 5.04, 'play'], ['d1', 170, 5.04, 10.08, 'stop'], ['trans1', 230, 10.08, 20.17, 'play'], ['enter', 110, 20.17, 25.21, 'play'],
  ['walk0', 110, 25.21, 30.25, 'play'], ['h1', 170, 30.25, 35.29, 'stop'], ['walk1', 110, 35.29, 40.33, 'play'], ['trans2', 190, 40.33, 50.42, 'play'],
  ['walk2', 110, 50.42, 55.46, 'play'], ['q1', 170, 55.46, 60.5, 'stop'], ['depart', 120, 60.5, HOLD, 'play'],
  ['scan', 180, HOLD, HOLD, 'scan'], ['plat', 260, HOLD, HOLD, 'plat'], ['toworld', 90, HOLD, HOLD, 'toworld'],
  ['brand', 330, HOLD, HOLD, 'brand'], ['contact', 230, HOLD, HOLD, 'contact'],
].map(a => ({ name: a[0], w: a[1], t0: a[2], t1: a[3], kind: a[4] }));
{ const total = SEG.reduce((s, g) => s + g.w, 0); let acc = 0; SEG.forEach(g => { g.p0 = acc / total; acc += g.w; g.p1 = acc / total; }); sec.style.height = (total + 100) + 'vh'; }
const SEGS = Object.fromEntries(SEG.map(g => [g.name, g]));
const RAIL = { intro: 1, d1: 1, trans1: 1, enter: 2, walk0: 2, h1: 2, walk1: 2, trans2: 2, walk2: 3, q1: 3, depart: 3, scan: 4, plat: 4, toworld: 5, brand: 5, contact: 6 };
const band = (p, a, b) => Math.min(1, Math.max(0, (p - a) / (b - a)));
const ease = u => u < .5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
const lerp = (a, b, u) => a + (b - a) * u;
function segAt(p) { for (const g of SEG) if (p < g.p1) return g; return SEG[SEG.length - 1]; }
function filmTime(g, u) { return lerp(g.t0, g.t1, u); }

const S = { target: 0, cur: 0 };
ScrollTrigger.create({ trigger: sec, start: 'top top', end: 'bottom bottom', onUpdate: s => { S.target = s.progress; } });
const railItems = $$('.rail a');
const scan = $('#scan'), gridfx = $('#gridfx'), hud = $('#hud'), tgt = $('#tgt');
let lastSeek = -1, lastVis = -1, needK = true, kApplied = 1;
const capEls = $$('#caps i'), CAPS = [[38, 30], [47, 36], [57, 24], [64, 38]];
const navLinks = $$('nav a');

// Where the subject sits across the frame (percent) by film time. Compact screens keep it centred
const CX = [[0, 30], [5.04, 47.5], [10.08, 47.5], [13, 40], [15.1, 32], [18, 30], [20.17, 52], [25.2, 50], [30.25, 55.6], [35.3, 55.6], [40.33, 53], [45.4, 58], [50.4, 38], [55.46, 64.7], [60.5, 64.7], [65.5, 50]];
// How wide the subject gets (percent of the frame). A narrow screen pulls back so the whole product always fits
const SW = [[0, 22], [3, 40], [5.04, 54], [10.08, 54], [13, 44], [15.1, 30], [20, 25], [30.25, 25], [40, 25], [45, 30], [50.4, 30], [52, 42], [53.5, 52], [55.46, 34], [60.5, 34], [61.5, 44], [63, 40], [65.5, 25]];
const VX = [[0, 42], [5, 62], [10, 80], [15, 60], [20, 45]];
function keyf(K, t) { if (t <= K[0][0]) return K[0][1]; for (let i = 0; i < K.length - 1; i++) if (t < K[i + 1][0]) return lerp(K[i][1], K[i + 1][1], (t - K[i][0]) / (K[i + 1][0] - K[i][0])); return K[K.length - 1][1]; }
let cropX = 50, kCur = 1, kTop = 0;
function cropFor(s, k) { const v = stW() / (stage.clientHeight * k * 16 / 9); if (v >= 1) return 50; return Math.max(0, Math.min(100, (s / 100 - v / 2) / (1 - v) * 100)); }
const stW = () => stage.clientWidth;
// Map a point in the 16:9 frame (percent) to stage pixels, honouring the cover fit, the crop and the phone framing
function fmap(px, py) {
  const W = stW(), H = stage.clientHeight * kCur, sc = Math.max(W / 16, H / 9), dw = 16 * sc, dh = 9 * sc;
  return [(W - dw) * (dw > W ? cropX / 100 : .5) + px / 100 * dw, kTop + (H - dh) / 2 + py / 100 * dh];
}

// ---- information reveal component ----
const STOP = $$('.stop').map(el => ({ el, seg: SEGS[el.id.slice(3)], ind: el.querySelector('.ind'), line: el.querySelector('polyline'), pnl: el.querySelector('.pnl'), ax: +el.dataset.ax, ay: +el.dataset.ay, cax: +el.dataset.cax, cay: +el.dataset.cay, box: el.dataset.box.split(',').map(Number), side: el.dataset.side, k: 1 }));
const hstop = STOP.find(s => s.seg === SEGS.h1);
// Wide screens: the panel takes only the room beside the subject, so it can never sit on the product
function fitPanel(s) {
  if (isCompact()) { s.pnl.style.maxWidth = ''; return; }
  if (s.side === 'bl') { s.pnl.style.maxWidth = ''; return; }
  const W = stW(), g = parseFloat(getComputedStyle(s.pnl).right) || 40, left = s.side === 'l' || s.side === 'tl';
  const free = left ? fmap(s.box[0], 0)[0] - s.pnl.offsetLeft - 20 : W - g - fmap(s.box[2], 0)[0] - 40;
  s.pnl.style.maxWidth = Math.max(260, Math.min(400, free)) + 'px';
}
// Compact screens: at a stop the camera pulls back so the whole product sits above its panel
function measureK() {
  const H = stage.clientHeight, W = stW();
  for (const s of STOP) {
    if (!isCompact()) { s.k = 1; continue; }
    s.pnl.style.maxWidth = '';
    // a product whose top reaches the frame edge is lowered so the header does not cover it
    s.top = s.box[1] < 5 ? hdr.offsetHeight + 6 : 0;
    const room = (s.pnl.offsetTop - 14 - s.top) / (H * s.box[3] / 100);
    s.k = Math.min(1, Math.max(.3, W * 9 / 16 / H, Math.min(room, W * 9 / 16 / H / ((s.box[2] - s.box[0]) * 1.12 / 100))));
  }
}
function kAt(p) {
  if (!isCompact()) return 1;
  const kOf = n => STOP.find(q => q.seg === SEGS[n]).k;
  if (p < SEGS.d1.p0) return kOf('d1');
  if (p >= SEGS.q1.p0 && p < SEGS.toworld.p1) return kOf('q1');
  for (let i = 0; i < SEG.length; i++) {
    const g = SEG[i]; if (g.kind !== 'stop') continue;
    const st = STOP.find(q => q.seg === g), prev = SEG[i - 1], next = SEG[i + 1];
    const a = band(p, g.p0 - (prev.p1 - prev.p0) * .22, g.p0), b = 1 - band(p, g.p1, g.p1 + (next.p1 - next.p0) * .22), amt = Math.min(a, b);
    if (amt > 0) return lerp(1, st.k, ease(amt));
  }
  return 1;
}
function drawStop(s, u) {
  const on = u > 0 && u < 1;
  s.el.classList.toggle('on', on);
  if (!on) return;
  fitPanel(s);
  const ind = Math.min(band(u, 0, .06), 1 - band(u, .94, 1)), ln = Math.min(band(u, .04, .16), 1 - band(u, .86, .96)), tx = Math.min(band(u, .12, .26), 1 - band(u, .84, .94));
  const compact = isCompact();
  let [ax, ay] = compact ? fmap((s.box[0] + s.box[2]) / 2, s.box[3] - 3) : fmap(s.ax, s.ay);
  const W = stW(), H = stage.clientHeight;
  ax = Math.min(W - 26, Math.max(26, ax)); ay = Math.min(H - 40, Math.max(96, ay));
  const st = stage.getBoundingClientRect(), r = s.pnl.getBoundingClientRect();
  const rl = r.left - st.left, rt = r.top - st.top, rr = r.right - st.left, rb = r.bottom - st.top;
  // the dot must never fall under its own panel
  if (ax > rl - 18 && ax < rr + 18 && ay > rt - 18 && ay < rb + 18) { if (compact || s.side === 'bl') ay = rt - 22; else ax = rl - 22; }
  s.ind.style.transform = `translate(${ax}px,${ay}px) scale(${.4 + .6 * ind})`; s.ind.style.opacity = ind;
  let tx0, ty0, ex, ey;
  if (compact) { tx0 = Math.min(rr - 24, Math.max(rl + 24, ax)); ty0 = rt; ex = tx0; ey = rt - Math.min(24, Math.max(0, rt - ay) * .5); }
  else if (s.side === 'bl') { tx0 = rr; ty0 = rt + 34; ex = tx0 + 28; ey = ty0; }
  else { tx0 = rl; ty0 = rt + 34; ex = tx0 - 28; ey = ty0; }
  const len = Math.hypot(ex - ax, ey - ay) + Math.hypot(tx0 - ex, ty0 - ey);
  s.line.setAttribute('points', [[ax, ay], [ex, ey], [tx0, ty0]].map(q => q.join(',')).join(' '));
  s.line.style.strokeDasharray = len; s.line.style.strokeDashoffset = len * (1 - ease(ln));
  s.line.style.opacity = ln > 0 ? 1 : 0;
  s.pnl.style.opacity = tx; s.pnl.style.transform = `translateY(${(1 - ease(tx)) * 14}px)`;
}

// ---- point cloud sampled from the film's last frame ----
const CL = { dots: null, ctx: cloud.getContext('2d'), w: 0, h: 0, dpr: Math.min(devicePixelRatio || 1, 1.5) };
function cloudSample() {
  if (film.readyState < 2 || film.seeking || Math.abs(film.currentTime - HOLD) > .06) return false;
  const c = document.createElement('canvas'); c.width = 144; c.height = 81; const x = c.getContext('2d');
  try { x.drawImage(film, 0, 0, 144, 81); } catch (e) { return false; }
  const d = x.getImageData(0, 0, 144, 81).data, dots = [];
  for (let j = 0; j < 81; j++) for (let i = 0; i < 144; i++) {
    const k = (j * 144 + i) * 4, l = (d[k] * .3 + d[k + 1] * .59 + d[k + 2] * .11) / 255;
    if (l < .1) continue;
    const n = ((i * 7919 + j * 104729) % 1000) / 1000, t = j / 81, q = Math.round((.35 + l * .65) * 5) / 5;
    dots.push({ x: (i + .5) / 144 * 100, y: (j + .5) / 81 * 100, r: t * .8 + n * .2, s: .6 + l * 2.4, c: `rgba(${Math.round(lerp(0, 60, Math.round(t * 8) / 8))},${Math.round(lerp(205, 140, Math.round(t * 8) / 8))},${Math.round(lerp(217, 255, Math.round(t * 8) / 8))},${q})` });
  }
  dots.sort((a, b) => a.c < b.c ? -1 : 1);
  CL.dots = dots; CL.key = ''; return true;
}
function cloudDraw(v, alpha) {
  const W = stW(), H = stage.clientHeight, key = [W, H, v.toFixed(3), alpha.toFixed(3), cropX.toFixed(1), !!CL.dots].join();
  if (key === CL.key) return; // nothing moved: the hold costs nothing
  CL.key = key;
  if (CL.w !== W || CL.h !== H) { CL.w = W; CL.h = H; cloud.width = W * CL.dpr; cloud.height = H * CL.dpr; }
  const x = CL.ctx; x.setTransform(CL.dpr, 0, 0, CL.dpr, 0, 0); x.clearRect(0, 0, W, H);
  if (!CL.dots || v <= 0 || alpha <= 0) return;
  let last = '';
  for (const d of CL.dots) {
    if (v <= d.r) continue;
    const a = Math.min(1, (v - d.r) / .1), [px, py] = fmap(d.x, d.y);
    if (d.c !== last) { x.fillStyle = d.c; last = d.c; }
    x.globalAlpha = alpha * a;
    x.fillRect(px - d.s / 2, py - d.s / 2, d.s, d.s);
  }
  x.globalAlpha = 1;
}

// ---- scenes ----
const railRoom = () => stage.clientHeight - $('#rail').offsetTop + 10;
const plat = $('#platScene'), pwrap = $('#pwrap'), brand = $('#brandScene'), contact = $('#contactScene'), cwrap = $('#cwrap'), phead = plat.querySelector('.phead');
let appStarted = false;
function scenePlat(rise, hold, sink, u) {
  const vis = Math.min(rise, 1 - sink);
  const platLive = hold > 0 && sink === 0; plat.style.opacity = vis > 0 ? 1 : 0; plat.classList.toggle('live', platLive); if (plat.inert === platLive) plat.inert = !platLive;
  phead.style.opacity = Math.min(band(rise, .15, .7), 1 - band(sink, 0, .5));
  const H = stage.clientHeight, top = pwrap.offsetTop, availH = H - top - railRoom(), cardH = pwrap.scrollHeight;
  let sc = 1, ty = 0;
  if (!isPhone()) sc = Math.min(1, availH / cardH);
  else ty = -Math.max(0, cardH - availH) * band(u, .3, .92);
  if (ty) phead.style.opacity = Math.min(+phead.style.opacity, 1 - band(-ty, 0, 24)); // phones: the heading clears as the card slides up over it
  const off = (1 - ease(rise)) * .14 * H + ease(sink) * .5 * H;
  pwrap.style.transform = `translateY(${off + ty}px) scale(${sc * (.9 + .1 * ease(rise))})`;
  pwrap.style.opacity = Math.min(ease(rise), 1 - ease(sink));
  if (rise > .6 && !appStarted) { appStarted = true; appTl.play(); }
}
let miniDone = false;
function miniBuild() {
  if (miniDone) return; miniDone = true;
  const m = $('#app').cloneNode(true); m.removeAttribute('id'); m.querySelectorAll('[id]').forEach(e => e.removeAttribute('id')); m.inert = true; m.classList.add('live'); m.querySelectorAll('img').forEach(i => { i.loading = 'eager'; i.style.opacity = 1; });
  $('#visplat').append(m); miniFit();
}
function miniFit() {
  const w = $('#visplat'), m = w.firstElementChild; if (!m) return;
  if (isPhone()) { m.style.width = ''; m.style.transform = ''; w.style.height = ''; return; }
  m.style.width = '1180px'; const sc = w.clientWidth / 1180; m.style.transform = `scale(${sc})`; w.style.height = (m.offsetHeight * sc) + 'px';
}
function sceneBrand(u) {
  const out = 1 - band(u, .95, 1), inn = band(u, .74, .8);
  brand.style.opacity = u > 0 && u < 1 ? 1 : 0;
  brand.querySelector('.eyebrow').style.opacity = Math.min(band(u, 0, .05), out);
  brand.querySelector('.bst').style.opacity = Math.min(inn, out); brand.querySelector('.bst').style.transform = `translateY(${(1 - ease(inn)) * 24}px)`;
  const b2 = band(u, .77, .83); brand.querySelector('.bsub').style.opacity = Math.min(b2, out); brand.querySelector('.bsub').style.transform = `translateY(${(1 - ease(b2)) * 18}px)`;
  // shot 5: the platform receives what the fleet captured. It is the real interface, never drawn into the footage
  const a = Math.min(band(u, .58, .63), 1 - band(u, .7, .74));
  if (a > 0) miniBuild();
  const vp = $('#visplat'); vp.style.opacity = a; vp.style.transform = `translateY(${(1 - ease(Math.min(1, band(u, .58, .63)))) * 26}px)`;
}
function sceneContact(u) {
  const contactLive = u > .05; contact.style.opacity = u > 0 ? 1 : 0; contact.classList.toggle('live', contactLive); if (contact.inert === contactLive) contact.inert = !contactLive;
  const inn = band(u, 0, .22), f = band(u, .08, .32);
  contact.querySelector('.ctext').style.opacity = inn; contact.querySelector('.ctext').style.transform = `translateY(${(1 - ease(inn)) * 24}px)`;
  const form = contact.querySelector('form'), foot = contact.querySelector('.cfoot');
  form.style.opacity = f; foot.style.opacity = band(u, .2, .4);
  const H = stage.clientHeight, over = Math.max(0, cwrap.scrollHeight - (H - cwrap.offsetTop - railRoom()));
  cwrap.style.transform = `translateY(${-over * band(u, .38, .96) + (1 - ease(f)) * 30}px)`;
}

// ---- the next video is fetched only as the visitor approaches it ----
let visReady = false, corrReady = false;
function nextAssets(p) {
  if (!visReady && p > SEGS.q1.p0) { visReady = true; vis.preload = 'auto'; vis.src = `media/vision-${mobile ? 960 : 1600}-e.mp4`; vis.load(); }
  if (!corrReady && p > SEGS.plat.p0) { corrReady = true; bgcorr.preload = 'auto'; bgcorr.src = `media/bg-corridor-${mobile ? 960 : 1600}.mp4`; bgcorr.load(); }
}
function vidOpacity(v, o) { v.style.opacity = o; if (o > 0.01) { if (v.paused && !reduce && v.src) { const pr = v.play(); if (pr) pr.catch(() => {}); } } else if (!v.paused) v.pause(); }

// ---- main loop ----
function frame(tms) {
  requestAnimationFrame(frame);
  S.cur += (S.target - S.cur) * 0.12;
  if (Math.abs(S.target - S.cur) < 0.00002) S.cur = S.target;
  const p = S.cur, g = segAt(p), u = band(p, g.p0, g.p1);
  // at a stop the footage keeps breathing even if the visitor stops scrolling: rotors stay blurred, robots stay alive
  let t = filmTime(g, u);
  if (g.kind === 'stop' && !reduce) t = Math.max(g.t0, Math.min(g.t1, t + Math.sin(tms / 1500) * .4 * Math.sin(Math.PI * u)));
  const loopA = 1 - band(p, 0.001, 0.012);
  loop.style.opacity = loopA;
  if (loopA === 0 && !loop.paused) loop.pause();
  if (loopA > 0 && loop.paused) loop.play().catch(() => {});
  const W = stW(), H = stage.clientHeight;
  cropX = isCompact() ? cropFor(keyf(CX, t), kCur) : 50;
  film.style.objectPosition = `${cropX}% 50%`;
  if (needK) { needK = false; pwrap.style.top = (phead.offsetTop + phead.offsetHeight + 14) + 'px'; measureK(); }
  kCur = isCompact() ? Math.min(kAt(p), Math.max(.3, W * 9 / 16 / H / (keyf(SW, t) * 1.1 / 100))) : 1;
  if (Math.abs(kCur - kApplied) > .0005) { film.style.height = loop.style.height = kCur < 1 ? (H * kCur) + 'px' : ''; kApplied = kCur; }
  loop.style.objectPosition = `${cropX}% 50%`;
  mfade.style.opacity = band(1 - kCur, 0, .05); mfade.style.transform = `translateY(${kTop + H * kCur - mfade.offsetHeight}px)`;
  if (film.readyState >= 2 && !film.seeking && Math.abs(t - lastSeek) > 1 / 48) { film.currentTime = t; lastSeek = t; }
  // hero words
  const c0 = chapters[0];
  if (!(p < 0.01 && !c0.classList.contains('on'))) { const on = p < SEGS.intro.p0 + (SEGS.intro.p1 - SEGS.intro.p0) * .45; c0.classList.toggle('on', on); c0.classList.toggle('out', !on); if (c0.inert === on) c0.inert = !on; }
  // reveals
  for (const s of STOP) drawStop(s, s.seg === g ? u : 0);
  // tracking box: only while the humanoid stands still, about 8% clear of the robot
  if (g === SEGS.h1) {
    const b = hstop.box, mx = (b[2] - b[0]) * .08, my = (b[3] - b[1]) * .08, [x0, y0] = fmap(b[0] - mx, b[1] - my), [x1, y1] = fmap(b[2] + mx, b[3] + my);
    const top = Math.max(y0, hdr.offsetHeight + 8), bot = Math.min(y1, H - 8);
    tgt.style.left = x0 + 'px'; tgt.style.top = top + 'px'; tgt.style.width = (x1 - x0) + 'px'; tgt.style.height = (bot - top) + 'px'; tgt.style.opacity = Math.min(band(u, 0, .06), 1 - band(u, .92, 1));
  } else tgt.style.opacity = 0;
  // scan to digital, platform hold, back into the world
  const inScan = g.name === 'scan', inPlat = g.name === 'plat', inWorld = g.name === 'toworld';
  const sv = inScan ? band(u, .05, .8) : (inPlat || inWorld) ? 1 : 0;
  if (sv > 0 && !CL.dots) cloudSample();
  const cloudA = inScan ? 1 : inPlat ? .4 : inWorld ? .4 * (1 - band(u, 0, .4)) : 0;
  cloudDraw(sv, cloudA);
  const sl = inScan ? band(u, 0, .7) : 0;
  scan.style.opacity = sl > 0 && sl < 1 ? 1 : 0; scan.style.transform = `translateY(${(sl * 1.1 - .05) * H}px)`;
  gridfx.style.opacity = inScan ? Math.sin(band(u, 0, 1) * Math.PI) * .9 : inPlat ? .35 : 0;
  // captured points appear as the scan passes them, then travel into the platform's map
  capEls.forEach((el, i) => {
    const c = CAPS[i], show = inScan ? Math.min(band(u, c[1] / 100 * .62, c[1] / 100 * .62 + .05), 1 - band(u, .9, .96)) : 0;
    el.style.opacity = show; if (!show) return;
    const m = ease(band(u, .62, .92)), [sx, sy] = fmap(c[0], c[1]), pin = $('#pins').children[i], r = pin && pin.getBoundingClientRect(), st = stage.getBoundingClientRect();
    const ex = r && r.width ? r.left + r.width / 2 - st.left : sx, ey = r && r.width ? r.top + r.height / 2 - st.top : sy;
    el.style.transform = `translate(${lerp(sx, ex, m)}px,${lerp(sy, ey, m)}px)`;
  });
  dim.style.opacity = inScan ? .5 * band(u, .25, .85) : (inPlat || inWorld) ? .5 : 0;
  hud.classList.toggle('on', p > SEGS.d1.p0 - .02 && p < SEGS.plat.p0);
  scenePlat(inScan ? band(u, .62, 1) : (inPlat || inWorld || p >= SEGS.toworld.p1) ? 1 : 0, inPlat ? 1 : 0, inWorld ? band(u, 0, .38) : p >= SEGS.toworld.p1 ? 1 : 0, inPlat ? u : p >= SEGS.plat.p1 ? 1 : 0);
  // environment loops
  nextAssets(p);
  const inV = g.name === 'brand', visA = inWorld ? band(u, .2, .7) : inV ? 1 - band(u, .95, 1) : 0, corrA = inV ? band(u, .95, 1) : g.name === 'contact' ? 1 : 0;
  vis.style.opacity = visA;
  if (visA > 0) {
    const vt = inV ? band(u, 0, .85) * VIS : 0;
    if (vis.readyState >= 2 && !vis.seeking && Math.abs(vt - lastVis) > 1 / 48) { vis.currentTime = vt; lastVis = vt; }
    vis.style.objectPosition = isCompact() ? `${cropFor(keyf(VX, vt), 1)}% 50%` : '';
  }
  vidOpacity(bgcorr, corrA);
  if (visA > 0) mfade.style.opacity = band(1 - kCur, 0, .05) * (1 - visA);
  film.style.opacity = p >= SEGS.toworld.p1 ? 0 : 1;
  sceneBrand(g.name === 'brand' ? u : p >= SEGS.brand.p1 ? 1 : 0);
  sceneContact(g.name === 'contact' ? u : 0);
  // chrome
  $('#rail').classList.add('show');
  hdr.classList.toggle('solid', p > SEGS.scan.p0 + (SEGS.scan.p1 - SEGS.scan.p0) * .6);
  // the highlight follows what is on screen: the footage only cuts to the next product at 15 s and 25 s
  const shown = g.name === 'intro' && u < .5 ? 0 : g.name === 'trans2' && t > 47.5 ? 3 : RAIL[g.name];
  navLinks.forEach((a, k) => a.classList.toggle('on', k + 1 === shown));
  railItems.forEach((el, k) => { el.classList.toggle('on', k === shown); if (k === shown) el.setAttribute('aria-current', 'step'); else el.removeAttribute('aria-current'); });
  $('#hint').style.opacity = p > 0.02 ? 0 : 1;
}
requestAnimationFrame(frame);
addEventListener('touchstart', () => { film.play().then(() => film.pause()).catch(() => {}); }, { once: true, passive: true });

// Navigation: every link jumps to a point on the timeline
function goTo(name) {
  const g = SEGS[name]; if (!g) return;
  const y = (g.p0 + (g.kind === 'stop' ? (g.p1 - g.p0) * .5 : g.kind === 'plat' ? (g.p1 - g.p0) * .15 : g.kind === 'brand' ? (g.p1 - g.p0) * .02 : g.kind === 'contact' ? (g.p1 - g.p0) * .35 : 0)) * (sec.offsetHeight - innerHeight);
  if (lenis) lenis.scrollTo(y, { duration: 2.2 }); else scrollTo({ top: y, behavior: 'smooth' });
}
$$('[data-go]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); goTo(a.dataset.go); }));
$('.logo').addEventListener('click', e => { e.preventDefault(); if (lenis) lenis.scrollTo(0, { duration: 2 }); else scrollTo({ top: 0, behavior: 'smooth' }); });
let rsW = innerWidth, rsKeep = null, rsT = 0;
addEventListener('resize', () => {
  needK = true; CL.key = ''; miniFit();
  if (innerWidth === rsW) return; // a phone's address bar hiding is not a real resize
  rsW = innerWidth; CL.dots = null;
  if (rsKeep === null) rsKeep = S.target;
  clearTimeout(rsT);
  rsT = setTimeout(() => {
    ScrollTrigger.refresh();
    const y = rsKeep * (sec.offsetHeight - innerHeight);
    if (lenis) lenis.scrollTo(y, { immediate: true }); else scrollTo(0, y);
    S.target = S.cur = rsKeep; rsKeep = null;
  }, 260);
});
if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { needK = true; });
