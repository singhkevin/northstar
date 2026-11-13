#!/usr/bin/env python3
"""Build site-v2/index.html, the live main page (one continuous film), from tools/v4_source.html (the older page it takes its loader, Site View and form from).
Keeps loader, header, Site View and form; replaces the page body with a single pinned stage."""
import re, os, sys
if '--i-know-this-overwrites-home' not in sys.argv:
    sys.exit('build_v4.py is retired (13 Nov 2026): the home page is now the hand-written /v6 design, and this script would overwrite it.\nThe old film page lives at site-v2/archive/v1/. See README.md.')
ROOT = os.path.join(os.path.dirname(__file__), '..', 'site-v2')
src = open(os.path.join(os.path.dirname(__file__), 'v4_source.html')).read()

def cut(s, start, end, incl_end=True):
    a = s.index(start); b = s.index(end, a)
    if incl_end: b += len(end)
    return s[:a], s[a:b], s[b:]

# ---- pieces to keep ----
_, app, _ = cut(src, '<div class="app rv" id="app">', '<div class="sample-row">', incl_end=False)
app = app.replace('class="app rv"', 'class="app"').rstrip()
_, form, _ = cut(src, '<form id="demoForm" class="rv" novalidate>', '</form>')
form = form.replace(' class="rv"', '')

# ---- new stage markup ----
STOPS = [
  dict(id='d1', side='bl', ax=30, ay=46, cax=47, cay=44, box=[24,34,72,72], name='Aerial · Autonomous drone', h='Autonomous <span class="gr">inspection.</span>',
       p='Our drone-enabled workflows support aerial surveying, photogrammetry, LiDAR scanning, thermal imaging, infrastructure inspection, volumetric analysis, and construction progress monitoring.',
       chips=['Photogrammetry', 'LiDAR', 'Thermal imaging', '3D reconstruction']),
  dict(id='h1', side='r', ax=60.2, ay=42, cax=55.6, cay=42, box=[50.2,26,61.1,79.8], name='Humanoid robotics', h='Intelligence that works alongside <span class="gr">people.</span>',
       p='Humanoid robotics represents the next evolution of embodied intelligence, bringing AI-assisted perception and manipulation into human-designed environments.',
       chips=['Embodied AI', 'Visual inspection', 'Human-robot collaboration', 'Task planning']),
  dict(id='q1', side='bl', ax=52, ay=48, cax=64.7, cay=48, box=[50.2,27.2,79.2,84.6], name='Quadruped robotics', h='Intelligence on the <span class="gr">ground.</span>',
       p='Four-legged robotic platforms extend inspection capabilities into complex industrial and construction environments.',
       chips=['Autonomous patrols', 'Ground reality capture', 'Thermal monitoring', 'Equipment inspection']),
]
def stop_html(s):
    chips = ''.join(f'<span>{c}</span>' for c in s['chips'])
    chips = f'<div class="chips mono">{chips}</div>' if chips else ''
    return (f'    <div class="stop" id="st-{s["id"]}" data-side="{s["side"]}" data-ax="{s["ax"]}" data-ay="{s["ay"]}" data-cax="{s["cax"]}" data-cay="{s["cay"]}" data-box="{','.join(map(str,s["box"]))}">\n'
            f'      <svg aria-hidden="true"><polyline fill="none"/></svg><i class="ind"></i>\n'
            f'      <div class="pnl"><span class="eyebrow mono">{s["name"]}</span><h3>{s["h"]}</h3><p>{s["p"]}</p>{chips}</div>\n'
            f'    </div>\n')

stage = '''<section class="film" id="top">
  <div class="stage" id="stage">
    <video id="film" muted playsinline preload="auto"></video>
    <div id="mfade"></div><div id="dim"></div>
    <canvas id="cloud" aria-hidden="true"></canvas>
    <video id="vis" muted playsinline preload="none" poster="media/vision-e.jpg"></video>
    <video id="bgcorr" muted playsinline loop preload="none" poster="media/bg-corridor.jpg"></video>
    <video id="loop" src="media/hero-loop-e.mp4" muted playsinline loop autoplay preload="auto" poster="media/poster-e.jpg"></video>
    <div class="grade"></div><div class="grain"></div>
    <div class="hud" id="hud">
      <i class="corner tl"></i><i class="corner tr"></i><i class="corner bl"></i><i class="corner br"></i>
      <div class="gridfx" id="gridfx"></div>
      <div class="scanline" id="scan"></div>
      <div class="target" id="tgt" data-l="HUMANOID · PATROL"></div>
    </div>

    <div class="ch c0" data-from="-1" data-to="0.02">
      <div class="k eyebrow mono">Physical AI · Autonomous Robotics · Industrial Intelligence</div>
      <h1 data-split>Intelligence that moves beyond the <span class="gr">screen.</span></h1>
      <p class="k2">Physical AI for the real world.</p>
      <div class="row"><a class="btn" href="#platform" data-go="plat">Explore our platform <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M2 8h11M9 4l4 4-4 4"/></svg></a><a class="ghost" href="#contact" data-go="contact">Talk to our team</a></div>
    </div>
    <div id="caps" aria-hidden="true"><i></i><i></i><i></i><i></i></div>

''' + ''.join(stop_html(s) for s in STOPS) + '''
    <div class="scene plat" id="platScene">
      <div class="phead"><div><span class="eyebrow mono">The Northstar platform</span><h2>From physical observation to <span class="gr">intelligent&nbsp;action.</span></h2></div><p class="psub">One agentic platform connects what the drones, humanoids and quadrupeds observe with the people who act on it. Explore the sample site below.</p></div>
      <div class="pwrap" id="pwrap">
''' + app + '''
        <p class="illus mono">Illustrative interface · sample data · <a href="media/northstar-sample-report.pdf" target="_blank" rel="noopener">sample report (PDF)</a></p>
      </div>
    </div>

    <div class="scene brand" id="brandScene">
      <div class="visplat" id="visplat" aria-hidden="true"></div>
      <div class="bwrap">
        <span class="eyebrow mono">Northstar · Vision</span>
        <h2 class="bst">We bring intelligence into the <span class="gr">physical world.</span></h2>
        <p class="bsub">Powered by our agentic AI platform, Northstar connects autonomous drones, quadruped robots and humanoid robotics to make physical environments more observable, intelligent, and verifiable.</p>
      </div>
    </div>

    <div class="scene contact" id="contactScene">
      <div class="cwrap" id="cwrap">
        <div class="ctext">
          <span class="eyebrow mono">Contact</span>
          <h2>The future of intelligence is <span class="gr">physical.</span></h2>
          <p class="k3">Bring autonomous intelligence into your operations.</p>
          <p class="sub">From construction quality assurance to industrial inspection and intelligent asset monitoring, Northstar is building the next generation of physical AI solutions.</p>
          <p class="sign">Let's build a world where machines don't just operate — they understand.</p>
        </div>
''' + form + '''
        <div class="cfoot mono"><img src="brand/northstar-flight-ribbon-compact-white.svg" alt="Northstar"><span>© Northstar - A HuntGlobal Venture. All rights reserved.</span><span>Intelligence Beyond the Digital World.</span></div>
      </div>
    </div>

    <nav class="rail" id="rail" aria-label="Chapters"><a class="mono" href="#brand" data-go="intro">Brand<b></b></a><a class="mono" href="#drone" data-go="d1">Drone<b></b></a><a class="mono" href="#humanoid" data-go="h1">Humanoid<b></b></a><a class="mono" href="#quadruped" data-go="q1">Quadruped<b></b></a><a class="mono" href="#platform" data-go="plat">Platform<b></b></a><a class="mono" href="#vision" data-go="brand">Vision<b></b></a><a class="mono" href="#contact" data-go="contact">Contact<b></b></a></nav>
    <div class="hint mono" id="hint">Scroll<span></span></div>
  </div>
</section>
'''

out = src
# body: replace film section + everything after it up to </footer>
pre, _, post = cut(out, '<section class="film" id="top">', '</footer>')
out = pre + stage + post
# bgfilm layer and progress hairline (not needed: the whole page is the film)
pre, _, post = cut(out, '<div class="bgfilm" id="bgfilm"', '</div>\n</div>\n')
out = pre + post
# nav
out = re.sub(r'<nav>.*?</nav>', '<nav><a href="#drone" data-go="d1">Drone</a><a href="#humanoid" data-go="h1">Humanoid</a><a href="#quadruped" data-go="q1">Quadruped</a><a href="#platform" data-go="plat">Platform</a><a href="#vision" data-go="brand">Vision</a><a href="#contact" data-go="contact">Contact</a></nav>', out, count=1, flags=re.S)
out = out.replace('<a class="btn" href="#contact">Talk to our team', '<a class="btn" href="#contact" data-go="contact">Talk to our team', 1)

# ---- JS ----
engine = open(os.path.join(os.path.dirname(__file__), 'v4_engine.js')).read()
pre, _, post = cut(out, '// Film: scroll progress drives the video time and overlays', '// ---------- Northstar Site view: a working illustrative product preview ----------', incl_end=False)
out = pre + engine + '\n' + post
# drop the old section scripts (platform trigger, inside, steps, industries, nav IO, partner, FAQ) but keep the app click-outside
pre, mid, post = cut(out, '// Platform: grid sweeps across the map, pins drop, issues slide in', '// Demo form: opens the visitor', incl_end=False)
keep = "$('#app').addEventListener('click', e => { if (!e.target.closest('.pin') && !e.target.closest('.issue') && SV.sel >= 0) svSelect(SV.sel); });\n"
appTl = "const appTl = gsap.timeline({ paused: true, onComplete: () => $('#app').classList.add('live') });\nappTl.to('#mlayer', { clipPath: 'inset(0 0% 0 0)', duration: 1.4, ease: 'power2.inOut' })\n  .to('.pin', { scale: 1, duration: 0.6, ease: 'back.out(2)', stagger: 0.14 }, '-=0.5')\n  .to('.issue', { opacity: 1, x: 0, duration: 0.7, ease: 'expo.out', stagger: 0.12 }, '-=0.5');\n"
out = pre + appTl + keep + post
# anchor handler: data-go instead of hash scrolling
out = out.replace("""  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => { const t = a.getAttribute('href'); if (t.length > 1 && $(t)) { e.preventDefault(); lenis.scrollTo(t, { offset: t === '#top' ? 0 : -($('#hdr').offsetHeight + 6) }); } }));\n""", '')
# header progress hairline (the old header/BG/reveal code sat inside the replaced engine range)
out = out.replace('// ---------- Northstar Site view: a working illustrative product preview ----------', "// Header: a progress hairline across the top\nconst hdr = $('#hdr');\nfunction headerState() { const pr = $('#prog'), max = document.documentElement.scrollHeight - innerHeight; if (pr) { pr.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`; pr.classList.toggle('show', scrollY > 40); } }\naddEventListener('scroll', headerState, { passive: true }); headerState();\n// ---------- Northstar Site view: a working illustrative product preview ----------", 1)
# snapshot hook
pre, _, post = cut(out, '// Frozen-state hook for screenshots', "setTimeout(() => (window.__ready = true), 1500);")
out = pre + """// Frozen-state hook for screenshots: ?p=0..1 (or ?seg=name&u=0..1) jumps the timeline there
{
  const q = new URLSearchParams(location.search); let forced = q.get('p');
  if (q.get('seg')) { const sg = SEG.find(s => s.name === q.get('seg')); if (sg) forced = sg.p0 + (sg.p1 - sg.p0) * (+q.get('u') || 0); }
  if (forced !== null) {
    document.documentElement.classList.add('snap');
    L.done = true; document.documentElement.style.overflow = ''; if (lenis) lenis.start(); intro.progress(1);
    const go = () => { S.target = S.cur = +forced; };
    film.addEventListener('loadeddata', go); go();
    addEventListener('load', () => { const y = +forced * (sec.offsetHeight - innerHeight); lenis ? lenis.scrollTo(y, { immediate: true }) : scrollTo(0, y); ScrollTrigger.refresh(); go(); });
  }
}
setTimeout(() => (window.__ready = true), 1500);""" + post

# Loader: same animation, less waiting
_l = "const minT = reduce ? 0.6 : 2.6, maxT = 9;"
assert _l in out
out = out.replace(_l, "const minT = reduce ? 0.6 : 1.8, maxT = 4.5;", 1)
# only the film's opening must be ready before the page opens; the rest keeps loading behind it
_l = "film.buffered.end(0) / (film.duration * 0.3)"
assert _l in out
out = out.replace(_l, "film.buffered.end(0) / (film.duration * 0.08)", 1)
out = out.replace("L.shown += (target - L.shown) * 0.06 + (target > L.shown ? 0.0015 : 0);", "L.shown += (target - L.shown) * 0.12 + (target > L.shown ? 0.003 : 0);", 1)
out = out.replace("const tl = gsap.timeline({ onComplete: () => { $('#loader').remove(); } });", "const tl = gsap.timeline({ onComplete: () => { $('#loader').remove(); } }); tl.timeScale(1.6);", 1)
# Site View: a marker clicked while Reports is open must switch back and still select
_a = "function svSelect(k) {\n"
assert _a in out
out = out.replace(_a, _a + "  if (SV.view === 'rep') svView('map');\n", 1)
out = out.replace("  if (SV.view === 'rep') svView('map');\n}", "  svPopClear();\n}", 1)
out = out.replace("function svView(k) {", """function svPopClear() {
  // keep the detail card off the neighbouring markers
  const base = svPop.style.transform, others = [...svPins.children].filter((_, i) => i !== SV.sel), hit = () => { const r = svPop.getBoundingClientRect(); return others.some(o => { const q = o.getBoundingClientRect(); return q.left < r.right && q.right > r.left && q.top < r.bottom && q.bottom > r.top; }); };
  if (!hit()) return;
  for (const x of ['-88%', '-12%']) { svPop.style.transform = base.replace('-50%', x); if (!hit()) return; }
  svPop.style.transform = base;
}
function svView(k) {""", 1)

# Contact form: inline, per-field validation (delivery still waits for an inbox)
_a = out.index("$('#demoForm').addEventListener('submit'"); _b = out.index("// Frozen-state hook for screenshots")
out = out[:_a] + open(os.path.join(os.path.dirname(__file__), 'v4_form.js')).read() + "\n" + out[_b:]

# new film, hero loop
out = out.replace('media/film-960-c.mp4', 'media/film-960-e.mp4').replace('media/film-1600-c.mp4', 'media/film-1600-e.mp4').replace('media/hero-loop-b.mp4', 'media/hero-loop-e.mp4')
# ---- CSS ----
css = open(os.path.join(os.path.dirname(__file__), 'v4.css')).read()
out = out.replace('</style></head><body>', css + '</style></head><body>', 1)

open(os.path.join(ROOT, 'index.html'), 'w').write(out)
print('wrote', os.path.join(ROOT, 'index.html'), len(out))
