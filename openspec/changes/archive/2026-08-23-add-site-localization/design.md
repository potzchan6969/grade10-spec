# Design: Site localization

Capability delta: [`shared/localization`](specs/shared/localization/spec.md).
Motivation: [proposal.md](proposal.md) — Why.

## Context

Three seams already exist and the design leans on all of them.

- `packages/i18n` holds the message catalogs: an English base and a partial
  Traditional Chinese overlay merged key-by-key, consumed from source with no
  build step. The email package already renders the login email through it
  with a pure translator, and the auth services already read a per-request
  locale for that email from a `locale` cookie no page sets today.
- The site chrome's `Nav` already ships the whole locale switcher —
  `localeLabel`, `locales`, `locale`, `onLocaleChange` — and `Footer` a
  locale slot; `shared/ui/site-chrome` specifies both. No component work
  exists in this change.
- The grade10 site runs React Router in framework mode, and
  `grade10-site/site/crawlable-pages` — landed and durable — gives each public
  route module an identity record that drives its `meta`, its prerendered
  document, and the sitemap. The localized addresses extend that machinery
  per locale rather than adding a second one.
- A public surface is one of two kinds since `grade10-site/store/product-page`
  landed: one the build writes a document for (marketing, store, auction),
  and one the worker renders when its address is asked for (a card's page,
  `/store/products/:slug`). Only the first kind can be enumerated at build
  time, which is why that capability keeps cards out of the sitemap.

Both SPAs compose the same `auth-frontend` and `store-frontend` feature
slices, so the message vocabulary must be shared across brands; only the
values and locale sets differ.

## Decisions

### The renderer is `use-intl`

One library renders every string: the React provider and hooks in the SPAs,
the same library's pure core in the workers — which is what the email package
uses already. It brings ICU plurals and selects, typed message keys over the
catalog shape (a mistyped key path fails typecheck, half of the spec's "no
raw key on screen"), and no global mutable state.

*Alternatives:* `i18next` — rejected: a mutable global instance with runtime
plugin chains and codegen-dependent typing; a missing key is a runtime string
where this repo wants a compile error. Lingui and Paraglide — rejected on the
no-build-step rule: both compile catalogs, and every package here is consumed
from source. `react-intl` — rejected: heavier than `use-intl` with manual id
typing and nothing this change needs. A hand-rolled translator — rejected:
it re-implements ICU plural rules badly to save a dependency the repo
effectively already has.

### Catalogs are brand-first in `packages/i18n`

The package restructures to one catalog per brand and locale —
`messages/grade10/{en,zh-hant,zh-hans}.json`, `messages/zzz/ko.json` — with a
per-brand registry naming each brand's locale set and default, and message
lookup taking brand and locale. grade10's English catalog is the vocabulary's
type: grade10's other locales are checked as partial overlays of it and keep
the existing key-by-key merge; ZZZ's Korean catalog is checked as *complete*
against it, which is exactly the build failure the completeness requirement
demands — no runtime scanner, the typechecker is the check.

ZZZ's catalog living in the grade10 spec repository is an interim, and a
deliberate one. `docs/architecture/multi-product.md` says ZZZ's copy moves to
`external/zzz-spec` when that submodule lands; it does not exist yet, and the
alternative today is leaving ZZZ's strings hardcoded in its auth worker,
which is what this change is removing. Brand-keyed catalogs make that later
step a move of one directory rather than a rewrite — the brand key is already
the seam the split would cut along.

*Alternatives:* catalogs colocated per feature slice — rejected: values are
per-brand while slices are brand-shared, so colocation forces a second
overlay mechanism on top, and a translator works across the whole surface at
once, not per directory. Per-application catalogs with strings passed into
shared features as props — rejected: it turns every feature boundary into a
string funnel. A separate ZZZ i18n package — rejected: the vocabulary must
stay one type for the completeness check to mean anything, and this
repository adds no package without a product decision. Waiting for
`external/zzz-spec` — rejected: it blocks a Korean site on a submodule with
no date.

### The remembered locale is the `locale` cookie the auth service already reads

grade10 persists the collector's pick in the same first-party cookie the auth
services already consult for the login email. One write serves both
requirements: the page renders from it, and a sign-in started on that page
mails in it with no auth change at all. First-visit negotiation reads the
browser's language list once and maps regional Chinese
(`zh-TW`/`zh-HK`/`zh-MO` → `zh-Hant`, `zh-CN`/`zh-SG` → `zh-Hans`) with
everything else falling to English.

*Alternatives:* `localStorage` — rejected: invisible to the email seam that
already exists, so the login-email requirement would grow a new API surface
instead of using a cookie already read. A server-stored preference — rejected
in the proposal's non-goals.

### Localized addresses ride the crawlable-pages machinery

The prefixes go exactly as far as the build can enumerate. The prerendered
public route table gains `/tc` and `/sc` over the same route modules; English
keeps the unprefixed addresses. Each of those route modules' identity records
becomes locale-aware — title and description drawn from the catalogs — and
everything downstream follows from what crawlable-pages already derives from
identities: the prerender list emits every variant's document in its own
language, `meta` adds the alternate-language links (default included), and
the sitemap lists every variant. Serving keeps resolving through the route
config, so a nonsense address under a prefix 404s by the rule that already
exists.

The address wins over the cookie by construction: a prerendered variant
renders its address's locale deterministically — static serving reads no
cookie, and hydration must agree with the served document. The cookie is
consulted client-side after hydration, in exactly one place: an unprefixed
public arrival with a remembered non-default locale navigates to the prefixed
variant. Crawlers carry no cookie and never see a redirect. Session-shaped
surfaces are client-rendered only, so they read the cookie directly and stay
unprefixed.

A rendered public surface is the third case, and it gets no prefix. Giving a
card's page one would mean either a sitemap the worker renders — which
`grade10-site/store/product-page` deliberately does not have — or prefixed
addresses absent from the sitemap, indexable by nothing. So its address stays
as it is and the worker reads the locale off the request it is already
handling: the cookie when one is carried, the brand default when none is.
That is request-time locale logic, which the prerendered path rejects — but
that path is static by design and this one is not, so the objection does not
transfer. The served document and the first client render agree because both
read the same cookie, and a crawler, carrying none, is answered in English
every time.

The cost is stated plainly in the proposal's non-goals: a card has no
indexable Chinese address. A Chinese-speaking collector reads a card's page
with Chinese chrome around English catalogue copy, which is what the
commerce-content rule already says happens to the card's own text.

*Alternatives:* an edge redirect from the cookie — rejected: it puts
request-time logic back into a deliberately static serving path, and
locale auto-redirects are hostile to crawlers besides. A `?lang=` query —
rejected: variants stop being distinct documents, which defeats the indexing
goal. Locale subdomains — rejected: splits one SPA across origins for no
gain over a path prefix.

### ZZZ is constant, not configured

The ZZZ SPA renders from the Korean catalog with the locale hardcoded at its
root and `lang="ko"` on the document — no negotiation, no cookie, no
prefixes, and the chrome's locale label supplied without a handler so it
displays and invites nothing, as the site-chrome spec already provides for.
Its auth worker swaps the hardcoded English email catalog for the brand's
Korean one. When ZZZ ever gains a second locale, the work is grade10's
machinery, not an edit to this shape.

### Providers at the roots, packages stay ignorant of brands

Each SPA's root mounts the intl provider with its brand's catalog and the
active locale; shared feature slices consume strings through the renderer's
hooks against the shared vocabulary and never know which brand is speaking.
`@grade10/ui` and the design system stay catalog-free — content keeps
arriving through props, per the existing component-contract rule. Dates keep
flowing through the dates-and-times capability, which already accepts the
language input; localized pages just supply the active locale.

## Risks / Trade-offs

- **Engineer-drafted translations.** zh-Hant, zh-Hans, and ko values land
  machine-assisted and are marked for native review; wrong register in Korean
  or mixed Simplified/Traditional forms would be brand-damaging if review
  never happens. Mitigation: the catalogs are one reviewable directory per
  brand, and review is named follow-up work, not silently assumed.
- **Hydration drift on localized variants.** Same class of risk
  crawlable-pages already carries: the served `/tc` document must equal the
  first client render. The discipline is the same — render the address's
  locale, consult the cookie only after hydration — and the spec's
  address-wins scenario is the guard.
- **Vocabulary churn across two repositories.** Every new string is a catalog
  key here plus a submodule bump there. That is the existing cost of the
  spec-repo owning copy, accepted deliberately; batching key additions per
  change keeps it tolerable.
- **String extraction is broad but shallow.** Converting every hardcoded
  string in the shared features and pages touches many files with no logic
  change; the typed keys and the no-raw-key scenario bound the blast radius.

## Migration Plan

No data migrates. Order of landing: catalogs here → submodule bump →
shared-feature conversion → the two sites, ZZZ and grade10 independently →
localized public addresses last. Crawlable public pages have shipped, so
nothing in this change waits on another. Each step ships alone and the sites
render English (ZZZ: English until its group lands) throughout — no flag, no
coordinated cutover.

## Open Questions

None. Switcher label copy (whether the menu shows "繁體中文" or "繁") is
settled in ui.md; native review of the drafted translations is follow-up work
outside this change's requirements.
