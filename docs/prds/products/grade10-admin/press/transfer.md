---
title: Transfer
order: 3
---

Press content moves between environments as one file: exported where it was
written and checked, imported where readers will see it. Staging and
production share no database, so the file is all that crosses.

## Values

| Rule | Value |
| --- | --- |
| Export takes | What the site shows: every published entry, or the ones chosen |
| File | `press-<environment>-<UTC day>.json`, such as `press-staging-2026-10-19.json` |
| Format | `grade10.press/1` |
| Images | Every image the entries name, inside the file |
| Import writes | Drafts, unless Publish imported is on |
| Import lands | Whole, or not at all |
| Export needs | `press:read` |
| Import needs | `press:write`, and `press:publish` to publish on import |

## The Bundle

- **Entries** — each entry's published document: its kind, its slug and the
  document
- **Images** — the original bytes of every image an entry names, under the
  name it is stored by
- **Source** — the environment it came from and when, shown before import
- **Drafts stay behind** — a draft nobody published is not in the file

## Import Preview

Before anything is written, the import shows what each entry would change.

| Draft | Means |
| --- | --- |
| New | No entry here has that slug yet |
| Changes | The draft here differs from the file |
| Same | The draft here already says what the file says |

| Site | Means |
| --- | --- |
| Shows this | The site here already shows the file's version |
| Shows another version | The site here shows something else |
| Not on the site | Nothing of it is published here |

- **Missing images** — the preview counts the images this environment does
  not hold yet; they are uploaded before the entries are written
- **Publish imported** — offered only to an operator holding `press:publish`;
  the button reads Import as drafts or Import and publish
- **After import** — each entry reads Written or Already the same, and
  Published or Unchanged

:::flow{title="Press moves from staging to production" diagram="assets/diagrams/press-transfer.svg"}
# Export on staging
## *Staging admin* — **Exports what the site shows**
Everything on the site, or the entries chosen.
## *Staging admin* — **Reads each image**
Each image the entries name, as the original.
## *Staging admin* — **Saves the bundle**
One JSON file, such as `press-staging-2026-10-19.json`, saved by the browser.
# Import on production
## *Production admin* — **Reads the file**
The file is read in the browser; one that is not a press bundle is refused before anything is sent.
## *Production admin* — **Previews the import**
New, changed or the same for each entry, the revision each was read at, and the images missing here.
## *Production admin* — **Uploads missing images**
Each image is stored by its content, so its stored name must equal the name the file gives it.
## *Production admin* — **Imports**
Every entry at the revision the preview read, as drafts or published.
## *Production press* — **Writes in one batch**
All the entries land together, or none do.
:::

## Retries and Refusals

- **Same file twice** — changes nothing: an entry that already stands as the
  import would leave it counts as done, so an import retried after it landed
  writes nothing new
- **An entry moved on** — when someone changed an entry here after the
  preview, nothing is imported; the preview is read again for the operator to
  check and import again
- **An image under another name** — nothing is imported, and the operator is
  told to export the bundle again
- **Not a bundle** — a file that is not JSON, names another format, or was
  edited by hand is refused with what is wrong

| Refusal | The operator reads |
| --- | --- |
| Chosen entry not published | It is not published, so there is nothing of it to export. |
| One entry twice | The file names the same entry twice. Export it again. |
| Publish without the grant | Publishing needs press:publish. Import without publishing, or ask a colleague who holds it. |
| Image not held | An image it names is not in this environment's bucket. Upload it again. |

## Legacy Content

The legacy site's nineteen releases, its coverage, its settings and their
images came in as one bundle, imported on staging and exported from there to
production. The legacy logos were turned into pictures on the way, since SVG
is refused.

:::detail{title="Code map" for="engineer"}
- **Bundle** — `pressBundleSchema`, `PRESS_BUNDLE_FORMAT` in `@grade10/press-contracts`
- **Console** — `ExportBundle`, `ImportBundle`, `TransferPanel` in `@grade10/press-admin-frontend`
- **Legacy bundle** — `scripts/press/legacy-bundle.mjs`
- **Design record** — [press architecture](https://github.com/9gag/grade10/blob/main/docs/architecture/press.md#moving-content-between-environments)
:::

:::detail{title="Product decisions" for="pm"}
| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| A file, not a sync | Decided | Staging and production are separate accounts with separate databases; the browser builds and reads the file and no worker holds one, so nothing connects the two environments. | Engineering |
| Published only | Decided | Export takes what the site shows, so an unfinished draft never travels. | Product |
| Drafts by default | Decided | An import writes drafts unless the operator turns on Publish imported, so content checked on staging is read once more before readers see it. | Product |
| All or nothing | Decided | One revision that moved since the preview refuses the whole import, so production never holds half a bundle. | Engineering |
| Images by content | Decided | An image is stored under its content's hash, so the same picture imported twice is stored once and a changed one cannot pass under an old name. | Engineering |
:::
