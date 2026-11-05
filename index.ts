// Higgsfield API example: one Seedance 2.5 text-to-video generation via the official SDK (v2 client).
// BILLABLE: every run makes one paid generation. Log it in SPEND.md.
// Credentials: HF_CREDENTIALS=key-id:key-secret in .env.local (git-ignored) or in the environment.
// The value is only passed to the SDK, never printed or logged.
// Run: node index.ts   (Node 22.18+ runs TypeScript directly)
import dotenv from 'dotenv';
import { higgsfield, config } from '@higgsfield/client/v2';

dotenv.config({ path: new URL('./.env.local', import.meta.url), quiet: true });

const credentials = process.env.HF_CREDENTIALS ?? '';
if (!/^[^:\s]+:[^:\s]+$/.test(credentials)) {
  console.error('Missing or malformed HF_CREDENTIALS (expected key-id:key-secret in .env.local or the environment).');
  process.exit(1);
}
config({ credentials, maxPollTime: 20 * 60 * 1000 });

const MODEL = 'bytedance/seedance-2.5/text-to-video';
const input = { prompt: 'A cinematic scene at sunset', duration: 5, resolution: '720p', aspect_ratio: '16:9' };

try {
  const jobSet = await higgsfield.subscribe(MODEL, { input, withPolling: true });
  const job = jobSet.jobs[0];
  const status = String(job?.status ?? 'unknown');
  const url = job?.results?.raw?.url;
  console.log(`request ${jobSet.id}: status ${status}`);

  if (jobSet.isCompleted && url) {
    console.log(`Video URL: ${url}`);
  } else if (jobSet.isNsfw) {
    console.error('Not generated: the request was rejected by content moderation (credits are refunded).');
    process.exitCode = 2;
  } else if (jobSet.isFailed) {
    console.error('Not generated: the generation failed (credits are refunded).');
    process.exitCode = 2;
  } else if (status === 'canceled' || status === 'cancelled') {
    console.error('Not generated: the request was canceled.');
    process.exitCode = 2;
  } else {
    console.error(`Not generated: finished with status "${status}" and no video URL.`);
    process.exitCode = 2;
  }
} catch (err) {
  // SDK errors: AuthenticationError (401), NotEnoughCreditsError (403), ValidationError (422),
  // BadInputError (400), APIError, TimeoutError (polling exceeded maxPollTime; a canceled request ends this way).
  const e = err as { name?: string; message?: string };
  console.error(`Not generated: ${e.name ?? 'Error'}: ${e.message ?? String(err)}`);
  process.exitCode = 1;
}
