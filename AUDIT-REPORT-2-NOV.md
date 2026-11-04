# Northstar website audit: completion report

Date: 2 November 2026. Scope: the main page at https://northstar.viralinbound.in/ (file `site-v2/index.html`), following the audit brief "Northstar Website Audit – Issues, Required Corrections & Implementation Brief". A copy of the page as it was before this work is kept at `site-v2/index.pre-audit.bak.html`.

## 1. Issues identified and their root causes

| # | Issue in the brief | Root cause found |
|---|---|---|
| 1.1 | Drone orientation and direction of travel inconsistent | In the footage itself (`media/film-1600-b.mp4`, 0 s to 10 s). The two drone shots were generated as separate 5-second clips joined by an AI morph at ~5 s; the drone's body faces the camera while the camera moves, so travel and heading never agree. Not a code issue. |
| 1.2 | Drone disappears into the ground at ~13 s | The third clip (10 s to 15 s) is an AI "first frame to last frame" morph from the aerial shot into the empty corridor. The drone shrinks and dissolves into the structure between 12.2 s and 13.2 s. Not a cut, a morph; cannot be fixed in code. |
| 1.3 | Humanoid appears suddenly at ~16 s | Same mechanism: the fourth clip (15 s to 20 s) morphs from the empty corridor into the walking robot between 15.6 s and 16.3 s. |
| 1.4 | Scenery changes while the humanoid walks | Two separate generations are blended at ~17.2 s. The architecture visibly regenerates between 17.0 s and 17.6 s. |
| 1.5 | Humanoid tracking box misaligned | Code. The box position was a formula unrelated to the robot's real position, and it ignored how `object-fit: cover` crops the video on different screens. |
| 1.6 | Humanoid to quadruped is a sudden cut | The only hard cut in the film, at 20.17 s. Footage, not code. |
| 1.7 | Pre-loader to hero shows a narrow strip | Code. The hero was revealed by two "letterbox" bars opening while the loader was still fading; for about half a second the footage showed through a thin slot. |
| 1.8 | "Verified reality" headline covers the subject | Code. That chapter was centred and set at up to 220 px over the drone descent. |
| 2 | Cinematic only in the opening section | Architecture. After the 25-second film the page became ordinary light and dark sections with static photos. |
| 3A | Excessive empty space | Section padding of up to 170 px and 80 to 120 px gaps inside sections. |
| 3B | Abrupt section transitions | Alternating navy, cloud-white and photo backgrounds. |
| 3C | Slow, faint text reveals | Reveals started 40 px below position, took 1.2 s and only began at 88% of the viewport. |
| 4 | Site View controls do nothing; "North Depot" jumps to #platform | The sidebar items were plain `#platform` links; pins and findings were static markup with no handlers. |

## 2. Changes implemented

Opening film
- Loader to hero: the letterbox bars are gone. The hero now scales in (1.08 to 1.0) while the loader fades out over it, so the footage is already full-screen when the loader clears.
- Tracking box: rebuilt from nine measured positions of the robot in the footage (16.05 s to 19.95 s), interpolated between keyframes and mapped through the same cover-fit the video uses, so it stays on the robot at every screen size, with proportional margins. Now also shown on phones.
- "Verified reality" moved to the right-hand text-safe area at the same size as the other chapter headlines.

Continuous cinematic experience (brief section 2)
- A persistent, fixed cinematic layer now sits behind every section after the film. It holds five seamless loops cut from the film itself (so the drone, robots and grading match the opening), each with a one-second dissolve back to its own start:
  `bg-wide` (0.3 s to 4.9 s), `bg-air` (5.4 s to 10.0 s), `bg-corridor` (13.3 s to 15.6 s, slowed), `bg-human` (17.6 s to 20.1 s, slowed), `bg-quad` (20.3 s to 25.0 s), each at 1600 and 960 px with a poster.
- Each section names its chapter; scrolling crossfades between chapters at the section boundary. Mapping: statement = quadruped (continues from the film's last frame), vision = aerial, technology = aerial, then quadruped, humanoid and corridor per row, platform = aerial with a code-drawn scan grid (the "scan to digital twin" beat), coordination layer = corridor, how it works = wide site, construction = wide site, industries = corridor, why = quadruped, about = wide site, contact = corridor under a dark overlay.
- Loops load only when first needed, one plays at a time, and a dark scrim keeps text readable. The former light sections are restyled dark-on-film. The brand palette, fonts, buttons and the white Site View card are unchanged.

UI/UX
- Section padding reduced to 72 to 124 px, inner gaps from 80 to 56 px, technology rows tightened, the "Perceive. Reason." block no longer forces a 120 vh height.
- Text reveals now start 24 px below position, take 0.9 s and begin at 92% of the viewport.
- Section transitions are now background crossfades instead of colour jumps.

Site View (brief section 4)
- Sites: Riverside Tower, North Depot, Solar Field East and Plant Room B each load their own image, four findings and map markers.
- Views: 3D model (point-cloud treatment with grid), Compare (draggable last-week/today divider), Reports (three sample reports linking to the sample PDF). Clicking an active view returns to the map.
- Markers and findings: clicking either highlights the other and opens a detail card with the finding text and severity. Clicking elsewhere closes it. All controls are real buttons with active states, hover, focus and keyboard support.
- Every value is sample data and is labelled so ("Illustrative", "Sample data", "sample finding").

## 3. Files modified

- `site-v2/index.html` (all changes above; backup at `site-v2/index.pre-audit.bak.html`)
- `site-v2/media/film-1600-c.mp4`, `film-960-c.mp4`, `poster-c.jpg` (new film); sources in `assets/audit/`; `tools/jobs-audit.json`, `tools/stitch_audit.sh`
- `site-v2/media/bg-{air,wide,corridor,human,quad}-{1600,960}.mp4` and matching `.jpg` posters (new, cut from the existing film, no generation cost)
- `site-v2/vercel.json` unchanged (existing `/media/` cache rule covers the new loops)

## 4. Footage regenerated (approved by Kevin, 2 Nov)

The five footage defects were fixed with new clips rather than hidden. Five 5-second 1080p clips were generated on the Northstar Higgsfield account from frames of the existing film, then the film was re-stitched locally (now 30.25 s, `media/film-1600-c.mp4` and `media/film-960-c.mp4`; the old film is kept as `-b`).

| New film range | Clip | What it fixes | Cost |
|---|---|---|---|
| 0 s to 5 s | Drone approach (first frame 0 s, last frame 5 s) | Drone now faces the way it flies, toward a retreating camera (1.1) | $0.476 |
| 5 s to 10 s | Drone over site (first frame 5 s, last frame 10 s) | Same heading rule kept over the site (1.1) | $0.476 |
| 10 s to 15 s | Drone exits (from the 10 s frame) | Drone banks right and leaves behind the concrete tower; no dissolve into the ground (1.2) | $0.84 |
| 15 s to 20 s | Humanoid emerges (first frame empty corridor, last frame robot in the same corridor) | Robot steps out from behind the pipes in the middle distance (1.3), one unchanged environment (1.4) | $0.476 |
| 20 s to 25 s | Humanoid walks past (from the 17 s frame) | One consistent room for the whole walk (1.4); the robot walks up to and past the camera so its torso wipes the frame into the quadruped shot, a motion-matched transition instead of a hard cut (1.6) | $0.84 |
| 25 s to 30 s | Original quadruped shot | Unchanged | $0 |

Total $3.11 (quoted), logged in `SPEND.md` and `assets/ledger.jsonl`. Chapter timings, the HUD scan and the rail were re-timed to the 30-second film; the tracking box keyframes were re-measured on the new footage (Apple Vision subject masks from 18 s on, hand-measured for the small distant robot at 16 s to 17.5 s). The aerial, wide and humanoid background loops were re-cut from the new film so the persistent layer matches the opening.

Still outstanding, not footage: the contact form has no inbox yet (`CONTACT_EMAIL` is empty, the form says so honestly); the founders have not supplied real figures, so no numbers appear anywhere.

## 5. Functional testing results

Tested locally on Chrome (headless, range-capable server) at 1440×900 and 390×844, then on the live site after deploy.

- Film (new 30 s cut): seeks correctly at 3, 9, 13.6, 17, 18.8, 20.6, 22.4, 23.9 and 27 s; tracking box on the robot from 16.2 s to 24.1 s; chapter text in safe areas; no console errors.
- Loader to hero: frame-by-frame capture shows no strip; the footage is full-frame throughout the fade.
- Persistent layer: correct chapter active at every section (statement quad, vision/technology air, platform air with grid, inside/industries/contact corridor, how/construction/about wide, why quad).
- Site View: switching all four sites, each view, pin to finding and finding to pin, popover open/close, compare slider, reports links: all pass.
- Phone: sections stack, Site View collapses to a single column with pill controls, film text moves to the bottom-left safe area.
- Reduced motion: loops, grain and sweeps stop; content stays readable.

## 6. Remaining items

- Cross-browser pass in Safari, Edge and Firefox was not run from this machine's automation; the page uses the same techniques as before (GSAP, Lenis, muted inline video), which were already working in those browsers.
- The contact inbox.

## 7. Design pass (2 Nov, after the audit)

A designer's read of the live page found one structural weakness the brief did not name: every section after the film used the same template (eyebrow, display-size headline with a gradient tail, paragraph), so the page had no rhythm and the gradient device lost its meaning. Changes, all in `site-v2/index.html` (backup `site-v2/index.pre-uipass.bak.html`):

- Two headline tiers. Vision, Technology, Platform, How and Contact keep the display size and gradient. Construction, Industries, Why and About step down a size, open on a hairline rule, and use a single solid light-blue accent instead of the gradient.
- The opening statement is set as a lede (smaller, with a short gradient rule above it) rather than a second hero, so the Vision headline that follows is the first real section head.
- The two repeated lines ("We don't just capture…" and "See what is happening…") are now side-ruled quotes at reading size instead of competing headlines. The gradient phrase inside body copy is plain white.
- Platform capability grid uses the same rule-and-accent system as the Why grid.
- Coordination layer: the three floating findings are connected to a pulsing "Orchestration" hub by hairlines with travelling light, and the section is shorter (72 vh). Hidden below 1180 px, where it would collide with the copy.
- A 2 px gradient scroll-progress line along the top of the viewport, shown once the visitor has scrolled past the loader.

Verified locally and live at 1440×900 and 390×844: no console errors, headline tiers and quotes render as intended, schematic aligned with the findings, progress line visible.

## 8. Responsive check (2 Nov)

Live page measured at 320, 375, 430, 768, 1024 and 1280 px wide, every section, with an automated scan for anything wider than the screen. No horizontal overflow at any width (the only elements wider than the viewport are the clipped marquee track, the grain overlay and the watermark, all inside overflow-hidden boxes). Four layout issues found and fixed:

- Header "Talk to our team" wrapped to two lines at 320 px: now never wraps; at 380 px and below the button and logo shrink and the arrow is dropped.
- Section jumps (nav links, "Explore our platform", footer links) landed with the fixed header covering the section label: the scroll offset now equals the header height.
- Site View title bar crowded at phone width: below 420 px the "Northstar · Site view" title hides and the "Illustrative" badge stays.
- Tablet (600 to 860 px): the six process steps, six platform capabilities and six "Why" points were one long column; now two columns.

Re-verified live after deploy at 320 and 768 px and the anchor landing at 1440 and 375 px.
