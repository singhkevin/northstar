# Northstar website: handover for the Claude cloud session

Written 5 Nov 2026. Repo: https://github.com/singhkevin/northstar (private, branch `main`).
Live site: https://northstar.viralinbound.in/ (older main page at /ref). Hidden from Google on purpose: Kevin said keep it hidden.

## Start here

**The next job is Ashutosh's 4 Nov brief, which has not been started:** `docs/briefs/2026-11-04-ashutosh-mandatory-corrections-brief.txt`.
It reverses a decision in the current build (see "Conflict" below). Read it in full before changing anything. Its own order of work begins with audits, and those cost nothing.

First reply to Kevin: confirm what you've read, say what the cloud session can and can't do from the "Access" section, and start Step 1.

## Who you're working with

- **Kevin Singh, Viral Inbound.** Non-technical founder. Use plain English, define jargon, run everything yourself, give short status lines, and lead with the outcome. Don't ask him to paste or run code.
- **Ashutosh** (projects@viralinbound.com) writes the briefs on Kevin's side. Northstar's founders supply the copy.

## Rules that always apply

- **Paid generation:** quote the price and get Kevin's clear yes first. Log every paid run in `SPEND.md` as it happens, because it's reimbursed by the client.
- **Email:** never send without Kevin's explicit yes for that email. Drafts are fine.
- **Keys:** never put a key in chat or in the repo. Never enter passwords or card details.
- **Main address:** Kevin said there are no more versions, so work goes straight to the main page. Don't create /v5. Say what you'll publish before a large change, and keep the last good deploy available to roll back.
- **Never mention on the site:** Biltflow or investors. Never name Viral Inbound's clients outward.
- **Content honesty:** no invented specs, numbers, customers or testimonials. Mock interface stays labelled Illustrative or Sample. No AI people as staff or customers.
- **Reporting:** a visual change isn't proof. Test the behaviour, and say what was not tested.

## Current state

| Item | State |
|---|---|
| Main page | Scroll film, 65.5 s, one pinned stage, three stops (drone, humanoid, quadruped), then scan, Site View, Vision, Contact |
| /ref | The older founders'-copy page with conventional sections |
| /v1 to /v4 | Temporary redirect to the main address; files kept in `archive/site-versions-2026-11-04/` |
| Contact form | Validates but can't send: no inbox has been supplied |
| Legal links | No Privacy or Terms pages exist; don't invent legal text |
| Report to Ashutosh on the 3 Nov pass | Gmail draft on thread 1a19c26e362b2a87 appeared unsent when last checked. It's out of date: it calls /v4 a preview, and the 4 Nov brief supersedes it. Don't send it as is |
| Spend so far | $25.38 logged, $20.40 on the Northstar Higgsfield account. Remaining balance is an estimate, about $44.60 from a $65 start; confirm it before quoting |

Last checks on the live main page (4 Nov), Chrome on Kevin's Mac with phones and tablets simulated: 130 of 130 control checks passed, and scrolling matched both ways at 71 positions. Those were scripted checks, and **they did not reproduce the scroll lag Ashutosh reports**. Don't treat them as disproving it. Safari, iPhones and real devices have never been tested.

## Conflict you must raise with Kevin

The 3 Nov brief spoke of three product panels, so the build cut each product to one stop and removed copy. The 4 Nov brief says **100% of approved content must be kept, with multiple reveal states per product** and at least two for the quadruped. Also, the page no longer has Solutions, Industries, About or most specs.

The headlines dropped on 3 Nov were "Intelligence from above.", "Supervised inspection, hands on." and "Repeatable inspection missions." The last two were written by Claude to fit panels and were never approved, so they aren't approved content to restore. Check them against the inventory.

## Likely causes to check first (unverified leads, not findings)

Scroll lag (brief section 5):
- `frame()` in `tools/v4_engine.js` seeks `film.currentTime` from requestAnimationFrame, on a single 23 MB film with a keyframe every 24 frames, so seeks can decode many frames.
- Stops add a time-based wobble (`Math.sin(tms / 1500)`) that keeps seeking even when the visitor isn't scrolling. Claude added it on 3 Nov so the footage stays alive. It may add load, and it plays footage backwards.
- Lenis smoothing plus the page's own `S.cur` easing stack up on top of ScrollTrigger.
- `backdrop-filter` on panels and chips; `cloudDraw` canvas during scan.
- `getBoundingClientRect` and `getComputedStyle` calls inside drawing code.

Footage (sections 2 to 4):
- Entrance: clips `c04` and `c05`. The exterior is a roller shutter; key frame `k05a` has a dark steel frame at both picture edges, which is probably the "left and right doors" he describes. Heavy dust around the entrance comes from `k04b`.
- Propellers: stops scrub a hover clip by scroll, so rotors only animate while time moves. A separately playing hover loop is what he asks for.
- Exits and turns: `c03`, `c04`, `c08`, `c13b` were reviewed only on still frame sheets. Watch them in motion. `c11` has a quick turn from side-on to front-on.
- Corridor: `c09` and `c10`.

Others:
- Ghosted platform (11F): probably `#visplat`, the copy of Site View shown in Vision shot 5. He may want a cleaner treatment; check against his wording.
- Blank Flagged panel (11E): `.issue` rows start hidden until `appTl` runs.
- Rail against footer (11G): overlap seen at 1280 x 720 during the contact scroll.
- Contact background: `media/bg-corridor-*` is the plant room, and he wants a distinct environment.

## Where things are

| Path | What it is |
|---|---|
| `site-v2/` | The published site. **Since 13 Nov the home page is the hand-written /v6 design; see README.md.** The film page described below now lives at `site-v2/archive/v1/` |
| `site-v2/vercel.json` | Noindex header, media caching, old-version redirects |
| `tools/v4_engine.js`, `tools/v4.css`, `tools/v4_form.js` | Edit these. `SEG` in the engine is the timeline and the source of truth for timings |
| `tools/build_v4.py` | Retired: it built the old film home page and would overwrite the current one |
| `tools/v4_source.html` | The older page the build takes its loader, Site View and form from. Same as the old root |
| `site-v2/ref/index.html`, `COPY.md`, `docs/source/NORTHSTAR-founders-copy.pdf` | Starting points for the content inventory, with `tools/v4_source.html` |
| `archive/site-versions-2026-11-04/` | Older versions, which may hold more approved copy |
| `assets/v5/kf`, `assets/v5/out` | Key frames and raw clips. Chosen: k01c k02a k03a k04b k05a k06a k07a k08a k09a k10a k11d, v00a v01b v02a v03a v04a; clips c01-c12, c13b, v01, v02b, v03, v04 |
| `tools/jobs-v5-*.json` | The exact generation prompts and models |
| `tools/hf.mjs` | Runs generation jobs. Hard-coded Mac paths, see below |
| `FOOTAGE-V5-PLAN.md`, `STORYBOARD-V4.md` | How the current film was planned. The storyboard's scene map describes an earlier six-stop build |
| `tools/qa/` | Test scripts: `qa5.mjs` controls, `dir5.mjs` forward and back, `human.mjs` simulated visitors, `over5.mjs` panel overlap, `journey.sh` + `shot4.mjs` screenshot sheets. `dir5` and `human` may need updating as stops change |
| `docs/briefs/` | Ashutosh's 3 Nov and 4 Nov briefs |
| `docs/context/` | Claude's running notes on this project, written on Kevin's Mac. They reflect what was true then, so check before relying on them |

## Film timeline now (film seconds)

Clips are 5.04 s each and chained: the last frame of one is the first of the next.
`c01` wide, drone arrives 0-5 · `c02` hover 5-10 · `c03`-`c04` to building 10-20 · `c05` through entrance 20-25 · `c06` humanoid walks, stops 25-30 · `c07` stands 30-35 · `c08` walks away 35-40 · `c09`-`c10` passage to hall 40-50 · `c11` quadruped walks, stops 50-55 · `c12` stands 55-60 · `c13b` departs 60-65.5. Vision film is separate, 20 s.

Stitch recipe: normalise each clip to 1600x900 at 24 fps, join with ffmpeg concat, encode with `-crf 23 -g 24 -movflags +faststart`, then make the 960 wide version at `-crf 25`. New filenames should get a new letter, because `/media/` is cached for a year as immutable.

## Access: what the cloud session won't have

Claude Code cloud sessions don't get Kevin's Mac, so check each of these rather than assuming:

- **Higgsfield:** `.env.local` is deliberately not in the repo. Kevin must add `HF_CREDENTIALS` as a secret in the cloud environment, never in chat. `tools/hf.mjs` also has hard-coded `/Users/kevinsingh/...` paths and imports the client from `Projects/higgsfield-seedance`, which isn't in this repo, so it needs changing to run.
- **Publishing:** the site publishes by Vercel CLI from `site-v2/`, not by a GitHub push: `npx vercel deploy --prod --yes --scope viral-inbound`. It needs a Vercel token from Kevin. `.vercel/` isn't committed, so link to project `northstar`, team `viral-inbound`. If this isn't possible, Kevin can publish from his Mac after pulling. After a deploy, the address can lag about a minute.
- **Rollback:** a Vercel rollback to the earlier deployment works without files.
- **Testing:** the `tools/qa` scripts point at Mac Chrome, so change `executablePath`. They need `puppeteer-core` installed, plus Pillow for sheets. Headless browsers don't prove real-world smoothness: Kevin's real Chrome, Safari and a real phone still matter, especially for the lag.
- **Measuring subjects:** `tools/cut` is a Mac-only binary (Apple Vision cutout). In the cloud, measure by another method or do it on the Mac.
- **Email:** check the Gmail connector is available in the cloud session. Thread IDs: 3 Nov 1a19c26e362b2a87, 4 Nov 1a1a501929f5fdd7.
- **ffmpeg and git:** the repo is about 590 MB. Check that ffmpeg and Python are installed. On the Mac, this ffmpeg has no `drawtext` filter.

Kevin's Mac stays the only other copy. If work happens in the cloud, Kevin must pull `main` on the Mac before working or publishing from there.

## Open questions for Kevin or Ashutosh

1. Which inbox should the contact form send to?
2. Who supplies Privacy and Terms text, and do real product specs exist? The brief requires specs to be preserved but forbids inventing them, and earlier notes record that no hardware models were chosen and no spec figures were supplied.
3. The content audit needs an agreed "original approved content". Likely `docs/source/NORTHSTAR-founders-copy.pdf` (the founders' copy) plus the /ref page. Confirm once the inventory is drafted.
4. Approve the new Vision paragraph, which was stitched from approved lines.
5. New footage will need a fresh quote and Kevin's yes. $13 was the cap for the last pass and doesn't carry over.
