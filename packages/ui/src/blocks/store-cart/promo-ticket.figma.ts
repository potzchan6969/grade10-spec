// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=7259-799
// source=packages/ui/src/blocks/store-cart/promo-ticket.tsx
// component=PromoTicket
//
// Figma draws every ticket shape as `state=…`. Code splits the axis across
// props: `selected`, `muted`, `usedLabel`, `qrCode`, `labelIcon` and the
// `action` slot. Folded vs expanded QR is runtime disclosure, not a prop —
// the folded and expanded options emit the same `qrCode` argument.
import figma from "figma";

const instance = figma.selectedInstance;

const state = instance.getEnum("state", {
  default: "default",
  selected: "selected",
  notApplicable: "notApplicable",
  used: "used",
  scan: "scan",
  scanExpanded: "scanExpanded",
  collection: "collection",
  collectionExpanded: "collectionExpanded",
});

const props = [
  state === "selected" ? "selected" : "",
  state === "notApplicable" ? "muted" : "",
  state === "used" ? "usedLabel={usedLabel}" : "",
  state.startsWith("scan") || state.startsWith("collection")
    ? "qrCode={qrCode}"
    : "",
  state.startsWith("collection")
    ? 'labelIcon={<Storefront size={14} weight="bold" />}'
    : "",
  "action={action}",
]
  .filter(Boolean)
  .join(" ");

export default {
  example: figma.code`<PromoTicket code={code} ${props} />`,
  imports: [
    'import { PromoTicket } from "@grade10/ui"',
    'import { Storefront } from "@phosphor-icons/react"',
  ],
  id: "promo-ticket",
  metadata: { nestable: true },
};
