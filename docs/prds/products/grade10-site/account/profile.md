---
title: Profile
spec: grade10-site/store/account-profile
order: 1
---

The profile is what a collector says about themselves in the store, on their
own account page and shown to nobody else. Grade10 and ZZZ show the same page.

## Fields

1. **Display name** — required, at most **80** characters, trimmed; two
   collectors may share one
2. **Bio** — optional, at most **500** characters, trimmed
3. 🚧 **Avatar** — an image of the collector's own, cropped square at
   **512 px**; with none, the display name's first letter or digit stands in,
   in any script, upper-cased, as in the account menu: `Kit Lam` shows `K`,
   `陳大文` shows `陳`
4. **Email** — the address signed in with, shown and not editable here
5. 🚧 **Member since** — the date of the first save; absent until then
6. ❓ **Mobile number** — what the till's phone lookup finds a member by, once
   numbers are verified; product confirms which change brings it to the page —
   [Shopify Integration](/p/grade10-site/loyalty/shopify-integration)

- ❓ **Avatar file** — product confirms the limit a collector meets: a JPEG,
  PNG or WebP up to **5 MB**, judged on the file they pick, or any image the
  browser can read
- ❓ **Avatar address** — product confirms who can open the image: anyone
  holding its unguessable address, with no sign-in, so it can be cached; or
  only the signed-in collector, on every view
- ❓ **Account picture** — product confirms whether the picture an account
  already has, such as a Google sign-up's, stands in before the letter
- ❓ **Earlier saves** — product confirms whether a profile first saved before
  member-since was recorded shows no date until its next save, or the date its
  record was made

## Before the First Save

A collector who has never saved still sees every field, filled from what
sign-in already knows, and an empty field says what it is for.

- **Display name** — the name the till and the wallet pass show: the account
  name, else the address before the `@` —
  [Member Card in a Wallet](/p/grade10-site/loyalty/wallet-member-card)
- ❓ **Saving the default** — product confirms whether a save that leaves the
  prefilled name untouched keeps it as the collector's chosen name, or leaves
  it following the account name

## Editing

- **Explicit** — edit, then save or cancel; a save that would clear the
  display name is refused, and a failed save keeps what was typed
- 🚧 **Avatar apart** — the avatar is saved on its own, so a refused name never
  undoes an accepted image
- 🚧 **Avatar first** — a refused or failed image saves nothing else; the form
  keeps the typed text and the chosen image for one retry

## Address

- **URL** — `grade10.com/profile`; signed out, it asks for sign-in
- ❓ **Way in** — the account menu offers no Profile item; product confirms
  how a collector reaches the page: from the menu once this page ships, from
  membership, KYC and order pages, or by the typed address alone

## Designs

- ❓ **Avatar and email** — no frame draws the avatar, its choose and remove
  controls, its preview or the email row; design confirms building them from
  the requirements, or supplies frames
- ❓ **Bio field** — one line for up to 500 characters, since the design
  system has no multi-line field; design confirms

::story{id="store-profile-profilecard--default" title="The profile, read"}

::story{id="store-profile-profilecard--editing-body" title="The profile, being edited"}

::story{id="store-profile-profilecard--error-state" title="A read that failed"}

:::detail{title="Product decisions" for="pm"}
A collector arrives at a profile to adjust, never a blank form to fill, so the
page is worth opening before they have saved anything.

**Measurement.**

| Signal | Definition | Owner |
| --- | --- | --- |
| Profiles made their own | Share of signed-in collectors who save a display name and set an avatar within 7 days of first sign-in. Unmeasured; the first delivery sets the baseline. | Product |

**Decisions.**

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| One name | Decided | The profile, the till and the wallet pass show one name: the name chosen for the shop, else the account name, else the address before the `@`; 會員 at the till, and a pass left as it was, when the account service cannot give one. Chosen over showing no name, and built in grade10 `packages/grade10-store/backend/src/services/memberName.ts:7-23` (`ea91833d32`). | Product |
| Member since | Decided | The first save, never the date the store first wrote a record for the account, which can come from a webhook the collector never triggered. | Product |
:::
