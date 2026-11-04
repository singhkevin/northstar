# Northstar website plan

Drafted 28 Oct 2026. A first draft for Kevin to approve or change.

## 1. What we're building

A one-page scroll story (plus a few inner pages) for **Northstar: drones and robots that capture your sites, plus AI that reads the data.**
It's the same founders as Biltflow, so it should feel like a sister brand: premium, calm, technical, built around one 3D scene.
It should not look like a copy of Biltflow.

What we take from each reference:

| Reference | What we take | What we leave |
|---|---|---|
| **DroneDeploy** | How the story is ordered: one platform with three outcomes (Progress, Quality, Safety), an industries list, how it works, a "Book a demo" button in the header and footer | Their wording, their stats ("3 million sites"), their customer quotes. We write our own words and never invent numbers or testimonials. |
| **drone.riotters.com** (Aevion) | **The flying drone.** A real 3D drone (a 3D model file) that hovers over a giant faded wordmark, flies and tilts as you scroll, scans terrain with a LiDAR line, then folds up for a close-up. Clean off-white look, big thin headings, numbered sections, spec strips. | Their actual drone model, terrain and video files. Those are their property, so we source or make our own. |
| **AI Robots / Unitree Go2** | **The robot reveal.** A robot dog on a dark stage that turns and walks as you scroll. It's built as a flipbook of about 200 photo-real frames drawn onto the page, plus big spec numbers that count up. | Unitree's frames and photos. Same rule: our own renders only. |

## 2. Home page, beat by beat

The page opens light (sky and field, for drones) and darkens as it goes (the robot's stage), then returns to light for the platform section.
That gives the two halves, drones and robotics, their own look.

| # | Beat | What you see while scrolling | Built with |
|---|---|---|---|
| 1 | **Hero** | A drone hovers with its propellers spinning in front of a huge faded **NORTHSTAR** wordmark. Short line, e.g. *"Drones and robots that see every site."* Book a demo button. | 3D drone |
| 2 | **Take-off** | The drone climbs and tilts forward. The camera follows it out over a site (terrain plus a building under construction). | 3D drone + terrain |
| 3 | **Scan** | A LiDAR sweep runs across the ground and leaves a glowing point cloud behind. Stat strip (range, accuracy, area per day), using Northstar's real numbers only. | 3D point cloud |
| 4 | **The drone, up close** | The drone flies back to centre, rotates, and its arms fold. Spec callouts point at the camera, LiDAR and battery. | 3D drone |
| 5 | **Handoff: sky to ground** | The drone lands. The page darkens. *"Some places a drone can't reach."* | Transition |
| 6 | **The robot** | A robot dog walks onto a dark stage, turns 360° as you scroll, climbs a step. Its specs count up beside it (speed, runtime, stairs, waterproofing). | Flipbook of frames |
| 7 | **Inside the site** | The robot patrols a corridor or plant room at the same time each day. Callouts flag a leak, a blocked exit, a missing guardrail. | Frames or short video |
| 8 | **One platform** | Back to light. Drone data and robot data land in one dashboard. Three tabs: **Progress, Quality, Safety**, the same structure as DroneDeploy, in our own words. | Real UI screenshots, or clean mock screens labelled as illustrative |
| 9 | **How it works** | Capture → Process → Act, as three steps with small looping animations. | 2D motion |
| 10 | **Industries** | Tabs: Construction, Energy & Solar, Mining, Infrastructure, Data centres, Oil & Gas, each with a real photo and 3–4 use cases. | Tabs |
| 11 | **Hardware lineup** | Drone and robot cards (later, one card per model) linking to their own pages. | Cards |
| 12 | **Book a demo** | Big closing CTA with a short form. | Form |

## 3. Inner pages (phase 2)

- **/drones**: drone mapping, surveying, inspection
- **/robotics**: the robot dog (and later others), autonomous patrols, interior scans
- **/platform**: the AI and dashboard (Progress / Quality / Safety)
- **/industries/[name]**: one page per industry from a shared template
- **/about**, **/contact** (Book a demo), plus privacy, terms and cookie pages like Biltflow v10

## 4. How it's built (tech, in plain English)

- **Next.js** (the same family as the Tribe builds), hosted on **Vercel** under the viral-inbound team. Preview link at something like `northstar.viralinbound.in` until the founders give us their domain.
- **React Three Fiber (three.js)** for the 3D drone, terrain and point cloud: one 3D scene behind the page that scroll position drives. This is how the Aevion site works.
- **GSAP ScrollTrigger + Lenis** for smooth scroll and pinned sections.
- **Canvas flipbook** for the robot: about 120–200 frames, compressed (AVIF/WebP), loaded progressively. This is how the Go2 page works.
- **Phones get a lighter version**: fewer frames, a simpler drone, and a short video in place of the live point cloud. People who've turned on reduced motion in their phone settings get still images.
- **Speed target**: first screen visible in under 2.5 s on 4G. The heavy 3D loads after the hero.

## 5. The 3D assets (the hard part)

The look depends on the drone model and the robot frames. Options, best first:

1. **Northstar's own hardware.** If they fly a specific drone (e.g. a DJI Matrice) or run a specific robot (e.g. a Unitree, a Boston Dynamics Spot), we use a properly licensed 3D model of *that* machine. Honest and on-brand.
2. **Licensed stock models** (Sketchfab, TurboSquid, CGTrader) of a generic drone and quadruped, about $20–150 each. Needs Kevin's OK before buying.
3. **Our own Blender render** of the robot turntable and walk, which becomes the flipbook frames. We already have a Blender setup from the Biltflow film.

We won't use any files lifted from the reference sites, and no AI-generated "photos" that pass off fake hardware as Northstar's.

## 6. Look and feel (starting point; I'll show 2–3 options before building)

- Off-white base (sky) with a deep graphite stage for the robot section. One accent colour, e.g. signal orange or a "north star" cool white-blue.
- Large thin sans-serif headings like Aevion's, a mono font for specs and labels (`[ MAX RANGE ]`), and numbered sections.
- A small star mark used as the scroll-progress indicator, a nod to the name.

## 7. Phases

| Phase | What happens | Output |
|---|---|---|
| 0. Inputs | Kevin / founders answer the questions below | Answers |
| 1. Direction | 2–3 hero style frames + finished copy for every beat | Kevin picks one |
| 2. Assets | Drone model, terrain, robot frames ready | Asset folder |
| 3. Home build | The full scroll story, desktop + phone | Preview link |
| 4. Inner pages | Drones, Robotics, Platform, Industries, About, Contact, legal | Preview link |
| 5. Polish + QA | Many screen sizes, speed checks, SEO basics | Ready for go-live |

## 8. Kevin's answers (28 Oct 2026)

1. **What Northstar does:** "Yes", read as all three: it supplies the drones and robots, runs them on clients' sites, and provides the AI platform. The story is full-stack: *hardware + crews + software*.
2. **Models:** none chosen yet; hardware is picked per use case. So the site shows **use cases, not model numbers**, and the 3D drone and robot are our own generic designs (built from simple shapes in code, so there are no licensing worries). We show no spec numbers we can't stand behind; spec strips name *capabilities* (e.g. "Survey-grade mapping") until real figures exist.
3. **Audience:** investors and potential clients. As on Biltflow, the page never mentions investors; it reads as a confident company site that also works as a pitch.
4. **Logo:** final logo supplied by Kevin (28 Oct): four-point star with an **amber centre `#FFBA00`**, "NORTHSTAR" wordmark, descriptor **"HUMANOID & ROBOTICS"**. Files in `brand/` (full, white, compact header version, mark only). The site accent is now amber, replacing the orange from the drafts. The old concepts in `logo/` are superseded.
   - Open: the descriptor says *Humanoid* & Robotics, so the ground-robot half of the story may need a **humanoid** (alongside or in place of the robot dog). Waiting on Kevin.
5. **Biltflow:** never mentioned.
6. **Stage:** between pitch prototype and launch. Build it to launch quality, behind a preview link, with forms that can be wired to a real inbox later.

## 9. Original questions

1. **What does Northstar actually do?** Build and sell drones and robots, run them as a service on clients' sites, or the software/AI layer that works with other hardware (like DroneDeploy)? This changes the whole story.
2. **Which hardware?** Specific drone and robot models, or generic?
3. **Who is the site for?** Construction companies, asset owners, government, investors (the Biltflow rule was to never mention investors on the page)?
4. **Brand assets:** logo, colours, any deck, real numbers we're allowed to show?
5. **Link to Biltflow?** Mention it ("data flows into Biltflow"), or keep them fully separate?
6. **Domain**, and is this a pitch prototype or the launch site?
