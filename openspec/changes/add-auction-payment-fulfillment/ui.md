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

- **Live and Ending soon** — `A published listing still taking bids is Live`,
  `A listing inside the last hour is Ending soon`, and `Ending soon does not
  look like Live` define the labels and distinct treatments.
- **Payment outcomes** — `A won listing waiting for card capture is Awaiting
  payment`, `Stripe capture and manual collection are different queue rows`,
  and `Paid via Stripe does not look like Paid via Manual` define the mutually
  exclusive labels.
- **Filtered** — `An operator works only listings awaiting wire` defines a
  ready filtered queue.
- **Needs attention** — `Paid via Stripe is highlighted as needing action` and
  `Awaiting wire is highlighted as needing action` define the extra row
  treatment. The remaining attention outcomes follow the same requirement.
- **Loading, empty, and transport error** — no new capability-specific visual
  state is defined. The queue keeps the admin surface's existing Skeleton,
  empty Text, and error Text treatments; none changes an outcome or invents a
  successful row.

### Auction listing detail

- **Won listing** — `An operator opens a won listing` defines the complete
  facts, money, winner, payment, shipment, and trail composition.
- **No winner** — `A listing without a winner has no winner block` defines the
  edge state.
- **Winner contact** — `The winner's email is the emphasized contact`, `A
  shipment operator can record a missing delivery address`, and `A payment
  operator sees winner contact without the ban grant` define the contact and
  missing-address states.
- **Payment actions** — `An operator records that the winner will pay by wire`,
  `Collection after a wire becomes Paid via Manual`, `An operator records
  payment collected offline`, and `A second paid attempt is refused` define
  enabled and terminal states.
- **Shipment actions** — `An operator records that shipment started after
  Stripe payment`, `An operator records that shipment started after manual
  payment`, `An operator records that shipment completed`, `Shipment cannot
  start before a paid outcome`, and `Completion cannot skip Started` define
  the milestone controls.
- **Trail and comments** — `Stripe paid and a later comment share one trail`,
  `Manual paid and Stripe paid are distinguishable on the trail`, `An empty
  comment is refused`, and `A comment cannot be taken back` define ready,
  refusal, and immutable states.
- **Grant-disabled** — `A staff operator sees payment controls disabled` and
  `A finance operator sees shipment controls disabled` require visible disabled
  controls; `An admin can do both` defines the enabled combined path.
- **Loading and transport error** — no new capability-specific visual state is
  defined. The detail keeps the admin surface's existing Skeleton and error
  Text treatments and retains the selected listing so a retry does not return
  the operator to a different row.
