import { Button } from "@grade10/design-system/components/forms/button";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import { ArrowRight } from "@phosphor-icons/react";
import type { ReactNode } from "react";

/** Words every hero renders the same way on the store home page. */
type StoreHomeHeroCopy = {
  eyebrow: string;
  shopLabel: string;
  auctionLabel: string;
};

type StoreHomeHeroProps = {
  copy: StoreHomeHeroCopy;
  title: ReactNode;
  description: ReactNode;
  imageSrc: string;
  imageAlt?: string;
  onShopClick?: () => void;
  onAuctionClick?: () => void;
  className?: string;
};

/**
 * Marketing hero for the store landing page.
 *
 * Figma frame `Hero Section` (`4171:9051`) on the Store page: a full-width
 * rounded image well with a left-to-right gradient, an eyebrow, title,
 * description, and two secondary pill buttons with trailing arrows. Content
 * sits in an overlay at the vertical centre — absolute positioning is
 * intentional for the background treatment, not auto-layout translation.
 */
function StoreHomeHero({
  copy,
  title,
  description,
  imageSrc,
  imageAlt = "",
  onShopClick,
  onAuctionClick,
  className,
}: StoreHomeHeroProps) {
  return (
    <div
      className={cn(
        // biome-ignore lint/plugin: hero well height matches Figma frame 4171:9051
        "relative h-[470px] w-full overflow-hidden rounded-4xl",
        className,
      )}
      data-slot="store-home-hero"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <img
          alt={imageAlt}
          className="absolute inset-0 size-full object-cover"
          src={imageSrc}
        />
        {/* biome-ignore lint/plugin: hero gradient stops are frame-specific overlay values */}
        <div className="absolute inset-0 bg-linear-to-r from-[rgba(5,5,9,0.88)] via-[34%] via-[rgba(5,5,9,0.58)] to-[64%] to-[rgba(5,5,9,0.04)]" />
      </div>

      <VStack
        // biome-ignore lint/plugin: hero copy overlay is absolutely positioned over the image well
        className="absolute top-1/2 left-10 w-full max-w-[500px] -translate-y-1/2"
        data-slot="store-home-hero-content"
        gap="md"
      >
        <p className="text-base font-bold text-accent-foreground">
          {copy.eyebrow}
        </p>
        <h1 className="text-5xl font-bold text-primary-foreground">{title}</h1>
        <p className="text-sm text-primary-foreground/70">{description}</p>
        {(onShopClick != null || onAuctionClick != null) && (
          <HStack className="py-2" gap="md">
            {onShopClick != null ? (
              <Button
                onClick={onShopClick}
                trailing={<ArrowRight aria-hidden size={14} />}
                variant="secondary"
              >
                {copy.shopLabel}
              </Button>
            ) : null}
            {onAuctionClick != null ? (
              <Button
                onClick={onAuctionClick}
                trailing={<ArrowRight aria-hidden size={14} />}
                variant="secondary"
              >
                {copy.auctionLabel}
              </Button>
            ) : null}
          </HStack>
        )}
      </VStack>
    </div>
  );
}

export type { StoreHomeHeroCopy, StoreHomeHeroProps };
export { StoreHomeHero };
