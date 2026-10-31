import { Alert } from "@grade10/design-system/components/display/alert";
import { Badge } from "@grade10/design-system/components/display/badge";
import { Card } from "@grade10/design-system/components/display/card";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { toast } from "@grade10/design-system/components/overlays/toast";
import { cn } from "@grade10/design-system/lib/utils";
import {
  CalendarBlank,
  Check,
  Clock,
  Lightning,
  LinkBreak,
  LockSimple,
  MapPin,
  User,
  XCircle,
} from "@phosphor-icons/react";
import { QRCodeSVG } from "qrcode.react";
import { type ReactNode, useEffect, useRef } from "react";

/** What the link opens: the ticket, or why it opens none. */
type SharedTicketStatus =
  | "valid"
  | "cancelled"
  | "replaced"
  | "over"
  | "not_found";

/** A dead link's words: what happened, and what to do. */
type SharedTicketDeadCopy = { title: string; description: string };

type SharedTicketCopy = {
  /** The page's heading: "Your Ticket". */
  heading: string;
  /** The ticket's name for a screen reader: "Ticket TKF3H8-4". */
  ticketLabel: string;
  /** The QR code's name: "Ticket code TKF3H8-4". */
  codeLabel: string;
  /** Under the code: show it at the door, and what it admits. */
  codeLine: string;
  /** The badge on a ticket given at no charge. */
  free: string;
  downloadPdf: string;
  save: string;
  /** In place of Save once the ticket is on the viewer's account. */
  viewMyTickets: string;
  /** The saved toast's action, opening My Tickets: "View". */
  view: string;
  /** Who sent it, and that the link is the ticket. */
  privacy: string;
  cancelled: SharedTicketDeadCopy & { badge: string };
  over: SharedTicketDeadCopy & { badge: string };
  replaced: SharedTicketDeadCopy;
  notFound: SharedTicketDeadCopy;
};

/** The ticket as the link shows it, every line already in the reader's words. */
type SharedTicketView = {
  eventTitle: string;
  passName: string;
  /** "Sat 12 and Sun 13 Dec 2026". */
  days: string;
  /** "Doors 10:00 to 19:00". */
  doors: string;
  venue: string | null;
  /** "For Jamie Wong"; absent on a ticket that names nobody. */
  guest: string | null;
  /** "Fast Pass on 1 day"; absent where it carries none. */
  fastPass: string | null;
  /** The code read out under the QR: "TKF3H8-4". */
  code: string;
  /** The QR code's text, as the door reads it. */
  qrValue: string;
};

type SharedTicketProps = {
  copy: SharedTicketCopy;
  status: SharedTicketStatus;
  /** The ticket; a link that was replaced or names nothing shows none. A
   * cancelled or over link whose answer carries no event or pass passes
   * none too: the heading and why, with no card. */
  ticket: SharedTicketView | null;
  /** The ticket is on the signed-in viewer's account. */
  saved: boolean;
  /** "In Sat 12 Dec, 10:42. See you Sunday."; the code stays for the next day. */
  usedToday?: string | null;
  /** The PDF is being made. */
  downloading?: boolean;
  /** Saving, including the sign-in it may need, is under way. */
  saving?: boolean;
  /**
   * Said once as a toast with View, each time it changes: "Saved to My
   * Tickets" just after a save lands.
   */
  said?: string | null;
  onDownloadPdf: () => void;
  onSave: () => void;
  onViewMyTickets: () => void;
  /** The said toast closed, so the same words can be said again. */
  onSaidDismiss?: () => void;
};

const ICON = 16;

function Fact({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <span
        aria-hidden
        className="mt-0.5 inline-flex text-secondary-foreground"
      >
        {icon}
      </span>
      <span className="min-w-0">{children}</span>
    </li>
  );
}

/** The ticket's card: the event, the pass, its facts, and the code while it is live. */
function TicketCard({
  copy,
  ticket,
  badge,
  dimmed,
  usedToday,
}: {
  copy: SharedTicketCopy;
  ticket: SharedTicketView;
  badge: ReactNode;
  dimmed: boolean;
  usedToday?: string | null;
}) {
  return (
    <Card
      aria-label={copy.ticketLabel}
      className={cn(
        "gap-4 px-(--card-spacing) [--card-spacing:--spacing(5)]",
        dimmed && "opacity-60",
      )}
      data-slot="shared-ticket-card"
      role="region"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-0.5">
          <strong className="text-lg leading-7 font-bold">
            {ticket.eventTitle}
          </strong>
          <span className="text-base leading-6 font-medium">
            {ticket.passName}
          </span>
        </div>
        {badge}
      </div>
      <ul
        className={cn(
          "m-0 flex list-none flex-col gap-1.5 p-0 text-sm leading-5",
          !dimmed && "border-b border-border-subtle pb-4",
        )}
      >
        <Fact icon={<CalendarBlank size={ICON} />}>{ticket.days}</Fact>
        <Fact icon={<Clock size={ICON} />}>{ticket.doors}</Fact>
        {ticket.venue ? (
          <Fact icon={<MapPin size={ICON} />}>{ticket.venue}</Fact>
        ) : null}
        {ticket.guest ? (
          <Fact icon={<User size={ICON} />}>{ticket.guest}</Fact>
        ) : null}
        {ticket.fastPass ? (
          <Fact icon={<Lightning size={ICON} />}>{ticket.fastPass}</Fact>
        ) : null}
      </ul>
      {dimmed ? null : (
        <>
          {usedToday ? (
            <p
              className="m-0 flex items-start gap-2 rounded-xl bg-success-muted px-3 py-2.5 text-sm leading-5 font-medium"
              data-slot="shared-ticket-used-today"
              role="status"
            >
              <span aria-hidden className="mt-0.5 inline-flex text-success">
                <Check size={ICON} weight="bold" />
              </span>
              <span>{usedToday}</span>
            </p>
          ) : null}
          <span className="self-center rounded-xl border border-border-subtle bg-white p-3">
            <QRCodeSVG
              bgColor="#ffffff"
              className="block"
              fgColor="#000000"
              level="M"
              marginSize={0}
              role="img"
              size={220}
              title={copy.codeLabel}
              value={ticket.qrValue}
            />
          </span>
          <div className="flex flex-col items-center gap-1 text-center">
            <Text
              as="span"
              className="tracking-[0.08em]"
              face="mono"
              size="display"
              weight="bold"
            >
              {ticket.code}
            </Text>
            <span className="text-sm leading-5 text-secondary-foreground">
              {copy.codeLine}
            </span>
          </div>
        </>
      )}
    </Card>
  );
}

/** A link with nothing to open says why, with no code. */
function DeadLink({
  copy,
  icon,
}: {
  copy: SharedTicketDeadCopy;
  icon: ReactNode;
}) {
  return (
    <section
      className="flex flex-col items-center gap-3 px-2 pt-18 text-center"
      data-slot="shared-ticket-dead"
    >
      <span
        aria-hidden
        className="grid size-14 place-items-center rounded-full bg-muted text-secondary-foreground"
      >
        {icon}
      </span>
      <h1 className="m-0 text-2xl leading-8 font-bold">{copy.title}</h1>
      <p className="m-0 text-base leading-6 text-secondary-foreground">
        {copy.description}
      </p>
    </section>
  );
}

/** Toasts the said line once each time it changes, with View on it. */
function useSaidToast(
  said: string | null | undefined,
  view: string,
  onView: () => void,
  onDismiss: (() => void) | undefined,
) {
  const handlers = useRef({ onView, onDismiss });
  handlers.current = { onView, onDismiss };
  useEffect(() => {
    if (!said) return;
    const close = () => handlers.current.onDismiss?.();
    toast.success(said, {
      action: { label: view, onClick: () => handlers.current.onView() },
      onAutoClose: close,
      onDismiss: close,
    });
  }, [said, view]);
}

/**
 * A free ticket staff shared as a private link, opened at `/t/…`: the link is
 * the ticket, so it shows the event, the pass, the guest, Fast Pass and a
 * large QR code with no sign-in, offers its PDF and to save it to My Tickets,
 * and keeps the code after a day's entry for the pass's next day. A dead link
 * says why, with no code: cancelled, replaced by a new link, the event over,
 * or not found. Cancelled or over with no ticket to show says why under the
 * heading, without the greyed card.
 */
function SharedTicket({
  copy,
  status,
  ticket,
  saved,
  usedToday,
  downloading = false,
  saving = false,
  said,
  onDownloadPdf,
  onSave,
  onViewMyTickets,
  onSaidDismiss,
}: SharedTicketProps) {
  useSaidToast(said, copy.view, onViewMyTickets, onSaidDismiss);

  const ended = status === "cancelled" || status === "over";
  if (status === "replaced")
    return <DeadLink copy={copy.replaced} icon={<LinkBreak size={24} />} />;
  if (!ended && (status === "not_found" || !ticket))
    return <DeadLink copy={copy.notFound} icon={<XCircle size={24} />} />;

  const words = status === "cancelled" ? copy.cancelled : copy.over;

  return (
    <div className="flex flex-col gap-5" data-slot="shared-ticket">
      <h1 className="m-0 text-2xl leading-8 font-bold">{copy.heading}</h1>
      {ended ? (
        <>
          <Alert
            description={words.description}
            dismissible={false}
            status={status === "cancelled" ? "error" : "default"}
            title={words.title}
          />
          {ticket ? (
            <TicketCard
              badge={
                <Badge variant={status === "cancelled" ? "error" : "default"}>
                  {words.badge}
                </Badge>
              }
              copy={copy}
              dimmed
              ticket={ticket}
            />
          ) : null}
        </>
      ) : ticket ? (
        <>
          <TicketCard
            badge={<Badge variant="info">{copy.free}</Badge>}
            copy={copy}
            dimmed={false}
            ticket={ticket}
            usedToday={usedToday}
          />
          <div className="flex flex-col gap-3">
            <Button
              className="w-full"
              loading={downloading}
              onClick={onDownloadPdf}
              size="lg"
              type="button"
            >
              {copy.downloadPdf}
            </Button>
            {saved ? (
              <Button
                className="w-full"
                onClick={onViewMyTickets}
                size="lg"
                type="button"
                variant="outline"
              >
                {copy.viewMyTickets}
              </Button>
            ) : (
              <Button
                className="w-full"
                loading={saving}
                onClick={onSave}
                size="lg"
                type="button"
                variant="outline"
              >
                {copy.save}
              </Button>
            )}
          </div>
          <p className="m-0 flex items-start gap-2 text-sm leading-5 text-secondary-foreground">
            <span aria-hidden className="mt-0.5 inline-flex">
              <LockSimple size={ICON} />
            </span>
            <span>{copy.privacy}</span>
          </p>
        </>
      ) : null}
    </div>
  );
}

export type {
  SharedTicketCopy,
  SharedTicketDeadCopy,
  SharedTicketProps,
  SharedTicketStatus,
  SharedTicketView,
};
export { SharedTicket };
