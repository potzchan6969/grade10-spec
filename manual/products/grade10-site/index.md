---
title: Site
---

`grade10-site` is not a product a collector thinks about — it is the site
itself. Everything that belongs to grade10.com rather than to the store, the
auction or the vault inside it lives here, and every surface those products
ship is wrapped in it.

Three things make up the site, and they divide by *when* they act. The
**page shell** is what wraps every surface: one header, one main region, one
footer, for the marketing page, the store, the auction, the profile, sign-in
and not-found alike. **Crawlable pages** is what an address serves before any
script runs — real title, description and copy in the first response.
**Navigation** is what happens once the site is running in the browser: which
surface an address resolves to, and what moving between them preserves.

The audience is the collector throughout. There are no operator journeys here;
the admin consoles have their own shell and their own navigation, and are not
part of this product.

:::flow{title="Opening a surface cold"}
## The collector taps a link

The first response carries that surface's own title, description, headline and
static copy — already inside the shell, with one banner, one main and one
footer landmark.

## The chrome is already there

The header and footer render before the session has resolved, and they are not
waiting for it.

## Scripts arrive

They make the served surface interactive. Nothing that was on screen is replaced
by a placeholder.

## The session resolves

No chrome control appears, disappears or moves. The account control now leads to
the profile rather than to sign-in.

## They navigate

The next surface loads in the page, downloading only its own code, and the
document title becomes that surface's. Pressing back returns them to where they
were, at the scroll position they left.
:::

::figma{url="https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4171-9023" title="Store page — the reference assembly the shell was drawn against"}

:::callout{kind="note"}
The header and footer have frames; the not-found surface, the marketing page
and the profile do not. What those three look like is settled in code and in
Storybook rather than in Figma.
:::
