# Tasks

Group 1 is the card, in **grade10-spec**, and reaches the site through a
submodule bump — group 2 depends on nothing but that bump, because the front
door already supplies no handler and so loses its cart the moment the card
stops drawing one. Why the handler is the signal rather than a flag:
[`tech-design.md`](tech-design.md).

## 1. The card sells only where it is asked to (grade10-spec) (owner: @sean)

- [ ] 1.1 Draw the cart control only where a quantity-change handler was supplied and the product is not sold out, so *A surface that does not sell* (`SC-55`) passes and the stories that keep their handler keep their cart
- [ ] 1.2 Make the four cart words optional on the card's copy type, so a surface drawing no cart supplies none — `soldOut` and `sale` already are
- [ ] 1.3 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run design-sync:check`

## 2. The front door merchandises (grade10)

Needs group 1's bump.

- [ ] 2.1 Stop supplying cart words the row cannot honour, so *The row does not sell* (`SC-23`) passes and a card opens its product's page instead
- [ ] 2.2 Pass the sold-out condition the row already reads, so *A card the shop has sold out* (`SC-21`) passes
- [ ] 2.3 Pass what a marked-down card used to cost, on the same rule the rest of the store reads a compare-at by, so *A card the shop has marked down* (`SC-22`) passes
- [ ] 2.4 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`

## 3. The manual (grade10-spec)

- [ ] 3.1 Say on the front door's page that its row merchandises rather than sells, and record why a control the surface cannot honour is worse than none
- [ ] 3.2 Verify: `pnpm check:manual`

## 4. Archive hand-off (grade10-spec)

Runs after the change is deployed, not when it merges.

- [ ] 4.1 Copy each delta's `## Feature set` groups into its durable capability, and merge the change's home test cases into the capability's approved suite rather than writing over it
- [ ] 4.2 Verify: `pnpm check:manual`, `pnpm run archive:preflight`
