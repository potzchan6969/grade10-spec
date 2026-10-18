## Goals

- A collector following a release row reads the article inside the same
  shell: its title, publish date and location, the feature image, and
  the body an editor composed — at any viewport.
- The body draws every element the CMS gives an editor in the
  template's own styles: paragraphs, bold and inline links, headings
  two through six, bullet and numbered lists, blockquotes, and images
  with or without captions.
- Every article shares the fixed sidebar — About Grade10, About
  MemeStrategy, Media Enquiries — sticky beside the body on a wide
  viewport and after it on a narrow one.
- The Press breadcrumb returns the reader to `/press-releases`.
- The workbench renders the template before the site consumes it — one
  real article at a wide and a narrow viewport — and the list's rows
  and the Shows page's press-release links open it.

## Non-Goals

- No admin portal or CMS editing surface — this change draws the
  reading side of the template; the editing experience is the admin
  portal's own capability.
- No per-article work — the workbench carries one sample article; the
  other releases answer the same template.
- No navigation entry placement — undecided on the record page, still
  undecided here; the header marks no item current.
- No routing, data fetching, or page shell changes — those belong to
  the implementing site and to `page-shell` / `navigation`.
- No share-metadata or crawler work — the feature image's 1200:630
  ratio is recorded because it doubles as the article's OG image;
  emitting the tags is `crawlable-pages`' and the consuming site's.
- No new primitives or blocks — the template composes `Breadcrumbs`,
  `Badge`, `Card` and `Link` as they stand.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Which article does the sample carry? | The CARDJOY x Grade10 Guangzhou release, verbatim - decided by the round | A placeholder article — the frame was drafted over this release, and the real copy proves the template |
| Q2 | What does the current breadcrumb crumb show? | The fixed label "Press Release" - decided by the designer | The article title — over a hundred characters of crumb that would wrap or clamp against its own link |
| Q3 | Where do the sidebar cards sit on a narrow viewport? | After the article - decided by the designer | Before the article — pushes the body the reader came for below the fold |
| Q4 | Which capability holds the article? | `grade10-site/site/press` — the record's surface gains its second screen - decided by the round | A new `press-article` capability and manual page — splits one record across two pages; carried-surfaces already holds two screens in one feature |
| Q5 | Which caption tone? | `Base/secondary-foreground` on every figure - decided by the round | `Base/muted-foreground` on the first figure — the frame mixes the two; the majority binding wins |
| Q6 | Which date style on the badge? | `Sep 15, 2026` — the live page's month-first title casing - decided by the designer | `SEP 15, 2026` — the record page carried it until design confirmed |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| `grade10-site/site/press` | Does the current breadcrumb crumb name the article? | Q2 |
| `grade10-site/site/press` | Where do the sidebar cards sit on a narrow viewport? | Q3 |
| `grade10-site/site/press` | Is the badge's date `SEP 15, 2026` or `Sep 15, 2026`? | Q6 |

