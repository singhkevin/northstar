# 01 · Content-preservation audit and mapping

Step 1 of Ashutosh's 4 Nov brief, section 6. Written 4 Nov 2026 from a cloud session. **Audit only: nothing on the site has been changed.**

## What counts as "original approved content"

| Source | Status | Used here as |
|---|---|---|
| `docs/source/NORTHSTAR-founders-copy.pdf` (the founders' copy, 10 sections + footer) | Written by Northstar's founders | **The baseline.** Every item below comes from it |
| `/ref` page (`site-v2/ref/index.html`, same as `tools/v4_source.html`) | The earlier build of the founders' copy | Cross-check. It holds 100% of the founders' copy (the Industries tab texts render on click) |
| `COPY.md` ("draft 1", 28 Oct) | Written by Claude before the founders' copy arrived | **Not approved.** Excluded |
| `archive/site-versions-2026-11-04/` (v1 to v4) | Earlier builds | Checked for extra copy or specs. None found beyond the founders' copy |

**Needs confirming (question for Ashutosh):** that the founders' copy PDF is the "original approved content" he means. If there is a later approved document, for example one with specifications, this audit must be re-run against it.

## Headline numbers

Measured by script: the founders' copy was split into 177 sentences and list items (1,494 words), and each one was checked for an exact match in the text of each page, hidden panels included.

| Page | Items present verbatim | Words present | Share |
|---|---|---|---|
| Current main page (northstar.viralinbound.in, repo copy `site-v2/index.html`) | 41 of 177 | 190 of 1,494 | **13%** |
| /ref page | 177 of 177 | 1,494 of 1,494 | 100% |

So the current main page has lost about **87% of the approved copy**. Whole sections are gone: Introduction, Technology intro, Industrial IoT, Platform modules, How it works, Construction solution, Industries, Why Northstar and About.

### Things the brief asks to preserve that **do not exist** in any approved source

These can't be "restored", and per Kevin's rule they must not be invented. They need supplying:

1. **Technical specifications** for drone, humanoid and quadruped. The founders' copy has no figures (flight time, payload, sensors by model, speed, IP rating and so on), and no hardware models have been chosen. The brief's six-stop drone example ("additional technical specifications") can't be filled without them.
2. **Contact details** (email, phone, address) and the **inbox the form sends to.**
3. **Legal information** (Privacy, Terms, company registration line). Only "© Northstar - A HuntGlobal Venture. All rights reserved." exists.
4. Any **real platform data**. The Site View uses illustrative sample data, and that is labelled on the page.

## Proposed cinematic structure (used in the last two columns)

Follows the brief's journey: Brand → Drone → Humanoid → Quadruped → Platform → Solutions & Industries → Vision → Contact. Panel codes are **proposals for approval**, not built yet.

| Code | Chapter · reveal state | Shown on |
|---|---|---|
| B1 | Brand · hero words | Logo animation hands over to the wide opening shot |
| B2 | Brand · statement overlay | Wide opening shot, before the drone arrives |
| B3 | Brand · "Intelligence in every dimension" ecosystem panel | End of wide opening shot |
| D1 / D2 / D3 | Drone stops: introduction & purpose / workflows & capabilities / applications | Three drone hovers (needs a longer hover; see the video audit) |
| D-spec | Drone · expandable spec overlay | **Reserved. Empty until specs are supplied** |
| H1 / H2 | Humanoid stops: introduction / workflows & approach (expandable) + focus areas | Two humanoid stops |
| H-spec | Humanoid spec overlay | Reserved |
| Q1 / Q2 | Quadruped stops: primary inspection capabilities / applications & capabilities | Two quadruped stops (brief §8 minimum) |
| Q-spec | Quadruped spec overlay | Reserved |
| S1 | Scan · "Intelligence from every connected asset" (IoT & edge) panel | Scan line passing over the plant room |
| P1 | Platform · header | Platform rises out of the scan |
| P2 | Platform · coordination layer strip | Platform header area |
| P3 | Platform · Modules (6), expandable inside the interface | New "Modules" view in the Site View |
| P4 | Platform · How it works (6 steps) overlay | Step strip over the interface |
| P5 | Platform · Why Northstar (6), expandable | "Why Northstar" overlay |
| SI1 / SI2 | Solutions · Construction intelligence header / 7 solution capabilities (expandable) | Linked to the Riverside Tower sample site |
| SI3 | Industries · 5 industries panel (tabs) | Linked to the sample sites; transition out of the Platform |
| V1 | Vision · one headline + one paragraph | Vision ecosystem film |
| V2 | Vision · secondary overlay: "The Northstar vision" + About, Mission, Vision | Vision film, final wide |
| C1 / C2 / C3 / C4 | Contact: left text / buttons / form / compact footer | Closing environment |

## Content mapping (every item in the founders' copy)

Key: **Kept** = verbatim on the current page · **Changed** = present but altered · **Missing** = not on the current page.

### Navigation and 01 Hero

| # | Original approved content | Current implementation | Missing information | Reduced or modified | Cinematic chapter | Exact panel / overlay |
|---|---|---|---|---|---|---|
| 1 | Eyebrow "Physical AI \| Autonomous Robotics \| Industrial Intelligence" | Kept, hero | – | – | Brand | B1 |
| 2 | Nav: Platform \| Technology \| Solutions \| Industries \| About Us \| Contact | Changed: nav is Drone · Humanoid · Quadruped · Platform · Vision · Contact | Technology, Solutions, Industries, About Us links | Labels replaced by chapter names | All | Header nav + chapter rail, with each original label jumping to its chapter (question: keep original labels?) |
| 3 | "Intelligence That Moves Beyond the Screen." | Kept | – | – | Brand | B1 |
| 4 | "Physical AI for the Real World." | Kept | – | – | Brand | B1 |
| 5 | "We bring intelligence into the physical world through autonomous drones, quadruped robots, humanoid robotics, and connected industrial systems." | Changed: only a reworded fragment appears in Vision ("We bring intelligence into the physical world.") | Full sentence | Shortened, moved to Vision | Brand | B2 |
| 6 | "Powered by our agentic AI platform, Northstar transforms how enterprises observe, inspect, verify, and understand their physical environments — connecting autonomous machines with intelligent decision-making to make industrial operations safer, smarter, and more predictable." | Changed: a stitched rewrite in the Vision paragraph | Original sentence | Rewritten (Vision paragraph is not approved; HANDOVER question 4) | Brand | B2 |
| 7 | Buttons [Explore Our Platform] [Talk to Our Team] | Kept | – | – | Brand | B1 |
| 8 | "Autonomous Inspection. Continuous Intelligence. Verified Reality." | Changed: "Autonomous inspection." is used as the **drone headline** | "Continuous Intelligence. Verified Reality." | Fragment repurposed | Brand | B2 (closing line) |

### 02 Introduction: The Northstar Vision

| # | Original approved content | Current implementation | Missing | Reduced / modified | Chapter | Panel |
|---|---|---|---|---|---|---|
| 9 | "The Physical World Is Ready for Intelligence." | Missing | All | – | Vision | V2 |
| 10 | "For decades, enterprise technology has focused on digitizing information. The next frontier is enabling intelligence to interact with the physical world." | Missing | All | – | Vision | V2 |
| 11 | "Northstar is building the intelligence layer between AI and the real world." | Missing | All | – | Vision | V2 |
| 12 | "By combining embodied AI, autonomous robotics, computer vision, spatial intelligence, and IoT, we enable machines to capture real-world conditions, understand complex environments, and execute coordinated inspection and verification workflows." | Missing | All | – | Vision | V2 |
| 13 | "From construction sites and industrial facilities to energy infrastructure and critical assets, our vision is to turn physical operations into continuously observable, verifiable, and increasingly autonomous systems." | Missing | All | – | Vision | V2 |
| 14 | "We don't just capture the physical world. We enable AI to understand it." | Missing | All | – | Vision | V1 candidate headline, else V2 |

### 03 Our Technology (intro)

| # | Original | Current | Missing | Reduced / modified | Chapter | Panel |
|---|---|---|---|---|---|---|
| 15 | "Intelligence in Every Dimension." | Missing | All | – | Brand | B3 |
| 16 | "A connected ecosystem of intelligent machines." | Missing | All | – | Brand | B3 |
| 17 | "Northstar brings aerial robotics, ground robotics, humanoid systems, and distributed sensors together through one intelligent orchestration platform." | Missing | All | – | Brand | B3 |

### Autonomous Drones

| # | Original | Current | Missing | Reduced / modified | Chapter | Panel |
|---|---|---|---|---|---|---|
| 18 | Label "Autonomous Drones" | Changed: "Aerial · Autonomous drone" | – | Reworded eyebrow | Drone | D1 |
| 19 | "Intelligence from Above." | **Missing** (headline replaced by "Autonomous inspection.") | Headline | Replaced | Drone | D1 |
| 20 | "Capture, map, monitor, and inspect complex environments from the air." | Missing | All | – | Drone | D1 |
| 21 | "Our drone-enabled workflows support aerial surveying, photogrammetry, LiDAR scanning, thermal imaging, infrastructure inspection, volumetric analysis, and construction progress monitoring." | Kept, drone panel | – | – | Drone | D2 |
| 22 | "From large construction developments to remote industrial infrastructure, aerial intelligence helps teams understand changing site conditions without relying exclusively on manual inspections." | Missing | All | – | Drone | D3 |
| 23 | Capabilities: Aerial Reality Capture \| Mapping & 3D Reconstruction \| Progress Monitoring \| Thermal Inspection \| Asset Verification | Changed: chips are "Photogrammetry, LiDAR, Thermal imaging, 3D reconstruction" | All 5 approved capability names | Replaced with a different list | Drone | D2 (chips) |
| 24 | Drone technical specifications | **Do not exist in approved content** | Specs | – | Drone | D-spec (reserved) |

### Quadruped Robotics

| # | Original | Current | Missing | Reduced / modified | Chapter | Panel |
|---|---|---|---|---|---|---|
| 25 | "Intelligence on the Ground." | Kept | – | – | Quadruped | Q1 |
| 26 | "Four-legged robotic platforms extend inspection capabilities into complex industrial and construction environments." | Kept | – | – | Quadruped | Q1 |
| 27 | "Equipped with visual cameras, depth sensors, thermal imaging, and spatial navigation capabilities, quadruped robots can support repeatable inspection missions, indoor reality capture, equipment monitoring, and remote site observation." | Missing | All | – | Quadruped | Q1 (primary inspection capabilities) |
| 28 | "They enable consistent data collection across large facilities, plant rooms, corridors, and other challenging operational environments." | Missing | All | – | Quadruped | Q2 |
| 29 | Capabilities: Autonomous Patrols \| Ground Reality Capture \| Thermal Monitoring \| Equipment Inspection \| Remote Observation | Changed: 4 of 5 kept | "Remote Observation" | Shortened | Quadruped | Q2 (chips) |
| 30 | Quadruped specifications | Do not exist | Specs | – | Quadruped | Q-spec (reserved) |

Note: "Repeatable inspection missions." was a Claude-written panel headline on 3 Nov, not approved. It appears in the approved copy only as a phrase inside item 27.

### Humanoid Robotics

| # | Original | Current | Missing | Reduced / modified | Chapter | Panel |
|---|---|---|---|---|---|---|
| 31 | "Intelligence That Works Alongside People." | Kept | – | – | Humanoid | H1 |
| 32 | "Humanoid robotics represents the next evolution of embodied intelligence, bringing AI-assisted perception and manipulation into human-designed environments." | Kept | – | – | Humanoid | H1 |
| 33 | "Northstar is developing workflows for humanoid systems to support supervised visual inspections, equipment interaction, inspection checklist execution, material identification, and physical task assistance." | Missing | All | – | Humanoid | H2 |
| 34 | "Our approach combines visual reasoning, task planning, robotic control, and human oversight to progressively extend the role of autonomous systems in industrial operations." | Missing | All | – | Humanoid | H2 (expandable) |
| 35 | Focus Areas: Embodied AI \| Visual Inspection \| Human-Robot Collaboration \| Task Planning \| Physical Workflow Assistance | Changed: 4 of 5 kept | "Physical Workflow Assistance" | Shortened | Humanoid | H2 (chips) |
| 36 | Humanoid technical details | Do not exist beyond items 32 to 35 | Specs | – | Humanoid | H-spec (reserved) |

Note: "Supervised inspection, hands on." was Claude-written on 3 Nov, not approved.

### Industrial IoT & Edge Intelligence

| # | Original | Current | Missing | Reduced / modified | Chapter | Panel |
|---|---|---|---|---|---|---|
| 37 | Label "Industrial IoT & Edge Intelligence" | Missing | All | – | Scan | S1 |
| 38 | "Intelligence from Every Connected Asset." | Missing | All | – | Scan | S1 |
| 39 | "Not every inspection requires a moving robot." | Missing | All | – | Scan | S1 |
| 40 | "Northstar connects industrial sensors, cameras, edge devices, and operational systems to create a continuous flow of physical-world intelligence." | Missing | All | – | Scan | S1 |
| 41 | "By bringing together machine telemetry, environmental measurements, asset conditions, and robotic observations, we establish a unified operational view of facilities and infrastructure." | Missing | All | – | Scan | S1 (expandable) |
| 42 | Capabilities: Sensor Integration \| Edge AI \| Condition Monitoring \| Anomaly Detection \| Equipment Telemetry | Missing | All | – | Scan | S1 (chips) |

There's no IoT "product" in the film, so S1 is a proposal: show it as the scan passes sensors and equipment in the plant room. Question for Ashutosh.

### 04 The Northstar Platform

| # | Original | Current | Missing | Reduced / modified | Chapter | Panel |
|---|---|---|---|---|---|---|
| 43 | "One Intelligence Platform. Every Physical System." | **Missing** (Platform headline is "From physical observation to intelligent action.", borrowed from section 05) | Headline | Replaced | Platform | P1 |
| 44 | "Meet Northstar Physical AI Platform." | Missing | All | – | Platform | P1 |
| 45 | "An agentic intelligence and robotics orchestration platform designed to connect physical-world observations with autonomous workflows, intelligent analysis, and operational decision-making." | Missing | All | – | Platform | P1 |
| 46 | "Northstar serves as the coordination layer between machines, sensors, enterprise information, and the people responsible for operating physical assets." | Missing | All | – | Platform | P2 |
| 47 | "Perceive. Reason. Orchestrate. Verify." | Missing | All | – | Platform | P2 |
| 48 | Autonomous Mission Orchestration + its 2 sentences | Missing | All | – | Platform | P3 module 1 |
| 49 | Multimodal Perception & Spatial Intelligence + sentence | Missing | All | – | Platform | P3 module 2 |
| 50 | Agentic AI & Intelligent Reasoning + sentence | Missing | All | – | Platform | P3 module 3 |
| 51 | AI-Powered QA & Verification + 2 sentences | Missing | All | – | Platform | P3 module 4 |
| 52 | Digital Twin & Reality Intelligence + sentence | Missing | All | – | Platform | P3 module 5 |
| 53 | Enterprise Integration & Human Oversight + 2 sentences | Missing | All | – | Platform | P3 module 6 |

### 05 How Northstar Works

| # | Original | Current | Missing | Reduced / modified | Chapter | Panel |
|---|---|---|---|---|---|---|
| 54 | "From Physical Observation to Intelligent Action." | Changed: used as the Platform headline | – | Moved | Platform | P4 |
| 55 | "A continuous intelligence loop connecting the real and digital worlds." | Missing | All | – | Platform | P4 |
| 56 to 61 | Steps 01 Plan, 02 Deploy, 03 Capture, 04 Understand, 05 Verify, 06 Act & Learn, each with its sentence | Missing | All 6 | – | Platform | P4 (steps) |
| 62 | "From data capture to evidence-based decisions — connected by intelligence." | Missing | All | – | Platform | P4 |

### 06 Featured Solution: Construction Intelligence

| # | Original | Current | Missing | Reduced / modified | Chapter | Panel |
|---|---|---|---|---|---|---|
| 63 | Label "Featured Solution — Construction Intelligence" | Missing | All | – | Solutions & Industries | SI1 |
| 64 | "Every Site. Every Stage. Verified." | Missing | All | – | Solutions & Industries | SI1 |
| 65 | "AI-powered construction quality assurance and progress intelligence." | Missing | All | – | Solutions & Industries | SI1 |
| 66 | "Construction environments are dynamic, complex, and constantly changing. Traditional inspections are periodic, heavily manual, and often fragmented across teams and systems." | Missing | All | – | Solutions & Industries | SI1 |
| 67 | "Northstar combines aerial reality capture, ground robotics, computer vision, and agentic AI to support more consistent, evidence-driven construction monitoring and quality assurance." | Missing | All | – | Solutions & Industries | SI1 |
| 68 | "Our goal is to provide contractors, developers, engineers, and project owners with a clearer understanding of what has been built, how work is progressing, and where intervention may be required." | Missing | All | – | Solutions & Industries | SI1 (expandable) |
| 69 to 75 | 7 solutions, each with a description: Construction Progress Intelligence; Build-versus-Design Verification; Automated QA/QC Inspections; Safety Observation & Risk Intelligence; Quantity & Work-in-Place Verification; Digital As-Built Documentation; Inspection Evidence & Traceability | Missing (the Site View's sample findings only hint at them) | All 7 | – | Solutions & Industries | SI2 (expandable list, each linked to a sample finding where one fits) |
| 76 | "See what is happening. Understand what has changed. Verify what has been delivered." | Missing | All | – | Solutions & Industries | SI2 |

### 07 Beyond Construction: Industrial Applications

| # | Original | Current | Missing | Reduced / modified | Chapter | Panel |
|---|---|---|---|---|---|---|
| 77 | "Built for Environments Where Precision Matters." | Missing | All | – | Solutions & Industries | SI3 |
| 78 | Industrial Assets & Manufacturing + sentence | Missing (only as a form dropdown option) | Description | – | Solutions & Industries | SI3 tab 1 |
| 79 | Energy & Utilities + sentence | Missing (dropdown only) | Description | – | Solutions & Industries | SI3 tab 2 |
| 80 | Oil, Gas & Process Facilities + sentence | Missing (dropdown only) | Description | – | Solutions & Industries | SI3 tab 3 |
| 81 | Infrastructure & Civil Engineering + sentence | Missing (dropdown only) | Description | – | Solutions & Industries | SI3 tab 4 |
| 82 | Warehouses & Logistics Facilities + sentence | Missing (dropdown only) | Description | – | Solutions & Industries | SI3 tab 5 |

### 08 Why Northstar

| # | Original | Current | Missing | Reduced / modified | Chapter | Panel |
|---|---|---|---|---|---|---|
| 83 | "Beyond Automation. Towards Physical Intelligence." | Missing | All | – | Platform | P5 |
| 84 to 89 | 6 points, each with a sentence: One Platform, Multiple Robotic Systems; Designed for Real-World Complexity; Evidence Before Assumptions; Autonomy with Accountability; From Individual Assets to Enterprise Scale; Intelligence That Connects to Enterprise Workflows | Missing | All 6 | – | Platform | P5 (expandable) |

### 09 About Northstar

| # | Original | Current | Missing | Reduced / modified | Chapter | Panel |
|---|---|---|---|---|---|---|
| 90 | "Engineering the Future of Physical AI." | Missing | All | – | Vision | V1 candidate headline |
| 91 | "Northstar is a physical AI and autonomous systems company focused on connecting machine intelligence with real-world operations." | Missing | All | – | Vision | V1 paragraph candidate |
| 92 | "We are bringing together agentic AI, robotics, computer vision, spatial computing, and industrial connectivity to reimagine how enterprises inspect, verify, and manage physical environments." | Missing | All | – | Vision | V2 |
| 93 | "Our vision is a future where intelligent systems continuously understand the world around them, collaborate with human teams, and help enterprises make better decisions through reliable physical-world evidence." | Missing | All | – | Vision | V2 |
| 94 | Our Mission: "To make physical environments more observable, intelligent, and verifiable through autonomous systems and AI." | Changed: words borrowed into the stitched Vision paragraph | Mission as stated | Rewritten | Vision | V2 |
| 95 | Our Vision: "A world where intelligence moves seamlessly between digital systems and physical reality." | Missing | All | – | Vision | V2 |

### 10 Final CTA and Footer

| # | Original | Current | Missing | Reduced / modified | Chapter | Panel |
|---|---|---|---|---|---|---|
| 96 | "The Future of Intelligence Is Physical." | Kept | – | – | Contact | C1 |
| 97 | "Bring autonomous intelligence into your operations." | Kept | – | – | Contact | C1 |
| 98 | "From construction quality assurance to industrial inspection and intelligent asset monitoring, Northstar is building the next generation of physical AI solutions." | Kept | – | – | Contact | C1 |
| 99 | Buttons [Explore Northstar] [Partner With Us] | Missing | Both | – | Contact | C2 |
| 100 | "Let's build a world where machines don't just operate — they understand." | Kept | – | – | Contact | C1 |
| 101 | Footer wordmark "NORTHSTAR" | Changed: header logo only | Footer wordmark | – | Contact | C4 |
| 102 | "Physical AI. Autonomous Systems. Real-World Intelligence." | Missing | All | – | Contact | C4 |
| 103 | Footer nav: Platform \| Technology \| Construction \| Industries \| About \| Contact | Changed: chapter rail | Original labels | Replaced | Contact | C4 |
| 104 | "© Northstar - A HuntGlobal Venture. All rights reserved." | Kept | – | – | Contact | C4 |
| 105 | "Intelligence Beyond the Digital World." | Kept | – | – | Contact | C4 |
| 106 | Contact details, legal information, working form submission | **Not in approved content.** The form validates but has no inbox | Contact details, legal text, inbox | – | Contact | C1 / C3 / C4 (needs supplying) |

## Text on the current page that is **not** approved copy

To check with Ashutosh (keep, replace or remove):

- Drone headline "Autonomous inspection." and eyebrow "Aerial · Autonomous drone" (items 8, 18, 19).
- Platform intro "One agentic platform connects what the drones, humanoids and quadrupeds observe with the people who act on it. Explore the sample site below." Written by Claude.
- Vision paragraph "Powered by our agentic AI platform, Northstar connects autonomous drones, quadruped robots and humanoid robotics to make physical environments more observable, intelligent, and verifiable." Stitched by Claude from items 6 and 94, awaiting approval (HANDOVER question 4).
- Site View sample data (site names, 4 findings, popup texts, sample report PDF). Illustrative and labelled "Illustrative · sample data". Fine to keep labelled.
- Loader labels ("Pre-flight", "Rotors, GPS lock, Camera, Data link, Clear to fly"). Decorative UI, but still not approved copy.

## How the full content can fit without conventional sections

- **Products:** 2 to 3 reveal states each (D1 to D3, H1 to H2, Q1 to Q2) hold all approved product copy (items 18 to 36). The brief's example of 6 drone stops assumes more drone content than exists. With the approved copy, 3 stops covers it without repeating anything.
- **Platform:** the Site View already exists. Modules (P3), How it works (P4) and Why Northstar (P5) can live as views or overlays *inside* the interface, which the brief allows ("the Platform can contain a more extensive interactive interface").
- **Solutions & Industries:** the 4 sample sites already map onto the copy (Riverside Tower = construction, Solar Field East = energy, Plant Room B = industrial or process, North Depot = logistics). Selecting a site can bring up that solution or industry text as a foreground overlay. Infrastructure & civil engineering has no sample site, so it needs a 5th site or a tab.
- **Vision:** one headline and one paragraph (V1), with the Introduction and About copy in a secondary overlay (V2), as the brief allows.

## Questions this audit raises

1. Is the founders' copy PDF the full "original approved content"? Is there a separate approved document with **product specifications**?
2. Which inbox should the form send to, and who supplies contact details, Privacy and Terms?
3. Should the header nav keep the founders' labels (Platform | Technology | Solutions | Industries | About Us | Contact) or the chapter names?
4. Placement of Industrial IoT (S1 during the scan) and Solutions & Industries (inside the Platform, linked to sample sites): acceptable?
5. Vision headline: "We don't just capture the physical world. We enable AI to understand it." or "Engineering the future of physical AI."?
