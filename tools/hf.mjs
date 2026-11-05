// Runs a list of Higgsfield jobs. Any input string "@file:<path>" is uploaded first and replaced by its CDN URL.
// Every paid call is appended to ../assets/ledger.jsonl (id, model, status, request id, quoted USD).
// Usage: node hf.mjs <jobs.json> [onlyId ...]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// The key lives only in <repo>/.env.local (HF_CREDENTIALS=key-id:secret).
try {
  for (const line of fs.readFileSync(ROOT + '/.env.local', 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*"?([^"\n]*)"?\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2];
  }
} catch {}
if (!/^[^:\s]+:[^:\s]+$/.test(process.env.HF_CREDENTIALS || '')) { console.error('No Higgsfield key: set HF_CREDENTIALS=key-id:secret in .env.local'); process.exit(1); }
const { config, higgsfield } = await import('@higgsfield/client/v2');
config({ credentials: process.env.HF_CREDENTIALS, maxPollTime: 20 * 60 * 1000 });
const AUTH = { Authorization: 'Key ' + process.env.HF_CREDENTIALS, 'Content-Type': 'application/json' };
const LEDGER = ROOT + '/assets/ledger.jsonl';

const uploads = new Map();
async function upload(file) {
  if (uploads.has(file)) return uploads.get(file);
  const type = file.endsWith('.png') ? 'image/png' : 'image/jpeg';
  const r = await (await fetch('https://api.higgsfield.ai/files/generate-upload-url', { method: 'POST', headers: AUTH, body: JSON.stringify({ content_type: type }) })).json();
  const put = await fetch(r.upload_url, { method: 'PUT', headers: { 'Content-Type': type, ...(r.upload_headers || {}) }, body: fs.readFileSync(file) });
  if (!put.ok) throw new Error('upload failed ' + put.status);
  uploads.set(file, r.public_url);
  return r.public_url;
}
async function resolve(v) {
  if (typeof v === 'string' && v.startsWith('@file:')) return upload(path.resolve(ROOT, v.slice(6)));
  if (Array.isArray(v)) return Promise.all(v.map(resolve));
  if (v && typeof v === 'object') { const o = {}; for (const k in v) o[k] = await resolve(v[k]); return o; }
  return v;
}
async function run(j) {
  const out = path.resolve(ROOT, j.out);
  if (fs.existsSync(out)) return console.log('skip', j.id);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  const input = await resolve(j.input);
  const r = await higgsfield.subscribe(j.model, { input, withPolling: true });
  fs.appendFileSync(LEDGER, JSON.stringify({ t: new Date().toISOString(), id: j.id, model: j.model, status: r.status, request_id: r.request_id, usd: j.usd }) + '\n');
  const url = r.video?.url || r.images?.[0]?.url || r.image?.url;
  if (r.status !== 'completed' || !url) return console.log('FAIL', j.id, r.status, JSON.stringify(r).slice(0, 300));
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
  fs.writeFileSync(out, buf);
  console.log('ok', j.id, buf.length);
}
const only = process.argv.slice(3);
const jobs = JSON.parse(fs.readFileSync(process.argv[2], 'utf8')).filter(j => !only.length || only.includes(j.id));
const q = [...jobs];
await Promise.all([0, 1, 2].map(async () => { while (q.length) { const j = q.shift(); try { await run(j); } catch (e) { console.log('ERR', j.id, e.message); } } }));
