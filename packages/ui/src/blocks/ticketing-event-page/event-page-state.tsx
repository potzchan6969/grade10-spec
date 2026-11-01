import { Skeleton } from "@grade10/design-system/components/display/skeleton";
import { Button } from "@grade10/design-system/components/forms/button";
import { cn } from "@grade10/design-system/lib/utils";
import { LockSimple, Ticket } from "@phosphor-icons/react";

type EventPageMessageCopy = {
  title: string;
  body: string;
  /** `Sign In`; offered only with `onSignIn`. */
  signIn?: string;
  /** `See the Shows`. */
  seeShows: string;
};

type EventPageStateProps =
  | {
      /** The event is on its way. */
      kind: "loading";
      copy: { label: string };
      className?: string;
    }
  | {
      /** No event at this address, or a restricted one a signed-out
       * visitor cannot see yet: `We can’t find this event`. */
      kind: "missing";
      copy: EventPageMessageCopy;
      onSignIn?: () => void;
      onSeeShows: () => void;
      className?: string;
    }
  | {
      /** A restricted event this signed-in account is outside of:
       * `This event isn’t open to you yet`. */
      kind: "closed";
      copy: EventPageMessageCopy;
      onSignIn?: () => void;
      onSeeShows: () => void;
      className?: string;
    };

/**
 * The event page when there is no event to show: its loading skeleton, an
 * event not found (with Sign In for a signed-out visitor, since a restricted
 * event's preview link needs one), or a restricted event closed to this
 * account.
 */
function EventPageState(props: EventPageStateProps) {
  if (props.kind === "loading") {
    return (
      <div
        aria-busy="true"
        aria-label={props.copy.label}
        className={cn("@container/page w-full", props.className)}
        data-slot="event-page-state"
        data-state="loading"
        role="status"
      >
        <div className="mx-auto box-border flex w-full max-w-[1200px] flex-col gap-4 px-4 pt-5 pb-8 @min-[40rem]/page:px-5 @min-[40rem]/page:pt-8 @min-[40rem]/page:pb-16">
          <Skeleton className="h-10 w-3/5 rounded-lg" />
          <Skeleton className="h-5 w-2/5 rounded-md" />
          <Skeleton className="h-5 w-[30%] rounded-md" />
          <div className="mt-4 flex max-w-[720px] flex-col gap-4">
            <Skeleton className="h-[180px] rounded-2xl" />
            <Skeleton className="h-[180px] rounded-2xl" />
            <Skeleton className="h-[180px] rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }
  const { copy, onSignIn, onSeeShows, kind, className } = props;
  const Icon = kind === "closed" ? LockSimple : Ticket;
  return (
    <section
      className={cn(
        "@container/page flex flex-col items-center gap-3 px-4 py-24 text-center",
        className,
      )}
      data-slot="event-page-state"
      data-state={kind}
    >
      <span
        aria-hidden
        className="grid size-14 place-items-center rounded-full bg-muted text-secondary-foreground"
      >
        <Icon size={24} />
      </span>
      <h1 className="m-0 text-3xl leading-9 font-bold">{copy.title}</h1>
      <p className="m-0 max-w-[44ch] text-base leading-6 text-secondary-foreground">
        {copy.body}
      </p>
      <div className="mt-2 flex flex-col items-center gap-3 @min-[40rem]/page:flex-row @min-[40rem]/page:flex-wrap @min-[40rem]/page:justify-center">
        {onSignIn && copy.signIn ? (
          <Button onClick={onSignIn} size="lg">
            {copy.signIn}
          </Button>
        ) : null}
        <Button onClick={onSeeShows} size="lg" variant="outline">
          {copy.seeShows}
        </Button>
      </div>
    </section>
  );
}

export type { EventPageMessageCopy, EventPageStateProps };
export { EventPageState };
