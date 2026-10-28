import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import type { ReactNode } from "react";

/** Where the campaign stands, drawn as the chip over the picture. */
type CampaignHeroPhase = "upcoming" | "live" | "ended";

type CampaignHeroProps = {
  title: string;
  tagline?: string | null;
  /** The chip's words: "Live · ends 30 Nov", "Opens 1 Nov", "Ended". */
  phaseLabel: string;
  phase: CampaignHeroPhase;
  /** The wide key art; decorative. Absent, the hero draws its own night. */
  imageUrl?: string | null;
  /** The key art cropped tall for a phone; absent, the phone crops the wide one. */
  phoneImageUrl?: string | null;
  /** The visitor's one next step, and any second link beside it. */
  actions?: ReactNode;
};

/**
 * A campaign's opening: its key art behind the name, a chip saying whether it
 * is open, the tagline and the one thing to do next. The left of the picture
 * is darkened so the name reads on any art; with no art at all the hero is
 * the inverse surface with a warm glow, so a campaign without pictures still
 * opens on something.
 */
function CampaignHero({
  title,
  tagline,
  phaseLabel,
  phase,
  imageUrl,
  phoneImageUrl,
  actions,
}: CampaignHeroProps) {
  return (
    <section
      className="relative isolate overflow-hidden rounded-3xl bg-background-inverse text-primary-foreground"
      data-phase={phase}
      data-slot="campaign-hero"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {imageUrl || phoneImageUrl ? (
          <picture>
            {phoneImageUrl ? (
              <source media="(max-width: 639px)" srcSet={phoneImageUrl} />
            ) : null}
            <img
              alt=""
              className="absolute inset-0 size-full object-cover"
              data-slot="campaign-hero-image"
              src={imageUrl ?? phoneImageUrl ?? undefined}
            />
          </picture>
        ) : (
          <div
            className="absolute inset-0 bg-[radial-gradient(circle_at_80%_60%,var(--primary-muted-hover),transparent_60%)]"
            data-slot="campaign-hero-glow"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-background-inverse via-background-inverse/60 to-transparent sm:bg-linear-to-r sm:via-background-inverse/50" />
      </div>

      <VStack
        className="min-h-96 max-w-xl px-6 py-10 sm:px-12 sm:py-16"
        gap="md"
        vAlign="end"
      >
        <span
          className={cn(
            "inline-flex w-fit items-center gap-2 rounded-full bg-primary-foreground/15 px-3 py-1.5 text-xs font-bold tracking-wide uppercase backdrop-blur",
            phase === "ended" &&
              "bg-primary-foreground/10 text-primary-foreground/70",
          )}
          data-slot="campaign-hero-phase"
        >
          <span
            aria-hidden
            className={cn(
              "size-2 rounded-full",
              phase === "live" && "bg-success",
              phase === "upcoming" && "bg-primary",
              phase === "ended" && "bg-muted-foreground",
            )}
          />
          {phaseLabel}
        </span>
        <h1 className="text-4xl leading-none font-black tracking-tight text-balance uppercase sm:text-6xl">
          {title}
        </h1>
        {tagline ? (
          <p className="max-w-md text-lg text-primary-foreground/80">
            {tagline}
          </p>
        ) : null}
        {actions ? (
          <HStack className="pt-2" gap="sm" vAlign="center" wrap>
            {actions}
          </HStack>
        ) : null}
      </VStack>
    </section>
  );
}

export type { CampaignHeroPhase, CampaignHeroProps };
export { CampaignHero };
