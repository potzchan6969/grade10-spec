import { Alert } from "@grade10/design-system/components/display/alert";
import { Badge } from "@grade10/design-system/components/display/badge";
import { Button } from "@grade10/design-system/components/forms/button";
import { cn } from "@grade10/design-system/lib/utils";
import { CalendarBlank, Clock, MapPin, Ticket } from "@phosphor-icons/react";

/** A word over the title: `On Today`, `Canceled`, `Ended`. */
type EventHeaderBadge = {
  label: string;
  tone: "today" | "canceled" | "ended";
};

/** What the page tells this visitor under the facts. */
type EventHeaderNotice =
  | {
      /** A signed-in buyer who already holds tickets for this event. */
      kind: "holding";
      id: string;
      /** `You have tickets for this show.` */
      text: string;
      /** `View Your Tickets`. */
      actionLabel: string;
      onAction: () => void;
    }
  | {
      /** A canceled event (`error`), one that is over, or a restricted
       * event's preview to its own audience (`default`). */
      kind: "alert";
      id: string;
      tone: "default" | "error";
      title: string;
      description?: string;
    };

type EventHeaderProps = {
  /** The event's name. */
  title: string;
  /** `Sat 12 Dec and Sun 13 Dec 2026`. */
  days: string;
  /** `10:00 to 19:00 each day`. */
  hours?: string;
  /** `The Venue, Hong Kong`. */
  venue?: string;
  /** One line about the show. */
  about?: string;
  badges?: readonly EventHeaderBadge[];
  notices?: readonly EventHeaderNotice[];
  className?: string;
};

const BADGE = {
  today: "success",
  canceled: "error",
  ended: "default",
} as const;

/**
 * The top of the event page: any badge (On Today, Canceled, Ended), the
 * title, the days, hours and venue, the one line about the show, and what
 * this visitor is told under them: tickets already held, a canceled or
 * ended event, or a restricted event's preview.
 */
function EventHeader({
  title,
  days,
  hours,
  venue,
  about,
  badges,
  notices,
  className,
}: EventHeaderProps) {
  const facts = [
    { id: "days", Icon: CalendarBlank, text: days },
    { id: "hours", Icon: Clock, text: hours },
    { id: "venue", Icon: MapPin, text: venue },
  ].filter((fact) => fact.text);
  return (
    <div
      className={cn("@container/head flex flex-col gap-6", className)}
      data-slot="event-header"
    >
      <header className="flex max-w-[760px] flex-col gap-3">
        {badges && badges.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {badges.map((badge) => (
              <Badge key={badge.tone} variant={BADGE[badge.tone]}>
                {badge.label}
              </Badge>
            ))}
          </div>
        ) : null}
        <h1 className="m-0 text-[34px] leading-10 font-bold tracking-[-0.01em] @min-[40rem]/head:text-5xl @min-[40rem]/head:leading-[52px]">
          {title}
        </h1>
        <div className="flex flex-col gap-1 text-base leading-6 @min-[40rem]/head:text-lg @min-[40rem]/head:leading-7">
          {facts.map(({ id, Icon, text }) => (
            <span className="inline-flex items-center gap-2" key={id}>
              <span
                aria-hidden
                className="inline-flex shrink-0 text-secondary-foreground"
              >
                <Icon size={18} />
              </span>
              {text}
            </span>
          ))}
        </div>
        {about ? (
          <p className="m-0 text-base leading-6 text-secondary-foreground">
            {about}
          </p>
        ) : null}
      </header>
      {notices?.map((notice) =>
        notice.kind === "holding" ? (
          <div
            className="box-border flex max-w-[760px] flex-wrap items-center justify-between gap-3 rounded-2xl bg-primary-muted px-5 py-4"
            key={notice.id}
          >
            <span className="inline-flex items-center gap-2.5 text-base font-medium">
              <span aria-hidden className="inline-flex shrink-0 text-primary">
                <Ticket size={20} />
              </span>
              {notice.text}
            </span>
            <Button onClick={notice.onAction} variant="outline">
              {notice.actionLabel}
            </Button>
          </div>
        ) : (
          <Alert
            className="max-w-[760px]"
            description={notice.description}
            dismissible={false}
            key={notice.id}
            status={notice.tone}
            title={notice.title}
          />
        ),
      )}
    </div>
  );
}

export type { EventHeaderBadge, EventHeaderNotice, EventHeaderProps };
export { EventHeader };
