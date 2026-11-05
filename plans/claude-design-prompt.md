# Claude Design prompt — Northstar website

Paste everything below the line into Claude Design. Attach: the logo files
(`northstar-flight-ribbon.svg`, `-white.svg`, `-compact.svg`, `-icon.svg`), the
content PDF, and any drone/robot photos or video you have. If you have no
hardware imagery yet, leave it — the prompt tells it to use tasteful placeholders.

---

Build a single-page, premium scroll-story marketing website for **Northstar** — a Physical AI and autonomous-robotics company (drones, quadruped robots, humanoid robots and industrial IoT for inspecting and verifying real-world sites). Audience: enterprise construction, energy, infrastructure and industrial buyers. The feel: **a clear dawn sky over a working site — technical, quiet, confident, premium. Never sci-fi, never "AI-generated-looking."** Think Apple product page × Linear × a serious robotics company.

Use the **attached files**: the logo SVGs (use them directly, don't redraw), the **content PDF** (this is the real, approved copy — use its words; do not invent your own), and any attached drone/robot imagery.

## Brand system (use exactly)

**Colour**
- Navy ink `#102B4E` (headings + body on light), Night `#060E1C` and Deep Navy `#0B1B33` (dark sections, footer, cards on dark), Cloud `#F3F6FB` (light section bg), White `#FFFFFF`.
- Ribbon spectrum (accents only): Cyan `#00CDD9`, Sky `#009CF4`, Electric Blue `#245FFF`, Light Blue `#3BA7FF`, Indigo `#284BDE`, Violet `#9471FF`.
- **Flight gradient:** `linear-gradient(100deg,#00CDD9 0%,#009CF4 32%,#245FFF 70%,#9471FF 100%)`. Use it sparingly — one or two highlighted words per screen, thin lines, progress bars, the primary button's hover. Never a full-page background.
- Ratio ≈ 60% navy/Night, 30% Cloud/White, 10% ribbon colour. Support: Slate `#5A6B85` secondary text, Mist `#E3EAF4` dividers on light.

**Type (free Google Fonts)**
- Headlines: **Sora** 500/600, tight tracking (−0.04em) at large sizes. Thin, large, confident.
- Body: **Inter** 400/500, 16–19px, line-height 1.55.
- Labels / specs / eyebrows: **JetBrains Mono** 500, UPPERCASE, +0.14em tracking, 11–12px, shown as `[ MAX RANGE ]`.
- Highlight exactly one key word per headline in the Flight gradient.

**Shapes/UI:** 14px radius on cards, pill (999px) buttons. Primary button = solid white on dark / navy on light, fills with the Flight gradient on hover. Secondary = 1px outline pill. 1px dividers (white @12% on dark, Mist on light). A short Flight-gradient line marks each section eyebrow. Use the logo's ribbon icon once per page as a very-low-opacity watermark.

## The scroll story (structure)

One page that **opens light (drones/sky), darkens through the middle (robotics stage), and returns to light (platform)** — giving the drone and robotics halves distinct looks. Smooth inertial scrolling throughout (use a Lenis-style smooth scroll). Pin key sections and drive their animation off scroll progress. Honour `prefers-reduced-motion` with calm fallbacks.

Beats, mapped to the PDF content:

1. **Hero** — a drone hovers in front of a huge faded **NORTHSTAR** wordmark watermark. Headline from the PDF ("Intelligence That Moves Beyond the Screen." / "Physical AI for the Real World."), subline, and two buttons: *Explore Our Platform*, *Talk to Our Team*. Mono eyebrow. The drone gently loops until the user scrolls.
2. **Vision** — "The Physical World Is Ready for Intelligence." (PDF §02). Big thin type, generous space.
3. **Autonomous systems** (PDF §03) — the four capabilities as a scroll sequence or elegant cards: **Autonomous Drones, Quadruped Robotics, Humanoid Robotics, Industrial IoT & Edge Intelligence**, each with its capability tags from the PDF as mono chips.
4. **Take-off → Scan** — as you scroll, the drone climbs/banks; a **LiDAR sweep + labelled tracking boxes (HUD drawn in code)** pass over a site. Spec strip (only real numbers; if none, omit — never invent).
5. **Handoff, light → dark** — the page darkens: "Some places a drone can't reach."
6. **The robot (dark stage)** — a quadruped/humanoid on a dark stage (Deep Navy/Night) with blue accent light, revealed as you scroll; specs count up beside it. Humanoid + quadruped content from PDF §03.
7. **The Platform** (PDF §04) — back toward light: "One Intelligence Platform. Every Physical System." The six platform pillars (Mission Orchestration, Multimodal Perception, Agentic Reasoning, QA & Verification, Digital Twin, Enterprise Integration). "Perceive. Reason. Orchestrate. Verify." as a mono rhythm line.
8. **How Northstar works** (PDF §05) — the 6-step loop Plan → Deploy → Capture → Understand → Verify → Act & Learn, as numbered steps with small looping motion.
9. **Featured solution: Construction Intelligence** (PDF §06) — "Every Site. Every Stage. Verified." with its sub-capabilities.
10. **Industries** (PDF §07) — tabs/cards: Industrial & Manufacturing, Energy & Utilities, Oil Gas & Process, Infrastructure & Civil, Warehouses & Logistics.
11. **Why Northstar** (PDF §08) — the six differentiators.
12. **About** (PDF §09) — "Engineering the Future of Physical AI.", mission + vision.
13. **Final CTA** (PDF §10) — "The Future of Intelligence Is Physical." with *Explore Northstar* / *Partner With Us*.
14. **Footer** — logo (white version on dark), nav (Platform · Technology · Solutions · Industries · About · Contact), "© Northstar — A HuntGlobal Venture.", tagline "Intelligence Beyond the Digital World."

Header: compact logo left, nav centre/right, a **Book a demo / Talk to Our Team** button always visible (sticky, condenses on scroll).

## Interaction signatures (what makes it feel premium)

- Smooth scroll + scroll-pinned sections; motion is **slow and inertial**, not bouncy.
- **HUD overlays in code** over any footage/imagery: thin cyan corner brackets, scan lines, labelled tracking boxes, mono data tags. These sit *on top*, never baked into images.
- Headline reveals masked to scroll (word/line by line). Mono eyebrows fade+rise. Count-up numbers for specs (real values only).
- A small star/ribbon mark as the **scroll-progress indicator** (a nod to "Northstar").
- Subtle film grain + vignette on dark sections only.

## Imagery rules

- Use attached drone/robot media where provided. **Where imagery is missing, use a tasteful placeholder** — a clean silhouette or a gradient "scan" panel with HUD framing and a small `[ VISUAL PLACEHOLDER ]` mono tag — never a cheap clip-art drone or a fake photo. Keep placeholders obviously intentional and on-brand.
- Cool "blue-hour" grade: desaturated, steel-blue shadows, clean white highlights.

## Hard rules (do not break)

- **Use the PDF's words.** Do not write marketing copy of your own or change approved headlines.
- **No invented numbers, specs, customers, testimonials or logos.** Any mock dashboard/UI must be labelled "Illustrative" or "Sample data."
- No real third-party brand marks on hardware (no DJI/Unitree/etc.). No AI-generated people presented as staff or customers.
- Never mention investors, "Biltflow," or any client names.
- Avoid the words "revolutionary", "cutting-edge", "next-gen". Plain, specific, calm voice.

## Technical

- One responsive page, mobile-first and excellent on phones (lighter motion, stills where heavy). Fast first paint. Semantic HTML, accessible: visible focus rings, ≥44px tap targets, labelled controls, AA contrast on every colour pair actually used. Smooth 60fps scroll — do not stack two competing scroll engines.
- Self-contained and clean; comment the section structure so it's easy to hand to developers.

Deliver a polished, production-feeling first version I can scroll end to end.
