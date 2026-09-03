# UI: Rename auction:catalog to auction:write

## Screens

No published Figma frames. This change does not add or alter a frame.
Admin campaign and listing controls keep the same layout; only the
permission string behind them moves.

## Components

No new component, variant, or token. Existing `@grade10/frontend-console`
controls on the campaigns panel are unchanged.

## States

None. Visibility of write actions still follows whether the signed-in
operator holds the write grant (`roles-SC-07a`).
