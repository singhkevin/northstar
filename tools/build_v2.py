#!/usr/bin/env python3
"""Builds /v2: the main page (site-v2/index.html) plus the holographic 3D layer (tools/v2_holo.js).

The film, engine, copy and Platform are the main page's, unchanged. /v2 adds:
- site-v2/v2/holo.js: tools/v2_holo.js bundled with three.js by esbuild (self-hosted, no CDN)
- window.NS: a read-only view of the engine's timeline for the 3D layer
- the #holo canvas styling

Run after tools/build_v4.py:  python3 tools/build_v2.py
"""
import os, re, subprocess

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, '..')
SITE = os.path.join(ROOT, 'site-v2')
OUT = os.path.join(SITE, 'v2')
os.makedirs(OUT, exist_ok=True)

page = open(os.path.join(SITE, 'index.html')).read()

# assets live one folder up
page, n_media = re.subn(r'''(["'`(])media/''', r'\1../media/', page)
page, n_brand = re.subn(r'''(["'`(])brand/''', r'\1../brand/', page)
assert n_media > 10 and n_brand > 0, (n_media, n_brand)

# give the 3D layer a read-only view of the timeline
hook = "\nrequestAnimationFrame(frame);\n"
assert page.count(hook) == 1
page = page.replace(hook, "\nwindow.NS = { S, SEG, SEGS, segAt, band, ease, fmap, STOP, isPhone, isCompact, reduce };" + hook, 1)

css = "#holo{position:absolute;inset:0;width:100%;height:100%;z-index:9;pointer-events:none;mix-blend-mode:screen}\n"
assert '</style></head><body>' in page
page = page.replace('</style></head><body>', css + '</style></head><body>', 1)
assert page.count('</body>') == 1
page = page.replace('</body>', '<script src="holo.js" defer></script>\n</body>', 1)

open(os.path.join(OUT, 'index.html'), 'w').write(page)
subprocess.run(['npx', 'esbuild', os.path.join(HERE, 'v2_holo.js'), '--bundle', '--minify', '--format=iife',
                '--target=es2020', '--outfile=' + os.path.join(OUT, 'holo.js')], check=True, cwd=ROOT)
print('wrote', os.path.join(OUT, 'index.html'), len(page), '| media refs', n_media, '| brand refs', n_brand)
