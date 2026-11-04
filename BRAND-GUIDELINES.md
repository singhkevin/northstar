# Northstar brand guidelines (v2, 28 Oct 2026)

Built around the final "Flight Ribbon" logo Kevin supplied on 28 Oct (source files in `brand/v2/`).
The visual version of this document lives at `/brand/` on the website (`site-v2/brand/index.html`).
It replaces the earlier amber-on-black look used for site v1.

## 1. The idea
The ribbon is an "N" drawn as a single flight path: it lifts off, folds, and climbs.
The brand borrows three things from it: **motion** (things in flight), **a cool cyan-to-violet light** and **calm, precise navy**.
Northstar should feel like a clear dawn sky over a working site: technical, quiet and confident, never "sci-fi".

## 2. Logo
| File | Use |
|---|---|
| `northstar-flight-ribbon.svg` | Primary lockup with "Robotics & Drones", on white or light backgrounds |
| `northstar-flight-ribbon-white.svg` | Primary lockup on navy, photos and video |
| `northstar-flight-ribbon-compact.svg` / `-compact-white.svg` | Without the descriptor: website header, small spaces |
| `northstar-flight-ribbon-icon.svg` | The ribbon alone: favicon, app icon, social avatar, watermark |
| `northstar-flight-ribbon-monochrome.svg` | One-colour navy: stamps, engraving, fax-quality print |

- **Clear space:** keep empty space around the logo equal to the height of the "n" in the wordmark on all sides.
- **Minimum size:** full lockup 160 px wide on screen (40 mm in print); compact lockup 96 px; icon 16 px.
- **Don't:** recolour the ribbon, put the gradient on the wordmark, stretch or rotate it, add shadows or glows,
  outline it, or place the navy version on dark or busy photos (use the white version).

## 3. Colour
**Core**
| Name | Hex | Use |
|---|---|---|
| Northstar Navy | `#102B4E` | Wordmark, headings on light, primary text on light |
| Night | `#060E1C` | Dark section backgrounds, video frames |
| Deep Navy | `#0B1B33` | Cards on dark, footer |
| Cloud | `#F3F6FB` | Light section backgrounds |
| White | `#FFFFFF` | Cards on light, text on dark |

**Ribbon spectrum** (taken from the logo's gradient stops)
| Name | Hex |
|---|---|
| Cyan | `#00CDD9` |
| Sky | `#009CF4` |
| Electric Blue | `#245FFF` |
| Light Blue | `#3BA7FF` |
| Indigo | `#284BDE` |
| Violet | `#9471FF` |

**Support:** Slate `#5A6B85` (secondary text on light), Mist `#E3EAF4` (lines and dividers on light), Signal Red `#FF4D5E` (alerts only).

**The Flight gradient:** `linear-gradient(100deg, #00CDD9 0%, #009CF4 32%, #245FFF 70%, #9471FF 100%)`.
Use it sparingly, for one or two highlighted words per screen, thin lines, progress bars and the main button's hover state, and never as a full-page background.
**Ratio:** roughly 60% navy or Night, 30% Cloud or White, and 10% ribbon colours.

## 4. Typography (all free Google Fonts)
| Role | Font | Notes |
|---|---|---|
| Headlines | **Sora** 500/600 | Geometric and rounded, echoing the wordmark. Tight tracking (-0.04em) at large sizes |
| Body | **Inter** 400/500 | 16-19 px, line height 1.55 |
| Labels and data | **JetBrains Mono** 500 | Uppercase, +0.14em tracking, 11-12 px, used for HUD tags, eyebrows and specs |
| Descriptor style | Sora 400, uppercase, +0.42em tracking | Mirrors "ROBOTICS & DRONES"; use for short taglines only |

Highlight one key word per headline in the Flight gradient (in place of the italic serif used in v1).

## 5. Imagery and video
- **Grade:** cool "blue hour" (desaturated warm tones, steel-blue shadows, clean white highlights). All v1 footage was re-graded to this look locally, at no cost.
- Real-looking hardware in real places: sites, plant rooms, stairwells and tunnels. No fantasy cities, no glowing holograms.
- **HUD overlays** are drawn in code over footage, never baked in: thin cyan corner brackets, scan lines and labelled tracking boxes.
- No real brand logos on hardware (DJI, Unitree and so on). No AI people presented as staff or customers.
- Any UI with made-up figures is marked "Illustrative" or "Sample data".

## 6. Shapes and UI
- **Corners:** 14 px on cards and 999 px (pill) on buttons. The ribbon is soft, so avoid sharp boxes except for HUD brackets.
- **Primary button:** solid white on dark, or navy on light. On hover it fills with the Flight gradient.
- **Secondary button:** 1 px outline pill.
- **Lines:** 1 px dividers (white at 12% opacity on dark, Mist on light). A short Flight-gradient line marks section eyebrows.
- **Motif:** the ribbon icon at very low opacity as a large watermark, at most once per page.

## 7. Voice
- Plain, specific and calm. Say what the robot or drone actually does ("flags a blocked exit on Level 3"), not how futuristic it is.
- Short headlines with one idea each. Avoid words like "revolutionary", "cutting-edge" and "next-gen".
- No invented numbers, customers, logos or testimonials. Capabilities are fine until the founders share real results.
- Never mention investors on public material, never mention Biltflow, and never name clients without their OK.
