## 1. Public codes (grade10)

- [x] 1.1 Read the shop's live code discounts tagged `public`, kept a minute per isolate, the last list kept when the shop does not answer (`readPublicCodes`, `siteDiscounts.test.ts`)
- [x] 1.2 Quote a public code against the basket by the shop's rules and list it to guests alone and to members beside their own codes, fit first then soonest to lapse (`quote.test.ts`)
- [x] 1.3 Send a typed public code to the draft as the shop spells it, in the order's one code slot (`checkout.test.ts`)
- [x] 1.4 The drawer lists public codes to a guest in their own section and to a member in the merged list (`CartDrawerHost`, `CartDrawer.test.tsx`)

## 2. Shared UI (grade10-spec)

- [x] 2.1 `CartDrawer` takes `publicPromoCodes` and `copy.publicPromoCodes`, merging them with held codes; stories for a guest and a member with public codes

## 3. Record (grade10-spec)

- [x] 3.1 Requirement deltas for discounts, the cart drawer and the shared store cart, folded into the durable specs
- [ ] 3.2 Figma frames for the merged picker — blocked: needs the designer in Figma

## 4. The walk (grade10)

- [ ] 4.1 Walk a guest and a member picking and typing a public code through to Shopify's invoice — blocked: needs a Shopify shop with a discount tagged `public`
