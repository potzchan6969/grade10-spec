## Screens

No Figma frame exists for the admin. The approved mock, [`mock.html`](mock.html),
is the source of truth for layout and words. Its tabs above the page are the
mock's own navigation and are not built.

### New Reward

`/rewards/new` — the mock's **New reward** tab.

### Edit Reward

`/rewards/:slug` — the mock's **Edit an existing reward** tab. Duplicate and
Archive sit under More beside the title, at every width.

### Rewards List

`/rewards` — the mock's **Rewards list** tab: small buttons, the slug in
code type, the terms in secondary ink, and status badges tinted — live in
success, scheduled and sold out in warning.

## Components

All from `@grade10/frontend-console` in grade10. No `@grade10/design-system`
or `@grade10/ui` export, variant or token changes.

### Existing Words

- `Stack`, `Inline`, `Button` — layout and actions
- `TextField`, `NotesField`, `DateField` — menu entry and window
- `FacetFilterField` — catalog filter scope
- `StatusBadge` — rewards list states

### New or Changed (grade10 work)

| Word | Change | Seen as |
| --- | --- | --- |
| `ChoiceList` | `appearance`: `list`, `segmented`, `cards`, replacing `horizontal`; lists take small radios; a chosen card shows an accent ring and a dot; a segmented strip that wraps on a phone fills each row evenly | Kind cards; discount, scope, channels, stock and window as segmented controls, with the label drawn above. Every horizontal choice in the admin becomes segmented; one with option descriptions becomes a list |
| `Filter` | Removed | Its callers use a segmented `ChoiceList` with the label hidden |
| `CheckList` | `appearance`: `list` or `inline`, checks laid across the line | Combine checks |
| `MoneyField`, `UnitField` | Currency in front of the amount; 260px; placeholder | Amount `Required`, maximum discount `None`, minimum spend |
| `NumberField` | Units drawn as a mark after the input, 260px; `compact` is a 44px count with no clear button | Valid for, cost, stock; basket quantity |
| `SearchPicker` | Picked list framed with dividers; optional words when nothing is picked; a one-pick picker replaces its pick | Products, variants, the item, the gift |
| `IconButton` | `size`: `sm` or `md` | Remove buttons in picked lists and basket lines |
| `Badge` | `tone="outline"` | Redeem pill on the menu card |
| `SectionHeader` | Page heading; small grey back link above the title, as wide as its words; description up to 64 characters wide; the section's acts under More beside the title, the same at every width | `← Rewards`; Duplicate and Archive under More |
| `DateTimeField` | The time drops under the day when both do not fit | Auction listing times on a phone |
| `Panel` | Section heading under the page's; can pin to the bottom, lifted when pinned; tells its contents they sit on a surface | Save bar pinned to the bottom |
| `Table` | Framed in a white box, unless already inside a panel or dialog | Rewards list |
| `Split` | Rail stacks under the form when the form would drop below 28rem; a rail on the end side can stay in view while the page scrolls | Rail beside the form from a 1280px laptop, under it on a phone |
| `Notice` | Always a tinted box with no icon; optional detail line; `neutral` tone | Basket verdict, online-only scope note, kind note |
| `Text` | Success tone, semibold weight, caps | Save bar sentence, rail labels |
| `Disclosure` | New: a titled section that folds its contents, open when it appears | Check against a basket |

### Grade10 Admin Theme Values

| Value | Seen as |
| --- | --- |
| Type | Inter, 14px body; 13px labels, buttons, secondary text and table cells; 12px hints, table headers and small buttons |
| Controls | 36px tall; focus ring 2px out |
| Page title | 20px, 600 |
| Panel title | 14px, 600 |
| Rail label | 12px, 600, uppercase, 0.04em tracking, secondary |
| Panel | 20px padding, 8px radius, 16px between fields and between panels |
| Form and rail | 24px apart; rail 340px wide |
| Field | 6px radius, `#D5D3D2` border, label in main ink |
| Segmented | White track with a field border; options 400, chosen option on the muted fill, 500 |
| Kind card | 8px radius, 16px padding, field border; chosen card has an accent ring, accent-muted fill and a dot at its top right |
| Tints | Success, warning and error fills are the brand's muted colours; notice text in main ink, badge text in dark status colours |
| Notice | 6px radius, 12px padding, no icon |
| Secondary button | White, 1px field border |
| Marks | Currency and unit marks 13px; code 12px |
| Basket check title | 13px, 500 |
| Rewards list | Cells aligned to the top; other tables stay middle, beside their buttons |

## Copy

| Where | Words |
| --- | --- |
| Subtitle, new and edit | A reward is a coupon a member buys with points. Members who already redeemed keep the price and terms they bought, whatever you change here. |
| Picked or basket variant | The product's title; under it the variant's title and price, or the price alone for a product's only variant |
| Money off card | An amount, a percentage or everything off the whole order, named products or variants, or a catalog filter. |
| Free item card | One variant at nothing, once the member has it in the basket. |
| Gift card | A free line for one variant, added once the basket reaches a minimum spend. |
| Kind note, edit only | Changing the kind rewrites what the next redemption gets. Coupons already issued keep the terms they were bought under. |
| Retired handover note, edit only | Stored as a manual handover, a handover the programme has retired. Choose Money off, Free item or Gift with a purchase to give it a coupon definition; until then the other fields save on their own and the handover stays. A counter collection reads `Stored as a counter collection` in its place |
| List terms, retired handover | `Manual handover · retired`; `Collected at the counter: {name} · {days} days · retired` |
| Free item picker | The item — One variant. Its coupon takes 100% off it. |
| Gift picker hint | One variant, added to the order as a free line. |
| Products picker hint | Every variant of a picked product counts. |
| Empty picked list | Nothing picked yet. Search above. |
| Scope note, products or filter | The till cannot match a product or a catalog filter, so this reward will be online-only. |
| Channel hint | Online only: the till cannot match a product or a catalog filter. |
| Money placeholders | `None` where optional, `Required` where not |
| Units | `days after redemption`, `points`; stock's unit field has a hidden label |
| Window | Live window; one error, `Ends before it starts.`, on Live until; a window from and until one day runs that whole day and saves |
| Sentence | Staging's, ending "once the member has it in the basket" |
| Till panel, online only | 此優惠只限網上訂單, the till's own words (grade10 `integrations/shopify-pos/grade10/src/acts/view.ts:279`) |
| Reward menu, online only | `Online store only`, the menu's own words (`packages/i18n/messages/shared/en/membership.json`, `onlyOnline`) |

### Basket Verdicts

| Outcome | Bold line | Detail |
| --- | --- | --- |
| Takes money off | ✓ Takes {cut} off | {goods} → {after} |
| Adds a gift | ✓ Adds {name} free | Worth {price}. Basket stays {goods}. |
| Under the minimum spend | ✕ Under the minimum spend | Basket holds {goods}, the coupon asks for {min}. |
| Nothing in scope | ✕ Nothing in the basket matches the scope | Basket holds {goods}. |
| Gift already held | ✕ Gift already in the basket | The member already holds the gift's variant. |
| Another currency | ✕ Priced in another currency | The coupon is in {coupon}, the basket in {basket}. |
| Catalog unreadable | ✕ The catalog could not be read | A basket line could not be looked up. Try again. |
| Already free | ✕ Nothing left to take off | Every line the coupon matches is already free. |
| Cannot split | ✕ The discount cannot split | The amount does not divide evenly across a line's units. |

Staging's other bench words stay: "Finish the coupon to check it.", "Add a
line to check.", and the Shopify footnote.

## Differences From the Mock

- **The save bar spans the form and the rail** - it sits at the page's end,
  so it stays on screen on a phone once the rail stacks under the form
- **Hints sit above their control** - every admin field draws its hint
  between label and control; moving them under would mean redrawing each
  field's description by hand
- **Field refusals are a tinted strip under the control** - the mock's red
  hint text would mean redrawing each field's status
- **Badge text stays dark** - the mock's status colour on its tint reads 3.2:1
  for live and 2.4:1 for scheduled, under the 4.5:1 small text needs
- **Segmented options keep a small gap** - flush options with 1px dividers
  would mean reshaping the control's track
- **One control height, 36px** - the mock draws inputs at 39px and nav rows
  at 31.5px
- **Select values and menu items read 13px** - they share the label size
- **Radio and checkbox labels read 14px** - the label sizes itself, out of the
  theme's reach
- **The neutral notice has no border** - the tinted box draws none
- **Unit fields show a clear button** - without it an emptied cost or
  validity reverts when the field loses focus
- **Rail labels sit 8px above their card** - the spacing scale has no 10px
- **No thumbnails or variant counts in the picked list** - the catalogue
  search carries neither
- **Redeem is a 20px outline badge** - the mock's 30px button would be a
  control that does nothing
- **The basket check folds with a chevron** - not the mock's + and –
- **Edit keeps the new reward's subtitle** - "Changes reach the menu on save"
  is untrue for an archived or scheduled reward
- **List terms keep staging's words** - the mock's "off order" and "Free off 1
  variant" name no item
- **A retired handover's note and rail** - the mock draws no reward stored
  as a manual handover or a counter collection; the edit page shows a warning
  note above the kind cards, with no card chosen and no fields for a kind, and
  the rail shows the menu card as the member's menu does, the stored
  handover's sentence and "Finish the coupon to check it."
- **Duplicate and Archive sit under More** - the mock draws neither on the
  edit page; every admin section header keeps its acts under More beside the
  title, at every width
- **Staging's extras stay** - searchable facet pickers in place of chips,
  Everything (free) on any scope, a basket line added by search and removed
  by a button, Duplicate and Archive

## States

| Screen | State | Spec scenario |
| --- | --- | --- |
| New Reward | A kind chosen, fields for that kind shown | `grade10-site-loyalty-programme-SC-158` |
| New Reward | Free item chosen: one variant picker and minimum spend, no discount or scope; the coupon terms and the menu entry as for any choice; a second pick replaces the first | `grade10-site-loyalty-programme-SC-187` |
| New Reward | Free item with a variant picked, then Money off: an amount with none entered, named variants with none picked; back on Free item, no variant picked | `grade10-site-loyalty-programme-SC-253` |
| Edit Reward | Stored 100% with no cap on one variant opens on the Free item card | `grade10-site-loyalty-programme-SC-188` |
| Edit Reward | Stored 100% with a cap, or on two variants, or on one product, opens on Money off | `grade10-site-loyalty-programme-SC-189` |
| New Reward | Money off scoped to named products or a catalog filter: the scope note shows, Online is chosen, In store and Both are unavailable | `grade10-site-loyalty-programme-SC-249` |
| Edit Reward | Stored products reward naming the till opens on Online; moving its scope to named variants shows its stored channels again | `grade10-site-loyalty-programme-SC-250` |
| Save bar | Each missing part named as a button that lands on its field; `Ends before it starts.` on Live until | `grade10-site-loyalty-programme-SC-251` |
| Rail | Each row of Basket Verdicts, and staging's "Finish the coupon to check it." and "Add a line to check." | `grade10-site-loyalty-programme-SC-252` |
| Edit Reward | Stored manual handover or counter collection: the retired handover note above the kind cards, no card chosen, no fields for a kind; the fields beside it save and the handover stays; choosing a card gives it a coupon definition; a duplicate opens on Money off | `grade10-site-loyalty-programme-SC-246` |
| Rail | Stored manual handover or counter collection, no card chosen: the menu card as the member's menu shows it, a counter collection's days to collect and nothing for a manual handover; the sentence reads the stored handover; the basket check reads "Finish the coupon to check it." | `grade10-site-loyalty-programme-SC-246` |
| Rewards List | A retired handover's terms end `retired` | **Out of suite:** copy under the Reward form leaf, `rewardCopy.test.ts` in tasks 6.7 |
| Till panel | A coupon scoped to named products or a catalog filter reads 此優惠只限網上訂單, whatever channels it names, and staff cannot tap it | `grade10-site-loyalty-programme-SC-248` |
| Member's phone | Presenting a coupon scoped to named products or a catalog filter reads `This coupon cannot be used on this sale.`, whatever channels it names, and the sale is unchanged | `grade10-site-loyalty-programme-SC-248` |
| Reward menu | A reward scoped to named products or a catalog filter reads `Online store only`, whatever channels it names | `grade10-site-loyalty-programme-SC-245` |
