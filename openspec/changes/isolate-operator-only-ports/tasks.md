## 1. The operator-facing auth package (grade10) (owner: @sean)

- [x] 1.1 Stand up the product's operator-facing frontend package with its own
      token namespace, a core-module factory taking the operator client as a
      required dependency, and a published module list — satisfying "A core
      module is offered a port only some consumers can supply" and "A product
      gains a slice only an operator may reach"
- [x] 1.2 Move the second-factor port, its fixture and the slice that resolves
      it out of the collector-facing package, leaving that package's port set
      to what every surface can satisfy — satisfying "A collector-facing
      application composes the product"
- [x] 1.3 Replace the slice's optional-port negative test with one asserting
      the slice resolves nothing without its core module, and give the new
      package the module-list test every frontend package carries
- [x] 1.4 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`

## 2. The admin panels' composition (grade10) (owner: @sean)

- [x] 2.1 Install the new package in both panels and compose it at each
      composition root — its core-module factory with the operator client, then
      its published list — removing the by-name slice load and the comment
      standing in for the boundary, satisfying "An operator-facing package is
      composed by a panel"
- [x] 2.2 Repoint the panels' second-factor screens at the new package, leaving
      each brand's copy and arrangement as it is
- [x] 2.3 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`,
      `pnpm run build`

## 3. Durable guidance (grade10) (owner: @sean)

- [x] 3.1 Record where an operator-only port lives in the package conventions,
      add the new package to the Handbook and correct the collector-facing
      package's card, and add it to the frontend-architecture skill's sibling
      packages
- [x] 3.2 Verify: `pnpm run check:libs`, `pnpm run check:handbook`,
      `pnpm run agent:check-parity`, `pnpm run lint`
