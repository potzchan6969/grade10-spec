// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4171-9051
// source=packages/ui/src/blocks/store-home/store-home-hero.tsx
// component=StoreHomeHero
//
// Excluded from `code-connect:publish` in packages/ui/figma.config.json.
//
// `4171-9051` is a bare 1376x470 layout frame with no children of its own and
// no published component anywhere in the file to stand in for it. Code Connect
// resolves only published components, and one unresolvable node fails
// validation for every template in the package, so this is held back until
// design publishes a Hero component.
import figma from "figma";

const instance = figma.selectedInstance;

const eyebrow = instance.getString("eyebrow");
const title = instance.getString("title");
const description = instance.getString("description");
const shopLabel = instance.getString("shopLabel");
const auctionLabel = instance.getString("auctionLabel");

export default {
  example: figma.code`<StoreHomeHero copy={{ eyebrow: "${eyebrow}", shopLabel: "${shopLabel}", auctionLabel: "${auctionLabel}" }} title="${title}" description="${description}" imageSrc={imageSrc} onShopClick={onShopClick} onAuctionClick={onAuctionClick} />`,
  imports: ['import { StoreHomeHero } from "@grade10/ui"'],
  id: "store-home-hero",
  metadata: { nestable: true },
};
