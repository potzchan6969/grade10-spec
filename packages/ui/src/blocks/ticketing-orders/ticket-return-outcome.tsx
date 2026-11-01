import { cn } from "@grade10/design-system/lib/utils";
import {
  ArrowCounterClockwise,
  ArrowUUpLeft,
  Check,
  Clock,
  Envelope,
  Lock,
} from "@phosphor-icons/react";
import { type ComponentType, useId } from "react";
import { TicketActButton } from "./ticket-act-button";
import { TicketStatusBadge } from "./ticket-status-badge";
import type { TicketAct, TicketTone } from "./types";

/** How a collector's return from Stripe settled, or why it shows nothing. */
type TicketReturnOutcomeKind =
  /** Paid: the order confirmed, in the browser that paid. */
  | "paid"
  /** Went back from Stripe: the tickets let go, nothing charged. */
  | "wentBack"
  /** The hold ran out before paying. */
  | "holdRanOut"
  /** Paid after the hold ended and the tickets had gone: refunding. */
  | "paidTooLate"
  /** Any other browser, or a copied or shared link: sign in with the
   * order's email. */
  | "otherBrowser"
  /** Signed in, but not with the order's email. */
  | "notTheirs";

/** The words the outcome says. */
type TicketReturnOutcomeCopy = {
  /** The badge: "Confirmed", "Not Paid", "Refunding". */
  status?: string;
  title: string;
  body: string;
  /** The quieter line under the body: the points waiting, where the refund
   * lands, the PDF that works at the door. */
  note?: string;
};

type TicketReturnOutcomeProps = {
  copy: TicketReturnOutcomeCopy;
  kind: TicketReturnOutcomeKind;
  /** The main act: Sign In with Email, Choose Again, Sign In with Another
   * Email. */
  act?: TicketAct;
  /** A quieter second act: Sign Out. */
  secondaryAct?: TicketAct;
  className?: string;
};

type Look = {
  icon: ComponentType<{ size?: number; className?: string }>;
  tile: string;
  tone: TicketTone;
};

const LOOK: Record<TicketReturnOutcomeKind, Look> = {
  paid: { icon: Check, tile: "bg-success-muted text-success", tone: "ok" },
  wentBack: {
    icon: ArrowUUpLeft,
    tile: "bg-muted text-secondary-foreground",
    tone: "plain",
  },
  holdRanOut: {
    icon: Clock,
    tile: "bg-muted text-secondary-foreground",
    tone: "plain",
  },
  paidTooLate: {
    icon: ArrowCounterClockwise,
    tile: "bg-warning-muted text-warning",
    tone: "warn",
  },
  otherBrowser: {
    icon: Envelope,
    tile: "bg-muted text-secondary-foreground",
    tone: "plain",
  },
  notTheirs: {
    icon: Lock,
    tile: "bg-muted text-secondary-foreground",
    tone: "plain",
  },
};

/**
 * What the order page says when a collector comes back from Stripe: a tinted
 * glyph, the badge, the heading and what happened, centred. Paid leads the
 * order's tickets; every other outcome stands alone and opens nothing of the
 * order: a copied link or another browser is asked to sign in with the
 * order's email.
 */
function TicketReturnOutcome({
  copy,
  kind,
  act,
  secondaryAct,
  className,
}: TicketReturnOutcomeProps) {
  const titleId = useId();
  const look = LOOK[kind];
  const Icon = look.icon;
  const note = copy.note ? (
    <p className="text-sm leading-5 text-secondary-foreground">{copy.note}</p>
  ) : null;
  /* Paid groups the points line with its sign-in act; elsewhere the note
   * belongs to the body above. */
  const noteWithActs = kind === "paid";
  return (
    <section
      aria-labelledby={titleId}
      className={cn(
        "flex flex-col items-center gap-4 px-2 pt-8 pb-2 text-center",
        className,
      )}
      data-kind={kind}
      data-slot="ticket-return-outcome"
    >
      <span
        aria-hidden
        className={cn(
          "grid size-14 place-items-center rounded-full",
          look.tile,
        )}
      >
        <Icon size={24} />
      </span>
      {copy.status ? (
        <TicketStatusBadge label={copy.status} tone={look.tone} />
      ) : null}
      <h1 className="text-2xl leading-8 font-bold text-balance" id={titleId}>
        {copy.title}
      </h1>
      <p className="text-base leading-6 text-balance">{copy.body}</p>
      {noteWithActs ? null : note}
      {act || secondaryAct || (noteWithActs && note) ? (
        <div className="flex w-full flex-col gap-3 pt-2">
          {noteWithActs ? note : null}
          {act ? <TicketActButton act={act} size="lg" /> : null}
          {secondaryAct ? (
            <TicketActButton act={secondaryAct} size="md" variant="ghost" />
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

export type {
  TicketReturnOutcomeCopy,
  TicketReturnOutcomeKind,
  TicketReturnOutcomeProps,
};
export { TicketReturnOutcome };
