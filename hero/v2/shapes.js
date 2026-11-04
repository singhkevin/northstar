// Shapes the particle cloud morphs between, all built from primitives (no third-party models).
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { MeshSurfaceSampler } from 'three/addons/math/MeshSurfaceSampler.js';
import { buildDrone } from '../../frames/drone.js';

const M = new THREE.MeshBasicMaterial();
function part(geo, x, y, z, rx = 0, ry = 0, rz = 0) {
  const m = new THREE.Mesh(geo, M); m.position.set(x, y, z); m.rotation.set(rx, ry, rz); return m;
}
const cap = (r, l) => new THREE.CapsuleGeometry(r, l, 6, 14);
const box = (w, h, d, r = 0.08) => new RoundedBoxGeometry(w, h, d, 3, r);

export function buildHumanoid() {
  const g = new THREE.Group();
  g.add(part(box(1.15, 0.55, 0.65, 0.15), 0, 3.05, 0));                 // pelvis
  g.add(part(box(1.55, 1.75, 0.85, 0.25), 0, 4.25, 0));                 // torso
  g.add(part(box(1.1, 0.9, 0.2, 0.08), 0, 4.45, 0.45));                 // chest plate
  g.add(part(new THREE.CylinderGeometry(0.17, 0.2, 0.35, 16), 0, 5.28, 0)); // neck
  g.add(part(box(0.78, 0.9, 0.82, 0.3), 0, 5.85, 0));                   // head
  g.add(part(box(0.6, 0.22, 0.1, 0.05), 0, 5.9, 0.42));                 // visor
  for (const s of [-1, 1]) {
    g.add(part(new THREE.SphereGeometry(0.3, 16, 12), s * 0.98, 4.9, 0)); // shoulder
    g.add(part(cap(0.19, 0.85), s * 1.1, 4.2, 0, 0, 0, s * 0.08));         // upper arm
    g.add(part(cap(0.17, 0.8), s * 1.18, 3.25, 0.12, -0.15, 0, s * 0.04)); // forearm
    g.add(part(box(0.26, 0.42, 0.34, 0.08), s * 1.2, 2.62, 0.2));          // hand
    g.add(part(cap(0.26, 1.05), s * 0.36, 2.15, 0));                       // thigh
    g.add(part(new THREE.SphereGeometry(0.22, 14, 10), s * 0.36, 1.5, 0.05)); // knee
    g.add(part(cap(0.21, 1.0), s * 0.36, 0.9, 0));                         // shin
    g.add(part(box(0.42, 0.22, 0.85, 0.08), s * 0.36, 0.13, 0.15));        // foot
  }
  return g;
}

export function buildQuadruped() {
  const g = new THREE.Group();
  g.add(part(box(3.3, 0.85, 1.25, 0.25), 0, 2.15, 0));                  // body
  g.add(part(box(2.2, 0.25, 0.9, 0.08), -0.2, 2.68, 0));                // top deck
  g.add(part(box(0.95, 0.62, 0.95, 0.2), 1.95, 2.3, 0));                // head / sensor block
  g.add(part(box(0.1, 0.3, 0.6, 0.04), 2.45, 2.32, 0));                 // face sensor
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    const x = sx * 1.25, z = sz * 0.72;
    g.add(part(new THREE.CylinderGeometry(0.24, 0.24, 0.3, 16), x, 2.05, z, Math.PI / 2)); // hip motor
    g.add(part(cap(0.17, 0.85), x + 0.18, 1.5, z, 0, 0, 0.45));           // thigh (knee forward)
    g.add(part(new THREE.SphereGeometry(0.15, 12, 8), x + 0.4, 1.05, z)); // knee
    g.add(part(cap(0.11, 0.85), x + 0.18, 0.55, z, 0, 0, -0.45));         // shin
    g.add(part(new THREE.SphereGeometry(0.13, 12, 8), x - 0.02, 0.1, z)); // foot
  }
  return g;
}

// Sample n surface points, centred, scaled so the largest side equals `fit`, returned as Float32Array
export function samplePoints(group, n, fit) {
  group.updateMatrixWorld(true);
  const geos = [];
  group.traverse(o => {
    if (!o.isMesh || o.userData.noShadow) return;
    let gg = o.geometry.index ? o.geometry.toNonIndexed() : o.geometry.clone();
    const only = new THREE.BufferGeometry();
    only.setAttribute('position', gg.getAttribute('position'));
    only.applyMatrix4(o.matrixWorld);
    geos.push(only);
  });
  const merged = mergeGeometries(geos);
  merged.computeBoundingBox();
  const bb = merged.boundingBox, c = new THREE.Vector3(); bb.getCenter(c);
  const size = new THREE.Vector3(); bb.getSize(size);
  const s = fit / Math.max(size.x, size.y, size.z);
  merged.translate(-c.x, -c.y, -c.z); merged.scale(s, s, s);
  const sampler = new MeshSurfaceSampler(new THREE.Mesh(merged)).build();
  const out = new Float32Array(n * 3), v = new THREE.Vector3();
  for (let i = 0; i < n; i++) { sampler.sample(v); out.set([v.x, v.y, v.z], i * 3); }
  return out;
}

export function buildShapes(n) {
  const drone = buildDrone();
  drone.rotation.y = -0.5;
  return {
    drone: samplePoints(drone, n, 6.2),
    human: samplePoints(buildHumanoid(), n, 5.4),
    dog: samplePoints(buildQuadruped(), n, 5.0),
  };
}
