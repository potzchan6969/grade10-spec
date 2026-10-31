import { Skeleton } from "@grade10/design-system/components/display/skeleton";
import { Button } from "@grade10/design-system/components/forms/button";
import { cn } from "@grade10/design-system/lib/utils";
import { Ticket, XCircle } from "@phosphor-icons/react";
import { MyTicketsOrderCard } from "./my-tickets-order-card";
import { TicketActButton } from "./ticket-act-button";
import type { MyTicketsOrder, TicketAct } from "./types";

/** What My Tickets can show. An empty `ready` list is the empty state. */
type MyTicketsListState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "signedOut" }
  | { status: "ready"; orders: readonly MyTicketsOrder[] };

/** The words My Tickets says, whatever it shows. */
type MyTicketsListCopy = {
  /** "Your Tickets" */
  title: string;
  /** Over the list: "Every order bought with …, newest first." */
  intro: string;
  /** The loading region's accessible name. */
  loading: string;
  empty: { title: string; body: string; browse: string };
  error: { title: string; body: string; retry: string };
  signedOut: {
    title: string;
    body: string;
    /** "Sign In with Email" */
    signIn: string;
    /** Under the card: a guest's tickets are in their email. */
    guestNote: string;
  };
};

type MyTicketsListProps = {
  copy: MyTicketsListCopy;
  state: MyTicketsListState;
  /** Signed out: opens the site's emailed-link sign-in. */
  onSignIn: () => void;
  /** Failed: loads the list again. */
  onRetry: () => void;
  /** Empty: where the shows are. */
  browseHref: string;
  className?: string;
};

const SKELETON_CARDS = ["a", "b", "c"] as const;

/**
 * Every ticket order on the signed-in account, newest first, each with its
 * state, its tickets and reference, and the one act it needs. Signed out it
 * asks for the buying email; the consumer opens the sign-in and raises the
 * toast when the link brings the collector back. Loading, empty and failed
 * each draw their own.
 */
function MyTicketsList({
  copy,
  state,
  onSignIn,
  onRetry,
  browseHref,
  className,
}: MyTicketsListProps) {
  return (
    <div
      className={cn("flex w-full flex-col gap-5", className)}
      data-slot="my-tickets-list"
      data-status={state.status}
    >
      <h1 className="text-2xl leading-8 font-bold">{copy.title}</h1>
      <Body
        browseHref={browseHref}
        copy={copy}
        onRetry={onRetry}
        onSignIn={onSignIn}
        state={state}
      />
    </div>
  );
}

function Body({
  copy,
  state,
  onSignIn,
  onRetry,
  browseHref,
}: Omit<MyTicketsListProps, "className">) {
  switch (state.status) {
    case "loading":
      return (
        <div
          aria-label={copy.loading}
          className="flex flex-col gap-4"
          role="status"
        >
          {SKELETON_CARDS.map((key) => (
            <div
              aria-hidden
              className="flex flex-col gap-2.5 rounded-2xl border border-border p-4"
              key={key}
            >
              <Skeleton className="h-5 w-3/5 rounded-md bg-muted" />
              <Skeleton className="h-3.5 w-[45%] rounded-md bg-muted" />
              <Skeleton className="h-3.5 w-[35%] rounded-md bg-muted" />
              <Skeleton className="h-10 w-full rounded-md bg-muted" />
            </div>
          ))}
        </div>
      );
    case "error":
      return (
        <div
          className="flex gap-3 rounded-2xl bg-destructive-muted p-4"
          role="alert"
        >
          <span
            aria-hidden
            className="inline-flex mt-0.5 shrink-0 text-destructive"
          >
            <XCircle size={20} />
          </span>
          <div className="flex min-w-0 flex-col gap-1">
            <strong className="text-base leading-6 font-medium">
              {copy.error.title}
            </strong>
            <span className="text-sm leading-5 text-secondary-foreground">
              {copy.error.body}
            </span>
            <div className="pt-1">
              <Button
                onClick={onRetry}
                size="sm"
                type="button"
                variant="outline"
              >
                {copy.error.retry}
              </Button>
            </div>
          </div>
        </div>
      );
    case "signedOut": {
      const titleId = "my-tickets-signed-out-title";
      const act: TicketAct = {
        label: copy.signedOut.signIn,
        onClick: onSignIn,
      };
      return (
        <>
          <section
            aria-labelledby={titleId}
            className="flex flex-col gap-3 rounded-2xl border border-border p-5"
          >
            <h2 className="text-lg leading-7 font-bold" id={titleId}>
              {copy.signedOut.title}
            </h2>
            <p className="text-sm leading-5 text-secondary-foreground">
              {copy.signedOut.body}
            </p>
            <TicketActButton act={act} size="lg" />
          </section>
          <p className="text-sm leading-5 text-secondary-foreground">
            {copy.signedOut.guestNote}
          </p>
        </>
      );
    }
    case "ready":
      if (state.orders.length === 0) {
        return (
          <div className="flex flex-col items-center gap-3 px-2 py-12 text-center">
            <span
              aria-hidden
              className="grid size-14 place-items-center rounded-full bg-muted text-secondary-foreground"
            >
              <Ticket size={24} />
            </span>
            <h2 className="text-lg leading-7 font-bold">{copy.empty.title}</h2>
            <p className="text-sm leading-5 text-secondary-foreground">
              {copy.empty.body}
            </p>
            <TicketActButton
              act={{ label: copy.empty.browse, href: browseHref }}
              className="w-auto"
              size="md"
              variant="outline"
            />
          </div>
        );
      }
      return (
        <>
          <p className="-mt-2 text-sm leading-5 text-secondary-foreground">
            {copy.intro}
          </p>
          <div className="flex flex-col gap-4">
            {state.orders.map((order) => (
              <MyTicketsOrderCard key={order.id} order={order} />
            ))}
          </div>
        </>
      );
  }
}

export type { MyTicketsListCopy, MyTicketsListProps, MyTicketsListState };
export { MyTicketsList };
