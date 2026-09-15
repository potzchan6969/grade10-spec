## Context

The title is written in two places and read in two, with two copies of the
word: the store's online draft order and settlement, and the till extension's
cart write and every read of its points slot. The store matches the title
trimmed and ignoring letter case; the till matches it exactly. The store's
order id attribute is copied the same way.

A till that meets a points discount it does not recognise treats it as
somebody else's: on a strip it leaves the discount on and takes the order id
off, so money comes off a sale nothing can bind or charge. That is what the
rollout has to rule out.

## Decisions

1. **One module holds both marks a sale carries.** A new import-free
   subpath of the store contracts holds the order id attribute, the title the
   writers use, and the one check every reader calls: the title, trimmed and
   ignoring letter case, is "deduction from points" or "points". Both copies
   of the title and of the attribute go.
   - Import-free, like the eligibility subpath the till already imports, so
     the till's size budget does not move.
   - Rejected: a till copy and a store copy held together by a test — two
     sources, and the test is one more thing to keep.

2. **Readers first, writers second, as two releases.**
   - **Release 1:** every reader accepts both titles; both writers still
     write "Points". Store deployed, till version published and activated at
     every location.
   - **Release 2:** both writers write "Deduction from Points", once every
     location's manager confirms release 1 is active, and the audit rows from
     every location show no older till version for 7 days.
   - The online writer waits too: POS can load a draft made online or at
     another location, and a manager activates till versions per location.
   - The audit rows only see a till that calls the gateway, so the managers'
     confirmation is the gate and the rows are its check.
   - Rejected: raising the minimum client version in one release. A refused
     till still reads the cart and runs its strip from cart signals, with no
     gateway call.

3. **The store accepts "Points" forever.** Paid orders keep their discount
   rows; refunds and later reads meet the old title for as long as the orders
   exist.

4. **The till matches ignoring letter case, as the store does.** Ownership
   still needs the order id on the cart, so a staff-keyed "points" changes
   nothing it could not already do with "Points".

5. **The till panel's own row label is not the discount title.** It becomes
   its own till copy, unchanged in wording.

6. **Recorded tablet payloads stay as recorded.** They become the proof that
   a cart titled "Points" is still ours; a new recording is added once
   release 2 reaches the staging tablet.

## Risks / Trade-offs

- **A till rolled back past release 1 after release 2** meets carts it does
  not recognise. → Release notes for managers say release 1 is the oldest
  version that may be activated.
- **POS may cut a 21-character title** on the cart row or the receipt.
  → ❓ Checked on the staging tablet before release 2 reaches production; a
  cut title goes back to the owner.
