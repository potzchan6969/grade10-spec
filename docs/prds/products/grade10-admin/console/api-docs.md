---
title: API Docs
spec: grade10-admin/console/api-docs
order: 1
---

Every procedure the Grade10 backends mount, read off the routers themselves:
what a call is named, who may make it, and the shapes it takes and gives back.
A surface for engineers, not operators — staging and local builds carry it, a
production build drops it.

- **Services rail** — each backend, the routers under it, and how many
  procedures each holds
- **Procedure list** — a router's calls with kind, caller, and a one-line
  summary of input and of output
- **Procedure detail** — the dotted path, the wire path the call lands on, the
  caller with its grant, and a field table each way
- **Filter** — narrows every service at once, by dotted path, by grant, or to
  one audience
- **URL** — `admin.grade10.com/api-docs`, under the Dev heading

## Who a call is for

Three audiences, read off the caller word each procedure carries and named
beside the filter, which narrows to one of them —
[[grade10-admin-console-api-docs-SC-16]]:

- **Site** — `public`, `session`, `session · fresh`; the brand's
  customer-facing sites, signed in or not
- **Console** — `elevated`, holding the grant beside the word; this console
- **Machine** — a service principal in place of a person; the till today

Nothing listed is internal: no worker calls another over these ladders. Where
one worker only fronts a call — the store's `auction.*` hands bidding to the
auction worker — the procedure names the service that does the work.

## What keeps it true

- **Generated** — one document per service, walked off the router it mounts;
  no line of it is written by hand
- **Checked** — `pnpm run test:backend` regenerates every service in memory
  and fails on the first procedure that differs, naming the service and the
  path
- **Provenance** — the page names the commit its build was made from, and
  because the check passes only where documents and routers agree, that is the
  commit they were read from
- **Undeclared is said** — a procedure that declares no output shape says so,
  and its service counts how many do; nothing is inferred from what the code
  happens to return

## What it looks like

There are no Figma frames for the admin, by decision. The layout is drawn on a
canvas: [Grade10 API Docs](https://claude.ai/code/artifact/9b0c8ff4-71ca-4132-80c8-4e12369580c6)
— the console shell with the surface under Dev, the services rail, one
router's procedure table, and the detail panel for one procedure.

:::detail{title="Product decisions" for="pm"}
Reading a backend contract means reading its router. Over two hundred
procedures across eight services already declare their caller, their grants
and their input shape; this surface renders that declaration rather than
keeping a second copy of it, so what the page says and what the server
enforces cannot part company.

| User | Job |
| --- | --- |
| Engineer | Wire a console or storefront feature to a call without opening its router |
| QA reviewer | See every procedure one grant reaches, across all services at once |
| Backend reviewer | Find the calls that declare no output shape |

| Measure | Reading |
| --- | --- |
| Procedures declaring an output shape | 37 of 101 across store and auction when the surface was built; the page printing "not declared" beside a call is what makes closing the gap worth doing |
| Contract changes the drift check refuses | Counted before they merge |

Non-goals:

- **Not procedures** — the public catalogue and auction browse reads, provider
  webhooks, the carrier callback, media and proof uploads, the till's token
  handshake, analytics ingestion, dev fixtures
- **Not prose** — the doc comments above each procedure are not carried
- **Not OpenAPI** — no OpenAPI document, no third-party viewer
- **Not a client** — a call is never executed from the page
- **Not ZZZ** — the generator reads the Grade10 assembly; the ZZZ console is
  untouched

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Source | Decided | Generated off the routers and checked on every build; a document that disagrees with its router fails the backend test lane. | Engineering |
| Availability | Decided | A development surface under Dev, absent from a production build, needing no grant beyond what opens the console. | Product |
| Caller words | Decided | Recorded once on the shared procedure ladder, so eight services name the caller the same way and none restates it. | Engineering |
| Store's ladders | Decided | Both — the session ladder and the till's own — in the store's document, named apart. | Product |
| Provenance | Decided | The commit rides the build, not the document, so the same routers still produce byte-identical output. | Engineering |

Risk: Effect is a release candidate, and the walker leans on a validator's
schema AST surviving conversion and on the shape of its JSON Schema output. A
version bump that changes either fails the drift test loudly rather than
emitting a document that is quietly wrong.
:::

::cases{id="grade10-admin/console/api-docs"}
