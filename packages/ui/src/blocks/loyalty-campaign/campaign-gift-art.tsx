import { cn } from "@grade10/design-system/lib/utils";
import { Gift } from "@phosphor-icons/react";

/**
 * A campaign gift's picture on a transparent ground, or — where the campaign
 * has none yet — the gold gift tile. Decorative: the gift's name is always
 * written beside it. Internal to the campaign blocks.
 */
function CampaignGiftArt({
  imageUrl,
  size = "md",
  dimmed = false,
}: {
  imageUrl?: string | null;
  size?: "sm" | "md" | "lg";
  /** Gone for this member: drawn faded. */
  dimmed?: boolean;
}) {
  const box = { sm: "size-8", md: "size-16", lg: "size-28" }[size];
  const faded = dimmed && "opacity-50 grayscale";
  if (imageUrl) {
    return (
      <img
        alt=""
        className={cn(box, "shrink-0 object-contain drop-shadow-md", faded)}
        data-slot="campaign-gift-art"
        src={imageUrl}
      />
    );
  }
  return (
    <span
      aria-hidden
      className={cn(
        box,
        "grid shrink-0 place-items-center rounded-2xl bg-[linear-gradient(135deg,var(--orange-200)_0%,var(--orange-400)_55%,var(--orange-600)_100%)] text-card",
        faded,
      )}
      data-slot="campaign-gift-art"
    >
      <Gift aria-hidden size={{ sm: 16, md: 28, lg: 48 }[size]} />
    </span>
  );
}

export { CampaignGiftArt };
