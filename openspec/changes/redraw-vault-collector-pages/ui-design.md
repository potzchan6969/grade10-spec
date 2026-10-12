# UI: Redraw vault collector pages

The design reference is the Figma file `Grade10-DS-2026` and the Storybook workbench, where the surfaces are being composed from `@grade10/design-system` primitives and `@grade10/ui` blocks. Figma owns layout; the capability spec owns behavior.

## Screens

### Asset Detail

- Graded: [7029:2](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=7029-2)
- Raw: [7054:7072](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=7054-7072)
- Blocks: [7025:2](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=7025-2), with annotated sub-frames Asset Summary `7054:6854`, Asset Details `7054:6185`, Asset Custody & Documents `7054:5063`
- Gallery annotation: [7029:76](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=7029-76)
- Stories: `pages-vault-asset-detail--graded`, `pages-vault-asset-detail--raw`; block stories `vault-asset-summary--*`, `vault-asset-details--*`, `vault-asset-custody-documents--default`

### Portfolio

- Page: [7068:7718](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=7068-7718)
- Stats card: `7102:1514` — provisional; the stats treatment is still being designed.
- Blocks: Vault Asset Card [7068:10249](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=7068-10249) with Vault Asset status [7068:9960](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=7068-9960), Vault Asset List [7077:10911](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=7077-10911)
- Stories: `pages-vault-portfolio--*`; block stories `vault-asset-status--*`, `vault-asset-card--*`, `vault-asset-list--*`, `vault-portfolio-stats--*`

### Request Retrieval

`awaiting:` figma — the dialog frame has not been drawn; the workbench story `vault-request-retrieval-dialog--*` stands in until it is: the item row, the pickup location, and three next steps — review, pickup window, collect in store with matching ID.

### Intake Tracker

`awaiting:` figma — no frame drawn; the workbench story `pages-submissions--in-progress` stands in until it is.

### Book a Visit

`awaiting:` figma — no frame drawn; the workbench story `pages-appointment-book-visit--default` stands in until it is.

## Components

Asset Detail composes, all existing:

- `@grade10/design-system` — `Badge`, `Card`, `Alert`, `Button`, `Link`, `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`, `Stepper`, `Step`, `Text`, `Breadcrumbs`
- `@grade10/ui` — `ListingLotGallery` (`ListingLotGalleryImage` with `label`, rendered beside the counter per `7029:76`)
- Page-local in `apps/preview/src/pages/` — `VaultAssetSummary`, `VaultAssetDetails`, `VaultAssetCustodyDocuments`, `VaultRequestRetrievalDialog`

Portfolio composes, all existing:

- `@grade10/design-system` — `Tabs` variant `list` with `Badge` counts, `DropdownMenu` + `DropdownMenuItem`, `Button`, `Badge`, `Card` (`padding={false}`)
- Page-local in `apps/preview/src/pages/` — `VaultAssetList`, `VaultAssetCard`, `VaultAssetStatus`, `VaultPortfolioStats`, `ActiveIntakeAlert`

Flagged work, already landed in this repo pending this change's tasks:

- `Alert` honors a custom `icon` on any `status` (the `warning` shell carries `TrendUp` for Value Potential).
- `ListingLotGalleryImage` gains `label`; the counter reads `1 / 3 · Front`.
- Document rows whose `href` is external render the action as an anchor opening a new tab with `ArrowSquareOut` (PSA cert report → psacard.com).

## States

### Asset Detail

| State | Shows | Anchor |
| --- | --- | --- |
| Graded | Grade, Cert Number with `Verify` link, Vault Storage ID, Location, Condition; custody log and documents tabs | `grade10-site-vault-portfolio-US-02` |
| Raw | No grade/cert rows; `Value Potential` alert inside the estimate card with `Submit for Grading` | `grade10-site-vault-portfolio-US-05` |
| Cert verification | `Verify` link opens the institute's cert page in a new tab | `grade10-site-vault-portfolio-US-03` |
| Custody log | Vertical `Stepper`; latest entry `completed`, history `upcoming`; the store listing or auction listing date appears as the latest entry on `Listed`/`Live Auction` assets | `grade10-site-vault-portfolio-US-02` |
| Documents | One `Alert` row per document; external report opens a new tab, downloads use `PDF`/`ZIP` actions | `grade10-site-vault-portfolio-US-02` |
| Request retrieval | `Request Retrieval` link opens the retrieval dialog; submitting raises a success `Toast` (`Retrieval requested`) and turns the page Retrieval Pending | `grade10-site-vault-portfolio-US-06` |
| Retrieval pending | `Retrieval Pending` outlined `Badge`, no icon — same treatment as the card overlay; `Retrieval requested` leads the custody log; list CTAs and `Request Retrieval` hidden until the operator decides (extrapolated — no Figma frame) | `grade10-site-vault-portfolio-US-06` |
| Listing | `List for Auction` and `List for Sale` fill the row evenly | `grade10-site-vault-portfolio-US-04` |
| Soft launch | No compare figure (`showEstimateChange` off), no listing CTAs | `grade10-site-vault-portfolio-US-02` |
| Auction unavailable | `List for Auction` hidden while `List for Sale` stays; each listing flag ships on its own timeline | `grade10-site-vault-portfolio-US-04` |
| Sale unavailable | `List for Sale` hidden while `List for Auction` stays | `grade10-site-vault-portfolio-US-04` |
| Listed | `LISTED PRICE` and `View Listing` link to the store product page; list CTAs and `Request Retrieval` hidden — the item is locked while listed (extrapolated — no Figma frame) | `grade10-site-vault-portfolio-US-04` |
| Live auction | `BID PRICE` and `View Auction` link to the auction lot; list CTAs and `Request Retrieval` hidden — the item is locked while bidding is live (extrapolated — no Figma frame) | `grade10-site-vault-portfolio-US-04` |

### Portfolio

| State | Shows | Anchor |
| --- | --- | --- |
| Status badges | `Listed` and `Live Auction` overlay the card image as a brand `Badge`, `Retrieval Pending` as an outlined `Badge`; In Vault shows no badge | `grade10-site-vault-portfolio-US-01` |
| In Vault tab | Includes `Retrieval Pending` items awaiting admin approval (annotation); count includes them | `grade10-site-vault-portfolio-US-01` |
| Empty tab | A tab with zero items is hidden (annotation) | `grade10-site-vault-portfolio-US-01` |
| Tab sorts | All/In Vault: Highest est. value, Lowest est. value, Recently added. Live Auction: Ending Soonest (default), Highest Bid. Listed: Recently Listed (default), Highest Current Price. Each tab remembers its sort for the session | `grade10-site-vault-portfolio-US-01` |
| Card price | Label and amount follow status: `INTAKE ESTIMATE`, `BID PRICE`, `LISTED PRICE` | `grade10-site-vault-portfolio-US-01` |
| Card click | Every card opens the asset detail page, including Retrieval Pending | `grade10-site-vault-portfolio-US-02` |
| Intake exclusion | Submission/intake items never appear in holdings until vaulted | `grade10-site-vault-portfolio-US-01` |
| Intake in flight | Warning `Alert` with `Track Progress`; sits above the list and does not count as a holding | `grade10-site-vault-portfolio-US-01` |
| Stats | Total estimated value, total items, storage fees — provisional design (`7102:1514`) | `grade10-site-vault-portfolio-US-01` |
