# Assets

Static brand image files a consuming app imports directly — `import logo from
"@grade10/design-system/assets/grade10-logo.png"`. No build step: what is
committed here is what a consumer gets.

PM and designers replace a file in place, on a branch, same as any other
change in this repository.

## The icon set

`favicon.ico`, `icon.svg`, `icon-192.png`, `icon-512.png`,
`icon-maskable-512.png` and `apple-touch-icon.png` are a copy of what
grade10-site currently serves — a placeholder here until a designer swaps
one for real, updated artwork.

Today grade10 draws these same files itself, at
`apps/frontend/grade10/scripts/make-icons.mjs`, from the `g10-logo-mono`
component — nothing runs that script automatically, so it will not overwrite
an edit made here. Making this folder the actual source grade10 serves from
still needs its own change: a place in `apps/frontend/grade10/public/` to
copy these into, or an app-side script that does. Until then, an edit here
is a preview of what the site will show, not yet what it does.
