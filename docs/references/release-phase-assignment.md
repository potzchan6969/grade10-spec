# Release Phase Assignment

The first assignment of every product page to the five release phases, drafted
on 2026-11-03 by an agent for the product manager to mark up. The blocks on the
pages were written from this table in the same commit, so a markup here is a
one-line edit of a block there. The rules it follows are on
[Release Phases](../prds/products/shared/planning/release-phases.md); the
phases are listed in [`phases.yaml`](../prds/phases.yaml). Read this as the
reasons behind the blocks, not as the requirements; where a row and a page's
block disagree, the block is correct.

## How to Read It

- **Split** - `whole` is one block before the page's first heading; otherwise
  the sections or rules that launch elsewhere, and the phase they go to
- **Release priority** - P0 the phase does not launch without it; P1 launches
  if ready, else moves; P2 stretch. Where the backend and its tests already
  hold a rule (a pure server rule, a calculation, a policy with no screen), the
  priority leans one lower, keeping P0 where a person must see it work
- **One unit, one priority** - on a store page a section in a phase is one unit,
  and elsewhere a capability in a phase is one unit; it takes the highest
  priority of its blocks, so a rule is never given a lower priority than its
  own section in the same phase
- **Sources** - each page's Product decisions, the capability's suite (its
  case count and severities), the carried lanes on
  [Carried Surfaces](../prds/products/grade10-site/site/carried-surfaces.md),
  and the vault's own rollout on [Vault](../prds/products/grade10-site/vault/index.md#rollout)

## Totals

| Phase | Pages | Units | P0 / P1 / P2 | Readiness today |
| --- | --- | --- | --- | --- |
| Auction | 28 | 28 | 7 / 9 / 12 | 14 prepared, 14 no suite |
| Internal Consignment | 29 | 38 | 17 / 11 / 10 | 4 prepared, 13 planned, 21 no suite |
| Pre-Store Launch | 16 | 11 | 4 / 3 / 4 | 3 prepared, 8 no suite |
| Store Launch 1 | 37 | 81 | 31 / 32 / 18 | 27 reviewed, 6 prepared, 32 planned, 16 no suite |
| Store Launch 2 | 12 | 13 | 4 / 9 / 0 | 6 reviewed, 1 prepared, 5 planned, 1 no suite |

102 of the manual's 202 pages name a phase. A page split between phases
counts in each.

## Auction

The auction already opens on every lane, so this phase is its current round:
every line of it, launched or still being built, is walked before the round
ships.

| Page | Split | Release priority | Reason |
| --- | --- | --- | --- |
| [Bidding](../prds/products/grade10-site/auction/bidding.md) | whole | P0 | Placing a bid is the auction's main flow; `auction/auction` holds 22 cases, 6 critical |
| [Post-Bidding](../prds/products/grade10-site/auction/post-bidding.md) | whole | P0 | Winning and paying: money; `auction/winner-order` holds 93 cases, 31 critical |
| [Auction Display](../prds/products/grade10-site/auction/display.md) | whole | P0 | The lot page and catalogue every bidder starts from; 28 cases |
| [Account](../prds/products/grade10-site/auction/account.md) | whole | P0 | The delivery address a winner's order setup asks for; no suite |
| [Auction](../prds/products/grade10-site/auction/index.md) | whole | P2 | Chapter list; its rules are walked on their own pages |
| [Auction Management](../prds/products/grade10-admin/auction/management.md) | whole | P0 | No sale opens without listings, orders and payment; 61 cases, 1 blocker |
| [Internal Bid](../prds/products/grade10-admin/auction/internal-bid.md) | whole | P1 | The house's bid on an absolute sale; 38 cases, yet a sale runs without one |
| [Auction operations](../prds/products/grade10-admin/auction/index.md) | whole | P2 | One-line pointer |
| [Audit Trail](../prds/products/grade10-admin/audit/index.md) | whole | P2 | The backend writes the chain and its check verifies it; 5 cases |
| [Daily Reminder](../prds/products/grade10-admin/console/daily-reminder.md) | whole | P2 | An operator's convenience, the auction its first source; 42 cases |
| [Roles & Permissions](../prds/products/grade10-admin/console/roles-and-permissions.md) | whole | P2 | A read-only matrix of the shipped mapping |
| [Users (access desk)](../prds/products/grade10-admin/console/user-directory.md) | whole | P1 | Granting operators their roles; 5 cases |
| [User Directory](../prds/products/shared/console/user-directory.md) | whole | P1 | The access desk's shared block |
| [Accounts](../prds/products/grade10-site/account/accounts.md) | whole | P2 | Overview of the account pages |
| [Sign-In](../prds/products/grade10-site/account/sign-in.md) | whole | P0 | Nobody bids signed out: identity; 26 cases, 1 blocker. Its 🚧 console and site separation ships with the first phase |
| [Sessions](../prds/products/grade10-site/account/sessions.md) | whole | P1 | An operator ends a session; backend rules, 4 cases |
| [Audit Log](../prds/products/grade10-site/account/audit.md) | whole | P2 | Identity writes on the trail; the backend guarantees it |
| [Roles and Permissions](../prds/products/grade10-site/account/roles.md) | whole | P1 | Permission gates, held by the backend; 1 case |
| [Users](../prds/products/grade10-site/account/users.md) | whole | P1 | Bans and role changes; 20 cases |
| [KYC](../prds/products/grade10-site/account/kyc.md) | whole; Before Money Leaves → Store Launch 1 | P0 | The verified-bidder bar holds a bid: identity |
| [KYC Service](../prds/products/grade10-site/account/kyc-service.md) | whole | P1 | Where the verified record lives; no screen of its own |
| [Listing Page Blocks](../prds/products/shared/ui/auction-listing.md) | whole | P1 | The bid panel's blocks, walked through Bidding |
| [Auction Order Blocks](../prds/products/shared/ui/auction-order.md) | whole | P2 | Walked through Post-Bidding |
| [Auction Record Blocks](../prds/products/shared/ui/auction-record.md) | whole | P2 | Walked through Bidding's history |
| [Sign-In Dialog](../prds/products/shared/ui/auth-sign-in.md) | whole | P2 | Walked through Sign-In |
| [Invoice and Receipt PDF Blocks](../prds/products/shared/ui/invoice-and-receipt-pdf.md) | whole | P1 | The winner's invoice and receipt: money paper |
| [Auction Service](../prds/platform/auction-service.md) | whole | P2 | Server rules behind Bidding and Post-Bidding, held by the backend's tests |
| [Dates and Times](../prds/platform/shared/dates-and-times.md) | Auction Order Operators only | P2 | 🚧 Hong Kong time on the Orders worklist; the rest is a policy with no phase |

## Internal Consignment

The staff-only vault, consignment and inventory flows, in the admin panel and
at the counter.

| Page | Split | Release priority | Reason |
| --- | --- | --- | --- |
| [Products and Stock](../prds/products/grade10-admin/inventory/catalog.md) | whole | P0 | Every item is an instance of a catalogue product; 81 cases, 39 critical |
| [Inventory Console](../prds/products/grade10-admin/inventory/console.md) | whole | P0 | Scan, the item page and the receiving desk: staff's way in |
| [Inventory](../prds/products/grade10-admin/inventory/index.md) | whole | P1 | The intake form and product assets, overview with 🚧 lines |
| [Intake and Release](../prds/products/grade10-admin/inventory/intake.md) | whole | P0 | Receiving an item and releasing it |
| [Items](../prds/products/grade10-admin/inventory/items.md) | whole | P0 | One item per physical object; 38 cases, 22 critical |
| [Locations](../prds/products/grade10-admin/inventory/locations.md) | whole | P1 | Sites, units and caps; the shop and KEC can be named by hand meanwhile |
| [Services and Hand-offs](../prds/products/grade10-admin/inventory/services.md) | whole | P1 | Marks the vault, consignment and the store share |
| [Transit](../prds/products/grade10-admin/inventory/transit.md) | whole | P1 | Moves between sites; staff move by hand meanwhile |
| [Collector Page](../prds/products/grade10-admin/console/collector-page.md) | whole | P1 | One console page per collector under Vault; 16 cases |
| [Vault Intake](../prds/products/grade10-site/vault/intake.md) | Ways In (card event, the shop's counter), Intake Form, Authentication, What an Intake Needs, Card States; Custody P1; Mail-In in no phase | P0 | The vault's first flow; its Done When is a card authenticated and earning |
| [Incentive](../prds/products/grade10-site/vault/incentive.md) | whole | P0 | The daily amount is money paid to collectors |
| [Vault Operations](../prds/products/grade10-site/vault/operations.md) | Intake and Incentive Approval queues, Moves, Roles, Daily Run; Staff Dashboard P1; Held List → Store Launch 1; Mail-In Parcels and Retrieval Queue in no phase | P0 | Staff cannot run the vault without its queues and moves |
| [Vault Documents](../prds/products/grade10-site/vault/documents.md) | Papers but Retrieval Note, and Rules; Retrieval Note in no phase | P1 | Papers are made from what the flows record |
| [Vault](../prds/products/grade10-site/vault/index.md) | Rollout's first two steps, Where It Is Open; the opening and Mail-In and Retrieval in no phase | P2 | Overview |
| [Consigning](../prds/products/grade10-site/consignment/consigning.md) | whole; From the Dashboard, Consign Form, Changing the Lowest Price, Consignment States and the online rules of At the Store (Sold Twice, One Buyer at a Time, Online Orders, First Hold Wins) → Store Launch 1 | P0 | Consigning at intake, terms, approval and the shop's tills are the phase |
| [Consignment Counter](../prds/products/grade10-site/consignment/counter.md) | whole | P0 | Consigning at the counter is the main way in |
| [Consignment Console](../prds/products/grade10-site/consignment/operator-console.md) | whole | P0 | The queue, one consignment, payouts and settings |
| [Consignment Retrieval](../prds/products/grade10-site/consignment/consignment-retrieval.md) | whole | P1 | Taking a card off sale; staff do it at the counter, the fee is nothing by default |
| [Consignment Dashboard](../prds/products/grade10-site/consignment/dashboard.md) | whole | P2 | An internal conversion view; staff can work from the queue |
| [Consignment](../prds/products/grade10-site/consignment/index.md) | whole | P2 | Overview |
| [Earnings Wallet](../prds/products/grade10-site/account/earnings-wallet.md) | whole; Cash-Out, Payouts, Identity Check, Held List, Abuse Checks → Store Launch 1 | P0 | The ledger incentive and proceeds post to: money |
| [Inventory and Sales Channels](../prds/products/grade10-site/store/inventory-and-channels.md) | whole | P1 | Where stock sits; the tills first |
| [Store Listings](../prds/products/grade10-site/store/store-listings.md) | whole; Filters and Before Online Opens → Store Launch 1; Pricing by Rule P2 | P0 | An item sells at the tills only once staff list it; pricing by rule is written as later |
| [Shelf Scanning](../prds/products/grade10-site/store/shelf-scanning.md) | whole | P2 | A shopkeeper's look-up; the price can be read another way |
| [Store](../prds/products/grade10-site/store/index.md) | Users: Staff only | P2 | Staff listing items from the admin panel |
| [Document Signing](../prds/products/grade10-site/doc-sign/index.md) | whole | P0 | The collector signs the Vault Terms and the Consignment Agreement at the counter |
| [Documents Service](../prds/products/grade10-site/doc-sign/service.md) | whole | P1 | Templates, packets and the seal; service rules |
| [Money Amounts](../prds/platform/shared/money-amounts.md) | A Reference Price May Be Converted only | P1 | 🚧 the yen market price behind incentive |
| [Carried Surfaces](../prds/products/grade10-site/site/carried-surfaces.md) | Vault only | P0 | The signing ceremony is carried where staff use it |

## Pre-Store Launch

Campaigns, and membership up to tiers, points and top-ups.

| Page | Split | Release priority | Reason |
| --- | --- | --- | --- |
| [Campaigns](../prds/products/grade10-site/loyalty/campaigns.md) | whole | P0 | Catch Me If You Can is the pre-store launch campaign |
| [Membership](../prds/products/grade10-site/loyalty/index.md) | whole | P2 | Overview and Not in Scope |
| [Membership](../prds/products/grade10-site/loyalty/membership.md) | whole; Purchases Before the Account → Store Launch 2 | P0 | Joining, the membership page and the member pass |
| [Points](../prds/products/grade10-site/loyalty/points.md) | Rules and Expiry; Qualification Criteria, Backend Flow and Refunds → Store Launch 2 | P0 | A balance and its lapse date; earning on a purchase waits for the store |
| [Tiers](../prds/products/grade10-site/loyalty/tiers.md) | whole | P0 | Named in the phase |
| [Top-ups](../prds/products/grade10-site/loyalty/top-ups.md) | whole | P0 | Named in the phase; money by card, and the street promotion asks for a top-up |
| [Operator Console](../prds/products/grade10-site/loyalty/operator-console.md) | whole | P1 | Grants and corrections by hand; the campaign's gift reward is authored here |
| [Member Card in a Wallet](../prds/products/grade10-site/loyalty/wallet-member-card.md) | whole | P1 | The pass on Membership works without it; no launch date is set |
| [Expiry Reminders](../prds/products/grade10-site/loyalty/expiry-reminders.md) | whole | P2 | Nothing lapses within twelve months of launch |
| [Tier Reminders](../prds/products/grade10-site/loyalty/tier-reminders.md) | whole | P2 | Emails, still being built |
| [Loyalty Service](../prds/platform/loyalty-service.md) | whole | P2 | The engine, held by its tests |
| [Rewards](../prds/products/grade10-site/loyalty/rewards.md) | Reward Types, Reward Catalog, Gifts from a Campaign | P0 | The campaign's gift is a grant-only reward |
| [Coupons](../prds/products/grade10-site/loyalty/coupons.md) | Validity only | P1 | A campaign winner holds the gift coupon before the store opens |
| [Page Shell](../prds/products/grade10-site/site/page-shell.md) | Account Menu: Membership only | P1 | The account menu's link to Membership |
| [Site Header and Footer](../prds/products/shared/ui/site-chrome.md) | Account Entry: Membership only | P1 | The same link in the shared header |
| [Carried Surfaces](../prds/products/grade10-site/site/carried-surfaces.md) | Membership only | P0 | The membership and join pages carried in production |

## Store Launch 1

The store, the cart, checkout, site discounts and orders, with no membership
feature; and the collector's own vault and wallet pages.

| Page | Split | Release priority | Reason |
| --- | --- | --- | --- |
| [Main Page](../prds/products/grade10-site/store/home.md) | Hero, Collection Grid P0; Merchandised Row, Loading and Errors P1 | P0 | The store's front door; 13 cases |
| [Product Listing](../prds/products/grade10-site/store/product-listing.md) | Products Display, Collection Page P0; Filters, Sort, Search, Catalogue Source P1; Links and Back Button P2 | P0 | Browsing is the first step to a cart |
| [Product Details](../prds/products/grade10-site/store/product-page.md) | Product Card, Buy P0; Free Pick-up, Unknown Product Address P1; Shared Link, You May Also Like P2 | P0 | Adding to the cart starts here |
| [You May Also Like](../prds/products/grade10-site/store/cross-sell.md) | whole | P2 | A merchandising rail; the card sells without it |
| [Cart Drawer](../prds/products/grade10-site/store/cart.md) | whole; Pending Operations P1; Promo Code's Held Codes, Wallet Not Answered and Gift → Store Launch 2 P1; Points → Store Launch 2 P0 | P0 | The cart and the step to checkout; its suite is approved, 54 of 54 |
| [Checkout](../prds/products/grade10-site/store/checkout.md) | whole; Guest Checkout's No Points → Store Launch 2 | P0 | Payment: money |
| [Cart Validation](../prds/products/grade10-site/store/cart-validation.md) | whole; Failed Checks P1; Measurement P2 | P0 | No order at a price or stock the shop would refuse |
| [Discounts](../prds/products/grade10-site/store/discounts.md) | whole; Kinds of Discount's Order Coupon, Product Coupon, Gift and Points, Authoring Rules' Store Default, Online Checkout's two Retired Counter Sale rules → Store Launch 2; At the Till → Store Launch 2 P1 | P0 | Site discounts are named in the phase; codes minted to members are membership |
| [Order Details](../prds/products/grade10-site/store/order-detail.md) | whole; Back From Checkout P1; Order Summary's Points and Points to Earn → Store Launch 2 | P0 | The order after paying, and a guest's only way back to it |
| [My Orders](../prds/products/grade10-site/store/order-history.md) | whole; Product Pictures P2; Guest Orders' No Points → Store Launch 2 | P0 | Orders are named in the phase |
| [Refunds](../prds/products/grade10-site/store/refunds.md) | Starting a Refund, What the Collector Sees; the programme's sections → Store Launch 2 | P1 | Shopify makes the refund; the store shows it |
| [Shipping](../prds/products/grade10-site/store/shipping.md) | Today only; Intended Shape in no phase | P1 | Shopify takes the address and the rate |
| [Store Locator](../prds/products/grade10-site/store/store-locator.md) | whole | P1 | Waits for the store's launch, per Carried Surfaces |
| [Store](../prds/products/grade10-site/store/index.md) | whole but Users: Staff | P2 | Overview |
| [Checkout Domain](../prds/products/grade10-site/commerce/checkout-domain.md) | whole | P1 | Shopify's checkout under our name; edge rules with no screen of ours |
| [Commerce](../prds/products/grade10-site/commerce/commerce.md) | whole | P1 | The order machine, held by its tests |
| [Order Status](../prds/products/grade10-site/commerce/order-status.md) | whole | P1 | The badge rule; 5 cases |
| [Product Status](../prds/products/grade10-site/commerce/product-status.md) | whole | P1 | Availability and sale identity, read by the store pages |
| [Profile](../prds/products/grade10-site/account/profile.md) | whole | P1 | Carried with the store's launch; the account works without it |
| [Crawlable Pages](../prds/products/grade10-site/site/crawlable-pages.md) | whole | P2 | Search and link-preview text |
| [Page Shell](../prds/products/grade10-site/site/page-shell.md) | whole but Membership | P1 | The full navigation replaces the auction-first chrome; 34 cases |
| [Site Header and Footer](../prds/products/shared/ui/site-chrome.md) | whole but Membership | P1 | The header's cart and account menu |
| [Carried Surfaces](../prds/products/grade10-site/site/carried-surfaces.md) | whole but Vault and Membership | P0 | Carrying the store in production is the launch; 18 cases, 14 critical |
| [Cart Drawer Blocks](../prds/products/shared/ui/store-cart.md) | whole | P1 | Walked through the Cart Drawer; 15 cases |
| [Product Listing Blocks](../prds/products/shared/ui/store-product-listing.md) | whole | P1 | Walked through Product Listing; 7 cases |
| [Store Main Page Blocks](../prds/products/shared/ui/store-home.md) | whole | P2 | Walked through Main Page |
| [Store Locator Block](../prds/products/shared/ui/store-locator.md) | whole | P2 | Walked through Store Locator |
| [Order Details Blocks](../prds/products/shared/ui/store-order-detail.md) | whole | P2 | Walked through Order Details |
| [Order History Blocks](../prds/products/shared/ui/store-order-history.md) | whole | P2 | Walked through My Orders |
| [Profile Blocks](../prds/products/shared/ui/store-profile.md) | whole | P2 | Walked through Profile |
| [Account Data](../prds/platform/account-data.md) | Auth Owns Sign-In, Showing Other Users, Examples (store) | P2 | 🚧 the name and avatar a member chose for the shop |
| [Portfolio](../prds/products/grade10-site/vault/portfolio.md) | whole | P1 | The collector's vault, the first collector page outside the admin panel |
| [Earnings Wallet](../prds/products/grade10-site/account/earnings-wallet.md) | Cash-Out, Payouts, Identity Check, Held List, Abuse Checks | P1 | Money leaving; the vault's own plan let incentive build up first |
| [Consigning](../prds/products/grade10-site/consignment/consigning.md) | the dashboard's rules and the online rules of At the Store | P1 | Consigning from the dashboard, and selling a consigned card online |
| [KYC](../prds/products/grade10-site/account/kyc.md) | Before Money Leaves | P1 | Follows cash-out |
| [Vault Operations](../prds/products/grade10-site/vault/operations.md) | Held List | P1 | Follows cash-out |
| [Store Listings](../prds/products/grade10-site/store/store-listings.md) | Filters, Before Online Opens | P1 | What the store's filters choose from |

## Store Launch 2

Every membership feature in the store.

| Page | Split | Release priority | Reason |
| --- | --- | --- | --- |
| [Rewards](../prds/products/grade10-site/loyalty/rewards.md) | whole but the Pre-Store Launch sections | P0 | Buying and using a reward |
| [Coupons](../prds/products/grade10-site/loyalty/coupons.md) | whole but Validity | P0 | A coupon reaching an order at either checkout |
| [Paying with Points](../prds/products/grade10-site/loyalty/paying-with-points.md) | whole | P0 | Points straight off a bill |
| [Shopify Integration](../prds/products/grade10-site/loyalty/shopify-integration.md) | whole | P0 | The checkout and the till carrying points and coupons |
| [Membership](../prds/products/grade10-site/loyalty/membership.md) | Purchases Before the Account | P1 | A till or guest sale earning once it has an owner |
| [Points](../prds/products/grade10-site/loyalty/points.md) | Qualification Criteria, Backend Flow, Refunds | P0 | Earning on a purchase |
| [Cart Drawer](../prds/products/grade10-site/store/cart.md) | Points P0; Held Codes, Wallet Not Answered, Gift P1 | P0 | The plan's own example of the split |
| [Discounts](../prds/products/grade10-site/store/discounts.md) | the member's codes and points P0; Store Default, the counter sale rules, At the Till P1 | P0 | Codes minted to members, and the till's loyalty terminal |
| [Checkout](../prds/products/grade10-site/store/checkout.md) | Guest Checkout's No Points | P1 | A guest order earns nothing |
| [Order Details](../prds/products/grade10-site/store/order-detail.md) | Order Summary's Points and Points to Earn | P1 | Points on an order |
| [My Orders](../prds/products/grade10-site/store/order-history.md) | Guest Orders' No Points | P1 | A joined guest order earns nothing |
| [Refunds](../prds/products/grade10-site/store/refunds.md) | What Comes Back to the Programme, Pricing a Return | P1 | Claw-back on a refund; five open questions |

## No Phase

Nothing plans to launch these yet, or they are the makers' own. Their lines
read by their marks; a line still being built shows as Unplanned.

| Pages | Why |
| --- | --- |
| [Vault Retrieval](../prds/products/grade10-site/vault/vault-retrieval.md), Vault Intake's Mail-In, the Mail-In Parcels and Retrieval Queue queues, the Retrieval Note | Mail-In and Retrieval keep no phase until one is planned |
| Finance: its 8 pages, [Vault operations](../prds/products/grade10-admin/vault/index.md), Submissions, [Vault Custody](../prds/platform/vault-custody.md), [Vault Blocks](../prds/products/shared/ui/vault-case.md) | A loan against a card is a case, not the vault, and no phase names it |
| Grading: 6 site pages, 2 admin pages, [Grading Blocks](../prds/products/shared/ui/grading-submission.md) | No phase names it; 136 lines still being built |
| Ticketing: 4 site pages, 6 admin pages | No phase names it; 126 lines still being built |
| Appointments: 3 site pages, 3 admin pages, 2 shared pages, [Booking Blocks](../prds/products/shared/ui/appointment-booking.md) | No phase names it |
| Press: 4 admin pages | No phase names it; the site's press pages carry no gate |
| [Business Verification](../prds/products/grade10-site/account/business-verification.md) | The vault lists it as not planned |
| About, Press, Shows, Media Coverage, Navigation, Typography and the site's index | Already open on every lane |
| Analytics: 4 pages | Measures every phase at once |
| ZZZ: 2 pages | The second brand, already open |
| Guides, Planning, Design Sync, API Docs, Package Rules, Page Blocks, Console Blocks, Visual Standard, Site Content, the platform's engineering pages, and the index pages that only list pages | The makers' own tools and conventions |

## Judgment Calls

The product manager's first look, most consequential first.

- **Products outside the five** - grading, ticketing, appointments and finance
  hold 282 of the 365 lines still being built in no phase. Either a phase is
  added for them, or they stay Unplanned on purpose
- **The auction is already open** - Carried Surfaces carries it everywhere, so
  the Auction phase walks launched lines as well as 49 still being built. The
  other reading places only the lines being built
- **Collector vault pages in Store Launch 1** - Portfolio, cash-out, consigning
  from the dashboard and the consignment states. Internal Consignment is the
  admin panel only and Pre-Store Launch is membership, so Store Launch 1 is
  the first that opens a collector page beyond the auction. The vault's own
  rollout had the dashboard in its first step and cash-out by 6 December; if
  they must keep that, they belong in Pre-Store Launch
- **The shop's counter with card events** - the vault's rollout opened the
  counter and the tills a step after card events; both are Internal
  Consignment now, in one P0 unit, so the counter cannot slip alone
- **The till's membership in Store Launch 2** - At the Till, the POS
  extension and points at the till. If the shop opens with its loyalty
  terminal before the online store, these move to Pre-Store Launch
- **Earning in Store Launch 2** - Pre-Store Launch's points are the balance,
  its expiry, top-ups and grants; earning on a purchase needs the store
- **Campaign gifts in Pre-Store Launch** - the launch campaign's card pack is a
  held coupon before the store opens, so Reward Types, Reward Catalog, Gifts
  from a Campaign and Coupons' Validity launch then; buying a reward waits
- **Identity and the console in Auction** - sign-in, sessions, roles, users,
  audit and KYC are placed in the first phase, with the console's own
  sign-in still being built; Internal Consignment brings most staff to the
  console, which may be where the PM wants that separation
- **Carried Surfaces spans three phases** - by its rows: Vault in Internal
  Consignment, Membership in Pre-Store Launch, the rest in Store Launch 1
- **Refunds at P1** - Shopify makes the refund and the store only shows it;
  the planning mockup showed it at P0
- **Public promo codes at P0** - in Store Launch 1, as the plan's own example;
  the 🚧 Promotion Code rule rides that P0 unit
- **Left unplaced on placed pages** - Shipping's Intended Shape, a roadmap
  slot with nothing specified, and the Vault page's opening links
