# Hero V3: photoreal scroll film (proposal, 28 Oct 2026)

Kevin's verdict on V1/V2: "looks AI generated and shitty... want hyper realistic with amazing animation."
The cause: the drone, humanoid and robot dog in V1/V2 are built from basic shapes in code, and code shapes can't look real. V3 replaces them with photoreal Higgsfield footage, with the site's own animation layered on top.

## Concept: "One continuous shot"
Scrolling plays a single, unbroken cinematic camera move, frame by frame (the Apple product-page technique; the Unitree Go2 reference does a small version of it):

1. **Dawn, hero:** a photoreal industrial drone hovers right in front of the camera, sun behind it, a huge construction site soft in the background. It loops gently until you scroll.
2. **Take-off:** the camera swings round as the drone climbs and banks over the site.
3. **Scan:** a high view of the site; our code draws the LiDAR sweep and detection boxes over the real footage.
4. **Descent:** the camera dives toward a building and into a plant room.
5. **Humanoid:** a humanoid robot walks toward the camera and inspects a valve.
6. **Ground robot:** a quadruped robot climbs a stairwell, ending on "Book a demo".

Each shot's last frame becomes the next shot's first frame (Kling first/last-frame mode), so the whole thing plays as one take.

## The animation layer (code, on top of the footage)
- Huge headline reveals masked to the scroll, letter by letter
- HUD overlays that track the footage: scan lines, detection boxes, data tags (no fake numbers)
- Smooth inertial scrolling, film grain, a vignette, and colour grading to the brand amber
- Phones get a lighter video encode of the same film

## Models and prices (from Higgsfield's free estimate, 28 Oct)
| Step | Model | Unit price |
|---|---|---|
| Keyframe stills | Grok Imagine 2.0 / Qwen Image 3 | $0.06 / $0.04 per image |
| Shot clips (5 s) | Kling 3.0 Pro image-to-video | $0.84 |
| Seamless transitions (5 s) | Kling O3 first/last frame | $0.56 |
| Optional 4K hero clip (5 s) | Kling 3.0 4K | $2.10 |

## Budget, in two gates
- **Gate 1: stills only, about $1.50.** Around 24 photoreal keyframes (6 shots × 4 options). Kevin sees how real it looks before any video money is spent.
- **Gate 2: video, about $4–5 for one pass, up to about $10 with redos.** 6 clips. 4K for the hero only adds about $1.30.

All spend gets logged in SPEND.md for client reimbursement.

## Rules
- No real brand logos on the hardware (no DJI or Unitree marks), and nothing presented as a specific real product.
- No AI-generated people presented as staff or customers.
- On-screen text and data are drawn in code, never baked into the AI footage.
