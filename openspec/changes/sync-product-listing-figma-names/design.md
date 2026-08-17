# Design: sync product-listing names with Figma

Figma grouping (`Product / Collection Banner`) is a library folder, not a
PascalCase prefix. Code uses the name after ` / `. A set whose published name
starts with `Product /` is a listing block in `packages/ui`, not a
design-system primitive. `Nav` and `Footer` are chrome and stay in the design
system.

| Figma set | Layer | Reason |
| --- | --- | --- |
| `Nav` | design-system | Store chrome. |
| `Footer` | design-system | Store chrome. |
| `Product / Collection Banner` | `packages/ui` | Product-surface block. |
| `Product / Product Card` | `packages/ui` | Product-surface block. |
| `Filter Panel` | `packages/ui` | Independent async boundary plus selection callbacks. |
| `Product / Product List Header` | `packages/ui` | Controlled sort and supplied result count. |
| `Product / Product List` | `packages/ui` | Delegates every product action. |
| `Pagination`, `Breadcrumbs` | design-system | Unchanged primitives the blocks compose. |

`CollectionBanner` takes `breadcrumbs`, `collection`, and `description` as
required store content, and `imageSrc` / `imageAlt` as optional. Omitting the
image leaves the copy; a default image would be another store's pack.

`ProductBrowse` (was `ProductListing`) no longer accepts `header`. The Figma
page stacks `Nav`, `CollectionBanner`, the browse row, and `Footer`. The
browse root is the filter panel plus results column only. It is not named
`ProductListing` because that is a near-homophone of `ProductList` and a
false match for the Figma page, which also includes chrome.

The design-system checker will warn that `Product / Product Card`,
`Product / Collection Banner`, and `Filter Panel` have no file under
`src/components/` — the implementation now lives in `packages/ui`.

`FilterPanel` matches Figma set `Filter Panel` (`4229:3273`): a card shell
with `gap-6` between `Checkbox List` groups, `CheckboxListInput` at `size="sm"`,
and no trailing price summary — the page instance at `4238:3996` draws only
the four checkbox groups.
