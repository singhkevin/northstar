# 04 · Components requiring correction

Step 1 of Ashutosh's 4 Nov brief, last item. Written 4 Nov 2026. This pulls together audits 01 (content), 02 (video) and 03 (scroll performance). **Nothing has been changed yet.**

Key:
- **Needs:** Code = fixable in the site code · Footage = needs new generated video (paid, needs Kevin's yes) · Content = needs approved information that doesn't exist yet · Decision = needs a yes or no from Kevin, Ashutosh or the founders.
- **Confirmed by:** how the problem was verified in this audit.

Source files: `tools/v4_engine.js`, `tools/v4.css`, `tools/v4_form.js` and `tools/build_v4.py`, which generate `site-v2/index.html` (never hand-edited). The Site View, loader and form markup come from `tools/v4_source.html`.

## A. Source footage (brief §2, §3, §4, §10, §11A to D)

| # | Component | Problem | Brief | Needs | Confirmed by |
|---|---|---|---|---|---|
| A1 | Opening `c01` + hero loop `hero-loop-e.mp4` | Drone already big at frame 0, never enters. Hero loop jumps back every 1.5 s | 11A | Footage (R1) + Code (new loop) | Frame sheets (02 §1) |
| A2 | Drone flight `c03` | Drone faces the camera while flying away, no turn or bank | 2A | Footage (R3a) | Frame sheets, ev02 |
| A3 | Drone exit `c04` | Darts out of frame with smear; building changes shape; dust burst | 2A, 2D, 4 | Footage (R3b) | ev03, ev04 |
| A4 | Entrance `c05` + start of `c06` | Overhead shutter vanishes; side doors close then slide open; fog | 4 | Footage (R4) | ev05 |
| A5 | Drone hover `c02` (scrubbed at the d1 stop) | Rotors only shimmer, frozen at both ends; on site they play backwards at stops | 3 | Code (real-time hover layer, remove wobble) + Footage (R2) or a code-drawn rotor layer | ev06; perf run with wobble off |
| A6 | Humanoid stop `c07`, quadruped stop `c12` | Effectively still images for 5 s, no idle life | 3 (idle), 8 | Footage (R6, R10) | Frame-difference measurement |
| A7 | Humanoid exit `c08` | Steps towards the camera, then spins 180° in 0.65 s | 2B, 2D | Footage (R7) | ev07 |
| A8 | Corridor `c09` + `c10` | About 6.2 s with no subject; camera stops and restarts | 11C | Footage (R8, merges 2 clips) | ev09 |
| A9 | Quadruped walk `c11` | Two snap turns; the hall changes | 2C | Footage (R9) | ev10 |
| A10 | Quadruped departure `c13b` | Lunges at the camera, whip turn, hall turns into an open bay, still in frame at scan | 2C, 2D, 11D | Footage (R11a, R11b) | ev11 |
| A11 | Vision film `vision-*-e.mp4` | First ~6.5 s repeat the intro's construction site; no platform shot; camera passes through the humanoid's arm | 10, 11B? | Footage (V1, V2, V4); keep v04 | ev12 |
| A12 | Contact background `bg-corridor-*` | The humanoid's plant-room aisle again | 10 | Footage (C1) | ev12 |
| A13 | Film encoding (`film-*-e`, `vision-*-e`) | Encoded for playback, not scrubbing: 1 s keyframes, B-frames, one 23 MB file | 5 | Code / encoding only (no new footage) | Seek benchmark: all-intra halves seek time |

## B. Scroll and animation engine (brief §5, §12)

| # | Component | Problem | Brief | Needs | Confirmed by |
|---|---|---|---|---|---|
| B1 | Lenis setup (built page) + `S.cur` easing (`v4_engine.js:205`) | Two smoothing layers stacked: the picture drifts 1.0 to 1.25 s after input stops | 5 items 1, 10 | Code | Settle test |
| B2 | Film seeking (`v4_engine.js:223`) | One film for everything; ~13 seeks/s at 50 to 120 ms each, so 7 to 15 pictures/s and 0.2 to 0.35 s behind | 5 items 4 to 8 | Code + re-encode (A13) | Perf runs |
| B3 | Stop wobble (`v4_engine.js:210`) | Seeks 7×/s with no input; plays footage backwards | 3, 5 | Code (remove; replace with A5 hover layer) | Wobble-off run: idle seeks 7 → 0 |
| B4 | `frame()` loop | Runs every frame forever, even idle; writes dozens of styles per frame; reads layout mid-frame (`drawStop`, `fitPanel`, `scenePlat`, `sceneContact`, `railRoom`), so one forced layout per frame at stops | 5 ("unnecessary DOM calculations") | Code | Layout counts; trace |
| B5 | `backdrop-filter` on panels, chips, header, form, Platform | Halves fps in Platform / Vision / Contact (28 vs 41 fps idle on Platform) | 5 | Code (keep the look, cheaper method) | No-blur run |
| B6 | Asset loading (`nextAssets`, `preload="auto"` on the whole film) | Whole film preloads at start; Vision and Contact load late; possible 383 ms hitch entering the Platform | 5 items 6, 7 | Code (per-scene files, preload next only) | One 383 ms frame seen once; not pinned down |
| B7 | Reveal timing (`drawStop`) | Panels fade in on scroll progress, not "after the product stops"; the film keeps moving through a stop (it scrubs 5 s of footage across the stop) | 7 | Code + footage (hover or idle loops so the product is actually still) | Code reading; video audit |
| B8 | `tools/qa/dir5.mjs`, `human.mjs` | Built for the old stop layout and Mac Chrome paths | 12 | Code (update tests) | HANDOVER; path check |

## C. Information reveals and content (brief §6, §7, §8)

| # | Component | Problem | Brief | Needs | Confirmed by |
|---|---|---|---|---|---|
| C1 | Stop markup (`.stop` in `build_v4.py`) | One stop per product; brief needs several reveal states (D1 to D3, H1 to H2, Q1 to Q2) plus expandable overlays | 6, 7, 8 | Code | Text dump |
| C2 | Drone panel copy | Approved headline "Intelligence from above." replaced; 2 of 3 paragraphs missing; capability chips replaced with an unapproved list | 6 | Code (restore) | Content audit items 18 to 23 |
| C3 | Humanoid panel copy | 2 of 3 paragraphs and 1 focus area missing | 6 | Code | Items 31 to 35 |
| C4 | Quadruped panel copy | 2 of 3 paragraphs and 1 capability missing; only one reveal state | 6, 8 | Code | Items 25 to 29 |
| C5 | Industrial IoT | Entirely missing | 6 | Code + Decision (placement) | Items 37 to 42 |
| C6 | Platform intro, coordination layer, 6 modules, How it works, Why Northstar | Missing (headline replaced) | 6, 9 | Code (inside the interface) | Items 43 to 62, 83 to 89 |
| C7 | Solutions (construction, 7 items) and Industries (5) | Missing; only industry names in the form dropdown | 6, final journey | Code + Decision (placement) | Items 63 to 82 |
| C8 | Vision text | Stitched paragraph not approved; Introduction and About copy missing | 6, 10 | Code + Decision (headline choice) | Items 9 to 14, 90 to 95 |
| C9 | Technical specifications (all products) | **Don't exist in approved content** | 6 | Content (founders) | Content audit |
| C10 | Header nav labels | Founders' nav replaced by chapter names | 6 | Decision | Item 2 |

## D. Platform, Vision, Contact, chrome (brief §9 to §11)

| # | Component | Problem | Brief | Needs | Confirmed by |
|---|---|---|---|---|---|
| D1 | Flagged Issues panel (`appTl`, `.issue` rows) | Blank when the Platform first appears: Platform 86% visible, 0 of 4 issues shown | 11E | Code | Browser test, 1440×900 and 1280×720 |
| D2 | Site View controls | **Working:** 4 site selectors change map, pins and issues; 3D model, Compare and Reports switch views; pin popups open; page doesn't jump on click | 9 | – (keep) | Browser test |
| D3 | Ghosted Platform in Vision (`#visplat`, `miniBuild`) | Full-opacity copy of the interface over the Vision film | 11F | Code | Browser test (opacity 1 at Vision 65 to 70%) |
| D4 | Scan / data transition | Quadruped still in frame when the scan starts; switch from indoors to outdoors | 9, 11D | Footage (A10) + Code | Video audit |
| D5 | Chapter rail vs footer (`#rail`, `.cfoot`) | Overlap at 1280×720 (about 16,000 px²) at Contact 30 to 60%; none at 1440×900 | 11G | Code | Browser test |
| D6 | Contact form (`v4_form.js`) | Validation works (empty submit flags name and email). **Can't send: no inbox.** Success or error after a real send not testable | 10 | Content (inbox) + Code | Browser test |
| D7 | Contact links, legal links | No contact details, Privacy or Terms exist | 6, 10 | Content | Content audit |
| D8 | Contact buttons | "Explore Northstar" and "Partner with us" missing | 6 | Code | Item 99 |

## E. Setup this cloud session would need for Steps 2 to 6

| # | Item | Why |
|---|---|---|
| E1 | `HF_CREDENTIALS` secret in the cloud environment, and `tools/hf.mjs` freed from Mac-only paths and the external `higgsfield-seedance` client | To generate footage from here (only after Kevin's yes) |
| E2 | A Vercel token as a cloud secret (or Kevin publishes from his Mac). The Vercel connector here sees the team but not the `northstar` project | To publish after the plan is approved, and to compare the deployed files |
| E3 | Network access to `northstar.viralinbound.in`, `cdnjs.cloudflare.com` and `unpkg.com` | To test the live site as visitors get it; currently blocked here |
| E4 | Real-device checks by Kevin or Ashutosh: Safari on Mac, an iPhone, Kevin's Chrome | The only way to confirm the lag is fixed in real use |
