# Tasks: Adopt React Router

Groups 1–3 land in the grade10 repository, in order — each builds on the
one before. Group 4 lands in this store and blocks nothing: it can run any
time after this change is accepted.

## 1. Framework foundation (owner: @sean)

- [x] 1.1 Make `A nested address answers as its surface` and `An unknown
      address resolves to not-found` pass: the application builds through
      the framework's Vite plugin, with a root module carrying the shell
      and one thin route module per surface over its existing page.
- [x] 1.2 Make `A chrome link navigates in place`, `A modified click is the
      browser's`, and `Another origin is the browser's` pass: the document
      click seam delegates matched clicks to the router and the hand-rolled
      address hook retires, with every existing page-shell scenario green.
- [x] 1.3 Run typecheck, lint, and the app's test lane as this group's
      verification.

## 2. Session-decided addresses (owner: @sean)

- [x] 2.1 Make `A signed-out collector asks for the profile`, `A signed-in
      collector asks for sign-in`, and `Back never returns to a corrected
      address` pass: the session correction renders the corrected surface
      and replaces the history entry.
- [x] 2.2 Make `A public surface does not wait` pass: only the two
      session-decided addresses hold for the session.
- [x] 2.3 Run typecheck, lint, and the app's test lane as this group's
      verification.

## 3. The collector's place and payload

- [ ] 3.1 Make `Back returns to where they were` and `A new surface starts
      at the top` pass: scroll restoration keyed to history entries.
- [ ] 3.2 Make `The first visit pays for one surface` and `The destination
      loads on arrival` pass: each route module loads its page lazily, and
      the built output carries no surface's page code in the entry chunk.
- [ ] 3.3 Run the full check suite and a production build as this group's
      verification.

## 4. Realign the crawlable change

- [ ] 4.1 Rewrite `add-crawlable-public-pages`'s design.md to derive from
      this foundation: identity as route-module `meta`, emitted pages from
      the framework's prerender, the address seam the framework's own —
      its delta specs untouched.
- [ ] 4.2 Revise that change's tasks.md to the collapsed shape and run
      `openspec validate` strictly across the store as this group's
      verification.
