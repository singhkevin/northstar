# Northstar v4: one continuous film. Storyboard and implementation map

Built-state notes (2 Nov, after QA): first drone stop holds at 3.4 s with its panel above the drone; second quadruped stop's panel is on the left; the film rests on the 29.5 s frame through scan and platform; the brand scene uses `media/bg-site-*.mp4` (wide site cut from 12.6-14.9 s) instead of `bg-wide`; on tablets and phones the camera pulls back at each stop so the product sits above its panel. Stops are held frames.

Random-scroll fixes (3 Nov): panel text is fully readable for about 58% of each stop (was 26%); menu and rail highlight follow what is on screen (Drone until the 15 s cut, Humanoid until the 25 s cut); Site View sits below its measured headline; the bottom rail is hidden on Contact; the hover loop fades with scroll, so fast jumps no longer ghost; the site fades straight in over the film with no dark gap; hidden scenes cannot take keyboard focus; the loader waits for the film's first 15% and at most 4.5 s before take-off. On tablets and phones the hero uses the first stop's framing, the pointer starts at the product's lower edge, and the camera stays pulled back from the last quadruped stop through the platform, lowered so the header clears the robot's head. The timings in sections 3 and 4 show the original plan.

Refinement pass (3 Nov, Ashutosh's third brief): new 65.5 s film `media/film-*-e.mp4` from 13 chained clips (assets/v5/out, FOOTAGE-V5-PLAN.md) and a 20 s Vision film `media/vision-*-e.mp4`. Three stops only (d1, h1, q1), each scrubbing a hover or standing clip. The SEG table in tools/v4_engine.js is now the source of truth for timings; the scene map further down describes the earlier six-stop build.

Date: 2 November 2026. Brief: Ashutosh, "Northstar Website – Complete Redesign Direction & Implementation Requirements" (2 Nov). Build location: `site-v2/v4/index.html` (preview at /v4 until approved for the main address). Shares `site-v2/media` and `site-v2/brand`.

## 1. Asset audit (what exists, where it fits)

| Asset | What it is | Fit in the new story |
|---|---|---|
| `media/film-1600-c.mp4` / `film-960-c.mp4` (30.25 s, 1600×900, 24 fps) | The stitched film: drone approach 0–5 s, drone over site 5–10 s, drone exits behind the tower 10–15 s, plant room with humanoid emerging 15–20 s, humanoid walks past camera 20–25 s (torso wipe), quadruped in concrete bunker 25–30 s | Scenes 02–06. Scroll-scrubbed; information stops are held frames of this film |
| `media/hero-loop-b.mp4` | 6 s drone hover loop | Scene 01: plays behind the brand introduction until the first scroll |
| `media/bg-wide-*.mp4` | Seamless loop cut from 0.3–4.9 s of the film (wide dawn site) | Scene 08: brand conclusion environment |
| `media/bg-corridor-*.mp4` | Seamless loop of the empty plant room (13.3–15.6 s, slowed) | Scene 09: contact environment |
| `media/bg-air`, `bg-human`, `bg-quad` | Loops from the film | Not needed in v4 (the film itself covers those beats). Kept on disk for the main page |
| `media/s-site.jpg, s-aerial.jpg, s-scan.jpg, s-plant.jpg`, `northstar-sample-report.pdf` | Site View images and sample report | Scene 07: the interactive platform, unchanged |
| `media/s-drone, s-dog, s-dog2, s-humanoid, s-humanoid2` | Product stills | Not used in v4 (no static product cards, per the brief) |
| `brand/*.svg` | Flight Ribbon logo set | Header, loader, contact end line |
| Loader (`#loader`, drone flight on the ribbon path) | Existing animated logo | Scene 01, unchanged |

Subject positions measured on the film frames with Apple Vision (percent of the 16:9 frame, left/top/right/bottom):

| Film time | Subject | Box |
|---|---|---|
| 2.5 s | Drone, close, approaching | 16.7 / 35.0 / 84.5 / 83.3 |
| 7.0 s | Drone over the site | 11.4 / 33.4 / 72.8 / 82.8 |
| 19.0 s | Humanoid, mid distance | 56.1 / 36.8 / 63.0 / 68.3 |
| 22.0 s | Humanoid, closer | 52.8 / 25.4 / 65.1 / 81.1 |
| 27.0 s | Quadruped, standing | 29.6 / 20.8 / 77.8 / 87.8 |
| 29.5 s | Quadruped, close | 30.2 / 2.0 / 79.2 / 92.1 |

The humanoid tracking box keyframes from the main page (16.2–24.15 s) are reused.

## 2. Footage that cannot be fixed in code (asset gaps)

Both gaps are hard cuts inside the existing film. They are shown as straight cuts in v4, not disguised.

| Gap | Where | Exact requirement | Suggested generation |
|---|---|---|---|
| A. Exterior to interior | 15.0 s: the drone has gone behind the concrete tower (exterior, dawn) and the next frame is inside the plant room | A 5 s clip in which the camera keeps moving toward the tower, passes through a visible opening or doorway and arrives at the empty plant room aisle, matching lighting at both ends. First frame = film frame at 14.95 s, last frame = film frame at 15.05 s | Kling first-last-frame, 5 s, about $0.48. Prompt: "The camera glides forward toward the tall concrete tower, enters through a large open industrial doorway and continues into a long plant room lined with pipes and machines, dawn light giving way to interior window light. No people, no robots, no text." |
| B. Plant room to bunker | 25.0 s: the humanoid's torso wipes the frame, then the quadruped is in a different concrete bunker with a helmet on the floor | A 5 s clip in which, after the humanoid passes, the camera continues forward out of the plant room through a corridor into the concrete bunker, revealing the quadruped walking in from the side. First frame = frame at 24.9 s (torso filling frame), last frame = frame at 25.6 s | Kling first-last-frame, 5 s, about $0.48. Prompt: "After the white robot torso clears the frame, the camera moves forward through a concrete corridor into a raw concrete room with a staircase, where a white and black quadruped robot walks in from the right and stops facing the camera. One continuous shot, no people, no text." |

If approved, both clips are stitched in with `tools/stitch_audit.sh` (film becomes about 40 s) and the timeline table below shifts by the inserted seconds. Nothing else changes.

Optional, not required: true hover loops for the drone stops (the stops are held frames; propellers are frozen). Two 5 s image-to-video clips, about $1.70.

## 3. Scene map

The page is one pinned stage inside a tall scroll container. Scroll progress p (0 to 1) drives a single timeline. Every visual state is a pure function of p, so reverse scrolling restores exactly the earlier state. Scroll weights are in viewport heights.

| # | Scene / state | Weight | Film time | Starting visual | Motion and camera | Information shown | Transition out |
|---|---|---|---|---|---|---|---|
| 1 | Brand introduction | 120 | hover loop, then 0→2.5 s | Loader logo flies off; hover loop of the drone at dawn full-frame | On the first scroll the film takes over: drone approaches, cranes drift behind | Headline "Intelligence that moves beyond the screen." + two buttons, bottom-left | Headline exits upward as the drone slows |
| 2 | Drone stop 1 | 110 | 2.5 s held | Drone centre frame, close | Held frame; indicator dot pulses on the drone's left edge, line extends to a panel at top-right | AERIAL · AUTONOMOUS DRONE / Intelligence from above. / "Capture, map, monitor, and inspect complex environments from the air." / chips Photogrammetry, LiDAR, Thermal, 3D reconstruction | Panel and line retract, film resumes |
| 3 | Drone flies over the site | 130 | 2.5→7.0 s | | Camera descends ahead of the drone, site opens below | none | |
| 4 | Drone stop 2 | 110 | 7.0 s held | Drone upper-left over the site | Indicator on the drone's right edge, line to a panel bottom-right | REALITY CAPTURE / Autonomous inspection. / "Our drone-enabled workflows support aerial surveying, photogrammetry, LiDAR scanning, thermal imaging, infrastructure inspection, volumetric analysis, and construction progress monitoring." / chips Aerial reality capture, Mapping & 3D reconstruction, Progress monitoring, Thermal inspection, Asset verification | Retract, resume |
| 5 | Drone to humanoid | 220 | 7.0→16.5 s | | Drone banks right and leaves behind the concrete tower (10–15 s); cut to the plant room (gap A); the humanoid steps out from behind the pipes | Small caption "Inside the site" at 13–16 s | |
| 6 | Humanoid stop 1 | 110 | 19.0 s held | Robot mid distance, right of centre | Tracking box on the robot, line to a panel at left | HUMANOID ROBOTICS / Intelligence that works alongside people. / "Humanoid robotics represents the next evolution of embodied intelligence, bringing AI-assisted perception and manipulation into human-designed environments." | Retract, resume |
| 7 | Humanoid walks | 90 | 19.0→22.0 s | | Camera dollies back ahead of the robot | Tracking box stays on | |
| 8 | Humanoid stop 2 | 110 | 22.0 s held | Robot closer, right of centre | Line to a panel at left | HUMANOID · WORKFLOWS / Supervised inspection, hands on. / "Northstar is developing workflows for humanoid systems to support supervised visual inspections, equipment interaction, inspection checklist execution, material identification, and physical task assistance." / chips Embodied AI, Visual inspection, Human-robot collaboration, Task planning, Physical workflow assistance | Retract, resume |
| 9 | Humanoid to quadruped | 170 | 22.0→27.0 s | | Robot walks up to and past the camera; torso wipe; cut to the bunker (gap B); quadruped in frame | none | |
| 10 | Quadruped stop 1 | 110 | 27.0 s held | Quadruped centre | Indicator on the head, line to a panel top-left | QUADRUPED ROBOTICS / Intelligence on the ground. / "Four-legged robotic platforms extend inspection capabilities into complex industrial and construction environments." / chips Autonomous patrols, Ground reality capture, Thermal monitoring, Equipment inspection, Remote observation | Retract, resume |
| 11 | Quadruped advances | 80 | 27.0→29.5 s | | It walks toward the camera | | |
| 12 | Quadruped stop 2 | 110 | 29.5 s held | Quadruped close | Line to a panel at right | QUADRUPED · SENSING / Repeatable inspection missions. / "Equipped with visual cameras, depth sensors, thermal imaging, and spatial navigation capabilities, quadruped robots can support repeatable inspection missions, indoor reality capture, equipment monitoring, and remote site observation." | Retract |
| 13 | Scan to digital | 160 | 30.2 s held | Last frame of the film | Scan line sweeps down; a point cloud sampled from the frame itself builds over the footage; grid fades in; footage dims | Eyebrow THE NORTHSTAR PLATFORM, headline "From physical observation to intelligent action." | Site View card rises from below |
| 14 | Platform (interactive hold) | 260 | held | Point cloud at low opacity behind | Nothing moves in the background while the card is up | Site View: 4 sites, map / 3D / compare / reports, markers and findings linked, sample report. "Illustrative" label kept | Card sinks, cloud dissolves |
| 15 | Back into the world | 100 | crossfade | | Film fades to the wide dawn site loop | | |
| 16 | Brand conclusion | 170 | wide loop | Wide site at dawn, slow drift | | Statement "We bring intelligence into the physical world through autonomous drones, quadruped robots, humanoid robotics, and connected industrial systems." / "Powered by our agentic AI platform…" / four connected nodes Aerial, Humanoid, Quadruped, Platform / mission line | Crossfade to the plant room loop |
| 17 | Contact | 230 | corridor loop | Empty plant room, slow drift | On phones the form scrolls up inside the stage as the visitor keeps scrolling | "The future of intelligence is physical." / form / "We only use these details to reply" / © line and the HuntGlobal credit | End of page |

Total scroll length about 2,500 viewport heights. Header navigation jumps to the progress value of Drone, Humanoid, Quadruped, Platform, Vision, Contact.

## 4. Information reveal component (used at all six stops)

One component, six instances. Within a stop, the local progress u (0→1 across the held range) drives: indicator fades in (u 0–0.12), connecting line draws from the subject to the panel (0.08–0.32), panel text and chips fade and rise (0.28–0.5), hold, then the same in reverse (0.78–1.0). The anchor is a point on the measured subject box, mapped through the same cover-fit the video uses, so it lands on the product at any screen size. The line is a two-segment hairline (horizontal, then diagonal). Panels sit in the text-safe areas away from the subject; on phones every panel moves to the bottom-left safe area and the video crop slides sideways so the product stays in view.

## 5. Scroll behaviour

Native scroll with Lenis smoothing (as before), a pinned stage, no scroll hijacking. Holds are simply ranges of scroll with constant film time. Reverse scrolling plays everything backwards because state derives from p. Videos: the film and hover loop load first (the loader waits for them); the wide and corridor loops attach when p passes 0.55; nothing else loads.

## 6. Mobile

Same order of states. Film crop follows the subject (object-position per film time). Panels at bottom-left. Site View card and contact form translate upward with scroll while their scene is held, so they are fully reachable without nested scrolling. Header nav collapses to the logo and the contact button, as before.
