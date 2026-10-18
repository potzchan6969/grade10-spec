# House writing style

How everything here is written: manual pages, specs' prose, references,
proposals, governance docs, commits, replies. Copy the page nearest your
task and keep it open while you draft.

| Writing | Copy |
| --- | --- |
| A page about rules and numbers | `docs/prds/products/grade10-site/loyalty/points.md` and `tiers.md` |
| A page about an instrument and its refusals | `docs/prds/products/grade10-site/loyalty/coupons.md` |
| A page about a surface | `docs/prds/products/grade10-site/store/product-listing.md` |
| An owner's draft or a reference | `docs/references/grade10-finance.md` |
| A page block | `docs/prds/guides/writing-the-manual.md` |

## Shape

- **Group by how the reader meets it** — sections follow the reader's path,
  such as Google sign-in, then email sign-in, then screens. Not the code's
  modules, and not the spec's requirement order
- **Numbers sit under the section they govern** — a five-minute link lives
  under its expiry section. No values table at the top
- **Plain labels** — a `##` is a short Title Case label, like `Link Expiry`
- **One idea per bullet** — a bold term, a dash, then one or two short
  sentences. Split a bullet that needs a second clause
- **Tables for sets** — states, outcomes, refusals, decisions. Every row has
  the same columns

## Words

- **The reader's words** — `Resend`, `site`, `console`. Not `surface`,
  `judged`, `settled`, `intent`
- **Short sentences** — about fifteen words. Present tense, flat
- **No flourish** — no metaphor, twist or idiom
- **Digits for values** — `$139`, `Resend (45)`, `70 seconds`

## Placement

- **Keep a line only if the reader would act differently without it.** A
  testable rule belongs in `openspec/specs/`. A case that proves a rule
  belongs in the suite
- **Link, don't repeat** — name the capability and link its page. Never cite
  a scenario id (`…-SC-32`)
- **The engineer block holds names and links only** — the config name, the
  module, the architecture doc

## Marks

- **❓ or `TBC`** — not confirmed. Name who confirms it
- **🚧** — confirmed and being built. One line per outcome. Remove it when
  the change is verified
- Never both on one line

## Checklist

1. **Cut** — would the reader act differently without each line? If not,
   delete it or move it to its owner
2. **Sections** — grouped by the reader's path? Each number under the
   section it governs?
3. **Words** — every word one the reader would say? Sentences short?
4. **Marks** — unconfirmed facts marked ❓; 🚧 only on confirmed outcomes
5. **Engineer block** — names and links only

## Enforcement

- `pnpm check:manual` refuses an unmarked page and warns `dense` past 120
  lines of prose
- The `writing-style` skill loads this file before drafting
