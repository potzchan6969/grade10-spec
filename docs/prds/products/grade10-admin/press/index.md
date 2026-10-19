---
title: Press
summary: The company site's press releases, media coverage and media contacts.
icon: browsers
---

Press is where operators write what the company site says about Grade10: its
press releases, its media coverage list, and the About blocks and media
contacts every release ends on. The site shows only what an operator
published.

| Page | What it holds |
| --- | --- |
| [Release Editor](/p/grade10-admin/press/release-editor) | One release's words in each language, its images, and the preview |
| [Media Coverage and Settings](/p/grade10-admin/press/coverage-and-settings) | The outlets' headlines, and the About blocks and contacts |
| [Transfer](/p/grade10-admin/press/transfer) | Moving press from one environment to another as one file |
| [Company Site](/p/grade10-site/site/company-site) | Where readers meet what is published |

## Values

| Rule | Value |
| --- | --- |
| Entries | One per release · one media coverage list · one settings |
| States | Draft · Live · Live with changes |
| Languages | EN, 繁, 简 · English required, a missing language reads in English |
| Images | JPEG, PNG, WebP or AVIF · at most 20 MB · no SVG |
| Links | `https:`, `mailto:` or a path on the site |
| Tabs | Releases · Media coverage · Settings · Transfer |

## Permissions

| Permission | Lets the operator | Held by |
| --- | --- | --- |
| `press:read` | Open every tab, read drafts and their preview, export | `admin`, `staff` |
| `press:write` | Create and save drafts, upload images, delete a release, import as drafts | `admin` |
| `press:publish` | Publish, unpublish, and publish on import | `admin` |

- **Staff read** — every field is read-only, and each button says which
  permission it needs
- **Write is not publish** — an operator holding `press:write` alone drafts
  without changing what readers see
- **Every change is recorded** — each save, publish, unpublish, delete,
  import and upload lands in press's own chain of the
  [Audit Trail](/p/grade10-admin/audit)
- ❓ Product - **A press writer who is not an admin** — only `admin` holds
  `press:write` and `press:publish`; whether a marketing or communications
  role drafts or publishes without every other admin grant is unconfirmed

## Entry States

Every entry holds a draft and, once published, what the site shows. Saving
changes only the draft; only Publish changes what readers see.

| State | The site shows | Reached by |
| --- | --- | --- |
| Draft | Nothing | Creating a release, or Unpublish |
| Live | The saved draft | Publish |
| Live with changes | An older draft, while the newer one waits | Saving a change to a live entry |

::image{src="assets/diagrams/press-entry-states.svg" alt="A release from New release to Draft, to Live on Publish, to Live with changes on a save and back to Live on Publish changes; Unpublish returns either live state to Draft, and only a Draft can be deleted"}

- **Unpublish keeps the draft** — the entry goes back to Draft and the site
  shows nothing of it
- **Coverage and settings** — each is one entry, begun by its first save, with
  the same three states; neither is ever deleted

## Releases

The Releases tab lists every release, newest first, with its day, English
title and state.

- **New release** — asks for the slug, the day and the English title, and
  opens the editor on a Draft nobody sees
- **Slug** — lower-case letters and numbers joined by hyphens, such as
  `grade10-fest-summer-2026`; it is the release's address on the site and never
  changes
- **Slug taken** — a slug another release holds is refused
- **Delete** — removes a Draft and its slug for good; it is refused while the
  release is Live or Live with changes, with "Unpublish it first."

## Saving and Conflicts

Every save, publish, unpublish and delete names the version the operator
opened. When someone else changed the entry in between, it is refused and
nothing changes.

- **Someone changed it** — the editor says so and offers Reload; the edits on
  screen are not kept
- **Nothing changed** — a save that changes nothing leaves the entry as it was
- **Images held** — a save, publish or import naming an image this
  environment does not hold is refused
- **Leaving with edits** — the console names what would be lost before it
  leaves the page

:::flow{title="A release reaches the site" diagram="assets/diagrams/press-publish.svg"}
# Save
## *Editor* — **Saves the draft**
The operator saves, naming the revision they opened.
## *Press* — **Checks the images**
Every image the draft names must be in this environment's bucket.
## *Press* — **Writes at the next revision**
The write lands only on the row it was read from; a row someone else moved refuses it.
# Publish
## *Editor* — **Publishes**
Press checks the images again and copies the saved draft to what the site shows. The entry is Live.
# The next request
## *Reader* — **Opens the release**
## *Site* — **Reads what is published**
Press answers from published documents only, never from a cache.
## *Site* — **Answers the page**
The release as published, or not found where nothing is.
:::

:::detail{title="Code map" for="engineer"}
- **Design record** — [press architecture](https://github.com/9gag/grade10/blob/main/docs/architecture/press.md)
- **Contracts** — `@grade10/press-contracts`: documents, bundle, `PRESS_ADMIN_PERMISSIONS`
- **Service** — `@grade10/press-service` in `packages/press/backend`; deployed by `apps/backend/grade10/press` as `grade10-press-service`
- **Console** — `@grade10/press-admin-frontend`; pages in `apps/admin/grade10/src/pages/press`
- **Site reads and renderer** — `@grade10/press-frontend`
- **Grants** — `press` in `ROLE_PERMISSIONS`, `@grade10/auth-contracts`
:::

:::detail{title="Product decisions" for="pm"}
The company site's releases and coverage were a legacy CMS snapshot. Press
moves them into the admin, so the people who write them publish without a
deploy.

| User | Job |
| --- | --- |
| Admin | Write a release in three languages, check it as readers will see it, and publish it |
| Staff | Read what is drafted and what is live |
| Engineer | Move content from staging to production without touching a database |

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Draft and published | Decided | Every entry keeps a draft beside what the site shows, so an operator edits a live release without readers seeing half a change. | Product |
| Write apart from publish | Decided | `press:write` drafts and `press:publish` changes the site, so drafting can be granted without the power to publish. | Product |
| Slug fixed at creation | Decided | A release's slug is its public address; it never changes, so a link someone shared never breaks. | Product |
| Delete refused while live | Decided | A release on the site is unpublished before it is deleted, so nothing readers can open disappears by one click. | Product |
| Revision conflicts | Decided | Each write names the version read and is refused when it moved, so two operators never overwrite each other unseen. | Engineering |
| Its own worker on D1 | Decided | Press runs in a worker of its own, on a D1 database and an image bucket only press uses, and holds no Postgres connection and no secret, so press owns its data as every service does. | Engineering |
| D1 backup | Decided | D1 Time Travel restores the database to any minute of the last 30 days. | Engineering |
| ❓ Offsite D1 backup | Open | Whether press needs a copy outside Cloudflare, as the Postgres products have, is a follow-up. | Engineering |
| ❓ Unused images | Open | No sweep removes an image no document names; it stays stored until one is built. | Engineering |
:::
