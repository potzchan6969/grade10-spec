## 1. Product frontend packages publish their module lists (grade10) (owner: @sean)

- [x] 1.1 Publish `auth-frontend`'s module list at a `./modules` subpath, gathering the sign-in slice's module, and add the list file to the package's tsconfig `include` — satisfies "A package defines a single feature slice"
- [x] 1.2 Publish `store-admin-frontend`'s module list, gathering the orders slice — satisfies "An admin frontend package is composed"
- [x] 1.3 Publish `auction-admin-frontend`'s module list, gathering the bidders, fulfillment, listings, sales and settlements slices — satisfies "An admin frontend package is composed"
- [x] 1.4 Publish `audit-admin-frontend`'s module list, gathering the trail slice — satisfies "An admin frontend package is composed" and "A package defines a single feature slice"
- [x] 1.5 Point each package's own test harness at its published list where the harness stands in for a whole application — satisfies "A test exercises one feature slice"
- [x] 1.6 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run check:libs`, `pnpm run check:handbook`

## 2. Core-module factories name their product (grade10) (owner: @sean)

- [x] 2.1 Rename `store-frontend`'s core-module factory to carry its product, updating every call site in one commit — satisfies "A package publishes a core-module factory"
- [x] 2.2 Rename `loyalty-frontend`'s core-module factory to carry its product — satisfies "A package publishes a core-module factory"
- [x] 2.3 Rename `store-admin-frontend`'s core-module factory from its layer to its product, so it reads unambiguously beside the auction admin factory — satisfies "A composition root installs several core modules"
- [x] 2.4 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`

## 3. Composition roots load lists (grade10) (owner: @sean)

Needs group 1's admin lists landed — an application cannot load a list its package does not publish yet. The auth and storefront work in 3.1 does not.

- [x] 3.1 Switch every storefront and admin composition root from the sign-in module to `auth-frontend`'s published list, and the storefront test harness with them — satisfies "An application composes a product"
- [x] 3.2 Switch both admin panels from the seven named feature modules to one published list per product — satisfies "An application composes several products"
- [x] 3.3 Leave the four single-slice sign-in page tests loading one module directly, and confirm no other consumer does — satisfies "A test exercises one feature slice"
- [x] 3.4 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run build`

## 4. Applications group their outbound clients (grade10) (owner: @sean)

- [x] 4.1 Group the grade10 storefront's session and procedure clients into a client directory, with the shared response cache as its own module beside them — satisfies "An application constructs its clients" and "Cache-wide policy is added"
- [x] 4.2 Group the ZZZ storefront's clients the same way — satisfies "An application constructs its clients"
- [x] 4.3 Group each admin panel's session client beside its existing per-backend procedure clients, keeping the shared cache its own module — satisfies "An application constructs its clients" and "Cache-wide policy is added"
- [x] 4.4 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run build`

## 5. Durable guidance (grade10) (owner: @sean)

- [ ] 5.1 Record the published-list surface and the composition-root rule in `docs/conventions/packages.md`, including which packages publish a list
- [ ] 5.2 Record the client directory and the product-named factory in the `react-clean-architecture` and `frontend-structure` skills, replacing what they say today rather than appending to it
- [ ] 5.3 Verify: `pnpm run agent:check-parity`, `pnpm run check:handbook`
