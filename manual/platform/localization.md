---
title: Localization
summary: Which languages each brand speaks, and where every word on a page comes from.
spec: localization
order: 4
---

Each brand states which languages its site speaks and which one is the default.
Every user-facing string then comes out of that brand's catalogs — no surface
carries copy of its own — while anything a merchant or a seller typed renders
in the language it was written in rather than being translated at read time.

One shared vocabulary of keys names every string. A brand answers only the keys
that say something about itself (its name, who runs it, what its surfaces are
called) and inherits the rest, so adding a language is filling in a catalog
rather than hunting through screens. A key nothing answers fails the build
before anything ships.

A collector's first visit takes the language from their browser's stated
preferences; an explicit pick applies immediately and wins on every return.
Each language answers at its own public address so search engines and shared
links land in the right one, each page declares its active language for
assistive technology, and the sign-in email arrives in the language of the page
the sign-in started from. Admin panels are out of scope by decision — operator
copy is literals.

:::callout{kind="warning"}
Coverage is complete, but review is not: `zh-Hant`, `zh-Hans` and `ko` were
drafted by engineers with machine assistance and have never been read by a
native speaker. Register and terminology are the risk. Get them reviewed before
either language is promoted as a supported market.
:::

## The contract

::spec{id="localization"}
