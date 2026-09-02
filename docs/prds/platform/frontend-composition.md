---
title: Frontend Composition
spec: frontend-composition
order: 6
---

A feature should reach every application that shows its product without anybody
editing those applications. That is the whole reason this convention exists.

A product's browser code lives in one frontend package, split into feature
slices, and the package publishes all of its slices as a single ordered list.
An application's composition root loads that list and never an individual
slice, so adding a feature is a change in one package rather than in every app
that shows the product. Page code never talks to a backend directly — it asks
the container, which is the one place ports are bound and outbound clients are
built. One slice serves every brand that shows the surface, and the boundaries
are enforced by a check rather than by review.

:::detail{title="For engineers" for="engineer"}
The layout is `packages/<product>/frontend/src/features/<area>/<feature>/`,
each slice holding its own `domain/`, `data/` and `presentation/` behind DI
tokens, with `src/core/` for the client ports. The reserved subpath a package
publishes its list from is `./modules`. Ports only an operator's client can
satisfy belong to the operator-facing package, so a storefront never binds
something it has no client for.

See
[code layout](https://github.com/9gag/grade10/blob/main/docs/conventions/code-layout.md)
and
[what a package exposes](https://github.com/9gag/grade10/blob/main/docs/conventions/packages.md)
in the application repository.
:::
