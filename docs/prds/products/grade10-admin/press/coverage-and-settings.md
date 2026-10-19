---
title: Media Coverage and Settings
order: 2
---

The two press entries that are one of a kind: the list of outlets that wrote
about Grade10, and the About blocks and media contacts every release ends on.
Each has a Save, Publish and Unpublish of its own and the three states every
press entry has — [Press](/p/grade10-admin/press#entry-states).

## Media Coverage

One list, in the order the site shows it. A reorder is one save, and the site
shows the new order once it is published.

| Field | Required | Notes |
| --- | --- | --- |
| Outlet | Yes | The outlet, as its logo reads: Bloomberg |
| Headline | Yes | In the outlet's own words |
| Language | Yes | English, Traditional Chinese or Simplified Chinese; the site shows the headline as written, whatever the reader's language |
| Link | Yes | An `https:` address |
| Logo | No | An image under the release editor's rules — [Images](/p/grade10-admin/press/release-editor#images) |

- **Rows** — added at the end, moved up or down, removed
- **Refused save** — names the first row missing its outlet, its headline or
  an `https:` link

## Settings

Written in each language, EN, 繁 and 简, as a release is; a language left
empty reads in English on the site.

| Part | Fields | Where the site shows it |
| --- | --- | --- |
| About blocks | Title · text | Under every release that uses the default About blocks |
| Contacts | Label · detail · name, optional · more lines | Beside every release |

- **Label** — what they answer: Media enquiries
- **Detail** — how to reach them: press@grade10.com
- **More lines** — one line each: a title, a phone number
- **A release's own About blocks** — a release that turns off Use default
  About blocks starts from a copy of these and keeps its own from then on —
  [Release Editor](/p/grade10-admin/press/release-editor#fields)
- **Published settings only** — the site reads the published settings; a
  saved change reaches every release once Settings is published

:::detail{title="Code map" for="engineer"}
- **Editors** — `CoveragePanel` and `SettingsPanel` over `SingletonEditor` in `@grade10/press-admin-frontend`
- **Documents** — `coverageDocumentSchema`, `settingsDocumentSchema` in `@grade10/press-contracts`
:::
