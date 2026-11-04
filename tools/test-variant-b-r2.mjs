import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const DEBUG_PORT = 9225;
const SHOTS_DIR = path.resolve(process.env.HOME, 'Documents/antigravity/northstar-shots/variant-b-r2');

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
  const profileDir = `/tmp/chrome-v-b-r2-${Date.now()}`;
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

  chrome.stderr.on('data', () => {});

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
      } else if (data.method === 'Runtime.consoleAPICalled') {
        const type = data.params.type;
        const text = data.params.args.map(a => a.value || a.description || JSON.stringify(a)).join(' ');
        consoleMessages.push({ type, text });
        if (type === 'error') {
          errors.push(text);
          console.error(`[BROWSER ERROR] ${text}`);
        } else if (type === 'warning') {
          console.warn(`[BROWSER WARN] ${text}`);
        }
      } else if (data.method === 'Runtime.exceptionThrown') {
        const desc = data.params.exceptionDetails.exception?.description || data.params.exceptionDetails.text;
        errors.push(desc);
        console.error(`[BROWSER EXCEPTION] ${desc}`);
      }
    }
  });

  await sendPage('Page.enable');
  await sendPage('Runtime.enable');
  await sendPage('DOM.enable');
  await sendPage('CSS.enable');

  console.log('Waiting for page ready (__ready flag and loader removal)...');
  for (let i = 0; i < 60; i++) {
    const res = await sendPage('Runtime.evaluate', { expression: 'window.__ready === true && !document.getElementById("loader")' });
    if (res.result && res.result.value) break;
    await sleep(250);
  }

  // Get total scroll height
  const scrollInfo = await sendPage('Runtime.evaluate', {
    expression: '({ max: document.documentElement.scrollHeight - window.innerHeight, h: document.documentElement.scrollHeight, innerH: window.innerHeight })',
    returnByValue: true
  });
  console.log('Scroll metrics:', scrollInfo.result.value);
  const maxScroll = scrollInfo.result.value.max;

  // Function to take screenshot
  async function takeScreenshot(name) {
    const { data } = await sendPage('Page.captureScreenshot', { format: 'png' });
    const filePath = path.join(SHOTS_DIR, `${name}.png`);
    fs.writeFileSync(filePath, Buffer.from(data, 'base64'));
    console.log(`Saved screenshot: ${filePath}`);
  }

  // Scroll and capture every 5% from 0% to 100%
  const steps = 20; // 0, 5, 10, ... 100%
  console.log('Starting 5% step scroll capture down...');

  for (let s = 0; s <= steps; s++) {
    const pct = s * 5;
    const targetY = (pct / 100) * maxScroll;

    await sendPage('Runtime.evaluate', {
      expression: `
        if (window.lenis) {
          window.lenis.scrollTo(${targetY}, { immediate: true });
        } else {
          window.scrollTo(0, ${targetY});
        }
      `
    });

    await sleep(350);

    // Get telemetry & character status
    const status = await sendPage('Runtime.evaluate', {
      expression: `({
        scrollY: window.scrollY,
        pct: Math.round((window.scrollY / (${maxScroll} || 1)) * 100),
        timecode: document.querySelector('#tc')?.textContent,
        leadText: document.querySelector('#relayLead')?.textContent,
        subText: document.querySelector('#relaySub')?.textContent,
        relayVisible: document.querySelector('#relayStage')?.style.display !== 'none',
        droneOp: document.querySelector('#charDrone')?.style.opacity,
        humOp: document.querySelector('#charHumanoid')?.style.opacity,
        quadOp: document.querySelector('#charQuad')?.style.opacity
      })`,
      returnByValue: true
    });

    console.log(`[${pct}%] TC: ${status.result.value.timecode} | Lead: ${status.result.value.leadText} | Drone: ${status.result.value.droneOp} | Hum: ${status.result.value.humOp} | Quad: ${status.result.value.quadOp}`);

    await takeScreenshot(`scroll-${pct}`);
  }

  // Scroll back up in reverse to test pure deterministic reversibility
  console.log('Testing reverse scroll back up to 0%...');
  for (let s = steps; s >= 0; s -= 2) {
    const pct = s * 5;
    const targetY = (pct / 100) * maxScroll;
    await sendPage('Runtime.evaluate', {
      expression: `
        if (window.lenis) {
          window.lenis.scrollTo(${targetY}, { immediate: true });
        } else {
          window.scrollTo(0, ${targetY});
        }
      `
    });
    await sleep(80);
  }

  // Settle at 0%
  await sendPage('Runtime.evaluate', { expression: 'window.scrollTo(0, 0)' });
  await sleep(300);

  console.log('--- TEST RESULTS ---');
  console.log(`Total errors captured: ${errors.length}`);
  if (errors.length > 0) {
    console.error('Errors found:');
    errors.forEach((err, i) => console.error(`  ${i + 1}. ${err}`));
  } else {
    console.log('SUCCESS: 0 console errors during forward and reverse scroll!');
  }

  browserWs.close();
  chrome.kill();
  process.exit(errors.length > 0 ? 1 : 0);
}

main().catch(err => {
  console.error('Test runner fatal error:', err);
  process.exit(1);
});
