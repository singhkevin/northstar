# 03 · Scroll-performance diagnosis

Step 1 of Ashutosh's 4 Nov brief, section 5. Written 4 Nov 2026. **Diagnosis only: no site code has been changed.** The HANDOVER leads were treated as unverified, and each one below is confirmed or ruled out by measurement.

## In one paragraph

The page itself mostly keeps up, at roughly 45 to 55 frames a second on desktop. **The film does not.** Each time the page asks the video to jump to a new moment (a "seek"), the browser needs 50 to 120 ms to decode that frame, because the film is one 23 MB file with a full picture only once a second. So while you scroll, the film shows only **7 to 15 new pictures a second** instead of 24, and it trails your scroll by about **0.2 s on average, 0.35 s at worst**. On top of that, two smoothing layers are stacked (Lenis plus the page's own easing), so **the picture keeps drifting for 1 to 1.25 s after you stop scrolling**. Together these explain "laggy" and "doesn't consistently synchronize". At the stops, a back-and-forth "wobble" added on 3 Nov keeps seeking about 7 times a second **even when nobody is touching the page**, and it plays the rotors backwards half the time. From the Platform onwards, the blurred-glass panels (`backdrop-filter`) halve the frame rate.

I did **not** reproduce scrolling stopping altogether (a freeze) in any run: no case where the wheel was moving but the page didn't scroll for 150 ms or more. See "What I couldn't test".

## How it was measured

- **Browser:** headless Chromium (the engine inside Google Chrome) driven by Playwright, on a Linux cloud machine with no graphics card. Video decoding and drawing are done in software, so absolute speeds are **slower than a real laptop**. Comparisons between versions are valid; the absolute numbers are a worst case for desktop.
- **Page under test:** the repo copy `site-v2/index.html` (the published build per HANDOVER), served locally with byte-range support like Vercel. The live address is blocked from this cloud session, and the Vercel connector can't see the project, so the deployed copy couldn't be compared byte for byte.
- **Libraries:** the CDNs are blocked here, so the exact same versions (GSAP 3.12.5, ScrollTrigger 3.12.5, Lenis 1.1.13) were loaded from npm. Fonts were stubbed.
- **Journey:** wheel scrolling at a steady trackpad-like pace, 60 px every 16 ms. Top → drone stop (5 s idle) → quadruped stop (5 s idle) → Platform (5 s idle) → end, then all the way back to the top, then one fast flick (240 px every 16 ms).
- **Measured each frame:**
  - page frame rate and slow frames
  - Chrome's own counters for layout, style and script time (`Performance.getMetrics`)
  - every video seek and how long it took
  - every film frame actually put on screen (`requestVideoFrameCallback`)
  - the gap between where your scroll is and which film moment is shown
- **Experiments:** the same journey re-run with one suspect removed at a time (wobble off, blur off, Lenis off), plus a phone simulation: 390×844, small film, 4× slower processor.
- **Other tests:**
  - a seek-speed test on the first 20 s of the film, encoded three ways
  - a "how long does the picture keep moving after you stop" test
  - one Chrome performance trace (a recording of everything the browser did), 132 MB, kept out of the repo

Scripts: `tools/qa/perf/`. Raw results: `docs/audits/perf-data/`.

## Results: current site, desktop 1440×900

| Moment | Page fps | Film pictures shown per s | Seek time median / slow (ms) | Film trails scroll, median / slow (ms) | Layouts forced |
|---|---|---|---|---|---|
| Idle at top | 51 | 0 | – | – | 0 |
| Scrolling to the drone stop | 48 | **13** | 54 / 121 | **217 / 300** | 55 |
| **Idle at the drone stop, no input** | 46 | **7.4** (wobble) | 46 / 70 | n/a | **229 in 5 s** |
| Scrolling to the quadruped stop | 53 | 15 | 50 / 95 | 200 / 350 | 211 |
| Idle at the quadruped stop, no input | 46 | 7.4 (wobble) | 34 / 49 | n/a | 231 in 5 s |
| Scrolling to the Platform | 41 | 5.6 | 49 / 86 | 183 / 250 | 91 |
| **Idle on the Platform** | **28** | 0 | – | – | 0 |
| Scrolling Vision → Contact | **35** | 0 | – | – | 59 |
| Scrolling back to the top | 42 | 7 | 54 / 120 | 217 / 317 | 415 |
| Fast flick | 49 | 11 | 66 / 118 | 250 / 333 | 67 |

"Slow" = the 95th percentile (the worst 1 in 20). For reference, smooth video needs 24 new pictures a second; the page aims for 60 fps.

**After you stop scrolling** (8 wheel ticks, then nothing), at four points in the film:

| | Scroll position stops moving after | Page timeline stops after | Picture stops changing after |
|---|---|---|---|
| Current site (Lenis on) | 1.22 to 1.26 s | 1.46 to 1.56 s | **1.02 to 1.25 s** |
| Lenis removed | 0 s (instant) | 0.98 to 1.30 s | 0.71 to 0.89 s |

**Seek speed by encoding** (first 20 s of `film-1600-e.mp4`, 2 runs each, same browser):

| Encoding | Full picture every | File size (20 s) | Seek, scroll-sized step: median / slow | Seek, random jump: median / slow |
|---|---|---|---|---|
| Current (`-g 24`, with B-frames) | 1 s (24 frames) | 8.1 MB | 63-70 / 120-136 ms | 59-63 / 99-115 ms |
| `-g 6` | 0.25 s | 12.2 MB | 46-47 / 58-63 ms | 44 / 70 ms |
| All-intra (`-g 1`) | every frame | 24.3 MB | **27-28 / 36-39 ms** | **25-27 / 33-43 ms** |

## Each item in the brief, checked

| Brief §5 item | Finding | Evidence |
|---|---|---|
| Multiple competing ScrollTrigger instances | **Ruled out.** Exactly 1 ScrollTrigger exists on the main page | `ScrollTrigger.getAll().length` = 1 |
| Duplicate scroll controllers | **Confirmed, as stacked smoothing.** Lenis smooths the wheel (lerp 0.085), then `frame()` eases again (`S.cur += (S.target - S.cur) * 0.12`). A third listener (`headerState`) also runs on every scroll event. Result: the picture drifts 1.0 to 1.25 s after input stops | "After you stop scrolling" table; `tools/v4_engine.js:25-26, 205`; built page `headerState` |
| Repeated video `currentTime` updates | **Confirmed.** The film is seeked every frame it isn't busy, about 13 to 15 times a second while scrolling. At stops the time-based wobble (`v4_engine.js:210`) keeps seeking **7 times a second with no input at all** | Idle-at-stop rows; wobble-off run drops idle seeks to 0 |
| Seeking during raw scroll events | **Ruled out.** Seeks happen in `requestAnimationFrame`, not in scroll handlers, and wait for the previous seek (`!film.seeking`) | `v4_engine.js:223` |
| Excessive simultaneous decoding | **Partly.** Normally only one video decodes at a time. But during scrolling, the decoder is asked for a new random-access frame ~13×/s at 1600×900 with 1-second keyframe spacing and B-frames, which means decoding up to 24 frames per request. That is the main cost | Seek timings; encoding table |
| Large and inefficient video files | **Confirmed.** One 23.3 MB film (1600 wide), 8.1 MB at 960 wide, fully preloaded at start (`preload="auto"`). Encoded for playback, not for scrubbing. Vision film is 9.5 MB with the same 1 s keyframe spacing | `ffprobe`; seek benchmark |
| Multiple pinned sections / conflicting spacers | **Ruled out.** One sticky stage (`.stage{position:sticky}`), no ScrollTrigger pins | Built CSS; 1 trigger |
| Excessive React state updates | **Not applicable.** The site doesn't use React | – |
| Heavy backdrop filters and compositing | **Confirmed for the later chapters.** About 20 `backdrop-filter: blur()` rules. Removing them raised idle Platform fps from 28 to 41, Vision→Contact scrolling from 35 to 44, and backwards scrolling from 42 to 52. The trace shows 6.8 s of compositor "Commit" work on the main thread over the run. Not the cause of the film lag | No-blur run; trace summary |
| Conflicting smooth-scroll libraries | **Confirmed in effect** (Lenis + own easing, above). Removing Lenis made the scroll position itself instant but didn't remove the picture's lag, because the second easing and slow seeks remain | No-Lenis run; settle table |
| Incorrect ScrollTrigger refresh logic | **No fault found.** Refresh happens only on real width changes, debounced 260 ms, and keeps the visitor's place. Not tested: rotating a real phone | `v4_engine.js:289-302` |
| Unnecessary DOM calculations | **Confirmed.** `frame()` runs every display frame forever, even with nothing moving. It writes dozens of styles each frame (about 100 style recalculations a second when idle at the top) and reads layout mid-frame: `getBoundingClientRect` and `getComputedStyle` in `drawStop`/`fitPanel`, `scrollHeight`/`offsetTop` in `scenePlat`, `sceneContact` and `railRoom`, `$('#rail')` looked up every frame. That forces one extra layout per frame at every stop (229 in 5 s idle) | Layout counts; trace: 3,762 layouts or style passes forced inside animation-frame callbacks |

## HANDOVER leads, verified

| Lead | Verdict |
|---|---|
| `frame()` seeks a single 23 MB film with a keyframe every 24 frames | **Confirmed, and the biggest cause.** Every frame (keyframes at 0, 1, 2… s), B-frames present |
| The stop wobble keeps seeking when idle and plays footage backwards | **Confirmed.** 7 seeks/s at idle. The video audit (02) also finds rotors play at ≤27% speed, reversing |
| Lenis + `S.cur` easing stack on top of ScrollTrigger | **Confirmed.** 1.0 to 1.25 s of drift after input stops |
| `backdrop-filter` on panels/chips; `cloudDraw` canvas during scan | **Blur: confirmed** (later chapters). `cloudDraw`: about 0.7 ms per call on average, 20 ms at worst. It only redraws when something changed, so it's minor. `cloudSample` (reading the film's last frame) runs 1 to 3 times, about 23 ms each: a one-off hitch |
| `getBoundingClientRect` / `getComputedStyle` inside drawing code | **Confirmed.** Forced layout every frame at stops |

One single long freeze of **383 ms** happened while scrolling into the Platform on the first run. It didn't repeat in the traced run, so its exact cause isn't pinned down. The likeliest candidates are the one-off `cloudSample` frame read plus the Vision film starting to load at the same moment (`nextAssets`).

## Phone simulation (390×844, 960-wide film, processor slowed 4×)

The smaller film seeks faster (19 to 29 ms median, about 50 ms slow), so the film showed 19 to 26 pictures a second and trailed scroll by about 150 ms. The page held about 60 fps. **This is not evidence that phones are fine.** It's Chromium pretending to be a phone, wheel events instead of touch, and no Safari. iPhone Safari handles video seeking very differently and has never been tested.

## What fixes this (for Step 3; not done yet)

In the brief's own terms. Each item is backed by a measurement above:

1. **One authoritative controller.** ScrollTrigger drives one timeline. Keep **either** Lenis **or** the page easing, not both, with a short ease (about 100 to 150 ms total). Fold `headerState` into the same loop.
2. **Scrub-friendly footage, per scene.** Re-encode for seeking (all-intra or a very short keyframe spacing, no B-frames). This halves seek time in the test above. Split the single film into per-scene files so only the active scene seeks and the next one preloads (the brief's items 5 to 7), which keeps the larger all-intra files affordable. No new footage is needed for this.
3. **Remove the stop wobble.** Hovering motion comes from a separate looping layer (brief §3), not from seeking the scrubbed film.
4. **Stop doing work when nothing moves.** `frame()` should return early when scroll progress, size and time-based layers haven't changed. Cache layout values (panel rectangles, heights) on resize instead of reading them every frame. Batch reads before writes.
5. **Cheaper glass.** Keep the dark translucent panel look (§7), but apply `backdrop-filter` only to panels that are actually visible, or swap blur for a pre-blurred or darker fill on large surfaces (Platform card, form, header).
6. **Verify again** with these same scripts (before/after numbers), then on Kevin's real Chrome, Safari and a real iPhone.

## What I couldn't test

- **Real devices and browsers:** Safari (Mac or iPhone), a real phone, Kevin's Mac Chrome with its graphics card. All results here come from software rendering on a cloud machine.
- **Touch scrolling** (simulated with wheel events), trackpad momentum and high-refresh (120 Hz) screens.
- **The live site over the internet** (blocked here), so network effects aren't covered: download speed, CDN caching, the 23 MB film still downloading while you scroll.
- **A full freeze (scroll not responding):** I didn't reproduce it. It could depend on things I can't simulate here: a real network still downloading the film (seeking into a part that hasn't arrived stalls the video), Safari, or an older machine.
