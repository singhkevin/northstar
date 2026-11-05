# Variant B: Tripartite Character Relay Architecture

## 1. Executive Summary
Variant B implements a pure, single-lead tripartite character relay across the entire Northstar narrative:
**DRONE** $\to$ **HUMANOID** $\to$ **ROBOT DOG (QUADRUPED)**.

In Round 1, the rejected guide drone and trail were removed, and the tripartite relay was introduced.
In **Round 2 (variant-b-r2)**, the entire page from the opening hero down through the very end has been unified into **one continuous, scroll-driven filmic story**:
- Every later section has been transformed into a **pinned 100vh stage** (`position: sticky; top: 0;`), where the assigned lead character is the focal point and all copy, stats, tabs, and cards are composed *around* it.
- Viewport HUD framing with persistent corner brackets (`⌜ ⌝ ⌞ ⌟`), continuous timecode (`00:00:00` $\to$ `00:54:00`), and a streamlined 8-milestone story rail keep the user anchored in an uninterrupted cinematic experience.
- Filmic typography dissolve curves ensure clean scene transitions with zero text overlap or ghosting.
- The approved hero, bottom navigation, and opening chapters remain untouched and fully preserved.
- All 100% of the original copy is preserved verbatim.

---

## 2. Pinned Scene Story Architecture (Round 2)

Each section is structured as a sticky 100vh stage (`.pinned-scene .scene-stage`) with scroll-scrubbed kinematics:

| Section & ID | Lead Character | Character Action | Content Composition Around Character |
| :--- | :--- | :--- | :--- |
| **01–05 Hero Chapters**<br>`#top` | **DRONE** $\to$ **HUMANOID** $\to$ **QUADRUPED** | Macro aerial flight $\to$ Plant-room scrubbed walk patrol $\to$ Concrete stairs descent | Approved cinematic opening sequence; timecode and telemetry active. |
| **05b Ground Mobilization**<br>`#statement` | **ROBOT DOG (Quadruped)** | Ground perimeter surveillance on rough terrain with active radar reticle | Left column holds the headline ("We bring intelligence into the physical world.") and glassmorphic card; Quadruped stands in focal viewport on right with radar sweep and HUD badge. |
| **06 The Northstar Vision**<br>`#vision` | **HUMANOID** | Forward-scrubbed bipedal walk toward camera inside HUD bounding reticle | Left column features the headline ("The physical world is ready for intelligence.") and vision panel; Humanoid advances down center-right industrial aisle inside cyan tracking box. |
| **07 Multi-Domain Fleet**<br>`#technology` | **DRONE** $\to$ **QUADRUPED** $\to$ **HUMANOID** (Synced to active tab) | **Air (01)**: Drone aerial survey with LiDAR beam.<br>**Ground (02)**: Quadruped patrol.<br>**Indoor (03)**: Humanoid inspection.<br>**Edge (04)**: IoT sensor grid. | Eyebrow, headline, and domain tabs run along the top; active domain card sits on the left in glassmorphic HUD panel; lead character moves into position on the right with domain telemetry tags. |
| **08 Physical AI Platform**<br>`#platform` | **DRONE** | High-altitude flight sweeping cyan LiDAR beam across the digital twin | Interactive Site View dashboard (Riverside Tower, 3D model, map markers) framed on the stage; Drone hovers overhead projecting scan beam; 3 platform capability pillars anchor below. |
| **09 The Coordination Layer**<br>`#inside` | **HUMANOID** | Walking patrol through facility plant room with optical scan lines | Headline on left; Humanoid walks along center aisle; 3 spatial anomaly pills (`PUMP 3 THERMAL`, `VALVE 12 CHECKLIST`, `LEVEL B2 VS BIM`) track to the right linked by animated SVG optical rays. |
| **10 Continuous Intelligence Loop**<br>`#how` | **ROBOT DOG (Quadruped)** | Pacing inspection route along 6-step loop | Headline and loop subtitle top-left; Quadruped in top-right HUD reticle; 6-step progress loop (Plan $\to$ Deploy $\to$ Capture $\to$ Understand $\to$ Verify $\to$ Act & Learn) connected by glowing gradient line above closer banner. |
| **11 Construction Intelligence**<br>`#construction` | **DRONE** | Survey banking pattern over structural site emitting dual LiDAR scan beams | Headline on upper left with glassmorphic narrative panel and telemetry badges (`BUILD VS DESIGN`, `WORK IN PLACE`); Drone in open airspace in center-right; 7-card capability deck framed on right with zero text collision. |
| **12 Industrial Applications**<br>`#industries` | **HUMANOID** | Equipment condition monitoring and visual quality verification | Headline and 5 sector tabs (`Manufacturing`, `Energy`, `Oil & Gas`, etc.) top-left; Plant-room operational view bottom-left; Humanoid in HUD reticle upper-right inspecting mechanical machinery. |
| **12b Why Northstar**<br>`#why` | **ROBOT DOG (Quadruped)** | Stable 4-point stance traversing rugged landscape under Northstar watermark | Headline top-left; Quadruped in HUD reticle top-right; 6 glassmorphic value proposition cards cleanly arranged in 2 rows of 3 columns below. |
| **13 About Northstar**<br>`#about` | **HUMANOID** | Upright forward-looking posture in research bay | Left column holds the headline and company narrative; Humanoid walks forward in center corridor; Mission and Vision HUD cards balance on the right. |
| **14 Contact & Deployment**<br>`#contact` | **DRONE** | Vertical descent into circular landing target pad | Headline and callout copy on left; Drone hovers directly over cyan landing pad (`DOCK 01 // ACTIVE`); "Talk to our team" interactive form framed on the right. |
| **Footer** | **DRONE** | Safely docked at rest | Drone docked in center above divider line; legal and brand links spaced with `padding-bottom: 96px`, cleanly clear of the timecode and rail. |

---

## 3. Global HUD Framing & Visual Continuity

1. **Global Viewport Reticles (`.global-hud-corners`)**:
   - Fixed corner brackets (`⌜ ⌝ ⌞ ⌟`) frame the viewport permanently across all pinned scenes, evoking an active camera viewfinder / simulation console.
2. **Unbroken Continuous Timecode (`#tc`)**:
   - Timecode runs continuously from `00:00:00` at the very top of the hero to `00:54:00` at the bottom of the footer, paired with a live gradient progress bar (`#tcbar`).
3. **Streamlined 8-Milestone Story Rail (`#rail`)**:
   - Positioned at `bottom: 18px; right: var(--g);` with `max-width: 440px`.
   - Milestones: `AERIAL` $\to$ `HUMANOID` $\to$ `QUADRUPED` $\to$ `VISION` $\to$ `FLEET` $\to$ `PLATFORM` $\to$ `SOLUTIONS` $\to$ `DEPLOY`.
   - Keeps completely clear of the central timecode bar and footer copyright text.
4. **Filmic Typography Dissolve (Non-Overlapping Fades)**:
   - When a scene unpins and scrolls out, its typography fades to 0 across the first 35% of exit scroll.
   - The incoming scene fades in across the final 35% of entrance scroll.
   - Result: Between scenes, there is zero ghosting, text collision, or overlapping cards. The user experiences a clean cinematic pause focused on character, camera motion, and atmospheric lighting.
5. **Deterministic Scroll**:
   - Pure mathematical functions of scroll position ensure that scrolling back up restores exact states without glitches, replayed intros, or flashes.
   - Mid-page reload (`isMidPage`) correctly skips the preloader and restores the exact character pose, timecode, and active chapter.

---

## 4. Verification and Test Results

- **Local Server**:
  `npx http-server ~/Documents/antigravity/northstar-variant-b -p 4103 -c-1`
- **URL**:
  `http://localhost:4103/ref/`
- **Automated Validation**:
  - Script: `tools/test-variant-b-r2.mjs`
  - Browser CDP test verified forward scroll (0% to 100% in 5% increments) and reverse scroll back to 0%.
  - **Console Errors: 0**
  - **Exceptions / Rejections: 0**
- **Captured Screenshots**:
  21 full-viewport screenshots saved in `~/Documents/antigravity/northstar-shots/variant-b-r2/`:
  - `scroll-0.png`: Hero opening ("Intelligence that moves beyond the screen.") with centered drone, CTA buttons, and global reticle.
  - `scroll-10.png`: Aerial chapter over construction topography with live timecode `00:05:24`.
  - `scroll-20.png`: Quadruped descending concrete stairs at `00:10:48`.
  - `scroll-25.png`: Ground Mobilization scene with robot dog in HUD reticle.
  - `scroll-30.png`: Vision scene with Humanoid scrubbed walk inside plant room.
  - `scroll-35.png`: Cinematic transition with drone entering airspace.
  - `scroll-40.png`: Multi-Domain Fleet with Air/Ground/Indoor/Connected domain tabs.
  - `scroll-50.png`: Physical AI Platform with interactive Site View twin and drone scan sweep.
  - `scroll-55.png`: Coordination layer with humanoid and optical scan rays to 3 spatial anomaly alerts.
  - `scroll-60.png` & `scroll-65.png`: Continuous Intelligence Loop with 6-step gradient timeline and robot dog.
  - `scroll-70.png`: Construction Intelligence with drone in open sky and glassmorphic card deck (resolving Image 1 feedback).
  - `scroll-75.png` & `scroll-80.png`: Industrial Applications with sector tabs and humanoid inspecting equipment.
  - `scroll-85.png`: Why Northstar with robot dog and 6 value proposition cards.
  - `scroll-90.png`: About Northstar with humanoid between narrative and mission/vision cards.
  - `scroll-95.png`: Contact & Deployment with drone descending toward touchdown pad.
  - `scroll-100.png`: Footer with docked drone and clear spacing above story rail.

---

## 5. Identified Gaps & Client Needs `TODO(client)`

1. **TODO(client) — Quadruped Alpha Cutout Sequence**:
   - The drone has a clean alpha cutout (`drone-body.png`), and the humanoid has a 14-frame walk sequence (`assets/audit/hum2/cut/`).
   - The quadruped currently exists in the repository only as RGB video footage (`bg-quad-1600.mp4`) and stills (`s-dog.jpg`).
   - *Recommendation*: Supply a transparent PNG sequence or segmented alpha video for the robot dog to achieve identical cutout fidelity during free-floating scenes.
2. **TODO(client) — 3D glTF/GLB Asset Pipeline (Optional)**:
   - If the client prefers real-time Three.js continuous mesh rendering over pre-rendered image scrubbing, 3D glTF models with PBR materials for all three units can be dropped in.
3. **TODO(client) — Spatial Audio Design (Optional)**:
   - Rotor hum, mechanical footfalls, and robotic servo whines keyed to character handoffs would heighten sensory immersion if approved.
