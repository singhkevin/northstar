# /v3 build notes: study of drone.riotters.com, rebuilt for Northstar

Written 5 Nov 2026. The reference was loaded in headless Chromium and measured with `getComputedStyle` (raw values below are `[SRC]`).
**Nothing was copied:** no code, 3D models, Rive files, video, images, fonts or text. /v3 uses Northstar's founders' copy, logo, palette, footage and stills, and its own code.

## What the reference is [SRC]
Next.js (Turbopack) + three.js r183 + Lenis smooth scroll + Framer Motion + Rive (2D vector animations). Light, editorial, 12-column grid.
Sections and heights at 1440×900: hero 100svh (scroll-driven Rive drone over a giant embossed wordmark) · intro 1090px (word-by-word grey→ink text reveal beside videos) · "Gear" 864px (240px display heading) · stats dial 3510px (sticky 100vh; semicircle dial + 3-column stat strip that steps with scroll) · Solutions 1582px (tabs + video) · Capabilities 6121px (sticky; list / image / big stat steps with scroll) · Software 1565px (three.js terrain GLB with "+" hotspots) · footer 700px.

## Measured system [SRC] → Northstar substitution
| Token | Reference | /v3 |
|---|---|---|
| Page | #FFFFFF / #FDFDFD | #FDFDFE / #FFFFFF |
| Ink | rgb(36,54,63) | Northstar Navy #102B4E |
| Muted (unrevealed words) | rgb(199,204,203) | #C3CCD8 |
| Lines | ink at 24% alpha, 1px | navy at 24% / 14% |
| Display | 240px / 220px, weight 300, −13px (−0.054em) | same scale, Inter 300 (brand face; the reference's Switzer is not used) |
| Headings | 64/72 −2.4px · 32/40 −0.8px · 28/32 −0.8px · 24/32 −0.8px · 20/28 −0.4px, weight 300 | same |
| Body | 16/24 400; small 15/20 −0.4px | same |
| Labels | mono 12/16 +0.3px, uppercase, in [ brackets ] | JetBrains Mono (brand mono) |
| Grid | 12 columns, 116px at 1440, gutter 24px (16 at md, 8 on phones) | same |
| Radius | 24px and full pills | same |
| Easing | 0.5s cubic-bezier(.22,1,.36,1) for movement; 0.3/0.5s cubic-bezier(.4,0,.2,1) for colour | same |

## Northstar mapping
hero (own drone cutout from Northstar footage, code-drawn rotors) → intro (founders' statement + Northstar drone/humanoid/quadruped loops) → Vision → coordination dial (Perceive / Reason / Orchestrate / Verify, approved module text; no invented specs) → Industries (5 approved industries, Northstar stills) → Technology (sticky: drones, quadruped, humanoid, IoT, approved copy) → Platform (procedural survey terrain in code, 3 findings labelled Illustrative, 6 approved modules) → Contact.

## Not included in /v3
How it works, Construction solution, Why Northstar and About copy (all on the main page / `/ref`). No contact form: buttons link to the main page's form.
