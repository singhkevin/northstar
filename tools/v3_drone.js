// Northstar /v3: the flying drone. A real 3D model (media/drone.glb, bought from Envato, converted with Blender: four
// separate rotors, one body, no textures) drawn on a transparent canvas over the page. Scroll position decides where
// it parks: named stations in the empty space beside the copy, read from the live layout. No station, no drone.
// The rotors spin all the time, so it hovers even when nothing is scrolling.
// Built with esbuild into site-v2/v3/drone.js by tools/build_v3.py.
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { DecalGeometry } from 'three/examples/jsm/geometries/DecalGeometry.js';

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches, DEBUG = /[?&]dronedebug/.test(location.search);
if (!reduce) start();

function start() {
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' }); } catch (e) { return; }
  const cv = renderer.domElement; cv.id = 'drone3d'; cv.setAttribute('aria-hidden', 'true'); document.body.appendChild(cv);
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  // Neutral keeps the pearl shell and the blue tips true to colour; ACES greyed them
  renderer.toneMapping = THREE.NeutralToneMapping; renderer.toneMappingExposure = 1.0;
  const rich = innerWidth >= 860;   // real self-shadowing on larger screens only
  if (rich) { renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; }

  const scene = new THREE.Scene();
  const FOV = 28, DIST = 6;
  const cam = new THREE.PerspectiveCamera(FOV, 1, .1, 60); cam.position.set(0, 0, DIST);
  const pm = new THREE.PMREMGenerator(renderer);
  scene.environment = pm.fromScene(new RoomEnvironment(), .04).texture; scene.environmentIntensity = .62;
  const key = new THREE.DirectionalLight(0xffffff, 2.1); key.castShadow = rich; scene.add(key, key.target);
  if (rich) { key.shadow.mapSize.set(1024, 1024); key.shadow.bias = -.0006; key.shadow.normalBias = .012; key.shadow.radius = 3; }
  const rim = new THREE.DirectionalLight(0xcfe0ff, 1.1); rim.position.set(4, 2, -3); scene.add(rim);

  // rotor blur: a soft two-lobed smear that turns with the blades, like a long camera exposure of a real prop
  const bc = document.createElement('canvas'); bc.width = bc.height = 256; const bx = bc.getContext('2d');
  const cg = bx.createConicGradient(0, 128, 128);
  [[0, .07], [.04, .2], [.25, .07], [.5, .07], [.54, .2], [.75, .07], [1, .07]].forEach(([t, al]) => cg.addColorStop(t, `rgba(84,92,104,${al})`));
  bx.fillStyle = cg; bx.fillRect(0, 0, 256, 256);
  const mk = bx.createRadialGradient(128, 128, 0, 128, 128, 128);
  mk.addColorStop(.1, 'rgba(0,0,0,0)'); mk.addColorStop(.35, 'rgba(0,0,0,.75)'); mk.addColorStop(.86, 'rgba(0,0,0,1)'); mk.addColorStop(1, 'rgba(0,0,0,0)');
  bx.globalCompositeOperation = 'destination-in'; bx.fillStyle = mk; bx.fillRect(0, 0, 256, 256);
  const blurTex = new THREE.CanvasTexture(bc); blurTex.colorSpace = THREE.SRGBColorSpace;

  // a soft shadow drifting below the drone, so it reads as hovering above the page
  const sc = document.createElement('canvas'); sc.width = sc.height = 128; const sx = sc.getContext('2d'), sg = sx.createRadialGradient(64, 64, 0, 64, 64, 64);
  sg.addColorStop(0, 'rgba(16,43,78,.2)'); sg.addColorStop(.5, 'rgba(16,43,78,.07)'); sg.addColorStop(1, 'rgba(16,43,78,0)'); sx.fillStyle = sg; sx.fillRect(0, 0, 128, 128);
  const shade = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sc), transparent: true, depthWrite: false, toneMapped: false }));
  shade.renderOrder = -1; scene.add(shade);
  const rig = new THREE.Group(); scene.add(rig);   // path: position, size, lean
  const model = new THREE.Group(); rig.add(model); // the model's own facing
  const rotors = [];
  let viewW = 1, viewH = 1, ready = false, R = .5, localBox = null;

  function size() {
    const w = innerWidth, h = innerHeight, dpr = Math.min(devicePixelRatio || 1, innerWidth < 860 ? 1.5 : 2);
    renderer.setPixelRatio(dpr); renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix();
    viewH = 2 * DIST * Math.tan(FOV * Math.PI / 360); viewW = viewH * cam.aspect;
  }
  size();

  const logoImg = new Promise(res => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = '../brand/northstar-flight-ribbon-icon.svg'; });
  new GLTFLoader().load('media/drone.glb', gltf => {
    const g = gltf.scene; model.add(g);
    g.traverse(o => { if (o.isMesh) { o.frustumCulled = false; o.castShadow = o.receiveShadow = rich; } });
    const box = new THREE.Box3().setFromObject(g), c = box.getCenter(new THREE.Vector3()); g.position.sub(c);
    R = box.getSize(new THREE.Vector3()).length() / 2;
    localBox = new THREE.Box3().setFromCenterAndSize(new THREE.Vector3(), box.getSize(new THREE.Vector3()));
    g.children.filter(o => o.name.startsWith('Rotor_')).forEach((r, i) => {
      const b = new THREE.Box3().setFromObject(r), sz = b.getSize(new THREE.Vector3());
      const rad = Math.max(sz.x, sz.z) / 2;
      // the blades themselves go see-through: at this speed the eye sees the smear, not a solid blade
      r.traverse(o => { if (o.isMesh && /^Plastic/.test(o.material.name)) { o.material = o.material.clone(); o.material.transparent = true; o.material.opacity = .18; o.material.depthWrite = false; o.castShadow = false; } });
      const disc = new THREE.Mesh(new THREE.CircleGeometry(rad * 1.02, 48), new THREE.MeshBasicMaterial({ map: blurTex, transparent: true, depthWrite: false, side: THREE.DoubleSide, toneMapped: false }));
      disc.rotation.x = -Math.PI / 2; disc.rotation.z = ({ Rotor_BL: 48, Rotor_BR: -48, Rotor_FL: -43, Rotor_FR: 43 }[r.name] || 0) * Math.PI / 180; disc.position.y = sz.y * .25; r.add(disc);
      rotors.push({ node: r, dir: i % 2 ? 1 : -1 });
    });
    // the Northstar ribbon is printed on the top shell BEFORE the drone starts to move, so model space = world space
    logoImg.then(img => {
      if (img) { try { addLogo(g, c, img); } catch (e) { /* the drone is fine without it */ } }
      ready = true; document.documentElement.classList.add('drone3d-on');
    });
  }, undefined, () => { cv.remove(); });


  // A decal follows the shell's curve. It is built while the rig is at rest (model space = world space), then parented to the model.
  function addLogo(g, c, img) {
    const cvs = document.createElement('canvas'); cvs.width = 1024; cvs.height = Math.round(1024 * 454 / 660);
    cvs.getContext('2d').drawImage(img, 0, 0, cvs.width, cvs.height);
    const tex = new THREE.CanvasTexture(cvs); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
    g.updateMatrixWorld(true);
    const inRotor = o => { for (let n = o; n; n = n.parent) if (n.name && n.name.startsWith('Rotor_')) return true; return false; };
    const meshes = []; g.traverse(o => { if (o.isMesh && !inRotor(o)) meshes.push(o); });
    // find the top of the shell: cast straight down along the fuselage and keep the highest flat hit
    const rc = new THREE.Raycaster(), hits = [];
    for (let x = -.2; x <= .2; x += .01) {
      rc.set(new THREE.Vector3(x, 2, 0), new THREE.Vector3(0, -1, 0));
      const h = rc.intersectObjects(meshes, false)[0];
      if (h && h.face) { const n = h.face.normal.clone().transformDirection(h.object.matrixWorld); if (n.y > .5) hits.push({ p: h.point, n }); }
    }
    if (!hits.length) return;
    const ymax = Math.max(...hits.map(h => h.p.y)), flat = hits.filter(h => h.p.y > ymax - .02);
    const p = flat.reduce((a, h) => a.add(h.p), new THREE.Vector3()).multiplyScalar(1 / flat.length), nrm = flat[0].n.clone().normalize();
    // logo "up" points toward the tail, so it reads upright to someone looking at the drone head on
    const yd = new THREE.Vector3(1, 0, 0).addScaledVector(nrm, -nrm.x).normalize(), xd = new THREE.Vector3().crossVectors(yd, nrm);
    const eul = new THREE.Euler().setFromRotationMatrix(new THREE.Matrix4().makeBasis(xd, yd, nrm));
    p.addScaledVector(new THREE.Vector3(1, 0, 0), -.045);
    const W = .125, mat = new THREE.MeshStandardMaterial({ map: tex, transparent: true, roughness: .45, metalness: 0, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4 });
    meshes.forEach(m => {
      const geo = new DecalGeometry(m, p, eul, new THREE.Vector3(W, W * 454 / 660, .08));
      if (!geo.attributes.position || !geo.attributes.position.count) return;
      geo.translate(c.x, c.y, c.z);
      const d = new THREE.Mesh(geo, mat); d.frustumCulled = false; g.add(d);
    });
  }

  // ---- where it flies: named stations in the page layout. It parks in empty space beside the copy and scrolls with it. ----
  // No station means no drone: Technology and the image bands stay clear on purpose.
  const q = sel => document.querySelector(sel), box = el => el.getBoundingClientRect(), HDR = 72;
  // the empty column left of a section's copy, below its label (does not exist in the one-column phone layout)
  function leftCol(id) {
    const lead = q(`#${id} .lead`); if (!lead) return null;
    const m = box(lead.querySelector('.mono')), c = box(lead.querySelector('.copy')), l = box(lead);
    return c.left - l.left < 320 ? null : { l: l.left, r: c.left - 28, t: m.bottom + 12, b: c.bottom, maxS: .3, side: -1 };
  }
  const STATIONS = {
    hero() {
      const hero = q('#hero'), b = box(q('#hero .box')), h2 = q('#hero2'), end = Math.max(1, hero.offsetHeight - innerHeight), u = Math.min(1, scrollY / end);
      if (scrollY > end + innerHeight * .25) return null;
      const under = u > .36 ? box(h2).top - 8 : b.bottom;   // makes room just before the panel fades in
      const k = innerWidth < 768 ? .3 : 1;
      return { l: b.left, r: b.right, t: b.top, b: under, maxS: (.46 - .1 * u) * (innerWidth < 768 ? 1.05 : 1), side: -1, pref: [(-18 * sm(u)) * k, -2 - 10 * sm(u)], pose: [24 + 8 * u, 30 - 6 * u, -3 - 4 * u] };
    },
    intro() {   // left side, above the statement
      const t = q('#intro .txt'), p = box(t.querySelector('p')), c = box(t);
      return { l: c.left, r: innerWidth < 1024 ? c.right : c.right - 40, t: c.top, b: p.top - 20, maxS: .32, side: -1 };
    },
    vision: () => leftCol('vision'),       // the open space below "Vision"
    ecosystem: () => leftCol('ecosystem'),
    dial() {   // inside the arc, above the hub, only while the section is pinned. It turns with the blue dot.
      const d = box(q('#dial')); if (d.top > 2 || d.bottom < innerHeight - 2) return null;
      const a_ = box(q('#dial .arcw')), lb = box(q('#dialLbl')), df = box(q('#dialDef')), ph = innerWidth < 768, u = 1 - parseFloat(getComputedStyle(q('#arcOn')).strokeDashoffset || 1);
      return { l: a_.left + a_.width * .1, r: a_.right - a_.width * .1, t: ph ? Math.max(df.bottom + 4, a_.top - 40) : a_.top + a_.height * .1, b: lb.top - 4, maxS: .24, minW: ph ? 120 : 170, side: -1, pose: [-34 + 68 * u, 22, 5 - 10 * u] };
    },
    platform: () => leftCol('platform'),
    terrain() {   // over the survey terrain, clear of the pins
      const b = box(q('#terrain')); return innerWidth < 1024 ? null : { l: b.left + b.width * .56, r: b.right - 12, t: b.top + b.height * .3, b: b.bottom - 12, maxS: .27, side: 1 };
    },
    how: () => leftCol('how'),
    construction: () => leftCol('construction'),   // below the heading, left of the paragraph
    industries() {   // right of the heading
      const h = q('#industries h2'); range.selectNodeContents(h); const t = range.getBoundingClientRect(), s_ = box(q('#industries')), hb = box(h);
      return { l: t.right + 30, r: s_.right - 70, t: hb.top, b: hb.bottom + 24, maxS: .22, side: 1 };
    },
    why: () => leftCol('why'),             // never over the video band below
    about: () => leftCol('about'),         // left of the text, below "About"
    contact() {   // below the heading, left of the buttons
      const l = q('#contact .ctop .l'), h = box(l.querySelector('h2')), r = box(q('#contact .ctop .r')), c = box(q('#contact .ctop'));
      return r.left - c.left < 320 ? null : { l: c.left, r: r.left - 28, t: h.bottom + 16, b: c.bottom - 16, maxS: .26, side: -1 };
    }
  };
  const sm = u => u * u * (3 - 2 * u);

  // ---- a safety net: it must never sit on words, whatever the layout does ----
  const TEXT = 'main p,main h1,main h2,main h3,main li,main a.btn,main figcaption,main .mono,main button,footer a,footer h4,footer p';
  const BLOCK = /^(P|H1|H2|H3|LI|A|BUTTON|FIGCAPTION)$/;
  let textEls = [], live = [];
  const range = document.createRange();
  function readText() {
    if (!textEls.length) textEls = [...document.querySelectorAll(TEXT)].filter(e => !e.closest('[aria-hidden="true"]') && ![...e.children].some(c => BLOCK.test(c.tagName)));
    const H = innerHeight; live = [];
    for (const el of textEls) {
      const b = el.getBoundingClientRect();
      if (!b.width || b.bottom < -80 || b.top > H + 80) continue;
      let o = 1; for (let n = el; n && n !== document.body && o > .25; n = n.parentElement) { const c = getComputedStyle(n); if (c.display === 'none' || c.visibility === 'hidden') o = 0; else o *= +c.opacity; }
      if (o <= .25) continue;
      range.selectNodeContents(el);
      for (const r of range.getClientRects()) if (r.width >= 3 && r.height >= 3) live.push([r.left, r.top, r.right, r.bottom]);
    }
  }
  const hits = (l, t, r, b) => { let a = 0; for (const q_ of live) { const w = Math.min(r, q_[2]) - Math.max(l, q_[0]), h = Math.min(b, q_[3]) - Math.max(t, q_[1]); if (w > 0 && h > 0) a += w * h; } return a; };
  // the drone's size on screen for the pose it is in now, per unit of "s"
  const pv = new THREE.Vector3(); let boxW = 1950, boxH = 1000;
  function measure() {
    if (!localBox) return;
    // measured in the station's resting pose, so leaning, hover and scroll speed cannot change the size it picks
    const S = .3, keepP = rig.position.clone(), keepS = rig.scale.clone(), keepR = rig.rotation.clone(), keepM = model.rotation.clone();
    model.rotation.set(0, Math.PI / 2 + tgt.pose[0] * D2R, 0); rig.rotation.set(tgt.pose[1] * D2R, 0, -tgt.pose[2] * D2R, 'XYZ');
    rig.position.set(0, 0, 0); rig.scale.setScalar(S * viewW / (2 * R) * 2.1); rig.updateMatrixWorld(true);
    let l = 1e9, r = -1e9, t = 1e9, b = -1e9; const { min: a, max: z } = localBox;
    for (const x of [a.x, z.x]) for (const y of [a.y, z.y]) for (const k of [a.z, z.z]) {
      pv.set(x, y, k).applyMatrix4(model.matrixWorld).project(cam);
      const px = (pv.x + 1) / 2 * innerWidth, py = (1 - pv.y) / 2 * innerHeight; l = Math.min(l, px); r = Math.max(r, px); t = Math.min(t, py); b = Math.max(b, py);
    }
    boxW = (r - l) / S; boxH = (b - t) / S;
    rig.position.copy(keepP); rig.scale.copy(keepS); rig.rotation.copy(keepR); model.rotation.copy(keepM); rig.updateMatrixWorld(true);
  }
  const CUT = .84;   // the corners of the box are empty air between the arms

  // can this station hold the drone right now? returns where and how big
  function fit(name) {
    const st = STATIONS[name](); if (!st) return null;
    const minW = st.minW || (innerWidth < 768 ? 130 : 260), W_ = st.r - st.l, H_ = st.b - st.t; if (W_ <= 0 || H_ <= 0) return null;
    const s = Math.min(st.maxS, W_ / boxW, (H_ - 24) / boxH); if (s * boxW < minW) return null;
    // what part of it is on screen?
    const top = Math.max(st.t, HDR), bot = Math.min(st.b, innerHeight - 8), hh = boxH * s / 2, hw = boxW * s / 2;
    if (bot - top < hh * 2 + 24) return null;
    const pref = st.pref ? [(st.pref[0] / 100 + .5) * innerWidth, (st.pref[1] / 100 + .5) * innerHeight] : [(st.l + st.r) / 2, (top + bot) / 2];
    const pad = 12, cx = Math.min(Math.max(pref[0], st.l + hw * .96), st.r - hw * .96), cy = Math.min(Math.max(pref[1], top + hh + pad), bot - hh - pad);   // pad: the rotor tips and the hover bob
    const w = hw * CUT, h = hh * CUT; if (hits(cx - w, cy - h, cx + w, cy + h) / (4 * w * h) > .015) return null;
    return { x: (cx / innerWidth - .5) * 100, y: (cy / innerHeight - .5) * 100, s, side: st.side, pose: st.pose || (st.side < 0 ? [32, 18, -6] : [-32, 18, 6]) };
  }
  const NAMES = Object.keys(STATIONS);
  const tgt = { x: -80, y: -40, s: .46, on: false, side: -1, pose: [24, 30, -3] };
  let here = null;
  function steer() {
    let f = here && fit(here), name = here;
    if (!f) { name = null; for (const n of NAMES) { const c = fit(n); if (c) { f = c; name = n; break; } } }
    const off = () => 56 + boxW * cur.s / innerWidth * 72, gone = Math.abs(cur.x) > off() - 1;   // far enough that no rotor tip shows
    if (f && (gone || !here || name === here || f.side === tgt.side)) {
      if (gone) { cur.x = f.side * off(); cur.y = f.y; cur.s = f.s; vel.x = vel.y = vel.s = 0; }   // comes in from its own side, over nothing
      Object.assign(tgt, f, { on: true }); here = name;
    } else { // nothing to do here, or the next station is across the page: leave by the nearest edge first
      tgt.on = false; tgt.x = (cur.x < 0 ? -1 : 1) * (off() + 8); here = null;
    }
  }

  const D2R = Math.PI / 180, clamp = (v, a) => Math.max(-a, Math.min(a, v));
  const cur = { x: -80, y: -40, s: .46, yaw: 24, pitch: 30, roll: -3 }, vel = { x: 0, y: 0, s: 0 };   // starts off the page and flies in
  let lastY = scrollY, scrollV = 0, anchor = null, anchorName = null, framesOdd = false;
  let last = performance.now(), lastRead = 0, fade = 1, shadowFor = 0;
  function loop(now) {
    requestAnimationFrame(loop);
    const dt = Math.min(.1, (now - last) / 1000); last = now;
    rotors.forEach(r => { r.node.rotation.y += r.dir * 44 * Math.min(dt, .05); });   // never stops
    if (!ready) { lastY = scrollY; return; }
    // it moves exactly with what it is parked beside, so a scroll can never push words into it. The spring only re-centres.
    const dy = scrollY - lastY; lastY = scrollY; scrollV += (dy / Math.max(dt, .001) - scrollV) * .3;
    let move = dy;
    if (here) { const st = STATIONS[here](); if (st) { move = anchorName === here ? anchor - st.t : 0; anchor = st.t; anchorName = here; } } else anchorName = null;
    if (move) { const pct = move / innerHeight * 100; cur.y -= pct; if (!tgt.on) tgt.y -= pct; }
    framesOdd = !framesOdd;
    if (dy && framesOdd) readText();                                                      // words are moving: read them often
    if (now - lastRead > 80) { lastRead = now; measure(); if (!dy) readText(); steer(); }
    // position and size move on a spring, so turns have weight and the speed can drive the lean
    const O = 5.2;
    for (const k of ['x', 'y', 's']) { vel[k] += ((tgt[k] - cur[k]) * O * O - 2 * O * vel[k]) * dt; cur[k] += vel[k] * dt; }
    const f = 1 - Math.pow(.02, dt);
    // lean into the turn and point the nose where it is going, as a real multirotor does
    const yaw = tgt.pose[0] + clamp(vel.x * .9, 34), pitch = tgt.pose[1] + clamp(Math.abs(vel.x) * .22 + Math.abs(vel.y) * .22, 12), roll = tgt.pose[2] - clamp(vel.x * .55, 20);
    cur.yaw += (yaw - cur.yaw) * f; cur.pitch += (pitch - cur.pitch) * f; cur.roll += (roll - cur.roll) * f;
    // if a move ever has to cross words, it ghosts across them rather than covering them
    const hw = boxW * cur.s * CUT / 2, hh = boxH * cur.s * CUT / 2, cx = (cur.x / 100 + .5) * innerWidth, cy = (cur.y / 100 + .5) * innerHeight;
    // when not parked, also look ahead to where the words are about to be, so it has faded before they arrive
    const parked = tgt.on && Math.abs(cur.x - tgt.x) < 3, reach = parked ? 0 : Math.min(320, Math.abs(scrollV) * .22);
    const over = hits(cx - hw, cy - hh - (scrollV < 0 ? reach : 0), cx + hw, cy + hh + (scrollV > 0 ? reach : 0)) / Math.max(1, 4 * hw * hh);
    fade += ((over > .008 ? .1 : 1) - fade) * (over > .008 ? 1 - Math.pow(1e-7, dt) : 1 - Math.pow(.002, dt));
    cv.style.opacity = fade.toFixed(3);
    if (DEBUG) window.__drone = { here, on: tgt.on, tgt: { x: tgt.x, y: tgt.y, s: tgt.s }, cur: { x: cur.x, y: cur.y, s: cur.s }, fade, over, boxW, boxH, bbox: [cx - hw / CUT, cy - hh / CUT, cx + hw / CUT, cy + hh / CUT] };
    const n = now / 1000, scale = cur.s * viewW / (2 * R) * 2.1;
    if (!tgt.on && Math.abs(cur.x) > 54 + boxW * cur.s / innerWidth * 70) { renderer.clear(); return; }   // off screen: draw nothing
    const bobY = Math.sin(n * 1.1) * .007 + Math.sin(n * .43) * .004, bobX = Math.sin(n * .7) * .004;
    rig.position.set(cur.x / 100 * viewW + bobX * viewW, -cur.y / 100 * viewH + bobY * viewH, 0);
    rig.scale.setScalar(scale);
    // facing: +90 deg turns the model to face the camera; yaw then swings the nose left (-) or right (+)
    model.rotation.set(0, Math.PI / 2 + cur.yaw * D2R, 0);
    rig.rotation.set(cur.pitch * D2R + Math.sin(n * .9) * .02, 0, -cur.roll * D2R + Math.sin(n * 1.3 + 1) * .015, 'XYZ');
    const rw = R * scale;
    shade.position.set(rig.position.x + rw * .03, rig.position.y - rw * .5, -rw * .8); shade.scale.set(rw * 1.35, rw * .3, 1);
    { const k = innerWidth / viewW, sx = (cur.x / 100 + .5) * innerWidth, sy = (cur.y / 100 + .5) * innerHeight + rw * .5 * k, hw_ = rw * .68 * k, hh_ = rw * .15 * k; shade.visible = !hits(sx - hw_, sy - hh_, sx + hw_, sy + hh_); }
    key.position.set(rig.position.x - rw * 3, rig.position.y + rw * 5, rw * 4); key.target.position.copy(rig.position);
    if (rich && Math.abs(rw - shadowFor) / rw > .03) {
      shadowFor = rw; const c = key.shadow.camera; c.left = c.bottom = -rw * 1.15; c.right = c.top = rw * 1.15; c.near = .1; c.far = rw * 14; c.updateProjectionMatrix();
    }
    renderer.render(scene, cam);
  }
  requestAnimationFrame(loop);

  addEventListener('resize', () => { size(); textEls = []; if (ready) { measure(); steer(); } });
}
