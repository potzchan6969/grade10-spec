# Design: Who is signed in

Capability deltas:
[`shared-auth/session`](specs/shared-auth/session/spec.md),
[`shared-auth/sign-in`](specs/shared-auth/sign-in/spec.md).
Motivation: [proposal.md](proposal.md) — Why.

## Context

One identity worker per brand. Sign-in pages are per app. Constraints:
`docs/architecture/account-data.md`, `docs/architecture/tracking.md`.

## Goals / Non-Goals

- **Goal:** one identity per brand; products key by user id.
- **Non-goal:** roles, bans, a second factor — sibling changes.

## Decisions

### Sign-in is passwordless, one account per email

Emailed link, emailed code, and Google when the brand has a client. A
product that has verified an email — store after anonymous checkout — may
also create that account or enter it and sign the person in. First success
creates the account. Email is unique across every path: case-folded as
submitted, not folded for plus-tags or provider aliases. Google is absent
when the brand has no client.

Verification values live in the identity store with a TTL so a used or
expired link or code cannot sign in. A new send invalidates earlier unused
links and codes for that address. Three wrong codes kill that code.
Google creates or enters an account only from a provider-verified email.
A sign-in location off the brand, or none, is ignored (`account-data.md`).
A first send that goes out looks like a sent link, whether the address is
new or not.

*Alternatives:* passwords — rejected. Separate accounts per method —
rejected. A shared Google client across brands — rejected. An unverified
Google email as identity — rejected. The client names an email and is
signed in — rejected, only a product that already verified the email may
do that. Checkout calling auth from the browser — rejected, the store
worker is the caller. An open redirect after sign-in — rejected. Folding
plus-tags or Gmail dots into one account — rejected, that is provider
magic and can merge people who typed different addresses.

### Sign-in email caps are per address, in the identity store

One sign-in email — link or code — per email address per sixty seconds,
visible to every isolate. A second send in the window sends nothing; the
surface asks them to wait, not that the mail failed. After a send that
went out, resend waits out the window.

*Alternatives:* five sends per minute — rejected, that still fills an
inbox. Separate caps for link and code — rejected, both still hit the
inbox in one minute. Per-IP isolate memory as the spec — rejected, the
spec is per address. Showing the same copy as a failed send — rejected, a
wait is not a delivery failure.

### Sign-in covers the brand

Each brand has its own identity worker. How that sharing is stored is not
part of the spec.

*Alternatives:* one cookie domain for both brands — rejected.

### Products key by user id

Every product stores user id, never email, as the join key. Showing
another person is a lookup by user id.

*Alternatives:* email as the join key — rejected (`account-data.md`).

### Analytics identity comes from who is signed in

The product backend stamps Mixpanel identity from who is signed in: user
id when signed in, device when not. The wire has no user field. A
signed-in event also carries the device so Mixpanel can join the anonymous
history.

*Alternatives:* the client names the user — rejected. Auth-named events
(signed in, signed out) — rejected, this change stamps identity; products
own their catalogs (`tracking.md`).

## Risks / Trade-offs

- **A host added under the brand domain inherits sign-in** → putting a
  host on that domain is an access grant (`account-data.md`).

## Migration Plan

Who a person is, then how they sign in, then sign-in on the sites, then
identity in every product.

## Open Questions

None.
