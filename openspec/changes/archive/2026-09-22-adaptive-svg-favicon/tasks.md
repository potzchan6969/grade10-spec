## 1. Design-system assets `(grade10-spec)`

- [x] 1.1 Replace `packages/design-system/src/assets/icon.svg` with the adaptive
      “10” monogram (transparent background; light/dark `prefers-color-scheme`
      fills)
- [x] 1.2 Update `packages/design-system/src/assets/README.md` for the adaptive
      SVG usage
- [x] 1.3 Leave `grade10-logo.png` and raster icon placeholders unchanged

## 2. Storybook wiring `(grade10-spec)`

- [x] 2.1 Map `src/assets` through Storybook `staticDirs` to `/assets`
- [x] 2.2 Link `/assets/icon.svg` from `.storybook/preview-head.html`
