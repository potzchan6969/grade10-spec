---
title: Release Editor
order: 1
---

One release at `/press/releases/<slug>`: its day and hero, its words in each
language, and the About blocks it ends on, beside the site's own release page
drawing the draft.

## Values

| Rule | Value |
| --- | --- |
| Languages | EN, 繁, 简 · English required |
| A language is filled | Title, excerpt and body all written |
| Images | JPEG, PNG, WebP or AVIF · at most 20 MB |
| SVG | Refused |
| Links | `https:`, `mailto:` or a path on the site, such as `/about/company` |
| Preview widths | Phone · desktop |

## Layout

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ ← Press releases   Grade10 Fest Summer 2026            [Live with changes]   │
├──────────────┬────────────────────────────────┬──────────────────────────────┤
│ Release    ✓ │ Release                        │ Customer view                │
│ Words      ✓ │  Day           2026-07-12      │  [Phone] [Desktop] [EN 繁 简] │
│ On the site  │  Hero image    [image] Alt text│ ┌──────────────────────────┐ │
│              │  [x] Use default About blocks  │ │ PRESS RELEASE            │ │
│              │                                │ │ Grade10 Fest Summer 2026 │ │
│              │ Words                          │ │ HKSAR, China · 12 Jul    │ │
│              │  [EN · Filled][繁 · Filled]    │ │ Highlights …             │ │
│              │  [简 · Missing]                │ │ Body …                   │ │
│              │  [Start from English]          │ │ About Grade10 …          │ │
│              │  [Start 简 from 繁]            │ │ Media contacts …         │ │
│              │  Title / Location / Excerpt    │ └──────────────────────────┘ │
│              │  Highlights (one a line)       │  Open on the site ↗          │
│              │  Body  [Text style][B][I][Link]│                              │
│              │        [• list][1. list]       │                              │
│              │        [Images][Table][↶][↷]   │                              │
│              │                                │                              │
│              │ On the site                    │                              │
│              │  [Publish changes] [Unpublish] │                              │
│              │  [Delete release]              │                              │
├──────────────┴────────────────────────────────┴──────────────────────────────┤
│ 2 changes: Title (简), Body (简)                       [Discard]  [Save]     │
└──────────────────────────────────────────────────────────────────────────────┘
```

- **Save bar** — appears once anything is edited, naming what changed;
  Save keeps the draft, Discard drops the edits
- **Publish** — reads Publish on a Draft and Publish changes on Live with
  changes, and is gone while the release is Live; it puts the saved draft on
  the site, so it waits with "Save first" while edits are unsaved
- **Unpublish** — offered while the release is on the site
- **Delete release** — refused while the release is on the site

## Fields

| Field | Per language | Notes |
| --- | --- | --- |
| Day | No | The day it goes out, as its dateline reads |
| Hero image | No | One image with its alt text |
| Title | Yes | English required to save |
| Location | Yes | Where it was issued from: HKSAR, China |
| Excerpt | Yes | The lines the press index and the news strip show under the title |
| Highlights | Yes | One highlight a line; blank lines are dropped |
| Body | Yes | The blocks below |
| About blocks | Yes | The settings' own by default; a release may carry its own — [Media Coverage and Settings](/p/grade10-admin/press/coverage-and-settings) |

- **A missing language** — reads in English on the site, with a note that
  the release is available in English only
- **A language left blank** — a Chinese field with nothing in it is not
  saved, so the site falls back to English there rather than showing a blank

## Body Blocks

| Block | What it holds |
| --- | --- |
| Body | A paragraph |
| Heading 2, Heading 3 | A heading |
| Small print | A footnote line |
| Caption | A caption line |
| Bulleted list, Numbered list | Items of text; a list never nests |
| Images | A group of one or more images, captioned one per image or one for the group, never both |
| Table | Two columns: a label, and its text or lists |

- **Text** — bold, italic and links inside any text; no line breaks inside a
  paragraph
- **Pasted images** — uploaded to this environment as they land, never kept
  as a pasted web address
- **Links** — a link to anywhere but an `https:` address, a mail address or a
  path on the site is refused; `http:`, `javascript:` and `//host` addresses
  among them

## Starting a Language

A Chinese tab with nothing written offers a start, so the translator writes
over the English layout instead of rebuilding it.

- **Start from English** — copies the body's blocks and images with no words
- **Start 简 from 繁** — on the 简 tab, once 繁 has words, copies 繁's blocks
  and images the same way

## Images

| Rule | Value |
| --- | --- |
| Types | JPEG, PNG, WebP, AVIF |
| Size | At most 20 MB |
| Checked | The file's measured format must be the type it says it is |
| Alt text | What the picture shows, for a reader who cannot see it |

- **SVG refused** — a browser runs what an SVG says; the legacy logos were
  turned into pictures once
- **Stored once** — an image is stored by its content, so the same picture
  uploaded twice is one image
- **Sized for the reader** — the site asks for the size a screen needs

| Refusal | The operator reads |
| --- | --- |
| Another type | Use a JPEG, PNG, WebP or AVIF image. |
| Over 20 MB | The image is over 20 MB. Make it smaller and try again. |
| Empty file | The file is empty. Pick the image again. |
| Not readable | The image could not be read. Export it again and retry. |

## Preview

The preview draws the draft with the site's own release page, ending on the
About blocks and contacts the site would show beside it.

- **Phone and desktop** — the operator picks the width
- **Language** — picking a language in the preview moves the editor's tabs
  to it
- **Open on the site** — offered while the release is live

:::detail{title="Code map" for="engineer"}
- **Editor** — `ReleaseEditor` in `@grade10/press-admin-frontend`; the body is `RichTextEditor` from `@grade10/frontend-console/rich-text`
- **Preview** — `ReleasePreview` over `@grade10/press-frontend/render` inside `CustomerViewPanel`
- **Rules** — `isPressHref`, `PRESS_MEDIA_TYPES`, `PRESS_MEDIA_MAX_BYTES` in `@grade10/press-contracts`
- **Design record** — [press architecture](https://github.com/9gag/grade10/blob/main/docs/architecture/press.md#media)
:::
