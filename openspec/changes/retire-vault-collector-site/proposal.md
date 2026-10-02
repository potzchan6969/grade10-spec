**Author:** @ecchochan - 2026-10-02

## Why

The collector's vault screens on the grade10 site were built ahead of their
design: the case list, the request wizard, one case's page, the identity
check, Your data and the Vault item in the header. The owner has decided to
take them off the site and have @tangconst design them again from the backend
as it stands (decided 2026-10-02). The worker, the console, the emails, the
PDFs and the signing ceremony on the shop's iPad stay as they are.

**Metric:** the collector's vault addresses answer the not-found surface on
every lane, and every vault behaviour a kept case proves is walked against
the worker's API rather than a site page.

## What Changes

- **Off the site** - `/vault`, `/vault/new`, `/vault/cases/:caseId`,
  `/vault/verify` and `/profile/data` stop answering, the profile page loses
  its Your data button, and the header loses Vault. `/vault/sign`, the signing
  ceremony, stays.
- **Off the store** - the `VaultCases`, `VaultCasesEmpty` and
  `VaultAcceptOfferDialog` blocks, their stories, fixtures and exports, and
  the catalog keys only those screens read. `vault.status`, `vault.category`
  and `vault.ceremony` stay, with every email's and PDF's words.
- **The requirements keep the behaviour** - what the collector reads and does
  on their own case stays a contract of the worker, stated without a screen.
  A requirement that is only a screen's layout, words or controls is removed.
- **The suites keep what the worker proves** - a case whose subject is a
  removed screen is deprecated, never deleted; a case that proves the worker
  stays and is walked against the API.
- **Until the screens ship** - a mailed link keeps its address and lands on
  the not-found surface, and a walk-in draft waits and ends on its own clock;
  the screens themselves are left open on the manual for @tangconst.

Goals and non-goals are in [`decisions.md`](decisions.md).

## Capabilities

### Modified Capabilities

- `grade10-site/vault/case-intake` - opening, reading back and sending a
  request stated as the worker's contract, with no wizard.
- `grade10-site/vault/case-lifecycle` - the collector's own moves, an ended
  case's reason, the fact a case meets and its stage stated as reads and acts
  on the collector's own case, with no case page.
- `grade10-site/vault/valuation-and-offer` - answering the live offer, and a
  refused answer, stated without the case page's confirmation.
- `grade10-site/vault/loan-and-settlement` - the repayments, the reminders
  still to come and the forfeiture notice stated as the borrower's read.
- `grade10-site/vault/visit-booking` - booking, moving and the calendar file
  stated without the case page's picker.
- `grade10-site/vault/documents-and-signing` - a signer's copies and the one
  download stated without the case page.
- `grade10-site/vault/retention-and-erasure` - Your data becomes the
  collector's own record: what the worker answers and accepts, with no page.
- `shared/ui/vault-case` - the store carries no vault collector block; the
  one requirement left says so.
- `grade10-site/site/carried-surfaces` - the vault's set is the signing
  ceremony alone.
- `grade10-site/site/navigation` - the sign-in table names no vault page,
  and its scenarios ask at another surface.

## Impact

- **Pages** - marked first: [Collector Pages](../../../docs/prds/products/grade10-site/vault/collector-pages.md),
  [Vault](../../../docs/prds/products/grade10-site/vault/index.md),
  [Compliance and Readiness](../../../docs/prds/products/grade10-site/vault/compliance-and-readiness.md),
  [Documents and Signing](../../../docs/prds/products/grade10-site/vault/documents-and-signing.md),
  [Loan and Money](../../../docs/prds/products/grade10-site/vault/loan-and-money.md),
  [Operator Console](../../../docs/prds/products/grade10-site/vault/operator-console.md),
  [Case Lifecycle](../../../docs/prds/products/grade10-site/vault/case-lifecycle.md),
  [Vault Case Blocks](../../../docs/prds/products/shared/ui/vault-case.md),
  [Page Blocks](../../../docs/prds/products/shared/ui/page-blocks.md),
  [Carried Surfaces](../../../docs/prds/products/grade10-site/site/carried-surfaces.md),
  [Vault Custody](../../../docs/prds/platform/vault-custody.md) and
  [Account Data](../../../docs/prds/platform/account-data.md).
- **grade10-spec** - `packages/ui/src/blocks/vault-case` goes with its stories,
  fixtures, exports and public-export test entries; `@grade10/i18n` drops the
  keys only the removed screens read.
- **grade10** - the site's vault pages, slices and routes go with
  `/profile/data`, the Your data button and the Vault item; the vault's e2e
  walks call the worker's API instead of the site; `/vault/sign` and the
  console are unchanged.
- **In-flight changes** - `vault-home-case-cards`, now archived, drew cards
  this change removes. `add-item-registry`
  group 12 builds the wizard's first step, which no longer exists.
  `add-hosted-identity-verification` draws a page at `/vault/verify`, the
  address this change takes off, and its tasks 1.2, 1.5 and group 13 name it.
  `add-card-grading` points the collector at Your data from its pages and
  catalog. Each is named in [Q12](decisions.md#decisions).
- **Design boards** - the site's vault boards exist only inside those
  in-flight changes' `ui-design.md`; no durable board retires.
- **No domain impact** - no domain, product or platform suite reads the
  collector's vault screens.

## Open questions

None. Where a mailed link lands (Q13), how a walk-in draft is sent (Q14) and
an ask to be forgotten while a grading submission is live (Q15) are settled by
their recommendations in [`decisions.md`](decisions.md).

## References

- [Collector Pages](../../../docs/prds/products/grade10-site/vault/collector-pages.md)
- [Vault · Where It Is Open](../../../docs/prds/products/grade10-site/vault/index.md#where-it-is-open)
- [Vault Blocks · The Blocks](../../../docs/prds/products/shared/ui/vault-case.md#the-blocks)
- [Carried Surfaces · What Each Lane Carries](../../../docs/prds/products/grade10-site/site/carried-surfaces.md#what-each-lane-carries)
- [Vault digital twin](../../../docs/references/grade10-vault-digital-twin.md) - @tangconst's working notes for the screens
