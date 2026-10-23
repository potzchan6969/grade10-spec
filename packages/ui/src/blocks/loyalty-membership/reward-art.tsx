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
          // The side cutouts are masked out, not painted over — the card's
          // surface (or its hover fill) shows through the holes.
          "[mask-composite:intersect] [mask-image:radial-gradient(circle_var(--notch)_at_0_50%,transparent_calc(var(--notch)-0.5px),black_var(--notch)),radial-gradient(circle_var(--notch)_at_100%_50%,transparent_calc(var(--notch)-0.5px),black_var(--notch))] [-webkit-mask-composite:source-in] [-webkit-mask-image:radial-gradient(circle_var(--notch)_at_0_50%,transparent_calc(var(--notch)-0.5px),black_var(--notch)),radial-gradient(circle_var(--notch)_at_100%_50%,transparent_calc(var(--notch)-0.5px),black_var(--notch))]",
          hero
            ? "aspect-2/1 w-full rounded-2xl [--notch:20px]"
            : "rounded-(--radius-lg) [--notch:6px]",
          className,
        )}
      >
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
        "object-contain",
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
