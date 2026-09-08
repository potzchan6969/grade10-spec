<!-- The journeys this capability's scenarios accept. At most five across every
     capability the change touches. Title each one actor first, then the action,
     in the third person. A capability no end user reaches on its own - a
     cross-cutting policy, a package contract, a backend convention, a surface
     only its makers reach - keeps the `## User journeys` heading and replaces
     every story with one line: `**Walked by:** nobody on their own - <who
     inherits it, and which capability's journeys reach it instead>`. Never
     invent an actor to fill one; never leave the file out either -
     `pnpm check:manual` fails both. -->

<!-- The role is somebody who uses the product, or an outside agent that acts
     on its own - a crawler, a preview fetcher, a provider calling back. Never
     software this repository ships (an application, a service, a caller, a
     package): that is the system's side, and the journey belongs to whoever
     operates it. Never whoever builds the product either - an engineer, a
     developer, a reviewer walks a test or a working step, not a journey. -->

<!-- A single scenario needs no journey. Leave a package's export list, a copy
     shape, or a defaulting rule no surface shows out of every
     `**Accepted by:**`, for QA to name under `**Out of suite:**`. -->

<!-- <capability> is the capability's path with slashes as hyphens:
     grade10-site/store/product-listing issues
     grade10-site-store-product-listing-SC-01, -US-01, -US1-TC1-1. -->

## User journeys

### <capability>-US-01: <!-- Collector does the thing -->

**As a** <!-- role the spec already names -->,
**I want** <!-- capability -->,
**so that** <!-- benefit the requirements already justify -->.

**Accepted by:**

- `<capability>-SC-01` — <!-- scenario title, as written in spec.md -->
