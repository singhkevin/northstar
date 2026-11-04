// Procedural quadcopter: built from primitives, so there are no third-party model licences.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export function buildDrone({ shell = 0xf4f4f2, dark = 0x1c1e22, accent = 0xffba00, glow = false } = {}) {
  const drone = new THREE.Group();
  const shellMat = new THREE.MeshPhysicalMaterial({ color: shell, roughness: 0.32, metalness: 0.05, clearcoat: 0.8, clearcoatRoughness: 0.2 });
  const darkMat = new THREE.MeshStandardMaterial({ color: dark, roughness: 0.55, metalness: 0.3 });
  const metalMat = new THREE.MeshStandardMaterial({ color: 0x9aa0a8, roughness: 0.25, metalness: 0.9 });
  const glassMat = new THREE.MeshPhysicalMaterial({ color: 0x0a0c10, roughness: 0.05, metalness: 0.2, clearcoat: 1 });
  const accentMat = new THREE.MeshStandardMaterial({ color: accent, emissive: glow ? accent : 0x000000, emissiveIntensity: glow ? 2.2 : 0, roughness: 0.4 });

  // Body: rounded fuselage with a darker belly and a top hatch line
  const body = new THREE.Mesh(new RoundedBoxGeometry(1.5, 0.42, 2.2, 6, 0.2), shellMat);
  drone.add(body);
  const belly = new THREE.Mesh(new RoundedBoxGeometry(1.3, 0.16, 1.9, 4, 0.07), darkMat);
  belly.position.y = -0.24; drone.add(belly);
  const hatch = new THREE.Mesh(new RoundedBoxGeometry(0.9, 0.06, 1.1, 4, 0.03), shellMat);
  hatch.position.set(0, 0.23, -0.15); drone.add(hatch);
  // Front sensor bar
  const eyes = new THREE.Mesh(new RoundedBoxGeometry(0.7, 0.12, 0.08, 3, 0.04), glassMat);
  eyes.position.set(0, 0.04, 1.1); drone.add(eyes);
  // Status light strip at the rear
  const strip = new THREE.Mesh(new RoundedBoxGeometry(0.5, 0.05, 0.05, 2, 0.02), accentMat);
  strip.position.set(0, 0.05, -1.11); drone.add(strip);

  // Arms, motors, props
  const props = [];
  const armLen = 1.75;
  [[1, 1], [-1, 1], [1, -1], [-1, -1]].forEach(([sx, sz], i) => {
    const angle = Math.atan2(sz, sx);
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.13, armLen, 20), shellMat);
    arm.rotation.z = Math.PI / 2;
    const pivot = new THREE.Group();
    pivot.rotation.y = -angle;
    arm.position.x = armLen / 2 + 0.35;
    pivot.add(arm);
    drone.add(pivot);

    const tip = new THREE.Vector3(Math.cos(angle) * (armLen + 0.35), 0, Math.sin(angle) * (armLen + 0.35));
    const motor = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.28, 24), darkMat);
    motor.position.copy(tip).setY(0.1); drone.add(motor);
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.12, 0.08, 20), metalMat);
    cap.position.copy(tip).setY(0.28); drone.add(cap);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.215, 0.025, 8, 32), glow ? accentMat : metalMat);
    ring.rotation.x = Math.PI / 2; ring.position.copy(tip).setY(-0.02); drone.add(ring);

    // Landing leg under each motor
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.03, 0.55, 10), darkMat);
    leg.position.copy(tip).setY(-0.3); drone.add(leg);
    const foot = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 8), darkMat);
    foot.position.copy(tip).setY(-0.58); drone.add(foot);

    const prop = new THREE.Group();
    prop.position.copy(tip).setY(0.34);
    for (let b = 0; b < 2; b++) {
      const blade = new THREE.Mesh(new RoundedBoxGeometry(1.5, 0.018, 0.13, 2, 0.008), darkMat);
      blade.rotation.y = b * Math.PI; blade.position.x = (b ? -1 : 1) * 0.72;
      blade.rotation.x = (b ? -1 : 1) * 0.12;
      prop.add(blade);
    }
    // Motion-blur disc so a still frame reads as spinning
    const disc = new THREE.Mesh(new THREE.CircleGeometry(1.48, 64),
      new THREE.MeshBasicMaterial({ color: dark, transparent: true, opacity: 0.05, side: THREE.DoubleSide, depthWrite: false }));
    disc.rotation.x = -Math.PI / 2; disc.userData.noShadow = true; prop.add(disc);
    prop.rotation.y = i * 0.7;
    prop.userData.dir = i % 3 === 0 ? 1 : -1;
    drone.add(prop); props.push(prop);
  });

  // Gimbal + camera/LiDAR head under the nose
  const gimbal = new THREE.Group();
  gimbal.position.set(0, -0.42, 0.7);
  const yoke = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.2, 12), darkMat);
  gimbal.add(yoke);
  const head = new THREE.Mesh(new RoundedBoxGeometry(0.55, 0.42, 0.42, 4, 0.1), shellMat);
  head.position.y = -0.27; gimbal.add(head);
  const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.08, 32), glassMat);
  lens.rotation.x = Math.PI / 2; lens.position.set(0.09, -0.27, 0.22); gimbal.add(lens);
  const lens2 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.06, 24), glassMat);
  lens2.rotation.x = Math.PI / 2; lens2.position.set(-0.15, -0.22, 0.22); gimbal.add(lens2);
  const lensRing = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.015, 8, 32), accentMat);
  lensRing.position.set(0.09, -0.27, 0.26); gimbal.add(lensRing);
  drone.add(gimbal);

  drone.traverse(o => { if (o.isMesh && !o.userData.noShadow) { o.castShadow = true; } });
  drone.userData = { props, gimbal };
  return drone;
}

export function makeRenderer(canvas, { w = innerWidth, h = innerHeight, exposure = 1 } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(w, h, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = exposure;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  return renderer;
}

export function studioEnv(renderer, scene, intensity = 1) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = intensity;
}

// Rolling terrain as a point cloud (used for the scan look)
export function pointTerrain({ w = 60, d = 40, step = 0.22, color = 0xffba00, base = 0x6d7480, scanZ = 0, size = 0.05 } = {}) {
  const pos = [], col = [];
  const cA = new THREE.Color(base), cB = new THREE.Color(color), c = new THREE.Color();
  const hgt = (x, z) => Math.sin(x * 0.18) * 0.9 + Math.cos(z * 0.23 + x * 0.05) * 0.7 + Math.sin(x * 0.6 + z * 0.4) * 0.15;
  for (let x = -w / 2; x < w / 2; x += step) for (let z = -d / 2; z < d / 2; z += step) {
    const jx = x + (Math.random() - 0.5) * step * 0.8, jz = z + (Math.random() - 0.5) * step * 0.8;
    pos.push(jx, hgt(jx, jz), jz);
    const band = Math.exp(-Math.pow((jz - scanZ) / 1.2, 2));
    c.copy(cA).lerp(cB, band); col.push(c.r, c.g, c.b);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  return new THREE.Points(g, new THREE.PointsMaterial({ size, vertexColors: true, transparent: true, opacity: 0.9, sizeAttenuation: true, depthWrite: false }));
}

export function animate(renderer, scene, camera, drone, { bob = 0.12, still = false, extra } = {}) {
  const clock = new THREE.Clock();
  const baseY = drone.position.y;
  function tick() {
    const t = clock.getElapsedTime();
    drone.userData.props.forEach(p => { p.rotation.y += 0.9 * p.userData.dir; });
    if (!still) {
      drone.position.y = baseY + Math.sin(t * 1.3) * bob;
      drone.rotation.z = Math.sin(t * 0.9) * 0.025;
      drone.rotation.x = Math.sin(t * 0.7) * 0.02;
    }
    extra && extra(t);
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  tick();
  setTimeout(() => (window.__ready = true), 800);
}
