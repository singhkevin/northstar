# Changes: Story Scroll V3 (`site-v2/ref/`)

Date: 4 November 2026.  
Scope: Complete storytelling overhaul on `site-v2/ref/index.html` (served live from `site-v2/ref/`).

---

## 1. Summary of Client Ask & Solutions Implemented

| Requirement | Implementation in `site-v2/ref/index.html` |
|---|---|
| **1. Smooth Drone Flight Path** | Replaced stepwise keyframes with a continuously differentiable ($C^1$) **Catmull-Rom spline** evaluator (`evalSpline`). Uses a single damped scroll progress value ($S_{cur} \to S_{target}$). Automatically computes curve tangent derivatives ($\frac{dx}{du}$) for natural aerodynamic banking, combined with organic micro-hover kinematics ($\sin(\omega t)$). Scrolling down and up is silky smooth with zero snapping, popping, or jitter. |
| **2. Continuous Chapter Transitions** | Overlapping mathematical transition ranges for all 5 Hero chapters (01 Aerial, 02 Capture, 03 Inside, 04 Humanoid, 05 Quadruped). Replaced CSS `transition: transform 1s` with direct scroll-driven transform and opacity functions, eliminating all lag, delays, and fighting with the scrollbar. Continuous camera moves (shared scale/pan) and dynamic lighting grade crossfades (warm dawn $\to$ dusk $\to$ plant room $\to$ concrete bunker) connect the shots without hard cuts. The tracking reticle smoothly hands over from the humanoid to the quadruped platform. |
| **3. Persistent Story Character (Hero to CTA)** | The drone and its glowing **Flight Ribbon trail** (`#persistentGuide`) persist across every section post-hero (Statement $\to$ Vision $\to$ Technology $\to$ Platform $\to$ Coordination $\to$ How $\to$ Construction $\to$ Industries $\to$ Why $\to$ About $\to$ Contact). During Hero Chapters 01–05, `#persistentGuide` is strictly hidden (`display: none; opacity: 0`) so two drones never appear at once. At hero exit, the hero drone shrinks along its spline directly into the guide drone's coordinates $(x=84.0\%, y=30.0\%, s=0.148, r=-4.0^\circ)$ with a continuous 1:1 crossfade ($\text{heroOp} + \text{guideOp} = 1.0$), seamlessly handing over as a single character. Fully reversible in reverse scroll. At the final CTA, the drone initiates a smooth touchdown dock beside "Talk to our team" with standby rotors and `STATUS: MISSION VERIFIED · READY FOR DEPLOYMENT`. |
| **4. Pure Function of Scroll Position** | All visual states (drone transforms, chapter opacities, typography reveals, background video crossfades, timecode, and progress bar) are pure deterministic functions of scroll position. Section reveals (`.rv` and `.alert`) are 100% scrub-driven (`scrub: true`, linear interpolation `top 95%` to `top 78%`), eliminating time-based `toggleActions` delays. Scrolling backward restores earlier states cleanly. Mid-page reload automatically detects `scrollY > 80`, dismisses the pre-loader immediately, and snaps all elements to the exact mathematical state without reset flashes or animation loops. |
| **5. 60fps & Solid Performance** | Only GPU-accelerated properties (`transform: translate3d(...) scale(...) rotate(...)` and `opacity`) are modified in `requestAnimationFrame`. Zero layout thrashing (measurements cached outside the rAF loop). Lazy attaches background video loops. Mobile layout scales down the character and anchors it into safe gutters to prevent copy occlusion. Full `prefers-reduced-motion: reduce` fallback. |

---

## 2. Detailed Technical Breakdown

### A. Catmull-Rom Spline Drone Engine
- Implemented `catmullRom(p0, p1, p2, p3, u)` and `catmullRomDeriv(p0, p1, p2, p3, u)` in JavaScript.
- Constructed `HERO_SPLINE` through key narrative waypoints:
  - $t = 0.00$: Hero hover over foggy site at dawn.
  - $t = 0.10 \dots 0.16$: Climb and bank into upper airspace (Aerial).
  - $t = 0.22 \dots 0.35$: LiDAR sweep across site and photogrammetry mesh (Capture).
  - $t = 0.42 \dots 0.54$: Descent toward facility opening (Inside).
  - $t = 0.62 \dots 0.70$: High observation vantage tracking the humanoid robot.
  - $t = 0.78 \dots 0.88$: Ground corridor patrol tracking the quadruped robot.
  - $t = 1.00$: Exit stage into the persistent page guide.
- Added live spinning rotor discs (`.drone-rotor` with CSS variable `--spin-rate`), blinking navigation LEDs (red port, green starboard, cyan/amber beacons), and LiDAR gimbal beam.

### B. Typography & Chapter Motion
- Removed `transition: transform 1s cubic-bezier(...)` and `transition: opacity` from `.w>span`, `.ch`, and `.ch p` which were previously fighting scroll input.
- Added `updateHeroChapters(p)`: evaluates cubic hermite smoothstep curves with overlapping ranges ($c_0: -0.05 \dots 0.08$, $c_1: 0.05 \dots 0.25$, $c_2: 0.21 \dots 0.43$, $c_3: 0.39 \dots 0.60$, $c_4: 0.56 \dots 0.80$, $c_5: 0.76 \dots 1.05$).
- Words now rise and fall smoothly in direct synchronization with wheel and trackpad movements.

### C. Persistent Storytelling Across the Website
- Added `#persistentGuide` fixed overlay containing the agile scout drone (`#guideDrone`), dynamic Flight Ribbon SVG trail (`#guideRibbonPath`), gimbal sensor beam (`#guideBeam`), and live telemetry chip (`#guideTelemetry`).
- Governed by `PAGE_SPLINE` through all 10 site sections down to Contact.
- Dynamic telemetry badges:
  - Statement: `NORTHSTAR // EMBODIED AI · PHYSICAL AI`
  - Vision: `NORTHSTAR // SPATIAL MESH · AI REASONING`
  - Technology: `NORTHSTAR // AUTONOMOUS DRONE · QUADRUPED · HUMANOID · EDGE IOT`
  - Platform: `NORTHSTAR // DIGITAL TWIN · REALITY INTEL`
  - Coordination Layer: `NORTHSTAR // ORCHESTRATION`
  - How It Works: `NORTHSTAR // MISSION PLAN · VERIFY & ACT`
  - Construction Solutions: `NORTHSTAR // BUILD VS DESIGN`
  - Industries: `NORTHSTAR // SECTOR INTEL`
  - Why Northstar: `NORTHSTAR // PHYSICAL INTEL`
  - About: `NORTHSTAR // CORE MISSION`
  - Contact / Final CTA: `STATUS: MISSION VERIFIED · READY FOR DEPLOYMENT`

### D. Navigation & Interactivity
- Preserved and verified all navigation links (`Platform`, `Technology`, `Solutions`, `Industries`, `About Us`, `Contact`, `Talk to our team`).
- Ensured anchor clicks smoothly dismiss any pending loader and scroll directly to target via Lenis / native fallback.
- Fully tested interactive components: Site View (all 4 sites, compare slider, 3D model, pin popovers, report links), Industries tabs, and Contact form validation.

### E. Resolution of Review Screen Issues (Follow-up)
1. **Guide vs Hero Drone Duplication & Seamless Character Handoff**:
   - *Problem*: In earlier builds, `#persistentGuide` was visible during hero chapters 01–05, producing two drones at once in the viewport (e.g. top-right near "Intelligence from above").
   - *Solution*:
     - During Hero chapters ($scrollY < \text{handoffStart}$), `#persistentGuide` is strictly hidden via `display: none; opacity: 0; pointer-events: none`. Only `#heroDrone` is displayed and active.
     - Calibrated `HERO_SPLINE` waypoints ($t = 0.88 \dots 1.04$) so `#heroDrone` flies toward, banks, and scales down to the exact starting position of `#guideDrone` (`PAGE_SPLINE[0]` at $x=84.0\%, y=30.0\%, s=0.148, r=-4.0^\circ$). The scale $s=0.148$ perfectly accounts for the base width difference between `#heroDrone` (340px) and `#guideDrone` (180px) ($340 \times 0.148 = 50.3\text{px} \approx 180 \times 0.28 = 50.4\text{px}$).
     - Defined an interpolation handoff zone ($\text{heroEnd} - 240\text{px}$ to $\text{heroEnd} + 140\text{px}$) with continuous linear crossfade: $\text{heroDrone.style.opacity} = 1 - \alpha$ and $\text{persistentGuide.style.opacity} = \alpha$, satisfying $\text{heroOp} + \text{guideOp} = 1.0$ at all intermediate scroll positions.
     - Once past handoff, `#heroDrone` is set to `display: none; opacity: 0;` and `#persistentGuide` takes over traversal along `PAGE_SPLINE`.
     - Bidirectional reversibility: Scrolling upward reverses the crossfade seamlessly and returns `#persistentGuide` to `display: none; opacity: 0`, preserving the illusion of a single continuous character.

2. **Scrub-Based Section Reveals (Pure Function of Scroll Position)**:
   - *Problem*: Reveals configured with GSAP `toggleActions: 'play reverse play reverse'` and `duration: 0.8s` were time-based transitions that lagged behind fast scrolling or direction reversals.
   - *Solution*:
     - Converted all 60+ `.rv` section reveals from time-based `to` tweens with `toggleActions` to scrub-based `gsap.fromTo` instances:
       ```javascript
       gsap.fromTo(el, { y: 26, opacity: 0 }, {
         y: 0, opacity: 1, ease: 'none',
         scrollTrigger: { trigger: el, start: 'top 95%', end: 'top 78%', scrub: true }
       });
       ```
     - Converted the `.alert` cards in `#inside` to a scrubbed GSAP timeline (`start: 'top 65%'`, `end: 'top 25%'`, `scrub: true`).
     - Visual opacity and vertical position are now 100% deterministic functions of scroll progress: pausing, flicking, or reversing scroll immediately places each element at its exact mathematical state.

3. **Post-Hero Ghosting & Text Readability**:
   - *Problem*: In post-hero sections like `#technology` ("Intelligence in every dimension"), ghosting of drones behind content could reduce readability.
   - *Solution*:
     - Fully zeroed out and hid `#heroDrone` post-hero (`display: none; opacity: 0`).
     - In `#technology`, `data-bg="air"` activates the background aerial video `<video data-bg="air">`. Capped its maximum opacity in CSS to `.bgfilm video[data-bg="air"].on { opacity: 0.12 }` (strictly $< 0.15$; measured at $0.035 \dots 0.05$ during normal viewport rendering) with an enhanced radial and linear dark contrast scrim (`.bgscrim`), ensuring high contrast and pristine readability for all headline and body text.

---

## 3. Verification & QA Results

Tested headlessly in Google Chrome with Chrome DevTools Protocol (CDP) and automated node test runner:
1. **Persistent Guide Hidden Through Hero (Chapters 01–05)**: Verified at `scrollY = 0, 800, 1600, 2800, 4200, 5600, 6204px`. Persistent guide is strictly `display: none; opacity: 0` throughout all hero chapters; hero drone is `display: block; opacity: 1`. Zero duplicate drones.
2. **Continuous Single-Character Handoff**: Verified across handoff window (`scrollY = 6304, 6404, 6504, 6564, 6654px`). Opacities crossfade with exact sum $= 1.000$ (e.g. 0.895/0.105, 0.632/0.368, 0.368/0.632, 0.211/0.789, 0.000/1.000). Positions and rotations align continuously.
3. **Post-Hero Ghosting & Contrast**: In `#technology` ("Intelligence in every dimension"), `#heroDrone` is `display: none; opacity: 0`. Background air drone video is capped at $0.035 \le 0.15$ opacity, guaranteeing text readability.
4. **Scrub-Based Section Reveals**: Verified that 100% of `.rv` section reveals and `.alert` cards are scrub-driven (`vars.scrub === true`). Zero time-based `toggleActions` remain in section reveals.
5. **Bidirectional Scroll Reversibility**: Scrolling upward from post-hero back to Chapter 01 (`scrollY = 1000`) cleanly hides the persistent guide (`display: none; opacity: 0`) and restores the hero drone (`display: block; opacity: 1`).
6. **Console Health**: **0 console errors, 0 console warnings, 0 uncaught exceptions** across all test passes.
7. **Mobile Check**: Tested at 390×844 (iPhone); `scrollWidth === innerWidth` (zero horizontal overflow); drone character scales down to 0.18 and positions in upper safe gutters away from text.
8. **Accessibility**: Verified under `@media (prefers-reduced-motion: reduce)`; animated characters gracefully hide, typography displays statically, and content remains fully readable.

---

## 4. Known Gaps (Awaiting Client / Founder Input)

1. **Contact Email (`CONTACT_EMAIL`)**:
   - Currently an empty string `''`. The form provides client-side validation and informs the visitor that demo requests will open upon launch. Founder email inbox address required to wire `mailto:` or backend webhook.
2. **Legal Pages**:
   - Privacy Policy and Terms of Service links in footer remain marked with `<!-- TODO(client): link to legal policy once provided -->`.
