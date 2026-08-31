# UI: Auction payment and fulfillment

## Screens

### Auction listing queue

**No Figma frame exists for the Grade10 admin Auction queue.** This change
replaces the current operator stand-in with an app-owned assembly built from
existing design-system primitives. A future visual design can replace that
assembly without changing the post-sale feature contract.

### Auction listing detail

**No Figma frame exists for the Grade10 admin Auction listing detail.** It is
an app-owned assembly reached from the queue; the
[post-sale capability](specs/grade10-auction/post-sale/spec.md) owns its
behavior and [design.md](design.md) owns its data and security boundaries.

## Components

Both screens compose existing exports from `@grade10/design-system`:

- `VStack`, `HStack`, `Stack` — queue controls, row contents, detail sections,
  action groups, and trail entries.
- `Text` — listing facts, winner contact, payment/shipment facts, timestamps,
  empty copy, and refusal copy.
- `Badge` — every full outcome label. Existing variants are assigned by the
  app to the outcome families; Paid via Stripe and Paid via Manual receive
  different variants.
- `Card` — the winner, payment, shipment, and trail sections on detail.
- `Button` — opening a listing, posting a comment, payment actions, shipment
  actions, retry capture, and returning to the queue. A forbidden action stays
  rendered with `disabled`.
- `Select` — the closed-set outcome filter.
- `TextInput` — the offline formatted delivery address.
- `Skeleton` — the existing admin loading treatment while queue or detail data
  is unresolved.
- `Dialog` — confirmation before a money or shipment milestone mutation.

Nothing from `@grade10/ui` and no new design-system export, variant, or token is
required. A comment is entered through a page-local semantic `textarea`
because the design system exports no multiline text control; it uses existing
input border, foreground, background, focus, and spacing tokens rather than
adding a variant in the application repository. Money uses
`@grade10/utils/money` from integer minor units and an ISO 4217 currency code.

## States

### Auction listing queue

- **Live and Ending soon** — `A listing inside the last hour is Ending soon`
  and the Listing outcomes table define the labels and families.
- **Payment outcomes** — `Stripe capture and manual collection are different
  outcomes` defines the mutually exclusive paid labels.
- **Filtered** — `An operator works only listings awaiting wire` defines a
  ready filtered queue.
- **Needs attention** — `Awaiting wire is highlighted as needing action` and
  the Needs action column define the extra row treatment.
- **Loading, empty, and transport error** — no new capability-specific visual
  state is defined. The queue keeps the admin surface's existing Skeleton,
  empty Text, and error Text treatments; none changes an outcome or invents a
  successful row.

### Auction listing detail

- **Won listing** — `Operator opens a won listing` defines the complete
  facts, money, winner, payment, shipment, and trail composition.
- **No winner** — Winner fields: the block is shown only when there is a
  winner.
- **Winner contact** — `Winner email is the contact without Stripe
  identifiers` defines the contact block. `Recording an address does not
  ship the listing` defines the missing-address state on shipment.
- **Payment actions** — `Wire request releases the card hold`, `Manual
  collection marks Paid via Manual and releases the hold`, and `A second paid
  attempt is refused` define enabled and terminal states.
- **Shipment actions** — `Shipment follows paid, then started, then
  completed` and `Shipment cannot skip ahead` define the milestone controls.
  `Operator closes out a won listing` is the combined paid-then-shipped path.
- **Trail and comments** — `Stripe paid and an operator comment share the
  trail` defines ready trail composition. Empty and immutable comments stay
  in the Trail fields requirement.
- **Grant-disabled** — `Staff cannot record payment` and `Finance cannot
  record shipment` require visible disabled controls for a missing grant.
  `Operator closes out a won listing` is the enabled combined admin path.
- **Loading and transport error** — no new capability-specific visual state is
  defined. The detail keeps the admin surface's existing Skeleton and error
  Text treatments and retains the selected listing so a retry does not return
  the operator to a different row.
