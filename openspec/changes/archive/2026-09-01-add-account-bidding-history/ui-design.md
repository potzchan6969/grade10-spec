## Screens

### Grade10 bidding history — `/bids`

No Figma frame was supplied. This is a Path B application-composition change:
the capability spec owns behavior, [tech-design.md](tech-design.md) owns the composition
seams, and the implemented Grade10 page state stories are the review source.
No design-system appearance, token, variant, or size changes are proposed.

### ZZZ

No screen. See `ZZZ receives no bidding-history page` in
[`grade10-site/auction/bidding-history`](specs/grade10-site/auction/bidding-history/spec.md).

## Components

The Grade10 page composes existing `@grade10/design-system` exports only:

- `VStack`, `HStack` — page, summary, and event-row arrangement.
- `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` — **Active** and
  **Completed** selection.
- `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`,
  `CardFooter` — one listing summary and its expanded history.
- `Badge` — standing: `success` for leading/won, `warning` for pending/outbid,
  `error` for failed-only/canceled, and `outline` for lost.
- `List`, `ListItem` — the combined chronological events.
- `Text` — heading, amounts, timestamps, reasons, empty states, and errors.
- `Button` — expand/collapse, retry, and cursor-based **Load more** actions.
- `Link` — route back to an open listing.
- `Skeleton` — initial list and expanded-history loading placeholders.

Listing thumbnails use a semantic `img` with the listing title as alternative
text; there is no design-system image export. No `@grade10/ui` export is used
or added. `@grade10/i18n` supplies the new shared `auctionBiddingHistory`
namespace; that catalog is the only grade10-spec implementation work.

## States

### Grade10 bidding index

- **Active, default** — `A signed-in collector opens active bids`.
- **Completed selected** — `Active and completed activity separate cleanly`.
- **Initial loading** — `Initial loading reserves the bidding list`.
- **Empty Active or Completed** — `An empty filter is explicit`.
- **Index error with retry** — `An index failure is retryable`.
- **Further page loading** — `Loading more preserves entries already shown`.
- **Signed out** — `A signed-out visitor preserves the destination`.

### Listing summary

- **Pending, leading, outbid, won, lost, or canceled** — `Repeated activity is
  grouped under one listing` and `An outbid summary leads to its explanation
  and listing`.
- **Failed-only** — `A failed-only listing remains explainable`.
- **Open and actionable** — `An outbid summary leads to its explanation and
  listing`.

### Expanded combined history

- **Loading beneath a preserved summary** — `Expanding history preserves its
  summary while loading`.
- **History error beneath a preserved summary** — `A history failure preserves
  the listing summary`.
- **Rival movement that outbid the collector** — `A competing bid visibly
  causes an outbid state`.
- **Collector's automatic response** — `An automatic response is attributed to
  You`.
- **Private failed attempt beside unchanged public state** — `A failed attempt
  sits beside the unchanged auction state`.
- **Configured and raised private maximums** — `An automatic maximum is
  configured and raised`.
- **Further history loading** — `Loading more preserves entries already shown`.
- **Pseudonymous rival and private owner view** — `An anonymous reader cannot
  read private history` and `The same account id on another storefront is
  unrelated`.
