# Reference reverse-engineering — build findings

Reverse-engineered 5 Nov 2026 for the Northstar site, using headless Chromium
extraction (computed styles, loaded libraries, network assets, full-page
screenshots at 1440 + 390). Raw dumps: `plans/<slug>/01-raw.json`; screenshots:
`plans/<slug>/ref/`. This maps the three references in `PLAN.md` to how they are
actually built, so the drone-on-scroll and robotics work can reuse the technique
(never their files — see the honesty rules in `HANDOVER.md`).

Everything below is `[SRC]` (read from the live page) unless marked `[INF]`.

---

## 1. drone.riotters.com — "Aevion" (the flying-drone reference)

The site the brief calls "the flying drone." Product site for a fictional
"Aevion — autonomous LiDAR inspection drone."

**Stack [SRC]**
- **Next.js + Tailwind v4** (CSS vars `--tw-*`, `--spacing:.25rem`, `--breakpoint-dsk:75rem`, `--text-5xl:3rem`…).
- **Three.js** (`window.__THREE__`) — the scroll-driven 3D, almost certainly via react-three-fiber.
- **Lenis** smooth scroll (`window.lenis`, `lenisVersion`).
- **Framer Motion** (`MotionIsMounted`) for element reveals.
- **Rive** (`rive-2.38.5.wasm`) for small vector/UI animations.
- Device-orientation parallax (`ondevicemotion`).

**How the drone-on-scroll actually works [SRC]/[INF]**
- One full-viewport `<canvas>` (measured 1392×824) holds the WebGL scene, fixed behind the page.
- It loads a real 3D model file: **`/software/NewTerreain_006.glb`** (a terrain GLB) `[SRC]`. The drone itself is a GLB too `[INF]` (same pattern).
- Lenis publishes a smooth scroll value; that value drives camera position, model rotation and the LiDAR sweep each frame. Scroll = timeline scrubber. `[INF]`
- Plus plain **`.mp4` clips** for section media: `/intro/video1–3.mp4`, `/solutions/{energy,infrastructure,industry,geospatial}.mp4` `[SRC]`.
- Small 94×94 canvases = little inline 3D/Rive thumbnails. `[SRC]`

**Design system [SRC]**
- Type: **Switzer** (300/400/500, sans) for everything; **protoMono** (mono) for `[ LABELS ]` and specs.
- Display is big and **very tightly tracked**: 64px / weight 300 / line-height 72 / letter-spacing **−2.4px**; 32px/−0.8px. This tight tracking on thin large type is the whole "feel."
- Ink `#24363f` (dark slate) on near-white `#fff`/`#fdfdfd`; muted text `#c7cccb`; soft cool gradient `#dde5e9 → #fdfdfd`.
- Radii `.25rem` small, `1.5rem` large. Light, minimal, technical. Breakpoint 1200px.

**What we take → what Northstar already plans**
- The *mechanism*: Lenis + a fixed WebGL canvas + a GLB scrubbed by scroll. Matches `PLAN.md §4`.
- The *typographic feel*: thin large headings, very tight tracking, mono labels → our Sora (headlines) + JetBrains Mono (labels) already do this; push tracking to ~−0.04em at large sizes per `BRAND-GUIDELINES.md §4`.
- **Do NOT** take: `NewTerreain_006.glb`, their drone model, or any `*.mp4`. Their property.

---

## 2. ai-robots …/unitree-go2 — "Go2" (the robot-reveal reference)

**Stack [SRC]**
- Static page driven entirely by **GSAP**: `gsap@3.13.0` + **ScrollTrigger** + **ScrollSmoother** + **SplitText@3.14.1** (headline letter reveals), from jsDelivr CDN.
- One full-viewport `<canvas>` (1440×900) for the robot scene + a hero video `/videos/go2/hero.mp4` `[SRC]`.
- `ScrollSmoother` = their smooth-scroll (GSAP's equivalent of Lenis).

**How the robot-reveal works [INF]**
- The canvas is a **flipbook**: a sequence of pre-rendered frames drawn to canvas, index tied to scroll via ScrollTrigger `scrub`. This is the Apple/`PLAN.md §4` "canvas flipbook" technique, not live 3D.
- SplitText + ScrollTrigger animate headings and count-up spec numbers as each capability pins.

**Design system [SRC]**
- Type: **Work Sans** (100–900). **Dark theme**: backgrounds `#0a0a0a / #000 / #121212`, text white + grey `#cbcbcb`.
- Accent **blue `#6289ff`** (rgb 98,137,255) and gradient `linear-gradient(224deg,#6c8ae3,#3d60c9)` — note this sits right inside Northstar's ribbon blues (`#245FFF`/`#3BA7FF`). The dark-stage-with-blue-accent look is already where our robotics half goes.

**What we take**
- The dark pinned "stage" + flipbook reveal + count-up specs for the quadruped/humanoid sections (`PLAN.md §2` beats 6–7).
- **Do NOT** take: their frames, photos, or `hero.mp4`. Our own renders only.

---

## 3. dronedeploy.com — enterprise copy & information architecture

**Stack [SRC]**
- **Webflow** site. **GSAP 3.15** + ScrollTrigger + SplitText, **Swiper** carousels, **Wistia** video embeds (many `*.json` media configs), **Lottie** JSON animations. Analytics/consent (Ketch, OpenAI pixel).

**Design system [SRC]**
- Type: **Hanken Grotesk** (headings/body) + **Urbanist** + **DM Mono** (labels) + Inter. Light theme, ink `#1f1f1f`, accent indigo `#3f48e9`, amber `#faaf33`.
- Dark feature bands via `linear-gradient(308deg,#000,#001464 53%,#000)` — black→navy, same family as our Night/Deep-Navy.

**What we take = the story order + framing only (not words) [SRC]**
- Live H1/H2s observed: "Visual AI and robotics across all your sites" · "More than just site photos" · "Understand all your sites" · "Don't get left behind." · "Learn how the best are using DroneDeploy" · "Getting started is simple. Request a demo today."
- Pattern to reuse: **one platform → three outcomes**, an industries list, a how-it-works triplet, "Book a demo" in header + footer. Exactly `PLAN.md §1`.
- **Do NOT** take: their words, their stats ("3 million sites"), customer quotes, Wistia/Lottie assets. Northstar writes its own copy (the PDF deck) and invents no numbers (`HANDOVER.md` honesty rule).

---

## 4. Consolidated: how to build the drone-on-scroll, in brand

Brand tokens confirmed against the supplied logo `northstar-flight-ribbon.svg`
(gradient stops read straight from the file): Cyan `#00CDD9` → Sky `#009CF4` →
Electric Blue `#245FFF` → Light Blue `#3BA7FF` → Violet `#9471FF`; navy ink
`#102B4E`. These already match `BRAND-GUIDELINES.md §3`.

**The mechanism to build (no code-shape models — Kevin rejected those in `HERO-V3-PLAN.md`):**
1. **Lenis** (or GSAP ScrollSmoother) for smooth inertial scroll — both references use one; pick one and keep it.
2. A **fixed full-viewport layer** behind the page that a single scroll value scrubs. Two honest ways to fill it:
   - **(a) Real drone GLB in Three.js/r3f** — a *licensed* or *Northstar-owned* drone model, scrubbed like Aevion. Needs an asset (PLAN §5 options; Kevin's yes before any purchase).
   - **(b) Photoreal frame sequence / scrubbed video** — the `HERO-V3-PLAN.md` direction (Higgsfield footage), drawn to canvas like the Go2 flipbook, with HUD in code on top. Needs generated footage (paid; Kevin's yes + `SPEND.md`).
3. **HUD in code over the top** — cyan corner brackets, LiDAR sweep, labelled tracking boxes, mono `[ LABELS ]`, count-up specs (real numbers only).
4. **Beats** already storyboarded in `PLAN.md §2`: Hero hover → Take-off → Scan → Up-close → Handoff (light→dark) → Robot → Inside the site → One platform → How it works → Industries → Book a demo.
5. **Mobile / reduced-motion**: lighter encode + stills, per `PLAN.md §4`.

**The blocking decision is the asset, not the code.** The scroll/HUD layer can be
built now against a placeholder; making it "hyper realistic" (Kevin's bar) needs
either a licensed drone model (a) or generated footage (b) — both paid, both
needing Kevin's explicit yes first.

## 5. Open decisions for Kevin
1. **Drone imagery route:** licensed GLB model (a), or photoreal Higgsfield footage (b)? Drives cost and look.
2. **Smooth-scroll lib:** Lenis vs GSAP ScrollSmoother (the current build already uses one — match it to avoid two scroll engines, a likely cause of the scroll lag Ashutosh reported).
3. This work sits under the pending **4 Nov Ashutosh brief** (`docs/briefs/2026-11-04-…`), which `HANDOVER.md` flags as the queued priority and which changes content rules — reconcile before touching the live page.
