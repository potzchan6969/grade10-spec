## Goals

- Public Recent Bids avatars show one letter from each bidder's email local
  part, so rivals are not all **B**.
- Readable listing labels stay **Bidder N** (and **You** for the viewer).
- Full email and name never appear on a public bid surface.

## Non-Goals

- Changing the visible public label to `A_Bidder#1` or any email-prefixed
  form.
- Returning the full email, display name, or any other identity field on
  public reads.
- Redesigning Storybook, Figma, or the shared bid-history block look.
- Adding avatars to account Bidding History, My Auctions, catalogue cards,
  standing lines, or admin bid views.
- Changing how `pseudonym_seq` / **Bidder N** is allocated.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | May a public surface expose any email-derived character? | Yes - only the first character of the email local part; never the full email - decided by the round | Keep opaque avatars only; name-derived initial |
| Q2 | Visible label vs avatar-only field? | Keep **Bidder N** as the readable label; return a separate avatar initial - decided by the round | Rewrite the label to `A_Bidder#1` |
| Q3 | Label format if rewritten? | N/A once Q2 kept **Bidder N** - decided by the round | `A_Bidder#1` / `Bidder#1` format debate |
| Q4 | Separate field vs stuffing the letter into the label string? | Separate public avatar initial - decided by the round | Encode the letter into the pseudonym string |
| Q5 | Fallback when the local part has no letter or digit? | **B** - decided by the round | `?` (current `avatarInitial` empty fallback) |
| Q6 | Which rows get the email initial? | Every public bid row, including the viewer's **You** row - decided by the round | Rivals only |
| Q7 | Which surfaces? | Every public bid avatar (lot Recent Bids + live updates on that ledger) - decided by the round | Recent Bids only while excluding live; account history avatars |
| Q8 | After email erasure? | Avatar falls back to **B** - decided by the round | Keep a previously published letter; invent from user id |
| Q9 | Storybook / shared-block redesign? | None - fixtures already show varied letters; production wiring is the gap - decided by the round | New Storybook states or Figma work |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| `grade10-site/auction/bidding-history` | Does a digit-leading local part (`7x@…`) keep the digit, or fall back to B? | Q5 |
| `grade10-site/auction/listing-page` | Does the viewer's You row use the email letter or a fixed letter? | Q6 |
