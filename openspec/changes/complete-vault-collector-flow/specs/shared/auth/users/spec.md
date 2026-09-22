# shared/auth/users Specification

## Purpose

How an operator on either brand lists people in the identity directory, bans
and unbans them, and changes their roles, and how an account holder files and
cancels their own request to be forgotten. Listing and ending their sessions
is `shared/auth/sessions`. Recording those actions is `shared/auth/audit`.
Auction bidder bans belong to auction, not here.

## Feature set

- Directory
  - Grant-gated list: only `user:list` sees accounts; search matches email or name without letter case; open by user id
  - Narrowed list: elevated or user population, a named elevated role, status, and verification combine; caller chooses order (newest first when none)
  - Banned remain: a banned account stays in the directory
- Ban and unban
  - Stops money and sign-in: a ban ends sessions and refuses new ones; unban restores sign-in
  - No ban of admin: no caller bans an account that holds `admin` (peers included); self-ban stays refused
- Role changes
  - Set-role edits: clearing operator roles leaves a user; own account included
  - Peer strip refused: an operator cannot remove `admin` from another admin
  - Self-strip: an admin may remove their own `admin` when not last
- Erasure requests
  - One open request: a person holds one at a time, and it closes once
  - Filed by the account holder: from a product's own data page, and cancelled
    there inside the window before it matures
  - A self-filed request bans nothing: the person can still sign in, because
    cancelling is what they would sign in for
  - An operator's filing bans: filed from the directory, and a filing over a
    self-filed request becomes the operator's with the ban applied
  - Asked twice is asked once: a second filing answers the open request, a
    cancel with nothing open changes nothing, and a cancel lifts only a ban the
    filing applied
