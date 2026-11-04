import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const DEBUG_PORT = 9224;
const SHOTS_DIR = path.resolve(process.env.HOME, 'Documents/antigravity/northstar-shots/variant-b');

if (!fs.existsSync(SHOTS_DIR)) {
  fs.mkdirSync(SHOTS_DIR, { recursive: true });
}

function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  console.log('Launching headless Chrome on port ' + DEBUG_PORT + '...');
  const profileDir = `/tmp/chrome-v-b-${Date.now()}`;
  const chrome = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${DEBUG_PORT}`,
    `--user-data-dir=${profileDir}`,
    '--window-size=1440,900',
    '--hide-scrollbars',
    '--mute-audio',
    '--no-first-run',
    '--no-default-browser-check'
  ], { stdio: ['ignore', 'pipe', 'pipe'] });

  chrome.stderr.on('data', d => {});

  let versionInfo = null;
  for (let i = 0; i < 30; i++) {
    try {
      versionInfo = await getJson(`http://127.0.0.1:${DEBUG_PORT}/json/version`);
      if (versionInfo && versionInfo.webSocketDebuggerUrl) break;
    } catch (e) {
      await sleep(250);
    }
  }

  if (!versionInfo) {
    console.error('Failed to get Chrome debug version info');
    chrome.kill();
    process.exit(1);
  }

  console.log('Connecting to browser WebSocket:', versionInfo.webSocketDebuggerUrl);
  const browserWs = new WebSocket(versionInfo.webSocketDebuggerUrl);
  await new Promise(r => browserWs.onopen = r);

  let msgId = 1;
  const browserPending = new Map();
  function sendBrowser(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = msgId++;
      browserPending.set(id, { resolve, reject });
      browserWs.send(JSON.stringify({ id, method, params }));
    });
  }
  browserWs.onmessage = e => {
    const data = JSON.parse(e.data);
    if (data.id && browserPending.has(data.id)) {
      const { resolve, reject } = browserPending.get(data.id);
      browserPending.delete(data.id);
      if (data.error) reject(data.error);
      else resolve(data.result);
    }
  };

  // Create new page target
  console.log('Creating new page target for http://localhost:4103/ref/ ...');
  const { targetId } = await sendBrowser('Target.createTarget', { url: 'http://localhost:4103/ref/' });
  const { sessionId } = await sendBrowser('Target.attachToTarget', { targetId, flatten: true });

  const pagePending = new Map();
  const consoleMessages = [];
  const errors = [];

  function sendPage(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = msgId++;
      pagePending.set(id, { resolve, reject });
      browserWs.send(JSON.stringify({ id, sessionId, method, params }));
    });
  }

  browserWs.addEventListener('message', e => {
    const data = JSON.parse(e.data);
    if (data.sessionId === sessionId) {
      if (data.id && pagePending.has(data.id)) {
        const { resolve, reject } = pagePending.get(data.id);
        pagePending.delete(data.id);
        if (data.error) reject(data.error);
        else resolve(data.result);
        return;
      }

      if (data.method === 'Runtime.consoleAPICalled') {
        const text = data.params.args.map(a => a.value || a.description || JSON.stringify(a)).join(' ');
        consoleMessages.push({ type: data.params.type, text });
        if (data.params.type === 'error') {
          errors.push(text);
          console.error('[BROWSER CONSOLE ERROR]', text);
        } else {
          console.log(`[BROWSER ${data.params.type}]`, text);
        }
      } else if (data.method === 'Runtime.exceptionThrown') {
        const text = data.params.exceptionDetails.text + ' ' + (data.params.exceptionDetails.exception?.description || '');
        errors.push(text);
        console.error('[BROWSER EXCEPTION]', text);
      }
    }
  });

  await sendPage('Page.enable');
  await sendPage('Runtime.enable');
  await sendPage('Log.enable');

  console.log('Waiting for page initialization and media load...');
  for (let i = 0; i < 40; i++) {
    await sleep(250);
    const evalRes = await sendPage('Runtime.evaluate', {
      expression: '({ ready: window.__ready === true, topH: document.querySelector("#top")?.offsetHeight, hasRelay: !!document.querySelector("#relayStage") })',
      returnByValue: true
    });
    if (evalRes?.result?.value?.ready || evalRes?.result?.value?.hasRelay) {
      console.log('Page ready:', evalRes.result.value);
      break;
    }
  }

  // Dismiss loader if still showing
  await sendPage('Runtime.evaluate', {
    expression: 'if (window.L) { window.L.done = true; } const ld = document.querySelector("#loader"); if (ld) ld.remove(); document.documentElement.style.overflow = ""; if (window.lenis) window.lenis.start();'
  });
  await sleep(600);

  // Evaluate document scroll properties
  const scrollInfo = await sendPage('Runtime.evaluate', {
    expression: '({ maxScroll: document.documentElement.scrollHeight - window.innerHeight, scrollHeight: document.documentElement.scrollHeight, innerHeight: window.innerHeight })',
    returnByValue: true
  });
  const { maxScroll, scrollHeight, innerHeight } = scrollInfo.result.value;
  console.log(`Scroll Metrics: maxScroll=${maxScroll}px (total=${scrollHeight}px, vh=${innerHeight}px)`);

  async function captureStep(pct, scrollY) {
    await sendPage('Runtime.evaluate', {
      expression: `window.scrollTo({ top: ${scrollY}, behavior: 'instant' }); if (window.Lenis && window.lenis) { window.lenis.scrollTo(${scrollY}, { immediate: true }); } ScrollTrigger.update();`
    });
    await sleep(400);

    const stateRes = await sendPage('Runtime.evaluate', {
      expression: `(() => {
        const relay = document.querySelector('#relayStage');
        const d = document.querySelector('#charDrone');
        const h = document.querySelector('#charHumanoid');
        const q = document.querySelector('#charQuad');
        const lead = document.querySelector('#relayLead');
        const sub = document.querySelector('#relaySub');
        const topEl = document.querySelector('#top');
        const topRect = topEl ? topEl.getBoundingClientRect() : { bottom: 0 };
        const inTop = topRect.bottom > 50;

        // Check visible characters
        const relayOp = relay ? parseFloat(getComputedStyle(relay).opacity) : 0;
        const dOp = d ? parseFloat(getComputedStyle(d).opacity) : 0;
        const hOp = h ? parseFloat(getComputedStyle(h).opacity) : 0;
        const qOp = q ? parseFloat(getComputedStyle(q).opacity) : 0;
        const relayDisp = relay ? getComputedStyle(relay).display : 'none';

        // Check if hero video drone is visible
        const heroDrone = document.querySelector('#heroDrone');
        const heroDroneOp = heroDrone ? parseFloat(getComputedStyle(heroDrone).opacity) : 0;
        const heroDroneDisp = heroDrone ? getComputedStyle(heroDrone).display : 'none';

        // Count active characters in relay
        let activeRelayCount = 0;
        if (relayDisp !== 'none' && relayOp > 0.1) {
          if (dOp > 0.4) activeRelayCount++;
          if (hOp > 0.4) activeRelayCount++;
          if (qOp > 0.4) activeRelayCount++;
        }

        return {
          scrollY: Math.round(window.scrollY),
          inTop,
          relayDisp,
          relayOp,
          dOp,
          hOp,
          qOp,
          activeRelayCount,
          heroDroneDisp,
          heroDroneOp,
          lead: lead ? lead.textContent : '',
          sub: sub ? sub.textContent : ''
        };
      })()`,
      returnByValue: true
    });

    const s = stateRes.result.value;
    console.log(`[${String(pct).padStart(3, ' ')}% | y=${String(scrollY).padStart(5, ' ')}px] inTop=${s.inTop} Relay=${s.relayDisp}(op=${s.relayOp.toFixed(2)}) D:${s.dOp.toFixed(2)} H:${s.hOp.toFixed(2)} Q:${s.qOp.toFixed(2)} | ${s.lead}`);

    // Capture PNG screenshot
    const shot = await sendPage('Page.captureScreenshot', { format: 'png' });
    const buf = Buffer.from(shot.data, 'base64');
    const filename = `scroll-${pct}.png`;
    const filepath = path.join(SHOTS_DIR, filename);
    fs.writeFileSync(filepath, buf);
  }

  console.log('\n--- Capturing Forward Scroll (0% to 100% in 10% steps) ---');
  for (let pct = 0; pct <= 100; pct += 10) {
    const y = Math.round((pct / 100) * maxScroll);
    await captureStep(pct, y);
  }

  console.log('\n--- Testing Reverse Scroll Back to Top (100% -> 0%) ---');
  for (let pct = 90; pct >= 0; pct -= 20) {
    const y = Math.round((pct / 100) * maxScroll);
    await sendPage('Runtime.evaluate', {
      expression: `window.scrollTo({ top: ${y}, behavior: 'instant' }); if (window.Lenis && window.lenis) { window.lenis.scrollTo(${y}, { immediate: true }); } ScrollTrigger.update();`
    });
    await sleep(250);
  }

  // Final check at y = 0
  await sendPage('Runtime.evaluate', {
    expression: `window.scrollTo({ top: 0, behavior: 'instant' }); if (window.Lenis && window.lenis) { window.lenis.scrollTo(0, { immediate: true }); } ScrollTrigger.update();`
  });
  await sleep(400);

  const topCheck = await sendPage('Runtime.evaluate', {
    expression: `(() => {
      const relay = document.querySelector('#relayStage');
      const heroDrone = document.querySelector('#heroDrone');
      return {
        scrollY: window.scrollY,
        relayDisplay: relay ? getComputedStyle(relay).display : 'none',
        relayOpacity: relay ? parseFloat(getComputedStyle(relay).opacity) : 0,
        heroDroneDisplay: heroDrone ? getComputedStyle(heroDrone).display : 'none'
      };
    })()`,
    returnByValue: true
  });
  console.log('Top Check (y=0 restored):', topCheck.result.value);

  console.log('\n================ TEST RESULTS ================');
  console.log(`Saved screenshots in: ${SHOTS_DIR}`);
  console.log(`Console messages logged: ${consoleMessages.length}`);
  console.log(`Console errors count: ${errors.length}`);
  if (errors.length > 0) {
    console.error('FAIL: Console errors detected:', errors);
    chrome.kill();
    browserWs.close();
    process.exit(1);
  } else {
    console.log('PASS: 0 console errors verified!');
  }

  chrome.kill();
  browserWs.close();
}

main().catch(e => {
  console.error('Test runner failure:', e);
  process.exit(1);
});
