import { cn } from "@grade10/design-system/lib/utils";
import { Gift } from "@phosphor-icons/react";
import type { RewardMenuItem } from "./types";

/**
 * A reward's art: the item's supplied image, or the coupon's gift tile — an
 * orange gradient with the side cutouts of a voucher. Internal to the
 * rewards blocks; the export contract names the surfaces that draw it, not
 * the tile.
 *
 * `hero` is the checkout surface's 2:1 banner — a `radius-3xl` frame over a
 * muted fill for an item, the coupon tile with the larger cutouts and glyph
 * for a coupon. The card tile draws `radius-2xl` throughout.
 */
function RewardArt({
  reward,
  className,
  hero = false,
}: {
  reward: Pick<RewardMenuItem, "kind" | "image">;
  className?: string;
  hero?: boolean;
}) {
  if (reward.kind === "coupon" || reward.image == null) {
    return (
      <span
        aria-hidden
        data-slot="reward-art-coupon"
        className={cn(
          "relative grid overflow-hidden bg-[linear-gradient(135deg,var(--orange-200)_0%,var(--orange-400)_55%,var(--orange-600)_100%)]",
          hero ? "aspect-2/1 w-full rounded-2xl" : "rounded-(--radius-lg)",
          className,
        )}
      >
        <span
          className={cn(
            "absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-card",
            hero ? "size-10" : "size-3",
          )}
        />
        <span
          className={cn(
            "absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 rounded-full bg-card",
            hero ? "size-10" : "size-3",
          )}
        />
        <span className="place-self-center text-card">
          <Gift aria-hidden size={hero ? 64 : 32} />
        </span>
      </span>
    );
  }
  return (
    <img
      alt={reward.image.alt}
      className={cn(
        "object-cover",
        hero
          ? "aspect-2/1 w-full rounded-3xl bg-muted"
          : "rounded-(--radius-lg) bg-muted",
        className,
      )}
      src={reward.image.src}
    />
  );
}

export { RewardArt };
