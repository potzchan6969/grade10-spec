# Tech design

## Context

See `proposal.md` — Why. The requirements are the two deltas beside it.

What the card does today, and why the defect is structural rather than a
missed prop:

- **The control follows the sold-out condition alone.** `ProductCardImage`
  decides whether to draw the cart from `!soldOut`, so any consumer that does
  not sell gets one anyway.
- **The handler is optional and invoked optionally.** It is passed straight
  through to the stepper, which calls it if it is there. A consumer supplying
  none gets a control that draws, takes the press and reports nowhere.
- **The words are required.** The copy type demands four cart strings —
  the add affordance and the three stepper controls — of every consumer,
  including one that renders none of them.

The front door is the consumer that exposes all three: it supplies the words
and no handler, and the row has never sold anything.

## Goals / Non-Goals

**Goals**

- Make a swallowed press unrepresentable rather than merely absent here
- Leave the listing's cart exactly as it is
- Let a surface that does not sell supply neither a handler nor the words

**Non-Goals**

- A `sellable` or `showCart` flag — see Decisions
- Any change to the stepper's own behaviour once it is drawn
- Wiring the front door to the cart, which the proposal rules out

## Decisions

### The handler's presence is the signal

`ProductCardImage` draws the cart control only when a quantity-change handler
was supplied and the product is not sold out.

- **Why** — it makes the defect impossible to reproduce: there is no state
  where a control is drawn over nothing. A consumer that wants to sell wires
  the handler it needs anyway, so the signal costs it nothing.
- **Rejected** — a `sellable` boolean beside the handler. It adds a second way
  to say one thing, and the two can disagree: `sellable` with no handler is the
  bug again, wearing a name.
- **Rejected** — throwing or warning when the handler is missing. It turns a
  contract into a runtime surprise, and the sensible behaviour is obvious
  enough to be the default.

### The cart words become optional

The four cart strings move to optional on the card's copy type. `soldOut` and
`sale` already are.

- **Why** — a surface that draws no cart has nothing to name, and the shared
  spec already holds that nothing visible is invented by the listing. Requiring
  words for a control that will not render invites exactly the placeholder copy
  that rule exists to prevent.
- **Rejected** — leaving them required. The front door would supply four
  strings it never shows, which is how it came to supply cart copy without a
  cart in the first place.
- **Compatibility** — required to optional is additive; the listing passes all
  four and is unchanged.

### The front door supplies the two conditions it already reads

Sold-out and former price come from the same helpers the listing uses, over the
product the row already holds.

- **Why** — one rule for what counts as sold out and what counts as a markdown,
  read the same way on both surfaces. A compare-at at or below the current
  price is not a saving, and that judgement already lives in the domain.
- **Rejected** — deriving either in the page. Two surfaces would then answer
  the same question their own way, which is what this change is fixing.

## Risks / Trade-offs

- **A consumer outside this repository relies on the control appearing without
  a handler** → there are two consumers, both here, and the listing supplies
  one. The change is stated as breaking in the proposal so a reviewer sees it
  rather than discovering it.
- **A surface means to sell and forgets the handler** → it now renders no cart
  at all, which is visible in its own tests and stories rather than silent at
  the press. The failure moves from a shopper to the engineer.
- **The Boneyard capture and the stories default a handler** → they are
  consumers too, and keep their cart because they keep supplying one. Nothing
  about the drawn control changes for them.

## Migration Plan

No data, no deploy sequencing. The component change lands in `grade10-spec` and
reaches the site through a submodule bump; the front door's own change rides
the same bump or a later one, since the card renders no cart from the moment
the handler is absent — which it already is.

Rollback is the revert of the bump. Nothing is stored, and no address changes.
