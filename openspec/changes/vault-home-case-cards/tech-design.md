## Context

`CaseList` in `packages/vault/frontend` draws each case from `FactCard`, a
`Badge` per chip, and lines of `Text`, and folds whose the item is with
`caseStanding` at the instant the vault read the list. `VaultCasesEmpty`
already draws the home with no case from the store. Nothing on the server
changes: the list's read carries every field the board shows except a
draft's photograph count, which stays out.

## Goals / Non-Goals

**Goals:**

- `VaultCases` in `packages/ui/src/blocks/vault-case/`, its card in a file
  of its own, with a story per card state, published by the store's
  Storybook
- `CaseList` maps each case into the block and draws nothing of its own but
  the loading and error states

**Non-Goals:**

- The case page's cards, the vault's frame, date formats and the palette; see
  [Non-Goals](decisions.md#non-goals)

## Decisions

### The blocks

```ts
/** The design system's badge tones; the consumer picks one per chip. */
type VaultCasesTone = "default" | "brand" | "info" | "success" | "warning" | "error";
type VaultCasesIcon = "person" | "vault" | "calendar" | "clock" | "warning" | "check";
type VaultCasesChip = { label: string; tone: VaultCasesTone; icon?: VaultCasesIcon };

/** One case as its card draws it, every word already worded. */
type VaultCasesCard = {
  id: string;
  title: string;
  status: VaultCasesChip;
  owner: VaultCasesChip;
  /** When it opened, the lane, the amount asked: joined by the block. */
  facts: readonly string[];
  reference: string;
  /** What the collector does next; `primary` for an answer the case waits on. */
  next: { label: string; tone: "primary" | "neutral" } | null;
  /** The calendar line: a booked visit, or the day the item went in. */
  visit: string | null;
  /** Why the case ended, in staff's words. */
  note: string | null;
};

type VaultCasesCopy = { start: string; yourCases: string; severalItems: string };
type VaultCasesProps = {
  copy: VaultCasesCopy;
  cases: readonly VaultCasesCard[];
  onOpen: (caseId: string) => void;
  onStartRequest: () => void;
};
```

- **One export** - `vault-case-card.tsx` draws a card and is not exported;
  `VaultCases` is the one component, with `VaultCasesProps`,
  `VaultCasesCopy`, `VaultCasesCard`, `VaultCasesChip`, `VaultCasesTone` and
  `VaultCasesIcon`, so the site types its maps by name
- **The card is one control** - the title is a `button` inside the card's
  `h4`, stretched over the card with an `after:` inset raised to `z-1`, so
  the card opens from anywhere, toned chips included; the card is
  `relative isolate`, so the raised inset stays inside it, and the focus
  ring is drawn on the inset with the card's own radius token, so the
  card's `overflow-hidden` cannot clip it; the control is named by the item
  and described by the reference, so two untitled cards stay apart; the
  caret is decorative. The card keeps the design system `Card`'s
  `data-slot="card"`, which the site's E2E finds a card by
- **The facts line** - each fact a span, `·` drawn between them
  `aria-hidden`, the reference last in `font-mono` as its own text, so a
  reader finds the card by it
- **The next step** - a row in `bg-primary-muted text-primary-muted-foreground`
  or `bg-muted text-foreground`, an arrow before the words
- **The home** - Start a request as the full-width primary `Button` with a
  plus; Your cases as an `h3` with the count inside it, under the site's
  `h2`, as `VaultCasesEmpty`'s How it works is; each card's title an `h4`;
  the cards; the several-items note as a `default` `Alert` with an info
  icon and `role="note"`, since it announces nothing

### The site

- **One module for the chip** - `presentation/chipView.ts` holds a pure
  `chipViewOf(chip, words)` returning the chip's word, tone and icon, and
  `STATUS_TONE: Record<CaseStatus, VaultCasesTone>` beside it, both from Q6;
  `OwnershipChip` draws the word and the tone from it, so the case page's
  chip and the card's never disagree; the icon is the card's alone, since
  only the tones move on the case page
- **The card's parts** - a pure `caseCardOf(row, asOf, words)` folds one
  `CaseSummary` into a `VaultCasesCard`, and `CaseList` gathers the words and
  formats once in one hook; it reads the same `caseStanding`, `offerLapsed`
  and `asOf` as today:
  - **title** - the item's name, else `vault.case.untitledItem`
  - **facts** - `list.opened`, the lane, `list.askedFor` when asked
  - **next** - `list.answerBy` while the offer is live, `primary`; on a
    draft `list.openedAtCounter` or `list.draftNext`, `neutral`
  - **visit** - `list.visitBooked` while the visit is still ahead at
    `asOf` and the chip is not Visit; else `list.inVaultSince` while the
    item is held, not released, and the chip is not With us; else none. A
    day the chip names is not drawn again, and an attended visit, whose day
    nothing clears, is not read as booked. `visitAhead` is exported from
    `standing.ts` for it
  - **note** - the decline reason
- **Words** - `vault.list.yourCases` joins every shared locale;
  `vault.list.open` and `vault.list.noVisit` leave every locale

## Risks / Trade-offs

- **Two orange badges** - Offer waiting for you and Waiting on you both read
  `brand` until grade10#702's palette softens them
- **E2E opens a card by its facts line** - the five clicks on Open
  (`request.spec.ts` three, `walk-in.spec.ts` two) become an `openCaseCard`
  helper beside `caseCard` that clicks the card's facts line, which proves
  the stretched control on the site
- **One commit for the bump** - the catalog types the list's keys, so the
  submodule bump, the chip module and `CaseList` land together
- **Case page tones move** - the ownership chip there takes the board's tones
  with the list's; its words and placement do not move

## Testing

| Layer | Proves |
| --- | --- |
| `VaultCases` stories with play functions | The order, the count, the start and open reports; each card state's parts, only the parts given |
| `public-exports.test.ts` | The three blocks and their types, nothing else |
| `caseCardOf` and `CaseList` tests | The map: chips, facts, reference, next step, the calendar line with a past visit, the title fallback, opening |
| E2E `request`, `walk-in`, `offer` | A card opens its case from its facts line; an offer card reads Answer by as its next step |
