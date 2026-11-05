// Downloads results that were generated (and paid for) but never saved, e.g. because the CDN was blocked.
// For every job in <jobs.json> whose output file is missing, it finds the job's latest "completed" ledger entry,
// asks Higgsfield for that request's result URL (free) and downloads it. It never starts a new generation.
// Usage: node tools/hf_recover.mjs <jobs.json>
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import dotenv from 'dotenv';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
dotenv.config({ path: path.join(ROOT, '.env.local'), quiet: true });
const AUTH = { Authorization: 'Key ' + process.env.HF_CREDENTIALS };
const ledger = fs.readFileSync(path.join(ROOT, 'assets/ledger.jsonl'), 'utf8').trim().split('\n').map(l => JSON.parse(l));
for (const j of JSON.parse(fs.readFileSync(process.argv[2], 'utf8'))) {
  const out = path.resolve(ROOT, j.out);
  if (fs.existsSync(out)) continue;
  const e = ledger.filter(d => d.id === j.id && d.model === j.model && d.status === 'completed').pop();
  if (!e) { console.log('not generated', j.id); continue; }
  const r = await (await fetch(`https://api.higgsfield.ai/requests/${e.request_id}/status`, { headers: AUTH })).json();
  const url = r.video?.url || r.images?.[0]?.url || r.image?.url;
  if (!url) { console.log('no result url', j.id, r.status); continue; }
  fs.mkdirSync(path.dirname(out), { recursive: true });
  try { execFileSync('curl', ['-sS', '-f', '-L', '--retry', '3', '-o', out, url]); console.log('ok', j.id); }
  catch { console.log('download blocked', j.id, new URL(url).host); }
}
