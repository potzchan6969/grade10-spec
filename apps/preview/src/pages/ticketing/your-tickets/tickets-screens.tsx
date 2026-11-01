import { Toast, toast } from "@grade10/design-system/components/overlays/toast";
import { getMessages } from "@grade10/i18n";
import {
  MyTicketsList,
  type MyTicketsListState,
  SharedTicket,
  type SharedTicketStatus,
  SignInCard,
  SignInEmailForm,
  SignInLinkSent,
} from "@grade10/ui";
import { useEffect, useState } from "react";
import { TicketingSite } from "../ticketing-site";
import { T, t } from "../ticketing-words";
import {
  MY_ORDERS,
  MY_TICKETS_COPY,
  SHARED_COPY,
  SHARED_TICKET,
} from "./your-tickets-content";

const SIGN_IN = getMessages("grade10", "en").signIn;

export type YourTicketsState =
  | "list"
  | "backFromTheLink"
  | "signedOut"
  | "empty"
  | "loading"
  | "failed";

/** Your Tickets at `/tickets/orders`, the YourTickets board. Signed out,
 * Sign In with Email opens the site's emailed-link dialog. */
export function YourTicketsScreen({
  state,
  onOpenOrder = () => {},
}: {
  state: YourTicketsState;
  onOpenOrder?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");
  useEffect(() => {
    if (state !== "backFromTheLink") return;
    toast.success(T.myTickets.signedIn.title, {
      description: t(T.myTickets.signedIn.points, { points: 115 }),
    });
  }, [state]);

  const list: MyTicketsListState =
    state === "signedOut"
      ? { status: "signedOut" }
      : state === "loading"
        ? { status: "loading" }
        : state === "failed"
          ? { status: "error" }
          : {
              status: "ready",
              orders:
                state === "empty"
                  ? []
                  : MY_ORDERS.map((order) => ({
                      ...order,
                      act: { label: order.act.label, onClick: onOpenOrder },
                    })),
            };

  return (
    <TicketingSite session={state === "signedOut" ? "signed-out" : "signed-in"}>
      <div className="mx-auto box-border w-full max-w-[720px] px-4 pt-5 pb-12">
        <MyTicketsList
          browseHref="/shows"
          copy={MY_TICKETS_COPY}
          onRetry={() => {}}
          onSignIn={() => setOpen(true)}
          state={list}
        />
      </div>
      <SignInCard
        copy={{
          title: sent ? SIGN_IN.linkSentTitle : T.myTickets.signedOut.title,
          description: sent ? undefined : T.myTickets.signedOut.body,
        }}
        onOpenChange={setOpen}
        open={open}
      >
        {sent ? (
          <SignInLinkSent
            copy={{
              message: SIGN_IN.linkSentMessage,
              resend: SIGN_IN.resendLabel,
              resendCountdown: t(SIGN_IN.resendCountdown, { seconds: 45 }),
            }}
            email={email}
            onResend={() => {}}
            resendCooldownRemaining={45}
          />
        ) : (
          <SignInEmailForm
            copy={{
              email: SIGN_IN.emailLabel,
              emailPlaceholder: SIGN_IN.emailPlaceholder,
              submit: SIGN_IN.sendLinkLabel,
            }}
            email={email}
            onEmailChange={setEmail}
            onSubmit={() => setSent(true)}
          />
        )}
      </SignInCard>
      <Toast position="bottom-right" />
    </TicketingSite>
  );
}

export type SharedTicketState =
  | "valid"
  | "saved"
  | "usedToday"
  /** Cancelled or over, and the answer names no event or pass. */
  | "cancelledNoTicket"
  | "overNoTicket"
  | Exclude<SharedTicketStatus, "valid">;

/** A free ticket's own link, `/t/:token`, the FreeTicketPhone board. Save
 * puts it on the viewer's account and says so. */
export function SharedTicketScreen({
  state,
  onViewMyTickets = () => {},
}: {
  state: SharedTicketState;
  onViewMyTickets?: () => void;
}) {
  const [saved, setSaved] = useState(state === "saved");
  const [said, setSaid] = useState<string | null>(null);
  const status: SharedTicketStatus =
    state === "saved" || state === "usedToday"
      ? "valid"
      : state === "cancelledNoTicket"
        ? "cancelled"
        : state === "overNoTicket"
          ? "over"
          : state;
  const ticket =
    state === "replaced" ||
    state === "not_found" ||
    state === "cancelledNoTicket" ||
    state === "overNoTicket"
      ? null
      : SHARED_TICKET;
  const copy =
    state === "overNoTicket"
      ? {
          ...SHARED_COPY,
          over: {
            ...SHARED_COPY.over,
            title: T.sharedTicket.dead.overNoEvent.title,
          },
        }
      : SHARED_COPY;
  return (
    <TicketingSite session={saved ? "signed-in" : "signed-out"}>
      <div className="mx-auto box-border w-full max-w-[520px] px-4 pt-5 pb-12">
        <SharedTicket
          copy={copy}
          onDownloadPdf={() => {}}
          onSaidDismiss={() => setSaid(null)}
          onSave={() => {
            setSaved(true);
            setSaid(T.sharedTicket.saved);
          }}
          onViewMyTickets={onViewMyTickets}
          said={said}
          saved={saved}
          status={status}
          ticket={ticket}
          usedToday={
            state === "usedToday"
              ? t(T.sharedTicket.usedToday, { time: "10:42", day: "tomorrow" })
              : null
          }
        />
      </div>
      <Toast position="bottom-center" />
    </TicketingSite>
  );
}
