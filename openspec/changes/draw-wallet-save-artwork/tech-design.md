# Tech Design

## Decisions

- **The block draws the artwork** - `WalletPassWallet` gains `artwork`
  (`{ wallet: "apple" | "google"; language?: "en" | "zh-Hant" }`). The block
  resolves it to the vendor file in
  `packages/ui/src/blocks/loyalty-membership/wallet-artwork/` and draws it as
  an `<img>` inside the add button and the install link, the offer's whole
  label as its `alt`, so the control's name is unchanged. A wallet without
  `artwork` keeps the text button.
- **Unaltered** - the vendor SVGs are copied byte for byte and kept out of
  the formatter; the badge is never dimmed while a mint is in flight, which
  says so through `aria-busy` and `aria-disabled` and ignores a second tap.
- **Google** - its published "Add to Google Wallet" button, `enUS` and
  `zhHK`, from Google's brand guidelines download.
- **Apple** - Apple publishes its badge behind its guidelines page with no
  direct download this build could fetch. A placeholder drawn to the badge's
  proportions stands in, marked `data-artwork="placeholder"`, until Apple's
  licensed SVG replaces `apple-wallet-add.placeholder.svg`.
- **Consumer** - the Grade10 membership page names each platform's artwork
  and the member's language (`zh-Hant`, else English).
