#!/usr/bin/env python3
"""Builds /v3's two three.js bundles: the Platform terrain and the flying drone. The page itself (site-v2/v3/index.html) is hand-written, not generated.
Run:  python3 tools/build_v3.py
"""
import os, subprocess
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.join(HERE, '..')
subprocess.run(['npx', 'esbuild', os.path.join(HERE, 'v3_terrain.js'), '--bundle', '--minify', '--format=iife', '--target=es2020',
                '--outfile=' + os.path.join(ROOT, 'site-v2', 'v3', 'terrain.js')], check=True, cwd=ROOT)
subprocess.run(['npx', 'esbuild', os.path.join(HERE, 'v3_drone.js'), '--bundle', '--minify', '--format=iife', '--target=es2020',
                '--outfile=' + os.path.join(ROOT, 'site-v2', 'v3', 'drone.js')], check=True, cwd=ROOT)
