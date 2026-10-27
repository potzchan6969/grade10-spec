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
| Q7 | What does the pass draw before its first token arrives? | Nothing — the consumer renders the pass only once it holds a token — the human's choice; carried by `SC-mp1` and the Member Pass page line on the pass's draw | A placeholder square in the pass |
| Q8 | How does the header show a very long account email? | In full, wrapping rather than truncating - decided by the round; staff fall back to the exact email when a till cannot scan (Q3b, Q4 and the PRD's "a till that cannot scan falls back to the member's email") | Truncating with an ellipsis - it would hide the address the fallback needs |
| Q9 | What does the countdown count down to, and from what on a fresh code? | To the next rotation, which the consumer sets inside the code's 10-minute life, as the `refreshesIn` copy reads — the human's choice; carried by `SC-mp7` and the Member Pass page line on the countdown | To the code's full 10-minute lapse |
| Q10 | How does a member reach the standalone pass page, and what is its address? | The pass section opens the standalone page on a phone, its route the consumer app's to name — the human's choice; carried by the Member Pass page line "Its own page on a phone" | The page reached only by its own address, with no entry from the membership page |
| Q11 | After Refresh, or a refused Refresh, which code is on show? | The earlier code stays on show and alive until used or lapsed, so a refused refresh leaves it and its countdown running - decided by the round; the Membership PRD's Member Pass line "New code on demand — the earlier code stays alive until it is used or lapses" | Refresh voiding the earlier code - the PRD says it does not |
| Q12 | Within what time does the pass rotate after the till takes its code? | No bound is asserted - decided by the round; Q3 says the pass is answered by the next minted token arriving through props, and how the consumer learns of the scan is its own | A stated latency - nothing in the proposal or PRD gives one |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| grade10-site/loyalty/programme | Can a web page raise and restore the phone's brightness while the pass is up? No standard API exposes it — the standalone page holds a screen wake lock instead, and a native shell's bridge is the consumer's. Owner: product manager | Q5 |
| grade10-site/loyalty/programme | The pass's drop-shadow and the silver badge's palette classes have no token binding — the linter flags them as unbound; the token decision is the designer's. Owner: designer | Q6 |
| grade10-site/loyalty/programme | Before its first token arrives the pass has no stated rendering. Options: A - nothing, the consumer draws the pass only once it holds a token; B - a placeholder square. recommended: A. Owner: designer | Q7 |
| grade10-site/loyalty/programme | A very long account email in the header: options: A - in full, wrapping; B - truncated with an ellipsis. recommended: A | Q8 |
| grade10-site/loyalty/programme | What the countdown counts to, and from what value on a fresh code: options: A - the next rotation, set by the consumer inside the 10-minute life; B - the code's full 10-minute lapse. recommended: A. Owner: product manager | Q9 |
| grade10-site/loyalty/programme | How a member reaches the standalone pass page and its address, which no page states: options: A - the pass section opens it on a phone, the route the consumer's to name; B - reached only by its own address. recommended: A. Owner: product manager | Q10 |
| grade10-site/loyalty/programme | Whether Refresh voids the earlier code, and what a refused Refresh leaves on show: options: A - the earlier code stays alive and on show; B - Refresh voids it. recommended: A | Q11 |
| grade10-site/loyalty/programme | Within what time the pass rotates once the till takes its code: options: A - no bound asserted, the consumer's; B - a stated latency. recommended: A | Q12 |
