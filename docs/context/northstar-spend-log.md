---
name: northstar-spend-log
description: "Every paid generation for Northstar must be logged in ~/Desktop/Projects/Northstar/SPEND.md, which Kevin reimburses from the client."
metadata:
  node_type: memory
  type: feedback
  originSessionId: 5d98b1d3-b574-4638-ad7a-844f540901f9
  modified: 2026-10-28T09:37:42.501Z
---

Kevin (28 Oct 2026): "keep a track of whatever we used to reimburse from client". He topped up the Higgsfield API (open.higgsfield.ai) for Northstar.

**Why:** spend on Northstar assets is billed back to the client, so it needs an itemised record.
**How to apply:** for every paid call (Higgsfield or any other) on [[northstar-website]], add a row to `SPEND.md` (date, tool, model, what, count, quoted, billed, used on site) as it runs, and keep the total up to date. Quote first and get a yes per batch (house rule).

**29 Oct 2026:** Kevin: "we are changing higgsfield just for this project". `tools/hf.mjs` + `gen_stills.mjs` now read ONLY `Northstar/.env.local` (HF_CREDENTIALS=key-id:secret, mode 600) and exit if it is empty; no fallback to `higgsfield-seedance/.env.local`. The $4.98 so far was on the old shared account. The v2 "no new Higgsfield generations" instruction still applies unless Kevin lifts it.
- Key "Northstar - Claude Code" created 29 Oct on the new account via Claude in Chrome, saved via copy button + pbpaste (never shown), verified free (404 vs 401). New account balance was $65.00.
