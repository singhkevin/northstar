# Northstar website

Marketing site for Northstar (Physical AI). It's a static site with no framework and no build step to serve it. Everything that gets published is in `site-v2/`.

- **Live:** https://northstar.viralinbound.in (Vercel project `northstar`, team `viral-inbound`)
- **Working branch:** `claude/clever-hypatia-09p4st` (draft PR #1)

## Get it running locally

```bash
git clone https://github.com/singhkevin/northstar.git
cd northstar
git checkout claude/clever-hypatia-09p4st
npx http-server site-v2 -p 8080 -c-1
```

Then open http://localhost:8080.

Serve it from the `site-v2` folder as the web root, because the inner pages use root paths like `/media/...`. Opening `index.html` straight from disk won't work.

The repo is large (about 600 MB of footage and source files). A shallow clone is enough for site work: `git clone --depth 1 -b claude/clever-hypatia-09p4st https://github.com/singhkevin/northstar.git`.

## Pages

| URL | File | What it is |
|---|---|---|
| `/` | `site-v2/index.html` | **Home page, the source of truth.** Hand-written; edit it directly |
| `/platform/` | `site-v2/platform/index.html` | Generated from the home page |
| `/technology/` | `site-v2/technology/index.html` | Generated |
| `/solutions/` | `site-v2/solutions/index.html` | Generated (construction) |
| `/industries/` | `site-v2/industries/index.html` | Generated |
| `/about/` | `site-v2/about/index.html` | Generated |
| `/contact/` | `site-v2/contact/index.html` | Generated |

This is the only version of the site in this repo. Old addresses (`/v1/` to `/v6/`, `/archive/`) redirect to `/` (see `site-v2/vercel.json`).

### Editing the inner pages

Each inner page is a page head plus a chosen set of sections copied from the home page. **Don't hand-edit the generated pages.** Edit `site-v2/index.html`, or the page list in `tools/build_pages.py` (titles, intro lines, which sections each page shows), then run:

```bash
python3 tools/build_pages.py
```

Commit the home page and the regenerated pages together.

## What's in `site-v2/`

| Path | What it is |
|---|---|
| `index.html` | Home page: styles, markup and the main script are all inline |
| `drone.js` | 3D drone that flies between sections of the home page (three.js, minified bundle). Home page only |
| `terrain.js` | 3D terrain in the Platform section (three.js, minified bundle). Home and `/platform/` |
| `vendor/` | GSAP, ScrollTrigger and Lenis (smooth scroll), self-hosted |
| `media/` | Images, video loops (`*-s.mp4` are the phone versions) and `drone.glb` |
| `brand/` | Northstar logo files (SVG) |
| `vercel.json` | Noindex header, one-year cache on `/media/`, old-version redirects |

**Media caching:** `/media/` is served as immutable for a year. To replace a file, give it a new name rather than overwriting it.

**Copy:** all text is the founders' approved copy (`COPY.md`, `docs/source/`). Don't add claims, numbers, client names or testimonials. Mock data on the page is labelled "Illustrative".

### The two 3D bundles

`drone.js` and `terrain.js` are compiled, minified bundles (three.js). Their sources are not in the current tree, so edit them with care and test the home page afterwards. Earlier sources are in git history (`git log --all -- tools/v3_drone.js`).

## Publishing

The site is published with the Vercel CLI from `site-v2/`, not by pushing to GitHub. It needs a Vercel token with access to team `viral-inbound`.

```bash
cd site-v2
npx vercel link --yes --project northstar --scope viral-inbound   # first time only; .vercel/ is not committed
npx vercel deploy --yes --scope viral-inbound                     # preview (behind Vercel login)
npx vercel deploy --prod --yes --scope viral-inbound              # live site: only with Kevin's go-ahead
```

To roll back, use Vercel's rollback to an earlier deployment in the dashboard (`vercel rollback`).

## Other folders

| Path | What it is |
|---|---|
| `tools/build_pages.py` | Builds the inner pages from the home page |
| `tools/hf.mjs`, `tools/jobs-*.json`, `SPEND.md` | AI footage generation (Higgsfield) and its spend log. Paid: only with Kevin's approval |
| `assets/` | Source footage and key frames (not served) |
| `docs/briefs/`, `docs/source/` | Briefs and the founders' approved copy |
| `BRAND-GUIDELINES.md`, `COPY.md`, `brand/`, `logo/` | Brand rules, approved copy and logo files |

Keys (`.env`, `.env.local`) are never committed.
