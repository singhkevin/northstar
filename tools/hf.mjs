// Runs a list of Higgsfield jobs. Any input string "@file:<path>" is uploaded first and replaced by its CDN URL.
// Every paid call is appended to ../assets/ledger.jsonl (id, model, status, request id, quoted USD).
// Usage: node tools/hf.mjs <jobs.json> --cap <usd> [onlyId ...]
//   --cap is required: the run refuses to start if the jobs still to run would cost more than it (by each job's "usd").
//   Jobs whose output file already exists are skipped and not counted.
// Credentials: HF_CREDENTIALS=key-id:key-secret in the environment or in .env.local (git-ignored). Never printed.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { config, higgsfield } from '@higgsfield/client/v2';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
dotenv.config({ path: path.join(ROOT, '.env.local'), quiet: true });
// Northstar uses its OWN Higgsfield account (29 Oct 2026). No fallback to any other key.
if (!/^[^:\s]+:[^:\s]+$/.test(process.env.HF_CREDENTIALS || '')) { console.error('No Northstar Higgsfield key: set HF_CREDENTIALS=key-id:secret'); process.exit(1); }
config({ credentials: process.env.HF_CREDENTIALS, maxPollTime: 20 * 60 * 1000 });
const AUTH = { Authorization: 'Key ' + process.env.HF_CREDENTIALS, 'Content-Type': 'application/json' };
const LEDGER = path.join(ROOT, 'assets/ledger.jsonl');

const args = process.argv.slice(2);
const ci = args.indexOf('--cap');
if (ci < 0 || !(Number(args[ci + 1]) > 0)) { console.error('Refusing to run without --cap <usd>'); process.exit(1); }
const CAP = Number(args[ci + 1]);
args.splice(ci, 2);
const [jobsFile, ...only] = args;

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
  fs.mkdirSync(path.dirname(out), { recursive: true });
  const input = await resolve(j.input);
  const r = await higgsfield.subscribe(j.model, { input, withPolling: true });
  fs.appendFileSync(LEDGER, JSON.stringify({ t: new Date().toISOString(), id: j.id, model: j.model, status: r.status, request_id: r.request_id, usd: j.usd }) + '\n');
  const url = r.video?.url || r.images?.[0]?.url || r.image?.url;
  if (r.status !== 'completed' || !url) return console.log('FAIL', j.id, r.status);
  download(url, out);
  console.log('ok', j.id, fs.statSync(out).size);
}
// curl, not fetch: curl follows HTTPS_PROXY in cloud sessions, Node's fetch does not.
function download(url, out) { execFileSync('curl', ['-sS', '-f', '-L', '--retry', '3', '-o', out, url]); }
// Results come from Higgsfield's CDN. If this machine can't reach it, every paid result would be lost, so check first.
const CDN = 'https://d3u0tzju9qaucj.cloudfront.net/';
function cdnReachable() {
  try { execFileSync('curl', ['-sS', '-o', '/dev/null', '-m', '20', CDN]); return true; }
  catch (e) { return e.status === 22; } // 22 = an HTTP error from the CDN itself, which means it is reachable
}

const jobs = JSON.parse(fs.readFileSync(jobsFile, 'utf8'))
  .filter(j => !only.length || only.includes(j.id))
  .filter(j => { if (fs.existsSync(path.resolve(ROOT, j.out))) { console.log('skip', j.id); return false; } return true; });
const total = jobs.reduce((s, j) => s + (Number(j.usd) || 0), 0);
if (jobs.some(j => !(Number(j.usd) > 0))) { console.error('Every job needs a "usd" quote'); process.exit(1); }
if (total > CAP + 1e-9) { console.error(`Refusing: ${jobs.length} jobs quote $${total.toFixed(2)}, above the $${CAP} cap`); process.exit(1); }
if (jobs.length && !cdnReachable()) { console.error(`Refusing: can't reach ${CDN} to download results (network policy?). Nothing was generated.`); process.exit(1); }
console.log(`Running ${jobs.length} jobs, quoted $${total.toFixed(2)} (cap $${CAP})`);
const q = [...jobs];
await Promise.all([0, 1, 2].map(async () => { while (q.length) { const j = q.shift(); try { await run(j); } catch (e) { console.log('ERR', j.id, e.name, e.message); } } }));
