# Variant B: Tripartite Character Relay Architecture

## 1. Executive Summary
Variant B implements a pure, single-lead tripartite character relay across the entire Northstar narrative:
**DRONE** $\to$ **HUMANOID** $\to$ **ROBOT DOG (QUADRUPED)**.

In contrast to previous iterations that introduced an auxiliary mini-drone or guide path, Variant B enforces a strict rule: **only the three core fleet characters appear, and exactly one lead character is in focus at any given moment**. The lead character transitions smoothly as the user scrolls forward and backward, maintaining camera continuity, telemetry coordination, and thematic harmony with every section of the page.

---

## 2. Removal of Rejected Guide Drone & Trail
- **Guide Drone Removal**: Completely removed `#persistentGuide`, its associated DOM elements, and the SVG ribbon trajectory trail (`PAGE_SPLINE`, `trailHistory`, and `updatePersistentGuide`).
- **Duplicate Drone Fix**: Eliminated the duplicate drone bug present in earlier branches where an overlaid floating drone competed with the native hero drone in the background film. In the hero (`#top`), the cinematic film drone leads exclusively.
- **Single Source of Truth**: All post-hero lead character interactions are unified under a single coordinated overlay (`#relayStage`).

---

## 3. Character Relay Schedule & Section Rationale

Each section is assigned a lead character matching the operational domain described in the copy (Air, Interior/Facility, Ground/Field):

| Page Section | Lead Character | Domain / Visual Behavior | Rationale |
| :--- | :--- | :--- | :--- |
| **Hero (`#top`)** | **DRONE** | Aerial fly-in, scales and banks as copy clears | Opens the story with macro aerial surveillance over the construction site ("Intelligence that moves beyond the screen"). |
| **Aerial & Capture Chapters** | **DRONE** | Fly-through surveying construction topography | Autonomous site scanning, LiDAR capture, volumetric point-cloud generation. |
| **Inside & Humanoid Chapters** | **HUMANOID** | Handoff into plant room; walk-cycle patrol | Transition from macro outdoor capture to micro indoor inspection and valve/gauge reading. |
| **Quadruped Chapter** | **QUADRUPED** | Handoff to robot dog descending concrete stairs | Navigates subterranean bunker, rough terrain, and unfinished subterranean passageways. |
| **Statement ("Autonomous fleets...")** | **QUADRUPED** | Ground reconnaissance scan at base of screen | Bridges the subterranean descent to full fleet mobilization. |
| **Vision ("Built for dynamic work...")** | **HUMANOID** | Scroll-scrubbed forward walking sequence | Represents embodied AI operating in environments engineered for human workers. |
| **Technology (Air / Ground / Indoor)** | **DRONE** $\to$ **QUADRUPED** $\to$ **HUMANOID** | Active tab sync: character swaps to match active fleet tier | Provides 1:1 harmony with the interactive technology tabs (Air = Drone, Ground = Quadruped, Indoor = Humanoid). |
| **Platform ("The operating system...")** | **DRONE** | High-altitude orbit with active LiDAR beam sweep | Mirrors the cloud orchestration and site-wide digital twin capture layer. |
| **Coordination Layer** | **HUMANOID** | Precision checklist & thermal telemetry HUD | Focuses on asset integrity, edge compute, and scheduled physical tasks. |
| **How It Works (1-2-3-4)** | **QUADRUPED** | Ground patrol with pulsing proximity radar | Follows repeatable mission routes: perimeter patrol, anomaly detection, automated dock. |
| **Construction / Solutions** | **DRONE** | Survey banking pattern over structural grid | Directly complements volumetric cut/fill earthwork and structural tolerance verification. |
| **Industries** | **HUMANOID** | Bipedal stance with facility diagnostics telemetry | Highlights complex manufacturing plants, energy utilities, and secure indoor facilities. |
| **Why Northstar** | **QUADRUPED** | Stable 4-point stance traversing rugged landscape | Emphasizes rugged all-weather uptime, zero GPS dependency, and difficult terrain. |
| **About Us** | **HUMANOID** | Upright forward-looking posture | Reflects the human-centric AI engineering vision and interdisciplinary robotics team. |
| **Contact / CTA ("Talk to our team")** | **DRONE** | Precision descent to docking target beside CTA button | The fleet returns home, docking cleanly as the narrative completes with an invitation to engage. |

---

## 4. Technical Implementation Details
1. **Scroll-Driven scrubbed Image Sequence for Humanoid**:
   - Integrated 14 high-resolution (1600x900) transparent RGBA cutout frames (`site-v2/media/hum-cut/hum-walk-*.png`) into `#charHumanoid`.
   - The humanoid's walk cycle is directly tied to the scroll progress (`p`), ensuring realistic bipedal cadence that rewinds perfectly on scroll-up.
2. **Deterministic Scroll Coordinates**:
   - Every transformation (scale, translation, opacity, rotation) is a pure function of scroll position calculated via `getBoundingClientRect()` relative to document root.
   - Restores exact state upon reverse scrolling and mid-page reloads.
3. **Telemetry HUD (`#relayTelemetry`)**:
   - Dynamic real-time readout displaying:
     - Active Lead Unit (`NORTHSTAR // AERIAL-01`, `HUMANOID-02`, or `QUADRUPED-03`)
     - Operational Status (`SURVEYING AIRSPACE`, `GAIT: WALKING PATROL`, `ALL-TERRAIN TRAVERSE`, `TOUCHDOWN DOCK`)
     - Live coordinate data, altitude, battery percentage, and sensor mode (LiDAR / Thermal / Stereo Depth).
4. **Mobile & Reduced Motion Support**:
   - Responsive scaling prevents characters from obscuring copy on small viewports.
   - Respects `prefers-reduced-motion: reduce` by disabling smooth camera panning/scaling and presenting clean resting poses.
5. **Zero Console Errors**:
   - Full automated CDP browser test across 0% to 100% scroll depth and back confirmed zero errors, zero unhandled rejections, and zero missing asset 404s.

---

## 5. Identified Gaps & Client Needs `TODO(client)`

1. **TODO(client) — Quadruped Alpha Cutout Sequence**:
   - The Drone has a clean alpha cutout (`drone-body.png`), and the Humanoid has a 14-frame alpha walk sequence (`assets/audit/hum2/cut/`).
   - The Quadruped currently exists in the repository only as RGB video footage (`bg-quad-1600.mp4`, `bg-corridor-1600.mp4`) and JPEG stills (`s-dog.jpg`, `s-dog2.jpg`).
   - *Recommendation*: Supply a transparent PNG sequence or segmented alpha video for the robot dog to achieve the identical floating cutout fidelity as the humanoid and drone during post-hero chapters.
2. **TODO(client) — 3D glTF/GLB Asset Pipeline (Optional Extension)**:
   - If the client prefers real-time Three.js continuous mesh rendering over pre-rendered image scrubbing, 3D glTF models with PBR materials for all three units should be provided.
3. **TODO(client) — Sound Design / Spatial Audio (Optional)**:
   - Rotor hum, bipedal mechanical footfalls, and robotic servo whines keyed to character handoffs would heighten sensory immersion if approved.

---

## 6. Verification and Run Instructions

- **Local Server**:
  ```bash
  npx http-server ~/Documents/antigravity/northstar-variant-b -p 4103 -c-1
  ```
- **Access URL**:
  `http://localhost:4103/ref/`
- **Automated Validation**:
  ```bash
  node tools/test-variant-b.mjs
  ```
- **Screenshots**:
  Full 0%–100% scroll captures saved in:
  `~/Documents/antigravity/northstar-shots/variant-b/` (scroll-0.png through scroll-100.png).
