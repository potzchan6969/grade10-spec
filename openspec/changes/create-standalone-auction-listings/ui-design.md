## Screens

**No Figma frame exists for either surface.** Layout source: the live
grade10 admin Listings panel and the live Test panel's Campaign tab on `main`.
Behavior: [`grade10-admin/auction/listing`](specs/grade10-admin/auction/listing/spec.md) (delta).

### Listings section — Create listing control

Same panel as today. A Plus icon button labeled "Create listing" appears in
the section heading row for an operator with `auction:operate`. Activating it
opens the existing `ListingEditor` with no campaign pre-filled. The Campaign
column in the table shows "-" (the existing `campaignLabel` fallback) for rows
with no campaign.

### Test panel — Listings tab

A second tab beside "Campaign" in the existing `Tabs` bar. The tab is labeled
**Listings**. Its content mirrors the Campaign tab's listing checklist — same
fixture ids, same per-fixture instance counter, same Select all button — but
without the campaign name field or campaign status selector.

**Add listings** button seeds the selected fixtures as standalone listings
(no campaign). When no fixture is selected the button is disabled. When seed
is in progress the button shows pending state.

**Drop listing** section below: a `Select` listing-of-existing-standalones,
followed by a **Drop listing** destructive button with a confirm dialog
matching the Campaign tab's "Drop campaign" pattern. When no standalone
fixtures exist the select is absent and a "No standalone fixture listings
yet." message shows.

## Components

From `@grade10/frontend-console` (all already used in the same file or panel):

- `IconButton`, `Plus` (Lucide) — Listings section Create listing button
- `Tab`, `TabPanel` — Listings tab in Test panel
- `CheckList`, `Check`, `Badge`, `Text`, `Inline`, `Button`, `Select`,
  `Stack`, `Notice` — Test panel Listings tab content (same exports the
  Campaign tab already uses)

From `@grade10/frontend-dialog/confirm`: `useConfirm` — Drop listing
confirmation (same as Campaign tab's Drop campaign confirm).

From `@grade10/ui`: **none new.**

## States

### Listings section

- **Create offered** — `grade10-admin-auction-listing-SC-68`: heading row shows Plus button
  for `auction:operate`.
- **Create not offered** — `grade10-admin-auction-listing-SC-63`: Plus button absent.
- **Editor opens empty** — `grade10-admin-auction-listing-SC-69`: Campaign control blank.
- **Draft / create / publish with no campaign** — `grade10-admin-auction-listing-SC-58`,
  `grade10-admin-auction-listing-SC-59`, `grade10-admin-auction-listing-SC-60`.
- **Unattached row** — `grade10-admin-auction-listing-SC-62`: campaign column shows "-".

### Test panel Listings tab

- **Tab visible** — `grade10-admin-auction-listing-SC-64`.
- **Seed success** — `grade10-admin-auction-listing-SC-65`: notice text, instance counts
  update; `campaignId` absent from result.
- **No standalone listings yet** — `grade10-admin-auction-listing-SC-67` pre-state: select
  absent, message shown.
- **Drop success** — `grade10-admin-auction-listing-SC-67`: notice text, listing removed from
  drop select.
