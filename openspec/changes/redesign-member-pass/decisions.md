## Goals

- The member-code block is named `MemberPass`, clear of the wallet's
  member card and the `TierCard` beside it.
- `MemberPass` draws the designer's Figma pass — the tier-skinned header
  with the account email — and keeps the code legible on a phone held up
  alone at a till.
- A fresh code swaps the code area in and out gracefully, never snapping
  under a scanner.

## Non-Goals

- No change to the code's product rules beyond the mirror — its life and
  its single use stay, and the till's refusal of a replay still names
  where and when; only the member-side mirroring of that answer leaves
  `store/membership` SC-09.
- The wallet pass. The wallet member card renders the same code; this
  change touches the on-site pass only.
- Setting screen brightness. No standard web API exposes it; the
  standalone page holds a screen wake lock, and any native bridge is the
  consumer's.
- Rewriting archived OpenSpec changes. Past archives keep the name they
  shipped under.
- Token work. The skins draw on the palette the design system already
  holds; `tokens.json` is untouched.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | What does `MemberCard` become? | `MemberPass` — the designer's own name on the Figma frame | `MemberCode`, `ScanPass` — each names the mechanism, not the thing the member presents |
| Q2 | How does the skin arrive? | A `variant` prop, `"silver" \| "gold" \| "black"`, separate from `tier` — the same axis `TierCard` takes | Deriving the skin from the `tier` string — the tier name is consumer-worded copy, not a skin selector |
| Q3 | Does the pass still need `expired` and `used` states, when the code refreshes? | Neither — the consumer rotates the code out before it lapses, so there is no expired rendering; and a code the till takes is answered by silently rotating to the next minted token, not by freezing the pass on a used surface. The replay refusal naming where and when stays the till's answer (`store/membership`, SC-09 amended), and the member's notification on a landed spend is US-04's own path | Keeping `used` or `expired` — the member standing at the till watched the code scan, and a frozen or lapsed pass argues with a refresh loop that is the whole point of the redesign |
| Q3b | Does the pass draw a typed short code beside the QR? | No — the square already encodes the record, staff never key it in, and a till that cannot scan falls back to the member's email, the lookup `store/membership` already names. `fallbackCode`, `shortCode` and the letters-only rule leave, and no coupon or wallet pass carries one either | Keeping it — a fallback nobody types is noise under a scanner, and the code's 10-minute life makes it stale on a screenshot within the queue |
| Q4 | What does the header identify the member by? | The account `email` — no name is collected at registration, and staff already identify by exact email | `displayName` — there is no name to display |
| Q5 | How does the phone's brightness rise? | It cannot — no standard web API sets or restores screen brightness; the standalone page holds a screen wake lock so the screen cannot dim or lock mid-scan, and a native shell's bridge is the consumer's | Pretending CSS or the `screen` API can — they cannot; the ask is recorded honestly in the PRD |
| Q6 | Do the pass's drop-shadow and silver-badge palette bind semantic tokens? | No — they are the design's own values: the badge's slate-300 is a foundational colour token, and both stay deliberately unbound to a semantic rung | Adding semantic tokens — these are fixed design values, not theme rungs a mode could swap |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| grade10-site/loyalty/programme | Can a web page raise and restore the phone's brightness while the pass is up? No standard API exposes it — the standalone page holds a screen wake lock instead, and a native shell's bridge is the consumer's. Owner: product manager | Q5 |
| grade10-site/loyalty/programme | The pass's drop-shadow and the silver badge's palette classes have no token binding — the linter flags them as unbound; the token decision is the designer's. Owner: designer | Q6 |
