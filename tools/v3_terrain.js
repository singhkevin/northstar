// Northstar /v3: the Platform terrain. A procedural survey of a site (no third-party model):
// white "clay" ground with a levelled construction pad, cyan contour lines like a LiDAR survey,
// and three illustrative findings pinned to the ground. The camera orbits as the section scrolls past.
// Built with esbuild into site-v2/v3/terrain.js by tools/build_v3.py.
import * as THREE from 'three';

const wrap = document.getElementById('terrain');
let renderer = null;
try { if (wrap) renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' }); } catch (e) { renderer = null; }
if (!renderer && wrap) wrap.classList.add('noGL');

if (renderer) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const BG = new THREE.Color('#EEF2F7');
  const cv = renderer.domElement; cv.setAttribute('aria-hidden', 'true'); wrap.prepend(cv);
  renderer.setClearColor(BG, 1);
  const scene = new THREE.Scene(); scene.fog = new THREE.Fog(BG, 200, 420);
  const cam = new THREE.PerspectiveCamera(32, 2, 1, 600);

  // ---- heights: smooth value-noise fbm, a levelled pad in the middle, a gentle bowl so ridges frame it ----
  const hash = (x, y) => { const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return s - Math.floor(s); };
  const noise = (x, y) => {
    const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  };
  const fbm = (x, y) => { let s = 0, a = .5, f = 1; for (let i = 0; i < 6; i++) { s += a * noise(x * f, y * f); f *= 2.03; a *= .5; } return s; };
  const PAD = { x: 6, z: 4, r: 26 };
  function height(x, z) {
    const ridge = 1 - Math.abs(fbm(x * .018 + 3.1, z * .018 + 7.7) * 2 - 1);
    let h = fbm(x * .022, z * .022) * 26 + ridge * ridge * 20 - 17;
    const d = Math.hypot(x - PAD.x, z - PAD.z), k = 1 - Math.min(1, Math.max(0, (d - PAD.r) / 22));
    h = h * (1 - k * k * (3 - 2 * k)) + 2 * (k * k * (3 - 2 * k)); // flatten to the pad
    return h + Math.min(1, d / 120) * 10;
  }
  const N = innerWidth < 860 ? 180 : 260, SIZE = 240;
  const geo = new THREE.PlaneGeometry(SIZE, SIZE, N, N); geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) pos.setY(i, height(pos.getX(i), pos.getZ(i)));
  geo.computeVertexNormals();
  const mat = new THREE.ShaderMaterial({
    uniforms: { uL: { value: new THREE.Vector3(-.45, .8, .35).normalize() }, uC: { value: new THREE.Color('#00CDD9') }, uB: { value: new THREE.Color('#245FFF') }, uFog: { value: BG }, uT: { value: 0 } },
    vertexShader: 'varying vec3 vN; varying vec3 vW; varying float vD; void main(){ vN = normal; vec4 w = modelMatrix * vec4(position,1.); vW = w.xyz; vec4 mv = viewMatrix * w; vD = -mv.z; gl_Position = projectionMatrix * mv; }',
    fragmentShader: `uniform vec3 uL, uC, uB, uFog; uniform float uT; varying vec3 vN; varying vec3 vW; varying float vD;
      void main(){
        vec3 n = normalize(vN);
        float dif = clamp(dot(n, uL), 0., 1.), sky = .5 + .5 * n.y;
        vec3 col = mix(vec3(.80, .84, .89), vec3(1.), dif * .75 + sky * .25);
        float slope = 1. - n.y;
        col = mix(col, uC, smoothstep(.35, .7, slope) * .22 * (.4 + .6 * (1. - dif)));
        float h = vW.y / 2.4, g = fract(h), w = fwidth(h);
        float line = 1. - smoothstep(0., w * 1.2, min(g, 1. - g));
        float h2 = vW.y / 12., g2 = fract(h2), w2 = fwidth(h2);
        float major = 1. - smoothstep(0., w2 * 1.6, min(g2, 1. - g2));
        col = mix(col, mix(uC, uB, .35), line * .32 + major * .35);
        float sweep = smoothstep(1.2, 0., abs(mod(vW.x + vW.z * .3 - uT * 22., 200.) - 100.));
        col = mix(col, uC, sweep * .5);
        gl_FragColor = vec4(mix(col, uFog, smoothstep(200., 420., vD)), 1.);
      }`,
  });
  scene.add(new THREE.Mesh(geo, mat));
  // the pad's structures as clean outlines, so the site reads as a site, not a mountain
  const edgeMat = new THREE.LineBasicMaterial({ color: '#102B4E', transparent: true, opacity: .55 });
  const blocks = [[0, -4, 10, 14, 8], [14, -2, 8, 22, 10], [4, 14, 16, 6, 8], [-10, 10, 6, 10, 6], [18, 14, 6, 4, 6]];
  for (const [x, z, w, h, d] of blocks) {
    const e = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(w, h, d)), edgeMat);
    e.position.set(PAD.x + x, 2 + h / 2, PAD.z + z); scene.add(e);
  }

  // ---- illustrative findings pinned to the ground ----
  const pins = [...wrap.querySelectorAll('.pin')].map(el => {
    const x = +el.dataset.x, z = +el.dataset.z;
    return { el, p: new THREE.Vector3(x, height(x, z) + (el.dataset.lift ? +el.dataset.lift : 0), z) };
  });
  pins.forEach(o => o.el.querySelector('button').addEventListener('click', () => {
    const open = !o.el.classList.contains('open');
    pins.forEach(q => { q.el.classList.remove('open'); q.el.querySelector('button').setAttribute('aria-expanded', 'false'); });
    if (open) { o.el.classList.add('open'); o.el.querySelector('button').setAttribute('aria-expanded', 'true'); }
  }));

  let W = 0, H = 0, onScreen = false;
  new IntersectionObserver(es => { onScreen = es[0].isIntersecting; }, { rootMargin: '200px' }).observe(wrap);
  const v = new THREE.Vector3();
  function tick(ms) {
    requestAnimationFrame(tick);
    if (!onScreen || document.hidden) return;
    const w = wrap.clientWidth, h = wrap.clientHeight;
    if (w !== W || h !== H) { W = w; H = h; renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5)); renderer.setSize(W, H, false); cam.aspect = W / H; cam.fov = W / H < 1 ? 48 : 32; cam.updateProjectionMatrix(); }
    const r = wrap.getBoundingClientRect(), vh = innerHeight, p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
    const t = reduce ? 0 : ms / 1000, az = -.75 + p * .9 + (reduce ? 0 : Math.sin(t * .12) * .03), el = .82 - p * .2, dist = 235 - p * 45;
    cam.position.set(PAD.x + Math.sin(az) * dist * Math.cos(el), Math.sin(el) * dist, PAD.z + Math.cos(az) * dist * Math.cos(el));
    cam.lookAt(PAD.x, 0, PAD.z); cam.updateMatrixWorld();
    mat.uniforms.uT.value = t;
    renderer.render(scene, cam);
    for (const o of pins) {
      v.copy(o.p).project(cam);
      const x = (v.x + 1) / 2 * W, y = (1 - v.y) / 2 * H, vis = v.z < 1 && x > 24 && x < W - 24 && y > 60 && y < H - 10;
      o.el.style.transform = `translate(${x}px,${y}px)`; o.el.style.opacity = vis ? 1 : 0;
    }
  }
  requestAnimationFrame(tick);
}
