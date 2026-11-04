import puppeteer from 'puppeteer-core';
const [,, base, out, w, h, ...ids] = process.argv;
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', args: ['--mute-audio','--autoplay-policy=no-user-gesture-required'] });
const p = await b.newPage(); const mob = +w < 600;
await p.setViewport({ width: +w, height: +h, deviceScaleFactor: 1, isMobile: mob, hasTouch: mob });
const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
for (const id of ids) {
  const [seg, u = '0'] = id.split(':');
  await p.goto(`${base}?seg=${seg}&u=${u}`, { waitUntil: 'load', timeout: 30000 });
  await p.waitForFunction(() => { const f = document.querySelector('#film'); return !f || !f.src || (f.readyState >= 3 && !f.seeking); }, { timeout: 15000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 2200));
  await p.screenshot({ path: `${out}/${w}-${id.replace(':', '_')}.jpg`, quality: 72 });
}
console.log('errors:', [...new Set(errs)].join(' | ') || 'none');
await b.close();
