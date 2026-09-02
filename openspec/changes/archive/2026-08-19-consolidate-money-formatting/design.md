## Context

Six renderings of money exist in `grade10`, listed in the proposal. The one
that is correct — per-currency exponents, memoized formatters — sits in the
auction backend; the one that converts external decimal amounts exactly sits
in `packages/shopify/backend/src/money/`, behind a payment provider's package
name. Nothing shared exists, and nothing stops a seventh from being written.

Constraints the approach has to respect:

- Money crosses every layer. The same conversion runs in a Worker rendering
  an email, in a browser rendering a price, and in a demo running neither —
  so the module cannot depend on a runtime, a design system, or a brand.
  Presentation packages are brand-owned; a formatter is not presentation.
- `@grade10/utils` already exists for exactly this shape of code, and both
  ends already depend on it: workers, backend and frontend packages, and one
  demo.
- Requirements: [`shared/money-amounts`](specs/shared/money-amounts/spec.md).

## Goals / Non-Goals

**Goals:**

- One place where an amount becomes text, reachable from every layer.
- An exponent the platform states, not one a runtime guesses.
- A shape per audience that a surface selects, not one it reinvents.
- A seventh copy fails a check rather than passing review.

**Non-Goals:**

- A `Money` value type through the wire contracts.
- Currency conversion, currency metadata (names, symbol tables, supported
  lists), or anything in the message catalogs.
- Changing where amounts are validated.

## Decisions

### One module in `@grade10/utils`, not a new package

The module is `@grade10/utils/money`, a single file plus its tests.

`utils` is the flat, brand-neutral lib whose subpaths each name a concern —
`/api-calls`, `/crypto`, `/two-factor`, `/rpc` — which is exactly the shape of
this code, and every consumer already depends on the package or can add it in
one line.

*Rejected — a new `packages/money`:* about a hundred lines of implementation
would arrive with a `package.json`, a tsconfig, a vitest config, and a
workspace entry. The layout convention reserves a flat package for one role
with something to own; a formatter is a helper, and `utils` is where helpers
live.

*Rejected — leaving it in `@grade10/shopify-backend`:* a storefront page
would import a payment provider to print a price, and the error text for an
unknown currency would name Shopify on a surface Shopify has nothing to do
with — which the spec now forbids outright.

*Rejected — `@grade10/ui` or the design system:* a package must never import
a design system, and money formatting has no markup. It is data, not
presentation.

### The subpath is `/money`, not `/currency`

Three of the four exports operate on an *amount*, with the currency as the
modifier that selects the exponent and the symbol; only the exponent lookup is
about the currency itself. Naming the module for the modifier makes the
exports misfit their home — `formatMoney` from `/currency` reads wrong, and
renaming it to `formatCurrency` would be inaccurate, since what gets formatted
is an amount. "Money" is also the settled domain term for the amount-plus-
currency pair, and the term the repository already reaches for unprompted:
three files named `money.ts` and one `money/` directory.

*Reconsider if* the module's centre of gravity ever moves to currency
metadata — supported-code lists, symbols, display names — at which point
`/currency` becomes the better home and the rename is one import sweep.

### The surface

```ts
currencyExponent(code: string): number
toMinorUnits(decimal: string, code: string): number
fromMinorUnits(minor: number, code: string): string
formatMoney(minor: number, code: string, opts?: {
  locale?: string;
  currencyDisplay?: "symbol" | "code";
}): string
```

`toMinorUnits` / `fromMinorUnits` are named as a visible inverse pair, the way
`toBase64Url` / `fromBase64Url` already are in this package. Shopify's current
`toDecimalAmount` is that inverse under a name that hides the pairing, so it
is renamed on the way in.

*Rejected — `money()` or `format()`:* the site's current `money(...)` reads as
a noun call outside JSX, and a bare `format` is unusable once imported into a
component file. These names have to survive where the module name is
invisible, which is why `base64url` repeats its concern in its exports and
`batch` does not need to.

### `currencyDisplay` is `Intl`'s word, with `Intl`'s values

The option that selects the two shapes is named `currencyDisplay` and takes
`"symbol"` or `"code"` — the exact name and values `Intl.NumberFormat`
already uses, passed straight through.

*Rejected — our own `display: "symbol" | "code"`:* a synonym forces every
reader who knows `Intl` to check whether our `"code"` means theirs. Default is
`"symbol"`; admin panels pass `"code"`.

### The exponent comes from the platform's table, never from `Intl`

The ISO 4217 exponent table moves out of `shopify-backend` unchanged and
becomes the single source for both the division and the fraction digits
handed to `Intl`.

The auction backend currently derives the exponent from
`resolvedOptions().maximumFractionDigits ?? 2`. That reads well but has two
faults the spec forbids: an unrecognized code silently resolves to 2 rather
than failing, and the exponent used for display could differ from the one
used for conversion if a runtime's ICU data disagrees with the table. One
table, consulted by both, cannot drift from itself.

*Rejected — deriving from `Intl` and keeping the table only for conversion:*
two sources for one number is the defect this change exists to remove.

### Formatters are memoized on locale, currency, and display

Constructing an `Intl.NumberFormat` is the expensive half of formatting, and
an email batch or a table renders one currency repeatedly. The auction
backend's per-currency cache generalizes to a `Map` keyed by all three inputs.

### `isMinorAmount` stays in the auction

Its body is `Number.isSafeInteger(value) && value > 0`. The positivity is an
auction rule — a bid cannot be negative — not a property of minor units; a
refund or a ledger debit is a legitimate negative amount. Moving it under that
name would export an auction constraint to every caller under a name
promising general validity.

It stays at `packages/grade10-auction/backend/src/amounts.ts`, which is left
holding only it once `formatMinorAmount` moves out. Should a second caller
ever need the sign-agnostic half, that half — and only that half — comes to
`utils/money`.

### Shopify consumes the module and re-exports nothing

`packages/shopify/backend/src/money/` is deleted and its barrel entry with it.
The Shopify demo, its only outside caller, imports from `@grade10/utils/money`
directly.

A re-export shim from the Shopify barrel was rejected: a package publishes
what it defines, and `check:libs` exists to keep one role package from
relaying another's surface. Two import lines change; a shim would last
forever.

### A check keeps the seventh copy out

A small script in the `scripts/lib/` family, wired into `pnpm run check:libs`,
fails when `style: "currency"` or a minor-unit division appears outside
`packages/utils/src/money.ts`.

*Rejected — a Biome rule:* matching a member expression plus an option object
needs a plugin, which is more machinery than a grep.
*Rejected — documenting it only:* nothing would enforce it, and this change
exists because six people each wrote the obvious four lines.

### The capability sits at the top level of `specs/`

`shared/money-amounts` is not a product's capability — it binds storefronts, admin
panels, and email across both brands — so it sits beside the product
directories rather than inside one, the way `backend-service-repository` does.

### No `ui.md`

No screen is added or laid out, and no design-system or `@grade10/ui` export
changes, so there is no frame to link and nothing for that file to hold. The
visible deltas are in the migration note below.

## Risks / Trade-offs

- **`currencyDisplay: "code"` output is locale-shaped.** Some locales place
  the code after the number. Admin panels run in the operator's locale, so a
  non-English operator may see `2.490,00 HKD`. Acceptable: the code is present
  and unambiguous either way, which is the point of the shape.
- **`Intl` separates the code from the number with a non-breaking space
  (U+00A0), not a plain space.** Any test asserting `"HKD 2,490.00"` with an
  ordinary space fails for a reason that looks like nonsense. Assert against a
  constructed expectation or normalize the whitespace.
- **Operator tables change visibly** — thousands separators appear. Intended,
  and named in the proposal's Impact.
- **The exponent table is hand-maintained.** A currency added to a brand
  without an entry fails loudly at first use rather than mispricing, which is
  the trade this change chooses; the failure names the code and the fix is one
  line.
- **One shared module is one shared blast radius.** Mitigated by the module
  being pure, total, and covered per exponent class (0, 2, 3) in its own
  tests.

## Migration Plan

The module lands first; nothing else depends on the order after that. Each
call site moves with its own tests, and the old file is deleted in the same
task that empties it — no compatibility period, since every caller is in this
repository.

1. `@grade10/utils/money`, with the exponent table moved in from Shopify and
   its tests moved with it.
2. Shopify's `money/` deleted, barrel entry removed, demo repointed.
3. Auction backend: `formatMinorAmount` deleted, email render repointed,
   `amounts.ts` left holding `isMinorAmount`.
4. Storefront, admin panels, and demos repointed; the three local `money.ts`
   files and the four inline formatters deleted. `@grade10/utils` added to
   four `package.json` files that lack it.
5. The check that keeps the copies from coming back.
