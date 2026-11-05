# Prompt: design the Northstar website from scratch

Copy everything below the line into a new session.

---

You're designing the **Northstar** website from scratch in Claude Design. Northstar is a drones, robotics and AI site-intelligence company. It supplies the hardware, runs it as a service on clients' sites, and provides the software platform that turns the data into answers.

## Who you're working with
Kevin Singh, founder of Viral Inbound, is building this site for Northstar's founders. He isn't technical. Use plain English, lead with the outcome, keep status updates short, and don't ask him to run code or paste keys.

## Goal
Design a premium, credible marketing website for Northstar. Use the page structure and clarity of https://www.dronedeploy.com/ as the reference, built with Northstar's own brand, footage and words. The current site is a single scroll-driven film. This is a fresh design, not a patch of that build.

**Deliver first:** a desktop home-page design and a mobile version of it in Claude Design, with every section filled with real content. Once Kevin approves the direction, design the inner pages (the outline is below). Don't build or publish code in this session, and don't touch the live site.

## Source material (GitHub repo `singhkevin/northstar`, branch `claude/clever-hypatia-09p4st`)
Read these before designing anything:

| What | Where | How to use it |
|---|---|---|
| **Approved content (the source of truth)** | `docs/source/NORTHSTAR-founders-copy.pdf` | All headlines, product descriptions, solutions, industries and About text come from here. Keep 100% of it. You may restructure it and tighten layout, but don't drop it or rewrite its meaning |
| Draft copy and section order | `COPY.md`, `PLAN.md` | Earlier draft written to the DroneDeploy-style structure. Use it as a guide only: where it conflicts with the founders' PDF, the PDF wins |
| Brand guidelines | `BRAND-GUIDELINES.md` (visual version: `site-v2/brand/index.html`) | Follow exactly: colours, fonts, logo rules, imagery grade |
| Logos | `site-v2/brand/*.svg` | Flight Ribbon logo: primary, white, compact, icon and monochrome |
| Hero film and loops | `site-v2/media/` (`film-*`, `hero-loop-*`, `vision-*`, `bg-*.mp4`, plus `.jpg` posters) | Photoreal footage of the drone, humanoid, quadruped, site and plant room, graded to the brand's blue-hour look |
| Stills | `site-v2/media/s-*.jpg`, `poster-*.jpg`, `og-*.jpg` | Product and site photography |
| Fleet and industry images | `site-v2/v3/media/` (`fleet-*.jpg`, `ind-*.jpg`, `drone-body*.png`) | Product cards (drone, humanoid, quadruped, IoT) and industry tiles (energy, infrastructure, logistics, manufacturing, oil & gas) |
| Sample report | `site-v2/media/northstar-sample-report.pdf` | Use it for a "See a sample report" moment, labelled Sample |
| Existing pages to learn from (not to copy) | Live main page https://northstar.viralinbound.in/, the older conventional page at `/ref`, and the test pages `site-v2/v2/` and `site-v2/v3/` | `/v3` (light editorial layout) is closest to this direction |
| Rules and history | `HANDOVER.md`, `docs/briefs/` | Read the rules. Also read the conflict note below |

If you can't reach the repo, ask Kevin to attach the founders' PDF, the brand guidelines, the logo SVGs, and the images from the folders above. Don't design from memory.

## How to use DroneDeploy (structure only)
Borrow **how it's organised**:
- A clear header with a "Book a demo" button, repeated in the footer
- A hero that states the outcome in one line, with footage behind it
- One platform with clear outcomes (DroneDeploy uses Progress, Quality and Safety; Northstar's outcomes come from the founders' copy)
- A "how it works" sequence: capture → process → act
- Solutions and industries grids, a hardware or fleet section, and a final call to action

**Never copy** DroneDeploy's wording, statistics (such as "3 million sites"), customer logos, quotes, images or layouts pixel for pixel. Every word on the page is Northstar's own.

## Suggested home page (adjust it to fit the founders' copy)
1. Header: compact white logo, navigation (Platform, Solutions, Industries, Fleet, About) and a "Book a demo" button
2. Hero: hero loop video, one-line outcome headline with a single word in the Flight gradient, a subline, two buttons
3. What Northstar does: hardware, service and platform, in three short columns
4. The fleet: drone, humanoid and quadruped (plus IoT if the copy covers it), each with a still, capabilities and "learn more"
5. One platform: an illustrative dashboard panel, labelled Illustrative, with outcome tabs
6. How it works: three or four steps
7. Solutions, then Industries (image tiles)
8. Vision or About: the brand story from the founders' copy
9. Final call to action, then the footer

Inner pages to outline later: Platform, one page per robot, Solutions, Industries, About, Contact.

## Brand essentials (full detail in `BRAND-GUIDELINES.md`)
- **Colours:** Navy `#102B4E`, Night `#060E1C`, Deep Navy `#0B1B33`, Cloud `#F3F6FB`, White, Slate `#5A6B85`, Mist `#E3EAF4`. Flight gradient `linear-gradient(100deg, #00CDD9, #009CF4 32%, #245FFF 70%, #9471FF)`, used sparingly: one word per headline, thin lines and hover states. Rough ratio: 60% navy or Night, 30% light, 10% ribbon colours.
- **Fonts:** Sora for headlines, Inter for body text, JetBrains Mono for uppercase labels and data.
- **Shapes:** 14 px card corners, pill-shaped buttons, thin cyan HUD brackets over footage.
- **Mood:** a clear dawn sky over a working site. Technical, quiet and confident, never sci-fi.

## Rules that always apply
- **No invented facts:** no made-up specs, numbers, customers, logos or testimonials. Where a real figure is missing, show the capability in words or leave a clearly marked placeholder.
- Any mock interface is labelled **Illustrative** or **Sample data**. No AI-generated people presented as staff or customers. No real brand logos on hardware.
- Never mention **Biltflow** or **investors**. Never name Viral Inbound's clients.
- **No paid generation** (Higgsfield or any other) without quoting the price and getting Kevin's clear yes. Use the existing footage first.
- The site stays hidden from search engines (noindex) until Kevin says otherwise.
- Never put keys or passwords in chat or in files.

## Conflict to raise with Kevin before you start
Ashutosh's 4 Nov brief (`docs/briefs/2026-11-04-ashutosh-mandatory-corrections-brief.txt`) explicitly says **not** to turn the site into a cinematic intro followed by conventional sections. A DroneDeploy-style layout is exactly that. Tell Kevin about this in one or two plain sentences and ask whether this new direction replaces that brief, or is an alternative to show the client side by side. The rule "keep 100% of the approved content" applies either way.

## First reply
Say what you've read and anything you couldn't access, raise the conflict above, and propose the home-page section list mapped to the founders' copy. Then design the desktop home page once Kevin says go.
