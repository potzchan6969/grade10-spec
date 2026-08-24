// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4171-9051
// source=packages/ui/src/blocks/store-home/store-home-hero.tsx
// component=StoreHomeHero
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
