## Screens

### Auction-first account menu

Layout SoT: Storybook
`site-chrome-siteheader-auction-first--account-menu` (folder
`Site Chrome/SiteHeader/Auction first`).

Figma `Nav` (`4171:9937`) remains an early chrome reference only — Storybook
locks auction-launch composition: email + `xs` avatar above My Auctions and
Sign Out; no Profile, My Orders, Membership, Cart, or My Auction Orders.

### Auction & Store account menu

Layout SoT: Storybook
`site-chrome-siteheader-auction-store-account-menu--open` (folder
`Site Chrome/SiteHeader/Auction & Store/Account menu`).

Cart in the bar; menu items My Orders, My Auctions, Membership, Sign Out; no
Profile. Membership destination remains ❓ on the PRD — the story asserts the
handler fires, not a route.

### Auction & Store cart count and surfaces

Layout SoT: Storybook under
`Site Chrome/SiteHeader/Auction & Store/Cart count` and
`Site Chrome/SiteHeader/Auction & Store/Surfaces` — Cart present once Store
answers; count badge behaviour is owned by `nav-cart-count-badge`, not this
change.

## Components

| Export | Package | Role |
| --- | --- | --- |
| `Nav` | `@grade10/design-system` | Primitive chrome; account via `accountSlot` |
| `Avatar` / `AvatarFallback` | `@grade10/design-system` | `size="xs"` initial above the sign-in email |
| `DropdownMenu` (+ Label, Item, Separator, Group) | `@grade10/design-system` | Account menu surface |
| `VStack` | `@grade10/design-system` | Email + avatar stack in the menu label |
| `IconButton` | `@grade10/design-system` | Account trigger |
| `SiteHeader` | `@grade10/ui` | Compound header: optional `accountEmail`, `onMembership` / `copy.membership`, optional `onProfile` / `onOrders` (unused on Grade10 launch compositions) |

**Missing work already landed in this repository for Storybook SoT:**
`accountEmail`, Membership handler + copy, Title Case `Sign Out` in story
copy, Auction first / Auction & Store story folders. Application wiring —
omit `onProfile` for these launches, supply `accountEmail`, supply Membership
only once Store answers and a destination is chosen — remains delivery work
in `apps/frontend/grade10`.

**i18n:** Grade10 chrome catalogs need Title Case `signOut` and a Membership
label when the store composition ships. No new design-system primitive or
token.

## States

### Auction-first account menu

| State | Shows | Anchor |
| --- | --- | --- |
| Auction launch, menu open | Avatar `xs` + sign-in email; menuitems My Auctions, Sign Out; no Profile, My Orders, Membership, Cart, My Auction Orders | `grade10-site-site-page-shell-SC-27` |
| Auction launch, signed in, menu closed | Account icon in the bar; no Cart | `grade10-site-site-page-shell-SC-09` |
| Auction launch, signed out | Sign In primary; no account menu | `grade10-site-site-page-shell-SC-07` |
| No `accountEmail` supplied | Menu label falls back to `copy.accountMenuLabel` | `grade10-site-site-page-shell-SC-31` |

### Auction & Store account menu

| State | Shows | Anchor |
| --- | --- | --- |
| Store launch, menu open | Avatar + email; My Orders, My Auctions, Membership, Sign Out; Cart in the bar; no Profile | `grade10-site-site-page-shell-SC-17` |
| Membership activated | `onMembership` invoked; destination still ❓ | `grade10-site-site-page-shell-SC-34` |
| Membership handler omitted | Membership item absent; My Orders / My Auctions / Sign Out remain | `shared-ui-site-chrome-SC-40` |
| Profile handler omitted (Grade10 launch) | No Profile menuitem on auction or store launch | `grade10-site-site-page-shell-SC-28` |
| My Auction Orders omitted (Grade10 launch) | No My Auction Orders menuitem; winners reach orders from My Auctions | **Out of suite:** the durable `shared/ui/site-chrome` and `grade10-site/site/page-shell` specs have never defined a My Auction Orders menu item; `add-my-auction-orders`'s own suite verifies its entry point is My Auctions |
