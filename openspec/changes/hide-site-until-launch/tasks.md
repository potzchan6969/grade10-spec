## 1. Surfaces table and gates (grade10) (owner: @sean)

The branch already carries `hide-site-until-launch`'s first pass — commits
`4d798f796` and `40e067dcf` — planned for four gated products before Q26 and
Q27 revised the scope. These tasks bring `src/surfaces.ts` to the corrected
three-product-plus-labs shape rather than starting from a clean table.

- [x] 1.1 Drop `"auction"` from `Gate`; remove `gate: "auction"` from
      `auction`, `auctionWatchlist`, `auctionListing`, `auctionWinnerOrder`,
      `auctionInvoice` and `bids`; drop `auction` from `gatesFor`'s return
      (`grade10-site-site-carried-surfaces-SC-20`,
      `grade10-site-site-carried-surfaces-SC-21`,
      `grade10-site-site-carried-surfaces-SC-22`,
      `grade10-site-site-carried-surfaces-SC-24`)
- [x] 1.2 Add `"labs"` to `Gate`, tag `refunds`, `shipping`, `demo`,
      `demoStripe`, `demoServing` and `demoDialog` with `gate: "labs"`
      alongside their `kind: "dev"`, and set `gatesFor`'s
      `labs: deployEnv !== "production"`
      (`grade10-site-site-carried-surfaces-SC-23`)
- [x] 1.3 Fold `DEV_SURFACES` into the ordinary `carried`/`holds()` narrowing
      in `src/routes.ts`, replacing the `import.meta.env?.DEV` branch, and
      make `SERVED_PATTERNS` gate-aware for `kind: "dev"` entries so the
      worker's matcher and `carriedSurfaces` read one narrowing —
      `PRERENDERED_SURFACES`, `RENDERED_SURFACES` and `PUBLIC_SURFACES` stay
      keyed on `kind` alone (`grade10-site-site-carried-surfaces-SC-23`)
- [x] 1.4 Delete `src/auction-shut.test.tsx` — the auction can no longer be
      un-carried — and update `src/surfaces.test.ts` and
      `src/store-shut.test.tsx` for the dropped `auction` gate and the new
      `labs` gate
- [x] 1.5 Verify: `pnpm run typecheck && pnpm run lint && pnpm run test`

## 2. Serving, the route table and the crawler files (grade10) (owner: @sean)

Needs group 1's landed table.

- [x] 2.1 `src/serving/serveAddress.ts` refuses a vault or a booking address
      the way it already refuses a store one — no redirect, the same answer
      under a session and under a language prefix — and no longer refuses an
      auction address (`grade10-site-site-carried-surfaces-SC-28`,
      `grade10-site-site-carried-surfaces-SC-29`)
- [x] 2.2 `src/routes/sitemap.ts` and the robots.txt route drop the auction
      from what they can withhold and add the vault and booking
      (`grade10-site-site-carried-surfaces-SC-32`)
- [x] 2.3 `apps/frontend/grade10/scripts/check-public-pages.mjs` reads the
      corrected gate set — its own assertions are unaffected, since a lab is
      never prerendered
- [x] 2.4 Verify: `pnpm run typecheck && pnpm run test`, then
      `pnpm --dir apps/frontend/grade10 run build:staging` and
      `pnpm --dir apps/frontend/grade10 run build:preview`

## 3. Chrome and front door (grade10) (owner: @sean)

Needs group 1's landed table. Independent of group 2.

- [x] 3.1 Revert the auction conditional `40e067dcf` added to
      `src/pages/marketing/MarketingPage.tsx`'s front door back to
      unconditional, matching every other permanently-carried card — the
      button and the card render whether or not the store, the vault or
      booking are carried (`grade10-site-site-carried-surfaces-SC-24`,
      `grade10-site-site-carried-surfaces-SC-33`)
- [x] 3.2 Revert `src/pages/store/StoreHomePage.tsx`'s `onAuctionClick` back
      to unconditional
- [x] 3.3 The withheld chrome — no navigation item, no cart control, no shop
      column, no front-door button or card — reads the store, the vault and
      booking rather than four products, and the account menu names the
      auctions item unconditionally
      (`grade10-site-site-carried-surfaces-SC-11`,
      `grade10-site-site-carried-surfaces-SC-12`,
      `grade10-site-site-carried-surfaces-SC-13`,
      `grade10-site-site-carried-surfaces-SC-30`,
      `grade10-site-site-carried-surfaces-SC-31`)
- [x] 3.4 Verify: `pnpm run typecheck && pnpm run lint && pnpm run test`

## 4. Manual (grade10-spec) (owner: @sean)

- [x] 4.1 Confirm `docs/prds/products/grade10-site/site/carried-surfaces.md`
      and the auction, vault and appointment pages state what shipped,
      including the corrected lane table — already updated on this branch as
      part of the QA pass
- [x] 4.2 Verify: `pnpm check:manual`
