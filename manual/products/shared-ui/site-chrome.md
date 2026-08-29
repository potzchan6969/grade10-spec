---
title: Site header and footer
summary: The chrome both brands wrap every page in, which owns the layout and none of the words.
spec: shared-ui/site-chrome
order: 2
---

Two components make the chrome: a site header and a site footer. Each is usable
on its own, and between them they are what every storefront page sits inside.

A header control appears only when the application supplies a handler for it, so
nothing on screen is dead — no search box that searches nothing, no cart icon
over a store with no cart. A region of the header with nothing in it is absent
rather than empty, and a footer section with no content is dropped the same way.

::spec{id="shared-ui/site-chrome" requirement="A control renders only when it can act"}

The chrome can mark which surface is being viewed, and it invents no copy: every
word and every destination comes from the application. That is what lets the
same header wear another brand's words without a fork.

::figma{url="https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4171-9937" title="Nav — the site header"}

::figma{url="https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4171-9653" title="Footer — the site footer"}

::story{id="components-nav--default" title="The header with every control"}

::story{id="components-nav--another-store" title="The same header wearing another brand's copy"}

::story{id="components-footer--column-with-no-links" title="A footer section with nothing to link to stays empty"}

The site's own rules for what the shell must do — the landmarks, the session
timing, the small-width reflow — are [the page shell's](/p/grade10-site/page-shell).
This capability is the component contract underneath it.

## The contract

::spec{id="shared-ui/site-chrome"}
