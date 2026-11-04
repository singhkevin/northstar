// Generates Northstar V3 keyframe stills on the Higgsfield API and appends each paid call to a JSONL ledger.
// Usage: node gen_stills.mjs <jobs.json> [onlyId]
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
const HF = '/Users/kevinsingh/Desktop/Projects/higgsfield-seedance';
const require = createRequire(HF + '/package.json');
const { config: loadEnv } = require('dotenv');
// Northstar uses its OWN Higgsfield account (29 Oct 2026): the key lives only in Northstar/.env.local.
// No fallback to the shared studio key, so Northstar spend can never land on the wrong account.
loadEnv({ path: '/Users/kevinsingh/Desktop/Projects/Northstar/.env.local', quiet: true });
if (!/^[^:\s]+:[^:\s]+$/.test(process.env.HF_CREDENTIALS || '')) { console.error('No Northstar Higgsfield key: set HF_CREDENTIALS=key-id:secret in Northstar/.env.local'); process.exit(1); }
const { config, higgsfield } = await import(HF + '/node_modules/@higgsfield/client/dist/v2/index.js');
config({ credentials: process.env.HF_CREDENTIALS, maxPollTime: 10 * 60 * 1000 });

const OUT = '/Users/kevinsingh/Desktop/Projects/Northstar/assets/keyframes';
const LEDGER = OUT + '/ledger.jsonl';
const PRICE = { 'xai/grok-imagine-image-2.0': 0.06, 'alibaba/qwen-image-3/text-to-image': 0.04 };
const jobs = JSON.parse(fs.readFileSync(process.argv[2], 'utf8')).filter(j => !process.argv[3] || j.id === process.argv[3]);

async function run(j) {
  const file = path.join(OUT, j.id + '.png');
  if (fs.existsSync(file)) return console.log('skip', j.id);
  const r = await higgsfield.subscribe(j.model, { input: { prompt: j.prompt, aspect_ratio: '16:9' }, withPolling: true });
  fs.appendFileSync(LEDGER, JSON.stringify({ t: new Date().toISOString(), id: j.id, model: j.model, status: r.status, request_id: r.request_id, usd: PRICE[j.model] }) + '\n');
  const url = r.images?.[0]?.url || r.image?.url;
  if (r.status !== 'completed' || !url) { console.log('FAIL', j.id, r.status, JSON.stringify(r).slice(0, 300)); return; }
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
  fs.writeFileSync(file, buf);
  console.log('ok', j.id, buf.length);
}
const queue = [...jobs];
await Promise.all([0, 1, 2].map(async () => { while (queue.length) { const j = queue.shift(); try { await run(j); } catch (e) { console.log('ERR', j.id, e.message); } } }));
