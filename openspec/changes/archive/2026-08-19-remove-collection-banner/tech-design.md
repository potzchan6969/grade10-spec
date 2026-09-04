# Design: remove collection banner

Capability spec:
[`shared/ui/store-product-listing`](../../specs/shared/ui/store-product-listing/spec.md).
See proposal.md for motivation.

## Context

`CollectionBanner` is a sibling of `ProductBrowse` on the listing page:
breadcrumbs, collection name, description, optional image. `ProductListHeader`
already displays a required consumer-supplied `title` for the same collection
name. The Figma set `Product / Collection Banner` (`4248:5104`) is still in
the library.

## Decisions

### Delete the export, do not leave an unused block

The banner is not optional chrome. Leaving `CollectionBanner` in the package
would keep a second title surface that no listing page should render.

- *Rejected — keep the export and stop rendering it in preview.* Consumers
  would still import a hero the listing surface no longer specifies.
- *Rejected — fold breadcrumbs into `ProductBrowse`.* The header already
  names the collection; moving the trail is a different product choice.

### Title stays on the header; trail, description, and image leave

`ProductListHeader.title` is the collection name. Nothing in this change
gains a breadcrumbs, description, or image prop.

- *Rejected — keep description under the header title.* That recreates the
  banner's copy row without the image, which is the surface this change
  removes.

### Figma stays as published for this change

The set at `4248:5104` still draws the hero. Deleting the Code Connect
template stops Dev Mode from emitting `CollectionBanner`. Republishing or
deleting the set is a separate design edit.

- *Rejected — editing the Figma set in this change.* Publishing a library
  set is a human plugin step.

## Risks / Trade-offs

- [Figma still draws the banner] → Recorded in ui-design.md. A designer copying the
  set will see a hero Storybook no longer renders until the set is removed.
- [Consumers still import `CollectionBanner`] → Typecheck fails on the
  removed names. No runtime fallback.
- [Listing pages lose breadcrumbs] → Accepted. Relocating the trail is out
  of scope.

## Migration Plan

1. Delete `CollectionBanner` in this repository and drop it from the preview
   product list page.
2. Consuming applications bump the submodule, delete the import, and keep
   passing `title`.
