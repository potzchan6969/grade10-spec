## 1. The listings slice publishes what a route needs (grade10) (owner: @sean)

- [x] 1.1 Publish a read of one lot from the listings slice, over the same
      repository its hook resolves, so a route loader can read a lot where no
      component exists — one fixture binding covering both callers.
- [x] 1.2 Let the lot view start from a lot a route already read, rather than
      opening a second empty read, making `The served lot stays on screen`
      pass: nothing the document carried is replaced by the skeleton, and the
      view still refetches so bidding stays live.
- [x] 1.3 Take the instant the page is rendered at as data rather than reading
      the clock during render, making `A value that follows the clock carries
      on` pass — the served render and the browser's first render agree, and
      the countdown ticks after mount.
- [x] 1.4 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`.

## 2. A lot's address becomes its own surface (grade10) (owner: @sean)

Needs group 1's read landed — the route has nothing to call until it exists.

- [x] 2.1 Declare the lot in the site's table of addresses as a surface
      rendered when its address is asked for, mint every lot link from that
      declaration, and register it in the site's route table — making
      `A nested surface answers for itself` and `A nested surface renders for
      itself` pass, with the auction still answering the addresses beneath it
      that no surface names.
- [x] 2.2 Read the lot in the route and refuse an id the catalogue publishes
      no lot for, making `A lot the catalogue publishes answers` and `An id
      the catalogue publishes no lot for` pass — 404 and the site's not-found
      surface, never the catalogue.
- [x] 2.3 Carry the lot's own title, description and canonical address in the
      served document, making `A lot answers whole`, `Two lots, two pages` and
      `A preview fetcher reads a lot` pass — evidenced in the served-document
      and hydration lanes, which is where a lot rendered on the server is
      first held to what it serves.
- [x] 2.4 Keep the sitemap naming the surfaces the build writes a document
      for and no lot, making `The sitemap is exact`, `The sitemap names no
      pattern` and `The sitemap names no lot` pass — an unfilled parameter in
      place of a lot must fail the check the way one in place of a card does.
- [x] 2.5 Open a lot from the auction catalogue without a page load, making
      `A lot is opened from the catalogue` pass.
- [x] 2.6 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`,
      `pnpm run build`.

## 3. The site's own account of what it serves (grade10) (owner: @sean)

- [x] 3.1 Bring `docs/architecture/serving.md` in line with what the site now
      does: a lot link is the lot, a surface owns what is beneath it unless a
      nested surface names that address, and the parameter a card's address
      carries is the handle.
- [x] 3.2 Take the serving lab's lot address from the auction catalogue
      rather than a made-up id, so every address it lists is one that exists —
      the way it already sources a card's.
- [x] 3.3 Name `/listings`, `/bids` and `/watches` on the auction frontend's
      handbook card, which this change reshapes by publishing a read from the
      listings slice. `pnpm run check:handbook` fails on these today,
      independently of this change.
- [x] 3.4 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`,
      `pnpm run check:handbook`.
