# Performance and audit scripts (4 Nov 2026 audit)

Used for `docs/audits/03-scroll-performance-diagnosis.md`. They run headless Chromium through Playwright on Linux.

- Serve `site-v2/` with a byte-range server on port 8123, for example `npx http-server@14.1.1 site-v2 -p 8123 -c-1`. Python's simple server can't do ranges and distorts video seeking.
- When the CDNs are blocked, install `gsap@3.12.5` and `lenis@1.1.13` from npm and set `NS_LIBS` to that `node_modules` folder. `route.mjs` then serves them in place of the CDN files.
- `prof.mjs <base|nowobble|noblur|nolenis> <desktop|mobile>` runs the scripted journey and prints metrics as JSON.
- `settle.mjs`: how long scroll, timeline and picture keep moving after input stops.
- `checks.mjs`: Platform controls, Flagged panel at first appearance, Vision ghosting, rail vs footer overlap, form validation.
- `bench2.mjs` + `bench.html`: seek speed for three encodings (make `g24.mp4`, `g6.mp4`, `g1.mp4` with ffmpeg first; see the diagnosis doc). Serve them on port 8124.
- `dump.mjs` + `cov.py`: page text dump and the founders'-copy coverage check.
- `tr2.py`: summarises a Chrome trace.

Some scripts contain absolute scratch paths from the cloud session. Adjust them before reuse.
