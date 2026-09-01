---
title: Package Rules
spec: shared-ui/component-package
order: 1
---

This capability governs the package rather than any component in it. A compound
component a spec names is written here once and imported by every store
application, from source through the submodule — there is no build step and no
published artifact, so a change is visible to its consumers the moment it lands.

Components are app-neutral. They take product state and content as props and
report every interaction through a callback; fetching, storage, navigation,
analytics and importing an application are all out of bounds. Words arrive as
one typed copy group, so no store's sentence is hard-coded in a shared file, and
styling resolves through design tokens one way, so a token-named utility always
means that token's value.

:::callout{kind="warning"}
Seven block groups ship in the package without a durable spec. Three have no
written contract anywhere — two-factor, loyalty membership, and order detail —
though all three ship components, types and stories. Four more are specified
only inside an in-flight change: order history, profile, sign-in, and the
auction record. A reader should not take the capability list below as the list
of what the package contains.
:::

:::detail{title="How it is laid out" for="engineer"}
The package composes the design system's primitives; the design system owns
tokens and single-purpose controls, and this package owns the compound blocks
built from them. Conventions are in
[docs/conventions/packages.md](https://github.com/9gag/grade10/blob/main/docs/conventions/packages.md)
and
[docs/conventions/code-layout.md](https://github.com/9gag/grade10/blob/main/docs/conventions/code-layout.md);
the component contract and testing rules are in the spec store's governance
docs.
:::
