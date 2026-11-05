// Northstar /v2: a holographic 3D layer over the film, in the spirit of the sister brand's wireframe world.
// Glowing grid floor, light trails, product rigs at each stop, and a wireframe "site twin" for the scan and Platform.
// It reads the page's own timeline (window.NS, set by the engine) and never drives it, so scrolling stays the engine's job.
// Built with esbuild into site-v2/v2/holo.js by tools/build_v2.py.
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

const NS = window.NS;
const stage = NS && document.getElementById('stage');
let renderer;
try { if (stage) renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' }); } catch (e) { renderer = null; }

if (renderer) {
  // Northstar palette (BRAND-GUIDELINES.md): Electric Blue carries the glow, Light Blue and Cyan the highlights, Violet a touch
  const C = { blue: new THREE.Color('#245FFF'), lblue: new THREE.Color('#3BA7FF'), cyan: new THREE.Color('#00CDD9'), violet: new THREE.Color('#9471FF'), white: new THREE.Color('#EAF2FF') };
  const phone = NS.isPhone();
  const cv = renderer.domElement; cv.id = 'holo'; cv.setAttribute('aria-hidden', 'true');
  stage.querySelector('.grain').after(cv);
  renderer.setClearColor(0x000000, 1); // black + mix-blend-mode:screen = only the light is added to the footage
  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(40, 16 / 9, 0.1, 500);
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, cam));
  const bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), phone ? .8 : 1.05, .55, 0);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());
  const add = { transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, depthTest: false };

  // ---------- floor grid ----------
  const grid = new THREE.Mesh(new THREE.PlaneGeometry(900, 900), new THREE.ShaderMaterial({
    ...add, uniforms: { uO: { value: 0 }, uT: { value: 0 }, uCam: { value: new THREE.Vector3() }, uC: { value: C.blue }, uC2: { value: C.lblue } },
    vertexShader: 'varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position,1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }',
    fragmentShader: `uniform float uO, uT; uniform vec3 uCam, uC, uC2; varying vec3 vW;
      float ln(float c, float w){ float d = abs(fract(c - .5) - .5) / fwidth(c); return 1. - min(d / w, 1.); }
      void main(){
        vec2 a = vW.xz / 4., b = vW.xz / 20.;
        float g = max(ln(a.x, 1.), ln(a.y, 1.)), g2 = max(ln(b.x, 1.4), ln(b.y, 1.4));
        float d = length(vW.xz - uCam.xz), fade = exp(-d * .016) * smoothstep(0., 8., d);
        float pulse = smoothstep(5., 0., abs(mod(d - uT * 9., 70.) - 35.));
        float k = (g * .28 + g2 * .75 + pulse * g * .9) * fade * uO;
        gl_FragColor = vec4(mix(uC, uC2, pulse) * k, 1.);
      }`,
  }));
  grid.rotation.x = -Math.PI / 2;
  scene.add(grid);

  // ---------- light trails across the floor ----------
  const trailMat = () => new THREE.ShaderMaterial({
    ...add, side: THREE.DoubleSide, uniforms: { uH: { value: 0 }, uL: { value: .14 }, uO: { value: 0 }, uC: { value: C.lblue } },
    vertexShader: 'varying vec2 vU; void main(){ vU = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }',
    fragmentShader: `uniform float uH, uL, uO; uniform vec3 uC; varying vec2 vU;
      void main(){
        float d = uH - vU.x, tail = d < 0. ? 0. : exp(-d / uL), ac = 1. - abs(vU.y * 2. - 1.), core = ac * ac;
        float k = (tail * core * 1.7 + .07 * ac) * uO * smoothstep(1., .72, vU.x);
        gl_FragColor = vec4(mix(uC, vec3(1.), tail * core * .55) * k, 1.);
      }`,
  });
  function ribbon(pts, width) {
    const curve = new THREE.CatmullRomCurve3(pts), n = 220, pos = [], uv = [], idx = [];
    for (let i = 0; i <= n; i++) {
      const t = i / n, p = curve.getPointAt(t), tg = curve.getTangentAt(t), nx = -tg.z, nz = tg.x, l = Math.hypot(nx, nz) || 1;
      pos.push(p.x + nx / l * width, p.y, p.z + nz / l * width, p.x - nx / l * width, p.y, p.z - nz / l * width);
      uv.push(t, 0, t, 1);
      if (i < n) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx);
    return g;
  }
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const trails = [];
  for (let i = 0; i < (phone ? 5 : 9); i++) {
    const side = i % 2 ? 1 : -1, x0 = side * (14 + rnd() * 40), z0 = -170 - rnd() * 60, pts = [];
    for (let k = 0; k < 6; k++) { const f = k / 5; pts.push(new THREE.Vector3(x0 * (1 - f * .85) + Math.sin(f * 3 + i) * 9 * side, .05, z0 + f * (210 + rnd() * 40))); }
    const m = new THREE.Mesh(ribbon(pts, .09 + rnd() * .06), trailMat());
    m.material.uniforms.uC.value = [C.lblue, C.cyan, C.blue, C.violet][i % 4];
    m.userData = { sp: .05 + rnd() * .06, ph: rnd() };
    trails.push(m); scene.add(m);
  }

  // ---------- helpers for screen-anchored rigs ----------
  const D = 20; // rigs live at this distance from the camera
  const v3 = new THREE.Vector3();
  function worldAt(px, py, W, H, out) {
    v3.set(px / W * 2 - 1, -(py / H * 2 - 1), .5).unproject(cam).sub(cam.position).normalize();
    return out.copy(cam.position).addScaledVector(v3, D);
  }
  const unit = H => 2 * D * Math.tan(THREE.MathUtils.degToRad(cam.fov / 2)) / H; // world units per pixel at D
  const ring = (r, tube, col, arc = Math.PI * 2) => new THREE.Mesh(new THREE.TorusGeometry(r, tube, 6, 120, arc), new THREE.MeshBasicMaterial({ color: col, ...add, opacity: 0 }));
  function circleLine(col, n = 128) {
    const p = []; for (let i = 0; i <= n; i++) { const a = i / n * Math.PI * 2; p.push(Math.cos(a), 0, Math.sin(a)); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3));
    return new THREE.Line(g, new THREE.LineBasicMaterial({ color: col, ...add, opacity: 0 }));
  }
  function fade(obj, o) { obj.traverse(c => { if (c.material) c.material.opacity = o * (c.userData.k ?? 1); }); obj.visible = o > .002; }

  // drone: two orbit rings and a projected scan cone down to the ground
  const droneRig = new THREE.Group(), orbit = new THREE.Group(), cone = new THREE.Group();
  const oA = ring(1, .0045, C.lblue), oB = new THREE.Group(); oA.userData.k = .7;
  for (let i = 0; i < 6; i++) { const s = ring(1.12, .004, C.cyan, Math.PI / 5); s.userData.k = .8; s.rotation.z = i * Math.PI / 3; oB.add(s); }
  oA.rotation.x = 1.27; oB.rotation.x = 1.36; oB.rotation.y = .28;
  orbit.add(oA, oB);
  { const p = []; for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; p.push(0, 0, 0, Math.cos(a), -1, Math.sin(a)); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3));
    const gl = new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: C.blue, ...add, opacity: 0 })); gl.userData.k = .55; cone.add(gl); }
  const coneBase = circleLine(C.lblue); coneBase.position.y = -1; cone.add(coneBase);
  const coneScan = circleLine(C.cyan); cone.add(coneScan);
  cone.rotation.x = .28;
  droneRig.add(orbit, cone); scene.add(droneRig);

  // humanoid: a ring at its feet and scan rings travelling up and down the body
  const humRig = new THREE.Group(), feet = ring(1, .012, C.lblue), feet2 = ring(1.18, .006, C.blue);
  const hScans = [circleLine(C.cyan), circleLine(C.lblue)];
  for (const f of [feet, feet2]) f.rotation.x = Math.PI / 2 - .2;
  hScans.forEach(s => { s.rotation.x = -.2; });
  humRig.add(feet, feet2, ...hScans); scene.add(humRig);

  // quadruped: ground ripples and a LiDAR sweep around its feet
  const quadRig = new THREE.Group(), ripples = [0, 1, 2].map(() => ring(1, .008, C.lblue));
  const sweep = new THREE.Mesh(new THREE.CircleGeometry(1, 48, 0, .9), new THREE.ShaderMaterial({
    ...add, side: THREE.DoubleSide, uniforms: { uO: { value: 0 }, uC: { value: C.cyan } },
    vertexShader: 'varying vec2 vP; void main(){ vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }',
    fragmentShader: 'uniform float uO; uniform vec3 uC; varying vec2 vP; void main(){ float r = length(vP), a = atan(vP.y, vP.x) / .9; float k = smoothstep(1., .2, r) * pow(clamp(a, 0., 1.), 2.) * uO * .26; gl_FragColor = vec4(uC * k, 1.); }',
  }));
  const sweepG = new THREE.Group(); sweepG.add(sweep); sweep.rotation.x = -Math.PI / 2;
  const qPlane = new THREE.Group(); qPlane.rotation.x = .2; qPlane.add(...ripples, sweepG);
  ripples.forEach(r => { r.rotation.x = Math.PI / 2; });
  quadRig.add(qPlane); scene.add(quadRig);

  // ---------- wireframe site twin: rises with the scan, stays behind the Platform ----------
  const city = new THREE.Group(), towers = [];
  const boxE = new THREE.EdgesGeometry(new THREE.BoxGeometry(1, 1, 1).translate(0, .5, 0));
  for (let i = 0; i < (phone ? 34 : 64); i++) {
    const x = (rnd() * 2 - 1) * 70, z = -55 - rnd() * 110, w = 3 + rnd() * 7, d = 3 + rnd() * 7;
    const h = (Math.abs(x) < 16 ? 4 : 6) + Math.pow(rnd(), 2.2) * (Math.abs(x) < 16 ? 10 : 34);
    const m = new THREE.LineSegments(boxE, new THREE.LineBasicMaterial({ color: rnd() < .2 ? C.lblue : C.blue, ...add, opacity: 0 }));
    m.position.set(x, 0, z); m.scale.set(w, h, d); m.userData.d = (z + 165) / 110; // far ones first, like the scan line coming down
    city.add(m); towers.push(m);
    if (rnd() < .45) { // a bright vertical edge with light running up it
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute([x - w / 2, 0, z + d / 2, x - w / 2, h, z + d / 2], 3));
      const e = new THREE.Line(g, new THREE.LineBasicMaterial({ color: C.cyan, ...add, opacity: 0 })); e.userData = { d: m.userData.d, k: 1.4, h }; city.add(e); towers.push(e);
    }
  }
  scene.add(city);

  // ---------- timeline ----------
  const { SEGS, band, ease } = NS;
  const inside = ['enter', 'walk0', 'h1', 'walk1', 'trans2', 'walk2', 'q1', 'depart'];
  const GRID = { intro: .5, d1: .34, trans1: .3, scan: .6, plat: .34, toworld: .5, brand: .38, contact: .24 };
  const TRAIL = { intro: .85, d1: .5, trans1: .6, scan: .6, plat: .22, toworld: .6, brand: .6, contact: .4 };
  let W = 0, H = 0, quiet = false;
  function size() {
    const w = stage.clientWidth, h = stage.clientHeight; if (w === W && h === H) return;
    W = w; H = h; renderer.setPixelRatio(Math.min(devicePixelRatio || 1, phone ? 1 : 1.25)); renderer.setSize(W, H, false);
    composer.setPixelRatio(renderer.getPixelRatio()); composer.setSize(W, H); bloom.resolution.set(W / 2, H / 2);
    cam.aspect = W / H; cam.fov = W / H < 1 ? 58 : 40; cam.updateProjectionMatrix();
  }
  const pA = new THREE.Vector3(), pB = new THREE.Vector3();
  function anchor(s) { const b = s.box, [x0, y0] = NS.fmap(b[0], b[1]), [x1, y1] = NS.fmap(b[2], b[3]); return { cx: (x0 + x1) / 2, cy: (y0 + y1) / 2, w: x1 - x0, h: y1 - y0, top: y0, bot: y1 }; }
  const stopOf = n => NS.STOP.find(s => s.seg === SEGS[n]);
  // the rig appears once the product has stopped, with the panel's own timing, and leaves before it moves on
  const rigO = (g, n, u) => g === SEGS[n] ? Math.min(band(u, .04, .16), 1 - band(u, .86, .96)) : 0;

  function tick(ms) {
    requestAnimationFrame(tick);
    if (document.hidden) return;
    size();
    const t = NS.reduce ? 0 : ms / 1000, p = NS.S.cur, g = NS.segAt(p), u = band(p, g.p0, g.p1), n = g.name;
    // the camera glides over the floor as the visitor scrolls
    cam.position.set(Math.sin(p * 5.5) * 2.2, 5.6 + Math.sin(p * 3.1) * .7, 30 - p * 34);
    cam.lookAt(cam.position.x * .35, .4, cam.position.z - 42);
    cam.updateMatrixWorld();
    const gO = inside.includes(n) ? .14 : (GRID[n] ?? 0) * (n === 'brand' ? 1 - band(u, .58, .74) * .6 : 1);
    grid.material.uniforms.uO.value = gO; grid.material.uniforms.uT.value = t; grid.material.uniforms.uCam.value.copy(cam.position);
    const tO = inside.includes(n) ? .22 : TRAIL[n] ?? 0;
    for (const m of trails) { m.material.uniforms.uO.value = tO; m.material.uniforms.uH.value = ((t * m.userData.sp + m.userData.ph) % 1) * 1.35 - .15; }

    // drone stop
    let o = rigO(g, 'd1', u); fade(droneRig, o);
    if (o > 0) {
      const a = anchor(stopOf('d1')), k = unit(H), r = a.w * .6 * k;
      worldAt(a.cx, a.cy + a.h * .18, W, H, orbit.position); orbit.scale.setScalar(r * 1.08 * (.92 + .08 * ease(o)));
      oA.rotation.z = t * .5; oB.rotation.z = -t * .32;
      const apexY = a.cy + a.h * .22, baseY = Math.min(H * .985, a.bot + a.h * 1.1);
      worldAt(a.cx, apexY, W, H, cone.position); worldAt(a.cx, baseY, W, H, pB);
      const hW = cone.position.distanceTo(pB) * ease(o);
      cone.scale.set(r * .95, hW, r * .95);
      const f = (t * .4) % 1; coneScan.position.y = -f; coneScan.scale.setScalar(f || .001); coneScan.material.opacity = o * Math.sin(f * Math.PI);
    }
    // humanoid stop
    o = rigO(g, 'h1', u); fade(humRig, o);
    if (o > 0) {
      const a = anchor(stopOf('h1')), k = unit(H), r = a.w * .62 * k;
      worldAt(a.cx, a.bot - a.h * .01, W, H, pA);
      feet.position.copy(pA); feet2.position.copy(pA); feet.scale.setScalar(r * ease(o)); feet2.scale.setScalar(r * ease(o)); feet2.rotation.z = t * .4;
      hScans.forEach((s, i) => {
        const f = (Math.sin(t * .7 + i * Math.PI) + 1) / 2;
        worldAt(a.cx, a.bot - a.h * (.03 + f * .95), W, H, s.position); s.scale.setScalar(r * .78);
        s.material.opacity = o * (.55 + .45 * Math.sin(f * Math.PI));
      });
    }
    // quadruped stop
    o = rigO(g, 'q1', u); fade(quadRig, o); sweep.material.uniforms.uO.value = o;
    if (o > 0) {
      const a = anchor(stopOf('q1')), k = unit(H), r = a.w * .62 * k;
      worldAt(a.cx, a.bot - a.h * .03, W, H, qPlane.position);
      ripples.forEach((rp, i) => { const f = (t * .35 + i / 3) % 1; rp.scale.setScalar(r * (.45 + f * 1.1)); rp.material.opacity = o * (1 - f) * .9; });
      sweepG.scale.setScalar(r * 1.35); sweepG.rotation.y = -t * .9;
    }

    // site twin: rises as the scan comes down, holds faintly behind the Platform, sinks back into the world
    const rise = n === 'scan' ? band(u, .05, .8) : ['plat', 'toworld'].includes(n) ? 1 : n === 'brand' ? band(u, .74, .82) : 0;
    const cityO = n === 'scan' ? .72 : n === 'plat' ? .42 : n === 'toworld' ? .42 * (1 - band(u, 0, .5)) : n === 'brand' ? .28 * band(u, .74, .82) * (1 - band(u, .95, 1)) : 0;
    city.visible = cityO > .002;
    if (city.visible) for (const m of towers) {
      const r = ease(band(rise, m.userData.d * .6, m.userData.d * .6 + .4));
      if (m.isLineSegments) m.scale.y = Math.max(.001, r) * (m.userData.h0 ??= m.scale.y);
      else m.scale.y = Math.max(.001, r);
      m.material.opacity = cityO * r * (m.userData.k ?? 1) * (m.isLineSegments ? .8 : .5 + .5 * Math.sin(t * 2 + m.userData.d * 9));
    }

    const any = gO > .002 || tO > .002 || droneRig.visible || humRig.visible || quadRig.visible || city.visible;
    if (!any) { if (!quiet) { renderer.clear(); quiet = true; } return; }
    quiet = false;
    composer.render();
  }
  requestAnimationFrame(tick);
}
