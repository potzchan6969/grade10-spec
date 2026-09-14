# Assets

Static brand image files a consuming app imports directly — `import logo from
"@grade10/design-system/assets/grade10-logo.png"`. No build step: what is
committed here is what a consumer gets.

PM and designers replace a file in place, on a branch, same as any other
change in this repository.

This folder is for files with no generator. The site's favicon and PWA icons
are not here — `apps/frontend/grade10/scripts/make-icons.mjs` draws them from
the `g10-logo-mono` component on every wordmark or colour change, and a static
copy here would drift from that the first time either does.
