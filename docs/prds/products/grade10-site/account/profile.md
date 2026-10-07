---
title: Profile
spec: grade10-site/store/account-profile
order: 1
---

The profile is what a collector says about themselves in the store, on their
own account page and shown to nobody else. Grade10 and ZZZ show the same page.

## Fields

1. **Display name** - required, at most **80** characters, trimmed; two
   collectors may share one
2. **Bio** - optional, at most **500** characters, trimmed
3. 🚧 **Avatar** - an image of the collector's own, cropped square at
   **512 px**; with none, the display name's first letter or digit stands in,
   in any script, upper-cased, as in the account menu: `Kit Lam` shows `K`,
   `陳大文` shows `陳`, `@kitlam` shows `K`, `🃏🃏` shows `?`
4. **Email** - the address signed in with, shown and not editable here
5. 🚧 **Member since** - the date of the first save; absent until then

- **Length** - counted as the field counts it: a Chinese character is one, an
  emoji can be two
- 🚧 **Avatar file** - any image the browser can read, whatever its type or
  size, is made square at **512 px** before it is sent; a file the browser
  cannot read is refused
- ❓ **Avatar address** - Product (@tangconst) confirms who can open the
  image: anyone holding its address, with no sign-in, so it can be cached; or
  only the signed-in collector, on every view. The address is the profile's
  own and cannot be worked out from the image
- 🚧 **Account picture** - the picture an account already has, such as a
  Google sign-up's, never stands in; the letter does
- 🚧 **Earlier saves** - a profile saved before member-since was recorded
  shows no date until its next save, which it then dates

## Before the First Save

A collector who has never saved still sees every field but member-since,
filled from what sign-in already knows, and an empty field says what it is
for.

- **Display name** - the name the till and the wallet pass show: the account
  name, else the address before the `@` -
  [Member Card in a Wallet](/p/grade10-site/loyalty/wallet-member-card)
- 🚧 **A name nobody chose** - the placeholder an older record carries is never
  shown as the collector's; the default stands in, at the till and on the pass
  too
- 🚧 **Saving the default** - a save that leaves the prefilled name as shown
  keeps no name as the collector's, so it still follows the account name

## Editing

- **Explicit** - edit, then save or cancel; a save that would clear the
  display name is refused
- 🚧 **Avatar apart** - the avatar is saved on its own, so a refused name never
  undoes an accepted image
- 🚧 **Avatar first** - a refused or failed image saves nothing else; the form
  keeps the typed text and the chosen image for one retry
- 🚧 **Replaced or removed** - the old image stops answering at its address,
  and storage deletes it once it is a day old

## Failures

- **A failed save** - keeps what was typed
- 🚧 **A failed read** - says the profile could not be loaded, shows no field,
  and offers to try again

## Address

- **URL** - `grade10.com/profile`; signed out, it asks for sign-in
- **Way in** - the account menu offers Profile first wherever this page is
  carried - [Page Shell · Account Menu](/p/grade10-site/site/page-shell#account-menu)

## Designs

- 🚧 **Avatar and email** - built from the requirements on the design system's
  avatar, with no frames: the avatar, its choose and remove controls, its
  preview and the email row
- 🚧 **Bio field** - several lines, in the design system's own multi-line
  field; the read view shows the lines as typed

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
| One name | Decided | The profile, the till and the wallet pass show one name: the name chosen for the shop, else the account name, else the address before the `@`; 會員 at the till, and a pass left as it was, when the account service cannot be reached for a member with no name chosen for the shop. Chosen over showing no name, and built in grade10 `packages/grade10-store/backend/src/services/memberName.ts:7-23` (`ea91833d32`). | Product |
| Member since | Decided | The first save, never the date the store first wrote a record for the account, which can come from a webhook the collector never triggered. | Product |
| Mobile number | Decided | Not on this page: the change that verifies numbers brings it here, since the till's phone lookup waits on that verification. Rejected adding it here, which specifies number entry without verification. | Product (@tangconst) |
:::
