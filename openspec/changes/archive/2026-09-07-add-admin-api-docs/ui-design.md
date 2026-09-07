## Screens

There are no Figma frames for the admin, by decision
(`docs/prds/products/shared/console/index.md`). The layout's source of truth is
the design canvas:

- **API docs surface** —
  [Grade10 API Docs · Main](https://claude.ai/code/artifact/9b0c8ff4-71ca-4132-80c8-4e12369580c6):
  the console shell with the surface under the Dev heading, the services rail,
  the procedure table for one router, and the detail panel for one procedure.
- **Procedure detail, output not declared** — the `Detail` artboard on the same
  canvas: the detail panel for a procedure with a grant and no declared output.

The canvas is drawn in the console's own vocabulary and theme values; where it
and the vocabulary below disagree on a badge tone, the vocabulary wins.

## Components

Everything composes `@grade10/frontend-console`, the admin's single supplier
(`shared/console/visual-standard`). No design-system primitive is rendered
directly, and nothing new is needed in `grade10-spec`.

| Region | Exports |
| --- | --- |
| Section | `Stack` (`gap="lg"`) opening with `SectionHeader` — title `API docs`, description, `actions` holding the build commit as `Text` and a `Button` (`Copy JSON`) |
| Services rail | `Panel` holding `Search` (the text filter), `Filter` / `FilterOption` (the audience: All, Site, Console, Machine), the audience legend as `EntryList` / `Entry` (the audience as the entry, its caller words and who holds the client as the `detail`) with the not-internal note as `Text size="xs"`, then the services as a list: each service and router a `Button`-styled row is not in the vocabulary, so rows are `Inline` with `Text` and the count as `Badge` (`tone="default"`); the selected row marks itself the way the nav marks a selected item |
| Procedure list | `Panel` (title `<service> · <router>`, description carrying the mount path and the `superjson` note) holding `Table` / `Row` / `Cell`; kind and caller as `Badge`; summaries as `Text color="secondary"`; a router that forwards every call to another worker says so in one `Text` line above the table, and a forwarding procedure carries `forwards to <service>` as a `Badge` in its detail |
| Procedure detail | `Panel` (title is the dotted path, `titleAfter` the kind and caller badges, `actions` the copy buttons) holding a two-column `Grid` of field tables (`Table` / `Row` / `Cell`); raw schema behind `InfoDialog` rendering `Payload` |
| Undeclared output | `Notice` (`tone="warning"`) in the output column, with the count on the panel description |

Badge tones, from the vocabulary's five: kind `query` and `mutation` both
`default` (the word carries the difference); caller `public` `default`,
`session` and `session · fresh` `info`, `elevated` `warning` with the grant as
a second `default` badge in the grant's own spelling; a service principal
`default` naming the kind.

Rail and detail entries need no component that does not exist. The one
composition not yet in any console — a selectable row list inside a `Panel` —
is built from `Inline`, `Text`, and `Badge` in the page, not added to the
console package, because one surface renders it.

## States

| Screen | State | Spec scenario |
| --- | --- | --- |
| Surface | Absent in a production build; not-found surface answers the address | `grade10-admin-console-api-docs-SC-04` |
| Surface | Present under Dev in staging and development; needs no grant | `grade10-admin-console-api-docs-SC-05` |
| Rail | Every service with its count; routers unfold with theirs | `grade10-admin-console-api-docs-SC-03` |
| Procedure list | Rows with kind, caller, input and output summaries | `grade10-admin-console-api-docs-SC-06` |
| Procedure list | Filter narrows every service; counts follow | `grade10-admin-console-api-docs-SC-08` |
| Procedure list | Filter matches nothing: counts read zero, list renders the empty copy | `grade10-admin-console-api-docs-SC-08` |
| Procedure list | Audience narrows every service; typed text narrows what it left | `grade10-admin-console-api-docs-SC-15` |
| Rail | Audience legend names the three audiences, their caller words, and that nothing is internal | `grade10-admin-console-api-docs-SC-16` |
| Detail | Wire path, caller, field tables; alternatives named by discriminator | `grade10-admin-console-api-docs-SC-07` |
| Detail | Elevated caller with grant beside it | `grade10-admin-console-api-docs-SC-09` |
| Detail | `session` and `session · fresh` told apart | `grade10-admin-console-api-docs-SC-10` |
| Detail | Output not declared: `Notice`, no fields, service count | `grade10-admin-console-api-docs-SC-11` |
| Section | Header names the build commit | `grade10-admin-console-api-docs-SC-12` |

Loading and refused states do not arise: the document is a static import
carried by the build, and the surface makes no call.
