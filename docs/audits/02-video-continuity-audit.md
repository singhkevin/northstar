# Northstar: video asset and continuity audit

Step 1 of the 4 Nov brief ("video-asset and continuity audit"). Audit only: no files were changed, nothing was generated and nothing was committed.
Date: 4 Nov 2026. Brief: `docs/briefs/2026-11-04-ashutosh-mandatory-corrections-brief.txt` (sections 2, 3, 4, 10, 11A-D).

**How this was checked, and its limits.** I worked from the files, not from the live site. For every clip I measured duration, frame rate, size and keyframe spacing with ffprobe. I pulled frames 8 times a second into contact sheets, and every single frame around fast events (turns, the door, exits). Then I looked at them. I also measured motion with a small script. It works out how much each frame differs from the one before it, finds the camera's sideways shift, and checks a cropped area such as one propeller. I ran ffmpeg's black-frame detector too. **I was looking at sequences of still frames and at numbers, not watching the film play in real time in a browser.** Two things need a real-time viewing on Kevin's machine: how smooth a move feels, and how the site behaves while you scroll. I say where that matters.

Times are given two ways: **film time** (seconds into the published `site-v2/media/film-1600-e.mp4`) and **clip time** (seconds into the raw clip in `assets/v5/out/`). Each clip lasts 5.04 s, so clip *n* starts at film time (n-1) x 5.04.

---

## Summary

1. **The opening is not wide (11A).** At frame 0 of `c01` the drone already fills about 19% of the picture width and sits in the upper left. It never enters the shot. The hero loop shown before anyone scrolls is the first 18 frames of `c01` at half speed. It jumps back to the start every 1.5 s.
2. **The drone flies backwards (2A).** Through all of `c03` (film 10.1-15.1 s) its nose and camera face us while it flies away towards the building. It never yaws (turns on the spot) or banks (tilts into a turn). In `c04` (film 16.4-17.4 s) it then darts sideways out of frame, smeared with heavy blur. That is the "accelerating out of frame" exit.
3. **The propellers never actually spin (3).** In the hover clip `c02`, the blades are a painted-on blur that shimmers in place. The blades don't turn from frame to frame, and they are completely frozen in the first 0.5 s and the last 1.2 s of the clip. On the site, the drone stop moves the film back and forth by ±0.4 s on a sine wave. So while nobody scrolls, the rotors run at no more than 27% speed, play backwards half of the time and stall each time the direction flips.
4. **Entrance (4).** The building changes shape partway through `c04` (film ≈17.6-18.2 s). A roller shutter is visible until film ≈23.7 s. Then it disappears and two riveted steel door leaves appear at the left and right edges. One closes in at film ≈24.2-24.7 s, then both slide apart at film 25.2-27.7 s. **The handover's guess is confirmed:** key frame `k05a` was prompted with "its dark steel door frame visible at both edges of the picture". The heavy dust that bursts from both sides of the doorway starts at film ≈17.9 s and comes from `k04b`.
5. **Two of the three "stops" are still images.** `c07` (the humanoid stop) and `c12` (the quadruped stop) barely change from frame to frame: the measured change is about 0.07 out of 255 grey levels, which is compression noise. Over the full 5 s, nothing moves. The scroll wobble can't bring them to life.
6. **Humanoid (2B, 11B).** The full body stays in frame during the walk. In `c08` it walks *towards* us for 1.4 s, then spins 180° in about 0.65 s (film 36.7-37.4 s). After that it walks away facing the right way. Where `c08` meets `c09` (film 40.33 s), the camera goes from standing still to a fast dolly (a camera sliding forward) within one frame. I found no extreme close-up of the humanoid in the main film. The only one in any published footage is in the Vision film at 12.6-13.1 s, where the camera crashes through the humanoid's arm.
7. **The corridor is empty for about 6.2 s of film (11C),** from film ≈42.9 s to ≈49.1 s. That is roughly 115% of a screen height of scrolling with no subject. The camera also stops dead and restarts in the middle, at film 45.38 s.
8. **Quadruped (2C, 11D).** `c11` has two snap turns: front-on to side-on at film ≈52.5-52.9 s, while the hall's walls and light change, and side-on to front-on in about 0.35 s at film ≈54.4-54.8 s. `c13b` lunges towards the camera, whips round in about 0.5 s, and the hall's back wall turns into an open bay onto the construction site (film ≈62.1-63.1 s). The robot never leaves the frame before the scan starts.
9. **Vision (10)** opens with about 6.5 s of the same construction site, crane and drone as the intro. The film covers wide, drone, humanoid, quadruped and final wide. There is no platform shot: that is the live interface drawn by code (the "ghosted" `#visplat`). **Contact (10)** uses `bg-corridor` for its background, which is the humanoid's plant-room aisle again.
10. **No black frames** in any published video. All clip joins match frame to frame. The film is 23.3 MB with a full keyframe every 24 frames (1 s) plus B-frames (frames that also borrow from frames later in the clip). That makes scroll-seeking expensive. It's an encoding fix, not new footage.

**Root cause behind most of the motion faults:** each clip was made by Kling's "first and last frame" mode from two still key frames. Where the two stills don't share a camera height, an angle or the same architecture, the model morphs between them instead of moving the camera. This explains the building change in c04 (`k03a`, high and three-quarter, to `k04b`, ground-level and front-on), the door leaves (`k05a`), the hall change in c13b (`k10a` window wall to `k11d` open bay) and the backwards drone (`k03a` was drawn with the drone facing the camera).

---

## Clip-by-clip table

| Clip | Film time | What it shows | Problems found (brief §) | Evidence | Verdict |
|---|---|---|---|---|---|
| hero-loop-e | before scroll | c01 frames 0-17 at 12 fps, looping | Drone already large (11A). Each restart jumps back to the start: the jump is 12.9 grey levels against 1.6 for a normal frame step (2A) | ev01 | Replace with the new opening |
| c01 | 0-5.04 | Drone flies in over the site and settles | Drone is 19% of the frame width at frame 0, already in the shot (11A). Mild sideways crab, no banking | ev01 | **Replace** |
| c02 | 5.04-10.08 | Hover (drone stop d1) | Rotors are a static blur that shimmers in place. Frozen in clip 0-0.55 s and 3.8-5.0 s (3). On the site, the stop wobble plays it backwards and forwards (3) | ev06 | Replace, or solve propellers in code (see the code section) |
| c03 | 10.08-15.13 | Drone flies to the plant building | Drone faces the camera while flying away the whole time; no yaw or bank (2A). The building and crane change shape. Starts at full speed within one frame (film 10.13 s) | ev02 | **Replace** |
| c04 | 15.13-20.17 | Drone exits, camera goes to the entrance | Drone darts out with motion smear, clip 1.25-2.3 s, film 16.4-17.4 s (2D). The façade turns into a different, darker front, clip 2.5-3.0 s (4). Dust puffs from both sides from clip 2.75 s (4) | ev03, ev04 | **Replace** |
| c05 | 20.17-25.21 | Through the entrance; humanoid far away | Shutter visible only until clip ≈3.5 s, then side door leaves appear; the right leaf moves in at clip ≈4.0-4.5 s (4). Dust at the start | ev05 | **Replace** |
| c06 | 25.21-30.25 | Humanoid walks towards us, full body, stops | Door leaves at both picture edges slide apart, clip 0-2.5 s (4). The walk itself is good | ev05 | **Trim**: keep from about clip 2.75 s if a new c05 ends on that frame |
| c07 | 30.25-35.29 | Humanoid stop (h1) | Effectively a still image: frame-to-frame change 0.07 for 5 s. No idle motion (3, last line) | numbers below | Replace (priority B) |
| c08 | 35.29-40.33 | Humanoid turns and walks away | Walks towards us for 1.4 s first, then a 180° spin in about 0.65 s (2B). After the turn it walks away facing the right way, full body | ev07 | **Replace** |
| c09 | 40.33-45.38 | Camera follows humanoid; it exits; into the passage | Camera goes from still to fast in one frame (film 40.33 s). The humanoid leaves behind machines at clip ≈2.6 s while the camera carries on without it, then the camera stops dead at the end (2D, 11C). Fastest movement in the film: about 6 times the median | ev09 | **Replace** (merged with c10) |
| c10 | 45.38-50.42 | Passage, then the hall; quadruped appears | No subject until clip 3.75 s. The camera restarts from a dead stop (11C) | ev09 | **Replace** (merged with c09) |
| c11 | 50.42-55.46 | Quadruped walks towards us, then stops | Front-on to side-on turn at film ≈52.5-52.9 s while the hall's walls and light change. Side-on to front-on in about 0.35 s at film 54.4-54.8 s (2C) | ev10 | **Replace** |
| c12 | 55.46-60.5 | Quadruped stop (q1) | Effectively a still image: 0.06 change for 5 s (3, 8) | numbers below | Replace (priority B) |
| c13b | 60.5-65.54 | Quadruped departs towards the bay | Lunges towards the camera (film 60.9-61.4 s), whips round (61.5-62.0 s), back wall turns into an open bay onto the site (62.1-63.1 s). Never leaves the frame, and the scan runs over its last frame (2C, 2D, 11D) | ev11 | **Replace** |
| c13, v02 | not used | Rejected alternates | Not audited in depth | | Keep out |
| vision-1600-e | Vision chapter, 20.2 s | v01, v02b, v03, v04 | 0-6.5 s repeat the intro's construction site, crane and drone (10). Camera crashes through the humanoid at 12.6-13.1 s. No platform shot (10) | ev12 | Replace v01, v02b and v03; keep v04 |
| bg-corridor | Contact | 3.6 s loop of the plant-room aisle | Same environment as the humanoid scenes (10). A crossfade double image near 3.0 s | ev12 | **Replace** |

Evidence images are in `docs/audits/evidence/`:
[ev01 opening](evidence/ev01-c01-opening-0s-2.5s-5s.jpg) ·
[ev02 drone faces camera](evidence/ev02-c03-drone-faces-camera-while-flying-away.jpg) ·
[ev03 drone darts out](evidence/ev03-c04-drone-darts-out-1.25-2.2s.jpg) ·
[ev04 façade change](evidence/ev04-c04-facade-morph-2.25-3.2s.jpg) ·
[ev05 shutter to side doors](evidence/ev05-film-23-28s-shutter-becomes-side-doors.jpg) ·
[ev06 rotor crop](evidence/ev06-c02-rotor-crop-frames40-51-vs-100-111.jpg) ·
[ev07 humanoid turn](evidence/ev07-c08-humanoid-turn-every-5th-frame.jpg) ·
[ev08 key frames](evidence/ev08-keyframes-k03a-k04b-k05a-k07a-k08a-k09a-k10a-k11d.jpg) ·
[ev09 empty corridor](evidence/ev09-film-42.5-49.5s-empty-corridor-1fps.jpg) ·
[ev10 quadruped turn](evidence/ev10-c11-quadruped-turn-frames90-113.jpg) ·
[ev11 quadruped departure](evidence/ev11-c13b-lunge-turn-and-hall-morph.jpg) ·
[ev12 Vision and Contact](evidence/ev12-vision-1fps-and-contact-bg.jpg)

---

## 1. Opening (11A): wide, with the drone introduced?

**No.** At `c01` frame 0 (film 0.00 s), the whole drone, all four arms included, already spans about 19% of the picture width. It sits in the upper-left third, already in flight ([ev01](evidence/ev01-c01-opening-0s-2.5s-5s.jpg)). It grows to about 40% by 5 s. The start frame `k01c` was prompted at "about 10 percent of the frame width", and the image generator drew it bigger. The drone never *enters* the scene.
Before the visitor scrolls, the page plays `hero-loop-e.mp4`. That is `c01` frames 0-17 (matched to within 0.5 grey levels), slowed to 12 fps and looped. Every 1.5 s the drone snaps back to its start position.

## 2. Drone orientation against travel direction, c01-c04 (2A)

- **c01:** the drone drifts right and towards the camera with its nose towards the lower left of the picture, turning slowly to face us. That is a slight crab (moving partly sideways), but believable. No banking.
- **c02:** stationary. Fine.
- **c03, film 10.08-15.13 s: fails.** The nose and the gimbal camera face the viewer for all 5 s while the drone shrinks from about 40% to about 12% of the width, so it is flying backwards ([ev02](evidence/ev02-c03-drone-faces-camera-while-flying-away.jpg), frames 0, 36, 72 and 120). There is no yaw and no bank. Motion starts at full speed: the frame change jumps from 0.4 to 5.8 between film 10.08 s and 10.13 s. The cause is the end key frame `k03a`, which was drawn with the drone facing the camera (see [ev08](evidence/ev08-keyframes-k03a-k04b-k05a-k07a-k08a-k09a-k10a-k11d.jpg), first image).
- **c04, film 16.4-17.4 s: fails.** The drone dives across the doorway, warped and smeared, then shoots right past the pipes and out of frame at clip ≈2.3 s ([ev03](evidence/ev03-c04-drone-darts-out-1.25-2.2s.jpg)). It covers about half the building's width in about 0.5 s, much faster than anywhere else. This is the sprint-out exit the brief forbids.
- No visible banking anywhere in c01-c04.

## 3. Propellers (3)

**In the raw hover clip c02.** I cropped tightly on the left and right rotors and compared every frame ([ev06](evidence/ev06-c02-rotor-crop-frames40-51-vs-100-111.jpg): top two rows are frames 40-51, bottom two are frames 100-111).
- The blades never visibly turn. The blur stays at the same angle and only its shape shimmers.
- The drone's body changes by 0.06-0.12 grey levels per frame, which is noise. So any change inside the rotor areas is the rotor itself.
- Left rotor: frames 1-13 (0-0.55 s) and 92-120 (3.8-5.0 s) change by less than 0.5 per frame, so they are frozen. In the middle the change is 1.5-2.7: shimmer, not rotation. The right rotor shows the same pattern.
- The frozen ends happen because the clip was asked to start and end on the same still (`k02a`), and that still has a fixed blur painted into it.

**In the stitched film.** c02 sits at film 5.04-10.08 s unchanged. Its rotors are frozen around both ends of the drone stop.

**On the site.** `tools/v4_engine.js` line 210, in the 'stop' segments (d1, h1, q1), sets the film time to scroll time + 0.4 s x sin(time/1500 ms) x sin(π x position in the stop). While nobody scrolls:
- The film moves at no more than 0.27 s of film per real second, about a quarter of normal speed.
- **Half of the time it runs backwards**, because seeking a video back and forth plays the rotors (and robots) in reverse.
- Each time it changes direction (every 4.7 s), it slows to zero and holds for roughly a second. The rotors look switched off in the air: exactly what the brief describes as "propellers stop during flight and start again".
- The swing shrinks to zero near the start and end of the stop. That is also where c02's rotors are frozen anyway.

In every 'play' segment, the film freezes completely the moment the visitor stops scrolling. That includes c01, c03 and c04, where the drone is mid-flight with its rotors frozen. The brief's requirement (rotors keep spinning during hover and reveal states, separate from scrolling) cannot be met by scrubbing this film.

On c07 and c12 the wobble does nothing, because those clips are still images (see §5 and §7).

## 4. Entrance and shutter (4)

- **Exterior.** In `c03` (clip ≈3 s) the slatted roller shutter is about half down. By the end of `c03`, and at the start of `c04`, it is raised ([ev02](evidence/ev02-c03-drone-faces-camera-while-flying-away.jpg), [ev04](evidence/ev04-c04-facade-morph-2.25-3.2s.jpg)). So it sits at different heights between shots.
- **The architecture changes.** In `c04` clip 2.5-3.0 s (film ≈17.6-18.2 s), the camera doesn't fly round to the front. The high three-quarter view of the building turns into a different, darker, front-on façade: new windows, a different doorway shape, and suddenly bright light inside ([ev04](evidence/ev04-c04-facade-morph-2.25-3.2s.jpg), rows 2-3).
- **Dust.** From clip 2.75 s in `c04` (film ≈17.9 s), dust bursts out on both sides of the doorway. It stays heavy until about `c05` clip 3 s (film ≈23 s). This matches key frame `k04b`, which is foggy.
- **Left and right doors.** The overhead shutter is visible at the top of the picture until film ≈23.7 s ([ev05](evidence/ev05-film-23-28s-shutter-becomes-side-doors.jpg), row 1). Then it disappears and riveted steel door leaves fill the left and right edges. At film ≈24.2-24.7 s the right leaf moves inwards: the opening narrows, which reads as doors closing. Then, during `c06` clip 0-2.5 s (film 25.2-27.7 s), both leaves slide outwards, which reads as doors opening. I measured the dark area at the left edge falling from 17% to 6% of the width over that time. **This confirms the handover lead:** `k05a` was prompted "its dark steel door frame visible at both edges of the picture" ([ev08](evidence/ev08-keyframes-k03a-k04b-k05a-k07a-k08a-k09a-k10a-k11d.jpg), third image), and the clips morph into and out of it.

## 5. Humanoid (2B, 11B)

- **c06 (film 25.2-30.25 s):** walks towards the camera with a natural gait. The full body, helmet to feet, is visible throughout, at about 35% of the frame height. It slows and stops. Good, apart from the door leaves at the picture edges.
- **c07 (film 30.25-35.29 s):** a frozen still. The average change between frames is 0.072 (the busiest frame reaches 0.34), with no trend: no weight shift, no head turn. The prompt asked for both.
- **c08 (film 35.29-40.33 s):** after the stop it first walks *towards* the camera again for about 1.4 s, reaching about 55% of the frame height. Then, at clip 1.4-2.1 s (film ≈36.7-37.4 s), it spins 180° in about 16 frames (0.65 s). I can't confirm a clear foot pivot at this size. From then on it walks away seen from behind, which I checked on enlarged frames 70, 100 and 120 ([ev07](evidence/ev07-c08-humanoid-turn-every-5th-frame.jpg)). Its direction is consistent once it has turned, but the turn is too fast and comes after a pointless step towards us.
- **c08 to c09 join, film 40.33 s:** in c08's last frames the change is about 0.15 (nearly still). In c09's first frames it is 7.75, rising to 11.5 within 0.3 s. The camera goes from standing to a fast dolly in one frame.
- **c09:** the humanoid walks away (back view confirmed). At clip ≈2.6 s (film ≈42.9 s) it veers right and disappears behind machinery near the bright passage. It doesn't speed up, which is good. But the camera doesn't follow it: the camera carries straight on into the passage.
- **Full body during the main walk:** yes, in c06, c08 and c09.
- **Extreme close-up "at the end" (11B):** none in the main film, where the humanoid is at most about 55% of the frame height (c08, film ≈36.7 s). The only extreme close-up of the humanoid in published footage is in the **Vision film at 12.6-13.1 s** (clip v03, about 2.5-3.0 s in). There the camera passes through the robot's arm, which blurs across the whole frame; this is the largest frame-to-frame change in the Vision film. On phones and tablets the engine also crops and pulls the camera back at stops (`kAt`, `cropFor`). I didn't test that in a browser. Ashutosh may mean either the Vision moment or a crop on a smaller screen; **confirm with him which one.**

## 6. Corridor (11C)

The humanoid is last seen at film ≈42.9 s (c09 clip 2.6 s). The quadruped first appears, tiny at the left edge, at film ≈49.1 s (c10 clip 3.75 s) ([ev09](evidence/ev09-film-42.5-49.5s-empty-corridor-1fps.jpg)). **That is about 6.2 s of film with no subject.** On the site the 'trans2' segment gives film 40.33-50.42 s about 190% of a screen height of scrolling, so the empty stretch costs the visitor about 115% of a screen height. The camera also stops dead at the end of c09: the change is 0.05-0.14 for the last 6 frames, then jumps to 3.2 at film 45.42 s. So the camera pauses and starts again in the middle of the empty passage.

## 7. Quadruped (2C, 8, 11D)

- **c11 (film 50.42-55.46 s)** ([ev10](evidence/ev10-c11-quadruped-turn-frames90-113.jpg)):
  - Clip 0-1.8 s: walks front-on towards the camera.
  - Clip ≈2.1-2.5 s (film ≈52.5-52.9 s): turns about 90° to side-on while the camera swings. In the same moment the hall's back wall, its windows and the light change (warm sun shafts become cold blue window strips). The architecture is not consistent.
  - Clip 3-4 s: side-on, facing left.
  - **Clip 4.0-4.35 s (film ≈54.4-54.8 s): snaps from side-on to front-on in about 8 frames.** The legs don't show a matching turning step pattern.
- **c12 (film 55.46-60.5 s):** a frozen still. The average change between frames is 0.062 (the busiest frame reaches 0.25). The prompt's "sensor head slowly turns" did not happen. Five seconds of film are mapped to about 170% of a screen height of scroll, so this is the long stationary period the brief mentions (§8).
- **c13b (film 60.5-65.54 s)** ([ev11](evidence/ev11-c13b-lunge-turn-and-hall-morph.jpg)):
  - Clip 0.4-0.9 s: lunges towards the camera and to the right, growing about 1.5 times.
  - Clip 1.0-1.5 s: whips round in about 0.5 s.
  - Clip 1.6-2.6 s (film ≈62.1-63.1 s): the window wall behind it becomes walls with doorways, then a huge open bay onto the dawn construction site.
  - After that it walks away at a steady pace (not a sprint), but it is **still in frame at the last frame**. The film holds that frame (HOLD = 65.5 s) while the scan starts.
  - **So: the departure is not shown, and the move from indoor to outdoor happens as the room changing shape, not as a camera move (11D).**
- **Cause:** `k10a` (hall with a window wall) and `k11d` (hall with an open bay) are different rooms ([ev08](evidence/ev08-keyframes-k03a-k04b-k05a-k07a-k08a-k09a-k10a-k11d.jpg), last two images).

## 8. Exits for all three products, graded against the brief's 8 steps (2D)

The steps: (1) completes the reveal, (2) resumes at natural speed, (3) approaches its destination gradually, (4) slows or adjusts direction, (5) camera follows, (6) goes behind an object, through an entrance or into the distance, (7) camera keeps going, (8) the next environment appears naturally.

| Product | Clip, film time | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | Grade |
|---|---|---|---|---|---|---|---|---|---|---|
| Drone | c03-c04, 10.1-17.4 | yes | no: instant full speed, flies backwards | partly | no: speeds up | partly | behind the building, but as a smeared dart | yes | no: the façade changes shape | **Fail** |
| Humanoid | c08-c09, 35.3-42.9 | yes | no: steps towards us, then a 0.65 s spin | yes | no | yes in c08; c09 starts with a jerk | yes, behind machinery | yes | partly: then 6 s of empty corridor | **Partial fail** |
| Quadruped | c13b, 60.5-65.5 | yes | no: lunges towards the camera | yes | no: 0.5 s whip turn | yes | **no**: still in frame at the end | not shown | no: the hall turns into the bay | **Fail** |

## 9. Vision film (10)

`vision-1600-e.mp4` is 20.17 s long: four 121-frame clips joined end to end, with clean joins. What it shows ([ev12](evidence/ev12-vision-1fps-and-contact-bg.jpg), top two rows at 1 frame per second):

| Vision time | Clip | Content | Against the brief's 6-shot ecosystem order |
|---|---|---|---|
| 0-5.0 | v01 | Apron with small robots, sweeping over the **construction site, cranes**, to a hovering drone | Wide establishing, but **it repeats the intro's construction site, crane and drone** |
| 5.0-10.1 | v02b | Drone (gets large) rises out, mist, plant-room humanoid at a control panel | Drone shot, still at the construction site; humanoid |
| 10.1-15.1 | v03 | Lateral track past the humanoid (**crashes through its arm at 12.6-13.1 s**), to the quadruped at a pump | Humanoid and quadruped |
| 15.1-20.2 | v04 | Pull-back through the windows to the campus at sunrise | Final wide |
| none | | **No footage of the platform receiving and presenting information.** The site shows a copy of the Site View interface over the footage (`#visplat`, the "ghosted" duplicate in 11F) | Platform shot missing as footage; live UI is the right approach, but it needs a clean plate and timing |

So the shots that exist are wide (repeated construction site), drone, humanoid, quadruped and final wide. The platform shot is missing, and the first 6.5 s repeat the intro. The humanoid and quadruped are in the same plant-room aisle as the main film.

## 10. Contact background (10)

`bg-corridor-1600.mp4` is a 3.6 s loop (87 frames) of **the plant-room aisle: big pipes on the left, windows, pumps on the right**. It is the same room as the humanoid scenes in c05-c09 ([ev12](evidence/ev12-vision-1fps-and-contact-bg.jpg), bottom row). So yes, it is the "humanoid factory" footage the brief asks to replace. It also has a crossfade double image at about 3.0 s, and a small jump where the loop restarts (5.9 against 4.1 for a normal frame step). The other loops in `site-v2/media/` (`bg-air`, `bg-site`, `bg-wide`, `bg-quad`, `bg-human`) are all construction site, drone, quadruped-on-stairs or the same aisle, so none of them is a distinct closing environment.

## 11. Black frames and bad joins

- **No black frames.** ffmpeg's black detectors found none in `film-1600-e`, `film-960-e`, `vision-1600-e`, `bg-corridor-1600` or `hero-loop-e`. The darkest frame in the film averages 39.5 out of 255. If black flashes appear on the site, they come from the page (videos still loading, or a fade between layers), not from the files. I didn't test that in a browser.
- **Joins match.** At all 12 joins, the change from the last frame of one clip to the first of the next is 0.3-5.5, the same as or less than normal motion (median 3.4). No image jumps.
- **Speed jumps at joins** (motion from about 0 to full within one frame):
  - film 10.08-10.13 s (c02 to c03: drone departure)
  - film 40.33-40.38 s (c08 to c09: camera)
  - film 45.38-45.42 s (c09 to c10: camera stops dead and restarts)
  - Several clips also open with one repeated frame, a 1/24 s hold. That's minor.
- **Jumps inside clips** are morphs rather than cuts: c04 at 2.5-3.0 s, c05 to c06 (door leaves), c11 at 2.1-2.9 s, c13b at 1.6-2.6 s.
- The fastest movement in the film is c09 clip 1-2.7 s (film 41.3-43.0 s), where a foreground pipe rushes past at 17-22 per frame against a median of 3.4. It reads as a whoosh, worth a real-time look.

## 12. File sizes and encoding (scroll-seeking)

| File | Size | Bitrate | Size, fps, length | Keyframes | Notes |
|---|---|---|---|---|---|
| film-1600-e.mp4 | 23.3 MB | 2.84 Mb/s | 1600x900, 24 fps, 65.54 s (1573 frames) | about every 24 frames (1 s), plus extra ones at scene changes | H.264 High, B-frames on (has_b_frames=2), moov atom first (faststart) |
| film-960-e.mp4 | 8.1 MB | 0.99 Mb/s | 960x540, 24 fps, 65.54 s | same, about 1 s | same |
| vision-1600-e.mp4 | 9.5 MB | 3.78 Mb/s | 1600x900, 20.17 s | about 1 s | lazy-loaded at the quadruped stop |
| vision-960-e.mp4 | 3.3 MB | 1.33 Mb/s | 960x540 | | |
| bg-corridor-1600.mp4 | 1.7 MB | 3.65 Mb/s | 3.6 s loop | one keyframe | |
| hero-loop-e.mp4 | 0.38 MB | 2.07 Mb/s | 1600x900, **12 fps**, 1.46 s | one keyframe | |
| Raw clips (assets/v5/out) | 1.8-15.1 MB each | 2.9-24 Mb/s | 1920x1080, 24 fps, 5.04 s | one keyframe per clip (as delivered) | |

What this means for scrolling. To seek to an arbitrary time, the browser decodes from the previous keyframe, up to 23 frames, and the B-frames add frames that depend on later ones. On top of that, the engine seeks on every animation frame. At a stop it also seeks continuously while nobody scrolls (the wobble). That is a plausible contributor to the lag in §5 of the brief. The fix is re-encoding: a short GOP (the group of frames between keyframes) or every frame a keyframe, no B-frames, and possibly one file per chapter. It needs no new footage. The scroll diagnosis belongs in the separate scroll audit, so treat this as an input to it, not a verdict.

---

## What code can and can't fix

Code can change **how** the footage is played. It cannot change what the footage shows. Per the brief's §15, none of the following counts as "footage corrected".

**Can be done in code or encoding, without new footage:**
- **Propellers at the drone stop:** stop scrubbing c02 by scroll. Remove the sine wobble (it plays footage backwards). Play a hover loop in real time on its own layer, independent of scroll. Honest limit: the existing c02 never shows real blade rotation, only shimmer, and it freezes at both ends. Looping its middle (frames 14-91) would still show "shimmer" and need a crossfade at the loop point. Truly spinning rotors need either new hover footage or a separate rotor-blur layer drawn by code over the four hubs. That layer is feasible only while the drone holds still.
- **Remove the stop wobble** for the humanoid and quadruped too. On those clips it does nothing visible anyway, because they are stills.
- **Re-encode** for seeking (above). Split per chapter, preload the next chapter only.
- **Remake the hero loop** from the new opening at 24 fps, with a seamless loop point.
- **Trim c06** so it starts after the door leaves have gone. This only works if a new c05 ends on that frame (planned below).
- **Platform in Vision:** a clean exit of `#visplat` (11F) is page work. No footage is needed if the platform stays a live interface.

**Cannot be fixed by code; needs new footage:** the backwards drone (c03); the darting drone exit and the façade change (c04); the shutter-to-side-doors change (c05, c06); the frozen humanoid and quadruped stops (c07, c12); the humanoid's spin (c08); the empty corridor and camera stop (c09, c10); the quadruped's snap turns (c11); the lunge, whip-turn, hall change and missing exit (c13b); the wide opening (c01); the repeated construction footage and arm crash in Vision (v01, v02b, v03); the Contact environment. Speeding the film through the empty corridor or the exits would break the brief's "do not accelerate playback".

---

## Replacement footage required

General rules for every clip:
- 1920x1080, 24 fps, 5 s.
- Same look as now: blue hour or dawn, steel-blue grading, the same drone, humanoid and quadruped designs.
- Chained: each clip's last frame is the next clip's first frame.
- **Each pair of start and end key frames must share the camera height, lens and architecture.** That avoids the morphs found above.
- Every new key frame is checked for orientation (which way the product faces) before any clip is made from it. `k03a` was drawn with the drone facing the wrong way.
- Each clip is reviewed frame by frame and in real time before it is used.

"New key frame" means a still image generated first (about 2 tries each). "Extracted" means a frame pulled from an existing clip, which costs nothing.

### Main film: priority A (the brief explicitly fails today)

| # | Replaces | Start frame | End frame | Subject and camera move | Must NOT happen |
|---|---|---|---|---|---|
| R1 | c01 (and the hero loop) | **New** very wide establishing frame: site at blue hour, drone tiny (≤5% width) or just outside the frame | `k02a` (reuse) | Drone enters from the distance nose-first, flies towards the camera, slows steadily into a hover. Camera eases gently down | Drone large at the start; sideways crab; sudden speed changes |
| R3a | c03 | `k02a` (reuse) | **New** `k03` (drone seen from behind or three-quarter rear, small, building with the shutter fully up in the background, same camera height as R3b's end) | Drone yaws to turn its nose towards the building, pitches forward, banks gently, flies nose-first at a steady speed. Camera follows behind | Flying backwards; instant full speed; the building changing shape |
| R3b | c04 | New `k03` | **New** `k04` (exterior from the same height, overhead roller shutter **fully raised**, light haze only, no drone) | Drone flies on and passes behind the building's far corner at the same speed. Camera keeps going and descends towards the entrance | Darting or smeared drone; the drone leaving the frame faster than it flew; the façade changing; dust bursts; the shutter moving |
| R4 | c05 (and the first 2.75 s of c06) | New `k04` | **Extracted**: c06 frame about 66 (clip ≈2.75 s, no door leaves at the picture edges) | Camera travels straight under the raised overhead shutter, which stays fully open and visible above, into the aisle. Humanoid walking far away | Any left or right door leaves; any opening or closing; a change of entrance size; heavy fog |
| R7 | c08 | `k06a` (reuse) | `k07a` (reuse: humanoid from behind, walking away) | Humanoid turns on the spot in steps over about 1.5 s (feet pivot, torso follows, head settles), then walks away full body. Camera follows at a steady distance | Stepping towards the camera; a spin under 1 s; close-ups |
| R8 | c09 and c10 (merged into one 5 s clip; saves 5 s of empty film) | `k07a` (reuse) | `k09a` (reuse: quadruped small in the hall), or a new frame with the quadruped already visible through the passage | Camera follows the humanoid, which turns off through a side doorway or behind a machine at walking pace. Camera **keeps moving at an even speed** through a short passage. The quadruped is visible ahead within about 1.5 s of the humanoid leaving | More than about 1.5 s with no subject; the camera stopping and restarting; the foreground rushing past the lens |
| R9 | c11 | `k09a` (reuse) | **New** `k10` (quadruped standing three-quarter-on, in the **same hall, with the open bay already visible in the background**) | Quadruped walks across the hall, makes one gradual turn of 2 s or more with its legs stepping round, slows and stops. Camera tracks smoothly | Snap turns; the hall's walls or lighting changing; walking towards the lens |
| R11a | c13b, first half | New `k10` | **New** `k11` (same hall, quadruped seen from behind, small, near the bay) | Quadruped turns away in steps (2 s or more), walks at a steady pace towards the bay. Camera follows at a constant distance | Lunging towards the camera; a whip turn; the bay appearing from nowhere |
| R11b | c13b, second half (11D) | New `k11` | **New** `k12` (outside: the site or structure that the scan is laid over, no quadruped, or the quadruped tiny in the distance) | Quadruped walks out through the bay into the distance or past the edge of the bay. **Camera keeps going** out through the bay into the outdoor scene where the scan begins | The quadruped still in frame when the scan starts; a jump from indoors to outdoors |

### Main film: priority B (idle motion while stopped; brief §3, last sentence, and §8)

| # | Replaces | Start = end frame | Content | Must NOT happen |
|---|---|---|---|---|
| R2 | c02 (hover) | `k02a` (reuse) | Drone holds position; rotors as fast, consistent blurred discs throughout; tiny drift. To be played as a real-time loop, not scrubbed | Rotors frozen at the start or end. Risk: AI video models often fail at propellers. If this take also shows only shimmer, use a code-drawn rotor layer instead (see above) |
| R6 | c07 (humanoid stop) | `k06a` (reuse) | Standing, slight weight shift, small head turn and back; looped in real time | A frozen still; any walking |
| R10 | c12 (quadruped stop) | New `k10` (from R9) | Standing, sensor head turns slowly and back, small body settle; looped | A frozen still; any walking |

### Vision (10)

| # | Replaces | Start | End | Content | Must NOT happen |
|---|---|---|---|---|---|
| V1 | v01 | **New** wide establishing frame of a **different** setting from the intro (wording and choice to agree with Ashutosh: for example the whole industrial campus from a new direction, no construction cranes) | **New** drone frame in that setting | Slow, wide aerial move that finds the drone surveying | The intro's construction site or crane |
| V2 | v02b | New drone frame | `v02a` (reuse: humanoid at the control panel) | Drone continues on its survey path out of the frame; camera moves into the plant | The drone growing large near the lens |
| V4 | v03 | `v02a` (reuse) | `v03a` (reuse: quadruped at the pump) | Lateral track past the humanoid at a **safe distance** (whole body visible), on to the quadruped | Passing through or brushing the robot (today 12.6-13.1 s) |
| none | v04 kept | `v03a` | `v04a` | Pull-back to the final wide (unchanged) | |
| none | platform shot | none | none | Keep the platform as live interface over a clean plate (for example the start of v04). No AI-drawn interface or text | |

### Contact (10)

| # | Replaces | Start = end frame | Content | Must NOT happen |
|---|---|---|---|---|
| C1 | bg-corridor | **New** key frame of a distinct closing environment (for example the campus exterior at dusk or an operations room without screens showing text; choice to agree with Ashutosh) | Slow, near-static push or drift that loops seamlessly; dark enough for the overlay and form | The plant-room aisle; robots in close-up; crossfade double images |

**Existing key frames reused:** k02a, k06a, k07a, k09a, v02a, v03a, v04a, plus one frame extracted from c06.
**Not reusable:**
- k01c (drone too big)
- k03a (drone faces the camera)
- k04b (heavy fog; ground-level angle doesn't match the aerial frames)
- k05a (door leaves at the picture edges)
- k10a and k11d (two different halls)
- v00a and v01b (construction site)

---

## Cost estimate (needs Kevin's yes before anything runs)

**From logged past spend (`SPEND.md`; every row there is marked "est.", meaning Higgsfield's quoted price, not a balance-checked bill):**
- 5 s clip, `kling-video/o3/first-last-frame`, 1080p: **$0.476 per clip**. 3 Nov: 17 clips for $8.09, then 2 re-dos for $0.95. 2 Nov: 9 clips for $4.28, noted as "15% discount applied". On 28 Oct the same model was $0.56 per clip before the discount, so the discount may not be permanent.
- Key frame, `xai/grok-imagine-image-2.0` (edit): **$0.07 per image** (3 Nov: 32 for $2.24, then 4 for $0.28).
- For reference, not used here: `kling-video/v3.0/pro/image-to-video` cost $0.84 per 5 s clip (28 Oct).
- `tools/jobs-v5-clips.json` and `jobs-v5-redo.json` record $0.476 for every v5 clip, and `jobs-v5-kf*.json` record $0.07 per key frame. That is consistent with the above.

**Assumptions (mine, not logged):**
- The same models and the same $0.476 rate still apply. Ask Higgsfield's free estimate before running.
- Retakes: about one in two of the motion-critical shots needs a second take. That is higher than the 3 Nov rate (2 of 17), because turns, exits and rotors are exactly what failed last time.
- 2 tries per new key frame, as in the 3 Nov plan.
- The price of 10 s clips is **unknown**. All shots above are planned at 5 s.

| Item | Count | Rate (source) | USD |
|---|---|---|---|
| New key frames: opening wide, k03, k04, k10, k11, k12, Vision wide, Vision drone, Contact (9 frames x 2 tries) | 18 | $0.07 (logged) | $1.26 |
| Main film clips, priority A: R1, R3a, R3b, R4, R7, R8, R9, R11a, R11b | 9 | $0.476 (logged) | $4.28 |
| Main film clips, priority B: R2, R6, R10 | 3 | $0.476 (logged) | $1.43 |
| Vision clips: V1, V2, V4 | 3 | $0.476 (logged) | $1.43 |
| Contact loop: C1 | 1 | $0.476 (logged) | $0.48 |
| Retake allowance (assumed): 8 clips | 8 | $0.476 (logged) | $3.81 |
| Retake allowance (assumed): 6 key frames | 6 | $0.07 (logged) | $0.42 |
| **Total** | 16 clips + 8 retakes, 24 key frame images | | **$13.11** |

Without priority B: about $11.68 (13 clips + 8 retakes + key frames).
`HANDOVER.md` puts the Northstar Higgsfield balance at **about $44.60 (estimate; confirm before quoting)**. Running anything also needs the cloud setup from the handover first: an `HF_CREDENTIALS` secret, and fixing the Mac-only paths in `tools/hf.mjs`.

---

## Not checked, or only partly checked

- **Real-time playback and real scrolling.** I looked at frame sequences and measurements only. How smooth things feel, and what the site does while you scroll (stutter, black flashes from loading or fades, the phone and tablet crops), needs a browser on real devices. That belongs to the scroll audit.
- **Feet during the humanoid's turn** in c08: the robot is too small to judge whether the feet pivot.
- **Propellers in c01, c03 and c04** were not measured by crop, because the drone is moving. In the sheets they look like the same painted blur style as c02.
- **Whether 11B ("extreme close-up at the end")** means the Vision arm crash, a crop on smaller screens, or an older film: to confirm with Ashutosh.
- **The rejected alternates `c13` and `v02`** and the older `film-*-b` and `film-*-c` were not audited.
- **Prices** are the logged estimates. Current Higgsfield pricing and the account balance were not checked, because no credentials are available in this session.
