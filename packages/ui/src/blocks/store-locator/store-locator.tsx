import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import {
  REVEAL_ENTRANCE_CLASS,
  revealEntranceDelayMs,
} from "../shared/use-first-paint-reveal";

/** The words the block draws around the shop's own facts. */
type StoreLocatorCopy = {
  /** The page's heading, e.g. Location & Hours. */
  heading: string;
  hoursHeading: string;
  /** The embedded map's title. */
  mapTitle: string;
  /** The map link's name: what activating it opens. */
  openMap: string;
};

/** One line of the week's hours, in the consumer's own words. */
type StoreLocatorHoursRow = {
  day: string;
  hours: string;
};

type StoreLocatorProps = {
  copy: StoreLocatorCopy;
  /** The shop's name. */
  name: string;
  addressLines: readonly string[];
  /** The week's hours: a shop always has at least one row. */
  hours: readonly [StoreLocatorHoursRow, ...StoreLocatorHoursRow[]];
  /** Where the embedded map is read from. */
  mapEmbedSrc: string;
  /** The place in Maps the map opens, in a new tab. */
  mapsHref: string;
  className?: string;
};

/**
 * Location & Hours: the map, then the shop's name, address and the week's
 * hours. The map is one link over an inert embed, so a keyboard stops on it
 * once, by the copy's name, and nothing inside the frame takes focus. Its
 * box keeps its size and its muted ground when the embed does not load, and
 * the link still opens Maps. Every section rests visible: the entrance is a
 * CSS animation, so a page served before its scripts run shows it whole.
 */
function StoreLocator({
  copy,
  name,
  addressLines,
  hours,
  mapEmbedSrc,
  mapsHref,
  className,
}: StoreLocatorProps) {
  return (
    <div
      className={cn(
        "@container grid w-full max-w-5xl grid-cols-1 gap-10 @3xl:grid-cols-2 @3xl:gap-12",
        className,
      )}
      data-slot="store-locator"
    >
      <div
        className={REVEAL_ENTRANCE_CLASS}
        style={{ animationDelay: revealEntranceDelayMs(0) }}
      >
        <div
          className="relative aspect-square w-full overflow-hidden rounded-2xl bg-muted"
          data-slot="store-locator-map"
        >
          <iframe
            aria-hidden
            className="pointer-events-none size-full border-0"
            inert
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={mapEmbedSrc}
            tabIndex={-1}
            title={copy.mapTitle}
          />
          <a
            className="absolute inset-0 rounded-2xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            href={mapsHref}
            rel="noopener noreferrer"
            target="_blank"
          >
            <span className="sr-only">{copy.openMap}</span>
          </a>
        </div>
      </div>

      <div
        className={cn("min-w-0", REVEAL_ENTRANCE_CLASS)}
        data-slot="store-locator-details"
        style={{ animationDelay: revealEntranceDelayMs(1) }}
      >
        <VStack className="w-full" gap="lg" hAlign="stretch">
          <h1 className="text-3xl font-bold text-foreground @3xl:text-4xl">
            {copy.heading}
          </h1>

          <VStack
            className="w-full"
            data-slot="store-locator-address"
            gap="sm"
            hAlign="stretch"
          >
            <p className="text-base font-medium text-foreground">{name}</p>
            {addressLines.map((line) => (
              <p className="text-sm leading-5 text-foreground" key={line}>
                {line}
              </p>
            ))}
          </VStack>

          <VStack className="w-full" gap="sm" hAlign="stretch">
            <h2 className="text-sm font-medium text-secondary-foreground">
              {copy.hoursHeading}
            </h2>
            <VStack
              className="w-full max-w-xs"
              data-slot="store-locator-hours"
              gap="xs"
              hAlign="stretch"
            >
              {hours.map((row) => (
                <div
                  className="grid grid-cols-[minmax(0,1fr)_auto] gap-6 text-sm leading-5 text-foreground"
                  key={row.day}
                >
                  <span>{row.day}</span>
                  <span className="tabular-nums">{row.hours}</span>
                </div>
              ))}
            </VStack>
          </VStack>
        </VStack>
      </div>
    </div>
  );
}

export type { StoreLocatorCopy, StoreLocatorHoursRow, StoreLocatorProps };
export { StoreLocator };
