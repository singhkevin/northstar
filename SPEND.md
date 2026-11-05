# Northstar: paid-tool spend log (to reimburse from the client)

Every paid generation for Northstar gets a row here, at the moment it runs.
"Quoted" comes from Higgsfield's free estimate before the run. "Billed" is the balance difference where we can read it, otherwise the estimate.
Kevin topped up the Higgsfield API account (open.higgsfield.ai) on 28 Oct 2026, before any Northstar spend.
**29 Oct 2026:** Northstar switched to its own Higgsfield account (key "Northstar - Claude Code", balance $65.00 when the key was made). Its key lives only in `Northstar/.env.local`, and the scripts no longer use the shared studio key. Rows above were billed to the old (shared) account.

| Date | Tool | Model | What it made | Count | Quoted (USD) | Billed (USD) | Used on site? |
|---|---|---|---|---|---|---|---|
| 28 Oct 2026 | Higgsfield API | xai/grok-imagine-image-2.0 | V3 hero keyframe stills (6 shots × 2) | 12 | $0.72 | $0.72 (est.) | Review |
| 28 Oct 2026 | Higgsfield API | alibaba/qwen-image-3/text-to-image | V3 hero keyframe stills (6 shots × 2) | 12 | $0.48 | $0.48 (est.) | Review |
| 28 Oct 2026 | Higgsfield API | xai/grok-imagine-image-2.0 (edit) | Redrew take-off + scan stills with the hero drone, for consistency | 2 | $0.14 | $0.14 (est.) | Yes |
| 28 Oct 2026 | Higgsfield API | kling-video/o3/first-last-frame | Hero loop, take-off, scan, dive, humanoid clips (5 s, 1080p) | 5 | $2.80 | $2.80 (est.) | Yes |
| 28 Oct 2026 | Higgsfield API | kling-video/v3.0/pro/image-to-video | Robot dog on stairs clip (5 s, 1080p) | 1 | $0.84 | $0.84 (est.) | Yes |

| 2 Nov 2026 | Higgsfield API (Northstar account) | xai/grok-imagine-image-2.0 | v2 stills: hero drone ×5, quadruped ×2, humanoid ×2, sensor corridor ×2, construction ×2, 5 industry images, aerial ×2, night ×2, drone-free twin | 23 | $1.45 | $1.45 (est.) | Yes |
| 2 Nov 2026 | Higgsfield API (Northstar account) | kling-video/o3/first-last-frame | v2 seamless loops (hero, aerial, quadruped, humanoid, sensors, construction, night) + 2 bridge clips, 5 s 1080p | 9 | $4.28 | $4.28 (est., 15% discount applied) | Yes |

| 2 Nov 2026 | Higgsfield API (Northstar account) | kling-video/o3/first-last-frame ×3, kling-video/v3.0/pro/image-to-video ×2 | Audit fixes for the main-page film: drone approach, drone over site, drone exits behind tower, humanoid emerges, humanoid walks past camera (5 s 1080p each) | 5 | $3.11 | $3.11 (est.) | Yes |

**Total so far: $13.82** ($4.98 on the old shared account, $8.84 on the Northstar account) (all 37 requests completed; request IDs in `assets/keyframes/ledger.jsonl` and `assets/ledger.jsonl`)

| 3 Nov 2026 | Higgsfield API (Northstar account) | xai/grok-imagine-image-2.0 (edit) | v4 refinement key frames: 16 frames, 2 tries each (Kevin approved up to $13) | 32 | $2.24 | $2.24 (est.) | Review |
| 3 Nov 2026 | Higgsfield API (Northstar account) | xai/grok-imagine-image-2.0 (edit) | Key frame touch-ups: remove stray second drone, quadruped rear view | 4 | $0.28 | $0.28 (est.) | Review |
| 3 Nov 2026 | Higgsfield API (Northstar account) | kling-video/o3/first-last-frame | v4 refinement film: 13 chained clips + 4 Vision clips, 5 s 1080p | 17 | $8.09 | $8.09 (est.) | Review |
| 3 Nov 2026 | Higgsfield API (Northstar account) | kling-video/o3/first-last-frame | Re-dos: quadruped departure (came too close), Vision drone-to-humanoid (crane inside room) | 2 | $0.95 | $0.95 (est.) | Review |

**Total after the 3 Nov refinement: $25.38** ($4.98 on the old shared account, $20.40 on the Northstar account). The 3 Nov pass cost $11.56 against the $13 Kevin approved.

| 5 Nov 2026 | Higgsfield API (Northstar account) | bytedance/seedance-2.5/text-to-video | SDK setup test: cinematic sunset, 5 s 720p 16:9 (Kevin approved the $2.31 quote; request 01a1a9bc-2f34-71b4-95ff-b60d5c2fbe43, completed) | 1 | $2.31 | $2.31 (est.) | No |

**Total after the 5 Nov SDK test: $27.69** ($4.98 on the old shared account, $22.71 on the Northstar account). Quote is the list price from the model page ($0.4622/s at 720p), before any discount. Per the SDK docs, failed or nsfw requests are refunded; this one completed, so it is billed.
