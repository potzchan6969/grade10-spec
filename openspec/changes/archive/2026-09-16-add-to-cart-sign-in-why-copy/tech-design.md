## Context

`SignInFlow` resolves its own title — `TranslatedFlow` reads
`tSignIn("title")` from the brand's catalogs — and its `copy` prop is
all-or-nothing, for the consoles that render the flow in English with no
provider above them. There is no way to replace the title alone.

The dialog is opened through `useSignInOverlay`, whose subject is always
`true`: the provider's comment records that the constant value is deliberate,
because a fresh subject on every ask re-renders every trigger and wakes the
effects that ask through it.

The gate this title sits on is
[`require-sign-in-to-add-to-cart`](../require-sign-in-to-add-to-cart/proposal.md).
Until it lands, Add to cart opens no dialog.

## Goals / Non-Goals

**Goals:**

- One entry point says why, and every other keeps the catalog title.

**Non-Goals:**

- A `copy.description` line, a `SignInCard` prop, or a Figma frame — the
  proposal rules all three out.
- A title for bids, visits, or the ZZZ storefront.

## Decisions

### The title is the dialog's subject

`useDialogSubject<string | true>` — `openSignIn({ resume, title })` opens on
the title where one is given and on `true` where none is. The subject stays a
primitive, so `useState` bails out when the same ask arrives twice and the
settling the provider's comment asks for is kept by value equality rather
than by the subject never changing.

- **Rejected: an options object held beside the subject.** The context value
  would change identity on every ask, which is the re-render the provider was
  shaped to avoid.
- **Rejected: a catalog key through the overlay, resolved in
  `TranslatedFlow`.** `signIn.titleAddToCart` is in Grade10's overlay catalog
  and not ZZZ's, so a key cannot be typed in a brand-agnostic package; a
  wrong one would fail when the dialog renders rather than where it was
  written.
- **Rejected: the store surface rendering its own `SignInFlow` with full
  `copy`.** The overlay exists so a site holds one dialog over whatever the
  collector was already doing.

### `SignInFlow` takes `title`, read only when it translates

`TranslatedFlow` uses the prop in place of `tSignIn("title")`. A caller
supplying full `copy` already writes its own title, so the prop does not
reach that branch.

### The site resolves the string

`apps/frontend/grade10` reads `signIn.titleAddToCart` where it wires the ask
and passes the resolved string, so `@grade10/store-frontend` never reads the
`signIn` namespace and the gate's `onSignInRequired` seam carries a plain
title rather than a vocabulary.

## Risks / Trade-offs

- **[The other `openSignIn` callers lose their title]** → `SignInBeforeNavigating`,
  `SessionDecided`, the shell's Sign In and ZZZ's pass no title, so the
  subject stays `true` and the catalog answers, which is the branch that runs
  today.
- **[The title is passed at one of the two Add to cart wirings and not the
  other]** → the listing and the product page wire the same callback in the
  same group, and each capability's scenario is the evidence for its own
  surface.
