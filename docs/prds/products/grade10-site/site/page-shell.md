---
title: Page Shell
spec: grade10-site/site/page-shell
order: 1
---

One wrapper renders every surface of the site, not-found included, so no
surface can ship without the site around it. It gives the page exactly one
banner, one main and one contentinfo landmark, and adds no heading, copy or
spacing of its own — everything a collector reads comes from the surface
inside it.

The chrome does not wait for the session. Header and footer render on the first
paint, and when the session arrives nothing appears, disappears or moves, so
the page never jumps under someone's finger. The account control simply leads
somewhere different: the profile when they are signed in, sign-in when they are
not.

Controls exist only when there is something behind them. The Cart Drawer gives
Store surfaces and checkout a Cart control; unrelated surfaces have none.
Search still waits for a search surface, and no link points to a page the site
does not hold. The header marks the item that owns the current address, and
marks nothing when no item owns it.

Sign-out has exactly one home — the profile. The header offers no way to do it,
so a collector never has to guess which of two controls ended their session.

::figma{url="https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4171-9653" title="Footer — the site footer"}

::story{id="components-nav--default" title="The header with every control present"}

::story{id="components-nav--without-cart" title="The same header where the site answers no cart"}

::story{id="components-nav--narrow" title="The header reflowed at a small width"}

## Test cases

::cases{id="grade10-site/site/page-shell"}
