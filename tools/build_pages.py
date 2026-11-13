#!/usr/bin/env python3
"""Build Northstar's inner pages from the home page (site-v2/index.html).

The home page is the single source: every inner page reuses its styles, header, sections,
contact block and script, with a short page head on top. Run after editing index.html:
    python3 tools/build_pages.py
Copy on every page is the founders' approved copy already on the home page; nothing new is invented.
"""
import re, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent / 'site-v2'
home = (ROOT / 'index.html').read_text()

PAGES = {
    'platform': dict(
        title='Platform', label='The Northstar platform',
        h1='One intelligence platform. <span class="flight">Every physical system.</span>',
        sub='An agentic intelligence and robotics orchestration platform designed to connect physical-world observations with autonomous workflows, intelligent analysis, and operational decision-making.',
        band=('loop-wide', 'bg-wide.jpg'), sections=['dial', 'platform', 'how']),
    'technology': dict(
        title='Technology', label='Our technology',
        h1='Intelligence in every <span class="flight">dimension.</span>',
        sub='Northstar brings aerial robotics, ground robotics, humanoid systems, and distributed sensors together through one intelligent orchestration platform.',
        band=('loop-air', 'bg-air.jpg'), sections=['technology', 'dial']),
    'solutions': dict(
        title='Solutions', label='Construction intelligence',
        h1='See what is happening. Understand what has changed. <span class="flight">Verify what has been delivered.</span>',
        sub='AI-powered construction quality assurance and progress intelligence.',
        band=('cons-0', 'cons-0.jpg'), sections=['construction', 'how']),
    'industries': dict(
        title='Industries', label='Industries',
        h1='Built for environments where <span class="flight">precision matters.</span>',
        sub='From construction sites and industrial facilities to energy infrastructure and critical assets.',
        band=('ind-energy-v', 'ind-energy-v.jpg'), sections=['industries', 'why']),
    'about': dict(
        title='About us', label='About Northstar',
        h1='Engineering the future of <span class="flight">physical AI.</span>',
        sub='Northstar is a physical AI and autonomous systems company focused on connecting machine intelligence with real-world operations.',
        band=('loop-human', 'bg-human.jpg'), sections=['vision', 'about', 'why']),
    'contact': dict(
        title='Contact', label='Contact',
        h1='Bring autonomous intelligence into your <span class="flight">operations.</span>',
        sub='From construction quality assurance to industrial inspection and intelligent asset monitoring, Northstar is building the next generation of physical AI solutions.',
        band=None, sections=[]),
}

def section(sid):
    m = re.search(r'<section id="%s"[\s\S]*?\n</section>\n' % sid, home)
    assert m, sid
    return m.group(0)

head_end = home.index('<header')
main_end = home.index('</main>')
contact = section('contact')
script = home[main_end:]

PHEAD_CSS = """<style>
/* inner pages: a short head under the header, then the home page's own sections */
.phead{padding-top:calc(var(--hdr) + clamp(40px,7vw,112px))}
.phead .crumb{display:flex;flex-wrap:wrap;justify-content:space-between;gap:8px 24px;color:var(--mid)}
.phead .crumb a:hover{color:var(--ink)}
.phead h1{margin-top:clamp(28px,4vw,56px);font:500 clamp(38px,5.6vw,92px)/1.02 var(--head);letter-spacing:-.045em;color:var(--ink);max-width:13em}
.phead .sub{margin:28px 0 0 auto;max-width:34em;color:var(--mid);font-size:clamp(17px,1.35vw,21px);line-height:1.5;letter-spacing:-.01em}
.phead .band{margin-top:clamp(40px,6vw,88px)}
.phead.solo{padding-bottom:clamp(24px,4vw,56px)}
@media (max-width:767px){.phead .sub{margin-left:0}}
header nav a[aria-current]{color:var(--ink)}#mnav a[aria-current]{color:var(--blue)}
</style>
"""

def build(slug, d):
    h = home[:head_end]
    h = h.replace('<title>Northstar · Physical AI</title>', f'<title>{d["title"]} · Northstar · Physical AI</title>')
    h = re.sub(r'<link rel="preload" href="media/drone\.glb"[^>]*>\n', '', h)
    h = re.sub(r'<script>\n// a loading screen until the 3D drone[\s\S]*?</script>\n', '', h)
    h = h.replace('</head>', PHEAD_CSS + '</head>')
    hdr = home[head_end:home.index('<main id="top">')]
    hdr = re.sub(r'<div id="loader"[^\n]*\n', '', hdr)
    hdr = hdr.replace('href="#top" aria-label="Northstar, back to top"', 'href="/" aria-label="Northstar home"')
    hdr = hdr.replace(f'<a href="/{slug}/">', f'<a href="/{slug}/" aria-current="page">')
    band = ''
    if d['band']:
        v, poster = d['band']
        band = (f'  <figure class="band"><video class="lazy" muted playsinline loop preload="none" poster="media/{poster}" '
                f'data-src="media/{v}.mp4" data-src-s="media/{v}-s.mp4" aria-hidden="true"></video></figure>\n')
    ph = (f'<section class="phead wrap{"" if d["band"] else " solo"}" aria-label="{d["title"]}">\n'
          f'  <div class="crumb mono"><a class="br" href="/">Northstar</a><span class="br">{d["label"]}</span></div>\n'
          f'  <h1>{d["h1"]}</h1>\n  <p class="sub">{d["sub"]}</p>\n{band}</section>\n')
    body = '<main id="top">\n' + ph + ''.join(section(s) for s in d['sections']) + contact
    sc = script
    if 'platform' not in d['sections']:
        sc = sc.replace('<script src="terrain.js" defer></script>\n', '')
    sc = re.sub(r'<script src="drone\.js"[^>]*></script>\n', '', sc)
    page = h + hdr + body + sc
    # every asset path from the site root, since the page sits one folder down
    page = re.sub(r'''(["'(`=])(media|brand|vendor)/''', r'\1/\2/', page)
    page = page.replace('<script src="terrain.js"', '<script src="/terrain.js"')
    out = ROOT / slug / 'index.html'
    out.parent.mkdir(exist_ok=True)
    out.write_text(page)
    print('wrote', out.relative_to(ROOT.parent), len(page) // 1024, 'KB')

for slug, d in PAGES.items():
    build(slug, d)
